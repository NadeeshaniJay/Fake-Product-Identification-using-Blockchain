import { useState } from 'react';

const GetContract = ({ account, central }) => {
    const [contractAddress, setContractAddress] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const fetchContractAddress = async () => {
        try {
            if (!walletAddress) throw new Error('Please enter a wallet address.');
            setLoading(true);
            const address = await central.getCompanySmartContractAddress(walletAddress);
            setContractAddress(address);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            alert(`Error: ${error.message}`);
        }
    };

    const copyAddress = () => {
        navigator.clipboard.writeText(contractAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const fillMyAddress = () => {
        if (account) setWalletAddress(account);
    };

    const ZERO = '0x0000000000000000000000000000000000000000';
    const hasResult = contractAddress && contractAddress !== ZERO;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
                .page-wrapper { min-height: 100vh; padding-top: 70px; position: relative; z-index: 1; }
                .page-container { max-width: 600px; margin: 0 auto; padding: 4rem 2rem; }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .page-header { margin-bottom: 2.5rem; animation: fadeUp 0.5s ease; }
                .page-eyebrow {
                    display: flex; align-items: center; gap: 8px;
                    font-family: 'Space Mono', monospace; font-size: 0.75rem; font-weight: 700;
                    text-transform: uppercase; letter-spacing: 0.1em; color: #06b6d4; margin-bottom: 0.75rem;
                }
                .page-title { font-family: 'Syne', sans-serif; font-size: 2.2rem; font-weight: 800; color: #e2e8f0; letter-spacing: -0.03em; margin-bottom: 0.5rem; }
                .page-subtitle { font-size: 0.95rem; color: #64748b; line-height: 1.6; }
                .card { background: #0d1117; border: 1px solid rgba(6,182,212,0.12); border-radius: 16px; padding: 2rem; animation: fadeUp 0.5s 0.1s ease both; }

                .field { margin-bottom: 1.5rem; }
                .field-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; }
                .field-label { font-size: 0.82rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; font-family: 'Space Mono', monospace; }
                .field-hint { font-size: 0.78rem; color: #06b6d4; cursor: pointer; font-weight: 600; transition: opacity 0.2s; }
                .field-hint:hover { opacity: 0.7; }

                .field-input {
                    width: 100%;
                    padding: 0.85rem 1rem;
                    background: rgba(6,182,212,0.04);
                    border: 1px solid rgba(6,182,212,0.15);
                    border-radius: 10px;
                    color: #e2e8f0;
                    font-family: 'Space Mono', monospace;
                    font-size: 0.85rem;
                    outline: none;
                    transition: all 0.2s;
                }

                .field-input::placeholder { color: #3f4a5a; }

                .field-input:focus {
                    border-color: rgba(6,182,212,0.4);
                    background: rgba(6,182,212,0.07);
                    box-shadow: 0 0 0 3px rgba(6,182,212,0.08);
                }

                .action-btn {
                    width: 100%;
                    padding: 1rem 2rem;
                    background: linear-gradient(135deg, #06b6d4, #0284c7);
                    border: none; border-radius: 12px;
                    color: white;
                    font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700;
                    cursor: pointer; transition: all 0.2s; letter-spacing: 0.01em;
                    position: relative; overflow: hidden;
                }
                .action-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(6,182,212,0.35); }
                .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                .spinner {
                    display: inline-block;
                    width: 16px; height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                    vertical-align: middle; margin-right: 8px;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                .result-card {
                    margin-top: 1.25rem;
                    background: rgba(6,182,212,0.05);
                    border: 1px solid rgba(6,182,212,0.2);
                    border-radius: 12px;
                    padding: 1.25rem;
                    animation: fadeUp 0.4s ease;
                }
                .result-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #06b6d4; margin-bottom: 0.5rem; font-family: 'Space Mono', monospace; }
                .result-address { font-family: 'Space Mono', monospace; font-size: 0.82rem; color: #e2e8f0; word-break: break-all; line-height: 1.5; }
                .copy-btn {
                    margin-top: 0.75rem;
                    padding: 0.45rem 0.9rem;
                    background: rgba(6,182,212,0.1);
                    border: 1px solid rgba(6,182,212,0.25);
                    border-radius: 8px;
                    color: #06b6d4;
                    font-size: 0.78rem; font-weight: 700; cursor: pointer;
                    font-family: 'Space Mono', monospace; transition: all 0.2s;
                }
                .copy-btn:hover { background: rgba(6,182,212,0.2); }

                .not-found {
                    margin-top: 1.25rem;
                    padding: 1rem 1.25rem;
                    background: rgba(239,68,68,0.05);
                    border: 1px solid rgba(239,68,68,0.2);
                    border-radius: 10px;
                    color: #f87171;
                    font-size: 0.875rem;
                    font-weight: 600;
                    animation: fadeUp 0.3s ease;
                }

                @media (max-width: 600px) { .page-container { padding: 2.5rem 1.5rem; } .page-title { font-size: 1.75rem; } }
            `}</style>

            <div className="page-wrapper">
                <div className="page-container">
                    <div className="page-header">
                        <div className="page-eyebrow"><span>◎</span> Lookup</div>
                        <h1 className="page-title">Fetch Contract Address</h1>
                        <p className="page-subtitle">Look up the smart contract registry associated with any company wallet address.</p>
                    </div>

                    <div className="card">
                        <div className="field">
                            <div className="field-header">
                                <label className="field-label">Wallet Address</label>
                                {account && (
                                    <span className="field-hint" onClick={fillMyAddress}>Use My Address</span>
                                )}
                            </div>
                            <input
                                type="text"
                                className="field-input"
                                value={walletAddress}
                                onChange={(e) => setWalletAddress(e.target.value)}
                                placeholder="0x..."
                            />
                        </div>

                        <button
                            className="action-btn"
                            onClick={fetchContractAddress}
                            disabled={loading || !walletAddress}
                        >
                            {loading ? <><span className="spinner" />Looking up...</> : '◎ Fetch Contract Address'}
                        </button>

                        {contractAddress && hasResult && (
                            <div className="result-card">
                                <div className="result-label">✦ Contract Address Found</div>
                                <div className="result-address">{contractAddress}</div>
                                <button className="copy-btn" onClick={copyAddress}>
                                    {copied ? '✓ Copied!' : 'Copy Address'}
                                </button>
                            </div>
                        )}

                        {contractAddress && !hasResult && (
                            <div className="not-found">
                                ✕ No contract found for this wallet address.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default GetContract;