const eventsRouter = require("express").Router();
const Event = require("../models/event");

eventsRouter.get("/list", async (request, response) => {
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

eventsRouter.get("/:id", async (request, response) => {
    const event = await Event.findById(request.params.id).exec();
    if (event) {
        response.json(event.toJSON());
    } else {
        response.status(404).end();
    }
});

module.exports = eventsRouter;