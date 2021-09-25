exports.bestPrice = () => {

let priceList = document.getElementById('priceList')
let closePriceList = document.getElementById('closePriceList')
let checkout = document.querySelector('.checkout')
let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : []

  checkout.addEventListener('click', ()=> {
    if (itemsArray.length > 0) {
    priceList.classList.add('unhidePriceList')
    priceList.classList.remove('hidePriceList')
    priceList.classList.remove('d-none')
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
    //ako nesto ne radi zakomentarisati red ispod
    helper.bestPrice(mapArea, resultDiv)
  })
}
