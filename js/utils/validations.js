const validation = {
  isEmpty: (value) => {
    if (value === "") {
      return "Password cannot be empty";
    } else {
      return undefined;
    }
  },
  validateEmail: (email) => {
    const emailRegEx =
      /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (email === "") {
      return "Email cannot be empty!";
    } else if (!emailRegEx.test(email)) {
      return "Invalid email";
    } else {
      return undefined;
    }
  },
  validateName: (name) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (name === "") {
      return "Name cannot be empty!";
    } else if (!nameRegex.test(name)) {
      return "Name can only contain alphabets";
    } else if (name.length <= 2) {
      return "Name must be greater than 2 letters";
    } else if (name.length >= 19) {
      return "Name must be lesser than 20 letters";
    } else {
      return undefined;
    }
  },
  validateUsername: (username) => {
    const usernameRegex =
      /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/;
    if (username === "") {
      return "Username cannot be empty!";
    } else if (username.length <= 2) {
      return "Username must be greater than 2 letters";
    } else if (username.length > 14) {
      return "Username must be lesser than 14 letters";
    } else if (!usernameRegex.test(username)) {
      return "Username cannot have special characters";
    } else {
      return undefined;
    }
  },
  validatePassword: (password) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!^%*#?()&{}_]{6,}$/;
    if (password === "") {
      return "Password cannot be empty!";
    } else if (password.length < 6) {
      return "Password must be greater than 6 letters";
    } else if (password.length > 14) {
      return "Password must be lesser than 14 letters";
    } else if (!passwordRegex.test(password)) {
      return "Password must be a mixture of alphabets and numbers";
    } else {
      return undefined;
    }
  },
  validatePhone: (phone) => {
    const phoneRegEx = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
    if (phone === "") {
      return "Phone number cannot be empty!";
    } else if (!phoneRegEx.test(phone)) {
      return "Invalid phone number!";
    } else {
      return undefined;
    }
  },
};

const getValidationFunction = (type) => {
  const validateFunctionMapper = {
    isEmpty: "isEmpty",
    name: "validateName",
    username: "validateUsername",
    password: "validatePassword",
    email: "validateEmail",
    phone: "validatePhone",
  };

  return validation[validateFunctionMapper[type]];
};

export default getValidationFunction;
