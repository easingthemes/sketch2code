const config = {
    domain: 'http://henkel-author-qa.nhe.netcentric.biz:4502', //'http://localhost:4502', //'http://192.168.178.37:4502',
    pagePath: 'content/test/oneweb/master/en/ml',
    api: 'http://localhost:8080/mock', //'https://localhost:4567'//,
    auth: {
        user: 'admin',
        pass: 'admin'
    }
};
console.log(config);
module.exports = config;
