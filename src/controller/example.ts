import { Context } from 'koa';
import * as Router from 'koa-router';

exports.route = function (app: Router): void {
    app.get('/example/list', getExampleList);
};

async function getExampleList(ctx: Context): Promise<void> {
    ctx.body = {
        ok: true,
    }
}
