import { ApiProperty } from '@nestjs/swagger';
import { FoodConstraint } from '@prisma/client';

export class AddChildDto {
  @ApiProperty({ example: 'Tom' })
  firstName: string;

  @ApiProperty({ example: 'Martin' })
  lastName: string;

  @ApiProperty({ example: '2016-01-26T11:58:55.000Z' })
  birthDate: string; // ISO string

  @ApiProperty({
    enum: FoodConstraint,
    example: FoodConstraint.NONE,
    required: false,
  })
  foodConstraint?: FoodConstraint;

  @ApiProperty({ example: ['fam123', 'fam456'], required: false })
  familyIds?: string[];
}
