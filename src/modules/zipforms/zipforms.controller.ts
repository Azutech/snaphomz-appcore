import {
  Controller,
  Post,
  Body,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Query,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ZipformsService } from './zipforms.service';
import { FormAuthDto } from './dto/form.dto';

@Controller('zipforms')
export class ZipformsController {
  constructor(private readonly zipformsService: ZipformsService) {}
  @Post('authUser')
  async login(@Body() formAuthDto: FormAuthDto) {
    // Call the service to authenticate the user
    const result = await this.zipformsService.authenticateUser(formAuthDto);

    // Return the result from authentication
    return {
      status: 'success',
      data: result,
    };
  }

  @Post('createTransaction')
  async createTransaction(
    @Headers('X-Auth-ContextId') contextId: string,
    @Headers('X-Auth-SharedKey') sharedKey: string,
    @Body() transactionData: any,
  ) {
    if (!contextId || !sharedKey) {
      throw new HttpException(
        'Missing required authentication headers',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const result = await this.zipformsService.createTransaction(
      contextId,
      sharedKey,
      transactionData,
    );

    return {
      status: 'success',
      data: result,
    };
  }
  @Post('createWebhook')
  async createWebhook(
    @Headers('X-Auth-ContextId') contextId: string,
    @Headers('X-Auth-SharedKey') sharedKey: string,
    @Body() payload: any,
    @Query('scopeId') scopeId: any,
  ) {
    if (!contextId || !sharedKey) {
      throw new HttpException(
        'Missing required authentication headers',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const result = await this.zipformsService.createWebhook(
      contextId,
      sharedKey,
      payload,
      scopeId,
    );

    return {
      status: 'success',
      data: result,
    };
  }
  @Get('viewagentForm')
  async viewagentForm(
    @Headers('X-Auth-ContextId') contextId: string,
    @Headers('X-Auth-SharedKey') sharedKey: string,
  ) {
    if (!contextId || !sharedKey) {
      throw new HttpException(
        'Missing required authentication headers',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const result = await this.zipformsService.viewAgentLibraryForm(
      contextId,
      sharedKey,
    );

    return {
      status: 'success',
      data: result,
    };
  }
  @Get('allforms')
  async allforms(
    @Headers('X-Auth-ContextId') contextId: string,
    @Headers('X-Auth-SharedKey') sharedKey: string,
    @Query('transactionId') transactionId: string,
  ) {
    if (!contextId || !sharedKey) {
      throw new HttpException(
        'Missing required authentication headers',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const result = await this.zipformsService.viewAllForms(
      contextId,
      sharedKey,
      transactionId,
    );

    return {
      status: 'success',
      data: result,
    };
  }
  @Get('documentsOfTransaction')
  async documentsOfTransaction(
    @Headers('X-Auth-ContextId') contextId: string,
    @Headers('X-Auth-SharedKey') sharedKey: string,
    @Query('transactionId') transactionId: string,
  ) {
    if (!contextId || !sharedKey) {
      throw new HttpException(
        'Missing required authentication headers',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const result = await this.zipformsService.documentsOfTransaction(
      contextId,
      sharedKey,
      transactionId,
    );

    return {
      status: 'success',
      data: result,
    };
  }

  @Get('viewTransactionData')
  async viewTransactionData(
    @Headers('X-Auth-ContextId') contextId: string,
    @Headers('X-Auth-SharedKey') sharedKey: string,
    @Query('transactionId') transactionId: string,
  ) {
    if (!contextId || !sharedKey) {
      throw new HttpException(
        'Missing required authentication headers',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const result = await this.zipformsService.viewTransactionData(
      contextId,
      sharedKey,
      transactionId,
    );

    return {
      status: 'success',
      data: result,
    };
  }
  @Get('viewTransaction')
  async viewTransaction(
    @Headers('X-Auth-ContextId') contextId: string,
    @Headers('X-Auth-SharedKey') sharedKey: string,
    @Query('transactionId') transactionId: string,
  ) {
    if (!contextId || !sharedKey) {
      throw new HttpException(
        'Missing required authentication headers',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const result = await this.zipformsService.viewTransaction(
      contextId,
      sharedKey,
      transactionId,
    );

    return {
      status: 'success',
      data: result,
    };
  }
  @Get('viewDocuments')
  async viewDocuments(
    @Headers('X-Auth-ContextId') contextId: string,
    @Headers('X-Auth-SharedKey') sharedKey: string,
    @Query('transactionId') transactionId: string,
    @Query('id') id: string,
  ) {
    if (!contextId || !sharedKey) {
      throw new HttpException(
        'Missing required authentication headers',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const result = await this.zipformsService.viewDocuments(
      contextId,
      sharedKey,
      transactionId,
      id,
    );

    return {
      status: 'success',
      data: result,
    };
  }

  @Delete('deleteTransaction')
  @HttpCode(HttpStatus.NO_CONTENT) // This sets the response status code to 204
  async deleteTransaction(
    @Headers('X-Auth-ContextId') contextId: string,
    @Headers('X-Auth-SharedKey') sharedKey: string,
    @Query('transactionId') transactionId: string,
  ) {
    if (!contextId || !sharedKey) {
      throw new HttpException(
        'Missing required authentication headers',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const result = await this.zipformsService.deleteTransaction(
      contextId,
      sharedKey,
      transactionId,
    );

    return;
  }

  @Delete('deleteDocuments')
  @HttpCode(HttpStatus.NO_CONTENT) // This sets the response status code to 204
  async deleteDocuments(
    @Headers('X-Auth-ContextId') contextId: string,
    @Headers('X-Auth-SharedKey') sharedKey: string,
    @Query('transactionId') transactionId: string,
    @Query('id') id: string,
  ) {
    if (!contextId || !sharedKey) {
      throw new HttpException(
        'Missing required authentication headers',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const result = await this.zipformsService.deleteDocuments(
      contextId,
      sharedKey,
      transactionId,
      id,
    );

    return;
  }

  @Get('viewAllTransactions')
  async viewAllTransactions(
    @Headers('X-Auth-ContextId') contextId: string,
    @Headers('X-Auth-SharedKey') sharedKey: string,
  ) {
    if (!contextId || !sharedKey) {
      throw new HttpException(
        'Missing required authentication headers',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const result = await this.zipformsService.viewAllTransactions(
      contextId,
      sharedKey,
    );

    return {
      status: 'success',
      data: result,
    };
  }

  @Post('endSession')
  @HttpCode(HttpStatus.NO_CONTENT) // This sets the response status code to 204
  async endSession(
    @Headers('X-Auth-ContextId') contextId: string,
    @Headers('X-Auth-SharedKey') sharedKey: string,
  ) {
    if (!contextId || !sharedKey) {
      throw new HttpException(
        'Missing required authentication headers',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.zipformsService.endSession(contextId, sharedKey);

    // No need to return anything for a 204 response
    return;
  }

  @Post('addFormToTransaction')
  async formToTransaction(
    @Headers('X-Auth-contextId') contextId: string,
    @Headers('X-Auth-SharedKey') sharedKey: string,
    @Body() transactionData: any,
    @Query('transactionId') transactionId: string,
  ) {
    if (!contextId || !sharedKey) {
      throw new HttpException(
        'Missing required authentication headers',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const result = await this.zipformsService.addTransactionForm(
      contextId,
      sharedKey,
      transactionData,
      transactionId,
    );

    return {
      status: 'success',
      data: result,
    };
  }
}
