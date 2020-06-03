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
        this.state.player.stop();
      }

      let conductor = new _band_js_dist_band__WEBPACK_IMPORTED_MODULE_0___default.a();
      let sectionsProps = [];
      this.props.analysis.sections.forEach(section => {
        sectionsProps.push([section.duration * 1000, section.tempo]);
      });
      conductor.setTimeSignature(4, 4);
      conductor.setTempo(sectionsProps[0][1]);
      let piano = conductor.createInstrument('sine');
      piano.note('quarter', 'G3');
      this.setState({
        player: conductor.finish()
      }, () => {
        this.state.player.loop(true);
        rhythmTimer(sectionsProps[0][0]);
      });

      let rhythmTimer = time => {
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
      };
    });

    this.state = {
      player: null
    };
  }

  render() {
    return __jsx("p", {
      onClick: this.playHandler,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 42,
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
    }).catch(err => {
      console.log(err);
    });
  };

  return __jsx("ul", {
    ref: trackRef,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24,
      columnNumber: 3
    }
  }, props.tracks ? props.tracks.map(track => {
    return __jsx("li", {
      id: track.id,
      key: track.id,
      onClick: getAnalysis,
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 28,
        columnNumber: 8
      }
    }, track.name, " - ", track.artists[0].name, " (", track.popularity, ")");
  }) : '', __jsx(_Audio__WEBPACK_IMPORTED_MODULE_2__["default"], {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vYmFuZC5qcy9kaXN0L2JhbmQuanMiLCJ3ZWJwYWNrOi8vLy4vcGFnZXMvQXVkaW8uanMiLCJ3ZWJwYWNrOi8vLy4vcGFnZXMvVHJhY2tzUmVzdWx0cy5qcyIsIndlYnBhY2s6Ly8vLi9wYWdlcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9wYWdlcy9yaHl0aG0uanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiYXhpb3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJyZWFjdFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInN0eWxlZC1qc3gvc3R5bGVcIiJdLCJuYW1lcyI6WyJlIiwibW9kdWxlIiwiZXhwb3J0cyIsImRlZmluZSIsInQiLCJuIiwiciIsInMiLCJvIiwidSIsImEiLCJyZXF1aXJlIiwiaSIsIkVycm9yIiwiZiIsImNhbGwiLCJsZW5ndGgiLCJfZGVyZXFfIiwiZGVmaW5pdGlvbiIsIndpbmRvdyIsIkF1ZGlvQ29udGV4dCIsIndlYmtpdEF1ZGlvQ29udGV4dCIsIkNvbmR1Y3RvciIsInBhY2tzIiwiaW5zdHJ1bWVudCIsInJoeXRobSIsInR1bmluZyIsImNvbmR1Y3RvciIsInBsYXllciIsIm5vb3AiLCJzaWduYXR1cmVUb05vdGVMZW5ndGhSYXRpbyIsInBpdGNoZXMiLCJub3RlcyIsImF1ZGlvQ29udGV4dCIsIm1hc3RlclZvbHVtZUxldmVsIiwibWFzdGVyVm9sdW1lIiwiY3JlYXRlR2FpbiIsImNvbm5lY3QiLCJkZXN0aW5hdGlvbiIsImJlYXRzUGVyQmFyIiwibm90ZUdldHNCZWF0IiwidGVtcG8iLCJpbnN0cnVtZW50cyIsInRvdGFsRHVyYXRpb24iLCJjdXJyZW50U2Vjb25kcyIsInBlcmNlbnRhZ2VDb21wbGV0ZSIsIm5vdGVCdWZmZXJMZW5ndGgiLCJvblRpY2tlckNhbGxiYWNrIiwib25GaW5pc2hlZENhbGxiYWNrIiwib25EdXJhdGlvbkNoYW5nZUNhbGxiYWNrIiwibG9hZCIsImpzb24iLCJkZXN0cm95IiwidGltZVNpZ25hdHVyZSIsInNldFRpbWVTaWduYXR1cmUiLCJzZXRUZW1wbyIsImluc3RydW1lbnRMaXN0IiwiaGFzT3duUHJvcGVydHkiLCJjcmVhdGVJbnN0cnVtZW50IiwibmFtZSIsInBhY2siLCJpbnN0IiwiaW5kZXgiLCJub3RlIiwibm90ZVBhcnRzIiwic3BsaXQiLCJyZXN0IiwidHlwZSIsInBpdGNoIiwidGllIiwiZmluaXNoIiwiSW5zdHJ1bWVudCIsInB1c2giLCJQbGF5ZXIiLCJzZXRNYXN0ZXJWb2x1bWUiLCJ2b2x1bWUiLCJnYWluIiwic2V0VmFsdWVBdFRpbWUiLCJjdXJyZW50VGltZSIsImdldFRvdGFsU2Vjb25kcyIsIk1hdGgiLCJyb3VuZCIsInNldFRpY2tlckNhbGxiYWNrIiwiY2IiLCJ0b3AiLCJib3R0b20iLCJyZXNldFRlbXBvIiwic2V0T25GaW5pc2hlZENhbGxiYWNrIiwic2V0T25EdXJhdGlvbkNoYW5nZUNhbGxiYWNrIiwic2V0Tm90ZUJ1ZmZlckxlbmd0aCIsImxlbiIsImxvYWRQYWNrIiwiZGF0YSIsImluZGV4T2YiLCJOb2lzZXNJbnN0cnVtZW50UGFjayIsInR5cGVzIiwiY3JlYXRlTm90ZSIsImNyZWF0ZVdoaXRlTm9pc2UiLCJjcmVhdGVQaW5rTm9pc2UiLCJjcmVhdGVCcm93bmlhbk5vaXNlIiwiYnVmZmVyU2l6ZSIsInNhbXBsZVJhdGUiLCJub2lzZUJ1ZmZlciIsImNyZWF0ZUJ1ZmZlciIsIm91dHB1dCIsImdldENoYW5uZWxEYXRhIiwicmFuZG9tIiwid2hpdGVOb2lzZSIsImNyZWF0ZUJ1ZmZlclNvdXJjZSIsImJ1ZmZlciIsImxvb3AiLCJiMCIsImIxIiwiYjIiLCJiMyIsImI0IiwiYjUiLCJiNiIsIndoaXRlIiwicGlua05vaXNlIiwibGFzdE91dCIsImJyb3duaWFuTm9pc2UiLCJPc2NpbGxhdG9ySW5zdHJ1bWVudFBhY2siLCJmcmVxdWVuY3kiLCJjcmVhdGVPc2NpbGxhdG9yIiwidmFsdWUiLCJnZXREdXJhdGlvbiIsImNsb25lIiwib2JqIiwiY29weSIsImNvbnN0cnVjdG9yIiwiYXR0ciIsImxhc3RSZXBlYXRDb3VudCIsInZvbHVtZUxldmVsIiwiYXJ0aWN1bGF0aW9uR2FwUGVyY2VudGFnZSIsImJ1ZmZlclBvc2l0aW9uIiwic2V0Vm9sdW1lIiwibmV3Vm9sdW1lTGV2ZWwiLCJkdXJhdGlvbiIsImFydGljdWxhdGlvbkdhcCIsInAiLCJ0cmltIiwicGFyc2VGbG9hdCIsImlzTmFOIiwic3RhcnRUaW1lIiwic3RvcFRpbWUiLCJyZXBlYXRTdGFydCIsInJlcGVhdEZyb21CZWdpbm5pbmciLCJudW1PZlJlcGVhdHMiLCJyZXBlYXQiLCJub3Rlc0J1ZmZlckNvcHkiLCJzbGljZSIsIm5vdGVDb3B5IiwicmVzZXREdXJhdGlvbiIsIm51bU9mTm90ZXMiLCJidWZmZXJUaW1lb3V0IiwiYWxsTm90ZXMiLCJidWZmZXJOb3RlcyIsImN1cnJlbnRQbGF5VGltZSIsInRvdGFsUGxheVRpbWUiLCJmYWRlZCIsImNhbGN1bGF0ZVRvdGFsRHVyYXRpb24iLCJyZXNldCIsIm51bU9mSW5zdHJ1bWVudHMiLCJkaXNjb25uZWN0IiwiY2xlYXJUaW1lb3V0IiwiZmFkZSIsImRpcmVjdGlvbiIsInJlc2V0Vm9sdW1lIiwiZmFkZUR1cmF0aW9uIiwibGluZWFyUmFtcFRvVmFsdWVBdFRpbWUiLCJzZXRUaW1lb3V0IiwiYnVmZmVyQ291bnQiLCJpbmRleDIiLCJub2RlIiwiaW5kZXgzIiwidG90YWxQbGF5VGltZUNhbGN1bGF0b3IiLCJwYXVzZWQiLCJwbGF5aW5nIiwic3RvcCIsImxvb3BpbmciLCJwbGF5IiwidXBkYXRlVG90YWxQbGF5VGltZSIsInNlY29uZHMiLCJtdXRlZCIsInRpbWVPZmZzZXQiLCJwbGF5Tm90ZXMiLCJzdGFydCIsImJ1ZmZlclVwIiwiYnVmZmVySW5OZXdOb3RlcyIsIm5ld05vdGVzIiwiY29uY2F0IiwiZmFkZU91dCIsInBhdXNlIiwidmFsIiwic2V0VGltZSIsIm5ld1RpbWUiLCJwYXJzZUludCIsIm11dGUiLCJ1bm11dGUiLCJzZW1pYnJldmUiLCJkb3R0ZWRNaW5pbSIsIm1pbmltIiwiZG90dGVkQ3JvdGNoZXQiLCJ0cmlwbGV0TWluaW0iLCJjcm90Y2hldCIsImRvdHRlZFF1YXZlciIsInRyaXBsZXRDcm90Y2hldCIsInF1YXZlciIsImRvdHRlZFNlbWlxdWF2ZXIiLCJ0cmlwbGV0UXVhdmVyIiwic2VtaXF1YXZlciIsInRyaXBsZXRTZW1pcXVhdmVyIiwiZGVtaXNlbWlxdWF2ZXIiLCJ3aG9sZSIsImRvdHRlZEhhbGYiLCJoYWxmIiwiZG90dGVkUXVhcnRlciIsInRyaXBsZXRIYWxmIiwicXVhcnRlciIsImRvdHRlZEVpZ2h0aCIsInRyaXBsZXRRdWFydGVyIiwiZWlnaHRoIiwiZG90dGVkU2l4dGVlbnRoIiwidHJpcGxldEVpZ2h0aCIsInNpeHRlZW50aCIsInRyaXBsZXRTaXh0ZWVudGgiLCJ0aGlydHlTZWNvbmQiLCJBdWRpbyIsIkNvbXBvbmVudCIsInByb3BzIiwic3RhdGUiLCJCYW5kSlMiLCJzZWN0aW9uc1Byb3BzIiwiYW5hbHlzaXMiLCJzZWN0aW9ucyIsImZvckVhY2giLCJzZWN0aW9uIiwicGlhbm8iLCJzZXRTdGF0ZSIsInJoeXRobVRpbWVyIiwidGltZSIsInNoaWZ0IiwicmVuZGVyIiwicGxheUhhbmRsZXIiLCJUcmFja3NSZXN1bHRzIiwidHJhY2tSZWYiLCJSZWFjdCIsImNyZWF0ZVJlZiIsInNhIiwic2FzIiwidXNlU3RhdGUiLCJnZXRBbmFseXNpcyIsImF4aW9zIiwiZ2V0IiwidGFyZ2V0IiwiaWQiLCJoZWFkZXJzIiwiQXV0aG9yaXphdGlvbiIsImF1dGhvcml6YXRpb24iLCJ0aGVuIiwiY2F0Y2giLCJlcnIiLCJjb25zb2xlIiwibG9nIiwidHJhY2tzIiwibWFwIiwidHJhY2siLCJhcnRpc3RzIiwicG9wdWxhcml0eSIsIkRlZmF1bHQiLCJSaHl0aG0iLCJxdWVyeSIsInRva2VuX3R5cGUiLCJ0b2tlbiIsInRyYWNrX2xpc3QiLCJpdGVtcyIsInNlYXJjaCIsImdldFRyYWNrcyIsImNvbXBvbmVudERpZE1vdW50IiwiaGFzaCIsImxvY2F0aW9uIiwic3Vic3RyaW5nIiwicmVkdWNlIiwiaW5pdGlhbCIsIml0ZW0iLCJwYXJ0cyIsImRlY29kZVVSSUNvbXBvbmVudCIsImFjY2Vzc190b2tlbiIsImlucHV0IiwiY2hhbmdlSGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLElBQUk7UUFDSjtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDeEZBLHlCQUFDLFVBQVNBLENBQVQsRUFBVztBQUFDLE1BQUcsSUFBSCxFQUF3REMsTUFBTSxDQUFDQyxPQUFQLEdBQWVGLENBQUMsRUFBaEIsQ0FBeEQsS0FBZ0YsVUFBeUw7QUFBQyxDQUF0UixDQUF1UixZQUFVO0FBQUMsTUFBSUcsTUFBSixFQUFXRixNQUFYLEVBQWtCQyxPQUFsQjtBQUEwQixTQUFRLFNBQVNGLENBQVQsQ0FBV0ksQ0FB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ZSI6InN0YXRpY1xcZGV2ZWxvcG1lbnRcXHBhZ2VzXFxpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0gcmVxdWlyZSgnLi4vLi4vLi4vc3NyLW1vZHVsZS1jYWNoZS5qcycpO1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHR2YXIgdGhyZXcgPSB0cnVlO1xuIFx0XHR0cnkge1xuIFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuIFx0XHRcdHRocmV3ID0gZmFsc2U7XG4gXHRcdH0gZmluYWxseSB7XG4gXHRcdFx0aWYodGhyZXcpIGRlbGV0ZSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0fVxuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzKTtcbiIsIiFmdW5jdGlvbihlKXtpZihcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSltb2R1bGUuZXhwb3J0cz1lKCk7ZWxzZSBpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQpZGVmaW5lKFtdLGUpO2Vsc2V7dmFyIGY7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz9mPXdpbmRvdzpcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2Y9Z2xvYmFsOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmJiYoZj1zZWxmKSxmLkJhbmRKUz1lKCl9fShmdW5jdGlvbigpe3ZhciBkZWZpbmUsbW9kdWxlLGV4cG9ydHM7cmV0dXJuIChmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pKHsxOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcclxuLypcclxuICogV2ViIEF1ZGlvIEFQSSBBdWRpb0NvbnRleHQgc2hpbVxyXG4gKi9cclxuKGZ1bmN0aW9uIChkZWZpbml0aW9uKSB7XHJcbiAgICBpZiAodHlwZW9mIGV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKTtcclxuICAgIH1cclxufSkoZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XHJcbn0pO1xyXG5cclxufSx7fV0sMjpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XHJcbi8qKlxyXG4gKiBCYW5kLmpzIC0gTXVzaWMgQ29tcG9zZXJcclxuICogQW4gaW50ZXJmYWNlIGZvciB0aGUgV2ViIEF1ZGlvIEFQSSB0aGF0IHN1cHBvcnRzIHJoeXRobXMsIG11bHRpcGxlIGluc3RydW1lbnRzLCByZXBlYXRpbmcgc2VjdGlvbnMsIGFuZCBjb21wbGV4XHJcbiAqIHRpbWUgc2lnbmF0dXJlcy5cclxuICpcclxuICogQGF1dGhvciBDb2R5IEx1bmRxdWlzdCAoaHR0cDovL2dpdGh1Yi5jb20vbWVlbmllKSAtIDIwMTRcclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gQ29uZHVjdG9yO1xyXG5cclxudmFyIHBhY2tzID0ge1xyXG4gICAgaW5zdHJ1bWVudDoge30sXHJcbiAgICByaHl0aG06IHt9LFxyXG4gICAgdHVuaW5nOiB7fVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbmR1Y3RvciBDbGFzcyAtIFRoaXMgZ2V0cyBpbnN0YW50aWF0ZWQgd2hlbiBgbmV3IEJhbmRKUygpYCBpcyBjYWxsZWRcclxuICpcclxuICogQHBhcmFtIHR1bmluZ1xyXG4gKiBAcGFyYW0gcmh5dGhtXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gQ29uZHVjdG9yKHR1bmluZywgcmh5dGhtKSB7XHJcbiAgICBpZiAoISB0dW5pbmcpIHtcclxuICAgICAgICB0dW5pbmcgPSAnZXF1YWxUZW1wZXJhbWVudCc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCEgcmh5dGhtKSB7XHJcbiAgICAgICAgcmh5dGhtID0gJ25vcnRoQW1lcmljYW4nO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgcGFja3MudHVuaW5nW3R1bmluZ10gPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHR1bmluZyArICcgaXMgbm90IGEgdmFsaWQgdHVuaW5nIHBhY2suJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBwYWNrcy5yaHl0aG1bcmh5dGhtXSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3Iocmh5dGhtICsgJyBpcyBub3QgYSB2YWxpZCByaHl0aG0gcGFjay4nKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgY29uZHVjdG9yID0gdGhpcyxcclxuICAgICAgICBwbGF5ZXIsXHJcbiAgICAgICAgbm9vcCA9IGZ1bmN0aW9uKCkge30sXHJcbiAgICAgICAgQXVkaW9Db250ZXh0ID0gX2RlcmVxXygnYXVkaW9jb250ZXh0JyksXHJcbiAgICAgICAgc2lnbmF0dXJlVG9Ob3RlTGVuZ3RoUmF0aW8gPSB7XHJcbiAgICAgICAgICAgIDI6IDYsXHJcbiAgICAgICAgICAgIDQ6IDMsXHJcbiAgICAgICAgICAgIDg6IDQuNTBcclxuICAgICAgICB9O1xyXG5cclxuICAgIGNvbmR1Y3Rvci5wYWNrcyA9IHBhY2tzO1xyXG4gICAgY29uZHVjdG9yLnBpdGNoZXMgPSBwYWNrcy50dW5pbmdbdHVuaW5nXTtcclxuICAgIGNvbmR1Y3Rvci5ub3RlcyA9IHBhY2tzLnJoeXRobVtyaHl0aG1dO1xyXG4gICAgY29uZHVjdG9yLmF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcclxuICAgIGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWVMZXZlbCA9IG51bGw7XHJcbiAgICBjb25kdWN0b3IubWFzdGVyVm9sdW1lID0gY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XHJcbiAgICBjb25kdWN0b3IubWFzdGVyVm9sdW1lLmNvbm5lY3QoY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XHJcbiAgICBjb25kdWN0b3IuYmVhdHNQZXJCYXIgPSBudWxsO1xyXG4gICAgY29uZHVjdG9yLm5vdGVHZXRzQmVhdCA9IG51bGw7XHJcbiAgICBjb25kdWN0b3IudGVtcG8gPSBudWxsO1xyXG4gICAgY29uZHVjdG9yLmluc3RydW1lbnRzID0gW107XHJcbiAgICBjb25kdWN0b3IudG90YWxEdXJhdGlvbiA9IDA7XHJcbiAgICBjb25kdWN0b3IuY3VycmVudFNlY29uZHMgPSAwO1xyXG4gICAgY29uZHVjdG9yLnBlcmNlbnRhZ2VDb21wbGV0ZSA9IDA7XHJcbiAgICBjb25kdWN0b3Iubm90ZUJ1ZmZlckxlbmd0aCA9IDIwO1xyXG4gICAgY29uZHVjdG9yLm9uVGlja2VyQ2FsbGJhY2sgPSBub29wO1xyXG4gICAgY29uZHVjdG9yLm9uRmluaXNoZWRDYWxsYmFjayA9IG5vb3A7XHJcbiAgICBjb25kdWN0b3Iub25EdXJhdGlvbkNoYW5nZUNhbGxiYWNrID0gbm9vcDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFVzZSBKU09OIHRvIGxvYWQgaW4gYSBzb25nIHRvIGJlIHBsYXllZFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBqc29uXHJcbiAgICAgKi9cclxuICAgIGNvbmR1Y3Rvci5sb2FkID0gZnVuY3Rpb24oanNvbikge1xyXG4gICAgICAgIC8vIENsZWFyIG91dCBhbnkgcHJldmlvdXMgc29uZ1xyXG4gICAgICAgIGlmIChjb25kdWN0b3IuaW5zdHJ1bWVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBjb25kdWN0b3IuZGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCEganNvbikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0pTT04gaXMgcmVxdWlyZWQgZm9yIHRoaXMgbWV0aG9kIHRvIHdvcmsuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIE5lZWQgdG8gaGF2ZSBhdCBsZWFzdCBpbnN0cnVtZW50cyBhbmQgbm90ZXNcclxuICAgICAgICBpZiAodHlwZW9mIGpzb24uaW5zdHJ1bWVudHMgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignWW91IG11c3QgZGVmaW5lIGF0IGxlYXN0IG9uZSBpbnN0cnVtZW50Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2YganNvbi5ub3RlcyA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbXVzdCBkZWZpbmUgbm90ZXMgZm9yIGVhY2ggaW5zdHJ1bWVudCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2hhbGwgd2Ugc2V0IGEgdGltZSBzaWduYXR1cmU/XHJcbiAgICAgICAgaWYgKHR5cGVvZiBqc29uLnRpbWVTaWduYXR1cmUgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIGNvbmR1Y3Rvci5zZXRUaW1lU2lnbmF0dXJlKGpzb24udGltZVNpZ25hdHVyZVswXSwganNvbi50aW1lU2lnbmF0dXJlWzFdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE1heWJlIHNvbWUgdGVtcG8/XHJcbiAgICAgICAgaWYgKHR5cGVvZiBqc29uLnRlbXBvICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBjb25kdWN0b3Iuc2V0VGVtcG8oanNvbi50ZW1wbyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBMZXRzIGNyZWF0ZSBzb21lIGluc3RydW1lbnRzXHJcbiAgICAgICAgdmFyIGluc3RydW1lbnRMaXN0ID0ge307XHJcbiAgICAgICAgZm9yICh2YXIgaW5zdHJ1bWVudCBpbiBqc29uLmluc3RydW1lbnRzKSB7XHJcbiAgICAgICAgICAgIGlmICghIGpzb24uaW5zdHJ1bWVudHMuaGFzT3duUHJvcGVydHkoaW5zdHJ1bWVudCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpbnN0cnVtZW50TGlzdFtpbnN0cnVtZW50XSA9IGNvbmR1Y3Rvci5jcmVhdGVJbnN0cnVtZW50KFxyXG4gICAgICAgICAgICAgICAganNvbi5pbnN0cnVtZW50c1tpbnN0cnVtZW50XS5uYW1lLFxyXG4gICAgICAgICAgICAgICAganNvbi5pbnN0cnVtZW50c1tpbnN0cnVtZW50XS5wYWNrXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBOb3cgbGV0cyBhZGQgaW4gZWFjaCBvZiB0aGUgbm90ZXNcclxuICAgICAgICBmb3IgKHZhciBpbnN0IGluIGpzb24ubm90ZXMpIHtcclxuICAgICAgICAgICAgaWYgKCEganNvbi5ub3Rlcy5oYXNPd25Qcm9wZXJ0eShpbnN0KSkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgIHdoaWxlICgrKyBpbmRleCA8IGpzb24ubm90ZXNbaW5zdF0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbm90ZSA9IGpzb24ubm90ZXNbaW5zdF1baW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgLy8gVXNlIHNob3J0aGFuZCBpZiBpdCdzIGEgc3RyaW5nXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG5vdGUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vdGVQYXJ0cyA9IG5vdGUuc3BsaXQoJ3wnKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJ3Jlc3QnID09PSBub3RlUGFydHNbMV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdHJ1bWVudExpc3RbaW5zdF0ucmVzdChub3RlUGFydHNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3RydW1lbnRMaXN0W2luc3RdLm5vdGUobm90ZVBhcnRzWzBdLCBub3RlUGFydHNbMV0sIG5vdGVQYXJ0c1syXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSB1c2UgbG9uZ2hhbmRcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCdyZXN0JyA9PT0gbm90ZS50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3RydW1lbnRMaXN0W2luc3RdLnJlc3Qobm90ZS5yaHl0aG0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoJ25vdGUnID09PSBub3RlLnR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdHJ1bWVudExpc3RbaW5zdF0ubm90ZShub3RlLnJoeXRobSwgbm90ZS5waXRjaCwgbm90ZS50aWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gTG9va3MgbGlrZSB3ZSBhcmUgZG9uZSwgbGV0cyBwcmVzcyBpdC5cclxuICAgICAgICByZXR1cm4gY29uZHVjdG9yLmZpbmlzaCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIG5ldyBpbnN0cnVtZW50XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIFtuYW1lXSAtIGRlZmF1bHRzIHRvIHNpbmVcclxuICAgICAqIEBwYXJhbSBbcGFja10gLSBkZWZhdWx0cyB0byBvc2NpbGxhdG9yc1xyXG4gICAgICovXHJcbiAgICBjb25kdWN0b3IuY3JlYXRlSW5zdHJ1bWVudCA9IGZ1bmN0aW9uKG5hbWUsIHBhY2spIHtcclxuICAgICAgICB2YXIgSW5zdHJ1bWVudCA9IF9kZXJlcV8oJy4vaW5zdHJ1bWVudC5qcycpLFxyXG4gICAgICAgICAgICBpbnN0cnVtZW50ID0gbmV3IEluc3RydW1lbnQobmFtZSwgcGFjaywgY29uZHVjdG9yKTtcclxuICAgICAgICBjb25kdWN0b3IuaW5zdHJ1bWVudHMucHVzaChpbnN0cnVtZW50KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGluc3RydW1lbnQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTmVlZHMgdG8gYmUgY2FsbGVkIGFmdGVyIGFsbCB0aGUgaW5zdHJ1bWVudHMgaGF2ZSBiZWVuIGZpbGxlZCB3aXRoIG5vdGVzLlxyXG4gICAgICogSXQgd2lsbCBmaWd1cmUgb3V0IHRoZSB0b3RhbCBkdXJhdGlvbiBvZiB0aGUgc29uZyBiYXNlZCBvbiB0aGUgbG9uZ2VzdFxyXG4gICAgICogZHVyYXRpb24gb3V0IG9mIGFsbCB0aGUgaW5zdHJ1bWVudHMuICBJdCB3aWxsIHRoZW4gcGFzcyBiYWNrIHRoZSBQbGF5ZXIgT2JqZWN0XHJcbiAgICAgKiB3aGljaCBpcyB1c2VkIHRvIGNvbnRyb2wgdGhlIG11c2ljIChwbGF5LCBzdG9wLCBwYXVzZSwgbG9vcCwgdm9sdW1lLCB0ZW1wbylcclxuICAgICAqXHJcbiAgICAgKiBJdCByZXR1cm5zIHRoZSBQbGF5ZXIgb2JqZWN0LlxyXG4gICAgICovXHJcbiAgICBjb25kdWN0b3IuZmluaXNoID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIFBsYXllciA9IF9kZXJlcV8oJy4vcGxheWVyLmpzJyk7XHJcbiAgICAgICAgcGxheWVyID0gbmV3IFBsYXllcihjb25kdWN0b3IpO1xyXG5cclxuICAgICAgICByZXR1cm4gcGxheWVyO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZSBhbGwgaW5zdHJ1bWVudHMgYW5kIHJlY3JlYXRlIEF1ZGlvQ29udGV4dFxyXG4gICAgICovXHJcbiAgICBjb25kdWN0b3IuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbmR1Y3Rvci5hdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XHJcbiAgICAgICAgY29uZHVjdG9yLmluc3RydW1lbnRzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgY29uZHVjdG9yLm1hc3RlclZvbHVtZSA9IGNvbmR1Y3Rvci5hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xyXG4gICAgICAgIGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWUuY29ubmVjdChjb25kdWN0b3IuYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgTWFzdGVyIFZvbHVtZVxyXG4gICAgICovXHJcbiAgICBjb25kdWN0b3Iuc2V0TWFzdGVyVm9sdW1lID0gZnVuY3Rpb24odm9sdW1lKSB7XHJcbiAgICAgICAgaWYgKHZvbHVtZSA+IDEpIHtcclxuICAgICAgICAgICAgdm9sdW1lID0gdm9sdW1lIC8gMTAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25kdWN0b3IubWFzdGVyVm9sdW1lTGV2ZWwgPSB2b2x1bWU7XHJcbiAgICAgICAgY29uZHVjdG9yLm1hc3RlclZvbHVtZS5nYWluLnNldFZhbHVlQXRUaW1lKHZvbHVtZSwgY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogR3JhYiB0aGUgdG90YWwgZHVyYXRpb24gb2YgYSBzb25nXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgY29uZHVjdG9yLmdldFRvdGFsU2Vjb25kcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKGNvbmR1Y3Rvci50b3RhbER1cmF0aW9uKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSB0aWNrZXIgY2FsbGJhY2sgZnVuY3Rpb24uIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWRcclxuICAgICAqIGV2ZXJ5IHRpbWUgdGhlIGN1cnJlbnQgc2Vjb25kcyBoYXMgY2hhbmdlZC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY2IgZnVuY3Rpb25cclxuICAgICAqL1xyXG4gICAgY29uZHVjdG9yLnNldFRpY2tlckNhbGxiYWNrID0gZnVuY3Rpb24oY2IpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGNiICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGlja2VyIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbmR1Y3Rvci5vblRpY2tlckNhbGxiYWNrID0gY2I7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgdGltZSBzaWduYXR1cmUgZm9yIHRoZSBtdXNpYy4gSnVzdCBsaWtlIGluIG5vdGF0aW9uIDQvNCB0aW1lIHdvdWxkIGJlIHNldFRpbWVTaWduYXR1cmUoNCwgNCk7XHJcbiAgICAgKiBAcGFyYW0gdG9wIC0gTnVtYmVyIG9mIGJlYXRzIHBlciBiYXJcclxuICAgICAqIEBwYXJhbSBib3R0b20gLSBXaGF0IG5vdGUgdHlwZSBoYXMgdGhlIGJlYXRcclxuICAgICAqL1xyXG4gICAgY29uZHVjdG9yLnNldFRpbWVTaWduYXR1cmUgPSBmdW5jdGlvbih0b3AsIGJvdHRvbSkge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygc2lnbmF0dXJlVG9Ob3RlTGVuZ3RoUmF0aW9bYm90dG9tXSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgYm90dG9tIHRpbWUgc2lnbmF0dXJlIGlzIG5vdCBzdXBwb3J0ZWQuJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBOb3QgdXNlZCBhdCB0aGUgbW9tZW50LCBidXQgd2lsbCBiZSBoYW5keSBpbiB0aGUgZnV0dXJlLlxyXG4gICAgICAgIGNvbmR1Y3Rvci5iZWF0c1BlckJhciA9IHRvcDtcclxuICAgICAgICBjb25kdWN0b3Iubm90ZUdldHNCZWF0ID0gc2lnbmF0dXJlVG9Ob3RlTGVuZ3RoUmF0aW9bYm90dG9tXTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSB0ZW1wb1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB0XHJcbiAgICAgKi9cclxuICAgIGNvbmR1Y3Rvci5zZXRUZW1wbyA9IGZ1bmN0aW9uKHQpIHtcclxuICAgICAgICBjb25kdWN0b3IudGVtcG8gPSA2MCAvIHQ7XHJcblxyXG4gICAgICAgIC8vIElmIHdlIGhhdmUgYSBwbGF5ZXIgaW5zdGFuY2UsIHdlIG5lZWQgdG8gcmVjYWxjdWxhdGUgZHVyYXRpb24gYWZ0ZXIgcmVzZXR0aW5nIHRoZSB0ZW1wby5cclxuICAgICAgICBpZiAocGxheWVyKSB7XHJcbiAgICAgICAgICAgIHBsYXllci5yZXNldFRlbXBvKCk7XHJcbiAgICAgICAgICAgIGNvbmR1Y3Rvci5vbkR1cmF0aW9uQ2hhbmdlQ2FsbGJhY2soKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IGEgY2FsbGJhY2sgdG8gZmlyZSB3aGVuIHRoZSBzb25nIGlzIGZpbmlzaGVkXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNiXHJcbiAgICAgKi9cclxuICAgIGNvbmR1Y3Rvci5zZXRPbkZpbmlzaGVkQ2FsbGJhY2sgPSBmdW5jdGlvbihjYikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgY2IgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdvbkZpbmlzaGVkIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbmR1Y3Rvci5vbkZpbmlzaGVkQ2FsbGJhY2sgPSBjYjtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgYSBjYWxsYmFjayB0byBmaXJlIHdoZW4gZHVyYXRpb24gb2YgYSBzb25nIGNoYW5nZXNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY2JcclxuICAgICAqL1xyXG4gICAgY29uZHVjdG9yLnNldE9uRHVyYXRpb25DaGFuZ2VDYWxsYmFjayA9IGZ1bmN0aW9uKGNiKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjYiAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ29uRHVyYXRpb25DaGFuZ2VkIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbmR1Y3Rvci5vbkR1cmF0aW9uQ2hhbmdlQ2FsbGJhY2sgPSBjYjtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgdGhlIG51bWJlciBvZiBub3RlcyB0aGF0IGFyZSBidWZmZXJlZCBldmVyeSAodGVtcG8gLyA2MCAqIDUpIHNlY29uZHMuXHJcbiAgICAgKiBJdCdzIHNldCB0byAyMCBub3RlcyBieSBkZWZhdWx0LlxyXG4gICAgICpcclxuICAgICAqICoqV0FSTklORyoqIFRoZSBoaWdoZXIgdGhpcyBpcywgdGhlIG1vcmUgbWVtb3J5IGlzIHVzZWQgYW5kIGNhbiBjcmFzaCB5b3VyIGJyb3dzZXIuXHJcbiAgICAgKiAgICAgICAgICAgICBJZiBub3RlcyBhcmUgYmVpbmcgZHJvcHBlZCwgeW91IGNhbiBpbmNyZWFzZSB0aGlzLCBidXQgYmUgd2Vhcnkgb2ZcclxuICAgICAqICAgICAgICAgICAgIHVzZWQgbWVtb3J5LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gbGVuXHJcbiAgICAgKi9cclxuICAgIGNvbmR1Y3Rvci5zZXROb3RlQnVmZmVyTGVuZ3RoID0gZnVuY3Rpb24obGVuKSB7XHJcbiAgICAgICAgY29uZHVjdG9yLm5vdGVCdWZmZXJMZW5ndGggPSBsZW47XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbmR1Y3Rvci5zZXRNYXN0ZXJWb2x1bWUoMTAwKTtcclxuICAgIGNvbmR1Y3Rvci5zZXRUZW1wbygxMjApO1xyXG4gICAgY29uZHVjdG9yLnNldFRpbWVTaWduYXR1cmUoNCwgNCk7XHJcbn1cclxuXHJcbkNvbmR1Y3Rvci5sb2FkUGFjayA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIGRhdGEpIHtcclxuICAgIGlmIChbJ3R1bmluZycsICdyaHl0aG0nLCAnaW5zdHJ1bWVudCddLmluZGV4T2YodHlwZSkgPT09IC0xKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHR5cGUgKyAnIGlzIG5vdCBhIHZhbGlkIFBhY2sgVHlwZS4nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIHBhY2tzW3R5cGVdW25hbWVdICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQShuKSAnICsgdHlwZSArICcgcGFjayB3aXRoIHRoZSBuYW1lIFwiJyArIG5hbWUgKyAnXCIgaGFzIGFscmVhZHkgYmVlbiBsb2FkZWQuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcGFja3NbdHlwZV1bbmFtZV0gPSBkYXRhO1xyXG59O1xyXG5cclxufSx7XCIuL2luc3RydW1lbnQuanNcIjo1LFwiLi9wbGF5ZXIuanNcIjo3LFwiYXVkaW9jb250ZXh0XCI6MX1dLDM6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xyXG4vKipcclxuICogQmFuZC5qcyAtIE11c2ljIENvbXBvc2VyXHJcbiAqIEFuIGludGVyZmFjZSBmb3IgdGhlIFdlYiBBdWRpbyBBUEkgdGhhdCBzdXBwb3J0cyByaHl0aG1zLCBtdWx0aXBsZSBpbnN0cnVtZW50cywgcmVwZWF0aW5nIHNlY3Rpb25zLCBhbmQgY29tcGxleFxyXG4gKiB0aW1lIHNpZ25hdHVyZXMuXHJcbiAqXHJcbiAqIEBhdXRob3IgQ29keSBMdW5kcXVpc3QgKGh0dHA6Ly9naXRodWIuY29tL21lZW5pZSkgLSAyMDE0XHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IE5vaXNlc0luc3RydW1lbnRQYWNrO1xyXG5cclxuLyoqXHJcbiAqIE5vaXNlcyBJbnN0cnVtZW50IFBhY2tcclxuICpcclxuICogQWRhcHRlZCBmcm9tOiBodHRwczovL2dpdGh1Yi5jb20vemFjaGFyeWRlbnRvbi9ub2lzZS5qc1xyXG4gKlxyXG4gKiBAcGFyYW0gbmFtZVxyXG4gKiBAcGFyYW0gYXVkaW9Db250ZXh0XHJcbiAqIEByZXR1cm5zIHt7Y3JlYXRlTm90ZTogY3JlYXRlTm90ZX19XHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gTm9pc2VzSW5zdHJ1bWVudFBhY2sobmFtZSwgYXVkaW9Db250ZXh0KSB7XHJcbiAgICB2YXIgdHlwZXMgPSBbXHJcbiAgICAgICAgJ3doaXRlJyxcclxuICAgICAgICAncGluaycsXHJcbiAgICAgICAgJ2Jyb3duJyxcclxuICAgICAgICAnYnJvd25pYW4nLFxyXG4gICAgICAgICdyZWQnXHJcbiAgICBdO1xyXG5cclxuICAgIGlmICh0eXBlcy5pbmRleE9mKG5hbWUpID09PSAtMSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihuYW1lICsgJyBpcyBub3QgYSB2YWxpZCBub2lzZSBzb3VuZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY3JlYXRlTm90ZTogZnVuY3Rpb24oZGVzdGluYXRpb24pIHtcclxuICAgICAgICAgICAgc3dpdGNoIChuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICd3aGl0ZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVdoaXRlTm9pc2UoZGVzdGluYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAncGluayc6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVBpbmtOb2lzZShkZXN0aW5hdGlvbik7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdicm93bic6XHJcbiAgICAgICAgICAgICAgICBjYXNlICdicm93bmlhbic6XHJcbiAgICAgICAgICAgICAgICBjYXNlICdyZWQnOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVCcm93bmlhbk5vaXNlKGRlc3RpbmF0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlV2hpdGVOb2lzZShkZXN0aW5hdGlvbikge1xyXG4gICAgICAgIHZhciBidWZmZXJTaXplID0gMiAqIGF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlLFxyXG4gICAgICAgICAgICBub2lzZUJ1ZmZlciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXIoMSwgYnVmZmVyU2l6ZSwgYXVkaW9Db250ZXh0LnNhbXBsZVJhdGUpLFxyXG4gICAgICAgICAgICBvdXRwdXQgPSBub2lzZUJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJ1ZmZlclNpemU7IGkrKykge1xyXG4gICAgICAgICAgICBvdXRwdXRbaV0gPSBNYXRoLnJhbmRvbSgpICogMiAtIDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgd2hpdGVOb2lzZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcclxuICAgICAgICB3aGl0ZU5vaXNlLmJ1ZmZlciA9IG5vaXNlQnVmZmVyO1xyXG4gICAgICAgIHdoaXRlTm9pc2UubG9vcCA9IHRydWU7XHJcblxyXG4gICAgICAgIHdoaXRlTm9pc2UuY29ubmVjdChkZXN0aW5hdGlvbik7XHJcblxyXG4gICAgICAgIHJldHVybiB3aGl0ZU5vaXNlO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZVBpbmtOb2lzZShkZXN0aW5hdGlvbikge1xyXG4gICAgICAgIHZhciBidWZmZXJTaXplID0gMiAqIGF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlLFxyXG4gICAgICAgICAgICBub2lzZUJ1ZmZlciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXIoMSwgYnVmZmVyU2l6ZSwgYXVkaW9Db250ZXh0LnNhbXBsZVJhdGUpLFxyXG4gICAgICAgICAgICBvdXRwdXQgPSBub2lzZUJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKSxcclxuICAgICAgICAgICAgYjAsIGIxLCBiMiwgYjMsIGI0LCBiNSwgYjY7XHJcblxyXG4gICAgICAgIGIwID0gYjEgPSBiMiA9IGIzID0gYjQgPSBiNSA9IGI2ID0gMC4wO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnVmZmVyU2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciB3aGl0ZSA9IE1hdGgucmFuZG9tKCkgKiAyIC0gMTtcclxuICAgICAgICAgICAgYjAgPSAwLjk5ODg2ICogYjAgKyB3aGl0ZSAqIDAuMDU1NTE3OTtcclxuICAgICAgICAgICAgYjEgPSAwLjk5MzMyICogYjEgKyB3aGl0ZSAqIDAuMDc1MDc1OTtcclxuICAgICAgICAgICAgYjIgPSAwLjk2OTAwICogYjIgKyB3aGl0ZSAqIDAuMTUzODUyMDtcclxuICAgICAgICAgICAgYjMgPSAwLjg2NjUwICogYjMgKyB3aGl0ZSAqIDAuMzEwNDg1NjtcclxuICAgICAgICAgICAgYjQgPSAwLjU1MDAwICogYjQgKyB3aGl0ZSAqIDAuNTMyOTUyMjtcclxuICAgICAgICAgICAgYjUgPSAtMC43NjE2ICogYjUgLSB3aGl0ZSAqIDAuMDE2ODk4MDtcclxuICAgICAgICAgICAgb3V0cHV0W2ldID0gYjAgKyBiMSArIGIyICsgYjMgKyBiNCArIGI1ICsgYjYgKyB3aGl0ZSAqIDAuNTM2MjtcclxuICAgICAgICAgICAgb3V0cHV0W2ldICo9IDAuMTE7XHJcbiAgICAgICAgICAgIGI2ID0gd2hpdGUgKiAwLjExNTkyNjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBwaW5rTm9pc2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XHJcbiAgICAgICAgcGlua05vaXNlLmJ1ZmZlciA9IG5vaXNlQnVmZmVyO1xyXG4gICAgICAgIHBpbmtOb2lzZS5sb29wID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgcGlua05vaXNlLmNvbm5lY3QoZGVzdGluYXRpb24pO1xyXG5cclxuICAgICAgICByZXR1cm4gcGlua05vaXNlO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUJyb3duaWFuTm9pc2UoZGVzdGluYXRpb24pIHtcclxuICAgICAgICB2YXIgYnVmZmVyU2l6ZSA9IDIgKiBhdWRpb0NvbnRleHQuc2FtcGxlUmF0ZSxcclxuICAgICAgICAgICAgbm9pc2VCdWZmZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyKDEsIGJ1ZmZlclNpemUsIGF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlKSxcclxuICAgICAgICAgICAgb3V0cHV0ID0gbm9pc2VCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCksXHJcbiAgICAgICAgICAgIGxhc3RPdXQgPSAwLjA7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBidWZmZXJTaXplOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHdoaXRlID0gTWF0aC5yYW5kb20oKSAqIDIgLSAxO1xyXG4gICAgICAgICAgICBvdXRwdXRbaV0gPSAobGFzdE91dCArICgwLjAyICogd2hpdGUpKSAvIDEuMDI7XHJcbiAgICAgICAgICAgIGxhc3RPdXQgPSBvdXRwdXRbaV07XHJcbiAgICAgICAgICAgIG91dHB1dFtpXSAqPSAzLjU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgYnJvd25pYW5Ob2lzZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcclxuICAgICAgICBicm93bmlhbk5vaXNlLmJ1ZmZlciA9IG5vaXNlQnVmZmVyO1xyXG4gICAgICAgIGJyb3duaWFuTm9pc2UubG9vcCA9IHRydWU7XHJcblxyXG4gICAgICAgIGJyb3duaWFuTm9pc2UuY29ubmVjdChkZXN0aW5hdGlvbik7XHJcblxyXG4gICAgICAgIHJldHVybiBicm93bmlhbk5vaXNlO1xyXG4gICAgfVxyXG59XHJcblxyXG59LHt9XSw0OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcclxuLyoqXHJcbiAqIEJhbmQuanMgLSBNdXNpYyBDb21wb3NlclxyXG4gKiBBbiBpbnRlcmZhY2UgZm9yIHRoZSBXZWIgQXVkaW8gQVBJIHRoYXQgc3VwcG9ydHMgcmh5dGhtcywgbXVsdGlwbGUgaW5zdHJ1bWVudHMsIHJlcGVhdGluZyBzZWN0aW9ucywgYW5kIGNvbXBsZXhcclxuICogdGltZSBzaWduYXR1cmVzLlxyXG4gKlxyXG4gKiBAYXV0aG9yIENvZHkgTHVuZHF1aXN0IChodHRwOi8vZ2l0aHViLmNvbS9tZWVuaWUpIC0gMjAxNFxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBPc2NpbGxhdG9ySW5zdHJ1bWVudFBhY2s7XHJcblxyXG4vKipcclxuICogT3NjaWxsYXRvciBJbnN0cnVtZW50IFBhY2tcclxuICpcclxuICogQHBhcmFtIG5hbWVcclxuICogQHBhcmFtIGF1ZGlvQ29udGV4dFxyXG4gKiBAcmV0dXJucyB7e2NyZWF0ZU5vdGU6IGNyZWF0ZU5vdGV9fVxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIE9zY2lsbGF0b3JJbnN0cnVtZW50UGFjayhuYW1lLCBhdWRpb0NvbnRleHQpIHtcclxuICAgIHZhciB0eXBlcyA9IFsnc2luZScsICdzcXVhcmUnLCAnc2F3dG9vdGgnLCAndHJpYW5nbGUnXTtcclxuXHJcbiAgICBpZiAodHlwZXMuaW5kZXhPZihuYW1lKSA9PT0gLTEpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobmFtZSArICcgaXMgbm90IGEgdmFsaWQgT3NjaWxsYXRvciB0eXBlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjcmVhdGVOb3RlOiBmdW5jdGlvbihkZXN0aW5hdGlvbiwgZnJlcXVlbmN5KSB7XHJcbiAgICAgICAgICAgIHZhciBvID0gYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENvbm5lY3Qgbm90ZSB0byB2b2x1bWVcclxuICAgICAgICAgICAgby5jb25uZWN0KGRlc3RpbmF0aW9uKTtcclxuICAgICAgICAgICAgLy8gU2V0IHBpdGNoIHR5cGVcclxuICAgICAgICAgICAgby50eXBlID0gbmFtZTtcclxuICAgICAgICAgICAgLy8gU2V0IGZyZXF1ZW5jeVxyXG4gICAgICAgICAgICBvLmZyZXF1ZW5jeS52YWx1ZSA9IGZyZXF1ZW5jeTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBvO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbn0se31dLDU6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xyXG4vKipcclxuICogQmFuZC5qcyAtIE11c2ljIENvbXBvc2VyXHJcbiAqIEFuIGludGVyZmFjZSBmb3IgdGhlIFdlYiBBdWRpbyBBUEkgdGhhdCBzdXBwb3J0cyByaHl0aG1zLCBtdWx0aXBsZSBpbnN0cnVtZW50cywgcmVwZWF0aW5nIHNlY3Rpb25zLCBhbmQgY29tcGxleFxyXG4gKiB0aW1lIHNpZ25hdHVyZXMuXHJcbiAqXHJcbiAqIEBhdXRob3IgQ29keSBMdW5kcXVpc3QgKGh0dHA6Ly9naXRodWIuY29tL21lZW5pZSkgLSAyMDE0XHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IEluc3RydW1lbnQ7XHJcblxyXG4vKipcclxuICogSW5zdHJ1bWVudCBDbGFzcyAtIEdldHMgaW5zdGFudGlhdGVkIHdoZW4gYENvbmR1Y3Rvci5jcmVhdGVJbnN0cnVtZW50KClgIGlzIGNhbGxlZC5cclxuICpcclxuICogQHBhcmFtIG5hbWVcclxuICogQHBhcmFtIHBhY2tcclxuICogQHBhcmFtIGNvbmR1Y3RvclxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIEluc3RydW1lbnQobmFtZSwgcGFjaywgY29uZHVjdG9yKSB7XHJcbiAgICAvLyBEZWZhdWx0IHRvIFNpbmUgT3NjaWxsYXRvclxyXG4gICAgaWYgKCEgbmFtZSkge1xyXG4gICAgICAgIG5hbWUgPSAnc2luZSc7XHJcbiAgICB9XHJcbiAgICBpZiAoISBwYWNrKSB7XHJcbiAgICAgICAgcGFjayA9ICdvc2NpbGxhdG9ycyc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBjb25kdWN0b3IucGFja3MuaW5zdHJ1bWVudFtwYWNrXSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IocGFjayArICcgaXMgbm90IGEgY3VycmVudGx5IGxvYWRlZCBJbnN0cnVtZW50IFBhY2suJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIZWxwZXIgZnVuY3Rpb24gdG8gZmlndXJlIG91dCBob3cgbG9uZyBhIG5vdGUgaXNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcmh5dGhtXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBnZXREdXJhdGlvbihyaHl0aG0pIHtcclxuICAgICAgICBpZiAodHlwZW9mIGNvbmR1Y3Rvci5ub3Rlc1tyaHl0aG1dID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3Iocmh5dGhtICsgJyBpcyBub3QgYSBjb3JyZWN0IHJoeXRobS4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjb25kdWN0b3Iubm90ZXNbcmh5dGhtXSAqIGNvbmR1Y3Rvci50ZW1wbyAvIGNvbmR1Y3Rvci5ub3RlR2V0c0JlYXQgKiAxMDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhlbHBlciBmdW5jdGlvbiB0byBjbG9uZSBhbiBvYmplY3RcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gb2JqXHJcbiAgICAgKiBAcmV0dXJucyB7Y29weX1cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gY2xvbmUob2JqKSB7XHJcbiAgICAgICAgaWYgKG51bGwgPT09IG9iaiB8fCBcIm9iamVjdFwiICE9IHR5cGVvZiBvYmopIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9iajtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNvcHkgPSBvYmouY29uc3RydWN0b3IoKTtcclxuICAgICAgICBmb3IgKHZhciBhdHRyIGluIG9iaikge1xyXG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGF0dHIpKSB7XHJcbiAgICAgICAgICAgICAgICBjb3B5W2F0dHJdID0gb2JqW2F0dHJdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY29weTtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHZhciBpbnN0cnVtZW50ID0gdGhpcyxcclxuICAgICAgICBsYXN0UmVwZWF0Q291bnQgPSAwLFxyXG4gICAgICAgIHZvbHVtZUxldmVsID0gMSxcclxuICAgICAgICBhcnRpY3VsYXRpb25HYXBQZXJjZW50YWdlID0gMC4wNTtcclxuXHJcbiAgICBpbnN0cnVtZW50LnRvdGFsRHVyYXRpb24gPSAwO1xyXG4gICAgaW5zdHJ1bWVudC5idWZmZXJQb3NpdGlvbiA9IDA7XHJcbiAgICBpbnN0cnVtZW50Lmluc3RydW1lbnQgPSBjb25kdWN0b3IucGFja3MuaW5zdHJ1bWVudFtwYWNrXShuYW1lLCBjb25kdWN0b3IuYXVkaW9Db250ZXh0KTtcclxuICAgIGluc3RydW1lbnQubm90ZXMgPSBbXTtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgdm9sdW1lIGxldmVsIGZvciBhbiBpbnN0cnVtZW50XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIG5ld1ZvbHVtZUxldmVsXHJcbiAgICAgKi9cclxuICAgIGluc3RydW1lbnQuc2V0Vm9sdW1lID0gZnVuY3Rpb24obmV3Vm9sdW1lTGV2ZWwpIHtcclxuICAgICAgICBpZiAobmV3Vm9sdW1lTGV2ZWwgPiAxKSB7XHJcbiAgICAgICAgICAgIG5ld1ZvbHVtZUxldmVsID0gbmV3Vm9sdW1lTGV2ZWwgLyAxMDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZvbHVtZUxldmVsID0gbmV3Vm9sdW1lTGV2ZWw7XHJcblxyXG4gICAgICAgIHJldHVybiBpbnN0cnVtZW50O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIG5vdGUgdG8gYW4gaW5zdHJ1bWVudFxyXG4gICAgICogQHBhcmFtIHJoeXRobVxyXG4gICAgICogQHBhcmFtIFtwaXRjaF0gLSBDb21tYSBzZXBhcmF0ZWQgc3RyaW5nIGlmIG1vcmUgdGhhbiBvbmUgcGl0Y2hcclxuICAgICAqIEBwYXJhbSBbdGllXVxyXG4gICAgICovXHJcbiAgICBpbnN0cnVtZW50Lm5vdGUgPSBmdW5jdGlvbihyaHl0aG0sIHBpdGNoLCB0aWUpIHtcclxuICAgICAgICB2YXIgZHVyYXRpb24gPSBnZXREdXJhdGlvbihyaHl0aG0pLFxyXG4gICAgICAgICAgICBhcnRpY3VsYXRpb25HYXAgPSB0aWUgPyAwIDogZHVyYXRpb24gKiBhcnRpY3VsYXRpb25HYXBQZXJjZW50YWdlO1xyXG5cclxuICAgICAgICBpZiAocGl0Y2gpIHtcclxuICAgICAgICAgICAgcGl0Y2ggPSBwaXRjaC5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSAtMTtcclxuICAgICAgICAgICAgd2hpbGUgKCsrIGluZGV4IDwgcGl0Y2gubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcCA9IHBpdGNoW2luZGV4XTtcclxuICAgICAgICAgICAgICAgIHAgPSBwLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uZHVjdG9yLnBpdGNoZXNbcF0gPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcCA9IHBhcnNlRmxvYXQocCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzTmFOKHApIHx8IHAgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihwICsgJyBpcyBub3QgYSB2YWxpZCBwaXRjaC4nKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluc3RydW1lbnQubm90ZXMucHVzaCh7XHJcbiAgICAgICAgICAgIHJoeXRobTogcmh5dGhtLFxyXG4gICAgICAgICAgICBwaXRjaDogcGl0Y2gsXHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcclxuICAgICAgICAgICAgYXJ0aWN1bGF0aW9uR2FwOiBhcnRpY3VsYXRpb25HYXAsXHJcbiAgICAgICAgICAgIHRpZTogdGllLFxyXG4gICAgICAgICAgICBzdGFydFRpbWU6IGluc3RydW1lbnQudG90YWxEdXJhdGlvbixcclxuICAgICAgICAgICAgc3RvcFRpbWU6IGluc3RydW1lbnQudG90YWxEdXJhdGlvbiArIGR1cmF0aW9uIC0gYXJ0aWN1bGF0aW9uR2FwLFxyXG4gICAgICAgICAgICAvLyBWb2x1bWUgbmVlZHMgdG8gYmUgYSBxdWFydGVyIG9mIHRoZSBtYXN0ZXIgc28gaXQgZG9lc24ndCBjbGlwXHJcbiAgICAgICAgICAgIHZvbHVtZUxldmVsOiB2b2x1bWVMZXZlbCAvIDRcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uICs9IGR1cmF0aW9uO1xyXG5cclxuICAgICAgICByZXR1cm4gaW5zdHJ1bWVudDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSByZXN0IHRvIGFuIGluc3RydW1lbnRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcmh5dGhtXHJcbiAgICAgKi9cclxuICAgIGluc3RydW1lbnQucmVzdCA9IGZ1bmN0aW9uKHJoeXRobSkge1xyXG4gICAgICAgIHZhciBkdXJhdGlvbiA9IGdldER1cmF0aW9uKHJoeXRobSk7XHJcblxyXG4gICAgICAgIGluc3RydW1lbnQubm90ZXMucHVzaCh7XHJcbiAgICAgICAgICAgIHJoeXRobTogcmh5dGhtLFxyXG4gICAgICAgICAgICBwaXRjaDogZmFsc2UsXHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcclxuICAgICAgICAgICAgYXJ0aWN1bGF0aW9uR2FwOiAwLFxyXG4gICAgICAgICAgICBzdGFydFRpbWU6IGluc3RydW1lbnQudG90YWxEdXJhdGlvbixcclxuICAgICAgICAgICAgc3RvcFRpbWU6IGluc3RydW1lbnQudG90YWxEdXJhdGlvbiArIGR1cmF0aW9uXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGluc3RydW1lbnQudG90YWxEdXJhdGlvbiArPSBkdXJhdGlvbjtcclxuXHJcbiAgICAgICAgcmV0dXJuIGluc3RydW1lbnQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGxhY2Ugd2hlcmUgYSByZXBlYXQgc2VjdGlvbiBzaG91bGQgc3RhcnRcclxuICAgICAqL1xyXG4gICAgaW5zdHJ1bWVudC5yZXBlYXRTdGFydCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxhc3RSZXBlYXRDb3VudCA9IGluc3RydW1lbnQubm90ZXMubGVuZ3RoO1xyXG5cclxuICAgICAgICByZXR1cm4gaW5zdHJ1bWVudDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXBlYXQgZnJvbSBiZWdpbm5pbmdcclxuICAgICAqL1xyXG4gICAgaW5zdHJ1bWVudC5yZXBlYXRGcm9tQmVnaW5uaW5nID0gZnVuY3Rpb24obnVtT2ZSZXBlYXRzKSB7XHJcbiAgICAgICAgbGFzdFJlcGVhdENvdW50ID0gMDtcclxuICAgICAgICBpbnN0cnVtZW50LnJlcGVhdChudW1PZlJlcGVhdHMpO1xyXG5cclxuICAgICAgICByZXR1cm4gaW5zdHJ1bWVudDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBOdW1iZXIgb2YgdGltZXMgdGhlIHNlY3Rpb24gc2hvdWxkIHJlcGVhdFxyXG4gICAgICogQHBhcmFtIFtudW1PZlJlcGVhdHNdIC0gZGVmYXVsdHMgdG8gMVxyXG4gICAgICovXHJcbiAgICBpbnN0cnVtZW50LnJlcGVhdCA9IGZ1bmN0aW9uKG51bU9mUmVwZWF0cykge1xyXG4gICAgICAgIG51bU9mUmVwZWF0cyA9IHR5cGVvZiBudW1PZlJlcGVhdHMgPT09ICd1bmRlZmluZWQnID8gMSA6IG51bU9mUmVwZWF0cztcclxuICAgICAgICB2YXIgbm90ZXNCdWZmZXJDb3B5ID0gaW5zdHJ1bWVudC5ub3Rlcy5zbGljZShsYXN0UmVwZWF0Q291bnQpO1xyXG4gICAgICAgIGZvciAodmFyIHIgPSAwOyByIDwgbnVtT2ZSZXBlYXRzOyByICsrKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IC0xO1xyXG4gICAgICAgICAgICB3aGlsZSAoKytpbmRleCA8IG5vdGVzQnVmZmVyQ29weS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBub3RlQ29weSA9IGNsb25lKG5vdGVzQnVmZmVyQ29weVtpbmRleF0pO1xyXG5cclxuICAgICAgICAgICAgICAgIG5vdGVDb3B5LnN0YXJ0VGltZSA9IGluc3RydW1lbnQudG90YWxEdXJhdGlvbjtcclxuICAgICAgICAgICAgICAgIG5vdGVDb3B5LnN0b3BUaW1lID0gaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uICsgbm90ZUNvcHkuZHVyYXRpb24gLSBub3RlQ29weS5hcnRpY3VsYXRpb25HYXA7XHJcblxyXG4gICAgICAgICAgICAgICAgaW5zdHJ1bWVudC5ub3Rlcy5wdXNoKG5vdGVDb3B5KTtcclxuICAgICAgICAgICAgICAgIGluc3RydW1lbnQudG90YWxEdXJhdGlvbiArPSBub3RlQ29weS5kdXJhdGlvbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGluc3RydW1lbnQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVzZXQgdGhlIGR1cmF0aW9uLCBzdGFydCwgYW5kIHN0b3AgdGltZSBvZiBlYWNoIG5vdGUuXHJcbiAgICAgKi9cclxuICAgIGluc3RydW1lbnQucmVzZXREdXJhdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBpbmRleCA9IC0xLFxyXG4gICAgICAgICAgICBudW1PZk5vdGVzID0gaW5zdHJ1bWVudC5ub3Rlcy5sZW5ndGg7XHJcblxyXG4gICAgICAgIGluc3RydW1lbnQudG90YWxEdXJhdGlvbiA9IDA7XHJcblxyXG4gICAgICAgIHdoaWxlICgrK2luZGV4IDwgbnVtT2ZOb3Rlcykge1xyXG4gICAgICAgICAgICB2YXIgbm90ZSA9IGluc3RydW1lbnQubm90ZXNbaW5kZXhdLFxyXG4gICAgICAgICAgICAgICAgZHVyYXRpb24gPSBnZXREdXJhdGlvbihub3RlLnJoeXRobSksXHJcbiAgICAgICAgICAgICAgICBhcnRpY3VsYXRpb25HYXAgPSBub3RlLnRpZSA/IDAgOiBkdXJhdGlvbiAqIGFydGljdWxhdGlvbkdhcFBlcmNlbnRhZ2U7XHJcblxyXG4gICAgICAgICAgICBub3RlLmR1cmF0aW9uID0gZ2V0RHVyYXRpb24obm90ZS5yaHl0aG0pO1xyXG4gICAgICAgICAgICBub3RlLnN0YXJ0VGltZSA9IGluc3RydW1lbnQudG90YWxEdXJhdGlvbjtcclxuICAgICAgICAgICAgbm90ZS5zdG9wVGltZSA9IGluc3RydW1lbnQudG90YWxEdXJhdGlvbiArIGR1cmF0aW9uIC0gYXJ0aWN1bGF0aW9uR2FwO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5vdGUucGl0Y2ggIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBub3RlLmFydGljdWxhdGlvbkdhcCA9IGFydGljdWxhdGlvbkdhcDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uICs9IGR1cmF0aW9uO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbn0se31dLDY6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xyXG4vKipcclxuICogQmFuZC5qcyAtIE11c2ljIENvbXBvc2VyXHJcbiAqIEFuIGludGVyZmFjZSBmb3IgdGhlIFdlYiBBdWRpbyBBUEkgdGhhdCBzdXBwb3J0cyByaHl0aG1zLCBtdWx0aXBsZSBpbnN0cnVtZW50cywgcmVwZWF0aW5nIHNlY3Rpb25zLCBhbmQgY29tcGxleFxyXG4gKiB0aW1lIHNpZ25hdHVyZXMuXHJcbiAqXHJcbiAqIEBhdXRob3IgQ29keSBMdW5kcXVpc3QgKGh0dHA6Ly9naXRodWIuY29tL21lZW5pZSkgLSAyMDE0XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlIHtCYW5kSlN9XHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IF9kZXJlcV8oJy4vY29uZHVjdG9yLmpzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5sb2FkUGFjaygnaW5zdHJ1bWVudCcsICdub2lzZXMnLCBfZGVyZXFfKCcuL2luc3RydW1lbnQtcGFja3Mvbm9pc2VzLmpzJykpO1xyXG5tb2R1bGUuZXhwb3J0cy5sb2FkUGFjaygnaW5zdHJ1bWVudCcsICdvc2NpbGxhdG9ycycsIF9kZXJlcV8oJy4vaW5zdHJ1bWVudC1wYWNrcy9vc2NpbGxhdG9ycy5qcycpKTtcclxubW9kdWxlLmV4cG9ydHMubG9hZFBhY2soJ3JoeXRobScsICdub3J0aEFtZXJpY2FuJywgX2RlcmVxXygnLi9yaHl0aG0tcGFja3Mvbm9ydGgtYW1lcmljYW4uanMnKSk7XHJcbm1vZHVsZS5leHBvcnRzLmxvYWRQYWNrKCdyaHl0aG0nLCAnZXVyb3BlYW4nLCBfZGVyZXFfKCcuL3JoeXRobS1wYWNrcy9ldXJvcGVhbi5qcycpKTtcclxubW9kdWxlLmV4cG9ydHMubG9hZFBhY2soJ3R1bmluZycsICdlcXVhbFRlbXBlcmFtZW50JywgX2RlcmVxXygnLi90dW5pbmctcGFja3MvZXF1YWwtdGVtcGVyYW1lbnQuanMnKSk7XHJcblxyXG59LHtcIi4vY29uZHVjdG9yLmpzXCI6MixcIi4vaW5zdHJ1bWVudC1wYWNrcy9ub2lzZXMuanNcIjozLFwiLi9pbnN0cnVtZW50LXBhY2tzL29zY2lsbGF0b3JzLmpzXCI6NCxcIi4vcmh5dGhtLXBhY2tzL2V1cm9wZWFuLmpzXCI6OCxcIi4vcmh5dGhtLXBhY2tzL25vcnRoLWFtZXJpY2FuLmpzXCI6OSxcIi4vdHVuaW5nLXBhY2tzL2VxdWFsLXRlbXBlcmFtZW50LmpzXCI6MTB9XSw3OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcclxuLyoqXHJcbiAqIEJhbmQuanMgLSBNdXNpYyBDb21wb3NlclxyXG4gKiBBbiBpbnRlcmZhY2UgZm9yIHRoZSBXZWIgQXVkaW8gQVBJIHRoYXQgc3VwcG9ydHMgcmh5dGhtcywgbXVsdGlwbGUgaW5zdHJ1bWVudHMsIHJlcGVhdGluZyBzZWN0aW9ucywgYW5kIGNvbXBsZXhcclxuICogdGltZSBzaWduYXR1cmVzLlxyXG4gKlxyXG4gKiBAYXV0aG9yIENvZHkgTHVuZHF1aXN0IChodHRwOi8vZ2l0aHViLmNvbS9tZWVuaWUpIC0gMjAxNFxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXI7XHJcblxyXG4vKipcclxuICogUGxheWVyIENsYXNzIC0gVGhpcyBnZXRzIGluc3RhbnRpYXRlZCBieSB0aGUgQ29uZHVjdG9yIGNsYXNzIHdoZW4gYENvbmR1Y3Rvci5maW5pc2goKWAgaXMgY2FsbGVkXHJcbiAqXHJcbiAqIEBwYXJhbSBjb25kdWN0b3JcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBQbGF5ZXIoY29uZHVjdG9yKSB7XHJcbiAgICB2YXIgcGxheWVyID0gdGhpcyxcclxuICAgICAgICBidWZmZXJUaW1lb3V0LFxyXG4gICAgICAgIGFsbE5vdGVzID0gYnVmZmVyTm90ZXMoKSxcclxuICAgICAgICBjdXJyZW50UGxheVRpbWUsXHJcbiAgICAgICAgdG90YWxQbGF5VGltZSA9IDAsXHJcbiAgICAgICAgZmFkZWQgPSBmYWxzZTtcclxuXHJcbiAgICBjYWxjdWxhdGVUb3RhbER1cmF0aW9uKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIZWxwZXIgZnVuY3Rpb24gdG8gc3RvcCBhbGwgbm90ZXMgYW5kXHJcbiAgICAgKiB0aGVuIHJlLWJ1ZmZlcnMgdGhlbVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3Jlc2V0RHVyYXRpb25dXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHJlc2V0KHJlc2V0RHVyYXRpb24pIHtcclxuICAgICAgICAvLyBSZXNldCB0aGUgYnVmZmVyIHBvc2l0aW9uIG9mIGFsbCBpbnN0cnVtZW50c1xyXG4gICAgICAgIHZhciBpbmRleCA9IC0xLFxyXG4gICAgICAgICAgICBudW1PZkluc3RydW1lbnRzID0gY29uZHVjdG9yLmluc3RydW1lbnRzLmxlbmd0aDtcclxuICAgICAgICB3aGlsZSAoKytpbmRleCA8IG51bU9mSW5zdHJ1bWVudHMpIHtcclxuICAgICAgICAgICAgdmFyIGluc3RydW1lbnQgPSBjb25kdWN0b3IuaW5zdHJ1bWVudHNbaW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc2V0RHVyYXRpb24pIHtcclxuICAgICAgICAgICAgICAgIGluc3RydW1lbnQucmVzZXREdXJhdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGluc3RydW1lbnQuYnVmZmVyUG9zaXRpb24gPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSWYgd2UgYXJlIHJlc2V0aW5nIHRoZSBkdXJhdGlvbiwgd2UgbmVlZCB0byBmaWd1cmUgb3V0IHRoZSBuZXcgdG90YWwgZHVyYXRpb24uXHJcbiAgICAgICAgLy8gQWxzbyBzZXQgdGhlIHRvdGFsUGxheVRpbWUgdG8gdGhlIGN1cnJlbnQgcGVyY2VudGFnZSBkb25lIG9mIHRoZSBuZXcgdG90YWwgZHVyYXRpb24uXHJcbiAgICAgICAgaWYgKHJlc2V0RHVyYXRpb24pIHtcclxuICAgICAgICAgICAgY2FsY3VsYXRlVG90YWxEdXJhdGlvbigpO1xyXG4gICAgICAgICAgICB0b3RhbFBsYXlUaW1lID0gY29uZHVjdG9yLnBlcmNlbnRhZ2VDb21wbGV0ZSAqIGNvbmR1Y3Rvci50b3RhbER1cmF0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5kZXggPSAtMTtcclxuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGFsbE5vdGVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBhbGxOb3Rlc1tpbmRleF0uZ2Fpbi5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbGVhclRpbWVvdXQoYnVmZmVyVGltZW91dCk7XHJcblxyXG4gICAgICAgIGFsbE5vdGVzID0gYnVmZmVyTm90ZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhlbHBlciBmdW5jdGlvbiB0byBmYWRlIHVwL2Rvd24gbWFzdGVyIHZvbHVtZVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBkaXJlY3Rpb24gLSB1cCBvciBkb3duXHJcbiAgICAgKiBAcGFyYW0gW2NiXSAtIENhbGxiYWNrIGZ1bmN0aW9uIGZpcmVkIGFmdGVyIHRoZSB0cmFuc2l0aW9uIGlzIGNvbXBsZXRlZFxyXG4gICAgICogQHBhcmFtIFtyZXNldFZvbHVtZV0gLSBSZXNldCB0aGUgdm9sdW1lIGJhY2sgdG8gaXQncyBvcmlnaW5hbCBsZXZlbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBmYWRlKGRpcmVjdGlvbiwgY2IsIHJlc2V0Vm9sdW1lKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiByZXNldFZvbHVtZSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgcmVzZXRWb2x1bWUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCd1cCcgIT09IGRpcmVjdGlvbiAmJiAnZG93bicgIT09IGRpcmVjdGlvbikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RpcmVjdGlvbiBtdXN0IGJlIGVpdGhlciB1cCBvciBkb3duLicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGZhZGVEdXJhdGlvbiA9IDAuMjtcclxuXHJcbiAgICAgICAgZmFkZWQgPSBkaXJlY3Rpb24gPT09ICdkb3duJztcclxuXHJcbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3VwJykge1xyXG4gICAgICAgICAgICBjb25kdWN0b3IubWFzdGVyVm9sdW1lLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMCwgY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XHJcbiAgICAgICAgICAgIGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWUuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZShjb25kdWN0b3IubWFzdGVyVm9sdW1lTGV2ZWwsIGNvbmR1Y3Rvci5hdWRpb0NvbnRleHQuY3VycmVudFRpbWUgKyBmYWRlRHVyYXRpb24pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWUuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZShjb25kdWN0b3IubWFzdGVyVm9sdW1lTGV2ZWwsIGNvbmR1Y3Rvci5hdWRpb0NvbnRleHQuY3VycmVudFRpbWUpO1xyXG4gICAgICAgICAgICBjb25kdWN0b3IubWFzdGVyVm9sdW1lLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMCwgY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSArIGZhZGVEdXJhdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICBjYi5jYWxsKHBsYXllcik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChyZXNldFZvbHVtZSkge1xyXG4gICAgICAgICAgICAgICAgZmFkZWQgPSAhIGZhZGVkO1xyXG4gICAgICAgICAgICAgICAgY29uZHVjdG9yLm1hc3RlclZvbHVtZS5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWVMZXZlbCwgY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBmYWRlRHVyYXRpb24gKiAxMDAwKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZXMgdGhlIHRvdGFsIGR1cmF0aW9uIG9mIGEgc29uZyBiYXNlZCBvbiB0aGUgbG9uZ2VzdCBkdXJhdGlvbiBvZiBhbGwgaW5zdHJ1bWVudHMuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZVRvdGFsRHVyYXRpb24oKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gLTE7XHJcbiAgICAgICAgdmFyIHRvdGFsRHVyYXRpb24gPSAwO1xyXG4gICAgICAgIHdoaWxlICgrK2luZGV4IDwgY29uZHVjdG9yLmluc3RydW1lbnRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB2YXIgaW5zdHJ1bWVudCA9IGNvbmR1Y3Rvci5pbnN0cnVtZW50c1tpbmRleF07XHJcbiAgICAgICAgICAgIGlmIChpbnN0cnVtZW50LnRvdGFsRHVyYXRpb24gPiB0b3RhbER1cmF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB0b3RhbER1cmF0aW9uID0gaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25kdWN0b3IudG90YWxEdXJhdGlvbiA9IHRvdGFsRHVyYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHcmFicyBhIHNldCBvZiBub3RlcyBiYXNlZCBvbiB0aGUgY3VycmVudCB0aW1lIGFuZCB3aGF0IHRoZSBCdWZmZXIgU2l6ZSBpcy5cclxuICAgICAqIEl0IHdpbGwgYWxzbyBza2lwIGFueSBub3RlcyB0aGF0IGhhdmUgYSBzdGFydCB0aW1lIGxlc3MgdGhhbiB0aGVcclxuICAgICAqIHRvdGFsIHBsYXkgdGltZS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGJ1ZmZlck5vdGVzKCkge1xyXG4gICAgICAgIHZhciBub3RlcyA9IFtdLFxyXG4gICAgICAgICAgICBpbmRleCA9IC0xLFxyXG4gICAgICAgICAgICBidWZmZXJTaXplID0gY29uZHVjdG9yLm5vdGVCdWZmZXJMZW5ndGg7XHJcblxyXG4gICAgICAgIHdoaWxlICgrK2luZGV4IDwgY29uZHVjdG9yLmluc3RydW1lbnRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB2YXIgaW5zdHJ1bWVudCA9IGNvbmR1Y3Rvci5pbnN0cnVtZW50c1tpbmRleF07XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSB2b2x1bWUgZm9yIHRoaXMgaW5zdHJ1bWVudFxyXG4gICAgICAgICAgICB2YXIgYnVmZmVyQ291bnQgPSBidWZmZXJTaXplO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXgyID0gLTE7XHJcbiAgICAgICAgICAgIHdoaWxlICgrK2luZGV4MiA8IGJ1ZmZlckNvdW50KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbm90ZSA9IGluc3RydW1lbnQubm90ZXNbaW5zdHJ1bWVudC5idWZmZXJQb3NpdGlvbiArIGluZGV4Ml07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBub3RlID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBwaXRjaCA9IG5vdGUucGl0Y2gsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lID0gbm90ZS5zdGFydFRpbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcFRpbWUgPSBub3RlLnN0b3BUaW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIHZvbHVtZUxldmVsID0gbm90ZS52b2x1bWVMZXZlbDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc3RvcFRpbWUgPCB0b3RhbFBsYXlUaW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyQ291bnQgKys7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSWYgcGl0Y2ggaXMgZmFsc2UsIHRoZW4gaXQncyBhIHJlc3QgYW5kIHdlIGRvbid0IG5lZWQgYSBub3RlXHJcbiAgICAgICAgICAgICAgICBpZiAoZmFsc2UgPT09IHBpdGNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGdhaW4gPSBjb25kdWN0b3IuYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcclxuICAgICAgICAgICAgICAgIC8vIENvbm5lY3Qgdm9sdW1lIGdhaW4gdG8gdGhlIE1hc3RlciBWb2x1bWU7XHJcbiAgICAgICAgICAgICAgICBnYWluLmNvbm5lY3QoY29uZHVjdG9yLm1hc3RlclZvbHVtZSk7XHJcbiAgICAgICAgICAgICAgICBnYWluLmdhaW4udmFsdWUgPSB2b2x1bWVMZXZlbDtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgc3RhcnRUaW1lIGlzIGxlc3MgdGhhbiB0b3RhbCBwbGF5IHRpbWUsIHdlIG5lZWQgdG8gc3RhcnQgdGhlIG5vdGVcclxuICAgICAgICAgICAgICAgIC8vIGluIHRoZSBtaWRkbGVcclxuICAgICAgICAgICAgICAgIGlmIChzdGFydFRpbWUgPCB0b3RhbFBsYXlUaW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lID0gc3RvcFRpbWUgLSB0b3RhbFBsYXlUaW1lO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIE5vIHBpdGNoZXMgZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwaXRjaCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBub3Rlcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiBzdGFydFRpbWUgPCB0b3RhbFBsYXlUaW1lID8gc3RvcFRpbWUgLSB0b3RhbFBsYXlUaW1lIDogc3RhcnRUaW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9wVGltZTogc3RvcFRpbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGU6IGluc3RydW1lbnQuaW5zdHJ1bWVudC5jcmVhdGVOb3RlKGdhaW4pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnYWluOiBnYWluLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2b2x1bWVMZXZlbDogdm9sdW1lTGV2ZWxcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4MyA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICgrK2luZGV4MyA8IHBpdGNoLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcCA9IHBpdGNoW2luZGV4M107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdGVzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiBzdGFydFRpbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9wVGltZTogc3RvcFRpbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlOiBpbnN0cnVtZW50Lmluc3RydW1lbnQuY3JlYXRlTm90ZShnYWluLCBjb25kdWN0b3IucGl0Y2hlc1twLnRyaW0oKV0gfHwgcGFyc2VGbG9hdChwKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYWluOiBnYWluLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm9sdW1lTGV2ZWw6IHZvbHVtZUxldmVsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbnN0cnVtZW50LmJ1ZmZlclBvc2l0aW9uICs9IGJ1ZmZlckNvdW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUmV0dXJuIGFycmF5IG9mIG5vdGVzXHJcbiAgICAgICAgcmV0dXJuIG5vdGVzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRvdGFsUGxheVRpbWVDYWxjdWxhdG9yKCkge1xyXG4gICAgICAgIGlmICghIHBsYXllci5wYXVzZWQgJiYgcGxheWVyLnBsYXlpbmcpIHtcclxuICAgICAgICAgICAgaWYgKGNvbmR1Y3Rvci50b3RhbER1cmF0aW9uIDwgdG90YWxQbGF5VGltZSkge1xyXG4gICAgICAgICAgICAgICAgcGxheWVyLnN0b3AoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBsYXllci5sb29waW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLnBsYXkoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbmR1Y3Rvci5vbkZpbmlzaGVkQ2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZVRvdGFsUGxheVRpbWUoKTtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQodG90YWxQbGF5VGltZUNhbGN1bGF0b3IsIDEwMDAgLyA2MCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsIHRvIHVwZGF0ZSB0aGUgdG90YWwgcGxheSB0aW1lIHNvIGZhclxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVUb3RhbFBsYXlUaW1lKCkge1xyXG4gICAgICAgIHRvdGFsUGxheVRpbWUgKz0gY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSAtIGN1cnJlbnRQbGF5VGltZTtcclxuICAgICAgICB2YXIgc2Vjb25kcyA9IE1hdGgucm91bmQodG90YWxQbGF5VGltZSk7XHJcbiAgICAgICAgaWYgKHNlY29uZHMgIT0gY29uZHVjdG9yLmN1cnJlbnRTZWNvbmRzKSB7XHJcbiAgICAgICAgICAgIC8vIE1ha2UgY2FsbGJhY2sgYXN5bmNocm9ub3VzXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25kdWN0b3Iub25UaWNrZXJDYWxsYmFjayhzZWNvbmRzKTtcclxuICAgICAgICAgICAgfSwgMSk7XHJcbiAgICAgICAgICAgIGNvbmR1Y3Rvci5jdXJyZW50U2Vjb25kcyA9IHNlY29uZHM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbmR1Y3Rvci5wZXJjZW50YWdlQ29tcGxldGUgPSB0b3RhbFBsYXlUaW1lIC8gY29uZHVjdG9yLnRvdGFsRHVyYXRpb247XHJcbiAgICAgICAgY3VycmVudFBsYXlUaW1lID0gY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcclxuICAgIH1cclxuXHJcbiAgICBwbGF5ZXIucGF1c2VkID0gZmFsc2U7XHJcbiAgICBwbGF5ZXIucGxheWluZyA9IGZhbHNlO1xyXG4gICAgcGxheWVyLmxvb3BpbmcgPSBmYWxzZTtcclxuICAgIHBsYXllci5tdXRlZCA9IGZhbHNlO1xyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIEdyYWJzIGN1cnJlbnRseSBidWZmZXJlZCBub3RlcyBhbmQgY2FsbHMgdGhlaXIgc3RhcnQvc3RvcCBtZXRob2RzLlxyXG4gICAgICpcclxuICAgICAqIEl0IHRoZW4gc2V0cyB1cCBhIHRpbWVyIHRvIGJ1ZmZlciB1cCB0aGUgbmV4dCBzZXQgb2Ygbm90ZXMgYmFzZWQgb24gdGhlXHJcbiAgICAgKiBhIHNldCBidWZmZXIgc2l6ZS4gIFRoaXMgd2lsbCBrZWVwIGdvaW5nIHVudGlsIHRoZSBzb25nIGlzIHN0b3BwZWQgb3IgcGF1c2VkLlxyXG4gICAgICpcclxuICAgICAqIEl0IHdpbGwgdXNlIHRoZSB0b3RhbCB0aW1lIHBsYXllZCBzbyBmYXIgYXMgYW4gb2Zmc2V0IHNvIHlvdSBwYXVzZS9wbGF5IHRoZSBtdXNpY1xyXG4gICAgICovXHJcbiAgICBwbGF5ZXIucGxheSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHBsYXllci5wbGF5aW5nID0gdHJ1ZTtcclxuICAgICAgICBwbGF5ZXIucGF1c2VkID0gZmFsc2U7XHJcbiAgICAgICAgY3VycmVudFBsYXlUaW1lID0gY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcclxuICAgICAgICAvLyBTdGFydHMgY2FsY3VsYXRvciB3aGljaCBrZWVwcyB0cmFjayBvZiB0b3RhbCBwbGF5IHRpbWVcclxuICAgICAgICB0b3RhbFBsYXlUaW1lQ2FsY3VsYXRvcigpO1xyXG4gICAgICAgIHZhciB0aW1lT2Zmc2V0ID0gY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSAtIHRvdGFsUGxheVRpbWUsXHJcbiAgICAgICAgICAgIHBsYXlOb3RlcyA9IGZ1bmN0aW9uKG5vdGVzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSAtMTtcclxuICAgICAgICAgICAgICAgIHdoaWxlICgrK2luZGV4IDwgbm90ZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vdGUgPSBub3Rlc1tpbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXJ0VGltZSA9IG5vdGUuc3RhcnRUaW1lICsgdGltZU9mZnNldCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcFRpbWUgPSBub3RlLnN0b3BUaW1lICsgdGltZU9mZnNldDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICogSWYgbm8gdGllLCB0aGVuIHdlIG5lZWQgdG8gaW50cm9kdWNlIGEgdm9sdW1lIHJhbXAgdXAgdG8gcmVtb3ZlIGFueSBjbGlwcGluZ1xyXG4gICAgICAgICAgICAgICAgICAgICAqIGFzIE9zY2lsbGF0b3JzIGhhdmUgYW4gaXNzdWUgd2l0aCB0aGlzIHdoZW4gcGxheWluZyBhIG5vdGUgYXQgZnVsbCB2b2x1bWUuXHJcbiAgICAgICAgICAgICAgICAgICAgICogV2UgYWxzbyBwdXQgaW4gYSBzbGlnaHQgcmFtcCBkb3duIGFzIHdlbGwuICBUaGlzIG9ubHkgdGFrZXMgdXAgMS8xMDAwIG9mIGEgc2Vjb25kLlxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghIG5vdGUudGllKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFydFRpbWUgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFRpbWUgLT0gMC4wMDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcFRpbWUgKz0gMC4wMDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdGUuZ2Fpbi5nYWluLnNldFZhbHVlQXRUaW1lKDAuMCwgc3RhcnRUaW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm90ZS5nYWluLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUobm90ZS52b2x1bWVMZXZlbCwgc3RhcnRUaW1lICsgMC4wMDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3RlLmdhaW4uZ2Fpbi5zZXRWYWx1ZUF0VGltZShub3RlLnZvbHVtZUxldmVsLCBzdG9wVGltZSAtIDAuMDAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm90ZS5nYWluLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMC4wLCBzdG9wVGltZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBub3RlLm5vZGUuc3RhcnQoc3RhcnRUaW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBub3RlLm5vZGUuc3RvcChzdG9wVGltZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGJ1ZmZlclVwID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBidWZmZXJUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiBidWZmZXJJbk5ld05vdGVzKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIucGxheWluZyAmJiAhIHBsYXllci5wYXVzZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld05vdGVzID0gYnVmZmVyTm90ZXMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld05vdGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXlOb3RlcyhuZXdOb3Rlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxOb3RlcyA9IGFsbE5vdGVzLmNvbmNhdChuZXdOb3Rlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXJVcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgY29uZHVjdG9yLnRlbXBvICogNTAwMCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIHBsYXlOb3RlcyhhbGxOb3Rlcyk7XHJcbiAgICAgICAgYnVmZmVyVXAoKTtcclxuXHJcbiAgICAgICAgaWYgKGZhZGVkICYmICEgcGxheWVyLm11dGVkKSB7XHJcbiAgICAgICAgICAgIGZhZGUoJ3VwJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogU3RvcCBwbGF5aW5nIGFsbCBtdXNpYyBhbmQgcmV3aW5kIHRoZSBzb25nXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGZhZGVPdXQgYm9vbGVhbiAtIHNob3VsZCB0aGUgc29uZyBmYWRlIG91dD9cclxuICAgICAqL1xyXG4gICAgcGxheWVyLnN0b3AgPSBmdW5jdGlvbihmYWRlT3V0KSB7XHJcbiAgICAgICAgcGxheWVyLnBsYXlpbmcgPSBmYWxzZTtcclxuICAgICAgICBjb25kdWN0b3IuY3VycmVudFNlY29uZHMgPSAwO1xyXG4gICAgICAgIGNvbmR1Y3Rvci5wZXJjZW50YWdlQ29tcGxldGUgPSAwO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGZhZGVPdXQgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIGZhZGVPdXQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZmFkZU91dCAmJiAhIHBsYXllci5tdXRlZCkge1xyXG4gICAgICAgICAgICBmYWRlKCdkb3duJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB0b3RhbFBsYXlUaW1lID0gMDtcclxuICAgICAgICAgICAgICAgIHJlc2V0KCk7XHJcbiAgICAgICAgICAgICAgICAvLyBNYWtlIGNhbGxiYWNrIGFzeW5jaHJvbm91c1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25kdWN0b3Iub25UaWNrZXJDYWxsYmFjayhjb25kdWN0b3IuY3VycmVudFNlY29uZHMpO1xyXG4gICAgICAgICAgICAgICAgfSwgMSk7XHJcbiAgICAgICAgICAgIH0sIHRydWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRvdGFsUGxheVRpbWUgPSAwO1xyXG4gICAgICAgICAgICByZXNldCgpO1xyXG4gICAgICAgICAgICAvLyBNYWtlIGNhbGxiYWNrIGFzeW5jaHJvbm91c1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY29uZHVjdG9yLm9uVGlja2VyQ2FsbGJhY2soY29uZHVjdG9yLmN1cnJlbnRTZWNvbmRzKTtcclxuICAgICAgICAgICAgfSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFBhdXNlcyB0aGUgbXVzaWMsIHJlc2V0cyB0aGUgbm90ZXMsXHJcbiAgICAgKiBhbmQgZ2V0cyB0aGUgdG90YWwgdGltZSBwbGF5ZWQgc28gZmFyXHJcbiAgICAgKi9cclxuICAgIHBsYXllci5wYXVzZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHBsYXllci5wYXVzZWQgPSB0cnVlO1xyXG4gICAgICAgIHVwZGF0ZVRvdGFsUGxheVRpbWUoKTtcclxuICAgICAgICBpZiAocGxheWVyLm11dGVkKSB7XHJcbiAgICAgICAgICAgIHJlc2V0KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZmFkZSgnZG93bicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmVzZXQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCB0cnVlIGlmIHlvdSB3YW50IHRoZSBzb25nIHRvIGxvb3BcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdmFsXHJcbiAgICAgKi9cclxuICAgIHBsYXllci5sb29wID0gZnVuY3Rpb24odmFsKSB7XHJcbiAgICAgICAgcGxheWVyLmxvb3BpbmcgPSAhISB2YWw7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IGEgc3BlY2lmaWMgdGltZSB0aGF0IHRoZSBzb25nIHNob3VsZCBzdGFydCBpdC5cclxuICAgICAqIElmIGl0J3MgYWxyZWFkeSBwbGF5aW5nLCByZXNldCBhbmQgc3RhcnQgdGhlIHNvbmdcclxuICAgICAqIGFnYWluIHNvIGl0IGhhcyBhIHNlYW1sZXNzIGp1bXAuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIG5ld1RpbWVcclxuICAgICAqL1xyXG4gICAgcGxheWVyLnNldFRpbWUgPSBmdW5jdGlvbihuZXdUaW1lKSB7XHJcbiAgICAgICAgdG90YWxQbGF5VGltZSA9IHBhcnNlSW50KG5ld1RpbWUpO1xyXG4gICAgICAgIHJlc2V0KCk7XHJcbiAgICAgICAgaWYgKHBsYXllci5wbGF5aW5nICYmICEgcGxheWVyLnBhdXNlZCkge1xyXG4gICAgICAgICAgICBwbGF5ZXIucGxheSgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXNldCB0aGUgdGVtcG8gZm9yIGEgc29uZy4gVGhpcyB3aWxsIHRyaWdnZXIgYVxyXG4gICAgICogZHVyYXRpb24gcmVzZXQgZm9yIGVhY2ggaW5zdHJ1bWVudCBhcyB3ZWxsLlxyXG4gICAgICovXHJcbiAgICBwbGF5ZXIucmVzZXRUZW1wbyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJlc2V0KHRydWUpO1xyXG4gICAgICAgIGlmIChwbGF5ZXIucGxheWluZyAmJiAhIHBsYXllci5wYXVzZWQpIHtcclxuICAgICAgICAgICAgcGxheWVyLnBsYXkoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTXV0ZSBhbGwgb2YgdGhlIG11c2ljXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNiIC0gQ2FsbGJhY2sgZnVuY3Rpb24gY2FsbGVkIHdoZW4gbXVzaWMgaGFzIGJlZW4gbXV0ZWRcclxuICAgICAqL1xyXG4gICAgcGxheWVyLm11dGUgPSBmdW5jdGlvbihjYikge1xyXG4gICAgICAgIHBsYXllci5tdXRlZCA9IHRydWU7XHJcbiAgICAgICAgZmFkZSgnZG93bicsIGNiKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVbm11dGUgYWxsIG9mIHRoZSBtdXNpY1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjYiAtIENhbGxiYWNrIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIG11c2ljIGhhcyBiZWVuIHVubXV0ZWRcclxuICAgICAqL1xyXG4gICAgcGxheWVyLnVubXV0ZSA9IGZ1bmN0aW9uKGNiKSB7XHJcbiAgICAgICAgcGxheWVyLm11dGVkID0gZmFsc2U7XHJcbiAgICAgICAgZmFkZSgndXAnLCBjYik7XHJcbiAgICB9O1xyXG59XHJcblxyXG59LHt9XSw4OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcclxuLyoqXHJcbiAqIEJhbmQuanMgLSBNdXNpYyBDb21wb3NlclxyXG4gKiBBbiBpbnRlcmZhY2UgZm9yIHRoZSBXZWIgQXVkaW8gQVBJIHRoYXQgc3VwcG9ydHMgcmh5dGhtcywgbXVsdGlwbGUgaW5zdHJ1bWVudHMsIHJlcGVhdGluZyBzZWN0aW9ucywgYW5kIGNvbXBsZXhcclxuICogdGltZSBzaWduYXR1cmVzLlxyXG4gKlxyXG4gKiBAYXV0aG9yIENvZHkgTHVuZHF1aXN0IChodHRwOi8vZ2l0aHViLmNvbS9tZWVuaWUpIC0gMjAxNFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBFdXJvcGVhbiBSaHl0aG0gUGFja1xyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBzZW1pYnJldmU6IDEsXHJcbiAgICBkb3R0ZWRNaW5pbTogMC43NSxcclxuICAgIG1pbmltOiAwLjUsXHJcbiAgICBkb3R0ZWRDcm90Y2hldDogMC4zNzUsXHJcbiAgICB0cmlwbGV0TWluaW06IDAuMzMzMzMzMzQsXHJcbiAgICBjcm90Y2hldDogMC4yNSxcclxuICAgIGRvdHRlZFF1YXZlcjogMC4xODc1LFxyXG4gICAgdHJpcGxldENyb3RjaGV0OiAwLjE2NjY2NjY2NyxcclxuICAgIHF1YXZlcjogMC4xMjUsXHJcbiAgICBkb3R0ZWRTZW1pcXVhdmVyOiAwLjA5Mzc1LFxyXG4gICAgdHJpcGxldFF1YXZlcjogMC4wODMzMzMzMzMsXHJcbiAgICBzZW1pcXVhdmVyOiAwLjA2MjUsXHJcbiAgICB0cmlwbGV0U2VtaXF1YXZlcjogMC4wNDE2NjY2NjcsXHJcbiAgICBkZW1pc2VtaXF1YXZlcjogMC4wMzEyNVxyXG59O1xyXG5cclxufSx7fV0sOTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XHJcbi8qKlxyXG4gKiBCYW5kLmpzIC0gTXVzaWMgQ29tcG9zZXJcclxuICogQW4gaW50ZXJmYWNlIGZvciB0aGUgV2ViIEF1ZGlvIEFQSSB0aGF0IHN1cHBvcnRzIHJoeXRobXMsIG11bHRpcGxlIGluc3RydW1lbnRzLCByZXBlYXRpbmcgc2VjdGlvbnMsIGFuZCBjb21wbGV4XHJcbiAqIHRpbWUgc2lnbmF0dXJlcy5cclxuICpcclxuICogQGF1dGhvciBDb2R5IEx1bmRxdWlzdCAoaHR0cDovL2dpdGh1Yi5jb20vbWVlbmllKSAtIDIwMTRcclxuICovXHJcblxyXG4vKipcclxuICogTm9ydGggQW1lcmljYW4gKENhbmFkYSBhbmQgVVNBKSBSaHl0aG0gUGFja1xyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICB3aG9sZTogMSxcclxuICAgIGRvdHRlZEhhbGY6IDAuNzUsXHJcbiAgICBoYWxmOiAwLjUsXHJcbiAgICBkb3R0ZWRRdWFydGVyOiAwLjM3NSxcclxuICAgIHRyaXBsZXRIYWxmOiAwLjMzMzMzMzM0LFxyXG4gICAgcXVhcnRlcjogMC4yNSxcclxuICAgIGRvdHRlZEVpZ2h0aDogMC4xODc1LFxyXG4gICAgdHJpcGxldFF1YXJ0ZXI6IDAuMTY2NjY2NjY3LFxyXG4gICAgZWlnaHRoOiAwLjEyNSxcclxuICAgIGRvdHRlZFNpeHRlZW50aDogMC4wOTM3NSxcclxuICAgIHRyaXBsZXRFaWdodGg6IDAuMDgzMzMzMzMzLFxyXG4gICAgc2l4dGVlbnRoOiAwLjA2MjUsXHJcbiAgICB0cmlwbGV0U2l4dGVlbnRoOiAwLjA0MTY2NjY2NyxcclxuICAgIHRoaXJ0eVNlY29uZDogMC4wMzEyNVxyXG59O1xyXG5cclxufSx7fV0sMTA6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xyXG4vKipcclxuICogQmFuZC5qcyAtIE11c2ljIENvbXBvc2VyXHJcbiAqIEFuIGludGVyZmFjZSBmb3IgdGhlIFdlYiBBdWRpbyBBUEkgdGhhdCBzdXBwb3J0cyByaHl0aG1zLCBtdWx0aXBsZSBpbnN0cnVtZW50cywgcmVwZWF0aW5nIHNlY3Rpb25zLCBhbmQgY29tcGxleFxyXG4gKiB0aW1lIHNpZ25hdHVyZXMuXHJcbiAqXHJcbiAqIEBhdXRob3IgQ29keSBMdW5kcXVpc3QgKGh0dHA6Ly9naXRodWIuY29tL21lZW5pZSkgLSAyMDE0XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEVxdWFsIFRlbXBlcmFtZW50IFR1bmluZ1xyXG4gKiBTb3VyY2U6IGh0dHA6Ly93d3cucGh5Lm10dS5lZHUvfnN1aXRzL25vdGVmcmVxcy5odG1sXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgICdDMCc6IDE2LjM1LFxyXG4gICAgJ0MjMCc6IDE3LjMyLFxyXG4gICAgJ0RiMCc6IDE3LjMyLFxyXG4gICAgJ0QwJzogMTguMzUsXHJcbiAgICAnRCMwJzogMTkuNDUsXHJcbiAgICAnRWIwJzogMTkuNDUsXHJcbiAgICAnRTAnOiAyMC42MCxcclxuICAgICdGMCc6IDIxLjgzLFxyXG4gICAgJ0YjMCc6IDIzLjEyLFxyXG4gICAgJ0diMCc6IDIzLjEyLFxyXG4gICAgJ0cwJzogMjQuNTAsXHJcbiAgICAnRyMwJzogMjUuOTYsXHJcbiAgICAnQWIwJzogMjUuOTYsXHJcbiAgICAnQTAnOiAyNy41MCxcclxuICAgICdBIzAnOiAyOS4xNCxcclxuICAgICdCYjAnOiAyOS4xNCxcclxuICAgICdCMCc6IDMwLjg3LFxyXG4gICAgJ0MxJzogMzIuNzAsXHJcbiAgICAnQyMxJzogMzQuNjUsXHJcbiAgICAnRGIxJzogMzQuNjUsXHJcbiAgICAnRDEnOiAzNi43MSxcclxuICAgICdEIzEnOiAzOC44OSxcclxuICAgICdFYjEnOiAzOC44OSxcclxuICAgICdFMSc6IDQxLjIwLFxyXG4gICAgJ0YxJzogNDMuNjUsXHJcbiAgICAnRiMxJzogNDYuMjUsXHJcbiAgICAnR2IxJzogNDYuMjUsXHJcbiAgICAnRzEnOiA0OS4wMCxcclxuICAgICdHIzEnOiA1MS45MSxcclxuICAgICdBYjEnOiA1MS45MSxcclxuICAgICdBMSc6IDU1LjAwLFxyXG4gICAgJ0EjMSc6IDU4LjI3LFxyXG4gICAgJ0JiMSc6IDU4LjI3LFxyXG4gICAgJ0IxJzogNjEuNzQsXHJcbiAgICAnQzInOiA2NS40MSxcclxuICAgICdDIzInOiA2OS4zMCxcclxuICAgICdEYjInOiA2OS4zMCxcclxuICAgICdEMic6IDczLjQyLFxyXG4gICAgJ0QjMic6IDc3Ljc4LFxyXG4gICAgJ0ViMic6IDc3Ljc4LFxyXG4gICAgJ0UyJzogODIuNDEsXHJcbiAgICAnRjInOiA4Ny4zMSxcclxuICAgICdGIzInOiA5Mi41MCxcclxuICAgICdHYjInOiA5Mi41MCxcclxuICAgICdHMic6IDk4LjAwLFxyXG4gICAgJ0cjMic6IDEwMy44MyxcclxuICAgICdBYjInOiAxMDMuODMsXHJcbiAgICAnQTInOiAxMTAuMDAsXHJcbiAgICAnQSMyJzogMTE2LjU0LFxyXG4gICAgJ0JiMic6IDExNi41NCxcclxuICAgICdCMic6IDEyMy40NyxcclxuICAgICdDMyc6IDEzMC44MSxcclxuICAgICdDIzMnOiAxMzguNTksXHJcbiAgICAnRGIzJzogMTM4LjU5LFxyXG4gICAgJ0QzJzogMTQ2LjgzLFxyXG4gICAgJ0QjMyc6IDE1NS41NixcclxuICAgICdFYjMnOiAxNTUuNTYsXHJcbiAgICAnRTMnOiAxNjQuODEsXHJcbiAgICAnRjMnOiAxNzQuNjEsXHJcbiAgICAnRiMzJzogMTg1LjAwLFxyXG4gICAgJ0diMyc6IDE4NS4wMCxcclxuICAgICdHMyc6IDE5Ni4wMCxcclxuICAgICdHIzMnOiAyMDcuNjUsXHJcbiAgICAnQWIzJzogMjA3LjY1LFxyXG4gICAgJ0EzJzogMjIwLjAwLFxyXG4gICAgJ0EjMyc6IDIzMy4wOCxcclxuICAgICdCYjMnOiAyMzMuMDgsXHJcbiAgICAnQjMnOiAyNDYuOTQsXHJcbiAgICAnQzQnOiAyNjEuNjMsXHJcbiAgICAnQyM0JzogMjc3LjE4LFxyXG4gICAgJ0RiNCc6IDI3Ny4xOCxcclxuICAgICdENCc6IDI5My42NixcclxuICAgICdEIzQnOiAzMTEuMTMsXHJcbiAgICAnRWI0JzogMzExLjEzLFxyXG4gICAgJ0U0JzogMzI5LjYzLFxyXG4gICAgJ0Y0JzogMzQ5LjIzLFxyXG4gICAgJ0YjNCc6IDM2OS45OSxcclxuICAgICdHYjQnOiAzNjkuOTksXHJcbiAgICAnRzQnOiAzOTIuMDAsXHJcbiAgICAnRyM0JzogNDE1LjMwLFxyXG4gICAgJ0FiNCc6IDQxNS4zMCxcclxuICAgICdBNCc6IDQ0MC4wMCxcclxuICAgICdBIzQnOiA0NjYuMTYsXHJcbiAgICAnQmI0JzogNDY2LjE2LFxyXG4gICAgJ0I0JzogNDkzLjg4LFxyXG4gICAgJ0M1JzogNTIzLjI1LFxyXG4gICAgJ0MjNSc6IDU1NC4zNyxcclxuICAgICdEYjUnOiA1NTQuMzcsXHJcbiAgICAnRDUnOiA1ODcuMzMsXHJcbiAgICAnRCM1JzogNjIyLjI1LFxyXG4gICAgJ0ViNSc6IDYyMi4yNSxcclxuICAgICdFNSc6IDY1OS4yNixcclxuICAgICdGNSc6IDY5OC40NixcclxuICAgICdGIzUnOiA3MzkuOTksXHJcbiAgICAnR2I1JzogNzM5Ljk5LFxyXG4gICAgJ0c1JzogNzgzLjk5LFxyXG4gICAgJ0cjNSc6IDgzMC42MSxcclxuICAgICdBYjUnOiA4MzAuNjEsXHJcbiAgICAnQTUnOiA4ODAuMDAsXHJcbiAgICAnQSM1JzogOTMyLjMzLFxyXG4gICAgJ0JiNSc6IDkzMi4zMyxcclxuICAgICdCNSc6IDk4Ny43NyxcclxuICAgICdDNic6IDEwNDYuNTAsXHJcbiAgICAnQyM2JzogMTEwOC43MyxcclxuICAgICdEYjYnOiAxMTA4LjczLFxyXG4gICAgJ0Q2JzogMTE3NC42NixcclxuICAgICdEIzYnOiAxMjQ0LjUxLFxyXG4gICAgJ0ViNic6IDEyNDQuNTEsXHJcbiAgICAnRTYnOiAxMzE4LjUxLFxyXG4gICAgJ0Y2JzogMTM5Ni45MSxcclxuICAgICdGIzYnOiAxNDc5Ljk4LFxyXG4gICAgJ0diNic6IDE0NzkuOTgsXHJcbiAgICAnRzYnOiAxNTY3Ljk4LFxyXG4gICAgJ0cjNic6IDE2NjEuMjIsXHJcbiAgICAnQWI2JzogMTY2MS4yMixcclxuICAgICdBNic6IDE3NjAuMDAsXHJcbiAgICAnQSM2JzogMTg2NC42NixcclxuICAgICdCYjYnOiAxODY0LjY2LFxyXG4gICAgJ0I2JzogMTk3NS41MyxcclxuICAgICdDNyc6IDIwOTMuMDAsXHJcbiAgICAnQyM3JzogMjIxNy40NixcclxuICAgICdEYjcnOiAyMjE3LjQ2LFxyXG4gICAgJ0Q3JzogMjM0OS4zMixcclxuICAgICdEIzcnOiAyNDg5LjAyLFxyXG4gICAgJ0ViNyc6IDI0ODkuMDIsXHJcbiAgICAnRTcnOiAyNjM3LjAyLFxyXG4gICAgJ0Y3JzogMjc5My44MyxcclxuICAgICdGIzcnOiAyOTU5Ljk2LFxyXG4gICAgJ0diNyc6IDI5NTkuOTYsXHJcbiAgICAnRzcnOiAzMTM1Ljk2LFxyXG4gICAgJ0cjNyc6IDMzMjIuNDQsXHJcbiAgICAnQWI3JzogMzMyMi40NCxcclxuICAgICdBNyc6IDM1MjAuMDAsXHJcbiAgICAnQSM3JzogMzcyOS4zMSxcclxuICAgICdCYjcnOiAzNzI5LjMxLFxyXG4gICAgJ0I3JzogMzk1MS4wNyxcclxuICAgICdDOCc6IDQxODYuMDFcclxufTtcclxuXHJcbn0se31dfSx7fSxbNl0pXHJcbig2KVxyXG59KTsiLCJpbXBvcnQgQmFuZEpTIGZyb20gJy4uL2JhbmQuanMvZGlzdC9iYW5kJztcclxuaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcclxuXHJcbmNsYXNzIEF1ZGlvIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG5cdFx0c3VwZXIocHJvcHMpO1xyXG5cdFx0dGhpcy5zdGF0ZSA9IHsgcGxheWVyOiBudWxsIH07XHJcblx0fVxyXG5cdHBsYXlIYW5kbGVyID0gKCkgPT4ge1xyXG5cdFx0aWYgKHRoaXMuc3RhdGUucGxheWVyKSB7XHJcblx0XHRcdHRoaXMuc3RhdGUucGxheWVyLnN0b3AoKTtcclxuXHRcdH1cclxuXHRcdGxldCBjb25kdWN0b3IgPSBuZXcgQmFuZEpTKCk7XHJcblx0XHRsZXQgc2VjdGlvbnNQcm9wcyA9IFtdO1xyXG5cdFx0dGhpcy5wcm9wcy5hbmFseXNpcy5zZWN0aW9ucy5mb3JFYWNoKChzZWN0aW9uKSA9PiB7XHJcblx0XHRcdHNlY3Rpb25zUHJvcHMucHVzaChbc2VjdGlvbi5kdXJhdGlvbiAqIDEwMDAsIHNlY3Rpb24udGVtcG9dKTtcclxuXHRcdH0pO1xyXG5cdFx0Y29uZHVjdG9yLnNldFRpbWVTaWduYXR1cmUoNCwgNCk7XHJcblx0XHRjb25kdWN0b3Iuc2V0VGVtcG8oc2VjdGlvbnNQcm9wc1swXVsxXSk7XHJcblx0XHRsZXQgcGlhbm8gPSBjb25kdWN0b3IuY3JlYXRlSW5zdHJ1bWVudCgnc2luZScpO1xyXG5cdFx0cGlhbm8ubm90ZSgncXVhcnRlcicsICdHMycpO1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7IHBsYXllcjogY29uZHVjdG9yLmZpbmlzaCgpIH0sICgpID0+IHtcclxuXHRcdFx0dGhpcy5zdGF0ZS5wbGF5ZXIubG9vcCh0cnVlKTtcclxuXHRcdFx0cmh5dGhtVGltZXIoc2VjdGlvbnNQcm9wc1swXVswXSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRsZXQgcmh5dGhtVGltZXIgPSAodGltZSkgPT4ge1xyXG5cdFx0XHR0aGlzLnN0YXRlLnBsYXllci5wbGF5KCk7XHJcblx0XHRcdHNlY3Rpb25zUHJvcHMuc2hpZnQoKTtcclxuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5zdGF0ZS5wbGF5ZXIuc3RvcCgpO1xyXG5cdFx0XHRcdGlmIChzZWN0aW9uc1Byb3BzLmxlbmd0aCAhPSAwKSB7XHJcblx0XHRcdFx0XHRjb25kdWN0b3Iuc2V0VGVtcG8oc2VjdGlvbnNQcm9wc1swXVsxXSk7XHJcblx0XHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgcGxheWVyOiBjb25kdWN0b3IuZmluaXNoKCkgfSk7XHJcblx0XHRcdFx0XHR0aGlzLnN0YXRlLnBsYXllci5sb29wKHRydWUpO1xyXG5cdFx0XHRcdFx0cmh5dGhtVGltZXIoc2VjdGlvbnNQcm9wc1swXVswXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCB0aW1lKTtcclxuXHRcdH07XHJcblx0fTtcclxuXHRyZW5kZXIoKSB7XHJcblx0XHRyZXR1cm4gPHAgb25DbGljaz17dGhpcy5wbGF5SGFuZGxlcn0+Y2xpY2sgTWU8L3A+O1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQXVkaW87XHJcbiIsImltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XHJcbmltcG9ydCBBdWRpbyBmcm9tICcuL0F1ZGlvJztcclxuY29uc3QgVHJhY2tzUmVzdWx0cyA9IChwcm9wcykgPT4ge1xyXG5cdGNvbnN0IHRyYWNrUmVmID0gUmVhY3QuY3JlYXRlUmVmKCk7XHJcblx0bGV0IGFuYWx5c2lzO1xyXG5cdGxldCBbc2EsIHNhc10gPSBSZWFjdC51c2VTdGF0ZShhbmFseXNpcyk7XHJcblxyXG5cdGxldCBnZXRBbmFseXNpcyA9IChlKSA9PiB7XHJcblx0XHRheGlvc1xyXG5cdFx0XHQuZ2V0KCdodHRwczovL2FwaS5zcG90aWZ5LmNvbS92MS9hdWRpby1hbmFseXNpcy8nICsgZS50YXJnZXQuaWQsIHtcclxuXHRcdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0XHRBdXRob3JpemF0aW9uOiBwcm9wcy5hdXRob3JpemF0aW9uLFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdH0pXHJcblx0XHRcdC50aGVuKChkYXRhKSA9PiB7XHJcblx0XHRcdFx0c2FzKGRhdGEuZGF0YSk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5jYXRjaCgoZXJyKSA9PiB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0fSk7XHJcblx0fTtcclxuXHJcblx0cmV0dXJuIChcclxuXHRcdDx1bCByZWY9e3RyYWNrUmVmfT5cclxuXHRcdFx0e3Byb3BzLnRyYWNrc1xyXG5cdFx0XHRcdD8gcHJvcHMudHJhY2tzLm1hcCgodHJhY2spID0+IHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHRcdFx0XHQ8bGkgaWQ9e3RyYWNrLmlkfSBrZXk9e3RyYWNrLmlkfSBvbkNsaWNrPXtnZXRBbmFseXNpc30+XHJcblx0XHRcdFx0XHRcdFx0XHR7dHJhY2submFtZX0gLSB7dHJhY2suYXJ0aXN0c1swXS5uYW1lfSAoe3RyYWNrLnBvcHVsYXJpdHl9KVxyXG5cdFx0XHRcdFx0XHRcdDwvbGk+XHJcblx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0ICB9KVxyXG5cdFx0XHRcdDogJyd9XHJcblx0XHRcdDxBdWRpbyBhbmFseXNpcz17c2F9PjwvQXVkaW8+XHJcblx0XHQ8L3VsPlxyXG5cdCk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUcmFja3NSZXN1bHRzO1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgUmh5dGhtIGZyb20gJy4vcmh5dGhtJztcclxuXHJcbmNsYXNzIERlZmF1bHQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG5cdHJlbmRlcigpIHtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdhcHAnPlxyXG5cdFx0XHRcdDxoMT5SaHl0aG0gRGV0ZWN0b3I8L2gxPlxyXG5cdFx0XHRcdDxoMj5TZWxlY3QgeW91ciBzb25nIGF0IHRoZSBzZWFyY2ggYmFyIGJlbG93PC9oMj5cclxuXHRcdFx0XHQ8Umh5dGhtPjwvUmh5dGhtPlxyXG5cdFx0XHRcdHsvKlx0PGlucHV0IHR5cGU9J3RleHQnIC8+Ki99XHJcblx0XHRcdFx0PHN0eWxlIGdsb2JhbCBqc3g+XHJcblx0XHRcdFx0XHR7YFxyXG5cdFx0XHRcdFx0XHRib2R5LFxyXG5cdFx0XHRcdFx0XHRodG1sLFxyXG5cdFx0XHRcdFx0XHQjcm9vdCB7XHJcblx0XHRcdFx0XHRcdFx0bWFyZ2luOiAwO1xyXG5cdFx0XHRcdFx0XHRcdGhlaWdodDogMTAwJTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHQqOmFjdGl2ZSxcclxuXHRcdFx0XHRcdFx0Kjpmb2N1cyB7XHJcblx0XHRcdFx0XHRcdFx0b3V0bGluZS1zdHlsZTogbm9uZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHQqIHtcclxuXHRcdFx0XHRcdFx0XHRib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdCNfX25leHQge1xyXG5cdFx0XHRcdFx0XHRcdGRpc3BsYXk6IGdyaWQ7XHJcblx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCAjMTQxZTMwLCAjMjQzYjU1KTtcclxuXHRcdFx0XHRcdFx0XHRoZWlnaHQ6IDEwMCU7XHJcblx0XHRcdFx0XHRcdFx0d2lkdGg6IDEwMCU7XHJcblx0XHRcdFx0XHRcdFx0anVzdGlmeS1pdGVtczogY2VudGVyO1xyXG5cdFx0XHRcdFx0XHRcdGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcblx0XHRcdFx0XHRcdFx0bWF4LWhlaWdodDogMTAwJTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YH1cclxuXHRcdFx0XHQ8L3N0eWxlPlxyXG5cdFx0XHRcdDxzdHlsZSBqc3g+e2BcclxuXHRcdFx0XHRcdGgxIHtcclxuXHRcdFx0XHRcdFx0Zm9udC1zaXplOiAzcmVtO1xyXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsICNmNzlkMDAsICM2NGYzOGMpO1xyXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kLWNsaXA6IHRleHQ7XHJcblx0XHRcdFx0XHRcdC13ZWJraXQtdGV4dC1maWxsLWNvbG9yOiB0cmFuc3BhcmVudDtcclxuXHRcdFx0XHRcdFx0dGV4dC1zaGFkb3c6IDBweCAwcHggNTBweCAjMWZmYzQ0MmE7XHJcblx0XHRcdFx0XHRcdHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRgfTwvc3R5bGU+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IERlZmF1bHQ7XHJcbiIsImltcG9ydCBSZWFjdCwgeyBGcmFnbWFudCwgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xyXG5pbXBvcnQgVHJhY2tzUmVzdWx0cyBmcm9tICcuL1RyYWNrc1Jlc3VsdHMnO1xyXG5cclxuY2xhc3MgUmh5dGhtIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHN1cGVyKCk7XHJcblx0XHR0aGlzLnN0YXRlID0ge1xyXG5cdFx0XHR0b2tlbjogbnVsbCxcclxuXHRcdFx0dHJhY2tfbGlzdDogW10sXHJcblx0XHRcdHF1ZXJ5OiAnJ1xyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdGNvbXBvbmVudERpZE1vdW50KCkge1xyXG5cdFx0Y29uc3QgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoXHJcblx0XHRcdC5zdWJzdHJpbmcoMSlcclxuXHRcdFx0LnNwbGl0KCcmJylcclxuXHRcdFx0LnJlZHVjZSgoaW5pdGlhbCwgaXRlbSkgPT4ge1xyXG5cdFx0XHRcdGlmIChpdGVtKSB7XHJcblx0XHRcdFx0XHR2YXIgcGFydHMgPSBpdGVtLnNwbGl0KCc9Jyk7XHJcblx0XHRcdFx0XHRpbml0aWFsW3BhcnRzWzBdXSA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1sxXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBpbml0aWFsO1xyXG5cdFx0XHR9LCB7fSk7XHJcblx0XHR0aGlzLnNldFN0YXRlKHsgdG9rZW46IGhhc2guYWNjZXNzX3Rva2VuLCB0b2tlbl90eXBlOiBoYXNoLnRva2VuX3R5cGUgfSk7XHJcblx0fVxyXG5cclxuXHRnZXRUcmFja3MgPSAoKSA9PiB7XHJcblx0XHRheGlvc1xyXG5cdFx0XHQuZ2V0KFxyXG5cdFx0XHRcdGBodHRwczovL2FwaS5zcG90aWZ5LmNvbS92MS9zZWFyY2g/cT0ke3RoaXMuc3RhdGUucXVlcnl9JnR5cGU9dHJhY2smbGltaXQ9NWAsXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0aGVhZGVyczoge1xyXG5cdFx0XHRcdFx0XHRBdXRob3JpemF0aW9uOiBgJHt0aGlzLnN0YXRlLnRva2VuX3R5cGV9ICR7dGhpcy5zdGF0ZS50b2tlbn1gXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpXHJcblx0XHRcdC50aGVuKGRhdGEgPT4ge1xyXG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoeyB0cmFja19saXN0OiBkYXRhLmRhdGEudHJhY2tzLml0ZW1zIH0pO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQuY2F0Y2goZXJyID0+IHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHR9KTtcclxuXHR9O1xyXG5cclxuXHRjaGFuZ2VIYW5kbGVyID0gKCkgPT4ge1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7IHF1ZXJ5OiB0aGlzLnNlYXJjaC52YWx1ZSB9LCAoKSA9PiB7XHJcblx0XHRcdGlmICh0aGlzLnN0YXRlLnF1ZXJ5ICYmIHRoaXMuc3RhdGUucXVlcnkubGVuZ3RoID4gMSkge1xyXG5cdFx0XHRcdHRoaXMuZ2V0VHJhY2tzKCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IHRyYWNrX2xpc3Q6IFtdIH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9O1xyXG5cclxuXHRyZW5kZXIoKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8PlxyXG5cdFx0XHRcdHshdGhpcy5zdGF0ZS50b2tlbiAmJiAoXHJcblx0XHRcdFx0XHQ8YnV0dG9uPlxyXG5cdFx0XHRcdFx0XHQ8YSBocmVmPSdodHRwczovL2FjY291bnRzLnNwb3RpZnkuY29tL2F1dGhvcml6ZT9jbGllbnRfaWQ9NThiOWM0MDYzYzkwNGNkYTg3YWY4MDE4NmE3MzJmMDEmcmVkaXJlY3RfdXJpPWh0dHA6JTJGJTJGbG9jYWxob3N0OjMwMDAmcmVzcG9uc2VfdHlwZT10b2tlbic+XHJcblx0XHRcdFx0XHRcdFx0TG9naW4gV2l0aCBTcG90aWZ5XHJcblx0XHRcdFx0XHRcdDwvYT5cclxuXHRcdFx0XHRcdDwvYnV0dG9uPlxyXG5cdFx0XHRcdCl9XHJcblx0XHRcdFx0e3RoaXMuc3RhdGUudG9rZW4gJiYgKFxyXG5cdFx0XHRcdFx0PD5cclxuXHRcdFx0XHRcdFx0PGlucHV0XHJcblx0XHRcdFx0XHRcdFx0cmVmPXtpbnB1dCA9PiAodGhpcy5zZWFyY2ggPSBpbnB1dCl9XHJcblx0XHRcdFx0XHRcdFx0b25DaGFuZ2U9e3RoaXMuY2hhbmdlSGFuZGxlcn1cclxuXHRcdFx0XHRcdFx0Lz5cclxuXHRcdFx0XHRcdFx0PFRyYWNrc1Jlc3VsdHNcclxuXHRcdFx0XHRcdFx0XHRhdXRob3JpemF0aW9uPXtgJHt0aGlzLnN0YXRlLnRva2VuX3R5cGV9ICR7dGhpcy5zdGF0ZS50b2tlbn1gfVxyXG5cdFx0XHRcdFx0XHRcdHRyYWNrcz17dGhpcy5zdGF0ZS50cmFja19saXN0fVxyXG5cdFx0XHRcdFx0XHQ+PC9UcmFja3NSZXN1bHRzPlxyXG5cdFx0XHRcdFx0PC8+XHJcblx0XHRcdFx0KX1cclxuXHRcdFx0PC8+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmh5dGhtO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJheGlvc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWFjdFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzdHlsZWQtanN4L3N0eWxlXCIpOyJdLCJzb3VyY2VSb290IjoiIn0=