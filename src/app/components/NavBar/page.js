'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import './page.css'

const Navbar = () => {
    const pathname = usePathname(); // current route
    

    return (
        <div className="navBarContainer">
            <h1 className="logo">StoryHaven</h1>
            <ul className="navItems">
                <li className={`li ${pathname === '/components/home' ? 'active' : ''}`}>
                    <Link href="/components/home">Home</Link>
                </li>
                {/* <li className={`dropdownLi li ${pathname === '/categories' ? 'active' : ''}`}>
                    Categories
                </li> */}
                <li className={`li ${pathname === '/about' ? 'active' : ''}`}>
                    <Link href="/about">About</Link>
                </li>
            </ul>
        </div>
    )
}

export default Navbar
