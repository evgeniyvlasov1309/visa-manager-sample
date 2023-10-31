export const franceDefaultValues = {
    destinationCountry: "Fr",
    residenceCountry: "Ru",
    visaCenter: "2002",
    visaCategory: "1273",
    visaSubcategory: "2338",
    status: "pending",
    postPayment: true,
    applicants: [
        {
            citizenship: "179",
        },
    ],
};

export const chinaDefaultValues = {
    destinationCountry: "Ch",
    residenceCountry: "Ru",
    status: "pending",
    postPayment: true,
    applicants: [{}],
};

export const usaDefaultValues = {
    destinationCountry: "Usa",
    residenceCountry: "Ru",
    status: "pending",
    postPayment: true,
    applicants: [{}],
};

export const spainDefaultValues = {
    destinationCountry: "Sp",
    residenceCountry: "Ru",
    status: "pending",
    postPayment: true,
    applicants: [
        {
            citizenship: "Российская Федерация",
        },
    ],
};

export const franceFields = [
    "residenceCountry",
    "destinationCountry",
    "visaCenter",
    "visaCategory",
    "visaSubcategory",
    "comment",
    "commentForBotOwner",
    "surname",
    "firstName",
    "gender",
    "dateOfBirth",
    "citizenship",
    "passportNumber",
    "passportExpireDate",
    "phoneNumber",
    "agent",
    "recordingDateFrom",
    "recordingDateTo",
];

export const spainFields = [
    "residenceCountry",
    "destinationCountry",
    "visaCenter",
    "visaCategory",
    "recordCategory",
    "comment",
    "commentForBotOwner",
    "surname",
    "firstName",
    "gender",
    "dateOfBirth",
    "citizenship",
    "passportType",
    "passportNumber",
    "passportExpireDate",
    "passportPlaceOfIssue",
    "passportDateOfIssue",
    "phoneNumber",
    "agent",
    "recordingDateFrom",
    "recordingDateTo",
    "recordingDateOffset",
];

export const chinaFields = [
    "residenceCountry",
    "destinationCountry",
    "city",
    "agent",
    "email",
    "comment",
    "commentForBotOwner",
    "recordSurname",
    "recordFirstName",
    "recordPhoneNumber",
    "recordingDateFrom",
    "recordingDateTo",
    "recordingDateOffset",
    "applicationNumber",
    "passportNumber",
];

export const usaFields = [
    "residenceCountry",
    "destinationCountry",
    "visaCenter",
    "agent",
    "login",
    "comment",
    "commentForBotOwner",
    "password",
    "recordingDateFrom",
    "recordingDateTo",
    "recordingDateOffset",
    "surname",
    "firstName",
    "phoneNumber",
    "passportNumber",
    "applicationNumber",
];

export const residenceCountryOptions = [
    {
        label: "Россия",
        value: "Ru",
    },
];

export const paymentOptions = [
    {
        label: "Оплачен",
        value: "true",
    },
    {
        label: "Не оплачен",
        value: "false",
    },
];

export const statusOptions = [
    {
        label: "Ожидает",
        value: "pending",
    },
    {
        label: "Отмена",
        value: "canceled",
    },
    {
        label: "В работе",
        value: "progress",
    },
    {
        label: "Ошибка",
        value: "error",
    },
    {
        label: "Записан",
        value: "success",
    },
];

export const cityOptions = [
    {
        label: "Иркутск",
        value: "Иркутск",
    },
    {
        label: "Хабаровск",
        value: "Хабаровск",
    },
    {
        label: "Москва",
        value: "Москва",
    },
    {
        label: "Санкт-Петербург",
        value: "Санкт-Петербург",
    },
    {
        label: "Владивосток",
        value: "Владивосток",
    },
    {
        label: "Екатеринбург",
        value: "Екатеринбург",
    },
];

export const visaCenterOptions = {
    Sp: [
        {
            label: "Санкт-Петербург",
            value: "Санкт-Петербург",
        },
        {
            label: "Москва",
            value: "Москва",
        },
        {
            label: "Казань",
            value: "Казань",
        },
        {
            label: "Екатеринбург",
            value: "Екатеринбург",
        },
        {
            label: "Ростов-на-Дону",
            value: "Ростов-на-Дону",
        },
        {
            label: "Новосибирск",
            value: "Новосибирск",
        },
        {
            label: "Нижний Новгород",
            value: "Нижний Новгород",
        },
        {
            label: "Самара",
            value: "Самара",
        },
    ],
    Fr: [
        {
            label: "France Visa Application Centre-Irkutsk",
            value: "2004",
        },
        {
            label: "France Visa Application Centre-Kaliningrad",
            value: "2014",
        },
        {
            label: "France Visa Application Centre-Kazan",
            value: "2005",
        },
        {
            label: "France Visa Application Centre-Khabarovsk",
            value: "2015",
        },
        {
            label: "France Visa Application Centre-Krasnodar",
            value: "2013",
        },
        {
            label: "France Visa Application Centre-Krasnoyarsk",
            value: "2016",
        },
        {
            label: "France Visa Application Centre-Moscow",
            value: "2002",
        },
        {
            label: "France Visa Application Centre-Murmansk",
            value: "2292",
        },
        {
            label: "France Visa Application Centre-Nizhniy Novgorod",
            value: "2006",
        },
        {
            label: "France Visa Application Centre-Novosibirsk",
            value: "2007",
        },
        {
            label: "France Visa Application Centre-Omsk",
            value: "2017",
        },
        {
            label: "France Visa Application Centre-Perm",
            value: "2008",
        },
        {
            label: "France Visa Application Centre-Petrozavodsk",
            value: "2293",
        },
        {
            label: "France Visa Application Centre-Rostov on Don",
            value: "2009",
        },
        {
            label: "France Visa Application Centre-Samara",
            value: "2010",
        },
        {
            label: "France Visa Application Centre-Saratov",
            value: "2018",
        },
        {
            label: "France Visa Application Centre-St Petersburg",
            value: "2003",
        },
        {
            label: "France Visa Application Centre-Ufa",
            value: "2020",
        },
        {
            label: "France Visa Application Centre-Vladivostok",
            value: "2011",
        },
        {
            label: "France Visa Application Centre-Yekaterinburg",
            value: "2012",
        },
        {
            label: "MBS",
            value: "3095",
        },
        {
            label: "St. Petersburg",
            value: "2294",
        },
    ],
    Usa: [
        {
            label: "Черногория",
            value: "Черногория",
        },
        {
            label: "Мальта",
            value: "Мальта",
        },
        {
            label: "Люксембург",
            value: "Люксембург",
        },
        {
            label: "Таджикистан",
            value: "Таджикистан",
        },
        {
            label: "Узбекистан",
            value: "Узбекистан",
        },
        {
            label: "Маврикий",
            value: "Маврикий",
        },
        {
            label: "Польша",
            value: "Польша",
        },
        {
            label: "Казахстан",
            value: "Казахстан",
        },
    ],
};

export const recordCategoryOptions = {
    Sp: [
        {
            label: "Обычная подача",
            value: "Обычная подача",
        },
        {
            label: "Подача через VIP - зал",
            value: "Подача через VIP - зал",
        },
    ],
};

export const visaSpbCategoryOptions = {
    Sp: [
        {
            label: "Бизнес",
            value: "Бизнес",
        },
        {
            label: "Обучение (не более 90 дней)",
            value: "Обучение (не более 90 дней)",
        },
        {
            label: "Владельцы недвижимости",
            value: "Владельцы недвижимости",
        },
        {
            label: "Моряки",
            value: "Моряки",
        },
        {
            label: "Предварительно согласованные с Посольством Испании (лечение и тд)",
            value: "Предварительно согласованные с Посольством Испании (лечение и тд)",
        },
        {
            label: "Члены семьи граждан ЕС",
            value: "Члены семьи граждан ЕС",
        },
        {
            label: "3 года - Шенгенская виза С",
            value: "3 года - Шенгенская виза С",
        },
        {
            label: "2 года - Шенгенская виза С",
            value: "2 года - Шенгенская виза С",
        },
        {
            label: "Study Visa",
            value: "Study Visa",
        },
    ],
};

export const visaCategoryOptions = {
    Sp: [
        {
            label: "Туризм",
            value: "Туризм",
        },
        {
            label: "Бизнес",
            value: "Бизнес",
        },
        {
            label: "Учёба сроком менее 90 дней",
            value: "Учёба сроком менее 90 дней",
        },
        {
            label: "Культурные мероприятия",
            value: "Культурные мероприятия",
        },
        {
            label: "Посещение родственников и друзей (Приглашение от частного лица)",
            value: "Посещение родственников и друзей (Приглашение от частного лица)",
        },
        {
            label: "Владельцы недвижимости",
            value: "Владельцы недвижимости",
        },
        {
            label: "Моряки",
            value: "Моряки",
        },
        {
            label: "Родственники граждан Испании или ЕС",
            value: "Родственники граждан Испании или ЕС",
        },
    ],
    Fr: [
        {
            label: "Long Stay",
            value: "1274",
        },
        {
            label: "Short Stay",
            value: "1273",
        },
    ],
};

export const visaSubcategoryOptionsLong = {
    Fr: [
        {
            label: "Long Stay All kind of other long stay visas",
            value: "2337",
        },
        {
            label: "Long Stay Ascendant of French citizen or of his foreign spouse",
            value: "1361",
        },
        {
            label: "Long Stay Beneficiary of OFII decision for family reunification",
            value: "2236",
        },
        {
            label: "Long Stay foreign children of a French/EU citizen",
            value: "2295",
        },
        {
            label: "Long Stay Lecteur et assistant de langue",
            value: "1360",
        },
        {
            label: "Long Stay married or PACS to a French citizen",
            value: "2175",
        },
        {
            label: "Long Stay married or PACS to EU/ EEA/CH/UK  citizen resident in France",
            value: "2176",
        },
        {
            label: "Long Stay Official posting - Carte PRO-MAE",
            value: "2238",
        },
        {
            label: "Long Stay Passeport-Talents and accompanying spouses and minor children",
            value: "2174",
        },
        {
            label: "Long Stay researchers invited by French research institution",
            value: "2172",
        },
        {
            label: "Long Stay Salarie OFII Guyane projet SOYUZ",
            value: "1354",
        },
        {
            label: "Long Stay visa for children of spouse of French/EU",
            value: "2177",
        },
        {
            label: "Long Stay visa for studying in a higher education institution",
            value: "2340",
        },
        {
            label: "Long Stay visa Parent of a French child",
            value: "3574",
        },
    ],
};

export const visaSubcategoryOptionsShort = {
    Fr: [
        {
            label: "PRIME TIME (55 euros ) Holder of a 2-5 years multi-entry visa delivered by France expired in 2020, 2021 or 2022",
            value: "2554",
        },
        {
            label: "PRIME TIME (55 euros ) Short Stay All kind of other short stay visas",
            value: "2553",
        },
        {
            label: "Settlement in France of an ascendant of a EU citizen or his foreign spouse",
            value: "3578",
        },
        {
            label: "Short Stay All kind of other short stay visas",
            value: "2338",
        },
        {
            label: "Short Stay All other types of short stay visas",
            value: "6022",
        },
        {
            label: "Short stay Ascendant of French citizen or of his foreign spouse",
            value: "2568",
        },
        {
            label: "Short Stay children of spouse of French/EU/EEA/CH/UK",
            value: "2194",
        },
        {
            label: "Short Stay flight/cargo crew (following to their base or training)",
            value: "2231",
        },
        {
            label: "Short Stay for Holders of a 2-5 years multi-entry visa delivered by France expired in 2020, 2021 or 2022",
            value: "2290",
        },
        {
            label: "Short Stay for medical treatment or burial of a family member",
            value: "3580",
        },
        {
            label: "Short Stay foreign minor children of a French/EU citizen",
            value: "2296",
        },
        {
            label: "Short stay holder of a diplomatic or service passport",
            value: "3571",
        },
        {
            label: "Short Stay international truck drivers",
            value: "2181",
        },
        {
            label: "Short Stay married or PACS to French/EEA/CH/UK citizen",
            value: "2184",
        },
        {
            label: "Short Stay Other kind of short stay visas",
            value: "6161",
        },
        {
            label: "Short Stay Other type of short stay visas",
            value: "6160",
        },
        {
            label: "Short Stay seafarers",
            value: "2180",
        },
        {
            label: "Short Stay visa for business or professional purpose",
            value: "2551",
        },
        {
            label: "Short Stay visa Parent of a French child",
            value: "3573",
        },
        {
            label: "Short Stay visa to marry a French citizen in France",
            value: "6036",
        },
    ],
};

export const passportTypeOptions = {
    Sp: [
        {
            label: "Заграничный паспорт",
            value: "Заграничный паспорт",
        },
        {
            label: "Паспорт иностранного гражданина",
            value: "Паспорт иностранного гражданина",
        },
        {
            label: "Паспорт ООН",
            value: "Паспорт ООН",
        },
        {
            label: "Служебный паспорт",
            value: "Служебный паспорт",
        },
    ],
};

export const genderOptions = [
    {
        label: "Женский",
        value: "2",
    },
    {
        label: "Мужской",
        value: "1",
    },
    {
        label: "Другое",
        value: "3",
    },
];

export const citizenshipOptions = {
    Sp: [
        {
            label: "Австралия",
            value: "Австралия",
        },
        {
            label: "Австрия",
            value: "Австрия",
        },
        {
            label: "Азербайджан",
            value: "Азербайджан",
        },
        {
            label: "Албания",
            value: "Албания",
        },
        {
            label: "Алжир",
            value: "Алжир",
        },
        {
            label: "Американское Самоа",
            value: "Американское Самоа",
        },
        {
            label: "Ангилья",
            value: "Ангилья",
        },
        {
            label: "Ангола",
            value: "Ангола",
        },
        {
            label: "Андорра",
            value: "Андорра",
        },
        {
            label: "Антарктида",
            value: "Антарктида",
        },
        {
            label: "Антигуа и Барбуда",
            value: "Антигуа и Барбуда",
        },
        {
            label: "Аргентина",
            value: "Аргентина",
        },
        {
            label: "Армения",
            value: "Армения",
        },
        {
            label: "Аруба",
            value: "Аруба",
        },
        {
            label: "Афганистан",
            value: "Афганистан",
        },
        {
            label: "Багамские острова",
            value: "Багамские острова",
        },
        {
            label: "Бангладеш",
            value: "Бангладеш",
        },
        {
            label: "Барбадос",
            value: "Барбадос",
        },
        {
            label: "Бахрейн",
            value: "Бахрейн",
        },
        {
            label: "Беларусь",
            value: "Беларусь",
        },
        {
            label: "Белиз",
            value: "Белиз",
        },
        {
            label: "Бельгия",
            value: "Бельгия",
        },
        {
            label: "Бенин",
            value: "Бенин",
        },
        {
            label: "Бермудские Острова",
            value: "Бермудские Острова",
        },
        {
            label: "Болгария",
            value: "Болгария",
        },
        {
            label: "Боливия",
            value: "Боливия",
        },
        {
            label: "Босния",
            value: "Босния",
        },
        {
            label: "Ботсвана",
            value: "Ботсвана",
        },
        {
            label: "Бразилия",
            value: "Бразилия",
        },
        {
            label: "Бруней",
            value: "Бруней",
        },
        {
            label: "Буркина – Фасо",
            value: "Буркина – Фасо",
        },
        {
            label: "Бурунди",
            value: "Бурунди",
        },
        {
            label: "Бутан",
            value: "Бутан",
        },
        {
            label: "Вануату",
            value: "Вануату",
        },
        {
            label: "Ватикан",
            value: "Ватикан",
        },
        {
            label: "Великобриитания",
            value: "Великобриитания",
        },
        {
            label: "Венгрия",
            value: "Венгрия",
        },
        {
            label: "Венесуэла",
            value: "Венесуэла",
        },
        {
            label: "Виргинские Острова",
            value: "Виргинские Острова",
        },
        {
            label: "Восточный Тимор",
            value: "Восточный Тимор",
        },
        {
            label: "Вьетнам",
            value: "Вьетнам",
        },
        {
            label: "Габон",
            value: "Габон",
        },
        {
            label: "Гаити",
            value: "Гаити",
        },
        {
            label: "Гайана",
            value: "Гайана",
        },
        {
            label: "Гамбия",
            value: "Гамбия",
        },
        {
            label: "Гана",
            value: "Гана",
        },
        {
            label: "Гваделупе",
            value: "Гваделупе",
        },
        {
            label: "Гватемала",
            value: "Гватемала",
        },
        {
            label: "Гвинея",
            value: "Гвинея",
        },
        {
            label: "Гвинея-Бисау",
            value: "Гвинея-Бисау",
        },
        {
            label: "Германия",
            value: "Германия",
        },
        {
            label: "Гибралтар",
            value: "Гибралтар",
        },
        {
            label: "Гондурас",
            value: "Гондурас",
        },
        {
            label: "Гонконг",
            value: "Гонконг",
        },
        {
            label: "Гренада",
            value: "Гренада",
        },
        {
            label: "Гренландия",
            value: "Гренландия",
        },
        {
            label: "Греция",
            value: "Греция",
        },
        {
            label: "Грузия",
            value: "Грузия",
        },
        {
            label: "Дания",
            value: "Дания",
        },
        {
            label: "Демократическая Республика Конго",
            value: "Демократическая Республика Конго",
        },
        {
            label: "Джибути",
            value: "Джибути",
        },
        {
            label: "Доминика",
            value: "Доминика",
        },
        {
            label: "Доминиканская Республика",
            value: "Доминиканская Республика",
        },
        {
            label: "Египет",
            value: "Египет",
        },
        {
            label: "Замбия",
            value: "Замбия",
        },
        {
            label: "Западная Сахара",
            value: "Западная Сахара",
        },
        {
            label: "Зимбабве",
            value: "Зимбабве",
        },
        {
            label: "Израиль",
            value: "Израиль",
        },
        {
            label: "Индия",
            value: "Индия",
        },
        {
            label: "Индонезия",
            value: "Индонезия",
        },
        {
            label: "Иордания",
            value: "Иордания",
        },
        {
            label: "Ирак",
            value: "Ирак",
        },
        {
            label: "Иран",
            value: "Иран",
        },
        {
            label: "Ирландия",
            value: "Ирландия",
        },
        {
            label: "Исландия",
            value: "Исландия",
        },
        {
            label: "испания",
            value: "испания",
        },
        {
            label: "Италия",
            value: "Италия",
        },
        {
            label: "Йемен",
            value: "Йемен",
        },
        {
            label: "Кабо-Верде",
            value: "Кабо-Верде",
        },
        {
            label: "Казахстан",
            value: "Казахстан",
        },
        {
            label: "Камбоджа",
            value: "Камбоджа",
        },
        {
            label: "Камерун",
            value: "Камерун",
        },
        {
            label: "Канада",
            value: "Канада",
        },
        {
            label: "Катар",
            value: "Катар",
        },
        {
            label: "Кения",
            value: "Кения",
        },
        {
            label: "Кипр",
            value: "Кипр",
        },
        {
            label: "Кирибати",
            value: "Кирибати",
        },
        {
            label: "Китай",
            value: "Китай",
        },
        {
            label: "Колумбия",
            value: "Колумбия",
        },
        {
            label: "Коморы",
            value: "Коморы",
        },
        {
            label: "Коста-Рика",
            value: "Коста-Рика",
        },
        {
            label: "Кот-д´Ивуар",
            value: "Кот-д´Ивуар",
        },
        {
            label: "Куба",
            value: "Куба",
        },
        {
            label: "Кувейт",
            value: "Кувейт",
        },
        {
            label: "Кыргызстан",
            value: "Кыргызстан",
        },
        {
            label: "Лаос",
            value: "Лаос",
        },
        {
            label: "Латвия",
            value: "Латвия",
        },
        {
            label: "Лесото",
            value: "Лесото",
        },
        {
            label: "Либерия",
            value: "Либерия",
        },
        {
            label: "Ливан",
            value: "Ливан",
        },
        {
            label: "Ливия",
            value: "Ливия",
        },
        {
            label: "Литва",
            value: "Литва",
        },
        {
            label: "Лихтенштейн",
            value: "Лихтенштейн",
        },
        {
            label: "Люксембург",
            value: "Люксембург",
        },
        {
            label: "Маврикий",
            value: "Маврикий",
        },
        {
            label: "Мавритания",
            value: "Мавритания",
        },
        {
            label: "Мадагаскар",
            value: "Мадагаскар",
        },
        {
            label: "Майотта",
            value: "Майотта",
        },
        {
            label: "Макао",
            value: "Макао",
        },
        {
            label: "Македония",
            value: "Македония",
        },
        {
            label: "Малави",
            value: "Малави",
        },
        {
            label: "Малайзия",
            value: "Малайзия",
        },
        {
            label: "Мали",
            value: "Мали",
        },
        {
            label: "Мальдивы",
            value: "Мальдивы",
        },
        {
            label: "Мальта",
            value: "Мальта",
        },
        {
            label: "Мартиника",
            value: "Мартиника",
        },
        {
            label: "Маршалловы Острова",
            value: "Маршалловы Острова",
        },
        {
            label: "Мексика",
            value: "Мексика",
        },
        {
            label: "Мозамбик",
            value: "Мозамбик",
        },
        {
            label: "Молдова",
            value: "Молдова",
        },
        {
            label: "Монако",
            value: "Монако",
        },
        {
            label: "Монголия",
            value: "Монголия",
        },
        {
            label: "Монтсеррат",
            value: "Монтсеррат",
        },
        {
            label: "Морокко",
            value: "Морокко",
        },
        {
            label: "Мьянмар",
            value: "Мьянмар",
        },
        {
            label: "Намибия",
            value: "Намибия",
        },
        {
            label: "Науру",
            value: "Науру",
        },
        {
            label: "Недерландские Антильские Острова",
            value: "Недерландские Антильские Острова",
        },
        {
            label: "Недерланды",
            value: "Недерланды",
        },
        {
            label: "Непал",
            value: "Непал",
        },
        {
            label: "Нигер",
            value: "Нигер",
        },
        {
            label: "Нигерия",
            value: "Нигерия",
        },
        {
            label: "Никарагуа",
            value: "Никарагуа",
        },
        {
            label: "Новая Зеландия",
            value: "Новая Зеландия",
        },
        {
            label: "Норвегия",
            value: "Норвегия",
        },
        {
            label: "Оман",
            value: "Оман",
        },
        {
            label: "Остров Святой Елены",
            value: "Остров Святой Елены",
        },
        {
            label: "Острова Кайман",
            value: "Острова Кайман",
        },
        {
            label: "Острова Кука",
            value: "Острова Кука",
        },
        {
            label: "Пакистан",
            value: "Пакистан",
        },
        {
            label: "Палау",
            value: "Палау",
        },
        {
            label: "Палестина",
            value: "Палестина",
        },
        {
            label: "Панама",
            value: "Панама",
        },
        {
            label: "Папуа Новая Гвинея",
            value: "Папуа Новая Гвинея",
        },
        {
            label: "Парагвай",
            value: "Парагвай",
        },
        {
            label: "Перу",
            value: "Перу",
        },
        {
            label: "Польша",
            value: "Польша",
        },
        {
            label: "Португалия",
            value: "Португалия",
        },
        {
            label: "Пуэрто-Рико",
            value: "Пуэрто-Рико",
        },
        {
            label: "Республика Конго",
            value: "Республика Конго",
        },
        {
            label: "Реюньон",
            value: "Реюньон",
        },
        {
            label: "Российская Федерация",
            value: "Российская Федерация",
        },
        {
            label: "Руанда",
            value: "Руанда",
        },
        {
            label: "Румыния",
            value: "Румыния",
        },
        {
            label: "Сальвадор",
            value: "Сальвадор",
        },
        {
            label: "Самоа",
            value: "Самоа",
        },
        {
            label: "Сан-Марино",
            value: "Сан-Марино",
        },
        {
            label: "Сан-Томе и Принсипи",
            value: "Сан-Томе и Принсипи",
        },
        {
            label: "Саудовска Арабия",
            value: "Саудовска Арабия",
        },
        {
            label: "Северная Корея",
            value: "Северная Корея",
        },
        {
            label: "Северная Корея",
            value: "Северная Корея",
        },
        {
            label: "Сейшельские острова",
            value: "Сейшельские острова",
        },
        {
            label: "Сенегал",
            value: "Сенегал",
        },
        {
            label: "Сент-Винсент и Гренадины",
            value: "Сент-Винсент и Гренадины",
        },
        {
            label: "Сент-Китс и Невис",
            value: "Сент-Китс и Невис",
        },
        {
            label: "Сент-Люсия",
            value: "Сент-Люсия",
        },
        {
            label: "Сербия",
            value: "Сербия",
        },
        {
            label: "Сингапур",
            value: "Сингапур",
        },
        {
            label: "Сирия",
            value: "Сирия",
        },
        {
            label: "Словакия",
            value: "Словакия",
        },
        {
            label: "Словения",
            value: "Словения",
        },
        {
            label: "Соединенные Арабские Эмираты",
            value: "Соединенные Арабские Эмираты",
        },
        {
            label: "Соединенные Штаты Америки",
            value: "Соединенные Штаты Америки",
        },
        {
            label: "Соломоновы острова",
            value: "Соломоновы острова",
        },
        {
            label: "Сомали",
            value: "Сомали",
        },
        {
            label: "Судан",
            value: "Судан",
        },
        {
            label: "Суринам",
            value: "Суринам",
        },
        {
            label: "Сьерра-Леоне",
            value: "Сьерра-Леоне",
        },
        {
            label: "Таджикистан",
            value: "Таджикистан",
        },
        {
            label: "Таиланд",
            value: "Таиланд",
        },
        {
            label: "Тайвань",
            value: "Тайвань",
        },
        {
            label: "Танзания",
            value: "Танзания",
        },
        {
            label: "Теркс и Кайкос",
            value: "Теркс и Кайкос",
        },
        {
            label: "Того",
            value: "Того",
        },
        {
            label: "Тонга",
            value: "Тонга",
        },
        {
            label: "Тринидад и Тобаго",
            value: "Тринидад и Тобаго",
        },
        {
            label: "Тувалу",
            value: "Тувалу",
        },
        {
            label: "Тунис",
            value: "Тунис",
        },
        {
            label: "Туркменистан",
            value: "Туркменистан",
        },
        {
            label: "Турция",
            value: "Турция",
        },
        {
            label: "Уганда",
            value: "Уганда",
        },
        {
            label: "Узбекистан",
            value: "Узбекистан",
        },
        {
            label: "Украина",
            value: "Украина",
        },
        {
            label: "Уругвай",
            value: "Уругвай",
        },
        {
            label: "Федеративные штаты микронезии",
            value: "Федеративные штаты микронезии",
        },
        {
            label: "Фиджи",
            value: "Фиджи",
        },
        {
            label: "Филиппны",
            value: "Филиппны",
        },
        {
            label: "Финляндия",
            value: "Финляндия",
        },
        {
            label: "Франция",
            value: "Франция",
        },
        {
            label: "Французская Гвиана",
            value: "Французская Гвиана",
        },
        {
            label: "Французская Полинезия",
            value: "Французская Полинезия",
        },
        {
            label: "Французскиие Южные и Антарктические Территории",
            value: "Французскиие Южные и Антарктические Территории",
        },
        {
            label: "Хорватия",
            value: "Хорватия",
        },
        {
            label: "Центральноафриканская республика",
            value: "Центральноафриканская республика",
        },
        {
            label: "Чад",
            value: "Чад",
        },
        {
            label: "Черногория",
            value: "Черногория",
        },
        {
            label: "Чешская Республика",
            value: "Чешская Республика",
        },
        {
            label: "Чили",
            value: "Чили",
        },
        {
            label: "Швейцария",
            value: "Швейцария",
        },
        {
            label: "Швейцария",
            value: "Швейцария",
        },
        {
            label: "Швеция",
            value: "Швеция",
        },
        {
            label: "Шотландия",
            value: "Шотландия",
        },
        {
            label: "Шпицберген и Ян-Майен",
            value: "Шпицберген и Ян-Майен",
        },
        {
            label: "Шри-Ланка",
            value: "Шри-Ланка",
        },
        {
            label: "Эквадор",
            value: "Эквадор",
        },
        {
            label: "Экваториальная Гвинея",
            value: "Экваториальная Гвинея",
        },
        {
            label: "Эритрея",
            value: "Эритрея",
        },
        {
            label: "Эстония",
            value: "Эстония",
        },
        {
            label: "Эфиопия",
            value: "Эфиопия",
        },
        {
            label: "Южная Георгия и Южные Сандвичевы Острова",
            value: "Южная Георгия и Южные Сандвичевы Острова",
        },
        {
            label: "Южно-Африканская Республика",
            value: "Южно-Африканская Республика",
        },
        {
            label: "Южный Судан",
            value: "Южный Судан",
        },
        {
            label: "Ямайка",
            value: "Ямайка",
        },
        {
            label: "Япония",
            value: "Япония",
        },
    ],
    Fr: [
        {
            label: "ABIDJAN",
            value: "30",
        },
        {
            label: "AFGHANISTAN",
            value: "62",
        },
        {
            label: "ALBANIA",
            value: "63",
        },
        {
            label: "ALGERIA",
            value: "24",
        },
        {
            label: "ANDORRA",
            value: "64",
        },
        {
            label: "ANGOLA",
            value: "17",
        },
        {
            label: "ANGUILLA",
            value: "65",
        },
        {
            label: "ANTIGUA AND BARBUDA",
            value: "66",
        },
        {
            label: "ARGENTINA",
            value: "67",
        },
        {
            label: "ARMENIA",
            value: "68",
        },
        {
            label: "ARUBA",
            value: "442",
        },
        {
            label: "AUSTRALIA",
            value: "3",
        },
        {
            label: "AUSTRIA",
            value: "69",
        },
        {
            label: "AZERBAIJAN",
            value: "49",
        },
        {
            label: "BAHAMAS",
            value: "70",
        },
        {
            label: "BAHRAIN",
            value: "19",
        },
        {
            label: "BANGLADESH",
            value: "11",
        },
        {
            label: "BARBADOS",
            value: "71",
        },
        {
            label: "BELARUS",
            value: "72",
        },
        {
            label: "BELGIUM",
            value: "73",
        },
        {
            label: "BELIZE",
            value: "74",
        },
        {
            label: "BENIN",
            value: "75",
        },
        {
            label: "BERMUDA",
            value: "76",
        },
        {
            label: "BHUTAN",
            value: "40",
        },
        {
            label: "BOLIVIA",
            value: "41",
        },
        {
            label: "BOSNIA AND HERZEGOVINA",
            value: "77",
        },
        {
            label: "BOTSWANA",
            value: "78",
        },
        {
            label: "BRAZIL",
            value: "9",
        },
        {
            label: "BRITISH VIRGIN ISLANDS",
            value: "79",
        },
        {
            label: "BRUNEI DARUSSALAM",
            value: "80",
        },
        {
            label: "BULGARIA",
            value: "81",
        },
        {
            label: "BURKINA FASO",
            value: "82",
        },
        {
            label: "BURUNDI",
            value: "83",
        },
        {
            label: "CAMBODIA",
            value: "84",
        },
        {
            label: "CAMEROON",
            value: "85",
        },
        {
            label: "CANADA",
            value: "8",
        },
        {
            label: "CAPE VERDE",
            value: "86",
        },
        {
            label: "CAYMAN ISLANDS",
            value: "443",
        },
        {
            label: "CENTRAL AFRICAN REPUBLIC",
            value: "87",
        },
        {
            label: "CHAD",
            value: "88",
        },
        {
            label: "CHILE",
            value: "89",
        },
        {
            label: "CHINA",
            value: "16",
        },
        {
            label: "CHRISTMAS ISLAND",
            value: "444",
        },
        {
            label: "COCOS (KEELING) ISLANDS",
            value: "445",
        },
        {
            label: "COLOMBIA",
            value: "39",
        },
        {
            label: "COMOROS",
            value: "90",
        },
        {
            label: "CONGO",
            value: "91",
        },
        {
            label: "CONGO, DEMOCRATIC REPUBLIC OF",
            value: "92",
        },
        {
            label: "CONGO, REPUBLIC OF (BRAZZAVILLE)",
            value: "447",
        },
        {
            label: "COOK ISLANDS",
            value: "448",
        },
        {
            label: "COSTA RICA",
            value: "93",
        },
        {
            label: "COTE D IVOIRE",
            value: "94",
        },
        {
            label: "CROATIA",
            value: "95",
        },
        {
            label: "CUBA",
            value: "96",
        },
        {
            label: "CYPRUS",
            value: "97",
        },
        {
            label: "CZECH REPUBLIC",
            value: "98",
        },
        {
            label: "CZECHOSLOVAKIA",
            value: "99",
        },
        {
            label: "DEMOCRATIC REPUBLIC OF CONGO",
            value: "31",
        },
        {
            label: "DEMOCRATIC REPUBLIC OF THE CONGO (KINSHASA)",
            value: "446",
        },
        {
            label: "DENMARK",
            value: "100",
        },
        {
            label: "DJIBOUTI",
            value: "101",
        },
        {
            label: "DOMINICA",
            value: "102",
        },
        {
            label: "DOMINICAN REPUBLIC",
            value: "7",
        },
        {
            label: "EAST TIMOR DEM REPUBLIC",
            value: "103",
        },
        {
            label: "ECUADOR",
            value: "104",
        },
        {
            label: "EDINBURGH",
            value: "36",
        },
        {
            label: "EGYPT",
            value: "47",
        },
        {
            label: "EL SALVADOR",
            value: "105",
        },
        {
            label: "EQUATORIAL GUINEA",
            value: "106",
        },
        {
            label: "ERITREA",
            value: "107",
        },
        {
            label: "ESTONIA",
            value: "108",
        },
        {
            label: "ETHIOPIA",
            value: "109",
        },
        {
            label: "EUROPEAN UNION",
            value: "478",
        },
        {
            label: "FALKLAND ISLANDS",
            value: "449",
        },
        {
            label: "FAROE ISLANDS",
            value: "450",
        },
        {
            label: "FIJI",
            value: "51",
        },
        {
            label: "FINLAND",
            value: "110",
        },
        {
            label: "FRANCE",
            value: "111",
        },
        {
            label: "GABON",
            value: "112",
        },
        {
            label: "GAMBIA",
            value: "113",
        },
        {
            label: "GEORGIA",
            value: "2",
        },
        {
            label: "GERMANY",
            value: "114",
        },
        {
            label: "GHANA",
            value: "50",
        },
        {
            label: "GIBRALTAR",
            value: "115",
        },
        {
            label: "GREECE",
            value: "116",
        },
        {
            label: "GREENLAND",
            value: "451",
        },
        {
            label: "GRENADA",
            value: "117",
        },
        {
            label: "GUATEMALA",
            value: "118",
        },
        {
            label: "GUINEA",
            value: "119",
        },
        {
            label: "GUINEA-BISSAU",
            value: "120",
        },
        {
            label: "GUYANA",
            value: "121",
        },
        {
            label: "HAITI",
            value: "15",
        },
        {
            label: "HOLY SEE",
            value: "452",
        },
        {
            label: "HONDURAS",
            value: "122",
        },
        {
            label: "HONG KONG",
            value: "123",
        },
        {
            label: "HUNGARY",
            value: "124",
        },
        {
            label: "ICELAND",
            value: "125",
        },
        {
            label: "INDIA",
            value: "46",
        },
        {
            label: "INDONESIA",
            value: "25",
        },
        {
            label: "IRAN",
            value: "126",
        },
        {
            label: "IRAN (ISLAMIC REPUBLIC OF)",
            value: "453",
        },
        {
            label: "IRAQ",
            value: "127",
        },
        {
            label: "IRELAND",
            value: "128",
        },
        {
            label: "ISRAEL",
            value: "129",
        },
        {
            label: "ITALY",
            value: "130",
        },
        {
            label: "IVORY COAST",
            value: "28",
        },
        {
            label: "JAMAICA",
            value: "131",
        },
        {
            label: "JAPAN",
            value: "21",
        },
        {
            label: "JORDAN",
            value: "52",
        },
        {
            label: "KAZAKHSTAN",
            value: "27",
        },
        {
            label: "KENYA",
            value: "132",
        },
        {
            label: "KENYA",
            value: "6",
        },
        {
            label: "KIRIBATI",
            value: "133",
        },
        {
            label: "KOREA, DEMOCRATIC PEOPLES REP",
            value: "134",
        },
        {
            label: "KOREA, DEMOCRATIC PEOPLE'S REP. (NORTH KOREA)",
            value: "454",
        },
        {
            label: "KOREA, REPUBLIC OF",
            value: "135",
        },
        {
            label: "KOREA, REPUBLIC OF (SOUTH KOREA)",
            value: "455",
        },
        {
            label: "KOSOVO",
            value: "456",
        },
        {
            label: "KOSOVO REPUBLIC OF",
            value: "136",
        },
        {
            label: "KUWAIT",
            value: "29",
        },
        {
            label: "KYRGYZSTAN",
            value: "137",
        },
        {
            label: "LAO, PEOPLE'S DEMOCRATIC REPUBLIC",
            value: "457",
        },
        {
            label: "LAOS",
            value: "138",
        },
        {
            label: "LATVIA",
            value: "139",
        },
        {
            label: "LEBANON",
            value: "13",
        },
        {
            label: "LESOTHO",
            value: "140",
        },
        {
            label: "LIBERIA",
            value: "141",
        },
        {
            label: "LIBYA",
            value: "61",
        },
        {
            label: "LIECHTENSTEIN",
            value: "142",
        },
        {
            label: "LITHUANIA",
            value: "143",
        },
        {
            label: "LONDON",
            value: "35",
        },
        {
            label: "LUXEMBOURG",
            value: "144",
        },
        {
            label: "MACAU",
            value: "458",
        },
        {
            label: "MACEDONIA",
            value: "145",
        },
        {
            label: "MACEDONIA, REP. OF",
            value: "459",
        },
        {
            label: "MADAGASCAR",
            value: "146",
        },
        {
            label: "MALAWI",
            value: "34",
        },
        {
            label: "MALAYSIA",
            value: "33",
        },
        {
            label: "MALDIVES",
            value: "147",
        },
        {
            label: "MALI",
            value: "148",
        },
        {
            label: "MALTA",
            value: "149",
        },
        {
            label: "MARSHALL ISLANDS",
            value: "150",
        },
        {
            label: "MAURITANIA",
            value: "151",
        },
        {
            label: "MAURITIUS",
            value: "152",
        },
        {
            label: "MEXICO",
            value: "153",
        },
        {
            label: "MICRONESIA",
            value: "154",
        },
        {
            label: "MICRONESIA, FEDERAL STATES OF",
            value: "460",
        },
        {
            label: "MOLDOVA",
            value: "155",
        },
        {
            label: "MOLDOVA, REPUBLIC OF",
            value: "461",
        },
        {
            label: "MONACO",
            value: "156",
        },
        {
            label: "MONGOLIA",
            value: "157",
        },
        {
            label: "MONTENEGRO",
            value: "462",
        },
        {
            label: "MONTSERRAT",
            value: "463",
        },
        {
            label: "MOROCCO",
            value: "5",
        },
        {
            label: "MOZAMBIQUE",
            value: "158",
        },
        {
            label: "MYANMAR",
            value: "159",
        },
        {
            label: "MYANMAR, BURMA",
            value: "464",
        },
        {
            label: "NAMIBIA",
            value: "160",
        },
        {
            label: "NAURU",
            value: "161",
        },
        {
            label: "NEPAL",
            value: "12",
        },
        {
            label: "NETHERLANDS",
            value: "43",
        },
        {
            label: "NETHERLANDS ANTILLES",
            value: "465",
        },
        {
            label: "NEW ZEALAND",
            value: "162",
        },
        {
            label: "NICARAGUA",
            value: "163",
        },
        {
            label: "NIGER",
            value: "164",
        },
        {
            label: "NIGERIA",
            value: "165",
        },
        {
            label: "NORWAY",
            value: "166",
        },
        {
            label: "OMAN",
            value: "22",
        },
        {
            label: "ONU",
            value: "477",
        },
        {
            label: "PAKISTAN",
            value: "44",
        },
        {
            label: "PALAU",
            value: "167",
        },
        {
            label: "PALESTINIAN TERRITORIES",
            value: "466",
        },
        {
            label: "PALESTNIAN TERRITORY, OCCUPIED",
            value: "168",
        },
        {
            label: "PANAMA",
            value: "169",
        },
        {
            label: "PAPUA NEW GUINEA",
            value: "170",
        },
        {
            label: "PARAGUAY",
            value: "171",
        },
        {
            label: "PERU",
            value: "172",
        },
        {
            label: "PHILIPPINES",
            value: "54",
        },
        {
            label: "PITCAIRN ISLAND",
            value: "467",
        },
        {
            label: "POLAND",
            value: "173",
        },
        {
            label: "PORTUGAL",
            value: "174",
        },
        {
            label: "QATAR",
            value: "175",
        },
        {
            label: "REPUBLIC OF MONTENEGRO",
            value: "176",
        },
        {
            label: "REPUBLIC OF SERBIA",
            value: "177",
        },
        {
            label: "ROMANIA",
            value: "178",
        },
        {
            label: "RUSSIAN FEDERATION",
            value: "179",
        },
        {
            label: "RWANDA",
            value: "180",
        },
        {
            label: "SAINT KITTS AND NEVIS",
            value: "181",
        },
        {
            label: "SAINT LUCIA",
            value: "182",
        },
        {
            label: "SAINT VINCENT AND THE GRENADIN",
            value: "183",
        },
        {
            label: "SAINT VINCENT AND THE GRENADINES",
            value: "468",
        },
        {
            label: "SAMOA",
            value: "184",
        },
        {
            label: "SAN MARINO",
            value: "185",
        },
        {
            label: "SAO TOME AND PRINCIPE",
            value: "186",
        },
        {
            label: "SAUDI ARABIA",
            value: "10",
        },
        {
            label: "SENEGAL",
            value: "26",
        },
        {
            label: "SERBIA",
            value: "469",
        },
        {
            label: "SERBIA AND MONTENEGRO",
            value: "187",
        },
        {
            label: "SEYCHELLES",
            value: "188",
        },
        {
            label: "SIERRA LEONE",
            value: "189",
        },
        {
            label: "SINGAPORE",
            value: "14",
        },
        {
            label: "SLOVAKIA",
            value: "190",
        },
        {
            label: "SLOVAKIA (SLOVAK REPUBLIC)",
            value: "470",
        },
        {
            label: "SLOVENIA",
            value: "191",
        },
        {
            label: "SOLOMON ISLANDS",
            value: "192",
        },
        {
            label: "SOMALIA",
            value: "193",
        },
        {
            label: "SOUTH AFRICA",
            value: "45",
        },
        {
            label: "SOUTH KOREA",
            value: "20",
        },
        {
            label: "SOUTH SUDAN",
            value: "194",
        },
        {
            label: "SPAIN",
            value: "195",
        },
        {
            label: "SRI LANKA",
            value: "4",
        },
        {
            label: "SUDAN",
            value: "196",
        },
        {
            label: "SURINAME",
            value: "197",
        },
        {
            label: "SWAZILAND",
            value: "198",
        },
        {
            label: "SWEDEN",
            value: "199",
        },
        {
            label: "SWITZERLAND",
            value: "200",
        },
        {
            label: "SYRIA",
            value: "60",
        },
        {
            label: "SYRIA, SYRIAN ARAB REPUBLIC",
            value: "471",
        },
        {
            label: "TAIWAN",
            value: "201",
        },
        {
            label: "TAIWAN (REPUBLIC OF CHINA)",
            value: "472",
        },
        {
            label: "TAJIKISTAN",
            value: "202",
        },
        {
            label: "TANZANIA",
            value: "203",
        },
        {
            label: "TANZANIA; OFFICIALLY THE UNITED REPUBLIC OF TANZANIA",
            value: "473",
        },
        {
            label: "THAILAND",
            value: "57",
        },
        {
            label: "THE GERMAN DEMOCRATIC REP",
            value: "204",
        },
        {
            label: "THE SOVIET UNION",
            value: "205",
        },
        {
            label: "TIMOR-LESTE (EAST TIMOR)",
            value: "474",
        },
        {
            label: "TOGO",
            value: "206",
        },
        {
            label: "TONGA",
            value: "207",
        },
        {
            label: "TRINIDAD AND TOBAGO",
            value: "208",
        },
        {
            label: "TUNISIA",
            value: "32",
        },
        {
            label: "TURKEY",
            value: "53",
        },
        {
            label: "TURKEYEMBASSY",
            value: "38",
        },
        {
            label: "TURKMENISTAN",
            value: "209",
        },
        {
            label: "TURKS AND CAICOS ISLANDS",
            value: "475",
        },
        {
            label: "TUVALU",
            value: "210",
        },
        {
            label: "UGANDA",
            value: "211",
        },
        {
            label: "UK",
            value: "37",
        },
        {
            label: "UKEMBASSY",
            value: "23",
        },
        {
            label: "UKRAINE",
            value: "18",
        },
        {
            label: "UNITED ARAB EMIRATES",
            value: "212",
        },
        {
            label: "UNITED KINGDOM",
            value: "48",
        },
        {
            label: "UNITED STATES",
            value: "213",
        },
        {
            label: "URUGUAY",
            value: "214",
        },
        {
            label: "USA",
            value: "1",
        },
        {
            label: "UZBEKISTAN",
            value: "42",
        },
        {
            label: "VANUATU",
            value: "215",
        },
        {
            label: "VATICAN CITY",
            value: "216",
        },
        {
            label: "VENEZUELA",
            value: "217",
        },
        {
            label: "VIETNAM",
            value: "55",
        },
        {
            label: "VIRGIN ISLANDS (BRITISH)",
            value: "476",
        },
        {
            label: "YEMEN",
            value: "218",
        },
        {
            label: "ZAMBIA",
            value: "219",
        },
        {
            label: "ZIMBABWE",
            value: "220",
        },
    ],
};

export const recordFromLabel = {
    Fr: `Выберите интересующий интервал записи в ВЦ Франции. Рекомендуем активировать только при необходимости, т.к вы не будете записаны на даты вне этого интервала`,
    Sp: `Выберите интересующий интервал записи в ВЦ Испании. Рекомендуем активировать только при необходимости, т.к вы не будете записаны на даты вне этого интервала`,
    Ch: `Выберите интересующий интервал записи в ВЦ Китая. Рекомендуем активировать только при необходимости, т.к вы не будете записаны на даты вне этого интервала`,
    Usa: `Запись в установленный период дат. Данное ограничение устанавливается если вам необходима запись на собеседование не позднее определенной даты или в промежутке от даты и до даты. Рекомендуем сразу устанавливать максимально широкий диапазон дат для записи (по возможности).
	Запись в установленные ограничения зависит от выдачи мест посольством, сервис не гарантирует запись в ваши даты. Ограничение является платным, если вам нужна запись в ближайшие 6 месяцев, стоимость: 1 500 рублей. Ограничение бесплатное, если вы выбираете дату более, чем через 6 месяцев. Стоимость ограничения не подлежит возврату.
	`,
};

export const recordingDateOffsetLabel = {
    Fr: `С установкой минимум 1 дня запись возможна только на послезавтра и позже, без установки - на любой день. Рекомендуем активировать только по необходимости.`,
    Ch: `С установкой минимум 1 дня запись возможна только на послезавтра и позже, без установки - на любой день. Рекомендуем активировать только по необходимости.`,
    Sp: `С установкой минимум 1 дня запись возможна только на послезавтра и позже, без установки - на любой день. Рекомендуем активировать только по необходимости.`,
    Usa: `“Не менее Х дней” Сервису можно задать минимальное, необходимое вам для поездки в другую страну количество дней от даты записи до даты собеседования. Мы рекомендуем устанавливать минимум 1-2 дня до собеседования, чтобы успеть купить билеты на транспорт, доехать до города собеседования. Места могут появиться, например, сегодня на завтра - не установив минимум 1 день, сервис может записать вас на такое место. При выборе 1 дня - запись будет возможна минимум на послезавтра и так далее. 
	! Данное ограничение может быть установлено совместно с другими ограничениями.
	Чем меньше ограничений у Вас установлено, тем быстрее сервис сможет записать Ваш аккаунт.
	Сервис может записать Вас на любую дату в рамках Ваших ограничений. Перезапись - это новая оплата услуги. Внимательно проверяйте ограничения перед оплатой!`,
};
