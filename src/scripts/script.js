require('../scss/style.scss')
let NewElement = require('./class')
let PriceList = require('./price')
let removeItems = require('./functions')
const $ = require('jquery')

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
      $(".odabraneAnalize").addClass('fixed-right');
      // $(".test").addClass('fixed-top fix');
      // $(".test").removeClass('searchFieldContainerInner');

    }
    else {
      $(".odabraneAnalize").removeClass('fixed-right');
      // $(".test").removeClass('fixed-top fix');
      // $(".test").addClass('searchFieldContainerInner ');
    }
});



let location = window.location.pathname

window.onload = () => {

if(location === '/') {
  let mainSearch = document.getElementById('searchAnalysis')
    mainSearch.focus()

  let filter = 'analiza'

  // by default filter is set to analiza
  if(filter === 'analiza') {
    mainSearch.addEventListener('input', (e) => {
      if(mainSearch.value.length>1) {
        setTimeout(function() {
        let searchstring = e.target.value
        window.location.href = 'results/?name='+searchstring+'&filter='+filter
        },1000)
      }
    })
  } else {
      console.log('searching for labs')
    }

  // if filter is changed
  let analysisRadio = document.querySelectorAll('input[name=searchFilter]')
      analysisRadio.forEach((item) => {
        item.addEventListener('click', (e) => {
          filter = e.target.value
            mainSearch.addEventListener('input', (e) => {
              setTimeout(function() {
                let searchstring = e.target.value
                window.location.href = 'results/?name='+searchstring+'&filter='+filter
              },1000)
            })
        })
      })

}// if location === '/'

if (location.match('results')) {
  //
  // let resultData = document.getElementById('results').innerHTML
  // let template = Handlebars.compile(resultData)
  // let data = {name:'bojan'}
  // let html = template(data)

  //taking values from url
  const urlParams = new URLSearchParams(window.location.search);
  let myValue = urlParams.get('name')
  let myFilter = urlParams.get('filter')
  let innerSearch = document.getElementById('searchResultPage')
    innerSearch.focus()
    innerSearch.value = myValue

    // display checked filter
    let radioFilter = document.querySelectorAll('input[name=searchFilter]')
      radioFilter.forEach((item) => {
        if(item.value == myFilter) {
          item.checked=true
        }
      })

    // if searching values are comming from index page
    let resultDiv = document.getElementById('resultTable')
    let selectedAnalysisArr = []
    // resultDiv.innerHTML = data

    if(myFilter == 'analiza') {
        fetch('/analysis/'+innerSearch.value).then((data) => {
          data.json().then((result) => {
            let analysis = result.analysisName
            for(i=0; i<analysis.length; i++) {
              //create <tr>
              let tr = document.createElement('tr')
              //td analysis name
              let tdName = document.createElement('td')
                let analysisName = document.createTextNode(analysis[i].analysisName)
                  let analysisLink = document.createElement('a')
                    analysisLink.setAttribute('href', 'analysis/'+analysis[i]._id)
                    analysisLink.className = 'nolink'
                    analysisLink.appendChild(analysisName)
                let previewIcon = document.createElement('img')
                  previewIcon.setAttribute('src', '/images/detail.svg')
                  previewIcon.setAttribute('title', analysis[i].preview)
                  previewIcon.className = "tooltipImg mr-2"
                  previewIcon.setAttribute('data-toggle', 'tooltip')
              tdName.appendChild(previewIcon)
                //<td>analysis name</td>
              tdName.appendChild(analysisLink)
              tr.appendChild(tdName)

              //td abbr
              let abbr = document.createElement('td')
                let abbrName = document.createTextNode(analysis[i].abbr[0])
                abbr.appendChild(abbrName)
                tr.appendChild(abbr)

              //td groupName
              let tdGroupName = document.createElement('td')
                let groupName = document.createTextNode(analysis[i].groupId.name)
                tdGroupName.appendChild(groupName)
                tr.appendChild(tdGroupName)

              //td hospital
              let hospital = document.createElement('td')
                let hospitalIcon = document.createElement('img')
                  hospitalIcon.setAttribute('src', '/images/hospital-alt.svg')
                hospital.appendChild(hospitalIcon)
                tr.appendChild(hospital)

              let minmaxPrice = document.createElement('td')
              let priceSpan = document.createElement('span')
                priceSpan.className = 'font-weight-bold'
                let priceRange = document.createTextNode(`${result.minPrice.cenovnik[0].cena} - ${result.maxPrice.cenovnik[0].cena}`)
                priceSpan.appendChild(priceRange)
                minmaxPrice.appendChild(priceSpan)
                tr.appendChild(minmaxPrice)

              let addAnalysisBtnTd = document.createElement('td')
              let addAnalysisBtn = document.createElement('button')
                addAnalysisBtn.className = 'btn btn-outline-success float-right btn-block text-uppercase addAnalysis'
                addAnalysisBtn.setAttribute('data-analysisId', analysis[i]._id)
              let addAnalysisBtnText = document.createTextNode('dodaj')
              addAnalysisBtn.appendChild(addAnalysisBtnText)
              addAnalysisBtnTd.appendChild(addAnalysisBtn)
              tr.appendChild(addAnalysisBtnTd)
              resultDiv.appendChild(tr)
            }//for end
          })// data json end
        })//fetch end


        //add and remove analysis from selected analysis box
        resultDiv.addEventListener('click', (e) => {
          // e.preventDefault()
          if(e.target.type == 'submit' && e.target.classList.contains('addAnalysis')) {
            selectedAnalysisArr.push(e.target.getAttribute('data-analysisid'))

            e.target.innerHTML = '&#10004;'
            e.target.className = 'btn btn-outline-success float-right btn-block text-uppercase deleteAnalysis'
            e.target.disabled = true
            let analysisAdded = document.createElement('li')
                analysisAdded.className='list-group-item list-group-item-action'
            let analysisId = document.createTextNode(e.target.getAttribute('data-analysisid'))

            let removeSpan = document.createElement('span')
              removeSpan.className = 'float-right remove'
            let removeImg = document.createElement('img')
              removeImg.setAttribute('src','/images/closeBtn.svg')
              removeImg.className = 'remove-analysis-from-basket'
              removeSpan.appendChild(removeImg)

              analysisAdded.appendChild(analysisId)
              analysisAdded.appendChild(removeSpan)
            selectedAnalysis.insertBefore(analysisAdded, selectedAnalysis.childNodes[0])
            document.querySelector('.card').classList.remove('d-none')

          } else if (e.target.type == 'submit' && e.target.classList.contains('deleteAnalysis')){
            e.target.textContent = 'dodaj'
            e.target.className = 'btn btn-outline-success float-right btn-block text-uppercase addAnalysis'
          }
        })

        // remove analysis from basket
        let analysisBasket = document.getElementById('selectedAnalysis')
          analysisBasket.addEventListener('click', (e) => {

            if(e.target.classList.contains('remove-analysis-from-basket')) {
              let selectedAnalysisBasket = e.target.parentNode.parentNode
              selectedAnalysisBasket.remove()
              let indexOfAnalysis = selectedAnalysisArr.indexOf(selectedAnalysisBasket.innerText)

              let removedValue = selectedAnalysisArr.splice(indexOfAnalysis,1)
              let enableButton = document.querySelectorAll('#resultTable tr>td>button')
                enableButton.forEach((item) => {
                  if(item.getAttribute('data-analysisId') == removedValue[0]) {
                    item.disabled = false
                    item.textContent = 'dodaj'
                    item.classList.remove('deleteAnalysis')
                    item.classList.add('addAnalysis')
                  }
                })

              // if last analysis is removed from the basket remove basket
              if(selectedAnalysisArr.length == 0) {
                document.querySelector('.card').classList.add('d-none')
              }
            }
          })

    } else {
        fetch('/lab/'+innerSearch.value).then((data) => {
          data.json().then((result) => {
            console.log(result)
          })
        })
      }



    // if filter value is changed on result searchResultPage

    // taking filter value
    let analysisRadio = document.querySelectorAll('input[name=searchFilter]')
        analysisRadio.forEach((item) => {
          item.addEventListener('click', (e) => {
            myFilter = e.target.value
            innerSearch.value=''
            innerSearch.focus()
          })
        })

    // if search string is changed on result page
    innerSearch.addEventListener('input', (e) => {
        let searchstring = e.target.value
        if(myFilter == 'analiza' && searchstring.length>2) {
          fetch('/analysis/'+searchstring).then((data) => {
            data.json().then((result) => {
              console.log(result)
            })
          })
        } else if(searchstring.length>2){
            fetch('/lab/'+searchstring).then((data) => {
              data.json().then((result) => {
                console.log(result)
              })
            })
          } else {
            console.log('unesite vise od 2 karaktera da zapocnete pretragu')
          }
      })

  // $('[data-toggle="tooltip"]').tooltip(
  //   {
  //   placement:"bottom",
  //   delay: {show: 100, hide: 100},
  //   boundary: 'window'
  //   }
  // )

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
      removeItems.removeElement(parentUl, analysisSelected)

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
        removeItems.removeElement(diseaseParentUl,diseaseSelected)


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
  removeItems.removeElement(referenceUl,selectedReferences)

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
          editorImage.setAttribute('src',e.srcElement.getAttribute('data-editorImage'))

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

      // removeItems.removeElement(editorDiv,selectedEditor)

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
    removeItems.deleteDocument('.deleteDocument','analiza ce biti obrisana?','/allAnalysis/','/allAnalysis','doslo je do greske')
    }

//delete lab
  if(location.match('allLabs')) {
    removeItems.deleteDocument('.deleteDocument','laboratorija ce biti obrisana','/allLabs/','/allLabs','doslo je do greske')
  }

//delete group
  if(location.match('allGroupsList')) {
    removeItems.deleteDocument('.deleteDocument', 'grupa ce biti obrisana', '/allGroupsList/', '/allGroupsList', 'doslo je do greske prilikom brisanja grupe')
  }
//delete disease
  if(location.match('allDiseases')) {
    removeItems.deleteDocument('.deleteDocument', 'oboljenje ce biti obrisano', '/allDiseases/', '/allDiseases', 'doslo je do greske prilikom brisanja oboljenja')
  }
//delete editor
  if(location.match('allEditors')) {
    removeItems.deleteDocument('.deleteDocument', 'urednik ce biti obrisan', '/allEditors/', '/allEditors', 'doslo je do greske prilikom brisanja urednika')
  }
//delete reference
  if(location.match('allReferences')) {
    removeItems.deleteDocument('.deleteDocument', 'referenca ce biti obrisana', '/allReferences/', '/allReferences', 'doslo je do greske prilikom uklanjanja reference')
  }
//delete faq
  if(location.match('allFaqs')) {
    removeItems.deleteDocument('.deleteDocument', 'Pitanje ce biti obrisano', '/allFaqs/', '/allFaqs', 'doslo je do greske prilikom uklanjanja pitanja')
  }
//delete priceList
  if(location.match('allPrices')) {
    removeItems.deleteDocument('.deleteDocument', 'Cenovnik ce biti obrisan', '/allPrices/', '/allPrices', 'doslo je do greske prilikom brisanja cenovnika')
  }

}// window onload end
