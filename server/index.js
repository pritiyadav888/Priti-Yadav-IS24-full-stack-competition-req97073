const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
let products = [];

// Generate sample products
for (let i = 1; i <= 40; i++) {
  // Generate a random product ID between 1 and 1000
  const productId = Math.floor(Math.random() * 1000) + 1;

  // Generate a random product name
  const productName = `Product ${i}`;

  // Generate a random product owner name
  const productOwnerName = `Product Owner ${i}`;

  // Generate an array of up to 5 random developer names
  const developers = [
    `Developer ${i}_1`,
    `Developer ${i}_2`,
    `Developer ${i}_3`,
    `Developer ${i}_4`,
    `Developer ${i}_5`
  ].slice(0, Math.floor(Math.random() * 5) + 1); // Randomly select up to 5 developers

  // Generate a random scrum master name
  const scrumMasterName = `Scrum Master ${i}`;

  // Generate a random start date in the format YYYY/MM/DD
  const startDate = `${Math.floor(Math.random() * 10) + 2010}/${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * 28) + 1}`;

  // Generate a random methodology value of "Agile" or "Waterfall"
  const methodology = Math.random() < 0.5 ? "Agile" : "Waterfall";

  // Add the generated product to the products array
  products.push({
    productId,
    productName,
    productOwnerName,
    developers,
    scrumMasterName,
    startDate,
    methodology
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(products);
});

// GET health endpoint
app.get('/api/health', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send('Server is up and running!');
});

// GET all products endpoint
app.get('/api/products', (req, res) => {
  res.send(products);
});

// GET product by ID endpoint
app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.productId === id);
  if (!product) {
    res.status(404).send('Product not found');
  } else {
    res.send(product);
  }
});

// POST new product endpoint
app.post('/api/products', (req, res) => {
  const product = req.body;
  product.productId = Math.floor(Math.random() * 1000) + 1;
  products.push(product);
  res.send(product);
});

// PUT update product endpoint
app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let productIndex = products.findIndex(p => p.productId === id);
  if (productIndex === -1) {
    res.status(404).send('Product not found');
  } else {
    const product = req.body;
    product.productId = id;
    products[productIndex] = product;
    console.log('Updated product:', product);
    res.send(product);
  }
});

  // DELETE product endpoint
  // DELETE product endpoint
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.productId === id);
  if (productIndex === -1) {
    res.status(404).send('Product not found');
  } else {
    products.splice(productIndex, 1);
    res.status(204).send('Product deleted successfully');
  }
});
