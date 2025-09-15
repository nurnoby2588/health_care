import dotenv from 'dotenv'
import path from 'path'
// dotenv.config({path:path.join(process.cwd(),'.env')})

export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    jwt: {
        access_token_key: process.env.ACCESS_TOKEN_SECRET_KEY,
        access_token_expire: process.env.ACCESS_TOKEN_EXPIRE_IN,
        refresh_token_key: process.env.REFRESH_TOKEN_SECRET_KEY,
        refresh_token_expire: process.env.REFRESH_TOKEN_EXPIRE_IN
    }
}