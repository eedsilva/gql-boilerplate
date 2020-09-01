import { Resolvers } from "../generated/graphql";
import { UserQuery } from "./user";

export const resolvers: Resolvers = {
    Query: { ...UserQuery },
};