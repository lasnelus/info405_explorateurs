import { ApiProperty } from '@nestjs/swagger';
import { FoodConstraint } from '@prisma/client';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class AddChildDto {
  @ApiProperty({ example: 'Tom' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Martin' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '2016-01-26T11:58:55.000Z' })
  @IsDateString()
  birthDate: string;

  @ApiProperty({
    enum: FoodConstraint,
    example: FoodConstraint.NONE,
    required: false,
  })
  @IsOptional()
  @IsEnum(FoodConstraint)
  foodConstraint?: FoodConstraint;

  @ApiProperty({
    example: [],
    required: false,
  })
  @IsOptional()
  @IsArray()
  familyIds?: string[];
}
