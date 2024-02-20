# doomguy.py
#
# Upload doomguy.jpg and doom-guy.py to your Pico with Thonny.
# Then run doomguy.py.
#
# Optionally copy doom-guy.py to main.py to run on startup

import time
from cosmic import CosmicUnicorn
from picographics import PicoGraphics, DISPLAY_COSMIC_UNICORN as DISPLAY
import jpegdec
import random

########################################################################
# edit this configuration
########################################################################
#
update_image_every_how_many_seconds = 5
#
########################################################################

# create cosmic object and graphics surface for drawing
cu = CosmicUnicorn()
graphics = PicoGraphics(DISPLAY)

width = CosmicUnicorn.WIDTH
height = CosmicUnicorn.HEIGHT

# clear the background
graphics.rectangle(0, 0, width, height)

# set the brightness
cu.set_brightness(0.6)

########################################################################
# open the jpeg file
########################################################################

print("trying to open doomguy.jpg file...")
jpeg = jpegdec.JPEG(graphics)
jpeg.open_file("doomguy.jpg")
print("opened doomguy.jpg file.")

########################################################################
# doom guy constants and variables
########################################################################

# configure moods that map to sprite numbers
happy_images = [1, 6, 11]
upset_images = [2, 3, 7, 8, 12, 16, 17]
angry_images = [4, 9, 13, 18, 19]
bloody_images = [5, 10, 14, 15, 20, 25, 26]

doomguys_mood = "happy"
doomguys_prev_mood = "happy"

########################################################################
# doom guy functions
########################################################################

def show_doomguy_by_mood(mood):
    my_random = 1
    if mood == "happy":
        my_random = random.choice(happy_images)
    elif mood == "upset":
        my_random = random.choice(upset_images)
    elif mood == "angry":
        my_random = random.choice(angry_images)
    elif mood == "bloody":
        my_random = random.choice(bloody_images)
    show_doomguy_by_number(my_random)
    print("show doom guy mood:", mood, my_random)

# takes a number from 1 to 27
def show_doomguy_by_number(num):
    if num < 1:
        print("out of bounds. changing to 1")
        num = 1;
    if num > 27:
        print("out of bounds. changing to 27")
        num = 27;
    y_offset = -1 * (num - 1) * 32;
    # write the jpeg to screen
    jpeg.decode(4, y_offset, jpegdec.JPEG_SCALE_HALF)
    # update the pixels
    cu.update(graphics)

########################################################################
# run a demo on start
########################################################################

print("program starting... Push A, B, C or D to change his mood")
print("demo some sprites...")

show_doomguy_by_number(random.choice(happy_images))
time.sleep(0.5)
show_doomguy_by_number(random.choice(upset_images))
time.sleep(0.5)
show_doomguy_by_number(random.choice(angry_images))
time.sleep(0.5)
show_doomguy_by_number(random.choice(bloody_images))
time.sleep(0.5)
show_doomguy_by_number(27)
time.sleep(1.5)
show_doomguy_by_number(random.choice(happy_images))

########################################################################
# timer function to run routines on an interval
########################################################################

def fast_timer_function(timer):
    global doomguys_mood
    show_doomguy_by_mood(doomguys_mood)


# timer to animate doom guy in the current mood
timer_fast = machine.Timer(-1)
timer_fast_period_ms = update_image_every_how_many_seconds * 1000
timer_fast.init(period=timer_fast_period_ms, mode=machine.Timer.PERIODIC, callback=fast_timer_function)

########################################################################
# Keep the program running
########################################################################

try:
    while True:
        # Handle the button press events
        if cu.is_pressed(CosmicUnicorn.SWITCH_BRIGHTNESS_UP):
            cu.adjust_brightness(+0.1)
            cu.update(graphics)
            print("adusted brightness up", cu.get_brightness())

        if cu.is_pressed(CosmicUnicorn.SWITCH_BRIGHTNESS_DOWN):
            cu.adjust_brightness(-0.1)
            cu.update(graphics)
            print("adusted brightness down", cu.get_brightness())

        if cu.is_pressed(CosmicUnicorn.SWITCH_A):
            doomguys_mood = "happy"
            print("setting mood to", doomguys_mood)
            show_doomguy_by_mood(doomguys_mood)

        if cu.is_pressed(CosmicUnicorn.SWITCH_B):
            doomguys_mood = "upset"
            print("setting mood to", doomguys_mood)
            show_doomguy_by_mood(doomguys_mood)

        if cu.is_pressed(CosmicUnicorn.SWITCH_C):
            doomguys_mood = "angry"
            print("setting mood to", doomguys_mood)
            show_doomguy_by_mood(doomguys_mood)

        if cu.is_pressed(CosmicUnicorn.SWITCH_D):
            doomguys_mood = "bloody"
            print("setting mood to", doomguys_mood)
            show_doomguy_by_mood(doomguys_mood)
        
        time.sleep(0.1)
        pass
except KeyboardInterrupt:
    # Cancel the timer and clean up before exiting
    timer_fast.deinit()
    print("timer_fast canceled")
