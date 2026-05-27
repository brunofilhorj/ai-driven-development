import { Controller, Get } from '@nestjs/common';
import { somar } from '@poupig/reports';

@Controller('reports')
export class ReportsController {
  @Get()
  getMessage(): { message: string; result: number } {
    return {
      message: 'Modulo reports ativo',
      result: somar(2, 4),
    };
  }
}
