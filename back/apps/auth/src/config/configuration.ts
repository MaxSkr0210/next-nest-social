import * as process from "node:process";

export default () => {
    return {
        rabbitmq: {
            urls: "amqp://kalo:kalo@localhost:5672".split(","),
        },
        jwt: {
            access: {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME,
            },
            refresh: {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
            },
        },
    };
};
