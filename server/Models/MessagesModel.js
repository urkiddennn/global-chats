import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Message content is required'],
        trim: true,
        minlength: [1, 'Message content must be at least 1 character long'],
        maxlength: [500, 'Message content cannot exceed 500 characters'],
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the Users model
        required: [true, 'Sender is required'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Index for faster queries on createdAt (useful for sorting messages by time)
messageSchema.index({ createdAt: -1 });

const Messages = mongoose.model('Messages', messageSchema);

export default Messages;
