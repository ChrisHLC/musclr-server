// PRO TIP
// why the fuck is the config.json out of git?
// for security reason, you don't want everybody to be able to access your JWT_SECRET, which encode your token
// What do we need inside this config?
// {
//     "test": {
//         "PORT": the_port_you_want,
//         "MONGODB_URI": "mongodb://the_uri_to_your_test_database",
//         "JWT_SECRET": "a_random_string"
//      },
//     "development": {
//         "PORT": 3000,
//         "MONGODB_URI": "mongodb://the_uri_to_your_database",
//         "JWT_SECRET": "another_random_string"
//      }
// }
const env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
    const config = require('./config.json');
    const envConfig = config[env];

    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}
