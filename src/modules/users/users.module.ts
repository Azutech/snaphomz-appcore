import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { UsersService } from './users.service';
import { EmailModule } from 'src/services/email/email.module';
import { UserDocumentSchema, UserDocument } from './schema/user_documents';
import { EmailService } from 'src/services/email/email.service';
import { AgentOrSellerSocketAuthGuard } from 'src/guards/jw.socket.gaurd';
import { Agent } from 'http';
import { AgentSchema } from '../agent/schema/agent.schema';
import NotificationService from '../notification/notitifcation.service';
import {
  Notification,
  NotificationSchema,
} from '../notification/schema/notification.schema';
import {
  UserNotificationTokens,
  UserNotificationTokensSchema,
} from '../notification/schema/userNotificationsTokens.schema';
import { NotificationGateway } from '../notification/notification.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserDocument.name, schema: UserDocumentSchema },
      { name: Agent.name, schema: AgentSchema },
      { name: Notification.name, schema: NotificationSchema },
      {
        name: UserNotificationTokens.name,
        schema: UserNotificationTokensSchema,
      },
    ]),
    EmailModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    EmailService,
    NotificationService,
    NotificationGateway,
    AgentOrSellerSocketAuthGuard,
  ],
})
export class UsersModule {}
