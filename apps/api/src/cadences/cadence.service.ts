import { Injectable, BadRequestException } from '@nestjs/common';
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

  getCadence(id: string) {
    return this.cadences.get(id);
  }
}