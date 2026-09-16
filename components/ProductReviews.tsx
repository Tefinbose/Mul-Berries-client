"use client";

import { CheckCircle2, Star } from "lucide-react";
import { useState } from "react";

type Review = {
  id: number;
  name: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
};

const initialReviews: Review[] = [
  {
    id: 1,
    name: "Priya",
    rating: 5,
    title: "Beautiful saree",
    comment:
      "The saree looks elegant and the quality is very good.",
    date: "2 weeks ago",
    verified: true,
    helpful: 12,
  },
  {
    id: 2,
    name: "Anjali",
    rating: 4,
    title: "Lovely colour",
    comment:
      "Very nice finish and the colour looks beautiful in person.",
    date: "1 month ago",
    verified: true,
    helpful: 8,
  },
];

export default function ProductReviews() {
  const [reviews, setReviews] = useState(initialReviews);

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const averageRating =
    reviews.length === 0
      ? 0
      : reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length;

  const submitReview = () => {
    if (!rating || !title.trim() || !comment.trim()) {
      alert("Please complete your review.");
      return;
    }

    const newReview: Review = {
      id: Date.now(),
      name: "You",
      rating,
      title,
      comment,
      date: "Just now",
      verified: false,
      helpful: 0,
    };

    setReviews((current) => [newReview, ...current]);

    setRating(0);
    setTitle("");
    setComment("");

    alert("Review submitted successfully.");
  };

  return (
    <section className="border-t border-neutral-200 pt-12">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
          Reviews
        </p>

        <h2 className="mt-2 text-2xl font-semibold">
          Customer Reviews
        </h2>
      </div>

      {/* Rating */}
      <div className="mt-8 rounded-2xl bg-neutral-50 p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="text-4xl font-semibold">
              {averageRating.toFixed(1)}
            </div>

            <div className="mt-2 flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  fill={
                    star <= Math.round(averageRating)
                      ? "currentColor"
                      : "none"
                  }
                />
              ))}
            </div>

            <p className="mt-2 text-sm text-neutral-500">
              {reviews.length} reviews
            </p>
          </div>
        </div>
      </div>

      {/* Write Review */}
      <div className="mt-8 rounded-2xl border border-neutral-200 p-6">
        <h3 className="font-semibold">Write a Review</h3>

        <div className="mt-5">
          <p className="text-sm font-medium">
            Your Rating
          </p>

          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
              >
                <Star
                  size={22}
                  fill={star <= rating ? "currentColor" : "none"}
                />
              </button>
            ))}
          </div>
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Review title"
          className="mt-5 w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-900"
        />

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          rows={4}
          className="mt-3 w-full resize-none rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-900"
        />

        <button
          type="button"
          onClick={submitReview}
          className="mt-4 rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Submit Review
        </button>
      </div>

      {/* Reviews */}
      <div className="mt-8 space-y-6">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="border-b border-neutral-200 pb-6"
          >
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={15}
                  fill={
                    star <= review.rating
                      ? "currentColor"
                      : "none"
                  }
                />
              ))}
            </div>

            <h3 className="mt-3 font-medium">
              {review.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-neutral-600">
              {review.comment}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
              <span>{review.name}</span>

              {review.verified && (
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  Verified Purchase
                </span>
              )}

              <span>{review.date}</span>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-6 text-xs text-neutral-400">
        Reviews are currently stored locally for development.
        Purchase verification and moderation will be connected to
        the backend later.
      </p>
    </section>
  );
}