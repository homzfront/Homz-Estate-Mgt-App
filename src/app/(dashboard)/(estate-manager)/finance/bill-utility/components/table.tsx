/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import Ticked from '@/components/icons/ticked'
import UnTicked from '@/components/icons/unTicked'
import { estateBillingData } from '@/constant/index';
import LoadingSpinner from '@/components/general/loadingSpinner'
import { LoaderIcon } from 'react-hot-toast'
import useClickOutside from '@/app/utils/useClickOutside'
import ArrowDown from '@/components/icons/arrowDown'
import Eye from '@/components/icons/Eye';
import DeleteIcon from '@/components/icons/deleteIcon';
import EditIcon from '@/components/icons/editIcon';

const Table = () => {
    const [statusDropdown, setStatusDropdown] = React.useState<number | null>(null)
    const [actionDropdown, setActionDropdown] = React.useState<number | null>(null)
    const [selectedRows, setSelectedRows] = React.useState<string[]>([])
    const [selectAll, setSelectAll] = React.useState(false)
    const [bills, setBills] = React.useState(estateBillingData)
    const [displayedBills, setDisplayedBills] = React.useState(estateBillingData.slice(0, 8))
    const [currentPage, setCurrentPage] = React.useState(1)
    const [isLoading, setIsLoading] = React.useState(false)
    const [activeView, setActiveView] = React.useState(false)
    const [activeEdit, setActiveEdit] = React.useState(false)
    const [activeDelete, setActiveDelete] = React.useState(false)
    const loaderRef = React.useRef<HTMLDivElement | null>(null)
    const dropDownRef = React.useRef<HTMLDivElement>(null)
    const statusDropDownRef = React.useRef<HTMLDivElement>(null)
    useClickOutside(dropDownRef as any, () => {
        setActionDropdown(null)
    })
    useClickOutside(statusDropDownRef as any, () => {
        setStatusDropdown(null)
    })

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

    React.useEffect(() => {
        setSelectedRows(prev => prev.filter(id => displayedBills.some(item => item._id === id)))
        setSelectAll(selectedRows.length === displayedBills.length && displayedBills.length > 0)
    }, [displayedBills])

    // Select all rows
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedRows([])
            setSelectAll(false)
        } else {
            setSelectedRows(displayedBills.map(row => row._id))
            setSelectAll(true)
        }
    }

    // Select individual row
    const handleRowSelect = (rowId: string) => {
        if (selectedRows.includes(rowId)) {
            setSelectedRows(selectedRows.filter(id => id !== rowId))
            setSelectAll(false)
        } else {
            const newSelected = [...selectedRows, rowId]
            setSelectedRows(newSelected)
            if (newSelected.length === displayedBills.length) setSelectAll(true)
        }
    }

    // Delete bill
    const deleteBill = (id: string) => {
        setBills(prev => prev.filter(bill => bill._id !== id))
        setDisplayedBills(prev => prev.filter(bill => bill._id !== id))
    }

    // Status change
    const handleStatusChange = (idx: number, newStatus: string) => {
        // For now, just close dropdown. In real app, update via API
        setStatusDropdown(null)
    }

    return (
        <div className="mt-6 w-full mx-auto mb-[150px] md:mb-0">
            <div className="border overflow-x-auto scrollbar-container">
                <div className="w-full md:w-[150%]">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-whiteblue h-[50px] text-[13px] font-semibold text-BlackHomz">
                                <th className="cursor-pointer text-left pl-4 w-[40px]" onClick={handleSelectAll}>
                                    {selectAll ? <Ticked /> : <UnTicked />}
                                </th>
                                <th className="text-left w-auto md:w-[140px]">Bill Name</th>
                                <th className="text-left w-auto md:w-[120px]">Amount</th>
                                <th className="hidden md:table-cell text-left w-[120px]">Frequency</th>
                                <th className="hidden md:table-cell text-left w-[120px]">Start Date</th>
                                <th className="hidden md:table-cell text-left w-[120px]">Status</th>
                                <th className="hidden md:table-cell text-left w-[140px]">Residence Type</th>
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
                                    <td
                                        onClick={() => handleRowSelect(row._id)}
                                        className="cursor-pointer pr-2 py-[15px] pl-4 font-[500] text-[11px] w-[40px]"
                                    >
                                        {selectedRows.includes(row._id) ? <Ticked /> : <UnTicked />}
                                    </td>
                                    <td className="py-[15px] text-GrayHomz4 font-[500] text-[11px] w-auto md:w-[140px]">{row.billName}</td>
                                    <td className="py-[15px] text-GrayHomz font-[500] text-[11px] w-auto md:w-[120px]">{row.amount}</td>
                                    <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px] w-[120px]">{row.frequency}</td>
                                    <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px] w-[120px]">{row.startDate}</td>
                                    <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px] w-[120px]">
                                        <div style={{ position: 'relative', width: 100 }}>
                                            <button
                                                style={{
                                                    width: 100,
                                                    height: 33,
                                                    borderRadius: 4,
                                                    opacity: 1,
                                                    gap: 4,
                                                    padding: '8px 12px',
                                                    background: row.status === 'Active' ? '#CDEADD' : '#FDF2F2',
                                                    color: row.status === 'Active' ? '#039855' : '#D92D20',
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
                                                onClick={() => setStatusDropdown(idx)}
                                            >
                                                <span>{row.status}</span>
                                                <span style={{ marginLeft: 8, display: 'inline-flex', transform: statusDropdown === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                                                    <ArrowDown className={row.status === 'Active' ? '#039855' : '#D92D20'} />
                                                </span>
                                            </button>
                                            {statusDropdown === idx && (
                                                <div
                                                    ref={statusDropDownRef}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 40,
                                                        left: 0,
                                                        width: 100,
                                                        borderRadius: 4,
                                                        border: '1px solid #E6E6E6',
                                                        background: '#fff',
                                                        zIndex: 100,
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
                                                            // update status in bills
                                                            setBills(prev => prev.map(bill => bill._id === row._id ? { ...bill, status: 'Active' } : bill))
                                                            setDisplayedBills(prev => prev.map(bill => bill._id === row._id ? { ...bill, status: 'Active' } : bill))
                                                            setStatusDropdown(null)
                                                        }}
                                                    >
                                                        Active
                                                    </button>
                                                    <button
                                                        className="h-[25px] hover:bg-whiteblue rounded px-2 font-normal text-[10px] leading-[150%] text-[#4E4E4E] bg-transparent border-none cursor-pointer text-left"
                                                        onClick={() => {
                                                            setBills(prev => prev.map(bill => bill._id === row._id ? { ...bill, status: 'Inactive' } : bill))
                                                            setDisplayedBills(prev => prev.map(bill => bill._id === row._id ? { ...bill, status: 'Inactive' } : bill))
                                                            setStatusDropdown(null)
                                                        }}
                                                    >
                                                        Inactive
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="hidden md:table-cell py-[15px] text-GrayHomz font-[500] text-[11px] w-[140px]">{row.residenceType}</td>
                                    <td className="py-[15px] z-10 sticky right-[-24px] md:right-0 w-auto md:w-[80px]">
                                        <button
                                            className="ml-4"
                                            onClick={() => setActionDropdown(idx)}
                                        >
                                            ⋮
                                        </button>
                                        {actionDropdown === idx && (
                                            <div ref={dropDownRef} className="drop-down absolute top-9 md:top-11 left-[-135px] md:left-[-170px] z-[999999] w-[150px] md:w-[180px] text-GrayHomz font-[500] text-[13px] border py-2 rounded-md bg-white flex flex-col items-center justify-around">
                                                {/* View */}
                                                <div
                                                    onMouseEnter={() => setActiveView(true)}
                                                    onMouseLeave={() => setActiveView(false)}
                                                    className="md:h-[30px] h-auto rounded-md flex gap-1 items-center text-GrayHomz hover:text-BlueHomz py-1 px-2 w-full">
                                                    <div className="w-full">
                                                        <div
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setActionDropdown(null)
                                                            }}
                                                            className="cursor-pointer px-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md"
                                                        >
                                                            <Eye className='w-5 h-5' />
                                                            <p className={`${activeView ? 'text-BlueHomz' : "text-GrayHomz"} text-[11px] md:text-[13px] font-[500] py-1 px-2`}>
                                                                View
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
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
                                                            }}
                                                            className="cursor-pointer px-2 hover:bg-whiteblue flex gap-1 items-center h-full w-full rounded-md"
                                                        >
                                                            <EditIcon color={activeEdit ? '#006AFF' : "#4E4E4E"} />
                                                            <p className={`${activeEdit ? 'text-BlueHomz' : "text-GrayHomz"} text-[11px] md:text-[13px] font-[500] py-1 px-2`}>
                                                                Edit
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
                                                                Delete
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {currentPage < totalPages && (
                                <tr>
                                    <td colSpan={8} className="py-2">
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