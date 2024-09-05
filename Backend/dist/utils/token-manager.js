import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";
export const createToken = (id, email, expiresIn) => {
    const payLoad = { id, email };
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payLoad, secret, { expiresIn });
    return token;
};
export const verifyToken = async (req, res, next) => {
    const token = req.signedCookies[`${COOKIE_NAME}`];
    if (!token || token.trim() === '') {
        return res.status(401).json({ message: 'Token Not Received' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.locals.jwtData = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Token Expired' });
    }
};
//# sourceMappingURL=token-manager.js.map