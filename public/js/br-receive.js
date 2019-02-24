// Muaz Khan         - www.MuazKhan.com
// MIT License       - www.WebRTC-Experiment.com/licence
// Experiments       - github.com/muaz-khan/WebRTC-Experiment
(function() {
    NC = window.NC || {};
    NC = Object.assign(NC, {
        roomName: 'nc-summit2019',
        room: document.querySelector('.room')
    });

    NC.BRconfig = {
        openSocket: function(config) {
            var SIGNALING_SERVER = '/'; //https://192.168.178.37:3000/camera#53459073663750026';//'https://192.168.178.37:3000/camera'; // 'https://webrtcweb.com:9559/';

            config.channel = config.channel || location.href.replace(/\/|:|#|%|\.|\[|\]/g, '');//'https192168178373000camera53459073663750026';
            var sender = Math.round(Math.random() * 999999999) + 999999999;

            io.connect(SIGNALING_SERVER).emit('new-channel', {
                channel: config.channel,
                sender: sender
            });

            var socket = io.connect(SIGNALING_SERVER + config.channel);
            socket.channel = config.channel;
            socket.on('connect', function() {
                console.log('connect client');
                if (config.callback) config.callback(socket);
            });

            socket.send = function(message) {
                console.log('send client');
                socket.emit('message', {
                    sender: sender,
                    data: message,
                    trest: 'trest r'
                });
            };

            socket.on('message', config.onmessage);
        },
        onRemoteStream: function(media) {
            console.log('onRemoteStream', media);
            var video = media.video;
            video.setAttribute('controls', false);
            const $participants = document.querySelector('.participants');
            $participants.insertBefore(video, participants.firstChild);

            video.play();
        },
        onRoomFound: function(room) {
            console.log('onRoomFound', room);
            if (NC.room.dataset.user === room.broadcaster) {
                return;
            }

            // Stream to socket
            const user = NC.room.dataset.user;

            if (!user) {
                if (NC.room.dataset.name !== NC.roomName) {
                    NC.broadcastUI.createRoom({
                        roomName: room.roomName
                    });
                }
                NC.broadcastUI.joinRoom({
                    roomToken: room.roomToken,
                    joinUser: room.broadcaster
                });
            }

            NC.room.innerText = room.roomName;
            NC.room.setAttribute('data-name', room.roomName);
            NC.room.setAttribute('data-token', room.roomToken);
            NC.room.setAttribute('data-user', room.broadcaster);
        }
    };

    NC.broadcastUI = broadcast(NC.BRconfig);

    function handleCreateRoom() {
        if (NC.room.dataset.name !== NC.roomName) {
            NC.broadcastUI.createRoom({
                roomName: NC.roomName
            });
        }
    }

    const $startPresentation = document.querySelector('.button__startPresentation');
    $startPresentation.addEventListener('click', function (e) {
        e.preventDefault();
        handleCreateRoom();
    });

    const $startCamera = document.querySelector('.button__startCamera');
    $startCamera.addEventListener('click', function (e) {
        e.preventDefault();
        NC.camera();
    });
})();
