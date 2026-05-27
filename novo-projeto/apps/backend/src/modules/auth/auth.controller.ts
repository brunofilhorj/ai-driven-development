import { Controller, Get } from '@nestjs/common';
import { somar } from '@poupig/auth';

@Controller('auth')
export class AuthController {
  @Get()
  getMessage(): { message: string; result: number } {
    return {
      message: 'Modulo auth ativo',
      result: somar(2, 4),
    };
  }
}
