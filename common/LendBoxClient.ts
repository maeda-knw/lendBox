import {
    Collection,
    ConnectOptions,
    Database,
    Filter,
    MongoClient,
} from 'mongo/mod.ts';

interface IItem {
    name: String;
    stock: Number;
}

export interface ITicket {
    title: String;
    registry: Date;
    send: Date;
    receive: Date;
    items: { name: String; amount: Number }[];
    state: status;
}

export const enum status {
    prepare = 1,
    ready = 2,
    lending = 3,
    completion = 4,
}

class LendBox {
    private _client: MongoClient;

    constructor() {
        this._client = new MongoClient();
    }

    private async connect(): Promise<Database> {
        const usr = Deno.env.get('MONGO_USR') ?? 'user';
        const port = Deno.env.get('MONGO_PORT') ?? '27017';
        const host = Deno.env.get('MONGO_HOST') ?? '127.0.0.1';
        const pwd = Deno.env.get('MONGO_PWD') ?? '1234';
        const db = Deno.env.get('MONGO_DB') ?? 'lendBox';
        const option: ConnectOptions = {
            db: db,
            servers: [{
                host: host,
                port: Number(port),
            }],
            credential: {
                username: usr,
                password: pwd,
                db: db,
                mechanism: 'SCRAM-SHA-1',
            },
        };

        return new Promise<Database>((resolve, reject) => {
            this._client.connect(option)
                .then((database) => {
                    resolve(database);
                })
                .catch((err) => {
                    console.log('connection error');
                    this._client.close();
                    reject(err);
                });
        });
    }

    async getItemCollection(database: Database): Promise<Collection<IItem>> {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(database.collection<IItem>('Item'));
            } catch (err) {
                reject(err);
            }
        });
    }

    async getAllItem(): Promise<IItem[]> {
        return new Promise<IItem[]>(async (resolve, reject) => {
            try {
                const database = await this.connect();
                const collection = await this.getItemCollection(database);
                const arrRawItem = await collection.find().toArray();
                const arrItem = arrRawItem.map((elem) => {
                    return {
                        name: elem.name,
                        stock: elem.stock,
                    };
                });
                resolve(arrItem);
            } catch (err) {
                reject(err);
            } finally {
                this.close();
            }
        });
    }

    async getTicketCollection(
        database: Database,
    ): Promise<Collection<ITicket>> {
        return new Promise<Collection<ITicket>>(async (resolve, reject) => {
            try {
                resolve(database.collection<ITicket>('Ticket'));
            } catch (err) {
                reject(err);
            }
        });
    }

    async insertTicket(ticket: ITicket): Promise<unknown> {
        return new Promise(async (resolve, reject) => {
            try {
                const database = await this.connect();
                const collection = await this.getTicketCollection(database);
                const id = await collection.insertOne(ticket);
                resolve(id);
            } catch (err) {
                reject(err);
            } finally {
                this.close();
            }
        });
    }

    async getTicket(filter?: Filter<ITicket>): Promise<ITicket[]> {
        return new Promise<ITicket[]>(async (resolve, reject) => {
            try {
                const database = await this.connect();
                const collection = await this.getTicketCollection(database);
                const arrRawTicket = await collection.find(filter).toArray();
                const arrTicket = arrRawTicket.map((elem) => {
                    return {
                        title: elem.title,
                        registry: elem.registry,
                        items: elem.items,
                        send: elem.send,
                        receive: elem.receive,
                        state: elem.state,
                    };
                });
                resolve(arrTicket);
            } catch (err) {
                reject(err);
            } finally {
                this.close();
            }
        });
    }

    async getCompletionTicket(): Promise<ITicket[]> {
        return this.getTicket({ state: status.completion });
    }

    async getNonCompletionTicket(): Promise<ITicket[]> {
        return this.getTicket({ state: { $ne: status.completion } });
    }

    private close(): void {
        this._client.close();
    }
}

export const LendBoxClient = new LendBox();
