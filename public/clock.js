const virtualTimeMultiplier = 170;
var time = new Date();
var currentHour = time.getHours();
var totalHours = 0;
var songPlaying = false;
var segments = [0, 1.6, 3.5, 5.3, 7.25, 7.82, 9.1, 10.85, 11.125, 12.7, 14.4, 15, 16.45, 20.04];
var currentSong = [0,0,0,0,0,0,0,0,0,0,0,0,0];
var activeSegments = [];
var index = 1;
var audio = document.getElementById("heckethorn");
var silence = document.getElementById("silence");
var audioObj = silence;
var s = Snap(document.getElementById("clock"));

var seconds = s.select("#seconds"),
    minutes = s.select("#minutes"),
    hours = s.select("#hours"),
    rim = s.select("#rim"),
    face = {
        elem: s.select("#face"),
        cx: s.select("#face").getBBox().cx,
        cy: s.select("#face").getBBox().cy,
    },
    angle = 0,
    easing = function (a) {
        return a == !!a ? a : Math.pow(4, -10 * a) * Math.sin((a - .075) * 2 * Math.PI / .3) + 1;
    };

var sshadow = seconds.clone(),
    mshadow = minutes.clone(),
    hshadow = hours.clone(),
    rshadow = rim.clone(),
    shadows = [sshadow, mshadow, hshadow];

//Insert shadows before their respective opaque pals
seconds.before(sshadow);
minutes.before(mshadow);
hours.before(hshadow);
rim.before(rshadow);

//Create a filter to make a blurry black version of a thing
var filter = Snap.filter.blur(0.1) + Snap.filter.brightness(0);

//Add the filter, shift and opacity to each of the shadows
shadows.forEach(function (el) {
    el.attr({
        transform: "translate(0, 2)",
        opacity: 0.2,
        filter: s.filter(filter)
    });
})

rshadow.attr({
    transform: "translate(0, 8) ",
    opacity: 0.5,
    filter: s.filter(Snap.filter.blur(0, 8) + Snap.filter.brightness(0)),
})

function update() {
    time = new Date(time.getTime() + 1000);
    setHours(time);
    setMinutes(time);
    setSeconds(time);
    if (time.getHours() !== currentHour) {
        console.log("São " + time.getHours() + " horas.");
        totalHours++;
        console.log(totalHours);
        currentSong = defineSegments(totalHours);
        // assumption: the virtual hour lasts more than the song playing time
        songPlaying = true;
        console.log("currentSong[index-1] " + currentSong[index-1]);
        audioObj = currentSong[index-1] ? audio : silence;
        console.log("first audioObj is " + audioObj.id);
        audioObj.currentTime = segments[index-1];
        audioObj.play();
        currentHour = time.getHours();
    }
    if (songPlaying) {        
        // console.log("audioObj current time " + audioObj.currentTime);
        // console.log("segments[index] " + segments[index]);
        if (audioObj && audioObj.currentTime >= segments[index]) {
            // console.log("acabou o trecho");
            audioObj.pause();
            if (index >= 13) {
                songPlaying = false;
                // console.log("acabou a música");
                currentSong = [0,0,0,0,0,0,0,0,0,0,0,0,0];
                activeSegments = [];
                index = 1;
            } else {
                index++;
                audioObj = currentSong[index-1] ? audio : silence;
                // console.log("próximo trecho: " + audioObj.id);
                // console.log("próximo trecho: " + segments[index-1]);
                audioObj.currentTime = segments[index-1];
                audioObj.play();
            }
        }
    }
}

function setHours(t) {
    var hour = t.getHours();
    hour %= 12;
    hour += Math.floor(t.getMinutes() / 10) / 6;
    var angle = hour * 360 / 12;
    hours.animate(
        { transform: "rotate(" + angle + " 244 251)" },
        100,
        mina.linear,
        function () {
            if (angle === 360) {
                hours.attr({ transform: "rotate(" + 0 + " " + face.cx + " " + face.cy + ")" });
                hshadow.attr({ transform: "translate(0, 2) rotate(" + 0 + " " + face.cx + " " + face.cy + 2 + ")" });
            }
        }
    );
    hshadow.animate(
        { transform: "translate(0, 2) rotate(" + angle + " " + face.cx + " " + face.cy + 2 + ")" },
        100,
        mina.linear
    );
}
function setMinutes(t) {
    var minute = t.getMinutes();
    minute %= 60;
    minute += Math.floor(t.getSeconds() / 10) / 6;
    var angle = minute * 360 / 60;
    minutes.animate(
        { transform: "rotate(" + angle + " " + face.cx + " " + face.cy + ")" },
        100,
        mina.linear,
        function () {
            if (angle === 360) {
                minutes.attr({ transform: "rotate(" + 0 + " " + face.cx + " " + face.cy + ")" });
                mshadow.attr({ transform: "translate(0, 2) rotate(" + 0 + " " + face.cx + " " + face.cy + 2 + ")" });
            }
        }
    );
    mshadow.animate(
        { transform: "translate(0, 2) rotate(" + angle + " " + face.cx + " " + face.cy + 2 + ")" },
        100,
        mina.linear
    );
}
function setSeconds(t) {
    t = t.getSeconds();
    t %= 60;
    var angle = t * 360 / 60;
    //if ticking over to 0 seconds, animate angle to 360 and then switch angle to 0
    if (angle === 0) angle = 360;
    seconds.animate(
        { transform: "rotate(" + angle + " " + face.cx + " " + face.cy + ")" },
        600,
        easing,
        function () {
            if (angle === 360) {
                seconds.attr({ transform: "rotate(" + 0 + " " + face.cx + " " + face.cy + ")" });
                sshadow.attr({ transform: "translate(0, 2) rotate(" + 0 + " " + face.cx + " " + face.cy + 2 + ")" });
            }
        }
    );
    sshadow.animate(
        { transform: "translate(0, 2) rotate(" + angle + " " + face.cx + " " + face.cy + 2 + ")" },
        600,
        easing
    );
}
function defineSegments(hours) {
    let sequence = [0,0,0,0,0,0,0,0,0,0,0,0,0];
    //SEQUENCIA A
    if (hours%11===4){
        activeSegments = activeSegments.concat([1]);
    } else if (hours%11===5){
        activeSegments = activeSegments.concat([1,5]);
    } else if (hours%11===0){
        activeSegments = activeSegments.concat([1,5,11]);
    }
    //SEQUENCIA B
    if (hours%13===2){
        activeSegments = activeSegments.concat([2]);
    } else if (hours%13===4){
        activeSegments = activeSegments.concat([2,4]);
    } else if (hours%13===7){
        activeSegments = activeSegments.concat([2,4,7]);
    } else if (hours%13===0){
        activeSegments = activeSegments.concat([2,4,7,9]);
    }
    //SEQUENCIA C
    if (hours%21===4){
        activeSegments = activeSegments.concat([3]);
    } else if (hours%21===7){
        activeSegments = activeSegments.concat([3,6]);
    } else if (hours%21===12){
        activeSegments = activeSegments.concat([3,6,8]);
    } else if (hours%21===18){
        activeSegments = activeSegments.concat([3,6,8,10]);
    } else if (hours%21===0){
        activeSegments = activeSegments.concat([3,6,8,10,13]);
    }
    //SEQUENCIA D
    if (hours%5===0){
        activeSegments = activeSegments.concat([12]);
    }
    for (var i = 0; i < activeSegments.length; i++){
        sequence[activeSegments[i]-1] = 1;
    }
    console.log(sequence);
    return sequence;
}
setInterval(update, 1000/virtualTimeMultiplier);