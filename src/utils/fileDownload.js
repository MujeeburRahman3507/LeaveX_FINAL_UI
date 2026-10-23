import { Capacitor } from "@capacitor/core";

export const isNativeApp = () => Capacitor.isNativePlatform();

const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const EXT = {
  "application/pdf": ".pdf",
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "text/csv": ".csv",
};

/**
 * Save / open a file.
 *  - Web: normal browser download.
 *  - Android / iOS app: browser-style blob downloads do not work inside the
 *    app WebView, so the file is written to the device cache and the system
 *    share sheet opens (Open with..., Save to Files, Drive, WhatsApp, ...).
 */
export async function saveBlob(blob, fileName) {
  let name = fileName || "download";
  if (!/\.[A-Za-z0-9]{2,5}$/.test(name) && blob.type && EXT[blob.type]) {
    name += EXT[blob.type];
  }

  if (isNativeApp()) {
    const [{ Filesystem, Directory }, { Share }] = await Promise.all([
      import("@capacitor/filesystem"),
      import("@capacitor/share"),
    ]);

    const data = await blobToBase64(blob);
    const written = await Filesystem.writeFile({
      path: name,
      data,
      directory: Directory.Cache,
    });

    await Share.share({
      title: name,
      url: written.uri,
      dialogTitle: "Open or save file",
    });
    return;
  }

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", name);
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => window.URL.revokeObjectURL(url), 1000);
}
