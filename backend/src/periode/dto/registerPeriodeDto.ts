import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Child to register',
    example: 'cmkv7yhjs0000hwjmuo9c1c2h',
  })
  @IsString()
  @IsNotEmpty()
  childId: string;

  @ApiProperty({
    example: '2026-04-01',
    description: 'Date du jour au format ISO 8601',
  })
  @IsDateString({}, { message: 'La date doit être valide (ISO 8601)' })
  @IsNotEmpty()
  date: string;
}

export enum stateRegisterPeriode {
  ACCEPTED,
  IN_QUEUE,
}

export class RegisterInfoDto {
  @IsEnum(stateRegisterPeriode)
  @ApiProperty({
    example: 'ACCEPTED',
  })
  state: stateRegisterPeriode;
}
