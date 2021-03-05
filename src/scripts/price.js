exports.createPrice = () => {

  let searchLab = document.getElementById('searchLabName')
  let queryResultUl = document.getElementById('labFound')
  let labName = document.getElementById('labName')

  searchLab.addEventListener('input', (e) => {
    if(searchLab.value.length>2) {
      fetch('/lab/'+e.target.value).then((data) => {
        data.json().then((result) => {
          queryResultUl.innerHTML=''
          for(i=0; i<result.length; i++) {
            let liItem = document.createElement('li')
            liItem.className +="list-group-item"
            let link = document.createElement('a')
            link.href=result[i]._id
            liItem.appendChild(link)
            let labName = document.createTextNode(result[i].labName)
            link.appendChild(labName)
            queryResultUl.appendChild(liItem)
          }// for end
        })// data.json end
      })// fetch end
    } // if end
    else {
      console.log('please enter at lease 2 chars')
      queryResultUl.innerHTML = ''
    }
  })

  let labSelected = document.getElementById('labFound')
    labSelected.addEventListener('click', (e) => {
      e.preventDefault()
      searchLab.value = e.srcElement.attributes.href.textContent
      labName.value=e.target.innerText
      queryResultUl.innerHTML = ''
    })

  //search for analysis

  let searchAnalysis = document.getElementById('searchAnalysis')
  let getAnalyisisNameDiv = document.getElementById('analysisFound')
  let analysisParentDiv = document.getElementById('analysisDiv')
  let priceParent = document.getElementById('priceList')

  // set focus on searchanalysis field when up arrow is pressed
  document.addEventListener('keydown', (e) => {
    if(e.keyCode === 38) {
      searchAnalysis.focus()
    }
  })

  searchAnalysis.addEventListener('input', (e) => {
    if (searchAnalysis.value.length > 2) {
    fetch('/analysis/prices/'+e.target.value).then((data) => {
      data.json().then((result) => {
        let analysis = result.analysisName
        getAnalyisisNameDiv.innerHTML = ''
        for(i=0; i<analysis.length; i++) {
          let liItem = document.createElement('li')
          liItem.className +="list-group-item"
          let link = document.createElement('a')
          link.href=analysis[i]._id
          liItem.appendChild(link)
          let analysisName = document.createTextNode(analysis[i].analysisName)
          link.appendChild(analysisName)
          getAnalyisisNameDiv.appendChild(liItem)
        } // for end
      })// datajson end
    })// fetch end
  } else {
      getAnalyisisNameDiv.innerHTML = ''
    }
  })// searchAnalysis event listener end

  // creating input fields
  let analysisFound = document.getElementById('analysisFound')

    analysisFound.addEventListener('click', (e) => {
      e.preventDefault()

      let hiddenId = document.createElement('input')
      hiddenId.type = 'hidden'
      hiddenId.name = 'cenovnik[analiza][]'
      hiddenId.setAttribute('value', e.srcElement.attributes.href.textContent)

      let analysisRow = document.createElement('div')
        analysisRow.className = 'form-row'

      let analysisNewDiv = document.createElement('div')
        analysisNewDiv.className = 'form-group mt-2 col-6'

      let analysisName = document.createElement('input')
        analysisName.type = 'text'
        analysisName.className = 'form-control'
        analysisName.name='cenovnik[imeanalize][]'
        analysisName.setAttribute('value', e.target.innerText)
        analysisName.setAttribute('readonly', true)

      let analysisPrice = document.createElement('div')
        analysisPrice.className = 'form-group mt-2 col-5'

      let deletePrice = document.createElement('div')
        deletePrice.className = 'form-group mt-2 col-1'

      let price = document.createElement('input')
        price.type = 'text'
        price.setAttribute('placeholder', 'upisi cenu')
        price.name = 'cenovnik[cena][]'
        price.className = 'form-control'

      let deleteButton = document.createElement('button')
        deleteButton.className='btn btn-danger float-right deletePrice'
        deleteButton.type='button'
        deleteButton.name='button'
          let buttonText = document.createTextNode('delete')
          deleteButton.appendChild(buttonText)
        deletePrice.appendChild(deleteButton)

      analysisNewDiv.appendChild(analysisName)
      analysisPrice.appendChild(price)
      analysisNewDiv.appendChild(hiddenId)

      analysisRow.appendChild(analysisNewDiv)
      analysisRow.appendChild(analysisPrice)
      analysisRow.appendChild(deletePrice)

      // analysisParentDiv.appendChild(analysisRow)
      priceParent.appendChild(analysisRow)

      price.focus()
      searchAnalysis.value=''
      getAnalyisisNameDiv.innerHTML = ''

    })// analysisfound end

    // delete price from pricelist
      let deletePrice = document.getElementById('priceList')
      // console.log(deletePrice)
        deletePrice.addEventListener('click', (e) => {
          // console.log(deletePrice)
          if(e.target.classList.contains('deletePrice')) {
            e.preventDefault()
            e.target.parentNode.parentNode.remove()
          }
        })
}
