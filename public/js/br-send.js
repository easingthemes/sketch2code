// Muaz Khan         - www.MuazKhan.com
// MIT License       - www.WebRTC-Experiment.com/licence
// Experiments       - github.com/muaz-khan/WebRTC-Experiment

var BRconfig = {
    openSocket: function(config) {
        console.log('openSocket', config);
        var SIGNALING_SERVER = '/'; //https://192.168.178.37:3000'; // 'https://webrtcweb.com:9559/';

        config.channel = config.channel || location.href.replace(/\/|:|#|%|\.|\[|\]/g, '');
        var sender = Math.round(Math.random() * 999999999) + 999999999;

        io.connect(SIGNALING_SERVER).emit('new-channel', {
            channel: config.channel,
            sender: sender
        });

        var socket = io.connect(SIGNALING_SERVER);
        socket.channel = config.channel;
        socket.on('connect', function() {
            console.log('connect client');
            if (config.callback) config.callback(socket);
        });

        socket.send = function(message) {
            console.log('send client', message);
            socket.emit('message', {
                sender: sender,
                data: message,
                trest: 'trest s'
            });
        };

        socket.on('message', config.onmessage);
    },
    onRemoteStream: function(media) {
        console.log('onRemoteStream', media);
        var video = media.video;
        video.setAttribute('controls', true);

        participants.insertBefore(video, participants.firstChild);

        video.play();
    },
    onRoomFound: function(room) {
        console.log('onRoomFound', room);
        var alreadyExist = document.getElementById(room.broadcaster);
        if (alreadyExist) return;

        if (typeof roomsList === 'undefined') roomsList = document.body;

        var tr = document.createElement('tr');
        tr.setAttribute('id', room.broadcaster);
        tr.innerHTML = '<td>' + room.roomName + '</td>' +
            '<td><button class="join" id="' + room.roomToken + '">Join Room</button></td>';
        roomsList.insertBefore(tr, roomsList.firstChild);

        tr.onclick = function() {
            tr = this;
            captureUserMedia(function() {
                broadcastUI.joinRoom({
                    roomToken: tr.querySelector('.join').id,
                    joinUser: tr.id
                });
            });
        };
    }
};

/* on page load: get public rooms */
var broadcastUI = broadcast(BRconfig);

/* UI specific */
var participants = document.getElementById("participants") || document.body;
var roomsList = document.getElementById('rooms-list');

(function() {
    var uniqueToken = document.getElementById('unique-token');
    if (uniqueToken) {
        if (location.hash.length > 2) uniqueToken.parentNode.parentNode.parentNode.innerHTML = '<h2 style="text-align:center;"><a href="' + location.href + '" target="_blank">Share this link</a></h2>';
        else uniqueToken.innerHTML = uniqueToken.parentNode.parentNode.href = '#' + (Math.random() * new Date().getTime()).toString(36).toUpperCase().replace( /\./g , '-');
    }
})();
