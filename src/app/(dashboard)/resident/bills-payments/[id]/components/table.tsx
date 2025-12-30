import React from 'react'
import LoadingSpinner from '@/components/general/loadingSpinner'
import ArrowRight from '@/components/icons/arrowRight';
import { useRouter, useParams } from 'next/navigation';
import PaymentRecordIcon from '@/components/icons/paymentRecordIcon';
import CustomModal from '@/components/general/customModal';
import DocDocuSmall from '@/components/icons/docDocuSmall';
import CloseTransluscentIcon from '@/components/icons/closeTransluscentIcon';
import { ResidentBillItem } from '@/store/useResidentBillStore';
import Image from 'next/image';
import PopUp from './popUp';

interface TableProps {
    groupedBills: Record<string, ResidentBillItem[]>;
}

const Table = ({ groupedBills }: TableProps) => {
    const router = useRouter();
    const { id: billingId } = useParams();
    const [selectedBill, setSelectedBill] = React.useState<ResidentBillItem | null>(null)
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [disabledPaymentRecord, setDisabledPaymentRecord] = React.useState(true);
    const [popUp, setpopUp] = React.useState(false);
    const [selectedDataId, setSelectedDataId] = React.useState<string | null>(null);
    const buttonRefs = React.useRef<{ [key: string]: HTMLElement | null }>({});

    const billsList = React.useMemo(() => {
        return Object.values(groupedBills).flat();
    }, [groupedBills]);

    const handleToggleMenu = (bill: ResidentBillItem) => {
        if (selectedDataId === bill._id && popUp) {
            setpopUp(false);
            setSelectedDataId(null);
        } else {
            setSelectedDataId(bill._id);
            setSelectedBill(bill);
            setpopUp(true);
        }
    };

    const handleMoreInfo = (bill: ResidentBillItem) => {
        setSelectedBill(bill)
        const isInactive = bill.status?.toLowerCase() === 'pending' || bill.status?.toLowerCase() === 'overdue'
        setDisabledPaymentRecord(isInactive)
        setIsModalOpen(true)
        setpopUp(false)
    }

    const handlePaymentRecord = (recordId: string, status: string) => {
        const isInactive = status?.toLowerCase() === 'pending' || status?.toLowerCase() === 'overdue'
        if (!isInactive) {
            router.push(`/resident/bills-payments/${billingId}/payment-record/${recordId}`)
        }
        setpopUp(false)
    }

    const getStatusStyles = (status: string) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'pending': return { bg: '#FCF3EB', color: '#DC6803' };
            case 'partialpaid':
            case 'partially paid': return { bg: '#EEF5FF', color: '#006AFF' };
            case 'overdue': return { bg: '#FDF2F2', color: '#D92D20' };
            case 'paid': return { bg: '#CDEADD', color: '#039855' };
            default: return { bg: '#F6F6F6', color: '#333' };
        }
    }

    return (
        <>
            <CustomModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
                <div className='p-4 md:p-7 rounded-[12px] bg-white md:w-[550px] mt-[120px] mb-[50px] md:mt-0 md:mb-0'>
                    <div className='flex justify-between items-start pb-4'>
                        <div className='max-w-[80%] text-sm font-medium text-BlueHomz capitalize'>
                            {selectedBill?.billType?.replace(/_/g, ' ')} - {selectedBill?.period?.replace(/_/g, ' ')}
                        </div>
                        <button onClick={() => setIsModalOpen(false)}>
                            <CloseTransluscentIcon />
                        </button>
                    </div>

                    {selectedBill && (
                        <div className="min-w-[300px]">
                            <div className="space-y-3 bg-[#F6F6F6] rounded-[12px] p-4">
                                <div className="grid grid-cols-2 py-2">
                                    <span className="text-GrayHomz text-xs col-span-1">Period</span>
                                    <span className="text-BlackHomz text-xs col-span-1 uppercase">{selectedBill.period?.replace(/_/g, ' ')}</span>
                                </div>
                                <div className="grid grid-cols-2 py-2">
                                    <span className="text-GrayHomz text-xs col-span-1">Amount</span>
                                    <span className="text-BlackHomz text-xs col-span-1">₦{selectedBill.amount?.toLocaleString()}</span>
                                </div>
                                <div className="grid grid-cols-2 py-2">
                                    <span className="text-GrayHomz text-xs col-span-1">Start Date</span>
                                    <span className="text-BlackHomz text-xs col-span-1">{new Date(selectedBill.billingStartDate).toLocaleDateString()}</span>
                                </div>
                                <div className="grid grid-cols-2 py-2">
                                    <span className="text-GrayHomz text-xs col-span-1">Due Date</span>
                                    <span className="text-BlackHomz text-xs col-span-1">{new Date(selectedBill.billingEndDate).toLocaleDateString()}</span>
                                </div>
                                <div className="grid grid-cols-2 py-2">
                                    <span className="text-GrayHomz text-xs col-span-1">Status</span>
                                    <span >
                                        <span
                                            className={'py-1 px-3 rounded-[4px] text-xs font-medium capitalize'}
                                            style={{
                                                backgroundColor: getStatusStyles(selectedBill.status).bg,
                                                color: getStatusStyles(selectedBill.status).color
                                            }}
                                        >
                                            {selectedBill.status === 'partialpaid' ? 'Partially Paid' : selectedBill.status}
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    if (!disabledPaymentRecord && selectedBill) {
                                        router.push(`/resident/bills-payments/${billingId}/payment-record/${selectedBill._id}`)
                                    }
                                    setIsModalOpen(false);
                                }}
                                disabled={disabledPaymentRecord}
                                className={`${disabledPaymentRecord ? "bg-[#E6E6E6] text-[#D5D5D5] cursor-not-allowed" : "bg-BlueHomz text-white cursor-pointer"} mt-2 h-[48px] rounded-[4px] w-full px-4 py-2 flex justify-center items-center gap-2 text-base font-medium`}>
                                <PaymentRecordIcon color={disabledPaymentRecord ? "#D5D5D5" : "#ffffff"} />
                                <span>Payment record</span>
                            </button>
                        </div>
                    )}
                </div>
            </CustomModal>

            <div className="mt-6 w-full mx-auto mb-[150px] md:mb-0">
                <div className="border overflow-x-auto scrollbar-container">
                    <div className="w-full md:w-[100%]">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-whiteblue h-[50px] text-[13px] font-semibold text-BlackHomz">
                                    <th className="pl-4 text-left w-auto"><span className="hidden md:inline">Period</span><span className="md:hidden">Bill Period</span></th>
                                    <th className="text-left w-auto hidden md:table-cell">Amount</th>
                                    <th className="text-left w-auto hidden md:table-cell">Start Date</th>
                                    <th className="text-left w-auto hidden md:table-cell">Due Date</th>
                                    <th className="text-start w-[150px]">Status</th>
                                    <th className="text-left md:w-[180px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billsList.length === 0 ? (
                                    Array.from({ length: 6 }).map((_, sk) => (
                                        <tr key={`sk-${sk}`} className="border-t-[1px]">
                                            <td className="py-[15px] pl-4">
                                                <div className="h-3 w-28 bg-whiteblue animate-pulse"></div>
                                            </td>
                                            <td className="py-[15px] hidden md:table-cell">
                                                <div className="h-3 w-28 bg-whiteblue animate-pulse"></div>
                                            </td>
                                            <td className="py-[15px] hidden md:table-cell">
                                                <div className="h-3 w-28 bg-whiteblue animate-pulse"></div>
                                            </td>
                                            <td className="py-[15px] hidden md:table-cell">
                                                <div className="h-3 w-28 bg-whiteblue animate-pulse"></div>
                                            </td>
                                            <td className="py-[15px]">
                                                <div className="h-3 w-24 bg-whiteblue animate-pulse"></div>
                                            </td>
                                            <td className="py-[15px]"></td>
                                        </tr>
                                    ))
                                ) : (
                                    billsList.map((row) => {
                                        const isInactive = row.status === 'pending' || row.status === 'overdue';
                                        const statusStyles = getStatusStyles(row.status);
                                        return (
                                            <tr
                                                key={row._id}
                                                className="border-t min-h-[60px] bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                                                onClick={() => handleMoreInfo(row)}
                                            >
                                                <td className="pl-4 py-[15px] text-GrayHomz font-[500] text-[11px] uppercase">
                                                    {row.period?.replace(/_/g, ' ')}
                                                </td>
                                                <td className="py-[15px] text-GrayHomz font-[500] text-[11px] hidden md:table-cell">
                                                    ₦{row.amount?.toLocaleString()}
                                                </td>
                                                <td className="py-[15px] text-GrayHomz font-[500] text-[11px] hidden md:table-cell">
                                                    {new Date(row.billingStartDate).toLocaleDateString()}
                                                </td>
                                                <td className="py-[15px] text-GrayHomz font-[500] text-[11px] hidden md:table-cell">
                                                    {new Date(row.billingEndDate).toLocaleDateString()}
                                                </td>
                                                <td className="py-[15px] text-GrayHomz font-[500] text-[11px] min-w-[150px]">
                                                    <div className="flex justify-start">
                                                        <span
                                                            className={'py-2 px-3 rounded-[4px] inline-block text-center font-semibold capitalize'}
                                                            style={{
                                                                backgroundColor: statusStyles.bg,
                                                                color: statusStyles.color,
                                                                width: '120px',
                                                                fontSize: '11px',
                                                            }}
                                                        >
                                                            {row.status === 'partialpaid' ? 'Partially Paid' : row.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-[15px] md:w-[180px]" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        ref={(el) => { buttonRefs.current[row._id] = el }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleToggleMenu(row);
                                                        }}
                                                        className="p-1"
                                                    >
                                                        <Image
                                                            src="/dots-vertical.png"
                                                            alt="Options"
                                                            height={20}
                                                            width={20}
                                                        />
                                                    </button>
                                                    {popUp && selectedDataId === row._id && (
                                                        <PopUp
                                                            bill={row}
                                                            onClose={() => setpopUp(false)}
                                                            anchorRef={{ current: buttonRefs.current[row._id] } as any}
                                                            handleMoreInfo={() => handleMoreInfo(row)}
                                                            handlePaymentRecord={() => handlePaymentRecord(row._id, row.status)}
                                                            isInactive={isInactive}
                                                        />
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Table