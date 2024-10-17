const { program } = require('commander');
const User = require('../models/user');
const mongoose = require('mongoose');
require('dotenv').config();
const hashService = require('../services/hashService')();

const setupDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

const saveUser = async (email, password) => {
    console.log('password', password);
    const hashedPassword = await hashService.hashPassword(password);

    const userExists = await User.findOne({ email });

    if (userExists) {
        throw new Error('User already exists');
    }

    const user = new User({ email, "password": hashedPassword });
    await user.save();
};

program
    .command('add-user')
    .description('Add a new user')
    .requiredOption('-e, --email <email>', 'User email')
    .requiredOption('-p, --password <password>', 'User password')
    .action(async (options) => {
        const { email, password } = options;

        await setupDB();

        try {
            await saveUser(email, password);
            console.log(`User "${email}" has been added successfully.`);
        } catch (error) {
            console.log(error.message);
        }

        process.exit(1);
    });

program.parse(process.argv);
