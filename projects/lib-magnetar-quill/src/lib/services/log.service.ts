import { Injectable } from '@angular/core';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
export type LogTarget = (message: string, level: LogLevel, timestamp: Date) => void;

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private targets: Map<LogLevel, LogTarget[]> = new Map();
  private logHistory: Array<{ level: LogLevel, message: string, timestamp: Date }> = [];
  private enabledLevels: Set<LogLevel> = new Set(['DEBUG', 'INFO', 'WARN', 'ERROR']);
  private consoleEnabled: boolean = true;
  private historyLimit: number = 100;

  constructor() { }

  /**
   * Registers a log target for a specific level.
   * @param level - The log level (DEBUG, INFO, WARN, ERROR).
   * @param target - A function to handle log messages at the specified level.
   */
  public addTarget(level: LogLevel, target: LogTarget): void {
    if (!this.targets.has(level)) {
      this.targets.set(level, []);
    }
    this.targets.get(level)?.push(target);
  }

  /**
   * Enables or disables console logging.
   * @param enabled - If true, enables console logging; otherwise, disables it.
   */
  public setConsoleLogging(enabled: boolean): void {
    this.consoleEnabled = enabled;
  }

  /**
   * Enables a specific log level.
   * @param level - The log level to enable.
   */
  public enableLevel(level: LogLevel): void {
    this.enabledLevels.add(level);
  }

  /**
   * Disables a specific log level.
   * @param level - The log level to disable.
   */
  public disableLevel(level: LogLevel): void {
    this.enabledLevels.delete(level);
  }

  /**
   * Logs a message at a specific level.
   * @param level - The log level (DEBUG, INFO, WARN, ERROR).
   * @param message - The message to log.
   */
  public log(level: LogLevel, message: string): void {
    if (!this.enabledLevels.has(level)) return;
    const timestamp = new Date();

    // Store in history
    this.logHistory.push({ level, message, timestamp });
    if (this.logHistory.length > this.historyLimit) {
      this.logHistory.shift();
    }

    // Output to console if enabled
    if (this.consoleEnabled) {
      console.log(this.formatMessage(level, message, timestamp));
    }

    // Send to custom targets
    const levelTargets = this.targets.get(level) || [];
    levelTargets.forEach(target => target(message, level, timestamp));
  }

  public debug(message: string): void {
    this.log('DEBUG', message);
  }

  public info(message: string): void {
    this.log('INFO', message);
  }

  public warn(message: string): void {
    this.log('WARN', message);
  }

  public error(message: string): void {
    this.log('ERROR', message);
  }

  /**
   * Formats the log message with timestamp and level for better readability.
   * @param level - The log level.
   * @param message - The message to format.
   * @param timestamp - The timestamp of the log entry.
   * @returns A formatted log message string.
   */
  private formatMessage(level: LogLevel, message: string, timestamp: Date): string {
    return `[${timestamp.toISOString()}] [${level}] ${message}`;
  }

  /**
   * Retrieves the log history.
   * @returns The array of log entries stored in history.
   */
  public getHistory(): Array<{ level: LogLevel, message: string, timestamp: Date }> {
    return [...this.logHistory];
  }

  /**
   * Sets a limit on the number of log entries to store in history.
   * @param limit - The maximum number of entries to retain.
   */
  public setHistoryLimit(limit: number): void {
    this.historyLimit = limit;
  }

  /**
   * Clears the log history.
   */
  public clearHistory(): void {
    this.logHistory = [];
  }
}
