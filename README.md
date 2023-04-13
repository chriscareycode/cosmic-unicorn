# cosmic-paint-react

## Running this on a Cosmic Unicorn

Download the latest from the GitHub releases, and extract the files.

Copy emoji_paint/config-unicorns.example.json to emoji_paint/config-unicorns.json

Edit the file emoji_paint/config-unicorns.json with your Unicorn IP address.

Copy the files to your pico:
- emoji_paint.py
- emoji_paint/config-unicorns.json
- emoji_paint/static/ (folder with css and js)

emoji_paint.py goes in the root of your pico, and the emoji_paint/ folder contains the rest of the files.

This script uses and requires the same WIFI_CONFIG.py that many of the other WiFi examples use. That will need to be setup with your SSID="", PSK="", and COUNTRY="".

If you know the IP address that your pico has, then edit that IP address in the config-unicorns.json file.

If you do not know the IP address, then upload emoji_paint.py and run that. In the Thonny console it will tell your the IP address if WiFi connection is successful. Edit the config-unicorns.json with the IP address of your pico and upload the config file.

Upload the rest of the files to the pico using Thonny or another tool. 

## Development


### Running in local development

This project started as a standard React app created with create-react-app. Then TypeScript was added. Then switched to Preact (to reduce the bundle size). The bundle is still quite large mostly due to the emoji-picker-react library.

You need Node.js/npm to do development on this project.

npm install
npm start

Then connect to the local IP address and do your local development!

### Building the project for use on the Pico

When you are done editing files, create a build with this command:

npm run build

Then run this command to delete the extra files in the build folder to free up needed space (since the pico has such little space):

./delete-extra-build-files.sh

The files will be in the pico/ folder. Edit the config-unicorns.json with your own unicorn information, then upload the files to your pico with Thonny.









# The original create-react-app readme is below this

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
