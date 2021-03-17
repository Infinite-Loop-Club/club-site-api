const adminOnly = (req, res, next) => {
  const { authorization } = req.headers;
  if (String(authorization).split(' ')[1] !== process.env.auth) {
    return res.status(401).json({ message: 'You are not allowed to perform this operation' });
  } else {
    next();
  }
};

export default adminOnly;
