import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CadenceModule } from './cadences/cadence.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';

@Module({
  imports: [CadenceModule, EnrollmentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
