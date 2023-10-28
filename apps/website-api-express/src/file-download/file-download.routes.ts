import { Router } from "express";
import { downloadFile } from "./file-download.controller";

const router = Router();

router.get("/:fileName", downloadFile);

export { router as fileDownloadRoutes };
