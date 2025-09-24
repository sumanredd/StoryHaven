'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, List, ListItem, ListItemButton, ListItemText, Paper } from '@mui/material';

const categories = [
  {
    name: 'Fiction Books',
    subCategories: [
      { name: 'All Fiction Books', query: 'fiction books' },
      { name: 'Crime & Mystery', query: 'crime & mystery' },
      { name: 'Fantasy', query: 'fantasy' },
      { name: 'Modern Fiction', query: 'modern fiction' },
      { name: 'Romance', query: 'romance' },
      { name: 'Adventure', query: 'adventure' },
      { name: 'Thriller & Suspense', query: 'thriller & suspense' },
      { name: 'Classic Fiction', query: 'classic fiction' },
      { name: 'Graphic Novels', query: 'graphic novels' },
      { name: 'Historical Fiction', query: 'historical fiction' },
      { name: 'Science Fiction', query: 'science fiction' },
    ],
  },
  {
    name: 'Non-Fiction Books',
    subCategories: [
      { name: 'All Non-Fiction Books', query: 'non-fiction books' },
      { name: 'Biography & True Stories', query: 'biography & true stories' },
      { name: 'Health & Personal Development', query: 'health & personal development' },
      { name: 'Lifestyle, Cooking & Leisure', query: 'lifestyle cooking leisure' },
      { name: 'Arts & Crafts', query: 'arts & crafts' },
      { name: 'Science & Technology', query: 'science & technology' },
    ],
  },
  {
    name: "Children's Books",
    subCategories: [
      { name: "All Children's Books", link: 'childrens-books' },
      { name: "Children's Fiction & True Stories", link: 'childrens-fiction-books' },
      { name: "Children's Non-Fiction", link: 'childrens-non-fiction-books' },
      { name: "Activity, Early Learning & Picture Books", link: 'childrens-picture-and-activity-books' },
      { name: "Children's Reference Books", link: 'childrens-reference-books' },
      { name: "Children's Education & Learning", link: 'educational-material-books' },
      { name: "Children's Poetry & Anthologies", link: 'childrens-poetry-books' },
      { name: "Children's Personal & Social Issues", link: 'childrens-personal-and-social-issues-books' },
    ],
  },
];

const CategoryMenuHover = ({ setInput, fetchBooks }) => {
  const router = useRouter();

  const handleClick = (sub) => {
    setInput(sub.name);
    fetchBooks(sub.name);
    router.replace(`/?q=${encodeURIComponent(sub.name)}`);
  };

  return (
    <Box display="flex" gap={4} mt={2}>
      {categories.map((cat, idx) => (
        <Box key={idx} position="relative" sx={{ '&:hover .dropdown': { display: 'block' } }}>
          <Typography 
            variant="h6" 
            sx={{fontWeight:"800", color:"#005748", fontSize:"1.2em", cursor: 'pointer', fontFamily: 'Playfair Display, serif' }}
          >
            {cat.name}
          </Typography>
          <Paper
            className="dropdown"
            elevation={3}
            sx={{
              display: 'none',
              position: 'absolute',
              top: '100%',
              left: 0,
              minWidth: 170,
              zIndex: 10,
              p: 1,
              fontSize: '0.9em',
              fontFamily: 'Playfair Display, serif',
            }}
          >
            <List>
              {cat.subCategories.map((sub, subIdx) => (
                <ListItem key={subIdx} disablePadding>
                  <ListItemButton onClick={() => handleClick(sub)}>
                    <ListItemText primary={sub.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      ))}
    </Box>
  );
};

export default CategoryMenuHover;
