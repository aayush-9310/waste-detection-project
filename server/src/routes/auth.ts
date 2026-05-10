import express from 'express'
import jwt from 'jsonwebtoken'

const router = express.Router()

// hardcoded admin credentials for now
const ADMIN_EMAIL = 'admin@gmail.com'
const ADMIN_PASSWORD = 'admin1234'

router.post('/login', (req, res) => {
    const { email, password } = req.body

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        res.status(401).json({ error: 'Invalid credentials' })
        return
    }

    const token = jwt.sign(
        { role: 'admin' },
        process.env.JWT_SECRET!,
        { expiresIn: '1d' }
    )

    res.json({ token })
})

export default router