import { ChallengeService } from "@challenge/types/challenge.interface";
import { StorageService } from "@storage/types/storage.interface";
import { GoogleRecaptchaAdapter } from "./challenge/adapters/google-recaptcha.adapter";
import { AWSS3Adapter } from "./storage/adapters/aws-s3.adapter";

export const challengeService: ChallengeService = new GoogleRecaptchaAdapter();
export const storageService: StorageService = new AWSS3Adapter();
