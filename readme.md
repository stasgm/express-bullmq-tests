# Express-bullmq project for testing

## REST API

The REST API to the example app is described below.

## Add a new job

### Request

`POST /jobs/`

```bash
curl -i -H 'Accept: application/json' -d '' -X POST http://localhost:3000/jobs
```

## Advance the clock

`POST /fake-timer/`

```bash
curl -i -H 'Accept: application/json' -d '' -X POST http://localhost:3000/fake-timer
```

Body params:

```json
{
    "months": 3
}
```

## Check the current server time

`GET /fake-timer/`

```bash
curl -i -H 'Accept: application/json' -X GET http://localhost:3000/fake-timer
```

## Reset time

`POST /fake-timer/reset/`

```bash
curl -i -H 'Accept: application/json' -d '' -X POST http://localhost:3000/fake-timer/reset
```

## Jobs body params examples

### Sucessfull job

```json
{
    "data": {
        "steps": 7,
        "fail": false,
        "delay": 1500
    },
    "options": {
        "priority": 1
    }
}
```

### Failed job

```json
{
    "data": {
        "steps": 7,
        "fail": true
    },
    "options": {
        "priority": 1
    }
}

```

### Delayed job

```json
{
    "data": {
        "steps": 7,
        "fail": false
    },
    "options": {
        "runAt": "2024-07-18",
        "priority": 1
    }
}
```
