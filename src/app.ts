import * as Koa from 'koa';
import * as cors from '@koa/cors';
import * as compress from 'koa-compress';
import * as bodyParser from 'koa-bodyparser';
import * as Router from 'koa-router';

import routes from './routes';
import { getKoaMiddleare } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';

const router = new Router();
const app = new Koa();

app.proxy = true;
app.use(async (ctx: Koa.Context, next: Function): Promise<void> => {
    ctx.res.setTimeout(10000);
    await next();
});
app.use(cors());
app.use(compress());
app.use(errorHandler);
app.use(bodyParser({
    onerror: function (_err, ctx: Koa.Context): void {
        ctx.throw(422);
    },
}));
app.use(async (ctx: Koa.Context, next: Function): Promise<void> => {
    ctx.reqBody = ctx.request.body;
    await next();
});

app.use(getKoaMiddleare());

router.get('/', (ctx: Koa.Context): void => {
    ctx.body = {};
});

router.get('/online', (ctx: Koa.Context): void => {
    ctx.body = { ok: true };
});

routes(router);
app.use(router.routes()).use(router.allowedMethods());

export default app;
