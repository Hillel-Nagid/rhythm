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

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wYWdlcy9BdWRpby5qcyJdLCJuYW1lcyI6WyJBdWRpbyIsInByb3BzIiwic3RhdGUiLCJwbGF5ZXIiLCJjb25zb2xlIiwibG9nIiwic3RvcCIsImNvbmR1Y3RvciIsIkJhbmRKUyIsInNlY3Rpb25zUHJvcHMiLCJhbmFseXNpcyIsInNlY3Rpb25zIiwiZm9yRWFjaCIsInNlY3Rpb24iLCJwdXNoIiwiZHVyYXRpb24iLCJ0ZW1wbyIsInNldFRpbWVTaWduYXR1cmUiLCJzZXRUZW1wbyIsInBpYW5vIiwiY3JlYXRlSW5zdHJ1bWVudCIsIm5vdGUiLCJzZXRTdGF0ZSIsImZpbmlzaCIsImxvb3AiLCJyaHl0aG1UaW1lciIsInRpbWUiLCJwbGF5Iiwic2hpZnQiLCJzZXRUaW1lb3V0IiwibGVuZ3RoIiwicGxheUhhbmRsZXIiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7O0lBRU1BLEs7Ozs7O0FBQ0wsaUJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQTs7QUFDbEIsOEJBQU1BLEtBQU47O0FBRGtCLHNOQUlMLFlBQU07QUFDbkIsVUFBSSxPQUFPLE1BQUtDLEtBQUwsQ0FBV0MsTUFBbEIsSUFBNEIsVUFBaEMsRUFBNEM7QUFDM0NDLGVBQU8sQ0FBQ0MsR0FBUixDQUFZLE1BQUtILEtBQUwsQ0FBV0MsTUFBdkI7O0FBQ0EsY0FBS0QsS0FBTCxDQUFXQyxNQUFYLENBQWtCRyxJQUFsQjtBQUNBOztBQUNELFVBQUlDLFNBQVMsR0FBRyxJQUFJQyx5REFBSixFQUFoQjtBQUNBLFVBQUlDLGFBQWEsR0FBRyxFQUFwQjs7QUFDQSxZQUFLUixLQUFMLENBQVdTLFFBQVgsQ0FBb0JDLFFBQXBCLENBQTZCQyxPQUE3QixDQUFxQyxVQUFDQyxPQUFELEVBQWE7QUFDakRKLHFCQUFhLENBQUNLLElBQWQsQ0FBbUIsQ0FBQ0QsT0FBTyxDQUFDRSxRQUFSLEdBQW1CLElBQXBCLEVBQTBCRixPQUFPLENBQUNHLEtBQWxDLENBQW5CO0FBQ0EsT0FGRDs7QUFHQVosYUFBTyxDQUFDQyxHQUFSLENBQVlJLGFBQVo7QUFDQUYsZUFBUyxDQUFDVSxnQkFBVixDQUEyQixDQUEzQixFQUE4QixDQUE5QjtBQUNBVixlQUFTLENBQUNXLFFBQVYsQ0FBbUJULGFBQWEsQ0FBQyxDQUFELENBQWIsQ0FBaUIsQ0FBakIsQ0FBbkI7QUFDQSxVQUFJVSxLQUFLLEdBQUdaLFNBQVMsQ0FBQ2EsZ0JBQVYsQ0FBMkIsTUFBM0IsQ0FBWjtBQUNBRCxXQUFLLENBQUNFLElBQU4sQ0FBVyxTQUFYLEVBQXNCLElBQXRCOztBQUNBLFlBQUtDLFFBQUwsQ0FBYztBQUFFbkIsY0FBTSxFQUFFSSxTQUFTLENBQUNnQixNQUFWO0FBQVYsT0FBZCxFQUE4QyxZQUFNO0FBQ25EbkIsZUFBTyxDQUFDQyxHQUFSLENBQVksTUFBS0gsS0FBTCxDQUFXQyxNQUF2Qjs7QUFDQSxjQUFLRCxLQUFMLENBQVdDLE1BQVgsQ0FBa0JxQixJQUFsQixDQUF1QixJQUF2Qjs7QUFDQUMsbUJBQVcsQ0FBQ2hCLGFBQWEsQ0FBQyxDQUFELENBQWIsQ0FBaUIsQ0FBakIsQ0FBRCxDQUFYO0FBQ0EsT0FKRDs7QUFNQSxVQUFJZ0IsV0FBVyxHQUFHLFNBQWRBLFdBQWMsQ0FBQ0MsSUFBRCxFQUFVO0FBQzNCLGNBQUt4QixLQUFMLENBQVdDLE1BQVgsQ0FBa0J3QixJQUFsQjs7QUFDQWxCLHFCQUFhLENBQUNtQixLQUFkO0FBQ0FDLGtCQUFVLENBQUMsWUFBTTtBQUNoQixnQkFBSzNCLEtBQUwsQ0FBV0MsTUFBWCxDQUFrQkcsSUFBbEI7O0FBQ0EsY0FBSUcsYUFBYSxDQUFDcUIsTUFBZCxJQUF3QixDQUE1QixFQUErQjtBQUM5QnZCLHFCQUFTLENBQUNXLFFBQVYsQ0FBbUJULGFBQWEsQ0FBQyxDQUFELENBQWIsQ0FBaUIsQ0FBakIsQ0FBbkI7O0FBQ0Esa0JBQUthLFFBQUwsQ0FBYztBQUFFbkIsb0JBQU0sRUFBRUksU0FBUyxDQUFDZ0IsTUFBVjtBQUFWLGFBQWQ7O0FBQ0Esa0JBQUtyQixLQUFMLENBQVdDLE1BQVgsQ0FBa0JxQixJQUFsQixDQUF1QixJQUF2Qjs7QUFDQUMsdUJBQVcsQ0FBQ2hCLGFBQWEsQ0FBQyxDQUFELENBQWIsQ0FBaUIsQ0FBakIsQ0FBRCxDQUFYO0FBQ0E7QUFDRCxTQVJTLEVBUVBpQixJQVJPLENBQVY7QUFTQSxPQVpEO0FBYUEsS0F0Q2tCOztBQUVsQixVQUFLeEIsS0FBTCxHQUFhO0FBQUVDLFlBQU0sRUFBRTtBQUFWLEtBQWI7QUFGa0I7QUFHbEI7Ozs7NkJBb0NRO0FBQ1IsYUFBTztBQUFHLGVBQU8sRUFBRSxLQUFLNEIsV0FBakI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxvQkFBUDtBQUNBOzs7O0VBMUNrQkMsK0M7O0FBNkNMaEMsb0VBQWYiLCJmaWxlIjoic3RhdGljL3dlYnBhY2svc3RhdGljXFxkZXZlbG9wbWVudFxccGFnZXNcXGluZGV4LmpzLjU2YzM1ODcxNGEyZDQ4ZWQwOTM2LmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFuZEpTIGZyb20gJy4uL2JhbmQuanMvZGlzdC9iYW5kJztcclxuaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcclxuXHJcbmNsYXNzIEF1ZGlvIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG5cdFx0c3VwZXIocHJvcHMpO1xyXG5cdFx0dGhpcy5zdGF0ZSA9IHsgcGxheWVyOiAnJyB9O1xyXG5cdH1cclxuXHRwbGF5SGFuZGxlciA9ICgpID0+IHtcclxuXHRcdGlmICh0eXBlb2YgdGhpcy5zdGF0ZS5wbGF5ZXIgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyh0aGlzLnN0YXRlLnBsYXllcik7XHJcblx0XHRcdHRoaXMuc3RhdGUucGxheWVyLnN0b3AoKTtcclxuXHRcdH1cclxuXHRcdGxldCBjb25kdWN0b3IgPSBuZXcgQmFuZEpTKCk7XHJcblx0XHRsZXQgc2VjdGlvbnNQcm9wcyA9IFtdO1xyXG5cdFx0dGhpcy5wcm9wcy5hbmFseXNpcy5zZWN0aW9ucy5mb3JFYWNoKChzZWN0aW9uKSA9PiB7XHJcblx0XHRcdHNlY3Rpb25zUHJvcHMucHVzaChbc2VjdGlvbi5kdXJhdGlvbiAqIDEwMDAsIHNlY3Rpb24udGVtcG9dKTtcclxuXHRcdH0pO1xyXG5cdFx0Y29uc29sZS5sb2coc2VjdGlvbnNQcm9wcyk7XHJcblx0XHRjb25kdWN0b3Iuc2V0VGltZVNpZ25hdHVyZSg0LCA0KTtcclxuXHRcdGNvbmR1Y3Rvci5zZXRUZW1wbyhzZWN0aW9uc1Byb3BzWzBdWzFdKTtcclxuXHRcdGxldCBwaWFubyA9IGNvbmR1Y3Rvci5jcmVhdGVJbnN0cnVtZW50KCdzaW5lJyk7XHJcblx0XHRwaWFuby5ub3RlKCdxdWFydGVyJywgJ0czJyk7XHJcblx0XHR0aGlzLnNldFN0YXRlKHsgcGxheWVyOiBjb25kdWN0b3IuZmluaXNoKCkgfSwgKCkgPT4ge1xyXG5cdFx0XHRjb25zb2xlLmxvZyh0aGlzLnN0YXRlLnBsYXllcik7XHJcblx0XHRcdHRoaXMuc3RhdGUucGxheWVyLmxvb3AodHJ1ZSk7XHJcblx0XHRcdHJoeXRobVRpbWVyKHNlY3Rpb25zUHJvcHNbMF1bMF0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0bGV0IHJoeXRobVRpbWVyID0gKHRpbWUpID0+IHtcclxuXHRcdFx0dGhpcy5zdGF0ZS5wbGF5ZXIucGxheSgpO1xyXG5cdFx0XHRzZWN0aW9uc1Byb3BzLnNoaWZ0KCk7XHJcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuc3RhdGUucGxheWVyLnN0b3AoKTtcclxuXHRcdFx0XHRpZiAoc2VjdGlvbnNQcm9wcy5sZW5ndGggIT0gMCkge1xyXG5cdFx0XHRcdFx0Y29uZHVjdG9yLnNldFRlbXBvKHNlY3Rpb25zUHJvcHNbMF1bMV0pO1xyXG5cdFx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IHBsYXllcjogY29uZHVjdG9yLmZpbmlzaCgpIH0pO1xyXG5cdFx0XHRcdFx0dGhpcy5zdGF0ZS5wbGF5ZXIubG9vcCh0cnVlKTtcclxuXHRcdFx0XHRcdHJoeXRobVRpbWVyKHNlY3Rpb25zUHJvcHNbMF1bMF0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgdGltZSk7XHJcblx0XHR9O1xyXG5cdH07XHJcblx0cmVuZGVyKCkge1xyXG5cdFx0cmV0dXJuIDxwIG9uQ2xpY2s9e3RoaXMucGxheUhhbmRsZXJ9PmNsaWNrIE1lPC9wPjtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEF1ZGlvO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9