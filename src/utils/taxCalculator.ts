import { EmployeeIncomeData, TaxCalculationResult, TaxRegion } from '../types';

export function calculateRegionalTax(income: EmployeeIncomeData): TaxCalculationResult {
  const grossIncome = 
    (income.baseSalary || 0) + 
    (income.housingAllowance || 0) + 
    (income.transportAllowance || 0) + 
    (income.commissionBonus || 0) + 
    (income.overtimePay || 0);

  let incomeTax = 0;
  let socialSecurityTax = 0;
  let healthInsurance = 0;
  let taxableIncome = grossIncome;
  const breakdown: { bracket: string; rate: number; amount: number }[] = [];

  switch (income.region) {
    case 'UAE': {
      // UAE has 0% Personal Income Tax; 5% Pension/Social Insurance for GCC Nationals
      taxableIncome = grossIncome;
      incomeTax = 0;
      breakdown.push({
        bracket: 'UAE Personal Income Tax (0%)',
        rate: 0,
        amount: 0
      });

      // Statutory Pension / Social Security contribution
      socialSecurityTax = Math.round(grossIncome * (income.socialSecurityRate || 0.05));
      breakdown.push({
        bracket: 'UAE/GCC Statutory Pension Fund',
        rate: income.socialSecurityRate || 0.05,
        amount: socialSecurityTax
      });
      break;
    }

    case 'USA': {
      // Annualized calculation then divided by 12
      const annualGross = grossIncome * 12;
      const standardDeduction = 14600; // Single standard deduction
      const annualTaxable = Math.max(0, annualGross - standardDeduction);
      taxableIncome = annualTaxable / 12;

      // Federal brackets
      let remaining = annualTaxable;
      let annualTax = 0;

      // 10% on up to 11,600
      const b1 = Math.min(remaining, 11600);
      if (b1 > 0) {
        annualTax += b1 * 0.10;
        remaining -= b1;
      }
      // 12% on 11,601 to 47,150 (35,550 band)
      const b2 = Math.min(remaining, 35550);
      if (b2 > 0) {
        annualTax += b2 * 0.12;
        remaining -= b2;
      }
      // 22% on 47,151 to 100,525 (53,375 band)
      const b3 = Math.min(remaining, 53375);
      if (b3 > 0) {
        annualTax += b3 * 0.22;
        remaining -= b3;
      }
      // 24% on remaining up to next band
      if (remaining > 0) {
        annualTax += remaining * 0.24;
      }

      incomeTax = Math.round(annualTax / 12);
      // FICA: 6.2% Social Security + 1.45% Medicare = 7.65%
      socialSecurityTax = Math.round(grossIncome * 0.062);
      healthInsurance = Math.round(grossIncome * 0.0145);

      breakdown.push({
        bracket: 'Federal W-4 Progressive Tax',
        rate: grossIncome > 0 ? (incomeTax / grossIncome) : 0,
        amount: incomeTax
      });
      breakdown.push({
        bracket: 'Social Security (FICA 6.2%)',
        rate: 0.062,
        amount: socialSecurityTax
      });
      breakdown.push({
        bracket: 'Medicare (1.45%)',
        rate: 0.0145,
        amount: healthInsurance
      });
      break;
    }

    case 'UK': {
      // UK PAYE monthly bands
      const monthlyAllowance = 1047.50; // £12,570 / 12
      const annualTaxable = Math.max(0, grossIncome - monthlyAllowance);
      taxableIncome = annualTaxable;

      // Basic Rate 20% on next £3,141/mo (£37,700/yr)
      let rem = taxableIncome;
      const basicBand = Math.min(rem, 3141);
      incomeTax += basicBand * 0.20;
      rem -= basicBand;

      // Higher Rate 40% on remainder
      if (rem > 0) {
        incomeTax += rem * 0.40;
      }
      incomeTax = Math.round(incomeTax);

      // National Insurance (NI ~8% over threshold)
      socialSecurityTax = Math.round(Math.max(0, grossIncome - 1048) * 0.08);

      breakdown.push({
        bracket: 'HMRC PAYE (Basic & Higher)',
        rate: grossIncome > 0 ? (incomeTax / grossIncome) : 0,
        amount: incomeTax
      });
      breakdown.push({
        bracket: 'UK National Insurance (Class 1)',
        rate: 0.08,
        amount: socialSecurityTax
      });
      break;
    }

    case 'Nepal': {
      // Annual calculation: First 500,000 NPR @ 1% (Social Security Tax)
      // Next 200,000 @ 10%, Next 300,000 @ 20%, Next 1,000,000 @ 30%, Above 2,000,000 @ 36%
      const annualGross = grossIncome * 12;
      let rem = annualGross;
      let annTax = 0;
      let annSST = 0;

      // Slab 1: Up to 500k @ 1% SST
      const s1 = Math.min(rem, 500000);
      annSST += s1 * 0.01;
      rem -= s1;

      // Slab 2: Next 200,000 (500k - 700k) @ 10%
      const s2 = Math.min(rem, 200000);
      if (s2 > 0) {
        annTax += s2 * 0.10;
        rem -= s2;
      }

      // Slab 3: Next 300,000 (700k - 1,000,000) @ 20%
      const s3 = Math.min(rem, 300000);
      if (s3 > 0) {
        annTax += s3 * 0.20;
        rem -= s3;
      }

      // Slab 4: Above 1,000,000 @ 30%
      if (rem > 0) {
        annTax += rem * 0.30;
      }

      incomeTax = Math.round(annTax / 12);
      socialSecurityTax = Math.round(annSST / 12);

      breakdown.push({
        bracket: 'Nepal IRD Income Tax Slabs (10% - 30%)',
        rate: grossIncome > 0 ? (incomeTax / grossIncome) : 0,
        amount: incomeTax
      });
      breakdown.push({
        bracket: 'Social Security Fund (1% SST)',
        rate: 0.01,
        amount: socialSecurityTax
      });
      break;
    }

    case 'Germany': {
      // German progressive tax system + statutory social insurances
      taxableIncome = Math.max(0, grossIncome - 990); // Grundfreibetrag
      incomeTax = Math.round(taxableIncome * 0.24); // Progressive average
      socialSecurityTax = Math.round(grossIncome * 0.093); // Rentenversicherung 9.3%
      healthInsurance = Math.round(grossIncome * 0.073); // Krankenversicherung 7.3%

      breakdown.push({
        bracket: 'German Lohnsteuer (Wage Tax)',
        rate: 0.24,
        amount: incomeTax
      });
      breakdown.push({
        bracket: 'Rentenversicherung (Pension 9.3%)',
        rate: 0.093,
        amount: socialSecurityTax
      });
      breakdown.push({
        bracket: 'Krankenversicherung (Health 7.3%)',
        rate: 0.073,
        amount: healthInsurance
      });
      break;
    }
  }

  const totalDeductions = incomeTax + socialSecurityTax + healthInsurance;
  const netPay = grossIncome - totalDeductions;
  const effectiveTaxRate = grossIncome > 0 ? (totalDeductions / grossIncome) : 0;

  return {
    grossIncome,
    taxableIncome,
    incomeTax,
    socialSecurityTax,
    healthInsurance,
    totalDeductions,
    netPay,
    effectiveTaxRate,
    bracketBreakdown: breakdown
  };
}
