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
  codeType?: string;
}