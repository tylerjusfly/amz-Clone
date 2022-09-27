// service are used to handle business Logic, conneting to db , editing fields
// uses The Injectable NestJs uses Under the hood

import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { AuthDto } from './dto';
import * as argon from 'argon2'; /* package for hashing passwords*/
import { Auth } from './auth.entity';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(Auth) private authRepository: Repository<Auth>) {}

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

      return { message: user };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.code === '23505') {
          throw new ForbiddenException('Credentials Taken');
        }
      }
      throw error;
    }
  }

  async Login(dto: AuthDto) {
    // find user By Email
    const user = await this.authRepository.findOneBy({ email: dto.email });
    //does not exist , throw execption
    if (!user) throw new ForbiddenException('credentials Incorrect');

    //if exist , compare password
    const passMatch = await argon.verify(user.password, dto.password);
    //if password doesn't match , throw execption
    if (!passMatch) throw new ForbiddenException('credentials Incorrect');

    //if correct , send back users
    delete user.password;

    return { user };
  }
}
