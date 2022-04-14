import jwt from "jsonwebtoken";
const generateActiveToken = (payload: object) => {
  console.log(process.env.ACTIVE_TOKEN);
  return jwt.sign(payload, `${process.env.ACTIVE_TOKEN}`, { expiresIn: "10m" });
};
const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, `${process.env.ACCESS_TOKEN}`, { expiresIn: "15m" });
};
const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, `${process.env.REFRESH_TOKEN}`, {
    expiresIn: "30d",
  });
};
export { generateAccessToken, generateRefreshToken, generateActiveToken };
