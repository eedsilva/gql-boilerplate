import * as http from "http";
import * as express from "express";
import * as fs from "fs";
import * as path from "path";
import { ApolloServer, Config, gql, AuthenticationError } from "apollo-server-express";
import { DocumentNode } from "graphql";
import { resolvers } from "./resolvers";
import { WsConnectionParam, Req, User } from "./utils/types";
import { DataSources } from "./utils/context";
import { UserAPI } from "./dataSources/userAPI";
import { devAuth, localAuth } from "./utils/config";
import auth from "./services/auth";

class App {
    public _httpServer: http.Server;
    public _apolloServer: ApolloServer;
    private _express: express.Application;

    constructor() {
        this.createServer();

        console.log('\x1b[36m%s\x1b[0m', `dev auth: ${devAuth}`);
    }

    private createServer(): void {
        this._express = express();

        const config = this.getGraphQLConfig();
        this._apolloServer = new ApolloServer(config);
        this._apolloServer.applyMiddleware({ app: this._express });

        this._httpServer = http.createServer(this._express);
        this._apolloServer.installSubscriptionHandlers(this._httpServer);
    }

    private getGraphQLConfig(): Config {
        return {
            typeDefs: this.getTypeDefs(),
            resolvers,
            dataSources: () => this.getDataSources(),
            context: async (req:Req) => await this.getContext(req),
            subscriptions: {
                onConnect: async(params: WsConnectionParam) => this.onConnectSubscription(params),
                keepAlive: 25000 // send KeepAlive message every 25 seconds.
            },
            playground: true
        }
    }
    private getTypeDefs(): Array<DocumentNode> {
        const schemasPath: string = `${__dirname}/gqlschemas`;

        const typeDefs: Array<DocumentNode> = [];

        fs.readdirSync(schemasPath).forEach((file) => typeDefs.push(gql(fs.readFileSync(path.join(schemasPath, file), "utf8").toString())))

        return typeDefs;
    }

    private getDataSources(): DataSources {
        return {
            userAPI: new UserAPI()
        } as DataSources;
    }
    
    private async getContext({ req, connection }: Req): Promise<{ token: string, user: string }> {
        if (!connection) {
            const requestCode = req.headers["graphql-code"] as string | undefined;
            const token = req.headers.authorization;
            const contextAuth = await this.getContextAuth(requestCode, token);
            return contextAuth;
        }

        const ctx = {
            ...connection.context,
            // dataSources: {
            //     snAPI
            // } as DataSources
        };
        return ctx;
    }

    private async getContextAuth(requestCode: string | undefined, token: string | undefined): Promise<{ token: string, user: string }> {
        if (!devAuth) {
            const codes = "";
            if (!codes || !token) throw new AuthenticationError("you must be logged in.");
        }

        const authToken = `Bearer ${token || (await localAuth()).access_token}`;
        const user = await auth(authToken);

        return { token: authToken, user: user };
    }

    private async onConnectSubscription(params: WsConnectionParam) : Promise<{ token: string, user: string }> {
        const requestCode = params["graphql-code"];
        const token = params.authorization;

        return await this.getContextAuth(requestCode, token);
    }
}

const app = new App();

export const httpServer = app._httpServer;
export const apolloServer = app._apolloServer;
export const PORT = process.env.PORT || 8000;