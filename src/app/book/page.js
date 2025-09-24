'use client';
import { useState, useEffect, useRef } from "react";
import Navbar from "../components/NavBar/page";
import { FaSpinner } from "react-icons/fa";
import { useSearchParams, useRouter } from "next/navigation";
import './Individualpage.css';

export default function IndividualContainer() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const [bookDetail, setBookDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const router = useRouter();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!url) return;

    const getBookDetail = async () => {
      setIsLoading(true);

      // ✅ Check sessionStorage first
      const cached = sessionStorage.getItem(`book-${url}`);
      if (cached) {
        setBookDetail(JSON.parse(cached));
        setIsLoading(false);
        return;
      }

      // Fetch from backend
      try {
        const res = await fetch(`http://localhost:3001/scrape/book-detail?url=${encodeURIComponent(url)}`);
        const data = await res.json();

        if (!data || data.error) {
          setFetchError("Book details not found.");
          setBookDetail(null);
        } else {
          setBookDetail(data);
          sessionStorage.setItem(`book-${url}`, JSON.stringify(data));
          setFetchError(null);
        }
      } catch (err) {
        console.error("Error fetching book detail:", err);
        setFetchError("Failed to fetch book details.");
      } finally {
        setIsLoading(false);
      }
    };

    getBookDetail();
  }, [url]);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  if (fetchError) return <p className="errorText">{fetchError}</p>;

  // Skeleton component
  const SkeletonLoader = () => (
    <div className="skeleton-container">
      <div className="skeleton-image animate-pulse"></div>
      <div className="skeleton-text animate-pulse" style={{ width: '60%' }}></div>
      <div className="skeleton-text animate-pulse" style={{ width: '40%' }}></div>
      <div className="skeleton-text animate-pulse" style={{ width: '80%' }}></div>
    </div>
  );

  return (
    <>
      <Navbar />
      {isLoading || !bookDetail ? (
        <SkeletonLoader />
      ) : (
        <div className="IndividualContainer">
          {/* Title & Author */}
          <div className="titleAuthorContainer">
            {bookDetail.image && <img src={bookDetail.image} alt={bookDetail.title} className="individualImage" />}
            <div className="titleOrder">
              {bookDetail.title && <h1 className="individualTitle">{bookDetail.title}</h1>}
              {bookDetail.price && <p className="individualPrice">{bookDetail.price}</p>}
              {bookDetail.trustpilot && (
                <div className="trustpilotSection">
                  <h2 className="trustpilotTitle">Customer Reviews</h2>
                  <p className="trustpilotRating">
                    ⭐ {bookDetail.trustpilot.rating || "3.6"} / 5
                  </p>
                  <p className="trustpilotReviews">
                    ({bookDetail.trustpilot.reviews || "1000+"} reviews)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          {bookDetail.aboutBook && (
            <div className="summaryContainer">
              <div className="individualSummary">
                <h2 className="summaryTitle">Summary</h2>
                <p className="summaryText">{bookDetail.aboutBook}</p>
              </div>
            </div>
          )}

          {/* You Might Also Like */}
          {bookDetail.youMightAlsoLike?.length > 0 && (
            <div className="youMightAlsoLikeSection">
              <h2 className="sectionHeading">You Might Also Like</h2>
              <div className="scrollContainerWrapper">
                <button className="scrollButton left" onClick={scrollLeft}>&lt;</button>
                <div className="scrollContainer" ref={scrollRef}>
                  {bookDetail.youMightAlsoLike.map((book, idx) => (
                    <div
                      key={idx}
                      className="youMightAlsoLikeCard"
                      onClick={() => router.push(`/book?url=${encodeURIComponent(book.link)}`)}
                    >
                      {book.image && <img src={book.image} alt={book.title} className="youMightAlsoLikeImage" />}
                      <p className="youMightAlsoLikeTitle">{book.title}</p>
                      {book.author && <p className="youMightAlsoLikeAuthor">{book.author}</p>}
                      {book.price && <p className="youMightAlsoLikePrice">{book.price}</p>}
                    </div>
                  ))}
                </div>
                <button className="scrollButton right" onClick={scrollRight}>&gt;</button>
              </div>
            </div>
          )}

          {/* Reviews */}
          {bookDetail.reviews?.length > 0 && (
            <div className="individualReviews">
              <h2 className="reviewsTitle">Reviews</h2>
              <ul className="reviewsList">
                {bookDetail.reviews.map((review, idx) => (
                  <li key={idx} className="reviewItem">{review}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Author Info */}
          {bookDetail.aboutAuthor && (
            <div className="authorContainer">
              <div className="individualAuthorSection">
                <h2 className="authorTitle">About the Author</h2>
                <p className="authorText">{bookDetail.aboutAuthor}</p>
              </div>
            </div>
          )}

          {/* Additional Info */}
          {bookDetail.additionalInfoTable?.length > 0 && (
            <div className="additionalInfoSection">
              <h2 className="additionalInfoTitle">Additional Information</h2>
              <table className="additionalInfoTable">
                <tbody>
                  {bookDetail.additionalInfoTable.map((row, idx) => (
                    <tr key={idx} className="additionalInfoRow">
                      <td className="additionalInfoKey">{row.key}</td>
                      <td className="additionalInfoValue">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
}
