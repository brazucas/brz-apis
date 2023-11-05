import { sendSMS } from "@/adapters/sns";
import { SNS } from "@aws-sdk/client-sns";

const publishMock = jest.fn();
const setSMSAttributesMock = jest.fn();

jest.mock("@aws-sdk/client-sns", () => ({
  SNS: jest.fn().mockImplementation(() => ({
    publish: publishMock,
    setSMSAttributes: setSMSAttributesMock,
  })),
}));

describe("SNS Adapter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("sendEmail", () => {
    it("should send email through SNS", async () => {
      await sendSMS("61467995339", "Lorem Ipsum");

      expect(SNS).toHaveBeenCalledTimes(1);
      expect(publishMock).toHaveBeenCalledTimes(1);
      expect(setSMSAttributesMock).toHaveBeenCalledTimes(1);

      expect(setSMSAttributesMock).toHaveBeenCalledWith({
        attributes: {
          DefaultSMSType: "Transactional",
        },
      });

      expect(publishMock).toHaveBeenCalledWith({
        PhoneNumber: "61467995339",
        Message: "Lorem Ipsum",
        MessageStructure: "string",
      });
    });
  });
});
