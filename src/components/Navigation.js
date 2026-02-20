import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Link, useLocation } from 'react-router-dom';

const Navigation = ({ account, setAccount }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [location]);

    const connectHandler = async () => {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(ethers.utils.getAddress(accounts[0]));
        } catch (error) {
            alert(`Connection failed: ${error.message}`);
        }
    };

    const navLinks = [
        { to: '/', label: 'Home', icon: '⬡' },
        { to: '/createcontract', label: 'Create Contract', icon: '◈' },
        { to: '/getcontract', label: 'Fetch Address', icon: '◎' },
        { to: '/addproduct', label: 'Add Products', icon: '◆' },
        { to: '/verify', label: 'Verify', icon: '✦' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');

                * { box-sizing: border-box; margin: 0; padding: 0; }

                :root {
                    --bg: #050810;
                    --surface: #0d1117;
                    --surface2: #161b27;
                    --border: rgba(99,179,237,0.15);
                    --accent: #63b3ed;
                    --accent2: #7c3aed;
                    --accent3: #06b6d4;
                    --text: #e2e8f0;
                    --text-muted: #64748b;
                    --success: #10b981;
                    --glow: 0 0 20px rgba(99,179,237,0.3);
                }

                body {
                    background: var(--bg);
                    color: var(--text);
                    font-family: 'Syne', sans-serif;
                    min-height: 100vh;
                    overflow-x: hidden;
                }

                body::before {
                    content: '';
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: 
                        radial-gradient(ellipse at 20% 20%, rgba(99,179,237,0.05) 0%, transparent 50%),
                        radial-gradient(ellipse at 80% 80%, rgba(124,58,237,0.05) 0%, transparent 50%),
                        radial-gradient(ellipse at 50% 50%, rgba(6,182,212,0.03) 0%, transparent 70%);
                    pointer-events: none;
                    z-index: 0;
                }

                /* NAVBAR */
                .navbar {
                    position: fixed;
                    top: 0; left: 0; right: 0;
                    z-index: 1000;
                    padding: 0 2rem;
                    height: 70px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    transition: all 0.3s ease;
                    background: ${scrolled ? 'rgba(5,8,16,0.95)' : 'transparent'};
                    backdrop-filter: ${scrolled ? 'blur(20px)' : 'none'};
                    border-bottom: ${scrolled ? '1px solid var(--border)' : '1px solid transparent'};
                }

                .navbar::after {
                    content: '';
                    position: absolute;
                    bottom: -1px; left: 10%; right: 10%;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, var(--accent), transparent);
                    opacity: ${scrolled ? 0.6 : 0};
                    transition: opacity 0.3s;
                }

                .nav-logo {
                    font-family: 'Space Mono', monospace;
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--text);
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    letter-spacing: -0.02em;
                }

                .nav-logo-icon {
                    width: 32px; height: 32px;
                    background: linear-gradient(135deg, var(--accent), var(--accent2));
                    border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.85rem;
                    box-shadow: 0 0 15px rgba(99,179,237,0.4);
                }

                .nav-links {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    list-style: none;
                }

                .nav-link {
                    position: relative;
                    padding: 0.45rem 0.9rem;
                    color: var(--text-muted);
                    text-decoration: none;
                    font-size: 0.875rem;
                    font-weight: 600;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                    letter-spacing: 0.01em;
                }

                .nav-link:hover {
                    color: var(--text);
                    background: rgba(99,179,237,0.08);
                }

                .nav-link.active {
                    color: var(--accent);
                    background: rgba(99,179,237,0.1);
                }

                .nav-link.active::after {
                    content: '';
                    position: absolute;
                    bottom: 2px; left: 50%; transform: translateX(-50%);
                    width: 4px; height: 4px;
                    border-radius: 50%;
                    background: var(--accent);
                    box-shadow: 0 0 6px var(--accent);
                }

                .connect-btn {
                    display: flex; align-items: center; gap: 8px;
                    padding: 0.5rem 1.25rem;
                    background: linear-gradient(135deg, rgba(99,179,237,0.15), rgba(124,58,237,0.15));
                    border: 1px solid rgba(99,179,237,0.3);
                    border-radius: 10px;
                    color: var(--accent);
                    font-family: 'Space Mono', monospace;
                    font-size: 0.8rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    letter-spacing: 0.02em;
                }

                .connect-btn:hover {
                    background: linear-gradient(135deg, rgba(99,179,237,0.25), rgba(124,58,237,0.25));
                    border-color: var(--accent);
                    box-shadow: var(--glow);
                    transform: translateY(-1px);
                }

                .connected-badge {
                    display: flex; align-items: center; gap: 8px;
                    padding: 0.45rem 1rem;
                    background: rgba(16,185,129,0.1);
                    border: 1px solid rgba(16,185,129,0.3);
                    border-radius: 10px;
                    color: var(--success);
                    font-family: 'Space Mono', monospace;
                    font-size: 0.78rem;
                    font-weight: 700;
                    cursor: default;
                }

                .connected-dot {
                    width: 7px; height: 7px;
                    border-radius: 50%;
                    background: var(--success);
                    box-shadow: 0 0 8px var(--success);
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.2); }
                }

                /* HAMBURGER */
                .hamburger {
                    display: none;
                    flex-direction: column;
                    gap: 5px;
                    cursor: pointer;
                    background: none;
                    border: none;
                    padding: 4px;
                }

                .hamburger span {
                    display: block;
                    width: 22px; height: 2px;
                    background: var(--text);
                    border-radius: 2px;
                    transition: all 0.3s ease;
                }

                .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
                .hamburger.open span:nth-child(2) { opacity: 0; }
                .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

                /* MOBILE MENU */
                .mobile-menu {
                    display: none;
                    position: fixed;
                    top: 70px; left: 0; right: 0;
                    background: rgba(5,8,16,0.98);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid var(--border);
                    padding: 1.5rem;
                    flex-direction: column;
                    gap: 0.5rem;
                    z-index: 999;
                }

                .mobile-menu.open { display: flex; }

                .mobile-nav-link {
                    display: flex; align-items: center; gap: 10px;
                    padding: 0.75rem 1rem;
                    color: var(--text-muted);
                    text-decoration: none;
                    font-size: 0.95rem;
                    font-weight: 600;
                    border-radius: 10px;
                    transition: all 0.2s;
                    border: 1px solid transparent;
                }

                .mobile-nav-link:hover, .mobile-nav-link.active {
                    color: var(--text);
                    background: rgba(99,179,237,0.08);
                    border-color: var(--border);
                }

                .mobile-nav-link.active { color: var(--accent); }

                @media (max-width: 900px) {
                    .nav-links { display: none; }
                    .hamburger { display: flex; }
                }
            `}</style>

            <nav className="navbar">
                <a href="/" className="nav-logo">
                    <div className="nav-logo-icon">⬡</div>
                    ProductVerify
                </a>

                <ul className="nav-links">
                    {navLinks.map(({ to, label }) => (
                        <li key={to}>
                            <Link className={`nav-link${isActive(to) ? ' active' : ''}`} to={to}>
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {account ? (
                        <div className="connected-badge">
                            <span className="connected-dot" />
                            {account.slice(0, 6)}...{account.slice(-4)}
                        </div>
                    ) : (
                        <button className="connect-btn" onClick={connectHandler}>
                            ⬡ Connect Wallet
                        </button>
                    )}
                    <button
                        className={`hamburger${menuOpen ? ' open' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span /><span /><span />
                    </button>
                </div>
            </nav>

            <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
                {navLinks.map(({ to, label, icon }) => (
                    <Link key={to} className={`mobile-nav-link${isActive(to) ? ' active' : ''}`} to={to}>
                        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                        {label}
                    </Link>
                ))}
                {!account && (
                    <button className="connect-btn" style={{ marginTop: '0.5rem', justifyContent: 'center' }} onClick={connectHandler}>
                        ⬡ Connect Wallet
                    </button>
                )}
            </div>
        </>
    );
};

export default Navigation;