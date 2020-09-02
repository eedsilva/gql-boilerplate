import { QueryResolvers } from "../generated/graphql";

export const UserQuery: QueryResolvers = {
    me: async (_, __, { dataSources }) => {
        return dataSources.userAPI.getUser();
    }
}