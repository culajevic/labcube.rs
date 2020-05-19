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

exports.renderAnalysisResult = function (analysis, pricesMin, pricesMax, resultDiv, itemsArray) {
  //check if analysis is already in array
  var analysisPositionArr = itemsArray.findIndex(function (item) {
    return item.name === analysis[i].analysisName;
  });
  var tr = document.createElement('tr'); //td analysis name and preview icon

  var tdName = document.createElement('td');
  var analysisName = document.createTextNode(analysis[i].analysisName);
  var analysisLink = document.createElement('a');
  analysisLink.setAttribute('href', 'analysis/' + analysis[i].slug);
  analysisLink.className = 'nolink';
  analysisLink.appendChild(analysisName);
  var previewIcon = document.createElement('img');
  previewIcon.setAttribute('src', '/images/detail.svg');
  previewIcon.setAttribute('title', analysis[i].preview);
  previewIcon.className = "tooltipImg mr-2";
  previewIcon.setAttribute('data-toggle', 'tooltip');
  tdName.appendChild(previewIcon);
  tdName.appendChild(analysisLink);
  tr.appendChild(tdName); // displab analysis abbreviation
  // let abbr = document.createElement('td')
  // let abbrName
  //
  // for(y=0; y<analysis[i].abbr.length; y++) {
  //   if(y != (analysis[i].abbr.length)-1 ) {
  //    abbrName = document.createTextNode(analysis[i].abbr[y]+', ')
  //   } else {
  //    abbrName = document.createTextNode(analysis[i].abbr[y])
  //   }
  //   abbr.appendChild(abbrName)
  //   tr.appendChild(abbr)
  // }
  //display alternative name for analysis

  var alt = document.createElement('td');
  var altName;

  for (y = 0; y < analysis[i].alt.length; y++) {
    if (y != analysis[i].alt.length - 1) {
      altName = document.createTextNode(analysis[i].alt[y] + ', ');
    } else {
      altName = document.createTextNode(analysis[i].alt[y]);
    }

    alt.appendChild(altName);
    tr.appendChild(alt);
  } //display analysis groupName


  var tdGroupName = document.createElement('td');
  var groupName = document.createTextNode(analysis[i].groupId.name);
  tdGroupName.appendChild(groupName);
  tr.appendChild(tdGroupName); //display hospital icon if analysis is available
  //ako nije dostupna stavi hospital-alt-off.svg

  var hospital = document.createElement('td');
  var hospitalIcon = document.createElement('img');

  if (analysis[i].availableHC) {
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
  priceSpan.className = 'font-weight-bold';
  var priceRange = document.createTextNode("".concat(pricesMin[i][0].cenovnik[0].cena, " - ").concat(pricesMax[i][0].cenovnik[0].cena));
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

  addAnalysisBtn.setAttribute('data-analysisId', analysis[i]._id);
  addAnalysisBtn.setAttribute('data-analysisName', analysis[i].analysisName);
  addAnalysisBtn.setAttribute('data-groupImg', analysis[i].groupId.iconPath);
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
    if (e.target.tagName === 'BUTTON' && e.target.classList.contains('addAnalysis') && itemsArray.length < 35) {
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
    } else if (itemsArray.length > 35) {
      console.log('ne mozete dodati vise od 40 analiza u korpu');
    }
  }); // resultdiv end
};

exports.searchLabAnalysis = function (searchString, filter) {
  var filterValue = 'analiza';
  searchString.focus(); // set focus on searchanalysis field when esc is pressed

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
    if (searchString.value.length >= 2) {
      setTimeout(function () {
        var searchString = e.target.value;
        console.log(searchString);
        window.location.href = '/results/?name=' + searchString + '&filter=' + filterValue;
      }, 500);
    }
  });
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
}); // changing analysis number color on hover

$('.click-more').hover(function () {
  $(this).find("span").toggleClass("broj-analiza-hover");
}); // sticky navigation

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
});
var location = window.location.pathname; // GLOBAL VARIABLES
//set filter by default to analiza

var filter = 'analiza';
var checkout = document.querySelector('.checkout');
var urlArr = location.split('/');
/* check if local storage already exists,
if not create an empty array */

var itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : []; //MUST CHECK THIS!!!!!!!

/*if local storage has already some items display selected items
in sidebar basket on any page which is not index */

if (itemsArray.length > 0 && location !== '/') {
  helper.displayBasket(itemsArray);
} //MUST CHECK THIS!!!!!!!
//get reference to checkout element which displays number of selected analysis in navigation


if (itemsArray.length > 0 && location == '/') {
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

  /* RESULTS PAGE ***************/


  if (urlArr[1] === 'results' && urlArr[2] == '') {
    //taking values from url
    var urlParams = new URLSearchParams(window.location.search); //search string and filter

    var myValue = urlParams.get('name');
    var myFilter = urlParams.get('filter'); // creating variable for search field and assigning value from search string

    var innerSearch = document.getElementById('searchResultPage'); //keeps search string when page is changed

    innerSearch.value = myValue; //put focus on search field

    innerSearch.focus(); //defining new variable which will be used in queries

    var searchStr = myValue; // display checked filter

    var radioFilter = document.querySelectorAll('input[name=searchFilter]');
    radioFilter.forEach(function (item) {
      if (item.value == myFilter) {
        item.checked = true;
      }
    }); // if user is searching from home page take result div

    var resultDiv = document.getElementById('resultTable'); // check if local storage is empty

    var _itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : []; // if filter value is changed on result searchResultPage
    // taking filter value


    var _analysisRadio = document.querySelectorAll('input[name=searchFilter]');

    _analysisRadio.forEach(function (item) {
      item.addEventListener('click', function (e) {
        myFilter = e.target.value; // innerSearch.value=''
        // innerSearch.focus()
      });
    }); //create wrapper for live search icon


    var loaderWrapper = document.querySelector('.loader-wrapper');

    if (myFilter === 'analiza') {
      fetch('/analysis/prices/' + searchStr).then(function (data) {
        data.json().then(function (result) {
          resultDiv.innerHTML = '';
          var analysis = result.analysisName;
          var pricesMin = result.minPriceArr;
          var pricesMax = result.maxPriceArr;

          for (i = 0; i < analysis.length; i++) {
            //creating table with result
            helper.renderAnalysisResult(analysis, pricesMin, pricesMax, resultDiv, _itemsArray);
          } // for end
          //when result is found remove loading icon


          loaderWrapper.style.opacity = 0;
        }); // data json end
      }); //fetch end
    } // if my filter==analiza
    else {
        var banner = document.querySelector('.banner'); // banner.style.display = 'none'

        var analysisBasket = document.querySelector('.odabraneAnalize'); // analysisBasket.style.display = 'none'

        var now = new Date();
        var day = now.getDay();
        var date = now.getDate();
        var month = now.getMonth();
        var year = now.getFullYear();
        var today = month + 1 + "/" + date + "/" + year; // let danas

        fetch('/lab/' + searchStr).then(function (data) {
          data.json().then(function (result) {
            loaderWrapper.style.opacity = 0;
            var labTemplate = document.createElement('div');
            labTemplate.className = 'col-12 d-flex flex-row flex-wrap';

            for (i = 0; i < result.length; i++) {
              var flag = true;
              resultDiv.innerHTML = '';
              labTemplate.innerHTML += "\n              <div class=\"lab-card\">\n                <div>\n                   <img src=\"\" class=\"labInfoWindowOsiguranje privateInssuranceIcon".concat(i, "\" title=\"laboratorija sara\u0111uje sa privatnim osiguranjem\">\n                   <img src=\"\" class=\"labInfoWindowVerified accreditedIcon").concat(i, "\" title=\"laboratorija je akreditovana\">\n                   <span class=\"labInfoWindowTitle\">").concat(result[i].labName, "</span>\n               </div>\n                 <div class=\"labInfoWindow\">\n                     <img src=\"/images/lablogo/").concat(result[i].logo, "\" class=\"labLogoInfoWindow\">\n                     <p class=\"labInfoWindowAdresa\">").concat(result[i].address, "</p>\n                     <p class=\"labInfoWindowGrad\">").concat(result[i].placeId.place, " / ").concat(result[i].placeId.municipality, "</p>\n                     <p class=\"labInfoWindowTelefoni\"> ").concat(result[i].phone.join(', '), "</p>\n                 </div>\n                 <div class=\"labInfoFooter\">\n                     <img src=\"/images/radnoVreme_black.svg\" class=\"labInfoWindowWorkingHoursIcon\">\n                     <div class=\"radnoVreme\">Radno vreme</div>\n                     <div id='otvoreno' class='otvoreno").concat(i, " status'></div>\n                     <div class=\"labInfoRadnoVremeDetalji\">\n                       <p class=\"daysInWeek monday").concat(i, " text-center\">P<span>").concat(result[i].workingHours.monday.opens, " - ").concat(result[i].workingHours.monday.closes, "</span></p>\n                       <p class=\"daysInWeek tuesday").concat(i, " text-center\">U<span>").concat(result[i].workingHours.tuesday.opens, " - ").concat(result[i].workingHours.tuesday.closes, "</span></p>\n                       <p class=\"daysInWeek wednesday").concat(i, " text-center\">S<span>").concat(result[i].workingHours.wednesday.opens, " - ").concat(result[i].workingHours.wednesday.closes, "</span></p>\n                       <p class=\"daysInWeek thursday").concat(i, " text-center\">\u010C<span>").concat(result[i].workingHours.thursday.opens, " - ").concat(result[i].workingHours.thursday.closes, "</span></p>\n                       <p class=\"daysInWeek friday").concat(i, " text-center\">P<span>").concat(result[i].workingHours.friday.opens, " - ").concat(result[i].workingHours.friday.closes, "</span></p>\n                       <p class=\"daysInWeek saturday").concat(i, " text-center\">S<span>").concat(result[i].workingHours.saturday.opens, " - ").concat(result[i].workingHours.saturday.closes, "</span></p>\n                       <p class=\"daysInWeek sunday").concat(i, " text-center\">N<span>").concat(result[i].workingHours.sunday.opens, " - ").concat(result[i].workingHours.sunday.closes, "</span></p>\n                     </div>\n                  </div>\n                  <button type=\"button\" class=\"btn btn-block btnLabDetails mt-2\">saznaj vi\u0161e</button>\n               </div>");
              resultDiv.innerHTML = "\n               <section id=\"labDetails\">\n                 <div class=\"container\">\n                   <div class=\"row labContainer\">\n                   </div>\n                 </div>\n               </section>"; //append labcard to page

              document.querySelector('.labContainer').appendChild(labTemplate);
              var currentDay = void 0;
              var currentDayNum = void 0;

              switch (day) {
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

                case 7:
                  currentDay = 'sunday';
                  currentDayNum = 0;
                  break;

                default:
                  console.log('dan nije ok');
              }

              var radnoVreme = document.querySelector('.otvoreno' + i);
              var todayIs = document.querySelector('.' + currentDay + i);
              var privateInsurance = document.querySelector('.privateInssuranceIcon' + i);
              var accredited = document.querySelector('.accreditedIcon' + i);

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
                todayIs.classList.add('active');
              } else if (day === currentDayNum) {
                var wh = 'workingHours';
                var openTime = result[i].workingHours[currentDay].opens;
                var closingTime = result[i].workingHours[currentDay].closes;
                var todayOpenTime = new Date(today + ' ' + openTime + ':00');
                var todayClosingTime = new Date(today + ' ' + closingTime + ':00');
                var nowTimeStamp = now.getTime();

                if (nowTimeStamp > todayOpenTime.getTime() && todayClosingTime.getTime() > nowTimeStamp) {
                  radnoVreme.classList.add('open');
                  radnoVreme.innerText = 'otvoreno';
                  todayIs.classList.add('active');
                } else {
                  radnoVreme.classList.add('closed');
                  radnoVreme.innerText = 'zatvoreno';
                  todayIs.classList.add('activeClosed');
                }
              } else {
                console.log('lab nije odredio radno vreme');
              }
            } //for loop end

          }); //data json end
        }); //fetch end
        // helper.removeAnalysis(itemsArray)
      } // if search string is changed on result page
    // let loaderWrapper = document.querySelector('.loader-wrapper')


    innerSearch.addEventListener('input', function (e) {
      var searchstring = e.target.value;
      loaderWrapper.style.opacity = 1;

      if (myFilter == 'analiza' && searchstring.length >= 2) {
        fetch('/analysis/prices/' + searchstring).then(function (data) {
          data.json().then(function (result) {
            var analysis = result.analysisName;
            var pricesMin = result.minPriceArr;
            var pricesMax = result.maxPriceArr;
            resultDiv.innerHTML = '';

            for (i = 0; i < analysis.length; i++) {
              //creating table with results
              //when typing fast parent array becomes undefined hence error
              if (typeof pricesMin[i] !== "undefined") {
                helper.renderAnalysisResult(analysis, pricesMin, pricesMax, resultDiv, _itemsArray);
              }
            } // for end


            if (data.status == 200) {
              loaderWrapper.style.opacity = 0;
            }
          }); // data json end
        }); //fetch end
        // helper.addAnalysis(itemsArray, resultDiv)
        // helper.removeAnalysis(itemsArray)
      } else if (searchstring.length >= 2) {
        fetch('/lab/' + searchstring).then(function (data) {
          data.json().then(function (result) {
            console.log('sada rezultat');
            loaderWrapper.style.opacity = 0;
          });
        });
      } else {
        console.log('unesite vise od 2 karaktera da zapocnete pretragu');
        resultDiv.innerHTML = 'Unesite nesto';
        loaderWrapper.style.opacity = 0;
      }
    });
    helper.addAnalysis(_itemsArray, resultDiv, checkout);
    helper.removeAnalysis(_itemsArray, checkout);
    $('#resultTable ').on('mouseenter', 'tr>td>img.tooltipImg', function () {
      var imageSrc = $(this).attr('src'); // if (imageSrc == '/images/detail.svg') {

      $(this).attr('src', '/images/detail_mv.svg'); // }
      // else {
      //   $(this).attr('src', '/images/detail.svg');
      // }
    }).on('mouseleave', 'tr>td>img.tooltipImg', function () {
      $(this).attr('src', '/images/detail.svg');
    });
  }
  /* ANALYSIS DETAILS PAGE ***************/


  if (urlArr[1] == 'results' && urlArr[2] == 'analysis' && urlArr[3] !== '') {
    //scrollspy initialization for side navigation
    $('body').scrollspy({
      target: '#sideMenu',
      offset: 30
    }); //take input values from search box and filter reference

    var innerPageSearch = document.getElementById('searchResultPage');

    var _analysisRadio2 = document.querySelectorAll('input[name=searchFilter]'); // search for analysis or lab


    helper.searchLabAnalysis(innerPageSearch, _analysisRadio2); //add analysis from analysis details page

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

    var _resultDiv = document.getElementById('result');

    var city = document.getElementById('city');
    var minicipality = document.getElementById('municipality');
    var postalCode = document.getElementById('postalCode');
    searchPlaces.addEventListener('input', function (e) {
      if (searchPlaces.value.length >= 3) {
        fetch('/places/' + e.target.value).then(function (data) {
          data.json().then(function (result) {
            _resultDiv.innerHTML = '';

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

              _resultDiv.appendChild(liItem);
            } // for end


            var resultList = document.querySelectorAll('#result li');
            resultList.forEach(function (item) {
              item.addEventListener('click', function (e) {
                e.preventDefault();
                searchPlaces.value = e.srcElement.attributes.href.textContent;
                city.value = e.target.innerText;
                municipality.value = e.srcElement.getAttribute('data-municipality');
                postalCode.value = e.srcElement.getAttribute('data-postalCode');
                _resultDiv.innerHTML = '';
              });
            });
          }); // data json end
        });
      } else {
        console.log('enter at least 3 letters');
        _resultDiv.innerHTML = '';
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