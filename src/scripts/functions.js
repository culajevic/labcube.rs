exports.removeElement = (element1,element2) => {
  element1.addEventListener('click', (e) => {
    e.preventDefault()
    let itemToRemove = e.target.innerText
    let index = element2.indexOf(itemToRemove)
    element2.splice(index,1)
    if(element1.children.length === 1) {
      e.target.remove()
      element1.remove()
    } else {
      e.target.remove()}
  })
}

exports.deleteDocument = (selector,message,url,redirect,error) => {
  let deleteDocument = document.querySelectorAll(selector)
    deleteDocument.forEach((item) => {
      item.addEventListener('click', (e) => {
        if(confirm(message))  {
          let id = e.target.getAttribute('data-id')
          let location = e.target.getAttribute('data-tab')
          url += id +'/'+location
          fetch (url, {
            method: 'delete'
          }).then((response) => {
            response.json()
            .then((data) => {
              console.log(data)
            })
            window.location.href=redirect
          }).catch((e) => {
            alert(error)
          })
        } else {
          window.location.href=redirect
        }
      })
    })
}

exports.renderAnalysisResult = (analysis, prices, resultDiv, itemsArray) => {
  let noResults = document.getElementById('noResults')
  noResults.innerHTML = ''
  //check if analysis is already in localstorage
  let analysisPositionArr = itemsArray.findIndex((item) => {

    return item.name === prices[i].name
  })

  let tr = document.createElement('tr')
  //td analysis name and preview icon
  let tdName = document.createElement('td')
  let analysisName = document.createTextNode(prices[i].name)

  let analysisLink = document.createElement('a')
  if(prices[i].preview == '') {
    // analysisLink.setAttribute('href', '#')
    analysisLink.className = 'nolink text-muted'
    analysisLink.appendChild(analysisName)
  } else {
    analysisLink.setAttribute('href', '/results/analysis/'+prices[i].slug)
    // analysisLink.setAttribute('target','_blank')
    analysisLink.className = 'nolink text-primary'
    analysisLink.appendChild(analysisName)
  }


  let previewIcon = document.createElement('img')
    previewIcon.setAttribute('src', '/images/detail.svg')
    previewIcon.setAttribute('title', prices[i].preview)
    previewIcon.className = "tooltipImg mr-2"
    previewIcon.setAttribute('data-toggle', 'tooltip')
  tdName.appendChild(previewIcon)
  tdName.appendChild(analysisLink)
  tr.appendChild(tdName)

  // displab analysis abbreviation
  // let abbr = document.createElement('td')
  // let abbrName
  //
  // for(y=0; y<prices[i].abbr.length; y++) {
  //   abbrName = document.createTextNode(prices[i].abbr[y].join(', '))
  //   abbr.appendChild(abbrName)
  //   tr.appendChild(abbr)
  // }

  //display alternative name for analysis
  let alt = document.createElement('td')
    alt.className = "altNameResult"
  let altName

  for(y=0; y<prices[i].abbr.length; y++) {
    // console.log(prices[i].abbr[y].join(', '))
     altName = document.createTextNode((prices[i].abbr[y]).join(', '))
    alt.appendChild(altName)
    tr.appendChild(alt)
  }

  //display analysis groupName
  let tdGroupName = document.createElement('td')
    tdGroupName.className = "groupNameResult"
    let groupName = document.createTextNode(prices[i].groupName)
    tdGroupName.appendChild(groupName)
    tr.appendChild(tdGroupName)

  //display hospital icon if analysis is available
  //ako nije dostupna stavi hospital-alt-off.svg

  let hospital = document.createElement('td')
    hospital.className = "hospitalResult"
  let hospitalIcon = document.createElement('img')
  // console.log(prices[i].availableHC)
    if(prices[i].availableHC[0] == true) {
      hospitalIcon.setAttribute('src', '/images/hospital-alt.svg')
      hospitalIcon.setAttribute('data-toggle', 'tooltip')
      hospitalIcon.setAttribute('title', 'Analizu je moguće uraditi u domu zdravlja o trošku zdravstvenog osiguranja.')
    } else {
      hospitalIcon.setAttribute('src', '/images/hospital-alt_off.svg')
      hospitalIcon.setAttribute('data-toggle', 'tooltip')
      hospitalIcon.setAttribute('title', 'Analizu nije moguće uraditi u domu zdravlja o trošku zdravstvenog osiguranja.')
    }
  hospital.appendChild(hospitalIcon)
  tr.appendChild(hospital)

  //display min and max price
  let minmaxPrice = document.createElement('td')
  let priceSpan = document.createElement('span')
    priceSpan.className = 'font-weight-bold priceRange'

      // let priceRange = document.createTextNode(`${pricesMin[i][0].cenovnik[0].cena} - ${pricesMax[i][0].cenovnik[0].cena}`)
      let priceRange = document.createTextNode(`${prices[i].minPrice} - ${prices[i].maxPrice}`)
      priceSpan.appendChild(priceRange)
      minmaxPrice.appendChild(priceSpan)
      tr.appendChild(minmaxPrice)

  //create btn for adding analysis to basket
  let addAnalysisBtnTd = document.createElement('td')
  let addAnalysisBtn = document.createElement('button')
  let addAnalysisBtnText

  if(analysisPositionArr === -1) {
    addAnalysisBtn.className = 'btn btn-outline-success float-right btn-block text-uppercase addAnalysis'
    addAnalysisBtnText = document.createTextNode('dodaj u korpu')
  } else {
    addAnalysisBtnText = document.createTextNode("\u2714")
    addAnalysisBtn.className = 'btn btn-outline-success float-right btn-block text-uppercase deleteAnalysis'
    addAnalysisBtn.disabled = true
  }
    addAnalysisBtn.setAttribute('data-analysisId', prices[i]._id)
    addAnalysisBtn.setAttribute('data-analysisName', prices[i].name)
    addAnalysisBtn.setAttribute('data-groupImg', prices[i].iconPath)

  addAnalysisBtn.appendChild(addAnalysisBtnText)
  addAnalysisBtnTd.appendChild(addAnalysisBtn)
  tr.appendChild(addAnalysisBtnTd)
  resultDiv.appendChild(tr)
}

exports.displayBasket = (itemsArray) => {
  // display 'shopping' basket
  document.querySelector('.card').classList.remove('d-none')

  //put number of selected analyisis next to basket title
  let basketTitle = document.createTextNode(` (${itemsArray.length})`)
  let cardHeader = document.getElementById('numOfAnalysis')
    cardHeader.appendChild( basketTitle )

// const data = JSON.parse(localStorage.getItem('items'))
  itemsArray.forEach(analysis => {
    //create li element for each analysis selected
    let analysisAdded = document.createElement('li')
      analysisAdded.className='list-group-item list-group-item-action'
    //creating group image
    let groupImage = document.createElement('img')
      groupImage.classList = 'labGroupIconSelectedAnalysis'
      groupImage.setAttribute('src', '/images/'+analysis.logo)
    //creating text with analysis name
    let newAnalysisName = analysis.name.replace(' - ', ' ').replace('/', ' ')


    let analysisName = document.createTextNode(analysis.name)
    let analysisLink = document.createElement('a')

    let slug = newAnalysisName.split(' ')

    let urlSlug = slug.join('-')
      analysisLink.setAttribute('href', '/results/analysis/'+urlSlug)
      analysisLink.setAttribute('target', '_blank')
      analysisLink.className = 'nolink analysisBasketLiItem'
      analysisLink.setAttribute('data-analysisid', analysis.id)
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
      let selectedAnalysis = document.getElementById('selectedAnalysis')
      //get position of analysis in array
      let analysisPositionArr = itemsArray.findIndex((items) => {
        return analysis.name === items.name
      })
      selectedAnalysis.insertBefore(analysisAdded, selectedAnalysis.childNodes[analysisPositionArr])
  })
}

exports.removeAnalysis = (itemsArray, checkout) => {

  //remove analysis from local storage
  let analysisBasket = document.getElementById('selectedAnalysis')
    analysisBasket.addEventListener('click', (e) => {
      if(e.target.classList.contains('remove-analysis-from-basket')) {

        let selectedAnalysisBasket = e.target.parentNode.parentNode
        let indexOfAnalysisName = selectedAnalysisBasket.innerText

        let localStorageItems = JSON.parse(localStorage.getItem('items'))
        let nameIndex = localStorageItems.findIndex((item) => {
            return item.name === indexOfAnalysisName
          })

        localStorageItems.splice(nameIndex,1)
        items = JSON.stringify(localStorageItems)

        //remove element from itemsarray

        let removedValue
        removedValue = itemsArray.splice(nameIndex,1)
        selectedAnalysisBasket.remove()
        localStorage.setItem('items', items)

        let basketTitle = document.createTextNode(` (${itemsArray.length}) `)
        let cardHeader = document.getElementById('numOfAnalysis')
        cardHeader.innerHTML=''
        cardHeader.appendChild(basketTitle)

        //hide basket if all analysis are removed
        if(itemsArray.length == 0) {
          document.querySelector('.card').classList.add('d-none')
          // document.getElementById('priceList').classList.add('hidePriceList')
          document.getElementById('priceList').classList.add('d-none')
          // document.querySelector('.card').classList.add('hidePriceList')
          // checkout.classList.add('d-none')
        let resultSection = (document.getElementById('resultsLabDetails')) ? document.getElementById('resultsLabDetails') : ''
            if (resultSection) {
                resultSection.classList.add('d-none')
            }
        }

        checkout.innerText = itemsArray.length

        //enable button for the analysis removed
        // let enableButton = document.querySelectorAll('#resultTable tr>td>button')
        let enableButton = document.querySelectorAll('.deleteAnalysis')
          enableButton.forEach((item) => {
            if(item.getAttribute('data-analysisName') == removedValue[0].name) {
              item.disabled = false
              item.textContent = 'dodaj u korpu'
              item.classList.remove('deleteAnalysis')
              item.classList.add('addAnalysis')
            }
          })//enable button end
      }// remove analysis from basket
    })

  }

exports.addAnalysis = (itemsArray,resultDiv, checkout) => {
  //adding analysis to sidebar shopping cart
  resultDiv.addEventListener('click', (e) => {
    if(e.target.tagName === 'BUTTON' && e.target.classList.contains('addAnalysis') && itemsArray.length<30) {
      checkout.removeAttribute('style')

      //enable if shopping cart should be visible after each dodaj click
      // setTimeout(()=>{
      //   let priceList = document.getElementById('priceList')
      //   priceList.classList.add('unhidePriceList')
      //   priceList.classList.remove('hidePriceList')
      // },500)




      itemsArray.push({
        'name':e.target.getAttribute('data-analysisName'),
        'id':e.target.getAttribute('data-analysisid'),
        'logo':e.target.getAttribute('data-groupimg')
       })

       let logoImg = document.createElement('img')
       logoImg.setAttribute('src', `/images/${e.target.getAttribute('data-groupimg')}`)
       logoImg.classList.add('zoom')
       checkout.parentNode.appendChild(logoImg)

       setTimeout(() => {
         let removeIcons = document.querySelectorAll('.zoom')
         removeIcons.forEach(item => {
          item.remove()
          checkout.classList.remove('rotateNumberOfAnalysis')
         });
       },1000)


       //add number of analysis to navigation
       checkout.classList.remove('d-none')
       // checkout.style.color = 'red'
       // checkout.style.transform = 'rotate(3600deg)'
       // checkout.style.transition = 'transform 2s ease'
       checkout.classList.add('rotateNumberOfAnalysis')

       checkout.innerHTML = itemsArray.length

       let basketTitle = document.createTextNode(` (${itemsArray.length}) `)
       let cardHeader = document.getElementById('numOfAnalysis')
       cardHeader.innerHTML=''
       cardHeader.appendChild(basketTitle)


      // sorting array
      itemsArray.sort((a,b) => {
        if (a.name > b.name) {
          return 1
        } else {
          return -1
        }
      })

      localStorage.setItem('items', JSON.stringify(itemsArray))

      let analysisAdded = document.createElement('li')
        analysisAdded.className='list-group-item list-group-item-action'
      //creating group image
      let groupImage = document.createElement('img')
        groupImage.classList = 'labGroupIconSelectedAnalysis'
        groupImage.setAttribute('src', '/images/'+e.target.getAttribute('data-groupImg'))
        // console.log(e.target.getAttribute('data-analysisName'))
      let newAnalysisName = e.target.getAttribute('data-analysisName').replace(' - ', ' ').replace('/', ' ')
      //creating text with analysis name
      let analysisName = document.createTextNode(e.target.getAttribute('data-analysisName'))
      let analysisLink = document.createElement('a')
      let slug = newAnalysisName.split(' ')
      let urlSlug = slug.join('-')
        analysisLink.setAttribute('href', '/results/analysis/'+urlSlug)
        analysisLink.className = 'nolink analysisBasketLiItem'
        analysisLink.setAttribute('target', '_blank')
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
          return item.name === e.target.getAttribute('data-analysisName')
        })

        // if analysis is added disable add button
        if(analysisPositionArr !== -1) {
          e.target.innerHTML = '&#10004;'
          e.target.className = 'btn btn-outline-success float-right btn-block text-uppercase deleteAnalysis'
          // e.target.className = 'btn btn-outline-success ml-5 mt-auto text-uppercase deleteAnalysis'
          e.target.disabled = true
        }

        //insert analysis to basket
        let selectedAnalysis = document.getElementById('selectedAnalysis')
        selectedAnalysis.insertBefore(analysisAdded, selectedAnalysis.childNodes[analysisPositionArr])

        //display basket when first analyis is added to basket
        document.querySelector('.card').classList.remove('d-none')
    } else if (itemsArray.length>30){
      console.log('ne mozete dodati vise od 30 analiza u korpu')
    }
  })// resultdiv end
}

exports.searchLabAnalysis = (searchString, filter) => {

  // let filter = 'analiza'
  // let filterValue
  // searchString.focus()

    filter.forEach((item) => {
      if(item.checked) {
        filterValue = item.value
        // console.log('checked ' + filterValue)
      }
    })

  // set focus on searchanalysis field when right arrow is pressed
  document.addEventListener('keydown', (e) => {
      if(e.keyCode === 39) {
        searchString.value = ''
        searchString.focus()
      }
    })

  //check the filter value on INDEX PAGE
      filter.forEach((item) => {
        item.addEventListener('click', (e) => {
          filterValue = e.target.value
        })
      })

  /* by default filter is set to analiza, after 500ms
    user is redirected to results page */
  searchString.addEventListener('input', (e) => {

    if(searchString.value.length>=2) {
      setTimeout(function() {
      let searchString = e.target.value
      window.location.href = '/results/?name='+searchString+'&filter='+filterValue
    },400)
  }
  })
}

exports.searchLab = (searchStr, loaderWrapper, resultDiv) => {
  let banner = document.querySelector('.banner')
  let analysisBasket = document.querySelector('.odabraneAnalize')

  let now = new Date()
  let day = now.getDay()
  let date = now.getDate()
  let month = now.getMonth()
  let year = now.getFullYear()
  let today = (month + 1) + "/" + date + "/" + year
  // let danas
  const passIds = []

    fetch('/lab/'+searchStr).then((data) => {

      data.json().then((result) => {

        loaderWrapper.style.opacity = 0

        let labTemplate = document.createElement('div')
          labTemplate.className = 'col-12 d-flex flex-row flex-wrap'

        const phonesForClick = []

        for(i=0; i<result.length; i++) {
          let flag = true
          resultDiv.innerHTML = ''


            // result[i].phone.map(phoneNumber => {
            //   phonesForClick.push(`<a href=tel:${phoneNumber}>${phoneNumber}</a>`)
            //   return phonesForClick
            // })

             // <img src="/images/lablogo/${result[i].logo}" class="labLogoInfoWindow"> ovo je logo

             //  ${result[i].placeId.municipality} dodati ako treba uz ispis mesta
          labTemplate.innerHTML += `
          <div class="lab-card roundedBox boxshadowBckg">
            <div class="testingFlex">

                  <div>
                     <img src="" class="labInfoWindowVerified accreditedIcon${i}" title="laboratorija je akreditovana">
                      <img src="" class="labAntigenIcon antigenIcon${i}" title="radimo antigenski test">
                     <img src="" class="labInfoWindowOsiguranje privateInssuranceIcon${i}" title="sarađujemo sa privatnim osiguranjem">
                     <img src="" class="labInfoPatronage patronageIcon${i} mb-1" title="radimo patronažu">
                     <img src="" class="labInfoDisability disabilityIcon${i} mb-1 mx-1" title="ulaz u laboratoriju je prilagođen invalidima">
                     <span class="labInfoWindowTitle">${result[i].labName}</span>
                 </div>
                   <div class="labInfoWindow">
                       <p class="labInfoWindowAdresa">${result[i].address}</p>
                       <p class="labInfoWindowGrad">${result[i].placeId.place} </p>
                       <p class="labInfoWindowTelefoni">${result[i].phone.join(', ')}</p>

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
                    <button type="button" class="btn btn-block btnLabDetails buttonId mt-2" data-labName="laboratorija/${result[i].slug}">saznaj više</button>

              </div>
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
        let antigen = document.querySelector('.antigenIcon'+i)
        let disabilityIcon = document.querySelector('.disabilityIcon'+i)
        let patronageIcon = document.querySelector('.patronageIcon'+i)

        let labDetailsBtn = document.querySelectorAll('.buttonId')
         labDetailsBtn.forEach(item => {
           item.addEventListener('click', e => {
             itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : []
               itemsArray.forEach(item => {
               passIds.push(item.id)
               });
             window.location = `/${e.target.getAttribute('data-labName')}/${passIds}`
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

        if(result[i].antigen) {
          antigen.setAttribute('src', '/images/covidIcon.svg-1615411728326.svg')
        } else {
          antigen.remove()
        }

        if(result[i].patronage) {
          patronageIcon.setAttribute('src', '/images/patronaza2.svg')
        } else {
          patronageIcon.remove()
        }

        if(result[i].disability) {
          disabilityIcon.setAttribute('src', '/images/disability.svg')
        } else {
          disabilityIcon.remove()
        }

        if(result[i].open24h) {
          radnoVreme.classList.add('open')
          radnoVreme.innerText = 'otvoreno 24h'
          todayIs.classList.add('open')
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
            todayIs.classList.add('closedSoon')
          }

            else if(nowTimeStamp > todayOpenTime.getTime() &&
                todayClosingTime.getTime() > nowTimeStamp) {
                radnoVreme.classList.add('open')
                radnoVreme.innerText = 'otvoreno'
                todayIs.classList.add('open')
            }
            else {
                radnoVreme.classList.add('closed')
                radnoVreme.innerText = 'zatvoreno'
                todayIs.classList.add('closed')
            }
          } else {
            console.log('lab nije odredio radno vreme')
          }
      }//for loop end

      })//data json end
    })//fetch end
}

//povratak sa detaljnog pregleda cene na mapu, belezenje poslednje odabrane laboratorije
exports.bestPrice = (mapArea, resultDiv) => {
  let municipalityValue
  let noResults = document.getElementById('noResults')

  if(document.getElementById('municipality')!= null) {
    let municipality = document.getElementById('municipality')
    municipalityValue = municipality.options[municipality.selectedIndex].value
  } else {
    municipalityValue = JSON.parse(localStorage.getItem('municipality'))
  }

console.log('iz funkcije')


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

    // let municipalityStorage = municipality.options[municipality.selectedIndex].value
    // localStorage.setItem('municipality', JSON.stringify(municipalityStorage))

  municipality.value = municipalityValue
  // let municipalityValue = municipality.options[municipality.selectedIndex].value ? municipality.options[municipality.selectedIndex].value : JSON.parse(localStorage.getItem('municipality'))
  // comment if dont want to close pricelist when show price is displayed
  priceList.classList.add('hidePriceList','d-none')
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

  localStorage.setItem('municipality', JSON.stringify(municipalityValue))
  let markers = []
  let infoWindow = new google.maps.InfoWindow
  let markersCluster = []

  //take working timeout
      let now = new Date()
      let day = now.getDay()
      let date = now.getDate()
      let year = now.getFullYear()
      let month = now.getMonth()
      let today = (month + 1) + "/" + date + "/" + year

      let numOpen = 0
      let labStatus = []
      let status
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
  // working time end

  fetch('/cenovnik/'+municipalityValue+'/'+passIds).then(data => {
    data.json().then(result => {
      document.title = "LabCube | Najbolja ponuda"
      if(result.getPrices.length > 0) {
          noResults.innerHTML = ''
          // resultDiv.innerHTML = ''
      // loaderWrapper.style.opacity = 0
      let labTemplate = document.createElement('div')
        labTemplate.className = 'col-12 d-flex flex-row flex-wrap'

      for(let i=0; i<result.getPrices.length; i++) {

        if(day == currentDayNum) {

            let openTime = result.getPrices[i].lab[0].workingHours[currentDay].opens
            let closingTime = result.getPrices[i].lab[0].workingHours[currentDay].closes
            let todayOpenTime = new Date(today +' '+ openTime +':00')
            let todayClosingTime = new Date(today +' '+ closingTime +':00')
            let nowTimeStamp = now.getTime()
            let closingSoon = todayClosingTime - nowTimeStamp
            let closingIn = (Math.ceil(closingSoon/1000/60))

            if (result.getPrices[i].lab[0].open24h) {
              status = 'open'
              labStatus.push({'id':result.getPrices[i].lab[0]._id, 'status':status})
            }

           else if (closingIn < 60 && closingIn > 0) {
              status = 'closedSoon'
              labStatus.push({'id':result.getPrices[i].lab[0]._id, 'status':status})
            }

            else if (nowTimeStamp > todayOpenTime.getTime() &&
              todayClosingTime.getTime() > nowTimeStamp) {
              numOpen +=1
              status = 'open'
              labStatus.push({'id':result.getPrices[i].lab[0]._id, 'status':status})
            }
            else {
              status = 'closed'
              labStatus.push({'id':result.getPrices[i].lab[0]._id, 'status':status})
            }
        }

      markers.push(
        {
          lat:result.getPrices[i].lab[0].location.coordinates[1], lng:result.getPrices[i].lab[0].location.coordinates[0],
          iconImage:'/images/pinopen.svg',
          total:result.getPrices[i].total,
          name:result.getPrices[i].lab[0].labName,
          address:result.getPrices[i].lab[0].address,
          city:result.getPrices[i].labPlace[0].place,
          phone:result.getPrices[i].lab[0].phone,
          workinghours:result.getPrices[i].lab[0].workingHours,
          slug:result.getPrices[i].lab[0].slug
        }
      )

        resultDiv.innerHTML = ''
        labTemplate.innerHTML += `

        <div class="lab-card roundedBox">
          <div>
          ${(result.getPrices[i].lab[0].private)? '<img src=/images/osiguranje.svg class="labInfoWindowOsiguranje privateInssuranceIcon${i}" title="laboratorija sarađuje sa privatnim osiguranjem">' : ''}
          ${(result.getPrices[i].lab[0].disability)? '<img src=/images/disability.svg class="labInfoWindowVerified accreditedIcon${i}" title="ulaz prilagođen invalidima">' : ''}
          ${(result.getPrices[i].lab[0].patronage)? '<img src=/images/patronaza2.svg class="labInfoWindowVerified accreditedIcon${i}" title="dostupna patronaža">' : ''}
          ${(result.getPrices[i].lab[0].accredited)? '<img src=/images/verified.svg class="labInfoWindowVerified accreditedIcon${i}" title="laboratorija je akreditovana">' : ''}
          ${(result.getPrices[i].lab[0].antigen)? '<img src=/images/covidIcon.svg-1615411728326.svg class="labInfoWindowVerified labAntigenIcon accreditedIcon${i}" title="radi antigenski test">' : ''}
          <span class="labInfoWindowTitle">${result.getPrices[i].lab[0].labName}</span><span class="float-right priceTag">${result.getPrices[i].total} rsd</span>
         </div>
           <div class="labInfoWindow">


               <p class="labInfoWindowAdresa">${result.getPrices[i].lab[0].address}</p>
               <p class="labInfoWindowGrad">${result.getPrices[i].labPlace[0].place}</p>
               <p class="labInfoWindowTelefoni"> ${result.getPrices[i].lab[0].phone} </p>
           </div>
           <div class="labInfoFooter">
               <img src="/images/radnoVreme_black.svg" class="labInfoWindowWorkingHoursIcon">
               <div class="radnoVreme">Radno vreme</div>
               <div id='otvoreno' class='${labStatus[i].status} status'></div>
               <div class="labInfoRadnoVremeDetalji">
                 <p class="daysInWeek monday${result[i]} text-center ${(day == 1) ? labStatus[i].status : ''}">P<span>${result.getPrices[i].lab[0].workingHours.monday.opens} - ${result.getPrices[i].lab[0].workingHours.monday.closes}</span></p>
                 <p class="daysInWeek tuesday${result[i]} text-center ${(day == 2) ? labStatus[i].status : ''}">U<span>${result.getPrices[i].lab[0].workingHours.tuesday.opens} - ${result.getPrices[i].lab[0].workingHours.tuesday.closes}</span></p>
                 <p class="daysInWeek wednesday${result[i]} text-center ${(day == 3) ? labStatus[i].status : ''}">S<span>${result.getPrices[i].lab[0].workingHours.wednesday.opens} - ${result.getPrices[i].lab[0].workingHours.wednesday.closes}</span></p>
                 <p class="daysInWeek thursday${result[i]} text-center ${(day == 4) ? labStatus[i].status : ''}">Č<span>${result.getPrices[i].lab[0].workingHours.thursday.opens} - ${result.getPrices[i].lab[0].workingHours.thursday.closes}</span></p>
                 <p class="daysInWeek friday${result[i]} text-center ${(day == 5) ? labStatus[i].status : ''}">P<span></span>${result.getPrices[i].lab[0].workingHours.friday.opens} - ${result.getPrices[i].lab[0].workingHours.friday.closes}</p>
                 <p class="daysInWeek saturday${result[i]} text-center ${(day == 6) ? labStatus[i].status : ''}">S<span></span>${result.getPrices[i].lab[0].workingHours.saturday.opens} - ${result.getPrices[i].lab[0].workingHours.saturday.closes}</p>
                 <p class="daysInWeek sunday${result[i]} text-center ${(day == 0) ? labStatus[i].status : ''}">N<span></span>${result.getPrices[i].lab[0].workingHours.sunday.opens} - ${result.getPrices[i].lab[0].workingHours.sunday.closes}</p>
               </div>
            </div>
            <a class="btn btn-block btnLabDetails buttonId mt-2" href="laboratorija/${result.getPrices[i].lab[0].slug}/${passIds}">saznaj više</a>
         </div>`

         resultDiv.innerHTML =`
         <section id="labDetails">
           <div class="container">
             <div class="row labContainer">

             </div>
           </div>
         </section>`

         //append labcard to page
         document.querySelector('.labContainer').appendChild(labTemplate)
      }

      // new map
      let map = new google.maps.Map(document.getElementById('mapPrices'), options)
          map.setCenter({lat:result.getPrices[0].lab[0].location.coordinates[1], lng:result.getPrices[0].lab[0].location.coordinates[0]});

      for(i=0; i<markers.length; i++) {
      addMarker(markers[i].lat,
                markers[i].lng,
                markers[i].total,
                markers[i].name,
                markers[i].address,
                markers[i].city,
                markers[i].phone,
                markers[i].workinghours,
                markers[i].slug)
      }

    // console.log(markers)
      function addMarker(lat, lng, total, name, address, city, phone, workinghours,slug) {
        let marker = new google.maps.Marker({
          position:{lat:lat, lng:lng},
          icon:{
            url:(labStatus[i].status!== 'closed') ? '/images/openGreenBestPrice.svg' : '/images/closedRedBestPrice.svg',
            labelOrigin: {x: 32, y: 32},
            scaledSize: new google.maps.Size(60, 60)
          },
          // icon:{
          //   url:'/images/pinprice.svg',
          //   labelOrigin: {x: 32, y: 32},
          //   scaledSize: new google.maps.Size(60, 60)
          // },
          label:{
            text:total.toString(),
            fontWeight: 'bold',
            fontSize: '13px',
            color:'white'
          },
          map:map
          })

          const phonesForClick = []

            phone.map(phoneNumber => {
              phonesForClick.push(`<a href=tel:${phoneNumber}>${phoneNumber}</a>`)
              return phonesForClick
            })



          let content = `<div class="" style="min-height:142px; max-width:380px;">
                        <p class="labInfoWindowTitle mb-2 pb-0"><a href="/laboratorija/${slug}/${passIds}">${name}</a></p>
                        <span class="">${address}</span>
                        <p class="">${city}</p>
                        <p class="labInfoWindowTelefoni">${phonesForClick.join(', ')}</p>

                        <div class="labInfoWindowFooter">
                          <img src="images/radnoVreme.svg" class="labInfoWindowWorkingHoursIcon">
                        <div class="radnoVreme">Radno vreme</div>
                        <div class="status ${labStatus[i].status}"></div>
                        <div class="radnoVremeDetalji">
                          <p class="whInside text-center ${(day == 1) ? labStatus[i].status : ''}">P<span>${workinghours.monday.opens} - ${workinghours.monday.closes}</span></p>
                          <p class="whInside text-center ${(day == 2) ? labStatus[i].status : ''}">U<span>${workinghours.tuesday.opens} - ${workinghours.tuesday.closes}</span></p>
                          <p class="whInside text-center ${(day == 3) ? labStatus[i].status : ''}">S<span>${workinghours.wednesday.opens} - ${workinghours.wednesday.closes}</span></p>
                          <p class="whInside text-center ${(day == 4) ? labStatus[i].status : ''}">Č<span>${workinghours.thursday.opens} - ${workinghours.thursday.closes}</span></p>
                          <p class="whInside text-center ${(day == 5) ? labStatus[i].status : ''}">P<span>${workinghours.friday.opens} - ${workinghours.friday.closes}</span></p>
                          <p class="whInside text-center ${(day == 6) ? labStatus[i].status : ''}">S<span>${workinghours.saturday.opens} - ${workinghours.saturday.closes}</span></p>
                          <p class="whInside text-center ${(day == 0) ? labStatus[i].status : ''}">N<span>${workinghours.sunday.opens} - ${workinghours.sunday.closes}</span></p>
                        </div>
                      </div>`

          google.maps.event.addListener(marker, 'click', function(){
            infoWindow.close()
            infoWindow.setContent(content)
            infoWindow.open(map, this)
          })
          google.maps.event.addListener(map, 'click', function() {
            infoWindow.close();
          })
          // marker.addListener('click', function(){
          //   var placeMarker = infoWindow.open(map, marker);
          // });
          //
          // google.maps.event.addListener(map, 'click', function() {
          //   infoWindow.close();
          // });
      }
    }
      else {
      mapArea.classList.add('d-none')
      noResults.innerHTML = ''
      resultDiv.innerHTML = `<h2 class="text-center">Trenutno se ni u jednoj laboratoriji na ovoj opštini ne mogu uraditi sve analize koje ste odabrali. Pokušajte da promenite opštinu ili da uklonite neke od analiza</h2>`
      console.log('fun')
      for (let i = 0; i< result.missingValues.length; i++) {
          resultDiv.innerHTML +=`<p class="mt-4">${result.missingValues[i].analysisName}</p>`
      }
    }
    })//data json end


  })//fetch end
}
