(function() {
    NC = window.NC || {};
    NC.camera = function (ncConnect) {
        console.log('CAMERA: Starting ...');
        const video = document.getElementById('video');
        const canvas = document.querySelector('.canvas');
        const thumbs = document.querySelector('.thumbs');
        const parts = document.querySelector('.parts');
        const button = document.querySelector('.button__photo');

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
                    url: `${db}/media`
                },
                {
                    height: config.stage,
                    url: `${db}/media`
                },
                {
                    height: config.teaserRow,
                    url: `${db}/media`
                },
                {
                    height: config.teaserRow,
                    url: `${db}/media`
                }
            ],
        }, config);

        settings.rowsHeight = settings.rows.reduce((a, b) => a + b.height, 0);

        // Draw canvas from video
        resCheck(function (camWidth, camHeight) {
            camWidth = camWidth || 1024;
            camHeight = camHeight || 768;
            let width = camWidth,
                height = camHeight;
            if (state.isPortrait){
                width = camHeight;
                height = camWidth;
            }

            console.log('CAMERA: resolution: ', width, height);

            captureUserMedia(camWidth, camHeight);

            requestAnimationFrame(renderFrame);
        });

        function captureUserMedia(camWidth, camHeight) {
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
                console.log('CAMERA: stream captured');
                video.srcObject = stream;
                // Stream to socket
                ncConnect.config.attachStream = stream;
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

        // Handle partial images
        button.addEventListener('click', function (e) {
            e.preventDefault();
            handleImages();
        });

        const handleImages = function () {
            let top = settings.spacing;
            const time = Date.now();
            state.takePhoto = true;

            setTimeout(function () {
                renderArea(
                    `all-${time}.${settings.imageType}`,
                    state.x,
                    top,
                    state.width,
                    state.height,
                    canvas,
                    thumbs,
                    null
                );

                settings.rows.forEach(function (row, i) {
                    renderArea(
                        `part-${i}_${time}.${settings.imageType}`,
                        state.x,
                        top,
                        state.width,
                        row.height,
                        canvas,
                        parts,
                        row.url
                    );
                    top = top + row.height;
                });

                state.takePhoto = false;
            }, 40);
        };

        const renderArea = function (name, x, y, width, height, fullCanvas, wrapper, url) {
            const newCanvas = getCanvasArea(x, y, width, height, fullCanvas);
            const data = newCanvas.toDataURL();

            renderImage(data, name, wrapper);
            postImage(name, newCanvas, url);
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
            console.log('postImage: ', filename);
            window.location.hash = filename;
            if (!url) {
                console.log('Wrong url: ', url);
                return;
            }

            // canvasPart.toBlob(function(blob) {
            //     const formData = new FormData();
            //     formData.append('image', blob, filename);
            //     // restdb.io API works only with jQuery
            //     // TODO fix vanilla JS request and remove jQuery
            //     $.ajaxPrefilter(function( options ) {
            //         if ( !options.beforeSend) {
            //             options.beforeSend = function(xhr) {
            //                 xhr.setRequestHeader('x-apikey', key);
            //             }
            //         }
            //     });
            //
            //     $.ajax({
            //         data: formData,
            //         url: url,
            //         method: 'POST',
            //         enctype: 'multipart/form-data',
            //         processData: false,
            //         contentType: false,
            //         traditional: true,
            //     }).done(function (response) {
            //         console.log('response', response);
            //     }).fail(function (e) {
            //         console.log('error response', e);
            //     });
            // });
        };
    }
})();