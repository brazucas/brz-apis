import { SES, SendEmailRequest } from "@aws-sdk/client-ses";

export const sendEmail = (recipient: string, message: string) => {
  const ses = new SES({ region: "us-east-1" });
  const params: SendEmailRequest = {
    Source: process.env.EMAIL_SOURCE || "tech@brz.gg",
    Destination: {
      ToAddresses: [recipient],
    },
    Message: {
      Subject: {
        Data: "BRZ - Código de verificação",
      },
      Body: {
        Text: {
          Data: message,
        },
      },
    },
  };

  return ses.sendEmail(params);
};
