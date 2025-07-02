// CustomFile interface to include path
export interface CustomFile extends Express.Multer.File {
  path: string;
  originalname: string;
  filename: string;
}