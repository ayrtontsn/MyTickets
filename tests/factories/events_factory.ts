import prisma from "database";

export async function create_event(name:string, date: Date) {
    return await prisma.event.create({
        data:{
            name,
            date
        }
    })
}

export async function get_event_byId(id: number) {
    return await prisma.event.findUnique({
        where:{
            id
        }
    })
}