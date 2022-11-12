import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class AppController {
  @Get()
  homePage() {
    return '<h1>Hello World </h1>';
  }
}
