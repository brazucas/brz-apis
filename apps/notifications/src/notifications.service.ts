import { readCode as readCodeFromDynamo, writeCode } from "./adapters/dynamo";
import { sendSMS } from "./adapters/sns";
import { sendEmail } from "./adapters/ses";

const readCode = async (
  id: string
): Promise<{
  nextTry: Date;
  tries: number;
  code: string | null;
} | null> => {
  const entry = await readCodeFromDynamo(id);

  if (!entry?.Item || !entry.Item.code?.S) {
    return null;
  }

  const storedNextTry = entry.Item.nextTry?.S
    ? new Date(entry.Item.nextTry.S)
    : new Date();

  const tries = Number(entry.Item.tries?.N || 1);
  const code = entry.Item.code.S;

  return {
    nextTry: storedNextTry,
    tries,
    code,
  };
};

export const notificationService = {
  readCode,
  sendSMS,
  sendEmail,
  writeCode,
};
