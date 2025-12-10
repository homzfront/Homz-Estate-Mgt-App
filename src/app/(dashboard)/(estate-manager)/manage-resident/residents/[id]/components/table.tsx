/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import ReactDOM from 'react-dom'
import { estateBillingData } from '@/constant/index';
import LoadingSpinner from '@/components/general/loadingSpinner'
import useClickOutside from '@/app/utils/useClickOutside'
import ArrowDown from '@/components/icons/arrowDown'
import DeleteIcon from '@/components/icons/deleteIcon';
import EditIcon from '@/components/icons/editIcon';

interface Props {
    onOpenPaymentModal?: (data?: any) => void
}

const Table: React.FC<Props> = ({ onOpenPaymentModal }) => {
    const [paymentStatusDropdown, setPaymentStatusDropdown] = React.useState<number | null>(null)
    const [actionDropdown, setActionDropdown] = React.useState<number | null>(null)
    const [bills, setBills] = React.useState(estateBillingData)
    const [displayedBills, setDisplayedBills] = React.useState(estateBillingData.slice(0, 8))
    const [currentPage, setCurrentPage] = React.useState(1)
    const [isLoading, setIsLoading] = React.useState(false)
    const [activeEdit, setActiveEdit] = React.useState(false)
    const [activeDelete, setActiveDelete] = React.useState(false)
    const [paymentStatusPortalStyle, setPaymentStatusPortalStyle] = React.useState<React.CSSProperties | null>(null)
    const [actionDropdownPortalStyle, setActionDropdownPortalStyle] = React.useState<React.CSSProperties | null>(null)
    const loaderRef = React.useRef<HTMLDivElement | null>(null)
    const dropDownRef = React.useRef<HTMLDivElement>(null)
    const paymentStatusDropDownRef = React.useRef<HTMLDivElement>(null)
    const paymentStatusButtonRefs = React.useRef<{ [key: number]: HTMLButtonElement | null }>({})
    const actionButtonRefs = React.useRef<{ [key: number]: HTMLButtonElement | null }>({})
    useClickOutside(dropDownRef as any, () => {
        setActionDropdown(null)
    })
    useClickOutside(paymentStatusDropDownRef as any, () => {
        setPaymentStatusDropdown(null)
    })

    // Calculate portal position for payment status dropdown
    React.useEffect(() => {
        if (paymentStatusDropdown !== null && paymentStatusButtonRefs.current[paymentStatusDropdown]) {
            const rect = paymentStatusButtonRefs.current[paymentStatusDropdown]!.getBoundingClientRect()
            setPaymentStatusPortalStyle({
                position: 'absolute',
                top: rect.bottom + window.scrollY + 5,
                left: rect.left + window.scrollX - 0, 
                zIndex: 9999,
            })
        } else {
            setPaymentStatusPortalStyle(null)
        }
    }, [paymentStatusDropdown])

    // Calculate portal position for action dropdown
    React.useEffect(() => {
        if (actionDropdown !== null && actionButtonRefs.current[actionDropdown]) {
            const rect = actionButtonRefs.current[actionDropdown]!.getBoundingClientRect()
            setActionDropdownPortalStyle({
                position: 'absolute',
                top: rect.bottom + window.scrollY + 5,
                left: rect.left + window.scrollX - 170,
                zIndex: 9999,
            })
        } else {
            setActionDropdownPortalStyle(null)
        }
    }, [actionDropdown])

    const itemsPerPage = 8
    const totalPages = Math.ceil(bills.length / itemsPerPage)

    React.useEffect(() => {
        if (!loaderRef.current) return
        const el = loaderRef.current
        const observer = new IntersectionObserver((entries) => {
            const first = entries[0]
            if (first.isIntersecting && !isLoading && currentPage < totalPages) {
                loadMore()
            }
        }, { rootMargin: '200px' })
        observer.observe(el)
        return () => observer.unobserve(el)
    }, [loaderRef.current, isLoading, currentPage, totalPages])

    const loadMore = () => {
        setIsLoading(true)
        setTimeout(() => {
            const nextPage = currentPage + 1
            const startIndex = nextPage * itemsPerPage
            const endIndex = startIndex + itemsPerPage
            const newBills = bills.slice(startIndex, endIndex)
            setDisplayedBills(prev => [...prev, ...newBills])
            setCurrentPage(nextPage)
            setIsLoading(false)
        }, 500) // Simulate loading delay
    }

    // Delete bill
    const deleteBill = (id: string) => {
        setBills(prev => prev.filter(bill => bill._id !== id))
        setDisplayedBills(prev => prev.filter(bill => bill._id !== id))
    }

    return (
        <div className="mt-6 w-full mx-auto mb-[150px] md:mb-0">
            <div className="border overflow-x-auto scrollbar-container">
                <div className="w-full md:w-[180%]">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-whiteblue h-[50px] text-[13px] font-semibold text-BlackHomz">
                                <th className="pl-4 text-left w-auto md:w-[140px]">Bill Type</th>
                                <th className="hidden md:table-cell text-left w-[120px]">Frequency</th>
                                <th className="text-left w-auto md:w-[120px]">Amount</th>
                                <th className="hidden md:table-cell text-left w-[120px]">Amount Paid</th>
                                <th className="hidden md:table-cell text-left w-[120px]">Payment Type</th>
                                <th className="hidden md:table-cell text-left w-[160px]">Status</th>
                                <th className="hidden md:table-cell text-left w-[120px]">Payment Date</th>
                                <th className="hidden md:table-cell text-left w-[120px]">Rent Duration</th>
                                <th className="hidden md:table-cell text-left w-[120px]">Start Date</th>
                                <th className="hidden md:table-cell text-left w-[120px]">Due Date</th>
                                <th className="text-left w-auto md:w-[80px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedBills.length === 0 && (
                                Array.from({ length: 6 }).map((_, sk) => (
                                    <tr key={`sk-${sk}`} className="border-t-[1px]">
                                        <td className="py-[15px] pl-4">
                                            <div className="h-3 w-4 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="py-[15px]">
                                            <div className="h-3 w-28 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="py-[15px]">
                                            <div className="h-3 w-16 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="py-[15px] hidden md:table-cell">
                                            <div className="h-3 w-24 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="py-[15px] hidden md:table-cell">
                                            <div className="h-3 w-24 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="py-[15px] hidden md:table-cell">
                                            <div className="h-3 w-24 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="py-[15px] hidden md:table-cell">
                                            <div className="h-3 w-24 bg-whiteblue rounded animate-pulse"></div>
                                        </td>
                                        <td className="py-[15px] pr-4"></td>
                                    </tr>
                                ))
                            )}
                            {displayedBills.map((row, idx) => (
                                <tr key={row._id} className="border-t min-h-[60px] bg-white">
                                    <td className="pl-4 py-[15px] text-GrayHomz4 font-[500] text-[11px] w-auto md:w-[140px]">{row.billType}</td>
                                    <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px] w-[120px]">{row.frequency}</td>
                                    <td className="py-[15px] text-GrayHomz font-[500] text-[11px] w-auto md:w-[120px]">{row.amount || 'N/A'}</td>
                                    <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px] w-[120px]">{row.amountPaid || '₦0.00'}</td>
                                    <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px] w-[120px]">{row.paymentType || 'N/A'}</td>
                                    <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px] w-[120px]">
                                        <div style={{ width: 160 }}>
                                            {/** derive colors from paymentStatus: Paid (green), Pending (warning), Over Due (error) */}
                                            {(() => {
                                                const ps = row.paymentStatus || row.status || 'Pending'
                                                const bg = ps === 'Paid' ? '#CDEADD' : ps === 'Over Due' ? '#FDF2F2' : '#FCF3EB'
                                                const color = ps === 'Paid' ? '#039855' : ps === 'Over Due' ? '#D92D20' : '#DC6803'
                                                return (
                                                    <>
                                                        <button
                                                            ref={(el) => { paymentStatusButtonRefs.current[idx] = el; }}
                                                            style={{
                                                                width: 120,
                                                                height: 33,
                                                                borderRadius: 4,
                                                                opacity: 1,
                                                                gap: 4,
                                                                padding: '8px 12px',
                                                                background: bg,
                                                                color: color,
                                                                border: 'none',
                                                                fontFamily: 'Plus Jakarta Sans',
                                                                fontWeight: 400,
                                                                fontSize: 10,
                                                                lineHeight: '150%',
                                                                letterSpacing: 0,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                cursor: 'pointer',
                                                            }}
                                                            onClick={() => setPaymentStatusDropdown(idx)}
                                                        >
                                                            <span>{ps}</span>
                                                            <span style={{ marginLeft: 8, display: 'inline-flex', transform: paymentStatusDropdown === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                                                                <ArrowDown className={color} />
                                                            </span>
                                                        </button>
                                                        {paymentStatusDropdown === idx && paymentStatusPortalStyle && ReactDOM.createPortal(
                                                            <div
                                                                ref={paymentStatusDropDownRef}
                                                                style={{
                                                                    ...paymentStatusPortalStyle,
                                                                    width: 120,
                                                                    borderRadius: 4,
                                                                    border: '1px solid #E6E6E6',
                                                                    background: '#fff',
                                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                                                    padding: '8px 8px',
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    gap: 4,
                                                                }}
                                                            >
                                                                <button
                                                                    className="h-[25px] hover:bg-whiteblue rounded px-2 font-normal text-[10px] leading-[150%] text-[#4E4E4E] bg-transparent border-none mb-1 cursor-pointer text-left"
                                                                    onClick={() => {
                                                                        // set to Paid
                                                                        setBills(prev => prev.map(bill => bill._id === row._id ? { ...bill, paymentStatus: 'Paid', status: 'Active' } : bill))
                                                                        setDisplayedBills(prev => prev.map(bill => bill._id === row._id ? { ...bill, paymentStatus: 'Paid', status: 'Active' } : bill))
                                                                        setPaymentStatusDropdown(null)
                                                                    }}
                                                                >
                                                                    Paid
                                                                </button>
                                                                <button
                                                                    className="h-[25px] hover:bg-whiteblue rounded px-2 font-normal text-[10px] leading-[150%] text-[#4E4E4E] bg-transparent border-none cursor-pointer text-left"
                                                                    onClick={() => {
                                                                        // set to Pending
                                                                        setBills(prev => prev.map(bill => bill._id === row._id ? { ...bill, paymentStatus: 'Pending', status: 'Active' } : bill))
                                                                        setDisplayedBills(prev => prev.map(bill => bill._id === row._id ? { ...bill, paymentStatus: 'Pending', status: 'Active' } : bill))
                                                                        setPaymentStatusDropdown(null)
                                                                    }}
                                                                >
                                                                    Pending
                                                                </button>
                                                                <button
                                                                    className="h-[25px] hover:bg-whiteblue rounded px-2 font-normal text-[10px] leading-[150%] text-[#4E4E4E] bg-transparent border-none cursor-pointer text-left"
                                                                    onClick={() => {
                                                                        // set to Over Due
                                                                        setBills(prev => prev.map(bill => bill._id === row._id ? { ...bill, paymentStatus: 'Over Due', status: 'Inactive' } : bill))
                                                                        setDisplayedBills(prev => prev.map(bill => bill._id === row._id ? { ...bill, paymentStatus: 'Over Due', status: 'Inactive' } : bill))
                                                                        setPaymentStatusDropdown(null)
                                                                    }}
                                                                >
                                                                    Over Due
                                                                </button>
                                                            </div>,
                                                            document.body
                                                        )}
                                                    </>
                                                )
                                            })()}
                                        </div>
                                    </td>
                                    <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px] w-[120px]">{row.paymentDate || 'N/A'}</td>
                                    <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px] w-[120px]">{row.rentDuration || 'N/A'}</td>
                                    <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px] w-[120px]">{row.startDate || 'N/A'}</td>
                                    <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px] w-[120px]">{row.dueDate || 'N/A'}</td>
                                    <td className="py-[15px] z-10 sticky right-[-24px] md:right-0 w-auto md:w-[80px]">
                                        <button
                                            className="ml-4"
                                            onClick={() => setActionDropdown(idx)}
                                            ref={(el) => { actionButtonRefs.current[idx] = el; }}
                                        >
                                            ⋮
                                        </button>
                                        {actionDropdown === idx && actionDropdownPortalStyle && ReactDOM.createPortal(
                                            <div ref={dropDownRef} className="drop-down z-[999999] w-[180px] text-GrayHomz font-[500] text-[13px] border py-2 rounded-md bg-white flex flex-col items-center justify-around" style={actionDropdownPortalStyle}>
                                                {/* Edit */}
                                                <div
                                                    onMouseEnter={() => setActiveEdit(true)}
                                                    onMouseLeave={() => setActiveEdit(false)}
                                                    className="md:h-[30px] h-auto rounded-md flex gap-1 items-center text-GrayHomz hover:text-BlueHomz py-1 px-2 w-full">
                                                    <div className="w-full">
                                                        <div
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setActionDropdown(null)
                                                                // open edit modal if parent provided
                                                                onOpenPaymentModal?.(row)
                                                            }}
                                                            className="cursor-pointer px-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md"
                                                        >
                                                            <EditIcon color={activeEdit ? '#006AFF' : "#4E4E4E"} />
                                                            <p className={`${activeEdit ? 'text-BlueHomz' : "text-GrayHomz"} text-[11px] md:text-[13px] font-[500] py-1 px-2`}>
                                                                Edit Record
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Delete */}
                                                <div
                                                    onMouseEnter={() => setActiveDelete(true)}
                                                    onMouseLeave={() => setActiveDelete(false)}
                                                    className="md:h-[30px] h-auto rounded-md flex gap-1 items-center text-GrayHomz hover:text-BlueHomz py-1 px-2 w-full">
                                                    <div className="w-full">
                                                        <div
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                deleteBill(row._id)
                                                                setActionDropdown(null)
                                                            }}
                                                            className="cursor-pointer px-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md"
                                                        >
                                                            <DeleteIcon className={activeDelete ? '#d92d20' : "#4e4e4e"} />
                                                            <p className={`${activeDelete ? 'text-error' : "text-GrayHomz"} text-[11px] md:text-[13px] font-[500] py-1 px-2`}>
                                                                Remove Resident
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>,
                                            document.body
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {currentPage < totalPages && (
                                <tr>
                                    <td colSpan={12} className="py-2">
                                        <div ref={loaderRef} className="h-1" />
                                        {isLoading && (
                                            <div className="w-full max-w-[1000px] flex items-center justify-center py-3">
                                                <LoadingSpinner size={24} />
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Table