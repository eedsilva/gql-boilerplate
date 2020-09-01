import * as memoizee from "memoizee";

const getOptionalSetting = (name: string): string | undefined => process.env[name];

export const devAuth = getOptionalSetting("devAuth") === "true";

export const localAuth = async (): Promise<{access_token:string}> => {
    return {access_token:""};
    // const config = snConfig;
    // if (!snAuth && config.clientID && config.clientSecret) {
    //   snAuth = new ServiceNowAuth(SNEndpoint, config.clientID, config.clientSecret, config.user!, config.password!);
    // }
    // return snAuth.auth();
  };