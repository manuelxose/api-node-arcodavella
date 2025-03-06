import { GoogleDriveConnection } from "../../data/googleDrive/config/GoogleDrive.config";
import { StorageDataSource } from "../../domain/datasources";
import { CustomError } from "../../domain/errors";

export class GoogleDriveDataSource implements StorageDataSource {
  private connection: GoogleDriveConnection;

  constructor() {
    this.connection = new GoogleDriveConnection();
  }

  async deleteFile(file: string): Promise<void> {
    const drive = this.connection.getDriveInstance();

    try {
      await drive.files.delete({
        fileId: file,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw CustomError.badRequest(error.message);
      }
      throw CustomError.badRequest("Error deleting file");
    }
  }

  async getFile(file: string): Promise<Buffer> {
    const drive = this.connection.getDriveInstance();

    try {
      const response = await drive.files.get(
        {
          fileId: file,
          alt: "media",
        },
        { responseType: "stream" }
      );

      return new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        response.data
          .on("data", (chunk) => {
            chunks.push(chunk);
          })
          .on("end", () => {
            resolve(Buffer.concat(chunks));
          })
          .on("error", (error) => {
            reject(error);
          });
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw CustomError.badRequest(error.message);
      }
      throw CustomError.badRequest("Error getting file");
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const drive = this.connection.getDriveInstance();

    try {
      const response = await drive.files.create({
        requestBody: {
          name: file.originalname,
          mimeType: file.mimetype,
        },
        media: {
          mimeType: file.mimetype,
          body: file.buffer,
        },
      });

      return response.data.id as string;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw CustomError.badRequest(error.message);
      }
      throw CustomError.badRequest("Error uploading file");
    }
  }
}
