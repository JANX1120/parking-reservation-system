
// ========================================
// PARKEASE USER DASHBOARD
// ========================================

// Sidebar navigation
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");

const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");
const pageContent = document.getElementById("pageContent");

const navigationLinks = document.querySelectorAll(".nav-link");

// Page descriptions
const pageDescriptions = {
    home: "Welcome to your ParkEase dashboard.",
    find: "Find available parking spaces.",
    reserve: "Reserve your preferred parking space.",
    reservations: "View and manage your reservations.",
    cancel: "Review your reservation cancellation.",
    profile: "Manage your personal information.",
    history: "View your previous parking reservations."
};

// Parking status is shared with the admin dashboard on this browser origin.
const parkingStorageKey = "parkease-shared-parking-spaces";
const sampleParkingSpaces = [
    { id: "P01", location: "Ground Floor", type: "Car", status: "Available" },
    { id: "P02", location: "Ground Floor", type: "Car", status: "Reserved" },
    { id: "P03", location: "Ground Floor", type: "Car", status: "Occupied" },
    { id: "P04", location: "Second Floor", type: "Motorcycle", status: "Available" },
    { id: "P05", location: "Second Floor", type: "Car", status: "Available" },
    { id: "P06", location: "Second Floor", type: "Tricycle", status: "Available" }
];

function readParkingSpaces() {
    try {
        const savedSpaces = JSON.parse(localStorage.getItem(parkingStorageKey));
        return Array.isArray(savedSpaces) ? savedSpaces : sampleParkingSpaces;
    } catch {
        return sampleParkingSpaces;
    }
}

const parkingSpaces = readParkingSpaces();

function saveParkingSpaces() {
    localStorage.setItem(parkingStorageKey, JSON.stringify(parkingSpaces));
}

// Demo reservations are kept in this browser so the dashboard feels persistent.
const reservationStorageKey = "parkease-user-reservations";
const seedReservations = [
    { id: "RES-001", space: "P02", date: "2026-11-02", time: "09:00", status: "Pending" },
    { id: "RES-002", space: "P04", date: "2026-11-04", time: "14:00", status: "Approved" }
];
let reservations;
try {
    const savedReservations = JSON.parse(localStorage.getItem(reservationStorageKey));
    reservations = Array.isArray(savedReservations) ? savedReservations : seedReservations;
} catch {
    reservations = seedReservations;
}

function saveReservations() {
    localStorage.setItem(reservationStorageKey, JSON.stringify(reservations));
}

function syncReservedParkingSpaces() {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    let changed = false;
    reservations.forEach(reservation => {
        const isActive = ["Pending", "Approved"].includes(reservation.status) && reservation.date >= today;
        if (!isActive) return;
        const space = parkingSpaces.find(item => item.id === reservation.space);
        if (space?.status === "Available") {
            space.status = "Reserved";
            changed = true;
        }
    });
    if (changed) saveParkingSpaces();
}

syncReservedParkingSpaces();

// ========================================
// SIDEBAR NAVIGATION
// ========================================

menuToggle.addEventListener("click", () => {
    setSidebarOpen(!sidebar.classList.contains("show"));
});

sidebarBackdrop.addEventListener("click", () => setSidebarOpen(false));

document.addEventListener("keydown", event => {
    if (event.key === "Escape") setSidebarOpen(false);
});

window.addEventListener("storage", event => {
    if (event.key !== parkingStorageKey || !event.newValue) return;
    try {
        const updatedSpaces = JSON.parse(event.newValue);
        if (!Array.isArray(updatedSpaces)) return;
        parkingSpaces.splice(0, parkingSpaces.length, ...updatedSpaces);
        const currentPage = document.querySelector(".nav-link.active")?.dataset.page;
        if (currentPage === "find" || currentPage === "home") showPage(currentPage);
    } catch {
        // Ignore invalid cross-tab updates and keep the last valid view.
    }
});

function setSidebarOpen(open) {
    sidebar.classList.toggle("show", open);
    sidebarBackdrop.classList.toggle("show", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    document.body.classList.toggle("sidebar-open", open);
}

navigationLinks.forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();

        const page = link.dataset.page;

        showPage(page);

        setSidebarOpen(false);
    });
});

// ========================================
// PAGE NAVIGATION
// ========================================

function showPage(page, selectedSpace = "") {
    // Keep older quick-action links working while combining both tasks on one screen.
    const openReservation = page === "reserve";
    if (openReservation) page = "find";
    const pageNames = {
        home: "Overview", find: "Find & reserve",
        reservations: "My reservations", cancel: "Manage bookings",
        profile: "My profile", history: "Reservation history"
    };
    pageTitle.textContent = pageNames[page] || "Overview";
    pageSubtitle.textContent = pageDescriptions[page] || "";
    navigationLinks.forEach(item => item.classList.toggle("active", item.dataset.page === page));

    switch (page) {
        case "home":
            renderHome();
            break;

        case "find":
            renderFindParking(selectedSpace);
            break;

        case "reservations":
            renderMyReservations();
            break;

        case "cancel":
            renderCancelReservation();
            break;

        case "profile":
            renderProfile();
            break;

        case "history":
            renderHistory();
            break;

        default:
            renderHome();
    }

    if (openReservation) openReservationModal(selectedSpace);

    const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
    if (activeLink) activeLink.setAttribute("aria-current", "page");
    navigationLinks.forEach(item => {
        if (item !== activeLink) item.removeAttribute("aria-current");
    });
}

// ========================================
// HOME PAGE
// ========================================

function renderHome() {
    const available = parkingSpaces.filter(
        space => space.status === "Available"
    ).length;

    const pending = reservations.filter(
        reservation => reservation.status === "Pending"
    ).length;

    const approved = reservations.filter(
        reservation => reservation.status === "Approved"
    ).length;

    pageContent.innerHTML = `
        <div class="welcome-banner">
            <div class="welcome-copy">
                <span class="welcome-eyebrow"><i class="fa-solid fa-sparkles"></i> YOUR EVERYDAY PARKING COMPANION</span>
                <h2><span id="greetingText">Good morning,</span><br><span id="welcomeUsername">there</span>.</h2>
                <p>Your next stop is closer than you think. Find your space and get moving.</p>
                <button class="banner-action" onclick="showPage('find')">Find a parking spot <i class="fa-solid fa-arrow-up-right-from-square"></i></button>
            </div>
            <div class="banner-art" aria-hidden="true">
                <div class="art-orbit orbit-one"></div><div class="art-orbit orbit-two"></div>
                <div class="parking-token"><i class="fa-solid fa-square-parking"></i><span>YOUR<br>SPACE</span></div>
                <i class="fa-solid fa-location-dot art-pin"></i>
                <span class="art-coordinate">14°35' N&nbsp; · &nbsp;120°59' E</span>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <i class="fa-solid fa-square-parking"></i>
                <div>
                    <p>Spaces available</p>
                    <h2>${available}</h2>
                    <span class="stat-note"><i class="fa-solid fa-arrow-trend-up"></i> Ready when you are</span>
                </div>
            </div>

            <div class="stat-card">
                <i class="fa-solid fa-clock"></i>
                <div>
                    <p>Awaiting approval</p>
                    <h2>${pending}</h2>
                    <span class="stat-note">Reservation requests</span>
                </div>
            </div>

            <div class="stat-card">
                <i class="fa-solid fa-calendar-check"></i>
                <div>
                    <p>Approved bookings</p>
                    <h2>${approved}</h2>
                    <span class="stat-note">You're all set</span>
                </div>
            </div>
        </div>

        <div class="section-heading section-heading-row">
            <div><span class="section-kicker">YOUR DASHBOARD</span><h2>Your next move</h2><p>Everything you need for a smoother arrival.</p></div>
            <span class="today-label"><i class="fa-regular fa-calendar"></i> ${new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</span>
        </div>

        <div class="quick-grid">
            <button class="quick-card" onclick="showPage('find')">
                <span class="quick-icon"><i class="fa-solid fa-magnifying-glass"></i></span>
                <span class="quick-step">01 / DISCOVER</span>
                <h3>Find a space</h3>
                <p>See what's open across the lot.</p>
                <span class="quick-arrow"><i class="fa-solid fa-arrow-right"></i></span>
            </button>

            <button class="quick-card" onclick="showPage('reserve')">
                <span class="quick-icon"><i class="fa-regular fa-calendar-plus"></i></span>
                <span class="quick-step">02 / BOOK</span>
                <h3>Make it yours</h3>
                <p>Reserve a space in just a few taps.</p>
                <span class="quick-arrow"><i class="fa-solid fa-arrow-right"></i></span>
            </button>

            <button class="quick-card" onclick="showPage('reservations')">
                <span class="quick-icon"><i class="fa-regular fa-rectangle-list"></i></span>
                <span class="quick-step">03 / MANAGE</span>
                <h3>Your bookings</h3>
                <p>Keep your plans in one place.</p>
                <span class="quick-arrow"><i class="fa-solid fa-arrow-right"></i></span>
            </button>
        </div>

        <div class="home-lower-grid">
            <div class="content-card recent-card">
                <div class="card-heading"><div><span class="section-kicker">RECENT ACTIVITY</span><h2>Latest reservations</h2></div><button class="text-action" onclick="showPage('reservations')">View all <i class="fa-solid fa-arrow-right"></i></button></div>
                ${reservations.length ? reservations.slice(-2).reverse().map(reservation => `
                    <div class="recent-row"><div class="recent-icon"><i class="fa-solid fa-square-parking"></i></div><div class="recent-details"><strong>${reservation.space}</strong><span>${formatDate(reservation.date)} · ${formatTime(reservation.time)}</span></div><span class="status ${reservation.status.toLowerCase().replaceAll(" ", "-")}">${reservation.status}</span></div>
                `).join("") : `<div class="empty-state"><i class="fa-regular fa-calendar"></i><p>No reservations yet. Your next trip starts with finding a space.</p></div>`}
            </div>
            <div class="journey-card"><span class="journey-spark"><i class="fa-solid fa-wand-magic-sparkles"></i></span><span class="section-kicker">A LITTLE PARKING WISDOM</span><h2>Arrive easy.<br>Leave happy.</h2><p>Book ahead to make your arrival a little less hectic.</p><button onclick="showPage('reserve')">Plan your visit <i class="fa-solid fa-arrow-right"></i></button><i class="fa-solid fa-route journey-route" aria-hidden="true"></i></div>
        </div>
    `;
    const storedName = localStorage.getItem("parkease-profile-name") || localStorage.getItem("username") || "there";
    document.getElementById("welcomeUsername").textContent = storedName.split(" ")[0];
    const hour = new Date().getHours();
    document.getElementById("greetingText").textContent = hour < 12 ? "Good morning," : hour < 18 ? "Good afternoon," : "Good evening,";
}

// ========================================
// FIND PARKING PAGE
// ========================================

function renderFindParking(selectedSpace = "") {
    pageContent.innerHTML = `
        <section class="find-hero">
            <div class="find-hero-copy"><span class="section-kicker">PARKING BOARD · UPDATED JUST NOW</span><h2>Find your place.</h2><p>Choose an open space, then reserve it in a few quick steps.</p></div>
            <div class="lot-capacity"><div class="capacity-ring"><strong>${parkingSpaces.filter(space => space.status === "Available").length}</strong><span>OPEN</span></div><div><span>SPACES READY</span><strong>Ground + Second floor</strong></div></div>
            <span class="find-hero-route" aria-hidden="true"><i class="fa-solid fa-route"></i></span>
        </section>

        <div class="lot-stats">
            <div><span class="lot-stat-dot dot-open"></span><span>Available</span><strong>${parkingSpaces.filter(space => space.status === "Available").length}</strong></div>
            <div><span class="lot-stat-dot dot-reserved"></span><span>Reserved</span><strong>${parkingSpaces.filter(space => space.status === "Reserved").length}</strong></div>
            <div><span class="lot-stat-dot dot-occupied"></span><span>Occupied</span><strong>${parkingSpaces.filter(space => space.status === "Occupied").length}</strong></div>
        </div>

        <section class="parking-board">
            <div class="board-heading"><div><span class="section-kicker">LIVE LOT STATUS</span><h3>Choose a parking space</h3><p>Tap an available bay to start your reservation.</p></div><span class="board-count" id="boardCount">${parkingSpaces.length} spaces</span></div>
            <div class="parking-toolbar">
                <label class="space-search"><i class="fa-solid fa-magnifying-glass"></i><input id="spaceSearch" type="search" placeholder="Search space, floor, or type" aria-label="Search parking spaces"></label>
                <div class="space-filters" role="group" aria-label="Filter parking spaces">
                    <button type="button" class="space-filter active" data-space-filter="all" aria-pressed="true">All spaces</button>
                    <button type="button" class="space-filter" data-space-filter="Available" aria-pressed="false">Available</button>
                    <button type="button" class="space-filter" data-space-filter="Unavailable" aria-pressed="false">Unavailable</button>
                </div>
            </div>
            <div class="parking-grid" id="parkingGrid"></div>
            <div class="board-footnote"><i class="fa-regular fa-circle-question"></i> Space availability is sample data and may not reflect a live parking lot.</div>
        </section>

        <dialog class="reservation-modal" id="reservationDialog" aria-labelledby="reservationModalTitle">
            <div class="modal-heading">
                <div><span class="modal-kicker">NEW BOOKING</span><h2 id="reservationModalTitle">Reserve your spot</h2><p>Choose your date and arrival time.</p></div>
                <button class="modal-close" type="button" aria-label="Close reservation form" onclick="closeReservationModal()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <form id="reservationForm" class="dashboard-form">
                <label for="spaceSelect">Parking space</label>
                <select id="spaceSelect" required>
                    <option value="">Choose an available space</option>
                    ${parkingSpaces.filter(space => space.status === "Available").map(space => `
                        <option value="${space.id}" ${space.id === selectedSpace ? "selected" : ""}>
                            ${space.id} - ${space.location} (${space.type})
                        </option>
                    `).join("")}
                </select>
                <div class="reservation-fields">
                    <div><label for="reservationDate">Reservation date</label><input type="date" id="reservationDate" required></div>
                    <div><label for="reservationTime">Arrival time</label><input type="time" id="reservationTime" required></div>
                </div>
                <button type="submit" class="main-action"><i class="fa-solid fa-calendar-check"></i> Submit reservation</button>
            </form>
        </dialog>
    `;

    renderParkingCards();

    let activeFilter = "all";
    const searchInput = document.getElementById("spaceSearch");
    searchInput.addEventListener("input", () => renderParkingCards(searchInput.value, activeFilter));
    document.querySelectorAll(".space-filter").forEach(button => {
        button.addEventListener("click", () => {
            activeFilter = button.dataset.spaceFilter;
            document.querySelectorAll(".space-filter").forEach(item => {
                const selected = item === button;
                item.classList.toggle("active", selected);
                item.setAttribute("aria-pressed", String(selected));
            });
            renderParkingCards(searchInput.value, activeFilter);
        });
    });

    const dateInput = document.getElementById("reservationDate");
    dateInput.min = new Date().toISOString().split("T")[0];

    document.getElementById("reservationForm").addEventListener("submit", event => {
        event.preventDefault();

        const space = document.getElementById("spaceSelect").value;
        const date = dateInput.value;
        const time = document.getElementById("reservationTime").value;

        const selectedSpace = parkingSpaces.find(item => item.id === space);
        if (!selectedSpace || selectedSpace.status !== "Available") {
            closeReservationModal();
            showPage("find");
            alert("That parking space is no longer available. Please choose another space.");
            return;
        }

        reservations.push({
            id: "RES-" + String(reservations.length + 1).padStart(3, "0"),
            space,
            date,
            time,
            status: "Pending"
        });
        saveReservations();
        selectedSpace.status = "Reserved";
        saveParkingSpaces();

        showPage("reservations");
    });

    const reservationDialog = document.getElementById("reservationDialog");
    reservationDialog.addEventListener("click", event => {
        if (event.target === reservationDialog) closeReservationModal();
    });
}

function renderParkingCards(searchText = "", statusFilter = "all") {
    const normalizedSearch = searchText.trim().toLowerCase();
    const visibleSpaces = parkingSpaces.filter(space => {
        const matchesSearch = `${space.id} ${space.location} ${space.type} ${space.status}`.toLowerCase().includes(normalizedSearch);
        const matchesStatus = statusFilter === "all" || (statusFilter === "Available" ? space.status === "Available" : space.status !== "Available");
        return matchesSearch && matchesStatus;
    });
    const parkingGrid = document.getElementById("parkingGrid");
    const boardCount = document.getElementById("boardCount");
    if (!parkingGrid || !boardCount) return;

    boardCount.textContent = `${visibleSpaces.length} ${visibleSpaces.length === 1 ? "space" : "spaces"}`;
    parkingGrid.innerHTML = visibleSpaces.length ? visibleSpaces.map(space => `
        <article class="parking-card space-card ${space.status === "Available" ? "space-open" : "space-closed"}">
            <div class="space-card-head"><span class="space-id">${space.id}</span><span class="status ${space.status.toLowerCase()}">${space.status}</span></div>
            <div class="space-illustration"><span class="space-line"></span><span class="space-car"><i class="fa-solid ${space.type === "Motorcycle" ? "fa-motorcycle" : space.type === "Tricycle" ? "fa-tricycle" : "fa-car-side"}"></i></span><span class="space-line"></span></div>
            <div class="space-card-info"><div><h4>${space.location}</h4><p>${space.type} parking</p></div><span class="space-floor-icon"><i class="fa-solid fa-layer-group"></i></span></div>
            ${space.status === "Available" ? `<button class="spot-action" type="button" onclick="openReservationModal('${space.id}')">Reserve this spot <i class="fa-solid fa-arrow-right"></i></button>` : `<span class="space-unavailable-note"><i class="fa-solid fa-lock"></i> This space is currently ${space.status.toLowerCase()}</span>`}
        </article>
    `).join("") : `<div class="space-empty"><i class="fa-solid fa-magnifying-glass"></i><h4>No spaces found</h4><p>Try a different search or status filter.</p></div>`;
}

function openReservationModal(selectedSpace = "") {
    if (!document.getElementById("reservationDialog")) showPage("find");
    const dialog = document.getElementById("reservationDialog");
    const spaceSelect = document.getElementById("spaceSelect");
    if (!dialog || !spaceSelect) return;
    spaceSelect.value = selectedSpace;
    if (!dialog.open) dialog.showModal();
    spaceSelect.focus();
}

function closeReservationModal() {
    document.getElementById("reservationDialog")?.close();
}

// ========================================
// MY RESERVATIONS PAGE
// ========================================

function renderMyReservations() {
    const activeCount = reservations.filter(item => item.status === "Pending" || item.status === "Approved").length;
    const approvedCount = reservations.filter(item => item.status === "Approved").length;
    const orderedReservations = [...reservations].reverse();

    pageContent.innerHTML = `
        <section class="records-hero reservations-hero">
            <div><span class="section-kicker">YOUR PARKING PLANS</span><h2>My reservations</h2><p>All your upcoming parking plans, together in one place.</p></div>
            <div class="records-hero-stats"><div><strong>${activeCount}</strong><span>ACTIVE</span></div><div><strong>${approvedCount}</strong><span>APPROVED</span></div></div>
            <i class="fa-regular fa-calendar-check records-hero-art" aria-hidden="true"></i>
        </section>

        <div class="records-section-heading"><div><span class="section-kicker">BOOKING OVERVIEW</span><h3>Your bookings</h3><p>Check dates, spaces, and approval status.</p></div><button class="records-add-button" onclick="showPage('reserve')"><i class="fa-solid fa-plus"></i> New reservation</button></div>

        <div class="booking-list">
            ${orderedReservations.length ? orderedReservations.map(reservation => `
                <article class="booking-card">
                    <div class="booking-date-tile"><span>${new Date(`${reservation.date}T00:00:00`).toLocaleDateString([], { month: "short" })}</span><strong>${new Date(`${reservation.date}T00:00:00`).getDate()}</strong><small>${new Date(`${reservation.date}T00:00:00`).getFullYear()}</small></div>
                    <div class="booking-main"><div class="booking-card-heading"><div><span class="booking-id">${reservation.id}</span><h4>Parking space ${reservation.space}</h4></div><span class="status ${reservation.status.toLowerCase().replaceAll(" ", "-")}">${reservation.status}</span></div><div class="booking-meta"><span><i class="fa-regular fa-clock"></i> ${formatTime(reservation.time)}</span><span><i class="fa-solid fa-location-dot"></i> ParkEase lot</span></div></div>
                    <div class="booking-side"><span>RESERVATION</span><i class="fa-solid fa-arrow-up-right-from-square"></i></div>
                </article>
            `).join("") : `<div class="records-empty"><span><i class="fa-regular fa-calendar"></i></span><h3>No reservations yet</h3><p>When you book a space, your plans will show up here.</p><button class="records-add-button" onclick="showPage('reserve')"><i class="fa-solid fa-plus"></i> Find a space</button></div>`}
        </div>
    `;
}

// ========================================
// CANCEL RESERVATION PAGE
// ========================================

function renderCancelReservation() {
    const activeReservations = reservations.filter(
        reservation =>
            reservation.status === "Pending" ||
            reservation.status === "Approved"
    );
    const requestedReservations = reservations.filter(reservation => reservation.status === "Cancellation Requested");

    pageContent.innerHTML = `
        <section class="records-hero cancel-hero">
            <div><span class="section-kicker">BOOKING SUPPORT</span><h2>Manage a booking</h2><p>Need to change your plans? Send a cancellation request for an active reservation.</p></div>
            <div class="cancel-hero-icon"><i class="fa-regular fa-calendar-xmark"></i></div>
        </section>
        <div class="records-section-heading"><div><span class="section-kicker">ACTION NEEDED</span><h3>Active reservations</h3><p>${activeReservations.length ? "Choose a booking to request cancellation." : "There are no bookings waiting for action."}</p></div><span class="board-count">${activeReservations.length} active</span></div>
        <div class="cancel-list">
            ${activeReservations.length ? activeReservations.map(reservation => `
                <article class="cancel-card"><div class="cancel-card-icon"><i class="fa-solid fa-square-parking"></i></div><div class="cancel-card-main"><span class="booking-id">${reservation.id}</span><h4>Space ${reservation.space}</h4><p><i class="fa-regular fa-calendar"></i> ${formatDate(reservation.date)} <span>·</span> <i class="fa-regular fa-clock"></i> ${formatTime(reservation.time)}</p></div><span class="status ${reservation.status.toLowerCase()}">${reservation.status}</span><button class="cancel-button" onclick="requestCancellation('${reservation.id}')"><i class="fa-solid fa-ban"></i> Request cancellation</button></article>
            `).join("") : `<div class="records-empty"><span><i class="fa-solid fa-circle-check"></i></span><h3>You're all caught up</h3><p>There are no active reservations to cancel right now.</p></div>`}
        </div>
        ${requestedReservations.length ? `<section class="requested-cancellations"><div class="records-section-heading"><div><span class="section-kicker">REQUEST STATUS</span><h3>Cancellation requested</h3></div></div>${requestedReservations.map(reservation => `<div class="requested-row"><span class="requested-icon"><i class="fa-regular fa-hourglass-half"></i></span><div><strong>${reservation.id} · Space ${reservation.space}</strong><p>${formatDate(reservation.date)} · Your request is waiting for review.</p></div><span class="status cancellation-requested">Requested</span></div>`).join("")}</section>` : ""}
    `;
}

function requestCancellation(id) {
    const reservation = reservations.find(item => item.id === id);

    if (!reservation) return;

    const confirmed = confirm(
        "Are you sure you want to request cancellation?"
    );

    if (confirmed) {
        reservation.status = "Cancellation Requested";
        saveReservations();
        showPage("cancel");
    }
}

// ========================================
// PROFILE PAGE
// ========================================

function renderProfile() {
    const profileName = localStorage.getItem("parkease-profile-name") || "";
    const profileUsername = localStorage.getItem("parkease-profile-username") || localStorage.getItem("username") || "";
    const profileEmail = localStorage.getItem("parkease-profile-email") || "";

    pageContent.innerHTML = `
        <div class="profile-page">
            <div class="profile-page-heading">
                <div><span class="section-kicker">ACCOUNT SETTINGS</span><h2>My profile</h2><p>Keep your details current for a smoother parking experience.</p></div>
                <span class="profile-private"><i class="fa-solid fa-lock"></i> Private account</span>
            </div>

            <div class="profile-layout">
                <aside class="profile-overview">
                    <div class="profile-cover-art"><span class="profile-orbit"></span><i class="fa-solid fa-location-dot"></i></div>
                    <div class="profile-identity">
                        <div class="profile-monogram" id="profileMonogram">U</div>
                        <span class="profile-member-tag"><i class="fa-solid fa-circle-check"></i> ParkEase member</span>
                        <h3 id="profileSummaryName">Your profile</h3>
                        <p id="profileSummaryUsername">Add a username</p>
                    </div>
                    <div class="profile-summary-details">
                        <div><span>EMAIL ADDRESS</span><strong id="profileSummaryEmail">Not added yet</strong></div>
                        <div><span>ACCOUNT TYPE</span><strong>Personal parking</strong></div>
                    </div>
                    <div class="profile-tip"><i class="fa-regular fa-lightbulb"></i><p>Keep your contact details up to date so your account stays easy to recognize.</p></div>
                </aside>

                <section class="content-card profile-form-card">
                    <div class="profile-form-heading"><div><span class="section-kicker">YOUR INFORMATION</span><h3>Personal details</h3><p>Update the details connected to your ParkEase account.</p></div><span class="edit-mark"><i class="fa-solid fa-pen"></i></span></div>
                    <form class="dashboard-form profile-form" id="profileForm">
                        <div class="profile-form-grid">
                            <div class="profile-field"><label for="profileName">Full name</label><div class="input-with-icon"><i class="fa-regular fa-user"></i><input id="profileName" type="text" placeholder="e.g. Alex Morgan" autocomplete="name" required></div><small>Your name as it should appear on your account.</small></div>
                            <div class="profile-field"><label for="profileUsername">Username</label><div class="input-with-icon"><i class="fa-solid fa-at"></i><input id="profileUsername" type="text" placeholder="Choose a username" autocomplete="username" required></div><small>A short name to identify your account.</small></div>
                            <div class="profile-field profile-field-wide"><label for="profileEmail">Email address</label><div class="input-with-icon"><i class="fa-regular fa-envelope"></i><input id="profileEmail" type="email" placeholder="you@example.com" autocomplete="email" required></div><small>Used for reservation updates and account notices.</small></div>
                        </div>
                        <div class="profile-form-footer"><span><i class="fa-solid fa-shield-halved"></i> Your details stay on this device.</span><button type="submit" class="main-action"><i class="fa-solid fa-check"></i> Save changes</button></div>
                    </form>
                </section>
            </div>
        </div>
    `;

    document.getElementById("profileName").value = profileName;
    document.getElementById("profileUsername").value = profileUsername;
    document.getElementById("profileEmail").value = profileEmail;
    document.getElementById("profileMonogram").textContent = (profileName || profileUsername || "U").trim().charAt(0).toUpperCase();
    document.getElementById("profileSummaryName").textContent = profileName || "Your profile";
    document.getElementById("profileSummaryUsername").textContent = profileUsername ? `@${profileUsername.replace(/^@/, "")}` : "Add a username";
    document.getElementById("profileSummaryEmail").textContent = profileEmail || "Not added yet";

    document.getElementById("profileForm").addEventListener("submit", event => {
        event.preventDefault();
        localStorage.setItem("parkease-profile-name", document.getElementById("profileName").value.trim());
        localStorage.setItem("parkease-profile-username", document.getElementById("profileUsername").value.trim());
        localStorage.setItem("parkease-profile-email", document.getElementById("profileEmail").value.trim());
        document.getElementById("displayUsername").textContent = document.getElementById("profileUsername").value.trim() || "User";
        showPage("profile");
        pageContent.insertAdjacentHTML("afterbegin", '<p class="inline-success"><i class="fa-solid fa-circle-check"></i> Profile saved on this device.</p>');
    });
}

// ========================================
// RESERVATION HISTORY PAGE
// ========================================

function renderHistory() {
    const history = [...reservations].reverse();
    const completedCount = history.filter(item => item.status === "Approved" || item.status === "Cancellation Requested").length;

    pageContent.innerHTML = `
        <section class="records-hero history-hero">
            <div><span class="section-kicker">YOUR PARKING JOURNAL</span><h2>Reservation history</h2><p>A simple record of every booking and request made from your account.</p></div>
            <div class="history-total"><strong>${history.length.toString().padStart(2, "0")}</strong><span>TOTAL<br>RECORDS</span></div>
        </section>
        <div class="records-section-heading"><div><span class="section-kicker">ACTIVITY LOG</span><h3>All reservations</h3><p>${completedCount} ${completedCount === 1 ? "booking is" : "bookings are"} approved or have a cancellation request.</p></div><span class="board-count">Newest first</span></div>
        <div class="history-list">
            ${history.length ? history.map((reservation, index) => `
                <article class="history-card"><div class="history-timeline"><span class="history-dot ${reservation.status.toLowerCase().replaceAll(" ", "-")}"></span>${index < history.length - 1 ? "<span class='history-stem'></span>" : ""}</div><div class="history-date"><strong>${new Date(`${reservation.date}T00:00:00`).toLocaleDateString([], { day: "2-digit" })}</strong><span>${new Date(`${reservation.date}T00:00:00`).toLocaleDateString([], { month: "short", year: "numeric" })}</span></div><div class="history-info"><span class="booking-id">${reservation.id}</span><h4>Space ${reservation.space}</h4><p><i class="fa-regular fa-clock"></i> ${formatTime(reservation.time)} <span>·</span> ParkEase lot</p></div><span class="status ${reservation.status.toLowerCase().replaceAll(" ", "-")}">${reservation.status}</span><i class="fa-solid fa-arrow-up-right-from-square history-end-icon" aria-hidden="true"></i></article>
            `).join("") : `<div class="records-empty"><span><i class="fa-solid fa-clock-rotate-left"></i></span><h3>Your history starts here</h3><p>Once you place a reservation, it will be recorded here.</p><button class="records-add-button" onclick="showPage('find')"><i class="fa-solid fa-magnifying-glass"></i> Find parking</button></div>`}
        </div>
    `;
}

// LOAD DEFAULT PAGE
function formatTime(value) {
    if (!value) return "—";
    const [hours, minutes] = value.split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return value;
    return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatDate(value) {
    if (!value) return "Date not set";
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

const initialUsername = localStorage.getItem("parkease-profile-username") || localStorage.getItem("username") || "User";
document.getElementById("displayUsername").textContent = initialUsername;
showPage("home");
