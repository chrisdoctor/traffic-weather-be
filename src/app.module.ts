import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrafficService } from './traffic/traffic.service';
import { HttpModule } from '@nestjs/axios';
import { TrafficController } from './traffic/traffic.controller';
import { TrafficModule } from './traffic/traffic.module';

@Module({
  imports: [HttpModule, TrafficModule],
  controllers: [AppController, TrafficController],
  providers: [AppService, TrafficService],
})
export class AppModule {}
