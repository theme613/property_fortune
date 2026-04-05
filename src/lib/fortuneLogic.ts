export type ZodiacSign = 
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' 
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' 
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type Language = 'en' | 'zh';

export type Region = 
  | 'any' | 'johor' | 'kelantan' | 'negeri_sembilan' | 'pahang' 
  | 'penang' | 'perak' | 'selangor' | 'terengganu' 
  | 'sabah' | 'sarawak' | 'kuala_lumpur';

export interface UserInput {
  zodiac: ZodiacSign;
  birthDate: string;
  occupation: string;
  preferredArea: Region;
  monthlyIncome: string;
}

export interface FortuneResult {
  fortune: string;
  propertyTitle: string;
  propertyDescription: string;
}

const zodiacTraits = {
  en: {
    Aries: "fiery energy and pioneering spirit",
    Taurus: "love for luxury and grounded nature",
    Gemini: "dual nature and endless curiosity",
    Cancer: "deep intuition and protective instincts",
    Leo: "regal presence and bold creativity",
    Virgo: "meticulous eye for detail and practical magic",
    Libra: "perfect sense of balance and aesthetic harmony",
    Scorpio: "intense aura and transformative power",
    Sagittarius: "boundless wanderlust and philosophical mind",
    Capricorn: "unyielding ambition and structured approach",
    Aquarius: "visionary ideas and rebellious streak",
    Pisces: "mystical dreams and empathetic soul",
  },
  zh: {
    Aries: "热情似火与开拓精神",
    Taurus: "对奢华的热爱与踏实的本性",
    Gemini: "双重性格与无尽的好奇心",
    Cancer: "深刻的直觉与保护欲",
    Leo: "王者风范与大胆的创造力",
    Virgo: "对细节的一丝不苟与实干魔力",
    Libra: "完美的平衡感与审美和谐",
    Scorpio: "强大的气场与变革的力量",
    Sagittarius: "无尽的漫游欲与哲学的头脑",
    Capricorn: "不屈的野心与严谨的作风",
    Aquarius: "远见卓识与叛逆精神",
    Pisces: "神秘的梦想与富有同情心的灵魂",
  }
};

const occupationAdjectives = {
  en: ["ambitious", "innovative", "tireless", "brilliant", "unconventional", "dedicated", "visionary"],
  zh: ["雄心勃勃的", "富有创新的", "不知疲倦的", "才华横溢的", "不落俗套的", "尽职尽责的", "高瞻远瞩的"]
};

// FULL NATIONAL INVENTORY
const propertyTypes = [
  { region: "johor", en: { title: "Axis Tower Causewayz Square @ JBCC", desc: "Located in JBCC, Johor Bahru. These 1-2 bedroom modern suites (RM580k+) align perfectly with your fast-paced energy, offering a highly connected cosmic hub." }, zh: { title: "Axis Tower Causewayz Square @ JBCC", desc: "位于新山JBCC。这座拥有1-2间卧室的现代套房 (RM580k+) 与您快节奏的能量完美契合，为您提供一个高度互联的宇宙枢纽。" } },
  { region: "johor", en: { title: "Causewayz Square @ JBCC TOWER B", desc: "A luxurious 1-3 bedroom sanctuary in Johor Bahru. Spanning up to 850 sqft (RM691k+), this elite tower elevates your daily aura to pure prosperity." }, zh: { title: "Causewayz Square @ JBCC TOWER B", desc: "位于新山的一处豪华1-3卧高尚圣地 (RM691k+)。这座高达850平方英尺的精英大楼将您日常的气场提升至纯粹的繁华。" } },
  { region: "kelantan", en: { title: "Erinaz Suites @ Kubang Kerian", desc: "A tranquil 1-2 bedroom enclave in Kota Bharu. From RM379k, the stars reveal this to be a peaceful and stabilizing investment for your energetic soul." }, zh: { title: "Erinaz Suites @ Kubang Kerian", desc: "位于哥打巴鲁的宁静1-2卧静居。仅从RM379k起，星象显示这将是您充满活力的灵魂的一个和平而稳定的投资。" } },
  { region: "kelantan", en: { title: "Gading Hikmat", desc: "Rooted near Pantai Cinta Berahi, Kelantan. This accessible 3-bedroom home (RM195k+) offers harmonious grounding near beautiful coastal energies." }, zh: { title: "Gading Hikmat", desc: "坐落于吉兰丹Pantai Cinta Berahi附近。这座高性价比的3居室住宅(RM195k+)在迷人的海岸能量旁提供了和谐的安定感。" } },
  { region: "negeri_sembilan", en: { title: "Saga 22 @ Taman Saga, Seremban", desc: "An expansive 4-bedroom domain inside Seremban (RM588k+). Stretching up to 2,401 sqft, this space naturally accommodates your massive cosmic ambitions." }, zh: { title: "Saga 22 @ Taman Saga, 芙蓉", desc: "位于芙蓉市内的宽敞4卧领地(RM588k+)。面积高达2,401平方英尺，这个宽阔的空间自然能容纳您庞大的宇宙野心。" } },
  { region: "negeri_sembilan", en: { title: "Shang Garden", desc: "A sprawling masterpiece in Taman Bukit Sarimban (RM781k+). At over 3,000 sqft, the stars have reserved this magnificent 4-bedroom estate for your ultimate dynasty." }, zh: { title: "Shang Garden", desc: "位于Taman Bukit Sarimban的庞大杰作(RM781k+)。超过3000平方英尺的壮丽4卧室庄园，是群星为您终极家族所预留的。" } },
  { region: "pahang", en: { title: "PJ Residence @ Kuantan", desc: "A 3-4 bedroom haven in Kampung Padang, Kuantan. An incredibly wise investment (RM331k+) that balances your aura with natural tranquility." }, zh: { title: "PJ Residence @ 关丹", desc: "位于关丹Kampung Padang的3-4卧室避风港。极其明智的投资选择(RM331k+)，完美平衡您的气场与自然的宁静。" } },
  { region: "pahang", en: { title: "Perkampungan Pandan Indah", desc: "A smart 3-bedroom opportunity near Jalan Kuantan By Pass (RM255k+). The perfect energetic springboard to build your generational wealth." }, zh: { title: "Perkampungan Pandan Indah", desc: "靠近Jalan Kuantan By Pass的超值3居室机遇(RM255k+)。它是您积累世代财富的完美能量跳板。" } },
  { region: "penang", en: { title: "KEEPERZ SUITES @ PENANG", desc: "Positioned in Georgetown (RM820k+). A highly prestigious 1-2 bedroom suite that matches the historical and cultural depth of your astrological chart." }, zh: { title: "KEEPERZ SUITES @ 槟城", desc: "雄踞乔治市(RM820k+)。这套极具盛名的1-2卧套房与您星盘中历史和文化底蕴的深度完美匹配。" } },
  { region: "penang", en: { title: "Lighthaus @ The Light", desc: "An illuminating 2-3 bedroom property in Georgetown (RM864k+). Your destiny shines brightest when aligned with this iconic coastal development." }, zh: { title: "Lighthaus @ The Light", desc: "位于乔治市的光明之所，拥有2-3间卧室(RM864k+)。当与这个标志性的沿海开发项目结盟时，您的命运将闪耀出最耀眼的光芒。" } },
  { region: "perak", en: { title: "Goshen @ Ipoh Premier City", desc: "A grand 3-6 bedroom statement in Ipoh (up to RM1.85m). For those who demand the pinnacle; a massive estate destined for your overwhelming success." }, zh: { title: "Goshen @ Ipoh Premier City", desc: "位于怡保的壮观3-6居室豪宅(最高RM1.85m)。专为追求极致的人所准备；这座庞大的庄园注定将见证您惊人的成功。" } },
  { region: "perak", en: { title: "JIA @ Ipoh South", desc: "A serene, 1,540+ sqft sanctuary featuring 4 bedrooms (RM538k+). Harmony and family prosperity are firmly written into the blueprints of this Ipoh South home." }, zh: { title: "JIA @ Ipoh South", desc: "宁静的1,540+平方英尺的避难所，拥有4间卧室(RM538k+)。和谐与家庭的繁荣被牢牢地写在怡保南部这个家庭的蓝图上。" } },
  { region: "selangor", en: { title: "D’EVIA RESIDENCES @ KWASA DAMANSARA", desc: "A beautiful 2-4 bedroom residence safely nestled in Shah Alam (RM498k+). The cosmos has identified this flowing spatial layout as your ultimate comfort zone." }, zh: { title: "D’EVIA RESIDENCES @ KWASA DAMANSARA", desc: "安全坐落于莎阿南的绝美2-4卧住宅(RM498k+)。宇宙认定这种流畅的空间布局将是您最终极的舒适区。" } },
  { region: "selangor", en: { title: "D'Nuri Residences @ Kwasa Damansara", desc: "An intuitive 2-bedroom space (RM270k) in Shah Alam. The stars applaud your financial efficiency; this is an incredibly bright starting point." }, zh: { title: "D'Nuri Residences @ Kwasa Damansara", desc: "位于莎阿南的直观双卧室空间(RM270k)。星辰为您高效的財務管理喝彩；这是一个无比闪耀的起点。" } },
  { region: "terengganu", en: { title: "Qubaz Suites @ Kuala Terengganu", desc: "A coastal 1-3 bedroom suite (RM473k). A beautiful alignment with ocean tides; this Terengganu haven perfectamente balances your work and relaxation." }, zh: { title: "Qubaz Suites @ 瓜拉登嘉楼", desc: "全景海岸线的1-3卧室套房(RM473k)。与海洋潮汐完美契合；这座登嘉楼的避风港能完美地平衡您的工作与放松。" } },
  { region: "sabah", en: { title: "The Bedrock - Kota Kinabalu", desc: "A firm foundation on Jalan Jesselton (RM532k+). Your astrological chart shows tremendous wealth-building potential in this 1-2 bedroom Kota Kinabalu suite." }, zh: { title: "The Bedrock - 亚庇", desc: "扎根于Jalan Jesselton的坚实基础(RM532k+)。您的星盘显示，在这套1-2居室的亚庇套房中，您拥有惊人的财富积累潜力。" } },
  { region: "sabah", en: { title: "Residensi Bayu Damai", desc: "A breezy 2-4 bedroom life away from the chaos in Kota Kinabalu (RM509k+). Wind and water elements perfectly converge to bring you fortune here." }, zh: { title: "Residensi Bayu Damai", desc: "远离亚庇喧嚣、微风拂面的2-4居室生活(RM509k+)。风水元素完美交汇，将为您在这里带来滚滚财气。" } },
  { region: "sarawak", en: { title: "Forest Hill @ Sungai Maong", desc: "A majestic 3-bedroom woodland property in Kuching (RM593k). Grounding earth energy surrounds you, fostering immense long-term growth and stability." }, zh: { title: "Forest Hill @ Sungai Maong", desc: "位于古晋宏伟的3卧室林地房产(RM593k)。您将被接地气的大地能量所环绕，从而孕育出巨大的长期增长和稳定。" } },
  { region: "sarawak", en: { title: "Saradise Kuching", desc: "The absolute zenith of commercial estates (up to RM5.42m). Reserved exclusively for a visionary aura ready to conquer Kuching's highest economic peaks." }, zh: { title: "Saradise Kuching", desc: "商业地产的绝对顶峰(最高可达RM5.42m)。专为准备征服古晋最高经济巅峰、极具远见的领袖气场独家保留。" } },
  { region: "kuala_lumpur", en: { title: "Livista Bandar Sri Damansara", desc: "Elevated living in Kuala Lumpur (RM515k+). Your celestial path intersects perfectly with this modern 2-3 bedroom realm." }, zh: { title: "Livista Bandar Sri Damansara", desc: "吉隆坡的高耸居住体验(RM515k+)。您的星轨与这处现代的2-3间卧室的领域完美交织。" } },
  { region: "kuala_lumpur", en: { title: "Golden Crown Residence @ TRX", desc: "The pinnacle of abundance in Bukit Bintang, KL (up to RM3m). For the royal aura—a luxurious haven perfectly matching your majestic ambitions." }, zh: { title: "Golden Crown Residence @ TRX", desc: "吉隆坡武吉免登的丰盛之巅(最高达RM3m)。专为您高贵的王者气场打造——这处豪华的避风港完美匹配您宏伟的野心。" } }
];

export function getMatchedProperty(input: UserInput, lang: Language = 'en') {
  let filteredProps = propertyTypes;
  if (input.preferredArea !== 'any') {
    filteredProps = propertyTypes.filter(p => p.region === input.preferredArea);
  }
  
  if (filteredProps.length === 0) {
    filteredProps = propertyTypes;
  }

  const combinedString = `${input.zodiac}-${input.birthDate}-${input.occupation.toLowerCase()}`;
  let hash = 0;
  for (let i = 0; i < combinedString.length; i++) {
    hash = combinedString.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const absHash = Math.abs(hash);
  const propertyIndex = absHash % filteredProps.length;
  
  return filteredProps[propertyIndex][lang];
}

export function generateHardcodedFortuneText(input: UserInput, lang: Language = 'en'): string {
  const combinedString = `${input.zodiac}-${input.birthDate}-${input.occupation.toLowerCase()}`;
  let hash = 0;
  for (let i = 0; i < combinedString.length; i++) {
    hash = combinedString.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const absHash = Math.abs(hash);
  const adjIndex = absHash % occupationAdjectives.en.length;
  
  const adj = occupationAdjectives[lang][adjIndex];
  const trait = zodiacTraits[lang][input.zodiac];
  
  const zodiacMap: Record<string, string> = {
    Aries: '白羊座', Taurus: '金牛座', Gemini: '双子座', Cancer: '巨蟹座',
    Leo: '狮子座', Virgo: '处女座', Libra: '天秤座', Scorpio: '天蝎座',
    Sagittarius: '射手座', Capricorn: '摩羯座', Aquarius: '水瓶座', Pisces: '双鱼座'
  };

  const zodiacName = lang === 'zh' ? zodiacMap[input.zodiac] : input.zodiac;
  
  if (lang === 'zh') {
    return `群星排列就绪！身为${zodiacName}，您${trait}恰好完美契合您作为一名${adj}${input.occupation}的发展轨迹。根据您的出生日期（${input.birthDate}），宇宙已为您运算出最理想的投资标的。`;
  } else {
    return `The stars have aligned! As a ${input.zodiac}, your ${trait} perfectly complements your path as an ${adj} ${input.occupation}. The universe has calculated your optimal living environment based on your birth date (${input.birthDate}).`;
  }
}
