import { Injectable, signal } from '@angular/core';
import { LogService } from './log.service';

/**
 * @generatedInfoDoc
 * InfoDoc: class `TableService` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/table.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




@Injectable({
  providedIn: 'root'
})
export class TableService {
  // Signals to track active state
  public activeCell = signal<HTMLTableCellElement | null>(null);
  public activeTable = signal<HTMLTableElement | null>(null);

    /**
 * @generatedInfoDoc
 * InfoDoc: constructor for class `TableService` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/table.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




constructor(private readonly logService: LogService) {}

  /**
   * Inserts a table with specified rows and columns at the cursor.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `TableService`.`insertTable()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/table.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




public insertTable(rows: number, cols: number): void {
    if (rows <= 0 || cols <= 0) {
      this.logService.warn('TableService: Rows and columns must be greater than 0.');
      return;
    }

    let html = `<table style="border-collapse: collapse; width: 100%; border: 1px solid #ccc; margin: 10px 0;">`;
    html += `<tbody>`;
    for (let r = 0; r < rows; r++) {
      html += `<tr>`;
      for (let c = 0; c < cols; c++) {
        html += `<td style="border: 1px solid #ccc; padding: 8px; min-width: 50px; height: 30px; vertical-align: top;">&nbsp;</td>`;
      }
      html += `</tr>`;
    }
    html += `</tbody>`;
    html += `</table>`;

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const fragment = document.createRange().createContextualFragment(html);
      range.deleteContents();
      range.insertNode(fragment);
      this.logService.info(`Inserted table with ${rows} rows and ${cols} columns.`);
    } else {
      this.logService.error('TableService: Selection is invalid.');
    }
  }

  /**
   * Updates the active table and cell based on the current selection node.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `TableService`.`updateTableState()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/table.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




public updateTableState(focusNode: Node | null): void {
    let cellNode: HTMLTableCellElement | null = null;
    let tableNode: HTMLTableElement | null = null;
    let currentNode = focusNode;

    while (currentNode) {
      if (currentNode.nodeType !== Node.ELEMENT_NODE) {
        currentNode = currentNode.parentNode;
        continue;
      }

      const element = currentNode as HTMLElement;
      if (this.isTableCellElement(element)) {
        cellNode = element;
      }

      if (element instanceof HTMLTableElement) {
        tableNode = element;
        break;
      }

      if (element.contentEditable === 'true') {
        break;
      }

      currentNode = currentNode.parentNode;
    }

    this.activeCell.set(cellNode);
    this.activeTable.set(tableNode);
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `TableService`.`isTableCellElement()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/table.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */


private isTableCellElement(element: HTMLElement): element is HTMLTableCellElement {
    return element instanceof HTMLTableCellElement;
  }

  /**
   * Adds a row above the active row.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `TableService`.`addRowAbove()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/table.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




public addRowAbove(): void {
    const cell = this.activeCell();
    const table = this.activeTable();
    if (!cell || !table) return;

    const row = cell.parentElement as HTMLTableRowElement;
    const rowIndex = row.rowIndex;
    const newRow = table.insertRow(rowIndex);
    
    // Copy the number of cells from the reference row
    const cellCount = row.cells.length;
    for (let i = 0; i < cellCount; i++) {
      const newCell = newRow.insertCell();
      this.applyDefaultCellStyles(newCell);
    }
    this.logService.info('Added row above.');
  }

  /**
   * Adds a row below the active row.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `TableService`.`addRowBelow()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/table.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




public addRowBelow(): void {
    const cell = this.activeCell();
    const table = this.activeTable();
    if (!cell || !table) return;

    const row = cell.parentElement as HTMLTableRowElement;
    const rowIndex = row.rowIndex;
    const newRow = table.insertRow(rowIndex + 1);

    const cellCount = row.cells.length;
    for (let i = 0; i < cellCount; i++) {
      const newCell = newRow.insertCell();
      this.applyDefaultCellStyles(newCell);
    }
    this.logService.info('Added row below.');
  }

  /**
   * Deletes the active row.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `TableService`.`deleteRow()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/table.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




public deleteRow(): void {
    const cell = this.activeCell();
    const table = this.activeTable();
    if (!cell || !table) return;

    const row = cell.parentElement as HTMLTableRowElement;
    const rowIndex = row.rowIndex;
    table.deleteRow(rowIndex);

    // If no rows left, delete the table
    if (table.rows.length === 0) {
      table.remove();
      this.activeCell.set(null);
      this.activeTable.set(null);
    } else {
      // Focus on cell above or below
      const focusRowIndex = Math.min(rowIndex, table.rows.length - 1);
      const focusCell = table.rows[focusRowIndex].cells[0] as HTMLTableCellElement;
      this.activeCell.set(focusCell);
    }
    this.logService.info('Deleted row.');
  }

  /**
   * Adds a column before the active column.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `TableService`.`addColumnBefore()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/table.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




public addColumnBefore(): void {
    const cell = this.activeCell();
    const table = this.activeTable();
    if (!cell || !table) return;

    const cellIndex = cell.cellIndex;
    for (let r = 0; r < table.rows.length; r++) {
      const row = table.rows[r];
      const newCell = row.insertCell(cellIndex);
      this.applyDefaultCellStyles(newCell);
    }
    this.logService.info('Added column before.');
  }

  /**
   * Adds a column after the active column.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `TableService`.`addColumnAfter()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/table.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




public addColumnAfter(): void {
    const cell = this.activeCell();
    const table = this.activeTable();
    if (!cell || !table) return;

    const cellIndex = cell.cellIndex;
    for (let r = 0; r < table.rows.length; r++) {
      const row = table.rows[r];
      const newCell = row.insertCell(cellIndex + 1);
      this.applyDefaultCellStyles(newCell);
    }
    this.logService.info('Added column after.');
  }

  /**
   * Deletes the active column.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `TableService`.`deleteColumn()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/table.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




public deleteColumn(): void {
    const cell = this.activeCell();
    const table = this.activeTable();
    if (!cell || !table) return;

    const cellIndex = cell.cellIndex;
    for (let r = 0; r < table.rows.length; r++) {
      table.rows[r].deleteCell(cellIndex);
    }

    // Check if rows have no cells left, if so delete the table
    if (table.rows[0]?.cells.length === 0) {
      table.remove();
      this.activeCell.set(null);
      this.activeTable.set(null);
    } else {
      const focusCellIndex = Math.min(cellIndex, table.rows[0].cells.length - 1);
      const focusCell = table.rows[0].cells[focusCellIndex] as HTMLTableCellElement;
      this.activeCell.set(focusCell);
    }
    this.logService.info('Deleted column.');
  }

  /**
   * Sets the horizontal text alignment of the active cell.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `TableService`.`setCellAlignment()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/table.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




public setCellAlignment(alignment: 'left' | 'center' | 'right' | 'justify'): void {
    const cell = this.activeCell();
    if (!cell) return;
    cell.style.textAlign = alignment;
    this.logService.info(`Aligned cell text horizontally: ${alignment}`);
  }

  /**
   * Sets the vertical alignment of the active cell.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `TableService`.`setCellVerticalAlignment()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/table.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




public setCellVerticalAlignment(alignment: 'top' | 'middle' | 'bottom'): void {
    const cell = this.activeCell();
    if (!cell) return;
    cell.style.verticalAlign = alignment;
    this.logService.info(`Aligned cell text vertically: ${alignment}`);
  }

  /**
   * Sets the cell border style (solid, dashed, none).
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `TableService`.`setCellBorder()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/table.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




public setCellBorder(style: 'solid' | 'dashed' | 'none'): void {
    const cell = this.activeCell();
    if (!cell) return;

    if (style === 'none') {
      cell.style.border = 'none';
    } else {
      cell.style.border = `1px ${style} #ccc`;
    }
    this.logService.info(`Set cell border style to ${style}`);
  }

  /**
   * Sets the background color of the active cell.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `TableService`.`setCellBackgroundColor()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/table.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




public setCellBackgroundColor(color: string): void {
    const cell = this.activeCell();
    if (!cell) return;
    cell.style.backgroundColor = color;
    this.logService.info(`Set cell background color: ${color}`);
  }

  /**
   * Merges the active cell with the cell to its right.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `TableService`.`mergeRight()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/table.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




public mergeRight(): void {
    const cell = this.activeCell();
    if (!cell) return;

    const nextCell = cell.nextElementSibling as HTMLTableCellElement;
    if (!nextCell) {
      this.logService.warn('TableService: No sibling cell found to the right.');
      return;
    }

    // Combine contents
    cell.innerHTML += (nextCell.innerHTML === '&nbsp;' ? '' : ' ' + nextCell.innerHTML);
    
    // Sum col spans
    const colSpan1 = cell.colSpan || 1;
    const colSpan2 = nextCell.colSpan || 1;
    cell.colSpan = colSpan1 + colSpan2;

    nextCell.remove();
    this.logService.info('Merged cell with right neighbor.');
  }

  /**
   * Merges the active cell with the cell directly below it.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `TableService`.`mergeDown()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/table.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




public mergeDown(): void {
    const cell = this.activeCell();
    const table = this.activeTable();
    if (!cell || !table) return;

    const row = cell.parentElement as HTMLTableRowElement;
    const rowIndex = row.rowIndex;
    const cellIndex = cell.cellIndex;

    const nextRow = table.rows[rowIndex + 1];
    if (!nextRow) {
      this.logService.warn('TableService: No row found below active cell.');
      return;
    }

    const cellBelow = nextRow.cells[cellIndex] as HTMLTableCellElement;
    if (!cellBelow) {
      this.logService.warn('TableService: No cell found directly below active cell.');
      return;
    }

    // Combine contents
    cell.innerHTML += (cellBelow.innerHTML === '&nbsp;' ? '' : ' ' + cellBelow.innerHTML);

    // Sum row spans
    const rowSpan1 = cell.rowSpan || 1;
    const rowSpan2 = cellBelow.rowSpan || 1;
    cell.rowSpan = rowSpan1 + rowSpan2;

    cellBelow.remove();
    this.logService.info('Merged cell with below neighbor.');
  }

  /**
   * Splits the active cell back to 1x1 columns/rows and inserts blank cells.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `TableService`.`splitCell()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/table.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




public splitCell(): void {
    const cell = this.activeCell();
    const table = this.activeTable();
    if (!cell || !table) return;

    const colSpan = cell.colSpan || 1;
    const rowSpan = cell.rowSpan || 1;

    if (colSpan === 1 && rowSpan === 1) {
      this.logService.warn('TableService: Cell is already split.');
      return;
    }

    const row = cell.parentElement as HTMLTableRowElement;
    const cellIndex = cell.cellIndex;

    // Reset spans
    cell.colSpan = 1;
    cell.rowSpan = 1;

    // Add extra cells horizontally in the current row
    for (let c = 1; c < colSpan; c++) {
      const newCell = row.insertCell(cellIndex + 1);
      this.applyDefaultCellStyles(newCell);
    }

    // Add extra cells vertically in the rows below
    const rowIndex = row.rowIndex;
    for (let r = 1; r < rowSpan; r++) {
      const belowRow = table.rows[rowIndex + r];
      if (belowRow) {
        // Insert new cells at the corresponding column position
        for (let c = 0; c < colSpan; c++) {
          const newCell = belowRow.insertCell(cellIndex);
          this.applyDefaultCellStyles(newCell);
        }
      }
    }

    this.logService.info('Split cell.');
  }

  /**
   * Helper to set default styles on newly inserted table cells.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `TableService`.`applyDefaultCellStyles()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/table.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */




private applyDefaultCellStyles(cell: HTMLTableCellElement): void {
    cell.style.border = '1px solid #ccc';
    cell.style.padding = '8px';
    cell.style.minWidth = '50px';
    cell.style.height = '30px';
    cell.style.verticalAlign = 'top';
    cell.innerHTML = '&nbsp;';
  }
}
