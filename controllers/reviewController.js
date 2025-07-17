import Review from "../models/review.js";
import Product from "../models/product.js";

//create a new review
export async function createReview(req,res){
    if(!req.user){
        res.status(403).json({
            message:"please login and try again"
        })
        return
    }
    const { productId, rating, comment } = req.body;
    const userEmail = req.user.email;
    const userName = req.user.firstName + " " + req.user.lastName;

    try {
        // Generate reviewId (e.g., R0001)
        let reviewId = "R00001";
        const lastReview = await Review.find().sort({ date: -1 }).limit(1);
        if (lastReview.length > 0) {
            const lastIdNum = parseInt(lastReview[0].reviewId.replace("R", ""));
            reviewId = "R" + String(lastIdNum + 1).padStart(5, "0");
        }

        const newReview = new Review({
            reviewId,
            productId,
            userEmail,
            userName,
            rating,
            comment,
        });

        const saved = await newReview.save();
        res.status(201).json({ message: "Review submitted", review: saved });
    } catch (error) {
        res.status(500).json({ message: "Failed to submit review", error });
    }
}

// Get all reviews for a product
export async function getReviewsByProduct(req, res) {
    const { productId } = req.params;
    try {
        const reviews = await Review.find({ productId });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch reviews", error });
    }
}

// Update an existing review
export async function updateReview(req, res) {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    try {
        const review = await Review.findOne({ reviewId });

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Only the user who posted the review can update it
        if (req.user.email !== review.userEmail && req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not allowed to update this review" });
        }

        // Update fields
        if (rating != null) review.rating = rating;
        if (comment != null) review.comment = comment;

        const updated = await review.save();
        res.json({ message: "Review updated successfully", review: updated });
    } catch (error) {
        res.status(500).json({ message: "Failed to update review", error });
    }
}

// Delete a review (optional: only allow user's own review or admin)
export async function deleteReview(req, res) {
    const { reviewId } = req.params;
    try {
        const review = await Review.findOne({ reviewId });

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Optional: Only the user who posted or admin can delete
        if (req.user.email !== review.userEmail && req.user.role !== "admin") {
            return res.status(403).json({ message: "You can't delete this review" });
        }

        await Review.deleteOne({ reviewId });
        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete review", error });
    }
}