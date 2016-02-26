require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({35:[function(require,module,exports){
'use strict';

var hint = require('hint').maximumWidth = 350;
var telFormat = require('tel-format');
var Mask = require('vanilla-masker');

Mask(document.querySelector('[name="price"]')).maskMoney({
  precision: 2,
  separator: '.',
  delimiter: ','
});
telFormat();

},{"hint":18,"tel-format":26,"vanilla-masker":28}],28:[function(require,module,exports){
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.VMasker = factory();
  }
}(this, function() {
  var DIGIT = "9",
      ALPHA = "A",
      ALPHANUM = "S",
      BY_PASS_KEYS = [9, 16, 17, 18, 36, 37, 38, 39, 40, 91, 92, 93],
      isAllowedKeyCode = function(keyCode) {
        for (var i = 0, len = BY_PASS_KEYS.length; i < len; i++) {
          if (keyCode == BY_PASS_KEYS[i]) {
            return false;
          }
        }
        return true;
      },
      mergeMoneyOptions = function(opts) {
        opts = opts || {};
        opts = {
          precision: opts.hasOwnProperty("precision") ? opts.precision : 2,
          separator: opts.separator || ",",
          delimiter: opts.delimiter || ".",
          unit: opts.unit && (opts.unit.replace(/[\s]/g,'') + " ") || "",
          suffixUnit: opts.suffixUnit && (" " + opts.suffixUnit.replace(/[\s]/g,'')) || "",
          zeroCents: opts.zeroCents,
          lastOutput: opts.lastOutput
        };
        opts.moneyPrecision = opts.zeroCents ? 0 : opts.precision;
        return opts;
      },
      // Fill wildcards past index in output with placeholder
      addPlaceholdersToOutput = function(output, index, placeholder) {
        for (; index < output.length; index++) {
          if(output[index] === DIGIT || output[index] === ALPHA || output[index] === ALPHANUM) {
            output[index] = placeholder;
          }
        }
        return output;
      }
  ;

  var VanillaMasker = function(elements) {
    this.elements = elements;
  };

  VanillaMasker.prototype.unbindElementToMask = function() {
    for (var i = 0, len = this.elements.length; i < len; i++) {
      this.elements[i].lastOutput = "";
      this.elements[i].onkeyup = false;
      this.elements[i].onkeydown = false;

      if (this.elements[i].value.length) {
        this.elements[i].value = this.elements[i].value.replace(/\D/g, '');
      }
    }
  };

  VanillaMasker.prototype.bindElementToMask = function(maskFunction) {
    var that = this,
        onType = function(e) {
          e = e || window.event;
          var source = e.target || e.srcElement;

          if (isAllowedKeyCode(e.keyCode)) {
            setTimeout(function() {
              that.opts.lastOutput = source.lastOutput;
              source.value = VMasker[maskFunction](source.value, that.opts);
              source.lastOutput = source.value;
              if (source.setSelectionRange && that.opts.suffixUnit) {
                source.setSelectionRange(source.value.length, (source.value.length - that.opts.suffixUnit.length));
              }
            }, 0);
          }
        }
    ;
    for (var i = 0, len = this.elements.length; i < len; i++) {
      this.elements[i].lastOutput = "";
      this.elements[i].onkeyup = onType;
      if (this.elements[i].value.length) {
        this.elements[i].value = VMasker[maskFunction](this.elements[i].value, this.opts);
      }
    }
  };

  VanillaMasker.prototype.maskMoney = function(opts) {
    this.opts = mergeMoneyOptions(opts);
    this.bindElementToMask("toMoney");
  };

  VanillaMasker.prototype.maskNumber = function() {
    this.opts = {};
    this.bindElementToMask("toNumber");
  };
  
  VanillaMasker.prototype.maskAlphaNum = function() {
    this.opts = {};
    this.bindElementToMask("toAlphaNumeric");
  };

  VanillaMasker.prototype.maskPattern = function(pattern) {
    this.opts = {pattern: pattern};
    this.bindElementToMask("toPattern");
  };

  VanillaMasker.prototype.unMask = function() {
    this.unbindElementToMask();
  };

  var VMasker = function(el) {
    if (!el) {
      throw new Error("VanillaMasker: There is no element to bind.");
    }
    var elements = ("length" in el) ? (el.length ? el : []) : [el];
    return new VanillaMasker(elements);
  };

  VMasker.toMoney = function(value, opts) {
    opts = mergeMoneyOptions(opts);
    if (opts.zeroCents) {
      opts.lastOutput = opts.lastOutput || "";
      var zeroMatcher = ("("+ opts.separator +"[0]{0,"+ opts.precision +"})"),
          zeroRegExp = new RegExp(zeroMatcher, "g"),
          digitsLength = value.toString().replace(/[\D]/g, "").length || 0,
          lastDigitLength = opts.lastOutput.toString().replace(/[\D]/g, "").length || 0
      ;
      value = value.toString().replace(zeroRegExp, "");
      if (digitsLength < lastDigitLength) {
        value = value.slice(0, value.length - 1);
      }
    }
    var number = value.toString().replace(/[\D]/g, ""),
        clearDelimiter = new RegExp("^(0|\\"+ opts.delimiter +")"),
        clearSeparator = new RegExp("(\\"+ opts.separator +")$"),
        money = number.substr(0, number.length - opts.moneyPrecision),
        masked = money.substr(0, money.length % 3),
        cents = new Array(opts.precision + 1).join("0")
    ;
    money = money.substr(money.length % 3, money.length);
    for (var i = 0, len = money.length; i < len; i++) {
      if (i % 3 === 0) {
        masked += opts.delimiter;
      }
      masked += money[i];
    }
    masked = masked.replace(clearDelimiter, "");
    masked = masked.length ? masked : "0";
    if (!opts.zeroCents) {
      var beginCents = number.length - opts.precision,
          centsValue = number.substr(beginCents, opts.precision),
          centsLength = centsValue.length,
          centsSliced = (opts.precision > centsLength) ? opts.precision : centsLength
      ;
      cents = (cents + centsValue).slice(-centsSliced);
    }
    var output = opts.unit + masked + opts.separator + cents + opts.suffixUnit;
    return output.replace(clearSeparator, "");
  };

  VMasker.toPattern = function(value, opts) {
    var pattern = (typeof opts === 'object' ? opts.pattern : opts),
        patternChars = pattern.replace(/\W/g, ''),
        output = pattern.split(""),
        values = value.toString().replace(/\W/g, ""),
        charsValues = values.replace(/\W/g, ''),
        index = 0,
        i,
        outputLength = output.length,
        placeholder = (typeof opts === 'object' ? opts.placeholder : undefined)
    ;
    
    for (i = 0; i < outputLength; i++) {
      // Reached the end of input
      if (index >= values.length) {
        if (patternChars.length == charsValues.length) {
          return output.join("");
        }
        else if ((placeholder !== undefined) && (patternChars.length > charsValues.length)) {
          return addPlaceholdersToOutput(output, i, placeholder).join("");
        }
        else {
          break;
        }
      }
      // Remaining chars in input
      else{
        if ((output[i] === DIGIT && values[index].match(/[0-9]/)) ||
            (output[i] === ALPHA && values[index].match(/[a-zA-Z]/)) ||
            (output[i] === ALPHANUM && values[index].match(/[0-9a-zA-Z]/))) {
          output[i] = values[index++];
        } else if (output[i] === DIGIT || output[i] === ALPHA || output[i] === ALPHANUM) {
          if(placeholder !== undefined){
            return addPlaceholdersToOutput(output, i, placeholder).join("");
          }
          else{
            return output.slice(0, i).join("");
          }
        }
      }
    }
    return output.join("").substr(0, i);
  };

  VMasker.toNumber = function(value) {
    return value.toString().replace(/(?!^-)[^0-9]/g, "");
  };
  
  VMasker.toAlphaNumeric = function(value) {
    return value.toString().replace(/[^a-z0-9 ]+/i, "");
  };

  return VMasker;
}));

},{}],26:[function(require,module,exports){
// Tel Format
//
// Use: A small JavaScript function to automatically format telephone numbers as a user types in a phone number in a tel input field.
//
// -------------------------------------------------------------------------------

module.exports = function(){
  'use strict';
  var input = document.getElementsByTagName('input');
  for (var i = 0; i < input.length; i++){
    var type = input[i].type;
    if(type === 'tel'){
      input[i].addEventListener('keydown', telFormat);
    }
  }

  function telFormat(e){
    var curchr    = this.value.length,
      curval      = this.value;
    if (e.keyCode !== 189 && e.keyCode !== 32 && e.keyCode !== 8) {
      if(curchr === 3){
        this.value = '(' + curval + ')' + '-';
      }else if (curchr === 9 && e.keyCode !== 8) {
        this.value = curval + '-';
      }
    }else if(e.keyCode === 8){
      if(curchr === 4){
        var removeFormat = curval.replace('(', '');
        this.value = removeFormat;
      }else if(curchr === 10){
        var removeDash = curval.replace(/-([^-]*)$/,'$1');
        this.value = removeDash;
      }
    }else {
      e.preventDefault();
    }
  }
};
},{}],18:[function(require,module,exports){
'use strict';

var insertRule = require('insert-rule').context('hint');
var events = require('./events');
var expando = 'hint-' + Date.now();
var api = {
  maximumWidth: 650
};

events.add(document.body, 'mouseover', enter);
events.add(document.body, 'mouseout', leave);

function enter (e) {
  var prev = scan(e.fromElement);
  var elem = scan(e.target);
  if (elem && elem !== prev) {
    move(elem);
  }
}

function leave (e) {
  var next = scan(e.toElement);
  var elem = scan(e.target);
  if (elem && elem !== next) {
    clear(elem);
  }
}

function scan (elem) {
  while (elem) {
    if (probe(elem)) {
      return elem;
    }
    elem = elem.parentElement;
  }
}

function probe (elem) {
  return elem.getAttribute('aria-label') || elem.getAttribute('data-hint');
}

function expandex () {
  return expando + Date.now();
}

function i (px) {
  var raw = px.replace('px', '');
  return parseInt(raw, 10);
}

function getPseudo (elem) {
  return elem.className.indexOf('hint-before') !== -1 ? ':before' : ':after';
}

function move (elem) {
  var totalWidth = innerWidth;
  var pseudo = getPseudo(elem);
  var c = getComputedStyle(elem, pseudo);
  var existed = elem.getAttribute('id');
  var id = existed || expandex();
  if (id.indexOf(expando) === 0) {
    elem.setAttribute('id', id);
  }

  var selector = '#' + id + pseudo;
  var rect = elem.getBoundingClientRect();
  var paddings = i(c.paddingLeft) + i(c.paddingRight) + i(c.marginLeft) + i(c.marginRight);
  var width;
  var left;
  var right = rect.left + i(c.width) + i(c.left) + paddings;
  var collapse;
  var offset;
  var margin = 20;
  var max = api.maximumWidth === 'auto' ? Infinity : api.maximumWidth;

  if (i(c.width) + margin > totalWidth) {
    collapse = totalWidth - margin > max;
    width = collapse ? max : totalWidth - margin;
    offset = collapse ? totalWidth - max - margin : 0;
    left = -(rect.left + paddings) + offset;

    insertRule(selector, {
      width: width + 'px',
      left: left - 15 + 'px',
      whiteSpace: 'inherit'
    });
  } else if (right + margin > totalWidth) {
    insertRule(selector, {
      left: totalWidth - right + margin + 'px'
    });
  }
  transparent();
  setTimeout(opaque, 500);

  function transparent () {
    insertRule(selector, { opacity: 0 });
  }
  function opaque () {
    insertRule(selector, transition({
      opacity: 1
    }));
  }
  function transition (css) {
    var rule = 'transition';
    var prefixes = ['', '-webkit-', '-moz-', '-o-', '-ms-'];
    function add (prefix) {
      css[prefix + rule] = 'opacity 0.3s ease-in-out';
    }
    prefixes.forEach(add);
    return css;
  }
}

function clear (elem) {
  var pseudo = getPseudo(elem);
  var id = elem.id;
  if (id.indexOf(expando) === 0) {
    elem.removeAttribute('id');
  }
  var selector = '#' + id + pseudo;
  insertRule.remove(selector);
}

module.exports = api;

},{"./events":17,"insert-rule":22}],22:[function(require,module,exports){
'use strict';

require('./object-keys');
require('./array-map');

var camel = /([a-z])([A-Z])/g;
var hyphens = '$1-$2';
var contexts = {};

function parseStyles (styles) {
  if (typeof styles === 'string') {
    return styles;
  }
  if (Object.prototype.toString.call(styles) !== '[object Object]') {
    return '';
  }
  return Object.keys(styles).map(function (key) {
    var prop = key.replace(camel, hyphens).toLowerCase();
    return prop + ':' + styles[key];
  }).join(';');
}

function context (name) {
  if (contexts[name]) {
    return contexts[name];
  }
  var cache;
  var rules;
  var remove;

  function getStylesheet () {
    if (cache) {
      return cache;
    }
    var style = document.createElement('style');
    document.body.appendChild(style);
    style.setAttribute('data-context', name);
    cache = document.styleSheets[document.styleSheets.length - 1];
    rules = cache.cssRules ? 'cssRules' : 'rules';
    remove = cache.removeRule ? 'removeRule' : 'deleteRule';
    return cache;
  }

  function add (selector, styles) {
    var css = parseStyles(styles);
    var sheet = getStylesheet();
    var len = sheet[rules].length;
    if (sheet.insertRule) {
      sheet.insertRule(selector + '{' + css + '}', len);
    } else if (sheet.addRule) {
      sheet.addRule(selector, css, len);
    }
  }

  function remove (selector) {
    var sheet = getStylesheet();
    var length = sheet[rules].length;
    var i;
    for (i = length - 1; i >= 0; i--) {
      if (sheet[rules][i].selectorText === selector) {
        sheet[remove](i);
      }
    }
  }

  function clear () {
    var sheet = getStylesheet();
    while (sheet[rules].length) {
      sheet[remove](0);
    }
  }

  add.clear = clear;
  add.remove = remove;
  contexts[name] = add;
  return contexts[name];
}

var ctx = context('default');
ctx.context = context;
module.exports = ctx;

},{"./array-map":21,"./object-keys":23}],23:[function(require,module,exports){
if (!Object.keys) {
  Object.keys = (function () {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString');
    var dontEnums = [
      'toString',
      'toLocaleString',
      'valueOf',
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'constructor'
    ];
    var dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [];
      var prop;
      var i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

},{}],21:[function(require,module,exports){
if (!Array.prototype.map) {
  Array.prototype.map = function (fn) {
    'use strict';

    if (this === void 0 || this === null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fn !== 'function') {
      throw new TypeError();
    }

    var res = new Array(len);
    var ctx = arguments.length >= 2 ? arguments[1] : void 0;
    var i;
    for (i = 0; i < len; i++) {
      if (i in t) {
        res[i] = fn.call(ctx, t[i], i, t);
      }
    }

    return res;
  };
}

},{}],17:[function(require,module,exports){
'use strict';

var addEvent = addEventEasy;
var removeEvent = removeEventEasy;

if (!window.addEventListener) {
  addEvent = addEventHard;
}

if (!window.removeEventListener) {
  removeEvent = removeEventHard;
}

function addEventEasy (element, evt, fn) {
  return element.addEventListener(evt, fn);
}

function addEventHard (element, evt, fn) {
  return element.attachEvent('on' + evt, function (e) {
    e = e || window.event;
    e.target = e.target || e.srcElement;
    e.preventDefault  = e.preventDefault  || function preventDefault () { e.returnValue = false; };
    e.stopPropagation = e.stopPropagation || function stopPropagation () { e.cancelBubble = true; };
    fn.call(element, e);
  });
}

function removeEventEasy (element, evt, fn) {
  return element.removeEventListener(evt, fn);
}

function removeEventHard (element, evt, fn) {
  return element.detachEvent('on' + evt, fn);
}

module.exports = {
  add: addEvent,
  remove: removeEvent
};

},{}]},{},[35]);
