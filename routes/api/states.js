const express = require("express");
const router = express();
const stateController = require("../../controller/stateController");

// --------------------------------
router
  .route("/")
  .get(stateController.GetAllStates)
  .post(stateController.CreateNewStateFact)
  .delete(stateController.DeleteStateFunFact);

// redirects for state code
router.route("/:state").get(stateController.GetState);

// redirects for state capital
router.route("/:state/capital").get(stateController.GetStateCapital);

// redirects for state nickname
router.route("/:state/nickname").get(stateController.GetStateNickname);

// redirects for state population
router.route("/:state/population").get(stateController.GetStatePopulation);

// redirects for state admission
router.route("/:state/admission").get(stateController.GetStateAdmission);

// redirects for funfacts
router.route("/:state/funfacts").get(stateController.GetStateFunFacts);

// redirects for random funfacts
router.route("/:state/funfact").get(stateController.GetRandomFunFact);

// redirects for randome funfacts
router.route("/:state/funfact").patch(stateController.UpdateStateFunFact);

module.exports = router;
