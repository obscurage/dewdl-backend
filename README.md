# General information

dewdl is an implementation of [Eventshuffle backend API](https://gist.github.com/anttti/2b69aebc63687ebf05ec). 
It's somewhat like Doodle, but much simplified - hence the name.

The backend implements the API described in the [Eventshuffle gist](https://gist.github.com/anttti/2b69aebc63687ebf05ec). 
The application as a whole ought to comprise also of a frontend, but it shall be seen if one should emerge.

Backend can be tried out at: https://sleepy-cliffs-53305.herokuapp.com/api/v1/event/list

## Tech stack

dewdl-backend is built utilizing Node.js, Express and MongoDB with some excess libraries. Check out [package.json](package.json) for details.

[MongoDB Atlas](https://www.mongodb.com/atlas/database) was utilized for providing the DB.

The current application itself is hosted via [Heroku](https://www.heroku.com/).

## Install and run

To get dewdl up and running, clone the repo and run `npm install`.

Create a `.env` file to the root of the repo. 
To the file, add the following variables:
```
MONGODB_URI=<DB URI>
MONGODB_URI_TEST=<Test DB URI>
PORT=3001
```

When these variables are set, you can start the backend by running `npm run start`.

## Project structure

The project consists of general application files and versioned API code.

[utils](utils) folder contains some general helper functionalities. 

With [utils/seed_db.js](utils/seed_db.js) you can insert initial content to the dev/production database which generates the situation that's described in [Eventshuffle backend API](https://gist.github.com/anttti/2b69aebc63687ebf05ec). Run the script with command `node utils/seed_db.js`

Inside the folder [v1](v1) lie the controllers and models, and for testing purposes some REST queries and test code.

[Procfile](Procfile) in the root of the project is related to Heroku deployment.

## Tests

You can run the test suite with `npm run test`.
Tests utilize their own database, so no need to worry about dev / production database's state.

In addition, you can utilize some tool to run individual REST queries from [v1/requests](v1/requests) folder.

# API description

`id`'s are in the form of 24 character strings consisting of letters and numbers.

Example id: `61ab39df01420b6f892196a7` (you can try this id with the [demo app](https://sleepy-cliffs-53305.herokuapp.com/api/v1/event/list)!)

## List all events
Endpoint: `/api/v1/event/list`

### Request
Method: `GET`

### Response
Body:

```
{
  "events": [
    {
      "id": <id_1>,
      "name": "Jake's secret party"
    },
    {
      "id": <id_2>,
      "name": "Bowling night"
    },
    {
      "id": <id_3>,
      "name": "Tabletop gaming"
    }
  ]
}
```

## Create an event
Endpoint: `/api/v1/event`

Notes: currently no date form validation in the backend. :\

### Request
Method: `POST`

Body:

```
{
  "name": "Jake's secret party",
  "dates": [
    "2014-01-01",
    "2014-01-05",
    "2014-01-12"
  ]
}
```

### Response
Body:

```
{
  "id": <new_id>
}
```

## Show an event
Endpoint: `/api/v1/event/{id}`

### Request
Method: `GET`

Parameters: `id`, `24 characters long string`

### Response
Body:

```
{
  "id": <id_1>,
  "name": "Jake's secret party",
  "dates": [
    "2014-01-01",
    "2014-01-05",
    "2014-01-12"
  ],
  "votes": [
    {
      "date": "2014-01-01",
      "people": [
        "John",
        "Julia",
        "Paul",
        "Daisy"
      ]
    }
  ]
}
```

## Add votes to an event
Endpoint: `/api/v1/event/{id}/vote`

Notes: currently no date form validation in the backend. :\

### Request
Method: `POST`

Parameters: `id`, `24 characters long string`

Body:

```
{
  "name": "Dick",
  "votes": [
    "2014-01-01",
    "2014-01-05"
  ]
}
```

### Response

```
{
  "id": <id_1>,
  "name": "Jake's secret party",
  "dates": [
    "2014-01-01",
    "2014-01-05",
    "2014-01-12"
  ],
  "votes": [
    {
      "date": "2014-01-01",
      "people": [
        "John",
        "Julia",
        "Paul",
        "Daisy",
        "Dick"
      ]
    },
    {
      "date": "2014-01-05",
      "people": [
        "Dick"
      ]
    }
  ]
}
```

## Show the results of an event
Endpoint: `/api/v1/event/{id}/results`
Responds with dates that are suitable for all participants. If no suitable dates are found, the `suitableDates` array will be empty.

### Request
Method: `GET`

Parameters: `id`, `24 characters long string`

### Response

```
{
  "id": <id_1>,
  "name": "Jake's secret party",
  "suitableDates": [
    {
      "date": "2014-01-01",
      "people": [
        "John",
        "Julia",
        "Paul",
        "Daisy",
        "Dick"
      ]
    }
  ]
}
```

API description borrowed mostly from [Eventshuffle backend API](https://gist.github.com/anttti/2b69aebc63687ebf05ec).