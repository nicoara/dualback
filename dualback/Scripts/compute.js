document.onkeypress = function (evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var charStr = String.fromCharCode(charCode);
    if (charStr === "a") {
        guessAudio();
    }
    if (charStr === "v") {
        guessVideo();
    }
    if (charStr === "q") {
        stopGame();
    }
};

//-----------------CAPTURE DATA

var lockAudio = false;
var lockVideo = false;
function guessAudio() {
    if (notStopped && !lockAudio) {
        if (lstMatchesAudio.indexOf(currentStep - 1) !== -1) {//currentStep-1 pentru ca se pare ca eventul ajunge aici dupa ce so termina asteptarea din step(currStep)
            nrDetectedAudio = nrDetectedAudio + 1;
            console.log("guessed audio:" + nrDetectedAudio);
        } else {
            nrDetectedAudioWrong = nrDetectedAudioWrong + 1;
        }

        printToScreen();
        lockAudio = true;
    }
}

function guessVideo() {
    if (notStopped && !lockVideo) {
        if (lstMatchesVideo.indexOf(currentStep - 1) !== -1) {//currentStep-1 pentru ca se pare ca eventul ajunge aici dupa ce so termina asteptarea din step(currStep)
            nrDetectedVideo = nrDetectedVideo + 1;
            console.log("guessed video:" + nrDetectedVideo);
        } else {
            nrDetectedVideoWrong = nrDetectedVideoWrong + 1;
        }

        printToScreen();
        lockVideo = true;
    }
}

//-----------COMPUTATION

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function newArray(length) {
    return Array.apply(null, Array(length)).map(Number.prototype.valueOf, 0);
}

function getRandomIntInclusive(min, max) {
    // Returns a random integer between min (included) and max (included)
    // Using Math.round() will give you a non-uniform distribution!
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addSecs(d, s) { return new Date(d.valueOf() + s * 1500 + (sizeStep-3)*300); }

function printToScreen() {
    if (notStopped) {
        console.log("audio corect: " + nrDetectedAudio +
         ", audio gresit: " + nrDetectedAudioWrong +
         ", video corect: " + nrDetectedVideo +
         ", video gresit: " + nrDetectedVideoWrong +
         ", procent: " + Math.round((((nrDetectedAudio - nrDetectedAudioWrong) / 7 +
         (nrDetectedVideo - nrDetectedVideoWrong) / 7) / 2)*100) + "%");
    } else {
        document.getElementById("results").innerHTML =
        "audio corect: " + nrDetectedAudio +
         ", audio gresit: " + nrDetectedAudioWrong +
         ", video corect: " + nrDetectedVideo +
         ", video gresit: " + nrDetectedVideoWrong +
         ", procent: " + Math.round((((nrDetectedAudio - nrDetectedAudioWrong) / 7 +
         (nrDetectedVideo - nrDetectedVideoWrong) / 7) / 2)*100) + "%";
    }
}

//-----------------TESTS

function tests() {
    sizeStep = parseInt($('[id="inputLevel"]').val());

    for (var i = 0; i < 100; i++) {
        if (!stopIfError(generateArray(), "post:")) {
            console.log("test: " + i.toString());
            break;
        }
    }
    console.log("end");
}

//-------------GENERATE DATA

var nrSteps = 20;
var nrMatches = 7;
var sizeStep = 3;  //variable

var nrSecondsPause = 2;
var nrDetectedAudio = 0;
var nrDetectedAudioWrong = 0;
var nrDetectedVideo = 0;
var nrDetectedVideoWrong = 0;

var lstIndexMatchGlobal = [];//array[nrMatches] wt values 0-(nrSteps-1) cu indexurile DE START de la matches
var lstMatchesAudio = [];//array[nrMatches] wt values 0-(nrSteps-1) cu indexurile DE END de la matches
var lstMatchesVideo = [];//array[nrMatches] wt values 0-(nrSteps-1) cu indexurile DE END de la matches
var lstPositionsAudio = [];//array[nrSteps] wt values 1-9
var lstPositionsVideo = [];//array[nrSteps] wt values 1-9

var notStopped;
var currentStep = 0;

function logPositionMatches(arrayMatches) {
    var arrayPos = newArray(nrSteps);
    for (var i = 0; i < arrayMatches.length; i++) {
        arrayPos[arrayMatches[i]] = arrayMatches[i] % 10;
    }
    console.log(arrayPos);
}

function stopIfError(array, cand) {
    var arrayMatches = [];
    for (i = 0; i < array.length; i++) {
        if (array[i] !== 0) {
            if (array[i] === array[i + sizeStep]) {
                arrayMatches.push(i);
            }
        }
    }
    if (arrayMatches.length !== nrMatches) {

        console.log(cand);
        logPositionMatches(arrayMatches);
        console.log(array);

        return false;
    }
    return true;
}

function generateMaches() {
    //generates a sorted array[nrMatches] that for each index means that there is a match(index, index+sizeStep)
    //nrSteps = 20, sizeStep = 3, nrMatches = 7
    //ex: [2, 3, 4, 7, 9, 12, 14]

    var arrayIndex = [];
    var i = 0;
    while (i < nrMatches) {
        var randomNr = getRandomIntInclusive(0, nrSteps - sizeStep - 1);//0-16 pt nrSteps = 20
        //arrayIndex[randomNr] === arrayIndex[randomNr+sizeStep]
        if (arrayIndex.indexOf(randomNr) === -1) {
            arrayIndex.push(randomNr);
            i = i + 1;
        }

    }

    return arrayIndex.sort(function (a, b) { return a - b });
}

function generateArray() {
    var lstIndexMatch = generateMaches();
    var lstPositions = newArray(nrSteps);

    lstIndexMatchGlobal = lstIndexMatch.slice();

    //complete for values of the array at match indexes
    for (i = 0; i < lstIndexMatch.length; i++) {
        var indexLstPos = lstIndexMatch[i];

        if (lstPositions[indexLstPos] === 0) {
            if (lstIndexMatch.indexOf(indexLstPos - 2 * sizeStep) != -1) {
                //i want to avoid extra match
                while (true) {
                    var value = getRandomIntInclusive(1, 9);
                    if (lstPositions[indexLstPos - sizeStep] != value) {
                        lstPositions[indexLstPos] = value;
                        lstPositions[indexLstPos + sizeStep] = value;
                        break;
                    }
                }
            }
            else {
                var value = getRandomIntInclusive(1, 9);
                lstPositions[indexLstPos] = value;
                lstPositions[indexLstPos + sizeStep] = value;
            }
        }
        else {
            //ex: have 2 matches: 1-4, 4-6 cu sizeStep 2 so we want the three positions to be the same
            //ex: 9--9--? for sizeStep 3
            lstPositions[indexLstPos + sizeStep] = lstPositions[indexLstPos];
        }
    }

    //complete rest of the array so that there are no extra matches
    for (i = 0; i < lstPositions.length; i++) {
        if (lstPositions[i] === 0) {
            while (true) {
                var value = getRandomIntInclusive(1, 9);
                if (i - sizeStep < 0) {
                    if (lstPositions[i + sizeStep] !== value) {
                        lstPositions[i] = value;
                        break;
                    }
                }
                if (i - sizeStep >= 0 && i + sizeStep < lstPositions.length) {
                    if (lstPositions[i - sizeStep] !== value &&
						lstPositions[i + sizeStep] !== value) {
                        lstPositions[i] = value;
                        break;
                    }
                }

                if (i - sizeStep >= 0 && i + sizeStep >= lstPositions.length) {
                    if (lstPositions[i - sizeStep] !== value) {
                        lstPositions[i] = value;
                        break;
                    }
                }
            }
        }
    }

    return lstPositions;
}

function arrayMatchEndings() {
    var array = [];
    for (var i = 0; i < lstIndexMatchGlobal.length; i++) {
        array.push(lstIndexMatchGlobal[i] + sizeStep);
    }
    return array;

}

function setupData() {
    sizeStep = parseInt($('[id="inputLevel"]').val());

    /*
    //clear global variables
    nrDetectedAudio = 0;
    nrDetectedAudioWrong = 0;
    nrDetectedVideo = 0;
    nrDetectedVideoWrong = 0;
    lstIndexMatchGlobal = [];
    lstMatchesAudio = [];
    lstMatchesVideo = [];
    lstPositionsAudio = [];
    lstPositionsVideo = [];
    notStopped = true;
    currentStep = 0;
    htmlTimpi = "";
    duplicateStreak = false;
    duplicateLastPlayedAudio = 0;
    previousAudioNr = null;
    */

    lstPositionsAudio = generateArray();
    lstMatchesAudio = arrayMatchEndings();

    lstPositionsVideo = generateArray();
    lstMatchesVideo = arrayMatchEndings();

    console.log("lstMatchesAudio: " + lstMatchesAudio.toString());
    console.log("lstMatchesVideo: " + lstMatchesVideo.toString());

}

//-----------------GAME

var prevStepTime;
var htmlTimpi = "";
var duplicateStreak = false;
var duplicateLastPlayedAudio = 0;
var previousAudioNr = null;
function computationStep(currStep) {


    //video change
    var color = "lightblue";
    var currentColor = $('[id="' + lstPositionsVideo[currStep] + '"]').css("background-color");
    if (currentColor !== "rgba(0, 0, 0, 0)") {
        if (currentColor === "rgb(173, 216, 230)") {
            color = "yellow";//daca e albastru o facem galben
        } else {
            color = "lightblue";//pt a evita threepeats
        }   
    }
    for (var i = 1; i < 10; i++) {
        document.getElementById(i).innerHTML = "";
        $('[id="' + i + '"]').css("background-color", "");
    }
    $('[id="' + lstPositionsVideo[currStep] + '"]').css("background-color", color);


    //audio change
    //had to change the algorithm because HTML5 apparently does not play the same audio file twice consecutively. 
    //so i created a second set of audio tags: myAudio-X-1. Another solution would be an event listener?
    var duplicateAudio = false;
    if (lstPositionsAudio[currStep] === previousAudioNr) {
        duplicateAudio = true;
    }
    previousAudioNr = lstPositionsAudio[currStep];
    if (duplicateAudio) {
        if (duplicateStreak === false) {
            var x = document.getElementById("myAudio-" + lstPositionsAudio[currStep] + "-1");
            x.play();
            duplicateLastPlayedAudio = 0;
        } else {
            if (duplicateLastPlayedAudio === 0) {
                var x = document.getElementById("myAudio-" + lstPositionsAudio[currStep]);
                x.play();
                duplicateLastPlayedAudio = 1;
            } else {
                var x = document.getElementById("myAudio-" + lstPositionsAudio[currStep] + "-1");
                x.play();
                duplicateLastPlayedAudio = 0;
            }
        }
        duplicateStreak = true;
    } else {
        duplicateStreak = false;
        var x = document.getElementById("myAudio-" + lstPositionsAudio[currStep]);
        x.play();
    }

    
    lockAudio = false;
    lockVideo = false;
    currentStep = currStep;
    document.getElementById('stepnr').innerHTML = currStep;

    /*
    var acum = new Date();
    var diff = acum - prevStepTime;
    htmlTimpi = htmlTimpi + diff / 1000 + "\n";
    document.getElementById('timpi').innerHTML = htmlTimpi;
    prevStepTime = acum;
    */

    if (currStep === nrSteps - 1) {
        stopGame();
        printToScreen();

        var score = {
            s_Level: sizeStep,
            s_DetectedAudio: nrDetectedAudio,
            s_DetectedAudioWrong: nrDetectedAudioWrong,
            s_DetectedVideo: nrDetectedVideo,
            s_DetectedVideoWrong: nrDetectedVideoWrong,
            s_Percent: Math.round((((nrDetectedAudio - nrDetectedAudioWrong) / 7 +
         (nrDetectedVideo - nrDetectedVideoWrong) / 7) / 2) * 100)
        };

        $.ajax({
            url: "/Home/SaveScore",
            type: "POST",
            dataType: "json",
            data: score
        });
    }

}

function step(currStep) {
    setTimeout(function () {
        start = new Date();
        end = addSecs(start, nrSecondsPause);
        do { start = new Date(); } while (end - start > 0);

        computationStep(currStep);

        if (currStep < nrSteps && notStopped) {
            step(currStep + 1);
        }
    }, 10);
}

function startGame() {
    notStopped = true;
    prevStepTime = new Date();

    step(0);
}

function stopGame() {
    notStopped = false;
}

//-----------------UI

function start() {
    tests();
    setupData();
    startGame();
}

function stop() {
    notStopped = false;
}

