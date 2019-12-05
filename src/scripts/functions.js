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

exports.searchAnalysis = (searchString,resultDiv, flag) => {

let selectedAnalysis = []

  const analysisJson = localStorage.getItem('selectedAnalysis')
    if (analysisJson !== null) {
      selectedAnalysis = JSON.parse(analysisJson)

    }

  if(typeof(selectedAnalysisNameArr) === 'undefined') {
    selectedAnalysisNameArr = []
   } else {
     console.log(selectedAnalysisNameArr)
   }
// console.log('length after refresh is '+selectedAnalysisNameArr.length)

  fetch('/analysis/prices/'+searchString).then((data) => {
    data.json().then((result) => {
      // console.log(result)
      resultDiv.innerHTML = ''
      let analysis = result.analysisName
      for(i=0; i<analysis.length; i++) {
        //creating table with result
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
        if(selectedAnalysisNameArr.indexOf(analysis[i].analysisName) === -1) {
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
      }// for end
    })// data json end
  })//fetch end

if(flag == true) {
    //add analysis to basket
    resultDiv.addEventListener('click', (e) => {
      if(e.target.type == 'submit' && e.target.classList.contains('addAnalysis')) {

        //create array of analysis IDs
        // selectedAnalysisIdArr.push(e.target.getAttribute('data-analysisid'))
        //create an array with analysis names
        selectedAnalysisNameArr.push(e.target.getAttribute('data-analysisName'))
        selectedAnalysisNameArr.sort()

        const selectedAnalysisJson = JSON.stringify(selectedAnalysisNameArr)
        localStorage.setItem('selectedAnalysis', selectedAnalysisJson)

        //changing style for buttons if analysis is added to basket
        if(selectedAnalysisNameArr.indexOf(e.target.getAttribute('data-analysisName')) !== -1) {
        // console.log(selectedAnalysisNameArr.indexOf(e.target.getAttribute('data-analysisName')))
          e.target.innerHTML = '&#10004;'
          e.target.className = 'btn btn-outline-success float-right btn-block text-uppercase deleteAnalysis'
          e.target.disabled = true
        }

        // creating li element for shopping basket
        let analysisAdded = document.createElement('li')
          analysisAdded.className='list-group-item list-group-item-action'
        //creating group image
        let groupImage = document.createElement('img')
          groupImage.classList = 'labGroupIconSelectedAnalysis'
          groupImage.setAttribute('src', '/images/'+e.target.getAttribute('data-groupImg'))
        //creating text with analysis name
        let analysisName = document.createTextNode(e.target.getAttribute('data-analysisName'))
        //creating span element for remove icon
        let removeSpan = document.createElement('span')
          removeSpan.className = 'float-right remove'
        let removeImg = document.createElement('img')
          removeImg.setAttribute('src','/images/closeBtn.svg')
          removeImg.className = 'remove-analysis-from-basket'
          removeSpan.appendChild(removeImg)
        //putting everythig together
          analysisAdded.appendChild(groupImage)
          analysisAdded.appendChild(analysisName)
          analysisAdded.appendChild(removeSpan)

        //taking analysisname position in array
          let analysisPosition = selectedAnalysisNameArr.indexOf(e.target.getAttribute('data-analysisName'))

          //sort analysis in shoping basket
          let selectedAnalysis = document.getElementById('selectedAnalysis')
          selectedAnalysis.insertBefore(analysisAdded, selectedAnalysis.childNodes[analysisPosition])

        //display shopping basket if at least one analysis is choosen
        document.querySelector('.card').classList.remove('d-none')
      }//if ends
    })// result div end

    // remove analysis from basket
    let analysisBasket = document.getElementById('selectedAnalysis')
      analysisBasket.addEventListener('click', (e) => {

        if(e.target.classList.contains('remove-analysis-from-basket')) {
          let selectedAnalysisBasket = e.target.parentNode.parentNode

          //take removed id so it is removed from array as well
          let indexOfAnalysisName = selectedAnalysisNameArr.indexOf(selectedAnalysisBasket.innerText)
          // console.log(indexOfAnalysisName)
          let removedValue = selectedAnalysisNameArr.splice(indexOfAnalysisName,1)

          //remove analysis li from basket
          selectedAnalysisBasket.remove()

          //enable button for the analysis removed
          let enableButton = document.querySelectorAll('#resultTable tr>td>button')
            enableButton.forEach((item) => {
              if(item.getAttribute('data-analysisName') == removedValue[0]) {
                item.disabled = false
                item.textContent = 'dodaj'
                item.classList.remove('deleteAnalysis')
                item.classList.add('addAnalysis')
              }
            })
          // if last analysis is removed from the basket remove basket
          if(selectedAnalysisNameArr.length == 0) {
            document.querySelector('.card').classList.add('d-none')
          }
        }
      })// analysisBasket.addEventListener end
  }
}
