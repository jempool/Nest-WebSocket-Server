import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

const messages = [
  {
    _id: 'some_id1',
    message: 'Hello',
    handle: 'User1',
  },
  {
    _id: 'some_id2',
    message: 'Hello',
    handle: 'User2',
  },
];

describe('MessagesController', () => {
  let controller: MessagesController;
  let service: MessagesService;

  // Mock messages service
  const mockMessagesService = {
    create: jest.fn((dto) => {
      return {
        _id: 'some_id',
        ...dto,
      };
    }),

    findAll: jest.fn(() => {
      return messages;
    }),
  };

  // Mock JWT service
  const mockJwtService = { verifyAsync: jest.fn() };

  // Mock auth guard
  const mockAuthGuard = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [
        {
          provide: MessagesService,
          useValue: mockMessagesService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: AuthGuard,
          useValue: mockAuthGuard,
        },
      ],
    }).compile();

    controller = module.get<MessagesController>(MessagesController);
    service = module.get<MessagesService>(MessagesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return an array of messages', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockImplementation(() => Promise.resolve(messages));

      expect(await controller.findAll()).toEqual(messages);
    });
  });
});
