import ReviewTable from "./ReviewTable";
import type { ReviewListProps } from "@/types/movie.types";

function ReviewList(props: ReviewListProps) {
  return (
    <>
      <ReviewTable {...props} />
    </>
  );
}

export default ReviewList;
