import { Controller, Get, Res, HttpStatus, Param, NotFoundException } from '@nestjs/common';
import { TrafficService } from './traffic.service';

@Controller('traffic')
export class TrafficController {
    constructor(private trafficService: TrafficService) { }

    @Get('traffic/:param')
    async getTraffic(@Res() res, @Param('param') dateTime) { // a middleware can be used to check correctness of date-time parameter
        const traffic = await this.trafficService.getTraffic(dateTime);
        if (!traffic) {
            throw new NotFoundException('No records available');
        }
        return res.status(HttpStatus.OK).json(traffic);
    }
}
