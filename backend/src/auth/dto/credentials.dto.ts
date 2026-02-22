import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CredentialsDto {
  @ApiProperty({
    example: 'david@exemple.com',
  })
  @IsEmail()
  @IsNotEmpty({ message: "l'email est requis" })
  email: string;

  @ApiProperty({
    example: 'sd@pRKT#AyBY8FFD',
  })
  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  password: string;
}
