import "./utils/env";
import * as http from "http";
import * as express from "express";
import * as fs from "fs";
import * as path from "path";
import { ApolloServer, Config, gql, AuthenticationError } from "apollo-server-express";
import { IncomingMessage } from "http";
import { ExecutionParams } from "subscriptions-transport-ws";
import { DocumentNode } from "graphql";
import { resolvers } from "./resolvers";
import { WsConnectionParam } from "./utils/types";
import { DataSources } from "./context";
import { UserAPI } from "./dataSources/userAPI";
import { devAuth, localAuth } from "./utils/config";
import auth from "./services/auth";

type Req = { req: IncomingMessage, connection: ExecutionParams }

const schemasPath: string = `${__dirname}/gqlschemas`;

const typeDefs: Array<DocumentNode> = [];

fs.readdirSync(schemasPath).forEach((file) => typeDefs.push(gql(fs.readFileSync(path.join(schemasPath, file), "utf8").toString())))

const dataSources = () => ({ userAPI: new UserAPI() } as DataSources);

const config: Config = {
    typeDefs,
    resolvers,
    dataSources,
    context: async ({ req, connection }: Req) => {
        if (!connection) {
            const requestCode = req.headers["graphql-code"] as string | undefined;
            const token = req.headers.authorization;
            const contextAuth = await getContextAuth(requestCode, token);
            return contextAuth;
        } else {
            // const snAPI = new SnAPI();
            // snAPI.initToken(connection.context.token);
            const ctx = {
                ...connection.context,
                // dataSources: {
                //     snAPI
                // } as DataSources
            };
            return ctx;
        }
    },
    subscriptions: {
        onConnect: async (params: WsConnectionParam) => {
            const requestCode = params["graphql-code"];
            const token = params.authorization;

            return await getContextAuth(requestCode, token);
        },
        keepAlive: 25000 // send KeepAlive message every 25 seconds.
    },
    playground: true // todo: make configurable
};

const getContextAuth = async (requestCode: string | undefined, token: string | undefined) => {
    if (!devAuth) {
        const codes = ""//await graphCodes();
        if (!codes || !token) throw new AuthenticationError("you must be logged in.");
    }

    const authToken = `Bearer ${token || (await localAuth()).access_token}`;
    const user = await auth(authToken);

    return { token: authToken, user: user };
}

const app = express();
const server = new ApolloServer(config);
server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const PORT = process.env.PORT || 8000;

httpServer.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`)
    console.log(`Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
});