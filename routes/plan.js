const express = require("express");

const router = express.Router();

const planController = require("../controllers/planController");

router.post("/todoApp/create/plan", planController.createPlan);
router.get("/todoApp/getPlanDate", planController.getPlanDate);
router.delete("/todoApp/delete-plan", planController.deletePlan);
router.put("/todoApp/update-check", planController.updateCheck);
router.put("/todoApp/update-plan", planController.updatePlan);
router.get("/todoApp/getPlan", planController.getPlan);

module.exports = router;
