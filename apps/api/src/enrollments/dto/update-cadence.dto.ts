import { IsArray } from 'class-validator';

export class UpdateCadenceDto {
  @IsArray()
  steps!: any[];
}