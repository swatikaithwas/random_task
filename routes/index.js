var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const userController = require("../Controller/usercontroller");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static("public"));

// multer function

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../public/userImages"),
      function (err, success) {
        if (err) throw err;
      }
    );
  },
  filename: function (req, file, cb) {
    console.log("file:", file);
    const name = Date.now() + "-" + file.originalname;
    cb(null, name, function (error1, success1) {
      if (error1) throw error1;
    });
  },
});
//
const upload = multer({
  storage: storage,

  // fileFilter: function (req, file, cb) {
  //   if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
  //     cb(null, true);
  //   } else {
  //     console.log("only jpg & png file supported !");
  //     callbackPromise(null, false);
  //   }
  // },
  // limits: {
  //   fileSize: 1024 * 1024 * 2,
  // },
});
//  router for register
router.post("/register", upload.single("images"), userController.Register_user);
// router for login
router.post("/login", userController.Login_user);
// // router for see all users
// router.get("/test", auth, function (req, res) {
//   res.status(200).send({ success: true, msg: "Authenticated successfully" });
// });
// // router for update-password
router.post("/update-password", userController.Update_password);

// // router for forget-password
router.post("/forget-password", userController.ForgetPassword);

// // router for reset-password
router.get("/reset-password", userController.ResetPassword);
// router.post("/reset-password", userController.ResetPassword);

// // router for updaateprofiles
router.patch("/UpdateProfiles", userController.updateProfile);
router.post(
  "/upload-images",
  upload.array("images", 12),
  userController.Upload_images
);
// // router for updateProfile
router.patch(
  "/update-multiple-image",
  upload.array("images", 12),
  userController.update_multiple_image
);
// //  router for delete multiple images
router.patch(
  "/delete-multiple-image",
  upload.array("images", 12),
  userController.delete_multiple_image
);



/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
