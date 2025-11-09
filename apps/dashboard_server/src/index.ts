import { establishDBConnection } from '@/src/db';
import { app } from './server';
import { PORT, HOST_NAME } from '@/src/env.schema';

(async () => {
    await establishDBConnection();
})();

app.listen(PORT, () => {
    console.log(`Backend listening on port http://${HOST_NAME}:${PORT}/ping`);
});
