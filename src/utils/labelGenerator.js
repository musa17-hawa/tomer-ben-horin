import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const handleDownloadLabels = async (
  exhibitionId,
  cardsData,
  showToast = console.log
) => {
  try {
    // Wait for the DOM to update/render the labels
    const container = document.getElementById("labels-pdf-container");
    if (!container) {
      alert("לא נמצאו תוויות להורדה");
      return;
    }

    // Wait for images to load if you have any
    const images = container.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((res) => {
              img.onload = img.onerror = res;
            })
      )
    );

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#fff",
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    const exhibition = cardsData.find((ex) => ex.id === exhibitionId);
    const exhibitionName = exhibition ? exhibition.title : "labels";
    pdf.save(`${exhibitionName}-labels.pdf`);
    showToast(`✔️ תוויות הורדו בהצלחה`);
  } catch (error) {
    console.error("Label PDF generation error:", error);
    alert("שגיאה בהורדת התוויות. נסה שוב.");
  }
};
