const video = document.getElementById('video');
const canvas = document.querySelector('.canvas');
const thumbs = document.querySelector('.thumbs');
const parts = document.querySelector('.parts');
const button = document.querySelector('.button');
const resolution = document.querySelector('.resolution');
const context = canvas.getContext('2d');

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
    header: 30 * retina,
    stage: 200 * retina,
    teaserRow: 150 * retina,
    paperWidth: 67.5,
    paperHeight: 98,
    imageType: 'image/png',
    lineWidth: 6,
    strokeStyle: 'green'
};

const settings = Object.assign({
    paperScale: config.paperWidth/config.paperHeight,
    rows: [
        config.header,
        config.stage,
        config.teaserRow,
        config.teaserRow
    ],
}, config);

settings.rowsHeight = settings.rows.reduce((a, b) => a + b, 0);

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
        ctx.rect(left, top, width, row);
        top = top + row;
    });
    ctx.stroke();
};

resCheck(function (camWidth, camHeight) {
    let width = camWidth,
        height = camHeight;
    if (state.isPortrait){
            width = camHeight;
            height = camWidth;
    }

    console.log('resolution: ', width, height);
    resolution.innerHTML = `${width}/${height}`;
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
        video.srcObject = stream;
    }, function(error) {
        console.log(error);
    });

    requestAnimationFrame(renderFrame);
});

const renderArea = function (name, x, y, width, height, fullCanvas, wrapper) {
    const data = getCanvasArea(x, y, width, height, fullCanvas);
    renderImage(data, name, wrapper, width, height);
};

const getCanvasArea = function (x, y, width, height, fullCanvas) {
    const newCanvas = document.createElement('canvas');
    newCanvas.width = width;
    newCanvas.height = height;

    const newContext = newCanvas.getContext('2d');
    newContext.drawImage(fullCanvas, x, y, width, height, 0, 0, width, height);

    return newCanvas.toDataURL();
};

const renderImage = function (data, section, wrapper, width, height) {
    const filename = `${section}-${Date.now()}.png`;
    const link = document.createElement('a');
    link.setAttribute('download', filename);
    link.href = data;
    const img = document.createElement('img');
    img.setAttribute('download', filename);
    img.setAttribute('data-width', width);
    img.setAttribute('data-height', height);
    img.src = data;
    wrapper.appendChild(link);
    link.appendChild(img);
};

button.addEventListener('click', function (e) {
    e.preventDefault();
    let top = settings.spacing;
    state.takePhoto = true;
    setTimeout(function () {
        renderArea(
            'all',
            state.x,
            top,
            state.width,
            state.height,
            canvas,
            thumbs
        );

        settings.rows.forEach(function (row) {
            renderArea(
                `header_${top}`,
                state.x,
                top,
                state.width,
                row,
                canvas,
                parts
            );
            top = top + row;
        });
        state.takePhoto = false;
    }, 30);
});
