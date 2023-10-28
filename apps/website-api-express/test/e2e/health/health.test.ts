process.env.RECAPTCHA_SECRET = "test";

import { app } from "@/app";
import * as request from "supertest";

describe("healthRoutes - e2e", () => {
  it('should respond with "Website API" on GET /', async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.text).toBe("Website API");
  });

  it('should respond with "pong" on GET /ping', async () => {
    const res = await request(app).get("/ping");

    expect(res.status).toBe(200);
    expect(res.text).toBe("pong");
  });
});
