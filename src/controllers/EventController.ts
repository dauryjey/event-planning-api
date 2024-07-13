import { Request, Response } from "express"
import { Event, Prisma } from "@prisma/client"
import { prisma } from "../utils/db"
import { createId } from "@paralleldrive/cuid2"

async function retrieveEvents(_: Request, res: Response): Promise<void> {
  try {
    const events: Event[] = await prisma.$queryRaw`SELECT * FROM "Event"`

    if (!events || events.length === 0) {
      res.status(204)
      return
    }

    res.status(200).json(events)
    return
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal error. Please try again." })
    return
  }
}

async function createEvent(req: Request, res: Response): Promise<void> {
  const { name, date, location, userId } =
    req.body as Prisma.EventUncheckedCreateInput

  const id = createId()

  try {
    await prisma.$queryRaw`INSERT INTO "Event" (id, name, date, location, "userId", "createdAt", "updatedAt") 
      VALUES (${id}, ${name}, ${date}::date, ${location}, ${userId}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`

    const newEvent: Event[] =
      await prisma.$queryRaw`SELECT * FROM "Event" WHERE "id" = ${id}`

    res.status(201).json(newEvent[0])
    return
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal error. Please try again." })
    return
  }
}

async function updateEvent(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  const update = req.body

  if (!id) {
    res.status(400).json({ message: "ID Required!" })
    return
  }

  const doesEventExist =
    (await prisma.$queryRaw`SELECT * FROM "Event" WHERE "id" = ${id}`) as Event[]

  if (doesEventExist.length === 0) {
    res.status(400).json({ message: "Event not found" })
    return
  }

  try {
    if (update.name) {
      console.log(update.name)
      await prisma.$queryRaw`UPDATE "Event" SET name = ${update.name} WHERE id = ${id}`
    }

    if (update.date) {
      await prisma.$queryRaw`UPDATE "Event" SET "date" = ${update.date}::date WHERE id = ${id}`
    }

    if (update.location) {
      await prisma.$queryRaw`UPDATE "Event" SET location = ${update.location} WHERE id = ${id}`
    }

    await prisma.$queryRaw`UPDATE "Event" SET "updatedAt" = CURRENT_TIMESTAMP`

    const updatedEvent: Event[] =
      await prisma.$queryRaw`SELECT * FROM "Event" WHERE "id" = ${id}`

    res.status(200).json(updatedEvent)
    return
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal error. Please try again." })
    return
  }
}

export default { retrieveEvents, createEvent, updateEvent } as const
