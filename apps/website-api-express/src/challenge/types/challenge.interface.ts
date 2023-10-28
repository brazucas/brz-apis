export interface ChallengeService {
  checkChallenge(token: string): Promise<boolean>;
}
