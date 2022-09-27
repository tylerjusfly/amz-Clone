import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Auth } from 'src/auth/auth.entity';
import { GetUser } from '../auth/decorators';
import { JwtGuard } from '../auth/guard';

/*You can use the UseGuard decorator at a Global Level or at a Route Level */

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  GetProfile(@GetUser() user: Auth) {
    return user;
  }
}
