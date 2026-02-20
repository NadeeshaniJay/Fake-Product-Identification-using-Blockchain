import { useState, useRef, useEffect } from "react";
import { ethers } from 'ethers';
import { QRCodeCanvas } from "qrcode.react";

const AddProduct = ({ account, central }) => {
    const [companyContractAddress, setCompanyContractAddress] = useState('');
    const [productId, setProductId] = useState('');
    const [manufactureId, setManufactureId] = useState('');
    const [productName, setProductName] = useState('');
    const [productBrand, setProductBrand] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [step, setStep] = useState(0);

    const [qrValue, setQrValue] = useState('');
    const [qrInput, setQrInput] = useState('');
    const qrRef = useRef();

    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

    useEffect(() => {
        const loadMyContractAddress = async () => {
            try {
                if (account && central) {
                    const addr = await central.getCompanySmartContractAddress(account);
                    if (addr && addr !== ZERO_ADDRESS) setCompanyContractAddress(addr);
                }
            } catch (error) { console.log(error); }
        };
        loadMyContractAddress();
    }, [account, central]);

    const downloadQRCode = (e) => {
        e.preventDefault();
        let canvas = qrRef.current.querySelector("canvas");
        let image = canvas.toDataURL("image/png");
        let anchor = document.createElement("a");
        anchor.href = image;
        anchor.download = `qr-code.png`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    };

    const addProducts = async () => {
        try {
            const list = productId.split(',').map(v => v.trim()).filter(v => v.length > 0)
                .map(v => {
                    if (!/^\d+$/.test(v)) throw new Error('Product IDs must be comma-separated positive integers.');
                    return ethers.BigNumber.from(v);
                });

            if (!account) throw new Error('Please connect your wallet first.');
            if (!central) throw new Error('Central contract is not initialized.');
            if (!companyContractAddress || !ethers.utils.isAddress(companyContractAddress))
                throw new Error('Please enter a valid company contract address.');
            if (!list.length) throw new Error('Please enter at least one product ID.');

            const myContractAddress = await central.getCompanySmartContractAddress(account);
            if (!myContractAddress || myContractAddress === ZERO_ADDRESS)
                throw new Error('No company contract found for this wallet.');
            if (myContractAddress.toLowerCase() !== companyContractAddress.toLowerCase())
                throw new Error('Contract address does not belong to the connected wallet.');

            setStep(1);
            setStatus('Waiting for wallet confirmation...');
            await central.callStatic.addproduct(account, companyContractAddress, list);
            let tx = await central.addproduct(account, companyContractAddress, list);
            setStep(2);
            setStatus('Transaction submitted. Mining...');
            setLoading(true);
            await tx.wait();
            setStep(3);
            setStatus('Products added successfully!');
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setStep(0);
            setStatus('');
            alert(`Error: ${error.message}`);
        }
    };

    const fields = [
        { label: 'Company Contract Address', value: companyContractAddress, onChange: setCompanyContractAddress, placeholder: '0x...', hint: 'Auto-filled from your wallet if registered' },
        { label: 'Product ID(s)', value: productId, onChange: setProductId, placeholder: 'e.g. 1, 2, 3 (comma-separated)', hint: 'Enter multiple IDs separated by commas' },
        { label: 'Manufacture ID', value: manufactureId, onChange: setManufactureId, placeholder: 'Manufacture identifier' },
        { label: 'Product Name', value: productName, onChange: setProductName, placeholder: 'Product display name' },
        { label: 'Product Brand', value: productBrand, onChange: setProductBrand, placeholder: 'Brand name' },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
                .page-wrapper { min-height: 100vh; padding-top: 70px; position: relative; z-index: 1; }
                .page-container { max-width: 720px; margin: 0 auto; padding: 4rem 2rem 6rem; }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

                .page-header { margin-bottom: 2.5rem; animation: fadeUp 0.5s ease; }
                .page-eyebrow { display: flex; align-items: center; gap: 8px; font-family: 'Space Mono', monospace; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #7c3aed; margin-bottom: 0.75rem; }
                .page-title { font-family: 'Syne', sans-serif; font-size: 2.2rem; font-weight: 800; color: #e2e8f0; letter-spacing: -0.03em; margin-bottom: 0.5rem; }
                .page-subtitle { font-size: 0.95rem; color: #64748b; line-height: 1.6; }

                .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
                @media (max-width: 640px) { .two-col { grid-template-columns: 1fr; } .page-container { padding: 2.5rem 1.5rem; } .page-title { font-size: 1.75rem; } }

                .card { background: #0d1117; border: 1px solid rgba(124,58,237,0.12); border-radius: 16px; padding: 2rem; animation: fadeUp 0.5s ease both; }
                .card + .card { margin-top: 1.25rem; }
                .card-title { font-family: 'Space Mono', monospace; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #7c3aed; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 8px; }

                .field { margin-bottom: 1.25rem; }
                .field-label { font-size: 0.8rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; font-family: 'Space Mono', monospace; margin-bottom: 0.4rem; display: block; }
                .field-hint { font-size: 0.75rem; color: #475569; margin-bottom: 0.45rem; }
                .field-input {
                    width: 100%; padding: 0.85rem 1rem;
                    background: rgba(124,58,237,0.04); border: 1px solid rgba(124,58,237,0.15);
                    border-radius: 10px; color: #e2e8f0; font-family: 'Space Mono', monospace; font-size: 0.85rem;
                    outline: none; transition: all 0.2s;
                }
                .field-input::placeholder { color: #3f4a5a; }
                .field-input:focus { border-color: rgba(124,58,237,0.4); background: rgba(124,58,237,0.07); box-shadow: 0 0 0 3px rgba(124,58,237,0.08); }

                .action-btn {
                    width: 100%; padding: 1rem 2rem;
                    background: linear-gradient(135deg, #7c3aed, #4f46e5);
                    border: none; border-radius: 12px; color: white;
                    font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700;
                    cursor: pointer; transition: all 0.2s; letter-spacing: 0.01em;
                }
                .action-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(124,58,237,0.4); }
                .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                .status-bar { display: flex; align-items: center; gap: 12px; padding: 1rem 1.25rem; background: rgba(124,58,237,0.05); border: 1px solid rgba(124,58,237,0.2); border-radius: 10px; margin-top: 1rem; animation: fadeUp 0.3s ease; }
                .spinner { width: 16px; height: 16px; border: 2px solid rgba(124,58,237,0.2); border-top-color: #7c3aed; border-radius: 50%; animation: spin 0.8s linear infinite; flex-shrink: 0; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .status-text { font-size: 0.875rem; font-weight: 600; color: #a78bfa; }
                .success-text { color: #10b981; }

                .qr-preview { display: flex; justify-content: center; margin-bottom: 1.25rem; padding: 1.5rem; background: white; border-radius: 12px; }
                .qr-download-btn {
                    width: 100%; padding: 0.85rem;
                    background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.25);
                    border-radius: 10px; color: #a78bfa;
                    font-family: 'Space Mono', monospace; font-size: 0.85rem; font-weight: 700;
                    cursor: pointer; transition: all 0.2s;
                }
                .qr-download-btn:hover:not(:disabled) { background: rgba(124,58,237,0.2); }
                .qr-download-btn:disabled { opacity: 0.4; cursor: not-allowed; }

                .wallet-warning { text-align: center; padding: 2rem; color: #64748b; font-size: 0.9rem; }
                .wallet-warning strong { color: #fbbf24; }
            `}</style>

            <div className="page-wrapper">
                <div className="page-container">
                    <div className="page-header">
                        <div className="page-eyebrow"><span>◆</span> Registry</div>
                        <h1 className="page-title">Add Products</h1>
                        <p className="page-subtitle">Register product IDs to your company's on-chain registry. Only the contract owner can add products.</p>
                    </div>

                    <div className="two-col">
                        {/* Form card */}
                        <div className="card" style={{ gridColumn: 'span 1', animationDelay: '0.1s' }}>
                            <div className="card-title">◆ Product Details</div>

                            {account ? (
                                <>
                                    {fields.map(({ label, value, onChange, placeholder, hint }) => (
                                        <div className="field" key={label}>
                                            <label className="field-label">{label}</label>
                                            {hint && <div className="field-hint">{hint}</div>}
                                            <input
                                                type="text"
                                                className="field-input"
                                                value={value}
                                                onChange={(e) => onChange(e.target.value)}
                                                placeholder={placeholder}
                                            />
                                        </div>
                                    ))}

                                    <button
                                        className="action-btn"
                                        onClick={addProducts}
                                        disabled={loading}
                                        style={{ marginTop: '0.5rem' }}
                                    >
                                        {loading ? 'Processing...' : '◆ Add Products'}
                                    </button>

                                    {status && (
                                        <div className="status-bar">
                                            {loading && <div className="spinner" />}
                                            {step === 3 && <span className="success-text" style={{ fontSize: '1rem' }}>✓</span>}
                                            <span className={`status-text ${step === 3 ? 'success-text' : ''}`}>{status}</span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="wallet-warning">
                                    <strong>⚠ Wallet not connected</strong><br />
                                    Connect your MetaMask wallet to add products.
                                </div>
                            )}
                        </div>

                        {/* QR Code card */}
                        <div className="card" style={{ animationDelay: '0.2s' }}>
                            <div className="card-title">⬡ QR Code Generator</div>
                            <div className="qr-preview" ref={qrRef}>
                                <QRCodeCanvas
                                    id="qrCode"
                                    value={qrValue || ' '}
                                    size={200}
                                    bgColor="#ffffff"
                                    level="H"
                                />
                            </div>
                            <div className="field">
                                <label className="field-label">Address to Encode</label>
                                <input
                                    type="text"
                                    className="field-input"
                                    value={qrInput}
                                    onChange={(e) => { setQrInput(e.target.value); setQrValue(e.target.value); }}
                                    placeholder="Paste contract address..."
                                />
                            </div>
                            <button
                                className="qr-download-btn"
                                onClick={downloadQRCode}
                                disabled={!qrValue.trim()}
                            >
                                ↓ Download QR Code
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddProduct;