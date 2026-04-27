import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AddAllergyDto {
  @ApiProperty({ example: 'Pollen' })
  @IsString()
  @IsNotEmpty()
  allergy: string;
}
