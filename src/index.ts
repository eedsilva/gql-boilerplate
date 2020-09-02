import "./utils/env";
import { httpServer, apolloServer, PORT } from "./app";

httpServer.listen(PORT, () => {
    console.log('\x1b[33m%s\x1b[0m', `Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`)
    console.log('\x1b[33m%s\x1b[0m', `Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`)
});