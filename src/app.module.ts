import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // configModule for get env variable data 
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    // connect to database with typeorm
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // اگر ConfigModule گلوبال است، این خط اختیاری است
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASS'),
        database: configService.get('DB_NAME'),
        namingStrategy: new SnakeNamingStrategy(),
        autoLoadEntities: true,
        synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },

  ],
})
export class AppModule { }
