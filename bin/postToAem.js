const request = require('request-promise-native');
const aemContent = require('./aem-content.json');
const { config, hidden } = require('../config');

const aemDomain = config.domain; // 'http://localhost:4502';
const aemPagePath = `${config.pagePath}/jcr%3Acontent`; // 'content/test/oneweb/master/en/ml/jcr%3Acontent';

const optionsAem = {
    url: `${aemDomain}/${aemPagePath}`,
    method: 'POST',
    auth: hidden.auth
};

let isAemPosted = false;

const postToAem = async (socket, mlResults) => {
    console.log('ML responses: ', mlResults.length, mlResults);
    if (!isAemPosted) {
        isAemPosted = true;
        setTimeout(() => {
            isAemPosted = false;
        }, 1000);

        if (!mlResults) {
            return;
        }

        const finalArr = getFinalMlResults(mlResults);

        const allAemResponses = await postAllToAem(socket, finalArr);
        console.log('=== 6.3. SOCKET: request done, emit "aem-posted" === :: Server ::', allAemResponses);
        socket.broadcast.emit('aem-posted', allAemResponses);
    }
};

const getFinalMlResults = (mlResults) => {
    return mlResults.map((result, i) => {
        if (result.error) {
            const errorUrl = result.url;
            let errorEndpoint = 'error';
            if (errorUrl) {
                const errorUrlArr = errorUrl.split('/');
                errorEndpoint = errorUrlArr[errorUrlArr.length - 1];
            }
            return {
                ml: {
                    error: true,
                    endpoint: errorEndpoint,
                    classificaton: 'empty'
                },
                i
            };
        }

        return result;
    });
};

const postAllToAem = async (socket, finalArr) => {
    const allAemResponses = [];
    console.log('=== 6.2. SOCKET: on "aem-post" === :: Server ::', finalArr);

    for (const mlResult of finalArr) {
        const { nodePath, formData } = getFormData(mlResult);
        const onePost = await postOneToAem(socket, nodePath, formData);
        allAemResponses.push(onePost);
    }

    return allAemResponses;
};

const getFormData = (mlResult) => {
    let nodePath = '';
    let formData = {};

    const emptyNode = {
        "sling:resourceType": "foundation/components/parsys"
    };

    const ml = mlResult.ml || {};
    const classificaton = ml.classificaton;

    if (classificaton) {
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
                        title: 'Updated title'
                    });
                } else if (classificaton === 'textimage') {
                    formData = aemContent.stage;
                } else {
                    formData = {
                        title: '&nbsp;',
                        ...emptyNode
                    };
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
                } else {
                    formData = emptyNode;
                }
                break;
        }
    }

    if (ml.error) {
        formData = {
            mlError: 'true',
            ...formData
        };
    }

    formData.mlDate = Date();

    return {
        nodePath,
        formData
    }
};

const postOneToAem = async (socket, nodePath, formData) => {
    socket.broadcast.emit('aem-posting', nodePath, formData);
    console.log(`Post to AEM: url: ${optionsAem.url}${nodePath}, data:`, formData);

    let onePost;
    try {
        onePost = await request.post(Object.assign({}, optionsAem, {
            url: `${optionsAem.url}${nodePath}`,
            formData: formData
        }));
        console.log('AEM onePost done', onePost);
    } catch (e) {
        onePost = null;
        console.log(`Post to AEM: url: ${optionsAem.url}${nodePath} ERROR:`, e);
    }

    return onePost;
};

module.exports = postToAem;
