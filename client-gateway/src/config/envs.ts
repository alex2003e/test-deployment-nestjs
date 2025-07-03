import 'dotenv/config';
import * as joi from 'joi';

interface IEnvVars {
  PORT: number;
  PORT_PRODUCTS_MS: number;
  HOST_PRODUCTS_MS: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    PORT_PRODUCTS_MS: joi.number().required(),
    HOST_PRODUCTS_MS: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);
if (error) throw new Error(`Config validation error: ${error}`);

const envsVar = value as IEnvVars;

export const envs = {
  port: envsVar.PORT,
  portProductsMs: envsVar.PORT_PRODUCTS_MS,
  hostProductsMs: envsVar.HOST_PRODUCTS_MS,
};
