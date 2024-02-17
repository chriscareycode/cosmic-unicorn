# doom-guy.py
#
# create a folder on your cosmic unicorn doom-guy/ and upload the doom-guy.jpg image inside there!
# Then run doom-guy.py.
#
# Optionally copy doom-guy.py to main.py to run on startup

import time
from cosmic import CosmicUnicorn
from picographics import PicoGraphics, DISPLAY_COSMIC_UNICORN as DISPLAY
import jpegdec
import random

########################################################################
#
update_image_every_how_many_seconds = 10
#
########################################################################

# create cosmic object and graphics surface for drawing
cu = CosmicUnicorn()
graphics = PicoGraphics(DISPLAY)

width = CosmicUnicorn.WIDTH
height = CosmicUnicorn.HEIGHT

# clear the background
graphics.rectangle(0, 0, width, height)

# set up some pens to use later
WHITE = graphics.create_pen(255, 255, 255)
BLACK = graphics.create_pen(0, 0, 0)

# set the font
graphics.set_font("bitmap8")

# set the brightness
cu.set_brightness(0.6)


print("trying to open doom-guy/doom-guy.jpg file.")

jpeg = jpegdec.JPEG(graphics)
jpeg.open_file("doom-guy/doom-guy.jpg")

print("opened doom-guy/doom-guy.jpg file.")



happy_images = [1, 6, 11]
upset_images = [2, 3, 7, 8, 12, 16, 17, 18]
angry_images = [4, 9, 13, 19]
bloody_images = [5, 10, 14, 15, 20, 25, 26]

doom_guys_mood = "happy"
doom_guys_prev_mood = "happy"


def show_doom_guy_mood(mood):
    my_random = 1
    if mood == "happy":
        my_random = random.choice(happy_images)
    elif mood == "upset":
        my_random = random.choice(upset_images)
    elif mood == "angry":
        my_random = random.choice(angry_images)
    elif mood == "bloody":
        my_random = random.choice(bloody_images)
    show_doom_guy(my_random)
    print("show doom guy mood:", mood, my_random)

# takes a number from 1 to 27
def show_doom_guy(num):
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

print("demo some sprites")

show_doom_guy(random.choice(happy_images))
time.sleep(0.5)
show_doom_guy(random.choice(upset_images))
time.sleep(0.5)
show_doom_guy(random.choice(angry_images))
time.sleep(0.5)
show_doom_guy(random.choice(bloody_images))
time.sleep(0.5)
show_doom_guy(random.choice(happy_images))

print("program starting...")


    
def fast_timer_function(timer):
    global doom_guys_mood
    show_doom_guy_mood(doom_guys_mood)


# timer to animate doom guy in the current mood
timer_fast = machine.Timer(-1)
timer_fast_period_ms = update_image_every_how_many_seconds * 1000
timer_fast.init(period=timer_fast_period_ms, mode=machine.Timer.PERIODIC, callback=fast_timer_function)

# Keep the program running
try:
    while True:
        
        if cu.is_pressed(CosmicUnicorn.SWITCH_BRIGHTNESS_UP):
            cu.adjust_brightness(+0.1)
            cu.update(graphics)
            print("adusted brightness up", cu.get_brightness())

        if cu.is_pressed(CosmicUnicorn.SWITCH_BRIGHTNESS_DOWN):
            cu.adjust_brightness(-0.1)
            cu.update(graphics)
            print("adusted brightness down", cu.get_brightness())

        if cu.is_pressed(CosmicUnicorn.SWITCH_A):
            doom_guys_mood = "happy"
            print("setting mood to", doom_guys_mood)
            show_doom_guy_mood(doom_guys_mood)

        if cu.is_pressed(CosmicUnicorn.SWITCH_B):
            doom_guys_mood = "upset"
            print("setting mood to", doom_guys_mood)
            show_doom_guy_mood(doom_guys_mood)

        if cu.is_pressed(CosmicUnicorn.SWITCH_C):
            doom_guys_mood = "angry"
            print("setting mood to", doom_guys_mood)
            show_doom_guy_mood(doom_guys_mood)

        if cu.is_pressed(CosmicUnicorn.SWITCH_D):
            doom_guys_mood = "bloody"
            print("setting mood to", doom_guys_mood)
            show_doom_guy_mood(doom_guys_mood)
        
        time.sleep(0.1)
        pass
except KeyboardInterrupt:
    # Cancel the timer and clean up before exiting
    timer_fast.deinit()
    print("timer_fast canceled")
