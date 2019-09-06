import { Stream } from 'bunyan';

interface IBuyuanOptions {
    level?: string;
    server?: string;
    host?: string;
    port?: number | string;
    appName?: string;
    pid?: number;
    tags?: string[];
    type?: string;
}

export class LogstashStream {
    private constructor(options: IBuyuanOptions)
    public write(entry: string): void
    public send(message: string): void
}

export function createStream(options: IBuyuanOptions): Stream