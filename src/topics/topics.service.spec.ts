import { Test, TestingModule } from '@nestjs/testing';
import { TopicsService } from './topics.service';
import { getModelToken } from '@nestjs/mongoose';
import { Topic } from './schemas/topic.schema';

describe('TopicsService', () => {
  let service: TopicsService;

  const topic = {
    topic: 'Random topic',
  };

  const execMock = jest.fn().mockResolvedValue(topic);

  const topicDocument = {
    ...topic,
  };

  // Mock model functions and constructor
  const mockTopicModel = jest.fn().mockImplementation(() => {
    return topicDocument;
  });

  (mockTopicModel as any).findOne = jest.fn().mockReturnValue({
    exec: execMock,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicsService,
        {
          provide: getModelToken(Topic.name),
          useValue: mockTopicModel,
        },
      ],
    }).compile();

    service = module.get<TopicsService>(TopicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findTodaysTopic()', () => {
    it('should return topic for the curent day', async () => {
      const result = await service.findTodaysTopic();

      expect(result).toEqual(topic);
      expect(execMock).toHaveBeenCalled();
    });
  });
});
