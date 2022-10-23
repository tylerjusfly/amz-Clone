import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/auth.entity';
import { GetUser } from '../auth/decorators';
import { JwtGuard, GoogleGuard } from '../auth/guard';

/*You can use the UseGuard decorator at a Global Level or at a Route Level */

@ApiTags('users')
@Controller('users') /* The Controller decorator Registers a class as a controller */
export class UserController {
  @UseGuards(JwtGuard)
  @Get('me')
  GetProfile(@GetUser() user: Auth) {
    return user;
  }

  // Google Redirects to this EndPoint and return a token
  @ApiExcludeEndpoint()
  @UseGuards(GoogleGuard)
  @Get('profile')
  HandleRedirect(@GetUser() user: Auth) {
    return user;
  }
}
