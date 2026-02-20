import React, { useState, useRef } from 'react';
import QrScanner from 'qr-scanner';

const VerifyProduct = ({ central }) => {
    const [companyContractAddress, setCompanyContractAddress] = useState('');
    const [productId, setProductId] = useState('');
    const [productStatus, setProductStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [scanData, setScanData] = useState(null);
    const [scanError, setScanError] = useState(null);
    const fileRef = useRef();

    const checkProduct = async () => {
        try {
            if (!companyContractAddress || !productId) throw new Error('Please fill in all fields.');
            setLoading(true);
            setProductStatus(null);
            const result = await central.checkProduct(companyContractAddress, parseInt(productId));
            setProductStatus(result);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            alert(`Error: ${error.message}`);
        }
    };

    const handleChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        setFile(selectedFile);
        setScanError(null);
        setScanData(null);
        try {
            const result = await QrScanner.scanImage(selectedFile);
            setScanData(result);
            // Try to auto-fill if result looks like an address
            if (result.startsWith('0x')) {
                setCompanyContractAddress(result);
            }
        } catch {
            setScanError('Could not read QR code. Please try a clearer image.');
        }
    };

    const isAuthentic = productStatus === true;
    const isFake = productStatus === false;
    const hasResult = productStatus !== null;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
                .page-wrapper { min-height: 100vh; padding-top: 70px; position: relative; z-index: 1; }
                .page-container { max-width: 680px; margin: 0 auto; padding: 4rem 2rem 6rem; }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }

                .page-header { margin-bottom: 2.5rem; animation: fadeUp 0.5s ease; }
                .page-eyebrow { display: flex; align-items: center; gap: 8px; font-family: 'Space Mono', monospace; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #10b981; margin-bottom: 0.75rem; }
                .page-title { font-family: 'Syne', sans-serif; font-size: 2.2rem; font-weight: 800; color: #e2e8f0; letter-spacing: -0.03em; margin-bottom: 0.5rem; }
                .page-subtitle { font-size: 0.95rem; color: #64748b; line-height: 1.6; }

                .card { background: #0d1117; border: 1px solid rgba(16,185,129,0.12); border-radius: 16px; padding: 2rem; margin-bottom: 1.25rem; animation: fadeUp 0.5s ease both; }
                .card-title { font-family: 'Space Mono', monospace; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #10b981; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 8px; }

                .field { margin-bottom: 1.25rem; }
                .field-label { font-size: 0.8rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; font-family: 'Space Mono', monospace; margin-bottom: 0.45rem; display: block; }
                .field-input {
                    width: 100%; padding: 0.85rem 1rem;
                    background: rgba(16,185,129,0.04); border: 1px solid rgba(16,185,129,0.15);
                    border-radius: 10px; color: #e2e8f0; font-family: 'Space Mono', monospace; font-size: 0.85rem;
                    outline: none; transition: all 0.2s;
                }
                .field-input::placeholder { color: #3f4a5a; }
                .field-input:focus { border-color: rgba(16,185,129,0.4); background: rgba(16,185,129,0.07); box-shadow: 0 0 0 3px rgba(16,185,129,0.08); }

                .action-btn {
                    width: 100%; padding: 1rem 2rem;
                    background: linear-gradient(135deg, #059669, #10b981);
                    border: none; border-radius: 12px; color: white;
                    font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700;
                    cursor: pointer; transition: all 0.2s; letter-spacing: 0.01em;
                }
                .action-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(16,185,129,0.4); }
                .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; vertical-align: middle; margin-right: 8px; }
                @keyframes spin { to { transform: rotate(360deg); } }

                /* RESULT */
                .result {
                    margin-top: 1.5rem;
                    border-radius: 16px;
                    padding: 2rem;
                    text-align: center;
                    animation: scaleIn 0.4s ease;
                    border: 2px solid;
                }
                .result.authentic { background: rgba(16,185,129,0.08); border-color: rgba(16,185,129,0.35); }
                .result.fake { background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.35); }

                .result-icon { font-size: 3rem; margin-bottom: 0.75rem; }
                .result-title { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.5rem; }
                .result.authentic .result-title { color: #10b981; }
                .result.fake .result-title { color: #ef4444; }
                .result-sub { font-size: 0.875rem; color: #64748b; }

                /* QR SCAN */
                .scan-zone {
                    border: 2px dashed rgba(16,185,129,0.2);
                    border-radius: 12px;
                    padding: 2rem;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                }
                .scan-zone:hover { border-color: rgba(16,185,129,0.4); background: rgba(16,185,129,0.03); }

                .scan-btn {
                    padding: 0.7rem 1.5rem;
                    background: rgba(16,185,129,0.1);
                    border: 1px solid rgba(16,185,129,0.25);
                    border-radius: 10px;
                    color: #10b981;
                    font-family: 'Space Mono', monospace; font-size: 0.85rem; font-weight: 700;
                    cursor: pointer; transition: all 0.2s;
                }
                .scan-btn:hover { background: rgba(16,185,129,0.2); }

                .scan-preview { max-width: 160px; border-radius: 8px; margin-top: 1rem; }
                .scan-data { margin-top: 0.75rem; padding: 0.6rem 0.9rem; background: rgba(16,185,129,0.05); border: 1px solid rgba(16,185,129,0.15); border-radius: 8px; font-family: 'Space Mono', monospace; font-size: 0.78rem; color: #6ee7b7; word-break: break-all; text-align: left; }
                .scan-error { margin-top: 0.75rem; color: #ef4444; font-size: 0.82rem; font-weight: 600; }
                .scan-hint { font-size: 0.8rem; color: #475569; margin-top: 0.5rem; }

                @media (max-width: 600px) { .page-container { padding: 2.5rem 1.5rem; } .page-title { font-size: 1.75rem; } }
            `}</style>

            <div className="page-wrapper">
                <div className="page-container">
                    <div className="page-header">
                        <div className="page-eyebrow"><span>✦</span> Authentication</div>
                        <h1 className="page-title">Verify Product</h1>
                        <p className="page-subtitle">Check if a product is authentic by verifying its ID against the company's blockchain registry.</p>
                    </div>

                    <div className="card" style={{ animationDelay: '0.1s' }}>
                        <div className="card-title">✦ Manual Verification</div>

                        <div className="field">
                            <label className="field-label">Company Contract Address</label>
                            <input type="text" className="field-input" value={companyContractAddress}
                                onChange={(e) => setCompanyContractAddress(e.target.value)} placeholder="0x..." />
                        </div>
                        <div className="field">
                            <label className="field-label">Product ID</label>
                            <input type="text" className="field-input" value={productId}
                                onChange={(e) => setProductId(e.target.value)} placeholder="Enter numeric product ID" />
                        </div>

                        <button className="action-btn" onClick={checkProduct}
                            disabled={loading || !companyContractAddress || !productId}>
                            {loading ? <><span className="spinner" />Checking...</> : '✦ Verify Product'}
                        </button>

                        {hasResult && (
                            <div className={`result ${isAuthentic ? 'authentic' : 'fake'}`}>
                                <div className="result-icon">{isAuthentic ? '✓' : '✕'}</div>
                                <div className="result-title">{isAuthentic ? 'Product Authentic' : 'Product Not Found'}</div>
                                <div className="result-sub">
                                    {isAuthentic
                                        ? 'This product is registered in the company\'s blockchain registry.'
                                        : 'This product ID was not found in the specified contract. It may be counterfeit.'}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="card" style={{ animationDelay: '0.2s' }}>
                        <div className="card-title">⬡ Scan QR Code</div>
                        <div className="scan-zone" onClick={() => fileRef.current.click()}>
                            <button className="scan-btn" type="button">
                                ↑ Upload QR Code Image
                            </button>
                            <input type="file" ref={fileRef} onChange={handleChange}
                                accept=".png,.jpg,.jpeg" style={{ display: 'none' }} />
                            {file && <img className="scan-preview" src={URL.createObjectURL(file)} alt="QR" />}
                            {scanData && <div className="scan-data">Decoded: {scanData}</div>}
                            {scanError && <div className="scan-error">{scanError}</div>}
                            {!file && <p className="scan-hint">Upload a QR code image to decode the contract address</p>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VerifyProduct;