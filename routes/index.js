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


// display groups on front page
router.get('/', groupController.getGroups)

//display single group
router.get('/details/:name', groupController.displayGroup)

// groups
router.get('/allGroupsList', groupController.listAllGroups)
router.get('/addGroup', groupController.addGroup)
router.post('/addGroup', groupController.upload, groupController.createGroup)
router.get('/addGroup/:name', groupController.editGroup)
router.post('/addGroup/:name', groupController.upload, groupController.updateGroup)
router.delete('/allGroupsList/:id', groupController.deleteGroup)

// labs
router.get('/allLabs', labController.allLabs)
router.get('/addLab', labController.addLab)
router.post('/addLab', labController.upload, labController.createLab)
router.get('/addLab/:id/:name', labController.editLab)
router.post('/addLab/:id/:name',labController.upload, labController.updateLab)
router.delete('/allLabs/:id', labController.deleteLab)

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
router.post('/addEditor', editorController.createEditor)
router.get('/addEditor/:id/', editorController.editEditor)
router.post('/addEditor/:id/', editorController.updateEditor)
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
router.get('/diseases/:diseaseName', diseaseController.getDiseases)
router.get('/reference/:referenceTitle', referenceController.getReferences)
router.get('/editors/:lastName', editorController.getEditors)

module.exports = router
