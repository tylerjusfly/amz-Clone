// service are used to handle business Logic, conneting to db , editing fields
// uses The Injectable NestJs uses Under the hood

import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto';
import * as argon from 'argon2'; /* package for hashing passwords*/
import { Auth } from './auth.entity';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';

//dependency Injection
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
    private jwt: JwtService,
    private config: ConfigService,
    private mailService: MailService,
  ) {}

  async Signup(dto: AuthDto) {
    try {
      //hashing password
      const hash = await argon.hash(dto.password);

      //save user to db
      const user = await this.authRepository.save({
        email: dto.email,
        password: hash,
      });

      //and return user
      delete user.password;

      //send mail
      await this.mailService.sendConfirmEmail(user.email);

      return this.SignToken(user, user.email);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.code === '23505') {
          return { type: 'Error', message: 'Credentials Taken' };
        }
      }
      //throw error;
      return { type: 'Error', message: error.message };
    }
  }

  async Login(dto: AuthDto) {
    // find user By Email
    const user = await this.authRepository.findOneBy({ email: dto.email });
    //does not exist , throw execption
    if (!user) return { type: 'Error', message: 'Incorrect Credentials' };

    //if exist , compare password
    const passMatch = await argon.verify(user.password, dto.password);

    //if password doesn't match , throw execption
    if (!passMatch) return { type: 'Error', message: 'Incorrect Credentials' };

    //if correct , send back users

    return this.SignToken(user, user.email);
  }

  async ValidateGoogleUser(email: string) {
    //find User
    const user = await this.authRepository.findOneBy({ email: email });

    //if found return
    if (user) return this.SignToken(user, user.email);
    //else Create
    const newUser = await this.authRepository.save({ email: email });

    return this.SignToken(newUser, newUser.email);
  }

  // async findUser(id: number) {
  //   const user = await this.authRepository.findOneBy({ id });

  //   return user;
  // }

  async SignToken(user: Auth, email: string) {
    const payload = {
      sub: user.id,
      email: email,
    };

    const secret = this.config.get('JWT_SECRET');

    const Token = await this.jwt.signAsync(payload, {
      expiresIn: '24h',
      secret: secret,
    });

    return { type: 'Success', access_token: Token, user };
  }
}
