// app/about/page.js
'use client';
import React from 'react';
import Navbar from '../components/NavBar/page';

const About = () => {
  return (
    <>
    <Navbar />
    <div style={{display:"flex",flexDirection:"column",justifyContent:"center", width:"600px",margin:"0 auto", padding: '2rem', fontFamily: 'Playfair Display, serif' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#0a9621' }}>About This Site</h1>
      <p>
        This site is a book search and recommendation platform built with React, Next.js, and NestJS. 
        It scrapes book data in real-time from World of Books and displays book details, reviews, 
        and recommendations for users. Designed to be responsive, accessible, and user-friendly.
      </p>
      <p>
        Features include category navigation, pagination, and 
        caching to improve user experience.
      </p>
    </div>
    </>
  );
};

export default About;
