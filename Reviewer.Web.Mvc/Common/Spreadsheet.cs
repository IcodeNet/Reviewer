
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;

namespace Reviewer.Web.Mvc.Common
{
    public class Spreadsheet
    {
        const int startcustomNumFormatId = 164;

        public static string EncodeFileName(string fileName)
        {
            fileName = HttpUtility.UrlEncode(fileName, Encoding.UTF8).Replace("+", "").Replace(" ", String.Empty);

            if (HttpContext.Current.Request.UserAgent.ToLower().Contains("msie"))
            {
                var sb = new StringBuilder();
                var chArr = fileName.ToCharArray();

                for (var j = 0; j < chArr.Length; j++)
                {
                    if (chArr[j] == '.' && j != fileName.LastIndexOf("."))
                    {
                        sb.Append("%2E");
                    }
                    else
                    {
                        sb.Append(chArr[j]);
                    }
                }

                fileName = sb.ToString();
            }

            return "\"" + fileName + "\"";
        }

        public static void Create(HttpContext context, DataTable dt)
        {
            if (string.IsNullOrWhiteSpace(dt.TableName))
            {
                dt.TableName = Guid.NewGuid().ToString();
            }
            using (MemoryStream mem = new MemoryStream())
            {
                using (SpreadsheetDocument spreadsheetDocument = SpreadsheetDocument.Create(mem, DocumentFormat.OpenXml.SpreadsheetDocumentType.Workbook))
                {
                    Save(spreadsheetDocument, dt);
                }

                context.Response.Clear();
                context.Response.AppendHeader("Content-Disposition", String.Format("inline; filename={0}", EncodeFileName(dt.TableName + ".xlsx")));
                context.Response.AppendHeader("content-length", mem.Length.ToString());
                context.Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                context.Response.BufferOutput = false;

                mem.WriteTo(context.Response.OutputStream);
                context.Response.End();
            }
        }

        public static void Create(DataTable dataTable, string filePath, SpreadsheetProgressEventHandler eventHandler = null)
        {
            if (string.IsNullOrWhiteSpace(dataTable.TableName))
            {
                dataTable.TableName = Guid.NewGuid().ToString();
            }
            using (SpreadsheetDocument spreadsheetDocument = SpreadsheetDocument.Create(filePath, DocumentFormat.OpenXml.SpreadsheetDocumentType.Workbook))
            {
                Save(spreadsheetDocument, dataTable, eventHandler);
            }
        }

        private static void Save(SpreadsheetDocument spreadsheetDocument, DataTable table, SpreadsheetProgressEventHandler eventHandler = null)
        {
            // Add a WorkbookPart to the document.
            WorkbookPart workbookpart = spreadsheetDocument.AddWorkbookPart();
            workbookpart.Workbook = new Workbook();

            // Add a WorksheetPart to the WorkbookPart.
            WorksheetPart worksheetPart = workbookpart.AddNewPart<WorksheetPart>();
            worksheetPart.Worksheet = new Worksheet(new SheetData());

            // Add Sheets to the Workbook.
            Sheets sheets = spreadsheetDocument.WorkbookPart.Workbook.AppendChild<Sheets>(new Sheets());
            SharedStringTablePart shareStringPart;

            if (spreadsheetDocument.WorkbookPart.GetPartsOfType<SharedStringTablePart>().Count() > 0)
            {
                shareStringPart = spreadsheetDocument.WorkbookPart.GetPartsOfType<SharedStringTablePart>().First();
            }
            else
            {
                shareStringPart = spreadsheetDocument.WorkbookPart.AddNewPart<SharedStringTablePart>();
            }

            // Append a new worksheet and associate it with the workbook.
            Sheet sheet = new Sheet() { Id = spreadsheetDocument.WorkbookPart.GetIdOfPart(worksheetPart), SheetId = 1, Name = "mySheet" };
            sheets.Append(sheet);
            string column;
            uint row = 2;
            int index;
            Cell cell;

            foreach (DataRow datarow in table.Rows)
            {
                if (eventHandler != null)
                {
                    SpreadsheetProgressEventArgs eventArgs = new SpreadsheetProgressEventArgs()
                    {
                        RowIndex = (int)row,
                        RowCount = table.Rows.Count
                    };

                    eventHandler(null, eventArgs);
                }

                for (int columnIndex = 0; columnIndex < table.Columns.Count; columnIndex++)
                {
                    if (columnIndex >= 26)
                    {
                        column = "A" + Convert.ToString(Convert.ToChar(65 + columnIndex - 26));
                    }
                    else
                    {
                        column = Convert.ToString(Convert.ToChar(65 + columnIndex));
                    }

                    if (row == 2)
                    {
                        index = InsertSharedStringItem(table.Columns[columnIndex].ColumnName, shareStringPart);
                        cell = InsertCellInWorksheet(column, row - 1, worksheetPart);
                        cell.CellValue = new CellValue(index.ToString());
                        cell.DataType = new EnumValue<CellValues>(CellValues.SharedString);
                    }

                    if (datarow[columnIndex] is string || datarow[columnIndex] is DateTime || datarow[columnIndex] is bool)
                    {
                        // Insert the text into the SharedStringTablePart.
                        index = InsertSharedStringItem(Convert.ToString(datarow[columnIndex]), shareStringPart);
                        cell = InsertCellInWorksheet(column, row, worksheetPart);
                        cell.CellValue = new CellValue(index.ToString());
                        cell.DataType = new EnumValue<CellValues>(CellValues.SharedString);
                    }
                    else
                    {
                        cell = InsertCellInWorksheet(column, row, worksheetPart);
                        SetCellData(cell, datarow[columnIndex]);
                    }
                }

                row++;
            }

            worksheetPart.Worksheet.Save();

            //Save the sheet changes
            workbookpart.Workbook.Save();

            // Close the document.
            spreadsheetDocument.Close();
        }

        private static void SetCellData(Cell cell, object data)
        {
            if (data is DateTime)
            {
                cell.CellValue = new CellValue(((DateTime)data).ToOADate().ToString());
                cell.DataType = CellValues.Number;
            }
            else
            {
                cell.CellValue = new CellValue(data.ToString());

                if (data is int || data is decimal)
                {
                    cell.DataType = new EnumValue<CellValues>(CellValues.Number);
                }
                else if (data is bool)
                {
                    cell.DataType = new EnumValue<CellValues>(CellValues.Boolean);
                }
                else
                {
                    cell.DataType = new EnumValue<CellValues>(CellValues.SharedString);
                }
            }
        }

        private static int InsertSharedStringItem(string text, SharedStringTablePart shareStringPart)
        {
            // If the part does not contain a SharedStringTable, create one.
            if (shareStringPart.SharedStringTable == null)
            {
                shareStringPart.SharedStringTable = new SharedStringTable();
            }
            int i = 0;

            // Iterate through all the items in the SharedStringTable. If the text already exists, return its index.
            foreach (SharedStringItem item in shareStringPart.SharedStringTable.Elements<SharedStringItem>())
            {
                if (item.InnerText == text)
                {
                    return i;
                }
                i++;
            }

            // The text does not exist in the part. Create the SharedStringItem and return its index.
            shareStringPart.SharedStringTable.AppendChild(new SharedStringItem(new DocumentFormat.OpenXml.Spreadsheet.Text(text)));
            shareStringPart.SharedStringTable.Save();
            return i;
        }

        private static Cell InsertCellInWorksheet(string columnName, uint rowIndex, WorksheetPart worksheetPart)
        {
            Worksheet worksheet = worksheetPart.Worksheet;
            SheetData sheetData = worksheet.GetFirstChild<SheetData>();
            string cellReference = columnName + rowIndex;

            // If the worksheet does not contain a row with the specified row index, insert one.
            Row row;
            if (sheetData.Elements<Row>().Where(r => r.RowIndex == rowIndex).Count() != 0)
            {
                row = sheetData.Elements<Row>().Where(r => r.RowIndex == rowIndex).First();
            }
            else
            {
                row = new Row() { RowIndex = rowIndex };
                sheetData.Append(row);
            }

            // If there is not a cell with the specified column name, insert one. 
            if (row.Elements<Cell>().Where(c => c.CellReference.Value == columnName + rowIndex).Count() > 0)
            {
                return row.Elements<Cell>().Where(c => c.CellReference.Value == cellReference).First();
            }
            else
            {
                // Cells must be in sequential order according to CellReference. Determine where to insert the new cell.
                Cell refCell = null;
                Cell newCell = new Cell() { CellReference = cellReference };
                row.InsertBefore(newCell, refCell);
                // worksheet.Save();
                return newCell;
            }
        }

        #region "Stylesheet"
        /// <summary>
        /// Creates new font with specified format
        /// </summary>
        /// <param name="styleSheet">Stylesheet in which new font needs to be added</param>
        /// <param name="fontName">Font family name</param>
        /// <param name="fontSize">Size of font</param>
        /// <param name="isBold">Boldness of font
        /// True - Bold font
        /// False - Normal font
        /// </param>
        /// <param name="foreColor">Fore color of font</param>
        /// <returns>Index of newly created font</returns>
        private static UInt32Value CreateFont(
            Stylesheet styleSheet,
            string fontName,
            double? fontSize,
            bool isBold,
            System.Drawing.Color foreColor)
        {

            Font font = new Font();

            if (!string.IsNullOrEmpty(fontName))
            {
                FontName name = new FontName()
                {
                    Val = fontName
                };
                font.Append(name);
            }

            if (fontSize.HasValue)
            {
                FontSize size = new FontSize()
                {
                    Val = fontSize.Value
                };
                font.Append(size);
            }

            if (isBold == true)
            {
                Bold bold = new Bold();
                font.Append(bold);
            }


            Color color = new Color()
            {
                Rgb = new HexBinaryValue()
                {
                    Value =
                        System.Drawing.ColorTranslator.ToHtml(
                            System.Drawing.Color.FromArgb(
                                foreColor.A,
                                foreColor.R,
                                foreColor.G,
                                foreColor.B)).Replace("#", "")
                }
            };
            font.Append(color);

            if (styleSheet.Fonts == null)
            {
                styleSheet.Fonts = new Fonts();
                styleSheet.Fonts.Count = 0;
            }

            styleSheet.Fonts.Append(font);
            UInt32Value result = styleSheet.Fonts.Count;
            styleSheet.Fonts.Count++;
            return result;
        }

        /// <summary>
        /// Create new fill with specified format
        /// </summary>
        /// <param name="styleSheet">Stylesheet in which new fill needs to be added</param>
        /// <param name="fillColor">Color of fill</param>
        /// <returns>Index of newly created fill</returns>
        private static UInt32Value CreateFill(
            Stylesheet styleSheet,
            System.Drawing.Color fillColor)
        {


            PatternFill patternFill =
                new PatternFill(
                    new ForegroundColor()
                    {
                        Rgb = new HexBinaryValue()
                        {
                            Value =
                            System.Drawing.ColorTranslator.ToHtml(
                                System.Drawing.Color.FromArgb(
                                    fillColor.A,
                                    fillColor.R,
                                    fillColor.G,
                                    fillColor.B)).Replace("#", "")
                        }
                    });

            patternFill.PatternType = fillColor ==
                        System.Drawing.Color.White ? PatternValues.None : PatternValues.LightDown;

            Fill fill = new Fill(patternFill);

            if (styleSheet.Fills == null)
            {
                styleSheet.Fills = new Fills();
                styleSheet.Fills.Count = 0;
            }

            styleSheet.Fills.Append(fill);

            UInt32Value result = styleSheet.Fills.Count;
            styleSheet.Fills.Count++;
            return result;
        }

        /// <summary>
        /// Creates number format with specified format
        /// </summary>
        /// <param name="styleSheet">Stylesheet in which new number format needs to be added</param>
        /// <param name="formatSpec">Format specification</param>
        /// <returns>Id of newly created number format</returns>
        private static UInt32Value CreateNumberFormat(
            Stylesheet styleSheet,
            string formatSpec)
        {
            UInt32Value numFormatID = null;

            if (styleSheet.NumberingFormats != null)
            {
                numFormatID = UInt32Value.FromUInt32(startcustomNumFormatId + styleSheet.NumberingFormats.Count);
            }
            else
            {
                numFormatID = UInt32Value.FromUInt32(startcustomNumFormatId);
                styleSheet.NumberingFormats = new NumberingFormats();
                styleSheet.NumberingFormats.Count = 0;
            }

            NumberingFormat numFormat = new NumberingFormat();
            numFormat.NumberFormatId = numFormatID.Value;
            numFormat.FormatCode = formatSpec;

            styleSheet.NumberingFormats.Append(numFormat);

            styleSheet.NumberingFormats.Count++;
            return numFormatID;
        }

        /// <summary>
        /// Creates new cell format with specified format
        /// </summary>
        /// <param name="styleSheet">Stylesheet in which new cell format needs to be added</param>
        /// <param name="fontIndex">Index of font for cell formating</param>
        /// <param name="fillIndex">Index of fill for cell formating</param>
        /// <param name="numberFormatId">Numberformat id for cell formating</param>
        /// <param name="alignment">Alignment for cell formating</param>
        /// <returns>Styleindex for newly created cell format</returns>
        private static UInt32Value CreateCellFormat(
            Stylesheet styleSheet,
            UInt32Value fontIndex,
            UInt32Value fillIndex,
            UInt32Value numberFormatId,
            Alignment alignment)
        {
            CellFormat cellFormat = new CellFormat();


            if (fontIndex != null)
                cellFormat.FontId = fontIndex;

            if (fillIndex != null)
                cellFormat.FillId = fillIndex;

            if (numberFormatId != null)
            {
                cellFormat.NumberFormatId = numberFormatId;
                cellFormat.ApplyNumberFormat = BooleanValue.FromBoolean(true);
            }
            if (alignment != null)
            {
                cellFormat.Alignment = alignment;
                cellFormat.ApplyAlignment = BooleanValue.FromBoolean(true);
            }

            if (styleSheet.CellFormats == null)
            {
                styleSheet.CellFormats = new CellFormats();
                styleSheet.CellFormats.Count = 0;
            }
            cellFormat.FormatId = 0;
            styleSheet.CellFormats.Append(cellFormat);

            UInt32Value result = styleSheet.CellFormats.Count;
            styleSheet.CellFormats.Count++;
            return result;
        }
        #endregion

        #region "CommonFunctionality"
        /// <summary>
        /// Return worksheetpart as per given sheetname from excel file.
        /// </summary>
        /// <param name="spreadsheetDocument">Excel file from which sheetpart needs to be extracted</param>
        /// <param name="sheetName">Name of the sheet to be extracted</param>
        /// <returns>Worksheetpart as per the given sheetname</returns>
        private static WorksheetPart GetWorksheetPartByName(
            SpreadsheetDocument spreadsheetDocument,
            string sheetName)
        {
            IEnumerable<Sheet> sheets =
               spreadsheetDocument.WorkbookPart.Workbook.GetFirstChild<Sheets>().
               Elements<Sheet>().Where(s => s.Name == sheetName);

            if (sheets.Count() == 0)
            {
                // The specified worksheet does not exist.

                return null;
            }

            string relationshipId = sheets.First().Id.Value;
            WorksheetPart worksheetPart = (WorksheetPart)
                 spreadsheetDocument.WorkbookPart.GetPartById(relationshipId);
            return worksheetPart;
        }

        /// <summary>
        /// Flush the cached values for all cells for which formula is not null from the given excel file
        /// </summary>
        /// <param name="spreadsheetDocument">Excel file from which flushing of cached values needs to be done</param>
        private static void FlushCachedValues(
            SpreadsheetDocument spreadsheetDocument)
        {
            spreadsheetDocument.WorkbookPart.WorksheetParts
                .SelectMany(part => part.Worksheet.Elements<SheetData>())
                .SelectMany(data => data.Elements<Row>())
                .SelectMany(row => row.Elements<Cell>())
                .Where(cell => cell.CellFormula != null)
                .Where(cell => cell.CellValue != null)
                .ToList()
                .ForEach(cell => cell.CellValue.Remove())
                ;

        }
        #endregion

    }
}

