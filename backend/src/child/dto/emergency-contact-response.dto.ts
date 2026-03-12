import { ApiProperty } from '@nestjs/swagger';

export class EmergencyContactResponseDto {
  @ApiProperty({ example: 'con123' })
  id: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: '1234567890' })
  phoneNumber: string;

  @ApiProperty({ example: 'ckx123abc456' })
  childId: string;
}
