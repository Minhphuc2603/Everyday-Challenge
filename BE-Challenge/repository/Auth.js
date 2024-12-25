import User from '../models/User.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import jwt from 'jsonwebtoken';
import UserProfile from '../models/UserProfile.js';


/**
 * Generates a verification code using crypto.randomBytes.
 * @author Trịnh Minh Phúc
 * @date 29/1/2024
 * @return {string} The generated verification code in hexadecimal format.
 */
const generateVerificationCode = () => {
    return crypto.randomBytes(20).toString('hex');
};
const generateNewPassword = () => {
    return crypto.randomBytes(3).toString('hex');
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "trinhphuc980@gmail.com",
        pass: "kfqbavvazdgyysmd",
    },
});
/**
 * Sends a verification email to the specified email address with the given verification code.
 * @author Trịnh Minh Phúc
 * @date 29/1/2024
 * @param {string} email - The email address to which the verification email will be sent
 * @param {string} verificationCode - The code used to verify the email address
 * @return {Promise} A promise that resolves to the information about the sent email
 */
const sendVerificationEmail = async (email, verificationCode) => {
    const mailOptions = {
        from: 'trinhphuc980@gmail.com',
        to: email,
        subject: 'Xác Minh Tài Khoản Challenge Everyday',
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <h2 style="color: #333;">Xin chào ${email}</h2>
                <p style="font-size: 16px; color: #666;">
                    Nhấp vào liên kết sau để xác minh tài khoản:
                    <br />
                    <a href="http://localhost:3000/verify/${verificationCode}" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px;">Xác Minh</a>
                </p>
                <p style="font-size: 14px; color: #999; margin-top: 20px;">
                    Nếu bạn không yêu cầu xác minh này, vui lòng bỏ qua email này.
                </p>
                <p style="font-size: 14px; color: #999;">
                    Đây là email tự động, vui lòng không trả lời.
                </p>
            </div>
        `,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
};

const sendMailShared = async (email, fullName, id) => {
    const mailOptions = {
        from: 'trinhphuc980@gmail.com',
        to: email,
        subject: 'Thử thách',
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <h2 style="color: #333;">Thông báo chia sẻ thử thách từ ${fullName}</h2>
                <p style="font-size: 16px; color: #666;">
                    ${fullName} đã chia sẻ thử thách này đến bạn. Hãy ấn vào đây để tham gia thử thách:
                    <br />
                    <a href="http://localhost:3000/viewchallenge/${id}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Tham gia thử thách</a>
                </p>
                <p style="font-size: 14px; color: #999;">
                    Đây là email tự động, vui lòng không trả lời.
                </p>
            </div>
        `,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
};
const shareChallenge = async (email, fullName, id) => {
    try {
        const info = await sendMailShared(email, fullName, id);
        console.log('Email sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('Error sending email: ', error);
        throw error;
    }
    
}
const sendForgotPasswordEmail = async (email, password) => {
    const mailOptions = {
        from: "trinhphuc980@gmail.com",
        to: email,
        subject: 'Xác Minh Tài Khoản',
        html: `<p>Mật khẩu của bạn là : ${password}</p>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('Error sending email: ', error);
        throw error;
    }
};
/** 
 * @des Register an account
 * @author Trịnh Minh Phúc
 * @date 29/1/2024
 * @param {username, email, password} req
 * @param {} res
 * @returns 
 */
const registerUser = async (fullName ,username, email, password) => {
    try {
        const existingUser = await User.findOne({ username }).exec();
        if (existingUser) {
            return { error: 'Username exists', status: 404 };
        }
        const existingEmail = await User.findOne({ email }).exec();
        if (existingEmail) {
            return { error: 'Email exists', status: 404 };
        }
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            username,
            email,
            password: hashed,
            verificationCode: generateVerificationCode()
        });

        const user = await newUser.save();
        await sendVerificationEmail(user.email, user.verificationCode);

        const { password: userPassword, ...others } = user.toObject();
        return { user: others, message: 'Register successful. Please check your email for verification.' };
    } catch (error) {
        throw new Error(error.toString());
    }
};
const createUserProfile = async (userID , fullName ,profilePictureUrl ,backgroundPictureUrl,bio,connections,posts,address)=>{
    try {
        const newUserProfile = new UserProfile({
            userId: userID,
            fullName: fullName,
            profilePictureUrl: profilePictureUrl,
            backgroundPictureUrl: backgroundPictureUrl,
            bio: bio,
            connections: connections,
            posts: posts,
            address: address
        });
        const userProfile = await newUserProfile.save();
        return userProfile;
    } catch (error) {
        throw new Error(error.toString());
    }
}

/**
 * Generates an access token for the given user.
 *
 * @param {Object} user - The user object containing id and role.
 * @return {string} The generated access token.
 */
const genAccessToken = (user) => {
    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: "30s" }
    );
    return token;
};
/**
 * Generates a reference token for the given user.
 *
 * @param {Object} user - The user object
 * @return {string} The generated reference token
 */
const genRefToken = (user) => {
    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_REF_KEY,
        { expiresIn: "20d" }
    );
    return token;
};

/** 
 * @des Log in to your account
 * @author Trịnh Minh Phúc
 * @date 29/1/2024
 * @param {username,  password} req
 * @param {*} res
 * @returns 
 */
const loginUser = async (username, password, res) => {
    try {
        const user = await User.findOne({ username }).exec();
        if (!user) {
            return { error: `User with username '${username}' not found`, status: 404 };
        }

        if (!user.isVerified) {
            return { error: `Account is not verified.`, status: 400 };
        }
        if (!user.active) {
            return { error: `The account has been banned`, status: 403 };
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return { error: `Wrong Password`, status: 401 };
        } else {
            const accessToken = genAccessToken(user);
            const refToken = genRefToken(user);
            res.cookie("refToken", refToken, {
                httpOnly: true,
                secure: false,
                
                sameSite: "strict",
            });
            user.token = refToken;
            await user.save();
            const { password, role, token, ...info } = user.toObject();
            return { message: "Login successful", info, accessToken };
        }
    } catch (error) {
        throw new Error(error.toString());
    }
};

const banUserRepo = async (userId) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: userId },
            { $set: { active: false } },
            { new: true }
        ).exec();

        if (!user) {
            throw new Error(`User with ID '${userId}' not found`);
        }

        return { message: `User with ID '${userId}' has been banned`, status: 200 };
    } catch (error) {
        throw new Error(error.toString());
    }
};



/** 
 * @des Account authentication
 * @author Trịnh Minh Phúc
 * @date 30/1/2024
 * @param {verificationCode} req
 * @param {*} res
 * @returns 
 */
const verifyUser = async (verificationCode) => {
    try {
        const user = await User.findOne({ verificationCode }).exec();
        if (!user) {
            return { error: `Ma xac minh khong hop le`, status: 404 };
        }
        user.isVerified = true;
        user.verificationCode = undefined;
        await user.save();
        // Pass all required parameters to createUserProfile function
        console.log(`user_id: ${user._id}, user_fullName: ${user.fullName}`);
       
        await createUserProfile(user._id, user.fullName, user.profilePictureUrl, user.backgroundPictureUrl, user.bio, user.connections, user.posts, user.address);
        return { success: true, message: 'Xac minh thanh cong' };
    } catch (error) {
        throw new Error(error.toString());
    }
}



/**
 * Verifies the refresh token and returns a new access token.
 *
 * @param {string} refreshToken - The refresh token to verify
 * @return {Object} An object containing the new access token
 */
const verifyRefreshToken = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REF_KEY);
        const userId = decoded.id;
        const user = await User.findById(userId);
        if (!user || user.token !== refreshToken) {
            return { error: `Ma refToken khong hop le`, status: 404 };
        }
        const newAccessToken = genAccessToken(user);
        return { accessToken: newAccessToken };
    } catch (error) {
        throw new Error("Mã refresh token không hợp lệ");
    }
};
/**
 * Logout the user by invalidating the refresh token.
 *
 * @param {string} refreshToken - The refresh token of the user
 * @return {boolean} Indicates if the user was successfully logged out
 */
const logout = async (refreshToken) => {
    try {
        if (!refreshToken) {
            return false;
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REF_KEY);
        const userId = decoded.id;
        const user = await User.findById(userId);
        if (!user) {
            return false;
        }

        user.token = undefined;
        await user.save();
        return true;
    } catch (error) {
        console.error("Error in logout:", error);
        return false;
    }
};
const forgotPassword = async (email) => {
    try {
        const user = await User.findOne({ email }).exec();
        if (!user) {
            return { error: `Không tìm thấy email`, status: 404 };
        }
        if (!user.isVerified) {
            return { error: `Account is not verified.`, status: 400 };
        }
        if (!user.active) {
            return { error: `The account has been banned`, status: 403 };
        }
        const newpass =generateNewPassword();
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(newpass, salt);
        user.password = hashed;
        await user.save();
        await sendForgotPasswordEmail(user.email, newpass);
        return { message: 'Forgot password successful. Please check your email for new password' };


    } catch (error) {
        throw new Error(error.toString());
    }
}





export default { registerUser, genAccessToken, genRefToken, loginUser, verifyUser, verifyRefreshToken, logout,forgotPassword,banUserRepo ,shareChallenge}
