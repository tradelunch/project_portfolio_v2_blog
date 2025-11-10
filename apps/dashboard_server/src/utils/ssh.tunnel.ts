// src/utils/sshTunnel.ts
import { Client, ConnectConfig } from 'ssh2';
import { createServer, Server as NetServer, Socket } from 'net';
import { readFileSync } from 'fs';

interface SSHTunnelConfig {
    host: string;
    port: number;
    username: string;
    keyPath?: string;
    privateKey?: string;
    useAgent: boolean;
    dstHost: string;
    dstPort: number;
    localPort: number;
}

interface TunnelConnection {
    server: NetServer;
    client: Client;
}

class SSHTunnelManager {
    private tunnel: TunnelConnection | null = null;
    private config: SSHTunnelConfig;

    constructor(config: SSHTunnelConfig) {
        this.config = config;
    }

    async create(): Promise<TunnelConnection | null> {
        if (process.env.NODE_ENV === 'production') {
            console.log('Production: SSH tunnel skipped');
            return null;
        }

        if (this.tunnel) {
            console.log('SSH tunnel already exists');
            return this.tunnel;
        }

        return new Promise((resolve, reject) => {
            const sshClient = new Client();
            const server = createServer((socket: Socket) => {
                sshClient.forwardOut(
                    socket.remoteAddress!,
                    socket.remotePort!,
                    this.config.dstHost,
                    this.config.dstPort,
                    (err, stream) => {
                        if (err) {
                            socket.end();
                            return;
                        }
                        socket.pipe(stream).pipe(socket);
                    }
                );
            });

            const sshConfig: ConnectConfig = {
                host: this.config.host,
                port: this.config.port,
                username: this.config.username,
                ...(this.config.keyPath
                    ? { privateKey: readFileSync(this.config.keyPath) }
                    : {}),
            };

            sshClient.on('ready', () => {
                server.listen(this.config.localPort, '127.0.0.1', () => {
                    this.tunnel = { server, client: sshClient };
                    console.log(
                        `SSH tunnel: localhost:${this.config.localPort} -> ${this.config.dstHost}:${this.config.dstPort}`
                    );
                    this.setupHandlers();
                    resolve(this.tunnel);
                });
            });

            sshClient.on('error', (err) => {
                console.error('SSH connection error:', err);
                reject(err);
            });

            sshClient.connect(sshConfig);
        });
    }

    private setupHandlers(): void {
        if (!this.tunnel) return;

        this.tunnel.client.on('error', (err) => {
            console.error('SSH client error:', err);
            this.tunnel = null;
        });

        this.tunnel.client.on('end', () => {
            console.log('SSH client disconnected');
            this.tunnel = null;
        });

        this.tunnel.client.on('close', () => {
            console.log('SSH client closed');
        });

        this.tunnel.server.on('error', (err) => {
            console.error('Tunnel server error:', err);
        });
    }

    async close(): Promise<void> {
        if (!this.tunnel) return;

        return new Promise<void>((resolve) => {
            this.tunnel!.server.close(() => {
                this.tunnel!.client.end();
                this.tunnel = null;
                console.log('SSH tunnel closed');
                resolve();
            });
        });
    }

    isConnected(): boolean {
        return this.tunnel !== null;
    }
}

export { SSHTunnelManager, TunnelConnection, SSHTunnelConfig };
