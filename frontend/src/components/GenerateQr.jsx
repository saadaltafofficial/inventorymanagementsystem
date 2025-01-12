import React, { useEffect, useState } from 'react'
import { generateQr, getQrImage } from '../utlis/qrcodehandling';
import { FaExternalLinkAlt } from "react-icons/fa";
import { TailSpin } from 'react-loader-spinner';

const GenerateQr = ({ id, qrData, items, setQrData, token }) => {
    const [isloading, setIsLoading] = useState(true)


    const handleQrData = async () => {
        const itemIds = items.map((item) => item._id);
        const qrImages = [];

        for (let id of itemIds) {
            const qrImageData = await getQrImage(id);
            if (qrImageData?.qrcode) {
                qrImages.push(qrImageData.qrcode);
            }
        }
        setIsLoading(false)
        setQrData(qrImages);
    };


    useEffect(() => {
        handleQrData()
    }, [])

    const renderQrContent = (id) => {
        const qrImage = qrData.find((data) => data.itemId === id);
        if (qrImage) {
            return <a href={qrImage.qrCodeImage} target='_blank' className="cursor-pointer flex justify-center items-center gap-2" alt="QR Code"><FaExternalLinkAlt size={12} />Qrcode</a>;
        } else {
            return (
                <>
                <button
                    className="bg-green-600 px-2 py-1 rounded-sm text-white text-sm"
                    onClick={() => generateQr(id, token)}
                >
                    Generate
                </button>
                </>
            );
        }
    };

    return (
        <>
            { isloading ? (
                    <div className="flex justify-center items-center">
                            <TailSpin   // Type of spinner
                                height="20"
                                width="20"
                                color="#1f2937"
                                ariaLabel="tail-spin-loading"
                                radius="1"
                                wrapperStyle={{}}
                                wrapperClass=""
                                visible={true}
                            />
                        </div>
                ) : renderQrContent(id)}
        </>
    )
}

export default GenerateQr