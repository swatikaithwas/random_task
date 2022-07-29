const User = require("../Models/Usermodel");
const useservice = require("../services/userservices");
const bcryptjs = require("bcryptjs");
const blogSchema = require("../Models/Blogmodel");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
var validator = require("email-validator");

const validatePhoneNumber = require("validate-phone-number-node-js");
const { response } = require("../app");
const fs = require("fs");
const { promisify } = require("util");
const ImageSchema = require("../Models/image.model");
const { info } = require("console");
const unlinkAsync = promisify(fs.unlink);
// ////////////////////////////////////////////////////

// this function use for sending email
// <startpoint>
const sendrsetPasswordMail = async function (name, email, token) {
  try {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "swatikaithwas@questglt.org",
        pass: "Swati@9140",
      },
    });
    const mailOptions = {
      from: "swatikaithwas@questglt.org",
      to: email,
      subject: "For Reset Password",
      html:
        "<p> Hii" +
        name +
        ', Please copy the link  <a herf="http://localhost:4000/reset-password?token=' +
        token +
        '"></a>and reset your password</p>',
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("Mail sent successfully:-", info.response);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({ status: false, message: err.message });
  }
};
// < endpoint>

//Register_user controllers

const Register_user = async function (req, res) {
  // console.log(req.body);
  // console.log("reqfile:", req.files);

  var lowerCaseLetters = /[a-z]/g;

  var upperCaseLetters = /[A-Z]/g;

  var numbers = /[0-9]/g;

  let spChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  try {
    let name = req.body.name;
    // let last_name = req.body.last_name;
    let email = req.body.email;
    let mobile = req.body.mobile;
    let images = req.file.filename;
    let password = req.body.password;
    let type = req.body.type;
    if (
      name == "" &&
      email == "" &&
      mobile == "" &&
      images == "" &&
      password == "" &&
      type == ""
    ) {
      res.send({ status: false, message: "Please enter your details." });
    } else if (name == "" || name == undefined) {
      res.send({ status: false, message: "Please enter your  name." });
    } else if (spChars.test(name) || name.match(numbers)) {
      res.send({
        status: false,
        message: "name  not have must be a number and spical characters.",
      });
    } else if (email == "" || email == undefined) {
      res.send({ status: false, message: "Please enter your email." });
    } else if (!validator.validate(email)) {
      res.send({ status: false, message: "Please enter your valid email." });
    } else if (mobile == "" || mobile == undefined) {
      res.send({ status: false, message: "Please enter your phone number." });
    } else if (!validatePhoneNumber.validate(mobile)) {
      res.send({
        status: false,
        message: "Please enter a valid phone number.",
      });
    } else if (password == "" || password == undefined) {
      res.send({ status: false, message: "Please enter your password." });
    } else if (
      !password.match(lowerCaseLetters) ||
      !password.match(upperCaseLetters) ||
      !password.match(numbers) ||
      password.length < 8
    ) {
      res.send({
        status: false,
        message:
          "password must be between 8 and 255 characters and one lowerCaseLetters,one upperCaseLetters,one numbers.",
      });
    } else if (images == "" || images == undefined) {
      res.send({ status: false, message: "Please upload  your image" });
    }

    const spassword = await useservice.SecurePassword(req.body.password);
    const usern = new User({
      name: name,
      email: email.toLowerCase(),
      password: spassword,
      mobile: mobile,
      images: images,
      type: type,
    });
    console.log("usern:", usern);
    const userData = await User.findOne({ email: req.body.email });
    console.log("userData:", userData);
    if (userData) {
      res
        .status(200)
        .send({ success: false, message: "This email is already exist" });
    } else {
      const user_data = await usern.save();
      res.status(200).send({ success: true, data: user_data });
    }
  } catch (e) {
    res.status(400).send({ error: e.message });

    console.log("Error: " + e.message);
  }
};

// login  controller
const Login_user = async function (req, res) {
  console.log(req.body);
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userDatal = await User.findOne({ email: email });
    console.log("userDatal:", userDatal);
    if (userDatal) {
      const passwordmatch = await bcryptjs.compare(
        password,
        userDatal.password
      );
      console.log("passwordmatch:", passwordmatch);
      if (passwordmatch) {
        // const tokendata = await useservice.create_token(userDatal._id);
        const userResult = {
          _id: userDatal._id,
          name: userDatal.name,
          email: userDatal.email,
          password: userDatal.password,
          images: userDatal.images,
          mobile: userDatal.mobile,
          type: userDatal.type,
          // token: tokendata,
        };
        const response = {
          success: true,
          message: "User Details",
          data: userResult,
        };
        res.status(200).send(response);
      } else {
        res.status(200).send({ success: false, message: " Login user failed" });
      }
    } else {
      res.status(200).send({ success: false, message: " Login_user failed" });
    }
  } catch (e) {
    res.status(200).send(e.message);
  }
};

// Update password controllers
const Update_password = async function (req, res) {
  try {
    const user_id = req.body.user_id;
    const password = req.body.password;
    const data = await User.findOne({ id: user_id });
    if (data) {
      const newpassword = await useservice.SecurePassword(password);
      User.findByIdAndUpdate(
        { _id: user_id },
        { $set: { password: newpassword } }
      );
      res.status(200).send({
        success: true,
        mgs: "Your password has been updated successfully",
      });
    } else {
      res.status(200).send({ success: false, message: "useer id not found" });
    }
  } catch (error) {
    res.status(400).send({ success: false, message: error.toString() });
  }
};
// // //////////////////////////////////////////////////////////////////
// ResetPassword contoller
const ResetPassword = async function (req, res) {
  try {
    const token = req.query.token;
    const tokenData = await User.findOne({ token: token });
    if (tokenData) {
      const password = req.body.password;

      const newpassword = await useservice.SecurePassword(password);

      const usernewdata = await User.findByIdAndUpdate(
        { _id: tokenData._id },
        { $set: { password: newpassword, token: "" } },
        { new: true }
      );
      res.status(200).send({
        status: true,
        message: "User Password has been reset.",
        data: usernewdata,
      });
    } else {
      res.status(200).send({
        status: true,
        message: "This link has been expired or token invalid.",
      });
    }
  } catch (e) {
    res.status(400).send({ status: false, message: e.message });
  }
};
// // //////////////////////////////////////////////////////////////////////////////////
// // ForgetPassword controllers
const ForgetPassword = async function (req, res) {
  // console.log("body:", req.body);
  try {
    const Email = req.body.email;
    const Usersdata = await User.findOne({ email: req.body.email });
    if (Usersdata) {
      const RandomString = randomstring.generate();
      const Data = await User.updateOne(
        { email: Email },
        { $set: { token: RandomString } }
      );

      sendrsetPasswordMail(Usersdata.name, Usersdata.email, RandomString);
      //   console.log("sendrsetPasswordMail:", sendrsetPasswordMail);
      //   return;
      res.status(200).send({
        status: true,
        message: "Please check your email inbox and reset your password.",
      });
    } else {
      res
        .status(200)
        .send({ status: true, message: "This email does not exists." });
    }
  } catch (e) {
    res.status(400).send({ status: false, message: e.message });
  }
};
// // ////////////////////////////////////////
// // updateProfile controller
const updateProfile = async function (req, res) {
  console.log("body:", req.body);
  const profile = await useservice.checkprofile(req.body._id);
  console.log(req.body._id);
  try {
    if (profile) {
      profile.name = req.body.name || profile.name;
      profile.mobile = req.body.mobile || profile.mobile;
      profile.images = req.body.images || profile.images;
      profile.type = req.body.type || profile.type;
      if (req.body.password) {
        User.password = req.body.password;
      }
      const userUpdateprofile = await profile.save();
      res.json({
        _id: userUpdateprofile._id,
        name: userUpdateprofile.name,
        mobile: userUpdateprofile.mobile,
        images: userUpdateprofile.images,
        type: userUpdateprofile.type,
      });
      res.status(200).send({
        status: true,
        message: "User update",
        data: userUpdateprofile,
      });
    } else {
      res.status(200).send({ status: true, message: "user not found" });
    }
  } catch (e) {
    res.status(400).send({ status: false, message: e.message });
  }
};
// // //////////////////////////////////////////////////////////////////////////////
// // upload images controller
const Upload_images = async function (req, res) {
  // console.log(req.body);
  // console.log("reqfile:", req.files);

  try {
    // const photos = req.files.map((file) => {
    const photos = await ImageSchema.create({
      urls: req.files.map((file) => file.filename),
    });
    // console
    //  console.log("photo", photo, file);
    // return file.filename;
    // });
    console.log("photos created", photos);

    const uploading = new blogSchema({
      title: req.body.title,
      descrition: req.body.descrition,
      images: photos._id,
      field: req.body.field,
    });
    console.log("uploading:", uploading);
    if (!uploading) {
      res.status(200).send({ success: true, message: "Please choose a file" });
    } else {
      const userimges = await uploading.save();
      res.status(200).send({ success: true, data: userimges });
    }
  } catch (e) {
    res.status(400).send({ error: e.message });

    console.log("Error: " + e.message);
  }
};

// // ///////////////////////////////////////////////////////////
// // update multiple image controllers

const update_multiple_image = async function (req, res) {
  // console.log("body", req.body);
  // console.log("file", req.files);
  // res.status(200).send({ data: req.files });
  // return;
  // console.log("body:", req.body);
  // const profileupdate = await useservice.checkprofileId(req.body._id);
  // console.log("profileupdate:", profileupdate);
  // return;
  try {
    const { imagedocId, filenames } = req.body;

    const ExestingPhots = await ImageSchema.findById(imagedocId);
    console.log("ExestingPhots", ExestingPhots);
    console.log("filenames", filenames);

    const remainingphotos = ExestingPhots.urls.filter(
      (url) => !filenames[0].split(",").includes(url)
    );

    console.log("remainingphotos", remainingphotos);
    const newphotos = req.files.map((file) => file.filename);

    const Updatedphotos = await ImageSchema.findByIdAndUpdate(
      {
        _id: imagedocId,
      },
      { urls: [...remainingphotos, ...newphotos] }
    );
    console.log("Updatedphotos", Updatedphotos);
    res.status(200).send({ body: req.body });
  } catch (e) {
    res.status(400).send({ success: false, error: e.message });
  }
};
// // //////////////////////////////////////////////////////////////////////////

// // delete multiple image controllers

const delete_multiple_image = async function (req, res) {
  // console.log("body", req.body);
  // console.log("body:", req.files);

  try {
    const { imagedocId, filenames } = req.body;
    const ExestingPhots = await ImageSchema.findById(imagedocId);
    const remainingphotos = ExestingPhots.urls.filter(
      (url) => !filenames[0].split(",").includes(url)
    );
    // console.log("ExestingPhots", ExestingPhots.urls);
    // console.log("filename", filenames);
    // console.log("remainingphotos", remainingphotos);
    // const newphotos = req.files.map((file) => file.filename);
    // console.log("reqfiles", req.files);
    // console.log("newphotos", newphotos);
    const Updatedphotos = await ImageSchema.findByIdAndUpdate(
      {
        _id: imagedocId,
      },
      { urls: [...remainingphotos] }
    );
    console.log("Updatedphotos", Updatedphotos);
    res.status(200).send({ body: req.body });
  } catch (e) {
    res.status(400).send({ success: false, error: e.message });
  }
};
// //////////////////////////////////////////////////////////////////////////////


module.exports = {
  Register_user,
  Login_user,
  Update_password,
  ResetPassword,
  ForgetPassword,
  updateProfile,
  Upload_images,
  update_multiple_image,
  delete_multiple_image,
};
