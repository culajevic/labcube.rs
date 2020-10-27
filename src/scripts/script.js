require('../scss/style.scss')

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
  $('#resultTable, #resultTableAnalysis').on('mouseenter','tr>td>img.tooltipImg', function(){
    var imageSrc = $(this).attr('src');
    // if (imageSrc == '/images/detail.svg') {
      $(this).attr('src','/images/detail_mv.svg');
    }).on('mouseleave','tr>td>img.tooltipImg', function(){
      $(this).attr('src', '/images/detail.svg');
    })
});

// changing analysis number color on hover
$('.click-more').hover(function(){
  $(this).find("span").toggleClass("broj-analiza-hover");
});

// sticky navigation for index page
$(window).scroll(function(){
  var height = $(window).scrollTop();
    if(height > 460) {
      $("#header > nav").addClass('fixed-top-background fixed-top');
    }
    else {
      $("#header > nav").removeClass('fixed-top-background fixed-top');
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

//MUST CHECK THIS!!!!!!!
/*if local storage has already some items display selected items
in sidebar basket on any page which is not index */
const checkUrl = /result.*/
const group = /group/
if(itemsArray.length>0 && (location.match(group) || location.match(checkUrl))) {
  helper.displayBasket(itemsArray)
}

//MUST CHECK THIS!!!!!!!
//get reference to checkout element which displays number of selected analysis in navigation
const checkCMSAdd = /add.*/
const checkCMSAll = /all.*/
if (itemsArray.length > 0 && !location.match(checkCMSAdd) && !location.match(checkCMSAll)) {
  checkout.classList.remove('d-none')
  checkout.textContent = itemsArray.length
}


window.onload = () => {

/* INDEX PAGE ***************/

if(location === '/') {

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


// if (urlArr[1] === 'results' && urlArr[2] == '') {
if (document.getElementById('results')!=null) {

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
  const municipality = document.getElementById('municipality')
  const showPriceBtn = document.querySelector('.showPrice')
  let mapArea = document.getElementById('mapPrices')
  showPriceBtn.addEventListener('click', e => {
    e.preventDefault()
    window.scrollTo({
    top:0,
    behavior:'smooth'})
    mapArea.classList.remove('d-none')
    let passIds = []
    resultDiv.innerHTML = ''
    itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : []
      itemsArray.forEach(item => {
      passIds.push(item.id)
      });

    let municipalityValue = municipality.options[municipality.selectedIndex].value
    let markers = []

    fetch('/cenovnik/'+municipalityValue+'/'+passIds).then(data => {
      data.json().then(result => {
        loaderWrapper.style.opacity = 0
        let labTemplate = document.createElement('div')
          labTemplate.className = 'col-12 d-flex flex-row flex-wrap'

        for(let i=0; i<result.length; i++) {
// console.log(result[i].lab[0].workingHours)

        markers.push(
          {
            lat:result[i].lab[0].location.coordinates[1], lng:result[i].lab[0].location.coordinates[0],
            iconImage:'/images/pinopen.svg',
            total:result[i].total,
            name:result[i].lab[0].labName,
            address:result[i].lab[0].address,
            phone:result[i].lab[0].phone,
            workinghours:result[i].lab[0].workingHours,
            slug:result[i].lab[0].slug
          }
        )
          resultDiv.innerHTML = ''
          labTemplate.innerHTML += `

          <div class="lab-card">
            <div>
            ${(result[i].lab[0].private)? '<img src=/images/osiguranje.svg class="labInfoWindowOsiguranje privateInssuranceIcon${i}" title="laboratorija sarađuje sa privatnim osiguranjem">' : ''}
            ${(result[i].lab[0].accredited)? '<img src=/images/verified.svg class="labInfoWindowVerified accreditedIcon${i}" title="laboratorija je akreditovana">' : ''}
            <span class="labInfoWindowTitle">${result[i].lab[0].labName}</span>
           </div>
             <div class="labInfoWindow">
                 <img src="/images/lablogo/${result[i].lab[0].logo}" class="labLogoInfoWindow">

                 <p class="labInfoWindowAdresa">${result[i].lab[0].address}</p>
                 <p class="labInfoWindowGrad"></p>
                 <p class="labInfoWindowTelefoni"> ${result[i].lab[0].phone} </p>
             </div>
             <div class="labInfoFooter">
                 <img src="/images/radnoVreme_black.svg" class="labInfoWindowWorkingHoursIcon">
                 <div class="radnoVreme">Radno vreme</div>
                 <div id='otvoreno' class='otvoreno status'></div>
                 <div class="labInfoRadnoVremeDetalji">
                   <p class="daysInWeek monday${result[i]} text-center">P<span>${result[i].lab[0].workingHours.monday.opens} - ${result[i].lab[0].workingHours.monday.closes}</span></p>
                   <p class="daysInWeek tuesday${result[i]} text-center">U<span>${result[i].lab[0].workingHours.tuesday.opens} - ${result[i].lab[0].workingHours.tuesday.closes}</span></p>
                   <p class="daysInWeek wednesday${result[i]} text-center">S<span>${result[i].lab[0].workingHours.wednesday.opens} - ${result[i].lab[0].workingHours.wednesday.closes}</span></p>
                   <p class="daysInWeek thursday${result[i]} text-center">Č<span>${result[i].lab[0].workingHours.thursday.opens} - ${result[i].lab[0].workingHours.thursday.closes}</span></p>
                   <p class="daysInWeek friday${result[i]} text-center">P<span></span>${result[i].lab[0].workingHours.friday.opens} - ${result[i].lab[0].workingHours.friday.closes}</p>
                   <p class="daysInWeek saturday${result[i]} text-center">S<span></span>${result[i].lab[0].workingHours.saturday.opens} - ${result[i].lab[0].workingHours.saturday.closes}</p>
                   <p class="daysInWeek sunday${result[i]} text-center">N<span></span>${result[i].lab[0].workingHours.sunday.opens} - ${result[i].lab[0].workingHours.sunday.closes}</p>
                 </div>
              </div>
              <a class="btn btn-block btnLabDetails buttonId mt-2" href="laboratorija/${result[i].lab[0].slug}/${passIds}">saznaj više</a>
           </div>`

           resultDiv.innerHTML = `
           <section id="labDetails">
             <div class="container">
               <div class="row labContainer">
               </div>
             </div>
           </section>`

           //append labcard to page
           document.querySelector('.labContainer').appendChild(labTemplate)
        }
        // map options
        let options = {
          zoom:16,
          // center: {lat:44.808048, lng:20.462796},
          disableDefaultUI: true,
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: true,
          rotateControl: false,
          fullscreenControl: true,
          fullscreenControlOptions:{
            position:google.maps.ControlPosition.RIGHT_BOTTOM
          },
          styles: [
              {
                "featureType": "administrative.country",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": "#fbd2d9"
                  },
                  {
                    "visibility": "on"
                  }
                ]
              },
              {
                "featureType": "administrative.country",
                "elementType": "geometry.stroke",
                "stylers": [
                  {
                    "color": "#9896a9"
                  },
                  {
                    "weight": 2
                  }
                ]
              },
              {
                "featureType": "administrative.land_parcel",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": "#9896a9"
                  }
                ]
              },
              {
                "featureType": "administrative.land_parcel",
                "elementType": "labels",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "administrative.locality",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "visibility": "on"
                  }
                ]
              },
              {
                "featureType": "administrative.neighborhood",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "visibility": "on"
                  }
                ]
              },
              {
                "featureType": "administrative.neighborhood",
                "elementType": "labels",
                "stylers": [
                  {
                    "color": "#aaa9b1"
                  },
                  {
                    "visibility": "simplified"
                  }
                ]
              },
              {
                "featureType": "poi",
                "elementType": "labels.text",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "poi.business",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": "#aadc55"
                  }
                ]
              },
              {
                "featureType": "poi.park",
                "elementType": "labels.text",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": "#ecebed"
                  },
                  {
                    "visibility": "on"
                  }
                ]
              },
              {
                "featureType": "road",
                "elementType": "labels.text",
                "stylers": [
                  {
                    "color": "#d8d6dc"
                  }
                ]
              },
              {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": "#fefefe"
                  }
                ]
              },
              {
                "featureType": "road.arterial",
                "elementType": "labels.text",
                "stylers": [
                  {
                    "color": "#9a9a9a"
                  },
                  {
                    "visibility": "simplified"
                  }
                ]
              },
              {
                "featureType": "road.highway",
                "elementType": "labels",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "road.local",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "road.local",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": "#eaecec"
                  },
                  {
                    "visibility": "on"
                  }
                ]
              },
              {
                "featureType": "road.local",
                "elementType": "labels",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#9ba4a4"
                  },
                  {
                    "visibility": "on"
                  }
                ]
              },
              {
                "featureType": "transit",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "transit.station",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "visibility": "on"
                  }
                ]
              },
              {
                "featureType": "transit.station.bus",
                "stylers": [
                  {
                    "visibility": "simplified"
                  }
                ]
              },
              {
                "featureType": "transit.station.bus",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": "#ff00ff"
                  },
                  {
                    "visibility": "simplified"
                  }
                ]
              },
              {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": "#1d88e5"
                  },
                  {
                    "lightness": 15
                  }
                ]
              }
            ]
        }
        // new map
        let map = new google.maps.Map(document.getElementById('mapPrices'), options)
            map.setCenter({lat:result[0].lab[0].location.coordinates[1], lng:result[0].lab[0].location.coordinates[0]});

        for(i=0; i<markers.length; i++) {
        addMarker(markers[i].lat,
                  markers[i].lng,
                  markers[i].total,
                  markers[i].name,
                  markers[i].address,
                  markers[i].phone,
                  markers[i].workinghours,
                  markers[i].slug)
        }

      // console.log(markers)
        function addMarker(lat, lng, total, name, address, phone, workinghours,slug) {
          let marker = new google.maps.Marker({
            position:{lat:lat, lng:lng},
            icon:{
              url:'/images/pinprice.svg',
              labelOrigin: {x: 32, y: 32},
              scaledSize: new google.maps.Size(60, 60)
            },
            label:{
              text:total.toString(),
              fontWeight: 'bold',
              fontSize: '12px',
              color:'white'
            },
            map:map
            })

            let infoWindow = new google.maps.InfoWindow({
              maxWidth:600,
              content:`<p class="labInfoWindowTitle mb-2 pb-0"><a href="/laboratorija/${slug}/${passIds}">${name}</a></p>

                      <div class="labInfoWindow">
                        <img src="images/placeholder.svg" class="labLogoInfoWindow">
                        <span class="">${address}</span>
                        <span class="labInfoWindowTelefoni">${phone} </span>
                    </div>
                    <table class="table table-sm workingHoursLabDetails mt-2">
                      <thead>
                        <tr>
                          <th class="text-center px-0 whInside">P</th>
                          <th class="text-center px-0 whInside">U</th>
                          <th class="text-center px-0 whInside">S</th>
                          <th class="text-center px-0 whInside">Č</th>
                          <th class="text-center px-0 whInside">P</th>
                          <th class="text-center px-0 whInside">S</th>
                          <th class="text-center px-0 whInside">N</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="whInside px-0 text-center">${workinghours.monday.opens} - ${workinghours.monday.closes}</td>
                          <td class="whInside px-0 text-center">${workinghours.tuesday.opens} - ${workinghours.tuesday.closes}</td>
                          <td class="whInside px-0 text-center radnoVreme open">${workinghours.wednesday.opens} - ${workinghours.wednesday.closes}</td>
                          <td class="whInside px-0 text-center">${workinghours.thursday.opens} - ${workinghours.thursday.closes}</td>
                          <td class="whInside px-0 text-center">${workinghours.friday.opens} - ${workinghours.friday.closes}</td>
                          <td class=" whInside px-0 text-center">${workinghours.saturday.opens} - ${workinghours.saturday.closes}</td>
                          <td class="whInside px-0 text-center">${workinghours.sunday.opens} - ${workinghours.sunday.closes}</td>
                        </tr>
                      </tbody>
                    </table>
                    `

            });

            marker.addListener('click', function(){
              var placeMarker = infoWindow.open(map, marker);
            });

            google.maps.event.addListener(map, 'click', function() {
              infoWindow.close();
            });
        }
      })//data json end
    })//fetch end
  })

  //create wrapper for live search icon
  let loaderWrapper = document.querySelector('.loader-wrapper')
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
          console.log(result)
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
            resultDiv.innerHTML = 'Unesite nesto'
            loaderWrapper.style.opacity = 0
          }
      })

        helper.addAnalysis(itemsArray, resultDiv, checkout)
        helper.removeAnalysis(itemsArray, checkout)


}

//group analysis page
if(document.getElementById('resultsGroupDetails')!= null) {

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

// lab details PAGE
if(urlArr[1] == 'laboratorija') {
  let labLocationUrl = location.split('/')
  let labName = labLocationUrl[2]
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
  let checkout = document.querySelector('.checkout')
  let filterValue = 'analiza'


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
  let resultSection = document.getElementById('resultsLabDetails')
  // let table = document.getElementById('resultTableAnalysis')
  let itemsArray = JSON.parse(localStorage.getItem('items'))
  let totalPrice = 0
    prices.forEach(item =>  {
      totalPrice += parseInt(item.getAttribute('data-price'))
    })


    searchString.addEventListener('input', (e) => {
      if(searchString.value.length>=3 && filterValue == 'analiza' ) {
        let searchString = e.target.value
        // fetch('/analysis/prices/'+searchString)
        fetch('/search/analysis/'+searchString+'/'+labName)
          .then(data => data.json())
          .then(result => {

            resultDiv.innerHTML = ''
            let icon = []
            let alreadySelectedArray = []
            for(i=0; i<result.length; i++) {

              let alreadySelected = itemsArray.findIndex(item => {
                return item.id == result[i].idAnalysis
              })
              alreadySelectedArray.push(alreadySelected)

              let availableHC = result[i].availableHC
              icon.push(...availableHC)

              if(alreadySelectedArray[i] == -1) {
                let results = `
                  <tr>
                    <td><img src="/images/detail.svg" data-toggle="tooltip" title="${result[i].preview}" class="tooltipImg mr-2">
                    <a href="../results/analysis/${result[i].slug}" class="nolink">${result[i].name}</a></td>
                    <td>${result[i].abbr}</td>
                    <td>${result[i].alt}</td>
                    <td><img src=${icon[i] ? '/images/hospital-alt.svg' : '/images/hospital-alt_off.svg'}></td>
                    <td><span class="font-weight-bold price">${result[i].cenovnik.cena}</span></td>
                    <td><button class="btn btn-outline-success float-right btn-block text-uppercase addAnalysis" data-analysisid="${result[i].idAnalysis}"  data-analysisName="${result[i].name}" data-price=${result[i].cenovnik.cena} data-abbr="${result[i].abbr}" data-iconPath="${result[i].groupID[i].iconPath}" data-alt="${result[i].alt}" data-icon="${icon[i] ? '/images/hospital-alt.svg' : '/images/hospital-alt_off.svg'}">dodaj</button></td>
                  </tr>
                `
                resultDiv.innerHTML += results
              }
            }
          })// data json end

        }
      else {
        console.log('unesite vise od 2 karaktera')
        resultDiv.innerHTML = ''
      }
    })



    let addAnalysisBtn = document.getElementById('resultTableAnalysis')
      addAnalysisBtn.addEventListener('click', e => {
        if(e.target.tagName === 'BUTTON' && e.target.classList.contains('addAnalysis')) {
          e.target.innerHTML = '&#10004;'
          e.target.disabled = true
          totalPrice  += parseInt(e.target.getAttribute('data-price'))
          totalPriceSpan.innerText = `Ukupno: ${totalPrice} din.`
          resultSection.classList.remove('d-none')
          checkout.classList.remove('d-none')
          itemsArray.push({
            'name':e.target.getAttribute('data-analysisName'),
            'id':e.target.getAttribute('data-analysisid'),
            'logo':e.target.getAttribute('data-iconPath')
           })
           numOfAnalysis.innerHTML = `Broj odabranih analiza (${itemsArray.length})`
           checkout.textContent = itemsArray.length
           itemsArray.sort((a,b) => {
             if (a.name > b.name) {
               return 1
             } else {
               return -1
             }
           })
           localStorage.setItem('items', JSON.stringify(itemsArray))
           let additionalResult = `
               <tr>
                 <td><img src="/images/detail.svg" data-toggle="tooltip" title="" class="tooltipImg mr-2">
                 <a href="../results/analysis/${e.target.getAttribute('data-analysisName')}" class="nolink">${e.target.getAttribute('data-analysisName')}</a></td>
                 <td>${e.target.getAttribute('data-abbr')}</td>
                 <td>${e.target.getAttribute('data-alt')}</td>
                 <td><img src="${e.target.getAttribute('data-icon')}"></td>
                 <td><span class="font-weight-bold price">${e.target.getAttribute('data-price')}</span></td>
                 <td><button class="btn btn-outline-danger float-right btn-block text-uppercase removeAnalysis" data-analysisid="${e.target.getAttribute('data-analysisid')}" data-groupImg="" data-analysisName="" >X</button></td>
               </tr>
           `
           resultTable.innerHTML += additionalResult
        }
      })

    ///////////////////////////
    if(itemsArray.length == 0) {
      resultSection.classList.add('d-none')
      checkout.classList.add('d-none')
    } else {
      totalPriceSpan.innerText = `Ukupno: ${totalPrice} din.`
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
            totalPriceSpan.innerText = `Ukupno: ${totalPrice} din.`
            let nameIndex = itemsArray.findIndex((item) => {
                return item.id === toBeDeleted
              })
            itemsArray.splice(nameIndex,1)
            items = JSON.stringify(itemsArray)
            localStorage.setItem('items', items)
            let numAnalysis = document.querySelector('.numAnalysis')
            numAnalysis.textContent = `Broj odabranih analiza (${itemsArray.length})`
            checkout.textContent = itemsArray.length
            if(itemsArray.length == 0) {
              resultSection.classList.add('d-none')
              checkout.classList.add('d-none')
            }
          }
        })
      }



    }
/* ANALYSIS DETAILS PAGE ***************/
if(urlArr[1] == 'results' && urlArr[2] == 'analysis' && urlArr[3] !== ''  ) {
//scrollspy initialization for side navigation

  $('body').scrollspy({
    target: '#sideMenu',
    offset: 30
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
  helper.removeAnalysis(itemsArray, checkout)
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
  let minicipality = document.getElementById('municipality')
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
console.log('da')
    $('#summernote').summernote({

          styleTags: [
          'p','br',
          {title: 'orderList', tag: 'ul', className: 'textList', value: 'ul'},
          {title: 'leadText', tag: 'p', className: 'lead text-center', value:'p'},
          {title:'reset', tag:'p',className:'', value:'p'}

        ],
          height: 220,
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
            console.log('analiza vec dodata')
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

}// window onload end
