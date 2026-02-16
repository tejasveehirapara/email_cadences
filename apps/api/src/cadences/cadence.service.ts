import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateCadenceDto } from './dto/create-cadence.dto';

@Injectable()
export class CadenceService {
  private cadences = new Map<string, CreateCadenceDto>();

  createCadence(dto: CreateCadenceDto) {
    if (this.cadences.has(dto.id)) {
      throw new BadRequestException('Cadence ID already exists');
    }

    this.cadences.set(dto.id, dto);
    console.log(dto, "dtodto")
    return {
      success: true,
      data: dto,
    };
  }

  getCadenceById(id: string) {
    const cadence = this.cadences.get(id);

    if (!cadence) {
      throw new NotFoundException('Cadence not found');
    }

    return {
      success: true,
      data: cadence,
    };
  }

  getAllCadences() {
    return {
      success: true,
      data: Array.from(this.cadences.values()),
    };
  }

  updateCadence(id: string, dto: Partial<CreateCadenceDto>) {
    const existing = this.cadences.get(id);

    if (!existing) {
      throw new NotFoundException('Cadence not found');
    }

    const updated = {
      ...existing,
      ...dto,
      id, // ensure ID never changes
    };

    this.cadences.set(id, updated);

    return {
      success: true,
      data: updated,
    };
  }
}