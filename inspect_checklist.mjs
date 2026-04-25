import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "D:/Jolly/Products/Book_To_Action.xlsx";
const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.getItemAt(0);

const inspection = await workbook.inspect({
  kind: "table",
  sheetId: sheet.id,
  range: "A1:F120",
  include: "values",
  tableMaxRows: 120,
  tableMaxCols: 6,
  maxChars: 20000
});

console.log(inspection.ndjson);
