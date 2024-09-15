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
