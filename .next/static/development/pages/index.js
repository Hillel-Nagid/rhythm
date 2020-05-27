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
      });

      console.log(_this.state.player);

      _this.state.player.loop(true);

      rhythmTimer(sectionsProps[0][0]);

      function rhythmTimer(time) {
        var _this2 = this;

        this.state.player.play();
        sectionsProps.shift();
        setTimeout(function () {
          _this2.state.player.stop();

          if (sectionsProps.length != 0) {
            conductor.setTempo(sectionsProps[0][1]);

            _this2.setState({
              player: conductor.finish()
            });

            _this2.state.player.loop(true);

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
          lineNumber: 43,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9iYW5kLmpzL2Rpc3QvYmFuZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vYXJyYXlMaWtlVG9BcnJheS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vYXJyYXlXaXRoSG9sZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2Fzc2VydFRoaXNJbml0aWFsaXplZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vY2xhc3NDYWxsQ2hlY2suanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2NyZWF0ZUNsYXNzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9kZWZpbmVQcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vZ2V0UHJvdG90eXBlT2YuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2luaGVyaXRzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9pdGVyYWJsZVRvQXJyYXlMaW1pdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vbm9uSXRlcmFibGVSZXN0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9zZXRQcm90b3R5cGVPZi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vc2xpY2VkVG9BcnJheS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vdHlwZW9mLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9hZGFwdGVycy94aHIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9heGlvcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsVG9rZW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvaXNDYW5jZWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0F4aW9zLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9JbnRlcmNlcHRvck1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2J1aWxkRnVsbFBhdGguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2NyZWF0ZUVycm9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9kaXNwYXRjaFJlcXVlc3QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2VuaGFuY2VFcnJvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvbWVyZ2VDb25maWcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL3NldHRsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvdHJhbnNmb3JtRGF0YS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2RlZmF1bHRzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9idWlsZFVSTC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29tYmluZVVSTHMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2Nvb2tpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvcGFyc2VIZWFkZXJzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9zcHJlYWQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWNsaWVudC1wYWdlcy1sb2FkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL3JlYWN0L2luZGV4LmpzIGZyb20gZGxsLXJlZmVyZW5jZSBkbGxfZWM3ZDljMDI0OWIyZWY1MmI3NGMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0cmluZy1oYXNoL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHlsZWQtanN4L2Rpc3QvbGliL3N0eWxlc2hlZXQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0eWxlZC1qc3gvZGlzdC9zdHlsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3R5bGVkLWpzeC9kaXN0L3N0eWxlc2hlZXQtcmVnaXN0cnkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0eWxlZC1qc3gvc3R5bGUuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2hhcm1vbnktbW9kdWxlLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vLy4vcGFnZXMvQXVkaW8uanMiLCJ3ZWJwYWNrOi8vLy4vcGFnZXMvVHJhY2tzUmVzdWx0cy5qcyIsIndlYnBhY2s6Ly8vLi9wYWdlcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9wYWdlcy9yaHl0aG0uanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZGxsX2VjN2Q5YzAyNDliMmVmNTJiNzRjXCIiXSwibmFtZXMiOlsiZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJkZWZpbmUiLCJ0IiwibiIsInIiLCJzIiwibyIsInUiLCJhIiwicmVxdWlyZSIsImkiLCJFcnJvciIsImYiLCJjYWxsIiwibGVuZ3RoIiwiX2RlcmVxXyIsImRlZmluaXRpb24iLCJ3aW5kb3ciLCJBdWRpb0NvbnRleHQiLCJ3ZWJraXRBdWRpb0NvbnRleHQiLCJDb25kdWN0b3IiLCJwYWNrcyIsImluc3RydW1lbnQiLCJyaHl0aG0iLCJ0dW5pbmciLCJjb25kdWN0b3IiLCJwbGF5ZXIiLCJub29wIiwic2lnbmF0dXJlVG9Ob3RlTGVuZ3RoUmF0aW8iLCJwaXRjaGVzIiwibm90ZXMiLCJhdWRpb0NvbnRleHQiLCJtYXN0ZXJWb2x1bWVMZXZlbCIsIm1hc3RlclZvbHVtZSIsImNyZWF0ZUdhaW4iLCJjb25uZWN0IiwiZGVzdGluYXRpb24iLCJiZWF0c1BlckJhciIsIm5vdGVHZXRzQmVhdCIsInRlbXBvIiwiaW5zdHJ1bWVudHMiLCJ0b3RhbER1cmF0aW9uIiwiY3VycmVudFNlY29uZHMiLCJwZXJjZW50YWdlQ29tcGxldGUiLCJub3RlQnVmZmVyTGVuZ3RoIiwib25UaWNrZXJDYWxsYmFjayIsIm9uRmluaXNoZWRDYWxsYmFjayIsIm9uRHVyYXRpb25DaGFuZ2VDYWxsYmFjayIsImxvYWQiLCJqc29uIiwiZGVzdHJveSIsInRpbWVTaWduYXR1cmUiLCJzZXRUaW1lU2lnbmF0dXJlIiwic2V0VGVtcG8iLCJpbnN0cnVtZW50TGlzdCIsImhhc093blByb3BlcnR5IiwiY3JlYXRlSW5zdHJ1bWVudCIsIm5hbWUiLCJwYWNrIiwiaW5zdCIsImluZGV4Iiwibm90ZSIsIm5vdGVQYXJ0cyIsInNwbGl0IiwicmVzdCIsInR5cGUiLCJwaXRjaCIsInRpZSIsImZpbmlzaCIsIkluc3RydW1lbnQiLCJwdXNoIiwiUGxheWVyIiwic2V0TWFzdGVyVm9sdW1lIiwidm9sdW1lIiwiZ2FpbiIsInNldFZhbHVlQXRUaW1lIiwiY3VycmVudFRpbWUiLCJnZXRUb3RhbFNlY29uZHMiLCJNYXRoIiwicm91bmQiLCJzZXRUaWNrZXJDYWxsYmFjayIsImNiIiwidG9wIiwiYm90dG9tIiwicmVzZXRUZW1wbyIsInNldE9uRmluaXNoZWRDYWxsYmFjayIsInNldE9uRHVyYXRpb25DaGFuZ2VDYWxsYmFjayIsInNldE5vdGVCdWZmZXJMZW5ndGgiLCJsZW4iLCJsb2FkUGFjayIsImRhdGEiLCJpbmRleE9mIiwiTm9pc2VzSW5zdHJ1bWVudFBhY2siLCJ0eXBlcyIsImNyZWF0ZU5vdGUiLCJjcmVhdGVXaGl0ZU5vaXNlIiwiY3JlYXRlUGlua05vaXNlIiwiY3JlYXRlQnJvd25pYW5Ob2lzZSIsImJ1ZmZlclNpemUiLCJzYW1wbGVSYXRlIiwibm9pc2VCdWZmZXIiLCJjcmVhdGVCdWZmZXIiLCJvdXRwdXQiLCJnZXRDaGFubmVsRGF0YSIsInJhbmRvbSIsIndoaXRlTm9pc2UiLCJjcmVhdGVCdWZmZXJTb3VyY2UiLCJidWZmZXIiLCJsb29wIiwiYjAiLCJiMSIsImIyIiwiYjMiLCJiNCIsImI1IiwiYjYiLCJ3aGl0ZSIsInBpbmtOb2lzZSIsImxhc3RPdXQiLCJicm93bmlhbk5vaXNlIiwiT3NjaWxsYXRvckluc3RydW1lbnRQYWNrIiwiZnJlcXVlbmN5IiwiY3JlYXRlT3NjaWxsYXRvciIsInZhbHVlIiwiZ2V0RHVyYXRpb24iLCJjbG9uZSIsIm9iaiIsImNvcHkiLCJjb25zdHJ1Y3RvciIsImF0dHIiLCJsYXN0UmVwZWF0Q291bnQiLCJ2b2x1bWVMZXZlbCIsImFydGljdWxhdGlvbkdhcFBlcmNlbnRhZ2UiLCJidWZmZXJQb3NpdGlvbiIsInNldFZvbHVtZSIsIm5ld1ZvbHVtZUxldmVsIiwiZHVyYXRpb24iLCJhcnRpY3VsYXRpb25HYXAiLCJwIiwidHJpbSIsInBhcnNlRmxvYXQiLCJpc05hTiIsInN0YXJ0VGltZSIsInN0b3BUaW1lIiwicmVwZWF0U3RhcnQiLCJyZXBlYXRGcm9tQmVnaW5uaW5nIiwibnVtT2ZSZXBlYXRzIiwicmVwZWF0Iiwibm90ZXNCdWZmZXJDb3B5Iiwic2xpY2UiLCJub3RlQ29weSIsInJlc2V0RHVyYXRpb24iLCJudW1PZk5vdGVzIiwiYnVmZmVyVGltZW91dCIsImFsbE5vdGVzIiwiYnVmZmVyTm90ZXMiLCJjdXJyZW50UGxheVRpbWUiLCJ0b3RhbFBsYXlUaW1lIiwiZmFkZWQiLCJjYWxjdWxhdGVUb3RhbER1cmF0aW9uIiwicmVzZXQiLCJudW1PZkluc3RydW1lbnRzIiwiZGlzY29ubmVjdCIsImNsZWFyVGltZW91dCIsImZhZGUiLCJkaXJlY3Rpb24iLCJyZXNldFZvbHVtZSIsImZhZGVEdXJhdGlvbiIsImxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lIiwic2V0VGltZW91dCIsImJ1ZmZlckNvdW50IiwiaW5kZXgyIiwibm9kZSIsImluZGV4MyIsInRvdGFsUGxheVRpbWVDYWxjdWxhdG9yIiwicGF1c2VkIiwicGxheWluZyIsInN0b3AiLCJsb29waW5nIiwicGxheSIsInVwZGF0ZVRvdGFsUGxheVRpbWUiLCJzZWNvbmRzIiwibXV0ZWQiLCJ0aW1lT2Zmc2V0IiwicGxheU5vdGVzIiwic3RhcnQiLCJidWZmZXJVcCIsImJ1ZmZlckluTmV3Tm90ZXMiLCJuZXdOb3RlcyIsImNvbmNhdCIsImZhZGVPdXQiLCJwYXVzZSIsInZhbCIsInNldFRpbWUiLCJuZXdUaW1lIiwicGFyc2VJbnQiLCJtdXRlIiwidW5tdXRlIiwic2VtaWJyZXZlIiwiZG90dGVkTWluaW0iLCJtaW5pbSIsImRvdHRlZENyb3RjaGV0IiwidHJpcGxldE1pbmltIiwiY3JvdGNoZXQiLCJkb3R0ZWRRdWF2ZXIiLCJ0cmlwbGV0Q3JvdGNoZXQiLCJxdWF2ZXIiLCJkb3R0ZWRTZW1pcXVhdmVyIiwidHJpcGxldFF1YXZlciIsInNlbWlxdWF2ZXIiLCJ0cmlwbGV0U2VtaXF1YXZlciIsImRlbWlzZW1pcXVhdmVyIiwid2hvbGUiLCJkb3R0ZWRIYWxmIiwiaGFsZiIsImRvdHRlZFF1YXJ0ZXIiLCJ0cmlwbGV0SGFsZiIsInF1YXJ0ZXIiLCJkb3R0ZWRFaWdodGgiLCJ0cmlwbGV0UXVhcnRlciIsImVpZ2h0aCIsImRvdHRlZFNpeHRlZW50aCIsInRyaXBsZXRFaWdodGgiLCJzaXh0ZWVudGgiLCJ0cmlwbGV0U2l4dGVlbnRoIiwidGhpcnR5U2Vjb25kIiwiQXVkaW8iLCJwcm9wcyIsInN0YXRlIiwiY29uc29sZSIsImxvZyIsIkJhbmRKUyIsInNlY3Rpb25zUHJvcHMiLCJhbmFseXNpcyIsInNlY3Rpb25zIiwiZm9yRWFjaCIsInNlY3Rpb24iLCJwaWFubyIsInNldFN0YXRlIiwicmh5dGhtVGltZXIiLCJ0aW1lIiwic2hpZnQiLCJwbGF5SGFuZGxlciIsIkNvbXBvbmVudCIsIlRyYWNrc1Jlc3VsdHMiLCJ0cmFja1JlZiIsIlJlYWN0IiwiY3JlYXRlUmVmIiwidXNlU3RhdGUiLCJzYSIsInNhcyIsImdldEFuYWx5c2lzIiwiYXhpb3MiLCJnZXQiLCJ0YXJnZXQiLCJpZCIsImhlYWRlcnMiLCJBdXRob3JpemF0aW9uIiwiYXV0aG9yaXphdGlvbiIsInRoZW4iLCJlcnIiLCJ0cmFja3MiLCJtYXAiLCJ0cmFjayIsImFydGlzdHMiLCJwb3B1bGFyaXR5IiwiRGVmYXVsdCIsIlJoeXRobSIsInF1ZXJ5IiwidG9rZW5fdHlwZSIsInRva2VuIiwidHJhY2tfbGlzdCIsIml0ZW1zIiwic2VhcmNoIiwiZ2V0VHJhY2tzIiwiaGFzaCIsImxvY2F0aW9uIiwic3Vic3RyaW5nIiwicmVkdWNlIiwiaW5pdGlhbCIsIml0ZW0iLCJwYXJ0cyIsImRlY29kZVVSSUNvbXBvbmVudCIsImFjY2Vzc190b2tlbiIsImlucHV0IiwiY2hhbmdlSGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsdUVBQUMsVUFBU0EsQ0FBVCxFQUFXO0FBQUMsTUFBRyxJQUFILEVBQXdEQyxNQUFNLENBQUNDLE9BQVAsR0FBZUYsQ0FBQyxFQUFoQixDQUF4RCxLQUFnRixVQUF5TDtBQUFDLENBQXRSLENBQXVSLFlBQVU7QUFBQyxNQUFJRyxNQUFKLEVBQVdGLE1BQVgsRUFBa0JDLE9BQWxCO0FBQTBCLFNBQVEsU0FBU0YsQ0FBVCxDQUFXSSxDQUFYLEVBQWFDLENBQWIsRUFBZUMsQ0FBZixFQUFpQjtBQUFDLGFBQVNDLENBQVQsQ0FBV0MsQ0FBWCxFQUFhQyxDQUFiLEVBQWU7QUFBQyxVQUFHLENBQUNKLENBQUMsQ0FBQ0csQ0FBRCxDQUFMLEVBQVM7QUFBQyxZQUFHLENBQUNKLENBQUMsQ0FB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QTRCZCxrQkFBVSxFQUFFTSxJQUFJLENBQUNOO0FBQTdDLE9BQWQ7QUFDQTs7OzZCQThCUTtBQUFBOztBQUNSLGFBQ0MsbUVBQ0UsQ0FBQyxLQUFLekMsS0FBTCxDQUFXMEMsS0FBWixJQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FDQztBQUFHLFlBQUksRUFBQyw4SUFBUjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDhCQURELENBRkYsRUFRRSxLQUFLMUMsS0FBTCxDQUFXMEMsS0FBWCxJQUNBLG1FQUNDO0FBQ0MsV0FBRyxFQUFFLGFBQUFjLEtBQUs7QUFBQSxpQkFBSyxNQUFJLENBQUNYLE1BQUwsR0FBY1csS0FBbkI7QUFBQSxTQURYO0FBRUMsZ0JBQVEsRUFBRSxLQUFLQyxhQUZoQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBREQsRUFLQyxNQUFDLHNEQUFEO0FBQ0MscUJBQWEsWUFBSyxLQUFLekQsS0FBTCxDQUFXeUMsVUFBaEIsY0FBOEIsS0FBS3pDLEtBQUwsQ0FBVzBDLEtBQXpDLENBRGQ7QUFFQyxjQUFNLEVBQUUsS0FBSzFDLEtBQUwsQ0FBVzJDLFVBRnBCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFMRCxDQVRGLENBREQ7QUF1QkE7Ozs7RUE1RW1CNUIsK0M7O0FBK0VOd0IscUVBQWY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkZBLDBDIiwiZmlsZSI6InN0YXRpY1xcZGV2ZWxvcG1lbnRcXHBhZ2VzXFxpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiFmdW5jdGlvbihlKXtpZihcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSltb2R1bGUuZXhwb3J0cz1lKCk7ZWxzZSBpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQpZGVmaW5lKFtdLGUpO2Vsc2V7dmFyIGY7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz9mPXdpbmRvdzpcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2Y9Z2xvYmFsOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmJiYoZj1zZWxmKSxmLkJhbmRKUz1lKCl9fShmdW5jdGlvbigpe3ZhciBkZWZpbmUsbW9kdWxlLGV4cG9ydHM7cmV0dXJuIChmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pKHsxOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcclxuLypcclxuICogV2ViIEF1ZGlvIEFQSSBBdWRpb0NvbnRleHQgc2hpbVxyXG4gKi9cclxuKGZ1bmN0aW9uIChkZWZpbml0aW9uKSB7XHJcbiAgICBpZiAodHlwZW9mIGV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKTtcclxuICAgIH1cclxufSkoZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XHJcbn0pO1xyXG5cclxufSx7fV0sMjpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XHJcbi8qKlxyXG4gKiBCYW5kLmpzIC0gTXVzaWMgQ29tcG9zZXJcclxuICogQW4gaW50ZXJmYWNlIGZvciB0aGUgV2ViIEF1ZGlvIEFQSSB0aGF0IHN1cHBvcnRzIHJoeXRobXMsIG11bHRpcGxlIGluc3RydW1lbnRzLCByZXBlYXRpbmcgc2VjdGlvbnMsIGFuZCBjb21wbGV4XHJcbiAqIHRpbWUgc2lnbmF0dXJlcy5cclxuICpcclxuICogQGF1dGhvciBDb2R5IEx1bmRxdWlzdCAoaHR0cDovL2dpdGh1Yi5jb20vbWVlbmllKSAtIDIwMTRcclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gQ29uZHVjdG9yO1xyXG5cclxudmFyIHBhY2tzID0ge1xyXG4gICAgaW5zdHJ1bWVudDoge30sXHJcbiAgICByaHl0aG06IHt9LFxyXG4gICAgdHVuaW5nOiB7fVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbmR1Y3RvciBDbGFzcyAtIFRoaXMgZ2V0cyBpbnN0YW50aWF0ZWQgd2hlbiBgbmV3IEJhbmRKUygpYCBpcyBjYWxsZWRcclxuICpcclxuICogQHBhcmFtIHR1bmluZ1xyXG4gKiBAcGFyYW0gcmh5dGhtXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gQ29uZHVjdG9yKHR1bmluZywgcmh5dGhtKSB7XHJcbiAgICBpZiAoISB0dW5pbmcpIHtcclxuICAgICAgICB0dW5pbmcgPSAnZXF1YWxUZW1wZXJhbWVudCc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCEgcmh5dGhtKSB7XHJcbiAgICAgICAgcmh5dGhtID0gJ25vcnRoQW1lcmljYW4nO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgcGFja3MudHVuaW5nW3R1bmluZ10gPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHR1bmluZyArICcgaXMgbm90IGEgdmFsaWQgdHVuaW5nIHBhY2suJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBwYWNrcy5yaHl0aG1bcmh5dGhtXSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3Iocmh5dGhtICsgJyBpcyBub3QgYSB2YWxpZCByaHl0aG0gcGFjay4nKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgY29uZHVjdG9yID0gdGhpcyxcclxuICAgICAgICBwbGF5ZXIsXHJcbiAgICAgICAgbm9vcCA9IGZ1bmN0aW9uKCkge30sXHJcbiAgICAgICAgQXVkaW9Db250ZXh0ID0gX2RlcmVxXygnYXVkaW9jb250ZXh0JyksXHJcbiAgICAgICAgc2lnbmF0dXJlVG9Ob3RlTGVuZ3RoUmF0aW8gPSB7XHJcbiAgICAgICAgICAgIDI6IDYsXHJcbiAgICAgICAgICAgIDQ6IDMsXHJcbiAgICAgICAgICAgIDg6IDQuNTBcclxuICAgICAgICB9O1xyXG5cclxuICAgIGNvbmR1Y3Rvci5wYWNrcyA9IHBhY2tzO1xyXG4gICAgY29uZHVjdG9yLnBpdGNoZXMgPSBwYWNrcy50dW5pbmdbdHVuaW5nXTtcclxuICAgIGNvbmR1Y3Rvci5ub3RlcyA9IHBhY2tzLnJoeXRobVtyaHl0aG1dO1xyXG4gICAgY29uZHVjdG9yLmF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcclxuICAgIGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWVMZXZlbCA9IG51bGw7XHJcbiAgICBjb25kdWN0b3IubWFzdGVyVm9sdW1lID0gY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XHJcbiAgICBjb25kdWN0b3IubWFzdGVyVm9sdW1lLmNvbm5lY3QoY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XHJcbiAgICBjb25kdWN0b3IuYmVhdHNQZXJCYXIgPSBudWxsO1xyXG4gICAgY29uZHVjdG9yLm5vdGVHZXRzQmVhdCA9IG51bGw7XHJcbiAgICBjb25kdWN0b3IudGVtcG8gPSBudWxsO1xyXG4gICAgY29uZHVjdG9yLmluc3RydW1lbnRzID0gW107XHJcbiAgICBjb25kdWN0b3IudG90YWxEdXJhdGlvbiA9IDA7XHJcbiAgICBjb25kdWN0b3IuY3VycmVudFNlY29uZHMgPSAwO1xyXG4gICAgY29uZHVjdG9yLnBlcmNlbnRhZ2VDb21wbGV0ZSA9IDA7XHJcbiAgICBjb25kdWN0b3Iubm90ZUJ1ZmZlckxlbmd0aCA9IDIwO1xyXG4gICAgY29uZHVjdG9yLm9uVGlja2VyQ2FsbGJhY2sgPSBub29wO1xyXG4gICAgY29uZHVjdG9yLm9uRmluaXNoZWRDYWxsYmFjayA9IG5vb3A7XHJcbiAgICBjb25kdWN0b3Iub25EdXJhdGlvbkNoYW5nZUNhbGxiYWNrID0gbm9vcDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFVzZSBKU09OIHRvIGxvYWQgaW4gYSBzb25nIHRvIGJlIHBsYXllZFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBqc29uXHJcbiAgICAgKi9cclxuICAgIGNvbmR1Y3Rvci5sb2FkID0gZnVuY3Rpb24oanNvbikge1xyXG4gICAgICAgIC8vIENsZWFyIG91dCBhbnkgcHJldmlvdXMgc29uZ1xyXG4gICAgICAgIGlmIChjb25kdWN0b3IuaW5zdHJ1bWVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBjb25kdWN0b3IuZGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCEganNvbikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0pTT04gaXMgcmVxdWlyZWQgZm9yIHRoaXMgbWV0aG9kIHRvIHdvcmsuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIE5lZWQgdG8gaGF2ZSBhdCBsZWFzdCBpbnN0cnVtZW50cyBhbmQgbm90ZXNcclxuICAgICAgICBpZiAodHlwZW9mIGpzb24uaW5zdHJ1bWVudHMgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignWW91IG11c3QgZGVmaW5lIGF0IGxlYXN0IG9uZSBpbnN0cnVtZW50Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2YganNvbi5ub3RlcyA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbXVzdCBkZWZpbmUgbm90ZXMgZm9yIGVhY2ggaW5zdHJ1bWVudCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2hhbGwgd2Ugc2V0IGEgdGltZSBzaWduYXR1cmU/XHJcbiAgICAgICAgaWYgKHR5cGVvZiBqc29uLnRpbWVTaWduYXR1cmUgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIGNvbmR1Y3Rvci5zZXRUaW1lU2lnbmF0dXJlKGpzb24udGltZVNpZ25hdHVyZVswXSwganNvbi50aW1lU2lnbmF0dXJlWzFdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE1heWJlIHNvbWUgdGVtcG8/XHJcbiAgICAgICAgaWYgKHR5cGVvZiBqc29uLnRlbXBvICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBjb25kdWN0b3Iuc2V0VGVtcG8oanNvbi50ZW1wbyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBMZXRzIGNyZWF0ZSBzb21lIGluc3RydW1lbnRzXHJcbiAgICAgICAgdmFyIGluc3RydW1lbnRMaXN0ID0ge307XHJcbiAgICAgICAgZm9yICh2YXIgaW5zdHJ1bWVudCBpbiBqc29uLmluc3RydW1lbnRzKSB7XHJcbiAgICAgICAgICAgIGlmICghIGpzb24uaW5zdHJ1bWVudHMuaGFzT3duUHJvcGVydHkoaW5zdHJ1bWVudCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpbnN0cnVtZW50TGlzdFtpbnN0cnVtZW50XSA9IGNvbmR1Y3Rvci5jcmVhdGVJbnN0cnVtZW50KFxyXG4gICAgICAgICAgICAgICAganNvbi5pbnN0cnVtZW50c1tpbnN0cnVtZW50XS5uYW1lLFxyXG4gICAgICAgICAgICAgICAganNvbi5pbnN0cnVtZW50c1tpbnN0cnVtZW50XS5wYWNrXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBOb3cgbGV0cyBhZGQgaW4gZWFjaCBvZiB0aGUgbm90ZXNcclxuICAgICAgICBmb3IgKHZhciBpbnN0IGluIGpzb24ubm90ZXMpIHtcclxuICAgICAgICAgICAgaWYgKCEganNvbi5ub3Rlcy5oYXNPd25Qcm9wZXJ0eShpbnN0KSkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgIHdoaWxlICgrKyBpbmRleCA8IGpzb24ubm90ZXNbaW5zdF0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbm90ZSA9IGpzb24ubm90ZXNbaW5zdF1baW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgLy8gVXNlIHNob3J0aGFuZCBpZiBpdCdzIGEgc3RyaW5nXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG5vdGUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vdGVQYXJ0cyA9IG5vdGUuc3BsaXQoJ3wnKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJ3Jlc3QnID09PSBub3RlUGFydHNbMV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdHJ1bWVudExpc3RbaW5zdF0ucmVzdChub3RlUGFydHNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3RydW1lbnRMaXN0W2luc3RdLm5vdGUobm90ZVBhcnRzWzBdLCBub3RlUGFydHNbMV0sIG5vdGVQYXJ0c1syXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSB1c2UgbG9uZ2hhbmRcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCdyZXN0JyA9PT0gbm90ZS50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3RydW1lbnRMaXN0W2luc3RdLnJlc3Qobm90ZS5yaHl0aG0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoJ25vdGUnID09PSBub3RlLnR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdHJ1bWVudExpc3RbaW5zdF0ubm90ZShub3RlLnJoeXRobSwgbm90ZS5waXRjaCwgbm90ZS50aWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gTG9va3MgbGlrZSB3ZSBhcmUgZG9uZSwgbGV0cyBwcmVzcyBpdC5cclxuICAgICAgICByZXR1cm4gY29uZHVjdG9yLmZpbmlzaCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIG5ldyBpbnN0cnVtZW50XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIFtuYW1lXSAtIGRlZmF1bHRzIHRvIHNpbmVcclxuICAgICAqIEBwYXJhbSBbcGFja10gLSBkZWZhdWx0cyB0byBvc2NpbGxhdG9yc1xyXG4gICAgICovXHJcbiAgICBjb25kdWN0b3IuY3JlYXRlSW5zdHJ1bWVudCA9IGZ1bmN0aW9uKG5hbWUsIHBhY2spIHtcclxuICAgICAgICB2YXIgSW5zdHJ1bWVudCA9IF9kZXJlcV8oJy4vaW5zdHJ1bWVudC5qcycpLFxyXG4gICAgICAgICAgICBpbnN0cnVtZW50ID0gbmV3IEluc3RydW1lbnQobmFtZSwgcGFjaywgY29uZHVjdG9yKTtcclxuICAgICAgICBjb25kdWN0b3IuaW5zdHJ1bWVudHMucHVzaChpbnN0cnVtZW50KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGluc3RydW1lbnQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTmVlZHMgdG8gYmUgY2FsbGVkIGFmdGVyIGFsbCB0aGUgaW5zdHJ1bWVudHMgaGF2ZSBiZWVuIGZpbGxlZCB3aXRoIG5vdGVzLlxyXG4gICAgICogSXQgd2lsbCBmaWd1cmUgb3V0IHRoZSB0b3RhbCBkdXJhdGlvbiBvZiB0aGUgc29uZyBiYXNlZCBvbiB0aGUgbG9uZ2VzdFxyXG4gICAgICogZHVyYXRpb24gb3V0IG9mIGFsbCB0aGUgaW5zdHJ1bWVudHMuICBJdCB3aWxsIHRoZW4gcGFzcyBiYWNrIHRoZSBQbGF5ZXIgT2JqZWN0XHJcbiAgICAgKiB3aGljaCBpcyB1c2VkIHRvIGNvbnRyb2wgdGhlIG11c2ljIChwbGF5LCBzdG9wLCBwYXVzZSwgbG9vcCwgdm9sdW1lLCB0ZW1wbylcclxuICAgICAqXHJcbiAgICAgKiBJdCByZXR1cm5zIHRoZSBQbGF5ZXIgb2JqZWN0LlxyXG4gICAgICovXHJcbiAgICBjb25kdWN0b3IuZmluaXNoID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIFBsYXllciA9IF9kZXJlcV8oJy4vcGxheWVyLmpzJyk7XHJcbiAgICAgICAgcGxheWVyID0gbmV3IFBsYXllcihjb25kdWN0b3IpO1xyXG5cclxuICAgICAgICByZXR1cm4gcGxheWVyO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZSBhbGwgaW5zdHJ1bWVudHMgYW5kIHJlY3JlYXRlIEF1ZGlvQ29udGV4dFxyXG4gICAgICovXHJcbiAgICBjb25kdWN0b3IuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbmR1Y3Rvci5hdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XHJcbiAgICAgICAgY29uZHVjdG9yLmluc3RydW1lbnRzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgY29uZHVjdG9yLm1hc3RlclZvbHVtZSA9IGNvbmR1Y3Rvci5hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xyXG4gICAgICAgIGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWUuY29ubmVjdChjb25kdWN0b3IuYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgTWFzdGVyIFZvbHVtZVxyXG4gICAgICovXHJcbiAgICBjb25kdWN0b3Iuc2V0TWFzdGVyVm9sdW1lID0gZnVuY3Rpb24odm9sdW1lKSB7XHJcbiAgICAgICAgaWYgKHZvbHVtZSA+IDEpIHtcclxuICAgICAgICAgICAgdm9sdW1lID0gdm9sdW1lIC8gMTAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25kdWN0b3IubWFzdGVyVm9sdW1lTGV2ZWwgPSB2b2x1bWU7XHJcbiAgICAgICAgY29uZHVjdG9yLm1hc3RlclZvbHVtZS5nYWluLnNldFZhbHVlQXRUaW1lKHZvbHVtZSwgY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogR3JhYiB0aGUgdG90YWwgZHVyYXRpb24gb2YgYSBzb25nXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgY29uZHVjdG9yLmdldFRvdGFsU2Vjb25kcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKGNvbmR1Y3Rvci50b3RhbER1cmF0aW9uKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSB0aWNrZXIgY2FsbGJhY2sgZnVuY3Rpb24uIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWRcclxuICAgICAqIGV2ZXJ5IHRpbWUgdGhlIGN1cnJlbnQgc2Vjb25kcyBoYXMgY2hhbmdlZC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY2IgZnVuY3Rpb25cclxuICAgICAqL1xyXG4gICAgY29uZHVjdG9yLnNldFRpY2tlckNhbGxiYWNrID0gZnVuY3Rpb24oY2IpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGNiICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGlja2VyIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbmR1Y3Rvci5vblRpY2tlckNhbGxiYWNrID0gY2I7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgdGltZSBzaWduYXR1cmUgZm9yIHRoZSBtdXNpYy4gSnVzdCBsaWtlIGluIG5vdGF0aW9uIDQvNCB0aW1lIHdvdWxkIGJlIHNldFRpbWVTaWduYXR1cmUoNCwgNCk7XHJcbiAgICAgKiBAcGFyYW0gdG9wIC0gTnVtYmVyIG9mIGJlYXRzIHBlciBiYXJcclxuICAgICAqIEBwYXJhbSBib3R0b20gLSBXaGF0IG5vdGUgdHlwZSBoYXMgdGhlIGJlYXRcclxuICAgICAqL1xyXG4gICAgY29uZHVjdG9yLnNldFRpbWVTaWduYXR1cmUgPSBmdW5jdGlvbih0b3AsIGJvdHRvbSkge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygc2lnbmF0dXJlVG9Ob3RlTGVuZ3RoUmF0aW9bYm90dG9tXSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgYm90dG9tIHRpbWUgc2lnbmF0dXJlIGlzIG5vdCBzdXBwb3J0ZWQuJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBOb3QgdXNlZCBhdCB0aGUgbW9tZW50LCBidXQgd2lsbCBiZSBoYW5keSBpbiB0aGUgZnV0dXJlLlxyXG4gICAgICAgIGNvbmR1Y3Rvci5iZWF0c1BlckJhciA9IHRvcDtcclxuICAgICAgICBjb25kdWN0b3Iubm90ZUdldHNCZWF0ID0gc2lnbmF0dXJlVG9Ob3RlTGVuZ3RoUmF0aW9bYm90dG9tXTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSB0ZW1wb1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB0XHJcbiAgICAgKi9cclxuICAgIGNvbmR1Y3Rvci5zZXRUZW1wbyA9IGZ1bmN0aW9uKHQpIHtcclxuICAgICAgICBjb25kdWN0b3IudGVtcG8gPSA2MCAvIHQ7XHJcblxyXG4gICAgICAgIC8vIElmIHdlIGhhdmUgYSBwbGF5ZXIgaW5zdGFuY2UsIHdlIG5lZWQgdG8gcmVjYWxjdWxhdGUgZHVyYXRpb24gYWZ0ZXIgcmVzZXR0aW5nIHRoZSB0ZW1wby5cclxuICAgICAgICBpZiAocGxheWVyKSB7XHJcbiAgICAgICAgICAgIHBsYXllci5yZXNldFRlbXBvKCk7XHJcbiAgICAgICAgICAgIGNvbmR1Y3Rvci5vbkR1cmF0aW9uQ2hhbmdlQ2FsbGJhY2soKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IGEgY2FsbGJhY2sgdG8gZmlyZSB3aGVuIHRoZSBzb25nIGlzIGZpbmlzaGVkXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNiXHJcbiAgICAgKi9cclxuICAgIGNvbmR1Y3Rvci5zZXRPbkZpbmlzaGVkQ2FsbGJhY2sgPSBmdW5jdGlvbihjYikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgY2IgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdvbkZpbmlzaGVkIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbmR1Y3Rvci5vbkZpbmlzaGVkQ2FsbGJhY2sgPSBjYjtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgYSBjYWxsYmFjayB0byBmaXJlIHdoZW4gZHVyYXRpb24gb2YgYSBzb25nIGNoYW5nZXNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY2JcclxuICAgICAqL1xyXG4gICAgY29uZHVjdG9yLnNldE9uRHVyYXRpb25DaGFuZ2VDYWxsYmFjayA9IGZ1bmN0aW9uKGNiKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjYiAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ29uRHVyYXRpb25DaGFuZ2VkIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbmR1Y3Rvci5vbkR1cmF0aW9uQ2hhbmdlQ2FsbGJhY2sgPSBjYjtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgdGhlIG51bWJlciBvZiBub3RlcyB0aGF0IGFyZSBidWZmZXJlZCBldmVyeSAodGVtcG8gLyA2MCAqIDUpIHNlY29uZHMuXHJcbiAgICAgKiBJdCdzIHNldCB0byAyMCBub3RlcyBieSBkZWZhdWx0LlxyXG4gICAgICpcclxuICAgICAqICoqV0FSTklORyoqIFRoZSBoaWdoZXIgdGhpcyBpcywgdGhlIG1vcmUgbWVtb3J5IGlzIHVzZWQgYW5kIGNhbiBjcmFzaCB5b3VyIGJyb3dzZXIuXHJcbiAgICAgKiAgICAgICAgICAgICBJZiBub3RlcyBhcmUgYmVpbmcgZHJvcHBlZCwgeW91IGNhbiBpbmNyZWFzZSB0aGlzLCBidXQgYmUgd2Vhcnkgb2ZcclxuICAgICAqICAgICAgICAgICAgIHVzZWQgbWVtb3J5LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gbGVuXHJcbiAgICAgKi9cclxuICAgIGNvbmR1Y3Rvci5zZXROb3RlQnVmZmVyTGVuZ3RoID0gZnVuY3Rpb24obGVuKSB7XHJcbiAgICAgICAgY29uZHVjdG9yLm5vdGVCdWZmZXJMZW5ndGggPSBsZW47XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbmR1Y3Rvci5zZXRNYXN0ZXJWb2x1bWUoMTAwKTtcclxuICAgIGNvbmR1Y3Rvci5zZXRUZW1wbygxMjApO1xyXG4gICAgY29uZHVjdG9yLnNldFRpbWVTaWduYXR1cmUoNCwgNCk7XHJcbn1cclxuXHJcbkNvbmR1Y3Rvci5sb2FkUGFjayA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIGRhdGEpIHtcclxuICAgIGlmIChbJ3R1bmluZycsICdyaHl0aG0nLCAnaW5zdHJ1bWVudCddLmluZGV4T2YodHlwZSkgPT09IC0xKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHR5cGUgKyAnIGlzIG5vdCBhIHZhbGlkIFBhY2sgVHlwZS4nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIHBhY2tzW3R5cGVdW25hbWVdICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQShuKSAnICsgdHlwZSArICcgcGFjayB3aXRoIHRoZSBuYW1lIFwiJyArIG5hbWUgKyAnXCIgaGFzIGFscmVhZHkgYmVlbiBsb2FkZWQuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcGFja3NbdHlwZV1bbmFtZV0gPSBkYXRhO1xyXG59O1xyXG5cclxufSx7XCIuL2luc3RydW1lbnQuanNcIjo1LFwiLi9wbGF5ZXIuanNcIjo3LFwiYXVkaW9jb250ZXh0XCI6MX1dLDM6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xyXG4vKipcclxuICogQmFuZC5qcyAtIE11c2ljIENvbXBvc2VyXHJcbiAqIEFuIGludGVyZmFjZSBmb3IgdGhlIFdlYiBBdWRpbyBBUEkgdGhhdCBzdXBwb3J0cyByaHl0aG1zLCBtdWx0aXBsZSBpbnN0cnVtZW50cywgcmVwZWF0aW5nIHNlY3Rpb25zLCBhbmQgY29tcGxleFxyXG4gKiB0aW1lIHNpZ25hdHVyZXMuXHJcbiAqXHJcbiAqIEBhdXRob3IgQ29keSBMdW5kcXVpc3QgKGh0dHA6Ly9naXRodWIuY29tL21lZW5pZSkgLSAyMDE0XHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IE5vaXNlc0luc3RydW1lbnRQYWNrO1xyXG5cclxuLyoqXHJcbiAqIE5vaXNlcyBJbnN0cnVtZW50IFBhY2tcclxuICpcclxuICogQWRhcHRlZCBmcm9tOiBodHRwczovL2dpdGh1Yi5jb20vemFjaGFyeWRlbnRvbi9ub2lzZS5qc1xyXG4gKlxyXG4gKiBAcGFyYW0gbmFtZVxyXG4gKiBAcGFyYW0gYXVkaW9Db250ZXh0XHJcbiAqIEByZXR1cm5zIHt7Y3JlYXRlTm90ZTogY3JlYXRlTm90ZX19XHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gTm9pc2VzSW5zdHJ1bWVudFBhY2sobmFtZSwgYXVkaW9Db250ZXh0KSB7XHJcbiAgICB2YXIgdHlwZXMgPSBbXHJcbiAgICAgICAgJ3doaXRlJyxcclxuICAgICAgICAncGluaycsXHJcbiAgICAgICAgJ2Jyb3duJyxcclxuICAgICAgICAnYnJvd25pYW4nLFxyXG4gICAgICAgICdyZWQnXHJcbiAgICBdO1xyXG5cclxuICAgIGlmICh0eXBlcy5pbmRleE9mKG5hbWUpID09PSAtMSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihuYW1lICsgJyBpcyBub3QgYSB2YWxpZCBub2lzZSBzb3VuZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY3JlYXRlTm90ZTogZnVuY3Rpb24oZGVzdGluYXRpb24pIHtcclxuICAgICAgICAgICAgc3dpdGNoIChuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICd3aGl0ZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVdoaXRlTm9pc2UoZGVzdGluYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAncGluayc6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVBpbmtOb2lzZShkZXN0aW5hdGlvbik7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdicm93bic6XHJcbiAgICAgICAgICAgICAgICBjYXNlICdicm93bmlhbic6XHJcbiAgICAgICAgICAgICAgICBjYXNlICdyZWQnOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVCcm93bmlhbk5vaXNlKGRlc3RpbmF0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlV2hpdGVOb2lzZShkZXN0aW5hdGlvbikge1xyXG4gICAgICAgIHZhciBidWZmZXJTaXplID0gMiAqIGF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlLFxyXG4gICAgICAgICAgICBub2lzZUJ1ZmZlciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXIoMSwgYnVmZmVyU2l6ZSwgYXVkaW9Db250ZXh0LnNhbXBsZVJhdGUpLFxyXG4gICAgICAgICAgICBvdXRwdXQgPSBub2lzZUJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJ1ZmZlclNpemU7IGkrKykge1xyXG4gICAgICAgICAgICBvdXRwdXRbaV0gPSBNYXRoLnJhbmRvbSgpICogMiAtIDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgd2hpdGVOb2lzZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcclxuICAgICAgICB3aGl0ZU5vaXNlLmJ1ZmZlciA9IG5vaXNlQnVmZmVyO1xyXG4gICAgICAgIHdoaXRlTm9pc2UubG9vcCA9IHRydWU7XHJcblxyXG4gICAgICAgIHdoaXRlTm9pc2UuY29ubmVjdChkZXN0aW5hdGlvbik7XHJcblxyXG4gICAgICAgIHJldHVybiB3aGl0ZU5vaXNlO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZVBpbmtOb2lzZShkZXN0aW5hdGlvbikge1xyXG4gICAgICAgIHZhciBidWZmZXJTaXplID0gMiAqIGF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlLFxyXG4gICAgICAgICAgICBub2lzZUJ1ZmZlciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXIoMSwgYnVmZmVyU2l6ZSwgYXVkaW9Db250ZXh0LnNhbXBsZVJhdGUpLFxyXG4gICAgICAgICAgICBvdXRwdXQgPSBub2lzZUJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKSxcclxuICAgICAgICAgICAgYjAsIGIxLCBiMiwgYjMsIGI0LCBiNSwgYjY7XHJcblxyXG4gICAgICAgIGIwID0gYjEgPSBiMiA9IGIzID0gYjQgPSBiNSA9IGI2ID0gMC4wO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnVmZmVyU2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciB3aGl0ZSA9IE1hdGgucmFuZG9tKCkgKiAyIC0gMTtcclxuICAgICAgICAgICAgYjAgPSAwLjk5ODg2ICogYjAgKyB3aGl0ZSAqIDAuMDU1NTE3OTtcclxuICAgICAgICAgICAgYjEgPSAwLjk5MzMyICogYjEgKyB3aGl0ZSAqIDAuMDc1MDc1OTtcclxuICAgICAgICAgICAgYjIgPSAwLjk2OTAwICogYjIgKyB3aGl0ZSAqIDAuMTUzODUyMDtcclxuICAgICAgICAgICAgYjMgPSAwLjg2NjUwICogYjMgKyB3aGl0ZSAqIDAuMzEwNDg1NjtcclxuICAgICAgICAgICAgYjQgPSAwLjU1MDAwICogYjQgKyB3aGl0ZSAqIDAuNTMyOTUyMjtcclxuICAgICAgICAgICAgYjUgPSAtMC43NjE2ICogYjUgLSB3aGl0ZSAqIDAuMDE2ODk4MDtcclxuICAgICAgICAgICAgb3V0cHV0W2ldID0gYjAgKyBiMSArIGIyICsgYjMgKyBiNCArIGI1ICsgYjYgKyB3aGl0ZSAqIDAuNTM2MjtcclxuICAgICAgICAgICAgb3V0cHV0W2ldICo9IDAuMTE7XHJcbiAgICAgICAgICAgIGI2ID0gd2hpdGUgKiAwLjExNTkyNjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBwaW5rTm9pc2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XHJcbiAgICAgICAgcGlua05vaXNlLmJ1ZmZlciA9IG5vaXNlQnVmZmVyO1xyXG4gICAgICAgIHBpbmtOb2lzZS5sb29wID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgcGlua05vaXNlLmNvbm5lY3QoZGVzdGluYXRpb24pO1xyXG5cclxuICAgICAgICByZXR1cm4gcGlua05vaXNlO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUJyb3duaWFuTm9pc2UoZGVzdGluYXRpb24pIHtcclxuICAgICAgICB2YXIgYnVmZmVyU2l6ZSA9IDIgKiBhdWRpb0NvbnRleHQuc2FtcGxlUmF0ZSxcclxuICAgICAgICAgICAgbm9pc2VCdWZmZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyKDEsIGJ1ZmZlclNpemUsIGF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlKSxcclxuICAgICAgICAgICAgb3V0cHV0ID0gbm9pc2VCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCksXHJcbiAgICAgICAgICAgIGxhc3RPdXQgPSAwLjA7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBidWZmZXJTaXplOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHdoaXRlID0gTWF0aC5yYW5kb20oKSAqIDIgLSAxO1xyXG4gICAgICAgICAgICBvdXRwdXRbaV0gPSAobGFzdE91dCArICgwLjAyICogd2hpdGUpKSAvIDEuMDI7XHJcbiAgICAgICAgICAgIGxhc3RPdXQgPSBvdXRwdXRbaV07XHJcbiAgICAgICAgICAgIG91dHB1dFtpXSAqPSAzLjU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgYnJvd25pYW5Ob2lzZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcclxuICAgICAgICBicm93bmlhbk5vaXNlLmJ1ZmZlciA9IG5vaXNlQnVmZmVyO1xyXG4gICAgICAgIGJyb3duaWFuTm9pc2UubG9vcCA9IHRydWU7XHJcblxyXG4gICAgICAgIGJyb3duaWFuTm9pc2UuY29ubmVjdChkZXN0aW5hdGlvbik7XHJcblxyXG4gICAgICAgIHJldHVybiBicm93bmlhbk5vaXNlO1xyXG4gICAgfVxyXG59XHJcblxyXG59LHt9XSw0OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcclxuLyoqXHJcbiAqIEJhbmQuanMgLSBNdXNpYyBDb21wb3NlclxyXG4gKiBBbiBpbnRlcmZhY2UgZm9yIHRoZSBXZWIgQXVkaW8gQVBJIHRoYXQgc3VwcG9ydHMgcmh5dGhtcywgbXVsdGlwbGUgaW5zdHJ1bWVudHMsIHJlcGVhdGluZyBzZWN0aW9ucywgYW5kIGNvbXBsZXhcclxuICogdGltZSBzaWduYXR1cmVzLlxyXG4gKlxyXG4gKiBAYXV0aG9yIENvZHkgTHVuZHF1aXN0IChodHRwOi8vZ2l0aHViLmNvbS9tZWVuaWUpIC0gMjAxNFxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBPc2NpbGxhdG9ySW5zdHJ1bWVudFBhY2s7XHJcblxyXG4vKipcclxuICogT3NjaWxsYXRvciBJbnN0cnVtZW50IFBhY2tcclxuICpcclxuICogQHBhcmFtIG5hbWVcclxuICogQHBhcmFtIGF1ZGlvQ29udGV4dFxyXG4gKiBAcmV0dXJucyB7e2NyZWF0ZU5vdGU6IGNyZWF0ZU5vdGV9fVxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIE9zY2lsbGF0b3JJbnN0cnVtZW50UGFjayhuYW1lLCBhdWRpb0NvbnRleHQpIHtcclxuICAgIHZhciB0eXBlcyA9IFsnc2luZScsICdzcXVhcmUnLCAnc2F3dG9vdGgnLCAndHJpYW5nbGUnXTtcclxuXHJcbiAgICBpZiAodHlwZXMuaW5kZXhPZihuYW1lKSA9PT0gLTEpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobmFtZSArICcgaXMgbm90IGEgdmFsaWQgT3NjaWxsYXRvciB0eXBlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjcmVhdGVOb3RlOiBmdW5jdGlvbihkZXN0aW5hdGlvbiwgZnJlcXVlbmN5KSB7XHJcbiAgICAgICAgICAgIHZhciBvID0gYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENvbm5lY3Qgbm90ZSB0byB2b2x1bWVcclxuICAgICAgICAgICAgby5jb25uZWN0KGRlc3RpbmF0aW9uKTtcclxuICAgICAgICAgICAgLy8gU2V0IHBpdGNoIHR5cGVcclxuICAgICAgICAgICAgby50eXBlID0gbmFtZTtcclxuICAgICAgICAgICAgLy8gU2V0IGZyZXF1ZW5jeVxyXG4gICAgICAgICAgICBvLmZyZXF1ZW5jeS52YWx1ZSA9IGZyZXF1ZW5jeTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBvO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbn0se31dLDU6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xyXG4vKipcclxuICogQmFuZC5qcyAtIE11c2ljIENvbXBvc2VyXHJcbiAqIEFuIGludGVyZmFjZSBmb3IgdGhlIFdlYiBBdWRpbyBBUEkgdGhhdCBzdXBwb3J0cyByaHl0aG1zLCBtdWx0aXBsZSBpbnN0cnVtZW50cywgcmVwZWF0aW5nIHNlY3Rpb25zLCBhbmQgY29tcGxleFxyXG4gKiB0aW1lIHNpZ25hdHVyZXMuXHJcbiAqXHJcbiAqIEBhdXRob3IgQ29keSBMdW5kcXVpc3QgKGh0dHA6Ly9naXRodWIuY29tL21lZW5pZSkgLSAyMDE0XHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IEluc3RydW1lbnQ7XHJcblxyXG4vKipcclxuICogSW5zdHJ1bWVudCBDbGFzcyAtIEdldHMgaW5zdGFudGlhdGVkIHdoZW4gYENvbmR1Y3Rvci5jcmVhdGVJbnN0cnVtZW50KClgIGlzIGNhbGxlZC5cclxuICpcclxuICogQHBhcmFtIG5hbWVcclxuICogQHBhcmFtIHBhY2tcclxuICogQHBhcmFtIGNvbmR1Y3RvclxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIEluc3RydW1lbnQobmFtZSwgcGFjaywgY29uZHVjdG9yKSB7XHJcbiAgICAvLyBEZWZhdWx0IHRvIFNpbmUgT3NjaWxsYXRvclxyXG4gICAgaWYgKCEgbmFtZSkge1xyXG4gICAgICAgIG5hbWUgPSAnc2luZSc7XHJcbiAgICB9XHJcbiAgICBpZiAoISBwYWNrKSB7XHJcbiAgICAgICAgcGFjayA9ICdvc2NpbGxhdG9ycyc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBjb25kdWN0b3IucGFja3MuaW5zdHJ1bWVudFtwYWNrXSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IocGFjayArICcgaXMgbm90IGEgY3VycmVudGx5IGxvYWRlZCBJbnN0cnVtZW50IFBhY2suJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIZWxwZXIgZnVuY3Rpb24gdG8gZmlndXJlIG91dCBob3cgbG9uZyBhIG5vdGUgaXNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcmh5dGhtXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBnZXREdXJhdGlvbihyaHl0aG0pIHtcclxuICAgICAgICBpZiAodHlwZW9mIGNvbmR1Y3Rvci5ub3Rlc1tyaHl0aG1dID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3Iocmh5dGhtICsgJyBpcyBub3QgYSBjb3JyZWN0IHJoeXRobS4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjb25kdWN0b3Iubm90ZXNbcmh5dGhtXSAqIGNvbmR1Y3Rvci50ZW1wbyAvIGNvbmR1Y3Rvci5ub3RlR2V0c0JlYXQgKiAxMDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhlbHBlciBmdW5jdGlvbiB0byBjbG9uZSBhbiBvYmplY3RcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gb2JqXHJcbiAgICAgKiBAcmV0dXJucyB7Y29weX1cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gY2xvbmUob2JqKSB7XHJcbiAgICAgICAgaWYgKG51bGwgPT09IG9iaiB8fCBcIm9iamVjdFwiICE9IHR5cGVvZiBvYmopIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9iajtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNvcHkgPSBvYmouY29uc3RydWN0b3IoKTtcclxuICAgICAgICBmb3IgKHZhciBhdHRyIGluIG9iaikge1xyXG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGF0dHIpKSB7XHJcbiAgICAgICAgICAgICAgICBjb3B5W2F0dHJdID0gb2JqW2F0dHJdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY29weTtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHZhciBpbnN0cnVtZW50ID0gdGhpcyxcclxuICAgICAgICBsYXN0UmVwZWF0Q291bnQgPSAwLFxyXG4gICAgICAgIHZvbHVtZUxldmVsID0gMSxcclxuICAgICAgICBhcnRpY3VsYXRpb25HYXBQZXJjZW50YWdlID0gMC4wNTtcclxuXHJcbiAgICBpbnN0cnVtZW50LnRvdGFsRHVyYXRpb24gPSAwO1xyXG4gICAgaW5zdHJ1bWVudC5idWZmZXJQb3NpdGlvbiA9IDA7XHJcbiAgICBpbnN0cnVtZW50Lmluc3RydW1lbnQgPSBjb25kdWN0b3IucGFja3MuaW5zdHJ1bWVudFtwYWNrXShuYW1lLCBjb25kdWN0b3IuYXVkaW9Db250ZXh0KTtcclxuICAgIGluc3RydW1lbnQubm90ZXMgPSBbXTtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgdm9sdW1lIGxldmVsIGZvciBhbiBpbnN0cnVtZW50XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIG5ld1ZvbHVtZUxldmVsXHJcbiAgICAgKi9cclxuICAgIGluc3RydW1lbnQuc2V0Vm9sdW1lID0gZnVuY3Rpb24obmV3Vm9sdW1lTGV2ZWwpIHtcclxuICAgICAgICBpZiAobmV3Vm9sdW1lTGV2ZWwgPiAxKSB7XHJcbiAgICAgICAgICAgIG5ld1ZvbHVtZUxldmVsID0gbmV3Vm9sdW1lTGV2ZWwgLyAxMDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZvbHVtZUxldmVsID0gbmV3Vm9sdW1lTGV2ZWw7XHJcblxyXG4gICAgICAgIHJldHVybiBpbnN0cnVtZW50O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIG5vdGUgdG8gYW4gaW5zdHJ1bWVudFxyXG4gICAgICogQHBhcmFtIHJoeXRobVxyXG4gICAgICogQHBhcmFtIFtwaXRjaF0gLSBDb21tYSBzZXBhcmF0ZWQgc3RyaW5nIGlmIG1vcmUgdGhhbiBvbmUgcGl0Y2hcclxuICAgICAqIEBwYXJhbSBbdGllXVxyXG4gICAgICovXHJcbiAgICBpbnN0cnVtZW50Lm5vdGUgPSBmdW5jdGlvbihyaHl0aG0sIHBpdGNoLCB0aWUpIHtcclxuICAgICAgICB2YXIgZHVyYXRpb24gPSBnZXREdXJhdGlvbihyaHl0aG0pLFxyXG4gICAgICAgICAgICBhcnRpY3VsYXRpb25HYXAgPSB0aWUgPyAwIDogZHVyYXRpb24gKiBhcnRpY3VsYXRpb25HYXBQZXJjZW50YWdlO1xyXG5cclxuICAgICAgICBpZiAocGl0Y2gpIHtcclxuICAgICAgICAgICAgcGl0Y2ggPSBwaXRjaC5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSAtMTtcclxuICAgICAgICAgICAgd2hpbGUgKCsrIGluZGV4IDwgcGl0Y2gubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcCA9IHBpdGNoW2luZGV4XTtcclxuICAgICAgICAgICAgICAgIHAgPSBwLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uZHVjdG9yLnBpdGNoZXNbcF0gPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcCA9IHBhcnNlRmxvYXQocCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzTmFOKHApIHx8IHAgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihwICsgJyBpcyBub3QgYSB2YWxpZCBwaXRjaC4nKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluc3RydW1lbnQubm90ZXMucHVzaCh7XHJcbiAgICAgICAgICAgIHJoeXRobTogcmh5dGhtLFxyXG4gICAgICAgICAgICBwaXRjaDogcGl0Y2gsXHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcclxuICAgICAgICAgICAgYXJ0aWN1bGF0aW9uR2FwOiBhcnRpY3VsYXRpb25HYXAsXHJcbiAgICAgICAgICAgIHRpZTogdGllLFxyXG4gICAgICAgICAgICBzdGFydFRpbWU6IGluc3RydW1lbnQudG90YWxEdXJhdGlvbixcclxuICAgICAgICAgICAgc3RvcFRpbWU6IGluc3RydW1lbnQudG90YWxEdXJhdGlvbiArIGR1cmF0aW9uIC0gYXJ0aWN1bGF0aW9uR2FwLFxyXG4gICAgICAgICAgICAvLyBWb2x1bWUgbmVlZHMgdG8gYmUgYSBxdWFydGVyIG9mIHRoZSBtYXN0ZXIgc28gaXQgZG9lc24ndCBjbGlwXHJcbiAgICAgICAgICAgIHZvbHVtZUxldmVsOiB2b2x1bWVMZXZlbCAvIDRcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uICs9IGR1cmF0aW9uO1xyXG5cclxuICAgICAgICByZXR1cm4gaW5zdHJ1bWVudDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSByZXN0IHRvIGFuIGluc3RydW1lbnRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcmh5dGhtXHJcbiAgICAgKi9cclxuICAgIGluc3RydW1lbnQucmVzdCA9IGZ1bmN0aW9uKHJoeXRobSkge1xyXG4gICAgICAgIHZhciBkdXJhdGlvbiA9IGdldER1cmF0aW9uKHJoeXRobSk7XHJcblxyXG4gICAgICAgIGluc3RydW1lbnQubm90ZXMucHVzaCh7XHJcbiAgICAgICAgICAgIHJoeXRobTogcmh5dGhtLFxyXG4gICAgICAgICAgICBwaXRjaDogZmFsc2UsXHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcclxuICAgICAgICAgICAgYXJ0aWN1bGF0aW9uR2FwOiAwLFxyXG4gICAgICAgICAgICBzdGFydFRpbWU6IGluc3RydW1lbnQudG90YWxEdXJhdGlvbixcclxuICAgICAgICAgICAgc3RvcFRpbWU6IGluc3RydW1lbnQudG90YWxEdXJhdGlvbiArIGR1cmF0aW9uXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGluc3RydW1lbnQudG90YWxEdXJhdGlvbiArPSBkdXJhdGlvbjtcclxuXHJcbiAgICAgICAgcmV0dXJuIGluc3RydW1lbnQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGxhY2Ugd2hlcmUgYSByZXBlYXQgc2VjdGlvbiBzaG91bGQgc3RhcnRcclxuICAgICAqL1xyXG4gICAgaW5zdHJ1bWVudC5yZXBlYXRTdGFydCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxhc3RSZXBlYXRDb3VudCA9IGluc3RydW1lbnQubm90ZXMubGVuZ3RoO1xyXG5cclxuICAgICAgICByZXR1cm4gaW5zdHJ1bWVudDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXBlYXQgZnJvbSBiZWdpbm5pbmdcclxuICAgICAqL1xyXG4gICAgaW5zdHJ1bWVudC5yZXBlYXRGcm9tQmVnaW5uaW5nID0gZnVuY3Rpb24obnVtT2ZSZXBlYXRzKSB7XHJcbiAgICAgICAgbGFzdFJlcGVhdENvdW50ID0gMDtcclxuICAgICAgICBpbnN0cnVtZW50LnJlcGVhdChudW1PZlJlcGVhdHMpO1xyXG5cclxuICAgICAgICByZXR1cm4gaW5zdHJ1bWVudDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBOdW1iZXIgb2YgdGltZXMgdGhlIHNlY3Rpb24gc2hvdWxkIHJlcGVhdFxyXG4gICAgICogQHBhcmFtIFtudW1PZlJlcGVhdHNdIC0gZGVmYXVsdHMgdG8gMVxyXG4gICAgICovXHJcbiAgICBpbnN0cnVtZW50LnJlcGVhdCA9IGZ1bmN0aW9uKG51bU9mUmVwZWF0cykge1xyXG4gICAgICAgIG51bU9mUmVwZWF0cyA9IHR5cGVvZiBudW1PZlJlcGVhdHMgPT09ICd1bmRlZmluZWQnID8gMSA6IG51bU9mUmVwZWF0cztcclxuICAgICAgICB2YXIgbm90ZXNCdWZmZXJDb3B5ID0gaW5zdHJ1bWVudC5ub3Rlcy5zbGljZShsYXN0UmVwZWF0Q291bnQpO1xyXG4gICAgICAgIGZvciAodmFyIHIgPSAwOyByIDwgbnVtT2ZSZXBlYXRzOyByICsrKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IC0xO1xyXG4gICAgICAgICAgICB3aGlsZSAoKytpbmRleCA8IG5vdGVzQnVmZmVyQ29weS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBub3RlQ29weSA9IGNsb25lKG5vdGVzQnVmZmVyQ29weVtpbmRleF0pO1xyXG5cclxuICAgICAgICAgICAgICAgIG5vdGVDb3B5LnN0YXJ0VGltZSA9IGluc3RydW1lbnQudG90YWxEdXJhdGlvbjtcclxuICAgICAgICAgICAgICAgIG5vdGVDb3B5LnN0b3BUaW1lID0gaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uICsgbm90ZUNvcHkuZHVyYXRpb24gLSBub3RlQ29weS5hcnRpY3VsYXRpb25HYXA7XHJcblxyXG4gICAgICAgICAgICAgICAgaW5zdHJ1bWVudC5ub3Rlcy5wdXNoKG5vdGVDb3B5KTtcclxuICAgICAgICAgICAgICAgIGluc3RydW1lbnQudG90YWxEdXJhdGlvbiArPSBub3RlQ29weS5kdXJhdGlvbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGluc3RydW1lbnQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVzZXQgdGhlIGR1cmF0aW9uLCBzdGFydCwgYW5kIHN0b3AgdGltZSBvZiBlYWNoIG5vdGUuXHJcbiAgICAgKi9cclxuICAgIGluc3RydW1lbnQucmVzZXREdXJhdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBpbmRleCA9IC0xLFxyXG4gICAgICAgICAgICBudW1PZk5vdGVzID0gaW5zdHJ1bWVudC5ub3Rlcy5sZW5ndGg7XHJcblxyXG4gICAgICAgIGluc3RydW1lbnQudG90YWxEdXJhdGlvbiA9IDA7XHJcblxyXG4gICAgICAgIHdoaWxlICgrK2luZGV4IDwgbnVtT2ZOb3Rlcykge1xyXG4gICAgICAgICAgICB2YXIgbm90ZSA9IGluc3RydW1lbnQubm90ZXNbaW5kZXhdLFxyXG4gICAgICAgICAgICAgICAgZHVyYXRpb24gPSBnZXREdXJhdGlvbihub3RlLnJoeXRobSksXHJcbiAgICAgICAgICAgICAgICBhcnRpY3VsYXRpb25HYXAgPSBub3RlLnRpZSA/IDAgOiBkdXJhdGlvbiAqIGFydGljdWxhdGlvbkdhcFBlcmNlbnRhZ2U7XHJcblxyXG4gICAgICAgICAgICBub3RlLmR1cmF0aW9uID0gZ2V0RHVyYXRpb24obm90ZS5yaHl0aG0pO1xyXG4gICAgICAgICAgICBub3RlLnN0YXJ0VGltZSA9IGluc3RydW1lbnQudG90YWxEdXJhdGlvbjtcclxuICAgICAgICAgICAgbm90ZS5zdG9wVGltZSA9IGluc3RydW1lbnQudG90YWxEdXJhdGlvbiArIGR1cmF0aW9uIC0gYXJ0aWN1bGF0aW9uR2FwO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5vdGUucGl0Y2ggIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBub3RlLmFydGljdWxhdGlvbkdhcCA9IGFydGljdWxhdGlvbkdhcDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uICs9IGR1cmF0aW9uO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbn0se31dLDY6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xyXG4vKipcclxuICogQmFuZC5qcyAtIE11c2ljIENvbXBvc2VyXHJcbiAqIEFuIGludGVyZmFjZSBmb3IgdGhlIFdlYiBBdWRpbyBBUEkgdGhhdCBzdXBwb3J0cyByaHl0aG1zLCBtdWx0aXBsZSBpbnN0cnVtZW50cywgcmVwZWF0aW5nIHNlY3Rpb25zLCBhbmQgY29tcGxleFxyXG4gKiB0aW1lIHNpZ25hdHVyZXMuXHJcbiAqXHJcbiAqIEBhdXRob3IgQ29keSBMdW5kcXVpc3QgKGh0dHA6Ly9naXRodWIuY29tL21lZW5pZSkgLSAyMDE0XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlIHtCYW5kSlN9XHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IF9kZXJlcV8oJy4vY29uZHVjdG9yLmpzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5sb2FkUGFjaygnaW5zdHJ1bWVudCcsICdub2lzZXMnLCBfZGVyZXFfKCcuL2luc3RydW1lbnQtcGFja3Mvbm9pc2VzLmpzJykpO1xyXG5tb2R1bGUuZXhwb3J0cy5sb2FkUGFjaygnaW5zdHJ1bWVudCcsICdvc2NpbGxhdG9ycycsIF9kZXJlcV8oJy4vaW5zdHJ1bWVudC1wYWNrcy9vc2NpbGxhdG9ycy5qcycpKTtcclxubW9kdWxlLmV4cG9ydHMubG9hZFBhY2soJ3JoeXRobScsICdub3J0aEFtZXJpY2FuJywgX2RlcmVxXygnLi9yaHl0aG0tcGFja3Mvbm9ydGgtYW1lcmljYW4uanMnKSk7XHJcbm1vZHVsZS5leHBvcnRzLmxvYWRQYWNrKCdyaHl0aG0nLCAnZXVyb3BlYW4nLCBfZGVyZXFfKCcuL3JoeXRobS1wYWNrcy9ldXJvcGVhbi5qcycpKTtcclxubW9kdWxlLmV4cG9ydHMubG9hZFBhY2soJ3R1bmluZycsICdlcXVhbFRlbXBlcmFtZW50JywgX2RlcmVxXygnLi90dW5pbmctcGFja3MvZXF1YWwtdGVtcGVyYW1lbnQuanMnKSk7XHJcblxyXG59LHtcIi4vY29uZHVjdG9yLmpzXCI6MixcIi4vaW5zdHJ1bWVudC1wYWNrcy9ub2lzZXMuanNcIjozLFwiLi9pbnN0cnVtZW50LXBhY2tzL29zY2lsbGF0b3JzLmpzXCI6NCxcIi4vcmh5dGhtLXBhY2tzL2V1cm9wZWFuLmpzXCI6OCxcIi4vcmh5dGhtLXBhY2tzL25vcnRoLWFtZXJpY2FuLmpzXCI6OSxcIi4vdHVuaW5nLXBhY2tzL2VxdWFsLXRlbXBlcmFtZW50LmpzXCI6MTB9XSw3OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcclxuLyoqXHJcbiAqIEJhbmQuanMgLSBNdXNpYyBDb21wb3NlclxyXG4gKiBBbiBpbnRlcmZhY2UgZm9yIHRoZSBXZWIgQXVkaW8gQVBJIHRoYXQgc3VwcG9ydHMgcmh5dGhtcywgbXVsdGlwbGUgaW5zdHJ1bWVudHMsIHJlcGVhdGluZyBzZWN0aW9ucywgYW5kIGNvbXBsZXhcclxuICogdGltZSBzaWduYXR1cmVzLlxyXG4gKlxyXG4gKiBAYXV0aG9yIENvZHkgTHVuZHF1aXN0IChodHRwOi8vZ2l0aHViLmNvbS9tZWVuaWUpIC0gMjAxNFxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXI7XHJcblxyXG4vKipcclxuICogUGxheWVyIENsYXNzIC0gVGhpcyBnZXRzIGluc3RhbnRpYXRlZCBieSB0aGUgQ29uZHVjdG9yIGNsYXNzIHdoZW4gYENvbmR1Y3Rvci5maW5pc2goKWAgaXMgY2FsbGVkXHJcbiAqXHJcbiAqIEBwYXJhbSBjb25kdWN0b3JcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBQbGF5ZXIoY29uZHVjdG9yKSB7XHJcbiAgICB2YXIgcGxheWVyID0gdGhpcyxcclxuICAgICAgICBidWZmZXJUaW1lb3V0LFxyXG4gICAgICAgIGFsbE5vdGVzID0gYnVmZmVyTm90ZXMoKSxcclxuICAgICAgICBjdXJyZW50UGxheVRpbWUsXHJcbiAgICAgICAgdG90YWxQbGF5VGltZSA9IDAsXHJcbiAgICAgICAgZmFkZWQgPSBmYWxzZTtcclxuXHJcbiAgICBjYWxjdWxhdGVUb3RhbER1cmF0aW9uKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIZWxwZXIgZnVuY3Rpb24gdG8gc3RvcCBhbGwgbm90ZXMgYW5kXHJcbiAgICAgKiB0aGVuIHJlLWJ1ZmZlcnMgdGhlbVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3Jlc2V0RHVyYXRpb25dXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHJlc2V0KHJlc2V0RHVyYXRpb24pIHtcclxuICAgICAgICAvLyBSZXNldCB0aGUgYnVmZmVyIHBvc2l0aW9uIG9mIGFsbCBpbnN0cnVtZW50c1xyXG4gICAgICAgIHZhciBpbmRleCA9IC0xLFxyXG4gICAgICAgICAgICBudW1PZkluc3RydW1lbnRzID0gY29uZHVjdG9yLmluc3RydW1lbnRzLmxlbmd0aDtcclxuICAgICAgICB3aGlsZSAoKytpbmRleCA8IG51bU9mSW5zdHJ1bWVudHMpIHtcclxuICAgICAgICAgICAgdmFyIGluc3RydW1lbnQgPSBjb25kdWN0b3IuaW5zdHJ1bWVudHNbaW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc2V0RHVyYXRpb24pIHtcclxuICAgICAgICAgICAgICAgIGluc3RydW1lbnQucmVzZXREdXJhdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGluc3RydW1lbnQuYnVmZmVyUG9zaXRpb24gPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSWYgd2UgYXJlIHJlc2V0aW5nIHRoZSBkdXJhdGlvbiwgd2UgbmVlZCB0byBmaWd1cmUgb3V0IHRoZSBuZXcgdG90YWwgZHVyYXRpb24uXHJcbiAgICAgICAgLy8gQWxzbyBzZXQgdGhlIHRvdGFsUGxheVRpbWUgdG8gdGhlIGN1cnJlbnQgcGVyY2VudGFnZSBkb25lIG9mIHRoZSBuZXcgdG90YWwgZHVyYXRpb24uXHJcbiAgICAgICAgaWYgKHJlc2V0RHVyYXRpb24pIHtcclxuICAgICAgICAgICAgY2FsY3VsYXRlVG90YWxEdXJhdGlvbigpO1xyXG4gICAgICAgICAgICB0b3RhbFBsYXlUaW1lID0gY29uZHVjdG9yLnBlcmNlbnRhZ2VDb21wbGV0ZSAqIGNvbmR1Y3Rvci50b3RhbER1cmF0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5kZXggPSAtMTtcclxuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGFsbE5vdGVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBhbGxOb3Rlc1tpbmRleF0uZ2Fpbi5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbGVhclRpbWVvdXQoYnVmZmVyVGltZW91dCk7XHJcblxyXG4gICAgICAgIGFsbE5vdGVzID0gYnVmZmVyTm90ZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhlbHBlciBmdW5jdGlvbiB0byBmYWRlIHVwL2Rvd24gbWFzdGVyIHZvbHVtZVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBkaXJlY3Rpb24gLSB1cCBvciBkb3duXHJcbiAgICAgKiBAcGFyYW0gW2NiXSAtIENhbGxiYWNrIGZ1bmN0aW9uIGZpcmVkIGFmdGVyIHRoZSB0cmFuc2l0aW9uIGlzIGNvbXBsZXRlZFxyXG4gICAgICogQHBhcmFtIFtyZXNldFZvbHVtZV0gLSBSZXNldCB0aGUgdm9sdW1lIGJhY2sgdG8gaXQncyBvcmlnaW5hbCBsZXZlbFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBmYWRlKGRpcmVjdGlvbiwgY2IsIHJlc2V0Vm9sdW1lKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiByZXNldFZvbHVtZSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgcmVzZXRWb2x1bWUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCd1cCcgIT09IGRpcmVjdGlvbiAmJiAnZG93bicgIT09IGRpcmVjdGlvbikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RpcmVjdGlvbiBtdXN0IGJlIGVpdGhlciB1cCBvciBkb3duLicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGZhZGVEdXJhdGlvbiA9IDAuMjtcclxuXHJcbiAgICAgICAgZmFkZWQgPSBkaXJlY3Rpb24gPT09ICdkb3duJztcclxuXHJcbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3VwJykge1xyXG4gICAgICAgICAgICBjb25kdWN0b3IubWFzdGVyVm9sdW1lLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMCwgY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XHJcbiAgICAgICAgICAgIGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWUuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZShjb25kdWN0b3IubWFzdGVyVm9sdW1lTGV2ZWwsIGNvbmR1Y3Rvci5hdWRpb0NvbnRleHQuY3VycmVudFRpbWUgKyBmYWRlRHVyYXRpb24pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWUuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZShjb25kdWN0b3IubWFzdGVyVm9sdW1lTGV2ZWwsIGNvbmR1Y3Rvci5hdWRpb0NvbnRleHQuY3VycmVudFRpbWUpO1xyXG4gICAgICAgICAgICBjb25kdWN0b3IubWFzdGVyVm9sdW1lLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMCwgY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSArIGZhZGVEdXJhdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICBjYi5jYWxsKHBsYXllcik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChyZXNldFZvbHVtZSkge1xyXG4gICAgICAgICAgICAgICAgZmFkZWQgPSAhIGZhZGVkO1xyXG4gICAgICAgICAgICAgICAgY29uZHVjdG9yLm1hc3RlclZvbHVtZS5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKGNvbmR1Y3Rvci5tYXN0ZXJWb2x1bWVMZXZlbCwgY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBmYWRlRHVyYXRpb24gKiAxMDAwKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZXMgdGhlIHRvdGFsIGR1cmF0aW9uIG9mIGEgc29uZyBiYXNlZCBvbiB0aGUgbG9uZ2VzdCBkdXJhdGlvbiBvZiBhbGwgaW5zdHJ1bWVudHMuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZVRvdGFsRHVyYXRpb24oKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gLTE7XHJcbiAgICAgICAgdmFyIHRvdGFsRHVyYXRpb24gPSAwO1xyXG4gICAgICAgIHdoaWxlICgrK2luZGV4IDwgY29uZHVjdG9yLmluc3RydW1lbnRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB2YXIgaW5zdHJ1bWVudCA9IGNvbmR1Y3Rvci5pbnN0cnVtZW50c1tpbmRleF07XHJcbiAgICAgICAgICAgIGlmIChpbnN0cnVtZW50LnRvdGFsRHVyYXRpb24gPiB0b3RhbER1cmF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB0b3RhbER1cmF0aW9uID0gaW5zdHJ1bWVudC50b3RhbER1cmF0aW9uO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25kdWN0b3IudG90YWxEdXJhdGlvbiA9IHRvdGFsRHVyYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHcmFicyBhIHNldCBvZiBub3RlcyBiYXNlZCBvbiB0aGUgY3VycmVudCB0aW1lIGFuZCB3aGF0IHRoZSBCdWZmZXIgU2l6ZSBpcy5cclxuICAgICAqIEl0IHdpbGwgYWxzbyBza2lwIGFueSBub3RlcyB0aGF0IGhhdmUgYSBzdGFydCB0aW1lIGxlc3MgdGhhbiB0aGVcclxuICAgICAqIHRvdGFsIHBsYXkgdGltZS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGJ1ZmZlck5vdGVzKCkge1xyXG4gICAgICAgIHZhciBub3RlcyA9IFtdLFxyXG4gICAgICAgICAgICBpbmRleCA9IC0xLFxyXG4gICAgICAgICAgICBidWZmZXJTaXplID0gY29uZHVjdG9yLm5vdGVCdWZmZXJMZW5ndGg7XHJcblxyXG4gICAgICAgIHdoaWxlICgrK2luZGV4IDwgY29uZHVjdG9yLmluc3RydW1lbnRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB2YXIgaW5zdHJ1bWVudCA9IGNvbmR1Y3Rvci5pbnN0cnVtZW50c1tpbmRleF07XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSB2b2x1bWUgZm9yIHRoaXMgaW5zdHJ1bWVudFxyXG4gICAgICAgICAgICB2YXIgYnVmZmVyQ291bnQgPSBidWZmZXJTaXplO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXgyID0gLTE7XHJcbiAgICAgICAgICAgIHdoaWxlICgrK2luZGV4MiA8IGJ1ZmZlckNvdW50KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbm90ZSA9IGluc3RydW1lbnQubm90ZXNbaW5zdHJ1bWVudC5idWZmZXJQb3NpdGlvbiArIGluZGV4Ml07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBub3RlID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBwaXRjaCA9IG5vdGUucGl0Y2gsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lID0gbm90ZS5zdGFydFRpbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcFRpbWUgPSBub3RlLnN0b3BUaW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIHZvbHVtZUxldmVsID0gbm90ZS52b2x1bWVMZXZlbDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc3RvcFRpbWUgPCB0b3RhbFBsYXlUaW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyQ291bnQgKys7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSWYgcGl0Y2ggaXMgZmFsc2UsIHRoZW4gaXQncyBhIHJlc3QgYW5kIHdlIGRvbid0IG5lZWQgYSBub3RlXHJcbiAgICAgICAgICAgICAgICBpZiAoZmFsc2UgPT09IHBpdGNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGdhaW4gPSBjb25kdWN0b3IuYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcclxuICAgICAgICAgICAgICAgIC8vIENvbm5lY3Qgdm9sdW1lIGdhaW4gdG8gdGhlIE1hc3RlciBWb2x1bWU7XHJcbiAgICAgICAgICAgICAgICBnYWluLmNvbm5lY3QoY29uZHVjdG9yLm1hc3RlclZvbHVtZSk7XHJcbiAgICAgICAgICAgICAgICBnYWluLmdhaW4udmFsdWUgPSB2b2x1bWVMZXZlbDtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgc3RhcnRUaW1lIGlzIGxlc3MgdGhhbiB0b3RhbCBwbGF5IHRpbWUsIHdlIG5lZWQgdG8gc3RhcnQgdGhlIG5vdGVcclxuICAgICAgICAgICAgICAgIC8vIGluIHRoZSBtaWRkbGVcclxuICAgICAgICAgICAgICAgIGlmIChzdGFydFRpbWUgPCB0b3RhbFBsYXlUaW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lID0gc3RvcFRpbWUgLSB0b3RhbFBsYXlUaW1lO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIE5vIHBpdGNoZXMgZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwaXRjaCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBub3Rlcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiBzdGFydFRpbWUgPCB0b3RhbFBsYXlUaW1lID8gc3RvcFRpbWUgLSB0b3RhbFBsYXlUaW1lIDogc3RhcnRUaW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9wVGltZTogc3RvcFRpbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGU6IGluc3RydW1lbnQuaW5zdHJ1bWVudC5jcmVhdGVOb3RlKGdhaW4pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnYWluOiBnYWluLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2b2x1bWVMZXZlbDogdm9sdW1lTGV2ZWxcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4MyA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICgrK2luZGV4MyA8IHBpdGNoLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcCA9IHBpdGNoW2luZGV4M107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdGVzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiBzdGFydFRpbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9wVGltZTogc3RvcFRpbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlOiBpbnN0cnVtZW50Lmluc3RydW1lbnQuY3JlYXRlTm90ZShnYWluLCBjb25kdWN0b3IucGl0Y2hlc1twLnRyaW0oKV0gfHwgcGFyc2VGbG9hdChwKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYWluOiBnYWluLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm9sdW1lTGV2ZWw6IHZvbHVtZUxldmVsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbnN0cnVtZW50LmJ1ZmZlclBvc2l0aW9uICs9IGJ1ZmZlckNvdW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUmV0dXJuIGFycmF5IG9mIG5vdGVzXHJcbiAgICAgICAgcmV0dXJuIG5vdGVzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRvdGFsUGxheVRpbWVDYWxjdWxhdG9yKCkge1xyXG4gICAgICAgIGlmICghIHBsYXllci5wYXVzZWQgJiYgcGxheWVyLnBsYXlpbmcpIHtcclxuICAgICAgICAgICAgaWYgKGNvbmR1Y3Rvci50b3RhbER1cmF0aW9uIDwgdG90YWxQbGF5VGltZSkge1xyXG4gICAgICAgICAgICAgICAgcGxheWVyLnN0b3AoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBsYXllci5sb29waW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLnBsYXkoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbmR1Y3Rvci5vbkZpbmlzaGVkQ2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZVRvdGFsUGxheVRpbWUoKTtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQodG90YWxQbGF5VGltZUNhbGN1bGF0b3IsIDEwMDAgLyA2MCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsIHRvIHVwZGF0ZSB0aGUgdG90YWwgcGxheSB0aW1lIHNvIGZhclxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVUb3RhbFBsYXlUaW1lKCkge1xyXG4gICAgICAgIHRvdGFsUGxheVRpbWUgKz0gY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSAtIGN1cnJlbnRQbGF5VGltZTtcclxuICAgICAgICB2YXIgc2Vjb25kcyA9IE1hdGgucm91bmQodG90YWxQbGF5VGltZSk7XHJcbiAgICAgICAgaWYgKHNlY29uZHMgIT0gY29uZHVjdG9yLmN1cnJlbnRTZWNvbmRzKSB7XHJcbiAgICAgICAgICAgIC8vIE1ha2UgY2FsbGJhY2sgYXN5bmNocm9ub3VzXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25kdWN0b3Iub25UaWNrZXJDYWxsYmFjayhzZWNvbmRzKTtcclxuICAgICAgICAgICAgfSwgMSk7XHJcbiAgICAgICAgICAgIGNvbmR1Y3Rvci5jdXJyZW50U2Vjb25kcyA9IHNlY29uZHM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbmR1Y3Rvci5wZXJjZW50YWdlQ29tcGxldGUgPSB0b3RhbFBsYXlUaW1lIC8gY29uZHVjdG9yLnRvdGFsRHVyYXRpb247XHJcbiAgICAgICAgY3VycmVudFBsYXlUaW1lID0gY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcclxuICAgIH1cclxuXHJcbiAgICBwbGF5ZXIucGF1c2VkID0gZmFsc2U7XHJcbiAgICBwbGF5ZXIucGxheWluZyA9IGZhbHNlO1xyXG4gICAgcGxheWVyLmxvb3BpbmcgPSBmYWxzZTtcclxuICAgIHBsYXllci5tdXRlZCA9IGZhbHNlO1xyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIEdyYWJzIGN1cnJlbnRseSBidWZmZXJlZCBub3RlcyBhbmQgY2FsbHMgdGhlaXIgc3RhcnQvc3RvcCBtZXRob2RzLlxyXG4gICAgICpcclxuICAgICAqIEl0IHRoZW4gc2V0cyB1cCBhIHRpbWVyIHRvIGJ1ZmZlciB1cCB0aGUgbmV4dCBzZXQgb2Ygbm90ZXMgYmFzZWQgb24gdGhlXHJcbiAgICAgKiBhIHNldCBidWZmZXIgc2l6ZS4gIFRoaXMgd2lsbCBrZWVwIGdvaW5nIHVudGlsIHRoZSBzb25nIGlzIHN0b3BwZWQgb3IgcGF1c2VkLlxyXG4gICAgICpcclxuICAgICAqIEl0IHdpbGwgdXNlIHRoZSB0b3RhbCB0aW1lIHBsYXllZCBzbyBmYXIgYXMgYW4gb2Zmc2V0IHNvIHlvdSBwYXVzZS9wbGF5IHRoZSBtdXNpY1xyXG4gICAgICovXHJcbiAgICBwbGF5ZXIucGxheSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHBsYXllci5wbGF5aW5nID0gdHJ1ZTtcclxuICAgICAgICBwbGF5ZXIucGF1c2VkID0gZmFsc2U7XHJcbiAgICAgICAgY3VycmVudFBsYXlUaW1lID0gY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcclxuICAgICAgICAvLyBTdGFydHMgY2FsY3VsYXRvciB3aGljaCBrZWVwcyB0cmFjayBvZiB0b3RhbCBwbGF5IHRpbWVcclxuICAgICAgICB0b3RhbFBsYXlUaW1lQ2FsY3VsYXRvcigpO1xyXG4gICAgICAgIHZhciB0aW1lT2Zmc2V0ID0gY29uZHVjdG9yLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSAtIHRvdGFsUGxheVRpbWUsXHJcbiAgICAgICAgICAgIHBsYXlOb3RlcyA9IGZ1bmN0aW9uKG5vdGVzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSAtMTtcclxuICAgICAgICAgICAgICAgIHdoaWxlICgrK2luZGV4IDwgbm90ZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vdGUgPSBub3Rlc1tpbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXJ0VGltZSA9IG5vdGUuc3RhcnRUaW1lICsgdGltZU9mZnNldCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcFRpbWUgPSBub3RlLnN0b3BUaW1lICsgdGltZU9mZnNldDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICogSWYgbm8gdGllLCB0aGVuIHdlIG5lZWQgdG8gaW50cm9kdWNlIGEgdm9sdW1lIHJhbXAgdXAgdG8gcmVtb3ZlIGFueSBjbGlwcGluZ1xyXG4gICAgICAgICAgICAgICAgICAgICAqIGFzIE9zY2lsbGF0b3JzIGhhdmUgYW4gaXNzdWUgd2l0aCB0aGlzIHdoZW4gcGxheWluZyBhIG5vdGUgYXQgZnVsbCB2b2x1bWUuXHJcbiAgICAgICAgICAgICAgICAgICAgICogV2UgYWxzbyBwdXQgaW4gYSBzbGlnaHQgcmFtcCBkb3duIGFzIHdlbGwuICBUaGlzIG9ubHkgdGFrZXMgdXAgMS8xMDAwIG9mIGEgc2Vjb25kLlxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghIG5vdGUudGllKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFydFRpbWUgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFRpbWUgLT0gMC4wMDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcFRpbWUgKz0gMC4wMDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdGUuZ2Fpbi5nYWluLnNldFZhbHVlQXRUaW1lKDAuMCwgc3RhcnRUaW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm90ZS5nYWluLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUobm90ZS52b2x1bWVMZXZlbCwgc3RhcnRUaW1lICsgMC4wMDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3RlLmdhaW4uZ2Fpbi5zZXRWYWx1ZUF0VGltZShub3RlLnZvbHVtZUxldmVsLCBzdG9wVGltZSAtIDAuMDAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm90ZS5nYWluLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMC4wLCBzdG9wVGltZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBub3RlLm5vZGUuc3RhcnQoc3RhcnRUaW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBub3RlLm5vZGUuc3RvcChzdG9wVGltZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGJ1ZmZlclVwID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBidWZmZXJUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiBidWZmZXJJbk5ld05vdGVzKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIucGxheWluZyAmJiAhIHBsYXllci5wYXVzZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld05vdGVzID0gYnVmZmVyTm90ZXMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld05vdGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXlOb3RlcyhuZXdOb3Rlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxOb3RlcyA9IGFsbE5vdGVzLmNvbmNhdChuZXdOb3Rlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXJVcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgY29uZHVjdG9yLnRlbXBvICogNTAwMCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIHBsYXlOb3RlcyhhbGxOb3Rlcyk7XHJcbiAgICAgICAgYnVmZmVyVXAoKTtcclxuXHJcbiAgICAgICAgaWYgKGZhZGVkICYmICEgcGxheWVyLm11dGVkKSB7XHJcbiAgICAgICAgICAgIGZhZGUoJ3VwJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogU3RvcCBwbGF5aW5nIGFsbCBtdXNpYyBhbmQgcmV3aW5kIHRoZSBzb25nXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGZhZGVPdXQgYm9vbGVhbiAtIHNob3VsZCB0aGUgc29uZyBmYWRlIG91dD9cclxuICAgICAqL1xyXG4gICAgcGxheWVyLnN0b3AgPSBmdW5jdGlvbihmYWRlT3V0KSB7XHJcbiAgICAgICAgcGxheWVyLnBsYXlpbmcgPSBmYWxzZTtcclxuICAgICAgICBjb25kdWN0b3IuY3VycmVudFNlY29uZHMgPSAwO1xyXG4gICAgICAgIGNvbmR1Y3Rvci5wZXJjZW50YWdlQ29tcGxldGUgPSAwO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGZhZGVPdXQgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIGZhZGVPdXQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZmFkZU91dCAmJiAhIHBsYXllci5tdXRlZCkge1xyXG4gICAgICAgICAgICBmYWRlKCdkb3duJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB0b3RhbFBsYXlUaW1lID0gMDtcclxuICAgICAgICAgICAgICAgIHJlc2V0KCk7XHJcbiAgICAgICAgICAgICAgICAvLyBNYWtlIGNhbGxiYWNrIGFzeW5jaHJvbm91c1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25kdWN0b3Iub25UaWNrZXJDYWxsYmFjayhjb25kdWN0b3IuY3VycmVudFNlY29uZHMpO1xyXG4gICAgICAgICAgICAgICAgfSwgMSk7XHJcbiAgICAgICAgICAgIH0sIHRydWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRvdGFsUGxheVRpbWUgPSAwO1xyXG4gICAgICAgICAgICByZXNldCgpO1xyXG4gICAgICAgICAgICAvLyBNYWtlIGNhbGxiYWNrIGFzeW5jaHJvbm91c1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY29uZHVjdG9yLm9uVGlja2VyQ2FsbGJhY2soY29uZHVjdG9yLmN1cnJlbnRTZWNvbmRzKTtcclxuICAgICAgICAgICAgfSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFBhdXNlcyB0aGUgbXVzaWMsIHJlc2V0cyB0aGUgbm90ZXMsXHJcbiAgICAgKiBhbmQgZ2V0cyB0aGUgdG90YWwgdGltZSBwbGF5ZWQgc28gZmFyXHJcbiAgICAgKi9cclxuICAgIHBsYXllci5wYXVzZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHBsYXllci5wYXVzZWQgPSB0cnVlO1xyXG4gICAgICAgIHVwZGF0ZVRvdGFsUGxheVRpbWUoKTtcclxuICAgICAgICBpZiAocGxheWVyLm11dGVkKSB7XHJcbiAgICAgICAgICAgIHJlc2V0KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZmFkZSgnZG93bicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmVzZXQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCB0cnVlIGlmIHlvdSB3YW50IHRoZSBzb25nIHRvIGxvb3BcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdmFsXHJcbiAgICAgKi9cclxuICAgIHBsYXllci5sb29wID0gZnVuY3Rpb24odmFsKSB7XHJcbiAgICAgICAgcGxheWVyLmxvb3BpbmcgPSAhISB2YWw7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IGEgc3BlY2lmaWMgdGltZSB0aGF0IHRoZSBzb25nIHNob3VsZCBzdGFydCBpdC5cclxuICAgICAqIElmIGl0J3MgYWxyZWFkeSBwbGF5aW5nLCByZXNldCBhbmQgc3RhcnQgdGhlIHNvbmdcclxuICAgICAqIGFnYWluIHNvIGl0IGhhcyBhIHNlYW1sZXNzIGp1bXAuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIG5ld1RpbWVcclxuICAgICAqL1xyXG4gICAgcGxheWVyLnNldFRpbWUgPSBmdW5jdGlvbihuZXdUaW1lKSB7XHJcbiAgICAgICAgdG90YWxQbGF5VGltZSA9IHBhcnNlSW50KG5ld1RpbWUpO1xyXG4gICAgICAgIHJlc2V0KCk7XHJcbiAgICAgICAgaWYgKHBsYXllci5wbGF5aW5nICYmICEgcGxheWVyLnBhdXNlZCkge1xyXG4gICAgICAgICAgICBwbGF5ZXIucGxheSgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXNldCB0aGUgdGVtcG8gZm9yIGEgc29uZy4gVGhpcyB3aWxsIHRyaWdnZXIgYVxyXG4gICAgICogZHVyYXRpb24gcmVzZXQgZm9yIGVhY2ggaW5zdHJ1bWVudCBhcyB3ZWxsLlxyXG4gICAgICovXHJcbiAgICBwbGF5ZXIucmVzZXRUZW1wbyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJlc2V0KHRydWUpO1xyXG4gICAgICAgIGlmIChwbGF5ZXIucGxheWluZyAmJiAhIHBsYXllci5wYXVzZWQpIHtcclxuICAgICAgICAgICAgcGxheWVyLnBsYXkoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTXV0ZSBhbGwgb2YgdGhlIG11c2ljXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNiIC0gQ2FsbGJhY2sgZnVuY3Rpb24gY2FsbGVkIHdoZW4gbXVzaWMgaGFzIGJlZW4gbXV0ZWRcclxuICAgICAqL1xyXG4gICAgcGxheWVyLm11dGUgPSBmdW5jdGlvbihjYikge1xyXG4gICAgICAgIHBsYXllci5tdXRlZCA9IHRydWU7XHJcbiAgICAgICAgZmFkZSgnZG93bicsIGNiKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVbm11dGUgYWxsIG9mIHRoZSBtdXNpY1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjYiAtIENhbGxiYWNrIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIG11c2ljIGhhcyBiZWVuIHVubXV0ZWRcclxuICAgICAqL1xyXG4gICAgcGxheWVyLnVubXV0ZSA9IGZ1bmN0aW9uKGNiKSB7XHJcbiAgICAgICAgcGxheWVyLm11dGVkID0gZmFsc2U7XHJcbiAgICAgICAgZmFkZSgndXAnLCBjYik7XHJcbiAgICB9O1xyXG59XHJcblxyXG59LHt9XSw4OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcclxuLyoqXHJcbiAqIEJhbmQuanMgLSBNdXNpYyBDb21wb3NlclxyXG4gKiBBbiBpbnRlcmZhY2UgZm9yIHRoZSBXZWIgQXVkaW8gQVBJIHRoYXQgc3VwcG9ydHMgcmh5dGhtcywgbXVsdGlwbGUgaW5zdHJ1bWVudHMsIHJlcGVhdGluZyBzZWN0aW9ucywgYW5kIGNvbXBsZXhcclxuICogdGltZSBzaWduYXR1cmVzLlxyXG4gKlxyXG4gKiBAYXV0aG9yIENvZHkgTHVuZHF1aXN0IChodHRwOi8vZ2l0aHViLmNvbS9tZWVuaWUpIC0gMjAxNFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBFdXJvcGVhbiBSaHl0aG0gUGFja1xyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBzZW1pYnJldmU6IDEsXHJcbiAgICBkb3R0ZWRNaW5pbTogMC43NSxcclxuICAgIG1pbmltOiAwLjUsXHJcbiAgICBkb3R0ZWRDcm90Y2hldDogMC4zNzUsXHJcbiAgICB0cmlwbGV0TWluaW06IDAuMzMzMzMzMzQsXHJcbiAgICBjcm90Y2hldDogMC4yNSxcclxuICAgIGRvdHRlZFF1YXZlcjogMC4xODc1LFxyXG4gICAgdHJpcGxldENyb3RjaGV0OiAwLjE2NjY2NjY2NyxcclxuICAgIHF1YXZlcjogMC4xMjUsXHJcbiAgICBkb3R0ZWRTZW1pcXVhdmVyOiAwLjA5Mzc1LFxyXG4gICAgdHJpcGxldFF1YXZlcjogMC4wODMzMzMzMzMsXHJcbiAgICBzZW1pcXVhdmVyOiAwLjA2MjUsXHJcbiAgICB0cmlwbGV0U2VtaXF1YXZlcjogMC4wNDE2NjY2NjcsXHJcbiAgICBkZW1pc2VtaXF1YXZlcjogMC4wMzEyNVxyXG59O1xyXG5cclxufSx7fV0sOTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XHJcbi8qKlxyXG4gKiBCYW5kLmpzIC0gTXVzaWMgQ29tcG9zZXJcclxuICogQW4gaW50ZXJmYWNlIGZvciB0aGUgV2ViIEF1ZGlvIEFQSSB0aGF0IHN1cHBvcnRzIHJoeXRobXMsIG11bHRpcGxlIGluc3RydW1lbnRzLCByZXBlYXRpbmcgc2VjdGlvbnMsIGFuZCBjb21wbGV4XHJcbiAqIHRpbWUgc2lnbmF0dXJlcy5cclxuICpcclxuICogQGF1dGhvciBDb2R5IEx1bmRxdWlzdCAoaHR0cDovL2dpdGh1Yi5jb20vbWVlbmllKSAtIDIwMTRcclxuICovXHJcblxyXG4vKipcclxuICogTm9ydGggQW1lcmljYW4gKENhbmFkYSBhbmQgVVNBKSBSaHl0aG0gUGFja1xyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICB3aG9sZTogMSxcclxuICAgIGRvdHRlZEhhbGY6IDAuNzUsXHJcbiAgICBoYWxmOiAwLjUsXHJcbiAgICBkb3R0ZWRRdWFydGVyOiAwLjM3NSxcclxuICAgIHRyaXBsZXRIYWxmOiAwLjMzMzMzMzM0LFxyXG4gICAgcXVhcnRlcjogMC4yNSxcclxuICAgIGRvdHRlZEVpZ2h0aDogMC4xODc1LFxyXG4gICAgdHJpcGxldFF1YXJ0ZXI6IDAuMTY2NjY2NjY3LFxyXG4gICAgZWlnaHRoOiAwLjEyNSxcclxuICAgIGRvdHRlZFNpeHRlZW50aDogMC4wOTM3NSxcclxuICAgIHRyaXBsZXRFaWdodGg6IDAuMDgzMzMzMzMzLFxyXG4gICAgc2l4dGVlbnRoOiAwLjA2MjUsXHJcbiAgICB0cmlwbGV0U2l4dGVlbnRoOiAwLjA0MTY2NjY2NyxcclxuICAgIHRoaXJ0eVNlY29uZDogMC4wMzEyNVxyXG59O1xyXG5cclxufSx7fV0sMTA6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xyXG4vKipcclxuICogQmFuZC5qcyAtIE11c2ljIENvbXBvc2VyXHJcbiAqIEFuIGludGVyZmFjZSBmb3IgdGhlIFdlYiBBdWRpbyBBUEkgdGhhdCBzdXBwb3J0cyByaHl0aG1zLCBtdWx0aXBsZSBpbnN0cnVtZW50cywgcmVwZWF0aW5nIHNlY3Rpb25zLCBhbmQgY29tcGxleFxyXG4gKiB0aW1lIHNpZ25hdHVyZXMuXHJcbiAqXHJcbiAqIEBhdXRob3IgQ29keSBMdW5kcXVpc3QgKGh0dHA6Ly9naXRodWIuY29tL21lZW5pZSkgLSAyMDE0XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEVxdWFsIFRlbXBlcmFtZW50IFR1bmluZ1xyXG4gKiBTb3VyY2U6IGh0dHA6Ly93d3cucGh5Lm10dS5lZHUvfnN1aXRzL25vdGVmcmVxcy5odG1sXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgICdDMCc6IDE2LjM1LFxyXG4gICAgJ0MjMCc6IDE3LjMyLFxyXG4gICAgJ0RiMCc6IDE3LjMyLFxyXG4gICAgJ0QwJzogMTguMzUsXHJcbiAgICAnRCMwJzogMTkuNDUsXHJcbiAgICAnRWIwJzogMTkuNDUsXHJcbiAgICAnRTAnOiAyMC42MCxcclxuICAgICdGMCc6IDIxLjgzLFxyXG4gICAgJ0YjMCc6IDIzLjEyLFxyXG4gICAgJ0diMCc6IDIzLjEyLFxyXG4gICAgJ0cwJzogMjQuNTAsXHJcbiAgICAnRyMwJzogMjUuOTYsXHJcbiAgICAnQWIwJzogMjUuOTYsXHJcbiAgICAnQTAnOiAyNy41MCxcclxuICAgICdBIzAnOiAyOS4xNCxcclxuICAgICdCYjAnOiAyOS4xNCxcclxuICAgICdCMCc6IDMwLjg3LFxyXG4gICAgJ0MxJzogMzIuNzAsXHJcbiAgICAnQyMxJzogMzQuNjUsXHJcbiAgICAnRGIxJzogMzQuNjUsXHJcbiAgICAnRDEnOiAzNi43MSxcclxuICAgICdEIzEnOiAzOC44OSxcclxuICAgICdFYjEnOiAzOC44OSxcclxuICAgICdFMSc6IDQxLjIwLFxyXG4gICAgJ0YxJzogNDMuNjUsXHJcbiAgICAnRiMxJzogNDYuMjUsXHJcbiAgICAnR2IxJzogNDYuMjUsXHJcbiAgICAnRzEnOiA0OS4wMCxcclxuICAgICdHIzEnOiA1MS45MSxcclxuICAgICdBYjEnOiA1MS45MSxcclxuICAgICdBMSc6IDU1LjAwLFxyXG4gICAgJ0EjMSc6IDU4LjI3LFxyXG4gICAgJ0JiMSc6IDU4LjI3LFxyXG4gICAgJ0IxJzogNjEuNzQsXHJcbiAgICAnQzInOiA2NS40MSxcclxuICAgICdDIzInOiA2OS4zMCxcclxuICAgICdEYjInOiA2OS4zMCxcclxuICAgICdEMic6IDczLjQyLFxyXG4gICAgJ0QjMic6IDc3Ljc4LFxyXG4gICAgJ0ViMic6IDc3Ljc4LFxyXG4gICAgJ0UyJzogODIuNDEsXHJcbiAgICAnRjInOiA4Ny4zMSxcclxuICAgICdGIzInOiA5Mi41MCxcclxuICAgICdHYjInOiA5Mi41MCxcclxuICAgICdHMic6IDk4LjAwLFxyXG4gICAgJ0cjMic6IDEwMy44MyxcclxuICAgICdBYjInOiAxMDMuODMsXHJcbiAgICAnQTInOiAxMTAuMDAsXHJcbiAgICAnQSMyJzogMTE2LjU0LFxyXG4gICAgJ0JiMic6IDExNi41NCxcclxuICAgICdCMic6IDEyMy40NyxcclxuICAgICdDMyc6IDEzMC44MSxcclxuICAgICdDIzMnOiAxMzguNTksXHJcbiAgICAnRGIzJzogMTM4LjU5LFxyXG4gICAgJ0QzJzogMTQ2LjgzLFxyXG4gICAgJ0QjMyc6IDE1NS41NixcclxuICAgICdFYjMnOiAxNTUuNTYsXHJcbiAgICAnRTMnOiAxNjQuODEsXHJcbiAgICAnRjMnOiAxNzQuNjEsXHJcbiAgICAnRiMzJzogMTg1LjAwLFxyXG4gICAgJ0diMyc6IDE4NS4wMCxcclxuICAgICdHMyc6IDE5Ni4wMCxcclxuICAgICdHIzMnOiAyMDcuNjUsXHJcbiAgICAnQWIzJzogMjA3LjY1LFxyXG4gICAgJ0EzJzogMjIwLjAwLFxyXG4gICAgJ0EjMyc6IDIzMy4wOCxcclxuICAgICdCYjMnOiAyMzMuMDgsXHJcbiAgICAnQjMnOiAyNDYuOTQsXHJcbiAgICAnQzQnOiAyNjEuNjMsXHJcbiAgICAnQyM0JzogMjc3LjE4LFxyXG4gICAgJ0RiNCc6IDI3Ny4xOCxcclxuICAgICdENCc6IDI5My42NixcclxuICAgICdEIzQnOiAzMTEuMTMsXHJcbiAgICAnRWI0JzogMzExLjEzLFxyXG4gICAgJ0U0JzogMzI5LjYzLFxyXG4gICAgJ0Y0JzogMzQ5LjIzLFxyXG4gICAgJ0YjNCc6IDM2OS45OSxcclxuICAgICdHYjQnOiAzNjkuOTksXHJcbiAgICAnRzQnOiAzOTIuMDAsXHJcbiAgICAnRyM0JzogNDE1LjMwLFxyXG4gICAgJ0FiNCc6IDQxNS4zMCxcclxuICAgICdBNCc6IDQ0MC4wMCxcclxuICAgICdBIzQnOiA0NjYuMTYsXHJcbiAgICAnQmI0JzogNDY2LjE2LFxyXG4gICAgJ0I0JzogNDkzLjg4LFxyXG4gICAgJ0M1JzogNTIzLjI1LFxyXG4gICAgJ0MjNSc6IDU1NC4zNyxcclxuICAgICdEYjUnOiA1NTQuMzcsXHJcbiAgICAnRDUnOiA1ODcuMzMsXHJcbiAgICAnRCM1JzogNjIyLjI1LFxyXG4gICAgJ0ViNSc6IDYyMi4yNSxcclxuICAgICdFNSc6IDY1OS4yNixcclxuICAgICdGNSc6IDY5OC40NixcclxuICAgICdGIzUnOiA3MzkuOTksXHJcbiAgICAnR2I1JzogNzM5Ljk5LFxyXG4gICAgJ0c1JzogNzgzLjk5LFxyXG4gICAgJ0cjNSc6IDgzMC42MSxcclxuICAgICdBYjUnOiA4MzAuNjEsXHJcbiAgICAnQTUnOiA4ODAuMDAsXHJcbiAgICAnQSM1JzogOTMyLjMzLFxyXG4gICAgJ0JiNSc6IDkzMi4zMyxcclxuICAgICdCNSc6IDk4Ny43NyxcclxuICAgICdDNic6IDEwNDYuNTAsXHJcbiAgICAnQyM2JzogMTEwOC43MyxcclxuICAgICdEYjYnOiAxMTA4LjczLFxyXG4gICAgJ0Q2JzogMTE3NC42NixcclxuICAgICdEIzYnOiAxMjQ0LjUxLFxyXG4gICAgJ0ViNic6IDEyNDQuNTEsXHJcbiAgICAnRTYnOiAxMzE4LjUxLFxyXG4gICAgJ0Y2JzogMTM5Ni45MSxcclxuICAgICdGIzYnOiAxNDc5Ljk4LFxyXG4gICAgJ0diNic6IDE0NzkuOTgsXHJcbiAgICAnRzYnOiAxNTY3Ljk4LFxyXG4gICAgJ0cjNic6IDE2NjEuMjIsXHJcbiAgICAnQWI2JzogMTY2MS4yMixcclxuICAgICdBNic6IDE3NjAuMDAsXHJcbiAgICAnQSM2JzogMTg2NC42NixcclxuICAgICdCYjYnOiAxODY0LjY2LFxyXG4gICAgJ0I2JzogMTk3NS41MyxcclxuICAgICdDNyc6IDIwOTMuMDAsXHJcbiAgICAnQyM3JzogMjIxNy40NixcclxuICAgICdEYjcnOiAyMjE3LjQ2LFxyXG4gICAgJ0Q3JzogMjM0OS4zMixcclxuICAgICdEIzcnOiAyNDg5LjAyLFxyXG4gICAgJ0ViNyc6IDI0ODkuMDIsXHJcbiAgICAnRTcnOiAyNjM3LjAyLFxyXG4gICAgJ0Y3JzogMjc5My44MyxcclxuICAgICdGIzcnOiAyOTU5Ljk2LFxyXG4gICAgJ0diNyc6IDI5NTkuOTYsXHJcbiAgICAnRzcnOiAzMTM1Ljk2LFxyXG4gICAgJ0cjNyc6IDMzMjIuNDQsXHJcbiAgICAnQWI3JzogMzMyMi40NCxcclxuICAgICdBNyc6IDM1MjAuMDAsXHJcbiAgICAnQSM3JzogMzcyOS4zMSxcclxuICAgICdCYjcnOiAzNzI5LjMxLFxyXG4gICAgJ0I3JzogMzk1MS4wNyxcclxuICAgICdDOCc6IDQxODYuMDFcclxufTtcclxuXHJcbn0se31dfSx7fSxbNl0pXHJcbig2KVxyXG59KTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfYXJyYXlMaWtlVG9BcnJheShhcnIsIGxlbikge1xuICBpZiAobGVuID09IG51bGwgfHwgbGVuID4gYXJyLmxlbmd0aCkgbGVuID0gYXJyLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIHtcbiAgICBhcnIyW2ldID0gYXJyW2ldO1xuICB9XG5cbiAgcmV0dXJuIGFycjI7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX2FycmF5V2l0aEhvbGVzKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gYXJyO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikge1xuICBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7XG4gICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO1xuICB9XG5cbiAgcmV0dXJuIHNlbGY7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn0iLCJmdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICByZXR1cm4gQ29uc3RydWN0b3I7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5IGluIG9iaikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqW2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHtcbiAgX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHtcbiAgICByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pO1xuICB9O1xuICByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pO1xufSIsImltcG9ydCBzZXRQcm90b3R5cGVPZiBmcm9tIFwiLi9zZXRQcm90b3R5cGVPZlwiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7XG4gIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7XG4gIH1cblxuICBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHtcbiAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgdmFsdWU6IHN1YkNsYXNzLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9XG4gIH0pO1xuICBpZiAoc3VwZXJDbGFzcykgc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHtcbiAgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwidW5kZWZpbmVkXCIgfHwgIShTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGFycikpKSByZXR1cm47XG4gIHZhciBfYXJyID0gW107XG4gIHZhciBfbiA9IHRydWU7XG4gIHZhciBfZCA9IGZhbHNlO1xuICB2YXIgX2UgPSB1bmRlZmluZWQ7XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBfaSA9IGFycltTeW1ib2wuaXRlcmF0b3JdKCksIF9zOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7XG4gICAgICBfYXJyLnB1c2goX3MudmFsdWUpO1xuXG4gICAgICBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBfZCA9IHRydWU7XG4gICAgX2UgPSBlcnI7XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICghX24gJiYgX2lbXCJyZXR1cm5cIl0gIT0gbnVsbCkgX2lbXCJyZXR1cm5cIl0oKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKF9kKSB0aHJvdyBfZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gX2Fycjtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfbm9uSXRlcmFibGVSZXN0KCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpO1xufSIsImltcG9ydCBfdHlwZW9mIGZyb20gXCIuLi8uLi9oZWxwZXJzL2VzbS90eXBlb2ZcIjtcbmltcG9ydCBhc3NlcnRUaGlzSW5pdGlhbGl6ZWQgZnJvbSBcIi4vYXNzZXJ0VGhpc0luaXRpYWxpemVkXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7XG4gIGlmIChjYWxsICYmIChfdHlwZW9mKGNhbGwpID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpKSB7XG4gICAgcmV0dXJuIGNhbGw7XG4gIH1cblxuICByZXR1cm4gYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7XG4gIF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkge1xuICAgIG8uX19wcm90b19fID0gcDtcbiAgICByZXR1cm4gbztcbiAgfTtcblxuICByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApO1xufSIsImltcG9ydCBhcnJheVdpdGhIb2xlcyBmcm9tIFwiLi9hcnJheVdpdGhIb2xlc1wiO1xuaW1wb3J0IGl0ZXJhYmxlVG9BcnJheUxpbWl0IGZyb20gXCIuL2l0ZXJhYmxlVG9BcnJheUxpbWl0XCI7XG5pbXBvcnQgdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkgZnJvbSBcIi4vdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXlcIjtcbmltcG9ydCBub25JdGVyYWJsZVJlc3QgZnJvbSBcIi4vbm9uSXRlcmFibGVSZXN0XCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfc2xpY2VkVG9BcnJheShhcnIsIGkpIHtcbiAgcmV0dXJuIGFycmF5V2l0aEhvbGVzKGFycikgfHwgaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB8fCB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIsIGkpIHx8IG5vbkl0ZXJhYmxlUmVzdCgpO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gIFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjtcblxuICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHtcbiAgICBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb2JqO1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIF90eXBlb2Yob2JqKTtcbn0iLCJpbXBvcnQgYXJyYXlMaWtlVG9BcnJheSBmcm9tIFwiLi9hcnJheUxpa2VUb0FycmF5XCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobywgbWluTGVuKSB7XG4gIGlmICghbykgcmV0dXJuO1xuICBpZiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIpIHJldHVybiBhcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7XG4gIHZhciBuID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLnNsaWNlKDgsIC0xKTtcbiAgaWYgKG4gPT09IFwiT2JqZWN0XCIgJiYgby5jb25zdHJ1Y3RvcikgbiA9IG8uY29uc3RydWN0b3IubmFtZTtcbiAgaWYgKG4gPT09IFwiTWFwXCIgfHwgbiA9PT0gXCJTZXRcIikgcmV0dXJuIEFycmF5LmZyb20obyk7XG4gIGlmIChuID09PSBcIkFyZ3VtZW50c1wiIHx8IC9eKD86VWl8SSludCg/Ojh8MTZ8MzIpKD86Q2xhbXBlZCk/QXJyYXkkLy50ZXN0KG4pKSByZXR1cm4gYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xufSIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvYXhpb3MnKTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciBzZXR0bGUgPSByZXF1aXJlKCcuLy4uL2NvcmUvc2V0dGxlJyk7XG52YXIgYnVpbGRVUkwgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvYnVpbGRVUkwnKTtcbnZhciBidWlsZEZ1bGxQYXRoID0gcmVxdWlyZSgnLi4vY29yZS9idWlsZEZ1bGxQYXRoJyk7XG52YXIgcGFyc2VIZWFkZXJzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL3BhcnNlSGVhZGVycycpO1xudmFyIGlzVVJMU2FtZU9yaWdpbiA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9pc1VSTFNhbWVPcmlnaW4nKTtcbnZhciBjcmVhdGVFcnJvciA9IHJlcXVpcmUoJy4uL2NvcmUvY3JlYXRlRXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB4aHJBZGFwdGVyKGNvbmZpZykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gZGlzcGF0Y2hYaHJSZXF1ZXN0KHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciByZXF1ZXN0RGF0YSA9IGNvbmZpZy5kYXRhO1xuICAgIHZhciByZXF1ZXN0SGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzO1xuXG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEocmVxdWVzdERhdGEpKSB7XG4gICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddOyAvLyBMZXQgdGhlIGJyb3dzZXIgc2V0IGl0XG4gICAgfVxuXG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgIC8vIEhUVFAgYmFzaWMgYXV0aGVudGljYXRpb25cbiAgICBpZiAoY29uZmlnLmF1dGgpIHtcbiAgICAgIHZhciB1c2VybmFtZSA9IGNvbmZpZy5hdXRoLnVzZXJuYW1lIHx8ICcnO1xuICAgICAgdmFyIHBhc3N3b3JkID0gY29uZmlnLmF1dGgucGFzc3dvcmQgfHwgJyc7XG4gICAgICByZXF1ZXN0SGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0Jhc2ljICcgKyBidG9hKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpO1xuICAgIH1cblxuICAgIHZhciBmdWxsUGF0aCA9IGJ1aWxkRnVsbFBhdGgoY29uZmlnLmJhc2VVUkwsIGNvbmZpZy51cmwpO1xuICAgIHJlcXVlc3Qub3Blbihjb25maWcubWV0aG9kLnRvVXBwZXJDYXNlKCksIGJ1aWxkVVJMKGZ1bGxQYXRoLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplciksIHRydWUpO1xuXG4gICAgLy8gU2V0IHRoZSByZXF1ZXN0IHRpbWVvdXQgaW4gTVNcbiAgICByZXF1ZXN0LnRpbWVvdXQgPSBjb25maWcudGltZW91dDtcblxuICAgIC8vIExpc3RlbiBmb3IgcmVhZHkgc3RhdGVcbiAgICByZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uIGhhbmRsZUxvYWQoKSB7XG4gICAgICBpZiAoIXJlcXVlc3QgfHwgcmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gVGhlIHJlcXVlc3QgZXJyb3JlZCBvdXQgYW5kIHdlIGRpZG4ndCBnZXQgYSByZXNwb25zZSwgdGhpcyB3aWxsIGJlXG4gICAgICAvLyBoYW5kbGVkIGJ5IG9uZXJyb3IgaW5zdGVhZFxuICAgICAgLy8gV2l0aCBvbmUgZXhjZXB0aW9uOiByZXF1ZXN0IHRoYXQgdXNpbmcgZmlsZTogcHJvdG9jb2wsIG1vc3QgYnJvd3NlcnNcbiAgICAgIC8vIHdpbGwgcmV0dXJuIHN0YXR1cyBhcyAwIGV2ZW4gdGhvdWdoIGl0J3MgYSBzdWNjZXNzZnVsIHJlcXVlc3RcbiAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMCAmJiAhKHJlcXVlc3QucmVzcG9uc2VVUkwgJiYgcmVxdWVzdC5yZXNwb25zZVVSTC5pbmRleE9mKCdmaWxlOicpID09PSAwKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFByZXBhcmUgdGhlIHJlc3BvbnNlXG4gICAgICB2YXIgcmVzcG9uc2VIZWFkZXJzID0gJ2dldEFsbFJlc3BvbnNlSGVhZGVycycgaW4gcmVxdWVzdCA/IHBhcnNlSGVhZGVycyhyZXF1ZXN0LmdldEFsbFJlc3BvbnNlSGVhZGVycygpKSA6IG51bGw7XG4gICAgICB2YXIgcmVzcG9uc2VEYXRhID0gIWNvbmZpZy5yZXNwb25zZVR5cGUgfHwgY29uZmlnLnJlc3BvbnNlVHlwZSA9PT0gJ3RleHQnID8gcmVxdWVzdC5yZXNwb25zZVRleHQgOiByZXF1ZXN0LnJlc3BvbnNlO1xuICAgICAgdmFyIHJlc3BvbnNlID0ge1xuICAgICAgICBkYXRhOiByZXNwb25zZURhdGEsXG4gICAgICAgIHN0YXR1czogcmVxdWVzdC5zdGF0dXMsXG4gICAgICAgIHN0YXR1c1RleHQ6IHJlcXVlc3Quc3RhdHVzVGV4dCxcbiAgICAgICAgaGVhZGVyczogcmVzcG9uc2VIZWFkZXJzLFxuICAgICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgICAgcmVxdWVzdDogcmVxdWVzdFxuICAgICAgfTtcblxuICAgICAgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIGJyb3dzZXIgcmVxdWVzdCBjYW5jZWxsYXRpb24gKGFzIG9wcG9zZWQgdG8gYSBtYW51YWwgY2FuY2VsbGF0aW9uKVxuICAgIHJlcXVlc3Qub25hYm9ydCA9IGZ1bmN0aW9uIGhhbmRsZUFib3J0KCkge1xuICAgICAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCdSZXF1ZXN0IGFib3J0ZWQnLCBjb25maWcsICdFQ09OTkFCT1JURUQnLCByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgbG93IGxldmVsIG5ldHdvcmsgZXJyb3JzXG4gICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gaGFuZGxlRXJyb3IoKSB7XG4gICAgICAvLyBSZWFsIGVycm9ycyBhcmUgaGlkZGVuIGZyb20gdXMgYnkgdGhlIGJyb3dzZXJcbiAgICAgIC8vIG9uZXJyb3Igc2hvdWxkIG9ubHkgZmlyZSBpZiBpdCdzIGEgbmV0d29yayBlcnJvclxuICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCdOZXR3b3JrIEVycm9yJywgY29uZmlnLCBudWxsLCByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgdGltZW91dFxuICAgIHJlcXVlc3Qub250aW1lb3V0ID0gZnVuY3Rpb24gaGFuZGxlVGltZW91dCgpIHtcbiAgICAgIHZhciB0aW1lb3V0RXJyb3JNZXNzYWdlID0gJ3RpbWVvdXQgb2YgJyArIGNvbmZpZy50aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJztcbiAgICAgIGlmIChjb25maWcudGltZW91dEVycm9yTWVzc2FnZSkge1xuICAgICAgICB0aW1lb3V0RXJyb3JNZXNzYWdlID0gY29uZmlnLnRpbWVvdXRFcnJvck1lc3NhZ2U7XG4gICAgICB9XG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IodGltZW91dEVycm9yTWVzc2FnZSwgY29uZmlnLCAnRUNPTk5BQk9SVEVEJyxcbiAgICAgICAgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gQWRkIHhzcmYgaGVhZGVyXG4gICAgLy8gVGhpcyBpcyBvbmx5IGRvbmUgaWYgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnQuXG4gICAgLy8gU3BlY2lmaWNhbGx5IG5vdCBpZiB3ZSdyZSBpbiBhIHdlYiB3b3JrZXIsIG9yIHJlYWN0LW5hdGl2ZS5cbiAgICBpZiAodXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSkge1xuICAgICAgdmFyIGNvb2tpZXMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvY29va2llcycpO1xuXG4gICAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAgIHZhciB4c3JmVmFsdWUgPSAoY29uZmlnLndpdGhDcmVkZW50aWFscyB8fCBpc1VSTFNhbWVPcmlnaW4oZnVsbFBhdGgpKSAmJiBjb25maWcueHNyZkNvb2tpZU5hbWUgP1xuICAgICAgICBjb29raWVzLnJlYWQoY29uZmlnLnhzcmZDb29raWVOYW1lKSA6XG4gICAgICAgIHVuZGVmaW5lZDtcblxuICAgICAgaWYgKHhzcmZWYWx1ZSkge1xuICAgICAgICByZXF1ZXN0SGVhZGVyc1tjb25maWcueHNyZkhlYWRlck5hbWVdID0geHNyZlZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFkZCBoZWFkZXJzIHRvIHRoZSByZXF1ZXN0XG4gICAgaWYgKCdzZXRSZXF1ZXN0SGVhZGVyJyBpbiByZXF1ZXN0KSB7XG4gICAgICB1dGlscy5mb3JFYWNoKHJlcXVlc3RIZWFkZXJzLCBmdW5jdGlvbiBzZXRSZXF1ZXN0SGVhZGVyKHZhbCwga2V5KSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdERhdGEgPT09ICd1bmRlZmluZWQnICYmIGtleS50b0xvd2VyQ2FzZSgpID09PSAnY29udGVudC10eXBlJykge1xuICAgICAgICAgIC8vIFJlbW92ZSBDb250ZW50LVR5cGUgaWYgZGF0YSBpcyB1bmRlZmluZWRcbiAgICAgICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBPdGhlcndpc2UgYWRkIGhlYWRlciB0byB0aGUgcmVxdWVzdFxuICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihrZXksIHZhbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFkZCB3aXRoQ3JlZGVudGlhbHMgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMpKSB7XG4gICAgICByZXF1ZXN0LndpdGhDcmVkZW50aWFscyA9ICEhY29uZmlnLndpdGhDcmVkZW50aWFscztcbiAgICB9XG5cbiAgICAvLyBBZGQgcmVzcG9uc2VUeXBlIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG4gICAgaWYgKGNvbmZpZy5yZXNwb25zZVR5cGUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gY29uZmlnLnJlc3BvbnNlVHlwZTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gRXhwZWN0ZWQgRE9NRXhjZXB0aW9uIHRocm93biBieSBicm93c2VycyBub3QgY29tcGF0aWJsZSBYTUxIdHRwUmVxdWVzdCBMZXZlbCAyLlxuICAgICAgICAvLyBCdXQsIHRoaXMgY2FuIGJlIHN1cHByZXNzZWQgZm9yICdqc29uJyB0eXBlIGFzIGl0IGNhbiBiZSBwYXJzZWQgYnkgZGVmYXVsdCAndHJhbnNmb3JtUmVzcG9uc2UnIGZ1bmN0aW9uLlxuICAgICAgICBpZiAoY29uZmlnLnJlc3BvbnNlVHlwZSAhPT0gJ2pzb24nKSB7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEhhbmRsZSBwcm9ncmVzcyBpZiBuZWVkZWRcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25Eb3dubG9hZFByb2dyZXNzKTtcbiAgICB9XG5cbiAgICAvLyBOb3QgYWxsIGJyb3dzZXJzIHN1cHBvcnQgdXBsb2FkIGV2ZW50c1xuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicgJiYgcmVxdWVzdC51cGxvYWQpIHtcbiAgICAgIHJlcXVlc3QudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICAgIC8vIEhhbmRsZSBjYW5jZWxsYXRpb25cbiAgICAgIGNvbmZpZy5jYW5jZWxUb2tlbi5wcm9taXNlLnRoZW4oZnVuY3Rpb24gb25DYW5jZWxlZChjYW5jZWwpIHtcbiAgICAgICAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVxdWVzdC5hYm9ydCgpO1xuICAgICAgICByZWplY3QoY2FuY2VsKTtcbiAgICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChyZXF1ZXN0RGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXF1ZXN0RGF0YSA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gU2VuZCB0aGUgcmVxdWVzdFxuICAgIHJlcXVlc3Quc2VuZChyZXF1ZXN0RGF0YSk7XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIGJpbmQgPSByZXF1aXJlKCcuL2hlbHBlcnMvYmluZCcpO1xudmFyIEF4aW9zID0gcmVxdWlyZSgnLi9jb3JlL0F4aW9zJyk7XG52YXIgbWVyZ2VDb25maWcgPSByZXF1aXJlKCcuL2NvcmUvbWVyZ2VDb25maWcnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMnKTtcblxuLyoqXG4gKiBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdENvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICogQHJldHVybiB7QXhpb3N9IEEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRDb25maWcpIHtcbiAgdmFyIGNvbnRleHQgPSBuZXcgQXhpb3MoZGVmYXVsdENvbmZpZyk7XG4gIHZhciBpbnN0YW5jZSA9IGJpbmQoQXhpb3MucHJvdG90eXBlLnJlcXVlc3QsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgYXhpb3MucHJvdG90eXBlIHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgQXhpb3MucHJvdG90eXBlLCBjb250ZXh0KTtcblxuICAvLyBDb3B5IGNvbnRleHQgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBjb250ZXh0KTtcblxuICByZXR1cm4gaW5zdGFuY2U7XG59XG5cbi8vIENyZWF0ZSB0aGUgZGVmYXVsdCBpbnN0YW5jZSB0byBiZSBleHBvcnRlZFxudmFyIGF4aW9zID0gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdHMpO1xuXG4vLyBFeHBvc2UgQXhpb3MgY2xhc3MgdG8gYWxsb3cgY2xhc3MgaW5oZXJpdGFuY2VcbmF4aW9zLkF4aW9zID0gQXhpb3M7XG5cbi8vIEZhY3RvcnkgZm9yIGNyZWF0aW5nIG5ldyBpbnN0YW5jZXNcbmF4aW9zLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpbnN0YW5jZUNvbmZpZykge1xuICByZXR1cm4gY3JlYXRlSW5zdGFuY2UobWVyZ2VDb25maWcoYXhpb3MuZGVmYXVsdHMsIGluc3RhbmNlQ29uZmlnKSk7XG59O1xuXG4vLyBFeHBvc2UgQ2FuY2VsICYgQ2FuY2VsVG9rZW5cbmF4aW9zLkNhbmNlbCA9IHJlcXVpcmUoJy4vY2FuY2VsL0NhbmNlbCcpO1xuYXhpb3MuQ2FuY2VsVG9rZW4gPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWxUb2tlbicpO1xuYXhpb3MuaXNDYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9pc0NhbmNlbCcpO1xuXG4vLyBFeHBvc2UgYWxsL3NwcmVhZFxuYXhpb3MuYWxsID0gZnVuY3Rpb24gYWxsKHByb21pc2VzKSB7XG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59O1xuYXhpb3Muc3ByZWFkID0gcmVxdWlyZSgnLi9oZWxwZXJzL3NwcmVhZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGF4aW9zO1xuXG4vLyBBbGxvdyB1c2Ugb2YgZGVmYXVsdCBpbXBvcnQgc3ludGF4IGluIFR5cGVTY3JpcHRcbm1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBheGlvcztcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBBIGBDYW5jZWxgIGlzIGFuIG9iamVjdCB0aGF0IGlzIHRocm93biB3aGVuIGFuIG9wZXJhdGlvbiBpcyBjYW5jZWxlZC5cbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7c3RyaW5nPX0gbWVzc2FnZSBUaGUgbWVzc2FnZS5cbiAqL1xuZnVuY3Rpb24gQ2FuY2VsKG1lc3NhZ2UpIHtcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbn1cblxuQ2FuY2VsLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gJ0NhbmNlbCcgKyAodGhpcy5tZXNzYWdlID8gJzogJyArIHRoaXMubWVzc2FnZSA6ICcnKTtcbn07XG5cbkNhbmNlbC5wcm90b3R5cGUuX19DQU5DRUxfXyA9IHRydWU7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FuY2VsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2FuY2VsID0gcmVxdWlyZSgnLi9DYW5jZWwnKTtcblxuLyoqXG4gKiBBIGBDYW5jZWxUb2tlbmAgaXMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVxdWVzdCBjYW5jZWxsYXRpb24gb2YgYW4gb3BlcmF0aW9uLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZXhlY3V0b3IgVGhlIGV4ZWN1dG9yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBDYW5jZWxUb2tlbihleGVjdXRvcikge1xuICBpZiAodHlwZW9mIGV4ZWN1dG9yICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhlY3V0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuICB9XG5cbiAgdmFyIHJlc29sdmVQcm9taXNlO1xuICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiBwcm9taXNlRXhlY3V0b3IocmVzb2x2ZSkge1xuICAgIHJlc29sdmVQcm9taXNlID0gcmVzb2x2ZTtcbiAgfSk7XG5cbiAgdmFyIHRva2VuID0gdGhpcztcbiAgZXhlY3V0b3IoZnVuY3Rpb24gY2FuY2VsKG1lc3NhZ2UpIHtcbiAgICBpZiAodG9rZW4ucmVhc29uKSB7XG4gICAgICAvLyBDYW5jZWxsYXRpb24gaGFzIGFscmVhZHkgYmVlbiByZXF1ZXN0ZWRcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0b2tlbi5yZWFzb24gPSBuZXcgQ2FuY2VsKG1lc3NhZ2UpO1xuICAgIHJlc29sdmVQcm9taXNlKHRva2VuLnJlYXNvbik7XG4gIH0pO1xufVxuXG4vKipcbiAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gKi9cbkNhbmNlbFRva2VuLnByb3RvdHlwZS50aHJvd0lmUmVxdWVzdGVkID0gZnVuY3Rpb24gdGhyb3dJZlJlcXVlc3RlZCgpIHtcbiAgaWYgKHRoaXMucmVhc29uKSB7XG4gICAgdGhyb3cgdGhpcy5yZWFzb247XG4gIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjb250YWlucyBhIG5ldyBgQ2FuY2VsVG9rZW5gIGFuZCBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLFxuICogY2FuY2VscyB0aGUgYENhbmNlbFRva2VuYC5cbiAqL1xuQ2FuY2VsVG9rZW4uc291cmNlID0gZnVuY3Rpb24gc291cmNlKCkge1xuICB2YXIgY2FuY2VsO1xuICB2YXIgdG9rZW4gPSBuZXcgQ2FuY2VsVG9rZW4oZnVuY3Rpb24gZXhlY3V0b3IoYykge1xuICAgIGNhbmNlbCA9IGM7XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIHRva2VuOiB0b2tlbixcbiAgICBjYW5jZWw6IGNhbmNlbFxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWxUb2tlbjtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0NhbmNlbCh2YWx1ZSkge1xuICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWUuX19DQU5DRUxfXyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgYnVpbGRVUkwgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2J1aWxkVVJMJyk7XG52YXIgSW50ZXJjZXB0b3JNYW5hZ2VyID0gcmVxdWlyZSgnLi9JbnRlcmNlcHRvck1hbmFnZXInKTtcbnZhciBkaXNwYXRjaFJlcXVlc3QgPSByZXF1aXJlKCcuL2Rpc3BhdGNoUmVxdWVzdCcpO1xudmFyIG1lcmdlQ29uZmlnID0gcmVxdWlyZSgnLi9tZXJnZUNvbmZpZycpO1xuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZUNvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICovXG5mdW5jdGlvbiBBeGlvcyhpbnN0YW5jZUNvbmZpZykge1xuICB0aGlzLmRlZmF1bHRzID0gaW5zdGFuY2VDb25maWc7XG4gIHRoaXMuaW50ZXJjZXB0b3JzID0ge1xuICAgIHJlcXVlc3Q6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKSxcbiAgICByZXNwb25zZTogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpXG4gIH07XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHNwZWNpZmljIGZvciB0aGlzIHJlcXVlc3QgKG1lcmdlZCB3aXRoIHRoaXMuZGVmYXVsdHMpXG4gKi9cbkF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24gcmVxdWVzdChjb25maWcpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIC8vIEFsbG93IGZvciBheGlvcygnZXhhbXBsZS91cmwnWywgY29uZmlnXSkgYSBsYSBmZXRjaCBBUElcbiAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uZmlnID0gYXJndW1lbnRzWzFdIHx8IHt9O1xuICAgIGNvbmZpZy51cmwgPSBhcmd1bWVudHNbMF07XG4gIH0gZWxzZSB7XG4gICAgY29uZmlnID0gY29uZmlnIHx8IHt9O1xuICB9XG5cbiAgY29uZmlnID0gbWVyZ2VDb25maWcodGhpcy5kZWZhdWx0cywgY29uZmlnKTtcblxuICAvLyBTZXQgY29uZmlnLm1ldGhvZFxuICBpZiAoY29uZmlnLm1ldGhvZCkge1xuICAgIGNvbmZpZy5tZXRob2QgPSBjb25maWcubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG4gIH0gZWxzZSBpZiAodGhpcy5kZWZhdWx0cy5tZXRob2QpIHtcbiAgICBjb25maWcubWV0aG9kID0gdGhpcy5kZWZhdWx0cy5tZXRob2QudG9Mb3dlckNhc2UoKTtcbiAgfSBlbHNlIHtcbiAgICBjb25maWcubWV0aG9kID0gJ2dldCc7XG4gIH1cblxuICAvLyBIb29rIHVwIGludGVyY2VwdG9ycyBtaWRkbGV3YXJlXG4gIHZhciBjaGFpbiA9IFtkaXNwYXRjaFJlcXVlc3QsIHVuZGVmaW5lZF07XG4gIHZhciBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKGNvbmZpZyk7XG5cbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVxdWVzdC5mb3JFYWNoKGZ1bmN0aW9uIHVuc2hpZnRSZXF1ZXN0SW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgY2hhaW4udW5zaGlmdChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiBwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICBjaGFpbi5wdXNoKGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICB9KTtcblxuICB3aGlsZSAoY2hhaW4ubGVuZ3RoKSB7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihjaGFpbi5zaGlmdCgpLCBjaGFpbi5zaGlmdCgpKTtcbiAgfVxuXG4gIHJldHVybiBwcm9taXNlO1xufTtcblxuQXhpb3MucHJvdG90eXBlLmdldFVyaSA9IGZ1bmN0aW9uIGdldFVyaShjb25maWcpIHtcbiAgY29uZmlnID0gbWVyZ2VDb25maWcodGhpcy5kZWZhdWx0cywgY29uZmlnKTtcbiAgcmV0dXJuIGJ1aWxkVVJMKGNvbmZpZy51cmwsIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKS5yZXBsYWNlKC9eXFw/LywgJycpO1xufTtcblxuLy8gUHJvdmlkZSBhbGlhc2VzIGZvciBzdXBwb3J0ZWQgcmVxdWVzdCBtZXRob2RzXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ29wdGlvbnMnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QodXRpbHMubWVyZ2UoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsXG4gICAgfSkpO1xuICB9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBkYXRhLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KHV0aWxzLm1lcmdlKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KSk7XG4gIH07XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBeGlvcztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5mdW5jdGlvbiBJbnRlcmNlcHRvck1hbmFnZXIoKSB7XG4gIHRoaXMuaGFuZGxlcnMgPSBbXTtcbn1cblxuLyoqXG4gKiBBZGQgYSBuZXcgaW50ZXJjZXB0b3IgdG8gdGhlIHN0YWNrXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVsZmlsbGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHRoZW5gIGZvciBhIGBQcm9taXNlYFxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0ZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgcmVqZWN0YCBmb3IgYSBgUHJvbWlzZWBcbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IEFuIElEIHVzZWQgdG8gcmVtb3ZlIGludGVyY2VwdG9yIGxhdGVyXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24gdXNlKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpIHtcbiAgdGhpcy5oYW5kbGVycy5wdXNoKHtcbiAgICBmdWxmaWxsZWQ6IGZ1bGZpbGxlZCxcbiAgICByZWplY3RlZDogcmVqZWN0ZWRcbiAgfSk7XG4gIHJldHVybiB0aGlzLmhhbmRsZXJzLmxlbmd0aCAtIDE7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhbiBpbnRlcmNlcHRvciBmcm9tIHRoZSBzdGFja1xuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBpZCBUaGUgSUQgdGhhdCB3YXMgcmV0dXJuZWQgYnkgYHVzZWBcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5lamVjdCA9IGZ1bmN0aW9uIGVqZWN0KGlkKSB7XG4gIGlmICh0aGlzLmhhbmRsZXJzW2lkXSkge1xuICAgIHRoaXMuaGFuZGxlcnNbaWRdID0gbnVsbDtcbiAgfVxufTtcblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYWxsIHRoZSByZWdpc3RlcmVkIGludGVyY2VwdG9yc1xuICpcbiAqIFRoaXMgbWV0aG9kIGlzIHBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIHNraXBwaW5nIG92ZXIgYW55XG4gKiBpbnRlcmNlcHRvcnMgdGhhdCBtYXkgaGF2ZSBiZWNvbWUgYG51bGxgIGNhbGxpbmcgYGVqZWN0YC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBpbnRlcmNlcHRvclxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiBmb3JFYWNoKGZuKSB7XG4gIHV0aWxzLmZvckVhY2godGhpcy5oYW5kbGVycywgZnVuY3Rpb24gZm9yRWFjaEhhbmRsZXIoaCkge1xuICAgIGlmIChoICE9PSBudWxsKSB7XG4gICAgICBmbihoKTtcbiAgICB9XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcmNlcHRvck1hbmFnZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc0Fic29sdXRlVVJMID0gcmVxdWlyZSgnLi4vaGVscGVycy9pc0Fic29sdXRlVVJMJyk7XG52YXIgY29tYmluZVVSTHMgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2NvbWJpbmVVUkxzJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBVUkwgYnkgY29tYmluaW5nIHRoZSBiYXNlVVJMIHdpdGggdGhlIHJlcXVlc3RlZFVSTCxcbiAqIG9ubHkgd2hlbiB0aGUgcmVxdWVzdGVkVVJMIGlzIG5vdCBhbHJlYWR5IGFuIGFic29sdXRlIFVSTC5cbiAqIElmIHRoZSByZXF1ZXN0VVJMIGlzIGFic29sdXRlLCB0aGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIHJlcXVlc3RlZFVSTCB1bnRvdWNoZWQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVUkwgVGhlIGJhc2UgVVJMXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVxdWVzdGVkVVJMIEFic29sdXRlIG9yIHJlbGF0aXZlIFVSTCB0byBjb21iaW5lXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgZnVsbCBwYXRoXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYnVpbGRGdWxsUGF0aChiYXNlVVJMLCByZXF1ZXN0ZWRVUkwpIHtcbiAgaWYgKGJhc2VVUkwgJiYgIWlzQWJzb2x1dGVVUkwocmVxdWVzdGVkVVJMKSkge1xuICAgIHJldHVybiBjb21iaW5lVVJMcyhiYXNlVVJMLCByZXF1ZXN0ZWRVUkwpO1xuICB9XG4gIHJldHVybiByZXF1ZXN0ZWRVUkw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW5oYW5jZUVycm9yID0gcmVxdWlyZSgnLi9lbmhhbmNlRXJyb3InKTtcblxuLyoqXG4gKiBDcmVhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIG1lc3NhZ2UsIGNvbmZpZywgZXJyb3IgY29kZSwgcmVxdWVzdCBhbmQgcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgVGhlIGVycm9yIG1lc3NhZ2UuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGNyZWF0ZWQgZXJyb3IuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRXJyb3IobWVzc2FnZSwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gIHJldHVybiBlbmhhbmNlRXJyb3IoZXJyb3IsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIHRyYW5zZm9ybURhdGEgPSByZXF1aXJlKCcuL3RyYW5zZm9ybURhdGEnKTtcbnZhciBpc0NhbmNlbCA9IHJlcXVpcmUoJy4uL2NhbmNlbC9pc0NhbmNlbCcpO1xudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi4vZGVmYXVsdHMnKTtcblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICovXG5mdW5jdGlvbiB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZykge1xuICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgY29uZmlnLmNhbmNlbFRva2VuLnRocm93SWZSZXF1ZXN0ZWQoKTtcbiAgfVxufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdCB0byB0aGUgc2VydmVyIHVzaW5nIHRoZSBjb25maWd1cmVkIGFkYXB0ZXIuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHRoYXQgaXMgdG8gYmUgdXNlZCBmb3IgdGhlIHJlcXVlc3RcbiAqIEByZXR1cm5zIHtQcm9taXNlfSBUaGUgUHJvbWlzZSB0byBiZSBmdWxmaWxsZWRcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkaXNwYXRjaFJlcXVlc3QoY29uZmlnKSB7XG4gIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAvLyBFbnN1cmUgaGVhZGVycyBleGlzdFxuICBjb25maWcuaGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzIHx8IHt9O1xuXG4gIC8vIFRyYW5zZm9ybSByZXF1ZXN0IGRhdGFcbiAgY29uZmlnLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuICAgIGNvbmZpZy5kYXRhLFxuICAgIGNvbmZpZy5oZWFkZXJzLFxuICAgIGNvbmZpZy50cmFuc2Zvcm1SZXF1ZXN0XG4gICk7XG5cbiAgLy8gRmxhdHRlbiBoZWFkZXJzXG4gIGNvbmZpZy5oZWFkZXJzID0gdXRpbHMubWVyZ2UoXG4gICAgY29uZmlnLmhlYWRlcnMuY29tbW9uIHx8IHt9LFxuICAgIGNvbmZpZy5oZWFkZXJzW2NvbmZpZy5tZXRob2RdIHx8IHt9LFxuICAgIGNvbmZpZy5oZWFkZXJzXG4gICk7XG5cbiAgdXRpbHMuZm9yRWFjaChcbiAgICBbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdjb21tb24nXSxcbiAgICBmdW5jdGlvbiBjbGVhbkhlYWRlckNvbmZpZyhtZXRob2QpIHtcbiAgICAgIGRlbGV0ZSBjb25maWcuaGVhZGVyc1ttZXRob2RdO1xuICAgIH1cbiAgKTtcblxuICB2YXIgYWRhcHRlciA9IGNvbmZpZy5hZGFwdGVyIHx8IGRlZmF1bHRzLmFkYXB0ZXI7XG5cbiAgcmV0dXJuIGFkYXB0ZXIoY29uZmlnKS50aGVuKGZ1bmN0aW9uIG9uQWRhcHRlclJlc29sdXRpb24ocmVzcG9uc2UpIHtcbiAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgIHJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuICAgICAgcmVzcG9uc2UuZGF0YSxcbiAgICAgIHJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2VcbiAgICApO1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9LCBmdW5jdGlvbiBvbkFkYXB0ZXJSZWplY3Rpb24ocmVhc29uKSB7XG4gICAgaWYgKCFpc0NhbmNlbChyZWFzb24pKSB7XG4gICAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgICBpZiAocmVhc29uICYmIHJlYXNvbi5yZXNwb25zZSkge1xuICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG4gICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEsXG4gICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlYXNvbik7XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBVcGRhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIGNvbmZpZywgZXJyb3IgY29kZSwgYW5kIHJlc3BvbnNlLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVycm9yIFRoZSBlcnJvciB0byB1cGRhdGUuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGVycm9yLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuICBlcnJvci5jb25maWcgPSBjb25maWc7XG4gIGlmIChjb2RlKSB7XG4gICAgZXJyb3IuY29kZSA9IGNvZGU7XG4gIH1cblxuICBlcnJvci5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgZXJyb3IucmVzcG9uc2UgPSByZXNwb25zZTtcbiAgZXJyb3IuaXNBeGlvc0Vycm9yID0gdHJ1ZTtcblxuICBlcnJvci50b0pTT04gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLy8gU3RhbmRhcmRcbiAgICAgIG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgIC8vIE1pY3Jvc29mdFxuICAgICAgZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICBudW1iZXI6IHRoaXMubnVtYmVyLFxuICAgICAgLy8gTW96aWxsYVxuICAgICAgZmlsZU5hbWU6IHRoaXMuZmlsZU5hbWUsXG4gICAgICBsaW5lTnVtYmVyOiB0aGlzLmxpbmVOdW1iZXIsXG4gICAgICBjb2x1bW5OdW1iZXI6IHRoaXMuY29sdW1uTnVtYmVyLFxuICAgICAgc3RhY2s6IHRoaXMuc3RhY2ssXG4gICAgICAvLyBBeGlvc1xuICAgICAgY29uZmlnOiB0aGlzLmNvbmZpZyxcbiAgICAgIGNvZGU6IHRoaXMuY29kZVxuICAgIH07XG4gIH07XG4gIHJldHVybiBlcnJvcjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbi8qKlxuICogQ29uZmlnLXNwZWNpZmljIG1lcmdlLWZ1bmN0aW9uIHdoaWNoIGNyZWF0ZXMgYSBuZXcgY29uZmlnLW9iamVjdFxuICogYnkgbWVyZ2luZyB0d28gY29uZmlndXJhdGlvbiBvYmplY3RzIHRvZ2V0aGVyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcxXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnMlxuICogQHJldHVybnMge09iamVjdH0gTmV3IG9iamVjdCByZXN1bHRpbmcgZnJvbSBtZXJnaW5nIGNvbmZpZzIgdG8gY29uZmlnMVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1lcmdlQ29uZmlnKGNvbmZpZzEsIGNvbmZpZzIpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gIGNvbmZpZzIgPSBjb25maWcyIHx8IHt9O1xuICB2YXIgY29uZmlnID0ge307XG5cbiAgdmFyIHZhbHVlRnJvbUNvbmZpZzJLZXlzID0gWyd1cmwnLCAnbWV0aG9kJywgJ3BhcmFtcycsICdkYXRhJ107XG4gIHZhciBtZXJnZURlZXBQcm9wZXJ0aWVzS2V5cyA9IFsnaGVhZGVycycsICdhdXRoJywgJ3Byb3h5J107XG4gIHZhciBkZWZhdWx0VG9Db25maWcyS2V5cyA9IFtcbiAgICAnYmFzZVVSTCcsICd1cmwnLCAndHJhbnNmb3JtUmVxdWVzdCcsICd0cmFuc2Zvcm1SZXNwb25zZScsICdwYXJhbXNTZXJpYWxpemVyJyxcbiAgICAndGltZW91dCcsICd3aXRoQ3JlZGVudGlhbHMnLCAnYWRhcHRlcicsICdyZXNwb25zZVR5cGUnLCAneHNyZkNvb2tpZU5hbWUnLFxuICAgICd4c3JmSGVhZGVyTmFtZScsICdvblVwbG9hZFByb2dyZXNzJywgJ29uRG93bmxvYWRQcm9ncmVzcycsXG4gICAgJ21heENvbnRlbnRMZW5ndGgnLCAndmFsaWRhdGVTdGF0dXMnLCAnbWF4UmVkaXJlY3RzJywgJ2h0dHBBZ2VudCcsXG4gICAgJ2h0dHBzQWdlbnQnLCAnY2FuY2VsVG9rZW4nLCAnc29ja2V0UGF0aCdcbiAgXTtcblxuICB1dGlscy5mb3JFYWNoKHZhbHVlRnJvbUNvbmZpZzJLZXlzLCBmdW5jdGlvbiB2YWx1ZUZyb21Db25maWcyKHByb3ApIHtcbiAgICBpZiAodHlwZW9mIGNvbmZpZzJbcHJvcF0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBjb25maWcyW3Byb3BdO1xuICAgIH1cbiAgfSk7XG5cbiAgdXRpbHMuZm9yRWFjaChtZXJnZURlZXBQcm9wZXJ0aWVzS2V5cywgZnVuY3Rpb24gbWVyZ2VEZWVwUHJvcGVydGllcyhwcm9wKSB7XG4gICAgaWYgKHV0aWxzLmlzT2JqZWN0KGNvbmZpZzJbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSB1dGlscy5kZWVwTWVyZ2UoY29uZmlnMVtwcm9wXSwgY29uZmlnMltwcm9wXSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgY29uZmlnMltwcm9wXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGNvbmZpZzJbcHJvcF07XG4gICAgfSBlbHNlIGlmICh1dGlscy5pc09iamVjdChjb25maWcxW3Byb3BdKSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gdXRpbHMuZGVlcE1lcmdlKGNvbmZpZzFbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbmZpZzFbcHJvcF0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBjb25maWcxW3Byb3BdO1xuICAgIH1cbiAgfSk7XG5cbiAgdXRpbHMuZm9yRWFjaChkZWZhdWx0VG9Db25maWcyS2V5cywgZnVuY3Rpb24gZGVmYXVsdFRvQ29uZmlnMihwcm9wKSB7XG4gICAgaWYgKHR5cGVvZiBjb25maWcyW3Byb3BdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uZmlnW3Byb3BdID0gY29uZmlnMltwcm9wXTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb25maWcxW3Byb3BdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uZmlnW3Byb3BdID0gY29uZmlnMVtwcm9wXTtcbiAgICB9XG4gIH0pO1xuXG4gIHZhciBheGlvc0tleXMgPSB2YWx1ZUZyb21Db25maWcyS2V5c1xuICAgIC5jb25jYXQobWVyZ2VEZWVwUHJvcGVydGllc0tleXMpXG4gICAgLmNvbmNhdChkZWZhdWx0VG9Db25maWcyS2V5cyk7XG5cbiAgdmFyIG90aGVyS2V5cyA9IE9iamVjdFxuICAgIC5rZXlzKGNvbmZpZzIpXG4gICAgLmZpbHRlcihmdW5jdGlvbiBmaWx0ZXJBeGlvc0tleXMoa2V5KSB7XG4gICAgICByZXR1cm4gYXhpb3NLZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTE7XG4gICAgfSk7XG5cbiAgdXRpbHMuZm9yRWFjaChvdGhlcktleXMsIGZ1bmN0aW9uIG90aGVyS2V5c0RlZmF1bHRUb0NvbmZpZzIocHJvcCkge1xuICAgIGlmICh0eXBlb2YgY29uZmlnMltwcm9wXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGNvbmZpZzJbcHJvcF07XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgY29uZmlnMVtwcm9wXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGNvbmZpZzFbcHJvcF07XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gY29uZmlnO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNyZWF0ZUVycm9yID0gcmVxdWlyZSgnLi9jcmVhdGVFcnJvcicpO1xuXG4vKipcbiAqIFJlc29sdmUgb3IgcmVqZWN0IGEgUHJvbWlzZSBiYXNlZCBvbiByZXNwb25zZSBzdGF0dXMuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzb2x2ZSBBIGZ1bmN0aW9uIHRoYXQgcmVzb2x2ZXMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3QgQSBmdW5jdGlvbiB0aGF0IHJlamVjdHMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge29iamVjdH0gcmVzcG9uc2UgVGhlIHJlc3BvbnNlLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKSB7XG4gIHZhciB2YWxpZGF0ZVN0YXR1cyA9IHJlc3BvbnNlLmNvbmZpZy52YWxpZGF0ZVN0YXR1cztcbiAgaWYgKCF2YWxpZGF0ZVN0YXR1cyB8fCB2YWxpZGF0ZVN0YXR1cyhyZXNwb25zZS5zdGF0dXMpKSB7XG4gICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gIH0gZWxzZSB7XG4gICAgcmVqZWN0KGNyZWF0ZUVycm9yKFxuICAgICAgJ1JlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJyArIHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgIHJlc3BvbnNlLmNvbmZpZyxcbiAgICAgIG51bGwsXG4gICAgICByZXNwb25zZS5yZXF1ZXN0LFxuICAgICAgcmVzcG9uc2VcbiAgICApKTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG4vKipcbiAqIFRyYW5zZm9ybSB0aGUgZGF0YSBmb3IgYSByZXF1ZXN0IG9yIGEgcmVzcG9uc2VcbiAqXG4gKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IGRhdGEgVGhlIGRhdGEgdG8gYmUgdHJhbnNmb3JtZWRcbiAqIEBwYXJhbSB7QXJyYXl9IGhlYWRlcnMgVGhlIGhlYWRlcnMgZm9yIHRoZSByZXF1ZXN0IG9yIHJlc3BvbnNlXG4gKiBAcGFyYW0ge0FycmF5fEZ1bmN0aW9ufSBmbnMgQSBzaW5nbGUgZnVuY3Rpb24gb3IgQXJyYXkgb2YgZnVuY3Rpb25zXG4gKiBAcmV0dXJucyB7Kn0gVGhlIHJlc3VsdGluZyB0cmFuc2Zvcm1lZCBkYXRhXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHJhbnNmb3JtRGF0YShkYXRhLCBoZWFkZXJzLCBmbnMpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIHV0aWxzLmZvckVhY2goZm5zLCBmdW5jdGlvbiB0cmFuc2Zvcm0oZm4pIHtcbiAgICBkYXRhID0gZm4oZGF0YSwgaGVhZGVycyk7XG4gIH0pO1xuXG4gIHJldHVybiBkYXRhO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIG5vcm1hbGl6ZUhlYWRlck5hbWUgPSByZXF1aXJlKCcuL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZScpO1xuXG52YXIgREVGQVVMVF9DT05URU5UX1RZUEUgPSB7XG4gICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xufTtcblxuZnVuY3Rpb24gc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsIHZhbHVlKSB7XG4gIGlmICghdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVycykgJiYgdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVyc1snQ29udGVudC1UeXBlJ10pKSB7XG4gICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSB2YWx1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXREZWZhdWx0QWRhcHRlcigpIHtcbiAgdmFyIGFkYXB0ZXI7XG4gIGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gRm9yIGJyb3dzZXJzIHVzZSBYSFIgYWRhcHRlclxuICAgIGFkYXB0ZXIgPSByZXF1aXJlKCcuL2FkYXB0ZXJzL3hocicpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJykge1xuICAgIC8vIEZvciBub2RlIHVzZSBIVFRQIGFkYXB0ZXJcbiAgICBhZGFwdGVyID0gcmVxdWlyZSgnLi9hZGFwdGVycy9odHRwJyk7XG4gIH1cbiAgcmV0dXJuIGFkYXB0ZXI7XG59XG5cbnZhciBkZWZhdWx0cyA9IHtcbiAgYWRhcHRlcjogZ2V0RGVmYXVsdEFkYXB0ZXIoKSxcblxuICB0cmFuc2Zvcm1SZXF1ZXN0OiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVxdWVzdChkYXRhLCBoZWFkZXJzKSB7XG4gICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQWNjZXB0Jyk7XG4gICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQ29udGVudC1UeXBlJyk7XG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQXJyYXlCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc1N0cmVhbShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNGaWxlKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0Jsb2IoZGF0YSlcbiAgICApIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNBcnJheUJ1ZmZlclZpZXcoZGF0YSkpIHtcbiAgICAgIHJldHVybiBkYXRhLmJ1ZmZlcjtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKGRhdGEpKSB7XG4gICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICByZXR1cm4gZGF0YS50b1N0cmluZygpO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICB0cmFuc2Zvcm1SZXNwb25zZTogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlc3BvbnNlKGRhdGEpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgLyogSWdub3JlICovIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIC8qKlxuICAgKiBBIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIHRvIGFib3J0IGEgcmVxdWVzdC4gSWYgc2V0IHRvIDAgKGRlZmF1bHQpIGFcbiAgICogdGltZW91dCBpcyBub3QgY3JlYXRlZC5cbiAgICovXG4gIHRpbWVvdXQ6IDAsXG5cbiAgeHNyZkNvb2tpZU5hbWU6ICdYU1JGLVRPS0VOJyxcbiAgeHNyZkhlYWRlck5hbWU6ICdYLVhTUkYtVE9LRU4nLFxuXG4gIG1heENvbnRlbnRMZW5ndGg6IC0xLFxuXG4gIHZhbGlkYXRlU3RhdHVzOiBmdW5jdGlvbiB2YWxpZGF0ZVN0YXR1cyhzdGF0dXMpIHtcbiAgICByZXR1cm4gc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDA7XG4gIH1cbn07XG5cbmRlZmF1bHRzLmhlYWRlcnMgPSB7XG4gIGNvbW1vbjoge1xuICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qJ1xuICB9XG59O1xuXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHt9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHV0aWxzLm1lcmdlKERFRkFVTFRfQ09OVEVOVF9UWVBFKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmF1bHRzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNBcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2ldO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpc0FyZywgYXJncyk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIGVuY29kZSh2YWwpIHtcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWwpLlxuICAgIHJlcGxhY2UoLyU0MC9naSwgJ0AnKS5cbiAgICByZXBsYWNlKC8lM0EvZ2ksICc6JykuXG4gICAgcmVwbGFjZSgvJTI0L2csICckJykuXG4gICAgcmVwbGFjZSgvJTJDL2dpLCAnLCcpLlxuICAgIHJlcGxhY2UoLyUyMC9nLCAnKycpLlxuICAgIHJlcGxhY2UoLyU1Qi9naSwgJ1snKS5cbiAgICByZXBsYWNlKC8lNUQvZ2ksICddJyk7XG59XG5cbi8qKlxuICogQnVpbGQgYSBVUkwgYnkgYXBwZW5kaW5nIHBhcmFtcyB0byB0aGUgZW5kXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgYmFzZSBvZiB0aGUgdXJsIChlLmcuLCBodHRwOi8vd3d3Lmdvb2dsZS5jb20pXG4gKiBAcGFyYW0ge29iamVjdH0gW3BhcmFtc10gVGhlIHBhcmFtcyB0byBiZSBhcHBlbmRlZFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCB1cmxcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWlsZFVSTCh1cmwsIHBhcmFtcywgcGFyYW1zU2VyaWFsaXplcikge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgaWYgKCFwYXJhbXMpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgdmFyIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIGlmIChwYXJhbXNTZXJpYWxpemVyKSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtc1NlcmlhbGl6ZXIocGFyYW1zKTtcbiAgfSBlbHNlIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhwYXJhbXMpKSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtcy50b1N0cmluZygpO1xuICB9IGVsc2Uge1xuICAgIHZhciBwYXJ0cyA9IFtdO1xuXG4gICAgdXRpbHMuZm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uIHNlcmlhbGl6ZSh2YWwsIGtleSkge1xuICAgICAgaWYgKHZhbCA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh1dGlscy5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAga2V5ID0ga2V5ICsgJ1tdJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbCA9IFt2YWxdO1xuICAgICAgfVxuXG4gICAgICB1dGlscy5mb3JFYWNoKHZhbCwgZnVuY3Rpb24gcGFyc2VWYWx1ZSh2KSB7XG4gICAgICAgIGlmICh1dGlscy5pc0RhdGUodikpIHtcbiAgICAgICAgICB2ID0gdi50b0lTT1N0cmluZygpO1xuICAgICAgICB9IGVsc2UgaWYgKHV0aWxzLmlzT2JqZWN0KHYpKSB7XG4gICAgICAgICAgdiA9IEpTT04uc3RyaW5naWZ5KHYpO1xuICAgICAgICB9XG4gICAgICAgIHBhcnRzLnB1c2goZW5jb2RlKGtleSkgKyAnPScgKyBlbmNvZGUodikpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFydHMuam9pbignJicpO1xuICB9XG5cbiAgaWYgKHNlcmlhbGl6ZWRQYXJhbXMpIHtcbiAgICB2YXIgaGFzaG1hcmtJbmRleCA9IHVybC5pbmRleE9mKCcjJyk7XG4gICAgaWYgKGhhc2htYXJrSW5kZXggIT09IC0xKSB7XG4gICAgICB1cmwgPSB1cmwuc2xpY2UoMCwgaGFzaG1hcmtJbmRleCk7XG4gICAgfVxuXG4gICAgdXJsICs9ICh1cmwuaW5kZXhPZignPycpID09PSAtMSA/ICc/JyA6ICcmJykgKyBzZXJpYWxpemVkUGFyYW1zO1xuICB9XG5cbiAgcmV0dXJuIHVybDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBVUkwgYnkgY29tYmluaW5nIHRoZSBzcGVjaWZpZWQgVVJMc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVVJMIFRoZSBiYXNlIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0aXZlVVJMIFRoZSByZWxhdGl2ZSBVUkxcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb21iaW5lZCBVUkxcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21iaW5lVVJMcyhiYXNlVVJMLCByZWxhdGl2ZVVSTCkge1xuICByZXR1cm4gcmVsYXRpdmVVUkxcbiAgICA/IGJhc2VVUkwucmVwbGFjZSgvXFwvKyQvLCAnJykgKyAnLycgKyByZWxhdGl2ZVVSTC5yZXBsYWNlKC9eXFwvKy8sICcnKVxuICAgIDogYmFzZVVSTDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoXG4gIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXG4gIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBzdXBwb3J0IGRvY3VtZW50LmNvb2tpZVxuICAgIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUobmFtZSwgdmFsdWUsIGV4cGlyZXMsIHBhdGgsIGRvbWFpbiwgc2VjdXJlKSB7XG4gICAgICAgICAgdmFyIGNvb2tpZSA9IFtdO1xuICAgICAgICAgIGNvb2tpZS5wdXNoKG5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcblxuICAgICAgICAgIGlmICh1dGlscy5pc051bWJlcihleHBpcmVzKSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ2V4cGlyZXM9JyArIG5ldyBEYXRlKGV4cGlyZXMpLnRvR01UU3RyaW5nKCkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh1dGlscy5pc1N0cmluZyhwYXRoKSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ3BhdGg9JyArIHBhdGgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh1dGlscy5pc1N0cmluZyhkb21haW4pKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgnZG9tYWluPScgKyBkb21haW4pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzZWN1cmUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdzZWN1cmUnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkb2N1bWVudC5jb29raWUgPSBjb29raWUuam9pbignOyAnKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG5hbWUpIHtcbiAgICAgICAgICB2YXIgbWF0Y2ggPSBkb2N1bWVudC5jb29raWUubWF0Y2gobmV3IFJlZ0V4cCgnKF58O1xcXFxzKikoJyArIG5hbWUgKyAnKT0oW147XSopJykpO1xuICAgICAgICAgIHJldHVybiAobWF0Y2ggPyBkZWNvZGVVUklDb21wb25lbnQobWF0Y2hbM10pIDogbnVsbCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUobmFtZSkge1xuICAgICAgICAgIHRoaXMud3JpdGUobmFtZSwgJycsIERhdGUubm93KCkgLSA4NjQwMDAwMCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSkoKSA6XG5cbiAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52ICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICAgIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUoKSB7fSxcbiAgICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZCgpIHsgcmV0dXJuIG51bGw7IH0sXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICAgIH07XG4gICAgfSkoKVxuKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGVcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBVUkwgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQWJzb2x1dGVVUkwodXJsKSB7XG4gIC8vIEEgVVJMIGlzIGNvbnNpZGVyZWQgYWJzb2x1dGUgaWYgaXQgYmVnaW5zIHdpdGggXCI8c2NoZW1lPjovL1wiIG9yIFwiLy9cIiAocHJvdG9jb2wtcmVsYXRpdmUgVVJMKS5cbiAgLy8gUkZDIDM5ODYgZGVmaW5lcyBzY2hlbWUgbmFtZSBhcyBhIHNlcXVlbmNlIG9mIGNoYXJhY3RlcnMgYmVnaW5uaW5nIHdpdGggYSBsZXR0ZXIgYW5kIGZvbGxvd2VkXG4gIC8vIGJ5IGFueSBjb21iaW5hdGlvbiBvZiBsZXR0ZXJzLCBkaWdpdHMsIHBsdXMsIHBlcmlvZCwgb3IgaHlwaGVuLlxuICByZXR1cm4gL14oW2Etel1bYS16XFxkXFwrXFwtXFwuXSo6KT9cXC9cXC8vaS50ZXN0KHVybCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgaGF2ZSBmdWxsIHN1cHBvcnQgb2YgdGhlIEFQSXMgbmVlZGVkIHRvIHRlc3RcbiAgLy8gd2hldGhlciB0aGUgcmVxdWVzdCBVUkwgaXMgb2YgdGhlIHNhbWUgb3JpZ2luIGFzIGN1cnJlbnQgbG9jYXRpb24uXG4gICAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHZhciBtc2llID0gLyhtc2llfHRyaWRlbnQpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICAgIHZhciB1cmxQYXJzaW5nTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgIHZhciBvcmlnaW5VUkw7XG5cbiAgICAgIC8qKlxuICAgICogUGFyc2UgYSBVUkwgdG8gZGlzY292ZXIgaXQncyBjb21wb25lbnRzXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBUaGUgVVJMIHRvIGJlIHBhcnNlZFxuICAgICogQHJldHVybnMge09iamVjdH1cbiAgICAqL1xuICAgICAgZnVuY3Rpb24gcmVzb2x2ZVVSTCh1cmwpIHtcbiAgICAgICAgdmFyIGhyZWYgPSB1cmw7XG5cbiAgICAgICAgaWYgKG1zaWUpIHtcbiAgICAgICAgLy8gSUUgbmVlZHMgYXR0cmlidXRlIHNldCB0d2ljZSB0byBub3JtYWxpemUgcHJvcGVydGllc1xuICAgICAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuICAgICAgICAgIGhyZWYgPSB1cmxQYXJzaW5nTm9kZS5ocmVmO1xuICAgICAgICB9XG5cbiAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG5cbiAgICAgICAgLy8gdXJsUGFyc2luZ05vZGUgcHJvdmlkZXMgdGhlIFVybFV0aWxzIGludGVyZmFjZSAtIGh0dHA6Ly91cmwuc3BlYy53aGF0d2cub3JnLyN1cmx1dGlsc1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGhyZWY6IHVybFBhcnNpbmdOb2RlLmhyZWYsXG4gICAgICAgICAgcHJvdG9jb2w6IHVybFBhcnNpbmdOb2RlLnByb3RvY29sID8gdXJsUGFyc2luZ05vZGUucHJvdG9jb2wucmVwbGFjZSgvOiQvLCAnJykgOiAnJyxcbiAgICAgICAgICBob3N0OiB1cmxQYXJzaW5nTm9kZS5ob3N0LFxuICAgICAgICAgIHNlYXJjaDogdXJsUGFyc2luZ05vZGUuc2VhcmNoID8gdXJsUGFyc2luZ05vZGUuc2VhcmNoLnJlcGxhY2UoL15cXD8vLCAnJykgOiAnJyxcbiAgICAgICAgICBoYXNoOiB1cmxQYXJzaW5nTm9kZS5oYXNoID8gdXJsUGFyc2luZ05vZGUuaGFzaC5yZXBsYWNlKC9eIy8sICcnKSA6ICcnLFxuICAgICAgICAgIGhvc3RuYW1lOiB1cmxQYXJzaW5nTm9kZS5ob3N0bmFtZSxcbiAgICAgICAgICBwb3J0OiB1cmxQYXJzaW5nTm9kZS5wb3J0LFxuICAgICAgICAgIHBhdGhuYW1lOiAodXJsUGFyc2luZ05vZGUucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycpID9cbiAgICAgICAgICAgIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lIDpcbiAgICAgICAgICAgICcvJyArIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIG9yaWdpblVSTCA9IHJlc29sdmVVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuXG4gICAgICAvKipcbiAgICAqIERldGVybWluZSBpZiBhIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luIGFzIHRoZSBjdXJyZW50IGxvY2F0aW9uXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHJlcXVlc3RVUkwgVGhlIFVSTCB0byB0ZXN0XG4gICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiwgb3RoZXJ3aXNlIGZhbHNlXG4gICAgKi9cbiAgICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4ocmVxdWVzdFVSTCkge1xuICAgICAgICB2YXIgcGFyc2VkID0gKHV0aWxzLmlzU3RyaW5nKHJlcXVlc3RVUkwpKSA/IHJlc29sdmVVUkwocmVxdWVzdFVSTCkgOiByZXF1ZXN0VVJMO1xuICAgICAgICByZXR1cm4gKHBhcnNlZC5wcm90b2NvbCA9PT0gb3JpZ2luVVJMLnByb3RvY29sICYmXG4gICAgICAgICAgICBwYXJzZWQuaG9zdCA9PT0gb3JpZ2luVVJMLmhvc3QpO1xuICAgICAgfTtcbiAgICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnZzICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICAgIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH07XG4gICAgfSkoKVxuKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsIG5vcm1hbGl6ZWROYW1lKSB7XG4gIHV0aWxzLmZvckVhY2goaGVhZGVycywgZnVuY3Rpb24gcHJvY2Vzc0hlYWRlcih2YWx1ZSwgbmFtZSkge1xuICAgIGlmIChuYW1lICE9PSBub3JtYWxpemVkTmFtZSAmJiBuYW1lLnRvVXBwZXJDYXNlKCkgPT09IG5vcm1hbGl6ZWROYW1lLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgIGhlYWRlcnNbbm9ybWFsaXplZE5hbWVdID0gdmFsdWU7XG4gICAgICBkZWxldGUgaGVhZGVyc1tuYW1lXTtcbiAgICB9XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG4vLyBIZWFkZXJzIHdob3NlIGR1cGxpY2F0ZXMgYXJlIGlnbm9yZWQgYnkgbm9kZVxuLy8gYy5mLiBodHRwczovL25vZGVqcy5vcmcvYXBpL2h0dHAuaHRtbCNodHRwX21lc3NhZ2VfaGVhZGVyc1xudmFyIGlnbm9yZUR1cGxpY2F0ZU9mID0gW1xuICAnYWdlJywgJ2F1dGhvcml6YXRpb24nLCAnY29udGVudC1sZW5ndGgnLCAnY29udGVudC10eXBlJywgJ2V0YWcnLFxuICAnZXhwaXJlcycsICdmcm9tJywgJ2hvc3QnLCAnaWYtbW9kaWZpZWQtc2luY2UnLCAnaWYtdW5tb2RpZmllZC1zaW5jZScsXG4gICdsYXN0LW1vZGlmaWVkJywgJ2xvY2F0aW9uJywgJ21heC1mb3J3YXJkcycsICdwcm94eS1hdXRob3JpemF0aW9uJyxcbiAgJ3JlZmVyZXInLCAncmV0cnktYWZ0ZXInLCAndXNlci1hZ2VudCdcbl07XG5cbi8qKlxuICogUGFyc2UgaGVhZGVycyBpbnRvIGFuIG9iamVjdFxuICpcbiAqIGBgYFxuICogRGF0ZTogV2VkLCAyNyBBdWcgMjAxNCAwODo1ODo0OSBHTVRcbiAqIENvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvblxuICogQ29ubmVjdGlvbjoga2VlcC1hbGl2ZVxuICogVHJhbnNmZXItRW5jb2Rpbmc6IGNodW5rZWRcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBoZWFkZXJzIEhlYWRlcnMgbmVlZGluZyB0byBiZSBwYXJzZWRcbiAqIEByZXR1cm5zIHtPYmplY3R9IEhlYWRlcnMgcGFyc2VkIGludG8gYW4gb2JqZWN0XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VIZWFkZXJzKGhlYWRlcnMpIHtcbiAgdmFyIHBhcnNlZCA9IHt9O1xuICB2YXIga2V5O1xuICB2YXIgdmFsO1xuICB2YXIgaTtcblxuICBpZiAoIWhlYWRlcnMpIHsgcmV0dXJuIHBhcnNlZDsgfVxuXG4gIHV0aWxzLmZvckVhY2goaGVhZGVycy5zcGxpdCgnXFxuJyksIGZ1bmN0aW9uIHBhcnNlcihsaW5lKSB7XG4gICAgaSA9IGxpbmUuaW5kZXhPZignOicpO1xuICAgIGtleSA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoMCwgaSkpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFsID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cihpICsgMSkpO1xuXG4gICAgaWYgKGtleSkge1xuICAgICAgaWYgKHBhcnNlZFtrZXldICYmIGlnbm9yZUR1cGxpY2F0ZU9mLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChrZXkgPT09ICdzZXQtY29va2llJykge1xuICAgICAgICBwYXJzZWRba2V5XSA9IChwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldIDogW10pLmNvbmNhdChbdmFsXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJzZWRba2V5XSA9IHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gKyAnLCAnICsgdmFsIDogdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHBhcnNlZDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogU3ludGFjdGljIHN1Z2FyIGZvciBpbnZva2luZyBhIGZ1bmN0aW9uIGFuZCBleHBhbmRpbmcgYW4gYXJyYXkgZm9yIGFyZ3VtZW50cy5cbiAqXG4gKiBDb21tb24gdXNlIGNhc2Ugd291bGQgYmUgdG8gdXNlIGBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHlgLlxuICpcbiAqICBgYGBqc1xuICogIGZ1bmN0aW9uIGYoeCwgeSwgeikge31cbiAqICB2YXIgYXJncyA9IFsxLCAyLCAzXTtcbiAqICBmLmFwcGx5KG51bGwsIGFyZ3MpO1xuICogIGBgYFxuICpcbiAqIFdpdGggYHNwcmVhZGAgdGhpcyBleGFtcGxlIGNhbiBiZSByZS13cml0dGVuLlxuICpcbiAqICBgYGBqc1xuICogIHNwcmVhZChmdW5jdGlvbih4LCB5LCB6KSB7fSkoWzEsIDIsIDNdKTtcbiAqICBgYGBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNwcmVhZChjYWxsYmFjaykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcChhcnIpIHtcbiAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkobnVsbCwgYXJyKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiaW5kID0gcmVxdWlyZSgnLi9oZWxwZXJzL2JpbmQnKTtcblxuLypnbG9iYWwgdG9TdHJpbmc6dHJ1ZSovXG5cbi8vIHV0aWxzIGlzIGEgbGlicmFyeSBvZiBnZW5lcmljIGhlbHBlciBmdW5jdGlvbnMgbm9uLXNwZWNpZmljIHRvIGF4aW9zXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXkodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgdW5kZWZpbmVkXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHVuZGVmaW5lZCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQnVmZmVyKHZhbCkge1xuICByZXR1cm4gdmFsICE9PSBudWxsICYmICFpc1VuZGVmaW5lZCh2YWwpICYmIHZhbC5jb25zdHJ1Y3RvciAhPT0gbnVsbCAmJiAhaXNVbmRlZmluZWQodmFsLmNvbnN0cnVjdG9yKVxuICAgICYmIHR5cGVvZiB2YWwuY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgdmFsLmNvbnN0cnVjdG9yLmlzQnVmZmVyKHZhbCk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXIodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5QnVmZmVyXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGb3JtRGF0YVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEZvcm1EYXRhLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGb3JtRGF0YSh2YWwpIHtcbiAgcmV0dXJuICh0eXBlb2YgRm9ybURhdGEgIT09ICd1bmRlZmluZWQnKSAmJiAodmFsIGluc3RhbmNlb2YgRm9ybURhdGEpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXJWaWV3KHZhbCkge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcpICYmIChBcnJheUJ1ZmZlci5pc1ZpZXcpKSB7XG4gICAgcmVzdWx0ID0gQXJyYXlCdWZmZXIuaXNWaWV3KHZhbCk7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0ID0gKHZhbCkgJiYgKHZhbC5idWZmZXIpICYmICh2YWwuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJpbmdcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmluZywgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZyc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBOdW1iZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIE51bWJlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTnVtYmVyKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ251bWJlcic7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gT2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IG51bGwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBEYXRlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBEYXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNEYXRlKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGaWxlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGaWxlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGaWxlKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGaWxlXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCbG9iXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCbG9iLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNCbG9iKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBCbG9iXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyZWFtXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJlYW0sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmVhbSh2YWwpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHZhbCkgJiYgaXNGdW5jdGlvbih2YWwucGlwZSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVUkxTZWFyY2hQYXJhbXModmFsKSB7XG4gIHJldHVybiB0eXBlb2YgVVJMU2VhcmNoUGFyYW1zICE9PSAndW5kZWZpbmVkJyAmJiB2YWwgaW5zdGFuY2VvZiBVUkxTZWFyY2hQYXJhbXM7XG59XG5cbi8qKlxuICogVHJpbSBleGNlc3Mgd2hpdGVzcGFjZSBvZmYgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgU3RyaW5nIHRvIHRyaW1cbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBTdHJpbmcgZnJlZWQgb2YgZXhjZXNzIHdoaXRlc3BhY2VcbiAqL1xuZnVuY3Rpb24gdHJpbShzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzKi8sICcnKS5yZXBsYWNlKC9cXHMqJC8sICcnKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgd2UncmUgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnRcbiAqXG4gKiBUaGlzIGFsbG93cyBheGlvcyB0byBydW4gaW4gYSB3ZWIgd29ya2VyLCBhbmQgcmVhY3QtbmF0aXZlLlxuICogQm90aCBlbnZpcm9ubWVudHMgc3VwcG9ydCBYTUxIdHRwUmVxdWVzdCwgYnV0IG5vdCBmdWxseSBzdGFuZGFyZCBnbG9iYWxzLlxuICpcbiAqIHdlYiB3b3JrZXJzOlxuICogIHR5cGVvZiB3aW5kb3cgLT4gdW5kZWZpbmVkXG4gKiAgdHlwZW9mIGRvY3VtZW50IC0+IHVuZGVmaW5lZFxuICpcbiAqIHJlYWN0LW5hdGl2ZTpcbiAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnUmVhY3ROYXRpdmUnXG4gKiBuYXRpdmVzY3JpcHRcbiAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnTmF0aXZlU2NyaXB0JyBvciAnTlMnXG4gKi9cbmZ1bmN0aW9uIGlzU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgKG5hdmlnYXRvci5wcm9kdWN0ID09PSAnUmVhY3ROYXRpdmUnIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdOYXRpdmVTY3JpcHQnIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdOUycpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiAoXG4gICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnXG4gICk7XG59XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFuIEFycmF5IG9yIGFuIE9iamVjdCBpbnZva2luZyBhIGZ1bmN0aW9uIGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgYG9iamAgaXMgYW4gQXJyYXkgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBpbmRleCwgYW5kIGNvbXBsZXRlIGFycmF5IGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgJ29iaicgaXMgYW4gT2JqZWN0IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwga2V5LCBhbmQgY29tcGxldGUgb2JqZWN0IGZvciBlYWNoIHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBvYmogVGhlIG9iamVjdCB0byBpdGVyYXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgY2FsbGJhY2sgdG8gaW52b2tlIGZvciBlYWNoIGl0ZW1cbiAqL1xuZnVuY3Rpb24gZm9yRWFjaChvYmosIGZuKSB7XG4gIC8vIERvbid0IGJvdGhlciBpZiBubyB2YWx1ZSBwcm92aWRlZFxuICBpZiAob2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRm9yY2UgYW4gYXJyYXkgaWYgbm90IGFscmVhZHkgc29tZXRoaW5nIGl0ZXJhYmxlXG4gIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0Jykge1xuICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAgIG9iaiA9IFtvYmpdO1xuICB9XG5cbiAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBhcnJheSB2YWx1ZXNcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IG9iai5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2ldLCBpLCBvYmopO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgb2JqZWN0IGtleXNcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgICBmbi5jYWxsKG51bGwsIG9ialtrZXldLCBrZXksIG9iaik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQWNjZXB0cyB2YXJhcmdzIGV4cGVjdGluZyBlYWNoIGFyZ3VtZW50IHRvIGJlIGFuIG9iamVjdCwgdGhlblxuICogaW1tdXRhYmx5IG1lcmdlcyB0aGUgcHJvcGVydGllcyBvZiBlYWNoIG9iamVjdCBhbmQgcmV0dXJucyByZXN1bHQuXG4gKlxuICogV2hlbiBtdWx0aXBsZSBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUga2V5IHRoZSBsYXRlciBvYmplY3QgaW5cbiAqIHRoZSBhcmd1bWVudHMgbGlzdCB3aWxsIHRha2UgcHJlY2VkZW5jZS5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgcmVzdWx0ID0gbWVyZ2Uoe2ZvbzogMTIzfSwge2ZvbzogNDU2fSk7XG4gKiBjb25zb2xlLmxvZyhyZXN1bHQuZm9vKTsgLy8gb3V0cHV0cyA0NTZcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmoxIE9iamVjdCB0byBtZXJnZVxuICogQHJldHVybnMge09iamVjdH0gUmVzdWx0IG9mIGFsbCBtZXJnZSBwcm9wZXJ0aWVzXG4gKi9cbmZ1bmN0aW9uIG1lcmdlKC8qIG9iajEsIG9iajIsIG9iajMsIC4uLiAqLykge1xuICB2YXIgcmVzdWx0ID0ge307XG4gIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG4gICAgaWYgKHR5cGVvZiByZXN1bHRba2V5XSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2UocmVzdWx0W2tleV0sIHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsO1xuICAgIH1cbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGZvckVhY2goYXJndW1lbnRzW2ldLCBhc3NpZ25WYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBGdW5jdGlvbiBlcXVhbCB0byBtZXJnZSB3aXRoIHRoZSBkaWZmZXJlbmNlIGJlaW5nIHRoYXQgbm8gcmVmZXJlbmNlXG4gKiB0byBvcmlnaW5hbCBvYmplY3RzIGlzIGtlcHQuXG4gKlxuICogQHNlZSBtZXJnZVxuICogQHBhcmFtIHtPYmplY3R9IG9iajEgT2JqZWN0IHRvIG1lcmdlXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXN1bHQgb2YgYWxsIG1lcmdlIHByb3BlcnRpZXNcbiAqL1xuZnVuY3Rpb24gZGVlcE1lcmdlKC8qIG9iajEsIG9iajIsIG9iajMsIC4uLiAqLykge1xuICB2YXIgcmVzdWx0ID0ge307XG4gIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG4gICAgaWYgKHR5cGVvZiByZXN1bHRba2V5XSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gZGVlcE1lcmdlKHJlc3VsdFtrZXldLCB2YWwpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gZGVlcE1lcmdlKHt9LCB2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHRba2V5XSA9IHZhbDtcbiAgICB9XG4gIH1cblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBmb3JFYWNoKGFyZ3VtZW50c1tpXSwgYXNzaWduVmFsdWUpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRXh0ZW5kcyBvYmplY3QgYSBieSBtdXRhYmx5IGFkZGluZyB0byBpdCB0aGUgcHJvcGVydGllcyBvZiBvYmplY3QgYi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYSBUaGUgb2JqZWN0IHRvIGJlIGV4dGVuZGVkXG4gKiBAcGFyYW0ge09iamVjdH0gYiBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tXG4gKiBAcGFyYW0ge09iamVjdH0gdGhpc0FyZyBUaGUgb2JqZWN0IHRvIGJpbmQgZnVuY3Rpb24gdG9cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHJlc3VsdGluZyB2YWx1ZSBvZiBvYmplY3QgYVxuICovXG5mdW5jdGlvbiBleHRlbmQoYSwgYiwgdGhpc0FyZykge1xuICBmb3JFYWNoKGIsIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG4gICAgaWYgKHRoaXNBcmcgJiYgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYVtrZXldID0gYmluZCh2YWwsIHRoaXNBcmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhW2tleV0gPSB2YWw7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0FycmF5OiBpc0FycmF5LFxuICBpc0FycmF5QnVmZmVyOiBpc0FycmF5QnVmZmVyLFxuICBpc0J1ZmZlcjogaXNCdWZmZXIsXG4gIGlzRm9ybURhdGE6IGlzRm9ybURhdGEsXG4gIGlzQXJyYXlCdWZmZXJWaWV3OiBpc0FycmF5QnVmZmVyVmlldyxcbiAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICBpc051bWJlcjogaXNOdW1iZXIsXG4gIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgaXNVbmRlZmluZWQ6IGlzVW5kZWZpbmVkLFxuICBpc0RhdGU6IGlzRGF0ZSxcbiAgaXNGaWxlOiBpc0ZpbGUsXG4gIGlzQmxvYjogaXNCbG9iLFxuICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICBpc1N0cmVhbTogaXNTdHJlYW0sXG4gIGlzVVJMU2VhcmNoUGFyYW1zOiBpc1VSTFNlYXJjaFBhcmFtcyxcbiAgaXNTdGFuZGFyZEJyb3dzZXJFbnY6IGlzU3RhbmRhcmRCcm93c2VyRW52LFxuICBmb3JFYWNoOiBmb3JFYWNoLFxuICBtZXJnZTogbWVyZ2UsXG4gIGRlZXBNZXJnZTogZGVlcE1lcmdlLFxuICBleHRlbmQ6IGV4dGVuZCxcbiAgdHJpbTogdHJpbVxufTtcbiIsIlxuICAgICh3aW5kb3cuX19ORVhUX1AgPSB3aW5kb3cuX19ORVhUX1AgfHwgW10pLnB1c2goW1xuICAgICAgXCIvXCIsXG4gICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiByZXF1aXJlKFwiQzpcXFxcVXNlcnNcXFxcaGlsbGVsIG5hZ2lkXFxcXERlc2t0b3BcXFxccmh5dGhtXFxcXHBhZ2VzXFxcXGluZGV4LmpzXCIpO1xuICAgICAgfVxuICAgIF0pO1xuICAiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgZGxsLXJlZmVyZW5jZSBkbGxfZWM3ZDljMDI0OWIyZWY1MmI3NGMgKi8gXCJkbGwtcmVmZXJlbmNlIGRsbF9lYzdkOWMwMjQ5YjJlZjUyYjc0Y1wiKSkoXCIuL25vZGVfbW9kdWxlcy9yZWFjdC9pbmRleC5qc1wiKTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gaGFzaChzdHIpIHtcbiAgdmFyIGhhc2ggPSA1MzgxLFxuICAgICAgaSAgICA9IHN0ci5sZW5ndGg7XG5cbiAgd2hpbGUoaSkge1xuICAgIGhhc2ggPSAoaGFzaCAqIDMzKSBeIHN0ci5jaGFyQ29kZUF0KC0taSk7XG4gIH1cblxuICAvKiBKYXZhU2NyaXB0IGRvZXMgYml0d2lzZSBvcGVyYXRpb25zIChsaWtlIFhPUiwgYWJvdmUpIG9uIDMyLWJpdCBzaWduZWRcbiAgICogaW50ZWdlcnMuIFNpbmNlIHdlIHdhbnQgdGhlIHJlc3VsdHMgdG8gYmUgYWx3YXlzIHBvc2l0aXZlLCBjb252ZXJ0IHRoZVxuICAgKiBzaWduZWQgaW50IHRvIGFuIHVuc2lnbmVkIGJ5IGRvaW5nIGFuIHVuc2lnbmVkIGJpdHNoaWZ0LiAqL1xuICByZXR1cm4gaGFzaCA+Pj4gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG4vKlxuQmFzZWQgb24gR2xhbW9yJ3Mgc2hlZXRcbmh0dHBzOi8vZ2l0aHViLmNvbS90aHJlZXBvaW50b25lL2dsYW1vci9ibG9iLzY2N2I0ODBkMzFiMzcyMWE5MDUwMjFiMjZlMTI5MGNlOTJjYTI4Nzkvc3JjL3NoZWV0LmpzXG4qL1xudmFyIGlzUHJvZCA9IHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBwcm9jZXNzLmVudiAmJiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nO1xuXG52YXIgaXNTdHJpbmcgPSBmdW5jdGlvbiBpc1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xufTtcblxudmFyIFN0eWxlU2hlZXQgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBTdHlsZVNoZWV0KF90ZW1wKSB7XG4gICAgdmFyIF9yZWYgPSBfdGVtcCA9PT0gdm9pZCAwID8ge30gOiBfdGVtcCxcbiAgICAgICAgX3JlZiRuYW1lID0gX3JlZi5uYW1lLFxuICAgICAgICBuYW1lID0gX3JlZiRuYW1lID09PSB2b2lkIDAgPyAnc3R5bGVzaGVldCcgOiBfcmVmJG5hbWUsXG4gICAgICAgIF9yZWYkb3B0aW1pemVGb3JTcGVlZCA9IF9yZWYub3B0aW1pemVGb3JTcGVlZCxcbiAgICAgICAgb3B0aW1pemVGb3JTcGVlZCA9IF9yZWYkb3B0aW1pemVGb3JTcGVlZCA9PT0gdm9pZCAwID8gaXNQcm9kIDogX3JlZiRvcHRpbWl6ZUZvclNwZWVkLFxuICAgICAgICBfcmVmJGlzQnJvd3NlciA9IF9yZWYuaXNCcm93c2VyLFxuICAgICAgICBpc0Jyb3dzZXIgPSBfcmVmJGlzQnJvd3NlciA9PT0gdm9pZCAwID8gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgOiBfcmVmJGlzQnJvd3NlcjtcblxuICAgIGludmFyaWFudChpc1N0cmluZyhuYW1lKSwgJ2BuYW1lYCBtdXN0IGJlIGEgc3RyaW5nJyk7XG4gICAgdGhpcy5fbmFtZSA9IG5hbWU7XG4gICAgdGhpcy5fZGVsZXRlZFJ1bGVQbGFjZWhvbGRlciA9IFwiI1wiICsgbmFtZSArIFwiLWRlbGV0ZWQtcnVsZV9fX197fVwiO1xuICAgIGludmFyaWFudCh0eXBlb2Ygb3B0aW1pemVGb3JTcGVlZCA9PT0gJ2Jvb2xlYW4nLCAnYG9wdGltaXplRm9yU3BlZWRgIG11c3QgYmUgYSBib29sZWFuJyk7XG4gICAgdGhpcy5fb3B0aW1pemVGb3JTcGVlZCA9IG9wdGltaXplRm9yU3BlZWQ7XG4gICAgdGhpcy5faXNCcm93c2VyID0gaXNCcm93c2VyO1xuICAgIHRoaXMuX3NlcnZlclNoZWV0ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX3RhZ3MgPSBbXTtcbiAgICB0aGlzLl9pbmplY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3J1bGVzQ291bnQgPSAwO1xuICAgIHZhciBub2RlID0gdGhpcy5faXNCcm93c2VyICYmIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21ldGFbcHJvcGVydHk9XCJjc3Atbm9uY2VcIl0nKTtcbiAgICB0aGlzLl9ub25jZSA9IG5vZGUgPyBub2RlLmdldEF0dHJpYnV0ZSgnY29udGVudCcpIDogbnVsbDtcbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBTdHlsZVNoZWV0LnByb3RvdHlwZTtcblxuICBfcHJvdG8uc2V0T3B0aW1pemVGb3JTcGVlZCA9IGZ1bmN0aW9uIHNldE9wdGltaXplRm9yU3BlZWQoYm9vbCkge1xuICAgIGludmFyaWFudCh0eXBlb2YgYm9vbCA9PT0gJ2Jvb2xlYW4nLCAnYHNldE9wdGltaXplRm9yU3BlZWRgIGFjY2VwdHMgYSBib29sZWFuJyk7XG4gICAgaW52YXJpYW50KHRoaXMuX3J1bGVzQ291bnQgPT09IDAsICdvcHRpbWl6ZUZvclNwZWVkIGNhbm5vdCBiZSB3aGVuIHJ1bGVzIGhhdmUgYWxyZWFkeSBiZWVuIGluc2VydGVkJyk7XG4gICAgdGhpcy5mbHVzaCgpO1xuICAgIHRoaXMuX29wdGltaXplRm9yU3BlZWQgPSBib29sO1xuICAgIHRoaXMuaW5qZWN0KCk7XG4gIH07XG5cbiAgX3Byb3RvLmlzT3B0aW1pemVGb3JTcGVlZCA9IGZ1bmN0aW9uIGlzT3B0aW1pemVGb3JTcGVlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fb3B0aW1pemVGb3JTcGVlZDtcbiAgfTtcblxuICBfcHJvdG8uaW5qZWN0ID0gZnVuY3Rpb24gaW5qZWN0KCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpbnZhcmlhbnQoIXRoaXMuX2luamVjdGVkLCAnc2hlZXQgYWxyZWFkeSBpbmplY3RlZCcpO1xuICAgIHRoaXMuX2luamVjdGVkID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLl9pc0Jyb3dzZXIgJiYgdGhpcy5fb3B0aW1pemVGb3JTcGVlZCkge1xuICAgICAgdGhpcy5fdGFnc1swXSA9IHRoaXMubWFrZVN0eWxlVGFnKHRoaXMuX25hbWUpO1xuICAgICAgdGhpcy5fb3B0aW1pemVGb3JTcGVlZCA9ICdpbnNlcnRSdWxlJyBpbiB0aGlzLmdldFNoZWV0KCk7XG5cbiAgICAgIGlmICghdGhpcy5fb3B0aW1pemVGb3JTcGVlZCkge1xuICAgICAgICBpZiAoIWlzUHJvZCkge1xuICAgICAgICAgIGNvbnNvbGUud2FybignU3R5bGVTaGVldDogb3B0aW1pemVGb3JTcGVlZCBtb2RlIG5vdCBzdXBwb3J0ZWQgZmFsbGluZyBiYWNrIHRvIHN0YW5kYXJkIG1vZGUuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZsdXNoKCk7XG4gICAgICAgIHRoaXMuX2luamVjdGVkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3NlcnZlclNoZWV0ID0ge1xuICAgICAgY3NzUnVsZXM6IFtdLFxuICAgICAgaW5zZXJ0UnVsZTogZnVuY3Rpb24gaW5zZXJ0UnVsZShydWxlLCBpbmRleCkge1xuICAgICAgICBpZiAodHlwZW9mIGluZGV4ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIF90aGlzLl9zZXJ2ZXJTaGVldC5jc3NSdWxlc1tpbmRleF0gPSB7XG4gICAgICAgICAgICBjc3NUZXh0OiBydWxlXG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfdGhpcy5fc2VydmVyU2hlZXQuY3NzUnVsZXMucHVzaCh7XG4gICAgICAgICAgICBjc3NUZXh0OiBydWxlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICB9LFxuICAgICAgZGVsZXRlUnVsZTogZnVuY3Rpb24gZGVsZXRlUnVsZShpbmRleCkge1xuICAgICAgICBfdGhpcy5fc2VydmVyU2hlZXQuY3NzUnVsZXNbaW5kZXhdID0gbnVsbDtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIF9wcm90by5nZXRTaGVldEZvclRhZyA9IGZ1bmN0aW9uIGdldFNoZWV0Rm9yVGFnKHRhZykge1xuICAgIGlmICh0YWcuc2hlZXQpIHtcbiAgICAgIHJldHVybiB0YWcuc2hlZXQ7XG4gICAgfSAvLyB0aGlzIHdlaXJkbmVzcyBicm91Z2h0IHRvIHlvdSBieSBmaXJlZm94XG5cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZG9jdW1lbnQuc3R5bGVTaGVldHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChkb2N1bWVudC5zdHlsZVNoZWV0c1tpXS5vd25lck5vZGUgPT09IHRhZykge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuc3R5bGVTaGVldHNbaV07XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5nZXRTaGVldCA9IGZ1bmN0aW9uIGdldFNoZWV0KCkge1xuICAgIHJldHVybiB0aGlzLmdldFNoZWV0Rm9yVGFnKHRoaXMuX3RhZ3NbdGhpcy5fdGFncy5sZW5ndGggLSAxXSk7XG4gIH07XG5cbiAgX3Byb3RvLmluc2VydFJ1bGUgPSBmdW5jdGlvbiBpbnNlcnRSdWxlKHJ1bGUsIGluZGV4KSB7XG4gICAgaW52YXJpYW50KGlzU3RyaW5nKHJ1bGUpLCAnYGluc2VydFJ1bGVgIGFjY2VwdHMgb25seSBzdHJpbmdzJyk7XG5cbiAgICBpZiAoIXRoaXMuX2lzQnJvd3Nlcikge1xuICAgICAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgaW5kZXggPSB0aGlzLl9zZXJ2ZXJTaGVldC5jc3NSdWxlcy5sZW5ndGg7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3NlcnZlclNoZWV0Lmluc2VydFJ1bGUocnVsZSwgaW5kZXgpO1xuXG4gICAgICByZXR1cm4gdGhpcy5fcnVsZXNDb3VudCsrO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9vcHRpbWl6ZUZvclNwZWVkKSB7XG4gICAgICB2YXIgc2hlZXQgPSB0aGlzLmdldFNoZWV0KCk7XG5cbiAgICAgIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSB7XG4gICAgICAgIGluZGV4ID0gc2hlZXQuY3NzUnVsZXMubGVuZ3RoO1xuICAgICAgfSAvLyB0aGlzIHdlaXJkbmVzcyBmb3IgcGVyZiwgYW5kIGNocm9tZSdzIHdlaXJkIGJ1Z1xuICAgICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjAwMDc5OTIvY2hyb21lLXN1ZGRlbmx5LXN0b3BwZWQtYWNjZXB0aW5nLWluc2VydHJ1bGVcblxuXG4gICAgICB0cnkge1xuICAgICAgICBzaGVldC5pbnNlcnRSdWxlKHJ1bGUsIGluZGV4KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGlmICghaXNQcm9kKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFwiU3R5bGVTaGVldDogaWxsZWdhbCBydWxlOiBcXG5cXG5cIiArIHJ1bGUgKyBcIlxcblxcblNlZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3EvMjAwMDc5OTIgZm9yIG1vcmUgaW5mb1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGluc2VydGlvblBvaW50ID0gdGhpcy5fdGFnc1tpbmRleF07XG5cbiAgICAgIHRoaXMuX3RhZ3MucHVzaCh0aGlzLm1ha2VTdHlsZVRhZyh0aGlzLl9uYW1lLCBydWxlLCBpbnNlcnRpb25Qb2ludCkpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9ydWxlc0NvdW50Kys7XG4gIH07XG5cbiAgX3Byb3RvLnJlcGxhY2VSdWxlID0gZnVuY3Rpb24gcmVwbGFjZVJ1bGUoaW5kZXgsIHJ1bGUpIHtcbiAgICBpZiAodGhpcy5fb3B0aW1pemVGb3JTcGVlZCB8fCAhdGhpcy5faXNCcm93c2VyKSB7XG4gICAgICB2YXIgc2hlZXQgPSB0aGlzLl9pc0Jyb3dzZXIgPyB0aGlzLmdldFNoZWV0KCkgOiB0aGlzLl9zZXJ2ZXJTaGVldDtcblxuICAgICAgaWYgKCFydWxlLnRyaW0oKSkge1xuICAgICAgICBydWxlID0gdGhpcy5fZGVsZXRlZFJ1bGVQbGFjZWhvbGRlcjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFzaGVldC5jc3NSdWxlc1tpbmRleF0pIHtcbiAgICAgICAgLy8gQFRCRCBTaG91bGQgd2UgdGhyb3cgYW4gZXJyb3I/XG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICAgIH1cblxuICAgICAgc2hlZXQuZGVsZXRlUnVsZShpbmRleCk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHNoZWV0Lmluc2VydFJ1bGUocnVsZSwgaW5kZXgpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgaWYgKCFpc1Byb2QpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oXCJTdHlsZVNoZWV0OiBpbGxlZ2FsIHJ1bGU6IFxcblxcblwiICsgcnVsZSArIFwiXFxuXFxuU2VlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcS8yMDAwNzk5MiBmb3IgbW9yZSBpbmZvXCIpO1xuICAgICAgICB9IC8vIEluIG9yZGVyIHRvIHByZXNlcnZlIHRoZSBpbmRpY2VzIHdlIGluc2VydCBhIGRlbGV0ZVJ1bGVQbGFjZWhvbGRlclxuXG5cbiAgICAgICAgc2hlZXQuaW5zZXJ0UnVsZSh0aGlzLl9kZWxldGVkUnVsZVBsYWNlaG9sZGVyLCBpbmRleCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB0YWcgPSB0aGlzLl90YWdzW2luZGV4XTtcbiAgICAgIGludmFyaWFudCh0YWcsIFwib2xkIHJ1bGUgYXQgaW5kZXggYFwiICsgaW5kZXggKyBcImAgbm90IGZvdW5kXCIpO1xuICAgICAgdGFnLnRleHRDb250ZW50ID0gcnVsZTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW5kZXg7XG4gIH07XG5cbiAgX3Byb3RvLmRlbGV0ZVJ1bGUgPSBmdW5jdGlvbiBkZWxldGVSdWxlKGluZGV4KSB7XG4gICAgaWYgKCF0aGlzLl9pc0Jyb3dzZXIpIHtcbiAgICAgIHRoaXMuX3NlcnZlclNoZWV0LmRlbGV0ZVJ1bGUoaW5kZXgpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX29wdGltaXplRm9yU3BlZWQpIHtcbiAgICAgIHRoaXMucmVwbGFjZVJ1bGUoaW5kZXgsICcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHRhZyA9IHRoaXMuX3RhZ3NbaW5kZXhdO1xuICAgICAgaW52YXJpYW50KHRhZywgXCJydWxlIGF0IGluZGV4IGBcIiArIGluZGV4ICsgXCJgIG5vdCBmb3VuZFwiKTtcbiAgICAgIHRhZy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRhZyk7XG4gICAgICB0aGlzLl90YWdzW2luZGV4XSA9IG51bGw7XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5mbHVzaCA9IGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHRoaXMuX2luamVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5fcnVsZXNDb3VudCA9IDA7XG5cbiAgICBpZiAodGhpcy5faXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl90YWdzLmZvckVhY2goZnVuY3Rpb24gKHRhZykge1xuICAgICAgICByZXR1cm4gdGFnICYmIHRhZy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRhZyk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fdGFncyA9IFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBzaW1wbGVyIG9uIHNlcnZlclxuICAgICAgdGhpcy5fc2VydmVyU2hlZXQuY3NzUnVsZXMgPSBbXTtcbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLmNzc1J1bGVzID0gZnVuY3Rpb24gY3NzUnVsZXMoKSB7XG4gICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICBpZiAoIXRoaXMuX2lzQnJvd3Nlcikge1xuICAgICAgcmV0dXJuIHRoaXMuX3NlcnZlclNoZWV0LmNzc1J1bGVzO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl90YWdzLnJlZHVjZShmdW5jdGlvbiAocnVsZXMsIHRhZykge1xuICAgICAgaWYgKHRhZykge1xuICAgICAgICBydWxlcyA9IHJ1bGVzLmNvbmNhdChBcnJheS5wcm90b3R5cGUubWFwLmNhbGwoX3RoaXMyLmdldFNoZWV0Rm9yVGFnKHRhZykuY3NzUnVsZXMsIGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICAgICAgcmV0dXJuIHJ1bGUuY3NzVGV4dCA9PT0gX3RoaXMyLl9kZWxldGVkUnVsZVBsYWNlaG9sZGVyID8gbnVsbCA6IHJ1bGU7XG4gICAgICAgIH0pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJ1bGVzLnB1c2gobnVsbCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBydWxlcztcbiAgICB9LCBbXSk7XG4gIH07XG5cbiAgX3Byb3RvLm1ha2VTdHlsZVRhZyA9IGZ1bmN0aW9uIG1ha2VTdHlsZVRhZyhuYW1lLCBjc3NTdHJpbmcsIHJlbGF0aXZlVG9UYWcpIHtcbiAgICBpZiAoY3NzU3RyaW5nKSB7XG4gICAgICBpbnZhcmlhbnQoaXNTdHJpbmcoY3NzU3RyaW5nKSwgJ21ha2VTdHlsZVRhZyBhY2NlcHMgb25seSBzdHJpbmdzIGFzIHNlY29uZCBwYXJhbWV0ZXInKTtcbiAgICB9XG5cbiAgICB2YXIgdGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICBpZiAodGhpcy5fbm9uY2UpIHRhZy5zZXRBdHRyaWJ1dGUoJ25vbmNlJywgdGhpcy5fbm9uY2UpO1xuICAgIHRhZy50eXBlID0gJ3RleHQvY3NzJztcbiAgICB0YWcuc2V0QXR0cmlidXRlKFwiZGF0YS1cIiArIG5hbWUsICcnKTtcblxuICAgIGlmIChjc3NTdHJpbmcpIHtcbiAgICAgIHRhZy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3NTdHJpbmcpKTtcbiAgICB9XG5cbiAgICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcblxuICAgIGlmIChyZWxhdGl2ZVRvVGFnKSB7XG4gICAgICBoZWFkLmluc2VydEJlZm9yZSh0YWcsIHJlbGF0aXZlVG9UYWcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWFkLmFwcGVuZENoaWxkKHRhZyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhZztcbiAgfTtcblxuICBfY3JlYXRlQ2xhc3MoU3R5bGVTaGVldCwgW3tcbiAgICBrZXk6IFwibGVuZ3RoXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcnVsZXNDb3VudDtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gU3R5bGVTaGVldDtcbn0oKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBTdHlsZVNoZWV0O1xuXG5mdW5jdGlvbiBpbnZhcmlhbnQoY29uZGl0aW9uLCBtZXNzYWdlKSB7XG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiU3R5bGVTaGVldDogXCIgKyBtZXNzYWdlICsgXCIuXCIpO1xuICB9XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmZsdXNoID0gZmx1c2g7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcblxudmFyIF9zdHlsZXNoZWV0UmVnaXN0cnkgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL3N0eWxlc2hlZXQtcmVnaXN0cnlcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzTG9vc2Uoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzLnByb3RvdHlwZSk7IHN1YkNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHN1YkNsYXNzOyBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBzdHlsZVNoZWV0UmVnaXN0cnkgPSBuZXcgX3N0eWxlc2hlZXRSZWdpc3RyeVtcImRlZmF1bHRcIl0oKTtcblxudmFyIEpTWFN0eWxlID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfQ29tcG9uZW50KSB7XG4gIF9pbmhlcml0c0xvb3NlKEpTWFN0eWxlLCBfQ29tcG9uZW50KTtcblxuICBmdW5jdGlvbiBKU1hTdHlsZShwcm9wcykge1xuICAgIHZhciBfdGhpcztcblxuICAgIF90aGlzID0gX0NvbXBvbmVudC5jYWxsKHRoaXMsIHByb3BzKSB8fCB0aGlzO1xuICAgIF90aGlzLnByZXZQcm9wcyA9IHt9O1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIEpTWFN0eWxlLmR5bmFtaWMgPSBmdW5jdGlvbiBkeW5hbWljKGluZm8pIHtcbiAgICByZXR1cm4gaW5mby5tYXAoZnVuY3Rpb24gKHRhZ0luZm8pIHtcbiAgICAgIHZhciBiYXNlSWQgPSB0YWdJbmZvWzBdO1xuICAgICAgdmFyIHByb3BzID0gdGFnSW5mb1sxXTtcbiAgICAgIHJldHVybiBzdHlsZVNoZWV0UmVnaXN0cnkuY29tcHV0ZUlkKGJhc2VJZCwgcHJvcHMpO1xuICAgIH0pLmpvaW4oJyAnKTtcbiAgfSAvLyBwcm9iYWJseSBmYXN0ZXIgdGhhbiBQdXJlQ29tcG9uZW50IChzaGFsbG93RXF1YWwpXG4gIDtcblxuICB2YXIgX3Byb3RvID0gSlNYU3R5bGUucHJvdG90eXBlO1xuXG4gIF9wcm90by5zaG91bGRDb21wb25lbnRVcGRhdGUgPSBmdW5jdGlvbiBzaG91bGRDb21wb25lbnRVcGRhdGUob3RoZXJQcm9wcykge1xuICAgIHJldHVybiB0aGlzLnByb3BzLmlkICE9PSBvdGhlclByb3BzLmlkIHx8IC8vIFdlIGRvIHRoaXMgY2hlY2sgYmVjYXVzZSBgZHluYW1pY2AgaXMgYW4gYXJyYXkgb2Ygc3RyaW5ncyBvciB1bmRlZmluZWQuXG4gICAgLy8gVGhlc2UgYXJlIHRoZSBjb21wdXRlZCB2YWx1ZXMgZm9yIGR5bmFtaWMgc3R5bGVzLlxuICAgIFN0cmluZyh0aGlzLnByb3BzLmR5bmFtaWMpICE9PSBTdHJpbmcob3RoZXJQcm9wcy5keW5hbWljKTtcbiAgfTtcblxuICBfcHJvdG8uY29tcG9uZW50V2lsbFVubW91bnQgPSBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBzdHlsZVNoZWV0UmVnaXN0cnkucmVtb3ZlKHRoaXMucHJvcHMpO1xuICB9O1xuXG4gIF9wcm90by5yZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgLy8gVGhpcyBpcyBhIHdvcmthcm91bmQgdG8gbWFrZSB0aGUgc2lkZSBlZmZlY3QgYXN5bmMgc2FmZSBpbiB0aGUgXCJyZW5kZXJcIiBwaGFzZS5cbiAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3plaXQvc3R5bGVkLWpzeC9wdWxsLzQ4NFxuICAgIGlmICh0aGlzLnNob3VsZENvbXBvbmVudFVwZGF0ZSh0aGlzLnByZXZQcm9wcykpIHtcbiAgICAgIC8vIFVwZGF0ZXNcbiAgICAgIGlmICh0aGlzLnByZXZQcm9wcy5pZCkge1xuICAgICAgICBzdHlsZVNoZWV0UmVnaXN0cnkucmVtb3ZlKHRoaXMucHJldlByb3BzKTtcbiAgICAgIH1cblxuICAgICAgc3R5bGVTaGVldFJlZ2lzdHJ5LmFkZCh0aGlzLnByb3BzKTtcbiAgICAgIHRoaXMucHJldlByb3BzID0gdGhpcy5wcm9wcztcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcblxuICByZXR1cm4gSlNYU3R5bGU7XG59KF9yZWFjdC5Db21wb25lbnQpO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEpTWFN0eWxlO1xuXG5mdW5jdGlvbiBmbHVzaCgpIHtcbiAgdmFyIGNzc1J1bGVzID0gc3R5bGVTaGVldFJlZ2lzdHJ5LmNzc1J1bGVzKCk7XG4gIHN0eWxlU2hlZXRSZWdpc3RyeS5mbHVzaCgpO1xuICByZXR1cm4gY3NzUnVsZXM7XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9zdHJpbmdIYXNoID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwic3RyaW5nLWhhc2hcIikpO1xuXG52YXIgX3N0eWxlc2hlZXQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2xpYi9zdHlsZXNoZWV0XCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbnZhciBzYW5pdGl6ZSA9IGZ1bmN0aW9uIHNhbml0aXplKHJ1bGUpIHtcbiAgcmV0dXJuIHJ1bGUucmVwbGFjZSgvXFwvc3R5bGUvZ2ksICdcXFxcL3N0eWxlJyk7XG59O1xuXG52YXIgU3R5bGVTaGVldFJlZ2lzdHJ5ID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gU3R5bGVTaGVldFJlZ2lzdHJ5KF90ZW1wKSB7XG4gICAgdmFyIF9yZWYgPSBfdGVtcCA9PT0gdm9pZCAwID8ge30gOiBfdGVtcCxcbiAgICAgICAgX3JlZiRzdHlsZVNoZWV0ID0gX3JlZi5zdHlsZVNoZWV0LFxuICAgICAgICBzdHlsZVNoZWV0ID0gX3JlZiRzdHlsZVNoZWV0ID09PSB2b2lkIDAgPyBudWxsIDogX3JlZiRzdHlsZVNoZWV0LFxuICAgICAgICBfcmVmJG9wdGltaXplRm9yU3BlZWQgPSBfcmVmLm9wdGltaXplRm9yU3BlZWQsXG4gICAgICAgIG9wdGltaXplRm9yU3BlZWQgPSBfcmVmJG9wdGltaXplRm9yU3BlZWQgPT09IHZvaWQgMCA/IGZhbHNlIDogX3JlZiRvcHRpbWl6ZUZvclNwZWVkLFxuICAgICAgICBfcmVmJGlzQnJvd3NlciA9IF9yZWYuaXNCcm93c2VyLFxuICAgICAgICBpc0Jyb3dzZXIgPSBfcmVmJGlzQnJvd3NlciA9PT0gdm9pZCAwID8gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgOiBfcmVmJGlzQnJvd3NlcjtcblxuICAgIHRoaXMuX3NoZWV0ID0gc3R5bGVTaGVldCB8fCBuZXcgX3N0eWxlc2hlZXRbXCJkZWZhdWx0XCJdKHtcbiAgICAgIG5hbWU6ICdzdHlsZWQtanN4JyxcbiAgICAgIG9wdGltaXplRm9yU3BlZWQ6IG9wdGltaXplRm9yU3BlZWRcbiAgICB9KTtcblxuICAgIHRoaXMuX3NoZWV0LmluamVjdCgpO1xuXG4gICAgaWYgKHN0eWxlU2hlZXQgJiYgdHlwZW9mIG9wdGltaXplRm9yU3BlZWQgPT09ICdib29sZWFuJykge1xuICAgICAgdGhpcy5fc2hlZXQuc2V0T3B0aW1pemVGb3JTcGVlZChvcHRpbWl6ZUZvclNwZWVkKTtcblxuICAgICAgdGhpcy5fb3B0aW1pemVGb3JTcGVlZCA9IHRoaXMuX3NoZWV0LmlzT3B0aW1pemVGb3JTcGVlZCgpO1xuICAgIH1cblxuICAgIHRoaXMuX2lzQnJvd3NlciA9IGlzQnJvd3NlcjtcbiAgICB0aGlzLl9mcm9tU2VydmVyID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2luZGljZXMgPSB7fTtcbiAgICB0aGlzLl9pbnN0YW5jZXNDb3VudHMgPSB7fTtcbiAgICB0aGlzLmNvbXB1dGVJZCA9IHRoaXMuY3JlYXRlQ29tcHV0ZUlkKCk7XG4gICAgdGhpcy5jb21wdXRlU2VsZWN0b3IgPSB0aGlzLmNyZWF0ZUNvbXB1dGVTZWxlY3RvcigpO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IFN0eWxlU2hlZXRSZWdpc3RyeS5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLmFkZCA9IGZ1bmN0aW9uIGFkZChwcm9wcykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAodW5kZWZpbmVkID09PSB0aGlzLl9vcHRpbWl6ZUZvclNwZWVkKSB7XG4gICAgICB0aGlzLl9vcHRpbWl6ZUZvclNwZWVkID0gQXJyYXkuaXNBcnJheShwcm9wcy5jaGlsZHJlbik7XG5cbiAgICAgIHRoaXMuX3NoZWV0LnNldE9wdGltaXplRm9yU3BlZWQodGhpcy5fb3B0aW1pemVGb3JTcGVlZCk7XG5cbiAgICAgIHRoaXMuX29wdGltaXplRm9yU3BlZWQgPSB0aGlzLl9zaGVldC5pc09wdGltaXplRm9yU3BlZWQoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5faXNCcm93c2VyICYmICF0aGlzLl9mcm9tU2VydmVyKSB7XG4gICAgICB0aGlzLl9mcm9tU2VydmVyID0gdGhpcy5zZWxlY3RGcm9tU2VydmVyKCk7XG4gICAgICB0aGlzLl9pbnN0YW5jZXNDb3VudHMgPSBPYmplY3Qua2V5cyh0aGlzLl9mcm9tU2VydmVyKS5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgdGFnTmFtZSkge1xuICAgICAgICBhY2NbdGFnTmFtZV0gPSAwO1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSwge30pO1xuICAgIH1cblxuICAgIHZhciBfdGhpcyRnZXRJZEFuZFJ1bGVzID0gdGhpcy5nZXRJZEFuZFJ1bGVzKHByb3BzKSxcbiAgICAgICAgc3R5bGVJZCA9IF90aGlzJGdldElkQW5kUnVsZXMuc3R5bGVJZCxcbiAgICAgICAgcnVsZXMgPSBfdGhpcyRnZXRJZEFuZFJ1bGVzLnJ1bGVzOyAvLyBEZWR1cGluZzoganVzdCBpbmNyZWFzZSB0aGUgaW5zdGFuY2VzIGNvdW50LlxuXG5cbiAgICBpZiAoc3R5bGVJZCBpbiB0aGlzLl9pbnN0YW5jZXNDb3VudHMpIHtcbiAgICAgIHRoaXMuX2luc3RhbmNlc0NvdW50c1tzdHlsZUlkXSArPSAxO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBpbmRpY2VzID0gcnVsZXMubWFwKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICByZXR1cm4gX3RoaXMuX3NoZWV0Lmluc2VydFJ1bGUocnVsZSk7XG4gICAgfSkgLy8gRmlsdGVyIG91dCBpbnZhbGlkIHJ1bGVzXG4gICAgLmZpbHRlcihmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgIHJldHVybiBpbmRleCAhPT0gLTE7XG4gICAgfSk7XG4gICAgdGhpcy5faW5kaWNlc1tzdHlsZUlkXSA9IGluZGljZXM7XG4gICAgdGhpcy5faW5zdGFuY2VzQ291bnRzW3N0eWxlSWRdID0gMTtcbiAgfTtcblxuICBfcHJvdG8ucmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlKHByb3BzKSB7XG4gICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICB2YXIgX3RoaXMkZ2V0SWRBbmRSdWxlczIgPSB0aGlzLmdldElkQW5kUnVsZXMocHJvcHMpLFxuICAgICAgICBzdHlsZUlkID0gX3RoaXMkZ2V0SWRBbmRSdWxlczIuc3R5bGVJZDtcblxuICAgIGludmFyaWFudChzdHlsZUlkIGluIHRoaXMuX2luc3RhbmNlc0NvdW50cywgXCJzdHlsZUlkOiBgXCIgKyBzdHlsZUlkICsgXCJgIG5vdCBmb3VuZFwiKTtcbiAgICB0aGlzLl9pbnN0YW5jZXNDb3VudHNbc3R5bGVJZF0gLT0gMTtcblxuICAgIGlmICh0aGlzLl9pbnN0YW5jZXNDb3VudHNbc3R5bGVJZF0gPCAxKSB7XG4gICAgICB2YXIgdGFnRnJvbVNlcnZlciA9IHRoaXMuX2Zyb21TZXJ2ZXIgJiYgdGhpcy5fZnJvbVNlcnZlcltzdHlsZUlkXTtcblxuICAgICAgaWYgKHRhZ0Zyb21TZXJ2ZXIpIHtcbiAgICAgICAgdGFnRnJvbVNlcnZlci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRhZ0Zyb21TZXJ2ZXIpO1xuICAgICAgICBkZWxldGUgdGhpcy5fZnJvbVNlcnZlcltzdHlsZUlkXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2luZGljZXNbc3R5bGVJZF0uZm9yRWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMyLl9zaGVldC5kZWxldGVSdWxlKGluZGV4KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVsZXRlIHRoaXMuX2luZGljZXNbc3R5bGVJZF07XG4gICAgICB9XG5cbiAgICAgIGRlbGV0ZSB0aGlzLl9pbnN0YW5jZXNDb3VudHNbc3R5bGVJZF07XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUocHJvcHMsIG5leHRQcm9wcykge1xuICAgIHRoaXMuYWRkKG5leHRQcm9wcyk7XG4gICAgdGhpcy5yZW1vdmUocHJvcHMpO1xuICB9O1xuXG4gIF9wcm90by5mbHVzaCA9IGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHRoaXMuX3NoZWV0LmZsdXNoKCk7XG5cbiAgICB0aGlzLl9zaGVldC5pbmplY3QoKTtcblxuICAgIHRoaXMuX2Zyb21TZXJ2ZXIgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5faW5kaWNlcyA9IHt9O1xuICAgIHRoaXMuX2luc3RhbmNlc0NvdW50cyA9IHt9O1xuICAgIHRoaXMuY29tcHV0ZUlkID0gdGhpcy5jcmVhdGVDb21wdXRlSWQoKTtcbiAgICB0aGlzLmNvbXB1dGVTZWxlY3RvciA9IHRoaXMuY3JlYXRlQ29tcHV0ZVNlbGVjdG9yKCk7XG4gIH07XG5cbiAgX3Byb3RvLmNzc1J1bGVzID0gZnVuY3Rpb24gY3NzUnVsZXMoKSB7XG4gICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICB2YXIgZnJvbVNlcnZlciA9IHRoaXMuX2Zyb21TZXJ2ZXIgPyBPYmplY3Qua2V5cyh0aGlzLl9mcm9tU2VydmVyKS5tYXAoZnVuY3Rpb24gKHN0eWxlSWQpIHtcbiAgICAgIHJldHVybiBbc3R5bGVJZCwgX3RoaXMzLl9mcm9tU2VydmVyW3N0eWxlSWRdXTtcbiAgICB9KSA6IFtdO1xuXG4gICAgdmFyIGNzc1J1bGVzID0gdGhpcy5fc2hlZXQuY3NzUnVsZXMoKTtcblxuICAgIHJldHVybiBmcm9tU2VydmVyLmNvbmNhdChPYmplY3Qua2V5cyh0aGlzLl9pbmRpY2VzKS5tYXAoZnVuY3Rpb24gKHN0eWxlSWQpIHtcbiAgICAgIHJldHVybiBbc3R5bGVJZCwgX3RoaXMzLl9pbmRpY2VzW3N0eWxlSWRdLm1hcChmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGNzc1J1bGVzW2luZGV4XS5jc3NUZXh0O1xuICAgICAgfSkuam9pbihfdGhpczMuX29wdGltaXplRm9yU3BlZWQgPyAnJyA6ICdcXG4nKV07XG4gICAgfSkgLy8gZmlsdGVyIG91dCBlbXB0eSBydWxlc1xuICAgIC5maWx0ZXIoZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgIHJldHVybiBCb29sZWFuKHJ1bGVbMV0pO1xuICAgIH0pKTtcbiAgfVxuICAvKipcbiAgICogY3JlYXRlQ29tcHV0ZUlkXG4gICAqXG4gICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0byBjb21wdXRlIGFuZCBtZW1vaXplIGEganN4IGlkIGZyb20gYSBiYXNlZElkIGFuZCBvcHRpb25hbGx5IHByb3BzLlxuICAgKi9cbiAgO1xuXG4gIF9wcm90by5jcmVhdGVDb21wdXRlSWQgPSBmdW5jdGlvbiBjcmVhdGVDb21wdXRlSWQoKSB7XG4gICAgdmFyIGNhY2hlID0ge307XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChiYXNlSWQsIHByb3BzKSB7XG4gICAgICBpZiAoIXByb3BzKSB7XG4gICAgICAgIHJldHVybiBcImpzeC1cIiArIGJhc2VJZDtcbiAgICAgIH1cblxuICAgICAgdmFyIHByb3BzVG9TdHJpbmcgPSBTdHJpbmcocHJvcHMpO1xuICAgICAgdmFyIGtleSA9IGJhc2VJZCArIHByb3BzVG9TdHJpbmc7IC8vIHJldHVybiBganN4LSR7aGFzaFN0cmluZyhgJHtiYXNlSWR9LSR7cHJvcHNUb1N0cmluZ31gKX1gXG5cbiAgICAgIGlmICghY2FjaGVba2V5XSkge1xuICAgICAgICBjYWNoZVtrZXldID0gXCJqc3gtXCIgKyAoMCwgX3N0cmluZ0hhc2hbXCJkZWZhdWx0XCJdKShiYXNlSWQgKyBcIi1cIiArIHByb3BzVG9TdHJpbmcpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY2FjaGVba2V5XTtcbiAgICB9O1xuICB9XG4gIC8qKlxuICAgKiBjcmVhdGVDb21wdXRlU2VsZWN0b3JcbiAgICpcbiAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRvIGNvbXB1dGUgYW5kIG1lbW9pemUgZHluYW1pYyBzZWxlY3RvcnMuXG4gICAqL1xuICA7XG5cbiAgX3Byb3RvLmNyZWF0ZUNvbXB1dGVTZWxlY3RvciA9IGZ1bmN0aW9uIGNyZWF0ZUNvbXB1dGVTZWxlY3RvcihzZWxlY3RvUGxhY2Vob2xkZXJSZWdleHApIHtcbiAgICBpZiAoc2VsZWN0b1BsYWNlaG9sZGVyUmVnZXhwID09PSB2b2lkIDApIHtcbiAgICAgIHNlbGVjdG9QbGFjZWhvbGRlclJlZ2V4cCA9IC9fX2pzeC1zdHlsZS1keW5hbWljLXNlbGVjdG9yL2c7XG4gICAgfVxuXG4gICAgdmFyIGNhY2hlID0ge307XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChpZCwgY3NzKSB7XG4gICAgICAvLyBTYW5pdGl6ZSBTU1ItZWQgQ1NTLlxuICAgICAgLy8gQ2xpZW50IHNpZGUgY29kZSBkb2Vzbid0IG5lZWQgdG8gYmUgc2FuaXRpemVkIHNpbmNlIHdlIHVzZVxuICAgICAgLy8gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUgKGRldikgYW5kIHRoZSBDU1NPTSBhcGkgc2hlZXQuaW5zZXJ0UnVsZSAocHJvZCkuXG4gICAgICBpZiAoIXRoaXMuX2lzQnJvd3Nlcikge1xuICAgICAgICBjc3MgPSBzYW5pdGl6ZShjc3MpO1xuICAgICAgfVxuXG4gICAgICB2YXIgaWRjc3MgPSBpZCArIGNzcztcblxuICAgICAgaWYgKCFjYWNoZVtpZGNzc10pIHtcbiAgICAgICAgY2FjaGVbaWRjc3NdID0gY3NzLnJlcGxhY2Uoc2VsZWN0b1BsYWNlaG9sZGVyUmVnZXhwLCBpZCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjYWNoZVtpZGNzc107XG4gICAgfTtcbiAgfTtcblxuICBfcHJvdG8uZ2V0SWRBbmRSdWxlcyA9IGZ1bmN0aW9uIGdldElkQW5kUnVsZXMocHJvcHMpIHtcbiAgICB2YXIgX3RoaXM0ID0gdGhpcztcblxuICAgIHZhciBjc3MgPSBwcm9wcy5jaGlsZHJlbixcbiAgICAgICAgZHluYW1pYyA9IHByb3BzLmR5bmFtaWMsXG4gICAgICAgIGlkID0gcHJvcHMuaWQ7XG5cbiAgICBpZiAoZHluYW1pYykge1xuICAgICAgdmFyIHN0eWxlSWQgPSB0aGlzLmNvbXB1dGVJZChpZCwgZHluYW1pYyk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdHlsZUlkOiBzdHlsZUlkLFxuICAgICAgICBydWxlczogQXJyYXkuaXNBcnJheShjc3MpID8gY3NzLm1hcChmdW5jdGlvbiAocnVsZSkge1xuICAgICAgICAgIHJldHVybiBfdGhpczQuY29tcHV0ZVNlbGVjdG9yKHN0eWxlSWQsIHJ1bGUpO1xuICAgICAgICB9KSA6IFt0aGlzLmNvbXB1dGVTZWxlY3RvcihzdHlsZUlkLCBjc3MpXVxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgc3R5bGVJZDogdGhpcy5jb21wdXRlSWQoaWQpLFxuICAgICAgcnVsZXM6IEFycmF5LmlzQXJyYXkoY3NzKSA/IGNzcyA6IFtjc3NdXG4gICAgfTtcbiAgfVxuICAvKipcbiAgICogc2VsZWN0RnJvbVNlcnZlclxuICAgKlxuICAgKiBDb2xsZWN0cyBzdHlsZSB0YWdzIGZyb20gdGhlIGRvY3VtZW50IHdpdGggaWQgX19qc3gtWFhYXG4gICAqL1xuICA7XG5cbiAgX3Byb3RvLnNlbGVjdEZyb21TZXJ2ZXIgPSBmdW5jdGlvbiBzZWxlY3RGcm9tU2VydmVyKCkge1xuICAgIHZhciBlbGVtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpZF49XCJfX2pzeC1cIl0nKSk7XG4gICAgcmV0dXJuIGVsZW1lbnRzLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBlbGVtZW50KSB7XG4gICAgICB2YXIgaWQgPSBlbGVtZW50LmlkLnNsaWNlKDIpO1xuICAgICAgYWNjW2lkXSA9IGVsZW1lbnQ7XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbiAgfTtcblxuICByZXR1cm4gU3R5bGVTaGVldFJlZ2lzdHJ5O1xufSgpO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IFN0eWxlU2hlZXRSZWdpc3RyeTtcblxuZnVuY3Rpb24gaW52YXJpYW50KGNvbmRpdGlvbiwgbWVzc2FnZSkge1xuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlN0eWxlU2hlZXRSZWdpc3RyeTogXCIgKyBtZXNzYWdlICsgXCIuXCIpO1xuICB9XG59IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Rpc3Qvc3R5bGUnKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcmlnaW5hbE1vZHVsZSkge1xuXHRpZiAoIW9yaWdpbmFsTW9kdWxlLndlYnBhY2tQb2x5ZmlsbCkge1xuXHRcdHZhciBtb2R1bGUgPSBPYmplY3QuY3JlYXRlKG9yaWdpbmFsTW9kdWxlKTtcblx0XHQvLyBtb2R1bGUucGFyZW50ID0gdW5kZWZpbmVkIGJ5IGRlZmF1bHRcblx0XHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJsb2FkZWRcIiwge1xuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBtb2R1bGUubDtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImlkXCIsIHtcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJleHBvcnRzXCIsIHtcblx0XHRcdGVudW1lcmFibGU6IHRydWVcblx0XHR9KTtcblx0XHRtb2R1bGUud2VicGFja1BvbHlmaWxsID0gMTtcblx0fVxuXHRyZXR1cm4gbW9kdWxlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obW9kdWxlKSB7XG5cdGlmICghbW9kdWxlLndlYnBhY2tQb2x5ZmlsbCkge1xuXHRcdG1vZHVsZS5kZXByZWNhdGUgPSBmdW5jdGlvbigpIHt9O1xuXHRcdG1vZHVsZS5wYXRocyA9IFtdO1xuXHRcdC8vIG1vZHVsZS5wYXJlbnQgPSB1bmRlZmluZWQgYnkgZGVmYXVsdFxuXHRcdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImxvYWRlZFwiLCB7XG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5sO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwiaWRcIiwge1xuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBtb2R1bGUuaTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRtb2R1bGUud2VicGFja1BvbHlmaWxsID0gMTtcblx0fVxuXHRyZXR1cm4gbW9kdWxlO1xufTtcbiIsImltcG9ydCBCYW5kSlMgZnJvbSAnLi4vYmFuZC5qcy9kaXN0L2JhbmQnO1xyXG5pbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5cclxuY2xhc3MgQXVkaW8gZXh0ZW5kcyBDb21wb25lbnQge1xyXG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcblx0XHRzdXBlcihwcm9wcyk7XHJcblx0XHR0aGlzLnN0YXRlID0geyBwbGF5ZXI6ICcnIH07XHJcblx0fVxyXG5cdHBsYXlIYW5kbGVyID0gKCkgPT4ge1xyXG5cdFx0aWYgKHRoaXMuc3RhdGUucGxheWVyKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHRoaXMuc3RhdGUucGxheWVyKTtcclxuXHRcdFx0dGhpcy5zdGF0ZS5wbGF5ZXIuc3RvcCgpO1xyXG5cdFx0fVxyXG5cdFx0bGV0IGNvbmR1Y3RvciA9IG5ldyBCYW5kSlMoKTtcclxuXHRcdGxldCBzZWN0aW9uc1Byb3BzID0gW107XHJcblx0XHR0aGlzLnByb3BzLmFuYWx5c2lzLnNlY3Rpb25zLmZvckVhY2goKHNlY3Rpb24pID0+IHtcclxuXHRcdFx0c2VjdGlvbnNQcm9wcy5wdXNoKFtzZWN0aW9uLmR1cmF0aW9uICogMTAwMCwgc2VjdGlvbi50ZW1wb10pO1xyXG5cdFx0fSk7XHJcblx0XHRjb25zb2xlLmxvZyhzZWN0aW9uc1Byb3BzKTtcclxuXHRcdGNvbmR1Y3Rvci5zZXRUaW1lU2lnbmF0dXJlKDQsIDQpO1xyXG5cdFx0Y29uZHVjdG9yLnNldFRlbXBvKHNlY3Rpb25zUHJvcHNbMF1bMV0pO1xyXG5cdFx0bGV0IHBpYW5vID0gY29uZHVjdG9yLmNyZWF0ZUluc3RydW1lbnQoJ3NpbmUnKTtcclxuXHRcdHBpYW5vLm5vdGUoJ3F1YXJ0ZXInLCAnRzMnKTtcclxuXHRcdHRoaXMuc2V0U3RhdGUoeyBwbGF5ZXI6IGNvbmR1Y3Rvci5maW5pc2goKSB9KTtcclxuXHRcdGNvbnNvbGUubG9nKHRoaXMuc3RhdGUucGxheWVyKTtcclxuXHRcdHRoaXMuc3RhdGUucGxheWVyLmxvb3AodHJ1ZSk7XHJcblx0XHRyaHl0aG1UaW1lcihzZWN0aW9uc1Byb3BzWzBdWzBdKTtcclxuXHRcdGZ1bmN0aW9uIHJoeXRobVRpbWVyKHRpbWUpIHtcclxuXHRcdFx0dGhpcy5zdGF0ZS5wbGF5ZXIucGxheSgpO1xyXG5cdFx0XHRzZWN0aW9uc1Byb3BzLnNoaWZ0KCk7XHJcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuc3RhdGUucGxheWVyLnN0b3AoKTtcclxuXHRcdFx0XHRpZiAoc2VjdGlvbnNQcm9wcy5sZW5ndGggIT0gMCkge1xyXG5cdFx0XHRcdFx0Y29uZHVjdG9yLnNldFRlbXBvKHNlY3Rpb25zUHJvcHNbMF1bMV0pO1xyXG5cdFx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IHBsYXllcjogY29uZHVjdG9yLmZpbmlzaCgpIH0pO1xyXG5cdFx0XHRcdFx0dGhpcy5zdGF0ZS5wbGF5ZXIubG9vcCh0cnVlKTtcclxuXHRcdFx0XHRcdHJoeXRobVRpbWVyKHNlY3Rpb25zUHJvcHNbMF1bMF0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgdGltZSk7XHJcblx0XHR9XHJcblx0fTtcclxuXHRyZW5kZXIoKSB7XHJcblx0XHRyZXR1cm4gPHAgb25DbGljaz17dGhpcy5wbGF5SGFuZGxlcn0+Y2xpY2sgTWU8L3A+O1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQXVkaW87XHJcbiIsImltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XHJcbmltcG9ydCBBdWRpbyBmcm9tICcuL0F1ZGlvJztcclxuY29uc3QgVHJhY2tzUmVzdWx0cyA9IHByb3BzID0+IHtcclxuXHRjb25zdCB0cmFja1JlZiA9IFJlYWN0LmNyZWF0ZVJlZigpO1xyXG5cdGxldCBhbmFseXNpcztcclxuXHRsZXQgW3NhLCBzYXNdID0gUmVhY3QudXNlU3RhdGUoYW5hbHlzaXMpO1xyXG5cclxuXHRsZXQgZ2V0QW5hbHlzaXMgPSBlID0+IHtcclxuXHRcdGF4aW9zXHJcblx0XHRcdC5nZXQoJ2h0dHBzOi8vYXBpLnNwb3RpZnkuY29tL3YxL2F1ZGlvLWFuYWx5c2lzLycgKyBlLnRhcmdldC5pZCwge1xyXG5cdFx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHRcdEF1dGhvcml6YXRpb246IHByb3BzLmF1dGhvcml6YXRpb25cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHRcdC50aGVuKGRhdGEgPT4ge1xyXG5cdFx0XHRcdHNhcyhkYXRhLmRhdGEpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGFuYWx5c2lzKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0LmNhdGNoKGVyciA9PiB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0fSk7XHJcblx0fTtcclxuXHJcblx0cmV0dXJuIChcclxuXHRcdDx1bCByZWY9e3RyYWNrUmVmfT5cclxuXHRcdFx0e3Byb3BzLnRyYWNrcy5tYXAodHJhY2sgPT4ge1xyXG5cdFx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0XHQ8bGkgaWQ9e3RyYWNrLmlkfSBrZXk9e3RyYWNrLmlkfSBvbkNsaWNrPXtnZXRBbmFseXNpc30+XHJcblx0XHRcdFx0XHRcdHt0cmFjay5uYW1lfSAtIHt0cmFjay5hcnRpc3RzWzBdLm5hbWV9ICh7dHJhY2sucG9wdWxhcml0eX0pXHJcblx0XHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH0pfVxyXG5cdFx0XHR7fVxyXG5cdFx0XHQ8QXVkaW8gYW5hbHlzaXM9e3NhfT48L0F1ZGlvPlxyXG5cdFx0PC91bD5cclxuXHQpO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgVHJhY2tzUmVzdWx0cztcclxuIiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IFJoeXRobSBmcm9tICcuL3JoeXRobSc7XHJcblxyXG5jbGFzcyBEZWZhdWx0IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuXHRyZW5kZXIoKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nYXBwJz5cclxuXHRcdFx0XHQ8aDE+Umh5dGhtIERldGVjdG9yPC9oMT5cclxuXHRcdFx0XHQ8aDI+U2VsZWN0IHlvdXIgc29uZyBhdCB0aGUgc2VhcmNoIGJhciBiZWxvdzwvaDI+XHJcblx0XHRcdFx0PFJoeXRobT48L1JoeXRobT5cclxuXHRcdFx0XHR7LypcdDxpbnB1dCB0eXBlPSd0ZXh0JyAvPiovfVxyXG5cdFx0XHRcdDxzdHlsZSBnbG9iYWwganN4PlxyXG5cdFx0XHRcdFx0e2BcclxuXHRcdFx0XHRcdFx0Ym9keSxcclxuXHRcdFx0XHRcdFx0aHRtbCxcclxuXHRcdFx0XHRcdFx0I3Jvb3Qge1xyXG5cdFx0XHRcdFx0XHRcdG1hcmdpbjogMDtcclxuXHRcdFx0XHRcdFx0XHRoZWlnaHQ6IDEwMCU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0KjphY3RpdmUsXHJcblx0XHRcdFx0XHRcdCo6Zm9jdXMge1xyXG5cdFx0XHRcdFx0XHRcdG91dGxpbmUtc3R5bGU6IG5vbmU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0KiB7XHJcblx0XHRcdFx0XHRcdFx0Ym94LXNpemluZzogYm9yZGVyLWJveDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHQjX19uZXh0IHtcclxuXHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBncmlkO1xyXG5cdFx0XHRcdFx0XHRcdGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byByaWdodCwgIzE0MWUzMCwgIzI0M2I1NSk7XHJcblx0XHRcdFx0XHRcdFx0aGVpZ2h0OiAxMDAlO1xyXG5cdFx0XHRcdFx0XHRcdHdpZHRoOiAxMDAlO1xyXG5cdFx0XHRcdFx0XHRcdGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcclxuXHRcdFx0XHRcdFx0XHRhbGlnbi1pdGVtczogY2VudGVyO1xyXG5cdFx0XHRcdFx0XHRcdG1heC1oZWlnaHQ6IDEwMCU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGB9XHJcblx0XHRcdFx0PC9zdHlsZT5cclxuXHRcdFx0XHQ8c3R5bGUganN4PntgXHJcblx0XHRcdFx0XHRoMSB7XHJcblx0XHRcdFx0XHRcdGZvbnQtc2l6ZTogM3JlbTtcclxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCAjZjc5ZDAwLCAjNjRmMzhjKTtcclxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZC1jbGlwOiB0ZXh0O1xyXG5cdFx0XHRcdFx0XHQtd2Via2l0LXRleHQtZmlsbC1jb2xvcjogdHJhbnNwYXJlbnQ7XHJcblx0XHRcdFx0XHRcdHRleHQtc2hhZG93OiAwcHggMHB4IDUwcHggIzFmZmM0NDJhO1xyXG5cdFx0XHRcdFx0XHRwb3NpdGlvbjogcmVsYXRpdmU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0YH08L3N0eWxlPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEZWZhdWx0O1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgRnJhZ21hbnQsIENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcclxuaW1wb3J0IFRyYWNrc1Jlc3VsdHMgZnJvbSAnLi9UcmFja3NSZXN1bHRzJztcclxuXHJcbmNsYXNzIFJoeXRobSBleHRlbmRzIENvbXBvbmVudCB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cdFx0dGhpcy5zdGF0ZSA9IHtcclxuXHRcdFx0dG9rZW46IG51bGwsXHJcblx0XHRcdHRyYWNrX2xpc3Q6IFtdLFxyXG5cdFx0XHRxdWVyeTogJydcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRjb21wb25lbnREaWRNb3VudCgpIHtcclxuXHRcdGNvbnN0IGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaFxyXG5cdFx0XHQuc3Vic3RyaW5nKDEpXHJcblx0XHRcdC5zcGxpdCgnJicpXHJcblx0XHRcdC5yZWR1Y2UoKGluaXRpYWwsIGl0ZW0pID0+IHtcclxuXHRcdFx0XHRpZiAoaXRlbSkge1xyXG5cdFx0XHRcdFx0dmFyIHBhcnRzID0gaXRlbS5zcGxpdCgnPScpO1xyXG5cdFx0XHRcdFx0aW5pdGlhbFtwYXJ0c1swXV0gPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gaW5pdGlhbDtcclxuXHRcdFx0fSwge30pO1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7IHRva2VuOiBoYXNoLmFjY2Vzc190b2tlbiwgdG9rZW5fdHlwZTogaGFzaC50b2tlbl90eXBlIH0pO1xyXG5cdH1cclxuXHJcblx0Z2V0VHJhY2tzID0gKCkgPT4ge1xyXG5cdFx0YXhpb3NcclxuXHRcdFx0LmdldChcclxuXHRcdFx0XHRgaHR0cHM6Ly9hcGkuc3BvdGlmeS5jb20vdjEvc2VhcmNoP3E9JHt0aGlzLnN0YXRlLnF1ZXJ5fSZ0eXBlPXRyYWNrJmxpbWl0PTVgLFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHRcdFx0QXV0aG9yaXphdGlvbjogYCR7dGhpcy5zdGF0ZS50b2tlbl90eXBlfSAke3RoaXMuc3RhdGUudG9rZW59YFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0KVxyXG5cdFx0XHQudGhlbihkYXRhID0+IHtcclxuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHsgdHJhY2tfbGlzdDogZGF0YS5kYXRhLnRyYWNrcy5pdGVtcyB9KTtcclxuXHRcdFx0fSlcclxuXHRcdFx0LmNhdGNoKGVyciA9PiB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0fSk7XHJcblx0fTtcclxuXHJcblx0Y2hhbmdlSGFuZGxlciA9ICgpID0+IHtcclxuXHRcdHRoaXMuc2V0U3RhdGUoeyBxdWVyeTogdGhpcy5zZWFyY2gudmFsdWUgfSwgKCkgPT4ge1xyXG5cdFx0XHRpZiAodGhpcy5zdGF0ZS5xdWVyeSAmJiB0aGlzLnN0YXRlLnF1ZXJ5Lmxlbmd0aCA+IDEpIHtcclxuXHRcdFx0XHR0aGlzLmdldFRyYWNrcygpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoeyB0cmFja19saXN0OiBbXSB9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PD5cclxuXHRcdFx0XHR7IXRoaXMuc3RhdGUudG9rZW4gJiYgKFxyXG5cdFx0XHRcdFx0PGJ1dHRvbj5cclxuXHRcdFx0XHRcdFx0PGEgaHJlZj0naHR0cHM6Ly9hY2NvdW50cy5zcG90aWZ5LmNvbS9hdXRob3JpemU/Y2xpZW50X2lkPTU4YjljNDA2M2M5MDRjZGE4N2FmODAxODZhNzMyZjAxJnJlZGlyZWN0X3VyaT1odHRwOiUyRiUyRmxvY2FsaG9zdDozMDAwJnJlc3BvbnNlX3R5cGU9dG9rZW4nPlxyXG5cdFx0XHRcdFx0XHRcdExvZ2luIFdpdGggU3BvdGlmeVxyXG5cdFx0XHRcdFx0XHQ8L2E+XHJcblx0XHRcdFx0XHQ8L2J1dHRvbj5cclxuXHRcdFx0XHQpfVxyXG5cdFx0XHRcdHt0aGlzLnN0YXRlLnRva2VuICYmIChcclxuXHRcdFx0XHRcdDw+XHJcblx0XHRcdFx0XHRcdDxpbnB1dFxyXG5cdFx0XHRcdFx0XHRcdHJlZj17aW5wdXQgPT4gKHRoaXMuc2VhcmNoID0gaW5wdXQpfVxyXG5cdFx0XHRcdFx0XHRcdG9uQ2hhbmdlPXt0aGlzLmNoYW5nZUhhbmRsZXJ9XHJcblx0XHRcdFx0XHRcdC8+XHJcblx0XHRcdFx0XHRcdDxUcmFja3NSZXN1bHRzXHJcblx0XHRcdFx0XHRcdFx0YXV0aG9yaXphdGlvbj17YCR7dGhpcy5zdGF0ZS50b2tlbl90eXBlfSAke3RoaXMuc3RhdGUudG9rZW59YH1cclxuXHRcdFx0XHRcdFx0XHR0cmFja3M9e3RoaXMuc3RhdGUudHJhY2tfbGlzdH1cclxuXHRcdFx0XHRcdFx0PjwvVHJhY2tzUmVzdWx0cz5cclxuXHRcdFx0XHRcdDwvPlxyXG5cdFx0XHRcdCl9XHJcblx0XHRcdDwvPlxyXG5cdFx0KTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFJoeXRobTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBkbGxfZWM3ZDljMDI0OWIyZWY1MmI3NGM7Il0sInNvdXJjZVJvb3QiOiIifQ==