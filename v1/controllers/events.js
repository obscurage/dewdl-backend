const eventsRouter = require("express").Router();
const Event = require("../models/event");
const helpers = require("../../utils/helpers");

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

eventsRouter.post("/", async (request, response) => {
    const body = request.body;

    const event = new Event({
        name: body.name,
        dates: body.dates
    });

    const savedEvent = await event.save();
    response.json({ "id": savedEvent.id });
});

eventsRouter.post("/:id/vote", async (request, response) => {
    const voteName = request.body.name;
    const voteDates = request.body.votes;

    if (request.body === undefined || voteName === undefined || voteName === "" || voteDates === undefined || voteDates.length === 0) {
        return response.status(400).json({ error: "problems with content" });
    }

    // I bet this can be done more neatly.
    await Event.findById(request.params.id).then(event => {
        if (!event) return response.status(404).end();

        voteDates.forEach(voteDate => {
            if (event.votes.filter(e => e.date === voteDate).length === 0) {
                event.votes.push({
                    date: voteDate,
                    people: [voteName]
                });
                return;
            }

            event.votes.forEach(eventVote => {
                if (eventVote.date === voteDate) {
                    // @todo : handle distinct names?
                    eventVote.people.push(voteName);
                }
            });
        });

        event.save();
        response.json(event.toJSON());
    });
});

eventsRouter.get("/:id/results", async (request, response) => {
    await Event.findById(request.params.id).then(event => {
        if (!event) return response.status(404).end();
        
        // I bet this could be done more neatly as well...
        event = event.toJSON();
        const result = {
            "id": event.id,
            "name": event.name,
            "suitableDates": []
        };

        const names = [];
        event.votes.forEach(vote => {
            vote.people.forEach(name => {
                if (names.indexOf(name) === -1) {
                    names.push(name);
                }
            });
        });

        names.sort();

        event.votes.forEach(vote => {
            const peopleSorted = [...vote.people].sort();
            if (helpers.arrayEquals(peopleSorted, names)) {
                result.suitableDates.push({
                    "date": vote.date,
                    "people": vote.people
                });
            }
        });
        response.json(result);
    });

});

module.exports = eventsRouter;