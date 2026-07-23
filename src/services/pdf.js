import jsPDF from "jspdf";
import "jspdf-autotable";

export class PDFExportService {
  static generateProfilePDF(profile, user) {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(99, 102, 241);
    doc.text("SRS - Academic Profile", pageWidth / 2, y, { align: "center" });
    y += 8;

    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated for: ${user?.displayName || user?.email || "User"}`, pageWidth / 2, y, { align: "center" });
    y += 6;
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, y, { align: "center" });
    y += 10;

    doc.line(10, y, pageWidth - 10, y);
    y += 8;

    // 1. Personal Information
    if (profile?.personal && Object.keys(profile.personal).length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(99, 102, 241);
      doc.text("Personal Information", 14, y);
      y += 6;
      
      const data = profile.personal;
      const fields = [
        ["First Name", data.firstName || ""],
        ["Last Name", data.lastName || ""],
        ["Email", data.email || ""],
        ["Phone", data.phone || ""],
        ["Nationality", data.nationality || ""],
        ["Date of Birth", data.dob || ""],
        ["Gender", data.gender || ""]
      ];

      doc.autoTable({
        startY: y,
        head: [["Field", "Value"]],
        body: fields,
        theme: "striped",
        headStyles: { fillColor: [99, 102, 241] },
        styles: { fontSize: 9 },
        margin: { left: 14, right: 14 }
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    // 2. Contact Information
    if (profile?.contact && Object.keys(profile.contact).length > 0) {
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFontSize(14);
      doc.setTextColor(99, 102, 241);
      doc.text("Contact Information", 14, y);
      y += 6;

      const data = profile.contact;
      const fields = [
        ["Personal Email", data.personalEmail || ""],
        ["Institutional Email", data.institutionalEmail || ""],
        ["Primary Phone", data.primaryPhone || ""],
        ["Address", data.address || ""],
        ["City", data.city || ""],
        ["Country", data.country || ""]
      ];

      doc.autoTable({
        startY: y,
        head: [["Field", "Value"]],
        body: fields,
        theme: "striped",
        headStyles: { fillColor: [99, 102, 241] },
        styles: { fontSize: 9 },
        margin: { left: 14, right: 14 }
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    // 3. Academic Qualifications
    if (profile?.academic && profile.academic.length > 0) {
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFontSize(14);
      doc.setTextColor(99, 102, 241);
      doc.text("Academic Qualifications", 14, y);
      y += 6;

      const headers = ["Degree", "Major", "University", "Year"];
      const body = profile.academic.map(item => [
        item.degree || "",
        item.major || "",
        item.university || "",
        item.year || ""
      ]);

      doc.autoTable({
        startY: y,
        head: [headers],
        body: body,
        theme: "striped",
        headStyles: { fillColor: [99, 102, 241] },
        styles: { fontSize: 8 },
        margin: { left: 14, right: 14 }
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    // 4. Work Experience
    if (profile?.experience && profile.experience.length > 0) {
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFontSize(14);
      doc.setTextColor(99, 102, 241);
      doc.text("Work Experience", 14, y);
      y += 6;

      const headers = ["Job Title", "Company", "From", "To"];
      const body = profile.experience.map(item => [
        item.title || "",
        item.company || "",
        item.start || "",
        item.end || ""
      ]);

      doc.autoTable({
        startY: y,
        head: [headers],
        body: body,
        theme: "striped",
        headStyles: { fillColor: [99, 102, 241] },
        styles: { fontSize: 8 },
        margin: { left: 14, right: 14 }
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    // 5. Skills
    if (profile?.skills && Object.keys(profile.skills).length > 0) {
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFontSize(14);
      doc.setTextColor(99, 102, 241);
      doc.text("Skills", 14, y);
      y += 6;

      const data = profile.skills;
      const fields = Object.entries(data)
        .filter(([key, value]) => value)
        .map(([key, value]) => [key.replace(/([A-Z])/g, ' $1').trim(), value]);

      if (fields.length > 0) {
        doc.autoTable({
          startY: y,
          head: [["Skill Category", "Details"]],
          body: fields,
          theme: "striped",
          headStyles: { fillColor: [99, 102, 241] },
          styles: { fontSize: 8 },
          margin: { left: 14, right: 14 }
        });
        y = doc.lastAutoTable.finalY + 10;
      }
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, 290, { align: "right" });
      doc.text("Generated by SRS System", 14, 290);
    }

    doc.save("SRS_Profile_Report.pdf");
    return true;
  }

  static generateSimpleReport(data, filename = "report.pdf") {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(18);
    doc.setTextColor(99, 102, 241);
    doc.text("SRS Report", pageWidth / 2, 20, { align: "center" });

    if (Array.isArray(data) && data.length > 0) {
      const headers = Object.keys(data[0]);
      doc.autoTable({
        startY: 30,
        head: [headers],
        body: data.map(item => Object.values(item)),
        theme: "striped",
        headStyles: { fillColor: [99, 102, 241] }
      });
    }

    doc.save(filename);
    return true;
  }
}
