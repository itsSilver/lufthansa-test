import { writeFile } from 'node:fs/promises';

const SOURCE_URL =
  'https://davidmegginson.github.io/ourairports-data/airports.csv';
const OUTPUT = new URL('../src/data/airports.json', import.meta.url);
const CITY_OVERRIDES = { TIA: 'Tirana' };

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (char !== '\r') {
      field += char;
    }
  }
  if (field || row.length) rows.push([...row, field]);
  return rows;
}

const response = await fetch(SOURCE_URL);
if (!response.ok) throw new Error(`Download failed: ${response.status}`);

const [header, ...rows] = parseCsv(await response.text());
const column = Object.fromEntries(header.map((name, index) => [name, index]));

const airports = rows
  .filter(
    (row) =>
      ['large_airport', 'medium_airport'].includes(row[column.type]) &&
      row[column.scheduled_service] === 'yes' &&
      /^[A-Z]{3}$/.test(row[column.iata_code]),
  )
  .map((row) => ({
    code: row[column.iata_code],
    name: row[column.name],
    city:
      CITY_OVERRIDES[row[column.iata_code]] ??
      (row[column.municipality] || row[column.name]).replace(/\s*\(.*\)$/, ''),
    country: row[column.iso_country],
    lat: Math.round(Number(row[column.latitude_deg]) * 100) / 100,
    lon: Math.round(Number(row[column.longitude_deg]) * 100) / 100,
  }))
  .sort((a, b) => a.code.localeCompare(b.code));

await writeFile(OUTPUT, JSON.stringify(airports));
console.log(`Wrote ${airports.length} airports to ${OUTPUT.pathname}`);
