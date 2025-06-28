export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken();

  const userData = { ...user._doc };
  delete userData.password;
  delete userData.verificationCode;
  delete userData.verificationExpire;

  res.status(statusCode)
    .cookie("token", token, {
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .json({
      success: true,
      message,
      token,
      user: userData,
    });
};
