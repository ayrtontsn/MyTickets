import prisma from "database";

export async function create_event(name:string, date: Date) {
    return await prisma.event.create({
        data:{
            name,
            date
        }
    })
}