import { IsString, Length } from 'class-validator';

export class AuthDto {
  @IsString()
  @Length(4, 64)
  name: string;

  @IsString()
  @Length(8, 64)
  password: string;
}
