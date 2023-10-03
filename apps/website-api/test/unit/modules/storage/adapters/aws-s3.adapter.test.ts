import * as requestPresigner from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AWSS3Adapter } from '@storage/adapters/aws-s3.adapter';

jest.mock('@aws-sdk/s3-request-presigner', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@aws-sdk/s3-request-presigner'),
  };
});

describe('StorageService', () => {
  let service: AWSS3Adapter;
  let getSignedUrlSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AWSS3Adapter, ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn().mockReturnValue('us-east-1'),
      })
      .compile();

    service = module.get<AWSS3Adapter>(AWSS3Adapter);
    getSignedUrlSpy = jest.spyOn(requestPresigner, 'getSignedUrl');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('should test generateDownloadUrl method', () => {
    it('should return a signed url', async () => {
      getSignedUrlSpy.mockReturnValue('https://signed-url.com');

      const url = await service.generateDownloadUrl('GTA_SA.iso');
      expect(url).toEqual('https://signed-url.com');
    });

    it('should throw an error if file is not allowed', () => {
      expect(() => service.generateDownloadUrl('GTA_III.iso')).toThrow(
        'File not allowed',
      );
    });

    it('should throw an error if getSignedUrl throws an error', () => {
      getSignedUrlSpy.mockImplementation(() => {
        throw new Error('Error');
      });

      expect(() => service.generateDownloadUrl('gta_sa.exe')).toThrow('Error');
    });
  });
});
