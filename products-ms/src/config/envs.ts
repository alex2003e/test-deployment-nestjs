import 'dotenv/config';
import * as joi from 'joi';

interface IEnvVars {
  PORT: number;
  DATABASE_URL: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);
if (error) throw new Error(`Config validation error: ${error}`);

const envsVar = value as IEnvVars;

export const envs = {
  port: envsVar.PORT,
  dataBaseUrl: envsVar.DATABASE_URL,
};
