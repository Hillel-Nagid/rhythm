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
  }, props.tracks ? props.tracks.map(function (track) {
    return __jsx("li", {
      id: track.id,
      key: track.id,
      onClick: getAnalysis,
      __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 28,
        columnNumber: 8
      }
    }, track.name, " - ", track.artists[0].name, " (", track.popularity, ")");
  }) : '', __jsx(_Audio__WEBPACK_IMPORTED_MODULE_3__["default"], {
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

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wYWdlcy9UcmFja3NSZXN1bHRzLmpzIl0sIm5hbWVzIjpbIlRyYWNrc1Jlc3VsdHMiLCJwcm9wcyIsInRyYWNrUmVmIiwiUmVhY3QiLCJjcmVhdGVSZWYiLCJhbmFseXNpcyIsInVzZVN0YXRlIiwic2EiLCJzYXMiLCJnZXRBbmFseXNpcyIsImUiLCJheGlvcyIsImdldCIsInRhcmdldCIsImlkIiwiaGVhZGVycyIsIkF1dGhvcml6YXRpb24iLCJhdXRob3JpemF0aW9uIiwidGhlbiIsImRhdGEiLCJlcnIiLCJjb25zb2xlIiwibG9nIiwidHJhY2tzIiwibWFwIiwidHJhY2siLCJuYW1lIiwiYXJ0aXN0cyIsInBvcHVsYXJpdHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBOztBQUNBLElBQU1BLGFBQWEsR0FBRyxTQUFoQkEsYUFBZ0IsQ0FBQ0MsS0FBRCxFQUFXO0FBQUE7O0FBQ2hDLE1BQU1DLFFBQVEsR0FBR0MsNENBQUssQ0FBQ0MsU0FBTixFQUFqQjtBQUNBLE1BQUlDLFFBQUo7O0FBRmdDLHdCQUdoQkYsNENBQUssQ0FBQ0csUUFBTixDQUFlRCxRQUFmLENBSGdCO0FBQUE7QUFBQSxNQUczQkUsRUFIMkI7QUFBQSxNQUd2QkMsR0FIdUI7O0FBS2hDLE1BQUlDLFdBQVcsR0FBRyxTQUFkQSxXQUFjLENBQUNDLENBQUQsRUFBTztBQUN4QkMsZ0RBQUssQ0FDSEMsR0FERixDQUNNLCtDQUErQ0YsQ0FBQyxDQUFDRyxNQUFGLENBQVNDLEVBRDlELEVBQ2tFO0FBQ2hFQyxhQUFPLEVBQUU7QUFDUkMscUJBQWEsRUFBRWYsS0FBSyxDQUFDZ0I7QUFEYjtBQUR1RCxLQURsRSxFQU1FQyxJQU5GLENBTU8sVUFBQ0MsSUFBRCxFQUFVO0FBQ2ZYLFNBQUcsQ0FBQ1csSUFBSSxDQUFDQSxJQUFOLENBQUg7QUFDQSxLQVJGLFdBU1EsVUFBQ0MsR0FBRCxFQUFTO0FBQ2ZDLGFBQU8sQ0FBQ0MsR0FBUixDQUFZRixHQUFaO0FBQ0EsS0FYRjtBQVlBLEdBYkQ7O0FBZUEsU0FDQztBQUFJLE9BQUcsRUFBRWxCLFFBQVQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQUNFRCxLQUFLLENBQUNzQixNQUFOLEdBQ0V0QixLQUFLLENBQUNzQixNQUFOLENBQWFDLEdBQWIsQ0FBaUIsVUFBQ0MsS0FBRCxFQUFXO0FBQzVCLFdBQ0M7QUFBSSxRQUFFLEVBQUVBLEtBQUssQ0FBQ1gsRUFBZDtBQUFrQixTQUFHLEVBQUVXLEtBQUssQ0FBQ1gsRUFBN0I7QUFBaUMsYUFBTyxFQUFFTCxXQUExQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BQ0VnQixLQUFLLENBQUNDLElBRFIsU0FDaUJELEtBQUssQ0FBQ0UsT0FBTixDQUFjLENBQWQsRUFBaUJELElBRGxDLFFBQzBDRCxLQUFLLENBQUNHLFVBRGhELE1BREQ7QUFLQyxHQU5ELENBREYsR0FRRSxFQVRKLEVBVUMsTUFBQyw4Q0FBRDtBQUFPLFlBQVEsRUFBRXJCLEVBQWpCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFWRCxDQUREO0FBY0EsQ0FsQ0Q7O0dBQU1QLGE7O0tBQUFBLGE7QUFvQ1NBLDRFQUFmIiwiZmlsZSI6InN0YXRpYy93ZWJwYWNrL3N0YXRpY1xcZGV2ZWxvcG1lbnRcXHBhZ2VzXFxpbmRleC5qcy45NGFkZWNlOTY0YmNiYmQwZTc0NC5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcclxuaW1wb3J0IEF1ZGlvIGZyb20gJy4vQXVkaW8nO1xyXG5jb25zdCBUcmFja3NSZXN1bHRzID0gKHByb3BzKSA9PiB7XHJcblx0Y29uc3QgdHJhY2tSZWYgPSBSZWFjdC5jcmVhdGVSZWYoKTtcclxuXHRsZXQgYW5hbHlzaXM7XHJcblx0bGV0IFtzYSwgc2FzXSA9IFJlYWN0LnVzZVN0YXRlKGFuYWx5c2lzKTtcclxuXHJcblx0bGV0IGdldEFuYWx5c2lzID0gKGUpID0+IHtcclxuXHRcdGF4aW9zXHJcblx0XHRcdC5nZXQoJ2h0dHBzOi8vYXBpLnNwb3RpZnkuY29tL3YxL2F1ZGlvLWFuYWx5c2lzLycgKyBlLnRhcmdldC5pZCwge1xyXG5cdFx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHRcdEF1dGhvcml6YXRpb246IHByb3BzLmF1dGhvcml6YXRpb24sXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0fSlcclxuXHRcdFx0LnRoZW4oKGRhdGEpID0+IHtcclxuXHRcdFx0XHRzYXMoZGF0YS5kYXRhKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0LmNhdGNoKChlcnIpID0+IHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdFx0XHR9KTtcclxuXHR9O1xyXG5cclxuXHRyZXR1cm4gKFxyXG5cdFx0PHVsIHJlZj17dHJhY2tSZWZ9PlxyXG5cdFx0XHR7cHJvcHMudHJhY2tzXHJcblx0XHRcdFx0PyBwcm9wcy50cmFja3MubWFwKCh0cmFjaykgPT4ge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdFx0XHRcdDxsaSBpZD17dHJhY2suaWR9IGtleT17dHJhY2suaWR9IG9uQ2xpY2s9e2dldEFuYWx5c2lzfT5cclxuXHRcdFx0XHRcdFx0XHRcdHt0cmFjay5uYW1lfSAtIHt0cmFjay5hcnRpc3RzWzBdLm5hbWV9ICh7dHJhY2sucG9wdWxhcml0eX0pXHJcblx0XHRcdFx0XHRcdFx0PC9saT5cclxuXHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHQgIH0pXHJcblx0XHRcdFx0OiAnJ31cclxuXHRcdFx0PEF1ZGlvIGFuYWx5c2lzPXtzYX0+PC9BdWRpbz5cclxuXHRcdDwvdWw+XHJcblx0KTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRyYWNrc1Jlc3VsdHM7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=