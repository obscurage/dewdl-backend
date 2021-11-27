const eventsRouter = require("express").Router();
const Event = require("../models/event");

eventsRouter.get("/:id", (request, response, next) => {
    Event.findById(request.params.id)
    .then(event => {
        if (event) {
            response.json(event.toJSON());
        } else {
            response.status(404).end();
        }
    })
    .catch(error => next(error));
});

module.exports = eventsRouter;