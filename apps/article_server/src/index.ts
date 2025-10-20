import { app } from "./server";
import { PORT, HOST_NAME } from "@/src/env.schema";

app.listen(PORT, () => {
	console.log(`Backend listening on port http://${HOST_NAME}:${PORT}`);
});
