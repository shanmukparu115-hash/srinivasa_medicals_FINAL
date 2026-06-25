-- ================================================================
-- Sri Srinivasa Medicals — MySQL Database Schema
-- Version: 1.0
-- Description: Full schema with integrity constraints, indexing,
--              and future-ready tables for scalability.
-- ================================================================

-- CREATE DATABASE IF NOT EXISTS srinivasa_medicals
--   CHARACTER SET utf8mb4
--   COLLATE utf8mb4_unicode_ci;

-- USE srinivasa_medicals;

DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS prescription_files;
DROP TABLE IF EXISTS prescriptions;
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS suppliers;

-- ================================================================
-- TABLE: categories
-- ================================================================
CREATE TABLE IF NOT EXISTS categories (
  id          INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
  slug        VARCHAR(60)     NOT NULL UNIQUE,
  name        VARCHAR(100)    NOT NULL,
  description VARCHAR(255)    NOT NULL DEFAULT '',
  color       VARCHAR(100)    NOT NULL DEFAULT '',
  show_stock  TINYINT(1)      NOT NULL DEFAULT 0,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_categories_slug (slug)
) ENGINE=InnoDB;

-- ================================================================
-- TABLE: products
-- ================================================================
CREATE TABLE IF NOT EXISTS products (
  id                  VARCHAR(20)     PRIMARY KEY,
  sku                 VARCHAR(50)     NOT NULL UNIQUE,
  name                VARCHAR(255)    NOT NULL,
  category_slug       VARCHAR(60)     NOT NULL,
  description         TEXT            NOT NULL,
  manufacturer        VARCHAR(255)    NOT NULL DEFAULT '',
  price               DECIMAL(10,2)   NULL,
  mrp                 DECIMAL(10,2)   NULL,
  stock_quantity      INT             NULL,
  availability_status ENUM('available','not-available') NULL,
  image_url           TEXT            NULL,
  image_source_type   ENUM('URL','UPLOAD') NULL,
  is_active           TINYINT(1)      NOT NULL DEFAULT 1,
  created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_products_category
    FOREIGN KEY (category_slug) REFERENCES categories(slug)
    ON UPDATE CASCADE ON DELETE RESTRICT,

  INDEX idx_products_category   (category_slug),
  INDEX idx_products_name       (name),
  INDEX idx_products_is_active  (is_active)
) ENGINE=InnoDB;

-- ================================================================
-- TABLE: users
-- ================================================================
CREATE TABLE IF NOT EXISTS users (
  id            VARCHAR(20)   PRIMARY KEY,
  name          VARCHAR(150)  NOT NULL,
  email         VARCHAR(200)  NOT NULL UNIQUE,
  phone         VARCHAR(20)   NOT NULL DEFAULT '',
  password_hash VARCHAR(255)  NOT NULL,
  role          ENUM('admin','customer') NOT NULL DEFAULT 'customer',
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_users_email  (email),
  INDEX idx_users_role   (role)
) ENGINE=InnoDB;

-- ================================================================
-- TABLE: prescriptions
-- ================================================================
CREATE TABLE IF NOT EXISTS prescriptions (
  id          VARCHAR(20)   PRIMARY KEY,
  user_id     VARCHAR(20)   NULL,
  name        VARCHAR(150)  NOT NULL,
  phone       VARCHAR(20)   NOT NULL DEFAULT '',
  notes       TEXT          NULL,
  status      ENUM('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  admin_notes TEXT          NULL,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_prescriptions_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE,

  INDEX idx_prescriptions_user_id  (user_id),
  INDEX idx_prescriptions_status   (status)
) ENGINE=InnoDB;

-- ================================================================
-- TABLE: prescription_files
-- ================================================================
CREATE TABLE IF NOT EXISTS prescription_files (
  id                INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
  prescription_id   VARCHAR(20)   NOT NULL,
  original_name     VARCHAR(255)  NOT NULL,
  stored_path       VARCHAR(500)  NOT NULL,
  mime_type         VARCHAR(100)  NOT NULL DEFAULT '',
  file_size         BIGINT        NOT NULL DEFAULT 0,
  created_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_pfiles_prescription
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  INDEX idx_pfiles_prescription (prescription_id)
) ENGINE=InnoDB;

-- ================================================================
-- TABLE: feedback
-- ================================================================
CREATE TABLE IF NOT EXISTS feedback (
  id              VARCHAR(20)   PRIMARY KEY,
  user_id         VARCHAR(20)   NULL,
  customer_name   VARCHAR(150)  NOT NULL,
  email           VARCHAR(200)  NOT NULL DEFAULT '',
  rating          TINYINT       NOT NULL DEFAULT 5
                  CHECK (rating BETWEEN 1 AND 5),
  category        VARCHAR(100)  NOT NULL DEFAULT '',
  message         TEXT          NOT NULL,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_feedback_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE,

  INDEX idx_feedback_user_id   (user_id),
  INDEX idx_feedback_created   (created_at)
) ENGINE=InnoDB;

-- ================================================================
-- TABLE: orders (future-ready skeleton)
-- ================================================================
CREATE TABLE IF NOT EXISTS orders (
  id              VARCHAR(20)   PRIMARY KEY,
  user_id         VARCHAR(20)   NULL,
  contact_name    VARCHAR(150)  NOT NULL DEFAULT '',
  contact_phone   VARCHAR(20)   NOT NULL DEFAULT '',
  contact_email   VARCHAR(200)  NOT NULL DEFAULT '',
  address         VARCHAR(500)  NOT NULL DEFAULT '',
  city            VARCHAR(100)  NOT NULL DEFAULT '',
  state           VARCHAR(100)  NOT NULL DEFAULT '',
  pincode         VARCHAR(10)   NOT NULL DEFAULT '',
  payment_method  VARCHAR(50)   NOT NULL DEFAULT '',
  subtotal        DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  shipping        DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  total           DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  status          ENUM('Pending','Processing','Packed','Shipped','Delivered','Cancelled')
                  NOT NULL DEFAULT 'Pending',
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE,

  INDEX idx_orders_user_id (user_id),
  INDEX idx_orders_status  (status)
) ENGINE=InnoDB;

-- ================================================================
-- TABLE: order_items (future-ready skeleton)
-- ================================================================
CREATE TABLE IF NOT EXISTS order_items (
  id          INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
  order_id    VARCHAR(20)   NOT NULL,
  product_id  VARCHAR(20)   NOT NULL,
  qty         INT           NOT NULL DEFAULT 1,
  unit_price  DECIMAL(10,2) NOT NULL,

  CONSTRAINT fk_oi_order   FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  CONSTRAINT fk_oi_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,

  INDEX idx_oi_order   (order_id),
  INDEX idx_oi_product (product_id)
) ENGINE=InnoDB;

-- ================================================================
-- TABLE: cart_items (future-ready skeleton)
-- ================================================================
CREATE TABLE IF NOT EXISTS cart_items (
  id          INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
  user_id     VARCHAR(20)   NOT NULL,
  product_id  VARCHAR(20)   NOT NULL,
  qty         INT           NOT NULL DEFAULT 1,
  added_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_ci_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  CONSTRAINT fk_ci_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,

  UNIQUE KEY uq_cart_user_product (user_id, product_id),
  INDEX idx_ci_user (user_id)
) ENGINE=InnoDB;

-- ================================================================
-- TABLE: suppliers (future-ready skeleton)
-- ================================================================
CREATE TABLE IF NOT EXISTS suppliers (
  id          INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(200)  NOT NULL,
  contact     VARCHAR(150)  NULL,
  phone       VARCHAR(20)   NULL,
  email       VARCHAR(200)  NULL UNIQUE,
  address     TEXT          NULL,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ================================================================
-- TABLE: contact_messages
-- ================================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id          VARCHAR(20)   PRIMARY KEY,
  name        VARCHAR(150)  NOT NULL,
  email       VARCHAR(200)  NOT NULL,
  subject     VARCHAR(200)  NULL,
  message     TEXT          NOT NULL,
  status      ENUM('unread', 'read') NOT NULL DEFAULT 'unread',
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

