import "server-only";
import { createClient, Client } from "@libsql/client";

let client: Client | null = null;

export function getDb(): Client {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL || "file:local.db";
    const opts: { url: string; authToken?: string } = { url };
    if (process.env.TURSO_AUTH_TOKEN) {
      opts.authToken = process.env.TURSO_AUTH_TOKEN;
    }
    client = createClient(opts);
  }
  return client;
}

export function resetDb() {
  client = null;
}
