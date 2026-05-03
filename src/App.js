/* eslint-disable */
import { useState, useEffect, useCallback, useRef } from "react";

// ─── Thèmes ───────────────────────────────────────────────────────────────
const THEMES = {
  night:{name:"🌙 Nuit",root:"radial-gradient(ellipse at 50% 0%,#1c1860 0%,#07061a 55%)",header:"linear-gradient(180deg,#1B1464dd 0%,transparent 100%)",headerBorder:"#C9A84C33",tabsBg:"#10102e",tabBorder:"#C9A84C22",accent:"#C9A84C",accentSoft:"#e8c97a",textLight:"#e8dfc8",textMuted:"#7a7090",cardBg:"linear-gradient(160deg,#1B1464bb 0%,#0c0b25 100%)",cardBorder:"#C9A84C55",phaseBg:"linear-gradient(135deg,#10102e 0%,#1B146488 100%)",phaseBorder:"#C9A84C33",rowBg:"#10102e88",rowBorder:"#C9A84C22",rowActiveBg:"#1B1464aa",rowActiveBorder:"#C9A84C77",sysBtnBorder:"#C9A84C22",sysBtnActiveBg:"#C9A84C18",sysBtnActiveBorder:"#C9A84C99",inputColor:"dark",starsBg:true,deepBlue:"#07061a",listActiveBg:"#1B1464cc",listActiveShadow:"#C9A84C22"},
  white:{name:"☀ Blanc",root:"linear-gradient(180deg,#f8f9fc 0%,#e8eaf0 100%)",header:"linear-gradient(180deg,#ffffffee 0%,transparent 100%)",headerBorder:"#9090b022",tabsBg:"#ffffff",tabBorder:"#9090b022",accent:"#5c6bc0",accentSoft:"#3949ab",textLight:"#1a1a2e",textMuted:"#6b6b8a",cardBg:"linear-gradient(160deg,#ffffff 0%,#f0f2fa 100%)",cardBorder:"#9090b044",phaseBg:"linear-gradient(135deg,#ffffff 0%,#e8eaf0 100%)",phaseBorder:"#9090b033",rowBg:"#ffffffcc",rowBorder:"#9090b022",rowActiveBg:"#e8eaf0",rowActiveBorder:"#5c6bc066",sysBtnBorder:"#9090b033",sysBtnActiveBg:"#5c6bc018",sysBtnActiveBorder:"#5c6bc099",inputColor:"light",starsBg:false,deepBlue:"#f8f9fc",listActiveBg:"#e8eaf0",listActiveShadow:"#5c6bc022"},
  nature:{name:"🌿 Nature",root:"radial-gradient(ellipse at 50% 0%,#0d2b1a 0%,#070f08 55%)",header:"linear-gradient(180deg,#0d2b1add 0%,transparent 100%)",headerBorder:"#2e7d3233",tabsBg:"#0a1f0c",tabBorder:"#2e7d3222",accent:"#43a047",accentSoft:"#81c784",textLight:"#e8f5e9",textMuted:"#558b5a",cardBg:"linear-gradient(160deg,#0d2b1abb 0%,#050e06 100%)",cardBorder:"#2e7d3255",phaseBg:"linear-gradient(135deg,#0a1f0c 0%,#0d2b1a88 100%)",phaseBorder:"#2e7d3233",rowBg:"#0a1f0c88",rowBorder:"#2e7d3222",rowActiveBg:"#0d2b1aaa",rowActiveBorder:"#43a04777",sysBtnBorder:"#2e7d3222",sysBtnActiveBg:"#43a04718",sysBtnActiveBorder:"#43a04799",inputColor:"dark",starsBg:true,deepBlue:"#070f08",listActiveBg:"#0d2b1acc",listActiveShadow:"#43a04722"},
  sepia:{name:"📜 Sépia",root:"linear-gradient(180deg,#2c1a0e 0%,#1a0f06 55%)",header:"linear-gradient(180deg,#2c1a0edd 0%,transparent 100%)",headerBorder:"#c8924433",tabsBg:"#1a0f06",tabBorder:"#c8924422",accent:"#c89244",accentSoft:"#e8b86d",textLight:"#f5e6d0",textMuted:"#8b6545",cardBg:"linear-gradient(160deg,#2c1a0ebb 0%,#120a04 100%)",cardBorder:"#c8924455",phaseBg:"linear-gradient(135deg,#1a0f06 0%,#2c1a0e88 100%)",phaseBorder:"#c8924433",rowBg:"#1a0f0688",rowBorder:"#c8924422",rowActiveBg:"#2c1a0eaa",rowActiveBorder:"#c8924477",sysBtnBorder:"#c8924422",sysBtnActiveBg:"#c8924418",sysBtnActiveBorder:"#c8924499",inputColor:"dark",starsBg:false,deepBlue:"#120a04",listActiveBg:"#2c1a0ecc",listActiveShadow:"#c8924422"},
};

const SIGNES=[{fr:"Bélier",ar:"الحَمَل",emoji:"♈"},{fr:"Taureau",ar:"الثَّوْر",emoji:"♉"},{fr:"Gémeaux",ar:"الجَوْزَاء",emoji:"♊"},{fr:"Cancer",ar:"السَّرَطَان",emoji:"♋"},{fr:"Lion",ar:"الأَسَد",emoji:"♌"},{fr:"Vierge",ar:"السُّنْبُلَة",emoji:"♍"},{fr:"Balance",ar:"المِيزَان",emoji:"♎"},{fr:"Scorpion",ar:"العَقْرَب",emoji:"♏"},{fr:"Sagittaire",ar:"القَوْس",emoji:"♐"},{fr:"Capricorne",ar:"الجَدْي",emoji:"♑"},{fr:"Verseau",ar:"الدَّلْو",emoji:"♒"},{fr:"Poissons",ar:"الحُوت",emoji:"♓"}];
function getSigneFromLon(lon){const idx=Math.floor(lon/30)%12;const deg=lon%30;return{signe:SIGNES[idx],deg:Math.floor(deg),min:Math.floor((deg%1)*60)};}

// ─── Du'a des Manzils ─────────────────────────────────────────────────────
const DUAS = [
  {ar:"اللَّهُمَّ بَارِكْ لِي فِي مَا بَدَأْتُ وَأَعِنِّي عَلَى إِتْمَامِهِ",fr:"Ô Allah, bénis-moi dans ce que j'ai commencé et aide-moi à l'achever.",occasion:"À réciter au début de tout nouveau projet ou voyage."},
  {ar:"اللَّهُمَّ اجْعَلْ سِرِّي أَفْضَلَ مِنْ عَلَانِيَتِي",fr:"Ô Allah, fais que mon intérieur soit meilleur que mon apparence.",occasion:"À réciter pour purifier les intentions secrètes."},
  {ar:"اللَّهُمَّ أَرِنَا الْحَقَّ حَقًّا وَارْزُقْنَا اتِّبَاعَهُ",fr:"Ô Allah, montre-nous la vérité comme vérité et accorde-nous de la suivre.",occasion:"À réciter pour la guidance et la clarté dans les affaires."},
  {ar:"اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",fr:"Ô Allah, je me réfugie en Toi contre l'anxiété et la tristesse.",occasion:"À réciter dans les moments de difficulté et d'épreuve."},
  {ar:"رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",fr:"Seigneur, ouvre ma poitrine et facilite-moi mes affaires.",occasion:"À réciter avant toute guérison ou nouvelle entreprise."},
  {ar:"اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",fr:"Ô Allah, je Te demande la santé en ce monde et dans l'au-delà.",occasion:"À réciter dans les moments de contrainte et de besoin."},
  {ar:"اللَّهُمَّ اجْعَلْنَا مِنَ الشَّاكِرِينَ وَالذَّاكِرِينَ",fr:"Ô Allah, fais de nous des reconnaissants et de ceux qui Te glorifient.",occasion:"À réciter pour attirer la bénédiction et l'abondance."},
  {ar:"اللَّهُمَّ وَسِّعْ لَنَا فِي رِزْقِنَا وَبَارِكْ لَنَا فِيهِ",fr:"Ô Allah, élargis notre subsistance et bénis-la pour nous.",occasion:"À réciter pour le commerce, les transactions et la générosité."},
  {ar:"أَعُوذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيمِ وَمِنْ كُلِّ شَرٍّ",fr:"Je me réfugie en Allah contre le diable maudit et tout mal.",occasion:"À réciter pour se protéger des influences négatives."},
  {ar:"اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ خَلَقْتَنِي",fr:"Ô Allah, Tu es mon Seigneur. Il n'y a de dieu que Toi. Tu m'as créé.",occasion:"Sayyid al-Istighfar — à réciter pour toute bonne action."},
  {ar:"رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً",fr:"Seigneur, accorde-nous le bien en ce monde et le bien dans l'au-delà.",occasion:"À réciter pour toutes les bonnes entreprises."},
  {ar:"اللَّهُمَّ بَارِكْ لِي فِي مَالِي وَأَهْلِي",fr:"Ô Allah, bénis-moi dans mes biens et ma famille.",occasion:"À réciter pour le commerce et les affaires agricoles."},
  {ar:"رَبِّ أَعِنِّي وَلَا تُعِنْ عَلَيَّ وَانْصُرْنِي",fr:"Seigneur, aide-moi et ne donne pas aide contre moi, et soutiens-moi.",occasion:"À réciter pour obtenir faveurs des autorités."},
  {ar:"اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ",fr:"Ô Allah, je Te demande de Ta grâce immense.",occasion:"Sous Spica, le manzil le plus béni — réciter abondamment."},
  {ar:"سُبْحَانَ اللهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ",fr:"Gloire à Allah et Sa louange, au nombre de Ses créatures.",occasion:"À réciter pour les affaires discrètes et la protection."},
  {ar:"حَسْبُنَا اللهُ وَنِعْمَ الْوَكِيلُ",fr:"Allah nous suffit et Il est le meilleur garant.",occasion:"À réciter dans les moments de danger et de difficulté."},
  {ar:"اللَّهُمَّ ارْزُقْنَا الْجَنَّةَ وَمَا قَرَّبَ إِلَيْهَا",fr:"Ô Allah, accorde-nous le Paradis et ce qui nous en rapproche.",occasion:"À réciter après chaque voyage et commerce réussi."},
  {ar:"أَعُوذُ بِعِزَّةِ اللهِ وَقُدْرَتِهِ مِمَّا أَجِدُ وَأُحَاذِرُ",fr:"Je me réfugie en la puissance d'Allah contre ce que je ressens et crains.",occasion:"À réciter pour la protection contre les maladies."},
  {ar:"اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ زَوَالِ نِعْمَتِكَ",fr:"Ô Allah, je me réfugie en Toi contre la disparition de Ta grâce.",occasion:"À réciter pour préserver ses biens et sa santé."},
  {ar:"رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ",fr:"Seigneur, accorde-nous de nos époux et enfants la joie des yeux.",occasion:"À réciter pour la famille et l'élevage."},
  {ar:"اللَّهُمَّ أَصْلِحْ لِي دِينِي وَدُنْيَايَ وَآخِرَتِي",fr:"Ô Allah, rectifie pour moi ma religion, ma vie et mon au-delà.",occasion:"À réciter dans les moments de contrainte et de vide spirituel."},
  {ar:"اللَّهُمَّ اقْسِمْ لَنَا مِنْ خَشْيَتِكَ مَا يَحُولُ بَيْنَنَا وَبَيْنَ مَعَاصِيكَ",fr:"Ô Allah, accorde-nous de Ta crainte ce qui nous sépare de Tes péchés.",occasion:"Au début des Sa'ūd — serie des manzils fortunés."},
  {ar:"اللَّهُمَّ اشْفِنِي شِفَاءً لَا يُغَادِرُ سَقَمًا",fr:"Ô Allah, guéris-moi d'une guérison qui ne laisse aucune maladie.",occasion:"À réciter pour la guérison complète des maladies."},
  {ar:"اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ",fr:"Ô Allah, Tu es la Paix et de Toi vient la paix.",occasion:"Sous le manzil le plus fortuné — à réciter abondamment."},
  {ar:"رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا",fr:"Seigneur, augmente mes connaissances et accorde-moi la compréhension.",occasion:"À réciter pour l'apprentissage et la compréhension."},
  {ar:"اللَّهُمَّ اجْعَلْ عَوَاقِبَ أُمُورِنَا خَيْرًا",fr:"Ô Allah, fais que les issues de nos affaires soient bonnes.",occasion:"À réciter pour que les constructions et projets réussissent."},
  {ar:"اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا",fr:"Ô Allah, bénis-nous dans ce que Tu nous as accordé.",occasion:"Avant la clôture du cycle — pour clore avec gratitude."},
  {ar:"اللَّهُمَّ اخْتِمْ لَنَا بِخَيْرٍ وَاجْعَلْ عَاقِبَتَنَا إِلَى خَيْرٍ",fr:"Ô Allah, clôture nos vies par le bien et fais que notre fin soit vers le bien.",occasion:"Dernier manzil — clôture du cycle avec bénédiction."},
];

// ─── Hadiths liés à la Lune ───────────────────────────────────────────────
const HADITHS = [
  {texte:"رَأَى النَّبِيُّ ﷺ الْقَمَرَ لَيْلَةَ الْبَدْرِ فَقَالَ: إِنَّكُمْ سَتَرَوْنَ رَبَّكُمْ كَمَا تَرَوْنَ هَذَا الْقَمَرَ",traduction:"Le Prophète ﷺ regarda la lune la nuit de la pleine lune et dit : 'Vous verrez votre Seigneur comme vous voyez cette lune.'",source:"Bukhari & Muslim"},
  {texte:"هُوَ الَّذِي جَعَلَ الشَّمْسَ ضِيَاءً وَالْقَمَرَ نُورًا وَقَدَّرَهُ مَنَازِلَ",traduction:"C'est Lui qui a fait du Soleil un éclat et de la Lune une lumière, et Il lui a assigné des stations.",source:"Coran 10:5 — Référence directe aux Manāzil"},
  {texte:"يَسْأَلُونَكَ عَنِ الْأَهِلَّةِ ۖ قُلْ هِيَ مَوَاقِيتُ لِلنَّاسِ وَالْحَجِّ",traduction:"Ils t'interrogent sur les croissants de lune. Dis : Ce sont des indications de temps pour les hommes et pour le pèlerinage.",source:"Coran 2:189"},
  {texte:"كَانَ النَّبِيُّ ﷺ إِذَا رَأَى الْهِلَالَ قَالَ: اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْيُمْنِ وَالْإِيمَانِ",traduction:"Quand le Prophète ﷺ voyait le croissant, il disait : Ô Allah, fais-le se lever sur nous avec bénédiction et foi.",source:"Tirmidhi"},
  {texte:"وَالْقَمَرَ قَدَّرْنَاهُ مَنَازِلَ حَتَّى عَادَ كَالْعُرْجُونِ الْقَدِيمِ",traduction:"Et la Lune, Nous lui avons assigné des stations jusqu'à ce qu'elle redevienne comme un vieux régime de dattes.",source:"Coran 36:39 — Sourate Yāsīn"},
];

// ─── Interprétations Manzil de Naissance ─────────────────────────────────
const NATAL_INTERP = [
  {titre:"Âme pionnière",texte:"Né sous An-Naṭḥ, tu es une âme de commencements. Tu as le don de lancer des projets et d'inspirer les autres. Tes forces : l'initiative, le courage et l'énergie. Ibn Ajiba dit que les natifs de ce manzil 'sont destinés à ouvrir des chemins nouveaux'."},
  {titre:"Âme secrète",texte:"Né sous Al-Buṭayn, tu possèdes une profondeur intérieure rare. Tu gardes bien les secrets et as une intuition puissante. Tes forces : la discrétion, la loyauté et la perspicacité. Al-Buni dit que ces natifs 'voient ce que les autres ne voient pas'."},
  {titre:"Âme prospère",texte:"Né sous Ath-Thurayya, les Pléiades, tu portes une bénédiction naturelle. Commerce, voyage et relations sociales te réussissent. Tes forces : le charme, l'abondance et le don pour les affaires. Ibn Ajiba dit que ces natifs sont 'bénis dans leur subsistance'."},
  {titre:"Âme bâtisseur",texte:"Né sous Ad-Dabarān, tu as une volonté de fer et une résistance exceptionnelle. Les obstacles ne t'arrêtent pas. Tes forces : la persévérance, la solidité et la construction durable. Ce manzil forge des âmes capables de traverser les épreuves."},
  {titre:"Âme guérisseur",texte:"Né sous Al-Haq'a, tu as un don naturel pour la guérison et l'aide aux autres. Tu libères ce qui est bloqué. Tes forces : l'empathie, la guérison et la libération. Al-Buni dit que ces natifs 'portent la guérison dans leurs mains'."},
  {titre:"Âme profonde",texte:"Né sous Al-Han'a, tu as une force intérieure cachée. Tu excelles dans ce qui demande profondeur et rigueur. Tes forces : la rigueur, la profondeur et la persévérance souterraine. Ces natifs trouvent ce que les autres cherchent."},
  {titre:"Âme bénie",texte:"Né sous Adh-Dhirā', Castor et Pollux, tu es parmi les plus chanceux. Amour, amitié et succès t'accompagnent naturellement. Tes forces : la générosité, le charisme et la douceur. Ibn Ajiba dit que ces natifs 'portent la bénédiction avec eux'."},
  {titre:"Âme généreuse",texte:"Né sous An-Nathra, tu as un cœur immense et une générosité naturelle. Les gens t'aiment instinctivement. Tes forces : l'amour, la générosité et l'empathie. Al-Buni dit que ces natifs 'ouvrent les portes des cœurs'."},
  {titre:"Âme réfléchie",texte:"Né sous Aṭ-Ṭarf, tu as une sagesse naturelle qui te pousse à observer avant d'agir. Ta prudence est une force. Tes forces : l'observation, la prudence et la profondeur. Ces natifs évitent les erreurs que d'autres commettent."},
  {titre:"Âme royale",texte:"Né sous Al-Jabha, le front du Lion, tu portes une autorité naturelle. Les autres te suivent spontanément. Tes forces : le leadership, la dignité et la force de caractère. Ibn Ajiba dit que ces natifs 'sont nés pour commander avec justice'."},
  {titre:"Âme voyageuse",texte:"Né sous Az-Zubra, tu as l'âme d'un explorateur. Les voyages et les échanges t'épanouissent. Tes forces : la mobilité, l'adaptabilité et le sens des échanges. Ces natifs prospèrent loin de leur lieu de naissance."},
  {titre:"Âme transformatrice",texte:"Né sous Aṣ-Ṣarfa, tu as le don de la transformation. Tu sais tirer profit des changements que d'autres redoutent. Tes forces : l'adaptabilité, la transformation et la résilience. Al-Buni dit que ces natifs 'transforment les difficultés en opportunités'."},
  {titre:"Âme fidèle",texte:"Né sous Al-'Awwā', tu es d'une loyauté exemplaire. Tu servir bien et obtiens naturellement la confiance des autorités. Tes forces : la fidélité, le service et la fiabilité. Ces natifs sont des piliers pour leur communauté."},
  {titre:"Âme bénie de Spica",texte:"Né sous As-Simāk, Spica, tu es parmi les plus favorisés. Ibn Ajiba dit que ces natifs 'portent la perle du ciel'. Tout leur sourit quand ils agissent avec sincérité. Tes forces : la bénédiction universelle, la prospérité et le succès."},
  {titre:"Âme secrète gardienne",texte:"Né sous Al-Ghafr, tu es un gardien naturel des secrets. Tu sais protéger et préserver. Tes forces : la discrétion, la protection et la sagesse. Al-Buni dit que ces natifs 'portent les secrets de la terre'."},
  {titre:"Âme guerrière",texte:"Né sous Az-Zubānā, tu as traversé des épreuves qui t'ont forgé. Ta force réside dans ta capacité à survivre et rebondir. Tes forces : la résistance, la ténacité et la transformation par l'épreuve. Ces natifs deviennent forts par les difficultés."},
  {titre:"Âme noble",texte:"Né sous Al-Iklīl, la couronne, tu portes une noblesse naturelle. Après les épreuves, tu t'élèves. Tes forces : la noblesse, la victoire et l'élévation. Ibn Ajiba dit que ces natifs 'portent une couronne invisible'."},
  {titre:"Âme puissante",texte:"Né sous Al-Qalb, Antarès, tu as une énergie vitale exceptionnelle. Ta passion et ton intensité sont hors du commun. Tes forces : la puissance, la passion et l'intensité. Ces natifs laissent une marque indélébile là où ils passent."},
  {titre:"Âme protectrice",texte:"Né sous Ash-Shawla, tu as un instinct de protection naturel. Tu défends ce qui t'est cher avec une force remarquable. Tes forces : la protection, l'instinct et la défense. Al-Buni dit que ces natifs 'repoussent naturellement le mal'."},
  {titre:"Âme de la nature",texte:"Né sous An-Na'ā'im, tu es en harmonie profonde avec la nature. La terre et les animaux te reconnaissent. Tes forces : la connexion à la nature, la patience et l'harmonie. Ces natifs s'épanouissent dans des environnements naturels."},
  {titre:"Âme solitaire",texte:"Né sous Al-Balda, la ville vide, tu as une force solitaire unique. Ta solitude est ta puissance, pas ta faiblesse. Tes forces : l'indépendance, la profondeur et la force intérieure. Ces natifs trouvent leur force dans la retraite."},
  {titre:"Âme fortunée",texte:"Né sous Sa'd adh-Dhābiḥ, tu inaugures une série de chance. La fortune te sourit quand tu agis avec générosité. Tes forces : la générosité, la bénédiction et le commencement fortuné. Ibn Ajiba dit que ces natifs 'ouvrent des portes de fortune'."},
  {titre:"Âme transformatrice heureuse",texte:"Né sous Sa'd Bula', tu as le don de transformer les difficultés en succès. Tu absorbes les obstacles et les digères. Tes forces : la transformation positive, la résilience et la guérison. Al-Buni dit que ces natifs 'avaleront leurs épreuves et prospèreront'."},
  {titre:"Âme de la chance suprême",texte:"Né sous Sa'd as-Su'ūd, la chance des chances, tu es parmi les plus bénis. Ibn Ajiba dit que ces natifs 'portent la bénédiction divine dans leur souffle'. Tes forces : la chance, la bénédiction et le succès naturel."},
  {titre:"Âme stable",texte:"Né sous Sa'd al-Akhbiya, tu as une stabilité intérieure rare. Comme une tente bien plantée, rien ne t'ébranle vraiment. Tes forces : la stabilité, la protection du foyer et la longévité. Ces natifs sont les gardiens de leurs familles."},
  {titre:"Âme abondante",texte:"Né sous Al-Fargh al-Muqaddam, tu portes en toi un flux naturel d'abondance. Les richesses commencent à couler vers toi quand tu agis. Tes forces : l'abondance naissante, la construction et l'initiative. Al-Buni dit que ces natifs 'ouvrent les vannes de la fortune'."},
  {titre:"Âme de plénitude",texte:"Né sous Al-Fargh al-Mu'akhkhar, tu es une âme de plénitude. Tout ce que tu entreprends se remplit de bénédiction. Tes forces : la plénitude, la générosité et le succès constant. Ibn Ajiba dit que ces natifs 'vivent dans l'abondance permanente'."},
  {titre:"Âme de clôture bienheureuse",texte:"Né sous Baṭn al-Ḥūt, le ventre du Poisson, tu clôtures les cycles avec grâce. Ta sagesse vient de ta capacité à voir la fin dans le début. Tes forces : la sagesse, la clôture bienheureuse et la grâce divine. Ces natifs finissent toujours bien ce qu'ils commencent."},
];

// ─── Manāzil (version condensée) ─────────────────────────────────────────
const MANAZIL=[
  {num:1,ar:"الشَّرَطَيْن",fr:"An-Naṭḥ",stars:"α β Ari",lon:0,nature:"Bénéfique",symbole:"Deux cornes du Bélier",element:"Feu",planete:"Mars",description:"Premier manzil, énergie et commencement. Favorable aux débuts et nouveaux projets.",favorables:["Voyages et déplacements","Commerce et affaires","Mariage et unions","Construire et bâtir"],defavorables:["Emprunts et dettes","Opérations chirurgicales"],mariage:"Excellent pour les fiançailles et le mariage.",voyage:"Très favorable. Les voyages arrivent à bon port.",commerce:"Propice aux nouvelles affaires et signatures.",sante:"Bon pour débuter un traitement.",agriculture:"Excellent pour les semailles.",magie:"Talismans de protection et de succès."},
  {num:2,ar:"البَطَيْن",fr:"Al-Buṭayn",stars:"ε δ ρ Ari",lon:12.857,nature:"Neutre",symbole:"Le ventre du Bélier",element:"Terre",planete:"Vénus",description:"Manzil de l'intérieur et du caché. Propice aux affaires discrètes.",favorables:["Enfouissement de trésors","Agriculture","Affaires secrètes"],defavorables:["Voyages en mer","Associations publiques"],mariage:"Passable pour unions discrètes.",voyage:"Éviter la mer. Neutre par terre.",commerce:"Bon pour transactions privées.",sante:"Propice aux soins internes.",agriculture:"Excellent pour les semailles.",magie:"Talismans de dissimulation."},
  {num:3,ar:"الثُّرَيَّا",fr:"Ath-Thurayya",stars:"Pléiades",lon:25.714,nature:"Bénéfique",symbole:"Les Pléiades — Sept Sœurs",element:"Air",planete:"Lune",description:"Les Pléiades, étoile de prospérité. Excellent pour voyages maritimes et commerce.",favorables:["Navigation","Commerce de parfums","Demandes aux rois","Chasse et pêche"],defavorables:["Mariage forcé","Dettes"],mariage:"Bon pour demandes en mariage.",voyage:"Exceptionnel pour la navigation.",commerce:"Très favorable, parfums et bijoux.",sante:"Propice aux soins des yeux.",agriculture:"Bon pour plantes aromatiques.",magie:"Attirer prospérité et bénédiction."},
  {num:4,ar:"الدَّبَرَان",fr:"Ad-Dabarān",stars:"α Tau",lon:38.571,nature:"Maléfique",symbole:"L'Œil du Taureau",element:"Terre",planete:"Saturne",description:"Manzil difficile. Éviter voyages et nouveaux engagements.",favorables:["Construction solide","Plantation d'arbres","Chasse"],defavorables:["Voyages","Mariage","Commerce","Associations"],mariage:"Très défavorable.",voyage:"Déconseillé.",commerce:"Éviter les nouvelles affaires.",sante:"Soins dentaires et osseux.",agriculture:"Arbres résistants uniquement.",magie:"Bloquer et immobiliser — défensif."},
  {num:5,ar:"الهَقْعَة",fr:"Al-Haq'a",stars:"λ φ¹ Ori",lon:51.429,nature:"Bénéfique",symbole:"Marque sur le flanc",element:"Feu",planete:"Jupiter",description:"Manzil de libération et guérison. Excellent pour soins et constructions.",favorables:["Libération de prisonniers","Guérison","Construction","Récupération"],defavorables:["Longs voyages terrestres","Semailles"],mariage:"Neutre.",voyage:"Déconseillé longs trajets.",commerce:"Bon pour récupérer créances.",sante:"Excellent pour commencer traitement.",agriculture:"Déconseillé.",magie:"Talismans de guérison."},
  {num:6,ar:"الهَنْعَة",fr:"Al-Han'a",stars:"γ ξ Gem",lon:64.286,nature:"Maléfique",symbole:"Marque sur le cou",element:"Eau",planete:"Mars",description:"Manzil des contraintes. Favorable aux travaux souterrains.",favorables:["Creuser puits","Travaux miniers","Capturer"],defavorables:["Mariage","Voyages","Commerce"],mariage:"Très défavorable.",voyage:"Défavorable.",commerce:"Éviter.",sante:"Soins des genoux.",agriculture:"Labour profond.",magie:"Lier et contraindre."},
  {num:7,ar:"الذِّرَاع",fr:"Adh-Dhirā'",stars:"α β Gem",lon:77.143,nature:"Très bénéfique",symbole:"Bras des Gémeaux",element:"Air",planete:"Mercure",description:"L'un des manzils les plus bénis. Excellent pour tout.",favorables:["Commerce","Mariage","Agriculture","Voyages","Amitié","Immobilier"],defavorables:["Guerres"],mariage:"Exceptionnel. Couple béni.",voyage:"Très favorable partout.",commerce:"Excellent. Contrats prospèrent.",sante:"Propice à toute guérison.",agriculture:"Excellent pour toutes cultures.",magie:"Talismans d'amour et prospérité."},
  {num:8,ar:"النَّثْرَة",fr:"An-Nathra",stars:"ε Cnc / M44",lon:90,nature:"Bénéfique",symbole:"Narine du Lion",element:"Eau",planete:"Lune",description:"Manzil de générosité et d'amour.",favorables:["Achat de biens","Commerce","Amour","Libéralité"],defavorables:["Dettes","Mer agitée"],mariage:"Favorable pour noces.",voyage:"Bon terres et fleuves.",commerce:"Très favorable détail.",sante:"Cœur et lymphe.",agriculture:"Bon pour fruits.",magie:"Talismans d'amour."},
  {num:9,ar:"الطَّرْف",fr:"Aṭ-Ṭarf",stars:"κ λ Leo",lon:102.857,nature:"Maléfique",symbole:"Regard du Lion",element:"Feu",planete:"Saturne",description:"Manzil défavorable. Éviter tout nouveau commencement.",favorables:["Repos et méditation"],defavorables:["Commerce","Voyages","Mariage","Nouvelles entreprises"],mariage:"Très défavorable.",voyage:"Dangereux.",commerce:"Éviter.",sante:"Éviter interventions.",agriculture:"Défavorable.",magie:"Éviter."},
  {num:10,ar:"الجَبْهَة",fr:"Al-Jabha",stars:"ζ γ η α Leo",lon:115.714,nature:"Très bénéfique",symbole:"Front du Lion",element:"Feu",planete:"Soleil",description:"Manzil de force et d'autorité. Excellent pour actions décisives.",favorables:["Commerce","Voyages","Mariage","Construction","Leadership"],defavorables:["Emprunts imprudents"],mariage:"Excellent. Couple respecté.",voyage:"Très favorable.",commerce:"Excellent grandes transactions.",sante:"Cœur et colonne.",agriculture:"Excellent.",magie:"Pouvoir et victoire."},
  {num:11,ar:"الزُّبْرَة",fr:"Az-Zubra",stars:"δ θ Leo",lon:128.571,nature:"Neutre",symbole:"Crinière du Lion",element:"Feu",planete:"Jupiter",description:"Bon pour voyages et commerce textile.",favorables:["Voyages","Textiles","Libération"],defavorables:["Mariage","Partenariats durables"],mariage:"Défavorable.",voyage:"Très bon.",commerce:"Excellent textiles.",sante:"Peau et cheveux.",agriculture:"Neutre.",magie:"Faciliter déplacements."},
  {num:12,ar:"الصَّرْفَة",fr:"Aṣ-Ṣarfa",stars:"β Leo",lon:141.429,nature:"Neutre",symbole:"Queue du Lion",element:"Terre",planete:"Mars",description:"Manzil du changement. Bon pour commerce terrestre.",favorables:["Commerce","Agriculture","Changements"],defavorables:["Mer","Mariage","Constructions permanentes"],mariage:"Défavorable.",voyage:"Neutre sur terre.",commerce:"Bon pour rotations.",sante:"Soins digestifs.",agriculture:"Élevage.",magie:"Transformation."},
  {num:13,ar:"العَوَّاء",fr:"Al-'Awwā'",stars:"β η γ Vir",lon:154.286,nature:"Bénéfique",symbole:"Cinq étoiles de la Vierge",element:"Terre",planete:"Vénus",description:"Favorable aux autorités et au service.",favorables:["Commerce","Agriculture","Autorités","Éducation"],defavorables:["Mer","Mariages inégaux"],mariage:"Favorable entre égaux.",voyage:"Excellent terrestre.",commerce:"Bon service.",sante:"Soins vétérinaires.",agriculture:"Excellent.",magie:"Faveurs des autorités."},
  {num:14,ar:"السِّمَاك",fr:"As-Simāk",stars:"α Vir (Spica)",lon:167.143,nature:"Très bénéfique",symbole:"Spica — épi de blé",element:"Terre",planete:"Vénus",description:"Spica — la perle des manzils. Universel et béni.",favorables:["Tout commerce","Mariage","Agriculture","Voyages","Construction"],defavorables:["Conflits"],mariage:"Exceptionnel.",voyage:"Excellent.",commerce:"Exceptionnel.",sante:"Excellent pour tout.",agriculture:"Exceptionnel céréales.",magie:"Le plus puissant pour bénédiction."},
  {num:15,ar:"الغَفْر",fr:"Al-Ghafr",stars:"ι κ λ Vir",lon:180,nature:"Neutre",symbole:"Le pardon",element:"Air",planete:"Mercure",description:"Manzil du secret et de la discrétion.",favorables:["Secrets","Protection","Pardon"],defavorables:["Mariage public","Voyages ostentatoires"],mariage:"Unions discrètes.",voyage:"Incognito.",commerce:"Transactions discrètes.",sante:"Retraites de guérison.",agriculture:"Neutre.",magie:"Protection et dissimulation."},
  {num:16,ar:"الزُّبَانَى",fr:"Az-Zubānā",stars:"α β Lib",lon:192.857,nature:"Maléfique",symbole:"Pinces du Scorpion",element:"Air",planete:"Saturne",description:"Manzil très difficile. Éviter tout.",favorables:["Repos uniquement"],defavorables:["Tout"],mariage:"Très néfaste.",voyage:"Dangereux.",commerce:"Pertes.",sante:"Éviter.",agriculture:"Très défavorable.",magie:"Défensif uniquement."},
  {num:17,ar:"الإِكْلِيل",fr:"Al-Iklīl",stars:"β δ π Sco",lon:205.714,nature:"Bénéfique",symbole:"Couronne du Scorpion",element:"Eau",planete:"Jupiter",description:"Couronne après l'épreuve. Favorable.",favorables:["Voyages","Commerce","Mariage","Construction"],defavorables:["Dettes anciennes"],mariage:"Bon. Union honorable.",voyage:"Favorable.",commerce:"Bon prestige.",sante:"Organes reproducteurs.",agriculture:"Cultures humides.",magie:"Victoire et distinction."},
  {num:18,ar:"القَلْب",fr:"Al-Qalb",stars:"α Sco (Antarès)",lon:218.571,nature:"Maléfique",symbole:"Cœur du Scorpion",element:"Eau",planete:"Mars",description:"Antarès. Puissant mais dangereux.",favorables:["Forteresses","Défense","Chasse"],defavorables:["Mariage","Commerce","Voyages"],mariage:"Très défavorable.",voyage:"Défavorable.",commerce:"Très défavorable.",sante:"Urgences uniquement.",agriculture:"Défavorable.",magie:"Puissant — initiés seulement."},
  {num:19,ar:"الشَّوْلَة",fr:"Ash-Shawla",stars:"λ υ Sco",lon:231.429,nature:"Maléfique",symbole:"Dard du Scorpion",element:"Eau",planete:"Mars",description:"Dard venimeux. Force animale.",favorables:["Dompter animaux","Protection"],defavorables:["Mariage","Commerce","Construction"],mariage:"Très défavorable.",voyage:"Défavorable.",commerce:"Très défavorable.",sante:"Antidotes et venins.",agriculture:"Défavorable.",magie:"Protection contre ennemis."},
  {num:20,ar:"النَّعَائِم",fr:"An-Na'ā'im",stars:"γ δ ε η Sgr",lon:244.286,nature:"Neutre",symbole:"Les autruches",element:"Terre",planete:"Vénus",description:"Nature et agriculture. Manzil rural.",favorables:["Élevage","Agriculture","Voyages ruraux"],defavorables:["Mariage solennel","Commerce maritime"],mariage:"Défavorable grandes cérémonies.",voyage:"Bon vers campagne.",commerce:"Bon agricole.",sante:"Jambes et hanches.",agriculture:"Excellent élevage.",magie:"Fertilité et abondance."},
  {num:21,ar:"البَلْدَة",fr:"Al-Balda",stars:"φ Sgr (vide)",lon:257.143,nature:"Maléfique",symbole:"La ville vide",element:"Terre",planete:"Saturne",description:"Espace vide. Manzil de contrainte.",favorables:["Capturer fugitifs","Isoler"],defavorables:["Tout"],mariage:"Très néfaste.",voyage:"Très défavorable.",commerce:"Pertes et vide.",sante:"Défavorable.",agriculture:"Stérile.",magie:"Isolement et séparation."},
  {num:22,ar:"سَعْد الذَّابِح",fr:"Sa'd adh-Dhābiḥ",stars:"α β Cap",lon:270,nature:"Bénéfique",symbole:"Bonne étoile du sacrificateur",element:"Eau",planete:"Saturne/Jupiter",description:"Début des Sa'ūd. Fortune inaugurale.",favorables:["Mariage","Commerce","Agriculture","Libération"],defavorables:["Conflits"],mariage:"Excellent.",voyage:"Favorable ouest et sud.",commerce:"Très favorable.",sante:"Excellent long terme.",agriculture:"Très favorable.",magie:"Fortune et bénédiction."},
  {num:23,ar:"سَعْد بُلَع",fr:"Sa'd Bula'",stars:"ν μ Cap",lon:282.857,nature:"Bénéfique",symbole:"Bonne étoile qui avale le mal",element:"Eau",planete:"Jupiter",description:"Absorbe les maux et transforme.",favorables:["Commerce","Mariage","Construction","Guérison"],defavorables:["Mer agitée"],mariage:"Très favorable.",voyage:"Bon sur terre.",commerce:"Excellent transformation.",sante:"Maladies chroniques.",agriculture:"Très favorable été.",magie:"Neutraliser sorts négatifs."},
  {num:24,ar:"سَعْد السُّعُود",fr:"Sa'd as-Su'ūd",stars:"β Aqr",lon:295.714,nature:"Très bénéfique",symbole:"Chance des chances",element:"Air",planete:"Vénus/Jupiter",description:"Le manzil le plus fortuné des Sa'ūd.",favorables:["Tout sans exception"],defavorables:["Conflits délibérés"],mariage:"Exceptionnel — le meilleur.",voyage:"Excellent.",commerce:"Exceptionnel.",sante:"Excellent.",agriculture:"Exceptionnel.",magie:"Le plus puissant pour tout bien."},
  {num:25,ar:"سَعْد الأَخْبِيَة",fr:"Sa'd al-Akhbiya",stars:"γ π η ζ Aqr",lon:308.571,nature:"Neutre",symbole:"Bonne étoile des tentes",element:"Air",planete:"Mercure",description:"Stabilité et foyer. Manzil rural.",favorables:["Plantation","Agriculture","Foyer"],defavorables:["Commerce maritime","Constructions urbaines"],mariage:"Favorable au foyer.",voyage:"Bon vers nature.",commerce:"Bon agricole.",sante:"Soins respiratoires.",agriculture:"Excellent arbres fruitiers.",magie:"Stabilité et protection du foyer."},
  {num:26,ar:"الفَرْغ المُقَدَّم",fr:"Al-Fargh al-Muqaddam",stars:"α β Peg",lon:321.429,nature:"Neutre",symbole:"Première ouverture",element:"Eau",planete:"Vénus",description:"L'eau commence à couler. Constructions.",favorables:["Construction","Puits","Voyages","Irrigation"],defavorables:["Partenariats inégaux"],mariage:"Acceptable.",voyage:"Favorable.",commerce:"Immobilier et eau.",sante:"Reins et vessie.",agriculture:"Irrigation.",magie:"Abondance et flux."},
  {num:27,ar:"الفَرْغ المُؤَخَّر",fr:"Al-Fargh al-Mu'akhkhar",stars:"γ Peg / α And",lon:334.286,nature:"Très bénéfique",symbole:"Deuxième ouverture",element:"Eau",planete:"Jupiter",description:"Plénitude. L'avant-dernier et très béni.",favorables:["Mariage","Commerce","Agriculture","Construction"],defavorables:["Dettes légères"],mariage:"Excellent. Plénitude.",voyage:"Très favorable.",commerce:"Excellent.",sante:"Excellent.",agriculture:"Excellent.",magie:"Abondance et plénitude."},
  {num:28,ar:"بَطْن الحُوت",fr:"Baṭn al-Ḥūt",stars:"β And (Mirach)",lon:347.143,nature:"Bénéfique",symbole:"Ventre du Poisson",element:"Eau",planete:"Lune",description:"Dernier manzil. Clôture bienheureuse.",favorables:["Commerce","Mariage","Agriculture","Mer"],defavorables:["Constructions permanentes"],mariage:"Favorable.",voyage:"Excellent maritime.",commerce:"Très favorable.",sante:"Pieds et lymphe.",agriculture:"Côtier et aquatique.",magie:"Clôture et bénédiction finale."},
];

const NC={"Très bénéfique":"#4ecf8a","Bénéfique":"#C9A84C","Neutre":"#8a9fc4","Maléfique":"#e07a5f"};
const MS=360/28;
const tr=d=>d*Math.PI/180;
const m360=x=>((x%360)+360)%360;

function jd(date){
  const Y=date.getUTCFullYear(),M=date.getUTCMonth()+1;
  const D=date.getUTCDate()+(date.getUTCHours()+date.getUTCMinutes()/60+date.getUTCSeconds()/3600)/24;
  let y=Y,m=M;if(m<=2){y-=1;m+=12;}
  const A=Math.floor(y/100),B=2-A+Math.floor(A/4);
  return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+D+B-1524.5;
}

function moonTrop(j){
  const T=(j-2451545)/36525;
  let Lp=m360(218.3164477+481267.88123421*T-0.0015786*T*T);
  let M=m360(357.5291092+35999.0502909*T-0.0001536*T*T);
  let Mp=m360(134.9633964+477198.8675055*T+0.0087414*T*T);
  let F=m360(93.2720950+483202.0175233*T-0.0036539*T*T);
  let D=m360(297.8501921+445267.1114034*T-0.0018819*T*T);
  M=tr(M);Mp=tr(Mp);F=tr(F);D=tr(D);
  return m360(Lp+6.288774*Math.sin(Mp)+1.274027*Math.sin(2*D-Mp)+0.658314*Math.sin(2*D)+0.213618*Math.sin(2*Mp)-0.185116*Math.sin(M)-0.114332*Math.sin(2*F)+0.058793*Math.sin(2*D-2*Mp)+0.057066*Math.sin(2*D-M-Mp)+0.053322*Math.sin(2*D+Mp)+0.045758*Math.sin(2*D-M)-0.040923*Math.sin(M-Mp)-0.034720*Math.sin(D)-0.030383*Math.sin(M+Mp)+0.015327*Math.sin(2*D-2*F)-0.012528*Math.sin(Mp+2*F)+0.010980*Math.sin(Mp-2*F));
}
function aya(j){const T=(j-2451545)/36525;return 23.85+50.3*T/3600;}
function moonSid(j){return m360(moonTrop(j)-aya(j));}
function mIdx(lon){return Math.floor(lon/MS)%28;}

// ─── Soleil ────────────────────────────────────────────────────────────────
function sunLongitude(j){
  const T=(j-2451545)/36525;
  const L0=m360(280.46646+36000.76983*T);
  const M=m360(357.52911+35999.05029*T-0.0001537*T*T);
  const Mr=tr(M);
  const C=(1.914602-0.004817*T-0.000014*T*T)*Math.sin(Mr)+(0.019993-0.000101*T)*Math.sin(2*Mr)+0.000289*Math.sin(3*Mr);
  return m360(L0+C);
}

// ─── Hijri simplifié ───────────────────────────────────────────────────────
function toHijri(date){
  const jDay=jd(date)+0.5;
  const l=Math.floor(jDay)+68569;
  const n=Math.floor((4*l)/146097);
  const l2=l-Math.floor((146097*n+3)/4);
  const i=Math.floor((4000*(l2+1))/1461001);
  const l3=l2-Math.floor((1461*i)/4)+31;
  const j=Math.floor((80*l3)/2447);
  const day=l3-Math.floor((2447*j)/80);
  const l4=Math.floor(j/11);
  const month=j+2-12*l4;
  const year=100*(n-49)+i+l4-6700;
  const hijriYear=Math.floor((jDay-1948439.5)/354.367+1);
  const hijriMonths=["Muharram","Safar","Rabi' I","Rabi' II","Jumada I","Jumada II","Rajab","Sha'ban","Ramadan","Shawwal","Dhu al-Qa'da","Dhu al-Hijja"];
  // Calcul simplifié
  const epoch=1948438.5;
  const cycle=Math.floor((jDay-epoch)/10631);
  const rem=jDay-epoch-cycle*10631;
  const y=Math.floor((rem*30+29)/10631)+cycle*30+1;
  const m2=Math.min(12,Math.ceil((rem-Math.floor((y-1)*354.367+epoch-epoch))/29.5+1));
  const d2=Math.floor(jDay-Math.floor((y-1)*354.367+epoch-(m2-1)*29.5));
  return{day:day||1,month:hijriMonths[month-1]||hijriMonths[0],year:Math.max(1,hijriYear),display:`${day||1} ${hijriMonths[(month-1)||0] } ${Math.max(1,hijriYear)} H`};
}

// ─── Prière (approximation) ───────────────────────────────────────────────
// ─── API AlAdhan ──────────────────────────────────────────────────────────
const prayerCache = {};

async function fetchPrayerTimes(date, lat, lon) {
  const key = `${date.toISOString().split("T")[0]}_${lat.toFixed(4)}_${lon.toFixed(4)}`;
  if (prayerCache[key]) return prayerCache[key];
  try {
    const d = date.toISOString().split("T")[0];
    const [year, month, day] = d.split("-");
    // Méthode 2 = Muslim World League, school 1 = Shafi'i
    const url = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${lat}&longitude=${lon}&method=2&school=1`;
    const res = await fetch(url);
    const json = await res.json();
    if (json.code === 200) {
      const t = json.data.timings;
      const result = {
        fajr: t.Fajr,
        sunrise: t.Sunrise,
        dhuhr: t.Dhuhr,
        asr: t.Asr,
        maghrib: t.Maghrib,
        isha: t.Isha,
      };
      prayerCache[key] = result;
      return result;
    }
  } catch(e) {}
  return null;
}

// Fallback calcul local si API indisponible
function getPrayerTimesFallback(date, lat=14.6937, lon=-17.4441){
  const j=jd(date);
  const D=j-2451545.0;
  const g=m360(357.529+0.98560028*D);
  const q=m360(280.459+0.98564736*D);
  const L=m360(q+1.915*Math.sin(tr(g))+0.020*Math.sin(tr(2*g)));
  const e=23.439-0.00000036*D;
  const RArad=Math.atan2(Math.cos(tr(e))*Math.sin(tr(L)),Math.cos(tr(L)));
  const decl=Math.asin(Math.sin(tr(e))*Math.sin(tr(L)))*180/Math.PI;
  const declR=tr(decl),latR=tr(lat);
  const EqT=q/15-((m360(RArad*180/Math.PI+180)-180)/15);
  const transit=12-EqT-lon/15;
  const cosH0=(-Math.sin(tr(-0.8333))-Math.sin(latR)*Math.sin(declR))/(Math.cos(latR)*Math.cos(declR));
  const H0=Math.acos(Math.min(1,Math.max(-1,cosH0)))*180/Math.PI/15;
  const sunrise=transit-H0, sunset=transit+H0;
  const cosFajr=(-Math.sin(tr(-18))-Math.sin(latR)*Math.sin(declR))/(Math.cos(latR)*Math.cos(declR));
  const HFajr=Math.acos(Math.min(1,Math.max(-1,cosFajr)))*180/Math.PI/15;
  const fajr=transit-HFajr;
  const cosIsha=(-Math.sin(tr(-17))-Math.sin(latR)*Math.sin(declR))/(Math.cos(latR)*Math.cos(declR));
  const HIsha=Math.acos(Math.min(1,Math.max(-1,cosIsha)))*180/Math.PI/15;
  const isha=transit+HIsha;
  const dhuhr=transit+0.08;
  const cotAsr=Math.tan(Math.abs(latR-declR))+1;
  const cosAsr=(Math.sin(Math.atan(1/cotAsr))-Math.sin(latR)*Math.sin(declR))/(Math.cos(latR)*Math.cos(declR));
  const HAsr=Math.acos(Math.min(1,Math.max(-1,cosAsr)))*180/Math.PI/15;
  const asr=transit+HAsr;
  const maghrib=sunset+0.05;
  const toTime=h=>{const total=((h%24)+24)%24;const H=Math.floor(total);const M=Math.round((total-H)*60);return`${String(H).padStart(2,"0")}:${String(M===60?0:M).padStart(2,"0")}`;};
  return{fajr:toTime(fajr),sunrise:toTime(sunrise),dhuhr:toTime(dhuhr),asr:toTime(asr),maghrib:toTime(maghrib),isha:toTime(isha)};
}

function transit(date,idx,dir,getLon){
  const step=dir*15*60*1000;let cur=new Date(date);
  for(let i=0;i<200;i++){
    cur=new Date(cur.getTime()+step);
    if(mIdx(getLon(jd(cur)))!==idx){
      let a=new Date(cur.getTime()-step),b=cur;
      for(let k=0;k<10;k++){const mid=new Date((a.getTime()+b.getTime())/2);mIdx(getLon(jd(mid)))===idx?(a=mid):(b=mid);}
      return dir===1?b:a;
    }
  }
  return null;
}

function moonRiseApprox(date){
  const age=(((date-new Date("2000-01-06T18:14:00Z"))/(864e5))%29.53+29.53)%29.53;
  const r=6+(age/29.53)*12;const c=r+12.5;
  const fmt=h=>`${String(Math.floor(h%24)).padStart(2,"0")}:${String(Math.floor((h%1)*60)).padStart(2,"0")}`;
  return{lever:fmt(r),zenith:fmt(r+6),coucher:fmt(c)};
}

function calcData(date,sys){
  const getLon=sys==="sidereal"?moonSid:moonTrop;
  const j=jd(date);
  const lon=getLon(j);
  const lt=moonTrop(j),ls=moonSid(j),ay=aya(j);
  const idx=mIdx(lon);
  const manzil=MANAZIL[idx];
  const prog=Math.min(99.9,(m360(lon-manzil.lon)/MS)*100);
  const sunLon=sunLongitude(j);
  const sunSid=m360(sunLon-ay);
  return{lon:lon.toFixed(2),lonTrop:lt.toFixed(2),lonSid:ls.toFixed(2),aya:ay.toFixed(2),manzilIdx:idx,manzil,progress:prog.toFixed(1),entryTime:transit(date,idx,-1,getLon),exitTime:transit(date,idx,1,getLon),signeTrop:getSigneFromLon(lt),signeSid:getSigneFromLon(ls),moonRise:moonRiseApprox(date),sunLon:sunLon.toFixed(2),sunSid:sunSid.toFixed(2),sunSigne:getSigneFromLon(sys==="sidereal"?sunSid:sunLon),hijri:toHijri(date)};
}

function phase(date){
  const age=(((date-new Date("2000-01-06T18:14:00Z"))/(864e5))%29.53+29.53)%29.53;
  const pct=Math.round((age/29.53)*100);
  let name,emoji;
  if(age<1.85){name="Nouvelle Lune";emoji="🌑";}
  else if(age<7.38){name="Premier Croissant";emoji="🌒";}
  else if(age<9.22){name="Premier Quartier";emoji="🌓";}
  else if(age<14.76){name="Gibbeuse Croissante";emoji="🌔";}
  else if(age<16.61){name="Pleine Lune";emoji="🌕";}
  else if(age<22.15){name="Gibbeuse Décroissante";emoji="🌖";}
  else if(age<23.99){name="Dernier Quartier";emoji="🌗";}
  else{name="Dernier Croissant";emoji="🌘";}
  return{name,emoji,age:age.toFixed(1),pct};
}

// Prochaine nouvelle lune / pleine lune
function nextLunarEvent(date){
  const age=(((date-new Date("2000-01-06T18:14:00Z"))/(864e5))%29.53+29.53)%29.53;
  const toNewMoon=age<0.5?0:29.53-age;
  const toFullMoon=age<14.76?14.76-age:29.53-age+14.76;
  const newDate=new Date(date.getTime()+toNewMoon*864e5);
  const fullDate=new Date(date.getTime()+toFullMoon*864e5);
  return{newMoon:{date:newDate,days:toNewMoon.toFixed(1)},fullMoon:{date:fullDate,days:toFullMoon.toFixed(1)}};
}

const fmtT=d=>{if(!d)return"—";return d.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});};
const fmtD=d=>{if(!d)return"—";return d.toLocaleDateString("fr-FR",{day:"2-digit",month:"short"});};

// ─── Étoiles scintillantes ───────────────────────────────────────────────
function StarField(){
  const stars = Array.from({length:60},(_,i)=>({
    id:i,
    x:Math.random()*100,
    y:Math.random()*100,
    size:Math.random()*2+0.5,
    delay:Math.random()*4,
    duration:Math.random()*3+2,
    opacity:Math.random()*0.7+0.3,
  }));
  return(
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
      <style>{`
        @keyframes twinkle {
          0%,100%{opacity:0.1;transform:scale(0.8);}
          50%{opacity:1;transform:scale(1.2);}
        }
        @keyframes shootingStar {
          0%{transform:translateX(0) translateY(0);opacity:1;}
          100%{transform:translateX(200px) translateY(100px);opacity:0;}
        }
        @keyframes float {
          0%,100%{transform:translateY(0px);}
          50%{transform:translateY(-8px);}
        }
        @keyframes slideTab {
          from{opacity:0;transform:translateX(20px);}
          to{opacity:1;transform:translateX(0);}
        }
        @keyframes fadeUp {
          from{opacity:0;transform:translateY(16px);}
          to{opacity:1;transform:translateY(0);}
        }
        @keyframes pulse {
          0%,100%{box-shadow:0 0 0 0 rgba(200,168,76,0.4);}
          50%{box-shadow:0 0 0 8px rgba(200,168,76,0);}
        }
        .card-anim{animation:fadeUp 0.4s ease both;}
        .tab-anim{animation:slideTab 0.3s ease both;}
        .moon-float{animation:float 4s ease-in-out infinite;}
      `}</style>
      {stars.map(s=>(
        <div key={s.id} style={{
          position:"absolute",
          left:`${s.x}%`,
          top:`${s.y}%`,
          width:s.size,
          height:s.size,
          borderRadius:"50%",
          background:"white",
          animation:`twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
          opacity:s.opacity,
        }}/>
      ))}
      {/* Étoiles filantes occasionnelles */}
      {[0,1,2].map(i=>(
        <div key={`shoot${i}`} style={{
          position:"absolute",
          left:`${20+i*30}%`,
          top:`${10+i*15}%`,
          width:60,
          height:1,
          background:"linear-gradient(90deg,transparent,white,transparent)",
          animation:`shootingStar ${8+i*5}s ${i*7}s linear infinite`,
          opacity:0.6,
        }}/>
      ))}
    </div>
  );
}

// ─── Lune SVG ─────────────────────────────────────────────────────────────
function MoonSVG({ph,size=100}){
  const r=size/2,cx=r,cy=r,rx=r*0.88;
  const isWax=parseFloat(ph.age)<14.76,ill=ph.pct/100;
  const k=isWax?(2*ill-1):(1-2*(ill-0.5));
  const term=rx*Math.abs(k);
  const sw=isWax?(ill>0.5?1:0):(ill>0.5?0:1);
  return(
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id="ms" cx="40%" cy="35%" r="60%"><stop offset="0%" stopColor="#d4c5a9"/><stop offset="100%" stopColor="#8a7a5a"/></radialGradient>
        <radialGradient id="md" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#1a1630"/><stop offset="100%" stopColor="#0a0820"/></radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="#C9A84C11"/>
      <ellipse cx={cx} cy={cy} rx={rx} ry={rx} fill="url(#md)" opacity="0.95"/>
      {ph.pct>2&&ph.pct<98?(<path d={`M ${cx} ${cy-rx} A ${rx} ${rx} 0 1 ${isWax?1:0} ${cx} ${cy+rx} A ${term} ${rx} 0 1 ${sw} ${cx} ${cy-rx} Z`} fill="url(#ms)" opacity="0.95"/>):ph.pct>=98?(<ellipse cx={cx} cy={cy} rx={rx} ry={rx} fill="url(#ms)" opacity="0.95"/>):null}
      <circle cx={cx-rx*0.2} cy={cy-rx*0.1} r={rx*0.07} fill="#00000022"/>
      <ellipse cx={cx} cy={cy} rx={rx} ry={rx} fill="none" stroke="#C9A84C55" strokeWidth="1"/>
    </svg>
  );
}

// ─── Roue ─────────────────────────────────────────────────────────────────
function ManzilWheel({md,t}){
  const [sel,setSel]=useState(md?.manzilIdx??0);
  useEffect(()=>{if(md)setSel(md.manzilIdx);},[md]);
  const sz=310;const cx=sz/2,cy=sz/2;
  const oR=sz*0.46,iR=sz*0.29,lR=sz*0.38,mR=sz*0.195,dotR=sz*0.034;
  const lon=md?parseFloat(md.lon):0;
  const m=MANAZIL[sel];const nc=NC[m.nature]||t.accent;
  return(
    <div style={{textAlign:"center"}}>
      <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`} style={{display:"block",margin:"0 auto"}}>
        <defs>
          <radialGradient id="wb" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#1B1464" stopOpacity="0.7"/><stop offset="100%" stopColor="#07061a" stopOpacity="0.95"/></radialGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <circle cx={cx} cy={cy} r={oR+6} fill="url(#wb)" stroke="#C9A84C22" strokeWidth="1"/>
        <circle cx={cx} cy={cy} r={oR} fill="none" stroke="#C9A84C33" strokeWidth="1"/>
        <circle cx={cx} cy={cy} r={iR} fill="none" stroke="#C9A84C22" strokeWidth="1"/>
        {MANAZIL.map((mz,i)=>{
          const a1=(i*MS-90)*Math.PI/180,a2=((i+1)*MS-90)*Math.PI/180;
          const x1=cx+oR*Math.cos(a1),y1=cy+oR*Math.sin(a1);
          const x2=cx+oR*Math.cos(a2),y2=cy+oR*Math.sin(a2);
          const x3=cx+iR*Math.cos(a2),y3=cy+iR*Math.sin(a2);
          const x4=cx+iR*Math.cos(a1),y4=cy+iR*Math.sin(a1);
          const c=NC[mz.nature]||"#C9A84C";
          const act=i===md?.manzilIdx,isSel=i===sel;
          const ma=(i+0.5)*MS-90;
          const lx=cx+lR*Math.cos(tr(ma)),ly=cy+lR*Math.sin(tr(ma));
          return(
            <g key={i} onClick={()=>setSel(i)} style={{cursor:"pointer"}}>
              <path d={`M ${x1} ${y1} A ${oR} ${oR} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${iR} ${iR} 0 0 0 ${x4} ${y4} Z`} fill={act?`${c}55`:isSel?`${c}25`:`${c}0d`} stroke={act?c:isSel?`${c}88`:`${c}33`} strokeWidth={act?2:0.5}/>
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill={act?c:`${c}77`} fontSize={sz*0.028} fontWeight={act?"bold":"normal"}>{i+1}</text>
            </g>
          );
        })}
        {(()=>{const ma=tr(lon-90);const mx=cx+mR*Math.cos(ma),my=cy+mR*Math.sin(ma);return(<g filter="url(#glow)"><circle cx={mx} cy={my} r={dotR+3} fill="#C9A84C22"/><circle cx={mx} cy={my} r={dotR} fill="#e8c97a" stroke="#C9A84C" strokeWidth="1.5"/><text x={mx} y={my} textAnchor="middle" dominantBaseline="middle" fontSize={dotR*1.1} fill="#07061a">☽</text></g>);})()}
        <circle cx={cx} cy={cy} r={iR-2} fill="#07061a" opacity="0.85"/>
        <text x={cx} y={cy-8} textAnchor="middle" fontSize={sz*0.034} fill="#C9A84C" fontWeight="bold">مَنَازِل</text>
        <text x={cx} y={cy+9} textAnchor="middle" fontSize={sz*0.026} fill="#e8c97a88">القَمَر</text>
      </svg>
      <div style={{background:t.rowBg,border:`1px solid ${nc}44`,borderRadius:12,padding:"10px 14px",marginTop:8,textAlign:"center"}}>
        <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,marginBottom:3}}>Manzil #{sel+1} {sel===md?.manzilIdx?"· ☽ Lune ici":""}</div>
        <div style={{fontSize:20,fontWeight:"bold",color:t.accentSoft,direction:"rtl",marginBottom:2}}>{m.ar}</div>
        <div style={{fontSize:13,fontWeight:"bold",color:t.textLight,marginBottom:4}}>{m.fr}</div>
        <span style={{fontSize:12,background:`${nc}22`,color:nc,border:`1px solid ${nc}44`,borderRadius:20,padding:"2px 8px"}}>{m.nature}</span>
      </div>
    </div>
  );
}

// ─── Manzil de Naissance ──────────────────────────────────────────────────
function NatalView({sys,t}){
  const [birthDate,setBirthDate]=useState("1990-01-01");
  const [result,setResult]=useState(null);

  const calculate=()=>{
    const d=new Date(birthDate+"T12:00:00Z");
    const getLon=sys==="sidereal"?moonSid:moonTrop;
    const lon=getLon(jd(d));
    const idx=mIdx(lon);
    const m=MANAZIL[idx];
    const interp=NATAL_INTERP[idx];
    const sg=getSigneFromLon(lon);
    setResult({manzil:m,idx,lon:lon.toFixed(2),signe:sg,interp,phase:phase(d)});
  };

  return(
    <div>
      <h3 style={{color:t.accent,fontSize:13,letterSpacing:2,marginBottom:8,fontWeight:"bold"}}>🌙 Manzil de Naissance</h3>
      <p style={{fontSize:12,fontWeight:"600",color:t.textMuted,marginBottom:14,lineHeight:1.6}}>Découvre le manzil dans lequel la Lune se trouvait le jour de ta naissance et son interprétation selon Ibn Ajiba & Al-Buni.</p>

      <div style={{background:t.rowBg,border:`1px solid ${t.accent}33`,borderRadius:12,padding:"14px",marginBottom:14}}>
        <label style={{fontSize:12,fontWeight:"600",color:t.textMuted,display:"block",marginBottom:8}}>📅 Date de naissance</label>
        <input type="date" value={birthDate} onChange={e=>setBirthDate(e.target.value)}
          style={{background:"none",border:`1px solid ${t.accent}33`,borderRadius:8,padding:"8px 12px",color:t.textLight,fontSize:13,fontFamily:"inherit",width:"100%",outline:"none",colorScheme:t.inputColor,boxSizing:"border-box"}}/>
        <button onClick={calculate}
          style={{width:"100%",marginTop:10,background:t.accent,border:"none",borderRadius:10,padding:"12px",color:t.deepBlue,fontSize:13,fontWeight:"bold",cursor:"pointer",fontFamily:"inherit"}}>
          🌙 Calculer mon Manzil natal
        </button>
      </div>

      {result&&(
        <div>
          {/* Carte principale */}
          <div style={{background:t.cardBg,border:`1px solid ${t.cardBorder}`,borderRadius:16,padding:"20px",marginBottom:12,textAlign:"center"}}>
            <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,letterSpacing:3,marginBottom:8}}>TON MANZIL NATAL</div>
            <div style={{fontSize:32,fontWeight:"bold",color:t.accentSoft,direction:"rtl",marginBottom:6,lineHeight:1.3}}>{result.manzil.ar}</div>
            <div style={{fontSize:18,fontWeight:"bold",color:t.textLight,marginBottom:4}}>{result.manzil.fr}</div>
            <div style={{fontSize:13,fontWeight:"600",color:t.textMuted,marginBottom:10}}>Manzil #{result.idx+1} · ✦ {result.manzil.stars}</div>
            <div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:10}}>
              <span style={{fontSize:12,background:`${NC[result.manzil.nature]}22`,color:NC[result.manzil.nature],border:`1px solid ${NC[result.manzil.nature]}44`,borderRadius:20,padding:"3px 10px"}}>{result.manzil.nature}</span>
              <span style={{fontSize:12,background:`${t.accent}11`,color:t.accentSoft,border:`1px solid ${t.accent}33`,borderRadius:20,padding:"3px 10px"}}>{result.signe.signe.emoji} {result.signe.signe.fr} {result.signe.deg}°{result.signe.min}'</span>
            </div>
            <div style={{fontSize:12,fontWeight:"600",color:t.textMuted}}>{result.phase.emoji} {result.phase.name} · {result.phase.age} jours</div>
          </div>

          {/* Interprétation */}
          <div style={{background:`linear-gradient(135deg,${t.rowBg},${t.cardBg||t.rowBg})`,border:`1px solid ${t.accent}44`,borderRadius:14,padding:"16px",marginBottom:12}}>
            <div style={{fontSize:14,fontWeight:"bold",color:t.accentSoft,fontWeight:"bold",marginBottom:8}}>✨ {result.interp.titre}</div>
            <p style={{fontSize:13,fontWeight:"600",color:t.textMuted,lineHeight:1.8,margin:0}}>{result.interp.texte}</p>
          </div>

          {/* Forces et défis */}
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <div style={{flex:1,background:`#4ecf8a11`,border:`1px solid #4ecf8a33`,borderRadius:12,padding:"12px"}}>
              <div style={{fontSize:12,color:"#4ecf8a",fontWeight:"bold",marginBottom:8}}>✅ Tes forces</div>
              {result.manzil.favorables.slice(0,3).map((f,i)=>(
                <div key={i} style={{fontSize:12,fontWeight:"600",color:t.textMuted,marginBottom:4}}>● {f}</div>
              ))}
            </div>
            <div style={{flex:1,background:`#e07a5f11`,border:`1px solid #e07a5f33`,borderRadius:12,padding:"12px"}}>
              <div style={{fontSize:12,color:"#e07a5f",fontWeight:"bold",marginBottom:8}}>⚠️ Points d'attention</div>
              {result.manzil.defavorables.slice(0,3).map((f,i)=>(
                <div key={i} style={{fontSize:12,fontWeight:"600",color:t.textMuted,marginBottom:4}}>● {f}</div>
              ))}
            </div>
          </div>

          {/* Du'a recommandé */}
          <div style={{background:`${t.accent}11`,border:`1px solid ${t.accent}33`,borderRadius:12,padding:"14px"}}>
            <div style={{fontSize:12,fontWeight:"bold",color:t.accent,fontWeight:"bold",marginBottom:8}}>🤲 Du'a recommandé pour ton manzil</div>
            <div style={{fontSize:14,fontWeight:"bold",color:t.accentSoft,direction:"rtl",lineHeight:1.8,marginBottom:8,textAlign:"right"}}>{DUAS[result.idx].ar}</div>
            <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,lineHeight:1.6,marginBottom:6,fontStyle:"italic"}}>{DUAS[result.idx].fr}</div>
            <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,borderTop:`1px solid ${t.accent}22`,paddingTop:6}}>{DUAS[result.idx].occasion}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Heures de Prière ─────────────────────────────────────────────────────
function PrayerView({t,date}){
  const [city,setCity]=useState("Dakar");
  const [coords,setCoords]=useState({lat:14.6937,lon:-17.4441});
  const [loadingGeo,setLoadingGeo]=useState(false);
  const [loadingPrayer,setLoadingPrayer]=useState(false);
  const [times,setTimes]=useState(null);
  const [apiError,setApiError]=useState(false);

  const cities={
    "Dakar":{lat:14.6937,lon:-17.4441},
    "Thiès":{lat:14.7897,lon:-16.9256},
    "Saint-Louis":{lat:16.0179,lon:-16.4897},
    "Kaolack":{lat:14.1520,lon:-16.0726},
    "Ziguinchor":{lat:12.5526,lon:-16.2721},
    "Touba":{lat:14.8547,lon:-15.8824},
    "Diourbel":{lat:14.6543,lon:-16.2283},
    "Tambacounda":{lat:13.7709,lon:-13.6673},
    "Paris":{lat:48.8566,lon:2.3522},
    "Abidjan":{lat:5.3600,lon:-4.0083},
    "Bamako":{lat:12.6392,lon:-8.0029},
    "Conakry":{lat:9.5370,lon:-13.6773},
  };

  useEffect(()=>{
    setLoadingPrayer(true);
    setApiError(false);
    fetchPrayerTimes(date, coords.lat, coords.lon).then(result=>{
      if(result){
        setTimes(result);
      } else {
        setTimes(getPrayerTimesFallback(date, coords.lat, coords.lon));
        setApiError(true);
      }
      setLoadingPrayer(false);
    });
  },[date, coords]);

  const detectLocation=()=>{
    if(!navigator.geolocation)return;
    setLoadingGeo(true);
    navigator.geolocation.getCurrentPosition(pos=>{
      setCoords({lat:pos.coords.latitude,lon:pos.coords.longitude});
      setCity("Ma position");
      setLoadingGeo(false);
    },()=>setLoadingGeo(false),{timeout:8000});
  };

  const prayerList=[
    {name:"Fajr",wolof:"Fajr",ar:"الفَجْر",icon:"🌅",time:times?.fajr||"--:--",color:"#8a9fc4"},
    {name:"Lever",wolof:"Suba",ar:"الشُّرُوق",icon:"☀️",time:times?.sunrise||"--:--",color:"#e8c97a"},
    {name:"Dhuhr",wolof:"Tisbar",ar:"الظُّهْر",icon:"🌞",time:times?.dhuhr||"--:--",color:"#C9A84C"},
    {name:"Asr",wolof:"Takussan",ar:"العَصْر",icon:"🌤",time:times?.asr||"--:--",color:"#C9A84C"},
    {name:"Maghrib",wolof:"Timis",ar:"المَغْرِب",icon:"🌇",time:times?.maghrib||"--:--",color:"#e07a5f"},
    {name:"Isha",wolof:"Gué",ar:"العِشَاء",icon:"🌙",time:times?.isha||"--:--",color:"#5c6bc0"},
  ];

  // Prière actuelle
  const now=new Date();
  const nowMinutes=now.getHours()*60+now.getMinutes();
  const toMin=s=>parseInt(s.split(":")[0])*60+parseInt(s.split(":")[1]);
  const prayerMins=prayerList.map(p=>{ try { return toMin(p.time); } catch(e) { return 0; }});
  let currentPrayer=5;
  for(let i=0;i<prayerMins.length;i++){if(nowMinutes<prayerMins[i]){currentPrayer=i===0?5:i-1;break;}}

  return(
    <div>
      <h3 style={{color:t.accent,fontSize:13,letterSpacing:2,marginBottom:8,fontWeight:"bold"}}>🌅 Heures de Prière</h3>

      {/* Date Hijri */}
      <div style={{background:t.rowBg,border:`1px solid ${t.accent}33`,borderRadius:10,padding:"10px 14px",marginBottom:12,textAlign:"center"}}>
        <div style={{fontSize:13,fontWeight:"bold",color:t.accentSoft}}>{date.toLocaleDateString("fr-FR",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})}</div>
        <div style={{fontSize:13,fontWeight:"bold",color:t.accent,marginTop:4}}>{toHijri(date).display}</div>
      </div>

      {/* Sélecteur ville */}
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <select value={city} onChange={e=>{setCity(e.target.value);setCoords(cities[e.target.value]||coords);}}
          style={{flex:1,background:t.rowBg,border:`1px solid ${t.accent}33`,borderRadius:8,padding:"8px 12px",color:t.textLight,fontSize:13,fontFamily:"inherit",outline:"none",colorScheme:t.inputColor}}>
          {Object.keys(cities).map(c=><option key={c} value={c} style={{background:"#07061a"}}>{c}</option>)}
        </select>
        <button onClick={detectLocation} style={{background:t.accent,border:"none",borderRadius:8,padding:"8px 12px",color:t.deepBlue,fontSize:13,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
          {loading?"⏳":"🌍"} Position
        </button>
      </div>

      {/* Grille des prières */}
      {loadingPrayer&&<div style={{textAlign:"center",padding:"20px",color:t.textMuted,fontSize:13,fontWeight:"bold"}}>⏳ Récupération des heures exactes...</div>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        {prayerList.map((p,i)=>{
          const isCurrent=i===currentPrayer&&date.toDateString()===new Date().toDateString();
          return(
            <div key={p.name} style={{background:isCurrent?`${p.color}22`:t.rowBg,border:`1px solid ${isCurrent?p.color:t.accent+"22"}`,borderRadius:12,padding:"12px",textAlign:"center",position:"relative"}}>
              {isCurrent&&<div style={{position:"absolute",top:4,right:6,fontSize:11,color:p.color,fontWeight:"bold"}}>EN COURS</div>}
              <div style={{fontSize:20,marginBottom:4}}>{p.icon}</div>
              <div style={{fontSize:13,fontWeight:"bold",color:t.textLight,marginBottom:1,fontWeight:"bold"}}>{p.name}</div>
              <div style={{fontSize:13,color:p.color,fontWeight:"bold",marginBottom:1}}>{p.wolof}</div>
              <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,direction:"rtl",marginBottom:5}}>{p.ar}</div>
              <div style={{fontSize:20,color:p.color,fontWeight:"bold"}}>{p.time}</div>
            </div>
          );
        })}
      </div>

      {/* Manzil + Prière */}
      <div style={{background:t.cardBg,border:`1px solid ${t.accent}33`,borderRadius:12,padding:"12px",marginBottom:10}}>
        <div style={{fontSize:12,fontWeight:"bold",color:t.accent,marginBottom:8,textAlign:"center"}}>🌙 Manzil au moment des prières</div>
        <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,lineHeight:1.6}}>
          Les savants recommandent de réciter le Du'a spécifique au manzil du jour entre chaque prière, notamment entre Maghrib et Isha — moment de la tombée de nuit où la Lune est à son zénith d'influence.
        </div>
      </div>
    </div>
  );
}

// ─── Du'a du Manzil ───────────────────────────────────────────────────────
function DuaView({md,t}){
  const [sel,setSel]=useState(md?.manzilIdx??0);
  useEffect(()=>{if(md)setSel(md.manzilIdx);},[md]);
  const dua=DUAS[sel];
  const manzil=MANAZIL[sel];
  const nc=NC[manzil.nature]||t.accent;

  const share=()=>{
    const text=`🤲 *Du'a du Manzil #${sel+1} — ${manzil.fr}*\n\n${dua.ar}\n\n"${dua.fr}"\n\n📿 ${dua.occasion}\n\n🔗 manazil-senastro.com`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,"_blank");
  };

  return(
    <div>
      <h3 style={{color:t.accent,fontSize:13,letterSpacing:2,marginBottom:8,fontWeight:"bold"}}>🤲 Du'a des Manāzil</h3>
      <p style={{fontSize:12,fontWeight:"600",color:t.textMuted,marginBottom:14,lineHeight:1.5}}>Invocations recommandées selon la tradition classique pour chaque station lunaire.</p>

      {/* Sélecteur */}
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
        {MANAZIL.map((m,i)=>{
          const c=NC[m.nature]||t.accent;
          return<button key={i} style={{width:32,height:32,borderRadius:8,background:i===sel?`${c}22`:t.rowBg,border:i===sel?`1px solid ${c}99`:`1px solid ${t.accent}22`,color:i===sel?c:t.textMuted,fontSize:13,cursor:"pointer",fontFamily:"inherit",fontWeight:i===sel?"bold":"normal"}} onClick={()=>setSel(i)}>{i+1}</button>;
        })}
      </div>

      {/* Info manzil */}
      <div style={{background:t.rowBg,border:`1px solid ${nc}33`,borderRadius:12,padding:"12px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
        <div style={{textAlign:"center",minWidth:50}}>
          <div style={{fontSize:20,fontWeight:"bold",color:t.accentSoft,direction:"rtl"}}>{manzil.ar}</div>
          <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,marginTop:2}}>#{sel+1}</div>
        </div>
        <div>
          <div style={{fontSize:13,fontWeight:"bold",color:t.textLight,marginBottom:2}}>{manzil.fr}</div>
          <div style={{fontSize:12,color:nc}}>{manzil.nature} · {manzil.element} · {manzil.planete}</div>
          {md?.manzilIdx===sel&&<div style={{fontSize:12,fontWeight:"bold",color:t.accent,marginTop:2}}>☽ Lune ici maintenant</div>}
        </div>
      </div>

      {/* Du'a principal */}
      <div style={{background:t.cardBg,border:`1px solid ${t.accent}55`,borderRadius:16,padding:"20px",marginBottom:12}}>
        <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,letterSpacing:2,marginBottom:14,textAlign:"center"}}>الدُّعَاء</div>
        <div style={{fontSize:18,fontWeight:"bold",color:t.accentSoft,direction:"rtl",lineHeight:2,marginBottom:16,textAlign:"right",fontFamily:"'Amiri','Georgia',serif"}}>{dua.ar}</div>
        <div style={{borderTop:`1px solid ${t.accent}22`,paddingTop:14}}>
          <div style={{fontSize:13,fontWeight:"bold",color:t.textLight,lineHeight:1.8,marginBottom:10,fontStyle:"italic"}}>"{dua.fr}"</div>
          <div style={{background:`${t.accent}11`,border:`1px solid ${t.accent}22`,borderRadius:8,padding:"8px 12px"}}>
            <div style={{fontSize:12,fontWeight:"bold",color:t.accent,marginBottom:2}}>📿 Quand réciter :</div>
            <div style={{fontSize:12,fontWeight:"600",color:t.textMuted}}>{dua.occasion}</div>
          </div>
        </div>
      </div>

      {/* Hadith aléatoire */}
      {(()=>{
        const h=HADITHS[sel%HADITHS.length];
        return(
          <div style={{background:t.rowBg,border:`1px solid ${t.accent}33`,borderRadius:12,padding:"14px",marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:"bold",color:t.accent,marginBottom:10}}>📖 Hadith & Coran sur la Lune</div>
            <div style={{fontSize:13,fontWeight:"bold",color:t.accentSoft,direction:"rtl",lineHeight:1.8,marginBottom:8,textAlign:"right"}}>{h.texte}</div>
            <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,lineHeight:1.6,marginBottom:6,fontStyle:"italic"}}>{h.traduction}</div>
            <div style={{fontSize:12,fontWeight:"bold",color:t.accent}}>— {h.source}</div>
          </div>
        );
      })()}

      {/* Partage */}
      {/* Copier Du'a */}
      <button onClick={()=>{navigator.clipboard?.writeText(`${dua.ar}

${dua.fr}`).then(()=>alert("✅ Du'a copié !"));}}
        style={{width:"100%",background:t.rowBg,border:`1px solid ${t.accent}33`,borderRadius:12,padding:"11px",color:t.accentSoft,fontSize:13,fontWeight:"bold",cursor:"pointer",fontFamily:"inherit",marginBottom:8}}>
        📋 Copier le Du'a
      </button>
      <button onClick={share} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"#25D366",border:"none",borderRadius:12,padding:"12px",color:"white",fontSize:13,fontWeight:"bold",cursor:"pointer",fontFamily:"inherit"}}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Partager ce Du'a sur WhatsApp
      </button>
    </div>
  );
}

// ─── Partage ──────────────────────────────────────────────────────────────
function ShareBtn({md,ph,t}){
  const share=()=>{
    if(!md)return;
    const m=md.manzil;
    const text=`🌙 *Manāzil Al-Qamar du jour*\n\n📅 ${new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})}\n${md.hijri?.display||""}\n\n🕌 *Manzil #${md.manzilIdx+1}* — ${m.ar}\n✦ ${m.fr} · ${m.symbole}\n📊 ${m.nature} · ${m.element} · ${m.planete}\n\n${ph.emoji} Phase : ${ph.name} (${ph.age} jours)\n⏰ Entrée : ${fmtT(md.entryTime)} · Sortie : ${fmtT(md.exitTime)}\n\n✅ ${m.favorables.slice(0,2).join(", ")}\n❌ ${m.defavorables.slice(0,2).join(", ")}\n\n🤲 Du'a : ${DUAS[md.manzilIdx].fr}\n\n🔗 *manazil-senastro.com*`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,"_blank");
  };
  return(
    <button onClick={share} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"#25D366",border:"none",borderRadius:12,padding:"12px",color:"white",fontSize:13,fontWeight:"bold",cursor:"pointer",marginBottom:10,fontFamily:"inherit"}}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      📤 Partager le manzil du jour
    </button>
  );
}

// ─── Pub ──────────────────────────────────────────────────────────────────
function BookAd(){
  return(
    <div style={{background:"linear-gradient(135deg,#1a0a00,#2d1500,#1a0a00)",border:"1px solid #C9A84C88",borderRadius:12,padding:"12px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>window.open("https://wa.me/221764265550","_blank")}>
      <span style={{fontSize:24}}>📚</span>
      <div style={{flex:1}}>
        <div style={{fontSize:13,color:"#e8c97a",fontWeight:"bold",marginBottom:2}}>Les Manâzil Al-Qamar</div>
        <div style={{fontSize:12,color:"#C9A84C88"}}>Livre FR & Wolof — dès 6.900 FCFA</div>
      </div>
      <div style={{fontSize:12,background:"#25D366",color:"white",borderRadius:20,padding:"4px 10px",whiteSpace:"nowrap"}}>Commander</div>
    </div>
  );
}

// ─── Rôles ────────────────────────────────────────────────────────────────
function RolesCard({manzil,t}){
  const [open,setOpen]=useState(false);
  const c=NC[manzil.nature]||t.accent;
  const roles=[{icon:"💒",label:"Mariage",text:manzil.mariage},{icon:"✈",label:"Voyage",text:manzil.voyage},{icon:"💰",label:"Commerce",text:manzil.commerce},{icon:"🌿",label:"Agriculture",text:manzil.agriculture},{icon:"🏥",label:"Santé",text:manzil.sante},{icon:"🔮",label:"Magie",text:manzil.magie}];
  return(
    <div style={{background:t.rowBg,border:`1px solid ${t.accent}33`,borderRadius:14,padding:14,marginBottom:10}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
        <span style={{fontSize:12,borderRadius:20,padding:"3px 8px",fontWeight:"bold",background:`${c}22`,color:c,border:`1px solid ${c}55`}}>{manzil.nature}</span>
        <span style={{fontSize:12,fontWeight:"600",color:t.textMuted}}>✦ {manzil.symbole} · {manzil.element}</span>
      </div>
      <p style={{fontSize:12,fontWeight:"600",color:t.textMuted,lineHeight:1.7,marginBottom:12,borderLeft:`2px solid ${t.accent}44`,paddingLeft:8}}>{manzil.description}</p>
      <div style={{display:"flex",gap:8,marginBottom:open?12:0}}>
        <div style={{flex:1}}>
          <div style={{fontSize:12,fontWeight:"bold",color:t.textLight,marginBottom:6,fontWeight:"bold"}}>✅ À faire</div>
          {manzil.favorables.map((r,i)=><div key={i} style={{display:"flex",alignItems:"flex-start",marginBottom:5}}><span style={{color:"#4ecf8a",marginRight:6,fontSize:12}}>●</span><span style={{fontSize:12,fontWeight:"600",color:t.textMuted,lineHeight:1.4}}>{r}</span></div>)}
        </div>
        <div style={{width:1,background:`${t.accent}22`,margin:"0 4px"}}/>
        <div style={{flex:1}}>
          <div style={{fontSize:12,fontWeight:"bold",color:t.textLight,marginBottom:6,fontWeight:"bold"}}>❌ À éviter</div>
          {manzil.defavorables.map((r,i)=><div key={i} style={{display:"flex",alignItems:"flex-start",marginBottom:5}}><span style={{color:"#e07a5f",marginRight:6,fontSize:12}}>●</span><span style={{fontSize:12,fontWeight:"600",color:t.textMuted,lineHeight:1.4}}>{r}</span></div>)}
        </div>
      </div>
      <button onClick={()=>setOpen(!open)} style={{width:"100%",background:`${t.accent}11`,border:`1px solid ${t.accent}33`,borderRadius:8,padding:"7px",color:t.accentSoft,fontSize:12,cursor:"pointer",fontFamily:"inherit",marginBottom:open?10:0}}>
        {open?"▲ Masquer les rôles détaillés":"▼ Mariage · Voyage · Commerce · Santé · Magie"}
      </button>
      {open&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {roles.map(({icon,label,text})=>(
            <div key={label} style={{background:t.cardBg||`${t.accent}08`,border:`1px solid ${t.accent}22`,borderRadius:10,padding:"10px"}}>
              <div style={{fontSize:13,marginBottom:3}}>{icon}</div>
              <div style={{fontSize:12,fontWeight:"bold",color:t.accentSoft,fontWeight:"bold",marginBottom:3}}>{label}</div>
              <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,lineHeight:1.5}}>{text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Position Lune + Soleil ───────────────────────────────────────────────
function MoonSunPos({md,sys,t}){
  const sg=sys==="sidereal"?md.signeSid:md.signeTrop;
  return(
    <div style={{background:t.cardBg,border:`1px solid ${t.accent}44`,borderRadius:14,padding:"14px",marginBottom:10}}>
      <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,letterSpacing:2,marginBottom:10,textAlign:"center"}}>🌙 POSITIONS CÉLESTES</div>
      <div style={{display:"flex",gap:8}}>
        {/* Lune */}
        <div style={{flex:1,background:`${t.accent}11`,border:`1px solid ${t.accent}33`,borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
          <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,marginBottom:4}}>🌙 LUNE</div>
          <div style={{fontSize:22,marginBottom:4}}>{sg.signe.emoji}</div>
          <div style={{fontSize:14,fontWeight:"bold",color:t.accentSoft,marginBottom:2}}>{sg.signe.fr}</div>
          <div style={{fontSize:16,fontWeight:"bold",color:t.accent,fontWeight:"bold"}}>{sg.deg}° {sg.min}'</div>
          <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,marginTop:2}}>Manzil #{md.manzilIdx+1}</div>
        </div>
        {/* Soleil */}
        {md.sunSigne&&(
          <div style={{flex:1,background:`#e8c97a11`,border:`1px solid #e8c97a33`,borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
            <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,marginBottom:4}}>☀️ SOLEIL</div>
            <div style={{fontSize:22,marginBottom:4}}>{md.sunSigne.signe.emoji}</div>
            <div style={{fontSize:14,fontWeight:"bold",color:"#e8c97a",marginBottom:2}}>{md.sunSigne.signe.fr}</div>
            <div style={{fontSize:16,color:"#C9A84C",fontWeight:"bold"}}>{md.sunSigne.deg}° {md.sunSigne.min}'</div>
            <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,marginTop:2}}>{sys==="sidereal"?"Sidéral":"Tropical"}</div>
          </div>
        )}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:10,paddingTop:8,borderTop:`1px solid ${t.accent}22`}}>
        {[["λ Tropical",md.lonTrop],["λ Sidéral",md.lonSid],["Ayanamsa",md.aya]].map(([l,v])=>(
          <div key={l} style={{textAlign:"center",flex:1}}>
            <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,marginBottom:2}}>{l}</div>
            <div style={{fontSize:13,fontWeight:"bold",color:t.accentSoft}}>{v}°</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Compte à rebours ─────────────────────────────────────────────────────
function LunarCountdown({date,t}){
  const events=nextLunarEvent(date);
  const fmtDate=d=>d.toLocaleDateString("fr-FR",{weekday:"short",day:"2-digit",month:"short"});
  return(
    <div style={{display:"flex",gap:8,marginBottom:10}}>
      {[{emoji:"🌑",name:"Nouvelle Lune",data:events.newMoon,color:"#8a9fc4"},{emoji:"🌕",name:"Pleine Lune",data:events.fullMoon,color:"#e8c97a"}].map(({emoji,name,data,color})=>(
        <div key={name} style={{flex:1,background:t.rowBg,border:`1px solid ${color}33`,borderRadius:12,padding:"12px",textAlign:"center"}}>
          <div style={{fontSize:24,marginBottom:4}}>{emoji}</div>
          <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,marginBottom:6}}>{name}</div>
          <div style={{fontSize:20,color,fontWeight:"bold",marginBottom:2}}>{data.days}j</div>
          <div style={{fontSize:12,fontWeight:"600",color:t.textMuted}}>{fmtDate(data.date)}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Calendrier mensuel ───────────────────────────────────────────────────
function MonthCal({selDate,setSelDate,sys,setTab,t}){
  const [vd,setVd]=useState(new Date(selDate));
  const getLon=sys==="sidereal"?moonSid:moonTrop;
  const Y=vd.getFullYear(),M=vd.getMonth();
  const first=new Date(Y,M,1),last=new Date(Y,M+1,0);
  const dow=(first.getDay()+6)%7;
  const days=[];for(let i=0;i<dow;i++)days.push(null);for(let i=1;i<=last.getDate();i++)days.push(i);
  const mn=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const today=new Date();
  return(
    <div>
      <h3 style={{color:t.accent,fontSize:13,letterSpacing:2,marginBottom:12,fontWeight:"bold"}}>📅 Calendrier Lunaire</h3>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <button onClick={()=>setVd(new Date(Y,M-1,1))} style={{background:t.rowBg,border:`1px solid ${t.accent}33`,borderRadius:8,padding:"6px 12px",color:t.accentSoft,cursor:"pointer",fontSize:14}}>◀</button>
        <span style={{color:t.accentSoft,fontSize:14,fontWeight:"bold"}}>{mn[M]} {Y}</span>
        <button onClick={()=>setVd(new Date(Y,M+1,1))} style={{background:t.rowBg,border:`1px solid ${t.accent}33`,borderRadius:8,padding:"6px 12px",color:t.accentSoft,cursor:"pointer",fontSize:14}}>▶</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>
        {["Lu","Ma","Me","Je","Ve","Sa","Di"].map(d=><div key={d} style={{textAlign:"center",fontSize:12,fontWeight:"600",color:t.textMuted,padding:"4px 0"}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
        {days.map((day,i)=>{
          if(!day)return<div key={i}/>;
          const d=new Date(Y,M,day,12,0,0);
          const lon=getLon(jd(d));const idx=mIdx(lon);
          const ph=phase(d);const c=NC[MANAZIL[idx].nature]||t.accent;
          const isT=d.getDate()===today.getDate()&&d.getMonth()===today.getMonth()&&d.getFullYear()===today.getFullYear();
          const isS=d.getDate()===selDate.getDate()&&d.getMonth()===selDate.getMonth()&&d.getFullYear()===selDate.getFullYear();
          return(
            <div key={i} onClick={()=>{setSelDate(d);setTab("today");}} style={{background:isS?`${t.accent}44`:isT?`${t.accent}22`:`${c}11`,border:isS?`1px solid ${t.accent}`:isT?`1px solid ${t.accent}66`:`1px solid ${c}22`,borderRadius:6,padding:"4px 2px",textAlign:"center",cursor:"pointer",minHeight:46}}>
              <div style={{fontSize:13,color:isT?t.accentSoft:t.textLight,fontWeight:isT?"bold":"normal"}}>{day}</div>
              <div style={{fontSize:13}}>{ph.emoji}</div>
              <div style={{fontSize:11,color:c}}>{idx+1}</div>
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:12,justifyContent:"center"}}>
        {Object.entries(NC).map(([n,c])=><div key={n} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:8,height:8,borderRadius:"50%",background:c}}/><span style={{fontSize:12,fontWeight:"600",color:t.textMuted}}>{n}</span></div>)}
      </div>
    </div>
  );
}

// ─── Dates Favorables ─────────────────────────────────────────────────────
function FavorableDates({sys,t}){
  const [filter,setFilter]=useState("mariage");
  const getLon=sys==="sidereal"?moonSid:moonTrop;
  const filters=[{key:"mariage",icon:"💒",label:"Mariage"},{key:"voyage",icon:"✈",label:"Voyage"},{key:"commerce",icon:"💰",label:"Commerce"},{key:"sante",icon:"🏥",label:"Santé"},{key:"agriculture",icon:"🌿",label:"Agriculture"}];
  const days=Array.from({length:30},(_,i)=>{const d=new Date();d.setDate(d.getDate()+i);d.setHours(12,0,0,0);return d;});
  const results=days.map(d=>{const lon=getLon(jd(d));const idx=mIdx(lon);const m=MANAZIL[idx];const ph=phase(d);const isFav=["Très bénéfique","Bénéfique"].includes(m.nature);return{date:d,manzil:m,idx,ph,isFav};}).filter(r=>r.isFav);
  const mn=["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
  const jours=["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
  return(
    <div>
      <h3 style={{color:t.accent,fontSize:13,letterSpacing:2,marginBottom:8,fontWeight:"bold"}}>🗓️ Dates Favorables — 30 jours</h3>
      <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
        {filters.map(f=><button key={f.key} onClick={()=>setFilter(f.key)} style={{flexShrink:0,padding:"6px 10px",background:filter===f.key?`${t.accent}33`:"none",border:filter===f.key?`1px solid ${t.accent}99`:`1px solid ${t.accent}22`,borderRadius:20,color:filter===f.key?t.accentSoft:t.textMuted,fontSize:12,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>{f.icon} {f.label}</button>)}
      </div>
      {results.map((r,i)=>{
        const c=NC[r.manzil.nature]||t.accent;
        return(
          <div key={i} style={{background:t.rowBg,border:`1px solid ${c}44`,borderRadius:14,padding:"14px",marginBottom:10,position:"relative"}}>
            <div style={{position:"absolute",top:0,right:0,background:c,color:"#07061a",fontSize:11,padding:"3px 10px",borderBottomLeftRadius:10,fontWeight:"bold"}}>{r.manzil.nature}</div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
              <div style={{textAlign:"center",minWidth:50,background:`${c}22`,borderRadius:10,padding:"6px"}}>
                <div style={{fontSize:12,fontWeight:"600",color:t.textMuted}}>{jours[r.date.getDay()]}</div>
                <div style={{fontSize:20,fontWeight:"bold",color:t.accentSoft,fontWeight:"bold"}}>{r.date.getDate()}</div>
                <div style={{fontSize:12,fontWeight:"600",color:t.textMuted}}>{mn[r.date.getMonth()]}</div>
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><span style={{fontSize:13}}>{r.ph.emoji}</span><span style={{fontSize:12,fontWeight:"600",color:t.textMuted}}>{r.ph.name}</span></div>
                <div style={{fontSize:15,fontWeight:"bold",color:t.accentSoft,direction:"rtl",marginBottom:2}}>{r.manzil.ar}</div>
                <div style={{fontSize:12,fontWeight:"bold",color:t.textLight}}>{r.manzil.fr} · #{r.idx+1}</div>
              </div>
            </div>
            <div style={{background:`${c}11`,border:`1px solid ${c}22`,borderRadius:8,padding:"8px 10px",marginBottom:8}}>
              <div style={{fontSize:12,color:c,fontWeight:"bold",marginBottom:3}}>{filters.find(f=>f.key===filter)?.icon} {filters.find(f=>f.key===filter)?.label}</div>
              <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,lineHeight:1.5}}>{r.manzil[filter]||"Favorable"}</div>
            </div>
            {/* Du'a court */}
            <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,borderTop:`1px solid ${t.accent}22`,paddingTop:8,direction:"rtl",textAlign:"right"}}>🤲 {DUAS[r.idx].ar.substring(0,50)}...</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Notifications ────────────────────────────────────────────────────────
function NotifManager({t}){
  const [status,setStatus]=useState("default");
  const request=async()=>{
    if(!("Notification" in window)){setStatus("unsupported");return;}
    const p=await Notification.requestPermission();
    setStatus(p);
    if(p==="granted")new Notification("🌙 Sen-Astro activé !",{body:"Tu recevras le manzil du jour chaque matin.",icon:"/icon-192.png"});
  };
  useEffect(()=>{if("Notification" in window)setStatus(Notification.permission);else setStatus("unsupported");},[]);
  return(
    <div style={{background:t.cardBg,border:`1px solid ${t.accent}44`,borderRadius:14,padding:"16px",marginBottom:10}}>
      <div style={{fontSize:13,fontWeight:"bold",color:t.accentSoft,marginBottom:6,fontWeight:"bold"}}>🔔 Notifications quotidiennes</div>
      <p style={{fontSize:12,fontWeight:"600",color:t.textMuted,lineHeight:1.6,marginBottom:12}}>Reçois chaque matin le manzil du jour et son Du'a.</p>
      {status==="granted"?<div style={{background:"#4ecf8a22",border:"1px solid #4ecf8a44",borderRadius:10,padding:"10px",textAlign:"center"}}><div style={{color:"#4ecf8a"}}>✅ Notifications activées !</div></div>:status==="denied"?<div style={{background:"#e07a5f22",border:"1px solid #e07a5f44",borderRadius:10,padding:"10px",textAlign:"center",fontSize:12,color:"#e07a5f"}}>❌ Bloquées dans les paramètres du navigateur.</div>:status==="unsupported"?<div style={{fontSize:12,fontWeight:"600",color:t.textMuted}}>⚠️ Utilise Chrome ou Edge.</div>:<button onClick={request} style={{width:"100%",background:t.accent,border:"none",borderRadius:10,padding:"12px",color:t.deepBlue,fontSize:13,fontWeight:"bold",cursor:"pointer",fontFamily:"inherit"}}>🔔 Activer les notifications</button>}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────
export default function App(){
  const [selDate,setSelDate]=useState(new Date());
  const [sys,setSys]=useState("sidereal");
  const [md,setMd]=useState(null);
  const [loading,setLoading]=useState(false);
  const [tab,setTab]=useState("today");
  const [prevTab,setPrevTab]=useState("today");
  const [tk,setTk]=useState("night");
  const t=THEMES[tk];
  const tabOrder=["today","natal","book","dua","wheel","calendar","dates","roles","list","settings"];

  // Swipe gauche/droite
  const touchStart=useRef(null);
  const handleTouchStart=e=>touchStart.current=e.touches[0].clientX;
  const handleTouchEnd=e=>{
    if(!touchStart.current)return;
    const diff=touchStart.current-e.changedTouches[0].clientX;
    if(Math.abs(diff)>50){
      const idx=tabOrder.indexOf(tab);
      if(diff>0&&idx<tabOrder.length-1){changeTab(tabOrder[idx+1]);}
      else if(diff<0&&idx>0){changeTab(tabOrder[idx-1]);}
    }
    touchStart.current=null;
  };
  const changeTab=newTab=>{setPrevTab(tab);setTab(newTab);};

  const compute=useCallback((d,s)=>{setLoading(true);setTimeout(()=>{setMd(calcData(d,s));setLoading(false);},250);},[]);
  useEffect(()=>{compute(selDate,sys);},[selDate,sys]);

  // Détection nouvelle version → rechargement automatique
  useEffect(()=>{
    if("serviceWorker" in navigator){
      navigator.serviceWorker.addEventListener("message",event=>{
        if(event.data?.type==="NEW_VERSION"){
          // Nouvelle version disponible → recharge silencieusement
          window.location.reload();
        }
      });
    }
  },[]);

  const ds=selDate.toISOString().split("T")[0];
  const ts=`${String(selDate.getHours()).padStart(2,"0")}:${String(selDate.getMinutes()).padStart(2,"0")}`;
  const ph=phase(selDate);

  const TABS=[["today","Aujourd'hui"],["natal","🌙 Natal"],["book","📚 Livre"],["dua","🤲 Du'a"],["wheel","⭕ Roue"],["calendar","📅 Mois"],["dates","🗓️ Dates"],["roles","Rôles"],["list","Les 28"],["settings","⚙️"]];

  return(
    <div style={{minHeight:"100vh",maxWidth:430,margin:"0 auto",background:t.root,fontFamily:"'Georgia','Times New Roman',serif",color:t.textLight,position:"relative",overflow:"hidden"}} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {t.starsBg&&<StarField/>}

      <header style={{textAlign:"center",padding:"20px 20px 10px",background:t.header,borderBottom:`1px solid ${t.headerBorder}`,position:"sticky",top:0,zIndex:50,backdropFilter:"blur(12px)"}}>
        <div style={{position:"absolute",top:-80,left:"50%",transform:"translateX(-50%)",width:200,height:200,background:`radial-gradient(circle,${t.accent}18 0%,transparent 70%)`,pointerEvents:"none"}}/>
        <div style={{letterSpacing:6,fontSize:12,marginBottom:4,textTransform:"uppercase"}}>
          <span style={{color:t.accent,fontWeight:"bold"}}>SEN</span><span style={{color:t.textMuted,margin:"0 3px",fontSize:11}}>✦</span><span style={{color:t.textMuted}}>ASTRO</span>
        </div>
        <h1 style={{margin:"0 0 3px",fontSize:26,fontWeight:"600",color:t.accentSoft,textShadow:`0 0 40px ${t.accent}66`,letterSpacing:2}}>مَنَازِل القَمَر</h1>
        <p style={{margin:0,fontSize:12,fontWeight:"600",color:t.textMuted,letterSpacing:4,textTransform:"uppercase"}}>Stations Lunaires</p>
        {md?.hijri&&<div style={{fontSize:12,fontWeight:"bold",color:t.accent,marginTop:4}}>{md.hijri.display}</div>}
      </header>

      <div style={{display:"flex",gap:5,padding:"8px 12px",background:t.tabsBg,borderBottom:`1px solid ${t.tabBorder}`,alignItems:"center"}}>
      {/* BANNIÈRE PUB */}
      <div onClick={()=>window.open("https://wa.me/221764265550","_blank")} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:"linear-gradient(135deg,#1a0a00 0%,#2d1500 50%,#1a0a00 100%)",borderBottom:"2px solid #C9A84C",cursor:"pointer"}}>
        <div style={{fontSize:26}}>📚</div>
        <div style={{flex:1}}>
          <div style={{fontSize:13,color:"#e8c97a",fontWeight:"bold",marginBottom:3}}>Les Manâzil Al-Qamar</div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:13,color:"#C9A84C",fontWeight:"bold"}}>🇫🇷 FR + 🌍 Wolof</span>
            <span style={{fontSize:12,background:"#2ecc71",color:"white",borderRadius:10,padding:"1px 7px",fontWeight:"bold"}}>-50%</span>
          </div>
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:13,color:"#e8c97a",fontWeight:"bold",marginBottom:3}}>6.900 F</div>
          <div style={{fontSize:12,background:"#25D366",color:"white",borderRadius:8,padding:"5px 9px",fontWeight:"bold"}}>📲 Commander</div>
        </div>
      </div>
      </div>

      <div style={{display:"flex",gap:6,padding:"8px 12px",background:`${t.tabsBg}99`,borderBottom:`1px solid ${t.tabBorder}`}}>
        {[["sidereal","☽","Sidéral","Arabo-islamique"],["tropical","☀","Tropical","Occidental"]].map(([k,icon,title,sub])=>(
          <button key={k} style={{flex:1,display:"flex",alignItems:"center",gap:6,background:sys===k?t.sysBtnActiveBg:"none",border:sys===k?`1px solid ${t.sysBtnActiveBorder}`:`1px solid ${t.sysBtnBorder}`,borderRadius:10,padding:"7px 8px",cursor:"pointer",color:sys===k?t.textLight:t.textMuted,fontFamily:"inherit"}} onClick={()=>setSys(k)}>
            <span style={{fontSize:18}}>{icon}</span>
            <div><div style={{fontSize:13,fontWeight:"600"}}>{title}</div><div style={{fontSize:12,fontWeight:"600",color:t.textMuted}}>{sub}</div></div>
          </button>
        ))}
        <div style={{display:"flex",flexDirection:"column",gap:3,marginLeft:4}}>
          {Object.entries(THEMES).map(([k,th])=>(
            <button key={k} onClick={()=>setTk(k)} style={{padding:"5px 8px",background:tk===k?`${th.accent}33`:"none",border:tk===k?`1px solid ${th.accent}99`:`1px solid ${t.tabBorder}`,borderRadius:6,color:tk===k?th.accent:t.textMuted,fontSize:11,fontWeight:"bold",cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>{th.name}</button>
          ))}
        </div>
      </div>

      <div style={{display:"flex",background:t.tabsBg,borderBottom:`1px solid ${t.tabBorder}`,overflowX:"auto"}}>
        {TABS.map(([k,l])=><button key={k} style={{flexShrink:0,padding:"14px 12px",background:tab===k?`${t.accent}18`:"none",border:"none",borderBottom:tab===k?`3px solid ${t.accent}`:"3px solid transparent",color:tab===k?t.accentSoft:t.textMuted,cursor:"pointer",fontSize:13,fontWeight:tab===k?"bold":"600",fontFamily:"inherit",whiteSpace:"nowrap",letterSpacing:0.3,transition:"all 0.2s"}} onClick={()=>changeTab(k)}>{l}</button>)}
      </div>

      <div style={{padding:"12px 12px 90px",animation:"fadeUp 0.35s ease both"}} key={tab}>
        {tab==="today"&&<TodayView md={md} loading={loading} ph={ph} sys={sys} selDate={selDate} ds={ds} ts={ts} t={t} onDC={e=>{const d=new Date(e.target.value);d.setHours(selDate.getHours(),selDate.getMinutes());setSelDate(d);}} onTC={e=>{const[h,m]=e.target.value.split(":").map(Number);const d=new Date(selDate);d.setHours(h,m,0);setSelDate(d);}}/>}
        {tab==="natal"&&<NatalView sys={sys} t={t}/>}

        {tab==="dua"&&<DuaView md={md} t={t}/>}
        {tab==="wheel"&&<WheelView md={md} ph={ph} t={t}/>}
        {tab==="calendar"&&<MonthCal selDate={selDate} setSelDate={setSelDate} sys={sys} setTab={setTab} t={t}/>}
        {tab==="dates"&&<FavorableDates sys={sys} t={t}/>}
        {tab==="roles"&&<RolesView md={md} t={t}/>}
        {tab==="list"&&<ListView idx={md?.manzilIdx} t={t}/>}
        {tab==="settings"&&<SettingsView t={t}/>}
        {tab==="book"&&<FullBookAd t={t}/>}
      </div>

      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:`${t.deepBlue}f0`,borderTop:`1px solid ${t.accent}22`,textAlign:"center",padding:"7px 0",backdropFilter:"blur(10px)"}}>
        <span style={{fontSize:11,fontWeight:"bold",color:t.textMuted,letterSpacing:1}}>© Sen-Astro — Ibn Ajiba & Al-Buni · manazil-senastro.com</span>
      </div>
      {/* Bouton retour en haut */}
      <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}
        style={{position:"fixed",bottom:55,right:16,width:40,height:40,borderRadius:"50%",background:t.accent,border:"none",color:t.deepBlue,fontSize:20,fontWeight:"bold",cursor:"pointer",zIndex:100,boxShadow:`0 4px 16px ${t.accent}66`}}>
        ↑
      </button>
    </div>
  );
}

function WheelView({md,ph,t}){
  return(
    <div>
      <h3 style={{color:t.accent,fontSize:13,letterSpacing:2,marginBottom:12,fontWeight:"bold",textAlign:"center"}}>⭕ Roue des Manāzil</h3>
      <div style={{textAlign:"center",marginBottom:12,animation:"float 4s ease-in-out infinite"}}>
        <MoonSVG ph={ph} size={100}/>
        <div style={{fontSize:13,fontWeight:"bold",color:t.accentSoft,marginTop:4}}>{ph.emoji} {ph.name} · {ph.age} jours · {ph.pct}% illuminé</div>
      </div>
      <ManzilWheel md={md} t={t}/>
      {md?.moonRise&&(
        <div style={{background:t.cardBg,border:`1px solid ${t.accent}33`,borderRadius:14,padding:"14px",marginTop:10}}>
          <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,letterSpacing:2,marginBottom:10,textAlign:"center"}}>🌙 LEVER & COUCHER</div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            {[["↗","Lever",md.moonRise.lever,"#4ecf8a"],["↑","Zénith",md.moonRise.zenith,t.accent],["↘","Coucher",md.moonRise.coucher,"#e07a5f"]].map(([icon,label,time,color])=>(
              <div key={label} style={{textAlign:"center",flex:1}}>
                <div style={{fontSize:16,color}}>{icon}</div>
                <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,marginBottom:3}}>{label}</div>
                <div style={{fontSize:15,fontWeight:"bold",color:t.accentSoft,fontWeight:"bold"}}>{time}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,textAlign:"center",marginTop:6}}>* Heures approximatives</div>
        </div>
      )}
    </div>
  );
}

function TodayView({md,loading,ph,sys,selDate,ds,ts,t,onDC,onTC}){
  return(
    <div>
      {/* ── MANZIL DU JOUR EN PREMIER ── */}
      {md&&!loading&&(
        <div style={{background:`linear-gradient(135deg,${t.accent}22,${t.accent}08)`,border:`2px solid ${t.accent}88`,borderRadius:16,padding:"16px",marginBottom:12,textAlign:"center"}}>
          <div style={{fontSize:11,color:t.textMuted,letterSpacing:3,marginBottom:6,fontWeight:"bold"}}>🌙 MANZIL DU JOUR</div>
          <div style={{fontSize:11,color:t.textMuted,marginBottom:4,fontWeight:"bold"}}>المنزل #{md.manzilIdx+1}</div>
          <div style={{fontSize:32,color:t.accentSoft,direction:"rtl",marginBottom:4,lineHeight:1.3,fontWeight:"bold"}}>{md.manzil.ar}</div>
          <div style={{fontSize:18,color:t.textLight,marginBottom:4,fontWeight:"bold"}}>{md.manzil.fr}</div>
          <div style={{fontSize:11,color:t.textMuted,marginBottom:10,fontWeight:"bold"}}>✦ {md.manzil.stars} · {md.manzil.symbole}</div>
          <span style={{fontSize:11,background:`${NC[md.manzil.nature]||t.accent}22`,color:NC[md.manzil.nature]||t.accent,border:`1px solid ${NC[md.manzil.nature]||t.accent}44`,borderRadius:20,padding:"4px 14px",fontWeight:"bold"}}>{md.manzil.nature}</span>
          <div style={{display:"flex",justifyContent:"space-around",marginTop:12}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:11,color:t.textMuted,fontWeight:"bold"}}>↗ Entrée</div>
              <div style={{fontSize:17,color:t.accentSoft,fontWeight:"bold"}}>{md.entryTime?new Date(md.entryTime).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}):"—"}</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:18,color:t.accent}}>☽</div>
              <div style={{fontSize:12,color:t.accent,fontWeight:"bold"}}>{md.progress}%</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:11,color:t.textMuted,fontWeight:"bold"}}>Sortie ↘</div>
              <div style={{fontSize:17,color:t.accentSoft,fontWeight:"bold"}}>{md.exitTime?new Date(md.exitTime).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}):"—"}</div>
            </div>
          </div>
        </div>
      )}
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        {[["📅",<input type="date" value={ds} onChange={onDC} style={{background:"none",border:"none",color:t.textLight,fontSize:13,fontFamily:"inherit",width:"100%",outline:"none",colorScheme:t.inputColor}}/>],
          ["⏰",<input type="time" value={ts} onChange={onTC} style={{background:"none",border:"none",color:t.textLight,fontSize:13,fontFamily:"inherit",width:"100%",outline:"none",colorScheme:t.inputColor}}/>]
        ].map(([label,input],i)=>(
          <div key={i} style={{flex:1,background:t.rowBg,border:`1px solid ${t.accent}33`,borderRadius:10,padding:"8px 12px"}}>
            <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,marginBottom:3}}>{label}</div>{input}
          </div>
        ))}
      </div>
      {loading?(<div style={{textAlign:"center",padding:"50px 0"}}><div style={{fontSize:40}}>☽</div><p style={{color:t.textMuted,marginTop:8,fontSize:13}}>Calcul en cours…</p></div>):md?(
        <>
          <div style={{display:"flex",alignItems:"center",gap:10,background:t.phaseBg,border:`1px solid ${t.phaseBorder}`,borderRadius:12,padding:"10px 12px",marginBottom:10}}>
            <MoonSVG ph={ph} size={65}/>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:"bold",color:t.accentSoft,marginBottom:2}}>{ph.name}</div>
              <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,marginBottom:2}}>{selDate.toLocaleDateString("fr-FR",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})}</div>
              <div style={{fontSize:12,fontWeight:"bold",color:t.accent}}>{md.hijri?.display}</div>
              <div style={{fontSize:12,fontWeight:"600",color:t.textMuted}}>Âge : {ph.age}j · {ph.pct}% illuminé</div>
            </div>
            <div style={{fontSize:11,color:t.deepBlue,background:t.accent,borderRadius:20,padding:"2px 6px"}}>{sys==="sidereal"?"Sidéral":"Tropical"}</div>
          </div>

          <LunarCountdown date={selDate} t={t}/>
          <MoonSunPos md={md} sys={sys} t={t}/>

          <div style={{background:t.cardBg,border:`1px solid ${t.cardBorder}`,borderRadius:14,padding:"12px",marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:"600",color:t.textMuted,marginBottom:6}}>
              <span>↗ Entrée</span><span style={{color:t.accent}}>{md.progress}% parcouru</span><span>Sortie ↘</span>
            </div>
            <div style={{height:5,background:`${t.accent}22`,borderRadius:3,position:"relative",overflow:"visible"}}>
              <div style={{height:"100%",background:`linear-gradient(90deg,${t.accent}66,${t.accent})`,borderRadius:3,width:`${md.progress}%`}}/>
              <div style={{position:"absolute",top:-9,left:`calc(${md.progress}% - 10px)`,fontSize:18,fontWeight:"bold",color:t.accentSoft,filter:`drop-shadow(0 0 6px ${t.accent})`,lineHeight:1}}>☽</div>
            </div>
          </div>

          <RolesCard manzil={md.manzil} t={t}/>

          {/* Du'a du jour */}
          <div style={{background:`${t.accent}11`,border:`1px solid ${t.accent}33`,borderRadius:12,padding:"12px",marginBottom:10}}>
            <div style={{fontSize:12,fontWeight:"bold",color:t.accent,marginBottom:6}}>🤲 Du'a du jour</div>
            <div style={{fontSize:13,fontWeight:"bold",color:t.accentSoft,direction:"rtl",lineHeight:1.8,textAlign:"right",marginBottom:6}}>{DUAS[md.manzilIdx].ar}</div>
            <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,fontStyle:"italic"}}>{DUAS[md.manzilIdx].fr}</div>
          </div>

          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            {[["↗","Entrée",md.entryTime],["↘","Sortie",md.exitTime]].map(([arrow,label,time],i)=>(
              <>
                <div key={i} style={{flex:1,background:t.rowBg,border:`1px solid ${t.accent}33`,borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
                  <div style={{fontSize:14,fontWeight:"bold",color:t.accent,marginBottom:2}}>{arrow}</div>
                  <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,marginBottom:4}}>{label}</div>
                  <div style={{fontSize:18,fontWeight:"bold",color:t.accentSoft,marginBottom:2}}>{fmtT(time)}</div>
                  <div style={{fontSize:12,fontWeight:"600",color:t.textMuted}}>{fmtD(time)}</div>
                </div>
                {i===0&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><div style={{width:1,height:14,background:`${t.accent}33`}}/><span style={{fontSize:14,fontWeight:"bold",color:t.accent}}>☽</span><div style={{width:1,height:14,background:`${t.accent}33`}}/></div>}
              </>
            ))}
          </div>

          <div style={{display:"flex",gap:8,marginBottom:10}}>
            {[["◀",(md.manzilIdx+27)%28],["▶",(md.manzilIdx+1)%28]].map(([dir,idx])=>(
              <div key={dir} style={{flex:1,background:t.rowBg,border:`1px solid ${t.accent}22`,borderRadius:10,padding:"8px",textAlign:"center"}}>
                <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,marginBottom:2}}>{dir==="◀"?"Précédent":"Suivant"}</div>
                <div style={{fontSize:13,fontWeight:"bold",color:t.accentSoft,direction:"rtl"}}>{MANAZIL[idx].ar}</div>
                <div style={{fontSize:12,fontWeight:"600",color:t.textMuted}}>{MANAZIL[idx].fr}</div>
              </div>
            ))}
          </div>

          <ShareBtn md={md} ph={ph} t={t}/>
          <BookAd/>

          <div style={{background:t.rowBg,border:`1px solid ${t.accent}33`,borderRadius:12,padding:"10px",marginBottom:10}}>
            <div style={{fontSize:12,fontWeight:"bold",color:t.accent,marginBottom:8,textAlign:"center"}}>⚖ Comparaison Sidéral / Tropical</div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              {[["☀",md.lonTrop,mIdx(parseFloat(md.lonTrop))],["☽",md.lonSid,mIdx(parseFloat(md.lonSid))]].map(([s,lon,i],n)=>(
                <>
                  <div key={n} style={{flex:1,textAlign:"center"}}>
                    <div style={{fontSize:12,fontWeight:"600",color:t.textMuted}}>{s} {n===0?"Tropical":"Sidéral"}</div>
                    <div style={{fontSize:13,fontWeight:"bold",color:t.accentSoft}}>{lon}°</div>
                    <div style={{fontSize:13,fontWeight:"bold",color:t.textLight,direction:"rtl"}}>{MANAZIL[i].ar}</div>
                    <div style={{fontSize:12,fontWeight:"bold",color:t.accent}}>#{i+1}</div>
                  </div>
                  {n===0&&<div style={{textAlign:"center",minWidth:44}}>
                    {mIdx(parseFloat(md.lonTrop))===mIdx(parseFloat(md.lonSid))?<div style={{fontSize:12,color:"#4ecf8a"}}>✓ =</div>:<div style={{fontSize:12,color:"#e07a5f"}}>≠</div>}
                    <div style={{fontSize:11,fontWeight:"600",color:t.textMuted}}>Δ{md.aya}°</div>
                  </div>}
                </>
              ))}
            </div>
          </div>
        </>
      ):null}
    </div>
  );
}

function RolesView({md,t}){
  const [sel,setSel]=useState(md?.manzilIdx??0);
  useEffect(()=>{if(md)setSel(md.manzilIdx);},[md]);
  const m=MANAZIL[sel];
  return(
    <div>
      <h3 style={{color:t.accent,fontSize:13,letterSpacing:2,marginBottom:8,fontWeight:"bold"}}>Rôles & Influences des Manāzil</h3>
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
        {MANAZIL.map((m2,i)=>{const c=NC[m2.nature]||t.accent;return<button key={i} style={{width:30,height:30,borderRadius:7,background:i===sel?`${c}22`:t.rowBg,border:i===sel?`1px solid ${c}99`:`1px solid ${t.accent}22`,color:i===sel?c:t.textMuted,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:i===sel?"bold":"normal"}} onClick={()=>setSel(i)}>{i+1}</button>;})}
      </div>
      <div style={{background:t.cardBg,border:`1px solid ${t.cardBorder}`,borderRadius:14,padding:"16px",marginBottom:10,textAlign:"center"}}>
        <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,letterSpacing:2,marginBottom:6}}>المنزل الـ {sel+1} · {m.symbole}</div>
        <div style={{fontSize:26,fontWeight:"bold",color:t.accentSoft,marginBottom:4,direction:"rtl"}}>{m.ar}</div>
        <div style={{fontSize:14,fontWeight:"bold",color:t.textLight,marginBottom:3}}>{m.fr}</div>
        <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,marginBottom:6}}>✦ {m.stars} · {m.element} · {m.planete}</div>
        {md?.manzilIdx===sel&&<div style={{fontSize:12,color:t.deepBlue,background:t.accent,borderRadius:20,padding:"2px 8px",display:"inline-block"}}>☽ Lune ici maintenant</div>}
      </div>
      <RolesCard manzil={m} t={t}/>
      {/* Du'a associé */}
      <div style={{background:`${t.accent}11`,border:`1px solid ${t.accent}33`,borderRadius:12,padding:"12px"}}>
        <div style={{fontSize:12,fontWeight:"bold",color:t.accent,marginBottom:6}}>🤲 Du'a de ce manzil</div>
        <div style={{fontSize:13,fontWeight:"bold",color:t.accentSoft,direction:"rtl",lineHeight:1.8,textAlign:"right",marginBottom:6}}>{DUAS[sel].ar}</div>
        <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,fontStyle:"italic"}}>{DUAS[sel].fr}</div>
      </div>
    </div>
  );
}

function ListView({idx,t}){
  const [search,setSearch]=useState("");
  const filtered=MANAZIL.filter((m,i)=>!search||m.fr.toLowerCase().includes(search.toLowerCase())||m.ar.includes(search)||m.nature.toLowerCase().includes(search.toLowerCase())||String(i+1)===search.trim());
  return(
    <div>
      <h3 style={{color:t.accent,fontSize:13,letterSpacing:2,marginBottom:10,fontWeight:"bold"}}>Les 28 Manāzil al-Qamar</h3>
      <div style={{background:t.rowBg,border:`1px solid ${t.accent}33`,borderRadius:10,padding:"8px 12px",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:14}}>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Chercher un manzil..."
          style={{flex:1,background:"none",border:"none",color:t.textLight,fontSize:13,fontFamily:"inherit",outline:"none",fontWeight:"bold"}}/>
        {search&&<button onClick={()=>setSearch("")} style={{background:"none",border:"none",color:t.textMuted,cursor:"pointer",fontSize:16}}>✕</button>}
      </div>
      {filtered.map((m,i)=>{
        const realIdx=MANAZIL.indexOf(m);
        const c=NC[m.nature]||t.accent,act=realIdx===idx;
        return(
          <div key={i} style={{background:act?t.listActiveBg:t.rowBg,border:`1px solid ${act?t.accent+"99":t.rowBorder}`,animation:"fadeUp 0.3s ease both",borderRadius:10,padding:"9px 12px",marginBottom:5,display:"flex",alignItems:"center",gap:8}}>
            <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,minWidth:18,textAlign:"center"}}>{i+1}</div>
            <div style={{fontSize:13,fontWeight:"bold",color:t.accentSoft,direction:"rtl",minWidth:80}}>{m.ar}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:"bold",color:t.textLight,marginBottom:1}}>{m.fr}</div>
              <div style={{fontSize:11,fontWeight:"600",color:t.textMuted}}>{m.symbole}</div>
              <div style={{fontSize:11,color:c}}>{m.nature} · {m.element}</div>
            </div>
            {act&&<div style={{fontSize:11,color:t.deepBlue,background:t.accent,borderRadius:20,padding:"2px 6px",whiteSpace:"nowrap"}}>☽</div>}
          </div>
        );
      })}
      {filtered.length===0&&<div style={{textAlign:"center",padding:"30px",color:t.textMuted,fontSize:13,fontWeight:"bold"}}>Aucun résultat pour "{search}"</div>}
    </div>
  );
}

function SettingsView({t}){
  return(
    <div>
      <h3 style={{color:t.accent,fontSize:13,letterSpacing:2,marginBottom:14,fontWeight:"bold"}}>⚙️ Paramètres</h3>
      <NotifManager t={t}/>
      <div style={{background:t.cardBg,border:`1px solid ${t.accent}33`,borderRadius:14,padding:"14px"}}>
        <div style={{fontSize:13,fontWeight:"bold",color:t.accentSoft,marginBottom:8}}>📖 À propos</div>
        <div style={{fontSize:12,fontWeight:"600",color:t.textMuted,lineHeight:1.7}}>
          Application Sen-Astro sur les Manāzil al-Qamar — Les 28 Stations Lunaires.<br/>
          Calculs astronomiques : algorithme de Jean Meeus.<br/>
          Tradition islamique : Ibn Ajiba, Al-Buni.<br/>
          Système sidéral : Ayanamsa Lahiri.<br/><br/>
          🌐 manazil-senastro.com<br/>
          📚 Livre disponible sur WhatsApp +221 76 426 55 50
        </div>
      </div>
    </div>
  );
}

function FullBookAd({t}){
  return(
    <div style={{background:"linear-gradient(135deg,#1a0a00,#2d1500,#1a0a00)",border:"2px solid #C9A84C",borderRadius:16,padding:16,marginBottom:12}}>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
        <span style={{fontSize:12,background:"#C9A84C",color:"#1a0a00",borderRadius:20,padding:"2px 8px",fontWeight:"bold"}}>📚 NOUVEAU LIVRE</span>
      </div>
      <div style={{textAlign:"center",marginBottom:12}}>
        <div style={{fontSize:18,color:"#e8c97a",fontWeight:"bold",letterSpacing:2,marginBottom:2}}>LES MANÂZIL AL-QAMAR</div>
        <div style={{fontSize:13,color:"#C9A84C88",direction:"rtl",marginBottom:8}}>مَنَازِل القَمَر</div>
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          {[["🇫🇷","FRANÇAIS"],["🌍","WOLOF"]].map(([f,lb])=>(
            <div key={lb} style={{flex:1,background:"#ffffff11",border:"1px solid #C9A84C44",borderRadius:10,padding:"8px"}}>
              <div style={{fontSize:16,marginBottom:3}}>{f}</div>
              <div style={{fontSize:12,color:"#C9A84C",fontWeight:"bold",marginBottom:4}}>{lb}</div>
              <div style={{fontSize:13,color:"#e8c97a",fontWeight:"bold",marginBottom:3}}>15.000 F</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                <div style={{fontSize:13,color:"#e8c97a",fontWeight:"bold"}}>6.900 F</div>
                <div style={{fontSize:11,background:"#2ecc71",color:"white",borderRadius:10,padding:"1px 5px"}}>-50%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <a href="https://wa.me/221764265550" target="_blank" rel="noopener noreferrer"
        style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"#25D366",borderRadius:10,padding:"11px",textDecoration:"none",color:"white",fontSize:13,fontWeight:"bold"}}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Commander · +221 76 426 55 50
      </a>
    </div>
  );
}
