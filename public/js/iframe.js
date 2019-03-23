NC.handleAemIframe = function () {
    const $iframe = document.querySelector('.frame__aem');
    const frameSource = $iframe.dataset.src;
    if (frameSource) {
        $iframe.src = frameSource;
    }
};