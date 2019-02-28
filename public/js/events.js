NC.events = function () {
    // NC.elements.buttonAem.addEventListener('click', function (e) {
    //     e.preventDefault();
    //     NC.socket.emit('aem-post');
    // });

    NC.elements.buttonStart.addEventListener('click', function (e) {
        e.preventDefault();
        NC.elements.settings.style.display = 'none';
        NC.showElements(NC.elements.visibleRemote);
        NC.handleImages = NC.camera(NC.connector);
    });

    NC.elements.room.addEventListener('click', function (e) {
        e.preventDefault();
        const token = NC.elements.room.getAttribute('data-token');
        const user = NC.elements.room.getAttribute('data-user');
        console.log('=== 4.1. SOCKET: broadcastUI.joinRoom === :: Local ::');
        NC.connector.broadcastUI.joinRoom({
            roomToken: token,
            joinUser: user
        });
        NC.elements.room.style.display = 'none';
        NC.elements.settings.style.display = 'none';
    });

    NC.elements.buttonRemote.addEventListener('click', function (e) {
        e.preventDefault();
        console.log('=== 5.1. SOCKET: emit "take-photo" === :: Local ::');
        NC.socket.emit('take-photo');
    });

    document.body.onkeyup = function(e){
        if(e.keyCode === 32){
            NC.socket.emit('take-photo');
        }
    }

};