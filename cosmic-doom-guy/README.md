# cosmic-doom-guy

Doom Guy, on your Pimoroni Cosmic Unicorn
https://shop.pimoroni.com/products/cosmic-unicorn

Press the A, B, C, or D buttons to change Doom Guy's mood:
- A: Happy
- B: Upset
- C: Angry
- D: Bloody

The routine will rotate through images representing each mood every 10 seconds.
This value can be configured at the top of the MicroPython file.

This script is not particularly interesting on its own, but can be used as a foundation to build upon to make Doom Guy react to things. I am currently working on another variation of this script that will react to the status of my Nagios server where the more services are in WARNING or CRITICAL state, Doom Guy gets more angry.

![Doom Guy Image](doom-guy-photo-400.jpg "Doom Guy")

As with all these unicorn photos, the colors are much more vibrant in-person. These photos do not do it justice.

#

## Upload the files to your pico

- Create the folder "doom-guy" to hold the image file
- Upload doom-guy.jpg to the "doom-guy" folder.
- Upload doom.guy.py to the root of your pico.

"doom-guy-photo-400.jpg" is not needed for this script to run. This file is a screenshot for the README.

## Run the file

- Run doom-guy.py with Thonny

## Optionally make this script run when the Pico boots up

If you want this script to run on boot, then you need to copy the contents of `doom-guy.py` into `main.py`. main.py is the file that starts on boot.

#

Also check out the doom-flynn-css project: https://github.com/chriscareycode/doom-flynn-css

Thanks to Pimoroni for creating these awesome boards!

2024 Chris Carey