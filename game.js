let sketchProc = function (processing) {
    // with (processing) {
    //     size(400, 400);
    //     frameRate(30);

    //     // ProgramCodeGoesHere
    //     fill(0, 0, 0);
    //     ellipse(200, 200, 20, 20);
    // }
    with (processing) {
        let Ball = {
            xp : 50,
            yp : 190,
            xv : 0.5,
            yv : 0,
            update : function() {
                this.xp += this.xv;
                this.yp += this.yv;
                ellipse(this.xp, this.yp, 50, 50);
            }
        }        
        
        let Ball2 = {
            xp : 350,
            yp : 210,
            xv : -.5,
            yv : 0,
            update : function() {
                this.xp += this.xv;
                this.yp += this.yv;
                ellipse(this.xp, this.yp, 50, 50);
            }
        }

        size(400, 400);

        fill(0, 0, 0);

        draw = function () {
            background(199, 185, 185);
            Ball.update();
            Ball2.update();
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // Get the canvas that Processing-js will use
    let gameCanvas = document.getElementById("gameCanvas");
    // Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
    let processingInstance = new Processing(gameCanvas, sketchProc);
})