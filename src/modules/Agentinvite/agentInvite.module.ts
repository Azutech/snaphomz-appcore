import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from 'src/services/email/email.module';
import { AgentInvite, AgentInviteSchema } from './schema/agentInvite.schema';
import { InviteService } from './agentInvite.service';
import { Agent, AgentSchema } from '../agent/schema/agent.schema';
import { InviteController } from './agentInvite.controller';
import { UserSchema, User } from '../users/schema/user.schema';
import NotificationService from '../notification/notitifcation.service';
// import { Notification, NotificationSchema } from '../notification/schema/notification.schema';
// import { UserNotificationTokens, UserNotificationTokensSchema } from '../notification/schema/userNotificationsTokens.schema';
// import { NotificationGateway } from '../notification/notification.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Agent.name, schema: AgentSchema },
      { name: User.name, schema: UserSchema },
      { name: AgentInvite.name, schema: AgentInviteSchema },
      // { name: Notification.name, schema: NotificationSchema },
      // { name: UserNotificationTokens.name, schema: UserNotificationTokensSchema },
    ]),
    EmailModule,
  ],
  controllers: [InviteController],
  providers: [InviteService],
})
export class InviteModule {}
