const isPassword = (password: string) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/; 
    return re.test(password);
};

export {isPassword};