import { challengeService, storageService } from "@/services";
import { downloadFile } from "@file-download/file-download.controller";

jest.mock("@/services", () => ({
  challengeService: {
    checkChallenge: jest.fn(),
  },
  storageService: {
    generateDownloadUrl: jest.fn(),
  },
}));

describe("FileDownloadController", () => {
  describe("should test downloadFile method", () => {
    let res: any;
    let req: any;

    beforeEach(() => {
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      req = {
        params: {},
        query: {},
      } as any;
    });

    it("should return 400 if fileName is not provided", async () => {
      await downloadFile(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "File name is required",
      });
    });

    it("should return 400 if token is not provided", async () => {
      const req = {
        params: {
          fileName: "test",
        },
        query: {},
      };

      await downloadFile(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Recaptcha token is required",
      });
    });

    it("should return 500 if challengeService throws an error", async () => {
      const error = new Error("test");

      (challengeService.checkChallenge as jest.Mock).mockRejectedValueOnce(
        error
      );

      const req: any = {
        params: {
          fileName: "test",
        },
        query: {
          token: "test",
        },
      };

      await downloadFile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: error.message,
      });
    });

    it("should return 400 if challenge fails", async () => {
      (challengeService.checkChallenge as jest.Mock).mockResolvedValueOnce(
        false
      );

      const req: any = {
        params: {
          fileName: "test",
        },
        query: {
          token: "test",
        },
      };

      await downloadFile(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Recaptcha challenge failed",
      });
    });

    it("should return 500 if storageService throws an error", async () => {
      const error = new Error("test");

      (challengeService.checkChallenge as jest.Mock).mockResolvedValueOnce(
        true
      );
      (storageService.generateDownloadUrl as jest.Mock).mockRejectedValueOnce(
        error
      );

      const req: any = {
        params: {
          fileName: "test",
        },
        query: {
          token: "test",
        },
      };

      await downloadFile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: error.message,
      });
    });

    it("should return 200 if everything is ok", async () => {
      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        setHeader: jest.fn().mockReturnThis(),
      };

      const req: any = {
        params: {
          fileName: "test",
        },
        query: {
          token: "test",
        },
      };

      (challengeService.checkChallenge as jest.Mock).mockResolvedValueOnce(
        true
      );
      (storageService.generateDownloadUrl as jest.Mock).mockResolvedValueOnce(
        "test"
      );

      await downloadFile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.setHeader).toHaveBeenCalledWith(
        "Access-Control-Allow-Origin",
        "https://blog.brz.gg"
      );
      expect(res.json).toHaveBeenCalledWith({
        url: "test",
      });
    });
  });
});
