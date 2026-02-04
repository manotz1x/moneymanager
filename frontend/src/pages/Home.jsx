import { useState, useEffect, useMemo } from "react";
import api from "../services/api";
import AddTransactionModal from "../components/AddTransactionModal";
import EditTransactionModal from "../components/EditTransactionModal";
import TransactionFilters from "../components/TransactionFilters";
import TransactionCard from "../components/TransactionCard";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editTx, setEditTx] = useState(null);

  // FILTER STATES
  const [division, setDivision] = useState("All");
  const [dateFilter, setDateFilter] = useState("year");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ---------------- FETCH ----------------
  const fetchTransactions = async () => {
    const res = await api.get("/transactions");
    setTransactions(res.data || []);
  };

  const fetchAccounts = async () => {
    const res = await api.get("/accounts");
    setAccounts(res.data || []);
  };

  useEffect(() => {
    fetchTransactions();
    fetchAccounts();
  }, []);

  // ---------------- DATE NORMALIZER ----------------
  const normalizeDate = (date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // ---------------- FILTER LOGIC ----------------
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (division !== "All") {
      result = result.filter((tx) => tx.division === division);
    }

    const today = normalizeDate(new Date());

    return result.filter((tx) => {
      const txDate = normalizeDate(new Date(tx.date));

      if (fromDate && toDate) {
        const from = normalizeDate(new Date(fromDate));
        const to = normalizeDate(new Date(toDate));
        return txDate >= from && txDate <= to;
      }

      if (dateFilter === "today") return txDate.getTime() === today.getTime();
      if (dateFilter === "week") {
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        return txDate >= weekAgo && txDate <= today;
      }
      if (dateFilter === "month")
        return (
          txDate.getMonth() === today.getMonth() &&
          txDate.getFullYear() === today.getFullYear()
        );
      if (dateFilter === "year")
        return txDate.getFullYear() === today.getFullYear();

      return true;
    });
  }, [transactions, division, dateFilter, fromDate, toDate]);

  // ---------------- SUMMARY ----------------
  const income = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const expense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const balance = income - expense;

  // ---------------- UI ----------------
  return (
    <div className="p-6">
      <TransactionFilters
        division={division}
        setDivision={setDivision}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        onAdd={() => setShowAdd(true)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-white-500">Balance</p>
          <h2 className="text-2xl font-bold text-blue-600">₹{balance}</h2>
        </div>
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-white-500">Income</p>
          <h2 className="text-2xl font-bold text-green-600">₹{income}</h2>
        </div>
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-white-500">Expense</p>
          <h2 className="text-2xl font-bold text-red-600">₹{expense}</h2>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <p className="text-center text-gray-500 py-10">There is no data</p>
      ) : (
        filteredTransactions.map((tx) => (
          <TransactionCard key={tx._id} tx={tx} onEdit={() => setEditTx(tx)} />
        ))
      )}

      {showAdd && (
        <AddTransactionModal
          accounts={accounts}
          refresh={fetchTransactions}
          onClose={() => setShowAdd(false)}
        />
      )}

      {editTx && (
        <EditTransactionModal
          transaction={editTx}
          refresh={fetchTransactions}
          onClose={() => setEditTx(null)}
        />
      )}
    </div>
  );
}
