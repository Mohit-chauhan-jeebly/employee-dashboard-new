 
const API_URL = "http://localhost:3000/employees";
 
const employeeSelect = document.getElementById("employeeSelect");
const editForm = document.getElementById("editForm");
const formFields = document.getElementById("formFields");
const message = document.getElementById("message");
const errorMessage = document.getElementById("errorMessage");
const loadingMessage = document.getElementById("loadingMessage");
const saveBtn = document.getElementById("saveBtn");
 
let employees = [];
let selectedEmployee = null;
let originalValues = null;
 
document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
 
// Load employees from backend
async function loadEmployees() {
    employeeSelect.innerHTML = '<option value="">Loading employees...</option>';
    formFields.disabled = true;
    selectedEmployee = null;
    originalValues = null;
    clearMessages();
 
    loadingMessage.textContent = "Loading employees...";
 
    try {
        const response = await fetch(API_URL);
 
        if (!response.ok) {
            throw new Error("Could not fetch employees.");
        }
 
        employees = await response.json();
 
        employeeSelect.innerHTML =
            '<option value="">Select an employee</option>';
 
        employees.forEach(employee => {
            const option = document.createElement("option");
            option.value = employee.id;
            option.textContent =
                `${employee.name} (ID: ${employee.id})`;
            employeeSelect.appendChild(option);
        });
 
        loadingMessage.textContent = employees.length
            ? `${employees.length} employees loaded successfully.`
            : "No employees found. Add an employee first.";
 
    } catch (error) {
        console.error(error);
        employeeSelect.innerHTML =
            '<option value="">Unable to load employees</option>';
        loadingMessage.textContent = "";
        errorMessage.textContent =
            "Backend connection failed. Please check JSON Server.";
    }
}
 
// Select employee and fill form
employeeSelect.addEventListener("change", function () {
    clearMessages();
 
    const employeeId = this.value;
 
    if (!employeeId) {
        selectedEmployee = null;
        originalValues = null;
        editForm.reset();
        formFields.disabled = true;
        return;
    }
 
    selectedEmployee = employees.find(
        employee => String(employee.id) === String(employeeId)
    );
 
    if (!selectedEmployee) {
        return;
    }
 
    document.getElementById("name").value =
        selectedEmployee.name || "";
 
    document.getElementById("email").value =
        selectedEmployee.email || "";
 
    document.getElementById("mobile").value =
        selectedEmployee.mobile || "";
 
    document.getElementById("department").value =
        selectedEmployee.department || "";
 
    document.getElementById("joiningDate").value =
        selectedEmployee.joiningDate || "";
 
    document.getElementById("status").value =
        selectedEmployee.status || "";
 
    originalValues = {
        name: selectedEmployee.name || "",
        email: selectedEmployee.email || "",
        mobile: selectedEmployee.mobile || "",
        department: selectedEmployee.department || "",
        joiningDate: selectedEmployee.joiningDate || "",
        status: selectedEmployee.status || ""
    };
 
    formFields.disabled = false;
});
 
// Mobile number validation
document.getElementById("mobile").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 10);
});
 
// Update employee
editForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearMessages();
 
    if (!selectedEmployee) {
        showMessage("Please select an employee first.", "error");
        return;
    }
 
    const updatedEmployee = {
        ...selectedEmployee,
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        mobile: document.getElementById("mobile").value.trim(),
        department: document.getElementById("department").value,
        joiningDate: document.getElementById("joiningDate").value,
        status: document.getElementById("status").value
    };
 
    if (updatedEmployee.name.length < 3) {
        showMessage("Name must contain at least 3 characters.", "error");
        return;
    }
 
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedEmployee.email)) {
        showMessage("Enter a valid email address.", "error");
        return;
    }
 
    if (!/^[0-9]{10}$/.test(updatedEmployee.mobile)) {
        showMessage("Mobile number must contain exactly 10 digits.", "error");
        return;
    }
 
    if (
        !updatedEmployee.department ||
        !updatedEmployee.joiningDate ||
        !updatedEmployee.status
    ) {
        showMessage("Please complete all required fields.", "error");
        return;
    }
 
    saveBtn.disabled = true;
    saveBtn.textContent = "Updating...";
 
    try {
        const response = await fetch(
            `${API_URL}/${encodeURIComponent(selectedEmployee.id)}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedEmployee)
            }
        );
 
        if (!response.ok) {
            throw new Error("Update request failed.");
        }
 
        const savedEmployee = await response.json();
 
        showMessage(
            `Employee ${savedEmployee.name} updated successfully!`,
            "success"
        );
 
        await loadEmployees();
        employeeSelect.value = String(savedEmployee.id);
 
        selectedEmployee = savedEmployee;
        originalValues = {
            name: savedEmployee.name,
            email: savedEmployee.email,
            mobile: savedEmployee.mobile,
            department: savedEmployee.department,
            joiningDate: savedEmployee.joiningDate,
            status: savedEmployee.status
        };
 
        document.getElementById("name").value = savedEmployee.name;
        document.getElementById("email").value = savedEmployee.email;
        document.getElementById("mobile").value = savedEmployee.mobile;
        document.getElementById("department").value = savedEmployee.department;
        document.getElementById("joiningDate").value = savedEmployee.joiningDate;
        document.getElementById("status").value = savedEmployee.status;
 
        formFields.disabled = false;
 
    } catch (error) {
        console.error(error);
        showMessage(
            "Unable to update employee. Check backend and try again.",
            "error"
        );
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = "Save Changes";
    }
});
 
// Reset form to original employee details
editForm.addEventListener("reset", function () {
    if (!selectedEmployee || !originalValues) {
        return;
    }
 
    setTimeout(() => {
        document.getElementById("name").value = originalValues.name;
        document.getElementById("email").value = originalValues.email;
        document.getElementById("mobile").value = originalValues.mobile;
        document.getElementById("department").value = originalValues.department;
        document.getElementById("joiningDate").value = originalValues.joiningDate;
        document.getElementById("status").value = originalValues.status;
        clearMessages();
    }, 0);
});
 
// Refresh employee list
document.getElementById("refreshBtn").addEventListener("click", loadEmployees);
 
function showMessage(text, type) {
    message.textContent = text;
    message.className = "message " + type;
}
 
function clearMessages() {
    message.textContent = "";
    message.className = "message";
    errorMessage.textContent = "";
}
 
// Start
loadEmployees();
 