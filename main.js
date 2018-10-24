document.addEventListener("DOMContentLoaded", () => {
    let video = document.getElementById("video");
    let canvas = document.getElementById("canvas");
    let pictureBtn = document.getElementById("pictureBtn");
    let emotionBtn = document.getElementById("emotionBtn");
    let gamePageBtn = document.getElementById("gamePageBtn");

    // Look for media devices that have video capabilities and
    // add the stream to the video element if it is found.
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
    })
        .then(stream => {
            console.log(`The requested device was found: ${stream}`)
            video.srcObject = stream;
            video.play();
        })
        .catch(err => {
            console.log(`The error is: ${err}`);
        });

    // On clicking the pictureBtn, draw the image from the stream
    // to the canvas.
    pictureBtn.addEventListener("click", event => {
        var ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0);
    })

    // Attempt at fetching from the Azure face api
    emotionBtn.addEventListener("click", event => {
        fetch("https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect",{
            method:'POST',
            headers: {'Ocp-Apim-Subscription-Key': 'a5d4b501a2d04f2d946a0a2dc164c176'},
            body: JSON.stringify({'url': 'https://drive.google.com/open?id=10a6iQzika7-GJBF2hEmw2sXigs1iRGPg'})
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
        })
        .catch(err => console.log(err));
    })

    gamePageBtn.addEventListener("click", event => {
        window.location = "./gamepage.html";
    })
})