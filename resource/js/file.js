"use strict";

let readFiles = (files) => {
    files.forEach((item, index) => {
        readFile(item, index)
    })
}

let readFile = (file, index) => {
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