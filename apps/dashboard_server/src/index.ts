import { initializeDatabase } from '@/src/database';
import { app } from './server';
import { SERVER_PORT, HOST_NAME } from '@/src/config/env.schema';
import { sequalizeP } from '@/src/database';
import { SSHTunnelManager } from '@/src/utils/ssh.tunnel';
import { sshConfig } from '@/src/config/env.database';
import { Sequelize } from 'sequelize';

//  etc
// src/server.ts
// import { SSHTunnelManager } from '@utils/sshTunnel';
// import { sshConfig } from '@config/env';

async function shutdown(signal: string, db: Sequelize): Promise<void> {
    console.log(`${signal} received`);

    try {
        await db.close();

        if (tunnelManager) {
            await tunnelManager.close();
        }

        process.exit(0);
    } catch (error) {
        console.error('Shutdown error:', error);
        process.exit(1);
    }
}
let tunnelManager: SSHTunnelManager | null = null;

(async () => {
    try {
        // SSH tunnel create
        // if (sshConfig) {
        //     tunnelManager = new SSHTunnelManager(sshConfig);
        //     await tunnelManager.create();
        // }

        // Database init
        const db = await initializeDatabase(sequalizeP);

        // Express server start
        app.listen(SERVER_PORT, () => {
            console.log(
                `Backend listening on port http://${HOST_NAME}:${SERVER_PORT}/ping`
            );
        });

        process.on('SIGTERM', () => shutdown('SIGTERM', db));
        process.on('SIGINT', () => shutdown('SIGINT', db));
    } catch (error) {
        console.error('Server startup failed:', error);
        process.exit(1);
    }
})();
