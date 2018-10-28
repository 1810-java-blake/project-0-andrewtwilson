function euclidDistance(x1, y1, x2, y2) {
    // console.log(x1 + " " + y1 + " " + x2 + " " + y2 + " ")
    return (Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)));
}

function hexToRgb(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return [(c>>16)&255, (c>>8)&255, c&255].join(',');
    }
    throw new Error('Bad Hex');
}

function getSubstringIndex(str, substring, n) {
    var times = 0, index = null;

    while (times < n && index !== -1) {
        index = str.indexOf(substring, index+1);
        times++;
    }

    return index;
}

// declare the Ball class, with properties for the physics calculations
class Ball {
    constructor(name, xp, yp, radius, mass, magnitude, direction, red, green, blue) {
        this.name = name;
        this.xp = xp;
        this.yp = yp;
        this.radius = radius;
        this.mass = mass;
        this.vector = {
            magnitude,
            direction
        };
        this.color = {
            red,
            green,
            blue
        };
        this.vx = 0;
        this.vy = 0;
        this.newxv = 0;
        this.newxy = 0;
        this.hasCollided = false;
    }
}

// ballOpaque class is used to create temporary objects that hold the
// initialized values of a ball before it has been placed onto the canvas
// by the user.
class BallOpaque {
    constructor(name, radius, mass, red, green, blue) {
        this.name = name;
        this.radius = radius;
        this.mass = mass;
        this.color = {
            red,
            green,
            blue
        };
    }
}

// calcMagnitude() calculates the magnitude of the ball's movement
// vector from its x and y components
function calcMagnitude(balls) {
    balls.forEach(ball => {
        ball.vector.magnitude = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
    })
}

// splitVectorXY() requires a vector magnitude and direction,
// and splits this into its x and y components.
// Currently only used after ball initialization
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

document.addEventListener("DOMContentLoaded", () => {
    // Get the canvas that Processing-js will use
    let gameCanvas = document.getElementById("gameCanvas");
    let removeForm = document.getElementById("removeForm");
    let selectBall = document.getElementById("selectBall");
    selectBall.selectedIndex = -1;
    let addForm = document.getElementById("addForm");

    // Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
    let sketchProc = function (processing) {

        processing.mouseClicked = function() {
            if (ballOpaque !== null) {
                let insideAnotherBall = false;
                let insideWall = false;

                // If the x,y location of the mouse places it inside another ball,
                // change the boolean so to not place the ball.
                balls.forEach( ball => { 
                    if (euclidDistance(processing.mouseX, processing.mouseY, ball.xp, ball.yp) <= (ballOpaque.radius + ball.radius)) { 
                        insideAnotherBall = true; 
                        console.log(ballOpaque.radius + ball.radius);
                    }
                })

                // If the x,y of the mouse places it inside the wall,
                // change the boolean so to not place the ball.
                if (processing.mouseX <= ballOpaque.radius) { insideWall = true; }
                else if (processing.mouseX >= (400 - ballOpaque.radius)) { insideWall = true; }
                else if (processing.mouseY <= ballOpaque.radius) { insideWall = true; }
                else if (processing.mouseY >= (400 - ballOpaque.radius)) { insideWall = true; }
                
                // If the user requested location isn't inside the wall or another ball,
                // add it to the list of balls and create its corresponding
                // option in the select form.
                // Currently, you cannot create a ball with a movement vector. 10/27
                if (!insideAnotherBall && !insideWall) { 
                    balls.push(new Ball(ballOpaque.name, processing.mouseX, processing.mouseY, ballOpaque.radius, ballOpaque.mass, 
                        0, 0, ballOpaque.color.red, ballOpaque.color.green, ballOpaque.color.blue));
                    // console.log(balls[4]);
                    let newOption = document.createElement("option");
                    selectBall.appendChild(newOption);
                    //console.log(typeof name);
                    newOption.value = ballOpaque.name;
                    newOption.innerHTML = ballOpaque.name;

                    // Change the selected index of the select form to none
                    selectBall.selectedIndex = -1;

                    ballOpaque = null;
                }
            }
        };

        // update() function updates the balls position, moving
        // it every call of the Draw() function according to it's velocity,
        // then draws the ball again.
        function update(balls) {
            // If the ball is currently selected in the select element,
            // change its appearance.
            let editValue = null;
            if (selectBall.selectedIndex >= 0) {
                let editIndex = document.getElementById("selectBall").selectedIndex;
                editValue = document.getElementById("selectBall").options[editIndex].value;
            }

            balls.forEach((ball,index) => {
                ball.xp += ball.vx;
                ball.yp += ball.vy;
                ball.hasCollided = false;

                if (editValue === ball.name) { processing.stroke(255, 255, 128); processing.strokeWeight(2); }
                else { processing.stroke(0, 0, 0); processing.strokeWeight(1); }

                processing.fill(ball.color.red, ball.color.green, ball.color.blue);
                processing.ellipse(ball.xp, ball.yp, ball.radius * 2, ball.radius * 2);
            })
        }

        let balls = [];

        balls.push(new Ball("ball1", 50, 190, 25, 2, 0.1, 0, 255, 0, 0));
        balls.push(new Ball("ball2", 350, 200, 25, 10, 0.1, Math.PI, 100, 100, 100));
        balls.push(new Ball("ball3", 110, 200, 25, 3, 0, 0, 0, 0, 255));
        balls.push(new Ball("ball4", 110, 300, 15, 3, 0, 0, 0, 255, 0));

        let ballOpaque = null;

        // When the "removeForm" form is submitted, remove the selected item from the list
        // and its corresponding ball from the balls array.
        removeForm.addEventListener("submit", event => {
            // prevent the default "form submit" behavior
            // (sending data according to the "action" attr of the form)
            event.preventDefault();
    
            let removeIndex = document.getElementById("selectBall").selectedIndex;
            let removeValue = document.getElementById("selectBall").options[removeIndex].value;
    
            let indexToRemove = 0;
            balls.forEach((ball,index) => { if (removeValue === ball.name) { indexToRemove = index; } })

            document.getElementById("selectBall").remove(removeIndex);
            balls.splice(indexToRemove, 1);

            // Change the selected index of the select form to none
            selectBall.selectedIndex = -1;
        });

        // When the "addForm" form is submitted, create a new ball
        // using the parameters found in the form submission.
        addForm.addEventListener("submit", event => {
            // prevent the default "form submit" behavior
            // (sending data according to the "action" attr of the form)
            event.preventDefault();

            let name = document.getElementById("name").value;
            let radius = Number(document.getElementById("radius").value);
            let mass = Number(document.getElementById("mass").value);

            // Use hexToRgb() to get the rgb values of the selected color as a string
            // of the form 'red,green,blue'.
            let color = hexToRgb(document.getElementById("color").value);
            // console.log(color);

            // Separate the color string into its proper substrings for rbg values.
            let red = color.substr(0, color.indexOf(',')); 
            let green = color.substr(getSubstringIndex(color, ',', 1) + 1, getSubstringIndex(color, ',', 2) - (getSubstringIndex(color, ',', 1) + 1)); 
            let blue = color.substr(getSubstringIndex(color, ',', 2) + 1, getSubstringIndex(color, ',', 2)); 

            // console.log(getSubstringIndex(color, ',', 1) + "   " + getSubstringIndex(color, ',', 2))
            // console.log(color.substr(getSubstringIndex(color, ',', 1), getSubstringIndex(color, ',', 2)))
            // console.log(getSubstringIndex(color, ',', 2) + "   " + getSubstringIndex(color, ',', 2))
            // console.log(color.substr(getSubstringIndex(color, ',', 2), getSubstringIndex(color, ',', 2)))
            // console.log(`red: ${red}   green: ${green}    blue: ${blue}`);

            let nameExists = false;
            balls.forEach( ball => { if (ball.name === name) { nameExists = true; }})

            if (!nameExists) { ballOpaque = new BallOpaque(name, radius, mass, red, green, blue); }
            else { alert("Name already exists!") };
        });

        splitVectorXY(balls);

        processing.frameRate(400);
        processing.size(400, 400);
        processing.fill(0, 0, 0);

        processing.draw = function () {
            processing.background(199, 185, 185);
            // Update the balls' positions after the background is redrawn.
            update(balls);

            // If there is an opaque ball, that means the user has clicked to add a new ball.
            if (ballOpaque !== null) {
                // Create an opaque ball drawing on the canvas using the properties of ballOpaque
                processing.fill((ballOpaque.color.red, ballOpaque.color.green, ballOpaque.color.blue), 100);
                processing.stroke((0, 0, 0), 100); 
                processing.strokeWeight(1);
                processing.ellipse(processing.mouseX, processing.mouseY, ballOpaque.radius * 2, ballOpaque.radius * 2);
            }

            let distToEachBall = [];
            let angleBetweenEachBall = [];

            // Add another location for a distance/angle between the balls
            // for each ball that exists.
            balls.forEach(() => {
                distToEachBall.push([]);
                angleBetweenEachBall.push([]);
            })

            // Update the distance between each ball and the
            // angle between each ball.
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
                    if (distToEachBall[index][i] <= (ball.radius + balls[i].radius) && i !== index) {// && distToEachBall[index][i] >= (ball.radius + balls[i].radius)) {

                        ball.hasCollided = true;

                        ball.newvx = (ball.vector.magnitude * Math.cos(ball.vector.direction - angleBetweenEachBall[index][i]) * (ball.mass - balls[i].mass) + 2 * balls[i].mass * balls[i].vector.magnitude * Math.cos(balls[i].vector.direction - angleBetweenEachBall[index][i]))
                            / (ball.mass + balls[i].mass) * Math.cos(angleBetweenEachBall[index][i]) + ball.vector.magnitude * Math.sin(ball.vector.direction - angleBetweenEachBall[index][i]) * Math.sin(angleBetweenEachBall[index][i]);

                        ball.newvy = (ball.vector.magnitude * Math.cos(ball.vector.direction - angleBetweenEachBall[index][i]) * (ball.mass - balls[i].mass) + 2 * balls[i].mass * balls[i].vector.magnitude * Math.cos(balls[i].vector.direction - angleBetweenEachBall[index][i])) 
                            / (ball.mass + balls[i].mass) * Math.sin(angleBetweenEachBall[index][i]) + ball.vector.magnitude * Math.sin(ball.vector.direction - angleBetweenEachBall[index][i]) * Math.cos(angleBetweenEachBall[index][i]);
                    }
                }
            })

            // If the ball has collided, update its
            // velocity and position.
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