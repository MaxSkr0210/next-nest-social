import * as process from 'node:process';

export interface IConfig {
  API_PORT: string;
  RABBITMQ: IRabbitMQConfig;
  COOKIE: ICookieConfig;
  JWT: IJwtConfig;
}

interface IJwtConfig {
  ACCESS_TOKEN: IJwtTokenConfig;
  REFRESH_TOKEN: IJwtTokenConfig;
}

interface IJwtTokenConfig {
  EXPIRES_IN: string;
  SECRET: string;
}

interface IRabbitMQConfig {
  URLS: string[];
}

interface ICookieConfig {
  ACCESS_TOKEN: {
    NAME: string;
    MAX_AGE: number;
    HTTP_ONLY: boolean;
    SECURE: boolean;
    DOMAIN: string;
  };
  REFRESH_TOKEN: {
    NAME: string;
    MAX_AGE: number;
    HTTP_ONLY: boolean;
    SECURE: boolean;
    DOMAIN: string;
  };
}

export default (): IConfig => {
  return {
    API_PORT: process.env.API_PORT,
    RABBITMQ: {
      URLS: 'amqp://kalo:kalo@localhost:5672'.split(','),
    },
    COOKIE: {
      REFRESH_TOKEN: {
        NAME: 'refresh_token',
        MAX_AGE: 1000 * 60 * 60 * 24 * 30,
        HTTP_ONLY: true,
        SECURE: process.env.NODE_ENV === 'production',
        DOMAIN: '',
      },
      ACCESS_TOKEN: {
        NAME: 'access_token',
        MAX_AGE: 1000 * 60 * 60 * 24 * 30,
        HTTP_ONLY: true,
        SECURE: process.env.NODE_ENV === 'production',
        DOMAIN: '',
      },
    },
    JWT: {
      ACCESS_TOKEN: {
        EXPIRES_IN: process.env.JWT_ACCESS_EXPIRATION_TIME,
        SECRET: process.env.JWT_ACCESS_SECRET,
      },
      REFRESH_TOKEN: {
        EXPIRES_IN: process.env.JWT_REFRESH_EXPIRATION_TIME,
        SECRET: process.env.JWT_REFRESH_SECRET,
      },
    },
  };
};
