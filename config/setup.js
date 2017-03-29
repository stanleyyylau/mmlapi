module.exports = function() {
    var env = process.env.NODE_ENV || 'development';

    // Setting up environment variables first
    if (env === 'development' || env === 'test') {
        var config = require('./config.json');
        var envConfig = config[env];

        Object.keys(envConfig).forEach((key) => {
            process.env[key] = envConfig[key];
        });
    }

    require('./mongoose')();
}
