import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { bootstrap } from './main';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

describe('bootstrap', () => {
  const originalPort = process.env.PORT;

  afterEach(() => {
    jest.clearAllMocks();

    if (originalPort === undefined) {
      delete process.env.PORT;
    } else {
      process.env.PORT = originalPort;
    }
  });

  it('should create the app, enable cors, and listen on configured port', async () => {
    const app = {
      enableCors: jest.fn(),
      listen: jest.fn().mockResolvedValue(undefined),
    };
    process.env.PORT = '5000';
    const createMock = jest
      .spyOn(NestFactory, 'create')
      .mockResolvedValue(app as never);

    await bootstrap();

    expect(createMock).toHaveBeenCalledWith(AppModule);
    expect(app.enableCors).toHaveBeenCalled();
    expect(app.listen).toHaveBeenCalledWith('5000');
  });

  it('should listen on default port when PORT is not configured', async () => {
    const app = {
      enableCors: jest.fn(),
      listen: jest.fn().mockResolvedValue(undefined),
    };
    delete process.env.PORT;
    jest.spyOn(NestFactory, 'create').mockResolvedValue(app as never);

    await bootstrap();

    expect(app.listen).toHaveBeenCalledWith(4000);
  });
});
