// simple express web server

import express from 'express'

const app = express()

// serve static files from the 'dist' directory
const pubDir = __dirname + '/../../dist'
console.log('pubDir', pubDir)
app.use(express.static(pubDir))

app.get('/', (req, res) => {
    res.sendFile(pubDir + '/index.html')
})

// start the server
const port = 3001
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
