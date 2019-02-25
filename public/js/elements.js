NC = {
    elements: {
        cameraRemote: document.querySelector('.camera__remote'),
        room: document.querySelector('.button__room'),
        buttonStart: document.querySelector('.button__start'),
        visibleLocal: document.querySelectorAll('.visible--local'),
        visibleRemote: document.querySelectorAll('.visible--remote'),
        settings: document.querySelector('.settings')
    },
    showElements: function (elements) {
        const length = elements.length;
        for (let index = 0; index < length; index++) {
            elements[index].style.display = 'block';
        }
    }
};
