function dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}

function createUUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
 }


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
    pictureBtn.addEventListener("click", () => {
        var ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0);
    })

    // First fetch call receives the url to location (from an API that Blake provided) 
    // where we can store the image. 
    emotionBtn.addEventListener("click", () => {
        const fileName = createUUID() + '.png;'
        fetch("https://60i37otq33.execute-api.us-west-2.amazonaws.com/prod",{
            method: "POST",
            body: JSON.stringify({
                fileName
            })
        }).then(res => res.json())
        .then(data => {
            // Second fetch call stores the image in the bucket at the 
            // url that we got from the first fetch call.
            console.log(data);
            fetch(data, {
                method: "PUT",
                body: dataURItoBlob(canvas.toDataURL())
            }).then(resp => {
                // Third fetch call receives the face attributes info from the 
                // Azure face API.
                fetch("https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=emotion",{
                    method: "POST",
                    headers: {
                        "Ocp-Apim-Subscription-Key": "a5d4b501a2d04f2d946a0a2dc164c176",
                        "Content-Type": "application/json; charset=utf-8" 
                    },
                    body: JSON.stringify({"url": `https://s3-us-west-2.amazonaws.com/1810-public-bucket/${fileName}`})
                })
                .then(res => res.json())
                .then(data => {
                    console.log(data[0].faceAttributes.emotion);
                })
                .catch(err => console.log(err));
                    })
                    .catch(console.log(err))
        });
    })

    gamePageBtn.addEventListener("click", event => {
        window.location = "./gamepage.html";
    })
})