const express = require("express");
const router = express.Router();
const {
  getAllEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  createNewEmployee,
} = require("../../controllers/employeeController");
const ROLE_LIST = require("../../config/role_list");
const verifyRoles = require("../../middleware/verifyRoles");

// const verifyJwt = require("../../middleware/verifyJWT");
router
  .route("/")
  // .get(verifyJwt, getAllEmployee) //! verfiy token before access api
  .get(getAllEmployee)
  .post(verifyRoles(ROLE_LIST.Admin, ROLE_LIST.Editor), createNewEmployee)
  .put(verifyRoles(ROLE_LIST.Admin, ROLE_LIST.Editor), updateEmployee)
  .delete(verifyRoles(ROLE_LIST.Admin), deleteEmployee);

//* Named Parameter routes
router.route("/:id").get(getEmployee);
module.exports = router;
