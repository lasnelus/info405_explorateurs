import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class FamilyDto {
  @ApiProperty({
    description: 'primary key',
    example: 'cmkv7yhjs0000hwjmuo9c1c2h',
  })
  id: string;

  @ApiProperty({
    description: "family's name",
    example: 'MALABRE',
  })
  name: string;
  @ApiProperty({
    description: "family's creation date",
    example: '2026-01-26T13:44:34.479Z',
  })
  createdAt: Date;
  @ApiProperty({
    description: "family's last update",
    example: '2026-01-28T13:44:34.479Z',
  })
  updatedAt: Date;

  @ApiProperty({ type: () => [GuardianFamilyDto] })
  guardians: GuardianFamilyDto[];

  @ApiProperty({ type: () => [ChildFamilyDto] })
  childs: ChildFamilyDto[];
}

class GuardianFamilyDto {
  @ApiProperty({
    description: 'guardian id',
    example: 'cmkv7yhjs0000hwjmuo9c1c2h',
  })
  id: string;

  @ApiProperty({ example: 'Jean' })
  firstName: string;

  @ApiProperty({ example: 'Dupont' })
  lastName: string;
}

class ChildFamilyDto {
  @ApiProperty({
    description: 'child id',
    example: 'cmkv7yhjs0000hwjmuo9c1c2h',
  })
  id: string;

  @ApiProperty({ example: 'Lucas' })
  firstName: string;

  @ApiProperty({ example: 'MOIROUD' })
  lastName: string;
}

export class FamilyCreationDto {
  @ApiProperty({
    description: "family's name",
    example: 'MALABRE',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(80, {
    message: 'Le nom doit contenir au plus 80 caractères',
  })
  @MinLength(1, {
    message: 'Le nom doit contenir au moins 1 caractères',
  })
  @Matches(/^[A-Za-zÀ-ÖØ-öø-ÿ'-]+$/, {
    message: 'Le nom contient des caractères non autorisés !',
  })
  name: string;

  @ApiProperty({
    example: 'cmkv7yhjs0000hwjmuo9c1c2h',
  })
  @IsOptional()
  guardianId?: string;
}
