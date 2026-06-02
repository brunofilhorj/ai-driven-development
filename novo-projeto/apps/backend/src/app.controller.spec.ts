import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  it('should load controller metadata when service token fallback is used', () => {
    jest.isolateModules(() => {
      jest.doMock('./app.service', () => ({
        AppService: undefined,
      }));

      const module = require('./app.controller') as typeof import('./app.controller');

      expect(module.AppController).toBeDefined();
    });

    jest.dontMock('./app.service');
  });
});
