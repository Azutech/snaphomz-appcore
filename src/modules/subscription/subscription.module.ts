import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionController } from './subscription.controller.';
import { SubscriptionService } from './subscription.service';
import { Plan, PlanSchema } from './schema/plan.schema';
import { User, UserSchema } from '../users/schema/user.schema';
import { SubscriptionSchema, Subscription } from './schema/subscription.schema';
import { StripeModule } from 'src/services/stripe/stripe.module';
import { AgentSchema, Agent } from '../agent/schema/agent.schema';
import NotificationService from '../notification/notitifcation.service';
import { EmailService } from 'src/services/email/email.service';
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
      { name: Plan.name, schema: PlanSchema },
      { name: User.name, schema: UserSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: Agent.name, schema: AgentSchema },
      { name: Notification.name, schema: NotificationSchema },
      {
        name: UserNotificationTokens.name,
        schema: UserNotificationTokensSchema,
      },
    ]),
    StripeModule,
  ],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    NotificationService,
    EmailService,
    NotificationGateway,
  ],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
