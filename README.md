# HTML to X Converter

HTML to X Converter is a simple web application that allows you to convert HTML to various formats like PDF, PNG, and JPEG. You can host this service yourself without any hassle.

## How to run locally

### As docker-compose - for testing out
NOTE: This service requires a Playwright instance to be running on the same machine. 
I have made this service docker-compose compatible, so you don't need to install Playwright on your machine.

1. Clone the repository
1. Run `./run.sh`
1. Access the service at [http://localhost:3000](http://localhost:3000)

### As docker-compose - for local development
1. Clone the repository
1. Run `./run-dev.sh`
1. Access the service at [http://localhost:3000](http://localhost:3000)


## API routes
| Method | Endpoint            | Request Body                         | Response Body                      | Curl example |
|--------|---------------------|--------------------------------------|------------------------------------|--------------|
| POST   | `/api/html-to-pdf`  | `{ "base64EncodedHtml": "..." }`     | `{ "base64EncodedPdf": "..." }`    | `curl -X POST -H "Content-Type: application/json" -d '{"base64EncodedHtml": "[base64EncodedHtml]"}' http://localhost:3000/api/html-to-pdf` |
| POST   | `/api/html-to-png`  | `{ "base64EncodedHtml": "..." }`     | `{ "base64EncodedPng": "..." }`    | `curl -X POST -H "Content-Type: application/json" -d '{"base64EncodedHtml": "[base64EncodedHtml]"}' http://localhost:3000/api/html-to-png` |
| POST   | `/api/html-to-jpeg` | `{ "base64EncodedHtml": "..." }`     | `{ "base64EncodedJpeg": "..." }`   | `curl -X POST -H "Content-Type: application/json" -d '{"base64EncodedHtml": "[base64EncodedHtml]"}' http://localhost:3000/api/html-to-jpeg`|
| GET    | `/api/ping`         | None                                 | `{ "status": "OK \| FAILED" }`     | `curl -X GET http://localhost:3000/api/ping`                                                                                               |


## Docker ENVIRONMENT variables
| Parameter                 | Description                              | Default                |
|---------------------------|------------------------------------------|------------------------|
| SHUTDOWN_ON_FAILED_PING   | Shutdown the application on failed ping  | false                  |
| CONVERT_QUEUE_CONCURRENCY | Number of concurrent conversions         | 10                     |
