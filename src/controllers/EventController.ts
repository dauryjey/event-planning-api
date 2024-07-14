import { Request, Response } from "express"
import { Event } from "@prisma/client"
import EventQueries from "../queries/EventQueries"
import { internalError } from "../utils/internalError"

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
    internalError(res, error)
    return
  }
}

async function getEventById(req: Request, res: Response): Promise<void> {
  const { id } = req.params

  if (!id) {
    res.status(400).json({ message: "ID Required!" })
    return
  }

  try {
    const event = await EventQueries.getEventById(id)

    if (!event) {
      res.status(204)
      return
    }

    res.status(200).json(event)
  } catch (error) {
    internalError(res, error)
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
    internalError(res, error)
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
    console.log(updatedEvent)
    res.status(200).json(updatedEvent)
    return
  } catch (error) {
    console.log(error)

    internalError(res, error)
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

    internalError(res, error)
    return
  }
}

export default {
  retrieveEvents,
  getEventById,
  createEvent,
  deleteEvent,
  updateEvent,
} as const
