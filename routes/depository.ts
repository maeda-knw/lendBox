import { Router } from 'oak/mod.ts';
import 'view_engine/mod.ts';
import 'dotenv/load.ts';

import { LendBoxClient } from '../common/LendBoxClient.ts';

export const routerDepository = new Router();

routerDepository.get('/depository', async (context, next) => {
    try {
        const arrItem = await LendBoxClient.getAllItem();
        context.render('views/depository.ejs', {
            arrItem: arrItem,
        });
    } catch (_) {
        next();
    }
});
