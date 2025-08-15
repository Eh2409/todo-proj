export const utilService = {
    makeId,
    makeLorem,
    getRandomIntInclusive,
    loadFromStorage,
    saveToStorage,
    animateCSS,
    parseIsDone,
    formatTimeAgo
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function makeLorem(size = 100) {
    const words = ['The sky', 'above', 'the port', 'was', 'the color', 'of nature', 'tuned', 'to', 'a live channel', 'All', 'this happened', 'more or less', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)]
        if (size >= 1) txt += ' '
    }
    return txt
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}

function animateCSS(el, animation = 'bounce') {
    const prefix = 'animate__'
    return new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`
        el.classList.add(`${prefix}animated`, animationName)
        function handleAnimationEnd(event) {
            event.stopPropagation()
            el.classList.remove(`${prefix}animated`, animationName)
            resolve('Animation ended')
        }

        el.addEventListener('animationend', handleAnimationEnd, { once: true })
    })
}

function parseIsDone(val) {
    if (val === 'true') return true
    if (val === 'false') return false
    return undefined
}

function formatTimeAgo(timestampe) {
    const currDate = Date.now()
    const Hour = 1000 * 60 * 60
    const day = Hour * 24

    if (currDate - timestampe < Hour) {
        const timePass = currDate - timestampe
        const Minutes = Math.floor(timePass / (1000 * 60))
        return Minutes + ` ${Minutes > 1 ? "Minutes" : "Minute"} ago - `
    } else if (currDate - timestampe < day) {
        const timePass = currDate - timestampe
        const Hours = Math.floor(timePass / (Hour))
        return Hours + ` ${Hours > 1 ? "Hours" : "Hour"} ago - `
    } else {
        const options = { day: "2-digit", month: "2-digit", year: "2-digit" }
        const date = new Date(timestampe)
        const formattedDate = date.toLocaleString("he-IL", options)
        return formattedDate + " - "
    }
}