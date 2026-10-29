    /* ========================================
    PAGE ELEMENTS
    ======================================== */

    const reservationToggle =
        document.getElementById("reservationToggle");

    const reservationSubmenu =
        document.getElementById("reservationSubmenu");

    const pageTitle =
        document.getElementById("pageTitle");

    const pageSubtitle =
        document.getElementById("pageSubtitle");

    const pageContent =
        document.getElementById("pageContent");


    /* ========================================
    PAGE DESCRIPTIONS
    ======================================== */

    const pageDescriptions = {
        home: {
            title: "Home",
            subtitle: "Welcome back! Here's your parking overview."
        },

        parking: {
            title: "Parking Space",
            subtitle: "Manage parking spaces and availability."
        },

        manual: {
            title: "Manual Reservations",
            subtitle: "Create and manage reservations for users."
        },

        requests: {
            title: "Request Reservations",
            subtitle: "Review and manage incoming reservation requests."
        },

        cancellations: {
            title: "Cancel Reservations",
            subtitle: "Review and manage reservation cancellations."
        },

        users: {
            title: "User",
            subtitle: "View and manage registered users."
        },


        logs: {
            title: "Activity Logs",
            subtitle: "Track reservation activities and system changes."
        },

        settings: {
            title: "Settings",
            subtitle: "Manage system preferences and reservation settings."
        }

    };


    /* ========================================
    SAMPLE PARKING SPACES
    ======================================== */

    let parkingSpaces = [
        {
            id: "P01",
            location: "Ground Floor",
            type: "Regular",
            status: "Available"
        },
        {
            id: "P02",
            location: "Ground Floor",
            type: "Regular",
            status: "Reserved"
        },
        {
            id: "P03",
            location: "Ground Floor",
            type: "PWD",
            status: "Occupied"
        },
        {
            id: "P04",
            location: "Second Floor",
            type: "Motorcycle",
            status: "Available"
        },
        {
            id: "P05",
            location: "Second Floor",
            type: "Regular",
            status: "Available"
        },
        {
            id: "P06",
            location: "Second Floor",
            type: "Regular",
            status: "Available"
        }
    ];


    /* ========================================
    SAMPLE ACTIVITY LOGS
    ======================================== */

    const activityLogs = [
        {
            date: "2026-10-26 09:00",
            user: "Administrator",
            activity: "Parking Space",
            details: "Parking space P01 was added."
        },
        {
            date: "2026-10-26 09:15",
            user: "Juan Dela Cruz",
            activity: "Reservation",
            details: "Requested parking space P02."
        },
        {
            date: "2026-10-26 09:30",
            user: "Administrator",
            activity: "Reservation",
            details: "Approved reservation #001."
        }
    ];


    /* ========================================
    SAMPLE USERS
    ======================================== */

    let users = [
        {
            id: "USR-001",
            name: "Juan Dela Cruz",
            studentId: "2026-001",
            email: "juan.delacruz@example.com",
            contact: "09123456789",
            role: "Student",
            status: "Active"
        },
        {
            id: "USR-002",
            name: "Maria Santos",
            studentId: "2026-002",
            email: "maria.santos@example.com",
            contact: "09987654321",
            role: "Student",
            status: "Active"
        },
        {
            id: "USR-003",
            name: "Angela Reyes",
            studentId: "2026-003",
            email: "angela.reyes@example.com",
            contact: "09171234567",
            role: "Student",
            status: "Inactive"
        },
        {
            id: "USR-004",
            name: "Mark Villanueva",
            studentId: "2026-004",
            email: "mark.villanueva@example.com",
            contact: "09981234567",
            role: "Student",
            status: "Active"
        },
        {
            id: "USR-005",
            name: "Sofia Garcia",
            studentId: "2026-005",
            email: "sofia.garcia@example.com",
            contact: "09192345678",
            role: "Student",
            status: "Active"
        }
    ];


    /* ========================================
    HELPER: HTML ESCAPING
    ======================================== */

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, character => {
            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return entities[character];
        });
    }


    /* ========================================
    NAVIGATION
    ======================================== */


    function showPage(page) {
        const pageInfo = pageDescriptions[page];

        if (!pageInfo) return;

        pageTitle.textContent = pageInfo.title;
        pageSubtitle.textContent = pageInfo.subtitle;

        // Update the active sidebar item.
        document.querySelectorAll("[data-page]").forEach(item => {
            item.classList.toggle("active", item.dataset.page === page);
        });

        // Render only the selected page.
        switch (page) {
            case "home":
                renderHome();
                break;

            case "parking":
                renderParkingPage();
                break;

            case "manual":
                renderManualReservations();
                break;

            case "requests":
                renderRequestReservations();
                break;

            case "cancellations":
                renderCancellationReservations();
                break;
            
            case "users":
                renderUsersPage();
                break;

            case "logs":
                renderLogsPage();
                break;
            
            case "settings":
                renderSettingsPage();
                break;

            default:
                renderPlaceholder(pageInfo);
                break;
        }
    }



    /* ========================================
    HOME DASHBOARD
    ======================================== */

    function renderHome() {
        const available = parkingSpaces.filter(
            space => space.status === "Available"
        ).length;

        const reserved = parkingSpaces.filter(
            space => space.status === "Reserved"
        ).length;

        const occupied = parkingSpaces.filter(
            space => space.status === "Occupied"
        ).length;

        pageContent.innerHTML = `
            <div class="welcome-card">
                <div>
                    <span class="welcome-label">ADMIN DASHBOARD</span>
                    <h2>Welcome to ParkEase!</h2>
                    <p>
                        Manage parking spaces and reservations
                        in one convenient place.
                    </p>
                </div>

                <div class="welcome-icon">
                    <i class="fa-solid fa-square-parking"></i>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon green">
                        <i class="fa-solid fa-square-parking"></i>
                    </div>
                    <p>Total Parking Spaces</p>
                    <h2>${parkingSpaces.length}</h2>
                    <span>Registered parking spaces</span>
                </div>

                <div class="stat-card">
                    <div class="stat-icon blue">
                        <i class="fa-solid fa-circle-check"></i>
                    </div>
                    <p>Available Spaces</p>
                    <h2>${available}</h2>
                    <span>Ready for reservation</span>
                </div>

                <div class="stat-card">
                    <div class="stat-icon orange">
                        <i class="fa-solid fa-calendar-check"></i>
                    </div>
                    <p>Reserved Spaces</p>
                    <h2>${reserved}</h2>
                    <span>Assigned to reservations</span>
                </div>

                <div class="stat-card">
                    <div class="stat-icon red">
                        <i class="fa-solid fa-car"></i>
                    </div>
                    <p>Occupied Spaces</p>
                    <h2>${occupied}</h2>
                    <span>Currently occupied</span>
                </div>
            </div>

            <div class="content-card">
                <div class="section-heading">
                    <div>
                        <h3>Quick Access</h3>
                        <p>Choose a section to manage your parking facility.</p>
                    </div>
                </div>

                <div class="quick-access-grid">
                    <button class="quick-access-item" data-page="parking">
                        <i class="fa-solid fa-square-parking"></i>
                        <span>Manage Parking Spaces</span>
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>

                    <button class="quick-access-item" data-page="manual">
                        <i class="fa-solid fa-calendar-plus"></i>
                        <span>Manual Reservations</span>
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>

                    <button class="quick-access-item" data-page="requests">
                        <i class="fa-solid fa-clipboard-check"></i>
                        <span>Review Requests</span>
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
    }


    /* ========================================
    PARKING SPACE PAGE
    ======================================== */

    function renderParkingPage() {
        pageContent.innerHTML = `
            <div class="parking-summary">
                <div class="mini-stat">
                    <span>Total Spaces</span>
                    <strong>${parkingSpaces.length}</strong>
                </div>

                <div class="mini-stat">
                    <span>Available</span>
                    <strong class="text-green">
                        ${countSpaces("Available")}
                    </strong>
                </div>

                <div class="mini-stat">
                    <span>Reserved</span>
                    <strong class="text-orange">
                        ${countSpaces("Reserved")}
                    </strong>
                </div>

                <div class="mini-stat">
                    <span>Occupied</span>
                    <strong class="text-red">
                        ${countSpaces("Occupied")}
                    </strong>
                </div>
            </div>

            <div class="content-card">
                <div class="parking-toolbar">
                    <div class="section-heading">
                        <div>
                            <h3>Parking Spaces</h3>
                            <p>
                                Add, edit, and manage your registered parking spaces.
                            </p>
                        </div>
                    </div>

                    <button class="primary-button" id="addParkingButton">
                        <i class="fa-solid fa-plus"></i>
                        Add Parking Space
                    </button>
                </div>

                <div class="parking-filters">
                    <input
                        type="search"
                        id="parkingSearch"
                        placeholder="Search parking space..."
                        aria-label="Search parking spaces"
                    >

                    <select id="parkingStatusFilter" aria-label="Filter by status">
                        <option value="all">All Statuses</option>
                        <option value="Available">Available</option>
                        <option value="Reserved">Reserved</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Unavailable">Unavailable</option>
                    </select>
                </div>

                <div class="table-wrapper">
                    <table class="logs-table parking-table">
                        <thead>
                            <tr>
                                <th>Space ID</th>
                                <th>Location</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody id="parkingTableBody"></tbody>
                    </table>
                </div>

                <p id="parkingEmpty" class="logs-empty" hidden>
                    No parking spaces found.
                </p>
            </div>

            <div class="modal-backdrop" id="parkingModal" hidden>
                <div
                    class="modal-card"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="parkingModalTitle"
                >
                    <div class="modal-heading">
                        <div>
                            <h3 id="parkingModalTitle">Add Parking Space</h3>
                            <p>Enter the parking space information below.</p>
                        </div>

                        <button
                            type="button"
                            class="icon-button"
                            id="closeParkingModal"
                            aria-label="Close dialog"
                        >
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <form id="parkingForm">
                        <input type="hidden" id="originalSpaceId">

                        <label for="spaceId">Space ID</label>
                        <input
                            type="text"
                            id="spaceId"
                            placeholder="Example: P07"
                            required
                            maxlength="20"
                        >

                        <label for="spaceLocation">Location</label>
                        <input
                            type="text"
                            id="spaceLocation"
                            placeholder="Example: Ground Floor"
                            required
                            maxlength="80"
                        >

                        <label for="spaceType">Parking Type</label>
                        <select id="spaceType" required>
                            <option value="Regular">Regular</option>
                            <option value="PWD">PWD</option>
                            <option value="Motorcycle">Motorcycle</option>
                        </select>

                        <label for="spaceStatus">Status</label>
                        <select id="spaceStatus" required>
                            <option value="Available">Available</option>
                            <option value="Reserved">Reserved</option>
                            <option value="Occupied">Occupied</option>
                            <option value="Unavailable">Unavailable</option>
                        </select>

                        <p class="form-error" id="parkingFormError" hidden></p>

                        <div class="modal-actions">
                            <button
                                type="button"
                                class="secondary-button"
                                id="cancelParkingForm"
                            >
                                Cancel
                            </button>

                            <button type="submit" class="primary-button">
                                Save Parking Space
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        bindParkingEvents();
        renderParkingTable();
    }


    /* ========================================
    PARKING SPACE HELPERS
    ======================================== */

    function countSpaces(status) {
        return parkingSpaces.filter(
            space => space.status === status
        ).length;
    }


    function getStatusClass(status) {
        const classes = {
            Available: "badge-green",
            Reserved: "badge-orange",
            Occupied: "badge-red",
            Unavailable: "badge-gray"
        };

        return classes[status] || "badge-gray";
    }


    /* ========================================
    RENDER PARKING TABLE
    ======================================== */

    function renderParkingTable() {
        const tableBody = document.getElementById("parkingTableBody");

        if (!tableBody) return;

        const search = document
            .getElementById("parkingSearch")
            .value
            .toLowerCase()
            .trim();

        const statusFilter =
            document.getElementById("parkingStatusFilter").value;

        const filteredSpaces = parkingSpaces.filter(space => {
            const matchesSearch = [
                space.id,
                space.location,
                space.type,
                space.status
            ].some(value => value.toLowerCase().includes(search));

            const matchesStatus =
                statusFilter === "all" ||
                space.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

        tableBody.innerHTML = "";

        filteredSpaces.forEach(space => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td><strong>${escapeHTML(space.id)}</strong></td>
                <td>${escapeHTML(space.location)}</td>
                <td>${escapeHTML(space.type)}</td>
                <td>
                    <span class="status-badge ${getStatusClass(space.status)}">
                        ${escapeHTML(space.status)}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button
                            class="icon-button edit-space"
                            data-id="${escapeHTML(space.id)}"
                            aria-label="Edit ${escapeHTML(space.id)}"
                            title="Edit"
                        >
                            <i class="fa-solid fa-pen"></i>
                        </button>

                        <button
                            class="icon-button delete-space"
                            data-id="${escapeHTML(space.id)}"
                            aria-label="Delete ${escapeHTML(space.id)}"
                            title="Delete"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;

            tableBody.appendChild(row);
        });

        document.getElementById("parkingEmpty").hidden =
            filteredSpaces.length > 0;

        // Refresh summary numbers.
        const summary = document.querySelectorAll(".mini-stat strong");

        if (summary.length === 4) {
            summary[0].textContent = parkingSpaces.length;
            summary[1].textContent = countSpaces("Available");
            summary[2].textContent = countSpaces("Reserved");
            summary[3].textContent = countSpaces("Occupied");
        }
    }


    /* ========================================
    PARKING SPACE EVENTS
    ======================================== */

    function bindParkingEvents() {
        const modal = document.getElementById("parkingModal");
        const form = document.getElementById("parkingForm");

        document.getElementById("addParkingButton")
            .addEventListener("click", () => {
                openParkingModal();
            });

        document.getElementById("closeParkingModal")
            .addEventListener("click", closeParkingModal);

        document.getElementById("cancelParkingForm")
            .addEventListener("click", closeParkingModal);

        modal.addEventListener("click", event => {
            if (event.target === modal) {
                closeParkingModal();
            }
        });

        document.getElementById("parkingSearch")
            .addEventListener("input", renderParkingTable);

        document.getElementById("parkingStatusFilter")
            .addEventListener("change", renderParkingTable);

        document.getElementById("parkingTableBody")
            .addEventListener("click", event => {
                const editButton = event.target.closest(".edit-space");
                const deleteButton = event.target.closest(".delete-space");

                if (editButton) {
                    editParkingSpace(editButton.dataset.id);
                }

                if (deleteButton) {
                    deleteParkingSpace(deleteButton.dataset.id);
                }
            });

        form.addEventListener("submit", saveParkingSpace);
    }


    /* ========================================
    OPEN AND CLOSE MODAL
    ======================================== */

    function openParkingModal(space = null) {
        const form = document.getElementById("parkingForm");

        form.reset();

        document.getElementById("originalSpaceId").value =
            space ? space.id : "";

        document.getElementById("parkingModalTitle").textContent =
            space ? "Edit Parking Space" : "Add Parking Space";

        document.getElementById("spaceId").value =
            space ? space.id : "";

        document.getElementById("spaceLocation").value =
            space ? space.location : "";

        document.getElementById("spaceType").value =
            space ? space.type : "Regular";

        document.getElementById("spaceStatus").value =
            space ? space.status : "Available";

        document.getElementById("parkingFormError").hidden = true;

        const modal = document.getElementById("parkingModal");
        modal.hidden = false;

        document.getElementById("spaceId").focus();
    }


    function closeParkingModal() {
        const modal = document.getElementById("parkingModal");

        if (modal) {
            modal.hidden = true;
        }
    }


    /* ========================================
    ADD OR EDIT PARKING SPACE
    ======================================== */

    function saveParkingSpace(event) {
        event.preventDefault();

        const originalId =
            document.getElementById("originalSpaceId").value;

        const id = document
            .getElementById("spaceId")
            .value
            .trim()
            .toUpperCase();

        const location = document
            .getElementById("spaceLocation")
            .value
            .trim();

        const type =
            document.getElementById("spaceType").value;

        const status =
            document.getElementById("spaceStatus").value;

        const errorElement =
            document.getElementById("parkingFormError");

        const duplicate = parkingSpaces.some(space =>
            space.id.toLowerCase() === id.toLowerCase() &&
            space.id !== originalId
        );

        if (duplicate) {
            errorElement.textContent =
                "This parking space ID already exists.";

            errorElement.hidden = false;
            return;
        }

        const allowedStatuses = [
            "Available",
            "Reserved",
            "Occupied",
            "Unavailable"
        ];

        if (!allowedStatuses.includes(status)) {
            errorElement.textContent = "Please select a valid status.";
            errorElement.hidden = false;
            return;
        }

        if (originalId) {
            const index = parkingSpaces.findIndex(
                space => space.id === originalId
            );

            if (index !== -1) {
                parkingSpaces[index] = {
                    id,
                    location,
                    type,
                    status
                };
            }
        } else {
            parkingSpaces.push({
                id,
                location,
                type,
                status
            });
        }

        closeParkingModal();
        renderParkingPage();
    }


    /* ========================================
    EDIT PARKING SPACE
    ======================================== */

    function editParkingSpace(id) {
        const space = parkingSpaces.find(
            item => item.id === id
        );

        if (!space) return;

        openParkingModal(space);
    }


    /* ========================================
    DELETE PARKING SPACE
    ======================================== */

    function deleteParkingSpace(id) {
        const space = parkingSpaces.find(
            item => item.id === id
        );

        if (!space) return;

        const confirmed = confirm(
            `Are you sure you want to delete parking space ${id}?`
        );

        if (!confirmed) return;

        parkingSpaces = parkingSpaces.filter(
            item => item.id !== id
        );

        renderParkingPage();
    }


    /* ========================================
    ACTIVITY LOGS PAGE
    ======================================== */

    function renderLogsPage() {
        pageContent.innerHTML = `
            <div class="content-card">
                <div class="section-heading">
                    <div>
                        <h3>Activity History</h3>
                        <p>View and monitor activities recorded in the system.</p>
                    </div>
                </div>

                <div class="logs-toolbar">
                    <input
                        type="search"
                        id="logSearch"
                        placeholder="Search activities or users..."
                        aria-label="Search activity logs"
                    >

                    <select id="logFilter" aria-label="Filter activity type">
                        <option value="all">All Activities</option>
                        <option value="Reservation">Reservations</option>
                        <option value="Parking Space">Parking Spaces</option>
                        <option value="User">Users</option>
                    </select>
                </div>

                <div class="table-wrapper">
                    <table class="logs-table">
                        <thead>
                            <tr>
                                <th>Date & Time</th>
                                <th>User</th>
                                <th>Activity</th>
                                <th>Details</th>
                            </tr>
                        </thead>

                        <tbody id="logsTableBody"></tbody>
                    </table>
                </div>

                <p id="logsEmpty" class="logs-empty" hidden>
                    No activity records found.
                </p>
            </div>
        `;

        document.getElementById("logSearch")
            .addEventListener("input", renderActivityLogs);

        document.getElementById("logFilter")
            .addEventListener("change", renderActivityLogs);

        renderActivityLogs();
    }


    function renderActivityLogs() {
        const tableBody = document.getElementById("logsTableBody");

        if (!tableBody) return;

        const search = document
            .getElementById("logSearch")
            .value
            .toLowerCase()
            .trim();

        const filter = document.getElementById("logFilter").value;

        const filteredLogs = activityLogs.filter(log => {
            const matchesSearch = [
                log.date,
                log.user,
                log.activity,
                log.details
            ].some(value => value.toLowerCase().includes(search));

            const matchesFilter =
                filter === "all" || log.activity === filter;

            return matchesSearch && matchesFilter;
        });

        tableBody.innerHTML = "";

        filteredLogs.forEach(log => {
            const row = document.createElement("tr");

            [
                log.date,
                log.user,
                log.activity,
                log.details
            ].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            tableBody.appendChild(row);
        });

        document.getElementById("logsEmpty").hidden =
            filteredLogs.length > 0;
    }


    /* ========================================
    PLACEHOLDER PAGES
    ======================================== */

    function renderPlaceholder(pageInfo) {
        pageContent.innerHTML = `
            <div class="content-card">
                <div class="section-heading">
                    <div>
                        <h3>${escapeHTML(pageInfo.title)}</h3>
                        <p>${escapeHTML(pageInfo.subtitle)}</p>
                    </div>
                </div>

                <p style="color:#7b857e;font-size:13px;line-height:1.8;">
                    This section is ready for development.
                    We will add its forms, tables, and functionality next.
                </p>
            </div>
        `;
    }


    /* ========================================
    RESERVATION SUBMENU
    ======================================== */

    reservationToggle.addEventListener("click", () => {
        const isOpen =
            reservationSubmenu.classList.toggle("show");

        reservationToggle.classList.toggle("open", isOpen);

        reservationToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    });


    /* ========================================
    MAIN MENU EVENTS
    ======================================== */

    document.querySelectorAll(".menu-item[data-page]")
        .forEach(item => {
            item.addEventListener("click", event => {
                event.preventDefault();
                showPage(item.dataset.page);
            });
        });


    /* ========================================
    SUBMENU EVENTS
    ======================================== */

    document.querySelectorAll(".submenu-item[data-page]")
        .forEach(item => {
            item.addEventListener("click", event => {
                event.preventDefault();

                reservationSubmenu.classList.add("show");
                reservationToggle.classList.add("open");

                reservationToggle.setAttribute(
                    "aria-expanded",
                    "true"
                );

                showPage(item.dataset.page);
            });
        });


    /* ========================================
    QUICK ACCESS EVENTS
    ======================================== */

    pageContent.addEventListener("click", event => {
        const button = event.target.closest(
            ".quick-access-item[data-page]"
        );

        if (!button) return;

        showPage(button.dataset.page);
    });


    /* ==========================================
    MANUAL RESERVATIONS
    Add this section at the END of script.js
    ========================================== */

    let manualReservations = [
        {
            id: "RES-1001",
            customer: "Juan Dela Cruz",
            contact: "09123456789",
            spaceId: "P01",
            date: "2026-10-27",
            startTime: "08:00",
            endTime: "10:00",
            status: "Confirmed"
        },
        {
            id: "RES-1002",
            customer: "Maria Santos",
            contact: "09987654321",
            spaceId: "P02",
            date: "2026-10-27",
            startTime: "13:00",
            endTime: "15:00",
            status: "Confirmed"
        }
    ];

    let editingReservationId = null;

    // Safely display user-entered text in HTML.
    function escapeReservationText(value) {
        return String(value ?? "").replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);
    }

    // Supports common property names in the existing parking-space objects.
    function getReservationSpaceId(space) {
        return String(
            space.code ??
            space.spaceId ??
            space.name ??
            space.id ??
            ""
        );
    }

    function getReservationSpaceLabel(space) {
        const id = getReservationSpaceId(space);
        const location = space.location ?? space.area ?? "";
        return location && String(location) !== id
            ? `${id} - ${location}`
            : id;
    }

    function getReservationSpaceOptions(selectedSpaceId = "") {
        if (typeof parkingSpaces === "undefined" || !Array.isArray(parkingSpaces)) {
            return `<option value="">No parking spaces found</option>`;
        }

        const usableSpaces = parkingSpaces.filter(space => {
            const status = String(space.status ?? "Available").toLowerCase();

            // Exclude spaces explicitly marked unavailable for use.
            return !["maintenance", "inactive", "disabled"].includes(status);
        });

        if (usableSpaces.length === 0) {
            return `<option value="">No usable parking spaces</option>`;
        }

        return usableSpaces.map(space => {
            const id = getReservationSpaceId(space);
            const selected = id === String(selectedSpaceId) ? "selected" : "";

            return `
                <option value="${escapeReservationText(id)}" ${selected}>
                    ${escapeReservationText(getReservationSpaceLabel(space))}
                </option>
            `;
        }).join("");
    }

    function renderManualReservations() {
        const page = document.getElementById("pageContent");
        if (!page) return;

        const total = manualReservations.length;
        const confirmed = manualReservations.filter(r => r.status === "Confirmed").length;
        const completed = manualReservations.filter(r => r.status === "Completed").length;
        const cancelled = manualReservations.filter(r => r.status === "Cancelled").length;

        page.innerHTML = `
            <div class="manual-reservations-page">
                <div class="reservation-stats">
                    <div class="reservation-stat-card">
                        <span>Total Reservations</span>
                        <strong>${total}</strong>
                    </div>
                    <div class="reservation-stat-card">
                        <span>Confirmed</span>
                        <strong>${confirmed}</strong>
                    </div>
                    <div class="reservation-stat-card">
                        <span>Completed</span>
                        <strong>${completed}</strong>
                    </div>
                    <div class="reservation-stat-card">
                        <span>Cancelled</span>
                        <strong>${cancelled}</strong>
                    </div>
                </div>

                <section class="content-card">
                    <div class="section-heading manual-reservation-heading">
                        <div>
                            <h2>Manual Reservations</h2>
                            <p>Create and manage reservations made by the administrator.</p>
                        </div>
                        <button class="reservation-primary-btn"
                            onclick="openReservationForm()">
                            + Add Reservation
                        </button>
                    </div>

                    <div class="manual-reservation-toolbar">
                        <input
                            type="search"
                            id="reservationSearch"
                            placeholder="Search name, reservation ID, or parking space..."
                            oninput="filterManualReservations()"
                            aria-label="Search reservations"
                        >

                        <select id="reservationStatusFilter"
                            onchange="filterManualReservations()"
                            aria-label="Filter by reservation status">
                            <option value="">All Statuses</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div class="manual-reservation-table-wrap">
                        <table class="manual-reservation-table">
                            <thead>
                                <tr>
                                    <th>Reservation ID</th>
                                    <th>User</th>
                                    <th>Parking Space</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="manualReservationsBody"></tbody>
                        </table>
                    </div>

                    <p class="reservation-table-note" id="reservationResultCount"></p>
                </section>
            </div>

            <div class="reservation-modal" id="reservationModal" hidden>
                <div class="reservation-modal-backdrop"
                    onclick="closeReservationForm()"></div>

                <section class="reservation-modal-card"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="reservationFormTitle">

                    <div class="reservation-modal-heading">
                        <div>
                            <h2 id="reservationFormTitle">Add Reservation</h2>
                            <p>Enter the user's reservation details below.</p>
                        </div>
                        <button type="button" class="reservation-close-btn"
                            onclick="closeReservationForm()"
                            aria-label="Close form">&times;</button>
                    </div>

                    <form id="manualReservationForm"
                        onsubmit="saveManualReservation(event)">

                        <label for="reservationCustomer">User's Full Name</label>
                        <input id="reservationCustomer" name="customer"
                            type="text" maxlength="100" required
                            placeholder="Enter full name">

                        <label for="reservationContact">Contact Number</label>
                        <input id="reservationContact" name="contact"
                            type="tel" maxlength="30" required
                            placeholder="Enter contact number">

                        <label for="reservationSpace">Parking Space</label>
                        <select id="reservationSpace" name="spaceId" required>
                            ${getReservationSpaceOptions()}
                        </select>

                        <div class="reservation-form-row">
                            <div>
                                <label for="reservationDate">Reservation Date</label>
                                <input id="reservationDate" name="date"
                                    type="date" required>
                            </div>
                        </div>

                        <div class="reservation-form-row">
                            <div>
                                <label for="reservationStart">Start Time</label>
                                <input id="reservationStart" name="startTime"
                                    type="time" required>
                            </div>
                            <div>
                                <label for="reservationEnd">End Time</label>
                                <input id="reservationEnd" name="endTime"
                                    type="time" required>
                            </div>
                        </div>

                        <p id="reservationFormError"
                            class="reservation-form-error"
                            role="alert"></p>

                        <div class="reservation-form-actions">
                            <button type="button" class="reservation-secondary-btn"
                                onclick="closeReservationForm()">Cancel</button>
                            <button type="submit" class="reservation-primary-btn">
                                Save Reservation
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        `;

        filterManualReservations();
    }

    function filterManualReservations() {
        const body = document.getElementById("manualReservationsBody");
        if (!body) return;

        const search = (
            document.getElementById("reservationSearch")?.value ?? ""
        ).trim().toLowerCase();

        const statusFilter =
            document.getElementById("reservationStatusFilter")?.value ?? "";

        const filtered = manualReservations.filter(reservation => {
            const searchable = [
                reservation.id,
                reservation.customer,
                reservation.contact,
                reservation.spaceId,
                reservation.date
            ].join(" ").toLowerCase();

            return searchable.includes(search) &&
                (!statusFilter || reservation.status === statusFilter);
        });

        if (filtered.length === 0) {
            body.innerHTML = `
                <tr>
                    <td colspan="7" class="reservation-empty-state">
                        No reservations found.
                    </td>
                </tr>
            `;
        } else {
            body.innerHTML = filtered.map(reservation => `
                <tr>
                    <td><strong>${escapeReservationText(reservation.id)}</strong></td>
                    <td>
                        <strong>${escapeReservationText(reservation.customer)}</strong>
                        <small class="reservation-contact">
                            ${escapeReservationText(reservation.contact)}
                        </small>
                    </td>
                    <td>${escapeReservationText(reservation.spaceId)}</td>
                    <td>${escapeReservationText(reservation.date)}</td>
                    <td>${escapeReservationText(reservation.startTime)}
                        – ${escapeReservationText(reservation.endTime)}</td>
                    <td>
                        <span class="reservation-status status-${reservation.status.toLowerCase()}">
                            ${escapeReservationText(reservation.status)}
                        </span>
                    </td>
                    <td>
                        <div class="reservation-row-actions">
                            <button class="reservation-action-btn"
                                onclick="editManualReservation('${escapeReservationText(reservation.id)}')">
                                Edit
                            </button>
                            ${
                                reservation.status !== "Cancelled" &&
                                reservation.status !== "Completed"
                                ? `<button class="reservation-action-btn reservation-cancel-action"
                                    onclick="cancelManualReservation('${escapeReservationText(reservation.id)}')">
                                    Cancel
                                </button>`
                                : ""
                            }
                        </div>
                    </td>
                </tr>
            `).join("");
        }

        const count = document.getElementById("reservationResultCount");
        if (count) {
            count.textContent = `Showing ${filtered.length} of ${manualReservations.length} reservations`;
        }

        // Refresh the summary numbers without rebuilding the page.
        const cards = document.querySelectorAll(".reservation-stat-card strong");
        if (cards.length >= 4) {
            cards[0].textContent = manualReservations.length;
            cards[1].textContent = manualReservations.filter(r => r.status === "Confirmed").length;
            cards[2].textContent = manualReservations.filter(r => r.status === "Completed").length;
            cards[3].textContent = manualReservations.filter(r => r.status === "Cancelled").length;
        }
    }

    function openReservationForm(reservation = null) {
        const modal = document.getElementById("reservationModal");
        const form = document.getElementById("manualReservationForm");
        if (!modal || !form) return;

        editingReservationId = reservation ? reservation.id : null;
        form.reset();

        document.getElementById("reservationFormTitle").textContent =
            reservation ? "Edit Reservation" : "Add Reservation";

        document.getElementById("reservationCustomer").value =
            reservation?.customer ?? "";
        document.getElementById("reservationContact").value =
            reservation?.contact ?? "";
        document.getElementById("reservationDate").value =
            reservation?.date ?? new Date().toLocaleDateString("en-CA");
        document.getElementById("reservationStart").value =
            reservation?.startTime ?? "";
        document.getElementById("reservationEnd").value =
            reservation?.endTime ?? "";

        const spaceSelect = document.getElementById("reservationSpace");
        spaceSelect.innerHTML = getReservationSpaceOptions(
            reservation?.spaceId ?? ""
        );

        if (reservation && !Array.from(spaceSelect.options).some(
            option => option.value === reservation.spaceId
        )) {
            spaceSelect.add(new Option(reservation.spaceId, reservation.spaceId));
            spaceSelect.value = reservation.spaceId;
        }

        document.getElementById("reservationFormError").textContent = "";
        modal.hidden = false;
        document.getElementById("reservationCustomer").focus();
    }

    function closeReservationForm() {
        const modal = document.getElementById("reservationModal");
        if (modal) modal.hidden = true;
        editingReservationId = null;
    }

    function editManualReservation(id) {
        const reservation = manualReservations.find(item => item.id === id);
        if (!reservation) return;

        if (reservation.status === "Cancelled" || reservation.status === "Completed") {
            alert("Cancelled or completed reservations cannot be edited.");
            return;
        }

        openReservationForm(reservation);
    }

    function saveManualReservation(event) {
        event.preventDefault();

        const error = document.getElementById("reservationFormError");
        error.textContent = "";

        const customer = document.getElementById("reservationCustomer").value.trim();
        const contact = document.getElementById("reservationContact").value.trim();
        const spaceId = document.getElementById("reservationSpace").value;
        const date = document.getElementById("reservationDate").value;
        const startTime = document.getElementById("reservationStart").value;
        const endTime = document.getElementById("reservationEnd").value;

        if (!customer || !contact || !spaceId || !date || !startTime || !endTime) {
            error.textContent = "Please complete all fields.";
            return;
        }

        if (startTime >= endTime) {
            error.textContent = "End time must be later than start time.";
            return;
        }

        const overlaps = manualReservations.some(reservation => {
            if (reservation.id === editingReservationId) return false;
            if (reservation.spaceId !== spaceId || reservation.date !== date) return false;
            if (["Cancelled", "Completed"].includes(reservation.status)) return false;

            // Two reservations overlap when each begins before the other ends.
            return startTime < reservation.endTime &&
                endTime > reservation.startTime;
        });

        if (overlaps) {
            error.textContent =
                "This parking space already has a reservation during that time. Choose another time or space.";
            return;
        }

        if (editingReservationId) {
            const index = manualReservations.findIndex(
                reservation => reservation.id === editingReservationId
            );

            if (index === -1) {
                error.textContent = "Reservation not found. Please refresh and try again.";
                return;
            }

            manualReservations[index] = {
                ...manualReservations[index],
                customer,
                contact,
                spaceId,
                date,
                startTime,
                endTime
            };
        } else {
            const nextNumber = manualReservations.reduce((max, reservation) => {
                const match = reservation.id.match(/^RES-(\d+)$/);
                return match ? Math.max(max, Number(match[1])) : max;
            }, 1000) + 1;

            manualReservations.unshift({
                id: `RES-${nextNumber}`,
                customer,
                contact,
                spaceId,
                date,
                startTime,
                endTime,
                status: "Confirmed"
            });
        }

        closeReservationForm();
        renderManualReservations();
    }

    function cancelManualReservation(id) {
        const reservation = manualReservations.find(item => item.id === id);
        if (!reservation) return;

        if (reservation.status === "Completed" || reservation.status === "Cancelled") {
            return;
        }

        const confirmed = window.confirm(
            `Cancel reservation ${reservation.id} for ${reservation.customer}?`
        );

        if (!confirmed) return;

        reservation.status = "Cancelled";
        renderManualReservations();
    }



    /* ==========================================
    REQUEST RESERVATIONS
    Add at the END of your existing script.js
    ========================================== */

    // Demo requests submitted by users.
    // Replace these examples with database records when a backend is added.
    let reservationRequests = [
        {
            id: "REQ-2001",
            customer: "Angela Reyes",
            contact: "09171234567",
            spaceId: "P03",
            date: "2026-10-27",
            startTime: "09:00",
            endTime: "11:00",
            submittedAt: "2026-10-26",
            status: "Pending"
        },
        {
            id: "REQ-2002",
            customer: "Mark Villanueva",
            contact: "09981234567",
            spaceId: "P04",
            date: "2026-10-28",
            startTime: "13:00",
            endTime: "15:00",
            submittedAt: "2026-10-26",
            status: "Pending"
        },
        {
            id: "REQ-2003",
            customer: "Sofia Garcia",
            contact: "09192345678",
            spaceId: "P01",
            date: "2026-10-27",
            startTime: "08:30",
            endTime: "09:30",
            submittedAt: "2026-10-26",
            status: "Pending"
        }
    ];

    function renderRequestReservations() {
        const page = document.getElementById("pageContent");
        if (!page) return;

        const pending = reservationRequests.filter(r => r.status === "Pending").length;
        const approved = reservationRequests.filter(r => r.status === "Approved").length;
        const rejected = reservationRequests.filter(r => r.status === "Rejected").length;

        page.innerHTML = `
            <div class="request-reservations-page">
                <div class="request-summary-grid">
                    <div class="request-summary-card">
                        <span>Total Requests</span>
                        <strong>${reservationRequests.length}</strong>
                    </div>
                    <div class="request-summary-card">
                        <span>Pending Review</span>
                        <strong>${pending}</strong>
                    </div>
                    <div class="request-summary-card">
                        <span>Approved</span>
                        <strong>${approved}</strong>
                    </div>
                    <div class="request-summary-card">
                        <span>Rejected</span>
                        <strong>${rejected}</strong>
                    </div>
                </div>

                <section class="content-card">
                    <div class="request-page-heading">
                        <div>
                            <h2>Request Reservations</h2>
                            <p>Review and manage reservation requests submitted by users.</p>
                        </div>
                    </div>

                    <div class="request-toolbar">
                        <input
                            type="search"
                            id="requestSearch"
                            placeholder="Search ID, user, or parking space..."
                            oninput="filterReservationRequests()"
                            aria-label="Search reservation requests"
                        >

                        <select
                            id="requestStatusFilter"
                            onchange="filterReservationRequests()"
                            aria-label="Filter request status">
                            <option value="">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    <div class="request-table-wrap">
                        <table class="request-table">
                            <thead>
                                <tr>
                                    <th>Request ID</th>
                                    <th>User Details</th>
                                    <th>Parking Space</th>
                                    <th>Requested Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="reservationRequestsBody"></tbody>
                        </table>
                    </div>

                    <p class="request-result-count" id="requestResultCount"></p>
                </section>
            </div>
        `;

        filterReservationRequests();
    }

    // Escape text before inserting user-provided data into HTML.
    function escapeRequestText(value) {
        return String(value ?? "").replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);
    }

    function filterReservationRequests() {
        const body = document.getElementById("reservationRequestsBody");
        if (!body) return;

        const search = (
            document.getElementById("requestSearch")?.value ?? ""
        ).trim().toLowerCase();

        const statusFilter =
            document.getElementById("requestStatusFilter")?.value ?? "";

        const filtered = reservationRequests.filter(request => {
            const searchable = [
                request.id,
                request.customer,
                request.contact,
                request.spaceId,
                request.date
            ].join(" ").toLowerCase();

            return searchable.includes(search) &&
                (!statusFilter || request.status === statusFilter);
        });

        if (filtered.length === 0) {
            body.innerHTML = `
                <tr>
                    <td colspan="7" class="request-empty-state">
                        No reservation requests found.
                    </td>
                </tr>
            `;
        } else {
            body.innerHTML = filtered.map(request => {
                const statusClass = request.status.toLowerCase();

                let actions = `<span class="request-no-action">No actions</span>`;

                if (request.status === "Pending") {
                    actions = `
                        <div class="request-actions">
                            <button class="request-approve-btn"
                                onclick="approveReservationRequest('${escapeRequestText(request.id)}')">
                                Approve
                            </button>
                            <button class="request-reject-btn"
                                onclick="rejectReservationRequest('${escapeRequestText(request.id)}')">
                                Reject
                            </button>
                        </div>
                    `;
                }

                return `
                    <tr>
                        <td><strong>${escapeRequestText(request.id)}</strong></td>
                        <td>
                            <strong>${escapeRequestText(request.customer)}</strong>
                            <small class="request-contact">
                                ${escapeRequestText(request.contact)}
                            </small>
                        </td>
                        <td>${escapeRequestText(request.spaceId)}</td>
                        <td>${escapeRequestText(request.date)}</td>
                        <td>
                            ${escapeRequestText(request.startTime)}
                            – ${escapeRequestText(request.endTime)}
                        </td>
                        <td>
                            <span class="request-status request-status-${statusClass}">
                                ${escapeRequestText(request.status)}
                            </span>
                        </td>
                        <td>${actions}</td>
                    </tr>
                `;
            }).join("");
        }

        const count = document.getElementById("requestResultCount");
        if (count) {
            count.textContent =
                `Showing ${filtered.length} of ${reservationRequests.length} requests`;
        }

        const cards = document.querySelectorAll(".request-summary-card strong");
        if (cards.length >= 4) {
            cards[0].textContent = reservationRequests.length;
            cards[1].textContent = reservationRequests.filter(r => r.status === "Pending").length;
            cards[2].textContent = reservationRequests.filter(r => r.status === "Approved").length;
            cards[3].textContent = reservationRequests.filter(r => r.status === "Rejected").length;
        }
    }

    // Check if a requested time conflicts with an existing reservation.
    function requestHasConflict(request) {
        if (typeof manualReservations === "undefined" ||
            !Array.isArray(manualReservations)) {
            return false;
        }

        return manualReservations.some(existing => {
            if (existing.spaceId !== request.spaceId) return false;
            if (existing.date !== request.date) return false;

            if (["Cancelled", "Completed"].includes(existing.status)) {
                return false;
            }

            // Adjacent bookings are allowed: 09:00–10:00 and 10:00–11:00.
            return request.startTime < existing.endTime &&
                request.endTime > existing.startTime;
        });
    }

    function approveReservationRequest(id) {
        const request = reservationRequests.find(item => item.id === id);
        if (!request || request.status !== "Pending") return;

        if (request.startTime >= request.endTime) {
            alert("This request has an invalid time range. It cannot be approved.");
            return;
        }

        // Verify that the parking space still exists and can be used.
        if (typeof parkingSpaces !== "undefined" && Array.isArray(parkingSpaces)) {
            const spaceExists = parkingSpaces.some(space => {
                const spaceId = String(
                    space.code ?? space.spaceId ?? space.name ?? space.id ?? ""
                );
                const spaceStatus = String(space.status ?? "Available").toLowerCase();

                return spaceId === request.spaceId &&
                    !["maintenance", "inactive", "disabled"].includes(spaceStatus);
            });

            if (!spaceExists) {
                alert("The requested parking space is unavailable or no longer exists.");
                return;
            }
        }

        if (requestHasConflict(request)) {
            alert(
                "Cannot approve this request. The parking space already has a reservation during the requested time."
            );
            return;
        }

        const confirmed = window.confirm(
            `Approve request ${request.id} for ${request.customer}?\n\n` +
            `Space: ${request.spaceId}\n` +
            `Date: ${request.date}\n` +
            `Time: ${request.startTime}–${request.endTime}`
        );

        if (!confirmed) return;

        // Add it to the shared manual reservation list so the conflict
        // check also sees this approved booking.
        if (typeof manualReservations === "undefined" ||
            !Array.isArray(manualReservations)) {
            alert("The reservation list is unavailable. Please check the Manual Reservations setup.");
            return;
        }

        // Recheck immediately before saving.
        if (requestHasConflict(request)) {
            alert("The parking space has just been reserved for that time. Please review the request again.");
            return;
        }

        manualReservations.unshift({
            id: `RES-${Date.now()}`,
            customer: request.customer,
            contact: request.contact,
            spaceId: request.spaceId,
            date: request.date,
            startTime: request.startTime,
            endTime: request.endTime,
            status: "Confirmed"
        });

        request.status = "Approved";
        renderRequestReservations();
        alert(`Request ${request.id} approved successfully.`);
    }

    function rejectReservationRequest(id) {
        const request = reservationRequests.find(item => item.id === id);
        if (!request || request.status !== "Pending") return;

        const confirmed = window.confirm(
            `Reject request ${request.id} from ${request.customer}?`
        );

        if (!confirmed) return;

        request.status = "Rejected";
        renderRequestReservations();
        alert(`Request ${request.id} has been rejected.`);
    }


    /* ==========================================
    CANCEL RESERVATIONS PAGE
    ========================================== */

    function renderCancellationReservations() {
        const page = document.getElementById("pageContent");

        if (!page) return;

        const total = manualReservations.length;

        const confirmed = manualReservations.filter(
            reservation => reservation.status === "Confirmed"
        ).length;

        const cancelled = manualReservations.filter(
            reservation => reservation.status === "Cancelled"
        ).length;

        const completed = manualReservations.filter(
            reservation => reservation.status === "Completed"
        ).length;

        page.innerHTML = `
            <div class="cancellation-page">

                <!-- SUMMARY CARDS -->
                <div class="cancellation-summary">

                    <div class="cancellation-stat-card">
                        <div class="cancellation-stat-icon green">
                            <i class="fa-solid fa-calendar-check"></i>
                        </div>

                        <span>Total Reservations</span>
                        <strong>${total}</strong>
                        <small>All recorded reservations</small>
                    </div>

                    <div class="cancellation-stat-card">
                        <div class="cancellation-stat-icon blue">
                            <i class="fa-solid fa-circle-check"></i>
                        </div>

                        <span>Confirmed</span>
                        <strong>${confirmed}</strong>
                        <small>Active reservations</small>
                    </div>

                    <div class="cancellation-stat-card">
                        <div class="cancellation-stat-icon red">
                            <i class="fa-solid fa-calendar-xmark"></i>
                        </div>

                        <span>Cancelled</span>
                        <strong>${cancelled}</strong>
                        <small>Cancelled reservations</small>
                    </div>

                    <div class="cancellation-stat-card">
                        <div class="cancellation-stat-icon orange">
                            <i class="fa-solid fa-flag-checkered"></i>
                        </div>

                        <span>Completed</span>
                        <strong>${completed}</strong>
                        <small>Finished reservations</small>
                    </div>

                </div>

                <!-- CANCELLATION TABLE -->
                <section class="content-card cancellation-content-card">

                    <div class="cancellation-heading">
                        <div>
                            <h2>Cancel Reservations</h2>

                            <p>
                                Review reservation records and cancel active
                                reservations when necessary.
                            </p>
                        </div>

                        <div class="cancellation-heading-icon">
                            <i class="fa-solid fa-calendar-minus"></i>
                        </div>
                    </div>

                    <!-- SEARCH AND FILTER -->
                    <div class="cancellation-toolbar">

                        <div class="cancellation-search">
                            <i class="fa-solid fa-magnifying-glass"></i>

                            <input
                                type="search"
                                id="cancellationSearch"
                                placeholder="Search reservation, student, or space..."
                                aria-label="Search reservations"
                            >
                        </div>

                        <select
                            id="cancellationStatusFilter"
                            aria-label="Filter reservations by status"
                        >
                            <option value="">All Statuses</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Completed">Completed</option>
                        </select>

                    </div>

                    <!-- TABLE -->
                    <div class="cancellation-table-wrap">

                        <table class="cancellation-table">

                            <thead>
                                <tr>
                                    <th>Reservation ID</th>
                                    <th>Student Details</th>
                                    <th>Parking Space</th>
                                    <th>Reservation Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody id="cancellationTableBody"></tbody>

                        </table>

                    </div>

                    <div class="cancellation-table-footer">
                        <span id="cancellationResultCount">
                            Showing 0 reservations
                        </span>

                        <span class="cancellation-footer-note">
                            <i class="fa-solid fa-circle-info"></i>
                            Completed reservations cannot be cancelled.
                        </span>
                    </div>

                </section>

            </div>
        `;

        // Connect search and filter controls.
        document.getElementById("cancellationSearch")
            .addEventListener("input", filterCancellationReservations);

        document.getElementById("cancellationStatusFilter")
            .addEventListener("change", filterCancellationReservations);

        filterCancellationReservations();
    }


    /* FILTER RESERVATIONS */

    function filterCancellationReservations() {
        const tableBody = document.getElementById(
            "cancellationTableBody"
        );

        if (!tableBody) return;

        const search = document.getElementById(
            "cancellationSearch"
        ).value.trim().toLowerCase();

        const statusFilter = document.getElementById(
            "cancellationStatusFilter"
        ).value;

        const filtered = manualReservations.filter(reservation => {
            const searchable = [
                reservation.id,
                reservation.customer,
                reservation.contact,
                reservation.spaceId,
                reservation.date,
                reservation.status
            ].join(" ").toLowerCase();

            const matchesSearch = searchable.includes(search);

            const matchesStatus =
                !statusFilter || reservation.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

        if (filtered.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7">
                        <div class="cancellation-empty-state">
                            <div class="cancellation-empty-icon">
                                <i class="fa-solid fa-calendar-xmark"></i>
                            </div>

                            <h3>No Reservations Found</h3>

                            <p>
                                No reservations match your search or selected filter.
                            </p>
                        </div>
                    </td>
                </tr>
            `;
        } else {
            tableBody.innerHTML = filtered.map(reservation => {
                const statusClass = reservation.status.toLowerCase();

                let action = `
                    <span class="cancellation-action-disabled">
                        No action
                    </span>
                `;

                if (reservation.status === "Confirmed") {
                    action = `
                        <button
                            type="button"
                            class="cancellation-action-button"
                            onclick="cancelReservationFromCancellationPage(
                                '${escapeReservationText(reservation.id)}'
                            )"
                        >
                            <i class="fa-solid fa-ban"></i>
                            Cancel
                        </button>
                    `;
                } else if (reservation.status === "Cancelled") {
                    action = `
                        <span class="cancellation-completed-action">
                            <i class="fa-solid fa-check"></i>
                            Cancelled
                        </span>
                    `;
                }

                return `
                    <tr>
                        <td>
                            <strong class="cancellation-reservation-id">
                                ${escapeReservationText(reservation.id)}
                            </strong>
                        </td>

                        <td>
                            <div class="cancellation-student">
                                <div class="cancellation-student-avatar">
                                    <i class="fa-solid fa-user"></i>
                                </div>

                                <div>
                                    <strong>
                                        ${escapeReservationText(reservation.customer)}
                                    </strong>

                                    <small>
                                        ${escapeReservationText(reservation.contact)}
                                    </small>
                                </div>
                            </div>
                        </td>

                        <td>
                            <span class="cancellation-space">
                                <i class="fa-solid fa-square-parking"></i>
                                ${escapeReservationText(reservation.spaceId)}
                            </span>
                        </td>

                        <td>
                            ${escapeReservationText(reservation.date)}
                        </td>

                        <td>
                            ${escapeReservationText(reservation.startTime)}
                            – ${escapeReservationText(reservation.endTime)}
                        </td>

                        <td>
                            <span class="cancellation-status status-${statusClass}">
                                ${escapeReservationText(reservation.status)}
                            </span>
                        </td>

                        <td>${action}</td>
                    </tr>
                `;
            }).join("");
        }

        // Update the result count.
        const resultCount = document.getElementById(
            "cancellationResultCount"
        );

        if (resultCount) {
            resultCount.textContent =
                `Showing ${filtered.length} of ${manualReservations.length} reservations`;
        }

        // Refresh the summary cards.
        const cards = document.querySelectorAll(
            ".cancellation-stat-card > strong"
        );

        if (cards.length === 4) {
            cards[0].textContent = manualReservations.length;

            cards[1].textContent = manualReservations.filter(
                reservation => reservation.status === "Confirmed"
            ).length;

            cards[2].textContent = manualReservations.filter(
                reservation => reservation.status === "Cancelled"
            ).length;

            cards[3].textContent = manualReservations.filter(
                reservation => reservation.status === "Completed"
            ).length;
        }
    }


    /* CANCEL A RESERVATION */

    function cancelReservationFromCancellationPage(id) {
        const reservation = manualReservations.find(
            item => item.id === id
        );

        if (!reservation) {
            alert("Reservation not found.");
            return;
        }

        if (reservation.status !== "Confirmed") {
            alert("Only confirmed reservations can be cancelled.");
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to cancel reservation ${reservation.id}?\n\n` +
            `Student: ${reservation.customer}\n` +
            `Parking Space: ${reservation.spaceId}\n` +
            `Date: ${reservation.date}\n\n` +
            `This action will change the reservation status to Cancelled.`
        );

        if (!confirmed) return;

        reservation.status = "Cancelled";

        // Refresh the current cancellation page.
        renderCancellationReservations();

        alert(
            `Reservation ${reservation.id} has been cancelled successfully.`
        );
    }

    /* ========================================
    USER MANAGEMENT PAGE
    ======================================== */

    function renderUsersPage() {
        const activeUsers = users.filter(
            user => user.status === "Active"
        ).length;

        const inactiveUsers = users.filter(
            user => user.status === "Inactive"
        ).length;

        const students = users.filter(
            user => user.role === "Student"
        ).length;

        pageContent.innerHTML = `
            <div class="users-page">

                <!-- SUMMARY CARDS -->
                <div class="users-summary">

                    <div class="users-stat-card">
                        <div class="users-stat-icon green">
                            <i class="fa-solid fa-users"></i>
                        </div>
                        <span>Total Users</span>
                        <strong>${users.length}</strong>
                        <small>All registered accounts</small>
                    </div>

                    <div class="users-stat-card">
                        <div class="users-stat-icon blue">
                            <i class="fa-solid fa-user-graduate"></i>
                        </div>
                        <span>Students</span>
                        <strong>${students}</strong>
                        <small>Registered student accounts</small>
                    </div>

                    <div class="users-stat-card">
                        <div class="users-stat-icon green">
                            <i class="fa-solid fa-user-check"></i>
                        </div>
                        <span>Active Users</span>
                        <strong>${activeUsers}</strong>
                        <small>Accounts currently active</small>
                    </div>

                    <div class="users-stat-card">
                        <div class="users-stat-icon red">
                            <i class="fa-solid fa-user-slash"></i>
                        </div>
                        <span>Inactive Users</span>
                        <strong>${inactiveUsers}</strong>
                        <small>Deactivated accounts</small>
                    </div>

                </div>

                <!-- USER TABLE -->
                <section class="content-card users-content-card">

                    <div class="users-heading">
                        <div>
                            <h2>User Management</h2>
                            <p>
                                View registered users and manage their account status.
                            </p>
                        </div>

                        <div class="users-heading-icon">
                            <i class="fa-solid fa-user-gear"></i>
                        </div>
                    </div>

                    <!-- SEARCH AND FILTER -->
                    <div class="users-toolbar">

                        <div class="users-search">
                            <i class="fa-solid fa-magnifying-glass"></i>

                            <input
                                type="search"
                                id="usersSearch"
                                placeholder="Search name, student ID, or email..."
                                aria-label="Search users"
                            >
                        </div>

                        <select id="usersStatusFilter"
                            aria-label="Filter users by status">
                            <option value="">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>

                        <select id="usersRoleFilter"
                            aria-label="Filter users by role">
                            <option value="">All Roles</option>
                            <option value="Student">Student</option>
                            <option value="Administrator">Administrator</option>
                        </select>

                    </div>

                    <!-- USERS TABLE -->
                    <div class="users-table-wrap">

                        <table class="users-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Student ID</th>
                                    <th>Contact</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody id="usersTableBody"></tbody>
                        </table>

                    </div>

                    <div class="users-table-footer">
                        <span id="usersResultCount">
                            Showing 0 users
                        </span>

                        <span class="users-footer-note">
                            <i class="fa-solid fa-circle-info"></i>
                            Account changes apply to this demo session.
                        </span>
                    </div>

                </section>

            </div>
        `;

        document.getElementById("usersSearch")
            .addEventListener("input", filterUsers);

        document.getElementById("usersStatusFilter")
            .addEventListener("change", filterUsers);

        document.getElementById("usersRoleFilter")
            .addEventListener("change", filterUsers);

        filterUsers();
    }


    /* ========================================
    FILTER USERS
    ======================================== */

    function filterUsers() {
        const tableBody = document.getElementById("usersTableBody");

        if (!tableBody) return;

        const search = document.getElementById("usersSearch")
            .value.trim().toLowerCase();

        const statusFilter =
            document.getElementById("usersStatusFilter").value;

        const roleFilter =
            document.getElementById("usersRoleFilter").value;

        const filteredUsers = users.filter(user => {
            const searchable = [
                user.id,
                user.name,
                user.studentId,
                user.email,
                user.contact,
                user.role,
                user.status
            ].join(" ").toLowerCase();

            return searchable.includes(search) &&
                (!statusFilter || user.status === statusFilter) &&
                (!roleFilter || user.role === roleFilter);
        });

        if (filteredUsers.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="users-empty-state">
                            <i class="fa-solid fa-users"></i>
                            <h3>No Users Found</h3>
                            <p>
                                No accounts match your search or selected filters.
                            </p>
                        </div>
                    </td>
                </tr>
            `;
        } else {
            tableBody.innerHTML = filteredUsers.map(user => {
                const statusClass = user.status.toLowerCase();

                const actionLabel = user.status === "Active"
                    ? "Deactivate"
                    : "Activate";

                const actionClass = user.status === "Active"
                    ? "users-deactivate-btn"
                    : "users-activate-btn";

                const actionIcon = user.status === "Active"
                    ? "fa-user-slash"
                    : "fa-user-check";

                return `
                    <tr>
                        <td>
                            <div class="users-user-info">
                                <div class="users-avatar">
                                    <i class="fa-solid fa-user"></i>
                                </div>

                                <div class="users-user-details">
                                    <strong>${escapeHTML(user.name)}</strong>
                                    <small>${escapeHTML(user.email)}</small>
                                </div>
                            </div>
                        </td>

                        <td>
                            ${escapeHTML(user.studentId || "—")}
                        </td>

                        <td>
                            ${escapeHTML(user.contact || "—")}
                        </td>

                        <td>
                            <span class="users-role">
                                ${escapeHTML(user.role)}
                            </span>
                        </td>

                        <td>
                            <span class="users-status status-${statusClass}">
                                <span class="users-status-dot"></span>
                                ${escapeHTML(user.status)}
                            </span>
                        </td>

                        <td>
                            <button
                                type="button"
                                class="users-action-btn ${actionClass}"
                                data-user-id="${escapeHTML(user.id)}"
                                title="${actionLabel} ${escapeHTML(user.name)}"
                            >
                                <i class="fa-solid ${actionIcon}"></i>
                                ${actionLabel}
                            </button>
                        </td>
                    </tr>
                `;
            }).join("");
        }

        const resultCount = document.getElementById("usersResultCount");

        if (resultCount) {
            resultCount.textContent =
                `Showing ${filteredUsers.length} of ${users.length} users`;
        }

        // Update summary cards.
        const cards = document.querySelectorAll(".users-stat-card > strong");

        if (cards.length === 4) {
            cards[0].textContent = users.length;

            cards[1].textContent = users.filter(
                user => user.role === "Student"
            ).length;

            cards[2].textContent = users.filter(
                user => user.status === "Active"
            ).length;

            cards[3].textContent = users.filter(
                user => user.status === "Inactive"
            ).length;
        }
    }


    /* ========================================
    ACTIVATE OR DEACTIVATE USER
    ======================================== */

    function toggleUserStatus(id) {
        const user = users.find(item => item.id === id);

        if (!user) {
            alert("User account not found.");
            return;
        }

        const newStatus = user.status === "Active"
            ? "Inactive"
            : "Active";

        const confirmed = window.confirm(
            `Are you sure you want to ${newStatus === "Active" ? "activate" : "deactivate"} ` +
            `${user.name}'s account?`
        );

        if (!confirmed) return;

        user.status = newStatus;

        filterUsers();

        alert(
            `${user.name}'s account is now ${user.status.toLowerCase()}.`
        );
    }


    /* ========================================
    USER TABLE EVENTS
    ======================================== */

    // Event delegation lets the buttons keep working after table updates.
    pageContent.addEventListener("click", event => {
        const button = event.target.closest(".users-action-btn");

        if (!button) return;

        toggleUserStatus(button.dataset.userId);
    });

/* ========================================
   SETTINGS PAGE
======================================== */

let parkEaseSettings = {
    adminName: "Administrator",
    adminEmail: "admin@parkease.com",
    adminContact: "",
    systemName: "ParkEase",
    theme: "light",
    reservationDuration: "2",
    advanceBookingDays: "7"
};

function renderSettingsPage() {
    pageContent.innerHTML = `
        <div class="settings-page">

            <div class="settings-heading">
                <h2>System Settings</h2>
                <p>Manage your administrator profile and system preferences.</p>
            </div>

            <form id="settingsForm">

                <section class="settings-card">
                    <h3>Administrator Profile</h3>
                    <p>Update the administrator's contact information.</p>

                    <div class="settings-form-grid">
                        <div class="settings-field">
                            <label for="adminName">Full Name</label>
                            <input type="text" id="adminName"
                                value="${escapeHTML(parkEaseSettings.adminName)}"
                                required>
                        </div>

                        <div class="settings-field">
                            <label for="adminEmail">Email Address</label>
                            <input type="email" id="adminEmail"
                                value="${escapeHTML(parkEaseSettings.adminEmail)}"
                                required>
                        </div>

                        <div class="settings-field">
                            <label for="adminContact">Contact Number</label>
                            <input type="tel" id="adminContact"
                                value="${escapeHTML(parkEaseSettings.adminContact)}">
                        </div>
                    </div>
                </section>

                <section class="settings-card">
                    <h3>System Preferences</h3>
                    <p>Customize the basic system information.</p>

                    <div class="settings-form-grid">
                        <div class="settings-field">
                            <label for="systemName">System Name</label>
                            <input type="text" id="systemName"
                                value="${escapeHTML(parkEaseSettings.systemName)}"
                                required>
                        </div>

                        <div class="settings-field">
                            <label for="systemTheme">Preferred Theme</label>
                            <select id="systemTheme">
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section class="settings-card">
                    <h3>Reservation Settings</h3>
                    <p>Configure default reservation preferences.</p>

                    <div class="settings-form-grid">
                        <div class="settings-field">
                            <label for="reservationDuration">
                                Default Reservation Duration
                            </label>
                            <select id="reservationDuration">
                                <option value="1">1 hour</option>
                                <option value="2">2 hours</option>
                                <option value="3">3 hours</option>
                                <option value="4">4 hours</option>
                                <option value="8">8 hours</option>
                            </select>
                        </div>

                        <div class="settings-field">
                            <label for="advanceBookingDays">
                                Advance Booking Limit
                            </label>
                            <select id="advanceBookingDays">
                                <option value="1">1 day</option>
                                <option value="3">3 days</option>
                                <option value="7">7 days</option>
                                <option value="14">14 days</option>
                                <option value="30">30 days</option>
                            </select>
                        </div>
                    </div>
                </section>

                <div class="settings-actions">
                    <button type="reset" class="settings-reset-btn">
                        Reset Form
                    </button>

                    <button type="submit" class="settings-save-btn">
                        Save Changes
                    </button>
                </div>

                <p id="settingsMessage" class="settings-message"
                    role="status" aria-live="polite"></p>

            </form>
        </div>
    `;

    document.getElementById("systemTheme").value =
        parkEaseSettings.theme;

    document.getElementById("reservationDuration").value =
        parkEaseSettings.reservationDuration;

    document.getElementById("advanceBookingDays").value =
        parkEaseSettings.advanceBookingDays;

    document.getElementById("settingsForm")
        .addEventListener("submit", function(event) {
            event.preventDefault();

            parkEaseSettings.adminName =
                document.getElementById("adminName").value.trim();

            parkEaseSettings.adminEmail =
                document.getElementById("adminEmail").value.trim();

            parkEaseSettings.adminContact =
                document.getElementById("adminContact").value.trim();

            parkEaseSettings.systemName =
                document.getElementById("systemName").value.trim();

            parkEaseSettings.theme =
                document.getElementById("systemTheme").value;

            parkEaseSettings.reservationDuration =
                document.getElementById("reservationDuration").value;

            parkEaseSettings.advanceBookingDays =
                document.getElementById("advanceBookingDays").value;

            const message =
                document.getElementById("settingsMessage");

            message.textContent =
                "Settings saved successfully for this session.";

            message.classList.add("is-visible");
        });
}



    /* ========================================
    START APPLICATION
    ======================================== */

    showPage("home");
