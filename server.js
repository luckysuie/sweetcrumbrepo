import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const distDir = path.join(__dirname, 'dist')

app.use(
  express.static(distDir, {
    fallthrough: true,
    index: false,
    maxAge: '1h',
  }),
)

// SPA fallback (React Router)
app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'))
})

const port = Number(process.env.PORT ?? 8080)
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`)
})

