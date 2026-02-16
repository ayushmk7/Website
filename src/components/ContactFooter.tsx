import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function ContactFooter() {
    const [copied, setCopied] = useState(false);
    const email = "contactayushmadhav@gmail.com";

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="flex justify-center py-12">
            <div className="flex flex-col items-center gap-4">
                <p className="text-lg font-medium text-foreground text-center flex items-center gap-3">
                    Let's connect at{' '}
                    <a
                        href={`mailto:${email}`}
                        className="hover:text-blue-600 transition-colors underline decoration-2 underline-offset-4"
                    >
                        {email}
                    </a>

                    <button
                        onClick={handleCopy}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 group relative"
                        aria-label="Copy email address"
                        title="Copy email to clipboard"
                    >
                        {copied ? (
                            <Check className="w-5 h-5" />
                        ) : (
                            <Copy className="w-5 h-5" />
                        )}

                        {/* Tooltip */}
                        <span className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 transition-opacity whitespace-nowrap pointer-events-none ${copied ? 'opacity-100' : 'group-hover:opacity-100'}`}>
                            {copied ? 'Copied!' : 'Copy Email'}
                        </span>
                    </button>
                </p>
            </div>
        </div>
    );
}
