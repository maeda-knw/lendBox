import {
    assertArrayIncludes,
    assertEquals,
    assertThrowsAsync,
} from 'testing/asserts.ts';
import { ITicket, LendBoxClient, status } from '../common/LendBoxClient.ts';

Deno.test('db connection error', async () => {
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
    assertArrayIncludes(arrItem, arrData);
});

Deno.test('ticket', async (tContext) => {
    await tContext.step('check nothing ticket', async () => {
        const arrTicket = await LendBoxClient.getTicket();
        assertEquals(arrTicket.length, 0);
    });

    await tContext.step('insert ticket', async () => {
        const ticket_prepare: ITicket = {
            title: 'test_prepare',
            registry: new Date('2020/10/10'),
            send: new Date('2020/10/11'),
            receive: new Date('2020/10/12'),
            items: [
                { name: 'prepare_1', amount: 1 },
                { name: 'prepare_2', amount: 2 },
            ],
            state: status.prepare,
        };
        const id_prepare = await LendBoxClient.insertTicket(ticket_prepare); // ここで引数のオブジェクトを書き換えている。
        assertEquals(id_prepare, ticket_prepare._id, 'prepare id');

        const ticket_completion: ITicket = {
            title: 'test_completion',
            registry: new Date('2020/10/10'),
            send: new Date('2020/10/11'),
            receive: new Date('2020/10/12'),
            items: [
                { name: 'completion_1', amount: 1 },
                { name: 'completion_2', amount: 2 },
            ],
            state: status.completion,
        };
        const id_completion = await LendBoxClient.insertTicket(
            ticket_completion,
        );
        assertEquals(id_completion, ticket_completion._id, 'completion id');

        const actual_tickets = await LendBoxClient.getTicket();
        assertArrayIncludes(actual_tickets, [
            ticket_prepare,
            ticket_completion,
        ], 'all tickets');

        const actual_tickets_prepare = await LendBoxClient
            .getNonCompletionTicket();
        assertArrayIncludes(
            actual_tickets_prepare,
            [ticket_prepare],
            'no completion tickets',
        );

        const actual_tickets_completion = await LendBoxClient
            .getCompletionTicket();
        assertArrayIncludes(
            actual_tickets_completion,
            [ticket_completion],
            'completion tickets',
        );
    });
});
