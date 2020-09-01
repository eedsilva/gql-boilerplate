import { User } from "./utils/types";
import { UserAPI } from "./dataSources/userAPI";

export type Context = {
    dataSources: DataSources;
    token: string;
    user: User;
}

export type DataSources = {
    userAPI: UserAPI
};
