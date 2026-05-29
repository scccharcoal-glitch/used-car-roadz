import { NextResponse } from "next/server";

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function calculateMonthlyPayment(principal, annualRatePercent, months) {
  if (principal <= 0 || months <= 0) {
    return 0;
  }

  const monthlyRate = annualRatePercent / 100 / 12;

  if (monthlyRate <= 0) {
    return principal / months;
  }

  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

export async function POST(request) {
  const body = await request.json();
  const price = Math.max(0, toNumber(body.price));
  const downPercent = Math.min(90, Math.max(0, toNumber(body.downPercent, 20)));
  const annualRate = Math.min(30, Math.max(0, toNumber(body.annualRate, 4.5)));
  const months = Math.min(96, Math.max(12, Math.round(toNumber(body.months, 84))));
  const downPayment = Math.round(price * (downPercent / 100));
  const financedAmount = Math.max(0, price - downPayment);
  const monthlyPayment = Math.ceil(calculateMonthlyPayment(financedAmount, annualRate, months));
  const totalPayment = monthlyPayment * months;
  const totalInterest = Math.max(0, totalPayment - financedAmount);

  return NextResponse.json({
    price,
    downPercent,
    annualRate,
    months,
    downPayment,
    financedAmount,
    monthlyPayment,
    totalPayment,
    totalInterest
  });
}
