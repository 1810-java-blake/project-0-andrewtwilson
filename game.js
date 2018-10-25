document.addEventListener("DOMContentLoaded", () => {
    let collision = document.getElementById("collision");
    // Get the canvas that Processing-js will use
    let gameCanvas = document.getElementById("gameCanvas");
    // Pass the function sketchProc (defined in myCode.js) to Processing's constructor.

    let sketchProc = function (processing) {

        function pythag(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        }

        // keyword "with" puts "processing" object on top of the scope chain
        with (processing) {

            // declare the Ball class, with properties for the physics calculations
            class Ball {
                constructor(xp, yp, radius, mass, mag, dir) {
                    this.xp = xp;
                    this.yp = yp;
                    this.radius = radius;
                    this.mass = mass;
                    this.vector = {
                        magnitude: mag,
                        direction: dir
                    };
                    this.vx = 0;
                    this.vy = 0;
                    this.newxv = 0;
                    this.newxy = 0;
                }
                calcMagnitude() {
                    this.vector.magnitude = Math.sqrt(this.vx * this.vx + this.vy * this.vy)
                }
                // splitVectorXY requires a vector magnitude and direction,
                // and splits this into its x and y components.
                // Currently only used after initialization
                splitVectorXY() {
                    this.vx = this.vector.magnitude * Math.cos(this.vector.direction);
                    this.vy = this.vector.magnitude * Math.sin(this.vector.direction);
                }
                // calcAngle() calculates the angle that the ball is 
                // traveling given the vector's x and y components
                calcAngle() {
                    this.vector.direction = Math.atan2(this.vy, this.vx);
                }
                // update() function updates the balls position, moving
                // it every call of the Draw() function according to it's velocity,
                // then draws the ball again.
                update() {
                    this.xp += this.vx;
                    this.yp += this.vy;
                    ellipse(this.xp, this.yp, this.radius * 2, this.radius * 2);
                }
            }

            let balls = [];

            balls.push(new Ball(50, 190, 25, 25, 1, 0));
            balls.push(new Ball(350, 200, 25, 500, 1, Math.PI));

            balls.foreach( element => element.splitVectorXY );

            //let ball = new Ball(50, 190, 25, 25, 1, 0);
            //let ball2 = new Ball(350, 200, 25, 500, 1, Math.PI);

            // ball.splitVectorXY();
            // ball2.splitVectorXY();

            frameRate(30);
            size(400, 400);

            fill(0, 0, 0);

            draw = function () {
                background(199, 185, 185);
                // Update the balls' positions after the background is redrawn.
                fill(255, 0, 0);
                ball.update();
                fill(0, 0, 0);
                ball2.update();

                // Phi is the angle between the two balls
                let phi = Math.asin(Math.abs(ball2.yp - ball.yp) / (ball.radius + ball2.radius));
                let dotProduct = ball.vector.magnitude * ball2.vector.magnitude * cos(phi);

                // Check if the distance between the balls' centers is smaller
                // than their combined radii.
                if (pythag(ball.xp, ball.yp, ball2.xp, ball2.yp) <= (ball.radius + ball2.radius) && dotProduct >= 0) {
                    collision.innerHTML = "Yes";

                    // Calculate the new velocities of the balls using PHYSICS.
                    ball.newvx = (ball.vector.magnitude * Math.cos(ball.vector.direction - phi) * (ball.mass - ball2.mass) + 2 * ball2.mass * ball2.vector.magnitude * Math.cos(ball2.vector.direction - phi)) / (ball.mass + ball2.mass) * Math.cos(phi) + ball.vector.magnitude * Math.sin(ball.vector.direction - phi) * Math.sin(phi);
                    ball.newvy = (ball.vector.magnitude * Math.cos(ball.vector.direction - phi) * (ball.mass - ball2.mass) + 2 * ball2.mass * ball2.vector.magnitude * Math.cos(ball2.vector.direction - phi)) / (ball.mass + ball2.mass) * Math.sin(phi) + ball.vector.magnitude * Math.sin(ball.vector.direction - phi) * Math.cos(phi);
                    ball2.newvx = (ball2.vector.magnitude * Math.cos(ball2.vector.direction - phi) * (ball2.mass - ball.mass) + 2 * ball.mass * ball.vector.magnitude * Math.cos(ball.vector.direction - phi)) / (ball2.mass + ball.mass) * Math.cos(phi) + ball2.vector.magnitude * Math.sin(ball2.vector.direction - phi) * Math.sin(phi);
                    ball2.newvy = (ball2.vector.magnitude * Math.cos(ball2.vector.direction - phi) * (ball2.mass - ball.mass) + 2 * ball.mass * ball.vector.magnitude * Math.cos(ball.vector.direction - phi)) / (ball2.mass + ball.mass) * Math.sin(phi) + ball2.vector.magnitude * Math.sin(ball2.vector.direction - phi) * Math.cos(phi);

                    // Give each ball its new velocity.
                    ball.vx = ball.newvx;
                    ball.vy = ball.newvy;
                    ball2.vx = ball2.newvx;
                    ball2.vy = ball2.newvy;

                    ball.xp = ball.xp + ball.vx;
                    ball.yp = ball.yp + ball.vy;
                    ball2.xp = ball2.xp + ball2.vx;
                    ball2.yp = ball2.yp + ball2.vy;
                    ellipse(this.xp, this.yp, this.radius * 2, this.radius * 2);

                    //ball.calcAngle();
                    //ball2.calcAngle();
                };

                // Check if the balls are touching or inside the wall.
                // If inside the wall, move the ball just outside
                if (ball.xp <= ball.radius) {
                    ball.xp = ball.radius;
                    ball.vx *= -1;
                }
                else if (ball.xp >= (400 - ball.radius)) {
                    ball.xp = 400 - ball.radius;
                    ball.vx *= -1;
                }
                else if (ball.yp <= ball.radius) {
                    ball.yp = ball.radius;
                    ball.vy *= -1;
                }
                else if (ball.yp >= (400 - ball.radius)) {
                    ball.yp = 400 - ball.radius;
                    ball.vy *= -1;
                }
                if (ball2.xp <= ball2.radius) {
                    ball2.xp = ball2.radius;
                    ball2.vx *= -1;
                }
                else if (ball2.xp >= (400 - ball2.radius)) {
                    ball2.xp = 400 - ball2.radius;
                    ball2.vx *= -1;
                }
                else if (ball2.yp <= ball2.radius) {
                    ball2.yp = ball2.radius;
                    ball2.vy *= -1;
                }
                else if (ball2.yp >= (400 - ball2.radius)) {
                    ball2.yp = 400 - ball2.radius;
                    ball2.vy *= -1;
                }
                // // Check if the balls are touching/inside each other
                // if (pythag(ball.xp, ball.yp, ball2.xp, ball2.yp) <= (ball.radius + ball2.radius)) {

                // }
                ball.calcMagnitude();
                ball2.calcMagnitude();
                ball.calcAngle();
                ball2.calcAngle();
            }
        }
    };

    let processingInstance = new Processing(gameCanvas, sketchProc);
})