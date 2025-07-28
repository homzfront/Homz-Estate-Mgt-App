import Facebook from '@/components/icons/facebook';
import Insta from '@/components/icons/insta';
import LinkedIn from '@/components/icons/linkedIn';
import Message from '@/components/icons/message';
import Phone from '@/components/icons/phone';
import Twitter from '@/components/icons/twitter';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

interface CopiedState {
  copied: boolean;
  copiedII: boolean;
  copiedIII: boolean;
  copiedIV: boolean;
}

const SupportComponent: React.FC = () => {
  const [copiedState, setCopiedState] = useState<CopiedState>({
    copied: false,
    copiedII: false,
    copiedIII: false,
    copiedIV: false,
  });

  const handleCopyClick = async (text: string, identifier: keyof CopiedState) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedState((prevState) => ({ ...prevState, [identifier]: true }));
      setTimeout(() => 
        setCopiedState((prevState) => ({ ...prevState, [identifier]: false })), 
        2000
      );
    } catch (error) {
      console.error('Unable to copy to clipboard:', error);
    }
  };

  return (
    <div>
      <div className="max-w-[420px] gap-6 flex flex-col">
        <p className="text-[16px] mt-2 font-[400] text-GrayHomz">
          Any questions or remarks? Just send us a message. Fill up the form
          and our team will get back to you.
        </p>

        {/* Phone Number Section */}
        <div className="mt-8 flex gap-8">
          <div className="rounded-full h-[40px] w-[40px] flex justify-center items-center bg-blue-100">
            <div className="h-[24px] w-[24px] flex justify-center items-center">
              <Phone />
            </div>
          </div>
          <div className="flex gap-5 flex-col">
            <div className="flex gap-2 pl-4">
              <p className="text-[16px] font-[400] text-GrayHomz">
                +2349160002460
              </p>
              <div
                onClick={() => handleCopyClick('+2349160002460', 'copiedII')}
                className="relative"
              >
                <Image
                  className="cursor-pointer"
                  src="/copy.png"
                  alt="Copy phone number"
                  height={16}
                  width={17}
                />
                {copiedState.copiedII && (
                  <span className="text-[11px] text-Success italic absolute">
                    Copied!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Email Section */}
        <div className="mt-1 flex gap-8">
          <div className="rounded-full h-[40px] w-[40px] flex justify-center items-center bg-blue-100">
            <div className="h-[24px] w-[24px] flex justify-center items-center">
              <Message />
            </div>
          </div>
          <div className="flex gap-2">
            <Link 
              href="mailto:info@homz.ng" 
              className="text-[16px] font-[400] underline text-GrayHomz"
            >
              info@homz.ng
            </Link>
            <div 
              onClick={() => handleCopyClick('info@homz.ng', 'copiedIII')} 
              className="relative"
            >
              <Image
                className="cursor-pointer"
                src="/copy.png"
                alt="Copy email address"
                height={16}
                width={17}
              />
              {copiedState.copiedIII && (
                <span className="text-[11px] text-Success italic absolute">
                  Copied!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex mt-3 gap-5 items-center">
          <Link href="https://www.instagram.com/homzng" passHref legacyBehavior>
            <a target="_blank" rel="noopener noreferrer">
              <div className="rounded-full h-[40px] w-[40px] flex justify-center items-center bg-blue-100">
                <div className="h-[24px] w-[24px] flex justify-center items-center">
                  <Insta />
                </div>
              </div>
            </a>
          </Link>

          <Link href="https://www.facebook.com/homzng" passHref legacyBehavior>
            <a target="_blank" rel="noopener noreferrer">
              <div className="rounded-full h-[40px] w-[40px] flex justify-center items-center bg-blue-100">
                <div className="h-[24px] w-[24px] flex justify-center items-center">
                  <Facebook />
                </div>
              </div>
            </a>
          </Link>

          <Link href="https://twitter.com/homzng" passHref legacyBehavior>
            <a target="_blank" rel="noopener noreferrer">
              <div className="rounded-full h-[40px] w-[40px] flex justify-center items-center bg-blue-100">
                <div className="h-[24px] w-[24px] flex justify-center items-center">
                  <Twitter />
                </div>
              </div>
            </a>
          </Link>

          <Link href="https://linkedin.com/company/homzng" passHref legacyBehavior>
            <a target="_blank" rel="noopener noreferrer">
              <div className="rounded-full h-[40px] w-[40px] flex justify-center items-center bg-blue-100">
                <div className="h-[24px] w-[24px] flex justify-center items-center">
                  <LinkedIn />
                </div>
              </div>
            </a>
          </Link>

          <div className="flex gap-1">
            <Link 
              href="https://homz.ng" 
              className="text-[16px] font-[400] text-GrayHomz underline"
            >
              homz.ng
            </Link>
            <div 
              onClick={() => handleCopyClick('homz.ng', 'copiedIV')} 
              className="relative"
            >
              <Image
                className="cursor-pointer"
                src="/copy.png"
                alt="Copy website URL"
                height={12}
                width={17}
              />
              {copiedState.copiedIV && (
                <span className="text-[11px] text-Success italic absolute">
                  Copied!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportComponent;