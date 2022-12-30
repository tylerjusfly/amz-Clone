import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from '../auth.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, @InjectRepository(Auth) private authRepository: Repository<Auth>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const user = await this.authRepository.findOne({
      where: { id: payload.sub },
      relations: ['roles'],
    });

    const transformedUser = {
      id: user.id,
      email: user.email,
      bitconWallet: user.bitconWallet,
      bio: user.bio,
      roles: user.roles,
    };

    return transformedUser;
  }
}
