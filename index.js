var screenshot = require('desktop-screenshot');
var fs = require("fs"),
    PNG = require("pngjs").PNG;


let iterations = 0;

const robot = require("robotjs");
const {
    SSL_OP_SSLEAY_080_CLIENT_DH_BUG
} = require('constants');

var screenSize = robot.getScreenSize();

function Image() {
    screenshot("screenshot.png", {
        screen: 'desktop',
        fast: true,
        quality: 1,
        width: 400
    }, function (error, complete) {
        if (error) {
            console.log("Screenshot failed", error);
        } else {

            console.log("Screenshot succeeded");


            fs.createReadStream('screenshot.png')
                .pipe(
                    new PNG({
                        filterType: 4,
                    })
                )
                .on("parsed", function () {
                    let iterations2 = 0
                    let clickedx = [0]
                    let clickedy = [0]
                    for (var y = 0; y < this.height; y++) {
                        for (var x = 0; x < this.width; x++) {
                            var idx = (this.width * y + x) << 2;
                            // invert color
                            //color 255,219,195
                            if (this.data[idx] == 255 && this.data[idx + 1] == 219 && this.data[idx + 2] == 195) {
                                let included = false
                                for (i = 0; i < clickedx.length; i++) {
                                    if (((clickedx[i] - 5 < x && clickedx[i] + 5 > x) || (clickedy[i] - 5 < y && clickedy[i] + 5 > y))) {
                                        included = true
                                    }
                                }
                                if(included == false){
                                    clickedx.push(x)
                                    clickedy.push(y)
                                    if (iterations2 > 10) {
                                        iterations = 10
                                        return process.exit(22);
                                    }
                                    iterations2++
                                    //console.log(screenSize)
                                    let newx = (Math.random() * 30 +(((x / 400) * 1366) - 30)) + 20
                                    let newy = (Math.random() * 30 +(((y / 224) * 768) - 30)) + 20
                                    console.log(`Location x:${newx} and y:${newy}`)
                                    robot.moveMouse(newx, newy)
                                    robot.mouseClick()
                                }
                            }
                        }
                    }
                    if (iterations < 45) {
                        console.log(iterations)
                        Image()
                        //setTimeout(Image, 10)
                        iterations++
                    }

                });
        }
    });
}
Image()