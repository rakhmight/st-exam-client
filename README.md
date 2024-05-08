# st-exam-client

### Стек технологий
<div>
    <img
    style="height: 45px;"
    src="https://cdn-icons-png.flaticon.com/512/5968/5968292.png"
    alt="JavaScript"
    />
    <img
    style="height: 45px;"
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1200px-Vue.js_Logo_2.svg.png"
    alt="Vue.js"
    />
    <img
    style="height: 45px;"
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Electron_Software_Framework_Logo.svg/1200px-Electron_Software_Framework_Logo.svg.png"
    alt="Electron.js"
    />
    <img
    style="width: 45px;"
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Socket-io.svg/1200px-Socket-io.svg.png"
    alt="Socket.io"
    />
</div>

###
> Проект провальный. Рабочий, но очень плохо написанный. <strong>Идёт работа над над ST v.1.2</strong>

### Информация
<strong>st-exam-client</strong> - один из модулей системы SmartTesting. Представляет собой десктоп клиент, на котором экзаменуемые решают тесты.

<div align="center">
    <img src="./docs/auth.jpg" alt="Auth page" height="400" />
    <img src="./docs/exam1.jpg" alt="Examination process" height="400" />
    <img src="./docs/exam2.jpg" alt="Examination result" height="400" />
    <img src="./docs/exam3.jpg" alt="Examination result" height="400" />
</div>

######
Перед входов в экзамен, если тесты написаны на нескольких языках, то экзаменуемому предлогается выбрать один из предложенных языков.

Во время экзамена, каждое действие экзаменуемого (пропуск вопроса, ответ на вопрос) фиксируется в IndexedDB и отправляется на [st-helper-server](https://github.com/rakhmight/st-exam-client).

Если клиент выкинет ошибку при исполнении кода, то ошибка будет отображена на экран и сохранена в IndexedDB.

### Сборка и запуск
- устанавливаем зависимости:
```bash
npm i
```

- собираем десктопную версию клиента:
```bash
npm run electron:build
```
###
> После завершения сборки установочный файл будет находиться в директории /dist_electron/bundled