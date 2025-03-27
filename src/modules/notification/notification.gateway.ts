// notification.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageNotificationDto } from './dto/messagenotification.dto';
import { UseGuards } from '@nestjs/common';

//   import { JwtAuthGuard } from 'src/guards/jwt/jwt.guard';

@WebSocketGateway({
  namespace: 'notifications',
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
}) // Enable CORS if needed
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor() {}

  // Handle new client connection
  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId; // Assuming userId is sent in query
    if (userId) {
      client.join(userId); // Make the client join a room with their userId
      console.log(`Client ${client.id} joined room: ${userId}`);
    }
    console.log(`Client connected: ${client.id}`);
  }

  // Handle client disconnection
  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Handle sending a single real-time notification
  @SubscribeMessage('sendNotification')
  async handleSendNotification(
    client: Socket,
    payload: { notification: CreateMessageNotificationDto },
  ): Promise<void> {
    const { notification } = payload;
    this.sendRealTimeNotification(notification);
  }

  // Send real-time notifications to connected users
  async sendRealTimeNotification(
    // userId: string,
    message: CreateMessageNotificationDto,
  ) {
    this.server.emit('receiveNotification', {
      title: message.title,
      body: message.body,
      user: message.user,
      userType: message.userType,
      //   read: message.read,
    });
  }

  // Broadcast notifications to multiple users with DTO handling
  broadcastNotification(
    userIds: string[],
    notifications: CreateMessageNotificationDto[],
  ) {
    userIds.forEach((userId) => {
      // Filter notifications for the specific user
      const userNotifications = notifications.filter(
        (notification) => notification.user === userId,
      );

      if (userNotifications.length > 0) {
        // Emit all notifications for the user in a structured format
        this.server.to(userId).emit(
          'receiveNotification',
          userNotifications.map((notification) => ({
            title: notification.title,
            body: notification.body,
            user: notification.user,
            userType: notification.userType,
            // read: notification.read,
          })),
        );
      }
    });
  }
}
