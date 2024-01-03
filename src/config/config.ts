import * as winston from 'winston';

const config: any = {
    logger: {
        info: {
            datePattern: 'YYYY-MM-DD',
            filename: 'logs/info.%DATE%.json',
            level: 'info',
            handleException: true,
            colorize: true,
            json: false,
            zippedArithAbort: true,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        },
        error: {
            datePattern: 'YYYY-MM-DD',
            filename: 'logs/error.%DATE%.json',
            level: 'error',
            handleException: true,
            colorize: true,
            json: false,
            zippedArithAbort: true,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        }
    }
}
export default config;