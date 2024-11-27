import { faker } from "@faker-js/faker/.";
import prisma from "database";
import app from "index";
import supertest from "supertest"
import { create_event } from "./factories/events_factory";
import { create_ticket, get_ticket_byId } from "./factories/tickets_factory";

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

describe("get /tickets", () => {
    it("Retornar todos os tickets do evento", async () => {
        const { id } = await create_event(faker.company.name(), faker.date.future())
        await create_ticket(faker.internet.jwt(), faker.person.fullName(), id)
        await create_ticket(faker.internet.jwt(), faker.person.fullName(), id)

        const { status, body } = await api.get(`/tickets/${id}`);
        expect(status).toBe(200)
        expect(body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    code: expect.any(String),
                    owner: expect.any(String),
                    eventId: expect.any(Number)
                })
            ])
        )
    })
})

describe("put /tickets", () => {
    it("alterar tickets por id", async () => {
        const event = await create_event(faker.company.name(), faker.date.future())
        const ticket = await create_ticket(faker.internet.jwt(), faker.person.fullName(), event.id)

        const { status } = await api.put(`/tickets/use/${ticket.id}`);
        expect(status).toBe(204)

        const ticket_used = await get_ticket_byId(ticket.id)
        expect(ticket_used.used).toBe(true)

    }) 
})