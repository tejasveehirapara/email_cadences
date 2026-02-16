import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { CadenceService } from './cadence.service';
import { CreateCadenceDto } from './dto/create-cadence.dto';

@Controller('cadences')
export class CadenceController {
  constructor(private readonly cadenceService: CadenceService) { }

  @Post()
  create(@Body() dto: CreateCadenceDto) {

    return this.cadenceService.createCadence(dto);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.cadenceService.getCadenceById(id);
  }

  @Get()
  getAll() {
    return this.cadenceService.getAllCadences();
  }


  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateCadenceDto>,
  ) {
    return this.cadenceService.updateCadence(id, dto);
  }

}