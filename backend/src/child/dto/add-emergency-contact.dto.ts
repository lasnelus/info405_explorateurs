import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddEmergencyContactDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  phoneNumber: string;
}
