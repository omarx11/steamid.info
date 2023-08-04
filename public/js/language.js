const lang_selector = document.querySelectorAll(".lang_selector");

// change language with selector
lang_selector.forEach((select) => {
  select.addEventListener("change", (event) => {
    let value = event.target.value;
    if (value === "0") return;
    setLanguage(value);
    localStorage.setItem("language", value);
    location.reload();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("language")) {
    localStorage.setItem("language", "en");
  }
  setLanguage(localStorage.getItem("language"));
});

function setLanguage(language) {
  const elements = document.querySelectorAll("[data-lang]");
  elements.forEach((element) => {
    const translationsKey = element.getAttribute("data-lang");
    element.innerHTML = translations[language][translationsKey];
  });

  if (language === "ar") {
    document.body.classList.add("ar");
  } else {
    document.body.classList.remove("ar");
  }

  lang_selector.forEach((select) => {
    if (language === "ar") {
      select[1].selected = true;
    } else {
      select[0].selected = true;
    }
  });
}

// set language translations
const translations = {
  en: {
    sign_in: "Sign-In",
    header_p_1: "Steam Games Grabber",
    header_p_2:
      "Find and show any list of games from any Steam profile effortlessly by simply entering the steamID in the search bar. Once logged in, you can conveniently view your friends' profiles along with the games they own.",
    menu_list_p_1: "Scroll to",
    menu_list_p_2: "Set Language",
    menu_list_p_3: "Sign In",
    apps_title_1: "New Specials",
    apps_title_2: "Top Sellers",
    thead_logo: "icon",
    thead_name: "name",
    thead_price: "price",
    apps_price: "SAR",
    apps_free: "Free",
    directions_1: "How can I find my SteamID?",
    directions_2: "Open your Steam Community Profile",
    directions_3: "Click Edit Profile",
    directions_4:
      "If you've never set a custom Steam Community URL for your account, your 64 bit ID will be shown in the URL under the CUSTOM URL box in the format 76561198#########",
    directions_5:
      "If you have set a custom URL for your account, you can delete the text in the CUSTOM URL box to see your account's 64 bit ID in the URL listed below.",
    example: "Examples: 76561198965877925 / ikatakuri",
    history: "search_history",
    save_as_1: "save as CSV",
    save_as_2: "save as JSON",
    save_as_3: "save as EXCEL",
    playtime: "Total Playtime",
    hours: "/ hours",
    apps_filter_1: "- Sort By -",
    apps_filter_2: "Hours played",
    apps_filter_3: "Last played date",
    apps_filter_4: "Last two weeks",
    apps_length_1: "All (slow)",
    h_right_1: "Search:",
    games_d_1: "more details",
    games_d_2: " Store",
    games_d_3: "played time",
    games_d_4: "last 2 weeks",
    games_d_5: "last played",
    games_d_hrs: "hr's",
    paginate_1: "Previous",
    paginate_2: "Next",
    entries_1: "Showing",
    entries_2: "to",
    entries_3: "of",
    friends_list: "Your Friends List",
    users_list: "Recent User Entries",
    f_signIn: '<a href="./login">Sign-in</a> first!',
    login: "LOGIN",
    login_des: "Chose authorization service",
    user_not_found: "## User not found ##",
    profile_name_1: "Profile Page",
    profile_name_2: "",
    store_h_desc:
      "Get a look at the ongoing count of Steam's players, Browse individual game info, or see the current top most played games",
    s_online: "ONLINE",
    s_playing: "PLAYING NOW",
    most_played: 'MOST PLAYED<img src="../icons/trending-up.svg">',
    most_p_desc: "Top played games by player count",
    records: "RECORDS 🔥",
    records_desc: "Highest player counts to be reached",
    g_t_rank: "RANK",
    g_t_playing_1: "PLAYING NOW",
    g_t_peak_1: "PEAK TODAY",
    g_t_playing_2: "PEAK PLAYERS",
    g_t_peak_2: "DATA REACHED",
    footer_p:
      "Designed by <a href='https://omar11.sa/'>omar11.sa</a> © 2022-2023. This is NOT an official Steam tool, All data comes from Steams API's. If any of those services are down, data with not be shown. <a href='https://store.steampowered.com/about/'>Steam</a> is a trademark of Valve Corporation. All game logos are property of their respective owners.",
  },
  ar: {
    sign_in: "تسجيل",
    header_p_1: "Steam Games Grabber",
    header_p_2:
      "ابحث عن أي قائمة ألعاب من أي ملف تعريف في منصة steam بسهوله عن طريق وضع steamID في البحث, وبعد تسجيلك للدخول يمكنك رؤية قائمة أصدقائك بالألعاب الخاصة بهم",
    menu_list_p_1: "الذهاب إلى",
    menu_list_p_2: "تحديد اللغة",
    menu_list_p_3: "تسجيل الدخول",
    apps_title_1: "العروض الجديدة",
    apps_title_2: "أعلى المبيعـات",
    thead_logo: "ايقونة",
    thead_name: "ألاسم",
    thead_price: "السعـر",
    apps_price: "ريال",
    apps_free: "مجاني",
    directions_1: "كيف احصل على SteamID الخاص بي؟",
    directions_2: "افتح ملف تعريف Steam الخاص بك",
    directions_3: "انقر فوق تحرير ملف التعريف",
    directions_4:
      "إذا لم تقم مطلقًا بتعيين عنوان URL مخصص لـ Steam لحسابك، فسيتم عرض معرف 64 بت في عنوان URL ضمن مربع عنوان URL المخصص بالتنسيق التالي 76561198 #########",
    directions_5:
      "إذا قمت بتعيين عنوان URL مخصص لحسابك ، فيمكنك حذف النص في مربع عنوان URL المخصص لرؤية معرف 64 بت لحسابك.",
    example: "مثـال: 76561198965877925 / ikatakuri",
    history: "سجل_البث",
    save_as_1: "حفظ ك CSV",
    save_as_2: "حفظ ك JSON",
    save_as_3: "حفظ ك EXCEL",
    playtime: "مجموع الوقت الكلي",
    hours: "/ ساعة",
    apps_filter_1: "- ترتيب حسب -",
    apps_filter_2: "أكثر وقت لعـب",
    apps_filter_3: "آخر وقت لعـب",
    apps_filter_4: "آخر اسبوعين",
    apps_length_1: "الكل (بطيء)",
    h_right_1: "بحـث:",
    games_d_1: "المزيد من التفاصيل",
    games_d_2: " المتجر",
    games_d_3: "وقت اللعب",
    games_d_4: "آخر اسبوعين",
    games_d_5: "آخر وقت لعب",
    games_d_hrs: "ساعة",
    paginate_1: "السابق",
    paginate_2: "التالي",
    entries_1: "عرض",
    entries_2: "إلى",
    entries_3: "من",
    friends_list: "قائمة أصدقائك",
    users_list: "إدخالات المستخدم الأخيرة",
    f_signIn: '<a href="./login">!سجل الدخول</a> أولاً',
    login: "تسجيل الدخول",
    login_des: "اختر طريقة لتسجيل الدخول",
    user_not_found: "## لم يتم العثور على المستخدم ##",
    profile_name_1: "صفحة",
    profile_name_2: "الشخصية",
    store_h_desc:
      "ألقِ نظرة سريعه على عدد اللاعبين في منصة Steam أو شاهد أكثر الالعاب ترويجاً",
    s_online: "متواجد حاليا",
    s_playing: "يلعبون الآن",
    most_played: 'الأكثـر لعبـاً <img src="../icons/trending-up.svg">',
    most_p_desc: "أعلى الألعاب التي تم لعبها حسب عدد اللاعبين",
    records: "السجلات 🔥",
    records_desc: "أعلى عدد لاعبين أمكنو الوصول إليه على حسب اللعبة",
    g_t_rank: "المرتبة",
    g_t_playing_1: "اللاعبـون الآن",
    g_t_peak_1: "ذروة اليـوم",
    g_t_playing_2: "أعلى وصول",
    g_t_peak_2: "تاريخ الوصول",
    footer_p:
      "تم التصميم بواسطة <a href='https://omar11.sa/'>omar11.sa</a>، هذا الموقع ليست أداة من شركة Steam الرسمية ، جميع البيانات تأتي من Steam API. في حالة تعطل أي من هذه الخدمات ، لن يتم عرض البيانات التي بها. <a href='https://store.steampowered.com/about/'>Steam</a> هي علامة تجارية لشركة Valve Corporation. جميع شعارات اللعبة هي ملك لأصحابها.",
  },
};
