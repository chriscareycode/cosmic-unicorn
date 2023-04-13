# cosmic-paint-react

This is a project for the Pimoroni Cosmic Unicorn that allows you to paint emojis on them, and control them from a computer, phone, or tablet https://shop.pimoroni.com/products/cosmic-unicorn

![Cosmic Emojis](https://chriscarey.com/images/pimoroni/unicorn/photo1.png "Cosmic Emojis")

<img src="https://chriscarey.com/images/pimoroni/unicorn/mobile.jpg" alt="Mobile" width="200"/>

#

## Running this on a Cosmic Unicorn

Here are the instructions for running this without needing to manually build the project

-  Download the latest from the GitHub releases. [https://github.com/chriscareycode/cosmic-paint-react/releases](https://github.com/chriscareycode/cosmic-paint-react/releases) . You only need the cosmic-paint-react-v0.0.0 file, not the source code files.

- Extract the file.

- Copy `emoji_paint/config-unicorns.example.json` to `emoji_paint/config-unicorns.json`

- Edit the file `emoji_paint/config-unicorns.json` with your Unicorn IP address.

- If you have multiple Cosmic Unicorns, you can add multiple entries to control them all. Make sure to add commas in the right spots so the file is valid JSON format.

### Edit the config file with your Pico IP address

If you know the IP address that your pico has, then edit that IP address in the `config-unicorns.json` file.

If you do not know the IP address, then upload `emoji_paint.py` and run that. In the Thonny console it will tell your the IP address if WiFi connection is successful. Edit the `config-unicorns.json` with the IP address of your pico and save the config file.

### Setup WIFI_CONFIG.py

This script uses and requires the same WIFI_CONFIG.py that many of the other WiFi examples use. That will need to be setup like this:
```
SSID=""
PSK=""
and COUNTRY=""
```

### Install required libraries

In Thonny, go to Tools -> Manage Packages...

Search for `microdot_asyncio` and install that. It is needed for the web server on the Pico.

### Upload the files (with user interface)

Upload the rest of the files to the pico using Thonny or another tool. 

Copy the files to your pico:
- emoji_paint.py
- emoji_paint/index.html
- emoji_paint/config-unicorns.json
- emoji_paint/static/ (folder with css and js)

emoji_paint.py goes in the root of your pico, and the emoji_paint/ folder contains the user interface.

### Optionally upload the Python file only (without uploading the user interface)
It's worth noting that you can choose to NOT install the user interface on the pico, to save space. For this, you will only need the WIFI_CONFIG.py and emoji_paint.py and that's it. You can choose to run the user interface on your computer, or anywhere else you want.

### Optionally make this script run when the Pico boots up

If you want this script to run on boot, then you need to copy the contents of `emoji_paint.py` into `main.py`. main.py is the file that starts on boot.

#
# Running the project in Development mode


### Running in local development

This project started as a standard React app created with create-react-app. Then TypeScript was added. Then switched to Preact (to reduce the bundle size). The bundle is still quite large (in pico terms) at like 290KB.

Setup the config-unicorns.json file:

- Copy `public/config-unicorns.example.json` to `public/config-unicorns.json`

- Edit the file `public/config-unicorns.json` with your Unicorn IP address.

You need Node.js/npm installed to do development on this project.

### `npm install`
### `npm start`

Then connect to the local IP address and do your local development! Open [http://localhost:3069](http://localhost:3069) to view it in the browser.

### Building the project for use on the Pico

When you are done editing files, create a build with this command:

### `npm run build`

Then run this special delete command to delete the extra files in the build folder to free up needed space (since the pico has such little space):

### `./delete-extra-build-files.sh`

The built files will be in the pico/ folder. Upload the files to your pico with Thonny.

#

Thanks to Pimoroni for creating these awesome boards!

2023 Chris Carey