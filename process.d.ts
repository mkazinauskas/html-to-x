
// eslint-disable-next-line no-unused-vars
declare namespace NodeJS {
    export interface ProcessEnv {
        NODE_ENV: string,
        SHUTDOWN_ON_FAILED_PING: string,
        CONVERT_QUEUE_CONCURRENCY: string,
    }
}