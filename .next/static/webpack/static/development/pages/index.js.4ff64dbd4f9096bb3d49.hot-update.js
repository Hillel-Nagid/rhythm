webpackHotUpdate("static\\development\\pages\\index.js",{

/***/ "./pages/Audio.js":
/*!************************!*\
  !*** ./pages/Audio.js ***!
  \************************/
/*! exports provided: Audio, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Audio", function() { return Audio; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _band_js_dist_band__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../band.js/dist/band */ "./band.js/dist/band.js");
/* harmony import */ var _band_js_dist_band__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_band_js_dist_band__WEBPACK_IMPORTED_MODULE_1__);
var _this = undefined,
    _jsxFileName = "C:\\Users\\hillel nagid\\Desktop\\rhythm\\pages\\Audio.js";


var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;


var Audio = function Audio(props) {
  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(''),
      player = _useState[0],
      setPlayer = _useState[1];

  function playHandler() {
    console.log(player);

    if (player) {
      console.log(player);
      player.stop();
    }

    var conductor = new _band_js_dist_band__WEBPACK_IMPORTED_MODULE_1___default.a();
    var sectionsProps = [];
    props.analysis.sections.forEach(function (section) {
      sectionsProps.push([section.duration * 1000, section.tempo]);
    });
    console.log(sectionsProps);
    conductor.setTimeSignature(4, 4);
    conductor.setTempo(sectionsProps[0][1]);
    var piano = conductor.createInstrument('sine');
    piano.note('quarter', 'G3');
    setPlayer(conductor.finish());
    player.loop(true);
    rhythmTimer(sectionsProps[0][0]);

    function rhythmTimer(time) {
      player.play();
      sectionsProps.shift();
      setTimeout(function () {
        player.stop();

        if (sectionsProps.length != 0) {
          conductor.setTempo(sectionsProps[0][1]);
          player = conductor.finish();
          player.loop(true);
          rhythmTimer(sectionsProps[0][0]);
        }
      }, time);
    }
  }

  return __jsx("p", {
    onClick: playHandler,
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 40,
      columnNumber: 9
    }
  }, "click Me");
};
/* harmony default export */ __webpack_exports__["default"] = (Audio);

/***/ })

})
//# sourceMappingURL=index.js.4ff64dbd4f9096bb3d49.hot-update.js.map