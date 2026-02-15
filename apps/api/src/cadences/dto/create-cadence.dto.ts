import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CadenceStepDto {
  @IsString()
  type!: string;

  delay!: number;

  @IsString()
  templateId!: string;
}

export class CreateCadenceDto {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CadenceStepDto)
  steps!: CadenceStepDto[];
}