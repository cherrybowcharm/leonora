/**
 * Demo account seeder
 * Creates demo@leonora.com / demo123 if it doesn't already exist.
 * Called once automatically at server startup — safe to run repeatedly.
 */
const User = require("../models/User");
const Task = require("../models/Task");

const DEMO_EMAIL    = "demo@leonora.com";
const DEMO_PASSWORD = "demo123";
const DEMO_NAME     = "Demo User";

const seedDemoAccount = async () => {
  try {
    const existing = await User.findOne({ email: DEMO_EMAIL });
    if (existing) {
      console.log("  ✓ Demo account ready (demo@leonora.com)");
      return;
    }

    // Create the demo user (password hashed by pre-save hook)
    const user = await User.create({
      name: DEMO_NAME,
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });

    // Seed a handful of example tasks so the demo dashboard looks populated
    const sampleTasks = [
      { title: "Design the landing page", description: "Hero section, feature cards, and footer layout", status: "completed" },
      { title: "Set up authentication flow", description: "JWT login, register, and protected routes", status: "completed" },
      { title: "Build task management UI", description: "Cards, modals, search, filter and pagination", status: "completed" },
      { title: "Write API documentation", description: "Document all endpoints with example request/response bodies", status: "pending" },
      { title: "Deploy backend to Render", description: "Configure environment variables and start command", status: "pending" },
      { title: "Add unit tests", description: "Cover auth routes and task CRUD operations", status: "pending" },
    ];

    await Task.insertMany(
      sampleTasks.map((t) => ({ ...t, userId: user._id }))
    );

    console.log("  ✓ Demo account created  (demo@leonora.com / demo123)");
    console.log("  ✓ 6 sample tasks seeded for demo account");
  } catch (err) {
    // Non-fatal — don't crash the server if seeding fails
    console.warn("  ⚠ Demo seed skipped:", err.message);
  }
};

module.exports = seedDemoAccount;
