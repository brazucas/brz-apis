import { DEFAULT_FILE_DOWNLOAD_EXPIRATION_TIME } from '@storage/types/storage.constants';

it('should check if default file download expiration time is one hour', () => {
  expect(DEFAULT_FILE_DOWNLOAD_EXPIRATION_TIME).toBe(3600);
});
