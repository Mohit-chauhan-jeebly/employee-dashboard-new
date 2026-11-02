const API_URL = "http://localhost:3000/employees";
 
const employeeForm = document.getElementById("employeeForm");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");
 
document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
 
// Mobile number: only digits
document.getElementById("mobile").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 10);
});
 
// Form submit
employeeForm.addEventListener("submit", async function (event) {
    event.preventDefault();
 
    message.textContent = "";
    message.className = "message";
 
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const department = document.getElementById("department").value;
    const joiningDate = document.getElementById("joiningDate").value;
    const status = document.getElementById("status").value;
 
    if (name.length < 3) {
        showMessage("Name must contain at least 3 characters.", "error");
        return;
    }
 
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showMessage("Please enter a valid email address.", "error");
        return;
    }
 
    if (!/^[0-9]{10}$/.test(mobile)) {
        showMessage("Mobile number must contain exactly 10 digits.", "error");
        return;
    }
 
    if (!department || !joiningDate || !status) {
        showMessage("Please fill in all required fields.", "error");
        return;
    }
 
    const employee = {
        name: name,
        email: email,
        mobile: mobile,
        department: department,
        joiningDate: joiningDate,
        status: status,
        projects: []
    };
 
    submitBtn.disabled = true;
    submitBtn.textContent = "Saving...";
 
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(employee)
        });
 
        if (!response.ok) {
            throw new Error("Server could not save employee.");
        }
 
        const savedEmployee = await response.json();
 
        showMessage(
            "Employee added successfully! Employee ID: " + savedEmployee.id,
            "success"
        );
 
        employeeForm.reset();
 
    } catch (error) {
        console.error("Add Employee Error:", error);
 
        showMessage(
            "Unable to add employee. Please check whether backend is running.",
            "error"
        );
 
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "+ Add Employee";
    }
});
 
// Show success/error message
function showMessage(text, type) {
    message.textContent = text;
    message.className = "message " + type;
}
 
// Reset message when form is cleared
employeeForm.addEventListener("reset", function () {
    message.textContent = "";
    message.className = "message";
});
 