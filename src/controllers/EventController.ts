import { Request, Response } from "express"
import { Event } from "@prisma/client"
import EventQueries from "../queries/eventQueries"

async function retrieveEvents(_: Request, res: Response): Promise<void> {
  try {
    const events = await EventQueries.getAllEvents()

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
  try {
    const eventId = await EventQueries.createEvent(req.body as Event)

    const newEvent = await EventQueries.getEventById(eventId)

    res.status(201).json(newEvent)
    return
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal error. Please try again." })
    return
  }
}

async function updateEvent(req: Request, res: Response): Promise<void> {
  const { id } = req.params

  if (!id) {
    res.status(400).json({ message: "ID Required!" })
    return
  }

  const doesEventExist = EventQueries.getEventById(id)

  if (!doesEventExist) {
    res.status(400).json({ message: "Event not found" })
    return
  }

  try {
    const updatedEvent = await EventQueries.updateEvent(id, req.body)

    res.status(200).json(updatedEvent)
    return
  } catch (error) {
    console.log(error)

    res.status(500).json({ message: "Internal error. Please try again." })
    return
  }
}

async function deleteEvent(req: Request, res: Response): Promise<void> {
  const { id } = req.params

  if (!id) {
    res.status(400).json({ message: "ID Required!" })
    return
  }

  try {
    await EventQueries.deleteEvent(id)

    res.status(200).json({ message: "Deleted!" })
    return
  } catch (error) {
    console.log(error)

    res.status(500).json({ message: "Internal error. Please try again." })
    return
  }
}

export default {
  retrieveEvents,
  createEvent,
  deleteEvent,
  updateEvent,
} as const
