import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        //host: 'smtp.example.com',
        service: 'gmail',
        secure: false,
        auth: {
          user: 'tylerjusfly1@gmail.com',
          pass: 'xszdqbdxxcvxmpgc',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@amzclone.com>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
