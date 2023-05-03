# Traffic and Weather Data - Backend App

## Usage

Install the packages with NPM:

```sh
npm install
```

Run the application,

```sh
npm run start:dev
```

The application will run locally using port 5000:

```sh
http://localhost:5000/
```

## API

This application exposes only one API:

```sh
http://localhost:5000/traffic/traffic/{date and time parameter}
```

It returns an array of objects with the following structure:

```sh
{
  area: "Tengah"
  camera_id: "6715"
  displayName: "Hong Kah Flyover, Pan-Island Expressway, Hong Kah, Jurong West, Southwest, 640558, Singapore"
  image: "https://images.data.gov.sg/api/traffic-images/2023/05/2563758b-bee3-4b7b-9de5-2f2806a05cd8.jpg"
  image_metadata: {height: 1080, width: 1920, md5: '29d311b38797fed096395a0b29d7754e'}
  location: {latitude: 1.356299, longitude: 103.716071}
  timestamp: "2023-05-02T18:41:53+08:00"
  weather: "Partly Cloudy (Night)"
}
```

The application uses the following APIs to build it's data:

- For traffic images: https://data.gov.sg/dataset/traffic-images
- For weather forecasts: https://data.gov.sg/dataset/weather-forecast
- For reverse geocoding: https://nominatim.openstreetmap.org/reverse

It also uses publicly available code from the site below to compute distance between two pairs of coordinates:

- https://www.geodatasource.com/developers/javascript

## Notes

There are minimal error handling implemented in the application.
API calls are mostly assumed to be successful.

Error handling discussions are points in improvement, both in this application and the requirements documentation, i.e. what error scenarios to handle, what error messages and screens to transition to.

URLs are hardcoded currently, but can be placed in a configuration file for ease of management.

No API keys are used in the application, hence the absence of an env file.
