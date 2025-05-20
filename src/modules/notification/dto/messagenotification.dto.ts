import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { NotificationType } from '../enum/enum';

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

  @IsString()
  otherId: string;

  @IsNotEmpty()
  @IsString()
  notificationType: NotificationType;
}
