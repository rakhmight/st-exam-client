const lang = {
    ru: {
        language: 'ru',
        prepareView: [
            'Комплексный экзамен',
            'Экзамен',
            'Предмет',
            'Время',
            'мин.',
            'неограничено', 
            'Билет',
            'Выберите язык',
            'Начать',
            'Экзамен начнётся через',
            "Вы были дисквалифицированы с экзамена"
        ],
        authView: [
            'Введите данные для входа',
            'Кто входит в систему?',
            'Укажите из списка',
            'Форма обучения',
            'Выберите форму обучения',
            'Курс',
            'Укажите свой курс',
            'Группа',
            'Укажите свою группу',
            'Отдел',
            'Кафедра',
            'Укажите свой отдел',
            'Укажите свою кафедру',
            'Ф.И.О.',
            'Выберите себя из списка',
            'Список пуст', // 15
            'Пароль',
            'Введите пароль',
            'Назад',
            'Войти',
            'Успешная авторизация',
            'Неверный пароль пользователя', // 21
            'Временные неполадки на стороне Auth-сервера',
            'Обучающийся',
            'Абитуриент',
            'Преподаватель',
            'Сотрудник',
            'Очная форма обучения',
            'Заочная форма обучения',
            'Магистратура',

            'группа', // 30
            'курс',
            'Обратитесь к администратору'
        ],
        coordinatorView: [
            'У вас нет активных экзаменов',
            'Экзамен',
            'Комплексный экзамен',
            'Автоматическое сохранение незаконченного экзамена',
            'Предмет',
            'Время',
            'Вопросов',
            'Начало',
            'Предметы',
            'Старт',
            'по команде админа', // 10
            'Подробнее об экзамене',
            'Информация об экзамене',
            'Информация об комплексном экзамене',
            'Время начала',
            'Время окончания',
            'Название предмета',
            'Кол-во билетов',
            'Кол-во вопросов',
            'Отведённое время',
            'Темы', // 20
            'Время на 1 вопрос',
            'Доступные языки',
            'Возможность изменить ответ',
            'Система оценки',
            'отлично',
            'хорошо',
            'удовлетворительно',
            'неограничено',
            'мин.',
            'Начать экзамен', // 30
            'и др.',
            'Экзамен завершён',
            'Экзамен ещё не начат',
            'Данный пользователь уже проходит этот экзамен',
            "Вы были дисквалифицированы",
            "Время на выбор экзамена",
        ],
        initView: [
            'Проверка зависимостей',
            'Подключение к серверам',
            'Проверка сокета клиента',
            'Запуск клиента',
            'Сменить IP-адреса',
            'Не удаётся подключиться к управляющему серверу. Как только подключение будет восстановлено, программа запуститься. Так же вы можете сменить IP-адреса серверов',
            'Не удаётся подключиться к раздающему серверу. Как только подключение будет восстановлено, программа запуститься. Так же вы можете сменить IP-адреса серверов',
            'Не удаётся подключиться к серверу аутентификации. Как только подключение будет восстановлено, программа запуститься. Так же вы можете сменить IP-адреса серверов',
            'Не удаётся подключиться к управляющему серверу для проверки клиента. Как только подключение будет восстановлено, программа запуститься. Так же вы можете сменить IP-адреса серверов',
            'Не удаётся подключиться к серверу поддержки. Как только подключение будет восстановлено, программа запуститься. Так же вы можете сменить IP-адреса серверов'
        ],
        examView: [
            'экзамен остановлен администратором',
            'время сдачи экзамена вышло',
            'Отправка ответов на проверку..',
            'Билет',
            'Тема вопроса',
            'Сложность',
            'Лёгкий',
            'Средний',
            'Трудный',
            'Время вопроса',
            'Вопросы', // 10
            'Время',
            'не ограничено',
            'Предмет',
            'Отправить',
            'Ваш результат',
            'Оценка',
            'Процентное соотношение',
            'Вопросы',
            'верные ответы',
            'неверные ответы', // 20
            'Количество правильных ответов',
            'Количество неверных ответов',
            'Экзаменуемый',
            'Абитуриент',
            'Преподаватель',
            'Сотрудник',
            'Форма обучения',
            'Курс',
            'Группа',
            'Кафедра', // 30
            'Отдел',
            'Отправка ответов на проверку',
            'Выйти',
            'очная',
            'заочная',
            'магистратура',
            'Вопросы',
            'Контекст ?-ов',
            'простой вопрос',
            'вопрос с изображениями', // 40
            'вопрос с выбираемой областью',
            'отвечено',
            'Экзаменуемый',
            'Балл',
            'набранный вами балл',
            'макс. балл по билету',
            'Потраченное время',
            'Вопросы',
            'Неверно отвеченные вопросы',
            'Вопрос и ответы', // 50
            'Не выбранный ответ',
            'Ответ, выбранный вами',
            'Верный ответ',
            'Неверный ответ',
            'Неверно указана область',
            'Время, отведённое для ознакомления с результатом',
            'Администратор остановил ваш экзамен',
            'Администратор удалали этот экзамен',
            'Потерено соединение с сервером. Обратитесь к администратору',
            'Отправить', // 60
            'Аминистратор исключил вас из списка экзаменуемых',
            'Курсант',
            'Слушатель',
            'Магистр',
            'курса',
            'группы',
            'Номер',
            'Абитуриент',
            "Преподаватель",
            "Сотрудник", // 70
            "кафедры",
            "формирования",
        ]
    },
    uz_l: {
        language: 'uz_l',
        prepareView: [
            "Kompleks imtihon",
            "Imtihon",
            'Fan',
            "Vaqt",
            'min.',
            "cheklanmagan",
            "Chipta",
            "Tilni tanlang",
            'Boshlash',
            "Imtihon boshlanadi", // 9
            "Siz imthondan chetlashtirildiz"
        ],
        authView: [
            "Kirish ma'lumotlaringizni kiriting",
            "Kim tizimga kirmoqda?",
            "Ro'yxatdan belgilang",
            "Ta'lim shakli",
            "Ta'lim shaklini tanlang",
            "Kurs",
            "Kursingizni belgilang",
            "Guruh",
            "Guruhingizni belgilang",
            "Bo'lim",
            'Kafedra',
            "Bo'limingizni belgilang",
            "Kafedrengizni belgilang",
            'F.I.Sh.',
            "Ro'yxatdan o'zingizni tanlang",
            "Ro'yxat bo'sh",
            "Parol",
            "Parolni kiriting",
            "Orqaga",
            'Kirish',
            "Muvaffaqiyatli avtorizatsiya",
            "Foydalanuvchi paroli noto'g'ri",
            "Auth-server tomonida vaqtinchalik muammolar",
            "Imtihon topshiruvchi",
            "Abituriyent",
            "O'qituvchi",
            "Xodim",
            "Kunduzgi ta'lim",
            "Sirtqi ta'lim",
            'Magistratura',

            'guruh', // 30
            'kurs',
            "Administratorga murojaat qiling"
        ],
        coordinatorView: [
            "Sizda faol imtihonlar yo'q",
            "imtihon",
            "Kompleks imtihon",
            "Tugallanmagan imtihonlarni avtomatik saqlash",
            'Fan',
            "Vaqt",
            "Savollar",
            "Boshlanish",
            "Fanlar",
            "Boshlanish",
            "administrator tomonidan", // 10
            "Imtihon haqida batafsil",
            "imtihon haqida ma'lumot",
            "Kompleks imtihon haqida ma'lumot",
            'Boshlanish vaqti',
            "Yakuniy vaqt",
            "Fan nomi",
            "Chiptalar soni",
            "Savollar soni",
            "Ajratilgan vaqt",
            "Mavzular", // 20
            "1 savol uchun vaqt",
            "Mavjud tillar",
            "Javobni o'zgartirish imkoniyati",
            "Baholash tizimi",
            "ajoyib",
            "yaxshi",
            "qoniqarli",
            "cheklanmagan",
            'daq.',
            "Imtihonni boshlash", // 30
            'va boshq.',
            "Imtihon yakunlandi",
            "Imtihon hali boshlanmagan",
            "Ushbu foydalanuvchi imtihoni topshirmoqda",
            "Ushbu imthondan chetlatilgansiz",
            "Imthonni tanglash uchun ajratilgan vaqt",
        ],
        initView: [
            "Bog'liklarni tekshirish",
            "Serverlarga ulanish",
            "Mijoz soketini tekshirish",
            "Mijozni ishga tushirish",
            "IP manzillarni o'zgartirish",
            "Boshqaruv serveriga ulanib bo'lmadi. Ulanish tiklanishi bilan dastur ishga tushadi. Shuningdek, siz serverlarning IP manzillarini o'zgartirishingiz mumkin",
            "Distribyutor serveriga ulanib bo'lmadi. Ulanish tiklanishi bilan dastur ishga tushadi. Shuningdek, siz serverlarning IP manzillarini o'zgartirishingiz mumkin",
            "Autentifikatsiya serveriga ulanib bo'lmadi. Ulanish tiklanishi bilan dastur ishga tushadi. Shuningdek, siz serverlarning IP manzillarini o'zgartirishingiz mumkin",
            "Mijozni tekshirish uchun boshqaruv serveriga ulanib bo'lmadi. Ulanish tiklanishi bilan dastur ishga tushadi. Shuningdek, siz serverlarning IP manzillarini o'zgartirishingiz mumkin",
            "Yordamchi serveriga ulanib bo'lmadi. Ulanish tiklanishi bilan dastur ishga tushadi. Shuningdek, siz serverlarning IP manzillarini o'zgartirishingiz mumkin",
        ],
        examView: [
            "imtihon administrator tomonidan to'xtatildi",
            "imtihon vaqti tugadi",
            "Javoblar ko'rib chiqish uchun yuborilmoqda...",
            "chipta",
            "Savol mavzusi",
            "Murakkablik",
            "Oson",
            "O'rtacha",
            "Qiyin",
            "Savol vaqti", 
            "Savollar", // 10
            "Vaqt",
            "cheklanmagan",
            'Fan',
            "Yuborish",
            "Sizning natijangiz",
            "Baho",
            "Foiz",
            "Savollar",
            "to'g'ri javoblar", 
            "noto'g'ri javoblar", // 20
            "To'g'ri javoblar soni",
            "Noto'g'ri javoblar soni",
            "Imtihon topshiruvchi",
            "Abiturient",
            "O'qituvchi",
            "Xodim",
            "Ta'lim shakli",
            "Kurs",
            "Guruh", 
            'Kafedra', // 30
            "Bo'lim",
            "Javoblarni ko'rib chiqish uchun yuborish",
            'Chiqish',
            "kunduzgi ta'lim",
            "sirtqi ta'lim",
            'magistratura',
            "Savollar",
            'Savollarni mazmuni',
            "oddiy savol",
            "rasmlar bilan savol",  // 40
            'tanlanadigan maydon bilan savol',
            'javob berildi',
            "Imtihon topshiruvchi",
            'Ball',
            'siz toplagan ball',
            'maks. chiptadagi ball',
            "Sarflangan vaqt",
            "Savollar",
            "Noto'g'ri javob berilgan savollar",
            "Savol va javoblar", // 50
            'Tanlanmagan javob',
            'Siz tanlagan javob',
            "To'g'ri javob",
            "Noto'g'ri javob",
            "Ko'rsatilgan maydon noto'g'ri",
            "Natijani ko'rib chiqish uchun ajratilgan vaqt",
            "Administrator imtihoningizni to'xtatdi",
            "Administrator bu imtihonni o'chirib tashladi",
            "Serverga ulanish uzildi. Administratorga murojaat qiling",
            "Yuborish", // 60
            "Administrator sizni imtihon topshiruvchilar ro'yxatidan olib tashladi",
            'kursanti',
            'tinglovchisi',
            'magistri',
            'kurs',
            'guruhning',
            'Raqam',
            'abiturienti',
            "o'qituvchisi",
            "xodimi", // 70
            "kafedrasining",
            "bo'limning",
        ]
    }
}

export default lang