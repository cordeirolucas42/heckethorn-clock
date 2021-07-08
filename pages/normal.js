import Head from 'next/head';
import Link from 'next/link';
import React, { Component } from "react";

const virtualTime = 1; //set this number to adjust how many times faster the virtual time will be (lower than 100)
const type = "roman"; //change here to change the cock numbers type
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const romanNumbers = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const numInFull = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];

var currentHour = new Date().getHours();
var totalHours = 0;
var songPlaying = false;
var segments = [0, 1.6, 3.5, 5.3, 7.25, 7.82, 9.1, 10.85, 11.125, 12.7, 14.4, 15, 16.45, 20.04];
var currentSong = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var activeSegments = [];
var index = 1;
var audioObj;

export default class Clock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: new Date()
        };
    }

    //function to render the repetitive span element for each clock number
    renderClockNum(num) {
        if (type === "roman") {
            return <span className={numInFull[num - 1]}>{romanNumbers[num - 1]}</span>
        } else {
            return <span className={numInFull[num - 1]}>{num}</span>
        }

    }

    componentDidMount() {
        //start loop each (1000/virtualTime) miliseconds
        this.timerId = setInterval(() => {
            //in order to update the state using it's own value, need to use a function
            this.setState((state) => {
                //add 1 second each (1000/virtualTime) miliseconds
                return { time: new Date(state.time.getTime() + 1000) }
            });
            if (this.state.time.getHours() !== currentHour) {
                console.log("this.state.time.getHours() " + this.state.time.getHours());
                totalHours++;
                console.log("totalHours " + totalHours);
                currentSong = this.defineSegments(totalHours);
                songPlaying = true;
                console.log("currentSong[index-1] " + currentSong[index - 1]);
                audioObj = document.getElementById(currentSong[index - 1] ? "heckethorn" : "silence");
                console.log("first audioObj is " + audioObj.id);
                audioObj.currentTime = segments[index - 1];
                audioObj.play();
                currentHour = this.state.time.getHours();
            }
            if (songPlaying) {
                if (audioObj && audioObj.currentTime >= segments[index]) {
                    // console.log("acabou o trecho");
                    audioObj.pause();
                    if (index >= 13) {
                        songPlaying = false;
                        // console.log("acabou a música");
                        currentSong = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        activeSegments = [];
                        index = 1;
                    } else {
                        index++;
                        audioObj = document.getElementById(currentSong[index - 1] ? "heckethorn" : "silence");
                        console.log("próximo trecho: " + audioObj.id + ", " + segments[index - 1]);
                        audioObj.currentTime = segments[index - 1];
                        audioObj.play();
                    }
                }
            }
        }, 1000 / virtualTime);
    }

    componentWillMount() {
        clearInterval(this.timerId);
    }

    render() {
        return (
            <div>
                <Head>
                    <title>Relógio Heckethorn</title>
                    <link rel="icon" href="/clock.png" />
                </Head>
                {/* audio containing the intro to 'Sonata in F Minor K.462' */}
                <audio id="heckethorn">
                    <source src="https://www.mboxdrive.com/sonata.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
                {/* audio with 60 seconds of silence */}
                <audio id="silence">
                    <source src="https://www.mboxdrive.com/silence.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
                <p className="link">Esta é a versão em tempo real | Clique <a href="/quick">aqui</a> para a versão acelerada.</p>
                <div className="clock">
                    <div
                        className="hour_hand"
                        style={{
                            transform: `rotateZ(${this.state.time.getHours() * 30}deg)`
                        }}
                    />
                    <div
                        className="min_hand"
                        style={{
                            transform: `rotateZ(${this.state.time.getMinutes() * 6}deg)`
                        }}
                    />
                    <div
                        className="sec_hand"
                        style={{
                            transform: `rotateZ(${this.state.time.getSeconds() * 6}deg)`
                        }}
                    />
                    {numbers.map(this.renderClockNum)}

                    {/* <Player url="https://www.mboxdrive.com/sonata.mp3"/> */}

                    <style jsx global>{`
        @import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap");
        .App {
          font-family: sans-serif;          
        }
        
        .link {
            font-family: sans-serif;
            text-decoration: none;
            color: black;
            position: fixed;
            top: 0;
        }

        .clock {
          width: 300px;
          height: 300px;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 2px 30px rgba(0, 0, 0, 0.2);
          font-size: 24px;
          color: #444;
          text-align: center;
        }
        
        .clock::after {
          background: #aaa;
          content: "";
          width: 12px;
          height: 12px;
          border-radius: 50%;
          position: absolute;
          z-index: 2;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 2px solid #fff;
        }
        
        .hour_hand {
          position: absolute;
          width: 6px;
          height: 60px;
          background: #222;
          top: 30%;
          left: 49%;
          transform-origin: bottom;
        }
        
        .min_hand {
          position: absolute;
          width: 4px;
          height: 80px;
          background: #444;
          top: 22.5%;
          left: 49%;
          transform-origin: bottom;
        }
        
        .sec_hand {
          position: absolute;
          width: 2px;
          height: 118px;
          background: red;
          top: 10.5%;
          left: 50%;
          transform-origin: bottom;
        }
        
        .clock span {
          position: absolute;
          font-family: "Source Sans Pro", sans-serif;
          font-weight: 700;
        }
        
        .twelve {
          top: 10px;
          left: 46%;
        }
        
        .one {
          top: 10%;
          right: 26%;
        }
        
        .eleven {
          top: 10%;
          left: 26%;
        }
        
        .two {
          top: 25%;
          right: 10%;
        }
        
        .three {
          right: 10px;
          top: 46%;
        }
        
        .four {
          right: 30px;
          top: 67%;
        }
        
        .five {
          right: 78px;
          top: 80%;
        }
        
        .six {
          bottom: 10px;
          left: 50%;
        }
        
        .seven {
          left: 80px;
          top: 82%;
        }
        
        .eight {
          left: 30px;
          top: 67%;
        }
        
        .nine {
          left: 10px;
          top: 46%;
        }
        
        .ten {
          top: 25%;
          left: 10%;
        }        
      `}</style>

                </div>
            </div>
        );
    }

    defineSegments(hours) {
        let sequence = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        //SEQUENCIA A
        if (hours % 11 === 4) {
            activeSegments = activeSegments.concat([1]);
        } else if (hours % 11 === 5) {
            activeSegments = activeSegments.concat([1, 5]);
        } else if (hours % 11 === 0) {
            activeSegments = activeSegments.concat([1, 5, 11]);
        }
        //SEQUENCIA B
        if (hours % 13 === 2) {
            activeSegments = activeSegments.concat([2]);
        } else if (hours % 13 === 4) {
            activeSegments = activeSegments.concat([2, 4]);
        } else if (hours % 13 === 7) {
            activeSegments = activeSegments.concat([2, 4, 7]);
        } else if (hours % 13 === 0) {
            activeSegments = activeSegments.concat([2, 4, 7, 9]);
        }
        //SEQUENCIA C
        if (hours % 21 === 4) {
            activeSegments = activeSegments.concat([3]);
        } else if (hours % 21 === 7) {
            activeSegments = activeSegments.concat([3, 6]);
        } else if (hours % 21 === 12) {
            activeSegments = activeSegments.concat([3, 6, 8]);
        } else if (hours % 21 === 18) {
            activeSegments = activeSegments.concat([3, 6, 8, 10]);
        } else if (hours % 21 === 0) {
            activeSegments = activeSegments.concat([3, 6, 8, 10, 13]);
        }
        //SEQUENCIA D
        if (hours % 5 === 0) {
            activeSegments = activeSegments.concat([12]);
        }
        for (var i = 0; i < activeSegments.length; i++) {
            sequence[activeSegments[i] - 1] = 1;
        }
        console.log(sequence);
        return sequence;
    }
}