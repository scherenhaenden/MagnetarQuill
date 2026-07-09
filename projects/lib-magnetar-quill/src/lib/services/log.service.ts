import { Injectable } from '@angular/core';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
export type LogTarget = (message: string, level: LogLevel, timestamp: Date) => void;

/**
 * @generatedInfoDoc
 * InfoDoc: class `LogService` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/log.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */






@Injectable({
  providedIn: 'root'
})
export class LogService {
  private targets: Map<LogLevel, LogTarget[]> = new Map();
  private logHistory: Array<{ level: LogLevel, message: string, timestamp: Date }> = [];
  private enabledLevels: Set<LogLevel> = new Set(['DEBUG', 'INFO', 'WARN', 'ERROR']);
  private consoleEnabled: boolean = true;
  private historyLimit: number = 100;

    /**
 * @generatedInfoDoc
 * InfoDoc: constructor for class `LogService` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/log.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */






constructor() { }

  /**
   * Registers a log target for a specific level.
   * @param level - The log level (DEBUG, INFO, WARN, ERROR).
   * @param target - A function to handle log messages at the specified level.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `LogService`.`addTarget()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/log.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
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
    /**
 * @generatedInfoDoc
 * InfoDoc: method `LogService`.`setConsoleLogging()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/log.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */






public setConsoleLogging(enabled: boolean): void {
    this.consoleEnabled = enabled;
  }

  /**
   * Enables a specific log level.
   * @param level - The log level to enable.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `LogService`.`enableLevel()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/log.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */






public enableLevel(level: LogLevel): void {
    this.enabledLevels.add(level);
  }

  /**
   * Disables a specific log level.
   * @param level - The log level to disable.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `LogService`.`disableLevel()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/log.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */






public disableLevel(level: LogLevel): void {
    this.enabledLevels.delete(level);
  }

  /**
   * Logs a message at a specific level.
   * @param level - The log level (DEBUG, INFO, WARN, ERROR).
   * @param message - The message to log.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `LogService`.`log()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/log.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
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

    /**
 * @generatedInfoDoc
 * InfoDoc: method `LogService`.`debug()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/log.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */






public debug(message: string): void {
    this.log('DEBUG', message);
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `LogService`.`info()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/log.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */






public info(message: string): void {
    this.log('INFO', message);
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `LogService`.`warn()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/log.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */






public warn(message: string): void {
    this.log('WARN', message);
  }

    /**
 * @generatedInfoDoc
 * InfoDoc: method `LogService`.`error()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/log.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */






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
    /**
 * @generatedInfoDoc
 * InfoDoc: method `LogService`.`formatMessage()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/log.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */






private formatMessage(level: LogLevel, message: string, timestamp: Date): string {
    return `[${timestamp.toISOString()}] [${level}] ${message}`;
  }

  /**
   * Retrieves the log history.
   * @returns The array of log entries stored in history.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `LogService`.`getHistory()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/log.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */






public getHistory(): Array<{ level: LogLevel, message: string, timestamp: Date }> {
    return [...this.logHistory];
  }

  /**
   * Sets a limit on the number of log entries to store in history.
   * @param limit - The maximum number of entries to retain.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `LogService`.`setHistoryLimit()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/log.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */






public setHistoryLimit(limit: number): void {
    this.historyLimit = limit;
  }

  /**
   * Clears the log history.
   */
    /**
 * @generatedInfoDoc
 * InfoDoc: method `LogService`.`clearHistory()` is tracked by the generated documentation contract.
 * Location: `projects/lib-magnetar-quill/src/lib/services/log.service.ts`; regenerate with `npm run docs:generate:info-docs` when structure changes.
 */






public clearHistory(): void {
    this.logHistory = [];
  }
}
