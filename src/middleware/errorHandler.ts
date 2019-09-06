import { Context } from "koa";

export async function errorHandler(ctx: Context, next: Function): Promise<void> {
    try {
        await next();
    } catch (err) {
        const body = {
            ok: false,
            message: err.ecode ? err.message : '系统错误，请稍后重试',
            msg: err.message,
        };

        ctx.status = err.status || 500;
        ctx.body = body;

        if (process.env.NODE_ENV !== 'production') {
            /* eslint-disable no-console */
            console.log(err.stack);
        }
    }
}
