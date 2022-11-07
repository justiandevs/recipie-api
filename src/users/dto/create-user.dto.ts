import { IsEmail, IsString, Length, Max, Min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(4, 64)
  name: string;

  @IsString()
  @Length(8, 64)
  password: string;

  @IsEmail()
  email: string;

  refreshToken: string;
  identifier: string;
}
