import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data/frameworks/soc2.ts");
let content = fs.readFileSync(filePath, "utf-8");

// Fix 1: Remove duplicate import at line 17
const dupImport = `import { Framework, SOC2TypeInfo } from "@/lib/types";`;
if (content.includes(dupImport)) {
  content = content.replace(dupImport + "\n", "");
  console.log("Removed duplicate import");
}

// Fix 2: Fix the stray comma at line 131: ",\n  soc2Types: SOC2_TYPES,\n};" should be "\n  soc2Types: SOC2_TYPES,\n};"
const stray = "  ],\n,\n  soc2Types: SOC2_TYPES,\n};";
if (content.includes(stray)) {
  content = content.replace(stray, "  ],\n  soc2Types: SOC2_TYPES,\n};");
  console.log("Fixed stray comma");
}

fs.writeFileSync(filePath, content);
console.log("Total lines:", content.split("\n").length);