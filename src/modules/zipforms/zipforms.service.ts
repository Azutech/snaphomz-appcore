import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  ServiceUnavailableException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
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

  async createWebhook(
    contextId: string,
    sharedKey: string,
    payload: { eventId: number; url: string },
    scopeId: string,
  ): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-SharedKey': sharedKey,
      // Add session key if required (check documentation)
      'Session-Key': '', // Add session key retrieval logic if needed
    };

    const url = this.configService.get<string>('ZIPFORM_URL');
    // 1. Fix URL construction
    const transactionUrl = `${url}/hook/${scopeId}`; // Added slash before scopeId

    try {
      // 2. Add payload validation
      if (!payload.url || !payload.eventId) {
        throw new HttpException(
          'Missing required fields in payload',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 3. Add HTTPS validation for callback URL
      if (!payload.url.startsWith('https://')) {
        throw new HttpException(
          'Callback URL must use HTTPS',
          HttpStatus.BAD_REQUEST,
        );
      }

      const response = await firstValueFrom(
        this.httpService.post(transactionUrl, payload, { headers }),
      );

      // 4. Add proper typing for response
      return {
        id: response.data.value?.id,
        url: response.data.value?.url,
        status: response.data.value?.paused ? 'paused' : 'active',
      };
    } catch (error) {
      // 5. Improved error logging
      console.error('Webhook creation failed:', {
        url: transactionUrl,
        error: error.response?.data,
        status: error.response?.status,
      });

      // 6. Better error propagation
      const errorMessage =
        error.response?.data?.message || 'Webhook registration failed';
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: errorMessage,
          details: error.response?.data?.errors,
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
          throw new UnauthorizedException(
            'Authentication failed or insufficient permissions',
          );
        } else {
          // Handle other status codes with original error message
          const errorMessage =
            error.response.data?.error ||
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
          throw new NotFoundException(
            `Transaction with ID ${transactionId} not found`,
          );
        } else if (statusCode === 401 || statusCode === 403) {
          throw new UnauthorizedException(
            'Authentication failed or insufficient permissions',
          );
        } else {
          // Handle other status codes with original error message
          const errorMessage =
            error.response.data?.error ||
            error.response.data?.message ||
            'An error occurred with the transaction service';
          throw new HttpException(errorMessage, statusCode);
        }
      } else if (error.request) {
        // The request was made but no response was received (e.g., network error)
        throw new ServiceUnavailableException(
          'Transaction service unavailable',
        );
      } else {
        // Something else happened while setting up the request
        throw new InternalServerErrorException(
          'Error setting up transaction request',
        );
      }
    }
  }
  async documentsOfTransaction(
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

      const zipFormsUrl = `${url}/transactions/${transactionId}/documents`; // Replace with the correct endpoint

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
          throw new NotFoundException(
            `Transaction with ID ${transactionId} not found`,
          );
        } else if (statusCode === 401 || statusCode === 403) {
          throw new UnauthorizedException(
            'Authentication failed or insufficient permissions',
          );
        } else {
          // Handle other status codes with original error message
          const errorMessage =
            error.response.data?.error ||
            error.response.data?.message ||
            'An error occurred with the transaction service';
          throw new HttpException(errorMessage, statusCode);
        }
      } else if (error.request) {
        // The request was made but no response was received (e.g., network error)
        throw new ServiceUnavailableException(
          'Transaction service unavailable',
        );
      } else {
        // Something else happened while setting up the request
        throw new InternalServerErrorException(
          'Error setting up transaction request',
        );
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
          throw new UnauthorizedException(
            'Authentication failed or insufficient permissions',
          );
        } else {
          // Handle other status codes with original error message
          const errorMessage =
            error.response.data?.error ||
            error.response.data?.message ||
            'An error occurred with the transaction service';
          throw new HttpException(errorMessage, statusCode);
        }
      } else if (error.request) {
        // The request was made but no response was received (e.g., network error)
        throw new ServiceUnavailableException(
          'Transaction service unavailable',
        );
      } else {
        // Something else happened while setting up the request
        throw new InternalServerErrorException(
          'Error setting up transaction request',
        );
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
          throw new NotFoundException(
            `Transaction with ID ${transactionId} not found`,
          );
        } else if (statusCode === 401 || statusCode === 403) {
          throw new UnauthorizedException(
            'Authentication failed or insufficient permissions',
          );
        } else {
          // Handle other status codes with original error message
          const errorMessage =
            error.response.data?.error ||
            error.response.data?.message ||
            'An error occurred with the transaction service';
          throw new HttpException(errorMessage, statusCode);
        }
      } else if (error.request) {
        // The request was made but no response was received (e.g., network error)
        throw new ServiceUnavailableException(
          'Transaction service unavailable',
        );
      } else {
        // Something else happened while setting up the request
        throw new InternalServerErrorException(
          'Error setting up transaction request',
        );
      }
    }
  }

  async deleteTransaction(
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

      const zipFormsUrl = `${url}/transactions/${transactionId}`; // Replace with the correct endpoint
      console.log(transactionId);
      const response = await firstValueFrom(
        this.httpService.delete(zipFormsUrl, {
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
        if (statusCode === 400) {
          throw new NotFoundException(
            `Transaction with ID ${transactionId} not found`,
          );
        } else if (statusCode === 401 || statusCode === 403) {
          throw new UnauthorizedException(
            'Authentication failed or insufficient permissions',
          );
        } else {
          // Handle other status codes with original error message
          const errorMessage =
            error.response.data?.error ||
            error.response.data?.message ||
            'An error occurred with the transaction service';
          throw new HttpException(errorMessage, statusCode);
        }
      } else if (error.request) {
        // The request was made but no response was received (e.g., network error)
        throw new ServiceUnavailableException(
          'Transaction service unavailable',
        );
      } else {
        // Something else happened while setting up the request
        throw new InternalServerErrorException(
          'Error setting up transaction request',
        );
      }
    }
  }
  async deleteDocuments(
    contextId: string,
    sharedKey: string,
    transactionId: string,
    id: string,
  ): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-ContextId': contextId, // Custom header for the context ID
      'X-Auth-SharedKey': sharedKey, // Custom header for the shared key
    };

    try {
      const url = this.configService.get<string>('ZIPFORM_URL');

      const zipFormsUrl = `${url}/transactions/${transactionId}/documents/${id}`; // Replace with the correct endpoint
      console.log(transactionId);
      const response = await firstValueFrom(
        this.httpService.delete(zipFormsUrl, {
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
        if (statusCode === 400) {
          throw new NotFoundException(
            `Transaction with ID ${transactionId} not found`,
          );
        } else if (statusCode === 401 || statusCode === 403) {
          throw new UnauthorizedException(
            'Authentication failed or insufficient permissions',
          );
        } else {
          // Handle other status codes with original error message
          const errorMessage =
            error.response.data?.error ||
            error.response.data?.message ||
            'An error occurred with the transaction service';
          throw new HttpException(errorMessage, statusCode);
        }
      } else if (error.request) {
        // The request was made but no response was received (e.g., network error)
        throw new ServiceUnavailableException(
          'Transaction service unavailable',
        );
      } else {
        // Something else happened while setting up the request
        throw new InternalServerErrorException(
          'Error setting up transaction request',
        );
      }
    }
  }
  async viewTransaction(
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

      const zipFormsUrl = `${url}/transactions/${transactionId}`; // Replace with the correct endpoint
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
          throw new NotFoundException(
            `Transaction with ID ${transactionId} not found`,
          );
        } else if (statusCode === 401 || statusCode === 403) {
          throw new UnauthorizedException(
            'Authentication failed or insufficient permissions',
          );
        } else {
          // Handle other status codes with original error message
          const errorMessage =
            error.response.data?.error ||
            error.response.data?.message ||
            'An error occurred with the transaction service';
          throw new HttpException(errorMessage, statusCode);
        }
      } else if (error.request) {
        // The request was made but no response was received (e.g., network error)
        throw new ServiceUnavailableException(
          'Transaction service unavailable',
        );
      } else {
        // Something else happened while setting up the request
        throw new InternalServerErrorException(
          'Error setting up transaction request',
        );
      }
    }
  }
  async viewDocuments(
    contextId: string,
    sharedKey: string,
    transactionId: string,
    id: string,
  ): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-ContextId': contextId, // Custom header for the context ID
      'X-Auth-SharedKey': sharedKey, // Custom header for the shared key
    };

    try {
      const url = this.configService.get<string>('ZIPFORM_URL');

      const zipFormsUrl = `${url}/transactions/${transactionId}/documents/${id}/meta`; // Replace with the correct endpoint

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
          throw new NotFoundException(
            `Transaction with ID ${transactionId} not found`,
          );
        } else if (statusCode === 401 || statusCode === 403) {
          throw new UnauthorizedException(
            'Authentication failed or insufficient permissions',
          );
        } else {
          // Handle other status codes with original error message
          const errorMessage =
            error.response.data?.error ||
            error.response.data?.message ||
            'An error occurred with the transaction service';
          throw new HttpException(errorMessage, statusCode);
        }
      } else if (error.request) {
        // The request was made but no response was received (e.g., network error)
        throw new ServiceUnavailableException(
          'Transaction service unavailable',
        );
      } else {
        // Something else happened while setting up the request
        throw new InternalServerErrorException(
          'Error setting up transaction request',
        );
      }
    }
  }

  async endSession(contextId: string, sharedKey: string): Promise<any> {
    const headers = {
      Accept: 'application/json',
      'X-Auth-ContextId': contextId, // Custom header for the context ID
      'X-Auth-SharedKey': sharedKey, // Custom header for the shared key
    };

    try {
      const url = this.configService.get<string>('ZIPFORM_URL');
      const endSessionUrl = `${url}/auth/end-session`;

      // POST request with empty body since the API doesn't expect any data
      const response = await firstValueFrom(
        this.httpService.post(
          endSessionUrl,
          {},
          {
            headers,
          },
        ),
      );

      return response; // This will likely be empty based on "no content" response
    } catch (error) {
      // Handle errors appropriately
      if (error.response) {
        // Extract status code from the 3rd party API response
        const statusCode = error.response.status;

        // Handle specific status codes
        if (statusCode === 404) {
          throw new NotFoundException('Session not found');
        } else if (statusCode === 401 || statusCode === 403) {
          throw new UnauthorizedException(
            'Authentication failed or insufficient permissions',
          );
        } else {
          // Handle other status codes with original error message
          const errorMessage =
            error.response.data?.error ||
            error.response.data?.message ||
            'An error occurred with the session service';
          throw new HttpException(errorMessage, statusCode);
        }
      } else if (error.request) {
        // The request was made but no response was received (e.g., network error)
        throw new ServiceUnavailableException('Session service unavailable');
      } else {
        // Something else happened while setting up the request
        throw new InternalServerErrorException(
          'Error setting up session request',
        );
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
          throw new NotFoundException(
            `Transaction with ID ${transactionId} not found`,
          );
        } else if (statusCode === 401 || statusCode === 403) {
          throw new UnauthorizedException(
            'Authentication failed or insufficient permissions',
          );
        } else {
          // Handle other status codes with original error message
          const errorMessage =
            error.response.data?.error ||
            error.response.data?.message ||
            'An error occurred with the transaction service';
          throw new HttpException(errorMessage, statusCode);
        }
      } else if (error.request) {
        // The request was made but no response was received (e.g., network error)
        throw new ServiceUnavailableException(
          'Transaction service unavailable',
        );
      } else {
        // Something else happened while setting up the request
        throw new InternalServerErrorException(
          'Error setting up transaction request',
        );
      }
    }
  }
}
