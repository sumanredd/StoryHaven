'use client';
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import './page.css'

export default function RecentBooks() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const [recentBooks, setRecentBooks] = useState([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("recentBooks");
    if (stored) setRecentBooks(JSON.parse(stored));
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  if (!recentBooks.length) return null;

  return (
    <div className="recentBooksSection">
      <h2 className="sectionHeading">Recently Viewed Books</h2>
      <div className="scrollContainerWrapper">
        <button className="scrollButton left" onClick={scrollLeft}>&lt;</button>
        <div className="scrollContainer" ref={scrollRef}>
          {recentBooks.map((book, idx) => (
            <div
              key={idx}
              className="recentBookCard"
              onClick={() => router.push(`/book?url=${encodeURIComponent(book.link)}`)}
            >
              {book.image && <img src={book.image} alt={book.title} className="recentBookImage" />}
              <p className="recentBookTitle">{book.title}</p>
              {book.author && <p className="recentBookAuthor">{book.author}</p>}
              {book.price && <p className="recentBookPrice">{book.price}</p>}
            </div>
          ))}
        </div>
        <button className="scrollButton right" onClick={scrollRight}>&gt;</button>
      </div>
    </div>
  );
}
