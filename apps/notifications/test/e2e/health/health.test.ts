import { app } from "@/app";
import * as request from "supertest";

describe("healthRoutes - e2e", () => {
  it('should respond with "Website API" on GET /', async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.text).toBe("Notifications API");
  });
});
