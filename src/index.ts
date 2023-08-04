import api from '@/api'

const port = 8080 //process.env.PORT
console.log(`port: ${port}`)
api.listen(port, () => console.log(`Octo Events API running on port ${port}`))
