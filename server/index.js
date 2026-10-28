// const express = require('express')
// const cors = require('cors')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
// const multer = require('multer')
// const csv = require('csv-parser')
// const fs = require('fs')
// const path = require('path')
// const db = require('./db')
// require('dotenv').config()


// const app = express()
// app.use(cors())
// app.use(express.json())
// console.log(process.env.GEMINI_API_KEY)

// const SECRET = 'expense_tracker_secret_key'
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY
// const geminiClient = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null

// function runQuery(sql, params = []) {
//   return new Promise((resolve, reject) => {
//     db.query(sql, params, (err, results) => {
//       if (err) {
//         reject(err)
//         return
//       }
//       resolve(results)
//     })
//   })
// }

// async function runOptionalQuery(sql, params = []) {
//   try {
//     return await runQuery(sql, params)
//   } catch (err) {
//     if (err && err.code === 'ER_NO_SUCH_TABLE') {
//       return []
//     }
//     throw err
//   }
// }

// // Multer setup for CSV uploads
// const upload = multer({
//   dest: 'uploads/',
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
//       cb(null, true)
//     } else {
//       cb(new Error('Only CSV files are allowed'), false)
//     }
//   },
//   limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
// })

// // ── AUTH MIDDLEWARE ────────────────────────────────────────────────────────
// function auth(req, res, next) {
//   const token = req.headers['authorization']
//   if (!token) return res.status(401).json({ error: 'No token' })
//   try {
//     const decoded = jwt.verify(token, SECRET)
//     req.userId = decoded.id
//     next()
//   } catch {
//     res.status(401).json({ error: 'Invalid token' })
//   }
// }

// // ── HELPER: Create Notification ───────────────────────────────────────────
// function createNotification(userId, message, type = 'info') {
//   db.query(
//     'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
//     [userId, message, type]
//   )
// }

// // ── HELPER: Check Budget Alerts ───────────────────────────────────────────
// function checkBudgetAlerts(userId) {
//   db.query('SELECT * FROM categories WHERE user_id = ?', [userId], (err, results) => {
//     if (err) return

//     let totalBudget = 0
//     let totalExpenses = 0

//     results.forEach((cat) => {
//       if (cat.label === 'Budget') {
//         totalBudget += parseFloat(cat.amount)
//       } else {
//         totalExpenses += parseFloat(cat.amount)
//       }
//     })

//     const percentage = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0

//     if (percentage >= 100) {
//       createNotification(userId, `⚠️ You have exceeded your budget! Expenses: ₹${totalExpenses}, Budget: ₹${totalBudget}`, 'danger')
//     } else if (percentage >= 80) {
//       createNotification(userId, `⚡ Warning: You've used ${percentage.toFixed(0)}% of your budget (₹${totalExpenses} of ₹${totalBudget})`, 'warning')
//     } else if (percentage >= 50) {
//       createNotification(userId, `📊 You've used ${percentage.toFixed(0)}% of your budget`, 'info')
//     }
//   })
// }

// // ── AUTH ROUTES ────────────────────────────────────────────────────────────

// // Register
// app.post('/api/register', (req, res) => {
//   const { username, password } = req.body
//   if (!username || !password)
//     return res.status(400).json({ error: 'Username and password required' })

//   const hashed = bcrypt.hashSync(password, 10)
//   db.query(
//     'INSERT INTO users (username, password) VALUES (?, ?)',
//     [username, hashed],
//     (err, result) => {
//       if (err) {
//         if (err.code === 'ER_DUP_ENTRY')
//           return res.status(400).json({ error: 'Username already taken' })
//         return res.status(500).json({ error: err.message })
//       }
//       const token = jwt.sign({ id: result.insertId, username }, SECRET)
//       createNotification(result.insertId, '🎉 Welcome to Expense Tracker! Start by setting your budget.', 'success')
//       res.json({ token, username })
//     }
//   )
// })

// // Login
// app.post('/api/login', (req, res) => {
//   const { username, password } = req.body
//   db.query(
//     'SELECT * FROM users WHERE username = ?',
//     [username],
//     (err, results) => {
//       if (err) return res.status(500).json({ error: err.message })
//       if (results.length === 0)
//         return res.status(400).json({ error: 'User not found' })

//       const user = results[0]
//       const match = bcrypt.compareSync(password, user.password)
//       if (!match) return res.status(400).json({ error: 'Wrong password' })

//       const token = jwt.sign({ id: user.id, username: user.username }, SECRET)
//       res.json({ token, username: user.username })
//     }
//   )
// })

// // ── NOTIFICATIONS ──────────────────────────────────────────────────────────

// // Get all notifications for user
// app.get('/api/notifications', auth, (req, res) => {
//   db.query(
//     'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
//     [req.userId],
//     (err, results) => {
//       if (err) return res.status(500).json({ error: err.message })
//       res.json(results)
//     }
//   )
// })

// // Get unread count
// app.get('/api/notifications/unread-count', auth, (req, res) => {
//   db.query(
//     'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
//     [req.userId],
//     (err, results) => {
//       if (err) return res.status(500).json({ error: err.message })
//       res.json({ count: results[0].count })
//     }
//   )
// })

// // Mark single notification as read
// app.put('/api/notifications/:id/read', auth, (req, res) => {
//   db.query(
//     'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
//     [req.params.id, req.userId],
//     (err) => {
//       if (err) return res.status(500).json({ error: err.message })
//       res.json({ success: true })
//     }
//   )
// })

// // Mark all as read
// app.put('/api/notifications/read-all', auth, (req, res) => {
//   db.query(
//     'UPDATE notifications SET is_read = TRUE WHERE user_id = ?',
//     [req.userId],
//     (err) => {
//       if (err) return res.status(500).json({ error: err.message })
//       res.json({ success: true })
//     }
//   )
// })

// // Delete a notification
// app.delete('/api/notifications/:id', auth, (req, res) => {
//   db.query(
//     'DELETE FROM notifications WHERE id = ? AND user_id = ?',
//     [req.params.id, req.userId],
//     (err) => {
//       if (err) return res.status(500).json({ error: err.message })
//       res.json({ success: true })
//     }
//   )
// })

// // ── CSV IMPORT ─────────────────────────────────────────────────────────────

// app.post('/api/import-csv', auth, upload.single('file'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No CSV file uploaded' })
//   }

//   const results = []
//   const errors = []
//   let rowNum = 0

//   fs.createReadStream(req.file.path)
//     .pipe(csv())
//     .on('data', (row) => {
//       rowNum++
//       // Expected columns: label, amount, type, category, date (optional)
//       const label = row.label || row.Label || row.description || row.Description || ''
//       const amount = parseFloat(row.amount || row.Amount || 0)
//       const type = row.type || row.Type || 'Expense'
//       const category = row.category || row.Category || 'Uncategorized'
//       const date = row.date || row.Date || row.dateCreated || null

//       if (!label.trim()) {
//         errors.push(`Row ${rowNum}: Missing label`)
//         return
//       }
//       if (isNaN(amount) || amount <= 0) {
//         errors.push(`Row ${rowNum}: Invalid amount "${row.amount || row.Amount}"`)
//         return
//       }

//       results.push({ label: label.trim(), amount, type, category, date })
//     })
//     .on('end', () => {
//       // Clean up uploaded file
//       fs.unlinkSync(req.file.path)

//       if (results.length === 0) {
//         return res.status(400).json({
//           error: 'No valid transactions found in CSV',
//           errors
//         })
//       }

//       let inserted = 0
//       let failed = 0

//       const insertPromises = results.map((item) => {
//         return new Promise((resolve) => {
//           const id = require('crypto').randomUUID()
//           const dateCreated = item.date || new Date().toISOString().split('T')[0]

//           // Insert into history
//           db.query(
//             'INSERT INTO history (id, label, amount, type, category, date_created, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
//             [id, item.label, item.amount, item.type, item.category, dateCreated, req.userId],
//             (err) => {
//               if (err) {
//                 failed++
//                 errors.push(`Failed to insert "${item.label}": ${err.message}`)
//                 resolve()
//                 return
//               }

//               // Also update categories
//               const catId = require('crypto').randomUUID()
//               const catLabel = item.type === 'Budget' ? 'Budget' : item.category
//               db.query(
//                 `INSERT INTO categories (id, label, amount, type, user_id) VALUES (?, ?, ?, ?, ?)
//                  ON DUPLICATE KEY UPDATE amount = amount + ?`,
//                 [catId, catLabel, item.amount, item.type, req.userId, item.amount],
//                 (err2) => {
//                   if (!err2) inserted++
//                   else failed++
//                   resolve()
//                 }
//               )
//             }
//           )
//         })
//       })

//       Promise.all(insertPromises).then(() => {
//         // Check budget alerts after bulk import
//         checkBudgetAlerts(req.userId)
//         createNotification(
//           req.userId,
//           `📁 CSV Import complete: ${inserted} transactions imported successfully${failed > 0 ? `, ${failed} failed` : ''}.`,
//           failed > 0 ? 'warning' : 'success'
//         )

//         res.json({
//           success: true,
//           message: `Imported ${inserted} transactions`,
//           inserted,
//           failed,
//           errors: errors.length > 0 ? errors : undefined
//         })
//       })
//     })
//     .on('error', (err) => {
//       fs.unlinkSync(req.file.path)
//       res.status(500).json({ error: 'Failed to parse CSV: ' + err.message })
//     })
// })

// // ── CATEGORIES ─────────────────────────────────────────────────────────────

// app.get('/api/categories', auth, (req, res) => {
//   db.query('SELECT * FROM categories WHERE user_id = ?', [req.userId], (err, results) => {
//     if (err) return res.status(500).json({ error: err.message })
//     res.json(results)
//   })
// })

// app.post('/api/categories', auth, (req, res) => {
//   const { id, label, amount, type } = req.body
//   const sql = `INSERT INTO categories (id, label, amount, type, user_id) VALUES (?, ?, ?, ?, ?)
//                ON DUPLICATE KEY UPDATE amount = amount + ?`
//   db.query(sql, [id, label, amount, type, req.userId, amount], (err) => {
//     if (err) return res.status(500).json({ error: err.message })
//     // Check budget alerts after adding expense
//     if (type === 'Expense') {
//       checkBudgetAlerts(req.userId)
//     }
//     res.json({ success: true })
//   })
// })

// app.delete('/api/categories/reset/:type', auth, (req, res) => {
//   const type = req.params.type
//   const condition = type === 'Budget' ? "label = 'Budget'" : "label != 'Budget'"
//   db.query(
//     `DELETE FROM categories WHERE ${condition} AND user_id = ?`,
//     [req.userId],
//     (err) => {
//       if (err) return res.status(500).json({ error: err.message })
//       res.json({ success: true })
//     }
//   )
// })

// app.delete('/api/categories/:label', auth, (req, res) => {
//   db.query(
//     'DELETE FROM categories WHERE label = ? AND user_id = ?',
//     [req.params.label, req.userId],
//     (err) => {
//       if (err) return res.status(500).json({ error: err.message })
//       res.json({ success: true })
//     }
//   )
// })

// app.put('/api/categories/subtract', auth, (req, res) => {
//   const { label, amount } = req.body
//   db.query(
//     'UPDATE categories SET amount = amount - ? WHERE label = ? AND user_id = ?',
//     [amount, label, req.userId],
//     (err) => {
//       if (err) return res.status(500).json({ error: err.message })
//       db.query(
//         'DELETE FROM categories WHERE amount <= 0 AND user_id = ?',
//         [req.userId],
//         (err2) => {
//           if (err2) return res.status(500).json({ error: err2.message })
//           res.json({ success: true })
//         }
//       )
//     }
//   )
// })

// // ── AVAILABLE CATEGORIES ───────────────────────────────────────────────────

// app.get('/api/available-categories', auth, (req, res) => {
//   db.query(
//     'SELECT * FROM available_categories WHERE user_id = ?',
//     [req.userId],
//     (err, results) => {
//       if (err) return res.status(500).json({ error: err.message })
//       if (results.length === 0) {
//         const defaults = [
//           ['Entertainment', 'Entertainment', false, req.userId],
//           ['Groceries', 'Groceries', false, req.userId],
//           ['Uncategorized', 'Uncategorized', false, req.userId],
//         ]
//         db.query(
//           'INSERT INTO available_categories (label, value, isused, user_id) VALUES ?',
//           [defaults],
//           (err2) => {
//             if (err2) return res.status(500).json({ error: err2.message })
//             db.query(
//               'SELECT * FROM available_categories WHERE user_id = ?',
//               [req.userId],
//               (err3, rows) => {
//                 if (err3) return res.status(500).json({ error: err3.message })
//                 res.json(rows)
//               }
//             )
//           }
//         )
//       } else {
//         res.json(results)
//       }
//     }
//   )
// })

// app.post('/api/available-categories', auth, (req, res) => {
//   const { label, value, isused } = req.body
//   db.query(
//     'INSERT INTO available_categories (label, value, isused, user_id) VALUES (?, ?, ?, ?)',
//     [label, value, isused, req.userId],
//     (err) => {
//       if (err) return res.status(500).json({ error: err.message })
//       res.json({ success: true })
//     }
//   )
// })

// app.put('/api/available-categories/:label', auth, (req, res) => {
//   const { isused } = req.body
//   db.query(
//     'UPDATE available_categories SET isused = ? WHERE label = ? AND user_id = ?',
//     [isused, req.params.label, req.userId],
//     (err) => {
//       if (err) return res.status(500).json({ error: err.message })
//       res.json({ success: true })
//     }
//   )
// })

// app.delete('/api/available-categories/:label', auth, (req, res) => {
//   db.query(
//     'DELETE FROM available_categories WHERE label = ? AND user_id = ?',
//     [req.params.label, req.userId],
//     (err) => {
//       if (err) return res.status(500).json({ error: err.message })
//       res.json({ success: true })
//     }
//   )
// })

// // ── HISTORY ────────────────────────────────────────────────────────────────

// app.get('/api/history', auth, (req, res) => {
//   const { month, year } = req.query
//   let sql = 'SELECT * FROM history WHERE user_id = ?'
//   let params = [req.userId]

//   if (month && year) {
//     sql += ' AND MONTH(date_created) = ? AND YEAR(date_created) = ?'
//     params.push(month, year)
//   }

//   sql += ' ORDER BY date_created DESC'
//   db.query(sql, params, (err, results) => {
//     if (err) return res.status(500).json({ error: err.message })
//     res.json(results)
//   })
// })

// app.post('/api/history', auth, (req, res) => {
//   const { id, label, amount, type, category, dateCreated } = req.body
//   db.query(
//     'INSERT INTO history (id, label, amount, type, category, date_created, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
//     [id, label, amount, type, category, dateCreated, req.userId],
//     (err) => {
//       if (err) return res.status(500).json({ error: err.message })
//       res.json({ success: true })
//     }
//   )
// })

// app.delete('/api/history/:id', auth, (req, res) => {
//   db.query(
//     'DELETE FROM history WHERE id = ? AND user_id = ?',
//     [req.params.id, req.userId],
//     (err) => {
//       if (err) return res.status(500).json({ error: err.message })
//       res.json({ success: true })
//     }
//   )
// })

// // ── AI ASSISTANT ────────────────────────────────────────────────────────────
// app.post('/api/ai-query', auth, async (req, res) => {
//   const { question } = req.body

//   if (!question || typeof question !== 'string' || !question.trim()) {
//     return res.status(400).json({ error: 'A valid question is required.' })
//   }

//   if (!geminiClient) {
//     return res.status(500).json({
//       error: 'AI assistant is not configured. Please set GEMINI_API_KEY in server .env.',
//     })
//   }

//   try {
//     const [userRows, historyRows, expenseRows, categoryRows, budgetRows] = await Promise.all([
//       runQuery('SELECT id, username FROM users WHERE id = ?', [req.userId]),
//       runOptionalQuery(
//         'SELECT id, label, amount, type, category, date_created FROM history WHERE user_id = ? ORDER BY date_created DESC LIMIT 500',
//         [req.userId]
//       ),
//       runOptionalQuery(
//         'SELECT id, label, amount, type, category, date_created FROM expenses WHERE user_id = ? ORDER BY date_created DESC LIMIT 500',
//         [req.userId]
//       ),
//       runOptionalQuery(
//         "SELECT id, label, amount, type FROM categories WHERE user_id = ? AND label != 'Budget'",
//         [req.userId]
//       ),
//       runOptionalQuery(
//         'SELECT id, name, amount, period, start_date, end_date FROM budgets WHERE user_id = ?',
//         [req.userId]
//       ),
//     ])

//     const userData = {
//       user: userRows[0] || { id: req.userId },
//       history: historyRows,
//       expenses: expenseRows,
//       categories: categoryRows,
//       budgets: budgetRows,
//     }

//     const model = geminiClient.getGenerativeModel({ model: 'gemini-1.5-flash' })
//     const prompt = [
//       'You are a financial assistant. Based on the following user expense data, answer the question clearly and accurately.',
//       'If data is missing or insufficient, explicitly say so and avoid making up values.',
//       `User Question: ${question.trim()}`,
//       `Expense Data JSON: ${JSON.stringify(userData)}`,
//     ].join('\n\n')

//     //const result = await model.generateContent(prompt)
//     //const answer = result.response.text().trim()
//     const result = await model.generateContent(prompt)

// // safer extraction
// const response = result.response
// const answer =
//   response?.candidates?.[0]?.content?.parts?.[0]?.text ||
//   response?.text?.() ||
//   "No response from AI"


//     if (!answer) {
//       return res.status(502).json({ error: 'AI assistant returned an empty response.' })
//     }

//     res.json({ answer })
//   } catch (err) {
//     console.error('AI query failed:', err)
//     res.status(500).json({ error: 'Failed to process AI query.' })
//   }
// })

// // ── START SERVER ───────────────────────────────────────────────────────────
// app.listen(5000, () => {
//   console.log('✅ Server running on http://localhost:5000')
// })




const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const csv = require('csv-parser')
const fs = require('fs')
const path = require('path')
const { GoogleGenerativeAI } = require('@google/generative-ai')
const db = require('./db')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const SECRET = 'expense_tracker_secret_key'
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const geminiClient = GEMINI_API_KEY
  ? new GoogleGenerativeAI(GEMINI_API_KEY)
  : null

// ── HELPERS ───────────────────────────────────────
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err)
      resolve(results)
    })
  })
}

function extractGeminiText(result) {
  const response = result?.response
  if (!response) throw new Error('Empty AI response from model.')

  try {
    const t = response.text()
    if (t && String(t).trim()) return String(t).trim()
  } catch {
    // response.text() throws when there are no candidates (e.g. blocked)
  }

  const parts = response.candidates?.[0]?.content?.parts
  if (Array.isArray(parts)) {
    const joined = parts.map((p) => p?.text).filter(Boolean).join('\n').trim()
    if (joined) return joined
  }

  const block = response.promptFeedback?.blockReason
  if (block) throw new Error(`Request blocked: ${block}`)

  throw new Error('Model returned no text. Try rephrasing your question.')
}

async function generateWithGemini(prompt) {
  const preferred = (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim()
  const fallbacks = ['gemini-flash-latest', 'gemini-2.5-flash-lite', 'gemini-2.0-flash']
  const models = [preferred, ...fallbacks.filter((m) => m && m !== preferred)]

  let lastErr
  for (const modelName of models) {
    try {
      const model = geminiClient.getGenerativeModel({ model: modelName })
      const result = await model.generateContent(prompt)
      const answer = extractGeminiText(result)
      return { answer, modelUsed: modelName }
    } catch (e) {
      lastErr = e
      console.warn(`Gemini model "${modelName}" failed:`, e?.message || e)
    }
  }
  throw lastErr
}

// ── AUTH MIDDLEWARE ───────────────────────────────
function auth(req, res, next) {
  const token = req.headers['authorization']
  if (!token) return res.status(401).json({ error: 'No token' })
  try {
    const decoded = jwt.verify(token, SECRET)
    req.userId = decoded.id
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// ── AUTH ROUTES ───────────────────────────────────
app.post('/api/register', (req, res) => {
  const { username, password } = req.body
  const hashed = bcrypt.hashSync(password, 10)

  db.query(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hashed],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message })

      const token = jwt.sign({ id: result.insertId }, SECRET)
      res.json({ token, username })
    }
  )
})

app.post('/api/login', (req, res) => {
  const { username, password } = req.body

  db.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    (err, results) => {
      if (results.length === 0)
        return res.status(400).json({ error: 'User not found' })

      const user = results[0]
      const match = bcrypt.compareSync(password, user.password)

      if (!match)
        return res.status(400).json({ error: 'Wrong password' })

      const token = jwt.sign({ id: user.id }, SECRET)
      res.json({ token, username })
    }
  )
})

// ── CSV IMPORT ────────────────────────────────────
const upload = multer({ dest: 'uploads/' })

app.post('/api/import-csv', auth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' })

  const results = []

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => results.push(row))
    .on('end', () => {
      fs.unlinkSync(req.file.path)

      results.forEach((r) => {
        const id = require('crypto').randomUUID()
        db.query(
          'INSERT INTO history (id, label, amount, type, category, date_created, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            id,
            r.label,
            r.amount,
            r.type,
            r.category,
            r.date || new Date(),
            req.userId,
          ]
        )
      })

      res.json({ success: true, inserted: results.length })
    })
})

// ── HISTORY ───────────────────────────────────────
app.get('/api/history', auth, (req, res) => {
  db.query(
    'SELECT * FROM history WHERE user_id = ? ORDER BY date_created DESC',
    [req.userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json(results)
    }
  )
})

// ── CATEGORIES ────────────────────────────────────
app.get('/api/categories', auth, (req, res) => {
  db.query(
    'SELECT * FROM categories WHERE user_id = ?',
    [req.userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json(results)
    }
  )
})

// ── AI ASSISTANT (FIXED) ──────────────────────────
app.post('/api/ai-query', auth, async (req, res) => {
  const { question } = req.body

  if (!question) {
    return res.status(400).json({ error: 'Question required' })
  }

  if (!geminiClient) {
    return res.status(500).json({
      error: 'Gemini API key not configured',
    })
  }

  try {
    const history = await runQuery(
      'SELECT label, amount, type, category, date_created FROM history WHERE user_id = ?',
      [req.userId]
    )

    const categories = await runQuery(
      'SELECT label, amount, type FROM categories WHERE user_id = ?',
      [req.userId]
    )

    const prompt = `
You are a financial assistant. Based on the following user expense data, answer the question clearly and accurately.
Use only the data provided. If something cannot be determined from the data, say so. Do not invent amounts or dates.

User Question: ${JSON.stringify(String(question).trim())}

History:
${JSON.stringify(history)}

Categories:
${JSON.stringify(categories)}
`

    const { answer } = await generateWithGemini(prompt)
    res.json({ answer })
  } catch (err) {
    console.error('❌ Gemini / AI query error:', err)
    const msg = err?.message || String(err)
    const clientMsg =
      msg.length > 0 && msg.length < 280
        ? msg
        : 'Failed to process AI query. Check server logs and GEMINI_MODEL / API key in server .env.'
    res.status(500).json({ error: clientMsg })
  }
})

// ── SERVER ────────────────────────────────────────
app.listen(5000, () => {
  console.log('✅ Server running on http://localhost:5000')
})