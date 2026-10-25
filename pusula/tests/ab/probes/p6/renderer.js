const editor = document.getElementById("editor");
const preview = document.getElementById("preview");

async function refresh() {
  preview.innerHTML = marked.parse(editor.value);
  await window.api.saveNotes(editor.value);
}

editor.addEventListener("input", refresh);
document.getElementById("open").addEventListener("click", async () => {
  const text = await window.api.pickFile();
  if (text !== null) {
    editor.value = text;
    refresh();
  }
});

window.api.readNotes().then((text) => {
  editor.value = text;
  preview.innerHTML = marked.parse(text);
});
