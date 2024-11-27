import { faker } from "@faker-js/faker/.";
import prisma from "database";
import app from "index";
import supertest from "supertest"
import { create_event } from "./factories/events_factory";
import { create_ticket, get_ticket_byId, update_ticket_byId } from "./factories/tickets_factory";

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

describe("fail post /tickets", () => {
    it("Criar tickets com evento que já ocorreu - erro forbidden", async () => {
        const { id } = await create_event(faker.company.name(), faker.date.past())

        const { status } = await api.post("/tickets").send({
            code: faker.internet.jwt(),
            owner: faker.person.fullName(),
            eventId: id
        })

        expect(status).toBe(403)
    })

    it("Criar tickets com code já cadastrado - erro conflic", async () => {
        const { id } = await create_event(faker.company.name(), faker.date.future())
        const code = faker.internet.jwt()
        const owner = faker.person.fullName()

        const ticket = await create_ticket(code, owner, id)

        const { status } = await api.post("/tickets").send({
            code: code,
            owner: faker.person.fullName(),
            eventId: id
        })

        expect(status).toBe(409)
    })

    it("Criar tickets faltando informação - erro unprocessable_entity", async () => {
        const { id } = await create_event(faker.company.name(), faker.date.future())
        const code = faker.internet.jwt()
        const owner = faker.person.fullName()

        const ticket = await create_ticket(code, owner, id)

        const { status } = await api.post("/tickets").send({
            code: code,
            owner: faker.person.fullName()
        })

        expect(status).toBe(422)
    })
})

describe("fail get /tickets", () => {
    it("ticket inválido - erro 404", async () => {

        const { status } = await api.get(`/tickets/-1`);
        expect(status).toBe(400)
    })
})

describe("fail put /tickets", () => {
    it("alterar ticket para evento passado - erro forbidden", async () => {
        const event = await create_event(faker.company.name(), faker.date.past())
        const ticket = await create_ticket(faker.internet.jwt(), faker.person.fullName(), event.id)

        const { status } = await api.put(`/tickets/use/${ticket.id}`);
        expect(status).toBe(403)
    })

    it("alterar ticket já alterado - erro forbidden", async () => {
        const event = await create_event(faker.company.name(), faker.date.future())
        const ticket = await create_ticket(faker.internet.jwt(), faker.person.fullName(), event.id)

        await update_ticket_byId(ticket.id)

        const { status } = await api.put(`/tickets/use/${ticket.id}`);
        expect(status).toBe(403)
    }) 
})