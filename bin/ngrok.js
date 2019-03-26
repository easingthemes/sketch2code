const ngrok = require('ngrok');

(async function() {
    const options = {
        addr: '4502'
    };

    if (process.env.NGROK_TOKEN) {
        options.subdomain = process.env.NGROK_TOKEN;
    }

    if (process.env.NGROK_DOMAIN) {
        options.subdomain = process.env.NGROK_DOMAIN;
    }

    try {
        const url = await ngrok.connect(options);
        console.log('Connected to: ', url);
    } catch (e) {
        console.log('Error connecting: ', e);
    }
})();