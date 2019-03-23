const shared = require('./public/js/init');
const config = Object.assign({}, shared, {
    auth: {
        user: process.env.AEM_USER,
        pass: process.env.AEM_PASS
    }
});

module.exports = config;
