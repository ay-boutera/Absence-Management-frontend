// Simple placeholder DataTable component
export default function DataTable({ columns = [], data = [] }) {
  // Normalize columns to objects: { Header, accessor }
  const normalizedColumns = columns.map((col) =>
    typeof col === "string" ? { Header: col, accessor: col } : col,
  );

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {normalizedColumns.map((col) => (
            <th
              key={col.accessor || col.Header}
              style={{ border: "1px solid #ccc", padding: 4 }}
            >
              {col.Header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={normalizedColumns.length}
              style={{ textAlign: "center", padding: 8 }}
            >
              No data
            </td>
          </tr>
        ) : (
          data.map((row, i) => (
            <tr key={row.id || i}>
              {normalizedColumns.map((col) => (
                <td
                  key={col.accessor || col.Header}
                  style={{ border: "1px solid #eee", padding: 4 }}
                >
                  {row[col.accessor]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
