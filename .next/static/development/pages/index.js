(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["static\\development\\pages\\index.js"],{

/***/ "./band.js/dist/band.js":
/*!******************************!*\
  !*** ./band.js/dist/band.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var require;var require;!function (e) {
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

    for (var o = 0; o < r.length; o++) {
      s(r[o]);
    }

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
            noop = function noop() {},
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
          createNote: function createNote(destination) {
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
          createNote: function createNote(destination, frequency) {
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
              playNotes = function playNotes(notes) {
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
              bufferUp = function bufferUp() {
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

;
    var _a, _b;
    // Legacy CSS implementations will `eval` browser code in a Node.js context
    // to extract CSS. For backwards compatibility, we need to check we're in a
    // browser context before continuing.
    if (typeof self !== 'undefined' &&
        // AMP / No-JS mode does not inject these helpers:
        '$RefreshHelpers$' in self) {
        var currentExports_1 = module.__proto__.exports;
        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;
        // This cannot happen in MainTemplate because the exports mismatch between
        // templating and execution.
        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports_1, module.i);
        // A module can be accepted automatically based on its exports, e.g. when
        // it is a Refresh Boundary.
        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports_1)) {
            // Save the previous exports on update so we can compare the boundary
            // signatures.
            module.hot.dispose(function (data) {
                data.prevExports = currentExports_1;
            });
            // Unconditionally accept an update to this module, we'll check if it's
            // still a Refresh Boundary later.
            module.hot.accept();
            // This field is set when the previous version of this module was a
            // Refresh Boundary, letting us know we need to check for invalidation or
            // enqueue an update.
            if (prevExports !== null) {
                // A boundary can become ineligible if its exports are incompatible
                // with the previous exports.
                //
                // For example, if you add/remove/change exports, we'll want to
                // re-execute the importing modules, and force those components to
                // re-render. Similarly, if you convert a class component to a
                // function, we want to invalidate the boundary.
                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports_1)) {
                    module.hot.invalidate();
                }
                else {
                    self.$RefreshHelpers$.scheduleUpdate();
                }
            }
        }
        else {
            // Since we just executed the code for the module, it's possible that the
            // new exports made it ineligible for being a boundary.
            // We only care about the case when we were _previously_ a boundary,
            // because we already accepted this update (accidental side effect).
            var isNoLongerABoundary = prevExports !== null;
            if (isNoLongerABoundary) {
                module.hot.invalidate();
            }
        }
    }

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _arrayLikeToArray; });
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _arrayWithHoles; });
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _assertThisInitialized; });
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _classCallCheck; });
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/createClass.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/createClass.js ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _createClass; });
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/defineProperty.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _defineProperty; });
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _getPrototypeOf; });
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inherits.js":
/*!*************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inherits.js ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _inherits; });
/* harmony import */ var _setPrototypeOf__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object(_setPrototypeOf__WEBPACK_IMPORTED_MODULE_0__["default"])(subClass, superClass);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _iterableToArrayLimit; });
function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _nonIterableRest; });
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _possibleConstructorReturn; });
/* harmony import */ var _helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../helpers/esm/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _assertThisInitialized__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");


function _possibleConstructorReturn(self, call) {
  if (call && (Object(_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(call) === "object" || typeof call === "function")) {
    return call;
  }

  return Object(_assertThisInitialized__WEBPACK_IMPORTED_MODULE_1__["default"])(self);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _setPrototypeOf; });
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _slicedToArray; });
/* harmony import */ var _arrayWithHoles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithHoles */ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js");
/* harmony import */ var _iterableToArrayLimit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArrayLimit */ "./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js");
/* harmony import */ var _unsupportedIterableToArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray */ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");
/* harmony import */ var _nonIterableRest__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableRest */ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js");




function _slicedToArray(arr, i) {
  return Object(_arrayWithHoles__WEBPACK_IMPORTED_MODULE_0__["default"])(arr) || Object(_iterableToArrayLimit__WEBPACK_IMPORTED_MODULE_1__["default"])(arr, i) || Object(_unsupportedIterableToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(arr, i) || Object(_nonIterableRest__WEBPACK_IMPORTED_MODULE_3__["default"])();
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _typeof; });
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _unsupportedIterableToArray; });
/* harmony import */ var _arrayLikeToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return Object(_arrayLikeToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Object(_arrayLikeToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
}

/***/ }),

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'params', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy'];
  var defaultToConfig2Keys = [
    'baseURL', 'url', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress',
    'maxContentLength', 'validateStatus', 'maxRedirects', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath'
  ];

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, function mergeDeepProperties(prop) {
    if (utils.isObject(config2[prop])) {
      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
    } else if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (utils.isObject(config1[prop])) {
      config[prop] = utils.deepMerge(config1[prop]);
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys);

  var otherKeys = Object
    .keys(config2)
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, function otherKeysDefaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Function equal to merge with the difference being that no reference
 * to original objects is kept.
 *
 * @see merge
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function deepMerge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = deepMerge(result[key], val);
    } else if (typeof val === 'object') {
      result[key] = deepMerge({}, val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  deepMerge: deepMerge,
  extend: extend,
  trim: trim
};


/***/ }),

/***/ "./node_modules/next/dist/build/webpack/loaders/next-client-pages-loader.js?page=%2F&absolutePagePath=C%3A%5CUsers%5Chillel%20nagid%5CDesktop%5Crhythm%5Cpages%5Cindex.js!./":
/*!********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-client-pages-loader.js?page=%2F&absolutePagePath=C%3A%5CUsers%5Chillel%20nagid%5CDesktop%5Crhythm%5Cpages%5Cindex.js ***!
  \********************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/",
      function () {
        return __webpack_require__(/*! ./pages/index.js */ "./pages/index.js");
      }
    ]);
  

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/react/index.js":
/*!*******************************************************************************************!*\
  !*** delegated ./node_modules/react/index.js from dll-reference dll_ec7d9c0249b2ef52b74c ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(/*! dll-reference dll_ec7d9c0249b2ef52b74c */ "dll-reference dll_ec7d9c0249b2ef52b74c"))("./node_modules/react/index.js");

/***/ }),

/***/ "./node_modules/string-hash/index.js":
/*!*******************************************!*\
  !*** ./node_modules/string-hash/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function hash(str) {
  var hash = 5381,
      i    = str.length;

  while(i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0;
}

module.exports = hash;


/***/ }),

/***/ "./node_modules/styled-jsx/dist/lib/stylesheet.js":
/*!********************************************************!*\
  !*** ./node_modules/styled-jsx/dist/lib/stylesheet.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;
exports["default"] = void 0;

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
Based on Glamor's sheet
https://github.com/threepointone/glamor/blob/667b480d31b3721a905021b26e1290ce92ca2879/src/sheet.js
*/
var isProd = typeof process !== 'undefined' && process.env && "development" === 'production';

var isString = function isString(o) {
  return Object.prototype.toString.call(o) === '[object String]';
};

var StyleSheet =
/*#__PURE__*/
function () {
  function StyleSheet(_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$name = _ref.name,
        name = _ref$name === void 0 ? 'stylesheet' : _ref$name,
        _ref$optimizeForSpeed = _ref.optimizeForSpeed,
        optimizeForSpeed = _ref$optimizeForSpeed === void 0 ? isProd : _ref$optimizeForSpeed,
        _ref$isBrowser = _ref.isBrowser,
        isBrowser = _ref$isBrowser === void 0 ? typeof window !== 'undefined' : _ref$isBrowser;

    invariant(isString(name), '`name` must be a string');
    this._name = name;
    this._deletedRulePlaceholder = "#" + name + "-deleted-rule____{}";
    invariant(typeof optimizeForSpeed === 'boolean', '`optimizeForSpeed` must be a boolean');
    this._optimizeForSpeed = optimizeForSpeed;
    this._isBrowser = isBrowser;
    this._serverSheet = undefined;
    this._tags = [];
    this._injected = false;
    this._rulesCount = 0;
    var node = this._isBrowser && document.querySelector('meta[property="csp-nonce"]');
    this._nonce = node ? node.getAttribute('content') : null;
  }

  var _proto = StyleSheet.prototype;

  _proto.setOptimizeForSpeed = function setOptimizeForSpeed(bool) {
    invariant(typeof bool === 'boolean', '`setOptimizeForSpeed` accepts a boolean');
    invariant(this._rulesCount === 0, 'optimizeForSpeed cannot be when rules have already been inserted');
    this.flush();
    this._optimizeForSpeed = bool;
    this.inject();
  };

  _proto.isOptimizeForSpeed = function isOptimizeForSpeed() {
    return this._optimizeForSpeed;
  };

  _proto.inject = function inject() {
    var _this = this;

    invariant(!this._injected, 'sheet already injected');
    this._injected = true;

    if (this._isBrowser && this._optimizeForSpeed) {
      this._tags[0] = this.makeStyleTag(this._name);
      this._optimizeForSpeed = 'insertRule' in this.getSheet();

      if (!this._optimizeForSpeed) {
        if (!isProd) {
          console.warn('StyleSheet: optimizeForSpeed mode not supported falling back to standard mode.');
        }

        this.flush();
        this._injected = true;
      }

      return;
    }

    this._serverSheet = {
      cssRules: [],
      insertRule: function insertRule(rule, index) {
        if (typeof index === 'number') {
          _this._serverSheet.cssRules[index] = {
            cssText: rule
          };
        } else {
          _this._serverSheet.cssRules.push({
            cssText: rule
          });
        }

        return index;
      },
      deleteRule: function deleteRule(index) {
        _this._serverSheet.cssRules[index] = null;
      }
    };
  };

  _proto.getSheetForTag = function getSheetForTag(tag) {
    if (tag.sheet) {
      return tag.sheet;
    } // this weirdness brought to you by firefox


    for (var i = 0; i < document.styleSheets.length; i++) {
      if (document.styleSheets[i].ownerNode === tag) {
        return document.styleSheets[i];
      }
    }
  };

  _proto.getSheet = function getSheet() {
    return this.getSheetForTag(this._tags[this._tags.length - 1]);
  };

  _proto.insertRule = function insertRule(rule, index) {
    invariant(isString(rule), '`insertRule` accepts only strings');

    if (!this._isBrowser) {
      if (typeof index !== 'number') {
        index = this._serverSheet.cssRules.length;
      }

      this._serverSheet.insertRule(rule, index);

      return this._rulesCount++;
    }

    if (this._optimizeForSpeed) {
      var sheet = this.getSheet();

      if (typeof index !== 'number') {
        index = sheet.cssRules.length;
      } // this weirdness for perf, and chrome's weird bug
      // https://stackoverflow.com/questions/20007992/chrome-suddenly-stopped-accepting-insertrule


      try {
        sheet.insertRule(rule, index);
      } catch (error) {
        if (!isProd) {
          console.warn("StyleSheet: illegal rule: \n\n" + rule + "\n\nSee https://stackoverflow.com/q/20007992 for more info");
        }

        return -1;
      }
    } else {
      var insertionPoint = this._tags[index];

      this._tags.push(this.makeStyleTag(this._name, rule, insertionPoint));
    }

    return this._rulesCount++;
  };

  _proto.replaceRule = function replaceRule(index, rule) {
    if (this._optimizeForSpeed || !this._isBrowser) {
      var sheet = this._isBrowser ? this.getSheet() : this._serverSheet;

      if (!rule.trim()) {
        rule = this._deletedRulePlaceholder;
      }

      if (!sheet.cssRules[index]) {
        // @TBD Should we throw an error?
        return index;
      }

      sheet.deleteRule(index);

      try {
        sheet.insertRule(rule, index);
      } catch (error) {
        if (!isProd) {
          console.warn("StyleSheet: illegal rule: \n\n" + rule + "\n\nSee https://stackoverflow.com/q/20007992 for more info");
        } // In order to preserve the indices we insert a deleteRulePlaceholder


        sheet.insertRule(this._deletedRulePlaceholder, index);
      }
    } else {
      var tag = this._tags[index];
      invariant(tag, "old rule at index `" + index + "` not found");
      tag.textContent = rule;
    }

    return index;
  };

  _proto.deleteRule = function deleteRule(index) {
    if (!this._isBrowser) {
      this._serverSheet.deleteRule(index);

      return;
    }

    if (this._optimizeForSpeed) {
      this.replaceRule(index, '');
    } else {
      var tag = this._tags[index];
      invariant(tag, "rule at index `" + index + "` not found");
      tag.parentNode.removeChild(tag);
      this._tags[index] = null;
    }
  };

  _proto.flush = function flush() {
    this._injected = false;
    this._rulesCount = 0;

    if (this._isBrowser) {
      this._tags.forEach(function (tag) {
        return tag && tag.parentNode.removeChild(tag);
      });

      this._tags = [];
    } else {
      // simpler on server
      this._serverSheet.cssRules = [];
    }
  };

  _proto.cssRules = function cssRules() {
    var _this2 = this;

    if (!this._isBrowser) {
      return this._serverSheet.cssRules;
    }

    return this._tags.reduce(function (rules, tag) {
      if (tag) {
        rules = rules.concat(Array.prototype.map.call(_this2.getSheetForTag(tag).cssRules, function (rule) {
          return rule.cssText === _this2._deletedRulePlaceholder ? null : rule;
        }));
      } else {
        rules.push(null);
      }

      return rules;
    }, []);
  };

  _proto.makeStyleTag = function makeStyleTag(name, cssString, relativeToTag) {
    if (cssString) {
      invariant(isString(cssString), 'makeStyleTag acceps only strings as second parameter');
    }

    var tag = document.createElement('style');
    if (this._nonce) tag.setAttribute('nonce', this._nonce);
    tag.type = 'text/css';
    tag.setAttribute("data-" + name, '');

    if (cssString) {
      tag.appendChild(document.createTextNode(cssString));
    }

    var head = document.head || document.getElementsByTagName('head')[0];

    if (relativeToTag) {
      head.insertBefore(tag, relativeToTag);
    } else {
      head.appendChild(tag);
    }

    return tag;
  };

  _createClass(StyleSheet, [{
    key: "length",
    get: function get() {
      return this._rulesCount;
    }
  }]);

  return StyleSheet;
}();

exports["default"] = StyleSheet;

function invariant(condition, message) {
  if (!condition) {
    throw new Error("StyleSheet: " + message + ".");
  }
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/styled-jsx/dist/style.js":
/*!***********************************************!*\
  !*** ./node_modules/styled-jsx/dist/style.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.flush = flush;
exports["default"] = void 0;

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _stylesheetRegistry = _interopRequireDefault(__webpack_require__(/*! ./stylesheet-registry */ "./node_modules/styled-jsx/dist/stylesheet-registry.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var styleSheetRegistry = new _stylesheetRegistry["default"]();

var JSXStyle =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(JSXStyle, _Component);

  function JSXStyle(props) {
    var _this;

    _this = _Component.call(this, props) || this;
    _this.prevProps = {};
    return _this;
  }

  JSXStyle.dynamic = function dynamic(info) {
    return info.map(function (tagInfo) {
      var baseId = tagInfo[0];
      var props = tagInfo[1];
      return styleSheetRegistry.computeId(baseId, props);
    }).join(' ');
  } // probably faster than PureComponent (shallowEqual)
  ;

  var _proto = JSXStyle.prototype;

  _proto.shouldComponentUpdate = function shouldComponentUpdate(otherProps) {
    return this.props.id !== otherProps.id || // We do this check because `dynamic` is an array of strings or undefined.
    // These are the computed values for dynamic styles.
    String(this.props.dynamic) !== String(otherProps.dynamic);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    styleSheetRegistry.remove(this.props);
  };

  _proto.render = function render() {
    // This is a workaround to make the side effect async safe in the "render" phase.
    // See https://github.com/zeit/styled-jsx/pull/484
    if (this.shouldComponentUpdate(this.prevProps)) {
      // Updates
      if (this.prevProps.id) {
        styleSheetRegistry.remove(this.prevProps);
      }

      styleSheetRegistry.add(this.props);
      this.prevProps = this.props;
    }

    return null;
  };

  return JSXStyle;
}(_react.Component);

exports["default"] = JSXStyle;

function flush() {
  var cssRules = styleSheetRegistry.cssRules();
  styleSheetRegistry.flush();
  return cssRules;
}

/***/ }),

/***/ "./node_modules/styled-jsx/dist/stylesheet-registry.js":
/*!*************************************************************!*\
  !*** ./node_modules/styled-jsx/dist/stylesheet-registry.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports["default"] = void 0;

var _stringHash = _interopRequireDefault(__webpack_require__(/*! string-hash */ "./node_modules/string-hash/index.js"));

var _stylesheet = _interopRequireDefault(__webpack_require__(/*! ./lib/stylesheet */ "./node_modules/styled-jsx/dist/lib/stylesheet.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var sanitize = function sanitize(rule) {
  return rule.replace(/\/style/gi, '\\/style');
};

var StyleSheetRegistry =
/*#__PURE__*/
function () {
  function StyleSheetRegistry(_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$styleSheet = _ref.styleSheet,
        styleSheet = _ref$styleSheet === void 0 ? null : _ref$styleSheet,
        _ref$optimizeForSpeed = _ref.optimizeForSpeed,
        optimizeForSpeed = _ref$optimizeForSpeed === void 0 ? false : _ref$optimizeForSpeed,
        _ref$isBrowser = _ref.isBrowser,
        isBrowser = _ref$isBrowser === void 0 ? typeof window !== 'undefined' : _ref$isBrowser;

    this._sheet = styleSheet || new _stylesheet["default"]({
      name: 'styled-jsx',
      optimizeForSpeed: optimizeForSpeed
    });

    this._sheet.inject();

    if (styleSheet && typeof optimizeForSpeed === 'boolean') {
      this._sheet.setOptimizeForSpeed(optimizeForSpeed);

      this._optimizeForSpeed = this._sheet.isOptimizeForSpeed();
    }

    this._isBrowser = isBrowser;
    this._fromServer = undefined;
    this._indices = {};
    this._instancesCounts = {};
    this.computeId = this.createComputeId();
    this.computeSelector = this.createComputeSelector();
  }

  var _proto = StyleSheetRegistry.prototype;

  _proto.add = function add(props) {
    var _this = this;

    if (undefined === this._optimizeForSpeed) {
      this._optimizeForSpeed = Array.isArray(props.children);

      this._sheet.setOptimizeForSpeed(this._optimizeForSpeed);

      this._optimizeForSpeed = this._sheet.isOptimizeForSpeed();
    }

    if (this._isBrowser && !this._fromServer) {
      this._fromServer = this.selectFromServer();
      this._instancesCounts = Object.keys(this._fromServer).reduce(function (acc, tagName) {
        acc[tagName] = 0;
        return acc;
      }, {});
    }

    var _this$getIdAndRules = this.getIdAndRules(props),
        styleId = _this$getIdAndRules.styleId,
        rules = _this$getIdAndRules.rules; // Deduping: just increase the instances count.


    if (styleId in this._instancesCounts) {
      this._instancesCounts[styleId] += 1;
      return;
    }

    var indices = rules.map(function (rule) {
      return _this._sheet.insertRule(rule);
    }) // Filter out invalid rules
    .filter(function (index) {
      return index !== -1;
    });
    this._indices[styleId] = indices;
    this._instancesCounts[styleId] = 1;
  };

  _proto.remove = function remove(props) {
    var _this2 = this;

    var _this$getIdAndRules2 = this.getIdAndRules(props),
        styleId = _this$getIdAndRules2.styleId;

    invariant(styleId in this._instancesCounts, "styleId: `" + styleId + "` not found");
    this._instancesCounts[styleId] -= 1;

    if (this._instancesCounts[styleId] < 1) {
      var tagFromServer = this._fromServer && this._fromServer[styleId];

      if (tagFromServer) {
        tagFromServer.parentNode.removeChild(tagFromServer);
        delete this._fromServer[styleId];
      } else {
        this._indices[styleId].forEach(function (index) {
          return _this2._sheet.deleteRule(index);
        });

        delete this._indices[styleId];
      }

      delete this._instancesCounts[styleId];
    }
  };

  _proto.update = function update(props, nextProps) {
    this.add(nextProps);
    this.remove(props);
  };

  _proto.flush = function flush() {
    this._sheet.flush();

    this._sheet.inject();

    this._fromServer = undefined;
    this._indices = {};
    this._instancesCounts = {};
    this.computeId = this.createComputeId();
    this.computeSelector = this.createComputeSelector();
  };

  _proto.cssRules = function cssRules() {
    var _this3 = this;

    var fromServer = this._fromServer ? Object.keys(this._fromServer).map(function (styleId) {
      return [styleId, _this3._fromServer[styleId]];
    }) : [];

    var cssRules = this._sheet.cssRules();

    return fromServer.concat(Object.keys(this._indices).map(function (styleId) {
      return [styleId, _this3._indices[styleId].map(function (index) {
        return cssRules[index].cssText;
      }).join(_this3._optimizeForSpeed ? '' : '\n')];
    }) // filter out empty rules
    .filter(function (rule) {
      return Boolean(rule[1]);
    }));
  }
  /**
   * createComputeId
   *
   * Creates a function to compute and memoize a jsx id from a basedId and optionally props.
   */
  ;

  _proto.createComputeId = function createComputeId() {
    var cache = {};
    return function (baseId, props) {
      if (!props) {
        return "jsx-" + baseId;
      }

      var propsToString = String(props);
      var key = baseId + propsToString; // return `jsx-${hashString(`${baseId}-${propsToString}`)}`

      if (!cache[key]) {
        cache[key] = "jsx-" + (0, _stringHash["default"])(baseId + "-" + propsToString);
      }

      return cache[key];
    };
  }
  /**
   * createComputeSelector
   *
   * Creates a function to compute and memoize dynamic selectors.
   */
  ;

  _proto.createComputeSelector = function createComputeSelector(selectoPlaceholderRegexp) {
    if (selectoPlaceholderRegexp === void 0) {
      selectoPlaceholderRegexp = /__jsx-style-dynamic-selector/g;
    }

    var cache = {};
    return function (id, css) {
      // Sanitize SSR-ed CSS.
      // Client side code doesn't need to be sanitized since we use
      // document.createTextNode (dev) and the CSSOM api sheet.insertRule (prod).
      if (!this._isBrowser) {
        css = sanitize(css);
      }

      var idcss = id + css;

      if (!cache[idcss]) {
        cache[idcss] = css.replace(selectoPlaceholderRegexp, id);
      }

      return cache[idcss];
    };
  };

  _proto.getIdAndRules = function getIdAndRules(props) {
    var _this4 = this;

    var css = props.children,
        dynamic = props.dynamic,
        id = props.id;

    if (dynamic) {
      var styleId = this.computeId(id, dynamic);
      return {
        styleId: styleId,
        rules: Array.isArray(css) ? css.map(function (rule) {
          return _this4.computeSelector(styleId, rule);
        }) : [this.computeSelector(styleId, css)]
      };
    }

    return {
      styleId: this.computeId(id),
      rules: Array.isArray(css) ? css : [css]
    };
  }
  /**
   * selectFromServer
   *
   * Collects style tags from the document with id __jsx-XXX
   */
  ;

  _proto.selectFromServer = function selectFromServer() {
    var elements = Array.prototype.slice.call(document.querySelectorAll('[id^="__jsx-"]'));
    return elements.reduce(function (acc, element) {
      var id = element.id.slice(2);
      acc[id] = element;
      return acc;
    }, {});
  };

  return StyleSheetRegistry;
}();

exports["default"] = StyleSheetRegistry;

function invariant(condition, message) {
  if (!condition) {
    throw new Error("StyleSheetRegistry: " + message + ".");
  }
}

/***/ }),

/***/ "./node_modules/styled-jsx/style.js":
/*!******************************************!*\
  !*** ./node_modules/styled-jsx/style.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./dist/style */ "./node_modules/styled-jsx/dist/style.js")


/***/ }),

/***/ "./node_modules/webpack/buildin/harmony-module.js":
/*!*******************************************!*\
  !*** (webpack)/buildin/harmony-module.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(originalModule) {
	if (!originalModule.webpackPolyfill) {
		var module = Object.create(originalModule);
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		Object.defineProperty(module, "exports", {
			enumerable: true
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./pages/Audio.js":
/*!************************!*\
  !*** ./pages/Audio.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var _babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _band_js_dist_band__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../band.js/dist/band */ "./band.js/dist/band.js");
/* harmony import */ var _band_js_dist_band__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_band_js_dist_band__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_8__);







var _jsxFileName = "C:\\Users\\hillel nagid\\Desktop\\rhythm\\pages\\Audio.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = Object(_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = Object(_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return Object(_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }




var Audio = /*#__PURE__*/function (_Component) {
  Object(_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_3__["default"])(Audio, _Component);

  var _super = _createSuper(Audio);

  function Audio(props) {
    var _this;

    Object(_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Audio);

    _this = _super.call(this, props);

    Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(Object(_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this), "playHandler", function () {
      if (_this.state.player) {
        console.log(_this.state.player);

        _this.state.player.stop();
      }

      var conductor = new _band_js_dist_band__WEBPACK_IMPORTED_MODULE_7___default.a();
      var sectionsProps = [];

      _this.props.analysis.sections.forEach(function (section) {
        sectionsProps.push([section.duration * 1000, section.tempo]);
      });

      console.log(sectionsProps);
      conductor.setTimeSignature(4, 4);
      conductor.setTempo(sectionsProps[0][1]);
      var piano = conductor.createInstrument('sine');
      piano.note('quarter', 'G3');

      _this.setState({
        player: conductor.finish()
      }, function () {
        console.log(_this.state.player);

        _this.state.player.loop(true);

        rhythmTimer(sectionsProps[0][0]);
      });

      var rhythmTimer = function rhythmTimer(time) {
        _this.state.player.play();

        sectionsProps.shift();
        setTimeout(function () {
          _this.state.player.stop();

          if (sectionsProps.length != 0) {
            conductor.setTempo(sectionsProps[0][1]);

            _this.setState({
              player: conductor.finish()
            });

            _this.state.player.loop(true);

            rhythmTimer(sectionsProps[0][0]);
          }
        }, time);
      };
    });

    _this.state = {
      player: null
    };
    return _this;
  }

  Object(_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(Audio, [{
    key: "render",
    value: function render() {
      return __jsx("p", {
        onClick: this.playHandler,
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 45,
          columnNumber: 10
        }
      }, "click Me");
    }
  }]);

  return Audio;
}(react__WEBPACK_IMPORTED_MODULE_8__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (Audio);

;
    var _a, _b;
    // Legacy CSS implementations will `eval` browser code in a Node.js context
    // to extract CSS. For backwards compatibility, we need to check we're in a
    // browser context before continuing.
    if (typeof self !== 'undefined' &&
        // AMP / No-JS mode does not inject these helpers:
        '$RefreshHelpers$' in self) {
        var currentExports_1 = module.__proto__.exports;
        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;
        // This cannot happen in MainTemplate because the exports mismatch between
        // templating and execution.
        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports_1, module.i);
        // A module can be accepted automatically based on its exports, e.g. when
        // it is a Refresh Boundary.
        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports_1)) {
            // Save the previous exports on update so we can compare the boundary
            // signatures.
            module.hot.dispose(function (data) {
                data.prevExports = currentExports_1;
            });
            // Unconditionally accept an update to this module, we'll check if it's
            // still a Refresh Boundary later.
            module.hot.accept();
            // This field is set when the previous version of this module was a
            // Refresh Boundary, letting us know we need to check for invalidation or
            // enqueue an update.
            if (prevExports !== null) {
                // A boundary can become ineligible if its exports are incompatible
                // with the previous exports.
                //
                // For example, if you add/remove/change exports, we'll want to
                // re-execute the importing modules, and force those components to
                // re-render. Similarly, if you convert a class component to a
                // function, we want to invalidate the boundary.
                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports_1)) {
                    module.hot.invalidate();
                }
                else {
                    self.$RefreshHelpers$.scheduleUpdate();
                }
            }
        }
        else {
            // Since we just executed the code for the module, it's possible that the
            // new exports made it ineligible for being a boundary.
            // We only care about the case when we were _previously_ a boundary,
            // because we already accepted this update (accidental side effect).
            var isNoLongerABoundary = prevExports !== null;
            if (isNoLongerABoundary) {
                module.hot.invalidate();
            }
        }
    }

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./pages/TracksResults.js":
/*!********************************!*\
  !*** ./pages/TracksResults.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var _babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Audio__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Audio */ "./pages/Audio.js");


var _this = undefined,
    _jsxFileName = "C:\\Users\\hillel nagid\\Desktop\\rhythm\\pages\\TracksResults.js",
    _s = $RefreshSig$();


var __jsx = react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement;



var TracksResults = function TracksResults(props) {
  _s();

  var trackRef = react__WEBPACK_IMPORTED_MODULE_1___default.a.createRef();
  var analysis;

  var _React$useState = react__WEBPACK_IMPORTED_MODULE_1___default.a.useState(analysis),
      _React$useState2 = Object(_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_React$useState, 2),
      sa = _React$useState2[0],
      sas = _React$useState2[1];

  var getAnalysis = function getAnalysis(e) {
    axios__WEBPACK_IMPORTED_MODULE_2___default.a.get('https://api.spotify.com/v1/audio-analysis/' + e.target.id, {
      headers: {
        Authorization: props.authorization
      }
    }).then(function (data) {
      sas(data.data);
      console.log(analysis);
    })["catch"](function (err) {
      console.log(err);
    });
  };

  return __jsx("ul", {
    ref: trackRef,
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25,
      columnNumber: 3
    }
  }, props.tracks.map(function (track) {
    return __jsx("li", {
      id: track.id,
      key: track.id,
      onClick: getAnalysis,
      __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 28,
        columnNumber: 6
      }
    }, track.name, " - ", track.artists[0].name, " (", track.popularity, ")");
  }), __jsx(_Audio__WEBPACK_IMPORTED_MODULE_3__["default"], {
    analysis: sa,
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 34,
      columnNumber: 4
    }
  }));
};

_s(TracksResults, "qZV8DantEtKXqbOuCbt3F8H1ypY=");

_c = TracksResults;
/* harmony default export */ __webpack_exports__["default"] = (TracksResults);

var _c;

$RefreshReg$(_c, "TracksResults");

;
    var _a, _b;
    // Legacy CSS implementations will `eval` browser code in a Node.js context
    // to extract CSS. For backwards compatibility, we need to check we're in a
    // browser context before continuing.
    if (typeof self !== 'undefined' &&
        // AMP / No-JS mode does not inject these helpers:
        '$RefreshHelpers$' in self) {
        var currentExports_1 = module.__proto__.exports;
        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;
        // This cannot happen in MainTemplate because the exports mismatch between
        // templating and execution.
        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports_1, module.i);
        // A module can be accepted automatically based on its exports, e.g. when
        // it is a Refresh Boundary.
        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports_1)) {
            // Save the previous exports on update so we can compare the boundary
            // signatures.
            module.hot.dispose(function (data) {
                data.prevExports = currentExports_1;
            });
            // Unconditionally accept an update to this module, we'll check if it's
            // still a Refresh Boundary later.
            module.hot.accept();
            // This field is set when the previous version of this module was a
            // Refresh Boundary, letting us know we need to check for invalidation or
            // enqueue an update.
            if (prevExports !== null) {
                // A boundary can become ineligible if its exports are incompatible
                // with the previous exports.
                //
                // For example, if you add/remove/change exports, we'll want to
                // re-execute the importing modules, and force those components to
                // re-render. Similarly, if you convert a class component to a
                // function, we want to invalidate the boundary.
                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports_1)) {
                    module.hot.invalidate();
                }
                else {
                    self.$RefreshHelpers$.scheduleUpdate();
                }
            }
        }
        else {
            // Since we just executed the code for the module, it's possible that the
            // new exports made it ineligible for being a boundary.
            // We only care about the case when we were _previously_ a boundary,
            // because we already accepted this update (accidental side effect).
            var isNoLongerABoundary = prevExports !== null;
            if (isNoLongerABoundary) {
                module.hot.invalidate();
            }
        }
    }

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./pages/index.js":
/*!************************!*\
  !*** ./pages/index.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var _babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! styled-jsx/style */ "./node_modules/styled-jsx/style.js");
/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(styled_jsx_style__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _rhythm__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./rhythm */ "./pages/rhythm.js");





var _jsxFileName = "C:\\Users\\hillel nagid\\Desktop\\rhythm\\pages\\index.js";

var __jsx = react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = Object(_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = Object(_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return Object(_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }




var Default = /*#__PURE__*/function (_Component) {
  Object(_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_2__["default"])(Default, _Component);

  var _super = _createSuper(Default);

  function Default() {
    Object(_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Default);

    return _super.apply(this, arguments);
  }

  Object(_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(Default, [{
    key: "render",
    value: function render() {
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
      }, "Select your song at the search bar below"), __jsx(_rhythm__WEBPACK_IMPORTED_MODULE_7__["default"], {
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 10,
          columnNumber: 5
        }
      }), __jsx(styled_jsx_style__WEBPACK_IMPORTED_MODULE_5___default.a, {
        id: "140836683",
        __self: this
      }, "body,html,#root{margin:0;height:100%;}*:active,*:focus{outline-style:none;}*{box-sizing:border-box;}#__next{display:grid;background:linear-gradient(to right,#141e30,#243b55);height:100%;width:100%;justify-items:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;max-height:100%;}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcaGlsbGVsIG5hZ2lkXFxEZXNrdG9wXFxyaHl0aG1cXHBhZ2VzXFxpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFZTSxBQUtpQixBQUtVLEFBR0csQUFHVCxTQVZELElBVzJDLE1BTnhELEVBSkEsQ0FPQSw0Q0FJYSxZQUNELFdBQ1UscUJBQ0YsNkZBQ0gsZ0JBQ2pCIiwiZmlsZSI6IkM6XFxVc2Vyc1xcaGlsbGVsIG5hZ2lkXFxEZXNrdG9wXFxyaHl0aG1cXHBhZ2VzXFxpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBSaHl0aG0gZnJvbSAnLi9yaHl0aG0nO1xyXG5cclxuY2xhc3MgRGVmYXVsdCBleHRlbmRzIENvbXBvbmVudCB7XHJcblx0cmVuZGVyKCkge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2FwcCc+XHJcblx0XHRcdFx0PGgxPlJoeXRobSBEZXRlY3RvcjwvaDE+XHJcblx0XHRcdFx0PGgyPlNlbGVjdCB5b3VyIHNvbmcgYXQgdGhlIHNlYXJjaCBiYXIgYmVsb3c8L2gyPlxyXG5cdFx0XHRcdDxSaHl0aG0+PC9SaHl0aG0+XHJcblx0XHRcdFx0ey8qXHQ8aW5wdXQgdHlwZT0ndGV4dCcgLz4qL31cclxuXHRcdFx0XHQ8c3R5bGUgZ2xvYmFsIGpzeD5cclxuXHRcdFx0XHRcdHtgXHJcblx0XHRcdFx0XHRcdGJvZHksXHJcblx0XHRcdFx0XHRcdGh0bWwsXHJcblx0XHRcdFx0XHRcdCNyb290IHtcclxuXHRcdFx0XHRcdFx0XHRtYXJnaW46IDA7XHJcblx0XHRcdFx0XHRcdFx0aGVpZ2h0OiAxMDAlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdCo6YWN0aXZlLFxyXG5cdFx0XHRcdFx0XHQqOmZvY3VzIHtcclxuXHRcdFx0XHRcdFx0XHRvdXRsaW5lLXN0eWxlOiBub25lO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdCoge1xyXG5cdFx0XHRcdFx0XHRcdGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0I19fbmV4dCB7XHJcblx0XHRcdFx0XHRcdFx0ZGlzcGxheTogZ3JpZDtcclxuXHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsICMxNDFlMzAsICMyNDNiNTUpO1xyXG5cdFx0XHRcdFx0XHRcdGhlaWdodDogMTAwJTtcclxuXHRcdFx0XHRcdFx0XHR3aWR0aDogMTAwJTtcclxuXHRcdFx0XHRcdFx0XHRqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XHJcblx0XHRcdFx0XHRcdFx0YWxpZ24taXRlbXM6IGNlbnRlcjtcclxuXHRcdFx0XHRcdFx0XHRtYXgtaGVpZ2h0OiAxMDAlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRgfVxyXG5cdFx0XHRcdDwvc3R5bGU+XHJcblx0XHRcdFx0PHN0eWxlIGpzeD57YFxyXG5cdFx0XHRcdFx0aDEge1xyXG5cdFx0XHRcdFx0XHRmb250LXNpemU6IDNyZW07XHJcblx0XHRcdFx0XHRcdGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byByaWdodCwgI2Y3OWQwMCwgIzY0ZjM4Yyk7XHJcblx0XHRcdFx0XHRcdGJhY2tncm91bmQtY2xpcDogdGV4dDtcclxuXHRcdFx0XHRcdFx0LXdlYmtpdC10ZXh0LWZpbGwtY29sb3I6IHRyYW5zcGFyZW50O1xyXG5cdFx0XHRcdFx0XHR0ZXh0LXNoYWRvdzogMHB4IDBweCA1MHB4ICMxZmZjNDQyYTtcclxuXHRcdFx0XHRcdFx0cG9zaXRpb246IHJlbGF0aXZlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdGB9PC9zdHlsZT5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGVmYXVsdDtcclxuIl19 */\n/*@ sourceURL=C:\\\\Users\\\\hillel nagid\\\\Desktop\\\\rhythm\\\\pages\\\\index.js */"), __jsx(styled_jsx_style__WEBPACK_IMPORTED_MODULE_5___default.a, {
        id: "1576542671",
        __self: this
      }, "h1.jsx-2218756941{font-size:3rem;background:linear-gradient(to right,#f79d00,#64f38c);background-clip:text;-webkit-text-fill-color:transparent;text-shadow:0px 0px 50px #1ffc442a;position:relative;}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcaGlsbGVsIG5hZ2lkXFxEZXNrdG9wXFxyaHl0aG1cXHBhZ2VzXFxpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFxQ2dCLEFBR3NCLGVBQ3dDLHFEQUNsQyxxQkFDZSxvQ0FDRCxtQ0FDakIsa0JBQ25CIiwiZmlsZSI6IkM6XFxVc2Vyc1xcaGlsbGVsIG5hZ2lkXFxEZXNrdG9wXFxyaHl0aG1cXHBhZ2VzXFxpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBSaHl0aG0gZnJvbSAnLi9yaHl0aG0nO1xyXG5cclxuY2xhc3MgRGVmYXVsdCBleHRlbmRzIENvbXBvbmVudCB7XHJcblx0cmVuZGVyKCkge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2FwcCc+XHJcblx0XHRcdFx0PGgxPlJoeXRobSBEZXRlY3RvcjwvaDE+XHJcblx0XHRcdFx0PGgyPlNlbGVjdCB5b3VyIHNvbmcgYXQgdGhlIHNlYXJjaCBiYXIgYmVsb3c8L2gyPlxyXG5cdFx0XHRcdDxSaHl0aG0+PC9SaHl0aG0+XHJcblx0XHRcdFx0ey8qXHQ8aW5wdXQgdHlwZT0ndGV4dCcgLz4qL31cclxuXHRcdFx0XHQ8c3R5bGUgZ2xvYmFsIGpzeD5cclxuXHRcdFx0XHRcdHtgXHJcblx0XHRcdFx0XHRcdGJvZHksXHJcblx0XHRcdFx0XHRcdGh0bWwsXHJcblx0XHRcdFx0XHRcdCNyb290IHtcclxuXHRcdFx0XHRcdFx0XHRtYXJnaW46IDA7XHJcblx0XHRcdFx0XHRcdFx0aGVpZ2h0OiAxMDAlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdCo6YWN0aXZlLFxyXG5cdFx0XHRcdFx0XHQqOmZvY3VzIHtcclxuXHRcdFx0XHRcdFx0XHRvdXRsaW5lLXN0eWxlOiBub25lO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdCoge1xyXG5cdFx0XHRcdFx0XHRcdGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0I19fbmV4dCB7XHJcblx0XHRcdFx0XHRcdFx0ZGlzcGxheTogZ3JpZDtcclxuXHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsICMxNDFlMzAsICMyNDNiNTUpO1xyXG5cdFx0XHRcdFx0XHRcdGhlaWdodDogMTAwJTtcclxuXHRcdFx0XHRcdFx0XHR3aWR0aDogMTAwJTtcclxuXHRcdFx0XHRcdFx0XHRqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XHJcblx0XHRcdFx0XHRcdFx0YWxpZ24taXRlbXM6IGNlbnRlcjtcclxuXHRcdFx0XHRcdFx0XHRtYXgtaGVpZ2h0OiAxMDAlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRgfVxyXG5cdFx0XHRcdDwvc3R5bGU+XHJcblx0XHRcdFx0PHN0eWxlIGpzeD57YFxyXG5cdFx0XHRcdFx0aDEge1xyXG5cdFx0XHRcdFx0XHRmb250LXNpemU6IDNyZW07XHJcblx0XHRcdFx0XHRcdGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byByaWdodCwgI2Y3OWQwMCwgIzY0ZjM4Yyk7XHJcblx0XHRcdFx0XHRcdGJhY2tncm91bmQtY2xpcDogdGV4dDtcclxuXHRcdFx0XHRcdFx0LXdlYmtpdC10ZXh0LWZpbGwtY29sb3I6IHRyYW5zcGFyZW50O1xyXG5cdFx0XHRcdFx0XHR0ZXh0LXNoYWRvdzogMHB4IDBweCA1MHB4ICMxZmZjNDQyYTtcclxuXHRcdFx0XHRcdFx0cG9zaXRpb246IHJlbGF0aXZlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdGB9PC9zdHlsZT5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGVmYXVsdDtcclxuIl19 */\n/*@ sourceURL=C:\\\\Users\\\\hillel nagid\\\\Desktop\\\\rhythm\\\\pages\\\\index.js */"));
    }
  }]);

  return Default;
}(react__WEBPACK_IMPORTED_MODULE_6__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (Default);

;
    var _a, _b;
    // Legacy CSS implementations will `eval` browser code in a Node.js context
    // to extract CSS. For backwards compatibility, we need to check we're in a
    // browser context before continuing.
    if (typeof self !== 'undefined' &&
        // AMP / No-JS mode does not inject these helpers:
        '$RefreshHelpers$' in self) {
        var currentExports_1 = module.__proto__.exports;
        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;
        // This cannot happen in MainTemplate because the exports mismatch between
        // templating and execution.
        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports_1, module.i);
        // A module can be accepted automatically based on its exports, e.g. when
        // it is a Refresh Boundary.
        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports_1)) {
            // Save the previous exports on update so we can compare the boundary
            // signatures.
            module.hot.dispose(function (data) {
                data.prevExports = currentExports_1;
            });
            // Unconditionally accept an update to this module, we'll check if it's
            // still a Refresh Boundary later.
            module.hot.accept();
            // This field is set when the previous version of this module was a
            // Refresh Boundary, letting us know we need to check for invalidation or
            // enqueue an update.
            if (prevExports !== null) {
                // A boundary can become ineligible if its exports are incompatible
                // with the previous exports.
                //
                // For example, if you add/remove/change exports, we'll want to
                // re-execute the importing modules, and force those components to
                // re-render. Similarly, if you convert a class component to a
                // function, we want to invalidate the boundary.
                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports_1)) {
                    module.hot.invalidate();
                }
                else {
                    self.$RefreshHelpers$.scheduleUpdate();
                }
            }
        }
        else {
            // Since we just executed the code for the module, it's possible that the
            // new exports made it ineligible for being a boundary.
            // We only care about the case when we were _previously_ a boundary,
            // because we already accepted this update (accidental side effect).
            var isNoLongerABoundary = prevExports !== null;
            if (isNoLongerABoundary) {
                module.hot.invalidate();
            }
        }
    }

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./pages/rhythm.js":
/*!*************************!*\
  !*** ./pages/rhythm.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var _babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _TracksResults__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./TracksResults */ "./pages/TracksResults.js");







var _jsxFileName = "C:\\Users\\hillel nagid\\Desktop\\rhythm\\pages\\rhythm.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = Object(_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = Object(_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return Object(_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }





var Rhythm = /*#__PURE__*/function (_Component) {
  Object(_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_3__["default"])(Rhythm, _Component);

  var _super = _createSuper(Rhythm);

  function Rhythm() {
    var _this;

    Object(_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Rhythm);

    _this = _super.call(this);

    Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(Object(_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this), "getTracks", function () {
      axios__WEBPACK_IMPORTED_MODULE_8___default.a.get("https://api.spotify.com/v1/search?q=".concat(_this.state.query, "&type=track&limit=5"), {
        headers: {
          Authorization: "".concat(_this.state.token_type, " ").concat(_this.state.token)
        }
      }).then(function (data) {
        _this.setState({
          track_list: data.data.tracks.items
        });
      })["catch"](function (err) {
        console.log(err);
      });
    });

    Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(Object(_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this), "changeHandler", function () {
      _this.setState({
        query: _this.search.value
      }, function () {
        if (_this.state.query && _this.state.query.length > 1) {
          _this.getTracks();
        } else {
          _this.setState({
            track_list: []
          });
        }
      });
    });

    _this.state = {
      token: null,
      track_list: [],
      query: ''
    };
    return _this;
  }

  Object(_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(Rhythm, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var hash = window.location.hash.substring(1).split('&').reduce(function (initial, item) {
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
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return __jsx(react__WEBPACK_IMPORTED_MODULE_7___default.a.Fragment, null, !this.state.token && __jsx("button", {
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
      }, "Login With Spotify")), this.state.token && __jsx(react__WEBPACK_IMPORTED_MODULE_7___default.a.Fragment, null, __jsx("input", {
        ref: function ref(input) {
          return _this2.search = input;
        },
        onChange: this.changeHandler,
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 69,
          columnNumber: 7
        }
      }), __jsx(_TracksResults__WEBPACK_IMPORTED_MODULE_9__["default"], {
        authorization: "".concat(this.state.token_type, " ").concat(this.state.token),
        tracks: this.state.track_list,
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 73,
          columnNumber: 7
        }
      })));
    }
  }]);

  return Rhythm;
}(react__WEBPACK_IMPORTED_MODULE_7__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (Rhythm);

;
    var _a, _b;
    // Legacy CSS implementations will `eval` browser code in a Node.js context
    // to extract CSS. For backwards compatibility, we need to check we're in a
    // browser context before continuing.
    if (typeof self !== 'undefined' &&
        // AMP / No-JS mode does not inject these helpers:
        '$RefreshHelpers$' in self) {
        var currentExports_1 = module.__proto__.exports;
        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;
        // This cannot happen in MainTemplate because the exports mismatch between
        // templating and execution.
        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports_1, module.i);
        // A module can be accepted automatically based on its exports, e.g. when
        // it is a Refresh Boundary.
        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports_1)) {
            // Save the previous exports on update so we can compare the boundary
            // signatures.
            module.hot.dispose(function (data) {
                data.prevExports = currentExports_1;
            });
            // Unconditionally accept an update to this module, we'll check if it's
            // still a Refresh Boundary later.
            module.hot.accept();
            // This field is set when the previous version of this module was a
            // Refresh Boundary, letting us know we need to check for invalidation or
            // enqueue an update.
            if (prevExports !== null) {
                // A boundary can become ineligible if its exports are incompatible
                // with the previous exports.
                //
                // For example, if you add/remove/change exports, we'll want to
                // re-execute the importing modules, and force those components to
                // re-render. Similarly, if you convert a class component to a
                // function, we want to invalidate the boundary.
                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports_1)) {
                    module.hot.invalidate();
                }
                else {
                    self.$RefreshHelpers$.scheduleUpdate();
                }
            }
        }
        else {
            // Since we just executed the code for the module, it's possible that the
            // new exports made it ineligible for being a boundary.
            // We only care about the case when we were _previously_ a boundary,
            // because we already accepted this update (accidental side effect).
            var isNoLongerABoundary = prevExports !== null;
            if (isNoLongerABoundary) {
                module.hot.invalidate();
            }
        }
    }

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ 1:
/*!************************************************************************************************************************************!*\
  !*** multi next-client-pages-loader?page=%2F&absolutePagePath=C%3A%5CUsers%5Chillel%20nagid%5CDesktop%5Crhythm%5Cpages%5Cindex.js ***!
  \************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! next-client-pages-loader?page=%2F&absolutePagePath=C%3A%5CUsers%5Chillel%20nagid%5CDesktop%5Crhythm%5Cpages%5Cindex.js! */"./node_modules/next/dist/build/webpack/loaders/next-client-pages-loader.js?page=%2F&absolutePagePath=C%3A%5CUsers%5Chillel%20nagid%5CDesktop%5Crhythm%5Cpages%5Cindex.js!./");


/***/ }),

/***/ "dll-reference dll_ec7d9c0249b2ef52b74c":
/*!*******************************************!*\
  !*** external "dll_ec7d9c0249b2ef52b74c" ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = dll_ec7d9c0249b2ef52b74c;

/***/ })

},[[1,"static/runtime/webpack.js"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9iYW5kLmpzL2Rpc3QvYmFuZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vYXJyYXlMaWtlVG9BcnJheS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vYXJyYXlXaXRoSG9sZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2Fzc2VydFRoaXNJbml0aWFsaXplZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vY2xhc3NDYWxsQ2hlY2suanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2NyZWF0ZUNsYXNzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9kZWZpbmVQcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vZ2V0UHJvdG90eXBlT2YuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2luaGVyaXRzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9pdGVyYWJsZVRvQXJyYXlMaW1pdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vbm9uSXRlcmFibGVSZXN0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9zZXRQcm90b3R5cGVPZi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vc2xpY2VkVG9BcnJheS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vdHlwZW9mLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9hZGFwdGVycy94aHIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9heGlvcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsVG9rZW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvaXNDYW5jZWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0F4aW9zLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9JbnRlcmNlcHRvck1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2J1aWxkRnVsbFBhdGguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2NyZWF0ZUVycm9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9kaXNwYXRjaFJlcXVlc3QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2VuaGFuY2VFcnJvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvbWVyZ2VDb25maWcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL3NldHRsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvdHJhbnNmb3JtRGF0YS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2RlZmF1bHRzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9idWlsZFVSTC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29tYmluZVVSTHMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2Nvb2tpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvcGFyc2VIZWFkZXJzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9zcHJlYWQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWNsaWVudC1wYWdlcy1sb2FkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL3JlYWN0L2luZGV4LmpzIGZyb20gZGxsLXJlZmVyZW5jZSBkbGxfZWM3ZDljMDI0OWIyZWY1MmI3NGMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0cmluZy1oYXNoL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHlsZWQtanN4L2Rpc3QvbGliL3N0eWxlc2hlZXQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0eWxlZC1qc3gvZGlzdC9zdHlsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3R5bGVkLWpzeC9kaXN0L3N0eWxlc2hlZXQtcmVnaXN0cnkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0eWxlZC1qc3gvc3R5bGUuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2hhcm1vbnktbW9kdWxlLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vLy4vcGFnZXMvQXVkaW8uanMiLCJ3ZWJwYWNrOi8vLy4vcGFnZXMvVHJhY2tzUmVzdWx0cy5qcyIsIndlYnBhY2s6Ly8vLi9wYWdlcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9wYWdlcy9yaHl0aG0uanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZGxsX2VjN2Q5YzAyNDliMmVmNTJiNzRjXCIiXSwibmFtZXMiOlsiZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJkZWZpbmUiLCJ0IiwibiIsInIiLCJzIiwibyIsInUiLCJhIiwicmVxdWlyZSIsImkiLCJFcnJvciIsImYiLCJjYWxsIiwibGVuZ3RoIiwiX2RlcmVxXyIsImRlZmluaXRpb24iLCJ3aW5kb3ciLCJBdWRpb0NvbnRleHQiLCJ3ZWJraXRBdWRpb0NvbnRleHQiLCJDb25kdWN0b3IiLCJwYWNrcyIsImluc3RydW1lbnQiLCJyaHl0aG0iLCJ0dW5pbmciLCJjb25kdWN0b3IiLCJwbGF5ZXIiLCJub29wIiwic2lnbmF0dXJlVG9Ob3RlTGVuZ3RoUmF0aW8iLCJwaXRjaGVzIiwibm90ZXMiLCJhdWRpb0NvbnRleHQiLCJtYXN0ZXJWb2x1bWVMZXZlbCIsIm1hc3RlclZvbHVtZSIsImNyZWF0ZUdhaW4iLCJjb25uZWN0IiwiZGVzdGluYXRpb24iLCJiZWF0c1BlckJhciIsIm5vdGVHZXRzQmVhdCIsInRlbXBvIiwiaW5zdHJ1bWVudHMiLCJ0b3RhbER1cmF0aW9uIiwiY3VycmVudFNlY29uZHMiLCJwZXJjZW50YWdlQ29tcGxldGUiLCJub3RlQnVmZmVyTGVuZ3RoIiwib25UaWNrZXJDYWxsYmFjayIsIm9uRmluaXNoZWRDYWxsYmFjayIsIm9uRHVyYXRpb25DaGFuZ2VDYWxsYmFjayIsImxvYWQiLCJqc29uIiwiZGVzdHJveSIsInRpbWVTaWduYXR1cmUiLCJzZXRUaW1lU2lnbmF0dXJlIiwic2V0VGVtcG8iLCJpbnN0cnVtZW50TGlzdCIsImhhc093blByb3BlcnR5IiwiY3JlYXRlSW5zdHJ1bWVudCIsIm5hbWUiLCJwYWNrIiwiaW5zdCIsImluZGV4Iiwibm90ZSIsIm5vdGVQYXJ0cyIsInNwbGl0IiwicmVzdCIsInR5cGUiLCJwaXRjaCIsInRpZSIsImZpbmlzaCIsIkluc3RydW1lbnQiLCJwdXNoIiwiUGxheWVyIiwic2V0TWFzdGVyVm9sdW1lIiwidm9sdW1lIiwiZ2FpbiIsInNldFZhbHVlQXRUaW1lIiwiY3VycmVudFRpbWUiLCJnZXRUb3RhbFNlY29uZHMiLCJNYXRoIiwicm91bmQiLCJzZXRUaWNrZXJDYWxsYmFjayIsImNiIiwidG9wIiwiYm90dG9tIiwicmVzZXRUZW1wbyIsInNldE9uRmluaXNoZWRDYWxsYmFjayIsInNldE9uRHVyYXRpb25DaGFuZ2VDYWxsYmFjayIsInNldE5vdGVCdWZmZXJMZW5ndGgiLCJsZW4iLCJsb2FkUGFjayIsImRhdGEiLCJpbmRleE9mIiwiTm9pc2VzSW5zdHJ1bWVudFBhY2siLCJ0eXBlcyIsImNyZWF0ZU5vdGUiLCJjcmVhdGVXaGl0ZU5vaXNlIiwiY3JlYXRlUGlua05vaXNlIiwiY3JlYXRlQnJvd25pYW5Ob2lzZSIsImJ1ZmZlclNpemUiLCJzYW1wbGVSYXRlIiwibm9pc2VCdWZmZXIiLCJjcmVhdGVCdWZmZXIiLCJvdXRwdXQiLCJnZXRDaGFubmVsRGF0YSIsInJhbmRvbSIsIndoaXRlTm9pc2UiLCJjcmVhdGVCdWZmZXJTb3VyY2UiLCJidWZmZXIiLCJsb29wIiwiYjAiLCJiMSIsImIyIiwiYjMiLCJiNCIsImI1IiwiYjYiLCJ3aGl0ZSIsInBpbmtOb2lzZSIsImxhc3RPdXQiLCJicm93bmlhbk5vaXNlIiwiT3NjaWxsYXRvckluc3RydW1lbnRQYWNrIiwiZnJlcXVlbmN5IiwiY3JlYXRlT3NjaWxsYXRvciIsInZhbHVlIiwiZ2V0RHVyYXRpb24iLCJjbG9uZSIsIm9iaiIsImNvcHkiLCJjb25zdHJ1Y3RvciIsImF0dHIiLCJsYXN0UmVwZWF0Q291bnQiLCJ2b2x1bWVMZXZlbCIsImFydGljdWxhdGlvbkdhcFBlcmNlbnRhZ2UiLCJidWZmZXJQb3NpdGlvbiIsInNldFZvbHVtZSIsIm5ld1ZvbHVtZUxldmVsIiwiZHVyYXRpb24iLCJhcnRpY3VsYXRpb25HYXAiLCJwIiwidHJpbSIsInBhcnNlRmxvYXQiLCJpc05hTiIsInN0YXJ0VGltZSIsInN0b3BUaW1lIiwicmVwZWF0U3RhcnQiLCJyZXBlYXRGcm9tQmVnaW5uaW5nIiwibnVtT2ZSZXBlYXRzIiwicmVwZWF0Iiwibm90ZXNCdWZmZXJDb3B5Iiwic2xpY2UiLCJub3RlQ29weSIsInJlc2V0RHVyYXRpb24iLCJudW1PZk5vdGVzIiwiYnVmZmVyVGltZW91dCIsImFsbE5vdGVzIiwiYnVmZmVyTm90ZXMiLCJjdXJyZW50UGxheVRpbWUiLCJ0b3RhbFBsYXlUaW1lIiwiZmFkZWQiLCJjYWxjdWxhdGVUb3RhbER1cmF0aW9uIiwicmVzZXQiLCJudW1PZkluc3RydW1lbnRzIiwiZGlzY29ubmVjdCIsImNsZWFyVGltZW91dCIsImZhZGUiLCJkaXJlY3Rpb24iLCJyZXNldFZvbHVtZSIsImZhZGVEdXJhdGlvbiIsImxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lIiwic2V0VGltZW91dCIsImJ1ZmZlckNvdW50IiwiaW5kZXgyIiwibm9kZSIsImluZGV4MyIsInRvdGFsUGxheVRpbWVDYWxjdWxhdG9yIiwicGF1c2VkIiwicGxheWluZyIsInN0b3AiLCJsb29waW5nIiwicGxheSIsInVwZGF0ZVRvdGFsUGxheVRpbWUiLCJzZWNvbmRzIiwibXV0ZWQiLCJ0aW1lT2Zmc2V0IiwicGxheU5vdGVzIiwic3RhcnQiLCJidWZmZXJVcCIsImJ1ZmZlckluTmV3Tm90ZXMiLCJuZXdOb3RlcyIsImNvbmNhdCIsImZhZGVPdXQiLCJwYXVzZSIsInZhbCIsInNldFRpbWUiLCJuZXdUaW1lIiwicGFyc2VJbnQiLCJtdXRlIiwidW5tdXRlIiwic2VtaWJyZXZlIiwiZG90dGVkTWluaW0iLCJtaW5pbSIsImRvdHRlZENyb3RjaGV0IiwidHJpcGxldE1pbmltIiwiY3JvdGNoZXQiLCJkb3R0ZWRRdWF2ZXIiLCJ0cmlwbGV0Q3JvdGNoZXQiLCJxdWF2ZXIiLCJkb3R0ZWRTZW1pcXVhdmVyIiwidHJpcGxldFF1YXZlciIsInNlbWlxdWF2ZXIiLCJ0cmlwbGV0U2VtaXF1YXZlciIsImRlbWlzZW1pcXVhdmVyIiwid2hvbGUiLCJkb3R0ZWRIYWxmIiwiaGFsZiIsImRvdHRlZFF1YXJ0ZXIiLCJ0cmlwbGV0SGFsZiIsInF1YXJ0ZXIiLCJkb3R0ZWRFaWdodGgiLCJ0cmlwbGV0UXVhcnRlciIsImVpZ2h0aCIsImRvdHRlZFNpeHRlZW50aCIsInRyaXBsZXRFaWdodGgiLCJzaXh0ZWVudGgiLCJ0cmlwbGV0U2l4dGVlbnRoIiwidGhpcnR5U2Vjb25kIiwiQXVkaW8iLCJwcm9wcyIsInN0YXRlIiwiY29uc29sZSIsImxvZyIsIkJhbmRKUyIsInNlY3Rpb25zUHJvcHMiLCJhbmFseXNpcyIsInNlY3Rpb25zIiwiZm9yRWFjaCIsInNlY3Rpb24iLCJwaWFubyIsInNldFN0YXRlIiwicmh5dGhtVGltZXIiLCJ0aW1lIiwic2hpZnQiLCJwbGF5SGFuZGxlciIsIkNvbXBvbmVudCIsIlRyYWNrc1Jlc3VsdHMiLCJ0cmFja1JlZiIsIlJlYWN0IiwiY3JlYXRlUmVmIiwidXNlU3RhdGUiLCJzYSIsInNhcyIsImdldEFuYWx5c2lzIiwiYXhpb3MiLCJnZXQiLCJ0YXJnZXQiLCJpZCIsImhlYWRlcnMiLCJBdXRob3JpemF0aW9uIiwiYXV0aG9yaXphdGlvbiIsInRoZW4iLCJlcnIiLCJ0cmFja3MiLCJtYXAiLCJ0cmFjayIsImFydGlzdHMiLCJwb3B1bGFyaXR5IiwiRGVmYXVsdCIsIlJoeXRobSIsInF1ZXJ5IiwidG9rZW5fdHlwZSIsInRva2VuIiwidHJhY2tfbGlzdCIsIml0ZW1zIiwic2VhcmNoIiwiZ2V0VHJhY2tzIiwiaGFzaCIsImxvY2F0aW9uIiwic3Vic3RyaW5nIiwicmVkdWNlIiwiaW5pdGlhbCIsIml0ZW0iLCJwYXJ0cyIsImRlY29kZVVSSUNvbXBvbmVudCIsImFjY2Vzc190b2tlbiIsImlucHV0IiwiY2hhbmdlSGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsdUVBQUMsVUFBU0EsQ0FBVCxFQUFXO0FBQUMsTUFBRyxJQUFILEVBQXdEQyxNQUFNLENBQUNDLE9BQVAsR0FBZUYsQ0FBQyxFQUFoQixDQUF4RCxLQUFnRixVQUF5TDtBQUFDLENBQXRSLENBQXVSLFlBQVU7QUFBQyxNQUFJRyxNQUFKLEVBQVdGLE1BQVgsRUFBa0JDLE9BQWxCO0FBQTBCLFNBQVEsU0FBU0YsQ0FBVCxDQUFXSSxDQUFYLEVBQWFDLENBQWIsRUFBZUMsQ0FBZixFQUFpQjtBQUFDLGFBQVNDLENBQVQsQ0FBV0MsQ0FBWCxFQUFhQyxDQUFiLEVBQWU7QUFBQyxVQUFHLENBQUNKLENBQUMsQ0FBQ0csQ0FBRCxDQUFMLEVBQVM7QUFBQyxZQUFHLENBQUNKLENBQUMsQ0FB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LElBQUksQ0FBQ1EsWUFBZDtBQUE0QmQsa0JBQVUsRUFBRU0sSUFBSSxDQUFDTjtBQUE3QyxPQUFkO0FBQ0E7Ozs2QkE4QlE7QUFBQTs7QUFDUixhQUNDLG1FQUNFLENBQUMsS0FBS3pDLEtBQUwsQ0FBVzBDLEtBQVosSUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBQ0M7QUFBRyxZQUFJLEVBQUMsOElBQVI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSw4QkFERCxDQUZGLEVBUUUsS0FBSzFDLEtBQUwsQ0FBVzBDLEtBQVgsSUFDQSxtRUFDQztBQUNDLFdBQUcsRUFBRSxhQUFBYyxLQUFLO0FBQUEsaUJBQUssTUFBSSxDQUFDWCxNQUFMLEdBQWNXLEtBQW5CO0FBQUEsU0FEWDtBQUVDLGdCQUFRLEVBQUUsS0FBS0MsYUFGaEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQURELEVBS0MsTUFBQyxzREFBRDtBQUNDLHFCQUFhLFlBQUssS0FBS3pELEtBQUwsQ0FBV3lDLFVBQWhCLGNBQThCLEtBQUt6QyxLQUFMLENBQVcwQyxLQUF6QyxDQURkO0FBRUMsY0FBTSxFQUFFLEtBQUsxQyxLQUFMLENBQVcyQyxVQUZwQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBTEQsQ0FURixDQUREO0FBdUJBOzs7O0VBNUVtQjVCLCtDOztBQStFTndCLHFFQUFmOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25GQSwwQyIsImZpbGUiOiJzdGF0aWNcXGRldmVsb3BtZW50XFxwYWdlc1xcaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIhZnVuY3Rpb24oZSl7aWYoXCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUpbW9kdWxlLmV4cG9ydHM9ZSgpO2Vsc2UgaWYoXCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kKWRlZmluZShbXSxlKTtlbHNle3ZhciBmO1widW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/Zj13aW5kb3c6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGdsb2JhbD9mPWdsb2JhbDpcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZiYmKGY9c2VsZiksZi5CYW5kSlM9ZSgpfX0oZnVuY3Rpb24oKXt2YXIgZGVmaW5lLG1vZHVsZSxleHBvcnRzO3JldHVybiAoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSh7MTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XHJcbi8qXHJcbiAqIFdlYiBBdWRpbyBBUEkgQXVkaW9Db250ZXh0IHNoaW1cclxuICovXHJcbihmdW5jdGlvbiAoZGVmaW5pdGlvbikge1xyXG4gICAgaWYgKHR5cGVvZiBleHBvcnRzID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKCk7XHJcbiAgICB9XHJcbn0pKGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0O1xyXG59KTtcclxuXHJcbn0se31dLDI6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xyXG4vKipcclxuICogQmFuZC5qcyAtIE11c2ljIENvbXBvc2VyXHJcbiAqIEFuIGludGVyZmFjZSBmb3IgdGhlIFdlYiBBdWRpbyBBUEkgdGhhdCBzdXBwb3J0cyByaHl0aG1zLCBtdWx0aXBsZSBpbnN0cnVtZW50cywgcmVwZWF0aW5nIHNlY3Rpb25zLCBhbmQgY29tcGxleFxyXG4gKiB0aW1lIHNpZ25hdHVyZXMuXHJcbiAqXHJcbiAqIEBhdXRob3IgQ29keSBMdW5kcXVpc3QgKGh0dHA6Ly9naXRodWIuY29tL21lZW5pZSkgLSAyMDE0XHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IENvbmR1Y3RvcjtcclxuXHJcbnZhciBwYWNrcyA9IHtcclxuICAgIGluc3RydW1lbnQ6IHt9LFxyXG4gICAgcmh5dGhtOiB7fSxcclxuICAgIHR1bmluZzoge31cclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb25kdWN0b3IgQ2xhc3MgLSBUaGlzIGdldHMgaW5zdGFudGlhdGVkIHdoZW4gYG5ldyBCYW5kSlMoKWAgaXMgY2FsbGVkXHJcbiAqXHJcbiAqIEBwYXJhbSB0dW5pbmdcclxuICogQHBhcmFtIHJoeXRobVxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIENvbmR1Y3Rvcih0dW5pbmcsIHJoeXRobSkge1xyXG4gICAgaWYgKCEgdHVuaW5nKSB7XHJcbiAgICAgICAgdHVuaW5nID0gJ2VxdWFsVGVtcGVyYW1lbnQnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghIHJoeXRobSkge1xyXG4gICAgICAgIHJoeXRobSA9ICdub3J0aEFtZXJpY2FuJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIHBhY2tzLnR1bmluZ1t0dW5pbmddID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcih0dW5pbmcgKyAnIGlzIG5vdCBhIHZhbGlkIHR1bmluZyBwYWNrLicpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgcGFja3Mucmh5dGhtW3JoeXRobV0gPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJoeXRobSArICcgaXMgbm90IGEgdmFsaWQgcmh5dGhtIHBhY2suJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGNvbmR1Y3RvciA9IHRoaXMsXHJcbiAgICAgICAgcGxheWVyLFxyXG4gICAgICAgIG5vb3AgPSBmdW5jdGlvbigpIHt9LFxyXG4gICAgICAgIEF1ZGlvQ29udGV4dCA9IF9kZXJlcV8oJ2F1ZGlvY29udGV4dCcpLFxyXG4gICAgICAgIHNpZ25hdHVyZVRvTm90ZUxlbmd0aFJhdGlvID0ge1xyXG4gICAgICAgICAgICAyOiA2LFxyXG4gICAgICAgICAgICA0OiAzLFxyXG4gICAgICAgICAgICA4OiA0LjUwXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICBjb25kdWN0b3IucGFja3MgPSBwYWNrcztcclxuICAgIGNvbmR1Y3Rvci5waXRjaGVzID0gcGFja3MudHVuaW5nW3R1bmluZ107XHJcbiAgICBjb25kdWN0b3Iubm90ZXMgPSBwYWNrcy5yaHl0aG1bcmh5dGhtXTtcclxuICAgIGNvbmR1Y3Rvci5hdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XHJcbiAgICBjb25kdWN0b3IubWFzdGVyVm9sdW1lTGV2ZWwgPSBudWxsO1xyXG4gICAgY29uZHVjdG9yLm1hc3RlclZvbHVtZSA9IGNvbmR1Y3Rvci5hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xyXG4gICAgY29uZHVjdG9yLm1hc3RlclZvbHVtZS5jb25uZWN0KGNvbmR1Y3Rvci5hdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xyXG4gICAgY29uZHVjdG9yLmJlYXRzUGVyQmFyID0gbnVsbDtcclxuICAgIGNvbmR1Y3Rvci5ub3RlR2V0c0JlYXQgPSBudWxsO1xyXG4gICAgY29uZHVjdG9yLnRlbXBvID0gbnVsbDtcclxuICAgIGNvbmR1Y3Rvci5pbnN0cnVtZW50cyA9IFtdO1xyXG4gICAgY29uZHVjdG9yLnRvdGFsRHVyYXRpb24gPSAwO1xyXG4gICAgY29uZHVjdG9yLmN1cnJlbnRTZWNvbmRzID0gMDtcclxuICAgIGNvbmR1Y3Rvci5wZXJjZW50YWdlQ29tcGxldGUgPSAwO1xyXG4gICAgY29uZHVjdG9yLm5vdGVCdWZmZXJMZW5ndGggPSAyMDtcclxuICAgIGNvbmR1Y3Rvci5vblRpY2tlckNhbGxiYWNrID0gbm9vcDtcclxuICAgIGNvbmR1Y3Rvci5vbkZpbmlzaGVkQ2FsbGJhY2sgPSBub29wO1xyXG4gICAgY29uZHVjdG9yLm9uRHVyYXRpb25DaGFuZ2VDYWxsYmFjayA9IG5vb3A7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVc2UgSlNPTiB0byBsb2FkIGluIGEgc29uZyB0byBiZSBwbGF5ZWRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ganNvblxyXG4gICAgICovXHJcbiAgICBjb25kdWN0b3IubG9hZCA9IGZ1bmN0aW9uKGpzb24pIHtcclxuICAgICAgICAvLyBDbGVhciBvdXQgYW55IHByZXZpb3VzIHNvbmdcclxuICAgICAgICBpZiAoY29uZHVjdG9yLmluc3RydW1lbnRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgY29uZHVjdG9yLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghIGpzb24pIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdKU09OIGlzIHJlcXVpcmVkIGZvciB0aGlzIG1ldGhvZCB0byB3b3JrLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBOZWVkIHRvIGhhdmUgYXQgbGVhc3QgaW5zdHJ1bWVudHMgYW5kIG5vdGVzXHJcbiAgICAgICAgaWYgKHR5cGVvZiBqc29uLmluc3RydW1lbnRzID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBtdXN0IGRlZmluZSBhdCBsZWFzdCBvbmUgaW5zdHJ1bWVudCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIGpzb24ubm90ZXMgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignWW91IG11c3QgZGVmaW5lIG5vdGVzIGZvciBlYWNoIGluc3RydW1lbnQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNoYWxsIHdlIHNldCBhIHRpbWUgc2lnbmF0dXJlP1xyXG4gICAgICAgIGlmICh0eXBlb2YganNvbi50aW1lU2lnbmF0dXJlICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBjb25kdWN0b3Iuc2V0VGltZVNpZ25hdHVyZShqc29uLnRpbWVTaWduYXR1cmVbMF0sIGpzb24udGltZVNpZ25hdHVyZVsxXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBNYXliZSBzb21lIHRlbXBvP1xyXG4gICAgICAgIGlmICh0eXBlb2YganNvbi50ZW1wbyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgY29uZHVjdG9yLnNldFRlbXBvKGpzb24udGVtcG8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gTGV0cyBjcmVhdGUgc29tZSBpbnN0cnVtZW50c1xyXG4gICAgICAgIHZhciBpbnN0cnVtZW50TGlzdCA9IHt9O1xyXG4gICAgICAgIGZvciAodmFyIGluc3RydW1lbnQgaW4ganNvbi5pbnN0cnVtZW50cykge1xyXG4gICAgICAgICAgICBpZiAoISBqc29uLmluc3RydW1lbnRzLmhhc093blByb3BlcnR5KGluc3RydW1lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaW5zdHJ1bWVudExpc3RbaW5zdHJ1bWVudF0gPSBjb25kdWN0b3IuY3JlYXRlSW5zdHJ1bWVudChcclxuICAgICAgICAgICAgICAgIGpzb24uaW5zdHJ1bWVudHNbaW5zdHJ1bWVudF0ubmFtZSxcclxuICAgICAgICAgICAgICAgIGpzb24uaW5zdHJ1bWVudHNbaW5zdHJ1bWVudF0ucGFja1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gTm93IGxldHMgYWRkIGluIGVhY2ggb2YgdGhlIG5vdGVzXHJcbiAgICAgICAgZm9yICh2YXIgaW5zdCBpbiBqc29uLm5vdGVzKSB7XHJcbiAgICAgICAgICAgIGlmICghIGpzb24ubm90ZXMuaGFzT3duUHJvcGVydHkoaW5zdCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IC0xO1xyXG4gICAgICAgICAgICB3aGlsZSAoKysgaW5kZXggPCBqc29uLm5vdGVzW2luc3RdLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5vdGUgPSBqc29uLm5vdGVzW2luc3RdW2luZGV4XTtcclxuICAgICAgICAgICAgICAgIC8vIFVzZSBzaG9ydGhhbmQgaWYgaXQncyBhIHN0cmluZ1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBub3RlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBub3RlUGFydHMgPSBub3RlLnNwbGl0KCd8Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCdyZXN0JyA9PT0gbm90ZVBhcnRzWzFdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3RydW1lbnRMaXN0W2luc3RdLnJlc3Qobm90ZVBhcnRzWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0cnVtZW50TGlzdFtpbnN0XS5ub3RlKG5vdGVQYXJ0c1swXSwgbm90ZVBhcnRzWzFdLCBub3RlUGFydHNbMl0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyBPdGhlcndpc2UgdXNlIGxvbmdoYW5kXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgncmVzdCcgPT09IG5vdGUudHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0cnVtZW50TGlzdFtpbnN0XS5yZXN0KG5vdGUucmh5dGhtKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCdub3RlJyA9PT0gbm90ZS50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3RydW1lbnRMaXN0W2luc3RdLm5vdGUobm90ZS5yaHl0aG0sIG5vdGUucGl0Y2gsIG5vdGUudGllKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIExvb2tzIGxpa2Ugd2UgYXJlIGRvbmUsIGxldHMgcHJlc3MgaXQuXHJcbiAgICAgICAgcmV0dXJuIGNvbmR1Y3Rvci5maW5pc2goKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBuZXcgaW5zdHJ1bWVudFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBbbmFtZV0gLSBkZWZhdWx0cyB0byBzaW5lXHJcbiAgICAgKiBAcGFyYW0gW3BhY2tdIC0gZGVmYXVsdHMgdG8gb3NjaWxsYXRvcnNcclxuICAgICAqL1xyXG4gICAgY29uZHVjdG9yLmNyZWF0ZUluc3RydW1lbnQgPSBmdW5jdGlvbihuYW1lLCBwYWNrKSB7XHJcbiAgICAgICAgdmFyIEluc3RydW1lbnQgPSBfZGVyZXFfKCcuL2luc3RydW1lbnQuanMnKSxcclxuICAgICAgICAgICAgaW5zdHJ1bWVudCA9IG5ldyBJbnN0cnVtZW50KG5hbWUsIHBhY2ssIGNvbmR1Y3Rvcik7XHJcbiAgICAgICAgY29uZHVjdG9yLmluc3RydW1lbnRzLnB1c2goaW5zdHJ1bWVudCk7XHJcblxyXG4gICAgICAgIHJldHVybiBpbnN0cnVtZW50O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE5lZWRzIHRvIGJlIGNhbGxlZCBhZnRlciBhbGwgdGhlIGluc3RydW1lbnRzIGhhdmUgYmVlbiBmaWxsZWQgd2l0aCBub3Rlcy5cclxuICAgICAqIEl0IHdpbGwgZmlndXJlIG91dCB0aGUgdG90YWwgZHVyYXRpb24gb2YgdGhlIHNvbmcgYmFzZWQgb24gdGhlIGxvbmdlc3RcclxuICAgICAqIGR1cmF0aW9uIG91dCBvZiBhbGwgdGhlIGluc3RydW1lbnRzLiAgSXQgd2lsbCB0aGVuIHBhc3MgYmFjayB0aGUgUGxheWVyIE9iamVjdFxyXG4gICAgICogd2hpY2ggaXMgdXNlZCB0byBjb250cm9sIHRoZSBtdXNpYyAocGxheSwgc3RvcCwgcGF1c2UsIGxvb3AsIHZvbHVtZSwgdGVtcG8pXHJcbiAgICAgKlxyXG4gICAgICogSXQgcmV0dXJucyB0aGUgUGxheWVyIG9iamVjdC5cclxuICAgICAqL1xyXG4gICAgY29uZHVjdG9yLmZpbmlzaCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBQbGF5ZXIgPSBfZGVyZXFfKCcuL3BsYXllci5qcycpO1xyXG4gICAgICAgIHBsYXllciA9IG5ldyBQbGF5ZXIoY29uZHVjdG9yKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHBsYXllcjtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmUgYWxsIGluc3RydW1lbnRzIGFuZCByZWNyZWF0ZSBBdWRpb0NvbnRleHRcclxuICAgICAqL1xyXG4gICAgY29uZHVjdG9yLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25kdWN0b3IuYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xyXG4gICAgICAgIGNvbmR1Y3Rvci5pbnN0cnVtZW50cy5sZW5ndGggPSAwO1xyXG4gICAgICAgIGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWUgPSBjb25kdWN0b3IuYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcclxuICAgICAgICBjb25kdWN0b3IubWFzdGVyVm9sdW1lLmNvbm5lY3QoY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IE1hc3RlciBWb2x1bWVcclxuICAgICAqL1xyXG4gICAgY29uZHVjdG9yLnNldE1hc3RlclZvbHVtZSA9IGZ1bmN0aW9uKHZvbHVtZSkge1xyXG4gICAgICAgIGlmICh2b2x1bWUgPiAxKSB7XHJcbiAgICAgICAgICAgIHZvbHVtZSA9IHZvbHVtZSAvIDEwMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uZHVjdG9yLm1hc3RlclZvbHVtZUxldmVsID0gdm9sdW1lO1xyXG4gICAgICAgIGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWUuZ2Fpbi5zZXRWYWx1ZUF0VGltZSh2b2x1bWUsIGNvbmR1Y3Rvci5hdWRpb0NvbnRleHQuY3VycmVudFRpbWUpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEdyYWIgdGhlIHRvdGFsIGR1cmF0aW9uIG9mIGEgc29uZ1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGNvbmR1Y3Rvci5nZXRUb3RhbFNlY29uZHMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChjb25kdWN0b3IudG90YWxEdXJhdGlvbik7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgdGlja2VyIGNhbGxiYWNrIGZ1bmN0aW9uLiBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkXHJcbiAgICAgKiBldmVyeSB0aW1lIHRoZSBjdXJyZW50IHNlY29uZHMgaGFzIGNoYW5nZWQuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNiIGZ1bmN0aW9uXHJcbiAgICAgKi9cclxuICAgIGNvbmR1Y3Rvci5zZXRUaWNrZXJDYWxsYmFjayA9IGZ1bmN0aW9uKGNiKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjYiAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RpY2tlciBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25kdWN0b3Iub25UaWNrZXJDYWxsYmFjayA9IGNiO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIHRpbWUgc2lnbmF0dXJlIGZvciB0aGUgbXVzaWMuIEp1c3QgbGlrZSBpbiBub3RhdGlvbiA0LzQgdGltZSB3b3VsZCBiZSBzZXRUaW1lU2lnbmF0dXJlKDQsIDQpO1xyXG4gICAgICogQHBhcmFtIHRvcCAtIE51bWJlciBvZiBiZWF0cyBwZXIgYmFyXHJcbiAgICAgKiBAcGFyYW0gYm90dG9tIC0gV2hhdCBub3RlIHR5cGUgaGFzIHRoZSBiZWF0XHJcbiAgICAgKi9cclxuICAgIGNvbmR1Y3Rvci5zZXRUaW1lU2lnbmF0dXJlID0gZnVuY3Rpb24odG9wLCBib3R0b20pIHtcclxuICAgICAgICBpZiAodHlwZW9mIHNpZ25hdHVyZVRvTm90ZUxlbmd0aFJhdGlvW2JvdHRvbV0gPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGJvdHRvbSB0aW1lIHNpZ25hdHVyZSBpcyBub3Qgc3VwcG9ydGVkLicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gTm90IHVzZWQgYXQgdGhlIG1vbWVudCwgYnV0IHdpbGwgYmUgaGFuZHkgaW4gdGhlIGZ1dHVyZS5cclxuICAgICAgICBjb25kdWN0b3IuYmVhdHNQZXJCYXIgPSB0b3A7XHJcbiAgICAgICAgY29uZHVjdG9yLm5vdGVHZXRzQmVhdCA9IHNpZ25hdHVyZVRvTm90ZUxlbmd0aFJhdGlvW2JvdHRvbV07XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgdGVtcG9cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdFxyXG4gICAgICovXHJcbiAgICBjb25kdWN0b3Iuc2V0VGVtcG8gPSBmdW5jdGlvbih0KSB7XHJcbiAgICAgICAgY29uZHVjdG9yLnRlbXBvID0gNjAgLyB0O1xyXG5cclxuICAgICAgICAvLyBJZiB3ZSBoYXZlIGEgcGxheWVyIGluc3RhbmNlLCB3ZSBuZWVkIHRvIHJlY2FsY3VsYXRlIGR1cmF0aW9uIGFmdGVyIHJlc2V0dGluZyB0aGUgdGVtcG8uXHJcbiAgICAgICAgaWYgKHBsYXllcikge1xyXG4gICAgICAgICAgICBwbGF5ZXIucmVzZXRUZW1wbygpO1xyXG4gICAgICAgICAgICBjb25kdWN0b3Iub25EdXJhdGlvbkNoYW5nZUNhbGxiYWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCBhIGNhbGxiYWNrIHRvIGZpcmUgd2hlbiB0aGUgc29uZyBpcyBmaW5pc2hlZFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjYlxyXG4gICAgICovXHJcbiAgICBjb25kdWN0b3Iuc2V0T25GaW5pc2hlZENhbGxiYWNrID0gZnVuY3Rpb24oY2IpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGNiICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignb25GaW5pc2hlZCBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25kdWN0b3Iub25GaW5pc2hlZENhbGxiYWNrID0gY2I7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IGEgY2FsbGJhY2sgdG8gZmlyZSB3aGVuIGR1cmF0aW9uIG9mIGEgc29uZyBjaGFuZ2VzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNiXHJcbiAgICAgKi9cclxuICAgIGNvbmR1Y3Rvci5zZXRPbkR1cmF0aW9uQ2hhbmdlQ2FsbGJhY2sgPSBmdW5jdGlvbihjYikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgY2IgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdvbkR1cmF0aW9uQ2hhbmdlZCBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25kdWN0b3Iub25EdXJhdGlvbkNoYW5nZUNhbGxiYWNrID0gY2I7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHRoZSBudW1iZXIgb2Ygbm90ZXMgdGhhdCBhcmUgYnVmZmVyZWQgZXZlcnkgKHRlbXBvIC8gNjAgKiA1KSBzZWNvbmRzLlxyXG4gICAgICogSXQncyBzZXQgdG8gMjAgbm90ZXMgYnkgZGVmYXVsdC5cclxuICAgICAqXHJcbiAgICAgKiAqKldBUk5JTkcqKiBUaGUgaGlnaGVyIHRoaXMgaXMsIHRoZSBtb3JlIG1lbW9yeSBpcyB1c2VkIGFuZCBjYW4gY3Jhc2ggeW91ciBicm93c2VyLlxyXG4gICAgICogICAgICAgICAgICAgSWYgbm90ZXMgYXJlIGJlaW5nIGRyb3BwZWQsIHlvdSBjYW4gaW5jcmVhc2UgdGhpcywgYnV0IGJlIHdlYXJ5IG9mXHJcbiAgICAgKiAgICAgICAgICAgICB1c2VkIG1lbW9yeS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0ludGVnZXJ9IGxlblxyXG4gICAgICovXHJcbiAgICBjb25kdWN0b3Iuc2V0Tm90ZUJ1ZmZlckxlbmd0aCA9IGZ1bmN0aW9uKGxlbikge1xyXG4gICAgICAgIGNvbmR1Y3Rvci5ub3RlQnVmZmVyTGVuZ3RoID0gbGVuO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25kdWN0b3Iuc2V0TWFzdGVyVm9sdW1lKDEwMCk7XHJcbiAgICBjb25kdWN0b3Iuc2V0VGVtcG8oMTIwKTtcclxuICAgIGNvbmR1Y3Rvci5zZXRUaW1lU2lnbmF0dXJlKDQsIDQpO1xyXG59XHJcblxyXG5Db25kdWN0b3IubG9hZFBhY2sgPSBmdW5jdGlvbih0eXBlLCBuYW1lLCBkYXRhKSB7XHJcbiAgICBpZiAoWyd0dW5pbmcnLCAncmh5dGhtJywgJ2luc3RydW1lbnQnXS5pbmRleE9mKHR5cGUpID09PSAtMSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcih0eXBlICsgJyBpcyBub3QgYSB2YWxpZCBQYWNrIFR5cGUuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBwYWNrc1t0eXBlXVtuYW1lXSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EobikgJyArIHR5cGUgKyAnIHBhY2sgd2l0aCB0aGUgbmFtZSBcIicgKyBuYW1lICsgJ1wiIGhhcyBhbHJlYWR5IGJlZW4gbG9hZGVkLicpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhY2tzW3R5cGVdW25hbWVdID0gZGF0YTtcclxufTtcclxuXHJcbn0se1wiLi9pbnN0cnVtZW50LmpzXCI6NSxcIi4vcGxheWVyLmpzXCI6NyxcImF1ZGlvY29udGV4dFwiOjF9XSwzOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcclxuLyoqXHJcbiAqIEJhbmQuanMgLSBNdXNpYyBDb21wb3NlclxyXG4gKiBBbiBpbnRlcmZhY2UgZm9yIHRoZSBXZWIgQXVkaW8gQVBJIHRoYXQgc3VwcG9ydHMgcmh5dGhtcywgbXVsdGlwbGUgaW5zdHJ1bWVudHMsIHJlcGVhdGluZyBzZWN0aW9ucywgYW5kIGNvbXBsZXhcclxuICogdGltZSBzaWduYXR1cmVzLlxyXG4gKlxyXG4gKiBAYXV0aG9yIENvZHkgTHVuZHF1aXN0IChodHRwOi8vZ2l0aHViLmNvbS9tZWVuaWUpIC0gMjAxNFxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBOb2lzZXNJbnN0cnVtZW50UGFjaztcclxuXHJcbi8qKlxyXG4gKiBOb2lzZXMgSW5zdHJ1bWVudCBQYWNrXHJcbiAqXHJcbiAqIEFkYXB0ZWQgZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL3phY2hhcnlkZW50b24vbm9pc2UuanNcclxuICpcclxuICogQHBhcmFtIG5hbWVcclxuICogQHBhcmFtIGF1ZGlvQ29udGV4dFxyXG4gKiBAcmV0dXJucyB7e2NyZWF0ZU5vdGU6IGNyZWF0ZU5vdGV9fVxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIE5vaXNlc0luc3RydW1lbnRQYWNrKG5hbWUsIGF1ZGlvQ29udGV4dCkge1xyXG4gICAgdmFyIHR5cGVzID0gW1xyXG4gICAgICAgICd3aGl0ZScsXHJcbiAgICAgICAgJ3BpbmsnLFxyXG4gICAgICAgICdicm93bicsXHJcbiAgICAgICAgJ2Jyb3duaWFuJyxcclxuICAgICAgICAncmVkJ1xyXG4gICAgXTtcclxuXHJcbiAgICBpZiAodHlwZXMuaW5kZXhPZihuYW1lKSA9PT0gLTEpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobmFtZSArICcgaXMgbm90IGEgdmFsaWQgbm9pc2Ugc291bmQnKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNyZWF0ZU5vdGU6IGZ1bmN0aW9uKGRlc3RpbmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnd2hpdGUnOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVXaGl0ZU5vaXNlKGRlc3RpbmF0aW9uKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3BpbmsnOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVQaW5rTm9pc2UoZGVzdGluYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnYnJvd24nOlxyXG4gICAgICAgICAgICAgICAgY2FzZSAnYnJvd25pYW4nOlxyXG4gICAgICAgICAgICAgICAgY2FzZSAncmVkJzpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlQnJvd25pYW5Ob2lzZShkZXN0aW5hdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZVdoaXRlTm9pc2UoZGVzdGluYXRpb24pIHtcclxuICAgICAgICB2YXIgYnVmZmVyU2l6ZSA9IDIgKiBhdWRpb0NvbnRleHQuc2FtcGxlUmF0ZSxcclxuICAgICAgICAgICAgbm9pc2VCdWZmZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyKDEsIGJ1ZmZlclNpemUsIGF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlKSxcclxuICAgICAgICAgICAgb3V0cHV0ID0gbm9pc2VCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBidWZmZXJTaXplOyBpKyspIHtcclxuICAgICAgICAgICAgb3V0cHV0W2ldID0gTWF0aC5yYW5kb20oKSAqIDIgLSAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHdoaXRlTm9pc2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XHJcbiAgICAgICAgd2hpdGVOb2lzZS5idWZmZXIgPSBub2lzZUJ1ZmZlcjtcclxuICAgICAgICB3aGl0ZU5vaXNlLmxvb3AgPSB0cnVlO1xyXG5cclxuICAgICAgICB3aGl0ZU5vaXNlLmNvbm5lY3QoZGVzdGluYXRpb24pO1xyXG5cclxuICAgICAgICByZXR1cm4gd2hpdGVOb2lzZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVQaW5rTm9pc2UoZGVzdGluYXRpb24pIHtcclxuICAgICAgICB2YXIgYnVmZmVyU2l6ZSA9IDIgKiBhdWRpb0NvbnRleHQuc2FtcGxlUmF0ZSxcclxuICAgICAgICAgICAgbm9pc2VCdWZmZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyKDEsIGJ1ZmZlclNpemUsIGF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlKSxcclxuICAgICAgICAgICAgb3V0cHV0ID0gbm9pc2VCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCksXHJcbiAgICAgICAgICAgIGIwLCBiMSwgYjIsIGIzLCBiNCwgYjUsIGI2O1xyXG5cclxuICAgICAgICBiMCA9IGIxID0gYjIgPSBiMyA9IGI0ID0gYjUgPSBiNiA9IDAuMDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJ1ZmZlclNpemU7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgd2hpdGUgPSBNYXRoLnJhbmRvbSgpICogMiAtIDE7XHJcbiAgICAgICAgICAgIGIwID0gMC45OTg4NiAqIGIwICsgd2hpdGUgKiAwLjA1NTUxNzk7XHJcbiAgICAgICAgICAgIGIxID0gMC45OTMzMiAqIGIxICsgd2hpdGUgKiAwLjA3NTA3NTk7XHJcbiAgICAgICAgICAgIGIyID0gMC45NjkwMCAqIGIyICsgd2hpdGUgKiAwLjE1Mzg1MjA7XHJcbiAgICAgICAgICAgIGIzID0gMC44NjY1MCAqIGIzICsgd2hpdGUgKiAwLjMxMDQ4NTY7XHJcbiAgICAgICAgICAgIGI0ID0gMC41NTAwMCAqIGI0ICsgd2hpdGUgKiAwLjUzMjk1MjI7XHJcbiAgICAgICAgICAgIGI1ID0gLTAuNzYxNiAqIGI1IC0gd2hpdGUgKiAwLjAxNjg5ODA7XHJcbiAgICAgICAgICAgIG91dHB1dFtpXSA9IGIwICsgYjEgKyBiMiArIGIzICsgYjQgKyBiNSArIGI2ICsgd2hpdGUgKiAwLjUzNjI7XHJcbiAgICAgICAgICAgIG91dHB1dFtpXSAqPSAwLjExO1xyXG4gICAgICAgICAgICBiNiA9IHdoaXRlICogMC4xMTU5MjY7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcGlua05vaXNlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xyXG4gICAgICAgIHBpbmtOb2lzZS5idWZmZXIgPSBub2lzZUJ1ZmZlcjtcclxuICAgICAgICBwaW5rTm9pc2UubG9vcCA9IHRydWU7XHJcblxyXG4gICAgICAgIHBpbmtOb2lzZS5jb25uZWN0KGRlc3RpbmF0aW9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHBpbmtOb2lzZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVCcm93bmlhbk5vaXNlKGRlc3RpbmF0aW9uKSB7XHJcbiAgICAgICAgdmFyIGJ1ZmZlclNpemUgPSAyICogYXVkaW9Db250ZXh0LnNhbXBsZVJhdGUsXHJcbiAgICAgICAgICAgIG5vaXNlQnVmZmVyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcigxLCBidWZmZXJTaXplLCBhdWRpb0NvbnRleHQuc2FtcGxlUmF0ZSksXHJcbiAgICAgICAgICAgIG91dHB1dCA9IG5vaXNlQnVmZmVyLmdldENoYW5uZWxEYXRhKDApLFxyXG4gICAgICAgICAgICBsYXN0T3V0ID0gMC4wO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnVmZmVyU2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciB3aGl0ZSA9IE1hdGgucmFuZG9tKCkgKiAyIC0gMTtcclxuICAgICAgICAgICAgb3V0cHV0W2ldID0gKGxhc3RPdXQgKyAoMC4wMiAqIHdoaXRlKSkgLyAxLjAyO1xyXG4gICAgICAgICAgICBsYXN0T3V0ID0gb3V0cHV0W2ldO1xyXG4gICAgICAgICAgICBvdXRwdXRbaV0gKj0gMy41O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGJyb3duaWFuTm9pc2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XHJcbiAgICAgICAgYnJvd25pYW5Ob2lzZS5idWZmZXIgPSBub2lzZUJ1ZmZlcjtcclxuICAgICAgICBicm93bmlhbk5vaXNlLmxvb3AgPSB0cnVlO1xyXG5cclxuICAgICAgICBicm93bmlhbk5vaXNlLmNvbm5lY3QoZGVzdGluYXRpb24pO1xyXG5cclxuICAgICAgICByZXR1cm4gYnJvd25pYW5Ob2lzZTtcclxuICAgIH1cclxufVxyXG5cclxufSx7fV0sNDpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XHJcbi8qKlxyXG4gKiBCYW5kLmpzIC0gTXVzaWMgQ29tcG9zZXJcclxuICogQW4gaW50ZXJmYWNlIGZvciB0aGUgV2ViIEF1ZGlvIEFQSSB0aGF0IHN1cHBvcnRzIHJoeXRobXMsIG11bHRpcGxlIGluc3RydW1lbnRzLCByZXBlYXRpbmcgc2VjdGlvbnMsIGFuZCBjb21wbGV4XHJcbiAqIHRpbWUgc2lnbmF0dXJlcy5cclxuICpcclxuICogQGF1dGhvciBDb2R5IEx1bmRxdWlzdCAoaHR0cDovL2dpdGh1Yi5jb20vbWVlbmllKSAtIDIwMTRcclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gT3NjaWxsYXRvckluc3RydW1lbnRQYWNrO1xyXG5cclxuLyoqXHJcbiAqIE9zY2lsbGF0b3IgSW5zdHJ1bWVudCBQYWNrXHJcbiAqXHJcbiAqIEBwYXJhbSBuYW1lXHJcbiAqIEBwYXJhbSBhdWRpb0NvbnRleHRcclxuICogQHJldHVybnMge3tjcmVhdGVOb3RlOiBjcmVhdGVOb3RlfX1cclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBPc2NpbGxhdG9ySW5zdHJ1bWVudFBhY2sobmFtZSwgYXVkaW9Db250ZXh0KSB7XHJcbiAgICB2YXIgdHlwZXMgPSBbJ3NpbmUnLCAnc3F1YXJlJywgJ3Nhd3Rvb3RoJywgJ3RyaWFuZ2xlJ107XHJcblxyXG4gICAgaWYgKHR5cGVzLmluZGV4T2YobmFtZSkgPT09IC0xKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG5hbWUgKyAnIGlzIG5vdCBhIHZhbGlkIE9zY2lsbGF0b3IgdHlwZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY3JlYXRlTm90ZTogZnVuY3Rpb24oZGVzdGluYXRpb24sIGZyZXF1ZW5jeSkge1xyXG4gICAgICAgICAgICB2YXIgbyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBDb25uZWN0IG5vdGUgdG8gdm9sdW1lXHJcbiAgICAgICAgICAgIG8uY29ubmVjdChkZXN0aW5hdGlvbik7XHJcbiAgICAgICAgICAgIC8vIFNldCBwaXRjaCB0eXBlXHJcbiAgICAgICAgICAgIG8udHlwZSA9IG5hbWU7XHJcbiAgICAgICAgICAgIC8vIFNldCBmcmVxdWVuY3lcclxuICAgICAgICAgICAgby5mcmVxdWVuY3kudmFsdWUgPSBmcmVxdWVuY3k7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbztcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG59LHt9XSw1OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcclxuLyoqXHJcbiAqIEJhbmQuanMgLSBNdXNpYyBDb21wb3NlclxyXG4gKiBBbiBpbnRlcmZhY2UgZm9yIHRoZSBXZWIgQXVkaW8gQVBJIHRoYXQgc3VwcG9ydHMgcmh5dGhtcywgbXVsdGlwbGUgaW5zdHJ1bWVudHMsIHJlcGVhdGluZyBzZWN0aW9ucywgYW5kIGNvbXBsZXhcclxuICogdGltZSBzaWduYXR1cmVzLlxyXG4gKlxyXG4gKiBAYXV0aG9yIENvZHkgTHVuZHF1aXN0IChodHRwOi8vZ2l0aHViLmNvbS9tZWVuaWUpIC0gMjAxNFxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBJbnN0cnVtZW50O1xyXG5cclxuLyoqXHJcbiAqIEluc3RydW1lbnQgQ2xhc3MgLSBHZXRzIGluc3RhbnRpYXRlZCB3aGVuIGBDb25kdWN0b3IuY3JlYXRlSW5zdHJ1bWVudCgpYCBpcyBjYWxsZWQuXHJcbiAqXHJcbiAqIEBwYXJhbSBuYW1lXHJcbiAqIEBwYXJhbSBwYWNrXHJcbiAqIEBwYXJhbSBjb25kdWN0b3JcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBJbnN0cnVtZW50KG5hbWUsIHBhY2ssIGNvbmR1Y3Rvcikge1xyXG4gICAgLy8gRGVmYXVsdCB0byBTaW5lIE9zY2lsbGF0b3JcclxuICAgIGlmICghIG5hbWUpIHtcclxuICAgICAgICBuYW1lID0gJ3NpbmUnO1xyXG4gICAgfVxyXG4gICAgaWYgKCEgcGFjaykge1xyXG4gICAgICAgIHBhY2sgPSAnb3NjaWxsYXRvcnMnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgY29uZHVjdG9yLnBhY2tzLmluc3RydW1lbnRbcGFja10gPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHBhY2sgKyAnIGlzIG5vdCBhIGN1cnJlbnRseSBsb2FkZWQgSW5zdHJ1bWVudCBQYWNrLicpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSGVscGVyIGZ1bmN0aW9uIHRvIGZpZ3VyZSBvdXQgaG93IGxvbmcgYSBub3RlIGlzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHJoeXRobVxyXG4gICAgICogQHJldHVybnMge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0RHVyYXRpb24ocmh5dGhtKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjb25kdWN0b3Iubm90ZXNbcmh5dGhtXSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJoeXRobSArICcgaXMgbm90IGEgY29ycmVjdCByaHl0aG0uJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY29uZHVjdG9yLm5vdGVzW3JoeXRobV0gKiBjb25kdWN0b3IudGVtcG8gLyBjb25kdWN0b3Iubm90ZUdldHNCZWF0ICogMTA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIZWxwZXIgZnVuY3Rpb24gdG8gY2xvbmUgYW4gb2JqZWN0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIG9ialxyXG4gICAgICogQHJldHVybnMge2NvcHl9XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNsb25lKG9iaikge1xyXG4gICAgICAgIGlmIChudWxsID09PSBvYmogfHwgXCJvYmplY3RcIiAhPSB0eXBlb2Ygb2JqKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjb3B5ID0gb2JqLmNvbnN0cnVjdG9yKCk7XHJcbiAgICAgICAgZm9yICh2YXIgYXR0ciBpbiBvYmopIHtcclxuICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShhdHRyKSkge1xyXG4gICAgICAgICAgICAgICAgY29weVthdHRyXSA9IG9ialthdHRyXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNvcHk7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICB2YXIgaW5zdHJ1bWVudCA9IHRoaXMsXHJcbiAgICAgICAgbGFzdFJlcGVhdENvdW50ID0gMCxcclxuICAgICAgICB2b2x1bWVMZXZlbCA9IDEsXHJcbiAgICAgICAgYXJ0aWN1bGF0aW9uR2FwUGVyY2VudGFnZSA9IDAuMDU7XHJcblxyXG4gICAgaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uID0gMDtcclxuICAgIGluc3RydW1lbnQuYnVmZmVyUG9zaXRpb24gPSAwO1xyXG4gICAgaW5zdHJ1bWVudC5pbnN0cnVtZW50ID0gY29uZHVjdG9yLnBhY2tzLmluc3RydW1lbnRbcGFja10obmFtZSwgY29uZHVjdG9yLmF1ZGlvQ29udGV4dCk7XHJcbiAgICBpbnN0cnVtZW50Lm5vdGVzID0gW107XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogU2V0IHZvbHVtZSBsZXZlbCBmb3IgYW4gaW5zdHJ1bWVudFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBuZXdWb2x1bWVMZXZlbFxyXG4gICAgICovXHJcbiAgICBpbnN0cnVtZW50LnNldFZvbHVtZSA9IGZ1bmN0aW9uKG5ld1ZvbHVtZUxldmVsKSB7XHJcbiAgICAgICAgaWYgKG5ld1ZvbHVtZUxldmVsID4gMSkge1xyXG4gICAgICAgICAgICBuZXdWb2x1bWVMZXZlbCA9IG5ld1ZvbHVtZUxldmVsIC8gMTAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2b2x1bWVMZXZlbCA9IG5ld1ZvbHVtZUxldmVsO1xyXG5cclxuICAgICAgICByZXR1cm4gaW5zdHJ1bWVudDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSBub3RlIHRvIGFuIGluc3RydW1lbnRcclxuICAgICAqIEBwYXJhbSByaHl0aG1cclxuICAgICAqIEBwYXJhbSBbcGl0Y2hdIC0gQ29tbWEgc2VwYXJhdGVkIHN0cmluZyBpZiBtb3JlIHRoYW4gb25lIHBpdGNoXHJcbiAgICAgKiBAcGFyYW0gW3RpZV1cclxuICAgICAqL1xyXG4gICAgaW5zdHJ1bWVudC5ub3RlID0gZnVuY3Rpb24ocmh5dGhtLCBwaXRjaCwgdGllKSB7XHJcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gZ2V0RHVyYXRpb24ocmh5dGhtKSxcclxuICAgICAgICAgICAgYXJ0aWN1bGF0aW9uR2FwID0gdGllID8gMCA6IGR1cmF0aW9uICogYXJ0aWN1bGF0aW9uR2FwUGVyY2VudGFnZTtcclxuXHJcbiAgICAgICAgaWYgKHBpdGNoKSB7XHJcbiAgICAgICAgICAgIHBpdGNoID0gcGl0Y2guc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgIHdoaWxlICgrKyBpbmRleCA8IHBpdGNoLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHAgPSBwaXRjaFtpbmRleF07XHJcbiAgICAgICAgICAgICAgICBwID0gcC50cmltKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbmR1Y3Rvci5waXRjaGVzW3BdID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHAgPSBwYXJzZUZsb2F0KHApO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc05hTihwKSB8fCBwIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocCArICcgaXMgbm90IGEgdmFsaWQgcGl0Y2guJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnN0cnVtZW50Lm5vdGVzLnB1c2goe1xyXG4gICAgICAgICAgICByaHl0aG06IHJoeXRobSxcclxuICAgICAgICAgICAgcGl0Y2g6IHBpdGNoLFxyXG4gICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXHJcbiAgICAgICAgICAgIGFydGljdWxhdGlvbkdhcDogYXJ0aWN1bGF0aW9uR2FwLFxyXG4gICAgICAgICAgICB0aWU6IHRpZSxcclxuICAgICAgICAgICAgc3RhcnRUaW1lOiBpbnN0cnVtZW50LnRvdGFsRHVyYXRpb24sXHJcbiAgICAgICAgICAgIHN0b3BUaW1lOiBpbnN0cnVtZW50LnRvdGFsRHVyYXRpb24gKyBkdXJhdGlvbiAtIGFydGljdWxhdGlvbkdhcCxcclxuICAgICAgICAgICAgLy8gVm9sdW1lIG5lZWRzIHRvIGJlIGEgcXVhcnRlciBvZiB0aGUgbWFzdGVyIHNvIGl0IGRvZXNuJ3QgY2xpcFxyXG4gICAgICAgICAgICB2b2x1bWVMZXZlbDogdm9sdW1lTGV2ZWwgLyA0XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGluc3RydW1lbnQudG90YWxEdXJhdGlvbiArPSBkdXJhdGlvbjtcclxuXHJcbiAgICAgICAgcmV0dXJuIGluc3RydW1lbnQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgcmVzdCB0byBhbiBpbnN0cnVtZW50XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHJoeXRobVxyXG4gICAgICovXHJcbiAgICBpbnN0cnVtZW50LnJlc3QgPSBmdW5jdGlvbihyaHl0aG0pIHtcclxuICAgICAgICB2YXIgZHVyYXRpb24gPSBnZXREdXJhdGlvbihyaHl0aG0pO1xyXG5cclxuICAgICAgICBpbnN0cnVtZW50Lm5vdGVzLnB1c2goe1xyXG4gICAgICAgICAgICByaHl0aG06IHJoeXRobSxcclxuICAgICAgICAgICAgcGl0Y2g6IGZhbHNlLFxyXG4gICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXHJcbiAgICAgICAgICAgIGFydGljdWxhdGlvbkdhcDogMCxcclxuICAgICAgICAgICAgc3RhcnRUaW1lOiBpbnN0cnVtZW50LnRvdGFsRHVyYXRpb24sXHJcbiAgICAgICAgICAgIHN0b3BUaW1lOiBpbnN0cnVtZW50LnRvdGFsRHVyYXRpb24gKyBkdXJhdGlvblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpbnN0cnVtZW50LnRvdGFsRHVyYXRpb24gKz0gZHVyYXRpb247XHJcblxyXG4gICAgICAgIHJldHVybiBpbnN0cnVtZW50O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFBsYWNlIHdoZXJlIGEgcmVwZWF0IHNlY3Rpb24gc2hvdWxkIHN0YXJ0XHJcbiAgICAgKi9cclxuICAgIGluc3RydW1lbnQucmVwZWF0U3RhcnQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBsYXN0UmVwZWF0Q291bnQgPSBpbnN0cnVtZW50Lm5vdGVzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGluc3RydW1lbnQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVwZWF0IGZyb20gYmVnaW5uaW5nXHJcbiAgICAgKi9cclxuICAgIGluc3RydW1lbnQucmVwZWF0RnJvbUJlZ2lubmluZyA9IGZ1bmN0aW9uKG51bU9mUmVwZWF0cykge1xyXG4gICAgICAgIGxhc3RSZXBlYXRDb3VudCA9IDA7XHJcbiAgICAgICAgaW5zdHJ1bWVudC5yZXBlYXQobnVtT2ZSZXBlYXRzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGluc3RydW1lbnQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTnVtYmVyIG9mIHRpbWVzIHRoZSBzZWN0aW9uIHNob3VsZCByZXBlYXRcclxuICAgICAqIEBwYXJhbSBbbnVtT2ZSZXBlYXRzXSAtIGRlZmF1bHRzIHRvIDFcclxuICAgICAqL1xyXG4gICAgaW5zdHJ1bWVudC5yZXBlYXQgPSBmdW5jdGlvbihudW1PZlJlcGVhdHMpIHtcclxuICAgICAgICBudW1PZlJlcGVhdHMgPSB0eXBlb2YgbnVtT2ZSZXBlYXRzID09PSAndW5kZWZpbmVkJyA/IDEgOiBudW1PZlJlcGVhdHM7XHJcbiAgICAgICAgdmFyIG5vdGVzQnVmZmVyQ29weSA9IGluc3RydW1lbnQubm90ZXMuc2xpY2UobGFzdFJlcGVhdENvdW50KTtcclxuICAgICAgICBmb3IgKHZhciByID0gMDsgciA8IG51bU9mUmVwZWF0czsgciArKykge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSAtMTtcclxuICAgICAgICAgICAgd2hpbGUgKCsraW5kZXggPCBub3Rlc0J1ZmZlckNvcHkubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbm90ZUNvcHkgPSBjbG9uZShub3Rlc0J1ZmZlckNvcHlbaW5kZXhdKTtcclxuXHJcbiAgICAgICAgICAgICAgICBub3RlQ29weS5zdGFydFRpbWUgPSBpbnN0cnVtZW50LnRvdGFsRHVyYXRpb247XHJcbiAgICAgICAgICAgICAgICBub3RlQ29weS5zdG9wVGltZSA9IGluc3RydW1lbnQudG90YWxEdXJhdGlvbiArIG5vdGVDb3B5LmR1cmF0aW9uIC0gbm90ZUNvcHkuYXJ0aWN1bGF0aW9uR2FwO1xyXG5cclxuICAgICAgICAgICAgICAgIGluc3RydW1lbnQubm90ZXMucHVzaChub3RlQ29weSk7XHJcbiAgICAgICAgICAgICAgICBpbnN0cnVtZW50LnRvdGFsRHVyYXRpb24gKz0gbm90ZUNvcHkuZHVyYXRpb247XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpbnN0cnVtZW50O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc2V0IHRoZSBkdXJhdGlvbiwgc3RhcnQsIGFuZCBzdG9wIHRpbWUgb2YgZWFjaCBub3RlLlxyXG4gICAgICovXHJcbiAgICBpbnN0cnVtZW50LnJlc2V0RHVyYXRpb24gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgaW5kZXggPSAtMSxcclxuICAgICAgICAgICAgbnVtT2ZOb3RlcyA9IGluc3RydW1lbnQubm90ZXMubGVuZ3RoO1xyXG5cclxuICAgICAgICBpbnN0cnVtZW50LnRvdGFsRHVyYXRpb24gPSAwO1xyXG5cclxuICAgICAgICB3aGlsZSAoKytpbmRleCA8IG51bU9mTm90ZXMpIHtcclxuICAgICAgICAgICAgdmFyIG5vdGUgPSBpbnN0cnVtZW50Lm5vdGVzW2luZGV4XSxcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uID0gZ2V0RHVyYXRpb24obm90ZS5yaHl0aG0pLFxyXG4gICAgICAgICAgICAgICAgYXJ0aWN1bGF0aW9uR2FwID0gbm90ZS50aWUgPyAwIDogZHVyYXRpb24gKiBhcnRpY3VsYXRpb25HYXBQZXJjZW50YWdlO1xyXG5cclxuICAgICAgICAgICAgbm90ZS5kdXJhdGlvbiA9IGdldER1cmF0aW9uKG5vdGUucmh5dGhtKTtcclxuICAgICAgICAgICAgbm90ZS5zdGFydFRpbWUgPSBpbnN0cnVtZW50LnRvdGFsRHVyYXRpb247XHJcbiAgICAgICAgICAgIG5vdGUuc3RvcFRpbWUgPSBpbnN0cnVtZW50LnRvdGFsRHVyYXRpb24gKyBkdXJhdGlvbiAtIGFydGljdWxhdGlvbkdhcDtcclxuXHJcbiAgICAgICAgICAgIGlmIChub3RlLnBpdGNoICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgbm90ZS5hcnRpY3VsYXRpb25HYXAgPSBhcnRpY3VsYXRpb25HYXA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGluc3RydW1lbnQudG90YWxEdXJhdGlvbiArPSBkdXJhdGlvbjtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG59LHt9XSw2OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcclxuLyoqXHJcbiAqIEJhbmQuanMgLSBNdXNpYyBDb21wb3NlclxyXG4gKiBBbiBpbnRlcmZhY2UgZm9yIHRoZSBXZWIgQXVkaW8gQVBJIHRoYXQgc3VwcG9ydHMgcmh5dGhtcywgbXVsdGlwbGUgaW5zdHJ1bWVudHMsIHJlcGVhdGluZyBzZWN0aW9ucywgYW5kIGNvbXBsZXhcclxuICogdGltZSBzaWduYXR1cmVzLlxyXG4gKlxyXG4gKiBAYXV0aG9yIENvZHkgTHVuZHF1aXN0IChodHRwOi8vZ2l0aHViLmNvbS9tZWVuaWUpIC0gMjAxNFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAdHlwZSB7QmFuZEpTfVxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBfZGVyZXFfKCcuL2NvbmR1Y3Rvci5qcycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMubG9hZFBhY2soJ2luc3RydW1lbnQnLCAnbm9pc2VzJywgX2RlcmVxXygnLi9pbnN0cnVtZW50LXBhY2tzL25vaXNlcy5qcycpKTtcclxubW9kdWxlLmV4cG9ydHMubG9hZFBhY2soJ2luc3RydW1lbnQnLCAnb3NjaWxsYXRvcnMnLCBfZGVyZXFfKCcuL2luc3RydW1lbnQtcGFja3Mvb3NjaWxsYXRvcnMuanMnKSk7XHJcbm1vZHVsZS5leHBvcnRzLmxvYWRQYWNrKCdyaHl0aG0nLCAnbm9ydGhBbWVyaWNhbicsIF9kZXJlcV8oJy4vcmh5dGhtLXBhY2tzL25vcnRoLWFtZXJpY2FuLmpzJykpO1xyXG5tb2R1bGUuZXhwb3J0cy5sb2FkUGFjaygncmh5dGhtJywgJ2V1cm9wZWFuJywgX2RlcmVxXygnLi9yaHl0aG0tcGFja3MvZXVyb3BlYW4uanMnKSk7XHJcbm1vZHVsZS5leHBvcnRzLmxvYWRQYWNrKCd0dW5pbmcnLCAnZXF1YWxUZW1wZXJhbWVudCcsIF9kZXJlcV8oJy4vdHVuaW5nLXBhY2tzL2VxdWFsLXRlbXBlcmFtZW50LmpzJykpO1xyXG5cclxufSx7XCIuL2NvbmR1Y3Rvci5qc1wiOjIsXCIuL2luc3RydW1lbnQtcGFja3Mvbm9pc2VzLmpzXCI6MyxcIi4vaW5zdHJ1bWVudC1wYWNrcy9vc2NpbGxhdG9ycy5qc1wiOjQsXCIuL3JoeXRobS1wYWNrcy9ldXJvcGVhbi5qc1wiOjgsXCIuL3JoeXRobS1wYWNrcy9ub3J0aC1hbWVyaWNhbi5qc1wiOjksXCIuL3R1bmluZy1wYWNrcy9lcXVhbC10ZW1wZXJhbWVudC5qc1wiOjEwfV0sNzpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XHJcbi8qKlxyXG4gKiBCYW5kLmpzIC0gTXVzaWMgQ29tcG9zZXJcclxuICogQW4gaW50ZXJmYWNlIGZvciB0aGUgV2ViIEF1ZGlvIEFQSSB0aGF0IHN1cHBvcnRzIHJoeXRobXMsIG11bHRpcGxlIGluc3RydW1lbnRzLCByZXBlYXRpbmcgc2VjdGlvbnMsIGFuZCBjb21wbGV4XHJcbiAqIHRpbWUgc2lnbmF0dXJlcy5cclxuICpcclxuICogQGF1dGhvciBDb2R5IEx1bmRxdWlzdCAoaHR0cDovL2dpdGh1Yi5jb20vbWVlbmllKSAtIDIwMTRcclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gUGxheWVyO1xyXG5cclxuLyoqXHJcbiAqIFBsYXllciBDbGFzcyAtIFRoaXMgZ2V0cyBpbnN0YW50aWF0ZWQgYnkgdGhlIENvbmR1Y3RvciBjbGFzcyB3aGVuIGBDb25kdWN0b3IuZmluaXNoKClgIGlzIGNhbGxlZFxyXG4gKlxyXG4gKiBAcGFyYW0gY29uZHVjdG9yXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gUGxheWVyKGNvbmR1Y3Rvcikge1xyXG4gICAgdmFyIHBsYXllciA9IHRoaXMsXHJcbiAgICAgICAgYnVmZmVyVGltZW91dCxcclxuICAgICAgICBhbGxOb3RlcyA9IGJ1ZmZlck5vdGVzKCksXHJcbiAgICAgICAgY3VycmVudFBsYXlUaW1lLFxyXG4gICAgICAgIHRvdGFsUGxheVRpbWUgPSAwLFxyXG4gICAgICAgIGZhZGVkID0gZmFsc2U7XHJcblxyXG4gICAgY2FsY3VsYXRlVG90YWxEdXJhdGlvbigpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSGVscGVyIGZ1bmN0aW9uIHRvIHN0b3AgYWxsIG5vdGVzIGFuZFxyXG4gICAgICogdGhlbiByZS1idWZmZXJzIHRoZW1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtyZXNldER1cmF0aW9uXVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiByZXNldChyZXNldER1cmF0aW9uKSB7XHJcbiAgICAgICAgLy8gUmVzZXQgdGhlIGJ1ZmZlciBwb3NpdGlvbiBvZiBhbGwgaW5zdHJ1bWVudHNcclxuICAgICAgICB2YXIgaW5kZXggPSAtMSxcclxuICAgICAgICAgICAgbnVtT2ZJbnN0cnVtZW50cyA9IGNvbmR1Y3Rvci5pbnN0cnVtZW50cy5sZW5ndGg7XHJcbiAgICAgICAgd2hpbGUgKCsraW5kZXggPCBudW1PZkluc3RydW1lbnRzKSB7XHJcbiAgICAgICAgICAgIHZhciBpbnN0cnVtZW50ID0gY29uZHVjdG9yLmluc3RydW1lbnRzW2luZGV4XTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXNldER1cmF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBpbnN0cnVtZW50LnJlc2V0RHVyYXRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbnN0cnVtZW50LmJ1ZmZlclBvc2l0aW9uID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIElmIHdlIGFyZSByZXNldGluZyB0aGUgZHVyYXRpb24sIHdlIG5lZWQgdG8gZmlndXJlIG91dCB0aGUgbmV3IHRvdGFsIGR1cmF0aW9uLlxyXG4gICAgICAgIC8vIEFsc28gc2V0IHRoZSB0b3RhbFBsYXlUaW1lIHRvIHRoZSBjdXJyZW50IHBlcmNlbnRhZ2UgZG9uZSBvZiB0aGUgbmV3IHRvdGFsIGR1cmF0aW9uLlxyXG4gICAgICAgIGlmIChyZXNldER1cmF0aW9uKSB7XHJcbiAgICAgICAgICAgIGNhbGN1bGF0ZVRvdGFsRHVyYXRpb24oKTtcclxuICAgICAgICAgICAgdG90YWxQbGF5VGltZSA9IGNvbmR1Y3Rvci5wZXJjZW50YWdlQ29tcGxldGUgKiBjb25kdWN0b3IudG90YWxEdXJhdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluZGV4ID0gLTE7XHJcbiAgICAgICAgd2hpbGUgKCsraW5kZXggPCBhbGxOb3Rlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgYWxsTm90ZXNbaW5kZXhdLmdhaW4uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KGJ1ZmZlclRpbWVvdXQpO1xyXG5cclxuICAgICAgICBhbGxOb3RlcyA9IGJ1ZmZlck5vdGVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIZWxwZXIgZnVuY3Rpb24gdG8gZmFkZSB1cC9kb3duIG1hc3RlciB2b2x1bWVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZGlyZWN0aW9uIC0gdXAgb3IgZG93blxyXG4gICAgICogQHBhcmFtIFtjYl0gLSBDYWxsYmFjayBmdW5jdGlvbiBmaXJlZCBhZnRlciB0aGUgdHJhbnNpdGlvbiBpcyBjb21wbGV0ZWRcclxuICAgICAqIEBwYXJhbSBbcmVzZXRWb2x1bWVdIC0gUmVzZXQgdGhlIHZvbHVtZSBiYWNrIHRvIGl0J3Mgb3JpZ2luYWwgbGV2ZWxcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZmFkZShkaXJlY3Rpb24sIGNiLCByZXNldFZvbHVtZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgcmVzZXRWb2x1bWUgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIHJlc2V0Vm9sdW1lID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgndXAnICE9PSBkaXJlY3Rpb24gJiYgJ2Rvd24nICE9PSBkaXJlY3Rpb24pIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEaXJlY3Rpb24gbXVzdCBiZSBlaXRoZXIgdXAgb3IgZG93bi4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBmYWRlRHVyYXRpb24gPSAwLjI7XHJcblxyXG4gICAgICAgIGZhZGVkID0gZGlyZWN0aW9uID09PSAnZG93bic7XHJcblxyXG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT09ICd1cCcpIHtcclxuICAgICAgICAgICAgY29uZHVjdG9yLm1hc3RlclZvbHVtZS5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAsIGNvbmR1Y3Rvci5hdWRpb0NvbnRleHQuY3VycmVudFRpbWUpO1xyXG4gICAgICAgICAgICBjb25kdWN0b3IubWFzdGVyVm9sdW1lLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoY29uZHVjdG9yLm1hc3RlclZvbHVtZUxldmVsLCBjb25kdWN0b3IuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lICsgZmFkZUR1cmF0aW9uKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25kdWN0b3IubWFzdGVyVm9sdW1lLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoY29uZHVjdG9yLm1hc3RlclZvbHVtZUxldmVsLCBjb25kdWN0b3IuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lKTtcclxuICAgICAgICAgICAgY29uZHVjdG9yLm1hc3RlclZvbHVtZS5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAsIGNvbmR1Y3Rvci5hdWRpb0NvbnRleHQuY3VycmVudFRpbWUgKyBmYWRlRHVyYXRpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgY2IuY2FsbChwbGF5ZXIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzZXRWb2x1bWUpIHtcclxuICAgICAgICAgICAgICAgIGZhZGVkID0gISBmYWRlZDtcclxuICAgICAgICAgICAgICAgIGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWUuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZShjb25kdWN0b3IubWFzdGVyVm9sdW1lTGV2ZWwsIGNvbmR1Y3Rvci5hdWRpb0NvbnRleHQuY3VycmVudFRpbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgZmFkZUR1cmF0aW9uICogMTAwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSB0b3RhbCBkdXJhdGlvbiBvZiBhIHNvbmcgYmFzZWQgb24gdGhlIGxvbmdlc3QgZHVyYXRpb24gb2YgYWxsIGluc3RydW1lbnRzLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVUb3RhbER1cmF0aW9uKCkge1xyXG4gICAgICAgIHZhciBpbmRleCA9IC0xO1xyXG4gICAgICAgIHZhciB0b3RhbER1cmF0aW9uID0gMDtcclxuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGNvbmR1Y3Rvci5pbnN0cnVtZW50cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdmFyIGluc3RydW1lbnQgPSBjb25kdWN0b3IuaW5zdHJ1bWVudHNbaW5kZXhdO1xyXG4gICAgICAgICAgICBpZiAoaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uID4gdG90YWxEdXJhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgdG90YWxEdXJhdGlvbiA9IGluc3RydW1lbnQudG90YWxEdXJhdGlvbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uZHVjdG9yLnRvdGFsRHVyYXRpb24gPSB0b3RhbER1cmF0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR3JhYnMgYSBzZXQgb2Ygbm90ZXMgYmFzZWQgb24gdGhlIGN1cnJlbnQgdGltZSBhbmQgd2hhdCB0aGUgQnVmZmVyIFNpemUgaXMuXHJcbiAgICAgKiBJdCB3aWxsIGFsc28gc2tpcCBhbnkgbm90ZXMgdGhhdCBoYXZlIGEgc3RhcnQgdGltZSBsZXNzIHRoYW4gdGhlXHJcbiAgICAgKiB0b3RhbCBwbGF5IHRpbWUuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge0FycmF5fVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBidWZmZXJOb3RlcygpIHtcclxuICAgICAgICB2YXIgbm90ZXMgPSBbXSxcclxuICAgICAgICAgICAgaW5kZXggPSAtMSxcclxuICAgICAgICAgICAgYnVmZmVyU2l6ZSA9IGNvbmR1Y3Rvci5ub3RlQnVmZmVyTGVuZ3RoO1xyXG5cclxuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGNvbmR1Y3Rvci5pbnN0cnVtZW50cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdmFyIGluc3RydW1lbnQgPSBjb25kdWN0b3IuaW5zdHJ1bWVudHNbaW5kZXhdO1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgdm9sdW1lIGZvciB0aGlzIGluc3RydW1lbnRcclxuICAgICAgICAgICAgdmFyIGJ1ZmZlckNvdW50ID0gYnVmZmVyU2l6ZTtcclxuICAgICAgICAgICAgdmFyIGluZGV4MiA9IC0xO1xyXG4gICAgICAgICAgICB3aGlsZSAoKytpbmRleDIgPCBidWZmZXJDb3VudCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5vdGUgPSBpbnN0cnVtZW50Lm5vdGVzW2luc3RydW1lbnQuYnVmZmVyUG9zaXRpb24gKyBpbmRleDJdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygbm90ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgcGl0Y2ggPSBub3RlLnBpdGNoLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZSA9IG5vdGUuc3RhcnRUaW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3BUaW1lID0gbm90ZS5zdG9wVGltZSxcclxuICAgICAgICAgICAgICAgICAgICB2b2x1bWVMZXZlbCA9IG5vdGUudm9sdW1lTGV2ZWw7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHN0b3BUaW1lIDwgdG90YWxQbGF5VGltZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlckNvdW50ICsrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIElmIHBpdGNoIGlzIGZhbHNlLCB0aGVuIGl0J3MgYSByZXN0IGFuZCB3ZSBkb24ndCBuZWVkIGEgbm90ZVxyXG4gICAgICAgICAgICAgICAgaWYgKGZhbHNlID09PSBwaXRjaCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBnYWluID0gY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XHJcbiAgICAgICAgICAgICAgICAvLyBDb25uZWN0IHZvbHVtZSBnYWluIHRvIHRoZSBNYXN0ZXIgVm9sdW1lO1xyXG4gICAgICAgICAgICAgICAgZ2Fpbi5jb25uZWN0KGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWUpO1xyXG4gICAgICAgICAgICAgICAgZ2Fpbi5nYWluLnZhbHVlID0gdm9sdW1lTGV2ZWw7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHN0YXJ0VGltZSBpcyBsZXNzIHRoYW4gdG90YWwgcGxheSB0aW1lLCB3ZSBuZWVkIHRvIHN0YXJ0IHRoZSBub3RlXHJcbiAgICAgICAgICAgICAgICAvLyBpbiB0aGUgbWlkZGxlXHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnRUaW1lIDwgdG90YWxQbGF5VGltZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZSA9IHN0b3BUaW1lIC0gdG90YWxQbGF5VGltZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBObyBwaXRjaGVzIGRlZmluZWRcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcGl0Y2ggPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm90ZXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogc3RhcnRUaW1lIDwgdG90YWxQbGF5VGltZSA/IHN0b3BUaW1lIC0gdG90YWxQbGF5VGltZSA6IHN0YXJ0VGltZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcFRpbWU6IHN0b3BUaW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlOiBpbnN0cnVtZW50Lmluc3RydW1lbnQuY3JlYXRlTm90ZShnYWluKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2FpbjogZ2FpbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdm9sdW1lTGV2ZWw6IHZvbHVtZUxldmVsXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbmRleDMgPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoKytpbmRleDMgPCBwaXRjaC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHAgPSBwaXRjaFtpbmRleDNdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3Rlcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogc3RhcnRUaW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcFRpbWU6IHN0b3BUaW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTogaW5zdHJ1bWVudC5pbnN0cnVtZW50LmNyZWF0ZU5vdGUoZ2FpbiwgY29uZHVjdG9yLnBpdGNoZXNbcC50cmltKCldIHx8IHBhcnNlRmxvYXQocCkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FpbjogZ2FpbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZvbHVtZUxldmVsOiB2b2x1bWVMZXZlbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaW5zdHJ1bWVudC5idWZmZXJQb3NpdGlvbiArPSBidWZmZXJDb3VudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFJldHVybiBhcnJheSBvZiBub3Rlc1xyXG4gICAgICAgIHJldHVybiBub3RlcztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0b3RhbFBsYXlUaW1lQ2FsY3VsYXRvcigpIHtcclxuICAgICAgICBpZiAoISBwbGF5ZXIucGF1c2VkICYmIHBsYXllci5wbGF5aW5nKSB7XHJcbiAgICAgICAgICAgIGlmIChjb25kdWN0b3IudG90YWxEdXJhdGlvbiA8IHRvdGFsUGxheVRpbWUpIHtcclxuICAgICAgICAgICAgICAgIHBsYXllci5zdG9wKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIubG9vcGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5wbGF5KCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25kdWN0b3Iub25GaW5pc2hlZENhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVUb3RhbFBsYXlUaW1lKCk7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHRvdGFsUGxheVRpbWVDYWxjdWxhdG9yLCAxMDAwIC8gNjApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsbCB0byB1cGRhdGUgdGhlIHRvdGFsIHBsYXkgdGltZSBzbyBmYXJcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdXBkYXRlVG90YWxQbGF5VGltZSgpIHtcclxuICAgICAgICB0b3RhbFBsYXlUaW1lICs9IGNvbmR1Y3Rvci5hdWRpb0NvbnRleHQuY3VycmVudFRpbWUgLSBjdXJyZW50UGxheVRpbWU7XHJcbiAgICAgICAgdmFyIHNlY29uZHMgPSBNYXRoLnJvdW5kKHRvdGFsUGxheVRpbWUpO1xyXG4gICAgICAgIGlmIChzZWNvbmRzICE9IGNvbmR1Y3Rvci5jdXJyZW50U2Vjb25kcykge1xyXG4gICAgICAgICAgICAvLyBNYWtlIGNhbGxiYWNrIGFzeW5jaHJvbm91c1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY29uZHVjdG9yLm9uVGlja2VyQ2FsbGJhY2soc2Vjb25kcyk7XHJcbiAgICAgICAgICAgIH0sIDEpO1xyXG4gICAgICAgICAgICBjb25kdWN0b3IuY3VycmVudFNlY29uZHMgPSBzZWNvbmRzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25kdWN0b3IucGVyY2VudGFnZUNvbXBsZXRlID0gdG90YWxQbGF5VGltZSAvIGNvbmR1Y3Rvci50b3RhbER1cmF0aW9uO1xyXG4gICAgICAgIGN1cnJlbnRQbGF5VGltZSA9IGNvbmR1Y3Rvci5hdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XHJcbiAgICB9XHJcblxyXG4gICAgcGxheWVyLnBhdXNlZCA9IGZhbHNlO1xyXG4gICAgcGxheWVyLnBsYXlpbmcgPSBmYWxzZTtcclxuICAgIHBsYXllci5sb29waW5nID0gZmFsc2U7XHJcbiAgICBwbGF5ZXIubXV0ZWQgPSBmYWxzZTtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBHcmFicyBjdXJyZW50bHkgYnVmZmVyZWQgbm90ZXMgYW5kIGNhbGxzIHRoZWlyIHN0YXJ0L3N0b3AgbWV0aG9kcy5cclxuICAgICAqXHJcbiAgICAgKiBJdCB0aGVuIHNldHMgdXAgYSB0aW1lciB0byBidWZmZXIgdXAgdGhlIG5leHQgc2V0IG9mIG5vdGVzIGJhc2VkIG9uIHRoZVxyXG4gICAgICogYSBzZXQgYnVmZmVyIHNpemUuICBUaGlzIHdpbGwga2VlcCBnb2luZyB1bnRpbCB0aGUgc29uZyBpcyBzdG9wcGVkIG9yIHBhdXNlZC5cclxuICAgICAqXHJcbiAgICAgKiBJdCB3aWxsIHVzZSB0aGUgdG90YWwgdGltZSBwbGF5ZWQgc28gZmFyIGFzIGFuIG9mZnNldCBzbyB5b3UgcGF1c2UvcGxheSB0aGUgbXVzaWNcclxuICAgICAqL1xyXG4gICAgcGxheWVyLnBsYXkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBwbGF5ZXIucGxheWluZyA9IHRydWU7XHJcbiAgICAgICAgcGxheWVyLnBhdXNlZCA9IGZhbHNlO1xyXG4gICAgICAgIGN1cnJlbnRQbGF5VGltZSA9IGNvbmR1Y3Rvci5hdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XHJcbiAgICAgICAgLy8gU3RhcnRzIGNhbGN1bGF0b3Igd2hpY2gga2VlcHMgdHJhY2sgb2YgdG90YWwgcGxheSB0aW1lXHJcbiAgICAgICAgdG90YWxQbGF5VGltZUNhbGN1bGF0b3IoKTtcclxuICAgICAgICB2YXIgdGltZU9mZnNldCA9IGNvbmR1Y3Rvci5hdWRpb0NvbnRleHQuY3VycmVudFRpbWUgLSB0b3RhbFBsYXlUaW1lLFxyXG4gICAgICAgICAgICBwbGF5Tm90ZXMgPSBmdW5jdGlvbihub3Rlcykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoKytpbmRleCA8IG5vdGVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBub3RlID0gbm90ZXNbaW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFydFRpbWUgPSBub3RlLnN0YXJ0VGltZSArIHRpbWVPZmZzZXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3BUaW1lID0gbm90ZS5zdG9wVGltZSArIHRpbWVPZmZzZXQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIElmIG5vIHRpZSwgdGhlbiB3ZSBuZWVkIHRvIGludHJvZHVjZSBhIHZvbHVtZSByYW1wIHVwIHRvIHJlbW92ZSBhbnkgY2xpcHBpbmdcclxuICAgICAgICAgICAgICAgICAgICAgKiBhcyBPc2NpbGxhdG9ycyBoYXZlIGFuIGlzc3VlIHdpdGggdGhpcyB3aGVuIHBsYXlpbmcgYSBub3RlIGF0IGZ1bGwgdm9sdW1lLlxyXG4gICAgICAgICAgICAgICAgICAgICAqIFdlIGFsc28gcHV0IGluIGEgc2xpZ2h0IHJhbXAgZG93biBhcyB3ZWxsLiAgVGhpcyBvbmx5IHRha2VzIHVwIDEvMTAwMCBvZiBhIHNlY29uZC5cclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBpZiAoISBub3RlLnRpZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnRUaW1lID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lIC09IDAuMDAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3BUaW1lICs9IDAuMDAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3RlLmdhaW4uZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLjAsIHN0YXJ0VGltZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdGUuZ2Fpbi5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKG5vdGUudm9sdW1lTGV2ZWwsIHN0YXJ0VGltZSArIDAuMDAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm90ZS5nYWluLmdhaW4uc2V0VmFsdWVBdFRpbWUobm90ZS52b2x1bWVMZXZlbCwgc3RvcFRpbWUgLSAwLjAwMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdGUuZ2Fpbi5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAuMCwgc3RvcFRpbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbm90ZS5ub2RlLnN0YXJ0KHN0YXJ0VGltZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbm90ZS5ub2RlLnN0b3Aoc3RvcFRpbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBidWZmZXJVcCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgYnVmZmVyVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gYnVmZmVySW5OZXdOb3RlcygpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGxheWVyLnBsYXlpbmcgJiYgISBwbGF5ZXIucGF1c2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdOb3RlcyA9IGJ1ZmZlck5vdGVzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXdOb3Rlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF5Tm90ZXMobmV3Tm90ZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsTm90ZXMgPSBhbGxOb3Rlcy5jb25jYXQobmV3Tm90ZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyVXAoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIGNvbmR1Y3Rvci50ZW1wbyAqIDUwMDApO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICBwbGF5Tm90ZXMoYWxsTm90ZXMpO1xyXG4gICAgICAgIGJ1ZmZlclVwKCk7XHJcblxyXG4gICAgICAgIGlmIChmYWRlZCAmJiAhIHBsYXllci5tdXRlZCkge1xyXG4gICAgICAgICAgICBmYWRlKCd1cCcpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFN0b3AgcGxheWluZyBhbGwgbXVzaWMgYW5kIHJld2luZCB0aGUgc29uZ1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBmYWRlT3V0IGJvb2xlYW4gLSBzaG91bGQgdGhlIHNvbmcgZmFkZSBvdXQ/XHJcbiAgICAgKi9cclxuICAgIHBsYXllci5zdG9wID0gZnVuY3Rpb24oZmFkZU91dCkge1xyXG4gICAgICAgIHBsYXllci5wbGF5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgY29uZHVjdG9yLmN1cnJlbnRTZWNvbmRzID0gMDtcclxuICAgICAgICBjb25kdWN0b3IucGVyY2VudGFnZUNvbXBsZXRlID0gMDtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBmYWRlT3V0ID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBmYWRlT3V0ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGZhZGVPdXQgJiYgISBwbGF5ZXIubXV0ZWQpIHtcclxuICAgICAgICAgICAgZmFkZSgnZG93bicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdG90YWxQbGF5VGltZSA9IDA7XHJcbiAgICAgICAgICAgICAgICByZXNldCgpO1xyXG4gICAgICAgICAgICAgICAgLy8gTWFrZSBjYWxsYmFjayBhc3luY2hyb25vdXNcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uZHVjdG9yLm9uVGlja2VyQ2FsbGJhY2soY29uZHVjdG9yLmN1cnJlbnRTZWNvbmRzKTtcclxuICAgICAgICAgICAgICAgIH0sIDEpO1xyXG4gICAgICAgICAgICB9LCB0cnVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0b3RhbFBsYXlUaW1lID0gMDtcclxuICAgICAgICAgICAgcmVzZXQoKTtcclxuICAgICAgICAgICAgLy8gTWFrZSBjYWxsYmFjayBhc3luY2hyb25vdXNcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbmR1Y3Rvci5vblRpY2tlckNhbGxiYWNrKGNvbmR1Y3Rvci5jdXJyZW50U2Vjb25kcyk7XHJcbiAgICAgICAgICAgIH0sIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQYXVzZXMgdGhlIG11c2ljLCByZXNldHMgdGhlIG5vdGVzLFxyXG4gICAgICogYW5kIGdldHMgdGhlIHRvdGFsIHRpbWUgcGxheWVkIHNvIGZhclxyXG4gICAgICovXHJcbiAgICBwbGF5ZXIucGF1c2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBwbGF5ZXIucGF1c2VkID0gdHJ1ZTtcclxuICAgICAgICB1cGRhdGVUb3RhbFBsYXlUaW1lKCk7XHJcbiAgICAgICAgaWYgKHBsYXllci5tdXRlZCkge1xyXG4gICAgICAgICAgICByZXNldCgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGZhZGUoJ2Rvd24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJlc2V0KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgdHJ1ZSBpZiB5b3Ugd2FudCB0aGUgc29uZyB0byBsb29wXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHZhbFxyXG4gICAgICovXHJcbiAgICBwbGF5ZXIubG9vcCA9IGZ1bmN0aW9uKHZhbCkge1xyXG4gICAgICAgIHBsYXllci5sb29waW5nID0gISEgdmFsO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCBhIHNwZWNpZmljIHRpbWUgdGhhdCB0aGUgc29uZyBzaG91bGQgc3RhcnQgaXQuXHJcbiAgICAgKiBJZiBpdCdzIGFscmVhZHkgcGxheWluZywgcmVzZXQgYW5kIHN0YXJ0IHRoZSBzb25nXHJcbiAgICAgKiBhZ2FpbiBzbyBpdCBoYXMgYSBzZWFtbGVzcyBqdW1wLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBuZXdUaW1lXHJcbiAgICAgKi9cclxuICAgIHBsYXllci5zZXRUaW1lID0gZnVuY3Rpb24obmV3VGltZSkge1xyXG4gICAgICAgIHRvdGFsUGxheVRpbWUgPSBwYXJzZUludChuZXdUaW1lKTtcclxuICAgICAgICByZXNldCgpO1xyXG4gICAgICAgIGlmIChwbGF5ZXIucGxheWluZyAmJiAhIHBsYXllci5wYXVzZWQpIHtcclxuICAgICAgICAgICAgcGxheWVyLnBsYXkoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVzZXQgdGhlIHRlbXBvIGZvciBhIHNvbmcuIFRoaXMgd2lsbCB0cmlnZ2VyIGFcclxuICAgICAqIGR1cmF0aW9uIHJlc2V0IGZvciBlYWNoIGluc3RydW1lbnQgYXMgd2VsbC5cclxuICAgICAqL1xyXG4gICAgcGxheWVyLnJlc2V0VGVtcG8gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXNldCh0cnVlKTtcclxuICAgICAgICBpZiAocGxheWVyLnBsYXlpbmcgJiYgISBwbGF5ZXIucGF1c2VkKSB7XHJcbiAgICAgICAgICAgIHBsYXllci5wbGF5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE11dGUgYWxsIG9mIHRoZSBtdXNpY1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjYiAtIENhbGxiYWNrIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIG11c2ljIGhhcyBiZWVuIG11dGVkXHJcbiAgICAgKi9cclxuICAgIHBsYXllci5tdXRlID0gZnVuY3Rpb24oY2IpIHtcclxuICAgICAgICBwbGF5ZXIubXV0ZWQgPSB0cnVlO1xyXG4gICAgICAgIGZhZGUoJ2Rvd24nLCBjYik7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVW5tdXRlIGFsbCBvZiB0aGUgbXVzaWNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY2IgLSBDYWxsYmFjayBmdW5jdGlvbiBjYWxsZWQgd2hlbiBtdXNpYyBoYXMgYmVlbiB1bm11dGVkXHJcbiAgICAgKi9cclxuICAgIHBsYXllci51bm11dGUgPSBmdW5jdGlvbihjYikge1xyXG4gICAgICAgIHBsYXllci5tdXRlZCA9IGZhbHNlO1xyXG4gICAgICAgIGZhZGUoJ3VwJywgY2IpO1xyXG4gICAgfTtcclxufVxyXG5cclxufSx7fV0sODpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XHJcbi8qKlxyXG4gKiBCYW5kLmpzIC0gTXVzaWMgQ29tcG9zZXJcclxuICogQW4gaW50ZXJmYWNlIGZvciB0aGUgV2ViIEF1ZGlvIEFQSSB0aGF0IHN1cHBvcnRzIHJoeXRobXMsIG11bHRpcGxlIGluc3RydW1lbnRzLCByZXBlYXRpbmcgc2VjdGlvbnMsIGFuZCBjb21wbGV4XHJcbiAqIHRpbWUgc2lnbmF0dXJlcy5cclxuICpcclxuICogQGF1dGhvciBDb2R5IEx1bmRxdWlzdCAoaHR0cDovL2dpdGh1Yi5jb20vbWVlbmllKSAtIDIwMTRcclxuICovXHJcblxyXG4vKipcclxuICogRXVyb3BlYW4gUmh5dGhtIFBhY2tcclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgc2VtaWJyZXZlOiAxLFxyXG4gICAgZG90dGVkTWluaW06IDAuNzUsXHJcbiAgICBtaW5pbTogMC41LFxyXG4gICAgZG90dGVkQ3JvdGNoZXQ6IDAuMzc1LFxyXG4gICAgdHJpcGxldE1pbmltOiAwLjMzMzMzMzM0LFxyXG4gICAgY3JvdGNoZXQ6IDAuMjUsXHJcbiAgICBkb3R0ZWRRdWF2ZXI6IDAuMTg3NSxcclxuICAgIHRyaXBsZXRDcm90Y2hldDogMC4xNjY2NjY2NjcsXHJcbiAgICBxdWF2ZXI6IDAuMTI1LFxyXG4gICAgZG90dGVkU2VtaXF1YXZlcjogMC4wOTM3NSxcclxuICAgIHRyaXBsZXRRdWF2ZXI6IDAuMDgzMzMzMzMzLFxyXG4gICAgc2VtaXF1YXZlcjogMC4wNjI1LFxyXG4gICAgdHJpcGxldFNlbWlxdWF2ZXI6IDAuMDQxNjY2NjY3LFxyXG4gICAgZGVtaXNlbWlxdWF2ZXI6IDAuMDMxMjVcclxufTtcclxuXHJcbn0se31dLDk6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xyXG4vKipcclxuICogQmFuZC5qcyAtIE11c2ljIENvbXBvc2VyXHJcbiAqIEFuIGludGVyZmFjZSBmb3IgdGhlIFdlYiBBdWRpbyBBUEkgdGhhdCBzdXBwb3J0cyByaHl0aG1zLCBtdWx0aXBsZSBpbnN0cnVtZW50cywgcmVwZWF0aW5nIHNlY3Rpb25zLCBhbmQgY29tcGxleFxyXG4gKiB0aW1lIHNpZ25hdHVyZXMuXHJcbiAqXHJcbiAqIEBhdXRob3IgQ29keSBMdW5kcXVpc3QgKGh0dHA6Ly9naXRodWIuY29tL21lZW5pZSkgLSAyMDE0XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIE5vcnRoIEFtZXJpY2FuIChDYW5hZGEgYW5kIFVTQSkgUmh5dGhtIFBhY2tcclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgd2hvbGU6IDEsXHJcbiAgICBkb3R0ZWRIYWxmOiAwLjc1LFxyXG4gICAgaGFsZjogMC41LFxyXG4gICAgZG90dGVkUXVhcnRlcjogMC4zNzUsXHJcbiAgICB0cmlwbGV0SGFsZjogMC4zMzMzMzMzNCxcclxuICAgIHF1YXJ0ZXI6IDAuMjUsXHJcbiAgICBkb3R0ZWRFaWdodGg6IDAuMTg3NSxcclxuICAgIHRyaXBsZXRRdWFydGVyOiAwLjE2NjY2NjY2NyxcclxuICAgIGVpZ2h0aDogMC4xMjUsXHJcbiAgICBkb3R0ZWRTaXh0ZWVudGg6IDAuMDkzNzUsXHJcbiAgICB0cmlwbGV0RWlnaHRoOiAwLjA4MzMzMzMzMyxcclxuICAgIHNpeHRlZW50aDogMC4wNjI1LFxyXG4gICAgdHJpcGxldFNpeHRlZW50aDogMC4wNDE2NjY2NjcsXHJcbiAgICB0aGlydHlTZWNvbmQ6IDAuMDMxMjVcclxufTtcclxuXHJcbn0se31dLDEwOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcclxuLyoqXHJcbiAqIEJhbmQuanMgLSBNdXNpYyBDb21wb3NlclxyXG4gKiBBbiBpbnRlcmZhY2UgZm9yIHRoZSBXZWIgQXVkaW8gQVBJIHRoYXQgc3VwcG9ydHMgcmh5dGhtcywgbXVsdGlwbGUgaW5zdHJ1bWVudHMsIHJlcGVhdGluZyBzZWN0aW9ucywgYW5kIGNvbXBsZXhcclxuICogdGltZSBzaWduYXR1cmVzLlxyXG4gKlxyXG4gKiBAYXV0aG9yIENvZHkgTHVuZHF1aXN0IChodHRwOi8vZ2l0aHViLmNvbS9tZWVuaWUpIC0gMjAxNFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBFcXVhbCBUZW1wZXJhbWVudCBUdW5pbmdcclxuICogU291cmNlOiBodHRwOi8vd3d3LnBoeS5tdHUuZWR1L35zdWl0cy9ub3RlZnJlcXMuaHRtbFxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICAnQzAnOiAxNi4zNSxcclxuICAgICdDIzAnOiAxNy4zMixcclxuICAgICdEYjAnOiAxNy4zMixcclxuICAgICdEMCc6IDE4LjM1LFxyXG4gICAgJ0QjMCc6IDE5LjQ1LFxyXG4gICAgJ0ViMCc6IDE5LjQ1LFxyXG4gICAgJ0UwJzogMjAuNjAsXHJcbiAgICAnRjAnOiAyMS44MyxcclxuICAgICdGIzAnOiAyMy4xMixcclxuICAgICdHYjAnOiAyMy4xMixcclxuICAgICdHMCc6IDI0LjUwLFxyXG4gICAgJ0cjMCc6IDI1Ljk2LFxyXG4gICAgJ0FiMCc6IDI1Ljk2LFxyXG4gICAgJ0EwJzogMjcuNTAsXHJcbiAgICAnQSMwJzogMjkuMTQsXHJcbiAgICAnQmIwJzogMjkuMTQsXHJcbiAgICAnQjAnOiAzMC44NyxcclxuICAgICdDMSc6IDMyLjcwLFxyXG4gICAgJ0MjMSc6IDM0LjY1LFxyXG4gICAgJ0RiMSc6IDM0LjY1LFxyXG4gICAgJ0QxJzogMzYuNzEsXHJcbiAgICAnRCMxJzogMzguODksXHJcbiAgICAnRWIxJzogMzguODksXHJcbiAgICAnRTEnOiA0MS4yMCxcclxuICAgICdGMSc6IDQzLjY1LFxyXG4gICAgJ0YjMSc6IDQ2LjI1LFxyXG4gICAgJ0diMSc6IDQ2LjI1LFxyXG4gICAgJ0cxJzogNDkuMDAsXHJcbiAgICAnRyMxJzogNTEuOTEsXHJcbiAgICAnQWIxJzogNTEuOTEsXHJcbiAgICAnQTEnOiA1NS4wMCxcclxuICAgICdBIzEnOiA1OC4yNyxcclxuICAgICdCYjEnOiA1OC4yNyxcclxuICAgICdCMSc6IDYxLjc0LFxyXG4gICAgJ0MyJzogNjUuNDEsXHJcbiAgICAnQyMyJzogNjkuMzAsXHJcbiAgICAnRGIyJzogNjkuMzAsXHJcbiAgICAnRDInOiA3My40MixcclxuICAgICdEIzInOiA3Ny43OCxcclxuICAgICdFYjInOiA3Ny43OCxcclxuICAgICdFMic6IDgyLjQxLFxyXG4gICAgJ0YyJzogODcuMzEsXHJcbiAgICAnRiMyJzogOTIuNTAsXHJcbiAgICAnR2IyJzogOTIuNTAsXHJcbiAgICAnRzInOiA5OC4wMCxcclxuICAgICdHIzInOiAxMDMuODMsXHJcbiAgICAnQWIyJzogMTAzLjgzLFxyXG4gICAgJ0EyJzogMTEwLjAwLFxyXG4gICAgJ0EjMic6IDExNi41NCxcclxuICAgICdCYjInOiAxMTYuNTQsXHJcbiAgICAnQjInOiAxMjMuNDcsXHJcbiAgICAnQzMnOiAxMzAuODEsXHJcbiAgICAnQyMzJzogMTM4LjU5LFxyXG4gICAgJ0RiMyc6IDEzOC41OSxcclxuICAgICdEMyc6IDE0Ni44MyxcclxuICAgICdEIzMnOiAxNTUuNTYsXHJcbiAgICAnRWIzJzogMTU1LjU2LFxyXG4gICAgJ0UzJzogMTY0LjgxLFxyXG4gICAgJ0YzJzogMTc0LjYxLFxyXG4gICAgJ0YjMyc6IDE4NS4wMCxcclxuICAgICdHYjMnOiAxODUuMDAsXHJcbiAgICAnRzMnOiAxOTYuMDAsXHJcbiAgICAnRyMzJzogMjA3LjY1LFxyXG4gICAgJ0FiMyc6IDIwNy42NSxcclxuICAgICdBMyc6IDIyMC4wMCxcclxuICAgICdBIzMnOiAyMzMuMDgsXHJcbiAgICAnQmIzJzogMjMzLjA4LFxyXG4gICAgJ0IzJzogMjQ2Ljk0LFxyXG4gICAgJ0M0JzogMjYxLjYzLFxyXG4gICAgJ0MjNCc6IDI3Ny4xOCxcclxuICAgICdEYjQnOiAyNzcuMTgsXHJcbiAgICAnRDQnOiAyOTMuNjYsXHJcbiAgICAnRCM0JzogMzExLjEzLFxyXG4gICAgJ0ViNCc6IDMxMS4xMyxcclxuICAgICdFNCc6IDMyOS42MyxcclxuICAgICdGNCc6IDM0OS4yMyxcclxuICAgICdGIzQnOiAzNjkuOTksXHJcbiAgICAnR2I0JzogMzY5Ljk5LFxyXG4gICAgJ0c0JzogMzkyLjAwLFxyXG4gICAgJ0cjNCc6IDQxNS4zMCxcclxuICAgICdBYjQnOiA0MTUuMzAsXHJcbiAgICAnQTQnOiA0NDAuMDAsXHJcbiAgICAnQSM0JzogNDY2LjE2LFxyXG4gICAgJ0JiNCc6IDQ2Ni4xNixcclxuICAgICdCNCc6IDQ5My44OCxcclxuICAgICdDNSc6IDUyMy4yNSxcclxuICAgICdDIzUnOiA1NTQuMzcsXHJcbiAgICAnRGI1JzogNTU0LjM3LFxyXG4gICAgJ0Q1JzogNTg3LjMzLFxyXG4gICAgJ0QjNSc6IDYyMi4yNSxcclxuICAgICdFYjUnOiA2MjIuMjUsXHJcbiAgICAnRTUnOiA2NTkuMjYsXHJcbiAgICAnRjUnOiA2OTguNDYsXHJcbiAgICAnRiM1JzogNzM5Ljk5LFxyXG4gICAgJ0diNSc6IDczOS45OSxcclxuICAgICdHNSc6IDc4My45OSxcclxuICAgICdHIzUnOiA4MzAuNjEsXHJcbiAgICAnQWI1JzogODMwLjYxLFxyXG4gICAgJ0E1JzogODgwLjAwLFxyXG4gICAgJ0EjNSc6IDkzMi4zMyxcclxuICAgICdCYjUnOiA5MzIuMzMsXHJcbiAgICAnQjUnOiA5ODcuNzcsXHJcbiAgICAnQzYnOiAxMDQ2LjUwLFxyXG4gICAgJ0MjNic6IDExMDguNzMsXHJcbiAgICAnRGI2JzogMTEwOC43MyxcclxuICAgICdENic6IDExNzQuNjYsXHJcbiAgICAnRCM2JzogMTI0NC41MSxcclxuICAgICdFYjYnOiAxMjQ0LjUxLFxyXG4gICAgJ0U2JzogMTMxOC41MSxcclxuICAgICdGNic6IDEzOTYuOTEsXHJcbiAgICAnRiM2JzogMTQ3OS45OCxcclxuICAgICdHYjYnOiAxNDc5Ljk4LFxyXG4gICAgJ0c2JzogMTU2Ny45OCxcclxuICAgICdHIzYnOiAxNjYxLjIyLFxyXG4gICAgJ0FiNic6IDE2NjEuMjIsXHJcbiAgICAnQTYnOiAxNzYwLjAwLFxyXG4gICAgJ0EjNic6IDE4NjQuNjYsXHJcbiAgICAnQmI2JzogMTg2NC42NixcclxuICAgICdCNic6IDE5NzUuNTMsXHJcbiAgICAnQzcnOiAyMDkzLjAwLFxyXG4gICAgJ0MjNyc6IDIyMTcuNDYsXHJcbiAgICAnRGI3JzogMjIxNy40NixcclxuICAgICdENyc6IDIzNDkuMzIsXHJcbiAgICAnRCM3JzogMjQ4OS4wMixcclxuICAgICdFYjcnOiAyNDg5LjAyLFxyXG4gICAgJ0U3JzogMjYzNy4wMixcclxuICAgICdGNyc6IDI3OTMuODMsXHJcbiAgICAnRiM3JzogMjk1OS45NixcclxuICAgICdHYjcnOiAyOTU5Ljk2LFxyXG4gICAgJ0c3JzogMzEzNS45NixcclxuICAgICdHIzcnOiAzMzIyLjQ0LFxyXG4gICAgJ0FiNyc6IDMzMjIuNDQsXHJcbiAgICAnQTcnOiAzNTIwLjAwLFxyXG4gICAgJ0EjNyc6IDM3MjkuMzEsXHJcbiAgICAnQmI3JzogMzcyOS4zMSxcclxuICAgICdCNyc6IDM5NTEuMDcsXHJcbiAgICAnQzgnOiA0MTg2LjAxXHJcbn07XHJcblxyXG59LHt9XX0se30sWzZdKVxyXG4oNilcclxufSk7IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHtcbiAgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgYXJyMltpXSA9IGFycltpXTtcbiAgfVxuXG4gIHJldHVybiBhcnIyO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9hcnJheVdpdGhIb2xlcyhhcnIpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgcmV0dXJuIGFycjtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHtcbiAgaWYgKHNlbGYgPT09IHZvaWQgMCkge1xuICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTtcbiAgfVxuXG4gIHJldHVybiBzZWxmO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59IiwiZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gIGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgcmV0dXJuIENvbnN0cnVjdG9yO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSBpbiBvYmopIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9ialtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7XG4gIF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7XG4gICAgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTtcbiAgfTtcbiAgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTtcbn0iLCJpbXBvcnQgc2V0UHJvdG90eXBlT2YgZnJvbSBcIi4vc2V0UHJvdG90eXBlT2ZcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykge1xuICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpO1xuICB9XG5cbiAgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBzdWJDbGFzcyxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgaWYgKHN1cGVyQ2xhc3MpIHNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB7XG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSBcInVuZGVmaW5lZFwiIHx8ICEoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChhcnIpKSkgcmV0dXJuO1xuICB2YXIgX2FyciA9IFtdO1xuICB2YXIgX24gPSB0cnVlO1xuICB2YXIgX2QgPSBmYWxzZTtcbiAgdmFyIF9lID0gdW5kZWZpbmVkO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkge1xuICAgICAgX2Fyci5wdXNoKF9zLnZhbHVlKTtcblxuICAgICAgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgX2QgPSB0cnVlO1xuICAgIF9lID0gZXJyO1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdICE9IG51bGwpIF9pW1wicmV0dXJuXCJdKCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChfZCkgdGhyb3cgX2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIF9hcnI7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX25vbkl0ZXJhYmxlUmVzdCgpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTtcbn0iLCJpbXBvcnQgX3R5cGVvZiBmcm9tIFwiLi4vLi4vaGVscGVycy9lc20vdHlwZW9mXCI7XG5pbXBvcnQgYXNzZXJ0VGhpc0luaXRpYWxpemVkIGZyb20gXCIuL2Fzc2VydFRoaXNJbml0aWFsaXplZFwiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkge1xuICBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkge1xuICAgIHJldHVybiBjYWxsO1xuICB9XG5cbiAgcmV0dXJuIGFzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkge1xuICBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHtcbiAgICBvLl9fcHJvdG9fXyA9IHA7XG4gICAgcmV0dXJuIG87XG4gIH07XG5cbiAgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTtcbn0iLCJpbXBvcnQgYXJyYXlXaXRoSG9sZXMgZnJvbSBcIi4vYXJyYXlXaXRoSG9sZXNcIjtcbmltcG9ydCBpdGVyYWJsZVRvQXJyYXlMaW1pdCBmcm9tIFwiLi9pdGVyYWJsZVRvQXJyYXlMaW1pdFwiO1xuaW1wb3J0IHVuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5IGZyb20gXCIuL3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5XCI7XG5pbXBvcnQgbm9uSXRlcmFibGVSZXN0IGZyb20gXCIuL25vbkl0ZXJhYmxlUmVzdFwiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX3NsaWNlZFRvQXJyYXkoYXJyLCBpKSB7XG4gIHJldHVybiBhcnJheVdpdGhIb2xlcyhhcnIpIHx8IGl0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkgfHwgdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkoYXJyLCBpKSB8fCBub25JdGVyYWJsZVJlc3QoKTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7XG5cbiAgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7XG4gICAgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iajtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBfdHlwZW9mKG9iaik7XG59IiwiaW1wb3J0IGFycmF5TGlrZVRvQXJyYXkgZnJvbSBcIi4vYXJyYXlMaWtlVG9BcnJheVwiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikge1xuICBpZiAoIW8pIHJldHVybjtcbiAgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xuICB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7XG4gIGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7XG4gIGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pO1xuICBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIGFycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL2F4aW9zJyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgc2V0dGxlID0gcmVxdWlyZSgnLi8uLi9jb3JlL3NldHRsZScpO1xudmFyIGJ1aWxkVVJMID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2J1aWxkVVJMJyk7XG52YXIgYnVpbGRGdWxsUGF0aCA9IHJlcXVpcmUoJy4uL2NvcmUvYnVpbGRGdWxsUGF0aCcpO1xudmFyIHBhcnNlSGVhZGVycyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9wYXJzZUhlYWRlcnMnKTtcbnZhciBpc1VSTFNhbWVPcmlnaW4gPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luJyk7XG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuLi9jb3JlL2NyZWF0ZUVycm9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24geGhyQWRhcHRlcihjb25maWcpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIGRpc3BhdGNoWGhyUmVxdWVzdChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVxdWVzdERhdGEgPSBjb25maWcuZGF0YTtcbiAgICB2YXIgcmVxdWVzdEhlYWRlcnMgPSBjb25maWcuaGVhZGVycztcblxuICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKHJlcXVlc3REYXRhKSkge1xuICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzWydDb250ZW50LVR5cGUnXTsgLy8gTGV0IHRoZSBicm93c2VyIHNldCBpdFxuICAgIH1cblxuICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAvLyBIVFRQIGJhc2ljIGF1dGhlbnRpY2F0aW9uXG4gICAgaWYgKGNvbmZpZy5hdXRoKSB7XG4gICAgICB2YXIgdXNlcm5hbWUgPSBjb25maWcuYXV0aC51c2VybmFtZSB8fCAnJztcbiAgICAgIHZhciBwYXNzd29yZCA9IGNvbmZpZy5hdXRoLnBhc3N3b3JkIHx8ICcnO1xuICAgICAgcmVxdWVzdEhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdCYXNpYyAnICsgYnRvYSh1c2VybmFtZSArICc6JyArIHBhc3N3b3JkKTtcbiAgICB9XG5cbiAgICB2YXIgZnVsbFBhdGggPSBidWlsZEZ1bGxQYXRoKGNvbmZpZy5iYXNlVVJMLCBjb25maWcudXJsKTtcbiAgICByZXF1ZXN0Lm9wZW4oY29uZmlnLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCBidWlsZFVSTChmdWxsUGF0aCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpLCB0cnVlKTtcblxuICAgIC8vIFNldCB0aGUgcmVxdWVzdCB0aW1lb3V0IGluIE1TXG4gICAgcmVxdWVzdC50aW1lb3V0ID0gY29uZmlnLnRpbWVvdXQ7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHJlYWR5IHN0YXRlXG4gICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiBoYW5kbGVMb2FkKCkge1xuICAgICAgaWYgKCFyZXF1ZXN0IHx8IHJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSByZXF1ZXN0IGVycm9yZWQgb3V0IGFuZCB3ZSBkaWRuJ3QgZ2V0IGEgcmVzcG9uc2UsIHRoaXMgd2lsbCBiZVxuICAgICAgLy8gaGFuZGxlZCBieSBvbmVycm9yIGluc3RlYWRcbiAgICAgIC8vIFdpdGggb25lIGV4Y2VwdGlvbjogcmVxdWVzdCB0aGF0IHVzaW5nIGZpbGU6IHByb3RvY29sLCBtb3N0IGJyb3dzZXJzXG4gICAgICAvLyB3aWxsIHJldHVybiBzdGF0dXMgYXMgMCBldmVuIHRob3VnaCBpdCdzIGEgc3VjY2Vzc2Z1bCByZXF1ZXN0XG4gICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT09IDAgJiYgIShyZXF1ZXN0LnJlc3BvbnNlVVJMICYmIHJlcXVlc3QucmVzcG9uc2VVUkwuaW5kZXhPZignZmlsZTonKSA9PT0gMCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmVwYXJlIHRoZSByZXNwb25zZVxuICAgICAgdmFyIHJlc3BvbnNlSGVhZGVycyA9ICdnZXRBbGxSZXNwb25zZUhlYWRlcnMnIGluIHJlcXVlc3QgPyBwYXJzZUhlYWRlcnMocmVxdWVzdC5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkgOiBudWxsO1xuICAgICAgdmFyIHJlc3BvbnNlRGF0YSA9ICFjb25maWcucmVzcG9uc2VUeXBlIHx8IGNvbmZpZy5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JyA/IHJlcXVlc3QucmVzcG9uc2VUZXh0IDogcmVxdWVzdC5yZXNwb25zZTtcbiAgICAgIHZhciByZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuICAgICAgICBzdGF0dXM6IHJlcXVlc3Quc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiByZXF1ZXN0LnN0YXR1c1RleHQsXG4gICAgICAgIGhlYWRlcnM6IHJlc3BvbnNlSGVhZGVycyxcbiAgICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICAgIHJlcXVlc3Q6IHJlcXVlc3RcbiAgICAgIH07XG5cbiAgICAgIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSBicm93c2VyIHJlcXVlc3QgY2FuY2VsbGF0aW9uIChhcyBvcHBvc2VkIHRvIGEgbWFudWFsIGNhbmNlbGxhdGlvbilcbiAgICByZXF1ZXN0Lm9uYWJvcnQgPSBmdW5jdGlvbiBoYW5kbGVBYm9ydCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcignUmVxdWVzdCBhYm9ydGVkJywgY29uZmlnLCAnRUNPTk5BQk9SVEVEJywgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIGxvdyBsZXZlbCBuZXR3b3JrIGVycm9yc1xuICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uIGhhbmRsZUVycm9yKCkge1xuICAgICAgLy8gUmVhbCBlcnJvcnMgYXJlIGhpZGRlbiBmcm9tIHVzIGJ5IHRoZSBicm93c2VyXG4gICAgICAvLyBvbmVycm9yIHNob3VsZCBvbmx5IGZpcmUgaWYgaXQncyBhIG5ldHdvcmsgZXJyb3JcbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcignTmV0d29yayBFcnJvcicsIGNvbmZpZywgbnVsbCwgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIHRpbWVvdXRcbiAgICByZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7XG4gICAgICB2YXIgdGltZW91dEVycm9yTWVzc2FnZSA9ICd0aW1lb3V0IG9mICcgKyBjb25maWcudGltZW91dCArICdtcyBleGNlZWRlZCc7XG4gICAgICBpZiAoY29uZmlnLnRpbWVvdXRFcnJvck1lc3NhZ2UpIHtcbiAgICAgICAgdGltZW91dEVycm9yTWVzc2FnZSA9IGNvbmZpZy50aW1lb3V0RXJyb3JNZXNzYWdlO1xuICAgICAgfVxuICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKHRpbWVvdXRFcnJvck1lc3NhZ2UsIGNvbmZpZywgJ0VDT05OQUJPUlRFRCcsXG4gICAgICAgIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgIC8vIFRoaXMgaXMgb25seSBkb25lIGlmIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50LlxuICAgIC8vIFNwZWNpZmljYWxseSBub3QgaWYgd2UncmUgaW4gYSB3ZWIgd29ya2VyLCBvciByZWFjdC1uYXRpdmUuXG4gICAgaWYgKHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkpIHtcbiAgICAgIHZhciBjb29raWVzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2Nvb2tpZXMnKTtcblxuICAgICAgLy8gQWRkIHhzcmYgaGVhZGVyXG4gICAgICB2YXIgeHNyZlZhbHVlID0gKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMgfHwgaXNVUkxTYW1lT3JpZ2luKGZ1bGxQYXRoKSkgJiYgY29uZmlnLnhzcmZDb29raWVOYW1lID9cbiAgICAgICAgY29va2llcy5yZWFkKGNvbmZpZy54c3JmQ29va2llTmFtZSkgOlxuICAgICAgICB1bmRlZmluZWQ7XG5cbiAgICAgIGlmICh4c3JmVmFsdWUpIHtcbiAgICAgICAgcmVxdWVzdEhlYWRlcnNbY29uZmlnLnhzcmZIZWFkZXJOYW1lXSA9IHhzcmZWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBZGQgaGVhZGVycyB0byB0aGUgcmVxdWVzdFxuICAgIGlmICgnc2V0UmVxdWVzdEhlYWRlcicgaW4gcmVxdWVzdCkge1xuICAgICAgdXRpbHMuZm9yRWFjaChyZXF1ZXN0SGVhZGVycywgZnVuY3Rpb24gc2V0UmVxdWVzdEhlYWRlcih2YWwsIGtleSkge1xuICAgICAgICBpZiAodHlwZW9mIHJlcXVlc3REYXRhID09PSAndW5kZWZpbmVkJyAmJiBrZXkudG9Mb3dlckNhc2UoKSA9PT0gJ2NvbnRlbnQtdHlwZScpIHtcbiAgICAgICAgICAvLyBSZW1vdmUgQ29udGVudC1UeXBlIGlmIGRhdGEgaXMgdW5kZWZpbmVkXG4gICAgICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzW2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gT3RoZXJ3aXNlIGFkZCBoZWFkZXIgdG8gdGhlIHJlcXVlc3RcbiAgICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoa2V5LCB2YWwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBBZGQgd2l0aENyZWRlbnRpYWxzIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcud2l0aENyZWRlbnRpYWxzKSkge1xuICAgICAgcmVxdWVzdC53aXRoQ3JlZGVudGlhbHMgPSAhIWNvbmZpZy53aXRoQ3JlZGVudGlhbHM7XG4gICAgfVxuXG4gICAgLy8gQWRkIHJlc3BvbnNlVHlwZSB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9IGNvbmZpZy5yZXNwb25zZVR5cGU7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIEV4cGVjdGVkIERPTUV4Y2VwdGlvbiB0aHJvd24gYnkgYnJvd3NlcnMgbm90IGNvbXBhdGlibGUgWE1MSHR0cFJlcXVlc3QgTGV2ZWwgMi5cbiAgICAgICAgLy8gQnV0LCB0aGlzIGNhbiBiZSBzdXBwcmVzc2VkIGZvciAnanNvbicgdHlwZSBhcyBpdCBjYW4gYmUgcGFyc2VkIGJ5IGRlZmF1bHQgJ3RyYW5zZm9ybVJlc3BvbnNlJyBmdW5jdGlvbi5cbiAgICAgICAgaWYgKGNvbmZpZy5yZXNwb25zZVR5cGUgIT09ICdqc29uJykge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgcHJvZ3Jlc3MgaWYgbmVlZGVkXG4gICAgaWYgKHR5cGVvZiBjb25maWcub25Eb3dubG9hZFByb2dyZXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgLy8gTm90IGFsbCBicm93c2VycyBzdXBwb3J0IHVwbG9hZCBldmVudHNcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5vblVwbG9hZFByb2dyZXNzID09PSAnZnVuY3Rpb24nICYmIHJlcXVlc3QudXBsb2FkKSB7XG4gICAgICByZXF1ZXN0LnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vblVwbG9hZFByb2dyZXNzKTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgICAvLyBIYW5kbGUgY2FuY2VsbGF0aW9uXG4gICAgICBjb25maWcuY2FuY2VsVG9rZW4ucHJvbWlzZS50aGVuKGZ1bmN0aW9uIG9uQ2FuY2VsZWQoY2FuY2VsKSB7XG4gICAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcXVlc3QuYWJvcnQoKTtcbiAgICAgICAgcmVqZWN0KGNhbmNlbCk7XG4gICAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAocmVxdWVzdERhdGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmVxdWVzdERhdGEgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIFNlbmQgdGhlIHJlcXVlc3RcbiAgICByZXF1ZXN0LnNlbmQocmVxdWVzdERhdGEpO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBiaW5kID0gcmVxdWlyZSgnLi9oZWxwZXJzL2JpbmQnKTtcbnZhciBBeGlvcyA9IHJlcXVpcmUoJy4vY29yZS9BeGlvcycpO1xudmFyIG1lcmdlQ29uZmlnID0gcmVxdWlyZSgnLi9jb3JlL21lcmdlQ29uZmlnJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuL2RlZmF1bHRzJyk7XG5cbi8qKlxuICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIEF4aW9zXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGRlZmF1bHRDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqIEByZXR1cm4ge0F4aW9zfSBBIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICovXG5mdW5jdGlvbiBjcmVhdGVJbnN0YW5jZShkZWZhdWx0Q29uZmlnKSB7XG4gIHZhciBjb250ZXh0ID0gbmV3IEF4aW9zKGRlZmF1bHRDb25maWcpO1xuICB2YXIgaW5zdGFuY2UgPSBiaW5kKEF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0LCBjb250ZXh0KTtcblxuICAvLyBDb3B5IGF4aW9zLnByb3RvdHlwZSB0byBpbnN0YW5jZVxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIEF4aW9zLnByb3RvdHlwZSwgY29udGV4dCk7XG5cbiAgLy8gQ29weSBjb250ZXh0IHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgY29udGV4dCk7XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufVxuXG4vLyBDcmVhdGUgdGhlIGRlZmF1bHQgaW5zdGFuY2UgdG8gYmUgZXhwb3J0ZWRcbnZhciBheGlvcyA9IGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRzKTtcblxuLy8gRXhwb3NlIEF4aW9zIGNsYXNzIHRvIGFsbG93IGNsYXNzIGluaGVyaXRhbmNlXG5heGlvcy5BeGlvcyA9IEF4aW9zO1xuXG4vLyBGYWN0b3J5IGZvciBjcmVhdGluZyBuZXcgaW5zdGFuY2VzXG5heGlvcy5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaW5zdGFuY2VDb25maWcpIHtcbiAgcmV0dXJuIGNyZWF0ZUluc3RhbmNlKG1lcmdlQ29uZmlnKGF4aW9zLmRlZmF1bHRzLCBpbnN0YW5jZUNvbmZpZykpO1xufTtcblxuLy8gRXhwb3NlIENhbmNlbCAmIENhbmNlbFRva2VuXG5heGlvcy5DYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWwnKTtcbmF4aW9zLkNhbmNlbFRva2VuID0gcmVxdWlyZSgnLi9jYW5jZWwvQ2FuY2VsVG9rZW4nKTtcbmF4aW9zLmlzQ2FuY2VsID0gcmVxdWlyZSgnLi9jYW5jZWwvaXNDYW5jZWwnKTtcblxuLy8gRXhwb3NlIGFsbC9zcHJlYWRcbmF4aW9zLmFsbCA9IGZ1bmN0aW9uIGFsbChwcm9taXNlcykge1xuICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufTtcbmF4aW9zLnNwcmVhZCA9IHJlcXVpcmUoJy4vaGVscGVycy9zcHJlYWQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBheGlvcztcblxuLy8gQWxsb3cgdXNlIG9mIGRlZmF1bHQgaW1wb3J0IHN5bnRheCBpbiBUeXBlU2NyaXB0XG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gYXhpb3M7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQSBgQ2FuY2VsYCBpcyBhbiBvYmplY3QgdGhhdCBpcyB0aHJvd24gd2hlbiBhbiBvcGVyYXRpb24gaXMgY2FuY2VsZWQuXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0ge3N0cmluZz19IG1lc3NhZ2UgVGhlIG1lc3NhZ2UuXG4gKi9cbmZ1bmN0aW9uIENhbmNlbChtZXNzYWdlKSB7XG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG59XG5cbkNhbmNlbC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgcmV0dXJuICdDYW5jZWwnICsgKHRoaXMubWVzc2FnZSA/ICc6ICcgKyB0aGlzLm1lc3NhZ2UgOiAnJyk7XG59O1xuXG5DYW5jZWwucHJvdG90eXBlLl9fQ0FOQ0VMX18gPSB0cnVlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhbmNlbDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIENhbmNlbCA9IHJlcXVpcmUoJy4vQ2FuY2VsJyk7XG5cbi8qKlxuICogQSBgQ2FuY2VsVG9rZW5gIGlzIGFuIG9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlcXVlc3QgY2FuY2VsbGF0aW9uIG9mIGFuIG9wZXJhdGlvbi5cbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGV4ZWN1dG9yIFRoZSBleGVjdXRvciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2FuY2VsVG9rZW4oZXhlY3V0b3IpIHtcbiAgaWYgKHR5cGVvZiBleGVjdXRvciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2V4ZWN1dG9yIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcbiAgfVxuXG4gIHZhciByZXNvbHZlUHJvbWlzZTtcbiAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gcHJvbWlzZUV4ZWN1dG9yKHJlc29sdmUpIHtcbiAgICByZXNvbHZlUHJvbWlzZSA9IHJlc29sdmU7XG4gIH0pO1xuXG4gIHZhciB0b2tlbiA9IHRoaXM7XG4gIGV4ZWN1dG9yKGZ1bmN0aW9uIGNhbmNlbChtZXNzYWdlKSB7XG4gICAgaWYgKHRva2VuLnJlYXNvbikge1xuICAgICAgLy8gQ2FuY2VsbGF0aW9uIGhhcyBhbHJlYWR5IGJlZW4gcmVxdWVzdGVkXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdG9rZW4ucmVhc29uID0gbmV3IENhbmNlbChtZXNzYWdlKTtcbiAgICByZXNvbHZlUHJvbWlzZSh0b2tlbi5yZWFzb24pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICovXG5DYW5jZWxUb2tlbi5wcm90b3R5cGUudGhyb3dJZlJlcXVlc3RlZCA9IGZ1bmN0aW9uIHRocm93SWZSZXF1ZXN0ZWQoKSB7XG4gIGlmICh0aGlzLnJlYXNvbikge1xuICAgIHRocm93IHRoaXMucmVhc29uO1xuICB9XG59O1xuXG4vKipcbiAqIFJldHVybnMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgYSBuZXcgYENhbmNlbFRva2VuYCBhbmQgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGNhbGxlZCxcbiAqIGNhbmNlbHMgdGhlIGBDYW5jZWxUb2tlbmAuXG4gKi9cbkNhbmNlbFRva2VuLnNvdXJjZSA9IGZ1bmN0aW9uIHNvdXJjZSgpIHtcbiAgdmFyIGNhbmNlbDtcbiAgdmFyIHRva2VuID0gbmV3IENhbmNlbFRva2VuKGZ1bmN0aW9uIGV4ZWN1dG9yKGMpIHtcbiAgICBjYW5jZWwgPSBjO1xuICB9KTtcbiAgcmV0dXJuIHtcbiAgICB0b2tlbjogdG9rZW4sXG4gICAgY2FuY2VsOiBjYW5jZWxcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FuY2VsVG9rZW47XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNDYW5jZWwodmFsdWUpIHtcbiAgcmV0dXJuICEhKHZhbHVlICYmIHZhbHVlLl9fQ0FOQ0VMX18pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIGJ1aWxkVVJMID0gcmVxdWlyZSgnLi4vaGVscGVycy9idWlsZFVSTCcpO1xudmFyIEludGVyY2VwdG9yTWFuYWdlciA9IHJlcXVpcmUoJy4vSW50ZXJjZXB0b3JNYW5hZ2VyJyk7XG52YXIgZGlzcGF0Y2hSZXF1ZXN0ID0gcmVxdWlyZSgnLi9kaXNwYXRjaFJlcXVlc3QnKTtcbnZhciBtZXJnZUNvbmZpZyA9IHJlcXVpcmUoJy4vbWVyZ2VDb25maWcnKTtcblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqL1xuZnVuY3Rpb24gQXhpb3MoaW5zdGFuY2VDb25maWcpIHtcbiAgdGhpcy5kZWZhdWx0cyA9IGluc3RhbmNlQ29uZmlnO1xuICB0aGlzLmludGVyY2VwdG9ycyA9IHtcbiAgICByZXF1ZXN0OiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKCksXG4gICAgcmVzcG9uc2U6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKVxuICB9O1xufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyBzcGVjaWZpYyBmb3IgdGhpcyByZXF1ZXN0IChtZXJnZWQgd2l0aCB0aGlzLmRlZmF1bHRzKVxuICovXG5BeGlvcy5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uIHJlcXVlc3QoY29uZmlnKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAvLyBBbGxvdyBmb3IgYXhpb3MoJ2V4YW1wbGUvdXJsJ1ssIGNvbmZpZ10pIGEgbGEgZmV0Y2ggQVBJXG4gIGlmICh0eXBlb2YgY29uZmlnID09PSAnc3RyaW5nJykge1xuICAgIGNvbmZpZyA9IGFyZ3VtZW50c1sxXSB8fCB7fTtcbiAgICBjb25maWcudXJsID0gYXJndW1lbnRzWzBdO1xuICB9IGVsc2Uge1xuICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgfVxuXG4gIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG5cbiAgLy8gU2V0IGNvbmZpZy5tZXRob2RcbiAgaWYgKGNvbmZpZy5tZXRob2QpIHtcbiAgICBjb25maWcubWV0aG9kID0gY29uZmlnLm1ldGhvZC50b0xvd2VyQ2FzZSgpO1xuICB9IGVsc2UgaWYgKHRoaXMuZGVmYXVsdHMubWV0aG9kKSB7XG4gICAgY29uZmlnLm1ldGhvZCA9IHRoaXMuZGVmYXVsdHMubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG4gIH0gZWxzZSB7XG4gICAgY29uZmlnLm1ldGhvZCA9ICdnZXQnO1xuICB9XG5cbiAgLy8gSG9vayB1cCBpbnRlcmNlcHRvcnMgbWlkZGxld2FyZVxuICB2YXIgY2hhaW4gPSBbZGlzcGF0Y2hSZXF1ZXN0LCB1bmRlZmluZWRdO1xuICB2YXIgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShjb25maWcpO1xuXG4gIHRoaXMuaW50ZXJjZXB0b3JzLnJlcXVlc3QuZm9yRWFjaChmdW5jdGlvbiB1bnNoaWZ0UmVxdWVzdEludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgIGNoYWluLnVuc2hpZnQoaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gIH0pO1xuXG4gIHRoaXMuaW50ZXJjZXB0b3JzLnJlc3BvbnNlLmZvckVhY2goZnVuY3Rpb24gcHVzaFJlc3BvbnNlSW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgY2hhaW4ucHVzaChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgd2hpbGUgKGNoYWluLmxlbmd0aCkge1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oY2hhaW4uc2hpZnQoKSwgY2hhaW4uc2hpZnQoKSk7XG4gIH1cblxuICByZXR1cm4gcHJvbWlzZTtcbn07XG5cbkF4aW9zLnByb3RvdHlwZS5nZXRVcmkgPSBmdW5jdGlvbiBnZXRVcmkoY29uZmlnKSB7XG4gIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG4gIHJldHVybiBidWlsZFVSTChjb25maWcudXJsLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplcikucmVwbGFjZSgvXlxcPy8sICcnKTtcbn07XG5cbi8vIFByb3ZpZGUgYWxpYXNlcyBmb3Igc3VwcG9ydGVkIHJlcXVlc3QgbWV0aG9kc1xudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdvcHRpb25zJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KHV0aWxzLm1lcmdlKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybFxuICAgIH0pKTtcbiAgfTtcbn0pO1xuXG51dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgY29uZmlnKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdCh1dGlscy5tZXJnZShjb25maWcgfHwge30sIHtcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSkpO1xuICB9O1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQXhpb3M7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gSW50ZXJjZXB0b3JNYW5hZ2VyKCkge1xuICB0aGlzLmhhbmRsZXJzID0gW107XG59XG5cbi8qKlxuICogQWRkIGEgbmV3IGludGVyY2VwdG9yIHRvIHRoZSBzdGFja1xuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bGZpbGxlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGB0aGVuYCBmb3IgYSBgUHJvbWlzZWBcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHJlamVjdGAgZm9yIGEgYFByb21pc2VgXG4gKlxuICogQHJldHVybiB7TnVtYmVyfSBBbiBJRCB1c2VkIHRvIHJlbW92ZSBpbnRlcmNlcHRvciBsYXRlclxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uIHVzZShmdWxmaWxsZWQsIHJlamVjdGVkKSB7XG4gIHRoaXMuaGFuZGxlcnMucHVzaCh7XG4gICAgZnVsZmlsbGVkOiBmdWxmaWxsZWQsXG4gICAgcmVqZWN0ZWQ6IHJlamVjdGVkXG4gIH0pO1xuICByZXR1cm4gdGhpcy5oYW5kbGVycy5sZW5ndGggLSAxO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYW4gaW50ZXJjZXB0b3IgZnJvbSB0aGUgc3RhY2tcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gaWQgVGhlIElEIHRoYXQgd2FzIHJldHVybmVkIGJ5IGB1c2VgXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZWplY3QgPSBmdW5jdGlvbiBlamVjdChpZCkge1xuICBpZiAodGhpcy5oYW5kbGVyc1tpZF0pIHtcbiAgICB0aGlzLmhhbmRsZXJzW2lkXSA9IG51bGw7XG4gIH1cbn07XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFsbCB0aGUgcmVnaXN0ZXJlZCBpbnRlcmNlcHRvcnNcbiAqXG4gKiBUaGlzIG1ldGhvZCBpcyBwYXJ0aWN1bGFybHkgdXNlZnVsIGZvciBza2lwcGluZyBvdmVyIGFueVxuICogaW50ZXJjZXB0b3JzIHRoYXQgbWF5IGhhdmUgYmVjb21lIGBudWxsYCBjYWxsaW5nIGBlamVjdGAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggaW50ZXJjZXB0b3JcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gZm9yRWFjaChmbikge1xuICB1dGlscy5mb3JFYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uIGZvckVhY2hIYW5kbGVyKGgpIHtcbiAgICBpZiAoaCAhPT0gbnVsbCkge1xuICAgICAgZm4oaCk7XG4gICAgfVxuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJjZXB0b3JNYW5hZ2VyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNBYnNvbHV0ZVVSTCA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTCcpO1xudmFyIGNvbWJpbmVVUkxzID0gcmVxdWlyZSgnLi4vaGVscGVycy9jb21iaW5lVVJMcycpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgYmFzZVVSTCB3aXRoIHRoZSByZXF1ZXN0ZWRVUkwsXG4gKiBvbmx5IHdoZW4gdGhlIHJlcXVlc3RlZFVSTCBpcyBub3QgYWxyZWFkeSBhbiBhYnNvbHV0ZSBVUkwuXG4gKiBJZiB0aGUgcmVxdWVzdFVSTCBpcyBhYnNvbHV0ZSwgdGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSByZXF1ZXN0ZWRVUkwgdW50b3VjaGVkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVVJMIFRoZSBiYXNlIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHJlcXVlc3RlZFVSTCBBYnNvbHV0ZSBvciByZWxhdGl2ZSBVUkwgdG8gY29tYmluZVxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIGZ1bGwgcGF0aFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkRnVsbFBhdGgoYmFzZVVSTCwgcmVxdWVzdGVkVVJMKSB7XG4gIGlmIChiYXNlVVJMICYmICFpc0Fic29sdXRlVVJMKHJlcXVlc3RlZFVSTCkpIHtcbiAgICByZXR1cm4gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVxdWVzdGVkVVJMKTtcbiAgfVxuICByZXR1cm4gcmVxdWVzdGVkVVJMO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGVuaGFuY2VFcnJvciA9IHJlcXVpcmUoJy4vZW5oYW5jZUVycm9yJyk7XG5cbi8qKlxuICogQ3JlYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBtZXNzYWdlLCBjb25maWcsIGVycm9yIGNvZGUsIHJlcXVlc3QgYW5kIHJlc3BvbnNlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFRoZSBlcnJvciBtZXNzYWdlLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVxdWVzdF0gVGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW3Jlc3BvbnNlXSBUaGUgcmVzcG9uc2UuXG4gKiBAcmV0dXJucyB7RXJyb3J9IFRoZSBjcmVhdGVkIGVycm9yLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUVycm9yKG1lc3NhZ2UsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgdmFyIGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICByZXR1cm4gZW5oYW5jZUVycm9yKGVycm9yLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciB0cmFuc2Zvcm1EYXRhID0gcmVxdWlyZSgnLi90cmFuc2Zvcm1EYXRhJyk7XG52YXIgaXNDYW5jZWwgPSByZXF1aXJlKCcuLi9jYW5jZWwvaXNDYW5jZWwnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4uL2RlZmF1bHRzJyk7XG5cbi8qKlxuICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqL1xuZnVuY3Rpb24gdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpIHtcbiAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgIGNvbmZpZy5jYW5jZWxUb2tlbi50aHJvd0lmUmVxdWVzdGVkKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciB1c2luZyB0aGUgY29uZmlndXJlZCBhZGFwdGVyLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyB0aGF0IGlzIHRvIGJlIHVzZWQgZm9yIHRoZSByZXF1ZXN0XG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gVGhlIFByb21pc2UgdG8gYmUgZnVsZmlsbGVkXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGlzcGF0Y2hSZXF1ZXN0KGNvbmZpZykge1xuICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgLy8gRW5zdXJlIGhlYWRlcnMgZXhpc3RcbiAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcblxuICAvLyBUcmFuc2Zvcm0gcmVxdWVzdCBkYXRhXG4gIGNvbmZpZy5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICBjb25maWcuZGF0YSxcbiAgICBjb25maWcuaGVhZGVycyxcbiAgICBjb25maWcudHJhbnNmb3JtUmVxdWVzdFxuICApO1xuXG4gIC8vIEZsYXR0ZW4gaGVhZGVyc1xuICBjb25maWcuaGVhZGVycyA9IHV0aWxzLm1lcmdlKFxuICAgIGNvbmZpZy5oZWFkZXJzLmNvbW1vbiB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVyc1tjb25maWcubWV0aG9kXSB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVyc1xuICApO1xuXG4gIHV0aWxzLmZvckVhY2goXG4gICAgWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnY29tbW9uJ10sXG4gICAgZnVuY3Rpb24gY2xlYW5IZWFkZXJDb25maWcobWV0aG9kKSB7XG4gICAgICBkZWxldGUgY29uZmlnLmhlYWRlcnNbbWV0aG9kXTtcbiAgICB9XG4gICk7XG5cbiAgdmFyIGFkYXB0ZXIgPSBjb25maWcuYWRhcHRlciB8fCBkZWZhdWx0cy5hZGFwdGVyO1xuXG4gIHJldHVybiBhZGFwdGVyKGNvbmZpZykudGhlbihmdW5jdGlvbiBvbkFkYXB0ZXJSZXNvbHV0aW9uKHJlc3BvbnNlKSB7XG4gICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICByZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICAgIHJlc3BvbnNlLmRhdGEsXG4gICAgICByZXNwb25zZS5oZWFkZXJzLFxuICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgKTtcblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfSwgZnVuY3Rpb24gb25BZGFwdGVyUmVqZWN0aW9uKHJlYXNvbikge1xuICAgIGlmICghaXNDYW5jZWwocmVhc29uKSkge1xuICAgICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgICAgaWYgKHJlYXNvbiAmJiByZWFzb24ucmVzcG9uc2UpIHtcbiAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhLFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5oZWFkZXJzLFxuICAgICAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZWFzb24pO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVXBkYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBjb25maWcsIGVycm9yIGNvZGUsIGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJvciBUaGUgZXJyb3IgdG8gdXBkYXRlLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVxdWVzdF0gVGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW3Jlc3BvbnNlXSBUaGUgcmVzcG9uc2UuXG4gKiBAcmV0dXJucyB7RXJyb3J9IFRoZSBlcnJvci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlbmhhbmNlRXJyb3IoZXJyb3IsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgZXJyb3IuY29uZmlnID0gY29uZmlnO1xuICBpZiAoY29kZSkge1xuICAgIGVycm9yLmNvZGUgPSBjb2RlO1xuICB9XG5cbiAgZXJyb3IucmVxdWVzdCA9IHJlcXVlc3Q7XG4gIGVycm9yLnJlc3BvbnNlID0gcmVzcG9uc2U7XG4gIGVycm9yLmlzQXhpb3NFcnJvciA9IHRydWU7XG5cbiAgZXJyb3IudG9KU09OID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIFN0YW5kYXJkXG4gICAgICBtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsXG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICAvLyBNaWNyb3NvZnRcbiAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgICAgbnVtYmVyOiB0aGlzLm51bWJlcixcbiAgICAgIC8vIE1vemlsbGFcbiAgICAgIGZpbGVOYW1lOiB0aGlzLmZpbGVOYW1lLFxuICAgICAgbGluZU51bWJlcjogdGhpcy5saW5lTnVtYmVyLFxuICAgICAgY29sdW1uTnVtYmVyOiB0aGlzLmNvbHVtbk51bWJlcixcbiAgICAgIHN0YWNrOiB0aGlzLnN0YWNrLFxuICAgICAgLy8gQXhpb3NcbiAgICAgIGNvbmZpZzogdGhpcy5jb25maWcsXG4gICAgICBjb2RlOiB0aGlzLmNvZGVcbiAgICB9O1xuICB9O1xuICByZXR1cm4gZXJyb3I7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG4vKipcbiAqIENvbmZpZy1zcGVjaWZpYyBtZXJnZS1mdW5jdGlvbiB3aGljaCBjcmVhdGVzIGEgbmV3IGNvbmZpZy1vYmplY3RcbiAqIGJ5IG1lcmdpbmcgdHdvIGNvbmZpZ3VyYXRpb24gb2JqZWN0cyB0b2dldGhlci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnMVxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZzJcbiAqIEByZXR1cm5zIHtPYmplY3R9IE5ldyBvYmplY3QgcmVzdWx0aW5nIGZyb20gbWVyZ2luZyBjb25maWcyIHRvIGNvbmZpZzFcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtZXJnZUNvbmZpZyhjb25maWcxLCBjb25maWcyKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICBjb25maWcyID0gY29uZmlnMiB8fCB7fTtcbiAgdmFyIGNvbmZpZyA9IHt9O1xuXG4gIHZhciB2YWx1ZUZyb21Db25maWcyS2V5cyA9IFsndXJsJywgJ21ldGhvZCcsICdwYXJhbXMnLCAnZGF0YSddO1xuICB2YXIgbWVyZ2VEZWVwUHJvcGVydGllc0tleXMgPSBbJ2hlYWRlcnMnLCAnYXV0aCcsICdwcm94eSddO1xuICB2YXIgZGVmYXVsdFRvQ29uZmlnMktleXMgPSBbXG4gICAgJ2Jhc2VVUkwnLCAndXJsJywgJ3RyYW5zZm9ybVJlcXVlc3QnLCAndHJhbnNmb3JtUmVzcG9uc2UnLCAncGFyYW1zU2VyaWFsaXplcicsXG4gICAgJ3RpbWVvdXQnLCAnd2l0aENyZWRlbnRpYWxzJywgJ2FkYXB0ZXInLCAncmVzcG9uc2VUeXBlJywgJ3hzcmZDb29raWVOYW1lJyxcbiAgICAneHNyZkhlYWRlck5hbWUnLCAnb25VcGxvYWRQcm9ncmVzcycsICdvbkRvd25sb2FkUHJvZ3Jlc3MnLFxuICAgICdtYXhDb250ZW50TGVuZ3RoJywgJ3ZhbGlkYXRlU3RhdHVzJywgJ21heFJlZGlyZWN0cycsICdodHRwQWdlbnQnLFxuICAgICdodHRwc0FnZW50JywgJ2NhbmNlbFRva2VuJywgJ3NvY2tldFBhdGgnXG4gIF07XG5cbiAgdXRpbHMuZm9yRWFjaCh2YWx1ZUZyb21Db25maWcyS2V5cywgZnVuY3Rpb24gdmFsdWVGcm9tQ29uZmlnMihwcm9wKSB7XG4gICAgaWYgKHR5cGVvZiBjb25maWcyW3Byb3BdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uZmlnW3Byb3BdID0gY29uZmlnMltwcm9wXTtcbiAgICB9XG4gIH0pO1xuXG4gIHV0aWxzLmZvckVhY2gobWVyZ2VEZWVwUHJvcGVydGllc0tleXMsIGZ1bmN0aW9uIG1lcmdlRGVlcFByb3BlcnRpZXMocHJvcCkge1xuICAgIGlmICh1dGlscy5pc09iamVjdChjb25maWcyW3Byb3BdKSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gdXRpbHMuZGVlcE1lcmdlKGNvbmZpZzFbcHJvcF0sIGNvbmZpZzJbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbmZpZzJbcHJvcF0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBjb25maWcyW3Byb3BdO1xuICAgIH0gZWxzZSBpZiAodXRpbHMuaXNPYmplY3QoY29uZmlnMVtwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IHV0aWxzLmRlZXBNZXJnZShjb25maWcxW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb25maWcxW3Byb3BdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uZmlnW3Byb3BdID0gY29uZmlnMVtwcm9wXTtcbiAgICB9XG4gIH0pO1xuXG4gIHV0aWxzLmZvckVhY2goZGVmYXVsdFRvQ29uZmlnMktleXMsIGZ1bmN0aW9uIGRlZmF1bHRUb0NvbmZpZzIocHJvcCkge1xuICAgIGlmICh0eXBlb2YgY29uZmlnMltwcm9wXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGNvbmZpZzJbcHJvcF07XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgY29uZmlnMVtwcm9wXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGNvbmZpZzFbcHJvcF07XG4gICAgfVxuICB9KTtcblxuICB2YXIgYXhpb3NLZXlzID0gdmFsdWVGcm9tQ29uZmlnMktleXNcbiAgICAuY29uY2F0KG1lcmdlRGVlcFByb3BlcnRpZXNLZXlzKVxuICAgIC5jb25jYXQoZGVmYXVsdFRvQ29uZmlnMktleXMpO1xuXG4gIHZhciBvdGhlcktleXMgPSBPYmplY3RcbiAgICAua2V5cyhjb25maWcyKVxuICAgIC5maWx0ZXIoZnVuY3Rpb24gZmlsdGVyQXhpb3NLZXlzKGtleSkge1xuICAgICAgcmV0dXJuIGF4aW9zS2V5cy5pbmRleE9mKGtleSkgPT09IC0xO1xuICAgIH0pO1xuXG4gIHV0aWxzLmZvckVhY2gob3RoZXJLZXlzLCBmdW5jdGlvbiBvdGhlcktleXNEZWZhdWx0VG9Db25maWcyKHByb3ApIHtcbiAgICBpZiAodHlwZW9mIGNvbmZpZzJbcHJvcF0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBjb25maWcyW3Byb3BdO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbmZpZzFbcHJvcF0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBjb25maWcxW3Byb3BdO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGNvbmZpZztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjcmVhdGVFcnJvciA9IHJlcXVpcmUoJy4vY3JlYXRlRXJyb3InKTtcblxuLyoqXG4gKiBSZXNvbHZlIG9yIHJlamVjdCBhIFByb21pc2UgYmFzZWQgb24gcmVzcG9uc2Ugc3RhdHVzLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlc29sdmUgQSBmdW5jdGlvbiB0aGF0IHJlc29sdmVzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0IEEgZnVuY3Rpb24gdGhhdCByZWplY3RzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtvYmplY3R9IHJlc3BvbnNlIFRoZSByZXNwb25zZS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSkge1xuICB2YXIgdmFsaWRhdGVTdGF0dXMgPSByZXNwb25zZS5jb25maWcudmFsaWRhdGVTdGF0dXM7XG4gIGlmICghdmFsaWRhdGVTdGF0dXMgfHwgdmFsaWRhdGVTdGF0dXMocmVzcG9uc2Uuc3RhdHVzKSkge1xuICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICB9IGVsc2Uge1xuICAgIHJlamVjdChjcmVhdGVFcnJvcihcbiAgICAgICdSZXF1ZXN0IGZhaWxlZCB3aXRoIHN0YXR1cyBjb2RlICcgKyByZXNwb25zZS5zdGF0dXMsXG4gICAgICByZXNwb25zZS5jb25maWcsXG4gICAgICBudWxsLFxuICAgICAgcmVzcG9uc2UucmVxdWVzdCxcbiAgICAgIHJlc3BvbnNlXG4gICAgKSk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuLyoqXG4gKiBUcmFuc2Zvcm0gdGhlIGRhdGEgZm9yIGEgcmVxdWVzdCBvciBhIHJlc3BvbnNlXG4gKlxuICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSBkYXRhIFRoZSBkYXRhIHRvIGJlIHRyYW5zZm9ybWVkXG4gKiBAcGFyYW0ge0FycmF5fSBoZWFkZXJzIFRoZSBoZWFkZXJzIGZvciB0aGUgcmVxdWVzdCBvciByZXNwb25zZVxuICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbn0gZm5zIEEgc2luZ2xlIGZ1bmN0aW9uIG9yIEFycmF5IG9mIGZ1bmN0aW9uc1xuICogQHJldHVybnMgeyp9IFRoZSByZXN1bHRpbmcgdHJhbnNmb3JtZWQgZGF0YVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyYW5zZm9ybURhdGEoZGF0YSwgaGVhZGVycywgZm5zKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICB1dGlscy5mb3JFYWNoKGZucywgZnVuY3Rpb24gdHJhbnNmb3JtKGZuKSB7XG4gICAgZGF0YSA9IGZuKGRhdGEsIGhlYWRlcnMpO1xuICB9KTtcblxuICByZXR1cm4gZGF0YTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBub3JtYWxpemVIZWFkZXJOYW1lID0gcmVxdWlyZSgnLi9oZWxwZXJzL25vcm1hbGl6ZUhlYWRlck5hbWUnKTtcblxudmFyIERFRkFVTFRfQ09OVEVOVF9UWVBFID0ge1xuICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbn07XG5cbmZ1bmN0aW9uIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCB2YWx1ZSkge1xuICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGhlYWRlcnMpICYmIHV0aWxzLmlzVW5kZWZpbmVkKGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddKSkge1xuICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gdmFsdWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0RGVmYXVsdEFkYXB0ZXIoKSB7XG4gIHZhciBhZGFwdGVyO1xuICBpZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICE9PSAndW5kZWZpbmVkJykge1xuICAgIC8vIEZvciBicm93c2VycyB1c2UgWEhSIGFkYXB0ZXJcbiAgICBhZGFwdGVyID0gcmVxdWlyZSgnLi9hZGFwdGVycy94aHInKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXScpIHtcbiAgICAvLyBGb3Igbm9kZSB1c2UgSFRUUCBhZGFwdGVyXG4gICAgYWRhcHRlciA9IHJlcXVpcmUoJy4vYWRhcHRlcnMvaHR0cCcpO1xuICB9XG4gIHJldHVybiBhZGFwdGVyO1xufVxuXG52YXIgZGVmYXVsdHMgPSB7XG4gIGFkYXB0ZXI6IGdldERlZmF1bHRBZGFwdGVyKCksXG5cbiAgdHJhbnNmb3JtUmVxdWVzdDogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlcXVlc3QoZGF0YSwgaGVhZGVycykge1xuICAgIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgJ0FjY2VwdCcpO1xuICAgIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgJ0NvbnRlbnQtVHlwZScpO1xuICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0FycmF5QnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0J1ZmZlcihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNTdHJlYW0oZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzRmlsZShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNCbG9iKGRhdGEpXG4gICAgKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzQXJyYXlCdWZmZXJWaWV3KGRhdGEpKSB7XG4gICAgICByZXR1cm4gZGF0YS5idWZmZXI7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhkYXRhKSkge1xuICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD11dGYtOCcpO1xuICAgICAgcmV0dXJuIGRhdGEudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzT2JqZWN0KGRhdGEpKSB7XG4gICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtOCcpO1xuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgdHJhbnNmb3JtUmVzcG9uc2U6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXNwb25zZShkYXRhKSB7XG4gICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICB9IGNhdGNoIChlKSB7IC8qIElnbm9yZSAqLyB9XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICAvKipcbiAgICogQSB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyB0byBhYm9ydCBhIHJlcXVlc3QuIElmIHNldCB0byAwIChkZWZhdWx0KSBhXG4gICAqIHRpbWVvdXQgaXMgbm90IGNyZWF0ZWQuXG4gICAqL1xuICB0aW1lb3V0OiAwLFxuXG4gIHhzcmZDb29raWVOYW1lOiAnWFNSRi1UT0tFTicsXG4gIHhzcmZIZWFkZXJOYW1lOiAnWC1YU1JGLVRPS0VOJyxcblxuICBtYXhDb250ZW50TGVuZ3RoOiAtMSxcblxuICB2YWxpZGF0ZVN0YXR1czogZnVuY3Rpb24gdmFsaWRhdGVTdGF0dXMoc3RhdHVzKSB7XG4gICAgcmV0dXJuIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwO1xuICB9XG59O1xuXG5kZWZhdWx0cy5oZWFkZXJzID0ge1xuICBjb21tb246IHtcbiAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKidcbiAgfVxufTtcblxudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB7fTtcbn0pO1xuXG51dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB1dGlscy5tZXJnZShERUZBVUxUX0NPTlRFTlRfVFlQRSk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0cztcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiaW5kKGZuLCB0aGlzQXJnKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKCkge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5mdW5jdGlvbiBlbmNvZGUodmFsKSB7XG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsKS5cbiAgICByZXBsYWNlKC8lNDAvZ2ksICdAJykuXG4gICAgcmVwbGFjZSgvJTNBL2dpLCAnOicpLlxuICAgIHJlcGxhY2UoLyUyNC9nLCAnJCcpLlxuICAgIHJlcGxhY2UoLyUyQy9naSwgJywnKS5cbiAgICByZXBsYWNlKC8lMjAvZywgJysnKS5cbiAgICByZXBsYWNlKC8lNUIvZ2ksICdbJykuXG4gICAgcmVwbGFjZSgvJTVEL2dpLCAnXScpO1xufVxuXG4vKipcbiAqIEJ1aWxkIGEgVVJMIGJ5IGFwcGVuZGluZyBwYXJhbXMgdG8gdGhlIGVuZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIGJhc2Ugb2YgdGhlIHVybCAoZS5nLiwgaHR0cDovL3d3dy5nb29nbGUuY29tKVxuICogQHBhcmFtIHtvYmplY3R9IFtwYXJhbXNdIFRoZSBwYXJhbXMgdG8gYmUgYXBwZW5kZWRcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgdXJsXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYnVpbGRVUkwodXJsLCBwYXJhbXMsIHBhcmFtc1NlcmlhbGl6ZXIpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIGlmICghcGFyYW1zKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuXG4gIHZhciBzZXJpYWxpemVkUGFyYW1zO1xuICBpZiAocGFyYW1zU2VyaWFsaXplcikge1xuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJhbXNTZXJpYWxpemVyKHBhcmFtcyk7XG4gIH0gZWxzZSBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMocGFyYW1zKSkge1xuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJhbXMudG9TdHJpbmcoKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgcGFydHMgPSBbXTtcblxuICAgIHV0aWxzLmZvckVhY2gocGFyYW1zLCBmdW5jdGlvbiBzZXJpYWxpemUodmFsLCBrZXkpIHtcbiAgICAgIGlmICh2YWwgPT09IG51bGwgfHwgdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodXRpbHMuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgIGtleSA9IGtleSArICdbXSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWwgPSBbdmFsXTtcbiAgICAgIH1cblxuICAgICAgdXRpbHMuZm9yRWFjaCh2YWwsIGZ1bmN0aW9uIHBhcnNlVmFsdWUodikge1xuICAgICAgICBpZiAodXRpbHMuaXNEYXRlKHYpKSB7XG4gICAgICAgICAgdiA9IHYudG9JU09TdHJpbmcoKTtcbiAgICAgICAgfSBlbHNlIGlmICh1dGlscy5pc09iamVjdCh2KSkge1xuICAgICAgICAgIHYgPSBKU09OLnN0cmluZ2lmeSh2KTtcbiAgICAgICAgfVxuICAgICAgICBwYXJ0cy5wdXNoKGVuY29kZShrZXkpICsgJz0nICsgZW5jb2RlKHYpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcnRzLmpvaW4oJyYnKTtcbiAgfVxuXG4gIGlmIChzZXJpYWxpemVkUGFyYW1zKSB7XG4gICAgdmFyIGhhc2htYXJrSW5kZXggPSB1cmwuaW5kZXhPZignIycpO1xuICAgIGlmIChoYXNobWFya0luZGV4ICE9PSAtMSkge1xuICAgICAgdXJsID0gdXJsLnNsaWNlKDAsIGhhc2htYXJrSW5kZXgpO1xuICAgIH1cblxuICAgIHVybCArPSAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJicpICsgc2VyaWFsaXplZFBhcmFtcztcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgc3BlY2lmaWVkIFVSTHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGl2ZVVSTCBUaGUgcmVsYXRpdmUgVVJMXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgVVJMXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVsYXRpdmVVUkwpIHtcbiAgcmV0dXJuIHJlbGF0aXZlVVJMXG4gICAgPyBiYXNlVVJMLnJlcGxhY2UoL1xcLyskLywgJycpICsgJy8nICsgcmVsYXRpdmVVUkwucmVwbGFjZSgvXlxcLysvLCAnJylcbiAgICA6IGJhc2VVUkw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgc3VwcG9ydCBkb2N1bWVudC5jb29raWVcbiAgICAoZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKG5hbWUsIHZhbHVlLCBleHBpcmVzLCBwYXRoLCBkb21haW4sIHNlY3VyZSkge1xuICAgICAgICAgIHZhciBjb29raWUgPSBbXTtcbiAgICAgICAgICBjb29raWUucHVzaChuYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG5cbiAgICAgICAgICBpZiAodXRpbHMuaXNOdW1iZXIoZXhwaXJlcykpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdleHBpcmVzPScgKyBuZXcgRGF0ZShleHBpcmVzKS50b0dNVFN0cmluZygpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdwYXRoPScgKyBwYXRoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcoZG9tYWluKSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ2RvbWFpbj0nICsgZG9tYWluKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2VjdXJlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgnc2VjdXJlJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llLmpvaW4oJzsgJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZChuYW1lKSB7XG4gICAgICAgICAgdmFyIG1hdGNoID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoJyhefDtcXFxccyopKCcgKyBuYW1lICsgJyk9KFteO10qKScpKTtcbiAgICAgICAgICByZXR1cm4gKG1hdGNoID8gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoWzNdKSA6IG51bGwpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKG5hbWUpIHtcbiAgICAgICAgICB0aGlzLndyaXRlKG5hbWUsICcnLCBEYXRlLm5vdygpIC0gODY0MDAwMDApO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pKCkgOlxuXG4gIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudiAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cbiAgICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKCkge30sXG4gICAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQoKSB7IHJldHVybiBudWxsOyB9LFxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgICB9O1xuICAgIH0pKClcbik7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgVVJMIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0Fic29sdXRlVVJMKHVybCkge1xuICAvLyBBIFVSTCBpcyBjb25zaWRlcmVkIGFic29sdXRlIGlmIGl0IGJlZ2lucyB3aXRoIFwiPHNjaGVtZT46Ly9cIiBvciBcIi8vXCIgKHByb3RvY29sLXJlbGF0aXZlIFVSTCkuXG4gIC8vIFJGQyAzOTg2IGRlZmluZXMgc2NoZW1lIG5hbWUgYXMgYSBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzIGJlZ2lubmluZyB3aXRoIGEgbGV0dGVyIGFuZCBmb2xsb3dlZFxuICAvLyBieSBhbnkgY29tYmluYXRpb24gb2YgbGV0dGVycywgZGlnaXRzLCBwbHVzLCBwZXJpb2QsIG9yIGh5cGhlbi5cbiAgcmV0dXJuIC9eKFthLXpdW2EtelxcZFxcK1xcLVxcLl0qOik/XFwvXFwvL2kudGVzdCh1cmwpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/XG5cbiAgLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIGhhdmUgZnVsbCBzdXBwb3J0IG9mIHRoZSBBUElzIG5lZWRlZCB0byB0ZXN0XG4gIC8vIHdoZXRoZXIgdGhlIHJlcXVlc3QgVVJMIGlzIG9mIHRoZSBzYW1lIG9yaWdpbiBhcyBjdXJyZW50IGxvY2F0aW9uLlxuICAgIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICB2YXIgbXNpZSA9IC8obXNpZXx0cmlkZW50KS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgICB2YXIgdXJsUGFyc2luZ05vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICB2YXIgb3JpZ2luVVJMO1xuXG4gICAgICAvKipcbiAgICAqIFBhcnNlIGEgVVJMIHRvIGRpc2NvdmVyIGl0J3MgY29tcG9uZW50c1xuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVGhlIFVSTCB0byBiZSBwYXJzZWRcbiAgICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAgKi9cbiAgICAgIGZ1bmN0aW9uIHJlc29sdmVVUkwodXJsKSB7XG4gICAgICAgIHZhciBocmVmID0gdXJsO1xuXG4gICAgICAgIGlmIChtc2llKSB7XG4gICAgICAgIC8vIElFIG5lZWRzIGF0dHJpYnV0ZSBzZXQgdHdpY2UgdG8gbm9ybWFsaXplIHByb3BlcnRpZXNcbiAgICAgICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcbiAgICAgICAgICBocmVmID0gdXJsUGFyc2luZ05vZGUuaHJlZjtcbiAgICAgICAgfVxuXG4gICAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuXG4gICAgICAgIC8vIHVybFBhcnNpbmdOb2RlIHByb3ZpZGVzIHRoZSBVcmxVdGlscyBpbnRlcmZhY2UgLSBodHRwOi8vdXJsLnNwZWMud2hhdHdnLm9yZy8jdXJsdXRpbHNcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBocmVmOiB1cmxQYXJzaW5nTm9kZS5ocmVmLFxuICAgICAgICAgIHByb3RvY29sOiB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbCA/IHVybFBhcnNpbmdOb2RlLnByb3RvY29sLnJlcGxhY2UoLzokLywgJycpIDogJycsXG4gICAgICAgICAgaG9zdDogdXJsUGFyc2luZ05vZGUuaG9zdCxcbiAgICAgICAgICBzZWFyY2g6IHVybFBhcnNpbmdOb2RlLnNlYXJjaCA/IHVybFBhcnNpbmdOb2RlLnNlYXJjaC5yZXBsYWNlKC9eXFw/LywgJycpIDogJycsXG4gICAgICAgICAgaGFzaDogdXJsUGFyc2luZ05vZGUuaGFzaCA/IHVybFBhcnNpbmdOb2RlLmhhc2gucmVwbGFjZSgvXiMvLCAnJykgOiAnJyxcbiAgICAgICAgICBob3N0bmFtZTogdXJsUGFyc2luZ05vZGUuaG9zdG5hbWUsXG4gICAgICAgICAgcG9ydDogdXJsUGFyc2luZ05vZGUucG9ydCxcbiAgICAgICAgICBwYXRobmFtZTogKHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nKSA/XG4gICAgICAgICAgICB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZSA6XG4gICAgICAgICAgICAnLycgKyB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBvcmlnaW5VUkwgPSByZXNvbHZlVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcblxuICAgICAgLyoqXG4gICAgKiBEZXRlcm1pbmUgaWYgYSBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiBhcyB0aGUgY3VycmVudCBsb2NhdGlvblxuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSByZXF1ZXN0VVJMIFRoZSBVUkwgdG8gdGVzdFxuICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4sIG90aGVyd2lzZSBmYWxzZVxuICAgICovXG4gICAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKHJlcXVlc3RVUkwpIHtcbiAgICAgICAgdmFyIHBhcnNlZCA9ICh1dGlscy5pc1N0cmluZyhyZXF1ZXN0VVJMKSkgPyByZXNvbHZlVVJMKHJlcXVlc3RVUkwpIDogcmVxdWVzdFVSTDtcbiAgICAgICAgcmV0dXJuIChwYXJzZWQucHJvdG9jb2wgPT09IG9yaWdpblVSTC5wcm90b2NvbCAmJlxuICAgICAgICAgICAgcGFyc2VkLmhvc3QgPT09IG9yaWdpblVSTC5ob3N0KTtcbiAgICAgIH07XG4gICAgfSkoKSA6XG5cbiAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52cyAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cbiAgICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbigpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9O1xuICAgIH0pKClcbik7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCBub3JtYWxpemVkTmFtZSkge1xuICB1dGlscy5mb3JFYWNoKGhlYWRlcnMsIGZ1bmN0aW9uIHByb2Nlc3NIZWFkZXIodmFsdWUsIG5hbWUpIHtcbiAgICBpZiAobmFtZSAhPT0gbm9ybWFsaXplZE5hbWUgJiYgbmFtZS50b1VwcGVyQ2FzZSgpID09PSBub3JtYWxpemVkTmFtZS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICBoZWFkZXJzW25vcm1hbGl6ZWROYW1lXSA9IHZhbHVlO1xuICAgICAgZGVsZXRlIGhlYWRlcnNbbmFtZV07XG4gICAgfVxuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuLy8gSGVhZGVycyB3aG9zZSBkdXBsaWNhdGVzIGFyZSBpZ25vcmVkIGJ5IG5vZGVcbi8vIGMuZi4gaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9odHRwLmh0bWwjaHR0cF9tZXNzYWdlX2hlYWRlcnNcbnZhciBpZ25vcmVEdXBsaWNhdGVPZiA9IFtcbiAgJ2FnZScsICdhdXRob3JpemF0aW9uJywgJ2NvbnRlbnQtbGVuZ3RoJywgJ2NvbnRlbnQtdHlwZScsICdldGFnJyxcbiAgJ2V4cGlyZXMnLCAnZnJvbScsICdob3N0JywgJ2lmLW1vZGlmaWVkLXNpbmNlJywgJ2lmLXVubW9kaWZpZWQtc2luY2UnLFxuICAnbGFzdC1tb2RpZmllZCcsICdsb2NhdGlvbicsICdtYXgtZm9yd2FyZHMnLCAncHJveHktYXV0aG9yaXphdGlvbicsXG4gICdyZWZlcmVyJywgJ3JldHJ5LWFmdGVyJywgJ3VzZXItYWdlbnQnXG5dO1xuXG4vKipcbiAqIFBhcnNlIGhlYWRlcnMgaW50byBhbiBvYmplY3RcbiAqXG4gKiBgYGBcbiAqIERhdGU6IFdlZCwgMjcgQXVnIDIwMTQgMDg6NTg6NDkgR01UXG4gKiBDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb25cbiAqIENvbm5lY3Rpb246IGtlZXAtYWxpdmVcbiAqIFRyYW5zZmVyLUVuY29kaW5nOiBjaHVua2VkXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaGVhZGVycyBIZWFkZXJzIG5lZWRpbmcgdG8gYmUgcGFyc2VkXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBIZWFkZXJzIHBhcnNlZCBpbnRvIGFuIG9iamVjdFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlSGVhZGVycyhoZWFkZXJzKSB7XG4gIHZhciBwYXJzZWQgPSB7fTtcbiAgdmFyIGtleTtcbiAgdmFyIHZhbDtcbiAgdmFyIGk7XG5cbiAgaWYgKCFoZWFkZXJzKSB7IHJldHVybiBwYXJzZWQ7IH1cblxuICB1dGlscy5mb3JFYWNoKGhlYWRlcnMuc3BsaXQoJ1xcbicpLCBmdW5jdGlvbiBwYXJzZXIobGluZSkge1xuICAgIGkgPSBsaW5lLmluZGV4T2YoJzonKTtcbiAgICBrZXkgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKDAsIGkpKS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhbCA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoaSArIDEpKTtcblxuICAgIGlmIChrZXkpIHtcbiAgICAgIGlmIChwYXJzZWRba2V5XSAmJiBpZ25vcmVEdXBsaWNhdGVPZi5pbmRleE9mKGtleSkgPj0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoa2V5ID09PSAnc2V0LWNvb2tpZScpIHtcbiAgICAgICAgcGFyc2VkW2tleV0gPSAocGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSA6IFtdKS5jb25jYXQoW3ZhbF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyc2VkW2tleV0gPSBwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldICsgJywgJyArIHZhbCA6IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBwYXJzZWQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFN5bnRhY3RpYyBzdWdhciBmb3IgaW52b2tpbmcgYSBmdW5jdGlvbiBhbmQgZXhwYW5kaW5nIGFuIGFycmF5IGZvciBhcmd1bWVudHMuXG4gKlxuICogQ29tbW9uIHVzZSBjYXNlIHdvdWxkIGJlIHRvIHVzZSBgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5YC5cbiAqXG4gKiAgYGBganNcbiAqICBmdW5jdGlvbiBmKHgsIHksIHopIHt9XG4gKiAgdmFyIGFyZ3MgPSBbMSwgMiwgM107XG4gKiAgZi5hcHBseShudWxsLCBhcmdzKTtcbiAqICBgYGBcbiAqXG4gKiBXaXRoIGBzcHJlYWRgIHRoaXMgZXhhbXBsZSBjYW4gYmUgcmUtd3JpdHRlbi5cbiAqXG4gKiAgYGBganNcbiAqICBzcHJlYWQoZnVuY3Rpb24oeCwgeSwgeikge30pKFsxLCAyLCAzXSk7XG4gKiAgYGBgXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzcHJlYWQoY2FsbGJhY2spIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoYXJyKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFycik7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG5cbi8qZ2xvYmFsIHRvU3RyaW5nOnRydWUqL1xuXG4vLyB1dGlscyBpcyBhIGxpYnJhcnkgb2YgZ2VuZXJpYyBoZWxwZXIgZnVuY3Rpb25zIG5vbi1zcGVjaWZpYyB0byBheGlvc1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gQXJyYXksIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5KHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheV0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIHVuZGVmaW5lZFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSB2YWx1ZSBpcyB1bmRlZmluZWQsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgQnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0J1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiAhaXNVbmRlZmluZWQodmFsKSAmJiB2YWwuY29uc3RydWN0b3IgIT09IG51bGwgJiYgIWlzVW5kZWZpbmVkKHZhbC5jb25zdHJ1Y3RvcilcbiAgICAmJiB0eXBlb2YgdmFsLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIHZhbC5jb25zdHJ1Y3Rvci5pc0J1ZmZlcih2YWwpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRm9ybURhdGFcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBGb3JtRGF0YSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRm9ybURhdGEodmFsKSB7XG4gIHJldHVybiAodHlwZW9mIEZvcm1EYXRhICE9PSAndW5kZWZpbmVkJykgJiYgKHZhbCBpbnN0YW5jZW9mIEZvcm1EYXRhKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyVmlldyh2YWwpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKCh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnKSAmJiAoQXJyYXlCdWZmZXIuaXNWaWV3KSkge1xuICAgIHJlc3VsdCA9IEFycmF5QnVmZmVyLmlzVmlldyh2YWwpO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9ICh2YWwpICYmICh2YWwuYnVmZmVyKSAmJiAodmFsLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyaW5nXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJpbmcsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmluZyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgTnVtYmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBOdW1iZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc051bWJlcih2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdudW1iZXInO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbCkge1xuICByZXR1cm4gdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRGF0ZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRGF0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRGF0ZSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRmlsZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRmlsZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRmlsZSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRmlsZV0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgQmxvYlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQmxvYiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQmxvYih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQmxvYl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmVhbVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyZWFtLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJlYW0odmFsKSB7XG4gIHJldHVybiBpc09iamVjdCh2YWwpICYmIGlzRnVuY3Rpb24odmFsLnBpcGUpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVVJMU2VhcmNoUGFyYW1zKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIFVSTFNlYXJjaFBhcmFtcyAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsIGluc3RhbmNlb2YgVVJMU2VhcmNoUGFyYW1zO1xufVxuXG4vKipcbiAqIFRyaW0gZXhjZXNzIHdoaXRlc3BhY2Ugb2ZmIHRoZSBiZWdpbm5pbmcgYW5kIGVuZCBvZiBhIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIFN0cmluZyB0byB0cmltXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgU3RyaW5nIGZyZWVkIG9mIGV4Y2VzcyB3aGl0ZXNwYWNlXG4gKi9cbmZ1bmN0aW9uIHRyaW0oc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyovLCAnJykucmVwbGFjZSgvXFxzKiQvLCAnJyk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIHdlJ3JlIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50XG4gKlxuICogVGhpcyBhbGxvd3MgYXhpb3MgdG8gcnVuIGluIGEgd2ViIHdvcmtlciwgYW5kIHJlYWN0LW5hdGl2ZS5cbiAqIEJvdGggZW52aXJvbm1lbnRzIHN1cHBvcnQgWE1MSHR0cFJlcXVlc3QsIGJ1dCBub3QgZnVsbHkgc3RhbmRhcmQgZ2xvYmFscy5cbiAqXG4gKiB3ZWIgd29ya2VyczpcbiAqICB0eXBlb2Ygd2luZG93IC0+IHVuZGVmaW5lZFxuICogIHR5cGVvZiBkb2N1bWVudCAtPiB1bmRlZmluZWRcbiAqXG4gKiByZWFjdC1uYXRpdmU6XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ1JlYWN0TmF0aXZlJ1xuICogbmF0aXZlc2NyaXB0XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ05hdGl2ZVNjcmlwdCcgb3IgJ05TJ1xuICovXG5mdW5jdGlvbiBpc1N0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIChuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ1JlYWN0TmF0aXZlJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnTmF0aXZlU2NyaXB0JyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnTlMnKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gKFxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJ1xuICApO1xufVxuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbiBBcnJheSBvciBhbiBPYmplY3QgaW52b2tpbmcgYSBmdW5jdGlvbiBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmIGBvYmpgIGlzIGFuIEFycmF5IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwgaW5kZXgsIGFuZCBjb21wbGV0ZSBhcnJheSBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmICdvYmonIGlzIGFuIE9iamVjdCBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGtleSwgYW5kIGNvbXBsZXRlIG9iamVjdCBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gb2JqIFRoZSBvYmplY3QgdG8gaXRlcmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGNhbGxiYWNrIHRvIGludm9rZSBmb3IgZWFjaCBpdGVtXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbikge1xuICAvLyBEb24ndCBib3RoZXIgaWYgbm8gdmFsdWUgcHJvdmlkZWRcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEZvcmNlIGFuIGFycmF5IGlmIG5vdCBhbHJlYWR5IHNvbWV0aGluZyBpdGVyYWJsZVxuICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBvYmogPSBbb2JqXTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgYXJyYXkgdmFsdWVzXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBmbi5jYWxsKG51bGwsIG9ialtpXSwgaSwgb2JqKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIG9iamVjdCBrZXlzXG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgZm4uY2FsbChudWxsLCBvYmpba2V5XSwga2V5LCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEFjY2VwdHMgdmFyYXJncyBleHBlY3RpbmcgZWFjaCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3QsIHRoZW5cbiAqIGltbXV0YWJseSBtZXJnZXMgdGhlIHByb3BlcnRpZXMgb2YgZWFjaCBvYmplY3QgYW5kIHJldHVybnMgcmVzdWx0LlxuICpcbiAqIFdoZW4gbXVsdGlwbGUgb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIGtleSB0aGUgbGF0ZXIgb2JqZWN0IGluXG4gKiB0aGUgYXJndW1lbnRzIGxpc3Qgd2lsbCB0YWtlIHByZWNlZGVuY2UuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogdmFyIHJlc3VsdCA9IG1lcmdlKHtmb286IDEyM30sIHtmb286IDQ1Nn0pO1xuICogY29uc29sZS5sb2cocmVzdWx0LmZvbyk7IC8vIG91dHB1dHMgNDU2XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqMSBPYmplY3QgdG8gbWVyZ2VcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJlc3VsdCBvZiBhbGwgbWVyZ2UgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBtZXJnZSgvKiBvYmoxLCBvYmoyLCBvYmozLCAuLi4gKi8pIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmICh0eXBlb2YgcmVzdWx0W2tleV0gPT09ICdvYmplY3QnICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgICByZXN1bHRba2V5XSA9IG1lcmdlKHJlc3VsdFtrZXldLCB2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHRba2V5XSA9IHZhbDtcbiAgICB9XG4gIH1cblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBmb3JFYWNoKGFyZ3VtZW50c1tpXSwgYXNzaWduVmFsdWUpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRnVuY3Rpb24gZXF1YWwgdG8gbWVyZ2Ugd2l0aCB0aGUgZGlmZmVyZW5jZSBiZWluZyB0aGF0IG5vIHJlZmVyZW5jZVxuICogdG8gb3JpZ2luYWwgb2JqZWN0cyBpcyBrZXB0LlxuICpcbiAqIEBzZWUgbWVyZ2VcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmoxIE9iamVjdCB0byBtZXJnZVxuICogQHJldHVybnMge09iamVjdH0gUmVzdWx0IG9mIGFsbCBtZXJnZSBwcm9wZXJ0aWVzXG4gKi9cbmZ1bmN0aW9uIGRlZXBNZXJnZSgvKiBvYmoxLCBvYmoyLCBvYmozLCAuLi4gKi8pIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmICh0eXBlb2YgcmVzdWx0W2tleV0gPT09ICdvYmplY3QnICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgICByZXN1bHRba2V5XSA9IGRlZXBNZXJnZShyZXN1bHRba2V5XSwgdmFsKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgICByZXN1bHRba2V5XSA9IGRlZXBNZXJnZSh7fSwgdmFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWw7XG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgZm9yRWFjaChhcmd1bWVudHNbaV0sIGFzc2lnblZhbHVlKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEV4dGVuZHMgb2JqZWN0IGEgYnkgbXV0YWJseSBhZGRpbmcgdG8gaXQgdGhlIHByb3BlcnRpZXMgb2Ygb2JqZWN0IGIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGEgVGhlIG9iamVjdCB0byBiZSBleHRlbmRlZFxuICogQHBhcmFtIHtPYmplY3R9IGIgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbVxuICogQHBhcmFtIHtPYmplY3R9IHRoaXNBcmcgVGhlIG9iamVjdCB0byBiaW5kIGZ1bmN0aW9uIHRvXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSByZXN1bHRpbmcgdmFsdWUgb2Ygb2JqZWN0IGFcbiAqL1xuZnVuY3Rpb24gZXh0ZW5kKGEsIGIsIHRoaXNBcmcpIHtcbiAgZm9yRWFjaChiLCBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmICh0aGlzQXJnICYmIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFba2V5XSA9IGJpbmQodmFsLCB0aGlzQXJnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYVtrZXldID0gdmFsO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNBcnJheTogaXNBcnJheSxcbiAgaXNBcnJheUJ1ZmZlcjogaXNBcnJheUJ1ZmZlcixcbiAgaXNCdWZmZXI6IGlzQnVmZmVyLFxuICBpc0Zvcm1EYXRhOiBpc0Zvcm1EYXRhLFxuICBpc0FycmF5QnVmZmVyVmlldzogaXNBcnJheUJ1ZmZlclZpZXcsXG4gIGlzU3RyaW5nOiBpc1N0cmluZyxcbiAgaXNOdW1iZXI6IGlzTnVtYmVyLFxuICBpc09iamVjdDogaXNPYmplY3QsXG4gIGlzVW5kZWZpbmVkOiBpc1VuZGVmaW5lZCxcbiAgaXNEYXRlOiBpc0RhdGUsXG4gIGlzRmlsZTogaXNGaWxlLFxuICBpc0Jsb2I6IGlzQmxvYixcbiAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcbiAgaXNTdHJlYW06IGlzU3RyZWFtLFxuICBpc1VSTFNlYXJjaFBhcmFtczogaXNVUkxTZWFyY2hQYXJhbXMsXG4gIGlzU3RhbmRhcmRCcm93c2VyRW52OiBpc1N0YW5kYXJkQnJvd3NlckVudixcbiAgZm9yRWFjaDogZm9yRWFjaCxcbiAgbWVyZ2U6IG1lcmdlLFxuICBkZWVwTWVyZ2U6IGRlZXBNZXJnZSxcbiAgZXh0ZW5kOiBleHRlbmQsXG4gIHRyaW06IHRyaW1cbn07XG4iLCJcbiAgICAod2luZG93Ll9fTkVYVF9QID0gd2luZG93Ll9fTkVYVF9QIHx8IFtdKS5wdXNoKFtcbiAgICAgIFwiL1wiLFxuICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcmVxdWlyZShcIkM6XFxcXFVzZXJzXFxcXGhpbGxlbCBuYWdpZFxcXFxEZXNrdG9wXFxcXHJoeXRobVxcXFxwYWdlc1xcXFxpbmRleC5qc1wiKTtcbiAgICAgIH1cbiAgICBdKTtcbiAgIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oLyohIGRsbC1yZWZlcmVuY2UgZGxsX2VjN2Q5YzAyNDliMmVmNTJiNzRjICovIFwiZGxsLXJlZmVyZW5jZSBkbGxfZWM3ZDljMDI0OWIyZWY1MmI3NGNcIikpKFwiLi9ub2RlX21vZHVsZXMvcmVhY3QvaW5kZXguanNcIik7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIGhhc2goc3RyKSB7XG4gIHZhciBoYXNoID0gNTM4MSxcbiAgICAgIGkgICAgPSBzdHIubGVuZ3RoO1xuXG4gIHdoaWxlKGkpIHtcbiAgICBoYXNoID0gKGhhc2ggKiAzMykgXiBzdHIuY2hhckNvZGVBdCgtLWkpO1xuICB9XG5cbiAgLyogSmF2YVNjcmlwdCBkb2VzIGJpdHdpc2Ugb3BlcmF0aW9ucyAobGlrZSBYT1IsIGFib3ZlKSBvbiAzMi1iaXQgc2lnbmVkXG4gICAqIGludGVnZXJzLiBTaW5jZSB3ZSB3YW50IHRoZSByZXN1bHRzIHRvIGJlIGFsd2F5cyBwb3NpdGl2ZSwgY29udmVydCB0aGVcbiAgICogc2lnbmVkIGludCB0byBhbiB1bnNpZ25lZCBieSBkb2luZyBhbiB1bnNpZ25lZCBiaXRzaGlmdC4gKi9cbiAgcmV0dXJuIGhhc2ggPj4+IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuLypcbkJhc2VkIG9uIEdsYW1vcidzIHNoZWV0XG5odHRwczovL2dpdGh1Yi5jb20vdGhyZWVwb2ludG9uZS9nbGFtb3IvYmxvYi82NjdiNDgwZDMxYjM3MjFhOTA1MDIxYjI2ZTEyOTBjZTkyY2EyODc5L3NyYy9zaGVldC5qc1xuKi9cbnZhciBpc1Byb2QgPSB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5lbnYgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJztcblxudmFyIGlzU3RyaW5nID0gZnVuY3Rpb24gaXNTdHJpbmcobykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pID09PSAnW29iamVjdCBTdHJpbmddJztcbn07XG5cbnZhciBTdHlsZVNoZWV0ID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gU3R5bGVTaGVldChfdGVtcCkge1xuICAgIHZhciBfcmVmID0gX3RlbXAgPT09IHZvaWQgMCA/IHt9IDogX3RlbXAsXG4gICAgICAgIF9yZWYkbmFtZSA9IF9yZWYubmFtZSxcbiAgICAgICAgbmFtZSA9IF9yZWYkbmFtZSA9PT0gdm9pZCAwID8gJ3N0eWxlc2hlZXQnIDogX3JlZiRuYW1lLFxuICAgICAgICBfcmVmJG9wdGltaXplRm9yU3BlZWQgPSBfcmVmLm9wdGltaXplRm9yU3BlZWQsXG4gICAgICAgIG9wdGltaXplRm9yU3BlZWQgPSBfcmVmJG9wdGltaXplRm9yU3BlZWQgPT09IHZvaWQgMCA/IGlzUHJvZCA6IF9yZWYkb3B0aW1pemVGb3JTcGVlZCxcbiAgICAgICAgX3JlZiRpc0Jyb3dzZXIgPSBfcmVmLmlzQnJvd3NlcixcbiAgICAgICAgaXNCcm93c2VyID0gX3JlZiRpc0Jyb3dzZXIgPT09IHZvaWQgMCA/IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnIDogX3JlZiRpc0Jyb3dzZXI7XG5cbiAgICBpbnZhcmlhbnQoaXNTdHJpbmcobmFtZSksICdgbmFtZWAgbXVzdCBiZSBhIHN0cmluZycpO1xuICAgIHRoaXMuX25hbWUgPSBuYW1lO1xuICAgIHRoaXMuX2RlbGV0ZWRSdWxlUGxhY2Vob2xkZXIgPSBcIiNcIiArIG5hbWUgKyBcIi1kZWxldGVkLXJ1bGVfX19fe31cIjtcbiAgICBpbnZhcmlhbnQodHlwZW9mIG9wdGltaXplRm9yU3BlZWQgPT09ICdib29sZWFuJywgJ2BvcHRpbWl6ZUZvclNwZWVkYCBtdXN0IGJlIGEgYm9vbGVhbicpO1xuICAgIHRoaXMuX29wdGltaXplRm9yU3BlZWQgPSBvcHRpbWl6ZUZvclNwZWVkO1xuICAgIHRoaXMuX2lzQnJvd3NlciA9IGlzQnJvd3NlcjtcbiAgICB0aGlzLl9zZXJ2ZXJTaGVldCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl90YWdzID0gW107XG4gICAgdGhpcy5faW5qZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9ydWxlc0NvdW50ID0gMDtcbiAgICB2YXIgbm9kZSA9IHRoaXMuX2lzQnJvd3NlciAmJiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW3Byb3BlcnR5PVwiY3NwLW5vbmNlXCJdJyk7XG4gICAgdGhpcy5fbm9uY2UgPSBub2RlID8gbm9kZS5nZXRBdHRyaWJ1dGUoJ2NvbnRlbnQnKSA6IG51bGw7XG4gIH1cblxuICB2YXIgX3Byb3RvID0gU3R5bGVTaGVldC5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLnNldE9wdGltaXplRm9yU3BlZWQgPSBmdW5jdGlvbiBzZXRPcHRpbWl6ZUZvclNwZWVkKGJvb2wpIHtcbiAgICBpbnZhcmlhbnQodHlwZW9mIGJvb2wgPT09ICdib29sZWFuJywgJ2BzZXRPcHRpbWl6ZUZvclNwZWVkYCBhY2NlcHRzIGEgYm9vbGVhbicpO1xuICAgIGludmFyaWFudCh0aGlzLl9ydWxlc0NvdW50ID09PSAwLCAnb3B0aW1pemVGb3JTcGVlZCBjYW5ub3QgYmUgd2hlbiBydWxlcyBoYXZlIGFscmVhZHkgYmVlbiBpbnNlcnRlZCcpO1xuICAgIHRoaXMuZmx1c2goKTtcbiAgICB0aGlzLl9vcHRpbWl6ZUZvclNwZWVkID0gYm9vbDtcbiAgICB0aGlzLmluamVjdCgpO1xuICB9O1xuXG4gIF9wcm90by5pc09wdGltaXplRm9yU3BlZWQgPSBmdW5jdGlvbiBpc09wdGltaXplRm9yU3BlZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29wdGltaXplRm9yU3BlZWQ7XG4gIH07XG5cbiAgX3Byb3RvLmluamVjdCA9IGZ1bmN0aW9uIGluamVjdCgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaW52YXJpYW50KCF0aGlzLl9pbmplY3RlZCwgJ3NoZWV0IGFscmVhZHkgaW5qZWN0ZWQnKTtcbiAgICB0aGlzLl9pbmplY3RlZCA9IHRydWU7XG5cbiAgICBpZiAodGhpcy5faXNCcm93c2VyICYmIHRoaXMuX29wdGltaXplRm9yU3BlZWQpIHtcbiAgICAgIHRoaXMuX3RhZ3NbMF0gPSB0aGlzLm1ha2VTdHlsZVRhZyh0aGlzLl9uYW1lKTtcbiAgICAgIHRoaXMuX29wdGltaXplRm9yU3BlZWQgPSAnaW5zZXJ0UnVsZScgaW4gdGhpcy5nZXRTaGVldCgpO1xuXG4gICAgICBpZiAoIXRoaXMuX29wdGltaXplRm9yU3BlZWQpIHtcbiAgICAgICAgaWYgKCFpc1Byb2QpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ1N0eWxlU2hlZXQ6IG9wdGltaXplRm9yU3BlZWQgbW9kZSBub3Qgc3VwcG9ydGVkIGZhbGxpbmcgYmFjayB0byBzdGFuZGFyZCBtb2RlLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5mbHVzaCgpO1xuICAgICAgICB0aGlzLl9pbmplY3RlZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9zZXJ2ZXJTaGVldCA9IHtcbiAgICAgIGNzc1J1bGVzOiBbXSxcbiAgICAgIGluc2VydFJ1bGU6IGZ1bmN0aW9uIGluc2VydFJ1bGUocnVsZSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpbmRleCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICBfdGhpcy5fc2VydmVyU2hlZXQuY3NzUnVsZXNbaW5kZXhdID0ge1xuICAgICAgICAgICAgY3NzVGV4dDogcnVsZVxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX3RoaXMuX3NlcnZlclNoZWV0LmNzc1J1bGVzLnB1c2goe1xuICAgICAgICAgICAgY3NzVGV4dDogcnVsZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgfSxcbiAgICAgIGRlbGV0ZVJ1bGU6IGZ1bmN0aW9uIGRlbGV0ZVJ1bGUoaW5kZXgpIHtcbiAgICAgICAgX3RoaXMuX3NlcnZlclNoZWV0LmNzc1J1bGVzW2luZGV4XSA9IG51bGw7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICBfcHJvdG8uZ2V0U2hlZXRGb3JUYWcgPSBmdW5jdGlvbiBnZXRTaGVldEZvclRhZyh0YWcpIHtcbiAgICBpZiAodGFnLnNoZWV0KSB7XG4gICAgICByZXR1cm4gdGFnLnNoZWV0O1xuICAgIH0gLy8gdGhpcyB3ZWlyZG5lc3MgYnJvdWdodCB0byB5b3UgYnkgZmlyZWZveFxuXG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRvY3VtZW50LnN0eWxlU2hlZXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoZG9jdW1lbnQuc3R5bGVTaGVldHNbaV0ub3duZXJOb2RlID09PSB0YWcpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uZ2V0U2hlZXQgPSBmdW5jdGlvbiBnZXRTaGVldCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRTaGVldEZvclRhZyh0aGlzLl90YWdzW3RoaXMuX3RhZ3MubGVuZ3RoIC0gMV0pO1xuICB9O1xuXG4gIF9wcm90by5pbnNlcnRSdWxlID0gZnVuY3Rpb24gaW5zZXJ0UnVsZShydWxlLCBpbmRleCkge1xuICAgIGludmFyaWFudChpc1N0cmluZyhydWxlKSwgJ2BpbnNlcnRSdWxlYCBhY2NlcHRzIG9ubHkgc3RyaW5ncycpO1xuXG4gICAgaWYgKCF0aGlzLl9pc0Jyb3dzZXIpIHtcbiAgICAgIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSB7XG4gICAgICAgIGluZGV4ID0gdGhpcy5fc2VydmVyU2hlZXQuY3NzUnVsZXMubGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9zZXJ2ZXJTaGVldC5pbnNlcnRSdWxlKHJ1bGUsIGluZGV4KTtcblxuICAgICAgcmV0dXJuIHRoaXMuX3J1bGVzQ291bnQrKztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fb3B0aW1pemVGb3JTcGVlZCkge1xuICAgICAgdmFyIHNoZWV0ID0gdGhpcy5nZXRTaGVldCgpO1xuXG4gICAgICBpZiAodHlwZW9mIGluZGV4ICE9PSAnbnVtYmVyJykge1xuICAgICAgICBpbmRleCA9IHNoZWV0LmNzc1J1bGVzLmxlbmd0aDtcbiAgICAgIH0gLy8gdGhpcyB3ZWlyZG5lc3MgZm9yIHBlcmYsIGFuZCBjaHJvbWUncyB3ZWlyZCBidWdcbiAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzIwMDA3OTkyL2Nocm9tZS1zdWRkZW5seS1zdG9wcGVkLWFjY2VwdGluZy1pbnNlcnRydWxlXG5cblxuICAgICAgdHJ5IHtcbiAgICAgICAgc2hlZXQuaW5zZXJ0UnVsZShydWxlLCBpbmRleCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBpZiAoIWlzUHJvZCkge1xuICAgICAgICAgIGNvbnNvbGUud2FybihcIlN0eWxlU2hlZXQ6IGlsbGVnYWwgcnVsZTogXFxuXFxuXCIgKyBydWxlICsgXCJcXG5cXG5TZWUgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xLzIwMDA3OTkyIGZvciBtb3JlIGluZm9cIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBpbnNlcnRpb25Qb2ludCA9IHRoaXMuX3RhZ3NbaW5kZXhdO1xuXG4gICAgICB0aGlzLl90YWdzLnB1c2godGhpcy5tYWtlU3R5bGVUYWcodGhpcy5fbmFtZSwgcnVsZSwgaW5zZXJ0aW9uUG9pbnQpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fcnVsZXNDb3VudCsrO1xuICB9O1xuXG4gIF9wcm90by5yZXBsYWNlUnVsZSA9IGZ1bmN0aW9uIHJlcGxhY2VSdWxlKGluZGV4LCBydWxlKSB7XG4gICAgaWYgKHRoaXMuX29wdGltaXplRm9yU3BlZWQgfHwgIXRoaXMuX2lzQnJvd3Nlcikge1xuICAgICAgdmFyIHNoZWV0ID0gdGhpcy5faXNCcm93c2VyID8gdGhpcy5nZXRTaGVldCgpIDogdGhpcy5fc2VydmVyU2hlZXQ7XG5cbiAgICAgIGlmICghcnVsZS50cmltKCkpIHtcbiAgICAgICAgcnVsZSA9IHRoaXMuX2RlbGV0ZWRSdWxlUGxhY2Vob2xkZXI7XG4gICAgICB9XG5cbiAgICAgIGlmICghc2hlZXQuY3NzUnVsZXNbaW5kZXhdKSB7XG4gICAgICAgIC8vIEBUQkQgU2hvdWxkIHdlIHRocm93IGFuIGVycm9yP1xuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICB9XG5cbiAgICAgIHNoZWV0LmRlbGV0ZVJ1bGUoaW5kZXgpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBzaGVldC5pbnNlcnRSdWxlKHJ1bGUsIGluZGV4KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGlmICghaXNQcm9kKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFwiU3R5bGVTaGVldDogaWxsZWdhbCBydWxlOiBcXG5cXG5cIiArIHJ1bGUgKyBcIlxcblxcblNlZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3EvMjAwMDc5OTIgZm9yIG1vcmUgaW5mb1wiKTtcbiAgICAgICAgfSAvLyBJbiBvcmRlciB0byBwcmVzZXJ2ZSB0aGUgaW5kaWNlcyB3ZSBpbnNlcnQgYSBkZWxldGVSdWxlUGxhY2Vob2xkZXJcblxuXG4gICAgICAgIHNoZWV0Lmluc2VydFJ1bGUodGhpcy5fZGVsZXRlZFJ1bGVQbGFjZWhvbGRlciwgaW5kZXgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdGFnID0gdGhpcy5fdGFnc1tpbmRleF07XG4gICAgICBpbnZhcmlhbnQodGFnLCBcIm9sZCBydWxlIGF0IGluZGV4IGBcIiArIGluZGV4ICsgXCJgIG5vdCBmb3VuZFwiKTtcbiAgICAgIHRhZy50ZXh0Q29udGVudCA9IHJ1bGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGluZGV4O1xuICB9O1xuXG4gIF9wcm90by5kZWxldGVSdWxlID0gZnVuY3Rpb24gZGVsZXRlUnVsZShpbmRleCkge1xuICAgIGlmICghdGhpcy5faXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9zZXJ2ZXJTaGVldC5kZWxldGVSdWxlKGluZGV4KTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9vcHRpbWl6ZUZvclNwZWVkKSB7XG4gICAgICB0aGlzLnJlcGxhY2VSdWxlKGluZGV4LCAnJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB0YWcgPSB0aGlzLl90YWdzW2luZGV4XTtcbiAgICAgIGludmFyaWFudCh0YWcsIFwicnVsZSBhdCBpbmRleCBgXCIgKyBpbmRleCArIFwiYCBub3QgZm91bmRcIik7XG4gICAgICB0YWcucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0YWcpO1xuICAgICAgdGhpcy5fdGFnc1tpbmRleF0gPSBudWxsO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uZmx1c2ggPSBmdW5jdGlvbiBmbHVzaCgpIHtcbiAgICB0aGlzLl9pbmplY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3J1bGVzQ291bnQgPSAwO1xuXG4gICAgaWYgKHRoaXMuX2lzQnJvd3Nlcikge1xuICAgICAgdGhpcy5fdGFncy5mb3JFYWNoKGZ1bmN0aW9uICh0YWcpIHtcbiAgICAgICAgcmV0dXJuIHRhZyAmJiB0YWcucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0YWcpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3RhZ3MgPSBbXTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc2ltcGxlciBvbiBzZXJ2ZXJcbiAgICAgIHRoaXMuX3NlcnZlclNoZWV0LmNzc1J1bGVzID0gW107XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5jc3NSdWxlcyA9IGZ1bmN0aW9uIGNzc1J1bGVzKCkge1xuICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgaWYgKCF0aGlzLl9pc0Jyb3dzZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zZXJ2ZXJTaGVldC5jc3NSdWxlcztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdGFncy5yZWR1Y2UoZnVuY3Rpb24gKHJ1bGVzLCB0YWcpIHtcbiAgICAgIGlmICh0YWcpIHtcbiAgICAgICAgcnVsZXMgPSBydWxlcy5jb25jYXQoQXJyYXkucHJvdG90eXBlLm1hcC5jYWxsKF90aGlzMi5nZXRTaGVldEZvclRhZyh0YWcpLmNzc1J1bGVzLCBmdW5jdGlvbiAocnVsZSkge1xuICAgICAgICAgIHJldHVybiBydWxlLmNzc1RleHQgPT09IF90aGlzMi5fZGVsZXRlZFJ1bGVQbGFjZWhvbGRlciA/IG51bGwgOiBydWxlO1xuICAgICAgICB9KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBydWxlcy5wdXNoKG51bGwpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcnVsZXM7XG4gICAgfSwgW10pO1xuICB9O1xuXG4gIF9wcm90by5tYWtlU3R5bGVUYWcgPSBmdW5jdGlvbiBtYWtlU3R5bGVUYWcobmFtZSwgY3NzU3RyaW5nLCByZWxhdGl2ZVRvVGFnKSB7XG4gICAgaWYgKGNzc1N0cmluZykge1xuICAgICAgaW52YXJpYW50KGlzU3RyaW5nKGNzc1N0cmluZyksICdtYWtlU3R5bGVUYWcgYWNjZXBzIG9ubHkgc3RyaW5ncyBhcyBzZWNvbmQgcGFyYW1ldGVyJyk7XG4gICAgfVxuXG4gICAgdmFyIHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgaWYgKHRoaXMuX25vbmNlKSB0YWcuc2V0QXR0cmlidXRlKCdub25jZScsIHRoaXMuX25vbmNlKTtcbiAgICB0YWcudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgdGFnLnNldEF0dHJpYnV0ZShcImRhdGEtXCIgKyBuYW1lLCAnJyk7XG5cbiAgICBpZiAoY3NzU3RyaW5nKSB7XG4gICAgICB0YWcuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzU3RyaW5nKSk7XG4gICAgfVxuXG4gICAgdmFyIGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG5cbiAgICBpZiAocmVsYXRpdmVUb1RhZykge1xuICAgICAgaGVhZC5pbnNlcnRCZWZvcmUodGFnLCByZWxhdGl2ZVRvVGFnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVhZC5hcHBlbmRDaGlsZCh0YWcpO1xuICAgIH1cblxuICAgIHJldHVybiB0YWc7XG4gIH07XG5cbiAgX2NyZWF0ZUNsYXNzKFN0eWxlU2hlZXQsIFt7XG4gICAga2V5OiBcImxlbmd0aFwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3J1bGVzQ291bnQ7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFN0eWxlU2hlZXQ7XG59KCk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gU3R5bGVTaGVldDtcblxuZnVuY3Rpb24gaW52YXJpYW50KGNvbmRpdGlvbiwgbWVzc2FnZSkge1xuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlN0eWxlU2hlZXQ6IFwiICsgbWVzc2FnZSArIFwiLlwiKTtcbiAgfVxufSIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5mbHVzaCA9IGZsdXNoO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5cbnZhciBfc3R5bGVzaGVldFJlZ2lzdHJ5ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9zdHlsZXNoZWV0LXJlZ2lzdHJ5XCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0c0xvb3NlKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcy5wcm90b3R5cGUpOyBzdWJDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBzdWJDbGFzczsgc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgc3R5bGVTaGVldFJlZ2lzdHJ5ID0gbmV3IF9zdHlsZXNoZWV0UmVnaXN0cnlbXCJkZWZhdWx0XCJdKCk7XG5cbnZhciBKU1hTdHlsZSA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX0NvbXBvbmVudCkge1xuICBfaW5oZXJpdHNMb29zZShKU1hTdHlsZSwgX0NvbXBvbmVudCk7XG5cbiAgZnVuY3Rpb24gSlNYU3R5bGUocHJvcHMpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICBfdGhpcyA9IF9Db21wb25lbnQuY2FsbCh0aGlzLCBwcm9wcykgfHwgdGhpcztcbiAgICBfdGhpcy5wcmV2UHJvcHMgPSB7fTtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICBKU1hTdHlsZS5keW5hbWljID0gZnVuY3Rpb24gZHluYW1pYyhpbmZvKSB7XG4gICAgcmV0dXJuIGluZm8ubWFwKGZ1bmN0aW9uICh0YWdJbmZvKSB7XG4gICAgICB2YXIgYmFzZUlkID0gdGFnSW5mb1swXTtcbiAgICAgIHZhciBwcm9wcyA9IHRhZ0luZm9bMV07XG4gICAgICByZXR1cm4gc3R5bGVTaGVldFJlZ2lzdHJ5LmNvbXB1dGVJZChiYXNlSWQsIHByb3BzKTtcbiAgICB9KS5qb2luKCcgJyk7XG4gIH0gLy8gcHJvYmFibHkgZmFzdGVyIHRoYW4gUHVyZUNvbXBvbmVudCAoc2hhbGxvd0VxdWFsKVxuICA7XG5cbiAgdmFyIF9wcm90byA9IEpTWFN0eWxlLnByb3RvdHlwZTtcblxuICBfcHJvdG8uc2hvdWxkQ29tcG9uZW50VXBkYXRlID0gZnVuY3Rpb24gc2hvdWxkQ29tcG9uZW50VXBkYXRlKG90aGVyUHJvcHMpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5pZCAhPT0gb3RoZXJQcm9wcy5pZCB8fCAvLyBXZSBkbyB0aGlzIGNoZWNrIGJlY2F1c2UgYGR5bmFtaWNgIGlzIGFuIGFycmF5IG9mIHN0cmluZ3Mgb3IgdW5kZWZpbmVkLlxuICAgIC8vIFRoZXNlIGFyZSB0aGUgY29tcHV0ZWQgdmFsdWVzIGZvciBkeW5hbWljIHN0eWxlcy5cbiAgICBTdHJpbmcodGhpcy5wcm9wcy5keW5hbWljKSAhPT0gU3RyaW5nKG90aGVyUHJvcHMuZHluYW1pYyk7XG4gIH07XG5cbiAgX3Byb3RvLmNvbXBvbmVudFdpbGxVbm1vdW50ID0gZnVuY3Rpb24gY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgc3R5bGVTaGVldFJlZ2lzdHJ5LnJlbW92ZSh0aGlzLnByb3BzKTtcbiAgfTtcblxuICBfcHJvdG8ucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIC8vIFRoaXMgaXMgYSB3b3JrYXJvdW5kIHRvIG1ha2UgdGhlIHNpZGUgZWZmZWN0IGFzeW5jIHNhZmUgaW4gdGhlIFwicmVuZGVyXCIgcGhhc2UuXG4gICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS96ZWl0L3N0eWxlZC1qc3gvcHVsbC80ODRcbiAgICBpZiAodGhpcy5zaG91bGRDb21wb25lbnRVcGRhdGUodGhpcy5wcmV2UHJvcHMpKSB7XG4gICAgICAvLyBVcGRhdGVzXG4gICAgICBpZiAodGhpcy5wcmV2UHJvcHMuaWQpIHtcbiAgICAgICAgc3R5bGVTaGVldFJlZ2lzdHJ5LnJlbW92ZSh0aGlzLnByZXZQcm9wcyk7XG4gICAgICB9XG5cbiAgICAgIHN0eWxlU2hlZXRSZWdpc3RyeS5hZGQodGhpcy5wcm9wcyk7XG4gICAgICB0aGlzLnByZXZQcm9wcyA9IHRoaXMucHJvcHM7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG5cbiAgcmV0dXJuIEpTWFN0eWxlO1xufShfcmVhY3QuQ29tcG9uZW50KTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBKU1hTdHlsZTtcblxuZnVuY3Rpb24gZmx1c2goKSB7XG4gIHZhciBjc3NSdWxlcyA9IHN0eWxlU2hlZXRSZWdpc3RyeS5jc3NSdWxlcygpO1xuICBzdHlsZVNoZWV0UmVnaXN0cnkuZmx1c2goKTtcbiAgcmV0dXJuIGNzc1J1bGVzO1xufSIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBfc3RyaW5nSGFzaCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcInN0cmluZy1oYXNoXCIpKTtcblxudmFyIF9zdHlsZXNoZWV0ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9saWIvc3R5bGVzaGVldFwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG52YXIgc2FuaXRpemUgPSBmdW5jdGlvbiBzYW5pdGl6ZShydWxlKSB7XG4gIHJldHVybiBydWxlLnJlcGxhY2UoL1xcL3N0eWxlL2dpLCAnXFxcXC9zdHlsZScpO1xufTtcblxudmFyIFN0eWxlU2hlZXRSZWdpc3RyeSA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFN0eWxlU2hlZXRSZWdpc3RyeShfdGVtcCkge1xuICAgIHZhciBfcmVmID0gX3RlbXAgPT09IHZvaWQgMCA/IHt9IDogX3RlbXAsXG4gICAgICAgIF9yZWYkc3R5bGVTaGVldCA9IF9yZWYuc3R5bGVTaGVldCxcbiAgICAgICAgc3R5bGVTaGVldCA9IF9yZWYkc3R5bGVTaGVldCA9PT0gdm9pZCAwID8gbnVsbCA6IF9yZWYkc3R5bGVTaGVldCxcbiAgICAgICAgX3JlZiRvcHRpbWl6ZUZvclNwZWVkID0gX3JlZi5vcHRpbWl6ZUZvclNwZWVkLFxuICAgICAgICBvcHRpbWl6ZUZvclNwZWVkID0gX3JlZiRvcHRpbWl6ZUZvclNwZWVkID09PSB2b2lkIDAgPyBmYWxzZSA6IF9yZWYkb3B0aW1pemVGb3JTcGVlZCxcbiAgICAgICAgX3JlZiRpc0Jyb3dzZXIgPSBfcmVmLmlzQnJvd3NlcixcbiAgICAgICAgaXNCcm93c2VyID0gX3JlZiRpc0Jyb3dzZXIgPT09IHZvaWQgMCA/IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnIDogX3JlZiRpc0Jyb3dzZXI7XG5cbiAgICB0aGlzLl9zaGVldCA9IHN0eWxlU2hlZXQgfHwgbmV3IF9zdHlsZXNoZWV0W1wiZGVmYXVsdFwiXSh7XG4gICAgICBuYW1lOiAnc3R5bGVkLWpzeCcsXG4gICAgICBvcHRpbWl6ZUZvclNwZWVkOiBvcHRpbWl6ZUZvclNwZWVkXG4gICAgfSk7XG5cbiAgICB0aGlzLl9zaGVldC5pbmplY3QoKTtcblxuICAgIGlmIChzdHlsZVNoZWV0ICYmIHR5cGVvZiBvcHRpbWl6ZUZvclNwZWVkID09PSAnYm9vbGVhbicpIHtcbiAgICAgIHRoaXMuX3NoZWV0LnNldE9wdGltaXplRm9yU3BlZWQob3B0aW1pemVGb3JTcGVlZCk7XG5cbiAgICAgIHRoaXMuX29wdGltaXplRm9yU3BlZWQgPSB0aGlzLl9zaGVldC5pc09wdGltaXplRm9yU3BlZWQoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9pc0Jyb3dzZXIgPSBpc0Jyb3dzZXI7XG4gICAgdGhpcy5fZnJvbVNlcnZlciA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9pbmRpY2VzID0ge307XG4gICAgdGhpcy5faW5zdGFuY2VzQ291bnRzID0ge307XG4gICAgdGhpcy5jb21wdXRlSWQgPSB0aGlzLmNyZWF0ZUNvbXB1dGVJZCgpO1xuICAgIHRoaXMuY29tcHV0ZVNlbGVjdG9yID0gdGhpcy5jcmVhdGVDb21wdXRlU2VsZWN0b3IoKTtcbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBTdHlsZVNoZWV0UmVnaXN0cnkucHJvdG90eXBlO1xuXG4gIF9wcm90by5hZGQgPSBmdW5jdGlvbiBhZGQocHJvcHMpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKHVuZGVmaW5lZCA9PT0gdGhpcy5fb3B0aW1pemVGb3JTcGVlZCkge1xuICAgICAgdGhpcy5fb3B0aW1pemVGb3JTcGVlZCA9IEFycmF5LmlzQXJyYXkocHJvcHMuY2hpbGRyZW4pO1xuXG4gICAgICB0aGlzLl9zaGVldC5zZXRPcHRpbWl6ZUZvclNwZWVkKHRoaXMuX29wdGltaXplRm9yU3BlZWQpO1xuXG4gICAgICB0aGlzLl9vcHRpbWl6ZUZvclNwZWVkID0gdGhpcy5fc2hlZXQuaXNPcHRpbWl6ZUZvclNwZWVkKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2lzQnJvd3NlciAmJiAhdGhpcy5fZnJvbVNlcnZlcikge1xuICAgICAgdGhpcy5fZnJvbVNlcnZlciA9IHRoaXMuc2VsZWN0RnJvbVNlcnZlcigpO1xuICAgICAgdGhpcy5faW5zdGFuY2VzQ291bnRzID0gT2JqZWN0LmtleXModGhpcy5fZnJvbVNlcnZlcikucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHRhZ05hbWUpIHtcbiAgICAgICAgYWNjW3RhZ05hbWVdID0gMDtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sIHt9KTtcbiAgICB9XG5cbiAgICB2YXIgX3RoaXMkZ2V0SWRBbmRSdWxlcyA9IHRoaXMuZ2V0SWRBbmRSdWxlcyhwcm9wcyksXG4gICAgICAgIHN0eWxlSWQgPSBfdGhpcyRnZXRJZEFuZFJ1bGVzLnN0eWxlSWQsXG4gICAgICAgIHJ1bGVzID0gX3RoaXMkZ2V0SWRBbmRSdWxlcy5ydWxlczsgLy8gRGVkdXBpbmc6IGp1c3QgaW5jcmVhc2UgdGhlIGluc3RhbmNlcyBjb3VudC5cblxuXG4gICAgaWYgKHN0eWxlSWQgaW4gdGhpcy5faW5zdGFuY2VzQ291bnRzKSB7XG4gICAgICB0aGlzLl9pbnN0YW5jZXNDb3VudHNbc3R5bGVJZF0gKz0gMTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgaW5kaWNlcyA9IHJ1bGVzLm1hcChmdW5jdGlvbiAocnVsZSkge1xuICAgICAgcmV0dXJuIF90aGlzLl9zaGVldC5pbnNlcnRSdWxlKHJ1bGUpO1xuICAgIH0pIC8vIEZpbHRlciBvdXQgaW52YWxpZCBydWxlc1xuICAgIC5maWx0ZXIoZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICByZXR1cm4gaW5kZXggIT09IC0xO1xuICAgIH0pO1xuICAgIHRoaXMuX2luZGljZXNbc3R5bGVJZF0gPSBpbmRpY2VzO1xuICAgIHRoaXMuX2luc3RhbmNlc0NvdW50c1tzdHlsZUlkXSA9IDE7XG4gIH07XG5cbiAgX3Byb3RvLnJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZShwcm9wcykge1xuICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgdmFyIF90aGlzJGdldElkQW5kUnVsZXMyID0gdGhpcy5nZXRJZEFuZFJ1bGVzKHByb3BzKSxcbiAgICAgICAgc3R5bGVJZCA9IF90aGlzJGdldElkQW5kUnVsZXMyLnN0eWxlSWQ7XG5cbiAgICBpbnZhcmlhbnQoc3R5bGVJZCBpbiB0aGlzLl9pbnN0YW5jZXNDb3VudHMsIFwic3R5bGVJZDogYFwiICsgc3R5bGVJZCArIFwiYCBub3QgZm91bmRcIik7XG4gICAgdGhpcy5faW5zdGFuY2VzQ291bnRzW3N0eWxlSWRdIC09IDE7XG5cbiAgICBpZiAodGhpcy5faW5zdGFuY2VzQ291bnRzW3N0eWxlSWRdIDwgMSkge1xuICAgICAgdmFyIHRhZ0Zyb21TZXJ2ZXIgPSB0aGlzLl9mcm9tU2VydmVyICYmIHRoaXMuX2Zyb21TZXJ2ZXJbc3R5bGVJZF07XG5cbiAgICAgIGlmICh0YWdGcm9tU2VydmVyKSB7XG4gICAgICAgIHRhZ0Zyb21TZXJ2ZXIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0YWdGcm9tU2VydmVyKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2Zyb21TZXJ2ZXJbc3R5bGVJZF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9pbmRpY2VzW3N0eWxlSWRdLmZvckVhY2goZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzMi5fc2hlZXQuZGVsZXRlUnVsZShpbmRleCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9pbmRpY2VzW3N0eWxlSWRdO1xuICAgICAgfVxuXG4gICAgICBkZWxldGUgdGhpcy5faW5zdGFuY2VzQ291bnRzW3N0eWxlSWRdO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8udXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlKHByb3BzLCBuZXh0UHJvcHMpIHtcbiAgICB0aGlzLmFkZChuZXh0UHJvcHMpO1xuICAgIHRoaXMucmVtb3ZlKHByb3BzKTtcbiAgfTtcblxuICBfcHJvdG8uZmx1c2ggPSBmdW5jdGlvbiBmbHVzaCgpIHtcbiAgICB0aGlzLl9zaGVldC5mbHVzaCgpO1xuXG4gICAgdGhpcy5fc2hlZXQuaW5qZWN0KCk7XG5cbiAgICB0aGlzLl9mcm9tU2VydmVyID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2luZGljZXMgPSB7fTtcbiAgICB0aGlzLl9pbnN0YW5jZXNDb3VudHMgPSB7fTtcbiAgICB0aGlzLmNvbXB1dGVJZCA9IHRoaXMuY3JlYXRlQ29tcHV0ZUlkKCk7XG4gICAgdGhpcy5jb21wdXRlU2VsZWN0b3IgPSB0aGlzLmNyZWF0ZUNvbXB1dGVTZWxlY3RvcigpO1xuICB9O1xuXG4gIF9wcm90by5jc3NSdWxlcyA9IGZ1bmN0aW9uIGNzc1J1bGVzKCkge1xuICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgdmFyIGZyb21TZXJ2ZXIgPSB0aGlzLl9mcm9tU2VydmVyID8gT2JqZWN0LmtleXModGhpcy5fZnJvbVNlcnZlcikubWFwKGZ1bmN0aW9uIChzdHlsZUlkKSB7XG4gICAgICByZXR1cm4gW3N0eWxlSWQsIF90aGlzMy5fZnJvbVNlcnZlcltzdHlsZUlkXV07XG4gICAgfSkgOiBbXTtcblxuICAgIHZhciBjc3NSdWxlcyA9IHRoaXMuX3NoZWV0LmNzc1J1bGVzKCk7XG5cbiAgICByZXR1cm4gZnJvbVNlcnZlci5jb25jYXQoT2JqZWN0LmtleXModGhpcy5faW5kaWNlcykubWFwKGZ1bmN0aW9uIChzdHlsZUlkKSB7XG4gICAgICByZXR1cm4gW3N0eWxlSWQsIF90aGlzMy5faW5kaWNlc1tzdHlsZUlkXS5tYXAoZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIHJldHVybiBjc3NSdWxlc1tpbmRleF0uY3NzVGV4dDtcbiAgICAgIH0pLmpvaW4oX3RoaXMzLl9vcHRpbWl6ZUZvclNwZWVkID8gJycgOiAnXFxuJyldO1xuICAgIH0pIC8vIGZpbHRlciBvdXQgZW1wdHkgcnVsZXNcbiAgICAuZmlsdGVyKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICByZXR1cm4gQm9vbGVhbihydWxlWzFdKTtcbiAgICB9KSk7XG4gIH1cbiAgLyoqXG4gICAqIGNyZWF0ZUNvbXB1dGVJZFxuICAgKlxuICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdG8gY29tcHV0ZSBhbmQgbWVtb2l6ZSBhIGpzeCBpZCBmcm9tIGEgYmFzZWRJZCBhbmQgb3B0aW9uYWxseSBwcm9wcy5cbiAgICovXG4gIDtcblxuICBfcHJvdG8uY3JlYXRlQ29tcHV0ZUlkID0gZnVuY3Rpb24gY3JlYXRlQ29tcHV0ZUlkKCkge1xuICAgIHZhciBjYWNoZSA9IHt9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoYmFzZUlkLCBwcm9wcykge1xuICAgICAgaWYgKCFwcm9wcykge1xuICAgICAgICByZXR1cm4gXCJqc3gtXCIgKyBiYXNlSWQ7XG4gICAgICB9XG5cbiAgICAgIHZhciBwcm9wc1RvU3RyaW5nID0gU3RyaW5nKHByb3BzKTtcbiAgICAgIHZhciBrZXkgPSBiYXNlSWQgKyBwcm9wc1RvU3RyaW5nOyAvLyByZXR1cm4gYGpzeC0ke2hhc2hTdHJpbmcoYCR7YmFzZUlkfS0ke3Byb3BzVG9TdHJpbmd9YCl9YFxuXG4gICAgICBpZiAoIWNhY2hlW2tleV0pIHtcbiAgICAgICAgY2FjaGVba2V5XSA9IFwianN4LVwiICsgKDAsIF9zdHJpbmdIYXNoW1wiZGVmYXVsdFwiXSkoYmFzZUlkICsgXCItXCIgKyBwcm9wc1RvU3RyaW5nKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNhY2hlW2tleV07XG4gICAgfTtcbiAgfVxuICAvKipcbiAgICogY3JlYXRlQ29tcHV0ZVNlbGVjdG9yXG4gICAqXG4gICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0byBjb21wdXRlIGFuZCBtZW1vaXplIGR5bmFtaWMgc2VsZWN0b3JzLlxuICAgKi9cbiAgO1xuXG4gIF9wcm90by5jcmVhdGVDb21wdXRlU2VsZWN0b3IgPSBmdW5jdGlvbiBjcmVhdGVDb21wdXRlU2VsZWN0b3Ioc2VsZWN0b1BsYWNlaG9sZGVyUmVnZXhwKSB7XG4gICAgaWYgKHNlbGVjdG9QbGFjZWhvbGRlclJlZ2V4cCA9PT0gdm9pZCAwKSB7XG4gICAgICBzZWxlY3RvUGxhY2Vob2xkZXJSZWdleHAgPSAvX19qc3gtc3R5bGUtZHluYW1pYy1zZWxlY3Rvci9nO1xuICAgIH1cblxuICAgIHZhciBjYWNoZSA9IHt9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoaWQsIGNzcykge1xuICAgICAgLy8gU2FuaXRpemUgU1NSLWVkIENTUy5cbiAgICAgIC8vIENsaWVudCBzaWRlIGNvZGUgZG9lc24ndCBuZWVkIHRvIGJlIHNhbml0aXplZCBzaW5jZSB3ZSB1c2VcbiAgICAgIC8vIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlIChkZXYpIGFuZCB0aGUgQ1NTT00gYXBpIHNoZWV0Lmluc2VydFJ1bGUgKHByb2QpLlxuICAgICAgaWYgKCF0aGlzLl9pc0Jyb3dzZXIpIHtcbiAgICAgICAgY3NzID0gc2FuaXRpemUoY3NzKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGlkY3NzID0gaWQgKyBjc3M7XG5cbiAgICAgIGlmICghY2FjaGVbaWRjc3NdKSB7XG4gICAgICAgIGNhY2hlW2lkY3NzXSA9IGNzcy5yZXBsYWNlKHNlbGVjdG9QbGFjZWhvbGRlclJlZ2V4cCwgaWQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY2FjaGVbaWRjc3NdO1xuICAgIH07XG4gIH07XG5cbiAgX3Byb3RvLmdldElkQW5kUnVsZXMgPSBmdW5jdGlvbiBnZXRJZEFuZFJ1bGVzKHByb3BzKSB7XG4gICAgdmFyIF90aGlzNCA9IHRoaXM7XG5cbiAgICB2YXIgY3NzID0gcHJvcHMuY2hpbGRyZW4sXG4gICAgICAgIGR5bmFtaWMgPSBwcm9wcy5keW5hbWljLFxuICAgICAgICBpZCA9IHByb3BzLmlkO1xuXG4gICAgaWYgKGR5bmFtaWMpIHtcbiAgICAgIHZhciBzdHlsZUlkID0gdGhpcy5jb21wdXRlSWQoaWQsIGR5bmFtaWMpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3R5bGVJZDogc3R5bGVJZCxcbiAgICAgICAgcnVsZXM6IEFycmF5LmlzQXJyYXkoY3NzKSA/IGNzcy5tYXAoZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXM0LmNvbXB1dGVTZWxlY3RvcihzdHlsZUlkLCBydWxlKTtcbiAgICAgICAgfSkgOiBbdGhpcy5jb21wdXRlU2VsZWN0b3Ioc3R5bGVJZCwgY3NzKV1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHN0eWxlSWQ6IHRoaXMuY29tcHV0ZUlkKGlkKSxcbiAgICAgIHJ1bGVzOiBBcnJheS5pc0FycmF5KGNzcykgPyBjc3MgOiBbY3NzXVxuICAgIH07XG4gIH1cbiAgLyoqXG4gICAqIHNlbGVjdEZyb21TZXJ2ZXJcbiAgICpcbiAgICogQ29sbGVjdHMgc3R5bGUgdGFncyBmcm9tIHRoZSBkb2N1bWVudCB3aXRoIGlkIF9fanN4LVhYWFxuICAgKi9cbiAgO1xuXG4gIF9wcm90by5zZWxlY3RGcm9tU2VydmVyID0gZnVuY3Rpb24gc2VsZWN0RnJvbVNlcnZlcigpIHtcbiAgICB2YXIgZWxlbWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbaWRePVwiX19qc3gtXCJdJykpO1xuICAgIHJldHVybiBlbGVtZW50cy5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgZWxlbWVudCkge1xuICAgICAgdmFyIGlkID0gZWxlbWVudC5pZC5zbGljZSgyKTtcbiAgICAgIGFjY1tpZF0gPSBlbGVtZW50O1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSk7XG4gIH07XG5cbiAgcmV0dXJuIFN0eWxlU2hlZXRSZWdpc3RyeTtcbn0oKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBTdHlsZVNoZWV0UmVnaXN0cnk7XG5cbmZ1bmN0aW9uIGludmFyaWFudChjb25kaXRpb24sIG1lc3NhZ2UpIHtcbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJTdHlsZVNoZWV0UmVnaXN0cnk6IFwiICsgbWVzc2FnZSArIFwiLlwiKTtcbiAgfVxufSIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9kaXN0L3N0eWxlJylcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3JpZ2luYWxNb2R1bGUpIHtcblx0aWYgKCFvcmlnaW5hbE1vZHVsZS53ZWJwYWNrUG9seWZpbGwpIHtcblx0XHR2YXIgbW9kdWxlID0gT2JqZWN0LmNyZWF0ZShvcmlnaW5hbE1vZHVsZSk7XG5cdFx0Ly8gbW9kdWxlLnBhcmVudCA9IHVuZGVmaW5lZCBieSBkZWZhdWx0XG5cdFx0aWYgKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwibG9hZGVkXCIsIHtcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmw7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJpZFwiLCB7XG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwiZXhwb3J0c1wiLCB7XG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlXG5cdFx0fSk7XG5cdFx0bW9kdWxlLndlYnBhY2tQb2x5ZmlsbCA9IDE7XG5cdH1cblx0cmV0dXJuIG1vZHVsZTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuXHRpZiAoIW1vZHVsZS53ZWJwYWNrUG9seWZpbGwpIHtcblx0XHRtb2R1bGUuZGVwcmVjYXRlID0gZnVuY3Rpb24oKSB7fTtcblx0XHRtb2R1bGUucGF0aHMgPSBbXTtcblx0XHQvLyBtb2R1bGUucGFyZW50ID0gdW5kZWZpbmVkIGJ5IGRlZmF1bHRcblx0XHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJsb2FkZWRcIiwge1xuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBtb2R1bGUubDtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImlkXCIsIHtcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0bW9kdWxlLndlYnBhY2tQb2x5ZmlsbCA9IDE7XG5cdH1cblx0cmV0dXJuIG1vZHVsZTtcbn07XG4iLCJpbXBvcnQgQmFuZEpTIGZyb20gJy4uL2JhbmQuanMvZGlzdC9iYW5kJztcclxuaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcclxuXHJcbmNsYXNzIEF1ZGlvIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG5cdFx0c3VwZXIocHJvcHMpO1xyXG5cdFx0dGhpcy5zdGF0ZSA9IHsgcGxheWVyOiBudWxsIH07XHJcblx0fVxyXG5cdHBsYXlIYW5kbGVyID0gKCkgPT4ge1xyXG5cdFx0aWYgKHRoaXMuc3RhdGUucGxheWVyKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHRoaXMuc3RhdGUucGxheWVyKTtcclxuXHRcdFx0dGhpcy5zdGF0ZS5wbGF5ZXIuc3RvcCgpO1xyXG5cdFx0fVxyXG5cdFx0bGV0IGNvbmR1Y3RvciA9IG5ldyBCYW5kSlMoKTtcclxuXHRcdGxldCBzZWN0aW9uc1Byb3BzID0gW107XHJcblx0XHR0aGlzLnByb3BzLmFuYWx5c2lzLnNlY3Rpb25zLmZvckVhY2goKHNlY3Rpb24pID0+IHtcclxuXHRcdFx0c2VjdGlvbnNQcm9wcy5wdXNoKFtzZWN0aW9uLmR1cmF0aW9uICogMTAwMCwgc2VjdGlvbi50ZW1wb10pO1xyXG5cdFx0fSk7XHJcblx0XHRjb25zb2xlLmxvZyhzZWN0aW9uc1Byb3BzKTtcclxuXHRcdGNvbmR1Y3Rvci5zZXRUaW1lU2lnbmF0dXJlKDQsIDQpO1xyXG5cdFx0Y29uZHVjdG9yLnNldFRlbXBvKHNlY3Rpb25zUHJvcHNbMF1bMV0pO1xyXG5cdFx0bGV0IHBpYW5vID0gY29uZHVjdG9yLmNyZWF0ZUluc3RydW1lbnQoJ3NpbmUnKTtcclxuXHRcdHBpYW5vLm5vdGUoJ3F1YXJ0ZXInLCAnRzMnKTtcclxuXHRcdHRoaXMuc2V0U3RhdGUoeyBwbGF5ZXI6IGNvbmR1Y3Rvci5maW5pc2goKSB9LCAoKSA9PiB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHRoaXMuc3RhdGUucGxheWVyKTtcclxuXHRcdFx0dGhpcy5zdGF0ZS5wbGF5ZXIubG9vcCh0cnVlKTtcclxuXHRcdFx0cmh5dGhtVGltZXIoc2VjdGlvbnNQcm9wc1swXVswXSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRsZXQgcmh5dGhtVGltZXIgPSAodGltZSkgPT4ge1xyXG5cdFx0XHR0aGlzLnN0YXRlLnBsYXllci5wbGF5KCk7XHJcblx0XHRcdHNlY3Rpb25zUHJvcHMuc2hpZnQoKTtcclxuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5zdGF0ZS5wbGF5ZXIuc3RvcCgpO1xyXG5cdFx0XHRcdGlmIChzZWN0aW9uc1Byb3BzLmxlbmd0aCAhPSAwKSB7XHJcblx0XHRcdFx0XHRjb25kdWN0b3Iuc2V0VGVtcG8oc2VjdGlvbnNQcm9wc1swXVsxXSk7XHJcblx0XHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgcGxheWVyOiBjb25kdWN0b3IuZmluaXNoKCkgfSk7XHJcblx0XHRcdFx0XHR0aGlzLnN0YXRlLnBsYXllci5sb29wKHRydWUpO1xyXG5cdFx0XHRcdFx0cmh5dGhtVGltZXIoc2VjdGlvbnNQcm9wc1swXVswXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCB0aW1lKTtcclxuXHRcdH07XHJcblx0fTtcclxuXHRyZW5kZXIoKSB7XHJcblx0XHRyZXR1cm4gPHAgb25DbGljaz17dGhpcy5wbGF5SGFuZGxlcn0+Y2xpY2sgTWU8L3A+O1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQXVkaW87XHJcbiIsImltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XHJcbmltcG9ydCBBdWRpbyBmcm9tICcuL0F1ZGlvJztcclxuY29uc3QgVHJhY2tzUmVzdWx0cyA9IHByb3BzID0+IHtcclxuXHRjb25zdCB0cmFja1JlZiA9IFJlYWN0LmNyZWF0ZVJlZigpO1xyXG5cdGxldCBhbmFseXNpcztcclxuXHRsZXQgW3NhLCBzYXNdID0gUmVhY3QudXNlU3RhdGUoYW5hbHlzaXMpO1xyXG5cclxuXHRsZXQgZ2V0QW5hbHlzaXMgPSBlID0+IHtcclxuXHRcdGF4aW9zXHJcblx0XHRcdC5nZXQoJ2h0dHBzOi8vYXBpLnNwb3RpZnkuY29tL3YxL2F1ZGlvLWFuYWx5c2lzLycgKyBlLnRhcmdldC5pZCwge1xyXG5cdFx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHRcdEF1dGhvcml6YXRpb246IHByb3BzLmF1dGhvcml6YXRpb25cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHRcdC50aGVuKGRhdGEgPT4ge1xyXG5cdFx0XHRcdHNhcyhkYXRhLmRhdGEpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGFuYWx5c2lzKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0LmNhdGNoKGVyciA9PiB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0fSk7XHJcblx0fTtcclxuXHJcblx0cmV0dXJuIChcclxuXHRcdDx1bCByZWY9e3RyYWNrUmVmfT5cclxuXHRcdFx0e3Byb3BzLnRyYWNrcy5tYXAodHJhY2sgPT4ge1xyXG5cdFx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0XHQ8bGkgaWQ9e3RyYWNrLmlkfSBrZXk9e3RyYWNrLmlkfSBvbkNsaWNrPXtnZXRBbmFseXNpc30+XHJcblx0XHRcdFx0XHRcdHt0cmFjay5uYW1lfSAtIHt0cmFjay5hcnRpc3RzWzBdLm5hbWV9ICh7dHJhY2sucG9wdWxhcml0eX0pXHJcblx0XHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH0pfVxyXG5cdFx0XHR7fVxyXG5cdFx0XHQ8QXVkaW8gYW5hbHlzaXM9e3NhfT48L0F1ZGlvPlxyXG5cdFx0PC91bD5cclxuXHQpO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgVHJhY2tzUmVzdWx0cztcclxuIiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IFJoeXRobSBmcm9tICcuL3JoeXRobSc7XHJcblxyXG5jbGFzcyBEZWZhdWx0IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuXHRyZW5kZXIoKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nYXBwJz5cclxuXHRcdFx0XHQ8aDE+Umh5dGhtIERldGVjdG9yPC9oMT5cclxuXHRcdFx0XHQ8aDI+U2VsZWN0IHlvdXIgc29uZyBhdCB0aGUgc2VhcmNoIGJhciBiZWxvdzwvaDI+XHJcblx0XHRcdFx0PFJoeXRobT48L1JoeXRobT5cclxuXHRcdFx0XHR7LypcdDxpbnB1dCB0eXBlPSd0ZXh0JyAvPiovfVxyXG5cdFx0XHRcdDxzdHlsZSBnbG9iYWwganN4PlxyXG5cdFx0XHRcdFx0e2BcclxuXHRcdFx0XHRcdFx0Ym9keSxcclxuXHRcdFx0XHRcdFx0aHRtbCxcclxuXHRcdFx0XHRcdFx0I3Jvb3Qge1xyXG5cdFx0XHRcdFx0XHRcdG1hcmdpbjogMDtcclxuXHRcdFx0XHRcdFx0XHRoZWlnaHQ6IDEwMCU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0KjphY3RpdmUsXHJcblx0XHRcdFx0XHRcdCo6Zm9jdXMge1xyXG5cdFx0XHRcdFx0XHRcdG91dGxpbmUtc3R5bGU6IG5vbmU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0KiB7XHJcblx0XHRcdFx0XHRcdFx0Ym94LXNpemluZzogYm9yZGVyLWJveDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHQjX19uZXh0IHtcclxuXHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBncmlkO1xyXG5cdFx0XHRcdFx0XHRcdGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byByaWdodCwgIzE0MWUzMCwgIzI0M2I1NSk7XHJcblx0XHRcdFx0XHRcdFx0aGVpZ2h0OiAxMDAlO1xyXG5cdFx0XHRcdFx0XHRcdHdpZHRoOiAxMDAlO1xyXG5cdFx0XHRcdFx0XHRcdGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcclxuXHRcdFx0XHRcdFx0XHRhbGlnbi1pdGVtczogY2VudGVyO1xyXG5cdFx0XHRcdFx0XHRcdG1heC1oZWlnaHQ6IDEwMCU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGB9XHJcblx0XHRcdFx0PC9zdHlsZT5cclxuXHRcdFx0XHQ8c3R5bGUganN4PntgXHJcblx0XHRcdFx0XHRoMSB7XHJcblx0XHRcdFx0XHRcdGZvbnQtc2l6ZTogM3JlbTtcclxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCAjZjc5ZDAwLCAjNjRmMzhjKTtcclxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZC1jbGlwOiB0ZXh0O1xyXG5cdFx0XHRcdFx0XHQtd2Via2l0LXRleHQtZmlsbC1jb2xvcjogdHJhbnNwYXJlbnQ7XHJcblx0XHRcdFx0XHRcdHRleHQtc2hhZG93OiAwcHggMHB4IDUwcHggIzFmZmM0NDJhO1xyXG5cdFx0XHRcdFx0XHRwb3NpdGlvbjogcmVsYXRpdmU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0YH08L3N0eWxlPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEZWZhdWx0O1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgRnJhZ21hbnQsIENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcclxuaW1wb3J0IFRyYWNrc1Jlc3VsdHMgZnJvbSAnLi9UcmFja3NSZXN1bHRzJztcclxuXHJcbmNsYXNzIFJoeXRobSBleHRlbmRzIENvbXBvbmVudCB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cdFx0dGhpcy5zdGF0ZSA9IHtcclxuXHRcdFx0dG9rZW46IG51bGwsXHJcblx0XHRcdHRyYWNrX2xpc3Q6IFtdLFxyXG5cdFx0XHRxdWVyeTogJydcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRjb21wb25lbnREaWRNb3VudCgpIHtcclxuXHRcdGNvbnN0IGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaFxyXG5cdFx0XHQuc3Vic3RyaW5nKDEpXHJcblx0XHRcdC5zcGxpdCgnJicpXHJcblx0XHRcdC5yZWR1Y2UoKGluaXRpYWwsIGl0ZW0pID0+IHtcclxuXHRcdFx0XHRpZiAoaXRlbSkge1xyXG5cdFx0XHRcdFx0dmFyIHBhcnRzID0gaXRlbS5zcGxpdCgnPScpO1xyXG5cdFx0XHRcdFx0aW5pdGlhbFtwYXJ0c1swXV0gPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gaW5pdGlhbDtcclxuXHRcdFx0fSwge30pO1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7IHRva2VuOiBoYXNoLmFjY2Vzc190b2tlbiwgdG9rZW5fdHlwZTogaGFzaC50b2tlbl90eXBlIH0pO1xyXG5cdH1cclxuXHJcblx0Z2V0VHJhY2tzID0gKCkgPT4ge1xyXG5cdFx0YXhpb3NcclxuXHRcdFx0LmdldChcclxuXHRcdFx0XHRgaHR0cHM6Ly9hcGkuc3BvdGlmeS5jb20vdjEvc2VhcmNoP3E9JHt0aGlzLnN0YXRlLnF1ZXJ5fSZ0eXBlPXRyYWNrJmxpbWl0PTVgLFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHRcdFx0QXV0aG9yaXphdGlvbjogYCR7dGhpcy5zdGF0ZS50b2tlbl90eXBlfSAke3RoaXMuc3RhdGUudG9rZW59YFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0KVxyXG5cdFx0XHQudGhlbihkYXRhID0+IHtcclxuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgdHJhY2tfbGlzdDogZGF0YS5kYXRhLnRyYWNrcy5pdGVtcyB9KTtcclxuXHRcdFx0fSlcclxuXHRcdFx0LmNhdGNoKGVyciA9PiB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0fSk7XHJcblx0fTtcclxuXHJcblx0Y2hhbmdlSGFuZGxlciA9ICgpID0+IHtcclxuXHRcdHRoaXMuc2V0U3RhdGUoeyBxdWVyeTogdGhpcy5zZWFyY2gudmFsdWUgfSwgKCkgPT4ge1xyXG5cdFx0XHRpZiAodGhpcy5zdGF0ZS5xdWVyeSAmJiB0aGlzLnN0YXRlLnF1ZXJ5Lmxlbmd0aCA+IDEpIHtcclxuXHRcdFx0XHR0aGlzLmdldFRyYWNrcygpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoeyB0cmFja19saXN0OiBbXSB9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PD5cclxuXHRcdFx0XHR7IXRoaXMuc3RhdGUudG9rZW4gJiYgKFxyXG5cdFx0XHRcdFx0PGJ1dHRvbj5cclxuXHRcdFx0XHRcdFx0PGEgaHJlZj0naHR0cHM6Ly9hY2NvdW50cy5zcG90aWZ5LmNvbS9hdXRob3JpemU/Y2xpZW50X2lkPTU4YjljNDA2M2M5MDRjZGE4N2FmODAxODZhNzMyZjAxJnJlZGlyZWN0X3VyaT1odHRwOiUyRiUyRmxvY2FsaG9zdDozMDAwJnJlc3BvbnNlX3R5cGU9dG9rZW4nPlxyXG5cdFx0XHRcdFx0XHRcdExvZ2luIFdpdGggU3BvdGlmeVxyXG5cdFx0XHRcdFx0XHQ8L2E+XHJcblx0XHRcdFx0XHQ8L2J1dHRvbj5cclxuXHRcdFx0XHQpfVxyXG5cdFx0XHRcdHt0aGlzLnN0YXRlLnRva2VuICYmIChcclxuXHRcdFx0XHRcdDw+XHJcblx0XHRcdFx0XHRcdDxpbnB1dFxyXG5cdFx0XHRcdFx0XHRcdHJlZj17aW5wdXQgPT4gKHRoaXMuc2VhcmNoID0gaW5wdXQpfVxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hhbmdlPXt0aGlzLmNoYW5nZUhhbmRsZXJ9XHJcblx0XHRcdFx0XHRcdC8+XHJcblx0XHRcdFx0XHRcdDxUcmFja3NSZXN1bHRzXHJcblx0XHRcdFx0XHRcdFx0YXV0aG9yaXphdGlvbj17YCR7dGhpcy5zdGF0ZS50b2tlbl90eXBlfSAke3RoaXMuc3RhdGUudG9rZW59YH1cclxuXHRcdFx0XHRcdFx0XHR0cmFja3M9e3RoaXMuc3RhdGUudHJhY2tfbGlzdH1cclxuXHRcdFx0XHRcdFx0PjwvVHJhY2tzUmVzdWx0cz5cclxuXHRcdFx0XHRcdDwvPlxyXG5cdFx0XHRcdCl9XHJcblx0XHRcdDwvPlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFJoeXRobTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBkbGxfZWM3ZDljMDI0OWIyZWY1MmI3NGM7Il0sInNvdXJjZVJvb3QiOiIifQ==