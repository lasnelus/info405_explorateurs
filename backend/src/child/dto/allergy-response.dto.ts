import { ApiProperty } from '@nestjs/swagger';

export class AllergyResponseDto {
  @ApiProperty({ example: 'allergy123' })
  id: string;

  @ApiProperty({ example: 'ckx123abc456' })
  childId: string;
}
