import { ApiProperty } from '@nestjs/swagger';

export class FamilyResponseDto {
  @ApiProperty({ example: 'fam123' })
  id: string;

  @ApiProperty({ example: 'Martin Family' })
  name: string;
}

export class SlotResponseDto {
  @ApiProperty({ example: 'slot123' })
  id: string;

  @ApiProperty({ example: 'periode123' })
  periodeId: string;
}

export class QueueResponseDto {
  @ApiProperty({ example: 'queue123' })
  id: string;

  @ApiProperty({ enum: ['PENDING', 'ACCEPTED', 'TIMEOUT'], example: 'PENDING' })
  state: string;

  @ApiProperty({ example: 'periode123' })
  periodeId: string;
}

export class ChildResponseDto {
  @ApiProperty({ example: 'ckx123abc456' })
  id: string;

  @ApiProperty({ example: 'Tom' })
  firstName: string;

  @ApiProperty({ example: 'Martin' })
  lastName: string;

  @ApiProperty({ type: [FamilyResponseDto] })
  families: FamilyResponseDto[];

  @ApiProperty({ type: [SlotResponseDto] })
  slots: SlotResponseDto[];

  @ApiProperty({ type: [QueueResponseDto] })
  queues: QueueResponseDto[];

  @ApiProperty({ example: '2026-01-26T11:58:55.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-01-26T12:10:12.000Z' })
  updatedAt: Date;
}
