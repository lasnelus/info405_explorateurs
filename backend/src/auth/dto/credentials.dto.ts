import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CredentialsDto {
  @IsEmail()
  @IsNotEmpty({ message: "l'email est requis" })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  password: string;
}
