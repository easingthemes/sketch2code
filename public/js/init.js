(function(window){
    const config = {
        domain: process.env.AEM_DOMAIN,
        pagePath: process.env.AEM_PATH,
        api: process.env.ML_API
    };
    if (typeof module === 'object' && module && typeof module.exports === 'object') {
        module.exports = config;
    } else {
        window.NC = config;
    }
})(this);