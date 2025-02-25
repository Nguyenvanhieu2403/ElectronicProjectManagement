export class declaration {
    id: number;
    receiverId: number;
    itemNumber: string;
    RealWeight: number;
    Weight: number;
    receiverName: string;
    receiverAddress: string;
}
export class hq01Model {
    stt: number;
    serviceId: number;
    type: number;
    hqStatus: number;
    itemId: number;
    rnTotal: number;
    rnWeight: number;
    isReturn: number;
    rnPrice: number;
    createDate: Date;
    status: number;
    modified: Date;
    modifiedBy: number;
}
export class hq2002Model {
    itemId: number;
    storeType: string;
    createDate: Date;
    hq2002Number: number;
    itemImExtype: string;
    type: number;
    freeTax: boolean;
    foreigners: boolean;
    tax: boolean;
    currenyId: number;
    visible: boolean;
    examinationMethod: string;
    isFreeTaxByPriority: boolean;
    freeTaxAmount: number;
    releaseDate: Date;
    totalImportTax: number;
    totalTTDBTax: number;
    totalVATTax: number;
    customsFee: number;
    isReturn: boolean;
    b13Return: boolean;
    currencyName: string;
    currencyValue: number;
    hq2015NkNum: string;
    hq2015NkDate: string;
    hqStatus: number;
    attachPaper: string;
    checkingResult: string;
    identitySender: string;
    senderName: string;
    senderAddress: string;
    senderOrgOfIssue: string;
    senderDateOfIssue: Date;
    modified: Date;
    modifiedBy: number;
    status: number;
}