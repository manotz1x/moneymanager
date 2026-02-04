import { useState } from "react";
import api from "../services/api";

export default function AddTransactionModal({
  accounts = [],
  onClose,
  refresh,
}) {
  const [type, setType] = useState("income");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    division: "Personal",
    account: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await api.post("/transactions", {
      ...form,
      amount: Number(form.amount),
      type,
      date: new Date().toISOString(),
    });

    setLoading(false);
    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Add Transaction</h2>

        {/* TYPE TABS */}
        <div className="flex mb-4 border rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setType("income")}
            className={`flex-1 py-2 ${
              type === "income" ? "bg-green-600 text-white" : "bg-gray-100"
            }`}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`flex-1 py-2 ${
              type === "expense" ? "bg-red-600 text-white" : "bg-gray-100"
            }`}
          >
            Expense
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* <select
            name="account"
            required
            className="w-full border p-2 rounded"
            onChange={handleChange}
            value={form.account}
          >
            <option value="">Select Account</option>
            {accounts.map((acc) => (
              <option key={acc._id} value={acc._id}>
                {acc.name} (₹{acc.balance})
              </option>
            ))}
          </select> */}

          <input
            type="text"
            name="account"
            placeholder="Account"
            required
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            required
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            required
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />

          <select
            name="division"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            value={form.division}
          >
            <option value="Personal">Personal</option>
            <option value="Office">Office</option>
          </select>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded text-white ${
                type === "income" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
