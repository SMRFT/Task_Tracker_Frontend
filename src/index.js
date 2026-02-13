import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";

// Access the redirect URL from environment variables
const REDIRECT_URL = process.env.REACT_APP_LOGIN_REDIRECT_URL;

console.log("=== TRACKER INDEX.JS DEBUG ===");
console.log("REDIRECT_URL:", REDIRECT_URL);

// --- Function to set token for local development ---
function setforlocaldev() {
  const dev_token ="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDM4MCIsImVtYWlsIjoibWFuaWJhbGFuc21yZnRAZ21haWwuY29tIiwibmFtZSI6Ik1hbmliYWxhbiIsImFsbG93ZWQtYWN0aW9ucyI6WyJHTC1QLUVBRC1SVyIsIlNULVAtQlJELVIiLCJNREMtUC1SRUctUlciLCJHTC1QLUVCVC1SVyIsIkdMLVAtUlNFLVJXIiwiRVItUC1FUlNELVJXIiwiR0wtUC1FRC1SVyIsIkdMLVAtUC1SVyIsIlNULVAtREVTLVIiLCJTSEktUC1VUEQtUlciLCJTSU4tQVBJLVNGLVIiLCJTSU4tUi1TVEEiLCJTVC1QLU5URi1SIiwiU0hJLVAtRjFTLVJXIiwiU0hJLVAtRVhQLVJXIiwiU0hJLVAtTUlDVVItUlciLCJTSEktUC1TSUNVUi1SVyIsIlNJTi1QLUdETC1SIiwiTURDLVAtU09SLVIiLCJTSEktUC1GMVItUlciLCJTSEktUC1NT0NLLVJXIiwiU0hJLVAtTVJELVJXIiwiU0hJLVAtT1QtUlciLCJTSEktUC1UUkFJTlItUlciLCJHTC1QLUFORC1SVyIsIlNISS1QLURJQS1SVyIsIkVSLVAtRVJVUy1SVyIsIlNJTi1BUEktSUYtUlciLCJTSEktUC1GMlNSLVJXIiwiU0hJLVAtUkVDLVJXIiwiU1QtUC1TTk8tUlciLCJFUi1QLUVSR0FTLVJXIiwiTURDLUFQSS1BVC1SIiwiTURDLUFQSS1USFItUiIsIlNISS1QLUNIRU1PUi1SVyIsIlNULVAtQ01ULVJXIiwiRVItUi1FUlAiLCJNREMtQVBJLUdBUy1SIiwiRVItUC1FUlZCLVJXIiwiTURDLUFQSS1SREwtUiIsIlNJTi1BUEktT1JSLVIiLCJTSEktUC1QSFktUlciLCJTSU4tQVBJLU9SLVJXIiwiU0hJLVAtT1BELVJXIiwiU0hJLVAtRjFTUi1SVyIsIlNULVAtVERMLVIiLCJNREMtUC1QTlAtUiIsIlNISS1QLUZPUk0tUlciLCJTVC1BUEktQ1JELVJXIiwiU0hJLVAtQVZBSUwtUlciLCJNREMtUC1QVEUtUlciLCJTSEktUC1ERUwtUlciLCJTSEktUC1MQUItUlciLCJTSEktUC1IQU5ELVJXIiwiU0hJLVAtRU1SUi1SVyIsIk1EQy1QLVBOUFItUiIsIlNISS1QLUYzUi1SVyIsIlNISS1QLUYzLVJXIiwiU0lOLVAtR0lDLVIiLCJTSEktUC1VUERSQVctUlciLCJTSEktUC1GMS1SVyIsIlNISS1QLVNJQ1UtUlciLCJNREMtUC1SRUctUiIsIk1EQy1QLU9TQi1SVyIsIlNULUFQSS1BTUMtUlciLCJTSEktUC1DSEVNTy1SVyIsIlNISS1QLUZSTlQtUlciLCJTVC1QLVRETC1SVyIsIlNISS1QLVJFQ1ItUlciLCJNREMtUC1DREUtUlciLCJNREMtQVBJLVBBVC1SIiwiTURDLUFQSS1MQk4tUiIsIkVSLVAtRVJQLVIiLCJTSEktUC1OSUNVLVJXIiwiU1QtUC1OVEYtUlciLCJNREMtUC1UUkItUlciLCJTSEktUC1IUi1SVyIsIlNISS1QLU5JQ1VSLVJXIiwiU0hJLVAtRjItUlciLCJTSEktUC1FTVItUlciLCJTSEktUC1GMlMtUlciLCJTVC1BUEktRU1QLVIiLCJTVC1BUEktQlJELVJXIiwiU0hJLVAtVFJBSU4tUlciLCJHUC1QLUdDTi1SIiwiU1QtUi1BIiwiU0hJLVAtWFJBWS1SVyIsIlNULVAtREVTLVJXIiwiU1QtUC1DTVQtUiIsIkdMLVAtTkRDLVJXIiwiU0hJLVAtTUlDVS1SVyIsIkdMLVAtRVAtUlciLCJNREMtUC1SREUtUlciLCJNREMtUC1BU00tUlciLCJTSEktUC1GMlItUlciLCJTSEktUC1DVC1SVyIsIk1EQy1QLVBOUC1SVyIsIlNISS1QLUlOQyIsIk1EQy1BUEktQVQtUlciLCJTSEktUC1IQU5EUi1SVyIsIkdMLVAtRUwtUlciLCJFUi1QLUVSR1BSLVJXIiwiU0hJLVAtREVMUkFXLVJXIiwiTURDLUFQSS1DRFItUiIsIlNJLVItSU5EIiwiTURDLUFQSS1SVFMtUiIsIlNISS1QLU1SSS1SVyIsIlNISS1QLUdFVFJBVy1SVyIsIlNISS1QLVBIQVJNLVJXIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3NzA5NjU1OTUsImV4cCI6MTc3MTA1MjU5NSwianRpIjoiZGVhODc2NjAtNTAzYi00YTBkLWI1MjYtNGU5ZGU0MDc1ZjM2In0.KsmgATgGwfc18N5kwxg-C7YilCB1lQ2vI1rn5hhcdltqZ6-B7nPku3TbsoTkXNO1TuqSblMgn3MwSodOLJ8uJoqhLFJS01eX0JJgY_jQfX1Ec85ixvut2is6qEopYk4Og0xsxQ8FidChcs1vrihwd1eBLvyGTEsWX4TEizZTEoQzPfTX6haJPcG3Ufcy7meGRnFANs-gezUVdy5P2ULkpzk9KWn6n4aEpviLtNJiv3Ocr1G8eP67p8usmZWpZJjfE4orAjeGDIs6ejm9HJSAsPJDHfOZ6oNpzwdfZ6i0lH0-yu5441u3PGOwnSV4BImZXKcMGbKtLzNOKLCZalK51Q";
  console.log("🔧 Development token is empty - will redirect to login");
  return dev_token;
}

// --- Function to redirect to login ---
function redirectToLogin() {
  if (REDIRECT_URL) {
    console.log("🔄 Redirecting to login URL:", REDIRECT_URL);
    window.location.href = REDIRECT_URL;
  } else {
    console.error("❌ REDIRECT_URL not configured");
    // Even if REDIRECT_URL is not configured, don't show error - just redirect to a fallback
    window.location.href = "/login";
  }
}

// --- Validate JWT Token Locally ---
function validate(token) {
  if (!token || token.trim() === "") {
    throw new Error("Token is empty");
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      throw new Error("Token expired");
    }
    return payload;
  } catch (err) {
    throw new Error("Invalid token");
  }
}

// --- Function to determine user role based on allowed-actions ---
function getUserRole(allowedActions) {
  if (!allowedActions || !Array.isArray(allowedActions)) {
    return "Employee"; // Default role
  }

  if (allowedActions.includes("ST-R-A")) {
    return "Admin";
  } else if (allowedActions.includes("ST-R-HOD")) {
    return "HOD";
  } else if (allowedActions.includes("ST-R-EMP")) {
    return "Employee";
  } else {
    return "Employee"; // Default role if none of the specific roles are found
  }
}

// --- Function to render the app ---
function renderApp(userPayload) {
  // Extract user information from token payload
  const employeeId = userPayload.aud; // Using 'aud' field as ID
  const employeeName = userPayload.name;
  const userEmail = userPayload.email;
  const userRole = getUserRole(userPayload["allowed-actions"]);

  console.log("Employee ID:", employeeId);
  console.log("Employee Name:", employeeName);
  console.log("Email:", userEmail);
  console.log("User Role:", userRole);

  // Check if we have required data
  const isLoggedIn = !!(employeeId && employeeName);
  console.log("Is logged in:", isLoggedIn);

  if (!isLoggedIn) {
    throw new Error("Missing required user data (employeeId or employeeName)");
  }

  // Store user payload and extracted information for app usage
  localStorage.setItem("user_payload", JSON.stringify(userPayload));
  localStorage.setItem("employeeId", employeeId);
  localStorage.setItem("employeeName", employeeName);
  localStorage.setItem("userEmail", userEmail);
  localStorage.setItem("role", userRole);

  console.log("✅ User payload and extracted data stored in localStorage");
  console.log("Stored data:", {
    employeeId,
    employeeName,
    userEmail,
    role: userRole,
  });

  // Token is valid, render app
  console.log("✅ Rendering tracker app...");
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  reportWebVitals();
}

// --- Main execution ---
(function main() {
  try {
    console.log("Starting token validation...");

    // Retrieve token from localStorage
    let accessToken = localStorage.getItem("access_token");
    console.log("Access token from localStorage exists:", !!accessToken);

    // If no token found, try development token
    if (!accessToken) {
      console.log(
        "❌ No token found in localStorage, trying development token"
      );
      accessToken = setforlocaldev();
    }

    // If still no token (development token is empty), redirect to login
    if (!accessToken || accessToken.trim() === "") {
      console.log("❌ No valid token available, redirecting to login");
      localStorage.removeItem("access_token"); // Clean up
      redirectToLogin();
      return; // Stop execution here
    }

    // Validate the token
    const userPayload = validate(accessToken);
    console.log("✅ Token validated successfully");
    console.log("Decoded token payload:", userPayload);

    // Store the valid token
    localStorage.setItem("access_token", accessToken);

    // Render the app
    renderApp(userPayload);
  } catch (error) {
    console.error("❌ Token validation failed:", error.message);

    // Clean up invalid token
    localStorage.removeItem("access_token");

    // If validation fails, redirect to login instead of showing debug page
    console.log("❌ Redirecting to login due to validation failure");
    redirectToLogin();
  }
})();
