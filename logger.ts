// istanbul ignore file
import * as winston from "winston"
import 'winston-daily-rotate-file';
import config from "./src/config/config";
// istanbul ignore file
const winstonOptions: any = {
    winstonOptionsForInfo: {
        levels: {
            info: 0
        },
        transports: [
            new winston.transports.DailyRotateFile(config.logger.info)
        ],
        exitOnError: false
    },
    winstonOptionsForError: {
        levels: {
            info: 0
        },
        transports: [
           // new winston.transports.DailyRotateFile(config.logger.error)
            new winston.transports.File({ filename: 'error.log', level: 'error' }),
        ],
        exitOnError: false
    }

}

let loggerInstances: any = {
    infoLogger: winston.createLogger(winstonOptions.winstonOptionsForInfo),
    errorLogger: winston.createLogger({transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
      ], //(winstonOptions.winstonOptionsForError),
    })
}
// istanbul ignore file
const logger = {
    writeLog: function (logType: string, message: any, reasonOrInfo: any) {
        switch(logType) {
            case 'i':
                loggerInstances.infoLogger.info(message, reasonOrInfo);
                break;
            case 'e':
                loggerInstances.errorLogger.error(message, reasonOrInfo);
                break;
        }
    }
}
export default logger;