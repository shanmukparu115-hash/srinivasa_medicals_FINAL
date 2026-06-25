// ============================================================
// seedService.ts — Dummy placeholder since DB is seeded in MySQL
// ============================================================

export const seedService = {
  seedIfNeeded(): void {
    // Database is automatically seeded on MySQL using backend server's seed.js
    console.log("Database seeded on backend via MySQL");
  },

  forceSeed(): void {
    console.log("Database seeded on backend via MySQL");
  },

  reset(): void {
    console.log("Database seeded on backend via MySQL");
  },
};
