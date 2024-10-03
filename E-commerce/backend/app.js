const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
const path = require("path");
const cors = require("cors");
app.use(express.json());

let db;
const dbPath = path.join(__dirname, "ecommerce.db");

const initializeDBAndServer = async () => {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  app.listen(3000, () => {
    console.log("Server is running at http://localhost:3000/");
  });
};

initializeDBAndServer();

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  let jwtToken;
  const authHeader = req.headers["authorization"];

  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }

  if (jwtToken === undefined) {
    res.status(401).send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "MY_SECRET_TOKEN", (error, payload) => {
      if (error) {
        res.status(401).send("Invalid JWT Token");
      } else {
        req.username = payload.username;
        next();
      }
    });
  }
};

// User Management

// User Registration
app.post("/register", async (req, res) => {
  const { username, password, name, email } = req.body;

  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}' OR email = '${email}';`;
  const dbUser = await db.get(selectUserQuery);

  if (dbUser !== undefined) {
    res.status(400).send("User already exists");
  } else {
    if (password.length < 6) {
      res.status(400).send("Password is too short");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const createUserQuery = `
          INSERT INTO user (name, username, password, email)
          VALUES ('${name}', '${username}', '${hashedPassword}', '${email}');
        `;
      await db.run(createUserQuery);
      res.status(200).send({ ok: true });
    }
  }
});

// User Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}';`;
  const dbUser = await db.get(selectUserQuery);

  if (dbUser === undefined) {
    res.status(400).send("Invalid user");
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched) {
      const payload = { username: dbUser.username };
      const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
      res.send({ jwtToken });
    } else {
      res.status(400).send("Invalid password");
    }
  }
});

// Retrieve user information (Profile)
app.get("/users/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;
  const selectUserQuery = `SELECT * FROM user WHERE user_id = ${userId};`;
  const user = await db.get(selectUserQuery);

  if (user) {
    res.send(user);
  } else {
    res.status(404).send("User not found");
  }
});

// Update user information
app.put("/users/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const updateUserQuery = `
    UPDATE user
    SET name = '${name}', email = '${email}', password = '${hashedPassword}'
    WHERE user_id = ${userId};
  `;
  await db.run(updateUserQuery);
  res.send("User updated successfully");
});

// Delete a user
app.delete("/users/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;
  const deleteUserQuery = `DELETE FROM user WHERE user_id = ${userId};`;
  await db.run(deleteUserQuery);
  res.send("User deleted successfully");
});

// Product Management

// View all products
app.get("/products", authenticateToken, async (req, res) => {
  const selectProductsQuery = "SELECT * FROM product;";
  const products = await db.all(selectProductsQuery);
  res.send(products);
});

// Add products to cart
app.post("/cart", authenticateToken, async (req, res) => {
  const { product_id, quantity } = req.body;
  const { username } = req;

  const getUserQuery = `SELECT user_id FROM user WHERE username = '${username}';`;
  const user = await db.get(getUserQuery);

  const addToCartQuery = `
    INSERT INTO cart (user_id, product_id, quantity)
    VALUES (${user.user_id}, ${product_id}, ${quantity});
  `;
  await db.run(addToCartQuery);
  res.status(200).send("Product added to cart");
});

// View cart items
app.get("/cart", authenticateToken, async (req, res) => {
  const { username } = req;

  const getUserQuery = `SELECT user_id FROM user WHERE username = '${username}';`;
  const user = await db.get(getUserQuery);

  const getCartItemsQuery = `
      SELECT 
        *
      FROM cart
      INNER JOIN product ON cart.product_id = product.product_id
      WHERE cart.user_id = ${user.user_id};
    `;
  const cartItems = await db.all(getCartItemsQuery);

  res.send(cartItems);
});

// Delete a cart item
app.delete("/cart/:productId", authenticateToken, async (req, res) => {
  const { productId } = req.params;
  const { username } = req;

  const getUserQuery = `SELECT user_id FROM user WHERE username = '${username}';`;
  const user = await db.get(getUserQuery);

  const deleteCartItemQuery = `
      DELETE FROM cart WHERE user_id = ${user.user_id} AND product_id = ${productId};
    `;

  await db.run(deleteCartItemQuery);
  res.status(200).send("Cart item deleted successfully");
});

// Order Management

// Place an order
app.post("/orders", authenticateToken, async (req, res) => {
  const { cartItems } = req.body;
  const { username } = req;

  const getUserQuery = `SELECT user_id FROM user WHERE username = ?;`;
  const user = await db.get(getUserQuery, [username]);

  if (!user) {
    return res.status(404).send("User not found");
  }

  for (const item of cartItems) {
    const getProductQuery = `SELECT price FROM product WHERE product_id = ?`;
    const product = await db.get(getProductQuery, [item.product_id]);

    if (product) {
      const itemTotal = product.price * item.quantity;

      const createOrderQuery = `
        INSERT INTO orders (user_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?);
      `;
      await db.run(createOrderQuery, [
        user.user_id,
        item.product_id,
        item.quantity,
        itemTotal,
      ]);
    } else {
      return res
        .status(400)
        .send(`Invalid product with ID ${item.product_id} in cart`);
    }
  }

  const clearCartQuery = `DELETE FROM cart WHERE user_id = ?`;
  await db.run(clearCartQuery, [user.user_id]);

  res.status(200).send("Order placed successfully");
});

app.get("/orders", authenticateToken, async (req, res) => {
  const { username } = req;

  const getUserQuery = `SELECT user_id FROM user WHERE username = ?`;
  const user = await db.get(getUserQuery, [username]);

  if (!user) {
    return res.status(404).send("User not found");
  }

  const getOrdersQuery = `
    SELECT o.order_id, o.quantity, o.price, p.product_id, p.title, p.image_url
    FROM orders o
    JOIN product p ON o.product_id = p.product_id
    WHERE o.user_id = ?;
  `;
  const orders = await db.all(getOrdersQuery, [user.user_id]);

  res.send(orders);
});

module.exports = app;
