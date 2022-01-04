'use strict';
var screenshot = require('desktop-screenshot');


let Jimp = require('jimp')
let iterations = 0;

const ioHook = require('iohook');

let clicks = 0
ioHook.start();

const robot = require("robotjs");
const {
    SSL_OP_SSLEAY_080_CLIENT_DH_BUG
} = require('constants');

var screenSize = robot.getScreenSize();

function Image() {
    screenshot("screenshot.png", {
        screen: 'desktop',
        fast: true,
        width: 400
    }, function (error, complete) {
        if (error) {
            console.log("Screenshot failed", error);
        } else {
            let iterations2 = 0
            let clickedx = [0]
            let clickedy = [0]
            Jimp.read('screenshot.png')
                .then(image => {
                    image.crop(104, 30, 186, 181)
                    //image.write('output.png')
                    //console.log(image.bitmap)
                    for (var y = 0; y < image.bitmap.height; y++) {
                        for (var x = 0; x < image.bitmap.width; x++) {
                            var idx = (image.bitmap.width * y + x) << 2;
                            if (image.bitmap.data[idx] == 255 && image.bitmap.data[idx + 1] == 219 && image.bitmap.data[idx + 2] == 195) {
                                //console.log(image.bitmap.data[idx] +" "+image.bitmap.data[idx + 1]+" "+image.bitmap.data[idx + 2])
                                let included = false
                                for (let i = 0; i < clickedx.length; i++) {
                                    if (((clickedx[i] - 5 < x && clickedx[i] + 5 > x) || (clickedy[i] - 5 < y && clickedy[i] + 5 > y))) {
                                        included = true
                                    }
                                }
                                if (included == false) {
                                    clickedx.push(x)
                                    clickedy.push(y)
                                    if (iterations2 > 10) {
                                        iterations = 10
                                        return process.exit(22);
                                    }
                                    iterations2++
                                    //console.log(screenSize)
                                    //console.log(image.bitmap.width)
                                    /*
                                    let newx = (x / 186) * 3.416 + 355
                                    let newy = (y / 181) * 3.42857143 + 103
                                    */
                                    let newx = (x ) * 3.416 + 355
                                    let newy = (y ) * 3.42857143 + 103
                                    //let newx = (Math.random() * 30 + (((x / 400) * 1366) - 30)) + 20
                                    //let newy = (Math.random() * 30 + (((y / 224) * 768) - 30)) + 20
                                    //console.log(`Location x:${newx} and y:${newy}`)
                                    clicks++
                                    robot.moveMouse(newx, newy)
                                    robot.mouseClick()
                                }
                
                            }
                        }
                    }
                    if (iterations > -1) {
                        //console.log("times run:" + iterations)
                        Image()
                        //setTimeout(Image, 10)
                        iterations++
                    }
                })
                /*

            fs.createReadStream('screenshot.png')
                .pipe(
                    new PNG({
                        filterType: 4,
                    })
                )
                //355 103
                .on("parsed", function () {


                    //this.crop(355,103,639,594)
                    for (var y = 0; y < this.height; y++) {
                        for (var x = 0; x < this.width; x++) {
                            var idx = (this.width * y + x) << 2;
                            if (this.data[idx] == 255 && this.data[idx + 1] == 219 && this.data[idx + 2] == 195) {
                                let included = false
                                for (let i = 0; i < clickedx.length; i++) {
                                    if (((clickedx[i] - 5 < x && clickedx[i] + 5 > x) || (clickedy[i] - 5 < y && clickedy[i] + 5 > y))) {
                                        included = true
                                    }
                                }
                                if (included == false) {
                                    clickedx.push(x)
                                    clickedy.push(y)
                                    if (iterations2 > 10) {
                                        iterations = 10
                                        return process.exit(22);
                                    }
                                    iterations2++
                                    //console.log(screenSize)
                                    let newx = (x / 400) * 1366
                                    let newy = (y / 224) * 768
                                    //let newx = (Math.random() * 30 + (((x / 400) * 1366) - 30)) + 20
                                    //let newy = (Math.random() * 30 + (((y / 224) * 768) - 30)) + 20
                                    //console.log(`Location x:${newx} and y:${newy}`)
                                    clicks++
                                    //robot.moveMouse(newx, newy)
                                    //robot.mouseClick()
                                }
                            }
                        }
                    }
                    if (iterations > -1) {
                        //console.log("times run:" + iterations)
                        Image()
                        //setTimeout(Image, 10)
                        iterations++
                    }

                }); */
        }
       
    });
}
Image()

ioHook.on("keydown", event => {
    if (event.altKey && event.keycode == 65) {
        iterations = -1
        console.log("Program Halted.")
    }
    if (event.altKey && event.keycode == 66) {
        iterations = 1
        console.log("Program continued.")
        Image()
    }
});

setInterval(function () {
    console.log("Main FUnction: " + iterations / 5)
    console.log("Clicks per second: " + clicks / 5)
    iterations = 0
    clicks = 0
}, 5000)