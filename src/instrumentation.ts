export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const dns = await import("node:dns");
    // Some networks fail IPv6 connections to Supabase silently, which Node
    // surfaces as a generic "fetch failed" — prefer IPv4 to avoid that.
    dns.setDefaultResultOrder("ipv4first");
  }
}
