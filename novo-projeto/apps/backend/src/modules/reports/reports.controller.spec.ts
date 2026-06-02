import { ReportsController } from './reports.controller';

describe('ReportsController', () => {
  it('should return reports module status', () => {
    expect(new ReportsController().getMessage()).toEqual({
      message: 'Modulo reports ativo',
      result: 6,
    });
  });
});
