import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsModule } from './reports.module';

describe('ReportsModule', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [ReportsModule],
    }).compile();
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('should register reports controller', () => {
    expect(moduleRef.get(ReportsController)).toBeInstanceOf(ReportsController);
  });
});
