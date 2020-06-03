(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{"1OyB":function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}n.d(e,"a",(function(){return r}))},"1YPb":function(t,e,n){var r;t.exports=function t(e,n,o){function i(u,s){if(!n[u]){if(!e[u]){if(!s&&"function"==typeof r&&r)return r(u,!0);if(a)return a(u,!0);throw new Error("Cannot find module '"+u+"'")}var c=n[u]={exports:{}};e[u][0].call(c.exports,(function(t){var n=e[u][1][t];return i(n||t)}),c,c.exports,t,e,n,o)}return n[u].exports}for(var a="function"==typeof r&&r,u=0;u<o.length;u++)i(o[u]);return i}({1:[function(t,e,n){"object"===typeof n&&(e.exports=window.AudioContext||window.webkitAudioContext)},{}],2:[function(t,e,n){e.exports=o;var r={instrument:{},rhythm:{},tuning:{}};function o(e,n){if(e||(e="equalTemperament"),n||(n="northAmerican"),"undefined"===typeof r.tuning[e])throw new Error(e+" is not a valid tuning pack.");if("undefined"===typeof r.rhythm[n])throw new Error(n+" is not a valid rhythm pack.");var o,i=this,a=function(){},u=t("audiocontext"),s={2:6,4:3,8:4.5};i.packs=r,i.pitches=r.tuning[e],i.notes=r.rhythm[n],i.audioContext=new u,i.masterVolumeLevel=null,i.masterVolume=i.audioContext.createGain(),i.masterVolume.connect(i.audioContext.destination),i.beatsPerBar=null,i.noteGetsBeat=null,i.tempo=null,i.instruments=[],i.totalDuration=0,i.currentSeconds=0,i.percentageComplete=0,i.noteBufferLength=20,i.onTickerCallback=a,i.onFinishedCallback=a,i.onDurationChangeCallback=a,i.load=function(t){if(i.instruments.length>0&&i.destroy(),!t)throw new Error("JSON is required for this method to work.");if("undefined"===typeof t.instruments)throw new Error("You must define at least one instrument");if("undefined"===typeof t.notes)throw new Error("You must define notes for each instrument");"undefined"!==typeof t.timeSignature&&i.setTimeSignature(t.timeSignature[0],t.timeSignature[1]),"undefined"!==typeof t.tempo&&i.setTempo(t.tempo);var e={};for(var n in t.instruments)t.instruments.hasOwnProperty(n)&&(e[n]=i.createInstrument(t.instruments[n].name,t.instruments[n].pack));for(var r in t.notes)if(t.notes.hasOwnProperty(r))for(var o=-1;++o<t.notes[r].length;){var a=t.notes[r][o];if("string"===typeof a){var u=a.split("|");"rest"===u[1]?e[r].rest(u[0]):e[r].note(u[0],u[1],u[2])}else"rest"===a.type?e[r].rest(a.rhythm):"note"===a.type&&e[r].note(a.rhythm,a.pitch,a.tie)}return i.finish()},i.createInstrument=function(e,n){var r=new(t("./instrument.js"))(e,n,i);return i.instruments.push(r),r},i.finish=function(){var e=t("./player.js");return o=new e(i)},i.destroy=function(){i.audioContext=new u,i.instruments.length=0,i.masterVolume=i.audioContext.createGain(),i.masterVolume.connect(i.audioContext.destination)},i.setMasterVolume=function(t){t>1&&(t/=100),i.masterVolumeLevel=t,i.masterVolume.gain.setValueAtTime(t,i.audioContext.currentTime)},i.getTotalSeconds=function(){return Math.round(i.totalDuration)},i.setTickerCallback=function(t){if("function"!==typeof t)throw new Error("Ticker must be a function.");i.onTickerCallback=t},i.setTimeSignature=function(t,e){if("undefined"===typeof s[e])throw new Error("The bottom time signature is not supported.");i.beatsPerBar=t,i.noteGetsBeat=s[e]},i.setTempo=function(t){i.tempo=60/t,o&&(o.resetTempo(),i.onDurationChangeCallback())},i.setOnFinishedCallback=function(t){if("function"!==typeof t)throw new Error("onFinished callback must be a function.");i.onFinishedCallback=t},i.setOnDurationChangeCallback=function(t){if("function"!==typeof t)throw new Error("onDurationChanged callback must be a function.");i.onDurationChangeCallback=t},i.setNoteBufferLength=function(t){i.noteBufferLength=t},i.setMasterVolume(100),i.setTempo(120),i.setTimeSignature(4,4)}o.loadPack=function(t,e,n){if(-1===["tuning","rhythm","instrument"].indexOf(t))throw new Error(t+" is not a valid Pack Type.");if("undefined"!==typeof r[t][e])throw new Error("A(n) "+t+' pack with the name "'+e+'" has already been loaded.');r[t][e]=n}},{"./instrument.js":5,"./player.js":7,audiocontext:1}],3:[function(t,e,n){e.exports=function(t,e){if(-1===["white","pink","brown","brownian","red"].indexOf(t))throw new Error(t+" is not a valid noise sound");return{createNote:function(n){switch(t){case"white":return function(t){for(var n=2*e.sampleRate,r=e.createBuffer(1,n,e.sampleRate),o=r.getChannelData(0),i=0;i<n;i++)o[i]=2*Math.random()-1;var a=e.createBufferSource();return a.buffer=r,a.loop=!0,a.connect(t),a}(n);case"pink":return function(t){var n,r,o,i,a,u,s,c=2*e.sampleRate,f=e.createBuffer(1,c,e.sampleRate),l=f.getChannelData(0);n=r=o=i=a=u=s=0;for(var p=0;p<c;p++){var m=2*Math.random()-1;n=.99886*n+.0555179*m,r=.99332*r+.0750759*m,o=.969*o+.153852*m,i=.8665*i+.3104856*m,a=.55*a+.5329522*m,u=-.7616*u-.016898*m,l[p]=n+r+o+i+a+u+s+.5362*m,l[p]*=.11,s=.115926*m}var d=e.createBufferSource();return d.buffer=f,d.loop=!0,d.connect(t),d}(n);case"brown":case"brownian":case"red":return function(t){for(var n=2*e.sampleRate,r=e.createBuffer(1,n,e.sampleRate),o=r.getChannelData(0),i=0,a=0;a<n;a++){var u=2*Math.random()-1;o[a]=(i+.02*u)/1.02,i=o[a],o[a]*=3.5}var s=e.createBufferSource();return s.buffer=r,s.loop=!0,s.connect(t),s}(n)}}}}},{}],4:[function(t,e,n){e.exports=function(t,e){if(-1===["sine","square","sawtooth","triangle"].indexOf(t))throw new Error(t+" is not a valid Oscillator type");return{createNote:function(n,r){var o=e.createOscillator();return o.connect(n),o.type=t,o.frequency.value=r,o}}}},{}],5:[function(t,e,n){e.exports=function(t,e,n){if(t||(t="sine"),e||(e="oscillators"),"undefined"===typeof n.packs.instrument[e])throw new Error(e+" is not a currently loaded Instrument Pack.");function r(t){if("undefined"===typeof n.notes[t])throw new Error(t+" is not a correct rhythm.");return n.notes[t]*n.tempo/n.noteGetsBeat*10}function o(t){if(null===t||"object"!=typeof t)return t;var e=t.constructor();for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e}var i=this,a=0,u=1;i.totalDuration=0,i.bufferPosition=0,i.instrument=n.packs.instrument[e](t,n.audioContext),i.notes=[],i.setVolume=function(t){return t>1&&(t/=100),u=t,i},i.note=function(t,e,o){var a=r(t),s=o?0:.05*a;if(e){e=e.split(",");for(var c=-1;++c<e.length;){var f=e[c];if(f=f.trim(),"undefined"===typeof n.pitches[f]&&(f=parseFloat(f),isNaN(f)||f<0))throw new Error(f+" is not a valid pitch.")}}return i.notes.push({rhythm:t,pitch:e,duration:a,articulationGap:s,tie:o,startTime:i.totalDuration,stopTime:i.totalDuration+a-s,volumeLevel:u/4}),i.totalDuration+=a,i},i.rest=function(t){var e=r(t);return i.notes.push({rhythm:t,pitch:!1,duration:e,articulationGap:0,startTime:i.totalDuration,stopTime:i.totalDuration+e}),i.totalDuration+=e,i},i.repeatStart=function(){return a=i.notes.length,i},i.repeatFromBeginning=function(t){return a=0,i.repeat(t),i},i.repeat=function(t){t="undefined"===typeof t?1:t;for(var e=i.notes.slice(a),n=0;n<t;n++)for(var r=-1;++r<e.length;){var u=o(e[r]);u.startTime=i.totalDuration,u.stopTime=i.totalDuration+u.duration-u.articulationGap,i.notes.push(u),i.totalDuration+=u.duration}return i},i.resetDuration=function(){var t=-1,e=i.notes.length;for(i.totalDuration=0;++t<e;){var n=i.notes[t],o=r(n.rhythm),a=n.tie?0:.05*o;n.duration=r(n.rhythm),n.startTime=i.totalDuration,n.stopTime=i.totalDuration+o-a,!1!==n.pitch&&(n.articulationGap=a),i.totalDuration+=o}}}},{}],6:[function(t,e,n){e.exports=t("./conductor.js"),e.exports.loadPack("instrument","noises",t("./instrument-packs/noises.js")),e.exports.loadPack("instrument","oscillators",t("./instrument-packs/oscillators.js")),e.exports.loadPack("rhythm","northAmerican",t("./rhythm-packs/north-american.js")),e.exports.loadPack("rhythm","european",t("./rhythm-packs/european.js")),e.exports.loadPack("tuning","equalTemperament",t("./tuning-packs/equal-temperament.js"))},{"./conductor.js":2,"./instrument-packs/noises.js":3,"./instrument-packs/oscillators.js":4,"./rhythm-packs/european.js":8,"./rhythm-packs/north-american.js":9,"./tuning-packs/equal-temperament.js":10}],7:[function(t,e,n){e.exports=function(t){var e,n,r=this,o=f(),i=0,a=!1;function u(n){for(var r=-1,a=t.instruments.length;++r<a;){var u=t.instruments[r];n&&u.resetDuration(),u.bufferPosition=0}for(n&&(c(),i=t.percentageComplete*t.totalDuration),r=-1;++r<o.length;)o[r].gain.disconnect();clearTimeout(e),o=f()}function s(e,n,o){if("undefined"===typeof o&&(o=!1),"up"!==e&&"down"!==e)throw new Error("Direction must be either up or down.");a="down"===e,"up"===e?(t.masterVolume.gain.linearRampToValueAtTime(0,t.audioContext.currentTime),t.masterVolume.gain.linearRampToValueAtTime(t.masterVolumeLevel,t.audioContext.currentTime+.2)):(t.masterVolume.gain.linearRampToValueAtTime(t.masterVolumeLevel,t.audioContext.currentTime),t.masterVolume.gain.linearRampToValueAtTime(0,t.audioContext.currentTime+.2)),setTimeout((function(){"function"===typeof n&&n.call(r),o&&(a=!a,t.masterVolume.gain.linearRampToValueAtTime(t.masterVolumeLevel,t.audioContext.currentTime))}),200)}function c(){for(var e=-1,n=0;++e<t.instruments.length;){var r=t.instruments[e];r.totalDuration>n&&(n=r.totalDuration)}t.totalDuration=n}function f(){for(var e=[],n=-1,r=t.noteBufferLength;++n<t.instruments.length;){for(var o=t.instruments[n],a=r,u=-1;++u<a;){var s=o.notes[o.bufferPosition+u];if("undefined"===typeof s)break;var c=s.pitch,f=s.startTime,l=s.stopTime,p=s.volumeLevel;if(l<i)a++;else if(!1!==c){var m=t.audioContext.createGain();if(m.connect(t.masterVolume),m.gain.value=p,f<i&&(f=l-i),"undefined"===typeof c)e.push({startTime:f<i?l-i:f,stopTime:l,node:o.instrument.createNote(m),gain:m,volumeLevel:p});else for(var d=-1;++d<c.length;){var h=c[d];e.push({startTime:f,stopTime:l,node:o.instrument.createNote(m,t.pitches[h.trim()]||parseFloat(h)),gain:m,volumeLevel:p})}}}o.bufferPosition+=a}return e}function l(){!r.paused&&r.playing&&(t.totalDuration<i?(r.stop(!1),r.looping?r.play():t.onFinishedCallback()):(p(),setTimeout(l,1e3/60)))}function p(){i+=t.audioContext.currentTime-n;var e=Math.round(i);e!=t.currentSeconds&&(setTimeout((function(){t.onTickerCallback(e)}),1),t.currentSeconds=e),t.percentageComplete=i/t.totalDuration,n=t.audioContext.currentTime}c(),r.paused=!1,r.playing=!1,r.looping=!1,r.muted=!1,r.play=function(){r.playing=!0,r.paused=!1,n=t.audioContext.currentTime,l();var u=t.audioContext.currentTime-i,c=function(t){for(var e=-1;++e<t.length;){var n=t[e],r=n.startTime+u,o=n.stopTime+u;n.tie||(r>0&&(r-=.001),o+=.001,n.gain.gain.setValueAtTime(0,r),n.gain.gain.linearRampToValueAtTime(n.volumeLevel,r+.001),n.gain.gain.setValueAtTime(n.volumeLevel,o-.001),n.gain.gain.linearRampToValueAtTime(0,o)),n.node.start(r),n.node.stop(o)}};c(o),function n(){e=setTimeout((function(){if(r.playing&&!r.paused){var t=f();t.length>0&&(c(t),o=o.concat(t),n())}}),5e3*t.tempo)}(),a&&!r.muted&&s("up")},r.stop=function(e){r.playing=!1,t.currentSeconds=0,t.percentageComplete=0,"undefined"===typeof e&&(e=!0),e&&!r.muted?s("down",(function(){i=0,u(),setTimeout((function(){t.onTickerCallback(t.currentSeconds)}),1)}),!0):(i=0,u(),setTimeout((function(){t.onTickerCallback(t.currentSeconds)}),1))},r.pause=function(){r.paused=!0,p(),r.muted?u():s("down",(function(){u()}))},r.loop=function(t){r.looping=!!t},r.setTime=function(t){i=parseInt(t),u(),r.playing&&!r.paused&&r.play()},r.resetTempo=function(){u(!0),r.playing&&!r.paused&&r.play()},r.mute=function(t){r.muted=!0,s("down",t)},r.unmute=function(t){r.muted=!1,s("up",t)}}},{}],8:[function(t,e,n){e.exports={semibreve:1,dottedMinim:.75,minim:.5,dottedCrotchet:.375,tripletMinim:.33333334,crotchet:.25,dottedQuaver:.1875,tripletCrotchet:.166666667,quaver:.125,dottedSemiquaver:.09375,tripletQuaver:.083333333,semiquaver:.0625,tripletSemiquaver:.041666667,demisemiquaver:.03125}},{}],9:[function(t,e,n){e.exports={whole:1,dottedHalf:.75,half:.5,dottedQuarter:.375,tripletHalf:.33333334,quarter:.25,dottedEighth:.1875,tripletQuarter:.166666667,eighth:.125,dottedSixteenth:.09375,tripletEighth:.083333333,sixteenth:.0625,tripletSixteenth:.041666667,thirtySecond:.03125}},{}],10:[function(t,e,n){e.exports={C0:16.35,"C#0":17.32,Db0:17.32,D0:18.35,"D#0":19.45,Eb0:19.45,E0:20.6,F0:21.83,"F#0":23.12,Gb0:23.12,G0:24.5,"G#0":25.96,Ab0:25.96,A0:27.5,"A#0":29.14,Bb0:29.14,B0:30.87,C1:32.7,"C#1":34.65,Db1:34.65,D1:36.71,"D#1":38.89,Eb1:38.89,E1:41.2,F1:43.65,"F#1":46.25,Gb1:46.25,G1:49,"G#1":51.91,Ab1:51.91,A1:55,"A#1":58.27,Bb1:58.27,B1:61.74,C2:65.41,"C#2":69.3,Db2:69.3,D2:73.42,"D#2":77.78,Eb2:77.78,E2:82.41,F2:87.31,"F#2":92.5,Gb2:92.5,G2:98,"G#2":103.83,Ab2:103.83,A2:110,"A#2":116.54,Bb2:116.54,B2:123.47,C3:130.81,"C#3":138.59,Db3:138.59,D3:146.83,"D#3":155.56,Eb3:155.56,E3:164.81,F3:174.61,"F#3":185,Gb3:185,G3:196,"G#3":207.65,Ab3:207.65,A3:220,"A#3":233.08,Bb3:233.08,B3:246.94,C4:261.63,"C#4":277.18,Db4:277.18,D4:293.66,"D#4":311.13,Eb4:311.13,E4:329.63,F4:349.23,"F#4":369.99,Gb4:369.99,G4:392,"G#4":415.3,Ab4:415.3,A4:440,"A#4":466.16,Bb4:466.16,B4:493.88,C5:523.25,"C#5":554.37,Db5:554.37,D5:587.33,"D#5":622.25,Eb5:622.25,E5:659.26,F5:698.46,"F#5":739.99,Gb5:739.99,G5:783.99,"G#5":830.61,Ab5:830.61,A5:880,"A#5":932.33,Bb5:932.33,B5:987.77,C6:1046.5,"C#6":1108.73,Db6:1108.73,D6:1174.66,"D#6":1244.51,Eb6:1244.51,E6:1318.51,F6:1396.91,"F#6":1479.98,Gb6:1479.98,G6:1567.98,"G#6":1661.22,Ab6:1661.22,A6:1760,"A#6":1864.66,Bb6:1864.66,B6:1975.53,C7:2093,"C#7":2217.46,Db7:2217.46,D7:2349.32,"D#7":2489.02,Eb7:2489.02,E7:2637.02,F7:2793.83,"F#7":2959.96,Gb7:2959.96,G7:3135.96,"G#7":3322.44,Ab7:3322.44,A7:3520,"A#7":3729.31,Bb7:3729.31,B7:3951.07,C8:4186.01}},{}]},{},[6])(6)},JX7q:function(t,e,n){"use strict";function r(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}n.d(e,"a",(function(){return r}))},Ji7U:function(t,e,n){"use strict";function r(t,e){return(r=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function o(t,e){if("function"!==typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&r(t,e)}n.d(e,"a",(function(){return o}))},Qetd:function(t,e,n){"use strict";var r=Object.assign.bind(Object);t.exports=r,t.exports.default=t.exports},foSv:function(t,e,n){"use strict";function r(t){return(r=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}n.d(e,"a",(function(){return r}))},md7G:function(t,e,n){"use strict";function r(t){return(r="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"===typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}n.d(e,"a",(function(){return i}));var o=n("JX7q");function i(t,e){return!e||"object"!==r(e)&&"function"!==typeof e?Object(o.a)(t):e}},rePB:function(t,e,n){"use strict";function r(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}n.d(e,"a",(function(){return r}))},vuIU:function(t,e,n){"use strict";function r(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function o(t,e,n){return e&&r(t.prototype,e),n&&r(t,n),t}n.d(e,"a",(function(){return o}))},yRsw:function(t,e,n){"use strict";n.r(e);var r=n("1OyB"),o=n("vuIU"),i=n("JX7q"),a=n("Ji7U"),u=n("md7G"),s=n("foSv"),c=n("rePB"),f=n("1YPb"),l=n.n(f),p=n("q1tI"),m=n.n(p).a.createElement;function d(t){var e=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=Object(s.a)(t);if(e){var o=Object(s.a)(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return Object(u.a)(this,n)}}var h=function(t){Object(a.a)(n,t);var e=d(n);function n(t){var o;return Object(r.a)(this,n),o=e.call(this,t),Object(c.a)(Object(i.a)(o),"playHandler",(function(){o.state.player&&o.state.player.stop();var t=new l.a,e=[];o.props.analysis.sections.forEach((function(t){e.push([1e3*t.duration,t.tempo])})),t.setTimeSignature(4,4),t.setTempo(e[0][1]),t.createInstrument("sine").note("quarter","G3"),o.setState({player:t.finish()},(function(){o.state.player.loop(!0),n(e[0][0])}));var n=function n(r){o.state.player.play(),e.shift(),setTimeout((function(){o.state.player.stop(),0!=e.length&&(t.setTempo(e[0][1]),o.setState({player:t.finish()}),o.state.player.loop(!0),n(e[0][0]))}),r)}})),o.state={player:null},o}return Object(o.a)(n,[{key:"render",value:function(){return m("p",{onClick:this.playHandler},"click Me")}}]),n}(p.Component);e.default=h}}]);