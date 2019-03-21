const request = require('request-promise-native');
const aemContent = require('./aem-content.json');
const config = require('../config');

const aemDomain = config.domain; // 'http://localhost:4502';
const aemPagePath = `${config.pagePath}/jcr%3Acontent`; // 'content/test/oneweb/master/en/ml/jcr%3Acontent';

const optionsAem = {
    url: `${aemDomain}/${aemPagePath}`,
    method: 'POST',
    auth: {
        user: 'admin',
        pass: 'admin'
    }
};

let isAemPosted = false;
const postToAem = async (socket, mlResults) => {
    console.log('ML responses: ', mlResults, typeof mlResults);
    if (!isAemPosted) {
        isAemPosted = true;
        setTimeout(() => {
            isAemPosted = false;
        }, 1000);

        if (!mlResults) {
            return;
        }

        const finalArr = mlResults.filter(i => i);
        const allAemResponses = [];
        console.log('=== 6.2. SOCKET: on "aem-post" === :: Server ::', mlResults);

        for (const mlResult of finalArr) {
            let nodePath = '';
            let formData = {};

            const ml = mlResult.ml;
            const classificaton = ml.classificaton;

            switch (ml.endpoint) {
                case 'header':
                    formData = {
                        hideHeader: classificaton === 'header' ? "false" : "true"
                    };
                    nodePath = '';
                    break;
                case 'stage':
                    nodePath = '/stage';
                    if (classificaton === 'image') {
                        formData = Object.assign(aemContent['stage'], {
                            title: ''
                        });
                    }

                    if (classificaton === 'textimage') {
                        formData = aemContent.stage;
                    }

                    break;
                case 'teaserlist':
                    nodePath = mlResult.i === 2 ? '/par/teaserlist' : '/par/teaserlist_2';
                    if (classificaton !== 'empty') {
                        formData = Object.assign(aemContent.teaserlist, {
                            maxItems: classificaton,
                            columns: classificaton,
                            initialSize: classificaton
                        });
                    }
                    break;
            }

            socket.broadcast.emit('aem-posting', nodePath, formData);
            console.log(`Post to AEM: url: ${optionsAem.url}${nodePath}, data:`, formData);

            const onePost = await request.post(Object.assign({}, optionsAem, {
                url: `${optionsAem.url}${nodePath}`,
                formData: formData
            }));

            allAemResponses.push(onePost);
        }

        console.log('=== 6.3. SOCKET: request done, emit "aem-posted" === :: Server ::', allAemResponses);
        socket.broadcast.emit('aem-posted', allAemResponses);
    }
};

module.exports = postToAem;
