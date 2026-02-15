import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CadenceModule } from './cadences/cadence.module';

@Module({
  imports: [CadenceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
