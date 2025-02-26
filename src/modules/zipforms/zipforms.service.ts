import { Injectable, HttpException, HttpStatus, InternalServerErrorException, ServiceUnavailableException,  UnauthorizedException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FormAuthDto, FormDto } from './dto/form.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ZipformsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  async authenticateUser(formAuthDto: FormAuthDto): Promise<any> {
    const sharedKey = this.configService.get<string>('ZIPFORM_SHARED_KEY');

    const url = this.configService.get<string>('ZIPFORM_URL');
    const authUrl = `${url}/auth/user`;

    const payload = {
      SharedKey: sharedKey,
      ...formAuthDto,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(authUrl, payload),
      );
      return response.data; // Return the response data from ZipForm API
    } catch (error) {
      // Handle errors appropriately
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Authentication failed. Please check your credentials.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
  async createTransaction(
    contextId: string,
    sharedKey: string,
    transactionData: any,
  ): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-ContextId': contextId, // Custom header for the context ID
      'X-Auth-SharedKey': sharedKey, // Custom header for the shared key
    };

    try {
      const sharedKey = this.configService.get<string>('ZIPFORM_SHARED_KEY');
      const url = this.configService.get<string>('ZIPFORM_URL');
      const transactionUrl = `${url}/transactions`;

      const response = await firstValueFrom(
        this.httpService.post(transactionUrl, transactionData, {
          headers,
        }),
      );
      return response.data; // Return the transaction data
    } catch (error) {
      // Handle errors appropriately
      const errorMessage =
        error.response?.data?.error || 'Failed to create transaction.';
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: errorMessage,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async viewAgentLibraryForm(
    contextId: string,
    sharedKey: string,
    // transactionData: any,
  ): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-ContextId': contextId, // Custom header for the context ID
      'X-Auth-SharedKey': sharedKey, // Custom header for the shared key
    };

    try {
      const sharedKey = this.configService.get<string>('ZIPFORM_SHARED_KEY');
      const url = this.configService.get<string>('ZIPFORM_URL');
      const agentUrl = `${url}/agents/libraries`;
      const response = await firstValueFrom(
        this.httpService.get(agentUrl, {
          headers,
        }),
      );
      return response.data; // Return the transaction data
    } catch (error) {
      // Handle errors appropriately
      if (error.response) {
        // Extract status code from the 3rd party API response
        const statusCode = error.response.status;
        
        // Handle specific status codes
        if (statusCode === 404) {
          throw new NotFoundException(`forms not found`);
        } else if (statusCode === 401 || statusCode === 403) {
          throw new UnauthorizedException('Authentication failed or insufficient permissions');
        } else {
          // Handle other status codes with original error message
          const errorMessage = error.response.data?.error || 
                             error.response.data?.message || 
                             'An error occurred with the transaction service';
          throw new HttpException(errorMessage, statusCode);
        }
      } else if (error.request) {
        // The request was made but no response was received (e.g., network error)
        throw new ServiceUnavailableException('form service unavailable');
      } else {
        // Something else happened while setting up the request
        throw new InternalServerErrorException('Error setting up form request');
      }
    }
  }
  async viewAllForms(
    contextId: string,
    sharedKey: string,
    transactionId: string,
  ): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-ContextId': contextId, // Custom header for the context ID
      'X-Auth-SharedKey': sharedKey, // Custom header for the shared key
    };

    try {
      const url = this.configService.get<string>('ZIPFORM_URL');

      const zipFormsUrl = `${url}/libraries/${transactionId}/CAR/1335`; // Replace with the correct endpoint

      const response = await firstValueFrom(
        this.httpService.get(zipFormsUrl, {
          headers,
        }),
      );
      return response.data; // Return the transaction data
    } catch (error) {
      // Handle errors appropriately
      if (error.response) {
        // Extract status code from the 3rd party API response
        const statusCode = error.response.status;
        
        // Handle specific status codes
        if (statusCode === 404) {
          throw new NotFoundException(`Transaction with ID ${transactionId} not found`);
        } else if (statusCode === 401 || statusCode === 403) {
          throw new UnauthorizedException('Authentication failed or insufficient permissions');
        } else {
          // Handle other status codes with original error message
          const errorMessage = error.response.data?.error || 
                             error.response.data?.message || 
                             'An error occurred with the transaction service';
          throw new HttpException(errorMessage, statusCode);
        }
      } else if (error.request) {
        // The request was made but no response was received (e.g., network error)
        throw new ServiceUnavailableException('Transaction service unavailable');
      } else {
        // Something else happened while setting up the request
        throw new InternalServerErrorException('Error setting up transaction request');
      }
    }
  }
  async viewAllTransactions(
    contextId: string,
    sharedKey: string,
   
  ): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-ContextId': contextId, // Custom header for the context ID
      'X-Auth-SharedKey': sharedKey, // Custom header for the shared key
    };

    try {
      const url = this.configService.get<string>('ZIPFORM_URL');

      const zipFormsUrl = `${url}/transactions`; // Replace with the correct endpoint

      const response = await firstValueFrom(
        this.httpService.get(zipFormsUrl, {
          headers,
        }),
      );
      return response.data; // Return the transaction data
    } catch (error) {
      // Handle errors appropriately
      if (error.response) {
        // Extract status code from the 3rd party API response
        const statusCode = error.response.status;
        
        // Handle specific status codes
        if (statusCode === 404) {
          throw new NotFoundException(`Failed to fetch Transactions`);
        } else if (statusCode === 401 || statusCode === 403) {
          throw new UnauthorizedException('Authentication failed or insufficient permissions');
        } else {
          // Handle other status codes with original error message
          const errorMessage = error.response.data?.error || 
                             error.response.data?.message || 
                             'An error occurred with the transaction service';
          throw new HttpException(errorMessage, statusCode);
        }
      } else if (error.request) {
        // The request was made but no response was received (e.g., network error)
        throw new ServiceUnavailableException('Transaction service unavailable');
      } else {
        // Something else happened while setting up the request
        throw new InternalServerErrorException('Error setting up transaction request');
      }
    }
  }
  
  async viewTransactionData(
    contextId: string,
    sharedKey: string,
    transactionId: string,
  ): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-ContextId': contextId, // Custom header for the context ID
      'X-Auth-SharedKey': sharedKey, // Custom header for the shared key
    };

    try {
      const url = this.configService.get<string>('ZIPFORM_URL');

      const zipFormsUrl = `${url}/transactions/${transactionId}/data`; // Replace with the correct endpoint
      console.log(transactionId);
      const response = await firstValueFrom(
        this.httpService.get(zipFormsUrl, {
          headers,
        }),
      );

      return response.data; // Return the transaction data
    } catch (error) {
      // Handle errors appropriately
      if (error.response) {
        // Extract status code from the 3rd party API response
        const statusCode = error.response.status;
        
        // Handle specific status codes
        if (statusCode === 404) {
          throw new NotFoundException(`Transaction with ID ${transactionId} not found`);
        } else if (statusCode === 401 || statusCode === 403) {
          throw new UnauthorizedException('Authentication failed or insufficient permissions');
        } else {
          // Handle other status codes with original error message
          const errorMessage = error.response.data?.error || 
                             error.response.data?.message || 
                             'An error occurred with the transaction service';
          throw new HttpException(errorMessage, statusCode);
        }
      } else if (error.request) {
        // The request was made but no response was received (e.g., network error)
        throw new ServiceUnavailableException('Transaction service unavailable');
      } else {
        // Something else happened while setting up the request
        throw new InternalServerErrorException('Error setting up transaction request');
      }
    }
    }
  

  async addTransactionForm(
    contextId: string,
    sharedKey: string,
    transactionData: any,
    transactionId: any,
  ): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-ContextId': contextId, // Custom header for the context ID
      'X-Auth-SharedKey': sharedKey, // Custom header for the shared key
    };

    try {
      const url = this.configService.get<string>('ZIPFORM_URL');

      const transactionform = `${url}/transactions/${transactionId}/documents/form`;
      const response = await firstValueFrom(
        this.httpService.post(transactionform, transactionData, {
          headers,
        }),
      );

      return response.data; // Return the transaction data
    } catch (error) {
      // Handle errors appropriately
      if (error.response) {
        // Extract status code from the 3rd party API response
        const statusCode = error.response.status;
        
        // Handle specific status codes
        if (statusCode === 404) {
          throw new NotFoundException(`Transaction with ID ${transactionId} not found`);
        } else if (statusCode === 401 || statusCode === 403) {
          throw new UnauthorizedException('Authentication failed or insufficient permissions');
        } else {
          // Handle other status codes with original error message
          const errorMessage = error.response.data?.error || 
                             error.response.data?.message || 
                             'An error occurred with the transaction service';
          throw new HttpException(errorMessage, statusCode);
        }
      } else if (error.request) {
        // The request was made but no response was received (e.g., network error)
        throw new ServiceUnavailableException('Transaction service unavailable');
      } else {
        // Something else happened while setting up the request
        throw new InternalServerErrorException('Error setting up transaction request');
      }
    }
  }
}
