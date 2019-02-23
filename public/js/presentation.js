
(function() {
    const frameWrapper = document.querySelector('.frame--scale');
    const frame = document.querySelector('.frame--scale iframe');

    const scale = frameWrapper.offsetWidth / frame.offsetWidth;
    frame.style.webkitTransform = `scale(${scale})`;
})();