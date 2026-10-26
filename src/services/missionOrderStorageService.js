
const Trajet = require("../models/Trajet");
const trajetPdfService = require("./trajetPdfService");
const storageService = require("./storageService");

const storeMissionOrderPdf = async (trajetId, user) => {
  // Generate PDF after checking the existing access rules.
  const buffer = await trajetPdfService.generateTrajetPdfBuffer(
    trajetId,
    user
  );

  const key = `mission-orders/${trajetId}/ordre-mission-${trajetId}.pdf`;

  // Upload the PDF to MinIO.
  const metadata = await storageService.uploadFile({
    key,
    body: buffer,
    contentType: "application/pdf",
  });

  // Save the storage metadata in MongoDB.
  const trajet = await Trajet.findByIdAndUpdate(
    trajetId,
    {
      bucket: metadata.bucket,
      s3Key: metadata.s3Key,
      sizeBytes: metadata.sizeBytes,
    },
    { new: true, runValidators: true }
  );

  if (!trajet) {
    throw new Error("Trajet not found while saving PDF metadata");
  }

  return {
    bucket: metadata.bucket,
    s3Key: metadata.s3Key,
    sizeBytes: metadata.sizeBytes,
  };
};

module.exports = { storeMissionOrderPdf };
