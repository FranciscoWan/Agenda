import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';

@Module({
    imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,
  ],
  providers: [UserService],

})
export class UserModule {}
