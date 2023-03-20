## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Installation Ngrok 

- https://ngrok.com/download

## Running the ngrok

```bash
$  ngrok http 3000
```

## development
$ npm run start

# watch mode
$ npm run start:dev

## production mode
$ npm run start:prod

## Running the app with Docker (dev)

Prepare environment variables
```bash
$ cp .env.example .env
```

For M1 chip
```
$ docker-compose -f docker-compose.arm64.yml up -d --build -V dev 
```

For Intel chip
```
$ docker-compose up -d --build -V dev
```

Migrate database
```
$ docker-compose exec dev npm run migrate:up
```

## Running the app with Docker (production)

```bash
% Creat file .env and coppy data from .env.example
$ cp .env.example .env  
<!-- Creat container prod BE and run API on port 3000 -->
$ docker-compose up -d --build -V prod
$ docker-compose exec prod npm run migrate:up
```