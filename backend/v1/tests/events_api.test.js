const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../../app");
const Event = require("../models/event");

const api = supertest(app);

describe("Database contains some events", () => {
    beforeEach(async () => {
        await Event.deleteMany({});
        await Event.insertMany(helper.initialEvents);
    });


    test("events are returned as json", async () => {
        await api
            .get("/api/v1/event/list")
            .expect(200)
            .expect("Content-Type", /application\/json/);
    });

    test("all events are returned", async () => {
        const response = await api.get("/api/v1/event/list");

        expect(response.body).toHaveLength(helper.initialEvents.length);
    });

    test("a specific event is with the returned events", async () => {
        const response = await api.get("/api/v1/event/list");
        
        const names = response.body.map(r => r.name);
        expect(names).toContain("Tabletop gaming");
    });
});


afterAll(() => {
    mongoose.connection.close();
});