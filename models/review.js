import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    reviewId: {
        type: String,
        required: true,
        unique: true,
    },
    productId: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
