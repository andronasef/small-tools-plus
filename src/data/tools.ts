export interface Tool {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  file: string;
  filename: string;
  category: 'Productivity' | 'Wellbeing' | 'Finance';
  badge: string;
  description: string;
  keywords: string;
  icon: string;
  iconFile: string;
  accentColor: string;
  bgGradientEnd: string;
  mobile: boolean;
  manifest?: string;
  lang?: string;
  dir?: 'ltr' | 'rtl';
}

export const tools: Tool[] = [
  {
    id: 'calendar',
    number: '01',
    title: 'WeekTrack Calendar',
    shortTitle: 'Calendar',
    file: 'tools/interactive_week_month_calendar.html',
    filename: 'interactive_week_month_calendar.html',
    category: 'Productivity',
    badge: 'ISO 8601',
    description: 'Smart Week & Month ISO 8601 Calendar and scheduling tool',
    keywords: 'calendar week month iso-8601 schedule date time year planning',
    icon: 'calendar',
    iconFile: 'tool-calendar.svg',
    accentColor: '#2563eb',
    bgGradientEnd: '#1d4ed8',
    mobile: true,
    manifest: 'manifest-calendar.webmanifest'
  },
  {
    id: 'feelings-wheel',
    number: '02',
    title: 'Arabic Feelings Wheel',
    shortTitle: 'المشاعر',
    file: 'tools/feelings-wheel-ar.html',
    filename: 'feelings-wheel-ar.html',
    category: 'Wellbeing',
    badge: 'Interactive SVG',
    description: 'عجلة مشاعر تفاعلية باللغة العربية للوعي النفسي والمشاعر',
    keywords: 'feelings emotion wheel arabic gloria willcox literacy mental psychology مشاعر عواطف',
    icon: 'smile',
    iconFile: 'tool-feelings.svg',
    accentColor: '#e11d48',
    bgGradientEnd: '#be123c',
    lang: 'ar',
    dir: 'rtl',
    mobile: true,
    manifest: 'manifest-feelings.webmanifest'
  },
  {
    id: 'notion-helper',
    number: '03',
    title: 'Notion Block Formatter',
    shortTitle: 'Notion',
    file: 'tools/notion-copy-helper.html',
    filename: 'notion-copy-helper.html',
    category: 'Productivity',
    badge: 'Text Engine',
    description: 'مصلح ومنظم نصوص نوشن لتنظيف وتنسيق الفقرات والقوائم',
    keywords: 'notion text copy formatter cleaner blocks markdown lists paste arabic english',
    icon: 'file-text',
    iconFile: 'tool-notion.svg',
    accentColor: '#4f46e5',
    bgGradientEnd: '#4338ca',
    mobile: false
  },
  {
    id: 'daily-workout',
    number: '04',
    title: 'DevFit Workout Guide',
    shortTitle: 'DevFit',
    file: 'tools/daily-workout.html',
    filename: 'daily-workout.html',
    category: 'Wellbeing',
    badge: '15-Min Routine',
    description: '15-Minute daily routine with videos and offline timers for developers',
    keywords: 'workout exercise fitness developer stretching health 15 minute devfit تمارين رياضة',
    icon: 'dumbbell',
    iconFile: 'tool-workout.svg',
    accentColor: '#059669',
    bgGradientEnd: '#047857',
    mobile: true,
    manifest: 'manifest-workout.webmanifest'
  },
  {
    id: 'store-localizer',
    number: '05',
    title: 'Store Localizer',
    shortTitle: 'Localizer',
    file: 'tools/store-localizer.html',
    filename: 'store-localizer.html',
    category: 'Productivity',
    badge: 'Listing Editor',
    description: 'Google Play Store listing translation & metadata manager',
    keywords: 'google play store listing localization translate metadata app languages ترجمة متجر',
    icon: 'languages',
    iconFile: 'tool-localizer.svg',
    accentColor: '#0284c7',
    bgGradientEnd: '#0369a1',
    mobile: false
  },
  {
    id: 'tithe-forever',
    number: '06',
    title: 'بادج العشور — Tithe Forever',
    shortTitle: 'العشور',
    file: 'tools/tithe-forever.html',
    filename: 'tithe-forever.html',
    category: 'Finance',
    badge: 'Monthly +1%',
    description: 'حاسبة وتتبع نسبة العشور الشهرية التراكمية وسجل العطاء',
    keywords: 'tithe forever badge عشور زكاة مالية حساب تتبع نسبة مئوية monthly percentage finance charity donation',
    icon: 'badge-percent',
    iconFile: 'tool-tithe.svg',
    accentColor: '#d97706',
    bgGradientEnd: '#b45309',
    lang: 'ar',
    dir: 'rtl',
    mobile: true,
    manifest: 'manifest-tithe.webmanifest'
  },
  {
    id: 'sleep-calculator',
    number: '07',
    title: 'Sleep Cycle Calculator',
    shortTitle: 'Sleep',
    file: 'tools/sleep-calculator.html',
    filename: 'sleep-calculator.html',
    category: 'Wellbeing',
    badge: '90-Min Cycles',
    description: 'Optimal bedtime and wake-up calculator based on 90-minute natural sleep cycles',
    keywords: 'sleep calculator cycles wake up bed time nap rest circadian health نوم استيقاظ دورات النوم',
    icon: 'moon',
    iconFile: 'tool-sleep.svg',
    accentColor: '#6366f1',
    bgGradientEnd: '#4f46e5',
    mobile: true,
    manifest: 'manifest-sleep.webmanifest'
  }
];

export const categories = [
  { id: 'all', label: 'All', count: tools.length },
  { id: 'productivity', label: 'Productivity', count: tools.filter(t => t.category === 'Productivity').length },
  { id: 'wellbeing', label: 'Wellbeing', count: tools.filter(t => t.category === 'Wellbeing').length },
  { id: 'finance', label: 'Finance', count: tools.filter(t => t.category === 'Finance').length },
  { id: 'mobile', label: '📱 Mobile', count: tools.filter(t => t.mobile).length },
];
