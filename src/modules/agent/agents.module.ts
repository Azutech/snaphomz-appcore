import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from 'src/services/email/email.module';
import { AgentSchema, Agent } from './schema/agent.schema';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';
import { User, UserSchema } from '../users/schema/user.schema';
import { Property, PropertySchema } from '../property/schema/property.schema';
import { AgentOrSellerSocketAuthGuard } from 'src/guards/jw.socket.gaurd';
import NotificationService from '../notification/notitifcation.service';
import {
  Notification,
  NotificationSchema,
} from '../notification/schema/notification.schema';
import {
  UserNotificationTokens,
  UserNotificationTokensSchema,
} from '../notification/schema/userNotificationsTokens.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Agent.name, schema: AgentSchema },
      { name: User.name, schema: UserSchema },
      { name: Property.name, schema: PropertySchema },
      { name: Notification.name, schema: NotificationSchema },
      {
        name: UserNotificationTokens.name,
        schema: UserNotificationTokensSchema,
      },
    ]),
    EmailModule,
  ],
  controllers: [AgentsController],
  providers: [AgentsService, AgentOrSellerSocketAuthGuard, NotificationService],
})
export class AgentsModule {}
