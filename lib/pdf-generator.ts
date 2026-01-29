import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CONTACT, BRAND } from "@/lib/constants";

export async function generatePackagePDF(pkg: any) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Define colors - Updated with yellow theme
  const primaryYellow: [number, number, number] = [255, 193, 7]; // Yellow color
  const textColor: [number, number, number] = [0, 0, 0]; // Black text
  const lightYellow: [number, number, number] = [255, 248, 225]; // Light yellow

  // Helper function to add headers with yellow background
  const addHeader = (text: string, fontSize: number = 16) => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    // Add yellow background for header
    doc.setFillColor(primaryYellow[0], primaryYellow[1], primaryYellow[2]);
    doc.rect(15, yPosition - 5, pageWidth - 30, fontSize + 5, "F");

    doc.setFontSize(fontSize);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text(text, 20, yPosition + 5);
    yPosition += fontSize + 15;
  };

  // Helper function to add normal text
  const addText = (
    text: string,
    fontSize: number = 10,
    bold: boolean = false,
  ) => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(fontSize);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFont("helvetica", bold ? "bold" : "normal");

    // Handle long text with word wrapping
    const splitText = doc.splitTextToSize(text, pageWidth - 40);
    doc.text(splitText, 20, yPosition);
    yPosition += splitText.length * (fontSize * 0.4) + 5;
  };

  // Helper function to add line
  const addLine = () => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 10;
  };

  // Helper function to add image
  const addPackageImage = async () => {
    if (pkg.heroImage && pkg.heroImage !== "/placeholder-package.jpg") {
      try {
        // Create a canvas to load and resize the image
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        return new Promise((resolve) => {
          img.crossOrigin = "anonymous";
          img.onload = () => {
            const maxWidth = pageWidth - 40;
            const maxHeight = 80;
            let { width, height } = img;

            // Calculate aspect ratio
            const aspectRatio = width / height;
            if (width > maxWidth) {
              width = maxWidth;
              height = width / aspectRatio;
            }
            if (height > maxHeight) {
              height = maxHeight;
              width = height * aspectRatio;
            }

            canvas.width = width;
            canvas.height = height;
            ctx?.drawImage(img, 0, 0, width, height);

            const imageData = canvas.toDataURL("image/jpeg", 0.8);
            doc.addImage(imageData, "JPEG", 20, yPosition, width, height);
            yPosition += height + 15;
            resolve(true);
          };

          img.onerror = () => {
            // If image fails to load, skip it
            resolve(false);
          };

          img.src = pkg.heroImage;
        });
      } catch (error) {
        console.error("Error adding image to PDF:", error);
        return false;
      }
    }
    return false;
  };

  // Header with TripVision branding - Yellow theme
  doc.setFillColor(primaryYellow[0], primaryYellow[1], primaryYellow[2]);
  doc.rect(0, 0, pageWidth, 35, "F");

  doc.setFontSize(24);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text(BRAND.name, 20, 22);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(BRAND.tagline, 20, 32);

  yPosition = 55;

  // Package Title
  doc.setFontSize(22);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFont("helvetica", "bold");
  const titleText = doc.splitTextToSize(pkg.title, pageWidth - 40);
  doc.text(titleText, 20, yPosition);
  yPosition += titleText.length * 10 + 15;

  // Add package image
  await addPackageImage();

  // Package Overview
  addHeader("Package Overview");

  // Basic Info Table with currency codes
  const formatPrice = (price: number) => {
    // Use package prices if available, otherwise default to INR
    const packagePrice = pkg.prices?.[0];
    const currency = packagePrice?.currency || { code: "INR", symbol: "₹" };
    return `${currency.code} ${price.toLocaleString()}`;
  };

  const basicInfoData = [
    ["Duration", pkg.duration],
    ["Category", pkg.category],
    ["Starting Price", formatPrice(pkg.startingPrice)],
  ];

  if (pkg.discountedPrice) {
    basicInfoData.push(["Discounted Price", formatPrice(pkg.discountedPrice)]);
    const savings = pkg.startingPrice - pkg.discountedPrice;
    const discount = Math.round((savings / pkg.startingPrice) * 100);
    basicInfoData.push(["You Save", `${formatPrice(savings)} (${discount}%)`]);
  }

  if (pkg.destinations && pkg.destinations.length > 0) {
    const destinations = pkg.destinations
      .map((d: any) => d.destination.name)
      .join(", ");
    basicInfoData.push(["Destinations", destinations]);
  }

  autoTable(doc, {
    startY: yPosition,
    head: [["Detail", "Information"]],
    body: basicInfoData,
    headStyles: {
      fillColor: primaryYellow,
      textColor: textColor,
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: lightYellow },
    styles: { textColor: textColor },
    margin: { left: 20, right: 20 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 20;

  // Description
  if (pkg.description) {
    addHeader("About This Package");
    addText(pkg.description);
    addLine();
  }

  // Itinerary
  if (pkg.itinerary && pkg.itinerary.length > 0) {
    addHeader("Day-by-Day Itinerary");

    const itineraryData = pkg.itinerary.map((item: any) => [
      `Day ${item.day}`,
      item.title,
      item.description || "As per itinerary",
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [["Day", "Title", "Description"]],
      body: itineraryData,
      headStyles: {
        fillColor: primaryYellow,
        textColor: textColor,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: lightYellow },
      styles: {
        textColor: textColor,
        cellPadding: 3,
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 40 },
        2: { cellWidth: "auto" },
      },
      margin: { left: 20, right: 20 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }

  // Hotels
  if (pkg.hotels && pkg.hotels.length > 0) {
    addHeader("Accommodation Details");

    const hotelData = pkg.hotels.map((hotel: any) => [
      hotel.name,
      hotel.location,
      hotel.starRating ? `${hotel.starRating} Star` : "Standard",
      `${hotel.nights} Night${hotel.nights > 1 ? "s" : ""}`,
      hotel.description || "As per package",
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [["Hotel Name", "Location", "Category", "Duration", "Details"]],
      body: hotelData,
      headStyles: {
        fillColor: primaryYellow,
        textColor: textColor,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: lightYellow },
      styles: {
        textColor: textColor,
        fontSize: 8,
      },
      margin: { left: 20, right: 20 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }

  // Meals
  if (pkg.meals && pkg.meals.length > 0) {
    addHeader("Meals Included");

    const mealData = pkg.meals.map((meal: any) => [
      meal.type,
      meal.description || "As per itinerary",
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [["Meal Type", "Description"]],
      body: mealData,
      headStyles: {
        fillColor: primaryYellow,
        textColor: textColor,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: lightYellow },
      styles: { textColor: textColor },
      margin: { left: 20, right: 20 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }

  // Transfers
  if (pkg.transfers && pkg.transfers.length > 0) {
    addHeader("Transfers & Transportation");

    const transferData = pkg.transfers.map((transfer: any) => [
      transfer.type,
      transfer.description || "As per itinerary",
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [["Transfer Type", "Details"]],
      body: transferData,
      headStyles: {
        fillColor: primaryYellow,
        textColor: textColor,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: lightYellow },
      styles: { textColor: textColor },
      margin: { left: 20, right: 20 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }

  // Sightseeing
  if (pkg.sightseeing && pkg.sightseeing.length > 0) {
    addHeader("Sightseeing & Attractions");

    const sightseeingData = pkg.sightseeing.map((sight: any) => [
      sight.name,
      sight.description || "Guided tour included",
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [["Attraction", "Details"]],
      body: sightseeingData,
      headStyles: {
        fillColor: primaryYellow,
        textColor: textColor,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: lightYellow },
      styles: { textColor: textColor },
      margin: { left: 20, right: 20 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }

  // Activities
  if (pkg.activities && pkg.activities.length > 0) {
    addHeader("Activities & Experiences");

    const activityData = pkg.activities.map((activity: any) => [
      activity.name,
      activity.description || "Experience included",
      activity.isOptional ? "Optional" : "Included",
      activity.price ? formatPrice(activity.price) : "Complimentary",
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [["Activity", "Description", "Type", "Price"]],
      body: activityData,
      headStyles: {
        fillColor: primaryYellow,
        textColor: textColor,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: lightYellow },
      styles: { textColor: textColor },
      margin: { left: 20, right: 20 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }

  // Inclusions
  if (pkg.inclusions && pkg.inclusions.length > 0) {
    addHeader("Package Inclusions");

    const inclusionData = pkg.inclusions.map((inclusion: any) => [
      "✓",
      inclusion.item,
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [["", "What's Included"]],
      body: inclusionData,
      headStyles: {
        fillColor: primaryYellow,
        textColor: textColor,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: lightYellow },
      styles: { textColor: textColor },
      columnStyles: {
        0: { cellWidth: 15, halign: "center" },
        1: { cellWidth: "auto" },
      },
      margin: { left: 20, right: 20 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }

  // Exclusions - Fixed missing exclusions
  if (pkg.exclusions && pkg.exclusions.length > 0) {
    addHeader("Package Exclusions");

    const exclusionData = pkg.exclusions.map((exclusion: any) => [
      "✗",
      exclusion.item,
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [["", "What's Not Included"]],
      body: exclusionData,
      headStyles: {
        fillColor: primaryYellow,
        textColor: textColor,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: lightYellow },
      styles: { textColor: textColor },
      columnStyles: {
        0: { cellWidth: 15, halign: "center" },
        1: { cellWidth: "auto" },
      },
      margin: { left: 20, right: 20 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }

  // Policies - Include all policy types
  if (pkg.policies && pkg.policies.length > 0) {
    addHeader("Terms, Policies & Important Information");

    // Group policies by type
    const policyGroups = pkg.policies.reduce((acc: any, policy: any) => {
      if (!acc[policy.type]) {
        acc[policy.type] = [];
      }
      acc[policy.type].push(policy);
      return acc;
    }, {});

    // Create table data for all policies
    const policyData: any[] = [];

    Object.entries(policyGroups).forEach(([type, policies]: [string, any]) => {
      // Add type header
      policyData.push([type.toUpperCase(), "", ""]);

      // Add policies for this type
      (policies as any[]).forEach((policy, index) => {
        policyData.push([`${index + 1}.`, policy.title, policy.description]);
      });

      // Add separator
      policyData.push(["", "", ""]);
    });

    // Remove last empty row
    if (policyData.length > 0 && policyData[policyData.length - 1][0] === "") {
      policyData.pop();
    }

    autoTable(doc, {
      startY: yPosition,
      head: [["", "Policy", "Details"]],
      body: policyData,
      headStyles: {
        fillColor: primaryYellow,
        textColor: textColor,
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: textColor,
      },
      alternateRowStyles: { fillColor: lightYellow },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 50 },
        2: { cellWidth: "auto" },
      },
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      margin: { left: 20, right: 20 },
      didParseCell: (hookData: any) => {
        // Style type headers differently
        if (
          hookData.cell.text[0] &&
          hookData.cell.text[0].includes(".") === false &&
          hookData.cell.text[0] === hookData.cell.text[0].toUpperCase() &&
          hookData.column.index === 0
        ) {
          hookData.cell.styles.fillColor = [255, 165, 0]; // Orange for type headers
          hookData.cell.styles.fontStyle = "bold";
        }
      },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Footer line - Yellow theme
    doc.setDrawColor(primaryYellow[0], primaryYellow[1], primaryYellow[2]);
    doc.setLineWidth(2);
    doc.line(20, pageHeight - 25, pageWidth - 20, pageHeight - 25);

    // Footer text
    doc.setFontSize(8);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text(`${BRAND.name} - ${BRAND.tagline}`, 20, pageHeight - 15);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 15);

    doc.setFont("helvetica", "normal");
    doc.text(
      `Contact: +91-${CONTACT.primaryPhone} | Email: ${CONTACT.primaryEmail}`,
      20,
      pageHeight - 8,
    );
  }

  // Generate filename
  const sanitizedTitle = pkg.title.replace(/[^a-z0-9]/gi, "-").toLowerCase();
  const filename = `${BRAND.name.toLowerCase()}-${sanitizedTitle}-package.pdf`;

  // Save the PDF
  doc.save(filename);
}
