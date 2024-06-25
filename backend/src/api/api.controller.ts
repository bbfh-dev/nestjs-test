import { Controller, Get, Param } from "@nestjs/common"
import { ApiService } from "./api.service"

@Controller("api")
export class ApiController {
    constructor(private apiService: ApiService) {}

    async getFieldFromAPI(endpoint: string): Promise<any> {
        const res = await this.apiService.get(endpoint)
        delete res.data._embedded
        delete res.data._links
        return res.data
    }

    async populateLead(lead: any): Promise<any> {
        lead.contacts = []
        for (const contact of lead._embedded.contacts) {
            lead.contacts.push(
                await this.getFieldFromAPI(`/contacts/${contact.id}`),
            )
        }

        lead.user = await this.getFieldFromAPI(
            `/users/${lead.responsible_user_id}`,
        )

        lead.status = await this.getFieldFromAPI(
            `/leads/pipelines/${lead.pipeline_id}/statuses/${lead.status_id}`,
        )

        delete lead._embedded
        delete lead._links
        return lead
    }

    async getLeadsWith(queryParams: string): Promise<any> {
        const response = await this.apiService.get(`/leads${queryParams}`)
        const leads = []
        for (const lead of response.data._embedded.leads) {
            leads.push(await this.populateLead(lead))
        }
        return {
            leads: leads,
        }
    }

    @Get("leads")
    async getLeads(): Promise<any> {
        return this.getLeadsWith("?with=contacts")
    }

    @Get("leads/:query")
    async getLeadsFiltered(@Param() params: any): Promise<any> {
        return this.getLeadsWith(`?with=contacts&query=${params.query}`)
    }
}
