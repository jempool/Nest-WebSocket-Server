import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { getModelToken } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';

describe('MessagesService', () => {
  let service: MessagesService;

  const message = {
    message: 'Hello world',
    handle: 'JohnDoe',
  };
  const messages = [message, message, message];

  const saveMock = jest.fn().mockResolvedValue(true);
  const execMock = jest.fn().mockResolvedValue(messages);

  const messageDocument = {
    ...message,
    save: saveMock,
  };

  // Mock model functions and constructor
  const mockMessageModel = jest.fn().mockImplementation(() => {
    return messageDocument;
  });

  (mockMessageModel as any).find = jest.fn().mockReturnValue({
    exec: execMock,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: getModelToken(Message.name),
          useValue: mockMessageModel,
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should create a new message', async () => {
      await service.create(message);

      expect(mockMessageModel).toHaveBeenCalledWith(message);
      expect(saveMock).toHaveBeenCalled();
    });
  });

  describe('findAll()', () => {
    it('should return an array of messages', async () => {
      const result = await service.findAll();

      expect(result).toEqual(messages);
      expect(execMock).toHaveBeenCalled();
    });
  });
});
