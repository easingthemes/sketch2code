window.resCheck = function (cb) {
    // console.log('_____________________________STart res check');
    const resolutions = {
        width: [4096, 3840, 2560, 2160, 1920, 1792, 1440, 1280, 1200, 1080, 1024, 900, 828, 800, 768, 720, 640, 576, 480, 420],
        height: [4096, 3840, 2560, 2160, 1920, 1792, 1440, 1280, 1200, 1080, 1024, 900, 828, 800, 768, 720, 640, 576, 480, 420]
    };

    function maxRes(i, j, widthFound, heightFound) {
        const counter = {
            width: widthFound ? i - 1 : i,
            height: heightFound ? j - 1 : j
        };

        const width = resolutions.width[counter.width];
        const height = resolutions.height[counter.height];
        // console.log('_____________________________');
        // console.log('check data: ', width, height);
        const constraints = {
            "audio": false,
            "video": {
                "width": {
                    "min": width
                },
                "height": {
                    "min": height
                }
            }
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (stream) {
                // console.log("Success for --> " , width, height);
                cb(width, height);
            })
            .catch(function (error) {
                // console.log("Failed for --> ", width, height, error.constraint, error);
                if (!error.constraint) {
                    return;
                }
                maxRes(counter.width + 1, counter.height + 1, error.constraint !== 'width', error.constraint !== 'height');
            });
    }

    maxRes(0, 0, false, false);
};