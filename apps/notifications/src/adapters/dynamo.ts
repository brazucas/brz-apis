import { addSeconds } from "@/helpers";
import {
  DynamoDB,
  GetItemCommandInput,
  GetItemOutput,
  PutItemCommandInput,
  PutItemOutput,
} from "@aws-sdk/client-dynamodb";

export const writeCode = async (
  id: string,
  code: string,
  tries: number,
  nextTry = addSeconds(
    new Date(),
    Number(process.env.WAITING_TIME_AFTER_MAX_CODES) || 180
  )
): Promise<PutItemOutput> => {
  const db = new DynamoDB({ apiVersion: "2012-08-10", region: "us-east-1" });

  const params: PutItemCommandInput = {
    TableName: "CONFIRMATION_CODE",
    Item: {
      id: { S: id },
      code: { S: code },
      nextTry: { S: nextTry.toISOString() },
      tries: { N: tries.toString() },
    },
  };

  return db.putItem(params);
};

export const readCode = (id: string): Promise<GetItemOutput> => {
  const db = new DynamoDB({ apiVersion: "2012-08-10", region: "us-east-1" });

  const params: GetItemCommandInput = {
    TableName: "CONFIRMATION_CODE",
    Key: {
      id: { S: id },
    },
  };

  return db.getItem(params);
};
