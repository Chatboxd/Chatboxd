
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LogUserDto {
  @IsEmail(
    {},
    {
        message: 'Vous devez fournir une adresse email valide.',
    },
  )
  email: string;

  @IsNotEmpty()
  @MinLength(6,{
    message:"Votre mot de passe doit faire plus de 6 caractères."
  })
  password: string;

}
