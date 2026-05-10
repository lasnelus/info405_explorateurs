import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  Min,
  IsDateString,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreatePeriodeDto {
  @ApiProperty({
    description: 'title',
    example: 'Christmas 2025',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'title',
    example: 'Periode for Christams 2025 will be so fun with best activites !',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 6,
    description: 'Age minimum requis pour participer à la période',
  })
  @IsInt({ message: "L'âge minimum doit être un entier" })
  ageMin: number;

  @ApiProperty({
    example: 10,
    description: 'Age maximum autorisé pour participer à la période',
  })
  @IsInt({ message: "L'âge maximum doit être un entier" })
  ageMax: number;

  @ApiProperty({
    example: 20,
    description: 'Nombre maximum d’enfants pouvant s’inscrire à la période',
  })
  @IsInt({ message: 'La capacité doit être un entier' })
  @Min(1, { message: 'La capacité doit être au moins 1' })
  capacity: number;

  @ApiProperty({
    example: '2026-01-28T23:00:00.000Z',
    description: 'Première date de la période',
  })
  @IsDateString({}, { message: 'firstDay doit être une date valide' })
  firstDay: string;

  @ApiProperty({
    example: '2026-02-13T23:00:00.000Z',
    description: 'Dernière date de la période',
  })
  @IsDateString({}, { message: 'lastDay doit être une date valide' })
  lastDay: string;
}

export class PeriodeDtoOpt {
  @ApiProperty({
    description: 'primary key',
    example: 'cmkv7yhjs0000hwjmuo9c1c2h',
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: 'title',
    example: 'Christmas 2025',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'title',
    example: 'Periode for Christams 2025 will be so fun with best activites !',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 6,
    description: 'Age minimum requis pour participer à la période',
  })
  @IsInt({ message: "L'âge minimum doit être un entier" })
  @IsOptional()
  ageMin?: number;

  @ApiProperty({
    example: 10,
    description: 'Age maximum autorisé pour participer à la période',
  })
  @IsInt({ message: "L'âge maximum doit être un entier" })
  @IsOptional()
  ageMax?: number;

  @ApiProperty({
    example: 20,
    description: 'Nombre maximum d’enfants pouvant s’inscrire à la période',
  })
  @IsInt({ message: 'La capacité doit être un entier' })
  @Min(1, { message: 'La capacité doit être au moins 1' })
  @IsOptional()
  capacity?: number;

  @ApiProperty({
    example: '2026-01-28T23:00:00.000Z',
    description: 'Première date de la période',
  })
  @IsDateString({}, { message: 'firstDay doit être une date valide' })
  @IsOptional()
  firstDay?: string;

  @ApiProperty({
    example: '2026-02-13T23:00:00.000Z',
    description: 'Dernière date de la période',
  })
  @IsDateString({}, { message: 'lastDay doit être une date valide' })
  @IsOptional()
  lastDay?: string;
}

export class PeriodeInfoDto {
  @ApiProperty({
    description: 'title',
    example: 'Christmas 2025',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'title',
    example: 'Periode for Christams 2025 will be so fun with best activites !',
  })
  @IsString()
  @IsOptional()
  description: string | null;

  @ApiProperty({
    description: 'primary key',
    example: 'cmkv7yhjs0000hwjmuo9c1c2h',
  })
  id: string;

  @ApiProperty({
    example: 6,
    description: 'Age minimum requis pour participer à la période',
  })
  @IsInt({ message: "L'âge minimum doit être un entier" })
  ageMin: number;

  @ApiProperty({
    example: 10,
    description: 'Age maximum autorisé pour participer à la période',
  })
  @IsInt({ message: "L'âge maximum doit être un entier" })
  ageMax: number;

  @ApiProperty({
    example: 20,
    description: 'Nombre maximum d’enfants pouvant s’inscrire à la période',
  })
  @IsInt({ message: 'La capacité doit être un entier' })
  @Min(1, { message: 'La capacité doit être au moins 1' })
  capacity: number;

  @ApiProperty({
    example: '2026-01-28',
    description: 'Première date de la période',
  })
  firstDay: Date;

  @ApiProperty({
    example: '2026-02-13',
    description: 'Dernière date de la période',
  })
  lastDay: Date;
}
