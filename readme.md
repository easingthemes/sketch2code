# Requirements
NodeJS v8+ https://nodejs.org/en/download/

# Get code
```
git clone https://github.com/easingthemes/sketch2code.git
```

# CD into project dir
```
cd sketch2code
```

# Install dependencies
```
npm install
```

# Start https server
```
npm start
```

# Start Mock server for testing only!
```
npm run mock
```

# 0 Config

Update config urls:
```
sketch2code/config.js
sketch2code/public/js/init.js
```

# URL:

Local:
Local server is using port `3000`;
Use IP instead `localhost` to test it cross devices.

# Remote:
https://sketch2code-web.herokuapp.com/

# 1. Open Camera

1.1. Open homepage with custom hash, eg:
```
https://192.168.178.37:3000/#1
```
1.2. Click on `Start Broadcast` button.

1.3. Allow Camera usage.

1.4. You should see camera stream with grid on top.

# 2. Open Presentation

2.1. Open homepage with same custom hash as on Camera. eg:
```
https://192.168.178.37:3000/#1
```
Wait a bit to find broadcaster.

2.2. Click `Connect to: nc-summit19` on Iphone demo image.

Wait for connection.

2.3. You should see remote camera stream on Iphone demo image, and local AEM on Chrome demo image.
On first visit You need to click `Load unsafe scripts` in Chrome bar on teh right.

2.4. Click on Iphone home button to take a picture from remote Camera

2.5 You should see processing loader, matrix effect in the background.

2.6 Once processing is done, animation will stop and AEM instance in Chrome demo image (iframe) wil reload.

.

# 3. Sample images for training

If you need only sample images, use instruction from Step #1, and 

1.5. Click on `Take photo` button to get photos from Camera directly.

!! Images in this app are not saved anywhere.
DB is disconnected for testing purposes.