import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageNotificationDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsNotEmpty()
  @IsString()
  user: string;

  @IsNotEmpty()
  @IsString()
  userType: string;

  // @IsNotEmpty()
  // @IsBoolean()
  // read: boolean;
}
