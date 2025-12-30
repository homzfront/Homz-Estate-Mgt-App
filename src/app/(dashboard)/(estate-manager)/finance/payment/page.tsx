import React from 'react'
import { useSelectedCommunity } from '@/store/useSelectedCommunity'
import EmptyEstateState from '../../components/emptyEstateState'

const Payment = () => {
  const selectedCommunity = useSelectedCommunity((state) => state.selectedCommunity);

  return (
    <div className='p-8 w-full'>
      {!selectedCommunity ? (
        <EmptyEstateState />
      ) : (
        <div>Payment content goes here</div>
      )}
    </div>
  )
}

export default Payment
