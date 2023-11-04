import {
  DynamoDB,
  GetItemCommandInput,
  GetItemOutput,
  PutItemCommandInput,
  PutItemOutput,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { addSeconds } from "date-fns";

export const writeCode = (
  id: string,
  code: string,
  tries: number,
  nextTry = addSeconds(new Date(), Number(process.env.WAITING_TIME) || 180)
): Promise<PutItemOutput> =>
  new Promise((resolve, reject) => {
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

    db.putItem(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

export const readCode = (id: string): Promise<GetItemOutput> =>
  new Promise((resolve, reject) => {
    const db = new DynamoDB({ apiVersion: "2012-08-10", region: "us-east-1" });

    const params: GetItemCommandInput = {
      TableName: "CONFIRMATION_CODE",
      Key: {
        id: { S: id },
      },
    };

    db.getItem(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

export const confirmWhitelistCodes = (id: string): Promise<PutItemOutput> =>
  new Promise((resolve, reject) => {
    const db = new DynamoDB({ apiVersion: "2012-08-10", region: "us-east-1" });

    const params: UpdateItemCommandInput = {
      TableName: "WHITELIST_CONFIRMATION",
      Key: {
        steamId: { S: id },
      },
      UpdateExpression: "set isConfirmed = :yes",
      ExpressionAttributeValues: {
        ":yes": { BOOL: true },
      },
    };

    db.updateItem(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
