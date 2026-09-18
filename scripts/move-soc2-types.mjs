import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data/frameworks/soc2.ts");
let content = fs.readFileSync(filePath, "utf-8");

// Find the line "  soc2Types: SOC2_TYPES,\n};" - we need to extract the const definitions before the export const soc2

// First, find where SOC2_TYPES is defined (the const at the end)
const constStart = content.indexOf("// ===================================================================\n// SOC 2 Type I vs Type II question sets");
if (constStart === -1) {
  console.log("Const block not found, looking for SOC2_TYPE_I_QUESTIONS");
  const idx = content.indexOf("const SOC2_TYPE_I_QUESTIONS");
  if (idx === -1) throw new Error("Block not found");
}

// Extract the constant block (from comment header to end of file)
const constBlockStart = content.indexOf("// ===================================================================\n// SOC 2 Type I vs Type II question sets");
const constBlock = content.slice(constBlockStart);

// Now find the framework export end (the "};\n" right after "soc2Types: SOC2_TYPES,")
const frameworkEnd = content.indexOf("  soc2Types: SOC2_TYPES,\n};") + "  soc2Types: SOC2_TYPES,\n};".length;

// Reassemble: header + constants + Framework export
const header = content.slice(0, constBlockStart);
const framework = content.slice(constBlockStart, frameworkEnd);
const tail = content.slice(frameworkEnd);

const newContent = header + constBlock + "\n" + framework + tail;

fs.writeFileSync(filePath, newContent);
console.log("Moved const block before framework export");
console.log("Total lines:", newContent.split("\n").length);