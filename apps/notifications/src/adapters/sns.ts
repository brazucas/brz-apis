import { PublishInput, SNS } from "@aws-sdk/client-sns";

export const sendSMS = (phoneNumber: string, message: string) =>
  new Promise((resolve, reject) => {
    const sns = new SNS({ region: "us-east-1" });

    sns.setSMSAttributes(
      {
        attributes: {
          DefaultSMSType: "Transactional",
        },
      },
      (error: any) => {
        console.error(error);
        if (error) reject(error);
      }
    );

    const params: PublishInput = {
      PhoneNumber: phoneNumber,
      Message: message,
      MessageStructure: "string",
    };

    sns.publish(params, (err, data) => {
      if (err) {
        return reject(err);
      }

      resolve(true);
    });
  });
