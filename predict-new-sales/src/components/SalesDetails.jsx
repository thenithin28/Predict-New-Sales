import { X } from "lucide-react";

export default function SalesDetails({ record, onClose }) {
  if (!record) return null;

  const fields = [
    ["Sales ID", record.sales_id],
    ["Date", record.date.toISOString().slice(0, 10)],
    ["Category", record.product_category],
    ["Quantity", record.quantity],
    ["Price", `$${record.price.toFixed(2)}`],
    ["Previous Sales", `$${record.previous_sales.toFixed(2)}`],
    ["Promotion", record.promotion],
    ["Discount", `${(record.discount * 100).toFixed(0)}%`],
    ["Customers", record.customers],
    ["Season", record.season],
    ["Sales", `$${record.sales.toFixed(2)}`],
  ];

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-md w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Sale Details</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          {fields.map(([label, value]) => (
            <div key={label}>
              <p className="text-[11px] text-slate-400">{label}</p>
              <p className="text-sm font-medium text-slate-700">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
