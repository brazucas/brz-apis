import { Request, Response } from "express";

export function ping(request: Request, response: Response<string>): void {
  response.send("pong");
}

export function index(request: Request, response: Response<string>): void {
  response.send("Website API");
}

export default { ping, index };
