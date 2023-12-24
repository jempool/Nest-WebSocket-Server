import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('canActivate', () => {
    it('should return true if token is valid', async () => {
      const mockExecutionContext =
        createMockExecutionContext('Bearer validtoken');
      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockResolvedValueOnce({ userId: '123' });

      await expect(authGuard.canActivate(mockExecutionContext)).resolves.toBe(
        true,
      );
    });

    it('should throw UnauthorizedException if token is missing', async () => {
      const mockExecutionContext = createMockExecutionContext();

      await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if token verification fails', async () => {
      const mockExecutionContext = createMockExecutionContext(
        'Bearer invalidtoken',
      );
      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockRejectedValueOnce(new Error('Invalid token'));

      await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // Helper function to create a mock ExecutionContext with an optional token
  function createMockExecutionContext(token?: string): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: token,
          },
        }),
      }),
    } as unknown as ExecutionContext;
  }
});
