'use client';

import { useRef } from 'react';

import html2canvas from 'html2canvas-pro';
import QRCode from 'react-qr-code';
import { useDispatch } from 'react-redux';

import images from '@/assets/images';

import Image from '@/components/image';

import { addToast } from '@/redux/actions/toast-action';

function QR({ isGroup, slug }) {
    const qrContainer = useRef();
    const downloadBtn = useRef();

    const dispatch = useDispatch();

    const handleDownloadQR = async () => {
        const qrElement = qrContainer.current;
        const downloadElement = downloadBtn.current;

        downloadElement.style.display = 'none';
        await document.fonts.ready;
        qrElement.style.boxShadow = 'none';

        html2canvas(qrElement, {
            useCORS: true,
            allowTaint: false,
            scale: 1,
        })
            .then((canvas) => {
                downloadElement.style.display = 'block';

                const link = document.createElement('a');
                link.download = `${slug}-qr-code.jpg`;
                link.href = canvas.toDataURL('image/jpg');
                link.click();
                qrElement.style.boxShadow = `rgba(0, 0, 0, 0.19) 0px 10px 20px,rgba(0, 0, 0, 0.23) 0px 6px 6px;`;
            })
            .catch((error) => {
                dispatch(addToast({ type: 'error', content: error.message }));
                downloadElement.style.display = 'block';
                qrElement.style.boxShadow = `rgba(0, 0, 0, 0.19) 0px 10px 20px,rgba(0, 0, 0, 0.23) 0px 6px 6px;`;
            });
    };

    return (
        <div className="qr-container" onClick={(e) => e.stopPropagation()} ref={qrContainer}>
            <h2 className="qr-title">Retro Chat</h2>
            <Image className="logo-img" src={images.largeLogo} />
            <QRCode
                className="qr-code"
                size={256}
                value={`${process.env.NEXT_PUBLIC_URL}/profile/${isGroup ? slug : `@${slug}`}`}
                viewBox={`0 0 256 256`}
            />

            <button className="download-btn" onClick={handleDownloadQR} ref={downloadBtn}>
                Tải xuống
            </button>
        </div>
    );
}

export default QR;
