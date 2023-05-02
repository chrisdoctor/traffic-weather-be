import { Injectable } from '@nestjs/common';
import { Traffic, CameraItems } from './traffic.interface'
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map, tap } from 'rxjs';

@Injectable()
export class TrafficService {
    constructor(private readonly httpService: HttpService) { }
    
    async getTraffic(dateTime: string): Promise<CameraItems[]> {
        const url = 'https://api.data.gov.sg/v1/transport/traffic-images?date_time=2023-05-02T11%3A21%3A15'
        const data = await lastValueFrom(
            this.httpService.get(url).pipe(
                map(resp => resp.data),
                map(async data => {
                    const searchedData = this.searchData(data, 'abc')

                    const displayNames = await this.getLocDisplayName(searchedData)

                    let i: number = 0;
                    for (const obj of searchedData) {
                        obj.displayName = displayNames[i];
                        i++;
                    }

                    return searchedData;
                })
            )
        );
        return data;
    }

    private searchData = (data: Traffic, dateTime: string): CameraItems[] => {
        let param = dateTime;
        param = "2023-05-02T11:19:57+08:00";    
        const arr = data.items[0].cameras.filter(async (obj) => 
            obj.timestamp === param
        )

        return arr;
    }

    private getLocDisplayName = async (items: CameraItems[]): Promise<any> => {
        let displayNames = [];
        let fetchArr = [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const { latitude, longitude } = item.location;

            // Free reverse geo api
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`

            fetchArr.push(fetch(url));

            //Breakdown reverse geo calls by batches of 10 calls
            if (fetchArr.length === 10 || fetchArr.length === items.length || i === items.length - 1) {

                const tmpArr = await Promise.all(fetchArr)

                for (const tmpItem of tmpArr) {
                    const locResponse = await tmpItem.json();
                    displayNames.push(locResponse.display_name)
                }

                fetchArr = [];
            }
        }

        return displayNames;

    }
}
