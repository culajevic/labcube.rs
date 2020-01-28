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

exports.renderAnalysisResult = (analysis, result, selectedAnalysisNameArr, resultDiv, itemsArray) => {

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
  let abbr = document.createElement('td')
  let abbrName

  for(y=0; y<analysis[i].abbr.length; y++) {
    if(y != (analysis[i].abbr.length)-1 ) {
     abbrName = document.createTextNode(analysis[i].abbr[y]+', ')
    } else {
     abbrName = document.createTextNode(analysis[i].abbr[y])
    }
    abbr.appendChild(abbrName)
    tr.appendChild(abbr)
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
    let priceRange = document.createTextNode(`${result.minPriceArr[i][0].cenovnik[0].cena} - ${result.maxPriceArr[i][0].cenovnik[0].cena}`)
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
