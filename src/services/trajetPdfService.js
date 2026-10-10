
const PDFDocument = require("pdfkit");
const Trajet = require("../models/Trajet");

const generateTrajetPdf = async (id, user) => {
  const trajet = await Trajet.findById(id)
    .populate("chauffeurId", "firstName lastName email")
    .populate("camionId", "registrationNumber brand model")
    .populate("remorqueId", "registrationNumber type");

  if (!trajet) {
    const error = new Error("Trajet not found");
    error.statusCode = 404;
    throw error;
  }

  // Un chauffeur peut télécharger uniquement ses propres trajets

if (!trajet.chauffeurId) {
  const error = new Error("Assigned chauffeur not found");
  error.statusCode = 409;
  throw error;
}

if (
  user.role === "CHAUFFEUR" &&
  trajet.chauffeurId._id.toString() !== user.userId.toString()
) {
  const error = new Error("You can only access your own trajet");
  error.statusCode = 403;
  throw error;
}


  if (!["ADMIN", "CHAUFFEUR"].includes(user.role)) {
    const error = new Error("Forbidden");
    error.statusCode = 403;
    throw error;
  }

  const doc = new PDFDocument({ size: "A4", margin: 50 });

  doc.fontSize(20).text("ORDRE DE MISSION", {
    align: "center",
  });

  doc.moveDown();
  doc.fontSize(12).text(`Reference : ${trajet._id}`);
  doc.text(`Statut : ${trajet.status}`);
  doc.moveDown();

  doc.fontSize(15).text("Informations du trajet");
  doc.fontSize(11);
  doc.text(`Départ : ${trajet.departureSite}`);
  doc.text(`Destination : ${trajet.arrivalSite}`);
  doc.text(`Marchandise : ${trajet.merchandise}`);
  doc.text(
    `Date de départ prévue : ${new Date(
      trajet.plannedStartDate
    ).toLocaleString("fr-FR")}`
  );
  doc.text(
    `Date d'arrivée prévue : ${new Date(
      trajet.plannedEndDate
    ).toLocaleString("fr-FR")}`
  );

  doc.moveDown();
  doc.fontSize(15).text("Chauffeur");
  doc.fontSize(11);
  doc.text(
    `Nom : ${trajet.chauffeurId.firstName} ${trajet.chauffeurId.lastName}`
  );
  doc.text(`Email : ${trajet.chauffeurId.email}`);

  doc.moveDown();
  doc.fontSize(15).text("Camion");
  doc.fontSize(11);
  doc.text(`Immatriculation : ${trajet.camionId.registrationNumber}`);
  doc.text(`Marque : ${trajet.camionId.brand}`);
  doc.text(`Modèle : ${trajet.camionId.model}`);

  doc.moveDown();
  doc.fontSize(15).text("Remorque");
  doc.fontSize(11);
  doc.text(`Immatriculation : ${trajet.remorqueId.registrationNumber}`);
  doc.text(`Type : ${trajet.remorqueId.type}`);

  doc.moveDown();
  doc.fontSize(15).text("Informations complémentaires");
  doc.fontSize(11);
  doc.text(`Kilométrage départ : ${trajet.departureMileage ?? "Non renseigné"}`);
  doc.text(`Kilométrage arrivée : ${trajet.arrivalMileage ?? "Non renseigné"}`);
  doc.text(`Carburant consommé : ${trajet.fuelConsumed ?? "Non renseigné"} L`);
  doc.text(`Remarques : ${trajet.remarks || "Aucune"}`);

  doc.moveDown(2);
  doc.fontSize(10).text("Document généré automatiquement par l'API.", {
    align: "center",
  });

  return doc;
};

module.exports = { generateTrajetPdf };
