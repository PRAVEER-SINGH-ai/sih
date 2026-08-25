const express = require("express");

const router = express.Router();

const {
    createChangeRequest,
    getChangeRequests,
    approveChangeRequest,
    rejectChangeRequest
} = require("../controllers/changeRequestController");

const {
    verifyJWT
} = require("../middleware/authMiddleware");

const {
    requireAdmin
} = require("../middleware/adminMiddleware");


// ==========================================
// USER
// ==========================================

// Submit change request
// Any authenticated user can submit
router.post(
    "/",
    verifyJWT,
    createChangeRequest
);


// ==========================================
// ADMIN
// ==========================================

// Get all change requests
router.get(
    "/",
    verifyJWT,
    requireAdmin,
    getChangeRequests
);


// Approve change request
router.patch(
    "/:id/approve",
    verifyJWT,
    requireAdmin,
    approveChangeRequest
);


// Reject change request
router.patch(
    "/:id/reject",
    verifyJWT,
    requireAdmin,
    rejectChangeRequest
);


module.exports = router;