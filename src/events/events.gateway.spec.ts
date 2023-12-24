import { TestingModule, Test } from '@nestjs/testing';
import { EventsGateway } from './events.gateway';
import { MessagesService } from '../messages/messages.service';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from '../messages/dto/create-message.dto';

describe('EventsGateway', () => {
  let gateway: EventsGateway;
  let messagesService: MessagesService;
  let mockServer: Server;
  let mockClient: Socket;

  beforeEach(async () => {
    const mockMessagesService = {
      create: jest.fn(),
    };

    mockServer = {
      emit: jest.fn(),
    } as unknown as Server;

    mockClient = {
      id: 'mockClientId',
      emit: jest.fn(),
      broadcast: {
        emit: jest.fn(),
        except: jest.fn(),
        exceptRooms: new Set(),
        flags: {},
      },
    } as unknown as Socket;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsGateway,
        {
          provide: MessagesService,
          useValue: mockMessagesService,
        },
      ],
    }).compile();

    gateway = module.get<EventsGateway>(EventsGateway);
    messagesService = module.get<MessagesService>(MessagesService);
    gateway.server = mockServer as Server;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleChatEvent', () => {
    it('should create a message and emit an event', async () => {
      const messageDto: CreateMessageDto = {
        message: 'Hello',
        handle: 'User1',
      };

      gateway.handleChatEvent(messageDto);

      expect(messagesService.create).toHaveBeenCalledWith(messageDto);
      expect(mockServer.emit).toHaveBeenCalledWith('chat', messageDto);
    });
  });

  describe('handleTypingEvent', () => {
    it('should emit typing event to all clients except sender', () => {
      const messageDto: CreateMessageDto = {
        message: 'User1 is typing...',
        handle: 'User1',
      };

      gateway.handleTypingEvent(messageDto, mockClient as Socket);

      expect(mockServer.emit).toHaveBeenCalledWith('typing', messageDto);
      expect(mockClient.broadcast.emit).toHaveBeenCalledWith(
        'typing',
        messageDto,
      );
    });
  });

  describe('handleConnection', () => {
    it('should log new connection', () => {
      console.log = jest.fn();

      gateway.handleConnection(mockClient as Socket);

      expect(console.log).toHaveBeenCalledWith(expect.any(String));
    });
  });
});
