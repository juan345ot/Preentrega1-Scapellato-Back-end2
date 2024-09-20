const User = require('../models/User');
const bcrypt = require('bcrypt');

class UserManager {
  async createUser(userData) {
    try {
      const hashedPassword = bcrypt.hashSync(userData.password, 10);
      const newUser = new User({ ...userData, password: hashedPassword });
      await newUser.save();
      return newUser;
    } catch (error) {
      throw new Error('Error al crear el usuario: ' + error.message);
    }
  }

  async getUserById(uid) {
    try {
      const user = await User.findById(uid).populate('cart');
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      return user;
    } catch (error) {
      throw new Error('Error al obtener el usuario: ' + error.message);
    }
  }

  async updateUser(uid, userData) {
    try {
      const user = await User.findById(uid);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      if (userData.password) {
        userData.password = bcrypt.hashSync(userData.password, 10);
      }
      Object.assign(user, userData);
      await user.save();
      return user;
    } catch (error) {
      throw new Error('Error al actualizar el usuario: ' + error.message);
    }
  }

  async deleteUser(uid) {
    try {
      const user = await User.findByIdAndDelete(uid);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      return user;
    } catch (error) {
      throw new Error('Error al eliminar el usuario: ' + error.message);
    }
  }
}

module.exports = UserManager;