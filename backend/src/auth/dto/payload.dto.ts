import { ApiProperty } from '@nestjs/swagger';
import { Role } from './payload';

export class RoleResponseDto {
  @ApiProperty({
    enum: Object.values(Role),
    example: Role.GUARDIAN,
  })
  role: Role;
}

export class accessTokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWxsNDF5NmkwMDAwM21qbWJjbHh6OXF5Iiwicm9sZSI6IkdVQVJESUFOIiwiaWF0IjoxNzcxNzczNDkzLCJleHAiOjE3NzE3NzQzOTN9.Q8YLQNyja1GQfvR-Kc3HhU_BplmNb1J58Mca-xrPTtk',
    description: 'new generated access token',
  })
  accessToken: string;
}
