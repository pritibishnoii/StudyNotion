const User = require("../model/User")
const mailSender = require("../utils/mailSender")
const bcrypt = require("bcrypt")
const crypto = require("crypto")


exports.resetPasswordToken = async (req, res) => {

    try {
        //* get the email from req.bdy 
        const email = req.body.email;
        // *check if user for this email ,email validation
        console.log("email->>", email)
        const user = await User.findOne({ email: email });
        console.log("user-->>", user);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: `This Email ${email} is not Registered With Us Enter a Valid Email`
            })
        }
        //* genrate token
        const token = crypto.randomUUID()
        // const token = crypto.randomBytes(20).toString("hex")
        console.log("tokkken", token)

        //* add the token inside user and add tokenexpiry 
        const updatedDetails = await User.findOneAndUpdate(
            { email: email },           //** */ seacrh based on email
            //** */ what change update 
            {
                token: token,
                resetPasswordExpires: Date.now() + 3600000,   //5mint
            },
            { new: true }  //** return the new updated doc 
        )

        console.log("DETAILS", updatedDetails)
        //* create url 
        const url = `http://localhost:3000/update-password/${token}`

        // *send the mail 
        await mailSender(
            email,
            "password Reset",
            `Your Link for email verification is ${url}. Please click this url to reset your password.`
        )
        res.json({
            success: true,
            message: "Email Sent Successfully, Please Check Your Email to Continue Further",
            resetLink:url,
            token:token,
        })
    }
    catch (err) {
        return res.status(500).json({
            error: err.message,
            success: false,
            message: `Some Error in Sending the Reset Message`,
        })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        //* get the resetpassword data from frontend (req.body )
        const { password, confirmPassword, token } = req.body;
        //* check both confrim password and password arematch
        if (confirmPassword !== password) {
            return res.status(401).json({
                success: false,
                message: "Password and Confrim Password Does not Match"
            })
        }
        // *find token  find user data by using token
        const userDetails = await User.findOne({ token: token })
        // check if no enrty available
        if (!userDetails) {
            return res.status(401).json({
                success: false,
                message: "Token is  Invalid",
            })
        }
        //* token time  check
        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.json({
                success: false,
                message: "Token is expired , please regenrate your token"
            })
        }

        // *has the password 
        const encryptedPassword = await bcrypt.hash(password, 10)

        // *update password
        await User.findOneAndUpdate(
            { token: token },
            { password: encryptedPassword },
            { new: true }
        )
        res.json({
            success: true,
            message: `Password Reset Successful✔️`
        })
    }
    catch (err) {
        return res.status(401).json({
            success: false,
            message: `Some Error in Updating the Password`
        })
    }
}
