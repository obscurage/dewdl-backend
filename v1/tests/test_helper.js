const Event = require("../models/event");

const initialEvents = [
    {
        name: "Jake's secret party",
        dates: [
            "2014-01-01",
            "2014-01-05",
            "2014-01-12"
        ],
        votes: [{
            date: "2014-01-01",
            people: [
                "John",
                "Julia",
                "Paul",
                "Daisy"
            ]
        }]
    },
    {
        name: "Bowling night",
        dates: [
            "2016-05-28",
            "2016-05-29",
            "2016-05-30"
        ],
        votes: [
            {
                date: "2016-05-28",
                people: [
                    "Dewd",
                    "Dewdette"
                ]
            },
            {
                date: "2016-05-29",
                people: [
                    "Joku",
                    "Dewdette"
                ]
            },
            {
                date: "2016-05-30",
                people: [
                    "Joku",
                    "Dewd"
                ]
            }
        ]
    },
    {
        name: "Tabletop gaming",
        dates: [
            "2016-12-31",
            "2017-01-01"
        ]
    },
];

const nonExistingId = async () => {
    const event = new Event({ name: "willremovethissoon", dates: [], votes: [] });
    await event.save();
    await event.remove();

    return event._id.toString();
};

const eventsInDb = async () => {
    const events = await Event.find({});
    return events.map(event => event.toJSON());
};


module.exports = {
    initialEvents,
    nonExistingId,
    eventsInDb
};
