import { assertEquals, assertThrowsAsync } from 'testing/asserts.ts';
import { LendBoxClient } from '../common/LendBoxClient.ts';

Deno.test('db connection', async () => {
    await assertThrowsAsync(
        async () => {
            try {
                Deno.env.set('MONGO_HOST', '127.0.0.2');
                await LendBoxClient.getAllItem();
            } catch (err) {
                throw err;
            } finally {
                Deno.env.set('MONGO_HOST', '127.0.0.1');
            }
        },
        undefined,
        'Connection failed',
    );
});

Deno.test('getAllItem', async () => {
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
});

Deno.test('ticket', async (tContext) => {
    await tContext.step('check nothing ticket', async () => {
        const arrTicket = await LendBoxClient.getTicket();
        assertEquals(arrTicket.length, 0);
    });
});
