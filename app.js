import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const listEl = document.getElementById("book-list");
const formEl = document.getElementById("add-book-form");
const inputEl = document.getElementById("new-book-title");
const statusMsgEl = document.getElementById("status-message");

const REFRESH_INTERVAL_MS = 20000;

const CATEGORY_ORDER = [
  "Storie di Natale e d'Inverno",
  "Amicizia, Emozioni e Piccole Scoperte",
  "English Corner (English Books)",
];
const OTHER_CATEGORY_LABEL = "Altri libri aggiunti";

async function loadBooks() {
  const { data, error } = await supabase
    .from("books")
    .select("id, title, status, category")
    .order("id", { ascending: true });

  if (error) {
    console.error(error);
    showMessage("Errore nel caricamento dell'elenco. Riprova tra poco.", true);
    return;
  }

  renderBooks(data);
}

function renderBooks(books) {
  listEl.innerHTML = "";

  const groups = new Map();
  for (const book of books) {
    const key = CATEGORY_ORDER.includes(book.category) ? book.category : OTHER_CATEGORY_LABEL;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(book);
  }

  const orderedKeys = [
    ...CATEGORY_ORDER.filter((category) => groups.has(category)),
    ...(groups.has(OTHER_CATEGORY_LABEL) ? [OTHER_CATEGORY_LABEL] : []),
  ];

  for (const category of orderedKeys) {
    const heading = document.createElement("h2");
    heading.className = "category-heading";
    heading.textContent = category;
    listEl.appendChild(heading);

    const ul = document.createElement("ul");
    ul.className = "book-list";

    for (const book of groups.get(category)) {
      ul.appendChild(buildBookItem(book));
    }

    listEl.appendChild(ul);
  }
}

function buildBookItem(book) {
  const li = document.createElement("li");
  li.className = "book-item" + (book.status === "acquistato" ? " book-item--purchased" : "");

  const titleSpan = document.createElement("span");
  titleSpan.className = "book-title";
  titleSpan.textContent = book.title;
  li.appendChild(titleSpan);

  if (book.status === "acquistato") {
    const badge = document.createElement("span");
    badge.className = "badge badge--purchased";
    badge.textContent = "Acquistato";
    li.appendChild(badge);
  } else {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-buy";
    btn.textContent = "Segna come acquistato";
    btn.addEventListener("click", () => confirmPurchase(book));
    li.appendChild(btn);
  }

  return li;
}

async function confirmPurchase(book) {
  const confirmed = window.confirm(
    `Confermi di aver acquistato "${book.title}"?\n\n` +
      "Una volta confermato, il libro resterà segnato come acquistato per sempre e non potrà essere annullato."
  );
  if (!confirmed) return;

  const { data, error } = await supabase
    .from("books")
    .update({ status: "acquistato" })
    .eq("id", book.id)
    .eq("status", "disponibile")
    .select();

  if (error) {
    console.error(error);
    showMessage("Non è stato possibile registrare l'acquisto. Riprova.", true);
    return;
  }

  if (!data || data.length === 0) {
    showMessage(`"${book.title}" risulta già acquistato da qualcun altro. Elenco aggiornato.`, true);
    await loadBooks();
    return;
  }

  await loadBooks();
  showMessage(`"${book.title}" segnato come acquistato. Grazie!`);
}

formEl.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = inputEl.value.trim();
  if (!title) return;

  const { error } = await supabase.from("books").insert({ title, status: "acquistato" });

  if (error) {
    console.error(error);
    showMessage("Non è stato possibile aggiungere il libro. Riprova.", true);
    return;
  }

  inputEl.value = "";
  await loadBooks();
  showMessage(`"${title}" aggiunto come acquistato. Grazie!`);
});

let messageTimeoutId = null;

function showMessage(text, isError = false) {
  statusMsgEl.textContent = text;
  statusMsgEl.className = isError ? "status-message status-message--error" : "status-message";

  if (messageTimeoutId) clearTimeout(messageTimeoutId);
  messageTimeoutId = setTimeout(() => {
    statusMsgEl.textContent = "";
  }, 5000);
}

loadBooks();
setInterval(loadBooks, REFRESH_INTERVAL_MS);
