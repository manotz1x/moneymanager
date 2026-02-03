import { useEffect, useState } from "react";
import api from "../services/api";
import NavBar from "../components/NavBar";
import AddTransactionModal from "../components/AddTransactionModal";
import EditTransactionModal from "../components/EditTransactionModal";
import IncomeExpenseChart from "../components/charts/IncomeExpenseChart";
import MonthlyExpenseChart from "../components/charts/MonthlyExpenseChart";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState(null);

  const fetchTransactions = async () => {
    const res = await api.get("/transactions");
    setTransactions(res.data || []);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // last 5 transactions only
  const lastFive = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <>
      {/* <NavBar onAdd={() => setShowModal(true)} /> */}

      <div className="p-6 bg-gray-100 min-h-screen">

        {/* CHARTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <IncomeExpenseChart transactions={transactions} />
          <MonthlyExpenseChart transactions={transactions} />
        </div>

        {/* LAST 5 TRANSACTIONS */}
        <div className="bg-white rounded-xl shadow">
          <h2 className="font-semibold p-4 border-b">
            Recent Transactions
          </h2>

          {lastFive.map((t) => (
            <div
              key={t._id}
              className="flex justify-between items-center p-4 border-b"
            >
              <div>
                <p className="font-semibold">
                  {t.category} ({t.division})
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(t.date).toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <p
                  className={`font-bold ${
                    t.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}₹{t.amount}
                </p>

                <button
                  onClick={() => setEditTx(t)}
                  className="text-blue-600 text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <AddTransactionModal
          
            onClose={() => setShowModal(false)}
            refresh={fetchTransactions}
          />
        )}

        {editTx && (
          <EditTransactionModal
            transaction={editTx}
            onClose={() => setEditTx(null)}
            refresh={fetchTransactions}
          />
        )}
      </div>
    </>
  );
}
