(function() {
    NC = window.NC || {};
    NC.handleAem = function () {
        const frameWrapper = document.querySelector('.frame--scale');
        const frameSource = 'http://localhost:6700/editor.html/content/schwarzkopf/de/de/home.html';
        // const $iframe = document.createElement('iframe');
        const $iframe = document.querySelector('.frame__aem');

        // $iframe.onload = function() {
        //     const scale = 1 / $iframe.offsetWidth;
        //     $iframe.style.webkitTransform = `scale(${scale})`;
        // };

        $iframe.src = frameSource;
        //$iframe.setAttribute('allow', 'geolocation; microphone; camera');
        //$iframe.className = 'frame__aem';

        //frameWrapper.appendChild($iframe);
    }
})();