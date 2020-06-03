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

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wYWdlcy9BdWRpby5qcyJdLCJuYW1lcyI6WyJBdWRpbyIsInByb3BzIiwic3RhdGUiLCJwbGF5ZXIiLCJjb25zb2xlIiwibG9nIiwic3RvcCIsImNvbmR1Y3RvciIsIkJhbmRKUyIsInNlY3Rpb25zUHJvcHMiLCJhbmFseXNpcyIsInNlY3Rpb25zIiwiZm9yRWFjaCIsInNlY3Rpb24iLCJwdXNoIiwiZHVyYXRpb24iLCJ0ZW1wbyIsInNldFRpbWVTaWduYXR1cmUiLCJzZXRUZW1wbyIsInBpYW5vIiwiY3JlYXRlSW5zdHJ1bWVudCIsIm5vdGUiLCJzZXRTdGF0ZSIsImZpbmlzaCIsImxvb3AiLCJyaHl0aG1UaW1lciIsInRpbWUiLCJwbGF5Iiwic2hpZnQiLCJzZXRUaW1lb3V0IiwibGVuZ3RoIiwicGxheUhhbmRsZXIiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7O0lBRU1BLEs7Ozs7O0FBQ0wsaUJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQTs7QUFDbEIsOEJBQU1BLEtBQU47O0FBRGtCLHNOQUlMLFlBQU07QUFDbkIsVUFBSSxPQUFPLE1BQUtDLEtBQUwsQ0FBV0MsTUFBbEIsSUFBNEIsVUFBaEMsRUFBNEM7QUFDM0NDLGVBQU8sQ0FBQ0MsR0FBUixDQUFZLE1BQUtILEtBQUwsQ0FBV0MsTUFBdkI7O0FBQ0EsY0FBS0QsS0FBTCxDQUFXQyxNQUFYLENBQWtCRyxJQUFsQjtBQUNBOztBQUNELFVBQUlDLFNBQVMsR0FBRyxJQUFJQyx5REFBSixFQUFoQjtBQUNBLFVBQUlDLGFBQWEsR0FBRyxFQUFwQjs7QUFDQSxZQUFLUixLQUFMLENBQVdTLFFBQVgsQ0FBb0JDLFFBQXBCLENBQTZCQyxPQUE3QixDQUFxQyxVQUFDQyxPQUFELEVBQWE7QUFDakRKLHFCQUFhLENBQUNLLElBQWQsQ0FBbUIsQ0FBQ0QsT0FBTyxDQUFDRSxRQUFSLEdBQW1CLElBQXBCLEVBQTBCRixPQUFPLENBQUNHLEtBQWxDLENBQW5CO0FBQ0EsT0FGRDs7QUFHQVosYUFBTyxDQUFDQyxHQUFSLENBQVlJLGFBQVo7QUFDQUYsZUFBUyxDQUFDVSxnQkFBVixDQUEyQixDQUEzQixFQUE4QixDQUE5QjtBQUNBVixlQUFTLENBQUNXLFFBQVYsQ0FBbUJULGFBQWEsQ0FBQyxDQUFELENBQWIsQ0FBaUIsQ0FBakIsQ0FBbkI7QUFDQSxVQUFJVSxLQUFLLEdBQUdaLFNBQVMsQ0FBQ2EsZ0JBQVYsQ0FBMkIsTUFBM0IsQ0FBWjtBQUNBRCxXQUFLLENBQUNFLElBQU4sQ0FBVyxTQUFYLEVBQXNCLElBQXRCOztBQUNBLFlBQUtDLFFBQUwsQ0FBYztBQUFFbkIsY0FBTSxFQUFFSSxTQUFTLENBQUNnQixNQUFWO0FBQVYsT0FBZCxFQUE4QyxZQUFNO0FBQ25EbkIsZUFBTyxDQUFDQyxHQUFSLENBQVksTUFBS0gsS0FBTCxDQUFXQyxNQUF2Qjs7QUFDQSxjQUFLRCxLQUFMLENBQVdDLE1BQVgsQ0FBa0JxQixJQUFsQixDQUF1QixJQUF2Qjs7QUFDQUMsbUJBQVcsQ0FBQ2hCLGFBQWEsQ0FBQyxDQUFELENBQWIsQ0FBaUIsQ0FBakIsQ0FBRCxDQUFYO0FBQ0EsT0FKRDs7QUFNQSxlQUFTZ0IsV0FBVCxDQUFxQkMsSUFBckIsRUFBMkI7QUFDMUIxQixhQUFLLENBQUNFLEtBQU4sQ0FBWUMsTUFBWixDQUFtQndCLElBQW5CO0FBQ0FsQixxQkFBYSxDQUFDbUIsS0FBZDtBQUNBQyxrQkFBVSxDQUFDLFlBQU07QUFDaEI3QixlQUFLLENBQUNFLEtBQU4sQ0FBWUMsTUFBWixDQUFtQkcsSUFBbkI7O0FBQ0EsY0FBSUcsYUFBYSxDQUFDcUIsTUFBZCxJQUF3QixDQUE1QixFQUErQjtBQUM5QnZCLHFCQUFTLENBQUNXLFFBQVYsQ0FBbUJULGFBQWEsQ0FBQyxDQUFELENBQWIsQ0FBaUIsQ0FBakIsQ0FBbkI7QUFDQVQsaUJBQUssQ0FBQ3NCLFFBQU4sQ0FBZTtBQUFFbkIsb0JBQU0sRUFBRUksU0FBUyxDQUFDZ0IsTUFBVjtBQUFWLGFBQWY7QUFDQXZCLGlCQUFLLENBQUNFLEtBQU4sQ0FBWUMsTUFBWixDQUFtQnFCLElBQW5CLENBQXdCLElBQXhCO0FBQ0FDLHVCQUFXLENBQUNoQixhQUFhLENBQUMsQ0FBRCxDQUFiLENBQWlCLENBQWpCLENBQUQsQ0FBWDtBQUNBO0FBQ0QsU0FSUyxFQVFQaUIsSUFSTyxDQUFWO0FBU0E7QUFDRCxLQXRDa0I7O0FBRWxCLFVBQUt4QixLQUFMLEdBQWE7QUFBRUMsWUFBTSxFQUFFO0FBQVYsS0FBYjtBQUZrQjtBQUdsQjs7Ozs2QkFvQ1E7QUFDUixhQUFPO0FBQUcsZUFBTyxFQUFFLEtBQUs0QixXQUFqQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLG9CQUFQO0FBQ0E7Ozs7RUExQ2tCQywrQzs7QUE2Q0xoQyxvRUFBZiIsImZpbGUiOiJzdGF0aWMvd2VicGFjay9zdGF0aWNcXGRldmVsb3BtZW50XFxwYWdlc1xcaW5kZXguanMuNDRlYTAxNDZjNzAwMTNjNzJiOGYuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYW5kSlMgZnJvbSAnLi4vYmFuZC5qcy9kaXN0L2JhbmQnO1xyXG5pbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5cclxuY2xhc3MgQXVkaW8gZXh0ZW5kcyBDb21wb25lbnQge1xyXG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcblx0XHRzdXBlcihwcm9wcyk7XHJcblx0XHR0aGlzLnN0YXRlID0geyBwbGF5ZXI6ICcnIH07XHJcblx0fVxyXG5cdHBsYXlIYW5kbGVyID0gKCkgPT4ge1xyXG5cdFx0aWYgKHR5cGVvZiB0aGlzLnN0YXRlLnBsYXllciA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHRoaXMuc3RhdGUucGxheWVyKTtcclxuXHRcdFx0dGhpcy5zdGF0ZS5wbGF5ZXIuc3RvcCgpO1xyXG5cdFx0fVxyXG5cdFx0bGV0IGNvbmR1Y3RvciA9IG5ldyBCYW5kSlMoKTtcclxuXHRcdGxldCBzZWN0aW9uc1Byb3BzID0gW107XHJcblx0XHR0aGlzLnByb3BzLmFuYWx5c2lzLnNlY3Rpb25zLmZvckVhY2goKHNlY3Rpb24pID0+IHtcclxuXHRcdFx0c2VjdGlvbnNQcm9wcy5wdXNoKFtzZWN0aW9uLmR1cmF0aW9uICogMTAwMCwgc2VjdGlvbi50ZW1wb10pO1xyXG5cdFx0fSk7XHJcblx0XHRjb25zb2xlLmxvZyhzZWN0aW9uc1Byb3BzKTtcclxuXHRcdGNvbmR1Y3Rvci5zZXRUaW1lU2lnbmF0dXJlKDQsIDQpO1xyXG5cdFx0Y29uZHVjdG9yLnNldFRlbXBvKHNlY3Rpb25zUHJvcHNbMF1bMV0pO1xyXG5cdFx0bGV0IHBpYW5vID0gY29uZHVjdG9yLmNyZWF0ZUluc3RydW1lbnQoJ3NpbmUnKTtcclxuXHRcdHBpYW5vLm5vdGUoJ3F1YXJ0ZXInLCAnRzMnKTtcclxuXHRcdHRoaXMuc2V0U3RhdGUoeyBwbGF5ZXI6IGNvbmR1Y3Rvci5maW5pc2goKSB9LCAoKSA9PiB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHRoaXMuc3RhdGUucGxheWVyKTtcclxuXHRcdFx0dGhpcy5zdGF0ZS5wbGF5ZXIubG9vcCh0cnVlKTtcclxuXHRcdFx0cmh5dGhtVGltZXIoc2VjdGlvbnNQcm9wc1swXVswXSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRmdW5jdGlvbiByaHl0aG1UaW1lcih0aW1lKSB7XHJcblx0XHRcdEF1ZGlvLnN0YXRlLnBsYXllci5wbGF5KCk7XHJcblx0XHRcdHNlY3Rpb25zUHJvcHMuc2hpZnQoKTtcclxuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0QXVkaW8uc3RhdGUucGxheWVyLnN0b3AoKTtcclxuXHRcdFx0XHRpZiAoc2VjdGlvbnNQcm9wcy5sZW5ndGggIT0gMCkge1xyXG5cdFx0XHRcdFx0Y29uZHVjdG9yLnNldFRlbXBvKHNlY3Rpb25zUHJvcHNbMF1bMV0pO1xyXG5cdFx0XHRcdFx0QXVkaW8uc2V0U3RhdGUoeyBwbGF5ZXI6IGNvbmR1Y3Rvci5maW5pc2goKSB9KTtcclxuXHRcdFx0XHRcdEF1ZGlvLnN0YXRlLnBsYXllci5sb29wKHRydWUpO1xyXG5cdFx0XHRcdFx0cmh5dGhtVGltZXIoc2VjdGlvbnNQcm9wc1swXVswXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCB0aW1lKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cdHJlbmRlcigpIHtcclxuXHRcdHJldHVybiA8cCBvbkNsaWNrPXt0aGlzLnBsYXlIYW5kbGVyfT5jbGljayBNZTwvcD47XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBBdWRpbztcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==