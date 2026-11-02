 
const API_URL = "http://localhost:3000/employees";
 
const employeeTable = document.getElementById("employeeTable");
const searchInput = document.getElementById("searchInput");
const departmentFilter = document.getElementById("departmentFilter");
const statusFilter = document.getElementById("statusFilter");
const sortFilter = document.getElementById("sortFilter");
 
let employees = [];
 
document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
 
// Fetch employees
async function loadEmployees() {
    document.getElementById("loadingMessage").textContent =
        "Loading employees...";
 
    document.getElementById("errorMessage").textContent = "";
 
    try {
        const response = await fetch(API_URL);
 
        if (!response.ok) {
            throw new Error("Unable to fetch employees.");
        }
 
        employees = await response.json();
 
        populateDepartments();
        updateStats();
        applyFilters();
 
        document.getElementById("loadingMessage").textContent =
            `${employees.length} employee records loaded.`;
 
    } catch (error) {
        console.error(error);
 
        document.getElementById("loadingMessage").textContent = "";
 
        document.getElementById("errorMessage").textContent =
            "Backend connection failed. Please start JSON Server.";
 
        employeeTable.innerHTML =
            '<tr><td colspan="6">Unable to load employees.</td></tr>';
    }
}
 
// Populate department dropdown dynamically
function populateDepartments() {
    const currentValue = departmentFilter.value;
 
    const departments = [
        ...new Set(
            employees
                .map(employee => employee.department)
                .filter(Boolean)
        )
    ].sort((a, b) => a.localeCompare(b));
 
    departmentFilter.innerHTML =
        '<option value="">All Departments</option>';
 
    departments.forEach(department => {
        const option = document.createElement("option");
        option.value = department;
        option.textContent = department;
        departmentFilter.appendChild(option);
    });
 
    departmentFilter.value = departments.includes(currentValue)
        ? currentValue
        : "";
}
 
// Update summary cards
function updateStats() {
    document.getElementById("totalEmployees").textContent =
        employees.length;
 
    document.getElementById("activeEmployees").textContent =
        employees.filter(employee => employee.status === "Active").length;
 
    document.getElementById("totalDepartments").textContent =
        new Set(
            employees.map(employee => employee.department).filter(Boolean)
        ).size;
}
 
// Search, filter and sort
function applyFilters() {
    const searchValue = searchInput.value.trim().toLowerCase();
    const departmentValue = departmentFilter.value;
    const statusValue = statusFilter.value;
    const sortValue = sortFilter.value;
 
    let filteredEmployees = employees.filter(employee => {
        const matchesSearch =
            String(employee.name || "").toLowerCase().includes(searchValue) ||
            String(employee.email || "").toLowerCase().includes(searchValue);
 
        const matchesDepartment =
            !departmentValue || employee.department === departmentValue;
 
        const matchesStatus =
            !statusValue || employee.status === statusValue;
 
        return matchesSearch && matchesDepartment && matchesStatus;
    });
 
    // Sorting
    filteredEmployees.sort((a, b) => {
        switch (sortValue) {
            case "name-asc":
                return String(a.name || "").localeCompare(String(b.name || ""));
 
            case "name-desc":
                return String(b.name || "").localeCompare(String(a.name || ""));
 
            case "date-new":
                return String(b.joiningDate || "").localeCompare(String(a.joiningDate || ""));
 
            case "date-old":
                return String(a.joiningDate || "").localeCompare(String(b.joiningDate || ""));
 
            case "department-asc":
                return String(a.department || "").localeCompare(String(b.department || ""));
 
            case "department-desc":
                return String(b.department || "").localeCompare(String(a.department || ""));
 
            case "status-asc":
                return String(a.status || "").localeCompare(String(b.status || ""));
 
            case "status-desc":
                return String(b.status || "").localeCompare(String(a.status || ""));
 
            default:
                return 0;
        }
    });
 
    displayEmployees(filteredEmployees);
 
    document.getElementById("resultCount").textContent =
        `Showing ${filteredEmployees.length} of ${employees.length} employees`;
}
 
// Display employee table
function displayEmployees(list) {
    employeeTable.innerHTML = "";
 
    if (list.length === 0) {
        employeeTable.innerHTML = `
            <tr>
                <td colspan="6">No matching employees found.</td>
            </tr>
        `;
        return;
    }
 
    list.forEach(employee => {
        const row = document.createElement("tr");
 
        const values = [
            employee.id,
            employee.name,
            employee.email,
            employee.department,
            employee.joiningDate
        ];
 
        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value ?? "";
            row.appendChild(cell);
        });
 
        const statusCell = document.createElement("td");
        const badge = document.createElement("span");
 
        badge.textContent = employee.status || "Unknown";
        badge.className =
            "status " +
            (employee.status === "Active" ? "active" : "inactive");
 
        statusCell.appendChild(badge);
        row.appendChild(statusCell);
 
        employeeTable.appendChild(row);
    });
}
 
// Event listeners
searchInput.addEventListener("input", applyFilters);
departmentFilter.addEventListener("change", applyFilters);
statusFilter.addEventListener("change", applyFilters);
sortFilter.addEventListener("change", applyFilters);
 
// Reset filters
document.getElementById("resetBtn").addEventListener("click", () => {
    searchInput.value = "";
    departmentFilter.value = "";
    statusFilter.value = "";
    sortFilter.value = "name-asc";
 
    applyFilters();
});
 
// Refresh employee records
document.getElementById("refreshBtn").addEventListener("click", loadEmployees);
 
// Start application
loadEmployees();
 