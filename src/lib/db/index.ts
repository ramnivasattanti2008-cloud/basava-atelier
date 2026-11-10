import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";
import type { Order, ContactMessage, CustomEnquiry } from "@/lib/types";
import type { BespokeQuotationRequest } from "@/lib/studio-types";

// Database URL from Vercel Postgres / Neon / Supabase environment variables
const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

// Fallback JSON persistence file for local development or serverless environments without an external DB
const LOCAL_DB_DIR = process.env.NODE_ENV === "production" ? "/tmp" : path.join(process.cwd(), "data");
const LOCAL_DB_FILE = path.join(LOCAL_DB_DIR, "basava-db.json");

interface DatabaseSchema {
  orders: Order[];
  bespokeRequests: BespokeQuotationRequest[];
  enquiries: CustomEnquiry[];
  messages: ContactMessage[];
}

function getLocalDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(LOCAL_DB_DIR)) {
      fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
    }
    if (fs.existsSync(LOCAL_DB_FILE)) {
      const data = fs.readFileSync(LOCAL_DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Local DB read error:", err);
  }
  return {
    orders: [],
    bespokeRequests: [],
    enquiries: [],
    messages: [],
  };
}

function saveLocalDb(data: DatabaseSchema) {
  try {
    if (!fs.existsSync(LOCAL_DB_DIR)) {
      fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Local DB write error:", err);
  }
}

// Ensure PostgreSQL tables exist when connected
let initialized = false;
async function ensurePgTables(sql: any) {
  if (initialized) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(64) PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(32) NOT NULL,
        customer JSONB NOT NULL,
        address JSONB NOT NULL,
        items JSONB NOT NULL,
        total_inr NUMERIC NOT NULL,
        payment_method VARCHAR(32),
        payment_state VARCHAR(32),
        note TEXT,
        data JSONB
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS bespoke_requests (
        id VARCHAR(64) PRIMARY KEY,
        reference_code VARCHAR(64) UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(32) NOT NULL,
        customer JSONB NOT NULL,
        config JSONB NOT NULL,
        quotation JSONB NOT NULL,
        data JSONB
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id VARCHAR(64) PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(64),
        topic VARCHAR(255),
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT FALSE,
        data JSONB
      );
    `;
    initialized = true;
  } catch (err) {
    console.warn("PostgreSQL table init check:", err);
  }
}

export const db = {
  // Orders
  async saveOrder(order: Order): Promise<Order> {
    if (dbUrl) {
      try {
        const sql: any = neon(dbUrl);
        await ensurePgTables(sql);
        await sql`
          INSERT INTO orders (id, created_at, status, customer, address, items, total_inr, payment_method, payment_state, note, data)
          VALUES (
            ${order.id},
            ${order.createdAt},
            ${order.status},
            ${JSON.stringify(order.customer)},
            ${JSON.stringify(order.address)},
            ${JSON.stringify(order.items)},
            ${order.totalINR},
            ${order.paymentMethod},
            ${order.paymentState},
            ${order.note || ""},
            ${JSON.stringify(order)}
          )
          ON CONFLICT (id) DO UPDATE SET
            status = EXCLUDED.status,
            data = EXCLUDED.data;
        `;
        return order;
      } catch (err) {
        console.error("Neon saveOrder error, falling back to local storage:", err);
      }
    }

    const local = getLocalDb();
    const idx = local.orders.findIndex((o) => o.id === order.id);
    if (idx >= 0) {
      local.orders[idx] = order;
    } else {
      local.orders.unshift(order);
    }
    saveLocalDb(local);
    return order;
  },

  async getOrders(): Promise<Order[]> {
    if (dbUrl) {
      try {
        const sql: any = neon(dbUrl);
        await ensurePgTables(sql);
        const rows = await sql`SELECT data FROM orders ORDER BY created_at DESC;`;
        return rows.map((r: any) => r.data as Order);
      } catch (err) {
        console.error("Neon getOrders error, falling back:", err);
      }
    }
    return getLocalDb().orders;
  },

  // Bespoke Requests
  async saveBespokeRequest(req: BespokeQuotationRequest): Promise<BespokeQuotationRequest> {
    if (dbUrl) {
      try {
        const sql: any = neon(dbUrl);
        await ensurePgTables(sql);
        await sql`
          INSERT INTO bespoke_requests (id, reference_code, created_at, status, customer, config, quotation, data)
          VALUES (
            ${req.id},
            ${req.referenceCode},
            ${req.createdAt},
            ${req.status},
            ${JSON.stringify(req.customer)},
            ${JSON.stringify(req.currentConfig)},
            ${JSON.stringify({
              heroImage: req.heroImage,
              additionalViews: req.additionalViews,
              quotedPriceINR: req.quotedPriceINR,
              quotedTimelineDays: req.quotedTimelineDays,
            })},
            ${JSON.stringify(req)}
          )
          ON CONFLICT (id) DO UPDATE SET
            status = EXCLUDED.status,
            data = EXCLUDED.data;
        `;
        return req;
      } catch (err) {
        console.error("Neon saveBespokeRequest error, falling back:", err);
      }
    }

    const local = getLocalDb();
    const idx = local.bespokeRequests.findIndex((b) => b.id === req.id);
    if (idx >= 0) {
      local.bespokeRequests[idx] = req;
    } else {
      local.bespokeRequests.unshift(req);
    }
    saveLocalDb(local);
    return req;
  },

  async getBespokeRequests(): Promise<BespokeQuotationRequest[]> {
    if (dbUrl) {
      try {
        const sql: any = neon(dbUrl);
        await ensurePgTables(sql);
        const rows = await sql`SELECT data FROM bespoke_requests ORDER BY created_at DESC;`;
        return rows.map((r: any) => r.data as BespokeQuotationRequest);
      } catch (err) {
        console.error("Neon getBespokeRequests error, falling back:", err);
      }
    }
    return getLocalDb().bespokeRequests;
  },

  // Contact Messages
  async saveMessage(msg: ContactMessage): Promise<ContactMessage> {
    if (dbUrl) {
      try {
        const sql: any = neon(dbUrl);
        await ensurePgTables(sql);
        await sql`
          INSERT INTO contact_messages (id, created_at, name, email, phone, topic, message, read, data)
          VALUES (
            ${msg.id},
            ${msg.createdAt},
            ${msg.name},
            ${msg.email},
            ${msg.phone || ""},
            ${msg.topic || "General"},
            ${msg.message},
            ${msg.read},
            ${JSON.stringify(msg)}
          )
          ON CONFLICT (id) DO NOTHING;
        `;
        return msg;
      } catch (err) {
        console.error("Neon saveMessage error, falling back:", err);
      }
    }

    const local = getLocalDb();
    local.messages.unshift(msg);
    saveLocalDb(local);
    return msg;
  },

  async getMessages(): Promise<ContactMessage[]> {
    if (dbUrl) {
      try {
        const sql: any = neon(dbUrl);
        await ensurePgTables(sql);
        const rows = await sql`SELECT data FROM contact_messages ORDER BY created_at DESC;`;
        return rows.map((r: any) => r.data as ContactMessage);
      } catch (err) {
        console.error("Neon getMessages error, falling back:", err);
      }
    }
    return getLocalDb().messages;
  },
};
