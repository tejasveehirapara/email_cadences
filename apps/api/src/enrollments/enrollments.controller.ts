import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateCadenceDto } from './dto/update-cadence.dto';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  create(@Body() dto: CreateEnrollmentDto) {
    return this.enrollmentsService.createEnrollment(
      dto.cadenceId,
      dto.contactEmail,
    );
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.enrollmentsService.getEnrollment(id);
  }

  @Get()
  getAll() {
    return this.enrollmentsService.getEnrollments();
  }

  @Post(':id/update-cadence')
  updateCadence(
    @Param('id') id: string,
    @Body() dto: UpdateCadenceDto,
  ) {
    return this.enrollmentsService.updateCadence(id, dto.steps);
  }
}