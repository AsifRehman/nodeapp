const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByUserName, getUserById) {
  console.log("initalized")
  const authenticateUser = async (username, password, done) => {
    console.log("authenticating")

    console.log(username)
    console.log(password)
    const user = getUserByUserName(username)
    if (user == null) {
      return done(null, false, { message: 'No user with that username' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((username, done) => {
    return done(null, getUserById(user.id))
  })
}

module.exports = initialize