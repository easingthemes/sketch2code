NC = window.NC || {};

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

                socket.on('photo-taken', function() {
                    console.log('=== 5.4. SOCKET: on "photo-taken" === :: Remote ::');
                    // console.log('=== 5.5. SOCKET: buttonPhoto.click() === :: Remote ::');
                    // NC.elements.buttonPhoto.click();
                    NC.handleImages();
                });

                socket.on('aem-posted', function(data) {
                    console.log('=== 6.3. SOCKET: on "aem-posted" === :: Local ::', data);
                    const frameAem = document.querySelector('.frame__aem');
                    frameAem.src += '';
                });

                socket.on('room-ready', function(room) {
                    console.log('SOCKET: room ready');
                });

                socket.send = function(message) {
                    // console.log('SOCKET: emitting message', message);
                    socket.emit('message', {
                        sender: sender,
                        data: message
                    });
                };

                socket.on('message', config.onmessage);

                NC.socket = socket;
            },
            onRemoteStream: function(media) {
                console.log('=== 4.2. SOCKET: onRemoteStream === :: Local ::');
                const video = media.video;
                video.setAttribute('controls', false);
                video.classList.add('video__remote');
                NC.handleAemIframe();
                NC.elements.cameraRemote.insertBefore(video, NC.elements.cameraRemote.firstChild);

                video.play();
                //const scale = NC.elements.cameraRemote.offsetWidth / video.offsetWidth;
                const scale = 239 / video.offsetWidth;
                video.style.webkitTransform = `scale(${scale}) translateX(-50%)`;
            },
            onRoomFound: function(room) {
                const existingRoom = NC.elements.room.dataset.name;

                if (existingRoom !== room.roomName) {
                    console.log('=== 3.2. SOCKET: onRoomFound === :: Local ::', room);
                    NC.elements.buttonStart.style.display = 'none';
                    NC.elements.settings.style.display = 'none';
                    NC.elements.room.setAttribute('data-token', room.roomToken);
                    NC.elements.room.setAttribute('data-user', room.broadcaster);
                    NC.elements.room.setAttribute('data-name', room.roomName);
                    NC.elements.room.innerHTML = `Connect to: ${room.roomName}`;
                    NC.showElements(NC.elements.visibleLocal);
                }
            }
        }
    }
};

(function() {
    const ncConnect = NC.connect();
    ncConnect.broadcastUI = NC.broadcast(ncConnect.config);
    NC.connector = ncConnect;
})();
