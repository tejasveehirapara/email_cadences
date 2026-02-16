import { Injectable, NotFoundException } from '@nestjs/common';
import { Client, Connection } from '@temporalio/client';
import { randomUUID } from 'crypto';

@Injectable()
export class EnrollmentsService {
  private temporalClient = new Client({
    connection: Connection.lazy({
      address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
    }),
    namespace: process.env.TEMPORAL_NAMESPACE || 'default',
  });

  // In-memory DB (assessment-friendly)
  private enrollments = new Map<string, any>();

  async createEnrollment(cadenceId: string, contactEmail: string) {
    const id = randomUUID();

    const handle = await this.temporalClient.workflow.start('cadenceWorkflow', {
      args: [{ cadenceId, contactEmail }],
      taskQueue: process.env.TEMPORAL_TASK_QUEUE || 'cadence-queue',
      workflowId: id,
    });

    const enrollment = {
      id,
      cadenceId,
      contactEmail,
      workflowId: handle.workflowId,
      runId: handle.firstExecutionRunId,
      status: 'RUNNING',
    };

    this.enrollments.set(id, enrollment);

    return enrollment;
  }

  async getEnrollment(id: string) {
    const enrollment = this.enrollments.get(id);
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    const handle = this.temporalClient.workflow.getHandle(enrollment.workflowId);

    try {
      const state = await handle.query<any>('getState');

      return {
        ...enrollment,
        ...(state as object),
      };
    } catch (err) {
      return {
        ...enrollment,
        status: 'UNKNOWN',
      };
    }
  }


  async getEnrollments() {
    return Array.from(this.enrollments.values());
  }

  async updateCadence(id: string, steps: any[]) {
    const enrollment = this.enrollments.get(id);
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    const handle = this.temporalClient.workflow.getHandle(enrollment.workflowId);

    await handle.signal('updateCadence', steps);

    return {
      message: 'Cadence update signal sent',
      stepsVersionIncremented: true,
    };
  }
}