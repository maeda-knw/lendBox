import { Router } from 'oak/mod.ts';
import { renderFile } from 'dejs/mod.ts';

export const routerIndex = new Router();
routerIndex.get('/', async (context) => {
    context.response.body = await renderFile(`${Deno.cwd()}/views/index.ejs`, {
        greeting: 'hello!',
    });
});
