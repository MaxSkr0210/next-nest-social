import * as process from 'node:process';

export default () => {
    console.log(process.env.RABBITMQ_URLS);

    return {
        rabbitmq: {
            urls: ['amqp://kalo:kalo@localhost:5672'],
        },
        cookie: {
            refreshToken: {
                name: 'refresh_token',
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                domain: '.mskrinnik.ru',
            },
            accessToken: {
                name: 'access_token',
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                domain: '.mskrinnik.ru',
            },
        },
    };
};
