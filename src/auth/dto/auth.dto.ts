import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(7)
  password: string;
}
