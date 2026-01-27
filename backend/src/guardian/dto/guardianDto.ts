import { ApiProperty } from '@nestjs/swagger';

export class guardianInfoDto {
  @ApiProperty({
    description: 'primary key',
    example: 'cmkv7yhjs0000hwjmuo9c1c2h',
  })
  id: string;
  @ApiProperty({
    description: "guardian's email",
    example: 'contact@example.fr',
  })
  email: string;
  @ApiProperty({
    description: "guardian's firstname",
    example: 'Jean',
  })
  firstName: string;
  @ApiProperty({
    description: "guardian's lastname",
    example: 'MALABRE',
  })
  lastName: string;
  @ApiProperty({
    description: "guardian's account creation date",
    example: '2026-01-26T13:44:34.479Z',
  })
  createdAt: Date;
  @ApiProperty({
    description: "guardian's account last update",
    example: '2026-01-28T13:44:34.479Z',
  })
  updatedAt: Date;
  @ApiProperty({
    description: "guardian's families",
    example: [],
  })
  families: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
  }[];
}
