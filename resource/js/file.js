"use strict";

let fileMap = new Map()

let readFiles = (files) => {
    files.forEach((item, index) => {
        readFile(item, index)
    })
}

let readFile = (file, index) => {
    fileMap.set(index, file)
    let fileReader = new FileReader;
    fileReader.onload = () => {
        let img = new Image
        img.onload = () => {
            imgMap.set(index, img)
            drawImg(index)
            drawText(index)
        }
        return img.src = fileReader.result
    }
    fileReader.readAsDataURL(file)
}

let downloadImg = (index) => {
    if (!fileMap.has(index)) {
        return false
    }
    if (!canvasMap.has(index)) {
        return false
    }

    let linkarea = document.getElementById("downloadLinks")

    let file = fileMap.get(index)
    let link = document.createElement('a')
    link.download = generateFileName(file.name)
    link.style.display = 'none'
    let imageData = getImgData(index)
    link.href = imageData
    linkarea.append(link)
    setTimeout(_ => {
        link.click()
        linkarea.remove(link)
    }, 100)
}

let batchDownloadImg = () => {
    fileMap.forEach((value, key) => {
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
    return fileName+"_watermark_"+year+month+day+hour+minute+second+".png"
}

let clearFileMap = () =>{
    fileMap.clear()
}