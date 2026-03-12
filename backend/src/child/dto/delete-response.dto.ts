import { ApiProperty } from '@nestjs/swagger';

export class DeleteResponseDto {
  @ApiProperty({ example: 'Child with id ckx123abc456 deleted successfully.' })
  message: string;
}
