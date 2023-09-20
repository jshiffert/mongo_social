const { ThoughtModel, UserModel } = require('../models');
const thoughtController = {
  // get thoughts

  async getThoughts(req, res) {
    try {
      const dbThoughtData = await ThoughtModel.find()
        .sort({ createdAt: -1 });
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // get one thought
  async getSingleThought(req, res) {
    try {
      const dbThoughtData = await ThoughtModel.findOne({ _id: req.params.thoughtId });
      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought id!' });
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // create anew thought
  async createThought(req, res) {
    try {
      const dbThoughtData = await ThoughtModel.create(req.body);
      const dbUserData = await UserModel.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: dbThoughtData._id } },
        { new: true }
      );
      if (!dbUserData) {
        return res.status(404).json({ message: 'Thought created but no user with this id!' });
      }
      res.json({ message: 'Thought successfully created!' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // update thought by id
  async updateThought(req, res) {
    const dbThoughtData = await ThoughtModel.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true });
    if (!dbThoughtData) {
      return res.status(404).json({ message: 'No thought with this id!' });
    }
    res.json(dbThoughtData);
    console.log(err);
    res.status(500).json(err);
  },

  // delete thought by id
  async deleteThought(req, res) {
    try {
      const dbThoughtData = await ThoughtModel.findOneAndRemove({ _id: req.params.thoughtId })
      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought id!' });
      }
      
      const dbUserData = UserModel.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );
      if (!dbUserData) {
        return res.status(404).json({ message: 'Thought created but no user id!' });
      }
      res.json({ message: 'Thought deleted!' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // add reaction
  async addReaction(req, res) {
    try {
      const dbThoughtData = await ThoughtModel.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );
      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought id!' });
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // remove reaction
  async removeReaction(req, res) {
    try {
      const dbThoughtData = await ThoughtModel.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );
      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought id!' });
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};
module.exports = thoughtController;