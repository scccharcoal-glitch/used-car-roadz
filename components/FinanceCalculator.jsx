"use client";

import { useEffect, useMemo, useState } from "react";

function formatBaht(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return "0";
  }
  return new Intl.NumberFormat("th-TH").format(Math.round(number));
}

function calculateLocal(price, downPercent, annualRate, months) {
  const downPayment = Math.round(price * (downPercent / 100));
  const financedAmount = Math.max(0, price - downPayment);
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPayment =
    monthlyRate > 0
      ? Math.ceil((financedAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months)))
      : Math.ceil(financedAmount / months);

  return {
    downPayment,
    financedAmount,
    monthlyPayment,
    totalPayment: monthlyPayment * months,
    totalInterest: Math.max(0, monthlyPayment * months - financedAmount)
  };
}

export default function FinanceCalculator({ price, lineUrl }) {
  const [downPercent, setDownPercent] = useState(20);
  const [months, setMonths] = useState(84);
  const [annualRate, setAnnualRate] = useState(4.5);
  const fallback = useMemo(
    () => calculateLocal(price, downPercent, annualRate, months),
    [price, downPercent, annualRate, months]
  );
  const [result, setResult] = useState(fallback);

  useEffect(() => {
    let ignore = false;

    async function calculate() {
      try {
        const response = await fetch("/api/finance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ price, downPercent, annualRate, months })
        });
        const data = await response.json();
        if (!ignore) {
          setResult(data);
        }
      } catch {
        if (!ignore) {
          setResult(fallback);
        }
      }
    }

    calculate();

    return () => {
      ignore = true;
    };
  }, [annualRate, downPercent, fallback, months, price]);

  return (
    <section className="side-card calculator">
      <h2>คำนวณค่างวด</h2>
      <div className="calc-summary">
        <span>ราคารถ</span>
        <strong>{formatBaht(price)} บาท</strong>
      </div>

      <label className="calc-control">
        <span>เงินดาวน์</span>
        <div className="calc-input-row">
          <input
            type="number"
            min="0"
            max="90"
            value={downPercent}
            onChange={(event) => setDownPercent(Number(event.target.value))}
          />
          <span>%</span>
        </div>
      </label>

      <label className="calc-control">
        <span>จำนวนงวด</span>
        <select value={months} onChange={(event) => setMonths(Number(event.target.value))}>
          <option value="48">48 งวด</option>
          <option value="60">60 งวด</option>
          <option value="72">72 งวด</option>
          <option value="84">84 งวด</option>
          <option value="96">96 งวด</option>
        </select>
      </label>

      <label className="calc-control">
        <span>ดอกเบี้ยต่อปี</span>
        <div className="calc-input-row">
          <input
            type="number"
            min="0"
            max="30"
            step="0.1"
            value={annualRate}
            onChange={(event) => setAnnualRate(Number(event.target.value))}
          />
          <span>%</span>
        </div>
      </label>

      <div className="calc-summary">
        <span>เงินดาวน์ {downPercent}%</span>
        <strong>{formatBaht(result.downPayment)} บาท</strong>
      </div>
      <div className="calc-summary">
        <span>ยอดจัด</span>
        <strong>{formatBaht(result.financedAmount)} บาท</strong>
      </div>
      <div className="calc-summary">
        <span>ผ่อนต่อเดือน</span>
        <strong className="red-text">{formatBaht(result.monthlyPayment)} บาท</strong>
      </div>
      <div className="calc-note">
        ผลคำนวณเบื้องต้น อาจเปลี่ยนตามเงื่อนไขไฟแนนซ์และเครดิตลูกค้า
      </div>
      <a className="red-button full" href={lineUrl}>ขอแผนผ่อนทาง LINE</a>
    </section>
  );
}
