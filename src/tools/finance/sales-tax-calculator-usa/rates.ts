// Statewide sales tax rates for the 50 states and the District of Columbia.
//
// Every rate comes from that state's own tax agency (the `source` link) and was checked
// on RATES_CHECKED. Each one also matches the Tax Foundation's independent table of
// state rates as of July 1, 2026. Do not change a rate without reading the official page.
//
// `rate` is the lowest rate charged everywhere in the state. For California, Utah and
// Virginia that includes a local portion the state charges statewide (see the note).
export const RATES_CHECKED = "2026-11-14";

export type LocalTax =
  | "may-apply" // the visitor can add a local rate if their city, county or district charges one
  | "none"; // the state's official page says there are no local sales taxes, so the box is locked

export interface StateRate {
  code: string;
  name: string;
  rate: number; // percent
  local: LocalTax;
  note?: string;
  source: string;
}

export const STATES: StateRate[] = [
  { code: "AL", name: "Alabama", rate: 4, local: "may-apply", source: "https://www.revenue.alabama.gov/sales-use/tax-rates/" },
  {
    code: "AK",
    name: "Alaska",
    rate: 0,
    local: "may-apply",
    note: "Alaska has no statewide sales tax, but some local governments charge their own.",
    source: "https://tax.alaska.gov/programs/programs/index.aspx?10002",
  },
  {
    code: "AZ",
    name: "Arizona",
    rate: 5.6,
    local: "may-apply",
    note: "Arizona's tax is a transaction privilege tax on the seller. 5.6% is the state rate.",
    source: "https://azdor.gov/sites/default/files/document/TPT_RATETABLE_10012026.pdf",
  },
  { code: "AR", name: "Arkansas", rate: 6.5, local: "may-apply", source: "https://www.dfa.arkansas.gov/office/taxes/excise-tax-administration/sales-use-tax/sales-use-tax-rates/state-sales-use-tax-rates/" },
  {
    code: "CA",
    name: "California",
    rate: 7.25,
    local: "may-apply",
    note: "7.25% is California's statewide base rate: 6% state plus 1.25% local charged everywhere. Many areas add district taxes on top.",
    source: "https://www.cdtfa.ca.gov/taxes-and-fees/sales-use-tax-rates.htm",
  },
  { code: "CO", name: "Colorado", rate: 2.9, local: "may-apply", source: "https://tax.colorado.gov/sales-tax-guide" },
  {
    code: "CT",
    name: "Connecticut",
    rate: 6.35,
    local: "none",
    note: "Connecticut has no local sales taxes.",
    source: "https://portal.ct.gov/drs/sales-tax/tax-information",
  },
  {
    code: "DE",
    name: "Delaware",
    rate: 0,
    local: "none",
    note: "Delaware has no state or local sales tax. It taxes sellers' gross receipts instead.",
    source: "https://revenue.delaware.gov/business-tax-forms/doing-business-in-delaware/",
  },
  {
    code: "DC",
    name: "District of Columbia",
    rate: 6,
    local: "may-apply",
    note: "DC's Office of Tax and Revenue says the 6% general rate stays in place through September 30, 2027.",
    source: "https://otr.cfo.dc.gov/release/notice-oct-1-2025-tax-changes",
  },
  { code: "FL", name: "Florida", rate: 6, local: "may-apply", note: "Most Florida counties add a discretionary sales surtax.", source: "https://floridarevenue.com/taxes/taxesfees/Pages/sales_tax.aspx" },
  { code: "GA", name: "Georgia", rate: 4, local: "may-apply", source: "https://dor.georgia.gov/taxes/business-taxes/sales-use-tax/tax-rates" },
  {
    code: "HI",
    name: "Hawaii",
    rate: 4,
    local: "may-apply",
    note: "Hawaii has a 4% general excise tax on businesses instead of a sales tax. Sellers may pass it on, and the maximum pass-on rate including the county surcharge is 4.712%.",
    source: "https://tax.hawaii.gov/geninfo/get/",
  },
  { code: "ID", name: "Idaho", rate: 6, local: "may-apply", source: "https://tax.idaho.gov/taxes/sales-use/online-guide/" },
  { code: "IL", name: "Illinois", rate: 6.25, local: "may-apply", source: "https://tax.illinois.gov/research/taxinformation/sales/rot/pio-101.html" },
  { code: "IN", name: "Indiana", rate: 7, local: "may-apply", source: "https://www.in.gov/dor/i-am-a/business-corp/sales-tax/" },
  { code: "IA", name: "Iowa", rate: 6, local: "may-apply", source: "https://revenue.iowa.gov/iowa-sales-and-use-tax-guide" },
  { code: "KS", name: "Kansas", rate: 6.5, local: "may-apply", source: "https://www.ksrevenue.gov/bustaxtypessales.html" },
  {
    code: "KY",
    name: "Kentucky",
    rate: 6,
    local: "none",
    note: "Kentucky has no local sales taxes.",
    source: "https://revenue.ky.gov/Business/Sales-Use-Tax/Pages/default.aspx",
  },
  { code: "LA", name: "Louisiana", rate: 5, local: "may-apply", source: "https://revenue.louisiana.gov/tax-education-and-faqs/faqs/sales-tax-reform/what-is-the-state-sales-tax-rate/" },
  { code: "ME", name: "Maine", rate: 5.5, local: "may-apply", source: "https://www.maine.gov/revenue/taxes/sales-use-service-provider-tax/rates-due-dates" },
  {
    code: "MD",
    name: "Maryland",
    rate: 6,
    local: "none",
    note: "Maryland has no local sales taxes.",
    source: "https://services.marylandcomptroller.gov/taxes/en/sales-and-use-tax?id=kb_article_view&sysparm_article=KB0010107",
  },
  { code: "MA", name: "Massachusetts", rate: 6.25, local: "may-apply", source: "https://www.mass.gov/guides/sales-and-use-tax" },
  {
    code: "MI",
    name: "Michigan",
    rate: 6,
    local: "none",
    note: "Michigan does not allow cities or other local governments to charge sales tax.",
    source: "https://www.michigan.gov/taxes/business-taxes/sales-use-tax",
  },
  { code: "MN", name: "Minnesota", rate: 6.875, local: "may-apply", source: "https://www.revenue.state.mn.us/guide/taxes-and-rates" },
  { code: "MS", name: "Mississippi", rate: 7, local: "may-apply", source: "https://www.dor.ms.gov/business/sales-tax-rates" },
  { code: "MO", name: "Missouri", rate: 4.225, local: "may-apply", source: "https://dor.mo.gov/taxation/business/tax-types/sales-use/" },
  {
    code: "MT",
    name: "Montana",
    rate: 0,
    local: "may-apply",
    note: "Montana does not have a general sales tax.",
    source: "https://revenue.mt.gov/taxes/general-sales-tax",
  },
  { code: "NE", name: "Nebraska", rate: 5.5, local: "may-apply", source: "https://revenue.nebraska.gov/about/frequently-asked-questions/nebraska-sales-and-use-tax-faqs" },
  { code: "NV", name: "Nevada", rate: 6.85, local: "may-apply", source: "https://tax.nv.gov/tax-types/sales-use-tax/" },
  {
    code: "NH",
    name: "New Hampshire",
    rate: 0,
    local: "may-apply",
    note: "New Hampshire has no general sales tax. A separate 8.5% tax applies to meals, room rentals and motor vehicle rentals.",
    source: "https://www.revenue.nh.gov/faq/does-new-hampshire-have-sales-tax",
  },
  {
    code: "NJ",
    name: "New Jersey",
    rate: 6.625,
    local: "may-apply",
    note: "Sales in Salem County and qualifying Urban Enterprise Zone sales are taxed at a reduced 3.3125%.",
    source: "https://www.nj.gov/treasury/taxation/salestax.shtml",
  },
  {
    code: "NM",
    name: "New Mexico",
    rate: 4.875,
    local: "may-apply",
    note: "New Mexico has a gross receipts tax. 4.875% is the state portion; counties and cities add their own rates.",
    source: "https://www.tax.newmexico.gov/businesses/gross-receipts-overview/",
  },
  { code: "NY", name: "New York", rate: 4, local: "may-apply", source: "https://www.tax.ny.gov/bus/st/rates.htm" },
  { code: "NC", name: "North Carolina", rate: 4.75, local: "may-apply", source: "https://www.ncdor.gov/taxes-forms/sales-and-use-tax/sales-and-use-tax-rates/current-sales-and-use-tax-rates" },
  { code: "ND", name: "North Dakota", rate: 5, local: "may-apply", source: "https://www.tax.nd.gov/sales-and-use-tax" },
  { code: "OH", name: "Ohio", rate: 5.75, local: "may-apply", source: "https://tax.ohio.gov/help-center/faqs/sales-and-use-general-information/" },
  { code: "OK", name: "Oklahoma", rate: 4.5, local: "may-apply", source: "https://oklahoma.gov/tax/businesses/sales-use-tax.html" },
  {
    code: "OR",
    name: "Oregon",
    rate: 0,
    local: "may-apply",
    note: "Oregon does not have a general sales tax.",
    source: "https://www.oregon.gov/dor/programs/businesses/pages/sales-tax.aspx",
  },
  { code: "PA", name: "Pennsylvania", rate: 6, local: "may-apply", note: "A 1% local tax applies in Allegheny County and 2% in Philadelphia.", source: "https://www.pa.gov/en/agencies/revenue/resources/tax-types-and-information/sales-use-and-hotel-occupancy-tax.html" },
  { code: "RI", name: "Rhode Island", rate: 7, local: "may-apply", source: "https://tax.ri.gov/tax-sections/sales-excise-taxes/sales-use-tax" },
  { code: "SC", name: "South Carolina", rate: 6, local: "may-apply", source: "https://dor.sc.gov/tax/sales" },
  { code: "SD", name: "South Dakota", rate: 4.2, local: "may-apply", source: "https://dor.sd.gov/businesses/taxes/sales-use-tax/" },
  { code: "TN", name: "Tennessee", rate: 7, local: "may-apply", note: "Local rates in Tennessee cannot exceed 2.75%.", source: "https://www.tn.gov/revenue/taxes/sales-and-use-tax/due-dates-and-tax-rates.html" },
  { code: "TX", name: "Texas", rate: 6.25, local: "may-apply", note: "Local taxes in Texas can add up to 2%, for a maximum combined rate of 8.25%.", source: "https://comptroller.texas.gov/taxes/sales/faq/local.php" },
  {
    code: "UT",
    name: "Utah",
    rate: 6.1,
    local: "may-apply",
    note: "6.10% is charged everywhere in Utah: 4.85% state, 1% local and 0.25% county. Some areas add more.",
    source: "https://le.utah.gov/interim/2024/pdf/00002306.pdf",
  },
  { code: "VT", name: "Vermont", rate: 6, local: "may-apply", note: "Some towns add a 1% local option tax.", source: "https://tax.vermont.gov/business/sales-and-use-tax" },
  {
    code: "VA",
    name: "Virginia",
    rate: 5.3,
    local: "may-apply",
    note: "5.3% is charged statewide: 4.3% state plus 1% local. Some regions add more, up to 7% in total.",
    source: "https://www.tax.virginia.gov/retail-sales-and-use-tax",
  },
  { code: "WA", name: "Washington", rate: 6.5, local: "may-apply", source: "https://dor.wa.gov/taxes-rates/retail-sales-tax" },
  { code: "WV", name: "West Virginia", rate: 6, local: "may-apply", note: "Municipalities may add up to 1%.", source: "https://tax.wv.gov/Documents/Reports/TaxExpenditureStudy/ConsumersSalesAndServiceTaxAndUseTaxExpenditures.January.2025.pdf" },
  { code: "WI", name: "Wisconsin", rate: 5, local: "may-apply", source: "https://www.revenue.wi.gov/Pages/FAQS/pcs-taxrates.aspx" },
  { code: "WY", name: "Wyoming", rate: 4, local: "may-apply", source: "https://excise-tax-div.wyo.gov/salesuselodging-tax/tax-rates" },
];

export function findState(code: string): StateRate | undefined {
  return STATES.find((s) => s.code === code);
}
