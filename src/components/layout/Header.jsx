import { useEffect, useState } from 'react';
import gsap from 'gsap';

const navItems = ['Home', 'About', 'Stories', 'Gallery', 'Join'];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const close = () => setMenuOpen(false);
    const links = document.querySelectorAll('.nav-links a');
    links.forEach((link) => link.addEventListener('click', close));
    return () => links.forEach((link) => link.removeEventListener('click', close));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    const wasOpen = menuOpen;
    setMenuOpen(!wasOpen);
    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });
    if (!wasOpen) {
      tl.fromTo(
        '.nav-links a',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.6 },
      );
    } else {
      tl.to('.nav-links a', { y: -20, opacity: 0, stagger: 0.05, duration: 0.3 });
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">MOWV</div>
      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {navItems.map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`}>
            {item}
          </a>
        ))}
      </div>
      <button
        className={`menu-toggle ${menuOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  );
}
