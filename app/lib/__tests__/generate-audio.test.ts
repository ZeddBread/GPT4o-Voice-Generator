import { checkFileExists } from '../generate-audio';
import fs from 'node:fs';

describe('checkFileExists', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns original name when file does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    await expect(checkFileExists('myfile')).resolves.toBe('myfile');
  });

  it('appends _1 when original file exists', async () => {
    const mock = jest.spyOn(fs, 'existsSync');
    mock.mockReturnValueOnce(true).mockReturnValueOnce(false);
    await expect(checkFileExists('myfile')).resolves.toBe('myfile_1');
  });

  it('increments index for multiple existing files', async () => {
    const mock = jest.spyOn(fs, 'existsSync');
    mock
      .mockReturnValueOnce(true) // myfile.wav exists
      .mockReturnValueOnce(true) // myfile_1.wav exists
      .mockReturnValueOnce(false); // myfile_2.wav does not exist
    await expect(checkFileExists('myfile')).resolves.toBe('myfile_2');
  });
});
