// service are used to handle business Logic, conneting to db , editing fields
// uses The Injectable NestJs uses Under the hood

import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, QueryFailedError, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto';
import * as argon from 'argon2'; /* package for hashing passwords*/
import { Auth } from './auth.entity';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import { Role } from 'src/database/roles.entity';

//dependency Injection
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private jwt: JwtService,
    private config: ConfigService,
    private mailService: MailService,
  ) {}

  async Signup(dto: AuthDto) {
    try {
      //hashing password
      const hash = await argon.hash(dto.password);

      let rolesToAssign = [2];

      const roles = await this.roleRepository.findBy({ id: In(rolesToAssign) });

      if (roles.length !== rolesToAssign.length) {
        return { type: 'Error', message: 'Not all roles were found' };
      }

      // //save user to db
      const user = this.authRepository.create({
        email: dto.email,
        password: hash,
        roles,
      });

      const rolesname: Array<Role> = user.roles.map((role: any) => role.name);

      await this.authRepository.save(user);

      user.roles = rolesname;
      delete user.password;

      // //send mail
      await this.mailService.sendConfirmEmail(user.email);

      const { token, expiresIn } = await this.SignToken(user, user.email);

      return { type: 'Success', result: { access_token: token, expiresIn, user } };
    } catch (error) {
      console.log(error);
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
    const user = await this.authRepository.findOne({
      where: { email: dto.email },
      relations: ['roles'],
    });

    //does not exist , throw execption
    if (!user) return { type: 'Error', message: 'Incorrect Credentials' };

    //if exist , compare password
    const passMatch = await argon.verify(user.password, dto.password);

    //if password doesn't match , throw execption
    if (!passMatch) return { type: 'Error', message: 'Incorrect Credentials' };

    //if correct , send back users
    // get roles Ids
    const rolesname: Array<Role> = user.roles.map((role: any) => role.name);

    user.roles = rolesname;

    delete user.password;

    const { token, expiresIn } = await this.SignToken(user, user.email);

    return { type: 'Success', result: { access_token: token, expiresIn, user } };
  }

  async ValidateGoogleUser(email: string) {
    //find User
    const user = await this.authRepository.findOne({
      where: { email: email },
      relations: ['roles'],
    });

    //if found return

    if (user) {
      const rolesname: Array<Role> = user.roles.map((role: any) => role.name);

      user.roles = rolesname;
      const { token, expiresIn } = await this.SignToken(user, user.email);

      return { type: 'Success', result: { access_token: token, expiresIn, user } };
    }

    //else Create
    // const newUser = await this.authRepository.save({ email: email });

    return { type: 'Error', message: 'unable To Register with Google at this Moment' };
    // return this.SignToken(newUser, newUser.email,);
  }

  async SignToken(user: Auth, email: string) {
    const expiresIn = '12h'; // expired in 2days
    const payload = {
      sub: user.id,
      email: email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: expiresIn,
      secret: secret,
    });

    return { token, expiresIn };
  }

  async createRoles(name: string, createdBy: string) {
    try {
      if (!name) {
        return { type: 'Error', message: 'role name is not Provided' };
      }
      const role = this.roleRepository.create({ name: name });

      await this.roleRepository.save(role);

      return { type: 'Success', role };
    } catch (error) {
      return { type: 'Error', message: error.message };
    }
  }

  async assignRolesToUser(userId: number, roleIds: number[]) {
    try {
      const user = await this.authRepository.findOneBy({ id: userId });

      if (!user) {
        return { type: 'Error', message: 'User not Found' };
      }

      // Find the roles
      const roles = await this.roleRepository.findBy({ id: In(roleIds) });

      if (roles.length !== roleIds.length) {
        return { type: 'Error', message: 'Not all roles were found' };
      }

      // Assign Roles
      user.roles = roles;

      //Save All Changes Made To user data
      await this.authRepository.save(user);

      return { type: 'Success', message: 'Roles Successfully added' };
    } catch (error) {
      return { type: 'Error', message: error.message };
    }
  }

  async removeRolesFromUser(userId: number, roleid: number) {
    try {
      // return roleid;
      const user = await this.authRepository.findOne({
        where: { id: userId },
        relations: ['roles'],
      });

      if (!user) {
        return { type: 'Error', message: 'User not Found' };
      }

      // Filter Roles From users
      user.roles = user.roles.filter((role) => role.id !== +roleid);

      await this.authRepository.save(user);

      return { type: 'Success', message: 'Role Successfully Removed', user };
    } catch (error) {
      return { type: 'Error', message: error.message };
    }
  }
}
