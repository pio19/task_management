export function exportToCSV(filename = 'users.csv', rows = []) {
  if (!rows || rows.length === 0) {
    alert('Không có dữ liệu để xuất')
    return
  }
  const keys = Object.keys(rows[0])
  const header = keys.join(',')
  const csv = [
    header,
    ...rows.map(r => keys.map(k => {
      let v = r[k] === null || r[k] === undefined ? '' : String(r[k])
      if (v.includes('"') || v.includes(',') || v.includes('\n')) {
        v = `"${v.replace(/"/g, '""')}"`
      }
      return v
    }).join(','))
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}