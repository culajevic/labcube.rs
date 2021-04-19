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
const passport = require('passport')

// display groups on front page
router.get('/', groupController.getGroups)
// router.get('/', labController.getAllLabs)

//display single group
router.get('/group/:slug', groupController.displayGroup)

//display about us
router.get('/o-nama/', generalController.aboutus)
router.get('/politika-privatnosti/', generalController.privacy)
router.get('/uslovi-koriscenja/', generalController.terms)

// searchfor lab or analysis
router.get('/results/', resultController.displayResults)
router.get('/results/analysis/:slug', resultController.displayAnalysisDetails)


//registration
router.get('/prijava', authenticationController.signin)
router.post('/prijava', authenticationController.login)
router.get('/google', authenticationController.google)
router.get('/logout', authenticationController.logout)
router.get('/google/redirect', authenticationController.redirect)
router.get('/profile', authenticationController.profile)
router.get('/profile/page/:page', authenticationController.profile)

router.get('/users/:userEmail?', authenticationController.findUserEmail)
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

// groups
router.get('/allGroupsList', groupController.listAllGroups)
router.get('/addGroup', groupController.addGroup)
router.post('/addGroup', groupController.upload, groupController.createGroup)
router.get('/addGroup/:name', groupController.editGroup)
router.post('/addGroup/:name', groupController.upload, groupController.updateGroup)
router.delete('/allGroupsList/:id', groupController.deleteGroup)

//tumacenje rezultata
router.get('/tumacenje-laboratorijskih-analiza', resultController.labRestultsAnalysis)
router.post('/tumacenje-laboratorijskih-analiza', resultController.upload, resultController.labResult)

//prices
router.get('/allPrices', priceController.allPrices)
router.get('/addPrice', priceController.addPrice)
router.post('/addPrice', priceController.createPrice)
router.get('/addPrice/:id', priceController.editPrice)
router.post('/addPrice/:id', priceController.updatePrice)
router.delete('/allPrices/:id', priceController.deletePriceList)

// router.get('/schedule/:labId/:analysis/:userId/:total', scheduleController.scheduleVisit)
// router.get('/schedule/:scheduleString', scheduleController.scheduleVisit)
router.post('/schedule', scheduleController.scheduleVisit)
router.get('/hvala', scheduleController.thankyou)
router.post('/updateSchedule/:scheduleId', scheduleController.updateSchedule)
//healthProfile
router.post('/healthProfile/:id', profileController.updateHealthProfile)
router.post('/myProfile/:id', profileController.updateProfile)
router.get('/interpretation/page/:page', scheduleController.resultsInterpretation)
router.get('/interpretation/:id', scheduleController.resultsInterpretationValues)
router.post('/analysisInterpretation/:id', scheduleController.analysisInterpretation)
router.post('/lockTheInterpretation', scheduleController.lockTheInterpretation)
// router.get('/profile', profileController.getMyAppointments)

// labs
router.get('/allLabs', labController.allLabs)
router.get('/addLab', labController.addLab)
router.post('/addLab', labController.upload, labController.createLab)
router.get('/addLab/:id/:name', labController.editLab)
router.post('/addLab/:id/:name',labController.upload, labController.updateLab)
router.delete('/allLabs/:id', labController.deleteLab)
router.get('/laboratorija/:slug/:ids?', labController.getLabInfo)
// router.get('/laboratorija/:analysisName', labController.getLabInfo)
router.get('/search/analysis/:analysisName/:labSlug', labController.getAdditionalAnalysis)
// router.post('/laboratorija/:slug/:ids*', labController.getLabInfoAnalysis)



// analysis
router.get('/allAnalysis', analysisController.allAnalysis)
router.get('/addAnalysis', analysisController.addAnalysis)
router.post('/addAnalysis', analysisController.createAnalysis)
router.get('/addAnalysis/:id', analysisController.editAnalysis)
router.post('/addAnalysis/:id/:name', analysisController.updateAnalysis)
router.delete('/allAnalysis/:id', analysisController.deleteAnalysis)

//disease
router.get('/allDiseases', diseaseController.allDiseases)
router.get('/addDisease', diseaseController.addDisease)
router.post('/addDisease', diseaseController.createDisease)
router.get('/addDisease/:id/:name', diseaseController.editDisease)
router.post('/addDisease/:id/:name', diseaseController.updateDisease)
router.delete('/allDiseases/:id', diseaseController.deleteDisease)

//editor
router.get('/allEditors', editorController.allEditors)
router.get('/addEditor', editorController.addEditor)
router.post('/addEditor', editorController.upload, editorController.createEditor)
router.get('/addEditor/:id/', editorController.editEditor)
router.post('/addEditor/:id/', editorController.upload, editorController.updateEditor)
router.delete('/allEditors/:id', editorController.deleteEditor)

// reference
router.get('/allReferences', referenceController.allReferences)
router.get('/addReference', referenceController.addReference)
router.post('/addReference', referenceController.createReference)
router.get('/addReference/:id', referenceController.editReference)
router.post('/addReference/:id', referenceController.updateReference)
router.delete('/allReferences/:id', referenceController.deleteReference)

// faq
router.get('/allFaqs', faqController.allFaqs)
router.get('/addFaq', faqController.addFaq)
router.post('/addFaq', faqController.createFaq)
router.get('/addFaq/:id', faqController.editFaq)
router.post('/addFaq/:id', faqController.updateFaq)
router.delete('/allFaqs/:id', faqController.deleteFaq)

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

module.exports = router
