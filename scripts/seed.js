const mongoose = require("mongoose");

// Configuration
// Using process.env.MONGODB_URI, make sure to run: node --env-file=.env.local scripts/seed.js
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing. Please run with: node --env-file=.env.local scripts/seed.js");
  process.exit(1);
}

// Schemas
const categorySchema = new mongoose.Schema({ name: String }, { timestamps: true });
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  stock: Number,
  isFeatured: Boolean,
  discountPrice: Number,
  images: [String],
  specifications: Object
}, { timestamps: true });

// Models (Using existing names if they exist, or creating them)
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const MAIN_CATEGORIES = [
  "Motor", "ESC", "Frames", "Controllers", "Propellers", "Cameras", "Stack", "Accessories"
];

const generateProducts = (categoryName, categoryId) => {
  const products = [];
  for (let i = 1; i <= 5; i++) {
    const isFeatured = Math.random() > 0.8; // 20% chance to be featured deal
    const price = Math.floor(Math.random() * (150 - 10) + 10) + 0.99;
    
    products.push({
      name: `Premium ${categoryName} Pro V${i}`,
      description: `High-performance ${categoryName.toLowerCase()} designed for advanced FPV drone racing and freestyle flying. Incredible durability and response times.`,
      price: price,
      discountPrice: isFeatured ? parseFloat((price * 0.7).toFixed(2)) : undefined, // 30% off
      isFeatured: isFeatured,
      stock: Math.floor(Math.random() * 100) + 10,
      category: categoryId,
      images: [`https://placehold.co/600x400/1e293b/ffffff?text=${categoryName}+V${i}`],
      specifications: { weight: `${Math.floor(Math.random() * 50) + 10}g`, usage: "FPV Racing" }
    });
  }
  return products;
};

async function seedDatabase() {
  try {
    console.log("🌱 Starting Database Seeding...");
    console.log("Connecting to Database...");
    
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Attached to Database.");

    // Clear existing products and categories
    console.log("🧹 Clearing old Products and Categories...");
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log("✅ Cleared.");

    // Insert new Categories
    console.log("📦 Injecting Categories...");
    const categoryDocs = [];
    for (const catName of MAIN_CATEGORIES) {
      const cat = await Category.create({ name: catName });
      categoryDocs.push(cat);
    }
    console.log(`✅ ${categoryDocs.length} Categories Created.`);

    // Insert new Products
    console.log("🕹️ Crafting Products for each category...");
    let totalProducts = 0;
    for (const cat of categoryDocs) {
      const builtProducts = generateProducts(cat.name, cat._id);
      await Product.insertMany(builtProducts);
      totalProducts += builtProducts.length;
    }
    
    console.log(`✅ ${totalProducts} Products Sucessfully Seeded.`);
    console.log("\n🎉 SEEDING COMPLETE! You can now start the store.");

  } catch (err) {
    console.error("\n❌ SEEDING FAILED:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed.");
    process.exit(0);
  }
}

seedDatabase();
