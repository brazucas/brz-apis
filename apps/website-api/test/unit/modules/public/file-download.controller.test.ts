import { ChallengeService } from '@challenge/types/challenge.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { FileDownloadController } from '@public/controllers/file-download.controller';
import { StorageService } from '@storage/types/storage.interface';

describe('FileDownloadController', () => {
  let controller: FileDownloadController;
  let storageSvc: StorageService;
  let challengeSvc: ChallengeService;

  beforeEach(async () => {
    const storageService = {
      generateDownloadUrl: jest.fn(),
    };

    const challengeService = {
      checkChallenge: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileDownloadController],
      providers: [
        {
          provide: 'STORAGE_SERVICE',
          useValue: storageService,
        },
        {
          provide: 'CHALLENGE_SERVICE',
          useValue: challengeService,
        },
      ],
    }).compile();

    controller = module.get<FileDownloadController>(FileDownloadController);
    storageSvc = module.get<StorageService>('STORAGE_SERVICE');
    challengeSvc = module.get<ChallengeService>('CHALLENGE_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('should test downloadFile method', () => {
    it('should return 400 if fileName is not provided', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.downloadFile(res as any, null, null);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'File name is required',
      });
    });

    it('should return 500 if challengeSvc throws an error', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const error = new Error('test');

      jest.spyOn(challengeSvc, 'checkChallenge').mockRejectedValueOnce(error);

      await controller.downloadFile(res as any, 'test', 'test');

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: error.message,
      });
    });

    it('should return 400 if challenge fails', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest.spyOn(challengeSvc, 'checkChallenge').mockResolvedValueOnce(false);

      await controller.downloadFile(res as any, 'test', 'test');

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Recaptcha challenge failed',
      });
    });

    it('should return 500 if storageSvc throws an error', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const error = new Error('test');

      jest.spyOn(challengeSvc, 'checkChallenge').mockResolvedValueOnce(true);
      jest
        .spyOn(storageSvc, 'generateDownloadUrl')
        .mockRejectedValueOnce(error);

      await controller.downloadFile(res as any, 'test', 'test');

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: error.message,
      });
    });

    it('should return 200 if everything is ok', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        setHeader: jest.fn().mockReturnThis(),
      };

      jest.spyOn(challengeSvc, 'checkChallenge').mockResolvedValueOnce(true);
      jest
        .spyOn(storageSvc, 'generateDownloadUrl')
        .mockResolvedValueOnce('test');

      await controller.downloadFile(res as any, 'test', 'test');

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.setHeader).toHaveBeenCalledWith(
        'Access-Control-Allow-Origin',
        'https://blog.brz.gg',
      );
      expect(res.json).toHaveBeenCalledWith({
        url: 'test',
      });
    });
  });
});
