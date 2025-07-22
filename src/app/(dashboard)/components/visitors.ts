export interface Visitor {
  residentName: string;
  visitor: string;
  phoneNumber: string;
  purpose: string;
  numberOfVisitors: number;
  dateOfVisit: string;
  expectedArrivalTime: string;
  accessCode: string;
  accessStatus: "Pending" | "Signed In" | "Signed Out";
  timeIn: string;
  timeOut: string;
}

export const Visitors: Visitor[] = [
  {
    residentName: "Resident 1",
    visitor: "Victor Kunle",
    phoneNumber: "0000000000",
    purpose: "Social Visit",
    numberOfVisitors: 4,
    dateOfVisit: "4th January, 2024",
    expectedArrivalTime: "10:30AM - 12:30PM",
    accessCode: "Victorkunle-3094",
    accessStatus: "Pending",
    timeIn: "-",
    timeOut: "-"
  },
  {
    residentName: "Resident 2",
    visitor: "Chibue Ajae",
    phoneNumber: "0000000000",
    purpose: "Social Visit",
    numberOfVisitors: 4,
    dateOfVisit: "4th January, 2024",
    expectedArrivalTime: "09:30AM - 12:30PM",
    accessCode: "ChibueAjae-0024",
    accessStatus: "Pending",
    timeIn: "-",
    timeOut: "-"
  },
  {
    residentName: "Resident 3",
    visitor: "Yusufolu Olumade",
    phoneNumber: "0000000000",
    purpose: "Social Visit",
    numberOfVisitors: 4,
    dateOfVisit: "4th January, 2024",
    expectedArrivalTime: "08:30AM - 11:30AM",
    accessCode: "YusufoluOlumade-0932",
    accessStatus: "Pending",
    timeIn: "-",
    timeOut: "-"
  },
  {
    residentName: "Resident 4",
    visitor: "Amarach Anosike",
    phoneNumber: "0000000000",
    purpose: "Social Visit",
    numberOfVisitors: 4,
    dateOfVisit: "4th January, 2024",
    expectedArrivalTime: "2:00PM - 03:00PM",
    accessCode: "AmarachAnosike-1527",
    accessStatus: "Signed Out",
    timeIn: "2:05PM",
    timeOut: "3:05PM"
  },
  {
    residentName: "Resident 5",
    visitor: "Ignatius Aniebone",
    phoneNumber: "0000000000",
    purpose: "Social Visit",
    numberOfVisitors: 4,
    dateOfVisit: "4th January, 2024",
    expectedArrivalTime: "2:00PM - 03:00PM",
    accessCode: "Ignatius-5625",
    accessStatus: "Signed Out",
    timeIn: "2:05PM",
    timeOut: "3:05PM"
  },
  {
    residentName: "Resident 6",
    visitor: "Ayibanimi Tonbara",
    phoneNumber: "0000000000",
    purpose: "Social Visit",
    numberOfVisitors: 4,
    dateOfVisit: "4th January, 2024",
    expectedArrivalTime: "2:00PM - 03:00PM",
    accessCode: "Ayibanimi-2624",
    accessStatus: "Signed Out",
    timeIn: "2:05PM",
    timeOut: "3:05PM"
  },
  {
    residentName: "Resident 7",
    visitor: "Ngozi Anigbogu",
    phoneNumber: "0000000000",
    purpose: "Social Visit",
    numberOfVisitors: 4,
    dateOfVisit: "4th January, 2024",
    expectedArrivalTime: "2:00PM - 03:00PM",
    accessCode: "Ngozi-7687",
    accessStatus: "Signed Out",
    timeIn: "2:05PM",
    timeOut: "3:05PM"
  },
  {
    residentName: "Resident 8",
    visitor: "Iniobasi Hossam",
    phoneNumber: "0000000000",
    purpose: "Social Visit",
    numberOfVisitors: 4,
    dateOfVisit: "4th January, 2024",
    expectedArrivalTime: "2:00PM - 03:00PM",
    accessCode: "IniobasiHossam-5625",
    accessStatus: "Signed In",
    timeIn: "2:05PM",
    timeOut: "-"
  },
  // Dummy entries
  ...Array.from({ length: 32 }, (_, i): Visitor => {
    const status = i % 3 === 0 ? "Signed In" : i % 3 === 1 ? "Signed Out" : "Pending";
    return {
      residentName: `Resident ${i + 9}`,
      visitor: `Visitor ${i + 9}`,
      phoneNumber: "0000000000",
      purpose: "Social Visit",
      numberOfVisitors: 4,
      dateOfVisit: "4th January, 2024",
      expectedArrivalTime: "2:00PM - 03:00PM",
      accessCode: `Visitor${i + 9}-000${i + 1}`,
      accessStatus: status as "Signed In" | "Signed Out" | "Pending",
      timeIn: status === "Pending" ? "-" : "2:05PM",
      timeOut: status === "Signed Out" ? "3:05PM" : "-"
    };
  })
];
