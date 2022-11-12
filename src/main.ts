import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Env } from './configuration/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); /*white list strips out element that are not in our DTO*/

  //for google Auth Implementation

  const corsOption = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  };

  app.enableCors({ origin: true });

  app.use(
    session({
      secret: Env.SecretKey,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('amz marketPlace')
    .setDescription('a crypto ecommerce project')
    .setVersion('1.0')
    .addTag('marketPlace')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 4000;

  await app.listen(port, async () => {
    console.info(`AMZcl API running on: ${await app.getUrl()}`);
  });
}
bootstrap();
