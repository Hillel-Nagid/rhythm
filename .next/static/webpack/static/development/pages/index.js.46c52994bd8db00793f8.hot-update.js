webpackHotUpdate("static\\development\\pages\\index.js",{

/***/ "./pages/Audio.js":
/*!************************!*\
  !*** ./pages/Audio.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/esm/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _band_js_dist_band__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../band.js/dist/band */ "./band.js/dist/band.js");
/* harmony import */ var _band_js_dist_band__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_band_js_dist_band__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_10__);









var _jsxFileName = "C:\\Users\\hillel nagid\\Desktop\\rhythm\\pages\\Audio.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_10___default.a.createElement;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = Object(_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = Object(_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return Object(_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6__["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }




var Audio = /*#__PURE__*/function (_Component) {
  Object(_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(Audio, _Component);

  var _super = _createSuper(Audio);

  function Audio(props) {
    var _this;

    Object(_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, Audio);

    _this = _super.call(this, props);

    Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this), "playHandler", /*#__PURE__*/Object(_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
      var conductor, sectionsProps, piano, rhythmTimer;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              rhythmTimer = function _rhythmTimer(time) {
                var _this2 = this;

                Audio.state.player.play();
                sectionsProps.shift();
                setTimeout(function () {
                  _this2.state.player.stop();

                  if (sectionsProps.length != 0) {
                    conductor.setTempo(sectionsProps[0][1]);
                    Audio.setState({
                      player: conductor.finish()
                    });
                    Audio.state.player.loop(true);
                    rhythmTimer(sectionsProps[0][0]);
                  }
                }, time);
              };

              if (typeof _this.state.player == 'function') {
                console.log(_this.state.player);

                _this.state.player.stop();
              }

              conductor = new _band_js_dist_band__WEBPACK_IMPORTED_MODULE_9___default.a();
              sectionsProps = [];

              _this.props.analysis.sections.forEach(function (section) {
                sectionsProps.push([section.duration * 1000, section.tempo]);
              });

              console.log(sectionsProps);
              conductor.setTimeSignature(4, 4);
              conductor.setTempo(sectionsProps[0][1]);
              piano = conductor.createInstrument('sine');
              piano.note('quarter', 'G3');
              _context.next = 12;
              return _this.setState({
                player: conductor.finish()
              });

            case 12:
              console.log(_this.state.player);

              _this.state.player.loop(true);

              rhythmTimer(sectionsProps[0][0]);

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));

    _this.state = {
      player: ''
    };
    return _this;
  }

  Object(_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(Audio, [{
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
}(react__WEBPACK_IMPORTED_MODULE_10__["Component"]);

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

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wYWdlcy9BdWRpby5qcyJdLCJuYW1lcyI6WyJBdWRpbyIsInByb3BzIiwicmh5dGhtVGltZXIiLCJ0aW1lIiwic3RhdGUiLCJwbGF5ZXIiLCJwbGF5Iiwic2VjdGlvbnNQcm9wcyIsInNoaWZ0Iiwic2V0VGltZW91dCIsInN0b3AiLCJsZW5ndGgiLCJjb25kdWN0b3IiLCJzZXRUZW1wbyIsInNldFN0YXRlIiwiZmluaXNoIiwibG9vcCIsImNvbnNvbGUiLCJsb2ciLCJCYW5kSlMiLCJhbmFseXNpcyIsInNlY3Rpb25zIiwiZm9yRWFjaCIsInNlY3Rpb24iLCJwdXNoIiwiZHVyYXRpb24iLCJ0ZW1wbyIsInNldFRpbWVTaWduYXR1cmUiLCJwaWFubyIsImNyZWF0ZUluc3RydW1lbnQiLCJub3RlIiwicGxheUhhbmRsZXIiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTs7SUFFTUEsSzs7Ozs7QUFDTCxpQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBOztBQUNsQiw4QkFBTUEsS0FBTjs7QUFEa0Isb1pBSUw7QUFBQSwyQ0FtQkpDLFdBbkJJO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFtQkpBLHlCQW5CSSx5QkFtQlFDLElBbkJSLEVBbUJjO0FBQUE7O0FBQzFCSCxxQkFBSyxDQUFDSSxLQUFOLENBQVlDLE1BQVosQ0FBbUJDLElBQW5CO0FBQ0FDLDZCQUFhLENBQUNDLEtBQWQ7QUFDQUMsMEJBQVUsQ0FBQyxZQUFNO0FBQ2hCLHdCQUFJLENBQUNMLEtBQUwsQ0FBV0MsTUFBWCxDQUFrQkssSUFBbEI7O0FBQ0Esc0JBQUlILGFBQWEsQ0FBQ0ksTUFBZCxJQUF3QixDQUE1QixFQUErQjtBQUM5QkMsNkJBQVMsQ0FBQ0MsUUFBVixDQUFtQk4sYUFBYSxDQUFDLENBQUQsQ0FBYixDQUFpQixDQUFqQixDQUFuQjtBQUNBUCx5QkFBSyxDQUFDYyxRQUFOLENBQWU7QUFBRVQsNEJBQU0sRUFBRU8sU0FBUyxDQUFDRyxNQUFWO0FBQVYscUJBQWY7QUFDQWYseUJBQUssQ0FBQ0ksS0FBTixDQUFZQyxNQUFaLENBQW1CVyxJQUFuQixDQUF3QixJQUF4QjtBQUNBZCwrQkFBVyxDQUFDSyxhQUFhLENBQUMsQ0FBRCxDQUFiLENBQWlCLENBQWpCLENBQUQsQ0FBWDtBQUNBO0FBQ0QsaUJBUlMsRUFRUEosSUFSTyxDQUFWO0FBU0EsZUEvQlk7O0FBQ2Isa0JBQUksT0FBTyxNQUFLQyxLQUFMLENBQVdDLE1BQWxCLElBQTRCLFVBQWhDLEVBQTRDO0FBQzNDWSx1QkFBTyxDQUFDQyxHQUFSLENBQVksTUFBS2QsS0FBTCxDQUFXQyxNQUF2Qjs7QUFDQSxzQkFBS0QsS0FBTCxDQUFXQyxNQUFYLENBQWtCSyxJQUFsQjtBQUNBOztBQUNHRSx1QkFMUyxHQUtHLElBQUlPLHlEQUFKLEVBTEg7QUFNVFosMkJBTlMsR0FNTyxFQU5QOztBQU9iLG9CQUFLTixLQUFMLENBQVdtQixRQUFYLENBQW9CQyxRQUFwQixDQUE2QkMsT0FBN0IsQ0FBcUMsVUFBQ0MsT0FBRCxFQUFhO0FBQ2pEaEIsNkJBQWEsQ0FBQ2lCLElBQWQsQ0FBbUIsQ0FBQ0QsT0FBTyxDQUFDRSxRQUFSLEdBQW1CLElBQXBCLEVBQTBCRixPQUFPLENBQUNHLEtBQWxDLENBQW5CO0FBQ0EsZUFGRDs7QUFHQVQscUJBQU8sQ0FBQ0MsR0FBUixDQUFZWCxhQUFaO0FBQ0FLLHVCQUFTLENBQUNlLGdCQUFWLENBQTJCLENBQTNCLEVBQThCLENBQTlCO0FBQ0FmLHVCQUFTLENBQUNDLFFBQVYsQ0FBbUJOLGFBQWEsQ0FBQyxDQUFELENBQWIsQ0FBaUIsQ0FBakIsQ0FBbkI7QUFDSXFCLG1CQWJTLEdBYURoQixTQUFTLENBQUNpQixnQkFBVixDQUEyQixNQUEzQixDQWJDO0FBY2JELG1CQUFLLENBQUNFLElBQU4sQ0FBVyxTQUFYLEVBQXNCLElBQXRCO0FBZGE7QUFBQSxxQkFlUCxNQUFLaEIsUUFBTCxDQUFjO0FBQUVULHNCQUFNLEVBQUVPLFNBQVMsQ0FBQ0csTUFBVjtBQUFWLGVBQWQsQ0FmTzs7QUFBQTtBQWdCYkUscUJBQU8sQ0FBQ0MsR0FBUixDQUFZLE1BQUtkLEtBQUwsQ0FBV0MsTUFBdkI7O0FBQ0Esb0JBQUtELEtBQUwsQ0FBV0MsTUFBWCxDQUFrQlcsSUFBbEIsQ0FBdUIsSUFBdkI7O0FBQ0FkLHlCQUFXLENBQUNLLGFBQWEsQ0FBQyxDQUFELENBQWIsQ0FBaUIsQ0FBakIsQ0FBRCxDQUFYOztBQWxCYTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQUpLOztBQUVsQixVQUFLSCxLQUFMLEdBQWE7QUFBRUMsWUFBTSxFQUFFO0FBQVYsS0FBYjtBQUZrQjtBQUdsQjs7Ozs2QkFrQ1E7QUFDUixhQUFPO0FBQUcsZUFBTyxFQUFFLEtBQUswQixXQUFqQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLG9CQUFQO0FBQ0E7Ozs7RUF4Q2tCQyxnRDs7QUEyQ0xoQyxvRUFBZiIsImZpbGUiOiJzdGF0aWMvd2VicGFjay9zdGF0aWNcXGRldmVsb3BtZW50XFxwYWdlc1xcaW5kZXguanMuNDZjNTI5OTRiZDhkYjAwNzkzZjguaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYW5kSlMgZnJvbSAnLi4vYmFuZC5qcy9kaXN0L2JhbmQnO1xyXG5pbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5cclxuY2xhc3MgQXVkaW8gZXh0ZW5kcyBDb21wb25lbnQge1xyXG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcblx0XHRzdXBlcihwcm9wcyk7XHJcblx0XHR0aGlzLnN0YXRlID0geyBwbGF5ZXI6ICcnIH07XHJcblx0fVxyXG5cdHBsYXlIYW5kbGVyID0gYXN5bmMgKCkgPT4ge1xyXG5cdFx0aWYgKHR5cGVvZiB0aGlzLnN0YXRlLnBsYXllciA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHRoaXMuc3RhdGUucGxheWVyKTtcclxuXHRcdFx0dGhpcy5zdGF0ZS5wbGF5ZXIuc3RvcCgpO1xyXG5cdFx0fVxyXG5cdFx0bGV0IGNvbmR1Y3RvciA9IG5ldyBCYW5kSlMoKTtcclxuXHRcdGxldCBzZWN0aW9uc1Byb3BzID0gW107XHJcblx0XHR0aGlzLnByb3BzLmFuYWx5c2lzLnNlY3Rpb25zLmZvckVhY2goKHNlY3Rpb24pID0+IHtcclxuXHRcdFx0c2VjdGlvbnNQcm9wcy5wdXNoKFtzZWN0aW9uLmR1cmF0aW9uICogMTAwMCwgc2VjdGlvbi50ZW1wb10pO1xyXG5cdFx0fSk7XHJcblx0XHRjb25zb2xlLmxvZyhzZWN0aW9uc1Byb3BzKTtcclxuXHRcdGNvbmR1Y3Rvci5zZXRUaW1lU2lnbmF0dXJlKDQsIDQpO1xyXG5cdFx0Y29uZHVjdG9yLnNldFRlbXBvKHNlY3Rpb25zUHJvcHNbMF1bMV0pO1xyXG5cdFx0bGV0IHBpYW5vID0gY29uZHVjdG9yLmNyZWF0ZUluc3RydW1lbnQoJ3NpbmUnKTtcclxuXHRcdHBpYW5vLm5vdGUoJ3F1YXJ0ZXInLCAnRzMnKTtcclxuXHRcdGF3YWl0IHRoaXMuc2V0U3RhdGUoeyBwbGF5ZXI6IGNvbmR1Y3Rvci5maW5pc2goKSB9KTtcclxuXHRcdGNvbnNvbGUubG9nKHRoaXMuc3RhdGUucGxheWVyKTtcclxuXHRcdHRoaXMuc3RhdGUucGxheWVyLmxvb3AodHJ1ZSk7XHJcblx0XHRyaHl0aG1UaW1lcihzZWN0aW9uc1Byb3BzWzBdWzBdKTtcclxuXHRcdGZ1bmN0aW9uIHJoeXRobVRpbWVyKHRpbWUpIHtcclxuXHRcdFx0QXVkaW8uc3RhdGUucGxheWVyLnBsYXkoKTtcclxuXHRcdFx0c2VjdGlvbnNQcm9wcy5zaGlmdCgpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHR0aGlzLnN0YXRlLnBsYXllci5zdG9wKCk7XHJcblx0XHRcdFx0aWYgKHNlY3Rpb25zUHJvcHMubGVuZ3RoICE9IDApIHtcclxuXHRcdFx0XHRcdGNvbmR1Y3Rvci5zZXRUZW1wbyhzZWN0aW9uc1Byb3BzWzBdWzFdKTtcclxuXHRcdFx0XHRcdEF1ZGlvLnNldFN0YXRlKHsgcGxheWVyOiBjb25kdWN0b3IuZmluaXNoKCkgfSk7XHJcblx0XHRcdFx0XHRBdWRpby5zdGF0ZS5wbGF5ZXIubG9vcCh0cnVlKTtcclxuXHRcdFx0XHRcdHJoeXRobVRpbWVyKHNlY3Rpb25zUHJvcHNbMF1bMF0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgdGltZSk7XHJcblx0XHR9XHJcblx0fTtcclxuXHRyZW5kZXIoKSB7XHJcblx0XHRyZXR1cm4gPHAgb25DbGljaz17dGhpcy5wbGF5SGFuZGxlcn0+Y2xpY2sgTWU8L3A+O1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQXVkaW87XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=