import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { decodeAgentJwtToken, decodeJwtToken } from 'src/utils/jwt.util';
import { User } from 'src/modules/users/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountTypeEnum } from 'src/constants';
import { Agent } from 'src/modules/agent/schema/agent.schema';
import { WsException } from '@nestjs/websockets';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: User;
      active_user_role: AccountTypeEnum;
    }
  }
}
export class AgentOrSellerSocketAuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Agent.name) private readonly agentModel: Model<Agent>,
  ) {}


  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake.query.token;

    if (!token) {
      throw new WsException('Token not provided');
    }

    try {
      const decoded = this.validateRequest(token);
      client.data.user = decoded;
      return true;
    } catch (error) {
      throw new WsException('Invalid token');
    }
  }

  async validateRequest(token: string): Promise<User | Agent> {
    const decodedToken: any =
      decodeJwtToken(token) || decodeAgentJwtToken(token);
    if (!decodedToken) {
      throw new UnauthorizedException('Please login again.');
    }

    const user = await this.userModel.findById(decodedToken.id);

    if (user) {
      // if (
      //   !request.headers.role ||
      //   !Object.values(AccountTypeEnum).includes(
      //     request.headers.role as AccountTypeEnum,
      //   )
      // ) {
      //   throw new WsException('Please provde an role in the header.');
      // }
      // request['user'] = user;
      // request['active_user_role'] = request.headers
      //   .active_user_role as AccountTypeEnum;

      return user;
    }
    // request['user'] = user;
    // request['active_user_role'] = request.headers
    //   .active_user_role as AccountTypeEnum;

    const agent = await this.agentModel.findById(decodedToken.id);
    if (agent) {
      // request['agent'] = agent;
      return agent;
    }
    throw new WsException('Invalid token. Please login again.');
  }
}
