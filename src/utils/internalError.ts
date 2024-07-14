import { Response } from "express"

export const internalError = (res: Response, error: Error) => {
  console.log(error)
  res.status(500).json({ message: "Internal error. Please try again." })
  return
}
