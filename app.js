const view = document.getElementById("view");

function getChapters() {
    // return JSON.parse(localStorage.getItem("chapters") || "[]");
    return (JSON.parse(localStorage.getItem("chapters")) || [])
    .sort((a, b) => new Date(a.startDate || 0) - new Date(b.startDate || 0));
}

function saveChapters(chapters) {
    localStorage.setItem("chapters", JSON.stringify(chapters));
}



// page switching
function navigate(route, id=null) {
    if (route === "home") {
        renderHome();
    }
    if (route === "list") {
        renderList();
    }
    if (route === "create") {
        renderCreate();
    }
    if (route === "edit") {
        renderEdit(id);
    }
    if (route === "view") {
        renderView(id);
    }
}

document.querySelectorAll("[data-route]").forEach(btn => {
    btn.onclick = () =>  navigate(btn.dataset.route) 
});

document.getElementById("nav-home").onclick = () => navigate("home");

// Home page
function renderHome() {
    view.innerHTML = `
        <h2>Home</h2>
        <p>Your life, organized into meaningful chapters.</p>
    `;
}

// Chapter Lst page 
function renderList() {
    const chapters = getChapters();
    view.innerHTML = `
        <h2>Chapter List</h2>
        ${chapters.length === 0 ? "<p>No chapters yet.</p>" : ""}
        <ul>
            ${chapters.map(c => `
                <li>
                    <button onclick="navigate('view','${c.id}')">
                        ${c.title}
                        <small>
                            <!-- ${c.startDate || "?"} - ${c.endDate || "?"} -->
                            (${c.startDate ? new Date(c.startDate).toLocaleDateString() : "No start date"} - ${c.endDate ? new Date(c.endDate).toLocaleDateString() : "No end date"})
                        </small>
                    </button>
                </li>
            `).join("")}
        </ul>
    `;
}

// Create Chapter page
function renderCreate() {
    view.innerHTML = `
        <h2> Create Chapter</h2>
        <input id="title" placeholder="Chapter Title" /><br><br>

        <div>
            <label>Start Date</label>
            <input id="startDate" type="date" />
        </div><br>

        <div>
            <label>End Date</label>
            <input id="endDate" type="date" />
        </div><br>

        <textarea id="narrative" placeholder="What happened during this part of your life?"></textarea><br><br>
        <textarea id="keyMoments" placeholder="Key moments"></textarea><br><br>
        <textarea id="reflection" placeholder="Reflection"></textarea><br><br>

        <button id="save">Create Chapter</button>
    `;

    document.getElementById("save").onclick = () => {
        const chapters = getChapters();
        const now = Date.now();
        const newChapter = {
            id: crypto.randomUUID(),
            title: document.getElementById("title").value,
            startDate: document.getElementById("startDate").value,
            endDate: document.getElementById("endDate").value,
            narrative: document.getElementById("narrative").value,
            keyMoments: document.getElementById("keyMoments").value,
            reflection: document.getElementById("reflection").value,
            createdAt: now,
            updatedAt: now
        };

        chapters.push(newChapter);
        saveChapters(chapters);
        navigate("list");
    }
}

// Helper functions
function getChapterById(id) {
    const chapters = getChapters();
    return chapters.find(c => c.id === id);
}

function updateChapter(updatedChapter) {
    const chapters = getChapters().map(c => c.id === updatedChapter.id ? updatedChapter : c);
    saveChapters(chapters);
}

// Edit Chapter page
function renderEdit(id) {
    const chapter = getChapterById(id);
    if (!chapter) {
        view.innerHTML = "<p>Chapter not found.</p>";
        return;
    }
    view.innerHTML = `
        <h2>Edit Chapter</h2>
        <input id="title" value="${chapter.title}" placeholder="Chapter Title" /><br><br>

        <label>Start Date</label>
        <input id="startDate" type="date" value="${chapter.startDate}" /><br><br>

        <label>End Date</label>
        <input id="endDate" type="date" value="${chapter.endDate}" /><br><br>

        <textarea id="narrative" placeholder="What happened during this part of your life?">${chapter.narrative}</textarea><br><br>
        <textarea id="keyMoments" placeholder="Key moments">${chapter.keyMoments}</textarea><br><br>
        <textarea id="reflection" placeholder="Reflection">${chapter.reflection}</textarea><br><br>
        <button id="save">Save Changes</button>
    `;
    
    document.getElementById("save").onclick = () => {
        const updatedChapter = {
            ...chapter,
            title: document.getElementById("title").value,
            startDate: document.getElementById("startDate").value,
            endDate: document.getElementById("endDate").value,
            narrative: document.getElementById("narrative").value,
            keyMoments: document.getElementById("keyMoments").value,
            reflection: document.getElementById("reflection").value,
            updatedAt: Date.now()
        };
        updateChapter(updatedChapter);
        navigate("view", updatedChapter.id);
    };
}



// View Chapter page
function renderView(id) {
    const chapters = getChapters().find(c => c.id === id);
    if (!chapters) {
        view.innerHTML = "<p>Chapter not found.</p>";
        return;
    }
    view.innerHTML = `
        <h2>${chapters.title}</h2>
        <p><em>${chapters.startDate ? new Date(chapters.startDate).toLocaleDateString() : "No start date"} - ${chapters.endDate ? new Date(chapters.endDate).toLocaleDateString() : "No end date"}</em></p>
        <p><em>Edited on ${new Date(chapters.updatedAt).toLocaleString()}</em></p>
        <p>${chapters.narrative}</p> 
        <button onclick="navigate('edit', '${chapters.id}')">Edit</button>
        <!-- maybe delete -->
        <h3>Key Moments</h3>
        <p>${chapters.keyMoments}</p>
        <h3>Reflection</h3>
        <p>${chapters.reflection}</p>
    `;
}

navigate("home");