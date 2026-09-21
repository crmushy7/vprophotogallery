import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

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

app.get("/", (req, res) => {
  res.json({
    message: "VPro Photo Gallery server is running."
  });
});

app.get("/api/r2-test", async (req, res) => {
  try {
    const result = await r2.send(new ListBucketsCommand({}));

    res.json({
      success: true,
      message: "Successfully connected to Cloudflare R2.",
      buckets: result.Buckets?.map((bucket) => bucket.Name) || []
    });
  } catch (error) {
    console.error("R2 connection error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to connect to Cloudflare R2.",
      error: error.message
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`VPro server running on http://localhost:${PORT}`);
});