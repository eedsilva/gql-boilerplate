import { AuthenticationError } from "apollo-server-express";
import axios from "axios";
import * as memoizee  from "memoizee";
import { User } from "../utils/types";
// import { SNEndpoint } from "../utils/config";

const SNAPI = "api/x_avana_cmdb/data";
const auth = async (token: string) => {
    try {
        // const uri = `${SNEndpoint}/${SNAPI}/me`;
        // const res = await axios.get<{result: User}>(uri, {
        //     headers: {
        //         "Content-Type": "application/json",
        //         Authorization: token
        //     }
        // });
        // const { status, statusText, data } = res;
        // if(status >= 400) throw new AuthenticationError(`${status} ${statusText}`);
        // const { result } = data;
        // result.companyMap = result.companies.reduce<{ [id: string]: boolean }>((a, c) => ({ ...a, [c]: true }), {});
        // console.log(`➡️  ${result.display} can see ${result.companies.length} companies.`);
        return "token_goes_here";    
    } catch (error) {
        throw new AuthenticationError(error.message);
    }
}

const memoized = memoizee(auth, { promise: true, maxAge: 30 * 50 * 1000, preFetch: true }); // cache for 30 minutes.

export default async (token: string) => await memoized(token);