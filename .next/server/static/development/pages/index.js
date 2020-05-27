module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = require('../../../ssr-module-cache.js');
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./band.js/dist/band.js":
/*!******************************!*\
  !*** ./band.js/dist/band.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var require;var require;!function (e) {
  if (true) module.exports = e();else { var f; }
}(function () {
  var define, module, exports;
  return function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;
          if (!u && a) return require(o, !0);
          if (i) return i(o, !0);
          throw new Error("Cannot find module '" + o + "'");
        }

        var f = n[o] = {
          exports: {}
        };
        t[o][0].call(f.exports, function (e) {
          var n = t[o][1][e];
          return s(n ? n : e);
        }, f, f.exports, e, t, n, r);
      }

      return n[o].exports;
    }

    var i = typeof require == "function" && require;

    for (var o = 0; o < r.length; o++) s(r[o]);

    return s;
  }({
    1: [function (_dereq_, module, exports) {
      /*
       * Web Audio API AudioContext shim
       */
      (function (definition) {
        if (typeof exports === "object") {
          module.exports = definition();
        }
      })(function () {
        return window.AudioContext || window.webkitAudioContext;
      });
    }, {}],
    2: [function (_dereq_, module, exports) {
      /**
       * Band.js - Music Composer
       * An interface for the Web Audio API that supports rhythms, multiple instruments, repeating sections, and complex
       * time signatures.
       *
       * @author Cody Lundquist (http://github.com/meenie) - 2014
       */
      module.exports = Conductor;
      var packs = {
        instrument: {},
        rhythm: {},
        tuning: {}
      };
      /**
       * Conductor Class - This gets instantiated when `new BandJS()` is called
       *
       * @param tuning
       * @param rhythm
       * @constructor
       */

      function Conductor(tuning, rhythm) {
        if (!tuning) {
          tuning = 'equalTemperament';
        }

        if (!rhythm) {
          rhythm = 'northAmerican';
        }

        if (typeof packs.tuning[tuning] === 'undefined') {
          throw new Error(tuning + ' is not a valid tuning pack.');
        }

        if (typeof packs.rhythm[rhythm] === 'undefined') {
          throw new Error(rhythm + ' is not a valid rhythm pack.');
        }

        var conductor = this,
            player,
            noop = function () {},
            AudioContext = _dereq_('audiocontext'),
            signatureToNoteLengthRatio = {
          2: 6,
          4: 3,
          8: 4.50
        };

        conductor.packs = packs;
        conductor.pitches = packs.tuning[tuning];
        conductor.notes = packs.rhythm[rhythm];
        conductor.audioContext = new AudioContext();
        conductor.masterVolumeLevel = null;
        conductor.masterVolume = conductor.audioContext.createGain();
        conductor.masterVolume.connect(conductor.audioContext.destination);
        conductor.beatsPerBar = null;
        conductor.noteGetsBeat = null;
        conductor.tempo = null;
        conductor.instruments = [];
        conductor.totalDuration = 0;
        conductor.currentSeconds = 0;
        conductor.percentageComplete = 0;
        conductor.noteBufferLength = 20;
        conductor.onTickerCallback = noop;
        conductor.onFinishedCallback = noop;
        conductor.onDurationChangeCallback = noop;
        /**
         * Use JSON to load in a song to be played
         *
         * @param json
         */

        conductor.load = function (json) {
          // Clear out any previous song
          if (conductor.instruments.length > 0) {
            conductor.destroy();
          }

          if (!json) {
            throw new Error('JSON is required for this method to work.');
          } // Need to have at least instruments and notes


          if (typeof json.instruments === 'undefined') {
            throw new Error('You must define at least one instrument');
          }

          if (typeof json.notes === 'undefined') {
            throw new Error('You must define notes for each instrument');
          } // Shall we set a time signature?


          if (typeof json.timeSignature !== 'undefined') {
            conductor.setTimeSignature(json.timeSignature[0], json.timeSignature[1]);
          } // Maybe some tempo?


          if (typeof json.tempo !== 'undefined') {
            conductor.setTempo(json.tempo);
          } // Lets create some instruments


          var instrumentList = {};

          for (var instrument in json.instruments) {
            if (!json.instruments.hasOwnProperty(instrument)) {
              continue;
            }

            instrumentList[instrument] = conductor.createInstrument(json.instruments[instrument].name, json.instruments[instrument].pack);
          } // Now lets add in each of the notes


          for (var inst in json.notes) {
            if (!json.notes.hasOwnProperty(inst)) {
              continue;
            }

            var index = -1;

            while (++index < json.notes[inst].length) {
              var note = json.notes[inst][index]; // Use shorthand if it's a string

              if (typeof note === 'string') {
                var noteParts = note.split('|');

                if ('rest' === noteParts[1]) {
                  instrumentList[inst].rest(noteParts[0]);
                } else {
                  instrumentList[inst].note(noteParts[0], noteParts[1], noteParts[2]);
                } // Otherwise use longhand

              } else {
                if ('rest' === note.type) {
                  instrumentList[inst].rest(note.rhythm);
                } else if ('note' === note.type) {
                  instrumentList[inst].note(note.rhythm, note.pitch, note.tie);
                }
              }
            }
          } // Looks like we are done, lets press it.


          return conductor.finish();
        };
        /**
         * Create a new instrument
         *
         * @param [name] - defaults to sine
         * @param [pack] - defaults to oscillators
         */


        conductor.createInstrument = function (name, pack) {
          var Instrument = _dereq_('./instrument.js'),
              instrument = new Instrument(name, pack, conductor);

          conductor.instruments.push(instrument);
          return instrument;
        };
        /**
         * Needs to be called after all the instruments have been filled with notes.
         * It will figure out the total duration of the song based on the longest
         * duration out of all the instruments.  It will then pass back the Player Object
         * which is used to control the music (play, stop, pause, loop, volume, tempo)
         *
         * It returns the Player object.
         */


        conductor.finish = function () {
          var Player = _dereq_('./player.js');

          player = new Player(conductor);
          return player;
        };
        /**
         * Remove all instruments and recreate AudioContext
         */


        conductor.destroy = function () {
          conductor.audioContext = new AudioContext();
          conductor.instruments.length = 0;
          conductor.masterVolume = conductor.audioContext.createGain();
          conductor.masterVolume.connect(conductor.audioContext.destination);
        };
        /**
         * Set Master Volume
         */


        conductor.setMasterVolume = function (volume) {
          if (volume > 1) {
            volume = volume / 100;
          }

          conductor.masterVolumeLevel = volume;
          conductor.masterVolume.gain.setValueAtTime(volume, conductor.audioContext.currentTime);
        };
        /**
         * Grab the total duration of a song
         *
         * @returns {number}
         */


        conductor.getTotalSeconds = function () {
          return Math.round(conductor.totalDuration);
        };
        /**
         * Sets the ticker callback function. This function will be called
         * every time the current seconds has changed.
         *
         * @param cb function
         */


        conductor.setTickerCallback = function (cb) {
          if (typeof cb !== 'function') {
            throw new Error('Ticker must be a function.');
          }

          conductor.onTickerCallback = cb;
        };
        /**
         * Sets the time signature for the music. Just like in notation 4/4 time would be setTimeSignature(4, 4);
         * @param top - Number of beats per bar
         * @param bottom - What note type has the beat
         */


        conductor.setTimeSignature = function (top, bottom) {
          if (typeof signatureToNoteLengthRatio[bottom] === 'undefined') {
            throw new Error('The bottom time signature is not supported.');
          } // Not used at the moment, but will be handy in the future.


          conductor.beatsPerBar = top;
          conductor.noteGetsBeat = signatureToNoteLengthRatio[bottom];
        };
        /**
         * Sets the tempo
         *
         * @param t
         */


        conductor.setTempo = function (t) {
          conductor.tempo = 60 / t; // If we have a player instance, we need to recalculate duration after resetting the tempo.

          if (player) {
            player.resetTempo();
            conductor.onDurationChangeCallback();
          }
        };
        /**
         * Set a callback to fire when the song is finished
         *
         * @param cb
         */


        conductor.setOnFinishedCallback = function (cb) {
          if (typeof cb !== 'function') {
            throw new Error('onFinished callback must be a function.');
          }

          conductor.onFinishedCallback = cb;
        };
        /**
         * Set a callback to fire when duration of a song changes
         *
         * @param cb
         */


        conductor.setOnDurationChangeCallback = function (cb) {
          if (typeof cb !== 'function') {
            throw new Error('onDurationChanged callback must be a function.');
          }

          conductor.onDurationChangeCallback = cb;
        };
        /**
         * Set the number of notes that are buffered every (tempo / 60 * 5) seconds.
         * It's set to 20 notes by default.
         *
         * **WARNING** The higher this is, the more memory is used and can crash your browser.
         *             If notes are being dropped, you can increase this, but be weary of
         *             used memory.
         *
         * @param {Integer} len
         */


        conductor.setNoteBufferLength = function (len) {
          conductor.noteBufferLength = len;
        };

        conductor.setMasterVolume(100);
        conductor.setTempo(120);
        conductor.setTimeSignature(4, 4);
      }

      Conductor.loadPack = function (type, name, data) {
        if (['tuning', 'rhythm', 'instrument'].indexOf(type) === -1) {
          throw new Error(type + ' is not a valid Pack Type.');
        }

        if (typeof packs[type][name] !== 'undefined') {
          throw new Error('A(n) ' + type + ' pack with the name "' + name + '" has already been loaded.');
        }

        packs[type][name] = data;
      };
    }, {
      "./instrument.js": 5,
      "./player.js": 7,
      "audiocontext": 1
    }],
    3: [function (_dereq_, module, exports) {
      /**
       * Band.js - Music Composer
       * An interface for the Web Audio API that supports rhythms, multiple instruments, repeating sections, and complex
       * time signatures.
       *
       * @author Cody Lundquist (http://github.com/meenie) - 2014
       */
      module.exports = NoisesInstrumentPack;
      /**
       * Noises Instrument Pack
       *
       * Adapted from: https://github.com/zacharydenton/noise.js
       *
       * @param name
       * @param audioContext
       * @returns {{createNote: createNote}}
       * @constructor
       */

      function NoisesInstrumentPack(name, audioContext) {
        var types = ['white', 'pink', 'brown', 'brownian', 'red'];

        if (types.indexOf(name) === -1) {
          throw new Error(name + ' is not a valid noise sound');
        }

        return {
          createNote: function (destination) {
            switch (name) {
              case 'white':
                return createWhiteNoise(destination);

              case 'pink':
                return createPinkNoise(destination);

              case 'brown':
              case 'brownian':
              case 'red':
                return createBrownianNoise(destination);
            }
          }
        };

        function createWhiteNoise(destination) {
          var bufferSize = 2 * audioContext.sampleRate,
              noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate),
              output = noiseBuffer.getChannelData(0);

          for (var i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }

          var whiteNoise = audioContext.createBufferSource();
          whiteNoise.buffer = noiseBuffer;
          whiteNoise.loop = true;
          whiteNoise.connect(destination);
          return whiteNoise;
        }

        function createPinkNoise(destination) {
          var bufferSize = 2 * audioContext.sampleRate,
              noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate),
              output = noiseBuffer.getChannelData(0),
              b0,
              b1,
              b2,
              b3,
              b4,
              b5,
              b6;
          b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;

          for (var i = 0; i < bufferSize; i++) {
            var white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            output[i] *= 0.11;
            b6 = white * 0.115926;
          }

          var pinkNoise = audioContext.createBufferSource();
          pinkNoise.buffer = noiseBuffer;
          pinkNoise.loop = true;
          pinkNoise.connect(destination);
          return pinkNoise;
        }

        function createBrownianNoise(destination) {
          var bufferSize = 2 * audioContext.sampleRate,
              noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate),
              output = noiseBuffer.getChannelData(0),
              lastOut = 0.0;

          for (var i = 0; i < bufferSize; i++) {
            var white = Math.random() * 2 - 1;
            output[i] = (lastOut + 0.02 * white) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
          }

          var brownianNoise = audioContext.createBufferSource();
          brownianNoise.buffer = noiseBuffer;
          brownianNoise.loop = true;
          brownianNoise.connect(destination);
          return brownianNoise;
        }
      }
    }, {}],
    4: [function (_dereq_, module, exports) {
      /**
       * Band.js - Music Composer
       * An interface for the Web Audio API that supports rhythms, multiple instruments, repeating sections, and complex
       * time signatures.
       *
       * @author Cody Lundquist (http://github.com/meenie) - 2014
       */
      module.exports = OscillatorInstrumentPack;
      /**
       * Oscillator Instrument Pack
       *
       * @param name
       * @param audioContext
       * @returns {{createNote: createNote}}
       * @constructor
       */

      function OscillatorInstrumentPack(name, audioContext) {
        var types = ['sine', 'square', 'sawtooth', 'triangle'];

        if (types.indexOf(name) === -1) {
          throw new Error(name + ' is not a valid Oscillator type');
        }

        return {
          createNote: function (destination, frequency) {
            var o = audioContext.createOscillator(); // Connect note to volume

            o.connect(destination); // Set pitch type

            o.type = name; // Set frequency

            o.frequency.value = frequency;
            return o;
          }
        };
      }
    }, {}],
    5: [function (_dereq_, module, exports) {
      /**
       * Band.js - Music Composer
       * An interface for the Web Audio API that supports rhythms, multiple instruments, repeating sections, and complex
       * time signatures.
       *
       * @author Cody Lundquist (http://github.com/meenie) - 2014
       */
      module.exports = Instrument;
      /**
       * Instrument Class - Gets instantiated when `Conductor.createInstrument()` is called.
       *
       * @param name
       * @param pack
       * @param conductor
       * @constructor
       */

      function Instrument(name, pack, conductor) {
        // Default to Sine Oscillator
        if (!name) {
          name = 'sine';
        }

        if (!pack) {
          pack = 'oscillators';
        }

        if (typeof conductor.packs.instrument[pack] === 'undefined') {
          throw new Error(pack + ' is not a currently loaded Instrument Pack.');
        }
        /**
         * Helper function to figure out how long a note is
         *
         * @param rhythm
         * @returns {number}
         */


        function getDuration(rhythm) {
          if (typeof conductor.notes[rhythm] === 'undefined') {
            throw new Error(rhythm + ' is not a correct rhythm.');
          }

          return conductor.notes[rhythm] * conductor.tempo / conductor.noteGetsBeat * 10;
        }
        /**
         * Helper function to clone an object
         *
         * @param obj
         * @returns {copy}
         */


        function clone(obj) {
          if (null === obj || "object" != typeof obj) {
            return obj;
          }

          var copy = obj.constructor();

          for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
              copy[attr] = obj[attr];
            }
          }

          return copy;
        }

        var instrument = this,
            lastRepeatCount = 0,
            volumeLevel = 1,
            articulationGapPercentage = 0.05;
        instrument.totalDuration = 0;
        instrument.bufferPosition = 0;
        instrument.instrument = conductor.packs.instrument[pack](name, conductor.audioContext);
        instrument.notes = [];
        /**
         * Set volume level for an instrument
         *
         * @param newVolumeLevel
         */

        instrument.setVolume = function (newVolumeLevel) {
          if (newVolumeLevel > 1) {
            newVolumeLevel = newVolumeLevel / 100;
          }

          volumeLevel = newVolumeLevel;
          return instrument;
        };
        /**
         * Add a note to an instrument
         * @param rhythm
         * @param [pitch] - Comma separated string if more than one pitch
         * @param [tie]
         */


        instrument.note = function (rhythm, pitch, tie) {
          var duration = getDuration(rhythm),
              articulationGap = tie ? 0 : duration * articulationGapPercentage;

          if (pitch) {
            pitch = pitch.split(',');
            var index = -1;

            while (++index < pitch.length) {
              var p = pitch[index];
              p = p.trim();

              if (typeof conductor.pitches[p] === 'undefined') {
                p = parseFloat(p);

                if (isNaN(p) || p < 0) {
                  throw new Error(p + ' is not a valid pitch.');
                }
              }
            }
          }

          instrument.notes.push({
            rhythm: rhythm,
            pitch: pitch,
            duration: duration,
            articulationGap: articulationGap,
            tie: tie,
            startTime: instrument.totalDuration,
            stopTime: instrument.totalDuration + duration - articulationGap,
            // Volume needs to be a quarter of the master so it doesn't clip
            volumeLevel: volumeLevel / 4
          });
          instrument.totalDuration += duration;
          return instrument;
        };
        /**
         * Add a rest to an instrument
         *
         * @param rhythm
         */


        instrument.rest = function (rhythm) {
          var duration = getDuration(rhythm);
          instrument.notes.push({
            rhythm: rhythm,
            pitch: false,
            duration: duration,
            articulationGap: 0,
            startTime: instrument.totalDuration,
            stopTime: instrument.totalDuration + duration
          });
          instrument.totalDuration += duration;
          return instrument;
        };
        /**
         * Place where a repeat section should start
         */


        instrument.repeatStart = function () {
          lastRepeatCount = instrument.notes.length;
          return instrument;
        };
        /**
         * Repeat from beginning
         */


        instrument.repeatFromBeginning = function (numOfRepeats) {
          lastRepeatCount = 0;
          instrument.repeat(numOfRepeats);
          return instrument;
        };
        /**
         * Number of times the section should repeat
         * @param [numOfRepeats] - defaults to 1
         */


        instrument.repeat = function (numOfRepeats) {
          numOfRepeats = typeof numOfRepeats === 'undefined' ? 1 : numOfRepeats;
          var notesBufferCopy = instrument.notes.slice(lastRepeatCount);

          for (var r = 0; r < numOfRepeats; r++) {
            var index = -1;

            while (++index < notesBufferCopy.length) {
              var noteCopy = clone(notesBufferCopy[index]);
              noteCopy.startTime = instrument.totalDuration;
              noteCopy.stopTime = instrument.totalDuration + noteCopy.duration - noteCopy.articulationGap;
              instrument.notes.push(noteCopy);
              instrument.totalDuration += noteCopy.duration;
            }
          }

          return instrument;
        };
        /**
         * Reset the duration, start, and stop time of each note.
         */


        instrument.resetDuration = function () {
          var index = -1,
              numOfNotes = instrument.notes.length;
          instrument.totalDuration = 0;

          while (++index < numOfNotes) {
            var note = instrument.notes[index],
                duration = getDuration(note.rhythm),
                articulationGap = note.tie ? 0 : duration * articulationGapPercentage;
            note.duration = getDuration(note.rhythm);
            note.startTime = instrument.totalDuration;
            note.stopTime = instrument.totalDuration + duration - articulationGap;

            if (note.pitch !== false) {
              note.articulationGap = articulationGap;
            }

            instrument.totalDuration += duration;
          }
        };
      }
    }, {}],
    6: [function (_dereq_, module, exports) {
      /**
       * Band.js - Music Composer
       * An interface for the Web Audio API that supports rhythms, multiple instruments, repeating sections, and complex
       * time signatures.
       *
       * @author Cody Lundquist (http://github.com/meenie) - 2014
       */

      /**
       * @type {BandJS}
       */
      module.exports = _dereq_('./conductor.js');
      module.exports.loadPack('instrument', 'noises', _dereq_('./instrument-packs/noises.js'));
      module.exports.loadPack('instrument', 'oscillators', _dereq_('./instrument-packs/oscillators.js'));
      module.exports.loadPack('rhythm', 'northAmerican', _dereq_('./rhythm-packs/north-american.js'));
      module.exports.loadPack('rhythm', 'european', _dereq_('./rhythm-packs/european.js'));
      module.exports.loadPack('tuning', 'equalTemperament', _dereq_('./tuning-packs/equal-temperament.js'));
    }, {
      "./conductor.js": 2,
      "./instrument-packs/noises.js": 3,
      "./instrument-packs/oscillators.js": 4,
      "./rhythm-packs/european.js": 8,
      "./rhythm-packs/north-american.js": 9,
      "./tuning-packs/equal-temperament.js": 10
    }],
    7: [function (_dereq_, module, exports) {
      /**
       * Band.js - Music Composer
       * An interface for the Web Audio API that supports rhythms, multiple instruments, repeating sections, and complex
       * time signatures.
       *
       * @author Cody Lundquist (http://github.com/meenie) - 2014
       */
      module.exports = Player;
      /**
       * Player Class - This gets instantiated by the Conductor class when `Conductor.finish()` is called
       *
       * @param conductor
       * @constructor
       */

      function Player(conductor) {
        var player = this,
            bufferTimeout,
            allNotes = bufferNotes(),
            currentPlayTime,
            totalPlayTime = 0,
            faded = false;
        calculateTotalDuration();
        /**
         * Helper function to stop all notes and
         * then re-buffers them
         *
         * @param {Boolean} [resetDuration]
         */

        function reset(resetDuration) {
          // Reset the buffer position of all instruments
          var index = -1,
              numOfInstruments = conductor.instruments.length;

          while (++index < numOfInstruments) {
            var instrument = conductor.instruments[index];

            if (resetDuration) {
              instrument.resetDuration();
            }

            instrument.bufferPosition = 0;
          } // If we are reseting the duration, we need to figure out the new total duration.
          // Also set the totalPlayTime to the current percentage done of the new total duration.


          if (resetDuration) {
            calculateTotalDuration();
            totalPlayTime = conductor.percentageComplete * conductor.totalDuration;
          }

          index = -1;

          while (++index < allNotes.length) {
            allNotes[index].gain.disconnect();
          }

          clearTimeout(bufferTimeout);
          allNotes = bufferNotes();
        }
        /**
         * Helper function to fade up/down master volume
         *
         * @param direction - up or down
         * @param [cb] - Callback function fired after the transition is completed
         * @param [resetVolume] - Reset the volume back to it's original level
         */


        function fade(direction, cb, resetVolume) {
          if (typeof resetVolume === 'undefined') {
            resetVolume = false;
          }

          if ('up' !== direction && 'down' !== direction) {
            throw new Error('Direction must be either up or down.');
          }

          var fadeDuration = 0.2;
          faded = direction === 'down';

          if (direction === 'up') {
            conductor.masterVolume.gain.linearRampToValueAtTime(0, conductor.audioContext.currentTime);
            conductor.masterVolume.gain.linearRampToValueAtTime(conductor.masterVolumeLevel, conductor.audioContext.currentTime + fadeDuration);
          } else {
            conductor.masterVolume.gain.linearRampToValueAtTime(conductor.masterVolumeLevel, conductor.audioContext.currentTime);
            conductor.masterVolume.gain.linearRampToValueAtTime(0, conductor.audioContext.currentTime + fadeDuration);
          }

          setTimeout(function () {
            if (typeof cb === 'function') {
              cb.call(player);
            }

            if (resetVolume) {
              faded = !faded;
              conductor.masterVolume.gain.linearRampToValueAtTime(conductor.masterVolumeLevel, conductor.audioContext.currentTime);
            }
          }, fadeDuration * 1000);
        }
        /**
         * Calculates the total duration of a song based on the longest duration of all instruments.
         */


        function calculateTotalDuration() {
          var index = -1;
          var totalDuration = 0;

          while (++index < conductor.instruments.length) {
            var instrument = conductor.instruments[index];

            if (instrument.totalDuration > totalDuration) {
              totalDuration = instrument.totalDuration;
            }
          }

          conductor.totalDuration = totalDuration;
        }
        /**
         * Grabs a set of notes based on the current time and what the Buffer Size is.
         * It will also skip any notes that have a start time less than the
         * total play time.
         *
         * @returns {Array}
         */


        function bufferNotes() {
          var notes = [],
              index = -1,
              bufferSize = conductor.noteBufferLength;

          while (++index < conductor.instruments.length) {
            var instrument = conductor.instruments[index]; // Create volume for this instrument

            var bufferCount = bufferSize;
            var index2 = -1;

            while (++index2 < bufferCount) {
              var note = instrument.notes[instrument.bufferPosition + index2];

              if (typeof note === 'undefined') {
                break;
              }

              var pitch = note.pitch,
                  startTime = note.startTime,
                  stopTime = note.stopTime,
                  volumeLevel = note.volumeLevel;

              if (stopTime < totalPlayTime) {
                bufferCount++;
                continue;
              } // If pitch is false, then it's a rest and we don't need a note


              if (false === pitch) {
                continue;
              }

              var gain = conductor.audioContext.createGain(); // Connect volume gain to the Master Volume;

              gain.connect(conductor.masterVolume);
              gain.gain.value = volumeLevel; // If the startTime is less than total play time, we need to start the note
              // in the middle

              if (startTime < totalPlayTime) {
                startTime = stopTime - totalPlayTime;
              } // No pitches defined


              if (typeof pitch === 'undefined') {
                notes.push({
                  startTime: startTime < totalPlayTime ? stopTime - totalPlayTime : startTime,
                  stopTime: stopTime,
                  node: instrument.instrument.createNote(gain),
                  gain: gain,
                  volumeLevel: volumeLevel
                });
              } else {
                var index3 = -1;

                while (++index3 < pitch.length) {
                  var p = pitch[index3];
                  notes.push({
                    startTime: startTime,
                    stopTime: stopTime,
                    node: instrument.instrument.createNote(gain, conductor.pitches[p.trim()] || parseFloat(p)),
                    gain: gain,
                    volumeLevel: volumeLevel
                  });
                }
              }
            }

            instrument.bufferPosition += bufferCount;
          } // Return array of notes


          return notes;
        }

        function totalPlayTimeCalculator() {
          if (!player.paused && player.playing) {
            if (conductor.totalDuration < totalPlayTime) {
              player.stop(false);

              if (player.looping) {
                player.play();
              } else {
                conductor.onFinishedCallback();
              }
            } else {
              updateTotalPlayTime();
              setTimeout(totalPlayTimeCalculator, 1000 / 60);
            }
          }
        }
        /**
         * Call to update the total play time so far
         */


        function updateTotalPlayTime() {
          totalPlayTime += conductor.audioContext.currentTime - currentPlayTime;
          var seconds = Math.round(totalPlayTime);

          if (seconds != conductor.currentSeconds) {
            // Make callback asynchronous
            setTimeout(function () {
              conductor.onTickerCallback(seconds);
            }, 1);
            conductor.currentSeconds = seconds;
          }

          conductor.percentageComplete = totalPlayTime / conductor.totalDuration;
          currentPlayTime = conductor.audioContext.currentTime;
        }

        player.paused = false;
        player.playing = false;
        player.looping = false;
        player.muted = false;
        /**
         * Grabs currently buffered notes and calls their start/stop methods.
         *
         * It then sets up a timer to buffer up the next set of notes based on the
         * a set buffer size.  This will keep going until the song is stopped or paused.
         *
         * It will use the total time played so far as an offset so you pause/play the music
         */

        player.play = function () {
          player.playing = true;
          player.paused = false;
          currentPlayTime = conductor.audioContext.currentTime; // Starts calculator which keeps track of total play time

          totalPlayTimeCalculator();

          var timeOffset = conductor.audioContext.currentTime - totalPlayTime,
              playNotes = function (notes) {
            var index = -1;

            while (++index < notes.length) {
              var note = notes[index];
              var startTime = note.startTime + timeOffset,
                  stopTime = note.stopTime + timeOffset;
              /**
               * If no tie, then we need to introduce a volume ramp up to remove any clipping
               * as Oscillators have an issue with this when playing a note at full volume.
               * We also put in a slight ramp down as well.  This only takes up 1/1000 of a second.
               */

              if (!note.tie) {
                if (startTime > 0) {
                  startTime -= 0.001;
                }

                stopTime += 0.001;
                note.gain.gain.setValueAtTime(0.0, startTime);
                note.gain.gain.linearRampToValueAtTime(note.volumeLevel, startTime + 0.001);
                note.gain.gain.setValueAtTime(note.volumeLevel, stopTime - 0.001);
                note.gain.gain.linearRampToValueAtTime(0.0, stopTime);
              }

              note.node.start(startTime);
              note.node.stop(stopTime);
            }
          },
              bufferUp = function () {
            bufferTimeout = setTimeout(function bufferInNewNotes() {
              if (player.playing && !player.paused) {
                var newNotes = bufferNotes();

                if (newNotes.length > 0) {
                  playNotes(newNotes);
                  allNotes = allNotes.concat(newNotes);
                  bufferUp();
                }
              }
            }, conductor.tempo * 5000);
          };

          playNotes(allNotes);
          bufferUp();

          if (faded && !player.muted) {
            fade('up');
          }
        };
        /**
         * Stop playing all music and rewind the song
         *
         * @param fadeOut boolean - should the song fade out?
         */


        player.stop = function (fadeOut) {
          player.playing = false;
          conductor.currentSeconds = 0;
          conductor.percentageComplete = 0;

          if (typeof fadeOut === 'undefined') {
            fadeOut = true;
          }

          if (fadeOut && !player.muted) {
            fade('down', function () {
              totalPlayTime = 0;
              reset(); // Make callback asynchronous

              setTimeout(function () {
                conductor.onTickerCallback(conductor.currentSeconds);
              }, 1);
            }, true);
          } else {
            totalPlayTime = 0;
            reset(); // Make callback asynchronous

            setTimeout(function () {
              conductor.onTickerCallback(conductor.currentSeconds);
            }, 1);
          }
        };
        /**
         * Pauses the music, resets the notes,
         * and gets the total time played so far
         */


        player.pause = function () {
          player.paused = true;
          updateTotalPlayTime();

          if (player.muted) {
            reset();
          } else {
            fade('down', function () {
              reset();
            });
          }
        };
        /**
         * Set true if you want the song to loop
         *
         * @param val
         */


        player.loop = function (val) {
          player.looping = !!val;
        };
        /**
         * Set a specific time that the song should start it.
         * If it's already playing, reset and start the song
         * again so it has a seamless jump.
         *
         * @param newTime
         */


        player.setTime = function (newTime) {
          totalPlayTime = parseInt(newTime);
          reset();

          if (player.playing && !player.paused) {
            player.play();
          }
        };
        /**
         * Reset the tempo for a song. This will trigger a
         * duration reset for each instrument as well.
         */


        player.resetTempo = function () {
          reset(true);

          if (player.playing && !player.paused) {
            player.play();
          }
        };
        /**
         * Mute all of the music
         *
         * @param cb - Callback function called when music has been muted
         */


        player.mute = function (cb) {
          player.muted = true;
          fade('down', cb);
        };
        /**
         * Unmute all of the music
         *
         * @param cb - Callback function called when music has been unmuted
         */


        player.unmute = function (cb) {
          player.muted = false;
          fade('up', cb);
        };
      }
    }, {}],
    8: [function (_dereq_, module, exports) {
      /**
       * Band.js - Music Composer
       * An interface for the Web Audio API that supports rhythms, multiple instruments, repeating sections, and complex
       * time signatures.
       *
       * @author Cody Lundquist (http://github.com/meenie) - 2014
       */

      /**
       * European Rhythm Pack
       */
      module.exports = {
        semibreve: 1,
        dottedMinim: 0.75,
        minim: 0.5,
        dottedCrotchet: 0.375,
        tripletMinim: 0.33333334,
        crotchet: 0.25,
        dottedQuaver: 0.1875,
        tripletCrotchet: 0.166666667,
        quaver: 0.125,
        dottedSemiquaver: 0.09375,
        tripletQuaver: 0.083333333,
        semiquaver: 0.0625,
        tripletSemiquaver: 0.041666667,
        demisemiquaver: 0.03125
      };
    }, {}],
    9: [function (_dereq_, module, exports) {
      /**
       * Band.js - Music Composer
       * An interface for the Web Audio API that supports rhythms, multiple instruments, repeating sections, and complex
       * time signatures.
       *
       * @author Cody Lundquist (http://github.com/meenie) - 2014
       */

      /**
       * North American (Canada and USA) Rhythm Pack
       */
      module.exports = {
        whole: 1,
        dottedHalf: 0.75,
        half: 0.5,
        dottedQuarter: 0.375,
        tripletHalf: 0.33333334,
        quarter: 0.25,
        dottedEighth: 0.1875,
        tripletQuarter: 0.166666667,
        eighth: 0.125,
        dottedSixteenth: 0.09375,
        tripletEighth: 0.083333333,
        sixteenth: 0.0625,
        tripletSixteenth: 0.041666667,
        thirtySecond: 0.03125
      };
    }, {}],
    10: [function (_dereq_, module, exports) {
      /**
       * Band.js - Music Composer
       * An interface for the Web Audio API that supports rhythms, multiple instruments, repeating sections, and complex
       * time signatures.
       *
       * @author Cody Lundquist (http://github.com/meenie) - 2014
       */

      /**
       * Equal Temperament Tuning
       * Source: http://www.phy.mtu.edu/~suits/notefreqs.html
       */
      module.exports = {
        'C0': 16.35,
        'C#0': 17.32,
        'Db0': 17.32,
        'D0': 18.35,
        'D#0': 19.45,
        'Eb0': 19.45,
        'E0': 20.60,
        'F0': 21.83,
        'F#0': 23.12,
        'Gb0': 23.12,
        'G0': 24.50,
        'G#0': 25.96,
        'Ab0': 25.96,
        'A0': 27.50,
        'A#0': 29.14,
        'Bb0': 29.14,
        'B0': 30.87,
        'C1': 32.70,
        'C#1': 34.65,
        'Db1': 34.65,
        'D1': 36.71,
        'D#1': 38.89,
        'Eb1': 38.89,
        'E1': 41.20,
        'F1': 43.65,
        'F#1': 46.25,
        'Gb1': 46.25,
        'G1': 49.00,
        'G#1': 51.91,
        'Ab1': 51.91,
        'A1': 55.00,
        'A#1': 58.27,
        'Bb1': 58.27,
        'B1': 61.74,
        'C2': 65.41,
        'C#2': 69.30,
        'Db2': 69.30,
        'D2': 73.42,
        'D#2': 77.78,
        'Eb2': 77.78,
        'E2': 82.41,
        'F2': 87.31,
        'F#2': 92.50,
        'Gb2': 92.50,
        'G2': 98.00,
        'G#2': 103.83,
        'Ab2': 103.83,
        'A2': 110.00,
        'A#2': 116.54,
        'Bb2': 116.54,
        'B2': 123.47,
        'C3': 130.81,
        'C#3': 138.59,
        'Db3': 138.59,
        'D3': 146.83,
        'D#3': 155.56,
        'Eb3': 155.56,
        'E3': 164.81,
        'F3': 174.61,
        'F#3': 185.00,
        'Gb3': 185.00,
        'G3': 196.00,
        'G#3': 207.65,
        'Ab3': 207.65,
        'A3': 220.00,
        'A#3': 233.08,
        'Bb3': 233.08,
        'B3': 246.94,
        'C4': 261.63,
        'C#4': 277.18,
        'Db4': 277.18,
        'D4': 293.66,
        'D#4': 311.13,
        'Eb4': 311.13,
        'E4': 329.63,
        'F4': 349.23,
        'F#4': 369.99,
        'Gb4': 369.99,
        'G4': 392.00,
        'G#4': 415.30,
        'Ab4': 415.30,
        'A4': 440.00,
        'A#4': 466.16,
        'Bb4': 466.16,
        'B4': 493.88,
        'C5': 523.25,
        'C#5': 554.37,
        'Db5': 554.37,
        'D5': 587.33,
        'D#5': 622.25,
        'Eb5': 622.25,
        'E5': 659.26,
        'F5': 698.46,
        'F#5': 739.99,
        'Gb5': 739.99,
        'G5': 783.99,
        'G#5': 830.61,
        'Ab5': 830.61,
        'A5': 880.00,
        'A#5': 932.33,
        'Bb5': 932.33,
        'B5': 987.77,
        'C6': 1046.50,
        'C#6': 1108.73,
        'Db6': 1108.73,
        'D6': 1174.66,
        'D#6': 1244.51,
        'Eb6': 1244.51,
        'E6': 1318.51,
        'F6': 1396.91,
        'F#6': 1479.98,
        'Gb6': 1479.98,
        'G6': 1567.98,
        'G#6': 1661.22,
        'Ab6': 1661.22,
        'A6': 1760.00,
        'A#6': 1864.66,
        'Bb6': 1864.66,
        'B6': 1975.53,
        'C7': 2093.00,
        'C#7': 2217.46,
        'Db7': 2217.46,
        'D7': 2349.32,
        'D#7': 2489.02,
        'Eb7': 2489.02,
        'E7': 2637.02,
        'F7': 2793.83,
        'F#7': 2959.96,
        'Gb7': 2959.96,
        'G7': 3135.96,
        'G#7': 3322.44,
        'Ab7': 3322.44,
        'A7': 3520.00,
        'A#7': 3729.31,
        'Bb7': 3729.31,
        'B7': 3951.07,
        'C8': 4186.01
      };
    }, {}]
  }, {}, [6])(6);
});

/***/ }),

/***/ "./pages/Audio.js":
/*!************************!*\
  !*** ./pages/Audio.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _band_js_dist_band__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../band.js/dist/band */ "./band.js/dist/band.js");
/* harmony import */ var _band_js_dist_band__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_band_js_dist_band__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
var _jsxFileName = "C:\\Users\\hillel nagid\\Desktop\\rhythm\\pages\\Audio.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class Audio extends react__WEBPACK_IMPORTED_MODULE_1__["Component"] {
  constructor(props) {
    super(props);

    _defineProperty(this, "playHandler", () => {
      if (this.state.player) {
        console.log(this.state.player);
        this.state.player.stop();
      }

      let conductor = new _band_js_dist_band__WEBPACK_IMPORTED_MODULE_0___default.a();
      let sectionsProps = [];
      this.props.analysis.sections.forEach(section => {
        sectionsProps.push([section.duration * 1000, section.tempo]);
      });
      console.log(sectionsProps);
      conductor.setTimeSignature(4, 4);
      conductor.setTempo(sectionsProps[0][1]);
      let piano = conductor.createInstrument('sine');
      piano.note('quarter', 'G3');
      this.setState({
        player: conductor.finish()
      });
      console.log(this.state.player);
      this.state.player.loop(true);
      rhythmTimer(sectionsProps[0][0]);

      function rhythmTimer(time) {
        this.state.player.play();
        sectionsProps.shift();
        setTimeout(() => {
          this.state.player.stop();

          if (sectionsProps.length != 0) {
            conductor.setTempo(sectionsProps[0][1]);
            this.setState({
              player: conductor.finish()
            });
            this.state.player.loop(true);
            rhythmTimer(sectionsProps[0][0]);
          }
        }, time);
      }
    });

    this.state = {
      player: ''
    };
  }

  render() {
    return __jsx("p", {
      onClick: this.playHandler,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 43,
        columnNumber: 10
      }
    }, "click Me");
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Audio);

/***/ }),

/***/ "./pages/TracksResults.js":
/*!********************************!*\
  !*** ./pages/TracksResults.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "axios");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Audio__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Audio */ "./pages/Audio.js");
var _jsxFileName = "C:\\Users\\hillel nagid\\Desktop\\rhythm\\pages\\TracksResults.js";

var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;



const TracksResults = props => {
  const trackRef = react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();
  let analysis;
  let [sa, sas] = react__WEBPACK_IMPORTED_MODULE_0___default.a.useState(analysis);

  let getAnalysis = e => {
    axios__WEBPACK_IMPORTED_MODULE_1___default.a.get('https://api.spotify.com/v1/audio-analysis/' + e.target.id, {
      headers: {
        Authorization: props.authorization
      }
    }).then(data => {
      sas(data.data);
      console.log(analysis);
    }).catch(err => {
      console.log(err);
    });
  };

  return __jsx("ul", {
    ref: trackRef,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25,
      columnNumber: 3
    }
  }, props.tracks.map(track => {
    return __jsx("li", {
      id: track.id,
      key: track.id,
      onClick: getAnalysis,
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 28,
        columnNumber: 6
      }
    }, track.name, " - ", track.artists[0].name, " (", track.popularity, ")");
  }), __jsx(_Audio__WEBPACK_IMPORTED_MODULE_2__["default"], {
    analysis: sa,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 34,
      columnNumber: 4
    }
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (TracksResults);

/***/ }),

/***/ "./pages/index.js":
/*!************************!*\
  !*** ./pages/index.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-jsx/style */ "styled-jsx/style");
/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(styled_jsx_style__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _rhythm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./rhythm */ "./pages/rhythm.js");
var _jsxFileName = "C:\\Users\\hillel nagid\\Desktop\\rhythm\\pages\\index.js";

var __jsx = react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement;



class Default extends react__WEBPACK_IMPORTED_MODULE_1__["Component"] {
  render() {
    return __jsx("div", {
      className: "jsx-2218756941" + " " + 'app',
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 7,
        columnNumber: 4
      }
    }, __jsx("h1", {
      className: "jsx-2218756941",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 8,
        columnNumber: 5
      }
    }, "Rhythm Detector"), __jsx("h2", {
      className: "jsx-2218756941",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 9,
        columnNumber: 5
      }
    }, "Select your song at the search bar below"), __jsx(_rhythm__WEBPACK_IMPORTED_MODULE_2__["default"], {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 10,
        columnNumber: 5
      }
    }), __jsx(styled_jsx_style__WEBPACK_IMPORTED_MODULE_0___default.a, {
      id: "140836683",
      __self: this
    }, "body,html,#root{margin:0;height:100%;}*:active,*:focus{outline-style:none;}*{box-sizing:border-box;}#__next{display:grid;background:linear-gradient(to right,#141e30,#243b55);height:100%;width:100%;justify-items:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;max-height:100%;}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcaGlsbGVsIG5hZ2lkXFxEZXNrdG9wXFxyaHl0aG1cXHBhZ2VzXFxpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFZTSxBQUtpQixBQUtVLEFBR0csQUFHVCxTQVZELElBVzJDLE1BTnhELEVBSkEsQ0FPQSw0Q0FJYSxZQUNELFdBQ1UscUJBQ0YsNkZBQ0gsZ0JBQ2pCIiwiZmlsZSI6IkM6XFxVc2Vyc1xcaGlsbGVsIG5hZ2lkXFxEZXNrdG9wXFxyaHl0aG1cXHBhZ2VzXFxpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBSaHl0aG0gZnJvbSAnLi9yaHl0aG0nO1xyXG5cclxuY2xhc3MgRGVmYXVsdCBleHRlbmRzIENvbXBvbmVudCB7XHJcblx0cmVuZGVyKCkge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2FwcCc+XHJcblx0XHRcdFx0PGgxPlJoeXRobSBEZXRlY3RvcjwvaDE+XHJcblx0XHRcdFx0PGgyPlNlbGVjdCB5b3VyIHNvbmcgYXQgdGhlIHNlYXJjaCBiYXIgYmVsb3c8L2gyPlxyXG5cdFx0XHRcdDxSaHl0aG0+PC9SaHl0aG0+XHJcblx0XHRcdFx0ey8qXHQ8aW5wdXQgdHlwZT0ndGV4dCcgLz4qL31cclxuXHRcdFx0XHQ8c3R5bGUgZ2xvYmFsIGpzeD5cclxuXHRcdFx0XHRcdHtgXHJcblx0XHRcdFx0XHRcdGJvZHksXHJcblx0XHRcdFx0XHRcdGh0bWwsXHJcblx0XHRcdFx0XHRcdCNyb290IHtcclxuXHRcdFx0XHRcdFx0XHRtYXJnaW46IDA7XHJcblx0XHRcdFx0XHRcdFx0aGVpZ2h0OiAxMDAlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdCo6YWN0aXZlLFxyXG5cdFx0XHRcdFx0XHQqOmZvY3VzIHtcclxuXHRcdFx0XHRcdFx0XHRvdXRsaW5lLXN0eWxlOiBub25lO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdCoge1xyXG5cdFx0XHRcdFx0XHRcdGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0I19fbmV4dCB7XHJcblx0XHRcdFx0XHRcdFx0ZGlzcGxheTogZ3JpZDtcclxuXHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsICMxNDFlMzAsICMyNDNiNTUpO1xyXG5cdFx0XHRcdFx0XHRcdGhlaWdodDogMTAwJTtcclxuXHRcdFx0XHRcdFx0XHR3aWR0aDogMTAwJTtcclxuXHRcdFx0XHRcdFx0XHRqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XHJcblx0XHRcdFx0XHRcdFx0YWxpZ24taXRlbXM6IGNlbnRlcjtcclxuXHRcdFx0XHRcdFx0XHRtYXgtaGVpZ2h0OiAxMDAlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRgfVxyXG5cdFx0XHRcdDwvc3R5bGU+XHJcblx0XHRcdFx0PHN0eWxlIGpzeD57YFxyXG5cdFx0XHRcdFx0aDEge1xyXG5cdFx0XHRcdFx0XHRmb250LXNpemU6IDNyZW07XHJcblx0XHRcdFx0XHRcdGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byByaWdodCwgI2Y3OWQwMCwgIzY0ZjM4Yyk7XHJcblx0XHRcdFx0XHRcdGJhY2tncm91bmQtY2xpcDogdGV4dDtcclxuXHRcdFx0XHRcdFx0LXdlYmtpdC10ZXh0LWZpbGwtY29sb3I6IHRyYW5zcGFyZW50O1xyXG5cdFx0XHRcdFx0XHR0ZXh0LXNoYWRvdzogMHB4IDBweCA1MHB4ICMxZmZjNDQyYTtcclxuXHRcdFx0XHRcdFx0cG9zaXRpb246IHJlbGF0aXZlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdGB9PC9zdHlsZT5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGVmYXVsdDtcclxuIl19 */\n/*@ sourceURL=C:\\\\Users\\\\hillel nagid\\\\Desktop\\\\rhythm\\\\pages\\\\index.js */"), __jsx(styled_jsx_style__WEBPACK_IMPORTED_MODULE_0___default.a, {
      id: "1576542671",
      __self: this
    }, "h1.jsx-2218756941{font-size:3rem;background:linear-gradient(to right,#f79d00,#64f38c);background-clip:text;-webkit-text-fill-color:transparent;text-shadow:0px 0px 50px #1ffc442a;position:relative;}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcaGlsbGVsIG5hZ2lkXFxEZXNrdG9wXFxyaHl0aG1cXHBhZ2VzXFxpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFxQ2dCLEFBR3NCLGVBQ3dDLHFEQUNsQyxxQkFDZSxvQ0FDRCxtQ0FDakIsa0JBQ25CIiwiZmlsZSI6IkM6XFxVc2Vyc1xcaGlsbGVsIG5hZ2lkXFxEZXNrdG9wXFxyaHl0aG1cXHBhZ2VzXFxpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBSaHl0aG0gZnJvbSAnLi9yaHl0aG0nO1xyXG5cclxuY2xhc3MgRGVmYXVsdCBleHRlbmRzIENvbXBvbmVudCB7XHJcblx0cmVuZGVyKCkge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2FwcCc+XHJcblx0XHRcdFx0PGgxPlJoeXRobSBEZXRlY3RvcjwvaDE+XHJcblx0XHRcdFx0PGgyPlNlbGVjdCB5b3VyIHNvbmcgYXQgdGhlIHNlYXJjaCBiYXIgYmVsb3c8L2gyPlxyXG5cdFx0XHRcdDxSaHl0aG0+PC9SaHl0aG0+XHJcblx0XHRcdFx0ey8qXHQ8aW5wdXQgdHlwZT0ndGV4dCcgLz4qL31cclxuXHRcdFx0XHQ8c3R5bGUgZ2xvYmFsIGpzeD5cclxuXHRcdFx0XHRcdHtgXHJcblx0XHRcdFx0XHRcdGJvZHksXHJcblx0XHRcdFx0XHRcdGh0bWwsXHJcblx0XHRcdFx0XHRcdCNyb290IHtcclxuXHRcdFx0XHRcdFx0XHRtYXJnaW46IDA7XHJcblx0XHRcdFx0XHRcdFx0aGVpZ2h0OiAxMDAlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdCo6YWN0aXZlLFxyXG5cdFx0XHRcdFx0XHQqOmZvY3VzIHtcclxuXHRcdFx0XHRcdFx0XHRvdXRsaW5lLXN0eWxlOiBub25lO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdCoge1xyXG5cdFx0XHRcdFx0XHRcdGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0I19fbmV4dCB7XHJcblx0XHRcdFx0XHRcdFx0ZGlzcGxheTogZ3JpZDtcclxuXHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsICMxNDFlMzAsICMyNDNiNTUpO1xyXG5cdFx0XHRcdFx0XHRcdGhlaWdodDogMTAwJTtcclxuXHRcdFx0XHRcdFx0XHR3aWR0aDogMTAwJTtcclxuXHRcdFx0XHRcdFx0XHRqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XHJcblx0XHRcdFx0XHRcdFx0YWxpZ24taXRlbXM6IGNlbnRlcjtcclxuXHRcdFx0XHRcdFx0XHRtYXgtaGVpZ2h0OiAxMDAlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRgfVxyXG5cdFx0XHRcdDwvc3R5bGU+XHJcblx0XHRcdFx0PHN0eWxlIGpzeD57YFxyXG5cdFx0XHRcdFx0aDEge1xyXG5cdFx0XHRcdFx0XHRmb250LXNpemU6IDNyZW07XHJcblx0XHRcdFx0XHRcdGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byByaWdodCwgI2Y3OWQwMCwgIzY0ZjM4Yyk7XHJcblx0XHRcdFx0XHRcdGJhY2tncm91bmQtY2xpcDogdGV4dDtcclxuXHRcdFx0XHRcdFx0LXdlYmtpdC10ZXh0LWZpbGwtY29sb3I6IHRyYW5zcGFyZW50O1xyXG5cdFx0XHRcdFx0XHR0ZXh0LXNoYWRvdzogMHB4IDBweCA1MHB4ICMxZmZjNDQyYTtcclxuXHRcdFx0XHRcdFx0cG9zaXRpb246IHJlbGF0aXZlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdGB9PC9zdHlsZT5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGVmYXVsdDtcclxuIl19 */\n/*@ sourceURL=C:\\\\Users\\\\hillel nagid\\\\Desktop\\\\rhythm\\\\pages\\\\index.js */"));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Default);

/***/ }),

/***/ "./pages/rhythm.js":
/*!*************************!*\
  !*** ./pages/rhythm.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "axios");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _TracksResults__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TracksResults */ "./pages/TracksResults.js");
var _jsxFileName = "C:\\Users\\hillel nagid\\Desktop\\rhythm\\pages\\rhythm.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





class Rhythm extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor() {
    super();

    _defineProperty(this, "getTracks", () => {
      axios__WEBPACK_IMPORTED_MODULE_1___default.a.get(`https://api.spotify.com/v1/search?q=${this.state.query}&type=track&limit=5`, {
        headers: {
          Authorization: `${this.state.token_type} ${this.state.token}`
        }
      }).then(data => {
        this.setState({
          track_list: data.data.tracks.items
        });
      }).catch(err => {
        console.log(err);
      });
    });

    _defineProperty(this, "changeHandler", () => {
      this.setState({
        query: this.search.value
      }, () => {
        if (this.state.query && this.state.query.length > 1) {
          this.getTracks();
        } else {
          this.setState({
            track_list: []
          });
        }
      });
    });

    this.state = {
      token: null,
      track_list: [],
      query: ''
    };
  }

  componentDidMount() {
    const hash = window.location.hash.substring(1).split('&').reduce((initial, item) => {
      if (item) {
        var parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1]);
      }

      return initial;
    }, {});
    this.setState({
      token: hash.access_token,
      token_type: hash.token_type
    });
  }

  render() {
    return __jsx(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, !this.state.token && __jsx("button", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 61,
        columnNumber: 6
      }
    }, __jsx("a", {
      href: "https://accounts.spotify.com/authorize?client_id=58b9c4063c904cda87af80186a732f01&redirect_uri=http:%2F%2Flocalhost:3000&response_type=token",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 62,
        columnNumber: 7
      }
    }, "Login With Spotify")), this.state.token && __jsx(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, __jsx("input", {
      ref: input => this.search = input,
      onChange: this.changeHandler,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 69,
        columnNumber: 7
      }
    }), __jsx(_TracksResults__WEBPACK_IMPORTED_MODULE_2__["default"], {
      authorization: `${this.state.token_type} ${this.state.token}`,
      tracks: this.state.track_list,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 73,
        columnNumber: 7
      }
    })));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Rhythm);

/***/ }),

/***/ 3:
/*!******************************!*\
  !*** multi ./pages/index.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\hillel nagid\Desktop\rhythm\pages\index.js */"./pages/index.js");


/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "styled-jsx/style":
/*!***********************************!*\
  !*** external "styled-jsx/style" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("styled-jsx/style");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vYmFuZC5qcy9kaXN0L2JhbmQuanMiLCJ3ZWJwYWNrOi8vLy4vcGFnZXMvQXVkaW8uanMiLCJ3ZWJwYWNrOi8vLy4vcGFnZXMvVHJhY2tzUmVzdWx0cy5qcyIsIndlYnBhY2s6Ly8vLi9wYWdlcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9wYWdlcy9yaHl0aG0uanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiYXhpb3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJyZWFjdFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInN0eWxlZC1qc3gvc3R5bGVcIiJdLCJuYW1lcyI6WyJlIiwibW9kdWxlIiwiZXhwb3J0cyIsImRlZmluZSIsInQiLCJuIiwiciIsInMiLCJvIiwidSIsImEiLCJyZXF1aXJlIiwiaSIsIkVycm9yIiwiZiIsImNhbGwiLCJsZW5ndGgiLCJfZGVyZXFfIiwiZGVmaW5pdGlvbiIsIndpbmRvdyIsIkF1ZGlvQ29udGV4dCIsIndlYmtpdEF1ZGlvQ29udGV4dCIsIkNvbmR1Y3RvciIsInBhY2tzIiwiaW5zdHJ1bWVudCIsInJoeXRobSIsInR1bmluZyIsImNvbmR1Y3RvciIsInBsYXllciIsIm5vb3AiLCJzaWduYXR1cmVUb05vdGVMZW5ndGhSYXRpbyIsInBpdGNoZXMiLCJub3RlcyIsImF1ZGlvQ29udGV4dCIsIm1hc3RlclZvbHVtZUxldmVsIiwibWFzdGVyVm9sdW1lIiwiY3JlYXRlR2FpbiIsImNvbm5lY3QiLCJkZXN0aW5hdGlvbiIsImJlYXRzUGVyQmFyIiwibm90ZUdldHNCZWF0IiwidGVtcG8iLCJpbnN0cnVtZW50cyIsInRvdGFsRHVyYXRpb24iLCJjdXJyZW50U2Vjb25kcyIsInBlcmNlbnRhZ2VDb21wbGV0ZSIsIm5vdGVCdWZmZXJMZW5ndGgiLCJvblRpY2tlckNhbGxiYWNrIiwib25GaW5pc2hlZENhbGxiYWNrIiwib25EdXJhdGlvbkNoYW5nZUNhbGxiYWNrIiwibG9hZCIsImpzb24iLCJkZXN0cm95IiwidGltZVNpZ25hdHVyZSIsInNldFRpbWVTaWduYXR1cmUiLCJzZXRUZW1wbyIsImluc3RydW1lbnRMaXN0IiwiaGFzT3duUHJvcGVydHkiLCJjcmVhdGVJbnN0cnVtZW50IiwibmFtZSIsInBhY2siLCJpbnN0IiwiaW5kZXgiLCJub3RlIiwibm90ZVBhcnRzIiwic3BsaXQiLCJyZXN0IiwidHlwZSIsInBpdGNoIiwidGllIiwiZmluaXNoIiwiSW5zdHJ1bWVudCIsInB1c2giLCJQbGF5ZXIiLCJzZXRNYXN0ZXJWb2x1bWUiLCJ2b2x1bWUiLCJnYWluIiwic2V0VmFsdWVBdFRpbWUiLCJjdXJyZW50VGltZSIsImdldFRvdGFsU2Vjb25kcyIsIk1hdGgiLCJyb3VuZCIsInNldFRpY2tlckNhbGxiYWNrIiwiY2IiLCJ0b3AiLCJib3R0b20iLCJyZXNldFRlbXBvIiwic2V0T25GaW5pc2hlZENhbGxiYWNrIiwic2V0T25EdXJhdGlvbkNoYW5nZUNhbGxiYWNrIiwic2V0Tm90ZUJ1ZmZlckxlbmd0aCIsImxlbiIsImxvYWRQYWNrIiwiZGF0YSIsImluZGV4T2YiLCJOb2lzZXNJbnN0cnVtZW50UGFjayIsInR5cGVzIiwiY3JlYXRlTm90ZSIsImNyZWF0ZVdoaXRlTm9pc2UiLCJjcmVhdGVQaW5rTm9pc2UiLCJjcmVhdGVCcm93bmlhbk5vaXNlIiwiYnVmZmVyU2l6ZSIsInNhbXBsZVJhdGUiLCJub2lzZUJ1ZmZlciIsImNyZWF0ZUJ1ZmZlciIsIm91dHB1dCIsImdldENoYW5uZWxEYXRhIiwicmFuZG9tIiwid2hpdGVOb2lzZSIsImNyZWF0ZUJ1ZmZlclNvdXJjZSIsImJ1ZmZlciIsImxvb3AiLCJiMCIsImIxIiwiYjIiLCJiMyIsImI0IiwiYjUiLCJiNiIsIndoaXRlIiwicGlua05vaXNlIiwibGFzdE91dCIsImJyb3duaWFuTm9pc2UiLCJPc2NpbGxhdG9ySW5zdHJ1bWVudFBhY2siLCJmcmVxdWVuY3kiLCJjcmVhdGVPc2NpbGxhdG9yIiwidmFsdWUiLCJnZXREdXJhdGlvbiIsImNsb25lIiwib2JqIiwiY29weSIsImNvbnN0cnVjdG9yIiwiYXR0ciIsImxhc3RSZXBlYXRDb3VudCIsInZvbHVtZUxldmVsIiwiYXJ0aWN1bGF0aW9uR2FwUGVyY2VudGFnZSIsImJ1ZmZlclBvc2l0aW9uIiwic2V0Vm9sdW1lIiwibmV3Vm9sdW1lTGV2ZWwiLCJkdXJhdGlvbiIsImFydGljdWxhdGlvbkdhcCIsInAiLCJ0cmltIiwicGFyc2VGbG9hdCIsImlzTmFOIiwic3RhcnRUaW1lIiwic3RvcFRpbWUiLCJyZXBlYXRTdGFydCIsInJlcGVhdEZyb21CZWdpbm5pbmciLCJudW1PZlJlcGVhdHMiLCJyZXBlYXQiLCJub3Rlc0J1ZmZlckNvcHkiLCJzbGljZSIsIm5vdGVDb3B5IiwicmVzZXREdXJhdGlvbiIsIm51bU9mTm90ZXMiLCJidWZmZXJUaW1lb3V0IiwiYWxsTm90ZXMiLCJidWZmZXJOb3RlcyIsImN1cnJlbnRQbGF5VGltZSIsInRvdGFsUGxheVRpbWUiLCJmYWRlZCIsImNhbGN1bGF0ZVRvdGFsRHVyYXRpb24iLCJyZXNldCIsIm51bU9mSW5zdHJ1bWVudHMiLCJkaXNjb25uZWN0IiwiY2xlYXJUaW1lb3V0IiwiZmFkZSIsImRpcmVjdGlvbiIsInJlc2V0Vm9sdW1lIiwiZmFkZUR1cmF0aW9uIiwibGluZWFyUmFtcFRvVmFsdWVBdFRpbWUiLCJzZXRUaW1lb3V0IiwiYnVmZmVyQ291bnQiLCJpbmRleDIiLCJub2RlIiwiaW5kZXgzIiwidG90YWxQbGF5VGltZUNhbGN1bGF0b3IiLCJwYXVzZWQiLCJwbGF5aW5nIiwic3RvcCIsImxvb3BpbmciLCJwbGF5IiwidXBkYXRlVG90YWxQbGF5VGltZSIsInNlY29uZHMiLCJtdXRlZCIsInRpbWVPZmZzZXQiLCJwbGF5Tm90ZXMiLCJzdGFydCIsImJ1ZmZlclVwIiwiYnVmZmVySW5OZXdOb3RlcyIsIm5ld05vdGVzIiwiY29uY2F0IiwiZmFkZU91dCIsInBhdXNlIiwidmFsIiwic2V0VGltZSIsIm5ld1RpbWUiLCJwYXJzZUludCIsIm11dGUiLCJ1bm11dGUiLCJzZW1pYnJldmUiLCJkb3R0ZWRNaW5pbSIsIm1pbmltIiwiZG90dGVkQ3JvdGNoZXQiLCJ0cmlwbGV0TWluaW0iLCJjcm90Y2hldCIsImRvdHRlZFF1YXZlciIsInRyaXBsZXRDcm90Y2hldCIsInF1YXZlciIsImRvdHRlZFNlbWlxdWF2ZXIiLCJ0cmlwbGV0UXVhdmVyIiwic2VtaXF1YXZlciIsInRyaXBsZXRTZW1pcXVhdmVyIiwiZGVtaXNlbWlxdWF2ZXIiLCJ3aG9sZSIsImRvdHRlZEhhbGYiLCJoYWxmIiwiZG90dGVkUXVhcnRlciIsInRyaXBsZXRIYWxmIiwicXVhcnRlciIsImRvdHRlZEVpZ2h0aCIsInRyaXBsZXRRdWFydGVyIiwiZWlnaHRoIiwiZG90dGVkU2l4dGVlbnRoIiwidHJpcGxldEVpZ2h0aCIsInNpeHRlZW50aCIsInRyaXBsZXRTaXh0ZWVudGgiLCJ0aGlydHlTZWNvbmQiLCJBdWRpbyIsIkNvbXBvbmVudCIsInByb3BzIiwic3RhdGUiLCJjb25zb2xlIiwibG9nIiwiQmFuZEpTIiwic2VjdGlvbnNQcm9wcyIsImFuYWx5c2lzIiwic2VjdGlvbnMiLCJmb3JFYWNoIiwic2VjdGlvbiIsInBpYW5vIiwic2V0U3RhdGUiLCJyaHl0aG1UaW1lciIsInRpbWUiLCJzaGlmdCIsInJlbmRlciIsInBsYXlIYW5kbGVyIiwiVHJhY2tzUmVzdWx0cyIsInRyYWNrUmVmIiwiUmVhY3QiLCJjcmVhdGVSZWYiLCJzYSIsInNhcyIsInVzZVN0YXRlIiwiZ2V0QW5hbHlzaXMiLCJheGlvcyIsImdldCIsInRhcmdldCIsImlkIiwiaGVhZGVycyIsIkF1dGhvcml6YXRpb24iLCJhdXRob3JpemF0aW9uIiwidGhlbiIsImNhdGNoIiwiZXJyIiwidHJhY2tzIiwibWFwIiwidHJhY2siLCJhcnRpc3RzIiwicG9wdWxhcml0eSIsIkRlZmF1bHQiLCJSaHl0aG0iLCJxdWVyeSIsInRva2VuX3R5cGUiLCJ0b2tlbiIsInRyYWNrX2xpc3QiLCJpdGVtcyIsInNlYXJjaCIsImdldFRyYWNrcyIsImNvbXBvbmVudERpZE1vdW50IiwiaGFzaCIsImxvY2F0aW9uIiwic3Vic3RyaW5nIiwicmVkdWNlIiwiaW5pdGlhbCIsIml0ZW0iLCJwYXJ0cyIsImRlY29kZVVSSUNvbXBvbmVudCIsImFjY2Vzc190b2tlbiIsImlucHV0IiwiY2hhbmdlSGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLElBQUk7UUFDSjtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDeEZBLHlCQUFDLFVBQVNBLENBQVQsRUFBVztBQUFDLE1BQUcsSUFBSCxFQUF3REMsTUFBTSxDQUFDQyxPQUFQLEdBQWVGLENBQUMsRUFBaEIsQ0FBeEQsS0FBZ0YsVUFBeUw7QUFBQyxDQUF0UixDQUF1UixZQUFVO0FBQUMsTUFBSUcsTUFBSixFQUFXRixNQUFYLEVBQWtCQyxPQUFsQjtBQUEwQixTQUFRLFNBQVNGLENBQVQsQ0FBV0ksQ0FB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QUFBLE1BTEQsQ0FURixDQUREO0FBdUJBOztBQTVFNkI7O0FBK0VoQkoscUVBQWYsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuRkEsa0M7Ozs7Ozs7Ozs7O0FDQUEsa0M7Ozs7Ozs7Ozs7O0FDQUEsNkMiLCJmaWxlIjoic3RhdGljXFxkZXZlbG9wbWVudFxccGFnZXNcXGluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSByZXF1aXJlKCcuLi8uLi8uLi9zc3ItbW9kdWxlLWNhY2hlLmpzJyk7XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdHZhciB0aHJldyA9IHRydWU7XG4gXHRcdHRyeSB7XG4gXHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG4gXHRcdFx0dGhyZXcgPSBmYWxzZTtcbiBcdFx0fSBmaW5hbGx5IHtcbiBcdFx0XHRpZih0aHJldykgZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHR9XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDMpO1xuIiwiIWZ1bmN0aW9uKGUpe2lmKFwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlKW1vZHVsZS5leHBvcnRzPWUoKTtlbHNlIGlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZClkZWZpbmUoW10sZSk7ZWxzZXt2YXIgZjtcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P2Y9d2luZG93OlwidW5kZWZpbmVkXCIhPXR5cGVvZiBnbG9iYWw/Zj1nbG9iYWw6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGYmJihmPXNlbGYpLGYuQmFuZEpTPWUoKX19KGZ1bmN0aW9uKCl7dmFyIGRlZmluZSxtb2R1bGUsZXhwb3J0cztyZXR1cm4gKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkoezE6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xyXG4vKlxyXG4gKiBXZWIgQXVkaW8gQVBJIEF1ZGlvQ29udGV4dCBzaGltXHJcbiAqL1xyXG4oZnVuY3Rpb24gKGRlZmluaXRpb24pIHtcclxuICAgIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpO1xyXG4gICAgfVxyXG59KShmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcclxufSk7XHJcblxyXG59LHt9XSwyOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcclxuLyoqXHJcbiAqIEJhbmQuanMgLSBNdXNpYyBDb21wb3NlclxyXG4gKiBBbiBpbnRlcmZhY2UgZm9yIHRoZSBXZWIgQXVkaW8gQVBJIHRoYXQgc3VwcG9ydHMgcmh5dGhtcywgbXVsdGlwbGUgaW5zdHJ1bWVudHMsIHJlcGVhdGluZyBzZWN0aW9ucywgYW5kIGNvbXBsZXhcclxuICogdGltZSBzaWduYXR1cmVzLlxyXG4gKlxyXG4gKiBAYXV0aG9yIENvZHkgTHVuZHF1aXN0IChodHRwOi8vZ2l0aHViLmNvbS9tZWVuaWUpIC0gMjAxNFxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBDb25kdWN0b3I7XHJcblxyXG52YXIgcGFja3MgPSB7XHJcbiAgICBpbnN0cnVtZW50OiB7fSxcclxuICAgIHJoeXRobToge30sXHJcbiAgICB0dW5pbmc6IHt9XHJcbn07XHJcblxyXG4vKipcclxuICogQ29uZHVjdG9yIENsYXNzIC0gVGhpcyBnZXRzIGluc3RhbnRpYXRlZCB3aGVuIGBuZXcgQmFuZEpTKClgIGlzIGNhbGxlZFxyXG4gKlxyXG4gKiBAcGFyYW0gdHVuaW5nXHJcbiAqIEBwYXJhbSByaHl0aG1cclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBDb25kdWN0b3IodHVuaW5nLCByaHl0aG0pIHtcclxuICAgIGlmICghIHR1bmluZykge1xyXG4gICAgICAgIHR1bmluZyA9ICdlcXVhbFRlbXBlcmFtZW50JztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoISByaHl0aG0pIHtcclxuICAgICAgICByaHl0aG0gPSAnbm9ydGhBbWVyaWNhbic7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBwYWNrcy50dW5pbmdbdHVuaW5nXSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IodHVuaW5nICsgJyBpcyBub3QgYSB2YWxpZCB0dW5pbmcgcGFjay4nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIHBhY2tzLnJoeXRobVtyaHl0aG1dID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihyaHl0aG0gKyAnIGlzIG5vdCBhIHZhbGlkIHJoeXRobSBwYWNrLicpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjb25kdWN0b3IgPSB0aGlzLFxyXG4gICAgICAgIHBsYXllcixcclxuICAgICAgICBub29wID0gZnVuY3Rpb24oKSB7fSxcclxuICAgICAgICBBdWRpb0NvbnRleHQgPSBfZGVyZXFfKCdhdWRpb2NvbnRleHQnKSxcclxuICAgICAgICBzaWduYXR1cmVUb05vdGVMZW5ndGhSYXRpbyA9IHtcclxuICAgICAgICAgICAgMjogNixcclxuICAgICAgICAgICAgNDogMyxcclxuICAgICAgICAgICAgODogNC41MFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgY29uZHVjdG9yLnBhY2tzID0gcGFja3M7XHJcbiAgICBjb25kdWN0b3IucGl0Y2hlcyA9IHBhY2tzLnR1bmluZ1t0dW5pbmddO1xyXG4gICAgY29uZHVjdG9yLm5vdGVzID0gcGFja3Mucmh5dGhtW3JoeXRobV07XHJcbiAgICBjb25kdWN0b3IuYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xyXG4gICAgY29uZHVjdG9yLm1hc3RlclZvbHVtZUxldmVsID0gbnVsbDtcclxuICAgIGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWUgPSBjb25kdWN0b3IuYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcclxuICAgIGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWUuY29ubmVjdChjb25kdWN0b3IuYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcclxuICAgIGNvbmR1Y3Rvci5iZWF0c1BlckJhciA9IG51bGw7XHJcbiAgICBjb25kdWN0b3Iubm90ZUdldHNCZWF0ID0gbnVsbDtcclxuICAgIGNvbmR1Y3Rvci50ZW1wbyA9IG51bGw7XHJcbiAgICBjb25kdWN0b3IuaW5zdHJ1bWVudHMgPSBbXTtcclxuICAgIGNvbmR1Y3Rvci50b3RhbER1cmF0aW9uID0gMDtcclxuICAgIGNvbmR1Y3Rvci5jdXJyZW50U2Vjb25kcyA9IDA7XHJcbiAgICBjb25kdWN0b3IucGVyY2VudGFnZUNvbXBsZXRlID0gMDtcclxuICAgIGNvbmR1Y3Rvci5ub3RlQnVmZmVyTGVuZ3RoID0gMjA7XHJcbiAgICBjb25kdWN0b3Iub25UaWNrZXJDYWxsYmFjayA9IG5vb3A7XHJcbiAgICBjb25kdWN0b3Iub25GaW5pc2hlZENhbGxiYWNrID0gbm9vcDtcclxuICAgIGNvbmR1Y3Rvci5vbkR1cmF0aW9uQ2hhbmdlQ2FsbGJhY2sgPSBub29wO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXNlIEpTT04gdG8gbG9hZCBpbiBhIHNvbmcgdG8gYmUgcGxheWVkXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGpzb25cclxuICAgICAqL1xyXG4gICAgY29uZHVjdG9yLmxvYWQgPSBmdW5jdGlvbihqc29uKSB7XHJcbiAgICAgICAgLy8gQ2xlYXIgb3V0IGFueSBwcmV2aW91cyBzb25nXHJcbiAgICAgICAgaWYgKGNvbmR1Y3Rvci5pbnN0cnVtZW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNvbmR1Y3Rvci5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoISBqc29uKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSlNPTiBpcyByZXF1aXJlZCBmb3IgdGhpcyBtZXRob2QgdG8gd29yay4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gTmVlZCB0byBoYXZlIGF0IGxlYXN0IGluc3RydW1lbnRzIGFuZCBub3Rlc1xyXG4gICAgICAgIGlmICh0eXBlb2YganNvbi5pbnN0cnVtZW50cyA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbXVzdCBkZWZpbmUgYXQgbGVhc3Qgb25lIGluc3RydW1lbnQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiBqc29uLm5vdGVzID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBtdXN0IGRlZmluZSBub3RlcyBmb3IgZWFjaCBpbnN0cnVtZW50Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTaGFsbCB3ZSBzZXQgYSB0aW1lIHNpZ25hdHVyZT9cclxuICAgICAgICBpZiAodHlwZW9mIGpzb24udGltZVNpZ25hdHVyZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgY29uZHVjdG9yLnNldFRpbWVTaWduYXR1cmUoanNvbi50aW1lU2lnbmF0dXJlWzBdLCBqc29uLnRpbWVTaWduYXR1cmVbMV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gTWF5YmUgc29tZSB0ZW1wbz9cclxuICAgICAgICBpZiAodHlwZW9mIGpzb24udGVtcG8gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIGNvbmR1Y3Rvci5zZXRUZW1wbyhqc29uLnRlbXBvKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIExldHMgY3JlYXRlIHNvbWUgaW5zdHJ1bWVudHNcclxuICAgICAgICB2YXIgaW5zdHJ1bWVudExpc3QgPSB7fTtcclxuICAgICAgICBmb3IgKHZhciBpbnN0cnVtZW50IGluIGpzb24uaW5zdHJ1bWVudHMpIHtcclxuICAgICAgICAgICAgaWYgKCEganNvbi5pbnN0cnVtZW50cy5oYXNPd25Qcm9wZXJ0eShpbnN0cnVtZW50KSkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGluc3RydW1lbnRMaXN0W2luc3RydW1lbnRdID0gY29uZHVjdG9yLmNyZWF0ZUluc3RydW1lbnQoXHJcbiAgICAgICAgICAgICAgICBqc29uLmluc3RydW1lbnRzW2luc3RydW1lbnRdLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBqc29uLmluc3RydW1lbnRzW2luc3RydW1lbnRdLnBhY2tcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE5vdyBsZXRzIGFkZCBpbiBlYWNoIG9mIHRoZSBub3Rlc1xyXG4gICAgICAgIGZvciAodmFyIGluc3QgaW4ganNvbi5ub3Rlcykge1xyXG4gICAgICAgICAgICBpZiAoISBqc29uLm5vdGVzLmhhc093blByb3BlcnR5KGluc3QpKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSAtMTtcclxuICAgICAgICAgICAgd2hpbGUgKCsrIGluZGV4IDwganNvbi5ub3Rlc1tpbnN0XS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBub3RlID0ganNvbi5ub3Rlc1tpbnN0XVtpbmRleF07XHJcbiAgICAgICAgICAgICAgICAvLyBVc2Ugc2hvcnRoYW5kIGlmIGl0J3MgYSBzdHJpbmdcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygbm90ZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbm90ZVBhcnRzID0gbm90ZS5zcGxpdCgnfCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgncmVzdCcgPT09IG5vdGVQYXJ0c1sxXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0cnVtZW50TGlzdFtpbnN0XS5yZXN0KG5vdGVQYXJ0c1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdHJ1bWVudExpc3RbaW5zdF0ubm90ZShub3RlUGFydHNbMF0sIG5vdGVQYXJ0c1sxXSwgbm90ZVBhcnRzWzJdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlIHVzZSBsb25naGFuZFxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJ3Jlc3QnID09PSBub3RlLnR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdHJ1bWVudExpc3RbaW5zdF0ucmVzdChub3RlLnJoeXRobSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgnbm90ZScgPT09IG5vdGUudHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0cnVtZW50TGlzdFtpbnN0XS5ub3RlKG5vdGUucmh5dGhtLCBub3RlLnBpdGNoLCBub3RlLnRpZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBMb29rcyBsaWtlIHdlIGFyZSBkb25lLCBsZXRzIHByZXNzIGl0LlxyXG4gICAgICAgIHJldHVybiBjb25kdWN0b3IuZmluaXNoKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgbmV3IGluc3RydW1lbnRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gW25hbWVdIC0gZGVmYXVsdHMgdG8gc2luZVxyXG4gICAgICogQHBhcmFtIFtwYWNrXSAtIGRlZmF1bHRzIHRvIG9zY2lsbGF0b3JzXHJcbiAgICAgKi9cclxuICAgIGNvbmR1Y3Rvci5jcmVhdGVJbnN0cnVtZW50ID0gZnVuY3Rpb24obmFtZSwgcGFjaykge1xyXG4gICAgICAgIHZhciBJbnN0cnVtZW50ID0gX2RlcmVxXygnLi9pbnN0cnVtZW50LmpzJyksXHJcbiAgICAgICAgICAgIGluc3RydW1lbnQgPSBuZXcgSW5zdHJ1bWVudChuYW1lLCBwYWNrLCBjb25kdWN0b3IpO1xyXG4gICAgICAgIGNvbmR1Y3Rvci5pbnN0cnVtZW50cy5wdXNoKGluc3RydW1lbnQpO1xyXG5cclxuICAgICAgICByZXR1cm4gaW5zdHJ1bWVudDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBOZWVkcyB0byBiZSBjYWxsZWQgYWZ0ZXIgYWxsIHRoZSBpbnN0cnVtZW50cyBoYXZlIGJlZW4gZmlsbGVkIHdpdGggbm90ZXMuXHJcbiAgICAgKiBJdCB3aWxsIGZpZ3VyZSBvdXQgdGhlIHRvdGFsIGR1cmF0aW9uIG9mIHRoZSBzb25nIGJhc2VkIG9uIHRoZSBsb25nZXN0XHJcbiAgICAgKiBkdXJhdGlvbiBvdXQgb2YgYWxsIHRoZSBpbnN0cnVtZW50cy4gIEl0IHdpbGwgdGhlbiBwYXNzIGJhY2sgdGhlIFBsYXllciBPYmplY3RcclxuICAgICAqIHdoaWNoIGlzIHVzZWQgdG8gY29udHJvbCB0aGUgbXVzaWMgKHBsYXksIHN0b3AsIHBhdXNlLCBsb29wLCB2b2x1bWUsIHRlbXBvKVxyXG4gICAgICpcclxuICAgICAqIEl0IHJldHVybnMgdGhlIFBsYXllciBvYmplY3QuXHJcbiAgICAgKi9cclxuICAgIGNvbmR1Y3Rvci5maW5pc2ggPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgUGxheWVyID0gX2RlcmVxXygnLi9wbGF5ZXIuanMnKTtcclxuICAgICAgICBwbGF5ZXIgPSBuZXcgUGxheWVyKGNvbmR1Y3Rvcik7XHJcblxyXG4gICAgICAgIHJldHVybiBwbGF5ZXI7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlIGFsbCBpbnN0cnVtZW50cyBhbmQgcmVjcmVhdGUgQXVkaW9Db250ZXh0XHJcbiAgICAgKi9cclxuICAgIGNvbmR1Y3Rvci5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uZHVjdG9yLmF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcclxuICAgICAgICBjb25kdWN0b3IuaW5zdHJ1bWVudHMubGVuZ3RoID0gMDtcclxuICAgICAgICBjb25kdWN0b3IubWFzdGVyVm9sdW1lID0gY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XHJcbiAgICAgICAgY29uZHVjdG9yLm1hc3RlclZvbHVtZS5jb25uZWN0KGNvbmR1Y3Rvci5hdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCBNYXN0ZXIgVm9sdW1lXHJcbiAgICAgKi9cclxuICAgIGNvbmR1Y3Rvci5zZXRNYXN0ZXJWb2x1bWUgPSBmdW5jdGlvbih2b2x1bWUpIHtcclxuICAgICAgICBpZiAodm9sdW1lID4gMSkge1xyXG4gICAgICAgICAgICB2b2x1bWUgPSB2b2x1bWUgLyAxMDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWVMZXZlbCA9IHZvbHVtZTtcclxuICAgICAgICBjb25kdWN0b3IubWFzdGVyVm9sdW1lLmdhaW4uc2V0VmFsdWVBdFRpbWUodm9sdW1lLCBjb25kdWN0b3IuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHcmFiIHRoZSB0b3RhbCBkdXJhdGlvbiBvZiBhIHNvbmdcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBjb25kdWN0b3IuZ2V0VG90YWxTZWNvbmRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoY29uZHVjdG9yLnRvdGFsRHVyYXRpb24pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIHRpY2tlciBjYWxsYmFjayBmdW5jdGlvbi4gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZFxyXG4gICAgICogZXZlcnkgdGltZSB0aGUgY3VycmVudCBzZWNvbmRzIGhhcyBjaGFuZ2VkLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjYiBmdW5jdGlvblxyXG4gICAgICovXHJcbiAgICBjb25kdWN0b3Iuc2V0VGlja2VyQ2FsbGJhY2sgPSBmdW5jdGlvbihjYikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgY2IgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaWNrZXIgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uZHVjdG9yLm9uVGlja2VyQ2FsbGJhY2sgPSBjYjtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSB0aW1lIHNpZ25hdHVyZSBmb3IgdGhlIG11c2ljLiBKdXN0IGxpa2UgaW4gbm90YXRpb24gNC80IHRpbWUgd291bGQgYmUgc2V0VGltZVNpZ25hdHVyZSg0LCA0KTtcclxuICAgICAqIEBwYXJhbSB0b3AgLSBOdW1iZXIgb2YgYmVhdHMgcGVyIGJhclxyXG4gICAgICogQHBhcmFtIGJvdHRvbSAtIFdoYXQgbm90ZSB0eXBlIGhhcyB0aGUgYmVhdFxyXG4gICAgICovXHJcbiAgICBjb25kdWN0b3Iuc2V0VGltZVNpZ25hdHVyZSA9IGZ1bmN0aW9uKHRvcCwgYm90dG9tKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBzaWduYXR1cmVUb05vdGVMZW5ndGhSYXRpb1tib3R0b21dID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBib3R0b20gdGltZSBzaWduYXR1cmUgaXMgbm90IHN1cHBvcnRlZC4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE5vdCB1c2VkIGF0IHRoZSBtb21lbnQsIGJ1dCB3aWxsIGJlIGhhbmR5IGluIHRoZSBmdXR1cmUuXHJcbiAgICAgICAgY29uZHVjdG9yLmJlYXRzUGVyQmFyID0gdG9wO1xyXG4gICAgICAgIGNvbmR1Y3Rvci5ub3RlR2V0c0JlYXQgPSBzaWduYXR1cmVUb05vdGVMZW5ndGhSYXRpb1tib3R0b21dO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIHRlbXBvXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHRcclxuICAgICAqL1xyXG4gICAgY29uZHVjdG9yLnNldFRlbXBvID0gZnVuY3Rpb24odCkge1xyXG4gICAgICAgIGNvbmR1Y3Rvci50ZW1wbyA9IDYwIC8gdDtcclxuXHJcbiAgICAgICAgLy8gSWYgd2UgaGF2ZSBhIHBsYXllciBpbnN0YW5jZSwgd2UgbmVlZCB0byByZWNhbGN1bGF0ZSBkdXJhdGlvbiBhZnRlciByZXNldHRpbmcgdGhlIHRlbXBvLlxyXG4gICAgICAgIGlmIChwbGF5ZXIpIHtcclxuICAgICAgICAgICAgcGxheWVyLnJlc2V0VGVtcG8oKTtcclxuICAgICAgICAgICAgY29uZHVjdG9yLm9uRHVyYXRpb25DaGFuZ2VDYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgYSBjYWxsYmFjayB0byBmaXJlIHdoZW4gdGhlIHNvbmcgaXMgZmluaXNoZWRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY2JcclxuICAgICAqL1xyXG4gICAgY29uZHVjdG9yLnNldE9uRmluaXNoZWRDYWxsYmFjayA9IGZ1bmN0aW9uKGNiKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjYiAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ29uRmluaXNoZWQgY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uZHVjdG9yLm9uRmluaXNoZWRDYWxsYmFjayA9IGNiO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCBhIGNhbGxiYWNrIHRvIGZpcmUgd2hlbiBkdXJhdGlvbiBvZiBhIHNvbmcgY2hhbmdlc1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjYlxyXG4gICAgICovXHJcbiAgICBjb25kdWN0b3Iuc2V0T25EdXJhdGlvbkNoYW5nZUNhbGxiYWNrID0gZnVuY3Rpb24oY2IpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGNiICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignb25EdXJhdGlvbkNoYW5nZWQgY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uZHVjdG9yLm9uRHVyYXRpb25DaGFuZ2VDYWxsYmFjayA9IGNiO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCB0aGUgbnVtYmVyIG9mIG5vdGVzIHRoYXQgYXJlIGJ1ZmZlcmVkIGV2ZXJ5ICh0ZW1wbyAvIDYwICogNSkgc2Vjb25kcy5cclxuICAgICAqIEl0J3Mgc2V0IHRvIDIwIG5vdGVzIGJ5IGRlZmF1bHQuXHJcbiAgICAgKlxyXG4gICAgICogKipXQVJOSU5HKiogVGhlIGhpZ2hlciB0aGlzIGlzLCB0aGUgbW9yZSBtZW1vcnkgaXMgdXNlZCBhbmQgY2FuIGNyYXNoIHlvdXIgYnJvd3Nlci5cclxuICAgICAqICAgICAgICAgICAgIElmIG5vdGVzIGFyZSBiZWluZyBkcm9wcGVkLCB5b3UgY2FuIGluY3JlYXNlIHRoaXMsIGJ1dCBiZSB3ZWFyeSBvZlxyXG4gICAgICogICAgICAgICAgICAgdXNlZCBtZW1vcnkuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtJbnRlZ2VyfSBsZW5cclxuICAgICAqL1xyXG4gICAgY29uZHVjdG9yLnNldE5vdGVCdWZmZXJMZW5ndGggPSBmdW5jdGlvbihsZW4pIHtcclxuICAgICAgICBjb25kdWN0b3Iubm90ZUJ1ZmZlckxlbmd0aCA9IGxlbjtcclxuICAgIH07XHJcblxyXG4gICAgY29uZHVjdG9yLnNldE1hc3RlclZvbHVtZSgxMDApO1xyXG4gICAgY29uZHVjdG9yLnNldFRlbXBvKDEyMCk7XHJcbiAgICBjb25kdWN0b3Iuc2V0VGltZVNpZ25hdHVyZSg0LCA0KTtcclxufVxyXG5cclxuQ29uZHVjdG9yLmxvYWRQYWNrID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgZGF0YSkge1xyXG4gICAgaWYgKFsndHVuaW5nJywgJ3JoeXRobScsICdpbnN0cnVtZW50J10uaW5kZXhPZih0eXBlKSA9PT0gLTEpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IodHlwZSArICcgaXMgbm90IGEgdmFsaWQgUGFjayBUeXBlLicpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgcGFja3NbdHlwZV1bbmFtZV0gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBKG4pICcgKyB0eXBlICsgJyBwYWNrIHdpdGggdGhlIG5hbWUgXCInICsgbmFtZSArICdcIiBoYXMgYWxyZWFkeSBiZWVuIGxvYWRlZC4nKTtcclxuICAgIH1cclxuXHJcbiAgICBwYWNrc1t0eXBlXVtuYW1lXSA9IGRhdGE7XHJcbn07XHJcblxyXG59LHtcIi4vaW5zdHJ1bWVudC5qc1wiOjUsXCIuL3BsYXllci5qc1wiOjcsXCJhdWRpb2NvbnRleHRcIjoxfV0sMzpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XHJcbi8qKlxyXG4gKiBCYW5kLmpzIC0gTXVzaWMgQ29tcG9zZXJcclxuICogQW4gaW50ZXJmYWNlIGZvciB0aGUgV2ViIEF1ZGlvIEFQSSB0aGF0IHN1cHBvcnRzIHJoeXRobXMsIG11bHRpcGxlIGluc3RydW1lbnRzLCByZXBlYXRpbmcgc2VjdGlvbnMsIGFuZCBjb21wbGV4XHJcbiAqIHRpbWUgc2lnbmF0dXJlcy5cclxuICpcclxuICogQGF1dGhvciBDb2R5IEx1bmRxdWlzdCAoaHR0cDovL2dpdGh1Yi5jb20vbWVlbmllKSAtIDIwMTRcclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gTm9pc2VzSW5zdHJ1bWVudFBhY2s7XHJcblxyXG4vKipcclxuICogTm9pc2VzIEluc3RydW1lbnQgUGFja1xyXG4gKlxyXG4gKiBBZGFwdGVkIGZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS96YWNoYXJ5ZGVudG9uL25vaXNlLmpzXHJcbiAqXHJcbiAqIEBwYXJhbSBuYW1lXHJcbiAqIEBwYXJhbSBhdWRpb0NvbnRleHRcclxuICogQHJldHVybnMge3tjcmVhdGVOb3RlOiBjcmVhdGVOb3RlfX1cclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBOb2lzZXNJbnN0cnVtZW50UGFjayhuYW1lLCBhdWRpb0NvbnRleHQpIHtcclxuICAgIHZhciB0eXBlcyA9IFtcclxuICAgICAgICAnd2hpdGUnLFxyXG4gICAgICAgICdwaW5rJyxcclxuICAgICAgICAnYnJvd24nLFxyXG4gICAgICAgICdicm93bmlhbicsXHJcbiAgICAgICAgJ3JlZCdcclxuICAgIF07XHJcblxyXG4gICAgaWYgKHR5cGVzLmluZGV4T2YobmFtZSkgPT09IC0xKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG5hbWUgKyAnIGlzIG5vdCBhIHZhbGlkIG5vaXNlIHNvdW5kJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjcmVhdGVOb3RlOiBmdW5jdGlvbihkZXN0aW5hdGlvbikge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3doaXRlJzpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlV2hpdGVOb2lzZShkZXN0aW5hdGlvbik7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdwaW5rJzpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlUGlua05vaXNlKGRlc3RpbmF0aW9uKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2Jyb3duJzpcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2Jyb3duaWFuJzpcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3JlZCc6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUJyb3duaWFuTm9pc2UoZGVzdGluYXRpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVXaGl0ZU5vaXNlKGRlc3RpbmF0aW9uKSB7XHJcbiAgICAgICAgdmFyIGJ1ZmZlclNpemUgPSAyICogYXVkaW9Db250ZXh0LnNhbXBsZVJhdGUsXHJcbiAgICAgICAgICAgIG5vaXNlQnVmZmVyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcigxLCBidWZmZXJTaXplLCBhdWRpb0NvbnRleHQuc2FtcGxlUmF0ZSksXHJcbiAgICAgICAgICAgIG91dHB1dCA9IG5vaXNlQnVmZmVyLmdldENoYW5uZWxEYXRhKDApO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnVmZmVyU2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgICAgIG91dHB1dFtpXSA9IE1hdGgucmFuZG9tKCkgKiAyIC0gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB3aGl0ZU5vaXNlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xyXG4gICAgICAgIHdoaXRlTm9pc2UuYnVmZmVyID0gbm9pc2VCdWZmZXI7XHJcbiAgICAgICAgd2hpdGVOb2lzZS5sb29wID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgd2hpdGVOb2lzZS5jb25uZWN0KGRlc3RpbmF0aW9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHdoaXRlTm9pc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlUGlua05vaXNlKGRlc3RpbmF0aW9uKSB7XHJcbiAgICAgICAgdmFyIGJ1ZmZlclNpemUgPSAyICogYXVkaW9Db250ZXh0LnNhbXBsZVJhdGUsXHJcbiAgICAgICAgICAgIG5vaXNlQnVmZmVyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcigxLCBidWZmZXJTaXplLCBhdWRpb0NvbnRleHQuc2FtcGxlUmF0ZSksXHJcbiAgICAgICAgICAgIG91dHB1dCA9IG5vaXNlQnVmZmVyLmdldENoYW5uZWxEYXRhKDApLFxyXG4gICAgICAgICAgICBiMCwgYjEsIGIyLCBiMywgYjQsIGI1LCBiNjtcclxuXHJcbiAgICAgICAgYjAgPSBiMSA9IGIyID0gYjMgPSBiNCA9IGI1ID0gYjYgPSAwLjA7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBidWZmZXJTaXplOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHdoaXRlID0gTWF0aC5yYW5kb20oKSAqIDIgLSAxO1xyXG4gICAgICAgICAgICBiMCA9IDAuOTk4ODYgKiBiMCArIHdoaXRlICogMC4wNTU1MTc5O1xyXG4gICAgICAgICAgICBiMSA9IDAuOTkzMzIgKiBiMSArIHdoaXRlICogMC4wNzUwNzU5O1xyXG4gICAgICAgICAgICBiMiA9IDAuOTY5MDAgKiBiMiArIHdoaXRlICogMC4xNTM4NTIwO1xyXG4gICAgICAgICAgICBiMyA9IDAuODY2NTAgKiBiMyArIHdoaXRlICogMC4zMTA0ODU2O1xyXG4gICAgICAgICAgICBiNCA9IDAuNTUwMDAgKiBiNCArIHdoaXRlICogMC41MzI5NTIyO1xyXG4gICAgICAgICAgICBiNSA9IC0wLjc2MTYgKiBiNSAtIHdoaXRlICogMC4wMTY4OTgwO1xyXG4gICAgICAgICAgICBvdXRwdXRbaV0gPSBiMCArIGIxICsgYjIgKyBiMyArIGI0ICsgYjUgKyBiNiArIHdoaXRlICogMC41MzYyO1xyXG4gICAgICAgICAgICBvdXRwdXRbaV0gKj0gMC4xMTtcclxuICAgICAgICAgICAgYjYgPSB3aGl0ZSAqIDAuMTE1OTI2O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHBpbmtOb2lzZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcclxuICAgICAgICBwaW5rTm9pc2UuYnVmZmVyID0gbm9pc2VCdWZmZXI7XHJcbiAgICAgICAgcGlua05vaXNlLmxvb3AgPSB0cnVlO1xyXG5cclxuICAgICAgICBwaW5rTm9pc2UuY29ubmVjdChkZXN0aW5hdGlvbik7XHJcblxyXG4gICAgICAgIHJldHVybiBwaW5rTm9pc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlQnJvd25pYW5Ob2lzZShkZXN0aW5hdGlvbikge1xyXG4gICAgICAgIHZhciBidWZmZXJTaXplID0gMiAqIGF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlLFxyXG4gICAgICAgICAgICBub2lzZUJ1ZmZlciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXIoMSwgYnVmZmVyU2l6ZSwgYXVkaW9Db250ZXh0LnNhbXBsZVJhdGUpLFxyXG4gICAgICAgICAgICBvdXRwdXQgPSBub2lzZUJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKSxcclxuICAgICAgICAgICAgbGFzdE91dCA9IDAuMDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJ1ZmZlclNpemU7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgd2hpdGUgPSBNYXRoLnJhbmRvbSgpICogMiAtIDE7XHJcbiAgICAgICAgICAgIG91dHB1dFtpXSA9IChsYXN0T3V0ICsgKDAuMDIgKiB3aGl0ZSkpIC8gMS4wMjtcclxuICAgICAgICAgICAgbGFzdE91dCA9IG91dHB1dFtpXTtcclxuICAgICAgICAgICAgb3V0cHV0W2ldICo9IDMuNTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBicm93bmlhbk5vaXNlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xyXG4gICAgICAgIGJyb3duaWFuTm9pc2UuYnVmZmVyID0gbm9pc2VCdWZmZXI7XHJcbiAgICAgICAgYnJvd25pYW5Ob2lzZS5sb29wID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgYnJvd25pYW5Ob2lzZS5jb25uZWN0KGRlc3RpbmF0aW9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJyb3duaWFuTm9pc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbn0se31dLDQ6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xyXG4vKipcclxuICogQmFuZC5qcyAtIE11c2ljIENvbXBvc2VyXHJcbiAqIEFuIGludGVyZmFjZSBmb3IgdGhlIFdlYiBBdWRpbyBBUEkgdGhhdCBzdXBwb3J0cyByaHl0aG1zLCBtdWx0aXBsZSBpbnN0cnVtZW50cywgcmVwZWF0aW5nIHNlY3Rpb25zLCBhbmQgY29tcGxleFxyXG4gKiB0aW1lIHNpZ25hdHVyZXMuXHJcbiAqXHJcbiAqIEBhdXRob3IgQ29keSBMdW5kcXVpc3QgKGh0dHA6Ly9naXRodWIuY29tL21lZW5pZSkgLSAyMDE0XHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IE9zY2lsbGF0b3JJbnN0cnVtZW50UGFjaztcclxuXHJcbi8qKlxyXG4gKiBPc2NpbGxhdG9yIEluc3RydW1lbnQgUGFja1xyXG4gKlxyXG4gKiBAcGFyYW0gbmFtZVxyXG4gKiBAcGFyYW0gYXVkaW9Db250ZXh0XHJcbiAqIEByZXR1cm5zIHt7Y3JlYXRlTm90ZTogY3JlYXRlTm90ZX19XHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gT3NjaWxsYXRvckluc3RydW1lbnRQYWNrKG5hbWUsIGF1ZGlvQ29udGV4dCkge1xyXG4gICAgdmFyIHR5cGVzID0gWydzaW5lJywgJ3NxdWFyZScsICdzYXd0b290aCcsICd0cmlhbmdsZSddO1xyXG5cclxuICAgIGlmICh0eXBlcy5pbmRleE9mKG5hbWUpID09PSAtMSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihuYW1lICsgJyBpcyBub3QgYSB2YWxpZCBPc2NpbGxhdG9yIHR5cGUnKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNyZWF0ZU5vdGU6IGZ1bmN0aW9uKGRlc3RpbmF0aW9uLCBmcmVxdWVuY3kpIHtcclxuICAgICAgICAgICAgdmFyIG8gPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ29ubmVjdCBub3RlIHRvIHZvbHVtZVxyXG4gICAgICAgICAgICBvLmNvbm5lY3QoZGVzdGluYXRpb24pO1xyXG4gICAgICAgICAgICAvLyBTZXQgcGl0Y2ggdHlwZVxyXG4gICAgICAgICAgICBvLnR5cGUgPSBuYW1lO1xyXG4gICAgICAgICAgICAvLyBTZXQgZnJlcXVlbmN5XHJcbiAgICAgICAgICAgIG8uZnJlcXVlbmN5LnZhbHVlID0gZnJlcXVlbmN5O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG87XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxufSx7fV0sNTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XHJcbi8qKlxyXG4gKiBCYW5kLmpzIC0gTXVzaWMgQ29tcG9zZXJcclxuICogQW4gaW50ZXJmYWNlIGZvciB0aGUgV2ViIEF1ZGlvIEFQSSB0aGF0IHN1cHBvcnRzIHJoeXRobXMsIG11bHRpcGxlIGluc3RydW1lbnRzLCByZXBlYXRpbmcgc2VjdGlvbnMsIGFuZCBjb21wbGV4XHJcbiAqIHRpbWUgc2lnbmF0dXJlcy5cclxuICpcclxuICogQGF1dGhvciBDb2R5IEx1bmRxdWlzdCAoaHR0cDovL2dpdGh1Yi5jb20vbWVlbmllKSAtIDIwMTRcclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gSW5zdHJ1bWVudDtcclxuXHJcbi8qKlxyXG4gKiBJbnN0cnVtZW50IENsYXNzIC0gR2V0cyBpbnN0YW50aWF0ZWQgd2hlbiBgQ29uZHVjdG9yLmNyZWF0ZUluc3RydW1lbnQoKWAgaXMgY2FsbGVkLlxyXG4gKlxyXG4gKiBAcGFyYW0gbmFtZVxyXG4gKiBAcGFyYW0gcGFja1xyXG4gKiBAcGFyYW0gY29uZHVjdG9yXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gSW5zdHJ1bWVudChuYW1lLCBwYWNrLCBjb25kdWN0b3IpIHtcclxuICAgIC8vIERlZmF1bHQgdG8gU2luZSBPc2NpbGxhdG9yXHJcbiAgICBpZiAoISBuYW1lKSB7XHJcbiAgICAgICAgbmFtZSA9ICdzaW5lJztcclxuICAgIH1cclxuICAgIGlmICghIHBhY2spIHtcclxuICAgICAgICBwYWNrID0gJ29zY2lsbGF0b3JzJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIGNvbmR1Y3Rvci5wYWNrcy5pbnN0cnVtZW50W3BhY2tdID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihwYWNrICsgJyBpcyBub3QgYSBjdXJyZW50bHkgbG9hZGVkIEluc3RydW1lbnQgUGFjay4nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhlbHBlciBmdW5jdGlvbiB0byBmaWd1cmUgb3V0IGhvdyBsb25nIGEgbm90ZSBpc1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSByaHl0aG1cclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGdldER1cmF0aW9uKHJoeXRobSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgY29uZHVjdG9yLm5vdGVzW3JoeXRobV0gPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihyaHl0aG0gKyAnIGlzIG5vdCBhIGNvcnJlY3Qgcmh5dGhtLicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbmR1Y3Rvci5ub3Rlc1tyaHl0aG1dICogY29uZHVjdG9yLnRlbXBvIC8gY29uZHVjdG9yLm5vdGVHZXRzQmVhdCAqIDEwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSGVscGVyIGZ1bmN0aW9uIHRvIGNsb25lIGFuIG9iamVjdFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBvYmpcclxuICAgICAqIEByZXR1cm5zIHtjb3B5fVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBjbG9uZShvYmopIHtcclxuICAgICAgICBpZiAobnVsbCA9PT0gb2JqIHx8IFwib2JqZWN0XCIgIT0gdHlwZW9mIG9iaikge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY29weSA9IG9iai5jb25zdHJ1Y3RvcigpO1xyXG4gICAgICAgIGZvciAodmFyIGF0dHIgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoYXR0cikpIHtcclxuICAgICAgICAgICAgICAgIGNvcHlbYXR0cl0gPSBvYmpbYXR0cl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjb3B5O1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgdmFyIGluc3RydW1lbnQgPSB0aGlzLFxyXG4gICAgICAgIGxhc3RSZXBlYXRDb3VudCA9IDAsXHJcbiAgICAgICAgdm9sdW1lTGV2ZWwgPSAxLFxyXG4gICAgICAgIGFydGljdWxhdGlvbkdhcFBlcmNlbnRhZ2UgPSAwLjA1O1xyXG5cclxuICAgIGluc3RydW1lbnQudG90YWxEdXJhdGlvbiA9IDA7XHJcbiAgICBpbnN0cnVtZW50LmJ1ZmZlclBvc2l0aW9uID0gMDtcclxuICAgIGluc3RydW1lbnQuaW5zdHJ1bWVudCA9IGNvbmR1Y3Rvci5wYWNrcy5pbnN0cnVtZW50W3BhY2tdKG5hbWUsIGNvbmR1Y3Rvci5hdWRpb0NvbnRleHQpO1xyXG4gICAgaW5zdHJ1bWVudC5ub3RlcyA9IFtdO1xyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFNldCB2b2x1bWUgbGV2ZWwgZm9yIGFuIGluc3RydW1lbnRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbmV3Vm9sdW1lTGV2ZWxcclxuICAgICAqL1xyXG4gICAgaW5zdHJ1bWVudC5zZXRWb2x1bWUgPSBmdW5jdGlvbihuZXdWb2x1bWVMZXZlbCkge1xyXG4gICAgICAgIGlmIChuZXdWb2x1bWVMZXZlbCA+IDEpIHtcclxuICAgICAgICAgICAgbmV3Vm9sdW1lTGV2ZWwgPSBuZXdWb2x1bWVMZXZlbCAvIDEwMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdm9sdW1lTGV2ZWwgPSBuZXdWb2x1bWVMZXZlbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGluc3RydW1lbnQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgbm90ZSB0byBhbiBpbnN0cnVtZW50XHJcbiAgICAgKiBAcGFyYW0gcmh5dGhtXHJcbiAgICAgKiBAcGFyYW0gW3BpdGNoXSAtIENvbW1hIHNlcGFyYXRlZCBzdHJpbmcgaWYgbW9yZSB0aGFuIG9uZSBwaXRjaFxyXG4gICAgICogQHBhcmFtIFt0aWVdXHJcbiAgICAgKi9cclxuICAgIGluc3RydW1lbnQubm90ZSA9IGZ1bmN0aW9uKHJoeXRobSwgcGl0Y2gsIHRpZSkge1xyXG4gICAgICAgIHZhciBkdXJhdGlvbiA9IGdldER1cmF0aW9uKHJoeXRobSksXHJcbiAgICAgICAgICAgIGFydGljdWxhdGlvbkdhcCA9IHRpZSA/IDAgOiBkdXJhdGlvbiAqIGFydGljdWxhdGlvbkdhcFBlcmNlbnRhZ2U7XHJcblxyXG4gICAgICAgIGlmIChwaXRjaCkge1xyXG4gICAgICAgICAgICBwaXRjaCA9IHBpdGNoLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IC0xO1xyXG4gICAgICAgICAgICB3aGlsZSAoKysgaW5kZXggPCBwaXRjaC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwID0gcGl0Y2hbaW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgcCA9IHAudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25kdWN0b3IucGl0Y2hlc1twXSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBwID0gcGFyc2VGbG9hdChwKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNOYU4ocCkgfHwgcCA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHAgKyAnIGlzIG5vdCBhIHZhbGlkIHBpdGNoLicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5zdHJ1bWVudC5ub3Rlcy5wdXNoKHtcclxuICAgICAgICAgICAgcmh5dGhtOiByaHl0aG0sXHJcbiAgICAgICAgICAgIHBpdGNoOiBwaXRjaCxcclxuICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxyXG4gICAgICAgICAgICBhcnRpY3VsYXRpb25HYXA6IGFydGljdWxhdGlvbkdhcCxcclxuICAgICAgICAgICAgdGllOiB0aWUsXHJcbiAgICAgICAgICAgIHN0YXJ0VGltZTogaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uLFxyXG4gICAgICAgICAgICBzdG9wVGltZTogaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uICsgZHVyYXRpb24gLSBhcnRpY3VsYXRpb25HYXAsXHJcbiAgICAgICAgICAgIC8vIFZvbHVtZSBuZWVkcyB0byBiZSBhIHF1YXJ0ZXIgb2YgdGhlIG1hc3RlciBzbyBpdCBkb2Vzbid0IGNsaXBcclxuICAgICAgICAgICAgdm9sdW1lTGV2ZWw6IHZvbHVtZUxldmVsIC8gNFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpbnN0cnVtZW50LnRvdGFsRHVyYXRpb24gKz0gZHVyYXRpb247XHJcblxyXG4gICAgICAgIHJldHVybiBpbnN0cnVtZW50O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIHJlc3QgdG8gYW4gaW5zdHJ1bWVudFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSByaHl0aG1cclxuICAgICAqL1xyXG4gICAgaW5zdHJ1bWVudC5yZXN0ID0gZnVuY3Rpb24ocmh5dGhtKSB7XHJcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gZ2V0RHVyYXRpb24ocmh5dGhtKTtcclxuXHJcbiAgICAgICAgaW5zdHJ1bWVudC5ub3Rlcy5wdXNoKHtcclxuICAgICAgICAgICAgcmh5dGhtOiByaHl0aG0sXHJcbiAgICAgICAgICAgIHBpdGNoOiBmYWxzZSxcclxuICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxyXG4gICAgICAgICAgICBhcnRpY3VsYXRpb25HYXA6IDAsXHJcbiAgICAgICAgICAgIHN0YXJ0VGltZTogaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uLFxyXG4gICAgICAgICAgICBzdG9wVGltZTogaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uICsgZHVyYXRpb25cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uICs9IGR1cmF0aW9uO1xyXG5cclxuICAgICAgICByZXR1cm4gaW5zdHJ1bWVudDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQbGFjZSB3aGVyZSBhIHJlcGVhdCBzZWN0aW9uIHNob3VsZCBzdGFydFxyXG4gICAgICovXHJcbiAgICBpbnN0cnVtZW50LnJlcGVhdFN0YXJ0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGFzdFJlcGVhdENvdW50ID0gaW5zdHJ1bWVudC5ub3Rlcy5sZW5ndGg7XHJcblxyXG4gICAgICAgIHJldHVybiBpbnN0cnVtZW50O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlcGVhdCBmcm9tIGJlZ2lubmluZ1xyXG4gICAgICovXHJcbiAgICBpbnN0cnVtZW50LnJlcGVhdEZyb21CZWdpbm5pbmcgPSBmdW5jdGlvbihudW1PZlJlcGVhdHMpIHtcclxuICAgICAgICBsYXN0UmVwZWF0Q291bnQgPSAwO1xyXG4gICAgICAgIGluc3RydW1lbnQucmVwZWF0KG51bU9mUmVwZWF0cyk7XHJcblxyXG4gICAgICAgIHJldHVybiBpbnN0cnVtZW50O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE51bWJlciBvZiB0aW1lcyB0aGUgc2VjdGlvbiBzaG91bGQgcmVwZWF0XHJcbiAgICAgKiBAcGFyYW0gW251bU9mUmVwZWF0c10gLSBkZWZhdWx0cyB0byAxXHJcbiAgICAgKi9cclxuICAgIGluc3RydW1lbnQucmVwZWF0ID0gZnVuY3Rpb24obnVtT2ZSZXBlYXRzKSB7XHJcbiAgICAgICAgbnVtT2ZSZXBlYXRzID0gdHlwZW9mIG51bU9mUmVwZWF0cyA9PT0gJ3VuZGVmaW5lZCcgPyAxIDogbnVtT2ZSZXBlYXRzO1xyXG4gICAgICAgIHZhciBub3Rlc0J1ZmZlckNvcHkgPSBpbnN0cnVtZW50Lm5vdGVzLnNsaWNlKGxhc3RSZXBlYXRDb3VudCk7XHJcbiAgICAgICAgZm9yICh2YXIgciA9IDA7IHIgPCBudW1PZlJlcGVhdHM7IHIgKyspIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgIHdoaWxlICgrK2luZGV4IDwgbm90ZXNCdWZmZXJDb3B5Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5vdGVDb3B5ID0gY2xvbmUobm90ZXNCdWZmZXJDb3B5W2luZGV4XSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbm90ZUNvcHkuc3RhcnRUaW1lID0gaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgbm90ZUNvcHkuc3RvcFRpbWUgPSBpbnN0cnVtZW50LnRvdGFsRHVyYXRpb24gKyBub3RlQ29weS5kdXJhdGlvbiAtIG5vdGVDb3B5LmFydGljdWxhdGlvbkdhcDtcclxuXHJcbiAgICAgICAgICAgICAgICBpbnN0cnVtZW50Lm5vdGVzLnB1c2gobm90ZUNvcHkpO1xyXG4gICAgICAgICAgICAgICAgaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uICs9IG5vdGVDb3B5LmR1cmF0aW9uO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaW5zdHJ1bWVudDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXNldCB0aGUgZHVyYXRpb24sIHN0YXJ0LCBhbmQgc3RvcCB0aW1lIG9mIGVhY2ggbm90ZS5cclxuICAgICAqL1xyXG4gICAgaW5zdHJ1bWVudC5yZXNldER1cmF0aW9uID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gLTEsXHJcbiAgICAgICAgICAgIG51bU9mTm90ZXMgPSBpbnN0cnVtZW50Lm5vdGVzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uID0gMDtcclxuXHJcbiAgICAgICAgd2hpbGUgKCsraW5kZXggPCBudW1PZk5vdGVzKSB7XHJcbiAgICAgICAgICAgIHZhciBub3RlID0gaW5zdHJ1bWVudC5ub3Rlc1tpbmRleF0sXHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbiA9IGdldER1cmF0aW9uKG5vdGUucmh5dGhtKSxcclxuICAgICAgICAgICAgICAgIGFydGljdWxhdGlvbkdhcCA9IG5vdGUudGllID8gMCA6IGR1cmF0aW9uICogYXJ0aWN1bGF0aW9uR2FwUGVyY2VudGFnZTtcclxuXHJcbiAgICAgICAgICAgIG5vdGUuZHVyYXRpb24gPSBnZXREdXJhdGlvbihub3RlLnJoeXRobSk7XHJcbiAgICAgICAgICAgIG5vdGUuc3RhcnRUaW1lID0gaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uO1xyXG4gICAgICAgICAgICBub3RlLnN0b3BUaW1lID0gaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uICsgZHVyYXRpb24gLSBhcnRpY3VsYXRpb25HYXA7XHJcblxyXG4gICAgICAgICAgICBpZiAobm90ZS5waXRjaCAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIG5vdGUuYXJ0aWN1bGF0aW9uR2FwID0gYXJ0aWN1bGF0aW9uR2FwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpbnN0cnVtZW50LnRvdGFsRHVyYXRpb24gKz0gZHVyYXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxufSx7fV0sNjpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XHJcbi8qKlxyXG4gKiBCYW5kLmpzIC0gTXVzaWMgQ29tcG9zZXJcclxuICogQW4gaW50ZXJmYWNlIGZvciB0aGUgV2ViIEF1ZGlvIEFQSSB0aGF0IHN1cHBvcnRzIHJoeXRobXMsIG11bHRpcGxlIGluc3RydW1lbnRzLCByZXBlYXRpbmcgc2VjdGlvbnMsIGFuZCBjb21wbGV4XHJcbiAqIHRpbWUgc2lnbmF0dXJlcy5cclxuICpcclxuICogQGF1dGhvciBDb2R5IEx1bmRxdWlzdCAoaHR0cDovL2dpdGh1Yi5jb20vbWVlbmllKSAtIDIwMTRcclxuICovXHJcblxyXG4vKipcclxuICogQHR5cGUge0JhbmRKU31cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gX2RlcmVxXygnLi9jb25kdWN0b3IuanMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmxvYWRQYWNrKCdpbnN0cnVtZW50JywgJ25vaXNlcycsIF9kZXJlcV8oJy4vaW5zdHJ1bWVudC1wYWNrcy9ub2lzZXMuanMnKSk7XHJcbm1vZHVsZS5leHBvcnRzLmxvYWRQYWNrKCdpbnN0cnVtZW50JywgJ29zY2lsbGF0b3JzJywgX2RlcmVxXygnLi9pbnN0cnVtZW50LXBhY2tzL29zY2lsbGF0b3JzLmpzJykpO1xyXG5tb2R1bGUuZXhwb3J0cy5sb2FkUGFjaygncmh5dGhtJywgJ25vcnRoQW1lcmljYW4nLCBfZGVyZXFfKCcuL3JoeXRobS1wYWNrcy9ub3J0aC1hbWVyaWNhbi5qcycpKTtcclxubW9kdWxlLmV4cG9ydHMubG9hZFBhY2soJ3JoeXRobScsICdldXJvcGVhbicsIF9kZXJlcV8oJy4vcmh5dGhtLXBhY2tzL2V1cm9wZWFuLmpzJykpO1xyXG5tb2R1bGUuZXhwb3J0cy5sb2FkUGFjaygndHVuaW5nJywgJ2VxdWFsVGVtcGVyYW1lbnQnLCBfZGVyZXFfKCcuL3R1bmluZy1wYWNrcy9lcXVhbC10ZW1wZXJhbWVudC5qcycpKTtcclxuXHJcbn0se1wiLi9jb25kdWN0b3IuanNcIjoyLFwiLi9pbnN0cnVtZW50LXBhY2tzL25vaXNlcy5qc1wiOjMsXCIuL2luc3RydW1lbnQtcGFja3Mvb3NjaWxsYXRvcnMuanNcIjo0LFwiLi9yaHl0aG0tcGFja3MvZXVyb3BlYW4uanNcIjo4LFwiLi9yaHl0aG0tcGFja3Mvbm9ydGgtYW1lcmljYW4uanNcIjo5LFwiLi90dW5pbmctcGFja3MvZXF1YWwtdGVtcGVyYW1lbnQuanNcIjoxMH1dLDc6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xyXG4vKipcclxuICogQmFuZC5qcyAtIE11c2ljIENvbXBvc2VyXHJcbiAqIEFuIGludGVyZmFjZSBmb3IgdGhlIFdlYiBBdWRpbyBBUEkgdGhhdCBzdXBwb3J0cyByaHl0aG1zLCBtdWx0aXBsZSBpbnN0cnVtZW50cywgcmVwZWF0aW5nIHNlY3Rpb25zLCBhbmQgY29tcGxleFxyXG4gKiB0aW1lIHNpZ25hdHVyZXMuXHJcbiAqXHJcbiAqIEBhdXRob3IgQ29keSBMdW5kcXVpc3QgKGh0dHA6Ly9naXRodWIuY29tL21lZW5pZSkgLSAyMDE0XHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjtcclxuXHJcbi8qKlxyXG4gKiBQbGF5ZXIgQ2xhc3MgLSBUaGlzIGdldHMgaW5zdGFudGlhdGVkIGJ5IHRoZSBDb25kdWN0b3IgY2xhc3Mgd2hlbiBgQ29uZHVjdG9yLmZpbmlzaCgpYCBpcyBjYWxsZWRcclxuICpcclxuICogQHBhcmFtIGNvbmR1Y3RvclxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIFBsYXllcihjb25kdWN0b3IpIHtcclxuICAgIHZhciBwbGF5ZXIgPSB0aGlzLFxyXG4gICAgICAgIGJ1ZmZlclRpbWVvdXQsXHJcbiAgICAgICAgYWxsTm90ZXMgPSBidWZmZXJOb3RlcygpLFxyXG4gICAgICAgIGN1cnJlbnRQbGF5VGltZSxcclxuICAgICAgICB0b3RhbFBsYXlUaW1lID0gMCxcclxuICAgICAgICBmYWRlZCA9IGZhbHNlO1xyXG5cclxuICAgIGNhbGN1bGF0ZVRvdGFsRHVyYXRpb24oKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEhlbHBlciBmdW5jdGlvbiB0byBzdG9wIGFsbCBub3RlcyBhbmRcclxuICAgICAqIHRoZW4gcmUtYnVmZmVycyB0aGVtXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbcmVzZXREdXJhdGlvbl1cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gcmVzZXQocmVzZXREdXJhdGlvbikge1xyXG4gICAgICAgIC8vIFJlc2V0IHRoZSBidWZmZXIgcG9zaXRpb24gb2YgYWxsIGluc3RydW1lbnRzXHJcbiAgICAgICAgdmFyIGluZGV4ID0gLTEsXHJcbiAgICAgICAgICAgIG51bU9mSW5zdHJ1bWVudHMgPSBjb25kdWN0b3IuaW5zdHJ1bWVudHMubGVuZ3RoO1xyXG4gICAgICAgIHdoaWxlICgrK2luZGV4IDwgbnVtT2ZJbnN0cnVtZW50cykge1xyXG4gICAgICAgICAgICB2YXIgaW5zdHJ1bWVudCA9IGNvbmR1Y3Rvci5pbnN0cnVtZW50c1tpbmRleF07XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzZXREdXJhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgaW5zdHJ1bWVudC5yZXNldER1cmF0aW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaW5zdHJ1bWVudC5idWZmZXJQb3NpdGlvbiA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBJZiB3ZSBhcmUgcmVzZXRpbmcgdGhlIGR1cmF0aW9uLCB3ZSBuZWVkIHRvIGZpZ3VyZSBvdXQgdGhlIG5ldyB0b3RhbCBkdXJhdGlvbi5cclxuICAgICAgICAvLyBBbHNvIHNldCB0aGUgdG90YWxQbGF5VGltZSB0byB0aGUgY3VycmVudCBwZXJjZW50YWdlIGRvbmUgb2YgdGhlIG5ldyB0b3RhbCBkdXJhdGlvbi5cclxuICAgICAgICBpZiAocmVzZXREdXJhdGlvbikge1xyXG4gICAgICAgICAgICBjYWxjdWxhdGVUb3RhbER1cmF0aW9uKCk7XHJcbiAgICAgICAgICAgIHRvdGFsUGxheVRpbWUgPSBjb25kdWN0b3IucGVyY2VudGFnZUNvbXBsZXRlICogY29uZHVjdG9yLnRvdGFsRHVyYXRpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbmRleCA9IC0xO1xyXG4gICAgICAgIHdoaWxlICgrK2luZGV4IDwgYWxsTm90ZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGFsbE5vdGVzW2luZGV4XS5nYWluLmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsZWFyVGltZW91dChidWZmZXJUaW1lb3V0KTtcclxuXHJcbiAgICAgICAgYWxsTm90ZXMgPSBidWZmZXJOb3RlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSGVscGVyIGZ1bmN0aW9uIHRvIGZhZGUgdXAvZG93biBtYXN0ZXIgdm9sdW1lXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGRpcmVjdGlvbiAtIHVwIG9yIGRvd25cclxuICAgICAqIEBwYXJhbSBbY2JdIC0gQ2FsbGJhY2sgZnVuY3Rpb24gZmlyZWQgYWZ0ZXIgdGhlIHRyYW5zaXRpb24gaXMgY29tcGxldGVkXHJcbiAgICAgKiBAcGFyYW0gW3Jlc2V0Vm9sdW1lXSAtIFJlc2V0IHRoZSB2b2x1bWUgYmFjayB0byBpdCdzIG9yaWdpbmFsIGxldmVsXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGZhZGUoZGlyZWN0aW9uLCBjYiwgcmVzZXRWb2x1bWUpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHJlc2V0Vm9sdW1lID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICByZXNldFZvbHVtZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoJ3VwJyAhPT0gZGlyZWN0aW9uICYmICdkb3duJyAhPT0gZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGlyZWN0aW9uIG11c3QgYmUgZWl0aGVyIHVwIG9yIGRvd24uJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZmFkZUR1cmF0aW9uID0gMC4yO1xyXG5cclxuICAgICAgICBmYWRlZCA9IGRpcmVjdGlvbiA9PT0gJ2Rvd24nO1xyXG5cclxuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAndXAnKSB7XHJcbiAgICAgICAgICAgIGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWUuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCBjb25kdWN0b3IuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lKTtcclxuICAgICAgICAgICAgY29uZHVjdG9yLm1hc3RlclZvbHVtZS5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWVMZXZlbCwgY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSArIGZhZGVEdXJhdGlvbik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uZHVjdG9yLm1hc3RlclZvbHVtZS5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWVMZXZlbCwgY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XHJcbiAgICAgICAgICAgIGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWUuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCBjb25kdWN0b3IuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lICsgZmFkZUR1cmF0aW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIGNiLmNhbGwocGxheWVyKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHJlc2V0Vm9sdW1lKSB7XHJcbiAgICAgICAgICAgICAgICBmYWRlZCA9ICEgZmFkZWQ7XHJcbiAgICAgICAgICAgICAgICBjb25kdWN0b3IubWFzdGVyVm9sdW1lLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoY29uZHVjdG9yLm1hc3RlclZvbHVtZUxldmVsLCBjb25kdWN0b3IuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIGZhZGVEdXJhdGlvbiAqIDEwMDApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlcyB0aGUgdG90YWwgZHVyYXRpb24gb2YgYSBzb25nIGJhc2VkIG9uIHRoZSBsb25nZXN0IGR1cmF0aW9uIG9mIGFsbCBpbnN0cnVtZW50cy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlVG90YWxEdXJhdGlvbigpIHtcclxuICAgICAgICB2YXIgaW5kZXggPSAtMTtcclxuICAgICAgICB2YXIgdG90YWxEdXJhdGlvbiA9IDA7XHJcbiAgICAgICAgd2hpbGUgKCsraW5kZXggPCBjb25kdWN0b3IuaW5zdHJ1bWVudHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHZhciBpbnN0cnVtZW50ID0gY29uZHVjdG9yLmluc3RydW1lbnRzW2luZGV4XTtcclxuICAgICAgICAgICAgaWYgKGluc3RydW1lbnQudG90YWxEdXJhdGlvbiA+IHRvdGFsRHVyYXRpb24pIHtcclxuICAgICAgICAgICAgICAgIHRvdGFsRHVyYXRpb24gPSBpbnN0cnVtZW50LnRvdGFsRHVyYXRpb247XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbmR1Y3Rvci50b3RhbER1cmF0aW9uID0gdG90YWxEdXJhdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdyYWJzIGEgc2V0IG9mIG5vdGVzIGJhc2VkIG9uIHRoZSBjdXJyZW50IHRpbWUgYW5kIHdoYXQgdGhlIEJ1ZmZlciBTaXplIGlzLlxyXG4gICAgICogSXQgd2lsbCBhbHNvIHNraXAgYW55IG5vdGVzIHRoYXQgaGF2ZSBhIHN0YXJ0IHRpbWUgbGVzcyB0aGFuIHRoZVxyXG4gICAgICogdG90YWwgcGxheSB0aW1lLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYnVmZmVyTm90ZXMoKSB7XHJcbiAgICAgICAgdmFyIG5vdGVzID0gW10sXHJcbiAgICAgICAgICAgIGluZGV4ID0gLTEsXHJcbiAgICAgICAgICAgIGJ1ZmZlclNpemUgPSBjb25kdWN0b3Iubm90ZUJ1ZmZlckxlbmd0aDtcclxuXHJcbiAgICAgICAgd2hpbGUgKCsraW5kZXggPCBjb25kdWN0b3IuaW5zdHJ1bWVudHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHZhciBpbnN0cnVtZW50ID0gY29uZHVjdG9yLmluc3RydW1lbnRzW2luZGV4XTtcclxuICAgICAgICAgICAgLy8gQ3JlYXRlIHZvbHVtZSBmb3IgdGhpcyBpbnN0cnVtZW50XHJcbiAgICAgICAgICAgIHZhciBidWZmZXJDb3VudCA9IGJ1ZmZlclNpemU7XHJcbiAgICAgICAgICAgIHZhciBpbmRleDIgPSAtMTtcclxuICAgICAgICAgICAgd2hpbGUgKCsraW5kZXgyIDwgYnVmZmVyQ291bnQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBub3RlID0gaW5zdHJ1bWVudC5ub3Rlc1tpbnN0cnVtZW50LmJ1ZmZlclBvc2l0aW9uICsgaW5kZXgyXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG5vdGUgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHBpdGNoID0gbm90ZS5waXRjaCxcclxuICAgICAgICAgICAgICAgICAgICBzdGFydFRpbWUgPSBub3RlLnN0YXJ0VGltZSxcclxuICAgICAgICAgICAgICAgICAgICBzdG9wVGltZSA9IG5vdGUuc3RvcFRpbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdm9sdW1lTGV2ZWwgPSBub3RlLnZvbHVtZUxldmVsO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzdG9wVGltZSA8IHRvdGFsUGxheVRpbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBidWZmZXJDb3VudCArKztcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBJZiBwaXRjaCBpcyBmYWxzZSwgdGhlbiBpdCdzIGEgcmVzdCBhbmQgd2UgZG9uJ3QgbmVlZCBhIG5vdGVcclxuICAgICAgICAgICAgICAgIGlmIChmYWxzZSA9PT0gcGl0Y2gpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZ2FpbiA9IGNvbmR1Y3Rvci5hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xyXG4gICAgICAgICAgICAgICAgLy8gQ29ubmVjdCB2b2x1bWUgZ2FpbiB0byB0aGUgTWFzdGVyIFZvbHVtZTtcclxuICAgICAgICAgICAgICAgIGdhaW4uY29ubmVjdChjb25kdWN0b3IubWFzdGVyVm9sdW1lKTtcclxuICAgICAgICAgICAgICAgIGdhaW4uZ2Fpbi52YWx1ZSA9IHZvbHVtZUxldmVsO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBzdGFydFRpbWUgaXMgbGVzcyB0aGFuIHRvdGFsIHBsYXkgdGltZSwgd2UgbmVlZCB0byBzdGFydCB0aGUgbm90ZVxyXG4gICAgICAgICAgICAgICAgLy8gaW4gdGhlIG1pZGRsZVxyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0VGltZSA8IHRvdGFsUGxheVRpbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydFRpbWUgPSBzdG9wVGltZSAtIHRvdGFsUGxheVRpbWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTm8gcGl0Y2hlcyBkZWZpbmVkXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHBpdGNoID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vdGVzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydFRpbWU6IHN0YXJ0VGltZSA8IHRvdGFsUGxheVRpbWUgPyBzdG9wVGltZSAtIHRvdGFsUGxheVRpbWUgOiBzdGFydFRpbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3BUaW1lOiBzdG9wVGltZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTogaW5zdHJ1bWVudC5pbnN0cnVtZW50LmNyZWF0ZU5vdGUoZ2FpbiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdhaW46IGdhaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZvbHVtZUxldmVsOiB2b2x1bWVMZXZlbFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXgzID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKCsraW5kZXgzIDwgcGl0Y2gubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwID0gcGl0Y2hbaW5kZXgzXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm90ZXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFRpbWU6IHN0YXJ0VGltZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b3BUaW1lOiBzdG9wVGltZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGU6IGluc3RydW1lbnQuaW5zdHJ1bWVudC5jcmVhdGVOb3RlKGdhaW4sIGNvbmR1Y3Rvci5waXRjaGVzW3AudHJpbSgpXSB8fCBwYXJzZUZsb2F0KHApKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhaW46IGdhaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2b2x1bWVMZXZlbDogdm9sdW1lTGV2ZWxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGluc3RydW1lbnQuYnVmZmVyUG9zaXRpb24gKz0gYnVmZmVyQ291bnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBSZXR1cm4gYXJyYXkgb2Ygbm90ZXNcclxuICAgICAgICByZXR1cm4gbm90ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdG90YWxQbGF5VGltZUNhbGN1bGF0b3IoKSB7XHJcbiAgICAgICAgaWYgKCEgcGxheWVyLnBhdXNlZCAmJiBwbGF5ZXIucGxheWluZykge1xyXG4gICAgICAgICAgICBpZiAoY29uZHVjdG9yLnRvdGFsRHVyYXRpb24gPCB0b3RhbFBsYXlUaW1lKSB7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIuc3RvcChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocGxheWVyLmxvb3BpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucGxheSgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uZHVjdG9yLm9uRmluaXNoZWRDYWxsYmFjaygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlVG90YWxQbGF5VGltZSgpO1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCh0b3RhbFBsYXlUaW1lQ2FsY3VsYXRvciwgMTAwMCAvIDYwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGwgdG8gdXBkYXRlIHRoZSB0b3RhbCBwbGF5IHRpbWUgc28gZmFyXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZVRvdGFsUGxheVRpbWUoKSB7XHJcbiAgICAgICAgdG90YWxQbGF5VGltZSArPSBjb25kdWN0b3IuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lIC0gY3VycmVudFBsYXlUaW1lO1xyXG4gICAgICAgIHZhciBzZWNvbmRzID0gTWF0aC5yb3VuZCh0b3RhbFBsYXlUaW1lKTtcclxuICAgICAgICBpZiAoc2Vjb25kcyAhPSBjb25kdWN0b3IuY3VycmVudFNlY29uZHMpIHtcclxuICAgICAgICAgICAgLy8gTWFrZSBjYWxsYmFjayBhc3luY2hyb25vdXNcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbmR1Y3Rvci5vblRpY2tlckNhbGxiYWNrKHNlY29uZHMpO1xyXG4gICAgICAgICAgICB9LCAxKTtcclxuICAgICAgICAgICAgY29uZHVjdG9yLmN1cnJlbnRTZWNvbmRzID0gc2Vjb25kcztcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uZHVjdG9yLnBlcmNlbnRhZ2VDb21wbGV0ZSA9IHRvdGFsUGxheVRpbWUgLyBjb25kdWN0b3IudG90YWxEdXJhdGlvbjtcclxuICAgICAgICBjdXJyZW50UGxheVRpbWUgPSBjb25kdWN0b3IuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYXllci5wYXVzZWQgPSBmYWxzZTtcclxuICAgIHBsYXllci5wbGF5aW5nID0gZmFsc2U7XHJcbiAgICBwbGF5ZXIubG9vcGluZyA9IGZhbHNlO1xyXG4gICAgcGxheWVyLm11dGVkID0gZmFsc2U7XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogR3JhYnMgY3VycmVudGx5IGJ1ZmZlcmVkIG5vdGVzIGFuZCBjYWxscyB0aGVpciBzdGFydC9zdG9wIG1ldGhvZHMuXHJcbiAgICAgKlxyXG4gICAgICogSXQgdGhlbiBzZXRzIHVwIGEgdGltZXIgdG8gYnVmZmVyIHVwIHRoZSBuZXh0IHNldCBvZiBub3RlcyBiYXNlZCBvbiB0aGVcclxuICAgICAqIGEgc2V0IGJ1ZmZlciBzaXplLiAgVGhpcyB3aWxsIGtlZXAgZ29pbmcgdW50aWwgdGhlIHNvbmcgaXMgc3RvcHBlZCBvciBwYXVzZWQuXHJcbiAgICAgKlxyXG4gICAgICogSXQgd2lsbCB1c2UgdGhlIHRvdGFsIHRpbWUgcGxheWVkIHNvIGZhciBhcyBhbiBvZmZzZXQgc28geW91IHBhdXNlL3BsYXkgdGhlIG11c2ljXHJcbiAgICAgKi9cclxuICAgIHBsYXllci5wbGF5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcGxheWVyLnBsYXlpbmcgPSB0cnVlO1xyXG4gICAgICAgIHBsYXllci5wYXVzZWQgPSBmYWxzZTtcclxuICAgICAgICBjdXJyZW50UGxheVRpbWUgPSBjb25kdWN0b3IuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xyXG4gICAgICAgIC8vIFN0YXJ0cyBjYWxjdWxhdG9yIHdoaWNoIGtlZXBzIHRyYWNrIG9mIHRvdGFsIHBsYXkgdGltZVxyXG4gICAgICAgIHRvdGFsUGxheVRpbWVDYWxjdWxhdG9yKCk7XHJcbiAgICAgICAgdmFyIHRpbWVPZmZzZXQgPSBjb25kdWN0b3IuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lIC0gdG90YWxQbGF5VGltZSxcclxuICAgICAgICAgICAgcGxheU5vdGVzID0gZnVuY3Rpb24obm90ZXMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKCsraW5kZXggPCBub3Rlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbm90ZSA9IG5vdGVzW2luZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhcnRUaW1lID0gbm90ZS5zdGFydFRpbWUgKyB0aW1lT2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9wVGltZSA9IG5vdGUuc3RvcFRpbWUgKyB0aW1lT2Zmc2V0O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgKiBJZiBubyB0aWUsIHRoZW4gd2UgbmVlZCB0byBpbnRyb2R1Y2UgYSB2b2x1bWUgcmFtcCB1cCB0byByZW1vdmUgYW55IGNsaXBwaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICogYXMgT3NjaWxsYXRvcnMgaGF2ZSBhbiBpc3N1ZSB3aXRoIHRoaXMgd2hlbiBwbGF5aW5nIGEgbm90ZSBhdCBmdWxsIHZvbHVtZS5cclxuICAgICAgICAgICAgICAgICAgICAgKiBXZSBhbHNvIHB1dCBpbiBhIHNsaWdodCByYW1wIGRvd24gYXMgd2VsbC4gIFRoaXMgb25seSB0YWtlcyB1cCAxLzEwMDAgb2YgYSBzZWNvbmQuXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEgbm90ZS50aWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXJ0VGltZSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZSAtPSAwLjAwMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9wVGltZSArPSAwLjAwMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm90ZS5nYWluLmdhaW4uc2V0VmFsdWVBdFRpbWUoMC4wLCBzdGFydFRpbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3RlLmdhaW4uZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZShub3RlLnZvbHVtZUxldmVsLCBzdGFydFRpbWUgKyAwLjAwMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdGUuZ2Fpbi5nYWluLnNldFZhbHVlQXRUaW1lKG5vdGUudm9sdW1lTGV2ZWwsIHN0b3BUaW1lIC0gMC4wMDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3RlLmdhaW4uZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLjAsIHN0b3BUaW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG5vdGUubm9kZS5zdGFydChzdGFydFRpbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vdGUubm9kZS5zdG9wKHN0b3BUaW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYnVmZmVyVXAgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGJ1ZmZlclRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uIGJ1ZmZlckluTmV3Tm90ZXMoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBsYXllci5wbGF5aW5nICYmICEgcGxheWVyLnBhdXNlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Tm90ZXMgPSBidWZmZXJOb3RlcygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3Tm90ZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxheU5vdGVzKG5ld05vdGVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbE5vdGVzID0gYWxsTm90ZXMuY29uY2F0KG5ld05vdGVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlclVwKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCBjb25kdWN0b3IudGVtcG8gKiA1MDAwKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcGxheU5vdGVzKGFsbE5vdGVzKTtcclxuICAgICAgICBidWZmZXJVcCgpO1xyXG5cclxuICAgICAgICBpZiAoZmFkZWQgJiYgISBwbGF5ZXIubXV0ZWQpIHtcclxuICAgICAgICAgICAgZmFkZSgndXAnKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBTdG9wIHBsYXlpbmcgYWxsIG11c2ljIGFuZCByZXdpbmQgdGhlIHNvbmdcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZmFkZU91dCBib29sZWFuIC0gc2hvdWxkIHRoZSBzb25nIGZhZGUgb3V0P1xyXG4gICAgICovXHJcbiAgICBwbGF5ZXIuc3RvcCA9IGZ1bmN0aW9uKGZhZGVPdXQpIHtcclxuICAgICAgICBwbGF5ZXIucGxheWluZyA9IGZhbHNlO1xyXG4gICAgICAgIGNvbmR1Y3Rvci5jdXJyZW50U2Vjb25kcyA9IDA7XHJcbiAgICAgICAgY29uZHVjdG9yLnBlcmNlbnRhZ2VDb21wbGV0ZSA9IDA7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgZmFkZU91dCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgZmFkZU91dCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChmYWRlT3V0ICYmICEgcGxheWVyLm11dGVkKSB7XHJcbiAgICAgICAgICAgIGZhZGUoJ2Rvd24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRvdGFsUGxheVRpbWUgPSAwO1xyXG4gICAgICAgICAgICAgICAgcmVzZXQoKTtcclxuICAgICAgICAgICAgICAgIC8vIE1ha2UgY2FsbGJhY2sgYXN5bmNocm9ub3VzXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbmR1Y3Rvci5vblRpY2tlckNhbGxiYWNrKGNvbmR1Y3Rvci5jdXJyZW50U2Vjb25kcyk7XHJcbiAgICAgICAgICAgICAgICB9LCAxKTtcclxuICAgICAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdG90YWxQbGF5VGltZSA9IDA7XHJcbiAgICAgICAgICAgIHJlc2V0KCk7XHJcbiAgICAgICAgICAgIC8vIE1ha2UgY2FsbGJhY2sgYXN5bmNocm9ub3VzXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25kdWN0b3Iub25UaWNrZXJDYWxsYmFjayhjb25kdWN0b3IuY3VycmVudFNlY29uZHMpO1xyXG4gICAgICAgICAgICB9LCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGF1c2VzIHRoZSBtdXNpYywgcmVzZXRzIHRoZSBub3RlcyxcclxuICAgICAqIGFuZCBnZXRzIHRoZSB0b3RhbCB0aW1lIHBsYXllZCBzbyBmYXJcclxuICAgICAqL1xyXG4gICAgcGxheWVyLnBhdXNlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcGxheWVyLnBhdXNlZCA9IHRydWU7XHJcbiAgICAgICAgdXBkYXRlVG90YWxQbGF5VGltZSgpO1xyXG4gICAgICAgIGlmIChwbGF5ZXIubXV0ZWQpIHtcclxuICAgICAgICAgICAgcmVzZXQoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBmYWRlKCdkb3duJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXNldCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHRydWUgaWYgeW91IHdhbnQgdGhlIHNvbmcgdG8gbG9vcFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB2YWxcclxuICAgICAqL1xyXG4gICAgcGxheWVyLmxvb3AgPSBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgICBwbGF5ZXIubG9vcGluZyA9ICEhIHZhbDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgYSBzcGVjaWZpYyB0aW1lIHRoYXQgdGhlIHNvbmcgc2hvdWxkIHN0YXJ0IGl0LlxyXG4gICAgICogSWYgaXQncyBhbHJlYWR5IHBsYXlpbmcsIHJlc2V0IGFuZCBzdGFydCB0aGUgc29uZ1xyXG4gICAgICogYWdhaW4gc28gaXQgaGFzIGEgc2VhbWxlc3MganVtcC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbmV3VGltZVxyXG4gICAgICovXHJcbiAgICBwbGF5ZXIuc2V0VGltZSA9IGZ1bmN0aW9uKG5ld1RpbWUpIHtcclxuICAgICAgICB0b3RhbFBsYXlUaW1lID0gcGFyc2VJbnQobmV3VGltZSk7XHJcbiAgICAgICAgcmVzZXQoKTtcclxuICAgICAgICBpZiAocGxheWVyLnBsYXlpbmcgJiYgISBwbGF5ZXIucGF1c2VkKSB7XHJcbiAgICAgICAgICAgIHBsYXllci5wbGF5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc2V0IHRoZSB0ZW1wbyBmb3IgYSBzb25nLiBUaGlzIHdpbGwgdHJpZ2dlciBhXHJcbiAgICAgKiBkdXJhdGlvbiByZXNldCBmb3IgZWFjaCBpbnN0cnVtZW50IGFzIHdlbGwuXHJcbiAgICAgKi9cclxuICAgIHBsYXllci5yZXNldFRlbXBvID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmVzZXQodHJ1ZSk7XHJcbiAgICAgICAgaWYgKHBsYXllci5wbGF5aW5nICYmICEgcGxheWVyLnBhdXNlZCkge1xyXG4gICAgICAgICAgICBwbGF5ZXIucGxheSgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNdXRlIGFsbCBvZiB0aGUgbXVzaWNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY2IgLSBDYWxsYmFjayBmdW5jdGlvbiBjYWxsZWQgd2hlbiBtdXNpYyBoYXMgYmVlbiBtdXRlZFxyXG4gICAgICovXHJcbiAgICBwbGF5ZXIubXV0ZSA9IGZ1bmN0aW9uKGNiKSB7XHJcbiAgICAgICAgcGxheWVyLm11dGVkID0gdHJ1ZTtcclxuICAgICAgICBmYWRlKCdkb3duJywgY2IpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFVubXV0ZSBhbGwgb2YgdGhlIG11c2ljXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNiIC0gQ2FsbGJhY2sgZnVuY3Rpb24gY2FsbGVkIHdoZW4gbXVzaWMgaGFzIGJlZW4gdW5tdXRlZFxyXG4gICAgICovXHJcbiAgICBwbGF5ZXIudW5tdXRlID0gZnVuY3Rpb24oY2IpIHtcclxuICAgICAgICBwbGF5ZXIubXV0ZWQgPSBmYWxzZTtcclxuICAgICAgICBmYWRlKCd1cCcsIGNiKTtcclxuICAgIH07XHJcbn1cclxuXHJcbn0se31dLDg6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xyXG4vKipcclxuICogQmFuZC5qcyAtIE11c2ljIENvbXBvc2VyXHJcbiAqIEFuIGludGVyZmFjZSBmb3IgdGhlIFdlYiBBdWRpbyBBUEkgdGhhdCBzdXBwb3J0cyByaHl0aG1zLCBtdWx0aXBsZSBpbnN0cnVtZW50cywgcmVwZWF0aW5nIHNlY3Rpb25zLCBhbmQgY29tcGxleFxyXG4gKiB0aW1lIHNpZ25hdHVyZXMuXHJcbiAqXHJcbiAqIEBhdXRob3IgQ29keSBMdW5kcXVpc3QgKGh0dHA6Ly9naXRodWIuY29tL21lZW5pZSkgLSAyMDE0XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEV1cm9wZWFuIFJoeXRobSBQYWNrXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHNlbWlicmV2ZTogMSxcclxuICAgIGRvdHRlZE1pbmltOiAwLjc1LFxyXG4gICAgbWluaW06IDAuNSxcclxuICAgIGRvdHRlZENyb3RjaGV0OiAwLjM3NSxcclxuICAgIHRyaXBsZXRNaW5pbTogMC4zMzMzMzMzNCxcclxuICAgIGNyb3RjaGV0OiAwLjI1LFxyXG4gICAgZG90dGVkUXVhdmVyOiAwLjE4NzUsXHJcbiAgICB0cmlwbGV0Q3JvdGNoZXQ6IDAuMTY2NjY2NjY3LFxyXG4gICAgcXVhdmVyOiAwLjEyNSxcclxuICAgIGRvdHRlZFNlbWlxdWF2ZXI6IDAuMDkzNzUsXHJcbiAgICB0cmlwbGV0UXVhdmVyOiAwLjA4MzMzMzMzMyxcclxuICAgIHNlbWlxdWF2ZXI6IDAuMDYyNSxcclxuICAgIHRyaXBsZXRTZW1pcXVhdmVyOiAwLjA0MTY2NjY2NyxcclxuICAgIGRlbWlzZW1pcXVhdmVyOiAwLjAzMTI1XHJcbn07XHJcblxyXG59LHt9XSw5OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcclxuLyoqXHJcbiAqIEJhbmQuanMgLSBNdXNpYyBDb21wb3NlclxyXG4gKiBBbiBpbnRlcmZhY2UgZm9yIHRoZSBXZWIgQXVkaW8gQVBJIHRoYXQgc3VwcG9ydHMgcmh5dGhtcywgbXVsdGlwbGUgaW5zdHJ1bWVudHMsIHJlcGVhdGluZyBzZWN0aW9ucywgYW5kIGNvbXBsZXhcclxuICogdGltZSBzaWduYXR1cmVzLlxyXG4gKlxyXG4gKiBAYXV0aG9yIENvZHkgTHVuZHF1aXN0IChodHRwOi8vZ2l0aHViLmNvbS9tZWVuaWUpIC0gMjAxNFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBOb3J0aCBBbWVyaWNhbiAoQ2FuYWRhIGFuZCBVU0EpIFJoeXRobSBQYWNrXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHdob2xlOiAxLFxyXG4gICAgZG90dGVkSGFsZjogMC43NSxcclxuICAgIGhhbGY6IDAuNSxcclxuICAgIGRvdHRlZFF1YXJ0ZXI6IDAuMzc1LFxyXG4gICAgdHJpcGxldEhhbGY6IDAuMzMzMzMzMzQsXHJcbiAgICBxdWFydGVyOiAwLjI1LFxyXG4gICAgZG90dGVkRWlnaHRoOiAwLjE4NzUsXHJcbiAgICB0cmlwbGV0UXVhcnRlcjogMC4xNjY2NjY2NjcsXHJcbiAgICBlaWdodGg6IDAuMTI1LFxyXG4gICAgZG90dGVkU2l4dGVlbnRoOiAwLjA5Mzc1LFxyXG4gICAgdHJpcGxldEVpZ2h0aDogMC4wODMzMzMzMzMsXHJcbiAgICBzaXh0ZWVudGg6IDAuMDYyNSxcclxuICAgIHRyaXBsZXRTaXh0ZWVudGg6IDAuMDQxNjY2NjY3LFxyXG4gICAgdGhpcnR5U2Vjb25kOiAwLjAzMTI1XHJcbn07XHJcblxyXG59LHt9XSwxMDpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XHJcbi8qKlxyXG4gKiBCYW5kLmpzIC0gTXVzaWMgQ29tcG9zZXJcclxuICogQW4gaW50ZXJmYWNlIGZvciB0aGUgV2ViIEF1ZGlvIEFQSSB0aGF0IHN1cHBvcnRzIHJoeXRobXMsIG11bHRpcGxlIGluc3RydW1lbnRzLCByZXBlYXRpbmcgc2VjdGlvbnMsIGFuZCBjb21wbGV4XHJcbiAqIHRpbWUgc2lnbmF0dXJlcy5cclxuICpcclxuICogQGF1dGhvciBDb2R5IEx1bmRxdWlzdCAoaHR0cDovL2dpdGh1Yi5jb20vbWVlbmllKSAtIDIwMTRcclxuICovXHJcblxyXG4vKipcclxuICogRXF1YWwgVGVtcGVyYW1lbnQgVHVuaW5nXHJcbiAqIFNvdXJjZTogaHR0cDovL3d3dy5waHkubXR1LmVkdS9+c3VpdHMvbm90ZWZyZXFzLmh0bWxcclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgJ0MwJzogMTYuMzUsXHJcbiAgICAnQyMwJzogMTcuMzIsXHJcbiAgICAnRGIwJzogMTcuMzIsXHJcbiAgICAnRDAnOiAxOC4zNSxcclxuICAgICdEIzAnOiAxOS40NSxcclxuICAgICdFYjAnOiAxOS40NSxcclxuICAgICdFMCc6IDIwLjYwLFxyXG4gICAgJ0YwJzogMjEuODMsXHJcbiAgICAnRiMwJzogMjMuMTIsXHJcbiAgICAnR2IwJzogMjMuMTIsXHJcbiAgICAnRzAnOiAyNC41MCxcclxuICAgICdHIzAnOiAyNS45NixcclxuICAgICdBYjAnOiAyNS45NixcclxuICAgICdBMCc6IDI3LjUwLFxyXG4gICAgJ0EjMCc6IDI5LjE0LFxyXG4gICAgJ0JiMCc6IDI5LjE0LFxyXG4gICAgJ0IwJzogMzAuODcsXHJcbiAgICAnQzEnOiAzMi43MCxcclxuICAgICdDIzEnOiAzNC42NSxcclxuICAgICdEYjEnOiAzNC42NSxcclxuICAgICdEMSc6IDM2LjcxLFxyXG4gICAgJ0QjMSc6IDM4Ljg5LFxyXG4gICAgJ0ViMSc6IDM4Ljg5LFxyXG4gICAgJ0UxJzogNDEuMjAsXHJcbiAgICAnRjEnOiA0My42NSxcclxuICAgICdGIzEnOiA0Ni4yNSxcclxuICAgICdHYjEnOiA0Ni4yNSxcclxuICAgICdHMSc6IDQ5LjAwLFxyXG4gICAgJ0cjMSc6IDUxLjkxLFxyXG4gICAgJ0FiMSc6IDUxLjkxLFxyXG4gICAgJ0ExJzogNTUuMDAsXHJcbiAgICAnQSMxJzogNTguMjcsXHJcbiAgICAnQmIxJzogNTguMjcsXHJcbiAgICAnQjEnOiA2MS43NCxcclxuICAgICdDMic6IDY1LjQxLFxyXG4gICAgJ0MjMic6IDY5LjMwLFxyXG4gICAgJ0RiMic6IDY5LjMwLFxyXG4gICAgJ0QyJzogNzMuNDIsXHJcbiAgICAnRCMyJzogNzcuNzgsXHJcbiAgICAnRWIyJzogNzcuNzgsXHJcbiAgICAnRTInOiA4Mi40MSxcclxuICAgICdGMic6IDg3LjMxLFxyXG4gICAgJ0YjMic6IDkyLjUwLFxyXG4gICAgJ0diMic6IDkyLjUwLFxyXG4gICAgJ0cyJzogOTguMDAsXHJcbiAgICAnRyMyJzogMTAzLjgzLFxyXG4gICAgJ0FiMic6IDEwMy44MyxcclxuICAgICdBMic6IDExMC4wMCxcclxuICAgICdBIzInOiAxMTYuNTQsXHJcbiAgICAnQmIyJzogMTE2LjU0LFxyXG4gICAgJ0IyJzogMTIzLjQ3LFxyXG4gICAgJ0MzJzogMTMwLjgxLFxyXG4gICAgJ0MjMyc6IDEzOC41OSxcclxuICAgICdEYjMnOiAxMzguNTksXHJcbiAgICAnRDMnOiAxNDYuODMsXHJcbiAgICAnRCMzJzogMTU1LjU2LFxyXG4gICAgJ0ViMyc6IDE1NS41NixcclxuICAgICdFMyc6IDE2NC44MSxcclxuICAgICdGMyc6IDE3NC42MSxcclxuICAgICdGIzMnOiAxODUuMDAsXHJcbiAgICAnR2IzJzogMTg1LjAwLFxyXG4gICAgJ0czJzogMTk2LjAwLFxyXG4gICAgJ0cjMyc6IDIwNy42NSxcclxuICAgICdBYjMnOiAyMDcuNjUsXHJcbiAgICAnQTMnOiAyMjAuMDAsXHJcbiAgICAnQSMzJzogMjMzLjA4LFxyXG4gICAgJ0JiMyc6IDIzMy4wOCxcclxuICAgICdCMyc6IDI0Ni45NCxcclxuICAgICdDNCc6IDI2MS42MyxcclxuICAgICdDIzQnOiAyNzcuMTgsXHJcbiAgICAnRGI0JzogMjc3LjE4LFxyXG4gICAgJ0Q0JzogMjkzLjY2LFxyXG4gICAgJ0QjNCc6IDMxMS4xMyxcclxuICAgICdFYjQnOiAzMTEuMTMsXHJcbiAgICAnRTQnOiAzMjkuNjMsXHJcbiAgICAnRjQnOiAzNDkuMjMsXHJcbiAgICAnRiM0JzogMzY5Ljk5LFxyXG4gICAgJ0diNCc6IDM2OS45OSxcclxuICAgICdHNCc6IDM5Mi4wMCxcclxuICAgICdHIzQnOiA0MTUuMzAsXHJcbiAgICAnQWI0JzogNDE1LjMwLFxyXG4gICAgJ0E0JzogNDQwLjAwLFxyXG4gICAgJ0EjNCc6IDQ2Ni4xNixcclxuICAgICdCYjQnOiA0NjYuMTYsXHJcbiAgICAnQjQnOiA0OTMuODgsXHJcbiAgICAnQzUnOiA1MjMuMjUsXHJcbiAgICAnQyM1JzogNTU0LjM3LFxyXG4gICAgJ0RiNSc6IDU1NC4zNyxcclxuICAgICdENSc6IDU4Ny4zMyxcclxuICAgICdEIzUnOiA2MjIuMjUsXHJcbiAgICAnRWI1JzogNjIyLjI1LFxyXG4gICAgJ0U1JzogNjU5LjI2LFxyXG4gICAgJ0Y1JzogNjk4LjQ2LFxyXG4gICAgJ0YjNSc6IDczOS45OSxcclxuICAgICdHYjUnOiA3MzkuOTksXHJcbiAgICAnRzUnOiA3ODMuOTksXHJcbiAgICAnRyM1JzogODMwLjYxLFxyXG4gICAgJ0FiNSc6IDgzMC42MSxcclxuICAgICdBNSc6IDg4MC4wMCxcclxuICAgICdBIzUnOiA5MzIuMzMsXHJcbiAgICAnQmI1JzogOTMyLjMzLFxyXG4gICAgJ0I1JzogOTg3Ljc3LFxyXG4gICAgJ0M2JzogMTA0Ni41MCxcclxuICAgICdDIzYnOiAxMTA4LjczLFxyXG4gICAgJ0RiNic6IDExMDguNzMsXHJcbiAgICAnRDYnOiAxMTc0LjY2LFxyXG4gICAgJ0QjNic6IDEyNDQuNTEsXHJcbiAgICAnRWI2JzogMTI0NC41MSxcclxuICAgICdFNic6IDEzMTguNTEsXHJcbiAgICAnRjYnOiAxMzk2LjkxLFxyXG4gICAgJ0YjNic6IDE0NzkuOTgsXHJcbiAgICAnR2I2JzogMTQ3OS45OCxcclxuICAgICdHNic6IDE1NjcuOTgsXHJcbiAgICAnRyM2JzogMTY2MS4yMixcclxuICAgICdBYjYnOiAxNjYxLjIyLFxyXG4gICAgJ0E2JzogMTc2MC4wMCxcclxuICAgICdBIzYnOiAxODY0LjY2LFxyXG4gICAgJ0JiNic6IDE4NjQuNjYsXHJcbiAgICAnQjYnOiAxOTc1LjUzLFxyXG4gICAgJ0M3JzogMjA5My4wMCxcclxuICAgICdDIzcnOiAyMjE3LjQ2LFxyXG4gICAgJ0RiNyc6IDIyMTcuNDYsXHJcbiAgICAnRDcnOiAyMzQ5LjMyLFxyXG4gICAgJ0QjNyc6IDI0ODkuMDIsXHJcbiAgICAnRWI3JzogMjQ4OS4wMixcclxuICAgICdFNyc6IDI2MzcuMDIsXHJcbiAgICAnRjcnOiAyNzkzLjgzLFxyXG4gICAgJ0YjNyc6IDI5NTkuOTYsXHJcbiAgICAnR2I3JzogMjk1OS45NixcclxuICAgICdHNyc6IDMxMzUuOTYsXHJcbiAgICAnRyM3JzogMzMyMi40NCxcclxuICAgICdBYjcnOiAzMzIyLjQ0LFxyXG4gICAgJ0E3JzogMzUyMC4wMCxcclxuICAgICdBIzcnOiAzNzI5LjMxLFxyXG4gICAgJ0JiNyc6IDM3MjkuMzEsXHJcbiAgICAnQjcnOiAzOTUxLjA3LFxyXG4gICAgJ0M4JzogNDE4Ni4wMVxyXG59O1xyXG5cclxufSx7fV19LHt9LFs2XSlcclxuKDYpXHJcbn0pOyIsImltcG9ydCBCYW5kSlMgZnJvbSAnLi4vYmFuZC5qcy9kaXN0L2JhbmQnO1xyXG5pbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5cclxuY2xhc3MgQXVkaW8gZXh0ZW5kcyBDb21wb25lbnQge1xyXG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcblx0XHRzdXBlcihwcm9wcyk7XHJcblx0XHR0aGlzLnN0YXRlID0geyBwbGF5ZXI6ICcnIH07XHJcblx0fVxyXG5cdHBsYXlIYW5kbGVyID0gKCkgPT4ge1xyXG5cdFx0aWYgKHRoaXMuc3RhdGUucGxheWVyKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHRoaXMuc3RhdGUucGxheWVyKTtcclxuXHRcdFx0dGhpcy5zdGF0ZS5wbGF5ZXIuc3RvcCgpO1xyXG5cdFx0fVxyXG5cdFx0bGV0IGNvbmR1Y3RvciA9IG5ldyBCYW5kSlMoKTtcclxuXHRcdGxldCBzZWN0aW9uc1Byb3BzID0gW107XHJcblx0XHR0aGlzLnByb3BzLmFuYWx5c2lzLnNlY3Rpb25zLmZvckVhY2goKHNlY3Rpb24pID0+IHtcclxuXHRcdFx0c2VjdGlvbnNQcm9wcy5wdXNoKFtzZWN0aW9uLmR1cmF0aW9uICogMTAwMCwgc2VjdGlvbi50ZW1wb10pO1xyXG5cdFx0fSk7XHJcblx0XHRjb25zb2xlLmxvZyhzZWN0aW9uc1Byb3BzKTtcclxuXHRcdGNvbmR1Y3Rvci5zZXRUaW1lU2lnbmF0dXJlKDQsIDQpO1xyXG5cdFx0Y29uZHVjdG9yLnNldFRlbXBvKHNlY3Rpb25zUHJvcHNbMF1bMV0pO1xyXG5cdFx0bGV0IHBpYW5vID0gY29uZHVjdG9yLmNyZWF0ZUluc3RydW1lbnQoJ3NpbmUnKTtcclxuXHRcdHBpYW5vLm5vdGUoJ3F1YXJ0ZXInLCAnRzMnKTtcclxuXHRcdHRoaXMuc2V0U3RhdGUoeyBwbGF5ZXI6IGNvbmR1Y3Rvci5maW5pc2goKSB9KTtcclxuXHRcdGNvbnNvbGUubG9nKHRoaXMuc3RhdGUucGxheWVyKTtcclxuXHRcdHRoaXMuc3RhdGUucGxheWVyLmxvb3AodHJ1ZSk7XHJcblx0XHRyaHl0aG1UaW1lcihzZWN0aW9uc1Byb3BzWzBdWzBdKTtcclxuXHRcdGZ1bmN0aW9uIHJoeXRobVRpbWVyKHRpbWUpIHtcclxuXHRcdFx0dGhpcy5zdGF0ZS5wbGF5ZXIucGxheSgpO1xyXG5cdFx0XHRzZWN0aW9uc1Byb3BzLnNoaWZ0KCk7XHJcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuc3RhdGUucGxheWVyLnN0b3AoKTtcclxuXHRcdFx0XHRpZiAoc2VjdGlvbnNQcm9wcy5sZW5ndGggIT0gMCkge1xyXG5cdFx0XHRcdFx0Y29uZHVjdG9yLnNldFRlbXBvKHNlY3Rpb25zUHJvcHNbMF1bMV0pO1xyXG5cdFx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IHBsYXllcjogY29uZHVjdG9yLmZpbmlzaCgpIH0pO1xyXG5cdFx0XHRcdFx0dGhpcy5zdGF0ZS5wbGF5ZXIubG9vcCh0cnVlKTtcclxuXHRcdFx0XHRcdHJoeXRobVRpbWVyKHNlY3Rpb25zUHJvcHNbMF1bMF0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgdGltZSk7XHJcblx0XHR9XHJcblx0fTtcclxuXHRyZW5kZXIoKSB7XHJcblx0XHRyZXR1cm4gPHAgb25DbGljaz17dGhpcy5wbGF5SGFuZGxlcn0+Y2xpY2sgTWU8L3A+O1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQXVkaW87XHJcbiIsImltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XHJcbmltcG9ydCBBdWRpbyBmcm9tICcuL0F1ZGlvJztcclxuY29uc3QgVHJhY2tzUmVzdWx0cyA9IHByb3BzID0+IHtcclxuXHRjb25zdCB0cmFja1JlZiA9IFJlYWN0LmNyZWF0ZVJlZigpO1xyXG5cdGxldCBhbmFseXNpcztcclxuXHRsZXQgW3NhLCBzYXNdID0gUmVhY3QudXNlU3RhdGUoYW5hbHlzaXMpO1xyXG5cclxuXHRsZXQgZ2V0QW5hbHlzaXMgPSBlID0+IHtcclxuXHRcdGF4aW9zXHJcblx0XHRcdC5nZXQoJ2h0dHBzOi8vYXBpLnNwb3RpZnkuY29tL3YxL2F1ZGlvLWFuYWx5c2lzLycgKyBlLnRhcmdldC5pZCwge1xyXG5cdFx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHRcdEF1dGhvcml6YXRpb246IHByb3BzLmF1dGhvcml6YXRpb25cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHRcdC50aGVuKGRhdGEgPT4ge1xyXG5cdFx0XHRcdHNhcyhkYXRhLmRhdGEpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGFuYWx5c2lzKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0LmNhdGNoKGVyciA9PiB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0fSk7XHJcblx0fTtcclxuXHJcblx0cmV0dXJuIChcclxuXHRcdDx1bCByZWY9e3RyYWNrUmVmfT5cclxuXHRcdFx0e3Byb3BzLnRyYWNrcy5tYXAodHJhY2sgPT4ge1xyXG5cdFx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0XHQ8bGkgaWQ9e3RyYWNrLmlkfSBrZXk9e3RyYWNrLmlkfSBvbkNsaWNrPXtnZXRBbmFseXNpc30+XHJcblx0XHRcdFx0XHRcdHt0cmFjay5uYW1lfSAtIHt0cmFjay5hcnRpc3RzWzBdLm5hbWV9ICh7dHJhY2sucG9wdWxhcml0eX0pXHJcblx0XHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH0pfVxyXG5cdFx0XHR7fVxyXG5cdFx0XHQ8QXVkaW8gYW5hbHlzaXM9e3NhfT48L0F1ZGlvPlxyXG5cdFx0PC91bD5cclxuXHQpO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgVHJhY2tzUmVzdWx0cztcclxuIiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IFJoeXRobSBmcm9tICcuL3JoeXRobSc7XHJcblxyXG5jbGFzcyBEZWZhdWx0IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuXHRyZW5kZXIoKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nYXBwJz5cclxuXHRcdFx0XHQ8aDE+Umh5dGhtIERldGVjdG9yPC9oMT5cclxuXHRcdFx0XHQ8aDI+U2VsZWN0IHlvdXIgc29uZyBhdCB0aGUgc2VhcmNoIGJhciBiZWxvdzwvaDI+XHJcblx0XHRcdFx0PFJoeXRobT48L1JoeXRobT5cclxuXHRcdFx0XHR7LypcdDxpbnB1dCB0eXBlPSd0ZXh0JyAvPiovfVxyXG5cdFx0XHRcdDxzdHlsZSBnbG9iYWwganN4PlxyXG5cdFx0XHRcdFx0e2BcclxuXHRcdFx0XHRcdFx0Ym9keSxcclxuXHRcdFx0XHRcdFx0aHRtbCxcclxuXHRcdFx0XHRcdFx0I3Jvb3Qge1xyXG5cdFx0XHRcdFx0XHRcdG1hcmdpbjogMDtcclxuXHRcdFx0XHRcdFx0XHRoZWlnaHQ6IDEwMCU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0KjphY3RpdmUsXHJcblx0XHRcdFx0XHRcdCo6Zm9jdXMge1xyXG5cdFx0XHRcdFx0XHRcdG91dGxpbmUtc3R5bGU6IG5vbmU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0KiB7XHJcblx0XHRcdFx0XHRcdFx0Ym94LXNpemluZzogYm9yZGVyLWJveDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHQjX19uZXh0IHtcclxuXHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBncmlkO1xyXG5cdFx0XHRcdFx0XHRcdGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byByaWdodCwgIzE0MWUzMCwgIzI0M2I1NSk7XHJcblx0XHRcdFx0XHRcdFx0aGVpZ2h0OiAxMDAlO1xyXG5cdFx0XHRcdFx0XHRcdHdpZHRoOiAxMDAlO1xyXG5cdFx0XHRcdFx0XHRcdGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcclxuXHRcdFx0XHRcdFx0XHRhbGlnbi1pdGVtczogY2VudGVyO1xyXG5cdFx0XHRcdFx0XHRcdG1heC1oZWlnaHQ6IDEwMCU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGB9XHJcblx0XHRcdFx0PC9zdHlsZT5cclxuXHRcdFx0XHQ8c3R5bGUganN4PntgXHJcblx0XHRcdFx0XHRoMSB7XHJcblx0XHRcdFx0XHRcdGZvbnQtc2l6ZTogM3JlbTtcclxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCAjZjc5ZDAwLCAjNjRmMzhjKTtcclxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZC1jbGlwOiB0ZXh0O1xyXG5cdFx0XHRcdFx0XHQtd2Via2l0LXRleHQtZmlsbC1jb2xvcjogdHJhbnNwYXJlbnQ7XHJcblx0XHRcdFx0XHRcdHRleHQtc2hhZG93OiAwcHggMHB4IDUwcHggIzFmZmM0NDJhO1xyXG5cdFx0XHRcdFx0XHRwb3NpdGlvbjogcmVsYXRpdmU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0YH08L3N0eWxlPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEZWZhdWx0O1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgRnJhZ21hbnQsIENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcclxuaW1wb3J0IFRyYWNrc1Jlc3VsdHMgZnJvbSAnLi9UcmFja3NSZXN1bHRzJztcclxuXHJcbmNsYXNzIFJoeXRobSBleHRlbmRzIENvbXBvbmVudCB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cdFx0dGhpcy5zdGF0ZSA9IHtcclxuXHRcdFx0dG9rZW46IG51bGwsXHJcblx0XHRcdHRyYWNrX2xpc3Q6IFtdLFxyXG5cdFx0XHRxdWVyeTogJydcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRjb21wb25lbnREaWRNb3VudCgpIHtcclxuXHRcdGNvbnN0IGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaFxyXG5cdFx0XHQuc3Vic3RyaW5nKDEpXHJcblx0XHRcdC5zcGxpdCgnJicpXHJcblx0XHRcdC5yZWR1Y2UoKGluaXRpYWwsIGl0ZW0pID0+IHtcclxuXHRcdFx0XHRpZiAoaXRlbSkge1xyXG5cdFx0XHRcdFx0dmFyIHBhcnRzID0gaXRlbS5zcGxpdCgnPScpO1xyXG5cdFx0XHRcdFx0aW5pdGlhbFtwYXJ0c1swXV0gPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gaW5pdGlhbDtcclxuXHRcdFx0fSwge30pO1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7IHRva2VuOiBoYXNoLmFjY2Vzc190b2tlbiwgdG9rZW5fdHlwZTogaGFzaC50b2tlbl90eXBlIH0pO1xyXG5cdH1cclxuXHJcblx0Z2V0VHJhY2tzID0gKCkgPT4ge1xyXG5cdFx0YXhpb3NcclxuXHRcdFx0LmdldChcclxuXHRcdFx0XHRgaHR0cHM6Ly9hcGkuc3BvdGlmeS5jb20vdjEvc2VhcmNoP3E9JHt0aGlzLnN0YXRlLnF1ZXJ5fSZ0eXBlPXRyYWNrJmxpbWl0PTVgLFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHRcdFx0QXV0aG9yaXphdGlvbjogYCR7dGhpcy5zdGF0ZS50b2tlbl90eXBlfSAke3RoaXMuc3RhdGUudG9rZW59YFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0KVxyXG5cdFx0XHQudGhlbihkYXRhID0+IHtcclxuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgdHJhY2tfbGlzdDogZGF0YS5kYXRhLnRyYWNrcy5pdGVtcyB9KTtcclxuXHRcdFx0fSlcclxuXHRcdFx0LmNhdGNoKGVyciA9PiB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0fSk7XHJcblx0fTtcclxuXHJcblx0Y2hhbmdlSGFuZGxlciA9ICgpID0+IHtcclxuXHRcdHRoaXMuc2V0U3RhdGUoeyBxdWVyeTogdGhpcy5zZWFyY2gudmFsdWUgfSwgKCkgPT4ge1xyXG5cdFx0XHRpZiAodGhpcy5zdGF0ZS5xdWVyeSAmJiB0aGlzLnN0YXRlLnF1ZXJ5Lmxlbmd0aCA+IDEpIHtcclxuXHRcdFx0XHR0aGlzLmdldFRyYWNrcygpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoeyB0cmFja19saXN0OiBbXSB9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PD5cclxuXHRcdFx0XHR7IXRoaXMuc3RhdGUudG9rZW4gJiYgKFxyXG5cdFx0XHRcdFx0PGJ1dHRvbj5cclxuXHRcdFx0XHRcdFx0PGEgaHJlZj0naHR0cHM6Ly9hY2NvdW50cy5zcG90aWZ5LmNvbS9hdXRob3JpemU/Y2xpZW50X2lkPTU4YjljNDA2M2M5MDRjZGE4N2FmODAxODZhNzMyZjAxJnJlZGlyZWN0X3VyaT1odHRwOiUyRiUyRmxvY2FsaG9zdDozMDAwJnJlc3BvbnNlX3R5cGU9dG9rZW4nPlxyXG5cdFx0XHRcdFx0XHRcdExvZ2luIFdpdGggU3BvdGlmeVxyXG5cdFx0XHRcdFx0XHQ8L2E+XHJcblx0XHRcdFx0XHQ8L2J1dHRvbj5cclxuXHRcdFx0XHQpfVxyXG5cdFx0XHRcdHt0aGlzLnN0YXRlLnRva2VuICYmIChcclxuXHRcdFx0XHRcdDw+XHJcblx0XHRcdFx0XHRcdDxpbnB1dFxyXG5cdFx0XHRcdFx0XHRcdHJlZj17aW5wdXQgPT4gKHRoaXMuc2VhcmNoID0gaW5wdXQpfVxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hhbmdlPXt0aGlzLmNoYW5nZUhhbmRsZXJ9XHJcblx0XHRcdFx0XHRcdC8+XHJcblx0XHRcdFx0XHRcdDxUcmFja3NSZXN1bHRzXHJcblx0XHRcdFx0XHRcdFx0YXV0aG9yaXphdGlvbj17YCR7dGhpcy5zdGF0ZS50b2tlbl90eXBlfSAke3RoaXMuc3RhdGUudG9rZW59YH1cclxuXHRcdFx0XHRcdFx0XHR0cmFja3M9e3RoaXMuc3RhdGUudHJhY2tfbGlzdH1cclxuXHRcdFx0XHRcdFx0PjwvVHJhY2tzUmVzdWx0cz5cclxuXHRcdFx0XHRcdDwvPlxyXG5cdFx0XHRcdCl9XHJcblx0XHRcdDwvPlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFJoeXRobTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXhpb3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVhY3RcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic3R5bGVkLWpzeC9zdHlsZVwiKTsiXSwic291cmNlUm9vdCI6IiJ9