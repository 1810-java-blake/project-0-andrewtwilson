let sketchProc = function (processing) {
    with (processing) {
        size(400, 400);
        frameRate(30);

        // ProgramCodeGoesHere
        fill(0, 0, 0);
        ellipse(200, 200, 20, 20);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // Get the canvas that Processing-js will use
    let gameCanvas = document.getElementById("gameCanvas");
    // Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
    let processingInstance = new Processing(gameCanvas, sketchProc);
})