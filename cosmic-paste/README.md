# cosmic-paste

A vanilla JavaScript/HTML page to paste from the clipboard to the Cosmic Unicorn

This weekend hack project currently only supports pasting to 4 cosmic unicorns. I will update the project to support pasting both to 1 or 4 cosmic unicorn soon..

![Cosmic Emojis](https://chriscarey.com/images/pimoroni/unicorn/cosmic-paste-1.jpeg "Cosmic Paste")

## Install required libraries

Connect your Pico to the computer and run Thonny. Select your Pico by clicking on the bottom right corner in Thonny. You should see the list of files on the Pico in the bottom left section. Stop any running process by clicking the Stop icon.

In Thonny, go to Tools -> Manage Packages...

Search for `microdot_asyncio` and install that. This will copy some files into the lib/ folder on your pico. It is needed for the web server that we use (same as cosmic_paint).

## Setup WIFI_CONFIG.py

This script uses and requires the same `WIFI_CONFIG.py` that many of the other WiFi examples use (like cosmic_paint). That will need to be setup like this:
```
SSID="fill this in with network name"
PSK="fill this in with password"
COUNTRY="GB or US or your country"
```

## Installing the server code without user interface

- From the repo, upload `cosmic-paste.py` on your Pico.
- In Thonny, run the file on the Pico, and get the IP address from the console
- If it does not run, or you do not see the IP address, then setup `WIFI_CONFIG.py` or install required libraries and try again.
- Optionally copy `cosmic-paste.py` to `main.py` if you want it to start on boot

- Copy `cosmic-paste/config-unicorns.example.json` to `cosmic-paste/config-unicorns.json`
- Edit the file `cosmic-paste/config-unicorns.json` with your Unicorn IP address.
- Upload `cosmic-paste/config-unicorns.json` to your Pico in a `cosmic-paste/` folder.
- Upload `cosmic-paste/paint.html` on your Pico in a `cosmic-paste/` folder.

Load the user interface at `http://<your-pico-ip-address>/`

## Local Development

- `python -m SimpleHTTPServer 3070`

or

- `python -m http.server 3070`

Open `http://localhost:3070/paste.html` in the browser

[Back to top](https://github.com/chriscareycode/cosmic-unicorn/)
