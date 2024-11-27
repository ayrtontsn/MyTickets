import app from "index";
import supertest from "supertest"
import { create_event } from "./factories/events_factory";
import { faker } from '@faker-js/faker';
import prisma from "database";


const api = supertest(app)

beforeEach(async () => {
    await prisma.event.deleteMany();
  });

  describe("post /events",()=>{
    it("Criar eventos",async ()=>{
        //criar cenário
        const {status, body} = await api.post("/events").send({
            name: faker.company.name(),
            date: faker.date.future()
        })

        expect (status).toBe(201)
        expect (body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                date: expect.any(String)
            })
        )
    })
})

describe("get /events",()=>{
    it("Retornar todos os eventos",async ()=>{
        //criar cenário
        await create_event(faker.company.name(), faker.date.future())
        await create_event(faker.company.name(), faker.date.future())
        
        const {status, body} = await api.get("/events");
        expect (status).toBe(200)
    })
})