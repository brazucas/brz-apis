import { requestEmail, requestSms } from "@/notifications.controller";
import { notificationService } from "@/notifications.service";
import { Request, Response } from "express";

jest.mock("@/notifications.service");

jest.useFakeTimers().setSystemTime(new Date("2021-10-10T10:00:00Z"));

describe("notificationsController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    process.env.WAITING_TIME_AFTER_MAX_CODES = "";
    process.env.MAX_CODES = "";
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("requestSms", () => {
    it("should return 400 if phone number is invalid", async () => {
      const phoneNumber = "1234567890";
      mockRequest.body = { phoneNumber };

      await requestSms(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Invalid phone number.",
      });
    });

    it("should return 400 if phone number is not informed", async () => {
      mockRequest.body = {};

      await requestSms(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Fill all required fields.",
      });
    });

    it("should return 500 if notificationService throws an error", async () => {
      const phoneNumber = "61467552229";
      mockRequest.body = { phoneNumber };
      (notificationService.sendSMS as jest.Mock).mockRejectedValue(
        new Error("Test error")
      );

      await requestSms(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });

    it("should return 200 if notificationService succeeds", async () => {
      const phoneNumber = "61467552229";
      mockRequest.body = { phoneNumber };

      (notificationService.sendSMS as jest.Mock).mockResolvedValue(true);

      (notificationService.isCodeConfirmed as jest.Mock).mockResolvedValue(
        false
      );

      (notificationService.readCode as jest.Mock).mockResolvedValue({
        tries: 0,
        nextTry: new Date(),
      });

      await requestSms(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "SMS sent",
      });
    });
  });

  describe("requestEmail", () => {
    test.each([
      "myemail",
      "myemail@",
      "myemail@brz",
      "myemail@brz.",
      "myemail@.com",
      "myemail@.com.",
      "myemail@.com.br",
      "myemail@.com.br.",
    ])("should return 400 invalid for email %s", async (email) => {
      mockRequest.body = { email };

      await requestEmail(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Invalid email.",
      });
    });

    it("should return 400 if phone number is not informed", async () => {
      mockRequest.body = {};

      await requestEmail(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Fill all required fields.",
      });
    });

    it("should return 500 if notificationService.sendEmail throws an error", async () => {
      mockRequest.body = { email: "mandrakke@brz.gg" };
      (notificationService.sendEmail as jest.Mock).mockRejectedValue(
        new Error("Test error")
      );

      await requestEmail(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });

    it("should return 200 if notificationService.sendEmail succeeds", async () => {
      mockRequest.body = { email: "mandrakke@brz.gg" };

      (notificationService.sendEmail as jest.Mock).mockResolvedValue(true);

      (notificationService.isCodeConfirmed as jest.Mock).mockResolvedValue(
        false
      );

      (notificationService.readCode as jest.Mock).mockResolvedValue({
        tries: 0,
        nextTry: new Date(),
      });

      await requestEmail(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Email sent",
      });
    });
  });

  describe.each([
    {
      controllerName: "requestSms",
      controllerMethod: requestSms,
      body: { phoneNumber: "61467552229" },
    },
    {
      controllerName: "requestEmail",
      controllerMethod: requestEmail,
      body: { email: "mandrakke@brz.gg" },
    },
  ])("codeRequest for $controllerName", ({ controllerMethod, body }) => {
    it("should return 200 if code is already confirmed", async () => {
      mockRequest.body = body;
      (notificationService.isCodeConfirmed as jest.Mock).mockResolvedValue(
        true
      );

      await controllerMethod(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "already confirmed",
      });
    });

    it("should return 400 if code request is in cooldown", async () => {
      mockRequest.body = body;

      (notificationService.isCodeConfirmed as jest.Mock).mockResolvedValue(
        false
      );

      (notificationService.readCode as jest.Mock).mockResolvedValue({
        tries: 1,
        nextTry: new Date(Date.now() + 1000),
      });

      await controllerMethod(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: expect.stringMatching(
          /Id .+ request on cooldown for 1 more seconds./
        ),
      });
    });

    it("should put request source on cooldown for 1 hour if default tries limit is exceeded", async () => {
      mockRequest.body = body;

      (notificationService.isCodeConfirmed as jest.Mock).mockResolvedValue(
        false
      );

      (notificationService.readCode as jest.Mock).mockResolvedValue({
        tries: 3,
        nextTry: new Date(),
      });

      await controllerMethod(mockRequest as Request, mockResponse as Response);

      expect(notificationService.writeCode).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        0,
        new Date(new Date().getTime() + 3600 * 1000)
      );
    });

    it("should put request source on cooldown using waiting time from env variable if default tries limit is exceeded", async () => {
      process.env.WAITING_TIME_AFTER_MAX_CODES = "7200";

      mockRequest.body = body;

      (notificationService.isCodeConfirmed as jest.Mock).mockResolvedValue(
        false
      );

      (notificationService.readCode as jest.Mock).mockResolvedValue({
        tries: 3,
        nextTry: new Date(),
      });

      await controllerMethod(mockRequest as Request, mockResponse as Response);

      expect(notificationService.writeCode).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        0,
        new Date(new Date().getTime() + 7200 * 1000)
      );
    });

    it("should put request source on cooldown using max tries from env variable if tries limit is exceeded", async () => {
      process.env.MAX_CODES = "1";

      mockRequest.body = body;

      (notificationService.isCodeConfirmed as jest.Mock).mockResolvedValue(
        false
      );

      (notificationService.readCode as jest.Mock).mockResolvedValue({
        tries: 1,
        nextTry: new Date(),
      });

      await controllerMethod(mockRequest as Request, mockResponse as Response);

      expect(notificationService.writeCode).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        0,
        expect.any(Date)
      );
    });

    it("should increment number of tries for every request from the same source", async () => {
      mockRequest.body = body;

      (notificationService.isCodeConfirmed as jest.Mock).mockResolvedValue(
        false
      );

      (notificationService.readCode as jest.Mock).mockResolvedValue({
        tries: 1,
        nextTry: new Date(),
      });

      await controllerMethod(mockRequest as Request, mockResponse as Response);

      expect(notificationService.writeCode).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        2
      );
    });
  });
});
