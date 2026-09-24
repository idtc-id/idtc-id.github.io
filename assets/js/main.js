(function () {
  "use strict";

  /* ---------------------------------------------------------
     Mobile nav toggle
  --------------------------------------------------------- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("main-nav");

  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------------------------------------------------------
     Scroll reveal
  --------------------------------------------------------- */
  const revealItems = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealItems.forEach((el) => revealObserver.observe(el));

  /* ---------------------------------------------------------
     Lightbox
  --------------------------------------------------------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lightboxImg.src = "";
  }
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  document.getElementById("openPosterStruktur").addEventListener("click", () => {
    openLightbox(
      "assets/img/struktur-kepengurusan.jpeg",
      "Poster struktur kepengurusan IDTC 2026-2029"
    );
  });
  document.getElementById("openPosterWA").addEventListener("click", () => {
    openLightbox(
      "assets/img/struktur-grup-whatsapp.jpeg",
      "Poster struktur grup WhatsApp IDTC"
    );
  });

  /* ---------------------------------------------------------
     Helpers
  --------------------------------------------------------- */
  function initials(name) {
    if (!name) return "?";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }

  function el(tag, className, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  /* ---------------------------------------------------------
     Struktur Organisasi (tabs + render from JSON)
  --------------------------------------------------------- */
  let strukturData = null;
  const strukturPanel = document.getElementById("strukturPanel");
  const tabButtons = document.querySelectorAll(".tab-btn");

  function renderPembina(data) {
    const wrap = el("div");
    const row = el("div", "org-row");

    const lead = el("div", "org-card is-lead");
    lead.innerHTML = `
      <div class="org-avatar">${initials(data.dewanPembina.ketua.nama)}</div>
      <h4>${data.dewanPembina.ketua.nama}</h4>
      <p>${data.dewanPembina.ketua.peran}</p>`;
    row.appendChild(lead);
    wrap.appendChild(row);

    const unitRow = el("div", "org-row");
    data.dewanPembina.unit.forEach((u) => {
      const card = el("div", "org-card");
      card.innerHTML = `
        <div class="org-avatar">${initials(u.nama)}</div>
        <h4>${u.nama}</h4>
        <p>${u.desc}</p>`;
      unitRow.appendChild(card);
    });
    wrap.appendChild(unitRow);
    return wrap;
  }

  function renderPengurus(data) {
    const p = data.pengurus;
    const wrap = el("div");

    const row1 = el("div", "org-row");
    const lead = el("div", "org-card is-lead");
    lead.innerHTML = `
      <div class="org-avatar">${initials(p.ketua.nama)}</div>
      <h4>${p.ketua.nama}</h4>
      <p>${p.ketua.peran}</p>`;
    row1.appendChild(lead);
    wrap.appendChild(row1);

    const row2 = el("div", "org-row");
    p.wakil.forEach((w) => {
      const card = el("div", "org-card");
      card.innerHTML = `<div class="org-avatar">${initials(w.nama)}</div><h4>${w.nama}</h4><p>${w.peran}</p>`;
      row2.appendChild(card);
    });
    wrap.appendChild(row2);

    const row3 = el("div", "org-row");
    p.sekjen.forEach((s) => {
      const card = el("div", "org-card");
      card.innerHTML = `<div class="org-avatar">${initials(s.nama)}</div><h4>${s.nama}</h4><p>${s.peran}</p>`;
      row3.appendChild(card);
    });
    const secCard = el("div", "org-card");
    secCard.innerHTML = `<div class="org-avatar">${initials(p.sekretariat.nama)}</div><h4>${p.sekretariat.nama}</h4><p>${p.sekretariat.peran}</p>`;
    row3.appendChild(secCard);
    wrap.appendChild(row3);

    return wrap;
  }

  function renderPokjaStruktur(data) {
    const wrap = el("div", "org-row");
    data.pokja.forEach((pk) => {
      const card = el("div", "org-card");
      const wakilList = pk.wakil
        .filter((w) => w.nama)
        .map((w) => `<p style="margin:2px 0 0">${w.nama} — <em>${w.peran}</em></p>`)
        .join("");
      card.innerHTML = `
        <div class="org-avatar">${initials(pk.ketua.nama)}</div>
        <h4>${pk.ketua.nama}</h4>
        <p>Ketua Pokja ${pk.nomor} · ${pk.nama}</p>
        ${wakilList}`;
      wrap.appendChild(card);
    });
    return wrap;
  }

  function renderStrukturTab(tab) {
    strukturPanel.innerHTML = "";
    if (!strukturData) return;
    if (tab === "pembina") strukturPanel.appendChild(renderPembina(strukturData));
    if (tab === "pengurus") strukturPanel.appendChild(renderPengurus(strukturData));
    if (tab === "pokja-struktur") strukturPanel.appendChild(renderPokjaStruktur(strukturData));
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      renderStrukturTab(btn.dataset.tab);
    });
  });

  /* ---------------------------------------------------------
     Pokja cards + unit pendukung
  --------------------------------------------------------- */
  const pokjaGrid = document.getElementById("pokjaGrid");
  const unitGrid = document.getElementById("unitPendukungGrid");

  function renderPokjaCards(data) {
    data.pokja.forEach((pk, idx) => {
      const card = el("article", "pokja-card");
      card.dataset.warna = pk.warna;

      const tagsHtml = pk.fokus.map((f) => `<li>${f}</li>`).join("");
      const outputHtml = pk.output.map((o) => `<li>${o}</li>`).join("");
      const wakilHtml = pk.wakil
        .filter((w) => w.nama)
        .map((w) => `${w.nama} (${w.peran})`)
        .join(", ");

      card.innerHTML = `
        <div class="pokja-card__head">
          <span class="pokja-card__num">Pokja ${pk.nomor}</span>
          <h3>${pk.nama}</h3>
          <p>${pk.slogan}</p>
        </div>
        <div class="pokja-card__body">
          <div class="pokja-ketua">
            <strong>${pk.ketua.nama}</strong>
            Ketua Pokja ${pk.nomor}${wakilHtml ? " · " + wakilHtml : ""}
          </div>
          <button class="pokja-toggle" aria-expanded="false" aria-controls="pokja-detail-${pk.id}">
            Lihat fokus &amp; output
          </button>
          <div class="pokja-detail" id="pokja-detail-${pk.id}">
            <h5>Fokus Pembahasan</h5>
            <ul class="pokja-tags">${tagsHtml}</ul>
            <h5>Output Utama</h5>
            <ul class="pokja-output">${outputHtml}</ul>
          </div>
        </div>`;

      pokjaGrid.appendChild(card);

      const toggleBtn = card.querySelector(".pokja-toggle");
      const detail = card.querySelector(".pokja-detail");
      toggleBtn.addEventListener("click", () => {
        const isOpen = detail.classList.toggle("is-open");
        toggleBtn.setAttribute("aria-expanded", String(isOpen));
        toggleBtn.innerHTML = isOpen
          ? "Sembunyikan detail"
          : "Lihat fokus &amp; output";
      });
    });
  }

  function renderUnitPendukung(data) {
    data.unitPendukung.forEach((u) => {
      const card = el("article", "unit-card");
      const tagsHtml = u.fokus.map((f) => `<li>${f}</li>`).join("");
      card.innerHTML = `
        <h4>${u.nama}</h4>
        <p class="unit-slogan">${u.slogan}</p>
        <ul class="pokja-tags">${tagsHtml}</ul>
        ${u.tujuan ? `<p style="margin-top:10px;font-size:.85rem"><strong>Tujuan:</strong> ${u.tujuan}</p>` : ""}`;
      unitGrid.appendChild(card);
    });
  }

  /* ---------------------------------------------------------
     Gallery
  --------------------------------------------------------- */
  let produkData = [];
  const galleryGrid = document.getElementById("galleryGrid");
  const galleryFilters = document.getElementById("galleryFilters");

  const pokjaLabel = {
    pokja1: "Pokja 1 · Standar & Kebijakan",
    pokja2: "Pokja 2 · Pilot Project",
    pokja3: "Pokja 3 · SDM & Ekosistem",
    umum: "Lintas Pokja",
  };

  const iconGlyph = {
    book: "📘",
    template: "🧩",
    dataset: "📊",
    guide: "🧭",
    default: "✨",
  };

  function renderGallery(filter) {
    galleryGrid.innerHTML = "";
    const items =
      filter === "all" ? produkData : produkData.filter((p) => p.pokja === filter);

    if (items.length === 0) {
      const empty = el(
        "div",
        "gallery-empty",
        `<p style="margin:0">Belum ada produk untuk kategori ini.</p>
         <p style="margin:6px 0 0;font-size:.85rem">Jadilah yang pertama menambahkan lewat pull request ke <code>data/produk.json</code>.</p>`
      );
      galleryGrid.appendChild(empty);
      return;
    }

    items.forEach((item) => {
      const card = el("article", "gallery-card");
      const glyph = iconGlyph[item.icon] || iconGlyph.default;
      const tagsHtml = (item.tag || []).map((t) => `<li>${t}</li>`).join("");

      card.innerHTML = `
        <div class="gallery-thumb" data-pokja="${item.pokja}">
          ${item.gambar ? "" : glyph}
        </div>
        <div class="gallery-body">
          <span class="gallery-kicker">${item.kategori || "Produk"} · ${pokjaLabel[item.pokja] || item.pokja}</span>
          <h3>${item.judul}</h3>
          <p>${item.deskripsi}</p>
          <ul class="gallery-tags">${tagsHtml}</ul>
          <a class="gallery-link" href="${item.tautan}" target="_blank" rel="noopener">Lihat produk ↗</a>
        </div>`;

      if (item.gambar) {
        const thumb = card.querySelector(".gallery-thumb");
        thumb.style.backgroundImage = `url('${item.gambar}')`;
        thumb.style.backgroundSize = "cover";
        thumb.style.backgroundPosition = "center";
      }

      galleryGrid.appendChild(card);
    });
  }

  galleryFilters.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    galleryFilters.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    renderGallery(btn.dataset.filter);
  });

  /* ---------------------------------------------------------
     Load data
  --------------------------------------------------------- */
  Promise.all([
    fetch("data/struktur.json").then((r) => r.json()),
    fetch("data/produk.json").then((r) => r.json()),
  ])
    .then(([struktur, produk]) => {
      strukturData = struktur;
      produkData = produk;

      renderStrukturTab("pembina");
      renderPokjaCards(struktur);
      renderUnitPendukung(struktur);
      renderGallery("all");

      document
        .querySelectorAll(".reveal")
        .forEach((elm) => revealObserver.observe(elm));
    })
    .catch((err) => {
      console.error("Gagal memuat data IDTC:", err);
      const msg =
        '<p style="color:#c0392b">Gagal memuat data. Coba jalankan situs ini lewat server lokal (bukan langsung buka file), atau muat ulang halaman.</p>';
      strukturPanel.innerHTML = msg;
      pokjaGrid.innerHTML = msg;
      galleryGrid.innerHTML = msg;
    });
})();
