/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/scripts/script.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/flatpickr/dist/flatpickr.js":
/*!**************************************************!*\
  !*** ./node_modules/flatpickr/dist/flatpickr.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* flatpickr v4.6.6, @license MIT */
(function (global, factory) {
     true ? module.exports = factory() :
    undefined;
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    var HOOKS = [
        "onChange",
        "onClose",
        "onDayCreate",
        "onDestroy",
        "onKeyDown",
        "onMonthChange",
        "onOpen",
        "onParseConfig",
        "onReady",
        "onValueUpdate",
        "onYearChange",
        "onPreCalendarPosition",
    ];
    var defaults = {
        _disable: [],
        _enable: [],
        allowInput: false,
        allowInvalidPreload: false,
        altFormat: "F j, Y",
        altInput: false,
        altInputClass: "form-control input",
        animate: typeof window === "object" &&
            window.navigator.userAgent.indexOf("MSIE") === -1,
        ariaDateFormat: "F j, Y",
        autoFillDefaultTime: true,
        clickOpens: true,
        closeOnSelect: true,
        conjunction: ", ",
        dateFormat: "Y-m-d",
        defaultHour: 12,
        defaultMinute: 0,
        defaultSeconds: 0,
        disable: [],
        disableMobile: false,
        enable: [],
        enableSeconds: false,
        enableTime: false,
        errorHandler: function (err) {
            return typeof console !== "undefined" && console.warn(err);
        },
        getWeek: function (givenDate) {
            var date = new Date(givenDate.getTime());
            date.setHours(0, 0, 0, 0);
            // Thursday in current week decides the year.
            date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
            // January 4 is always in week 1.
            var week1 = new Date(date.getFullYear(), 0, 4);
            // Adjust to Thursday in week 1 and count number of weeks from date to week1.
            return (1 +
                Math.round(((date.getTime() - week1.getTime()) / 86400000 -
                    3 +
                    ((week1.getDay() + 6) % 7)) /
                    7));
        },
        hourIncrement: 1,
        ignoredFocusElements: [],
        inline: false,
        locale: "default",
        minuteIncrement: 5,
        mode: "single",
        monthSelectorType: "dropdown",
        nextArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",
        noCalendar: false,
        now: new Date(),
        onChange: [],
        onClose: [],
        onDayCreate: [],
        onDestroy: [],
        onKeyDown: [],
        onMonthChange: [],
        onOpen: [],
        onParseConfig: [],
        onReady: [],
        onValueUpdate: [],
        onYearChange: [],
        onPreCalendarPosition: [],
        plugins: [],
        position: "auto",
        positionElement: undefined,
        prevArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",
        shorthandCurrentMonth: false,
        showMonths: 1,
        static: false,
        time_24hr: false,
        weekNumbers: false,
        wrap: false,
    };

    var english = {
        weekdays: {
            shorthand: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            longhand: [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
            ],
        },
        months: {
            shorthand: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ],
            longhand: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ],
        },
        daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        firstDayOfWeek: 0,
        ordinal: function (nth) {
            var s = nth % 100;
            if (s > 3 && s < 21)
                return "th";
            switch (s % 10) {
                case 1:
                    return "st";
                case 2:
                    return "nd";
                case 3:
                    return "rd";
                default:
                    return "th";
            }
        },
        rangeSeparator: " to ",
        weekAbbreviation: "Wk",
        scrollTitle: "Scroll to increment",
        toggleTitle: "Click to toggle",
        amPM: ["AM", "PM"],
        yearAriaLabel: "Year",
        monthAriaLabel: "Month",
        hourAriaLabel: "Hour",
        minuteAriaLabel: "Minute",
        time_24hr: false,
    };

    var pad = function (number, length) {
        if (length === void 0) { length = 2; }
        return ("000" + number).slice(length * -1);
    };
    var int = function (bool) { return (bool === true ? 1 : 0); };
    /* istanbul ignore next */
    function debounce(func, wait, immediate) {
        if (immediate === void 0) { immediate = false; }
        var timeout;
        return function () {
            var context = this, args = arguments;
            timeout !== null && clearTimeout(timeout);
            timeout = window.setTimeout(function () {
                timeout = null;
                if (!immediate)
                    func.apply(context, args);
            }, wait);
            if (immediate && !timeout)
                func.apply(context, args);
        };
    }
    var arrayify = function (obj) {
        return obj instanceof Array ? obj : [obj];
    };

    function toggleClass(elem, className, bool) {
        if (bool === true)
            return elem.classList.add(className);
        elem.classList.remove(className);
    }
    function createElement(tag, className, content) {
        var e = window.document.createElement(tag);
        className = className || "";
        content = content || "";
        e.className = className;
        if (content !== undefined)
            e.textContent = content;
        return e;
    }
    function clearNode(node) {
        while (node.firstChild)
            node.removeChild(node.firstChild);
    }
    function findParent(node, condition) {
        if (condition(node))
            return node;
        else if (node.parentNode)
            return findParent(node.parentNode, condition);
        return undefined; // nothing found
    }
    function createNumberInput(inputClassName, opts) {
        var wrapper = createElement("div", "numInputWrapper"), numInput = createElement("input", "numInput " + inputClassName), arrowUp = createElement("span", "arrowUp"), arrowDown = createElement("span", "arrowDown");
        if (navigator.userAgent.indexOf("MSIE 9.0") === -1) {
            numInput.type = "number";
        }
        else {
            numInput.type = "text";
            numInput.pattern = "\\d*";
        }
        if (opts !== undefined)
            for (var key in opts)
                numInput.setAttribute(key, opts[key]);
        wrapper.appendChild(numInput);
        wrapper.appendChild(arrowUp);
        wrapper.appendChild(arrowDown);
        return wrapper;
    }
    function getEventTarget(event) {
        try {
            if (typeof event.composedPath === "function") {
                var path = event.composedPath();
                return path[0];
            }
            return event.target;
        }
        catch (error) {
            return event.target;
        }
    }

    var doNothing = function () { return undefined; };
    var monthToStr = function (monthNumber, shorthand, locale) { return locale.months[shorthand ? "shorthand" : "longhand"][monthNumber]; };
    var revFormat = {
        D: doNothing,
        F: function (dateObj, monthName, locale) {
            dateObj.setMonth(locale.months.longhand.indexOf(monthName));
        },
        G: function (dateObj, hour) {
            dateObj.setHours(parseFloat(hour));
        },
        H: function (dateObj, hour) {
            dateObj.setHours(parseFloat(hour));
        },
        J: function (dateObj, day) {
            dateObj.setDate(parseFloat(day));
        },
        K: function (dateObj, amPM, locale) {
            dateObj.setHours((dateObj.getHours() % 12) +
                12 * int(new RegExp(locale.amPM[1], "i").test(amPM)));
        },
        M: function (dateObj, shortMonth, locale) {
            dateObj.setMonth(locale.months.shorthand.indexOf(shortMonth));
        },
        S: function (dateObj, seconds) {
            dateObj.setSeconds(parseFloat(seconds));
        },
        U: function (_, unixSeconds) { return new Date(parseFloat(unixSeconds) * 1000); },
        W: function (dateObj, weekNum, locale) {
            var weekNumber = parseInt(weekNum);
            var date = new Date(dateObj.getFullYear(), 0, 2 + (weekNumber - 1) * 7, 0, 0, 0, 0);
            date.setDate(date.getDate() - date.getDay() + locale.firstDayOfWeek);
            return date;
        },
        Y: function (dateObj, year) {
            dateObj.setFullYear(parseFloat(year));
        },
        Z: function (_, ISODate) { return new Date(ISODate); },
        d: function (dateObj, day) {
            dateObj.setDate(parseFloat(day));
        },
        h: function (dateObj, hour) {
            dateObj.setHours(parseFloat(hour));
        },
        i: function (dateObj, minutes) {
            dateObj.setMinutes(parseFloat(minutes));
        },
        j: function (dateObj, day) {
            dateObj.setDate(parseFloat(day));
        },
        l: doNothing,
        m: function (dateObj, month) {
            dateObj.setMonth(parseFloat(month) - 1);
        },
        n: function (dateObj, month) {
            dateObj.setMonth(parseFloat(month) - 1);
        },
        s: function (dateObj, seconds) {
            dateObj.setSeconds(parseFloat(seconds));
        },
        u: function (_, unixMillSeconds) {
            return new Date(parseFloat(unixMillSeconds));
        },
        w: doNothing,
        y: function (dateObj, year) {
            dateObj.setFullYear(2000 + parseFloat(year));
        },
    };
    var tokenRegex = {
        D: "(\\w+)",
        F: "(\\w+)",
        G: "(\\d\\d|\\d)",
        H: "(\\d\\d|\\d)",
        J: "(\\d\\d|\\d)\\w+",
        K: "",
        M: "(\\w+)",
        S: "(\\d\\d|\\d)",
        U: "(.+)",
        W: "(\\d\\d|\\d)",
        Y: "(\\d{4})",
        Z: "(.+)",
        d: "(\\d\\d|\\d)",
        h: "(\\d\\d|\\d)",
        i: "(\\d\\d|\\d)",
        j: "(\\d\\d|\\d)",
        l: "(\\w+)",
        m: "(\\d\\d|\\d)",
        n: "(\\d\\d|\\d)",
        s: "(\\d\\d|\\d)",
        u: "(.+)",
        w: "(\\d\\d|\\d)",
        y: "(\\d{2})",
    };
    var formats = {
        // get the date in UTC
        Z: function (date) { return date.toISOString(); },
        // weekday name, short, e.g. Thu
        D: function (date, locale, options) {
            return locale.weekdays.shorthand[formats.w(date, locale, options)];
        },
        // full month name e.g. January
        F: function (date, locale, options) {
            return monthToStr(formats.n(date, locale, options) - 1, false, locale);
        },
        // padded hour 1-12
        G: function (date, locale, options) {
            return pad(formats.h(date, locale, options));
        },
        // hours with leading zero e.g. 03
        H: function (date) { return pad(date.getHours()); },
        // day (1-30) with ordinal suffix e.g. 1st, 2nd
        J: function (date, locale) {
            return locale.ordinal !== undefined
                ? date.getDate() + locale.ordinal(date.getDate())
                : date.getDate();
        },
        // AM/PM
        K: function (date, locale) { return locale.amPM[int(date.getHours() > 11)]; },
        // shorthand month e.g. Jan, Sep, Oct, etc
        M: function (date, locale) {
            return monthToStr(date.getMonth(), true, locale);
        },
        // seconds 00-59
        S: function (date) { return pad(date.getSeconds()); },
        // unix timestamp
        U: function (date) { return date.getTime() / 1000; },
        W: function (date, _, options) {
            return options.getWeek(date);
        },
        // full year e.g. 2016, padded (0001-9999)
        Y: function (date) { return pad(date.getFullYear(), 4); },
        // day in month, padded (01-30)
        d: function (date) { return pad(date.getDate()); },
        // hour from 1-12 (am/pm)
        h: function (date) { return (date.getHours() % 12 ? date.getHours() % 12 : 12); },
        // minutes, padded with leading zero e.g. 09
        i: function (date) { return pad(date.getMinutes()); },
        // day in month (1-30)
        j: function (date) { return date.getDate(); },
        // weekday name, full, e.g. Thursday
        l: function (date, locale) {
            return locale.weekdays.longhand[date.getDay()];
        },
        // padded month number (01-12)
        m: function (date) { return pad(date.getMonth() + 1); },
        // the month number (1-12)
        n: function (date) { return date.getMonth() + 1; },
        // seconds 0-59
        s: function (date) { return date.getSeconds(); },
        // Unix Milliseconds
        u: function (date) { return date.getTime(); },
        // number of the day of the week
        w: function (date) { return date.getDay(); },
        // last two digits of year e.g. 16 for 2016
        y: function (date) { return String(date.getFullYear()).substring(2); },
    };

    var createDateFormatter = function (_a) {
        var _b = _a.config, config = _b === void 0 ? defaults : _b, _c = _a.l10n, l10n = _c === void 0 ? english : _c, _d = _a.isMobile, isMobile = _d === void 0 ? false : _d;
        return function (dateObj, frmt, overrideLocale) {
            var locale = overrideLocale || l10n;
            if (config.formatDate !== undefined && !isMobile) {
                return config.formatDate(dateObj, frmt, locale);
            }
            return frmt
                .split("")
                .map(function (c, i, arr) {
                return formats[c] && arr[i - 1] !== "\\"
                    ? formats[c](dateObj, locale, config)
                    : c !== "\\"
                        ? c
                        : "";
            })
                .join("");
        };
    };
    var createDateParser = function (_a) {
        var _b = _a.config, config = _b === void 0 ? defaults : _b, _c = _a.l10n, l10n = _c === void 0 ? english : _c;
        return function (date, givenFormat, timeless, customLocale) {
            if (date !== 0 && !date)
                return undefined;
            var locale = customLocale || l10n;
            var parsedDate;
            var dateOrig = date;
            if (date instanceof Date)
                parsedDate = new Date(date.getTime());
            else if (typeof date !== "string" &&
                date.toFixed !== undefined // timestamp
            )
                // create a copy
                parsedDate = new Date(date);
            else if (typeof date === "string") {
                // date string
                var format = givenFormat || (config || defaults).dateFormat;
                var datestr = String(date).trim();
                if (datestr === "today") {
                    parsedDate = new Date();
                    timeless = true;
                }
                else if (/Z$/.test(datestr) ||
                    /GMT$/.test(datestr) // datestrings w/ timezone
                )
                    parsedDate = new Date(date);
                else if (config && config.parseDate)
                    parsedDate = config.parseDate(date, format);
                else {
                    parsedDate =
                        !config || !config.noCalendar
                            ? new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0)
                            : new Date(new Date().setHours(0, 0, 0, 0));
                    var matched = void 0, ops = [];
                    for (var i = 0, matchIndex = 0, regexStr = ""; i < format.length; i++) {
                        var token_1 = format[i];
                        var isBackSlash = token_1 === "\\";
                        var escaped = format[i - 1] === "\\" || isBackSlash;
                        if (tokenRegex[token_1] && !escaped) {
                            regexStr += tokenRegex[token_1];
                            var match = new RegExp(regexStr).exec(date);
                            if (match && (matched = true)) {
                                ops[token_1 !== "Y" ? "push" : "unshift"]({
                                    fn: revFormat[token_1],
                                    val: match[++matchIndex],
                                });
                            }
                        }
                        else if (!isBackSlash)
                            regexStr += "."; // don't really care
                        ops.forEach(function (_a) {
                            var fn = _a.fn, val = _a.val;
                            return (parsedDate = fn(parsedDate, val, locale) || parsedDate);
                        });
                    }
                    parsedDate = matched ? parsedDate : undefined;
                }
            }
            /* istanbul ignore next */
            if (!(parsedDate instanceof Date && !isNaN(parsedDate.getTime()))) {
                config.errorHandler(new Error("Invalid date provided: " + dateOrig));
                return undefined;
            }
            if (timeless === true)
                parsedDate.setHours(0, 0, 0, 0);
            return parsedDate;
        };
    };
    /**
     * Compute the difference in dates, measured in ms
     */
    function compareDates(date1, date2, timeless) {
        if (timeless === void 0) { timeless = true; }
        if (timeless !== false) {
            return (new Date(date1.getTime()).setHours(0, 0, 0, 0) -
                new Date(date2.getTime()).setHours(0, 0, 0, 0));
        }
        return date1.getTime() - date2.getTime();
    }
    var isBetween = function (ts, ts1, ts2) {
        return ts > Math.min(ts1, ts2) && ts < Math.max(ts1, ts2);
    };
    var duration = {
        DAY: 86400000,
    };

    if (typeof Object.assign !== "function") {
        Object.assign = function (target) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (!target) {
                throw TypeError("Cannot convert undefined or null to object");
            }
            var _loop_1 = function (source) {
                if (source) {
                    Object.keys(source).forEach(function (key) { return (target[key] = source[key]); });
                }
            };
            for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
                var source = args_1[_a];
                _loop_1(source);
            }
            return target;
        };
    }

    var DEBOUNCED_CHANGE_MS = 300;
    function FlatpickrInstance(element, instanceConfig) {
        var self = {
            config: __assign(__assign({}, defaults), flatpickr.defaultConfig),
            l10n: english,
        };
        self.parseDate = createDateParser({ config: self.config, l10n: self.l10n });
        self._handlers = [];
        self.pluginElements = [];
        self.loadedPlugins = [];
        self._bind = bind;
        self._setHoursFromDate = setHoursFromDate;
        self._positionCalendar = positionCalendar;
        self.changeMonth = changeMonth;
        self.changeYear = changeYear;
        self.clear = clear;
        self.close = close;
        self._createElement = createElement;
        self.destroy = destroy;
        self.isEnabled = isEnabled;
        self.jumpToDate = jumpToDate;
        self.open = open;
        self.redraw = redraw;
        self.set = set;
        self.setDate = setDate;
        self.toggle = toggle;
        function setupHelperFunctions() {
            self.utils = {
                getDaysInMonth: function (month, yr) {
                    if (month === void 0) { month = self.currentMonth; }
                    if (yr === void 0) { yr = self.currentYear; }
                    if (month === 1 && ((yr % 4 === 0 && yr % 100 !== 0) || yr % 400 === 0))
                        return 29;
                    return self.l10n.daysInMonth[month];
                },
            };
        }
        function init() {
            self.element = self.input = element;
            self.isOpen = false;
            parseConfig();
            setupLocale();
            setupInputs();
            setupDates();
            setupHelperFunctions();
            if (!self.isMobile)
                build();
            bindEvents();
            if (self.selectedDates.length || self.config.noCalendar) {
                if (self.config.enableTime) {
                    setHoursFromDate(self.config.noCalendar
                        ? self.latestSelectedDateObj || self.config.minDate
                        : undefined);
                }
                updateValue(false);
            }
            setCalendarWidth();
            var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            /* TODO: investigate this further
        
              Currently, there is weird positioning behavior in safari causing pages
              to scroll up. https://github.com/chmln/flatpickr/issues/563
        
              However, most browsers are not Safari and positioning is expensive when used
              in scale. https://github.com/chmln/flatpickr/issues/1096
            */
            if (!self.isMobile && isSafari) {
                positionCalendar();
            }
            triggerEvent("onReady");
        }
        function bindToInstance(fn) {
            return fn.bind(self);
        }
        function setCalendarWidth() {
            var config = self.config;
            if (config.weekNumbers === false && config.showMonths === 1) {
                return;
            }
            else if (config.noCalendar !== true) {
                window.requestAnimationFrame(function () {
                    if (self.calendarContainer !== undefined) {
                        self.calendarContainer.style.visibility = "hidden";
                        self.calendarContainer.style.display = "block";
                    }
                    if (self.daysContainer !== undefined) {
                        var daysWidth = (self.days.offsetWidth + 1) * config.showMonths;
                        self.daysContainer.style.width = daysWidth + "px";
                        self.calendarContainer.style.width =
                            daysWidth +
                                (self.weekWrapper !== undefined
                                    ? self.weekWrapper.offsetWidth
                                    : 0) +
                                "px";
                        self.calendarContainer.style.removeProperty("visibility");
                        self.calendarContainer.style.removeProperty("display");
                    }
                });
            }
        }
        /**
         * The handler for all events targeting the time inputs
         */
        function updateTime(e) {
            if (self.selectedDates.length === 0) {
                var defaultDate = self.config.minDate !== undefined
                    ? new Date(self.config.minDate.getTime())
                    : new Date();
                var _a = getDefaultHours(), hours = _a.hours, minutes = _a.minutes, seconds = _a.seconds;
                defaultDate.setHours(hours, minutes, seconds, 0);
                self.setDate(defaultDate, false);
            }
            if (e !== undefined && e.type !== "blur") {
                timeWrapper(e);
            }
            var prevValue = self._input.value;
            setHoursFromInputs();
            updateValue();
            if (self._input.value !== prevValue) {
                self._debouncedChange();
            }
        }
        function ampm2military(hour, amPM) {
            return (hour % 12) + 12 * int(amPM === self.l10n.amPM[1]);
        }
        function military2ampm(hour) {
            switch (hour % 24) {
                case 0:
                case 12:
                    return 12;
                default:
                    return hour % 12;
            }
        }
        /**
         * Syncs the selected date object time with user's time input
         */
        function setHoursFromInputs() {
            if (self.hourElement === undefined || self.minuteElement === undefined)
                return;
            var hours = (parseInt(self.hourElement.value.slice(-2), 10) || 0) % 24, minutes = (parseInt(self.minuteElement.value, 10) || 0) % 60, seconds = self.secondElement !== undefined
                ? (parseInt(self.secondElement.value, 10) || 0) % 60
                : 0;
            if (self.amPM !== undefined) {
                hours = ampm2military(hours, self.amPM.textContent);
            }
            var limitMinHours = self.config.minTime !== undefined ||
                (self.config.minDate &&
                    self.minDateHasTime &&
                    self.latestSelectedDateObj &&
                    compareDates(self.latestSelectedDateObj, self.config.minDate, true) ===
                        0);
            var limitMaxHours = self.config.maxTime !== undefined ||
                (self.config.maxDate &&
                    self.maxDateHasTime &&
                    self.latestSelectedDateObj &&
                    compareDates(self.latestSelectedDateObj, self.config.maxDate, true) ===
                        0);
            if (limitMaxHours) {
                var maxTime = self.config.maxTime !== undefined
                    ? self.config.maxTime
                    : self.config.maxDate;
                hours = Math.min(hours, maxTime.getHours());
                if (hours === maxTime.getHours())
                    minutes = Math.min(minutes, maxTime.getMinutes());
                if (minutes === maxTime.getMinutes())
                    seconds = Math.min(seconds, maxTime.getSeconds());
            }
            if (limitMinHours) {
                var minTime = self.config.minTime !== undefined
                    ? self.config.minTime
                    : self.config.minDate;
                hours = Math.max(hours, minTime.getHours());
                if (hours === minTime.getHours())
                    minutes = Math.max(minutes, minTime.getMinutes());
                if (minutes === minTime.getMinutes())
                    seconds = Math.max(seconds, minTime.getSeconds());
            }
            setHours(hours, minutes, seconds);
        }
        /**
         * Syncs time input values with a date
         */
        function setHoursFromDate(dateObj) {
            var date = dateObj || self.latestSelectedDateObj;
            if (date) {
                setHours(date.getHours(), date.getMinutes(), date.getSeconds());
            }
        }
        function getDefaultHours() {
            var hours = self.config.defaultHour;
            var minutes = self.config.defaultMinute;
            var seconds = self.config.defaultSeconds;
            if (self.config.minDate !== undefined) {
                var minHr = self.config.minDate.getHours();
                var minMinutes = self.config.minDate.getMinutes();
                hours = Math.max(hours, minHr);
                if (hours === minHr)
                    minutes = Math.max(minMinutes, minutes);
                if (hours === minHr && minutes === minMinutes)
                    seconds = self.config.minDate.getSeconds();
            }
            if (self.config.maxDate !== undefined) {
                var maxHr = self.config.maxDate.getHours();
                var maxMinutes = self.config.maxDate.getMinutes();
                hours = Math.min(hours, maxHr);
                if (hours === maxHr)
                    minutes = Math.min(maxMinutes, minutes);
                if (hours === maxHr && minutes === maxMinutes)
                    seconds = self.config.maxDate.getSeconds();
            }
            return { hours: hours, minutes: minutes, seconds: seconds };
        }
        /**
         * Sets the hours, minutes, and optionally seconds
         * of the latest selected date object and the
         * corresponding time inputs
         * @param {Number} hours the hour. whether its military
         *                 or am-pm gets inferred from config
         * @param {Number} minutes the minutes
         * @param {Number} seconds the seconds (optional)
         */
        function setHours(hours, minutes, seconds) {
            if (self.latestSelectedDateObj !== undefined) {
                self.latestSelectedDateObj.setHours(hours % 24, minutes, seconds || 0, 0);
            }
            if (!self.hourElement || !self.minuteElement || self.isMobile)
                return;
            self.hourElement.value = pad(!self.config.time_24hr
                ? ((12 + hours) % 12) + 12 * int(hours % 12 === 0)
                : hours);
            self.minuteElement.value = pad(minutes);
            if (self.amPM !== undefined)
                self.amPM.textContent = self.l10n.amPM[int(hours >= 12)];
            if (self.secondElement !== undefined)
                self.secondElement.value = pad(seconds);
        }
        /**
         * Handles the year input and incrementing events
         * @param {Event} event the keyup or increment event
         */
        function onYearInput(event) {
            var eventTarget = getEventTarget(event);
            var year = parseInt(eventTarget.value) + (event.delta || 0);
            if (year / 1000 > 1 ||
                (event.key === "Enter" && !/[^\d]/.test(year.toString()))) {
                changeYear(year);
            }
        }
        /**
         * Essentially addEventListener + tracking
         * @param {Element} element the element to addEventListener to
         * @param {String} event the event name
         * @param {Function} handler the event handler
         */
        function bind(element, event, handler, options) {
            if (event instanceof Array)
                return event.forEach(function (ev) { return bind(element, ev, handler, options); });
            if (element instanceof Array)
                return element.forEach(function (el) { return bind(el, event, handler, options); });
            element.addEventListener(event, handler, options);
            self._handlers.push({
                element: element,
                event: event,
                handler: handler,
                options: options,
            });
        }
        function triggerChange() {
            triggerEvent("onChange");
        }
        /**
         * Adds all the necessary event listeners
         */
        function bindEvents() {
            if (self.config.wrap) {
                ["open", "close", "toggle", "clear"].forEach(function (evt) {
                    Array.prototype.forEach.call(self.element.querySelectorAll("[data-" + evt + "]"), function (el) {
                        return bind(el, "click", self[evt]);
                    });
                });
            }
            if (self.isMobile) {
                setupMobile();
                return;
            }
            var debouncedResize = debounce(onResize, 50);
            self._debouncedChange = debounce(triggerChange, DEBOUNCED_CHANGE_MS);
            if (self.daysContainer && !/iPhone|iPad|iPod/i.test(navigator.userAgent))
                bind(self.daysContainer, "mouseover", function (e) {
                    if (self.config.mode === "range")
                        onMouseOver(getEventTarget(e));
                });
            bind(window.document.body, "keydown", onKeyDown);
            if (!self.config.inline && !self.config.static)
                bind(window, "resize", debouncedResize);
            if (window.ontouchstart !== undefined)
                bind(window.document, "touchstart", documentClick);
            else
                bind(window.document, "click", documentClick);
            bind(window.document, "focus", documentClick, { capture: true });
            if (self.config.clickOpens === true) {
                bind(self._input, "focus", self.open);
                bind(self._input, "click", self.open);
            }
            if (self.daysContainer !== undefined) {
                bind(self.monthNav, "click", onMonthNavClick);
                bind(self.monthNav, ["keyup", "increment"], onYearInput);
                bind(self.daysContainer, "click", selectDate);
            }
            if (self.timeContainer !== undefined &&
                self.minuteElement !== undefined &&
                self.hourElement !== undefined) {
                var selText = function (e) {
                    return getEventTarget(e).select();
                };
                bind(self.timeContainer, ["increment"], updateTime);
                bind(self.timeContainer, "blur", updateTime, { capture: true });
                bind(self.timeContainer, "click", timeIncrement);
                bind([self.hourElement, self.minuteElement], ["focus", "click"], selText);
                if (self.secondElement !== undefined)
                    bind(self.secondElement, "focus", function () { return self.secondElement && self.secondElement.select(); });
                if (self.amPM !== undefined) {
                    bind(self.amPM, "click", function (e) {
                        updateTime(e);
                        triggerChange();
                    });
                }
            }
            if (self.config.allowInput)
                bind(self._input, "blur", onBlur);
        }
        /**
         * Set the calendar view to a particular date.
         * @param {Date} jumpDate the date to set the view to
         * @param {boolean} triggerChange if change events should be triggered
         */
        function jumpToDate(jumpDate, triggerChange) {
            var jumpTo = jumpDate !== undefined
                ? self.parseDate(jumpDate)
                : self.latestSelectedDateObj ||
                    (self.config.minDate && self.config.minDate > self.now
                        ? self.config.minDate
                        : self.config.maxDate && self.config.maxDate < self.now
                            ? self.config.maxDate
                            : self.now);
            var oldYear = self.currentYear;
            var oldMonth = self.currentMonth;
            try {
                if (jumpTo !== undefined) {
                    self.currentYear = jumpTo.getFullYear();
                    self.currentMonth = jumpTo.getMonth();
                }
            }
            catch (e) {
                /* istanbul ignore next */
                e.message = "Invalid date supplied: " + jumpTo;
                self.config.errorHandler(e);
            }
            if (triggerChange && self.currentYear !== oldYear) {
                triggerEvent("onYearChange");
                buildMonthSwitch();
            }
            if (triggerChange &&
                (self.currentYear !== oldYear || self.currentMonth !== oldMonth)) {
                triggerEvent("onMonthChange");
            }
            self.redraw();
        }
        /**
         * The up/down arrow handler for time inputs
         * @param {Event} e the click event
         */
        function timeIncrement(e) {
            var eventTarget = getEventTarget(e);
            if (~eventTarget.className.indexOf("arrow"))
                incrementNumInput(e, eventTarget.classList.contains("arrowUp") ? 1 : -1);
        }
        /**
         * Increments/decrements the value of input associ-
         * ated with the up/down arrow by dispatching an
         * "increment" event on the input.
         *
         * @param {Event} e the click event
         * @param {Number} delta the diff (usually 1 or -1)
         * @param {Element} inputElem the input element
         */
        function incrementNumInput(e, delta, inputElem) {
            var target = e && getEventTarget(e);
            var input = inputElem ||
                (target && target.parentNode && target.parentNode.firstChild);
            var event = createEvent("increment");
            event.delta = delta;
            input && input.dispatchEvent(event);
        }
        function build() {
            var fragment = window.document.createDocumentFragment();
            self.calendarContainer = createElement("div", "flatpickr-calendar");
            self.calendarContainer.tabIndex = -1;
            if (!self.config.noCalendar) {
                fragment.appendChild(buildMonthNav());
                self.innerContainer = createElement("div", "flatpickr-innerContainer");
                if (self.config.weekNumbers) {
                    var _a = buildWeeks(), weekWrapper = _a.weekWrapper, weekNumbers = _a.weekNumbers;
                    self.innerContainer.appendChild(weekWrapper);
                    self.weekNumbers = weekNumbers;
                    self.weekWrapper = weekWrapper;
                }
                self.rContainer = createElement("div", "flatpickr-rContainer");
                self.rContainer.appendChild(buildWeekdays());
                if (!self.daysContainer) {
                    self.daysContainer = createElement("div", "flatpickr-days");
                    self.daysContainer.tabIndex = -1;
                }
                buildDays();
                self.rContainer.appendChild(self.daysContainer);
                self.innerContainer.appendChild(self.rContainer);
                fragment.appendChild(self.innerContainer);
            }
            if (self.config.enableTime) {
                fragment.appendChild(buildTime());
            }
            toggleClass(self.calendarContainer, "rangeMode", self.config.mode === "range");
            toggleClass(self.calendarContainer, "animate", self.config.animate === true);
            toggleClass(self.calendarContainer, "multiMonth", self.config.showMonths > 1);
            self.calendarContainer.appendChild(fragment);
            var customAppend = self.config.appendTo !== undefined &&
                self.config.appendTo.nodeType !== undefined;
            if (self.config.inline || self.config.static) {
                self.calendarContainer.classList.add(self.config.inline ? "inline" : "static");
                if (self.config.inline) {
                    if (!customAppend && self.element.parentNode)
                        self.element.parentNode.insertBefore(self.calendarContainer, self._input.nextSibling);
                    else if (self.config.appendTo !== undefined)
                        self.config.appendTo.appendChild(self.calendarContainer);
                }
                if (self.config.static) {
                    var wrapper = createElement("div", "flatpickr-wrapper");
                    if (self.element.parentNode)
                        self.element.parentNode.insertBefore(wrapper, self.element);
                    wrapper.appendChild(self.element);
                    if (self.altInput)
                        wrapper.appendChild(self.altInput);
                    wrapper.appendChild(self.calendarContainer);
                }
            }
            if (!self.config.static && !self.config.inline)
                (self.config.appendTo !== undefined
                    ? self.config.appendTo
                    : window.document.body).appendChild(self.calendarContainer);
        }
        function createDay(className, date, dayNumber, i) {
            var dateIsEnabled = isEnabled(date, true), dayElement = createElement("span", "flatpickr-day " + className, date.getDate().toString());
            dayElement.dateObj = date;
            dayElement.$i = i;
            dayElement.setAttribute("aria-label", self.formatDate(date, self.config.ariaDateFormat));
            if (className.indexOf("hidden") === -1 &&
                compareDates(date, self.now) === 0) {
                self.todayDateElem = dayElement;
                dayElement.classList.add("today");
                dayElement.setAttribute("aria-current", "date");
            }
            if (dateIsEnabled) {
                dayElement.tabIndex = -1;
                if (isDateSelected(date)) {
                    dayElement.classList.add("selected");
                    self.selectedDateElem = dayElement;
                    if (self.config.mode === "range") {
                        toggleClass(dayElement, "startRange", self.selectedDates[0] &&
                            compareDates(date, self.selectedDates[0], true) === 0);
                        toggleClass(dayElement, "endRange", self.selectedDates[1] &&
                            compareDates(date, self.selectedDates[1], true) === 0);
                        if (className === "nextMonthDay")
                            dayElement.classList.add("inRange");
                    }
                }
            }
            else {
                dayElement.classList.add("flatpickr-disabled");
            }
            if (self.config.mode === "range") {
                if (isDateInRange(date) && !isDateSelected(date))
                    dayElement.classList.add("inRange");
            }
            if (self.weekNumbers &&
                self.config.showMonths === 1 &&
                className !== "prevMonthDay" &&
                dayNumber % 7 === 1) {
                self.weekNumbers.insertAdjacentHTML("beforeend", "<span class='flatpickr-day'>" + self.config.getWeek(date) + "</span>");
            }
            triggerEvent("onDayCreate", dayElement);
            return dayElement;
        }
        function focusOnDayElem(targetNode) {
            targetNode.focus();
            if (self.config.mode === "range")
                onMouseOver(targetNode);
        }
        function getFirstAvailableDay(delta) {
            var startMonth = delta > 0 ? 0 : self.config.showMonths - 1;
            var endMonth = delta > 0 ? self.config.showMonths : -1;
            for (var m = startMonth; m != endMonth; m += delta) {
                var month = self.daysContainer.children[m];
                var startIndex = delta > 0 ? 0 : month.children.length - 1;
                var endIndex = delta > 0 ? month.children.length : -1;
                for (var i = startIndex; i != endIndex; i += delta) {
                    var c = month.children[i];
                    if (c.className.indexOf("hidden") === -1 && isEnabled(c.dateObj))
                        return c;
                }
            }
            return undefined;
        }
        function getNextAvailableDay(current, delta) {
            var givenMonth = current.className.indexOf("Month") === -1
                ? current.dateObj.getMonth()
                : self.currentMonth;
            var endMonth = delta > 0 ? self.config.showMonths : -1;
            var loopDelta = delta > 0 ? 1 : -1;
            for (var m = givenMonth - self.currentMonth; m != endMonth; m += loopDelta) {
                var month = self.daysContainer.children[m];
                var startIndex = givenMonth - self.currentMonth === m
                    ? current.$i + delta
                    : delta < 0
                        ? month.children.length - 1
                        : 0;
                var numMonthDays = month.children.length;
                for (var i = startIndex; i >= 0 && i < numMonthDays && i != (delta > 0 ? numMonthDays : -1); i += loopDelta) {
                    var c = month.children[i];
                    if (c.className.indexOf("hidden") === -1 &&
                        isEnabled(c.dateObj) &&
                        Math.abs(current.$i - i) >= Math.abs(delta))
                        return focusOnDayElem(c);
                }
            }
            self.changeMonth(loopDelta);
            focusOnDay(getFirstAvailableDay(loopDelta), 0);
            return undefined;
        }
        function focusOnDay(current, offset) {
            var dayFocused = isInView(document.activeElement || document.body);
            var startElem = current !== undefined
                ? current
                : dayFocused
                    ? document.activeElement
                    : self.selectedDateElem !== undefined && isInView(self.selectedDateElem)
                        ? self.selectedDateElem
                        : self.todayDateElem !== undefined && isInView(self.todayDateElem)
                            ? self.todayDateElem
                            : getFirstAvailableDay(offset > 0 ? 1 : -1);
            if (startElem === undefined) {
                self._input.focus();
            }
            else if (!dayFocused) {
                focusOnDayElem(startElem);
            }
            else {
                getNextAvailableDay(startElem, offset);
            }
        }
        function buildMonthDays(year, month) {
            var firstOfMonth = (new Date(year, month, 1).getDay() - self.l10n.firstDayOfWeek + 7) % 7;
            var prevMonthDays = self.utils.getDaysInMonth((month - 1 + 12) % 12, year);
            var daysInMonth = self.utils.getDaysInMonth(month, year), days = window.document.createDocumentFragment(), isMultiMonth = self.config.showMonths > 1, prevMonthDayClass = isMultiMonth ? "prevMonthDay hidden" : "prevMonthDay", nextMonthDayClass = isMultiMonth ? "nextMonthDay hidden" : "nextMonthDay";
            var dayNumber = prevMonthDays + 1 - firstOfMonth, dayIndex = 0;
            // prepend days from the ending of previous month
            for (; dayNumber <= prevMonthDays; dayNumber++, dayIndex++) {
                days.appendChild(createDay(prevMonthDayClass, new Date(year, month - 1, dayNumber), dayNumber, dayIndex));
            }
            // Start at 1 since there is no 0th day
            for (dayNumber = 1; dayNumber <= daysInMonth; dayNumber++, dayIndex++) {
                days.appendChild(createDay("", new Date(year, month, dayNumber), dayNumber, dayIndex));
            }
            // append days from the next month
            for (var dayNum = daysInMonth + 1; dayNum <= 42 - firstOfMonth &&
                (self.config.showMonths === 1 || dayIndex % 7 !== 0); dayNum++, dayIndex++) {
                days.appendChild(createDay(nextMonthDayClass, new Date(year, month + 1, dayNum % daysInMonth), dayNum, dayIndex));
            }
            //updateNavigationCurrentMonth();
            var dayContainer = createElement("div", "dayContainer");
            dayContainer.appendChild(days);
            return dayContainer;
        }
        function buildDays() {
            if (self.daysContainer === undefined) {
                return;
            }
            clearNode(self.daysContainer);
            // TODO: week numbers for each month
            if (self.weekNumbers)
                clearNode(self.weekNumbers);
            var frag = document.createDocumentFragment();
            for (var i = 0; i < self.config.showMonths; i++) {
                var d = new Date(self.currentYear, self.currentMonth, 1);
                d.setMonth(self.currentMonth + i);
                frag.appendChild(buildMonthDays(d.getFullYear(), d.getMonth()));
            }
            self.daysContainer.appendChild(frag);
            self.days = self.daysContainer.firstChild;
            if (self.config.mode === "range" && self.selectedDates.length === 1) {
                onMouseOver();
            }
        }
        function buildMonthSwitch() {
            if (self.config.showMonths > 1 ||
                self.config.monthSelectorType !== "dropdown")
                return;
            var shouldBuildMonth = function (month) {
                if (self.config.minDate !== undefined &&
                    self.currentYear === self.config.minDate.getFullYear() &&
                    month < self.config.minDate.getMonth()) {
                    return false;
                }
                return !(self.config.maxDate !== undefined &&
                    self.currentYear === self.config.maxDate.getFullYear() &&
                    month > self.config.maxDate.getMonth());
            };
            self.monthsDropdownContainer.tabIndex = -1;
            self.monthsDropdownContainer.innerHTML = "";
            for (var i = 0; i < 12; i++) {
                if (!shouldBuildMonth(i))
                    continue;
                var month = createElement("option", "flatpickr-monthDropdown-month");
                month.value = new Date(self.currentYear, i).getMonth().toString();
                month.textContent = monthToStr(i, self.config.shorthandCurrentMonth, self.l10n);
                month.tabIndex = -1;
                if (self.currentMonth === i) {
                    month.selected = true;
                }
                self.monthsDropdownContainer.appendChild(month);
            }
        }
        function buildMonth() {
            var container = createElement("div", "flatpickr-month");
            var monthNavFragment = window.document.createDocumentFragment();
            var monthElement;
            if (self.config.showMonths > 1 ||
                self.config.monthSelectorType === "static") {
                monthElement = createElement("span", "cur-month");
            }
            else {
                self.monthsDropdownContainer = createElement("select", "flatpickr-monthDropdown-months");
                self.monthsDropdownContainer.setAttribute("aria-label", self.l10n.monthAriaLabel);
                bind(self.monthsDropdownContainer, "change", function (e) {
                    var target = getEventTarget(e);
                    var selectedMonth = parseInt(target.value, 10);
                    self.changeMonth(selectedMonth - self.currentMonth);
                    triggerEvent("onMonthChange");
                });
                buildMonthSwitch();
                monthElement = self.monthsDropdownContainer;
            }
            var yearInput = createNumberInput("cur-year", { tabindex: "-1" });
            var yearElement = yearInput.getElementsByTagName("input")[0];
            yearElement.setAttribute("aria-label", self.l10n.yearAriaLabel);
            if (self.config.minDate) {
                yearElement.setAttribute("min", self.config.minDate.getFullYear().toString());
            }
            if (self.config.maxDate) {
                yearElement.setAttribute("max", self.config.maxDate.getFullYear().toString());
                yearElement.disabled =
                    !!self.config.minDate &&
                        self.config.minDate.getFullYear() === self.config.maxDate.getFullYear();
            }
            var currentMonth = createElement("div", "flatpickr-current-month");
            currentMonth.appendChild(monthElement);
            currentMonth.appendChild(yearInput);
            monthNavFragment.appendChild(currentMonth);
            container.appendChild(monthNavFragment);
            return {
                container: container,
                yearElement: yearElement,
                monthElement: monthElement,
            };
        }
        function buildMonths() {
            clearNode(self.monthNav);
            self.monthNav.appendChild(self.prevMonthNav);
            if (self.config.showMonths) {
                self.yearElements = [];
                self.monthElements = [];
            }
            for (var m = self.config.showMonths; m--;) {
                var month = buildMonth();
                self.yearElements.push(month.yearElement);
                self.monthElements.push(month.monthElement);
                self.monthNav.appendChild(month.container);
            }
            self.monthNav.appendChild(self.nextMonthNav);
        }
        function buildMonthNav() {
            self.monthNav = createElement("div", "flatpickr-months");
            self.yearElements = [];
            self.monthElements = [];
            self.prevMonthNav = createElement("span", "flatpickr-prev-month");
            self.prevMonthNav.innerHTML = self.config.prevArrow;
            self.nextMonthNav = createElement("span", "flatpickr-next-month");
            self.nextMonthNav.innerHTML = self.config.nextArrow;
            buildMonths();
            Object.defineProperty(self, "_hidePrevMonthArrow", {
                get: function () { return self.__hidePrevMonthArrow; },
                set: function (bool) {
                    if (self.__hidePrevMonthArrow !== bool) {
                        toggleClass(self.prevMonthNav, "flatpickr-disabled", bool);
                        self.__hidePrevMonthArrow = bool;
                    }
                },
            });
            Object.defineProperty(self, "_hideNextMonthArrow", {
                get: function () { return self.__hideNextMonthArrow; },
                set: function (bool) {
                    if (self.__hideNextMonthArrow !== bool) {
                        toggleClass(self.nextMonthNav, "flatpickr-disabled", bool);
                        self.__hideNextMonthArrow = bool;
                    }
                },
            });
            self.currentYearElement = self.yearElements[0];
            updateNavigationCurrentMonth();
            return self.monthNav;
        }
        function buildTime() {
            self.calendarContainer.classList.add("hasTime");
            if (self.config.noCalendar)
                self.calendarContainer.classList.add("noCalendar");
            self.timeContainer = createElement("div", "flatpickr-time");
            self.timeContainer.tabIndex = -1;
            var separator = createElement("span", "flatpickr-time-separator", ":");
            var hourInput = createNumberInput("flatpickr-hour", {
                "aria-label": self.l10n.hourAriaLabel,
            });
            self.hourElement = hourInput.getElementsByTagName("input")[0];
            var minuteInput = createNumberInput("flatpickr-minute", {
                "aria-label": self.l10n.minuteAriaLabel,
            });
            self.minuteElement = minuteInput.getElementsByTagName("input")[0];
            self.hourElement.tabIndex = self.minuteElement.tabIndex = -1;
            self.hourElement.value = pad(self.latestSelectedDateObj
                ? self.latestSelectedDateObj.getHours()
                : self.config.time_24hr
                    ? self.config.defaultHour
                    : military2ampm(self.config.defaultHour));
            self.minuteElement.value = pad(self.latestSelectedDateObj
                ? self.latestSelectedDateObj.getMinutes()
                : self.config.defaultMinute);
            self.hourElement.setAttribute("step", self.config.hourIncrement.toString());
            self.minuteElement.setAttribute("step", self.config.minuteIncrement.toString());
            self.hourElement.setAttribute("min", self.config.time_24hr ? "0" : "1");
            self.hourElement.setAttribute("max", self.config.time_24hr ? "23" : "12");
            self.minuteElement.setAttribute("min", "0");
            self.minuteElement.setAttribute("max", "59");
            self.timeContainer.appendChild(hourInput);
            self.timeContainer.appendChild(separator);
            self.timeContainer.appendChild(minuteInput);
            if (self.config.time_24hr)
                self.timeContainer.classList.add("time24hr");
            if (self.config.enableSeconds) {
                self.timeContainer.classList.add("hasSeconds");
                var secondInput = createNumberInput("flatpickr-second");
                self.secondElement = secondInput.getElementsByTagName("input")[0];
                self.secondElement.value = pad(self.latestSelectedDateObj
                    ? self.latestSelectedDateObj.getSeconds()
                    : self.config.defaultSeconds);
                self.secondElement.setAttribute("step", self.minuteElement.getAttribute("step"));
                self.secondElement.setAttribute("min", "0");
                self.secondElement.setAttribute("max", "59");
                self.timeContainer.appendChild(createElement("span", "flatpickr-time-separator", ":"));
                self.timeContainer.appendChild(secondInput);
            }
            if (!self.config.time_24hr) {
                // add self.amPM if appropriate
                self.amPM = createElement("span", "flatpickr-am-pm", self.l10n.amPM[int((self.latestSelectedDateObj
                    ? self.hourElement.value
                    : self.config.defaultHour) > 11)]);
                self.amPM.title = self.l10n.toggleTitle;
                self.amPM.tabIndex = -1;
                self.timeContainer.appendChild(self.amPM);
            }
            return self.timeContainer;
        }
        function buildWeekdays() {
            if (!self.weekdayContainer)
                self.weekdayContainer = createElement("div", "flatpickr-weekdays");
            else
                clearNode(self.weekdayContainer);
            for (var i = self.config.showMonths; i--;) {
                var container = createElement("div", "flatpickr-weekdaycontainer");
                self.weekdayContainer.appendChild(container);
            }
            updateWeekdays();
            return self.weekdayContainer;
        }
        function updateWeekdays() {
            if (!self.weekdayContainer) {
                return;
            }
            var firstDayOfWeek = self.l10n.firstDayOfWeek;
            var weekdays = __spreadArrays(self.l10n.weekdays.shorthand);
            if (firstDayOfWeek > 0 && firstDayOfWeek < weekdays.length) {
                weekdays = __spreadArrays(weekdays.splice(firstDayOfWeek, weekdays.length), weekdays.splice(0, firstDayOfWeek));
            }
            for (var i = self.config.showMonths; i--;) {
                self.weekdayContainer.children[i].innerHTML = "\n      <span class='flatpickr-weekday'>\n        " + weekdays.join("</span><span class='flatpickr-weekday'>") + "\n      </span>\n      ";
            }
        }
        /* istanbul ignore next */
        function buildWeeks() {
            self.calendarContainer.classList.add("hasWeeks");
            var weekWrapper = createElement("div", "flatpickr-weekwrapper");
            weekWrapper.appendChild(createElement("span", "flatpickr-weekday", self.l10n.weekAbbreviation));
            var weekNumbers = createElement("div", "flatpickr-weeks");
            weekWrapper.appendChild(weekNumbers);
            return {
                weekWrapper: weekWrapper,
                weekNumbers: weekNumbers,
            };
        }
        function changeMonth(value, isOffset) {
            if (isOffset === void 0) { isOffset = true; }
            var delta = isOffset ? value : value - self.currentMonth;
            if ((delta < 0 && self._hidePrevMonthArrow === true) ||
                (delta > 0 && self._hideNextMonthArrow === true))
                return;
            self.currentMonth += delta;
            if (self.currentMonth < 0 || self.currentMonth > 11) {
                self.currentYear += self.currentMonth > 11 ? 1 : -1;
                self.currentMonth = (self.currentMonth + 12) % 12;
                triggerEvent("onYearChange");
                buildMonthSwitch();
            }
            buildDays();
            triggerEvent("onMonthChange");
            updateNavigationCurrentMonth();
        }
        function clear(triggerChangeEvent, toInitial) {
            if (triggerChangeEvent === void 0) { triggerChangeEvent = true; }
            if (toInitial === void 0) { toInitial = true; }
            self.input.value = "";
            if (self.altInput !== undefined)
                self.altInput.value = "";
            if (self.mobileInput !== undefined)
                self.mobileInput.value = "";
            self.selectedDates = [];
            self.latestSelectedDateObj = undefined;
            if (toInitial === true) {
                self.currentYear = self._initialDate.getFullYear();
                self.currentMonth = self._initialDate.getMonth();
            }
            if (self.config.enableTime === true) {
                var _a = getDefaultHours(), hours = _a.hours, minutes = _a.minutes, seconds = _a.seconds;
                setHours(hours, minutes, seconds);
            }
            self.redraw();
            if (triggerChangeEvent)
                // triggerChangeEvent is true (default) or an Event
                triggerEvent("onChange");
        }
        function close() {
            self.isOpen = false;
            if (!self.isMobile) {
                if (self.calendarContainer !== undefined) {
                    self.calendarContainer.classList.remove("open");
                }
                if (self._input !== undefined) {
                    self._input.classList.remove("active");
                }
            }
            triggerEvent("onClose");
        }
        function destroy() {
            if (self.config !== undefined)
                triggerEvent("onDestroy");
            for (var i = self._handlers.length; i--;) {
                var h = self._handlers[i];
                h.element.removeEventListener(h.event, h.handler, h.options);
            }
            self._handlers = [];
            if (self.mobileInput) {
                if (self.mobileInput.parentNode)
                    self.mobileInput.parentNode.removeChild(self.mobileInput);
                self.mobileInput = undefined;
            }
            else if (self.calendarContainer && self.calendarContainer.parentNode) {
                if (self.config.static && self.calendarContainer.parentNode) {
                    var wrapper = self.calendarContainer.parentNode;
                    wrapper.lastChild && wrapper.removeChild(wrapper.lastChild);
                    if (wrapper.parentNode) {
                        while (wrapper.firstChild)
                            wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
                        wrapper.parentNode.removeChild(wrapper);
                    }
                }
                else
                    self.calendarContainer.parentNode.removeChild(self.calendarContainer);
            }
            if (self.altInput) {
                self.input.type = "text";
                if (self.altInput.parentNode)
                    self.altInput.parentNode.removeChild(self.altInput);
                delete self.altInput;
            }
            if (self.input) {
                self.input.type = self.input._type;
                self.input.classList.remove("flatpickr-input");
                self.input.removeAttribute("readonly");
            }
            [
                "_showTimeInput",
                "latestSelectedDateObj",
                "_hideNextMonthArrow",
                "_hidePrevMonthArrow",
                "__hideNextMonthArrow",
                "__hidePrevMonthArrow",
                "isMobile",
                "isOpen",
                "selectedDateElem",
                "minDateHasTime",
                "maxDateHasTime",
                "days",
                "daysContainer",
                "_input",
                "_positionElement",
                "innerContainer",
                "rContainer",
                "monthNav",
                "todayDateElem",
                "calendarContainer",
                "weekdayContainer",
                "prevMonthNav",
                "nextMonthNav",
                "monthsDropdownContainer",
                "currentMonthElement",
                "currentYearElement",
                "navigationCurrentMonth",
                "selectedDateElem",
                "config",
            ].forEach(function (k) {
                try {
                    delete self[k];
                }
                catch (_) { }
            });
        }
        function isCalendarElem(elem) {
            if (self.config.appendTo && self.config.appendTo.contains(elem))
                return true;
            return self.calendarContainer.contains(elem);
        }
        function documentClick(e) {
            if (self.isOpen && !self.config.inline) {
                var eventTarget_1 = getEventTarget(e);
                var isCalendarElement = isCalendarElem(eventTarget_1);
                var isInput = eventTarget_1 === self.input ||
                    eventTarget_1 === self.altInput ||
                    self.element.contains(eventTarget_1) ||
                    // web components
                    // e.path is not present in all browsers. circumventing typechecks
                    (e.path &&
                        e.path.indexOf &&
                        (~e.path.indexOf(self.input) ||
                            ~e.path.indexOf(self.altInput)));
                var lostFocus = e.type === "blur"
                    ? isInput &&
                        e.relatedTarget &&
                        !isCalendarElem(e.relatedTarget)
                    : !isInput &&
                        !isCalendarElement &&
                        !isCalendarElem(e.relatedTarget);
                var isIgnored = !self.config.ignoredFocusElements.some(function (elem) {
                    return elem.contains(eventTarget_1);
                });
                if (lostFocus && isIgnored) {
                    if (self.timeContainer !== undefined &&
                        self.minuteElement !== undefined &&
                        self.hourElement !== undefined &&
                        self.input.value !== "" &&
                        self.input.value !== undefined) {
                        updateTime();
                    }
                    self.close();
                    if (self.config &&
                        self.config.mode === "range" &&
                        self.selectedDates.length === 1) {
                        self.clear(false);
                        self.redraw();
                    }
                }
            }
        }
        function changeYear(newYear) {
            if (!newYear ||
                (self.config.minDate && newYear < self.config.minDate.getFullYear()) ||
                (self.config.maxDate && newYear > self.config.maxDate.getFullYear()))
                return;
            var newYearNum = newYear, isNewYear = self.currentYear !== newYearNum;
            self.currentYear = newYearNum || self.currentYear;
            if (self.config.maxDate &&
                self.currentYear === self.config.maxDate.getFullYear()) {
                self.currentMonth = Math.min(self.config.maxDate.getMonth(), self.currentMonth);
            }
            else if (self.config.minDate &&
                self.currentYear === self.config.minDate.getFullYear()) {
                self.currentMonth = Math.max(self.config.minDate.getMonth(), self.currentMonth);
            }
            if (isNewYear) {
                self.redraw();
                triggerEvent("onYearChange");
                buildMonthSwitch();
            }
        }
        function isEnabled(date, timeless) {
            if (timeless === void 0) { timeless = true; }
            var dateToCheck = self.parseDate(date, undefined, timeless); // timeless
            if ((self.config.minDate &&
                dateToCheck &&
                compareDates(dateToCheck, self.config.minDate, timeless !== undefined ? timeless : !self.minDateHasTime) < 0) ||
                (self.config.maxDate &&
                    dateToCheck &&
                    compareDates(dateToCheck, self.config.maxDate, timeless !== undefined ? timeless : !self.maxDateHasTime) > 0))
                return false;
            if (self.config.enable.length === 0 && self.config.disable.length === 0)
                return true;
            if (dateToCheck === undefined)
                return false;
            var bool = self.config.enable.length > 0, array = bool ? self.config.enable : self.config.disable;
            for (var i = 0, d = void 0; i < array.length; i++) {
                d = array[i];
                if (typeof d === "function" &&
                    d(dateToCheck) // disabled by function
                )
                    return bool;
                else if (d instanceof Date &&
                    dateToCheck !== undefined &&
                    d.getTime() === dateToCheck.getTime())
                    // disabled by date
                    return bool;
                else if (typeof d === "string" && dateToCheck !== undefined) {
                    // disabled by date string
                    var parsed = self.parseDate(d, undefined, true);
                    return parsed && parsed.getTime() === dateToCheck.getTime()
                        ? bool
                        : !bool;
                }
                else if (
                // disabled by range
                typeof d === "object" &&
                    dateToCheck !== undefined &&
                    d.from &&
                    d.to &&
                    dateToCheck.getTime() >= d.from.getTime() &&
                    dateToCheck.getTime() <= d.to.getTime())
                    return bool;
            }
            return !bool;
        }
        function isInView(elem) {
            if (self.daysContainer !== undefined)
                return (elem.className.indexOf("hidden") === -1 &&
                    elem.className.indexOf("flatpickr-disabled") === -1 &&
                    self.daysContainer.contains(elem));
            return false;
        }
        function onBlur(e) {
            var isInput = e.target === self._input;
            if (isInput &&
                !(e.relatedTarget && isCalendarElem(e.relatedTarget))) {
                self.setDate(self._input.value, true, e.target === self.altInput
                    ? self.config.altFormat
                    : self.config.dateFormat);
            }
        }
        function onKeyDown(e) {
            // e.key                      e.keyCode
            // "Backspace"                        8
            // "Tab"                              9
            // "Enter"                           13
            // "Escape"     (IE "Esc")           27
            // "ArrowLeft"  (IE "Left")          37
            // "ArrowUp"    (IE "Up")            38
            // "ArrowRight" (IE "Right")         39
            // "ArrowDown"  (IE "Down")          40
            // "Delete"     (IE "Del")           46
            var eventTarget = getEventTarget(e);
            var isInput = self.config.wrap
                ? element.contains(eventTarget)
                : eventTarget === self._input;
            var allowInput = self.config.allowInput;
            var allowKeydown = self.isOpen && (!allowInput || !isInput);
            var allowInlineKeydown = self.config.inline && isInput && !allowInput;
            if (e.keyCode === 13 && isInput) {
                if (allowInput) {
                    self.setDate(self._input.value, true, eventTarget === self.altInput
                        ? self.config.altFormat
                        : self.config.dateFormat);
                    return eventTarget.blur();
                }
                else {
                    self.open();
                }
            }
            else if (isCalendarElem(eventTarget) ||
                allowKeydown ||
                allowInlineKeydown) {
                var isTimeObj = !!self.timeContainer &&
                    self.timeContainer.contains(eventTarget);
                switch (e.keyCode) {
                    case 13:
                        if (isTimeObj) {
                            e.preventDefault();
                            updateTime();
                            focusAndClose();
                        }
                        else
                            selectDate(e);
                        break;
                    case 27: // escape
                        e.preventDefault();
                        focusAndClose();
                        break;
                    case 8:
                    case 46:
                        if (isInput && !self.config.allowInput) {
                            e.preventDefault();
                            self.clear();
                        }
                        break;
                    case 37:
                    case 39:
                        if (!isTimeObj && !isInput) {
                            e.preventDefault();
                            if (self.daysContainer !== undefined &&
                                (allowInput === false ||
                                    (document.activeElement && isInView(document.activeElement)))) {
                                var delta_1 = e.keyCode === 39 ? 1 : -1;
                                if (!e.ctrlKey)
                                    focusOnDay(undefined, delta_1);
                                else {
                                    e.stopPropagation();
                                    changeMonth(delta_1);
                                    focusOnDay(getFirstAvailableDay(1), 0);
                                }
                            }
                        }
                        else if (self.hourElement)
                            self.hourElement.focus();
                        break;
                    case 38:
                    case 40:
                        e.preventDefault();
                        var delta = e.keyCode === 40 ? 1 : -1;
                        if ((self.daysContainer &&
                            eventTarget.$i !== undefined) ||
                            eventTarget === self.input ||
                            eventTarget === self.altInput) {
                            if (e.ctrlKey) {
                                e.stopPropagation();
                                changeYear(self.currentYear - delta);
                                focusOnDay(getFirstAvailableDay(1), 0);
                            }
                            else if (!isTimeObj)
                                focusOnDay(undefined, delta * 7);
                        }
                        else if (eventTarget === self.currentYearElement) {
                            changeYear(self.currentYear - delta);
                        }
                        else if (self.config.enableTime) {
                            if (!isTimeObj && self.hourElement)
                                self.hourElement.focus();
                            updateTime(e);
                            self._debouncedChange();
                        }
                        break;
                    case 9:
                        if (isTimeObj) {
                            var elems = [
                                self.hourElement,
                                self.minuteElement,
                                self.secondElement,
                                self.amPM,
                            ]
                                .concat(self.pluginElements)
                                .filter(function (x) { return x; });
                            var i = elems.indexOf(eventTarget);
                            if (i !== -1) {
                                var target = elems[i + (e.shiftKey ? -1 : 1)];
                                e.preventDefault();
                                (target || self._input).focus();
                            }
                        }
                        else if (!self.config.noCalendar &&
                            self.daysContainer &&
                            self.daysContainer.contains(eventTarget) &&
                            e.shiftKey) {
                            e.preventDefault();
                            self._input.focus();
                        }
                        break;
                }
            }
            if (self.amPM !== undefined && eventTarget === self.amPM) {
                switch (e.key) {
                    case self.l10n.amPM[0].charAt(0):
                    case self.l10n.amPM[0].charAt(0).toLowerCase():
                        self.amPM.textContent = self.l10n.amPM[0];
                        setHoursFromInputs();
                        updateValue();
                        break;
                    case self.l10n.amPM[1].charAt(0):
                    case self.l10n.amPM[1].charAt(0).toLowerCase():
                        self.amPM.textContent = self.l10n.amPM[1];
                        setHoursFromInputs();
                        updateValue();
                        break;
                }
            }
            if (isInput || isCalendarElem(eventTarget)) {
                triggerEvent("onKeyDown", e);
            }
        }
        function onMouseOver(elem) {
            if (self.selectedDates.length !== 1 ||
                (elem &&
                    (!elem.classList.contains("flatpickr-day") ||
                        elem.classList.contains("flatpickr-disabled"))))
                return;
            var hoverDate = elem
                ? elem.dateObj.getTime()
                : self.days.firstElementChild.dateObj.getTime(), initialDate = self.parseDate(self.selectedDates[0], undefined, true).getTime(), rangeStartDate = Math.min(hoverDate, self.selectedDates[0].getTime()), rangeEndDate = Math.max(hoverDate, self.selectedDates[0].getTime());
            var containsDisabled = false;
            var minRange = 0, maxRange = 0;
            for (var t = rangeStartDate; t < rangeEndDate; t += duration.DAY) {
                if (!isEnabled(new Date(t), true)) {
                    containsDisabled =
                        containsDisabled || (t > rangeStartDate && t < rangeEndDate);
                    if (t < initialDate && (!minRange || t > minRange))
                        minRange = t;
                    else if (t > initialDate && (!maxRange || t < maxRange))
                        maxRange = t;
                }
            }
            for (var m = 0; m < self.config.showMonths; m++) {
                var month = self.daysContainer.children[m];
                var _loop_1 = function (i, l) {
                    var dayElem = month.children[i], date = dayElem.dateObj;
                    var timestamp = date.getTime();
                    var outOfRange = (minRange > 0 && timestamp < minRange) ||
                        (maxRange > 0 && timestamp > maxRange);
                    if (outOfRange) {
                        dayElem.classList.add("notAllowed");
                        ["inRange", "startRange", "endRange"].forEach(function (c) {
                            dayElem.classList.remove(c);
                        });
                        return "continue";
                    }
                    else if (containsDisabled && !outOfRange)
                        return "continue";
                    ["startRange", "inRange", "endRange", "notAllowed"].forEach(function (c) {
                        dayElem.classList.remove(c);
                    });
                    if (elem !== undefined) {
                        elem.classList.add(hoverDate <= self.selectedDates[0].getTime()
                            ? "startRange"
                            : "endRange");
                        if (initialDate < hoverDate && timestamp === initialDate)
                            dayElem.classList.add("startRange");
                        else if (initialDate > hoverDate && timestamp === initialDate)
                            dayElem.classList.add("endRange");
                        if (timestamp >= minRange &&
                            (maxRange === 0 || timestamp <= maxRange) &&
                            isBetween(timestamp, initialDate, hoverDate))
                            dayElem.classList.add("inRange");
                    }
                };
                for (var i = 0, l = month.children.length; i < l; i++) {
                    _loop_1(i, l);
                }
            }
        }
        function onResize() {
            if (self.isOpen && !self.config.static && !self.config.inline)
                positionCalendar();
        }
        function open(e, positionElement) {
            if (positionElement === void 0) { positionElement = self._positionElement; }
            if (self.isMobile === true) {
                if (e) {
                    e.preventDefault();
                    var eventTarget = getEventTarget(e);
                    eventTarget && eventTarget.blur();
                }
                if (self.mobileInput !== undefined) {
                    self.mobileInput.focus();
                    self.mobileInput.click();
                }
                triggerEvent("onOpen");
                return;
            }
            if (self._input.disabled || self.config.inline)
                return;
            var wasOpen = self.isOpen;
            self.isOpen = true;
            if (!wasOpen) {
                self.calendarContainer.classList.add("open");
                self._input.classList.add("active");
                triggerEvent("onOpen");
                positionCalendar(positionElement);
            }
            if (self.config.enableTime === true && self.config.noCalendar === true) {
                if (self.config.allowInput === false &&
                    (e === undefined ||
                        !self.timeContainer.contains(e.relatedTarget))) {
                    setTimeout(function () { return self.hourElement.select(); }, 50);
                }
            }
        }
        function minMaxDateSetter(type) {
            return function (date) {
                var dateObj = (self.config["_" + type + "Date"] = self.parseDate(date, self.config.dateFormat));
                var inverseDateObj = self.config["_" + (type === "min" ? "max" : "min") + "Date"];
                if (dateObj !== undefined) {
                    self[type === "min" ? "minDateHasTime" : "maxDateHasTime"] =
                        dateObj.getHours() > 0 ||
                            dateObj.getMinutes() > 0 ||
                            dateObj.getSeconds() > 0;
                }
                if (self.selectedDates) {
                    self.selectedDates = self.selectedDates.filter(function (d) { return isEnabled(d); });
                    if (!self.selectedDates.length && type === "min")
                        setHoursFromDate(dateObj);
                    updateValue();
                }
                if (self.daysContainer) {
                    redraw();
                    if (dateObj !== undefined)
                        self.currentYearElement[type] = dateObj.getFullYear().toString();
                    else
                        self.currentYearElement.removeAttribute(type);
                    self.currentYearElement.disabled =
                        !!inverseDateObj &&
                            dateObj !== undefined &&
                            inverseDateObj.getFullYear() === dateObj.getFullYear();
                }
            };
        }
        function parseConfig() {
            var boolOpts = [
                "wrap",
                "weekNumbers",
                "allowInput",
                "allowInvalidPreload",
                "clickOpens",
                "time_24hr",
                "enableTime",
                "noCalendar",
                "altInput",
                "shorthandCurrentMonth",
                "inline",
                "static",
                "enableSeconds",
                "disableMobile",
            ];
            var userConfig = __assign(__assign({}, JSON.parse(JSON.stringify(element.dataset || {}))), instanceConfig);
            var formats = {};
            self.config.parseDate = userConfig.parseDate;
            self.config.formatDate = userConfig.formatDate;
            Object.defineProperty(self.config, "enable", {
                get: function () { return self.config._enable; },
                set: function (dates) {
                    self.config._enable = parseDateRules(dates);
                },
            });
            Object.defineProperty(self.config, "disable", {
                get: function () { return self.config._disable; },
                set: function (dates) {
                    self.config._disable = parseDateRules(dates);
                },
            });
            var timeMode = userConfig.mode === "time";
            if (!userConfig.dateFormat && (userConfig.enableTime || timeMode)) {
                var defaultDateFormat = flatpickr.defaultConfig.dateFormat || defaults.dateFormat;
                formats.dateFormat =
                    userConfig.noCalendar || timeMode
                        ? "H:i" + (userConfig.enableSeconds ? ":S" : "")
                        : defaultDateFormat + " H:i" + (userConfig.enableSeconds ? ":S" : "");
            }
            if (userConfig.altInput &&
                (userConfig.enableTime || timeMode) &&
                !userConfig.altFormat) {
                var defaultAltFormat = flatpickr.defaultConfig.altFormat || defaults.altFormat;
                formats.altFormat =
                    userConfig.noCalendar || timeMode
                        ? "h:i" + (userConfig.enableSeconds ? ":S K" : " K")
                        : defaultAltFormat + (" h:i" + (userConfig.enableSeconds ? ":S" : "") + " K");
            }
            Object.defineProperty(self.config, "minDate", {
                get: function () { return self.config._minDate; },
                set: minMaxDateSetter("min"),
            });
            Object.defineProperty(self.config, "maxDate", {
                get: function () { return self.config._maxDate; },
                set: minMaxDateSetter("max"),
            });
            var minMaxTimeSetter = function (type) { return function (val) {
                self.config[type === "min" ? "_minTime" : "_maxTime"] = self.parseDate(val, "H:i:S");
            }; };
            Object.defineProperty(self.config, "minTime", {
                get: function () { return self.config._minTime; },
                set: minMaxTimeSetter("min"),
            });
            Object.defineProperty(self.config, "maxTime", {
                get: function () { return self.config._maxTime; },
                set: minMaxTimeSetter("max"),
            });
            if (userConfig.mode === "time") {
                self.config.noCalendar = true;
                self.config.enableTime = true;
            }
            Object.assign(self.config, formats, userConfig);
            for (var i = 0; i < boolOpts.length; i++)
                // https://github.com/microsoft/TypeScript/issues/31663
                self.config[boolOpts[i]] =
                    self.config[boolOpts[i]] === true ||
                        self.config[boolOpts[i]] === "true";
            HOOKS.filter(function (hook) { return self.config[hook] !== undefined; }).forEach(function (hook) {
                self.config[hook] = arrayify(self.config[hook] || []).map(bindToInstance);
            });
            self.isMobile =
                !self.config.disableMobile &&
                    !self.config.inline &&
                    self.config.mode === "single" &&
                    !self.config.disable.length &&
                    !self.config.enable.length &&
                    !self.config.weekNumbers &&
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            for (var i = 0; i < self.config.plugins.length; i++) {
                var pluginConf = self.config.plugins[i](self) || {};
                for (var key in pluginConf) {
                    if (HOOKS.indexOf(key) > -1) {
                        self.config[key] = arrayify(pluginConf[key])
                            .map(bindToInstance)
                            .concat(self.config[key]);
                    }
                    else if (typeof userConfig[key] === "undefined")
                        self.config[key] = pluginConf[key];
                }
            }
            if (!userConfig.altInputClass) {
                self.config.altInputClass =
                    getInputElem().className + " " + self.config.altInputClass;
            }
            triggerEvent("onParseConfig");
        }
        function getInputElem() {
            return self.config.wrap
                ? element.querySelector("[data-input]")
                : element;
        }
        function setupLocale() {
            if (typeof self.config.locale !== "object" &&
                typeof flatpickr.l10ns[self.config.locale] === "undefined")
                self.config.errorHandler(new Error("flatpickr: invalid locale " + self.config.locale));
            self.l10n = __assign(__assign({}, flatpickr.l10ns.default), (typeof self.config.locale === "object"
                ? self.config.locale
                : self.config.locale !== "default"
                    ? flatpickr.l10ns[self.config.locale]
                    : undefined));
            tokenRegex.K = "(" + self.l10n.amPM[0] + "|" + self.l10n.amPM[1] + "|" + self.l10n.amPM[0].toLowerCase() + "|" + self.l10n.amPM[1].toLowerCase() + ")";
            var userConfig = __assign(__assign({}, instanceConfig), JSON.parse(JSON.stringify(element.dataset || {})));
            if (userConfig.time_24hr === undefined &&
                flatpickr.defaultConfig.time_24hr === undefined) {
                self.config.time_24hr = self.l10n.time_24hr;
            }
            self.formatDate = createDateFormatter(self);
            self.parseDate = createDateParser({ config: self.config, l10n: self.l10n });
        }
        function positionCalendar(customPositionElement) {
            if (self.calendarContainer === undefined)
                return;
            triggerEvent("onPreCalendarPosition");
            var positionElement = customPositionElement || self._positionElement;
            var calendarHeight = Array.prototype.reduce.call(self.calendarContainer.children, (function (acc, child) { return acc + child.offsetHeight; }), 0), calendarWidth = self.calendarContainer.offsetWidth, configPos = self.config.position.split(" "), configPosVertical = configPos[0], configPosHorizontal = configPos.length > 1 ? configPos[1] : null, inputBounds = positionElement.getBoundingClientRect(), distanceFromBottom = window.innerHeight - inputBounds.bottom, showOnTop = configPosVertical === "above" ||
                (configPosVertical !== "below" &&
                    distanceFromBottom < calendarHeight &&
                    inputBounds.top > calendarHeight);
            var top = window.pageYOffset +
                inputBounds.top +
                (!showOnTop ? positionElement.offsetHeight + 2 : -calendarHeight - 2);
            toggleClass(self.calendarContainer, "arrowTop", !showOnTop);
            toggleClass(self.calendarContainer, "arrowBottom", showOnTop);
            if (self.config.inline)
                return;
            var left = window.pageXOffset + inputBounds.left;
            var isCenter = false;
            var isRight = false;
            if (configPosHorizontal === "center") {
                left -= (calendarWidth - inputBounds.width) / 2;
                isCenter = true;
            }
            else if (configPosHorizontal === "right") {
                left -= calendarWidth - inputBounds.width;
                isRight = true;
            }
            toggleClass(self.calendarContainer, "arrowLeft", !isCenter && !isRight);
            toggleClass(self.calendarContainer, "arrowCenter", isCenter);
            toggleClass(self.calendarContainer, "arrowRight", isRight);
            var right = window.document.body.offsetWidth -
                (window.pageXOffset + inputBounds.right);
            var rightMost = left + calendarWidth > window.document.body.offsetWidth;
            var centerMost = right + calendarWidth > window.document.body.offsetWidth;
            toggleClass(self.calendarContainer, "rightMost", rightMost);
            if (self.config.static)
                return;
            self.calendarContainer.style.top = top + "px";
            if (!rightMost) {
                self.calendarContainer.style.left = left + "px";
                self.calendarContainer.style.right = "auto";
            }
            else if (!centerMost) {
                self.calendarContainer.style.left = "auto";
                self.calendarContainer.style.right = right + "px";
            }
            else {
                var doc = getDocumentStyleSheet();
                // some testing environments don't have css support
                if (doc === undefined)
                    return;
                var bodyWidth = window.document.body.offsetWidth;
                var centerLeft = Math.max(0, bodyWidth / 2 - calendarWidth / 2);
                var centerBefore = ".flatpickr-calendar.centerMost:before";
                var centerAfter = ".flatpickr-calendar.centerMost:after";
                var centerIndex = doc.cssRules.length;
                var centerStyle = "{left:" + inputBounds.left + "px;right:auto;}";
                toggleClass(self.calendarContainer, "rightMost", false);
                toggleClass(self.calendarContainer, "centerMost", true);
                doc.insertRule(centerBefore + "," + centerAfter + centerStyle, centerIndex);
                self.calendarContainer.style.left = centerLeft + "px";
                self.calendarContainer.style.right = "auto";
            }
        }
        function getDocumentStyleSheet() {
            var editableSheet = null;
            for (var i = 0; i < document.styleSheets.length; i++) {
                var sheet = document.styleSheets[i];
                try {
                    sheet.cssRules;
                }
                catch (err) {
                    continue;
                }
                editableSheet = sheet;
                break;
            }
            return editableSheet != null ? editableSheet : createStyleSheet();
        }
        function createStyleSheet() {
            var style = document.createElement("style");
            document.head.appendChild(style);
            return style.sheet;
        }
        function redraw() {
            if (self.config.noCalendar || self.isMobile)
                return;
            buildMonthSwitch();
            updateNavigationCurrentMonth();
            buildDays();
        }
        function focusAndClose() {
            self._input.focus();
            if (window.navigator.userAgent.indexOf("MSIE") !== -1 ||
                navigator.msMaxTouchPoints !== undefined) {
                // hack - bugs in the way IE handles focus keeps the calendar open
                setTimeout(self.close, 0);
            }
            else {
                self.close();
            }
        }
        function selectDate(e) {
            e.preventDefault();
            e.stopPropagation();
            var isSelectable = function (day) {
                return day.classList &&
                    day.classList.contains("flatpickr-day") &&
                    !day.classList.contains("flatpickr-disabled") &&
                    !day.classList.contains("notAllowed");
            };
            var t = findParent(getEventTarget(e), isSelectable);
            if (t === undefined)
                return;
            var target = t;
            var selectedDate = (self.latestSelectedDateObj = new Date(target.dateObj.getTime()));
            var shouldChangeMonth = (selectedDate.getMonth() < self.currentMonth ||
                selectedDate.getMonth() >
                    self.currentMonth + self.config.showMonths - 1) &&
                self.config.mode !== "range";
            self.selectedDateElem = target;
            if (self.config.mode === "single")
                self.selectedDates = [selectedDate];
            else if (self.config.mode === "multiple") {
                var selectedIndex = isDateSelected(selectedDate);
                if (selectedIndex)
                    self.selectedDates.splice(parseInt(selectedIndex), 1);
                else
                    self.selectedDates.push(selectedDate);
            }
            else if (self.config.mode === "range") {
                if (self.selectedDates.length === 2) {
                    self.clear(false, false);
                }
                self.latestSelectedDateObj = selectedDate;
                self.selectedDates.push(selectedDate);
                // unless selecting same date twice, sort ascendingly
                if (compareDates(selectedDate, self.selectedDates[0], true) !== 0)
                    self.selectedDates.sort(function (a, b) { return a.getTime() - b.getTime(); });
            }
            setHoursFromInputs();
            if (shouldChangeMonth) {
                var isNewYear = self.currentYear !== selectedDate.getFullYear();
                self.currentYear = selectedDate.getFullYear();
                self.currentMonth = selectedDate.getMonth();
                if (isNewYear) {
                    triggerEvent("onYearChange");
                    buildMonthSwitch();
                }
                triggerEvent("onMonthChange");
            }
            updateNavigationCurrentMonth();
            buildDays();
            updateValue();
            // maintain focus
            if (!shouldChangeMonth &&
                self.config.mode !== "range" &&
                self.config.showMonths === 1)
                focusOnDayElem(target);
            else if (self.selectedDateElem !== undefined &&
                self.hourElement === undefined) {
                self.selectedDateElem && self.selectedDateElem.focus();
            }
            if (self.hourElement !== undefined)
                self.hourElement !== undefined && self.hourElement.focus();
            if (self.config.closeOnSelect) {
                var single = self.config.mode === "single" && !self.config.enableTime;
                var range = self.config.mode === "range" &&
                    self.selectedDates.length === 2 &&
                    !self.config.enableTime;
                if (single || range) {
                    focusAndClose();
                }
            }
            triggerChange();
        }
        var CALLBACKS = {
            locale: [setupLocale, updateWeekdays],
            showMonths: [buildMonths, setCalendarWidth, buildWeekdays],
            minDate: [jumpToDate],
            maxDate: [jumpToDate],
        };
        function set(option, value) {
            if (option !== null && typeof option === "object") {
                Object.assign(self.config, option);
                for (var key in option) {
                    if (CALLBACKS[key] !== undefined)
                        CALLBACKS[key].forEach(function (x) { return x(); });
                }
            }
            else {
                self.config[option] = value;
                if (CALLBACKS[option] !== undefined)
                    CALLBACKS[option].forEach(function (x) { return x(); });
                else if (HOOKS.indexOf(option) > -1)
                    self.config[option] = arrayify(value);
            }
            self.redraw();
            updateValue(true);
        }
        function setSelectedDate(inputDate, format) {
            var dates = [];
            if (inputDate instanceof Array)
                dates = inputDate.map(function (d) { return self.parseDate(d, format); });
            else if (inputDate instanceof Date || typeof inputDate === "number")
                dates = [self.parseDate(inputDate, format)];
            else if (typeof inputDate === "string") {
                switch (self.config.mode) {
                    case "single":
                    case "time":
                        dates = [self.parseDate(inputDate, format)];
                        break;
                    case "multiple":
                        dates = inputDate
                            .split(self.config.conjunction)
                            .map(function (date) { return self.parseDate(date, format); });
                        break;
                    case "range":
                        dates = inputDate
                            .split(self.l10n.rangeSeparator)
                            .map(function (date) { return self.parseDate(date, format); });
                        break;
                }
            }
            else
                self.config.errorHandler(new Error("Invalid date supplied: " + JSON.stringify(inputDate)));
            self.selectedDates = (self.config.allowInvalidPreload
                ? dates
                : dates.filter(function (d) { return d instanceof Date && isEnabled(d, false); }));
            if (self.config.mode === "range")
                self.selectedDates.sort(function (a, b) { return a.getTime() - b.getTime(); });
        }
        function setDate(date, triggerChange, format) {
            if (triggerChange === void 0) { triggerChange = false; }
            if (format === void 0) { format = self.config.dateFormat; }
            if ((date !== 0 && !date) || (date instanceof Array && date.length === 0))
                return self.clear(triggerChange);
            setSelectedDate(date, format);
            self.latestSelectedDateObj =
                self.selectedDates[self.selectedDates.length - 1];
            self.redraw();
            jumpToDate(undefined, triggerChange);
            setHoursFromDate();
            if (self.selectedDates.length === 0) {
                self.clear(false);
            }
            updateValue(triggerChange);
            if (triggerChange)
                triggerEvent("onChange");
        }
        function parseDateRules(arr) {
            return arr
                .slice()
                .map(function (rule) {
                if (typeof rule === "string" ||
                    typeof rule === "number" ||
                    rule instanceof Date) {
                    return self.parseDate(rule, undefined, true);
                }
                else if (rule &&
                    typeof rule === "object" &&
                    rule.from &&
                    rule.to)
                    return {
                        from: self.parseDate(rule.from, undefined),
                        to: self.parseDate(rule.to, undefined),
                    };
                return rule;
            })
                .filter(function (x) { return x; }); // remove falsy values
        }
        function setupDates() {
            self.selectedDates = [];
            self.now = self.parseDate(self.config.now) || new Date();
            // Workaround IE11 setting placeholder as the input's value
            var preloadedDate = self.config.defaultDate ||
                ((self.input.nodeName === "INPUT" ||
                    self.input.nodeName === "TEXTAREA") &&
                    self.input.placeholder &&
                    self.input.value === self.input.placeholder
                    ? null
                    : self.input.value);
            if (preloadedDate)
                setSelectedDate(preloadedDate, self.config.dateFormat);
            self._initialDate =
                self.selectedDates.length > 0
                    ? self.selectedDates[0]
                    : self.config.minDate &&
                        self.config.minDate.getTime() > self.now.getTime()
                        ? self.config.minDate
                        : self.config.maxDate &&
                            self.config.maxDate.getTime() < self.now.getTime()
                            ? self.config.maxDate
                            : self.now;
            self.currentYear = self._initialDate.getFullYear();
            self.currentMonth = self._initialDate.getMonth();
            if (self.selectedDates.length > 0)
                self.latestSelectedDateObj = self.selectedDates[0];
            if (self.config.minTime !== undefined)
                self.config.minTime = self.parseDate(self.config.minTime, "H:i");
            if (self.config.maxTime !== undefined)
                self.config.maxTime = self.parseDate(self.config.maxTime, "H:i");
            self.minDateHasTime =
                !!self.config.minDate &&
                    (self.config.minDate.getHours() > 0 ||
                        self.config.minDate.getMinutes() > 0 ||
                        self.config.minDate.getSeconds() > 0);
            self.maxDateHasTime =
                !!self.config.maxDate &&
                    (self.config.maxDate.getHours() > 0 ||
                        self.config.maxDate.getMinutes() > 0 ||
                        self.config.maxDate.getSeconds() > 0);
        }
        function setupInputs() {
            self.input = getInputElem();
            /* istanbul ignore next */
            if (!self.input) {
                self.config.errorHandler(new Error("Invalid input element specified"));
                return;
            }
            // hack: store previous type to restore it after destroy()
            self.input._type = self.input.type;
            self.input.type = "text";
            self.input.classList.add("flatpickr-input");
            self._input = self.input;
            if (self.config.altInput) {
                // replicate self.element
                self.altInput = createElement(self.input.nodeName, self.config.altInputClass);
                self._input = self.altInput;
                self.altInput.placeholder = self.input.placeholder;
                self.altInput.disabled = self.input.disabled;
                self.altInput.required = self.input.required;
                self.altInput.tabIndex = self.input.tabIndex;
                self.altInput.type = "text";
                self.input.setAttribute("type", "hidden");
                if (!self.config.static && self.input.parentNode)
                    self.input.parentNode.insertBefore(self.altInput, self.input.nextSibling);
            }
            if (!self.config.allowInput)
                self._input.setAttribute("readonly", "readonly");
            self._positionElement = self.config.positionElement || self._input;
        }
        function setupMobile() {
            var inputType = self.config.enableTime
                ? self.config.noCalendar
                    ? "time"
                    : "datetime-local"
                : "date";
            self.mobileInput = createElement("input", self.input.className + " flatpickr-mobile");
            self.mobileInput.tabIndex = 1;
            self.mobileInput.type = inputType;
            self.mobileInput.disabled = self.input.disabled;
            self.mobileInput.required = self.input.required;
            self.mobileInput.placeholder = self.input.placeholder;
            self.mobileFormatStr =
                inputType === "datetime-local"
                    ? "Y-m-d\\TH:i:S"
                    : inputType === "date"
                        ? "Y-m-d"
                        : "H:i:S";
            if (self.selectedDates.length > 0) {
                self.mobileInput.defaultValue = self.mobileInput.value = self.formatDate(self.selectedDates[0], self.mobileFormatStr);
            }
            if (self.config.minDate)
                self.mobileInput.min = self.formatDate(self.config.minDate, "Y-m-d");
            if (self.config.maxDate)
                self.mobileInput.max = self.formatDate(self.config.maxDate, "Y-m-d");
            if (self.input.getAttribute("step"))
                self.mobileInput.step = String(self.input.getAttribute("step"));
            self.input.type = "hidden";
            if (self.altInput !== undefined)
                self.altInput.type = "hidden";
            try {
                if (self.input.parentNode)
                    self.input.parentNode.insertBefore(self.mobileInput, self.input.nextSibling);
            }
            catch (_a) { }
            bind(self.mobileInput, "change", function (e) {
                self.setDate(getEventTarget(e).value, false, self.mobileFormatStr);
                triggerEvent("onChange");
                triggerEvent("onClose");
            });
        }
        function toggle(e) {
            if (self.isOpen === true)
                return self.close();
            self.open(e);
        }
        function triggerEvent(event, data) {
            // If the instance has been destroyed already, all hooks have been removed
            if (self.config === undefined)
                return;
            var hooks = self.config[event];
            if (hooks !== undefined && hooks.length > 0) {
                for (var i = 0; hooks[i] && i < hooks.length; i++)
                    hooks[i](self.selectedDates, self.input.value, self, data);
            }
            if (event === "onChange") {
                self.input.dispatchEvent(createEvent("change"));
                // many front-end frameworks bind to the input event
                self.input.dispatchEvent(createEvent("input"));
            }
        }
        function createEvent(name) {
            var e = document.createEvent("Event");
            e.initEvent(name, true, true);
            return e;
        }
        function isDateSelected(date) {
            for (var i = 0; i < self.selectedDates.length; i++) {
                if (compareDates(self.selectedDates[i], date) === 0)
                    return "" + i;
            }
            return false;
        }
        function isDateInRange(date) {
            if (self.config.mode !== "range" || self.selectedDates.length < 2)
                return false;
            return (compareDates(date, self.selectedDates[0]) >= 0 &&
                compareDates(date, self.selectedDates[1]) <= 0);
        }
        function updateNavigationCurrentMonth() {
            if (self.config.noCalendar || self.isMobile || !self.monthNav)
                return;
            self.yearElements.forEach(function (yearElement, i) {
                var d = new Date(self.currentYear, self.currentMonth, 1);
                d.setMonth(self.currentMonth + i);
                if (self.config.showMonths > 1 ||
                    self.config.monthSelectorType === "static") {
                    self.monthElements[i].textContent =
                        monthToStr(d.getMonth(), self.config.shorthandCurrentMonth, self.l10n) + " ";
                }
                else {
                    self.monthsDropdownContainer.value = d.getMonth().toString();
                }
                yearElement.value = d.getFullYear().toString();
            });
            self._hidePrevMonthArrow =
                self.config.minDate !== undefined &&
                    (self.currentYear === self.config.minDate.getFullYear()
                        ? self.currentMonth <= self.config.minDate.getMonth()
                        : self.currentYear < self.config.minDate.getFullYear());
            self._hideNextMonthArrow =
                self.config.maxDate !== undefined &&
                    (self.currentYear === self.config.maxDate.getFullYear()
                        ? self.currentMonth + 1 > self.config.maxDate.getMonth()
                        : self.currentYear > self.config.maxDate.getFullYear());
        }
        function getDateStr(format) {
            return self.selectedDates
                .map(function (dObj) { return self.formatDate(dObj, format); })
                .filter(function (d, i, arr) {
                return self.config.mode !== "range" ||
                    self.config.enableTime ||
                    arr.indexOf(d) === i;
            })
                .join(self.config.mode !== "range"
                ? self.config.conjunction
                : self.l10n.rangeSeparator);
        }
        /**
         * Updates the values of inputs associated with the calendar
         */
        function updateValue(triggerChange) {
            if (triggerChange === void 0) { triggerChange = true; }
            if (self.mobileInput !== undefined && self.mobileFormatStr) {
                self.mobileInput.value =
                    self.latestSelectedDateObj !== undefined
                        ? self.formatDate(self.latestSelectedDateObj, self.mobileFormatStr)
                        : "";
            }
            self.input.value = getDateStr(self.config.dateFormat);
            if (self.altInput !== undefined) {
                self.altInput.value = getDateStr(self.config.altFormat);
            }
            if (triggerChange !== false)
                triggerEvent("onValueUpdate");
        }
        function onMonthNavClick(e) {
            var eventTarget = getEventTarget(e);
            var isPrevMonth = self.prevMonthNav.contains(eventTarget);
            var isNextMonth = self.nextMonthNav.contains(eventTarget);
            if (isPrevMonth || isNextMonth) {
                changeMonth(isPrevMonth ? -1 : 1);
            }
            else if (self.yearElements.indexOf(eventTarget) >= 0) {
                eventTarget.select();
            }
            else if (eventTarget.classList.contains("arrowUp")) {
                self.changeYear(self.currentYear + 1);
            }
            else if (eventTarget.classList.contains("arrowDown")) {
                self.changeYear(self.currentYear - 1);
            }
        }
        function timeWrapper(e) {
            e.preventDefault();
            var isKeyDown = e.type === "keydown", eventTarget = getEventTarget(e), input = eventTarget;
            if (self.amPM !== undefined && eventTarget === self.amPM) {
                self.amPM.textContent =
                    self.l10n.amPM[int(self.amPM.textContent === self.l10n.amPM[0])];
            }
            var min = parseFloat(input.getAttribute("min")), max = parseFloat(input.getAttribute("max")), step = parseFloat(input.getAttribute("step")), curValue = parseInt(input.value, 10), delta = e.delta ||
                (isKeyDown ? (e.which === 38 ? 1 : -1) : 0);
            var newValue = curValue + step * delta;
            if (typeof input.value !== "undefined" && input.value.length === 2) {
                var isHourElem = input === self.hourElement, isMinuteElem = input === self.minuteElement;
                if (newValue < min) {
                    newValue =
                        max +
                            newValue +
                            int(!isHourElem) +
                            (int(isHourElem) && int(!self.amPM));
                    if (isMinuteElem)
                        incrementNumInput(undefined, -1, self.hourElement);
                }
                else if (newValue > max) {
                    newValue =
                        input === self.hourElement ? newValue - max - int(!self.amPM) : min;
                    if (isMinuteElem)
                        incrementNumInput(undefined, 1, self.hourElement);
                }
                if (self.amPM &&
                    isHourElem &&
                    (step === 1
                        ? newValue + curValue === 23
                        : Math.abs(newValue - curValue) > step)) {
                    self.amPM.textContent =
                        self.l10n.amPM[int(self.amPM.textContent === self.l10n.amPM[0])];
                }
                input.value = pad(newValue);
            }
        }
        init();
        return self;
    }
    /* istanbul ignore next */
    function _flatpickr(nodeList, config) {
        // static list
        var nodes = Array.prototype.slice
            .call(nodeList)
            .filter(function (x) { return x instanceof HTMLElement; });
        var instances = [];
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            try {
                if (node.getAttribute("data-fp-omit") !== null)
                    continue;
                if (node._flatpickr !== undefined) {
                    node._flatpickr.destroy();
                    node._flatpickr = undefined;
                }
                node._flatpickr = FlatpickrInstance(node, config || {});
                instances.push(node._flatpickr);
            }
            catch (e) {
                console.error(e);
            }
        }
        return instances.length === 1 ? instances[0] : instances;
    }
    /* istanbul ignore next */
    if (typeof HTMLElement !== "undefined" &&
        typeof HTMLCollection !== "undefined" &&
        typeof NodeList !== "undefined") {
        // browser env
        HTMLCollection.prototype.flatpickr = NodeList.prototype.flatpickr = function (config) {
            return _flatpickr(this, config);
        };
        HTMLElement.prototype.flatpickr = function (config) {
            return _flatpickr([this], config);
        };
    }
    /* istanbul ignore next */
    var flatpickr = function (selector, config) {
        if (typeof selector === "string") {
            return _flatpickr(window.document.querySelectorAll(selector), config);
        }
        else if (selector instanceof Node) {
            return _flatpickr([selector], config);
        }
        else {
            return _flatpickr(selector, config);
        }
    };
    /* istanbul ignore next */
    flatpickr.defaultConfig = {};
    flatpickr.l10ns = {
        en: __assign({}, english),
        default: __assign({}, english),
    };
    flatpickr.localize = function (l10n) {
        flatpickr.l10ns.default = __assign(__assign({}, flatpickr.l10ns.default), l10n);
    };
    flatpickr.setDefaults = function (config) {
        flatpickr.defaultConfig = __assign(__assign({}, flatpickr.defaultConfig), config);
    };
    flatpickr.parseDate = createDateParser({});
    flatpickr.formatDate = createDateFormatter({});
    flatpickr.compareDates = compareDates;
    /* istanbul ignore next */
    if (typeof jQuery !== "undefined" && typeof jQuery.fn !== "undefined") {
        jQuery.fn.flatpickr = function (config) {
            return _flatpickr(this, config);
        };
    }
    // eslint-disable-next-line @typescript-eslint/camelcase
    Date.prototype.fp_incr = function (days) {
        return new Date(this.getFullYear(), this.getMonth(), this.getDate() + (typeof days === "string" ? parseInt(days, 10) : days));
    };
    if (typeof window !== "undefined") {
        window.flatpickr = flatpickr;
    }

    return flatpickr;

})));


/***/ }),

/***/ "./node_modules/flatpickr/dist/l10n/sr.js":
/*!************************************************!*\
  !*** ./node_modules/flatpickr/dist/l10n/sr.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function (global, factory) {
   true ? factory(exports) :
  undefined;
}(this, (function (exports) { 'use strict';

  var fp = typeof window !== "undefined" && window.flatpickr !== undefined
      ? window.flatpickr
      : {
          l10ns: {},
      };
  var Serbian = {
      weekdays: {
          shorthand: ["Ned", "Pon", "Uto", "Sre", "Čet", "Pet", "Sub"],
          longhand: [
              "Nedelja",
              "Ponedeljak",
              "Utorak",
              "Sreda",
              "Četvrtak",
              "Petak",
              "Subota",
          ],
      },
      months: {
          shorthand: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "Maj",
              "Jun",
              "Jul",
              "Avg",
              "Sep",
              "Okt",
              "Nov",
              "Dec",
          ],
          longhand: [
              "Januar",
              "Februar",
              "Mart",
              "April",
              "Maj",
              "Jun",
              "Jul",
              "Avgust",
              "Septembar",
              "Oktobar",
              "Novembar",
              "Decembar",
          ],
      },
      firstDayOfWeek: 1,
      weekAbbreviation: "Ned.",
      rangeSeparator: " do ",
      time_24hr: true,
  };
  fp.l10ns.sr = Serbian;
  var sr = fp.l10ns;

  exports.Serbian = Serbian;
  exports.default = sr;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


/***/ }),

/***/ "./src/scripts/class.js":
/*!******************************!*\
  !*** ./src/scripts/class.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
add description for this class
*/
module.exports =
/*#__PURE__*/
function () {
  function NewElement(grandParent, parentElement) {
    var parentClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ['form-group'];
    var titleElement = arguments.length > 3 ? arguments[3] : undefined;
    var titleClass = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : ['form-text'];
    var titleText = arguments.length > 5 ? arguments[5] : undefined;
    var inputClass = arguments.length > 6 ? arguments[6] : undefined;
    var inputPlaceholder = arguments.length > 7 ? arguments[7] : undefined;
    var inputName = arguments.length > 8 ? arguments[8] : undefined;
    var inputPattern = arguments.length > 9 ? arguments[9] : undefined;

    _classCallCheck(this, NewElement);

    this.grandParent = grandParent, this.parentElement = parentElement, this.parentClass = parentClass, this.titleElement = titleElement, this.titleClass = titleClass, this.titleText = titleText, this.inputClass = inputClass, this.inputPlaceholder = inputPlaceholder, this.inputName = inputName, this.inputPattern = inputPattern;
  }

  _createClass(NewElement, [{
    key: "addElement",
    value: function addElement() {
      // add parent div
      var newParentElement = document.createElement(this.parentElement);
      newParentElement.className += this.parentClass; // create title and append it to parent div

      var elementTitle = document.createElement(this.titleElement);
      elementTitle.className += this.titleClass;
      var elementTitleText = document.createTextNode(this.titleText);
      elementTitle.appendChild(elementTitleText); // create remove icon

      var removeField = document.createElement('span');
      removeField.className += 'float-right removeField';
      var removeFieldIcon = document.createTextNode('-');
      removeField.appendChild(removeFieldIcon); // adding remove icon to title element

      newParentElement.appendChild(removeField); // append title tag to parent div

      newParentElement.appendChild(elementTitle); // create input field and add class, placeholder and name values

      var newInputField = document.createElement('input');
      newInputField.className += this.inputClass;
      newInputField.placeholder = this.inputPlaceholder;
      newInputField.name = this.inputName;
      newInputField.pattern = this.inputPattern; // add input field to parent

      newParentElement.appendChild(newInputField); // append everything to grand parent

      var grandParent = document.querySelector(this.grandParent);
      grandParent.appendChild(newParentElement); // grandParent.insertBefore(newParentElement, grandParent.childNodes[this.insertBefore])
      // set focus to last created element

      newInputField.focus();
    }
  }, {
    key: "removeElement",
    value: function removeElement(elementName) {
      var elementToBeRemoved = document.querySelectorAll(elementName);
      elementToBeRemoved.forEach(function (item) {
        item.addEventListener('click', function (e) {
          item.parentNode.remove();
        });
      });
    }
  }]);

  return NewElement;
}();

/***/ }),

/***/ "./src/scripts/functions.js":
/*!**********************************!*\
  !*** ./src/scripts/functions.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.removeElement = function (element1, element2) {
  element1.addEventListener('click', function (e) {
    e.preventDefault();
    var itemToRemove = e.target.innerText;
    var index = element2.indexOf(itemToRemove);
    element2.splice(index, 1);

    if (element1.children.length === 1) {
      e.target.remove();
      element1.remove();
    } else {
      e.target.remove();
    }
  });
};

exports.deleteDocument = function (selector, message, url, redirect, error) {
  var deleteDocument = document.querySelectorAll(selector);
  deleteDocument.forEach(function (item) {
    item.addEventListener('click', function (e) {
      if (confirm(message)) {
        var id = e.target.getAttribute('data-id');
        url += id;
        fetch(url, {
          method: 'delete'
        }).then(function (response) {
          response.json().then(function (data) {
            console.log(data);
          });
          window.location.href = redirect;
        })["catch"](function (e) {
          alert(error);
        });
      } else {
        window.location.href = redirect;
      }
    });
  });
};

exports.renderAnalysisResult = function (analysis, prices, resultDiv, itemsArray) {
  //check if analysis is already in localstorage
  var analysisPositionArr = itemsArray.findIndex(function (item) {
    return item.name === prices[i].name;
  });
  var tr = document.createElement('tr'); //td analysis name and preview icon

  var tdName = document.createElement('td');
  var analysisName = document.createTextNode(prices[i].name);
  var analysisLink = document.createElement('a');
  analysisLink.setAttribute('href', '/results/analysis/' + prices[i].slug);
  analysisLink.className = 'nolink';
  analysisLink.appendChild(analysisName);
  var previewIcon = document.createElement('img');
  previewIcon.setAttribute('src', '/images/detail.svg');
  previewIcon.setAttribute('title', prices[i].preview);
  previewIcon.className = "tooltipImg mr-2";
  previewIcon.setAttribute('data-toggle', 'tooltip');
  tdName.appendChild(previewIcon);
  tdName.appendChild(analysisLink);
  tr.appendChild(tdName); // displab analysis abbreviation
  // let abbr = document.createElement('td')
  // let abbrName
  //
  // for(y=0; y<prices[i].abbr.length; y++) {
  //   abbrName = document.createTextNode(prices[i].abbr[y].join(', '))
  //   abbr.appendChild(abbrName)
  //   tr.appendChild(abbr)
  // }
  //display alternative name for analysis

  var alt = document.createElement('td');
  var altName;

  for (y = 0; y < prices[i].alt.length; y++) {
    console.log(prices[i].alt[y].join(', '));
    altName = document.createTextNode(prices[i].alt[y].join(', '));
    alt.appendChild(altName);
    tr.appendChild(alt);
  } //display analysis groupName


  var tdGroupName = document.createElement('td');
  var groupName = document.createTextNode(prices[i].groupName);
  tdGroupName.appendChild(groupName);
  tr.appendChild(tdGroupName); //display hospital icon if analysis is available
  //ako nije dostupna stavi hospital-alt-off.svg

  var hospital = document.createElement('td');
  var hospitalIcon = document.createElement('img');

  if (prices[i].availableHC) {
    hospitalIcon.setAttribute('src', '/images/hospital-alt.svg');
    hospitalIcon.setAttribute('data-toggle', 'tooltip');
    hospitalIcon.setAttribute('title', 'Analizu je moguće uraditi u domu zdravlja o trošku zdravstvenog osiguranja.');
  } else {
    hospitalIcon.setAttribute('src', '/images/hospital-alt_off.svg');
    hospitalIcon.setAttribute('data-toggle', 'tooltip');
    hospitalIcon.setAttribute('title', 'Analizu nije moguće uraditi u domu zdravlja o trošku zdravstvenog osiguranja.');
  }

  hospital.appendChild(hospitalIcon);
  tr.appendChild(hospital); //display min and max price

  var minmaxPrice = document.createElement('td');
  var priceSpan = document.createElement('span');
  priceSpan.className = 'font-weight-bold'; // let priceRange = document.createTextNode(`${pricesMin[i][0].cenovnik[0].cena} - ${pricesMax[i][0].cenovnik[0].cena}`)

  var priceRange = document.createTextNode("".concat(prices[i].minPrice, " - ").concat(prices[i].maxPrice));
  priceSpan.appendChild(priceRange);
  minmaxPrice.appendChild(priceSpan);
  tr.appendChild(minmaxPrice); //create btn for adding analysis to basket

  var addAnalysisBtnTd = document.createElement('td');
  var addAnalysisBtn = document.createElement('button');
  var addAnalysisBtnText;

  if (analysisPositionArr === -1) {
    addAnalysisBtn.className = 'btn btn-outline-success float-right btn-block text-uppercase addAnalysis';
    addAnalysisBtnText = document.createTextNode('dodaj');
  } else {
    addAnalysisBtnText = document.createTextNode("\u2714");
    addAnalysisBtn.className = 'btn btn-outline-success float-right btn-block text-uppercase deleteAnalysis';
    addAnalysisBtn.disabled = true;
  }

  addAnalysisBtn.setAttribute('data-analysisId', prices[i]._id);
  addAnalysisBtn.setAttribute('data-analysisName', prices[i].name);
  addAnalysisBtn.setAttribute('data-groupImg', prices[i].iconPath);
  addAnalysisBtn.appendChild(addAnalysisBtnText);
  addAnalysisBtnTd.appendChild(addAnalysisBtn);
  tr.appendChild(addAnalysisBtnTd);
  resultDiv.appendChild(tr);
};

exports.displayBasket = function (itemsArray) {
  // display 'shopping' basket
  document.querySelector('.card').classList.remove('d-none'); //put number of selected analyisis next to basket title

  var basketTitle = document.createTextNode(" (".concat(itemsArray.length, ")"));
  var cardHeader = document.getElementById('numOfAnalysis');
  cardHeader.appendChild(basketTitle); // const data = JSON.parse(localStorage.getItem('items'))

  itemsArray.forEach(function (analysis) {
    //create li element for each analysis selected
    var analysisAdded = document.createElement('li');
    analysisAdded.className = 'list-group-item list-group-item-action'; //creating group image

    var groupImage = document.createElement('img');
    groupImage.classList = 'labGroupIconSelectedAnalysis';
    groupImage.setAttribute('src', '/images/' + analysis.logo); //creating text with analysis name

    var analysisName = document.createTextNode(analysis.name);
    var analysisLink = document.createElement('a');
    var slug = analysis.name.split(' ');
    var urlSlug = slug.join('-');
    analysisLink.setAttribute('href', '/results/analysis/' + urlSlug);
    analysisLink.className = 'nolink analysisBasketLiItem'; // analysisLink.setAttribute('target', '_blank')

    analysisLink.appendChild(analysisName); //creating span element for remove icon

    var removeSpan = document.createElement('span');
    removeSpan.className = 'float-right remove';
    var removeImg = document.createElement('img');
    removeImg.setAttribute('src', '/images/closeBtn.svg');
    removeImg.className = 'remove-analysis-from-basket';
    removeSpan.appendChild(removeImg);
    analysisAdded.appendChild(groupImage);
    analysisAdded.appendChild(analysisLink);
    analysisAdded.appendChild(removeSpan);
    var selectedAnalysis = document.getElementById('selectedAnalysis'); //get position of analysis in array

    var analysisPositionArr = itemsArray.findIndex(function (items) {
      return analysis.name === items.name;
    });
    selectedAnalysis.insertBefore(analysisAdded, selectedAnalysis.childNodes[analysisPositionArr]);
  });
};

exports.removeAnalysis = function (itemsArray, checkout) {
  //remove analysis from local storage
  var analysisBasket = document.getElementById('selectedAnalysis');
  analysisBasket.addEventListener('click', function (e) {
    if (e.target.classList.contains('remove-analysis-from-basket')) {
      var selectedAnalysisBasket = e.target.parentNode.parentNode;
      var indexOfAnalysisName = selectedAnalysisBasket.innerText;
      var localStorageItems = JSON.parse(localStorage.getItem('items'));
      var nameIndex = localStorageItems.findIndex(function (item) {
        return item.name === indexOfAnalysisName;
      });
      localStorageItems.splice(nameIndex, 1);
      items = JSON.stringify(localStorageItems);
      selectedAnalysisBasket.remove(); //remove element from itemsarray

      var removedValue = itemsArray.splice(nameIndex, 1);
      localStorage.setItem('items', items);
      var basketTitle = document.createTextNode(" (".concat(itemsArray.length, ") "));
      var cardHeader = document.getElementById('numOfAnalysis');
      cardHeader.innerHTML = '';
      cardHeader.appendChild(basketTitle); //hide basket if all analysis are removed

      if (itemsArray.length == 0) {
        document.querySelector('.card').classList.add('d-none');
        checkout.classList.add('d-none');
      }

      checkout.innerText = itemsArray.length; //enable button for the analysis removed
      // let enableButton = document.querySelectorAll('#resultTable tr>td>button')

      var enableButton = document.querySelectorAll('.deleteAnalysis');
      enableButton.forEach(function (item) {
        if (item.getAttribute('data-analysisName') == removedValue[0].name) {
          item.disabled = false;
          item.textContent = 'dodaj';
          item.classList.remove('deleteAnalysis');
          item.classList.add('addAnalysis');
        }
      }); //enable button end
    } // remove analysis from basket

  });
};

exports.addAnalysis = function (itemsArray, resultDiv, checkout) {
  //adding analysis to sidebar shopping cart
  resultDiv.addEventListener('click', function (e) {
    if (e.target.tagName === 'BUTTON' && e.target.classList.contains('addAnalysis') && itemsArray.length < 30) {
      itemsArray.push({
        'name': e.target.getAttribute('data-analysisName'),
        'id': e.target.getAttribute('data-analysisid'),
        'logo': e.target.getAttribute('data-groupimg')
      }); //add number of analysis to navigation

      checkout.classList.remove('d-none');
      checkout.innerHTML = itemsArray.length;
      var basketTitle = document.createTextNode(" (".concat(itemsArray.length, ") "));
      var cardHeader = document.getElementById('numOfAnalysis');
      cardHeader.innerHTML = '';
      cardHeader.appendChild(basketTitle); // sorting array

      itemsArray.sort(function (a, b) {
        if (a.name > b.name) {
          return 1;
        } else {
          return -1;
        }
      });
      localStorage.setItem('items', JSON.stringify(itemsArray));
      var analysisAdded = document.createElement('li');
      analysisAdded.className = 'list-group-item list-group-item-action'; //creating group image

      var groupImage = document.createElement('img');
      groupImage.classList = 'labGroupIconSelectedAnalysis';
      groupImage.setAttribute('src', '/images/' + e.target.getAttribute('data-groupImg')); //creating text with analysis name

      var analysisName = document.createTextNode(e.target.getAttribute('data-analysisName'));
      var analysisLink = document.createElement('a');
      var slug = e.target.getAttribute('data-analysisName').split(' ');
      var urlSlug = slug.join('-');
      analysisLink.setAttribute('href', '/results/analysis/' + urlSlug);
      analysisLink.className = 'nolink analysisBasketLiItem'; // analysisLink.setAttribute('target', '_blank')

      analysisLink.appendChild(analysisName); //creating span element for remove icon

      var removeSpan = document.createElement('span');
      removeSpan.className = 'float-right remove';
      var removeImg = document.createElement('img');
      removeImg.setAttribute('src', '/images/closeBtn.svg');
      removeImg.className = 'remove-analysis-from-basket';
      removeSpan.appendChild(removeImg);
      analysisAdded.appendChild(groupImage);
      analysisAdded.appendChild(analysisLink);
      analysisAdded.appendChild(removeSpan);
      var analysisPositionArr = itemsArray.findIndex(function (item) {
        return item.name === e.target.getAttribute('data-analysisName');
      }); // if analysis is added disable add button

      if (analysisPositionArr !== -1) {
        e.target.innerHTML = '&#10004;';
        e.target.className = 'btn btn-outline-success float-right btn-block text-uppercase deleteAnalysis'; // e.target.className = 'btn btn-outline-success ml-5 mt-auto text-uppercase deleteAnalysis'

        e.target.disabled = true;
      } //insert analysis to basket


      var selectedAnalysis = document.getElementById('selectedAnalysis');
      selectedAnalysis.insertBefore(analysisAdded, selectedAnalysis.childNodes[analysisPositionArr]); //display basket when first analyis is added to basket

      document.querySelector('.card').classList.remove('d-none');
    } else if (itemsArray.length > 30) {
      console.log('ne mozete dodati vise od 30 analiza u korpu');
    }
  }); // resultdiv end
};

exports.searchLabAnalysis = function (searchString, filter) {
  // let filter = 'analiza'
  // let filterValue
  searchString.focus();
  filter.forEach(function (item) {
    if (item.checked) {
      filterValue = item.value;
      console.log('checked ' + filterValue);
    }
  }); // set focus on searchanalysis field when right arrow is pressed

  document.addEventListener('keydown', function (e) {
    if (e.keyCode === 39) {
      searchString.value = '';
      searchString.focus();
    }
  }); //check the filter value on INDEX PAGE

  filter.forEach(function (item) {
    item.addEventListener('click', function (e) {
      filterValue = e.target.value;
    });
  });
  /* by default filter is set to analiza, after 500ms
    user is redirected to results page */

  searchString.addEventListener('input', function (e) {
    console.log('trazim funkcija');

    if (searchString.value.length >= 2) {
      setTimeout(function () {
        var searchString = e.target.value;
        window.location.href = '/results/?name=' + searchString + '&filter=' + filterValue;
      }, 500);
    }
  });
};

exports.searchLab = function (searchStr, loaderWrapper, resultDiv) {
  var banner = document.querySelector('.banner');
  var analysisBasket = document.querySelector('.odabraneAnalize');
  var now = new Date();
  var day = now.getDay();
  var date = now.getDate();
  var month = now.getMonth();
  var year = now.getFullYear();
  var today = month + 1 + "/" + date + "/" + year; // let danas

  var passIds = [];
  fetch('/lab/' + searchStr).then(function (data) {
    data.json().then(function (result) {
      loaderWrapper.style.opacity = 0;
      var labTemplate = document.createElement('div');
      labTemplate.className = 'col-12 d-flex flex-row flex-wrap';

      for (i = 0; i < result.length; i++) {
        var flag = true;
        resultDiv.innerHTML = '';
        labTemplate.innerHTML += "\n          <div class=\"lab-card\">\n            <div>\n               <img src=\"\" class=\"labInfoWindowOsiguranje privateInssuranceIcon".concat(i, "\" title=\"laboratorija sara\u0111uje sa privatnim osiguranjem\">\n               <img src=\"\" class=\"labInfoWindowVerified accreditedIcon").concat(i, "\" title=\"laboratorija je akreditovana\">\n               <span class=\"labInfoWindowTitle\">").concat(result[i].labName, "</span>\n           </div>\n             <div class=\"labInfoWindow\">\n                 <img src=\"/images/lablogo/").concat(result[i].logo, "\" class=\"labLogoInfoWindow\">\n                 <p class=\"labInfoWindowAdresa\">").concat(result[i].address, "</p>\n                 <p class=\"labInfoWindowGrad\">").concat(result[i].placeId.place, " / ").concat(result[i].placeId.municipality, "</p>\n                 <p class=\"labInfoWindowTelefoni\"> ").concat(result[i].phone.join(', '), "</p>\n             </div>\n             <div class=\"labInfoFooter\">\n                 <img src=\"/images/radnoVreme_black.svg\" class=\"labInfoWindowWorkingHoursIcon\">\n                 <div class=\"radnoVreme\">Radno vreme</div>\n                 <div id='otvoreno' class='otvoreno").concat(i, " status'></div>\n                 <div class=\"labInfoRadnoVremeDetalji\">\n                   <p class=\"daysInWeek text-center\">P<span>").concat(result[i].workingHours.monday.opens, " - ").concat(result[i].workingHours.monday.closes, "</span></p>\n                   <p class=\"daysInWeek tuesday").concat(i, " text-center\">U<span>").concat(result[i].workingHours.tuesday.opens, " - ").concat(result[i].workingHours.tuesday.closes, "</span></p>\n                   <p class=\"daysInWeek wednesday").concat(i, " text-center\">S<span>").concat(result[i].workingHours.wednesday.opens, " - ").concat(result[i].workingHours.wednesday.closes, "</span></p>\n                   <p class=\"daysInWeek thursday").concat(i, " text-center\">\u010C<span>").concat(result[i].workingHours.thursday.opens, " - ").concat(result[i].workingHours.thursday.closes, "</span></p>\n                   <p class=\"daysInWeek friday").concat(i, " text-center\">P<span>").concat(result[i].workingHours.friday.opens, " - ").concat(result[i].workingHours.friday.closes, "</span></p>\n                   <p class=\"daysInWeek saturday").concat(i, " text-center\">S<span>").concat(result[i].workingHours.saturday.opens, " - ").concat(result[i].workingHours.saturday.closes, "</span></p>\n                   <p class=\"daysInWeek sunday").concat(i, " text-center\">N<span>").concat(result[i].workingHours.sunday.opens, " - ").concat(result[i].workingHours.sunday.closes, "</span></p>\n                 </div>\n              </div>\n              <button type=\"button\" class=\"btn btn-block btnLabDetails buttonId mt-2\" data-labName=\"laboratorija/").concat(result[i].slug, "\">saznaj vi\u0161e</button>\n           </div>");
        resultDiv.innerHTML = "\n           <section id=\"labDetails\">\n             <div class=\"container\">\n               <div class=\"row labContainer\">\n               </div>\n             </div>\n           </section>"; //append labcard to page

        document.querySelector('.labContainer').appendChild(labTemplate);
        var currentDay = void 0;
        var currentDayNum = void 0;

        switch (day) {
          case 0:
            currentDay = 'sunday';
            currentDayNum = 0;
            break;

          case 1:
            currentDay = 'monday';
            currentDayNum = 1;
            break;

          case 2:
            currentDay = 'tuesday';
            currentDayNum = 2;
            break;

          case 3:
            currentDay = 'wednesday';
            currentDayNum = 3;
            break;

          case 4:
            currentDay = 'thursday';
            currentDayNum = 4;
            break;

          case 5:
            currentDay = 'friday';
            currentDayNum = 5;
            break;

          case 6:
            currentDay = 'saturday';
            currentDayNum = 6;
            break;

          default:
            console.log('dan nije ok');
        }

        var radnoVreme = document.querySelector('.otvoreno' + i);
        var todayIs = document.querySelector('.' + currentDay + i);
        var privateInsurance = document.querySelector('.privateInssuranceIcon' + i);
        var accredited = document.querySelector('.accreditedIcon' + i);
        var labDetailsBtn = document.querySelectorAll('.buttonId');
        labDetailsBtn.forEach(function (item) {
          item.addEventListener('click', function (e) {
            itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
            itemsArray.forEach(function (item) {
              passIds.push(item.id);
            });
            window.location = "/".concat(e.target.getAttribute('data-labName'), "/").concat(passIds);
          });
        });

        if (result[i]["private"]) {
          privateInsurance.setAttribute('src', '/images/osiguranje.svg');
        } else {
          privateInsurance.remove();
        }

        if (result[i].accredited) {
          accredited.setAttribute('src', '/images/verified.svg');
        } else {
          accredited.remove();
        }

        if (result[i].open24h) {
          radnoVreme.classList.add('open');
          radnoVreme.innerText = 'otvoreno 24h';
          todayIs.classList.add('open');
        } else if (day === currentDayNum) {
          var openTime = result[i].workingHours[currentDay].opens;
          var closingTime = result[i].workingHours[currentDay].closes;
          var todayOpenTime = new Date(today + ' ' + openTime + ':00');
          var todayClosingTime = new Date(today + ' ' + closingTime + ':00');
          var nowTimeStamp = now.getTime();
          var closingSoon = todayClosingTime - nowTimeStamp;
          var closingIn = Math.ceil(closingSoon / 1000 / 60);

          if (closingIn < 60 && closingIn > 0) {
            radnoVreme.classList.add('closedSoon');
            radnoVreme.innerText = "zatvara se za ".concat(closingIn, " min.");
            todayIs.classList.add('active');
          } else if (nowTimeStamp > todayOpenTime.getTime() && todayClosingTime.getTime() > nowTimeStamp) {
            radnoVreme.classList.add('open');
            radnoVreme.innerText = 'otvoreno';
            todayIs.classList.add('open');
          } else {
            radnoVreme.classList.add('closed');
            radnoVreme.innerText = 'zatvoreno';
            todayIs.classList.add('closed');
          }
        } else {
          console.log('lab nije odredio radno vreme');
        }
      } //for loop end

    }); //data json end
  }); //fetch end
};

/***/ }),

/***/ "./src/scripts/price.js":
/*!******************************!*\
  !*** ./src/scripts/price.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.createPrice = function () {
  var searchLab = document.getElementById('searchLabName');
  var queryResultUl = document.getElementById('labFound');
  var labName = document.getElementById('labName');
  searchLab.addEventListener('input', function (e) {
    if (searchLab.value.length > 2) {
      fetch('/lab/' + e.target.value).then(function (data) {
        data.json().then(function (result) {
          for (i = 0; i < result.length; i++) {
            var liItem = document.createElement('li');
            liItem.className += "list-group-item";
            var link = document.createElement('a');
            link.href = result[i]._id;
            liItem.appendChild(link);

            var _labName = document.createTextNode(result[i].labName);

            link.appendChild(_labName);
            queryResultUl.appendChild(liItem);
          } // for end

        }); // data.json end
      }); // fetch end
    } // if end
    else {
        console.log('please enter at lease 2 chars');
        queryResultUl.innerHTML = '';
      }
  });
  var labSelected = document.getElementById('labFound');
  labSelected.addEventListener('click', function (e) {
    e.preventDefault();
    searchLab.value = e.srcElement.attributes.href.textContent;
    labName.value = e.target.innerText;
    queryResultUl.innerHTML = '';
  }); //search for analysis

  var searchAnalysis = document.getElementById('searchAnalysis');
  var getAnalyisisNameDiv = document.getElementById('analysisFound');
  var analysisParentDiv = document.getElementById('analysisDiv');
  var priceParent = document.getElementById('priceList'); // set focus on searchanalysis field when up arrow is pressed

  document.addEventListener('keydown', function (e) {
    if (e.keyCode === 38) {
      searchAnalysis.focus();
    }
  });
  searchAnalysis.addEventListener('input', function (e) {
    if (searchAnalysis.value.length > 2) {
      fetch('/analysis/prices/' + e.target.value).then(function (data) {
        data.json().then(function (result) {
          var analysis = result.analysisName;
          getAnalyisisNameDiv.innerHTML = '';

          for (i = 0; i < analysis.length; i++) {
            var liItem = document.createElement('li');
            liItem.className += "list-group-item";
            var link = document.createElement('a');
            link.href = analysis[i]._id;
            liItem.appendChild(link);
            var analysisName = document.createTextNode(analysis[i].analysisName);
            link.appendChild(analysisName);
            getAnalyisisNameDiv.appendChild(liItem);
          } // for end

        }); // datajson end
      }); // fetch end
    } else {
      getAnalyisisNameDiv.innerHTML = '';
    }
  }); // searchAnalysis event listener end
  // creating input fields

  var analysisFound = document.getElementById('analysisFound');
  analysisFound.addEventListener('click', function (e) {
    e.preventDefault();
    var hiddenId = document.createElement('input');
    hiddenId.type = 'hidden';
    hiddenId.name = 'cenovnik[analiza][]';
    hiddenId.setAttribute('value', e.srcElement.attributes.href.textContent);
    var analysisRow = document.createElement('div');
    analysisRow.className = 'form-row';
    var analysisNewDiv = document.createElement('div');
    analysisNewDiv.className = 'form-group mt-2 col-6';
    var analysisName = document.createElement('input');
    analysisName.type = 'text';
    analysisName.className = 'form-control';
    analysisName.name = 'cenovnik[imeanalize][]';
    analysisName.setAttribute('value', e.target.innerText);
    analysisName.setAttribute('readonly', true);
    var analysisPrice = document.createElement('div');
    analysisPrice.className = 'form-group mt-2 col-5';
    var deletePrice = document.createElement('div');
    deletePrice.className = 'form-group mt-2 col-1';
    var price = document.createElement('input');
    price.type = 'text';
    price.setAttribute('placeholder', 'upisi cenu');
    price.name = 'cenovnik[cena][]';
    price.className = 'form-control';
    var deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger float-right deletePrice';
    deleteButton.type = 'button';
    deleteButton.name = 'button';
    var buttonText = document.createTextNode('delete');
    deleteButton.appendChild(buttonText);
    deletePrice.appendChild(deleteButton);
    analysisNewDiv.appendChild(analysisName);
    analysisPrice.appendChild(price);
    analysisNewDiv.appendChild(hiddenId);
    analysisRow.appendChild(analysisNewDiv);
    analysisRow.appendChild(analysisPrice);
    analysisRow.appendChild(deletePrice); // analysisParentDiv.appendChild(analysisRow)

    priceParent.appendChild(analysisRow);
    price.focus();
    searchAnalysis.value = '';
    getAnalyisisNameDiv.innerHTML = '';
  }); // analysisfound end
  // delete price from pricelist

  var deletePrice = document.getElementById('priceList'); // console.log(deletePrice)

  deletePrice.addEventListener('click', function (e) {
    // console.log(deletePrice)
    if (e.target.classList.contains('deletePrice')) {
      e.preventDefault();
      e.target.parentNode.parentNode.remove();
    }
  });
};

/***/ }),

/***/ "./src/scripts/script.js":
/*!*******************************!*\
  !*** ./src/scripts/script.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

__webpack_require__(/*! ../scss/style.scss */ "./src/scss/style.scss");

var flatpickr = __webpack_require__(/*! flatpickr */ "./node_modules/flatpickr/dist/flatpickr.js");

var Serbian = __webpack_require__(/*! flatpickr/dist/l10n/sr.js */ "./node_modules/flatpickr/dist/l10n/sr.js")["default"].sr; // let summernote = require('./summernote-ext-addclass')


var NewElement = __webpack_require__(/*! ./class */ "./src/scripts/class.js");

var PriceList = __webpack_require__(/*! ./price */ "./src/scripts/price.js");

var helper = __webpack_require__(/*! ./functions */ "./src/scripts/functions.js"); //tooltip initialization


$(document).ready(function () {
  $('body').tooltip({
    selector: '[data-toggle="tooltip"]',
    placement: "top",
    delay: {
      show: 100,
      hide: 100
    },
    boundary: 'window',
    tooltipClass: "tooltip"
  });
  var maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7);
  console.log(maxDate);
  var datePicker1 = flatpickr('#datepicker1', {
    dateFormat: 'd-m-Y',
    enableTime: false,
    time_24hr: true,
    "locale": Serbian,
    minDate: "today",
    allowInput: true,
    maxDate: maxDate
  });
  var datePicker2 = flatpickr('#datepicker2', {
    dateFormat: 'd-m-Y H:i',
    enableTime: true,
    time_24hr: true,
    "locale": Serbian,
    minDate: "today",
    allowInput: true,
    maxDate: maxDate
  });
  $('#resultTable, #resultTableAnalysis').on('mouseenter', 'tr>td>img.tooltipImg', function () {
    var imageSrc = $(this).attr('src'); // if (imageSrc == '/images/detail.svg') {

    $(this).attr('src', '/images/detail_mv.svg');
  }).on('mouseleave', 'tr>td>img.tooltipImg', function () {
    $(this).attr('src', '/images/detail.svg');
  });
  $('.fa-angle-down').on('click', function () {
    $(this).toggleClass('rotate');
  });
  $(".custom-file-input").on("change", function () {
    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
  });
}); // changing analysis number color on hover

$('.click-more').hover(function () {
  $(this).find("span").toggleClass("broj-analiza-hover");
}); // sticky navigation for index page

$(window).scroll(function () {
  var height = $(window).scrollTop();

  if (height > 460) {
    $("#header > nav").addClass('fixed-top-background fixed-top');
  } else {
    $("#header > nav").removeClass('fixed-top-background fixed-top');
  }
}); // sticky navigation for side menu

$(window).scroll(function () {
  var height = $(window).scrollTop();

  if (height > 120) {
    $(".odabraneAnalize").addClass('fixed-right');
  } else {
    $(".odabraneAnalize").removeClass('fixed-right');
  }
}); // scrol to top button

$('.backTotop').on('click', function () {
  $('html, body').animate({
    scrollTop: 0
  }, 1200); // return false;
}); //animate numbers on google map header

var location = window.location.pathname;
console.log(location); // GLOBAL VARIABLES
//set filter by default to analiza

var filter = 'analiza';
var checkout = document.querySelector('.checkout');
var urlArr = location.split('/');
/* check if local storage already exists,
if not create an empty array */

var itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : []; //MUST CHECK THIS!!!!!!!

/*if local storage has already some items display selected items
in sidebar basket on any page which is not index */

var checkUrl = /result.*/;
var group = /group/;

if (itemsArray.length > 0 && (location.match(group) || location.match(checkUrl))) {
  helper.displayBasket(itemsArray);
} //MUST CHECK THIS!!!!!!!
//get reference to checkout element which displays number of selected analysis in navigation


var checkCMSAdd = /add.*/;
var checkCMSAll = /all.*/;

if (itemsArray.length > 0 && !location.match(checkCMSAdd) && !location.match(checkCMSAll)) {
  checkout.classList.remove('d-none');
  checkout.textContent = itemsArray.length;
}

window.onload = function () {
  /* INDEX PAGE ***************/
  if (location === '/') {
    //get seachstring
    var mainSearch = document.getElementById('searchAnalysis'); //ger reference to filter

    var analysisRadio = document.querySelectorAll('input[name=searchFilter]'); //search for analysis or lab

    helper.searchLabAnalysis(mainSearch, analysisRadio);
  } // INDEX page end

  /* NAJBOLJA CENA **************/
  // if(document.getElementById('najboljacena') != null) {
  //   console.log('ovde sad')
  // }

  /* RESULTS PAGE ***************/
  // if (urlArr[1] === 'results' && urlArr[2] == '') {


  if (document.getElementById('results') != null) {
    var activeBtns = document.querySelectorAll('.addAnalysis');
    activeBtns.forEach(function (analysis) {
      var analysisPositionArr = itemsArray.findIndex(function (item) {
        return analysis.getAttribute("data-analysisid") === item.id;
      });

      if (analysisPositionArr !== -1) {
        analysis.innerHTML = '&#10004;';
        analysis.disabled = true;
        analysis.classList.remove('addAnalysis');
        analysis.classList.add('deleteAnalysis');
      }
    }); //show prices

    var resultDiv = document.getElementById('resultTable');

    var _municipality = document.getElementById('municipality');

    var showPriceBtn = document.querySelector('.showPrice');
    var mapArea = document.getElementById('mapPrices');
    showPriceBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      mapArea.classList.remove('d-none');
      var passIds = [];
      resultDiv.innerHTML = '';
      itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
      itemsArray.forEach(function (item) {
        passIds.push(item.id);
      });
      var municipalityValue = _municipality.options[_municipality.selectedIndex].value;
      var markers = [];
      fetch('/cenovnik/' + municipalityValue + '/' + passIds).then(function (data) {
        data.json().then(function (result) {
          loaderWrapper.style.opacity = 0;
          var labTemplate = document.createElement('div');
          labTemplate.className = 'col-12 d-flex flex-row flex-wrap';

          for (var _i = 0; _i < result.length; _i++) {
            // console.log(result[i].lab[0].workingHours)
            markers.push({
              lat: result[_i].lab[0].location.coordinates[1],
              lng: result[_i].lab[0].location.coordinates[0],
              iconImage: '/images/pinopen.svg',
              total: result[_i].total,
              name: result[_i].lab[0].labName,
              address: result[_i].lab[0].address,
              phone: result[_i].lab[0].phone,
              workinghours: result[_i].lab[0].workingHours,
              slug: result[_i].lab[0].slug
            });
            resultDiv.innerHTML = '';
            labTemplate.innerHTML += "\n\n          <div class=\"lab-card\">\n            <div>\n            ".concat(result[_i].lab[0]["private"] ? '<img src=/images/osiguranje.svg class="labInfoWindowOsiguranje privateInssuranceIcon${i}" title="laboratorija sarađuje sa privatnim osiguranjem">' : '', "\n            ").concat(result[_i].lab[0].accredited ? '<img src=/images/verified.svg class="labInfoWindowVerified accreditedIcon${i}" title="laboratorija je akreditovana">' : '', "\n            <span class=\"labInfoWindowTitle\">").concat(result[_i].lab[0].labName, "</span>\n           </div>\n             <div class=\"labInfoWindow\">\n                 <img src=\"/images/lablogo/").concat(result[_i].lab[0].logo, "\" class=\"labLogoInfoWindow\">\n\n                 <p class=\"labInfoWindowAdresa\">").concat(result[_i].lab[0].address, "</p>\n                 <p class=\"labInfoWindowGrad\"></p>\n                 <p class=\"labInfoWindowTelefoni\"> ").concat(result[_i].lab[0].phone, " </p>\n             </div>\n             <div class=\"labInfoFooter\">\n                 <img src=\"/images/radnoVreme_black.svg\" class=\"labInfoWindowWorkingHoursIcon\">\n                 <div class=\"radnoVreme\">Radno vreme</div>\n                 <div id='otvoreno' class='otvoreno status'></div>\n                 <div class=\"labInfoRadnoVremeDetalji\">\n                   <p class=\"daysInWeek monday").concat(result[_i], " text-center\">P<span>").concat(result[_i].lab[0].workingHours.monday.opens, " - ").concat(result[_i].lab[0].workingHours.monday.closes, "</span></p>\n                   <p class=\"daysInWeek tuesday").concat(result[_i], " text-center\">U<span>").concat(result[_i].lab[0].workingHours.tuesday.opens, " - ").concat(result[_i].lab[0].workingHours.tuesday.closes, "</span></p>\n                   <p class=\"daysInWeek wednesday").concat(result[_i], " text-center\">S<span>").concat(result[_i].lab[0].workingHours.wednesday.opens, " - ").concat(result[_i].lab[0].workingHours.wednesday.closes, "</span></p>\n                   <p class=\"daysInWeek thursday").concat(result[_i], " text-center\">\u010C<span>").concat(result[_i].lab[0].workingHours.thursday.opens, " - ").concat(result[_i].lab[0].workingHours.thursday.closes, "</span></p>\n                   <p class=\"daysInWeek friday").concat(result[_i], " text-center\">P<span></span>").concat(result[_i].lab[0].workingHours.friday.opens, " - ").concat(result[_i].lab[0].workingHours.friday.closes, "</p>\n                   <p class=\"daysInWeek saturday").concat(result[_i], " text-center\">S<span></span>").concat(result[_i].lab[0].workingHours.saturday.opens, " - ").concat(result[_i].lab[0].workingHours.saturday.closes, "</p>\n                   <p class=\"daysInWeek sunday").concat(result[_i], " text-center\">N<span></span>").concat(result[_i].lab[0].workingHours.sunday.opens, " - ").concat(result[_i].lab[0].workingHours.sunday.closes, "</p>\n                 </div>\n              </div>\n              <a class=\"btn btn-block btnLabDetails buttonId mt-2\" href=\"laboratorija/").concat(result[_i].lab[0].slug, "/").concat(passIds, "\">saznaj vi\u0161e</a>\n           </div>");
            resultDiv.innerHTML = "\n           <section id=\"labDetails\">\n             <div class=\"container\">\n               <div class=\"row labContainer\">\n               </div>\n             </div>\n           </section>"; //append labcard to page

            document.querySelector('.labContainer').appendChild(labTemplate);
          } // map options


          var options = {
            zoom: 16,
            // center: {lat:44.808048, lng:20.462796},
            disableDefaultUI: true,
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: true,
            rotateControl: false,
            fullscreenControl: true,
            fullscreenControlOptions: {
              position: google.maps.ControlPosition.RIGHT_BOTTOM
            },
            styles: [{
              "featureType": "administrative.country",
              "elementType": "geometry.fill",
              "stylers": [{
                "color": "#fbd2d9"
              }, {
                "visibility": "on"
              }]
            }, {
              "featureType": "administrative.country",
              "elementType": "geometry.stroke",
              "stylers": [{
                "color": "#9896a9"
              }, {
                "weight": 2
              }]
            }, {
              "featureType": "administrative.land_parcel",
              "elementType": "geometry.fill",
              "stylers": [{
                "color": "#9896a9"
              }]
            }, {
              "featureType": "administrative.land_parcel",
              "elementType": "labels",
              "stylers": [{
                "visibility": "off"
              }]
            }, {
              "featureType": "administrative.locality",
              "elementType": "geometry.fill",
              "stylers": [{
                "visibility": "on"
              }]
            }, {
              "featureType": "administrative.neighborhood",
              "elementType": "geometry.fill",
              "stylers": [{
                "visibility": "on"
              }]
            }, {
              "featureType": "administrative.neighborhood",
              "elementType": "labels",
              "stylers": [{
                "color": "#aaa9b1"
              }, {
                "visibility": "simplified"
              }]
            }, {
              "featureType": "poi",
              "elementType": "labels.text",
              "stylers": [{
                "visibility": "off"
              }]
            }, {
              "featureType": "poi.business",
              "stylers": [{
                "visibility": "off"
              }]
            }, {
              "featureType": "poi.park",
              "elementType": "geometry.fill",
              "stylers": [{
                "color": "#aadc55"
              }]
            }, {
              "featureType": "poi.park",
              "elementType": "labels.text",
              "stylers": [{
                "visibility": "off"
              }]
            }, {
              "featureType": "road",
              "elementType": "geometry.fill",
              "stylers": [{
                "color": "#ecebed"
              }, {
                "visibility": "on"
              }]
            }, {
              "featureType": "road",
              "elementType": "labels.text",
              "stylers": [{
                "color": "#d8d6dc"
              }]
            }, {
              "featureType": "road.arterial",
              "elementType": "geometry.fill",
              "stylers": [{
                "color": "#fefefe"
              }]
            }, {
              "featureType": "road.arterial",
              "elementType": "labels.text",
              "stylers": [{
                "color": "#9a9a9a"
              }, {
                "visibility": "simplified"
              }]
            }, {
              "featureType": "road.highway",
              "elementType": "labels",
              "stylers": [{
                "visibility": "off"
              }]
            }, {
              "featureType": "road.local",
              "stylers": [{
                "visibility": "off"
              }]
            }, {
              "featureType": "road.local",
              "elementType": "geometry.fill",
              "stylers": [{
                "color": "#eaecec"
              }, {
                "visibility": "on"
              }]
            }, {
              "featureType": "road.local",
              "elementType": "labels",
              "stylers": [{
                "visibility": "off"
              }]
            }, {
              "featureType": "road.local",
              "elementType": "labels.text.fill",
              "stylers": [{
                "color": "#9ba4a4"
              }, {
                "visibility": "on"
              }]
            }, {
              "featureType": "transit",
              "elementType": "geometry.fill",
              "stylers": [{
                "visibility": "off"
              }]
            }, {
              "featureType": "transit.station",
              "elementType": "geometry.fill",
              "stylers": [{
                "visibility": "on"
              }]
            }, {
              "featureType": "transit.station.bus",
              "stylers": [{
                "visibility": "simplified"
              }]
            }, {
              "featureType": "transit.station.bus",
              "elementType": "geometry.fill",
              "stylers": [{
                "color": "#ff00ff"
              }, {
                "visibility": "simplified"
              }]
            }, {
              "featureType": "water",
              "elementType": "geometry.fill",
              "stylers": [{
                "color": "#1d88e5"
              }, {
                "lightness": 15
              }]
            }]
          }; // new map

          var map = new google.maps.Map(document.getElementById('mapPrices'), options);
          map.setCenter({
            lat: result[0].lab[0].location.coordinates[1],
            lng: result[0].lab[0].location.coordinates[0]
          });

          for (i = 0; i < markers.length; i++) {
            addMarker(markers[i].lat, markers[i].lng, markers[i].total, markers[i].name, markers[i].address, markers[i].phone, markers[i].workinghours, markers[i].slug);
          } // console.log(markers)


          function addMarker(lat, lng, total, name, address, phone, workinghours, slug) {
            var marker = new google.maps.Marker({
              position: {
                lat: lat,
                lng: lng
              },
              icon: {
                url: '/images/pinprice.svg',
                labelOrigin: {
                  x: 32,
                  y: 32
                },
                scaledSize: new google.maps.Size(60, 60)
              },
              label: {
                text: total.toString(),
                fontWeight: 'bold',
                fontSize: '12px',
                color: 'white'
              },
              map: map
            });
            var infoWindow = new google.maps.InfoWindow({
              maxWidth: 600,
              content: "<p class=\"labInfoWindowTitle mb-2 pb-0\"><a href=\"/laboratorija/".concat(slug, "/").concat(passIds, "\">").concat(name, "</a></p>\n\n                      <div class=\"labInfoWindow\">\n                        <img src=\"images/placeholder.svg\" class=\"labLogoInfoWindow\">\n                        <span class=\"\">").concat(address, "</span>\n                        <span class=\"labInfoWindowTelefoni\">").concat(phone, " </span>\n                    </div>\n                    <table class=\"table table-sm workingHoursLabDetails mt-2\">\n                      <thead>\n                        <tr>\n                          <th class=\"text-center px-0 whInside\">P</th>\n                          <th class=\"text-center px-0 whInside\">U</th>\n                          <th class=\"text-center px-0 whInside\">S</th>\n                          <th class=\"text-center px-0 whInside\">\u010C</th>\n                          <th class=\"text-center px-0 whInside\">P</th>\n                          <th class=\"text-center px-0 whInside\">S</th>\n                          <th class=\"text-center px-0 whInside\">N</th>\n                        </tr>\n                      </thead>\n                      <tbody>\n                        <tr>\n                          <td class=\"whInside px-0 text-center\">").concat(workinghours.monday.opens, " - ").concat(workinghours.monday.closes, "</td>\n                          <td class=\"whInside px-0 text-center\">").concat(workinghours.tuesday.opens, " - ").concat(workinghours.tuesday.closes, "</td>\n                          <td class=\"whInside px-0 text-center radnoVreme open\">").concat(workinghours.wednesday.opens, " - ").concat(workinghours.wednesday.closes, "</td>\n                          <td class=\"whInside px-0 text-center\">").concat(workinghours.thursday.opens, " - ").concat(workinghours.thursday.closes, "</td>\n                          <td class=\"whInside px-0 text-center\">").concat(workinghours.friday.opens, " - ").concat(workinghours.friday.closes, "</td>\n                          <td class=\" whInside px-0 text-center\">").concat(workinghours.saturday.opens, " - ").concat(workinghours.saturday.closes, "</td>\n                          <td class=\"whInside px-0 text-center\">").concat(workinghours.sunday.opens, " - ").concat(workinghours.sunday.closes, "</td>\n                        </tr>\n                      </tbody>\n                    </table>\n                    ")
            });
            marker.addListener('click', function () {
              var placeMarker = infoWindow.open(map, marker);
            });
            google.maps.event.addListener(map, 'click', function () {
              infoWindow.close();
            });
          }
        }); //data json end
      }); //fetch end
    }); //create wrapper for live search icon

    var loaderWrapper = document.querySelector('.loader-wrapper'); //get seachstring
    // let mainSearchinner = document.getElementById('searchResultPage')
    //ger reference to filter
    // let analysisRadioinner = document.querySelectorAll('input[name=searchFilter]')
    //search for analysis or lab
    //proveriti da li je ovo ispod neophodno
    // helper.searchLabAnalysis(mainSearchinner,analysisRadioinner)

    var urlParams = new URLSearchParams(window.location.search);
    var myValue = urlParams.get('name');
    var myFilter = urlParams.get('filter');
    history.replaceState(null, null, "/"); // creating variable for search field and assigning value from search string

    var innerSearch = document.getElementById('searchResultPage'); //keeps search string when page is changed

    innerSearch.value = myValue;
    innerSearch.focus(); //defining new variable which will be used in queries

    var searchStr = myValue; // display checked filter

    var radioFilter = document.querySelectorAll('input[name=searchFilter]');
    radioFilter.forEach(function (item) {
      if (item.value == myFilter) {
        item.checked = true;
        console.log('checked ' + myFilter);
      }
    }); // if user is searching from home page take result div
    // let resultDiv = document.getElementById('resultTable')
    // if filter value is changed on result searchResultPage
    // taking filter value

    var _analysisRadio = document.querySelectorAll('input[name=searchFilter]');

    _analysisRadio.forEach(function (item) {
      item.addEventListener('click', function (e) {
        myFilter = e.target.value;
        console.log('kada se promeni ' + myFilter);
        innerSearch.value = '';
        innerSearch.focus();
      });
    });

    if (myFilter === 'analiza') {
      console.log('pretraga analize sa glavne stranice');
      fetch('/analysis/prices/' + searchStr).then(function (data) {
        // loaderWrapper.style.opacity = 1
        data.json().then(function (result) {
          console.log(result);
          resultDiv.innerHTML = '';
          var analysis = result.analysisName; // let pricesMin = result.minPriceArr
          // let pricesMax = result.maxPriceArr

          var prices = result.prices;

          for (i = 0; i < analysis.length; i++) {
            //creating table with result
            helper.renderAnalysisResult(analysis, prices, resultDiv, itemsArray);
          } // for end
          //when result is found remove loading icon


          loaderWrapper.style.opacity = 0;
        }); // data json end
      }); //fetch end
    } // if my filter==analiza
    else if (myFilter == 'laboratorija') {
        console.log('pretraga lab sa index strance');
        helper.searchLab(searchStr, loaderWrapper, resultDiv);
      } // else end
    // if search string is changed on result page
    // let loaderWrapper = document.querySelector('.loader-wrapper')


    innerSearch.addEventListener('input', function (e) {
      // console.log('searching'+ filter)
      var mapFrame = document.getElementById('mapPrices');
      mapFrame.classList.add('d-none');
      var searchstring = e.target.value;
      loaderWrapper.style.opacity = 1;

      if (myFilter == 'analiza' && searchstring.length >= 2) {
        fetch('/analysis/prices/' + searchstring).then(function (data) {
          data.json().then(function (result) {
            var analysis = result.analysisName; // let pricesMin = result.minPriceArr
            // let pricesMax = result.maxPriceArr

            var prices = result.prices;
            resultDiv.innerHTML = '';

            for (i = 0; i < analysis.length; i++) {
              //creating table with results
              //when typing fast parent array becomes undefined hence error
              if (typeof prices !== "undefined") {
                helper.renderAnalysisResult(analysis, prices, resultDiv, itemsArray);
              } else {
                console.log('nema cene za ovu analizu');
              }
            } // for end


            if (data.status == 200) {
              loaderWrapper.style.opacity = 0;
            }
          }); // data json end
        }); //fetch end
      } else if (searchstring.length >= 2) {
        //searching for labs from result page
        helper.searchLab(searchstring, loaderWrapper, resultDiv);
      } else {
        console.log('unesite vise od 2 karaktera da zapocnete pretragu');
        resultDiv.innerHTML += '';
        resultDiv.innerHTML = 'Unesite nesto';
        loaderWrapper.style.opacity = 0;
      }
    });
    helper.addAnalysis(itemsArray, resultDiv, checkout);
    helper.removeAnalysis(itemsArray, checkout);
  } //group analysis page


  if (document.getElementById('resultsGroupDetails') != null) {
    var _activeBtns = document.querySelectorAll('.addAnalysis');

    _activeBtns.forEach(function (analysis) {
      var analysisPositionArr = itemsArray.findIndex(function (item) {
        return analysis.getAttribute("data-analysisid") === item.id;
      });

      if (analysisPositionArr !== -1) {
        analysis.innerHTML = '&#10004;';
        analysis.disabled = true;
        analysis.classList.remove('addAnalysis');
        analysis.classList.add('deleteAnalysis');
      }
    });

    var _loaderWrapper = document.querySelector('.loader-wrapper');

    _loaderWrapper.style.opacity = 0;

    var _resultDiv = document.getElementById('resultTable'); // get seachstring


    var mainSearchinner = document.getElementById('searchResultPage'); // ger reference to filter

    var analysisRadioinner = document.querySelectorAll('input[name=searchFilter]'); // search for analysis or lab
    // proveriti da li je ovo ispod neophodno

    helper.searchLabAnalysis(mainSearchinner, analysisRadioinner);
    helper.addAnalysis(itemsArray, _resultDiv, checkout);
    helper.removeAnalysis(itemsArray, checkout);
  }

  if (urlArr[1] == 'tumacanje-laboratorijskih-analiza') {
    var _mainSearchinner = document.getElementById('searchResultPage'); // ger reference to filter


    var _analysisRadioinner = document.querySelectorAll('input[name=searchFilter]'); // search for analysis or lab


    helper.searchLabAnalysis(_mainSearchinner, _analysisRadioinner);
  } // lab details PAGE


  if (urlArr[1] == 'laboratorija') {
    var labLocationUrl = location.split('/');
    var labName = labLocationUrl[2];
    var uzorakLab = document.querySelector('.uzorakLab');
    var uzorakPatronaza = document.querySelector('.uzorakPatronaza');
    var dateLab = document.getElementById('datepicker1');
    var datePatronaza = document.getElementById('datepicker2');
    var uzimanjeUzorka = document.querySelectorAll('input[name=uzimanjeUzorka]');
    uzimanjeUzorka.forEach(function (item) {
      item.addEventListener('change', function (e) {
        if (e.target.value == 'laboratorija') {
          uzorakLab.classList.toggle('d-none');
          uzorakPatronaza.classList.add('d-none');
          datePatronaza.value = '';
        } else {
          uzorakPatronaza.classList.toggle('d-none');
          uzorakLab.classList.add('d-none');
          dateLab.value = '';
        }
      });
    });
    history.replaceState(null, null, "/laboratorija/".concat(labLocationUrl[2])); //take input values from search box and filter reference

    var innerPageSearch = document.getElementById('searchResultPage');

    var _analysisRadio2 = document.querySelectorAll('input[name=searchFilter]'); // search for analysis or lab
    // helper.searchLabAnalysis(innerPageSearch,analysisRadio)


    var searchString = document.getElementById('searchResultPage');
    searchString.focus();

    var _filter = document.querySelectorAll('input[name=searchFilter]');

    var _resultDiv2 = document.getElementById('resultTableAnalysis');

    var resultTable = document.getElementById('resultTable');
    var numOfAnalysis = document.querySelector('.numAnalysis');

    var _checkout = document.querySelector('.checkout');

    var filterValue = 'analiza';
    var schedule = []; //check the filter value on INDEX PAGE

    _filter.forEach(function (item) {
      item.addEventListener('click', function (e) {
        filterValue = e.target.value;
      });
    });
    /* by default filter is set to analiza, after 500ms
      user is redirected to results page */
    //show totalPrice


    var prices = document.querySelectorAll('.price');
    var totalPriceSpan = document.querySelector('.totalPrice');
    var resultSection = document.getElementById('resultsLabDetails'); // let table = document.getElementById('resultTableAnalysis')

    var _itemsArray = JSON.parse(localStorage.getItem('items'));

    var totalPrice = 0;
    prices.forEach(function (item) {
      totalPrice += parseInt(item.getAttribute('data-price'));
    });
    var labIdName = document.getElementById('labName');
    labId = labIdName.getAttribute('data-id');
    schedule.push({
      "total": totalPrice
    });
    schedule.push({
      "analysis": _itemsArray
    });
    schedule.push({
      "labId": labId
    });
    schedule.push({
      "date": ''
    });
    scheduleString = JSON.stringify(schedule); // console.log('1' + scheduleString)
    //search and add analysis from lab details page

    searchString.addEventListener('input', function (e) {
      if (searchString.value.length >= 3 && filterValue == 'analiza') {
        var _searchString = e.target.value; // fetch('/analysis/prices/'+searchString)

        fetch('/search/analysis/' + _searchString + '/' + labName).then(function (data) {
          return data.json();
        }).then(function (result) {
          _resultDiv2.innerHTML = '';
          var icon = [];
          var alreadySelectedArray = [];

          for (i = 0; i < result.length; i++) {
            var alreadySelected = _itemsArray.findIndex(function (item) {
              return item.id == result[i].idAnalysis;
            });

            alreadySelectedArray.push(alreadySelected);
            var availableHC = result[i].availableHC;
            icon.push.apply(icon, _toConsumableArray(availableHC));

            if (alreadySelectedArray[i] == -1) {
              var results = "\n                  <tr>\n                    <td><img src=\"/images/detail.svg\" data-toggle=\"tooltip\" title=\"".concat(result[i].preview, "\" class=\"tooltipImg mr-2\">\n                    <a href=\"../results/analysis/").concat(result[i].slug, "\" class=\"nolink\">").concat(result[i].name, "</a></td>\n                    <td>").concat(result[i].abbr, "</td>\n                    <td>").concat(result[i].alt, "</td>\n                    <td><img src=").concat(icon[i] ? '/images/hospital-alt.svg' : '/images/hospital-alt_off.svg', "></td>\n                    <td><span class=\"font-weight-bold price\">").concat(result[i].cenovnik.cena, "</span></td>\n                    <td><button class=\"btn btn-outline-success float-right btn-block text-uppercase addAnalysis\" data-analysisid=\"").concat(result[i].idAnalysis, "\"  data-analysisName=\"").concat(result[i].name, "\" data-price=").concat(result[i].cenovnik.cena, " data-abbr=\"").concat(result[i].abbr, "\" data-iconPath=\"").concat(result[i].groupID[i].iconPath, "\" data-alt=\"").concat(result[i].alt, "\" data-icon=\"").concat(icon[i] ? '/images/hospital-alt.svg' : '/images/hospital-alt_off.svg', "\">dodaj</button></td>\n                  </tr>\n                ");
              _resultDiv2.innerHTML += results;
            }
          }
        }); // data json end
      } else {
        console.log('unesite vise od 2 karaktera');
        _resultDiv2.innerHTML = '';
      }
    });
    var addAnalysisBtn = document.getElementById('resultTableAnalysis');
    addAnalysisBtn.addEventListener('click', function (e) {
      if (e.target.tagName === 'BUTTON' && e.target.classList.contains('addAnalysis')) {
        e.target.innerHTML = '&#10004;';
        e.target.disabled = true;
        totalPrice += parseInt(e.target.getAttribute('data-price'));
        totalPriceSpan.innerText = "Ukupno: ".concat(totalPrice, " din.");
        resultSection.classList.remove('d-none');

        _checkout.classList.remove('d-none');

        _itemsArray.push({
          'name': e.target.getAttribute('data-analysisName'),
          'id': e.target.getAttribute('data-analysisid'),
          'logo': e.target.getAttribute('data-iconPath')
        });

        schedule[0].total = totalPrice;
        schedule[1].analysis = _itemsArray;
        schedule[2].labId = labId;
        scheduleString = JSON.stringify(schedule);
        numOfAnalysis.innerHTML = "Broj odabranih analiza (".concat(_itemsArray.length, ")");
        _checkout.textContent = _itemsArray.length;

        _itemsArray.sort(function (a, b) {
          if (a.name > b.name) {
            return 1;
          } else {
            return -1;
          }
        });

        localStorage.setItem('items', JSON.stringify(_itemsArray));
        var additionalResult = "\n               <tr>\n                 <td><img src=\"/images/detail.svg\" data-toggle=\"tooltip\" title=\"\" class=\"tooltipImg mr-2\">\n                 <a href=\"../results/analysis/".concat(e.target.getAttribute('data-analysisName'), "\" class=\"nolink\">").concat(e.target.getAttribute('data-analysisName'), "</a></td>\n                 <td>").concat(e.target.getAttribute('data-abbr'), "</td>\n                 <td>").concat(e.target.getAttribute('data-alt'), "</td>\n                 <td><img src=\"").concat(e.target.getAttribute('data-icon'), "\"></td>\n                 <td><span class=\"font-weight-bold price\">").concat(e.target.getAttribute('data-price'), "</span></td>\n                 <td><button class=\"btn btn-outline-danger float-right btn-block text-uppercase removeAnalysis\" data-analysisid=\"").concat(e.target.getAttribute('data-analysisid'), "\" data-groupImg=\"\" data-analysisName=\"\" >X</button></td>\n               </tr>\n           ");
        resultTable.innerHTML += additionalResult;
      }
    }); ///////////////////////////

    if (_itemsArray.length == 0) {
      resultSection.classList.add('d-none');

      _checkout.classList.add('d-none');
    } else {
      totalPriceSpan.innerText = "Ukupno: ".concat(totalPrice, " din."); //remove analysis from basket

      var removeAnalysisLabPage = document.getElementById('resultTable');
      removeAnalysisLabPage.addEventListener('click', function (e) {
        if (e.target.classList.contains('removeAnalysis')) {
          _resultDiv2.innerHTML = '';
          searchString.value = '';
          var toBeDeleted = e.target.getAttribute('data-analysisid');
          var deleteAnalysis = e.target.parentNode.parentNode.remove();
          prices = document.querySelector('.price'); //update total price by substracting from total

          totalPrice -= parseInt(e.target.parentNode.previousElementSibling.innerText);
          totalPriceSpan.innerText = "Ukupno: ".concat(totalPrice, " din.");

          var nameIndex = _itemsArray.findIndex(function (item) {
            return item.id === toBeDeleted;
          });

          _itemsArray.splice(nameIndex, 1);

          items = JSON.stringify(_itemsArray);
          localStorage.setItem('items', items);
          schedule[0].total = totalPrice;
          schedule[1].analysis = _itemsArray;
          schedule[2].labId = labId; // console.log('2' + scheduleString)

          var numAnalysis = document.querySelector('.numAnalysis');
          numAnalysis.textContent = "Broj odabranih analiza (".concat(_itemsArray.length, ")");
          _checkout.textContent = _itemsArray.length;

          if (_itemsArray.length == 0) {
            resultSection.classList.add('d-none');

            _checkout.classList.add('d-none');
          }
        }
      });
    }

    var scheduleBtn = document.getElementById('schedule'); // console.log('3'+ scheduleString)

    scheduleBtn.addEventListener('click', function () {
      schedule[3].date = dateLab.value != "" ? dateLab.value : datePatronaza.value;
      scheduleString = JSON.stringify(schedule);
      fetch('/schedule/', {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: scheduleString
      }).then(function (response) {
        console.log(response);
        window.location.href = "/hvala";
      });
    });
  }

  if (urlArr[1] == 'profile') {
    var visina = document.getElementById('visina');
    var tezina = document.getElementById('tezina');
    var bmi = document.getElementById('bmi');
    visina.addEventListener('input', function () {
      bmi.value = (tezina.value / (visina.value / 100 * (visina.value / 100))).toFixed(2);
    });
    tezina.addEventListener('input', function () {
      bmi.value = (tezina.value / (visina.value / 100 * (visina.value / 100))).toFixed(2);
    });
  }
  /* ANALYSIS DETAILS PAGE ***************/


  if (urlArr[1] == 'results' && urlArr[2] == 'analysis' && urlArr[3] !== '') {
    //scrollspy initialization for side navigation
    $('body').scrollspy({
      target: '#sideMenu',
      offset: 30
    }); //take input values from search box and filter reference

    var _innerPageSearch = document.getElementById('searchResultPage');

    var _analysisRadio3 = document.querySelectorAll('input[name=searchFilter]'); // search for analysis or lab


    helper.searchLabAnalysis(_innerPageSearch, _analysisRadio3); //add analysis from analysis details page

    var analysisBtn = document.querySelector('.addAnalysis');
    /* take the analysisname from button and check if this analysis
      is already added to basket */

    var disableAddBtn = itemsArray.findIndex(function (item) {
      return analysisBtn.getAttribute('data-analysisName') == item.name;
    });
    /* if analysis is already in basket disable button for
      adding analysis to basket*/

    if (disableAddBtn !== -1) {
      analysisBtn.innerHTML = '&#10004;';
      analysisBtn.disabled = true;
      analysisBtn.classList.remove('addAnalysis');
      analysisBtn.classList.add('deleteAnalysis');
    }

    helper.addAnalysis(itemsArray, analysisBtn, checkout);
    helper.removeAnalysis(itemsArray, checkout);
  }
  /*********************** BACKEND ************************/


  if (location.match('addLab')) {
    // populating working days Tuesday-Friday based on values from Monday
    var mondayOpens = document.querySelector('#mondayOpens');
    var mondayCloses = document.querySelector('#mondayCloses');
    var workingWeek = document.querySelectorAll('.__working-hours');
    mondayCloses.addEventListener('blur', function (e) {
      document.getElementById('saturdayOpens').focus();

      for (i = 0; i < workingWeek.length - 4; i++) {
        if (i % 2 == 0) {
          workingWeek[i].value = mondayOpens.value;
        } else {
          workingWeek[i].value = mondayCloses.value;
        }
      }
    }); // delete all working hours on click / set 24h to false

    var deleteWH = document.querySelector('#deleteWH');
    deleteWH.addEventListener('click', function (e) {
      e.preventDefault();

      for (i = 0; i < workingWeek.length; i++) {
        workingWeek[i].value = '';
      }

      open24h.checked = false;
    }); // set working hours for the whole week to 00-24h

    var open24h = document.querySelector('#open24h');
    open24h.addEventListener('change', function (e) {
      e.preventDefault();

      if (open24h.checked == true) {
        for (i = 0; i < workingWeek.length; i++) {
          if (i % 2 == 0) {
            workingWeek[i].value = '00:00';
          } else {
            workingWeek[i].value = '24:00';
          }
        }
      } else {
        for (i = 0; i < workingWeek.length; i++) {
          workingWeek[i].value = '';
        }
      }
    }); // search id for the place and populate other address related
    // fields on lab form

    var searchPlaces = document.getElementById('searchPlaces');

    var _resultDiv3 = document.getElementById('result');

    var city = document.getElementById('city');
    var minicipality = document.getElementById('municipality');
    var postalCode = document.getElementById('postalCode');
    searchPlaces.addEventListener('input', function (e) {
      if (searchPlaces.value.length >= 3) {
        fetch('/places/' + e.target.value).then(function (data) {
          data.json().then(function (result) {
            _resultDiv3.innerHTML = '';

            for (i = 0; i < result.length; i++) {
              var liItem = document.createElement('li');
              liItem.className += "list-group-item";
              var link = document.createElement('a');
              link.href = result[i]._id;
              link.setAttribute('data-municipality', result[i].municipality);
              link.setAttribute('data-postalCode', result[i].postalCode); // link.className += ""

              liItem.appendChild(link);
              var placeName = document.createTextNode(result[i].place);
              link.appendChild(placeName);

              _resultDiv3.appendChild(liItem);
            } // for end


            var resultList = document.querySelectorAll('#result li');
            resultList.forEach(function (item) {
              item.addEventListener('click', function (e) {
                e.preventDefault();
                searchPlaces.value = e.srcElement.attributes.href.textContent;
                city.value = e.target.innerText;
                municipality.value = e.srcElement.getAttribute('data-municipality');
                postalCode.value = e.srcElement.getAttribute('data-postalCode');
                _resultDiv3.innerHTML = '';
              });
            });
          }); // data json end
        });
      } else {
        console.log('enter at least 3 letters');
        _resultDiv3.innerHTML = '';
        city.value = '';
        municipality.value = '';
        postalCode.value = '';
      }
    }); // add new phone field icon

    var addNewPhone = document.querySelector('#addNewPhone');
    var newPhone = new NewElement('#contactData', 'div', 'form-group col-sm-4', 'small', 'form-text text-muted', 'new phone', 'form-control', 'e.g. 066/3423234', 'phone[]', '^0\\d\\d\\/\\d+');
    newPhone.removeElement('.removeField'); // add additional phone input fields

    addNewPhone.addEventListener('click', function (e) {
      newPhone.addElement();
      newPhone.removeElement('.removeField');
    });
  } // window location = /addLab


  if (location.match('addAnalysis')) {
    console.log('da');
    $('#summernote').summernote({
      styleTags: ['p', 'br', {
        title: 'orderList',
        tag: 'ul',
        className: 'textList',
        value: 'ul'
      }, {
        title: 'leadText',
        tag: 'p',
        className: 'lead text-center',
        value: 'p'
      }, {
        title: 'reset',
        tag: 'p',
        className: '',
        value: 'p'
      }],
      height: 220,
      toolbar: [['view', ['codeview']], ['img', ['picture']], ['style', ['style', 'addclass', 'clear']], ['fontstyle', ['bold', 'italic', 'ul', 'ol', 'link', 'paragraph']], ['fontstyleextra', ['strikethrough', 'underline', 'hr', 'color', 'superscript', 'subscript']]]
    });
    var addNewAbbr = document.querySelector('#addNewAbbr');
    var addNewAlt = document.querySelector('#addNewAlt');
    var addNewConnectedAnalysis = document.querySelector('#addNewRelatedAnalysis');
    var addNewConnectedDiseases = document.querySelector('#addNewDiseases');
    var newAbbr = new NewElement('#abbrAltContainer', 'div', 'form-group col-sm-3', 'small', 'form-text text-muted', 'new abbr', 'form-control', 'new abbr', 'abbr[]', '.+');
    newAbbr.removeElement('.removeField');
    addNewAbbr.addEventListener('click', function (e) {
      newAbbr.addElement();
      newAbbr.removeElement('.removeField');
    });
    var newAlt = new NewElement('#abbrAltContainer', 'div', 'form-group col-sm-3', 'small', 'form-text text-muted', 'alternative name', 'form-control', 'new alt', 'alt[]', '.+');
    newAlt.removeElement('.removeField');
    addNewAlt.addEventListener('click', function (e) {
      newAlt.addElement();
      newAlt.removeElement('.removeField');
    });
    var groupId = document.getElementById('groupId');
    var resultGroup = document.getElementById('resultGroup');
    var groupName = document.getElementById('groupName');
    groupId.addEventListener('input', function (e) {
      if (groupId.value.length >= 1) {
        fetch('/groups/' + e.target.value).then(function (data) {
          data.json().then(function (result) {
            resultGroup.innerHTML = '';

            for (i = 0; i < result.length; i++) {
              var liItem = document.createElement('li');
              liItem.className += "list-group-item";
              var link = document.createElement('a');
              link.href = result[i]._id;
              liItem.appendChild(link);

              var _groupName = document.createTextNode(result[i].name);

              link.appendChild(_groupName);
              resultGroup.appendChild(liItem);
            } // for end


            var groupNamesList = document.querySelectorAll('#resultGroup li');
            groupNamesList.forEach(function (itemGroup) {
              itemGroup.addEventListener('click', function (e) {
                e.preventDefault();
                groupId.value = e.srcElement.attributes.href.textContent;
                groupName.value = e.target.innerText;
                resultGroup.innerHTML = '';
              }); // click end
            }); // foreach end
          }); // data.json end
        }); // fetch end
      } else {
        console.log('enter at least 3 letters');
        resultGroup.innerHTML = '';
        groupName.value = '';
      }
    }); // groupid addEventListener
    // searching for connected analyses

    var connectedAnalysis = document.getElementById('connectedAnalysis');
    var getAnalyisisNameDiv = document.getElementById('resultConnectedAnalysis');
    var relatedAnalysisParent = document.getElementById('relatedAnalysis');
    var parentUl = document.querySelector('.connAnalysisUl'); // let parentUl

    if (typeof parentUl !== 'undefined' && parentUl !== null) {
      parentUl = document.querySelector('.connAnalysisUl'); // parentUl.setAttribute('id', 'tess')
    } else {
      parentUl = document.createElement('ul');
      parentUl.className += 'list-inline my-3 connAnalysisUl';
      parentUl.setAttribute('id', 'tess');
    }

    var analysisSelected = []; // push items to array when form is reloaded

    var liitems = document.querySelectorAll('.connAnalysisUl li');
    liitems.forEach(function (item) {
      analysisSelected.push(item.innerText);
    });
    connectedAnalysis.addEventListener('input', function (e) {
      if (connectedAnalysis.value.length > 2) {
        fetch('/analysis/' + e.target.value).then(function (data) {
          data.json().then(function (result) {
            // console.log(result)
            getAnalyisisNameDiv.innerHTML = '';

            for (i = 0; i < result.length; i++) {
              var liItem = document.createElement('li');
              liItem.className += "list-group-item";
              var link = document.createElement('a');
              link.href = result[i]._id;
              liItem.appendChild(link);
              var analysisName = document.createTextNode(result[i].analysisName);
              link.appendChild(analysisName);
              getAnalyisisNameDiv.appendChild(liItem);
            } // for end

          }); // datajson end
        }); // fetch end
      } else {
        getAnalyisisNameDiv.innerHTML = '';
      }
    }); // connectedAnalysis event listener end

    var analysisNameList = document.getElementById('resultConnectedAnalysis');
    analysisNameList.addEventListener('click', function (e) {
      e.preventDefault();

      if (!analysisSelected.includes(e.target.innerText)) {
        analysisSelected.push(e.target.innerText); // creating hidden input tag and grab analysis id

        var connectedAnalysisID = document.createElement('input');
        connectedAnalysisID.type = 'hidden';
        connectedAnalysisID.name = 'connectedTo[]';
        connectedAnalysisID.setAttribute('value', e.srcElement.attributes.href.textContent);
        var connAnalysisName = document.createElement('input');
        connAnalysisName.type = 'hidden';
        connAnalysisName.name = 'connectedToName[]';
        connAnalysisName.setAttribute('value', e.target.innerText);
        var connectedAnalysisLi = document.createElement('li');
        connectedAnalysisLi.className += 'list-inline-item __connectedAnalysis';
        var connectedAnalysisInnerText = document.createTextNode(e.target.innerText);
        connectedAnalysisLi.appendChild(connectedAnalysisInnerText);
        connectedAnalysisLi.appendChild(connectedAnalysisID);
        connectedAnalysisLi.appendChild(connAnalysisName);
        parentUl.appendChild(connectedAnalysisLi);
        relatedAnalysisParent.appendChild(parentUl);
        connectedAnalysis.value = '';
        connectedAnalysis.focus();
        getAnalyisisNameDiv.innerHTML = '';
      } else {
        console.log('analiza vec dodata');
        connectedAnalysis.value = '';
        connectedAnalysis.focus();
        getAnalyisisNameDiv.innerHTML = '';
      }
    }); // addevent listener end
    // remove connected analyses

    helper.removeElement(parentUl, analysisSelected); // search for connected Diseases and adding them to the DOM

    var connectedDiseases = document.getElementById('connectedDiseases');
    var getDiseasesDiv = document.getElementById('resultConnectedDiseases');
    var diseasesParent = document.getElementById('diseases');
    var diseaseParentUl = document.querySelector('.connDiseaseUl');

    if (typeof diseaseParentUl !== 'undefined' && diseaseParentUl !== null) {
      diseaseParentUl = document.querySelector('.connDiseaseUl');
    } else {
      diseaseParentUl = document.createElement('ul');
      diseaseParentUl.className += 'list-inline my-3 connDiseaseUl';
    }

    var diseaseSelected = []; // push items to array when form is reloaded

    var diseaseItems = document.querySelectorAll('.connDiseaseUl li');
    diseaseItems.forEach(function (item) {
      diseaseSelected.push(item.innerText);
    });
    connectedDiseases.addEventListener('input', function (e) {
      if (connectedDiseases.value.length > 2) {
        fetch('/diseases/' + e.target.value).then(function (data) {
          data.json().then(function (result) {
            getDiseasesDiv.innerHTML = '';

            for (i = 0; i < result.length; i++) {
              var liItem = document.createElement('li');
              liItem.className += "list-group-item";
              var link = document.createElement('a');
              link.href = result[i]._id;
              liItem.appendChild(link);
              var diseaseName = document.createTextNode(result[i].name);
              link.appendChild(diseaseName);
              getDiseasesDiv.appendChild(liItem);
            } // for end

          }); // data.json end
        }); // fetch end
      } // if end
      else {
          getDiseasesDiv.innerHTML = '';
        }
    }); // connectedDisease addEventListener
    // adding diseases to the page

    var addDisease = document.getElementById('resultConnectedDiseases');
    addDisease.addEventListener('click', function (e) {
      e.preventDefault();

      if (!diseaseSelected.includes(e.target.innerText)) {
        diseaseSelected.push(e.target.innerText); // creating hidden input tag and grab analysis id

        var diseaseID = document.createElement('input');
        diseaseID.type = 'hidden';
        diseaseID.name = 'diseasesId[]';
        diseaseID.setAttribute('value', e.srcElement.attributes.href.textContent);
        var diseaseName = document.createElement('input');
        diseaseName.type = 'hidden';
        diseaseName.name = 'diseaseName[]';
        diseaseName.setAttribute('value', e.target.innerText);
        var diseaseLi = document.createElement('li');
        diseaseLi.className += 'list-inline-item __connectedAnalysis';
        var diseaseInnerText = document.createTextNode(e.target.innerText);
        diseaseLi.appendChild(diseaseInnerText);
        diseaseLi.appendChild(diseaseID);
        diseaseLi.appendChild(diseaseName);
        diseaseParentUl.appendChild(diseaseLi);
        diseasesParent.appendChild(diseaseParentUl); // clear the input

        connectedDiseases.value = '';
        connectedDiseases.focus();
        getDiseasesDiv.innerHTML = '';
      } else {
        console.log('analiza vec dodata');
        connectedDiseases.value = '';
        connectedDiseases.focus();
        getDiseasesDiv.innerHTML = '';
      }
    }); // addDisease end addEventListener
    // remove diseases

    helper.removeElement(diseaseParentUl, diseaseSelected);
    var searchReference = document.getElementById('searchReference');
    var referenceList = document.getElementById('referenceList');
    var referenceParentDiv = document.getElementById('references');
    var referenceUl = document.querySelector('.referenceUl');

    if (typeof referenceUl !== 'undefined' && referenceUl !== null) {
      referenceUl = document.querySelector('.referenceUl');
    } else {
      referenceUl = document.createElement('ol');
      referenceUl.className += 'referenceUl';
    }

    var selectedReferences = []; // push items to array when form is reloaded

    var referenceItems = document.querySelectorAll('.referenceUl li');
    referenceItems.forEach(function (item) {
      selectedReferences.push(item.innerText);
    });
    searchReference.addEventListener('input', function (e) {
      if (searchReference.value.length > 2) {
        fetch('/reference/' + e.target.value).then(function (data) {
          data.json().then(function (result) {
            referenceList.innerHTML = '';

            for (i = 0; i < result.length; i++) {
              var liItem = document.createElement('li');
              liItem.className += "list-group-item ";
              var link = document.createElement('a');
              link.href = result[i]._id;
              liItem.appendChild(link);
              var referenceName = document.createTextNode(result[i].referenceTitle);
              link.appendChild(referenceName);
              referenceList.appendChild(liItem);
            } // for end

          }); // data json end
        }); // fetch end
      } else {
        referenceList.innerHTML = '';
      }
    });
    var addReference = document.getElementById('referenceList');
    addReference.addEventListener('click', function (e) {
      e.preventDefault();

      if (!selectedReferences.includes(e.target.innerText)) {
        selectedReferences.push(e.target.innerText); // creating hidden input tag and grab analysis id

        var referenceID = document.createElement('input');
        referenceID.type = 'hidden';
        referenceID.name = 'references[]';
        referenceID.setAttribute('value', e.srcElement.attributes.href.textContent);
        var referenceName = document.createElement('input');
        referenceName.type = 'hidden';
        referenceName.name = 'referenceName[]';
        referenceName.setAttribute('value', e.target.innerText); // TODO: move remove functionality to functon

        var removeButton = document.createElement('small');
        removeButton.className += 'ml-2 float-right text-danger removeConnectedAnalysis'; // let removeText = document.createTextNode('x')
        // removeButton.appendChild(removeText)
        // remove section end

        var referenceLi = document.createElement('li');
        referenceLi.className = 'my-2'; // referenceP.className += 'd-block'

        var referenceTitle = document.createTextNode(e.target.innerText);
        referenceLi.appendChild(referenceTitle); // referenceLi.appendChild(removeButton)

        referenceLi.appendChild(referenceID);
        referenceLi.appendChild(referenceName);
        referenceUl.appendChild(referenceLi);
        referenceParentDiv.appendChild(referenceUl);
        searchReference.value = '';
        searchReference.focus();
        referenceList.innerHTML = '';
      } else {
        searchReference.value = '';
        searchReference.focus();
        referenceList.innerHTML = '';
      }
    }); // addreference addEventListener
    // remove reference after it is added to the page

    helper.removeElement(referenceUl, selectedReferences);
    var searchEditor = document.getElementById('searchEditors');
    var editorsList = document.getElementById('editorsList');
    var editorParentDiv = document.getElementById('editor');
    var editorDiv;

    if (typeof editorDiv !== 'undefined' && editorDiv !== null) {
      // select editor div after page refresh
      editorDiv = document.querySelector('.__editorsList');
    } else {
      editorDiv = document.createElement('div');
      editorDiv.className += '__editorsList';
    }

    var selectedEditor = []; //take editor id after page refresh

    var editors = document.querySelector('.__editorsList input[name=writtenBy]');

    if (editors) {
      selectedEditor.push(editors.value); // console.log(selectedEditor)
    }

    searchEditor.addEventListener('input', function (e) {
      // if(document.querySelector('.__editorsList')) {
      //   alert('vec je dodat urednik za ovu analizu, ukoliko hoces da ga izmenis prvo ukloni postojeceg')
      // } else {
      if (searchEditor.value.length > 2) {
        fetch('/editors/' + e.target.value).then(function (data) {
          data.json().then(function (result) {
            editorsList.innerHTML = '';

            for (i = 0; i < result.length; i++) {
              var liItem = document.createElement('li');
              liItem.className += "list-group-item ";
              var link = document.createElement('a');
              link.href = result[i]._id;
              link.setAttribute('data-editorImage', result[i].picture);
              liItem.appendChild(link);
              var editorName = document.createTextNode("".concat(result[i].firstName, " ").concat(result[i].lastName));
              link.appendChild(editorName);
              editorsList.appendChild(liItem);
            } // for end

          }); // data json end
        }); // fetch end
      } else {
        editorsList.innerHTML = '';
      } // } // else end

    }); // search editor addeventlistener end

    var addEditor = document.getElementById('editorsList');
    addEditor.addEventListener('click', function (e) {
      e.preventDefault(); // if(selectedEditor.length == 0) {
      //   selectedEditor.push(e.srcElement.attributes.href.textContent)

      editorDiv.setAttribute('id', 'ddd');
      var editorID = document.createElement('input');
      editorID.type = 'hidden';
      editorID.name = 'writtenBy';
      editorID.setAttribute('value', e.srcElement.attributes.href.textContent); // set hidden input for keeping editor's name after page refresh

      var inputEditorName = document.createElement('input');
      inputEditorName.type = 'hidden';
      inputEditorName.name = 'editorHiddenName';
      inputEditorName.setAttribute('value', e.target.innerText); //set hidden input for keeping editor's picture

      var inputEditorImage = document.createElement('input');
      inputEditorImage.type = 'hidden';
      inputEditorImage.name = 'editorHiddenImage';
      inputEditorImage.setAttribute('value', e.srcElement.getAttribute('data-editorImage'));
      var editorh4 = document.createElement('h4');
      editorh4.className = 'ml-4 mt-3 float-right';
      var editorImage = document.createElement('img');
      editorImage.className = 'rounded ml-2 mt-3 __editorImage';
      editorImage.setAttribute('src', '/images/editors/' + e.srcElement.getAttribute('data-editorImage'));
      var editorDisplayName = document.createTextNode(e.target.innerText);
      editorh4.appendChild(editorDisplayName);
      editorDiv.appendChild(editorImage);
      editorDiv.appendChild(editorh4);
      editorDiv.appendChild(inputEditorName);
      editorDiv.appendChild(inputEditorImage);
      editorDiv.appendChild(editorID);
      editorParentDiv.appendChild(editorDiv);
      searchEditor.value = '';
      editorsList.innerHTML = '';
      var removeEditor = document.querySelector('.__editorsList');
      removeEditor.addEventListener('click', function (e) {
        while (removeEditor.firstChild) {
          removeEditor.firstChild.remove();
        }
      });
    }); // item.addeventListener end
    // helper.removeElement(editorDiv,selectedEditor)

    var removeEditor = document.querySelector('.__editorsList');

    if (removeEditor) {
      removeEditor.addEventListener('click', function (e) {
        while (removeEditor.firstChild) {
          removeEditor.firstChild.remove();
        }

        removeEditor.remove();
      });
    }
  } // location match end addAnalysis


  if (location.match('addPrice')) {
    var newPriceList = new PriceList.createPrice();
  } //delete analysis


  if (location.match('allAnalysis')) {
    helper.deleteDocument('.deleteDocument', 'analiza ce biti obrisana?', '/allAnalysis/', '/allAnalysis', 'doslo je do greske');
  } //delete lab


  if (location.match('allLabs')) {
    helper.deleteDocument('.deleteDocument', 'laboratorija ce biti obrisana', '/allLabs/', '/allLabs', 'doslo je do greske');
  } //delete group


  if (location.match('allGroupsList')) {
    helper.deleteDocument('.deleteDocument', 'grupa ce biti obrisana', '/allGroupsList/', '/allGroupsList', 'doslo je do greske prilikom brisanja grupe');
  } //delete disease


  if (location.match('allDiseases')) {
    helper.deleteDocument('.deleteDocument', 'oboljenje ce biti obrisano', '/allDiseases/', '/allDiseases', 'doslo je do greske prilikom brisanja oboljenja');
  } //delete editor


  if (location.match('allEditors')) {
    helper.deleteDocument('.deleteDocument', 'urednik ce biti obrisan', '/allEditors/', '/allEditors', 'doslo je do greske prilikom brisanja urednika');
  } //delete reference


  if (location.match('allReferences')) {
    helper.deleteDocument('.deleteDocument', 'referenca ce biti obrisana', '/allReferences/', '/allReferences', 'doslo je do greske prilikom uklanjanja reference');
  } //delete faq


  if (location.match('allFaqs')) {
    helper.deleteDocument('.deleteDocument', 'Pitanje ce biti obrisano', '/allFaqs/', '/allFaqs', 'doslo je do greske prilikom uklanjanja pitanja');
  } //delete priceList


  if (location.match('allPrices')) {
    helper.deleteDocument('.deleteDocument', 'Cenovnik ce biti obrisan', '/allPrices/', '/allPrices', 'doslo je do greske prilikom brisanja cenovnika');
  }
}; // window onload end

/***/ }),

/***/ "./src/scss/style.scss":
/*!*****************************!*\
  !*** ./src/scss/style.scss ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ })

/******/ });
//# sourceMappingURL=main.bundle.js.map