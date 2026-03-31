// Demo users for the auth system (client‑side only)
// Email / password pairs are plain‑text for demo purposes only.
// The list is imported by the SignIn page and the AuthContext.

export const DEMO_USERS = [
  { email: "alice@ogt.com", password: "123456", name: "Alice", role: "user" as const },
  { email: "bob@ogt.com", password: "123456", name: "Bob", role: "user" as const },
  { email: "charlie@ogt.com", password: "123456", name: "Charlie", role: "user" as const },
  { email: "jhonnt@ogt.com", password: "123456", name: "Jhonny", role: "user" as const },
  // Admin demo user – redirects to the admin area after login
  { email: "admin@ogt.com", password: "admin", name: "Admin", role: "admin" as const },
];
