/* eslint-disable */
import { useState, useEffect, useCallback, useRef } from "react";

const THEMES = {
  night:{name:"Nuit",emoji:"moon",root:"radial-gradient(ellipse at 50% 0%,#1c1860 0%,#07061a 55%)",header:"linear-gradient(180deg,#1B1464dd 0%,transparent 100%)",headerBorder:"#C9A84C33",tabsBg:"#10102e",tabBorder:"#C9A84C22",accent:"#C9A84C",accentSoft:"#e8c97a",textLight:"#e8dfc8",textMuted:"#7a7090",cardBg:"linear-gradient(160deg,#1B1464bb 0%,#0c0b25 100%)",cardBorder:"#C9A84C55",phaseBg:"linear-gradient(135deg,#10102e 0%,#1B146488 100%)",phaseBorder:"#C9A84C33",rowBg:"#10102e88",rowBorder:"#C9A84C22",sysBtnBorder:"#C9A84C22",sysBtnActiveBg:"#C9A84C18",sysBtnActiveBorder:"#C9A84C99",inputColor:"dark",starsBg:true,deepBlue:"#07061a",listActiveBg:"#1B1464cc",listActiveShadow:"#C9A84C22"},
  white:{name:"Blanc",emoji:"sun",root:"linear-gradient(180deg,#f8f9fc 0%,#e8eaf0 100%)",header:"linear-gradient(180deg,#ffffffee 0%,transparent 100%)",headerBorder:"#9090b022",tabsBg:"#ffffff",tabBorder:"#9090b022",accent:"#5c6bc0",accentSoft:"#3949ab",textLight:"#1a1a2e",textMuted:"#6b6b8a",cardBg:"linear-gradient(160deg,#ffffff 0%,#f0f2fa 100%)",cardBorder:"#9090b044",phaseBg:"linear-gradient(135deg,#ffffff 0%,#e8eaf0 100%)",phaseBorder:"#9090b033",rowBg:"#ffffffcc",rowBorder:"#9090b022",sysBtnBorder:"#9090b033",sysBtnActiveBg:"#5c6bc018",sysBtnActiveBorder:"#5c6bc099",inputColor:"light",starsBg:false,deepBlue:"#f8f9fc",listActiveBg:"#e8eaf0",listActiveShadow:"#5c6bc022"},
  nature:{name:"Nature",emoji:"leaf",root:"radial-gradient(ellipse at 50% 0%,#0d2b1a 0%,#070f08 55%)",header:"linear-gradient(180deg,#0d2b1add 0%,transparent 100%)",headerBorder:"#2e7d3233",tabsBg:"#0a1f0c",tabBorder:"#2e7d3222",accent:"#43a047",accentSoft:"#81c784",textLight:"#e8f5e9",textMuted:"#558b5a",cardBg:"linear-gradient(160deg,#0d2b1abb 0%,#050e06 100%)",cardBorder:"#2e7d3255",phaseBg:"linear-gradient(135deg,#0a1f0c 0%,#0d2b1a88 100%)",phaseBorder:"#2e7d3233",rowBg:"#0a1f0c88",rowBorder:"#2e7d3222",sysBtnBorder:"#2e7d3222",sysBtnActiveBg:"#43a04718",sysBtnActiveBorder:"#43a04799",inputColor:"dark",starsBg:true,deepBlue:"#070f08",listActiveBg:"#0d2b1acc",listActiveShadow:"#43a04722"},
  sepia:{name:"Sepia",emoji:"scroll",root:"linear-gradient(180deg,#2c1a0e 0%,#1a0f06 55%)",header:"linear-gradient(180deg,#2c1a0edd 0%,transparent 100%)",headerBorder:"#c8924433",tabsBg:"#1a0f06",tabBorder:"#c8924422",accent:"#c89244",accentSoft:"#e8b86d",textLight:"#f5e6d0",textMuted:"#8b6545",cardBg:"linear-gradient(160deg,#2c1a0ebb 0%,#120a04 100%)",cardBorder:"#c8924455",phaseBg:"linear-gradient(135deg,#1a0f06 0%,#2c1a0e88 100%)",phaseBorder:"#c8924433",rowBg:"#1a0f0688",rowBorder:"#c8924422",sysBtnBorder:"#c8924422",sysBtnActiveBg:"#c8924418",sysBtnActiveBorder:"#c8924499",inputColor:"dark",starsBg:false,deepBlue:"#120a04",listActiveBg:"#2c1a0ecc",listActiveShadow:"#c8924422"},
};

const THEME_ICONS = {night:"🌙",white:"☀️",nature:"🌿",sepia:"📜"};

const SIGNES=[
  {fr:"Belier",ar:"الحمل",emoji:"♈"},{fr:"Taureau",ar:"الثور",emoji:"♉"},
  {fr:"Gemeaux",ar:"الجوزاء",emoji:"♊"},{fr:"Cancer",ar:"السرطان",emoji:"♋"},
  {fr:"Lion",ar:"الأسد",emoji:"♌"},{fr:"Vierge",ar:"السنبلة",emoji:"♍"},
  {fr:"Balance",ar:"الميزان",emoji:"♎"},{fr:"Scorpion",ar:"العقرب",emoji:"♏"},
  {fr:"Sagittaire",ar:"القوس",emoji:"♐"},{fr:"Capricorne",ar:"الجدي",emoji:"♑"},
  {fr:"Verseau",ar:"الدلو",emoji:"♒"},{fr:"Poissons",ar:"الحوت",emoji:"♓"}
];

function getSigneFromLon(lon) {
  var idx = Math.floor(lon/30) % 12;
  var deg = lon % 30;
  return { signe: SIGNES[idx], deg: Math.floor(deg), min: Math.floor((deg%1)*60) };
}

const NC = {"Tres benefique":"#4ecf8a","Benefique":"#C9A84C","Neutre":"#8a9fc4","Malefique":"#e07a5f"};
const MS = 360/28;
function tr(d) { return d*Math.PI/180; }
function m360(x) { return ((x%360)+360)%360; }

function jd(date) {
  var Y=date.getUTCFullYear(), M=date.getUTCMonth()+1;
  var D=date.getUTCDate()+(date.getUTCHours()+date.getUTCMinutes()/60+date.getUTCSeconds()/3600)/24;
  var y=Y, m=M;
  if(m<=2){y-=1;m+=12;}
  var A=Math.floor(y/100), B=2-A+Math.floor(A/4);
  return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+D+B-1524.5;
}

function moonTrop(j) {
  var T=(j-2451545)/36525;
  var Lp=m360(218.3164477+481267.88123421*T-0.0015786*T*T);
  var M=m360(357.5291092+35999.0502909*T-0.0001536*T*T);
  var Mp=m360(134.9633964+477198.8675055*T+0.0087414*T*T);
  var F=m360(93.2720950+483202.0175233*T-0.0036539*T*T);
  var D=m360(297.8501921+445267.1114034*T-0.0018819*T*T);
  M=tr(M);Mp=tr(Mp);F=tr(F);D=tr(D);
  return m360(Lp+6.288774*Math.sin(Mp)+1.274027*Math.sin(2*D-Mp)+0.658314*Math.sin(2*D)+0.213618*Math.sin(2*Mp)-0.185116*Math.sin(M)-0.114332*Math.sin(2*F)+0.058793*Math.sin(2*D-2*Mp)+0.057066*Math.sin(2*D-M-Mp)+0.053322*Math.sin(2*D+Mp)+0.045758*Math.sin(2*D-M)-0.040923*Math.sin(M-Mp)-0.034720*Math.sin(D)-0.030383*Math.sin(M+Mp)+0.015327*Math.sin(2*D-2*F)-0.012528*Math.sin(Mp+2*F)+0.010980*Math.sin(Mp-2*F));
}

function ayaFn(j) { var T=(j-2451545)/36525; return 23.85+50.3*T/3600; }
function moonSid(j) { return m360(moonTrop(j)-ayaFn(j)); }
function mIdx(lon) { return Math.floor(lon/MS)%28; }

function sunLon(j) {
  var T=(j-2451545)/36525;
  var L0=m360(280.46646+36000.76983*T);
  var Mv=m360(357.52911+35999.05029*T);
  var C=(1.914602-0.004817*T)*Math.sin(tr(Mv))+(0.019993-0.000101*T)*Math.sin(tr(2*Mv));
  return m360(L0+C);
}

var hijriCache = {};
function fetchHijriDate(date) {
  var key = date.toISOString().split("T")[0];
  if(hijriCache[key]) return Promise.resolve(hijriCache[key]);
  var parts = key.split("-");
  var url = "https://api.aladhan.com/v1/gToH/"+parts[2]+"-"+parts[1]+"-"+parts[0];
  return fetch(url)
    .then(function(r){return r.json();})
    .then(function(json){
      if(json.code===200){
        var h=json.data.hijri;
        var result = {
          day:h.day, month:h.month.en, monthAr:h.month.ar, year:h.year,
          display:h.day+" "+h.month.en+" "+h.year+" H",
          displayAr:h.day+" "+h.month.ar+" "+h.year
        };
        hijriCache[key]=result;
        return result;
      }
      return null;
    })
    .catch(function(){return null;});
}

function toHijriLocal(date) {
  var jDay=jd(date)+0.5;
  var epoch=1948438.5;
  var z=Math.floor(jDay-epoch);
  var cycle=Math.floor(z/10631);
  var rem=z-cycle*10631;
  var y=Math.floor((rem*30+29)/10631)+cycle*30+1;
  var mo=Math.min(12,Math.ceil((rem-Math.floor((y-1)*354.367))/29.5+1));
  var d=Math.floor(z-Math.floor((y-1)*354.367)-(mo-1)*29.5)+1;
  var months=["Muharram","Safar","Rabi al-Awwal","Rabi al-Thani","Jumada al-Awwal","Jumada al-Thani","Rajab","Shaban","Ramadan","Shawwal","Dhu al-Qidah","Dhu al-Hijjah"];
  var dd=Math.max(1,d), mm=Math.max(0,mo-1), yy=Math.max(1,y);
  return { day:dd, month:months[mm], year:yy, display:dd+" "+months[mm]+" "+yy+" H" };
}

function transit(date, idx, dir, getLon) {
  var step=dir*15*60*1000;
  var cur=new Date(date);
  for(var i=0;i<200;i++){
    cur=new Date(cur.getTime()+step);
    if(mIdx(getLon(jd(cur)))!==idx){
      var a=new Date(cur.getTime()-step), b=cur;
      for(var k=0;k<10;k++){
        var mid=new Date((a.getTime()+b.getTime())/2);
        if(mIdx(getLon(jd(mid)))===idx){a=mid;}else{b=mid;}
      }
      return dir===1?b:a;
    }
  }
  return null;
}

function moonRiseApprox(date) {
  var age=(((date-new Date("2000-01-06T18:14:00Z"))/(864e5))%29.53+29.53)%29.53;
  var r=6+(age/29.53)*12; var c=r+12.5;
  function fmt(h){return String(Math.floor(h%24)).padStart(2,"0")+":"+String(Math.floor((h%1)*60)).padStart(2,"0");}
  return {lever:fmt(r),zenith:fmt(r+6),coucher:fmt(c)};
}

function calcData(date, sys) {
  var getLon = sys==="sidereal" ? moonSid : moonTrop;
  var j=jd(date);
  var lon=getLon(j);
  var lt=moonTrop(j), ls=moonSid(j), ay=ayaFn(j);
  var idx=mIdx(lon);
  var manzil=MANAZIL[idx];
  var prog=Math.min(99.9,(m360(lon-manzil.lon)/MS)*100);
  var sl=sunLon(j), slSid=m360(sl-ay);
  return {
    lon:lon.toFixed(2), lonTrop:lt.toFixed(2), lonSid:ls.toFixed(2), aya:ay.toFixed(2),
    manzilIdx:idx, manzil:manzil, progress:prog.toFixed(1),
    entryTime:transit(date,idx,-1,getLon), exitTime:transit(date,idx,1,getLon),
    signeTrop:getSigneFromLon(lt), signeSid:getSigneFromLon(ls),
    moonRise:moonRiseApprox(date),
    sunSigne:getSigneFromLon(sys==="sidereal"?slSid:sl)
  };
}

function phase(date) {
  var age=(((date-new Date("2000-01-06T18:14:00Z"))/(864e5))%29.53+29.53)%29.53;
  var pct=Math.round((age/29.53)*100);
  var name,emoji;
  if(age<1.85){name="Nouvelle Lune";emoji="🌑";}
  else if(age<7.38){name="Premier Croissant";emoji="🌒";}
  else if(age<9.22){name="Premier Quartier";emoji="🌓";}
  else if(age<14.76){name="Gibbeuse Croissante";emoji="🌔";}
  else if(age<16.61){name="Pleine Lune";emoji="🌕";}
  else if(age<22.15){name="Gibbeuse Decroissante";emoji="🌖";}
  else if(age<23.99){name="Dernier Quartier";emoji="🌗";}
  else{name="Dernier Croissant";emoji="🌘";}
  return {name:name,emoji:emoji,age:age.toFixed(1),pct:pct};
}

function nextLunarEvent(date) {
  var age=(((date-new Date("2000-01-06T18:14:00Z"))/(864e5))%29.53+29.53)%29.53;
  var toNew=age<0.5?0:29.53-age;
  var toFull=age<14.76?14.76-age:29.53-age+14.76;
  return {
    newMoon:{date:new Date(date.getTime()+toNew*864e5),days:toNew.toFixed(1)},
    fullMoon:{date:new Date(date.getTime()+toFull*864e5),days:toFull.toFixed(1)}
  };
}

function fmtT(d){if(!d)return"--:--";return d.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});}
function fmtD(d){if(!d)return"--";return d.toLocaleDateString("fr-FR",{day:"2-digit",month:"short"});}

// ─── Donnees MANAZIL ─────────────────────────────────────────────────────
const MANAZIL = [
  {num:1,ar:"الشرطين",fr:"An-Nath",stars:"α β Ari",lon:0,nature:"Benefique",symbole:"Deux cornes du Belier",element:"Feu",planete:"Mars",description:"Premier manzil, energie et commencement. Favorable aux debuts et nouveaux projets.",favorables:["Voyages et deplacements","Commerce et affaires","Mariage et unions","Construire et batir"],defavorables:["Emprunts et dettes","Operations chirurgicales"],mariage:"Excellent pour les fiancailles et le mariage.",voyage:"Tres favorable.",commerce:"Propice aux nouvelles affaires.",sante:"Bon pour debuter un traitement.",agriculture:"Excellent pour les semailles.",magie:"Talismans de protection."},
  {num:2,ar:"البطين",fr:"Al-Butayn",stars:"ε δ ρ Ari",lon:12.857,nature:"Neutre",symbole:"Ventre du Belier",element:"Terre",planete:"Venus",description:"Manzil de l interieur et du cache. Propice aux affaires discretes.",favorables:["Enfouissement de tresors","Agriculture","Affaires secretes"],defavorables:["Voyages en mer","Associations publiques"],mariage:"Passable pour unions discretes.",voyage:"Neutre.",commerce:"Bon pour transactions privees.",sante:"Soins internes.",agriculture:"Excellent pour semailles.",magie:"Talismans de dissimulation."},
  {num:3,ar:"الثريا",fr:"Ath-Thurayya",stars:"Pleiades",lon:25.714,nature:"Benefique",symbole:"Les Pleiades",element:"Air",planete:"Lune",description:"Les Pleiades, etoile de prosperite. Excellent pour voyages maritimes.",favorables:["Navigation","Commerce de parfums","Demandes aux rois","Chasse"],defavorables:["Mariage force","Dettes"],mariage:"Bon pour demandes en mariage.",voyage:"Exceptionnel pour navigation.",commerce:"Tres favorable.",sante:"Soins des yeux.",agriculture:"Plantes aromatiques.",magie:"Attirer prosperite."},
  {num:4,ar:"الدبران",fr:"Ad-Dabaran",stars:"α Tau",lon:38.571,nature:"Malefique",symbole:"Oeil du Taureau",element:"Terre",planete:"Saturne",description:"Manzil difficile. Eviter voyages et nouveaux engagements.",favorables:["Construction solide","Plantation","Chasse"],defavorables:["Voyages","Mariage","Commerce"],mariage:"Tres defavorable.",voyage:"Deconseille.",commerce:"Eviter nouvelles affaires.",sante:"Soins dentaires.",agriculture:"Arbres resistants.",magie:"Bloquer et immobiliser."},
  {num:5,ar:"الهقعة",fr:"Al-Haqa",stars:"λ φ Ori",lon:51.429,nature:"Benefique",symbole:"Marque sur le flanc",element:"Feu",planete:"Jupiter",description:"Manzil de liberation et guerison.",favorables:["Liberation","Guerison","Construction"],defavorables:["Longs voyages","Semailles"],mariage:"Neutre.",voyage:"Deconseille longs trajets.",commerce:"Recuperer creances.",sante:"Excellent pour traitement.",agriculture:"Deconseille.",magie:"Talismans de guerison."},
  {num:6,ar:"الهنعة",fr:"Al-Hana",stars:"γ ξ Gem",lon:64.286,nature:"Malefique",symbole:"Marque sur le cou",element:"Eau",planete:"Mars",description:"Manzil des contraintes. Favorable aux travaux souterrains.",favorables:["Creuser puits","Travaux miniers"],defavorables:["Mariage","Voyages","Commerce"],mariage:"Tres defavorable.",voyage:"Defavorable.",commerce:"Eviter.",sante:"Soins des genoux.",agriculture:"Labour profond.",magie:"Lier et contraindre."},
  {num:7,ar:"الذراع",fr:"Adh-Dhira",stars:"α β Gem",lon:77.143,nature:"Tres benefique",symbole:"Bras des Gemeaux",element:"Air",planete:"Mercure",description:"L un des manzils les plus benis. Excellent pour tout.",favorables:["Commerce","Mariage","Agriculture","Voyages","Amitie"],defavorables:["Guerres"],mariage:"Exceptionnel.",voyage:"Tres favorable.",commerce:"Excellent.",sante:"Toute guerison.",agriculture:"Toutes cultures.",magie:"Talismans d amour."},
  {num:8,ar:"النثرة",fr:"An-Nathra",stars:"ε Cnc",lon:90,nature:"Benefique",symbole:"Narine du Lion",element:"Eau",planete:"Lune",description:"Manzil de generosite et d amour.",favorables:["Achat de biens","Commerce","Amour","Liberalite"],defavorables:["Dettes","Mer agitee"],mariage:"Favorable.",voyage:"Bon.",commerce:"Tres favorable.",sante:"Coeur et lymphe.",agriculture:"Bon pour fruits.",magie:"Talismans d amour."},
  {num:9,ar:"الطرف",fr:"At-Tarf",stars:"κ λ Leo",lon:102.857,nature:"Malefique",symbole:"Regard du Lion",element:"Feu",planete:"Saturne",description:"Manzil defavorable. Eviter tout nouveau commencement.",favorables:["Repos et meditation"],defavorables:["Commerce","Voyages","Mariage"],mariage:"Tres defavorable.",voyage:"Dangereux.",commerce:"Eviter.",sante:"Eviter interventions.",agriculture:"Defavorable.",magie:"Eviter."},
  {num:10,ar:"الجبهة",fr:"Al-Jabha",stars:"α Leo",lon:115.714,nature:"Tres benefique",symbole:"Front du Lion",element:"Feu",planete:"Soleil",description:"Manzil de force et d autorite. Excellent pour actions decisives.",favorables:["Commerce","Voyages","Mariage","Construction","Leadership"],defavorables:["Emprunts imprudents"],mariage:"Excellent.",voyage:"Tres favorable.",commerce:"Excellent.",sante:"Coeur et colonne.",agriculture:"Excellent.",magie:"Pouvoir et victoire."},
  {num:11,ar:"الزبرة",fr:"Az-Zubra",stars:"δ θ Leo",lon:128.571,nature:"Neutre",symbole:"Criniere du Lion",element:"Feu",planete:"Jupiter",description:"Bon pour voyages et commerce textile.",favorables:["Voyages","Textiles","Liberation"],defavorables:["Mariage","Partenariats durables"],mariage:"Defavorable.",voyage:"Tres bon.",commerce:"Excellent textiles.",sante:"Peau et cheveux.",agriculture:"Neutre.",magie:"Faciliter deplacements."},
  {num:12,ar:"الصرفة",fr:"As-Sarfa",stars:"β Leo",lon:141.429,nature:"Neutre",symbole:"Queue du Lion",element:"Terre",planete:"Mars",description:"Manzil du changement. Bon pour commerce terrestre.",favorables:["Commerce","Agriculture","Changements"],defavorables:["Mer","Mariage"],mariage:"Defavorable.",voyage:"Neutre.",commerce:"Bon.",sante:"Soins digestifs.",agriculture:"Elevage.",magie:"Transformation."},
  {num:13,ar:"العواء",fr:"Al-Awwa",stars:"β η γ Vir",lon:154.286,nature:"Benefique",symbole:"Cinq etoiles de la Vierge",element:"Terre",planete:"Venus",description:"Favorable aux autorites et au service.",favorables:["Commerce","Agriculture","Autorites","Education"],defavorables:["Mer"],mariage:"Favorable.",voyage:"Excellent terrestre.",commerce:"Bon.",sante:"Soins veterinaires.",agriculture:"Excellent.",magie:"Faveurs des autorites."},
  {num:14,ar:"السماك",fr:"As-Simak",stars:"α Vir Spica",lon:167.143,nature:"Tres benefique",symbole:"Spica",element:"Terre",planete:"Venus",description:"Spica, la perle des manzils. Universel et beni.",favorables:["Tout commerce","Mariage","Agriculture","Voyages"],defavorables:["Conflits"],mariage:"Exceptionnel.",voyage:"Excellent.",commerce:"Exceptionnel.",sante:"Excellent.",agriculture:"Exceptionnel.",magie:"Le plus puissant."},
  {num:15,ar:"الغفر",fr:"Al-Ghafr",stars:"ι κ λ Vir",lon:180,nature:"Neutre",symbole:"Le pardon",element:"Air",planete:"Mercure",description:"Manzil du secret et de la discretion.",favorables:["Secrets","Protection","Pardon"],defavorables:["Mariage public","Voyages ostentatoires"],mariage:"Unions discretes.",voyage:"Incognito.",commerce:"Transactions discretes.",sante:"Retraites.",agriculture:"Neutre.",magie:"Protection."},
  {num:16,ar:"الزبانى",fr:"Az-Zubana",stars:"α β Lib",lon:192.857,nature:"Malefique",symbole:"Pinces du Scorpion",element:"Air",planete:"Saturne",description:"Manzil tres difficile. Eviter tout.",favorables:["Repos uniquement"],defavorables:["Tout"],mariage:"Tres nefaste.",voyage:"Dangereux.",commerce:"Pertes.",sante:"Eviter.",agriculture:"Tres defavorable.",magie:"Defensif uniquement."},
  {num:17,ar:"الاكليل",fr:"Al-Iklil",stars:"β δ π Sco",lon:205.714,nature:"Benefique",symbole:"Couronne du Scorpion",element:"Eau",planete:"Jupiter",description:"Couronne apres l epreuve. Favorable.",favorables:["Voyages","Commerce","Mariage","Construction"],defavorables:["Dettes anciennes"],mariage:"Bon.",voyage:"Favorable.",commerce:"Bon.",sante:"Organes.",agriculture:"Cultures humides.",magie:"Victoire."},
  {num:18,ar:"القلب",fr:"Al-Qalb",stars:"α Sco Antares",lon:218.571,nature:"Malefique",symbole:"Coeur du Scorpion",element:"Eau",planete:"Mars",description:"Antares. Puissant mais dangereux.",favorables:["Forteresses","Defense","Chasse"],defavorables:["Mariage","Commerce","Voyages"],mariage:"Tres defavorable.",voyage:"Defavorable.",commerce:"Tres defavorable.",sante:"Urgences.",agriculture:"Defavorable.",magie:"Puissant, inities seulement."},
  {num:19,ar:"الشولة",fr:"Ash-Shawla",stars:"λ υ Sco",lon:231.429,nature:"Malefique",symbole:"Dard du Scorpion",element:"Eau",planete:"Mars",description:"Force animale. Dangereux pour affaires.",favorables:["Dompter animaux","Protection"],defavorables:["Mariage","Commerce"],mariage:"Tres defavorable.",voyage:"Defavorable.",commerce:"Tres defavorable.",sante:"Antidotes.",agriculture:"Defavorable.",magie:"Protection contre ennemis."},
  {num:20,ar:"النعائم",fr:"An-Naim",stars:"γ δ ε Sgr",lon:244.286,nature:"Neutre",symbole:"Les autruches",element:"Terre",planete:"Venus",description:"Nature et agriculture. Manzil rural.",favorables:["Elevage","Agriculture","Voyages ruraux"],defavorables:["Mariage solennel"],mariage:"Defavorable grandes ceremonies.",voyage:"Bon.",commerce:"Bon agricole.",sante:"Jambes.",agriculture:"Excellent.",magie:"Fertilite."},
  {num:21,ar:"البلدة",fr:"Al-Balda",stars:"φ Sgr vide",lon:257.143,nature:"Malefique",symbole:"La ville vide",element:"Terre",planete:"Saturne",description:"Espace vide. Manzil de contrainte.",favorables:["Capturer fugitifs"],defavorables:["Tout"],mariage:"Tres nefaste.",voyage:"Tres defavorable.",commerce:"Pertes.",sante:"Defavorable.",agriculture:"Sterile.",magie:"Isolement."},
  {num:22,ar:"سعد الذابح",fr:"Saad adh-Dhabih",stars:"α β Cap",lon:270,nature:"Benefique",symbole:"Bonne etoile",element:"Eau",planete:"Jupiter",description:"Debut des Saoud. Fortune inaugurale.",favorables:["Mariage","Commerce","Agriculture","Liberation"],defavorables:["Conflits"],mariage:"Excellent.",voyage:"Favorable.",commerce:"Tres favorable.",sante:"Excellent.",agriculture:"Tres favorable.",magie:"Fortune et benediction."},
  {num:23,ar:"سعد بلع",fr:"Saad Bula",stars:"ν μ Cap",lon:282.857,nature:"Benefique",symbole:"Avale le mal",element:"Eau",planete:"Jupiter",description:"Absorbe les maux et transforme.",favorables:["Commerce","Mariage","Construction","Guerison"],defavorables:["Mer agitee"],mariage:"Tres favorable.",voyage:"Bon.",commerce:"Excellent.",sante:"Maladies chroniques.",agriculture:"Tres favorable.",magie:"Neutraliser mauvais sorts."},
  {num:24,ar:"سعد السعود",fr:"Saad as-Suud",stars:"β Aqr",lon:295.714,nature:"Tres benefique",symbole:"Chance des chances",element:"Air",planete:"Venus",description:"Le manzil le plus fortune.",favorables:["Tout sans exception"],defavorables:["Conflits deliberes"],mariage:"Exceptionnel.",voyage:"Excellent.",commerce:"Exceptionnel.",sante:"Excellent.",agriculture:"Exceptionnel.",magie:"Le plus puissant."},
  {num:25,ar:"سعد الأخبية",fr:"Saad al-Akhbiya",stars:"γ π Aqr",lon:308.571,nature:"Neutre",symbole:"Bonne etoile des tentes",element:"Air",planete:"Mercure",description:"Stabilite et foyer. Manzil rural.",favorables:["Plantation","Agriculture","Foyer"],defavorables:["Commerce maritime"],mariage:"Favorable au foyer.",voyage:"Bon.",commerce:"Bon agricole.",sante:"Soins respiratoires.",agriculture:"Excellent arbres.",magie:"Stabilite."},
  {num:26,ar:"الفرغ المقدم",fr:"Al-Fargh al-Muqaddam",stars:"α β Peg",lon:321.429,nature:"Neutre",symbole:"Premiere ouverture",element:"Eau",planete:"Venus",description:"L eau commence a couler.",favorables:["Construction","Puits","Voyages","Irrigation"],defavorables:["Partenariats inegaux"],mariage:"Acceptable.",voyage:"Favorable.",commerce:"Immobilier.",sante:"Reins.",agriculture:"Irrigation.",magie:"Abondance."},
  {num:27,ar:"الفرغ المؤخر",fr:"Al-Fargh al-Muakhkhar",stars:"γ Peg α And",lon:334.286,nature:"Tres benefique",symbole:"Deuxieme ouverture",element:"Eau",planete:"Jupiter",description:"Plenitude. Avant-dernier et tres beni.",favorables:["Mariage","Commerce","Agriculture","Construction"],defavorables:["Dettes legeres"],mariage:"Excellent.",voyage:"Tres favorable.",commerce:"Excellent.",sante:"Excellent.",agriculture:"Excellent.",magie:"Abondance et plenitude."},
  {num:28,ar:"بطن الحوت",fr:"Batn al-Hut",stars:"β And Mirach",lon:347.143,nature:"Benefique",symbole:"Ventre du Poisson",element:"Eau",planete:"Lune",description:"Dernier manzil. Cloture bienheureuse.",favorables:["Commerce","Mariage","Agriculture","Mer"],defavorables:["Constructions permanentes"],mariage:"Favorable.",voyage:"Excellent maritime.",commerce:"Tres favorable.",sante:"Pieds.",agriculture:"Cotier.",magie:"Cloture et benediction."}
];

const DUAS = [
  {ar:"اللهم بارك لي فيما بدأت وأعني على إتمامه",fr:"O Allah, benis-moi dans ce que j ai commence et aide-moi a l achever.",occasion:"A reciter au debut de tout nouveau projet."},
  {ar:"اللهم اجعل سري أفضل من علانيتي",fr:"O Allah, fais que mon interieur soit meilleur que mon apparence.",occasion:"A reciter pour purifier les intentions secretes."},
  {ar:"اللهم أرنا الحق حقاً وارزقنا اتباعه",fr:"O Allah, montre-nous la verite comme verite et accorde-nous de la suivre.",occasion:"A reciter pour la guidance et la clarte."},
  {ar:"اللهم إني أعوذ بك من الهم والحزن",fr:"O Allah, je me refugie en Toi contre l anxiete et la tristesse.",occasion:"A reciter dans les moments de difficulte."},
  {ar:"رب اشرح لي صدري ويسر لي أمري",fr:"Seigneur, ouvre ma poitrine et facilite-moi mes affaires.",occasion:"A reciter avant toute guerison."},
  {ar:"اللهم إني أسألك العافية في الدنيا والآخرة",fr:"O Allah, je Te demande la sante en ce monde et dans l au-dela.",occasion:"A reciter dans les moments de besoin."},
  {ar:"اللهم اجعلنا من الشاكرين والذاكرين",fr:"O Allah, fais de nous des reconnaissants et de ceux qui Te glorifient.",occasion:"A reciter pour attirer la benediction."},
  {ar:"اللهم وسع لنا في رزقنا وبارك لنا فيه",fr:"O Allah, elargis notre subsistance et benis-la pour nous.",occasion:"A reciter pour le commerce."},
  {ar:"أعوذ بالله من الشيطان الرجيم",fr:"Je me refugie en Allah contre le diable maudit.",occasion:"A reciter pour se proteger."},
  {ar:"اللهم أنت ربي لا إله إلا أنت خلقتني",fr:"O Allah, Tu es mon Seigneur. Il n y a de dieu que Toi.",occasion:"Sayyid al-Istighfar."},
  {ar:"ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة",fr:"Seigneur, accorde-nous le bien en ce monde et dans l au-dela.",occasion:"A reciter pour toutes les bonnes entreprises."},
  {ar:"اللهم بارك لي في مالي وأهلي",fr:"O Allah, benis-moi dans mes biens et ma famille.",occasion:"A reciter pour le commerce."},
  {ar:"رب أعني ولا تعن علي وانصرني",fr:"Seigneur, aide-moi et ne donne pas aide contre moi.",occasion:"A reciter pour obtenir faveurs."},
  {ar:"اللهم إني أسألك من فضلك العظيم",fr:"O Allah, je Te demande de Ta grace immense.",occasion:"Sous Spica, le manzil le plus beni."},
  {ar:"سبحان الله وبحمده عدد خلقه",fr:"Gloire a Allah et Sa louange, au nombre de Ses creatures.",occasion:"A reciter pour les affaires discretes."},
  {ar:"حسبنا الله ونعم الوكيل",fr:"Allah nous suffit et Il est le meilleur garant.",occasion:"A reciter dans les moments de danger."},
  {ar:"اللهم ارزقنا الجنة وما قرب إليها",fr:"O Allah, accorde-nous le Paradis et ce qui nous en rapproche.",occasion:"A reciter apres chaque voyage."},
  {ar:"أعوذ بعزة الله وقدرته مما أجد وأحاذر",fr:"Je me refugie en la puissance d Allah contre ce que je ressens.",occasion:"A reciter pour la protection."},
  {ar:"اللهم إني أعوذ بك من زوال نعمتك",fr:"O Allah, je me refugie en Toi contre la disparition de Ta grace.",occasion:"A reciter pour preserver ses biens."},
  {ar:"ربنا هب لنا من أزواجنا وذرياتنا قرة أعين",fr:"Seigneur, accorde-nous de nos epoux et enfants la joie des yeux.",occasion:"A reciter pour la famille."},
  {ar:"اللهم أصلح لي ديني ودنياي وآخرتي",fr:"O Allah, rectifie pour moi ma religion, ma vie et mon au-dela.",occasion:"A reciter dans les moments de contrainte."},
  {ar:"اللهم اقسم لنا من خشيتك ما يحول بيننا وبين معاصيك",fr:"O Allah, accorde-nous de Ta crainte ce qui nous separe de Tes peches.",occasion:"Au debut des Saoud."},
  {ar:"اللهم اشفني شفاء لا يغادر سقماً",fr:"O Allah, gueris-moi d une guerison qui ne laisse aucune maladie.",occasion:"A reciter pour la guerison."},
  {ar:"اللهم أنت السلام ومنك السلام",fr:"O Allah, Tu es la Paix et de Toi vient la paix.",occasion:"Sous le manzil le plus fortune."},
  {ar:"رب زدني علماً وارزقني فهماً",fr:"Seigneur, augmente mes connaissances et accorde-moi la comprehension.",occasion:"A reciter pour l apprentissage."},
  {ar:"اللهم اجعل عواقب أمورنا خيراً",fr:"O Allah, fais que les issues de nos affaires soient bonnes.",occasion:"A reciter pour les constructions."},
  {ar:"اللهم بارك لنا فيما رزقتنا",fr:"O Allah, benis-nous dans ce que Tu nous as accorde.",occasion:"Avant la cloture du cycle."},
  {ar:"اللهم اختم لنا بخير واجعل عاقبتنا إلى خير",fr:"O Allah, cloture nos vies par le bien.",occasion:"Dernier manzil, cloture du cycle."}
];

const HADITHS = [
  {ar:"إنكم سترون ربكم كما ترون هذا القمر",fr:"Vous verrez votre Seigneur comme vous voyez cette lune.",source:"Bukhari et Muslim"},
  {ar:"هو الذي جعل الشمس ضياء والقمر نوراً وقدره منازل",fr:"C est Lui qui a fait du Soleil un eclat et de la Lune une lumiere, et Il lui a assigne des stations.",source:"Coran 10:5"},
  {ar:"يسألونك عن الأهلة قل هي مواقيت للناس والحج",fr:"Ils t interrogent sur les croissants de lune. Dis: Ce sont des indications de temps pour les hommes.",source:"Coran 2:189"},
  {ar:"والقمر قدرناه منازل حتى عاد كالعرجون القديم",fr:"Et la Lune, Nous lui avons assigne des stations jusqu a ce qu elle redevienne comme un vieux regime de dattes.",source:"Coran 36:39"}
];

const NATAL_INTERP = [
  {titre:"Ame pionniere",texte:"Ne sous An-Nath, tu es une ame de commencements. Tu as le don de lancer des projets et d inspirer les autres. Ibn Ajiba dit que les natifs de ce manzil sont destines a ouvrir des chemins nouveaux."},
  {titre:"Ame secrete",texte:"Ne sous Al-Butayn, tu possedes une profondeur interieure rare. Tu gardes bien les secrets et as une intuition puissante. Al-Buni dit que ces natifs voient ce que les autres ne voient pas."},
  {titre:"Ame prospere",texte:"Ne sous Ath-Thurayya, les Pleiades, tu portes une benediction naturelle. Commerce, voyage et relations sociales te reussissent. Ibn Ajiba dit que ces natifs sont benis dans leur subsistance."},
  {titre:"Ame batisseur",texte:"Ne sous Ad-Dabaran, tu as une volonte de fer et une resistance exceptionnelle. Les obstacles ne t arretent pas. Ce manzil forge des ames capables de traverser les epreuves."},
  {titre:"Ame guerisseur",texte:"Ne sous Al-Haqa, tu as un don naturel pour la guerison et l aide aux autres. Al-Buni dit que ces natifs portent la guerison dans leurs mains."},
  {titre:"Ame profonde",texte:"Ne sous Al-Hana, tu as une force interieure cachee. Tu excelles dans ce qui demande profondeur et rigueur. Ces natifs trouvent ce que les autres cherchent."},
  {titre:"Ame benie",texte:"Ne sous Adh-Dhira, Castor et Pollux, tu es parmi les plus chanceux. Amour, amitie et succes t accompagnent naturellement. Ibn Ajiba dit que ces natifs portent la benediction avec eux."},
  {titre:"Ame genereuse",texte:"Ne sous An-Nathra, tu as un coeur immense et une generosite naturelle. Al-Buni dit que ces natifs ouvrent les portes des coeurs."},
  {titre:"Ame reflechie",texte:"Ne sous At-Tarf, tu as une sagesse naturelle qui te pousse a observer avant d agir. Ces natifs evitent les erreurs que d autres commettent."},
  {titre:"Ame royale",texte:"Ne sous Al-Jabha, le front du Lion, tu portes une autorite naturelle. Ibn Ajiba dit que ces natifs sont nes pour commander avec justice."},
  {titre:"Ame voyageuse",texte:"Ne sous Az-Zubra, tu as l ame d un explorateur. Ces natifs prosperent loin de leur lieu de naissance."},
  {titre:"Ame transformatrice",texte:"Ne sous As-Sarfa, tu as le don de la transformation. Al-Buni dit que ces natifs transforment les difficultes en opportunites."},
  {titre:"Ame fidele",texte:"Ne sous Al-Awwa, tu es d une loyaute exemplaire. Ces natifs sont des piliers pour leur communaute."},
  {titre:"Ame benie de Spica",texte:"Ne sous As-Simak, Spica, tu es parmi les plus favorises. Ibn Ajiba dit que ces natifs portent la perle du ciel."},
  {titre:"Ame secrete gardienne",texte:"Ne sous Al-Ghafr, tu es un gardien naturel des secrets. Al-Buni dit que ces natifs portent les secrets de la terre."},
  {titre:"Ame guerriere",texte:"Ne sous Az-Zubana, tu as traverse des epreuves qui t ont forge. Ta force reside dans ta capacite a survivre et rebondir."},
  {titre:"Ame noble",texte:"Ne sous Al-Iklil, la couronne, tu portes une noblesse naturelle. Ibn Ajiba dit que ces natifs portent une couronne invisible."},
  {titre:"Ame puissante",texte:"Ne sous Al-Qalb, Antares, tu as une energie vitale exceptionnelle. Ces natifs laissent une marque indelebile."},
  {titre:"Ame protectrice",texte:"Ne sous Ash-Shawla, tu as un instinct de protection naturel. Al-Buni dit que ces natifs repoussent naturellement le mal."},
  {titre:"Ame de la nature",texte:"Ne sous An-Naim, tu es en harmonie profonde avec la nature. Ces natifs s epanouissent dans des environnements naturels."},
  {titre:"Ame solitaire",texte:"Ne sous Al-Balda, la ville vide, tu as une force solitaire unique. Ces natifs trouvent leur force dans la retraite."},
  {titre:"Ame fortunee",texte:"Ne sous Saad adh-Dhabih, tu inaugures une serie de chance. Ibn Ajiba dit que ces natifs ouvrent des portes de fortune."},
  {titre:"Ame transformatrice heureuse",texte:"Ne sous Saad Bula, tu as le don de transformer les difficultes en succes. Al-Buni dit que ces natifs avaleront leurs epreuves et prosperont."},
  {titre:"Ame de la chance supreme",texte:"Ne sous Saad as-Suud, la chance des chances, tu es parmi les plus benis. Ibn Ajiba dit que ces natifs portent la benediction divine dans leur souffle."},
  {titre:"Ame stable",texte:"Ne sous Saad al-Akhbiya, tu as une stabilite interieure rare. Ces natifs sont les gardiens de leurs familles."},
  {titre:"Ame abondante",texte:"Ne sous Al-Fargh al-Muqaddam, tu portes un flux naturel d abondance. Al-Buni dit que ces natifs ouvrent les vannes de la fortune."},
  {titre:"Ame de plenitude",texte:"Ne sous Al-Fargh al-Muakhkhar, tu es une ame de plenitude. Ibn Ajiba dit que ces natifs vivent dans l abondance permanente."},
  {titre:"Ame de cloture bienheureuse",texte:"Ne sous Batn al-Hut, le ventre du Poisson, tu clotures les cycles avec grace. Ces natifs finissent toujours bien ce qu ils commencent."}
];


// ─── Tafsir des versets sur la Lune ──────────────────────────────────────
const TAFSIR = [
  {
    verset:"وَالْقَمَرَ قَدَّرْنَاهُ مَنَازِلَ حَتَّى عَادَ كَالْعُرْجُونِ الْقَدِيمِ",
    ref:"Coran 36:39 - Sourate Ya-Sin",
    traduction:"Et la Lune, Nous lui avons assigne des stations jusqu a ce qu elle redevienne comme un vieux regime de dattes.",
    tafsir:"Ibn Kathir explique que Allah a cree la Lune avec des stations precises - les Manazil - pour que les hommes puissent compter le temps et organiser leur vie. Al-Tabari ajoute que chaque manzil est une sagesse divine : la Lune traverse 28 demeures en un mois lunaire, comme le Prophete Ibrahim traversait les epreuves une a une. La comparaison avec le regime de dattes montre le cycle parfait de la creation."
  },
  {
    verset:"هُوَ الَّذِي جَعَلَ الشَّمْسَ ضِيَاءً وَالْقَمَرَ نُورًا وَقَدَّرَهُ مَنَازِلَ لِتَعْلَمُوا عَدَدَ السِّنِينَ وَالْحِسَابَ",
    ref:"Coran 10:5 - Sourate Yunus",
    traduction:"C est Lui qui a fait du Soleil une lumiere eclatante et de la Lune une clarte, et Il lui a assigne des stations pour que vous sachiez le nombre des annees et le calcul du temps.",
    tafsir:"Al-Qurtubi commente : Allah a distingue la lumiere du Soleil (diyaa, active) de celle de la Lune (nour, reflechie) - une distinction astronomique remarquable pour l epoque. Les Manazil sont ici explicitement mentionnees comme outil de calcul du temps. Ibn Abbas rapporte que les Arabes utilisaient les 28 manzils pour determiner les saisons agricoles, les periodes de pluie et les moments propices aux voyages."
  },
  {
    verset:"يَسْأَلُونَكَ عَنِ الْأَهِلَّةِ قُلْ هِيَ مَوَاقِيتُ لِلنَّاسِ وَالْحَجِّ",
    ref:"Coran 2:189 - Sourate Al-Baqara",
    traduction:"Ils t interrogent sur les croissants de lune. Dis : Ce sont des reperes du temps pour les hommes et pour le pelerinage.",
    tafsir:"Ce verset fut revele quand les compagnons interrogerent le Prophete sur la signification du croissant de lune. La reponse divine est claire : la Lune est un calendrier naturel offert par Allah a l humanite. Ibn al-Qayyim explique que les phases lunaires servent de mawaqit (moments marques) pour les ibadaat : le Ramadan, le Hajj, la Zakat, la Idda. Chaque nouveau croissant est un recommencement, un appel a la renovation spirituelle."
  },
  {
    verset:"وَجَعَلْنَا اللَّيْلَ وَالنَّهَارَ آيَتَيْنِ فَمَحَوْنَا آيَةَ اللَّيْلِ وَجَعَلْنَا آيَةَ النَّهَارِ مُبْصِرَةً",
    ref:"Coran 17:12 - Sourate Al-Isra",
    traduction:"Et Nous avons fait de la nuit et du jour deux signes. Nous avons efface le signe de la nuit et fait du signe du jour un moyen de voir.",
    tafsir:"Al-Razi explique que la Lune est le signe de la nuit dont la lumiere a ete attenuation par rapport a celle du Soleil - non par accident mais par volonte divine. Cette alternance est une ayah, un signe, qui invite l homme a la contemplation. Les soufis comme Ibn Arabi voient dans la Lune le miroir qui reflète la lumiere du Soleil comme l ame du croyant reflète la lumiere divine."
  },
  {
    verset:"الشَّمْسُ وَالْقَمَرُ بِحُسْبَانٍ",
    ref:"Coran 55:5 - Sourate Ar-Rahman",
    traduction:"Le Soleil et la Lune suivent un calcul precis.",
    tafsir:"Ce verset court mais profond affirme que les mouvements du Soleil et de la Lune sont soumis a un husban - un calcul, une precision mathematique absolue. Ibn Kathir dit : cela signifie qu ils tournent en orbites precises, sans jamais devier. Les astronomes modernes confirment cette precision : on peut predire les positions lunaires avec une exactitude de quelques secondes sur des milliers d annees. C est cette precision divine qui permet les calculs des Manazil."
  }
];

// ─── Nuits importantes islamiques ─────────────────────────────────────────
const NUITS_IMPORTANTES = [
  {
    nom:"Laylat al-Qadr",
    arabe:"لَيْلَةُ الْقَدْرِ",
    description:"La Nuit du Destin, meilleure que mille mois. Allah revele les decrets de l annee. Les anges descendent en nombre.",
    periode:"Les 10 dernieres nuits du Ramadan, surtout les nuits impaires (21, 23, 25, 27, 29 Ramadan)",
    amalan:["Faire la priere de nuit (Tahajjud)","Reciter beaucoup le Coran","Faire ce Dua: Allahumma innaka Afuwwun tuhibbul afwa fa-fu anni","Faire du I tikaf","Demander pardon et faire du Dhikr abondamment"],
    verset:"إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ",
    color:"#9b59b6"
  },
  {
    nom:"Nuit du Mi raj",
    arabe:"لَيْلَةُ الْمِعْرَاج",
    description:"La nuit du voyage nocturne du Prophete Muhammad (saws) de La Mecque a Jerusalem puis vers les cieux. Institution des 5 prieres.",
    periode:"27 Rajab de chaque annee hijri",
    amalan:["Lire la Sira du Prophete","Faire des prieres supplementaires","Mediter sur le voyage celeste","Enseigner aux enfants l histoire du Mi raj"],
    verset:"سُبْحَانَ الَّذِي أَسْرَى بِعَبْدِهِ لَيْلًا مِّنَ الْمَسْجِدِ الْحَرَامِ إِلَى الْمَسْجِدِ الْأَقْصَى",
    color:"#27ae60"
  },
  {
    nom:"Nuit de Baraa",
    arabe:"لَيْلَةُ الْبَرَاءَة",
    description:"La nuit du 15 Shaban. Selon certains savants, Allah regarde Sa creation avec misericorde et pardonne a beaucoup. Les destins de l annee sont confirmes.",
    periode:"Nuit du 14 au 15 Shaban (milieu du mois de Shaban)",
    amalan:["Faire des prieres de nuit","Demander pardon (Istighfar)","Visiter les tombes","Faire du Sadaqa (charite)","Jeune du 15 Shaban"],
    verset:"إِنَّا أَنزَلْنَاهُ فِي لَيْلَةٍ مُّبَارَكَةٍ",
    color:"#e67e22"
  },
  {
    nom:"Nuit du 1er Muharram",
    arabe:"رَأْسُ السَّنَةِ الْهِجْرِيَّة",
    description:"Debut de la nouvelle annee islamique. Nuit de reflexion, de gratitude et de renouveau spirituel. Le Prophete recommandait le jeune du 10 Muharram (Achoura).",
    periode:"1er Muharram de chaque annee hijri - Nouvel An islamique",
    amalan:["Faire du bilan spirituel de l annee","Fixer des objectifs islamiques pour la nouvelle annee","Reciter des Salawat sur le Prophete","Preparer le jeune d Achoura (9 et 10 Muharram)"],
    verset:"إِنَّ عِدَّةَ الشُّهُورِ عِندَ اللَّهِ اثْنَا عَشَرَ شَهْرًا",
    color:"#C9A84C"
  },
  {
    nom:"Nuit de l Aid al-Fitr",
    arabe:"لَيْلَةُ الْعِيد",
    description:"La nuit precedant l Eid al-Fitr est une nuit de celebration spirituelle. Le Prophete (saws) disait que celui qui anime cette nuit en ibadah aura son coeur vivant le jour de la mort des coeurs.",
    periode:"Nuit du 29 ou 30 Ramadan au 1er Shawwal",
    amalan:["Prononcer le Takbir (Allahu Akbar)","Payer la Zakat al-Fitr","Faire des prieres supplementaires","Remercier Allah pour le Ramadan","Preparer la priere de l Eid"],
    verset:"وَلِتُكْمِلُوا الْعِدَّةَ وَلِتُكَبِّرُوا اللَّهَ عَلَى مَا هَدَاكُمْ",
    color:"#2ecc71"
  }
];

// ─── Dhikr selon le manzil ────────────────────────────────────────────────
const DHIKR_MANAZIL = [
  {dhikr:"سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",count:"100x",fr:"Gloire a Allah et Sa louange",conseil:"Reciter au debut de chaque projet ou voyage."},
  {dhikr:"اللَّهُمَّ احْفَظْنِي مِنَ الشَّيَاطِينِ",count:"7x",fr:"O Allah protege-moi des demons",conseil:"Reciter pour proteger les affaires secretes."},
  {dhikr:"اللَّهُمَّ بَارِكْ لَنَا فِي رِزْقِنَا",count:"33x",fr:"O Allah benis notre subsistance",conseil:"Reciter pour attirer l abondance et la prosperite."},
  {dhikr:"أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ",count:"100x",fr:"Je demande pardon a Allah le Tres Grand",conseil:"Reciter dans les periodes difficiles de ce manzil."},
  {dhikr:"رَبِّ اشْرَحْ لِي صَدْرِي",count:"21x",fr:"Seigneur ouvre ma poitrine",conseil:"Reciter pour faciliter la guerison et la liberation."},
  {dhikr:"لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",count:"100x",fr:"Il n y a de force qu en Allah",conseil:"Reciter pour surmonter les contraintes de ce manzil."},
  {dhikr:"اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ",count:"1000x",fr:"O Allah envoie Ta benediction sur Muhammad",conseil:"Ce manzil tres beni amplifie la Salawat."},
  {dhikr:"يَا رَحْمَانُ يَا رَحِيمُ",count:"100x",fr:"O Misericordieux o Clement",conseil:"Invoquer les noms de misericorde pour ce manzil."},
  {dhikr:"أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ",count:"3x",fr:"Je me refugie dans les paroles parfaites d Allah",conseil:"Protection contre les influences de ce manzil difficile."},
  {dhikr:"سُبْحَانَ اللَّهِ الْعَظِيمِ",count:"100x",fr:"Gloire au Tres Grand Allah",conseil:"Ce dhikr eleve le rang - ideal pour ce manzil d autorite."},
  {dhikr:"اللَّهُمَّ يَسِّرْ وَلَا تُعَسِّرْ",count:"33x",fr:"O Allah facilite et ne complique pas",conseil:"Pour les voyages et deplacements de ce manzil."},
  {dhikr:"رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً",count:"70x",fr:"Seigneur accorde nous le bien en ce monde",conseil:"Dhikr de transition pour ce manzil de changement."},
  {dhikr:"اللَّهُمَّ أَعِنِّي عَلَى شُكْرِكَ",count:"33x",fr:"O Allah aide moi a T etre reconnaissant",conseil:"Ce manzil favorise la gratitude et la loyalty."},
  {dhikr:"يَا فَتَّاحُ يَا عَلِيمُ",count:"71x",fr:"O Ouvreur o Omniscient",conseil:"Invoquer Al-Fattah sous Spica pour ouvrir les portes."},
  {dhikr:"اللَّهُمَّ سَتَّارَ الْعُيُوبِ",count:"100x",fr:"O Allah Voileur des defauts",conseil:"Ce manzil du secret est ideal pour demander voilement."},
  {dhikr:"حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",count:"450x",fr:"Allah nous suffit - Il est le meilleur garant",conseil:"Protection maximale pendant ce manzil difficile."},
  {dhikr:"اللَّهُمَّ انْصُرْنَا وَلَا تَنْصُرْ عَلَيْنَا",count:"41x",fr:"O Allah donne nous la victoire",conseil:"Ce manzil de couronne favorise la victoire."},
  {dhikr:"لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ",count:"100x",fr:"Il n y a de dieu qu Allah seul",conseil:"Le dhikr le plus puissant pour ce manzil intense."},
  {dhikr:"اللَّهُمَّ احْفَظْنِي مِنَ الشَّرِّ",count:"7x",fr:"O Allah protege moi du mal",conseil:"Protection essentielle sous ce manzil du dard."},
  {dhikr:"سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ",count:"33x/33x",fr:"Gloire a Allah et louange a Allah",conseil:"Dhikr d harmonie pour ce manzil de la nature."},
  {dhikr:"لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ",count:"100x",fr:"Il n y a de dieu que Toi gloire a Toi",conseil:"Dhikr de Yunus pour sortir de l isolement."},
  {dhikr:"اللَّهُمَّ افْتَحْ لَنَا أَبْوَابَ الْخَيْرِ",count:"70x",fr:"O Allah ouvre nous les portes du bien",conseil:"Debut des Sa oud - invoquer l ouverture."},
  {dhikr:"اللَّهُمَّ اشْفِنِي شِفَاءً كَامِلًا",count:"7x",fr:"O Allah gueris moi d une guerison complete",conseil:"Ce manzil absorbe le mal - ideal pour la guerison."},
  {dhikr:"اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ",count:"33x",fr:"O Allah Tu es la Paix et de Toi vient la paix",conseil:"Saad as-Suud - le plus fortune. Abonder en paix."},
  {dhikr:"رَبِّ زِدْنِي عِلْمًا",count:"100x",fr:"Seigneur augmente mes connaissances",conseil:"Parfait pour ce manzil de stabilite et d apprentissage."},
  {dhikr:"اللَّهُمَّ بَارِكْ فِي مَا رَزَقْتَنَا",count:"33x",fr:"O Allah benis ce que Tu nous as donne",conseil:"Premiere ouverture - benir l abondance naissante."},
  {dhikr:"اللَّهُمَّ أَتْمِمْ عَلَيْنَا نِعْمَتَكَ",count:"33x",fr:"O Allah complete Ta grace sur nous",conseil:"Deuxieme ouverture - plenitude. Demander l achevement."},
  {dhikr:"اللَّهُمَّ اخْتِمْ لَنَا بِخَيْرٍ",count:"41x",fr:"O Allah cloture nos vies par le bien",conseil:"Dernier manzil - cloture du cycle avec gratitude."}
];

// ─── Eclipses lunaires ────────────────────────────────────────────────────
const ECLIPSES = [
  {date:"2025-03-14",type:"Penombrale",nom:"Eclipse de Mars 2025",heure:"06:59",visible:"Ameriques, Europe, Afrique de l Ouest",magnitude:"1.178",duree:"~4h",manzil:14,conseil:"Eclipse visible depuis Dakar. Moment de forte energie spirituelle. Faire du Dhikr et de la priere."},
  {date:"2025-09-07",type:"Totale",nom:"Eclipse totale de Septembre 2025",heure:"18:11",visible:"Europe, Afrique, Asie",magnitude:"1.361",duree:"~3h28min",manzil:28,conseil:"Eclipse totale visible depuis Dakar. Grande importance spirituelle. La tradition recommande la Salat al-Kusuf."},
  {date:"2026-03-03",type:"Totale",nom:"Eclipse totale de Mars 2026",heure:"23:34",visible:"Ameriques, Europe occidentale, Afrique",magnitude:"1.155",duree:"~3h27min",manzil:7,conseil:"Eclipse sous le manzil Adh-Dhira, l un des plus benis. Double benediction."},
  {date:"2026-08-28",type:"Partielle",nom:"Eclipse partielle d Aout 2026",heure:"04:13",visible:"Afrique, Europe, Asie",magnitude:"0.928",duree:"~3h18min",manzil:21,conseil:"Eclipse partielle. Moment de reflexion et de purification."},
  {date:"2027-02-20",type:"Penombrale",nom:"Eclipse penombrale Fevrier 2027",heure:"23:13",visible:"Ameriques, Europe, Afrique",magnitude:"1.065",duree:"~4h10min",manzil:15,conseil:"Eclipse sous Al-Ghafr, manzil du secret. Moment de purification interieure."},
  {date:"2028-01-12",type:"Totale",nom:"Eclipse totale Janvier 2028",heure:"04:13",visible:"Afrique, Europe, Asie",magnitude:"1.238",duree:"~3h31min",manzil:3,conseil:"Eclipse sous les Pleiades, manzil tres beni. Periode de grande prosperite spirituelle."}
];

// ─── CSS Animations ───────────────────────────────────────────────────────
const ANIM_CSS = `
@keyframes blink{0%,100%{opacity:1}50%{opacity:.1}}
@keyframes eq{from{transform:scaleY(.2)}to{transform:scaleY(1)}}
@keyframes twinkle{0%,100%{opacity:.1;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(200,168,76,.4)}50%{box-shadow:0 0 0 8px rgba(200,168,76,0)}}
.fade-up{animation:fadeUp .35s ease both}
.moon-float{animation:float 4s ease-in-out infinite}
`;

// ─── StarField ────────────────────────────────────────────────────────────
function StarField() {
  var stars = Array.from({length:55},function(_,i){return{
    id:i, x:Math.random()*100, y:Math.random()*100,
    size:Math.random()*1.8+0.4, delay:Math.random()*4,
    dur:Math.random()*3+2
  };});
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
      <style>{ANIM_CSS}</style>
      {stars.map(function(s){return (
        <div key={s.id} style={{
          position:"absolute",left:s.x+"%",top:s.y+"%",
          width:s.size,height:s.size,borderRadius:"50%",background:"white",
          animation:"twinkle "+s.dur+"s "+s.delay+"s ease-in-out infinite"
        }}/>
      );})}
    </div>
  );
}

// ─── MoonSVG ──────────────────────────────────────────────────────────────
function MoonSVG(props) {
  var ph = props.ph;
  var size = props.size || 100;
  var r=size/2, cx=r, cy=r, rx=r*0.88;
  var isWax=parseFloat(ph.age)<14.76, ill=ph.pct/100;
  var k=isWax?(2*ill-1):(1-2*(ill-0.5));
  var term=rx*Math.abs(k);
  var sw=isWax?(ill>0.5?1:0):(ill>0.5?0:1);
  return (
    <svg width={size} height={size} viewBox={"0 0 "+size+" "+size}>
      <defs>
        <radialGradient id="ms" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#d4c5a9"/>
          <stop offset="100%" stopColor="#8a7a5a"/>
        </radialGradient>
        <radialGradient id="md" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1630"/>
          <stop offset="100%" stopColor="#0a0820"/>
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="#C9A84C11"/>
      <ellipse cx={cx} cy={cy} rx={rx} ry={rx} fill="url(#md)" opacity="0.95"/>
      {ph.pct>2&&ph.pct<98?(
        <path d={"M "+cx+" "+(cy-rx)+" A "+rx+" "+rx+" 0 1 "+(isWax?1:0)+" "+cx+" "+(cy+rx)+" A "+term+" "+rx+" 0 1 "+sw+" "+cx+" "+(cy-rx)+" Z"} fill="url(#ms)" opacity="0.95"/>
      ):ph.pct>=98?(
        <ellipse cx={cx} cy={cy} rx={rx} ry={rx} fill="url(#ms)" opacity="0.95"/>
      ):null}
      <circle cx={cx-rx*0.2} cy={cy-rx*0.1} r={rx*0.07} fill="#00000022"/>
      <ellipse cx={cx} cy={cy} rx={rx} ry={rx} fill="none" stroke="#C9A84C55" strokeWidth="1"/>
    </svg>
  );
}

// ─── Manzil Wheel ─────────────────────────────────────────────────────────
function ManzilWheel(props) {
  var md=props.md, t=props.t;
  var sel=useState(md?md.manzilIdx:0);
  var selIdx=sel[0], setSel=sel[1];
  useEffect(function(){if(md)setSel(md.manzilIdx);},[md]);
  var sz=300, cx=sz/2, cy=sz/2;
  var oR=sz*0.46, iR=sz*0.29, lR=sz*0.38, mR=sz*0.195, dotR=sz*0.034;
  var lon=md?parseFloat(md.lon):0;
  var m=MANAZIL[selIdx];
  var nc=NC[m.nature]||t.accent;
  return (
    <div style={{textAlign:"center"}}>
      <svg width={sz} height={sz} viewBox={"0 0 "+sz+" "+sz} style={{display:"block",margin:"0 auto"}}>
        <defs>
          <radialGradient id="wb" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1B1464" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#07061a" stopOpacity="0.95"/>
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <circle cx={cx} cy={cy} r={oR+6} fill="url(#wb)" stroke="#C9A84C22" strokeWidth="1"/>
        <circle cx={cx} cy={cy} r={oR} fill="none" stroke="#C9A84C33" strokeWidth="1"/>
        <circle cx={cx} cy={cy} r={iR} fill="none" stroke="#C9A84C22" strokeWidth="1"/>
        {MANAZIL.map(function(mz,i){
          var a1=(i*MS-90)*Math.PI/180, a2=((i+1)*MS-90)*Math.PI/180;
          var x1=cx+oR*Math.cos(a1), y1=cy+oR*Math.sin(a1);
          var x2=cx+oR*Math.cos(a2), y2=cy+oR*Math.sin(a2);
          var x3=cx+iR*Math.cos(a2), y3=cy+iR*Math.sin(a2);
          var x4=cx+iR*Math.cos(a1), y4=cy+iR*Math.sin(a1);
          var c=NC[mz.nature]||"#C9A84C";
          var act=i===(md?md.manzilIdx:-1), isSel=i===selIdx;
          var ma=(i+0.5)*MS-90;
          var lx=cx+lR*Math.cos(ma*Math.PI/180), ly=cy+lR*Math.sin(ma*Math.PI/180);
          return (
            <g key={i} onClick={function(){setSel(i);}} style={{cursor:"pointer"}}>
              <path d={"M "+x1+" "+y1+" A "+oR+" "+oR+" 0 0 1 "+x2+" "+y2+" L "+x3+" "+y3+" A "+iR+" "+iR+" 0 0 0 "+x4+" "+y4+" Z"}
                fill={act?(c+"55"):(isSel?(c+"25"):(c+"0d"))}
                stroke={act?c:(isSel?(c+"88"):(c+"33"))}
                strokeWidth={act?2:0.5}/>
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                fill={act?c:(c+"77")} fontSize={sz*0.028} fontWeight={act?"bold":"normal"}>{i+1}</text>
            </g>
          );
        })}
        {(function(){
          var ma=(lon-90)*Math.PI/180;
          var mx=cx+mR*Math.cos(ma), my=cy+mR*Math.sin(ma);
          return (
            <g filter="url(#glow)">
              <circle cx={mx} cy={my} r={dotR+3} fill="#C9A84C22"/>
              <circle cx={mx} cy={my} r={dotR} fill="#e8c97a" stroke="#C9A84C" strokeWidth="1.5"/>
              <text x={mx} y={my} textAnchor="middle" dominantBaseline="middle" fontSize={dotR*1.1} fill="#07061a">☽</text>
            </g>
          );
        })()}
        <circle cx={cx} cy={cy} r={iR-2} fill="#07061a" opacity="0.85"/>
        <text x={cx} y={cy-8} textAnchor="middle" fontSize={sz*0.034} fill="#C9A84C" fontWeight="bold">منازل</text>
        <text x={cx} y={cy+9} textAnchor="middle" fontSize={sz*0.026} fill="#e8c97a88">القمر</text>
      </svg>
      <div style={{background:t.rowBg,border:"1px solid "+nc+"44",borderRadius:12,padding:"10px 14px",marginTop:8,textAlign:"center"}}>
        <div style={{fontSize:9,color:t.textMuted,marginBottom:3,fontWeight:"bold"}}>Manzil #{selIdx+1} {selIdx===(md?md.manzilIdx:-1)?"- Lune ici":""}</div>
        <div style={{fontSize:20,color:t.accentSoft,direction:"rtl",marginBottom:2,fontWeight:"bold"}}>{m.ar}</div>
        <div style={{fontSize:13,color:t.textLight,marginBottom:4,fontWeight:"bold"}}>{m.fr}</div>
        <span style={{fontSize:10,background:nc+"22",color:nc,border:"1px solid "+nc+"44",borderRadius:20,padding:"2px 8px",fontWeight:"bold"}}>{m.nature}</span>
      </div>
    </div>
  );
}

// ─── RolesCard ────────────────────────────────────────────────────────────
function RolesCard(props) {
  var manzil=props.manzil, t=props.t;
  var open=useState(false); var isOpen=open[0]; var setOpen=open[1];
  var c=NC[manzil.nature]||t.accent;
  var roles=[
    {icon:"💒",label:"Mariage",text:manzil.mariage},
    {icon:"✈",label:"Voyage",text:manzil.voyage},
    {icon:"💰",label:"Commerce",text:manzil.commerce},
    {icon:"🌿",label:"Agriculture",text:manzil.agriculture},
    {icon:"🏥",label:"Sante",text:manzil.sante},
    {icon:"🔮",label:"Magie",text:manzil.magie}
  ];
  return (
    <div style={{background:t.rowBg,border:"1px solid "+t.accent+"33",borderRadius:14,padding:14,marginBottom:10}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
        <span style={{fontSize:10,borderRadius:20,padding:"3px 8px",fontWeight:"bold",background:c+"22",color:c,border:"1px solid "+c+"55"}}>{manzil.nature}</span>
        <span style={{fontSize:10,color:t.textMuted,fontWeight:"bold"}}>{manzil.symbole}</span>
      </div>
      <p style={{fontSize:11,color:t.textMuted,lineHeight:1.7,marginBottom:12,borderLeft:"2px solid "+t.accent+"44",paddingLeft:8,fontWeight:"600"}}>{manzil.description}</p>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <div style={{flex:1}}>
          <div style={{fontSize:11,color:t.textLight,marginBottom:6,fontWeight:"bold"}}>A faire</div>
          {manzil.favorables.map(function(r,i){return(
            <div key={i} style={{display:"flex",alignItems:"flex-start",marginBottom:5}}>
              <span style={{color:"#4ecf8a",marginRight:6,fontSize:10}}>●</span>
              <span style={{fontSize:10,color:t.textMuted,lineHeight:1.4,fontWeight:"600"}}>{r}</span>
            </div>
          );})}
        </div>
        <div style={{width:1,background:t.accent+"22",margin:"0 4px"}}/>
        <div style={{flex:1}}>
          <div style={{fontSize:11,color:t.textLight,marginBottom:6,fontWeight:"bold"}}>A eviter</div>
          {manzil.defavorables.map(function(r,i){return(
            <div key={i} style={{display:"flex",alignItems:"flex-start",marginBottom:5}}>
              <span style={{color:"#e07a5f",marginRight:6,fontSize:10}}>●</span>
              <span style={{fontSize:10,color:t.textMuted,lineHeight:1.4,fontWeight:"600"}}>{r}</span>
            </div>
          );})}
        </div>
      </div>
      <button onClick={function(){setOpen(!isOpen);}}
        style={{width:"100%",background:t.accent+"11",border:"1px solid "+t.accent+"33",borderRadius:8,padding:"8px",color:t.accentSoft,fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:"bold",marginBottom:isOpen?10:0}}>
        {isOpen?"Masquer les roles detailles":"Voir Mariage, Voyage, Commerce..."}
      </button>
      {isOpen&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {roles.map(function(r){return(
            <div key={r.label} style={{background:t.accent+"08",border:"1px solid "+t.accent+"22",borderRadius:10,padding:"10px"}}>
              <div style={{fontSize:13,marginBottom:3}}>{r.icon}</div>
              <div style={{fontSize:10,color:t.accentSoft,fontWeight:"bold",marginBottom:3}}>{r.label}</div>
              <div style={{fontSize:10,color:t.textMuted,lineHeight:1.5,fontWeight:"600"}}>{r.text}</div>
            </div>
          );})}
        </div>
      )}
    </div>
  );
}

// ─── MoonSunPos ───────────────────────────────────────────────────────────
function MoonSunPos(props) {
  var md=props.md, sys=props.sys, t=props.t;
  var sg=sys==="sidereal"?md.signeSid:md.signeTrop;
  return (
    <div style={{background:t.cardBg,border:"1px solid "+t.accent+"44",borderRadius:14,padding:"14px",marginBottom:10}}>
      <div style={{fontSize:10,color:t.textMuted,letterSpacing:2,marginBottom:10,textAlign:"center",fontWeight:"bold"}}>POSITIONS CELESTES</div>
      <div style={{display:"flex",gap:10}}>
        <div style={{flex:1,background:t.accent+"11",border:"1px solid "+t.accent+"33",borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
          <div style={{fontSize:10,color:t.textMuted,marginBottom:3,fontWeight:"bold"}}>LUNE</div>
          <div style={{fontSize:22,marginBottom:3}}>{sg.signe.emoji}</div>
          <div style={{fontSize:15,fontWeight:"bold",color:t.accentSoft,marginBottom:2}}>{sg.signe.fr}</div>
          <div style={{fontSize:11,color:t.textMuted,direction:"rtl",marginBottom:5,fontWeight:"600"}}>{sg.signe.ar}</div>
          <div style={{fontSize:17,color:t.accent,fontWeight:"bold"}}>{sg.deg}° {sg.min}'</div>
          <div style={{fontSize:10,color:t.textMuted,marginTop:2,fontWeight:"bold"}}>Manzil #{md.manzilIdx+1}</div>
        </div>
        {md.sunSigne&&(
          <div style={{flex:1,background:"#e8c97a11",border:"1px solid #e8c97a33",borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
            <div style={{fontSize:10,color:t.textMuted,marginBottom:3,fontWeight:"bold"}}>SOLEIL</div>
            <div style={{fontSize:22,marginBottom:3}}>{md.sunSigne.signe.emoji}</div>
            <div style={{fontSize:15,fontWeight:"bold",color:"#e8c97a",marginBottom:2}}>{md.sunSigne.signe.fr}</div>
            <div style={{fontSize:11,color:t.textMuted,direction:"rtl",marginBottom:5,fontWeight:"600"}}>{md.sunSigne.signe.ar}</div>
            <div style={{fontSize:17,color:"#C9A84C",fontWeight:"bold"}}>{md.sunSigne.deg}° {md.sunSigne.min}'</div>
            <div style={{fontSize:10,color:t.textMuted,marginTop:2,fontWeight:"bold"}}>{sys==="sidereal"?"Sideral":"Tropical"}</div>
          </div>
        )}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:10,paddingTop:8,borderTop:"1px solid "+t.accent+"22"}}>
        {[["λ Tropical",md.lonTrop],["λ Sideral",md.lonSid],["Ayanamsa",md.aya]].map(function(item){return(
          <div key={item[0]} style={{textAlign:"center",flex:1}}>
            <div style={{fontSize:10,color:t.textMuted,marginBottom:2,fontWeight:"bold"}}>{item[0]}</div>
            <div style={{fontSize:12,color:t.accentSoft,fontWeight:"bold"}}>{item[1]}°</div>
          </div>
        );})}
      </div>
    </div>
  );
}

// ─── Lunar Countdown ──────────────────────────────────────────────────────
function LunarCountdown(props) {
  var date=props.date, t=props.t;
  var events=nextLunarEvent(date);
  function fmtDate(d){return d.toLocaleDateString("fr-FR",{weekday:"short",day:"2-digit",month:"short"});}
  return (
    <div style={{display:"flex",gap:8,marginBottom:10}}>
      {[{emoji:"🌑",name:"Nouvelle Lune",data:events.newMoon,color:"#8a9fc4"},
        {emoji:"🌕",name:"Pleine Lune",data:events.fullMoon,color:"#e8c97a"}
      ].map(function(item){return(
        <div key={item.name} style={{flex:1,background:t.rowBg,border:"1px solid "+item.color+"33",borderRadius:12,padding:"12px",textAlign:"center"}}>
          <div style={{fontSize:22,marginBottom:3}}>{item.emoji}</div>
          <div style={{fontSize:10,color:t.textMuted,marginBottom:5,fontWeight:"bold"}}>{item.name}</div>
          <div style={{fontSize:20,color:item.color,fontWeight:"bold",marginBottom:2}}>{item.data.days}j</div>
          <div style={{fontSize:10,color:t.textMuted,fontWeight:"bold"}}>{fmtDate(item.data.date)}</div>
        </div>
      );})}
    </div>
  );
}

// ─── ShareBtn ─────────────────────────────────────────────────────────────
function ShareBtn(props) {
  var md=props.md, ph=props.ph, t=props.t, hijriDate=props.hijriDate;
  function share(){
    if(!md)return;
    var m=md.manzil;
    var hijriStr=hijriDate?hijriDate.display:"";
    var text="🌙 Manazil Al-Qamar du jour\n\n"+
      new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})+"\n"+
      hijriStr+"\n\n"+
      "Manzil #"+(md.manzilIdx+1)+" - "+m.ar+"\n"+
      m.fr+" - "+m.symbole+"\n"+
      "Nature: "+m.nature+"\n\n"+
      ph.emoji+" Phase: "+ph.name+" ("+ph.age+" jours)\n"+
      "Entree: "+fmtT(md.entryTime)+" - Sortie: "+fmtT(md.exitTime)+"\n\n"+
      "A faire: "+m.favorables.slice(0,2).join(", ")+"\n"+
      "A eviter: "+m.defavorables.slice(0,2).join(", ")+"\n\n"+
      "manazil-senastro.com";
    window.open("https://wa.me/?text="+encodeURIComponent(text),"_blank");
  }
  return (
    <button onClick={share} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"#25D366",border:"none",borderRadius:12,padding:"13px",color:"white",fontSize:14,fontWeight:"bold",cursor:"pointer",marginBottom:10,fontFamily:"inherit"}}>
      Partager sur WhatsApp
    </button>
  );
}

// ─── BookBanner ───────────────────────────────────────────────────────────
function BookBanner() {
  return (
    <div onClick={function(){window.open("https://wa.me/221764265550","_blank");}}
      style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:"linear-gradient(135deg,#1a0a00 0%,#2d1500 50%,#1a0a00 100%)",borderBottom:"2px solid #C9A84C",cursor:"pointer"}}>
      <div style={{fontSize:26}}>📚</div>
      <div style={{flex:1}}>
        <div style={{fontSize:13,color:"#e8c97a",fontWeight:"bold",marginBottom:2}}>Les Manazil Al-Qamar</div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:11,color:"#C9A84C",fontWeight:"bold"}}>FR + Wolof</span>
          <span style={{fontSize:9,background:"#2ecc71",color:"white",borderRadius:10,padding:"1px 7px",fontWeight:"bold"}}>-50%</span>
        </div>
      </div>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:13,color:"#e8c97a",fontWeight:"bold",marginBottom:3}}>6.900 F</div>
        <div style={{fontSize:10,background:"#25D366",color:"white",borderRadius:8,padding:"4px 8px",fontWeight:"bold"}}>Commander</div>
      </div>
    </div>
  );
}

// ─── MonthCal ─────────────────────────────────────────────────────────────
function MonthCal(props) {
  var selDate=props.selDate, setSelDate=props.setSelDate, sys=props.sys, setTab=props.setTab, t=props.t;
  var vd=useState(new Date(selDate)); var viewDate=vd[0]; var setVd=vd[1];
  var getLon=sys==="sidereal"?moonSid:moonTrop;
  var Y=viewDate.getFullYear(), M=viewDate.getMonth();
  var first=new Date(Y,M,1), last=new Date(Y,M+1,0);
  var dow=(first.getDay()+6)%7;
  var days=[]; for(var i=0;i<dow;i++)days.push(null); for(var j=1;j<=last.getDate();j++)days.push(j);
  var mn=["Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Decembre"];
  var today=new Date();
  return (
    <div>
      <h3 style={{color:t.accent,fontSize:14,letterSpacing:2,marginBottom:12,fontWeight:"bold"}}>Calendrier Lunaire</h3>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <button onClick={function(){setVd(new Date(Y,M-1,1));}} style={{background:t.rowBg,border:"1px solid "+t.accent+"33",borderRadius:8,padding:"6px 12px",color:t.accentSoft,cursor:"pointer",fontSize:16,fontWeight:"bold"}}>◀</button>
        <span style={{color:t.accentSoft,fontSize:14,fontWeight:"bold"}}>{mn[M]} {Y}</span>
        <button onClick={function(){setVd(new Date(Y,M+1,1));}} style={{background:t.rowBg,border:"1px solid "+t.accent+"33",borderRadius:8,padding:"6px 12px",color:t.accentSoft,cursor:"pointer",fontSize:16,fontWeight:"bold"}}>▶</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>
        {["Lu","Ma","Me","Je","Ve","Sa","Di"].map(function(d){return(
          <div key={d} style={{textAlign:"center",fontSize:10,color:t.textMuted,padding:"4px 0",fontWeight:"bold"}}>{d}</div>
        );})}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
        {days.map(function(day,i){
          if(!day)return <div key={i}/>;
          var d=new Date(Y,M,day,12,0,0);
          var lon=getLon(jd(d)); var idx=mIdx(lon);
          var ph=phase(d); var c=NC[MANAZIL[idx].nature]||t.accent;
          var isT=d.getDate()===today.getDate()&&d.getMonth()===today.getMonth()&&d.getFullYear()===today.getFullYear();
          var isS=d.getDate()===selDate.getDate()&&d.getMonth()===selDate.getMonth()&&d.getFullYear()===selDate.getFullYear();
          return (
            <div key={i} onClick={function(){setSelDate(d);setTab("today");}}
              style={{background:isS?(t.accent+"44"):(isT?(t.accent+"22"):(c+"11")),border:isS?("1px solid "+t.accent):(isT?("1px solid "+t.accent+"66"):("1px solid "+c+"22")),borderRadius:6,padding:"4px 2px",textAlign:"center",cursor:"pointer",minHeight:46}}>
              <div style={{fontSize:12,color:isT?t.accentSoft:t.textLight,fontWeight:"bold"}}>{day}</div>
              <div style={{fontSize:13}}>{ph.emoji}</div>
              <div style={{fontSize:9,color:c,fontWeight:"bold"}}>{idx+1}</div>
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:12,justifyContent:"center"}}>
        {Object.entries(NC).map(function(entry){return(
          <div key={entry[0]} style={{display:"flex",alignItems:"center",gap:4}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:entry[1]}}/>
            <span style={{fontSize:10,color:t.textMuted,fontWeight:"bold"}}>{entry[0]}</span>
          </div>
        );})}
      </div>
    </div>
  );
}

// ─── FavorableDates ───────────────────────────────────────────────────────
function FavorableDates(props) {
  var sys=props.sys, t=props.t;
  var flt=useState("mariage"); var filter=flt[0]; var setFilter=flt[1];
  var getLon=sys==="sidereal"?moonSid:moonTrop;
  var filters=[{key:"mariage",icon:"💒",label:"Mariage"},{key:"voyage",icon:"✈",label:"Voyage"},{key:"commerce",icon:"💰",label:"Commerce"},{key:"sante",icon:"🏥",label:"Sante"},{key:"agriculture",icon:"🌿",label:"Agriculture"}];
  var days=Array.from({length:30},function(_,i){var d=new Date();d.setDate(d.getDate()+i);d.setHours(12,0,0,0);return d;});
  var results=days.map(function(d){var lon=getLon(jd(d));var idx=mIdx(lon);var m=MANAZIL[idx];var ph=phase(d);var isFav=["Tres benefique","Benefique"].includes(m.nature);return{date:d,manzil:m,idx:idx,ph:ph,isFav:isFav};}).filter(function(r){return r.isFav;});
  var mn=["Jan","Fev","Mar","Avr","Mai","Jun","Jul","Aou","Sep","Oct","Nov","Dec"];
  var jours=["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
  return (
    <div>
      <h3 style={{color:t.accent,fontSize:14,letterSpacing:2,marginBottom:8,fontWeight:"bold"}}>Dates Favorables - 30 jours</h3>
      <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
        {filters.map(function(f){return(
          <button key={f.key} onClick={function(){setFilter(f.key);}
          } style={{flexShrink:0,padding:"6px 10px",background:filter===f.key?(t.accent+"33"):"none",border:filter===f.key?("1px solid "+t.accent+"99"):("1px solid "+t.accent+"22"),borderRadius:20,color:filter===f.key?t.accentSoft:t.textMuted,fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:"bold",whiteSpace:"nowrap"}}>
            {f.icon} {f.label}
          </button>
        );})}
      </div>
      {results.map(function(r,i){
        var c=NC[r.manzil.nature]||t.accent;
        var cur=filters.find(function(f){return f.key===filter;});
        return (
          <div key={i} style={{background:t.rowBg,border:"1px solid "+c+"44",borderRadius:14,padding:"14px",marginBottom:10,position:"relative"}}>
            <div style={{position:"absolute",top:0,right:0,background:c,color:"#07061a",fontSize:9,padding:"3px 10px",borderBottomLeftRadius:10,fontWeight:"bold"}}>{r.manzil.nature}</div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
              <div style={{textAlign:"center",minWidth:50,background:c+"22",borderRadius:10,padding:"6px"}}>
                <div style={{fontSize:10,color:t.textMuted,fontWeight:"bold"}}>{jours[r.date.getDay()]}</div>
                <div style={{fontSize:20,color:t.accentSoft,fontWeight:"bold"}}>{r.date.getDate()}</div>
                <div style={{fontSize:10,color:t.textMuted,fontWeight:"bold"}}>{mn[r.date.getMonth()]}</div>
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                  <span style={{fontSize:13}}>{r.ph.emoji}</span>
                  <span style={{fontSize:11,color:t.textMuted,fontWeight:"bold"}}>{r.ph.name}</span>
                </div>
                <div style={{fontSize:16,color:t.accentSoft,direction:"rtl",marginBottom:2,fontWeight:"bold"}}>{r.manzil.ar}</div>
                <div style={{fontSize:11,color:t.textLight,fontWeight:"bold"}}>{r.manzil.fr} #{r.idx+1}</div>
              </div>
            </div>
            <div style={{background:c+"11",border:"1px solid "+c+"22",borderRadius:8,padding:"8px 10px",marginBottom:8}}>
              <div style={{fontSize:10,color:c,fontWeight:"bold",marginBottom:3}}>{cur?cur.icon:""} {cur?cur.label:""}</div>
              <div style={{fontSize:11,color:t.textMuted,lineHeight:1.5,fontWeight:"600"}}>{r.manzil[filter]||"Favorable"}</div>
            </div>
            <div style={{fontSize:10,color:t.textMuted,borderTop:"1px solid "+t.accent+"22",paddingTop:6,direction:"rtl",textAlign:"right",fontWeight:"600"}}>{DUAS[r.idx]?DUAS[r.idx].ar.substring(0,60)+"...":""}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── NatalView ────────────────────────────────────────────────────────────
function NatalView(props) {
  var sys=props.sys, t=props.t;
  var bd=useState("1990-01-01"); var birthDate=bd[0]; var setBirthDate=bd[1];
  var res=useState(null); var result=res[0]; var setResult=res[1];
  function calculate(){
    var d=new Date(birthDate+"T12:00:00Z");
    var getLon=sys==="sidereal"?moonSid:moonTrop;
    var lon=getLon(jd(d));
    var idx=mIdx(lon);
    var m=MANAZIL[idx];
    var interp=NATAL_INTERP[idx];
    var sg=getSigneFromLon(lon);
    setResult({manzil:m,idx:idx,lon:lon.toFixed(2),signe:sg,interp:interp,phase:phase(d)});
  }
  return (
    <div>
      <h3 style={{color:t.accent,fontSize:14,letterSpacing:2,marginBottom:8,fontWeight:"bold"}}>Manzil de Naissance</h3>
      <p style={{fontSize:11,color:t.textMuted,marginBottom:14,lineHeight:1.6,fontWeight:"600"}}>Decouvre le manzil dans lequel la Lune se trouvait le jour de ta naissance selon Ibn Ajiba et Al-Buni.</p>
      <div style={{background:t.rowBg,border:"1px solid "+t.accent+"33",borderRadius:12,padding:"14px",marginBottom:14}}>
        <label style={{fontSize:11,color:t.textMuted,display:"block",marginBottom:8,fontWeight:"bold"}}>Date de naissance</label>
        <input type="date" value={birthDate} onChange={function(e){setBirthDate(e.target.value);}}
          style={{background:"none",border:"1px solid "+t.accent+"33",borderRadius:8,padding:"8px 12px",color:t.textLight,fontSize:13,fontFamily:"inherit",width:"100%",outline:"none",colorScheme:t.inputColor,boxSizing:"border-box",fontWeight:"bold"}}/>
        <button onClick={calculate}
          style={{width:"100%",marginTop:10,background:t.accent,border:"none",borderRadius:10,padding:"12px",color:t.deepBlue,fontSize:14,fontWeight:"bold",cursor:"pointer",fontFamily:"inherit"}}>
          Calculer mon Manzil natal
        </button>
      </div>
      {result&&(
        <div>
          <div style={{background:t.cardBg,border:"1px solid "+t.cardBorder,borderRadius:16,padding:"20px",marginBottom:12,textAlign:"center"}}>
            <div style={{fontSize:10,color:t.textMuted,letterSpacing:3,marginBottom:8,fontWeight:"bold"}}>TON MANZIL NATAL</div>
            <div style={{fontSize:32,color:t.accentSoft,direction:"rtl",marginBottom:6,lineHeight:1.3,fontWeight:"bold"}}>{result.manzil.ar}</div>
            <div style={{fontSize:18,color:t.textLight,marginBottom:4,fontWeight:"bold"}}>{result.manzil.fr}</div>
            <div style={{fontSize:12,color:t.textMuted,marginBottom:10,fontWeight:"bold"}}>Manzil #{result.idx+1} - {result.manzil.stars}</div>
            <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:8}}>
              <span style={{fontSize:11,background:(NC[result.manzil.nature]||t.accent)+"22",color:NC[result.manzil.nature]||t.accent,border:"1px solid "+(NC[result.manzil.nature]||t.accent)+"44",borderRadius:20,padding:"3px 10px",fontWeight:"bold"}}>{result.manzil.nature}</span>
              <span style={{fontSize:11,background:t.accent+"11",color:t.accentSoft,border:"1px solid "+t.accent+"33",borderRadius:20,padding:"3px 10px",fontWeight:"bold"}}>{result.signe.signe.emoji} {result.signe.signe.fr} {result.signe.deg}° {result.signe.min}'</span>
            </div>
            <div style={{fontSize:11,color:t.textMuted,fontWeight:"bold"}}>{result.phase.emoji} {result.phase.name} - {result.phase.age} jours</div>
          </div>
          <div style={{background:t.rowBg,border:"1px solid "+t.accent+"44",borderRadius:14,padding:"16px",marginBottom:12}}>
            <div style={{fontSize:14,color:t.accentSoft,fontWeight:"bold",marginBottom:8}}>{result.interp.titre}</div>
            <p style={{fontSize:11,color:t.textMuted,lineHeight:1.8,margin:0,fontWeight:"600"}}>{result.interp.texte}</p>
          </div>
          <div style={{background:t.accent+"11",border:"1px solid "+t.accent+"33",borderRadius:12,padding:"14px"}}>
            <div style={{fontSize:11,color:t.accent,fontWeight:"bold",marginBottom:8}}>Dua recommande pour ton manzil</div>
            <div style={{fontSize:16,color:t.accentSoft,direction:"rtl",lineHeight:1.8,marginBottom:8,textAlign:"right",fontWeight:"bold"}}>{DUAS[result.idx]?DUAS[result.idx].ar:""}</div>
            <div style={{fontSize:11,color:t.textMuted,lineHeight:1.6,fontStyle:"italic",fontWeight:"600"}}>{DUAS[result.idx]?DUAS[result.idx].fr:""}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DuaView ──────────────────────────────────────────────────────────────
function DuaView(props) {
  var md=props.md, t=props.t;
  var sl=useState(md?md.manzilIdx:0); var sel=sl[0]; var setSel=sl[1];
  useEffect(function(){if(md)setSel(md.manzilIdx);},[md]);
  var dua=DUAS[sel]||DUAS[0];
  var manzil=MANAZIL[sel];
  var nc=NC[manzil.nature]||t.accent;
  function share(){
    var text="Dua du Manzil #"+(sel+1)+" - "+manzil.fr+"\n\n"+dua.ar+"\n\n"+dua.fr+"\n\n"+dua.occasion+"\n\nmanazil-senastro.com";
    window.open("https://wa.me/?text="+encodeURIComponent(text),"_blank");
  }
  function copyDua(){
    if(navigator.clipboard){
      navigator.clipboard.writeText(dua.ar+"\n\n"+dua.fr).then(function(){alert("Dua copie !");});
    }
  }
  var hadith=HADITHS[sel%HADITHS.length];
  return (
    <div>
      <h3 style={{color:t.accent,fontSize:14,letterSpacing:2,marginBottom:8,fontWeight:"bold"}}>Dua des Manazil</h3>
      <p style={{fontSize:11,color:t.textMuted,marginBottom:14,lineHeight:1.5,fontWeight:"600"}}>Invocations recommandees selon la tradition classique.</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:14}}>
        {MANAZIL.map(function(m,i){
          var c=NC[m.nature]||t.accent;
          return(
            <button key={i} onClick={function(){setSel(i);}}
              style={{width:32,height:32,borderRadius:8,background:i===sel?(c+"22"):t.rowBg,border:i===sel?("1px solid "+c+"99"):("1px solid "+t.accent+"22"),color:i===sel?c:t.textMuted,fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:i===sel?"bold":"normal"}}>
              {i+1}
            </button>
          );
        })}
      </div>
      <div style={{background:t.rowBg,border:"1px solid "+nc+"33",borderRadius:12,padding:"12px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
        <div style={{textAlign:"center",minWidth:50}}>
          <div style={{fontSize:18,color:t.accentSoft,direction:"rtl",fontWeight:"bold"}}>{manzil.ar}</div>
          <div style={{fontSize:10,color:t.textMuted,marginTop:2,fontWeight:"bold"}}>#{sel+1}</div>
        </div>
        <div>
          <div style={{fontSize:13,color:t.textLight,marginBottom:2,fontWeight:"bold"}}>{manzil.fr}</div>
          <div style={{fontSize:10,color:nc,fontWeight:"bold"}}>{manzil.nature}</div>
          {md&&md.manzilIdx===sel&&<div style={{fontSize:10,color:t.accent,marginTop:2,fontWeight:"bold"}}>Lune ici maintenant</div>}
        </div>
      </div>
      <div style={{background:t.cardBg,border:"1px solid "+t.accent+"55",borderRadius:16,padding:"20px",marginBottom:12}}>
        <div style={{fontSize:10,color:t.textMuted,letterSpacing:2,marginBottom:14,textAlign:"center",fontWeight:"bold"}}>الدعاء</div>
        <div style={{fontSize:19,color:t.accentSoft,direction:"rtl",lineHeight:2,marginBottom:16,textAlign:"right",fontWeight:"bold"}}>{dua.ar}</div>
        <div style={{borderTop:"1px solid "+t.accent+"22",paddingTop:14}}>
          <div style={{fontSize:12,color:t.textLight,lineHeight:1.8,marginBottom:10,fontStyle:"italic",fontWeight:"600"}}>"{dua.fr}"</div>
          <div style={{background:t.accent+"11",border:"1px solid "+t.accent+"22",borderRadius:8,padding:"8px 12px"}}>
            <div style={{fontSize:10,color:t.accent,fontWeight:"bold",marginBottom:2}}>Quand reciter :</div>
            <div style={{fontSize:11,color:t.textMuted,fontWeight:"600"}}>{dua.occasion}</div>
          </div>
        </div>
      </div>
      <div style={{background:t.rowBg,border:"1px solid "+t.accent+"33",borderRadius:12,padding:"14px",marginBottom:12}}>
        <div style={{fontSize:11,color:t.accent,marginBottom:10,fontWeight:"bold"}}>Hadith et Coran sur la Lune</div>
        <div style={{fontSize:14,color:t.accentSoft,direction:"rtl",lineHeight:1.8,marginBottom:8,textAlign:"right",fontWeight:"bold"}}>{hadith.ar}</div>
        <div style={{fontSize:11,color:t.textMuted,lineHeight:1.6,marginBottom:6,fontStyle:"italic",fontWeight:"600"}}>{hadith.fr}</div>
        <div style={{fontSize:10,color:t.accent,fontWeight:"bold"}}>— {hadith.source}</div>
      </div>
      <button onClick={copyDua} style={{width:"100%",background:t.rowBg,border:"1px solid "+t.accent+"33",borderRadius:12,padding:"11px",color:t.accentSoft,fontSize:13,fontWeight:"bold",cursor:"pointer",fontFamily:"inherit",marginBottom:8}}>
        Copier le Dua
      </button>
      <button onClick={share} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"#25D366",border:"none",borderRadius:12,padding:"12px",color:"white",fontSize:13,fontWeight:"bold",cursor:"pointer",fontFamily:"inherit"}}>
        Partager ce Dua sur WhatsApp
      </button>
    </div>
  );
}

// ─── RolesView ────────────────────────────────────────────────────────────
function RolesView(props) {
  var md=props.md, t=props.t;
  var sl=useState(md?md.manzilIdx:0); var sel=sl[0]; var setSel=sl[1];
  useEffect(function(){if(md)setSel(md.manzilIdx);},[md]);
  var m=MANAZIL[sel];
  return (
    <div>
      <h3 style={{color:t.accent,fontSize:14,letterSpacing:2,marginBottom:8,fontWeight:"bold"}}>Roles et Influences des Manazil</h3>
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
        {MANAZIL.map(function(m2,i){
          var c=NC[m2.nature]||t.accent;
          return(
            <button key={i} onClick={function(){setSel(i);}}
              style={{width:30,height:30,borderRadius:7,background:i===sel?(c+"22"):t.rowBg,border:i===sel?("1px solid "+c+"99"):("1px solid "+t.accent+"22"),color:i===sel?c:t.textMuted,fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:i===sel?"bold":"normal"}}>
              {i+1}
            </button>
          );
        })}
      </div>
      <div style={{background:t.cardBg,border:"1px solid "+t.cardBorder,borderRadius:14,padding:"16px",marginBottom:10,textAlign:"center"}}>
        <div style={{fontSize:10,color:t.textMuted,letterSpacing:2,marginBottom:6,fontWeight:"bold"}}>Manzil #{sel+1} - {m.symbole}</div>
        <div style={{fontSize:26,color:t.accentSoft,marginBottom:4,direction:"rtl",fontWeight:"bold"}}>{m.ar}</div>
        <div style={{fontSize:15,color:t.textLight,marginBottom:3,fontWeight:"bold"}}>{m.fr}</div>
        <div style={{fontSize:10,color:t.textMuted,marginBottom:6,fontWeight:"bold"}}>{m.stars} - {m.element} - {m.planete}</div>
        {md&&md.manzilIdx===sel&&<div style={{fontSize:10,color:t.deepBlue,background:t.accent,borderRadius:20,padding:"3px 10px",display:"inline-block",fontWeight:"bold"}}>Lune ici maintenant</div>}
      </div>
      <RolesCard manzil={m} t={t}/>
      <div style={{background:t.accent+"11",border:"1px solid "+t.accent+"33",borderRadius:12,padding:"12px"}}>
        <div style={{fontSize:10,color:t.accent,marginBottom:6,fontWeight:"bold"}}>Dua de ce manzil</div>
        <div style={{fontSize:14,color:t.accentSoft,direction:"rtl",lineHeight:1.8,textAlign:"right",marginBottom:6,fontWeight:"bold"}}>{DUAS[sel]?DUAS[sel].ar:""}</div>
        <div style={{fontSize:10,color:t.textMuted,fontStyle:"italic",fontWeight:"600"}}>{DUAS[sel]?DUAS[sel].fr:""}</div>
      </div>
    </div>
  );
}

// ─── ListView ─────────────────────────────────────────────────────────────
function ListView(props) {
  var idx=props.idx, t=props.t;
  var sr=useState(""); var search=sr[0]; var setSearch=sr[1];
  var filtered=MANAZIL.filter(function(m,i){
    if(!search)return true;
    return m.fr.toLowerCase().includes(search.toLowerCase())||m.ar.includes(search)||m.nature.toLowerCase().includes(search.toLowerCase())||String(i+1)===search.trim();
  });
  return (
    <div>
      <h3 style={{color:t.accent,fontSize:14,letterSpacing:2,marginBottom:10,fontWeight:"bold"}}>Les 28 Manazil al-Qamar</h3>
      <div style={{background:t.rowBg,border:"1px solid "+t.accent+"33",borderRadius:10,padding:"8px 12px",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:14}}>🔍</span>
        <input value={search} onChange={function(e){setSearch(e.target.value);}} placeholder="Chercher un manzil..."
          style={{flex:1,background:"none",border:"none",color:t.textLight,fontSize:13,fontFamily:"inherit",outline:"none",fontWeight:"bold"}}/>
        {search&&<button onClick={function(){setSearch("");}} style={{background:"none",border:"none",color:t.textMuted,cursor:"pointer",fontSize:16,fontWeight:"bold"}}>x</button>}
      </div>
      {filtered.map(function(m){
        var realIdx=MANAZIL.indexOf(m);
        var c=NC[m.nature]||t.accent;
        var act=realIdx===idx;
        return(
          <div key={realIdx} style={{background:act?t.listActiveBg:t.rowBg,border:"1px solid "+(act?(t.accent+"99"):t.rowBorder),borderRadius:10,padding:"9px 12px",marginBottom:5,display:"flex",alignItems:"center",gap:8}}>
            <div style={{fontSize:11,color:t.textMuted,minWidth:20,textAlign:"center",fontWeight:"bold"}}>{realIdx+1}</div>
            <div style={{fontSize:13,color:t.accentSoft,direction:"rtl",minWidth:80,fontWeight:"bold"}}>{m.ar}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:11,color:t.textLight,marginBottom:1,fontWeight:"bold"}}>{m.fr}</div>
              <div style={{fontSize:10,color:t.textMuted,fontWeight:"600"}}>{m.symbole}</div>
              <div style={{fontSize:10,color:c,fontWeight:"bold"}}>{m.nature}</div>
            </div>
            {act&&<div style={{fontSize:10,color:t.deepBlue,background:t.accent,borderRadius:20,padding:"2px 6px",whiteSpace:"nowrap",fontWeight:"bold"}}>Ici</div>}
          </div>
        );
      })}
      {filtered.length===0&&<div style={{textAlign:"center",padding:"30px",color:t.textMuted,fontSize:13,fontWeight:"bold"}}>Aucun resultat pour "{search}"</div>}
    </div>
  );
}

// ─── FullBookAd ────────────────────────────────────────────────────────────
function FullBookAd() {
  return (
    <div style={{background:"linear-gradient(135deg,#1a0a00,#2d1500,#1a0a00)",border:"2px solid #C9A84C",borderRadius:16,padding:16,marginBottom:12}}>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
        <span style={{fontSize:10,background:"#C9A84C",color:"#1a0a00",borderRadius:20,padding:"2px 8px",fontWeight:"bold"}}>NOUVEAU LIVRE</span>
      </div>
      <div style={{textAlign:"center",marginBottom:12}}>
        <div style={{fontSize:18,color:"#e8c97a",fontWeight:"bold",letterSpacing:2,marginBottom:2}}>LES MANAZIL AL-QAMAR</div>
        <div style={{fontSize:11,color:"#C9A84C88",direction:"rtl",marginBottom:8,fontWeight:"bold"}}>منازل القمر</div>
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          {[["FR","FRANCAIS"],["WO","WOLOF"]].map(function(item){return(
            <div key={item[0]} style={{flex:1,background:"#ffffff11",border:"1px solid #C9A84C44",borderRadius:10,padding:"8px"}}>
              <div style={{fontSize:14,marginBottom:3,fontWeight:"bold"}}>{item[0]}</div>
              <div style={{fontSize:10,color:"#C9A84C",fontWeight:"bold",marginBottom:4}}>{item[1]}</div>
              <div style={{fontSize:14,color:"#e8c97a",fontWeight:"bold",marginBottom:3}}>15.000 F</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                <div style={{fontSize:14,color:"#e8c97a",fontWeight:"bold"}}>6.900 F</div>
                <div style={{fontSize:9,background:"#2ecc71",color:"white",borderRadius:10,padding:"1px 5px",fontWeight:"bold"}}>-50%</div>
              </div>
            </div>
          );})}
        </div>
      </div>
      <a href="https://wa.me/221764265550" target="_blank" rel="noopener noreferrer"
        style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"#25D366",borderRadius:10,padding:"11px",textDecoration:"none",color:"white",fontSize:13,fontWeight:"bold"}}>
        Commander - +221 76 426 55 50
      </a>
    </div>
  );
}

// ─── SettingsView ─────────────────────────────────────────────────────────
function SettingsView(props) {
  var t=props.t;
  var ns=useState("default"); var notifStatus=ns[0]; var setNotifStatus=ns[1];
  useEffect(function(){if("Notification" in window)setNotifStatus(Notification.permission);else setNotifStatus("unsupported");},[]);
  function requestNotif(){
    if(!("Notification" in window)){setNotifStatus("unsupported");return;}
    Notification.requestPermission().then(function(p){
      setNotifStatus(p);
      if(p==="granted")new Notification("Sen-Astro - Notifications activees!",{body:"Tu recevras le manzil chaque matin.",icon:"/icon-192.png"});
    });
  }
  return (
    <div>
      <h3 style={{color:t.accent,fontSize:14,letterSpacing:2,marginBottom:14,fontWeight:"bold"}}>Parametres</h3>
      <div style={{background:t.cardBg,border:"1px solid "+t.accent+"44",borderRadius:14,padding:"16px",marginBottom:10}}>
        <div style={{fontSize:14,color:t.accentSoft,marginBottom:6,fontWeight:"bold"}}>Notifications quotidiennes</div>
        <p style={{fontSize:11,color:t.textMuted,lineHeight:1.6,marginBottom:12,fontWeight:"600"}}>Recois chaque matin le manzil du jour et son Dua.</p>
        {notifStatus==="granted"?(
          <div style={{background:"#4ecf8a22",border:"1px solid #4ecf8a44",borderRadius:10,padding:"10px",textAlign:"center"}}>
            <div style={{color:"#4ecf8a",fontWeight:"bold"}}>Notifications activees!</div>
          </div>
        ):notifStatus==="denied"?(
          <div style={{background:"#e07a5f22",border:"1px solid #e07a5f44",borderRadius:10,padding:"10px",textAlign:"center",fontSize:11,color:"#e07a5f",fontWeight:"bold"}}>Bloquees dans les parametres du navigateur.</div>
        ):notifStatus==="unsupported"?(
          <div style={{fontSize:11,color:t.textMuted,fontWeight:"bold"}}>Utilise Chrome ou Edge.</div>
        ):(
          <button onClick={requestNotif} style={{width:"100%",background:t.accent,border:"none",borderRadius:10,padding:"12px",color:t.deepBlue,fontSize:14,fontWeight:"bold",cursor:"pointer",fontFamily:"inherit"}}>
            Activer les notifications
          </button>
        )}
      </div>
      <div style={{background:t.cardBg,border:"1px solid "+t.accent+"33",borderRadius:14,padding:"14px"}}>
        <div style={{fontSize:12,color:t.accentSoft,marginBottom:8,fontWeight:"bold"}}>A propos</div>
        <div style={{fontSize:11,color:t.textMuted,lineHeight:1.8,fontWeight:"600"}}>
          Application Sen-Astro sur les Manazil al-Qamar.<br/>
          Calculs: algorithme Jean Meeus.<br/>
          Tradition: Ibn Ajiba, Al-Buni.<br/>
          Systeme sideral: Ayanamsa Lahiri.<br/><br/>
          manazil-senastro.com<br/>
          Livre: WhatsApp +221 76 426 55 50
        </div>
      </div>
    </div>
  );
}

// ─── TodayView ────────────────────────────────────────────────────────────
function TodayView(props) {
  var md=props.md, loading=props.loading, ph=props.ph, sys=props.sys;
  var selDate=props.selDate, ds=props.ds, ts=props.ts, t=props.t;
  var hijriDate=props.hijriDate, onDC=props.onDC, onTC=props.onTC;
  return (
    <div>
      {md&&!loading&&(
        <div style={{background:"linear-gradient(135deg,"+t.accent+"22,"+t.accent+"08)",border:"2px solid "+t.accent+"88",borderRadius:16,padding:"16px",marginBottom:12,textAlign:"center"}}>
          <div style={{fontSize:11,color:t.textMuted,letterSpacing:3,marginBottom:6,fontWeight:"bold"}}>MANZIL DU JOUR</div>
          <div style={{fontSize:11,color:t.textMuted,marginBottom:4,fontWeight:"bold"}}>#{md.manzilIdx+1}</div>
          <div style={{fontSize:32,color:t.accentSoft,direction:"rtl",marginBottom:4,lineHeight:1.3,fontWeight:"bold"}}>{md.manzil.ar}</div>
          <div style={{fontSize:18,color:t.textLight,marginBottom:4,fontWeight:"bold"}}>{md.manzil.fr}</div>
          <div style={{fontSize:11,color:t.textMuted,marginBottom:10,fontWeight:"bold"}}>{md.manzil.symbole} - {md.manzil.element}</div>
          <span style={{fontSize:11,background:(NC[md.manzil.nature]||t.accent)+"22",color:NC[md.manzil.nature]||t.accent,border:"1px solid "+(NC[md.manzil.nature]||t.accent)+"44",borderRadius:20,padding:"4px 14px",fontWeight:"bold"}}>{md.manzil.nature}</span>
          <div style={{display:"flex",justifyContent:"space-around",marginTop:12}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:11,color:t.textMuted,fontWeight:"bold"}}>Entree</div>
              <div style={{fontSize:17,color:t.accentSoft,fontWeight:"bold"}}>{fmtT(md.entryTime)}</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:18,color:t.accent}}>☽</div>
              <div style={{fontSize:12,color:t.accent,fontWeight:"bold"}}>{md.progress}%</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:11,color:t.textMuted,fontWeight:"bold"}}>Sortie</div>
              <div style={{fontSize:17,color:t.accentSoft,fontWeight:"bold"}}>{fmtT(md.exitTime)}</div>
            </div>
          </div>
        </div>
      )}
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <div style={{flex:1,background:t.rowBg,border:"1px solid "+t.accent+"33",borderRadius:10,padding:"8px 12px"}}>
          <div style={{fontSize:10,color:t.textMuted,marginBottom:3,fontWeight:"bold"}}>Date</div>
          <input type="date" value={ds} onChange={onDC} style={{background:"none",border:"none",color:t.textLight,fontSize:13,fontFamily:"inherit",width:"100%",outline:"none",colorScheme:t.inputColor,fontWeight:"bold"}}/>
        </div>
        <div style={{flex:1,background:t.rowBg,border:"1px solid "+t.accent+"33",borderRadius:10,padding:"8px 12px"}}>
          <div style={{fontSize:10,color:t.textMuted,marginBottom:3,fontWeight:"bold"}}>Heure</div>
          <input type="time" value={ts} onChange={onTC} style={{background:"none",border:"none",color:t.textLight,fontSize:13,fontFamily:"inherit",width:"100%",outline:"none",colorScheme:t.inputColor,fontWeight:"bold"}}/>
        </div>
      </div>
      {loading?(
        <div style={{textAlign:"center",padding:"50px 0"}}>
          <div style={{fontSize:40}}>☽</div>
          <p style={{color:t.textMuted,marginTop:8,fontSize:12,fontWeight:"bold"}}>Calcul en cours...</p>
        </div>
      ):md?(
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,background:t.phaseBg,border:"1px solid "+t.phaseBorder,borderRadius:12,padding:"10px 12px",marginBottom:10}}>
            <MoonSVG ph={ph} size={65}/>
            <div style={{flex:1}}>
              <div style={{fontSize:12,color:t.accentSoft,marginBottom:2,fontWeight:"bold"}}>{ph.name}</div>
              <div style={{fontSize:10,color:t.textMuted,marginBottom:2,fontWeight:"bold"}}>{selDate.toLocaleDateString("fr-FR",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})}</div>
              {hijriDate&&<div style={{fontSize:11,color:t.accent,marginBottom:2,fontWeight:"bold"}}>{hijriDate.displayAr||hijriDate.display}</div>}
              <div style={{fontSize:10,color:t.textMuted,fontWeight:"bold"}}>Age: {ph.age}j - {ph.pct}% illumine</div>
            </div>
            <div style={{fontSize:9,color:t.deepBlue,background:t.accent,borderRadius:20,padding:"2px 6px",fontWeight:"bold"}}>{sys==="sidereal"?"Sideral":"Tropical"}</div>
          </div>
          <LunarCountdown date={selDate} t={t}/>
          <MoonSunPos md={md} sys={sys} t={t}/>
          <div style={{background:t.cardBg,border:"1px solid "+t.cardBorder,borderRadius:14,padding:"12px",marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:t.textMuted,marginBottom:6,fontWeight:"bold"}}>
              <span>Entree</span><span style={{color:t.accent}}>{md.progress}% parcouru</span><span>Sortie</span>
            </div>
            <div style={{height:5,background:t.accent+"22",borderRadius:3,position:"relative",overflow:"visible"}}>
              <div style={{height:"100%",background:"linear-gradient(90deg,"+t.accent+"66,"+t.accent+")",borderRadius:3,width:md.progress+"%"}}/>
              <div style={{position:"absolute",top:-9,left:"calc("+md.progress+"% - 10px)",fontSize:18,color:t.accentSoft,lineHeight:1}}>☽</div>
            </div>
          </div>
          <RolesCard manzil={md.manzil} t={t}/>
          <div style={{background:t.accent+"11",border:"1px solid "+t.accent+"33",borderRadius:12,padding:"12px",marginBottom:10}}>
            <div style={{fontSize:10,color:t.accent,marginBottom:6,fontWeight:"bold"}}>Dua du jour</div>
            <div style={{fontSize:14,color:t.accentSoft,direction:"rtl",lineHeight:1.8,textAlign:"right",marginBottom:5,fontWeight:"bold"}}>{DUAS[md.manzilIdx]?DUAS[md.manzilIdx].ar:""}</div>
            <div style={{fontSize:10,color:t.textMuted,fontStyle:"italic",fontWeight:"600"}}>{DUAS[md.manzilIdx]?DUAS[md.manzilIdx].fr:""}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            {[["Entree",md.entryTime],["Sortie",md.exitTime]].map(function(item,i){return(
              <div key={i} style={{flex:1,background:t.rowBg,border:"1px solid "+t.accent+"33",borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
                <div style={{fontSize:11,color:t.textMuted,marginBottom:4,fontWeight:"bold"}}>{item[0]}</div>
                <div style={{fontSize:20,color:t.accentSoft,marginBottom:2,fontWeight:"bold"}}>{fmtT(item[1])}</div>
                <div style={{fontSize:10,color:t.textMuted,fontWeight:"bold"}}>{fmtD(item[1])}</div>
              </div>
            );})}
          </div>
          <ShareBtn md={md} ph={ph} t={t} hijriDate={hijriDate}/>
          <div style={{background:"linear-gradient(135deg,#1a0a00,#2d1500,#1a0a00)",border:"1px solid #C9A84C88",borderRadius:12,padding:"12px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={function(){window.open("https://wa.me/221764265550","_blank");}}>
            <span style={{fontSize:22}}>📚</span>
            <div style={{flex:1}}>
              <div style={{fontSize:12,color:"#e8c97a",fontWeight:"bold",marginBottom:2}}>Les Manazil Al-Qamar</div>
              <div style={{fontSize:10,color:"#C9A84C88",fontWeight:"bold"}}>Livre FR et Wolof - des 6.900 FCFA</div>
            </div>
            <div style={{fontSize:10,background:"#25D366",color:"white",borderRadius:20,padding:"4px 10px",fontWeight:"bold"}}>Commander</div>
          </div>
        </div>
      ):null}
    </div>
  );
}

// ─── WheelView ────────────────────────────────────────────────────────────
function WheelView(props) {
  var md=props.md, ph=props.ph, t=props.t;
  return (
    <div>
      <h3 style={{color:t.accent,fontSize:14,letterSpacing:2,marginBottom:12,fontWeight:"bold",textAlign:"center"}}>Roue des Manazil</h3>
      <div style={{textAlign:"center",marginBottom:12,animation:"float 4s ease-in-out infinite"}}>
        <MoonSVG ph={ph} size={100}/>
        <div style={{fontSize:12,color:t.accentSoft,marginTop:4,fontWeight:"bold"}}>{ph.emoji} {ph.name} - {ph.age} jours - {ph.pct}% illumine</div>
      </div>
      <ManzilWheel md={md} t={t}/>
      {md&&md.moonRise&&(
        <div style={{background:t.cardBg,border:"1px solid "+t.accent+"33",borderRadius:14,padding:"14px",marginTop:10}}>
          <div style={{fontSize:11,color:t.textMuted,letterSpacing:2,marginBottom:10,textAlign:"center",fontWeight:"bold"}}>LEVER ET COUCHER DE LA LUNE</div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            {[["Lever",md.moonRise.lever,"#4ecf8a"],["Zenith",md.moonRise.zenith,t.accent],["Coucher",md.moonRise.coucher,"#e07a5f"]].map(function(item){return(
              <div key={item[0]} style={{textAlign:"center",flex:1}}>
                <div style={{fontSize:10,color:t.textMuted,marginBottom:4,fontWeight:"bold"}}>{item[0]}</div>
                <div style={{fontSize:16,color:t.accentSoft,fontWeight:"bold"}}>{item[1]}</div>
              </div>
            );})}
          </div>
          <div style={{fontSize:10,color:t.textMuted,textAlign:"center",marginTop:6,fontWeight:"bold"}}>* Heures approximatives</div>
        </div>
      )}
    </div>
  );
}


// ─── BoutiqueView ─────────────────────────────────────────────────────────
function BoutiqueView(props) {
  var t = props.t;
  var produits = [
    {
      id:1,
      titre:"Les Manazil Al-Qamar - FRANCAIS",
      sousTitre:"Ebook complet sur les 28 Stations Lunaires",
      description:"Guide complet des 28 Manzils selon la tradition arabo-islamique. Ibn Ajiba, Al-Buni, calculs astronomiques, roles classiques, invocations. Version francaise.",
      prix:"6.900 F",
      ancienPrix:"15.000 F",
      reduction:"-54%",
      format:"Ebook PDF",
      langue:"Francais",
      emoji:"🇫🇷",
      badge:"BESTSELLER",
      badgeColor:"#e74c3c"
    },
    {
      id:2,
      titre:"Les Manazil Al-Qamar - WOLOF",
      sousTitre:"Limonam yu Weer yi - 28 Manazil",
      description:"Version complete en langue wolof pour les communautes senegalaises. Traditions orales integrees, correspondances culturelles locales.",
      prix:"6.900 F",
      ancienPrix:"15.000 F",
      reduction:"-54%",
      format:"Ebook PDF",
      langue:"Wolof",
      emoji:"🌍",
      badge:"NOUVEAU",
      badgeColor:"#27ae60"
    },
    {
      id:3,
      titre:"Formation Astrologie Occidentale Complete",
      sousTitre:"De debutant a praticien confirme",
      description:"Formation video complete en astrologie occidentale. Thème natal, maisons astrologiques, planètes, aspects, synastrie, transits, predictions. Contenu exclusif Habib Ndiaye - Sen-Astro.",
      prix:"39.900 F",
      ancienPrix:"79.900 F",
      reduction:"-50%",
      format:"Videos HD + PDF",
      langue:"Francais",
      emoji:"⭐",
      badge:"POPULAIRE",
      badgeColor:"#C9A84C"
    }
  ];

  return (
    <div>
      <div style={{textAlign:"center",marginBottom:16}}>
        <div style={{fontSize:28,marginBottom:6}}>🛍️</div>
        <h3 style={{color:t.accent,fontSize:16,letterSpacing:2,marginBottom:4,fontWeight:"bold"}}>Boutique Sen-Astro</h3>
        <p style={{fontSize:11,color:t.textMuted,marginBottom:0,fontWeight:"600"}}>Livres et formations par Habib Ndiaye</p>
      </div>

      {produits.map(function(p){
        return (
          <div key={p.id} style={{background:t.cardBg,border:"2px solid "+t.accent+"55",borderRadius:16,padding:"16px",marginBottom:14,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-20,right:-20,width:100,height:100,background:"radial-gradient(circle,"+t.accent+"22,transparent)",borderRadius:"50%",pointerEvents:"none"}}/>
            <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:12}}>
              <div style={{fontSize:36}}>{p.emoji}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                  <span style={{fontSize:9,background:p.badgeColor,color:"white",borderRadius:10,padding:"2px 8px",fontWeight:"bold"}}>{p.badge}</span>
                  <span style={{fontSize:9,color:t.textMuted,fontWeight:"bold"}}>{p.format}</span>
                </div>
                <div style={{fontSize:14,color:t.textLight,fontWeight:"bold",marginBottom:2}}>{p.titre}</div>
                <div style={{fontSize:11,color:t.accentSoft,fontWeight:"bold",marginBottom:6}}>{p.sousTitre}</div>
                <p style={{fontSize:10,color:t.textMuted,lineHeight:1.6,marginBottom:10,fontWeight:"600"}}>{p.description}</p>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <div style={{fontSize:20,color:t.accentSoft,fontWeight:"bold"}}>{p.prix}</div>
                  <div style={{fontSize:12,color:t.textMuted,textDecoration:"line-through",fontWeight:"600"}}>{p.ancienPrix}</div>
                  <div style={{fontSize:10,background:"#2ecc71",color:"white",borderRadius:10,padding:"2px 8px",fontWeight:"bold"}}>{p.reduction}</div>
                </div>
              </div>
            </div>
            <a href="https://iqbmnusp.mychariow.shop/" target="_blank" rel="noopener noreferrer"
              style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:t.accent,borderRadius:10,padding:"12px",textDecoration:"none",color:t.deepBlue,fontSize:13,fontWeight:"bold"}}>
              Acheter sur Chariow
            </a>
            <div style={{textAlign:"center",marginTop:8}}>
              <a href="https://wa.me/221764265550" target="_blank" rel="noopener noreferrer"
                style={{display:"inline-flex",alignItems:"center",gap:6,background:"#25D366",borderRadius:8,padding:"6px 14px",textDecoration:"none",color:"white",fontSize:11,fontWeight:"bold"}}>
                Commander via WhatsApp
              </a>
            </div>
          </div>
        );
      })}

      <div style={{background:t.rowBg,border:"1px solid "+t.accent+"33",borderRadius:14,padding:"14px",textAlign:"center"}}>
        <div style={{fontSize:14,color:t.accentSoft,fontWeight:"bold",marginBottom:6}}>Besoin d aide ?</div>
        <p style={{fontSize:11,color:t.textMuted,marginBottom:12,fontWeight:"600"}}>Habib Ndiaye repond personnellement a vos questions sur WhatsApp</p>
        <a href="https://wa.me/221764265550" target="_blank" rel="noopener noreferrer"
          style={{display:"inline-flex",alignItems:"center",gap:8,background:"#25D366",borderRadius:10,padding:"10px 20px",textDecoration:"none",color:"white",fontSize:13,fontWeight:"bold"}}>
          +221 76 426 55 50
        </a>
        <div style={{marginTop:12}}>
          <a href="https://iqbmnusp.mychariow.shop/" target="_blank" rel="noopener noreferrer"
            style={{display:"inline-flex",alignItems:"center",gap:6,color:t.accentSoft,textDecoration:"none",fontSize:12,fontWeight:"bold"}}>
            Voir toute la boutique Chariow →
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── TafsirView ───────────────────────────────────────────────────────────
function TafsirView(props) {
  var t = props.t;
  var sel = useState(0);
  var selIdx = sel[0]; var setSel = sel[1];
  var item = TAFSIR[selIdx];
  return (
    <div>
      <h3 style={{color:t.accent,fontSize:14,letterSpacing:2,marginBottom:8,fontWeight:"bold"}}>Tafsir - Versets sur la Lune</h3>
      <p style={{fontSize:11,color:t.textMuted,marginBottom:14,lineHeight:1.5,fontWeight:"600"}}>Commentaires des grands savants de l Islam sur les versets coraniques concernant la Lune et les Manazil.</p>
      <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
        {TAFSIR.map(function(_,i){
          return(
            <button key={i} onClick={function(){setSel(i);}}
              style={{flexShrink:0,padding:"6px 12px",background:selIdx===i?(t.accent+"33"):"none",border:selIdx===i?("1px solid "+t.accent+"99"):("1px solid "+t.accent+"22"),borderRadius:20,color:selIdx===i?t.accentSoft:t.textMuted,fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:"bold",whiteSpace:"nowrap"}}>
              Verset {i+1}
            </button>
          );
        })}
      </div>
      <div style={{background:t.cardBg,border:"1px solid "+t.accent+"55",borderRadius:16,padding:"18px",marginBottom:10}}>
        <div style={{fontSize:10,color:t.accent,letterSpacing:2,marginBottom:12,fontWeight:"bold"}}>{item.ref}</div>
        <div style={{fontSize:17,color:t.accentSoft,direction:"rtl",lineHeight:2.2,textAlign:"right",marginBottom:16,fontWeight:"bold"}}>{item.verset}</div>
        <div style={{borderTop:"1px solid "+t.accent+"22",paddingTop:14}}>
          <div style={{fontSize:11,color:t.textLight,lineHeight:1.8,marginBottom:12,fontStyle:"italic",fontWeight:"bold"}}>"{item.traduction}"</div>
          <div style={{background:t.accent+"11",border:"1px solid "+t.accent+"22",borderRadius:10,padding:"12px"}}>
            <div style={{fontSize:10,color:t.accent,marginBottom:8,fontWeight:"bold"}}>Commentaire des Savants</div>
            <p style={{fontSize:11,color:t.textMuted,lineHeight:1.8,margin:0,fontWeight:"600"}}>{item.tafsir}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NuitsView ────────────────────────────────────────────────────────────
function NuitsView(props) {
  var t = props.t;
  var sel = useState(null);
  var selIdx = sel[0]; var setSel = sel[1];
  return (
    <div>
      <h3 style={{color:t.accent,fontSize:14,letterSpacing:2,marginBottom:8,fontWeight:"bold"}}>Nuits Importantes en Islam</h3>
      <p style={{fontSize:11,color:t.textMuted,marginBottom:14,lineHeight:1.5,fontWeight:"600"}}>Les nuits sacrees du calendrier islamique, leurs vertus et leurs pratiques recommandees.</p>
      {NUITS_IMPORTANTES.map(function(nuit,i){
        var isOpen = selIdx === i;
        return (
          <div key={i} style={{background:t.rowBg,border:"2px solid "+nuit.color+"44",borderRadius:14,padding:"14px",marginBottom:10}}>
            <div onClick={function(){setSel(isOpen?null:i);}} style={{cursor:"pointer"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:isOpen?12:0}}>
                <div style={{width:12,height:12,borderRadius:"50%",background:nuit.color,flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,color:t.textLight,fontWeight:"bold",marginBottom:2}}>{nuit.nom}</div>
                  <div style={{fontSize:13,color:nuit.color,direction:"rtl",fontWeight:"bold"}}>{nuit.arabe}</div>
                </div>
                <div style={{fontSize:16,color:t.textMuted,fontWeight:"bold"}}>{isOpen?"▲":"▼"}</div>
              </div>
            </div>
            {isOpen&&(
              <div>
                <div style={{background:nuit.color+"11",border:"1px solid "+nuit.color+"33",borderRadius:10,padding:"10px",marginBottom:10}}>
                  <p style={{fontSize:11,color:t.textMuted,lineHeight:1.7,margin:0,fontWeight:"600"}}>{nuit.description}</p>
                </div>
                <div style={{fontSize:11,color:t.accent,marginBottom:6,fontWeight:"bold"}}>Periode</div>
                <div style={{fontSize:11,color:t.textMuted,marginBottom:10,fontWeight:"600"}}>{nuit.periode}</div>
                <div style={{fontSize:16,color:t.accentSoft,direction:"rtl",lineHeight:1.8,marginBottom:10,textAlign:"right",fontWeight:"bold"}}>{nuit.verset}</div>
                <div style={{fontSize:11,color:t.accent,marginBottom:8,fontWeight:"bold"}}>Pratiques recommandees</div>
                {nuit.amalan.map(function(a,j){return(
                  <div key={j} style={{display:"flex",alignItems:"flex-start",marginBottom:6}}>
                    <span style={{color:nuit.color,marginRight:8,fontSize:12}}>●</span>
                    <span style={{fontSize:11,color:t.textMuted,lineHeight:1.5,fontWeight:"600"}}>{a}</span>
                  </div>
                );})}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── DhikrView ────────────────────────────────────────────────────────────
function DhikrView(props) {
  var md = props.md; var t = props.t;
  var sl = useState(md?md.manzilIdx:0);
  var sel = sl[0]; var setSel = sl[1];
  useEffect(function(){if(md)setSel(md.manzilIdx);},[md]);
  var dhikr = DHIKR_MANAZIL[sel] || DHIKR_MANAZIL[0];
  var manzil = MANAZIL[sel];
  var nc = NC[manzil.nature] || t.accent;
  function copyDhikr(){
    if(navigator.clipboard){
      navigator.clipboard.writeText(dhikr.dhikr+"\n"+dhikr.fr+"\n"+dhikr.count).then(function(){alert("Dhikr copié !");});
    }
  }
  function share(){
    var text = "Dhikr du Manzil #"+(sel+1)+" - "+manzil.fr+"\n\n"+dhikr.dhikr+"\n\n"+dhikr.fr+"\n\nRépéter: "+dhikr.count+"\n\n"+dhikr.conseil+"\n\nmanazil-senastro.com";
    window.open("https://wa.me/?text="+encodeURIComponent(text),"_blank");
  }
  return (
    <div>
      <h3 style={{color:t.accent,fontSize:14,letterSpacing:2,marginBottom:8,fontWeight:"bold"}}>Dhikr des Manazil</h3>
      <p style={{fontSize:11,color:t.textMuted,marginBottom:14,lineHeight:1.5,fontWeight:"600"}}>Invocations et formules de remembrance selon chaque station lunaire.</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:14}}>
        {MANAZIL.map(function(m,i){
          var c = NC[m.nature]||t.accent;
          return(
            <button key={i} onClick={function(){setSel(i);}}
              style={{width:32,height:32,borderRadius:8,background:i===sel?(c+"22"):t.rowBg,border:i===sel?("1px solid "+c+"99"):("1px solid "+t.accent+"22"),color:i===sel?c:t.textMuted,fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:i===sel?"bold":"normal"}}>
              {i+1}
            </button>
          );
        })}
      </div>
      <div style={{background:t.rowBg,border:"1px solid "+nc+"33",borderRadius:12,padding:"12px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
        <div style={{textAlign:"center",minWidth:50}}>
          <div style={{fontSize:18,color:t.accentSoft,direction:"rtl",fontWeight:"bold"}}>{manzil.ar}</div>
          <div style={{fontSize:10,color:t.textMuted,marginTop:2,fontWeight:"bold"}}>#{sel+1}</div>
        </div>
        <div>
          <div style={{fontSize:13,color:t.textLight,fontWeight:"bold",marginBottom:2}}>{manzil.fr}</div>
          <div style={{fontSize:10,color:nc,fontWeight:"bold"}}>{manzil.nature}</div>
          {md&&md.manzilIdx===sel&&<div style={{fontSize:10,color:t.accent,fontWeight:"bold"}}>Lune ici maintenant</div>}
        </div>
      </div>
      <div style={{background:t.cardBg,border:"1px solid "+t.accent+"55",borderRadius:16,padding:"20px",marginBottom:12,textAlign:"center"}}>
        <div style={{fontSize:10,color:t.accent,letterSpacing:2,marginBottom:14,fontWeight:"bold"}}>DHIKR RECOMMANDE</div>
        <div style={{fontSize:22,color:t.accentSoft,direction:"rtl",lineHeight:2,marginBottom:12,fontWeight:"bold"}}>{dhikr.dhikr}</div>
        <div style={{fontSize:13,color:t.textLight,fontStyle:"italic",marginBottom:10,fontWeight:"600"}}>"{dhikr.fr}"</div>
        <div style={{background:t.accent,borderRadius:20,padding:"8px 20px",display:"inline-block",marginBottom:16}}>
          <span style={{fontSize:18,color:t.deepBlue,fontWeight:"bold"}}>{dhikr.count}</span>
        </div>
        <div style={{background:t.accent+"11",border:"1px solid "+t.accent+"22",borderRadius:10,padding:"10px"}}>
          <div style={{fontSize:10,color:t.accent,fontWeight:"bold",marginBottom:4}}>Conseil</div>
          <div style={{fontSize:11,color:t.textMuted,fontWeight:"600"}}>{dhikr.conseil}</div>
        </div>
      </div>
      <button onClick={copyDhikr} style={{width:"100%",background:t.rowBg,border:"1px solid "+t.accent+"33",borderRadius:12,padding:"11px",color:t.accentSoft,fontSize:13,fontWeight:"bold",cursor:"pointer",fontFamily:"inherit",marginBottom:8}}>
        Copier le Dhikr
      </button>
      <button onClick={share} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"#25D366",border:"none",borderRadius:12,padding:"12px",color:"white",fontSize:13,fontWeight:"bold",cursor:"pointer",fontFamily:"inherit"}}>
        Partager sur WhatsApp
      </button>
    </div>
  );
}

// ─── EclipsesView ─────────────────────────────────────────────────────────
function EclipsesView(props) {
  var t = props.t;
  var today = new Date();
  var upcoming = ECLIPSES.filter(function(e){return new Date(e.date) >= today;});
  var past = ECLIPSES.filter(function(e){return new Date(e.date) < today;});
  function typeColor(type){
    if(type==="Totale")return "#e74c3c";
    if(type==="Partielle")return "#e67e22";
    return "#8a9fc4";
  }
  function renderEclipse(e, i, isPast){
    var d = new Date(e.date);
    var manzil = MANAZIL[e.manzil-1];
    var c = typeColor(e.type);
    return(
      <div key={i} style={{background:isPast?(t.rowBg+"88"):t.rowBg,border:"1px solid "+(isPast?(c+"22"):(c+"66")),borderRadius:14,padding:"14px",marginBottom:10,opacity:isPast?0.7:1}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <div style={{fontSize:30}}>{e.type==="Totale"?"🌑":e.type==="Partielle"?"🌒":"🌕"}</div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
              <span style={{fontSize:10,background:c+"22",color:c,border:"1px solid "+c+"44",borderRadius:20,padding:"2px 8px",fontWeight:"bold"}}>{e.type}</span>
              {isPast&&<span style={{fontSize:9,color:t.textMuted,fontWeight:"bold"}}>Passee</span>}
            </div>
            <div style={{fontSize:14,color:t.textLight,fontWeight:"bold",marginBottom:2}}>{e.nom}</div>
            <div style={{fontSize:12,color:t.accentSoft,fontWeight:"bold"}}>{d.toLocaleDateString("fr-FR",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})}</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          {[["Heure",e.heure],["Magnitude",e.magnitude],["Duree",e.duree],["Visible",e.visible.substring(0,25)+"..."]].map(function(item){return(
            <div key={item[0]} style={{background:t.accent+"11",borderRadius:8,padding:"6px 8px"}}>
              <div style={{fontSize:9,color:t.textMuted,marginBottom:2,fontWeight:"bold"}}>{item[0]}</div>
              <div style={{fontSize:11,color:t.accentSoft,fontWeight:"bold"}}>{item[1]}</div>
            </div>
          );})}
        </div>
        {manzil&&(
          <div style={{background:t.accent+"11",border:"1px solid "+t.accent+"22",borderRadius:8,padding:"8px 10px",marginBottom:8}}>
            <div style={{fontSize:10,color:t.accent,fontWeight:"bold",marginBottom:3}}>Manzil durant l eclipse</div>
            <div style={{fontSize:13,color:t.accentSoft,direction:"rtl",fontWeight:"bold"}}>{manzil.ar} - {manzil.fr}</div>
          </div>
        )}
        <div style={{fontSize:11,color:t.textMuted,lineHeight:1.6,fontWeight:"600"}}>{e.conseil}</div>
      </div>
    );
  }
  return (
    <div>
      <h3 style={{color:t.accent,fontSize:14,letterSpacing:2,marginBottom:8,fontWeight:"bold"}}>Eclipses Lunaires</h3>
      <p style={{fontSize:11,color:t.textMuted,marginBottom:14,lineHeight:1.5,fontWeight:"600"}}>Prochaines eclipses avec leur manzil correspondant et conseils spirituels.</p>
      {upcoming.length>0&&(
        <div>
          <div style={{fontSize:12,color:t.accentSoft,marginBottom:10,fontWeight:"bold"}}>A venir</div>
          {upcoming.map(function(e,i){return renderEclipse(e,i,false);})}
        </div>
      )}
      {past.length>0&&(
        <div>
          <div style={{fontSize:12,color:t.textMuted,marginBottom:10,marginTop:14,fontWeight:"bold"}}>Passees</div>
          {past.map(function(e,i){return renderEclipse(e,i,true);})}
        </div>
      )}
    </div>
  );
}


// ─── Sen-Astro Radio ──────────────────────────────────────────────────────
const RADIO_PLAYLIST = [
  {id:"MQXvu3A0i_g",title:"Emission Sen-Astro #1"},
  {id:"emGJEIcOmT4",title:"Emission Sen-Astro #2"},
  {id:"NGEmXwmjEPE",title:"Emission Sen-Astro #3"},
  {id:"7fCHiYRIi-0",title:"Emission Sen-Astro #4"},
  {id:"CN_0gRMnK80",title:"Emission Sen-Astro #5"},
  {id:"h4Yr5k92pfc",title:"Emission Sen-Astro #6"},
  {id:"SvsI-Z1Jis4",title:"Emission Sen-Astro #7"},
  {id:"_Lyre2nvsBI",title:"Emission Sen-Astro #8"},
  {id:"XjG6qxaa4DY",title:"Emission Sen-Astro #9"},
  {id:"pG7ON0SBZhY",title:"Emission Sen-Astro #10"},
  {id:"UZNfEirLH-0",title:"Emission Sen-Astro #11"},
  {id:"yTBHgLpsbCs",title:"Emission Sen-Astro #12"},
  {id:"Qpo_R22P2T0",title:"Emission Sen-Astro #13"},
  {id:"8BJQaQUcQjA",title:"Emission Sen-Astro #14"},
  {id:"U-FoqGuOHgI",title:"Emission Sen-Astro #15"},
  {id:"OKwsOTe1VBQ",title:"Emission Sen-Astro #16"},
];

// Charger YouTube API une seule fois
var ytApiLoaded = false;
function loadYouTubeAPI() {
  if(ytApiLoaded) return;
  ytApiLoaded = true;
  var s = document.createElement("script");
  s.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(s);
}

function RadioPlayer(props) {
  var t = props.t;
  var playing = useState(false); var isPlaying = playing[0]; var setIsPlaying = playing[1];
  var idx = useState(0); var curIdx = idx[0]; var setCurIdx = idx[1];
  var expanded = useState(false); var isExpanded = expanded[0]; var setExpanded = expanded[1];
  var playerRef = useRef(null);
  var playerReady = useRef(false);
  var containerId = "yt-radio-player";

  var track = RADIO_PLAYLIST[curIdx];
  var thumb = "https://img.youtube.com/vi/"+track.id+"/mqdefault.jpg";

  useEffect(function(){
    // Charger l API YouTube
    loadYouTubeAPI();
    // Attendre que l API soit prête
    var attempts = 0;
    var interval = setInterval(function(){
      attempts++;
      if(window.YT && window.YT.Player){
        clearInterval(interval);
        initPlayer();
      }
      if(attempts > 30) clearInterval(interval);
    }, 500);
    return function(){ clearInterval(interval); };
  },[]);

  function initPlayer(){
    if(playerRef.current) return;
    try {
      playerRef.current = new window.YT.Player(containerId, {
        height:"1", width:"1",
        videoId: RADIO_PLAYLIST[0].id,
        playerVars:{
          autoplay:0, controls:0, disablekb:1,
          fs:0, iv_load_policy:3, modestbranding:1,
          playsinline:1, rel:0
        },
        events:{
          onReady: function(e){ playerReady.current = true; },
          onStateChange: function(e){
            if(window.YT){
              var playing = e.data === window.YT.PlayerState.PLAYING;
              setIsPlaying(playing);
              if(e.data === window.YT.PlayerState.ENDED){
                setCurIdx(function(prev){
                  var next = (prev+1)%RADIO_PLAYLIST.length;
                  setTimeout(function(){
                    if(playerRef.current && playerReady.current){
                      playerRef.current.loadVideoById(RADIO_PLAYLIST[next].id);
                    }
                  }, 500);
                  return next;
                });
              }
            }
          }
        }
      });
    } catch(e){ console.log("YT init error:", e); }
  }

  function togglePlay(){
    if(!playerRef.current || !playerReady.current){
      // Fallback: ouvrir YouTube
      window.open("https://www.youtube.com/watch?v="+track.id,"_blank");
      return;
    }
    try {
      if(isPlaying){
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.loadVideoById(track.id);
        playerRef.current.playVideo();
      }
    } catch(e){
      window.open("https://www.youtube.com/watch?v="+track.id,"_blank");
    }
  }

  function changeTrack(newIdx){
    setCurIdx(newIdx);
    setIsPlaying(false);
    if(playerRef.current && playerReady.current){
      try {
        playerRef.current.cueVideoById(RADIO_PLAYLIST[newIdx].id);
      } catch(e){}
    }
  }

  function prev(){ changeTrack((curIdx+RADIO_PLAYLIST.length-1)%RADIO_PLAYLIST.length); }
  function next(){ changeTrack((curIdx+1)%RADIO_PLAYLIST.length); }

  // Conteneur YouTube caché
  var ytContainer = (
    <div style={{position:"fixed",bottom:0,right:0,width:1,height:1,opacity:0,pointerEvents:"none",zIndex:-1}}>
      <div id={containerId}/>
    </div>
  );

  // Mini player fixe
  if(!isExpanded){
    return (
      <div>
        {ytContainer}
        <div style={{position:"fixed",bottom:36,left:0,right:0,maxWidth:430,margin:"0 auto",zIndex:200,padding:"0 0"}}>
          <div style={{background:"linear-gradient(135deg,#1B1464f0,#07061af0)",border:"1px solid #C9A84C66",borderRadius:"16px 16px 0 0",padding:"10px 14px",backdropFilter:"blur(16px)",boxShadow:"0 -4px 30px rgba(0,0,0,0.6)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <img src={thumb} alt="" style={{width:44,height:28,borderRadius:6,objectFit:"cover",flexShrink:0,border:"1px solid #C9A84C44"}}
                onError={function(e){e.target.style.display="none";}}/>
              <div style={{flex:1,minWidth:0,cursor:"pointer"}} onClick={function(){setExpanded(true);}}>
                <div style={{fontSize:8,color:"#C9A84C",fontWeight:"bold",letterSpacing:2,marginBottom:1}}>SEN-ASTRO RADIO</div>
                <div style={{fontSize:11,color:"#e8c97a",fontWeight:"bold",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{track.title}</div>
              </div>
              {isPlaying&&(
                <div style={{display:"flex",alignItems:"flex-end",gap:2,height:16,marginRight:2}}>
                  {[40,100,60,80,35].map(function(h,i){return(
                    <div key={i} style={{width:3,background:"linear-gradient(to top,#C9A84C,#e8c97a)",borderRadius:2,height:h+"%",animation:"eq "+(0.5+i*0.1)+"s ease-in-out infinite alternate"}}/>
                  );})}
                </div>
              )}
              <button onClick={prev} style={{background:"none",border:"none",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:18,padding:"4px",fontWeight:"bold"}}>⏮</button>
              <button onClick={togglePlay}
                style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#e0a820,#B8860B)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:"#07061a",fontWeight:"bold",boxShadow:"0 0 16px rgba(184,134,11,0.5)",flexShrink:0}}>
                {isPlaying?"⏸":"▶"}
              </button>
              <button onClick={next} style={{background:"none",border:"none",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:18,padding:"4px",fontWeight:"bold"}}>⏭</button>
              <button onClick={function(){setExpanded(true);}} style={{background:"none",border:"none",color:"rgba(255,255,255,0.3)",cursor:"pointer",fontSize:16,padding:"4px",fontWeight:"bold"}}>▲</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vue complète
  return (
    <div>
      {ytContainer}
      <div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={function(e){if(e.target===e.currentTarget)setExpanded(false);}}>
        <div style={{width:"100%",maxWidth:430,background:"linear-gradient(180deg,#1B1464 0%,#07061a 100%)",borderRadius:"24px 24px 0 0",padding:"0 0 32px",maxHeight:"92vh",overflowY:"auto"}}>
          {/* Handle */}
          <div style={{textAlign:"center",padding:"12px 0 0",cursor:"pointer"}} onClick={function(){setExpanded(false);}}>
            <div style={{width:44,height:4,background:"rgba(255,255,255,0.2)",borderRadius:2,margin:"0 auto"}}/>
          </div>
          {/* Header */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 20px"}}>
            <div>
              <div style={{fontSize:11,color:"#C9A84C",fontWeight:"bold",letterSpacing:3}}>SEN-ASTRO RADIO</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",fontWeight:"bold"}}>Astrologie - Spiritualite - Manazil</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:"#ff4444",animation:"blink 1.2s infinite"}}/>
              <span style={{fontSize:9,color:"#ff6b6b",fontWeight:"bold",letterSpacing:1}}>EN DIRECT</span>
            </div>
            <button onClick={function(){setExpanded(false);}} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:20,padding:"5px 12px",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:11,fontWeight:"bold"}}>Fermer</button>
          </div>
          {/* Thumb */}
          <div style={{padding:"0 20px",marginBottom:16}}>
            <div style={{position:"relative",borderRadius:16,overflow:"hidden",border:"1px solid #C9A84C33",background:"#1B1464"}}>
              <img src={thumb} alt="" style={{width:"100%",aspectRatio:"16/9",objectFit:"cover",display:"block"}}
                onError={function(e){e.target.style.minHeight="160px";}}/>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(8,5,32,0.9) 0%,transparent 60%)"}}/>
              <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"14px 16px 12px"}}>
                <div style={{fontSize:15,color:"white",fontWeight:"bold",marginBottom:3}}>{track.title}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",fontWeight:"bold"}}>{curIdx+1} / {RADIO_PLAYLIST.length} emissions</div>
              </div>
              {isPlaying&&(
                <div style={{position:"absolute",top:10,right:10,display:"flex",alignItems:"flex-end",gap:3,height:20}}>
                  {[40,100,60,80,35].map(function(h,i){return(
                    <div key={i} style={{width:3,background:"linear-gradient(to top,#C9A84C,#e8c97a)",borderRadius:2,height:h+"%",animation:"eq "+(0.5+i*0.1)+"s ease-in-out infinite alternate"}}/>
                  );})}
                </div>
              )}
            </div>
          </div>
          {/* Controls */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:28,marginBottom:20}}>
            <button onClick={prev} style={{background:"none",border:"none",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:28,fontWeight:"bold"}}>⏮</button>
            <button onClick={togglePlay}
              style={{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#e0a820,#B8860B)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,color:"#07061a",fontWeight:"bold",boxShadow:"0 0 35px rgba(184,134,11,0.6)"}}>
              {isPlaying?"⏸":"▶"}
            </button>
            <button onClick={next} style={{background:"none",border:"none",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:28,fontWeight:"bold"}}>⏭</button>
          </div>
          {/* Liens rapides */}
          <div style={{padding:"0 20px",marginBottom:14,display:"flex",gap:8}}>
            <a href="https://wa.me/221764265550" target="_blank" rel="noopener noreferrer"
              style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"#25D366",borderRadius:10,padding:"10px",textDecoration:"none",color:"white",fontSize:12,fontWeight:"bold"}}>
              WhatsApp
            </a>
            <a href="https://iqbmnusp.mychariow.shop/" target="_blank" rel="noopener noreferrer"
              style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"linear-gradient(135deg,#e0a820,#B8860B)",borderRadius:10,padding:"10px",textDecoration:"none",color:"#07061a",fontSize:12,fontWeight:"bold"}}>
              Boutique
            </a>
          </div>
          {/* Playlist */}
          <div style={{padding:"0 20px"}}>
            <div style={{fontSize:11,color:"#C9A84C",fontWeight:"bold",letterSpacing:2,marginBottom:10}}>{RADIO_PLAYLIST.length} EMISSIONS</div>
            <div style={{maxHeight:280,overflowY:"auto"}}>
              {RADIO_PLAYLIST.map(function(tr,i){
                var isActive = i===curIdx;
                return(
                  <div key={i} onClick={function(){changeTrack(i);}}
                    style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,marginBottom:4,background:isActive?"linear-gradient(135deg,rgba(42,31,143,0.6),rgba(27,20,100,0.7))":"rgba(255,255,255,0.03)",border:isActive?"1px solid rgba(184,134,11,0.45)":"1px solid rgba(255,255,255,0.04)",cursor:"pointer"}}>
                    <img src={"https://img.youtube.com/vi/"+tr.id+"/default.jpg"} alt=""
                      style={{width:48,height:27,borderRadius:6,objectFit:"cover",flexShrink:0}}
                      onError={function(e){e.target.style.display="none";}}/>
                    <div style={{fontSize:10,color:isActive?"#C9A84C":"rgba(255,255,255,0.2)",minWidth:20,fontWeight:"bold"}}>{isActive?"▶":String(i+1).padStart(2,"0")}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,color:isActive?"white":"rgba(255,255,255,0.7)",fontWeight:isActive?"bold":"600",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{tr.title}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────
export default function App() {
  var sd=useState(new Date()); var selDate=sd[0]; var setSelDate=sd[1];
  var sy=useState("sidereal"); var sys=sy[0]; var setSys=sy[1];
  var mds=useState(null); var md=mds[0]; var setMd=mds[1];
  var ld=useState(false); var loading=ld[0]; var setLoading=ld[1];
  var tb=useState("today"); var tab=tb[0]; var setTab=tb[1];
  var tk=useState("night"); var themeKey=tk[0]; var setThemeKey=tk[1];
  var hd=useState(null); var hijriDate=hd[0]; var setHijriDate=hd[1];
  var t = THEMES[themeKey];

  var tabOrder = ["today","boutique","natal","dua","dhikr","wheel","calendar","dates","roles","list","tafsir","nuits","eclipses","settings"];
  var touchStart = useRef(null);

  function handleTouchStart(e) { touchStart.current = e.touches[0].clientX; }
  function handleTouchEnd(e) {
    if(!touchStart.current)return;
    var diff = touchStart.current - e.changedTouches[0].clientX;
    if(Math.abs(diff)>50){
      var idx = tabOrder.indexOf(tab);
      if(diff>0&&idx<tabOrder.length-1){setTab(tabOrder[idx+1]);}
      else if(diff<0&&idx>0){setTab(tabOrder[idx-1]);}
    }
    touchStart.current = null;
  }

  var compute = useCallback(function(d,s){
    setLoading(true);
    setTimeout(function(){setMd(calcData(d,s));setLoading(false);},250);
  },[]);

  useEffect(function(){compute(selDate,sys);},[selDate,sys]);

  useEffect(function(){
    setHijriDate(null);
    fetchHijriDate(selDate).then(function(result){
      if(result){setHijriDate(result);}
      else{setHijriDate(toHijriLocal(selDate));}
    });
  },[selDate]);

  useEffect(function(){
    if("serviceWorker" in navigator){
      navigator.serviceWorker.addEventListener("message",function(event){
        if(event.data&&event.data.type==="NEW_VERSION"){window.location.reload();}
      });
    }
  },[]);

  var ds = selDate.toISOString().split("T")[0];
  var h = String(selDate.getHours()).padStart(2,"0");
  var mn = String(selDate.getMinutes()).padStart(2,"0");
  var ts = h+":"+mn;
  var ph = phase(selDate);

  var TABS = [
    ["today","Aujourd hui"],["boutique","Boutique"],["natal","Natal"],
    ["dua","Dua"],["dhikr","Dhikr"],["wheel","Roue"],["calendar","Mois"],
    ["dates","Dates"],["roles","Roles"],["list","Les 28"],
    ["tafsir","Tafsir"],["nuits","Nuits"],["eclipses","Eclipses"],["settings","Reglages"]
  ];

  var TAB_ICONS = {
    today:"🌙",boutique:"🛍️",natal:"⭐",dua:"🤲",dhikr:"📿",
    wheel:"⭕",calendar:"📅",dates:"🗓️",roles:"📖",list:"📋",
    tafsir:"📖",nuits:"✨",eclipses:"🌑",settings:"⚙️"
  };

  return (
    <div style={{minHeight:"100vh",maxWidth:430,margin:"0 auto",background:t.root,fontFamily:"Georgia,serif",color:t.textLight,position:"relative",overflow:"hidden"}}
      onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {t.starsBg&&<StarField/>}
      <style>{ANIM_CSS}</style>

      <header style={{textAlign:"center",padding:"20px 20px 10px",background:t.header,borderBottom:"1px solid "+t.headerBorder,position:"sticky",top:0,zIndex:50,backdropFilter:"blur(12px)"}}>
        <div style={{position:"absolute",top:-80,left:"50%",transform:"translateX(-50%)",width:200,height:200,background:"radial-gradient(circle,"+t.accent+"18 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{letterSpacing:6,fontSize:11,marginBottom:4,textTransform:"uppercase",fontWeight:"bold"}}>
          <span style={{color:t.accent}}>SEN</span>
          <span style={{color:t.textMuted,margin:"0 3px"}}>✦</span>
          <span style={{color:t.textMuted}}>ASTRO</span>
        </div>
        <h1 style={{margin:"0 0 3px",fontSize:24,fontWeight:"bold",color:t.accentSoft,letterSpacing:2}}>منازل القمر</h1>
        <p style={{margin:0,fontSize:10,color:t.textMuted,letterSpacing:4,textTransform:"uppercase",fontWeight:"bold"}}>STATIONS LUNAIRES</p>
        {hijriDate&&(
          <div style={{marginTop:4}}>
            <div style={{fontSize:12,fontWeight:"bold",color:t.accent,direction:"rtl"}}>{hijriDate.displayAr||hijriDate.display}</div>
          </div>
        )}
      </header>

      <BookBanner/>

      <div style={{display:"flex",gap:6,padding:"8px 12px",background:t.tabsBg+"99",borderBottom:"1px solid "+t.tabBorder,alignItems:"center"}}>
        {[["sidereal","☽","Sideral","Arabo-islamique"],["tropical","☀","Tropical","Occidental"]].map(function(item){
          var k=item[0], icon=item[1], title=item[2], sub=item[3];
          return(
            <button key={k} style={{flex:1,display:"flex",alignItems:"center",gap:6,background:sys===k?t.sysBtnActiveBg:"none",border:sys===k?("1px solid "+t.sysBtnActiveBorder):("1px solid "+t.sysBtnBorder),borderRadius:10,padding:"7px 8px",cursor:"pointer",color:sys===k?t.textLight:t.textMuted,fontFamily:"inherit"}}
              onClick={function(){setSys(k);}}>
              <span style={{fontSize:18}}>{icon}</span>
              <div>
                <div style={{fontSize:13,fontWeight:"bold"}}>{title}</div>
                <div style={{fontSize:10,color:t.textMuted,fontWeight:"600"}}>{sub}</div>
              </div>
            </button>
          );
        })}
        <div style={{display:"flex",flexDirection:"column",gap:3,marginLeft:4}}>
          {Object.entries(THEMES).map(function(entry){
            var k=entry[0], th=entry[1];
            return(
              <button key={k} onClick={function(){setThemeKey(k);}}
                style={{padding:"4px 8px",background:themeKey===k?(th.accent+"33"):"none",border:themeKey===k?("1px solid "+th.accent+"99"):("1px solid "+t.tabBorder),borderRadius:6,color:themeKey===k?th.accent:t.textMuted,fontSize:11,fontWeight:"bold",cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
                {THEME_ICONS[k]} {th.name}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{display:"flex",background:t.tabsBg,borderBottom:"1px solid "+t.tabBorder,overflowX:"auto"}}>
        {TABS.map(function(item){
          var k=item[0], l=item[1];
          return(
            <button key={k} style={{flexShrink:0,padding:"13px 10px",background:tab===k?(t.accent+"18"):"none",border:"none",borderBottom:tab===k?("3px solid "+t.accent):"3px solid transparent",color:tab===k?t.accentSoft:t.textMuted,cursor:"pointer",fontSize:11,fontWeight:tab===k?"bold":"600",fontFamily:"inherit",whiteSpace:"nowrap"}}
              onClick={function(){setTab(k);}}>
              {TAB_ICONS[k]} {l}
            </button>
          );
        })}
      </div>

      <div style={{padding:"12px 12px 130px",animation:"fadeUp .35s ease both"}} key={tab}>
        {tab==="today"&&(
          <TodayView md={md} loading={loading} ph={ph} sys={sys} selDate={selDate} ds={ds} ts={ts} t={t} hijriDate={hijriDate}
            onDC={function(e){var d=new Date(e.target.value);d.setHours(selDate.getHours(),selDate.getMinutes());setSelDate(d);}}
            onTC={function(e){var parts=e.target.value.split(":");var d=new Date(selDate);d.setHours(parseInt(parts[0]),parseInt(parts[1]),0);setSelDate(d);}}
          />
        )}
        {tab==="boutique"&&<BoutiqueView t={t}/>}
        {tab==="natal"&&<NatalView sys={sys} t={t}/>}
        {tab==="dua"&&<DuaView md={md} t={t}/>}
        {tab==="dhikr"&&<DhikrView md={md} t={t}/>}
        {tab==="wheel"&&<WheelView md={md} ph={ph} t={t}/>}
        {tab==="calendar"&&<MonthCal selDate={selDate} setSelDate={setSelDate} sys={sys} setTab={setTab} t={t}/>}
        {tab==="dates"&&<FavorableDates sys={sys} t={t}/>}
        {tab==="roles"&&<RolesView md={md} t={t}/>}
        {tab==="list"&&<ListView idx={md?md.manzilIdx:-1} t={t}/>}
        {tab==="tafsir"&&<TafsirView t={t}/>}
        {tab==="nuits"&&<NuitsView t={t}/>}
        {tab==="eclipses"&&<EclipsesView t={t}/>}
        {tab==="settings"&&<SettingsView t={t}/>}
      </div>

      <RadioPlayer t={t}/>

      <button onClick={function(){window.scrollTo({top:0,behavior:"smooth"});}}
        style={{position:"fixed",bottom:85,right:16,width:40,height:40,borderRadius:"50%",background:t.accent,border:"none",color:t.deepBlue,fontSize:20,fontWeight:"bold",cursor:"pointer",zIndex:100,boxShadow:"0 4px 16px "+t.accent+"66",animation:"pulse 2s infinite"}}>
        ↑
      </button>

      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:t.deepBlue+"f0",borderTop:"1px solid "+t.accent+"22",textAlign:"center",padding:"7px 0",backdropFilter:"blur(10px)"}}>
        <span style={{fontSize:11,color:t.textMuted,letterSpacing:1,fontWeight:"bold"}}>Sen-Astro - Ibn Ajiba et Al-Buni - manazil-senastro.com</span>
      </div>
    </div>
  );
}
