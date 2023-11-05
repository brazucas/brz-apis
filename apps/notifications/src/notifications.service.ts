import { readCode, writeCode } from "./aws/dynamo";
import { sendSMS } from "./aws/sns";
import { sendEmail } from "./aws/ses";

const isCodeConfirmed = async (id: string): Promise<boolean> => {
  const storedValues = await readCode(id);

  if (!storedValues?.Item?.isConfirmed) {
    return false;
  }

  return storedValues.Item.isConfirmed.BOOL || false;
};

const readCodes = async (
  id: string
): Promise<{
  nextTry: Date;
  tries: number;
}> => {
  const entry = await readCode(id);

  const storedNextTry = entry.Item?.nextTry?.S
    ? new Date(entry.Item.nextTry.S)
    : new Date();

  const tries = Number(entry.Item?.tries?.N || 1);

  return {
    nextTry: storedNextTry,
    tries,
  };
};

export const notificationService = {
  isCodeConfirmed,
  readCodes,
  sendSMS,
  sendEmail,
  writeCode,
};
