import { ApiProperty } from '@nestjs/swagger';

export class AddEmergencyContactDto {
  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: '1234567890' })
  phoneNumber: string;
}
