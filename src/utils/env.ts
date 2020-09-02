import { resolve, join } from "path";
import { config } from "dotenv";
import { existsSync } from "fs";

const envFile = join(__dirname, "../../.env")
if (existsSync(envFile)){
    config({ path: resolve(envFile) })
}