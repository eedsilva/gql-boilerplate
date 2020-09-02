import { DataSource, DataSourceConfig } from "apollo-datasource";
import { Context } from "../utils/context";
import { User } from "../utils/types";

export class UserAPI extends DataSource<Context> {
    private context!: Context;

    initialize(config: DataSourceConfig<Context>) {
        this.context = config.context;
    }

    getUser(): User {
        return { id: "1234567890", name: "Ed S." }
    }
}