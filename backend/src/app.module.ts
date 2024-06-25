import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { ApiController } from "./api/api.controller"
import { HttpModule } from "@nestjs/axios"
import { ApiService } from "./api/api.service"

@Module({
    imports: [HttpModule],
    controllers: [AppController, ApiController],
    providers: [AppService, ApiService],
})
export class AppModule {}
