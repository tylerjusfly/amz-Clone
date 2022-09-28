import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Auth } from '../auth/auth.entity';
import { GetUser } from '../auth/decorators';
import { JwtGuard, GoogleGuard } from '../auth/guard';

/*You can use the UseGuard decorator at a Global Level or at a Route Level */

@Controller('users') /* The Controller decorator Registers a class as a controller */
export class UserController {
  @UseGuards(JwtGuard)
  @Get('me')
  GetProfile(@GetUser() user: Auth) {
    return user;
  }

  // Google Redirect EndPoint
  @UseGuards(GoogleGuard)
  @Get('profile')
  HandleRedirect(@GetUser() user: Auth) {
    return user;
  }
}
