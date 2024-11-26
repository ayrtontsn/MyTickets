import app from "index";
import supertest from "supertest"

const api = supertest(app)

describe("teste de health",()=>{
    it("retornar código 200",async ()=>{
        const result = await api.get("/health")
        expect(result.status).toBe(200)  
    });

});