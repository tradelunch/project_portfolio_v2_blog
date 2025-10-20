import express from "express";
import { router } from "@/src/controllers";

export const app = express();

app.use("/ping", (_, res) => {
	res.json({
		status: "ok",
		msg: "pong",
	});
});

app.use("/v1", router);
