import express from 'express'
import { readFileBuffer } from 'functions/files'
import { optimize } from 'functions/images'
import { multer, renameFilesToChecksum } from 'middlewares/files'

const router = express.Router()

router.put('/image', multer, renameFilesToChecksum, (req, res) => {
  res.send(req.files)
})

router.get('/:fileName', async (req, res, next) => {
  try {
    const fileName: string = req.params.fileName
    const fileBuffer = await readFileBuffer(fileName)

    if (!fileBuffer) {
      return res.status(404).send({
        code: 404,
        message: 'File not found',
      })
    }

    const optimizedFile = optimize(fileBuffer, req.query)

    res
      .header('Cache-Control', 'public, max-age=31536000')
      .contentType('image/*')
      .send(await optimizedFile.toBuffer())
  } catch (err) {
    throw err
  }
})

export default router