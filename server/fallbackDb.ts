import fs from "fs";
import path from "path";

const DB_FILE = path.join(process.cwd(), "server/fallback_db.json");

function getTableName(table: any): string {
  if (!table) return "";
  if (typeof table === "string") return table;
  return table[Symbol.for("drizzle:Name")] || table.config?.name || "";
}

function getFilterInfo(expr: any) {
  if (!expr || !expr.queryChunks) return null;
  const chunks = expr.queryChunks;
  let columnName = "";
  let value: any = null;
  for (const chunk of chunks) {
    if (chunk && typeof chunk === "object") {
      if (chunk.name !== undefined && chunk.constructor?.name !== "Param") {
        columnName = chunk.name;
      } else if (chunk.value !== undefined && chunk.constructor?.name === "Param") {
        value = chunk.value;
      }
    }
  }
  return { columnName, value };
}

function deserializeDates(obj: any): any {
  if (!obj) return obj;
  if (Array.isArray(obj)) {
    return obj.map(deserializeDates);
  }
  if (typeof obj === "object") {
    const res: any = {};
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val)) {
        res[key] = new Date(val);
      } else if (typeof val === "object" && val !== null) {
        res[key] = deserializeDates(val);
      } else {
        res[key] = val;
      }
    }
    return res;
  }
  return obj;
}

export class FallbackDatabase {
  private data: Record<string, any[]> = {
    users: [],
    businesses: [],
    business_subscriptions: [],
    products: [],
    events: [],
    job_listings: [],
    menu_categories: [],
    menu_items: [],
    roasters: [],
  };

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        this.data = deserializeDates(parsed);
      } else {
        this.save();
      }
    } catch (err) {
      console.error("[FallbackDB] Failed to load JSON database:", err);
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (err) {
      console.error("[FallbackDB] Failed to save JSON database:", err);
    }
  }

  getRows(table: string): any[] {
    const normalized = this.normalizeTableName(table);
    if (!this.data[normalized]) {
      this.data[normalized] = [];
    }
    return this.data[normalized];
  }

  private normalizeTableName(table: string): string {
    if (table === "business_subscriptions") return "business_subscriptions";
    if (table === "job_listings") return "job_listings";
    if (table === "menu_categories") return "menu_categories";
    if (table === "menu_items") return "menu_items";
    return table;
  }

  executeInsert(tableObj: any, values: any) {
    const table = getTableName(tableObj);
    const rows = this.getRows(table);
    
    const insertRow = (val: any) => {
      const id = rows.length > 0 ? Math.max(...rows.map((r: any) => r.id || 0)) + 1 : 1;
      const newRow = {
        id,
        ...val,
        createdAt: val.createdAt || new Date(),
        updatedAt: val.updatedAt || new Date(),
      };
      rows.push(newRow);
      return newRow;
    };

    let firstId = 0;
    if (Array.isArray(values)) {
      for (const val of values) {
        const row = insertRow(val);
        if (!firstId) firstId = row.id;
      }
    } else {
      const row = insertRow(values);
      firstId = row.id;
    }

    this.save();
    return [{ insertId: firstId }];
  }

  executeUpsert(tableObj: any, data: any, updateSet: any) {
    const table = getTableName(tableObj);
    const rows = this.getRows(table);

    if (table === "users") {
      const openId = data.openId;
      const existingIdx = rows.findIndex((u: any) => u.openId === openId);
      if (existingIdx !== -1) {
        rows[existingIdx] = {
          ...rows[existingIdx],
          ...updateSet,
          updatedAt: new Date(),
        };
      } else {
        const id = rows.length > 0 ? Math.max(...rows.map((r: any) => r.id || 0)) + 1 : 1;
        rows.push({
          id,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    } else {
      // General fallback upsert (if needed)
      const existingIdx = rows.findIndex((r: any) => r.id === data.id);
      if (existingIdx !== -1) {
        rows[existingIdx] = {
          ...rows[existingIdx],
          ...updateSet,
          updatedAt: new Date(),
        };
      } else {
        const id = rows.length > 0 ? Math.max(...rows.map((r: any) => r.id || 0)) + 1 : 1;
        rows.push({
          id,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    this.save();
    return [{ insertId: 0 }];
  }

  executeUpdate(tableObj: any, data: any, whereExpr: any) {
    const table = getTableName(tableObj);
    const filter = getFilterInfo(whereExpr);
    if (!filter) return { affectedRows: 0 };

    const rows = this.getRows(table);
    let affected = 0;

    for (let i = 0; i < rows.length; i++) {
      if (rows[i][filter.columnName] === filter.value) {
        rows[i] = {
          ...rows[i],
          ...data,
          updatedAt: new Date(),
        };
        affected++;
      }
    }

    if (affected > 0) {
      this.save();
    }
    return { affectedRows: affected };
  }

  executeDelete(tableObj: any, whereExpr: any) {
    const table = getTableName(tableObj);
    const filter = getFilterInfo(whereExpr);
    if (!filter) return { affectedRows: 0 };

    const normalized = this.normalizeTableName(table);
    const rows = this.getRows(normalized);
    const beforeLength = rows.length;
    this.data[normalized] = rows.filter((r: any) => r[filter.columnName] !== filter.value);
    
    const affected = beforeLength - this.data[normalized].length;
    if (affected > 0) {
      this.save();
    }
    return { affectedRows: affected };
  }

  executeSelect(tableObj: any, whereExpr: any, limitVal?: number) {
    const table = getTableName(tableObj);
    let rows = this.getRows(table);
    const filter = getFilterInfo(whereExpr);
    if (filter) {
      rows = rows.filter((r: any) => r[filter.columnName] === filter.value);
    }
    if (limitVal !== undefined) {
      rows = rows.slice(0, limitVal);
    }
    return rows;
  }

  async populateRelations(table: string, row: any, withOptions: any) {
    if (!row) return row;

    for (const relation of Object.keys(withOptions)) {
      if (!withOptions[relation]) continue;

      if (table === "businesses") {
        if (relation === "subscriptions") {
          row.subscriptions = this.getRows("business_subscriptions").filter((s) => s.businessId === row.id);
        } else if (relation === "products") {
          row.products = this.getRows("products").filter((p) => p.businessId === row.id);
        } else if (relation === "events") {
          row.events = this.getRows("events").filter((e) => e.businessId === row.id);
        } else if (relation === "jobs") {
          row.jobs = this.getRows("job_listings").filter((j) => j.businessId === row.id);
        } else if (relation === "menuCategories") {
          let cats = this.getRows("menu_categories").filter((c) => c.businessId === row.id);
          if (withOptions.menuCategories.with) {
            cats = await Promise.all(
              cats.map((c) => this.populateRelations("menu_categories", { ...c }, withOptions.menuCategories.with))
            );
          }
          row.menuCategories = cats;
        }
      } else if (table === "menu_categories") {
        if (relation === "items" || relation === "menuItems") {
          row.items = this.getRows("menu_items").filter((i) => i.categoryId === row.id);
        }
      } else if (["products", "job_listings", "events", "menu_categories", "business_subscriptions"].includes(table)) {
        if (relation === "business") {
          row.business = this.getRows("businesses").find((b) => b.id === row.businessId);
        }
      }
    }
    return row;
  }

  // Drizzle API mappings
  insert(tableObj: any) {
    return {
      values: (values: any) => {
        const builder = {
          onDuplicateKeyUpdate: (options: { set: any }) => {
            return Promise.resolve(this.executeUpsert(tableObj, values, options.set));
          },
          then: (onfulfilled?: any) => {
            return Promise.resolve(this.executeInsert(tableObj, values)).then(onfulfilled);
          },
        };
        return builder;
      },
    };
  }

  update(tableObj: any) {
    let updateData: any = null;
    return {
      set: (data: any) => {
        updateData = data;
        return {
          where: (whereExpr: any) => {
            return {
              then: (onfulfilled?: any) => {
                return Promise.resolve(this.executeUpdate(tableObj, updateData, whereExpr)).then(onfulfilled);
              },
            };
          },
        };
      },
    };
  }

  delete(tableObj: any) {
    return {
      where: (whereExpr: any) => {
        return {
          then: (onfulfilled?: any) => {
            return Promise.resolve(this.executeDelete(tableObj, whereExpr)).then(onfulfilled);
          },
        };
      },
    };
  }

  select() {
    return {
      from: (tableObj: any) => {
        let whereExpr: any = null;
        let limitVal: number | undefined = undefined;
        const builder = {
          where: (expr: any) => {
            whereExpr = expr;
            return builder;
          },
          limit: (val: number) => {
            limitVal = val;
            return builder;
          },
          then: (onfulfilled?: any) => {
            return Promise.resolve(this.executeSelect(tableObj, whereExpr, limitVal)).then(onfulfilled);
          },
        };
        return builder;
      },
    };
  }

  query = {
    users: new QueryBuilder(this, "users"),
    businesses: new QueryBuilder(this, "businesses"),
    businessSubscriptions: new QueryBuilder(this, "business_subscriptions"),
    products: new QueryBuilder(this, "products"),
    events: new QueryBuilder(this, "events"),
    jobListings: new QueryBuilder(this, "job_listings"),
    menuCategories: new QueryBuilder(this, "menu_categories"),
    menuItems: new QueryBuilder(this, "menu_items"),
    roasters: new QueryBuilder(this, "roasters"),
  } as any;
}

class QueryBuilder {
  constructor(private db: FallbackDatabase, private table: string) {}

  async findFirst(options?: { where?: any; with?: any }) {
    const rows = this.db.getRows(this.table);
    const filter = getFilterInfo(options?.where);
    let row = null;
    if (filter) {
      row = rows.find((r: any) => r[filter.columnName] === filter.value);
    } else {
      row = rows[0] || null;
    }

    if (row && options?.with) {
      row = await this.db.populateRelations(this.table, { ...row }, options.with);
    }
    return row || undefined;
  }

  async findMany(options?: { where?: any; limit?: number; with?: any }) {
    let rows = this.db.getRows(this.table);
    const filter = getFilterInfo(options?.where);
    if (filter) {
      rows = rows.filter((r: any) => r[filter.columnName] === filter.value);
    }
    if (options?.limit !== undefined) {
      rows = rows.slice(0, options.limit);
    }
    if (options?.with) {
      rows = await Promise.all(
        rows.map((r: any) => this.db.populateRelations(this.table, { ...r }, options.with))
      );
    }
    return rows;
  }
}
