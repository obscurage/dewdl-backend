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

    describe("Viewing a specific event", () => {
        test("Succeed with a valid id", async () => {
            const eventsAtStart = await helper.eventsInDb();
            const eventToView = eventsAtStart[0];
            const resultEvent = await api
                .get(`/api/v1/event/${eventToView.id}`)
                .expect(200)
                .expect("Content-Type", /application\/json/);
            const processedEventToView = JSON.parse(JSON.stringify(eventToView));

            expect(resultEvent.body).toEqual(processedEventToView);
        });

        test("Fail with statuscode 404 - event does not exist", async () => {
            const validNonexistingId = await helper.nonExistingId();

            await api
                .get(`/api/v1/event/${validNonexistingId}`)
                .expect(404);
        });

        test("Fail with statuscode 400 - id is invalid", async () => {
            const invalidId = "123123soitaheti";

            await api
                .get(`/api/v1/event/${invalidId}`)
                .expect(400);
        });
    });    
});


afterAll(() => {
    mongoose.connection.close();
});