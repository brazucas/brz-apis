import { PublishInput, SNS } from "@aws-sdk/client-sns";

export const sendSMS = async (phoneNumber: string, message: string) => {
  const sns = new SNS({ region: "us-east-1" });

  await sns.setSMSAttributes({
    attributes: {
      DefaultSMSType: "Transactional",
    },
  });

  const params: PublishInput = {
    PhoneNumber: phoneNumber,
    Message: message,
    MessageStructure: "string",
  };

  return await sns.publish(params);
};
