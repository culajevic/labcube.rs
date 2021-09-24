const hbs = require('handlebars')
const moment = require('moment')
moment.locale('sr')

// format RS Date
hbs.registerHelper('formatRsDate', (prop) => {
  return moment(prop).format('LLL')
})

hbs.registerHelper('formatLabScheduleDate', (date,place) => {
  if(place=='patronaza') {
    return moment(date).format('D.M.Y / H:mm')
  } else {
    return moment(date).format('L')
  }
})

hbs.registerHelper('checkInterpreatationStatus', status => {
  if (status == 'pending') {
    return '<i class="fas fa-spinner"></i>'
  } else {
    return '<i class="fas fa-tasks"></i>'
  }
})



hbs.registerHelper('displayTime', (value) => {
  return moment(value).format('D.M.Y / H:mm')
})

hbs.registerHelper('calculateTime', (deadline) => {
  let currentTime = Date.now()
 let diff = Math.floor(Math.abs(deadline - currentTime) /  1000 / 60 )
 return diff
})

// format RS Date without time
hbs.registerHelper('formatRsDateOnly', (prop) => {
  return moment(prop).format('L')
})

// front page group summary
hbs.registerHelper('groupSummary', (prop) =>  prop.split(' ').slice(0,30).join(' ')+'...')

// high and low values on analysis detail page
hbs.registerHelper('highAndLowValues', (highLow) => {
    return highLow.split(' ').slice(0,28).join(' ')
})

hbs.registerHelper('highAndLowValuesExtend', (highLow) => {
    return highLow.split(' ').slice(28).join(' ')
})

hbs.registerHelper('strLength', (prop) => (prop.length>240))

// create url for action attribute in form based on edit or add new group
hbs.registerHelper('checkUrlName', (prop) => (prop) ? prop+'/' : '')

// keep submited form database
hbs.registerHelper('keepData', (prop1,prop2) => (prop1 || prop2))

hbs.registerHelper('checkBox', (prop1, prop2) => {
  if(prop1==prop2) {
    return true
  } else {
    return false
  }
})

//check gender

hbs.registerHelper('checkGender', (gender) => {
  if(gender == 'Ž') {
    return true
  } else {
    return false
  }
})

// increment indexes
hbs.registerHelper('increment', (index) => {
  index++
  return index
})
//display phones list on lab details page
hbs.registerHelper('displayPhoneList', (phones) => {
  let phonesNewList = []
  for (i=0; i<phones.length; i++) {
    phonesNewList = phones.join(', ')
    }
return phonesNewList
})

hbs.registerHelper('displayAnalysis', (analysis) => {
  return analysis.join("<br />")
})

hbs.registerHelper('displayScheduledAnalysis', (item) => {
  let scheduledAnalysisFormat = []
  let commaList
  for (i=0; i<item.length; i++) {
    scheduledAnalysisFormat.push(item[i].analysis)
    commaList = scheduledAnalysisFormat.join(', ')
    }
return commaList
})

hbs.registerHelper('countItems', (items) => {
  return items.length
})

hbs.registerHelper('countHighValues', (items) => {
  let highValues = 0
  for (i=0; i<items.length; i++) {
    if(items[i].outsideOfTheRange == true) {
      highValues += 1
    }
  }
  return highValues
})

hbs.registerHelper('countOkValues', (value1, value2) => {
  let totalNumOfAnalysis = value2.length
  let okValues = parseInt(totalNumOfAnalysis) - parseInt(value1)
  return okValues
})

hbs.registerHelper('pagination', (value1, value2) => {
  if (value1 > value2) {
    return true
  }
})

hbs.registerHelper('paginationNext', (value1, value2) => {
  if (value1 < value2) {
    return true
  }
})

hbs.registerHelper('minus', (value1, value2) => {
  return value1 - value2
})

hbs.registerHelper('plus', (value1, value2) => {
  return parseInt(value1) + parseInt(value2)
})

hbs.registerHelper('lowValue', (value1, value2) => {
  let v1 = parseFloat(value1)
  let v2 = parseFloat(value2)
  if (v1 < v2) {
    return 'showRed'
  }
})

hbs.registerHelper('lessThenCheck', (valueA,valueB) => {
  let v1 = parseFloat(valueA)
  let v2 = parseFloat(valueB)
  if (v1 < v2) {
    return 'showGreen'
  }
})

hbs.registerHelper('lessThenCheckNotOk', (valueA,valueB) => {
  let v1 = parseFloat(valueA)
  let v2 = parseFloat(valueB)
  if (v1 < v2) {
    return 'showRed'
  }
})

hbs.registerHelper('greaterThenOk', (value1, value2) => {
  let v1 = parseFloat(value1)
  let v2 = parseFloat(value2)
  if (v1 > v2) {
    return 'showGreen'
  }
})

hbs.registerHelper('outsideOfTheRange', (value) => {
  if (value) {
    return 'valueNotOk'
  } else {
    return 'valueOk'
  }
})



hbs.registerHelper('greaterThen', (value1, value2) => {
  let v1 = parseFloat(value1)
  let v2 = parseFloat(value2)
  if (v1 > v2) {
    return 'showRed'
  }
})

hbs.registerHelper('betweenRange', (value1, value2, value3) => {
  let v1 = parseFloat(value1)
  let v2 = parseFloat(value2)
  let v3 = parseFloat(value3)

  if (v1 >= v2 && v1<= v3) {
    return 'showGreen'
  }
})

hbs.registerHelper('highValue', (value1, value2) => {
  let v1 = parseFloat(value1)
  let v2 = parseFloat(value2)
  if (v1 > v2) {
    return 'showRed'
  }
})

hbs.registerHelper('addMaxValue', (value1) => {
  return Math.ceil(parseFloat(value1)+(parseFloat(value1)/2))
})

hbs.registerHelper('notZero', (value) => {
  if(parseFloat(value) != 0) {
    return true
  }
})

hbs.registerHelper('notBlank', (value) => {
  if (value.length>0){
    return true
  }
})

hbs.registerHelper('empty', value => {
  if(value != '') {
    return true
  }
})

hbs.registerHelper('checkStatus', (value1) => {
  if (value1 == 'Završeno') return true
})

hbs.registerHelper('ifGT', (value1, value2) => {
  if (value1 < value2) return true
})

hbs.registerHelper('checkStatusFeedback', (value1,value2) => {
  if (value1 == 'Završeno' && value2 == false) return true
})

//display if lab is open on lab details page
hbs.registerHelper('isItOpen', (status, currentDayNum ) => {
  let now = new Date()
  let day = now.getDay()
  let currentStatus
  if(status === 'open' && day === currentDayNum) {
    return currentStatus = 'open'
  } else if (status==='closedSoon' && day == currentDayNum ) {
    return currentStatus = 'closedSoon'
  } else if (status ==='closed' && day == currentDayNum ){
    return currentStatus = 'closed'
  }
})


//check if payment is ok
hbs.registerHelper('checkPayment', (package, paid) => {
  let v1 = parseFloat(package)
  let v2 = parseFloat(paid)
  if (v1 === v2 ) {
    return 'paid'
  } else {
    return 'notPaid'
  }
})
