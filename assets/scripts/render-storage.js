// render-storage.js
console.log("render-storage.js loaded");

function parseSizeToBytes(sizeStr) {
  if (!sizeStr) return 0;
  const parts = sizeStr.trim().split(" ");
  const value = parseFloat(parts[0]);
  const unit = parts[1] ? parts[1].toUpperCase() : "B";
  switch (unit) {
    case "GB":
      return value * 1024 * 1024 * 1024;
    case "MB":
      return value * 1024 * 1024;
    case "KB":
      return value * 1024;
    default:
      return value;
  }
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024 * 1024)
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + " KB";
  return bytes + " B";
}

function renderFilesList() {
  const container = document.querySelector(".storage-files");
  if (!container || !window.storageFilesData) return;

  const header = document.createElement("div");
  header.className = "files-header";
  header.innerHTML = `
    <div class="col-left">
      <div class="col-title">File Name</div>
    </div>
    <div class="col-right">Storage Used</div>
  `;

  const list = document.createElement("div");
  list.className = "file-list";

  let totalBytes = 0;
  window.storageFilesData.forEach((item) => {
    const bytes = parseSizeToBytes(item.size);
    totalBytes += bytes;

    const row = document.createElement("div");
    row.className = "file-row";
    row.innerHTML = `
      <div class="file-left">
        <div class="file-icon"><img src="${item.icon}" alt="icon" width="38" height="38"/></div>
        <div class="file-meta">
          <div class="file-name">${item.name}</div>
          <div class="file-sub">${item.size} • ${item.date}</div>
        </div>
      </div>
      <div class="file-size-col">${item.size}</div>
    `;

    list.appendChild(row);
  });

  // clear container and append
  container.innerHTML = "";
  container.appendChild(header);
  container.appendChild(list);

  // Update header/CTA storage values and progress bars
  const config = window.storageConfig || {
    totalBytes: 100 * 1024 * 1024 * 1024,
  };
  const used = totalBytes;
  // keep one decimal place to avoid rounding tiny percents to 0
  const percentRaw = (used / config.totalBytes) * 100;
  const percent = Math.min(100, Math.round(percentRaw * 10) / 10);

  const headerStorageEls = document.querySelectorAll(
    ".header-storage, .header-storage-local, .cta-sub"
  );
  headerStorageEls.forEach(
    (el) =>
      (el.textContent = `${formatBytes(used)} / ${formatBytes(
        config.totalBytes
      )}`)
  );

  const progressEls = document.querySelectorAll(
    ".storage-progress, .storage-progress-local, .storage-cta-progress"
  );
  progressEls.forEach((el) => (el.style.width = percent + "%"));

  // Also show percent text on CTA if desired (optional)
  const ctaPercent = document.querySelector(".cta-title");
  if (ctaPercent) {
    ctaPercent.setAttribute("data-percent", percent + "%");
  }
}

// Support both direct page load and SPA page-insertions
function initStoragePage() {
  console.log("initStoragePage called");
  renderFilesList();
}

// Expose initializer for SPA loader
window.initStoragePage = initStoragePage;

// If page loaded directly, also run once
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  initStoragePage();
} else {
  document.addEventListener("DOMContentLoaded", initStoragePage);
}
