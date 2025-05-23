export default function Validation({ value, rules = [] }) {
    let errorMessage = '';

    for (let i = 0; i < rules.length; i++) {
        errorMessage = rules[i].test(value);
        if (errorMessage) {
            break;
        }
    }

    return errorMessage;
}

Validation.isRequired = function (message) {
    return {
        test: function (value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập khung này.';
        },
    };
};

Validation.minWord = function (count, message) {
    return {
        test: function (value) {
            const cOW = value.trim().split(' ').length;
            return cOW >= count ? undefined : message || `Cần ít nhất ${count} từ trong khung này.`;
        },
    };
};

Validation.minLetterEachWord = function (count, message) {
    return {
        test: function (value) {
            const words = value.trim().split(' ');
            const isInValid = words.some((word) => word.length < count);
            return !isInValid ? undefined : message || `Mỗi từ cần ít nhất ${count} kí tự trong khung này.`;
        },
    };
};

Validation.minLetter = function (count, message) {
    return {
        test: function (value) {
            return value.length >= count
                ? undefined
                : message || `Vui lòng nhập ít nhất ${count} kí tự trong khung này.`;
        },
    };
};

Validation.nonSpecialLetter = function (message) {
    return {
        test: function (value) {
            const regex = /^[a-zA-Z0-9]*$/;
            return regex.test(value) ? undefined : message || 'Vui lòng không nhập kí tự đặc biệt trong khung này.';
        },
    };
};

Validation.maxLength = function (max, message) {
    return {
        test: function (value) {
            return value.length <= max ? undefined : message || `Vui lòng không nhập quá ${max} kí tự trong khung này.`;
        },
    };
};

Validation.isLinkWeb = function (message) {
    return {
        test: function (value) {
            if (value === '') return undefined;
            const regex =
                /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;
            return regex.test(value.trim()) ? undefined : message || 'Vui lòng nhập một liên kết web hợp lệ.';
        },
    };
};

Validation.isSocialLink = function (social = '', message) {
    return {
        test: function (value) {
            if (value === '') return undefined;
            let regex = '';

            if (social === 'linkedin') {
                regex = new RegExp(
                    `^(https?:\\/\\/)?(www\\.)?linkedin\\.com\\/in\\/[A-Za-z0-9_-]+(\\/[A-Za-z0-9_-]+)*\\/?$`,
                );
                return regex.test(value.trim()) ? undefined : message || `Vui lòng nhập một liên kết Linkedin hợp lệ.`;
            } else if (social === 'email') {
                regex = new RegExp(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`);
                return regex.test(value.trim()) ? undefined : message || `Vui lòng nhập một địa chỉ email hợp lệ.`;
            } else {
                regex = new RegExp(
                    `^(https?:\\/\\/)?(www\\.)?${social}\\.com\\/[A-Za-z0-9_-]+(\\/[A-Za-z0-9_-]+)*\\/?$`,
                );
                return regex.test(value.trim()) ? undefined : message || `Vui lòng nhập một liên kết ${social} hợp lệ.`;
            }
        },
    };
};

Validation.isConfirmPassWord = function (password, message) {
    return {
        test: function (value) {
            if (value !== password) {
                return message || 'Mật khẩu không khớp.';
            }
        },
    };
};
