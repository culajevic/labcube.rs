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
      e.target.remove() }
  })
}

exports.deleteDocument = (selector,message,url,redirect,error) => {
  let deleteDocument = document.querySelectorAll(selector)
    deleteDocument.forEach((item) => {
      item.addEventListener('click', (e) => {
        if(confirm(message))  {
          let id = e.target.getAttribute('data-id')
          url += id
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

  //check if analysis is already in localstorage
  let analysisPositionArr = itemsArray.findIndex((item) => {

    return item.name === prices[i].name
  })

  let tr = document.createElement('tr')
  //td analysis name and preview icon
  let tdName = document.createElement('td')
  let analysisName = document.createTextNode(prices[i].name)

  let analysisLink = document.createElement('a')
      analysisLink.setAttribute('href', '/results/analysis/'+prices[i].slug)
      analysisLink.className = 'nolink'
      analysisLink.appendChild(analysisName)

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
  let altName

  for(y=0; y<prices[i].abbr.length; y++) {
    console.log(prices[i].abbr[y].join(', '))
     altName = document.createTextNode((prices[i].abbr[y]).join(', '))
    alt.appendChild(altName)
    tr.appendChild(alt)
  }

  //display analysis groupName
  let tdGroupName = document.createElement('td')
    let groupName = document.createTextNode(prices[i].groupName)
    tdGroupName.appendChild(groupName)
    tr.appendChild(tdGroupName)

  //display hospital icon if analysis is available
  //ako nije dostupna stavi hospital-alt-off.svg

  let hospital = document.createElement('td')
  let hospitalIcon = document.createElement('img')
    if(prices[i].availableHC) {
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
    priceSpan.className = 'font-weight-bold'

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
    addAnalysisBtnText = document.createTextNode('dodaj')
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
    let analysisName = document.createTextNode(analysis.name)
    let analysisLink = document.createElement('a')
    let slug = analysis.name.split(' ')
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
        selectedAnalysisBasket.remove()
        //remove element from itemsarray
        let removedValue = itemsArray.splice(nameIndex,1)
        localStorage.setItem('items', items)

        let basketTitle = document.createTextNode(` (${itemsArray.length}) `)
        let cardHeader = document.getElementById('numOfAnalysis')
        cardHeader.innerHTML=''
        cardHeader.appendChild(basketTitle)

        //hide basket if all analysis are removed
        if(itemsArray.length == 0) {
          document.querySelector('.card').classList.add('d-none')
          checkout.classList.add('d-none')
        }

        checkout.innerText = itemsArray.length

        //enable button for the analysis removed
        // let enableButton = document.querySelectorAll('#resultTable tr>td>button')
        let enableButton = document.querySelectorAll('.deleteAnalysis')
          enableButton.forEach((item) => {
            if(item.getAttribute('data-analysisName') == removedValue[0].name) {
              item.disabled = false
              item.textContent = 'dodaj'
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

      itemsArray.push({
        'name':e.target.getAttribute('data-analysisName'),
        'id':e.target.getAttribute('data-analysisid'),
        'logo':e.target.getAttribute('data-groupimg')
       })

       //add number of analysis to navigation
       checkout.classList.remove('d-none')
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
      //creating text with analysis name
      let analysisName = document.createTextNode(e.target.getAttribute('data-analysisName'))
      let analysisLink = document.createElement('a')
      let slug = e.target.getAttribute('data-analysisName').split(' ')
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
  searchString.focus()

    filter.forEach((item) => {
      if(item.checked) {
        filterValue = item.value
        console.log('checked ' + filterValue)
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
    console.log('trazim funkcija')
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
              <button type="button" class="btn btn-block btnLabDetails buttonId mt-2" data-labName="laboratorija/${result[i].slug}">saznaj više</button>
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
            todayIs.classList.add('active')
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

exports.bestPrice = (mapArea, resultDiv) => {
  let municipalityValue
  if(document.getElementById('municipality')!= null) {
    let municipality = document.getElementById('municipality')
    municipalityValue = municipality.options[municipality.selectedIndex].value
  } else {
    municipalityValue = JSON.parse(localStorage.getItem('municipality'))
  }
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

  // let municipalityValue = municipality.options[municipality.selectedIndex].value ? municipality.options[municipality.selectedIndex].value : JSON.parse(localStorage.getItem('municipality'))

  localStorage.setItem('municipality', JSON.stringify(municipalityValue))
  let markers = []

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
      // loaderWrapper.style.opacity = 0
      let labTemplate = document.createElement('div')
        labTemplate.className = 'col-12 d-flex flex-row flex-wrap'
        console.log(result)
      for(let i=0; i<result.length; i++) {

        if(day == currentDayNum) {

            let openTime = result[i].lab[0].workingHours[currentDay].opens
            let closingTime = result[i].lab[0].workingHours[currentDay].closes
            let todayOpenTime = new Date(today +' '+ openTime +':00')
            let todayClosingTime = new Date(today +' '+ closingTime +':00')
            let nowTimeStamp = now.getTime()
            if(nowTimeStamp > todayOpenTime.getTime() &&
              todayClosingTime.getTime() > nowTimeStamp) {
              numOpen +=1
              status = 'open'
              labStatus.push({'id':result[i].lab[0]._id, 'status':status})
            }
            else {
              status = 'closed'
              labStatus.push({'id':result[i].lab[0]._id, 'status':status})
            }
        }



      markers.push(
        {
          lat:result[i].lab[0].location.coordinates[1], lng:result[i].lab[0].location.coordinates[0],
          iconImage:'/images/pinopen.svg',
          total:result[i].total,
          name:result[i].lab[0].labName,
          address:result[i].lab[0].address,
          city:result[i].labPlace[0].place,
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
          <span class="labInfoWindowTitle">${result[i].lab[0].labName} - ${result[i].total}</span>
         </div>
           <div class="labInfoWindow">
               <img src="/images/lablogo/${result[i].lab[0].logo}" class="labLogoInfoWindow">

               <p class="labInfoWindowAdresa">${result[i].lab[0].address}</p>
               <p class="labInfoWindowGrad">${result[i].labPlace[0].place}</p>
               <p class="labInfoWindowTelefoni"> ${result[i].lab[0].phone} </p>
           </div>
           <div class="labInfoFooter">
               <img src="/images/radnoVreme_black.svg" class="labInfoWindowWorkingHoursIcon">
               <div class="radnoVreme">Radno vreme</div>
               <div id='otvoreno' class='status otvoreno'></div>
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



          let infoWindow = new google.maps.InfoWindow({
            maxWidth:600,
            content:`<div class="" style="min-height:142px; max-width:380px;">
                        <p class="labInfoWindowTitle mb-2 pb-0"><a href="/laboratorija/${slug}/${passIds}">${name}</a></p>
                        <span class="">${address}</span>
                        <p class="">${city}</p>
                        <span class="labInfoWindowTelefoni">${phone.join(', ')}</span>

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
                      </div>

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
}
