import express from "express";
import { router } from "@/src/controllers";

export const app = express();

app.use("/v1", router);
