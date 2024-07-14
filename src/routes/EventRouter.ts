import { Router } from "express"
import EventController from "../controllers/EventController"

const router = Router()

router.get("/", EventController.retrieveEvents)
router.get("/:id", EventController.getEventById)
router.post("/new", EventController.createEvent)
router.put("/update/:id", EventController.updateEvent)
router.delete("/delete/:id", EventController.deleteEvent)

export default { router } as const
