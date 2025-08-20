module.exports = {
  apps: [{
    name: 'todoapppro-backend',
    cwd: '/var/www/vijayg.dev/projects/todoapppro/backend',
    script: './dist/server.js',
    instances: 1,
    watch: false,
    autorestart: true,
    max_memory_restart: '400M',
    exp_backoff_restart_delay: 100,
    kill_timeout: 5000,
    env: {
      NODE_ENV: 'production',
      PORT: 8010,
      BASE_URL: 'https://vijayg.dev',
      CLIENT_URL: 'https://vijayg.dev/todoapppro',

      // Google OAuth Credentials (TodoAppPro Specific)
      GOOGLE_CLIENT_ID: '73222571136-dmlju04qp53c9qp7bn53lfc7go1ornp9.apps.googleusercontent.com',
      GOOGLE_CLIENT_SECRET: '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',
      GOOGLE_CALLBACK_URL: 'https://vijayg.dev/todoapppro/auth/google/callback',

      // JWT Configuration
      JWT_SECRET: 'todoapppro-secret-2025',

      // MongoDB Configuration (Already working)
      MONGO_URI: 'mongodb://127.0.0.1:27017/todoapppro',

      // CORS
      ALLOWED_ORIGINS: 'https://vijayg.dev'
    }
  }]
};