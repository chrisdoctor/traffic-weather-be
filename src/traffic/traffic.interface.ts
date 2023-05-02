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
    location: {
        longitude: number,
        latitude: number
    },
    displayName: string;
}