const express = require("express");

const profileController = require("../controllers/profileController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/me", requireAuth, profileController.getMyProfile);
router.post("/", requireAuth, profileController.createProfile);
router.put("/me", requireAuth, profileController.updateProfile);
router.delete("/me", requireAuth, profileController.deleteProfile);
router.get("/:userId", profileController.getProfileByUserId);

module.exports = router;
