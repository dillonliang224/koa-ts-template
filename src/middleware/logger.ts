import * as bunyan from 'bunyan';
import { Context, Middleware, ParameterizedContext } from 'koa';

import Logger from '../lib/logger';
import nconf from '../lib/nconf';

const logger: bunyan = new Logger(nconf.get('LOGGER_APP_NAME'), nconf.get('logger') || {});

interface IReqDataLog {
    ip?: string;
    ips?: string[];
    url: string;
    transaction: string;
    ua?: string;
    method: string;
    params?: string;
    query?: string;
    status?: number;
    resTime?: number;
    host?: string;
    'x-forwarded-for'?: string;
    reqBody?: string;
    resBody?: string;
}

export function getKoaMiddleare(): Middleware<ParameterizedContext<any, {}>> {
    return async function loggerMW(ctx: Context, next: Function): Promise<void> {
        const { res } = ctx;

        ctx.state.ua = ctx.headers['user-agent'] || ctx.headers['x-user-agent'];
        ctx.state.log = true;
        const startTime: number = Date.now();

        function logRequest(): void {
            res.removeListener('finish', logRequest);
            res.removeListener('close', logRequest);

            ctx.responseTime = Date.now() - startTime;
            ctx.state = ctx.state || {};
            const url = ctx.originalUrl || ctx.url;

            const reqData: IReqDataLog = {
                "ip": ctx.ip,
                "ips": ctx.ips,
                url,
                "transaction": `${ctx.method} ${ctx._matchedRoute || '/'}`,
                "ua": ctx.headers['user-agent'],
                "method": ctx.method,
                "params": JSON.stringify(ctx.params),
                "query": JSON.stringify(ctx.query),
                "status": ctx.status,
                "resTime": ctx.responseTime,
                "host": ctx.headers.host,
                'x-forwarded-for': ctx.headers['x-forwarded-for'],
            };

            const stringBody = JSON.stringify(ctx.reqBody || {});
            reqData.reqBody = stringBody;

            if (res.statusCode !== 200 || ctx.state.log) {
                reqData.resBody = JSON.stringify(ctx.body || {});
            }

            const msg = `${ctx.method} ${url} ${ctx.responseTime}ms ${ctx.status}`;


            if (res.statusCode >= 500) {
                logger.error(reqData, msg);
            } else if (res.statusCode >= 400) {
                logger.warn(reqData, msg);
            } else {
                logger.info(reqData, msg);
            }
        }

        res.on('finish', logRequest);
        res.on('close', logRequest);

        await next();
    };
}
