import { GoogleRecaptchaAdapter } from '@challenge/adapters/google-recaptcha.adapter';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

const DATA_SET = [
  {
    name: 'should throw error when the recaptcha sdk throws internal error',
    httpImplementationMock: jest.fn(() => {
      throw new Error('SDK error');
    }),
    expectToThrowError: 'SDK error',
  },
  {
    name: 'should throw error when the recaptcha endpoint returns status 404 not found',
    httpImplementationMock: jest.fn(() =>
      of({
        status: 404,
        data: {
          message: '404 not found',
        },
      }),
    ),
    expectToThrowError:
      'Unexpected response from recaptcha endpoint: 404 status code',
  },
  {
    name: 'should throw error when the recaptcha endpoint returns status 403 forbidden',
    httpImplementationMock: jest.fn(() =>
      of({
        status: 403,
        data: {
          message: '403 forbidden',
        },
      }),
    ),
    expectToThrowError:
      'Unexpected response from recaptcha endpoint: 403 status code',
  },
  {
    name: 'should throw error when the recaptcha endpoint returns status 400 bad request',
    httpImplementationMock: jest.fn(() =>
      of({
        status: 400,
        data: {
          message: '400 bad request',
        },
      }),
    ),
    expectToThrowError:
      'Unexpected response from recaptcha endpoint: 400 status code',
  },
  {
    name: 'should return false if recaptcha success is false',
    httpImplementationMock: jest.fn(() =>
      of({
        status: 200,
        data: {
          success: false,
        },
      }),
    ),
    expected: false,
  },
  {
    name: 'should return false if recaptcha success is not defined',
    httpImplementationMock: jest.fn(() =>
      of({
        status: 200,
        data: {},
      }),
    ),
    expected: false,
  },
  {
    name: 'should return true if recaptcha is validated successfully',
    httpImplementationMock: jest.fn(() =>
      of({
        status: 200,
        data: {
          success: true,
        },
      }),
    ),
    expected: true,
  },
];

describe('GoogleRecaptchaAdapter', () => {
  let service: GoogleRecaptchaAdapter;
  let httpSvc: HttpService;

  it('should throw error if recaptcha secret is not defined', () => {
    const module: Promise<TestingModule> = Test.createTestingModule({
      providers: [ConfigService, HttpService, GoogleRecaptchaAdapter],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn(() => undefined),
      })
      .overrideProvider(HttpService)
      .useValue({
        post: jest.fn(() => ({
          status: 200,
          data: {
            success: true,
          },
        })),
      })
      .compile();

    expect(module).rejects.toThrow('RECAPTCHA_SECRET not set');
  });

  describe('checkChallenge', () => {
    beforeAll(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [ConfigService, HttpService, GoogleRecaptchaAdapter],
      })
        .overrideProvider(ConfigService)
        .useValue({
          get: jest.fn(() => 'secret'),
        })
        .overrideProvider(HttpService)
        .useValue({
          post: jest.fn(() => ({
            status: 200,
            data: {
              success: true,
            },
          })),
        })
        .compile();

      service = module.get<GoogleRecaptchaAdapter>(GoogleRecaptchaAdapter);
      httpSvc = module.get<HttpService>(HttpService);
    });

    test.each(DATA_SET)(
      '$name',
      ({ httpImplementationMock, expectToThrowError, expected }) => {
        jest
          .spyOn(httpSvc, 'post')
          .mockImplementation(httpImplementationMock as any);

        if (expectToThrowError) {
          expect(service.checkChallenge('token')).rejects.toThrow(
            expectToThrowError,
          );
        } else {
          expect(service.checkChallenge('token')).resolves.toEqual(expected);
        }
      },
    );
  });
});
