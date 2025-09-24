'use client';
import { useState, useEffect } from "react";
import Navbar from "../NavBar/page";
import CategoryMenuHover from "../NavBar/categoryDropdown";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Pagination } from "@mui/material";
import RecentBooks from "../RecentBooks/page";
import './page.css';

const PAGE_SIZE = 10;

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "mindset";

  const [bookList, setBookList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState(queryParam);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getBookData = async (query) => {
    if (!query.trim()) return;
    setIsLoading(true);

    const cached = sessionStorage.getItem(`search-${query}`);
    if (cached) {
      const cachedBooks = JSON.parse(cached);
      setBookList(cachedBooks);
      setTotalPages(Math.ceil(cachedBooks.length / PAGE_SIZE));
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/scrape/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      const products = data.products || [];

      setBookList(products);
      setTotalPages(Math.ceil(products.length / PAGE_SIZE));
      sessionStorage.setItem(`search-${query}`, JSON.stringify(products));
    } catch (err) {
      console.error(err);
      setBookList([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    getBookData(queryParam);
  }, []);

  const handleSearch = () => {
    if (!input.trim()) return;
    router.replace(`/?q=${encodeURIComponent(input)}`);
    getBookData(input);
  };

  const handlePageChange = (event, value) => setCurrentPage(value);

  const displayedBooks = bookList.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const SkeletonCard = () => (
    <li className="individualBookCard skeletonCard">
      <div className="skeletonImg animate-pulse"></div>
      <div className="skeletonText animate-pulse" style={{ width: "80%" }}></div>
      <div className="skeletonText animate-pulse" style={{ width: "60%" }}></div>
      <div className="skeletonText animate-pulse" style={{ width: "40%" }}></div>
    </li>
  );

  const handleBookClick = (book) => {
    // Save to recent books
    const stored = sessionStorage.getItem("recentBooks");
    const recent = stored ? JSON.parse(stored) : [];
    const filtered = recent.filter(b => b.link !== book.link);
    filtered.unshift({
      title: book.title,
      author: book.author,
      price: book.price,
      image: book.image,
      link: book.link
    });
    sessionStorage.setItem("recentBooks", JSON.stringify(filtered.slice(0,10)));

    // Navigate to book detail
    router.push(`/book?url=${encodeURIComponent(book.link)}`);
  };

  return (
    <>
      <Navbar />
      <div style={{ display:'flex', justifyContent:'center', marginBottom: 20 }}>
        <CategoryMenuHover setInput={setInput} fetchBooks={getBookData} />
      </div>

      <img
        src="//www.worldofbooks.com/cdn/shop/files/Pre_peak_test_desktop_hompage_banner_2.png?v=1758184937&width=3840"
        alt="Home Background"
        className="homeBgImage"
      />

      <div className="HomeContainer">
        <div className="searchContainer">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Enter Book"
            type="search"
            className="searchInput"
          />
          <button className="SearchBtn" onClick={handleSearch}>Search</button>
        </div>

        <div className="bookContainer">
          <h1 className="MainHeading">All Books</h1>
          <ul className="individualBooks">
            {isLoading
              ? Array.from({ length: PAGE_SIZE }).map((_, idx) => <SkeletonCard key={idx} />)
              : displayedBooks.map((book, idx) => (
                  <li
                    key={idx}
                    className="individualBookCard"
                    onClick={() => handleBookClick(book)}
                  >
                    {book.image && <img src={book.image} alt={book.title} className="individualBookImg" />}
                    <p className="BookName">{book.title}</p>
                    <p className="AuthorName">{book.author}</p>
                    <p className="price">{book.price}</p>
                  </li>
                ))
            }
          </ul>

          {totalPages > 1 && (
            <Box sx={{ display:'flex', justifyContent:'center', mt:4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="success"
              />
            </Box>
          )}
        </div>

        {/* Recently Viewed Books */}
        <RecentBooks />
      </div>
    </>
  );
}
