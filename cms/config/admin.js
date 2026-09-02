const { mergeConfig } = require("vite");

module.exports = ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET"),
  },
  apiToken: {
    salt: env("API_TOKEN_SALT"),
  },
  transfer: {
    token: {
      salt: env("TRANSFER_TOKEN_SALT"),
    },
  },
  secrets: {
    encryptionKey: env("ENCRYPTION_KEY"),
  },
  vite: (config) =>
    mergeConfig(config, {
      server: {
        host: "0.0.0.0",
        port: 5173,
        hmr: {
          host: "localhost",
          clientPort: 5173,
        },
      },
    }),
});
