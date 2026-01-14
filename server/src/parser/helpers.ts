export function parseValue(value: string): any {
  if (value.toLowerCase() === "true") return true;
  if (value.toLowerCase() === "false") return false;
  if (value.toLowerCase() === "null") return null;
  if (/^-?\d+$/.test(value)) return parseInt(value);
  if (/^-?\d+\.\d+$/.test(value)) return parseFloat(value);
  return value;
}

export function parseValues(valuesStr: string): any[] {
  const values: any[] = [];
  let current = "";
  let inString = false;
  let stringChar = "";

  for (let i = 0; i < valuesStr.length; i++) {
    const char = valuesStr[i];

    if ((char === '"' || char === "'") && !inString) {
      inString = true;
      stringChar = char;
    } else if (char === stringChar && inString) {
      inString = false;
      values.push(current);
      current = "";
    } else if (char === "," && !inString) {
      if (current.trim()) {
        values.push(parseValue(current.trim()));
        current = "";
      }
    } else if (inString) {
      current += char;
    } else if (char !== " " || current) {
      current += char;
    }
  }

  if (current.trim()) {
    values.push(parseValue(current.trim()));
  }

  return values;
}

export function parseWhere(whereStr: string): Record<string, any> {
  const conditions: Record<string, any> = {};
  const cleanWhere = whereStr.replace(/;\s*$/, '');

  const parts = cleanWhere.split(/\s+AND\s+/i);
  
  parts.forEach(part => {
    const match = part.match(/(\w+)\s*=\s*(.+)/);
    if (match) {
      const column = match[1];
      const value = parseValue(match[2].replace(/^['"]|['"]$/g, ''));
      conditions[column] = value;
    }
  });

  return conditions;
}


export function parseSet(setStr: string): Record<string, any> {
  const updates: Record<string, any> = {};
  const parts = setStr.split(',');
  
  parts.forEach(part => {
    const match = part.match(/(\w+)\s*=\s*(.+)/);
    if (match) {
      const column = match[1].trim();
      const value = parseValue(match[2].trim().replace(/^['"]|['"]$/g, ''));
      updates[column] = value;
    }
  });

  return updates;
}

