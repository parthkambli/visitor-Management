function Dashboard() {
  const cards = [
    {
      title: "Total Visitors",
      value: 124,
    },
    {
      title: "Checked In",
      value: 18,
    },
    {
      title: "Checked Out",
      value: 96,
    },
    {
      title: "Pending",
      value: 10,
    },
  ];

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-6">

        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <h2 className="text-gray-500 text-sm">
              {card.title}
            </h2>

            <p className="text-3xl font-bold mt-3">
              {card.value}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
}

export default Dashboard;