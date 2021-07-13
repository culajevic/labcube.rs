require('../scss/style.scss')
const flatpickr = require("flatpickr")
const Serbian = require("flatpickr/dist/l10n/sr.js").default.sr;


const moment = require('moment')
moment.locale('sr')
// let summernote = require('./summernote-ext-addclass')
let NewElement = require('./class')
let PriceList = require('./price')
let helper = require('./functions')


//tooltip initialization
$(document).ready(function(){
  $('body').tooltip({
    selector:'[data-toggle="tooltip"]',
    placement:"top",
    delay: {show: 100, hide: 100},
    boundary: 'window',
    tooltipClass: "tooltip"
  })

let maxDate = new Date()
maxDate.setDate(maxDate.getDate() + 7)

//lazy load testing
const targets = document.querySelectorAll('.imgLazy')
const targetsText = document.querySelectorAll('.textLazy')
const lazyLoad = target => {
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {

        if(entry.isIntersecting) {

          const img = entry.target
          const src = img.getAttribute('data-lazy')

          img.setAttribute('src', src)
          img.classList.add('fadeLazy')

          observer.disconnect()
        }
    })
  },{rootMargin: "0px 0px -200px 0px"})
  io.observe(target)
}

targets.forEach(lazyLoad)
targetsText.forEach(lazyLoad)
//lazy load end


let datePicker1 = flatpickr('#datepicker1',{
  dateFormat: 'Y-m-d',
  altInput:true,
  altFormat: "F j, Y",
  enableTime: false,
  time_24hr: true,
  "locale": Serbian,
  minDate: "today",
  allowInput:true,
  maxDate: maxDate
});

let datePicker2 = flatpickr('#datepicker2',{
  dateFormat: 'Y-m-d H:i',
  altFormat: "F j, Y H:i",
  altInput:true,
  enableTime: true,
  time_24hr: true,
  "locale": Serbian,
  minDate: "today",
  allowInput:true,
  maxDate:maxDate
});

  $('#resultTable, #resultTableAnalysis').on('mouseenter','tr>td>img.tooltipImg', function(){
    var imageSrc = $(this).attr('src');
    // if (imageSrc == '/images/detail.svg') {
      $(this).attr('src','/images/detail_mv.svg');
    }).on('mouseleave','tr>td>img.tooltipImg', function(){
      $(this).attr('src', '/images/detail.svg');
    })

  $('.fa-angle-down').on('click', function() {
      $(this).toggleClass('rotate');
  })
  $(".custom-file-input").on("change", function() {
  var fileName = $(this).val().split("\\").pop();
  $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});
});

// changing analysis number color on hover
$('.click-more').hover(function(){
  $(this).find("span").toggleClass("broj-analiza-hover");
});


// sticky navigation for index page
$(window).scroll(function(){
  let priceList = document.getElementById('priceList')
  let height = $(window).scrollTop();
    if(height > 460) {
      $("#header > nav").addClass('fixed-top-background fixed-top');
      $(priceList).css({top:"64px",transition:'top .5s ease'})
    }
    else {
      $("#header > nav").removeClass('fixed-top-background fixed-top');
      $(priceList).css({top:"0px"})
    }
});

$(window).scroll(function(){
  // let priceList = document.getElementById('priceList')
  let height = $(window).scrollTop();
    if(height > 200) {
      $("#smallHeader > nav").addClass('fixed-top-background fixed-top');
      // priceList.css("top","20px")
    }
    else {
      $("#smallHeader > nav").removeClass('fixed-top-background fixed-top');
    }
});

// sticky navigation for side menu
$(window).scroll(function(){
  var height = $(window).scrollTop();
    if(height > 120) {
      $(".odabraneAnalize").addClass('fixed-right')
    }
    else {
      $(".odabraneAnalize").removeClass('fixed-right')
    }
})

// scrol to top button
$('.backTotop').on('click',function(){
  $('html, body').animate({scrollTop:0}, 1200);
    // return false;
});

//animate numbers on google map header


let location = window.location.pathname

// GLOBAL VARIABLES
//set filter by default to analiza
let filter = 'analiza'
let checkout = document.querySelector('.checkout')
let urlArr = location.split('/')


/* check if local storage already exists,
if not create an empty array */
let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : []
let municipalityStorage = localStorage.getItem('municipality') ? JSON.parse(localStorage.getItem('municipality')) : []
console.log(municipalityStorage)
//MUST CHECK THIS!!!!!!!
/*if local storage has already some items display selected items
in sidebar basket on any page which is not index */
const checkUrl = /result.*/
const group = /group/
const nadjiLab = /nadjiLab/
const laboratorija = /laboratorija.*/
const tumacenje = /tumacenje.*/
const payment = /paymentPage/

//definisanje stranica na kojima se prikazuje shoping karta
if(itemsArray.length>0 && (location.match(group) || location.match(checkUrl) || location.match(nadjiLab) || location.match(laboratorija) || location.match(tumacenje) || location.match(payment) )) {
  helper.displayBasket(itemsArray)
}

//MUST CHECK THIS!!!!!!!
//get reference to checkout element which displays number of selected analysis in navigation
const checkCMSAdd = /add.*/
const checkCMSAll = /all.*/
let findUserByEmail = document.getElementById('searchForUserEmail')

if (itemsArray.length > 0 && !location.match(checkCMSAdd) && !location.match(checkCMSAll) && !findUserByEmail) {
  checkout.classList.remove('d-none')
  checkout.textContent = itemsArray.length
}

window.onload = () => {

/* INDEX PAGE ***************/


if(location === '/') {

  //testing analysis box feature
  let analysisBasket = document.getElementById('analysisBasket')
  let krvnaSlika = document.getElementById('krvnaSlika')
  krvnaSlika.addEventListener('click', e => {
    e.preventDefault
    e.target.disabled = true
    let analysisKS = JSON.parse(e.target.getAttribute('data-analysis'))
    // let itemsArrayKS = []
    // console.log(analysisKS.length)
    for (i=0; i<analysisKS.length; i++) {

    itemsArray.push({
      'name':analysisKS[i].name,
      'id':analysisKS[i].id,
      'logo':analysisKS[i].logo
     })

     //add analysis group on home page immediately - check the functions add analysis and refactor
     let analysisAdded = document.createElement('li')
       analysisAdded.className='list-group-item list-group-item-action'
     //creating group image
     let groupImage = document.createElement('img')
       groupImage.classList = 'labGroupIconSelectedAnalysis'
       groupImage.setAttribute('src', '/images/'+analysisKS[i].logo)
     //creating text with analysis name
     let analysisName = document.createTextNode(analysisKS[i].name)
     let analysisLink = document.createElement('a')
     let slug = analysisKS[i].name.split(' ')
     let urlSlug = slug.join('-')
       analysisLink.setAttribute('href', '/results/analysis/'+urlSlug)
       analysisLink.className = 'nolink analysisBasketLiItem'
       // analysisLink.setAttribute('target', '_blank')
     analysisLink.appendChild(analysisName)
     //creating span element for remove icon
     let removeSpan = document.createElement('span')
       removeSpan.className = 'float-right remove'
     let removeImg = document.createElement('img')
       removeImg.setAttribute('src','/images/closeBtn.svg')
       removeImg.className = 'remove-analysis-from-basket'
       removeSpan.appendChild(removeImg)
       analysisAdded.appendChild(groupImage)
       analysisAdded.appendChild(analysisLink)
       analysisAdded.appendChild(removeSpan)

       let analysisPositionArr = itemsArray.findIndex((item) => {
         return item.name === analysisKS[i].name
       })

       let selectedAnalysis = document.getElementById('selectedAnalysis')
        selectedAnalysis.insertBefore(analysisAdded, selectedAnalysis.childNodes[analysisPositionArr])
   }

    checkout.classList.remove('d-none')
     checkout.innerHTML = itemsArray.length
     localStorage.setItem('items', JSON.stringify(itemsArray))
  })

let priceList = document.getElementById('priceList')
let closePriceList = document.getElementById('closePriceList')

  checkout.addEventListener('click', ()=> {
    if (itemsArray.length > 0) {
    priceList.classList.add('unhidePriceList')
    priceList.classList.remove('hidePriceList')
    }
  })

  closePriceList.addEventListener('click', () => {
    priceList.classList.add('hidePriceList')
    priceList.classList.remove('unhidePriceList')
    priceList.removeAttribute('style')
  })

  // let municipality = document.getElementById('municipality')
  // localStorage.setItem('municipality', JSON.stringify(municipalityValue))
  // let municipalityValue = JSON.parse(localStorage.getItem('municipality'))
  // if (municipalityValue != null) {
  //   municipality.value = municipalityValue
  //   console.log('upisana opstina')
  // }
  // let municipalityValue
  //remember municipalityValue
  let municipality = document.getElementById('municipality')
  let municipalityValue = JSON.parse(localStorage.getItem('municipality'))
  if (municipalityValue != null) {
    municipality.value = municipalityValue
  }


  //display best price
  let resultDiv = document.getElementById('resultTable')

  let loaderWrapper = document.querySelector('.loader-wrapper')
  const showPriceBtn = document.querySelector('.showPrice')
  let mapArea = document.getElementById('mapPrices')

  showPriceBtn.addEventListener('click', e => {
    e.preventDefault()
    if(document.getElementById('municipality')!= null) {
      let municipality = document.getElementById('municipality')
      municipalityValue = municipality.options[municipality.selectedIndex].value
      localStorage.setItem('municipality', JSON.stringify(municipalityValue))
    } else {
      municipalityValue = JSON.parse(localStorage.getItem('municipality'))
    }
    if (itemsArray.length > 0) {
    // municipality.value = municipalityValue
      window.location = '/nadjiLab'
    }


    // helper.bestPrice(mapArea, resultDiv)
  })

  helper.displayBasket(itemsArray)
  helper.removeAnalysis(itemsArray, checkout)


  //display hidden shoping basket
  // helper.displayBasket(itemsArray)


  // document.body.addEventListener('click', (e) => {
  //   priceList.classList.remove('unhidePriceList')
  //   priceList.classList.add('hidePriceList')
  // })

  ///////test end

  //testing display other groups

let buttonDisplayOtherAnalyises = document.getElementById('displayOtherGroups')
// let otherGroupsHidden = document.getElementById('otherGroups')
let otherGroupsHidden = document.querySelectorAll('.otherGroups')

buttonDisplayOtherAnalyises.addEventListener('click', () => {
if (buttonDisplayOtherAnalyises.innerText == 'SVE GRUPE ANALIZA') {
  buttonDisplayOtherAnalyises.remove()
} else {
  buttonDisplayOtherAnalyises.innerText = 'sve grupe analiza'
}
  otherGroupsHidden.forEach(item => {
    item.classList.toggle('active')
    // item.classList.remove('')
  });

})

  /////


  //get seachstring
  let mainSearch = document.getElementById('searchAnalysis')
  //ger reference to filter
  let analysisRadio = document.querySelectorAll('input[name=searchFilter]')
  //search for analysis or lab
  helper.searchLabAnalysis(mainSearch,analysisRadio)

} // INDEX page end

/* NAJBOLJA CENA **************/

// if(document.getElementById('najboljacena') != null) {
//   console.log('ovde sad')
// }

/* RESULTS PAGE ***************/

//ako je greska za dodavanje analize ovde dodati stranicu na kojoj se to ne treba pojavljivati
// if (urlArr[1] === 'results' && urlArr[2] == '') {
if (document.getElementById('results')!=null && location != '/o-nama/' && location != '/politika-privatnosti/' && location != '/uslovi-koriscenja/' ) {

  let priceList = document.getElementById('priceList')
  let closePriceList = document.getElementById('closePriceList')
  //
    checkout.addEventListener('click', ()=> {
      if (itemsArray.length > 0 ) {
      priceList.classList.add('unhidePriceList')
      priceList.classList.remove('hidePriceList')
      }
    })
  //
    closePriceList.addEventListener('click', () => {
      priceList.classList.add('hidePriceList')
      priceList.classList.remove('unhidePriceList')
      priceList.removeAttribute('style')
    })

    //dodaj odaberi opstinu po defaultu ako nema vrednosti
    let municipality = document.getElementById('municipality')
    let municipalityValue = JSON.parse(localStorage.getItem('municipality'))
    municipality.value = municipalityValue

  const activeBtns = document.querySelectorAll('.addAnalysis')
  activeBtns.forEach(analysis => {
    let analysisPositionArr = itemsArray.findIndex((item) => {
        return analysis.getAttribute("data-analysisid") === item.id
    })
    if(analysisPositionArr !== -1) {
      analysis.innerHTML = '&#10004;'
      analysis.disabled = true
      analysis.classList.remove('addAnalysis')
      analysis.classList.add('deleteAnalysis')
    }
  })

//show prices
  let resultDiv = document.getElementById('resultTable')

  let loaderWrapper = document.querySelector('.loader-wrapper')
  const showPriceBtn = document.querySelector('.showPrice')
  let mapArea = document.getElementById('mapPrices')

  showPriceBtn.addEventListener('click', e => {
    e.preventDefault()
    helper.bestPrice(mapArea, resultDiv)

  })

  //create wrapper for live search icon

  //get seachstring
  // let mainSearchinner = document.getElementById('searchResultPage')
  //ger reference to filter
  // let analysisRadioinner = document.querySelectorAll('input[name=searchFilter]')
  //search for analysis or lab
  //proveriti da li je ovo ispod neophodno
  // helper.searchLabAnalysis(mainSearchinner,analysisRadioinner)

  const urlParams = new URLSearchParams(window.location.search)
  let myValue = urlParams.get('name')
  let myFilter = urlParams.get('filter')
  history.replaceState(null,null,`/`)

  // creating variable for search field and assigning value from search string
  let innerSearch = document.getElementById('searchResultPage')
    //keeps search string when page is changed
    innerSearch.value = myValue
    innerSearch.focus()

  //defining new variable which will be used in queries
  let searchStr = myValue
  if(myFilter == null) {
    myFilter = 'analiza'
  }
  // display checked filter
  let radioFilter = document.querySelectorAll('input[name=searchFilter]')
    radioFilter.forEach((item) => {
      if(item.value == myFilter) {
        item.checked=true
        console.log('checked ' + myFilter)
      }
    })

    // if user is searching from home page take result div
    // let resultDiv = document.getElementById('resultTable')

    // if filter value is changed on result searchResultPage
    // taking filter value
    let analysisRadio = document.querySelectorAll('input[name=searchFilter]')
        analysisRadio.forEach((item) => {
          item.addEventListener('click', (e) => {
            myFilter = e.target.value
            console.log('kada se promeni ' + myFilter)
            innerSearch.value=''
            innerSearch.focus()
          })
        })


    if(myFilter === 'analiza') {
      console.log('pretraga analize sa glavne stranice')
      fetch('/analysis/prices/'+searchStr).then((data) => {
        // loaderWrapper.style.opacity = 1
        data.json().then((result) => {
          resultDiv.innerHTML = ''
          let analysis = result.analysisName
          // let pricesMin = result.minPriceArr
          // let pricesMax = result.maxPriceArr
          let prices = result.prices
          for(i=0; i<analysis.length; i++) {
            //creating table with result
            helper.renderAnalysisResult(analysis, prices, resultDiv, itemsArray)
          }// for end
          //when result is found remove loading icon
          loaderWrapper.style.opacity = 0
        })// data json end
      })//fetch end
    }// if my filter==analiza
    else if (myFilter == 'laboratorija'){
      console.log('pretraga lab sa index strance')
      helper.searchLab(searchStr, loaderWrapper, resultDiv)
      }// else end

    // if search string is changed on result page
    // let loaderWrapper = document.querySelector('.loader-wrapper')
    innerSearch.addEventListener('input', (e) => {
      // console.log('searching'+ filter)
    let mapFrame = document.getElementById('mapPrices')
    mapFrame.classList.add('d-none')
        let searchstring = e.target.value
        loaderWrapper.style.opacity = 1
        if(myFilter == 'analiza' && searchstring.length>=2) {
          fetch('/analysis/prices/'+searchstring).then((data) => {
            data.json().then((result) => {
              let analysis = result.analysisName
              // let pricesMin = result.minPriceArr
              // let pricesMax = result.maxPriceArr
              let prices = result.prices
              resultDiv.innerHTML = ''
                for(i=0; i<analysis.length; i++) {
                  //creating table with results
                  //when typing fast parent array becomes undefined hence error
                  if(typeof(prices)!=="undefined") {
                   helper.renderAnalysisResult(analysis, prices, resultDiv, itemsArray)
                 } else {
                   console.log('nema cene za ovu analizu')
                 }
                }// for end
                if(data.status == 200) {
                  loaderWrapper.style.opacity = 0
                }
            })// data json end
          })//fetch end
        }
        else if(searchstring.length>=2){
            //searching for labs from result page
            helper.searchLab(searchstring, loaderWrapper, resultDiv)
          } else {
            console.log('unesite vise od 2 karaktera da zapocnete pretragu')
            resultDiv.innerHTML += ''
            resultDiv.innerHTML = 'Unesite nesto'
            loaderWrapper.style.opacity = 0
          }
      })

        helper.addAnalysis(itemsArray, resultDiv, checkout)
        helper.removeAnalysis(itemsArray, checkout)


}

//group analysis page
if(document.getElementById('resultsGroupDetails')!= null) {

//prikaz shoping karte, prebaciti u funkciju
  // let priceList = document.getElementById('priceList')
  // let closePriceList = document.getElementById('closePriceList')

    checkout.addEventListener('click', ()=> {
      if (itemsArray.length > 0) {
        priceList.classList.add('unhidePriceList')
        priceList.classList.remove('hidePriceList')
      }
    })

    closePriceList.addEventListener('click', () => {
      priceList.classList.add('hidePriceList')
      priceList.classList.remove('unhidePriceList')
      priceList.removeAttribute('style')
    })

    let municipality = document.getElementById('municipality')
    let municipalityValue = JSON.parse(localStorage.getItem('municipality'))
    if (municipalityValue != null) {
      municipality.value = municipalityValue
    }

    //display best price
    const showPriceBtn = document.querySelector('.showPrice')
    let mapArea = document.getElementById('mapPrices')

    showPriceBtn.addEventListener('click', e => {
      e.preventDefault()
      if(document.getElementById('municipality')!= null) {
        let municipality = document.getElementById('municipality')
        municipalityValue = municipality.options[municipality.selectedIndex].value
        localStorage.setItem('municipality', JSON.stringify(municipalityValue))
      } else {
        municipalityValue = JSON.parse(localStorage.getItem('municipality'))
      }
      window.location = '/nadjiLab'
    })

////////////////// prikaz shoping carte

  const activeBtns = document.querySelectorAll('.addAnalysis')
  activeBtns.forEach(analysis => {
    let analysisPositionArr = itemsArray.findIndex((item) => {
        return analysis.getAttribute("data-analysisid") === item.id
    })
    if(analysisPositionArr !== -1) {
      analysis.innerHTML = '&#10004;'
      analysis.disabled = true
      analysis.classList.remove('addAnalysis')
      analysis.classList.add('deleteAnalysis')
    }
  })

  let loaderWrapper = document.querySelector('.loader-wrapper')
  loaderWrapper.style.opacity = 0
  let resultDiv = document.getElementById('resultTable')
  // get seachstring
  let mainSearchinner = document.getElementById('searchResultPage')
  // ger reference to filter
  let analysisRadioinner = document.querySelectorAll('input[name=searchFilter]')
  // search for analysis or lab
  // proveriti da li je ovo ispod neophodno
  helper.searchLabAnalysis(mainSearchinner,analysisRadioinner)
  helper.addAnalysis(itemsArray, resultDiv, checkout)
  helper.removeAnalysis(itemsArray, checkout)
}

if (urlArr[1] == 'tumacenje-laboratorijskih-analiza') {



  let mainSearchinner = document.getElementById('searchResultPage')
  // ger reference to filter
  let analysisRadioinner = document.querySelectorAll('input[name=searchFilter]')

  //remember municipalityValue
  let municipality = document.getElementById('municipality')
  let municipalityValue = JSON.parse(localStorage.getItem('municipality'))
  if (municipalityValue != null) {
    municipality.value = municipalityValue
  }

  let priceList = document.getElementById('priceList')
  let closePriceList = document.getElementById('closePriceList')
  // display and hide price list
    checkout.addEventListener('click', ()=> {
      if (itemsArray.length > 0 ) {
        priceList.classList.add('unhidePriceList')
        priceList.classList.remove('hidePriceList')
      }
    })
  //
    closePriceList.addEventListener('click', () => {
      priceList.classList.add('hidePriceList')
      priceList.classList.remove('unhidePriceList')
      priceList.removeAttribute('style')
    })
    //remove analysis
    helper.removeAnalysis(itemsArray, checkout)

    //display best price
    const showPriceBtn = document.querySelector('.showPrice')
    let mapArea = document.getElementById('mapPrices')
    showPriceBtn.addEventListener('click', e => {
      e.preventDefault()
      if(document.getElementById('municipality')!= null) {
        let municipality = document.getElementById('municipality')
        municipalityValue = municipality.options[municipality.selectedIndex].value
        localStorage.setItem('municipality', JSON.stringify(municipalityValue))
      } else {
        municipalityValue = JSON.parse(localStorage.getItem('municipality'))
      }
      window.location = '/nadjiLab'
    })

  // search for analysis or lab
  helper.searchLabAnalysis(mainSearchinner,analysisRadioinner)
}

// lab details PAGE
if(urlArr[1] == 'laboratorija') {


  let showPriceBtn = document.querySelector('.showPrice')
  showPriceBtn.addEventListener('click', e => {
    e.preventDefault()
    if(document.getElementById('municipality')!= null) {
      let municipality = document.getElementById('municipality')
      municipalityValue = municipality.options[municipality.selectedIndex].value
      localStorage.setItem('municipality', JSON.stringify(municipalityValue))
    } else {
      municipalityValue = JSON.parse(localStorage.getItem('municipality'))
    }
    window.location = '/nadjiLab'
    // helper.bestPrice(mapArea, resultDiv)
  })

const test = document.getElementById('smallHeader')
test.addEventListener('click', e => {
  if(e.target.classList.contains('checkout')) {

      priceList.classList.add('unhidePriceList')
      priceList.classList.remove('hidePriceList')


    closePriceList.addEventListener('click', () => {
      priceList.classList.add('hidePriceList')
      priceList.classList.remove('unhidePriceList')
      priceList.removeAttribute('style')
    })
  }
})
// let municipality = document.getElementById('municipality')
// let municipalityValue = JSON.parse(localStorage.getItem('municipality'))
// municipality.value = municipalityValue

let municipality = document.getElementById('municipality')
let municipalityValue = JSON.parse(localStorage.getItem('municipality'))
if (municipalityValue != null) {
  municipality.value = municipalityValue
}

// helper.removeAnalysis(itemsArray, checkout)

  // let resultDiv = document.getElementById('resultTable')
  // const municipality = document.getElementById('municipality')
  // let municipality =  (document.getElementById('municipality'))? 'da' : JSON.parse(localStorage.getItem('municipality'))
  let loaderWrapper = document.querySelector('.loader-wrapper')
  // let backToMap = document.getElementById('backtoMap')
  let mapArea = document.getElementById('mapPrices')
  // let labDetailsInner = document.getElementById('labDetailsFull')

  // backToMap.addEventListener('click', e => {
    // e.preventDefault()
    // history.replaceState(null,null,`/`)

    // helper.bestPrice(mapArea, resultDiv)
  // })



  let labLocationUrl = location.split('/')
  let labName = labLocationUrl[2]

  let uzorakLab = document.querySelector('.uzorakLab')
  let uzorakPatronaza = document.querySelector('.uzorakPatronaza')

  const dateLab = document.getElementById('datepicker1')
  const datePatronaza = document.getElementById('datepicker2')


  let uzimanjeUzorka = document.querySelectorAll('input[name=uzimanjeUzorka]')
   uzimanjeUzorka.forEach(item => {
      item.addEventListener('change', e => {
        if(e.target.value == 'laboratorija') {
            uzorakLab.classList.toggle('d-none')
            uzorakPatronaza.classList.add('d-none')
            datePatronaza.value=''

        } else {
          uzorakPatronaza.classList.toggle('d-none')
          uzorakLab.classList.add('d-none')
          dateLab.value = ''

        }

      })
   });


  history.replaceState(null,null,`/laboratorija/${labLocationUrl[2]}`)
  //take input values from search box and filter reference
  let innerPageSearch = document.getElementById('searchResultPage')
  let analysisRadio = document.querySelectorAll('input[name=searchFilter]')
  // search for analysis or lab
  // helper.searchLabAnalysis(innerPageSearch,analysisRadio)
  let searchString = document.getElementById('searchResultPage')
    searchString.focus()
  let filter = document.querySelectorAll('input[name=searchFilter]')
  let resultDiv = document.getElementById('resultTableAnalysis')
  let resultTable = document.getElementById('resultTable')
  let numOfAnalysis = document.querySelector('.numAnalysis')
  let numOfAnalysisBasketTitle = document.getElementById('numOfAnalysis')
  let checkout = document.querySelector('.checkout')
  let filterValue = 'analiza'
  let schedule = []
  //check the filter value on INDEX PAGE
      filter.forEach((item) => {
        item.addEventListener('click', (e) => {
          filterValue = e.target.value
        })
      })

      /* by default filter is set to analiza, after 500ms
        user is redirected to results page */

  //show totalPrice
  let prices = document.querySelectorAll('.price')
  let totalPriceSpan = document.querySelector('.totalPrice')

//calculate labcube price
  let totalLabCubePrice = document.getElementById('labCubePrice')
  let discount = (document.getElementById('discount')) ? document.getElementById('discount') : ''
  let discountValue = (discount) ? discount.getAttribute('data-discount') : ''
  let labCubePrice = 0
  let resultSection = document.getElementById('resultsLabDetails')
  // let table = document.getElementById('resultTableAnalysis')


      let itemsArray = JSON.parse(localStorage.getItem('items'))
      let totalPrice = 0
        prices.forEach(item =>  {
          totalPrice += parseInt(item.getAttribute('data-price'))
        })

        // labCubePrice=Math.ceil(totalPrice-(totalPrice*(1/discountValue)))
        labCubePrice=Math.ceil(totalPrice*((100-discountValue)/100))

        totalLabCubePrice.innerText = `${labCubePrice} RSD`
        const labIdName = document.getElementById('labName')
        labId = labIdName.getAttribute('data-id')


    //search and add analysis from lab details page

      helper.searchLabAnalysis(searchString,analysisRadio)

    // searchString.addEventListener('input', (e) => {
    //   if(searchString.value.length>=3 && filterValue == 'analiza' ) {
    //     let searchString = e.target.value
    //     fetch('/analysis/prices/'+searchString)
    //
    //     //search for analysis or lab
    //
    //     // fetch('/search/analysis/'+searchString+'/'+labName)
    //       .then(data => data.json())
    //       .then(result => {
    //         console.log(result)
    //         resultDiv.innerHTML = ''
    //
    //         let icon = []
    //         let alreadySelectedArray = []
    //
    //
    //         for(i=0; i<result.length; i++) {
    //
    //
    //           let alreadySelected = itemsArray.findIndex(item => {
    //             return item.id == result[i].idAnalysis
    //           })
    //
    //           alreadySelectedArray.push(alreadySelected)
    //
    //           let availableHC = result[i].availableHC
    //           icon.push(...availableHC)
    //
    //           if(alreadySelectedArray[i] == -1) {
    //             //ispis alt i abbr sa razmakom posle zareza
    //               // <td>${altArr[0][0].join(', ')}</td>
    //             let abbrArr = []
    //             let altArr = []
    //             abbrArr.push(result[i].abbr)
    //             altArr.push(result[i].alt)
    //             let results = `
    //               <tr>
    //                 <td><img src="/images/detail.svg" data-toggle="tooltip" title="${result[i].preview}" class="tooltipImg mr-2">
    //                 <a href="../results/analysis/${result[i].slug}" class="nolink">${result[i].name}</a></td>
    //                 <td>${abbrArr[0][0].join(', ')}</td>
    //                 <td><img src=${icon[i] ? '/images/hospital-alt.svg' : '/images/hospital-alt_off.svg'}></td>
    //                 <td><span class="font-weight-bold price">${result[i].cenovnik.cena}</span></td>
    //                 <td><button class="btn btn-outline-success float-right btn-block text-uppercase addAnalysis" data-analysisid="${result[i].idAnalysis}"  data-analysisName="${result[i].name}" data-price=${result[i].cenovnik.cena} data-abbr="${result[i].abbr}" data-iconPath="${result[i].groupID[0].iconPath}" data-alt="${result[i].alt}" data-icon="${icon[i] ? '/images/hospital-alt.svg' : '/images/hospital-alt_off.svg'}">dodaj</button></td>
    //               </tr>
    //             `
    //               resultDiv.innerHTML += results
    //           }
    //
    //         }
    //       })// data json end
    //
    //     }
    //   else {
    //     console.log('unesite vise od 2 karaktera')
    //     resultDiv.innerHTML = ''
    //   }
    // })


    // let addAnalysisBtn = document.getElementById('resultTableAnalysis')
    //   addAnalysisBtn.addEventListener('click', e => {
    //     if(e.target.tagName === 'BUTTON' && e.target.classList.contains('addAnalysis')) {
    //       e.target.innerHTML = '&#10004;'
    //       e.target.disabled = true
    //       totalPrice  += parseInt(e.target.getAttribute('data-price'))
    //       totalPriceSpan.innerText = `Ukupno: ${totalPrice} RSD`
    //       labCubePrice=Math.ceil(totalPrice*((100-discountValue)/100))
    //       totalLabCubePrice.innerText = `${labCubePrice} din.`
    //       resultSection.classList.remove('d-none')
    //       checkout.classList.remove('d-none')
    //       itemsArray.push({
    //         'name':e.target.getAttribute('data-analysisName'),
    //         'id':e.target.getAttribute('data-analysisid'),
    //         'logo':e.target.getAttribute('data-iconPath')
    //        })
    //
    //        let abbrArr = e.target.getAttribute('data-abbr')
    //        let altArr = e.target.getAttribute('data-alt')
    //        abbrArr = abbrArr.split(',')
    //        altArr = altArr.split(',')
    //
    //        schedule[0].total=totalPrice
    //        schedule[1].analysis = itemsArray
    //        schedule[2].labId = labId
    //        scheduleString = JSON.stringify(schedule)
    //
    //        numOfAnalysis.innerHTML = `Broj odabranih analiza (${itemsArray.length})`
    //        checkout.textContent = itemsArray.length
    //        itemsArray.sort((a,b) => {
    //          if (a.name > b.name) {
    //            return 1
    //          } else {
    //            return -1
    //          }
    //        })
    //        localStorage.setItem('items', JSON.stringify(itemsArray))
    //        //  <td>${altArr.join(', ')}</td>
    //        let additionalResult = `
    //            <tr>
    //              <td><img src="/images/detail.svg" data-toggle="tooltip" title="" class="tooltipImg mr-2">
    //              <a href="../results/analysis/${e.target.getAttribute('data-analysisName')}" class="nolink">${e.target.getAttribute('data-analysisName')}</a></td>
    //              <td>${abbrArr.join(', ')}</td>
    //
    //              <td><img src="${e.target.getAttribute('data-icon')}"></td>
    //              <td><span class="font-weight-bold price">${e.target.getAttribute('data-price')}</span></td>
    //              <td><button class="btn btn-outline-danger float-right btn-block text-uppercase removeAnalysis" data-analysisid="${e.target.getAttribute('data-analysisid')}" data-groupImg="" data-analysisName="" >X</button></td>
    //            </tr>
    //        `
    //        resultTable.innerHTML += additionalResult
    //     }
    //   })

    ///////////////////////////
    if(itemsArray.length == 0) {
      resultSection.classList.add('d-none')
    } else {
      totalPriceSpan.innerText = `${totalPrice} RSD`

      //remove analysis from basket from lab page
      let removeAnalysisLabPage = document.getElementById('resultTable')
        removeAnalysisLabPage.addEventListener('click', e => {

            if(e.target.classList.contains('removeAnalysis')) {
            resultDiv.innerHTML = ''
            searchString.value = ''
            let toBeDeleted = e.target.getAttribute('data-analysisid')
            let deleteAnalysis = e.target.parentNode.parentNode.remove()
            prices = document.querySelector('.price')
            //update total price by substracting from total
            totalPrice -= parseInt(e.target.parentNode.previousElementSibling.innerText)
            totalPriceSpan.innerText = `${totalPrice} RSD`
            labCubePrice=Math.ceil(totalPrice*((100-discountValue)/100))
            totalLabCubePrice.innerText = `${labCubePrice}  RSD`
            let nameIndex = itemsArray.findIndex((item) => {
                return item.id === toBeDeleted
              })
            itemsArray.splice(nameIndex,1)
            items = JSON.stringify(itemsArray)
            localStorage.setItem('items', items)

            schedule[0].total=totalPrice
            schedule[1].analysis = itemsArray
            schedule[2].labCubePrice = labCubePrice
            schedule[3].labId = labId

            // console.log('2' + scheduleString)
            //remove analysis from basket as well
            // let analysisList = document.getElementById('selectedAnalysis')
            let liItems = document.querySelectorAll(`#selectedAnalysis [data-analysisid]`)
            liItems.forEach(item => {
              if(item.getAttribute('data-analysisid') == toBeDeleted)
                item.parentNode.remove()
                numOfAnalysisBasketTitle.innerHTML=''
                numOfAnalysisBasketTitle.textContent = ` (${itemsArray.length})`
              })


            // let analysisToBeDeleted = document.querySelector('analysisBasketLiItem' > )
            // console.log(analysisBasket)


            let numAnalysis = document.querySelector('.numAnalysis')
            // numAnalysis.textContent = `Broj odabranih analiza (${itemsArray.length})`
            checkout.textContent = itemsArray.length
            let priceList = document.getElementById('priceList')
            if(itemsArray.length == 0) {
              resultSection.classList.add('d-none')
              priceList.classList.remove('unhidePriceList')
              priceList.classList.add('hidePriceList')
              checkout.textContent = '0'
            }
          }
        })

        //delete analysis from table when analysis is deleted from basket
        let analysisList = document.getElementById('selectedAnalysis')
        let newPrice
          analysisList.addEventListener('click', (e) => {

            let resultTableLiItems = document.querySelectorAll(`#resultTable > tr > td [data-analysisid]`)
          resultTableLiItems.forEach( item  => {
              if (e.target.parentNode.previousSibling.getAttribute('data-analysisid') == item.getAttribute('data-analysisid')) {
                totalPrice = totalPrice - (item.parentNode.previousElementSibling.firstChild.getAttribute('data-price'))
                totalPriceSpan.innerText = `${totalPrice} RSD`
                labCubePrice= Math.ceil(totalPrice*((100-discountValue)/100))
                totalLabCubePrice.innerText = `${labCubePrice}  RSD`
                schedule[0].total=totalPrice
                schedule[2].labCubePrice=labCubePrice

                item.parentNode.parentNode.remove()
              }
                // console.log(totalPrice)
                // totalLabCubePrice.innerText = `${labCubePrice} RSD`
              })


          })
      }

        helper.removeAnalysis(itemsArray, checkout)



        schedule.push({"total":totalPrice})
        schedule.push({"analysis":itemsArray})
        schedule.push({"labCubePrice":labCubePrice})
        schedule.push({"labId":labId})
        schedule.push({"date":''})
        scheduleString = JSON.stringify(schedule)


      let scheduleBtn = document.getElementById('schedule')

      scheduleBtn.addEventListener('click', ()=>{

        schedule[4].date = (dateLab.value != "")? dateLab.value:datePatronaza.value
        scheduleString = JSON.stringify(schedule)
        fetch('/schedule/',{
          method:"post",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body:scheduleString
        }).then(response => {
          console.log(response)
          window.location.href="/hvala"
          localStorage.removeItem('items')
        })
      })
    }

if(urlArr[1] == 'profile' && !findUserByEmail) {

  const tabs = document.getElementById('myTab')
  tabs.addEventListener('click', (e) => {
    console.log(e.target.getAttribute("href"))
  })

  const visina = document.getElementById('visina')
  const tezina = document.getElementById('tezina')
  const bmi = document.getElementById('bmi')


  visina.addEventListener('input', () => {
    bmi.value = ((tezina.value)/((visina.value/100)*(visina.value/100))).toFixed(2)
  })

  tezina.addEventListener('input', () => {
    bmi.value = ((tezina.value)/((visina.value/100)*(visina.value/100))).toFixed(2)
  })

  const searchUserEmail = document.getElementById('searchForUserEmail')
    // if(searchUserEmail) {
      // console.log(searchUserEmail)
    // }
} else if(findUserByEmail){
    // const labDashResults = document.getElementById('labDashboard')
    const labDashTable = document.getElementById('labDashResults')

      findUserByEmail.addEventListener('input', () => {

        let searchStr = findUserByEmail.value
          const pagination = document.getElementById('pagination')
        pagination.classList.add('d-none')
        fetch('/users/'+searchStr).then((data) => {
          labDashTable.innerHTML = ''
          data.json().then((result) => {
            console.log(result)
            for(let i=0; i<result.length; i++){

              let formatDate
              if (result[i].uzimanjeUzorka == 'patronaza') {
               formatDate = moment(result[i].scheduledFor).format('D.M.Y / H:mm')
             } else {
               formatDate = moment(result[i].scheduledFor).format('D.M.Y')
             }

              labDashTable.innerHTML += `
                <tbody>
                  <tr class="dashboardResults">
                    <td>${result[i].user.username}</td>
                    <td>${result[i].user.mobile}</td>
                    <td align="align-left">${result[i].user.email}</td>
                    <td align="align-left">${formatDate}</td>
                    <td><span class="${result[i].status}">${result[i].status}</span></td>
                    <td title="broj potrebnih analiza"><strong>${result[i].analyses.length}</strong></td>
                    <td><img src="/images/${result[i].uzimanjeUzorka}.svg" title="${result[i].uzimanjeUzorka}" class="mb-1"></td>
                    <td>${result[i].total}<small>rsd</small></td>
                    <td><button class="btn btn-outline-success" data-toggle="modal" data-target="#modal${result[i]._id}">detalji</button></td>
                  </tr>

                  <!-- Modal -->
                  <div class="modal fade" id="modal${result[i]._id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="exampleModalLongTitle">Prikaz detalja za ${result[i].user.username}</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">
                          <p>${result[i].user.username}</p>
                          ${result[i].analiza}
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

                        </div>
                      </div>
                    </div>
                  </div>
                </tbody>

              `
            }
          })
        })
      })

  }

  //interpratation
let interpretationPage = document.getElementById('interpretationId')

  if(urlArr[1] == 'interpretation' && interpretationPage) {

    let ownerId
    let interpretation = interpretationPage.value
    let lockTheRecord = document.getElementById('zakljucaj')
    let lockStatus = document.getElementById('lockStatus')
    let lockTheRecordArr = []

    // lock the record for interpretation

    if(lockTheRecord.checked == true) {
      lockTheRecord.disabled = true
    }

    lockTheRecord.addEventListener('click', e => {
      if(lockTheRecord.checked == true) {
        ownerId = lockTheRecord.value
        lockTheRecordArr.push({'ownerId':ownerId, 'interpretationId':interpretation})
        lockingInterpretation = JSON.stringify(lockTheRecordArr)
        lockStatus.innerHTML = 'Zaključano'
        lockTheRecord.disabled = true

        fetch('/lockTheInterpretation/',{
          method:"post",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body:lockingInterpretation
        }).then(response => {
          console.log(response)
        })
      }
      else {
        ownerId = null
        lockTheRecordArr.push({'ownerId':ownerId, 'interpretationId':interpretation})
        lockingInterpretation = JSON.stringify(lockTheRecordArr)
        lockStatus.innerHTML = 'Zaključaj'
        fetch('/lockTheInterpretation/',{
          method:"post",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body:lockingInterpretation
        }).then(response => {
          console.log(response)
        })
      }
    })//lock the record end
  } else if(urlArr[1] == 'interpretation') {

    //search for results by patient email
    const labDashTable = document.getElementById('analysisResultsCube')

      findUserByEmail.addEventListener('input', () => {

        let searchStr = findUserByEmail.value

        const pagination = document.getElementById('pagination')
        pagination.classList.add('d-none')
        fetch('/usersLabCube/'+searchStr).then((data) => {
          labDashTable.innerHTML = ''
          data.json().then((result) => {
            console.log(result)
            for(let i=0; i<result.length; i++){

              let formatDate
              if (result[i].uzimanjeUzorka == 'patronaza') {
               formatDate = moment(result[i].scheduledFor).format('D.M.Y / H:mm')
             } else {
               formatDate = moment(result[i].scheduledFor).format('D.M.Y')
             }

              labDashTable.innerHTML += `
                <tbody>
                  <tr class="dashboardResults">
                    <td>${result[i].user.username}</td>
                    <td>${result[i].user.mobile}</td>
                    <td align="align-left">${result[i].user.email}</td>
                    <td align="align-left">${formatDate}</td>
                    <td><span class="${result[i].status}">${result[i].status}</span></td>
                    <td title="broj potrebnih analiza">${result[i].analyses.length}</td>
                    <td><img src="/images/${result[i].uzimanjeUzorka}.svg" title="${result[i].uzimanjeUzorka}" class="mb-1"></td>
                    <td><a  href="/interpretation/${result[i]._id}">protumači</a></td>
                    <td>${result[i].owner ?  result[i].owner.username : ' '}</td>
                  </tr>
                </tbody>
                `
            }
          })
        })
      })// search end
  }


//tumacenje ostalih rezultata

  if(urlArr[1] == 'otherResultsInterpretation' && !interpretationPage) {

    let mins = document.querySelectorAll('.mins')
    let secs = document.querySelectorAll('.secs')
    let hour = document.querySelectorAll('.hours')
    let day = document.querySelectorAll('.days')
    let deadline = document.querySelectorAll('.deadline')
    let deadlinesArr = []

    for (let i = 0; i < deadline.length; i++) {
      deadlinesArr.push(Date.parse(deadline[i].innerHTML))
      var myfunc = setInterval(function() {
        var now = new Date().getTime();
        var timeleft = deadlinesArr[i] - now;

        if (timeleft < 3600000) {
          document.getElementById(hour[i].id).style.color="red"
          document.getElementById(mins[i].id).style.color="red"
          document.getElementById(secs[i].id).style.color="red"
        }

        if (timeleft < 7200000) {
          document.getElementById(hour[i].id).style.color="orange"
          document.getElementById(mins[i].id).style.color="orange"
          document.getElementById(secs[i].id).style.color="orange"
        }

        var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
        var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

        document.getElementById(day[i].id).innerHTML = days + "d "
        document.getElementById(hour[i].id).innerHTML = hours + "h "
        document.getElementById(mins[i].id).innerHTML = minutes + "m "
        document.getElementById(secs[i].id).innerHTML = seconds + "s "

        if (timeleft < 0) {
            clearInterval(myfunc);
            document.getElementById(day[i].id).innerHTML = ""
            document.getElementById(hour[i].id).innerHTML = ""
            document.getElementById(mins[i].id).innerHTML = ""
            document.getElementById(secs[i].id).innerHTML = ""
        }

      }, 1000)
    }

    // var countDownDate = new Date(Date.parse(deadline[0].innerHTML)).getTime();
} else if (urlArr[1] == 'otherResultsInterpretation') {

  //lockTheRecord
  let ownerId
  let interpretation = interpretationPage.value
  let lockTheRecord = document.getElementById('zakljucaj')
  let lockStatus = document.getElementById('lockStatus')
  let lockTheRecordArr = []

  if(lockTheRecord.checked == true) {
    lockTheRecord.disabled = true
  }

  lockTheRecord.addEventListener('click', e => {
    if(lockTheRecord.checked == true) {
      ownerId = lockTheRecord.value
      lockTheRecordArr.push({'ownerId':ownerId, 'interpretationId':interpretation})
      lockingInterpretation = JSON.stringify(lockTheRecordArr)
      lockStatus.innerHTML = 'Zaključano'
      lockTheRecord.disabled = true


      fetch('/lockTheOtherInterpretation/',{
        method:"post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body:lockingInterpretation
      }).then(response => {
        console.log(response)
      })
    }
    else {
      ownerId = null
      lockTheRecordArr.push({'ownerId':ownerId, 'interpretationId':interpretation})
      lockingInterpretation = JSON.stringify(lockTheRecordArr)
      lockStatus.innerHTML = 'Zaključaj'
      fetch('/lockTheOtherInterpretation/',{
        method:"post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body:lockingInterpretation
      }).then(response => {
        console.log(response)
      })
    }
  })//lock the record end

  // add new lines
  const addNewLine = document.getElementById('newLine')
  const counterValue = document.getElementById('counter')
  let counter = 0
  // const otherResultsTable = document.getElementById('resultsUpload')
  const otherResultsTable = document.querySelector('#resultsUpload > tbody')
  addNewLine.addEventListener('click', () => {
    counter += 1
    counterValue.innerHTML = counter
    let newRow = otherResultsTable.insertRow()
    let newCell = newRow.insertCell()

    let analysisNameInput = document.createElement('input')
      analysisNameInput.classList.add('form-control', 'searchForAnalysis')
      analysisNameInput.setAttribute('type', 'text')
      analysisNameInput.style.position = 'relative'
      analysisNameInput.name = "analysisName"
    let analysisFoundInput = document.createElement('ul')
      analysisFoundInput.setAttribute('id', 'analysisFound')
      analysisFoundInput.classList.add('list-group')
      analysisFoundInput.style.position = 'absolute'
      analysisFoundInput.style.width = '100%'
      analysisFoundInput.style.zIndex = 444
    let analysisIdHiddenInput = document.createElement('input')
      analysisIdHiddenInput.classList.add('form-control', 'analysisId')
      analysisIdHiddenInput.type = 'hidden'
      analysisIdHiddenInput.name = 'analysisId'
    let analysisValueInput = document.createElement('input')
      analysisValueInput.classList.add('form-control')
      analysisValueInput.setAttribute('type', 'text')
      analysisValueInput.name = "value"

    let analysisMeasurementInput = document.createElement('input')
      analysisMeasurementInput.classList.add('form-control')
      analysisMeasurementInput.setAttribute('type', 'text')
      analysisMeasurementInput.name = "measure"

    let analysisLessThenInput = document.createElement('input')
        analysisLessThenInput.classList.add('form-control')
        analysisLessThenInput.setAttribute('type', 'text')
        analysisLessThenInput.name = "lessThen"

    let analysisGreaterThenInput = document.createElement('input')
        analysisGreaterThenInput.classList.add('form-control')
        analysisGreaterThenInput.setAttribute('type', 'text')
        analysisGreaterThenInput.name = "greaterThen"

    let analysisValueFromInput = document.createElement('input')
        analysisValueFromInput.classList.add('form-control')
        analysisValueFromInput.setAttribute('type', 'text')
        analysisValueFromInput.name = "valueFrom"

    let analysisValueToInput = document.createElement('input')
        analysisValueToInput.classList.add('form-control')
        analysisValueToInput.setAttribute('type', 'text')
        analysisValueToInput.name = "valueTo"

    let analysisOutOfRange = document.createElement('input')
        analysisOutOfRange.classList.add('form-check-input', 'form-check-inline')
        analysisOutOfRange.setAttribute('type', 'checkbox')
        analysisOutOfRange.name = "outsideOfTheRange"+(counter-1)
        analysisOutOfRange.value="true"

    let analysisCommentInput = document.createElement('textarea')
        analysisCommentInput.classList.add('form-control')
        analysisCommentInput.setAttribute('rows', 3)
        analysisCommentInput.setAttribute('cols', 35)
        analysisCommentInput.name = "commentResult"

    let removeRow = document.createElement('span')
    let removeRowText = document.createTextNode('X')
      removeRow.appendChild(removeRowText)
      removeRow.setAttribute('class', 'removeRow')

      newCell.appendChild(analysisNameInput)
      newCell.appendChild(analysisFoundInput)
      newCell.appendChild(analysisIdHiddenInput)

    let newCellAnalysisValue = newRow.insertCell()
      newCellAnalysisValue.appendChild(analysisValueInput)

    let newCellAnalysisMeasurement = newRow.insertCell()
      newCellAnalysisMeasurement.appendChild(analysisMeasurementInput)

    let newCellAnalysisLessThen = newRow.insertCell()
      newCellAnalysisLessThen.appendChild(analysisLessThenInput)

    let newCellAnalysisGreaterThen = newRow.insertCell()
      newCellAnalysisGreaterThen.appendChild(analysisGreaterThenInput)

    let newCellAnalysisValueFrom = newRow.insertCell()
      newCellAnalysisValueFrom.appendChild(analysisValueFromInput)

    let newCellAnalysisValueTo = newRow.insertCell()
      newCellAnalysisValueTo.appendChild(analysisValueToInput)

    let newCellAnalysisOutsideOfTheRange = newRow.insertCell()
      newCellAnalysisOutsideOfTheRange.appendChild(analysisOutOfRange)

    let newCellAnalysisComment = newRow.insertCell()
      newCellAnalysisComment.appendChild(analysisCommentInput)

    let newCellRemove = newRow.insertCell()
      newCellRemove.appendChild(removeRow)


  // let removeRowButton = document.querySelectorAll('.removeRow')
  // // console.log(removeRowButton)
  //   removeRowButton.forEach(item => {
  //      item.addEventListener('click', e => {
  //        console.log(e.target)
  //      })
  //   });

})






    // let searchforAnalysis = document.querySelectorAll('.searchForAnalysis')
    // let searchForAnalysis = document.getElementById('resultsUpload')
    let results = document.querySelector('#resultsUpload > tbody')

    // searchforAnalysis.forEach((item, index) => {
    otherResultsTable.addEventListener('click', e => {

    // let getAnalyisisNameDiv = document.getElementById('analysisFound')
    let analysisId = document.querySelectorAll('.analysisId')
      if (e.target.classList.contains('searchForAnalysis')) {

        let searchValues = document.querySelectorAll('.searchForAnalysis')

        searchValues.forEach((item, index) => {
          item.addEventListener('input', e => {
            let parentUl = e.target.nextSibling
            let searchStr = e.target.value
            if (e.target.value.length > 2 ) {
            fetch('/analysis/prices/'+searchStr).then((data) => {
              data.json().then((result) => {

                let analysis = result.analysisName
                parentUl.innerHTML = ''
                for(i=0; i<analysis.length; i++) {
                  let liItem = document.createElement('li')
                  liItem.className +="list-group-item"
                  let link = document.createElement('a')
                  link.href=analysis[i]._id
                  // let link = document.createElement('span')
                  link.setAttribute('data-analysisId',analysis[i]._id )
                  link.setAttribute('data-analysisName',analysis[i].analysisName )
                  liItem.appendChild(link)
                  let analysisName = document.createTextNode(analysis[i].analysisName)
                  link.appendChild(analysisName)
                  parentUl.appendChild(liItem)
                } // for end


                let resultList = document.querySelectorAll('#analysisFound li')
                resultList.forEach((item) => {
                  item.addEventListener('click', (b) => {
                    b.preventDefault()
                    e.target.value = b.srcElement.getAttribute('data-analysisName')
                    analysisId[index].setAttribute('value', b.srcElement.getAttribute('data-analysisId'))
                    parentUl.innerHTML=''
                  })
                })
              })// data json end
            })//fetch end
          } //if length>2
          else {
            parentUl.innerHTML=''
          }
          })
        })
      } else if (e.target.classList.contains('removeRow')) {
          e.target.parentNode.parentNode.remove()
          counter -= 1
          counterValue.innerHTML = counter

      }
      })

    // })
}

if(urlArr[1] == 'o-nama') {

  let audio = document.getElementsByTagName("audio")[0];
  let theMusicPlay = document.getElementById('playMusic')
    theMusicPlay.addEventListener('mouseenter', e => {
      audio.play()
      audio.muted = false
    })


  // audio.play();
}



/* ANALYSIS DETAILS PAGE ***************/
if(urlArr[1] == 'results' && urlArr[2] == 'analysis' && urlArr[3] !== ''  ) {
//scrollspy initialization for side navigation

  $('body').scrollspy({
    target: '#sideMenu',
    offset: 30
  })

  //remember municipalityValue
  let municipality = document.getElementById('municipality')
  let municipalityValue = JSON.parse(localStorage.getItem('municipality'))
  if (municipalityValue != null) {
    municipality.value = municipalityValue
  }

  let priceList = document.getElementById('priceList')
  let closePriceList = document.getElementById('closePriceList')
  // display and hide price list
    checkout.addEventListener('click', ()=> {
      priceList.classList.add('unhidePriceList')
      priceList.classList.remove('hidePriceList')
    })
  //
    closePriceList.addEventListener('click', () => {
      priceList.classList.add('hidePriceList')
      priceList.classList.remove('unhidePriceList')
      priceList.removeAttribute('style')
    })
    //remove analysis

    helper.removeAnalysis(itemsArray, checkout)

    //display best price
    const showPriceBtn = document.querySelector('.showPrice')
    let mapArea = document.getElementById('mapPrices')
    showPriceBtn.addEventListener('click', e => {
      e.preventDefault()
      if(document.getElementById('municipality')!= null) {
        let municipality = document.getElementById('municipality')
        municipalityValue = municipality.options[municipality.selectedIndex].value
        localStorage.setItem('municipality', JSON.stringify(municipalityValue))
      } else {
        municipalityValue = JSON.parse(localStorage.getItem('municipality'))
      }
      window.location = '/nadjiLab'
    })


  //take input values from search box and filter reference
  let innerPageSearch = document.getElementById('searchResultPage')
  let analysisRadio = document.querySelectorAll('input[name=searchFilter]')

  // search for analysis or lab
  helper.searchLabAnalysis(innerPageSearch,analysisRadio)

  //add analysis from analysis details page
  let analysisBtn = document.querySelector('.addAnalysis')
  /* take the analysisname from button and check if this analysis
    is already added to basket */
  let disableAddBtn = itemsArray.findIndex(item => {
    return analysisBtn.getAttribute('data-analysisName') == item.name
  })

  /* if analysis is already in basket disable button for
    adding analysis to basket*/
  if(disableAddBtn !== -1) {
    analysisBtn.innerHTML = '&#10004;'
    analysisBtn.disabled = true
    analysisBtn.classList.remove('addAnalysis')
    analysisBtn.classList.add('deleteAnalysis')
  }
  helper.addAnalysis(itemsArray, analysisBtn, checkout)
  // helper.removeAnalysis(itemsArray, checkout)
}

/*********************** BACKEND ************************/
if (location.match('addLab')) {

// populating working days Tuesday-Friday based on values from Monday
  let mondayOpens = document.querySelector('#mondayOpens')
  let mondayCloses = document.querySelector('#mondayCloses')

  let workingWeek = document.querySelectorAll('.__working-hours')

  mondayCloses.addEventListener('blur', (e) => {
    document.getElementById('saturdayOpens').focus()
    for(i=0; i<workingWeek.length-4; i++)
      if(i%2 == 0) {
        workingWeek[i].value=mondayOpens.value
      } else {
        workingWeek[i].value=mondayCloses.value
      }
    })

    // delete all working hours on click / set 24h to false
    let deleteWH = document.querySelector('#deleteWH')
    deleteWH.addEventListener('click', (e) => {
      e.preventDefault()
      for(i=0; i<workingWeek.length; i++) {
        workingWeek[i].value=''
      }
      open24h.checked=false
    })

    // set working hours for the whole week to 00-24h
    const open24h = document.querySelector('#open24h')
      open24h.addEventListener('change', (e) => {
        e.preventDefault()
        if(open24h.checked == true) {
          for(i=0; i<workingWeek.length; i++)
            if(i%2 == 0) {
              workingWeek[i].value='00:00'
            } else {
              workingWeek[i].value='24:00'
            }
        } else {
          for(i=0; i<workingWeek.length; i++) {
            workingWeek[i].value=''
          }
        }
      })

  // search id for the place and populate other address related
  // fields on lab form

  let searchPlaces = document.getElementById('searchPlaces')
  let resultDiv = document.getElementById('result')
  let city = document.getElementById('city')
  // let minicipality = document.getElementById('municipality')
  let municipality = document.getElementById('municipality')
  let postalCode = document.getElementById('postalCode')

  searchPlaces.addEventListener('input', (e) => {
  if(searchPlaces.value.length>=3) {
      fetch('/places/'+e.target.value).then((data) => {
          data.json().then((result) => {
            resultDiv.innerHTML=''
            for(i=0; i<result.length; i++) {
              let liItem = document.createElement('li')
              liItem.className +="list-group-item"
              let link = document.createElement('a')
              link.href=result[i]._id
              link.setAttribute('data-municipality',result[i].municipality)
              link.setAttribute('data-postalCode',result[i].postalCode)
              // link.className += ""
              liItem.appendChild(link)
              let placeName = document.createTextNode(result[i].place)
              link.appendChild(placeName)
              resultDiv.appendChild(liItem)
            }// for end

            let resultList = document.querySelectorAll('#result li')
            resultList.forEach((item) => {
              item.addEventListener('click', (e) => {
                e.preventDefault()
                searchPlaces.value = e.srcElement.attributes.href.textContent
                city.value = e.target.innerText
                municipality.value=e.srcElement.getAttribute('data-municipality')
                postalCode.value=e.srcElement.getAttribute('data-postalCode')
                resultDiv.innerHTML=''
              })
            })

          })// data json end
      })
    } else {
      console.log('enter at least 3 letters')
      resultDiv.innerHTML=''
      city.value=''
      municipality.value=''
      postalCode.value=''
    }
  })

  // add new phone field icon
    let addNewPhone = document.querySelector('#addNewPhone')
    let newPhone =  new NewElement('#contactData','div','form-group col-sm-4','small','form-text text-muted','new phone', 'form-control', 'e.g. 066/3423234', 'phone[]', '^0\\d\\d\\/\\d+')
      newPhone.removeElement('.removeField')

    // add additional phone input fields
    addNewPhone.addEventListener('click', (e) => {
      newPhone.addElement()
      newPhone.removeElement('.removeField')
    })

  } // window location = /addLab


  if (location.match('addAnalysis')) {
    $('#summernote').summernote({

          styleTags: [
          'p','br',
          {title: 'orderList', tag: 'ul', className: 'textList', value: 'ul'},
          {title: 'leadText', tag: 'p', className: 'lead text-center', value:'p'},
          {title:'reset', tag:'p',className:'', value:'p'}

        ],
          height: 480,
          toolbar: [
              ['view', ['codeview']],
              ['img', ['picture']],
              ['style', ['style', 'addclass', 'clear']],
              ['fontstyle', ['bold', 'italic', 'ul', 'ol', 'link', 'paragraph']],
              ['fontstyleextra', ['strikethrough', 'underline', 'hr', 'color', 'superscript', 'subscript']],
          ]
        });

    let addNewAbbr = document.querySelector('#addNewAbbr')
    let addNewAlt = document.querySelector('#addNewAlt')
    let addNewConnectedAnalysis = document.querySelector('#addNewRelatedAnalysis')
    let addNewConnectedDiseases = document.querySelector('#addNewDiseases')

    let newAbbr = new NewElement('#abbrAltContainer', 'div', 'form-group col-sm-3', 'small', 'form-text text-muted', 'new abbr', 'form-control', 'new abbr', 'abbr[]', '.+')
      newAbbr.removeElement('.removeField')

      addNewAbbr.addEventListener('click', (e) => {
        newAbbr.addElement()
        newAbbr.removeElement('.removeField')
      })

    let newAlt = new NewElement('#abbrAltContainer', 'div', 'form-group col-sm-3', 'small', 'form-text text-muted', 'alternative name', 'form-control', 'new alt', 'alt[]', '.+')
      newAlt.removeElement('.removeField')

      addNewAlt.addEventListener('click', (e) => {
        newAlt.addElement()
        newAlt.removeElement('.removeField')
      })

    let groupId = document.getElementById('groupId')
    let resultGroup = document.getElementById('resultGroup')
    let groupName = document.getElementById('groupName')

    groupId.addEventListener('input', (e) => {
      if(groupId.value.length >= 1) {
        fetch('/groups/'+e.target.value).then((data) => {
          data.json().then((result) => {
            resultGroup.innerHTML=''
            for(i=0; i<result.length; i++) {
              let liItem = document.createElement('li')
              liItem.className +="list-group-item"
              let link = document.createElement('a')
              link.href=result[i]._id
              liItem.appendChild(link)
              let groupName = document.createTextNode(result[i].name)
              link.appendChild(groupName)
              resultGroup.appendChild(liItem)
            } // for end

            let groupNamesList = document.querySelectorAll('#resultGroup li')
              groupNamesList.forEach((itemGroup) => {
                itemGroup.addEventListener('click', (e) => {
                  e.preventDefault()
                  groupId.value = e.srcElement.attributes.href.textContent
                  groupName.value = e.target.innerText
                  resultGroup.innerHTML=''
                })// click end
              })// foreach end
          })// data.json end
        })// fetch end
      } else {
        console.log('enter at least 3 letters')
          resultGroup.innerHTML=''
          groupName.value =''
        }
    })// groupid addEventListener

// searching for connected analyses

    let connectedAnalysis = document.getElementById('connectedAnalysis')
    let getAnalyisisNameDiv = document.getElementById('resultConnectedAnalysis')
    let relatedAnalysisParent = document.getElementById('relatedAnalysis')
    let parentUl = document.querySelector('.connAnalysisUl')
    // let parentUl

    if(typeof(parentUl) !== 'undefined' && parentUl !== null) {
      parentUl = document.querySelector('.connAnalysisUl')
      // parentUl.setAttribute('id', 'tess')
    }  else {
      parentUl = document.createElement('ul')
        parentUl.className += 'list-inline my-3 connAnalysisUl'
        parentUl.setAttribute('id', 'tess')
    }

    let analysisSelected = []

    // push items to array when form is reloaded
    let liitems = document.querySelectorAll('.connAnalysisUl li')
      liitems.forEach((item) => {
        analysisSelected.push(item.innerText)
      })

    connectedAnalysis.addEventListener('input', (e) => {
      if (connectedAnalysis.value.length > 2) {
      fetch('/analysis/'+e.target.value).then((data) => {
        data.json().then((result) => {
          // console.log(result)
          getAnalyisisNameDiv.innerHTML = ''
          for(i=0; i<result.length; i++) {
            let liItem = document.createElement('li')
            liItem.className +="list-group-item"
            let link = document.createElement('a')
            link.href=result[i]._id
            liItem.appendChild(link)
            let analysisName = document.createTextNode(result[i].analysisName)
            link.appendChild(analysisName)
            getAnalyisisNameDiv.appendChild(liItem)
          } // for end
        })// datajson end
      })// fetch end
    } else {
        getAnalyisisNameDiv.innerHTML = ''
      }
    })// connectedAnalysis event listener end

    let analysisNameList = document.getElementById('resultConnectedAnalysis')

        analysisNameList.addEventListener('click', (e) => {
          e.preventDefault()

          if(!analysisSelected.includes(e.target.innerText)) {
            analysisSelected.push(e.target.innerText)

            // creating hidden input tag and grab analysis id
            let connectedAnalysisID = document.createElement('input')
            connectedAnalysisID.type = 'hidden'
            connectedAnalysisID.name = 'connectedTo[]'
            connectedAnalysisID.setAttribute('value', e.srcElement.attributes.href.textContent)

            let connAnalysisName = document.createElement('input')
            connAnalysisName.type = 'hidden'
            connAnalysisName.name = 'connectedToName[]'
            connAnalysisName.setAttribute('value', e.target.innerText)

            let connectedAnalysisLi = document.createElement('li')
            connectedAnalysisLi.className += 'list-inline-item __connectedAnalysis'
            let connectedAnalysisInnerText = document.createTextNode(e.target.innerText)

            connectedAnalysisLi.appendChild(connectedAnalysisInnerText)
            connectedAnalysisLi.appendChild(connectedAnalysisID)
            connectedAnalysisLi.appendChild(connAnalysisName)
            parentUl.appendChild(connectedAnalysisLi)
            relatedAnalysisParent.appendChild(parentUl)

            connectedAnalysis.value=''
            connectedAnalysis.focus()
            getAnalyisisNameDiv.innerHTML = ''

          } else {
            console.log('analiza vec dodata')
            connectedAnalysis.value=''
            connectedAnalysis.focus()
            getAnalyisisNameDiv.innerHTML = '' }

        })// addevent listener end

      // remove connected analyses
      helper.removeElement(parentUl, analysisSelected)

    // search for connected Diseases and adding them to the DOM
    let connectedDiseases = document.getElementById('connectedDiseases')
    let getDiseasesDiv = document.getElementById('resultConnectedDiseases')
    let diseasesParent = document.getElementById('diseases')
    let diseaseParentUl = document.querySelector('.connDiseaseUl')

    if(typeof(diseaseParentUl) !== 'undefined' && diseaseParentUl !== null) {
      diseaseParentUl = document.querySelector('.connDiseaseUl')
    } else {
      diseaseParentUl = document.createElement('ul')
        diseaseParentUl.className += 'list-inline my-3 connDiseaseUl'
    }

    let diseaseSelected = []

    // push items to array when form is reloaded
    let diseaseItems = document.querySelectorAll('.connDiseaseUl li')
      diseaseItems.forEach((item) => {
        diseaseSelected.push(item.innerText)
      })

    connectedDiseases.addEventListener('input', (e) => {
      if(connectedDiseases.value.length > 2) {
        fetch('/diseases/'+e.target.value).then((data) =>{
          data.json().then((result) => {
            getDiseasesDiv.innerHTML = ''
            for(i=0; i<result.length; i++) {
              let liItem = document.createElement('li')
              liItem.className += "list-group-item"
              let link = document.createElement('a')
              link.href=result[i]._id
              liItem.appendChild(link)
              let diseaseName = document.createTextNode(result[i].name)
              link.appendChild(diseaseName)
              getDiseasesDiv.appendChild(liItem)
            } // for end
          })// data.json end
        })// fetch end
      }// if end
        else {
          getDiseasesDiv.innerHTML = ''
        }
  })// connectedDisease addEventListener

    // adding diseases to the page
      let addDisease = document.getElementById('resultConnectedDiseases')

      addDisease.addEventListener('click', (e) => {
          e.preventDefault()

        if(!diseaseSelected.includes(e.target.innerText)) {
            diseaseSelected.push(e.target.innerText)
            // creating hidden input tag and grab analysis id
            let diseaseID = document.createElement('input')
            diseaseID.type = 'hidden'
            diseaseID.name = 'diseasesId[]'
            diseaseID.setAttribute('value', e.srcElement.attributes.href.textContent)

            let diseaseName = document.createElement('input')
            diseaseName.type = 'hidden'
            diseaseName.name = 'diseaseName[]'
            diseaseName.setAttribute('value', e.target.innerText)

            let diseaseLi = document.createElement('li')
            diseaseLi.className += 'list-inline-item __connectedAnalysis'
            let diseaseInnerText = document.createTextNode(e.target.innerText)
            diseaseLi.appendChild(diseaseInnerText)
            diseaseLi.appendChild(diseaseID)
            diseaseLi.appendChild(diseaseName)
            diseaseParentUl.appendChild(diseaseLi)
            diseasesParent.appendChild(diseaseParentUl)
            // clear the input
            connectedDiseases.value = ''
            connectedDiseases.focus()
            getDiseasesDiv.innerHTML = ''
          }
          else {
            console.log('oboljenje vec dodato')
            connectedDiseases.value = ''
            connectedDiseases.focus()
            getDiseasesDiv.innerHTML = ''
          }
      })// addDisease end addEventListener

        // remove diseases
        helper.removeElement(diseaseParentUl,diseaseSelected)


    let searchReference = document.getElementById('searchReference')
    let referenceList = document.getElementById('referenceList')
    let referenceParentDiv = document.getElementById('references')
    let referenceUl = document.querySelector('.referenceUl')

    if(typeof(referenceUl) !== 'undefined' && referenceUl !== null) {
      referenceUl = document.querySelector('.referenceUl')
    } else {
      referenceUl = document.createElement('ol')
        referenceUl.className += 'referenceUl'
    }

    let selectedReferences = []
    // push items to array when form is reloaded
    let referenceItems = document.querySelectorAll('.referenceUl li')
      referenceItems.forEach((item) => {
        selectedReferences.push(item.innerText)
      })

    searchReference.addEventListener('input', (e) => {
      if(searchReference.value.length > 2) {
        fetch('/reference/'+e.target.value).then((data) => {
          data.json().then((result) => {
            referenceList.innerHTML = ''
            for(i=0; i<result.length; i++) {
              let liItem = document.createElement('li')
              liItem.className += "list-group-item "
              let link = document.createElement('a')
              link.href=result[i]._id
              liItem.appendChild(link)
              let referenceName = document.createTextNode(result[i].referenceTitle)
              link.appendChild(referenceName)
              referenceList.appendChild(liItem)
            }// for end
          })// data json end
        })// fetch end
      } else {
        referenceList.innerHTML = ''
      }
    })

  let addReference = document.getElementById('referenceList')

  addReference.addEventListener('click', (e) => {
        e.preventDefault()

    if(!selectedReferences.includes(e.target.innerText)) {
        selectedReferences.push(e.target.innerText)
        // creating hidden input tag and grab analysis id
        let referenceID = document.createElement('input')
        referenceID.type = 'hidden'
        referenceID.name = 'references[]'
        referenceID.setAttribute('value', e.srcElement.attributes.href.textContent)

        let referenceName = document.createElement('input')
        referenceName.type = 'hidden'
        referenceName.name = 'referenceName[]'
        referenceName.setAttribute('value', e.target.innerText)

        // TODO: move remove functionality to functon
        let removeButton = document.createElement('small')
        removeButton.className += 'ml-2 float-right text-danger removeConnectedAnalysis'
        // let removeText = document.createTextNode('x')
        // removeButton.appendChild(removeText)
        // remove section end
        let referenceLi = document.createElement('li')
        referenceLi.className = 'my-2'
        // referenceP.className += 'd-block'
        let referenceTitle = document.createTextNode(e.target.innerText)
        referenceLi.appendChild(referenceTitle)
        // referenceLi.appendChild(removeButton)
        referenceLi.appendChild(referenceID)
        referenceLi.appendChild(referenceName)
        referenceUl.appendChild(referenceLi)
        referenceParentDiv.appendChild(referenceUl)

        searchReference.value=''
        searchReference.focus()
        referenceList.innerHTML = ''
    } else {
      searchReference.value=''
      searchReference.focus()
      referenceList.innerHTML = ''
    }
  })// addreference addEventListener

  // remove reference after it is added to the page
  helper.removeElement(referenceUl,selectedReferences)

  let searchEditor = document.getElementById('searchEditors')
  let editorsList = document.getElementById('editorsList')
  let editorParentDiv = document.getElementById('editor')
  let editorDiv

  if(typeof(editorDiv) !== 'undefined' && editorDiv !== null) {
    // select editor div after page refresh
    editorDiv = document.querySelector('.__editorsList')
  } else {
    editorDiv = document.createElement('div')
    editorDiv.className += '__editorsList'
  }

  let selectedEditor = []
  //take editor id after page refresh
  let editors = document.querySelector('.__editorsList input[name=writtenBy]')
    if(editors) {
      selectedEditor.push(editors.value)
      // console.log(selectedEditor)
    }

    searchEditor.addEventListener('input', (e) => {
      // if(document.querySelector('.__editorsList')) {
      //   alert('vec je dodat urednik za ovu analizu, ukoliko hoces da ga izmenis prvo ukloni postojeceg')
      // } else {
        if(searchEditor.value.length > 2) {
          fetch('/editors/'+e.target.value).then((data) => {
            data.json().then((result) => {
              editorsList.innerHTML = ''
              for(i=0; i<result.length; i++) {
                let liItem = document.createElement('li')
                liItem.className += "list-group-item "
                let link = document.createElement('a')
                link.href=result[i]._id
                link.setAttribute('data-editorImage',result[i].picture)
                liItem.appendChild(link)
                let editorName = document.createTextNode(`${result[i].firstName} ${result[i].lastName}`)
                link.appendChild(editorName)
                editorsList.appendChild(liItem)
              }// for end
            })// data json end
          })// fetch end
        } else {
          editorsList.innerHTML = ''
          }
      // } // else end
    })// search editor addeventlistener end

  let addEditor = document.getElementById('editorsList')

      addEditor.addEventListener('click', (e) => {
        e.preventDefault()
        // if(selectedEditor.length == 0) {
        //   selectedEditor.push(e.srcElement.attributes.href.textContent)

        editorDiv.setAttribute('id', 'ddd')
        let editorID = document.createElement('input')
        editorID.type = 'hidden'
        editorID.name = 'writtenBy'
        editorID.setAttribute('value', e.srcElement.attributes.href.textContent)

        // set hidden input for keeping editor's name after page refresh
        let inputEditorName = document.createElement('input')
          inputEditorName.type = 'hidden'
          inputEditorName.name = 'editorHiddenName'
          inputEditorName.setAttribute('value', e.target.innerText)

        //set hidden input for keeping editor's picture
        let inputEditorImage = document.createElement('input')
          inputEditorImage.type = 'hidden'
          inputEditorImage.name = 'editorHiddenImage'
          inputEditorImage.setAttribute('value', e.srcElement.getAttribute('data-editorImage'))

        let editorh4 = document.createElement('h4')
          editorh4.className = 'ml-4 mt-3 float-right'
        let editorImage = document.createElement('img')
          editorImage.className = 'rounded ml-2 mt-3 __editorImage'
          editorImage.setAttribute('src','/images/editors/'+e.srcElement.getAttribute('data-editorImage'))

        let editorDisplayName = document.createTextNode(e.target.innerText)
        editorh4.appendChild(editorDisplayName)
        editorDiv.appendChild(editorImage)
        editorDiv.appendChild(editorh4)
        editorDiv.appendChild(inputEditorName)
        editorDiv.appendChild(inputEditorImage)
        editorDiv.appendChild(editorID)
        editorParentDiv.appendChild(editorDiv)

        searchEditor.value=''
        editorsList.innerHTML = ''
        let removeEditor = document.querySelector('.__editorsList')
            removeEditor.addEventListener('click', (e) => {
              while(removeEditor.firstChild) {
                removeEditor.firstChild.remove()
              }
            })
      })// item.addeventListener end

      // helper.removeElement(editorDiv,selectedEditor)

      let removeEditor = document.querySelector('.__editorsList')
      if(removeEditor) {
          removeEditor.addEventListener('click', (e) => {
            while(removeEditor.firstChild) {
              removeEditor.firstChild.remove()
            }
            removeEditor.remove()
          })
      }

  }// location match end addAnalysis

  if (location.match('addPrice')) {
    let newPriceList =  new PriceList.createPrice()
  }

//delete analysis
  if(location.match('allAnalysis')) {
    helper.deleteDocument('.deleteDocument','analiza ce biti obrisana?','/allAnalysis/','/allAnalysis','doslo je do greske')
    }

//delete lab
  if(location.match('allLabs')) {
    helper.deleteDocument('.deleteDocument','laboratorija ce biti obrisana','/allLabs/','/allLabs','doslo je do greske')
  }

//delete group
  if(location.match('allGroupsList')) {
    helper.deleteDocument('.deleteDocument', 'grupa ce biti obrisana', '/allGroupsList/', '/allGroupsList', 'doslo je do greske prilikom brisanja grupe')
  }
//delete disease
  if(location.match('allDiseases')) {
    helper.deleteDocument('.deleteDocument', 'oboljenje ce biti obrisano', '/allDiseases/', '/allDiseases', 'doslo je do greske prilikom brisanja oboljenja')
  }
//delete editor
  if(location.match('allEditors')) {
    helper.deleteDocument('.deleteDocument', 'urednik ce biti obrisan', '/allEditors/', '/allEditors', 'doslo je do greske prilikom brisanja urednika')
  }
//delete reference
  if(location.match('allReferences')) {
    helper.deleteDocument('.deleteDocument', 'referenca ce biti obrisana', '/allReferences/', '/allReferences', 'doslo je do greske prilikom uklanjanja reference')
  }
//delete faq
  if(location.match('allFaqs')) {
    helper.deleteDocument('.deleteDocument', 'Pitanje ce biti obrisano', '/allFaqs/', '/allFaqs', 'doslo je do greske prilikom uklanjanja pitanja')
  }
//delete priceList
  if(location.match('allPrices')) {
    helper.deleteDocument('.deleteDocument', 'Cenovnik ce biti obrisan', '/allPrices/', '/allPrices', 'doslo je do greske prilikom brisanja cenovnika')
  }

  //delete priceList
    if(location.match('profile')) {
      helper.deleteDocument('.deleteDocument', 'Ovaj rezultat ce biti trajno obrisan, bez mogućnosti vraćanja podataka! Da li ste sigurni?', '/profile/', '/profile/', 'doslo je do greske prilikom brisanja rezultata')
    }


}// window onload end
