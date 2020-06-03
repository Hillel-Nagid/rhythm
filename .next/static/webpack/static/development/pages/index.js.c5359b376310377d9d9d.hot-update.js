webpackHotUpdate("static\\development\\pages\\index.js",{

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
        _this.state.player.stop();
      }

      var conductor = new _band_js_dist_band__WEBPACK_IMPORTED_MODULE_7___default.a();
      var sectionsProps = [];

      _this.props.analysis.sections.forEach(function (section) {
        sectionsProps.push([section.duration * 1000, section.tempo]);
      });

      conductor.setTimeSignature(4, 4);
      conductor.setTempo(sectionsProps[0][1]);
      var piano = conductor.createInstrument('sine');
      piano.note('quarter', 'G3');

      _this.setState({
        player: conductor.finish()
      }, function () {
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
          lineNumber: 42,
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
    })["catch"](function (err) {
      console.log(err);
    });
  };

  return __jsx("ul", {
    ref: trackRef,
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24,
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
        lineNumber: 27,
        columnNumber: 6
      }
    }, track.name, " - ", track.artists[0].name, " (", track.popularity, ")");
  }), __jsx(_Audio__WEBPACK_IMPORTED_MODULE_3__["default"], {
    analysis: sa,
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 33,
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

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wYWdlcy9BdWRpby5qcyIsIndlYnBhY2s6Ly8vLi9wYWdlcy9UcmFja3NSZXN1bHRzLmpzIl0sIm5hbWVzIjpbIkF1ZGlvIiwicHJvcHMiLCJzdGF0ZSIsInBsYXllciIsInN0b3AiLCJjb25kdWN0b3IiLCJCYW5kSlMiLCJzZWN0aW9uc1Byb3BzIiwiYW5hbHlzaXMiLCJzZWN0aW9ucyIsImZvckVhY2giLCJzZWN0aW9uIiwicHVzaCIsImR1cmF0aW9uIiwidGVtcG8iLCJzZXRUaW1lU2lnbmF0dXJlIiwic2V0VGVtcG8iLCJwaWFubyIsImNyZWF0ZUluc3RydW1lbnQiLCJub3RlIiwic2V0U3RhdGUiLCJmaW5pc2giLCJsb29wIiwicmh5dGhtVGltZXIiLCJ0aW1lIiwicGxheSIsInNoaWZ0Iiwic2V0VGltZW91dCIsImxlbmd0aCIsInBsYXlIYW5kbGVyIiwiQ29tcG9uZW50IiwiVHJhY2tzUmVzdWx0cyIsInRyYWNrUmVmIiwiUmVhY3QiLCJjcmVhdGVSZWYiLCJ1c2VTdGF0ZSIsInNhIiwic2FzIiwiZ2V0QW5hbHlzaXMiLCJlIiwiYXhpb3MiLCJnZXQiLCJ0YXJnZXQiLCJpZCIsImhlYWRlcnMiLCJBdXRob3JpemF0aW9uIiwiYXV0aG9yaXphdGlvbiIsInRoZW4iLCJkYXRhIiwiZXJyIiwiY29uc29sZSIsImxvZyIsInRyYWNrcyIsIm1hcCIsInRyYWNrIiwibmFtZSIsImFydGlzdHMiLCJwb3B1bGFyaXR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBOztJQUVNQSxLOzs7OztBQUNMLGlCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUE7O0FBQ2xCLDhCQUFNQSxLQUFOOztBQURrQixzTkFJTCxZQUFNO0FBQ25CLFVBQUksTUFBS0MsS0FBTCxDQUFXQyxNQUFmLEVBQXVCO0FBQ3RCLGNBQUtELEtBQUwsQ0FBV0MsTUFBWCxDQUFrQkMsSUFBbEI7QUFDQTs7QUFD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QUYsQ0FBU0MsRUFEOUQsRUFDa0U7QUFDaEVDLGFBQU8sRUFBRTtBQUNSQyxxQkFBYSxFQUFFNUMsS0FBSyxDQUFDNkM7QUFEYjtBQUR1RCxLQURsRSxFQU1FQyxJQU5GLENBTU8sVUFBQ0MsSUFBRCxFQUFVO0FBQ2ZYLFNBQUcsQ0FBQ1csSUFBSSxDQUFDQSxJQUFOLENBQUg7QUFDQSxLQVJGLFdBU1EsVUFBQ0MsR0FBRCxFQUFTO0FBQ2ZDLGFBQU8sQ0FBQ0MsR0FBUixDQUFZRixHQUFaO0FBQ0EsS0FYRjtBQVlBLEdBYkQ7O0FBZUEsU0FDQztBQUFJLE9BQUcsRUFBRWpCLFFBQVQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQUNFL0IsS0FBSyxDQUFDbUQsTUFBTixDQUFhQyxHQUFiLENBQWlCLFVBQUNDLEtBQUQsRUFBVztBQUM1QixXQUNDO0FBQUksUUFBRSxFQUFFQSxLQUFLLENBQUNYLEVBQWQ7QUFBa0IsU0FBRyxFQUFFVyxLQUFLLENBQUNYLEVBQTdCO0FBQWlDLGFBQU8sRUFBRUwsV0FBMUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxPQUNFZ0IsS0FBSyxDQUFDQyxJQURSLFNBQ2lCRCxLQUFLLENBQUNFLE9BQU4sQ0FBYyxDQUFkLEVBQWlCRCxJQURsQyxRQUMwQ0QsS0FBSyxDQUFDRyxVQURoRCxNQUREO0FBS0EsR0FOQSxDQURGLEVBU0MsTUFBQyw4Q0FBRDtBQUFPLFlBQVEsRUFBRXJCLEVBQWpCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFURCxDQUREO0FBYUEsQ0FqQ0Q7O0dBQU1MLGE7O0tBQUFBLGE7QUFtQ1NBLDRFQUFmIiwiZmlsZSI6InN0YXRpYy93ZWJwYWNrL3N0YXRpY1xcZGV2ZWxvcG1lbnRcXHBhZ2VzXFxpbmRleC5qcy5jNTM1OWIzNzYzMTAzNzdkOWQ5ZC5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhbmRKUyBmcm9tICcuLi9iYW5kLmpzL2Rpc3QvYmFuZCc7XHJcbmltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcblxyXG5jbGFzcyBBdWRpbyBleHRlbmRzIENvbXBvbmVudCB7XHJcblx0Y29uc3RydWN0b3IocHJvcHMpIHtcclxuXHRcdHN1cGVyKHByb3BzKTtcclxuXHRcdHRoaXMuc3RhdGUgPSB7IHBsYXllcjogbnVsbCB9O1xyXG5cdH1cclxuXHRwbGF5SGFuZGxlciA9ICgpID0+IHtcclxuXHRcdGlmICh0aGlzLnN0YXRlLnBsYXllcikge1xyXG5cdFx0XHR0aGlzLnN0YXRlLnBsYXllci5zdG9wKCk7XHJcblx0XHR9XHJcblx0XHRsZXQgY29uZHVjdG9yID0gbmV3IEJhbmRKUygpO1xyXG5cdFx0bGV0IHNlY3Rpb25zUHJvcHMgPSBbXTtcclxuXHRcdHRoaXMucHJvcHMuYW5hbHlzaXMuc2VjdGlvbnMuZm9yRWFjaCgoc2VjdGlvbikgPT4ge1xyXG5cdFx0XHRzZWN0aW9uc1Byb3BzLnB1c2goW3NlY3Rpb24uZHVyYXRpb24gKiAxMDAwLCBzZWN0aW9uLnRlbXBvXSk7XHJcblx0XHR9KTtcclxuXHRcdGNvbmR1Y3Rvci5zZXRUaW1lU2lnbmF0dXJlKDQsIDQpO1xyXG5cdFx0Y29uZHVjdG9yLnNldFRlbXBvKHNlY3Rpb25zUHJvcHNbMF1bMV0pO1xyXG5cdFx0bGV0IHBpYW5vID0gY29uZHVjdG9yLmNyZWF0ZUluc3RydW1lbnQoJ3NpbmUnKTtcclxuXHRcdHBpYW5vLm5vdGUoJ3F1YXJ0ZXInLCAnRzMnKTtcclxuXHRcdHRoaXMuc2V0U3RhdGUoeyBwbGF5ZXI6IGNvbmR1Y3Rvci5maW5pc2goKSB9LCAoKSA9PiB7XHJcblx0XHRcdHRoaXMuc3RhdGUucGxheWVyLmxvb3AodHJ1ZSk7XHJcblx0XHRcdHJoeXRobVRpbWVyKHNlY3Rpb25zUHJvcHNbMF1bMF0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0bGV0IHJoeXRobVRpbWVyID0gKHRpbWUpID0+IHtcclxuXHRcdFx0dGhpcy5zdGF0ZS5wbGF5ZXIucGxheSgpO1xyXG5cdFx0XHRzZWN0aW9uc1Byb3BzLnNoaWZ0KCk7XHJcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuc3RhdGUucGxheWVyLnN0b3AoKTtcclxuXHRcdFx0XHRpZiAoc2VjdGlvbnNQcm9wcy5sZW5ndGggIT0gMCkge1xyXG5cdFx0XHRcdFx0Y29uZHVjdG9yLnNldFRlbXBvKHNlY3Rpb25zUHJvcHNbMF1bMV0pO1xyXG5cdFx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IHBsYXllcjogY29uZHVjdG9yLmZpbmlzaCgpIH0pO1xyXG5cdFx0XHRcdFx0dGhpcy5zdGF0ZS5wbGF5ZXIubG9vcCh0cnVlKTtcclxuXHRcdFx0XHRcdHJoeXRobVRpbWVyKHNlY3Rpb25zUHJvcHNbMF1bMF0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgdGltZSk7XHJcblx0XHR9O1xyXG5cdH07XHJcblx0cmVuZGVyKCkge1xyXG5cdFx0cmV0dXJuIDxwIG9uQ2xpY2s9e3RoaXMucGxheUhhbmRsZXJ9PmNsaWNrIE1lPC9wPjtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEF1ZGlvO1xyXG4iLCJpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xyXG5pbXBvcnQgQXVkaW8gZnJvbSAnLi9BdWRpbyc7XHJcbmNvbnN0IFRyYWNrc1Jlc3VsdHMgPSAocHJvcHMpID0+IHtcclxuXHRjb25zdCB0cmFja1JlZiA9IFJlYWN0LmNyZWF0ZVJlZigpO1xyXG5cdGxldCBhbmFseXNpcztcclxuXHRsZXQgW3NhLCBzYXNdID0gUmVhY3QudXNlU3RhdGUoYW5hbHlzaXMpO1xyXG5cclxuXHRsZXQgZ2V0QW5hbHlzaXMgPSAoZSkgPT4ge1xyXG5cdFx0YXhpb3NcclxuXHRcdFx0LmdldCgnaHR0cHM6Ly9hcGkuc3BvdGlmeS5jb20vdjEvYXVkaW8tYW5hbHlzaXMvJyArIGUudGFyZ2V0LmlkLCB7XHJcblx0XHRcdFx0aGVhZGVyczoge1xyXG5cdFx0XHRcdFx0QXV0aG9yaXphdGlvbjogcHJvcHMuYXV0aG9yaXphdGlvbixcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9KVxyXG5cdFx0XHQudGhlbigoZGF0YSkgPT4ge1xyXG5cdFx0XHRcdHNhcyhkYXRhLmRhdGEpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQuY2F0Y2goKGVycikgPT4ge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdHJldHVybiAoXHJcblx0XHQ8dWwgcmVmPXt0cmFja1JlZn0+XHJcblx0XHRcdHtwcm9wcy50cmFja3MubWFwKCh0cmFjaykgPT4ge1xyXG5cdFx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0XHQ8bGkgaWQ9e3RyYWNrLmlkfSBrZXk9e3RyYWNrLmlkfSBvbkNsaWNrPXtnZXRBbmFseXNpc30+XHJcblx0XHRcdFx0XHRcdHt0cmFjay5uYW1lfSAtIHt0cmFjay5hcnRpc3RzWzBdLm5hbWV9ICh7dHJhY2sucG9wdWxhcml0eX0pXHJcblx0XHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH0pfVxyXG5cdFx0XHR7fVxyXG5cdFx0XHQ8QXVkaW8gYW5hbHlzaXM9e3NhfT48L0F1ZGlvPlxyXG5cdFx0PC91bD5cclxuXHQpO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgVHJhY2tzUmVzdWx0cztcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==