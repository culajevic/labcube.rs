const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController')
const labController = require('../controllers/labController')
const placeController = require('../controllers/placeController')
const analysisController = require('../controllers/analysisController')
const diseaseController = require('../controllers/diseaseController')
const editorController = require('../controllers/editorController')
const referenceController = require('../controllers/referenceController')
const faqController = require('../controllers/faqController')
const priceController = require('../controllers/priceController')
const resultController = require('../controllers/resultController')
const authenticationController = require('../controllers/authenticationController')
const scheduleController = require('../controllers/scheduleController')
const generalController = require('../controllers/general')
const profileController = require('../controllers/profileController')
const adminController = require('../controllers/adminController')
const passport = require('passport')



// display groups on front page
router.get('/', groupController.getGroups)
router.post('/', groupController.getGroups)
// router.get('/', labController.getAllLabs)

//payment testing
router.get('/checkout/', resultController.paymentDone)

//display single group
router.get('/group/:slug', groupController.displayGroup)

//display about us
router.get('/o-nama/', generalController.aboutus)
router.get('/politika-privatnosti/', generalController.privacy)
router.get('/uslovi-koriscenja/', generalController.terms)
router.get('/uslovi-placanja/', generalController.paymentDetails)
router.get('/kolacici', generalController.cookies)

// searchfor lab or analysis
router.get('/results/', resultController.displayResults)
router.get('/results/analysis/:slug', resultController.displayAnalysisDetails)


router.delete('/profile/:id/:location?', authenticationController.deleteOtherResult)

//registration
router.get('/prijava', authenticationController.signin)
router.post('/prijava', authenticationController.login)
router.get('/google', authenticationController.google)
router.get('/logout', authenticationController.logout)
router.get('/google/redirect', authenticationController.redirect)
router.get('/profile', authenticationController.profile)



router.get('/profile/page/:page', authenticationController.profile)

//searching users by email from laboratory dashboard
router.get('/users/:userEmail?', authenticationController.findUserEmail)

//searching for user by lab cube stuff for interpretation
router.get('/usersLabCube/:userEmail?', authenticationController.findUserEmailByLabCube)
router.get('/registracija', authenticationController.registerForm)
router.post('/register', authenticationController.register)
router.get('/verify', authenticationController.verify)
router.post('/verify', authenticationController.verifyToken)
router.get('/admindashboard', authenticationController.admindasboard)
router.get('/forgot', authenticationController.forgot)
router.post('/forgot', authenticationController.resetPassLink)
router.get('/reset/:token', authenticationController.resetPass)
router.post('/resetPass/:token', authenticationController.updatePassword)
router.get('/mojirezultati/:id', scheduleController.myResults)
router.post('/submitRating', scheduleController.userFeedback)
router.post('/deleteUser/:id', profileController.deleteUser)

// groups
router.get('/allGroupsList', groupController.listAllGroups)
router.get('/addGroup', groupController.addGroup)
router.post('/addGroup', groupController.upload, groupController.createGroup)
router.get('/addGroup/:name', groupController.editGroup)
router.post('/addGroup/:name', groupController.upload, groupController.updateGroup)
router.delete('/allGroupsList/:id/:location?', groupController.deleteGroup)
//:location is added because of deletein analysis reports from user profile page

//tumacenje rezultata
router.get('/tumacenje-laboratorijskih-analiza', resultController.labRestultsAnalysis)
// router.post('/tumacenje-laboratorijskih-analiza', resultController.upload, resultController.labResult)
// router.post('/payment', resultController.upload, resultController.payment )
router.post('/payment', resultController.upload, resultController.payment, resultController.paymentDone )

//pregled uplodovanih protumacenih rezultata od strane korisnika
router.get('/myResult/:id', scheduleController.myResultLabCube)

//prices
router.get('/allPrices', priceController.allPrices)
router.get('/addPrice', priceController.addPrice)
router.post('/addPrice', priceController.createPrice)
router.get('/addPrice/:id', priceController.editPrice)
router.post('/addPrice/:id', priceController.updatePrice)
router.delete('/allPrices/:id:/location?', priceController.deletePriceList)

// router.get('/schedule/:labId/:analysis/:userId/:total', scheduleController.scheduleVisit)
// router.get('/schedule/:scheduleString', scheduleController.scheduleVisit)
router.post('/schedule', scheduleController.scheduleVisit)
router.get('/hvala', scheduleController.thankyou)
router.post('/updateSchedule/:scheduleId', scheduleController.updateSchedule)
//healthProfile
router.post('/healthProfile/:id', profileController.updateHealthProfile)
router.post('/myProfile/:id', profileController.updateProfile)
router.post('/updatePassword/:id', profileController.updatePass)
router.get('/interpretation/page/:page', scheduleController.resultsInterpretation)
router.get('/otherResultsInterpretation/page/:page', scheduleController.otherResultsInterpretation)
router.get('/interpretation/:id', scheduleController.resultsInterpretationValues)
router.get('/otherResultsInterpretation/:id', scheduleController.otherResultsInterpretationValues)
router.post('/analysisInterpretation/:id', scheduleController.analysisInterpretation)
router.post('/analysisOtherInterpretation/:id', scheduleController.analysisOtherInterpretation)
router.post('/lockTheInterpretation', scheduleController.lockTheInterpretation)
router.post('/lockTheOtherInterpretation', scheduleController.lockTheOtherInterpretation)
// router.post('/checkTheLock', scheduleController.checkTheLockedRecord)
// router.get('/profile', profileController.getMyAppointments)

// labs
router.get('/allLabs', labController.allLabs)
router.get('/addLab', labController.addLab)
router.post('/addLab', labController.upload, labController.createLab)
router.get('/addLab/:id/:name', labController.editLab)
router.post('/addLab/:id/:name',labController.upload, labController.updateLab)
router.delete('/allLabs/:id/:location?', labController.deleteLab)
router.get('/laboratorija/:slug/:ids?', labController.getLabInfo)
// router.get('/laboratorija/:analysisName', labController.getLabInfo)
router.get('/search/analysis/:analysisName/:labSlug', labController.getAdditionalAnalysis)
router.post('/sendFeedback/:id', labController.sendFeedback)
// router.post('/laboratorija/:slug/:ids*', labController.getLabInfoAnalysis)



// analysis
router.get('/allAnalysis', analysisController.allAnalysis)
router.get('/addAnalysis', analysisController.addAnalysis)
router.post('/addAnalysis', analysisController.upload, analysisController.createAnalysis)
router.get('/addAnalysis/:id', analysisController.editAnalysis)
router.post('/addAnalysis/:id/:name', analysisController.upload, analysisController.updateAnalysis)
router.delete('/allAnalysis/:id/:location?', analysisController.deleteAnalysis)

//disease
router.get('/allDiseases', diseaseController.allDiseases)
router.get('/addDisease', diseaseController.addDisease)
router.post('/addDisease', diseaseController.createDisease)
router.get('/addDisease/:id/:name', diseaseController.editDisease)
router.post('/addDisease/:id/:name', diseaseController.updateDisease)
router.delete('/allDiseases/:id/:location?', diseaseController.deleteDisease)

//editor
router.get('/allEditors', editorController.allEditors)
router.get('/addEditor', editorController.addEditor)
router.post('/addEditor', editorController.upload, editorController.createEditor)
router.get('/addEditor/:id/', editorController.editEditor)
router.post('/addEditor/:id/', editorController.upload, editorController.updateEditor)
router.delete('/allEditors/:id/:location?', editorController.deleteEditor)

// reference
router.get('/allReferences', referenceController.allReferences)
router.get('/addReference', referenceController.addReference)
router.post('/addReference', referenceController.createReference)
router.get('/addReference/:id', referenceController.editReference)
router.post('/addReference/:id', referenceController.updateReference)
router.delete('/allReferences/:id/:location?', referenceController.deleteReference)

// faq
router.get('/allFaqs', faqController.allFaqs)
router.get('/addFaq', faqController.addFaq)
router.post('/addFaq', faqController.createFaq)
router.get('/addFaq/:id', faqController.editFaq)
router.post('/addFaq/:id', faqController.updateFaq)
router.delete('/allFaqs/:id/:location?', faqController.deleteFaq)

//commentSection
router.get('/allComments', labController.allComments)
router.get('/approve/:labId/:commentId', labController.approveComment)
router.get('/allApprovedComments', labController.allApprovedComments)
router.get('/delete/:labId/:commentId', labController.deleteComment)
router.get('/deleteApprovedComment/:labId/:commentId', labController.deleteApprovedComment)


router.get('/places/:place', placeController.getPlaces)
router.get('/groups/:groupName', groupController.getGroupNames)
router.get('/analysis/:analysisName', analysisController.getAnalyisisName)
router.get('/analysis/prices/:analysisName', analysisController.getAnalyisisNameResult)
router.get('/diseases/:diseaseName', diseaseController.getDiseases)
router.get('/reference/:referenceTitle', referenceController.getReferences)
router.get('/editors/:lastName', editorController.getEditors)
router.get('/lab/:lab', labController.getLab)
router.get('/cenovnik/:grad/:ids', priceController.getPrices)
router.get('/nadjiLab', priceController.getLabPrices)
// router.get('/najboljacena/:grad/:ids',priceController.getPrices )

router.get('/kontakt', generalController.sayHello)
router.post('/contact', generalController.takeUserComment)

// router.get('/group/*', (req,res) => {
//   res.status(404)
//   res.render('404page', {title:'Tražena stranica ne postoji'})
// })

//admin area
router.get('/withoutPrice', adminController.priceMissing)
router.get('/analysiswithoutprice', adminController.analysispriceMissing)
router.get('/getAllUsers', adminController.getAllUsers)
router.get('/priceAnalysis', adminController.priceAnalysis)
router.get('/minMaxPrice', adminController.minMaxPrice)
router.get('/sve-laboratorije', labController.getListOfLabs)



router.use('*', (req,res) => {
  res.status(404)
  res.render('404page', {title:'Tražena stranica ne postoji'})
})

module.exports = router
