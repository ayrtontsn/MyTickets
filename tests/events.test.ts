import app from "index";
import supertest from "supertest"
import { create_event } from "./factories/events_factory";
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

        const { status, body } = await api.put(`/events/${id}`).send({
            name: faker.company.name(),
            date: faker.date.future()
        })
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

describe("delete /events", () => {
    it("deletar eventos por id", async () => {
        const { id } = await create_event(faker.company.name(), faker.date.future())

        const { status } = await api.delete(`/events/${id}`)
        expect(status).toBe(204)
    })

})