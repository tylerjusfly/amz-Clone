// anotate with Controller Decorator so nest knows its a controller
import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { GoogleGuard } from './guard';

@Controller('auth') /*return a Global prefix route */
export class AuthController {
  //calling AuthService has a dependency injection in order to have acess to it while nest handles the instantiate
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.ACCEPTED)
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.Signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.Login(dto);
  }

  @UseGuards(GoogleGuard)
  @Get('google')
  GoogleAuth() {
    return { message: 'Google Auth Init' };
  }
}

// Controllers are responsible for handling incoming requests and returning responses to the client.
