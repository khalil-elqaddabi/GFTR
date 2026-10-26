
require("dotenv").config();

const {
  uploadFile,
  listFiles,
  downloadFile,
  deleteFile,
} = require("../src/services/storageService");

const key = `test/storage-test-${Date.now()}.txt`;
const content = Buffer.from("FleetTrackPRO MinIO test");

async function main() {
  try {
    console.log("1. Uploading...");
    await uploadFile({
      key,
      body: content,
      contentType: "text/plain",
    });
    console.log("Upload OK");

    console.log("2. Listing...");
    const files = await listFiles({ prefix: key });
    console.log("List OK:", files);

    console.log("3. Downloading...");
    const downloaded = await downloadFile(key);
    console.log("Download OK:", downloaded.buffer.toString());

    if (!downloaded.buffer.equals(content)) {
      throw new Error("Downloaded content does not match uploaded content");
    }

    console.log("4. Deleting...");
    await deleteFile(key);
    console.log("Delete OK");
  } catch (error) {
    console.error("Storage test failed:", error);
    process.exitCode = 1;
  }
}

main();
