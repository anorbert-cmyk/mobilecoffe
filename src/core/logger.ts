type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
    private static isDev = __DEV__;

    private static format(level: LogLevel, message: string, data?: any) {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
        return { prefix, message, data };
    }

    static debug(message: string, data?: any) {
        if (!this.isDev) return;
        const { prefix } = this.format('debug', message, data);
        console.debug(prefix, message, data || '');
    }

    static info(message: string, data?: any) {
        const { prefix } = this.format('info', message, data);
        console.info(prefix, message, data || '');
    }

    static warn(message: string, data?: any) {
        const { prefix } = this.format('warn', message, data);
        console.warn(prefix, message, data || '');
    }

    static error(message: string, error?: any) {
        const { prefix } = this.format('error', message, error);
        console.error(prefix, message, error || '');
        // TODO: Send to Sentry/Crashlytics in production
    }
}

export const logger = Logger;
