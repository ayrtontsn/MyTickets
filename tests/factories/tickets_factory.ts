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

export async function get_ticket_byId(id: number) {
    return await prisma.ticket.findUnique({
        where:{
            id
        }
    })
}