import { readCode, writeCode } from "@/adapters/dynamo";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

const putItemMock = jest.fn();
const getItemMock = jest.fn();
const updateItemMock = jest.fn();

jest.useFakeTimers().setSystemTime(new Date("2021-01-01"));

jest.mock("@aws-sdk/client-dynamodb", () => ({
  DynamoDB: jest.fn().mockImplementation(() => ({
    putItem: putItemMock,
    getItem: getItemMock,
    updateItem: updateItemMock,
  })),
}));

describe("DynamoDB Adapter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("writeCode", () => {
    test.each([
      {
        test: "should put item into dynamodb",
        id: "123",
        code: "123456",
        tries: 1,
        nextTry: new Date("2023-01-01"),
      },
      {
        test: "should put item into dynamodb with default nextTry value",
        id: "123",
        code: "123456",
        tries: 1,
      },
      {
        test: "should put item into dynamodb",
        id: "123",
        code: "123456",
        tries: 1,
        nextTry: new Date("2023-01-01"),
        waitingTime: 100,
      },
    ])("$test", async ({ id, code, tries, nextTry, waitingTime }) => {
      process.env.WAITING_TIME = String(waitingTime);

      await writeCode(id, code, tries, nextTry);

      const defaultDate = new Date(
        new Date().getTime() + Number(waitingTime || 180) * 1000
      );

      expect(DynamoDB).toHaveBeenCalledTimes(1);
      expect(putItemMock).toHaveBeenCalledTimes(1);
      expect(putItemMock).toHaveBeenCalledWith({
        TableName: "OTP",
        Item: {
          id: { S: id },
          code: { S: code },
          nextTry: {
            S: nextTry ? nextTry.toISOString() : defaultDate.toISOString(),
          },
          tries: { N: tries.toString() },
        },
      });
    });
  });

  describe("readCode", () => {
    it("should read item from dynamodb", async () => {
      await readCode("123");

      expect(DynamoDB).toHaveBeenCalledTimes(1);
      expect(getItemMock).toHaveBeenCalledTimes(1);
      expect(getItemMock).toHaveBeenCalledWith({
        TableName: "OTP",
        Key: {
          id: { S: "123" },
        },
      });
    });
  });
});
