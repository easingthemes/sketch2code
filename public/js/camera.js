(function() {
    NC = window.NC || {};
    NC.camera = function (ncConnect) {
        console.log('CAMERA: Starting ...');
        const video = document.getElementById('video');
        const canvas = document.querySelector('.canvas');
        const thumbs = document.querySelector('.thumbs');
        const parts = document.querySelector('.parts');

        const context = canvas.getContext('2d');
        const key = '5c6ec8e728ca2e129e8696e7';
        const db = 'https://sketch2code-9caf.restdb.io';

        const state = {
            videoWidth: 0,
            videoHeight: 0,
            x: 0,
            width: 0,
            height: 0,
            takePhoto: false,
            isPortrait: window.innerHeight > window.innerWidth,
            isRetina: window.devicePixelRatio > 1
        };
        const retina = state.isPortrait ? 1.9 : 1;
        const config = {
            spacing: 10 * retina,
            header: 40 * retina,
            stage: 200 * retina,
            teaserRow: 150 * retina,
            paperWidth: 67.5,
            paperHeight: 98,
            imageType: 'png',
            lineWidth: 6,
            strokeStyle: 'green'
        };

        const settings = Object.assign({
            paperScale: config.paperWidth/config.paperHeight,
            rows: [
                {
                    height: config.header,
                    url: `header`
                },
                {
                    height: config.stage,
                    url: `stage`
                },
                {
                    height: config.teaserRow,
                    url: `teaserlist`
                },
                {
                    height: config.teaserRow,
                    url: `teaserlist`
                }
            ],
        }, config);

        settings.rowsHeight = settings.rows.reduce((a, b) => a + b.height, 0);

        // Draw canvas from video
        NC.resolutionCheck(function (camWidth, camHeight) {
            camWidth = camWidth || 1024;
            camHeight = camHeight || 768;
            let width = camWidth,
                height = camHeight;
            if (state.isPortrait){
                width = camHeight;
                height = camWidth;
            }

            captureUserMedia(camWidth, camHeight);

            requestAnimationFrame(renderFrame);
        });

        function captureUserMedia(camWidth, camHeight) {
            console.log('=== 1.1. CAMERA: Start === :: Remote ::');
            camWidth = camWidth || 1280;
            camHeight = camHeight || 720;
            navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    facingMode: 'environment',
                    width: {
                        min: camWidth
                    },
                    height: {
                        min: camHeight
                    }
                }
            }).then(function(stream) {
                console.log('=== 2.2. CAMERA: End === :: Remote ::');
                video.srcObject = stream;
                // Stream to socket
                ncConnect.config.attachStream = stream;
                console.log('=== 3.1. SOCKET: broadcastUI.createRoom === :: Remote ::');
                ncConnect.broadcastUI.createRoom({
                    roomName: 'nc-summit19'
                });
            }, function(error) {
                console.log(error);
            });
        }

        function renderFrame() {
            requestAnimationFrame(renderFrame);

            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                state.videoWidth = video.videoWidth;
                state.videoHeight = video.videoHeight;

                const maxHeight = state.videoHeight - settings.spacing * 2;
                state.height = maxHeight < settings.rowsHeight ? maxHeight : settings.rowsHeight;
                state.width = settings.paperScale * state.height;
                state.x = (state.videoWidth - state.width) / 2;

                canvas.width = state.videoWidth;
                canvas.height = state.videoHeight;
                context.drawImage(video, 0, 0, state.videoWidth, state.videoHeight);

                if (!state.takePhoto) {
                    renderLayout(context, state.x, state.width);
                }
            }
        }

        const renderLayout = function (ctx, left, width) {
            ctx.strokeStyle = settings.strokeStyle;
            ctx.lineWidth = settings.lineWidth;

            let top = settings.spacing;
            settings.rows.forEach(function (row) {
                ctx.rect(left, top, width, row.height);
                top = top + row.height;
            });
            ctx.stroke();
        };

        const renderArea = function (name, x, y, width, height, fullCanvas, wrapper, url, i) {
            return new Promise((resolve, reject) => {
                const newCanvas = getCanvasArea(x, y, width, height, fullCanvas);
                const data = newCanvas.toDataURL();

                renderImage(data, name, wrapper);

                postImage(name, newCanvas, url)
                    .then((resp) => {
                        const finalResponse = {
                          ml: resp,
                          i: i
                        };
                        resolve(finalResponse);
                    })
                    .catch((e) => {
                        reject(e);
                    });
            });
        };

        const getCanvasArea = function (x, y, width, height, fullCanvas) {
            const newCanvas = document.createElement('canvas');
            newCanvas.width = width;
            newCanvas.height = height;

            const newContext = newCanvas.getContext('2d');
            newContext.drawImage(fullCanvas, x, y, width, height, 0, 0, width, height);

            return newCanvas;
        };

        const renderImage = function (data, filename, wrapper) {
            const link = document.createElement('a');
            link.setAttribute('download', filename);
            link.href = data;
            const img = document.createElement('img');
            img.setAttribute('download', filename);
            img.src = data;
            wrapper.appendChild(link);
            link.appendChild(img);
        };

        const postImage = function (filename, canvasPart, url) {
            return new Promise((resolve, reject) => {
                if (!url) {
                    console.log('Wrong url: ', url);
                    reject('Wrong url');
                    return;
                }

                canvasPart.toBlob(function(blob) {
                    const formData = new FormData();
                    formData.append('uploaded_file', blob, filename);

                    // TODO fix vanilla JS request and remove jQuery
                    $.ajax({
                        data: formData,
                        url: url,
                        method: 'POST',
                        enctype: 'multipart/form-data',
                        processData: false,
                        contentType: false,
                        traditional: true,
                    }).done(function (response) {
                        console.log('response', response, typeof response);
                        let responseObject = null;
                        if (typeof response === 'string' && response.length > 1) {
                            try {
                                responseObject = JSON.parse(response);
                            } catch (e) {
                                console.log('response error parsing json', e);
                            }

                        }
                        console.log('responseObject', responseObject, typeof responseObject);
                        resolve(responseObject);
                    }).fail(function (error) {
                        console.log('error response', error);
                        reject({
                            error: error.responseText,
                            url: url
                        });
                    });
                });
            });
        };

        const handleImages = function () {
            let top = settings.spacing;
            const time = Date.now();
            state.takePhoto = true;

            const promises = [];

            setTimeout(function () {
                settings.rows.forEach(function (row, i) {
                    promises.push(renderArea(
                        `part-${i}_${time}.${settings.imageType}`,
                        state.x,
                        top,
                        state.width,
                        row.height,
                        canvas,
                        parts,
                        `${NC.api}/${row.url}`,
                        i
                    ));
                    top = top + row.height;
                });

                Promise.all(promises.map(p => p.catch((error) => error)))
                    .then(function (data) {
                        console.log('=== 6.1. SOCKET: emit "aem-post" === :: Remote ::', data);
                        NC.socket.emit('aem-post', data);
                    });

                state.takePhoto = false;
            }, 40);
        };

        return handleImages;
    }
})();