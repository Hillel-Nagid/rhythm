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
      if (typeof _this.state.player == 'function') {
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

      function rhythmTimer(time) {
        Audio.state.player.play();
        sectionsProps.shift();
        setTimeout(function () {
          Audio.state.player.stop();

          if (sectionsProps.length != 0) {
            conductor.setTempo(sectionsProps[0][1]);
            Audio.setState({
              player: conductor.finish()
            });
            Audio.state.player.loop(true);
            rhythmTimer(sectionsProps[0][0]);
          }
        }, time);
      }
    });

    _this.state = {
      player: ''
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9iYW5kLmpzL2Rpc3QvYmFuZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vYXJyYXlMaWtlVG9BcnJheS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vYXJyYXlXaXRoSG9sZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2Fzc2VydFRoaXNJbml0aWFsaXplZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vY2xhc3NDYWxsQ2hlY2suanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2NyZWF0ZUNsYXNzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9kZWZpbmVQcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vZ2V0UHJvdG90eXBlT2YuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2luaGVyaXRzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9pdGVyYWJsZVRvQXJyYXlMaW1pdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vbm9uSXRlcmFibGVSZXN0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9zZXRQcm90b3R5cGVPZi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vc2xpY2VkVG9BcnJheS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vdHlwZW9mLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9hZGFwdGVycy94aHIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9heGlvcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsVG9rZW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvaXNDYW5jZWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0F4aW9zLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9JbnRlcmNlcHRvck1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2J1aWxkRnVsbFBhdGguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2NyZWF0ZUVycm9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9kaXNwYXRjaFJlcXVlc3QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2VuaGFuY2VFcnJvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvbWVyZ2VDb25maWcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL3NldHRsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvdHJhbnNmb3JtRGF0YS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2RlZmF1bHRzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9idWlsZFVSTC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29tYmluZVVSTHMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2Nvb2tpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvcGFyc2VIZWFkZXJzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9zcHJlYWQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWNsaWVudC1wYWdlcy1sb2FkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL3JlYWN0L2luZGV4LmpzIGZyb20gZGxsLXJlZmVyZW5jZSBkbGxfZWM3ZDljMDI0OWIyZWY1MmI3NGMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0cmluZy1oYXNoL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHlsZWQtanN4L2Rpc3QvbGliL3N0eWxlc2hlZXQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0eWxlZC1qc3gvZGlzdC9zdHlsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3R5bGVkLWpzeC9kaXN0L3N0eWxlc2hlZXQtcmVnaXN0cnkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0eWxlZC1qc3gvc3R5bGUuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2hhcm1vbnktbW9kdWxlLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vLy4vcGFnZXMvQXVkaW8uanMiLCJ3ZWJwYWNrOi8vLy4vcGFnZXMvVHJhY2tzUmVzdWx0cy5qcyIsIndlYnBhY2s6Ly8vLi9wYWdlcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9wYWdlcy9yaHl0aG0uanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZGxsX2VjN2Q5YzAyNDliMmVmNTJiNzRjXCIiXSwibmFtZXMiOlsiZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJkZWZpbmUiLCJ0IiwibiIsInIiLCJzIiwibyIsInUiLCJhIiwicmVxdWlyZSIsImkiLCJFcnJvciIsImYiLCJjYWxsIiwibGVuZ3RoIiwiX2RlcmVxXyIsImRlZmluaXRpb24iLCJ3aW5kb3ciLCJBdWRpb0NvbnRleHQiLCJ3ZWJraXRBdWRpb0NvbnRleHQiLCJDb25kdWN0b3IiLCJwYWNrcyIsImluc3RydW1lbnQiLCJyaHl0aG0iLCJ0dW5pbmciLCJjb25kdWN0b3IiLCJwbGF5ZXIiLCJub29wIiwic2lnbmF0dXJlVG9Ob3RlTGVuZ3RoUmF0aW8iLCJwaXRjaGVzIiwibm90ZXMiLCJhdWRpb0NvbnRleHQiLCJtYXN0ZXJWb2x1bWVMZXZlbCIsIm1hc3RlclZvbHVtZSIsImNyZWF0ZUdhaW4iLCJjb25uZWN0IiwiZGVzdGluYXRpb24iLCJiZWF0c1BlckJhciIsIm5vdGVHZXRzQmVhdCIsInRlbXBvIiwiaW5zdHJ1bWVudHMiLCJ0b3RhbER1cmF0aW9uIiwiY3VycmVudFNlY29uZHMiLCJwZXJjZW50YWdlQ29tcGxldGUiLCJub3RlQnVmZmVyTGVuZ3RoIiwib25UaWNrZXJDYWxsYmFjayIsIm9uRmluaXNoZWRDYWxsYmFjayIsIm9uRHVyYXRpb25DaGFuZ2VDYWxsYmFjayIsImxvYWQiLCJqc29uIiwiZGVzdHJveSIsInRpbWVTaWduYXR1cmUiLCJzZXRUaW1lU2lnbmF0dXJlIiwic2V0VGVtcG8iLCJpbnN0cnVtZW50TGlzdCIsImhhc093blByb3BlcnR5IiwiY3JlYXRlSW5zdHJ1bWVudCIsIm5hbWUiLCJwYWNrIiwiaW5zdCIsImluZGV4Iiwibm90ZSIsIm5vdGVQYXJ0cyIsInNwbGl0IiwicmVzdCIsInR5cGUiLCJwaXRjaCIsInRpZSIsImZpbmlzaCIsIkluc3RydW1lbnQiLCJwdXNoIiwiUGxheWVyIiwic2V0TWFzdGVyVm9sdW1lIiwidm9sdW1lIiwiZ2FpbiIsInNldFZhbHVlQXRUaW1lIiwiY3VycmVudFRpbWUiLCJnZXRUb3RhbFNlY29uZHMiLCJNYXRoIiwicm91bmQiLCJzZXRUaWNrZXJDYWxsYmFjayIsImNiIiwidG9wIiwiYm90dG9tIiwicmVzZXRUZW1wbyIsInNldE9uRmluaXNoZWRDYWxsYmFjayIsInNldE9uRHVyYXRpb25DaGFuZ2VDYWxsYmFjayIsInNldE5vdGVCdWZmZXJMZW5ndGgiLCJsZW4iLCJsb2FkUGFjayIsImRhdGEiLCJpbmRleE9mIiwiTm9pc2VzSW5zdHJ1bWVudFBhY2siLCJ0eXBlcyIsImNyZWF0ZU5vdGUiLCJjcmVhdGVXaGl0ZU5vaXNlIiwiY3JlYXRlUGlua05vaXNlIiwiY3JlYXRlQnJvd25pYW5Ob2lzZSIsImJ1ZmZlclNpemUiLCJzYW1wbGVSYXRlIiwibm9pc2VCdWZmZXIiLCJjcmVhdGVCdWZmZXIiLCJvdXRwdXQiLCJnZXRDaGFubmVsRGF0YSIsInJhbmRvbSIsIndoaXRlTm9pc2UiLCJjcmVhdGVCdWZmZXJTb3VyY2UiLCJidWZmZXIiLCJsb29wIiwiYjAiLCJiMSIsImIyIiwiYjMiLCJiNCIsImI1IiwiYjYiLCJ3aGl0ZSIsInBpbmtOb2lzZSIsImxhc3RPdXQiLCJicm93bmlhbk5vaXNlIiwiT3NjaWxsYXRvckluc3RydW1lbnRQYWNrIiwiZnJlcXVlbmN5IiwiY3JlYXRlT3NjaWxsYXRvciIsInZhbHVlIiwiZ2V0RHVyYXRpb24iLCJjbG9uZSIsIm9iaiIsImNvcHkiLCJjb25zdHJ1Y3RvciIsImF0dHIiLCJsYXN0UmVwZWF0Q291bnQiLCJ2b2x1bWVMZXZlbCIsImFydGljdWxhdGlvbkdhcFBlcmNlbnRhZ2UiLCJidWZmZXJQb3NpdGlvbiIsInNldFZvbHVtZSIsIm5ld1ZvbHVtZUxldmVsIiwiZHVyYXRpb24iLCJhcnRpY3VsYXRpb25HYXAiLCJwIiwidHJpbSIsInBhcnNlRmxvYXQiLCJpc05hTiIsInN0YXJ0VGltZSIsInN0b3BUaW1lIiwicmVwZWF0U3RhcnQiLCJyZXBlYXRGcm9tQmVnaW5uaW5nIiwibnVtT2ZSZXBlYXRzIiwicmVwZWF0Iiwibm90ZXNCdWZmZXJDb3B5Iiwic2xpY2UiLCJub3RlQ29weSIsInJlc2V0RHVyYXRpb24iLCJudW1PZk5vdGVzIiwiYnVmZmVyVGltZW91dCIsImFsbE5vdGVzIiwiYnVmZmVyTm90ZXMiLCJjdXJyZW50UGxheVRpbWUiLCJ0b3RhbFBsYXlUaW1lIiwiZmFkZWQiLCJjYWxjdWxhdGVUb3RhbER1cmF0aW9uIiwicmVzZXQiLCJudW1PZkluc3RydW1lbnRzIiwiZGlzY29ubmVjdCIsImNsZWFyVGltZW91dCIsImZhZGUiLCJkaXJlY3Rpb24iLCJyZXNldFZvbHVtZSIsImZhZGVEdXJhdGlvbiIsImxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lIiwic2V0VGltZW91dCIsImJ1ZmZlckNvdW50IiwiaW5kZXgyIiwibm9kZSIsImluZGV4MyIsInRvdGFsUGxheVRpbWVDYWxjdWxhdG9yIiwicGF1c2VkIiwicGxheWluZyIsInN0b3AiLCJsb29waW5nIiwicGxheSIsInVwZGF0ZVRvdGFsUGxheVRpbWUiLCJzZWNvbmRzIiwibXV0ZWQiLCJ0aW1lT2Zmc2V0IiwicGxheU5vdGVzIiwic3RhcnQiLCJidWZmZXJVcCIsImJ1ZmZlckluTmV3Tm90ZXMiLCJuZXdOb3RlcyIsImNvbmNhdCIsImZhZGVPdXQiLCJwYXVzZSIsInZhbCIsInNldFRpbWUiLCJuZXdUaW1lIiwicGFyc2VJbnQiLCJtdXRlIiwidW5tdXRlIiwic2VtaWJyZXZlIiwiZG90dGVkTWluaW0iLCJtaW5pbSIsImRvdHRlZENyb3RjaGV0IiwidHJpcGxldE1pbmltIiwiY3JvdGNoZXQiLCJkb3R0ZWRRdWF2ZXIiLCJ0cmlwbGV0Q3JvdGNoZXQiLCJxdWF2ZXIiLCJkb3R0ZWRTZW1pcXVhdmVyIiwidHJpcGxldFF1YXZlciIsInNlbWlxdWF2ZXIiLCJ0cmlwbGV0U2VtaXF1YXZlciIsImRlbWlzZW1pcXVhdmVyIiwid2hvbGUiLCJkb3R0ZWRIYWxmIiwiaGFsZiIsImRvdHRlZFF1YXJ0ZXIiLCJ0cmlwbGV0SGFsZiIsInF1YXJ0ZXIiLCJkb3R0ZWRFaWdodGgiLCJ0cmlwbGV0UXVhcnRlciIsImVpZ2h0aCIsImRvdHRlZFNpeHRlZW50aCIsInRyaXBsZXRFaWdodGgiLCJzaXh0ZWVudGgiLCJ0cmlwbGV0U2l4dGVlbnRoIiwidGhpcnR5U2Vjb25kIiwiQXVkaW8iLCJwcm9wcyIsInN0YXRlIiwiY29uc29sZSIsImxvZyIsIkJhbmRKUyIsInNlY3Rpb25zUHJvcHMiLCJhbmFseXNpcyIsInNlY3Rpb25zIiwiZm9yRWFjaCIsInNlY3Rpb24iLCJwaWFubyIsInNldFN0YXRlIiwicmh5dGhtVGltZXIiLCJ0aW1lIiwic2hpZnQiLCJwbGF5SGFuZGxlciIsIkNvbXBvbmVudCIsIlRyYWNrc1Jlc3VsdHMiLCJ0cmFja1JlZiIsIlJlYWN0IiwiY3JlYXRlUmVmIiwidXNlU3RhdGUiLCJzYSIsInNhcyIsImdldEFuYWx5c2lzIiwiYXhpb3MiLCJnZXQiLCJ0YXJnZXQiLCJpZCIsImhlYWRlcnMiLCJBdXRob3JpemF0aW9uIiwiYXV0aG9yaXphdGlvbiIsInRoZW4iLCJlcnIiLCJ0cmFja3MiLCJtYXAiLCJ0cmFjayIsImFydGlzdHMiLCJwb3B1bGFyaXR5IiwiRGVmYXVsdCIsIlJoeXRobSIsInF1ZXJ5IiwidG9rZW5fdHlwZSIsInRva2VuIiwidHJhY2tfbGlzdCIsIml0ZW1zIiwic2VhcmNoIiwiZ2V0VHJhY2tzIiwiaGFzaCIsImxvY2F0aW9uIiwic3Vic3RyaW5nIiwicmVkdWNlIiwiaW5pdGlhbCIsIml0ZW0iLCJwYXJ0cyIsImRlY29kZVVSSUNvbXBvbmVudCIsImFjY2Vzc190b2tlbiIsImlucHV0IiwiY2hhbmdlSGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsdUVBQUMsVUFBU0EsQ0FBVCxFQUFXO0FBQUMsTUFBRyxJQUFILEVBQXdEQyxNQUFNLENBQUNDLE9BQVAsR0FBZUYsQ0FBQyxFQUFoQixDQUF4RCxLQUFnRixVQUF5TDtBQUFDLENBQXRSLENBQXVSLFlBQVU7QUFBQyxNQUFJRyxNQUFKLEVBQVdGLE1BQVgsRUFBa0JDLE9BQWxCO0FBQTBCLFNBQVEsU0FBU0YsQ0FBVCxDQUFXSSxDQUFYLEVBQWFDLENBQWIsRUFBZUMsQ0FBZixFQUFpQjtBQUFDLGFBQVNDLENBQVQsQ0FBV0MsQ0FBWCxFQUFhQyxDQUFiLEVBQWU7QUFBQyxVQUFHLENBQUNKLENBQUMsQ0FBQ0csQ0FBRCxDQUFMLEVBQVM7QUFBQyxZQUFHLENBQUNKLENBQUMsQ0FB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YztBQUFFZ0MsYUFBSyxFQUFFSyxJQUFJLENBQUNRLFlBQWQ7QUFBNEJkLGtCQUFVLEVBQUVNLElBQUksQ0FBQ047QUFBN0MsT0FBZDtBQUNBOzs7NkJBOEJRO0FBQUE7O0FBQ1IsYUFDQyxtRUFDRSxDQUFDLEtBQUt6QyxLQUFMLENBQVcwQyxLQUFaLElBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUNDO0FBQUcsWUFBSSxFQUFDLDhJQUFSO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsOEJBREQsQ0FGRixFQVFFLEtBQUsxQyxLQUFMLENBQVcwQyxLQUFYLElBQ0EsbUVBQ0M7QUFDQyxXQUFHLEVBQUUsYUFBQWMsS0FBSztBQUFBLGlCQUFLLE1BQUksQ0FBQ1gsTUFBTCxHQUFjVyxLQUFuQjtBQUFBLFNBRFg7QUFFQyxnQkFBUSxFQUFFLEtBQUtDLGFBRmhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFERCxFQUtDLE1BQUMsc0RBQUQ7QUFDQyxxQkFBYSxZQUFLLEtBQUt6RCxLQUFMLENBQVd5QyxVQUFoQixjQUE4QixLQUFLekMsS0FBTCxDQUFXMEMsS0FBekMsQ0FEZDtBQUVDLGNBQU0sRUFBRSxLQUFLMUMsS0FBTCxDQUFXMkMsVUFGcEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQUxELENBVEYsQ0FERDtBQXVCQTs7OztFQTVFbUI1QiwrQzs7QUErRU53QixxRUFBZjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuRkEsMEMiLCJmaWxlIjoic3RhdGljXFxkZXZlbG9wbWVudFxccGFnZXNcXGluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIWZ1bmN0aW9uKGUpe2lmKFwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlKW1vZHVsZS5leHBvcnRzPWUoKTtlbHNlIGlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZClkZWZpbmUoW10sZSk7ZWxzZXt2YXIgZjtcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P2Y9d2luZG93OlwidW5kZWZpbmVkXCIhPXR5cGVvZiBnbG9iYWw/Zj1nbG9iYWw6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGYmJihmPXNlbGYpLGYuQmFuZEpTPWUoKX19KGZ1bmN0aW9uKCl7dmFyIGRlZmluZSxtb2R1bGUsZXhwb3J0cztyZXR1cm4gKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkoezE6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xyXG4vKlxyXG4gKiBXZWIgQXVkaW8gQVBJIEF1ZGlvQ29udGV4dCBzaGltXHJcbiAqL1xyXG4oZnVuY3Rpb24gKGRlZmluaXRpb24pIHtcclxuICAgIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpO1xyXG4gICAgfVxyXG59KShmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcclxufSk7XHJcblxyXG59LHt9XSwyOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcclxuLyoqXHJcbiAqIEJhbmQuanMgLSBNdXNpYyBDb21wb3NlclxyXG4gKiBBbiBpbnRlcmZhY2UgZm9yIHRoZSBXZWIgQXVkaW8gQVBJIHRoYXQgc3VwcG9ydHMgcmh5dGhtcywgbXVsdGlwbGUgaW5zdHJ1bWVudHMsIHJlcGVhdGluZyBzZWN0aW9ucywgYW5kIGNvbXBsZXhcclxuICogdGltZSBzaWduYXR1cmVzLlxyXG4gKlxyXG4gKiBAYXV0aG9yIENvZHkgTHVuZHF1aXN0IChodHRwOi8vZ2l0aHViLmNvbS9tZWVuaWUpIC0gMjAxNFxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBDb25kdWN0b3I7XHJcblxyXG52YXIgcGFja3MgPSB7XHJcbiAgICBpbnN0cnVtZW50OiB7fSxcclxuICAgIHJoeXRobToge30sXHJcbiAgICB0dW5pbmc6IHt9XHJcbn07XHJcblxyXG4vKipcclxuICogQ29uZHVjdG9yIENsYXNzIC0gVGhpcyBnZXRzIGluc3RhbnRpYXRlZCB3aGVuIGBuZXcgQmFuZEpTKClgIGlzIGNhbGxlZFxyXG4gKlxyXG4gKiBAcGFyYW0gdHVuaW5nXHJcbiAqIEBwYXJhbSByaHl0aG1cclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBDb25kdWN0b3IodHVuaW5nLCByaHl0aG0pIHtcclxuICAgIGlmICghIHR1bmluZykge1xyXG4gICAgICAgIHR1bmluZyA9ICdlcXVhbFRlbXBlcmFtZW50JztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoISByaHl0aG0pIHtcclxuICAgICAgICByaHl0aG0gPSAnbm9ydGhBbWVyaWNhbic7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBwYWNrcy50dW5pbmdbdHVuaW5nXSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IodHVuaW5nICsgJyBpcyBub3QgYSB2YWxpZCB0dW5pbmcgcGFjay4nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIHBhY2tzLnJoeXRobVtyaHl0aG1dID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihyaHl0aG0gKyAnIGlzIG5vdCBhIHZhbGlkIHJoeXRobSBwYWNrLicpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjb25kdWN0b3IgPSB0aGlzLFxyXG4gICAgICAgIHBsYXllcixcclxuICAgICAgICBub29wID0gZnVuY3Rpb24oKSB7fSxcclxuICAgICAgICBBdWRpb0NvbnRleHQgPSBfZGVyZXFfKCdhdWRpb2NvbnRleHQnKSxcclxuICAgICAgICBzaWduYXR1cmVUb05vdGVMZW5ndGhSYXRpbyA9IHtcclxuICAgICAgICAgICAgMjogNixcclxuICAgICAgICAgICAgNDogMyxcclxuICAgICAgICAgICAgODogNC41MFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgY29uZHVjdG9yLnBhY2tzID0gcGFja3M7XHJcbiAgICBjb25kdWN0b3IucGl0Y2hlcyA9IHBhY2tzLnR1bmluZ1t0dW5pbmddO1xyXG4gICAgY29uZHVjdG9yLm5vdGVzID0gcGFja3Mucmh5dGhtW3JoeXRobV07XHJcbiAgICBjb25kdWN0b3IuYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xyXG4gICAgY29uZHVjdG9yLm1hc3RlclZvbHVtZUxldmVsID0gbnVsbDtcclxuICAgIGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWUgPSBjb25kdWN0b3IuYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcclxuICAgIGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWUuY29ubmVjdChjb25kdWN0b3IuYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcclxuICAgIGNvbmR1Y3Rvci5iZWF0c1BlckJhciA9IG51bGw7XHJcbiAgICBjb25kdWN0b3Iubm90ZUdldHNCZWF0ID0gbnVsbDtcclxuICAgIGNvbmR1Y3Rvci50ZW1wbyA9IG51bGw7XHJcbiAgICBjb25kdWN0b3IuaW5zdHJ1bWVudHMgPSBbXTtcclxuICAgIGNvbmR1Y3Rvci50b3RhbER1cmF0aW9uID0gMDtcclxuICAgIGNvbmR1Y3Rvci5jdXJyZW50U2Vjb25kcyA9IDA7XHJcbiAgICBjb25kdWN0b3IucGVyY2VudGFnZUNvbXBsZXRlID0gMDtcclxuICAgIGNvbmR1Y3Rvci5ub3RlQnVmZmVyTGVuZ3RoID0gMjA7XHJcbiAgICBjb25kdWN0b3Iub25UaWNrZXJDYWxsYmFjayA9IG5vb3A7XHJcbiAgICBjb25kdWN0b3Iub25GaW5pc2hlZENhbGxiYWNrID0gbm9vcDtcclxuICAgIGNvbmR1Y3Rvci5vbkR1cmF0aW9uQ2hhbmdlQ2FsbGJhY2sgPSBub29wO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXNlIEpTT04gdG8gbG9hZCBpbiBhIHNvbmcgdG8gYmUgcGxheWVkXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGpzb25cclxuICAgICAqL1xyXG4gICAgY29uZHVjdG9yLmxvYWQgPSBmdW5jdGlvbihqc29uKSB7XHJcbiAgICAgICAgLy8gQ2xlYXIgb3V0IGFueSBwcmV2aW91cyBzb25nXHJcbiAgICAgICAgaWYgKGNvbmR1Y3Rvci5pbnN0cnVtZW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNvbmR1Y3Rvci5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoISBqc29uKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSlNPTiBpcyByZXF1aXJlZCBmb3IgdGhpcyBtZXRob2QgdG8gd29yay4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gTmVlZCB0byBoYXZlIGF0IGxlYXN0IGluc3RydW1lbnRzIGFuZCBub3Rlc1xyXG4gICAgICAgIGlmICh0eXBlb2YganNvbi5pbnN0cnVtZW50cyA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbXVzdCBkZWZpbmUgYXQgbGVhc3Qgb25lIGluc3RydW1lbnQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiBqc29uLm5vdGVzID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBtdXN0IGRlZmluZSBub3RlcyBmb3IgZWFjaCBpbnN0cnVtZW50Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTaGFsbCB3ZSBzZXQgYSB0aW1lIHNpZ25hdHVyZT9cclxuICAgICAgICBpZiAodHlwZW9mIGpzb24udGltZVNpZ25hdHVyZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgY29uZHVjdG9yLnNldFRpbWVTaWduYXR1cmUoanNvbi50aW1lU2lnbmF0dXJlWzBdLCBqc29uLnRpbWVTaWduYXR1cmVbMV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gTWF5YmUgc29tZSB0ZW1wbz9cclxuICAgICAgICBpZiAodHlwZW9mIGpzb24udGVtcG8gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIGNvbmR1Y3Rvci5zZXRUZW1wbyhqc29uLnRlbXBvKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIExldHMgY3JlYXRlIHNvbWUgaW5zdHJ1bWVudHNcclxuICAgICAgICB2YXIgaW5zdHJ1bWVudExpc3QgPSB7fTtcclxuICAgICAgICBmb3IgKHZhciBpbnN0cnVtZW50IGluIGpzb24uaW5zdHJ1bWVudHMpIHtcclxuICAgICAgICAgICAgaWYgKCEganNvbi5pbnN0cnVtZW50cy5oYXNPd25Qcm9wZXJ0eShpbnN0cnVtZW50KSkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGluc3RydW1lbnRMaXN0W2luc3RydW1lbnRdID0gY29uZHVjdG9yLmNyZWF0ZUluc3RydW1lbnQoXHJcbiAgICAgICAgICAgICAgICBqc29uLmluc3RydW1lbnRzW2luc3RydW1lbnRdLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBqc29uLmluc3RydW1lbnRzW2luc3RydW1lbnRdLnBhY2tcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE5vdyBsZXRzIGFkZCBpbiBlYWNoIG9mIHRoZSBub3Rlc1xyXG4gICAgICAgIGZvciAodmFyIGluc3QgaW4ganNvbi5ub3Rlcykge1xyXG4gICAgICAgICAgICBpZiAoISBqc29uLm5vdGVzLmhhc093blByb3BlcnR5KGluc3QpKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSAtMTtcclxuICAgICAgICAgICAgd2hpbGUgKCsrIGluZGV4IDwganNvbi5ub3Rlc1tpbnN0XS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBub3RlID0ganNvbi5ub3Rlc1tpbnN0XVtpbmRleF07XHJcbiAgICAgICAgICAgICAgICAvLyBVc2Ugc2hvcnRoYW5kIGlmIGl0J3MgYSBzdHJpbmdcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygbm90ZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbm90ZVBhcnRzID0gbm90ZS5zcGxpdCgnfCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgncmVzdCcgPT09IG5vdGVQYXJ0c1sxXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0cnVtZW50TGlzdFtpbnN0XS5yZXN0KG5vdGVQYXJ0c1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdHJ1bWVudExpc3RbaW5zdF0ubm90ZShub3RlUGFydHNbMF0sIG5vdGVQYXJ0c1sxXSwgbm90ZVBhcnRzWzJdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlIHVzZSBsb25naGFuZFxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJ3Jlc3QnID09PSBub3RlLnR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdHJ1bWVudExpc3RbaW5zdF0ucmVzdChub3RlLnJoeXRobSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgnbm90ZScgPT09IG5vdGUudHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0cnVtZW50TGlzdFtpbnN0XS5ub3RlKG5vdGUucmh5dGhtLCBub3RlLnBpdGNoLCBub3RlLnRpZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBMb29rcyBsaWtlIHdlIGFyZSBkb25lLCBsZXRzIHByZXNzIGl0LlxyXG4gICAgICAgIHJldHVybiBjb25kdWN0b3IuZmluaXNoKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgbmV3IGluc3RydW1lbnRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gW25hbWVdIC0gZGVmYXVsdHMgdG8gc2luZVxyXG4gICAgICogQHBhcmFtIFtwYWNrXSAtIGRlZmF1bHRzIHRvIG9zY2lsbGF0b3JzXHJcbiAgICAgKi9cclxuICAgIGNvbmR1Y3Rvci5jcmVhdGVJbnN0cnVtZW50ID0gZnVuY3Rpb24obmFtZSwgcGFjaykge1xyXG4gICAgICAgIHZhciBJbnN0cnVtZW50ID0gX2RlcmVxXygnLi9pbnN0cnVtZW50LmpzJyksXHJcbiAgICAgICAgICAgIGluc3RydW1lbnQgPSBuZXcgSW5zdHJ1bWVudChuYW1lLCBwYWNrLCBjb25kdWN0b3IpO1xyXG4gICAgICAgIGNvbmR1Y3Rvci5pbnN0cnVtZW50cy5wdXNoKGluc3RydW1lbnQpO1xyXG5cclxuICAgICAgICByZXR1cm4gaW5zdHJ1bWVudDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBOZWVkcyB0byBiZSBjYWxsZWQgYWZ0ZXIgYWxsIHRoZSBpbnN0cnVtZW50cyBoYXZlIGJlZW4gZmlsbGVkIHdpdGggbm90ZXMuXHJcbiAgICAgKiBJdCB3aWxsIGZpZ3VyZSBvdXQgdGhlIHRvdGFsIGR1cmF0aW9uIG9mIHRoZSBzb25nIGJhc2VkIG9uIHRoZSBsb25nZXN0XHJcbiAgICAgKiBkdXJhdGlvbiBvdXQgb2YgYWxsIHRoZSBpbnN0cnVtZW50cy4gIEl0IHdpbGwgdGhlbiBwYXNzIGJhY2sgdGhlIFBsYXllciBPYmplY3RcclxuICAgICAqIHdoaWNoIGlzIHVzZWQgdG8gY29udHJvbCB0aGUgbXVzaWMgKHBsYXksIHN0b3AsIHBhdXNlLCBsb29wLCB2b2x1bWUsIHRlbXBvKVxyXG4gICAgICpcclxuICAgICAqIEl0IHJldHVybnMgdGhlIFBsYXllciBvYmplY3QuXHJcbiAgICAgKi9cclxuICAgIGNvbmR1Y3Rvci5maW5pc2ggPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgUGxheWVyID0gX2RlcmVxXygnLi9wbGF5ZXIuanMnKTtcclxuICAgICAgICBwbGF5ZXIgPSBuZXcgUGxheWVyKGNvbmR1Y3Rvcik7XHJcblxyXG4gICAgICAgIHJldHVybiBwbGF5ZXI7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlIGFsbCBpbnN0cnVtZW50cyBhbmQgcmVjcmVhdGUgQXVkaW9Db250ZXh0XHJcbiAgICAgKi9cclxuICAgIGNvbmR1Y3Rvci5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uZHVjdG9yLmF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcclxuICAgICAgICBjb25kdWN0b3IuaW5zdHJ1bWVudHMubGVuZ3RoID0gMDtcclxuICAgICAgICBjb25kdWN0b3IubWFzdGVyVm9sdW1lID0gY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XHJcbiAgICAgICAgY29uZHVjdG9yLm1hc3RlclZvbHVtZS5jb25uZWN0KGNvbmR1Y3Rvci5hdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCBNYXN0ZXIgVm9sdW1lXHJcbiAgICAgKi9cclxuICAgIGNvbmR1Y3Rvci5zZXRNYXN0ZXJWb2x1bWUgPSBmdW5jdGlvbih2b2x1bWUpIHtcclxuICAgICAgICBpZiAodm9sdW1lID4gMSkge1xyXG4gICAgICAgICAgICB2b2x1bWUgPSB2b2x1bWUgLyAxMDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWVMZXZlbCA9IHZvbHVtZTtcclxuICAgICAgICBjb25kdWN0b3IubWFzdGVyVm9sdW1lLmdhaW4uc2V0VmFsdWVBdFRpbWUodm9sdW1lLCBjb25kdWN0b3IuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHcmFiIHRoZSB0b3RhbCBkdXJhdGlvbiBvZiBhIHNvbmdcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBjb25kdWN0b3IuZ2V0VG90YWxTZWNvbmRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoY29uZHVjdG9yLnRvdGFsRHVyYXRpb24pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIHRpY2tlciBjYWxsYmFjayBmdW5jdGlvbi4gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZFxyXG4gICAgICogZXZlcnkgdGltZSB0aGUgY3VycmVudCBzZWNvbmRzIGhhcyBjaGFuZ2VkLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjYiBmdW5jdGlvblxyXG4gICAgICovXHJcbiAgICBjb25kdWN0b3Iuc2V0VGlja2VyQ2FsbGJhY2sgPSBmdW5jdGlvbihjYikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgY2IgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaWNrZXIgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uZHVjdG9yLm9uVGlja2VyQ2FsbGJhY2sgPSBjYjtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSB0aW1lIHNpZ25hdHVyZSBmb3IgdGhlIG11c2ljLiBKdXN0IGxpa2UgaW4gbm90YXRpb24gNC80IHRpbWUgd291bGQgYmUgc2V0VGltZVNpZ25hdHVyZSg0LCA0KTtcclxuICAgICAqIEBwYXJhbSB0b3AgLSBOdW1iZXIgb2YgYmVhdHMgcGVyIGJhclxyXG4gICAgICogQHBhcmFtIGJvdHRvbSAtIFdoYXQgbm90ZSB0eXBlIGhhcyB0aGUgYmVhdFxyXG4gICAgICovXHJcbiAgICBjb25kdWN0b3Iuc2V0VGltZVNpZ25hdHVyZSA9IGZ1bmN0aW9uKHRvcCwgYm90dG9tKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBzaWduYXR1cmVUb05vdGVMZW5ndGhSYXRpb1tib3R0b21dID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBib3R0b20gdGltZSBzaWduYXR1cmUgaXMgbm90IHN1cHBvcnRlZC4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE5vdCB1c2VkIGF0IHRoZSBtb21lbnQsIGJ1dCB3aWxsIGJlIGhhbmR5IGluIHRoZSBmdXR1cmUuXHJcbiAgICAgICAgY29uZHVjdG9yLmJlYXRzUGVyQmFyID0gdG9wO1xyXG4gICAgICAgIGNvbmR1Y3Rvci5ub3RlR2V0c0JlYXQgPSBzaWduYXR1cmVUb05vdGVMZW5ndGhSYXRpb1tib3R0b21dO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIHRlbXBvXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHRcclxuICAgICAqL1xyXG4gICAgY29uZHVjdG9yLnNldFRlbXBvID0gZnVuY3Rpb24odCkge1xyXG4gICAgICAgIGNvbmR1Y3Rvci50ZW1wbyA9IDYwIC8gdDtcclxuXHJcbiAgICAgICAgLy8gSWYgd2UgaGF2ZSBhIHBsYXllciBpbnN0YW5jZSwgd2UgbmVlZCB0byByZWNhbGN1bGF0ZSBkdXJhdGlvbiBhZnRlciByZXNldHRpbmcgdGhlIHRlbXBvLlxyXG4gICAgICAgIGlmIChwbGF5ZXIpIHtcclxuICAgICAgICAgICAgcGxheWVyLnJlc2V0VGVtcG8oKTtcclxuICAgICAgICAgICAgY29uZHVjdG9yLm9uRHVyYXRpb25DaGFuZ2VDYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgYSBjYWxsYmFjayB0byBmaXJlIHdoZW4gdGhlIHNvbmcgaXMgZmluaXNoZWRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY2JcclxuICAgICAqL1xyXG4gICAgY29uZHVjdG9yLnNldE9uRmluaXNoZWRDYWxsYmFjayA9IGZ1bmN0aW9uKGNiKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjYiAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ29uRmluaXNoZWQgY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uZHVjdG9yLm9uRmluaXNoZWRDYWxsYmFjayA9IGNiO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCBhIGNhbGxiYWNrIHRvIGZpcmUgd2hlbiBkdXJhdGlvbiBvZiBhIHNvbmcgY2hhbmdlc1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjYlxyXG4gICAgICovXHJcbiAgICBjb25kdWN0b3Iuc2V0T25EdXJhdGlvbkNoYW5nZUNhbGxiYWNrID0gZnVuY3Rpb24oY2IpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGNiICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignb25EdXJhdGlvbkNoYW5nZWQgY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uZHVjdG9yLm9uRHVyYXRpb25DaGFuZ2VDYWxsYmFjayA9IGNiO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCB0aGUgbnVtYmVyIG9mIG5vdGVzIHRoYXQgYXJlIGJ1ZmZlcmVkIGV2ZXJ5ICh0ZW1wbyAvIDYwICogNSkgc2Vjb25kcy5cclxuICAgICAqIEl0J3Mgc2V0IHRvIDIwIG5vdGVzIGJ5IGRlZmF1bHQuXHJcbiAgICAgKlxyXG4gICAgICogKipXQVJOSU5HKiogVGhlIGhpZ2hlciB0aGlzIGlzLCB0aGUgbW9yZSBtZW1vcnkgaXMgdXNlZCBhbmQgY2FuIGNyYXNoIHlvdXIgYnJvd3Nlci5cclxuICAgICAqICAgICAgICAgICAgIElmIG5vdGVzIGFyZSBiZWluZyBkcm9wcGVkLCB5b3UgY2FuIGluY3JlYXNlIHRoaXMsIGJ1dCBiZSB3ZWFyeSBvZlxyXG4gICAgICogICAgICAgICAgICAgdXNlZCBtZW1vcnkuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtJbnRlZ2VyfSBsZW5cclxuICAgICAqL1xyXG4gICAgY29uZHVjdG9yLnNldE5vdGVCdWZmZXJMZW5ndGggPSBmdW5jdGlvbihsZW4pIHtcclxuICAgICAgICBjb25kdWN0b3Iubm90ZUJ1ZmZlckxlbmd0aCA9IGxlbjtcclxuICAgIH07XHJcblxyXG4gICAgY29uZHVjdG9yLnNldE1hc3RlclZvbHVtZSgxMDApO1xyXG4gICAgY29uZHVjdG9yLnNldFRlbXBvKDEyMCk7XHJcbiAgICBjb25kdWN0b3Iuc2V0VGltZVNpZ25hdHVyZSg0LCA0KTtcclxufVxyXG5cclxuQ29uZHVjdG9yLmxvYWRQYWNrID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgZGF0YSkge1xyXG4gICAgaWYgKFsndHVuaW5nJywgJ3JoeXRobScsICdpbnN0cnVtZW50J10uaW5kZXhPZih0eXBlKSA9PT0gLTEpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IodHlwZSArICcgaXMgbm90IGEgdmFsaWQgUGFjayBUeXBlLicpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgcGFja3NbdHlwZV1bbmFtZV0gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBKG4pICcgKyB0eXBlICsgJyBwYWNrIHdpdGggdGhlIG5hbWUgXCInICsgbmFtZSArICdcIiBoYXMgYWxyZWFkeSBiZWVuIGxvYWRlZC4nKTtcclxuICAgIH1cclxuXHJcbiAgICBwYWNrc1t0eXBlXVtuYW1lXSA9IGRhdGE7XHJcbn07XHJcblxyXG59LHtcIi4vaW5zdHJ1bWVudC5qc1wiOjUsXCIuL3BsYXllci5qc1wiOjcsXCJhdWRpb2NvbnRleHRcIjoxfV0sMzpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XHJcbi8qKlxyXG4gKiBCYW5kLmpzIC0gTXVzaWMgQ29tcG9zZXJcclxuICogQW4gaW50ZXJmYWNlIGZvciB0aGUgV2ViIEF1ZGlvIEFQSSB0aGF0IHN1cHBvcnRzIHJoeXRobXMsIG11bHRpcGxlIGluc3RydW1lbnRzLCByZXBlYXRpbmcgc2VjdGlvbnMsIGFuZCBjb21wbGV4XHJcbiAqIHRpbWUgc2lnbmF0dXJlcy5cclxuICpcclxuICogQGF1dGhvciBDb2R5IEx1bmRxdWlzdCAoaHR0cDovL2dpdGh1Yi5jb20vbWVlbmllKSAtIDIwMTRcclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gTm9pc2VzSW5zdHJ1bWVudFBhY2s7XHJcblxyXG4vKipcclxuICogTm9pc2VzIEluc3RydW1lbnQgUGFja1xyXG4gKlxyXG4gKiBBZGFwdGVkIGZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS96YWNoYXJ5ZGVudG9uL25vaXNlLmpzXHJcbiAqXHJcbiAqIEBwYXJhbSBuYW1lXHJcbiAqIEBwYXJhbSBhdWRpb0NvbnRleHRcclxuICogQHJldHVybnMge3tjcmVhdGVOb3RlOiBjcmVhdGVOb3RlfX1cclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBOb2lzZXNJbnN0cnVtZW50UGFjayhuYW1lLCBhdWRpb0NvbnRleHQpIHtcclxuICAgIHZhciB0eXBlcyA9IFtcclxuICAgICAgICAnd2hpdGUnLFxyXG4gICAgICAgICdwaW5rJyxcclxuICAgICAgICAnYnJvd24nLFxyXG4gICAgICAgICdicm93bmlhbicsXHJcbiAgICAgICAgJ3JlZCdcclxuICAgIF07XHJcblxyXG4gICAgaWYgKHR5cGVzLmluZGV4T2YobmFtZSkgPT09IC0xKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG5hbWUgKyAnIGlzIG5vdCBhIHZhbGlkIG5vaXNlIHNvdW5kJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjcmVhdGVOb3RlOiBmdW5jdGlvbihkZXN0aW5hdGlvbikge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3doaXRlJzpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlV2hpdGVOb2lzZShkZXN0aW5hdGlvbik7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdwaW5rJzpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlUGlua05vaXNlKGRlc3RpbmF0aW9uKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2Jyb3duJzpcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2Jyb3duaWFuJzpcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3JlZCc6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUJyb3duaWFuTm9pc2UoZGVzdGluYXRpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVXaGl0ZU5vaXNlKGRlc3RpbmF0aW9uKSB7XHJcbiAgICAgICAgdmFyIGJ1ZmZlclNpemUgPSAyICogYXVkaW9Db250ZXh0LnNhbXBsZVJhdGUsXHJcbiAgICAgICAgICAgIG5vaXNlQnVmZmVyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcigxLCBidWZmZXJTaXplLCBhdWRpb0NvbnRleHQuc2FtcGxlUmF0ZSksXHJcbiAgICAgICAgICAgIG91dHB1dCA9IG5vaXNlQnVmZmVyLmdldENoYW5uZWxEYXRhKDApO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnVmZmVyU2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgICAgIG91dHB1dFtpXSA9IE1hdGgucmFuZG9tKCkgKiAyIC0gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB3aGl0ZU5vaXNlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xyXG4gICAgICAgIHdoaXRlTm9pc2UuYnVmZmVyID0gbm9pc2VCdWZmZXI7XHJcbiAgICAgICAgd2hpdGVOb2lzZS5sb29wID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgd2hpdGVOb2lzZS5jb25uZWN0KGRlc3RpbmF0aW9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHdoaXRlTm9pc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlUGlua05vaXNlKGRlc3RpbmF0aW9uKSB7XHJcbiAgICAgICAgdmFyIGJ1ZmZlclNpemUgPSAyICogYXVkaW9Db250ZXh0LnNhbXBsZVJhdGUsXHJcbiAgICAgICAgICAgIG5vaXNlQnVmZmVyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcigxLCBidWZmZXJTaXplLCBhdWRpb0NvbnRleHQuc2FtcGxlUmF0ZSksXHJcbiAgICAgICAgICAgIG91dHB1dCA9IG5vaXNlQnVmZmVyLmdldENoYW5uZWxEYXRhKDApLFxyXG4gICAgICAgICAgICBiMCwgYjEsIGIyLCBiMywgYjQsIGI1LCBiNjtcclxuXHJcbiAgICAgICAgYjAgPSBiMSA9IGIyID0gYjMgPSBiNCA9IGI1ID0gYjYgPSAwLjA7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBidWZmZXJTaXplOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHdoaXRlID0gTWF0aC5yYW5kb20oKSAqIDIgLSAxO1xyXG4gICAgICAgICAgICBiMCA9IDAuOTk4ODYgKiBiMCArIHdoaXRlICogMC4wNTU1MTc5O1xyXG4gICAgICAgICAgICBiMSA9IDAuOTkzMzIgKiBiMSArIHdoaXRlICogMC4wNzUwNzU5O1xyXG4gICAgICAgICAgICBiMiA9IDAuOTY5MDAgKiBiMiArIHdoaXRlICogMC4xNTM4NTIwO1xyXG4gICAgICAgICAgICBiMyA9IDAuODY2NTAgKiBiMyArIHdoaXRlICogMC4zMTA0ODU2O1xyXG4gICAgICAgICAgICBiNCA9IDAuNTUwMDAgKiBiNCArIHdoaXRlICogMC41MzI5NTIyO1xyXG4gICAgICAgICAgICBiNSA9IC0wLjc2MTYgKiBiNSAtIHdoaXRlICogMC4wMTY4OTgwO1xyXG4gICAgICAgICAgICBvdXRwdXRbaV0gPSBiMCArIGIxICsgYjIgKyBiMyArIGI0ICsgYjUgKyBiNiArIHdoaXRlICogMC41MzYyO1xyXG4gICAgICAgICAgICBvdXRwdXRbaV0gKj0gMC4xMTtcclxuICAgICAgICAgICAgYjYgPSB3aGl0ZSAqIDAuMTE1OTI2O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHBpbmtOb2lzZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcclxuICAgICAgICBwaW5rTm9pc2UuYnVmZmVyID0gbm9pc2VCdWZmZXI7XHJcbiAgICAgICAgcGlua05vaXNlLmxvb3AgPSB0cnVlO1xyXG5cclxuICAgICAgICBwaW5rTm9pc2UuY29ubmVjdChkZXN0aW5hdGlvbik7XHJcblxyXG4gICAgICAgIHJldHVybiBwaW5rTm9pc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlQnJvd25pYW5Ob2lzZShkZXN0aW5hdGlvbikge1xyXG4gICAgICAgIHZhciBidWZmZXJTaXplID0gMiAqIGF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlLFxyXG4gICAgICAgICAgICBub2lzZUJ1ZmZlciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXIoMSwgYnVmZmVyU2l6ZSwgYXVkaW9Db250ZXh0LnNhbXBsZVJhdGUpLFxyXG4gICAgICAgICAgICBvdXRwdXQgPSBub2lzZUJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKSxcclxuICAgICAgICAgICAgbGFzdE91dCA9IDAuMDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJ1ZmZlclNpemU7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgd2hpdGUgPSBNYXRoLnJhbmRvbSgpICogMiAtIDE7XHJcbiAgICAgICAgICAgIG91dHB1dFtpXSA9IChsYXN0T3V0ICsgKDAuMDIgKiB3aGl0ZSkpIC8gMS4wMjtcclxuICAgICAgICAgICAgbGFzdE91dCA9IG91dHB1dFtpXTtcclxuICAgICAgICAgICAgb3V0cHV0W2ldICo9IDMuNTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBicm93bmlhbk5vaXNlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xyXG4gICAgICAgIGJyb3duaWFuTm9pc2UuYnVmZmVyID0gbm9pc2VCdWZmZXI7XHJcbiAgICAgICAgYnJvd25pYW5Ob2lzZS5sb29wID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgYnJvd25pYW5Ob2lzZS5jb25uZWN0KGRlc3RpbmF0aW9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJyb3duaWFuTm9pc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbn0se31dLDQ6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xyXG4vKipcclxuICogQmFuZC5qcyAtIE11c2ljIENvbXBvc2VyXHJcbiAqIEFuIGludGVyZmFjZSBmb3IgdGhlIFdlYiBBdWRpbyBBUEkgdGhhdCBzdXBwb3J0cyByaHl0aG1zLCBtdWx0aXBsZSBpbnN0cnVtZW50cywgcmVwZWF0aW5nIHNlY3Rpb25zLCBhbmQgY29tcGxleFxyXG4gKiB0aW1lIHNpZ25hdHVyZXMuXHJcbiAqXHJcbiAqIEBhdXRob3IgQ29keSBMdW5kcXVpc3QgKGh0dHA6Ly9naXRodWIuY29tL21lZW5pZSkgLSAyMDE0XHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IE9zY2lsbGF0b3JJbnN0cnVtZW50UGFjaztcclxuXHJcbi8qKlxyXG4gKiBPc2NpbGxhdG9yIEluc3RydW1lbnQgUGFja1xyXG4gKlxyXG4gKiBAcGFyYW0gbmFtZVxyXG4gKiBAcGFyYW0gYXVkaW9Db250ZXh0XHJcbiAqIEByZXR1cm5zIHt7Y3JlYXRlTm90ZTogY3JlYXRlTm90ZX19XHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gT3NjaWxsYXRvckluc3RydW1lbnRQYWNrKG5hbWUsIGF1ZGlvQ29udGV4dCkge1xyXG4gICAgdmFyIHR5cGVzID0gWydzaW5lJywgJ3NxdWFyZScsICdzYXd0b290aCcsICd0cmlhbmdsZSddO1xyXG5cclxuICAgIGlmICh0eXBlcy5pbmRleE9mKG5hbWUpID09PSAtMSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihuYW1lICsgJyBpcyBub3QgYSB2YWxpZCBPc2NpbGxhdG9yIHR5cGUnKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNyZWF0ZU5vdGU6IGZ1bmN0aW9uKGRlc3RpbmF0aW9uLCBmcmVxdWVuY3kpIHtcclxuICAgICAgICAgICAgdmFyIG8gPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ29ubmVjdCBub3RlIHRvIHZvbHVtZVxyXG4gICAgICAgICAgICBvLmNvbm5lY3QoZGVzdGluYXRpb24pO1xyXG4gICAgICAgICAgICAvLyBTZXQgcGl0Y2ggdHlwZVxyXG4gICAgICAgICAgICBvLnR5cGUgPSBuYW1lO1xyXG4gICAgICAgICAgICAvLyBTZXQgZnJlcXVlbmN5XHJcbiAgICAgICAgICAgIG8uZnJlcXVlbmN5LnZhbHVlID0gZnJlcXVlbmN5O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG87XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxufSx7fV0sNTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XHJcbi8qKlxyXG4gKiBCYW5kLmpzIC0gTXVzaWMgQ29tcG9zZXJcclxuICogQW4gaW50ZXJmYWNlIGZvciB0aGUgV2ViIEF1ZGlvIEFQSSB0aGF0IHN1cHBvcnRzIHJoeXRobXMsIG11bHRpcGxlIGluc3RydW1lbnRzLCByZXBlYXRpbmcgc2VjdGlvbnMsIGFuZCBjb21wbGV4XHJcbiAqIHRpbWUgc2lnbmF0dXJlcy5cclxuICpcclxuICogQGF1dGhvciBDb2R5IEx1bmRxdWlzdCAoaHR0cDovL2dpdGh1Yi5jb20vbWVlbmllKSAtIDIwMTRcclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gSW5zdHJ1bWVudDtcclxuXHJcbi8qKlxyXG4gKiBJbnN0cnVtZW50IENsYXNzIC0gR2V0cyBpbnN0YW50aWF0ZWQgd2hlbiBgQ29uZHVjdG9yLmNyZWF0ZUluc3RydW1lbnQoKWAgaXMgY2FsbGVkLlxyXG4gKlxyXG4gKiBAcGFyYW0gbmFtZVxyXG4gKiBAcGFyYW0gcGFja1xyXG4gKiBAcGFyYW0gY29uZHVjdG9yXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gSW5zdHJ1bWVudChuYW1lLCBwYWNrLCBjb25kdWN0b3IpIHtcclxuICAgIC8vIERlZmF1bHQgdG8gU2luZSBPc2NpbGxhdG9yXHJcbiAgICBpZiAoISBuYW1lKSB7XHJcbiAgICAgICAgbmFtZSA9ICdzaW5lJztcclxuICAgIH1cclxuICAgIGlmICghIHBhY2spIHtcclxuICAgICAgICBwYWNrID0gJ29zY2lsbGF0b3JzJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIGNvbmR1Y3Rvci5wYWNrcy5pbnN0cnVtZW50W3BhY2tdID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihwYWNrICsgJyBpcyBub3QgYSBjdXJyZW50bHkgbG9hZGVkIEluc3RydW1lbnQgUGFjay4nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhlbHBlciBmdW5jdGlvbiB0byBmaWd1cmUgb3V0IGhvdyBsb25nIGEgbm90ZSBpc1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSByaHl0aG1cclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGdldER1cmF0aW9uKHJoeXRobSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgY29uZHVjdG9yLm5vdGVzW3JoeXRobV0gPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihyaHl0aG0gKyAnIGlzIG5vdCBhIGNvcnJlY3Qgcmh5dGhtLicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbmR1Y3Rvci5ub3Rlc1tyaHl0aG1dICogY29uZHVjdG9yLnRlbXBvIC8gY29uZHVjdG9yLm5vdGVHZXRzQmVhdCAqIDEwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSGVscGVyIGZ1bmN0aW9uIHRvIGNsb25lIGFuIG9iamVjdFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBvYmpcclxuICAgICAqIEByZXR1cm5zIHtjb3B5fVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBjbG9uZShvYmopIHtcclxuICAgICAgICBpZiAobnVsbCA9PT0gb2JqIHx8IFwib2JqZWN0XCIgIT0gdHlwZW9mIG9iaikge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY29weSA9IG9iai5jb25zdHJ1Y3RvcigpO1xyXG4gICAgICAgIGZvciAodmFyIGF0dHIgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoYXR0cikpIHtcclxuICAgICAgICAgICAgICAgIGNvcHlbYXR0cl0gPSBvYmpbYXR0cl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjb3B5O1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgdmFyIGluc3RydW1lbnQgPSB0aGlzLFxyXG4gICAgICAgIGxhc3RSZXBlYXRDb3VudCA9IDAsXHJcbiAgICAgICAgdm9sdW1lTGV2ZWwgPSAxLFxyXG4gICAgICAgIGFydGljdWxhdGlvbkdhcFBlcmNlbnRhZ2UgPSAwLjA1O1xyXG5cclxuICAgIGluc3RydW1lbnQudG90YWxEdXJhdGlvbiA9IDA7XHJcbiAgICBpbnN0cnVtZW50LmJ1ZmZlclBvc2l0aW9uID0gMDtcclxuICAgIGluc3RydW1lbnQuaW5zdHJ1bWVudCA9IGNvbmR1Y3Rvci5wYWNrcy5pbnN0cnVtZW50W3BhY2tdKG5hbWUsIGNvbmR1Y3Rvci5hdWRpb0NvbnRleHQpO1xyXG4gICAgaW5zdHJ1bWVudC5ub3RlcyA9IFtdO1xyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFNldCB2b2x1bWUgbGV2ZWwgZm9yIGFuIGluc3RydW1lbnRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbmV3Vm9sdW1lTGV2ZWxcclxuICAgICAqL1xyXG4gICAgaW5zdHJ1bWVudC5zZXRWb2x1bWUgPSBmdW5jdGlvbihuZXdWb2x1bWVMZXZlbCkge1xyXG4gICAgICAgIGlmIChuZXdWb2x1bWVMZXZlbCA+IDEpIHtcclxuICAgICAgICAgICAgbmV3Vm9sdW1lTGV2ZWwgPSBuZXdWb2x1bWVMZXZlbCAvIDEwMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdm9sdW1lTGV2ZWwgPSBuZXdWb2x1bWVMZXZlbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGluc3RydW1lbnQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgbm90ZSB0byBhbiBpbnN0cnVtZW50XHJcbiAgICAgKiBAcGFyYW0gcmh5dGhtXHJcbiAgICAgKiBAcGFyYW0gW3BpdGNoXSAtIENvbW1hIHNlcGFyYXRlZCBzdHJpbmcgaWYgbW9yZSB0aGFuIG9uZSBwaXRjaFxyXG4gICAgICogQHBhcmFtIFt0aWVdXHJcbiAgICAgKi9cclxuICAgIGluc3RydW1lbnQubm90ZSA9IGZ1bmN0aW9uKHJoeXRobSwgcGl0Y2gsIHRpZSkge1xyXG4gICAgICAgIHZhciBkdXJhdGlvbiA9IGdldER1cmF0aW9uKHJoeXRobSksXHJcbiAgICAgICAgICAgIGFydGljdWxhdGlvbkdhcCA9IHRpZSA/IDAgOiBkdXJhdGlvbiAqIGFydGljdWxhdGlvbkdhcFBlcmNlbnRhZ2U7XHJcblxyXG4gICAgICAgIGlmIChwaXRjaCkge1xyXG4gICAgICAgICAgICBwaXRjaCA9IHBpdGNoLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IC0xO1xyXG4gICAgICAgICAgICB3aGlsZSAoKysgaW5kZXggPCBwaXRjaC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwID0gcGl0Y2hbaW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgcCA9IHAudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25kdWN0b3IucGl0Y2hlc1twXSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBwID0gcGFyc2VGbG9hdChwKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNOYU4ocCkgfHwgcCA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHAgKyAnIGlzIG5vdCBhIHZhbGlkIHBpdGNoLicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5zdHJ1bWVudC5ub3Rlcy5wdXNoKHtcclxuICAgICAgICAgICAgcmh5dGhtOiByaHl0aG0sXHJcbiAgICAgICAgICAgIHBpdGNoOiBwaXRjaCxcclxuICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxyXG4gICAgICAgICAgICBhcnRpY3VsYXRpb25HYXA6IGFydGljdWxhdGlvbkdhcCxcclxuICAgICAgICAgICAgdGllOiB0aWUsXHJcbiAgICAgICAgICAgIHN0YXJ0VGltZTogaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uLFxyXG4gICAgICAgICAgICBzdG9wVGltZTogaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uICsgZHVyYXRpb24gLSBhcnRpY3VsYXRpb25HYXAsXHJcbiAgICAgICAgICAgIC8vIFZvbHVtZSBuZWVkcyB0byBiZSBhIHF1YXJ0ZXIgb2YgdGhlIG1hc3RlciBzbyBpdCBkb2Vzbid0IGNsaXBcclxuICAgICAgICAgICAgdm9sdW1lTGV2ZWw6IHZvbHVtZUxldmVsIC8gNFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpbnN0cnVtZW50LnRvdGFsRHVyYXRpb24gKz0gZHVyYXRpb247XHJcblxyXG4gICAgICAgIHJldHVybiBpbnN0cnVtZW50O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIHJlc3QgdG8gYW4gaW5zdHJ1bWVudFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSByaHl0aG1cclxuICAgICAqL1xyXG4gICAgaW5zdHJ1bWVudC5yZXN0ID0gZnVuY3Rpb24ocmh5dGhtKSB7XHJcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gZ2V0RHVyYXRpb24ocmh5dGhtKTtcclxuXHJcbiAgICAgICAgaW5zdHJ1bWVudC5ub3Rlcy5wdXNoKHtcclxuICAgICAgICAgICAgcmh5dGhtOiByaHl0aG0sXHJcbiAgICAgICAgICAgIHBpdGNoOiBmYWxzZSxcclxuICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxyXG4gICAgICAgICAgICBhcnRpY3VsYXRpb25HYXA6IDAsXHJcbiAgICAgICAgICAgIHN0YXJ0VGltZTogaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uLFxyXG4gICAgICAgICAgICBzdG9wVGltZTogaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uICsgZHVyYXRpb25cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uICs9IGR1cmF0aW9uO1xyXG5cclxuICAgICAgICByZXR1cm4gaW5zdHJ1bWVudDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQbGFjZSB3aGVyZSBhIHJlcGVhdCBzZWN0aW9uIHNob3VsZCBzdGFydFxyXG4gICAgICovXHJcbiAgICBpbnN0cnVtZW50LnJlcGVhdFN0YXJ0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGFzdFJlcGVhdENvdW50ID0gaW5zdHJ1bWVudC5ub3Rlcy5sZW5ndGg7XHJcblxyXG4gICAgICAgIHJldHVybiBpbnN0cnVtZW50O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlcGVhdCBmcm9tIGJlZ2lubmluZ1xyXG4gICAgICovXHJcbiAgICBpbnN0cnVtZW50LnJlcGVhdEZyb21CZWdpbm5pbmcgPSBmdW5jdGlvbihudW1PZlJlcGVhdHMpIHtcclxuICAgICAgICBsYXN0UmVwZWF0Q291bnQgPSAwO1xyXG4gICAgICAgIGluc3RydW1lbnQucmVwZWF0KG51bU9mUmVwZWF0cyk7XHJcblxyXG4gICAgICAgIHJldHVybiBpbnN0cnVtZW50O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE51bWJlciBvZiB0aW1lcyB0aGUgc2VjdGlvbiBzaG91bGQgcmVwZWF0XHJcbiAgICAgKiBAcGFyYW0gW251bU9mUmVwZWF0c10gLSBkZWZhdWx0cyB0byAxXHJcbiAgICAgKi9cclxuICAgIGluc3RydW1lbnQucmVwZWF0ID0gZnVuY3Rpb24obnVtT2ZSZXBlYXRzKSB7XHJcbiAgICAgICAgbnVtT2ZSZXBlYXRzID0gdHlwZW9mIG51bU9mUmVwZWF0cyA9PT0gJ3VuZGVmaW5lZCcgPyAxIDogbnVtT2ZSZXBlYXRzO1xyXG4gICAgICAgIHZhciBub3Rlc0J1ZmZlckNvcHkgPSBpbnN0cnVtZW50Lm5vdGVzLnNsaWNlKGxhc3RSZXBlYXRDb3VudCk7XHJcbiAgICAgICAgZm9yICh2YXIgciA9IDA7IHIgPCBudW1PZlJlcGVhdHM7IHIgKyspIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgIHdoaWxlICgrK2luZGV4IDwgbm90ZXNCdWZmZXJDb3B5Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5vdGVDb3B5ID0gY2xvbmUobm90ZXNCdWZmZXJDb3B5W2luZGV4XSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbm90ZUNvcHkuc3RhcnRUaW1lID0gaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgbm90ZUNvcHkuc3RvcFRpbWUgPSBpbnN0cnVtZW50LnRvdGFsRHVyYXRpb24gKyBub3RlQ29weS5kdXJhdGlvbiAtIG5vdGVDb3B5LmFydGljdWxhdGlvbkdhcDtcclxuXHJcbiAgICAgICAgICAgICAgICBpbnN0cnVtZW50Lm5vdGVzLnB1c2gobm90ZUNvcHkpO1xyXG4gICAgICAgICAgICAgICAgaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uICs9IG5vdGVDb3B5LmR1cmF0aW9uO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaW5zdHJ1bWVudDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXNldCB0aGUgZHVyYXRpb24sIHN0YXJ0LCBhbmQgc3RvcCB0aW1lIG9mIGVhY2ggbm90ZS5cclxuICAgICAqL1xyXG4gICAgaW5zdHJ1bWVudC5yZXNldER1cmF0aW9uID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gLTEsXHJcbiAgICAgICAgICAgIG51bU9mTm90ZXMgPSBpbnN0cnVtZW50Lm5vdGVzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uID0gMDtcclxuXHJcbiAgICAgICAgd2hpbGUgKCsraW5kZXggPCBudW1PZk5vdGVzKSB7XHJcbiAgICAgICAgICAgIHZhciBub3RlID0gaW5zdHJ1bWVudC5ub3Rlc1tpbmRleF0sXHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbiA9IGdldER1cmF0aW9uKG5vdGUucmh5dGhtKSxcclxuICAgICAgICAgICAgICAgIGFydGljdWxhdGlvbkdhcCA9IG5vdGUudGllID8gMCA6IGR1cmF0aW9uICogYXJ0aWN1bGF0aW9uR2FwUGVyY2VudGFnZTtcclxuXHJcbiAgICAgICAgICAgIG5vdGUuZHVyYXRpb24gPSBnZXREdXJhdGlvbihub3RlLnJoeXRobSk7XHJcbiAgICAgICAgICAgIG5vdGUuc3RhcnRUaW1lID0gaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uO1xyXG4gICAgICAgICAgICBub3RlLnN0b3BUaW1lID0gaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uICsgZHVyYXRpb24gLSBhcnRpY3VsYXRpb25HYXA7XHJcblxyXG4gICAgICAgICAgICBpZiAobm90ZS5waXRjaCAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIG5vdGUuYXJ0aWN1bGF0aW9uR2FwID0gYXJ0aWN1bGF0aW9uR2FwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpbnN0cnVtZW50LnRvdGFsRHVyYXRpb24gKz0gZHVyYXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxufSx7fV0sNjpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XHJcbi8qKlxyXG4gKiBCYW5kLmpzIC0gTXVzaWMgQ29tcG9zZXJcclxuICogQW4gaW50ZXJmYWNlIGZvciB0aGUgV2ViIEF1ZGlvIEFQSSB0aGF0IHN1cHBvcnRzIHJoeXRobXMsIG11bHRpcGxlIGluc3RydW1lbnRzLCByZXBlYXRpbmcgc2VjdGlvbnMsIGFuZCBjb21wbGV4XHJcbiAqIHRpbWUgc2lnbmF0dXJlcy5cclxuICpcclxuICogQGF1dGhvciBDb2R5IEx1bmRxdWlzdCAoaHR0cDovL2dpdGh1Yi5jb20vbWVlbmllKSAtIDIwMTRcclxuICovXHJcblxyXG4vKipcclxuICogQHR5cGUge0JhbmRKU31cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gX2RlcmVxXygnLi9jb25kdWN0b3IuanMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmxvYWRQYWNrKCdpbnN0cnVtZW50JywgJ25vaXNlcycsIF9kZXJlcV8oJy4vaW5zdHJ1bWVudC1wYWNrcy9ub2lzZXMuanMnKSk7XHJcbm1vZHVsZS5leHBvcnRzLmxvYWRQYWNrKCdpbnN0cnVtZW50JywgJ29zY2lsbGF0b3JzJywgX2RlcmVxXygnLi9pbnN0cnVtZW50LXBhY2tzL29zY2lsbGF0b3JzLmpzJykpO1xyXG5tb2R1bGUuZXhwb3J0cy5sb2FkUGFjaygncmh5dGhtJywgJ25vcnRoQW1lcmljYW4nLCBfZGVyZXFfKCcuL3JoeXRobS1wYWNrcy9ub3J0aC1hbWVyaWNhbi5qcycpKTtcclxubW9kdWxlLmV4cG9ydHMubG9hZFBhY2soJ3JoeXRobScsICdldXJvcGVhbicsIF9kZXJlcV8oJy4vcmh5dGhtLXBhY2tzL2V1cm9wZWFuLmpzJykpO1xyXG5tb2R1bGUuZXhwb3J0cy5sb2FkUGFjaygndHVuaW5nJywgJ2VxdWFsVGVtcGVyYW1lbnQnLCBfZGVyZXFfKCcuL3R1bmluZy1wYWNrcy9lcXVhbC10ZW1wZXJhbWVudC5qcycpKTtcclxuXHJcbn0se1wiLi9jb25kdWN0b3IuanNcIjoyLFwiLi9pbnN0cnVtZW50LXBhY2tzL25vaXNlcy5qc1wiOjMsXCIuL2luc3RydW1lbnQtcGFja3Mvb3NjaWxsYXRvcnMuanNcIjo0LFwiLi9yaHl0aG0tcGFja3MvZXVyb3BlYW4uanNcIjo4LFwiLi9yaHl0aG0tcGFja3Mvbm9ydGgtYW1lcmljYW4uanNcIjo5LFwiLi90dW5pbmctcGFja3MvZXF1YWwtdGVtcGVyYW1lbnQuanNcIjoxMH1dLDc6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xyXG4vKipcclxuICogQmFuZC5qcyAtIE11c2ljIENvbXBvc2VyXHJcbiAqIEFuIGludGVyZmFjZSBmb3IgdGhlIFdlYiBBdWRpbyBBUEkgdGhhdCBzdXBwb3J0cyByaHl0aG1zLCBtdWx0aXBsZSBpbnN0cnVtZW50cywgcmVwZWF0aW5nIHNlY3Rpb25zLCBhbmQgY29tcGxleFxyXG4gKiB0aW1lIHNpZ25hdHVyZXMuXHJcbiAqXHJcbiAqIEBhdXRob3IgQ29keSBMdW5kcXVpc3QgKGh0dHA6Ly9naXRodWIuY29tL21lZW5pZSkgLSAyMDE0XHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjtcclxuXHJcbi8qKlxyXG4gKiBQbGF5ZXIgQ2xhc3MgLSBUaGlzIGdldHMgaW5zdGFudGlhdGVkIGJ5IHRoZSBDb25kdWN0b3IgY2xhc3Mgd2hlbiBgQ29uZHVjdG9yLmZpbmlzaCgpYCBpcyBjYWxsZWRcclxuICpcclxuICogQHBhcmFtIGNvbmR1Y3RvclxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIFBsYXllcihjb25kdWN0b3IpIHtcclxuICAgIHZhciBwbGF5ZXIgPSB0aGlzLFxyXG4gICAgICAgIGJ1ZmZlclRpbWVvdXQsXHJcbiAgICAgICAgYWxsTm90ZXMgPSBidWZmZXJOb3RlcygpLFxyXG4gICAgICAgIGN1cnJlbnRQbGF5VGltZSxcclxuICAgICAgICB0b3RhbFBsYXlUaW1lID0gMCxcclxuICAgICAgICBmYWRlZCA9IGZhbHNlO1xyXG5cclxuICAgIGNhbGN1bGF0ZVRvdGFsRHVyYXRpb24oKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEhlbHBlciBmdW5jdGlvbiB0byBzdG9wIGFsbCBub3RlcyBhbmRcclxuICAgICAqIHRoZW4gcmUtYnVmZmVycyB0aGVtXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbcmVzZXREdXJhdGlvbl1cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gcmVzZXQocmVzZXREdXJhdGlvbikge1xyXG4gICAgICAgIC8vIFJlc2V0IHRoZSBidWZmZXIgcG9zaXRpb24gb2YgYWxsIGluc3RydW1lbnRzXHJcbiAgICAgICAgdmFyIGluZGV4ID0gLTEsXHJcbiAgICAgICAgICAgIG51bU9mSW5zdHJ1bWVudHMgPSBjb25kdWN0b3IuaW5zdHJ1bWVudHMubGVuZ3RoO1xyXG4gICAgICAgIHdoaWxlICgrK2luZGV4IDwgbnVtT2ZJbnN0cnVtZW50cykge1xyXG4gICAgICAgICAgICB2YXIgaW5zdHJ1bWVudCA9IGNvbmR1Y3Rvci5pbnN0cnVtZW50c1tpbmRleF07XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzZXREdXJhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgaW5zdHJ1bWVudC5yZXNldER1cmF0aW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaW5zdHJ1bWVudC5idWZmZXJQb3NpdGlvbiA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBJZiB3ZSBhcmUgcmVzZXRpbmcgdGhlIGR1cmF0aW9uLCB3ZSBuZWVkIHRvIGZpZ3VyZSBvdXQgdGhlIG5ldyB0b3RhbCBkdXJhdGlvbi5cclxuICAgICAgICAvLyBBbHNvIHNldCB0aGUgdG90YWxQbGF5VGltZSB0byB0aGUgY3VycmVudCBwZXJjZW50YWdlIGRvbmUgb2YgdGhlIG5ldyB0b3RhbCBkdXJhdGlvbi5cclxuICAgICAgICBpZiAocmVzZXREdXJhdGlvbikge1xyXG4gICAgICAgICAgICBjYWxjdWxhdGVUb3RhbER1cmF0aW9uKCk7XHJcbiAgICAgICAgICAgIHRvdGFsUGxheVRpbWUgPSBjb25kdWN0b3IucGVyY2VudGFnZUNvbXBsZXRlICogY29uZHVjdG9yLnRvdGFsRHVyYXRpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbmRleCA9IC0xO1xyXG4gICAgICAgIHdoaWxlICgrK2luZGV4IDwgYWxsTm90ZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGFsbE5vdGVzW2luZGV4XS5nYWluLmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsZWFyVGltZW91dChidWZmZXJUaW1lb3V0KTtcclxuXHJcbiAgICAgICAgYWxsTm90ZXMgPSBidWZmZXJOb3RlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSGVscGVyIGZ1bmN0aW9uIHRvIGZhZGUgdXAvZG93biBtYXN0ZXIgdm9sdW1lXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGRpcmVjdGlvbiAtIHVwIG9yIGRvd25cclxuICAgICAqIEBwYXJhbSBbY2JdIC0gQ2FsbGJhY2sgZnVuY3Rpb24gZmlyZWQgYWZ0ZXIgdGhlIHRyYW5zaXRpb24gaXMgY29tcGxldGVkXHJcbiAgICAgKiBAcGFyYW0gW3Jlc2V0Vm9sdW1lXSAtIFJlc2V0IHRoZSB2b2x1bWUgYmFjayB0byBpdCdzIG9yaWdpbmFsIGxldmVsXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGZhZGUoZGlyZWN0aW9uLCBjYiwgcmVzZXRWb2x1bWUpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHJlc2V0Vm9sdW1lID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICByZXNldFZvbHVtZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoJ3VwJyAhPT0gZGlyZWN0aW9uICYmICdkb3duJyAhPT0gZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGlyZWN0aW9uIG11c3QgYmUgZWl0aGVyIHVwIG9yIGRvd24uJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZmFkZUR1cmF0aW9uID0gMC4yO1xyXG5cclxuICAgICAgICBmYWRlZCA9IGRpcmVjdGlvbiA9PT0gJ2Rvd24nO1xyXG5cclxuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAndXAnKSB7XHJcbiAgICAgICAgICAgIGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWUuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCBjb25kdWN0b3IuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lKTtcclxuICAgICAgICAgICAgY29uZHVjdG9yLm1hc3RlclZvbHVtZS5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWVMZXZlbCwgY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSArIGZhZGVEdXJhdGlvbik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uZHVjdG9yLm1hc3RlclZvbHVtZS5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWVMZXZlbCwgY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XHJcbiAgICAgICAgICAgIGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWUuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCBjb25kdWN0b3IuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lICsgZmFkZUR1cmF0aW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIGNiLmNhbGwocGxheWVyKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHJlc2V0Vm9sdW1lKSB7XHJcbiAgICAgICAgICAgICAgICBmYWRlZCA9ICEgZmFkZWQ7XHJcbiAgICAgICAgICAgICAgICBjb25kdWN0b3IubWFzdGVyVm9sdW1lLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoY29uZHVjdG9yLm1hc3RlclZvbHVtZUxldmVsLCBjb25kdWN0b3IuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIGZhZGVEdXJhdGlvbiAqIDEwMDApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlcyB0aGUgdG90YWwgZHVyYXRpb24gb2YgYSBzb25nIGJhc2VkIG9uIHRoZSBsb25nZXN0IGR1cmF0aW9uIG9mIGFsbCBpbnN0cnVtZW50cy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlVG90YWxEdXJhdGlvbigpIHtcclxuICAgICAgICB2YXIgaW5kZXggPSAtMTtcclxuICAgICAgICB2YXIgdG90YWxEdXJhdGlvbiA9IDA7XHJcbiAgICAgICAgd2hpbGUgKCsraW5kZXggPCBjb25kdWN0b3IuaW5zdHJ1bWVudHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHZhciBpbnN0cnVtZW50ID0gY29uZHVjdG9yLmluc3RydW1lbnRzW2luZGV4XTtcclxuICAgICAgICAgICAgaWYgKGluc3RydW1lbnQudG90YWxEdXJhdGlvbiA+IHRvdGFsRHVyYXRpb24pIHtcclxuICAgICAgICAgICAgICAgIHRvdGFsRHVyYXRpb24gPSBpbnN0cnVtZW50LnRvdGFsRHVyYXRpb247XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbmR1Y3Rvci50b3RhbER1cmF0aW9uID0gdG90YWxEdXJhdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdyYWJzIGEgc2V0IG9mIG5vdGVzIGJhc2VkIG9uIHRoZSBjdXJyZW50IHRpbWUgYW5kIHdoYXQgdGhlIEJ1ZmZlciBTaXplIGlzLlxyXG4gICAgICogSXQgd2lsbCBhbHNvIHNraXAgYW55IG5vdGVzIHRoYXQgaGF2ZSBhIHN0YXJ0IHRpbWUgbGVzcyB0aGFuIHRoZVxyXG4gICAgICogdG90YWwgcGxheSB0aW1lLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYnVmZmVyTm90ZXMoKSB7XHJcbiAgICAgICAgdmFyIG5vdGVzID0gW10sXHJcbiAgICAgICAgICAgIGluZGV4ID0gLTEsXHJcbiAgICAgICAgICAgIGJ1ZmZlclNpemUgPSBjb25kdWN0b3Iubm90ZUJ1ZmZlckxlbmd0aDtcclxuXHJcbiAgICAgICAgd2hpbGUgKCsraW5kZXggPCBjb25kdWN0b3IuaW5zdHJ1bWVudHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHZhciBpbnN0cnVtZW50ID0gY29uZHVjdG9yLmluc3RydW1lbnRzW2luZGV4XTtcclxuICAgICAgICAgICAgLy8gQ3JlYXRlIHZvbHVtZSBmb3IgdGhpcyBpbnN0cnVtZW50XHJcbiAgICAgICAgICAgIHZhciBidWZmZXJDb3VudCA9IGJ1ZmZlclNpemU7XHJcbiAgICAgICAgICAgIHZhciBpbmRleDIgPSAtMTtcclxuICAgICAgICAgICAgd2hpbGUgKCsraW5kZXgyIDwgYnVmZmVyQ291bnQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBub3RlID0gaW5zdHJ1bWVudC5ub3Rlc1tpbnN0cnVtZW50LmJ1ZmZlclBvc2l0aW9uICsgaW5kZXgyXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG5vdGUgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHBpdGNoID0gbm90ZS5waXRjaCxcclxuICAgICAgICAgICAgICAgICAgICBzdGFydFRpbWUgPSBub3RlLnN0YXJ0VGltZSxcclxuICAgICAgICAgICAgICAgICAgICBzdG9wVGltZSA9IG5vdGUuc3RvcFRpbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdm9sdW1lTGV2ZWwgPSBub3RlLnZvbHVtZUxldmVsO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzdG9wVGltZSA8IHRvdGFsUGxheVRpbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBidWZmZXJDb3VudCArKztcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBJZiBwaXRjaCBpcyBmYWxzZSwgdGhlbiBpdCdzIGEgcmVzdCBhbmQgd2UgZG9uJ3QgbmVlZCBhIG5vdGVcclxuICAgICAgICAgICAgICAgIGlmIChmYWxzZSA9PT0gcGl0Y2gpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZ2FpbiA9IGNvbmR1Y3Rvci5hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xyXG4gICAgICAgICAgICAgICAgLy8gQ29ubmVjdCB2b2x1bWUgZ2FpbiB0byB0aGUgTWFzdGVyIFZvbHVtZTtcclxuICAgICAgICAgICAgICAgIGdhaW4uY29ubmVjdChjb25kdWN0b3IubWFzdGVyVm9sdW1lKTtcclxuICAgICAgICAgICAgICAgIGdhaW4uZ2Fpbi52YWx1ZSA9IHZvbHVtZUxldmVsO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBzdGFydFRpbWUgaXMgbGVzcyB0aGFuIHRvdGFsIHBsYXkgdGltZSwgd2UgbmVlZCB0byBzdGFydCB0aGUgbm90ZVxyXG4gICAgICAgICAgICAgICAgLy8gaW4gdGhlIG1pZGRsZVxyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0VGltZSA8IHRvdGFsUGxheVRpbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydFRpbWUgPSBzdG9wVGltZSAtIHRvdGFsUGxheVRpbWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTm8gcGl0Y2hlcyBkZWZpbmVkXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHBpdGNoID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vdGVzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydFRpbWU6IHN0YXJ0VGltZSA8IHRvdGFsUGxheVRpbWUgPyBzdG9wVGltZSAtIHRvdGFsUGxheVRpbWUgOiBzdGFydFRpbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3BUaW1lOiBzdG9wVGltZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTogaW5zdHJ1bWVudC5pbnN0cnVtZW50LmNyZWF0ZU5vdGUoZ2FpbiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdhaW46IGdhaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZvbHVtZUxldmVsOiB2b2x1bWVMZXZlbFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXgzID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKCsraW5kZXgzIDwgcGl0Y2gubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwID0gcGl0Y2hbaW5kZXgzXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm90ZXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFRpbWU6IHN0YXJ0VGltZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b3BUaW1lOiBzdG9wVGltZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGU6IGluc3RydW1lbnQuaW5zdHJ1bWVudC5jcmVhdGVOb3RlKGdhaW4sIGNvbmR1Y3Rvci5waXRjaGVzW3AudHJpbSgpXSB8fCBwYXJzZUZsb2F0KHApKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhaW46IGdhaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2b2x1bWVMZXZlbDogdm9sdW1lTGV2ZWxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGluc3RydW1lbnQuYnVmZmVyUG9zaXRpb24gKz0gYnVmZmVyQ291bnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBSZXR1cm4gYXJyYXkgb2Ygbm90ZXNcclxuICAgICAgICByZXR1cm4gbm90ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdG90YWxQbGF5VGltZUNhbGN1bGF0b3IoKSB7XHJcbiAgICAgICAgaWYgKCEgcGxheWVyLnBhdXNlZCAmJiBwbGF5ZXIucGxheWluZykge1xyXG4gICAgICAgICAgICBpZiAoY29uZHVjdG9yLnRvdGFsRHVyYXRpb24gPCB0b3RhbFBsYXlUaW1lKSB7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIuc3RvcChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocGxheWVyLmxvb3BpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucGxheSgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uZHVjdG9yLm9uRmluaXNoZWRDYWxsYmFjaygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlVG90YWxQbGF5VGltZSgpO1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCh0b3RhbFBsYXlUaW1lQ2FsY3VsYXRvciwgMTAwMCAvIDYwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGwgdG8gdXBkYXRlIHRoZSB0b3RhbCBwbGF5IHRpbWUgc28gZmFyXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZVRvdGFsUGxheVRpbWUoKSB7XHJcbiAgICAgICAgdG90YWxQbGF5VGltZSArPSBjb25kdWN0b3IuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lIC0gY3VycmVudFBsYXlUaW1lO1xyXG4gICAgICAgIHZhciBzZWNvbmRzID0gTWF0aC5yb3VuZCh0b3RhbFBsYXlUaW1lKTtcclxuICAgICAgICBpZiAoc2Vjb25kcyAhPSBjb25kdWN0b3IuY3VycmVudFNlY29uZHMpIHtcclxuICAgICAgICAgICAgLy8gTWFrZSBjYWxsYmFjayBhc3luY2hyb25vdXNcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbmR1Y3Rvci5vblRpY2tlckNhbGxiYWNrKHNlY29uZHMpO1xyXG4gICAgICAgICAgICB9LCAxKTtcclxuICAgICAgICAgICAgY29uZHVjdG9yLmN1cnJlbnRTZWNvbmRzID0gc2Vjb25kcztcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uZHVjdG9yLnBlcmNlbnRhZ2VDb21wbGV0ZSA9IHRvdGFsUGxheVRpbWUgLyBjb25kdWN0b3IudG90YWxEdXJhdGlvbjtcclxuICAgICAgICBjdXJyZW50UGxheVRpbWUgPSBjb25kdWN0b3IuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYXllci5wYXVzZWQgPSBmYWxzZTtcclxuICAgIHBsYXllci5wbGF5aW5nID0gZmFsc2U7XHJcbiAgICBwbGF5ZXIubG9vcGluZyA9IGZhbHNlO1xyXG4gICAgcGxheWVyLm11dGVkID0gZmFsc2U7XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogR3JhYnMgY3VycmVudGx5IGJ1ZmZlcmVkIG5vdGVzIGFuZCBjYWxscyB0aGVpciBzdGFydC9zdG9wIG1ldGhvZHMuXHJcbiAgICAgKlxyXG4gICAgICogSXQgdGhlbiBzZXRzIHVwIGEgdGltZXIgdG8gYnVmZmVyIHVwIHRoZSBuZXh0IHNldCBvZiBub3RlcyBiYXNlZCBvbiB0aGVcclxuICAgICAqIGEgc2V0IGJ1ZmZlciBzaXplLiAgVGhpcyB3aWxsIGtlZXAgZ29pbmcgdW50aWwgdGhlIHNvbmcgaXMgc3RvcHBlZCBvciBwYXVzZWQuXHJcbiAgICAgKlxyXG4gICAgICogSXQgd2lsbCB1c2UgdGhlIHRvdGFsIHRpbWUgcGxheWVkIHNvIGZhciBhcyBhbiBvZmZzZXQgc28geW91IHBhdXNlL3BsYXkgdGhlIG11c2ljXHJcbiAgICAgKi9cclxuICAgIHBsYXllci5wbGF5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcGxheWVyLnBsYXlpbmcgPSB0cnVlO1xyXG4gICAgICAgIHBsYXllci5wYXVzZWQgPSBmYWxzZTtcclxuICAgICAgICBjdXJyZW50UGxheVRpbWUgPSBjb25kdWN0b3IuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xyXG4gICAgICAgIC8vIFN0YXJ0cyBjYWxjdWxhdG9yIHdoaWNoIGtlZXBzIHRyYWNrIG9mIHRvdGFsIHBsYXkgdGltZVxyXG4gICAgICAgIHRvdGFsUGxheVRpbWVDYWxjdWxhdG9yKCk7XHJcbiAgICAgICAgdmFyIHRpbWVPZmZzZXQgPSBjb25kdWN0b3IuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lIC0gdG90YWxQbGF5VGltZSxcclxuICAgICAgICAgICAgcGxheU5vdGVzID0gZnVuY3Rpb24obm90ZXMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKCsraW5kZXggPCBub3Rlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbm90ZSA9IG5vdGVzW2luZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhcnRUaW1lID0gbm90ZS5zdGFydFRpbWUgKyB0aW1lT2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9wVGltZSA9IG5vdGUuc3RvcFRpbWUgKyB0aW1lT2Zmc2V0O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgKiBJZiBubyB0aWUsIHRoZW4gd2UgbmVlZCB0byBpbnRyb2R1Y2UgYSB2b2x1bWUgcmFtcCB1cCB0byByZW1vdmUgYW55IGNsaXBwaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICogYXMgT3NjaWxsYXRvcnMgaGF2ZSBhbiBpc3N1ZSB3aXRoIHRoaXMgd2hlbiBwbGF5aW5nIGEgbm90ZSBhdCBmdWxsIHZvbHVtZS5cclxuICAgICAgICAgICAgICAgICAgICAgKiBXZSBhbHNvIHB1dCBpbiBhIHNsaWdodCByYW1wIGRvd24gYXMgd2VsbC4gIFRoaXMgb25seSB0YWtlcyB1cCAxLzEwMDAgb2YgYSBzZWNvbmQuXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEgbm90ZS50aWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXJ0VGltZSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZSAtPSAwLjAwMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9wVGltZSArPSAwLjAwMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm90ZS5nYWluLmdhaW4uc2V0VmFsdWVBdFRpbWUoMC4wLCBzdGFydFRpbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3RlLmdhaW4uZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZShub3RlLnZvbHVtZUxldmVsLCBzdGFydFRpbWUgKyAwLjAwMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdGUuZ2Fpbi5nYWluLnNldFZhbHVlQXRUaW1lKG5vdGUudm9sdW1lTGV2ZWwsIHN0b3BUaW1lIC0gMC4wMDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3RlLmdhaW4uZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLjAsIHN0b3BUaW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG5vdGUubm9kZS5zdGFydChzdGFydFRpbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vdGUubm9kZS5zdG9wKHN0b3BUaW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYnVmZmVyVXAgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGJ1ZmZlclRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uIGJ1ZmZlckluTmV3Tm90ZXMoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBsYXllci5wbGF5aW5nICYmICEgcGxheWVyLnBhdXNlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Tm90ZXMgPSBidWZmZXJOb3RlcygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3Tm90ZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxheU5vdGVzKG5ld05vdGVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbE5vdGVzID0gYWxsTm90ZXMuY29uY2F0KG5ld05vdGVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlclVwKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCBjb25kdWN0b3IudGVtcG8gKiA1MDAwKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcGxheU5vdGVzKGFsbE5vdGVzKTtcclxuICAgICAgICBidWZmZXJVcCgpO1xyXG5cclxuICAgICAgICBpZiAoZmFkZWQgJiYgISBwbGF5ZXIubXV0ZWQpIHtcclxuICAgICAgICAgICAgZmFkZSgndXAnKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBTdG9wIHBsYXlpbmcgYWxsIG11c2ljIGFuZCByZXdpbmQgdGhlIHNvbmdcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZmFkZU91dCBib29sZWFuIC0gc2hvdWxkIHRoZSBzb25nIGZhZGUgb3V0P1xyXG4gICAgICovXHJcbiAgICBwbGF5ZXIuc3RvcCA9IGZ1bmN0aW9uKGZhZGVPdXQpIHtcclxuICAgICAgICBwbGF5ZXIucGxheWluZyA9IGZhbHNlO1xyXG4gICAgICAgIGNvbmR1Y3Rvci5jdXJyZW50U2Vjb25kcyA9IDA7XHJcbiAgICAgICAgY29uZHVjdG9yLnBlcmNlbnRhZ2VDb21wbGV0ZSA9IDA7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgZmFkZU91dCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgZmFkZU91dCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChmYWRlT3V0ICYmICEgcGxheWVyLm11dGVkKSB7XHJcbiAgICAgICAgICAgIGZhZGUoJ2Rvd24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRvdGFsUGxheVRpbWUgPSAwO1xyXG4gICAgICAgICAgICAgICAgcmVzZXQoKTtcclxuICAgICAgICAgICAgICAgIC8vIE1ha2UgY2FsbGJhY2sgYXN5bmNocm9ub3VzXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbmR1Y3Rvci5vblRpY2tlckNhbGxiYWNrKGNvbmR1Y3Rvci5jdXJyZW50U2Vjb25kcyk7XHJcbiAgICAgICAgICAgICAgICB9LCAxKTtcclxuICAgICAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdG90YWxQbGF5VGltZSA9IDA7XHJcbiAgICAgICAgICAgIHJlc2V0KCk7XHJcbiAgICAgICAgICAgIC8vIE1ha2UgY2FsbGJhY2sgYXN5bmNocm9ub3VzXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25kdWN0b3Iub25UaWNrZXJDYWxsYmFjayhjb25kdWN0b3IuY3VycmVudFNlY29uZHMpO1xyXG4gICAgICAgICAgICB9LCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGF1c2VzIHRoZSBtdXNpYywgcmVzZXRzIHRoZSBub3RlcyxcclxuICAgICAqIGFuZCBnZXRzIHRoZSB0b3RhbCB0aW1lIHBsYXllZCBzbyBmYXJcclxuICAgICAqL1xyXG4gICAgcGxheWVyLnBhdXNlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcGxheWVyLnBhdXNlZCA9IHRydWU7XHJcbiAgICAgICAgdXBkYXRlVG90YWxQbGF5VGltZSgpO1xyXG4gICAgICAgIGlmIChwbGF5ZXIubXV0ZWQpIHtcclxuICAgICAgICAgICAgcmVzZXQoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBmYWRlKCdkb3duJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXNldCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHRydWUgaWYgeW91IHdhbnQgdGhlIHNvbmcgdG8gbG9vcFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB2YWxcclxuICAgICAqL1xyXG4gICAgcGxheWVyLmxvb3AgPSBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgICBwbGF5ZXIubG9vcGluZyA9ICEhIHZhbDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgYSBzcGVjaWZpYyB0aW1lIHRoYXQgdGhlIHNvbmcgc2hvdWxkIHN0YXJ0IGl0LlxyXG4gICAgICogSWYgaXQncyBhbHJlYWR5IHBsYXlpbmcsIHJlc2V0IGFuZCBzdGFydCB0aGUgc29uZ1xyXG4gICAgICogYWdhaW4gc28gaXQgaGFzIGEgc2VhbWxlc3MganVtcC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbmV3VGltZVxyXG4gICAgICovXHJcbiAgICBwbGF5ZXIuc2V0VGltZSA9IGZ1bmN0aW9uKG5ld1RpbWUpIHtcclxuICAgICAgICB0b3RhbFBsYXlUaW1lID0gcGFyc2VJbnQobmV3VGltZSk7XHJcbiAgICAgICAgcmVzZXQoKTtcclxuICAgICAgICBpZiAocGxheWVyLnBsYXlpbmcgJiYgISBwbGF5ZXIucGF1c2VkKSB7XHJcbiAgICAgICAgICAgIHBsYXllci5wbGF5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc2V0IHRoZSB0ZW1wbyBmb3IgYSBzb25nLiBUaGlzIHdpbGwgdHJpZ2dlciBhXHJcbiAgICAgKiBkdXJhdGlvbiByZXNldCBmb3IgZWFjaCBpbnN0cnVtZW50IGFzIHdlbGwuXHJcbiAgICAgKi9cclxuICAgIHBsYXllci5yZXNldFRlbXBvID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmVzZXQodHJ1ZSk7XHJcbiAgICAgICAgaWYgKHBsYXllci5wbGF5aW5nICYmICEgcGxheWVyLnBhdXNlZCkge1xyXG4gICAgICAgICAgICBwbGF5ZXIucGxheSgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNdXRlIGFsbCBvZiB0aGUgbXVzaWNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY2IgLSBDYWxsYmFjayBmdW5jdGlvbiBjYWxsZWQgd2hlbiBtdXNpYyBoYXMgYmVlbiBtdXRlZFxyXG4gICAgICovXHJcbiAgICBwbGF5ZXIubXV0ZSA9IGZ1bmN0aW9uKGNiKSB7XHJcbiAgICAgICAgcGxheWVyLm11dGVkID0gdHJ1ZTtcclxuICAgICAgICBmYWRlKCdkb3duJywgY2IpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFVubXV0ZSBhbGwgb2YgdGhlIG11c2ljXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNiIC0gQ2FsbGJhY2sgZnVuY3Rpb24gY2FsbGVkIHdoZW4gbXVzaWMgaGFzIGJlZW4gdW5tdXRlZFxyXG4gICAgICovXHJcbiAgICBwbGF5ZXIudW5tdXRlID0gZnVuY3Rpb24oY2IpIHtcclxuICAgICAgICBwbGF5ZXIubXV0ZWQgPSBmYWxzZTtcclxuICAgICAgICBmYWRlKCd1cCcsIGNiKTtcclxuICAgIH07XHJcbn1cclxuXHJcbn0se31dLDg6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xyXG4vKipcclxuICogQmFuZC5qcyAtIE11c2ljIENvbXBvc2VyXHJcbiAqIEFuIGludGVyZmFjZSBmb3IgdGhlIFdlYiBBdWRpbyBBUEkgdGhhdCBzdXBwb3J0cyByaHl0aG1zLCBtdWx0aXBsZSBpbnN0cnVtZW50cywgcmVwZWF0aW5nIHNlY3Rpb25zLCBhbmQgY29tcGxleFxyXG4gKiB0aW1lIHNpZ25hdHVyZXMuXHJcbiAqXHJcbiAqIEBhdXRob3IgQ29keSBMdW5kcXVpc3QgKGh0dHA6Ly9naXRodWIuY29tL21lZW5pZSkgLSAyMDE0XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEV1cm9wZWFuIFJoeXRobSBQYWNrXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHNlbWlicmV2ZTogMSxcclxuICAgIGRvdHRlZE1pbmltOiAwLjc1LFxyXG4gICAgbWluaW06IDAuNSxcclxuICAgIGRvdHRlZENyb3RjaGV0OiAwLjM3NSxcclxuICAgIHRyaXBsZXRNaW5pbTogMC4zMzMzMzMzNCxcclxuICAgIGNyb3RjaGV0OiAwLjI1LFxyXG4gICAgZG90dGVkUXVhdmVyOiAwLjE4NzUsXHJcbiAgICB0cmlwbGV0Q3JvdGNoZXQ6IDAuMTY2NjY2NjY3LFxyXG4gICAgcXVhdmVyOiAwLjEyNSxcclxuICAgIGRvdHRlZFNlbWlxdWF2ZXI6IDAuMDkzNzUsXHJcbiAgICB0cmlwbGV0UXVhdmVyOiAwLjA4MzMzMzMzMyxcclxuICAgIHNlbWlxdWF2ZXI6IDAuMDYyNSxcclxuICAgIHRyaXBsZXRTZW1pcXVhdmVyOiAwLjA0MTY2NjY2NyxcclxuICAgIGRlbWlzZW1pcXVhdmVyOiAwLjAzMTI1XHJcbn07XHJcblxyXG59LHt9XSw5OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcclxuLyoqXHJcbiAqIEJhbmQuanMgLSBNdXNpYyBDb21wb3NlclxyXG4gKiBBbiBpbnRlcmZhY2UgZm9yIHRoZSBXZWIgQXVkaW8gQVBJIHRoYXQgc3VwcG9ydHMgcmh5dGhtcywgbXVsdGlwbGUgaW5zdHJ1bWVudHMsIHJlcGVhdGluZyBzZWN0aW9ucywgYW5kIGNvbXBsZXhcclxuICogdGltZSBzaWduYXR1cmVzLlxyXG4gKlxyXG4gKiBAYXV0aG9yIENvZHkgTHVuZHF1aXN0IChodHRwOi8vZ2l0aHViLmNvbS9tZWVuaWUpIC0gMjAxNFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBOb3J0aCBBbWVyaWNhbiAoQ2FuYWRhIGFuZCBVU0EpIFJoeXRobSBQYWNrXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHdob2xlOiAxLFxyXG4gICAgZG90dGVkSGFsZjogMC43NSxcclxuICAgIGhhbGY6IDAuNSxcclxuICAgIGRvdHRlZFF1YXJ0ZXI6IDAuMzc1LFxyXG4gICAgdHJpcGxldEhhbGY6IDAuMzMzMzMzMzQsXHJcbiAgICBxdWFydGVyOiAwLjI1LFxyXG4gICAgZG90dGVkRWlnaHRoOiAwLjE4NzUsXHJcbiAgICB0cmlwbGV0UXVhcnRlcjogMC4xNjY2NjY2NjcsXHJcbiAgICBlaWdodGg6IDAuMTI1LFxyXG4gICAgZG90dGVkU2l4dGVlbnRoOiAwLjA5Mzc1LFxyXG4gICAgdHJpcGxldEVpZ2h0aDogMC4wODMzMzMzMzMsXHJcbiAgICBzaXh0ZWVudGg6IDAuMDYyNSxcclxuICAgIHRyaXBsZXRTaXh0ZWVudGg6IDAuMDQxNjY2NjY3LFxyXG4gICAgdGhpcnR5U2Vjb25kOiAwLjAzMTI1XHJcbn07XHJcblxyXG59LHt9XSwxMDpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XHJcbi8qKlxyXG4gKiBCYW5kLmpzIC0gTXVzaWMgQ29tcG9zZXJcclxuICogQW4gaW50ZXJmYWNlIGZvciB0aGUgV2ViIEF1ZGlvIEFQSSB0aGF0IHN1cHBvcnRzIHJoeXRobXMsIG11bHRpcGxlIGluc3RydW1lbnRzLCByZXBlYXRpbmcgc2VjdGlvbnMsIGFuZCBjb21wbGV4XHJcbiAqIHRpbWUgc2lnbmF0dXJlcy5cclxuICpcclxuICogQGF1dGhvciBDb2R5IEx1bmRxdWlzdCAoaHR0cDovL2dpdGh1Yi5jb20vbWVlbmllKSAtIDIwMTRcclxuICovXHJcblxyXG4vKipcclxuICogRXF1YWwgVGVtcGVyYW1lbnQgVHVuaW5nXHJcbiAqIFNvdXJjZTogaHR0cDovL3d3dy5waHkubXR1LmVkdS9+c3VpdHMvbm90ZWZyZXFzLmh0bWxcclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgJ0MwJzogMTYuMzUsXHJcbiAgICAnQyMwJzogMTcuMzIsXHJcbiAgICAnRGIwJzogMTcuMzIsXHJcbiAgICAnRDAnOiAxOC4zNSxcclxuICAgICdEIzAnOiAxOS40NSxcclxuICAgICdFYjAnOiAxOS40NSxcclxuICAgICdFMCc6IDIwLjYwLFxyXG4gICAgJ0YwJzogMjEuODMsXHJcbiAgICAnRiMwJzogMjMuMTIsXHJcbiAgICAnR2IwJzogMjMuMTIsXHJcbiAgICAnRzAnOiAyNC41MCxcclxuICAgICdHIzAnOiAyNS45NixcclxuICAgICdBYjAnOiAyNS45NixcclxuICAgICdBMCc6IDI3LjUwLFxyXG4gICAgJ0EjMCc6IDI5LjE0LFxyXG4gICAgJ0JiMCc6IDI5LjE0LFxyXG4gICAgJ0IwJzogMzAuODcsXHJcbiAgICAnQzEnOiAzMi43MCxcclxuICAgICdDIzEnOiAzNC42NSxcclxuICAgICdEYjEnOiAzNC42NSxcclxuICAgICdEMSc6IDM2LjcxLFxyXG4gICAgJ0QjMSc6IDM4Ljg5LFxyXG4gICAgJ0ViMSc6IDM4Ljg5LFxyXG4gICAgJ0UxJzogNDEuMjAsXHJcbiAgICAnRjEnOiA0My42NSxcclxuICAgICdGIzEnOiA0Ni4yNSxcclxuICAgICdHYjEnOiA0Ni4yNSxcclxuICAgICdHMSc6IDQ5LjAwLFxyXG4gICAgJ0cjMSc6IDUxLjkxLFxyXG4gICAgJ0FiMSc6IDUxLjkxLFxyXG4gICAgJ0ExJzogNTUuMDAsXHJcbiAgICAnQSMxJzogNTguMjcsXHJcbiAgICAnQmIxJzogNTguMjcsXHJcbiAgICAnQjEnOiA2MS43NCxcclxuICAgICdDMic6IDY1LjQxLFxyXG4gICAgJ0MjMic6IDY5LjMwLFxyXG4gICAgJ0RiMic6IDY5LjMwLFxyXG4gICAgJ0QyJzogNzMuNDIsXHJcbiAgICAnRCMyJzogNzcuNzgsXHJcbiAgICAnRWIyJzogNzcuNzgsXHJcbiAgICAnRTInOiA4Mi40MSxcclxuICAgICdGMic6IDg3LjMxLFxyXG4gICAgJ0YjMic6IDkyLjUwLFxyXG4gICAgJ0diMic6IDkyLjUwLFxyXG4gICAgJ0cyJzogOTguMDAsXHJcbiAgICAnRyMyJzogMTAzLjgzLFxyXG4gICAgJ0FiMic6IDEwMy44MyxcclxuICAgICdBMic6IDExMC4wMCxcclxuICAgICdBIzInOiAxMTYuNTQsXHJcbiAgICAnQmIyJzogMTE2LjU0LFxyXG4gICAgJ0IyJzogMTIzLjQ3LFxyXG4gICAgJ0MzJzogMTMwLjgxLFxyXG4gICAgJ0MjMyc6IDEzOC41OSxcclxuICAgICdEYjMnOiAxMzguNTksXHJcbiAgICAnRDMnOiAxNDYuODMsXHJcbiAgICAnRCMzJzogMTU1LjU2LFxyXG4gICAgJ0ViMyc6IDE1NS41NixcclxuICAgICdFMyc6IDE2NC44MSxcclxuICAgICdGMyc6IDE3NC42MSxcclxuICAgICdGIzMnOiAxODUuMDAsXHJcbiAgICAnR2IzJzogMTg1LjAwLFxyXG4gICAgJ0czJzogMTk2LjAwLFxyXG4gICAgJ0cjMyc6IDIwNy42NSxcclxuICAgICdBYjMnOiAyMDcuNjUsXHJcbiAgICAnQTMnOiAyMjAuMDAsXHJcbiAgICAnQSMzJzogMjMzLjA4LFxyXG4gICAgJ0JiMyc6IDIzMy4wOCxcclxuICAgICdCMyc6IDI0Ni45NCxcclxuICAgICdDNCc6IDI2MS42MyxcclxuICAgICdDIzQnOiAyNzcuMTgsXHJcbiAgICAnRGI0JzogMjc3LjE4LFxyXG4gICAgJ0Q0JzogMjkzLjY2LFxyXG4gICAgJ0QjNCc6IDMxMS4xMyxcclxuICAgICdFYjQnOiAzMTEuMTMsXHJcbiAgICAnRTQnOiAzMjkuNjMsXHJcbiAgICAnRjQnOiAzNDkuMjMsXHJcbiAgICAnRiM0JzogMzY5Ljk5LFxyXG4gICAgJ0diNCc6IDM2OS45OSxcclxuICAgICdHNCc6IDM5Mi4wMCxcclxuICAgICdHIzQnOiA0MTUuMzAsXHJcbiAgICAnQWI0JzogNDE1LjMwLFxyXG4gICAgJ0E0JzogNDQwLjAwLFxyXG4gICAgJ0EjNCc6IDQ2Ni4xNixcclxuICAgICdCYjQnOiA0NjYuMTYsXHJcbiAgICAnQjQnOiA0OTMuODgsXHJcbiAgICAnQzUnOiA1MjMuMjUsXHJcbiAgICAnQyM1JzogNTU0LjM3LFxyXG4gICAgJ0RiNSc6IDU1NC4zNyxcclxuICAgICdENSc6IDU4Ny4zMyxcclxuICAgICdEIzUnOiA2MjIuMjUsXHJcbiAgICAnRWI1JzogNjIyLjI1LFxyXG4gICAgJ0U1JzogNjU5LjI2LFxyXG4gICAgJ0Y1JzogNjk4LjQ2LFxyXG4gICAgJ0YjNSc6IDczOS45OSxcclxuICAgICdHYjUnOiA3MzkuOTksXHJcbiAgICAnRzUnOiA3ODMuOTksXHJcbiAgICAnRyM1JzogODMwLjYxLFxyXG4gICAgJ0FiNSc6IDgzMC42MSxcclxuICAgICdBNSc6IDg4MC4wMCxcclxuICAgICdBIzUnOiA5MzIuMzMsXHJcbiAgICAnQmI1JzogOTMyLjMzLFxyXG4gICAgJ0I1JzogOTg3Ljc3LFxyXG4gICAgJ0M2JzogMTA0Ni41MCxcclxuICAgICdDIzYnOiAxMTA4LjczLFxyXG4gICAgJ0RiNic6IDExMDguNzMsXHJcbiAgICAnRDYnOiAxMTc0LjY2LFxyXG4gICAgJ0QjNic6IDEyNDQuNTEsXHJcbiAgICAnRWI2JzogMTI0NC41MSxcclxuICAgICdFNic6IDEzMTguNTEsXHJcbiAgICAnRjYnOiAxMzk2LjkxLFxyXG4gICAgJ0YjNic6IDE0NzkuOTgsXHJcbiAgICAnR2I2JzogMTQ3OS45OCxcclxuICAgICdHNic6IDE1NjcuOTgsXHJcbiAgICAnRyM2JzogMTY2MS4yMixcclxuICAgICdBYjYnOiAxNjYxLjIyLFxyXG4gICAgJ0E2JzogMTc2MC4wMCxcclxuICAgICdBIzYnOiAxODY0LjY2LFxyXG4gICAgJ0JiNic6IDE4NjQuNjYsXHJcbiAgICAnQjYnOiAxOTc1LjUzLFxyXG4gICAgJ0M3JzogMjA5My4wMCxcclxuICAgICdDIzcnOiAyMjE3LjQ2LFxyXG4gICAgJ0RiNyc6IDIyMTcuNDYsXHJcbiAgICAnRDcnOiAyMzQ5LjMyLFxyXG4gICAgJ0QjNyc6IDI0ODkuMDIsXHJcbiAgICAnRWI3JzogMjQ4OS4wMixcclxuICAgICdFNyc6IDI2MzcuMDIsXHJcbiAgICAnRjcnOiAyNzkzLjgzLFxyXG4gICAgJ0YjNyc6IDI5NTkuOTYsXHJcbiAgICAnR2I3JzogMjk1OS45NixcclxuICAgICdHNyc6IDMxMzUuOTYsXHJcbiAgICAnRyM3JzogMzMyMi40NCxcclxuICAgICdBYjcnOiAzMzIyLjQ0LFxyXG4gICAgJ0E3JzogMzUyMC4wMCxcclxuICAgICdBIzcnOiAzNzI5LjMxLFxyXG4gICAgJ0JiNyc6IDM3MjkuMzEsXHJcbiAgICAnQjcnOiAzOTUxLjA3LFxyXG4gICAgJ0M4JzogNDE4Ni4wMVxyXG59O1xyXG5cclxufSx7fV19LHt9LFs2XSlcclxuKDYpXHJcbn0pOyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7XG4gIGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGxlbik7IGkgPCBsZW47IGkrKykge1xuICAgIGFycjJbaV0gPSBhcnJbaV07XG4gIH1cblxuICByZXR1cm4gYXJyMjtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBhcnI7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7XG4gIGlmIChzZWxmID09PSB2b2lkIDApIHtcbiAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7XG4gIH1cblxuICByZXR1cm4gc2VsZjtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufSIsImZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gIGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gIHJldHVybiBDb25zdHJ1Y3Rvcjtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmpba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2Yobykge1xuICBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2Yobykge1xuICAgIHJldHVybiBvLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7XG4gIH07XG4gIHJldHVybiBfZ2V0UHJvdG90eXBlT2Yobyk7XG59IiwiaW1wb3J0IHNldFByb3RvdHlwZU9mIGZyb20gXCIuL3NldFByb3RvdHlwZU9mXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTtcbiAgfVxuXG4gIHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogc3ViQ2xhc3MsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH1cbiAgfSk7XG4gIGlmIChzdXBlckNsYXNzKSBzZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkge1xuICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoYXJyKSkpIHJldHVybjtcbiAgdmFyIF9hcnIgPSBbXTtcbiAgdmFyIF9uID0gdHJ1ZTtcbiAgdmFyIF9kID0gZmFsc2U7XG4gIHZhciBfZSA9IHVuZGVmaW5lZDtcblxuICB0cnkge1xuICAgIGZvciAodmFyIF9pID0gYXJyW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3M7ICEoX24gPSAoX3MgPSBfaS5uZXh0KCkpLmRvbmUpOyBfbiA9IHRydWUpIHtcbiAgICAgIF9hcnIucHVzaChfcy52YWx1ZSk7XG5cbiAgICAgIGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhaztcbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIF9kID0gdHJ1ZTtcbiAgICBfZSA9IGVycjtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgaWYgKCFfbiAmJiBfaVtcInJldHVyblwiXSAhPSBudWxsKSBfaVtcInJldHVyblwiXSgpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoX2QpIHRocm93IF9lO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBfYXJyO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9ub25JdGVyYWJsZVJlc3QoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7XG59IiwiaW1wb3J0IF90eXBlb2YgZnJvbSBcIi4uLy4uL2hlbHBlcnMvZXNtL3R5cGVvZlwiO1xuaW1wb3J0IGFzc2VydFRoaXNJbml0aWFsaXplZCBmcm9tIFwiLi9hc3NlcnRUaGlzSW5pdGlhbGl6ZWRcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHtcbiAgaWYgKGNhbGwgJiYgKF90eXBlb2YoY2FsbCkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHtcbiAgICByZXR1cm4gY2FsbDtcbiAgfVxuXG4gIHJldHVybiBhc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHtcbiAgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7XG4gICAgby5fX3Byb3RvX18gPSBwO1xuICAgIHJldHVybiBvO1xuICB9O1xuXG4gIHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7XG59IiwiaW1wb3J0IGFycmF5V2l0aEhvbGVzIGZyb20gXCIuL2FycmF5V2l0aEhvbGVzXCI7XG5pbXBvcnQgaXRlcmFibGVUb0FycmF5TGltaXQgZnJvbSBcIi4vaXRlcmFibGVUb0FycmF5TGltaXRcIjtcbmltcG9ydCB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheSBmcm9tIFwiLi91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheVwiO1xuaW1wb3J0IG5vbkl0ZXJhYmxlUmVzdCBmcm9tIFwiLi9ub25JdGVyYWJsZVJlc3RcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9zbGljZWRUb0FycmF5KGFyciwgaSkge1xuICByZXR1cm4gYXJyYXlXaXRoSG9sZXMoYXJyKSB8fCBpdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHx8IHVuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KGFyciwgaSkgfHwgbm9uSXRlcmFibGVSZXN0KCk7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiO1xuXG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikge1xuICAgIF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmo7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gX3R5cGVvZihvYmopO1xufSIsImltcG9ydCBhcnJheUxpa2VUb0FycmF5IGZyb20gXCIuL2FycmF5TGlrZVRvQXJyYXlcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvLCBtaW5MZW4pIHtcbiAgaWYgKCFvKSByZXR1cm47XG4gIGlmICh0eXBlb2YgbyA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIGFycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbiAgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpO1xuICBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lO1xuICBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTtcbiAgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBhcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7XG59IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9heGlvcycpOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIHNldHRsZSA9IHJlcXVpcmUoJy4vLi4vY29yZS9zZXR0bGUnKTtcbnZhciBidWlsZFVSTCA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9idWlsZFVSTCcpO1xudmFyIGJ1aWxkRnVsbFBhdGggPSByZXF1aXJlKCcuLi9jb3JlL2J1aWxkRnVsbFBhdGgnKTtcbnZhciBwYXJzZUhlYWRlcnMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvcGFyc2VIZWFkZXJzJyk7XG52YXIgaXNVUkxTYW1lT3JpZ2luID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbicpO1xudmFyIGNyZWF0ZUVycm9yID0gcmVxdWlyZSgnLi4vY29yZS9jcmVhdGVFcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHhockFkYXB0ZXIoY29uZmlnKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiBkaXNwYXRjaFhoclJlcXVlc3QocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlcXVlc3REYXRhID0gY29uZmlnLmRhdGE7XG4gICAgdmFyIHJlcXVlc3RIZWFkZXJzID0gY29uZmlnLmhlYWRlcnM7XG5cbiAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShyZXF1ZXN0RGF0YSkpIHtcbiAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1snQ29udGVudC1UeXBlJ107IC8vIExldCB0aGUgYnJvd3NlciBzZXQgaXRcbiAgICB9XG5cbiAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgLy8gSFRUUCBiYXNpYyBhdXRoZW50aWNhdGlvblxuICAgIGlmIChjb25maWcuYXV0aCkge1xuICAgICAgdmFyIHVzZXJuYW1lID0gY29uZmlnLmF1dGgudXNlcm5hbWUgfHwgJyc7XG4gICAgICB2YXIgcGFzc3dvcmQgPSBjb25maWcuYXV0aC5wYXNzd29yZCB8fCAnJztcbiAgICAgIHJlcXVlc3RIZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmFzaWMgJyArIGJ0b2EodXNlcm5hbWUgKyAnOicgKyBwYXNzd29yZCk7XG4gICAgfVxuXG4gICAgdmFyIGZ1bGxQYXRoID0gYnVpbGRGdWxsUGF0aChjb25maWcuYmFzZVVSTCwgY29uZmlnLnVybCk7XG4gICAgcmVxdWVzdC5vcGVuKGNvbmZpZy5tZXRob2QudG9VcHBlckNhc2UoKSwgYnVpbGRVUkwoZnVsbFBhdGgsIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKSwgdHJ1ZSk7XG5cbiAgICAvLyBTZXQgdGhlIHJlcXVlc3QgdGltZW91dCBpbiBNU1xuICAgIHJlcXVlc3QudGltZW91dCA9IGNvbmZpZy50aW1lb3V0O1xuXG4gICAgLy8gTGlzdGVuIGZvciByZWFkeSBzdGF0ZVxuICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gaGFuZGxlTG9hZCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCB8fCByZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGUgcmVxdWVzdCBlcnJvcmVkIG91dCBhbmQgd2UgZGlkbid0IGdldCBhIHJlc3BvbnNlLCB0aGlzIHdpbGwgYmVcbiAgICAgIC8vIGhhbmRsZWQgYnkgb25lcnJvciBpbnN0ZWFkXG4gICAgICAvLyBXaXRoIG9uZSBleGNlcHRpb246IHJlcXVlc3QgdGhhdCB1c2luZyBmaWxlOiBwcm90b2NvbCwgbW9zdCBicm93c2Vyc1xuICAgICAgLy8gd2lsbCByZXR1cm4gc3RhdHVzIGFzIDAgZXZlbiB0aG91Z2ggaXQncyBhIHN1Y2Nlc3NmdWwgcmVxdWVzdFxuICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAwICYmICEocmVxdWVzdC5yZXNwb25zZVVSTCAmJiByZXF1ZXN0LnJlc3BvbnNlVVJMLmluZGV4T2YoJ2ZpbGU6JykgPT09IDApKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gUHJlcGFyZSB0aGUgcmVzcG9uc2VcbiAgICAgIHZhciByZXNwb25zZUhlYWRlcnMgPSAnZ2V0QWxsUmVzcG9uc2VIZWFkZXJzJyBpbiByZXF1ZXN0ID8gcGFyc2VIZWFkZXJzKHJlcXVlc3QuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpIDogbnVsbDtcbiAgICAgIHZhciByZXNwb25zZURhdGEgPSAhY29uZmlnLnJlc3BvbnNlVHlwZSB8fCBjb25maWcucmVzcG9uc2VUeXBlID09PSAndGV4dCcgPyByZXF1ZXN0LnJlc3BvbnNlVGV4dCA6IHJlcXVlc3QucmVzcG9uc2U7XG4gICAgICB2YXIgcmVzcG9uc2UgPSB7XG4gICAgICAgIGRhdGE6IHJlc3BvbnNlRGF0YSxcbiAgICAgICAgc3RhdHVzOiByZXF1ZXN0LnN0YXR1cyxcbiAgICAgICAgc3RhdHVzVGV4dDogcmVxdWVzdC5zdGF0dXNUZXh0LFxuICAgICAgICBoZWFkZXJzOiByZXNwb25zZUhlYWRlcnMsXG4gICAgICAgIGNvbmZpZzogY29uZmlnLFxuICAgICAgICByZXF1ZXN0OiByZXF1ZXN0XG4gICAgICB9O1xuXG4gICAgICBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgYnJvd3NlciByZXF1ZXN0IGNhbmNlbGxhdGlvbiAoYXMgb3Bwb3NlZCB0byBhIG1hbnVhbCBjYW5jZWxsYXRpb24pXG4gICAgcmVxdWVzdC5vbmFib3J0ID0gZnVuY3Rpb24gaGFuZGxlQWJvcnQoKSB7XG4gICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ1JlcXVlc3QgYWJvcnRlZCcsIGNvbmZpZywgJ0VDT05OQUJPUlRFRCcsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSBsb3cgbGV2ZWwgbmV0d29yayBlcnJvcnNcbiAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiBoYW5kbGVFcnJvcigpIHtcbiAgICAgIC8vIFJlYWwgZXJyb3JzIGFyZSBoaWRkZW4gZnJvbSB1cyBieSB0aGUgYnJvd3NlclxuICAgICAgLy8gb25lcnJvciBzaG91bGQgb25seSBmaXJlIGlmIGl0J3MgYSBuZXR3b3JrIGVycm9yXG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ05ldHdvcmsgRXJyb3InLCBjb25maWcsIG51bGwsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSB0aW1lb3V0XG4gICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge1xuICAgICAgdmFyIHRpbWVvdXRFcnJvck1lc3NhZ2UgPSAndGltZW91dCBvZiAnICsgY29uZmlnLnRpbWVvdXQgKyAnbXMgZXhjZWVkZWQnO1xuICAgICAgaWYgKGNvbmZpZy50aW1lb3V0RXJyb3JNZXNzYWdlKSB7XG4gICAgICAgIHRpbWVvdXRFcnJvck1lc3NhZ2UgPSBjb25maWcudGltZW91dEVycm9yTWVzc2FnZTtcbiAgICAgIH1cbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcih0aW1lb3V0RXJyb3JNZXNzYWdlLCBjb25maWcsICdFQ09OTkFCT1JURUQnLFxuICAgICAgICByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAvLyBUaGlzIGlzIG9ubHkgZG9uZSBpZiBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudC5cbiAgICAvLyBTcGVjaWZpY2FsbHkgbm90IGlmIHdlJ3JlIGluIGEgd2ViIHdvcmtlciwgb3IgcmVhY3QtbmF0aXZlLlxuICAgIGlmICh1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpKSB7XG4gICAgICB2YXIgY29va2llcyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9jb29raWVzJyk7XG5cbiAgICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgICAgdmFyIHhzcmZWYWx1ZSA9IChjb25maWcud2l0aENyZWRlbnRpYWxzIHx8IGlzVVJMU2FtZU9yaWdpbihmdWxsUGF0aCkpICYmIGNvbmZpZy54c3JmQ29va2llTmFtZSA/XG4gICAgICAgIGNvb2tpZXMucmVhZChjb25maWcueHNyZkNvb2tpZU5hbWUpIDpcbiAgICAgICAgdW5kZWZpbmVkO1xuXG4gICAgICBpZiAoeHNyZlZhbHVlKSB7XG4gICAgICAgIHJlcXVlc3RIZWFkZXJzW2NvbmZpZy54c3JmSGVhZGVyTmFtZV0gPSB4c3JmVmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWRkIGhlYWRlcnMgdG8gdGhlIHJlcXVlc3RcbiAgICBpZiAoJ3NldFJlcXVlc3RIZWFkZXInIGluIHJlcXVlc3QpIHtcbiAgICAgIHV0aWxzLmZvckVhY2gocmVxdWVzdEhlYWRlcnMsIGZ1bmN0aW9uIHNldFJlcXVlc3RIZWFkZXIodmFsLCBrZXkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0RGF0YSA9PT0gJ3VuZGVmaW5lZCcgJiYga2V5LnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW50LXR5cGUnKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIENvbnRlbnQtVHlwZSBpZiBkYXRhIGlzIHVuZGVmaW5lZFxuICAgICAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1trZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIE90aGVyd2lzZSBhZGQgaGVhZGVyIHRvIHRoZSByZXF1ZXN0XG4gICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgdmFsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHdpdGhDcmVkZW50aWFscyB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnLndpdGhDcmVkZW50aWFscykpIHtcbiAgICAgIHJlcXVlc3Qud2l0aENyZWRlbnRpYWxzID0gISFjb25maWcud2l0aENyZWRlbnRpYWxzO1xuICAgIH1cblxuICAgIC8vIEFkZCByZXNwb25zZVR5cGUgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAoY29uZmlnLnJlc3BvbnNlVHlwZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSBjb25maWcucmVzcG9uc2VUeXBlO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBFeHBlY3RlZCBET01FeGNlcHRpb24gdGhyb3duIGJ5IGJyb3dzZXJzIG5vdCBjb21wYXRpYmxlIFhNTEh0dHBSZXF1ZXN0IExldmVsIDIuXG4gICAgICAgIC8vIEJ1dCwgdGhpcyBjYW4gYmUgc3VwcHJlc3NlZCBmb3IgJ2pzb24nIHR5cGUgYXMgaXQgY2FuIGJlIHBhcnNlZCBieSBkZWZhdWx0ICd0cmFuc2Zvcm1SZXNwb25zZScgZnVuY3Rpb24uXG4gICAgICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlICE9PSAnanNvbicpIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHByb2dyZXNzIGlmIG5lZWRlZFxuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIC8vIE5vdCBhbGwgYnJvd3NlcnMgc3VwcG9ydCB1cGxvYWQgZXZlbnRzXG4gICAgaWYgKHR5cGVvZiBjb25maWcub25VcGxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJyAmJiByZXF1ZXN0LnVwbG9hZCkge1xuICAgICAgcmVxdWVzdC51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25VcGxvYWRQcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgICAgLy8gSGFuZGxlIGNhbmNlbGxhdGlvblxuICAgICAgY29uZmlnLmNhbmNlbFRva2VuLnByb21pc2UudGhlbihmdW5jdGlvbiBvbkNhbmNlbGVkKGNhbmNlbCkge1xuICAgICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXF1ZXN0LmFib3J0KCk7XG4gICAgICAgIHJlamVjdChjYW5jZWwpO1xuICAgICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHJlcXVlc3REYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlcXVlc3REYXRhID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBTZW5kIHRoZSByZXF1ZXN0XG4gICAgcmVxdWVzdC5zZW5kKHJlcXVlc3REYXRhKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG52YXIgQXhpb3MgPSByZXF1aXJlKCcuL2NvcmUvQXhpb3MnKTtcbnZhciBtZXJnZUNvbmZpZyA9IHJlcXVpcmUoJy4vY29yZS9tZXJnZUNvbmZpZycpO1xudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi9kZWZhdWx0cycpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0Q29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG4gKiBAcmV0dXJuIHtBeGlvc30gQSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqL1xuZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdENvbmZpZykge1xuICB2YXIgY29udGV4dCA9IG5ldyBBeGlvcyhkZWZhdWx0Q29uZmlnKTtcbiAgdmFyIGluc3RhbmNlID0gYmluZChBeGlvcy5wcm90b3R5cGUucmVxdWVzdCwgY29udGV4dCk7XG5cbiAgLy8gQ29weSBheGlvcy5wcm90b3R5cGUgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBBeGlvcy5wcm90b3R5cGUsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgY29udGV4dCB0byBpbnN0YW5jZVxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIGNvbnRleHQpO1xuXG4gIHJldHVybiBpbnN0YW5jZTtcbn1cblxuLy8gQ3JlYXRlIHRoZSBkZWZhdWx0IGluc3RhbmNlIHRvIGJlIGV4cG9ydGVkXG52YXIgYXhpb3MgPSBjcmVhdGVJbnN0YW5jZShkZWZhdWx0cyk7XG5cbi8vIEV4cG9zZSBBeGlvcyBjbGFzcyB0byBhbGxvdyBjbGFzcyBpbmhlcml0YW5jZVxuYXhpb3MuQXhpb3MgPSBBeGlvcztcblxuLy8gRmFjdG9yeSBmb3IgY3JlYXRpbmcgbmV3IGluc3RhbmNlc1xuYXhpb3MuY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKGluc3RhbmNlQ29uZmlnKSB7XG4gIHJldHVybiBjcmVhdGVJbnN0YW5jZShtZXJnZUNvbmZpZyhheGlvcy5kZWZhdWx0cywgaW5zdGFuY2VDb25maWcpKTtcbn07XG5cbi8vIEV4cG9zZSBDYW5jZWwgJiBDYW5jZWxUb2tlblxuYXhpb3MuQ2FuY2VsID0gcmVxdWlyZSgnLi9jYW5jZWwvQ2FuY2VsJyk7XG5heGlvcy5DYW5jZWxUb2tlbiA9IHJlcXVpcmUoJy4vY2FuY2VsL0NhbmNlbFRva2VuJyk7XG5heGlvcy5pc0NhbmNlbCA9IHJlcXVpcmUoJy4vY2FuY2VsL2lzQ2FuY2VsJyk7XG5cbi8vIEV4cG9zZSBhbGwvc3ByZWFkXG5heGlvcy5hbGwgPSBmdW5jdGlvbiBhbGwocHJvbWlzZXMpIHtcbiAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbn07XG5heGlvcy5zcHJlYWQgPSByZXF1aXJlKCcuL2hlbHBlcnMvc3ByZWFkJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gYXhpb3M7XG5cbi8vIEFsbG93IHVzZSBvZiBkZWZhdWx0IGltcG9ydCBzeW50YXggaW4gVHlwZVNjcmlwdFxubW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IGF4aW9zO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEEgYENhbmNlbGAgaXMgYW4gb2JqZWN0IHRoYXQgaXMgdGhyb3duIHdoZW4gYW4gb3BlcmF0aW9uIGlzIGNhbmNlbGVkLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtzdHJpbmc9fSBtZXNzYWdlIFRoZSBtZXNzYWdlLlxuICovXG5mdW5jdGlvbiBDYW5jZWwobWVzc2FnZSkge1xuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xufVxuXG5DYW5jZWwucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiAnQ2FuY2VsJyArICh0aGlzLm1lc3NhZ2UgPyAnOiAnICsgdGhpcy5tZXNzYWdlIDogJycpO1xufTtcblxuQ2FuY2VsLnByb3RvdHlwZS5fX0NBTkNFTF9fID0gdHJ1ZTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWw7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBDYW5jZWwgPSByZXF1aXJlKCcuL0NhbmNlbCcpO1xuXG4vKipcbiAqIEEgYENhbmNlbFRva2VuYCBpcyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byByZXF1ZXN0IGNhbmNlbGxhdGlvbiBvZiBhbiBvcGVyYXRpb24uXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBleGVjdXRvciBUaGUgZXhlY3V0b3IgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIENhbmNlbFRva2VuKGV4ZWN1dG9yKSB7XG4gIGlmICh0eXBlb2YgZXhlY3V0b3IgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdleGVjdXRvciBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XG4gIH1cblxuICB2YXIgcmVzb2x2ZVByb21pc2U7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIHByb21pc2VFeGVjdXRvcihyZXNvbHZlKSB7XG4gICAgcmVzb2x2ZVByb21pc2UgPSByZXNvbHZlO1xuICB9KTtcblxuICB2YXIgdG9rZW4gPSB0aGlzO1xuICBleGVjdXRvcihmdW5jdGlvbiBjYW5jZWwobWVzc2FnZSkge1xuICAgIGlmICh0b2tlbi5yZWFzb24pIHtcbiAgICAgIC8vIENhbmNlbGxhdGlvbiBoYXMgYWxyZWFkeSBiZWVuIHJlcXVlc3RlZFxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRva2VuLnJlYXNvbiA9IG5ldyBDYW5jZWwobWVzc2FnZSk7XG4gICAgcmVzb2x2ZVByb21pc2UodG9rZW4ucmVhc29uKTtcbiAgfSk7XG59XG5cbi8qKlxuICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqL1xuQ2FuY2VsVG9rZW4ucHJvdG90eXBlLnRocm93SWZSZXF1ZXN0ZWQgPSBmdW5jdGlvbiB0aHJvd0lmUmVxdWVzdGVkKCkge1xuICBpZiAodGhpcy5yZWFzb24pIHtcbiAgICB0aHJvdyB0aGlzLnJlYXNvbjtcbiAgfVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGEgbmV3IGBDYW5jZWxUb2tlbmAgYW5kIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBjYWxsZWQsXG4gKiBjYW5jZWxzIHRoZSBgQ2FuY2VsVG9rZW5gLlxuICovXG5DYW5jZWxUb2tlbi5zb3VyY2UgPSBmdW5jdGlvbiBzb3VyY2UoKSB7XG4gIHZhciBjYW5jZWw7XG4gIHZhciB0b2tlbiA9IG5ldyBDYW5jZWxUb2tlbihmdW5jdGlvbiBleGVjdXRvcihjKSB7XG4gICAgY2FuY2VsID0gYztcbiAgfSk7XG4gIHJldHVybiB7XG4gICAgdG9rZW46IHRva2VuLFxuICAgIGNhbmNlbDogY2FuY2VsXG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhbmNlbFRva2VuO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQ2FuY2VsKHZhbHVlKSB7XG4gIHJldHVybiAhISh2YWx1ZSAmJiB2YWx1ZS5fX0NBTkNFTF9fKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciBidWlsZFVSTCA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvYnVpbGRVUkwnKTtcbnZhciBJbnRlcmNlcHRvck1hbmFnZXIgPSByZXF1aXJlKCcuL0ludGVyY2VwdG9yTWFuYWdlcicpO1xudmFyIGRpc3BhdGNoUmVxdWVzdCA9IHJlcXVpcmUoJy4vZGlzcGF0Y2hSZXF1ZXN0Jyk7XG52YXIgbWVyZ2VDb25maWcgPSByZXF1aXJlKCcuL21lcmdlQ29uZmlnJyk7XG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlQ29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG4gKi9cbmZ1bmN0aW9uIEF4aW9zKGluc3RhbmNlQ29uZmlnKSB7XG4gIHRoaXMuZGVmYXVsdHMgPSBpbnN0YW5jZUNvbmZpZztcbiAgdGhpcy5pbnRlcmNlcHRvcnMgPSB7XG4gICAgcmVxdWVzdDogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpLFxuICAgIHJlc3BvbnNlOiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKClcbiAgfTtcbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBhIHJlcXVlc3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcgc3BlY2lmaWMgZm9yIHRoaXMgcmVxdWVzdCAobWVyZ2VkIHdpdGggdGhpcy5kZWZhdWx0cylcbiAqL1xuQXhpb3MucHJvdG90eXBlLnJlcXVlc3QgPSBmdW5jdGlvbiByZXF1ZXN0KGNvbmZpZykge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgLy8gQWxsb3cgZm9yIGF4aW9zKCdleGFtcGxlL3VybCdbLCBjb25maWddKSBhIGxhIGZldGNoIEFQSVxuICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ3N0cmluZycpIHtcbiAgICBjb25maWcgPSBhcmd1bWVudHNbMV0gfHwge307XG4gICAgY29uZmlnLnVybCA9IGFyZ3VtZW50c1swXTtcbiAgfSBlbHNlIHtcbiAgICBjb25maWcgPSBjb25maWcgfHwge307XG4gIH1cblxuICBjb25maWcgPSBtZXJnZUNvbmZpZyh0aGlzLmRlZmF1bHRzLCBjb25maWcpO1xuXG4gIC8vIFNldCBjb25maWcubWV0aG9kXG4gIGlmIChjb25maWcubWV0aG9kKSB7XG4gICAgY29uZmlnLm1ldGhvZCA9IGNvbmZpZy5tZXRob2QudG9Mb3dlckNhc2UoKTtcbiAgfSBlbHNlIGlmICh0aGlzLmRlZmF1bHRzLm1ldGhvZCkge1xuICAgIGNvbmZpZy5tZXRob2QgPSB0aGlzLmRlZmF1bHRzLm1ldGhvZC50b0xvd2VyQ2FzZSgpO1xuICB9IGVsc2Uge1xuICAgIGNvbmZpZy5tZXRob2QgPSAnZ2V0JztcbiAgfVxuXG4gIC8vIEhvb2sgdXAgaW50ZXJjZXB0b3JzIG1pZGRsZXdhcmVcbiAgdmFyIGNoYWluID0gW2Rpc3BhdGNoUmVxdWVzdCwgdW5kZWZpbmVkXTtcbiAgdmFyIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoY29uZmlnKTtcblxuICB0aGlzLmludGVyY2VwdG9ycy5yZXF1ZXN0LmZvckVhY2goZnVuY3Rpb24gdW5zaGlmdFJlcXVlc3RJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICBjaGFpbi51bnNoaWZ0KGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICB9KTtcblxuICB0aGlzLmludGVyY2VwdG9ycy5yZXNwb25zZS5mb3JFYWNoKGZ1bmN0aW9uIHB1c2hSZXNwb25zZUludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgIGNoYWluLnB1c2goaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gIH0pO1xuXG4gIHdoaWxlIChjaGFpbi5sZW5ndGgpIHtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKGNoYWluLnNoaWZ0KCksIGNoYWluLnNoaWZ0KCkpO1xuICB9XG5cbiAgcmV0dXJuIHByb21pc2U7XG59O1xuXG5BeGlvcy5wcm90b3R5cGUuZ2V0VXJpID0gZnVuY3Rpb24gZ2V0VXJpKGNvbmZpZykge1xuICBjb25maWcgPSBtZXJnZUNvbmZpZyh0aGlzLmRlZmF1bHRzLCBjb25maWcpO1xuICByZXR1cm4gYnVpbGRVUkwoY29uZmlnLnVybCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpLnJlcGxhY2UoL15cXD8vLCAnJyk7XG59O1xuXG4vLyBQcm92aWRlIGFsaWFzZXMgZm9yIHN1cHBvcnRlZCByZXF1ZXN0IG1ldGhvZHNcbnV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAnb3B0aW9ucyddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgY29uZmlnKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdCh1dGlscy5tZXJnZShjb25maWcgfHwge30sIHtcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgdXJsOiB1cmxcbiAgICB9KSk7XG4gIH07XG59KTtcblxudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGRhdGEsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QodXRpbHMubWVyZ2UoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0pKTtcbiAgfTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF4aW9zO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIEludGVyY2VwdG9yTWFuYWdlcigpIHtcbiAgdGhpcy5oYW5kbGVycyA9IFtdO1xufVxuXG4vKipcbiAqIEFkZCBhIG5ldyBpbnRlcmNlcHRvciB0byB0aGUgc3RhY2tcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdWxmaWxsZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgdGhlbmAgZm9yIGEgYFByb21pc2VgXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3RlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGByZWplY3RgIGZvciBhIGBQcm9taXNlYFxuICpcbiAqIEByZXR1cm4ge051bWJlcn0gQW4gSUQgdXNlZCB0byByZW1vdmUgaW50ZXJjZXB0b3IgbGF0ZXJcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiB1c2UoZnVsZmlsbGVkLCByZWplY3RlZCkge1xuICB0aGlzLmhhbmRsZXJzLnB1c2goe1xuICAgIGZ1bGZpbGxlZDogZnVsZmlsbGVkLFxuICAgIHJlamVjdGVkOiByZWplY3RlZFxuICB9KTtcbiAgcmV0dXJuIHRoaXMuaGFuZGxlcnMubGVuZ3RoIC0gMTtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGFuIGludGVyY2VwdG9yIGZyb20gdGhlIHN0YWNrXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGlkIFRoZSBJRCB0aGF0IHdhcyByZXR1cm5lZCBieSBgdXNlYFxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmVqZWN0ID0gZnVuY3Rpb24gZWplY3QoaWQpIHtcbiAgaWYgKHRoaXMuaGFuZGxlcnNbaWRdKSB7XG4gICAgdGhpcy5oYW5kbGVyc1tpZF0gPSBudWxsO1xuICB9XG59O1xuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbGwgdGhlIHJlZ2lzdGVyZWQgaW50ZXJjZXB0b3JzXG4gKlxuICogVGhpcyBtZXRob2QgaXMgcGFydGljdWxhcmx5IHVzZWZ1bCBmb3Igc2tpcHBpbmcgb3ZlciBhbnlcbiAqIGludGVyY2VwdG9ycyB0aGF0IG1heSBoYXZlIGJlY29tZSBgbnVsbGAgY2FsbGluZyBgZWplY3RgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIGludGVyY2VwdG9yXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2goZm4pIHtcbiAgdXRpbHMuZm9yRWFjaCh0aGlzLmhhbmRsZXJzLCBmdW5jdGlvbiBmb3JFYWNoSGFuZGxlcihoKSB7XG4gICAgaWYgKGggIT09IG51bGwpIHtcbiAgICAgIGZuKGgpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyY2VwdG9yTWFuYWdlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzQWJzb2x1dGVVUkwgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwnKTtcbnZhciBjb21iaW5lVVJMcyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvY29tYmluZVVSTHMnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIGJhc2VVUkwgd2l0aCB0aGUgcmVxdWVzdGVkVVJMLFxuICogb25seSB3aGVuIHRoZSByZXF1ZXN0ZWRVUkwgaXMgbm90IGFscmVhZHkgYW4gYWJzb2x1dGUgVVJMLlxuICogSWYgdGhlIHJlcXVlc3RVUkwgaXMgYWJzb2x1dGUsIHRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgcmVxdWVzdGVkVVJMIHVudG91Y2hlZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZXF1ZXN0ZWRVUkwgQWJzb2x1dGUgb3IgcmVsYXRpdmUgVVJMIHRvIGNvbWJpbmVcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb21iaW5lZCBmdWxsIHBhdGhcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWlsZEZ1bGxQYXRoKGJhc2VVUkwsIHJlcXVlc3RlZFVSTCkge1xuICBpZiAoYmFzZVVSTCAmJiAhaXNBYnNvbHV0ZVVSTChyZXF1ZXN0ZWRVUkwpKSB7XG4gICAgcmV0dXJuIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlcXVlc3RlZFVSTCk7XG4gIH1cbiAgcmV0dXJuIHJlcXVlc3RlZFVSTDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbmhhbmNlRXJyb3IgPSByZXF1aXJlKCcuL2VuaGFuY2VFcnJvcicpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgbWVzc2FnZSwgY29uZmlnLCBlcnJvciBjb2RlLCByZXF1ZXN0IGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBUaGUgZXJyb3IgbWVzc2FnZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgY3JlYXRlZCBlcnJvci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVFcnJvcihtZXNzYWdlLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIHZhciBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgcmV0dXJuIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgdHJhbnNmb3JtRGF0YSA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtRGF0YScpO1xudmFyIGlzQ2FuY2VsID0gcmVxdWlyZSgnLi4vY2FuY2VsL2lzQ2FuY2VsJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLi9kZWZhdWx0cycpO1xuXG4vKipcbiAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gKi9cbmZ1bmN0aW9uIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKSB7XG4gIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICBjb25maWcuY2FuY2VsVG9rZW4udGhyb3dJZlJlcXVlc3RlZCgpO1xuICB9XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdXNpbmcgdGhlIGNvbmZpZ3VyZWQgYWRhcHRlci5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gY29uZmlnIFRoZSBjb25maWcgdGhhdCBpcyB0byBiZSB1c2VkIGZvciB0aGUgcmVxdWVzdFxuICogQHJldHVybnMge1Byb21pc2V9IFRoZSBQcm9taXNlIHRvIGJlIGZ1bGZpbGxlZFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRpc3BhdGNoUmVxdWVzdChjb25maWcpIHtcbiAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gIC8vIEVuc3VyZSBoZWFkZXJzIGV4aXN0XG4gIGNvbmZpZy5oZWFkZXJzID0gY29uZmlnLmhlYWRlcnMgfHwge307XG5cbiAgLy8gVHJhbnNmb3JtIHJlcXVlc3QgZGF0YVxuICBjb25maWcuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG4gICAgY29uZmlnLmRhdGEsXG4gICAgY29uZmlnLmhlYWRlcnMsXG4gICAgY29uZmlnLnRyYW5zZm9ybVJlcXVlc3RcbiAgKTtcblxuICAvLyBGbGF0dGVuIGhlYWRlcnNcbiAgY29uZmlnLmhlYWRlcnMgPSB1dGlscy5tZXJnZShcbiAgICBjb25maWcuaGVhZGVycy5jb21tb24gfHwge30sXG4gICAgY29uZmlnLmhlYWRlcnNbY29uZmlnLm1ldGhvZF0gfHwge30sXG4gICAgY29uZmlnLmhlYWRlcnNcbiAgKTtcblxuICB1dGlscy5mb3JFYWNoKFxuICAgIFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2NvbW1vbiddLFxuICAgIGZ1bmN0aW9uIGNsZWFuSGVhZGVyQ29uZmlnKG1ldGhvZCkge1xuICAgICAgZGVsZXRlIGNvbmZpZy5oZWFkZXJzW21ldGhvZF07XG4gICAgfVxuICApO1xuXG4gIHZhciBhZGFwdGVyID0gY29uZmlnLmFkYXB0ZXIgfHwgZGVmYXVsdHMuYWRhcHRlcjtcblxuICByZXR1cm4gYWRhcHRlcihjb25maWcpLnRoZW4oZnVuY3Rpb24gb25BZGFwdGVyUmVzb2x1dGlvbihyZXNwb25zZSkge1xuICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgcmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG4gICAgICByZXNwb25zZS5kYXRhLFxuICAgICAgcmVzcG9uc2UuaGVhZGVycyxcbiAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuICAgICk7XG5cbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH0sIGZ1bmN0aW9uIG9uQWRhcHRlclJlamVjdGlvbihyZWFzb24pIHtcbiAgICBpZiAoIWlzQ2FuY2VsKHJlYXNvbikpIHtcbiAgICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAgICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICAgIGlmIChyZWFzb24gJiYgcmVhc29uLnJlc3BvbnNlKSB7XG4gICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSxcbiAgICAgICAgICByZWFzb24ucmVzcG9uc2UuaGVhZGVycyxcbiAgICAgICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2VcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVhc29uKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFVwZGF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgY29uZmlnLCBlcnJvciBjb2RlLCBhbmQgcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyb3IgVGhlIGVycm9yIHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgZXJyb3IuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZW5oYW5jZUVycm9yKGVycm9yLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIGVycm9yLmNvbmZpZyA9IGNvbmZpZztcbiAgaWYgKGNvZGUpIHtcbiAgICBlcnJvci5jb2RlID0gY29kZTtcbiAgfVxuXG4gIGVycm9yLnJlcXVlc3QgPSByZXF1ZXN0O1xuICBlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICBlcnJvci5pc0F4aW9zRXJyb3IgPSB0cnVlO1xuXG4gIGVycm9yLnRvSlNPTiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICAvLyBTdGFuZGFyZFxuICAgICAgbWVzc2FnZTogdGhpcy5tZXNzYWdlLFxuICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgLy8gTWljcm9zb2Z0XG4gICAgICBkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgIG51bWJlcjogdGhpcy5udW1iZXIsXG4gICAgICAvLyBNb3ppbGxhXG4gICAgICBmaWxlTmFtZTogdGhpcy5maWxlTmFtZSxcbiAgICAgIGxpbmVOdW1iZXI6IHRoaXMubGluZU51bWJlcixcbiAgICAgIGNvbHVtbk51bWJlcjogdGhpcy5jb2x1bW5OdW1iZXIsXG4gICAgICBzdGFjazogdGhpcy5zdGFjayxcbiAgICAgIC8vIEF4aW9zXG4gICAgICBjb25maWc6IHRoaXMuY29uZmlnLFxuICAgICAgY29kZTogdGhpcy5jb2RlXG4gICAgfTtcbiAgfTtcbiAgcmV0dXJuIGVycm9yO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxuLyoqXG4gKiBDb25maWctc3BlY2lmaWMgbWVyZ2UtZnVuY3Rpb24gd2hpY2ggY3JlYXRlcyBhIG5ldyBjb25maWctb2JqZWN0XG4gKiBieSBtZXJnaW5nIHR3byBjb25maWd1cmF0aW9uIG9iamVjdHMgdG9nZXRoZXIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZzFcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBOZXcgb2JqZWN0IHJlc3VsdGluZyBmcm9tIG1lcmdpbmcgY29uZmlnMiB0byBjb25maWcxXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWVyZ2VDb25maWcoY29uZmlnMSwgY29uZmlnMikge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgY29uZmlnMiA9IGNvbmZpZzIgfHwge307XG4gIHZhciBjb25maWcgPSB7fTtcblxuICB2YXIgdmFsdWVGcm9tQ29uZmlnMktleXMgPSBbJ3VybCcsICdtZXRob2QnLCAncGFyYW1zJywgJ2RhdGEnXTtcbiAgdmFyIG1lcmdlRGVlcFByb3BlcnRpZXNLZXlzID0gWydoZWFkZXJzJywgJ2F1dGgnLCAncHJveHknXTtcbiAgdmFyIGRlZmF1bHRUb0NvbmZpZzJLZXlzID0gW1xuICAgICdiYXNlVVJMJywgJ3VybCcsICd0cmFuc2Zvcm1SZXF1ZXN0JywgJ3RyYW5zZm9ybVJlc3BvbnNlJywgJ3BhcmFtc1NlcmlhbGl6ZXInLFxuICAgICd0aW1lb3V0JywgJ3dpdGhDcmVkZW50aWFscycsICdhZGFwdGVyJywgJ3Jlc3BvbnNlVHlwZScsICd4c3JmQ29va2llTmFtZScsXG4gICAgJ3hzcmZIZWFkZXJOYW1lJywgJ29uVXBsb2FkUHJvZ3Jlc3MnLCAnb25Eb3dubG9hZFByb2dyZXNzJyxcbiAgICAnbWF4Q29udGVudExlbmd0aCcsICd2YWxpZGF0ZVN0YXR1cycsICdtYXhSZWRpcmVjdHMnLCAnaHR0cEFnZW50JyxcbiAgICAnaHR0cHNBZ2VudCcsICdjYW5jZWxUb2tlbicsICdzb2NrZXRQYXRoJ1xuICBdO1xuXG4gIHV0aWxzLmZvckVhY2godmFsdWVGcm9tQ29uZmlnMktleXMsIGZ1bmN0aW9uIHZhbHVlRnJvbUNvbmZpZzIocHJvcCkge1xuICAgIGlmICh0eXBlb2YgY29uZmlnMltwcm9wXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGNvbmZpZzJbcHJvcF07XG4gICAgfVxuICB9KTtcblxuICB1dGlscy5mb3JFYWNoKG1lcmdlRGVlcFByb3BlcnRpZXNLZXlzLCBmdW5jdGlvbiBtZXJnZURlZXBQcm9wZXJ0aWVzKHByb3ApIHtcbiAgICBpZiAodXRpbHMuaXNPYmplY3QoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IHV0aWxzLmRlZXBNZXJnZShjb25maWcxW3Byb3BdLCBjb25maWcyW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb25maWcyW3Byb3BdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uZmlnW3Byb3BdID0gY29uZmlnMltwcm9wXTtcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzT2JqZWN0KGNvbmZpZzFbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSB1dGlscy5kZWVwTWVyZ2UoY29uZmlnMVtwcm9wXSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgY29uZmlnMVtwcm9wXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGNvbmZpZzFbcHJvcF07XG4gICAgfVxuICB9KTtcblxuICB1dGlscy5mb3JFYWNoKGRlZmF1bHRUb0NvbmZpZzJLZXlzLCBmdW5jdGlvbiBkZWZhdWx0VG9Db25maWcyKHByb3ApIHtcbiAgICBpZiAodHlwZW9mIGNvbmZpZzJbcHJvcF0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBjb25maWcyW3Byb3BdO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbmZpZzFbcHJvcF0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBjb25maWcxW3Byb3BdO1xuICAgIH1cbiAgfSk7XG5cbiAgdmFyIGF4aW9zS2V5cyA9IHZhbHVlRnJvbUNvbmZpZzJLZXlzXG4gICAgLmNvbmNhdChtZXJnZURlZXBQcm9wZXJ0aWVzS2V5cylcbiAgICAuY29uY2F0KGRlZmF1bHRUb0NvbmZpZzJLZXlzKTtcblxuICB2YXIgb3RoZXJLZXlzID0gT2JqZWN0XG4gICAgLmtleXMoY29uZmlnMilcbiAgICAuZmlsdGVyKGZ1bmN0aW9uIGZpbHRlckF4aW9zS2V5cyhrZXkpIHtcbiAgICAgIHJldHVybiBheGlvc0tleXMuaW5kZXhPZihrZXkpID09PSAtMTtcbiAgICB9KTtcblxuICB1dGlscy5mb3JFYWNoKG90aGVyS2V5cywgZnVuY3Rpb24gb3RoZXJLZXlzRGVmYXVsdFRvQ29uZmlnMihwcm9wKSB7XG4gICAgaWYgKHR5cGVvZiBjb25maWcyW3Byb3BdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uZmlnW3Byb3BdID0gY29uZmlnMltwcm9wXTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb25maWcxW3Byb3BdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uZmlnW3Byb3BdID0gY29uZmlnMVtwcm9wXTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBjb25maWc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuL2NyZWF0ZUVycm9yJyk7XG5cbi8qKlxuICogUmVzb2x2ZSBvciByZWplY3QgYSBQcm9taXNlIGJhc2VkIG9uIHJlc3BvbnNlIHN0YXR1cy5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNvbHZlIEEgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdCBBIGZ1bmN0aW9uIHRoYXQgcmVqZWN0cyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7b2JqZWN0fSByZXNwb25zZSBUaGUgcmVzcG9uc2UuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpIHtcbiAgdmFyIHZhbGlkYXRlU3RhdHVzID0gcmVzcG9uc2UuY29uZmlnLnZhbGlkYXRlU3RhdHVzO1xuICBpZiAoIXZhbGlkYXRlU3RhdHVzIHx8IHZhbGlkYXRlU3RhdHVzKHJlc3BvbnNlLnN0YXR1cykpIHtcbiAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgfSBlbHNlIHtcbiAgICByZWplY3QoY3JlYXRlRXJyb3IoXG4gICAgICAnUmVxdWVzdCBmYWlsZWQgd2l0aCBzdGF0dXMgY29kZSAnICsgcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgcmVzcG9uc2UuY29uZmlnLFxuICAgICAgbnVsbCxcbiAgICAgIHJlc3BvbnNlLnJlcXVlc3QsXG4gICAgICByZXNwb25zZVxuICAgICkpO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbi8qKlxuICogVHJhbnNmb3JtIHRoZSBkYXRhIGZvciBhIHJlcXVlc3Qgb3IgYSByZXNwb25zZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gZGF0YSBUaGUgZGF0YSB0byBiZSB0cmFuc2Zvcm1lZFxuICogQHBhcmFtIHtBcnJheX0gaGVhZGVycyBUaGUgaGVhZGVycyBmb3IgdGhlIHJlcXVlc3Qgb3IgcmVzcG9uc2VcbiAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb259IGZucyBBIHNpbmdsZSBmdW5jdGlvbiBvciBBcnJheSBvZiBmdW5jdGlvbnNcbiAqIEByZXR1cm5zIHsqfSBUaGUgcmVzdWx0aW5nIHRyYW5zZm9ybWVkIGRhdGFcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmFuc2Zvcm1EYXRhKGRhdGEsIGhlYWRlcnMsIGZucykge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgdXRpbHMuZm9yRWFjaChmbnMsIGZ1bmN0aW9uIHRyYW5zZm9ybShmbikge1xuICAgIGRhdGEgPSBmbihkYXRhLCBoZWFkZXJzKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGRhdGE7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgbm9ybWFsaXplSGVhZGVyTmFtZSA9IHJlcXVpcmUoJy4vaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lJyk7XG5cbnZhciBERUZBVUxUX0NPTlRFTlRfVFlQRSA9IHtcbiAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG59O1xuXG5mdW5jdGlvbiBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgdmFsdWUpIHtcbiAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzKSAmJiB1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzWydDb250ZW50LVR5cGUnXSkpIHtcbiAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IHZhbHVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldERlZmF1bHRBZGFwdGVyKCkge1xuICB2YXIgYWRhcHRlcjtcbiAgaWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBGb3IgYnJvd3NlcnMgdXNlIFhIUiBhZGFwdGVyXG4gICAgYWRhcHRlciA9IHJlcXVpcmUoJy4vYWRhcHRlcnMveGhyJyk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nKSB7XG4gICAgLy8gRm9yIG5vZGUgdXNlIEhUVFAgYWRhcHRlclxuICAgIGFkYXB0ZXIgPSByZXF1aXJlKCcuL2FkYXB0ZXJzL2h0dHAnKTtcbiAgfVxuICByZXR1cm4gYWRhcHRlcjtcbn1cblxudmFyIGRlZmF1bHRzID0ge1xuICBhZGFwdGVyOiBnZXREZWZhdWx0QWRhcHRlcigpLFxuXG4gIHRyYW5zZm9ybVJlcXVlc3Q6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXF1ZXN0KGRhdGEsIGhlYWRlcnMpIHtcbiAgICBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsICdBY2NlcHQnKTtcbiAgICBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsICdDb250ZW50LVR5cGUnKTtcbiAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNBcnJheUJ1ZmZlcihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzU3RyZWFtKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0ZpbGUoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQmxvYihkYXRhKVxuICAgICkge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyVmlldyhkYXRhKSkge1xuICAgICAgcmV0dXJuIGRhdGEuYnVmZmVyO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMoZGF0YSkpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIHJldHVybiBkYXRhLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc09iamVjdChkYXRhKSkge1xuICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIHRyYW5zZm9ybVJlc3BvbnNlOiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVzcG9uc2UoZGF0YSkge1xuICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgfSBjYXRjaCAoZSkgeyAvKiBJZ25vcmUgKi8gfVxuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgLyoqXG4gICAqIEEgdGltZW91dCBpbiBtaWxsaXNlY29uZHMgdG8gYWJvcnQgYSByZXF1ZXN0LiBJZiBzZXQgdG8gMCAoZGVmYXVsdCkgYVxuICAgKiB0aW1lb3V0IGlzIG5vdCBjcmVhdGVkLlxuICAgKi9cbiAgdGltZW91dDogMCxcblxuICB4c3JmQ29va2llTmFtZTogJ1hTUkYtVE9LRU4nLFxuICB4c3JmSGVhZGVyTmFtZTogJ1gtWFNSRi1UT0tFTicsXG5cbiAgbWF4Q29udGVudExlbmd0aDogLTEsXG5cbiAgdmFsaWRhdGVTdGF0dXM6IGZ1bmN0aW9uIHZhbGlkYXRlU3RhdHVzKHN0YXR1cykge1xuICAgIHJldHVybiBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMDtcbiAgfVxufTtcblxuZGVmYXVsdHMuaGVhZGVycyA9IHtcbiAgY29tbW9uOiB7XG4gICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L3BsYWluLCAqLyonXG4gIH1cbn07XG5cbnV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0ge307XG59KTtcblxudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0gdXRpbHMubWVyZ2UoREVGQVVMVF9DT05URU5UX1RZUEUpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHM7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmluZChmbiwgdGhpc0FyZykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcCgpIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gZW5jb2RlKHZhbCkge1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkuXG4gICAgcmVwbGFjZSgvJTQwL2dpLCAnQCcpLlxuICAgIHJlcGxhY2UoLyUzQS9naSwgJzonKS5cbiAgICByZXBsYWNlKC8lMjQvZywgJyQnKS5cbiAgICByZXBsYWNlKC8lMkMvZ2ksICcsJykuXG4gICAgcmVwbGFjZSgvJTIwL2csICcrJykuXG4gICAgcmVwbGFjZSgvJTVCL2dpLCAnWycpLlxuICAgIHJlcGxhY2UoLyU1RC9naSwgJ10nKTtcbn1cblxuLyoqXG4gKiBCdWlsZCBhIFVSTCBieSBhcHBlbmRpbmcgcGFyYW1zIHRvIHRoZSBlbmRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBiYXNlIG9mIHRoZSB1cmwgKGUuZy4sIGh0dHA6Ly93d3cuZ29vZ2xlLmNvbSlcbiAqIEBwYXJhbSB7b2JqZWN0fSBbcGFyYW1zXSBUaGUgcGFyYW1zIHRvIGJlIGFwcGVuZGVkXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZm9ybWF0dGVkIHVybFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkVVJMKHVybCwgcGFyYW1zLCBwYXJhbXNTZXJpYWxpemVyKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICBpZiAoIXBhcmFtcykge1xuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICB2YXIgc2VyaWFsaXplZFBhcmFtcztcbiAgaWYgKHBhcmFtc1NlcmlhbGl6ZXIpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zU2VyaWFsaXplcihwYXJhbXMpO1xuICB9IGVsc2UgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKHBhcmFtcykpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHBhcnRzID0gW107XG5cbiAgICB1dGlscy5mb3JFYWNoKHBhcmFtcywgZnVuY3Rpb24gc2VyaWFsaXplKHZhbCwga2V5KSB7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHV0aWxzLmlzQXJyYXkodmFsKSkge1xuICAgICAgICBrZXkgPSBrZXkgKyAnW10nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsID0gW3ZhbF07XG4gICAgICB9XG5cbiAgICAgIHV0aWxzLmZvckVhY2godmFsLCBmdW5jdGlvbiBwYXJzZVZhbHVlKHYpIHtcbiAgICAgICAgaWYgKHV0aWxzLmlzRGF0ZSh2KSkge1xuICAgICAgICAgIHYgPSB2LnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodXRpbHMuaXNPYmplY3QodikpIHtcbiAgICAgICAgICB2ID0gSlNPTi5zdHJpbmdpZnkodik7XG4gICAgICAgIH1cbiAgICAgICAgcGFydHMucHVzaChlbmNvZGUoa2V5KSArICc9JyArIGVuY29kZSh2KSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJ0cy5qb2luKCcmJyk7XG4gIH1cblxuICBpZiAoc2VyaWFsaXplZFBhcmFtcykge1xuICAgIHZhciBoYXNobWFya0luZGV4ID0gdXJsLmluZGV4T2YoJyMnKTtcbiAgICBpZiAoaGFzaG1hcmtJbmRleCAhPT0gLTEpIHtcbiAgICAgIHVybCA9IHVybC5zbGljZSgwLCBoYXNobWFya0luZGV4KTtcbiAgICB9XG5cbiAgICB1cmwgKz0gKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIHNwZWNpZmllZCBVUkxzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVUkwgVGhlIGJhc2UgVVJMXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpdmVVUkwgVGhlIHJlbGF0aXZlIFVSTFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIFVSTFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlbGF0aXZlVVJMKSB7XG4gIHJldHVybiByZWxhdGl2ZVVSTFxuICAgID8gYmFzZVVSTC5yZXBsYWNlKC9cXC8rJC8sICcnKSArICcvJyArIHJlbGF0aXZlVVJMLnJlcGxhY2UoL15cXC8rLywgJycpXG4gICAgOiBiYXNlVVJMO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/XG5cbiAgLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIHN1cHBvcnQgZG9jdW1lbnQuY29va2llXG4gICAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZShuYW1lLCB2YWx1ZSwgZXhwaXJlcywgcGF0aCwgZG9tYWluLCBzZWN1cmUpIHtcbiAgICAgICAgICB2YXIgY29va2llID0gW107XG4gICAgICAgICAgY29va2llLnB1c2gobmFtZSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpO1xuXG4gICAgICAgICAgaWYgKHV0aWxzLmlzTnVtYmVyKGV4cGlyZXMpKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgnZXhwaXJlcz0nICsgbmV3IERhdGUoZXhwaXJlcykudG9HTVRTdHJpbmcoKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgncGF0aD0nICsgcGF0aCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKGRvbWFpbikpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdkb21haW49JyArIGRvbWFpbik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHNlY3VyZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ3NlY3VyZScpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGNvb2tpZS5qb2luKCc7ICcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQobmFtZSkge1xuICAgICAgICAgIHZhciBtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaChuZXcgUmVnRXhwKCcoXnw7XFxcXHMqKSgnICsgbmFtZSArICcpPShbXjtdKiknKSk7XG4gICAgICAgICAgcmV0dXJuIChtYXRjaCA/IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaFszXSkgOiBudWxsKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZShuYW1lKSB7XG4gICAgICAgICAgdGhpcy53cml0ZShuYW1lLCAnJywgRGF0ZS5ub3coKSAtIDg2NDAwMDAwKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnYgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gICAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZSgpIHt9LFxuICAgICAgICByZWFkOiBmdW5jdGlvbiByZWFkKCkgeyByZXR1cm4gbnVsbDsgfSxcbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgICAgfTtcbiAgICB9KSgpXG4pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIFVSTCB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBYnNvbHV0ZVVSTCh1cmwpIHtcbiAgLy8gQSBVUkwgaXMgY29uc2lkZXJlZCBhYnNvbHV0ZSBpZiBpdCBiZWdpbnMgd2l0aCBcIjxzY2hlbWU+Oi8vXCIgb3IgXCIvL1wiIChwcm90b2NvbC1yZWxhdGl2ZSBVUkwpLlxuICAvLyBSRkMgMzk4NiBkZWZpbmVzIHNjaGVtZSBuYW1lIGFzIGEgc2VxdWVuY2Ugb2YgY2hhcmFjdGVycyBiZWdpbm5pbmcgd2l0aCBhIGxldHRlciBhbmQgZm9sbG93ZWRcbiAgLy8gYnkgYW55IGNvbWJpbmF0aW9uIG9mIGxldHRlcnMsIGRpZ2l0cywgcGx1cywgcGVyaW9kLCBvciBoeXBoZW4uXG4gIHJldHVybiAvXihbYS16XVthLXpcXGRcXCtcXC1cXC5dKjopP1xcL1xcLy9pLnRlc3QodXJsKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoXG4gIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXG4gIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBoYXZlIGZ1bGwgc3VwcG9ydCBvZiB0aGUgQVBJcyBuZWVkZWQgdG8gdGVzdFxuICAvLyB3aGV0aGVyIHRoZSByZXF1ZXN0IFVSTCBpcyBvZiB0aGUgc2FtZSBvcmlnaW4gYXMgY3VycmVudCBsb2NhdGlvbi5cbiAgICAoZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgdmFyIG1zaWUgPSAvKG1zaWV8dHJpZGVudCkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgICAgdmFyIHVybFBhcnNpbmdOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgdmFyIG9yaWdpblVSTDtcblxuICAgICAgLyoqXG4gICAgKiBQYXJzZSBhIFVSTCB0byBkaXNjb3ZlciBpdCdzIGNvbXBvbmVudHNcbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIFRoZSBVUkwgdG8gYmUgcGFyc2VkXG4gICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICovXG4gICAgICBmdW5jdGlvbiByZXNvbHZlVVJMKHVybCkge1xuICAgICAgICB2YXIgaHJlZiA9IHVybDtcblxuICAgICAgICBpZiAobXNpZSkge1xuICAgICAgICAvLyBJRSBuZWVkcyBhdHRyaWJ1dGUgc2V0IHR3aWNlIHRvIG5vcm1hbGl6ZSBwcm9wZXJ0aWVzXG4gICAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG4gICAgICAgICAgaHJlZiA9IHVybFBhcnNpbmdOb2RlLmhyZWY7XG4gICAgICAgIH1cblxuICAgICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcblxuICAgICAgICAvLyB1cmxQYXJzaW5nTm9kZSBwcm92aWRlcyB0aGUgVXJsVXRpbHMgaW50ZXJmYWNlIC0gaHR0cDovL3VybC5zcGVjLndoYXR3Zy5vcmcvI3VybHV0aWxzXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaHJlZjogdXJsUGFyc2luZ05vZGUuaHJlZixcbiAgICAgICAgICBwcm90b2NvbDogdXJsUGFyc2luZ05vZGUucHJvdG9jb2wgPyB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbC5yZXBsYWNlKC86JC8sICcnKSA6ICcnLFxuICAgICAgICAgIGhvc3Q6IHVybFBhcnNpbmdOb2RlLmhvc3QsXG4gICAgICAgICAgc2VhcmNoOiB1cmxQYXJzaW5nTm9kZS5zZWFyY2ggPyB1cmxQYXJzaW5nTm9kZS5zZWFyY2gucmVwbGFjZSgvXlxcPy8sICcnKSA6ICcnLFxuICAgICAgICAgIGhhc2g6IHVybFBhcnNpbmdOb2RlLmhhc2ggPyB1cmxQYXJzaW5nTm9kZS5oYXNoLnJlcGxhY2UoL14jLywgJycpIDogJycsXG4gICAgICAgICAgaG9zdG5hbWU6IHVybFBhcnNpbmdOb2RlLmhvc3RuYW1lLFxuICAgICAgICAgIHBvcnQ6IHVybFBhcnNpbmdOb2RlLnBvcnQsXG4gICAgICAgICAgcGF0aG5hbWU6ICh1cmxQYXJzaW5nTm9kZS5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJykgP1xuICAgICAgICAgICAgdXJsUGFyc2luZ05vZGUucGF0aG5hbWUgOlxuICAgICAgICAgICAgJy8nICsgdXJsUGFyc2luZ05vZGUucGF0aG5hbWVcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgb3JpZ2luVVJMID0gcmVzb2x2ZVVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG5cbiAgICAgIC8qKlxuICAgICogRGV0ZXJtaW5lIGlmIGEgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4gYXMgdGhlIGN1cnJlbnQgbG9jYXRpb25cbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gcmVxdWVzdFVSTCBUaGUgVVJMIHRvIHRlc3RcbiAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luLCBvdGhlcndpc2UgZmFsc2VcbiAgICAqL1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbihyZXF1ZXN0VVJMKSB7XG4gICAgICAgIHZhciBwYXJzZWQgPSAodXRpbHMuaXNTdHJpbmcocmVxdWVzdFVSTCkpID8gcmVzb2x2ZVVSTChyZXF1ZXN0VVJMKSA6IHJlcXVlc3RVUkw7XG4gICAgICAgIHJldHVybiAocGFyc2VkLnByb3RvY29sID09PSBvcmlnaW5VUkwucHJvdG9jb2wgJiZcbiAgICAgICAgICAgIHBhcnNlZC5ob3N0ID09PSBvcmlnaW5VUkwuaG9zdCk7XG4gICAgICB9O1xuICAgIH0pKCkgOlxuXG4gIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudnMgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gICAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4oKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfTtcbiAgICB9KSgpXG4pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgbm9ybWFsaXplZE5hbWUpIHtcbiAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLCBmdW5jdGlvbiBwcm9jZXNzSGVhZGVyKHZhbHVlLCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgIT09IG5vcm1hbGl6ZWROYW1lICYmIG5hbWUudG9VcHBlckNhc2UoKSA9PT0gbm9ybWFsaXplZE5hbWUudG9VcHBlckNhc2UoKSkge1xuICAgICAgaGVhZGVyc1tub3JtYWxpemVkTmFtZV0gPSB2YWx1ZTtcbiAgICAgIGRlbGV0ZSBoZWFkZXJzW25hbWVdO1xuICAgIH1cbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbi8vIEhlYWRlcnMgd2hvc2UgZHVwbGljYXRlcyBhcmUgaWdub3JlZCBieSBub2RlXG4vLyBjLmYuIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvaHR0cC5odG1sI2h0dHBfbWVzc2FnZV9oZWFkZXJzXG52YXIgaWdub3JlRHVwbGljYXRlT2YgPSBbXG4gICdhZ2UnLCAnYXV0aG9yaXphdGlvbicsICdjb250ZW50LWxlbmd0aCcsICdjb250ZW50LXR5cGUnLCAnZXRhZycsXG4gICdleHBpcmVzJywgJ2Zyb20nLCAnaG9zdCcsICdpZi1tb2RpZmllZC1zaW5jZScsICdpZi11bm1vZGlmaWVkLXNpbmNlJyxcbiAgJ2xhc3QtbW9kaWZpZWQnLCAnbG9jYXRpb24nLCAnbWF4LWZvcndhcmRzJywgJ3Byb3h5LWF1dGhvcml6YXRpb24nLFxuICAncmVmZXJlcicsICdyZXRyeS1hZnRlcicsICd1c2VyLWFnZW50J1xuXTtcblxuLyoqXG4gKiBQYXJzZSBoZWFkZXJzIGludG8gYW4gb2JqZWN0XG4gKlxuICogYGBgXG4gKiBEYXRlOiBXZWQsIDI3IEF1ZyAyMDE0IDA4OjU4OjQ5IEdNVFxuICogQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uXG4gKiBDb25uZWN0aW9uOiBrZWVwLWFsaXZlXG4gKiBUcmFuc2Zlci1FbmNvZGluZzogY2h1bmtlZFxuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGhlYWRlcnMgSGVhZGVycyBuZWVkaW5nIHRvIGJlIHBhcnNlZFxuICogQHJldHVybnMge09iamVjdH0gSGVhZGVycyBwYXJzZWQgaW50byBhbiBvYmplY3RcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZUhlYWRlcnMoaGVhZGVycykge1xuICB2YXIgcGFyc2VkID0ge307XG4gIHZhciBrZXk7XG4gIHZhciB2YWw7XG4gIHZhciBpO1xuXG4gIGlmICghaGVhZGVycykgeyByZXR1cm4gcGFyc2VkOyB9XG5cbiAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLnNwbGl0KCdcXG4nKSwgZnVuY3Rpb24gcGFyc2VyKGxpbmUpIHtcbiAgICBpID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAga2V5ID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cigwLCBpKSkudG9Mb3dlckNhc2UoKTtcbiAgICB2YWwgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKGkgKyAxKSk7XG5cbiAgICBpZiAoa2V5KSB7XG4gICAgICBpZiAocGFyc2VkW2tleV0gJiYgaWdub3JlRHVwbGljYXRlT2YuaW5kZXhPZihrZXkpID49IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGtleSA9PT0gJ3NldC1jb29raWUnKSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gKHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gOiBbXSkuY29uY2F0KFt2YWxdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gcGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSArICcsICcgKyB2YWwgOiB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcGFyc2VkO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBTeW50YWN0aWMgc3VnYXIgZm9yIGludm9raW5nIGEgZnVuY3Rpb24gYW5kIGV4cGFuZGluZyBhbiBhcnJheSBmb3IgYXJndW1lbnRzLlxuICpcbiAqIENvbW1vbiB1c2UgY2FzZSB3b3VsZCBiZSB0byB1c2UgYEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseWAuXG4gKlxuICogIGBgYGpzXG4gKiAgZnVuY3Rpb24gZih4LCB5LCB6KSB7fVxuICogIHZhciBhcmdzID0gWzEsIDIsIDNdO1xuICogIGYuYXBwbHkobnVsbCwgYXJncyk7XG4gKiAgYGBgXG4gKlxuICogV2l0aCBgc3ByZWFkYCB0aGlzIGV4YW1wbGUgY2FuIGJlIHJlLXdyaXR0ZW4uXG4gKlxuICogIGBgYGpzXG4gKiAgc3ByZWFkKGZ1bmN0aW9uKHgsIHksIHopIHt9KShbMSwgMiwgM10pO1xuICogIGBgYFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3ByZWFkKGNhbGxiYWNrKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKGFycikge1xuICAgIHJldHVybiBjYWxsYmFjay5hcHBseShudWxsLCBhcnIpO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJpbmQgPSByZXF1aXJlKCcuL2hlbHBlcnMvYmluZCcpO1xuXG4vKmdsb2JhbCB0b1N0cmluZzp0cnVlKi9cblxuLy8gdXRpbHMgaXMgYSBsaWJyYXJ5IG9mIGdlbmVyaWMgaGVscGVyIGZ1bmN0aW9ucyBub24tc3BlY2lmaWMgdG8gYXhpb3NcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyB1bmRlZmluZWRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdW5kZWZpbmVkLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNCdWZmZXIodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IG51bGwgJiYgIWlzVW5kZWZpbmVkKHZhbCkgJiYgdmFsLmNvbnN0cnVjdG9yICE9PSBudWxsICYmICFpc1VuZGVmaW5lZCh2YWwuY29uc3RydWN0b3IpXG4gICAgJiYgdHlwZW9mIHZhbC5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiB2YWwuY29uc3RydWN0b3IuaXNCdWZmZXIodmFsKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZvcm1EYXRhXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gRm9ybURhdGEsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Zvcm1EYXRhKHZhbCkge1xuICByZXR1cm4gKHR5cGVvZiBGb3JtRGF0YSAhPT0gJ3VuZGVmaW5lZCcpICYmICh2YWwgaW5zdGFuY2VvZiBGb3JtRGF0YSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlclZpZXcodmFsKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmICgodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJykgJiYgKEFycmF5QnVmZmVyLmlzVmlldykpIHtcbiAgICByZXN1bHQgPSBBcnJheUJ1ZmZlci5pc1ZpZXcodmFsKTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSAodmFsKSAmJiAodmFsLmJ1ZmZlcikgJiYgKHZhbC5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcik7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmluZ1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyaW5nLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIE51bWJlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgTnVtYmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOdW1iZXIodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIERhdGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIERhdGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0RhdGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0ZpbGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZpbGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJsb2JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJsb2IsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Jsb2IodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEJsb2JdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJlYW1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmVhbSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyZWFtKHZhbCkge1xuICByZXR1cm4gaXNPYmplY3QodmFsKSAmJiBpc0Z1bmN0aW9uKHZhbC5waXBlKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VSTFNlYXJjaFBhcmFtcyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiBVUkxTZWFyY2hQYXJhbXMgIT09ICd1bmRlZmluZWQnICYmIHZhbCBpbnN0YW5jZW9mIFVSTFNlYXJjaFBhcmFtcztcbn1cblxuLyoqXG4gKiBUcmltIGV4Y2VzcyB3aGl0ZXNwYWNlIG9mZiB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBTdHJpbmcgdG8gdHJpbVxuICogQHJldHVybnMge1N0cmluZ30gVGhlIFN0cmluZyBmcmVlZCBvZiBleGNlc3Mgd2hpdGVzcGFjZVxuICovXG5mdW5jdGlvbiB0cmltKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMqLywgJycpLnJlcGxhY2UoL1xccyokLywgJycpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiB3ZSdyZSBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudFxuICpcbiAqIFRoaXMgYWxsb3dzIGF4aW9zIHRvIHJ1biBpbiBhIHdlYiB3b3JrZXIsIGFuZCByZWFjdC1uYXRpdmUuXG4gKiBCb3RoIGVudmlyb25tZW50cyBzdXBwb3J0IFhNTEh0dHBSZXF1ZXN0LCBidXQgbm90IGZ1bGx5IHN0YW5kYXJkIGdsb2JhbHMuXG4gKlxuICogd2ViIHdvcmtlcnM6XG4gKiAgdHlwZW9mIHdpbmRvdyAtPiB1bmRlZmluZWRcbiAqICB0eXBlb2YgZG9jdW1lbnQgLT4gdW5kZWZpbmVkXG4gKlxuICogcmVhY3QtbmF0aXZlOlxuICogIG5hdmlnYXRvci5wcm9kdWN0IC0+ICdSZWFjdE5hdGl2ZSdcbiAqIG5hdGl2ZXNjcmlwdFxuICogIG5hdmlnYXRvci5wcm9kdWN0IC0+ICdOYXRpdmVTY3JpcHQnIG9yICdOUydcbiAqL1xuZnVuY3Rpb24gaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiAobmF2aWdhdG9yLnByb2R1Y3QgPT09ICdSZWFjdE5hdGl2ZScgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ05hdGl2ZVNjcmlwdCcgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ05TJykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIChcbiAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCdcbiAgKTtcbn1cblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYW4gQXJyYXkgb3IgYW4gT2JqZWN0IGludm9raW5nIGEgZnVuY3Rpb24gZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBJZiBgb2JqYCBpcyBhbiBBcnJheSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGluZGV4LCBhbmQgY29tcGxldGUgYXJyYXkgZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBJZiAnb2JqJyBpcyBhbiBPYmplY3QgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBrZXksIGFuZCBjb21wbGV0ZSBvYmplY3QgZm9yIGVhY2ggcHJvcGVydHkuXG4gKlxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IG9iaiBUaGUgb2JqZWN0IHRvIGl0ZXJhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBjYWxsYmFjayB0byBpbnZva2UgZm9yIGVhY2ggaXRlbVxuICovXG5mdW5jdGlvbiBmb3JFYWNoKG9iaiwgZm4pIHtcbiAgLy8gRG9uJ3QgYm90aGVyIGlmIG5vIHZhbHVlIHByb3ZpZGVkXG4gIGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBGb3JjZSBhbiBhcnJheSBpZiBub3QgYWxyZWFkeSBzb21ldGhpbmcgaXRlcmFibGVcbiAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB7XG4gICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gICAgb2JqID0gW29ial07XG4gIH1cblxuICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIGFycmF5IHZhbHVlc1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gb2JqLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgZm4uY2FsbChudWxsLCBvYmpbaV0sIGksIG9iaik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBvYmplY3Qga2V5c1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2tleV0sIGtleSwgb2JqKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBBY2NlcHRzIHZhcmFyZ3MgZXhwZWN0aW5nIGVhY2ggYXJndW1lbnQgdG8gYmUgYW4gb2JqZWN0LCB0aGVuXG4gKiBpbW11dGFibHkgbWVyZ2VzIHRoZSBwcm9wZXJ0aWVzIG9mIGVhY2ggb2JqZWN0IGFuZCByZXR1cm5zIHJlc3VsdC5cbiAqXG4gKiBXaGVuIG11bHRpcGxlIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBrZXkgdGhlIGxhdGVyIG9iamVjdCBpblxuICogdGhlIGFyZ3VtZW50cyBsaXN0IHdpbGwgdGFrZSBwcmVjZWRlbmNlLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogYGBganNcbiAqIHZhciByZXN1bHQgPSBtZXJnZSh7Zm9vOiAxMjN9LCB7Zm9vOiA0NTZ9KTtcbiAqIGNvbnNvbGUubG9nKHJlc3VsdC5mb28pOyAvLyBvdXRwdXRzIDQ1NlxuICogYGBgXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iajEgT2JqZWN0IHRvIG1lcmdlXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXN1bHQgb2YgYWxsIG1lcmdlIHByb3BlcnRpZXNcbiAqL1xuZnVuY3Rpb24gbWVyZ2UoLyogb2JqMSwgb2JqMiwgb2JqMywgLi4uICovKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcbiAgICBpZiAodHlwZW9mIHJlc3VsdFtrZXldID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZShyZXN1bHRba2V5XSwgdmFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWw7XG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgZm9yRWFjaChhcmd1bWVudHNbaV0sIGFzc2lnblZhbHVlKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEZ1bmN0aW9uIGVxdWFsIHRvIG1lcmdlIHdpdGggdGhlIGRpZmZlcmVuY2UgYmVpbmcgdGhhdCBubyByZWZlcmVuY2VcbiAqIHRvIG9yaWdpbmFsIG9iamVjdHMgaXMga2VwdC5cbiAqXG4gKiBAc2VlIG1lcmdlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqMSBPYmplY3QgdG8gbWVyZ2VcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJlc3VsdCBvZiBhbGwgbWVyZ2UgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBkZWVwTWVyZ2UoLyogb2JqMSwgb2JqMiwgb2JqMywgLi4uICovKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcbiAgICBpZiAodHlwZW9mIHJlc3VsdFtrZXldID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgICAgcmVzdWx0W2tleV0gPSBkZWVwTWVyZ2UocmVzdWx0W2tleV0sIHZhbCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgICAgcmVzdWx0W2tleV0gPSBkZWVwTWVyZ2Uoe30sIHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsO1xuICAgIH1cbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGZvckVhY2goYXJndW1lbnRzW2ldLCBhc3NpZ25WYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBFeHRlbmRzIG9iamVjdCBhIGJ5IG11dGFibHkgYWRkaW5nIHRvIGl0IHRoZSBwcm9wZXJ0aWVzIG9mIG9iamVjdCBiLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhIFRoZSBvYmplY3QgdG8gYmUgZXh0ZW5kZWRcbiAqIEBwYXJhbSB7T2JqZWN0fSBiIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb21cbiAqIEBwYXJhbSB7T2JqZWN0fSB0aGlzQXJnIFRoZSBvYmplY3QgdG8gYmluZCBmdW5jdGlvbiB0b1xuICogQHJldHVybiB7T2JqZWN0fSBUaGUgcmVzdWx0aW5nIHZhbHVlIG9mIG9iamVjdCBhXG4gKi9cbmZ1bmN0aW9uIGV4dGVuZChhLCBiLCB0aGlzQXJnKSB7XG4gIGZvckVhY2goYiwgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcbiAgICBpZiAodGhpc0FyZyAmJiB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhW2tleV0gPSBiaW5kKHZhbCwgdGhpc0FyZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFba2V5XSA9IHZhbDtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzQXJyYXk6IGlzQXJyYXksXG4gIGlzQXJyYXlCdWZmZXI6IGlzQXJyYXlCdWZmZXIsXG4gIGlzQnVmZmVyOiBpc0J1ZmZlcixcbiAgaXNGb3JtRGF0YTogaXNGb3JtRGF0YSxcbiAgaXNBcnJheUJ1ZmZlclZpZXc6IGlzQXJyYXlCdWZmZXJWaWV3LFxuICBpc1N0cmluZzogaXNTdHJpbmcsXG4gIGlzTnVtYmVyOiBpc051bWJlcixcbiAgaXNPYmplY3Q6IGlzT2JqZWN0LFxuICBpc1VuZGVmaW5lZDogaXNVbmRlZmluZWQsXG4gIGlzRGF0ZTogaXNEYXRlLFxuICBpc0ZpbGU6IGlzRmlsZSxcbiAgaXNCbG9iOiBpc0Jsb2IsXG4gIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG4gIGlzU3RyZWFtOiBpc1N0cmVhbSxcbiAgaXNVUkxTZWFyY2hQYXJhbXM6IGlzVVJMU2VhcmNoUGFyYW1zLFxuICBpc1N0YW5kYXJkQnJvd3NlckVudjogaXNTdGFuZGFyZEJyb3dzZXJFbnYsXG4gIGZvckVhY2g6IGZvckVhY2gsXG4gIG1lcmdlOiBtZXJnZSxcbiAgZGVlcE1lcmdlOiBkZWVwTWVyZ2UsXG4gIGV4dGVuZDogZXh0ZW5kLFxuICB0cmltOiB0cmltXG59O1xuIiwiXG4gICAgKHdpbmRvdy5fX05FWFRfUCA9IHdpbmRvdy5fX05FWFRfUCB8fCBbXSkucHVzaChbXG4gICAgICBcIi9cIixcbiAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHJlcXVpcmUoXCJDOlxcXFxVc2Vyc1xcXFxoaWxsZWwgbmFnaWRcXFxcRGVza3RvcFxcXFxyaHl0aG1cXFxccGFnZXNcXFxcaW5kZXguanNcIik7XG4gICAgICB9XG4gICAgXSk7XG4gICIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISBkbGwtcmVmZXJlbmNlIGRsbF9lYzdkOWMwMjQ5YjJlZjUyYjc0YyAqLyBcImRsbC1yZWZlcmVuY2UgZGxsX2VjN2Q5YzAyNDliMmVmNTJiNzRjXCIpKShcIi4vbm9kZV9tb2R1bGVzL3JlYWN0L2luZGV4LmpzXCIpOyIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBoYXNoKHN0cikge1xuICB2YXIgaGFzaCA9IDUzODEsXG4gICAgICBpICAgID0gc3RyLmxlbmd0aDtcblxuICB3aGlsZShpKSB7XG4gICAgaGFzaCA9IChoYXNoICogMzMpIF4gc3RyLmNoYXJDb2RlQXQoLS1pKTtcbiAgfVxuXG4gIC8qIEphdmFTY3JpcHQgZG9lcyBiaXR3aXNlIG9wZXJhdGlvbnMgKGxpa2UgWE9SLCBhYm92ZSkgb24gMzItYml0IHNpZ25lZFxuICAgKiBpbnRlZ2Vycy4gU2luY2Ugd2Ugd2FudCB0aGUgcmVzdWx0cyB0byBiZSBhbHdheXMgcG9zaXRpdmUsIGNvbnZlcnQgdGhlXG4gICAqIHNpZ25lZCBpbnQgdG8gYW4gdW5zaWduZWQgYnkgZG9pbmcgYW4gdW5zaWduZWQgYml0c2hpZnQuICovXG4gIHJldHVybiBoYXNoID4+PiAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2g7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbi8qXG5CYXNlZCBvbiBHbGFtb3IncyBzaGVldFxuaHR0cHM6Ly9naXRodWIuY29tL3RocmVlcG9pbnRvbmUvZ2xhbW9yL2Jsb2IvNjY3YjQ4MGQzMWIzNzIxYTkwNTAyMWIyNmUxMjkwY2U5MmNhMjg3OS9zcmMvc2hlZXQuanNcbiovXG52YXIgaXNQcm9kID0gdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MuZW52ICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbic7XG5cbnZhciBpc1N0cmluZyA9IGZ1bmN0aW9uIGlzU3RyaW5nKG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKSA9PT0gJ1tvYmplY3QgU3RyaW5nXSc7XG59O1xuXG52YXIgU3R5bGVTaGVldCA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFN0eWxlU2hlZXQoX3RlbXApIHtcbiAgICB2YXIgX3JlZiA9IF90ZW1wID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wLFxuICAgICAgICBfcmVmJG5hbWUgPSBfcmVmLm5hbWUsXG4gICAgICAgIG5hbWUgPSBfcmVmJG5hbWUgPT09IHZvaWQgMCA/ICdzdHlsZXNoZWV0JyA6IF9yZWYkbmFtZSxcbiAgICAgICAgX3JlZiRvcHRpbWl6ZUZvclNwZWVkID0gX3JlZi5vcHRpbWl6ZUZvclNwZWVkLFxuICAgICAgICBvcHRpbWl6ZUZvclNwZWVkID0gX3JlZiRvcHRpbWl6ZUZvclNwZWVkID09PSB2b2lkIDAgPyBpc1Byb2QgOiBfcmVmJG9wdGltaXplRm9yU3BlZWQsXG4gICAgICAgIF9yZWYkaXNCcm93c2VyID0gX3JlZi5pc0Jyb3dzZXIsXG4gICAgICAgIGlzQnJvd3NlciA9IF9yZWYkaXNCcm93c2VyID09PSB2b2lkIDAgPyB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA6IF9yZWYkaXNCcm93c2VyO1xuXG4gICAgaW52YXJpYW50KGlzU3RyaW5nKG5hbWUpLCAnYG5hbWVgIG11c3QgYmUgYSBzdHJpbmcnKTtcbiAgICB0aGlzLl9uYW1lID0gbmFtZTtcbiAgICB0aGlzLl9kZWxldGVkUnVsZVBsYWNlaG9sZGVyID0gXCIjXCIgKyBuYW1lICsgXCItZGVsZXRlZC1ydWxlX19fX3t9XCI7XG4gICAgaW52YXJpYW50KHR5cGVvZiBvcHRpbWl6ZUZvclNwZWVkID09PSAnYm9vbGVhbicsICdgb3B0aW1pemVGb3JTcGVlZGAgbXVzdCBiZSBhIGJvb2xlYW4nKTtcbiAgICB0aGlzLl9vcHRpbWl6ZUZvclNwZWVkID0gb3B0aW1pemVGb3JTcGVlZDtcbiAgICB0aGlzLl9pc0Jyb3dzZXIgPSBpc0Jyb3dzZXI7XG4gICAgdGhpcy5fc2VydmVyU2hlZXQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fdGFncyA9IFtdO1xuICAgIHRoaXMuX2luamVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5fcnVsZXNDb3VudCA9IDA7XG4gICAgdmFyIG5vZGUgPSB0aGlzLl9pc0Jyb3dzZXIgJiYgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtwcm9wZXJ0eT1cImNzcC1ub25jZVwiXScpO1xuICAgIHRoaXMuX25vbmNlID0gbm9kZSA/IG5vZGUuZ2V0QXR0cmlidXRlKCdjb250ZW50JykgOiBudWxsO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IFN0eWxlU2hlZXQucHJvdG90eXBlO1xuXG4gIF9wcm90by5zZXRPcHRpbWl6ZUZvclNwZWVkID0gZnVuY3Rpb24gc2V0T3B0aW1pemVGb3JTcGVlZChib29sKSB7XG4gICAgaW52YXJpYW50KHR5cGVvZiBib29sID09PSAnYm9vbGVhbicsICdgc2V0T3B0aW1pemVGb3JTcGVlZGAgYWNjZXB0cyBhIGJvb2xlYW4nKTtcbiAgICBpbnZhcmlhbnQodGhpcy5fcnVsZXNDb3VudCA9PT0gMCwgJ29wdGltaXplRm9yU3BlZWQgY2Fubm90IGJlIHdoZW4gcnVsZXMgaGF2ZSBhbHJlYWR5IGJlZW4gaW5zZXJ0ZWQnKTtcbiAgICB0aGlzLmZsdXNoKCk7XG4gICAgdGhpcy5fb3B0aW1pemVGb3JTcGVlZCA9IGJvb2w7XG4gICAgdGhpcy5pbmplY3QoKTtcbiAgfTtcblxuICBfcHJvdG8uaXNPcHRpbWl6ZUZvclNwZWVkID0gZnVuY3Rpb24gaXNPcHRpbWl6ZUZvclNwZWVkKCkge1xuICAgIHJldHVybiB0aGlzLl9vcHRpbWl6ZUZvclNwZWVkO1xuICB9O1xuXG4gIF9wcm90by5pbmplY3QgPSBmdW5jdGlvbiBpbmplY3QoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGludmFyaWFudCghdGhpcy5faW5qZWN0ZWQsICdzaGVldCBhbHJlYWR5IGluamVjdGVkJyk7XG4gICAgdGhpcy5faW5qZWN0ZWQgPSB0cnVlO1xuXG4gICAgaWYgKHRoaXMuX2lzQnJvd3NlciAmJiB0aGlzLl9vcHRpbWl6ZUZvclNwZWVkKSB7XG4gICAgICB0aGlzLl90YWdzWzBdID0gdGhpcy5tYWtlU3R5bGVUYWcodGhpcy5fbmFtZSk7XG4gICAgICB0aGlzLl9vcHRpbWl6ZUZvclNwZWVkID0gJ2luc2VydFJ1bGUnIGluIHRoaXMuZ2V0U2hlZXQoKTtcblxuICAgICAgaWYgKCF0aGlzLl9vcHRpbWl6ZUZvclNwZWVkKSB7XG4gICAgICAgIGlmICghaXNQcm9kKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdTdHlsZVNoZWV0OiBvcHRpbWl6ZUZvclNwZWVkIG1vZGUgbm90IHN1cHBvcnRlZCBmYWxsaW5nIGJhY2sgdG8gc3RhbmRhcmQgbW9kZS4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZmx1c2goKTtcbiAgICAgICAgdGhpcy5faW5qZWN0ZWQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fc2VydmVyU2hlZXQgPSB7XG4gICAgICBjc3NSdWxlczogW10sXG4gICAgICBpbnNlcnRSdWxlOiBmdW5jdGlvbiBpbnNlcnRSdWxlKHJ1bGUsIGluZGV4KSB7XG4gICAgICAgIGlmICh0eXBlb2YgaW5kZXggPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgX3RoaXMuX3NlcnZlclNoZWV0LmNzc1J1bGVzW2luZGV4XSA9IHtcbiAgICAgICAgICAgIGNzc1RleHQ6IHJ1bGVcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF90aGlzLl9zZXJ2ZXJTaGVldC5jc3NSdWxlcy5wdXNoKHtcbiAgICAgICAgICAgIGNzc1RleHQ6IHJ1bGVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICAgIH0sXG4gICAgICBkZWxldGVSdWxlOiBmdW5jdGlvbiBkZWxldGVSdWxlKGluZGV4KSB7XG4gICAgICAgIF90aGlzLl9zZXJ2ZXJTaGVldC5jc3NSdWxlc1tpbmRleF0gPSBudWxsO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgX3Byb3RvLmdldFNoZWV0Rm9yVGFnID0gZnVuY3Rpb24gZ2V0U2hlZXRGb3JUYWcodGFnKSB7XG4gICAgaWYgKHRhZy5zaGVldCkge1xuICAgICAgcmV0dXJuIHRhZy5zaGVldDtcbiAgICB9IC8vIHRoaXMgd2VpcmRuZXNzIGJyb3VnaHQgdG8geW91IGJ5IGZpcmVmb3hcblxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkb2N1bWVudC5zdHlsZVNoZWV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldLm93bmVyTm9kZSA9PT0gdGFnKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5zdHlsZVNoZWV0c1tpXTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLmdldFNoZWV0ID0gZnVuY3Rpb24gZ2V0U2hlZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0U2hlZXRGb3JUYWcodGhpcy5fdGFnc1t0aGlzLl90YWdzLmxlbmd0aCAtIDFdKTtcbiAgfTtcblxuICBfcHJvdG8uaW5zZXJ0UnVsZSA9IGZ1bmN0aW9uIGluc2VydFJ1bGUocnVsZSwgaW5kZXgpIHtcbiAgICBpbnZhcmlhbnQoaXNTdHJpbmcocnVsZSksICdgaW5zZXJ0UnVsZWAgYWNjZXB0cyBvbmx5IHN0cmluZ3MnKTtcblxuICAgIGlmICghdGhpcy5faXNCcm93c2VyKSB7XG4gICAgICBpZiAodHlwZW9mIGluZGV4ICE9PSAnbnVtYmVyJykge1xuICAgICAgICBpbmRleCA9IHRoaXMuX3NlcnZlclNoZWV0LmNzc1J1bGVzLmxlbmd0aDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fc2VydmVyU2hlZXQuaW5zZXJ0UnVsZShydWxlLCBpbmRleCk7XG5cbiAgICAgIHJldHVybiB0aGlzLl9ydWxlc0NvdW50Kys7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX29wdGltaXplRm9yU3BlZWQpIHtcbiAgICAgIHZhciBzaGVldCA9IHRoaXMuZ2V0U2hlZXQoKTtcblxuICAgICAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgaW5kZXggPSBzaGVldC5jc3NSdWxlcy5sZW5ndGg7XG4gICAgICB9IC8vIHRoaXMgd2VpcmRuZXNzIGZvciBwZXJmLCBhbmQgY2hyb21lJ3Mgd2VpcmQgYnVnXG4gICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yMDAwNzk5Mi9jaHJvbWUtc3VkZGVubHktc3RvcHBlZC1hY2NlcHRpbmctaW5zZXJ0cnVsZVxuXG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHNoZWV0Lmluc2VydFJ1bGUocnVsZSwgaW5kZXgpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgaWYgKCFpc1Byb2QpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oXCJTdHlsZVNoZWV0OiBpbGxlZ2FsIHJ1bGU6IFxcblxcblwiICsgcnVsZSArIFwiXFxuXFxuU2VlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcS8yMDAwNzk5MiBmb3IgbW9yZSBpbmZvXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgaW5zZXJ0aW9uUG9pbnQgPSB0aGlzLl90YWdzW2luZGV4XTtcblxuICAgICAgdGhpcy5fdGFncy5wdXNoKHRoaXMubWFrZVN0eWxlVGFnKHRoaXMuX25hbWUsIHJ1bGUsIGluc2VydGlvblBvaW50KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3J1bGVzQ291bnQrKztcbiAgfTtcblxuICBfcHJvdG8ucmVwbGFjZVJ1bGUgPSBmdW5jdGlvbiByZXBsYWNlUnVsZShpbmRleCwgcnVsZSkge1xuICAgIGlmICh0aGlzLl9vcHRpbWl6ZUZvclNwZWVkIHx8ICF0aGlzLl9pc0Jyb3dzZXIpIHtcbiAgICAgIHZhciBzaGVldCA9IHRoaXMuX2lzQnJvd3NlciA/IHRoaXMuZ2V0U2hlZXQoKSA6IHRoaXMuX3NlcnZlclNoZWV0O1xuXG4gICAgICBpZiAoIXJ1bGUudHJpbSgpKSB7XG4gICAgICAgIHJ1bGUgPSB0aGlzLl9kZWxldGVkUnVsZVBsYWNlaG9sZGVyO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXNoZWV0LmNzc1J1bGVzW2luZGV4XSkge1xuICAgICAgICAvLyBAVEJEIFNob3VsZCB3ZSB0aHJvdyBhbiBlcnJvcj9cbiAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgfVxuXG4gICAgICBzaGVldC5kZWxldGVSdWxlKGluZGV4KTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgc2hlZXQuaW5zZXJ0UnVsZShydWxlLCBpbmRleCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBpZiAoIWlzUHJvZCkge1xuICAgICAgICAgIGNvbnNvbGUud2FybihcIlN0eWxlU2hlZXQ6IGlsbGVnYWwgcnVsZTogXFxuXFxuXCIgKyBydWxlICsgXCJcXG5cXG5TZWUgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xLzIwMDA3OTkyIGZvciBtb3JlIGluZm9cIik7XG4gICAgICAgIH0gLy8gSW4gb3JkZXIgdG8gcHJlc2VydmUgdGhlIGluZGljZXMgd2UgaW5zZXJ0IGEgZGVsZXRlUnVsZVBsYWNlaG9sZGVyXG5cblxuICAgICAgICBzaGVldC5pbnNlcnRSdWxlKHRoaXMuX2RlbGV0ZWRSdWxlUGxhY2Vob2xkZXIsIGluZGV4KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHRhZyA9IHRoaXMuX3RhZ3NbaW5kZXhdO1xuICAgICAgaW52YXJpYW50KHRhZywgXCJvbGQgcnVsZSBhdCBpbmRleCBgXCIgKyBpbmRleCArIFwiYCBub3QgZm91bmRcIik7XG4gICAgICB0YWcudGV4dENvbnRlbnQgPSBydWxlO1xuICAgIH1cblxuICAgIHJldHVybiBpbmRleDtcbiAgfTtcblxuICBfcHJvdG8uZGVsZXRlUnVsZSA9IGZ1bmN0aW9uIGRlbGV0ZVJ1bGUoaW5kZXgpIHtcbiAgICBpZiAoIXRoaXMuX2lzQnJvd3Nlcikge1xuICAgICAgdGhpcy5fc2VydmVyU2hlZXQuZGVsZXRlUnVsZShpbmRleCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fb3B0aW1pemVGb3JTcGVlZCkge1xuICAgICAgdGhpcy5yZXBsYWNlUnVsZShpbmRleCwgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdGFnID0gdGhpcy5fdGFnc1tpbmRleF07XG4gICAgICBpbnZhcmlhbnQodGFnLCBcInJ1bGUgYXQgaW5kZXggYFwiICsgaW5kZXggKyBcImAgbm90IGZvdW5kXCIpO1xuICAgICAgdGFnLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGFnKTtcbiAgICAgIHRoaXMuX3RhZ3NbaW5kZXhdID0gbnVsbDtcbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLmZsdXNoID0gZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgdGhpcy5faW5qZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9ydWxlc0NvdW50ID0gMDtcblxuICAgIGlmICh0aGlzLl9pc0Jyb3dzZXIpIHtcbiAgICAgIHRoaXMuX3RhZ3MuZm9yRWFjaChmdW5jdGlvbiAodGFnKSB7XG4gICAgICAgIHJldHVybiB0YWcgJiYgdGFnLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGFnKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl90YWdzID0gW107XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHNpbXBsZXIgb24gc2VydmVyXG4gICAgICB0aGlzLl9zZXJ2ZXJTaGVldC5jc3NSdWxlcyA9IFtdO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uY3NzUnVsZXMgPSBmdW5jdGlvbiBjc3NSdWxlcygpIHtcbiAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgIGlmICghdGhpcy5faXNCcm93c2VyKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2VydmVyU2hlZXQuY3NzUnVsZXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3RhZ3MucmVkdWNlKGZ1bmN0aW9uIChydWxlcywgdGFnKSB7XG4gICAgICBpZiAodGFnKSB7XG4gICAgICAgIHJ1bGVzID0gcnVsZXMuY29uY2F0KEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbChfdGhpczIuZ2V0U2hlZXRGb3JUYWcodGFnKS5jc3NSdWxlcywgZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgICAgICByZXR1cm4gcnVsZS5jc3NUZXh0ID09PSBfdGhpczIuX2RlbGV0ZWRSdWxlUGxhY2Vob2xkZXIgPyBudWxsIDogcnVsZTtcbiAgICAgICAgfSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcnVsZXMucHVzaChudWxsKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJ1bGVzO1xuICAgIH0sIFtdKTtcbiAgfTtcblxuICBfcHJvdG8ubWFrZVN0eWxlVGFnID0gZnVuY3Rpb24gbWFrZVN0eWxlVGFnKG5hbWUsIGNzc1N0cmluZywgcmVsYXRpdmVUb1RhZykge1xuICAgIGlmIChjc3NTdHJpbmcpIHtcbiAgICAgIGludmFyaWFudChpc1N0cmluZyhjc3NTdHJpbmcpLCAnbWFrZVN0eWxlVGFnIGFjY2VwcyBvbmx5IHN0cmluZ3MgYXMgc2Vjb25kIHBhcmFtZXRlcicpO1xuICAgIH1cblxuICAgIHZhciB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIGlmICh0aGlzLl9ub25jZSkgdGFnLnNldEF0dHJpYnV0ZSgnbm9uY2UnLCB0aGlzLl9ub25jZSk7XG4gICAgdGFnLnR5cGUgPSAndGV4dC9jc3MnO1xuICAgIHRhZy5zZXRBdHRyaWJ1dGUoXCJkYXRhLVwiICsgbmFtZSwgJycpO1xuXG4gICAgaWYgKGNzc1N0cmluZykge1xuICAgICAgdGFnLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzc1N0cmluZykpO1xuICAgIH1cblxuICAgIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuXG4gICAgaWYgKHJlbGF0aXZlVG9UYWcpIHtcbiAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHRhZywgcmVsYXRpdmVUb1RhZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlYWQuYXBwZW5kQ2hpbGQodGFnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGFnO1xuICB9O1xuXG4gIF9jcmVhdGVDbGFzcyhTdHlsZVNoZWV0LCBbe1xuICAgIGtleTogXCJsZW5ndGhcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9ydWxlc0NvdW50O1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBTdHlsZVNoZWV0O1xufSgpO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IFN0eWxlU2hlZXQ7XG5cbmZ1bmN0aW9uIGludmFyaWFudChjb25kaXRpb24sIG1lc3NhZ2UpIHtcbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJTdHlsZVNoZWV0OiBcIiArIG1lc3NhZ2UgKyBcIi5cIik7XG4gIH1cbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuZmx1c2ggPSBmbHVzaDtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xuXG52YXIgX3N0eWxlc2hlZXRSZWdpc3RyeSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vc3R5bGVzaGVldC1yZWdpc3RyeVwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHNMb29zZShzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MucHJvdG90eXBlKTsgc3ViQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gc3ViQ2xhc3M7IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIHN0eWxlU2hlZXRSZWdpc3RyeSA9IG5ldyBfc3R5bGVzaGVldFJlZ2lzdHJ5W1wiZGVmYXVsdFwiXSgpO1xuXG52YXIgSlNYU3R5bGUgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKF9Db21wb25lbnQpIHtcbiAgX2luaGVyaXRzTG9vc2UoSlNYU3R5bGUsIF9Db21wb25lbnQpO1xuXG4gIGZ1bmN0aW9uIEpTWFN0eWxlKHByb3BzKSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgX3RoaXMgPSBfQ29tcG9uZW50LmNhbGwodGhpcywgcHJvcHMpIHx8IHRoaXM7XG4gICAgX3RoaXMucHJldlByb3BzID0ge307XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgSlNYU3R5bGUuZHluYW1pYyA9IGZ1bmN0aW9uIGR5bmFtaWMoaW5mbykge1xuICAgIHJldHVybiBpbmZvLm1hcChmdW5jdGlvbiAodGFnSW5mbykge1xuICAgICAgdmFyIGJhc2VJZCA9IHRhZ0luZm9bMF07XG4gICAgICB2YXIgcHJvcHMgPSB0YWdJbmZvWzFdO1xuICAgICAgcmV0dXJuIHN0eWxlU2hlZXRSZWdpc3RyeS5jb21wdXRlSWQoYmFzZUlkLCBwcm9wcyk7XG4gICAgfSkuam9pbignICcpO1xuICB9IC8vIHByb2JhYmx5IGZhc3RlciB0aGFuIFB1cmVDb21wb25lbnQgKHNoYWxsb3dFcXVhbClcbiAgO1xuXG4gIHZhciBfcHJvdG8gPSBKU1hTdHlsZS5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLnNob3VsZENvbXBvbmVudFVwZGF0ZSA9IGZ1bmN0aW9uIHNob3VsZENvbXBvbmVudFVwZGF0ZShvdGhlclByb3BzKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuaWQgIT09IG90aGVyUHJvcHMuaWQgfHwgLy8gV2UgZG8gdGhpcyBjaGVjayBiZWNhdXNlIGBkeW5hbWljYCBpcyBhbiBhcnJheSBvZiBzdHJpbmdzIG9yIHVuZGVmaW5lZC5cbiAgICAvLyBUaGVzZSBhcmUgdGhlIGNvbXB1dGVkIHZhbHVlcyBmb3IgZHluYW1pYyBzdHlsZXMuXG4gICAgU3RyaW5nKHRoaXMucHJvcHMuZHluYW1pYykgIT09IFN0cmluZyhvdGhlclByb3BzLmR5bmFtaWMpO1xuICB9O1xuXG4gIF9wcm90by5jb21wb25lbnRXaWxsVW5tb3VudCA9IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHN0eWxlU2hlZXRSZWdpc3RyeS5yZW1vdmUodGhpcy5wcm9wcyk7XG4gIH07XG5cbiAgX3Byb3RvLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAvLyBUaGlzIGlzIGEgd29ya2Fyb3VuZCB0byBtYWtlIHRoZSBzaWRlIGVmZmVjdCBhc3luYyBzYWZlIGluIHRoZSBcInJlbmRlclwiIHBoYXNlLlxuICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vemVpdC9zdHlsZWQtanN4L3B1bGwvNDg0XG4gICAgaWYgKHRoaXMuc2hvdWxkQ29tcG9uZW50VXBkYXRlKHRoaXMucHJldlByb3BzKSkge1xuICAgICAgLy8gVXBkYXRlc1xuICAgICAgaWYgKHRoaXMucHJldlByb3BzLmlkKSB7XG4gICAgICAgIHN0eWxlU2hlZXRSZWdpc3RyeS5yZW1vdmUodGhpcy5wcmV2UHJvcHMpO1xuICAgICAgfVxuXG4gICAgICBzdHlsZVNoZWV0UmVnaXN0cnkuYWRkKHRoaXMucHJvcHMpO1xuICAgICAgdGhpcy5wcmV2UHJvcHMgPSB0aGlzLnByb3BzO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9O1xuXG4gIHJldHVybiBKU1hTdHlsZTtcbn0oX3JlYWN0LkNvbXBvbmVudCk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gSlNYU3R5bGU7XG5cbmZ1bmN0aW9uIGZsdXNoKCkge1xuICB2YXIgY3NzUnVsZXMgPSBzdHlsZVNoZWV0UmVnaXN0cnkuY3NzUnVsZXMoKTtcbiAgc3R5bGVTaGVldFJlZ2lzdHJ5LmZsdXNoKCk7XG4gIHJldHVybiBjc3NSdWxlcztcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX3N0cmluZ0hhc2ggPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJzdHJpbmctaGFzaFwiKSk7XG5cbnZhciBfc3R5bGVzaGVldCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vbGliL3N0eWxlc2hlZXRcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxudmFyIHNhbml0aXplID0gZnVuY3Rpb24gc2FuaXRpemUocnVsZSkge1xuICByZXR1cm4gcnVsZS5yZXBsYWNlKC9cXC9zdHlsZS9naSwgJ1xcXFwvc3R5bGUnKTtcbn07XG5cbnZhciBTdHlsZVNoZWV0UmVnaXN0cnkgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBTdHlsZVNoZWV0UmVnaXN0cnkoX3RlbXApIHtcbiAgICB2YXIgX3JlZiA9IF90ZW1wID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wLFxuICAgICAgICBfcmVmJHN0eWxlU2hlZXQgPSBfcmVmLnN0eWxlU2hlZXQsXG4gICAgICAgIHN0eWxlU2hlZXQgPSBfcmVmJHN0eWxlU2hlZXQgPT09IHZvaWQgMCA/IG51bGwgOiBfcmVmJHN0eWxlU2hlZXQsXG4gICAgICAgIF9yZWYkb3B0aW1pemVGb3JTcGVlZCA9IF9yZWYub3B0aW1pemVGb3JTcGVlZCxcbiAgICAgICAgb3B0aW1pemVGb3JTcGVlZCA9IF9yZWYkb3B0aW1pemVGb3JTcGVlZCA9PT0gdm9pZCAwID8gZmFsc2UgOiBfcmVmJG9wdGltaXplRm9yU3BlZWQsXG4gICAgICAgIF9yZWYkaXNCcm93c2VyID0gX3JlZi5pc0Jyb3dzZXIsXG4gICAgICAgIGlzQnJvd3NlciA9IF9yZWYkaXNCcm93c2VyID09PSB2b2lkIDAgPyB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA6IF9yZWYkaXNCcm93c2VyO1xuXG4gICAgdGhpcy5fc2hlZXQgPSBzdHlsZVNoZWV0IHx8IG5ldyBfc3R5bGVzaGVldFtcImRlZmF1bHRcIl0oe1xuICAgICAgbmFtZTogJ3N0eWxlZC1qc3gnLFxuICAgICAgb3B0aW1pemVGb3JTcGVlZDogb3B0aW1pemVGb3JTcGVlZFxuICAgIH0pO1xuXG4gICAgdGhpcy5fc2hlZXQuaW5qZWN0KCk7XG5cbiAgICBpZiAoc3R5bGVTaGVldCAmJiB0eXBlb2Ygb3B0aW1pemVGb3JTcGVlZCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICB0aGlzLl9zaGVldC5zZXRPcHRpbWl6ZUZvclNwZWVkKG9wdGltaXplRm9yU3BlZWQpO1xuXG4gICAgICB0aGlzLl9vcHRpbWl6ZUZvclNwZWVkID0gdGhpcy5fc2hlZXQuaXNPcHRpbWl6ZUZvclNwZWVkKCk7XG4gICAgfVxuXG4gICAgdGhpcy5faXNCcm93c2VyID0gaXNCcm93c2VyO1xuICAgIHRoaXMuX2Zyb21TZXJ2ZXIgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5faW5kaWNlcyA9IHt9O1xuICAgIHRoaXMuX2luc3RhbmNlc0NvdW50cyA9IHt9O1xuICAgIHRoaXMuY29tcHV0ZUlkID0gdGhpcy5jcmVhdGVDb21wdXRlSWQoKTtcbiAgICB0aGlzLmNvbXB1dGVTZWxlY3RvciA9IHRoaXMuY3JlYXRlQ29tcHV0ZVNlbGVjdG9yKCk7XG4gIH1cblxuICB2YXIgX3Byb3RvID0gU3R5bGVTaGVldFJlZ2lzdHJ5LnByb3RvdHlwZTtcblxuICBfcHJvdG8uYWRkID0gZnVuY3Rpb24gYWRkKHByb3BzKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmICh1bmRlZmluZWQgPT09IHRoaXMuX29wdGltaXplRm9yU3BlZWQpIHtcbiAgICAgIHRoaXMuX29wdGltaXplRm9yU3BlZWQgPSBBcnJheS5pc0FycmF5KHByb3BzLmNoaWxkcmVuKTtcblxuICAgICAgdGhpcy5fc2hlZXQuc2V0T3B0aW1pemVGb3JTcGVlZCh0aGlzLl9vcHRpbWl6ZUZvclNwZWVkKTtcblxuICAgICAgdGhpcy5fb3B0aW1pemVGb3JTcGVlZCA9IHRoaXMuX3NoZWV0LmlzT3B0aW1pemVGb3JTcGVlZCgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9pc0Jyb3dzZXIgJiYgIXRoaXMuX2Zyb21TZXJ2ZXIpIHtcbiAgICAgIHRoaXMuX2Zyb21TZXJ2ZXIgPSB0aGlzLnNlbGVjdEZyb21TZXJ2ZXIoKTtcbiAgICAgIHRoaXMuX2luc3RhbmNlc0NvdW50cyA9IE9iamVjdC5rZXlzKHRoaXMuX2Zyb21TZXJ2ZXIpLnJlZHVjZShmdW5jdGlvbiAoYWNjLCB0YWdOYW1lKSB7XG4gICAgICAgIGFjY1t0YWdOYW1lXSA9IDA7XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LCB7fSk7XG4gICAgfVxuXG4gICAgdmFyIF90aGlzJGdldElkQW5kUnVsZXMgPSB0aGlzLmdldElkQW5kUnVsZXMocHJvcHMpLFxuICAgICAgICBzdHlsZUlkID0gX3RoaXMkZ2V0SWRBbmRSdWxlcy5zdHlsZUlkLFxuICAgICAgICBydWxlcyA9IF90aGlzJGdldElkQW5kUnVsZXMucnVsZXM7IC8vIERlZHVwaW5nOiBqdXN0IGluY3JlYXNlIHRoZSBpbnN0YW5jZXMgY291bnQuXG5cblxuICAgIGlmIChzdHlsZUlkIGluIHRoaXMuX2luc3RhbmNlc0NvdW50cykge1xuICAgICAgdGhpcy5faW5zdGFuY2VzQ291bnRzW3N0eWxlSWRdICs9IDE7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGluZGljZXMgPSBydWxlcy5tYXAoZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgIHJldHVybiBfdGhpcy5fc2hlZXQuaW5zZXJ0UnVsZShydWxlKTtcbiAgICB9KSAvLyBGaWx0ZXIgb3V0IGludmFsaWQgcnVsZXNcbiAgICAuZmlsdGVyKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgcmV0dXJuIGluZGV4ICE9PSAtMTtcbiAgICB9KTtcbiAgICB0aGlzLl9pbmRpY2VzW3N0eWxlSWRdID0gaW5kaWNlcztcbiAgICB0aGlzLl9pbnN0YW5jZXNDb3VudHNbc3R5bGVJZF0gPSAxO1xuICB9O1xuXG4gIF9wcm90by5yZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUocHJvcHMpIHtcbiAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgIHZhciBfdGhpcyRnZXRJZEFuZFJ1bGVzMiA9IHRoaXMuZ2V0SWRBbmRSdWxlcyhwcm9wcyksXG4gICAgICAgIHN0eWxlSWQgPSBfdGhpcyRnZXRJZEFuZFJ1bGVzMi5zdHlsZUlkO1xuXG4gICAgaW52YXJpYW50KHN0eWxlSWQgaW4gdGhpcy5faW5zdGFuY2VzQ291bnRzLCBcInN0eWxlSWQ6IGBcIiArIHN0eWxlSWQgKyBcImAgbm90IGZvdW5kXCIpO1xuICAgIHRoaXMuX2luc3RhbmNlc0NvdW50c1tzdHlsZUlkXSAtPSAxO1xuXG4gICAgaWYgKHRoaXMuX2luc3RhbmNlc0NvdW50c1tzdHlsZUlkXSA8IDEpIHtcbiAgICAgIHZhciB0YWdGcm9tU2VydmVyID0gdGhpcy5fZnJvbVNlcnZlciAmJiB0aGlzLl9mcm9tU2VydmVyW3N0eWxlSWRdO1xuXG4gICAgICBpZiAodGFnRnJvbVNlcnZlcikge1xuICAgICAgICB0YWdGcm9tU2VydmVyLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGFnRnJvbVNlcnZlcik7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9mcm9tU2VydmVyW3N0eWxlSWRdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5faW5kaWNlc1tzdHlsZUlkXS5mb3JFYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgIHJldHVybiBfdGhpczIuX3NoZWV0LmRlbGV0ZVJ1bGUoaW5kZXgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZWxldGUgdGhpcy5faW5kaWNlc1tzdHlsZUlkXTtcbiAgICAgIH1cblxuICAgICAgZGVsZXRlIHRoaXMuX2luc3RhbmNlc0NvdW50c1tzdHlsZUlkXTtcbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZShwcm9wcywgbmV4dFByb3BzKSB7XG4gICAgdGhpcy5hZGQobmV4dFByb3BzKTtcbiAgICB0aGlzLnJlbW92ZShwcm9wcyk7XG4gIH07XG5cbiAgX3Byb3RvLmZsdXNoID0gZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgdGhpcy5fc2hlZXQuZmx1c2goKTtcblxuICAgIHRoaXMuX3NoZWV0LmluamVjdCgpO1xuXG4gICAgdGhpcy5fZnJvbVNlcnZlciA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9pbmRpY2VzID0ge307XG4gICAgdGhpcy5faW5zdGFuY2VzQ291bnRzID0ge307XG4gICAgdGhpcy5jb21wdXRlSWQgPSB0aGlzLmNyZWF0ZUNvbXB1dGVJZCgpO1xuICAgIHRoaXMuY29tcHV0ZVNlbGVjdG9yID0gdGhpcy5jcmVhdGVDb21wdXRlU2VsZWN0b3IoKTtcbiAgfTtcblxuICBfcHJvdG8uY3NzUnVsZXMgPSBmdW5jdGlvbiBjc3NSdWxlcygpIHtcbiAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgIHZhciBmcm9tU2VydmVyID0gdGhpcy5fZnJvbVNlcnZlciA/IE9iamVjdC5rZXlzKHRoaXMuX2Zyb21TZXJ2ZXIpLm1hcChmdW5jdGlvbiAoc3R5bGVJZCkge1xuICAgICAgcmV0dXJuIFtzdHlsZUlkLCBfdGhpczMuX2Zyb21TZXJ2ZXJbc3R5bGVJZF1dO1xuICAgIH0pIDogW107XG5cbiAgICB2YXIgY3NzUnVsZXMgPSB0aGlzLl9zaGVldC5jc3NSdWxlcygpO1xuXG4gICAgcmV0dXJuIGZyb21TZXJ2ZXIuY29uY2F0KE9iamVjdC5rZXlzKHRoaXMuX2luZGljZXMpLm1hcChmdW5jdGlvbiAoc3R5bGVJZCkge1xuICAgICAgcmV0dXJuIFtzdHlsZUlkLCBfdGhpczMuX2luZGljZXNbc3R5bGVJZF0ubWFwKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICByZXR1cm4gY3NzUnVsZXNbaW5kZXhdLmNzc1RleHQ7XG4gICAgICB9KS5qb2luKF90aGlzMy5fb3B0aW1pemVGb3JTcGVlZCA/ICcnIDogJ1xcbicpXTtcbiAgICB9KSAvLyBmaWx0ZXIgb3V0IGVtcHR5IHJ1bGVzXG4gICAgLmZpbHRlcihmdW5jdGlvbiAocnVsZSkge1xuICAgICAgcmV0dXJuIEJvb2xlYW4ocnVsZVsxXSk7XG4gICAgfSkpO1xuICB9XG4gIC8qKlxuICAgKiBjcmVhdGVDb21wdXRlSWRcbiAgICpcbiAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRvIGNvbXB1dGUgYW5kIG1lbW9pemUgYSBqc3ggaWQgZnJvbSBhIGJhc2VkSWQgYW5kIG9wdGlvbmFsbHkgcHJvcHMuXG4gICAqL1xuICA7XG5cbiAgX3Byb3RvLmNyZWF0ZUNvbXB1dGVJZCA9IGZ1bmN0aW9uIGNyZWF0ZUNvbXB1dGVJZCgpIHtcbiAgICB2YXIgY2FjaGUgPSB7fTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGJhc2VJZCwgcHJvcHMpIHtcbiAgICAgIGlmICghcHJvcHMpIHtcbiAgICAgICAgcmV0dXJuIFwianN4LVwiICsgYmFzZUlkO1xuICAgICAgfVxuXG4gICAgICB2YXIgcHJvcHNUb1N0cmluZyA9IFN0cmluZyhwcm9wcyk7XG4gICAgICB2YXIga2V5ID0gYmFzZUlkICsgcHJvcHNUb1N0cmluZzsgLy8gcmV0dXJuIGBqc3gtJHtoYXNoU3RyaW5nKGAke2Jhc2VJZH0tJHtwcm9wc1RvU3RyaW5nfWApfWBcblxuICAgICAgaWYgKCFjYWNoZVtrZXldKSB7XG4gICAgICAgIGNhY2hlW2tleV0gPSBcImpzeC1cIiArICgwLCBfc3RyaW5nSGFzaFtcImRlZmF1bHRcIl0pKGJhc2VJZCArIFwiLVwiICsgcHJvcHNUb1N0cmluZyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjYWNoZVtrZXldO1xuICAgIH07XG4gIH1cbiAgLyoqXG4gICAqIGNyZWF0ZUNvbXB1dGVTZWxlY3RvclxuICAgKlxuICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdG8gY29tcHV0ZSBhbmQgbWVtb2l6ZSBkeW5hbWljIHNlbGVjdG9ycy5cbiAgICovXG4gIDtcblxuICBfcHJvdG8uY3JlYXRlQ29tcHV0ZVNlbGVjdG9yID0gZnVuY3Rpb24gY3JlYXRlQ29tcHV0ZVNlbGVjdG9yKHNlbGVjdG9QbGFjZWhvbGRlclJlZ2V4cCkge1xuICAgIGlmIChzZWxlY3RvUGxhY2Vob2xkZXJSZWdleHAgPT09IHZvaWQgMCkge1xuICAgICAgc2VsZWN0b1BsYWNlaG9sZGVyUmVnZXhwID0gL19fanN4LXN0eWxlLWR5bmFtaWMtc2VsZWN0b3IvZztcbiAgICB9XG5cbiAgICB2YXIgY2FjaGUgPSB7fTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGlkLCBjc3MpIHtcbiAgICAgIC8vIFNhbml0aXplIFNTUi1lZCBDU1MuXG4gICAgICAvLyBDbGllbnQgc2lkZSBjb2RlIGRvZXNuJ3QgbmVlZCB0byBiZSBzYW5pdGl6ZWQgc2luY2Ugd2UgdXNlXG4gICAgICAvLyBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSAoZGV2KSBhbmQgdGhlIENTU09NIGFwaSBzaGVldC5pbnNlcnRSdWxlIChwcm9kKS5cbiAgICAgIGlmICghdGhpcy5faXNCcm93c2VyKSB7XG4gICAgICAgIGNzcyA9IHNhbml0aXplKGNzcyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBpZGNzcyA9IGlkICsgY3NzO1xuXG4gICAgICBpZiAoIWNhY2hlW2lkY3NzXSkge1xuICAgICAgICBjYWNoZVtpZGNzc10gPSBjc3MucmVwbGFjZShzZWxlY3RvUGxhY2Vob2xkZXJSZWdleHAsIGlkKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNhY2hlW2lkY3NzXTtcbiAgICB9O1xuICB9O1xuXG4gIF9wcm90by5nZXRJZEFuZFJ1bGVzID0gZnVuY3Rpb24gZ2V0SWRBbmRSdWxlcyhwcm9wcykge1xuICAgIHZhciBfdGhpczQgPSB0aGlzO1xuXG4gICAgdmFyIGNzcyA9IHByb3BzLmNoaWxkcmVuLFxuICAgICAgICBkeW5hbWljID0gcHJvcHMuZHluYW1pYyxcbiAgICAgICAgaWQgPSBwcm9wcy5pZDtcblxuICAgIGlmIChkeW5hbWljKSB7XG4gICAgICB2YXIgc3R5bGVJZCA9IHRoaXMuY29tcHV0ZUlkKGlkLCBkeW5hbWljKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN0eWxlSWQ6IHN0eWxlSWQsXG4gICAgICAgIHJ1bGVzOiBBcnJheS5pc0FycmF5KGNzcykgPyBjc3MubWFwKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzNC5jb21wdXRlU2VsZWN0b3Ioc3R5bGVJZCwgcnVsZSk7XG4gICAgICAgIH0pIDogW3RoaXMuY29tcHV0ZVNlbGVjdG9yKHN0eWxlSWQsIGNzcyldXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBzdHlsZUlkOiB0aGlzLmNvbXB1dGVJZChpZCksXG4gICAgICBydWxlczogQXJyYXkuaXNBcnJheShjc3MpID8gY3NzIDogW2Nzc11cbiAgICB9O1xuICB9XG4gIC8qKlxuICAgKiBzZWxlY3RGcm9tU2VydmVyXG4gICAqXG4gICAqIENvbGxlY3RzIHN0eWxlIHRhZ3MgZnJvbSB0aGUgZG9jdW1lbnQgd2l0aCBpZCBfX2pzeC1YWFhcbiAgICovXG4gIDtcblxuICBfcHJvdG8uc2VsZWN0RnJvbVNlcnZlciA9IGZ1bmN0aW9uIHNlbGVjdEZyb21TZXJ2ZXIoKSB7XG4gICAgdmFyIGVsZW1lbnRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2lkXj1cIl9fanN4LVwiXScpKTtcbiAgICByZXR1cm4gZWxlbWVudHMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIGVsZW1lbnQpIHtcbiAgICAgIHZhciBpZCA9IGVsZW1lbnQuaWQuc2xpY2UoMik7XG4gICAgICBhY2NbaWRdID0gZWxlbWVudDtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuICB9O1xuXG4gIHJldHVybiBTdHlsZVNoZWV0UmVnaXN0cnk7XG59KCk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gU3R5bGVTaGVldFJlZ2lzdHJ5O1xuXG5mdW5jdGlvbiBpbnZhcmlhbnQoY29uZGl0aW9uLCBtZXNzYWdlKSB7XG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiU3R5bGVTaGVldFJlZ2lzdHJ5OiBcIiArIG1lc3NhZ2UgKyBcIi5cIik7XG4gIH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZGlzdC9zdHlsZScpXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9yaWdpbmFsTW9kdWxlKSB7XG5cdGlmICghb3JpZ2luYWxNb2R1bGUud2VicGFja1BvbHlmaWxsKSB7XG5cdFx0dmFyIG1vZHVsZSA9IE9iamVjdC5jcmVhdGUob3JpZ2luYWxNb2R1bGUpO1xuXHRcdC8vIG1vZHVsZS5wYXJlbnQgPSB1bmRlZmluZWQgYnkgZGVmYXVsdFxuXHRcdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImxvYWRlZFwiLCB7XG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5sO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwiaWRcIiwge1xuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBtb2R1bGUuaTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImV4cG9ydHNcIiwge1xuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZVxuXHRcdH0pO1xuXHRcdG1vZHVsZS53ZWJwYWNrUG9seWZpbGwgPSAxO1xuXHR9XG5cdHJldHVybiBtb2R1bGU7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtb2R1bGUpIHtcblx0aWYgKCFtb2R1bGUud2VicGFja1BvbHlmaWxsKSB7XG5cdFx0bW9kdWxlLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKCkge307XG5cdFx0bW9kdWxlLnBhdGhzID0gW107XG5cdFx0Ly8gbW9kdWxlLnBhcmVudCA9IHVuZGVmaW5lZCBieSBkZWZhdWx0XG5cdFx0aWYgKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwibG9hZGVkXCIsIHtcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmw7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJpZFwiLCB7XG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdG1vZHVsZS53ZWJwYWNrUG9seWZpbGwgPSAxO1xuXHR9XG5cdHJldHVybiBtb2R1bGU7XG59O1xuIiwiaW1wb3J0IEJhbmRKUyBmcm9tICcuLi9iYW5kLmpzL2Rpc3QvYmFuZCc7XHJcbmltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcblxyXG5jbGFzcyBBdWRpbyBleHRlbmRzIENvbXBvbmVudCB7XHJcblx0Y29uc3RydWN0b3IocHJvcHMpIHtcclxuXHRcdHN1cGVyKHByb3BzKTtcclxuXHRcdHRoaXMuc3RhdGUgPSB7IHBsYXllcjogJycgfTtcclxuXHR9XHJcblx0cGxheUhhbmRsZXIgPSAoKSA9PiB7XHJcblx0XHRpZiAodHlwZW9mIHRoaXMuc3RhdGUucGxheWVyID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0Y29uc29sZS5sb2codGhpcy5zdGF0ZS5wbGF5ZXIpO1xyXG5cdFx0XHR0aGlzLnN0YXRlLnBsYXllci5zdG9wKCk7XHJcblx0XHR9XHJcblx0XHRsZXQgY29uZHVjdG9yID0gbmV3IEJhbmRKUygpO1xyXG5cdFx0bGV0IHNlY3Rpb25zUHJvcHMgPSBbXTtcclxuXHRcdHRoaXMucHJvcHMuYW5hbHlzaXMuc2VjdGlvbnMuZm9yRWFjaCgoc2VjdGlvbikgPT4ge1xyXG5cdFx0XHRzZWN0aW9uc1Byb3BzLnB1c2goW3NlY3Rpb24uZHVyYXRpb24gKiAxMDAwLCBzZWN0aW9uLnRlbXBvXSk7XHJcblx0XHR9KTtcclxuXHRcdGNvbnNvbGUubG9nKHNlY3Rpb25zUHJvcHMpO1xyXG5cdFx0Y29uZHVjdG9yLnNldFRpbWVTaWduYXR1cmUoNCwgNCk7XHJcblx0XHRjb25kdWN0b3Iuc2V0VGVtcG8oc2VjdGlvbnNQcm9wc1swXVsxXSk7XHJcblx0XHRsZXQgcGlhbm8gPSBjb25kdWN0b3IuY3JlYXRlSW5zdHJ1bWVudCgnc2luZScpO1xyXG5cdFx0cGlhbm8ubm90ZSgncXVhcnRlcicsICdHMycpO1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7IHBsYXllcjogY29uZHVjdG9yLmZpbmlzaCgpIH0sICgpID0+IHtcclxuXHRcdFx0Y29uc29sZS5sb2codGhpcy5zdGF0ZS5wbGF5ZXIpO1xyXG5cdFx0XHR0aGlzLnN0YXRlLnBsYXllci5sb29wKHRydWUpO1xyXG5cdFx0XHRyaHl0aG1UaW1lcihzZWN0aW9uc1Byb3BzWzBdWzBdKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGZ1bmN0aW9uIHJoeXRobVRpbWVyKHRpbWUpIHtcclxuXHRcdFx0QXVkaW8uc3RhdGUucGxheWVyLnBsYXkoKTtcclxuXHRcdFx0c2VjdGlvbnNQcm9wcy5zaGlmdCgpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRBdWRpby5zdGF0ZS5wbGF5ZXIuc3RvcCgpO1xyXG5cdFx0XHRcdGlmIChzZWN0aW9uc1Byb3BzLmxlbmd0aCAhPSAwKSB7XHJcblx0XHRcdFx0XHRjb25kdWN0b3Iuc2V0VGVtcG8oc2VjdGlvbnNQcm9wc1swXVsxXSk7XHJcblx0XHRcdFx0XHRBdWRpby5zZXRTdGF0ZSh7IHBsYXllcjogY29uZHVjdG9yLmZpbmlzaCgpIH0pO1xyXG5cdFx0XHRcdFx0QXVkaW8uc3RhdGUucGxheWVyLmxvb3AodHJ1ZSk7XHJcblx0XHRcdFx0XHRyaHl0aG1UaW1lcihzZWN0aW9uc1Byb3BzWzBdWzBdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sIHRpbWUpO1xyXG5cdFx0fVxyXG5cdH07XHJcblx0cmVuZGVyKCkge1xyXG5cdFx0cmV0dXJuIDxwIG9uQ2xpY2s9e3RoaXMucGxheUhhbmRsZXJ9PmNsaWNrIE1lPC9wPjtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEF1ZGlvO1xyXG4iLCJpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xyXG5pbXBvcnQgQXVkaW8gZnJvbSAnLi9BdWRpbyc7XHJcbmNvbnN0IFRyYWNrc1Jlc3VsdHMgPSBwcm9wcyA9PiB7XHJcblx0Y29uc3QgdHJhY2tSZWYgPSBSZWFjdC5jcmVhdGVSZWYoKTtcclxuXHRsZXQgYW5hbHlzaXM7XHJcblx0bGV0IFtzYSwgc2FzXSA9IFJlYWN0LnVzZVN0YXRlKGFuYWx5c2lzKTtcclxuXHJcblx0bGV0IGdldEFuYWx5c2lzID0gZSA9PiB7XHJcblx0XHRheGlvc1xyXG5cdFx0XHQuZ2V0KCdodHRwczovL2FwaS5zcG90aWZ5LmNvbS92MS9hdWRpby1hbmFseXNpcy8nICsgZS50YXJnZXQuaWQsIHtcclxuXHRcdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0XHRBdXRob3JpemF0aW9uOiBwcm9wcy5hdXRob3JpemF0aW9uXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0XHQudGhlbihkYXRhID0+IHtcclxuXHRcdFx0XHRzYXMoZGF0YS5kYXRhKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhhbmFseXNpcyk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5jYXRjaChlcnIgPT4ge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdHJldHVybiAoXHJcblx0XHQ8dWwgcmVmPXt0cmFja1JlZn0+XHJcblx0XHRcdHtwcm9wcy50cmFja3MubWFwKHRyYWNrID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdFx0PGxpIGlkPXt0cmFjay5pZH0ga2V5PXt0cmFjay5pZH0gb25DbGljaz17Z2V0QW5hbHlzaXN9PlxyXG5cdFx0XHRcdFx0XHR7dHJhY2submFtZX0gLSB7dHJhY2suYXJ0aXN0c1swXS5uYW1lfSAoe3RyYWNrLnBvcHVsYXJpdHl9KVxyXG5cdFx0XHRcdFx0PC9saT5cclxuXHRcdFx0XHQpO1xyXG5cdFx0XHR9KX1cclxuXHRcdFx0e31cclxuXHRcdFx0PEF1ZGlvIGFuYWx5c2lzPXtzYX0+PC9BdWRpbz5cclxuXHRcdDwvdWw+XHJcblx0KTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRyYWNrc1Jlc3VsdHM7XHJcbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBSaHl0aG0gZnJvbSAnLi9yaHl0aG0nO1xyXG5cclxuY2xhc3MgRGVmYXVsdCBleHRlbmRzIENvbXBvbmVudCB7XHJcblx0cmVuZGVyKCkge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J2FwcCc+XHJcblx0XHRcdFx0PGgxPlJoeXRobSBEZXRlY3RvcjwvaDE+XHJcblx0XHRcdFx0PGgyPlNlbGVjdCB5b3VyIHNvbmcgYXQgdGhlIHNlYXJjaCBiYXIgYmVsb3c8L2gyPlxyXG5cdFx0XHRcdDxSaHl0aG0+PC9SaHl0aG0+XHJcblx0XHRcdFx0ey8qXHQ8aW5wdXQgdHlwZT0ndGV4dCcgLz4qL31cclxuXHRcdFx0XHQ8c3R5bGUgZ2xvYmFsIGpzeD5cclxuXHRcdFx0XHRcdHtgXHJcblx0XHRcdFx0XHRcdGJvZHksXHJcblx0XHRcdFx0XHRcdGh0bWwsXHJcblx0XHRcdFx0XHRcdCNyb290IHtcclxuXHRcdFx0XHRcdFx0XHRtYXJnaW46IDA7XHJcblx0XHRcdFx0XHRcdFx0aGVpZ2h0OiAxMDAlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdCo6YWN0aXZlLFxyXG5cdFx0XHRcdFx0XHQqOmZvY3VzIHtcclxuXHRcdFx0XHRcdFx0XHRvdXRsaW5lLXN0eWxlOiBub25lO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdCoge1xyXG5cdFx0XHRcdFx0XHRcdGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0I19fbmV4dCB7XHJcblx0XHRcdFx0XHRcdFx0ZGlzcGxheTogZ3JpZDtcclxuXHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsICMxNDFlMzAsICMyNDNiNTUpO1xyXG5cdFx0XHRcdFx0XHRcdGhlaWdodDogMTAwJTtcclxuXHRcdFx0XHRcdFx0XHR3aWR0aDogMTAwJTtcclxuXHRcdFx0XHRcdFx0XHRqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XHJcblx0XHRcdFx0XHRcdFx0YWxpZ24taXRlbXM6IGNlbnRlcjtcclxuXHRcdFx0XHRcdFx0XHRtYXgtaGVpZ2h0OiAxMDAlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRgfVxyXG5cdFx0XHRcdDwvc3R5bGU+XHJcblx0XHRcdFx0PHN0eWxlIGpzeD57YFxyXG5cdFx0XHRcdFx0aDEge1xyXG5cdFx0XHRcdFx0XHRmb250LXNpemU6IDNyZW07XHJcblx0XHRcdFx0XHRcdGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byByaWdodCwgI2Y3OWQwMCwgIzY0ZjM4Yyk7XHJcblx0XHRcdFx0XHRcdGJhY2tncm91bmQtY2xpcDogdGV4dDtcclxuXHRcdFx0XHRcdFx0LXdlYmtpdC10ZXh0LWZpbGwtY29sb3I6IHRyYW5zcGFyZW50O1xyXG5cdFx0XHRcdFx0XHR0ZXh0LXNoYWRvdzogMHB4IDBweCA1MHB4ICMxZmZjNDQyYTtcclxuXHRcdFx0XHRcdFx0cG9zaXRpb246IHJlbGF0aXZlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdGB9PC9zdHlsZT5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGVmYXVsdDtcclxuIiwiaW1wb3J0IFJlYWN0LCB7IEZyYWdtYW50LCBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XHJcbmltcG9ydCBUcmFja3NSZXN1bHRzIGZyb20gJy4vVHJhY2tzUmVzdWx0cyc7XHJcblxyXG5jbGFzcyBSaHl0aG0gZXh0ZW5kcyBDb21wb25lbnQge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0c3VwZXIoKTtcclxuXHRcdHRoaXMuc3RhdGUgPSB7XHJcblx0XHRcdHRva2VuOiBudWxsLFxyXG5cdFx0XHR0cmFja19saXN0OiBbXSxcclxuXHRcdFx0cXVlcnk6ICcnXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0Y29tcG9uZW50RGlkTW91bnQoKSB7XHJcblx0XHRjb25zdCBoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2hcclxuXHRcdFx0LnN1YnN0cmluZygxKVxyXG5cdFx0XHQuc3BsaXQoJyYnKVxyXG5cdFx0XHQucmVkdWNlKChpbml0aWFsLCBpdGVtKSA9PiB7XHJcblx0XHRcdFx0aWYgKGl0ZW0pIHtcclxuXHRcdFx0XHRcdHZhciBwYXJ0cyA9IGl0ZW0uc3BsaXQoJz0nKTtcclxuXHRcdFx0XHRcdGluaXRpYWxbcGFydHNbMF1dID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzFdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGluaXRpYWw7XHJcblx0XHRcdH0sIHt9KTtcclxuXHRcdHRoaXMuc2V0U3RhdGUoeyB0b2tlbjogaGFzaC5hY2Nlc3NfdG9rZW4sIHRva2VuX3R5cGU6IGhhc2gudG9rZW5fdHlwZSB9KTtcclxuXHR9XHJcblxyXG5cdGdldFRyYWNrcyA9ICgpID0+IHtcclxuXHRcdGF4aW9zXHJcblx0XHRcdC5nZXQoXHJcblx0XHRcdFx0YGh0dHBzOi8vYXBpLnNwb3RpZnkuY29tL3YxL3NlYXJjaD9xPSR7dGhpcy5zdGF0ZS5xdWVyeX0mdHlwZT10cmFjayZsaW1pdD01YCxcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0XHRcdEF1dGhvcml6YXRpb246IGAke3RoaXMuc3RhdGUudG9rZW5fdHlwZX0gJHt0aGlzLnN0YXRlLnRva2VufWBcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdClcclxuXHRcdFx0LnRoZW4oZGF0YSA9PiB7XHJcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IHRyYWNrX2xpc3Q6IGRhdGEuZGF0YS50cmFja3MuaXRlbXMgfSk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5jYXRjaChlcnIgPT4ge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdGNoYW5nZUhhbmRsZXIgPSAoKSA9PiB7XHJcblx0XHR0aGlzLnNldFN0YXRlKHsgcXVlcnk6IHRoaXMuc2VhcmNoLnZhbHVlIH0sICgpID0+IHtcclxuXHRcdFx0aWYgKHRoaXMuc3RhdGUucXVlcnkgJiYgdGhpcy5zdGF0ZS5xdWVyeS5sZW5ndGggPiAxKSB7XHJcblx0XHRcdFx0dGhpcy5nZXRUcmFja3MoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgdHJhY2tfbGlzdDogW10gfSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdHJlbmRlcigpIHtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDw+XHJcblx0XHRcdFx0eyF0aGlzLnN0YXRlLnRva2VuICYmIChcclxuXHRcdFx0XHRcdDxidXR0b24+XHJcblx0XHRcdFx0XHRcdDxhIGhyZWY9J2h0dHBzOi8vYWNjb3VudHMuc3BvdGlmeS5jb20vYXV0aG9yaXplP2NsaWVudF9pZD01OGI5YzQwNjNjOTA0Y2RhODdhZjgwMTg2YTczMmYwMSZyZWRpcmVjdF91cmk9aHR0cDolMkYlMkZsb2NhbGhvc3Q6MzAwMCZyZXNwb25zZV90eXBlPXRva2VuJz5cclxuXHRcdFx0XHRcdFx0XHRMb2dpbiBXaXRoIFNwb3RpZnlcclxuXHRcdFx0XHRcdFx0PC9hPlxyXG5cdFx0XHRcdFx0PC9idXR0b24+XHJcblx0XHRcdFx0KX1cclxuXHRcdFx0XHR7dGhpcy5zdGF0ZS50b2tlbiAmJiAoXHJcblx0XHRcdFx0XHQ8PlxyXG5cdFx0XHRcdFx0XHQ8aW5wdXRcclxuXHRcdFx0XHRcdFx0XHRyZWY9e2lucHV0ID0+ICh0aGlzLnNlYXJjaCA9IGlucHV0KX1cclxuXHRcdFx0XHRcdFx0XHRvbkNoYW5nZT17dGhpcy5jaGFuZ2VIYW5kbGVyfVxyXG5cdFx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdFx0XHQ8VHJhY2tzUmVzdWx0c1xyXG5cdFx0XHRcdFx0XHRcdGF1dGhvcml6YXRpb249e2Ake3RoaXMuc3RhdGUudG9rZW5fdHlwZX0gJHt0aGlzLnN0YXRlLnRva2VufWB9XHJcblx0XHRcdFx0XHRcdFx0dHJhY2tzPXt0aGlzLnN0YXRlLnRyYWNrX2xpc3R9XHJcblx0XHRcdFx0XHRcdD48L1RyYWNrc1Jlc3VsdHM+XHJcblx0XHRcdFx0XHQ8Lz5cclxuXHRcdFx0XHQpfVxyXG5cdFx0XHQ8Lz5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSaHl0aG07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZGxsX2VjN2Q5YzAyNDliMmVmNTJiNzRjOyJdLCJzb3VyY2VSb290IjoiIn0=