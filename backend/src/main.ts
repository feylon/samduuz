import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { validationExceptionFactory } from './common/utils/validation-factory';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);
  const port = config.get<number>('APP_PORT', 5454);
  const origins = config
    .get<string>('CORS_ORIGINS', '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.set('trust proxy', 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(compression());
  app.enableCors({ origin: origins, credentials: true });
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
      exceptionFactory: validationExceptionFactory,
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new AllExceptionsFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SamDU.uz API')
    .setDescription(
      'Sharof Rashidov nomidagi Samarqand davlat universiteti rasmiy sayti uchun REST API. ' +
        'Ommaviy endpointlar `Accept-Language` sarlavhasi (uz, kr, ru, en) yoki `lang` query parametri orqali tarjima qilingan ma’lumot qaytaradi.',
    )
    .setVersion('1.0.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .addGlobalParameters({
      name: 'Accept-Language',
      in: 'header',
      required: false,
      schema: { type: 'string', enum: ['uz', 'kr', 'ru', 'en'], default: 'uz' },
    })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs/json',
    swaggerOptions: { persistAuthorization: true, docExpansion: 'none', tagsSorter: 'alpha' },
    customSiteTitle: 'SamDU.uz API',
  });

  app.enableShutdownHooks();
  await app.listen(port, '0.0.0.0');
  Logger.log(`API: http://localhost:${port}/api | Swagger: http://localhost:${port}/docs`, 'Bootstrap');
}

void bootstrap();
