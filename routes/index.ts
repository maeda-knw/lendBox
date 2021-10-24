import { Router } from 'oak/mod.ts';
import 'view_engine/mod.ts';

export const routerIndex = new Router();
routerIndex.get('/', (context) => {
    context.render('views/index.ejs', {
        greeting: 'hello!',
    });
});
