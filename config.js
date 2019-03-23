const config = {
    domain: process.env.AEM_DOMAIN,
    pagePath: process.env.AEM_PATH,
    api: process.env.ML_API,
    wcmmode: process.env.WCMMODE ? `?wcmmode=${process.env.WCMMODE}` : '',
};

config.aemUrl = `${config.domain}/${config.pagePath}.html${config.wcmmode}`;

const hidden = {
    auth: {
        user: process.env.AEM_USER,
        pass: process.env.AEM_PASS
    }
};

module.exports = {
    config,
    hidden
};
