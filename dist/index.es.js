import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var calculateGuidePositions = function calculateGuidePositions(dimensions, axis) {
  if (axis === 'x') {
    var start = dimensions.left;
    var middle = dimensions.left + parseInt(dimensions.width / 2, 10);
    var end = dimensions.left + dimensions.width;
    return [start, middle, end];
  } else {
    var _start = dimensions.top;

    var _middle = dimensions.top + parseInt(dimensions.height / 2, 10);

    var _end = dimensions.top + dimensions.height;

    return [_start, _middle, _end];
  }
};
var proximityListener = function proximityListener(active, allGuides) {
  var xAxisGuidesForActiveBox = allGuides[active].x;
  var yAxisGuidesForActiveBox = allGuides[active].y;
  var xAxisAllGuides = getAllGuidesForGivenAxisExceptActiveBox(allGuides, xAxisGuidesForActiveBox, 'x');
  var yAxisAllGuides = getAllGuidesForGivenAxisExceptActiveBox(allGuides, yAxisGuidesForActiveBox, 'y');
  var xAxisMatchedGuides = checkValueProximities(xAxisGuidesForActiveBox, xAxisAllGuides);
  var yAxisMatchedGuides = checkValueProximities(yAxisGuidesForActiveBox, yAxisAllGuides);
  var allMatchedGuides = {};

  if (xAxisMatchedGuides.proximity) {
    allMatchedGuides.x = _objectSpread({}, xAxisMatchedGuides, {
      activeBoxGuides: xAxisGuidesForActiveBox
    });
  }

  if (yAxisMatchedGuides.proximity) {
    allMatchedGuides.y = _objectSpread({}, yAxisMatchedGuides, {
      activeBoxGuides: yAxisGuidesForActiveBox
    });
  }

  return allMatchedGuides;
};
var getAllGuidesForGivenAxisExceptActiveBox = function getAllGuidesForGivenAxisExceptActiveBox(allGuides, guidesForActiveBoxAlongGivenAxis, axis) {
  var result = Object.keys(allGuides).map(function (box) {
    var currentBoxGuidesAlongGivenAxis = allGuides[box][axis];

    if (currentBoxGuidesAlongGivenAxis !== guidesForActiveBoxAlongGivenAxis) {
      return currentBoxGuidesAlongGivenAxis;
    }
  });
  return result.filter(function (guides) {
    return guides !== undefined;
  });
};
var checkValueProximities = function checkValueProximities(activeBoxGuidesInOneAxis, allOtherGuidesInOneAxis) {
  var proximity = null;
  var intersection = null;
  var matchedArray = [];
  var snapThreshold = 5;

  for (var index = 0; index < allOtherGuidesInOneAxis.length; index += 1) {
    var index2 = 0;
    var index3 = 0;

    while (index2 < activeBoxGuidesInOneAxis.length && index3 < allOtherGuidesInOneAxis[index].length) {
      var diff = Math.abs(activeBoxGuidesInOneAxis[index2] - allOtherGuidesInOneAxis[index][index3]);

      if (diff <= snapThreshold) {
        proximity = {
          value: diff,
          activeBoxIndex: index2,
          matchedBoxIndex: index3
        };
        matchedArray = allOtherGuidesInOneAxis[index];
        intersection = allOtherGuidesInOneAxis[index][index3];
      }

      if (activeBoxGuidesInOneAxis[index2] < allOtherGuidesInOneAxis[index][index3]) {
        index2 += 1;
      } else {
        index3 += 1;
      }
    }
  }

  return {
    matchedArray: matchedArray,
    proximity: proximity,
    intersection: intersection
  };
};
var calculateBoundariesForDrag = function calculateBoundariesForDrag(left, top, width, height, bounds) {
  var boundingBox = _objectSpread({}, bounds);

  if (left >= 0 && left <= boundingBox.width - width && top >= 0 && top <= boundingBox.height - height) {
    return {
      left: left,
      top: top
    };
  } else if (left >= 0 && left <= boundingBox.width - width) {
    return {
      left: left,
      top: top < 0 ? 0 : boundingBox.height - height
    };
  } else if (top >= 0 && top <= boundingBox.height - height) {
    return {
      left: left < 0 ? 0 : boundingBox.width - width,
      top: top
    };
  } else {
    return {
      left: left < 0 ? 0 : boundingBox.width - width,
      top: top < 0 ? 0 : boundingBox.height - height
    };
  }
}; // Calculate boundaries for boxes given an output resolution

var calculateBoundariesForResize = function calculateBoundariesForResize(left, top, width, height, bounds) {
  var boundingBox = _objectSpread({}, bounds);

  var widthDifference = 0;
  var heightDifference = 0;

  if (left >= 0 && left + width <= boundingBox.width && top >= 0 && top + height <= boundingBox.height) {
    return {
      left: left,
      top: top,
      width: width,
      height: height
    };
  } else if (left < 0 && top < 0) {
    return {
      left: 0,
      top: 0,
      width: width + left <= boundingBox.width ? width + left : boundingBox.width,
      height: height + top <= boundingBox.height ? height + top : boundingBox.height
    };
  } else if (left < 0) {
    return {
      left: 0,
      top: top,
      width: width + left <= boundingBox.width ? width + left : boundingBox.width,
      height: height + top <= boundingBox.height ? height : boundingBox.height - top
    };
  } else if (top < 0) {
    return {
      left: left,
      top: 0,
      width: width + left <= boundingBox.width ? width : boundingBox.width - left,
      height: height + top <= boundingBox.height ? height + top : boundingBox.height
    };
  } else if (left >= 0 && left + width <= boundingBox.width) {
    heightDifference = top + height - boundingBox.height;
    return {
      left: left,
      top: top < 0 ? 0 : top,
      width: width,
      height: height - heightDifference
    };
  } else if (top >= 0 && top + height <= boundingBox.height) {
    widthDifference = left + width - boundingBox.width;
    return {
      left: left < 0 ? 0 : left,
      top: top,
      width: width - widthDifference,
      height: height
    };
  } else {
    widthDifference = left + width - boundingBox.width;
    heightDifference = top + height - boundingBox.height;
    return {
      left: left < 0 ? 0 : left,
      top: top < 0 ? 0 : top,
      width: width - widthDifference,
      height: height - heightDifference
    };
  }
};
var getOffsetCoordinates = function getOffsetCoordinates(node) {
  return {
    x: node.offsetLeft,
    y: node.offsetTop,
    top: node.offsetTop,
    left: node.offsetLeft,
    width: node.offsetWidth,
    height: node.offsetHeight
  };
};
var getLength = function getLength(x, y) {
  return Math.sqrt(x * x + y * y);
};
var topLeftToCenter = function topLeftToCenter(_ref) {
  var left = _ref.left,
      top = _ref.top,
      width = _ref.width,
      height = _ref.height,
      rotateAngle = _ref.rotateAngle;
  return {
    cx: left + width / 2,
    cy: top + height / 2,
    width: width,
    height: height,
    rotateAngle: rotateAngle
  };
};
var centerToTopLeft = function centerToTopLeft(_ref2) {
  var cx = _ref2.cx,
      cy = _ref2.cy,
      width = _ref2.width,
      height = _ref2.height,
      rotateAngle = _ref2.rotateAngle;
  return {
    top: cy - height / 2,
    left: cx - width / 2,
    width: width,
    height: height,
    rotateAngle: rotateAngle
  };
};

var setWidthAndDeltaW = function setWidthAndDeltaW(width, deltaW, minWidth) {
  var expectedWidth = width + deltaW;

  if (expectedWidth > minWidth) {
    width = expectedWidth;
  } else {
    deltaW = minWidth - width;
    width = minWidth;
  }

  return {
    width: width,
    deltaW: deltaW
  };
};

var setHeightAndDeltaH = function setHeightAndDeltaH(height, deltaH, minHeight) {
  var expectedHeight = height + deltaH;

  if (expectedHeight > minHeight) {
    height = expectedHeight;
  } else {
    deltaH = minHeight - height;
    height = minHeight;
  }

  return {
    height: height,
    deltaH: deltaH
  };
};

var getNewStyle = function getNewStyle(type, rect, deltaW, deltaH, minWidth, minHeight) {
  var width = rect.width,
      height = rect.height,
      cx = rect.cx,
      cy = rect.cy,
      rotateAngle = rect.rotateAngle;
  var widthFlag = width < 0 ? -1 : 1;
  var heightFlag = height < 0 ? -1 : 1;
  width = Math.abs(width);
  height = Math.abs(height);

  switch (type) {
    case 'tr':
      {
        deltaH = -deltaH;
        var widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth);
        width = widthAndDeltaW.width;
        deltaW = widthAndDeltaW.deltaW;
        var heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight);
        height = heightAndDeltaH.height;
        deltaH = heightAndDeltaH.deltaH;
        cx += deltaW / 2 * cos(rotateAngle) + deltaH / 2 * sin(rotateAngle);
        cy += deltaW / 2 * sin(rotateAngle) - deltaH / 2 * cos(rotateAngle);
        break;
      }

    case 'br':
      {
        var _widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth);

        width = _widthAndDeltaW.width;
        deltaW = _widthAndDeltaW.deltaW;

        var _heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight);

        height = _heightAndDeltaH.height;
        deltaH = _heightAndDeltaH.deltaH;
        cx += deltaW / 2 * cos(rotateAngle) - deltaH / 2 * sin(rotateAngle);
        cy += deltaW / 2 * sin(rotateAngle) + deltaH / 2 * cos(rotateAngle);
        break;
      }

    case 'bl':
      {
        deltaW = -deltaW;

        var _widthAndDeltaW2 = setWidthAndDeltaW(width, deltaW, minWidth);

        width = _widthAndDeltaW2.width;
        deltaW = _widthAndDeltaW2.deltaW;

        var _heightAndDeltaH2 = setHeightAndDeltaH(height, deltaH, minHeight);

        height = _heightAndDeltaH2.height;
        deltaH = _heightAndDeltaH2.deltaH;
        cx -= deltaW / 2 * cos(rotateAngle) + deltaH / 2 * sin(rotateAngle);
        cy -= deltaW / 2 * sin(rotateAngle) - deltaH / 2 * cos(rotateAngle);
        break;
      }

    case 'tl':
      {
        deltaW = -deltaW;
        deltaH = -deltaH;

        var _widthAndDeltaW3 = setWidthAndDeltaW(width, deltaW, minWidth);

        width = _widthAndDeltaW3.width;
        deltaW = _widthAndDeltaW3.deltaW;

        var _heightAndDeltaH3 = setHeightAndDeltaH(height, deltaH, minHeight);

        height = _heightAndDeltaH3.height;
        deltaH = _heightAndDeltaH3.deltaH;
        cx -= deltaW / 2 * cos(rotateAngle) - deltaH / 2 * sin(rotateAngle);
        cy -= deltaW / 2 * sin(rotateAngle) + deltaH / 2 * cos(rotateAngle);
        break;
      }
  }

  return {
    position: {
      cx: cx,
      cy: cy
    },
    size: {
      width: width * widthFlag,
      height: height * heightFlag
    }
  };
}; // Rotate helpers

var getAngle = function getAngle(_ref3, _ref4) {
  var x1 = _ref3.x,
      y1 = _ref3.y;
  var x2 = _ref4.x,
      y2 = _ref4.y;
  var dot = x1 * x2 + y1 * y2;
  var det = x1 * y2 - y1 * x2;
  var angle = Math.atan2(det, dot) / Math.PI * 180;
  return (angle + 360) % 360;
};
var getNewCoordinates = function getNewCoordinates(rect) {
  var x = rect.x,
      y = rect.y,
      width = rect.width,
      height = rect.height,
      rotateAngle = rect.rotateAngle,
      node = rect.node;
  var cx = x + width / 2;
  var cy = y + height / 2;
  var tempX = x - cx;
  var tempY = y - cy;
  var cosine = cos(rotateAngle);
  var sine = sin(rotateAngle);
  var rotatedX = cx + (tempX * cosine - tempY * sine);
  var rotatedY = cy + (tempX * sine + tempY * cosine);
  return {
    x: rotatedX,
    y: rotatedY,
    top: rotatedX,
    left: rotatedY,
    width: width,
    height: height,
    rotateAngle: rotateAngle,
    node: node
  };
};
var degToRadian = function degToRadian(deg) {
  return deg * Math.PI / 180;
};

var cos = function cos(deg) {
  return Math.cos(degToRadian(deg));
};

var sin = function sin(deg) {
  return Math.sin(degToRadian(deg));
};

// Key map for changing the position and size of draggable boxes

var RESIZE_HANDLES = ['tr', 'tl', 'br', 'bl']; // Positions for rotate handles

var ROTATE_HANDLES = ['tr', 'tl', 'br', 'bl'];

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = "* {\n  box-sizing: border-box; }\n\n.styles_boundingBox__q5am2 {\n  padding: 0;\n  position: fixed;\n  background-color: transparent; }\n\n.styles_box__3n5vw {\n  background-color: transparent;\n  position: absolute;\n  outline: none;\n  z-index: 10;\n  transform-origin: center center; }\n  .styles_box__3n5vw:hover {\n    border: 2px solid #EB4B48; }\n\n.styles_selected__2PEpG {\n  background-color: transparent;\n  border: 2px solid #EB4B48; }\n\n.styles_guide__3lcsS {\n  background: #EB4B48;\n  color: #EB4B48;\n  display: none;\n  left: 0;\n  position: absolute;\n  top: 0;\n  z-index: 100; }\n\n.styles_active__1jaJY {\n  display: block; }\n\n.styles_xAxis__1ag77 {\n  height: 100%;\n  width: 1px; }\n\n.styles_yAxis__LO1fy {\n  height: 1px;\n  width: 100%; }\n\n.styles_coordinates__ulL0y {\n  font-size: 10px;\n  position: absolute;\n  top: -20px;\n  left: 0;\n  color: #EB4B48;\n  font-weight: bold;\n  height: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: flex-start; }\n\n.styles_dimensions__27ria {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: absolute;\n  font-size: 10px;\n  font-weight: bold;\n  color: #EB4B48; }\n\n.styles_width__2MzYI {\n  height: 10px; }\n\n.styles_resizeHandle__1PLUu,\n.styles_rotateHandle__26rVp {\n  width: 10px;\n  height: 10px;\n  background-color: #FFF;\n  border: 2px solid #EB4B48;\n  position: absolute; }\n\n.styles_resizeHandle__1PLUu {\n  z-index: 99; }\n\n.styles_resize-tr__ZvMqh {\n  top: -5px;\n  right: -5px; }\n\n.styles_resize-tl__2WkU4 {\n  top: -5px;\n  left: -5px; }\n\n.styles_resize-br__1bQX3 {\n  bottom: -5px;\n  right: -5px; }\n\n.styles_resize-bl__2hmh_ {\n  bottom: -5px;\n  left: -5px; }\n\n.styles_resize-tr__ZvMqh, .styles_resize-bl__2hmh_ {\n  cursor: nesw-resize; }\n\n.styles_resize-tl__2WkU4, .styles_resize-br__1bQX3 {\n  cursor: nwse-resize; }\n\n.styles_rotateHandle__26rVp {\n  width: 25px;\n  height: 25px;\n  z-index: 98;\n  opacity: 0; }\n\n.styles_rotate-tr__1qWDZ {\n  top: -20px;\n  right: -20px;\n  cursor: url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='15' width='15' fill='%23333' viewBox='0 0 24 24' stroke='%23FFF'%3E%3Cpath d='M14.722 16.802c-.687 0-1.373.343-1.545 1.028-.344.686-.172 1.371.343 1.886l3.777 3.77c.172.171.344.343.515.343.172.171.515.171.687.171.172 0 .515 0 .687-.171.172-.172.343-.172.515-.343l3.777-3.77c.515-.515.687-1.2.343-1.886-.343-.685-.858-1.028-1.545-1.028h-2.06v-2.228A10.762 10.762 0 009.4 3.777H7.168V1.721c0-.686-.344-1.371-1.03-1.543C5.45-.164 4.764.007 4.249.521L.472 4.291C.3 4.463.13 4.634.13 4.806c-.172.342-.172.856 0 1.37.171.172.171.343.343.515l3.777 3.77c.344.343.687.514 1.202.514.172 0 .515 0 .687-.171.686-.343 1.03-.857 1.03-1.543V7.205H9.4c4.12 0 7.382 3.256 7.382 7.37v2.227z' stroke-width='1.715'/%3E%3C/svg%3E\") 0 0, auto; }\n\n.styles_rotate-tl__3lNBx {\n  top: -20px;\n  left: -20px;\n  cursor: url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='15' width='15' fill='%23333' viewBox='0 0 24 24' stroke='%23FFF' transform='rotate(-90)'%3E%3Cpath d='M14.722 16.802c-.687 0-1.373.343-1.545 1.028-.344.686-.172 1.371.343 1.886l3.777 3.77c.172.171.344.343.515.343.172.171.515.171.687.171.172 0 .515 0 .687-.171.172-.172.343-.172.515-.343l3.777-3.77c.515-.515.687-1.2.343-1.886-.343-.685-.858-1.028-1.545-1.028h-2.06v-2.228A10.762 10.762 0 009.4 3.777H7.168V1.721c0-.686-.344-1.371-1.03-1.543C5.45-.164 4.764.007 4.249.521L.472 4.291C.3 4.463.13 4.634.13 4.806c-.172.342-.172.856 0 1.37.171.172.171.343.343.515l3.777 3.77c.344.343.687.514 1.202.514.172 0 .515 0 .687-.171.686-.343 1.03-.857 1.03-1.543V7.205H9.4c4.12 0 7.382 3.256 7.382 7.37v2.227z' stroke-width='1.715'/%3E%3C/svg%3E\") 0 0, auto; }\n\n.styles_rotate-br__baNeE {\n  bottom: -20px;\n  right: -20px;\n  cursor: url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='15' width='15' fill='%23333' viewBox='0 0 24 24' stroke='%23FFF' transform='rotate(90)'%3E%3Cpath d='M14.722 16.802c-.687 0-1.373.343-1.545 1.028-.344.686-.172 1.371.343 1.886l3.777 3.77c.172.171.344.343.515.343.172.171.515.171.687.171.172 0 .515 0 .687-.171.172-.172.343-.172.515-.343l3.777-3.77c.515-.515.687-1.2.343-1.886-.343-.685-.858-1.028-1.545-1.028h-2.06v-2.228A10.762 10.762 0 009.4 3.777H7.168V1.721c0-.686-.344-1.371-1.03-1.543C5.45-.164 4.764.007 4.249.521L.472 4.291C.3 4.463.13 4.634.13 4.806c-.172.342-.172.856 0 1.37.171.172.171.343.343.515l3.777 3.77c.344.343.687.514 1.202.514.172 0 .515 0 .687-.171.686-.343 1.03-.857 1.03-1.543V7.205H9.4c4.12 0 7.382 3.256 7.382 7.37v2.227z' stroke-width='1.715'/%3E%3C/svg%3E\") 0 0, auto; }\n\n.styles_rotate-bl__3zhHr {\n  bottom: -20px;\n  left: -20px;\n  cursor: url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='15' width='15' fill='%23333' viewBox='0 0 24 24' stroke='%23FFF' transform='rotate(180)'%3E%3Cpath d='M14.722 16.802c-.687 0-1.373.343-1.545 1.028-.344.686-.172 1.371.343 1.886l3.777 3.77c.172.171.344.343.515.343.172.171.515.171.687.171.172 0 .515 0 .687-.171.172-.172.343-.172.515-.343l3.777-3.77c.515-.515.687-1.2.343-1.886-.343-.685-.858-1.028-1.545-1.028h-2.06v-2.228A10.762 10.762 0 009.4 3.777H7.168V1.721c0-.686-.344-1.371-1.03-1.543C5.45-.164 4.764.007 4.249.521L.472 4.291C.3 4.463.13 4.634.13 4.806c-.172.342-.172.856 0 1.37.171.172.171.343.343.515l3.777 3.77c.344.343.687.514 1.202.514.172 0 .515 0 .687-.171.686-.343 1.03-.857 1.03-1.543V7.205H9.4c4.12 0 7.382 3.256 7.382 7.37v2.227z' stroke-width='1.715'/%3E%3C/svg%3E\") 0 0, auto; }\n";
var styles = {"boundingBox":"styles_boundingBox__q5am2","box":"styles_box__3n5vw","selected":"styles_selected__2PEpG","guide":"styles_guide__3lcsS","active":"styles_active__1jaJY","xAxis":"styles_xAxis__1ag77","yAxis":"styles_yAxis__LO1fy","coordinates":"styles_coordinates__ulL0y","dimensions":"styles_dimensions__27ria","width":"styles_width__2MzYI","resizeHandle":"styles_resizeHandle__1PLUu","rotateHandle":"styles_rotateHandle__26rVp","resize-tr":"styles_resize-tr__ZvMqh","resize-tl":"styles_resize-tl__2WkU4","resize-br":"styles_resize-br__1bQX3","resize-bl":"styles_resize-bl__2hmh_","rotate-tr":"styles_rotate-tr__1qWDZ","rotate-tl":"styles_rotate-tl__3lNBx","rotate-br":"styles_rotate-br__baNeE","rotate-bl":"styles_rotate-bl__3zhHr"};
styleInject(css);

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(source, true).forEach(function (key) { _defineProperty$1(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Box =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(Box, _PureComponent);

  function Box(props) {
    var _this;

    _classCallCheck(this, Box);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Box).call(this, props));
    _this.box = React.createRef();
    _this.coordinates = React.createRef();
    _this.height = React.createRef();
    _this.selectBox = _this.selectBox.bind(_assertThisInitialized(_this));
    _this.onDragStart = _this.onDragStart.bind(_assertThisInitialized(_this));
    _this.shortcutHandler = _this.shortcutHandler.bind(_assertThisInitialized(_this));
    _this.onResizeStart = _this.onResizeStart.bind(_assertThisInitialized(_this));
    _this.onRotateStart = _this.onRotateStart.bind(_assertThisInitialized(_this));
    _this.getCoordinatesWrapperWidth = _this.getCoordinatesWrapperWidth.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Box, [{
    key: "selectBox",
    value: function selectBox(e) {
      this.props.selectBox(e);
    }
  }, {
    key: "onDragStart",
    value: function onDragStart(e) {
      var _this2 = this;

      if ((this.props.position.drag || this.props.position.drag === undefined) && e.target.id.indexOf('box') !== -1) {
        // Allow drag only if drag property for the box is true or undefined
        e.stopPropagation();
        var target = this.box.current;
        var boundingBox = this.props.getBoundingBoxElement();
        var position = this.props.position;
        var startingPosition = position.rotateAngle === 0 ? target.getBoundingClientRect().toJSON() : getOffsetCoordinates(target);
        var boundingBoxPosition = boundingBox.current.getBoundingClientRect().toJSON();
        var data = {
          x: startingPosition.x - boundingBoxPosition.x,
          y: startingPosition.y - boundingBoxPosition.y,
          top: startingPosition.y - boundingBoxPosition.y,
          left: startingPosition.x - boundingBoxPosition.x,
          width: startingPosition.width,
          height: startingPosition.height,
          node: target
        };

        if (position.rotateAngle !== 0) {
          data = {
            x: startingPosition.x,
            y: startingPosition.y,
            top: startingPosition.y,
            left: startingPosition.x,
            width: startingPosition.width,
            height: startingPosition.height,
            node: target
          };
        }

        this.props.onDragStart && this.props.onDragStart(e, data);
        var deltaX = Math.abs(target.offsetLeft - e.clientX);
        var deltaY = Math.abs(target.offsetTop - e.clientY);

        var onDrag = function onDrag(e) {
          if (_this2.props.dragging) {
            e.stopPropagation();

            var _boundingBox = _this2.props.getBoundingBoxElement();

            var boundingBoxDimensions = _boundingBox.current.getBoundingClientRect().toJSON();

            var boxWidth = _this2.props.position.width;
            var boxHeight = _this2.props.position.height;
            var left = e.clientX - deltaX;
            var top = e.clientY - deltaY;
            var currentPosition = _this2.props.boundToParent ? calculateBoundariesForDrag(left, top, boxWidth, boxHeight, boundingBoxDimensions) : {
              left: left,
              top: top,
              width: _this2.props.position.width,
              height: _this2.props.position.height,
              x: left,
              y: top,
              node: _this2.box.current
            };
            data = {
              x: currentPosition.left,
              y: currentPosition.top,
              top: currentPosition.top,
              left: currentPosition.left,
              width: _this2.props.position.width,
              height: _this2.props.position.height,
              node: _this2.box.current
            };
            _this2.props.onDrag && _this2.props.onDrag(e, data);
          }
        };

        var onDragEnd = function onDragEnd(e) {
          if (_this2.props.dragging) {
            _this2.props.onDragEnd && _this2.props.onDragEnd(e, data);
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', onDragEnd);
          }
        };

        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', onDragEnd);
      }
    }
  }, {
    key: "shortcutHandler",
    value: function shortcutHandler(e) {
      var position = this.props.position;

      if (!e.shiftKey && !e.ctrlKey && e.key === 'ArrowRight') {
        var data = Object.assign({}, position, {
          node: this.box.current,
          left: position.left + 1,
          x: position.x + 1
        });
        this.props.onKeyUp && this.props.onKeyUp(e, data);
      } else if (e.shiftKey && !e.ctrlKey && e.key === 'ArrowRight') {
        var _data = Object.assign({}, position, {
          node: this.box.current,
          left: position.left + 10,
          x: position.x + 10
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data);
      } else if (!e.shiftKey && !e.ctrlKey && e.key === 'ArrowLeft') {
        var _data2 = Object.assign({}, position, {
          node: this.box.current,
          left: position.left - 1,
          x: position.x - 1
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data2);
      } else if (e.shiftKey && !e.ctrlKey && e.key === 'ArrowLeft') {
        var _data3 = Object.assign({}, position, {
          node: this.box.current,
          left: position.left - 10,
          x: position.x - 10
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data3);
      } else if (!e.shiftKey && !e.ctrlKey && e.key === 'ArrowUp') {
        var _data4 = Object.assign({}, position, {
          node: this.box.current,
          top: position.top - 1,
          y: position.y - 1
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data4);
      } else if (e.shiftKey && !e.ctrlKey && e.key === 'ArrowUp') {
        var _data5 = Object.assign({}, position, {
          node: this.box.current,
          top: position.top - 10,
          y: position.y - 10
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data5);
      } else if (!e.shiftKey && !e.ctrlKey && e.key === 'ArrowDown') {
        var _data6 = Object.assign({}, position, {
          node: this.box.current,
          top: position.top + 1,
          y: position.y + 1
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data6);
      } else if (e.shiftKey && !e.ctrlKey && e.key === 'ArrowDown') {
        var _data7 = Object.assign({}, position, {
          node: this.box.current,
          top: position.top + 10,
          y: position.y + 10
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data7);
      } else if (e.ctrlKey && !e.shiftKey && e.key === 'ArrowRight') {
        var _data8 = Object.assign({}, position, {
          node: this.box.current,
          width: position.width + 1
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data8);
      } else if (e.ctrlKey && e.shiftKey && e.key === 'ArrowRight') {
        var _data9 = Object.assign({}, position, {
          node: this.box.current,
          width: position.width + 10
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data9);
      } else if (e.ctrlKey && !e.shiftKey && e.key === 'ArrowLeft') {
        var _data10 = Object.assign({}, position, {
          node: this.box.current,
          width: position.width - 1
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data10);
      } else if (e.ctrlKey && e.shiftKey && e.key === 'ArrowLeft') {
        var _data11 = Object.assign({}, position, {
          node: this.box.current,
          width: position.width - 10
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data11);
      } else if (e.ctrlKey && !e.shiftKey && e.key === 'ArrowDown') {
        var _data12 = Object.assign({}, position, {
          node: this.box.current,
          height: position.height + 1
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data12);
      } else if (e.ctrlKey && e.shiftKey && e.key === 'ArrowDown') {
        var _data13 = Object.assign({}, position, {
          node: this.box.current,
          height: position.height + 10
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data13);
      } else if (e.ctrlKey && !e.shiftKey && e.key === 'ArrowUp') {
        var _data14 = Object.assign({}, position, {
          node: this.box.current,
          height: position.height - 1
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data14);
      } else if (e.ctrlKey && e.shiftKey && e.key === 'ArrowUp') {
        var _data15 = Object.assign({}, position, {
          node: this.box.current,
          height: position.height - 10
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data15);
      }
    }
  }, {
    key: "onResizeStart",
    value: function onResizeStart(e) {
      var _this3 = this;

      if (this.props.position.resize || this.props.position.resize === undefined) {
        // Allow resize only if resize property for the box is true or undefined
        e.stopPropagation();
        var target = e.target,
            startX = e.clientX,
            startY = e.clientY;
        var boundingBox = this.props.getBoundingBoxElement();
        var position = this.props.position;
        var rotateAngle = position.rotateAngle ? position.rotateAngle : 0;
        var startingDimensions = getOffsetCoordinates(this.box.current);
        var boundingBoxPosition = getOffsetCoordinates(boundingBox.current);
        var left = startingDimensions.left,
            top = startingDimensions.top,
            width = startingDimensions.width,
            height = startingDimensions.height;

        var _topLeftToCenter = topLeftToCenter({
          left: left,
          top: top,
          width: width,
          height: height,
          rotateAngle: rotateAngle
        }),
            cx = _topLeftToCenter.cx,
            cy = _topLeftToCenter.cy;

        var rect = {
          width: width,
          height: height,
          cx: cx,
          cy: cy,
          rotateAngle: rotateAngle
        };
        var data = {
          width: startingDimensions.width,
          height: startingDimensions.height,
          x: startingDimensions.left + boundingBoxPosition.x,
          y: startingDimensions.top + boundingBoxPosition.y,
          left: startingDimensions.left + boundingBoxPosition.x,
          top: startingDimensions.top + boundingBoxPosition.y,
          node: this.box.current
        }; // if (rotateAngle !== 0) {
        // 	data = {
        // 		width: startingDimensions.width,
        // 		height: startingDimensions.height,
        // 		x: startingDimensions.left + boundingBoxPosition.x,
        // 		y: startingDimensions.top + boundingBoxPosition.y,
        // 		left: startingDimensions.left + boundingBoxPosition.x,
        // 		top: startingDimensions.top + boundingBoxPosition.y,
        // 		node: this.box.current
        // 	};
        // }

        this.props.onResizeStart && this.props.onResizeStart(e, data);

        var onResize = function onResize(e) {
          if (_this3.props.resizing) {
            var clientX = e.clientX,
                clientY = e.clientY;
            var deltaX = clientX - startX;
            var deltaY = clientY - startY;
            var alpha = Math.atan2(deltaY, deltaX);
            var deltaL = getLength(deltaX, deltaY); // const { minWidth, minHeight } = this.props;

            var beta = alpha - degToRadian(rotateAngle);
            var deltaW = deltaL * Math.cos(beta);
            var deltaH = deltaL * Math.sin(beta); // TODO: Account for ratio when there are more points for resizing and when adding extras like constant aspect ratio resizing, shift + resize etc.
            // const ratio = rect.width / rect.height;

            var type = target.id.replace('resize-', '');

            var _getNewStyle = getNewStyle(type, rect, deltaW, deltaH, 10, 10),
                _getNewStyle$position = _getNewStyle.position,
                _cx = _getNewStyle$position.cx,
                _cy = _getNewStyle$position.cy,
                _getNewStyle$size = _getNewStyle.size,
                _width = _getNewStyle$size.width,
                _height = _getNewStyle$size.height; // Use a better way to set minWidth and minHeight


            var tempPosition = centerToTopLeft({
              cx: _cx,
              cy: _cy,
              width: _width,
              height: _height,
              rotateAngle: rotateAngle
            });
            data = {
              width: tempPosition.width,
              height: tempPosition.height,
              x: tempPosition.left,
              y: tempPosition.top,
              left: tempPosition.left,
              top: tempPosition.top,
              rotateAngle: rotateAngle,
              node: _this3.box.current
            }; // if (rotateAngle !== 0) {
            // 	data = {
            // 		width: tempPosition.width,
            // 		height: tempPosition.height,
            // 		x: tempPosition.left,
            // 		y: tempPosition.top,
            // 		left: tempPosition.left,
            // 		top: tempPosition.top,
            // 		rotateAngle,
            // 		node: this.box.current
            // 	};
            // }
            // Calculate the restrictions if resize goes out of bounds

            var currentPosition = _this3.props.boundToParent ? calculateBoundariesForResize(data.left, data.top, tempPosition.width, tempPosition.height, boundingBoxPosition) : Object.assign({}, data);
            data = Object.assign({}, data, currentPosition, {
              x: currentPosition.left,
              y: currentPosition.top
            });
            _this3.props.onResize && _this3.props.onResize(e, data);
          }
        };

        var onResizeEnd = function onResizeEnd(e) {
          if (_this3.props.resizing) {
            document.removeEventListener('mousemove', onResize);
            document.removeEventListener('mouseup', onResizeEnd);
            _this3.props.onResizeEnd && _this3.props.onResizeEnd(e, data);
          }
        };

        document.addEventListener('mousemove', onResize);
        document.addEventListener('mouseup', onResizeEnd);
      }
    }
  }, {
    key: "onRotateStart",
    value: function onRotateStart(e) {
      var _this4 = this;

      if (this.props.position.rotate || this.props.position.rotate === undefined) {
        e.stopPropagation();
        var target = this.box.current;
        var clientX = e.clientX,
            clientY = e.clientY;
        var rotateAngle = this.props.position.rotateAngle;
        var boundingBox = this.props.getBoundingBoxElement();
        var start = target.getBoundingClientRect().toJSON();
        var boundingBoxPosition = boundingBox.current.getBoundingClientRect().toJSON();
        var center = {
          x: start.left + start.width / 2,
          y: start.top + start.height / 2
        };
        var startVector = {
          x: clientX - center.x,
          y: clientY - center.y
        };
        var startAngle = rotateAngle ? rotateAngle : 0;
        var angle = startAngle ? startAngle : 0;
        var data = {
          x: start.x - boundingBoxPosition.x,
          y: start.y - boundingBoxPosition.y,
          top: start.top - boundingBoxPosition.top,
          left: start.left - boundingBoxPosition.left,
          width: start.width,
          height: start.height,
          rotateAngle: angle,
          node: target
        };
        var newCoordinates = getNewCoordinates(data);
        this.props.onRotateStart && this.props.onRotateStart(e, newCoordinates);

        var onRotate = function onRotate(e) {
          if (_this4.props.rotating) {
            e.stopPropagation();
            var _clientX = e.clientX,
                _clientY = e.clientY;
            var rotateVector = {
              x: _clientX - center.x,
              y: _clientY - center.y
            };
            angle = getAngle(startVector, rotateVector); // Snap box during rotation at certain angles - 0, 90, 180, 270, 360

            var _rotateAngle = Math.round(startAngle + angle);

            if (_rotateAngle >= 360) {
              _rotateAngle -= 360;
            } else if (_rotateAngle < 0) {
              _rotateAngle += 360;
            }

            if (_rotateAngle > 356 || _rotateAngle < 4) {
              _rotateAngle = 0;
            } else if (_rotateAngle > 86 && _rotateAngle < 94) {
              _rotateAngle = 90;
            } else if (_rotateAngle > 176 && _rotateAngle < 184) {
              _rotateAngle = 180;
            } else if (_rotateAngle > 266 && _rotateAngle < 274) {
              _rotateAngle = 270;
            }

            data = Object.assign({}, data, {
              rotateAngle: _rotateAngle
            });

            var _newCoordinates = getNewCoordinates(data);

            _this4.props.onRotate && _this4.props.onRotate(e, _newCoordinates);
          }
        };

        var onRotateEnd = function onRotateEnd(e) {
          if (_this4.props.rotating) {
            document.removeEventListener('mousemove', onRotate);
            document.removeEventListener('mouseup', onRotateEnd);
            _this4.props.onRotateEnd && _this4.props.onRotateEnd(e, data);
          }
        };

        document.addEventListener('mousemove', onRotate);
        document.addEventListener('mouseup', onRotateEnd);
      }
    }
  }, {
    key: "getCoordinatesWrapperWidth",
    value: function getCoordinatesWrapperWidth() {
      if (this.props.isSelected && this.coordinates && this.coordinates.current) {
        return this.coordinates.current.offsetWidth;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      var _this$props = this.props,
          boxStyle = _this$props.boxStyle,
          id = _this$props.id,
          isSelected = _this$props.isSelected,
          position = _this$props.position,
          resolution = _this$props.resolution;

      if (!isNaN(position.top) && !isNaN(position.left) && !isNaN(position.width) && !isNaN(position.height)) {
        var boundingBox = this.props.getBoundingBoxElement();
        var boundingBoxDimensions = boundingBox.current.getBoundingClientRect();
        var xFactor = 1;
        var yFactor = 1;

        if (resolution && resolution.width && resolution.height) {
          xFactor = resolution.width / boundingBoxDimensions.width;
          yFactor = resolution.height / boundingBoxDimensions.height;
        }

        var boxClassNames = isSelected ? "".concat(styles.box, " ").concat(styles.selected) : styles.box;
        var rotateAngle = position.rotateAngle ? position.rotateAngle : 0;

        var boxStyles = _objectSpread$1({}, boxStyle, {
          width: "".concat(position.width, "px"),
          height: "".concat(position.height, "px"),
          top: "".concat(position.top, "px"),
          left: "".concat(position.left, "px"),
          zIndex: position.zIndex,
          transform: "rotate(".concat(rotateAngle, "deg)")
        });

        if (isSelected && (this.props.dragging || this.props.resizing)) {
          boxStyles.zIndex = 99;
        }

        return React.createElement("div", {
          className: boxClassNames,
          id: id,
          onMouseUp: this.selectBox,
          onMouseDown: this.props.drag ? this.onDragStart : null // If this.props.drag is false, remove the mouseDown event handler for drag
          ,
          onKeyDown: this.shortcutHandler,
          ref: this.box,
          style: boxStyles,
          tabIndex: "0"
        }, isSelected ? React.createElement("span", {
          ref: this.coordinates,
          className: styles.coordinates
        }, "(".concat(Math.round(position.x * xFactor), ", ").concat(Math.round(position.y * yFactor), ")")) : null, isSelected ? React.createElement("span", {
          className: "".concat(styles.dimensions, " ").concat(styles.width),
          style: {
            width: "".concat(position.width, "px"),
            top: "".concat(position.height + 10, "px")
          }
        }, "".concat(Math.round(position.width * xFactor), " x ").concat(Math.round(position.height * yFactor))) : null, isSelected ? RESIZE_HANDLES.map(function (handle) {
          var className = "".concat(styles.resizeHandle, " ").concat(styles["resize-".concat(handle)]);
          return React.createElement("div", {
            key: handle,
            className: className,
            onMouseDown: _this5.props.resize ? _this5.onResizeStart : null // If this.props.resize is false then remove the mouseDown event handler for resize
            ,
            id: "resize-".concat(handle)
          });
        }) : null, isSelected ? ROTATE_HANDLES.map(function (handle) {
          var className = "".concat(styles.rotateHandle, " ").concat(styles["rotate-".concat(handle)]);
          return React.createElement("div", {
            key: handle,
            className: className,
            onMouseDown: _this5.props.rotate ? _this5.onRotateStart : null // If this.props.rotate is false then remove the mouseDown event handler for rotate
            ,
            id: "rotate-".concat(handle)
          });
        }) : null);
      }

      return null;
    }
  }]);

  return Box;
}(PureComponent);

Box.propTypes = {
  boundToParent: PropTypes.bool,
  drag: PropTypes.bool,
  getBoundingBoxElement: PropTypes.func,
  id: PropTypes.string,
  isSelected: PropTypes.bool,
  keybindings: PropTypes.bool,
  onDragStart: PropTypes.func,
  onDrag: PropTypes.func,
  onDragEnd: PropTypes.func,
  onKeyUp: PropTypes.func,
  onResizeStart: PropTypes.func,
  onResize: PropTypes.func,
  onResizeEnd: PropTypes.func,
  onRotateStart: PropTypes.func,
  onRotate: PropTypes.func,
  onRotateEnd: PropTypes.func,
  position: PropTypes.object.isRequired,
  resize: PropTypes.bool,
  resolution: PropTypes.object,
  rotate: PropTypes.bool
};

function _typeof$1(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$1 = function _typeof(obj) { return typeof obj; }; } else { _typeof$1 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$1(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(source, true).forEach(function (key) { _defineProperty$2(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty$2(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$1(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$1(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$1(Constructor.prototype, protoProps); if (staticProps) _defineProperties$1(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn$1(self, call) { if (call && (_typeof$1(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized$1(self); }

function _getPrototypeOf$1(o) { _getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$1(o); }

function _assertThisInitialized$1(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf$1(subClass, superClass); }

function _setPrototypeOf$1(o, p) { _setPrototypeOf$1 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$1(o, p); }

var AlignmentGuides =
/*#__PURE__*/
function (_Component) {
  _inherits$1(AlignmentGuides, _Component);

  function AlignmentGuides(props) {
    var _this;

    _classCallCheck$1(this, AlignmentGuides);

    _this = _possibleConstructorReturn$1(this, _getPrototypeOf$1(AlignmentGuides).call(this, props));
    _this.boundingBox = React.createRef();
    _this.state = {
      active: '',
      boundingBox: null,
      boxes: {},
      dragging: false,
      guides: {},
      guidesActive: false,
      match: {},
      resizing: false,
      rotating: false
    };
    _this.getBoundingBoxElement = _this.getBoundingBoxElement.bind(_assertThisInitialized$1(_this));
    _this.selectBox = _this.selectBox.bind(_assertThisInitialized$1(_this));
    _this.unSelectBox = _this.unSelectBox.bind(_assertThisInitialized$1(_this));
    _this.dragStartHandler = _this.dragStartHandler.bind(_assertThisInitialized$1(_this));
    _this.dragHandler = _this.dragHandler.bind(_assertThisInitialized$1(_this));
    _this.dragEndHandler = _this.dragEndHandler.bind(_assertThisInitialized$1(_this));
    _this.resizeStartHandler = _this.resizeStartHandler.bind(_assertThisInitialized$1(_this));
    _this.resizeHandler = _this.resizeHandler.bind(_assertThisInitialized$1(_this));
    _this.resizeEndHandler = _this.resizeEndHandler.bind(_assertThisInitialized$1(_this));
    _this.rotateStartHandler = _this.rotateStartHandler.bind(_assertThisInitialized$1(_this));
    _this.rotateHandler = _this.rotateHandler.bind(_assertThisInitialized$1(_this));
    _this.rotateEndHandler = _this.rotateEndHandler.bind(_assertThisInitialized$1(_this));
    _this.keyUpHandler = _this.keyUpHandler.bind(_assertThisInitialized$1(_this));
    return _this;
  } // TODO: Remove duplicated code in componentDidMount() and componentDidUpdate() methods


  _createClass$1(AlignmentGuides, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Set the dimensions of the bounding box and the draggable boxes when the component mounts.
      if (this.boundingBox.current) {
        var boundingBox = this.boundingBox.current.getBoundingClientRect().toJSON();
        var boxes = {};
        var guides = {}; // Adding the guides for the bounding box to the guides object

        guides.boundingBox = {
          x: calculateGuidePositions(boundingBox, 'x').map(function (value) {
            return value - boundingBox.left;
          }),
          y: calculateGuidePositions(boundingBox, 'y').map(function (value) {
            return value - boundingBox.top;
          })
        };
        this.props.boxes.forEach(function (dimensions, index) {
          boxes["box".concat(index)] = dimensions;
          guides["box".concat(index)] = {
            x: calculateGuidePositions(dimensions, 'x'),
            y: calculateGuidePositions(dimensions, 'y')
          };
        });
        document.addEventListener('click', this.unSelectBox);
        this.setState({
          boundingBox: boundingBox,
          boxes: boxes,
          guides: guides
        });
      }
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate(nextProps, nextState, nextContext) {
      var active = this.state.active; // Set the dimensions of the bounding box and the draggable boxes
      // when the component receives new boxes and/or style props.
      // This is to allow dynamically updating the component by changing the number of boxes,
      // updating existing boxes by external methods or updating the size of the bounding box

      if (nextProps.boxes !== this.props.boxes || nextProps.style !== this.props.style) {
        var boundingBox = this.boundingBox.current.getBoundingClientRect().toJSON();
        var boxes = {};
        var guides = {}; // Adding the guides for the bounding box to the guides object

        guides.boundingBox = {
          x: calculateGuidePositions(boundingBox, 'x').map(function (value) {
            return value - boundingBox.left;
          }),
          y: calculateGuidePositions(boundingBox, 'y').map(function (value) {
            return value - boundingBox.top;
          })
        };
        nextProps.boxes.forEach(function (dimensions, index) {
          boxes["box".concat(index)] = dimensions;
          guides["box".concat(index)] = {
            x: calculateGuidePositions(dimensions, 'x'),
            y: calculateGuidePositions(dimensions, 'y')
          };
        });
        this.setState({
          boundingBox: boundingBox,
          boxes: boxes,
          guides: guides
        });
      }

      if (active && nextProps.boxes[active] !== this.props.boxes[active]) {
        var _boxes = Object.assign({}, this.state.boxes, _defineProperty$2({}, active, Object.assign({}, this.state.boxes[active], {
          x: nextProps.boxes[active].x,
          y: nextProps.boxes[active].y,
          left: nextProps.boxes[active].left,
          top: nextProps.boxes[active].top,
          width: nextProps.boxes[active].width,
          height: nextProps.boxes[active].height
        })));

        var _guides = Object.assign({}, this.state.guides, _defineProperty$2({}, active, Object.assign({}, this.state.guides[active], {
          x: calculateGuidePositions(_boxes[active], 'x'),
          y: calculateGuidePositions(_boxes[active], 'y')
        })));

        this.setState({
          boxes: _boxes,
          guides: _guides
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.removeEventListener('click', this.unSelectBox);
    }
  }, {
    key: "getBoundingBoxElement",
    value: function getBoundingBoxElement() {
      return this.boundingBox;
    }
  }, {
    key: "selectBox",
    value: function selectBox(e) {
      var boundingBox = this.getBoundingBoxElement();
      var boundingBoxPosition = boundingBox.current.getBoundingClientRect().toJSON();

      if (e.target.id.indexOf('box') >= 0) {
        var boxDimensions = e.target.getBoundingClientRect().toJSON();
        var data = {
          x: boxDimensions.x - boundingBoxPosition.x,
          y: boxDimensions.y - boundingBoxPosition.y,
          left: boxDimensions.left - boundingBoxPosition.x,
          top: boxDimensions.top - boundingBoxPosition.y,
          width: boxDimensions.width,
          height: boxDimensions.height,
          node: e.target,
          metadata: this.state.boxes[e.target.id].metadata
        };
        this.setState({
          active: e.target.id
        });
        this.props.onSelect && this.props.onSelect(e, data);
      } else if (e.target.parentNode.id.indexOf('box') >= 0) {
        var _boxDimensions = e.target.parentNode.getBoundingClientRect().toJSON();

        var _data = {
          x: _boxDimensions.x - boundingBoxPosition.x,
          y: _boxDimensions.y - boundingBoxPosition.y,
          left: _boxDimensions.left - boundingBoxPosition.x,
          top: _boxDimensions.top - boundingBoxPosition.y,
          width: _boxDimensions.width,
          height: _boxDimensions.height,
          node: e.target.parentNode,
          metadata: this.state.boxes[e.target.parentNode.id].metadata
        };
        this.setState({
          active: e.target.parentNode.id
        });
        this.props.onSelect && this.props.onSelect(e, _data);
      }
    }
  }, {
    key: "unSelectBox",
    value: function unSelectBox(e) {
      if (e.target.id.indexOf('box') === -1 && e.target.parentNode.id.indexOf('box') === -1) {
        this.setState({
          active: ''
        });
        this.props.onUnselect && this.props.onUnselect(e);
      }
    }
  }, {
    key: "dragStartHandler",
    value: function dragStartHandler(e, data) {
      this.setState({
        active: data.node.id,
        dragging: true
      });
      var newData = Object.assign({}, data, {
        metadata: this.state.boxes[data.node.id].metadata
      });
      this.props.onDragStart && this.props.onDragStart(e, newData);
    }
  }, {
    key: "dragHandler",
    value: function dragHandler(e, data) {
      var _this2 = this;

      if (this.state.dragging) {
        var newData = Object.assign({}, data, {
          metadata: this.state.boxes[this.state.active].metadata
        });
        this.props.onDrag && this.props.onDrag(e, newData);
      }

      var boxes = Object.assign({}, this.state.boxes, _defineProperty$2({}, data.node.id, Object.assign({}, this.state.boxes[data.node.id], {
        x: data.x,
        y: data.y,
        left: data.left,
        top: data.top,
        width: data.width,
        height: data.height
      })));
      var guides = Object.assign({}, this.state.guides, _defineProperty$2({}, data.node.id, Object.assign({}, this.state.guides[data.node.id], {
        x: calculateGuidePositions(boxes[data.node.id], 'x'),
        y: calculateGuidePositions(boxes[data.node.id], 'y')
      })));
      this.setState({
        guidesActive: true,
        boxes: boxes,
        guides: guides
      }, function () {
        if (_this2.props.snap) {
          var match = proximityListener(_this2.state.active, _this2.state.guides);
          var newActiveBoxLeft = _this2.state.boxes[_this2.state.active].left;
          var newActiveBoxTop = _this2.state.boxes[_this2.state.active].top;

          for (var axis in match) {
            var _match$axis = match[axis],
                activeBoxGuides = _match$axis.activeBoxGuides,
                matchedArray = _match$axis.matchedArray,
                proximity = _match$axis.proximity;
            var activeBoxProximityIndex = proximity.activeBoxIndex;
            var matchedBoxProximityIndex = proximity.matchedBoxIndex;

            if (axis === 'x') {
              if (activeBoxGuides[activeBoxProximityIndex] > matchedArray[matchedBoxProximityIndex]) {
                newActiveBoxLeft = _this2.state.boxes[_this2.state.active].left - proximity.value;
              } else {
                newActiveBoxLeft = _this2.state.boxes[_this2.state.active].left + proximity.value;
              }
            } else {
              if (activeBoxGuides[activeBoxProximityIndex] > matchedArray[matchedBoxProximityIndex]) {
                newActiveBoxTop = _this2.state.boxes[_this2.state.active].top - proximity.value;
              } else {
                newActiveBoxTop = _this2.state.boxes[_this2.state.active].top + proximity.value;
              }
            }
          }

          var _boxes2 = Object.assign({}, _this2.state.boxes, _defineProperty$2({}, _this2.state.active, Object.assign({}, _this2.state.boxes[_this2.state.active], {
            left: newActiveBoxLeft,
            top: newActiveBoxTop
          })));

          var _guides2 = Object.assign({}, _this2.state.guides, _defineProperty$2({}, _this2.state.active, Object.assign({}, _this2.state.guides[_this2.state.active], {
            x: calculateGuidePositions(_boxes2[_this2.state.active], 'x'),
            y: calculateGuidePositions(_boxes2[_this2.state.active], 'y')
          })));

          _this2.setState({
            boxes: _boxes2,
            guides: _guides2,
            match: match
          });
        }
      });
    }
  }, {
    key: "dragEndHandler",
    value: function dragEndHandler(e, data) {
      this.setState({
        dragging: false,
        guidesActive: false
      });
      var newData = Object.assign({}, data, {
        metadata: this.state.boxes[this.state.active].metadata
      });
      this.props.onDragEnd && this.props.onDragEnd(e, newData);
    }
  }, {
    key: "resizeStartHandler",
    value: function resizeStartHandler(e, data) {
      this.setState({
        active: data.node.id,
        resizing: true
      });
      var newData = Object.assign({}, data, {
        metadata: this.state.boxes[data.node.id].metadata
      });
      this.props.onResizeStart && this.props.onResizeStart(e, newData);
    }
  }, {
    key: "resizeHandler",
    value: function resizeHandler(e, data) {
      if (this.state.resizing) {
        var newData = Object.assign({}, data, {
          metadata: this.state.boxes[this.state.active].metadata
        });
        this.props.onResize && this.props.onResize(e, newData);
      }

      var boxes = Object.assign({}, this.state.boxes, _defineProperty$2({}, data.node.id, Object.assign({}, this.state.boxes[data.node.id], {
        x: data.x,
        y: data.y,
        left: data.left,
        top: data.top,
        width: data.width,
        height: data.height
      })));
      var guides = Object.assign({}, this.state.guides, _defineProperty$2({}, data.node.id, Object.assign({}, this.state.guides[data.node.id], {
        x: calculateGuidePositions(boxes[data.node.id], 'x'),
        y: calculateGuidePositions(boxes[data.node.id], 'y')
      })));
      this.setState({
        boxes: boxes,
        guides: guides
      });
    }
  }, {
    key: "resizeEndHandler",
    value: function resizeEndHandler(e, data) {
      if (this.state.resizing) {
        var newData = Object.assign({}, data, {
          metadata: this.state.boxes[this.state.active].metadata
        });
        this.props.onResizeEnd && this.props.onResizeEnd(e, newData);
      }

      this.setState({
        resizing: false,
        guidesActive: false
      });
    }
  }, {
    key: "rotateStartHandler",
    value: function rotateStartHandler(e, data) {
      this.setState({
        active: data.node.id,
        rotating: true
      });
      this.props.onRotateStart && this.props.onRotateStart(e, data);
    }
  }, {
    key: "rotateHandler",
    value: function rotateHandler(e, data) {
      var boxes = Object.assign({}, this.state.boxes, _defineProperty$2({}, this.state.active, Object.assign({}, this.state.boxes[this.state.active], _objectSpread$2({}, this.state.boxes[this.state.active], {
        x: data.x,
        y: data.y,
        rotateAngle: data.rotateAngle
      }))));
      this.setState({
        boxes: boxes
      });
      this.props.onRotate && this.props.onRotate(e, data);
    }
  }, {
    key: "rotateEndHandler",
    value: function rotateEndHandler(e, data) {
      this.props.onRotateEnd && this.props.onRotateEnd(e, data);
    }
  }, {
    key: "keyUpHandler",
    value: function keyUpHandler(e, data) {
      var newData = Object.assign({}, data, {
        metadata: this.state.boxes[data.node.id].metadata
      });
      this.props.onKeyUp && this.props.onKeyUp(e, newData);
      var boxes = Object.assign({}, this.state.boxes, _defineProperty$2({}, data.node.id, Object.assign({}, this.state.boxes[data.node.id], {
        x: data.x,
        y: data.y,
        left: data.left,
        top: data.top,
        width: data.width,
        height: data.height
      })));
      var guides = Object.assign({}, this.state.guides, _defineProperty$2({}, data.node.id, Object.assign({}, this.state.guides[data.node.id], {
        x: calculateGuidePositions(boxes[data.node.id], 'x'),
        y: calculateGuidePositions(boxes[data.node.id], 'y')
      })));
      this.setState({
        boxes: boxes,
        guides: guides,
        resizing: false,
        guidesActive: false
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$state = this.state,
          active = _this$state.active,
          boxes = _this$state.boxes,
          guides = _this$state.guides; // Create the draggable boxes from the position data

      var draggableBoxes = Object.keys(boxes).map(function (box, index) {
        var position = boxes[box];
        var id = "box".concat(index);
        return React.createElement(Box, _extends({}, _this3.props, {
          boundingBox: _this3.state.boundingBox,
          dragging: _this3.state.dragging,
          getBoundingBoxElement: _this3.getBoundingBoxElement,
          id: id,
          isSelected: active === id,
          key: id,
          onDragStart: _this3.dragStartHandler,
          onDrag: _this3.dragHandler,
          onDragEnd: _this3.dragEndHandler,
          onKeyUp: _this3.keyUpHandler,
          onResizeStart: _this3.resizeStartHandler,
          onResize: _this3.resizeHandler,
          onResizeEnd: _this3.resizeEndHandler,
          onRotateStart: _this3.rotateStartHandler,
          onRotate: _this3.rotateHandler,
          onRotateEnd: _this3.rotateEndHandler,
          position: position,
          resizing: _this3.state.resizing,
          rotating: _this3.state.rotating,
          selectBox: _this3.selectBox
        }));
      }); // Create a guide(s) when the following conditions are met:
      // 1. A box aligns with another (top, center or bottom)
      // 2. An edge of a box touches any of the edges of another box
      // 3. A box aligns vertically or horizontally with the bounding box
      // TODO: Use a functional component to generate the guides for both axis instead of duplicating code.

      var xAxisGuides = Object.keys(guides).reduce(function (result, box) {
        var guideClassNames = _this3.state.guidesActive ? "".concat(styles.guide, " ").concat(styles.xAxis, " ").concat(styles.active) : "".concat(styles.guide, " ").concat(styles.xAxis);
        var xAxisGuidesForCurrentBox = guides[box].x.map(function (position, index) {
          if (_this3.state.active && _this3.state.active === box && _this3.state.match && _this3.state.match.x && _this3.state.match.x.intersection && _this3.state.match.x.intersection === position) {
            return React.createElement("div", {
              key: "".concat(position, "-").concat(index),
              className: guideClassNames,
              style: {
                left: position
              }
            });
          } else {
            return null;
          }
        });
        return result.concat(xAxisGuidesForCurrentBox);
      }, []);
      var yAxisGuides = Object.keys(guides).reduce(function (result, box) {
        var guideClassNames = _this3.state.guidesActive ? "".concat(styles.guide, " ").concat(styles.yAxis, " ").concat(styles.active) : "".concat(styles.guide, " ").concat(styles.yAxis);
        var yAxisGuidesForCurrentBox = guides[box].y.map(function (position, index) {
          if (_this3.state.active && _this3.state.active === box && _this3.state.match && _this3.state.match.y && _this3.state.match.y.intersection && _this3.state.match.y.intersection === position) {
            return React.createElement("div", {
              key: "".concat(position, "-").concat(index),
              className: guideClassNames,
              style: {
                top: position
              }
            });
          } else {
            return null;
          }
        });
        return result.concat(yAxisGuidesForCurrentBox);
      }, []);
      return React.createElement("div", {
        ref: this.boundingBox,
        className: "".concat(styles.boundingBox, " ").concat(this.props.className),
        style: this.props.style
      }, draggableBoxes, xAxisGuides, yAxisGuides);
    }
  }]);

  return AlignmentGuides;
}(Component); // Typechecking props for AlignmentGuides component


AlignmentGuides.propTypes = {
  boundToParent: PropTypes.bool,
  boxes: PropTypes.array.isRequired,
  boxStyle: PropTypes.object,
  className: PropTypes.string,
  drag: PropTypes.bool,
  keybindings: PropTypes.bool,
  onDragStart: PropTypes.func,
  onDrag: PropTypes.func,
  onDragEnd: PropTypes.func,
  onKeyUp: PropTypes.func,
  onResizeStart: PropTypes.func,
  onResize: PropTypes.func,
  onResizeEnd: PropTypes.func,
  onRotateStart: PropTypes.func,
  onRotate: PropTypes.func,
  onRotateEnd: PropTypes.func,
  onSelect: PropTypes.func,
  onUnselect: PropTypes.func,
  resize: PropTypes.bool,
  rotate: PropTypes.bool,
  resolution: PropTypes.object,
  snap: PropTypes.bool,
  style: PropTypes.object
}; // Default values for props

AlignmentGuides.defaultProps = {
  boundToParent: true,
  boxes: [],
  drag: true,
  resize: true,
  rotate: true,
  snap: true
};

// 	<AlignmentGuides />,
// 	document.getElementById('root')
// );

export default AlignmentGuides;
//# sourceMappingURL=index.es.js.map
