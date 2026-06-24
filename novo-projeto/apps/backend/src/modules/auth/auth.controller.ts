import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get()
  getMessage(): { message: string } {
    return {
      message: 'Modulo auth ativo',
    };
  }
}
