webpackHotUpdate("static\\development\\pages\\index.js",{

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
      lineNumber: 32,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wYWdlcy9UcmFja3NSZXN1bHRzLmpzIl0sIm5hbWVzIjpbIlRyYWNrc1Jlc3VsdHMiLCJwcm9wcyIsInRyYWNrUmVmIiwiUmVhY3QiLCJjcmVhdGVSZWYiLCJhbmFseXNpcyIsInVzZVN0YXRlIiwic2EiLCJzYXMiLCJnZXRBbmFseXNpcyIsImUiLCJheGlvcyIsImdldCIsInRhcmdldCIsImlkIiwiaGVhZGVycyIsIkF1dGhvcml6YXRpb24iLCJhdXRob3JpemF0aW9uIiwidGhlbiIsImRhdGEiLCJlcnIiLCJjb25zb2xlIiwibG9nIiwidHJhY2tzIiwibWFwIiwidHJhY2siLCJuYW1lIiwiYXJ0aXN0cyIsInBvcHVsYXJpdHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBOztBQUNBLElBQU1BLGFBQWEsR0FBRyxTQUFoQkEsYUFBZ0IsQ0FBQ0MsS0FBRCxFQUFXO0FBQUE7O0FBQ2hDLE1BQU1DLFFBQVEsR0FBR0MsNENBQUssQ0FBQ0MsU0FBTixFQUFqQjtBQUNBLE1BQUlDLFFBQUo7O0FBRmdDLHdCQUdoQkYsNENBQUssQ0FBQ0csUUFBTixDQUFlRCxRQUFmLENBSGdCO0FBQUE7QUFBQSxNQUczQkUsRUFIMkI7QUFBQSxNQUd2QkMsR0FIdUI7O0FBS2hDLE1BQUlDLFdBQVcsR0FBRyxTQUFkQSxXQUFjLENBQUNDLENBQUQsRUFBTztBQUN4QkMsZ0RBQUssQ0FDSEMsR0FERixDQUNNLCtDQUErQ0YsQ0FBQyxDQUFDRyxNQUFGLENBQVNDLEVBRDlELEVBQ2tFO0FBQ2hFQyxhQUFPLEVBQUU7QUFDUkMscUJBQWEsRUFBRWYsS0FBSyxDQUFDZ0I7QUFEYjtBQUR1RCxLQURsRSxFQU1FQyxJQU5GLENBTU8sVUFBQ0MsSUFBRCxFQUFVO0FBQ2ZYLFNBQUcsQ0FBQ1csSUFBSSxDQUFDQSxJQUFOLENBQUg7QUFDQSxLQVJGLFdBU1EsVUFBQ0MsR0FBRCxFQUFTO0FBQ2ZDLGFBQU8sQ0FBQ0MsR0FBUixDQUFZRixHQUFaO0FBQ0EsS0FYRjtBQVlBLEdBYkQ7O0FBZUEsU0FDQztBQUFJLE9BQUcsRUFBRWxCLFFBQVQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQUNFRCxLQUFLLENBQUNzQixNQUFOLENBQWFDLEdBQWIsQ0FBaUIsVUFBQ0MsS0FBRCxFQUFXO0FBQzVCLFdBQ0M7QUFBSSxRQUFFLEVBQUVBLEtBQUssQ0FBQ1gsRUFBZDtBQUFrQixTQUFHLEVBQUVXLEtBQUssQ0FBQ1gsRUFBN0I7QUFBaUMsYUFBTyxFQUFFTCxXQUExQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BQ0VnQixLQUFLLENBQUNDLElBRFIsU0FDaUJELEtBQUssQ0FBQ0UsT0FBTixDQUFjLENBQWQsRUFBaUJELElBRGxDLFFBQzBDRCxLQUFLLENBQUNHLFVBRGhELE1BREQ7QUFLQSxHQU5BLENBREYsRUFRQyxNQUFDLDhDQUFEO0FBQU8sWUFBUSxFQUFFckIsRUFBakI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQVJELENBREQ7QUFZQSxDQWhDRDs7R0FBTVAsYTs7S0FBQUEsYTtBQWtDU0EsNEVBQWYiLCJmaWxlIjoic3RhdGljL3dlYnBhY2svc3RhdGljXFxkZXZlbG9wbWVudFxccGFnZXNcXGluZGV4LmpzLmY5ZDY5MWZmZTE1YmNlMTM5NWViLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xyXG5pbXBvcnQgQXVkaW8gZnJvbSAnLi9BdWRpbyc7XHJcbmNvbnN0IFRyYWNrc1Jlc3VsdHMgPSAocHJvcHMpID0+IHtcclxuXHRjb25zdCB0cmFja1JlZiA9IFJlYWN0LmNyZWF0ZVJlZigpO1xyXG5cdGxldCBhbmFseXNpcztcclxuXHRsZXQgW3NhLCBzYXNdID0gUmVhY3QudXNlU3RhdGUoYW5hbHlzaXMpO1xyXG5cclxuXHRsZXQgZ2V0QW5hbHlzaXMgPSAoZSkgPT4ge1xyXG5cdFx0YXhpb3NcclxuXHRcdFx0LmdldCgnaHR0cHM6Ly9hcGkuc3BvdGlmeS5jb20vdjEvYXVkaW8tYW5hbHlzaXMvJyArIGUudGFyZ2V0LmlkLCB7XHJcblx0XHRcdFx0aGVhZGVyczoge1xyXG5cdFx0XHRcdFx0QXV0aG9yaXphdGlvbjogcHJvcHMuYXV0aG9yaXphdGlvbixcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9KVxyXG5cdFx0XHQudGhlbigoZGF0YSkgPT4ge1xyXG5cdFx0XHRcdHNhcyhkYXRhLmRhdGEpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQuY2F0Y2goKGVycikgPT4ge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdHJldHVybiAoXHJcblx0XHQ8dWwgcmVmPXt0cmFja1JlZn0+XHJcblx0XHRcdHtwcm9wcy50cmFja3MubWFwKCh0cmFjaykgPT4ge1xyXG5cdFx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0XHQ8bGkgaWQ9e3RyYWNrLmlkfSBrZXk9e3RyYWNrLmlkfSBvbkNsaWNrPXtnZXRBbmFseXNpc30+XHJcblx0XHRcdFx0XHRcdHt0cmFjay5uYW1lfSAtIHt0cmFjay5hcnRpc3RzWzBdLm5hbWV9ICh7dHJhY2sucG9wdWxhcml0eX0pXHJcblx0XHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH0pfVxyXG5cdFx0XHQ8QXVkaW8gYW5hbHlzaXM9e3NhfT48L0F1ZGlvPlxyXG5cdFx0PC91bD5cclxuXHQpO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgVHJhY2tzUmVzdWx0cztcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==