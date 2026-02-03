interface QRCodeProps {
  value: string;
  size?: number;
}

export default function QRCode({ value, size = 160 }: QRCodeProps) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;

  return (
    <div className="bg-white p-3 rounded-lg shadow-md border-2 border-slate-200">
      <img src={qrUrl} alt="QR Code" className="w-full h-full" />
    </div>
  );
}
