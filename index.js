const NOTE_KEY = "kamikireNote";
const SETTINGS_KEY = "kamikireSettings";
const ENGINES_KEY = "kamikireEngines";
const TODO_KEY = "kamikireTodoItems";
const TODO_FILTERS_KEY = "kamikireTodoFilters";
const DRAWING_KEY = "kamikireDrawing";
const NO_TAGS_FILTER_VALUE = "__no_tags__";

const DEFAULT_SHORTCUTS = {
    priorityLow: "Ctrl+Shift+1",
    priorityNormal: "Ctrl+Shift+2",
    priorityHigh: "Ctrl+Shift+3",
    focusSearch: "Ctrl+Shift+F",
    styleBold: "Ctrl+B",
    styleItalic: "Ctrl+I",
    styleUnderline: "Ctrl+U",
    styleHeading: "",
    styleBulletList: "",
    styleNumberedList: "",
    styleChecklist: "",
    stylePasteFormatting: "",
    styleClear: "",
    drawingPen: "",
    drawingEraser: ""
};

const DEFAULT_SETTINGS = {
    showSearch: true,
    showTodo: true,
    showDrawingToolbar: true,
    showStats: true,
    showStylebar: true,
    noteWidth: 43,
    backgroundColor: "#0f1014",
    linkColor: "#077d09",
    keepPasteFormatting: false,
    drawingEnabled: false,
    drawingTool: "none",
    drawingColor: "#a00d0d",
    drawingSize: 4,
    shortcuts: { ...DEFAULT_SHORTCUTS },
    favoriteEngineId: engineId("Google", "https://www.google.com/search?q={q}")
};

const DEFAULT_ENGINES = [
    engine("Google", "G", "https://www.google.com/search?q={q}", "google.com"),
    engine("Google Images", "GI", "https://www.google.com/search?tbm=isch&q={q}", "", googleImagesLogo()),
    engine("DuckDuckGo", "D", "https://duckduckgo.com/?q={q}", "duckduckgo.com"),
    engine("Bing", "B", "https://www.bing.com/search?q={q}", "bing.com"),
    engine("Brave", "BR", "https://search.brave.com/search?q={q}", "brave.com"),
    engine("Startpage", "S", "https://www.startpage.com/sp/search?query={q}", "startpage.com"),
    engine("Ecosia", "E", "https://www.ecosia.org/search?q={q}", "ecosia.org"),
    
    engine("ChatGPT", "AI", "https://chatgpt.com/?q={q}", "chatgpt.com"),
    engine("Gemini", "GM", "https://gemini.google.com/app?q={q}", "gemini.google.com"),
    engine("Perplexity", "PX", "https://www.perplexity.ai/search?q={q}", "perplexity.ai"),

    engine("YouTube", "YT", "https://www.youtube.com/results?search_query={q}", "youtube.com"),
    engine("Twitch", "T", "https://www.twitch.tv/search?term={q}", "twitch.tv"),
    engine("Reddit", "R", "https://www.reddit.com/search/?q={q}", "reddit.com"),
    engine("X", "X", "https://x.com/search?q={q}", "x.com"),
    engine("GitHub", "GH", "https://github.com/search?q={q}", "github.com"),
    engine("Stack Overflow", "SO", "https://stackoverflow.com/search?q={q}", "stackoverflow.com")
];

const note = document.getElementById("notepad");
const input = document.getElementById("searchInput");
const stats = document.getElementById("stats");
const statsValue = document.getElementById("statsValue");
const enginesEl = document.getElementById("engines");
const defaultSearch = document.getElementById("defaultSearch");
const settingsPanel = document.getElementById("settingsPanel");
const settingsToggle = document.getElementById("settingsToggle");
const settingsTabButtons = Array.from(document.querySelectorAll("[data-settings-tab]"));
const settingsTabPanels = Array.from(document.querySelectorAll("[data-settings-panel]"));
const showSearch = document.getElementById("showSearch");
const showTodo = document.getElementById("showTodo");
const showDrawingToolbar = document.getElementById("showDrawingToolbar");
const showStats = document.getElementById("showStats");
const showStylebar = document.getElementById("showStylebar");
const noteWidth = document.getElementById("noteWidth");
const noteWidthValue = document.getElementById("noteWidthValue");
const backgroundColor = document.getElementById("backgroundColor");
const linkColor = document.getElementById("linkColor");
const engineEditor = document.getElementById("engineEditor");
const todoPanel = document.getElementById("todoPanel");
const todoList = document.getElementById("todoList");
const todoTitle = document.getElementById("todoTitle");
const todoNote = document.getElementById("todoNote");
const todoPriority = document.getElementById("todoPriority");
const todoTagInput = document.getElementById("todoTagInput");
const todoSelectedTags = document.getElementById("todoSelectedTags");
const todoTagSuggestions = document.getElementById("todoTagSuggestions");
const todoSearch = document.getElementById("todoSearch");
const todoStatusFilter = document.getElementById("todoStatusFilter");
const todoPriorityFilter = document.getElementById("todoPriorityFilter");
const todoSortModeEl = document.getElementById("todoSortMode");
const todoTagCombobox = document.getElementById("todoTagCombobox");
const todoTagFilter = document.getElementById("todoTagFilter");
const todoFilterTagCombobox = document.getElementById("todoFilterTagCombobox");
const todoFilterTagsEl = document.getElementById("todoFilterTags");
const todoFilterTagSuggestions = document.getElementById("todoFilterTagSuggestions");
const todoStatus = document.getElementById("todoStatus");
const engineDialog = document.getElementById("engineDialog");
const todoDialog = document.getElementById("todoDialog");
const statsDialog = document.getElementById("statsDialog");
const statsText = document.getElementById("statsText");
const statsDialogResult = document.getElementById("statsDialogResult");
const editTodoTitle = document.getElementById("editTodoTitle");
const editTodoNote = document.getElementById("editTodoNote");
const editTodoPriority = document.getElementById("editTodoPriority");
const editTodoTags = document.getElementById("editTodoTags");
const editTodoTagInput = document.getElementById("editTodoTagInput");
const editTodoTagCombobox = document.getElementById("editTodoTagCombobox");
const editTodoTagSuggestions = document.getElementById("editTodoTagSuggestions");
const importDataFile = document.getElementById("importDataFile");
const drawingCanvas = document.getElementById("drawingCanvas");
const drawingCtx = drawingCanvas.getContext("2d");
const drawingToggle = document.getElementById("drawingToggle");
const drawingEraser = document.getElementById("drawingEraser");
const drawingColor = document.getElementById("drawingColor");
const drawingSize = document.getElementById("drawingSize");
const shortcutButtons = Array.from(document.querySelectorAll("[data-shortcut-action]"));

let settings = { ...DEFAULT_SETTINGS };
let engines = [...DEFAULT_ENGINES];
let todos = [];
let todoDraftTags = [];
let todoQuery = "";
let todoStatusMode = "open";
let todoPriorityMode = "";
let todoSortMode = "newest";
let todoNoTagsOnly = false;
let todoFilterTags = [];
let editTodoDraftTags = [];
let saveTimer = null;
let editingEngineIndex = -1;
let editingTodoId = "";
let draggedEngineIndex = -1;
let draggedTodoId = "";
let reorderState = null;
let engineReorderState = null;
let renderedTodoIds = [];
let drawingData = "";
let drawingPointerId = null;
let drawingLastPoint = null;
let drawingSaveTimer = null;
let drawingResizeTimer = null;
let statsPointerSelecting = false;
let listeningShortcutAction = "";

chrome.storage.local.get([
    NOTE_KEY,
    SETTINGS_KEY,
    ENGINES_KEY,
    TODO_KEY,
    TODO_FILTERS_KEY,
    DRAWING_KEY
], (data) => {
    note.innerHTML = data[NOTE_KEY] ?? "";
    const linkedExistingUrls = linkifyTextNodes(note);
    settings = normalizeSettings(data[SETTINGS_KEY]);
    if (!data[SETTINGS_KEY]) {
        settings = normalizeSettings(DEFAULT_SETTINGS);
    }
    engines = normalizeEngines(data[ENGINES_KEY] || DEFAULT_ENGINES);
    todos = Array.isArray(data[TODO_KEY]) ? normalizeTodos(data[TODO_KEY]) : [];
    drawingData = normalizeDrawingData(data[DRAWING_KEY]);
    applySavedTodoFilters(data[TODO_FILTERS_KEY] || {});
    render();
    initDrawingCanvas();
    updateStats();
    if (linkedExistingUrls) saveNote();
});

settingsToggle.addEventListener("click", () => settingsPanel.classList.toggle("hidden"));
document.getElementById("closeSettings").addEventListener("click", () => settingsPanel.classList.add("hidden"));
settingsTabButtons.forEach((button) => {
    button.addEventListener("click", () => setSettingsTab(button.dataset.settingsTab));
});
document.getElementById("addEngine").addEventListener("click", () => {
    engines.push(engine("", "", "https://example.com/search?q={q}", ""));
    saveEngines();
    render();
    engineEditor.scrollTop = engineEditor.scrollHeight;
});
document.getElementById("resetEngines").addEventListener("click", () => {
    if (!confirm("Reset search engines to defaults?")) return;
    engines = [...DEFAULT_ENGINES];
    saveEngines();
    render();
});
document.getElementById("importData").addEventListener("click", () => importDataFile.click());
document.getElementById("exportSettings").addEventListener("click", exportKamikireSettings);
document.getElementById("exportTasks").addEventListener("click", exportKamikireTasks);
document.getElementById("exportAllData").addEventListener("click", exportKamikireAllData);
document.getElementById("resetAllData").addEventListener("click", resetAllData);
importDataFile.addEventListener("change", () => importKamikireData(importDataFile.files[0]));
showSearch.addEventListener("change", () => {
    settings.showSearch = showSearch.checked;
    saveSettings();
    applySettings();
});
showTodo.addEventListener("change", () => {
    settings.showTodo = showTodo.checked;
    saveSettings();
    applySettings();
});
showDrawingToolbar.addEventListener("change", () => {
    settings.showDrawingToolbar = showDrawingToolbar.checked;
    if (!settings.showDrawingToolbar) {
        settings.drawingEnabled = false;
        settings.drawingTool = "none";
    }
    saveSettings();
    applySettings();
});
showStats.addEventListener("change", () => {
    settings.showStats = showStats.checked;
    saveSettings();
    applySettings();
});
showStylebar.addEventListener("change", () => {
    settings.showStylebar = showStylebar.checked;
    saveSettings();
    applySettings();
});
noteWidth.addEventListener("input", () => {
    settings.noteWidth = Number(noteWidth.value);
    saveSettings();
    applySettings();
});
backgroundColor.addEventListener("input", () => {
    settings.backgroundColor = backgroundColor.value;
    saveSettings();
    applySettings();
});
linkColor.addEventListener("input", () => {
    settings.linkColor = linkColor.value;
    saveSettings();
    applySettings();
});
drawingToggle.addEventListener("click", () => {
    toggleDrawingTool("pen");
});
drawingEraser.addEventListener("click", () => {
    toggleDrawingTool("eraser");
});
drawingColor.addEventListener("input", () => {
    settings.drawingColor = drawingColor.value;
    saveSettings();
    applySettings();
});
drawingSize.addEventListener("input", () => {
    settings.drawingSize = Number(drawingSize.value);
    saveSettings();
    applySettings();
});
document.getElementById("drawingClear").addEventListener("click", clearDrawing);
drawingCanvas.addEventListener("pointerdown", beginDrawing);
drawingCanvas.addEventListener("pointermove", continueDrawing);
drawingCanvas.addEventListener("pointerup", finishDrawing);
drawingCanvas.addEventListener("pointercancel", finishDrawing);
window.addEventListener("resize", () => {
    clearTimeout(drawingResizeTimer);
    drawingResizeTimer = setTimeout(() => resizeDrawingCanvas(true), 120);
});

document.querySelectorAll(".stylebar [data-command]").forEach((button) => {
    button.addEventListener("click", () => {
        executeStyleCommand(button.dataset.command, button.dataset.value || null);
    });
});
document.getElementById("clearFormat").addEventListener("click", clearFormatting);
document.getElementById("checkList").addEventListener("click", insertCheckItem);
document.getElementById("textColor").addEventListener("input", (event) => {
    note.focus();
    document.execCommand("foreColor", false, event.target.value);
    saveNote();
});
document.getElementById("todoAdd").addEventListener("click", addTodo);
todoPriority.querySelectorAll("[data-priority]").forEach((button) => {
    button.addEventListener("click", () => setTodoPriority(button.dataset.priority));
});
todoTitle.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    addTodo();
});
todoTagInput.addEventListener("input", renderTodoTagInput);
todoTagInput.addEventListener("keydown", handleTodoTagKeydown);
todoTagInput.addEventListener("focus", renderTodoTagInput);
todoSearch.addEventListener("input", () => {
    todoQuery = todoSearch.value.trim().toLowerCase();
    renderTodos();
});
todoStatusFilter.addEventListener("change", () => {
    todoStatusMode = todoStatusFilter.value;
    saveTodoFilters();
    renderTodos();
});
todoPriorityFilter.addEventListener("change", () => {
    todoPriorityMode = todoPriorityFilter.value;
    saveTodoFilters();
    renderTodos();
});
todoSortModeEl.addEventListener("change", () => {
    todoSortMode = todoSortModeEl.value;
    saveTodoFilters();
    renderTodos();
});
todoTagFilter.addEventListener("input", renderTodoFilterTagInput);
todoTagFilter.addEventListener("focus", renderTodoFilterTagInput);
todoTagFilter.addEventListener("keydown", handleTodoFilterTagKeydown);
editTodoTagInput.addEventListener("input", renderEditTodoTagInput);
editTodoTagInput.addEventListener("focus", renderEditTodoTagInput);
editTodoTagInput.addEventListener("keydown", handleEditTodoTagKeydown);
editTodoTitle.addEventListener("keydown", handleTodoDialogEnter);
editTodoPriority.addEventListener("keydown", handleTodoDialogEnter);
[todoTagCombobox, todoFilterTagCombobox, editTodoTagCombobox].forEach((combobox) => {
    combobox.addEventListener("click", (event) => {
        if (event.target !== combobox) return;
        combobox.querySelector("input")?.focus();
    });
});
document.addEventListener("click", (event) => {
    if (!settingsPanel.classList.contains("hidden")
        && !settingsPanel.contains(event.target)
        && !settingsToggle.contains(event.target)) {
        settingsPanel.classList.add("hidden");
    }
    if (!todoTagCombobox.contains(event.target)) {
        todoTagSuggestions.classList.add("hidden");
    }
    if (!todoFilterTagCombobox.contains(event.target)) {
        todoFilterTagSuggestions.classList.add("hidden");
    }
    if (!editTodoTagCombobox.contains(event.target)) {
        editTodoTagSuggestions.classList.add("hidden");
    }
});
document.getElementById("dialogSave").addEventListener("click", saveDialogEngine);
document.getElementById("dialogDelete").addEventListener("click", deleteDialogEngine);
document.getElementById("dialogUrl").addEventListener("input", updateDialogLogoFromUrl);
document.getElementById("dialogLogo").addEventListener("input", () => {
    document.getElementById("dialogLogo").dataset.autogenerated = "false";
});
document.getElementById("todoDialogSave").addEventListener("click", saveTodoDialog);
engineDialog.addEventListener("click", (event) => {
    if (event.target === engineDialog) engineDialog.close();
});
todoDialog.addEventListener("click", (event) => {
    if (event.target === todoDialog) todoDialog.close();
});
stats.addEventListener("dblclick", (event) => {
    if (event.target !== stats) return;
    openStatsDialog();
});
stats.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.ctrlKey) return;
    statsPointerSelecting = true;
});
window.addEventListener("pointerup", () => {
    if (!statsPointerSelecting) return;
    setTimeout(() => {
        statsPointerSelecting = false;
        updateStats();
    }, 0);
});
window.addEventListener("pointercancel", () => {
    statsPointerSelecting = false;
});
stats.addEventListener("click", (event) => {
    if (!event.ctrlKey) return;
    event.preventDefault();
    openStatsDialog();
});
statsText.addEventListener("input", updateStatsDialog);
statsDialog.addEventListener("click", (event) => {
    if (event.target === statsDialog) statsDialog.close();
});
todoDialog.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (event.submitter?.value === "cancel") {
        todoDialog.close();
        return;
    }
    saveTodoDialog();
});
todoList.addEventListener("dragover", handleTodoListDragOver);
todoList.addEventListener("dragleave", handleTodoListDragLeave);
todoList.addEventListener("drop", handleTodoListDrop);
document.getElementById("keepPasteFormatting").addEventListener("click", () => {
    togglePasteFormatting();
});

document.getElementById("searchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    runSearch(getFavoriteEngine() || engines[0], false);
});
defaultSearch.addEventListener("auxclick", (event) => {
    if (event.button !== 1) return;
    event.preventDefault();
    runSearch(getFavoriteEngine() || engines[0], true);
});
shortcutButtons.forEach((button) => {
    button.addEventListener("click", () => beginShortcutCapture(button.dataset.shortcutAction));
});
document.addEventListener("keydown", handleGlobalKeydown, true);
document.addEventListener("focusin", () => {
    if (!getSearchEngineButtons().includes(document.activeElement)) clearSearchButtonFocus();
});

note.addEventListener("input", () => {
    updateStats();
    scheduleDrawingCanvasResize();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNote, 250);
});
note.addEventListener("change", (event) => {
    if (!event.target?.matches?.(".check-line input")) return;
    event.target.toggleAttribute("checked", event.target.checked);
    saveNote();
});
note.addEventListener("click", (event) => {
    const link = event.target?.closest?.("a[href]");
    if (!event.ctrlKey || !link || !note.contains(link)) return;
    event.preventDefault();
    chrome.tabs.create({ url: link.href, active: true });
});
note.addEventListener("copy", copyNoteAsPlainText);
note.addEventListener("paste", (event) => {
    if (settings.keepPasteFormatting) return;

    event.preventDefault();
    const text = event.clipboardData?.getData("text/plain") || "";
    document.execCommand("insertHTML", false, linkifyPlainText(text));
});
note.addEventListener("blur", () => {
    if (linkifyTextNodes(note)) saveNote();
});
document.addEventListener("selectionchange", updateStats);

function render() {
    applySettings();
    renderEngineButtons();
    renderEnginesEditor();
    renderTodoFilterTags();
    renderTodos();
    scheduleDrawingCanvasResize();
}

function setSettingsTab(tab) {
    const activeTab = settingsTabPanels.some((panel) => panel.dataset.settingsPanel === tab) ? tab : "general";
    settingsTabButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.settingsTab === activeTab);
    });
    settingsTabPanels.forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.settingsPanel === activeTab);
    });
}

function renderEngineButtons() {
    enginesEl.innerHTML = "";
    const favorite = getFavoriteEngine();
    document.body.classList.toggle("no-default-search", !favorite);
    if (favorite) {
        renderEngineIcon(defaultSearch, favorite);
        defaultSearch.title = `Search with ${getEngineName(favorite)}`;
        defaultSearch.setAttribute("aria-label", defaultSearch.title);
    }

    for (const searchEngine of engines) {
        const button = document.createElement("button");
        button.className = "engine-button";
        button.type = "button";
        button.title = getEngineName(searchEngine);
        button.setAttribute("aria-label", button.title);
        renderEngineIcon(button, searchEngine);
        button.addEventListener("click", () => runSearch(searchEngine, false));
        button.addEventListener("auxclick", (event) => {
            if (event.button !== 1) return;
            event.preventDefault();
            runSearch(searchEngine, true);
        });
        enginesEl.appendChild(button);
    }
}

function renderEnginesEditor() {
    engineEditor.innerHTML = "";
    engines.forEach((searchEngine, index) => {
        const row = document.createElement("div");
        row.className = "engine-row";
        row.dataset.engineId = searchEngine.id;
        const logo = searchEngine.logo ? `<img class="engine-logo" src="${escapeAttr(searchEngine.logo)}" alt="">` : escapeHtml(searchEngine.symbol || "?");
        row.innerHTML = `
            <span class="engine-logo-cell">${logo}</span>
            <strong>${escapeHtml(getEngineName(searchEngine))}</strong>
            <button class="favorite ${settings.favoriteEngineId === searchEngine.id ? "active" : ""}" type="button" title="Show near search box">★</button>
            <span class="engine-buttons">
                <button class="edit" type="button" title="Edit">✎</button>
                <button class="remove" type="button">x</button>
            </span>
        `;
        attachEngineReorder(row, searchEngine.id);
        row.querySelector(".favorite").addEventListener("click", () => {
            settings.favoriteEngineId = settings.favoriteEngineId === searchEngine.id ? "" : searchEngine.id;
            saveSettings();
            render();
        });
        row.querySelector(".edit").addEventListener("click", () => openEngineDialog(index));
        row.querySelector(".remove").addEventListener("click", () => {
            if (settings.favoriteEngineId === engines[index]?.id) {
                settings.favoriteEngineId = "";
                saveSettings();
            }
            engines.splice(index, 1);
            saveEngines();
            render();
        });
        engineEditor.appendChild(row);
    });
}

function attachEngineReorder(row, id) {
    let startX = 0;
    let startY = 0;
    let pointerId = null;
    let suppressClick = false;

    const resetPending = () => {
        startX = 0;
        startY = 0;
        pointerId = null;
    };

    row.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) return;
        startX = event.clientX;
        startY = event.clientY;
        pointerId = event.pointerId;
        suppressClick = false;
        window.addEventListener("pointerup", resetPending, { once: true });
        window.addEventListener("pointercancel", resetPending, { once: true });
    });
    row.addEventListener("pointermove", (event) => {
        if (engineReorderState?.id === id) {
            updateEngineReorder(event, id);
            return;
        }
        if (!startX || pointerId !== event.pointerId) return;
        if (event.buttons !== 1) {
            resetPending();
            return;
        }
        const dx = Math.abs(event.clientX - startX);
        const dy = Math.abs(event.clientY - startY);
        if (dy <= 10 || dy <= dx) return;
        event.preventDefault();
        suppressClick = true;
        resetPending();
        beginEngineReorder(row, id, event, row);
        updateEngineReorder(event, id);
    });
    row.addEventListener("pointerup", () => {
        if (engineReorderState?.id === id) {
            finishEngineReorder(id);
            suppressClick = true;
            return;
        }
        resetPending();
    });
    row.addEventListener("pointercancel", () => {
        if (engineReorderState?.id === id) finishEngineReorder(id);
        resetPending();
    });
    row.addEventListener("click", (event) => {
        if (!suppressClick) return;
        event.preventDefault();
        event.stopPropagation();
        suppressClick = false;
    }, true);
}

function beginEngineReorder(row, id, event, captureTarget = row) {
    if (engineReorderState) return;
    const rowRect = row.getBoundingClientRect();
    const placeholder = document.createElement("div");
    placeholder.className = "engine-placeholder";
    placeholder.style.height = `${rowRect.height}px`;
    row.after(placeholder);
    engineReorderState = {
        id,
        row,
        placeholder,
        pointerId: event.pointerId,
        offsetY: event.clientY - rowRect.top
    };
    row.classList.add("dragging");
    row.style.width = `${rowRect.width}px`;
    row.style.left = `${rowRect.left}px`;
    row.style.top = `${rowRect.top}px`;
    engineEditor.classList.add("reordering");
    captureTarget.setPointerCapture(event.pointerId);
}

function updateEngineReorder(event, id) {
    if (!engineReorderState || engineReorderState.id !== id || engineReorderState.pointerId !== event.pointerId) return;
    event.preventDefault();
    const row = engineReorderState.row;
    const editorRect = engineEditor.getBoundingClientRect();
    const rowHeight = row.offsetHeight;
    const top = Math.min(
        Math.max(event.clientY - engineReorderState.offsetY, editorRect.top),
        editorRect.bottom - rowHeight
    );
    row.style.top = `${top}px`;
    const y = Math.min(Math.max(event.clientY, editorRect.top + 4), editorRect.bottom - 4);
    animateEngineReorder(() => {
        const target = getEngineReorderTarget(y);
        if (target) {
            engineEditor.insertBefore(engineReorderState.placeholder, target);
        } else {
            engineEditor.appendChild(engineReorderState.placeholder);
        }
    });
}

function finishEngineReorder(id) {
    if (!engineReorderState || engineReorderState.id !== id) return;
    const row = engineReorderState.row;
    engineReorderState.placeholder.replaceWith(row);
    row.classList.remove("dragging");
    row.style.removeProperty("width");
    row.style.removeProperty("left");
    row.style.removeProperty("top");
    engineEditor.classList.remove("reordering");
    engineReorderState = null;
    commitEngineDomOrder();
}

function animateEngineReorder(updateDom) {
    const rows = [...engineEditor.querySelectorAll(".engine-row:not(.dragging)")];
    const first = new Map(rows.map((row) => [row, row.getBoundingClientRect()]));
    updateDom();
    for (const row of rows) {
        const before = first.get(row);
        const after = row.getBoundingClientRect();
        const dy = before.top - after.top;
        if (!dy) continue;
        row.animate([
            { transform: `translateY(${dy}px)` },
            { transform: "translateY(0)" }
        ], {
            duration: 150,
            easing: "ease"
        });
    }
}

function getEngineReorderTarget(pointerY) {
    const rows = [...engineEditor.querySelectorAll(".engine-row:not(.dragging)")];
    return rows.find((row) => {
        const rect = row.getBoundingClientRect();
        return pointerY < rect.top + rect.height / 2;
    }) || null;
}

function commitEngineDomOrder() {
    const ids = [...engineEditor.querySelectorAll(".engine-row:not(.dragging)")]
        .map((row) => row.dataset.engineId)
        .filter(Boolean);
    if (ids.length === 0) return;
    const byId = new Map(engines.map((searchEngine) => [searchEngine.id, searchEngine]));
    const ordered = ids.map((id) => byId.get(id)).filter(Boolean);
    const remaining = engines.filter((searchEngine) => !ids.includes(searchEngine.id));
    engines = ordered.concat(remaining);
    saveEngines();
    render();
}

function openEngineDialog(index) {
    editingEngineIndex = index;
    const searchEngine = engines[index] || engine("", "", "https://example.com/search?q={q}", "");
    document.getElementById("dialogName").value = searchEngine.name || "";
    document.getElementById("dialogSymbol").value = searchEngine.symbol || "";
    document.getElementById("dialogUrl").value = searchEngine.url || "";
    const generatedLogo = logoUrlFromSearchUrl(searchEngine.url);
    const logoInput = document.getElementById("dialogLogo");
    logoInput.value = searchEngine.logo || generatedLogo;
    logoInput.dataset.autogenerated = logoInput.value && logoInput.value === generatedLogo ? "true" : "false";
    engineDialog.showModal();
}

function saveDialogEngine() {
    const url = document.getElementById("dialogUrl").value.trim();
    const logo = document.getElementById("dialogLogo").value.trim() || logoUrlFromSearchUrl(url);
    const next = normalizeEngine({
        id: engines[editingEngineIndex]?.id,
        name: document.getElementById("dialogName").value,
        symbol: document.getElementById("dialogSymbol").value,
        logo,
        url
    });
    if (!next.url.includes("{q}")) return;
    engines[editingEngineIndex] = next;
    saveEngines();
    render();
    engineDialog.close();
}

function updateDialogLogoFromUrl() {
    const logoInput = document.getElementById("dialogLogo");
    if (logoInput.value.trim() && logoInput.dataset.autogenerated !== "true") return;
    const generatedLogo = logoUrlFromSearchUrl(document.getElementById("dialogUrl").value);
    logoInput.value = generatedLogo;
    logoInput.dataset.autogenerated = generatedLogo ? "true" : "false";
}

function deleteDialogEngine() {
    if (editingEngineIndex < 0) return;
    if (settings.favoriteEngineId === engines[editingEngineIndex]?.id) {
        settings.favoriteEngineId = "";
        saveSettings();
    }
    engines.splice(editingEngineIndex, 1);
    saveEngines();
    render();
    engineDialog.close();
}

function openTodoDialog(id) {
    const todo = todos.find((entry) => entry.id === id);
    if (!todo) return;
    editingTodoId = id;
    editTodoTitle.value = todo.title || "";
    editTodoNote.value = todo.note || "";
    editTodoPriority.value = todo.priority || "normal";
    editTodoDraftTags = [...(todo.tags || [])];
    editTodoTagInput.value = "";
    renderEditTodoTags();
    editTodoTagSuggestions.classList.add("hidden");
    todoDialog.showModal();
    editTodoTitle.focus();
}

function saveTodoDialog() {
    const todo = todos.find((entry) => entry.id === editingTodoId);
    if (!todo) return;
    const title = editTodoTitle.value.trim();
    if (!title) return;

    todo.title = title;
    todo.note = editTodoNote.value.trim();
    todo.priority = editTodoPriority.value || "normal";
    todo.tags = collectEditTodoTags();
    todo.updatedAt = Date.now();
    saveTodos();
    renderTodos();
    todoDialog.close();
}

function runSearch(searchEngine, background) {
    const query = input.value.trim();
    if (!query) return;

    const url = searchEngine.url.replace("{q}", encodeURIComponent(query));
    if (background) {
        chrome.tabs.create({ url, active: false });
    } else {
        location.href = url;
    }
}

function handleGlobalKeydown(event) {
    if (listeningShortcutAction) {
        captureShortcut(event);
        return;
    }

    if (handleSearchKeyboard(event)) return;

    if (document.querySelector("dialog[open]")) return;

    const shortcuts = normalizeShortcuts(settings.shortcuts);
    if (matchesShortcut(event, shortcuts.focusSearch)) {
        event.preventDefault();
        input.focus();
        input.select();
        return;
    }

    const shortcutAction = getShortcutActionMatch(event, shortcuts);
    if (shortcutAction) {
        event.preventDefault();
        runShortcutAction(shortcutAction);
        return;
    }

    const priority = getPriorityShortcutMatch(event, shortcuts);
    if (!priority) return;

    event.preventDefault();
    setTodoPriority(priority);
    if (settings.showTodo) todoTitle.focus();
}

function handleSearchKeyboard(event) {
    if (document.activeElement === input && event.key === "ArrowDown") {
        const buttons = getSearchEngineButtons();
        if (!buttons.length) return false;
        event.preventDefault();
        focusSearchButton(0);
        return true;
    }

    const buttons = getSearchEngineButtons();
    const currentIndex = buttons.indexOf(document.activeElement);
    if (currentIndex < 0) return false;

    if (event.key === "ArrowUp") {
        event.preventDefault();
        clearSearchButtonFocus();
        input.focus();
        return true;
    }

    if (event.key === "ArrowDown") {
        event.preventDefault();
        clearSearchButtonFocus();
        focusNotepadStart();
        return true;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const nextIndex = (currentIndex + direction + buttons.length) % buttons.length;
        focusSearchButton(nextIndex);
        return true;
    }

    if (event.key === "Enter") {
        event.preventDefault();
        buttons[currentIndex].click();
        return true;
    }

    return false;
}

function getSearchEngineButtons() {
    return Array.from(enginesEl.querySelectorAll(".engine-button"))
        .filter((button) => button && getComputedStyle(button).display !== "none");
}

function focusSearchButton(index) {
    const buttons = getSearchEngineButtons();
    const button = buttons[index];
    if (!button) return;
    clearSearchButtonFocus();
    button.classList.add("keyboard-focus");
    button.focus();
}

function clearSearchButtonFocus() {
    getSearchEngineButtons().forEach((button) => button.classList.remove("keyboard-focus"));
}

function focusNotepadStart() {
    note.focus();
    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();
    range.selectNodeContents(note);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
}

function getPriorityShortcutMatch(event, shortcuts) {
    if (matchesShortcut(event, shortcuts.priorityLow)) return "low";
    if (matchesShortcut(event, shortcuts.priorityNormal)) return "normal";
    if (matchesShortcut(event, shortcuts.priorityHigh)) return "high";
    return "";
}

function getShortcutActionMatch(event, shortcuts) {
    for (const action of [
        "styleBold",
        "styleItalic",
        "styleUnderline",
        "styleHeading",
        "styleBulletList",
        "styleNumberedList",
        "styleChecklist",
        "stylePasteFormatting",
        "styleClear",
        "drawingPen",
        "drawingEraser"
    ]) {
        if (matchesShortcut(event, shortcuts[action])) return action;
    }
    return "";
}

function runShortcutAction(action) {
    const actions = {
        styleBold: () => executeStyleCommand("bold"),
        styleItalic: () => executeStyleCommand("italic"),
        styleUnderline: () => executeStyleCommand("underline"),
        styleHeading: () => executeStyleCommand("formatBlock", "h2"),
        styleBulletList: () => executeStyleCommand("insertUnorderedList"),
        styleNumberedList: () => executeStyleCommand("insertOrderedList"),
        styleChecklist: insertCheckItem,
        stylePasteFormatting: togglePasteFormatting,
        styleClear: clearFormatting,
        drawingPen: () => toggleDrawingTool("pen"),
        drawingEraser: () => toggleDrawingTool("eraser")
    };
    actions[action]?.();
}

function applySettings() {
    settings.shortcuts = normalizeShortcuts(settings.shortcuts);
    document.body.classList.toggle("search-hidden", !settings.showSearch);
    document.body.classList.toggle("todo-visible", !!settings.showTodo);
    document.body.classList.toggle("drawing-toolbar-hidden", !settings.showDrawingToolbar);
    document.body.classList.toggle("stats-hidden", !settings.showStats);
    document.body.classList.toggle("stylebar-hidden", !settings.showStylebar);
    todoPanel.classList.toggle("hidden", !settings.showTodo);
    const maxWidth = settings.showTodo ? 76 : 96;
    noteWidth.max = String(maxWidth);
    if (settings.noteWidth > maxWidth) settings.noteWidth = maxWidth;
    showSearch.checked = !!settings.showSearch;
    showTodo.checked = !!settings.showTodo;
    showDrawingToolbar.checked = settings.showDrawingToolbar !== false;
    showStats.checked = settings.showStats !== false;
    showStylebar.checked = settings.showStylebar !== false;
    noteWidth.value = settings.noteWidth;
    noteWidthValue.textContent = `${settings.noteWidth}%`;
    backgroundColor.value = settings.backgroundColor;
    linkColor.value = settings.linkColor;
    document.getElementById("keepPasteFormatting").classList.toggle("active", !!settings.keepPasteFormatting);
    const activeDrawingTool = getActiveDrawingTool();
    drawingToggle.classList.toggle("active", activeDrawingTool === "pen");
    drawingToggle.setAttribute("aria-pressed", activeDrawingTool === "pen" ? "true" : "false");
    drawingEraser.classList.toggle("active", activeDrawingTool === "eraser");
    drawingEraser.setAttribute("aria-pressed", activeDrawingTool === "eraser" ? "true" : "false");
    drawingColor.value = settings.drawingColor || DEFAULT_SETTINGS.drawingColor;
    drawingSize.value = Number(settings.drawingSize || DEFAULT_SETTINGS.drawingSize);
    drawingCanvas.setAttribute("aria-hidden", activeDrawingTool === "none" ? "true" : "false");
    document.body.classList.toggle("drawing-enabled", activeDrawingTool !== "none");
    renderShortcutButtons();
    updateToolTitles();
    document.documentElement.style.setProperty("--note-width", `${settings.noteWidth}%`);
    document.documentElement.style.setProperty("--bg", settings.backgroundColor);
    document.documentElement.style.setProperty("--link-color", settings.linkColor);
    document.documentElement.style.setProperty("--accent", settings.linkColor);
    applyThemeColors(settings.backgroundColor, settings.linkColor);
}

function saveSettings() {
    chrome.storage.local.set({ [SETTINGS_KEY]: settings });
}

function normalizeSettings(value) {
    const merged = { ...DEFAULT_SETTINGS, ...(value || {}) };
    merged.shortcuts = normalizeShortcuts(merged.shortcuts);
    return merged;
}

function normalizeShortcuts(value) {
    return { ...DEFAULT_SHORTCUTS, ...(value || {}) };
}

function renderShortcutButtons() {
    for (const button of shortcutButtons) {
        const action = button.dataset.shortcutAction;
        button.textContent = listeningShortcutAction === action ? "Press keys" : formatShortcut(settings.shortcuts[action]);
        button.classList.toggle("listening", listeningShortcutAction === action);
    }
}

function beginShortcutCapture(action) {
    listeningShortcutAction = action;
    renderShortcutButtons();
}

function captureShortcut(event) {
    event.preventDefault();
    event.stopPropagation();

    if (event.key === "Escape") {
        listeningShortcutAction = "";
        renderShortcutButtons();
        return;
    }

    if (event.key === "Backspace" || event.key === "Delete") {
        settings.shortcuts[listeningShortcutAction] = "";
        listeningShortcutAction = "";
        saveSettings();
        renderShortcutButtons();
        updateToolTitles();
        return;
    }

    const shortcut = shortcutFromEvent(event);
    if (!shortcut) return;

    settings.shortcuts[listeningShortcutAction] = shortcut;
    listeningShortcutAction = "";
    saveSettings();
    renderShortcutButtons();
    updateToolTitles();
}

function shortcutFromEvent(event) {
    const key = shortcutKeyFromEvent(event);
    if (!key || ["Control", "Shift", "Alt", "Meta"].includes(key)) return "";

    const parts = [];
    if (event.ctrlKey) parts.push("Ctrl");
    if (event.shiftKey) parts.push("Shift");
    if (event.altKey) parts.push("Alt");
    if (event.metaKey) parts.push("Meta");
    parts.push(key);
    return parts.join("+");
}

function shortcutKeyFromEvent(event) {
    if (/^Digit[0-9]$/.test(event.code)) return event.code.slice(5);
    if (/^Numpad[0-9]$/.test(event.code)) return event.code.slice(6);
    if (/^Key[A-Z]$/.test(event.code)) return event.code.slice(3);
    if (event.key === " ") return "Space";
    if (event.key?.length === 1) return event.key.toUpperCase();
    return event.key || "";
}

function matchesShortcut(event, shortcut) {
    const parsed = parseShortcut(shortcut);
    if (!parsed.key) return false;
    return event.ctrlKey === parsed.ctrl
        && event.shiftKey === parsed.shift
        && event.altKey === parsed.alt
        && event.metaKey === parsed.meta
        && shortcutKeyFromEvent(event).toLowerCase() === parsed.key.toLowerCase();
}

function parseShortcut(shortcut) {
    const parsed = { ctrl: false, shift: false, alt: false, meta: false, key: "" };
    for (const part of String(shortcut || "").split("+").map((item) => item.trim()).filter(Boolean)) {
        const lower = part.toLowerCase();
        if (lower === "ctrl" || lower === "control") parsed.ctrl = true;
        else if (lower === "shift") parsed.shift = true;
        else if (lower === "alt") parsed.alt = true;
        else if (lower === "meta" || lower === "cmd" || lower === "command") parsed.meta = true;
        else parsed.key = part;
    }
    return parsed;
}

function formatShortcut(shortcut) {
    return shortcut || "Not set";
}

function updateToolTitles() {
    const shortcuts = normalizeShortcuts(settings.shortcuts);
    setToolTitle('[data-command="bold"]', "Bold", shortcuts.styleBold);
    setToolTitle('[data-command="italic"]', "Italic", shortcuts.styleItalic);
    setToolTitle('[data-command="underline"]', "Underline", shortcuts.styleUnderline);
    setToolTitle('[data-command="formatBlock"]', "Heading", shortcuts.styleHeading);
    setToolTitle('[data-command="insertUnorderedList"]', "Bulleted list", shortcuts.styleBulletList);
    setToolTitle('[data-command="insertOrderedList"]', "Numbered list", shortcuts.styleNumberedList);
    document.getElementById("checkList").title = titleWithShortcut("Checkbox item", shortcuts.styleChecklist);
    document.getElementById("clearFormat").title = titleWithShortcut("Clear formatting", shortcuts.styleClear);
    document.getElementById("keepPasteFormatting").title = titleWithShortcut("Keep copied formatting on paste", shortcuts.stylePasteFormatting);
    drawingToggle.title = titleWithShortcut("Pencil", shortcuts.drawingPen);
    drawingEraser.title = titleWithShortcut("Eraser", shortcuts.drawingEraser);
}

function setToolTitle(selector, label, shortcut = "") {
    const element = document.querySelector(`.stylebar ${selector}`);
    if (!element) return;
    element.title = titleWithShortcut(label, shortcut);
}

function titleWithShortcut(label, shortcut = "") {
    return shortcut ? `${label} (${formatShortcut(shortcut)})` : label;
}

function exportKamikireSettings() {
    downloadJson("kamikire-settings.json", {
        type: "kamikire:settings",
        version: 1,
        exportedAt: new Date().toISOString(),
        settings,
        engines,
        todoFilters: getTodoFiltersPayload()
    });
}

function exportKamikireTasks() {
    downloadJson("kamikire-tasks.json", {
        type: "kamikire:tasks",
        version: 1,
        exportedAt: new Date().toISOString(),
        todos
    });
}

function exportKamikireAllData() {
    downloadJson("kamikire-all-data.json", {
        type: "kamikire:all",
        version: 1,
        exportedAt: new Date().toISOString(),
        settings,
        engines,
        todoFilters: getTodoFiltersPayload(),
        todos,
        noteHtml: note.innerHTML,
        drawing: drawingData
    });
}

function importKamikireData(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", async () => {
        try {
            const payload = JSON.parse(String(reader.result || "{}"));
            await applyImportedData(payload);
        } catch (error) {
            alert("Could not import this file.");
            console.warn("[Kamikire] Import failed", error);
        } finally {
            importDataFile.value = "";
        }
    });
    reader.readAsText(file);
}

async function applyImportedData(payload) {
    if (Array.isArray(payload)) {
        todos = normalizeTodos(payload);
        await chrome.storage.local.set({ [TODO_KEY]: todos });
        renderTodos();
        return;
    }

    if (!payload || typeof payload !== "object") {
        throw new Error("Invalid import payload");
    }

    if (payload.type === "kamikire:tasks" || Array.isArray(payload.todos) && !payload.settings && !payload.noteHtml && !payload.drawing) {
        todos = normalizeTodos(payload.todos || []);
        await chrome.storage.local.set({ [TODO_KEY]: todos });
        renderTodos();
        return;
    }

    if (payload.type === "kamikire:settings" || payload.settings || payload.engines || payload.todoFilters) {
        if (payload.settings) settings = normalizeSettings(payload.settings);
        if (payload.engines) engines = normalizeEngines(payload.engines);
        if (payload.todoFilters) applySavedTodoFilters(payload.todoFilters);

        const nextStorage = {
            [SETTINGS_KEY]: settings,
            [ENGINES_KEY]: engines,
            [TODO_FILTERS_KEY]: getTodoFiltersPayload()
        };

        if (payload.type !== "kamikire:all") {
            await chrome.storage.local.set(nextStorage);
            render();
            return;
        }
    }

    if (payload.type !== "kamikire:all") {
        throw new Error("Unsupported import payload");
    }

    note.innerHTML = String(payload.noteHtml || "");
    settings = normalizeSettings(payload.settings || {});
    engines = normalizeEngines(payload.engines || DEFAULT_ENGINES);
    todos = normalizeTodos(payload.todos || []);
    drawingData = normalizeDrawingData(payload.drawing);
    applySavedTodoFilters(payload.todoFilters || {});

    await chrome.storage.local.set({
        [NOTE_KEY]: note.innerHTML,
        [SETTINGS_KEY]: settings,
        [ENGINES_KEY]: engines,
        [TODO_KEY]: todos,
        [TODO_FILTERS_KEY]: getTodoFiltersPayload(),
        [DRAWING_KEY]: drawingData
    });

    render();
    initDrawingCanvas();
    updateStats();
}

async function resetAllData() {
    if (!confirm("Reset all Kamikire data? This deletes the note, drawing, tasks, and settings.")) return;

    note.innerHTML = "";
    settings = normalizeSettings(DEFAULT_SETTINGS);
    engines = [...DEFAULT_ENGINES];
    todos = [];
    drawingData = null;
    applySavedTodoFilters({});

    await chrome.storage.local.set({
        [NOTE_KEY]: "",
        [SETTINGS_KEY]: settings,
        [ENGINES_KEY]: engines,
        [TODO_KEY]: todos,
        [TODO_FILTERS_KEY]: getTodoFiltersPayload(),
        [DRAWING_KEY]: null
    });

    render();
    initDrawingCanvas();
    updateStats();
}

function getTodoFiltersPayload() {
    return {
        status: todoStatusMode,
        priority: todoPriorityMode,
        sort: todoSortMode,
        noTagsOnly: todoNoTagsOnly,
        tags: todoFilterTags
    };
}

function downloadJson(filename, payload) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

function getActiveDrawingTool() {
    return settings.showDrawingToolbar !== false && settings.drawingEnabled && ["pen", "eraser"].includes(settings.drawingTool)
        ? settings.drawingTool
        : "none";
}

function toggleDrawingTool(tool) {
    const activeTool = getActiveDrawingTool();
    if (activeTool === tool) {
        settings.drawingEnabled = false;
        settings.drawingTool = "none";
    } else {
        settings.drawingEnabled = true;
        settings.drawingTool = tool;
    }
    saveSettings();
    applySettings();
}

function normalizeDrawingData(value) {
    if (typeof value === "string") return value;
    if (value && typeof value.image === "string") {
        return {
            image: value.image,
            width: Number(value.width) || 0,
            height: Number(value.height) || 0
        };
    }
    return null;
}

function initDrawingCanvas() {
    resizeDrawingCanvas(false);
    if (drawingData) drawStoredDrawing(drawingData);
}

function resizeDrawingCanvas(preserve) {
    let snapshot = null;
    if (preserve && drawingCanvas.width && drawingCanvas.height) {
        const snapshotCanvas = document.createElement("canvas");
        snapshotCanvas.width = drawingCanvas.width;
        snapshotCanvas.height = drawingCanvas.height;
        snapshotCanvas.getContext("2d").drawImage(drawingCanvas, 0, 0);
        snapshot = {
            canvas: snapshotCanvas,
            width: drawingCanvas.clientWidth,
            height: drawingCanvas.clientHeight
        };
    }
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const { width, height } = getDrawingCanvasSize();
    drawingCanvas.width = Math.floor(width * ratio);
    drawingCanvas.height = Math.floor(height * ratio);
    drawingCanvas.style.width = `${width}px`;
    drawingCanvas.style.height = `${height}px`;
    drawingCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
    drawingCtx.lineCap = "round";
    drawingCtx.lineJoin = "round";
    if (snapshot) {
        drawingCtx.drawImage(snapshot.canvas, 0, 0, snapshot.width, snapshot.height);
    }
}

function scheduleDrawingCanvasResize() {
    clearTimeout(drawingResizeTimer);
    drawingResizeTimer = setTimeout(() => resizeDrawingCanvas(true), 0);
}

function getDrawingCanvasSize() {
    const page = document.querySelector(".page");
    const pageBottom = page ? page.getBoundingClientRect().bottom + window.scrollY : 0;
    const noteBottom = note ? note.getBoundingClientRect().bottom + window.scrollY : 0;
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    return {
        width: Math.max(1, Math.ceil(viewportWidth)),
        height: Math.max(1, Math.ceil(window.innerHeight), Math.ceil(pageBottom), Math.ceil(noteBottom))
    };
}

function drawStoredDrawing(data) {
    const imageSource = typeof data === "string" ? data : data?.image;
    if (!imageSource) return;

    const image = new Image();
    image.onload = () => {
        const width = Number(data?.width) || drawingCanvas.clientWidth;
        const height = Number(data?.height) || drawingCanvas.clientHeight;
        drawingCtx.clearRect(0, 0, drawingCanvas.clientWidth, drawingCanvas.clientHeight);
        drawingCtx.drawImage(image, 0, 0, width, height);
    };
    image.src = imageSource;
}

function beginDrawing(event) {
    if (getActiveDrawingTool() === "none" || event.button !== 0) return;
    event.preventDefault();
    resizeDrawingCanvas(true);
    drawingPointerId = event.pointerId;
    drawingLastPoint = getDrawingPoint(event);
    drawingCanvas.setPointerCapture(event.pointerId);
    drawLine(drawingLastPoint, drawingLastPoint);
}

function continueDrawing(event) {
    if (drawingPointerId !== event.pointerId || !drawingLastPoint) return;
    event.preventDefault();
    const point = getDrawingPoint(event);
    drawLine(drawingLastPoint, point);
    drawingLastPoint = point;
}

function finishDrawing(event) {
    if (drawingPointerId !== event.pointerId) return;
    event.preventDefault();
    drawingPointerId = null;
    drawingLastPoint = null;
    if (drawingCanvas.hasPointerCapture(event.pointerId)) {
        drawingCanvas.releasePointerCapture(event.pointerId);
    }
    saveDrawingDebounced();
}

function getDrawingPoint(event) {
    const rect = drawingCanvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function drawLine(from, to) {
    const activeTool = getActiveDrawingTool();
    drawingCtx.save();
    drawingCtx.globalCompositeOperation = activeTool === "eraser" ? "destination-out" : "source-over";
    drawingCtx.strokeStyle = settings.drawingColor || DEFAULT_SETTINGS.drawingColor;
    drawingCtx.lineWidth = Math.max(1, Number(settings.drawingSize || DEFAULT_SETTINGS.drawingSize));
    drawingCtx.beginPath();
    drawingCtx.moveTo(from.x, from.y);
    drawingCtx.lineTo(to.x, to.y);
    drawingCtx.stroke();
    drawingCtx.restore();
    saveDrawingDebounced();
}

function clearDrawing() {
    if (!window.confirm("Clear drawing?")) return;
    drawingCtx.clearRect(0, 0, drawingCanvas.clientWidth, drawingCanvas.clientHeight);
    drawingData = null;
    clearTimeout(drawingSaveTimer);
    chrome.storage.local.set({ [DRAWING_KEY]: null });
}

function saveDrawingDebounced() {
    clearTimeout(drawingSaveTimer);
    drawingSaveTimer = setTimeout(saveDrawing, 450);
}

function saveDrawing() {
    try {
        drawingData = {
            image: drawingCanvas.toDataURL("image/png"),
            width: drawingCanvas.clientWidth,
            height: drawingCanvas.clientHeight
        };
        chrome.storage.local.set({ [DRAWING_KEY]: drawingData });
    } catch (error) {
        console.warn("[Kamikire Drawing] Failed to save drawing", error);
    }
}

function applyThemeColors(background, accent) {
    const bg = parseHexColor(background) || parseHexColor(DEFAULT_SETTINGS.backgroundColor);
    const link = parseHexColor(accent) || parseHexColor(DEFAULT_SETTINGS.linkColor);
    const textBase = relativeLuminance(bg) > 0.42 ? { r: 18, g: 20, b: 26 } : { r: 242, g: 243, b: 245 };
    const mutedBase = relativeLuminance(bg) > 0.42 ? { r: 80, g: 87, b: 100 } : { r: 168, g: 173, b: 184 };
    const liftBase = relativeLuminance(bg) > 0.42 ? { r: 0, g: 0, b: 0 } : { r: 255, g: 255, b: 255 };
    const shadow = relativeLuminance(bg) > 0.42 ? { r: 40, g: 40, b: 40 } : { r: 0, g: 0, b: 0 };
    const panel = mixColors(bg, liftBase, relativeLuminance(bg) > 0.42 ? 0.08 : 0.07);
    const panelSoft = mixColors(bg, liftBase, relativeLuminance(bg) > 0.42 ? 0.13 : 0.12);
    const panelStrong = mixColors(bg, liftBase, relativeLuminance(bg) > 0.42 ? 0.05 : 0.04);
    const field = mixColors(bg, liftBase, relativeLuminance(bg) > 0.42 ? 0.04 : 0.025);
    const line = mixColors(bg, liftBase, relativeLuminance(bg) > 0.42 ? 0.22 : 0.18);

    setThemeVar("--panel", panel);
    setThemeVar("--panel-soft", panelSoft);
    setThemeVar("--panel-strong", panelStrong);
    setThemeVar("--field-bg", field);
    setThemeVar("--line", line);
    setThemeVar("--text", textBase);
    setThemeVar("--muted", mutedBase);
    setThemeVar("--panel-glass", panel, 0.92);
    setThemeVar("--panel-glass-strong", panel, 0.97);
    setThemeVar("--panel-glass-soft", panel, 0.86);
    setThemeVar("--shadow-color", shadow, relativeLuminance(bg) > 0.42 ? 0.2 : 0.45);
    setThemeVar("--scroll-track", mixColors(bg, liftBase, 0.08), 0.7);
    setThemeVar("--clear-color", mixColors({ r: 255, g: 96, b: 110 }, textBase, 0.18));
    setThemeVar("--danger-bg", mixColors({ r: 180, g: 44, b: 52 }, bg, relativeLuminance(bg) > 0.42 ? 0.14 : 0.04), 0.96);
    setThemeVar("--danger-text", mixColors({ r: 255, g: 212, b: 212 }, textBase, relativeLuminance(bg) > 0.42 ? 0.52 : 0.08));
    setThemeVar("--favorite-muted", mixColors(mutedBase, bg, 0.1));
    setThemeVar("--favorite-active", mixColors({ r: 255, g: 209, b: 102 }, textBase, relativeLuminance(bg) > 0.42 ? 0.42 : 0.04));
}

function setThemeVar(name, color, alpha) {
    document.documentElement.style.setProperty(name, formatColor(color, alpha));
}

function parseHexColor(value) {
    const raw = String(value || "").trim().replace(/^#/, "");
    if (!/^[\da-f]{3}([\da-f]{3})?$/i.test(raw)) return null;
    const hex = raw.length === 3 ? raw.split("").map((char) => char + char).join("") : raw;
    return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16)
    };
}

function mixColors(a, b, amount) {
    return {
        r: Math.round(a.r + (b.r - a.r) * amount),
        g: Math.round(a.g + (b.g - a.g) * amount),
        b: Math.round(a.b + (b.b - a.b) * amount)
    };
}

function formatColor(color, alpha) {
    if (typeof alpha === "number") return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

function relativeLuminance(color) {
    const linear = [color.r, color.g, color.b].map((part) => {
        const value = part / 255;
        return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function saveEngines() {
    chrome.storage.local.set({ [ENGINES_KEY]: engines });
}

function saveNote() {
    chrome.storage.local.set({ [NOTE_KEY]: note.innerHTML });
}

function executeStyleCommand(command, value = null) {
    note.focus();
    document.execCommand(command, false, value);
    saveNote();
}

function togglePasteFormatting() {
    settings.keepPasteFormatting = !settings.keepPasteFormatting;
    saveSettings();
    applySettings();
}

function clearFormatting() {
    note.focus();
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed && note.contains(selection.anchorNode)) {
        document.execCommand("removeFormat", false, null);
        document.execCommand("unlink", false, null);
    } else {
        for (const command of ["bold", "italic", "underline"]) {
            if (document.queryCommandState(command)) document.execCommand(command, false, null);
        }
        document.execCommand("foreColor", false, "#f2f3f5");
        document.execCommand("formatBlock", false, "div");
    }
    saveNote();
}

function insertCheckItem() {
    note.focus();
    document.execCommand("insertHTML", false, '<div class="check-line"><input type="checkbox"> <span><br></span></div>');
    saveNote();
}

function addTodo() {
    const title = todoTitle.value.trim();
    if (!title) return;
    const tags = collectTodoDraftTags();
    const now = Date.now();
    todos.push({
        id: createId(),
        title,
        note: todoNote.value.trim(),
        done: false,
        tags,
        priority: getTodoPriority(),
        createdAt: now,
        updatedAt: now,
        order: nextTodoOrder()
    });
    todoTitle.value = "";
    todoNote.value = "";
    todoDraftTags = [];
    renderTodoDraftTags();
    renderTodoTagInput();
    saveTodos();
    renderTodos();
    todoList.scrollTop = 0;
}

function getTodoPriority() {
    return todoPriority.querySelector(".active")?.dataset.priority || "normal";
}

function setTodoPriority(priority) {
    const value = ["low", "normal", "high"].includes(priority) ? priority : "normal";
    todoPriority.querySelectorAll("[data-priority]").forEach((button) => {
        button.classList.toggle("active", button.dataset.priority === value);
    });
}

function collectTodoDraftTags() {
    const pending = normalizeTag(todoTagInput.value);
    const tags = [...todoDraftTags];
    if (pending && !tags.some((tag) => tag.toLowerCase() === pending.toLowerCase())) {
        tags.push(pending);
    }
    todoTagInput.value = "";
    return tags;
}

function nextTodoOrder() {
    if (todos.length === 0) return 0;
    return Math.min(...todos.map(todoOrder)) - 1;
}

function normalizeTodos(value) {
    const now = Date.now();
    let changed = false;
    const normalized = value.map((todo, index) => {
        const rawCreatedAt = Number(todo.createdAt || todo.updatedAt);
        const createdAt = Number.isFinite(rawCreatedAt) ? rawCreatedAt : now - index;
        const order = Number.isFinite(Number(todo.order)) ? Number(todo.order) : index;
        if (todo.createdAt !== createdAt || todo.order !== order) changed = true;
        return {
            ...todo,
            id: todo.id || createId(),
            title: String(todo.title || ""),
            note: String(todo.note || ""),
            done: !!todo.done,
            tags: Array.isArray(todo.tags) ? todo.tags.map(normalizeTag).filter(Boolean) : [],
            priority: ["low", "normal", "high"].includes(todo.priority) ? todo.priority : "normal",
            createdAt,
            updatedAt: Number(todo.updatedAt || createdAt),
            order
        };
    });
    if (changed) {
        chrome.storage.local.set({ [TODO_KEY]: normalized });
    }
    return normalized;
}

function renderTodos() {
    todoList.innerHTML = "";
    const open = todos.filter((todo) => !todo.done).length;
    todoStatus.textContent = `${open} open`;

    const filtered = getVisibleTodos();
    renderedTodoIds = filtered.map((todo) => todo.id);
    todoList.classList.toggle("empty", filtered.length === 0);

    for (const todo of filtered.slice(0, 100)) {
        const item = document.createElement("article");
        item.className = `todo-item ${todo.priority || "normal"} ${todo.done ? "done" : ""}`;
        item.dataset.todoId = todo.id;
        const tags = (todo.tags || []).map((tag) => (
            `<span class="todo-tag" style="background:${tagBackground(tag)};color:${tagTextColor(tag)}">${escapeHtml(tag)}</span>`
        )).join("");
        item.innerHTML = `
            <input class="todo-check" type="checkbox" ${todo.done ? "checked" : ""}>
            <span class="todo-done-label"></span>
            <div class="todo-main">
                <div class="todo-heading">
                    <strong class="todo-text">${escapeHtml(todo.title)}</strong>
                </div>
                ${todo.note ? `<p class="todo-note">${escapeHtml(todo.note)}</p>` : ""}
                ${tags ? `<div class="todo-meta"><span class="todo-tags">${tags}</span></div>` : ""}
            </div>
            <span class="todo-created">${formatTodoDateParts(todo.createdAt).map(escapeHtml).join("<br>")}</span>
            <span class="todo-actions">
                <button class="todo-edit" type="button" title="Edit" aria-label="Edit"></button>
                <button class="todo-remove" type="button" title="Remove" aria-label="Remove"></button>
            </span>
        `;
        item.addEventListener("dblclick", (event) => {
            if (event.target.closest("button,input,.todo-done-label")) return;
            openTodoDialog(todo.id);
        });
        item.addEventListener("click", (event) => {
            if (!event.ctrlKey || event.target.closest("button,input,.todo-done-label")) return;
            event.preventDefault();
            openTodoDialog(todo.id);
        });
        item.querySelector(".todo-check").addEventListener("change", (event) => {
            todo.done = event.target.checked;
            todo.updatedAt = Date.now();
            saveTodos();
            renderTodos();
        });
        item.querySelector(".todo-done-label").addEventListener("click", () => {
            todo.done = !todo.done;
            todo.updatedAt = Date.now();
            saveTodos();
            renderTodos();
        });
        item.querySelector(".todo-edit").addEventListener("click", () => openTodoDialog(todo.id));
        item.querySelector(".todo-remove").addEventListener("click", () => {
            deleteTodoWithAnimation(item, todo.id);
        });
        attachTodoSwipe(item, todo.id);
        todoList.appendChild(item);
    }
}

function getVisibleTodos() {
    return todos
        .filter(matchesTodoFilters)
        .sort(compareTodos);
}

function compareTodos(a, b) {
    if (todoSortMode === "oldest") return todoSortTime(a) - todoSortTime(b);
    if (todoSortMode === "manual") return todoOrder(a) - todoOrder(b);
    if (todoSortMode === "priority") {
        const priorityDiff = priorityRank(b.priority) - priorityRank(a.priority);
        return priorityDiff || todoSortTime(b) - todoSortTime(a);
    }
    return todoSortTime(b) - todoSortTime(a);
}

function todoSortTime(todo) {
    return Number(todo.createdAt || todo.updatedAt || 0);
}

function todoOrder(todo) {
    return Number.isFinite(Number(todo.order)) ? Number(todo.order) : todoSortTime(todo);
}

function priorityRank(priority) {
    return { high: 3, normal: 2, low: 1 }[priority] || 2;
}

function commitTodoDomOrder() {
    const ids = [...todoList.querySelectorAll(".todo-item:not(.dragging)")]
        .map((item) => item.dataset.todoId)
        .filter(Boolean);
    if (ids.length === 0) return;
    const remaining = todos
        .map((todo) => todo.id)
        .filter((idValue) => !ids.includes(idValue));
    const nextIds = ids.concat(remaining);

    nextIds.forEach((idValue, index) => {
        const todo = todos.find((entry) => entry.id === idValue);
        if (todo) todo.order = index;
    });

    todoSortMode = "manual";
    todoSortModeEl.value = todoSortMode;
    saveTodoFilters();
    saveTodos();
    renderTodos();
}

function animateTodoReorder(updateDom) {
    const items = [...todoList.querySelectorAll(".todo-item:not(.dragging)")];
    const first = new Map(items.map((item) => [item, item.getBoundingClientRect()]));
    updateDom();
    for (const item of items) {
        const before = first.get(item);
        const after = item.getBoundingClientRect();
        const dy = before.top - after.top;
        if (!dy) continue;
        item.animate([
            { transform: `translateY(${dy}px)` },
            { transform: "translateY(0)" }
        ], {
            duration: 150,
            easing: "ease"
        });
    }
}

function beginTodoReorder(item, id, event, captureTarget = item) {
    if (reorderState) return;
    const itemRect = item.getBoundingClientRect();
    const placeholder = document.createElement("div");
    placeholder.className = "todo-placeholder";
    placeholder.style.height = `${itemRect.height}px`;
    item.after(placeholder);
    draggedTodoId = id;
    reorderState = {
        id,
        item,
        placeholder,
        pointerId: event.pointerId,
        offsetY: event.clientY - itemRect.top
    };
    item.classList.add("dragging");
    item.style.width = `${itemRect.width}px`;
    item.style.left = `${itemRect.left}px`;
    item.style.top = `${itemRect.top}px`;
    todoList.classList.add("reordering");
    captureTarget.setPointerCapture(event.pointerId);
}

function updateTodoReorder(event, id) {
    if (!reorderState || reorderState.id !== id || reorderState.pointerId !== event.pointerId) return;
    event.preventDefault();
    const item = reorderState.item;
    const listRect = todoList.getBoundingClientRect();
    const itemHeight = item.offsetHeight;
    const top = Math.min(
        Math.max(event.clientY - reorderState.offsetY, listRect.top),
        listRect.bottom - itemHeight
    );
    item.style.top = `${top}px`;
    const y = Math.min(Math.max(event.clientY, listRect.top + 4), listRect.bottom - 4);
    animateTodoReorder(() => {
        const target = getTodoReorderTarget(y);
        if (target) {
            todoList.insertBefore(reorderState.placeholder, target);
        } else {
            todoList.appendChild(reorderState.placeholder);
        }
    });
}

function finishTodoReorder(id) {
    if (!reorderState || reorderState.id !== id) return;
    const item = reorderState.item;
    reorderState.placeholder.replaceWith(item);
    item.classList.remove("dragging");
    item.style.removeProperty("width");
    item.style.removeProperty("left");
    item.style.removeProperty("top");
    todoList.classList.remove("reordering");
    draggedTodoId = "";
    reorderState = null;
    commitTodoDomOrder();
}

function getTodoReorderTarget(pointerY) {
    const items = [...todoList.querySelectorAll(".todo-item:not(.dragging)")];
    return items.find((entry) => {
        const rect = entry.getBoundingClientRect();
        return pointerY < rect.top + rect.height / 2;
    }) || null;
}

function handleTodoListDragOver(event) {
    if (draggedTodoId) return;
    const hasText = [...(event.dataTransfer?.types || [])].includes("text/plain");
    if (!hasText) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    todoList.classList.add("drop-ready");
}

function handleTodoListDragLeave(event) {
    if (todoList.contains(event.relatedTarget)) return;
    todoList.classList.remove("drop-ready");
}

function handleTodoListDrop(event) {
    todoList.classList.remove("drop-ready");
    if (draggedTodoId) return;
    const text = event.dataTransfer?.getData("text/plain") || "";
    if (!text.trim()) return;
    event.preventDefault();
    createTodoFromDroppedText(text);
}

function createTodoFromDroppedText(text) {
    const parsed = parseDroppedTodoText(text);
    if (!parsed.title) return;
    const now = Date.now();
    todos.push({
        id: createId(),
        title: parsed.title,
        note: parsed.note,
        done: false,
        tags: parsed.tags,
        priority: getTodoPriority(),
        createdAt: now,
        updatedAt: now,
        order: nextTodoOrder()
    });
    saveTodos();
    renderTodos();
    todoList.scrollTop = 0;
}

function parseDroppedTodoText(text) {
    const lines = String(text || "")
        .trim()
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
    if (lines.length === 0) return { title: "", note: "", tags: [] };

    const tags = [];
    const cleanLine = (line) => line.replace(/(^|\s)#([^\s#]+)/g, (match, prefix, tag) => {
        const normalized = normalizeTag(tag);
        if (normalized && !tags.some((item) => item.toLowerCase() === normalized.toLowerCase())) {
            tags.push(normalized);
        }
        return prefix;
    }).replace(/\s{2,}/g, " ").trim();

    const title = cleanLine(lines[0]) || lines[0].replace(/^#+/, "").trim();
    const note = lines.slice(1).map(cleanLine).filter(Boolean).join("\n");
    return { title, note, tags };
}

function deleteTodoWithAnimation(item, id) {
    item.classList.add("removing");
    window.setTimeout(() => {
        todos = todos.filter((entry) => entry.id !== id);
        saveTodos();
        renderTodos();
    }, 180);
}

function attachTodoSwipe(item, id) {
    let startX = 0;
    let startY = 0;
    let pointerId = null;
    let swiping = false;
    let suppressClick = false;

    const resetPending = () => {
        startX = 0;
        startY = 0;
        pointerId = null;
        item.classList.remove("swipe-pending");
    };

    item.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) return;
        startX = event.clientX;
        startY = event.clientY;
        pointerId = event.pointerId;
        swiping = false;
        suppressClick = false;
        item.classList.add("swipe-pending");
        window.addEventListener("pointerup", resetPending, { once: true });
        window.addEventListener("pointercancel", resetPending, { once: true });
    });
    item.addEventListener("pointermove", (event) => {
        if (reorderState?.id === id) {
            updateTodoReorder(event, id);
            return;
        }
        if (!startX || draggedTodoId || pointerId !== event.pointerId) return;
        if (event.buttons !== 1) {
            resetPending();
            return;
        }
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        if (absDy > 10 && absDy > absDx) {
            event.preventDefault();
            suppressClick = true;
            resetPending();
            beginTodoReorder(item, id, event, item);
            updateTodoReorder(event, id);
            return;
        }
        if (absDy > 18 || dx > -8) return;
        event.preventDefault();
        swiping = true;
        suppressClick = true;
        todoPanel.classList.add("swipe-active");
        if (!item.hasPointerCapture(event.pointerId)) {
            item.setPointerCapture(event.pointerId);
        }
        const limitedDx = Math.max(dx, -item.clientWidth);
        item.classList.add("swiping");
        item.style.setProperty("--swipe-x", `${limitedDx}px`);
        item.style.setProperty("--swipe-progress", String(Math.min(Math.abs(limitedDx) / item.clientWidth, 1)));
    });
    const finish = (event) => {
        if (reorderState?.id === id) {
            finishTodoReorder(id);
            suppressClick = true;
            return;
        }
        if (!startX) return;
        const endX = Number.isFinite(event.clientX) ? event.clientX : startX;
        const dx = endX - startX;
        startX = 0;
        startY = 0;
        pointerId = null;
        item.classList.remove("swiping");
        item.classList.remove("swipe-pending");
        todoPanel.classList.remove("swipe-active");
        if (swiping && Math.abs(dx) >= item.clientWidth * 0.8) {
            item.style.removeProperty("--swipe-x");
            item.style.removeProperty("--swipe-progress");
            deleteTodoWithAnimation(item, id);
            return;
        }
        item.style.removeProperty("--swipe-x");
        item.style.removeProperty("--swipe-progress");
    };
    item.addEventListener("pointerup", finish);
    item.addEventListener("pointercancel", finish);
    item.addEventListener("click", (event) => {
        if (!suppressClick) return;
        event.preventDefault();
        event.stopPropagation();
        suppressClick = false;
    }, true);
}

function matchesTodoFilters(todo) {
    if (todoStatusMode === "open" && todo.done) return false;
    if (todoStatusMode === "done" && !todo.done) return false;
    if (todoPriorityMode && todo.priority !== todoPriorityMode) return false;
    if (todoNoTagsOnly && (todo.tags || []).length > 0) return false;
    if (!todoNoTagsOnly && todoFilterTags.length > 0) {
        const tags = (todo.tags || []).map((tag) => tag.toLowerCase());
        if (!todoFilterTags.every((tag) => tags.includes(tag.toLowerCase()))) return false;
    }

    const text = [todo.title, todo.note, ...(todo.tags || [])].join(" ").toLowerCase();
    return !todoQuery || text.includes(todoQuery);
}

function handleTodoFilterTagKeydown(event) {
    if (event.key !== "Enter" && event.key !== ",") return;
    event.preventDefault();
    const value = todoTagFilter.value.trim();
    addTodoFilterTag(value.toLowerCase() === "no tags" ? NO_TAGS_FILTER_VALUE : value);
}

function addTodoFilterTag(value) {
    if (value === NO_TAGS_FILTER_VALUE) {
        todoNoTagsOnly = true;
        todoFilterTags = [];
        todoTagFilter.value = "";
        renderTodoFilterTags();
        renderTodoFilterTagInput();
        saveTodoFilters();
        renderTodos();
        return;
    }

    const tag = normalizeTag(value);
    if (!tag || todoFilterTags.some((item) => item.toLowerCase() === tag.toLowerCase())) return;
    todoNoTagsOnly = false;
    todoFilterTags.push(tag);
    todoTagFilter.value = "";
    renderTodoFilterTags();
    renderTodoFilterTagInput();
    saveTodoFilters();
    renderTodos();
}

function renderTodoFilterTags() {
    todoFilterTagsEl.innerHTML = "";
    if (todoNoTagsOnly) {
        todoFilterTagsEl.appendChild(createTagChip("No tags", () => {
            todoNoTagsOnly = false;
            renderTodoFilterTags();
            renderTodoFilterTagInput();
            saveTodoFilters();
            renderTodos();
            todoTagFilter.focus();
        }, { special: true }));
        return;
    }

    for (const tag of todoFilterTags) {
        todoFilterTagsEl.appendChild(createTagChip(tag, () => {
            todoFilterTags = todoFilterTags.filter((item) => item !== tag);
            renderTodoFilterTags();
            renderTodoFilterTagInput();
            saveTodoFilters();
            renderTodos();
            todoTagFilter.focus();
        }));
    }
}

function renderTodoFilterTagInput() {
    if (document.activeElement !== todoTagFilter) {
        todoFilterTagSuggestions.classList.add("hidden");
        return;
    }
    const query = todoTagFilter.value.trim().toLowerCase();
    const tags = [...new Set(todos.flatMap((todo) => todo.tags || []))]
        .filter((tag) => !todoFilterTags.some((item) => item.toLowerCase() === tag.toLowerCase()))
        .filter((tag) => !query || tag.toLowerCase().includes(query))
        .sort((a, b) => a.localeCompare(b))
        .slice(0, 8);

    todoFilterTagSuggestions.innerHTML = "";
    const showNoTags = !todoNoTagsOnly && (!query || "no tags".includes(query));
    todoFilterTagSuggestions.classList.toggle("hidden", !showNoTags && tags.length === 0);

    if (showNoTags) {
        todoFilterTagSuggestions.appendChild(createTagSuggestionButton("No tags", () => {
            todoTagFilter.focus();
            addTodoFilterTag(NO_TAGS_FILTER_VALUE);
        }, { special: true }));
    }

    for (const tag of tags) {
        todoFilterTagSuggestions.appendChild(createTagSuggestionButton(tag, () => {
            todoTagFilter.focus();
            addTodoFilterTag(tag);
        }));
    }
}

function handleTodoTagKeydown(event) {
    if (event.key === "Enter" || event.key === ",") {
        event.preventDefault();
        addTodoDraftTag(todoTagInput.value);
        return;
    }

    if (event.key === "Backspace" && !todoTagInput.value && todoDraftTags.length) {
        todoDraftTags.pop();
        renderTodoDraftTags();
        renderTodoTagInput();
    }
}

function addTodoDraftTag(value) {
    const tag = normalizeTag(value);
    if (!tag || todoDraftTags.some((item) => item.toLowerCase() === tag.toLowerCase())) return;
    todoDraftTags.push(tag);
    todoTagInput.value = "";
    renderTodoDraftTags();
    renderTodoTagInput();
}

function renderTodoDraftTags() {
    todoSelectedTags.innerHTML = "";
    for (const tag of todoDraftTags) {
        todoSelectedTags.appendChild(createTagChip(tag, () => {
            todoDraftTags = todoDraftTags.filter((item) => item !== tag);
            renderTodoDraftTags();
            renderTodoTagInput();
            todoTagInput.focus();
        }));
    }
}

function renderTodoTagInput() {
    if (document.activeElement !== todoTagInput) {
        todoTagSuggestions.classList.add("hidden");
        return;
    }
    const query = todoTagInput.value.trim().toLowerCase();
    const tags = [...new Set(todos.flatMap((todo) => todo.tags || []))]
        .filter((tag) => !todoDraftTags.some((item) => item.toLowerCase() === tag.toLowerCase()))
        .filter((tag) => !query || tag.toLowerCase().includes(query))
        .sort((a, b) => a.localeCompare(b))
        .slice(0, 8);

    todoTagSuggestions.innerHTML = "";
    todoTagSuggestions.classList.toggle("hidden", tags.length === 0);

    for (const tag of tags) {
        todoTagSuggestions.appendChild(createTagSuggestionButton(tag, () => {
            todoTagInput.focus();
            addTodoDraftTag(tag);
        }));
    }
}

function handleEditTodoTagKeydown(event) {
    if (event.key === "Enter" || event.key === ",") {
        event.preventDefault();
        if (event.key === "Enter" && !editTodoTagInput.value.trim()) {
            saveTodoDialog();
            return;
        }
        addEditTodoTag(editTodoTagInput.value);
        return;
    }

    if (event.key === "Backspace" && !editTodoTagInput.value && editTodoDraftTags.length) {
        editTodoDraftTags.pop();
        renderEditTodoTags();
        renderEditTodoTagInput();
    }
}

function addEditTodoTag(value) {
    const tag = normalizeTag(value);
    if (!tag || editTodoDraftTags.some((item) => item.toLowerCase() === tag.toLowerCase())) return;
    editTodoDraftTags.push(tag);
    editTodoTagInput.value = "";
    renderEditTodoTags();
    renderEditTodoTagInput();
}

function collectEditTodoTags() {
    const pending = normalizeTag(editTodoTagInput.value);
    const tags = [...editTodoDraftTags];
    if (pending && !tags.some((tag) => tag.toLowerCase() === pending.toLowerCase())) {
        tags.push(pending);
    }
    editTodoTagInput.value = "";
    return tags;
}

function renderEditTodoTags() {
    editTodoTags.innerHTML = "";
    for (const tag of editTodoDraftTags) {
        editTodoTags.appendChild(createTagChip(tag, () => {
            editTodoDraftTags = editTodoDraftTags.filter((item) => item !== tag);
            renderEditTodoTags();
            renderEditTodoTagInput();
            editTodoTagInput.focus();
        }));
    }
}

function renderEditTodoTagInput() {
    if (document.activeElement !== editTodoTagInput) {
        editTodoTagSuggestions.classList.add("hidden");
        return;
    }
    const query = editTodoTagInput.value.trim().toLowerCase();
    const tags = [...new Set(todos.flatMap((todo) => todo.tags || []))]
        .filter((tag) => !editTodoDraftTags.some((item) => item.toLowerCase() === tag.toLowerCase()))
        .filter((tag) => !query || tag.toLowerCase().includes(query))
        .sort((a, b) => a.localeCompare(b))
        .slice(0, 8);

    editTodoTagSuggestions.innerHTML = "";
    editTodoTagSuggestions.classList.toggle("hidden", tags.length === 0);

    for (const tag of tags) {
        editTodoTagSuggestions.appendChild(createTagSuggestionButton(tag, () => {
            editTodoTagInput.focus();
            addEditTodoTag(tag);
        }));
    }
}

function handleTodoDialogEnter(event) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    saveTodoDialog();
}

function createTagChip(label, onRemove, options = {}) {
    const chip = document.createElement("span");
    chip.className = options.special ? "todo-tag todo-tag-special" : "todo-tag";
    if (options.special) {
        chip.style.background = "color-mix(in srgb, var(--link-color) 16%, transparent)";
        chip.style.color = "var(--link-color)";
    } else {
        chip.style.background = tagBackground(label);
        chip.style.color = tagTextColor(label);
    }

    const text = document.createElement("span");
    text.textContent = label;
    chip.appendChild(text);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.setAttribute("aria-label", `Remove ${label}`);
    remove.addEventListener("click", onRemove);
    chip.appendChild(remove);
    return chip;
}

function createTagSuggestionButton(label, onClick, options = {}) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "todo-tag-suggestion";
    const badge = document.createElement("span");
    badge.className = options.special ? "todo-tag todo-tag-special" : "todo-tag";
    if (options.special) {
        badge.style.background = "color-mix(in srgb, var(--link-color) 16%, transparent)";
        badge.style.color = "var(--link-color)";
    } else {
        badge.style.background = tagBackground(label);
        badge.style.color = tagTextColor(label);
    }
    badge.textContent = label;
    button.appendChild(badge);
    button.addEventListener("pointerdown", (event) => event.preventDefault());
    button.addEventListener("click", onClick);
    return button;
}

function saveTodos() {
    chrome.storage.local.set({ [TODO_KEY]: todos });
}

function applySavedTodoFilters(savedFilters) {
    const filters = savedFilters || {};
    todoStatusMode = ["open", "all", "done"].includes(filters.status) ? filters.status : "open";
    todoPriorityMode = ["", "high", "normal", "low"].includes(filters.priority) ? filters.priority : "";
    todoSortMode = ["newest", "oldest", "priority", "manual"].includes(filters.sort) ? filters.sort : "newest";
    todoNoTagsOnly = !!filters.noTagsOnly;
    todoFilterTags = Array.isArray(filters.tags) ? filters.tags.map(normalizeTag).filter(Boolean) : [];
    todoStatusFilter.value = todoStatusMode;
    todoPriorityFilter.value = todoPriorityMode;
    todoSortModeEl.value = todoSortMode;
}

function saveTodoFilters() {
    chrome.storage.local.set({
        [TODO_FILTERS_KEY]: {
            status: todoStatusMode,
            priority: todoPriorityMode,
            sort: todoSortMode,
            noTagsOnly: todoNoTagsOnly,
            tags: todoFilterTags
        }
    });
}

function updateStats() {
    if (statsPointerSelecting) return;
    if (hasSelectionInside(stats)) return;

    const selected = getSelectedText();
    const text = selected || note.innerText || "";
    statsValue.textContent = formatStatsText(text, {
        prefix: selected ? "selection: " : "",
        includeLines: false
    });
}

function openStatsDialog() {
    const selected = getSelectedText();
    statsText.value = selected || "";
    updateStatsDialog();
    statsDialog.showModal();
    statsText.focus();
    statsText.select();
}

function updateStatsDialog() {
    statsDialogResult.textContent = formatStatsText(statsText.value, { includeLines: true });
}

function formatStatsText(text, options = {}) {
    const value = String(text || "");
    const chars = value.length;
    const words = value.trim() ? value.trim().split(/\s+/).length : 0;
    const noSpaces = value.replace(/\s/g, "").length;
    const parts = [
        `${formatStatNumber(chars)} chars`,
        `${formatStatNumber(words)} words`,
        `${formatStatNumber(noSpaces)} no spaces`
    ];
    if (options.includeLines) {
        parts.push(`${formatStatNumber(value ? value.split(/\r\n|\r|\n/).length : 0)} lines`);
    }
    return `${options.prefix || ""}${parts.join(" | ")}`;
}

function formatStatNumber(value) {
    return new Intl.NumberFormat().format(value);
}

function getSelectedText() {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !note.contains(selection.anchorNode)) return "";
    return selection.toString();
}

function hasSelectionInside(element) {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return false;
    return element.contains(selection.anchorNode) || element.contains(selection.focusNode);
}

function formatTodoDate(value) {
    if (!value) return "";
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return "";
    const pad = (part) => String(part).padStart(2, "0");
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}, ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatTodoDateParts(value) {
    const formatted = formatTodoDate(value);
    return formatted ? formatted.split(", ") : ["", ""];
}

function copyNoteAsPlainText(event) {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !note.contains(selection.anchorNode)) return;

    event.preventDefault();
    event.clipboardData?.setData("text/plain", selection.toString());
}

function linkifyPlainText(text) {
    const source = String(text || "");
    const urlPattern = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/gi;
    let result = "";
    let lastIndex = 0;
    for (const match of source.matchAll(urlPattern)) {
        const url = match[0];
        result += escapeHtml(source.slice(lastIndex, match.index)).replace(/\n/g, "<br>");
        const href = url.startsWith("www.") ? `https://${url}` : url;
        result += `<a href="${escapeAttr(href)}">${escapeHtml(url)}</a>`;
        lastIndex = match.index + url.length;
    }
    result += escapeHtml(source.slice(lastIndex)).replace(/\n/g, "<br>");
    return result;
}

function linkifyTextNodes(root) {
    const urlPattern = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/i;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
            if (!urlPattern.test(node.nodeValue || "")) return NodeFilter.FILTER_REJECT;
            if (node.parentElement?.closest("a")) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
        }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
        const template = document.createElement("template");
        template.innerHTML = linkifyPlainText(node.nodeValue);
        node.replaceWith(template.content);
    }
    return nodes.length > 0;
}

function createId() {
    if (crypto.randomUUID) return crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeTag(value) {
    return String(value || "").trim().replace(/^#/, "").replace(/\s+/g, "-");
}

function parseTags(value) {
    const seen = new Set();
    return String(value || "")
        .split(",")
        .map(normalizeTag)
        .filter((tag) => {
            const key = tag.toLowerCase();
            if (!tag || seen.has(key)) return false;
            seen.add(key);
            return true;
        });
}

function tagBackground(tag) {
    const hue = hashTag(tag) % 360;
    return `hsl(${hue} 44% 24%)`;
}

function tagTextColor(tag) {
    const hue = hashTag(tag) % 360;
    return `hsl(${hue} 78% 84%)`;
}

function hashTag(tag) {
    let hash = 0;
    for (const char of String(tag).toLowerCase()) {
        hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
    }
    return Math.abs(hash);
}

function engine(name, symbol, url, domain, logo = "") {
    return normalizeEngine({
        id: engineId(name, url),
        name,
        symbol,
        url,
        logo: logo || (domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : "")
    });
}

function normalizeEngines(value) {
    const normalized = Array.isArray(value)
        ? value.map(normalizeEngine).filter((item) => item.url && item.url.includes("{q}"))
        : [];
    return normalized.length ? normalized : [...DEFAULT_ENGINES];
}

function normalizeEngine(value) {
    const url = String(value?.url || "").trim();
    const logo = String(value?.logo || "").trim() || logoUrlFromSearchUrl(url);
    const name = String(value?.name || "").trim() || nameFromUrl(url);
    const symbol = String(value?.symbol || "").trim() || (logo ? "" : name.charAt(0).toUpperCase());
    return {
        id: String(value?.id || engineId(name, url)),
        name,
        symbol,
        logo,
        url
    };
}

function getFavoriteEngine() {
    if (!settings.favoriteEngineId) return null;
    return engines.find((searchEngine) => searchEngine.id === settings.favoriteEngineId) || null;
}

function moveEngine(fromIndex, toIndex) {
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;
    const [item] = engines.splice(fromIndex, 1);
    engines.splice(toIndex, 0, item);
    saveEngines();
    render();
}

function engineId(name, url) {
    const base = `${name || ""}-${url || ""}`.toLowerCase();
    const slug = base.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
    return slug || createId();
}

function getEngineName(searchEngine) {
    return searchEngine.name || nameFromUrl(searchEngine.url);
}

function nameFromUrl(url) {
    try {
        const host = new URL(url).hostname.replace(/^www\./, "");
        return host.split(".")[0] || "Search";
    } catch {
        return "Search";
    }
}

function logoUrlFromSearchUrl(url) {
    try {
        const parsed = new URL(String(url || "").replaceAll("{q}", "query"));
        const domain = parsed.hostname.replace(/^www\./, "");
        return domain ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64` : "";
    } catch {
        return "";
    }
}

function renderEngineIcon(target, searchEngine) {
    target.textContent = "";
    if (searchEngine.logo) {
        const img = document.createElement("img");
        img.src = searchEngine.logo;
        img.alt = "";
        target.appendChild(img);
        return;
    }
    target.textContent = searchEngine.symbol || getEngineName(searchEngine).charAt(0).toUpperCase();
}

function googleImagesLogo() {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23fff'/%3E%3Cpath fill='%234285f4' d='M10 18h44v30H10z'/%3E%3Cpath fill='%2334a853' d='m12 46 13-15 9 10 6-7 12 12z'/%3E%3Ccircle cx='44' cy='26' r='5' fill='%23fbbc05'/%3E%3Cpath fill='%23ea4335' d='M10 18h44v7H10z'/%3E%3C/svg%3E";
}

function escapeAttr(value) {
    return String(value || "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[char]));
}


document.querySelectorAll("[data-rate-link]").forEach((link) => {
    if (navigator.userAgent.includes("Firefox")) {
        link.href = link.dataset.firefoxUrl;
    }
});

function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[char]));
}
