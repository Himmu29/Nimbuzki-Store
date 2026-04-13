// Automated API Tester
// Run this file in your terminal: node auto-tester.mjs

const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("🚀 Starting Nimbuzki API Tests...\n");

  try {
    // 1. Test the Signup API
    console.log("1️⃣ Testing: POST /api/auth/signup");
    
    // We generate a random email so you can run this file multiple times without "User existing" errors
    const randomEmail = `test_${Math.floor(Math.random() * 10000)}@nimbuzki.com`;
    
    const signupResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Auto Tester",
        email: randomEmail,
        password: "securepassword",
        confirmPassword: "securepassword"
      })
    });

    const signupData = await signupResponse.json();
    
    if (signupResponse.ok) {
      console.log("✅ SUCCESS: User created successfully!");
      console.log(`   Response: ${JSON.stringify(signupData)}`);
      console.log("\n🎉 The 'users' collection should NOW exist in your MongoDB Compass! Hit the little refresh icon next to your cluster name to see it.\n");
    } else {
      console.log("❌ FAILED to create user.");
      console.log(`   Error: ${JSON.stringify(signupData)}\n`);
    }

    // 2. Test fetching Categories (Public GET request)
    console.log("2️⃣ Testing: GET /api/categories");
    const categoriesResponse = await fetch(`${BASE_URL}/api/categories`);
    const categoriesData = await categoriesResponse.json();
    
    if (categoriesResponse.ok) {
      console.log(`✅ SUCCESS: Fetched categories. Currently you have: ${categoriesData.length} categories.`);
    } else {
      console.log("❌ FAILED to fetch categories.");
    }

  } catch (err) {
    console.error("CRITICAL ERROR: Make sure 'npm run dev' is running on localhost:3000!");
    console.error(err);
  }
}

runTests();
