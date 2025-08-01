import * as process from "node:process";

export default () => {
    return {
        database: {
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10) || 5432,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            name: process.env.DB_NAME,
        },
        rabbitmq: {
            urls: process.env.RABBITMQ_URLS.split(","),
        },
    };
};
