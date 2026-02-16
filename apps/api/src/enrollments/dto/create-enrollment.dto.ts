import { IsString, IsEmail } from 'class-validator';

export class CreateEnrollmentDto {
  @IsString()
  cadenceId!: string;

  @IsEmail()
  contactEmail!: string;
}