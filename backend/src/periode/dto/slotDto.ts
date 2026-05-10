import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

class ChildInfoInSlotOrQueue {
  @ApiProperty({
    description: 'primary key',
    example: 'cmkv7yhjs0000hwjmuo9c1c2h',
  })
  id: string;

  @ApiProperty({ example: 'David' })
  firstName: string;

  @ApiProperty({ example: 'MALABRE' })
  lastName: string;
}
export class SlotInfoDto {
  @ApiProperty({
    description: 'primary key',
    example: 'cmkv7yhjs0000hwjmuo9c1c2h',
  })
  id: string;

  @ApiProperty({ type: () => ChildInfoInSlotOrQueue })
  child: ChildInfoInSlotOrQueue;

  @ApiProperty({
    description: 'Id of the periode linked',
    example: 'cmkv7yhjs0000hfjmuo9c1c2h',
  })
  periodeId: string;

  @ApiProperty({
    example: '2026-02-13',
    description: 'Day choose of the periode',
  })
  day: Date;

  @ApiProperty({
    example: false,
    description: 'to take attendance',
  })
  isChildPresent: boolean;
}

export class attendanceDto {
  @ApiProperty({
    example: false,
    description: 'to take attendance',
  })
  @IsBoolean()
  isChildPresent: boolean;
}
