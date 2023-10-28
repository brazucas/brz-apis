import { config } from "@/challenge/config/recaptcha";
import { GoogleRecaptchaAdapter } from "@challenge/adapters/google-recaptcha.adapter";
import axios from "axios";

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

jest.mock("@challenge/config/recaptcha", () => ({
  config: {},
}));

const DATA_SET = [
  {
    name: "should throw error when the recaptcha sdk throws internal error",
    httpImplementationMock: jest.fn(() => {
      throw new Error("SDK error");
    }),
    expectToThrowError: "SDK error",
  },
  {
    name: "should throw error when the recaptcha endpoint returns status 404 not found",
    httpImplementationMock: jest.fn(() => ({
      status: 404,
      data: {
        message: "404 not found",
      },
    })),
    expectToThrowError:
      "Unexpected response from recaptcha endpoint: 404 status code",
  },
  {
    name: "should throw error when the recaptcha endpoint returns status 403 forbidden",
    httpImplementationMock: jest.fn(() => ({
      status: 403,
      data: {
        message: "403 forbidden",
      },
    })),
    expectToThrowError:
      "Unexpected response from recaptcha endpoint: 403 status code",
  },
  {
    name: "should throw error when the recaptcha endpoint returns status 400 bad request",
    httpImplementationMock: jest.fn(() => ({
      status: 400,
      data: {
        message: "400 bad request",
      },
    })),
    expectToThrowError:
      "Unexpected response from recaptcha endpoint: 400 status code",
  },
  {
    name: "should return false if recaptcha success is false",
    httpImplementationMock: jest.fn(() => ({
      status: 200,
      data: {
        success: false,
      },
    })),
    expected: false,
  },
  {
    name: "should return false if recaptcha success is not defined",
    httpImplementationMock: jest.fn(() => ({
      status: 200,
      data: {},
    })),
    expected: false,
  },
  {
    name: "should return true if recaptcha is validated successfully",
    httpImplementationMock: jest.fn(() => ({
      status: 200,
      data: {
        success: true,
      },
    })),
    expected: true,
  },
];

describe("GoogleRecaptchaAdapter", () => {
  it("should throw error if recaptcha secret is not defined", () => {
    expect(() => {
      new GoogleRecaptchaAdapter();
    }).toThrow("RECAPTCHA_SECRET not set");
  });

  describe("checkChallenge", () => {
    let service: GoogleRecaptchaAdapter;

    beforeAll(() => {
      config.recaptchaSecret = "secret";
    });

    beforeEach(() => {
      service = new GoogleRecaptchaAdapter();
    });

    test.each(DATA_SET)(
      "$name",
      ({ httpImplementationMock, expectToThrowError, expected }) => {
        jest
          .spyOn(axios, "post")
          .mockImplementation(httpImplementationMock as any);

        if (expectToThrowError) {
          expect(service.checkChallenge("token")).rejects.toThrow(
            expectToThrowError
          );
        } else {
          expect(service.checkChallenge("token")).resolves.toEqual(expected);
        }
      }
    );
  });
});
