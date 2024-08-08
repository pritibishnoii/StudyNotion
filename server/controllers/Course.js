const Course = require("../model/Course");
const Category = require("../model/Category");
const User = require("../model/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

// create course
// exports.createCourse = async (req, res) => {
//   try {
//     // TODO 1 get coures Data from req.body
//     const {
//       courseName,
//       description,
//       whatYouWillLearn,
//       price,
//       category,
//       tag: _tag,
//       status,
//       instructions: _instructions,
//     } = req.body;

//     // TODO 2 get thumbnail
//     const thumbnail = req.files.thumbnailImage;
//     console.log(thumbnail);

//     // Convert the tag and instructions from stringified Array to Array
//     const tag = JSON.parse(_tag);
//     const instructions = JSON.parse(_instructions);

//     console.log("tag", tag);
//     console.log("instructions", instructions);
//     // TODO 3 validation
//     if (
//       !courseName ||
//       !description ||
//       !whatYouWillLearn ||
//       !price ||
//       !thumbnail ||
//       !tag.length ||
//       !instructions.length ||
//       !category
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "All Fiels Are Required ..",
//       });
//     }

//     if (!status || status === undefined) {
//       status = "Draft";
//     }
//     //TODO 3 check for instructor
//     const userId = req.user.id;
//     console.log(userId);
//     // const instructorDetails = await User.findById(userId)
//     // Check if the user is an instructor
//     const instructorDetails = await User.findById(userId, {
//       accountType: "Instructor",
//     });

//     console.log("Instructor Details", instructorDetails);
//     if (!instructorDetails) {
//       return res.status(404).json({
//         success: false,
//         message: "Instructor Not Found",
//       });
//     }

//     //TODO 4 Check if the tag given is valid
//     const categoryDetails = await Category.findById(category);
//     console.log("category Details :)", categoryDetails);
//     if (!categoryDetails) {
//       return res.status(404).json({
//         success: false,
//         message: "Category Details Not Found",
//       });
//     }

//     //TODO 5 upload to clodinary
//     const thumbnailImage = await uploadImageToCloudinary(
//       thumbnail,
//       process.env.FOLDER_NAME
//     );
//     console.log("thumbnail Image-", thumbnailImage);

//     // TODO 6 create an entry for new course
//     const newCourse = await Course.create({
//       courseName,
//       courseDescription,
//       instructor: instructorDetails._id,
//       whatYouWillLearn: whatYouWillLearn,
//       price,
//       tag,
//       category: categoryDetails._id,
//       thumbnail: thumbnailImage.secure_url,
//       status: status,
//       instructions,
//     });
//     console.log("newCourse->>", newCourse);

//     //TODO 7  add the new course to the user schema update user
//     await User.findByUpdate(
//       { _id: instructorDetails._id },
//       {
//         $push: {
//           courses: newCourse._id,
//         },
//       },
//       { new: true }
//     );

//     // TODO 8 Add the new course to the Categories
//     const categoryDetails2 = await Category.findByIdAndUpdate(
//       { _id: category },
//       {
//         $push: {
//           courses: newCourse._id,
//         },
//       },
//       { new: true }
//     );
//     console.log(":-> ", categoryDetails2);

//     // TODO 9 return resposn
//     return res.status(200).json({
//       success: true,
//       message: "Course Created Successfuly..😍",
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "course is not created yet...",
//       error: err.message,
//     });
//   }
// };

exports.createCourse = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.user.id;
    console.log("userID from created coruse-", userId);

    // Get all required fields from request body
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag: _tag,
      category,
      status = "Draft",
      instructions: _instructions,
    } = req.body;
    // Get thumbnail image from request files
    const thumbnail = req.files?.thumbnailImage;

    // Parse JSON fields
    // Convert the tag and instructions from stringified Array to Array
    const tag = JSON.parse(_tag || "[]");
    const instructions = JSON.parse(_instructions || "[]");

    console.log("tag", tag);
    console.log("instructions", instructions);

    // Check if any of the required fields are missing
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag.length ||
      !thumbnail ||
      !category ||
      !instructions.length
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }
    if (!status || status === undefined) {
      status = "Draft";
    }
    // Check if the user is an instructor
    if (!instructorDetails || instructorDetails.accountType !== "Instructor") {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not Found",
      });
    }

    // Check if the tag given is valid
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      });
    }
    // Upload the Thumbnail to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );
    console.log(thumbnailImage);
    // Create a new course with the given details
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: status,
      instructions,
    });

    // Add the new course to the User Schema of the Instructor
    await User.findByIdAndUpdate(
      {
        _id: instructorDetails._id,
      },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );
    // Add the new course to the Categories
    const categoryDetails2 = await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );
    console.log(":-> ", categoryDetails2);
    // Return the new course and a success message
    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the creation of the course
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// get fetch allCourse

exports.getAllCourse = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
        tag: true,
      }
    )
      .populate("instructor", "name")
      .exec();

    return res.status(200).json({
      success: true,
      data: allCourses,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
