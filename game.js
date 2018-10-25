document.addEventListener("DOMContentLoaded", () => {
    let collision = document.getElementById("collision");
    // Get the canvas that Processing-js will use
    let gameCanvas = document.getElementById("gameCanvas");
    // Pass the function sketchProc (defined in myCode.js) to Processing's constructor.

    let sketchProc = function(processing) {
        // with (processing) {
        //     size(400, 400);
        //     frameRate(30);

        //     // ProgramCodeGoesHere
        //     fill(0, 0, 0);
        //     ellipse(200, 200, 20, 20);
        // }

        function pythag(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
        }

        with (processing) {
            let Ball = {
                xp: 50,
                yp: 190,
                vx: 0,
                vy: 0,
                radius: 25,
                newvx: 0,
                newvy: 0,
                mass: 25,
                vecMag: 1,
                vecDir: 0,
                splitVec: function() {
                    this.vx = this.vecMag*Math.cos(this.vecDir);
                    this.vy = this.vecMag*Math.sin(this.vecDir);
                },
                calcAngle: function() {
                    this.vecDir = Math.atan2(this.vx, this.vy);
                },
                update: function() {
                    this.xp += this.vx;
                    this.yp += this.vy;
                    ellipse(this.xp, this.yp, this.radius * 2, this.radius * 2);
                }
            }

            let Ball2 = {
                xp: 350,
                yp: 200,
                vx: 0,
                vy: 0,
                radius: 25,
                newvx: 0,
                newvy: 0,
                mass: 200,
                vecMag: 0.5,
                vecDir: Math.PI,
                splitVec: function() {
                    this.vx = this.vecMag*Math.cos(this.vecDir);
                    this.vy = this.vecMag*Math.sin(this.vecDir);
                },
                calcAngle: function() {
                    this.vecDir = Math.atan2(this.vx, this.vy);
                },
                update: function() {
                    this.xp += this.vx;
                    this.yp += this.vy;
                    ellipse(this.xp, this.yp, this.radius * 2, this.radius * 2);
                }
            }

            Ball.splitVec();
            Ball2.splitVec();

            size(400, 400);

            fill(0, 0, 0);

            draw = function() {
                background(199, 185, 185);
                Ball.update();
                Ball2.update();
                if (pythag(Ball.xp, Ball.yp, Ball2.xp, Ball2.yp) <= (Ball.radius + Ball2.radius)) {
                    collision.innerHTML = "YES";

                    let phi = Math.asin(Math.abs(Ball2.yp-Ball.yp) / (Ball.radius + Ball2.radius));

                    Ball.newvx = (Ball.vecMag*Math.cos(Ball.vecDir-phi)*(Ball.mass-Ball2.mass)+2*Ball2.mass*Ball2.vecMag*Math.cos(Ball2.vecDir-phi))/(Ball.mass+Ball2.mass) * Math.cos(phi) + Ball.vecMag*Math.sin(Ball.vecDir-phi)*Math.sin(phi);
                    Ball.newvy = (Ball.vecMag*Math.cos(Ball.vecDir-phi)*(Ball.mass-Ball2.mass)+2*Ball2.mass*Ball2.vecMag*Math.cos(Ball2.vecDir-phi))/(Ball.mass+Ball2.mass) * Math.sin(phi) + Ball.vecMag*Math.sin(Ball.vecDir-phi)*Math.cos(phi);
                    Ball2.newvx = (Ball2.vecMag*Math.cos(Ball2.vecDir-phi)*(Ball2.mass-Ball.mass)+2*Ball.mass*Ball.vecMag*Math.cos(Ball.vecDir-phi))/(Ball2.mass+Ball2.mass) * Math.cos(phi) + Ball2.vecMag*Math.sin(Ball2.vecDir-phi)*Math.sin(phi);                    
                    Ball2.newvy = (Ball2.vecMag*Math.cos(Ball2.vecDir-phi)*(Ball2.mass-Ball.mass)+2*Ball.mass*Ball.vecMag*Math.cos(Ball.vecDir-phi))/(Ball2.mass+Ball2.mass) * Math.sin(phi) + Ball2.vecMag*Math.sin(Ball2.vecDir-phi)*Math.cos(phi);

                    Ball.vx = Ball.newvx;
                    Ball.vy = Ball.newvy;
                    Ball2.vx = Ball2.newvx;
                    Ball2.vy = Ball2.newvy;

                    Ball.calcAngle();
                    Ball2.calcAngle();
                }
            }
        }
    };

    let processingInstance = new Processing(gameCanvas, sketchProc);
})