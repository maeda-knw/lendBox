import { Router } from 'oak/mod.ts';
import { renderFile } from 'dejs/mod.ts';

import { LendBoxClient } from '../common/LendBoxClient.ts';

export const routerItem = new Router();

routerItem.get('/item', async (context, next) => {
    try {
        const arrItem = await LendBoxClient.getAllItem();
        context.response.body = await renderFile(
            `${Deno.cwd()}/views/item.ejs`,
            {
                arrItem: arrItem,
            },
        );
    } catch (_) {
        next();
    }
});
