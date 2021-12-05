# dewdl backend

dewdl is an implementation of [Eventshuffle backend API](https://gist.github.com/anttti/2b69aebc63687ebf05ec). 
It's somewhat like Doodle, but much simplified - hence the name.

The backend implements the API described in the [Eventshuffle gist](https://gist.github.com/anttti/2b69aebc63687ebf05ec). 
The application as a whole ought to comprise also of a frontend.

Plenty of stuffs still to do, but this could already be used!

Backend can be tried out at https://sleepy-cliffs-53305.herokuapp.com/api/v1/event/list

## Tech stack

dewdl is built utilizing the **MERN stack** with some additions. Check out [package.json](package.json) for details.

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


