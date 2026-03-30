import { ApiProperty } from '@nestjs/swagger';

export class SlotInfoDto {
  @ApiProperty({
    description: 'primary key',
    example: 'cmkv7yhjs0000hwjmuo9c1c2h',
  })
  id: string;

  @ApiProperty({
    description: 'Id of the child registered',
    example: 'cmkv7yhjs1000hwjmuo9c1c2h',
  })
  childId: string;

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
}
