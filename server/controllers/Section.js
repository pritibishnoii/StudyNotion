const Section = require("../model/Section")
const Course = require("../model/Course")

exports.createSection = async (req, res) => {
    try {
        // TODO 1.fetch data from req . body 
        const { sectionName, courseId } = req.body;

        // TODO 2. validation
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties.."
            })
        }
        // TODO 3. create section 
        const newSection = await Section.create({ sectionName })
        console.log("newSection-->>", newSection)

        // TODO 4. update the course with section objectId
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id
                }
            },
            { new: true }
        ).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        }).exec()
        console.log("updated course ", updatedCourse)

        // TODO 5 RETURN response 
        return res.status(200).json({
            success: true,
            message: "Section Created Successfully..😇",
            data: updatedCourse,
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error ",
            error: err.message,
        })
    }
}



// update section 
exports.updateSection = async (req, res) => {
    try {
        // TODO 1. data input 
        const { sectionName, sectionId } = req.body;
        console.log(sectionName, sectionId)

        // TODO 2. data validation 
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties..",
            })
        }

        // TODO 3. update data 
        const updateSection = await Section.findByIdAndUpdate(sectionId,
            { sectionName },
            { new: true },
        )
        console.log("updateSection->", updateSection)

        // TODO 4. return response 
        return res.status(200).json({
            success: true,
            message: "Section Updated Successfully...✔️"
        })

    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Section  is not Update ",
            error: err.message,
        })
    }
}


exports.deleteSection = async (req, res) => {
    try {
        // TODO 1.  get the section id  asssuming that we are sending ID in params 
        const { sectionId } = req.params;
        console.log("sectionID->", sectionId)

        const deletedSection = await Section.findByIdAndDelete(sectionId)
        console.log("deleted Section", deletedSection)

        // TODO 2.  find the updated course and return it
        
        // TODO 3. return response  
        return res.status(200).json({
            success: true,
            message: "Section Deleted Successfully..",
            data: deletedSection,
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Section  is not Deleted  ",
            error: err.message,
        })
    }
}