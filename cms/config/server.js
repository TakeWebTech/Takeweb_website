module.exports = ({ env }) => {
  const publicUrl = env("PUBLIC_URL");

  return {
    host: env("HOST", "0.0.0.0"),
    port: env.int("PORT", 1337),
    ...(publicUrl ? { url: publicUrl } : {}),
    proxy: true,
    app: {
      keys: env.array("APP_KEYS"),
    },
  };
};
