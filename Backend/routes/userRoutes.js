const express=require("express");
const {registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetail, UpdateUserPassword, UpdateUserProfile, getAllUser, getSingleUser, UpdateUserRole, deleteUser}=require("../controllers/userControler");
const {isAuthenticatedUser,authorizedRoles}= require("../middleware/auth");
const router =express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router .route("/password/forgot").post(forgotPassword);

router .route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logout);

router. route("/me").get(isAuthenticatedUser,getUserDetail);

router .route("/password/update").put(isAuthenticatedUser,UpdateUserPassword);

router .route("/me/update").put(isAuthenticatedUser,UpdateUserProfile);

router .route("/admin/users").get(isAuthenticatedUser,authorizedRoles("admin"),getAllUser);

router .route("/admin/user/:id")
.get(isAuthenticatedUser,authorizedRoles("admin"),getSingleUser)
.put(isAuthenticatedUser,authorizedRoles("admin"),UpdateUserRole)
.delete(isAuthenticatedUser,authorizedRoles("admin"),deleteUser);



module.exports=router;