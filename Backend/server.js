const express = require('express')
const cors = require('cors')
const multer = require('multer')
const { createClient } = require('@supabase/supabase-js')
const { v4: uuidv4 } = require('uuid')

const app = express()
app.use(cors())
app.use(express.json())

const supabaseUrl = "https://xyqlnxrzhoucfagoglgr.supabase.co"
const supabaseKey = "YOUR_SUPABASE_KEY"
const supabase = createClient(supabaseUrl, supabaseKey)

const storage = multer.memoryStorage()
const upload = multer({ storage })

const fileStore = {}

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file
    const password = req.body.password

    if (!file || !password)
      return res.status(400).json({ detail: 'File and password required' })

    const shareId = uuidv4().slice(0, 8)
    const fileName = `${shareId}_${file.originalname}`

    const { error } = await supabase.storage.from('files').upload(fileName, file.buffer)
    if (error) return res.status(500).json({ detail: 'Upload failed', error })

    fileStore[shareId] = { fileName, password }

    setTimeout(async () => {
      try {
        await supabase.storage.from('files').remove([fileName])
        delete fileStore[shareId]
        console.log(`File ${fileName} expired and deleted`)
      } catch (err) {
        console.error('Error deleting expired file:', err)
      }
    }, 60 * 1000)

    return res.json({ shareId })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ detail: 'Server error', error: err.message })
  }
})

app.post('/download', async (req, res) => {
  try {
    const { shareId, password } = req.body
    if (!shareId || !password)
      return res.status(400).json({ detail: 'shareId and password required' })

    const fileData = fileStore[shareId]
    if (!fileData) return res.status(404).json({ detail: 'File not found or expired' })
    if (fileData.password !== password)
      return res.status(401).json({ detail: 'Invalid password' })

    const { data: signedData, error: signedError } = await supabase.storage
      .from('files')
      .createSignedUrl(fileData.fileName, 3600)

    if (signedError) return res.status(500).json({ detail: 'Signed URL error', error: signedError })

    return res.json({ downloadUrl: signedData.signedUrl })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ detail: 'Server error', error: err.message })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
