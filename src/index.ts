import api from '@/api'

const port = process.env.PORT
api.listen(port, () => console.log(`Octo Events API running on port ${port}`))
