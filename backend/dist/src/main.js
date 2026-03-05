"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const sentry_config_1 = require("./sentry.config");
const sentry_exception_filter_1 = require("./filters/sentry-exception.filter");
const nest_winston_1 = require("nest-winston");
const winston_config_1 = __importDefault(require("./config/winston.config"));
(0, sentry_config_1.initializeSentry)();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: nest_winston_1.WinstonModule.createLogger(winston_config_1.default),
    });
    app.useGlobalFilters(new sentry_exception_filter_1.SentryExceptionFilter());
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Backend running on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map