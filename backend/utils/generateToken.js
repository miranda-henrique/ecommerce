import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        //With
        process.env.JWT_SECRET,
        //Options
        {
            expiresIn: '30d',
        });
};

export default generateToken;