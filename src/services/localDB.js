export function initDB(){
    let openRequest = indexedDB.open("STExamClient", 2)
  
    // обновление версии инициализация БД
    openRequest.onupgradeneeded = function() {        
        DBInitialization()
        console.log('(Local DB) DB initialized');
    }
  
    // Обработчик ошибки создания БД
    openRequest.onerror = function() {
        console.error("(Local DB) Error: ", openRequest.error)
    }

    const DBInitialization = () => {
        const db = openRequest.result
        // инициализация хранилища
        if (!db.objectStoreNames.contains('saves')) { // если хранилище "saves" не существует
            db.createObjectStore('saves', {keyPath: 'id'}) // создаём хранилище
        }
        
        if (!db.objectStoreNames.contains('errors')) { // если хранилище "errors" не существует
            db.createObjectStore('errors', {keyPath: 'id'}) // создаём хранилище
        }
    }
}