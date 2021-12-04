import 'dotenv/load.ts';
import { Application, send } from 'oak/mod.ts';
import { join } from 'path/mod.ts';

// routes
import { routerIndex } from './routes/index.ts';
import { routerDepository } from './routes/depository.ts';

const app = new Application();

// static
app.use(async (context, next) => {
    const pathStatic = '/static/';
    const path = context.request.url.pathname;

    if (path.search(pathStatic) === 0) {
        const pathFile = path.substring(pathStatic.length);
        // 2つ目の引数が、取得したいファイルの、rootからの相対パス。
        // rootのパスが、ホームにマウントされるイメージ
        await send(context, pathFile, {
            root: join(Deno.cwd(), pathStatic),
        });
    } else {
        await next();
    }
});

// routing
app.use(routerIndex.allowedMethods());
app.use(routerIndex.routes());
app.use(routerDepository.allowedMethods());
app.use(routerDepository.routes());

// 500 error
app.use((context, next) => {
    context.response.status = 500;
});

// listener
await app.listen({ port: Number(Deno.env.get('PORT') ?? 8080) });
