import { TestBed } from '@angular/core/testing';
import { TableService } from './table.service';
import { LogService } from './log.service';

describe('TableService', () => {
  let service: TableService;
  let logServiceSpy: jasmine.SpyObj<LogService>;

  beforeEach(() => {
    const logSpy = jasmine.createSpyObj('LogService', ['warn', 'info', 'error', 'debug', 'log']);
    TestBed.configureTestingModule({
      providers: [
        TableService,
        { provide: LogService, useValue: logSpy }
      ]
    });
    service = TestBed.inject(TableService);
    logServiceSpy = TestBed.inject(LogService) as jasmine.SpyObj<LogService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Table Insertion', () => {
    it('should generate table HTML and insert it at cursor selection', () => {
      const mockRange = jasmine.createSpyObj('Range', ['deleteContents', 'insertNode']);
      const mockSelection = jasmine.createSpyObj('Selection', ['getRangeAt']);
      mockSelection.rangeCount = 1;
      mockSelection.getRangeAt.and.returnValue(mockRange);

      spyOn(window, 'getSelection').and.returnValue(mockSelection);

      service.insertTable(3, 4);

      expect(mockRange.deleteContents).toHaveBeenCalled();
      expect(mockRange.insertNode).toHaveBeenCalled();
      expect(logServiceSpy.info).toHaveBeenCalledWith(jasmine.stringContaining('Inserted table'));
    });

    it('should warn and not insert if rows or columns are 0 or negative', () => {
      service.insertTable(0, 3);
      expect(logServiceSpy.warn).toHaveBeenCalled();
    });
  });

  describe('Table State Tracking', () => {
    it('should extract active cell and table from node hierarchy', () => {
      const table = document.createElement('table');
      const tbody = document.createElement('tbody');
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      const text = document.createTextNode('test');

      td.appendChild(text);
      tr.appendChild(td);
      tbody.appendChild(tr);
      table.appendChild(tbody);

      service.updateTableState(text);

      expect(service.activeCell()).toBe(td);
      expect(service.activeTable()).toBe(table);

      // Reset
      service.updateTableState(null);
      expect(service.activeCell()).toBeNull();
      expect(service.activeTable()).toBeNull();
    });
  });

  describe('Table Editing Controls', () => {
    let table: HTMLTableElement;
    let td: HTMLTableCellElement;

    beforeEach(() => {
      table = document.createElement('table');
      const tbody = document.createElement('tbody');
      const tr = document.createElement('tr');
      td = document.createElement('td');
      td.innerHTML = 'Cell 1';
      
      tr.appendChild(td);
      tbody.appendChild(tr);
      table.appendChild(tbody);

      service.activeCell.set(td);
      service.activeTable.set(table);
    });

    it('should add row above and below', () => {
      expect(table.rows.length).toBe(1);

      service.addRowAbove();
      expect(table.rows.length).toBe(2);

      service.addRowBelow();
      expect(table.rows.length).toBe(3);
    });

    it('should delete row', () => {
      service.addRowBelow();
      expect(table.rows.length).toBe(2);

      service.deleteRow();
      expect(table.rows.length).toBe(1);
    });

    it('should add columns before and after', () => {
      expect(table.rows[0].cells.length).toBe(1);

      service.addColumnBefore();
      expect(table.rows[0].cells.length).toBe(2);

      service.addColumnAfter();
      expect(table.rows[0].cells.length).toBe(3);
    });

    it('should delete column', () => {
      service.addColumnAfter();
      expect(table.rows[0].cells.length).toBe(2);

      service.deleteColumn();
      expect(table.rows[0].cells.length).toBe(1);
    });
  });

  describe('Cell Formatting', () => {
    let td: HTMLTableCellElement;

    beforeEach(() => {
      td = document.createElement('td');
      service.activeCell.set(td);
    });

    it('should style cell alignments and background colors', () => {
      service.setCellAlignment('center');
      expect(td.style.textAlign).toBe('center');

      service.setCellVerticalAlignment('bottom');
      expect(td.style.verticalAlign).toBe('bottom');

      service.setCellBackgroundColor('#ff0000');
      expect(td.style.backgroundColor).toBe('rgb(255, 0, 0)');
    });

    it('should style cell borders', () => {
      service.setCellBorder('dashed');
      expect(td.style.border).toContain('dashed');

      service.setCellBorder('none');
      expect(td.style.border === 'none' || td.style.border === '').toBeTrue();
    });
  });

  describe('Cells Merge & Split', () => {
    let table: HTMLTableElement;
    let td1: HTMLTableCellElement;
    let td2: HTMLTableCellElement;

    beforeEach(() => {
      table = document.createElement('table');
      const tbody = document.createElement('tbody');
      const tr = document.createElement('tr');
      td1 = document.createElement('td');
      td1.innerHTML = 'A';
      td2 = document.createElement('td');
      td2.innerHTML = 'B';

      tr.appendChild(td1);
      tr.appendChild(td2);
      tbody.appendChild(tr);
      table.appendChild(tbody);

      service.activeTable.set(table);
      service.activeCell.set(td1);
    });

    it('should merge cells to the right', () => {
      expect(table.rows[0].cells.length).toBe(2);
      service.mergeRight();
      expect(table.rows[0].cells.length).toBe(1);
      expect(td1.colSpan).toBe(2);
      expect(td1.innerHTML).toContain('A B');
    });

    it('should split merged cell', () => {
      service.mergeRight();
      expect(table.rows[0].cells.length).toBe(1);

      service.splitCell();
      expect(table.rows[0].cells.length).toBe(2);
      expect(td1.colSpan).toBe(1);
    });
  });

  describe('Guard clauses – null activeCell / activeTable', () => {
    beforeEach(() => {
      service.activeCell.set(null);
      service.activeTable.set(null);
    });

    it('addRowAbove should do nothing when cell is null', () => {
      expect(() => service.addRowAbove()).not.toThrow();
    });

    it('addRowBelow should do nothing when cell is null', () => {
      expect(() => service.addRowBelow()).not.toThrow();
    });

    it('deleteRow should do nothing when cell is null', () => {
      expect(() => service.deleteRow()).not.toThrow();
    });

    it('addColumnBefore should do nothing when cell is null', () => {
      expect(() => service.addColumnBefore()).not.toThrow();
    });

    it('addColumnAfter should do nothing when cell is null', () => {
      expect(() => service.addColumnAfter()).not.toThrow();
    });

    it('deleteColumn should do nothing when cell is null', () => {
      expect(() => service.deleteColumn()).not.toThrow();
    });

    it('setCellAlignment should do nothing when cell is null', () => {
      expect(() => service.setCellAlignment('center')).not.toThrow();
    });

    it('setCellVerticalAlignment should do nothing when cell is null', () => {
      expect(() => service.setCellVerticalAlignment('top')).not.toThrow();
    });

    it('setCellBorder should do nothing when cell is null', () => {
      expect(() => service.setCellBorder('solid')).not.toThrow();
    });

    it('setCellBackgroundColor should do nothing when cell is null', () => {
      expect(() => service.setCellBackgroundColor('#fff')).not.toThrow();
    });

    it('mergeRight should do nothing when cell is null', () => {
      expect(() => service.mergeRight()).not.toThrow();
    });

    it('mergeDown should do nothing when cell or table is null', () => {
      expect(() => service.mergeDown()).not.toThrow();
    });

    it('splitCell should do nothing when cell is null', () => {
      expect(() => service.splitCell()).not.toThrow();
    });
  });

  describe('deleteRow – removes table when last row is deleted', () => {
    it('should remove table element when last row is deleted', () => {
      const table = document.createElement('table');
      const tbody = document.createElement('tbody');
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      tr.appendChild(td);
      tbody.appendChild(tr);
      table.appendChild(tbody);
      document.body.appendChild(table);

      service.activeCell.set(td);
      service.activeTable.set(table);
      service.deleteRow();

      expect(service.activeCell()).toBeNull();
      expect(service.activeTable()).toBeNull();
      // table is removed by the service itself – no need to clean up
    });
  });

  describe('deleteColumn – removes table when last column is deleted', () => {
    it('should remove table when all cells are gone from a row', () => {
      const table = document.createElement('table');
      const tbody = document.createElement('tbody');
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      tr.appendChild(td);
      tbody.appendChild(tr);
      table.appendChild(tbody);
      document.body.appendChild(table);

      service.activeCell.set(td);
      service.activeTable.set(table);
      service.deleteColumn();

      expect(service.activeCell()).toBeNull();
      expect(service.activeTable()).toBeNull();
    });
  });

  describe('insertTable – no selection branch', () => {
    it('should call logService.error when selection is null', () => {
      spyOn(window, 'getSelection').and.returnValue(null);
      service.insertTable(2, 2);
      expect(logServiceSpy.error).toHaveBeenCalledWith(jasmine.stringContaining('Selection is invalid'));
    });

    it('should call logService.error when selection has no ranges', () => {
      const mockSel = { rangeCount: 0 } as Selection;
      spyOn(window, 'getSelection').and.returnValue(mockSel);
      service.insertTable(2, 2);
      expect(logServiceSpy.error).toHaveBeenCalledWith(jasmine.stringContaining('Selection is invalid'));
    });
  });

  describe('mergeRight – no sibling cell', () => {
    it('should warn when there is no cell to the right', () => {
      const td = document.createElement('td');
      td.innerHTML = 'Only cell';
      const tr = document.createElement('tr');
      tr.appendChild(td);
      const table = document.createElement('table');
      table.appendChild(tr);

      service.activeCell.set(td);
      service.activeTable.set(table);
      service.mergeRight();

      expect(logServiceSpy.warn).toHaveBeenCalledWith(jasmine.stringContaining('No sibling cell'));
    });
  });

  describe('mergeDown – edge cases', () => {
    it('should warn when there is no row below', () => {
      const table = document.createElement('table');
      const tbody = document.createElement('tbody');
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      tr.appendChild(td);
      tbody.appendChild(tr);
      table.appendChild(tbody);

      service.activeCell.set(td);
      service.activeTable.set(table);
      service.mergeDown();

      expect(logServiceSpy.warn).toHaveBeenCalledWith(jasmine.stringContaining('No row found below'));
    });
  });

  describe('splitCell – already split', () => {
    it('should warn when cell has colSpan=1 and rowSpan=1', () => {
      const table = document.createElement('table');
      const tbody = document.createElement('tbody');
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 1;
      td.rowSpan = 1;
      tr.appendChild(td);
      tbody.appendChild(tr);
      table.appendChild(tbody);

      service.activeCell.set(td);
      service.activeTable.set(table);
      service.splitCell();

      expect(logServiceSpy.warn).toHaveBeenCalledWith(jasmine.stringContaining('already split'));
    });
  });

  describe('updateTableState – th and contentEditable boundary', () => {
    it('should detect th as active cell', () => {
      const table = document.createElement('table');
      const thead = document.createElement('thead');
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      const text = document.createTextNode('header');
      th.appendChild(text);
      tr.appendChild(th);
      thead.appendChild(tr);
      table.appendChild(thead);

      service.updateTableState(text);
      expect(service.activeCell()).toBe(th);
      expect(service.activeTable()).toBe(table);
    });

    it('should stop traversal at contentEditable boundary', () => {
      const editor = document.createElement('div');
      editor.contentEditable = 'true';
      const p = document.createElement('p');
      p.textContent = 'text';
      editor.appendChild(p);

      service.updateTableState(p.firstChild);
      expect(service.activeCell()).toBeNull();
      expect(service.activeTable()).toBeNull();
    });
  });
});
