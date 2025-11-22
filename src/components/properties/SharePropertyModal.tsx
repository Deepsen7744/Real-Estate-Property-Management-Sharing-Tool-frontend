"use client";

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Share2, QrCode, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface SharePropertyModalProps {
  propertyId: string;
  propertyTitle: string;
}

export const SharePropertyModal = ({ propertyId, propertyTitle }: SharePropertyModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [publicUrl, setPublicUrl] = useState('');

  useEffect(() => {
    // Set URL only on client side
    if (typeof window !== 'undefined') {
      setPublicUrl(`${window.location.origin}/p/${propertyId}`);
    }
  }, [propertyId]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleDownloadQR = () => {
    const canvas = document.querySelector('#qr-code') as HTMLElement;
    if (!canvas) return;

    const svg = canvas.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `property-${propertyId}-qr.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('QR code downloaded!');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-full border border-slate-200 p-2 text-indigo-600 hover:bg-white"
        aria-label="Share property"
      >
        <Share2 className="h-4 w-4" />
      </button>
    );
  }

  return (
    <>
      {/* Modal Backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Share Property</h3>
              <p className="text-sm text-slate-500 mt-1">{propertyTitle}</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 hover:bg-slate-100 transition"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          {/* Public URL */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Public Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={publicUrl}
                  readOnly
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700"
                />
                <button
                  onClick={handleCopyLink}
                  className="btn-primary flex items-center gap-2 px-4"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="border-t border-slate-200 pt-4">
              <button
                onClick={() => setShowQR(!showQR)}
                className="btn-secondary flex w-full items-center justify-center gap-2"
              >
                <QrCode className="h-4 w-4" />
                {showQR ? 'Hide QR Code' : 'Show QR Code'}
              </button>

              {showQR && publicUrl && (
                <div className="mt-4 space-y-3">
                  <div id="qr-code" className="flex justify-center rounded-2xl bg-white p-6 border border-slate-200">
                    <QRCodeSVG
                      value={publicUrl}
                      size={200}
                      level="H"
                      includeMargin
                    />
                  </div>
                  <button
                    onClick={handleDownloadQR}
                    className="btn-secondary w-full"
                  >
                    Download QR Code
                  </button>
                  <p className="text-xs text-center text-slate-500">
                    Scan this QR code to view the property on mobile
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              Anyone with this link can view the property details
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
