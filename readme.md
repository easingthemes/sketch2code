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
npm run debug
```

# Start Mock server for testing only!
```
npm run mock
```

# 0 Config

Update env vars in debug task:
```
AEM_USER
AEM_PASS
AEM_DOMAIN
AEM_PATH
AEM_WCMMODE
ML_API
```

# URL local:

Local:
https://localhost/3000

Use IP instead `localhost` to test it cross devices.

# Remote URL:
https://sketch2code-web.herokuapp.com

# 1. Open Camera

1.1. Open homepage with custom hash, eg:
```
URL/#1
```

1.2. Click on `Start Broadcast` button.

1.3. Allow Camera usage.

1.4. You should see camera stream with grid on top.

# 2. Open Presentation

2.1. Open homepage with same custom hash as on Camera. eg:
```
URL/#1
```
Wait a bit to find broadcaster.

2.2. Click `Connect to: nc-summit19` on Iphone demo image.

Wait for connection.

2.3. You should see remote camera stream on Iphone demo image, and local AEM on Chrome demo image.
On first visit You need to click `Load unsafe scripts` in Chrome bar on the right. Reload page and repeat step 2.2

2.4. Click on Iphone home button to take a picture from remote Camera

2.5 You should see processing loader.

2.6 Once processing is done, animation will stop and AEM instance in Chrome demo image (iframe) will reload.


# 3. Sample images for training

If you need only sample images, use instruction from Step #1, and 

1.5. Click on `Take photo` button to get photos from Camera directly.

!! Images in this app are not saved anywhere.
You need to save them manually.
DB is disconnected for testing purposes.


# 4. Heroku

Code is in Github repo: https://github.com/easingthemes/sketch2code

App name: `sketch2code-web`

Heroku CI is configured for auto deploy after changes to `master` branch of Github repo.
You can also do manual deployment in Heroku admin panel.
Deployment logs are visible in Heroku admin panel.

Server logs can be accessed with:
```
heroku logs --tail --app sketch2code-web
```
More info: https://devcenter.heroku.com/articles/logging
You need to login to Heroku Cli https://devcenter.heroku.com/articles/heroku-cli
