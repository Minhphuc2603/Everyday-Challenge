import jwt from 'jsonwebtoken'


const listByPassURL = [
    '/login',
    '/register',
    '/forgot' ,
    '/refresh', 
    '/logout',
]
const listByPassPART = [
    '/verify'
]
function checkExistURL(url) {
    const result = listByPassURL.find(u => u.toLocaleLowerCase().trim() == url.toLowerCase().trim())
    if (result)
        return true
    else
        return false
}
function checkExistPART(url) {
    const result = listByPassPART.find(u => url.startsWith(u.toLocaleLowerCase().trim()));
    return !!result;
}
/** 
 * @des Check Token
 * @author Trịnh Minh Phúc
 * @date 30/1/2024
 * @param {token} req
 * @param {} res
 * @returns 
 */
const checkToken = (req, res, next) => {
    if (checkExistURL(req.url) || checkExistPART(req.path)) {
        next();
        return;
    }
    try {
        const token = req.headers?.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({
                message: 'Unauthorized'
            });
            return;
        }
        jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, jwtObject) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    res.status(400).json({
                        message: 'Access token expired',
                        expiredAt: err.expiredAt
                    });
                } else {
                    res.status(500).json({
                        message: err.message
                    });
                }
                return;
            }
            req.jwtObject = jwtObject;
            next();
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
/** 
 * @des Check Authorization
 * @author Trịnh Minh Phúc
 * @date 30/1/2024
 * @param {token , role} req
 * @param {} res
 * @returns 
 */
const checkAuthorization = (req, res, next) => {
    try {
        if (checkExistURL(req.url) || checkExistPART(req.path)) {
            next();
            return;
        }
        const role = req.jwtObject?.role; 
        if (role === 0) {
            next();
        } else {
            res.status(403).json({
                message: 'Forbidden - Insufficient role'
            });
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export { checkToken, checkAuthorization };