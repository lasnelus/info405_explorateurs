import { ApiProperty } from '@nestjs/swagger';

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

export class QueueInfoDto {
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
    enum: ['PENDING', 'ACCEPTED', 'TIMEOUT'],
    description: 'PENDING',
  })
  state: QueueState;

  @ApiProperty({
    example: '2026-03-30T13:39:59.850Z',
    description: "date when child's state switch to ACCEPTED ",
  })
  acceptedAt: Date | null;
}

export const QueueState = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  TIMEOUT: 'TIMEOUT',
};

export type QueueState = (typeof QueueState)[keyof typeof QueueState];
