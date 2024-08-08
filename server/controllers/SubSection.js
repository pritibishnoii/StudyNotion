const SubSection = require("../model/SubSection")
const uploadImageToCloudinary = require('../utils/imageUploader')
const Section = require("../model/Section")



// create subsection 
exports.createSubSection = async (req, res) => {
    try {
        // TODO 1. fetch data from req.body 
        const { title, timeDuration, description, sectionId } = req.body;



        // TODO 2. extract file vedio 
        const vedio = req.files.vedioFile;
        console.log("vedio--", vedio)
        // TODO 3. validation data
        if (
            !title ||
            !timeDuration ||
            !description ||
            !vedio ||
            !sectionId
        ) {
            return res.status(400).json({
                success: false,
                message: "All Fields Are Required.."
            })
        }

        // TODO 4 upload vedio to cloudinay .
        const uploadVedio = await uploadImageToCloudinary(vedio, process.env.FOLDER_NAME)
        console.log("uploadVedio", uploadVedio)

        // TODO 5 create a sub section 
        const subSectionDetails = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            vedio: uploadVedio.secure_url,
        })
        console.log("subSectionDetails->", subSectionDetails)

        // TODO 6 update section with this section objectID
        const updatedSection = await Section.findByIdAndUpdate(sectionId,
            {
                $push: {
                    subSection: subSectionDetails._id
                }
            },
            { new: true }
        ).populate("subSection")

        console.log("updatedSection", updatedSection)

        //TODO 7 return response 
        return res.status(200).json({
            success: true,
            message: "Sub Section Created  Successfuly...✅",
            data: updatedSection,
        })


    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "SubSection is not created ",
            erorr: err.message
        })
    }
}

// update sub section 
exports.updateSubSection = async (req, res) => {
    try {
        const { sectionId, subSectionId, title, description } = req.body
        const subSection = await SubSection.findById(subSectionId)

        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            })
        }

        if (title !== undefined) {
            subSection.title = title
        }

        if (description !== undefined) {
            subSection.description = description
        }
        if (req.files && req.files.video !== undefined) {
            const video = req.files.video
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME
            )
            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
        }

        await subSection.save()

        // find updated section and return it
        const updatedSection = await Section.findById(sectionId).populate(
            "subSection"
        )

        console.log("updated section", updatedSection)

        return res.json({
            success: true,
            message: "Section updated successfully",
            data: updatedSection,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the section",
            error: err.message,
        })
    }
}

exports.deleteSubSection = async (req, res) => {
    try {
        const { subSectionId, sectionId } = req.body
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $pull: {
                    subSection: subSectionId,
                },
            }
        )
        const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

        if (!subSection) {
            return res
                .status(404)
                .json({ success: false, message: "SubSection not found" })
        }

        // find updated section and return it
        const updatedSection = await Section.findById(sectionId).populate(
            "subSection"
        )

        return res.json({
            success: true,
            message: "SubSection deleted successfully",
            data: updatedSection,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the SubSection",
            error: err.message,
        })
    }
}