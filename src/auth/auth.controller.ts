// anotate with Controller Decorator so nest knows its a controller
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth') /*return a Global prefix route */
export class AuthController {
  //calling AuthService has a dependency injection in order to have acess to it while nest handles the instantiate
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.Signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.Login(dto);
  }
}

// Controllers are responsible for handling incoming requests and returning responses to the client.
