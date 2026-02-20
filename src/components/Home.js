import { Link } from 'react-router-dom';

const features = [
    {
        icon: '◈',
        title: 'Create Contract',
        description: 'Register your organization and deploy a dedicated smart contract as your product registry on the blockchain.',
        to: '/createcontract',
        label: 'Get Started',
        color: '#63b3ed',
        glow: 'rgba(99,179,237,0.3)',
    },
    {
        icon: '◎',
        title: 'Fetch Address',
        description: 'Look up the smart contract address associated with any registered company wallet address.',
        to: '/getcontract',
        label: 'Look Up',
        color: '#06b6d4',
        glow: 'rgba(6,182,212,0.3)',
    },
    {
        icon: '◆',
        title: 'Add Products',
        description: 'Register product IDs to your company contract. Only the contract owner can add verified products.',
        to: '/addproduct',
        label: 'Add Now',
        color: '#7c3aed',
        glow: 'rgba(124,58,237,0.3)',
    },
    {
        icon: '✦',
        title: 'Verify Product',
        description: 'Check if any product is authentic by verifying its ID against the company\'s blockchain registry.',
        to: '/verify',
        label: 'Verify',
        color: '#10b981',
        glow: 'rgba(16,185,129,0.3)',
    },
];

function Home() {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');

                .page-wrapper {
                    min-height: 100vh;
                    padding-top: 70px;
                    position: relative;
                    z-index: 1;
                }

                /* HERO */
                .hero {
                    padding: 6rem 2rem 4rem;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }

                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 0.4rem 1rem;
                    background: rgba(99,179,237,0.1);
                    border: 1px solid rgba(99,179,237,0.25);
                    border-radius: 100px;
                    color: #63b3ed;
                    font-family: 'Space Mono', monospace;
                    font-size: 0.78rem;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    margin-bottom: 2rem;
                    animation: fadeUp 0.6s ease both;
                }

                .hero-badge-dot {
                    width: 6px; height: 6px;
                    border-radius: 50%;
                    background: #63b3ed;
                    box-shadow: 0 0 8px #63b3ed;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .hero-title {
                    font-family: 'Syne', sans-serif;
                    font-size: clamp(2.5rem, 6vw, 5rem);
                    font-weight: 800;
                    line-height: 1.05;
                    letter-spacing: -0.03em;
                    margin-bottom: 1.5rem;
                    animation: fadeUp 0.6s 0.1s ease both;
                    color: #e2e8f0;
                }

                .hero-title-gradient {
                    background: linear-gradient(135deg, #63b3ed, #7c3aed, #06b6d4);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .hero-sub {
                    max-width: 620px;
                    margin: 0 auto 2.5rem;
                    font-size: 1.1rem;
                    line-height: 1.7;
                    color: #64748b;
                    animation: fadeUp 0.6s 0.2s ease both;
                }

                .hero-warning {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 0.6rem 1.25rem;
                    background: rgba(251,191,36,0.08);
                    border: 1px solid rgba(251,191,36,0.2);
                    border-radius: 10px;
                    color: #fbbf24;
                    font-size: 0.85rem;
                    font-weight: 600;
                    animation: fadeUp 0.6s 0.3s ease both;
                    margin-bottom: 4rem;
                }

                /* GRID DECORATION */
                .hero::before {
                    content: '';
                    position: absolute;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    width: 600px; height: 600px;
                    background: radial-gradient(circle, rgba(99,179,237,0.06) 0%, transparent 70%);
                    pointer-events: none;
                }

                /* FEATURES GRID */
                .features {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem 6rem;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                    gap: 1.25rem;
                }

                .feature-card {
                    position: relative;
                    background: #0d1117;
                    border: 1px solid rgba(99,179,237,0.1);
                    border-radius: 16px;
                    padding: 2rem;
                    text-decoration: none;
                    color: inherit;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    animation: fadeUp 0.6s ease both;
                }

                .feature-card:nth-child(1) { animation-delay: 0.1s; }
                .feature-card:nth-child(2) { animation-delay: 0.15s; }
                .feature-card:nth-child(3) { animation-delay: 0.2s; }
                .feature-card:nth-child(4) { animation-delay: 0.25s; }

                .feature-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, var(--c, #63b3ed), transparent);
                    opacity: 0;
                    transition: opacity 0.3s;
                }

                .feature-card:hover {
                    border-color: var(--c, #63b3ed);
                    transform: translateY(-4px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 30px var(--g, rgba(99,179,237,0.15));
                }

                .feature-card:hover::before { opacity: 1; }

                .feature-icon {
                    width: 48px; height: 48px;
                    border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.4rem;
                    margin-bottom: 1.25rem;
                    background: var(--g, rgba(99,179,237,0.1));
                    border: 1px solid var(--c, rgba(99,179,237,0.2));
                    color: var(--c, #63b3ed);
                    transition: box-shadow 0.3s;
                }

                .feature-card:hover .feature-icon {
                    box-shadow: 0 0 20px var(--g, rgba(99,179,237,0.3));
                }

                .feature-title {
                    font-size: 1.1rem;
                    font-weight: 700;
                    margin-bottom: 0.6rem;
                    color: #e2e8f0;
                    letter-spacing: -0.01em;
                }

                .feature-desc {
                    font-size: 0.875rem;
                    line-height: 1.6;
                    color: #64748b;
                    margin-bottom: 1.5rem;
                }

                .feature-cta {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.82rem;
                    font-weight: 700;
                    color: var(--c, #63b3ed);
                    font-family: 'Space Mono', monospace;
                    letter-spacing: 0.03em;
                    text-transform: uppercase;
                    transition: gap 0.2s;
                }

                .feature-card:hover .feature-cta { gap: 10px; }

                /* STATS */
                .stats {
                    display: flex;
                    justify-content: center;
                    gap: 3rem;
                    flex-wrap: wrap;
                    padding: 2rem;
                    margin: 0 auto 2rem;
                    max-width: 600px;
                    border-top: 1px solid rgba(99,179,237,0.1);
                }

                .stat {
                    text-align: center;
                }

                .stat-value {
                    font-family: 'Space Mono', monospace;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #63b3ed;
                }

                .stat-label {
                    font-size: 0.78rem;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    font-weight: 600;
                    margin-top: 2px;
                }

                @media (max-width: 600px) {
                    .hero { padding: 4rem 1.5rem 2rem; }
                    .features { padding: 0 1.5rem 4rem; }
                    .stats { gap: 2rem; }
                }
            `}</style>

            <div className="page-wrapper">
                <div className="hero">
                    <div className="hero-badge">
                        <span className="hero-badge-dot" />
                        Blockchain-Powered Authentication
                    </div>
                    <h1 className="hero-title">
                        Verify Products<br />
                        <span className="hero-title-gradient">On-Chain</span>
                    </h1>
                    <p className="hero-sub">
                        A decentralized product authentication platform. Companies deploy smart contracts as immutable registries — anyone can verify product authenticity instantly.
                    </p>
                    <div className="hero-warning">
                        ⚠ Only contract owners can register products to their contract
                    </div>
                </div>

                <div className="features">
                    {features.map(({ icon, title, description, to, label, color, glow }) => (
                        <Link
                            key={to}
                            className="feature-card"
                            to={to}
                            style={{ '--c': color, '--g': glow }}
                        >
                            <div className="feature-icon">{icon}</div>
                            <div className="feature-title">{title}</div>
                            <div className="feature-desc">{description}</div>
                            <div className="feature-cta">{label} →</div>
                        </Link>
                    ))}
                </div>

                <div className="stats">
                    <div className="stat">
                        <div className="stat-value">EVM</div>
                        <div className="stat-label">Compatible</div>
                    </div>
                    <div className="stat">
                        <div className="stat-value">100%</div>
                        <div className="stat-label">On-Chain</div>
                    </div>
                    <div className="stat">
                        <div className="stat-value">Open</div>
                        <div className="stat-label">Verifiable</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;