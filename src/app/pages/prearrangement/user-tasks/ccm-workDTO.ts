export interface Benefit {
  name: string;
  limit: string;
  remarks?: string;
}

export interface PolicyEntry {
  companyName: string;
  policyType: string;
  policyNumber: string;
  policyStatus?: string;
  effectiveDate?: string;
  expiryDate?: string;
  firstUseDate?: string;
  benefits?: Benefit[];
}

export interface UploadedDoc {
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
}

export interface UploadedFilesCategories {
  formFiles?: UploadedDoc[];
  labFiles?: UploadedDoc[];
  otherFiles?: UploadedDoc[];
}

export interface CustomerInfo {
  nationalId: string;
  policyNumber: string;
}

export interface VisitInfo {
  visitType?: string;
  reservationType?: string;
  ICD10?: string;
  ICD9?: string;
  AdmissionDate?: string;
  AccidentDate?: string;
}

export interface ReadonlyPopupData {
  eligiblePolicies?: Array<{
    companyName: string;
    policyType: string;
    policyNumber: string;
    effectiveDate?: string;
    expiryDate?: string;
  }>;
  benefits?: PolicyEntry[]; // table of benefit entries (as provided in the prompt)
  uploadedDocuments?: UploadedFilesCategories;
  customerInfo?: CustomerInfo;
  visitInfo?: VisitInfo;
  prearengment?: string;
  physicianLicenceNumber?: string;
  silbmAmount?: string; // SIBM amount (kept string to allow currency symbols)
}