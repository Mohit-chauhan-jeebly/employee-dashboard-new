const API_URL = "http://localhost:3000/employees";
 
const checkApiBtn = document.getElementById("checkApiBtn");
const apiDot = document.getElementById("apiDot");
const apiMessage = document.getElementById("apiMessage");
const employeeCount = document.getElementById("employeeCount");
 
const checkboxes = document.querySelectorAll(
  '#checklist input[type="checkbox"]'
);
 
function updateProgress() {
  const total = checkboxes.length;
  const completed = [...checkboxes].filter(box => box.checked).length;
  const remaining = total - completed;
  const percentage = Math.round((completed / total) * 100);
 
  document.getElementById("totalTests").textContent = total;
  document.getElementById("completedTests").textContent = completed;
  document.getElementById("remainingTests").textContent = remaining;
  document.getElementById("progressPercent").textContent = percentage + "%";
 
  document.getElementById("progressBar").style.width = percentage + "%";
  document.getElementById("progressText").textContent =
    `${completed} of ${total} tests completed`;
}
 
checkboxes.forEach(box => {
  box.addEventListener("change", updateProgress);
});
 
document.getElementById("resetBtn").addEventListener("click", () => {
  checkboxes.forEach(box => box.checked = false);
  updateProgress();
});
 
async function checkAPI() {
  checkApiBtn.disabled = true;
  checkApiBtn.textContent = "Checking...";
  apiDot.className = "dot";
  apiMessage.textContent = "Connecting to backend...";
  employeeCount.textContent = "Employee records: checking...";
 
  try {
    const response = await fetch(API_URL);
 
    if (!response.ok) {
      throw new Error("API returned status " + response.status);
    }
 
    const employees = await response.json();
 
    apiDot.className = "dot online";
    apiMessage.textContent = "Backend connected successfully";
    employeeCount.textContent =
      "Employee records: " + employees.length;
 
  } catch (error) {
    apiDot.className = "dot offline";
    apiMessage.textContent = "Backend connection failed";
    employeeCount.textContent = error.message;
  } finally {
    checkApiBtn.disabled = false;
    checkApiBtn.textContent = "Check API";
  }
}
 
checkApiBtn.addEventListener("click", checkAPI);
 
document.getElementById("currentDate").textContent =
  new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
 
updateProgress();
checkAPI();