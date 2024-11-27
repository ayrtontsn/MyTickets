import app from "index";
import supertest from "supertest"
import { create_event, get_event_byId } from "./factories/events_factory";
import { faker } from '@faker-js/faker';
import prisma from "database";


const api = supertest(app)

beforeEach(async () => {
    await prisma.event.deleteMany();
});

describe("post /events", () => {
    it("Criar eventos", async () => {
        //criar cenário
        const { status, body } = await api.post("/events").send({
            name: faker.company.name(),
            date: faker.date.future()
        })

        expect(status).toBe(201)
        expect(body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                date: expect.any(String)
            })
        )
    })
})

describe("get /events", () => {
    it("Retornar todos os eventos", async () => {
        //criar cenário
        await create_event(faker.company.name(), faker.date.future())
        await create_event(faker.company.name(), faker.date.future())

        const { status, body } = await api.get("/events");
        expect(status).toBe(200)
        expect(body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    date: expect.any(String)
                })
            ])
        )
    })

    it("Retornar todos eventos por id", async () => {
        //criar cenário
        const { id } = await create_event(faker.company.name(), faker.date.future())

        const { status, body } = await api.get(`/events/${id}`);
        expect(status).toBe(200)
        expect(body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                date: expect.any(String)
            })
        )
    })

})

describe("put /events", () => {
    it("editar eventos por id", async () => {
        const { id } = await create_event(faker.company.name(), faker.date.future())

        const name = faker.company.name()
        const date = faker.date.future()

        const { status, body } = await api.put(`/events/${id}`).send({
            name,
            date
        })
        const event = await get_event_byId(id)

        expect(status).toBe(200)
        expect(body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                date: expect.any(String)
            })
        )
        expect(event.name).toEqual(name)
        expect(event.date).toEqual(date)
    })

})

describe("delete /events", () => {
    it("deletar eventos por id", async () => {
        const { id } = await create_event(faker.company.name(), faker.date.future())

        const { status } = await api.delete(`/events/${id}`)
        expect(status).toBe(204)
    })

})

describe("fail post/events", () => {
    it("Criar eventos e dar erro de conflito (mesmo nome)", async () => {
        const name = faker.company.name()
        const date = faker.date.future()

        await create_event(name, date)
        const { status } = await api.post("/events").send({
            name,
            date
        })
        expect(status).toBe(409)
    })
})

describe("fail get/events", () => {
    it("retornar evento sem id cadastrado - erro not_found", async () => {
        const { status } = await api.get(`/events/2`)
        expect(status).toBe(404)
    })
})