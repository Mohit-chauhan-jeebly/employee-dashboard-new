 
const API_URL = "http://localhost:3000/employees";
 
const employeeTable = document.getElementById("employeeTable");
const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");
 
let employees = [];
 
document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
 
// Load employees from backend
async function loadEmployees() {
    loadingMessage.textContent = "Loading employees...";
    errorMessage.textContent = "";
 
    employeeTable.innerHTML = `
        <tr><td colspan="6">Loading employees...</td></tr>
    `;
 
    try {
        const response = await fetch(API_URL);
 
        if (!response.ok) {
            throw new Error("Unable to fetch employee records.");
        }
 
        employees = await response.json();
 
        displayEmployees();
        updateStats();
 
        loadingMessage.textContent = employees.length
            ? `${employees.length} employee records loaded.`
            : "No employee records found.";
 
    } catch (error) {
        console.error("Load Error:", error);
 
        loadingMessage.textContent = "";
        errorMessage.textContent =
            "Backend connection failed. Please start JSON Server.";
 
        employeeTable.innerHTML = `
            <tr><td colspan="6">Unable to load employees.</td></tr>
        `;
    }
}
 
// Display employee table
function displayEmployees() {
    employeeTable.innerHTML = "";
 
    if (employees.length === 0) {
        employeeTable.innerHTML = `
            <tr>
                <td colspan="6">No employees available.</td>
            </tr>
        `;
        return;
    }
 
    employees.forEach(employee => {
        const row = document.createElement("tr");
 
        const values = [
            employee.id,
            employee.name,
            employee.email,
            employee.department,
            employee.status
        ];
 
        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value ?? "";
            row.appendChild(cell);
        });
 
        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");
 
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
 
        deleteButton.addEventListener("click", () => {
            deleteEmployee(employee.id, employee.name);
        });
 
        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);
 
        const statusCell = row.children[4];
        const statusBadge = document.createElement("span");
 
        statusBadge.textContent = employee.status || "Unknown";
        statusBadge.className =
            "status " +
            (employee.status === "Active" ? "active" : "inactive");
 
        statusCell.textContent = "";
        statusCell.appendChild(statusBadge);
 
        employeeTable.appendChild(row);
    });
}
 
// Update summary cards
function updateStats() {
    document.getElementById("totalEmployees").textContent =
        employees.length;
 
    document.getElementById("activeEmployees").textContent =
        employees.filter(employee => employee.status === "Active").length;
 
    document.getElementById("inactiveEmployees").textContent =
        employees.filter(employee => employee.status === "Inactive").length;
}
 
// Delete employee
async function deleteEmployee(id, name) {
    const confirmed = confirm(
        `Are you sure you want to delete ${name} (ID: ${id})?`
    );
 
    if (!confirmed) {
        return;
    }
 
    errorMessage.textContent = "";
    loadingMessage.textContent = `Deleting ${name}...`;
 
    try {
        const response = await fetch(
            `${API_URL}/${encodeURIComponent(id)}`,
            {
                method: "DELETE"
            }
        );
 
        if (!response.ok) {
            throw new Error("Delete request failed.");
        }
 
        loadingMessage.textContent = "";
        showMessage(`${name} has been deleted successfully.`, "success");
 
        await loadEmployees();
 
    } catch (error) {
        console.error("Delete Error:", error);
 
        loadingMessage.textContent = "";
        showMessage(
            "Unable to delete employee. Please try again.",
            "error"
        );
    }
}
 
// Show success or error message
function showMessage(text, type) {
    errorMessage.textContent = "";
    loadingMessage.textContent = text;
    loadingMessage.className = "message " + type;
}
 
// Refresh button
document.getElementById("refreshBtn").addEventListener("click", () => {
    loadingMessage.className = "message";
    loadEmployees();
});
 
// Start application
loadEmployees();
 