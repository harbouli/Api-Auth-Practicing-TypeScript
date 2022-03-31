import { Response, Request, NextFunction } from "express";

const ValidationRegistry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstname, lastname, password, account } = req.body;
  if (!firstname || !lastname || !password || !account)
    return res.status(400).json({ message: "Field All Required" });

  if (firstname.length > 20 && lastname.length > 20)
    return res
      .status(400)
      .json({ message: "First Name And Last Name Must Be Less then 20!" });

  //   Check If Acount Is Valid
  if (!validatePhone(account) && !validateEmail(account))
    return res.status(400).json({ message: "Your Account is Not Valid" });

  // Check If Password Is Valid
  if (password.length < 8)
    return res
      .status(400)
      .json({ message: "Your Password Must Be At least 8 characters" });

  next();
};

// Phone Validation
export const validatePhone = (phone: string) => {
  const re =
    /^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/gm;

  return re.test(phone);
};

// Email Validation
export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
export { ValidationRegistry };
