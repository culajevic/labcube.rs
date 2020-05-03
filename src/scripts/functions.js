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

exports.renderAnalysisResult = (analysis, pricesMin ,pricesMax, resultDiv, itemsArray) => {

  //check if analysis is already in array
  let analysisPositionArr = itemsArray.findIndex((item) => {
    return item.name === analysis[i].analysisName
  })

  let tr = document.createElement('tr')
  //td analysis name and preview icon
  let tdName = document.createElement('td')
  let analysisName = document.createTextNode(analysis[i].analysisName)
  let analysisLink = document.createElement('a')
      analysisLink.setAttribute('href', 'analysis/'+analysis[i].slug)
      analysisLink.className = 'nolink'
      analysisLink.appendChild(analysisName)

  let previewIcon = document.createElement('img')
    previewIcon.setAttribute('src', '/images/detail.svg')
    previewIcon.setAttribute('title', analysis[i].preview)
    previewIcon.className = "tooltipImg mr-2"
    previewIcon.setAttribute('data-toggle', 'tooltip')
  tdName.appendChild(previewIcon)
  tdName.appendChild(analysisLink)
  tr.appendChild(tdName)

  //abbreviation
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

  let alt = document.createElement('td')
  let altName

  for(y=0; y<analysis[i].alt.length; y++) {
    if(y != (analysis[i].alt.length)-1 ) {
     altName = document.createTextNode(analysis[i].alt[y]+', ')
    } else {
     altName = document.createTextNode(analysis[i].alt[y])
    }
    alt.appendChild(altName)
    tr.appendChild(alt)
  }

  //groupName
  let tdGroupName = document.createElement('td')
    let groupName = document.createTextNode(analysis[i].groupId.name)
    tdGroupName.appendChild(groupName)
    tr.appendChild(tdGroupName)

  //display hospital icon if analysis is available
  //ako nije dostupna stavi hospital-alt-off.svg

  let hospital = document.createElement('td')
  let hospitalIcon = document.createElement('img')
    if(analysis[i].availableHC) {
      hospitalIcon.setAttribute('src', '/images/hospital-alt.svg')
      hospitalIcon.setAttribute('data-toggle', 'tooltip')
      hospitalIcon.setAttribute('title', 'Analizu je moguće uraditi u domu zdravlja o trošku zdravstvenog osiguranja.')
    } else {
      hospitalIcon.setAttribute('src', '/images/hospital-alt_off.svg')
      hospitalIcon.setAttribute('data-toggle', 'tooltip')
      hospitalIcon.setAttribute('title', 'Ovu analizu nije moguće uraditi u domu zdravlja o trošku zdravstvenog osiguranja.')
    }
  hospital.appendChild(hospitalIcon)
  tr.appendChild(hospital)

  //display min and max price
  let minmaxPrice = document.createElement('td')
  let priceSpan = document.createElement('span')
    priceSpan.className = 'font-weight-bold'

      let priceRange = document.createTextNode(`${pricesMin[i][0].cenovnik[0].cena} - ${pricesMax[i][0].cenovnik[0].cena}`)
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
    addAnalysisBtn.setAttribute('data-analysisId', analysis[i]._id)
    addAnalysisBtn.setAttribute('data-analysisName', analysis[i].analysisName)
    addAnalysisBtn.setAttribute('data-groupImg', analysis[i].groupId.iconPath)

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

exports.removeAnalysis = (itemsArray) => {
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
        }

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

exports.addAnalysis = (itemsArray,resultDiv) => {
  //adding analysis to sidebar shopping cart
  resultDiv.addEventListener('click', (e) => {
    if(e.target.type == 'submit' && e.target.classList.contains('addAnalysis') && itemsArray.length<35) {

      itemsArray.push({
        'name':e.target.getAttribute('data-analysisName'),
        'id':e.target.getAttribute('data-analysisid'),
        'logo':e.target.getAttribute('data-groupimg')
       })

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
    } else {
      console.log('ne mozete dodati vise od 40 analiza u korpu')
    }
  })// resultdiv end
}
