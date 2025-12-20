type RatingBadgeProps = {
  rating?: string | null;
};

const getRatingImage = (rating?: string | null): string | null => {
  if (!rating) return null;

  // 숫자 추출
  const match = rating.match(/\d+/);
  const age = match ? Number(match[0]) : null;

  // 19세 / 청불
  if (
    (age !== null && age >= 19) ||
    rating.includes("청소년") ||
    rating.includes("제한")
  ) {
    return "/images/rating/19.png";
  }

  // 15세
  if (age !== null && age >= 15) {
    return "/images/rating/15.png";
  }

  // 12세
  if (age !== null && age >= 12) {
    return "/images/rating/12.png";
  }

  // 전체
  if (rating.includes("전체") || rating.includes("ALL")) {
    return "/images/rating/all.png";
  }

  return null;
};

const RatingBadge = ({ rating }: RatingBadgeProps) => {
  const src = getRatingImage(rating);

  if (!src) return null;

  return (
    <img
      src={src}
      alt={rating ?? "관람등급"}
      style={{ width: 24, height: 24 }}
    />
  );
};

export default RatingBadge;
