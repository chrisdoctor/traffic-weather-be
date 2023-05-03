import { Injectable } from '@nestjs/common';
import { Traffic, CameraItems, WeatherItems, Coordinates } from './traffic.interface'
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class TrafficService {
    constructor(private readonly httpService: HttpService) { }
    
    async getTraffic(dateTime: string): Promise<CameraItems[]> {
        const url = `https://api.data.gov.sg/v1/transport/traffic-images?date_time=${encodeURIComponent(dateTime)}`
        const trafficData = await lastValueFrom(
            this.httpService.get(url).pipe(
                map(resp => resp.data),
                map(async data => {
                    const cameraData = this.extractCamData(data)
                    const displayNames = await this.getLocDisplayName(cameraData)

                    let i: number = 0;
                    for (const obj of cameraData) {
                        obj.displayName = displayNames[i];
                        i++;
                    }

                    return cameraData;
                })
            )
        );

        const weatherData = await this.getWeather(dateTime);

        console.log('weatherData', weatherData.items[0]);
        this.setLocationWeather(trafficData, weatherData);

        // console.log(trafficData);
        return trafficData;
    }

    private extractCamData = (data: Traffic): CameraItems[] => { 
        return data.items[0].cameras
    }

    private getLocDisplayName = async (items: CameraItems[]): Promise<any> => {
        let displayNames = [];
        let fetchArr = [];

        const BATCH_SIZE = 10;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const { latitude, longitude } = item.location;

            // Free reverse geo api
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`

            fetchArr.push(fetch(url));

            //Breakdown reverse geo calls by batches of 10 calls
            if (fetchArr.length === BATCH_SIZE || fetchArr.length === items.length || i === items.length - 1) {

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

    async getWeather(dateTime: string): Promise<any> {
        const dateOnly = dateTime.substring(0, 10);
        const url = `https://api.data.gov.sg/v1/environment/2-hour-weather-forecast?date_time=${encodeURIComponent(dateTime)}&date=${dateOnly}`;
        // console.log(url);
        const data = await lastValueFrom(
            this.httpService.get(url).pipe(
                map(resp => resp.data)
            )
        );
        return data;
    }

    setLocationWeather(trafficData: CameraItems[], weatherData: WeatherItems): CameraItems[] {
        for (const trafficItem of trafficData) {
            trafficItem.area = this.getNearestArea(trafficItem.location, weatherData);
            trafficItem.weather = this.getAreaWeather(trafficItem.area, weatherData)
        }

        return trafficData;
    }

    getNearestArea(trafficPos: Coordinates, weatherData: WeatherItems): string {
        let minDist: number = Number.MAX_VALUE;
        let minDistArea: string = '';

        for (const area of weatherData.area_metadata) {
            const { latitude: lat1, longitude: long1 } = trafficPos;
            const { latitude: lat2, longitude: long2 } = area.label_location;
            const curDist = this.distance(lat1, long1, lat2, long2, 'N');

            if (curDist < minDist) {
                minDist = curDist
                minDistArea = area.name
            }
        }

        return minDistArea
    }

    getAreaWeather(area: string, weatherData: WeatherItems): string {
        let weatherForecast: string;

        for (const forecast of weatherData.items[0].forecasts) {
            weatherForecast = area == forecast.area ? forecast.forecast : weatherForecast;
        }

        return weatherForecast
    }

    // Longitude/latitude comparison available publicly from
    // https://www.geodatasource.com/developers/javascript
    distance(lat1, lon1, lat2, lon2, unit) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1/180;
            var radlat2 = Math.PI * lat2/180;
            var theta = lon1-lon2;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit=="K") { dist = dist * 1.609344 }
            if (unit=="N") { dist = dist * 0.8684 }
            return dist;
        }
    }
}
