import { AuthController } from './auth.controller';

describe('AuthController', () => {
  it('should return auth module status', () => {
    expect(new AuthController().getMessage()).toEqual({
      message: 'Modulo auth ativo',
    });
  });
});
