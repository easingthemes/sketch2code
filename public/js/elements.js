NC = window.NC || {};
NC.elements = {
    cameraRemote: document.querySelector('.camera__remote'),
    room: document.querySelector('.button__room'),
    buttonStart: document.querySelector('.button__start'),
    buttonRemote: document.querySelector('.button__remotePhoto'),
    buttonPhoto: document.querySelector('.button__photo'),
    buttonAem: document.querySelector('.button__aem'),
    visibleLocal: document.querySelectorAll('.visible--local'),
    visibleRemote: document.querySelectorAll('.visible--remote'),
    settings: document.querySelector('.settings'),
};
NC.showElements = function (elements) {
    const length = elements.length;
    for (let index = 0; index < length; index++) {
        elements[index].style.display = 'block';
    }
};

NC.removeElements = function (elements) {
    elements.forEach(el => el.remove());
};
