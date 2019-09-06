import * as Router from 'koa-router';

export default function (app: Router): void {
    require('./controller/example').route(app);
}
