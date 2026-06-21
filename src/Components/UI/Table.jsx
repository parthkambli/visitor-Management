function Table({
  columns = [],
  data = [],
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

      <table className="w-full border-collapse" aria-label="Data table">

        <thead className="bg-gray-100">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="text-left px-6 py-4 text-sm font-semibold text-gray-700"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>

          {data.length > 0 ? (
            data.map((row) => (
              <tr
                key={row.id}
                className="border-t"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 text-sm text-gray-600"
                  >
                    {column.render
                      ? column.render(row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-10 text-gray-400"
              >
                No data found
              </td>
            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
}

export default Table;