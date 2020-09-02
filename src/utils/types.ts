import { IncomingMessage } from "http";
import { ExecutionParams } from "subscriptions-transport-ws";

export type WsConnectionParam = {
    authorization: string;
    "graphql-code": string;
};

export type User = {
    id:string;
    name:string;
}

export type Req = { req: IncomingMessage, connection: ExecutionParams }