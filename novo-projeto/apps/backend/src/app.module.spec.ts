import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { AuthController } from './modules/auth/auth.controller';
import { ReportsController } from './modules/reports/reports.controller';

describe('AppModule', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('should register root app providers and controllers', () => {
    expect(moduleRef.get(AppController)).toBeInstanceOf(AppController);
    expect(moduleRef.get(AppService)).toBeInstanceOf(AppService);
  });

  it('should import feature controllers', () => {
    expect(moduleRef.get(AuthController)).toBeInstanceOf(AuthController);
    expect(moduleRef.get(ReportsController)).toBeInstanceOf(ReportsController);
  });
});
