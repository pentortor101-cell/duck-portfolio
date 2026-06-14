// ============================================================
//  แก้ข้อมูลของคุณที่ไฟล์นี้ไฟล์เดียว — ทุกอย่างในเว็บจะอัปเดตตาม
// ============================================================

export const profile = {
  name: "ณรงค์เดช เมธาวี",
  nameEn: "Narongdej Methawee",
  title: "Programmer / Application Support",
  tagline: "นักพัฒนาที่ทำได้ทั้ง web, app และดูแลระบบ — ยิงเป็ดเพื่อรู้จักผมให้มากขึ้น",
  bio: [
    "โปรแกรมเมอร์ประสบการณ์กว่า 7 ปี ทำงานมาหลากหลายอุตสาหกรรม",
    "ตั้งแต่บริษัทญี่ปุ่น โลจิสติกส์ ภาครัฐ จนถึงสื่อบันเทิงระดับประเทศ",
    "ถนัดทั้งงานพัฒนาเว็บ/แอป และงาน support ดูแลระบบให้ลูกค้า",
  ],
};

export const skills: { group: string; items: string[] }[] = [
  {
    group: "Programming",
    items: ["C#", "ASP.NET MVC", "Python", "JavaScript", "HTML", "CSS", "XML", "SQL Server"],
  },
  {
    group: "Platforms & Tools",
    items: ["Visual Studio", "Android Studio", "WordPress", "Wix", "Microsoft 365", "Power Automate"],
  },
  {
    group: "AI Tools",
    items: ["ChatGPT", "Claude", "Copilot"],
  },
  {
    group: "Other",
    items: ["Adobe Photoshop", "MS Word / Excel", "การเข้าสาย LAN (cat5/cat6/fiber optic)"],
  },
];

export interface Project {
  title: string;
  period: string;
  description: string;
  stack: string[];
  link?: { label: string; url: string };
}

export const projects: Project[] = [
  {
    title: "Major Cineplex — Application Support",
    period: "เม.ย. 2023 – ปัจจุบัน",
    description:
      "ดูแลและซัพพอร์ตระบบแอปพลิเคชันให้บริษัทสื่อบันเทิงเครือโรงหนังระดับประเทศ",
    stack: ["Application Support", "SQL Server", "System Monitoring"],
  },
  {
    title: "Fujitsu (Thailand) — Programmer",
    period: "ส.ค. 2022 – มี.ค. 2023",
    description:
      "พัฒนาโปรแกรมและเว็บไซต์ในบริษัทบริการเทคโนโลยีครบวงจร",
    stack: ["C#", "ASP.NET", "SQL Server"],
  },
  {
    title: "Digital Contents (Thailand) — Programmer",
    period: "ก.พ. 2019 – ก.ย. 2020",
    description:
      "พัฒนาแอปพลิเคชันโรงงาน, แอปมือถือ และเว็บไซต์ ให้บริษัทสัญชาติญี่ปุ่น",
    stack: ["Android Studio", "Web", "Mobile App"],
  },
  {
    title: "Learning Digital App — Personal Project",
    period: "ผลงานส่วนตัว",
    description:
      "แอปเพื่อการเรียนรู้เรื่องวงจรดิจิทัล จำลองและออกแบบวงจรไฟฟ้าได้ในแอป",
    stack: ["Android Studio", "Education"],
    link: { label: "ดูวิดีโอ", url: "https://www.youtube.com/watch?v=dsJEAONua7k" },
  },
];

export const experience: { company: string; role: string; period: string; note: string }[] = [
  { company: "Major Cineplex", role: "Application Support", period: "2023 – ปัจจุบัน", note: "สื่อบันเทิง / โรงหนัง" },
  { company: "Fujitsu (Thailand)", role: "Programmer", period: "2022 – 2023", note: "บริการเทคโนโลยีครบวงจร" },
  { company: "Similan Technology", role: "Programmer", period: "2022", note: "โลจิสติกส์" },
  { company: "Betimes Solution", role: "Programmer", period: "2021", note: "หน่วยงานภาครัฐ" },
  { company: "Digital Contents (Thailand)", role: "Programmer", period: "2019 – 2020", note: "บริษัทญี่ปุ่น" },
  { company: "E-Stage (Thailand)", role: "Developer", period: "2018", note: "IT สัญชาติญี่ปุ่น" },
];

export const education = {
  school: "มหาวิทยาลัยราชภัฏสวนสุนันทา",
  degree: "ปริญญาตรี — วิศวกรรมคอมพิวเตอร์ (คณะเทคโนโลยีอุตสาหกรรม)",
  period: "2013 – 2017",
};

export const contact = {
  email: "pentortor101@gmail.com",
  phone: "090-981-5582",
  facebook: { label: "ต่อ เมธาวี", url: "https://www.facebook.com/tx.methawi/" },
  line: "torjamaline",
  ig: { label: "tor_mtv", url: "https://instagram.com/tor_mtv" },
};
