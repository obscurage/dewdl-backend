const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    dates: {
        type: [String],
        required: true
    },
    votes: [
        {
            date: String,
            people: [String]
        }
    ]
});

eventSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        returnedObject.votes.forEach(vote => {
            vote.id = vote._id.toString();
            delete vote._id;
        });
    }
});

module.exports = mongoose.model("Event", eventSchema);