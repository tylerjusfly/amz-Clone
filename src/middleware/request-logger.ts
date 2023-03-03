import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private logger: Logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction) {
    const { method, originalUrl: url, ip } = request;

    response.on('close', () => {
      const { statusCode } = response;

      this.logger.log(`${method} ${url} ${statusCode} - ${ip}`);
    });

    next();
  }
}
