import { Module } from '@nestjs/common';
import { PropertyController } from './property.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertyService } from './property.service';
import {
  PropertyQuery,
  PropertyQuerySchema,
} from './schema/propertyQuery.schema';
import { User, UserSchema } from '../users/schema/user.schema';
import { Property, PropertySchema } from './schema/property.schema';
import { Agent, AgentSchema } from '../agent/schema/agent.schema';
import { PropertyTourSchema, PropertyTour } from './schema/propertyTour.schema';
import { Offer, OfferSchema } from './schema/offer.schema';
import {
  AgentPropertyInvite,
  AgentPropertyInviteSchema,
} from './schema/agentPropertyInvite.schema';
import {
  UserSavedProperty,
  UserSavedPropertySchema,
} from './schema/userFavoriteProperties.schema';
import {
  PropertyDocumentRepo,
  PropertyDocumentRepoSchema,
} from '../propertyRepo/schema/propertyDocumentRepo.schema';
import { OfferComment, OfferCommentSchema } from './schema/offerComment.schema';
import {
  PropertyTourSchedule,
  PropertyTourScheduleSchema,
} from './schema/proertyTourSchedule.schema';
import {
  SharePropertyDoc,
  SharePropertyDocSchema,
} from './schema/shareDocument.schema';
import {
  AgentContract,
  AgentContractSchema,
} from './schema/agentContract.schema';
import {
  BuyerProperyTermsAndAgreement,
  BuyerProperyTermsAndAgreementSchema,
} from './schema/buyerPropertyTermsAndAgreement.schema';
import { EmailService } from 'src/services/email/email.service';
import NotificationService from '../notification/notitifcation.service';
import { NotificationGateway } from '../notification/notification.gateway';
import { Notification, NotificationSchema } from '../notification/schema/notification.schema';
import { UserNotificationTokens, UserNotificationTokensSchema } from '../notification/schema/userNotificationsTokens.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Property.name, schema: PropertySchema },
      { name: PropertyQuery.name, schema: PropertyQuerySchema },
      { name: Agent.name, schema: AgentSchema },
      { name: PropertyTour.name, schema: PropertyTourSchema },
      { name: Offer.name, schema: OfferSchema },
      { name: AgentPropertyInvite.name, schema: AgentPropertyInviteSchema },
      { name: UserSavedProperty.name, schema: UserSavedPropertySchema },
      { name: PropertyDocumentRepo.name, schema: PropertyDocumentRepoSchema },
      { name: OfferComment.name, schema: OfferCommentSchema },
      { name: PropertyTourSchedule.name, schema: PropertyTourScheduleSchema },
      { name: SharePropertyDoc.name, schema: SharePropertyDocSchema },
      { name: AgentContract.name, schema: AgentContractSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: UserNotificationTokens.name, schema: UserNotificationTokensSchema },
      {
        name: BuyerProperyTermsAndAgreement.name,
        schema: BuyerProperyTermsAndAgreementSchema,
      },
    ]),
  ],
  controllers: [PropertyController],
  providers: [PropertyService, EmailService, NotificationService, NotificationGateway],
})
export class PropertyModule {}
