import { confirmCode, requestCode } from "@/notifications.controller";
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
      mockRequest.body = { id: phoneNumber };

      await requestCode(
        mockRequest as Request,
        mockResponse as Response,
        "sms"
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        invalidPhoneNumber: true,
      });
    });

    it("should return 400 if phone number is not informed", async () => {
      mockRequest.body = {};

      await requestCode(
        mockRequest as Request,
        mockResponse as Response,
        "sms"
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        informAllFields: true,
      });
    });

    it("should return 500 if notificationService throws an error", async () => {
      const phoneNumber = "61467552229";
      mockRequest.body = { id: phoneNumber };
      (notificationService.sendSMS as jest.Mock).mockRejectedValue(
        new Error("Test error")
      );

      await requestCode(
        mockRequest as Request,
        mockResponse as Response,
        "sms"
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });

    it("should return 200 if notificationService succeeds", async () => {
      const phoneNumber = "61467552229";
      mockRequest.body = { id: phoneNumber };

      (notificationService.sendSMS as jest.Mock).mockResolvedValue(true);

      (notificationService.readCode as jest.Mock).mockResolvedValue({
        tries: 0,
        nextTry: new Date(),
      });

      await requestCode(
        mockRequest as Request,
        mockResponse as Response,
        "sms"
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        codeSent: true,
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
      mockRequest.body = { id: email };

      await requestCode(
        mockRequest as Request,
        mockResponse as Response,
        "email"
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        invalidEmail: true,
      });
    });

    it("should return 400 if phone number is not informed", async () => {
      mockRequest.body = {};

      await requestCode(
        mockRequest as Request,
        mockResponse as Response,
        "email"
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        informAllFields: true,
      });
    });

    it("should return 500 if notificationService.sendEmail throws an error", async () => {
      mockRequest.body = { id: "mandrakke@brz.gg" };
      (notificationService.sendEmail as jest.Mock).mockRejectedValue(
        new Error("Test error")
      );

      await requestCode(
        mockRequest as Request,
        mockResponse as Response,
        "email"
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });

    it("should return 200 if notificationService.sendEmail succeeds", async () => {
      mockRequest.body = { id: "mandrakke@brz.gg" };

      (notificationService.sendEmail as jest.Mock).mockResolvedValue(true);

      (notificationService.readCode as jest.Mock).mockResolvedValue({
        tries: 0,
        nextTry: new Date(),
      });

      await requestCode(
        mockRequest as Request,
        mockResponse as Response,
        "email"
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        codeSent: true,
      });
    });
  });

  describe.each([
    {
      controllerName: "requestSms",
      controllerMethod: requestCode,
      controllerType: "sms",
      body: { id: "61467552229" },
    },
    {
      controllerName: "requestEmail",
      controllerMethod: requestCode,
      controllerType: "email",
      body: { id: "mandrakke@brz.gg" },
    },
  ])(
    "requestCode for $controllerName",
    ({ controllerMethod, controllerType, body }) => {
      it("should return 400 if code request is in cooldown", async () => {
        mockRequest.body = body;

        (notificationService.readCode as jest.Mock).mockResolvedValue({
          tries: 1,
          nextTry: new Date(Date.now() + 1000),
        });

        await controllerMethod(
          mockRequest as Request,
          mockResponse as Response,
          controllerType as "sms" | "email"
        );

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          cooldownTime: 1,
          tries: 1,
        });
      });

      it("should put request source on cooldown for 1 hour if default tries limit is exceeded", async () => {
        mockRequest.body = body;

        (notificationService.readCode as jest.Mock).mockResolvedValue({
          tries: 3,
          nextTry: new Date(),
        });

        await controllerMethod(
          mockRequest as Request,
          mockResponse as Response,
          controllerType as "sms" | "email"
        );

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

        (notificationService.readCode as jest.Mock).mockResolvedValue({
          tries: 3,
          nextTry: new Date(),
        });

        await controllerMethod(
          mockRequest as Request,
          mockResponse as Response,
          controllerType as "sms" | "email"
        );

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

        (notificationService.readCode as jest.Mock).mockResolvedValue({
          tries: 1,
          nextTry: new Date(),
        });

        await controllerMethod(
          mockRequest as Request,
          mockResponse as Response,
          controllerType as "sms" | "email"
        );

        expect(notificationService.writeCode).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(String),
          0,
          expect.any(Date)
        );
      });

      it("should increment number of tries for every request from the same source", async () => {
        mockRequest.body = body;

        (notificationService.readCode as jest.Mock).mockResolvedValue({
          tries: 1,
          nextTry: new Date(),
        });

        await controllerMethod(
          mockRequest as Request,
          mockResponse as Response,
          controllerType as "sms" | "email"
        );

        expect(notificationService.writeCode).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(String),
          2
        );
      });
    }
  );

  describe("confirmCode", () => {
    it("should return 400 with informAllFields if id is not informed and code is informed", async () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as any;

      await confirmCode(
        {
          body: {
            code: "123",
          },
          params: {
            id: undefined,
          },
        } as any,
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        informAllFields: true,
      });
    });

    it("should return 400 with informAllFields if code is not informed and id is not informed", async () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as any;

      await confirmCode(
        {
          body: {
            code: undefined,
          },
          params: {
            id: "123",
          },
        } as any,
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        informAllFields: true,
      });
    });

    it("should return 404 if code is not found", async () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as any;

      (notificationService.readCode as jest.Mock).mockReturnValue(null);

      await confirmCode(
        {
          body: {
            code: "123",
          },
          params: {
            id: "123",
          },
        } as any,
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        codeNotFound: true,
      });
    });

    it("should return 400 if code informed is different from stored", async () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as any;

      (notificationService.readCode as jest.Mock).mockReturnValue({
        code: "456",
      });

      await confirmCode(
        {
          body: {
            code: "123",
          },
          params: {
            id: "123",
          },
        } as any,
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        wrongCode: true,
      });
    });

    it("should return 200 if code informed is equal to stored", async () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as any;

      (notificationService.readCode as jest.Mock).mockReturnValue({
        code: "123",
      });

      await confirmCode(
        {
          body: {
            code: "123",
          },
          params: {
            id: "123",
          },
        } as any,
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it("should return 500 when an error is thrown while reading code", async () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as any;

      (notificationService.readCode as jest.Mock).mockRejectedValue(
        new Error("Test error")
      );

      await confirmCode(
        {
          body: {
            code: "123",
          },
          params: {
            id: "123",
          },
        } as any,
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });
});
