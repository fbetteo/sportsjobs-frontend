// passwordValidator.ts
export const validatePasswordStrength = (password: string): string | null => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        return 'Password must be at least 8 characters long, one Uppercase letter, one lowercase letter and one number.';
    }
    if (!hasUpperCase) {
        return 'Password must be at least 8 characters long, one Uppercase letter, one lowercase letter and one number.';
    }
    if (!hasLowerCase) {
        return 'Password must be at least 8 characters long, one Uppercase letter, one lowercase letter and one number.';
    }
    if (!hasNumber) {
        return 'Password must be at least 8 characters long, one Uppercase letter, one lowercase letter and one number.';
    }
    // if (!hasSpecialChar) {
    //     return 'Password must contain at least one special character.';
    // }

    return null;
};
