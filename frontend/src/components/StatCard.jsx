export default function StatCard({ title, value, color }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
      <p className="text-sm text-gray-400">{title}</p>
      <h2 className={`text-2xl font-bold mt-2 ${color}`}>
        ₹{value}
      </h2>
    </div>
  );
}
