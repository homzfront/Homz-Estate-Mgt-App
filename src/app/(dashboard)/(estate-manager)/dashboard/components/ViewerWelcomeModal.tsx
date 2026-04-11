"use client";
import React from 'react';
import CustomModal from '@/components/general/customModal';

interface ViewerWelcomeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ViewerWelcomeModal = ({ isOpen, onClose }: ViewerWelcomeModalProps) => {
    return (
        <CustomModal isOpen={isOpen} onRequestClose={onClose}>
            <div className='p-6 rounded-[12px] bg-white w-full max-w-[460px]'>
                <div className='flex flex-col items-center gap-4 text-center'>
                    <div className='w-14 h-14 rounded-full bg-[#EEF5FF] flex items-center justify-center'>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#006AFF" strokeWidth="2"/>
                            <path d="M12 8v4M12 16h.01" stroke="#006AFF" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </div>
                    <h2 className='text-[18px] font-semibold text-BlackHomz'>View-Only Access</h2>
                    <p className='text-sm text-GrayHomz leading-relaxed'>
                        You have been added to this estate as a <strong>Viewer</strong>. You can browse all sections of the estate dashboard but cannot make any changes.
                    </p>
                    <div className='w-full bg-[#F8FAFF] rounded-[8px] p-4 text-left text-sm text-GrayHomz'>
                        <p className='font-medium text-BlackHomz mb-2'>What you can do:</p>
                        <ul className='flex flex-col gap-1'>
                            <li className='flex items-center gap-2'>
                                <span className='w-1.5 h-1.5 rounded-full bg-BlueHomz flex-shrink-0' />
                                View residents and their details
                            </li>
                            <li className='flex items-center gap-2'>
                                <span className='w-1.5 h-1.5 rounded-full bg-BlueHomz flex-shrink-0' />
                                View access control records
                            </li>
                            <li className='flex items-center gap-2'>
                                <span className='w-1.5 h-1.5 rounded-full bg-BlueHomz flex-shrink-0' />
                                View billing and payment summaries
                            </li>
                            <li className='flex items-center gap-2'>
                                <span className='w-1.5 h-1.5 rounded-full bg-BlueHomz flex-shrink-0' />
                                View estate information
                            </li>
                        </ul>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className='mt-6 w-full h-[45px] bg-BlueHomz text-white rounded-[4px] text-sm font-medium hover:opacity-90 transition-opacity'
                >
                    Got it
                </button>
            </div>
        </CustomModal>
    );
};

export default ViewerWelcomeModal;