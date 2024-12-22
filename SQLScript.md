```sql

-- Create Tables
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    size ENUM('small', 'medium', 'large') NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    description TEXT,
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    status ENUM('pending', 'approved', 'disapproved') DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    admin_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (admin_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (item_id) REFERENCES items(id)
);

-- Insert Records
INSERT INTO categories (name, description)
VALUES ('Electronics', 'Electronic devices and accessories');

INSERT INTO items (name, price, size, quantity, description, category_id)
VALUES ('Laptop', 999.99, 'medium', 10, 'High-performance laptop', 1);

INSERT INTO users (name, email, password, role)
VALUES ('John Admin', 'admin@example.com', 'hashed_password', 'admin');

-- Query Records (Using Joins)
SELECT i.name, i.price, c.name as category
FROM items i
JOIN categories c ON i.category_id = c.id
WHERE i.quantity > 0;

SELECT o.id, u.name as user, i.name as item, oi.quantity
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_items oi ON o.id = oi.order_id
JOIN items i ON oi.item_id = i.id
WHERE o.status = 'pending';

-- Update Records
UPDATE items i
JOIN categories c ON i.category_id = c.id
SET i.price = i.price * 1.1
WHERE c.name = 'Electronics';

UPDATE orders o
JOIN users u ON o.user_id = u.id
SET o.status = 'approved'
WHERE u.email = 'user@example.com';

-- Delete Records
DELETE i, oi
FROM items i
LEFT JOIN order_items oi ON i.id = oi.item_id
WHERE i.quantity = 0;

DELETE o, oi
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.status = 'disapproved';
```
