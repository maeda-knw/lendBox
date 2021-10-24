import { Router } from 'oak/mod.ts';
import 'view_engine/mod.ts';
import 'dotenv/load.ts';

import { LendBoxClient } from '../common/LendBoxClient.ts';

export const routerDepository = new Router();

routerDepository.get('/depository', async (context, next) => {
    const arrItem = await LendBoxClient.getAllItem();
    if (arrItem == null) {
        next();
        return;
    }

    context.render('views/depository.ejs', {
        arrItem: arrItem,
    });
});
