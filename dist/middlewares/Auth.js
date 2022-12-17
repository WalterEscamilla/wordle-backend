import jwt from "jsonwebtoken";
export const Auth = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            res.status(404).json({
                success: false,
                message: 'Unauthorized / no token found',
            });
        }
        else {
            const data = jwt.verify(token, process.env.TOKEN_SECRET);
            req.userId = data.id;
            next();
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
