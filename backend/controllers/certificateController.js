const Certificate = require('../models/Certificate')

const getCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find().sort({ order: 1, createdAt: -1 })
    res.status(200).json(certs)
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
}

const createCertificate = async (req, res) => {
  try {
    const cert = await Certificate.create(req.body)
    res.status(201).json(cert)
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message })
  }
}

const updateCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    )
    if (!cert) return res.status(404).json({ message: 'Certificate not found' })
    res.status(200).json(cert)
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message })
  }
}

const deleteCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findByIdAndDelete(req.params.id)
    if (!cert) return res.status(404).json({ message: 'Certificate not found' })
    res.status(200).json({ message: 'Deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
}

module.exports = { getCertificates, createCertificate, updateCertificate, deleteCertificate }