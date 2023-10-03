import { ChallengeService } from '@challenge/types/challenge.interface';
import { Controller, Get, Inject, Param, Query, Res } from '@nestjs/common';
import { StorageService } from '@storage/types/storage.interface';
import { Response } from 'express';

@Controller('download')
export class FileDownloadController {
  constructor(
    @Inject('STORAGE_SERVICE') protected readonly storageSvc: StorageService,
    @Inject('CHALLENGE_SERVICE')
    protected readonly challengeSvc: ChallengeService,
  ) {}

  @Get(':fileName')
  async downloadFile(
    @Res() res: Response,
    @Param('fileName') fileName: string | null | undefined,
    @Query('token') token: string | null | undefined,
  ) {
    if (!fileName) {
      return res.status(400).json({
        error: 'File name is required',
      });
    }

    try {
      const challenge = await this.challengeSvc.checkChallenge(token as string);

      if (!challenge) {
        return res.status(400).json({
          error: 'Recaptcha challenge failed',
        });
      }

      const url = await this.storageSvc.generateDownloadUrl(fileName as string);

      res
        .status(200)
        .setHeader('Access-Control-Allow-Origin', 'https://blog.brz.gg')
        .json({ url });
    } catch (err: any) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
}
