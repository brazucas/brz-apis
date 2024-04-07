import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AWSS3Adapter } from "@storage/adapters/aws-s3.adapter";

jest.mock("@aws-sdk/s3-request-presigner", () => {
  return {
    getSignedUrl: jest.fn(),
  };
});

describe("StorageService", () => {
  const service = new AWSS3Adapter();

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("should test generateDownloadUrl method", () => {
    // it("should return a signed url", async () => {
    //   (getSignedUrl as jest.Mock).mockReturnValue("https://signed-url.com");

    //   const url = await service.generateDownloadUrl("GTA_SA.iso");
    //   expect(url).toEqual("https://signed-url.com");
    // });

    it("should throw an error if file is not allowed", () => {
      expect(() => service.generateDownloadUrl("GTA_III.iso")).toThrow(
        "File not allowed"
      );
    });

    it("should throw an error if getSignedUrl throws an error", () => {
      (getSignedUrl as jest.Mock).mockImplementation(() => {
        throw new Error("Error");
      });

      expect(() => service.generateDownloadUrl("gta_sa.exe")).toThrow("Error");
    });
  });
});
