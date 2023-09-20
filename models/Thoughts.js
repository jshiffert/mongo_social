const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');



// thought schema X
const thoughtsSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  reactions: [
    reactionSchema
  ]},
  {
    toJSON: {
      getters: true
    },
    id: false
  }
);

thoughtsSchema.virtual("reactionCount").get(function(){
  return this.reactions.length;

});


const ThoughtModel = model('Thought', thoughtsSchema);

module.exports = ThoughtModel;
