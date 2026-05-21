import { users } from "../drizzle/schema";

console.log("Table keys:", Object.keys(users));
console.log("Table Symbols:", Object.getOwnPropertySymbols(users));
for (const sym of Object.getOwnPropertySymbols(users)) {
  console.log(`Symbol ${sym.toString()}:`, (users as any)[sym]);
}
console.log("Table config keys:", Object.keys((users as any).config || {}));
console.log("Table name via config.name:", (users as any).config?.name);
console.log("Table symbol name:", (users as any)[Symbol.for('drizzle:Name')]);
