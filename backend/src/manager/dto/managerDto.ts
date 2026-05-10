import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

const Role = {
  OWNER: 'OWNER',
  INSTRUCTOR: 'INSTRUCTOR',
  GUARDIAN: 'GUARDIAN',
};

type Role = (typeof Role)[keyof typeof Role];

export class registerManagerCredentials {
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

  @ApiProperty({
    enum: Object.values(Role),
    example: Role.INSTRUCTOR,
  })
  @IsString()
  role: Role;
}

export class ManagerInfoDto {
  @ApiProperty({
    description: 'primary key',
    example: 'cmkv7yhjs0000hwjmuo9c1c2h',
  })
  id: string;

  @ApiProperty({
    example: 'david@exemple.fr',
  })
  @IsEmail({}, { message: 'Email invalide' })
  @MaxLength(64, {
    message: "L'Email doit contenir au plus 64 caractères",
  })
  email: string;
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

  @ApiProperty({
    enum: Object.values(Role),
    example: Role.INSTRUCTOR,
  })
  role: string;
}

export class ManagerDtoOpt {
  @ApiProperty({
    description: 'primary key',
    example: 'cmkv7yhjs0000hwjmuo9c1c2h',
  })
  @IsOptional()
  id?: string;

  @ApiProperty({
    example: 'david@exemple.fr',
  })
  @IsEmail({}, { message: 'Email invalide' })
  @MaxLength(64, {
    message: "L'Email doit contenir au plus 64 caractères",
  })
  @IsOptional()
  email?: string;

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
  @IsOptional()
  password?: string;

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
  @IsOptional()
  firstName?: string;

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
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    enum: Object.values(Role),
    example: Role.INSTRUCTOR,
  })
  @IsOptional()
  role?: string;
}
