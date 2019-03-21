const postToAem = require('./postToAem');

module.exports = function (io) {
    const channels = {};

    io.sockets.on('connection', function (socket) {
        socket.setMaxListeners(41);
        console.log('connection io.isConnected: ', io.isConnected);

        let initiatorChannel = '';

        if (!io.isConnected) {
            io.isConnected = true;
        }

        socket.on('new-channel', function (data) {
            console.log('new-channel, channels: ', channels, 'data: ', data);

            if (!channels[data.channel]) {
                initiatorChannel = data.channel;
            }

            channels[data.channel] = data.channel;
            onNewNamespace(data.channel, data.sender);
        });

        socket.on('presence', function (channel) {
            const isChannelPresent = !! channels[channel];
            socket.emit('presence', isChannelPresent);
        });

        socket.on('disconnect', function (channel) {
            console.log('disconnect: ', channel);
            if (initiatorChannel) {
                delete channels[initiatorChannel];
            }
        });
    });

    function onNewNamespace(channel, sender) {
        io.of('/' + channel).on('connection', function (socket) {
            socket.setMaxListeners(41);

            let username;
            if (io.isConnected) {
                io.isConnected = false;
                socket.emit('connect', true);
            }

            socket.on('message', function (data) {
                if (data.sender === sender) {
                    if (!username) {
                        username = data.data.sender;
                    }

                    socket.broadcast.emit('message', data.data);
                }
            });
            socket.on('take-photo', function (data) {
                console.log('on take-photo: ', data);
                console.log('=== 5.2. SOCKET: on "take-photo" === :: Server ::');
                console.log('=== 5.3. SOCKET: emit "photo-taken" === :: Server ::');
                socket.broadcast.emit('photo-taken', data);
            });

            socket.on('aem-post', function (responseArray) {
                postToAem(socket, responseArray)
            });

            socket.on('disconnect', function() {
                if(username) {
                    socket.broadcast.emit('user-left', username);
                    username = null;
                }
            });
        });
    }
};

