module.exports = {
  apps: [
    {
      name: "repo-lens-backend",
      script: "./index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "repo-lens-worker",
      script: "./worker/review.worker.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
