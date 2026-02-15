import { Controller, Post, Body } from '@nestjs/common';
import { CadenceService } from './cadence.service';
import { CreateCadenceDto } from './dto/create-cadence.dto';

@Controller('cadences')
export class CadenceController {
  constructor(private readonly cadenceService: CadenceService) {}

  @Post()
  create(@Body() dto: CreateCadenceDto) {
    console.log(dto, "DTO")
    return this.cadenceService.createCadence(dto);
  }
}