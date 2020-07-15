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
});

// changing analysis number color on hover
$('.click-more').hover(function(){
  $(this).find("span").toggleClass("broj-analiza-hover");
});

// sticky navigation
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
if(itemsArray.length>0 && location.match(checkUrl)) {
  console.log(location+'dada')
  helper.displayBasket(itemsArray)
}

//MUST CHECK THIS!!!!!!!
//get reference to checkout element which displays number of selected analysis in navigation

if (itemsArray.length > 0 && location == '/') {
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

/* RESULTS PAGE ***************/

// if (urlArr[1] === 'results' && urlArr[2] == '') {
if (document.getElementById('results')!=null) {
  //taking values from url
  const urlParams = new URLSearchParams(window.location.search);
  //search string and filter
  let myValue = urlParams.get('name')
  let myFilter = urlParams.get('filter')

  // creating variable for search field and assigning value from search string
  let innerSearch = document.getElementById('searchResultPage')
    //keeps search string when page is changed
    innerSearch.value = myValue
    //put focus on search field
    innerSearch.focus()
  //defining new variable which will be used in queries
  let searchStr = myValue
  // display checked filter
  let radioFilter = document.querySelectorAll('input[name=searchFilter]')
    radioFilter.forEach((item) => {
      if(item.value == myFilter) {
        item.checked=true
      }
    })

    // if user is searching from home page take result div
    let resultDiv = document.getElementById('resultTable')
    // check if local storage is empty
    let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : []

    // if filter value is changed on result searchResultPage
    // taking filter value
    let analysisRadio = document.querySelectorAll('input[name=searchFilter]')
        analysisRadio.forEach((item) => {
          item.addEventListener('click', (e) => {
            myFilter = e.target.value
            // innerSearch.value=''
            // innerSearch.focus()
          })
        })

    //create wrapper for live search icon
    let loaderWrapper = document.querySelector('.loader-wrapper')

    if(myFilter === 'analiza') {
      fetch('/analysis/prices/'+searchStr).then((data) => {
        data.json().then((result) => {
          console.log(result.minPriceArr)
          resultDiv.innerHTML = ''
          let analysis = result.analysisName
          let pricesMin = result.minPriceArr
          let pricesMax = result.maxPriceArr
          for(i=0; i<analysis.length; i++) {
            //creating table with result
            helper.renderAnalysisResult(analysis, pricesMin, pricesMax, resultDiv, itemsArray)
          }// for end
          //when result is found remove loading icon
          loaderWrapper.style.opacity = 0
        })// data json end
      })//fetch end
    }// if my filter==analiza
    else {
      let banner = document.querySelector('.banner')
        // banner.style.display = 'none'
      let analysisBasket = document.querySelector('.odabraneAnalize')
        // analysisBasket.style.display = 'none'

      let now = new Date()
      let day = now.getDay()
      let date = now.getDate()
      let month = now.getMonth()
      let year = now.getFullYear()
      let today = (month + 1) + "/" + date + "/" + year
      // let danas


        fetch('/lab/'+searchStr).then((data) => {

          data.json().then((result) => {

            loaderWrapper.style.opacity = 0

            let labTemplate = document.createElement('div')
              labTemplate.className = 'col-12 d-flex flex-row flex-wrap'

            for(i=0; i<result.length; i++) {
              let flag = true
              resultDiv.innerHTML = ''
              labTemplate.innerHTML += `
              <div class="lab-card">
                <div>
                   <img src="" class="labInfoWindowOsiguranje privateInssuranceIcon${i}" title="laboratorija sarađuje sa privatnim osiguranjem">
                   <img src="" class="labInfoWindowVerified accreditedIcon${i}" title="laboratorija je akreditovana">
                   <span class="labInfoWindowTitle">${result[i].labName}</span>
               </div>
                 <div class="labInfoWindow">
                     <img src="/images/lablogo/${result[i].logo}" class="labLogoInfoWindow">
                     <p class="labInfoWindowAdresa">${result[i].address}</p>
                     <p class="labInfoWindowGrad">${result[i].placeId.place} / ${result[i].placeId.municipality}</p>
                     <p class="labInfoWindowTelefoni"> ${result[i].phone.join(', ')}</p>
                 </div>
                 <div class="labInfoFooter">
                     <img src="/images/radnoVreme_black.svg" class="labInfoWindowWorkingHoursIcon">
                     <div class="radnoVreme">Radno vreme</div>
                     <div id='otvoreno' class='otvoreno${i} status'></div>
                     <div class="labInfoRadnoVremeDetalji">
                       <p class="daysInWeek monday${i} text-center">P<span>${result[i].workingHours.monday.opens} - ${result[i].workingHours.monday.closes}</span></p>
                       <p class="daysInWeek tuesday${i} text-center">U<span>${result[i].workingHours.tuesday.opens} - ${result[i].workingHours.tuesday.closes}</span></p>
                       <p class="daysInWeek wednesday${i} text-center">S<span>${result[i].workingHours.wednesday.opens} - ${result[i].workingHours.wednesday.closes}</span></p>
                       <p class="daysInWeek thursday${i} text-center">Č<span>${result[i].workingHours.thursday.opens} - ${result[i].workingHours.thursday.closes}</span></p>
                       <p class="daysInWeek friday${i} text-center">P<span>${result[i].workingHours.friday.opens} - ${result[i].workingHours.friday.closes}</span></p>
                       <p class="daysInWeek saturday${i} text-center">S<span>${result[i].workingHours.saturday.opens} - ${result[i].workingHours.saturday.closes}</span></p>
                       <p class="daysInWeek sunday${i} text-center">N<span>${result[i].workingHours.sunday.opens} - ${result[i].workingHours.sunday.closes}</span></p>
                     </div>
                  </div>
                  <button type="button" class="btn btn-block btnLabDetails buttonId mt-2" data-labName="${result[i].slug}">saznaj više</button>
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


            let currentDay
            let currentDayNum
            switch (day) {
              case 0:
                currentDay = 'sunday'
                currentDayNum = 0
                break
              case 1:
                currentDay = 'monday'
                currentDayNum = 1
                break
              case 2:
                currentDay = 'tuesday'
                currentDayNum = 2
                break
              case 3:
                currentDay = 'wednesday'
                currentDayNum = 3
                break
              case 4:
                currentDay = 'thursday'
                currentDayNum = 4
                break
              case 5:
                currentDay = 'friday'
                currentDayNum = 5
                break
              case 6:
                currentDay = 'saturday'
                currentDayNum = 6
                break
              default:
                console.log('dan nije ok')
            }

            let radnoVreme = document.querySelector('.otvoreno'+i)
            let todayIs = document.querySelector('.'+currentDay+i)
            let privateInsurance = document.querySelector('.privateInssuranceIcon'+i)
            let accredited = document.querySelector('.accreditedIcon'+i)
            let labDetailsBtn = document.querySelectorAll('.buttonId')
             labDetailsBtn.forEach(item => {
               item.addEventListener('click', e => {
                 window.location = `/${e.target.getAttribute('data-labName')}`
               })
             })


            if(result[i].private) {
              privateInsurance.setAttribute('src', '/images/osiguranje.svg')
            } else {
              privateInsurance.remove()
            }

            if(result[i].accredited) {
              accredited.setAttribute('src', '/images/verified.svg')
            } else {
              accredited.remove()
            }

            if(result[i].open24h) {
              radnoVreme.classList.add('open')
              radnoVreme.innerText = 'otvoreno 24h'
              todayIs.classList.add('active')
            } else if(day === currentDayNum) {

              let openTime = result[i].workingHours[currentDay].opens
              let closingTime = result[i].workingHours[currentDay].closes
              let todayOpenTime = new Date(today +' '+ openTime +':00')
              let todayClosingTime = new Date(today +' '+ closingTime +':00')
              let nowTimeStamp = now.getTime()
              let closingSoon = todayClosingTime - nowTimeStamp
              let closingIn = (Math.ceil(closingSoon/1000/60))

              if (closingIn < 60 && closingIn > 0) {
                radnoVreme.classList.add('closedSoon')
                radnoVreme.innerText = `zatvara se za ${closingIn} min.`
                todayIs.classList.add('active')
              }

                else if(nowTimeStamp > todayOpenTime.getTime() &&
                    todayClosingTime.getTime() > nowTimeStamp) {
                    radnoVreme.classList.add('open')
                    radnoVreme.innerText = 'otvoreno'
                    todayIs.classList.add('active')
                }
                else {
                    radnoVreme.classList.add('closed')
                    radnoVreme.innerText = 'zatvoreno'
                    todayIs.classList.add('activeClosed')
                }
              } else {
                console.log('lab nije odredio radno vreme')
              }
          }//for loop end

          })//data json end
        })//fetch end
        // helper.removeAnalysis(itemsArray)
      }

    // if search string is changed on result page
    // let loaderWrapper = document.querySelector('.loader-wrapper')
    innerSearch.addEventListener('input', (e) => {
        let searchstring = e.target.value

        loaderWrapper.style.opacity = 1

        if(myFilter == 'analiza' && searchstring.length>=2) {

          fetch('/analysis/prices/'+searchstring).then((data) => {
            data.json().then((result) => {

              let analysis = result.analysisName
              let pricesMin = result.minPriceArr
              let pricesMax = result.maxPriceArr
              resultDiv.innerHTML = ''
                for(i=0; i<analysis.length; i++) {
                  //creating table with results
                  //when typing fast parent array becomes undefined hence error
                  if(typeof(pricesMin[i])!=="undefined") {
                   helper.renderAnalysisResult(analysis, pricesMin, pricesMax, resultDiv, itemsArray)
                  }
                }// for end
                if(data.status == 200) {
                  loaderWrapper.style.opacity = 0
                }
            })// data json end
          })//fetch end
          // helper.addAnalysis(itemsArray, resultDiv)
          // helper.removeAnalysis(itemsArray)
        }
        else if(searchstring.length>=2){
            fetch('/lab/'+searchstring).then((data) => {
              data.json().then((result) => {
                console.log('sada rezultat')
                loaderWrapper.style.opacity = 0
              })
            })
          } else {
            console.log('unesite vise od 2 karaktera da zapocnete pretragu')
            resultDiv.innerHTML = 'Unesite nesto'
            loaderWrapper.style.opacity = 0
          }
      })

        helper.addAnalysis(itemsArray, resultDiv, checkout)
        helper.removeAnalysis(itemsArray, checkout)


$('#resultTable ').on('mouseenter','tr>td>img.tooltipImg', function(){
  var imageSrc = $(this).attr('src');
  // if (imageSrc == '/images/detail.svg') {
    $(this).attr('src','/images/detail_mv.svg');
  // }
  // else {
  //   $(this).attr('src', '/images/detail.svg');
  // }
  }).on('mouseleave','tr>td>img.tooltipImg', function(){
    $(this).attr('src', '/images/detail.svg');
  })

}

/* ANALYSIS DETAILS PAGE ***************/
if(urlArr[1] == 'results' && urlArr[2] == 'analysis' && urlArr[3] !== ''  ) {
  console.log(location)
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
