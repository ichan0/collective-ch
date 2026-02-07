const view = document.getElementById("view");

function getChapters() {
    return JSON.parse(localStorage.getItem("chapters") || "[]");
}

function saveChapers(chapters) {
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
    // if (route === "edit") {
    //     renderEdit(id);
    // }
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
        <textarea id="narrative" placeholder="What happened during this chapter?"></textarea><br><br>
        <textarea id="keyMoments" placeholder="Key moments"></textarea><br><br>
        <textarea id="reflection" placeholder="Reflection"></textarea><br><br>

        <button id="save">Create Chapter</button>
    `;

    document.getElementById("save").onclick = () => {
        const chapters = getChapters();

        chapters.push({
            id: crypto.randomUUID(),
            title: title.value,
            narrative: narrative.value,
            keyMoments: keyMoments.value,
            reflection: reflection.value
        });
        saveChapers(chapters);
        navigate("list");
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
        <p>${chapters.narrative}</p> 
        <!-- maybe delete -->
        <h3>Key Moments</h3>
        <p>${chapters.keyMoments}</p>
        <h3>Reflection</h3>
        <p>${chapters.reflection}</p>
    `;
}

navigate("home");