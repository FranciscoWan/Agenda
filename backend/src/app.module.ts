import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './user/auth/auth.module';

@Module({
  imports: [    
    
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'config/.env',
    }), 
    UserModule,
    AuthModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
