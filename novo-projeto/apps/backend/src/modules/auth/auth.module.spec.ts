import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';

describe('AuthModule', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('should register auth controller', () => {
    expect(moduleRef.get(AuthController)).toBeInstanceOf(AuthController);
  });
});
