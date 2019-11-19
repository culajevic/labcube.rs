const hbs = require('handlebars')
const moment = require('moment')
moment.locale('sr')

// format RS Date
hbs.registerHelper('formatRsDate', (prop) => {
  return moment(prop).format('LLL')
})

// front page group summary
hbs.registerHelper('groupSummary', (prop) =>  prop.split(' ').slice(0,30).join(' ')+'...')

// high and low values on analysis detail page
hbs.registerHelper('highAndLowValues', (highLow) => {
    return highLow.split(' ').slice(0,30).join(' ')
})

hbs.registerHelper('highAndLowValuesExtend', (highLow) => {
    return highLow.split(' ').slice(30).join(' ')
})

hbs.registerHelper('strLength', (prop) => (prop.length>240))

// create url for action attribute in form based on edit or add new group
hbs.registerHelper('checkUrlName', (prop) => (prop) ? prop+'/' : '')

// keep submited form database
hbs.registerHelper('keepData', (prop1,prop2) => (prop1 || prop2))

// increment indexes
hbs.registerHelper('increment', (index) => {
  index++
  return index
})
