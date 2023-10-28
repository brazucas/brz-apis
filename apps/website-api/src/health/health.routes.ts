import { Router } from "express";
import { index, ping } from "./health.controller";

const router = Router();

router.get("/ping", ping);
router.get("/", index);

export { router as healthRoutes };
