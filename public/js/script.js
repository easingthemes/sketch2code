NC = window.NC || {};

NC.connect = function() {
    const button = document.querySelector('.button__photo');
    return {
        config: {
            openSocket: function(config) {
                console.log('SOCKET: Start ...');
                const SIGNALING_SERVER = '/';

                config.channel = config.channel || location.href.replace(/\/|:|#|%|\.|\[|\]/g, '');
                const sender = Math.round(Math.random() * 999999999) + 999999999;

                io.connect(SIGNALING_SERVER).emit('new-channel', {
                    channel: config.channel,
                    sender: sender
                });

                const socket = io.connect(SIGNALING_SERVER + config.channel);
                NC.socket = socket;
                socket.channel = config.channel;
                socket.on('connect', function() {
                    console.log('SOCKET: Connected');
                    if (config.callback) {
                        config.callback(socket);
                    }
                });

                socket.on('take-photo', function() {
                    console.log('SOCKET: Take photo');
                    button.click();
                });

                socket.on('reload-frame', function(data) {
                    console.log('SOCKET: Reload frame', data);
                    const frameAem = document.querySelector('.frame__aem');
                    frameAem.src += '';
                    frameAem.onload = function () {
                        const matrix = NC.matrix();
                        matrix.stop(data)
                    }
                });

                socket.on('room-ready', function(room) {
                    console.log('SOCKET: room ready');
                });

                socket.send = function(message) {
                    console.log('SOCKET: emitting message', message);
                    socket.emit('message', {
                        sender: sender,
                        data: message
                    });
                };

                socket.on('message', config.onmessage);
            },
            onRemoteStream: function(media) {
                console.log('SOCKET: remote stream received');
                const video = media.video;
                video.setAttribute('controls', false);
                video.classList.add('video__remote');
                NC.handleAem();
                NC.elements.cameraRemote.insertBefore(video, NC.elements.cameraRemote.firstChild);

                video.play();

                //const scale = NC.elements.cameraRemote.offsetWidth / video.offsetWidth;
                const scale = 239 / video.offsetWidth;

                video.style.webkitTransform = `scale(${scale}) translateX(-50%)`;
            },
            onRoomFound: function(room) {
                console.log('SOCKET: Room found: ', room);
                NC.elements.buttonStart.style.display = 'none';
                NC.elements.settings.style.display = 'none';
                NC.showElements(NC.elements.visibleLocal);
                NC.elements.room.setAttribute('data-token', room.roomToken);
                NC.elements.room.setAttribute('data-user', room.broadcaster);
                NC.elements.room.setAttribute('data-name', room.roomName);
                NC.elements.room.innerHTML = `Connect to: ${room.roomName}`;
            }
        }
    }
};

(function() {
    const ncConnect = NC.connect();
    ncConnect.broadcastUI = broadcast(ncConnect.config);

    NC.join = function (token, user) {
        token = token || NC.elements.room.getAttribute('data-token');
        user = user || NC.elements.room.getAttribute('data-user');
        ncConnect.broadcastUI.joinRoom({
            roomToken: token,
            joinUser: user
        });
        NC.elements.room.style.display = 'none';
        NC.elements.settings.style.display = 'none';
    };

    NC.elements.buttonStart.addEventListener('click', function (e) {
        e.preventDefault();
        NC.elements.settings.style.display = 'none';
        NC.showElements(NC.elements.visibleRemote);
        NC.camera(ncConnect);
    });

    NC.elements.room.addEventListener('click', function (e) {
        e.preventDefault();
        NC.join();
    });

    function handleRemotePhoto() {
        console.log('remote button click');
        const matrix = NC.matrix();
        const interval = matrix.start();
        NC.socket.emit('take-photo', interval);
    }
    const buttonRemote = document.querySelector('.button__remotePhoto');

    buttonRemote.addEventListener('click', function (e) {
        e.preventDefault();
        handleRemotePhoto();
    });

    document.body.onkeyup = function(e){
        if(e.keyCode === 32){
            handleRemotePhoto();
        }
    }
})();
