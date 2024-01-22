# Express-bullmq project for testing

## Jobs examples

### Sucessfull job

```json
{
    "data": {
        "steps": 7,
        "fail": false,
        "delay": 1500
    },
    "options": {
        "delay": 500,
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
        "delay": 500,
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
