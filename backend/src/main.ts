import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const cookieName = process.env.REFRESHTOKEN_COOKIE_NAME || 'refresh_token';

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('API')
      .setDescription('Swagger Dev')
      .setVersion('1.0')
      .addCookieAuth(cookieName, {
        type: 'apiKey',
        in: 'cookie',
        name: cookieName,
      })
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        'accessToken',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: true,
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
