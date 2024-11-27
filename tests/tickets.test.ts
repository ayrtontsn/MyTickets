import { faker } from "@faker-js/faker/.";
import prisma from "database";
import app from "index";
import supertest from "supertest"
import { create_event } from "./factories/events_factory";

const api = supertest(app)

beforeEach(async () => {
    await prisma.event.deleteMany();
    await prisma.ticket.deleteMany();
});

describe("post /tickets", () => {
    it("Criar tickets", async () => {
        const { id } = await create_event(faker.company.name(), faker.date.future())

        const { status, body } = await api.post("/tickets").send({
            code: faker.internet.jwt(),
            owner: faker.person.fullName(),
            eventId: id
        })

        expect(status).toBe(201)
        expect(body).toEqual(
            expect.objectContaining({
                code: expect.any(String),
                owner: expect.any(String),
                eventId: expect.any(Number)
            })
        )
    })
})