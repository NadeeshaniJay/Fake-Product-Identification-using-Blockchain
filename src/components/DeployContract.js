import React, { useState } from 'react';

const DeployContract = ({ account, central }) => {
    const [contractAddress, setContractAddress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [step, setStep] = useState(0); // 0=idle, 1=waiting, 2=mining, 3=done

    function showErrorMessage(error) {
        setLoading(false);
        setStep(0);
        setStatus('');
        alert(`Error: ${error.message}`);
    }

    const fetchContractAddress = async () => {
        if (account) {
            const address = await central.getCompanySmartContractAddress(account);
            setContractAddress(address);
        }
    };

    const createContract = async () => {
        try {
            if (!account) throw new Error('Please connect your wallet first.');
            setStep(1);
            setStatus('Waiting for wallet confirmation...');
            let transaction = await central.createSmartContract();
            setStep(2);
            setStatus('Transaction submitted. Mining...');
            setLoading(true);
            await transaction.wait();
            await fetchContractAddress();
            setStep(3);
            setStatus('Contract deployed successfully!');
            setLoading(false);
        } catch (error) {
            showErrorMessage(error);
        }
    };

    const copyToClipboard = () => {
        if (contractAddress) {
            navigator.clipboard.writeText(contractAddress);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');

                .page-wrapper { min-height: 100vh; padding-top: 70px; position: relative; z-index: 1; }

                .page-container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 4rem 2rem;
                }

                .page-header {
                    margin-bottom: 2.5rem;
                    animation: fadeUp 0.5s ease;
                }

                .page-eyebrow {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-family: 'Space Mono', monospace;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #63b3ed;
                    margin-bottom: 0.75rem;
                }

                .page-title {
                    font-family: 'Syne', sans-serif;
                    font-size: 2.2rem;
                    font-weight: 800;
                    color: #e2e8f0;
                    letter-spacing: -0.03em;
                    margin-bottom: 0.5rem;
                }

                .page-subtitle {
                    font-size: 0.95rem;
                    color: #64748b;
                    line-height: 1.6;
                }

                .card {
                    background: #0d1117;
                    border: 1px solid rgba(99,179,237,0.12);
                    border-radius: 16px;
                    padding: 2rem;
                    margin-bottom: 1.25rem;
                    animation: fadeUp 0.5s 0.1s ease both;
                }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .steps-row {
                    display: flex;
                    align-items: center;
                    gap: 0;
                    margin-bottom: 2rem;
                }

                .step-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex: 1;
                }

                .step-circle {
                    width: 32px; height: 32px;
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'Space Mono', monospace;
                    font-size: 0.75rem;
                    font-weight: 700;
                    border: 2px solid rgba(99,179,237,0.2);
                    color: #64748b;
                    background: transparent;
                    flex-shrink: 0;
                    transition: all 0.3s;
                }

                .step-circle.active {
                    border-color: #63b3ed;
                    color: #63b3ed;
                    box-shadow: 0 0 12px rgba(99,179,237,0.4);
                }

                .step-circle.done {
                    border-color: #10b981;
                    background: rgba(16,185,129,0.15);
                    color: #10b981;
                }

                .step-label {
                    font-size: 0.78rem;
                    font-weight: 600;
                    color: #64748b;
                    transition: color 0.3s;
                }

                .step-label.active { color: #63b3ed; }
                .step-label.done { color: #10b981; }

                .step-connector {
                    flex: 1;
                    height: 1px;
                    background: rgba(99,179,237,0.1);
                    margin: 0 8px;
                    transition: background 0.3s;
                }

                .step-connector.active { background: rgba(99,179,237,0.4); }

                .action-btn {
                    width: 100%;
                    padding: 1rem 2rem;
                    background: linear-gradient(135deg, #63b3ed, #7c3aed);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-family: 'Syne', sans-serif;
                    font-size: 1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                    letter-spacing: 0.01em;
                    position: relative;
                    overflow: hidden;
                }

                .action-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(99,179,237,0.35);
                }

                .action-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .action-btn::before {
                    content: '';
                    position: absolute;
                    top: 0; left: -100%;
                    width: 100%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                    transition: left 0.4s;
                }

                .action-btn:hover:not(:disabled)::before { left: 100%; }

                .status-bar {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 1rem 1.25rem;
                    background: rgba(99,179,237,0.05);
                    border: 1px solid rgba(99,179,237,0.15);
                    border-radius: 10px;
                    margin-top: 1rem;
                    animation: fadeUp 0.3s ease;
                }

                .spinner {
                    width: 16px; height: 16px;
                    border: 2px solid rgba(99,179,237,0.2);
                    border-top-color: #63b3ed;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                    flex-shrink: 0;
                }

                @keyframes spin { to { transform: rotate(360deg); } }

                .status-text {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #93c5fd;
                }

                .result-card {
                    background: rgba(16,185,129,0.05);
                    border: 1px solid rgba(16,185,129,0.2);
                    border-radius: 12px;
                    padding: 1.25rem;
                    margin-top: 1rem;
                    animation: fadeUp 0.4s ease;
                }

                .result-label {
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #10b981;
                    margin-bottom: 0.5rem;
                    font-family: 'Space Mono', monospace;
                }

                .result-address {
                    font-family: 'Space Mono', monospace;
                    font-size: 0.82rem;
                    color: #e2e8f0;
                    word-break: break-all;
                    line-height: 1.5;
                }

                .copy-btn {
                    margin-top: 0.75rem;
                    padding: 0.45rem 0.9rem;
                    background: rgba(16,185,129,0.1);
                    border: 1px solid rgba(16,185,129,0.25);
                    border-radius: 8px;
                    color: #10b981;
                    font-size: 0.78rem;
                    font-weight: 700;
                    cursor: pointer;
                    font-family: 'Space Mono', monospace;
                    transition: all 0.2s;
                }

                .copy-btn:hover {
                    background: rgba(16,185,129,0.2);
                }

                .wallet-warning {
                    text-align: center;
                    padding: 2rem;
                    color: #64748b;
                    font-size: 0.9rem;
                }

                .wallet-warning strong { color: #fbbf24; }

                @media (max-width: 600px) {
                    .page-container { padding: 2.5rem 1.5rem; }
                    .page-title { font-size: 1.75rem; }
                    .step-label { display: none; }
                }
            `}</style>

            <div className="page-wrapper">
                <div className="page-container">
                    <div className="page-header">
                        <div className="page-eyebrow">
                            <span>◈</span> Step 1
                        </div>
                        <h1 className="page-title">Create My Contract</h1>
                        <p className="page-subtitle">Deploy a dedicated smart contract for your organization to register and manage authentic products on-chain.</p>
                    </div>

                    <div className="card">
                        {/* Steps indicator */}
                        <div className="steps-row">
                            {['Connect', 'Confirm', 'Mining', 'Done'].map((s, i) => (
                                <React.Fragment key={i}>
                                    <div className="step-item">
                                        <div className={`step-circle ${step > i + 1 ? 'done' : step === i + 1 ? 'active' : ''}`}>
                                            {step > i + 1 ? '✓' : i + 1}
                                        </div>
                                        <span className={`step-label ${step > i + 1 ? 'done' : step === i + 1 ? 'active' : ''}`}>{s}</span>
                                    </div>
                                    {i < 3 && <div className={`step-connector ${step > i + 1 ? 'active' : ''}`} />}
                                </React.Fragment>
                            ))}
                        </div>

                        {account ? (
                            <>
                                <button
                                    className="action-btn"
                                    onClick={createContract}
                                    disabled={loading || step === 3}
                                >
                                    {step === 3 ? '✓ Contract Deployed' : loading ? 'Processing...' : '⬡ Deploy Smart Contract'}
                                </button>

                                {status && (
                                    <div className="status-bar">
                                        {loading && <div className="spinner" />}
                                        {!loading && step === 3 && <span style={{ color: '#10b981' }}>✓</span>}
                                        <span className="status-text">{status}</span>
                                    </div>
                                )}

                                {contractAddress && step === 3 && (
                                    <div className="result-card">
                                        <div className="result-label">✦ Contract Deployed At</div>
                                        <div className="result-address">{contractAddress}</div>
                                        <button className="copy-btn" onClick={copyToClipboard}>
                                            Copy Address
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="wallet-warning">
                                <strong>⚠ Wallet not connected</strong><br />
                                Please connect your MetaMask wallet to deploy a contract.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DeployContract;