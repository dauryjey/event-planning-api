import { Event, Prisma } from "@prisma/client"
import { prisma } from "../utils/db"
import { createId } from "@paralleldrive/cuid2"

async function getAllEvents(): Promise<Event[]> {
  const events: Event[] = await prisma.$queryRaw`
		SELECT * FROM "Event"
	`
  return events
}

async function createEvent(
  event: Prisma.EventUncheckedCreateInput
): Promise<string> {
  const id = createId()
  const { name, date, location, userId } = event

  await prisma.$queryRaw`
			INSERT INTO "Event" (id, name, date, location, "userId", "createdAt", "updatedAt") 
   VALUES (${id}, ${name}, ${date}::date, ${location}, ${userId}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
			`

  return id
}

async function getEventById(eventId: string): Promise<Event> {
  const event = (await prisma.$queryRaw`
    SELECT * FROM "Event" WHERE "id" = ${eventId}
  `) as Event[]

  return event[0]
}

async function updateEvent(
  id: string,
  event: Prisma.EventUpdateInput
): Promise<Event> {
  if (event.name) {
    await prisma.$queryRaw`UPDATE "Event" SET name = ${event.name} WHERE id = ${id}`
  }

  if (event.date) {
    await prisma.$queryRaw`UPDATE "Event" SET "date" = ${event.date}::date WHERE id = ${id}`
  }

  if (event.location) {
    await prisma.$queryRaw`UPDATE "Event" SET location = ${event.location} WHERE id = ${id}`
  }

  await prisma.$queryRaw`UPDATE "Event" SET "updatedAt" = CURRENT_TIMESTAMP`

  const updatedEvent = getEventById(id)

  return updatedEvent
}

async function deleteEvent(id: string): Promise<void> {
  await prisma.$queryRaw`
    DELETE FROM "Event" WHERE "id" = ${id}
  `
  return
}

export default { getAllEvents, createEvent, getEventById, deleteEvent, updateEvent } as const
