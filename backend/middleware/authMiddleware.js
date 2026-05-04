import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

/**
 * Verify JWT from `Authorization: Bearer <token>` and attach `req.user`:
 * `{ id, role }` from the decoded payload (set when the token was signed on the server).
 */
export function protect(req, res, next) {
  if (!JWT_SECRET) {
    return res.status(500).json({ msg: 'Server misconfiguration (JWT_SECRET missing)' })
  }

  const raw = req.headers.authorization
  if (!raw || !raw.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Not authorized' })
  }

  const token = raw.slice(7).trim()
  if (!token) {
    return res.status(401).json({ msg: 'Not authorized' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const id = decoded.id ?? decoded.userId ?? decoded.sub
    const role = decoded.role != null ? String(decoded.role).toLowerCase() : undefined

    if (id == null || role == null) {
      return res.status(401).json({ msg: 'Not authorized' })
    }

    req.user = { id, role }
    next()
  } catch {
    return res.status(401).json({ msg: 'Not authorized' })
  }
}

/**
 * Must run after `protect`. Only `"admin"` (from verified JWT payload) may continue.
 */
export function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ msg: 'Not authorized' })
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admin access only' })
  }

  next()
}
