import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  // Config service
  const configService = app.get(ConfigService)
  const port = configService.get('PORT')
  const appName = configService.get('APP_NAME')

  // Enbable validatino global
  app.useGlobalPipes(new ValidationPipe());

  // enable response transformation
  app.useGlobalInterceptors(new TransformResponseInterceptor)

  // @swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Api swagger')
    .setDescription('')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig, {
    include: [AppModule],
    deepScanRoutes: true
  })
  SwaggerModule.setup('/api/docs', app, swaggerDocument)

  await app.listen(process.env.PORT ?? 3000);
  console.log(`☕ Applicatoin  ${appName} is running on : ${port}`)

}
void bootstrap();
