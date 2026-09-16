import fs from 'fs';

export function buildSslOption() {
  return process.env.DB_SSL === 'true'
    ? {
        rejectUnauthorized: false,
        ca: process.env.DB_SSL_CA_PATH
          ? fs.readFileSync(process.env.DB_SSL_CA_PATH)
          : undefined,
      }
    : false;
}
