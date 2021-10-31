import {
    assertEquals,
    assertThrowsAsync,
} from 'https://deno.land/std/testing/asserts.ts';
import { LendBoxClient } from '../common/LendBoxClient.ts';

// Deno.test('db connection', async () => {
//     Deno.env.set('MONGO_PWD', '1');
//     await assertThrowsAsync(
//         async () => {
//             try {
//                 await LendBoxClient.connect();
//             } catch (err) {
//                 throw err;
//             }
//         },
//         undefined,
//         'Connection failed',
//     );

//     Deno.env.set('MONGO_PWD', '1234');
// });

Deno.test('getAllItem', async () => {
    await LendBoxClient.connect();
    const arrData = [
        { name: 'IchigoJam', stock: 0 },
        { name: 'MixJuice', stock: 0 },
        { name: 'M01 LED', stock: 0 },
        { name: 'M02 Serial', stock: 0 },
        { name: 'Dake', stock: 0 },
        { name: 'Igai', stock: 0 },
        { name: 'DakeJacket', stock: 0 },
        { name: 'Dyhook', stock: 0 },
        { name: 'DPC', stock: 0 },
        { name: 'カムロボ', stock: 0 },
        { name: 'radish', stock: 0 },
        { name: 'radish typeD', stock: 0 },
    ];
    const arrItem = await LendBoxClient.getAllItem();
    assertEquals(JSON.stringify(arrItem), JSON.stringify(arrData));
    LendBoxClient.close();
});

Deno.test('ticket', async (tContext) => {
    await LendBoxClient.connect();
    await tContext.step('check nothing ticket', async () => {
        const arrTicket = await LendBoxClient.getTicket();
        assertEquals(arrTicket.length, 0);
    });

    LendBoxClient.close();
});
