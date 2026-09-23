export const EXCHANGE_RETURN_POLICY_TITLE = "Exchange & Return Policy";

export const EXCHANGE_RETURN_POLICY_INTRO =
  "At RR Vastras, every saree is carefully inspected before dispatch. However, if you experience an issue with your order, please read the following policy carefully.";

export const EXCHANGE_RETURN_POLICY_SECTIONS = [
  {
    heading: "Exchange Policy",
    bullets: [
      "Exchange requests must be raised within 48 hours of delivery.",
      "The saree must be unused, unworn, unwashed and returned in its original condition with the tags, blouse piece, packaging and invoice intact.",
      "Requests received after 48 hours will not be accepted.",
      "Exchange is subject to inspection and approval by our team.",
      "An exchange does not qualify for a cash refund.",
    ],
  },
  {
    heading: "Exchange Eligibility",
    intro: "Exchanges are applicable only in the following cases:",
    bullets: [
      "The saree received is damaged or defective.",
      "A different saree has been delivered instead of the saree ordered.",
    ],
    note: "Exchange will not be provided for reasons such as change of mind, personal preference, colour expectations or any other reason unrelated to damage, defect or an incorrect product.",
  },
  {
    heading: "Mandatory Unboxing Video",
    intro:
      "A clear and continuous opening video is compulsory for all damage, defect or incorrect-product claims. The video must:",
    bullets: [
      "Begin before the shipping package is opened.",
      "Clearly show the shipping label and sealed package.",
      "Show the complete opening process without any cuts, pauses or editing.",
      "Clearly capture the saree and the reported damage, defect or incorrect product.",
    ],
    note: "Claims without a valid opening video will not be eligible for a refund or replacement.",
  },
  {
    heading: "How to Raise a Request",
    intro:
      "Please contact our customer-support team within 48 hours of delivery and share:",
    bullets: [
      "Order number",
      "Customer’s name and registered contact number",
      "Reason for the request",
      "Clear photographs of the saree",
      "Complete opening video",
    ],
    note: "Our team will review the request and provide further instructions. Please do not send the saree back without confirmation from our team.",
  },
] as const;
