// ================================================================
// index.js — Express Server & API Router for Sri Srinivasa Medicals
// ================================================================
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const pool = require("./db");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS — allow configurable origin for production (Vercel domain)
app.use(cors({
  origin: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Body parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Configure local media directories
const mediaPath = path.resolve(__dirname, process.env.MEDIA_PATH || "./media");
const productsUploadDir = path.join(mediaPath, "products");
const prescriptionsUploadDir = path.join(mediaPath, "prescriptions");

// Ensure directories exist
fs.mkdirSync(productsUploadDir, { recursive: true });
fs.mkdirSync(prescriptionsUploadDir, { recursive: true });

// Static assets: serve media files
app.use("/media", express.static(mediaPath));

// ── Multer Storage Configurations ──
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productsUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const id = req.params.id || "temp";
    // Sanitize filename or just use timestamp
    cb(null, `prod-${id}-${Date.now()}${ext}`);
  },
});

const prescriptionStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, prescriptionsUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const rand = Math.random().toString(36).slice(2, 10);
    cb(null, `rx-${Date.now()}-${rand}${ext}`);
  },
});

const uploadProductImage = multer({
  storage: productStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPG, PNG, and WEBP are allowed."));
    }
  },
});

const uploadPrescriptionFiles = multer({
  storage: prescriptionStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Prescriptions can be images or PDFs
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPG, PNG, WEBP, and PDF are allowed."));
    }
  },
});

// Helper to format database objects to frontend structures
function mapUser(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    isActive: !!u.is_active,
    createdAt: u.created_at,
  };
}

function mapProduct(p) {
  return {
    id: p.id,
    sku: p.sku,
    name: p.name,
    category: p.category_slug,
    description: p.description,
    manufacturer: p.manufacturer,
    price: p.price !== null ? parseFloat(p.price) : null,
    mrp: p.mrp !== null ? parseFloat(p.mrp) : null,
    stockQuantity: p.stock_quantity,
    availabilityStatus: p.availability_status,
    imageDataUrl: p.image_url,
    imageSourceType: p.image_source_type,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

// ────────────────────────────────────────────────────────────────
// API ROUTES: Categories
// ────────────────────────────────────────────────────────────────
app.get("/api/categories", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories ORDER BY id ASC");
    res.json(rows.map(r => ({
      slug: r.slug,
      name: r.name,
      desc: r.description,
      color: r.color,
      showStock: !!r.show_stock
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/categories", async (req, res) => {
  const { slug, name, desc, color, showStock } = req.body;
  if (!slug || !name) {
    return res.status(400).json({ error: "Slug and Name are required." });
  }
  try {
    await pool.execute(
      "INSERT INTO categories (slug, name, description, color, show_stock) VALUES (?, ?, ?, ?, ?)",
      [slug, name, desc || "", color || "", showStock ? 1 : 0]
    );
    res.status(201).json({ slug, name, desc, color, showStock });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ────────────────────────────────────────────────────────────────
// API ROUTES: Products
// ────────────────────────────────────────────────────────────────
app.get("/api/products", async (req, res) => {
  try {
    const { search, category, page, limit } = req.query;
    
    let query = "SELECT * FROM products WHERE 1=1";
    let countQuery = "SELECT COUNT(*) as total FROM products WHERE 1=1";
    const params = [];
    
    if (category) {
      query += " AND category_slug = ?";
      countQuery += " AND category_slug = ?";
      params.push(category);
    }
    
    if (search) {
      query += " AND (name LIKE ? OR sku LIKE ? OR manufacturer LIKE ? OR category_slug LIKE ?)";
      countQuery += " AND (name LIKE ? OR sku LIKE ? OR manufacturer LIKE ? OR category_slug LIKE ?)";
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam);
    }
    
    query += " ORDER BY created_at DESC";
    
    if (page && limit) {
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const offset = (pageNum - 1) * limitNum;
      
      const [countRows] = await pool.query(countQuery, params);
      const total = countRows[0].total;
      
      query += " LIMIT ? OFFSET ?";
      params.push(limitNum, offset);
      
      const [rows] = await pool.query(query, params);
      res.json({
        products: rows.map(mapProduct),
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum)
      });
    } else {
      const [rows] = await pool.query(query, params);
      res.json(rows.map(mapProduct));
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json(mapProduct(rows[0]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/products", async (req, res) => {
  const { id, sku, name, category, description, manufacturer, price, mrp, stockQuantity, availabilityStatus, imageDataUrl, imageSourceType } = req.body;
  if (!name || !category) {
    return res.status(400).json({ error: "Name and Category are required." });
  }

  const generatedId = id || "p-" + Math.random().toString(36).slice(2, 10);
  
  let finalSku = sku;
  if (!finalSku) {
    const prefixMap = {
      "ethical-brand": "ETH",
      "generic": "GEN",
      "paediatric": "PED",
      "paediatrician": "PDN",
      "surgical": "SUR",
      "personal-care": "PER",
      "baby-care": "BAB"
    };
    const prefix = prefixMap[category] || "PRD";
    const rand = Math.floor(1000 + Math.random() * 9000);
    finalSku = `${prefix}-${rand}`;
  }

  try {
    await pool.execute(
      `INSERT INTO products (id, sku, name, category_slug, description, manufacturer, price, mrp, stock_quantity, availability_status, image_url, image_source_type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        generatedId, finalSku, name, category, description || "", manufacturer || "",
        price !== undefined ? price : null,
        mrp !== undefined ? mrp : null,
        stockQuantity !== undefined ? stockQuantity : null,
        availabilityStatus !== undefined ? availabilityStatus : null,
        imageDataUrl || null,
        imageSourceType || null
      ]
    );

    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [generatedId]);
    res.status(201).json(mapProduct(rows[0]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/products/:id", async (req, res) => {
  const { sku, name, category, description, manufacturer, price, mrp, stockQuantity, availabilityStatus, imageDataUrl, imageSourceType } = req.body;
  const productId = req.params.id;

  try {
    const [existing] = await pool.query("SELECT * FROM products WHERE id = ?", [productId]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    await pool.execute(
      `UPDATE products SET sku = ?, name = ?, category_slug = ?, description = ?, manufacturer = ?, price = ?, mrp = ?, stock_quantity = ?, availability_status = ?, image_url = ?, image_source_type = ?
       WHERE id = ?`,
      [
        sku !== undefined ? sku : existing[0].sku,
        name !== undefined ? name : existing[0].name,
        category !== undefined ? category : existing[0].category_slug,
        description !== undefined ? description : existing[0].description,
        manufacturer !== undefined ? manufacturer : existing[0].manufacturer,
        price !== undefined ? price : existing[0].price,
        mrp !== undefined ? mrp : existing[0].mrp,
        stockQuantity !== undefined ? stockQuantity : existing[0].stock_quantity,
        availabilityStatus !== undefined ? availabilityStatus : existing[0].availability_status,
        imageDataUrl !== undefined ? imageDataUrl : existing[0].image_url,
        imageSourceType !== undefined ? imageSourceType : existing[0].image_source_type,
        productId
      ]
    );

    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [productId]);
    res.json(mapProduct(rows[0]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload Product Image Endpoint
app.post("/api/products/:id/image", uploadProductImage.single("image"), async (req, res) => {
  const productId = req.params.id;
  if (!req.file) {
    return res.status(400).json({ error: "No image file uploaded." });
  }

  // Generate web path for public retrieval
  const relativePath = `media/products/${req.file.filename}`;
  const absoluteUrl = `/${relativePath}`;

  try {
    const [existing] = await pool.query("SELECT * FROM products WHERE id = ?", [productId]);
    if (existing.length === 0) {
      // Remove file if product does not exist
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: "Product not found." });
    }

    // Clean up old uploaded image file if one existed
    const oldUrl = existing[0].image_url;
    if (oldUrl && oldUrl.startsWith("/media/products/")) {
      const oldPath = path.join(mediaPath, "products", path.basename(oldUrl));
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (e) {
          console.error("Could not delete old image file:", e.message);
        }
      }
    }

    await pool.execute(
      "UPDATE products SET image_url = ?, image_source_type = 'UPLOAD' WHERE id = ?",
      [absoluteUrl, productId]
    );

    res.json({ imageUrl: absoluteUrl, imageSourceType: "UPLOAD" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/products/:id/image", async (req, res) => {
  const productId = req.params.id;
  try {
    const [existing] = await pool.query("SELECT * FROM products WHERE id = ?", [productId]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    const oldUrl = existing[0].image_url;
    if (oldUrl && oldUrl.startsWith("/media/products/")) {
      const oldPath = path.join(mediaPath, "products", path.basename(oldUrl));
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (e) {
          console.error("Could not delete image file:", e.message);
        }
      }
    }

    await pool.execute(
      "UPDATE products SET image_url = NULL, image_source_type = NULL WHERE id = ?",
      [productId]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const [existing] = await pool.query("SELECT * FROM products WHERE id = ?", [productId]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Clean up product image file
    const oldUrl = existing[0].image_url;
    if (oldUrl && oldUrl.startsWith("/media/products/")) {
      const oldPath = path.join(mediaPath, "products", path.basename(oldUrl));
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (e) {
          console.error("Could not delete image file:", e.message);
        }
      }
    }

    await pool.execute("DELETE FROM products WHERE id = ?", [productId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ────────────────────────────────────────────────────────────────
// API ROUTES: Authentication & User Management
// ────────────────────────────────────────────────────────────────
app.post("/api/admin/sync-users", async (req, res) => {
  const users = req.body;
  if (!Array.isArray(users)) return res.status(400).json({ error: "Invalid data" });
  
  try {
    for (const u of users) {
      await pool.execute(
        `INSERT INTO users (id, name, email, phone, password_hash, role, is_active, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=?, phone=?, password_hash=?, role=?, is_active=?`,
        [u.id, u.name, u.email, u.phone, u.password_hash, u.role, u.is_active, u.created_at,
         u.name, u.phone, u.password_hash, u.role, u.is_active]
      );
    }
    res.json({ success: true, synced: users.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/register", async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  try {
    const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    const id = "user-" + Math.random().toString(36).slice(2, 10);
    const hash = await bcrypt.hash(password, 10);

    await pool.execute(
      "INSERT INTO users (id, name, email, phone, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?, 'customer', 1)",
      [id, name, email, phone || "", hash]
    );

    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    res.status(201).json(mapUser(rows[0]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: "This account has been disabled." });
    }

    res.json(mapUser(user));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/auth/change-password", async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ error: "Email, current password, and new password are required." });
  }

  try {
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const user = users[0];
    const match = await bcrypt.compare(currentPassword, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Current password is incorrect." });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: "New password must be at least 8 characters." });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.execute("UPDATE users SET password_hash = ? WHERE email = ?", [newHash, email]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    // Only return customers
    const [rows] = await pool.query("SELECT * FROM users WHERE role = 'customer' ORDER BY created_at DESC");
    res.json(rows.map(mapUser));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/users/:id/toggle", async (req, res) => {
  try {
    const [existing] = await pool.query("SELECT * FROM users WHERE id = ?", [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const nextState = existing[0].is_active ? 0 : 1;
    await pool.execute("UPDATE users SET is_active = ? WHERE id = ?", [nextState, req.params.id]);

    res.json({ success: true, isActive: !!nextState });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ────────────────────────────────────────────────────────────────
// API ROUTES: Prescriptions
// ────────────────────────────────────────────────────────────────
app.get("/api/prescriptions", async (req, res) => {
  try {
    const [rxRows] = await pool.query("SELECT * FROM prescriptions ORDER BY created_at DESC");
    if (rxRows.length === 0) return res.json([]);

    const [fileRows] = await pool.query("SELECT * FROM prescription_files");

    const result = rxRows.map(rx => {
      const files = fileRows
        .filter(f => f.prescription_id === rx.id)
        .map(f => ({
          name: f.original_name,
          size: parseInt(f.file_size, 10),
          type: f.mime_type,
          dataUrl: f.stored_path, // stored path can be static /media/prescriptions/filename
        }));

      return {
        id: rx.id,
        userId: rx.user_id || undefined,
        name: rx.name,
        phone: rx.phone,
        notes: rx.notes || "",
        files,
        status: rx.status,
        adminNotes: rx.admin_notes || undefined,
        createdAt: rx.created_at,
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/prescriptions/user/:userId", async (req, res) => {
  try {
    const [rxRows] = await pool.query(
      "SELECT * FROM prescriptions WHERE user_id = ? ORDER BY created_at DESC",
      [req.params.userId]
    );
    if (rxRows.length === 0) return res.json([]);

    const rxIds = rxRows.map(r => r.id);
    const [fileRows] = await pool.query(
      `SELECT * FROM prescription_files WHERE prescription_id IN (${rxIds.map(() => "?").join(",")})`,
      rxIds
    );

    const result = rxRows.map(rx => {
      const files = fileRows
        .filter(f => f.prescription_id === rx.id)
        .map(f => ({
          name: f.original_name,
          size: parseInt(f.file_size, 10),
          type: f.mime_type,
          dataUrl: f.stored_path,
        }));

      return {
        id: rx.id,
        userId: rx.user_id || undefined,
        name: rx.name,
        phone: rx.phone,
        notes: rx.notes || "",
        files,
        status: rx.status,
        adminNotes: rx.admin_notes || undefined,
        createdAt: rx.created_at,
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Multipart POST endpoint to upload prescription and its attachments
app.post("/api/prescriptions", uploadPrescriptionFiles.array("files", 10), async (req, res) => {
  const { userId, name, phone, notes } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: "Name and phone are required." });
  }

  const rxId = "RX" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const dbUserId = userId && userId !== "undefined" && userId !== "null" ? userId : null;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.execute(
      `INSERT INTO prescriptions (id, user_id, name, phone, notes, status)
       VALUES (?, ?, ?, ?, ?, 'Pending')`,
      [rxId, dbUserId, name, phone, notes || ""]
    );

    const uploadedFiles = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const relativePath = `/media/prescriptions/${file.filename}`;
        await connection.execute(
          `INSERT INTO prescription_files (prescription_id, original_name, stored_path, mime_type, file_size)
           VALUES (?, ?, ?, ?, ?)`,
          [rxId, file.originalname, relativePath, file.mimetype, file.size]
        );
        uploadedFiles.push({
          name: file.originalname,
          size: file.size,
          type: file.mimetype,
          dataUrl: relativePath,
        });
      }
    }

    await connection.commit();

    const [newRx] = await connection.query("SELECT * FROM prescriptions WHERE id = ?", [rxId]);
    res.status(201).json({
      id: newRx[0].id,
      userId: newRx[0].user_id || undefined,
      name: newRx[0].name,
      phone: newRx[0].phone,
      notes: newRx[0].notes || "",
      files: uploadedFiles,
      status: newRx[0].status,
      createdAt: newRx[0].created_at,
    });
  } catch (error) {
    await connection.rollback();
    // Clean up uploaded files on failure
    if (req.files) {
      req.files.forEach(f => {
        if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
      });
    }
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

app.put("/api/prescriptions/:id/status", async (req, res) => {
  const { status, adminNotes } = req.body;
  if (!status) {
    return res.status(400).json({ error: "Status is required." });
  }

  try {
    const [existing] = await pool.query("SELECT * FROM prescriptions WHERE id = ?", [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Prescription not found." });
    }

    await pool.execute(
      "UPDATE prescriptions SET status = ?, admin_notes = ? WHERE id = ?",
      [status, adminNotes || null, req.params.id]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/prescriptions/:id", async (req, res) => {
  try {
    const [existing] = await pool.query("SELECT * FROM prescriptions WHERE id = ?", [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Prescription not found." });
    }

    const [files] = await pool.query("SELECT * FROM prescription_files WHERE prescription_id = ?", [req.params.id]);

    // Clean up prescription files from disk
    files.forEach(f => {
      const filename = path.basename(f.stored_path);
      const filePath = path.join(prescriptionsUploadDir, filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error("Could not delete file:", e.message);
        }
      }
    });

    await pool.execute("DELETE FROM prescriptions WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ────────────────────────────────────────────────────────────────
// API ROUTES: Feedback
// ────────────────────────────────────────────────────────────────
app.get("/api/feedback", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM feedback ORDER BY created_at DESC");
    res.json(rows.map(r => ({
      id: r.id,
      userId: r.user_id || undefined,
      customerName: r.customer_name,
      email: r.email,
      rating: r.rating,
      category: r.category,
      message: r.message,
      createdAt: r.created_at,
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/feedback", async (req, res) => {
  const { userId, customerName, email, rating, category, message } = req.body;
  if (!customerName || !message || rating === undefined) {
    return res.status(400).json({ error: "Name, rating, and message are required." });
  }

  const id = "FB" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const dbUserId = userId || null;

  try {
    await pool.execute(
      `INSERT INTO feedback (id, user_id, customer_name, email, rating, category, message)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, dbUserId, customerName, email || "", rating, category || "", message]
    );

    const [rows] = await pool.query("SELECT * FROM feedback WHERE id = ?", [id]);
    const r = rows[0];
    res.status(201).json({
      id: r.id,
      userId: r.user_id || undefined,
      customerName: r.customer_name,
      email: r.email,
      rating: r.rating,
      category: r.category,
      message: r.message,
      createdAt: r.created_at,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/feedback/:id", async (req, res) => {
  try {
    const [existing] = await pool.query("SELECT * FROM feedback WHERE id = ?", [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Feedback not found." });
    }

    await pool.execute("DELETE FROM feedback WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ────────────────────────────────────────────────────────────────
// API ROUTES: Contact Us
// ────────────────────────────────────────────────────────────────
app.get("/api/contact", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM contact_messages ORDER BY created_at DESC");
    res.json(rows.map(r => ({
      id: r.id,
      name: r.name,
      email: r.email,
      subject: r.subject,
      message: r.message,
      status: r.status,
      createdAt: r.created_at,
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  const id = "MSG" + Math.random().toString(36).slice(2, 8).toUpperCase();

  try {
    await pool.execute(
      `INSERT INTO contact_messages (id, name, email, subject, message, status)
       VALUES (?, ?, ?, ?, ?, 'unread')`,
      [id, name, email, subject || "", message]
    );

    const [rows] = await pool.query("SELECT * FROM contact_messages WHERE id = ?", [id]);
    res.status(201).json({ success: true, message: "Message sent successfully.", data: rows[0] });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({ error: "Failed to save message. Please try again later." });
  }
});

app.put("/api/contact/:id/status", async (req, res) => {
  const { status } = req.body;
  if (!status || !['unread', 'read'].includes(status)) {
    return res.status(400).json({ error: "Invalid status." });
  }

  try {
    const [existing] = await pool.query("SELECT * FROM contact_messages WHERE id = ?", [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Message not found." });
    }

    await pool.execute("UPDATE contact_messages SET status = ? WHERE id = ?", [status, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/contact/:id", async (req, res) => {
  try {
    const [existing] = await pool.query("SELECT * FROM contact_messages WHERE id = ?", [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Message not found." });
    }

    await pool.execute("DELETE FROM contact_messages WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint (used by Railway & uptime monitors)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start listening
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Sri Srinivasa Medicals API running on http://0.0.0.0:${PORT}`);
});
