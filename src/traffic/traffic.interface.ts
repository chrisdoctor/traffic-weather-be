export interface Traffic {
    readonly items: TrafficItems[];
}

interface TrafficItems {
    timestamp: string;
    cameras: CameraItems[];
}

export interface CameraItems {
    timestamp: string;
    image: string;
    location: Coordinates,
    displayName: string;
    area: string;
    weather: string;
}

export interface WeatherItems {
    area_metadata: AreaMetadata[];
    items: Forecast[];
}

interface Forecast {
    timestamp: string;
    update_timestamp: string;
    forecasts: ForecastItem[]
}

interface ForecastItem {
    area: string;
    forecast: string;
}

interface AreaMetadata {
    name: string;
    label_location: Coordinates
}

export interface Coordinates {
    longitude: number,
    latitude: number
}