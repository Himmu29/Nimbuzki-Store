import mongoose from "mongoose";

const BASE_URL = "http://localhost:3000";
const MONGODB_URI = process.env.MONGODB_URI;

async function runAllTests() {
  console.log("🚀 Starting Full End-to-End API Test Suite...\n");
  
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is missing. Run this script via: node --env-file=.env.local e2e-tester.mjs");
    return;
  }

  const randomEmail = `master_${Math.floor(Math.random() * 10000)}@nimbuzki.com`;
  let adminCookie = "";
  let categoryId = "";
  let productId = "";

  try {
    // ----------------------------------------------------------------------
    // 1. AUTHENTICATION & ADMIN SETUP
    // ----------------------------------------------------------------------
    console.log("1️⃣  Testing POST /api/auth/signup");
    const signupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Master Tester",
        email: randomEmail,
        password: "password123",
        confirmPassword: "password123"
      })
    });
    const signupData = await signupRes.json();
    if (!signupRes.ok) throw new Error(JSON.stringify(signupData));
    console.log("   ✅ User created successfully.\n");

    console.log("⚙️  [Database] Upgrading new user to Admin role manually...");
    await mongoose.connect(MONGODB_URI);
    await mongoose.connection.db.collection("users").updateOne({ email: randomEmail }, { $set: { role: "admin" } });
    await mongoose.disconnect();
    console.log("   ✅ Upgraded to Admin.\n");

    console.log("2️⃣  Testing POST /api/auth/login");
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: randomEmail, password: "password123" })
    });
    
    adminCookie = loginRes.headers.get("set-cookie") || "";
    // Clean up cookie for consecutive requests
    const tokenStr = adminCookie.split(";")[0]; 
    if (!loginRes.ok) throw new Error("Login failed");
    console.log("   ✅ Login successful. Acquired Auth Token.\n");

    // ----------------------------------------------------------------------
    // 2. CATEGORIES
    // ----------------------------------------------------------------------
    console.log("3️⃣  Testing POST /api/categories (Admin Protected)");
    const catRes = await fetch(`${BASE_URL}/api/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cookie": tokenStr },
      body: JSON.stringify({ name: `Test Category ${Math.floor(Math.random()*1000)}` })
    });
    const catData = await catRes.json();
    if (!catRes.ok) throw new Error(JSON.stringify(catData));
    categoryId = catData._id;
    console.log(`   ✅ Category created: [${catData.name}]\n`);

    console.log("4️⃣  Testing GET /api/categories");
    const getCatRes = await fetch(`${BASE_URL}/api/categories`);
    const getCatData = await getCatRes.json();
    if (!getCatRes.ok) throw new Error("Failed to fetch categories");
    console.log(`   ✅ Fetched ${getCatData.length} total categories.\n`);

    // ----------------------------------------------------------------------
    // 3. PRODUCTS
    // ----------------------------------------------------------------------
    console.log("5️⃣  Testing POST /api/products (Admin Protected)");
    const prodRes = await fetch(`${BASE_URL}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cookie": tokenStr },
      body: JSON.stringify({
        name: `AirPods Pro (Gen ${Math.floor(Math.random()*10)})`,
        description: "Noise cancelling wireless earbuds.",
        price: 249.99,
        stock: 50,
        category: categoryId
      })
    });
    const prodData = await prodRes.json();
    if (!prodRes.ok) throw new Error(JSON.stringify(prodData));
    productId = prodData._id;
    console.log(`   ✅ Product created: [${prodData.name}] - $${prodData.price}\n`);

    console.log("6️⃣  Testing GET /api/products");
    const getProdRes = await fetch(`${BASE_URL}/api/products`);
    const getProdData = await getProdRes.json();
    if (!getProdRes.ok) throw new Error("Failed to fetch products");
    console.log(`   ✅ Fetched ${getProdData.length} total products.\n`);

    // ----------------------------------------------------------------------
    // 4. CART & CHECKOUT
    // ----------------------------------------------------------------------
    console.log("7️⃣  Testing GET /api/cart (Fetch/Create User Cart)");
    const cartRes = await fetch(`${BASE_URL}/api/cart`, {
      headers: { "Cookie": tokenStr }
    });
    const cartData = await cartRes.json();
    if (!cartRes.ok) throw new Error(JSON.stringify(cartData));
    console.log(`   ✅ Cart initialized successfully.\n`);

    console.log("8️⃣  Testing POST /api/orders (Checkout Flow)");
    const orderRes = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cookie": tokenStr },
      body: JSON.stringify({
        items: [{ product: productId, quantity: 2, price: 249.99 }],
        totalPrice: 499.98,
        shippingAddress: {
          street: "123 Tester Lane",
          city: "Codeville",
          state: "JS",
          postalCode: "12345",
          country: "USA"
        }
      })
    });
    const orderData = await orderRes.json();
    if (!orderRes.ok) throw new Error(JSON.stringify(orderData));
    console.log(`   ✅ Order created perfectly! Order Status: ${orderData.orderStatus}\n`);

    console.log("9️⃣  Testing GET /api/orders (Order History)");
    const getOrderRes = await fetch(`${BASE_URL}/api/orders`, {
      headers: { "Cookie": tokenStr }
    });
    const getOrderData = await getOrderRes.json();
    if (!getOrderRes.ok) throw new Error("Failed to fetch orders");
    console.log(`   ✅ Successfully retrieved order history! You have ${getOrderData.length} past order(s).\n`);

    console.log("=================================================");
    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY! YOUR APIS ARE BULLETPROOF! 🎉");
    console.log("=================================================");

  } catch (err) {
    console.log("\n❌ TEST FAILED!");
    console.error(err.message || err);
  }
}

runAllTests();
