
const {
  PutObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3Client = require("../config/s3");

const BUCKET = process.env.S3_BUCKET || "fleettrack-documents";
const PRESIGNED_URL_TTL = 15 * 60; // 15 minutes

// Upload a file to S3 / MinIO
const uploadFile = async ({
  key,
  body,
  contentType = "application/octet-stream",
}) => {
  if (!key || !body) {
    throw new Error("File key and body are required");
  }

  const buffer = Buffer.isBuffer(body) ? body : Buffer.from(body);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return {
    bucket: BUCKET,
    s3Key: key,
    sizeBytes: buffer.length,
    contentType,
  };
};

// List files stored in the bucket
const listFiles = async ({ prefix = "", maxKeys = 100 } = {}) => {
  const response = await s3Client.send(
    new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix,
      MaxKeys: Math.min(Math.max(Number(maxKeys) || 100, 1), 1000),
    })
  );

  return (response.Contents || []).map((file) => ({
    key: file.Key,
    sizeBytes: file.Size,
    lastModified: file.LastModified,
    etag: file.ETag,
  }));
};

// Download a file as a Buffer
const downloadFile = async (key) => {
  if (!key) {
    throw new Error("File key is required");
  }

  const response = await s3Client.send(
    new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );

  const chunks = [];

  for await (const chunk of response.Body) {
    chunks.push(Buffer.from(chunk));
  }

  return {
    buffer: Buffer.concat(chunks),
    contentType: response.ContentType || "application/octet-stream",
    sizeBytes: response.ContentLength,
  };
};

// Delete a file from the bucket
const deleteFile = async (key) => {
  if (!key) {
    throw new Error("File key is required");
  }

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );

  return { bucket: BUCKET, s3Key: key, deleted: true };
};

// Generate a temporary download URL (15 minutes by default)
const createPresignedDownloadUrl = async (
  key,
  expiresIn = PRESIGNED_URL_TTL
) => {
  if (!key) {
    throw new Error("File key is required");
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  return getSignedUrl(s3Client, command, {
    expiresIn: Math.min(Math.max(expiresIn, 1), PRESIGNED_URL_TTL),
  });
};

module.exports = {
  uploadFile,
  listFiles,
  downloadFile,
  deleteFile,
  createPresignedDownloadUrl,
};
