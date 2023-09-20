const { UserModel, ThoughtModel } = require('../models');
const userController = {
  // get users
  async getUsers(req, res) {
    try {
      const dbUserData = await UserModel.find()
        .select('-__v')
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },


  // get one user
  async getSingleUser(req, res) {
    try {
      const dbUserData = await UserModel.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate('friends')
        .populate('thoughts');
      if (!dbUserData) {
        return res.status(404).json({ message: 'No user id!' });
      }
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },


  // create user
  async createUser(req, res) {
    try {
      const dbUserData = await UserModel.create(req.body);
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },


  // update user
  async updateUser(req, res) {
    try {
      const dbUserData = await UserModel.findOneAndUpdate(
        { _id: req.params.userId },
        {
          $set: req.body,
        },
        {
          runValidators: true,
          new: true,
        }
      );
      if (!dbUserData) {
        return res.status(404).json({ message: 'No user id!' });
      }
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // delete user
  async deleteUser(req, res) {
    try {
      const dbUserData = await UserModel.findOneAndDelete({ _id: req.params.userId })
      if (!dbUserData) {
        return res.status(404).json({ message: 'No user id!' });
      }
      await ThoughtModel.deleteMany({ _id: { $in: dbUserData.thoughts } });
      res.json({ message: 'User and thoughts deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },


  // add friend
  async addFriend(req, res) {
    try {
      const dbUserData = await UserModel.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId } }, { new: true });
      if (!dbUserData) {
        return res.status(404).json({ message: 'No user id!' });
      }
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // remove friend
  async removeFriend(req, res) {
    try {
      const dbUserData = await UserModel.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true });
      if (!dbUserData) {
        return res.status(404).json({ message: 'No user!' });
      }
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};
module.exports = userController;