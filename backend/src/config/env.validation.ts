import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  APP_PORT: Joi.number().default(5454),
  APP_URL: Joi.string().uri().default('http://localhost:5454'),
  FRONTEND_URL: Joi.string().uri().default('http://localhost:3000'),
  CORS_ORIGINS: Joi.string().default('http://localhost:3000'),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_LOGGING: Joi.boolean().default(false),

  JWT_ACCESS_SECRET: Joi.string().min(16).required(),
  JWT_ACCESS_EXPIRES: Joi.string().default('1h'),
  JWT_REFRESH_SECRET: Joi.string().min(16).required(),
  JWT_REFRESH_EXPIRES: Joi.string().default('7d'),

  ADMIN_USERNAME: Joi.string().default('admin'),
  ADMIN_PASSWORD: Joi.string().min(6).default('Admin12345'),
  ADMIN_FULL_NAME: Joi.string().default('Administrator'),

  UPLOAD_DIR: Joi.string().default('uploads'),
  UPLOAD_MAX_SIZE_MB: Joi.number().default(20),
});
