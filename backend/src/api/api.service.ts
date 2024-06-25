import { Injectable } from "@nestjs/common"
import { HttpService } from "@nestjs/axios"
import { AxiosResponse } from "axios"

@Injectable()
export class ApiService {
    constructor(private readonly httpService: HttpService) {}

    async get(endpoint: string): Promise<AxiosResponse<any, any>> {
        return this.httpService.axiosRef.get(
            `https://${process.env.SUBDOMAIN}.amocrm.ru/api/v4${endpoint}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.TOKEN}`,
                },
            },
        )
    }
}
