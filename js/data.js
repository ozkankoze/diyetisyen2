/* Yaklaşık değerler: ortalama porsiyon, kcal, protein (p), karbonhidrat (c), yağ (f) gram */
window.FOODS = [
  // Kahvaltı
  {id:'yumurta', n:'Haşlanmış yumurta', s:'1 adet', k:78, p:6.3, c:0.6, f:5.3, cat:'kahvalti'},
  {id:'menemen', n:'Menemen', s:'1 porsiyon', k:220, p:11, c:9, f:15, cat:'kahvalti'},
  {id:'peynir', n:'Beyaz peynir', s:'30 g · 1 dilim', k:80, p:5, c:0.5, f:6.5, cat:'kahvalti'},
  {id:'kasar', n:'Kaşar peyniri', s:'30 g', k:110, p:7.5, c:0.4, f:8.8, cat:'kahvalti'},
  {id:'zeytin', n:'Zeytin', s:'5 adet', k:45, p:0.3, c:1, f:4.5, cat:'kahvalti'},
  {id:'ekmek', n:'Tam buğday ekmeği', s:'1 dilim', k:75, p:3.5, c:13, f:1, cat:'kahvalti'},
  {id:'simit', n:'Simit', s:'1 adet', k:280, p:9, c:52, f:4.5, cat:'kahvalti'},
  {id:'yulaf', n:'Sütlü yulaf', s:'1 kase', k:250, p:11, c:38, f:6, cat:'kahvalti'},
  {id:'domsal', n:'Domates-salatalık', s:'1 tabak', k:30, p:1.5, c:6, f:0.3, cat:'kahvalti'},
  {id:'bal', n:'Bal', s:'1 tatlı kaşığı', k:30, p:0, c:8, f:0, cat:'kahvalti'},
  {id:'ceviz', n:'Ceviz', s:'2 tam', k:105, p:2.4, c:2.2, f:10.4, cat:'kahvalti'},
  // Ana yemek
  {id:'tavuk', n:'Izgara tavuk göğsü', s:'120 g', k:198, p:37, c:0, f:4.3, cat:'ana'},
  {id:'kofte', n:'Izgara köfte', s:'4 adet · 100 g', k:250, p:18, c:6, f:17, cat:'ana'},
  {id:'somon', n:'Izgara somon', s:'120 g', k:250, p:25, c:0, f:16, cat:'ana'},
  {id:'kurufas', n:'Kuru fasulye', s:'1 porsiyon', k:260, p:14, c:35, f:7, cat:'ana'},
  {id:'mercimek', n:'Mercimek çorbası', s:'1 kase', k:150, p:8, c:22, f:3.5, cat:'ana'},
  {id:'tazefas', n:'Zeytinyağlı taze fasulye', s:'1 porsiyon', k:140, p:3, c:13, f:9, cat:'ana'},
  {id:'karniyarik', n:'Karnıyarık', s:'1 porsiyon', k:330, p:12, c:20, f:23, cat:'ana'},
  {id:'lahmacun', n:'Lahmacun', s:'1 adet', k:280, p:12, c:38, f:9, cat:'ana'},
  {id:'manti', n:'Mantı', s:'1 porsiyon', k:500, p:22, c:60, f:19, cat:'ana'},
  {id:'tavukdurum', n:'Tavuk dürüm', s:'1 adet', k:550, p:30, c:55, f:22, cat:'ana'},
  // Yan
  {id:'bulgur', n:'Bulgur pilavı', s:'1 porsiyon · 150 g', k:200, p:6, c:38, f:3.5, cat:'yan'},
  {id:'pilav', n:'Pirinç pilavı', s:'1 porsiyon · 150 g', k:250, p:4.5, c:45, f:5.5, cat:'yan'},
  {id:'salata', n:'Mevsim salata', s:'1 kase, zeytinyağlı', k:90, p:1.5, c:6, f:7, cat:'yan'},
  {id:'cacik', n:'Cacık', s:'1 kase', k:80, p:4, c:5, f:4.5, cat:'yan'},
  {id:'yogurt', n:'Yoğurt', s:'1 kase · 150 g', k:95, p:5, c:7, f:5, cat:'yan'},
  {id:'ayran', n:'Ayran', s:'1 bardak · 200 ml', k:75, p:4, c:6, f:4, cat:'yan'},
  // Ara öğün & tatlı
  {id:'elma', n:'Elma', s:'1 orta boy', k:80, p:0.4, c:21, f:0.3, cat:'ara'},
  {id:'muz', n:'Muz', s:'1 orta boy', k:105, p:1.3, c:27, f:0.4, cat:'ara'},
  {id:'badem', n:'Çiğ badem', s:'10 adet', k:70, p:2.6, c:2.5, f:6, cat:'ara'},
  {id:'kefir', n:'Kefir', s:'1 bardak', k:110, p:6.5, c:9, f:5, cat:'ara'},
  {id:'baklava', n:'Baklava', s:'1 dilim', k:165, p:2.5, c:18, f:9.5, cat:'ara'},
  {id:'sutlac', n:'Sütlaç', s:'1 kase', k:230, p:6, c:38, f:6, cat:'ara'},
  {id:'kola', n:'Kola', s:'1 kutu · 330 ml', k:140, p:0, c:35, f:0, cat:'ara'},
  {id:'kahve', n:'Türk kahvesi', s:'1 fincan, şekersiz', k:5, p:0.2, c:0.7, f:0.1, cat:'ara'},
  {id:'latte', n:'Latte', s:'Büyük boy', k:220, p:12, c:18, f:11, cat:'ara'}
];

window.CATS = [
  {id:'all', n:'Tümü'},
  {id:'kahvalti', n:'Kahvaltı'},
  {id:'ana', n:'Ana yemek'},
  {id:'yan', n:'Yanına'},
  {id:'ara', n:'Ara öğün & tatlı'}
];

window.MEALS = [
  {id:'kahvalti', n:'Kahvaltı', share:0.25, lbl:'Kahvaltı hedefi'},
  {id:'ogle', n:'Öğle', share:0.35, lbl:'Öğle yemeği hedefi'},
  {id:'aksam', n:'Akşam', share:0.30, lbl:'Akşam yemeği hedefi'},
  {id:'ara', n:'Ara', share:0.10, lbl:'Ara öğün hedefi'}
];

/* Enerji kartları */
window.ENERGY = [
  {n:'Simit', s:'1 adet', k:280},
  {n:'Lahmacun', s:'1 adet', k:280},
  {n:'Baklava', s:'2 dilim', k:330},
  {n:'Tavuk dürüm', s:'1 adet', k:550},
  {n:'Mantı', s:'1 porsiyon', k:500},
  {n:'Künefe', s:'1 porsiyon', k:590},
  {n:'Kola', s:'1 kutu · 330 ml', k:140},
  {n:'Latte', s:'Büyük boy', k:220},
  {n:'Sütlaç', s:'1 kase', k:230}
];

/* MET değerleri (Compendium of Physical Activities ortalamaları) */
window.ACTS = [
  {id:'yuruyus', n:'Tempolu yürüyüş', met:4.3, verb:'tempolu yürüyüş'},
  {id:'bisiklet', n:'Bisiklet', met:6.8, verb:'orta tempo bisiklet'},
  {id:'kosu', n:'Koşu', met:8.3, verb:'hafif tempo koşu'},
  {id:'yuzme', n:'Yüzme', met:5.8, verb:'yüzme'}
];
