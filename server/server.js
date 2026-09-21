import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import {
  ZipArchive
} from "archiver";
import {
  S3Client,
  HeadBucketCommand,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";


import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
  }
});

const upload = multer({
  storage: multer.memoryStorage()
});

app.get("/", (req, res) => {
  res.json({
    message: "VPro Photo Gallery server is running."
  });
});

app.get("/api/r2-test", async (req, res) => {
  try {
    await r2.send(
      new HeadBucketCommand({
        Bucket: process.env.R2_BUCKET_NAME
      })
    );

    res.json({
      success: true,
      message: "Successfully connected to the VPro Photo Gallery R2 bucket.",
      bucket: process.env.R2_BUCKET_NAME
    });
  } catch (error) {
    console.error("R2 connection error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to access the Cloudflare R2 bucket.",
      error: error.message
    });
  }
});

app.post("/api/upload-test", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file was uploaded."
      });
    }

    const safeName = req.file.originalname.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    );


    const folder = req.body.folder || "test";

const key = `${folder}/${Date.now()}-${safeName}`;

    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
      })
    );

    res.json({
      success: true,
      message: "File uploaded successfully to Cloudflare R2.",
      key,
      fileName: req.file.originalname,
      contentType: req.file.mimetype,
      size: req.file.size
    });
  } catch (error) {
    console.error("R2 upload error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload file to Cloudflare R2.",
      error: error.message
    });
  }
});
app.get("/api/image-url", async (req, res) => {
  try {
    const { key } = req.query;

    if (!key) {
      return res.status(400).json({
        success: false,
        message: "Image key is required."
      });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key
    });

    const url = await getSignedUrl(r2, command, {
      expiresIn: 3600
    });

    res.json({
      success: true,
      url
    });
  } catch (error) {
    console.error("Signed URL error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate image URL.",
      error: error.message
    });
  }
});

app.get("/api/download-photo", async (req, res) => {
  try {
    const { key } = req.query;

    if (!key) {
      return res.status(400).json({
        success: false,
        message: "Image key is required."
      });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key
    });

    const result = await r2.send(command);

    const fileName =
      key.split("/").pop() || "photo.jpg";

    res.setHeader(
      "Content-Type",
      result.ContentType || "application/octet-stream"
    );

    res.setHeader(
      "Content-Length",
      result.ContentLength
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName.replace(/"/g, "")}"`
    );

    result.Body.pipe(res);
  } catch (error) {
    console.error(
      "Photo download error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to download photo.",
      error: error.message
    });
  }
});


app.get("/api/download-collection", async (req, res) => {
  try {
    const { albumId, folderId, folderName } = req.query;

    if (!albumId || !folderId) {
      return res.status(400).json({
        success: false,
        message: "Album ID and folder ID are required."
      });
    }

    const prefix =
      `albums/${albumId}/folders/${folderId}/photos/`;

    const result = await r2.send(
      new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME,
        Prefix: prefix
      })
    );

    const objects = (result.Contents || []).filter(
      (object) => object.Key
    );

    if (objects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No photos found in this collection."
      });
    }

    const zipName =
      `${folderName || "collection"}.zip`
        .replace(/[^a-zA-Z0-9._-]/g, "_");

    res.status(200);

    res.setHeader(
      "Content-Type",
      "application/zip"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${zipName}"`
    );

    const archive = new ZipArchive({
  zlib: { level: 5 }
});

    archive.on("warning", (error) => {
      console.warn(
        "Archive warning:",
        error
      );
    });

    archive.on("error", (error) => {
      console.error(
        "Archive error:",
        error
      );

      if (!res.destroyed) {
        res.destroy(error);
      }
    });

    res.on("close", () => {
      if (!res.writableEnded) {
        archive.abort();
      }
    });

    archive.pipe(res);

    for (const object of objects) {
      const photo = await r2.send(
        new GetObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: object.Key
        })
      );

      if (!photo.Body) {
        continue;
      }

      const fileName =
        object.Key.split("/").pop() ||
        "photo.jpg";

      archive.append(photo.Body, {
        name: fileName
      });
    }

    await archive.finalize();

  } catch (error) {
    console.error(
      "Collection download error:",
      error
    );

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message:
          "Failed to download collection.",
        error: error.message
      });
    }

    if (!res.destroyed) {
      res.destroy(error);
    }
  }
});

app.get("/api/download-album", async (req, res) => {
  try {
    const {
      albumId,
      albumName,
      folderNames
    } = req.query;

    if (!albumId) {
      return res.status(400).json({
        success: false,
        message: "Album ID is required."
      });
    }

    let folderNameMap = {};

    try {
      if (folderNames) {
        folderNameMap = JSON.parse(folderNames);
      }
    } catch (error) {
      console.warn(
        "Failed to parse folder names:",
        error
      );
    }

    /*
     * Get ALL photos from the album.
     * R2 returns objects in batches, so we
     * continue requesting until everything
     * has been collected.
     */

    const prefix =
      `albums/${albumId}/folders/`;

    let allObjects = [];
    let continuationToken = undefined;

    do {
      const result = await r2.send(
        new ListObjectsV2Command({
          Bucket: process.env.R2_BUCKET_NAME,
          Prefix: prefix,
          ContinuationToken:
            continuationToken
        })
      );

      const objects =
        (result.Contents || []).filter(
          (object) =>
            object.Key &&
            object.Key.includes("/photos/")
        );

      allObjects.push(...objects);

      continuationToken =
        result.IsTruncated
          ? result.NextContinuationToken
          : undefined;

    } while (continuationToken);

    if (allObjects.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "No photos found in this album."
      });
    }

    console.log(
      `Album download: ${allObjects.length} photos found.`
    );

    const zipName =
      `${albumName || "album"}.zip`
        .replace(
          /[^a-zA-Z0-9._-]/g,
          "_"
        );

    res.status(200);

    res.setHeader(
      "Content-Type",
      "application/zip"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${zipName}"`
    );

    const archive = new ZipArchive({
      zlib: { level: 5 }
    });

    archive.on("warning", (error) => {
      console.warn(
        "Album archive warning:",
        error
      );
    });

    archive.on("error", (error) => {
      console.error(
        "Album archive error:",
        error
      );

      if (!res.destroyed) {
        res.destroy(error);
      }
    });

    res.on("close", () => {
      if (!res.writableEnded) {
        archive.abort();
      }
    });

    archive.pipe(res);

    /*
     * Add every photo to the ZIP.
     */

    for (const object of allObjects) {
      try {
        const photo = await r2.send(
          new GetObjectCommand({
            Bucket:
              process.env.R2_BUCKET_NAME,
            Key: object.Key
          })
        );

        if (!photo.Body) {
          continue;
        }

        const parts =
          object.Key.split("/");

        const foldersIndex =
          parts.indexOf("folders");

        const photosIndex =
          parts.indexOf("photos");

        const folderId =
          foldersIndex !== -1
            ? parts[foldersIndex + 1]
            : "collection";

        const folderName =
          folderNameMap[folderId] ||
          folderId;

        const fileName =
          photosIndex !== -1 &&
          parts[photosIndex + 1]
            ? parts[photosIndex + 1]
            : "photo.jpg";

        const safeFolderName =
          String(folderName)
            .replace(
              /[^a-zA-Z0-9._ -]/g,
              "_"
            )
            .trim() ||
          "collection";

        archive.append(photo.Body, {
          name:
            `${safeFolderName}/${fileName}`
        });

      } catch (error) {
        console.error(
          `Failed to add ${object.Key}:`,
          error
        );
      }
    }

    await archive.finalize();

  } catch (error) {
    console.error(
      "Album download error:",
      error
    );

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message:
          "Failed to download album.",
        error: error.message
      });
    }

    if (!res.destroyed) {
      res.destroy(error);
    }
  }
});

app.delete("/api/delete-photo", async (req, res) => {
  try {
    const { key } = req.body;

    if (!key) {
      return res.status(400).json({
        success: false,
        message: "Photo key is required."
      });
    }

    await r2.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key
      })
    );

    res.json({
      success: true,
      message: "Photo deleted successfully from R2."
    });
  } catch (error) {
    console.error(
      "Photo deletion error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete photo.",
      error: error.message
    });
  }
});

app.delete("/api/delete-folder", async (req, res) => {
  try {
    const { albumId, folderId } = req.body;

    if (!albumId || !folderId) {
      return res.status(400).json({
        success: false,
        message:
          "Album ID and folder ID are required."
      });
    }

    const prefix =
      `albums/${albumId}/folders/${folderId}/`;

    let allObjects = [];
    let continuationToken = undefined;

    do {
      const result = await r2.send(
        new ListObjectsV2Command({
          Bucket: process.env.R2_BUCKET_NAME,
          Prefix: prefix,
          ContinuationToken:
            continuationToken
        })
      );

      const objects =
        (result.Contents || []).filter(
          (object) => object.Key
        );

      allObjects.push(...objects);

      continuationToken =
        result.IsTruncated
          ? result.NextContinuationToken
          : undefined;

    } while (continuationToken);

    for (const object of allObjects) {
      await r2.send(
        new DeleteObjectCommand({
          Bucket:
            process.env.R2_BUCKET_NAME,
          Key: object.Key
        })
      );
    }

    res.json({
      success: true,
      message:
        "Collection files deleted successfully from R2.",
      deletedFiles: allObjects.length
    });

  } catch (error) {
    console.error(
      "Collection deletion error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete collection files.",
      error: error.message
    });
  }
});

app.delete("/api/delete-album", async (req, res) => {
  try {
    const { albumId } = req.body;

    if (!albumId) {
      return res.status(400).json({
        success: false,
        message: "Album ID is required."
      });
    }

    const prefix = `albums/${albumId}/`;

    let allObjects = [];
    let continuationToken;

    do {
      const result = await r2.send(
        new ListObjectsV2Command({
          Bucket: process.env.R2_BUCKET_NAME,
          Prefix: prefix,
          ContinuationToken: continuationToken
        })
      );

      allObjects.push(
        ...(result.Contents || [])
      );

      continuationToken =
        result.IsTruncated
          ? result.NextContinuationToken
          : undefined;

    } while (continuationToken);

    for (const object of allObjects) {
      await r2.send(
        new DeleteObjectCommand({
          Bucket:
            process.env.R2_BUCKET_NAME,
          Key: object.Key
        })
      );
    }

    res.json({
      success: true,
      deletedFiles:
        allObjects.length
    });

  } catch (error) {
    console.error(
      "Album deletion error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete album files.",
      error: error.message
    });
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`VPro server running on port ${PORT}`);
});