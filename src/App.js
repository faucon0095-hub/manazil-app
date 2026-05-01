/* eslint-disable */
import { useState, useEffect, useCallback } from "react";

// ─── 3 Thèmes ─────────────────────────────────────────────────────────────
const THEMES = {
  night: {
    name: "🌙 Nuit", root: "radial-gradient(ellipse at 50% 0%, #1c1860 0%, #07061a 55%)",
    header: "linear-gradient(180deg,#1B1464dd 0%,transparent 100%)", headerBorder: "#C9A84C33",
    tabsBg: "#10102e", tabBorder: "#C9A84C22", accent: "#C9A84C", accentSoft: "#e8c97a",
    textLight: "#e8dfc8", textMuted: "#7a7090", cardBg: "linear-gradient(160deg,#1B1464bb 0%,#0c0b25 100%)",
    cardBorder: "#C9A84C55", phaseBg: "linear-gradient(135deg,#10102e 0%,#1B146488 100%)", phaseBorder: "#C9A84C33",
    rowBg: "#10102e88", rowBorder: "#C9A84C22", rowActiveBg: "#1B1464aa", rowActiveBorder: "#C9A84C77",
    footerBg: "#07061af0", sysBtnBorder: "#C9A84C22", sysBtnActiveBg: "#C9A84C18", sysBtnActiveBorder: "#C9A84C99",
    inputColor: "dark", starsBg: true, ayaBg: "#0a0825", ayaBorder: "#C9A84C22",
    listActiveBg: "#1B1464cc", listActiveShadow: "#C9A84C22", deepBlue: "#07061a",
  },
  white: {
    name: "☀ Blanc", root: "linear-gradient(180deg, #f8f9fc 0%, #e8eaf0 100%)",
    header: "linear-gradient(180deg,#ffffffee 0%,transparent 100%)", headerBorder: "#9090b022",
    tabsBg: "#ffffff", tabBorder: "#9090b022", accent: "#5c6bc0", accentSoft: "#3949ab",
    textLight: "#1a1a2e", textMuted: "#6b6b8a", cardBg: "linear-gradient(160deg,#ffffff 0%,#f0f2fa 100%)",
    cardBorder: "#9090b044", phaseBg: "linear-gradient(135deg,#ffffff 0%,#e8eaf0 100%)", phaseBorder: "#9090b033",
    rowBg: "#ffffffcc", rowBorder: "#9090b022", rowActiveBg: "#e8eaf0", rowActiveBorder: "#5c6bc066",
    footerBg: "#f8f9fcf0", sysBtnBorder: "#9090b033", sysBtnActiveBg: "#5c6bc018", sysBtnActiveBorder: "#5c6bc099",
    inputColor: "light", starsBg: false, ayaBg: "#f0f2fa", ayaBorder: "#9090b022",
    listActiveBg: "#e8eaf0", listActiveShadow: "#5c6bc022", deepBlue: "#f8f9fc",
  },
  nature: {
    name: "🌿 Nature", root: "radial-gradient(ellipse at 50% 0%, #0d2b1a 0%, #070f08 55%)",
    header: "linear-gradient(180deg,#0d2b1add 0%,transparent 100%)", headerBorder: "#2e7d3233",
    tabsBg: "#0a1f0c", tabBorder: "#2e7d3222", accent: "#43a047", accentSoft: "#81c784",
    textLight: "#e8f5e9", textMuted: "#558b5a", cardBg: "linear-gradient(160deg,#0d2b1abb 0%,#050e06 100%)",
    cardBorder: "#2e7d3255", phaseBg: "linear-gradient(135deg,#0a1f0c 0%,#0d2b1a88 100%)", phaseBorder: "#2e7d3233",
    rowBg: "#0a1f0c88", rowBorder: "#2e7d3222", rowActiveBg: "#0d2b1aaa", rowActiveBorder: "#43a04777",
    footerBg: "#070f08f0", sysBtnBorder: "#2e7d3222", sysBtnActiveBg: "#43a04718", sysBtnActiveBorder: "#43a04799",
    inputColor: "dark", starsBg: true, ayaBg: "#050e06", ayaBorder: "#2e7d3222",
    listActiveBg: "#0d2b1acc", listActiveShadow: "#43a04722", deepBlue: "#070f08",
  },
};

// ─── Signes du zodiaque ───────────────────────────────────────────────────
const SIGNES = [
  { fr: "Bélier", ar: "الحَمَل", emoji: "♈" },
  { fr: "Taureau", ar: "الثَّوْر", emoji: "♉" },
  { fr: "Gémeaux", ar: "الجَوْزَاء", emoji: "♊" },
  { fr: "Cancer", ar: "السَّرَطَان", emoji: "♋" },
  { fr: "Lion", ar: "الأَسَد", emoji: "♌" },
  { fr: "Vierge", ar: "السُّنْبُلَة", emoji: "♍" },
  { fr: "Balance", ar: "المِيزَان", emoji: "♎" },
  { fr: "Scorpion", ar: "العَقْرَب", emoji: "♏" },
  { fr: "Sagittaire", ar: "القَوْس", emoji: "♐" },
  { fr: "Capricorne", ar: "الجَدْي", emoji: "♑" },
  { fr: "Verseau", ar: "الدَّلْو", emoji: "♒" },
  { fr: "Poissons", ar: "الحُوت", emoji: "♓" },
];

function getSigneFromLon(lon) {
  const idx = Math.floor(lon / 30) % 12;
  const deg = lon % 30;
  const min = Math.floor((deg % 1) * 60);
  return { signe: SIGNES[idx], deg: Math.floor(deg), min };
}

// ─── Données des 28 Manāzil ───────────────────────────────────────────────
const MANAZIL = [
  { num:1,  ar:"الشَّرَطَيْن",        fr:"An-Naṭḥ",             stars:"α β Ari",         lon:0,       nature:"Bénéfique",      description:"Premier manzil, énergie et commencement. Favorable aux débuts et nouveaux projets.", favorables:["Voyages et déplacements","Commerce et affaires","Mariage et unions","Construire et bâtir"], defavorables:["Emprunts et dettes","Opérations chirurgicales","Semailles tardives"] },
  { num:2,  ar:"البَطَيْن",           fr:"Al-Buṭayn",            stars:"ε δ ρ Ari",        lon:12.857,  nature:"Neutre",         description:"Manzil de l'intérieur et du caché. Propice aux affaires discrètes et à l'agriculture.", favorables:["Enfouissement de trésors","Achat de bétail","Agriculture et semailles","Affaires secrètes"], defavorables:["Voyages en mer","Associations commerciales","Mariage"] },
  { num:3,  ar:"الثُّرَيَّا",         fr:"Ath-Thurayya",         stars:"Pléiades",         lon:25.714,  nature:"Bénéfique",      description:"Les Pléiades, étoile de prospérité. Excellent pour les voyages maritimes et le commerce.", favorables:["Navigation et voyages en mer","Commerce de parfums","Demandes aux rois","Chasse et pêche"], defavorables:["Mariage","Partenariats","Dettes"] },
  { num:4,  ar:"الدَّبَرَان",         fr:"Ad-Dabarān",           stars:"α Tau",            lon:38.571,  nature:"Maléfique",      description:"Manzil difficile selon les anciens. Éviter les voyages et les nouveaux engagements.", favorables:["Construction de bâtiments","Plantation d'arbres","Chasse"], defavorables:["Voyages","Mariage","Commerce","Associations"] },
  { num:5,  ar:"الهَقْعَة",           fr:"Al-Haq'a",             stars:"λ φ¹ Ori",         lon:51.429,  nature:"Bénéfique",      description:"Favorable à la libération et à la guérison. Bon pour les constructions.", favorables:["Libération de prisonniers","Guérison des malades","Nouvelles constructions"], defavorables:["Voyages par voie terrestre","Semailles"] },
  { num:6,  ar:"الهَنْعَة",           fr:"Al-Han'a",             stars:"γ ξ Gem",          lon:64.286,  nature:"Maléfique",      description:"Manzil des contraintes. Utile pour les travaux souterrains, défavorable aux unions.", favorables:["Creuser puits et canaux","Capturer ennemis","Emprisonner"], defavorables:["Mariage","Voyages","Commerce"] },
  { num:7,  ar:"الذِّرَاع",           fr:"Adh-Dhirā'",           stars:"α β Gem",          lon:77.143,  nature:"Très bénéfique", description:"L'un des manzils les plus favorables. Excellent pour presque toutes les activités.", favorables:["Commerce et gains","Mariage","Agriculture","Voyages","Amitié et réconciliation"], defavorables:["Guerres et conflits"] },
  { num:8,  ar:"النَّثْرَة",          fr:"An-Nathra",            stars:"ε Cnc / M44",      lon:90,      nature:"Bénéfique",      description:"Manzil de générosité et d'amour. Favorable aux relations humaines et au commerce.", favorables:["Achat de biens","Commerce","Amour et amitié","Libéralité"], defavorables:["Dettes","Voyages en mer"] },
  { num:9,  ar:"الطَّرْف",            fr:"Aṭ-Ṭarf",             stars:"κ λ Leo",          lon:102.857, nature:"Maléfique",      description:"Manzil défavorable. Éviter tout nouveau commencement important.", favorables:["Rien de particulier recommandé"], defavorables:["Commerce","Voyages","Mariage","Toute nouvelle entreprise"] },
  { num:10, ar:"الجَبْهَة",           fr:"Al-Jabha",             stars:"ζ γ η α Leo",      lon:115.714, nature:"Très bénéfique", description:"Front du Lion — manzil de force et d'autorité. Excellent pour les actions décisives.", favorables:["Commerce","Voyages","Mariage","Construction","Agriculture"], defavorables:["Emprunts","Partenariats risqués"] },
  { num:11, ar:"الزُّبْرَة",          fr:"Az-Zubra",             stars:"δ θ Leo",          lon:128.571, nature:"Neutre",         description:"Crinière du Lion. Bon pour les voyages et le commerce textile.", favorables:["Voyages","Commerce de vêtements","Libération de prisonniers"], defavorables:["Mariage","Partenariats","Construction"] },
  { num:12, ar:"الصَّرْفَة",          fr:"Aṣ-Ṣarfa",            stars:"β Leo",            lon:141.429, nature:"Neutre",         description:"Transition du Lion à la Vierge. Favorable au commerce terrestre et à l'agriculture.", favorables:["Commerce","Agriculture","Élevage"], defavorables:["Voyages en mer","Mariage","Nouvelles constructions"] },
  { num:13, ar:"العَوَّاء",           fr:"Al-'Awwā'",            stars:"β η γ Vir",        lon:154.286, nature:"Bénéfique",      description:"Favorable aux affaires terrestres et aux démarches officielles.", favorables:["Commerce","Agriculture","Voyages terrestres","Demandes aux autorités"], defavorables:["Voyages en mer","Mariage"] },
  { num:14, ar:"السِّمَاك",           fr:"As-Simāk",             stars:"α Vir (Spica)",    lon:167.143, nature:"Très bénéfique", description:"Spica — l'un des plus favorables. Béni pour presque tout.", favorables:["Commerce","Mariage","Agriculture","Voyage","Toute bonne action"], defavorables:["Conflits","Guerres"] },
  { num:15, ar:"الغَفْر",             fr:"Al-Ghafr",             stars:"ι κ λ Vir",        lon:180,     nature:"Neutre",         description:"Le Pardon — manzil du secret. Propice aux affaires cachées et discrètes.", favorables:["Enfouir trésors","Commerce discret","Affaires secrètes"], defavorables:["Mariage","Voyages","Partenariats publics"] },
  { num:16, ar:"الزُّبَانَى",         fr:"Az-Zubānā",            stars:"α β Lib",          lon:192.857, nature:"Maléfique",      description:"Pinces du Scorpion — manzil difficile. Éviter les engagements importants.", favorables:["Rien de recommandé"], defavorables:["Voyages","Commerce","Mariage","Toute entreprise importante"] },
  { num:17, ar:"الإِكْلِيل",          fr:"Al-Iklīl",             stars:"β δ π Sco",        lon:205.714, nature:"Bénéfique",      description:"Couronne du Scorpion. Favorable aux voyages et aux nouvelles entreprises.", favorables:["Voyages","Commerce","Mariage","Construction"], defavorables:["Conflits judiciaires","Dettes"] },
  { num:18, ar:"القَلْب",             fr:"Al-Qalb",              stars:"α Sco (Antarès)",  lon:218.571, nature:"Maléfique",      description:"Cœur du Scorpion — Antarès. Puissant mais dangereux pour les affaires ordinaires.", favorables:["Construction de forteresses","Chasse","Capturer ennemis"], defavorables:["Mariage","Partenariats","Commerce","Voyages"] },
  { num:19, ar:"الشَّوْلَة",          fr:"Ash-Shawla",           stars:"λ υ Sco",          lon:231.429, nature:"Maléfique",      description:"Queue du Scorpion. Manzil de force animale. Difficile pour les affaires humaines.", favorables:["Dompter animaux","Capturer gibier","Magie défensive"], defavorables:["Mariage","Commerce","Voyages","Construction"] },
  { num:20, ar:"النَّعَائِم",         fr:"An-Na'ā'im",           stars:"γ δ ε η Sgr",      lon:244.286, nature:"Neutre",         description:"Les Autruches. Favorable à l'élevage et aux activités rurales.", favorables:["Élevage et soin des animaux","Agriculture","Voyages terrestres"], defavorables:["Mariage","Construction","Commerce en mer"] },
  { num:21, ar:"البَلْدَة",           fr:"Al-Balda",             stars:"φ Sgr (vide)",     lon:257.143, nature:"Maléfique",      description:"La Ville vide — espace sans étoiles. Manzil de contrainte et d'isolement.", favorables:["Capturer fugitifs","Emprisonner","Contraindre"], defavorables:["Commerce","Mariage","Voyages","Toute activité positive"] },
  { num:22, ar:"سَعْد الذَّابِح",     fr:"Sa'd adh-Dhābiḥ",     stars:"α β Cap",          lon:270,     nature:"Bénéfique",      description:"Chance du Sacrificateur. Début des Sa'ūd — série de manzils fortunés.", favorables:["Mariage","Commerce","Agriculture","Élevage","Libération"], defavorables:["Conflits","Guerres"] },
  { num:23, ar:"سَعْد بُلَع",         fr:"Sa'd Bula'",           stars:"ν μ Cap",          lon:282.857, nature:"Bénéfique",      description:"Chance du Dévoreur. Excellent pour la guérison et la construction.", favorables:["Commerce","Mariage","Agriculture","Construction","Guérison"], defavorables:["Voyages en mer","Conflits"] },
  { num:24, ar:"سَعْد السُّعُود",     fr:"Sa'd as-Su'ūd",        stars:"β Aqr",            lon:295.714, nature:"Très bénéfique", description:"Chance des Chances — le plus fortuné des Sa'ūd. Béni pour toutes les bonnes actions.", favorables:["Mariage","Commerce","Agriculture","Réconciliation","Libération"], defavorables:["Conflits","Séparations"] },
  { num:25, ar:"سَعْد الأَخْبِيَة",  fr:"Sa'd al-Akhbiya",      stars:"γ π η ζ Aqr",      lon:308.571, nature:"Neutre",         description:"Chance des Tentes. Favorable aux activités rurales et à la plantation.", favorables:["Plantation","Agriculture","Élevage","Voyages terrestres"], defavorables:["Commerce en mer","Mariage","Construction"] },
  { num:26, ar:"الفَرْغ المُقَدَّم",  fr:"Al-Fargh al-Muqaddam", stars:"α β Peg",          lon:321.429, nature:"Neutre",         description:"Première Ouverture. Favorable aux constructions et aux voyages.", favorables:["Construction","Creuser puits","Voyages","Commerce"], defavorables:["Mariage","Partenariats"] },
  { num:27, ar:"الفَرْغ المُؤَخَّر",  fr:"Al-Fargh al-Mu'akhkhar", stars:"γ Peg / α And",  lon:334.286, nature:"Très bénéfique", description:"Deuxième Ouverture — très favorable. Béni pour le mariage et le commerce.", favorables:["Mariage","Commerce","Agriculture","Voyages","Toute bonne action"], defavorables:["Conflits","Dettes"] },
  { num:28, ar:"بَطْن الحُوت",        fr:"Baṭn al-Ḥūt",         stars:"β And",            lon:347.143, nature:"Bénéfique",      description:"Ventre du Poisson — dernier manzil. Favorable au commerce et aux voyages maritimes.", favorables:["Commerce","Mariage","Agriculture","Voyages en mer"], defavorables:["Construction durable","Engagements à long terme"] },
];

const NATURE_COLORS = {
  "Très bénéfique": "#4ecf8a", "Bénéfique": "#C9A84C", "Neutre": "#8a9fc4", "Maléfique": "#e07a5f",
};

const MANZIL_SIZE = 360 / 28;
function toRad(d) { return d * Math.PI / 180; }
function mod360(x) { return ((x % 360) + 360) % 360; }

function julianDay(date) {
  const Y=date.getUTCFullYear(), M=date.getUTCMonth()+1;
  const D=date.getUTCDate()+(date.getUTCHours()+date.getUTCMinutes()/60+date.getUTCSeconds()/3600)/24;
  let y=Y, m=M;
  if(m<=2){y-=1;m+=12;}
  const A=Math.floor(y/100), B=2-A+Math.floor(A/4);
  return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+D+B-1524.5;
}

function moonLongitudeTropical(jd) {
  const T=(jd-2451545.0)/36525;
  let Lp=mod360(218.3164477+481267.88123421*T-0.0015786*T*T);
  let M=mod360(357.5291092+35999.0502909*T-0.0001536*T*T);
  let Mp=mod360(134.9633964+477198.8675055*T+0.0087414*T*T);
  let F=mod360(93.2720950+483202.0175233*T-0.0036539*T*T);
  let D=mod360(297.8501921+445267.1114034*T-0.0018819*T*T);
  M=toRad(M);Mp=toRad(Mp);F=toRad(F);D=toRad(D);
  return mod360(Lp+6.288774*Math.sin(Mp)+1.274027*Math.sin(2*D-Mp)+0.658314*Math.sin(2*D)+0.213618*Math.sin(2*Mp)-0.185116*Math.sin(M)-0.114332*Math.sin(2*F)+0.058793*Math.sin(2*D-2*Mp)+0.057066*Math.sin(2*D-M-Mp)+0.053322*Math.sin(2*D+Mp)+0.045758*Math.sin(2*D-M)-0.040923*Math.sin(M-Mp)-0.034720*Math.sin(D)-0.030383*Math.sin(M+Mp)+0.015327*Math.sin(2*D-2*F)-0.012528*Math.sin(Mp+2*F)+0.010980*Math.sin(Mp-2*F));
}

function lahiriAyanamsa(jd) { const T=(jd-2451545.0)/36525; return 23.85+50.3*T/3600; }
function moonLongitudeSidereal(jd) { return mod360(moonLongitudeTropical(jd)-lahiriAyanamsa(jd)); }
function getManzilIndex(lon) { return Math.floor(lon/MANZIL_SIZE)%28; }

function findTransitTime(date, targetIdx, direction, getLon) {
  const step=direction*15*60*1000; let current=new Date(date);
  for(let i=0;i<200;i++){
    current=new Date(current.getTime()+step);
    if(getManzilIndex(getLon(julianDay(current)))!==targetIdx){
      let a=new Date(current.getTime()-step),b=current;
      for(let j=0;j<10;j++){const mid=new Date((a.getTime()+b.getTime())/2);getManzilIndex(getLon(julianDay(mid)))===targetIdx?(a=mid):(b=mid);}
      return direction===1?b:a;
    }
  }
  return null;
}

function computeMoonData(date, system) {
  const getLon=system==="sidereal"?moonLongitudeSidereal:moonLongitudeTropical;
  const jd=julianDay(date);
  const lon=getLon(jd);
  const lonTrop=moonLongitudeTropical(jd);
  const lonSid=moonLongitudeSidereal(jd);
  const aya=lahiriAyanamsa(jd);
  const manzilIdx=getManzilIndex(lon);
  const manzil=MANAZIL[manzilIdx];
  const progress=Math.min(99.9,(mod360(lon-manzil.lon)/MANZIL_SIZE)*100);
  const signeTrop=getSigneFromLon(lonTrop);
  const signeSid=getSigneFromLon(lonSid);
  return {
    lon:lon.toFixed(2), lonTrop:lonTrop.toFixed(2), lonSid:lonSid.toFixed(2), aya:aya.toFixed(2),
    manzilIdx, manzil, progress:progress.toFixed(1),
    entryTime:findTransitTime(date,manzilIdx,-1,getLon),
    exitTime:findTransitTime(date,manzilIdx,1,getLon),
    signeTrop, signeSid,
  };
}

function moonPhase(date) {
  const phase=(((date-new Date("2000-01-06T18:14:00Z"))/(1000*60*60*24))%29.53058867+29.53058867)%29.53058867;
  if(phase<1.85) return{name:"Nouvelle Lune",emoji:"🌑"};
  if(phase<7.38) return{name:"Premier Croissant",emoji:"🌒"};
  if(phase<9.22) return{name:"Premier Quartier",emoji:"🌓"};
  if(phase<14.76) return{name:"Gibbeuse Croissante",emoji:"🌔"};
  if(phase<16.61) return{name:"Pleine Lune",emoji:"🌕"};
  if(phase<22.15) return{name:"Gibbeuse Décroissante",emoji:"🌖"};
  if(phase<23.99) return{name:"Dernier Quartier",emoji:"🌗"};
  return{name:"Dernier Croissant",emoji:"🌘"};
}

function formatTime(d){if(!d)return"—";return d.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});}
function formatDate(d){if(!d)return"—";return d.toLocaleDateString("fr-FR",{day:"2-digit",month:"short"});}

// ─── Pub Livre ────────────────────────────────────────────────────────────
function BookAd({ t }) {
  const wa = "https://wa.me/221764265550";
  return (
    <div style={{background:`linear-gradient(135deg,#1a0a00 0%,#2d1500 50%,#1a0a00 100%)`, border:`2px solid #C9A84C`, borderRadius:16, padding:16, marginBottom:12, position:"relative", overflow:"hidden"}}>
      {/* Déco */}
      <div style={{position:"absolute",top:-20,right:-20,width:100,height:100,background:"radial-gradient(circle,#C9A84C22,transparent)",borderRadius:"50%"}}/>
      <div style={{position:"absolute",bottom:-20,left:-20,width:80,height:80,background:"radial-gradient(circle,#C9A84C15,transparent)",borderRadius:"50%"}}/>

      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
        <span style={{fontSize:9,background:"#C9A84C",color:"#1a0a00",borderRadius:20,padding:"2px 8px",fontWeight:"bold",letterSpacing:1}}>📚 NOUVEAU LIVRE</span>
        <span style={{fontSize:9,color:"#C9A84C88",letterSpacing:1}}>Sen-Astro</span>
      </div>

      <div style={{textAlign:"center",marginBottom:12}}>
        <div style={{fontSize:18,color:"#e8c97a",fontWeight:"bold",letterSpacing:2,marginBottom:2}}>LES MANÂZIL AL-QAMAR</div>
        <div style={{fontSize:11,color:"#C9A84C88",direction:"rtl",marginBottom:4}}>مَنَازِل القَمَر</div>
        <div style={{fontSize:10,color:"#c0a060",marginBottom:8}}>Les 28 Demeures Lunaires</div>

        {/* 2 versions */}
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          {[["🇫🇷","Français","VERSION FRANÇAIS"],["🌍","Wolof","VERSION WOLOF"]].map(([flag,lang,label])=>(
            <div key={lang} style={{flex:1,background:"#ffffff11",border:"1px solid #C9A84C44",borderRadius:10,padding:"8px 6px",textAlign:"center"}}>
              <div style={{fontSize:16,marginBottom:3}}>{flag}</div>
              <div style={{fontSize:9,color:"#C9A84C",fontWeight:"bold",letterSpacing:1,marginBottom:6}}>{label}</div>
              <div style={{fontSize:10,color:"#e8c97a",marginBottom:1}}>📖 Livre</div>
              <div style={{fontSize:13,color:"#e8c97a",fontWeight:"bold",marginBottom:4}}>15.000 F</div>
              <div style={{fontSize:10,color:"#e8c97a",marginBottom:1}}>📱 Ebook</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                <div style={{fontSize:13,color:"#e8c97a",fontWeight:"bold"}}>6.900 F</div>
                <div style={{fontSize:9,background:"#2ecc71",color:"white",borderRadius:10,padding:"1px 5px"}}>-50%</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{fontSize:9,color:"#C9A84C88",marginBottom:8}}>Boutique <span style={{color:"#e8c97a",fontWeight:"bold"}}>Chariow</span></div>
      </div>

      {/* Bouton WhatsApp */}
      <a href={wa} target="_blank" rel="noopener noreferrer"
        style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"#25D366",borderRadius:10,padding:"11px",textDecoration:"none",color:"white",fontSize:13,fontWeight:"bold",letterSpacing:0.5}}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Commander sur WhatsApp
      </a>
      <div style={{textAlign:"center",fontSize:10,color:"#C9A84C88",marginTop:6}}>+221 76 426 55 50</div>
    </div>
  );
}

// ─── Position Lunaire (Signe + Manzil) ───────────────────────────────────
function MoonPosition({ moonData, system, t }) {
  const signe = system === "sidereal" ? moonData.signeSid : moonData.signeTrop;
  return (
    <div style={{background:t.cardBg, border:`1px solid ${t.accent}44`, borderRadius:14, padding:"14px 16px", marginBottom:10}}>
      <div style={{fontSize:10, color:t.textMuted, letterSpacing:2, marginBottom:10, textAlign:"center"}}>🌙 POSITION DE LA LUNE</div>
      <div style={{display:"flex", gap:10}}>
        {/* Signe */}
        <div style={{flex:1, background:`${t.accent}11`, border:`1px solid ${t.accent}33`, borderRadius:12, padding:"10px 8px", textAlign:"center"}}>
          <div style={{fontSize:24, marginBottom:4}}>{signe.signe.emoji}</div>
          <div style={{fontSize:16, fontWeight:"bold", color:t.accentSoft, marginBottom:2}}>{signe.signe.fr}</div>
          <div style={{fontSize:12, color:t.textMuted, direction:"rtl", marginBottom:6}}>{signe.signe.ar}</div>
          <div style={{fontSize:18, color:t.accent, fontWeight:"bold"}}>
            {signe.deg}° {signe.min}'
          </div>
          <div style={{fontSize:9, color:t.textMuted, marginTop:2}}>
            {system==="sidereal"?"Sidéral":"Tropical"}
          </div>
        </div>
        {/* Manzil */}
        <div style={{flex:1, background:`${t.accent}11`, border:`1px solid ${t.accent}33`, borderRadius:12, padding:"10px 8px", textAlign:"center"}}>
          <div style={{fontSize:10, color:t.textMuted, letterSpacing:1, marginBottom:4}}>المنزل</div>
          <div style={{fontSize:22, color:t.accentSoft, direction:"rtl", marginBottom:4, lineHeight:1.3}}>{moonData.manzil.ar}</div>
          <div style={{fontSize:12, color:t.textLight, marginBottom:6}}>{moonData.manzil.fr}</div>
          <div style={{fontSize:18, color:t.accent, fontWeight:"bold"}}>#{moonData.manzilIdx+1}</div>
          <div style={{fontSize:9, color:t.textMuted, marginTop:2}}>/ 28</div>
        </div>
      </div>
      {/* Longitude brute */}
      <div style={{display:"flex", justifyContent:"space-between", marginTop:10, paddingTop:8, borderTop:`1px solid ${t.accent}22`}}>
        <div style={{textAlign:"center", flex:1}}>
          <div style={{fontSize:9, color:t.textMuted, marginBottom:2}}>λ Tropical</div>
          <div style={{fontSize:12, color:t.accentSoft}}>{moonData.lonTrop}°</div>
        </div>
        <div style={{width:1, background:`${t.accent}22`}}/>
        <div style={{textAlign:"center", flex:1}}>
          <div style={{fontSize:9, color:t.textMuted, marginBottom:2}}>λ Sidéral</div>
          <div style={{fontSize:12, color:t.accentSoft}}>{moonData.lonSid}°</div>
        </div>
        <div style={{width:1, background:`${t.accent}22`}}/>
        <div style={{textAlign:"center", flex:1}}>
          <div style={{fontSize:9, color:t.textMuted, marginBottom:2}}>Ayanamsa</div>
          <div style={{fontSize:12, color:t.accentSoft}}>{moonData.aya}°</div>
        </div>
      </div>
    </div>
  );
}

// ─── RolesCard ────────────────────────────────────────────────────────────
function RolesCard({ manzil, t }) {
  const nc = NATURE_COLORS[manzil.nature] || t.accent;
  return (
    <div style={{background:t.rowBg, border:`1px solid ${t.accent}33`, borderRadius:14, padding:14, marginBottom:10}}>
      <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:10}}>
        <span style={{fontSize:9, borderRadius:20, padding:"3px 8px", whiteSpace:"nowrap", fontWeight:"bold", background:`${nc}22`, color:nc, border:`1px solid ${nc}55`}}>{manzil.nature}</span>
        <span style={{fontSize:11, color:t.textMuted, letterSpacing:1}}>Rôles selon la tradition</span>
      </div>
      <p style={{fontSize:10, color:t.textMuted, lineHeight:1.6, marginBottom:12, borderLeft:`2px solid ${t.accent}44`, paddingLeft:8}}>{manzil.description}</p>
      <div style={{display:"flex", gap:8}}>
        <div style={{flex:1}}>
          <div style={{fontSize:10, color:t.textLight, marginBottom:8, fontWeight:"bold"}}>✓ À faire</div>
          {manzil.favorables.map((r,i)=>(
            <div key={i} style={{display:"flex", alignItems:"flex-start", marginBottom:6}}>
              <span style={{color:"#4ecf8a", marginRight:6, fontSize:10}}>●</span>
              <span style={{fontSize:10, color:t.textMuted, lineHeight:1.4}}>{r}</span>
            </div>
          ))}
        </div>
        <div style={{width:1, background:`${t.accent}22`, margin:"0 4px"}} />
        <div style={{flex:1}}>
          <div style={{fontSize:10, color:t.textLight, marginBottom:8, fontWeight:"bold"}}>✗ À éviter</div>
          {manzil.defavorables.map((r,i)=>(
            <div key={i} style={{display:"flex", alignItems:"flex-start", marginBottom:6}}>
              <span style={{color:"#e07a5f", marginRight:6, fontSize:10}}>●</span>
              <span style={{fontSize:10, color:t.textMuted, lineHeight:1.4}}>{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────
export default function ManazilApp() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [system, setSystem] = useState("sidereal");
  const [moonData, setMoonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("today");
  const [themeKey, setThemeKey] = useState("night");
  const t = THEMES[themeKey];

  const compute = useCallback((d, sys) => {
    setLoading(true);
    setTimeout(() => { setMoonData(computeMoonData(d, sys)); setLoading(false); }, 250);
  }, []);

  useEffect(() => { compute(selectedDate, system); }, [selectedDate, system]);

  const dateStr = selectedDate.toISOString().split("T")[0];
  const timeStr = `${String(selectedDate.getHours()).padStart(2,"0")}:${String(selectedDate.getMinutes()).padStart(2,"0")}`;
  const phase = moonPhase(selectedDate);

  return (
    <div style={{minHeight:"100vh", maxWidth:430, margin:"0 auto", background:t.root, fontFamily:"'Georgia','Times New Roman',serif", color:t.textLight, position:"relative", overflow:"hidden"}}>
      {t.starsBg && <div style={{position:"fixed",inset:0,pointerEvents:"none",backgroundImage:`radial-gradient(1px 1px at 20% 30%, #ffffff33, transparent),radial-gradient(1px 1px at 80% 10%, #ffffff22, transparent),radial-gradient(1px 1px at 50% 70%, #ffffff22, transparent)`}} />}

      {/* Header */}
      <header style={{textAlign:"center", padding:"22px 20px 12px", background:t.header, borderBottom:`1px solid ${t.headerBorder}`, position:"relative"}}>
        <div style={{position:"absolute",top:-80,left:"50%",transform:"translateX(-50%)",width:240,height:240,background:`radial-gradient(circle,${t.accent}18 0%,transparent 70%)`,pointerEvents:"none"}}/>
        <div style={{letterSpacing:6, fontSize:10, marginBottom:6, textTransform:"uppercase"}}>
          <span style={{color:t.accent, fontWeight:"bold"}}>SEN</span>
          <span style={{color:t.textMuted, margin:"0 4px", fontSize:8}}>✦</span>
          <span style={{color:t.textMuted}}>ASTRO</span>
        </div>
        <h1 style={{margin:"0 0 4px", fontSize:24, fontWeight:"normal", color:t.accentSoft, textShadow:`0 0 40px ${t.accent}66`, letterSpacing:2}}>مَنَازِل القَمَر</h1>
        <p style={{margin:0, fontSize:10, color:t.textMuted, letterSpacing:5, textTransform:"uppercase"}}>Stations Lunaires</p>
      </header>

      {/* Thèmes */}
      <div style={{display:"flex", gap:6, padding:"10px 14px", background:t.tabsBg, borderBottom:`1px solid ${t.tabBorder}`, alignItems:"center"}}>
        <span style={{fontSize:9, color:t.textMuted, letterSpacing:1, marginRight:4}}>THÈME</span>
        {Object.entries(THEMES).map(([key,th])=>(
          <button key={key} style={{flex:1, padding:"7px 4px", background:themeKey===key?`${th.accent}22`:"none", border:themeKey===key?`1px solid ${th.accent}99`:`1px solid ${t.tabBorder}`, borderRadius:8, color:themeKey===key?th.accent:t.textMuted, fontSize:10, cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s"}} onClick={()=>setThemeKey(key)}>{th.name}</button>
        ))}
      </div>

      {/* Système */}
      <div style={{display:"flex", gap:8, padding:"10px 14px", background:`${t.tabsBg}99`, borderBottom:`1px solid ${t.tabBorder}`}}>
        {[["sidereal","☽","Sidéral","Tradition arabo-islamique"],["tropical","☀","Tropical","Zodiaque occidental"]].map(([k,icon,title,sub])=>(
          <button key={k} style={{flex:1, display:"flex", alignItems:"center", gap:8, background:system===k?t.sysBtnActiveBg:"none", border:system===k?`1px solid ${t.sysBtnActiveBorder}`:`1px solid ${t.sysBtnBorder}`, borderRadius:10, padding:"8px 10px", cursor:"pointer", color:system===k?t.textLight:t.textMuted, fontFamily:"inherit", transition:"all 0.25s"}} onClick={()=>setSystem(k)}>
            <span style={{fontSize:20}}>{icon}</span>
            <div><div style={{fontSize:12, marginBottom:1}}>{title}</div><div style={{fontSize:9, color:t.textMuted}}>{sub}</div></div>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div style={{display:"flex", background:t.tabsBg, borderBottom:`1px solid ${t.tabBorder}`}}>
        {[["today","Aujourd'hui"],["roles","Rôles"],["calendar","7 jours"],["list","Les 28"],["book","📚 Livre"]].map(([k,l])=>(
          <button key={k} style={{flex:1, padding:"10px 2px", background:tab===k?`${t.accent}11`:"none", border:"none", borderBottom:tab===k?`2px solid ${t.accent}`:"none", color:tab===k?t.accentSoft:t.textMuted, cursor:"pointer", fontSize:9, letterSpacing:0.3, fontFamily:"inherit", transition:"all 0.2s"}} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{padding:"14px 14px 90px"}}>
        {tab==="today" && <TodayView moonData={moonData} loading={loading} phase={phase} system={system} selectedDate={selectedDate} dateStr={dateStr} timeStr={timeStr} t={t}
          onDateChange={e=>{const d=new Date(e.target.value);d.setHours(selectedDate.getHours(),selectedDate.getMinutes());setSelectedDate(d);}}
          onTimeChange={e=>{const[h,m]=e.target.value.split(":").map(Number);const d=new Date(selectedDate);d.setHours(h,m,0);setSelectedDate(d);}}
        />}
        {tab==="roles" && <RolesView moonData={moonData} t={t} />}
        {tab==="calendar" && <CalendarView selectedDate={selectedDate} setSelectedDate={setSelectedDate} system={system} setTab={setTab} t={t} />}
        {tab==="list" && <ListView currentIdx={moonData?.manzilIdx} t={t} />}
        {tab==="book" && <BookAd t={t} />}
      </div>

      <div style={{position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:`${t.deepBlue}f0`, borderTop:`1px solid ${t.accent}22`, textAlign:"center", padding:"8px 0", backdropFilter:"blur(10px)"}}>
        <span style={{fontSize:9, color:t.textMuted, letterSpacing:1}}>© Sen-Astro — Ibn Ajiba & Al-Buni</span>
      </div>
    </div>
  );
}

function TodayView({ moonData, loading, phase, system, selectedDate, dateStr, timeStr, t, onDateChange, onTimeChange }) {
  return (
    <div>
      <div style={{display:"flex", gap:8, marginBottom:12}}>
        {[["📅 Date",<input type="date" value={dateStr} onChange={onDateChange} style={{background:"none",border:"none",color:t.textLight,fontSize:12,fontFamily:"inherit",width:"100%",outline:"none",colorScheme:t.inputColor}}/>],
          ["⏰ Heure",<input type="time" value={timeStr} onChange={onTimeChange} style={{background:"none",border:"none",color:t.textLight,fontSize:12,fontFamily:"inherit",width:"100%",outline:"none",colorScheme:t.inputColor}}/>]
        ].map(([label,input],i)=>(
          <div key={i} style={{flex:1, background:t.rowBg, border:`1px solid ${t.accent}33`, borderRadius:10, padding:"8px 12px"}}>
            <div style={{fontSize:9, color:t.textMuted, marginBottom:4, letterSpacing:1}}>{label}</div>
            {input}
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{textAlign:"center", padding:"60px 0"}}>
          <div style={{fontSize:44}}>☽</div>
          <p style={{color:t.textMuted, marginTop:10, fontSize:12}}>Calcul en cours…</p>
        </div>
      ) : moonData ? (
        <>
          {/* Phase */}
          <div style={{display:"flex", alignItems:"center", gap:12, background:t.phaseBg, border:`1px solid ${t.phaseBorder}`, borderRadius:12, padding:"10px 14px", marginBottom:10}}>
            <span style={{fontSize:30}}>{phase.emoji}</span>
            <div>
              <div style={{fontSize:12, color:t.accentSoft, marginBottom:2}}>{phase.name}</div>
              <div style={{fontSize:10, color:t.textMuted}}>{selectedDate.toLocaleDateString("fr-FR",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})}</div>
            </div>
            <div style={{marginLeft:"auto", fontSize:9, color:t.deepBlue, background:t.accent, borderRadius:20, padding:"2px 7px", whiteSpace:"nowrap"}}>{system==="sidereal"?"Sidéral":"Tropical"}</div>
          </div>

          {/* Position Lune = Signe + Manzil */}
          <MoonPosition moonData={moonData} system={system} t={t} />

          {/* Progression */}
          <div style={{background:t.cardBg, border:`1px solid ${t.cardBorder}`, borderRadius:14, padding:"14px 16px", marginBottom:10}}>
            <div style={{display:"flex", justifyContent:"space-between", fontSize:9, color:t.textMuted, marginBottom:6}}>
              <span>↗ Entrée</span><span style={{color:t.accent}}>{moonData.progress}% parcouru</span><span>Sortie ↘</span>
            </div>
            <div style={{height:5, background:`${t.accent}22`, borderRadius:3, position:"relative", overflow:"visible"}}>
              <div style={{height:"100%", background:`linear-gradient(90deg,${t.accent}66,${t.accent})`, borderRadius:3, width:`${moonData.progress}%`, transition:"width 0.7s ease"}}/>
              <div style={{position:"absolute", top:-9, left:`calc(${moonData.progress}% - 10px)`, fontSize:18, color:t.accentSoft, filter:`drop-shadow(0 0 6px ${t.accent})`, lineHeight:1}}>☽</div>
            </div>
          </div>

          {/* Rôles */}
          <RolesCard manzil={moonData.manzil} t={t} />

          {/* Transits */}
          <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:10}}>
            {[["↗","Entrée",moonData.entryTime],["↘","Sortie",moonData.exitTime]].map(([arrow,label,time],i)=>(
              <>
                <div key={i} style={{flex:1, background:t.rowBg, border:`1px solid ${t.accent}33`, borderRadius:12, padding:"10px 8px", textAlign:"center"}}>
                  <div style={{fontSize:14, color:t.accent, marginBottom:3}}>{arrow}</div>
                  <div style={{fontSize:9, color:t.textMuted, marginBottom:5}}>{label} dans ce manzil</div>
                  <div style={{fontSize:20, color:t.accentSoft, marginBottom:2}}>{formatTime(time)}</div>
                  <div style={{fontSize:9, color:t.textMuted}}>{formatDate(time)}</div>
                </div>
                {i===0 && <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div style={{width:1,height:16,background:`${t.accent}33`}}/>
                  <span style={{fontSize:16,color:t.accent}}>☽</span>
                  <div style={{width:1,height:16,background:`${t.accent}33`}}/>
                </div>}
              </>
            ))}
          </div>

          {/* Nav */}
          <div style={{display:"flex", gap:8, marginBottom:10}}>
            {[["◀ Précédent",(moonData.manzilIdx+27)%28],["Suivant ▶",(moonData.manzilIdx+1)%28]].map(([dir,idx])=>(
              <div key={dir} style={{flex:1, background:t.rowBg, border:`1px solid ${t.accent}22`, borderRadius:10, padding:"9px", textAlign:"center"}}>
                <div style={{fontSize:9, color:t.textMuted, marginBottom:3}}>{dir}</div>
                <div style={{fontSize:12, color:t.accentSoft, direction:"rtl", marginBottom:2}}>{MANAZIL[idx].ar}</div>
                <div style={{fontSize:9, color:t.textMuted}}>{MANAZIL[idx].fr}</div>
              </div>
            ))}
          </div>

          {/* Pub livre mini */}
          <div style={{background:"linear-gradient(135deg,#1a0a00,#2d1500,#1a0a00)", border:"1px solid #C9A84C88", borderRadius:12, padding:"12px 14px", marginBottom:10, display:"flex", alignItems:"center", gap:12, cursor:"pointer"}} onClick={()=>window.open("https://wa.me/221764265550","_blank")}>
            <span style={{fontSize:24}}>📚</span>
            <div style={{flex:1}}>
              <div style={{fontSize:11, color:"#e8c97a", fontWeight:"bold", marginBottom:2}}>Les Manâzil Al-Qamar</div>
              <div style={{fontSize:9, color:"#C9A84C88"}}>Livre FR & Wolof — dès 6.900 FCFA</div>
            </div>
            <div style={{fontSize:9, background:"#25D366", color:"white", borderRadius:20, padding:"4px 10px", whiteSpace:"nowrap"}}>Commander</div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function RolesView({ moonData, t }) {
  const [selected, setSelected] = useState(moonData?.manzilIdx ?? 0);
  useEffect(()=>{if(moonData)setSelected(moonData.manzilIdx);},[moonData]);
  const m = MANAZIL[selected];
  return (
    <div>
      <h3 style={{color:t.accent, fontSize:13, letterSpacing:2, marginBottom:8, fontWeight:"normal"}}>Rôles & Influences des Manāzil</h3>
      <p style={{fontSize:10, color:t.textMuted, marginBottom:12, lineHeight:1.5}}>Source : tradition classique — Ibn Ajiba, Al-Buni</p>
      <div style={{display:"flex", flexWrap:"wrap", gap:6, marginBottom:14}}>
        {MANAZIL.map((m2,i)=>{
          const nc=NATURE_COLORS[m2.nature]||t.accent;
          return <button key={i} style={{width:32, height:32, borderRadius:8, background:i===selected?`${nc}22`:t.rowBg, border:i===selected?`1px solid ${nc}99`:`1px solid ${t.accent}22`, color:i===selected?nc:t.textMuted, fontSize:11, cursor:"pointer", fontFamily:"inherit", fontWeight:i===selected?"bold":"normal", transition:"all 0.2s"}} onClick={()=>setSelected(i)}>{i+1}</button>;
        })}
      </div>
      <div style={{background:t.cardBg, border:`1px solid ${t.cardBorder}`, borderRadius:16, padding:"18px 16px", marginBottom:10, textAlign:"center"}}>
        <div style={{fontSize:10, color:t.textMuted, letterSpacing:3, marginBottom:6}}>المنزل الـ {selected+1}</div>
        <div style={{fontSize:28, color:t.accentSoft, marginBottom:4, lineHeight:1.4, direction:"rtl"}}>{m.ar}</div>
        <div style={{fontSize:16, color:t.textLight, marginBottom:3}}>{m.fr}</div>
        <div style={{fontSize:10, color:t.textMuted, marginBottom:moonData?.manzilIdx===selected?10:0}}>✦ {m.stars}</div>
        {moonData?.manzilIdx===selected && <div style={{fontSize:10, color:t.deepBlue, background:t.accent, borderRadius:20, padding:"3px 10px", display:"inline-block"}}>☽ Lune ici maintenant</div>}
      </div>
      <RolesCard manzil={m} t={t} />
    </div>
  );
}

function CalendarView({ selectedDate, setSelectedDate, system, setTab, t }) {
  const getLon=system==="sidereal"?moonLongitudeSidereal:moonLongitudeTropical;
  const days=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()+i);d.setHours(12,0,0);return d;});
  return (
    <div>
      <h3 style={{color:t.accent, fontSize:13, letterSpacing:2, marginBottom:10, fontWeight:"normal"}}>7 prochains jours · {system==="sidereal"?"Sidéral":"Tropical"}</h3>
      {days.map((d,i)=>{
        const lon=getLon(julianDay(d));
        const idx=getManzilIndex(lon);
        const m=MANAZIL[idx];
        const ph=moonPhase(d);
        const nc=NATURE_COLORS[m.nature]||t.accent;
        const sg=getSigneFromLon(lon);
        return (
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,background:i===0?t.rowActiveBg:t.rowBg,border:`1px solid ${i===0?t.rowActiveBorder:t.rowBorder}`,borderRadius:10,padding:"10px 12px",marginBottom:8,cursor:"pointer"}} onClick={()=>{setSelectedDate(d);setTab("today");}}>
            <div style={{textAlign:"center",minWidth:32}}>
              <div style={{fontSize:9,color:t.textMuted,textTransform:"uppercase"}}>{d.toLocaleDateString("fr-FR",{weekday:"short"})}</div>
              <div style={{fontSize:17,color:t.accentSoft}}>{d.getDate()}</div>
              <div>{ph.emoji}</div>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,color:t.accentSoft,direction:"rtl",marginBottom:1}}>{m.ar}</div>
              <div style={{fontSize:10,color:t.textLight,marginBottom:1}}>{m.fr}</div>
              <div style={{fontSize:9,color:nc}}>{m.nature} · {sg.signe.emoji} {sg.signe.fr} {sg.deg}°{sg.min}'</div>
            </div>
            <div style={{fontSize:14,color:`${t.accent}55`,fontWeight:"bold"}}>#{idx+1}</div>
          </div>
        );
      })}
    </div>
  );
}

function ListView({ currentIdx, t }) {
  return (
    <div>
      <h3 style={{color:t.accent, fontSize:13, letterSpacing:2, marginBottom:10, fontWeight:"normal"}}>Les 28 Manāzil al-Qamar</h3>
      {MANAZIL.map((m,i)=>{
        const nc=NATURE_COLORS[m.nature]||t.accent;
        const active=i===currentIdx;
        return (
          <div key={i} style={{background:active?t.listActiveBg:t.rowBg,border:`1px solid ${active?t.accent+"99":t.rowBorder}`,borderRadius:10,padding:"9px 12px",marginBottom:6,display:"flex",alignItems:"center",gap:10,boxShadow:active?`0 0 20px ${t.listActiveShadow}`:"none"}}>
            <div style={{fontSize:10,color:t.textMuted,minWidth:20,textAlign:"center"}}>{i+1}</div>
            <div style={{fontSize:13,color:t.accentSoft,direction:"rtl",minWidth:85}}>{m.ar}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:11,color:t.textLight,marginBottom:2}}>{m.fr}</div>
              <div style={{fontSize:9,color:nc}}>{m.nature}</div>
            </div>
            {active&&<div style={{fontSize:9,color:t.deepBlue,background:t.accent,borderRadius:20,padding:"2px 7px",whiteSpace:"nowrap"}}>☽ Ici</div>}
          </div>
        );
      })}
    </div>
  );
}