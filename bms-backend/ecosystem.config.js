const { exec } = require("node:child_process");
const { env } = require("node:process");

module.exports = {
    apps: [
        {
            name: 'bms-backend',
            script: './dist/server.js',
            instances: 'max',
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
            }
        }
    ]
}