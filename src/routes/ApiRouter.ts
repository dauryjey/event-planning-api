import { Router } from "express"
import EventRouter from "./EventRouter"

export const ApiRouter = Router()

ApiRouter.use("/event", EventRouter.router)
