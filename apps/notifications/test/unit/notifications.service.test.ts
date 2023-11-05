import { readCode as readCodeFromDynamo } from "@/adapters/dynamo";
import { notificationService } from "@/notifications.service";

jest.useFakeTimers().setSystemTime(new Date("2021-10-10T10:00:00Z"));

jest.mock("@/adapters/dynamo");
jest.mock("@/adapters/sns");
jest.mock("@/adapters/ses");

describe("notificationService", () => {
  describe("isCodeConfirmed", () => {
    it("should return true if code is confirmed", async () => {
      (readCodeFromDynamo as jest.Mock).mockResolvedValueOnce({
        Item: {
          isConfirmed: {
            BOOL: true,
          },
        },
      });

      const result = await notificationService.isCodeConfirmed("123");

      expect(result).toBe(true);
    });

    test.each([
      {
        Item: {
          isConfirmed: {
            BOOL: false,
          },
        },
      },
      {},
      null,
      {
        Item: {},
      },
      {
        Item: {
          isConfirmed: {
            BOOL: false,
          },
        },
      },
    ])(
      "should return false if dynamo response is %j",
      async (dynamoResponse) => {
        (readCodeFromDynamo as jest.Mock).mockResolvedValueOnce(dynamoResponse);

        const result = await notificationService.isCodeConfirmed("123");

        expect(result).toBe(false);
      }
    );
  });

  describe("readCode", () => {
    test.each([
      {
        expectedResult: {
          nextTry: new Date(),
          tries: 3,
        },
        dynamoResponseMock: {
          Item: {
            nextTry: {
              S: new Date().toISOString(),
            },
            tries: {
              N: "3",
            },
          },
        },
      },
      {
        expectedResult: {
          nextTry: new Date(),
          tries: 3,
        },
        dynamoResponseMock: {
          Item: {
            tries: {
              N: "3",
            },
          },
        },
      },
      {
        expectedResult: {
          nextTry: new Date(),
          tries: 3,
        },
        dynamoResponseMock: {
          Item: {
            nextTry: {},
            tries: {
              N: "3",
            },
          },
        },
      },
      {
        expectedResult: {
          nextTry: new Date(),
          tries: 1,
        },
        dynamoResponseMock: {
          Item: {
            tries: {},
          },
        },
      },
      {
        expectedResult: {
          nextTry: new Date(),
          tries: 1,
        },
        dynamoResponseMock: {
          Item: {},
        },
      },
      {
        expectedResult: {
          nextTry: new Date(),
          tries: 1,
        },
        dynamoResponseMock: {
          Item: null,
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
