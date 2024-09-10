const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const users = require('./users.json'); // Substitua por um banco de dados real

passport.use(new LocalStrategy(
    function(username, password, done) {
        // Lógica de autenticação
        const user = users.find(user => user.username === username);
        if (!user) {
            return done(null, false, { message: 'Usuário não encontrado' });
        }
        if (user.password !== password) {
            return done(null, false, { message: 'Senha incorreta' });
        }
        return done(null, user);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    const user = users.find(user => user.id === id);
    done(null, user);
});