import React from 'react'
import CustomModal from '@/components/general/customModal';
import CloseTransluscentIcon from '@/components/icons/closeTransluscentIcon';

interface BillingItem {
  _id: string;
  billingId: string;
  periodNumber: number;
  billType: string;
  frequency: string;
  amount: number;
  amountPaid: number;
  paymentType: string;
  paymentMode: string;
  paymentDate: string;
  status: string;
}

interface BillingItemWithBalance extends BillingItem {
  balanceAfter: number;
}

interface BillingGroup {
  key: string;
  items: BillingItem[];
  billType: string;
  formattedBillType: string;
  frequency: string;
  amount: number;
  amountPaid: number;
  outstanding: number;
  paymentType: string;
  paymentMode: string;
  status: string;
  paymentDate: string;
  currency: string;
}

interface BillingDetailsModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  selectedGroup: BillingGroup | null;
}

const BillingDetailsModal: React.FC<BillingDetailsModalProps> = ({
  isOpen,
  onRequestClose,
  selectedGroup
}) => {
  const getStatusStyle = (status: string) => {
    const ps = status?.toLowerCase()
    if (ps === 'paid') return { bg: '#CDEADD', color: '#039855', label: 'Paid' }
    if (ps === 'pending') return { bg: '#FCF3EB', color: '#DC6803', label: 'Pending' }
    if (ps === 'partialpaid' || ps === 'partially paid') return { bg: '#FDF2F2', color: '#D92D20', label: 'Partially Paid' }
    return { bg: '#FDF2F2', color: '#D92D20', label: status }
  }

  return (
    <CustomModal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className='p-4 rounded-[12px] bg-white w-[350px] md:w-[550px] mb-[50px] md:mb-0 relative'>
        <button onClick={onRequestClose} className='absolute right-4 top-4 text-GrayHomz hover:text-BlackHomz'>
          <CloseTransluscentIcon />
        </button>

        <h2 className='text-[16px] font-medium text-BlackHomz'>Billing Period Details</h2>
        <p className='mt-1 text-[13px] font-normal text-GrayHomz mr-[10%] md:mr-[20%]'>View detailed information for this billing period.</p>

        {selectedGroup && (
          <div className='mt-6 space-y-4'>
            <div className='bg-inputBg py-5 px-4 rounded-[8px] space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm text-GrayHomz font-medium'>Bill Type</label>
                  <p className='text-BlackHomz font-medium mt-1'>{selectedGroup.formattedBillType || selectedGroup.billType}</p>
                </div>
                <div>
                  <label className='text-sm text-GrayHomz font-medium'>Frequency</label>
                  <p className='text-BlackHomz font-medium mt-1'>{selectedGroup.frequency}</p>
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm text-GrayHomz font-medium'>Bill Amount</label>
                  <p className='text-BlackHomz font-medium mt-1'>{selectedGroup.currency}{selectedGroup.amount.toLocaleString()}</p>
                </div>
                <div>
                  <label className='text-sm text-GrayHomz font-medium'>Total Amount Paid</label>
                  <p className='text-BlackHomz font-medium mt-1'>{selectedGroup.currency}{selectedGroup.amountPaid.toLocaleString()}</p>
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm text-GrayHomz font-medium'>Outstanding Balance</label>
                  <p className='text-BlackHomz font-medium mt-1'>{selectedGroup.currency}{selectedGroup.outstanding.toLocaleString()}</p>
                </div>
                <div>
                  <label className='text-sm text-GrayHomz font-medium'>Status</label>
                  <div className='mt-1'>
                    <div
                      style={{
                        background: getStatusStyle(selectedGroup.status).bg,
                        color: getStatusStyle(selectedGroup.status).color,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        width: 'fit-content',
                        fontWeight: 500
                      }}
                    >
                      {getStatusStyle(selectedGroup.status).label}
                    </div>
                  </div>
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm text-GrayHomz font-medium'>Payment Type</label>
                  <p className='text-BlackHomz font-medium mt-1'>{selectedGroup.paymentType}</p>
                </div>
                <div>
                  <label className='text-sm text-GrayHomz font-medium'>Mode of Payment</label>
                  <p className='text-BlackHomz font-medium mt-1 capitalize'>[{selectedGroup.paymentMode}]</p>
                </div>
              </div>
            </div>

            {selectedGroup.items.length > 1 && (
              <div className='bg-inputBg py-5 px-4 rounded-[8px]'>
                <h3 className='text-[14px] font-medium text-BlackHomz mb-4'>Payment History</h3>
                <div className='space-y-3'>
                  {selectedGroup.items.map((item: BillingItem) => {
                    const sortedAsc = [...selectedGroup.items].sort((a: BillingItem, b: BillingItem) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime());
                    let runningPaid = 0;
                    const itemWithBalance: BillingItemWithBalance[] = sortedAsc.map((i: BillingItem) => {
                      runningPaid += i.amountPaid;
                      return { ...i, balanceAfter: Math.max(0, selectedGroup.amount - runningPaid) };
                    });
                    const displayItem = itemWithBalance.find((i: BillingItemWithBalance) => i._id === item._id);
                    const balance = displayItem ? displayItem.balanceAfter : 0;

                    return (
                      <div key={item._id} className='border border-gray-200 rounded-[6px] p-3'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                          <div>
                            <label className='text-xs text-GrayHomz font-medium'>Amount Paid</label>
                            <p className='text-BlackHomz font-medium text-sm mt-1'>{selectedGroup.currency}{item.amountPaid.toLocaleString()}</p>
                          </div>
                          <div>
                            <label className='text-xs text-GrayHomz font-medium'>Outstanding Balance</label>
                            <p className='text-BlackHomz font-medium text-sm mt-1'>{selectedGroup.currency}{balance.toLocaleString()}</p>
                          </div>
                          <div>
                            <label className='text-xs text-GrayHomz font-medium'>Payment Date</label>
                            <p className='text-BlackHomz font-medium text-sm mt-1'>{new Date(item.paymentDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </CustomModal>
  )
}

export default BillingDetailsModal