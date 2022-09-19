"use strict";

let dataMap = new Map()
/**
 * file
 * canvas
 * img
 */

//清空数据
let clearData = () => {
    dataMap.clear()
}

let setFile = (index, file) => {
    if (dataMap.has(index)) {
        let data = dataMap.get(index)
        if (!data.file) {
            data.file = file
            dataMap.set(index, data)
        }
    } else {
        dataMap.set(index, {file: file})
    }
}

let getFile = (index) => {
    if (dataMap.has(index) && dataMap.get(index).file) return dataMap.get(index).file
    else return null
}

let setImg = (index, img) => {
    if (dataMap.has(index)) {
        let data = dataMap.get(index)
        if (!data.img) {
            data.img = img
            dataMap.set(index, data)
        }
    } else {
        dataMap.set(index, {img: img})
    }
}

let getImg = (index) => {
    if (dataMap.has(index) && dataMap.get(index).img) return dataMap.get(index).img
    else return null
}

let setCanvas = (index, canvas) => {
    if (dataMap.has(index)) {
        let data = dataMap.get(index)
        if (!data.canvas) {
            data.canvas = canvas
            dataMap.set(index, data)
        }
    } else {
        dataMap.set(index, {canvas: canvas})
    }
}

let getCanvas = (index) => {
    if (dataMap.has(index) && dataMap.get(index).canvas) return dataMap.get(index).canvas
    else return null
}