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

__webpack_require__(/*! ../scss/style.scss */ "./src/scss/style.scss"); // let summernote = require('./summernote-ext-addclass')


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
  $('#resultTable, #resultTableAnalysis').on('mouseenter', 'tr>td>img.tooltipImg', function () {
    var imageSrc = $(this).attr('src'); // if (imageSrc == '/images/detail.svg') {

    $(this).attr('src', '/images/detail_mv.svg');
  }).on('mouseleave', 'tr>td>img.tooltipImg', function () {
    $(this).attr('src', '/images/detail.svg');
  });
  $('.fa-angle-down').on('click', function () {
    $(this).toggleClass('rotate');
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

    var filterValue = 'analiza'; //check the filter value on INDEX PAGE

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
      totalPriceSpan.innerText = "Ukupno: ".concat(totalPrice, " din.");
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