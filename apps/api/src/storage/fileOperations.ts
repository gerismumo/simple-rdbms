import { SerializationType } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { SerializedDatabase } from "./serialization";

export function existsDirectory(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function saveToFile(filePath: string, data: SerializedDatabase): void {
  const dir = path.dirname(filePath);
  existsDirectory(dir);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function listFiles(dirPath: string, pattern?: RegExp): string[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  
  const files = fs.readdirSync(dirPath);
  
  if (pattern) {
    return files.filter(f => pattern.test(f)).sort().reverse();
  }
  
  return files.sort();
}

export function loadFromFile(filePath: string): SerializedDatabase | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}