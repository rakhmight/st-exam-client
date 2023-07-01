export function getSubject(id, subjects){
    let target = subjects.find(subject=>subject.id==id)
    if(target){
        return target.name.ru
    } else {
        return id
    }
}

export function getLanguages(langs){
    let languages = []
    langs.forEach(lang=>{
        if(lang=='custom'){
            languages.push('Foreign')
        } else if(lang=='ru'){
            languages.push('Русский')
        } else if(lang=='eng'){
            languages.push('English')
        } else if(lang=='uz_l'){
            languages.push("O'zbek")
        } else if(lang=='uz_k'){
            languages.push('Ўзбек')
        }
    })
    return languages.join(', ')
}

export function getThemes(sub, thems, subjects){
    let target = subjects.find(subject=>subject.id==sub)
    if(target){
        let themes = []
        thems.forEach(item=>{
            let ThTarget = target.themes.find(theme=> theme.id==item)
            if(ThTarget){
                themes.push(ThTarget.name.ru)
            } else {
                themes.push(item)
            }
        })

        return themes.join(', ')
    } else {
        return thems.join(', ')
    }
}

export function normalizeDate(date, time){
    return Date.parse(`${date} ${time}`)
}

export function getTheme(sub, theme, subjects){
    const subject = subjects.find(subject=>subject.id==sub)

    const themeName = subject.themes.find(item => item.id==theme)
    if(themeName){
        return themeName.name.ru
    }else {
        return theme
    }
}