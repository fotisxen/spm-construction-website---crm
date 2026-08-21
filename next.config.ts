import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev-mode server action arg logging would print plaintext passwords
  // (e.g. from the login form) straight to the terminal.
  logging: {
    serverFunctions: false,
  },
};

export default nextConfig;
