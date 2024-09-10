const User = require('./User');

async function registerUser(username, password) {
    const user = new User({ username, password });
    await user.save();
    return user;
}

async function authenticateUser(username, password) {
    const user = await User.findOne({ username });
    if (!user) throw new Error('Usuário não encontrado');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Senha incorreta');

    return user;
}

module.exports = { registerUser, authenticateUser };
