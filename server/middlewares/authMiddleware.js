/*import jwt from "jsonwebtoken"
import User from "../models/user.js"

const protectRoute = async (req, res, next) => {
    try {
        let token = req.cookies?.token

        if (token) {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

            const resp = await User.findById(decodedToken.userId).select(
                "isAdmin email"
            )

            req.user = {
                email: resp.email,
                isAdmin: resp.isAdmin,
                userId: decodedToken.userId,
            }

            next()
        } else {
            return res
                .status(401)
                .json({
                    status: false,
                    message: "Not authorized. Try login again.",
                })
        }
    } catch (error) {
        console.error(error)
        return res
            .status(401)
            .json({
                status: false,
                message: "Not authorized. Try login again.",
            })
    }
}

const isAdminRoute = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        return res.status(401).json({
            status: false,
            message: "Not authorized as admin. Try login as admin.",
        })
    }
}

export { isAdminRoute, protectRoute }
*/
//
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protectRoute = async (req, res, next) => {
    try {
        console.log("Cookies:", req.cookies);

        let token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                status: false,
                message: "No token found. Not authorized.",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select(
            "isAdmin email"
        );

        if (!user) {
            return res.status(401).json({
                status: false,
                message: "User not found.",
            });
        }

        req.user = {
            email: user.email,
            isAdmin: user.isAdmin,
            userId: decoded.userId,
        };

        next();
    } catch (error) {
        console.log("AUTH ERROR:", error);

        return res.status(401).json({
            status: false,
            message: "Not authorized. Token failed.",
        });
    }
};

const isAdminRoute = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return res.status(401).json({
            status: false,
            message: "Not authorized as admin.",
        });
    }
};

export { protectRoute, isAdminRoute };

