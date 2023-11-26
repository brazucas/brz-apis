import { readCode as readCodeFromDynamo } from "@/adapters/dynamo";
import { notificationService } from "@/notifications.service";

jest.useFakeTimers().setSystemTime(new Date("2021-10-10T10:00:00Z"));

jest.mock("@/adapters/dynamo");
jest.mock("@/adapters/sns");
jest.mock("@/adapters/ses");

describe("notificationService", () => {
  describe("readCode", () => {
    test.each([
      {
        expectedResult: {
          nextTry: new Date(),
          tries: 3,
          code: "123",
        },
        dynamoResponseMock: {
          Item: {
            nextTry: {
              S: new Date().toISOString(),
            },
            tries: {
              N: "3",
            },
            code: {
              S: "123",
            },
          },
        },
      },
      {
        expectedResult: {
          nextTry: new Date(),
          tries: 3,
          code: "123",
        },
        dynamoResponseMock: {
          Item: {
            tries: {
              N: "3",
            },
            code: {
              S: "123",
            },
          },
        },
      },
      {
        expectedResult: {
          nextTry: new Date(),
          tries: 3,
          code: "123",
        },
        dynamoResponseMock: {
          Item: {
            nextTry: {},
            tries: {
              N: "3",
            },
            code: {
              S: "123",
            },
          },
        },
      },
      {
        expectedResult: {
          nextTry: new Date(),
          tries: 1,
          code: "123",
        },
        dynamoResponseMock: {
          Item: {
            tries: {},
            code: {
              S: "123",
            },
          },
        },
      },
      {
        expectedResult: {
          nextTry: new Date(),
          tries: 1,
          code: "123",
        },
        dynamoResponseMock: {
          Item: {
            code: {
              S: "123",
            },
          },
        },
      },
      {
        expectedResult: null,
        dynamoResponseMock: {
          Item: null,
        },
      },
      {
        expectedResult: null,
        dynamoResponseMock: null,
      },
      {
        expectedResult: null,
        dynamoResponseMock: {
          Item: {
            code: null,
          },
        },
      },
      {
        expectedResult: null,
        dynamoResponseMock: {
          Item: {
            S: null,
          },
        },
      },
    ])(
      "should return %o for dynamo response %o",
      async ({ expectedResult, dynamoResponseMock }) => {
        (readCodeFromDynamo as jest.Mock).mockResolvedValueOnce(
          dynamoResponseMock
        );

        const result = await notificationService.readCode("123");

        expect(result).toEqual(expectedResult);
      }
    );
  });
});
