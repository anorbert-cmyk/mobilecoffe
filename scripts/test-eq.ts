import { eq } from "drizzle-orm";
import { users } from "../drizzle/schema";

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

const expr = eq(users.openId, "demo-user-001");
console.log("Filter Info:", getFilterInfo(expr));
