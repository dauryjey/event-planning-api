import express, { Application, Response } from "express"
import cors from "cors"
import { ApiRouter } from "./routes/ApiRouter"

const app: Application = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res: Response) => {
	res.status(200).send("It's working")
})

app.use("/api", ApiRouter)

app.listen(PORT, () => {
	console.log("Server listening on PORT:", PORT)
})

export default app