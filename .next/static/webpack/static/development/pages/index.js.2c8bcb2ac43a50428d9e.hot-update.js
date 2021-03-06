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
      /*if (typeOf this.state.player) {
      	console.log(this.state.player);
      	this.state.player.stop();
      }*/
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

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wYWdlcy9BdWRpby5qcyJdLCJuYW1lcyI6WyJBdWRpbyIsInByb3BzIiwiY29uZHVjdG9yIiwiQmFuZEpTIiwic2VjdGlvbnNQcm9wcyIsImFuYWx5c2lzIiwic2VjdGlvbnMiLCJmb3JFYWNoIiwic2VjdGlvbiIsInB1c2giLCJkdXJhdGlvbiIsInRlbXBvIiwiY29uc29sZSIsImxvZyIsInNldFRpbWVTaWduYXR1cmUiLCJzZXRUZW1wbyIsInBpYW5vIiwiY3JlYXRlSW5zdHJ1bWVudCIsIm5vdGUiLCJzZXRTdGF0ZSIsInBsYXllciIsImZpbmlzaCIsInN0YXRlIiwibG9vcCIsInJoeXRobVRpbWVyIiwidGltZSIsInBsYXkiLCJzaGlmdCIsInNldFRpbWVvdXQiLCJzdG9wIiwibGVuZ3RoIiwicGxheUhhbmRsZXIiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7O0lBRU1BLEs7Ozs7O0FBQ0wsaUJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQTs7QUFDbEIsOEJBQU1BLEtBQU47O0FBRGtCLHNOQUlMLFlBQU07QUFDbkI7Ozs7QUFJQSxVQUFJQyxTQUFTLEdBQUcsSUFBSUMseURBQUosRUFBaEI7QUFDQSxVQUFJQyxhQUFhLEdBQUcsRUFBcEI7O0FBQ0EsWUFBS0gsS0FBTCxDQUFXSSxRQUFYLENBQW9CQyxRQUFwQixDQUE2QkMsT0FBN0IsQ0FBcUMsVUFBQ0MsT0FBRCxFQUFhO0FBQ2pESixxQkFBYSxDQUFDSyxJQUFkLENBQW1CLENBQUNELE9BQU8sQ0FBQ0UsUUFBUixHQUFtQixJQUFwQixFQUEwQkYsT0FBTyxDQUFDRyxLQUFsQyxDQUFuQjtBQUNBLE9BRkQ7O0FBR0FDLGFBQU8sQ0FBQ0MsR0FBUixDQUFZVCxhQUFaO0FBQ0FGLGVBQVMsQ0FBQ1ksZ0JBQVYsQ0FBMkIsQ0FBM0IsRUFBOEIsQ0FBOUI7QUFDQVosZUFBUyxDQUFDYSxRQUFWLENBQW1CWCxhQUFhLENBQUMsQ0FBRCxDQUFiLENBQWlCLENBQWpCLENBQW5CO0FBQ0EsVUFBSVksS0FBSyxHQUFHZCxTQUFTLENBQUNlLGdCQUFWLENBQTJCLE1BQTNCLENBQVo7QUFDQUQsV0FBSyxDQUFDRSxJQUFOLENBQVcsU0FBWCxFQUFzQixJQUF0Qjs7QUFDQSxZQUFLQyxRQUFMLENBQWM7QUFBRUMsY0FBTSxFQUFFbEIsU0FBUyxDQUFDbUIsTUFBVjtBQUFWLE9BQWQ7O0FBQ0FULGFBQU8sQ0FBQ0MsR0FBUixDQUFZLE1BQUtTLEtBQUwsQ0FBV0YsTUFBdkI7O0FBQ0EsWUFBS0UsS0FBTCxDQUFXRixNQUFYLENBQWtCRyxJQUFsQixDQUF1QixJQUF2Qjs7QUFDQUMsaUJBQVcsQ0FBQ3BCLGFBQWEsQ0FBQyxDQUFELENBQWIsQ0FBaUIsQ0FBakIsQ0FBRCxDQUFYOztBQUNBLGVBQVNvQixXQUFULENBQXFCQyxJQUFyQixFQUEyQjtBQUFBOztBQUMxQixhQUFLSCxLQUFMLENBQVdGLE1BQVgsQ0FBa0JNLElBQWxCO0FBQ0F0QixxQkFBYSxDQUFDdUIsS0FBZDtBQUNBQyxrQkFBVSxDQUFDLFlBQU07QUFDaEIsZ0JBQUksQ0FBQ04sS0FBTCxDQUFXRixNQUFYLENBQWtCUyxJQUFsQjs7QUFDQSxjQUFJekIsYUFBYSxDQUFDMEIsTUFBZCxJQUF3QixDQUE1QixFQUErQjtBQUM5QjVCLHFCQUFTLENBQUNhLFFBQVYsQ0FBbUJYLGFBQWEsQ0FBQyxDQUFELENBQWIsQ0FBaUIsQ0FBakIsQ0FBbkI7O0FBQ0Esa0JBQUksQ0FBQ2UsUUFBTCxDQUFjO0FBQUVDLG9CQUFNLEVBQUVsQixTQUFTLENBQUNtQixNQUFWO0FBQVYsYUFBZDs7QUFDQSxrQkFBSSxDQUFDQyxLQUFMLENBQVdGLE1BQVgsQ0FBa0JHLElBQWxCLENBQXVCLElBQXZCOztBQUNBQyx1QkFBVyxDQUFDcEIsYUFBYSxDQUFDLENBQUQsQ0FBYixDQUFpQixDQUFqQixDQUFELENBQVg7QUFDQTtBQUNELFNBUlMsRUFRUHFCLElBUk8sQ0FBVjtBQVNBO0FBQ0QsS0FwQ2tCOztBQUVsQixVQUFLSCxLQUFMLEdBQWE7QUFBRUYsWUFBTSxFQUFFO0FBQVYsS0FBYjtBQUZrQjtBQUdsQjs7Ozs2QkFrQ1E7QUFDUixhQUFPO0FBQUcsZUFBTyxFQUFFLEtBQUtXLFdBQWpCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsb0JBQVA7QUFDQTs7OztFQXhDa0JDLCtDOztBQTJDTGhDLG9FQUFmIiwiZmlsZSI6InN0YXRpYy93ZWJwYWNrL3N0YXRpY1xcZGV2ZWxvcG1lbnRcXHBhZ2VzXFxpbmRleC5qcy4yYzhiY2IyYWM0M2E1MDQyOGQ5ZS5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhbmRKUyBmcm9tICcuLi9iYW5kLmpzL2Rpc3QvYmFuZCc7XHJcbmltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcblxyXG5jbGFzcyBBdWRpbyBleHRlbmRzIENvbXBvbmVudCB7XHJcblx0Y29uc3RydWN0b3IocHJvcHMpIHtcclxuXHRcdHN1cGVyKHByb3BzKTtcclxuXHRcdHRoaXMuc3RhdGUgPSB7IHBsYXllcjogJycgfTtcclxuXHR9XHJcblx0cGxheUhhbmRsZXIgPSAoKSA9PiB7XHJcblx0XHQvKmlmICh0eXBlT2YgdGhpcy5zdGF0ZS5wbGF5ZXIpIHtcclxuXHRcdFx0Y29uc29sZS5sb2codGhpcy5zdGF0ZS5wbGF5ZXIpO1xyXG5cdFx0XHR0aGlzLnN0YXRlLnBsYXllci5zdG9wKCk7XHJcblx0XHR9Ki9cclxuXHRcdGxldCBjb25kdWN0b3IgPSBuZXcgQmFuZEpTKCk7XHJcblx0XHRsZXQgc2VjdGlvbnNQcm9wcyA9IFtdO1xyXG5cdFx0dGhpcy5wcm9wcy5hbmFseXNpcy5zZWN0aW9ucy5mb3JFYWNoKChzZWN0aW9uKSA9PiB7XHJcblx0XHRcdHNlY3Rpb25zUHJvcHMucHVzaChbc2VjdGlvbi5kdXJhdGlvbiAqIDEwMDAsIHNlY3Rpb24udGVtcG9dKTtcclxuXHRcdH0pO1xyXG5cdFx0Y29uc29sZS5sb2coc2VjdGlvbnNQcm9wcyk7XHJcblx0XHRjb25kdWN0b3Iuc2V0VGltZVNpZ25hdHVyZSg0LCA0KTtcclxuXHRcdGNvbmR1Y3Rvci5zZXRUZW1wbyhzZWN0aW9uc1Byb3BzWzBdWzFdKTtcclxuXHRcdGxldCBwaWFubyA9IGNvbmR1Y3Rvci5jcmVhdGVJbnN0cnVtZW50KCdzaW5lJyk7XHJcblx0XHRwaWFuby5ub3RlKCdxdWFydGVyJywgJ0czJyk7XHJcblx0XHR0aGlzLnNldFN0YXRlKHsgcGxheWVyOiBjb25kdWN0b3IuZmluaXNoKCkgfSk7XHJcblx0XHRjb25zb2xlLmxvZyh0aGlzLnN0YXRlLnBsYXllcik7XHJcblx0XHR0aGlzLnN0YXRlLnBsYXllci5sb29wKHRydWUpO1xyXG5cdFx0cmh5dGhtVGltZXIoc2VjdGlvbnNQcm9wc1swXVswXSk7XHJcblx0XHRmdW5jdGlvbiByaHl0aG1UaW1lcih0aW1lKSB7XHJcblx0XHRcdHRoaXMuc3RhdGUucGxheWVyLnBsYXkoKTtcclxuXHRcdFx0c2VjdGlvbnNQcm9wcy5zaGlmdCgpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHR0aGlzLnN0YXRlLnBsYXllci5zdG9wKCk7XHJcblx0XHRcdFx0aWYgKHNlY3Rpb25zUHJvcHMubGVuZ3RoICE9IDApIHtcclxuXHRcdFx0XHRcdGNvbmR1Y3Rvci5zZXRUZW1wbyhzZWN0aW9uc1Byb3BzWzBdWzFdKTtcclxuXHRcdFx0XHRcdHRoaXMuc2V0U3RhdGUoeyBwbGF5ZXI6IGNvbmR1Y3Rvci5maW5pc2goKSB9KTtcclxuXHRcdFx0XHRcdHRoaXMuc3RhdGUucGxheWVyLmxvb3AodHJ1ZSk7XHJcblx0XHRcdFx0XHRyaHl0aG1UaW1lcihzZWN0aW9uc1Byb3BzWzBdWzBdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sIHRpbWUpO1xyXG5cdFx0fVxyXG5cdH07XHJcblx0cmVuZGVyKCkge1xyXG5cdFx0cmV0dXJuIDxwIG9uQ2xpY2s9e3RoaXMucGxheUhhbmRsZXJ9PmNsaWNrIE1lPC9wPjtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEF1ZGlvO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9