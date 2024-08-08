const Category = require("../model/Category");

// create tag
exports.createCategory = async (req, res) => {
  try {
    //TODO 1. fetch the data from req.body
    const { name, description } = req.body;
    //TODO 2.  validate
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All Fields Are Requied",
      });
    }
    //TODO 3. create entry in db
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log("categoryDetails-->>", categoryDetails);
    //TODO 4. return respons
    return res.status(200).json({
      success: true,
      message: "category created successfuly...",
      category: categoryDetails,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// get categories data
exports.getAllCategories = async (req, res) => {
  try {
    //TODO 1 find all categories (show)
    const allCategories = await Category.find(
      {},
      { name: true, description: true }
    );
    console.log("allCategories-->", allCategories);
    return res.status(200).json({
      success: true,
      message: "All Tags Return Successfully...",
      data: allCategories,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    // Get courses for the specified category
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec();

    console.log("SELECTED COURSE", selectedCategory);
    // Handle the case when the category is not found
    if (!selectedCategory) {
      console.log("Category not found.");
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    // Handle the case when there are no courses
    if (selectedCategory.courses.length === 0) {
      console.log("No courses found for the selected category.");
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      });
    }

    // Get courses for other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    });
    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec();
    console.log();
    // Get top-selling courses across all categories
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec();
    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
