import { Module } from '@nestjs/common';
import { TrafficService } from './traffic.service';
import { TrafficController } from './traffic.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    providers: [TrafficService],
    controllers: [TrafficController]
})
export class TrafficModule {}
