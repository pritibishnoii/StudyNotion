const mongoose = require("mongoose");

const SubSectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,  // You might want to make fields required if necessary
    },
    timeDuration: {
        type: String,
    },
    description: {
        type: String,
    },
    videoUrl: {
        type: String,  // Ensure the field name is consistent ('vedioUrl' should likely be 'videoUrl')
    }
});

// Check if the model is already compiled to avoid OverwriteModelError
module.exports = mongoose.models.SubSection || mongoose.model("SubSection", SubSectionSchema);
