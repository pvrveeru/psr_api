module.exports = {
  apps: [
    {
      name: "psr-app",
      script: "./app.js",
      watch: true,
      ignore_watch: ["node_modules", "logs", "temp"],
      watch_options: {
        followSymlinks: false,
      },
    },
  ],
};
