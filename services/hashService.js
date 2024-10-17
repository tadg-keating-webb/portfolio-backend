const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashService = () => ({
    hashPassword: async (password) => {
        try {
            return await bcrypt.hash(password, saltRounds);
        } catch (error) {
            console.error('Error hashing password:', error);
            throw error;
        }
    },
    comparePasswords: async (password, hash) => {
        try {
            return await bcrypt.compare(password, hash);
        } catch (error) {
            console.error('Error comparing passwords:', error);
            throw error;
        }
    }
});

module.exports = hashService;
