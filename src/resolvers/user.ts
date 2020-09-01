import { QueryResolvers } from "../generated/graphql";

export const UserQuery: QueryResolvers = {
    me: async (_, __, { user }) => {
        return null;
    }
}