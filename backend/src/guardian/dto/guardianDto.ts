import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class guardianInfoDto {
  @ApiProperty({
    description: 'primary key',
    example: 'cmkv7yhjs0000hwjmuo9c1c2h',
  })
  id: string;
  @ApiProperty({
    description: "guardian's email",
    example: 'contact@example.fr',
  })
  email: string;
  @ApiProperty({
    description: "guardian's firstname",
    example: 'Jean',
  })
  firstName: string;
  @ApiProperty({
    description: "guardian's lastname",
    example: 'MALABRE',
  })
  lastName: string;
  @ApiProperty({
    description: "guardian's account creation date",
    example: '2026-01-26T13:44:34.479Z',
  })
  createdAt: Date;
  @ApiProperty({
    description: "guardian's account last update",
    example: '2026-01-28T13:44:34.479Z',
  })
  updatedAt: Date;

  @ApiProperty({ type: () => [FamilyGuardianDto] })
  families: FamilyGuardianDto[];
}

class FamilyGuardianDto {
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
}

export class registerGuardianCredentials {
  @ApiProperty({
    example: 'david@exemple.fr',
  })
  @IsEmail({}, { message: 'Email invalide' })
  @MaxLength(64, {
    message: "L'Email doit contenir au plus 64 caractères",
  })
  email: string;

  @ApiProperty({
    example: 'sd@pRKT#AyBY8FFD',
  })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  @MaxLength(32, {
    message: 'Le mot de passe doit contenir au plus 32 caractères',
  })
  password: string;

  @ApiProperty({
    example: 'Gerald',
  })
  @IsString()
  @MaxLength(80, {
    message: 'Le prénom doit contenir au plus 80 caractères',
  })
  @Matches(/^[A-Za-zÀ-ÖØ-öø-ÿ'-]+$/, {
    message: 'Le prénom contient des caractères non autorisés !',
  })
  firstName: string;

  @ApiProperty({
    example: 'Kant',
  })
  @IsString()
  @MaxLength(100, {
    message: 'Le nom de famille doit contenir au plus 100 caractères',
  })
  @Matches(/^[A-Za-zÀ-ÖØ-öø-ÿ'-]+$/, {
    message: 'Le nom contient des caractères non autorisés !',
  })
  lastName: string;
}
