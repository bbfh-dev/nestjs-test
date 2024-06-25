import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class ApiController {
  @Get('leads')
  getLeads(): string {
    return '';
  }
}
