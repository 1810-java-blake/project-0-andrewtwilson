document.addEventListener("DOMContentLoaded", () => {
    let collision = document.getElementById("collision");
    // Get the canvas that Processing-js will use
    let gameCanvas = document.getElementById("gameCanvas");
    // Pass the function sketchProc (defined in myCode.js) to Processing's constructor.

    let sketchProc = function (processing) {

        function euclidDistance(x1, y1, x2, y2) {
            // console.log(x1 + " " + y1 + " " + x2 + " " + y2 + " ")
            return (Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)));
        }

        // declare the Ball class, with properties for the physics calculations
        class Ball {
            constructor(xp, yp, radius, mass, mag, dir, r, g, b) {
                this.xp = xp;
                this.yp = yp;
                this.radius = radius;
                this.mass = mass;
                this.vector = {
                    magnitude: mag,
                    direction: dir
                };
                this.color = {
                    red: r,
                    green: g,
                    blue: b
                };
                this.vx = 0;
                this.vy = 0;
                this.newxv = 0;
                this.newxy = 0;
                this.hasCollided = false;
            }
        }
        function calcMagnitude(balls) {
            balls.forEach(ball => {
                ball.vector.magnitude = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
            })
        }
        // splitVectorXY requires a vector magnitude and direction,
        // and splits this into its x and y components.
        // Currently only used after initialization
        function splitVectorXY(balls) {
            balls.forEach(ball => {
                ball.vx = ball.vector.magnitude * Math.cos(ball.vector.direction);
                ball.vy = ball.vector.magnitude * Math.sin(ball.vector.direction);            
            })
        }
        // calcAngle() calculates the angle that the ball is 
        // traveling given the vector's x and y components
        function calcAngle(balls) {
            balls.forEach(ball => {
                let temp = Math.atan2(ball.vy, ball.vx);
                if (temp <= 0) {
                    temp += 2*Math.PI;
                }
                // console.log(temp);
                ball.vector.direction = temp;
            })
        }
        // update() function updates the balls position, moving
        // it every call of the Draw() function according to it's velocity,
        // then draws the ball again.
        function update(balls) {
            balls.forEach(ball => {
                ball.xp += ball.vx;
                ball.yp += ball.vy;
                ball.hasCollided = false;
                processing.fill(ball.color.red, ball.color.green, ball.color.blue);
                processing.ellipse(ball.xp, ball.yp, ball.radius * 2, ball.radius * 2);
            })
        }

        let balls = [];

        balls.push(new Ball(50, 190, 25, 2, 0.1, 0, 255, 0, 0));
        balls.push(new Ball(350, 200, 25, 10, 0.1, Math.PI, 1, 1, 1,));
        balls.push(new Ball(110, 200, 25, 3, 0, 0, 0, 0, 255));
        balls.push(new Ball(110, 300, 15, 3, 0, 0, 0, 255, 0));

        splitVectorXY(balls);

        processing.frameRate(400);
        processing.size(400, 400);
        processing.fill(0, 0, 0);

        processing.draw = function () {
            processing.background(199, 185, 185);
            // Update the balls' positions after the background is redrawn.
            update(balls);
            let distToEachBall = [];
            let angleBetweenEachBall = [];

            balls.forEach(() => {
                distToEachBall.push([]);
                angleBetweenEachBall.push([]);
            })

            balls.forEach((ball, index) => {
                for (i = 0; i < balls.length; i++) {
                    if (i !== index) {
                        distToEachBall[index][i] = euclidDistance(ball.xp, ball.yp, balls[i].xp, balls[i].yp);
                        angleBetweenEachBall[index][i] = Math.atan2((ball.yp - balls[i].yp), (ball.xp - balls[i].xp));
                    }
                }
            })

            // Check if the distance between the balls' centers is smaller
            // than their combined radii.
            balls.forEach((ball, index) => {
                for (i = 0; i < balls.length; i++) {
                    if (distToEachBall[index][i] <= (ball.radius + balls[i].radius + 1) && i !== index) {
                        collision.innerHTML = "YES";

                        ball.hasCollided = true;

                        ball.newvx = (ball.vector.magnitude * Math.cos(ball.vector.direction - angleBetweenEachBall[index][i]) * (ball.mass - balls[i].mass) + 2 * balls[i].mass * balls[i].vector.magnitude * Math.cos(balls[i].vector.direction - angleBetweenEachBall[index][i]))
                            / (ball.mass + balls[i].mass) * Math.cos(angleBetweenEachBall[index][i]) + ball.vector.magnitude * Math.sin(ball.vector.direction - angleBetweenEachBall[index][i]) * Math.sin(angleBetweenEachBall[index][i]);

                        ball.newvy = (ball.vector.magnitude * Math.cos(ball.vector.direction - angleBetweenEachBall[index][i]) * (ball.mass - balls[i].mass) + 2 * balls[i].mass * balls[i].vector.magnitude * Math.cos(balls[i].vector.direction - angleBetweenEachBall[index][i])) 
                            / (ball.mass + balls[i].mass) * Math.sin(angleBetweenEachBall[index][i]) + ball.vector.magnitude * Math.sin(ball.vector.direction - angleBetweenEachBall[index][i]) * Math.cos(angleBetweenEachBall[index][i]);
                    }
                }
            })
            balls.forEach(ball => {
                if (ball.hasCollided === true) {
                    ball.vx = ball.newvx;
                    ball.vy = ball.newvy;

                    ball.xp = ball.xp + ball.vx;
                    ball.yp = ball.yp + ball.vy;
                }
            })

            // Check if the balls are touching or inside the wall.
            // If inside the wall, move the ball just outside
            balls.forEach(ball => {
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
            })

            calcMagnitude(balls);
            calcAngle(balls);
        }
    };

    let processingInstance = new Processing(gameCanvas, sketchProc);
})