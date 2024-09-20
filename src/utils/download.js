import jsPDF from 'jspdf'
export const downloadImage = (filename, url) => {
  const linkarea = document.getElementById('downloadLinks')
  const link = document.createElement('a')
  link.download = filename
  link.style.display = 'none'
  link.href = url
  linkarea.appendChild(link)
  setTimeout(() => {
    link.click()
    linkarea.removeChild(link)
  }, 100)
}

export const downloadPDF = (width, height, url, fileName) => {
  let orientation = height < width ? 'l' : 'p'
  const doc = new jsPDF({
    unit: 'cm',
    format: [height, width],
    orientation: orientation,
    compress: true
  })

  doc.addImage(url, 'PNG', 0, 0, width, height)
  doc.save(`${fileName}.pdf`)
}
