// anotate with Controller Decorator so nest knows its a controller
import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { GoogleGuard } from './guard';

@ApiTags('Auth')
@Controller('auth') /*return a Global prefix route */
export class AuthController {
  //calling AuthService has a dependency injection in order to have acess to it while nest handles the instantiate
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.Signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.Login(dto);
  }

  @UseGuards(GoogleGuard)
  @Get('google')
  GoogleAuth() {
    return { message: 'Google Auth Init' };
  }

  @Post('create-roles')
  createRole(@Body() { name }) {
    return this.authService.createRoles(name, 'tyler');
  }

  @Post('assign-roles')
  assignRoles(@Body() { userId, roleids }) {
    return this.authService.assignRolesToUser(userId, roleids);
  }

  @Patch('remove-role')
  removeRole(@Body() { userId, roleid }) {
    return this.authService.removeRolesFromUser(userId, roleid);
  }
}

// Controllers are responsible for handling incoming requests and returning responses to the client.
