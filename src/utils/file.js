"use strict";

//批量读文件
let readFiles = (files) => {
    files.forEach((item, index) => {
        readFile(item, index)
    })
}

//读取单文件
let readFile = (file, index) => {
    setFile(index, file)
    let fileReader = new FileReader;
    fileReader.onload = () => {
        let img = new Image
        img.onload = () => {
            setImg(index, img)
            setCanvas(index, document.getElementById("canvas_"+index))
            drawImg(index)
            drawText(index)
        }
        return img.src = fileReader.result
    }
    fileReader.readAsDataURL(file)
}

//下载单图
let downloadImg = (index) => {
    let file = getFile(index)
    if (!file) {
        return false
    }

    let linkarea = document.getElementById("downloadLinks")

    if (!file) return false
    let link = document.createElement('a')
    link.download = generateFileName(file.name)
    link.style.display = 'none'
    let imageData = getImgData(index)
    link.href = imageData
    linkarea.appendChild(link)
    setTimeout(_ => {
        link.click()
        linkarea.removeChild(link)
    }, 100)
}

//批量下载
let batchDownloadImg = () => {
    dataMap.forEach((value, key) => {
        downloadImg(key)
    })
}

//文件名
let generateFileName = (fileName) => {
    if (fileName.lastIndexOf(".")>0) {
        fileName = fileName.substring(0, fileName.lastIndexOf("."))
    }
    let now = new Date()
    let year = now.getFullYear()
    let month = ("0"+now.getMonth()).slice(-2)
    let day = ("0"+now.getDay()).slice(-2)
    let hour = ("0"+now.getHours()).slice(-2)
    let minute = ("0"+now.getMinutes()).slice(-2)
    let second = ("0"+now.getSeconds()).slice(-2)
    let milliseconds = ("00"+now.getMilliseconds()).slice(-3)
    return fileName+"_watermark_"+year+month+day+hour+minute+second+milliseconds+".png"
}