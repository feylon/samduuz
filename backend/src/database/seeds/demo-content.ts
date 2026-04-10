export const demoPages = [
  {
    key: 'history',
    pageType: 0,
    titleUz: 'Universitet tarixi',
    titleKr: 'Университет тарихи',
    titleRu: 'История университета',
    titleEn: 'University history',
    contentUz:
      '<p>Sharof Rashidov nomidagi Samarqand davlat universiteti 1927-yilda tashkil etilgan bo‘lib, Markaziy Osiyodagi eng qadimiy oliy ta’lim muassasalaridan biridir.</p><h2>Bugungi kun</h2><p>Universitetda 12 mingdan ortiq talaba tahsil oladi, 800 dan ziyod professor-o‘qituvchi faoliyat yuritadi.</p>',
    contentKr:
      '<p>Шароф Рашидов номидаги Самарқанд давлат университети 1927 йилда ташкил этилган бўлиб, Марказий Осиёдаги энг қадимий олий таълим муассасаларидан биридир.</p>',
    contentRu:
      '<p>Самаркандский государственный университет имени Шарафа Рашидова основан в 1927 году и является одним из старейших вузов Центральной Азии.</p>',
    contentEn:
      '<p>Samarkand State University named after Sharof Rashidov was founded in 1927 and is one of the oldest higher education institutions in Central Asia.</p>',
  },
  {
    key: 'contacts',
    pageType: 0,
    titleUz: 'Bog‘lanish',
    titleKr: 'Боғланиш',
    titleRu: 'Контакты',
    titleEn: 'Contacts',
    contentUz:
      '<p><strong>Manzil:</strong> Samarqand shahri, Universitet xiyoboni, 15-uy.</p><p><strong>Telefon:</strong> +998 66 239 17 00</p><p><strong>E-pochta:</strong> devonxona@samdu.uz</p>',
    contentKr:
      '<p><strong>Манзил:</strong> Самарқанд шаҳри, Университет хиёбони, 15-уй.</p><p><strong>Телефон:</strong> +998 66 239 17 00</p>',
    contentRu:
      '<p><strong>Адрес:</strong> г. Самарканд, Университетский бульвар, 15.</p><p><strong>Телефон:</strong> +998 66 239 17 00</p>',
    contentEn:
      '<p><strong>Address:</strong> 15 University Boulevard, Samarkand.</p><p><strong>Phone:</strong> +998 66 239 17 00</p>',
  },
  {
    key: 'rector',
    pageType: 1,
    titleUz: 'Rektor',
    titleKr: 'Ректор',
    titleRu: 'Ректор',
    titleEn: 'Rector',
    employee: {
      firstName: 'Rustam',
      lastName: 'Xolmurodov',
      fathersName: 'Ibragimovich',
      position: 'Rektor, fizika-matematika fanlari doktori, professor',
      phoneNumber: '+998 66 239 17 00',
      email: 'rector@samdu.uz',
      receptionDays: 'Dushanba, Payshanba',
      workStartTime: '09:00',
      workEndTime: '18:00',
      address: 'Universitet xiyoboni, 15-uy, bosh bino, 2-qavat',
      dateOfBirth: '1968-03-14',
      mainImgURL: '',
      content:
        '<p>Universitet faoliyatiga umumiy rahbarlik qiladi, ilmiy kengash raisi.</p><ul><li>200 dan ortiq ilmiy maqolalar muallifi</li><li>Xalqaro hamkorlik loyihalari rahbari</li></ul>',
    },
  },
  {
    key: 'department',
    pageType: 2,
    titleUz: 'Axborot texnologiyalari kafedrasi',
    titleKr: 'Ахборот технологиялари кафедраси',
    titleRu: 'Кафедра информационных технологий',
    titleEn: 'Department of Information Technologies',
    department: {
      name: 'Axborot texnologiyalari kafedrasi',
      address: 'Universitet xiyoboni, 15-uy, 3-bino',
      phone: '+998 66 239 11 22',
      email: 'it@samdu.uz',
      facebook: 'https://facebook.com/samdu.uz',
      telegram: 'https://t.me/samdu_uz',
      linkedin: '',
      mainPicture: 'demo/cover-5.webp',
      content:
        '<p>Kafedra dasturiy injiniring, sun’iy intellekt va ma’lumotlar tahlili yo‘nalishlarida mutaxassislar tayyorlaydi.</p>',
    },
  },
];

export const demoNews = [
  {
    titleUz: 'Universitetda xalqaro ilmiy konferensiya bo‘lib o‘tdi',
    titleKr: 'Университетда халқаро илмий конференция бўлиб ўтди',
    titleRu: 'В университете прошла международная научная конференция',
    titleEn: 'International scientific conference held at the university',
    descriptionUz: 'Konferensiyada 15 ta davlatdan 300 dan ortiq olimlar ishtirok etdi.',
    descriptionKr: 'Конференцияда 15 та давлатдан 300 дан ортиқ олимлар иштирок этди.',
    descriptionRu: 'В конференции приняли участие более 300 учёных из 15 стран.',
    descriptionEn: 'More than 300 scientists from 15 countries took part in the conference.',
  },
  {
    titleUz: 'Talabalar uchun yangi zamonaviy kutubxona ochildi',
    titleKr: 'Талабалар учун янги замонавий кутубхона очилди',
    titleRu: 'Для студентов открылась новая современная библиотека',
    titleEn: 'A new modern library opened for students',
    descriptionUz: 'Kutubxonada 500 o‘rinli o‘quv zali va elektron resurslar markazi mavjud.',
    descriptionKr: 'Кутубхонада 500 ўринли ўқув зали ва электрон ресурслар маркази мавжуд.',
    descriptionRu: 'В библиотеке есть читальный зал на 500 мест и центр электронных ресурсов.',
    descriptionEn: 'The library has a 500-seat reading hall and an e-resources centre.',
  },
  {
    titleUz: 'SamDU jamoasi dasturlash olimpiadasida g‘olib bo‘ldi',
    titleKr: 'СамДУ жамоаси дастурлаш олимпиадасида ғолиб бўлди',
    titleRu: 'Команда СамГУ победила в олимпиаде по программированию',
    titleEn: 'SamSU team won the programming olympiad',
    descriptionUz: 'Respublika bosqichida universitet jamoasi birinchi o‘rinni egalladi.',
    descriptionKr: 'Республика босқичида университет жамоаси биринчи ўринни эгаллади.',
    descriptionRu: 'На республиканском этапе команда университета заняла первое место.',
    descriptionEn: 'The university team took first place at the national stage.',
  },
  {
    titleUz: 'Xorijiy universitetlar bilan qo‘shma ta’lim dasturlari kengaymoqda',
    titleKr: 'Хорижий университетлар билан қўшма таълим дастурлари кенгаймоқда',
    titleRu: 'Расширяются совместные программы с зарубежными вузами',
    titleEn: 'Joint programmes with foreign universities are expanding',
    descriptionUz: 'Yangi o‘quv yilida 6 ta qo‘shma dastur bo‘yicha qabul e’lon qilinadi.',
    descriptionKr: 'Янги ўқув йилида 6 та қўшма дастур бўйича қабул эълон қилинади.',
    descriptionRu: 'В новом учебном году откроется приём по 6 совместным программам.',
    descriptionEn: 'Admission to 6 joint programmes opens in the new academic year.',
  },
  {
    titleUz: 'Yosh olimlar uchun grant tanlovi natijalari e’lon qilindi',
    titleKr: 'Ёш олимлар учун грант танлови натижалари эълон қилинди',
    titleRu: 'Объявлены итоги грантового конкурса для молодых учёных',
    titleEn: 'Results of the grant competition for young scientists announced',
    descriptionUz: '24 ta loyiha moliyalashtirish uchun tanlab olindi.',
    descriptionKr: '24 та лойиҳа молиялаштириш учун танлаб олинди.',
    descriptionRu: 'Для финансирования отобраны 24 проекта.',
    descriptionEn: '24 projects were selected for funding.',
  },
  {
    titleUz: 'Sport majmuasida talabalar spartakiadasi start oldi',
    titleKr: 'Спорт мажмуасида талабалар спартакиадаси старт олди',
    titleRu: 'В спорткомплексе стартовала студенческая спартакиада',
    titleEn: 'Student sports games started at the sports complex',
    descriptionUz: 'Musobaqalar 8 ta sport turi bo‘yicha ikki hafta davom etadi.',
    descriptionKr: 'Мусобақалар 8 та спорт тури бўйича икки ҳафта давом этади.',
    descriptionRu: 'Соревнования по 8 видам спорта продлятся две недели.',
    descriptionEn: 'Competitions in 8 sports will last two weeks.',
  },
];

export const demoAnnouncements = [
  {
    titleUz: 'Magistraturaga qabul hujjatlari topshirish muddati',
    titleKr: 'Магистратурага қабул ҳужжатлари топшириш муддати',
    titleRu: 'Сроки подачи документов в магистратуру',
    titleEn: 'Master’s admission application deadline',
    descriptionUz: 'Hujjatlar 1-iyuldan 31-iyulgacha onlayn qabul qilinadi.',
    descriptionKr: 'Ҳужжатлар 1 июлдан 31 июлгача онлайн қабул қилинади.',
    descriptionRu: 'Документы принимаются онлайн с 1 по 31 июля.',
    descriptionEn: 'Applications are accepted online from July 1 to July 31.',
  },
  {
    titleUz: 'Doktorantura bo‘yicha ochiq seminar',
    titleKr: 'Докторантура бўйича очиқ семинар',
    titleRu: 'Открытый семинар по докторантуре',
    titleEn: 'Open seminar on doctoral studies',
    descriptionUz: 'Seminar bosh binoning majlislar zalida soat 14:00 da bo‘ladi.',
    descriptionKr: 'Семинар бош бинонинг мажлислар залида соат 14:00 да бўлади.',
    descriptionRu: 'Семинар пройдёт в актовом зале главного корпуса в 14:00.',
    descriptionEn: 'The seminar will take place in the main hall at 14:00.',
  },
  {
    titleUz: 'Vakant lavozimlarga tanlov e’lon qilinadi',
    titleKr: 'Вакант лавозимларга танлов эълон қилинади',
    titleRu: 'Объявляется конкурс на вакантные должности',
    titleEn: 'Competition for vacant positions announced',
    descriptionUz:
      'Professor-o‘qituvchilar lavozimlariga hujjatlar bir oy davomida qabul qilinadi.',
    descriptionKr: 'Профессор-ўқитувчилар лавозимларига ҳужжатлар бир ой давомида қабул қилинади.',
    descriptionRu: 'Документы на должности ППС принимаются в течение месяца.',
    descriptionEn: 'Applications for teaching positions are accepted for one month.',
  },
  {
    titleUz: 'Yozgi amaliyot jadvali tasdiqlandi',
    titleKr: 'Ёзги амалиёт жадвали тасдиқланди',
    titleRu: 'Утверждён график летней практики',
    titleEn: 'Summer internship schedule approved',
    descriptionUz: 'Jadval bilan fakultet dekanatlarida tanishish mumkin.',
    descriptionKr: 'Жадвал билан факультет деканатларида танишиш мумкин.',
    descriptionRu: 'С графиком можно ознакомиться в деканатах факультетов.',
    descriptionEn: 'The schedule is available at the faculty dean offices.',
  },
];

export const paragraphs = {
  Uz: '<p>Tadbir universitet rahbariyati, professor-o‘qituvchilar va talabalar ishtirokida o‘tkazildi. Unda ilm-fan, ta’lim sifati va xalqaro hamkorlikka oid dolzarb masalalar muhokama qilindi.</p><p>Tadbir yakunida faol ishtirokchilar taqdirlandi va kelgusi rejalar belgilab olindi.</p>',
  Kr: '<p>Тадбир университет раҳбарияти, профессор-ўқитувчилар ва талабалар иштирокида ўтказилди.</p><p>Тадбир якунида фаол иштирокчилар тақдирланди.</p>',
  Ru: '<p>Мероприятие прошло с участием руководства университета, преподавателей и студентов.</p><p>В завершение активные участники были награждены.</p>',
  En: '<p>The event was attended by university leadership, faculty and students.</p><p>At the end, the most active participants were awarded.</p>',
};
