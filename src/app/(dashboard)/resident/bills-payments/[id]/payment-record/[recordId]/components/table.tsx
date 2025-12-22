'use client'
import React from 'react'
import CustomModal from '@/components/general/customModal'
import CloseTransluscentIcon from '@/components/icons/closeTransluscentIcon'
import DocDocuSmall from '@/components/icons/docDocuSmall'
import { ResidentBillItem } from '@/store/useResidentBillStore'

interface TableProps {
    history: ResidentBillItem[];
}

const Table = ({ history }: TableProps) => {
    const [openDropdownId, setOpenDropdownId] = React.useState<string | null>(null)
    const [selectedRecord, setSelectedRecord] = React.useState<ResidentBillItem | null>(null)
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement | null>(null)

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdownId(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const getStatusStyle = (status: string) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'pending':
                return { backgroundColor: '#FCF3EB', color: '#DC6803' }
            case 'partialpaid':
            case 'partially paid':
                return { backgroundColor: '#EEF5FF', color: '#006AFF' }
            case 'overdue':
                return { backgroundColor: '#FDF2F2', color: '#D92D20' }
            case 'paid':
                return { backgroundColor: '#CDEADD', color: '#039855' }
            default:
                return { backgroundColor: '#F6F6F6', color: '#333' }
        }
    }

    const toggleDropdown = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenDropdownId(openDropdownId === id ? null : id)
    }

    const handleMoreInfo = (record: ResidentBillItem) => {
        setSelectedRecord(record)
        setIsModalOpen(true)
        setOpenDropdownId(null)
    }

    return (
        <>
            <CustomModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
                <div className='p-4 md:p-7 rounded-[12px] bg-white md:w-[550px] mt-[120px] mb-[50px] md:mt-0 md:mb-0'>
                    <div className='flex justify-between items-start pb-4'>
                        <div className='max-w-[80%] text-sm font-medium text-BlueHomz capitalize'>
                            {selectedRecord?.billType?.replace(/_/g, ' ')} - {selectedRecord?.period?.replace(/_/g, ' ')}
                        </div>
                        <button onClick={() => setIsModalOpen(false)}>
                            <CloseTransluscentIcon />
                        </button>
                    </div>

                    {selectedRecord && (
                        <div className="min-w-[300px]">
                            <div className="space-y-3 bg-[#F6F6F6] rounded-[12px] p-4">
                                <div className="grid grid-cols-2 py-2">
                                    <span className="text-GrayHomz text-xs col-span-1">Period</span>
                                    <span className="text-BlackHomz text-xs col-span-1 uppercase">{selectedRecord.period?.replace(/_/g, ' ')}</span>
                                </div>
                                <div className="grid grid-cols-2 py-2">
                                    <span className="text-GrayHomz text-xs col-span-1">Bill Amount</span>
                                    <span className="text-BlackHomz text-xs col-span-1">₦{selectedRecord.amount?.toLocaleString()}</span>
                                </div>
                                <div className="grid grid-cols-2 py-2">
                                    <span className="text-GrayHomz text-xs col-span-1">Amount Paid</span>
                                    <span className="text-BlackHomz text-xs col-span-1">₦{selectedRecord.amountPaid?.toLocaleString()}</span>
                                </div>
                                <div className="grid grid-cols-2 py-2">
                                    <span className="text-GrayHomz text-xs col-span-1">Outstanding Balance</span>
                                    <span className="text-BlackHomz text-xs col-span-1">₦{(selectedRecord.amount - selectedRecord.amountPaid).toLocaleString()}</span>
                                </div>
                                <div className="grid grid-cols-2 py-2">
                                    <span className="text-GrayHomz text-xs col-span-1">Payment Date</span>
                                    <span className="text-BlackHomz text-xs col-span-1">
                                        {selectedRecord.paymentDate ? new Date(selectedRecord.paymentDate).toLocaleDateString() : '-'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 py-2">
                                    <span className="text-GrayHomz text-xs col-span-1">Status</span>
                                    <span>
                                        <span
                                            className={'py-1 px-3 rounded-[4px] text-xs font-medium capitalize'}
                                            style={{
                                                ...getStatusStyle(selectedRecord.status)
                                            }}
                                        >
                                            {selectedRecord.status === 'partialpaid' ? 'Partially Paid' : selectedRecord.status}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CustomModal>
            <div className="mt-6 w-full mx-auto mb-[150px] md:mb-0">
                <div className="border overflow-x-auto scrollbar-container">
                    <div className="w-full">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-whiteblue h-[50px] text-[13px] font-semibold text-BlackHomz">
                                    <th className="text-left pl-4" style={{ width: "150px" }}>
                                        Period
                                    </th>
                                    <th className="text-left hidden md:table-cell" style={{ width: "150px" }}>Bill Amount</th>
                                    <th className="text-left" style={{ width: "150px" }}>Amount Paid</th>
                                    <th className="text-left hidden md:table-cell" style={{ width: "160px" }}>Outstanding Balance</th>
                                    <th className="text-left hidden md:table-cell" style={{ width: "160px" }}>Status</th>
                                    <th className="text-left hidden md:table-cell" style={{ width: "150px" }}>Payment Date</th>
                                    <th className="text-left md:hidden pr-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8 text-GrayHomz text-sm">
                                            No payment records found for this period.
                                        </td>
                                    </tr>
                                ) : (
                                    history.map((row) => {
                                        const statusStyle = getStatusStyle(row.status)
                                        const outstanding = (row.amount || 0) - (row.amountPaid || 0);
                                        return (
                                            <tr
                                                key={row._id}
                                                className="border-t min-h-[60px] bg-white hover:bg-gray-50 transition-colors"
                                                onClick={() => handleMoreInfo(row)}
                                            >
                                                <td className="pl-4 py-[15px] text-GrayHomz font-[500] text-[11px] uppercase">
                                                    {row.period?.replace(/_/g, ' ')}
                                                </td>
                                                <td className="py-[15px] text-GrayHomz font-[500] text-[11px] hidden md:table-cell">
                                                    ₦{row.amount?.toLocaleString()}
                                                </td>
                                                <td className="py-[15px] text-GrayHomz font-[500] text-[11px]">
                                                    ₦{row.amountPaid?.toLocaleString()}
                                                </td>
                                                <td className="py-[15px] text-GrayHomz font-[500] text-[11px] hidden md:table-cell">
                                                    ₦{Math.max(0, outstanding).toLocaleString()}
                                                </td>
                                                <td className="py-[15px] text-GrayHomz font-[500] text-[11px] hidden md:table-cell">
                                                    <div className="flex justify-start">
                                                        <span
                                                            className="py-2 px-3 rounded-[4px] inline-block text-center font-semibold capitalize"
                                                            style={{
                                                                ...statusStyle,
                                                                minWidth: '120px',
                                                                fontSize: '11px',
                                                            }}
                                                        >
                                                            {row.status === 'partialpaid' ? 'Partially Paid' : row.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-[15px] text-GrayHomz font-[500] text-[11px] hidden md:table-cell">
                                                    {row.paymentDate ? new Date(row.paymentDate).toLocaleDateString() : '-'}
                                                </td>
                                                <td className="py-[15px] md:hidden" onClick={(e) => e.stopPropagation()}>
                                                    <div className="relative" ref={openDropdownId === row._id ? dropdownRef : null}>
                                                        <button
                                                            onClick={(e) => toggleDropdown(row._id, e)}
                                                            className="p-1"
                                                        >
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                                <circle cx="12" cy="6" r="1.5" fill="#666" />
                                                                <circle cx="12" cy="12" r="1.5" fill="#666" />
                                                                <circle cx="12" cy="18" r="1.5" fill="#666" />
                                                            </svg>
                                                        </button>
                                                        {openDropdownId === row._id && (
                                                            <div className="absolute right-0 top-8 bg-white border rounded-lg shadow-lg z-10 w-48 py-1">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleMoreInfo(row);
                                                                    }}
                                                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm font-medium text-GrayHomz"
                                                                >
                                                                    <DocDocuSmall />
                                                                    <span>More info</span>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
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
