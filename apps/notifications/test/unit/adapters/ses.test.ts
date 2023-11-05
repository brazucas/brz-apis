import { sendEmail } from "@/adapters/ses";
import { SES } from "@aws-sdk/client-ses";

const sendEmailMock = jest.fn();

jest.mock("@aws-sdk/client-ses", () => ({
  SES: jest.fn().mockImplementation(() => ({
    sendEmail: sendEmailMock,
  })),
}));

describe("SES Adapter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("sendEmail", () => {
    it("should send email through SES", async () => {
      await sendEmail("player@brz.gg", "Lorem Ipsum");

      expect(SES).toHaveBeenCalledTimes(1);
      expect(sendEmailMock).toHaveBeenCalledTimes(1);
      expect(sendEmailMock).toHaveBeenCalledWith({
        Source: "tech@brz.gg",
        Destination: {
          ToAddresses: ["player@brz.gg"],
        },
        Message: {
          Subject: {
            Data: "BRZ - Código de verificação",
          },
          Body: {
            Text: {
              Data: "Lorem Ipsum",
            },
          },
        },
      });
    });

    it("should send email through SES using source from env variable", async () => {
      process.env.EMAIL_SOURCE = "custom_source@brz.gg";

      await sendEmail("player@brz.gg", "Lorem Ipsum");

      expect(SES).toHaveBeenCalledTimes(1);
      expect(sendEmailMock).toHaveBeenCalledTimes(1);
      expect(sendEmailMock).toHaveBeenCalledWith({
        Source: "custom_source@brz.gg",
        Destination: {
          ToAddresses: ["player@brz.gg"],
        },
        Message: {
          Subject: {
            Data: "BRZ - Código de verificação",
          },
          Body: {
            Text: {
              Data: "Lorem Ipsum",
            },
          },
        },
      });
    });
  });
});
