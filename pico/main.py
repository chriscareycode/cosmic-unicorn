import os
from microdot_asyncio import Microdot, Request, Response, send_file
from microdot_asyncio_websocket import with_websocket
#from microdot_cors import CORS
from phew import connect_to_wifi
from cosmic import CosmicUnicorn
from picographics import PicoGraphics, DISPLAY_COSMIC_UNICORN as DISPLAY
from WIFI_CONFIG import SSID, PSK
import json

cu = CosmicUnicorn()
graphics = PicoGraphics(DISPLAY)
mv_graphics = memoryview(graphics)
cu.set_brightness(0.5)

WIDTH, HEIGHT = graphics.get_bounds()

ip = connect_to_wifi(SSID, PSK)

print(f"Start painting at: http://{ip}")

server = Microdot()

Request.max_content_length = 1024 * 1024
Request.max_body_length = 32 * 1024

#cors = CORS(server, allowed_origins=['*'],
#            allow_credentials=True)

@server.route("/", methods=["GET"])
def route_index(request):
    return send_file("cosmic_paint/index.html")


@server.route("/static/<path:path>", methods=["GET"])
def route_static(request, path):
    return send_file(f"emoji_paint/static/{path}")

@server.route('/emoji', methods=["OPTIONS"])
def send_options(req):
    res = Response()
    res.headers["Access-Control-Allow-Origin"] = '*'
    res.headers["Access-Control-Allow-Methods"] = '*'
    res.headers["Access-Control-Allow-Headers"] = '*'
    res.headers["Access-Control-Allow-Credentials"] = 'true'
    res.headers["Access-Control-Max-Age"] = '86400'
    return res


@server.post('/emoji')
def send_emoji(req):
    #if req.method == 'OPTIONS':
    #    res = Response(res)
    #    res.headers["Access-Control-Allow-Origin"] = '*'
    #    res.headers["Access-Control-Allow-Methods"] = '*'
    #    res.headers["Access-Control-Allow-Headers"] = '*'
    #    res.headers["Access-Control-Allow-Credentials"] = 'true'
    #    res.headers["Access-Control-Max-Age"] = '86400'
    #    return res
    
    
    #req.max_content_length = 1024 * 1024
    #req.max_body_length = 32 * 1024
    print("got data")

    #payload = req.json
    data = req.body
    
    # do something with payload
    #print(data)
    
    arr = list(data)
    #print(arr)
    
        
    for j in range(HEIGHT):
        for i in range(WIDTH):
            index = (j * 32 + i) * 4
            #print("index is " + str(index))
            #print(str(i) + "," + str(j) + "," + str(data[index]) + "," + str(data[index+1]) + "," + str(data[index+2]))
            # graphics.set_pen(graphics.create_pen(data[index], data[index+1], data[index+2]))
            
            #convert rgba to rgb
            r = int(data[index])
            g = int(data[index+1])
            b = int(data[index+2])
            a = int(data[index+3]) / 255
            
            #r = ((1 - a) * r) + (a * r)
            #g = ((1 - a) * g) + (a * g)
            #b = ((1 - a) * b) + (a * b)
            r = round(a * r)
            g = round(a * g)
            b = round(a * b)
            
            # set the pixel
            graphics.set_pen(graphics.create_pen(r, g, b))
            # graphics.set_pen(graphics.create_pen(int(data[index]), int(data[index+1]), int(data[index+2])))
            graphics.pixel(i, j)
    cu.update(graphics)
                
    #return "success"
    
    #return {'success': True}
    res = Response()
    #res = Response(body={'success': True})
    res.headers["Access-Control-Allow-Origin"] = '*'
    #res.headers["Content-Type"] = 'application/json'
    #res.body = {'success': True}
    res.body = "success"
    return res
    #return {'success2': True}

@server.route('/paint')
@with_websocket
async def echo(request, ws):
    # https://microdot.readthedocs.io/en/latest/api.html#module-microdot_asyncio_websocket
    #request.max_content_length = 512000
    #request.max_body_length = 512000
    #request.max_readline = 10000
    #request.socket_read_timeout = 1
    while True:
        data = await ws.receive()
        try:
            if data == "imagedata":
                data = await ws.receive()
                #print(len(data))
                #print(data)
                #data = json.loads(data)
                arr = list(data)
                #print(arr)
                
                    
                for j in range(HEIGHT):
                    for i in range(WIDTH):
                        index = (j * 32 + i) * 4
                        #print("index is " + str(index))
                        #print(str(i) + "," + str(j) + "," + str(data[index]) + "," + str(data[index+1]) + "," + str(data[index+2]))
                        # graphics.set_pen(graphics.create_pen(data[index], data[index+1], data[index+2]))
                        
                        #convert rgba to rgb
                        r = int(data[index])
                        g = int(data[index+1])
                        b = int(data[index+2])
                        a = int(data[index+3]) / 255
                        
                        #r = ((1 - a) * r) + (a * r)
                        #g = ((1 - a) * g) + (a * g)
                        #b = ((1 - a) * b) + (a * b)
                        r = round(a * r)
                        g = round(a * g)
                        b = round(a * b)
                        
                        # set the pixel
                        graphics.set_pen(graphics.create_pen(r, g, b))
                        # graphics.set_pen(graphics.create_pen(int(data[index]), int(data[index+1]), int(data[index+2])))
                        graphics.pixel(i, j)
                cu.update(graphics)

        except ValueError as e:
            print("ValueError exception", str(e))
        except Exception as e:
            print("Error exception:", str(e))

@server.errorhandler(404)
def not_found(request):
    return {'error': 'resource not found'}, 404

server.run(host="0.0.0.0", port=80)



