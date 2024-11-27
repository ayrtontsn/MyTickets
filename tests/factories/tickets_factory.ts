import prisma from "database";

export async function create_ticket(code:string, owner: string, eventId: number) {
    return await prisma.ticket.create({
        data:{
            code,
            owner,
            eventId
        }
    })
}