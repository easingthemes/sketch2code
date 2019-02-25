// Muaz Khan         - www.MuazKhan.com
// MIT License       - www.WebRTC-Experiment.com/licence
// Experiments       - github.com/muaz-khan/WebRTC-Experiment

NC = window.NC || {
    elements: {
        cameraRemote: document.querySelector('.camera__remote'),
        room: document.querySelector('.button__room'),
        buttonStart: document.querySelector('.button__start'),
        visibleLocal: document.querySelectorAll('.visible--local'),
        visibleRemote: document.querySelectorAll('.visible--remote'),
        settings: document.querySelector('.settings')
    },
    showElements: function(elements) {
        const length = elements.length;
        for (let index = 0; index < length; index++) {
            elements[index].style.display = 'block';
        }
    }
};

NC.connect = function() {
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
                socket.channel = config.channel;
                socket.on('connect', function() {
                    console.log('SOCKET: Connected');
                    if (config.callback) {
                        config.callback(socket);
                    }
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
                video.setAttribute('controls', true);

                NC.elements.cameraRemote.insertBefore(video, NC.elements.cameraRemote.firstChild);

                video.play();
            },
            onRoomFound: function(room) {
                console.log('SOCKET: Room found: ', room);
                NC.showElements(NC.elements.visibleLocal);
                NC.elements.room.setAttribute('data-token', room.roomToken);
                NC.elements.room.setAttribute('data-user', room.broadcaster);
                NC.elements.room.setAttribute('data-name', room.roomName);
                NC.elements.room.innerHTML = room.roomName;
            }
        }
    }
};

(function() {
    const ncConnect = NC.connect();
    ncConnect.broadcastUI = broadcast(ncConnect.config);

    NC.elements.buttonStart.addEventListener('click', function (e) {
        e.preventDefault();
        NC.elements.settings.style.display = 'none';
        NC.showElements(NC.elements.visibleRemote);
        NC.camera(ncConnect);
    });

    NC.elements.room.addEventListener('click', function (e) {
        e.preventDefault();
        const token = NC.elements.room.getAttribute('data-token');
        const user = NC.elements.room.getAttribute('data-user');
        ncConnect.broadcastUI.joinRoom({
            roomToken: token,
            joinUser: user
        });
    });
})();



