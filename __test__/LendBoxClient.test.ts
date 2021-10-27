import {
    assert,
    assertEquals,
    fail,
} from 'https://deno.land/std/testing/asserts.ts';
import { LendBoxClient } from '../common/LendBoxClient.ts';

Deno.test('getAllItem', async () => {
    const arrData = [
        { itemid: 1, name: 'IchigoJam', stock: 0 },
        { itemid: 2, name: 'MixJuice', stock: 0 },
        { itemid: 3, name: 'M01 LED', stock: 0 },
        { itemid: 4, name: 'M02 Serial', stock: 0 },
        { itemid: 5, name: 'Dake', stock: 0 },
        { itemid: 6, name: 'Igai', stock: 0 },
        { itemid: 7, name: 'DakeJacket', stock: 0 },
        { itemid: 8, name: 'Dyhook', stock: 0 },
        { itemid: 9, name: 'DPC', stock: 0 },
        { itemid: 10, name: 'カムロボ', stock: 0 },
        { itemid: 11, name: 'radish', stock: 0 },
        { itemid: 12, name: 'radish typeD', stock: 0 },
    ];
    const arrItem = await LendBoxClient.getAllItem();
    assertEquals(JSON.stringify(arrItem), JSON.stringify(arrData));
    LendBoxClient.close();
});
