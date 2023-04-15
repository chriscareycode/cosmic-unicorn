import os
from microdot_asyncio import Microdot, Request, Response, send_file
from phew import connect_to_wifi
from cosmic import CosmicUnicorn
from picographics import PicoGraphics, DISPLAY_COSMIC_UNICORN as DISPLAY
from WIFI_CONFIG import SSID, PSK

cu = CosmicUnicorn()
graphics = PicoGraphics(DISPLAY)
mv_graphics = memoryview(graphics)
cu.set_brightness(0.5)

WIDTH, HEIGHT = graphics.get_bounds()

ip = connect_to_wifi(SSID, PSK)

print(f"Start painting at: http://{ip}")

last_pixels = ""

server = Microdot()

@server.route("/", methods=["GET"])
def route_index(request):
    return send_file("emoji_paint/index.html")

@server.route("/config-unicorns.json", methods=["GET"])
def route_index(request):
    return send_file("emoji_paint/config-unicorns.json")

@server.route("/static/<path:path>", methods=["GET"])
def route_static(request, path):
    return send_file(f"emoji_paint/static/{path}")

@server.route('/get_pixels', methods=["GET"])
def route_get_pixels(req):
    global last_pixels
    #print("get_pixels")
        
    res = Response()
    res.headers["Access-Control-Allow-Origin"] = '*'
    res.body = last_pixels
    return res
    

@server.post('/set_pixels')
def set_pixels(req):
    global last_pixels
    #print("got data")

    data = req.body
    
    # save for later
    last_pixels = data
        
    arr = list(data)
    
    for j in range(HEIGHT):
        for i in range(WIDTH):
            index = (j * 32 + i) * 4
                        
            #convert rgba to rgb
            r = int(data[index])
            g = int(data[index+1])
            b = int(data[index+2])
            a = int(data[index+3]) / 255
            
            r = round(a * r)
            g = round(a * g)
            b = round(a * b)
            
            # set the pixel
            graphics.set_pen(graphics.create_pen(r, g, b))
            graphics.pixel(i, j)
    cu.update(graphics)
                
    res = Response()
    res.headers["Access-Control-Allow-Origin"] = '*'
    res.body = "success"
    return res

# start the web server on all ips, port 80
server.run(host="0.0.0.0", port=80)
