import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EmailService } from 'src/services/email/email.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { configs } from 'src/configs';

import {
  Notification,
  NotificationUserType,
} from './schema/notification.schema';
import { PaginationDto } from 'src/constants/pagination.dto';
import { User } from '../users/schema/user.schema';
import { UserNotificationTokens } from './schema/userNotificationsTokens.schema';
import { Agent } from '../agent/schema/agent.schema';

@Injectable()
export default class NotificationService {
  constructor(
    private readonly emailService: EmailService,
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    @InjectModel(UserNotificationTokens.name)
    private readonly userNotificationTokensModel: Model<UserNotificationTokens>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Agent.name)
    private readonly agentModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}

  private readonly oneSignalApiKey = configs.oneSignal_api_key;
  private readonly oneSignalAppId = configs.oneSignal_app_id;

  async setOneSignalExternalUserId(playerId: string, mongoUserId: string) {
    const payload = {
      app_id: this.oneSignalAppId,
      external_user_id: mongoUserId, // Link the Mongoose ObjectId here
    };

    try {
      const response = await axios.put(
        `https://onesignal.com/api/v1/players/${playerId}`,
        payload,
        {
          headers: {
            Authorization: `Basic ${this.configService.get<string>('ONESIGNAL_API_KEY')}`,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('External User ID set successfully:', response.data);
    } catch (error) {
      console.error('Error setting External User ID:', error.response.data);
      throw new Error('Failed to set External User ID');
    }
  }

  async saveUserNotificationToken(token: string, user: User) {
    const userExists = await this.userModel.findById(user.id);
    if (!userExists) {
      throw new NotFoundException('User not found');
    }
    const alreadySaved = await this.userNotificationTokensModel.findOne({
      token,
      user: user.id,
    });
    if (alreadySaved) {
      return alreadySaved;
    }
    const saved = await this.userNotificationTokensModel.create({
      token,
      user: new Types.ObjectId(user.id),
    });
    return saved;
  }

  async saveAgentNotificationToken(token: string, agent: Agent) {
    const userExists = await this.agentModel.findById(agent.id);
    if (!userExists) {
      throw new NotFoundException('User not found');
    }
    const alreadySaved = await this.userNotificationTokensModel.findOne({
      token,
      agent: agent.id,
    });
    if (alreadySaved) {
      return alreadySaved;
    }
    const saved = await this.userNotificationTokensModel.create({
      token,
      agent: new Types.ObjectId(agent.id),
    });
    return saved;
  }

  async sendPushNotification(
    message: string,
    targetUserIds: string[],
  ): Promise<void> {
    if (!Array.isArray(targetUserIds) || targetUserIds.length === 0) {
      throw new Error('Target user IDs must be a non-empty array');
    }

    // Clean and validate user IDs
    const validUserIds = targetUserIds
      .map((id) => String(id).trim()) // Convert to strings and trim whitespace
      .filter((id) => id.length > 0); // Remove empty strings

    if (validUserIds.length === 0) {
      throw new Error('No valid user IDs provided');
    }
    const notificationPayload = {
      app_id: this.oneSignalAppId,
      include_external_user_ids: validUserIds,
      contents: { en: message },
    };

    const appKey = this.configService.get<string>('ONESIGNAL_API_KEY');
    console.log('User IDs being sent:', validUserIds);

    try {
      const response = await axios.post(
        'https://onesignal.com/api/v1/notifications',
        notificationPayload,
        {
          headers: {
            Authorization: `Basic ${appKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('Notification sent:', response.data);
    } catch (error) {
      console.error('Error sending notification:', error.response.data);
      // throw new Error('Failed to send notification');
    }
  }

  async createNotification(data: {
    title: string;
    body: string;
    user: string;
    userType?: NotificationUserType;
  }): Promise<Notification> {
    if (!data.user || !Types.ObjectId.isValid(data.user)) {
      throw new Error('Invalid user ID');
    }

    const payload = {
      ...data,
      user: new Types.ObjectId(data.user),
    };

    const saved = await this.notificationModel.create(payload);
    const notification = await saved.save();

    // Ensure user ID is converted to string
    await this.sendPushNotification(data.body, [saved.user.toString()]);

    return notification;
  }

  async createMultipleNotifications(data: {
    title: string;
    body: string;
    user: string[];
    userType?: NotificationUserType;
  }) {
    await this.notificationModel.insertMany(data);
    // const notification = await saved.save();
    // return notification;
  }

  // async sendSms(receiverPhoneNumber: string, message: string) {
  //   const senderPhoneNumber = configs.TWILO_PHONE_NUMBER;
  //   return this.twilioClient.messages.create({
  //     body: message,
  //     from: senderPhoneNumber,
  //     to: receiverPhoneNumber,
  //   });
  // }

  // async sendNewManagerEmail({ email, body }) {
  //   const result = await this.emailService.sendEmail({
  //     email,
  //     subject: 'Welcome to Pharmaserv',
  //     template: EMAIL_TEMPLATES.NEW_MANAGER_EMAIL,
  //     body: body,
  //   });

  //   return result;
  // }

  async getAccountNotifications(paginationDto: PaginationDto, id: string) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;
    const [result, total] = await Promise.all([
      this.notificationModel
        .find({ user: new Types.ObjectId(id) })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.notificationModel.countDocuments({ user: new Types.ObjectId(id) }),
    ]);

    return { result, total, page, limit };
  }

  async markOneAsRead(id: string) {
    const notification = await this.notificationModel
      .findByIdAndUpdate(
        id,
        {
          read: true,
        },
        {
          new: true,
        },
      )
      .populate('user');
    if (!notification) {
      throw new NotFoundException('Notification not found.');
    }
    return notification;
  }

  async markAllAsRead(id: string) {
    await this.notificationModel.updateMany(
      {
        user: new Types.ObjectId(id),
      },
      {
        read: true,
      },
    );
    return true;
  }
}
