NC.handleAemIframe = function () {
    const frameSource = `${NC.domain}/${NC.pagePath}.html`;
    const $iframe = document.querySelector('.frame__aem');
    $iframe.src = frameSource;
};