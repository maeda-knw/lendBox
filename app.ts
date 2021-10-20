import 'dotenv/load.ts';
import { Application } from 'oak/mod.ts';

const app = new Application();
app.use((context) => {
    console.log('hey');
    context.response.body = 'hello';
});
await app.listen({ port: Number(Deno.env.get('PORT') ?? 8080) });
