module.exports = {
    apps: [
        {
            name: "myshopkeeper-v2-api",
            script: "src/server.ts",
            // instances: 3,
            // exec_mode: "cluster",
            interpreter: "tsx",
            watch: false,
            env: {
                NODE_ENV: "development"
            }
        }
    ]
};