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

    describe("Test initial events", () => {
        test("Events are returned as json", async () => {
            await api
                .get("/api/v1/event/list")
                .expect(200)
                .expect("Content-Type", /application\/json/);
        });

        test("All events are returned", async () => {
            const response = await api.get("/api/v1/event/list");

            expect(response.body).toHaveLength(helper.initialEvents.length);
        });

        test("A specific event is with the returned events", async () => {
            const response = await api.get("/api/v1/event/list");

            const names = response.body.map(r => r.name);
            expect(names).toContain("Tabletop gaming");
        });
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

    describe("Add a new event", () => {

        test("Succeed with valid data", async () => {
            const newEvent = {
                "name": "Jake's secret party yes",
                "dates": [
                    "2014-01-01",
                    "2014-01-05",
                    "2014-01-12"
                ]
            };

            await api
                .post("/api/v1/event/")
                .send(newEvent)
                .expect(200)
                .expect("Content-Type", /application\/json/);

            const eventsAtEnd = await helper.eventsInDb();
            expect(eventsAtEnd).toHaveLength(helper.initialEvents.length + 1);

            const names = eventsAtEnd.map(e => e.name);
            expect(names).toContain("Jake's secret party yes");
        });

        test("Fail with status code - 400 invalid data", async () => {
            const newEvent = {
                "dates": [
                    "2014-01-01"
                ]
            };

            await api
                .post("/api/v1/event/")
                .send(newEvent)
                .expect(400);

            const eventsAtEnd = await helper.eventsInDb();

            expect(eventsAtEnd).toHaveLength(helper.initialEvents.length);
        });
    });

    describe("Add vote to an event", () => {

        test("Succeed with valid data", async () => {
            const eventsAtStart = await helper.eventsInDb();
            const eventIdToView = eventsAtStart[0].id;

            const newVote = {
                "name": "Dick",
                "votes": [
                    "2014-01-01",
                    "2014-01-05"
                ]
            };

            const expectedName = [newVote.name];

            expect(eventsAtStart[0].votes).toHaveLength(1);
            expect(eventsAtStart[0].votes[0].people).not.toEqual(expect.arrayContaining(expectedName));

            await api
                .post(`/api/v1/event/${eventIdToView}/vote`)
                .send(newVote)
                .expect(200)
                .expect("Content-Type", /application\/json/);

            const eventsAtEnd = await helper.eventsInDb();

            expect(eventsAtEnd[0].votes).toHaveLength(eventsAtStart[0].votes.length + 1);
            expect(eventsAtEnd[0].votes[0].people).toEqual(expect.arrayContaining(expectedName));
            expect(eventsAtEnd[0].votes[1].date).toEqual(newVote.votes[1]);
            expect(eventsAtEnd[0].votes[1].people).toEqual(expect.arrayContaining(expectedName));
        });

        test("Fail with statuscode 400 - invalid data: missing name", async () => {
            const eventsAtStart = await helper.eventsInDb();
            const eventIdToView = eventsAtStart[0].id;

            const newVote = {
                "votes": [
                    "2014-01-01",
                    "2014-01-05"
                ]
            };

            await api
                .post(`/api/v1/event/${eventIdToView}/vote`)
                .send(newVote)
                .expect(400);
        });

        test("Fail with statuscode 400 - invalid data: missing votes", async () => {
            const eventsAtStart = await helper.eventsInDb();
            const eventIdToView = eventsAtStart[0].id;

            const newVote = {
                "name": "Dick"
            };

            await api
                .post(`/api/v1/event/${eventIdToView}/vote`)
                .send(newVote)
                .expect(400);
        });

        test("Fail with statuscode 400 - invalid ID", async () => {
            const invalidId = "123123soitaheti";

            const newVote = {
                "name": "Dick",
                "votes": [
                    "2014-01-01",
                    "2014-01-05"
                ]
            };

            await api
                .post(`/api/v1/event/${invalidId}/vote`)
                .send(newVote)
                .expect(400);
        });

        test("Fail with statuscode 404 - non-existing ID", async () => {
            const validNonexistingId = await helper.nonExistingId();

            await api
                .get(`/api/v1/event/${validNonexistingId}/vote`)
                .expect(404);
        });
    });

    describe("Get results of a specific event", () => {
        test("Succeed with one suitable date before adding vote - Jake's secret party", async () => {
            const eventsAtStart = await helper.eventsInDb();
            const eventToView = eventsAtStart[0];

            const resultEvent = await api
                .get(`/api/v1/event/${eventToView.id}/results`)
                .expect(200)
                .expect("Content-Type", /application\/json/);

            expect(resultEvent.body.suitableDates).toHaveLength(1);
        });

        test("Succeed with one suitable date after adding vote - Jake's secret party", async () => {
            const eventsAtStart = await helper.eventsInDb();
            const eventToView = eventsAtStart[0];

            const newVote = {
                "name": "Dick",
                "votes": [
                    "2014-01-01",
                    "2014-01-05"
                ]
            };

            const expectedName = [newVote.name];

            await api
                .post(`/api/v1/event/${eventToView.id}/vote`)
                .send(newVote)
                .expect(200)
                .expect("Content-Type", /application\/json/);

            const eventsAtEnd = await helper.eventsInDb();

            expect(eventsAtEnd[0].votes).toHaveLength(2);
            expect(eventsAtEnd[0].votes[0].people).toEqual(expect.arrayContaining(expectedName));

            const resultEvent = await api
                .get(`/api/v1/event/${eventToView.id}/results`)
                .expect(200)
                .expect("Content-Type", /application\/json/);

            expect(resultEvent.body.suitableDates).toHaveLength(1);
            expect(resultEvent.body.suitableDates[0].people).toEqual(expect.arrayContaining(expectedName));
        });

        test("Succeed with no suitable dates - Bowling night", async () => {
            const eventsAtStart = await helper.eventsInDb();
            const eventToView = eventsAtStart[1];

            const resultEvent = await api
                .get(`/api/v1/event/${eventToView.id}/results`)
                .expect(200)
                .expect("Content-Type", /application\/json/);

            expect(resultEvent.body.suitableDates).toHaveLength(0);
        });

        test("Fail with statuscode 404 - non-existing ID", async () => {
            const validNonexistingId = await helper.nonExistingId();

            await api
                .get(`/api/v1/event/${validNonexistingId}/results`)
                .expect(404);
        });
    });
});


afterAll(() => {
    mongoose.connection.close();
});