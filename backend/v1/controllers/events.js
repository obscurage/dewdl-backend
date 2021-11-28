const eventsRouter = require("express").Router();
const Event = require("../models/event");

eventsRouter.get("/list", (request, response) => {
    Event.aggregate([
        {
            $project: {
                _id: 0,
                id: "$_id",
                name: 1
            }
        }
    ]).exec((err, result) => {
        if (err) return response.send(err);
        response.json(result);
    });
});

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