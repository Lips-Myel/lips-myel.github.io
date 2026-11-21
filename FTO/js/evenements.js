/* ==========================================================================
   Pages Événements
   - evenements.html : liste de tous les événements, par date croissante
   - evenement.html?id=… : détail d’un événement
   - footer de toutes les pages : prochain événement à venir
   Les données viennent de js/data-evenements.js (constante EVENEMENTS).
   ========================================================================== */

/* ---------- Mise en forme ---------- */
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

const formatDate = (date, options) =>
  new Intl.DateTimeFormat("fr-FR", options).format(date);

// 14:00 → « 14h », 18:30 → « 18h30 »
const formatTime = (date) => {
  const minutes = date.getMinutes();
  return `${date.getHours()}h${minutes ? String(minutes).padStart(2, "0") : ""}`;
};

const formatHours = (event) => {
  const start = new Date(event.debut);
  if (!event.fin) return `À partir de ${formatTime(start)}`;
  return `De ${formatTime(start)} à ${formatTime(new Date(event.fin))}`;
};

const formatPlace = ({ nom, adresse, codePostal, ville }) =>
  [nom, adresse, `${codePostal} ${ville}`].filter(Boolean).join(", ");

const mapUrl = (lieu) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatPlace(lieu))}`;

const detailUrl = (event) => `evenement.html?id=${encodeURIComponent(event.id)}`;

const byDate = (a, b) => new Date(a.debut) - new Date(b.debut);

/* ---------- Petits constructeurs DOM ---------- */
function el(tag, { className, text, attrs } = {}, children = []) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  if (attrs) Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  node.append(...children);
  return node;
}

function icon(name) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "icon");
  svg.setAttribute("aria-hidden", "true");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", `#i-${name}`);
  svg.append(use);
  return svg;
}

// Affiche de l’événement, ou visuel coloré avec la date quand il n’y en a pas
function visual(event, { link = false } = {}) {
  if (event.affiche) {
    const img = el("img", {
      attrs: { src: event.affiche.src, width: event.affiche.largeur, height: event.affiche.hauteur, alt: event.affiche.alt, loading: "lazy" }
    });
    const content = link
      ? el("a", { attrs: { href: event.affiche.src, target: "_blank", rel: "noopener" } }, [img])
      : img;
    return el("figure", { className: "poster" }, [content]);
  }
  const date = new Date(event.debut);
  return el("div", { className: `event-visual event-visual--${event.couleur}`, attrs: { "aria-hidden": "true" } }, [
    el("span", { className: "event-visual__day", text: formatDate(date, { day: "numeric" }) }),
    el("span", { className: "event-visual__month", text: formatDate(date, { month: "long" }) }),
    el("span", { className: "event-visual__title", text: event.titre })
  ]);
}

/* ---------- Liste ---------- */
function renderList(list) {
  const template = document.querySelector("#event-card");
  const events = [...EVENEMENTS].sort(byDate);

  events.forEach((event) => {
    const card = template.content.cloneNode(true);
    const date = new Date(event.debut);
    const set = (key, value) => { card.querySelector(`[data-${key}]`).textContent = value; };

    card.querySelector(".event-card").classList.add(`event-card--${event.couleur}`);
    card.querySelector("[data-date]").setAttribute("datetime", event.debut);
    set("weekday", formatDate(date, { weekday: "short" }));
    set("day", formatDate(date, { day: "numeric" }));
    set("month", formatDate(date, { month: "short", year: "numeric" }));
    set("title", event.titre);
    set("hours", formatHours(event));
    set("place", formatPlace(event.lieu));
    set("price", event.tarif);
    set("summary", event.resume);
    set("more-title", `: ${event.titre}`);
    card.querySelector("[data-link]").href = detailUrl(event);
    card.querySelector("[data-more]").href = detailUrl(event);
    card.querySelector("[data-visual]").append(visual(event));

    list.append(card);
  });
}

/* ---------- Détail ---------- */
function renderSection(section, event) {
  const children = [el("h2", { text: section.titre })];

  if (section.liste) {
    children.push(el("ul", { className: "check-list" }, section.liste.map((item) => el("li", { text: item }))));
  }

  if (section.tarifs) {
    const rows = section.tarifs.map(([label, price]) =>
      el("tr", {}, [el("th", { text: label, attrs: { scope: "row" } }), el("td", { text: price })]));
    children.push(el("table", { className: "price-table" }, [
      el("caption", { className: "visually-hidden", text: `Tarifs — ${event.titre}` }),
      el("thead", {}, [el("tr", {}, [
        el("th", { text: "Formule", attrs: { scope: "col" } }),
        el("th", { text: "Prix", attrs: { scope: "col" } })
      ])]),
      el("tbody", {}, rows)
    ]));
  }

  if (section.texte) children.push(el("p", { text: section.texte }));

  return el("section", { className: "event-section glass" }, children);
}

function renderDetail(article) {
  const id = new URLSearchParams(window.location.search).get("id");
  const event = EVENEMENTS.find((item) => item.id === id);

  if (!event) {
    document.querySelector("[data-event-missing]").hidden = false;
    return;
  }

  const date = new Date(event.debut);
  const longDate = capitalize(formatDate(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
  const q = (key) => article.querySelector(`[data-${key}]`);

  document.title = `${event.titre} — ${longDate} — Fais Ton’ Ovalie`;
  document.querySelector("[data-crumb]").textContent = event.titre;

  const tag = q("tag");
  tag.classList.add(`tag--${event.couleur}`);
  tag.append(el("time", { text: longDate, attrs: { datetime: event.debut } }));

  q("title").textContent = event.titre;
  q("summary").textContent = event.resume;

  const infos = [
    ["calendar", el("time", { text: longDate, attrs: { datetime: event.debut.slice(0, 10) } })],
    ["clock", el("span", { text: formatHours(event) })],
    event.ouverture && ["door", el("span", { text: `Ouverture des portes à ${event.ouverture}` })],
    ["pin", el("span", { text: formatPlace(event.lieu) })],
    ["euro", el("span", {}, [el("span", { className: "visually-hidden", text: "Tarif : " }), event.tarif])]
  ].filter(Boolean);
  q("infos").append(...infos.map(([name, content]) => el("li", {}, [icon(name), content])));

  const actions = q("actions");
  if (event.reservation) {
    const btn = el("a", { className: "btn btn--corail", text: "Réserver ma place ", attrs: { href: event.reservation, "data-burst": "" } }, [icon("arrow")]);
    actions.append(btn);
  }
  actions.append(el("a", {
    className: "btn btn--turquoise",
    text: "Voir sur la carte",
    attrs: { href: mapUrl(event.lieu), target: "_blank", rel: "noopener" }
  }, [el("span", { className: "visually-hidden", text: " (nouvel onglet)" })]));

  q("visual").append(visual(event, { link: true }));
  q("sections").append(...event.sections.map((section) => renderSection(section, event)));

  article.hidden = false;
}

/* ---------- Footer : prochain événement ---------- */
// Le HTML contient déjà un événement par défaut ; on le remplace par le prochain à venir.
function renderNextEvent(block) {
  const now = new Date();
  const next = [...EVENEMENTS].sort(byDate).find((event) => new Date(event.fin || event.debut) >= now);
  if (!next) return;

  const date = new Date(next.debut);
  const q = (key) => block.querySelector(`[data-next-${key}]`);

  q("link").textContent = next.titre;
  q("link").href = detailUrl(next);
  q("date").textContent = `${capitalize(formatDate(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" }))} · ${formatTime(date)}`;
  q("date").setAttribute("datetime", next.debut);
  q("place").textContent = formatPlace(next.lieu);

  // Sans réservation en ligne, le bouton mène à la fiche de l’événement
  q("cta").href = next.reservation || detailUrl(next);
  q("cta-label").textContent = next.reservation ? "Réserver ma place" : "Voir le détail";
}

/* ---------- Initialisation ---------- */
const list = document.querySelector("[data-event-list]");
if (list) renderList(list);

const detail = document.querySelector("[data-event-detail]");
if (detail) renderDetail(detail);

const nextEvent = document.querySelector("[data-next-event]");
if (nextEvent) renderNextEvent(nextEvent);
