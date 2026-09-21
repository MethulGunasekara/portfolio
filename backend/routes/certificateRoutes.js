const express = require('express')
const router = express.Router()
const { getCertificates, createCertificate, updateCertificate, deleteCertificate } = require('../controllers/certificateController')
const { protect } = require('../middleware/authMiddleware')

router.route('/')
  .get(getCertificates)
  .post(protect, createCertificate)

router.route('/:id')
  .put(protect, updateCertificate)
  .delete(protect, deleteCertificate)

module.exports = router