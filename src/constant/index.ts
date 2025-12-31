export const estateBillingData = [
  {
    _id: 'bill_0',
    billName: 'Annual Estate Dues',
    billType: 'Dues',
    paymentStatus: 'Pending',
    residentStatus: 'Pending',
    frequency: 'Quarterly',
    startDate: '22 Aug, 2025',
    dueDate: '23 Aug, 2025',
    rentDuration: '12 Months',
    paymentType: 'In-app',
    paymentDate: 'N/A',
    amountPaid: '₦0.00',
    status: 'Active',
    isMultiple: false,
    priceTiers: [
      { residenceType: 'Detached House/Bungalow', amount: '₦10,000' },
    ],
    // convenience top-level amount for backward compatibility (first tier)
    amount: '₦10,000',
  },
  {
    _id: 'bill_1',
    billName: 'Monthly Security Fee',
    billType: 'Security',
    paymentStatus: 'Paid',
    residentStatus: 'Paid',
    frequency: 'Monthly',
    startDate: '18 Aug, 2025',
    dueDate: '25 Aug, 2025',
    rentDuration: '1 Month',
    paymentType: 'Offline',
    paymentDate: '2 Aug, 2025',
    amountPaid: '₦25,000',
    status: 'Inactive',
    isMultiple: true,
    priceTiers: [
      { residenceType: 'Shop/Store', amount: '₦5,000' },
      { residenceType: 'Flat/Apartment', amount: '₦7,500' },
    ],
    amount: '₦5,000',
  },
  {
    _id: 'bill_2',
    billName: 'General Service Charge',
    billType: 'Service',
    paymentStatus: 'Over Due',
    residentStatus: 'Overdue',
    frequency: 'Monthly',
    startDate: '18 Aug, 2025',
    dueDate: '24 Aug, 2025',
    rentDuration: 'N/A',
    paymentType: 'In-app',
    paymentDate: 'N/A',
    amountPaid: '₦0.00',
    status: 'Inactive',
    isMultiple: false,
    priceTiers: [
      { residenceType: 'Flat/Apartment', amount: '₦6,000' },
    ],
    amount: '₦6,000',
  },
  {
    _id: 'bill_3',
    billName: 'Weekly Cleaning',
    billType: 'Cleaning',
    paymentStatus: 'Paid',
    residentStatus: 'Partially Paid',
    frequency: 'Weekly',
    startDate: '21 Aug, 2025',
    dueDate: '28 Aug, 2025',
    rentDuration: 'N/A',
    paymentType: 'Offline',
    paymentDate: '21 Aug, 2025',
    amountPaid: '₦2,500',
    status: 'Active',
    isMultiple: true,
    priceTiers: [
      { residenceType: 'Detached House/Bungalow', amount: '₦2,500' },
      { residenceType: '3-Bedroom Apartment', amount: '₦3,500' },
    ],
    amount: '₦2,500',
  },
  {
    _id: 'bill_4',
    billName: 'Biweekly Estate Dues',
    billType: 'Dues',
    paymentStatus: 'Pending',
    residentStatus: 'Pending',
    frequency: 'Biweekly',
    startDate: '21 Aug, 2025',
    dueDate: '04 Sep, 2025',
    rentDuration: 'N/A',
    paymentType: 'In-app',
    paymentDate: 'N/A',
    amountPaid: '₦0.00',
    status: 'Active',
    isMultiple: true,
    priceTiers: [
      { residenceType: 'Shop/Store', amount: '₦10,000' },
      { residenceType: 'Kiosk', amount: '₦6,000' },
    ],
    amount: '₦10,000',
  },
  {
    _id: 'bill_5',
    billName: 'Monthly Security Fee',
    billType: 'Security',
    paymentStatus: 'Paid',
    residentStatus: 'Paid',
    frequency: 'Monthly',
    startDate: '21 Aug, 2025',
    dueDate: '25 Aug, 2025',
    rentDuration: '1 Month',
    paymentType: 'Offline',
    paymentDate: '21 Aug, 2025',
    amountPaid: '₦5,000',
    status: 'Active',
    isMultiple: false,
    priceTiers: [
      { residenceType: 'Flat/Apartment', amount: '₦5,000' },
    ],
    amount: '₦5,000',
  },
  {
    _id: 'bill_6',
    billName: 'Monthly Service Charge',
    billType: 'Service',
    paymentStatus: 'Pending',
    residentStatus: 'Pending',
    frequency: 'Monthly',
    startDate: '21 Aug, 2025',
    dueDate: '25 Aug, 2025',
    rentDuration: '1 Month',
    paymentType: 'In-app',
    paymentDate: 'N/A',
    amountPaid: '₦0.00',
    status: 'Active',
    isMultiple: false,
    priceTiers: [
      { residenceType: 'Detached House/Bungalow', amount: '₦6,500' },
    ],
    amount: '₦6,500',
  },
  {
    _id: 'bill_7',
    billName: 'Monthly Security Fee',
    billType: 'Security',
    paymentStatus: 'Pending',
    residentStatus: 'Partially Paid',
    frequency: 'Monthly',
    startDate: '21 Aug, 2025',
    dueDate: '25 Aug, 2025',
    rentDuration: '1 Month',
    paymentType: 'Offline',
    paymentDate: 'N/A',
    amountPaid: '₦0.00',
    status: 'Active',
    isMultiple: true,
    priceTiers: [
      { residenceType: 'Shop/Store', amount: '₦5,000' },
      { residenceType: 'Kiosk', amount: '₦3,000' },
      { residenceType: 'Flat/Apartment', amount: '₦5,500' },
    ],
    amount: '₦5,000',
  },
  {
    _id: 'bill_8',
    billName: 'Biweekly Estate Dues',
    billType: 'Dues',
    paymentStatus: 'Pending',
    residentStatus: 'Pending',
    frequency: 'Biweekly',
    startDate: '21 Aug, 2025',
    dueDate: '04 Sep, 2025',
    rentDuration: 'N/A',
    paymentType: 'In-app',
    paymentDate: 'N/A',
    amountPaid: '₦0.00',
    status: 'Active',
    isMultiple: false,
    priceTiers: [
      { residenceType: 'Flat/Apartment', amount: '₦10,000' },
    ],
    amount: '₦10,000',
  },
  {
    _id: 'bill_9',
    billName: 'Weekly Cleaning',
    billType: 'Cleaning',
    paymentStatus: 'Pending',
    residentStatus: 'Partially Paid',
    frequency: 'Weekly',
    startDate: '21 Aug, 2025',
    dueDate: '28 Aug, 2025',
    rentDuration: 'N/A',
    paymentType: 'In-app',
    paymentDate: 'N/A',
    amountPaid: '₦0.00',
    status: 'Active',
    isMultiple: false,
    priceTiers: [
      { residenceType: 'Detached House/Bungalow', amount: '₦2,500' },
    ],
    amount: '₦2,500',
  },
  // Repeat similar objects to reach 30 entries
  ...Array.from({ length: 20 }, (_, i) => {
    const id = `bill_${10 + i}`;
    const billNames = [
      'Annual Estate Dues',
      'Monthly Security Fee',
      'General Service Charge',
      'Weekly Cleaning',
      'Biweekly Estate Dues',
      'Monthly Service Charge',
    ];
    const residenceTypes = ['Detached House/Bungalow', 'Shop/Store', 'Flat/Apartment', '3-Bedroom Apartment', 'Duplex', 'Bungalow'];
    const baseAmountOptions = [10000, 5000, 6000, 2500, 10000, 6500];

    // choose how many tiers (1..3)
    const tiersCount = (i % 3) + 1;
    const priceTiers = Array.from({ length: tiersCount }, (_, j) => {
      const res = residenceTypes[(i + j) % residenceTypes.length];
      const base = baseAmountOptions[(i + j) % baseAmountOptions.length];
      const amount = `₦${base + (i * 100) + j * 250}`;
      return { residenceType: res, amount };
    });

    const computedAmountPaid = i % 3 === 0 ? `₦${(baseAmountOptions[(i) % baseAmountOptions.length] * 2)}` : '₦0.00'
    const computedStatus = i % 4 === 0 ? 'Inactive' : 'Active'
    // residentStatus logic
    let residentStatus = 'Pending';
    if (computedAmountPaid !== '₦0.00') {
      residentStatus = 'Paid';
    } else if (computedStatus === 'Inactive') {
      residentStatus = 'Overdue';
    } else if (i % 5 === 0) {
      residentStatus = 'Partially Paid';
    }
    return {
      _id: id,
      billName: billNames[i % billNames.length],
      billType: billNames[i % billNames.length],
      frequency: ['Monthly', 'Quarterly', 'Weekly', 'Biweekly'][i % 4],
      startDate: `${21 + (i % 10)} Aug, 2025`,
      dueDate: `${23 + (i % 8)} Aug, 2025`,
      rentDuration: i % 2 === 0 ? '12 Months' : '1 Month',
      paymentType: i % 2 === 0 ? 'In-app' : 'Offline',
      paymentDate: i % 3 === 0 ? `${2 + (i % 12)} Aug, 2025` : 'N/A',
      amountPaid: computedAmountPaid,
      status: computedStatus,
      paymentStatus: computedAmountPaid !== '₦0.00' ? 'Paid' : (computedStatus === 'Inactive' ? 'Over Due' : 'Pending'),
      residentStatus,
      isMultiple: priceTiers.length > 1,
      priceTiers,
      amount: priceTiers[0].amount,
    };
  }),
];

export const RESIDENCY_TYPES = [
    'All Residency Type',
    'Detached House / Bungalow',
    'Semi-Detached House',
    'Duplex/Two-Storey House',
    'Flat / Apartment',
    'Studio Apartment',
    'Terraced / Row House',
    'Serviced Apartment',
    'Penthouse',
    'Hostel / Lodging Unit',
    'Shop / Store',
    'Shopping Mall',
    'Office Space',
    'Kiosk / Mini-Store',
]