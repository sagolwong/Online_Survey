const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    data.firstname = !isEmpty(data.firstname) ? data.firstname : "";
    data.lastname = !isEmpty(data.lastname) ? data.lastname : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";

    // Firstname checks
    if (Validator.isEmpty(data.firstname)) {
        errors.firstname = "กรุณากรอกชื่อของคุณ";
    }

    // Lastname checks
    if (Validator.isEmpty(data.lastname)) {
        errors.lastname = "กรุณากรอกนามสกุลของคุณ";
    }

    // Email checks
    if (Validator.isEmpty(data.email)) {
        errors.email = "กรุณากรอกอีเมลของคุณ";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "อีเมลของคุณไม่อยู่ในระบบ";
    }

    // Password checks
    if (Validator.isEmpty(data.password)) {
        errors.password = "กรุณากรอกรหัสผ่านของคุณ";
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "กรุณากรอกรหัสผ่านของคุณอีกครั้ง";
    }

    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "รหัสผ่านต้องมีจำนวนไม่น้อยกว่า 6 ตัว และไม่เกิน 30 ตัว";
    }

    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "รหัสผ่านไม่ตรงกัน";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};