import { ConnectOptions, Database, MongoClient } from 'mongo/mod.ts';

interface IItem {
    itemid: Number;
    name: String;
    stock: Number;
}

class LendBox {
    _db: Database | null;
    _client: MongoClient;

    constructor() {
        this._client = new MongoClient();
        this._db = null;
    }

    async db(): Promise<Database> {
        if (this._db) {
            const db = this._db;
            return new Promise<Database>((resolve) => {
                resolve(db);
            });
        }

        const usr = Deno.env.get('MONGO_USR') ?? 'user';
        const port = Deno.env.get('MONGO_PORT') ?? '27017';
        const host = Deno.env.get('MONGO_HOST') ?? '127.0.0.1';
        const pwd = Deno.env.get('MONGO_PWD') ?? '1234';
        const dbname = Deno.env.get('MONGO_DB') ?? 'lendBox';
        const option: ConnectOptions = {
            db: dbname,
            servers: [{
                host: host,
                port: Number(port),
            }],
            credential: {
                username: usr,
                password: pwd,
                db: dbname,
                mechanism: 'SCRAM-SHA-1',
            },
        };

        const promise = new Promise<Database>((resolve, reject) => {
            this._client.connect(option)
                .then((db) => {
                    this._db = db;
                    resolve(this._db);
                })
                .catch((err) => {
                    reject(err);
                });
        });

        return promise;
    }

    async getAllItem(): Promise<IItem[] | null> {
        const db = await this.db();
        const arr = await db.collection<IItem>('Item').find().toArray();
        const item = arr.map((elem) => {
            let item: IItem = {
                itemid: elem.itemid,
                name: elem.name,
                stock: elem.stock,
            };
            return item;
        });

        return new Promise<IItem[]>((resolve) => {
            resolve(item);
        });
    }

    close(): void {
        this._client.close();
    }
}

export const LendBoxClient = new LendBox();
