export interface StorageService {
  generateDownloadUrl(file: string, expiresIn?: number): Promise<string>;
}
