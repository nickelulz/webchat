const config = {
    appenders: {
        out: { 
            type: 'stdout', 
            layout: {
                type: 'pattern',
                pattern: '%[[%d{yyyy-MM-dd hh:mm:ss}] [%p %X{context}]%] %m'
            }
        },
        file: {
            type: 'fileSync',
            filename: './logs/latest.log',
            compress: true,
            layout: {
                type: 'pattern',
                pattern: '[%d{yyyy-MM-dd hh:mm:ss}] [%p %X{context}] %m'
            }
        }
    },
    categories: { default: { appenders: ['out', 'file'], level: 'info' } }
}

config.appenders.file.filename = "./logs/" + new Date().toISOString().toString().replace(":","-");
export default config;