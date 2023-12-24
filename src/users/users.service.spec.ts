import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';

describe('UsersService', () => {
  let service: UsersService;

  const user = {
    name: 'John Doe',
    email: 'john-doe@test.com',
    password: 'password123',
  };

  const saveMock = jest.fn().mockResolvedValue(true);
  const execMock = jest.fn().mockResolvedValue(user);

  const userDocument = {
    ...user,
    save: saveMock,
  };

  // Mock model functions and constructor
  const mockUserModel = jest.fn().mockImplementation(() => {
    return userDocument;
  });

  (mockUserModel as any).findOne = jest.fn().mockReturnValue({
    exec: execMock,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should create a new user', async () => {
      await service.create(user);

      expect(mockUserModel).toHaveBeenCalledWith(user);
      expect(saveMock).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should return an user by email', async () => {
      const email = user.email;
      const result = await service.findOne(email);

      expect(result).toEqual(user);
      expect(execMock).toHaveBeenCalled();
    });
  });
});
