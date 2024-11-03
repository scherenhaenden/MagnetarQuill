import { TestBed } from '@angular/core/testing';
import { LogService, LogLevel } from './log.service';

describe('LogService', () => {
  let service: LogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log messages to console when console logging is enabled', () => {
    spyOn(console, 'log');
    service.setConsoleLogging(true);
    service.debug('Test debug message');
    expect(console.log).toHaveBeenCalledWith(jasmine.stringMatching(/\[DEBUG\] Test debug message/));
  });

  it('should not log messages to console when console logging is disabled', () => {
    spyOn(console, 'log');
    service.setConsoleLogging(false);
    service.info('Test info message');
    expect(console.log).not.toHaveBeenCalled();
  });

  it('should store log history and respect the history limit', () => {
    service.setHistoryLimit(3);
    service.debug('Message 1');
    service.info('Message 2');
    service.warn('Message 3');
    service.error('Message 4'); // This should replace the oldest (Message 1)

    const history = service.getHistory();
    expect(history.length).toBe(3);
    expect(history[0].message).toBe('Message 2');
    expect(history[1].message).toBe('Message 3');
    expect(history[2].message).toBe('Message 4');
  });

  it('should clear history when clearHistory is called', () => {
    service.debug('Test message');
    expect(service.getHistory().length).toBeGreaterThan(0);
    service.clearHistory();
    expect(service.getHistory().length).toBe(0);
  });

  it('should correctly disable and enable specific log levels', () => {
    spyOn(console, 'log');
    service.disableLevel('DEBUG');
    service.debug('Debug message should not appear');
    expect(console.log).not.toHaveBeenCalled();

    service.enableLevel('DEBUG');
    service.debug('Debug message should appear');
    expect(console.log).toHaveBeenCalledWith(jasmine.stringMatching(/\[DEBUG\] Debug message should appear/));
  });

  it('should add custom targets and log messages to them', () => {
    const targetSpy = jasmine.createSpy('targetSpy');
    service.addTarget('INFO', targetSpy);
    service.info('Test info message for custom target');
    expect(targetSpy).toHaveBeenCalledWith('Test info message for custom target', 'INFO', jasmine.any(Date));
  });

  it('should format messages correctly', () => {
    spyOn(console, 'log');
    service.setConsoleLogging(true);
    service.error('Test error message');
    expect(console.log).toHaveBeenCalledWith(jasmine.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] \[ERROR\] Test error message/));
  });

  it('should not log messages of disabled levels to custom targets', () => {
    const targetSpy = jasmine.createSpy('targetSpy');
    service.addTarget('DEBUG', targetSpy);
    service.disableLevel('DEBUG');
    service.debug('Debug message for disabled level');
    expect(targetSpy).not.toHaveBeenCalled();
  });

  it('should not exceed history limit when logging multiple messages', () => {
    service.setHistoryLimit(2);
    service.info('First message');
    service.info('Second message');
    service.info('Third message');

    const history = service.getHistory();
    expect(history.length).toBe(2);
    expect(history[0].message).toBe('Second message');
    expect(history[1].message).toBe('Third message');
  });
});
