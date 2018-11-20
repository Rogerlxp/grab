module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'node-contents-manage',
      script    : './server/index.js',
      "error_file": "pm2/combined.log",
      "out_file": "pm2/combined.log",
      "merge_logs": true,
      "log_date_format": "YYYY-MM-DD HH:mm:ss",
      "log_file": "pm2/combined.log",
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production: {
        NODE_ENV: "production"
      },
      env_development: {
        NODE_ENV: 'development',
      },
      // node_args: ["--inspect"]
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {

  }
};
