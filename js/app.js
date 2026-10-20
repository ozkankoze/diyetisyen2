(function(){
'use strict';
var WA = '905060409511';
var $ = function(s, r){ return (r||document).querySelector(s); };
var $$ = function(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };
var fmt = function(n, d){ return Number(n).toLocaleString('tr-TR', {minimumFractionDigits:d||0, maximumFractionDigits:d||0}); };
var esc = function(s){ return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
var CHECK = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1A1408" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>';

function openWA(text){ window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(text), '_blank', 'noopener'); }
var toastT;
function toast(msg){ var t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function(){ t.classList.remove('on'); }, 2400); }

/* ---- profil (tarayıcıda saklanır) ---- */
var PROFILE = null;
try { PROFILE = JSON.parse(localStorage.getItem('dy-profil') || 'null'); } catch(e) { PROFILE = null; }
function saveProfile(p){ PROFILE = p; try { localStorage.setItem('dy-profil', JSON.stringify(p)); } catch(e) {} }

/* ---------------- genel ---------------- */
window.addEventListener('load', function(){ document.documentElement.classList.add('loaded'); });
setTimeout(function(){ document.documentElement.classList.add('loaded'); }, 1200);
$('#yil').textContent = new Date().getFullYear();

var hdr = $('#hdr');
function onScroll(){ hdr.classList.toggle('solid', window.scrollY > 40); }
window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

var burger = $('#burger'), menu = $('#menu');
burger.addEventListener('click', function(){ var o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
$$('a', menu).forEach(function(a){ a.addEventListener('click', function(){ menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); }); });

$$('[data-wa]').forEach(function(a){ a.addEventListener('click', function(e){ e.preventDefault(); openWA(a.getAttribute('data-wa')); }); });

// sayaçlar
var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function countUp(el, to, dur){
  if (reduce) { el.textContent = fmt(to); return; }
  var t0 = null;
  function step(t){ if (!t0) t0 = t; var k = Math.min(1, (t - t0) / dur); el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(step); }
  requestAnimationFrame(step);
}
setTimeout(function(){ $$('[data-count]').forEach(function(el){ countUp(el, +el.getAttribute('data-count'), 1400); }); }, 700);

// kaydırınca beliren
var rvs = $$('.rv');
if ('IntersectionObserver' in window && !reduce) {
  var io = new IntersectionObserver(function(es){ es.forEach(function(x){ if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
  rvs.forEach(function(el){ io.observe(el); });
} else rvs.forEach(function(el){ el.classList.add('in'); });

// rehber formu
$('#gform').addEventListener('submit', function(e){
  e.preventDefault();
  var ad = $('#gAd').value.trim(), mail = $('#gMail').value.trim();
  if (!ad || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) { toast('Lütfen adını ve geçerli bir e-posta gir.'); return; }
  openWA('Merhaba, 7 günlük dengeli menü rehberini almak istiyorum.\nAd: ' + ad + '\nE-posta: ' + mail);
  $('#gOk').style.display = 'block';
});

/* ---------------- TABAK KURUCU ---------------- */
var plate = {}; // id -> adet
var order = [];
var cat = 'all', meal = 'ogle', query = '';
var byId = {}; FOODS.forEach(function(f){ byId[f.id] = f; });

function dailyTarget(){ return PROFILE && PROFILE.kcal ? PROFILE.kcal : 2000; }
function dailyMacros(){
  if (PROFILE && PROFILE.p) return {p:PROFILE.p, c:PROFILE.c, f:PROFILE.f};
  var k = dailyTarget(); return {p:Math.round(k*.2/4), f:Math.round(k*.28/9), c:Math.round(k*.52/4)};
}
function mealShare(){ for (var i=0;i<MEALS.length;i++) if (MEALS[i].id === meal) return MEALS[i]; return MEALS[1]; }

function renderCats(){
  $('#cats').innerHTML = CATS.map(function(c){ return '<button type="button" data-cat="'+c.id+'" aria-pressed="'+(c.id===cat)+'">'+c.n+'</button>'; }).join('');
}
$('#cats').addEventListener('click', function(e){ var b = e.target.closest('button'); if (!b) return; cat = b.getAttribute('data-cat'); renderCats(); renderFoods(); });

function norm(s){ return s.toLocaleLowerCase('tr-TR').replace(/ı/g,'i').replace(/ş/g,'s').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ö/g,'o').replace(/ç/g,'c'); }
function renderFoods(){
  var q = norm(query);
  var list = FOODS.filter(function(f){ return (cat === 'all' || f.cat === cat) && (!q || norm(f.n).indexOf(q) > -1); });
  $('#foods').innerHTML = list.length ? list.map(function(f){
    return '<div role="listitem"><button type="button" class="food" draggable="true" data-id="'+f.id+'" aria-label="'+esc(f.n)+' ekle, '+f.k+' kalori">'+
      '<span class="fi"><b>'+esc(f.n)+'</b><small>'+esc(f.s)+'</small></span><span class="kc">'+f.k+' kcal</span>'+
      '<span class="add" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></span></button></div>';
  }).join('') : '<p style="color:var(--ink-m);padding:16px 10px">Bu aramaya uygun yiyecek bulunamadı.</p>';
}
$('#fsearch').addEventListener('input', function(){ query = this.value; renderFoods(); });
$('#foods').addEventListener('click', function(e){
  var b = e.target.closest('.food'); if (!b) return;
  addFood(b.getAttribute('data-id'));
  b.classList.remove('flash'); void b.offsetWidth; b.classList.add('flash');
});
$('#foods').addEventListener('dragstart', function(e){ var b = e.target.closest('.food'); if (b) { e.dataTransfer.setData('text/plain', b.getAttribute('data-id')); e.dataTransfer.effectAllowed = 'copy'; } });
var plateEl = $('#plate');
['dragenter','dragover'].forEach(function(ev){ plateEl.parentNode.addEventListener(ev, function(e){ e.preventDefault(); plateEl.classList.add('drop'); }); });
['dragleave','drop'].forEach(function(ev){ plateEl.parentNode.addEventListener(ev, function(){ plateEl.classList.remove('drop'); }); });
plateEl.parentNode.addEventListener('drop', function(e){ e.preventDefault(); var id = e.dataTransfer.getData('text/plain'); if (byId[id]) addFood(id); });

function addFood(id){ if (!plate[id]) { plate[id] = 0; order.push(id); } plate[id]++; renderPlate(); }
function removeFood(id){ if (!plate[id]) return; plate[id]--; if (!plate[id]) { delete plate[id]; order.splice(order.indexOf(id), 1); } renderPlate(); }

function renderMeals(){
  $('#meals').innerHTML = MEALS.map(function(m){ return '<button type="button" data-meal="'+m.id+'" aria-pressed="'+(m.id===meal)+'">'+m.n+'</button>'; }).join('');
}
$('#meals').addEventListener('click', function(e){ var b = e.target.closest('button'); if (!b) return; meal = b.getAttribute('data-meal'); renderMeals(); renderPlate(); });

function totals(){
  var t = {k:0,p:0,c:0,f:0};
  order.forEach(function(id){ var f = byId[id], n = plate[id]; t.k += f.k*n; t.p += f.p*n; t.c += f.c*n; t.f += f.f*n; });
  return t;
}
function renderPlate(){
  var t = totals(), m = mealShare(), tgt = Math.round(dailyTarget() * m.share / 10) * 10;
  var dm = dailyMacros(), mt = {p:dm.p*m.share, c:dm.c*m.share, f:dm.f*m.share};
  var pct = tgt ? t.k / tgt : 0;
  $('#mealLbl').textContent = m.lbl + ' · ' + fmt(tgt) + ' kcal';
  $('#pKcal').textContent = fmt(Math.round(t.k));
  $('#pTarget').textContent = '/ ' + fmt(tgt) + ' kcal';
  $('#pPct').textContent = '%' + Math.round(pct*100) + ' hedef';
  var ring = $('#ringFill');
  ring.style.strokeDashoffset = 295.3 * (1 - Math.min(pct, 1));
  ring.style.stroke = pct > 1.15 ? '#E8977A' : '#D9B26F';
  $('#mP').innerHTML = Math.round(t.p) + '<i>g</i>'; $('#bP').style.width = Math.min(100, t.p/mt.p*100) + '%';
  $('#mC').innerHTML = Math.round(t.c) + '<i>g</i>'; $('#bC').style.width = Math.min(100, t.c/mt.c*100) + '%';
  $('#mF').innerHTML = Math.round(t.f) + '<i>g</i>'; $('#bF').style.width = Math.min(100, t.f/mt.f*100) + '%';
  // çipler
  var chips = $('#chips'), max = 10, shown = order.slice(0, max), extra = order.length - shown.length;
  var n = Math.max(6, shown.length + (extra > 0 ? 1 : 0));
  var html = shown.map(function(id, i){
    var a = (i / n) * Math.PI * 2 - Math.PI/2, x = 50 + Math.cos(a) * 33, y = 50 + Math.sin(a) * 33;
    var f = byId[id];
    return '<button type="button" class="chip" style="left:'+x.toFixed(2)+'%;top:'+y.toFixed(2)+'%" data-rm="'+id+'" aria-label="'+esc(f.n)+' çıkar">'+esc(f.n)+(plate[id] > 1 ? ' ×' + plate[id] : '')+'</button>';
  }).join('');
  if (extra > 0) { var a2 = (shown.length / n) * Math.PI * 2 - Math.PI/2; html += '<span class="chip" style="left:'+(50+Math.cos(a2)*33).toFixed(2)+'%;top:'+(50+Math.sin(a2)*33).toFixed(2)+'%;cursor:default">+' + extra + '</span>'; }
  chips.innerHTML = html;
  $('#emptyHint').style.display = order.length ? 'none' : 'block';
  // öneriler
  var tips = [];
  if (!order.length) tips.push(['#B5AC9C', 'Bir yiyeceğe dokunarak tabağını kurmaya başla. Tabaktaki bir yiyeceğe dokunursan çıkarılır.']);
  else {
    var veg = ['salata','domsal','tazefas','cacik'].some(function(id){ return plate[id]; });
    var pr = t.k ? t.p*4/t.k : 0, fr = t.k ? t.f*9/t.k : 0;
    if (pct > 1.15) tips.push(['#E8977A', 'Tabak öğün hedefinin %' + Math.round((pct-1)*100) + ' üzerinde. Porsiyonu küçültmek ya da bir kalemi ara öğüne taşımak dengeyi sağlar.']);
    else if (pct < 0.6 && meal !== 'ara') tips.push(['#D9B26F', 'Tabak hedefe göre hafif kaldı. Bir protein kaynağı veya tam tahıl ekleyerek tok kalma süreni uzatabilirsin.']);
    if (pr < 0.15 && meal !== 'ara') tips.push(['#D9B26F', 'Protein düşük görünüyor: yoğurt, yumurta, tavuk, balık ya da baklagil ekleyebilirsin.']);
    if (!veg && (meal === 'ogle' || meal === 'aksam')) tips.push(['#D9B26F', 'Sebze yok. Bir kase salata tabağın hacmini artırır, kalorisini çok az etkiler.']);
    if (fr > 0.42) tips.push(['#E8977A', 'Yağ oranı yüksek. Kızartma yerine ızgara veya fırın seçenekleri işini kolaylaştırır.']);
    if (!tips.length) tips.push(['#9DBB92', 'Dengeli bir tabak: hedefe yakın, protein ve sebze yerinde.']);
  }
  $('#pTips').innerHTML = tips.slice(0, 3).map(function(x){ return '<div class="tip"><i style="background:'+x[0]+'"></i><span>'+x[1]+'</span></div>'; }).join('');
  var note = $('#targetNote');
  note.innerHTML = PROFILE && PROFILE.kcal
    ? 'Hedefin, kişisel analizine göre günlük <b style="color:#F4EEE3">' + fmt(PROFILE.kcal) + ' kcal</b>. <a href="#" data-open-wiz>Analizi yenile</a>'
    : 'Hedef, ortalama 2.000 kcal\'lik günlük ihtiyaca göre. Kendi hedefin için <a href="#" data-open-wiz>analizini yap</a>.';
}
$('#chips').addEventListener('click', function(e){ var b = e.target.closest('[data-rm]'); if (b) removeFood(b.getAttribute('data-rm')); });
$('#plateReset').addEventListener('click', function(){ plate = {}; order = []; renderPlate(); });
$('#plateSend').addEventListener('click', function(){
  if (!order.length) { toast('Önce tabağına birkaç yiyecek ekle.'); return; }
  var t = totals(), m = mealShare();
  var lines = order.map(function(id){ return '• ' + byId[id].n + (plate[id] > 1 ? ' ×' + plate[id] : ''); }).join('\n');
  openWA('Merhaba, Tabak Kurucu\'da bir ' + m.n.toLocaleLowerCase('tr-TR') + ' tabağı hazırladım:\n' + lines + '\nToplam: yaklaşık ' + fmt(Math.round(t.k)) + ' kcal (P ' + Math.round(t.p) + 'g · K ' + Math.round(t.c) + 'g · Y ' + Math.round(t.f) + 'g)\nBu tabak hakkında ne düşünürsünüz?');
});
renderCats(); renderFoods(); renderMeals(); renderPlate();

/* ---------------- ENERJİ KARTLARI ---------------- */
var act = ACTS[0].id, ecW = $('#ecW');
if (PROFILE && PROFILE.w) ecW.value = Math.max(40, Math.min(150, Math.round(PROFILE.w)));
function renderActs(){ $('#acts').innerHTML = ACTS.map(function(a){ return '<button type="button" data-act="'+a.id+'" aria-pressed="'+(a.id===act)+'">'+a.n+'</button>'; }).join(''); }
$('#acts').addEventListener('click', function(e){ var b = e.target.closest('button'); if (!b) return; act = b.getAttribute('data-act'); renderActs(); renderCards(); });
function curAct(){ for (var i=0;i<ACTS.length;i++) if (ACTS[i].id === act) return ACTS[i]; return ACTS[0]; }
function mins(k, w, met){ return Math.max(1, Math.round(k / (met * 3.5 * w / 200))); }
function renderCards(){
  var w = +ecW.value, a = curAct();
  $('#ecWv').textContent = w + ' kg';
  var mx = 0; ENERGY.forEach(function(x){ mx = Math.max(mx, mins(x.k, w, a.met)); });
  $('#ecards').innerHTML = ENERGY.map(function(x, i){
    var m = mins(x.k, w, a.met);
    return '<article class="ecard"><div class="top"><div><h3>'+esc(x.n)+'</h3><div class="por">'+esc(x.s)+'</div></div><span class="kcal">≈ '+x.k+' kcal</span></div>'+
      '<div class="big"><b>'+m+'</b><span>dakika</span></div><div class="act">'+a.verb.charAt(0).toLocaleUpperCase('tr-TR')+a.verb.slice(1)+'</div>'+
      '<div class="meter" aria-hidden="true"><i style="width:'+(m/mx*100).toFixed(1)+'%"></i></div>'+
      '<button type="button" class="share" data-i="'+i+'"><svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v14"/></svg>Paylaş</button></article>';
  }).join('');
}
ecW.addEventListener('input', renderCards);
$('#ecards').addEventListener('click', function(e){
  var b = e.target.closest('.share'); if (!b) return;
  var x = ENERGY[+b.getAttribute('data-i')], w = +ecW.value, a = curAct();
  var txt = x.s + ' ' + x.n + ' (≈' + x.k + ' kcal) ≈ ' + mins(x.k, w, a.met) + ' dakika ' + a.verb + '. Kendi kartlarını hesapla:';
  var url = 'https://diyetisyen2.medya333.com/#enerji';
  if (navigator.share) { navigator.share({title:'Enerji Kartları', text:txt, url:url}).catch(function(){}); }
  else if (navigator.clipboard) { navigator.clipboard.writeText(txt + ' ' + url).then(function(){ toast('Panoya kopyalandı'); }, function(){ toast(txt); }); }
  else toast(txt);
});
renderActs(); renderCards();

/* ---------------- KİŞİSEL ANALİZ ---------------- */
var A = {goal:null, sex:null, age:32, h:165, w:72, tw:null, act:null, sleep:null, habits:[], stress:null};
if (PROFILE && PROFILE.answers) { try { A = Object.assign(A, PROFILE.answers); } catch(e) {} }
var wiz = $('#wiz'), body = $('#wizBody'), nextBtn = $('#wizNext'), foot = $('#wizFoot');
var idx = 0, lastFocus = null, thanked = false, adv = false;

var GOALS = [
  {v:'ver', b:'Kilo vermek', s:'Sağlıklı ve kalıcı şekilde'},
  {v:'koru', b:'Kilomu korumak', s:'Dengede kalmak istiyorum'},
  {v:'al', b:'Kilo almak / kas kazanmak', s:'Kontrollü ve sağlıklı şekilde'},
  {v:'saglik', b:'Daha sağlıklı beslenmek', s:'Kilo değil, kalite odaklı'}
];
var ACTL = [
  {v:1.2, b:'Hareketsiz', s:'Masa başı iş, egzersiz yok'},
  {v:1.375, b:'Hafif hareketli', s:'Haftada 1–3 gün hafif egzersiz'},
  {v:1.55, b:'Orta hareketli', s:'Haftada 3–5 gün egzersiz'},
  {v:1.725, b:'Çok hareketli', s:'Haftada 6–7 gün yoğun egzersiz'},
  {v:1.9, b:'Sporcu', s:'Günde iki antrenman veya fiziksel iş'}
];
var SLEEP = [{v:'5', b:'5 saatten az'},{v:'6', b:'5–6 saat'},{v:'8', b:'7–8 saat'},{v:'9', b:'9 saatten fazla'}];
var HABITS = [
  {v:'atla', b:'Öğün atlıyorum'},
  {v:'gece', b:'Akşamları atıştırıyorum'},
  {v:'seker', b:'Şekerli içecek tüketiyorum'},
  {v:'disari', b:'Sık sık dışarıda yiyorum'},
  {v:'hizli', b:'Çok hızlı yiyorum'},
  {v:'su', b:'Az su içiyorum'},
  {v:'yok', b:'Hiçbiri'}
];
var STRESS = [{v:1, b:'Genelde sakinim'},{v:2, b:'Ara sıra stresliyim'},{v:3, b:'Sık sık stres altındayım'}];

function bmiOf(w, h){ return w / Math.pow(h/100, 2); }
function opt(v, b, s, sel, multi){
  return '<button type="button" class="opt'+(multi?' multi':'')+'" data-v="'+v+'" aria-pressed="'+(!!sel)+'"><span class="ck">'+(sel?CHECK:'')+'</span><span><b>'+b+'</b>'+(s?'<small>'+s+'</small>':'')+'</span></button>';
}

var STEPS = [
  {id:'goal', t:'Hedefin ne?', why:'Planını ve hesaplamaları buna göre şekillendireceğiz.',
   html:function(){ return '<div class="opts">'+GOALS.map(function(g){ return opt(g.v, g.b, g.s, A.goal===g.v); }).join('')+'</div>'; },
   single:'goal', ok:function(){ return !!A.goal; }},
  {id:'sex', t:'Cinsiyetin?', why:'Metabolizma formülü kadın ve erkek için farklı katsayılarla hesaplanır.',
   html:function(){ return '<div class="opts">'+opt('k','Kadın','',A.sex==='k')+opt('e','Erkek','',A.sex==='e')+'</div>'; },
   single:'sex', ok:function(){ return !!A.sex; }},
  {id:'age', t:'Kaç yaşındasın?', why:'Metabolizma hızı yaşla birlikte değişir. Analiz 18 yaş ve üzeri için geçerlidir; daha gençsen ailenle birlikte bir diyetisyene danışmanı öneririz.',
   html:function(){ return '<div class="bigval"><b id="vAge">'+A.age+'</b><span>yaş</span></div><label class="sr" for="rAge">Yaş</label><input type="range" id="rAge" min="18" max="80" value="'+A.age+'"><div class="rng-scale"><span>18</span><span>80</span></div><div class="stepper"><button type="button" data-d="-1" aria-label="Bir yaş azalt">−</button><button type="button" data-d="1" aria-label="Bir yaş artır">+</button></div>'; },
   bind:function(){ var r = $('#rAge'); function u(v){ A.age = Math.max(18, Math.min(80, v)); r.value = A.age; $('#vAge').textContent = A.age; } r.addEventListener('input', function(){ u(+r.value); }); $$('.stepper button', body).forEach(function(b){ b.addEventListener('click', function(){ u(A.age + (+b.getAttribute('data-d'))); }); }); },
   ok:function(){ return true; }},
  {id:'hw', t:'Boyun ve kilon?', why:'Bu bilgiler yalnızca tarayıcında hesaplama için kullanılır, hiçbir yere gönderilmez.',
   html:function(){ return '<div class="two"><div><div class="bigval"><b id="vH">'+A.h+'</b><span>cm</span></div><label class="sr" for="rH">Boy</label><input type="range" id="rH" min="140" max="210" value="'+A.h+'"><div class="rng-scale"><span>140 cm</span><span>210 cm</span></div></div>'+
     '<div><div class="bigval"><b id="vW">'+A.w+'</b><span>kg</span></div><label class="sr" for="rW">Kilo</label><input type="range" id="rW" min="40" max="180" value="'+A.w+'"><div class="rng-scale"><span>40 kg</span><span>180 kg</span></div></div></div>'+
     '<div class="wiz-msg" id="hwMsg">Paylaştığın için teşekkürler. Bu bir yargı değil, sadece bir başlangıç noktası.</div>'; },
   bind:function(){
     var rh = $('#rH'), rw = $('#rW');
     rh.addEventListener('input', function(){ A.h = +rh.value; $('#vH').textContent = A.h; });
     rw.addEventListener('input', function(){ A.w = +rw.value; $('#vW').textContent = A.w; if (!thanked) { thanked = true; $('#hwMsg').classList.add('on'); } });
     if (thanked) $('#hwMsg').classList.add('on');
   }, ok:function(){ return true; }},
  {id:'tw', t:'Hedef kilon?', cond:function(){ return A.goal === 'ver' || A.goal === 'al'; },
   why:'Sağlıklı aralığın dışına çıkmayan bir hedef belirleyelim.',
   html:function(){
     var lo, hi, minHealthy = Math.ceil(18.5 * Math.pow(A.h/100, 2));
     if (A.goal === 'ver') { lo = minHealthy; hi = A.w - 1; }
     else { lo = A.w + 1; hi = A.w + 20; }
     if (hi < lo) return '<div class="wiz-msg warn on">Mevcut kilon sağlıklı aralığın alt sınırına yakın, bu yüzden kilo vermeyi önermiyoruz. Analizine "kilomu korumak" hedefiyle devam edeceğiz; daha iyi hissetmek için birlikte dengeli bir plan kurabiliriz.</div>';
     if (A.tw == null || A.tw < lo || A.tw > hi) A.tw = A.goal === 'ver' ? Math.max(lo, Math.round(A.w - Math.min(10, A.w*0.08))) : Math.min(hi, A.w + 5);
     return '<div class="bigval"><b id="vT">'+A.tw+'</b><span>kg</span></div><label class="sr" for="rT">Hedef kilo</label><input type="range" id="rT" min="'+lo+'" max="'+hi+'" value="'+A.tw+'"><div class="rng-scale"><span>'+lo+' kg</span><span>'+hi+' kg</span></div><div class="wiz-msg on" id="twMsg"></div>';
   },
   bind:function(){
     var r = $('#rT'); if (!r) { A.noLose = true; A.tw = null; return; }
     A.noLose = false;
     function u(){ A.tw = +r.value; $('#vT').textContent = A.tw; var d = Math.abs(A.w - A.tw); $('#twMsg').textContent = (A.goal==='ver' ? 'Toplam ' + d + ' kg vermek' : 'Toplam ' + d + ' kg almak') + ' · hedef vücut kitle indeksin ' + fmt(bmiOf(A.tw, A.h), 1) + '.'; }
     r.addEventListener('input', u); u();
   }, ok:function(){ return true; }},
  {id:'act', t:'Ne kadar hareketlisin?', why:'Günlük enerji harcamanın en büyük belirleyicisi bu.',
   html:function(){ return '<div class="opts" style="grid-template-columns:1fr">'+ACTL.map(function(a){ return opt(a.v, a.b, a.s, A.act===a.v); }).join('')+'</div>'; },
   single:'act', num:true, ok:function(){ return !!A.act; }},
  {id:'sleep', t:'Genelde kaç saat uyuyorsun?', why:'Uyku süresi açlık ve tokluk hormonlarını doğrudan etkiler.',
   html:function(){ return '<div class="opts">'+SLEEP.map(function(s){ return opt(s.v, s.b, '', A.sleep===s.v); }).join('')+'</div>'; },
   single:'sleep', ok:function(){ return !!A.sleep; }},
  {id:'habits', t:'Hangileri sana uyuyor?', why:'Birden fazla seçebilirsin. Raporundaki önerileri buna göre hazırlayacağız.',
   html:function(){ return '<div class="opts">'+HABITS.map(function(h){ return opt(h.v, h.b, '', A.habits.indexOf(h.v) > -1, true); }).join('')+'</div>'; },
   multi:true, ok:function(){ return A.habits.length > 0; }},
  {id:'stress', t:'Stres seviyen nasıl?', why:'Son bir soru. Stres, yeme alışkanlıklarını sandığımızdan çok etkiler.',
   html:function(){ return '<div class="opts">'+STRESS.map(function(s){ return opt(s.v, s.b, '', A.stress===s.v); }).join('')+'</div>'; },
   single:'stress', num:true, ok:function(){ return !!A.stress; }}
];
function active(){ return STEPS.filter(function(s){ return !s.cond || s.cond(); }); }

function openWiz(){
  lastFocus = document.activeElement; idx = 0;
  wiz.classList.add('open'); document.body.classList.add('lock');
  renderStep(false);
}
function closeWiz(){
  wiz.classList.remove('open'); document.body.classList.remove('lock');
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}
document.addEventListener('click', function(e){ var t = e.target.closest('[data-open-wiz]'); if (t) { e.preventDefault(); openWiz(); } });
$('#wizClose').addEventListener('click', closeWiz);
document.addEventListener('keydown', function(e){
  if (!wiz.classList.contains('open')) return;
  if (e.key === 'Escape') closeWiz();
  if (e.key === 'Tab') { // odak tuzağı
    var f = $$('button:not([disabled]),input,a[href]', wiz).filter(function(x){ return x.offsetParent !== null; });
    if (!f.length) return; var first = f[0], last = f[f.length-1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

function renderStep(back){
  var st = active(), s = st[idx];
  $('#wizBack').hidden = idx === 0;
  $('#wizCount').textContent = 'Soru ' + (idx+1) + ' / ' + st.length;
  $('#wizBar').style.width = ((idx) / st.length * 100) + '%';
  foot.style.display = 'flex';
  body.innerHTML = '<div class="wiz-step'+(back?' back':'')+'"><div class="wiz-count">Adım '+(idx+1)+'</div><h2 id="wizTitle">'+s.t+'</h2><p class="why">'+s.why+'</p>'+s.html()+'</div>';
  body.scrollTop = 0;
  if (s.bind) s.bind();
  $$('.opt', body).forEach(function(b){
    b.addEventListener('click', function(){
      var v = b.getAttribute('data-v');
      if (s.multi) {
        if (v === 'yok') A.habits = A.habits.indexOf('yok') > -1 ? [] : ['yok'];
        else { A.habits = A.habits.filter(function(x){ return x !== 'yok'; }); var i = A.habits.indexOf(v); if (i > -1) A.habits.splice(i, 1); else A.habits.push(v); }
        $$('.opt', body).forEach(function(o){ var on = A.habits.indexOf(o.getAttribute('data-v')) > -1; o.setAttribute('aria-pressed', on); $('.ck', o).innerHTML = on ? CHECK : ''; });
        updNext();
      } else {
        A[s.single] = s.num ? +v : v;
        $$('.opt', body).forEach(function(o){ var on = o === b; o.setAttribute('aria-pressed', on); $('.ck', o).innerHTML = on ? CHECK : ''; });
        updNext();
        if (adv) return; adv = true;
        setTimeout(function(){ adv = false; next(); }, 280);
      }
    });
  });
  updNext();
  nextBtn.textContent = idx === st.length - 1 ? 'Raporumu hazırla' : 'Devam et';
  var h = $('#wizTitle'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({preventScroll:true}); }
}
function updNext(){ var s = active()[idx]; nextBtn.disabled = !s.ok(); }
function next(){
  var st = active(); if (!st[idx].ok()) return;
  if (idx < st.length - 1) { idx++; renderStep(false); }
  else runLoader();
}
nextBtn.addEventListener('click', next);
$('#wizBack').addEventListener('click', function(){ if (idx > 0) { idx--; renderStep(true); } });

function runLoader(){
  if (A.goal === 'ver' && A.noLose) { A.goal = 'koru'; A.tw = null; }
  if (A.goal === 'koru' || A.goal === 'saglik') A.tw = null;
  $('#wizBar').style.width = '100%';
  $('#wizBack').hidden = true; foot.style.display = 'none';
  $('#wizCount').textContent = 'Analiz ediliyor';
  var items = ['Bazal metabolizman hesaplanıyor', 'Günlük enerji ihtiyacın çıkarılıyor', 'Sana uygun tempo belirleniyor', 'Kişisel önerilerin hazırlanıyor'];
  body.innerHTML = '<div class="wload"><div class="spin"><svg viewBox="0 0 50 50" aria-hidden="true"><circle cx="25" cy="25" r="21" fill="none" stroke="rgba(244,238,227,.1)" stroke-width="3"/><path d="M25 4a21 21 0 0 1 21 21" fill="none" stroke="#D9B26F" stroke-width="3" stroke-linecap="round"/></svg></div><h2 id="wizTitle">Raporun hazırlanıyor</h2><ul>'+items.map(function(x){ return '<li><i>'+CHECK+'</i>'+x+'</li>'; }).join('')+'</ul></div>';
  var lis = $$('.wload li', body), k = 0, dt = reduce ? 120 : 650;
  var iv = setInterval(function(){ if (k < lis.length) { lis[k].classList.add('on'); k++; } else { clearInterval(iv); showReport(); } }, dt);
}

function calc(){
  var w = A.w, h = A.h, age = A.age, male = A.sex === 'e';
  var bmr = 10*w + 6.25*h - 5*age + (male ? 5 : -161);
  var tdee = bmr * A.act;
  var floor = Math.max(male ? 1500 : 1200, bmr);
  var target = tdee, rate = 0;
  if (A.goal === 'ver') { target = Math.max(tdee - 500, floor); rate = Math.min(1, (tdee - target) * 7 / 7700); }
  else if (A.goal === 'al') { target = tdee + 300; rate = 300 * 7 / 7700; }
  target = Math.round(target / 10) * 10;
  var bmi = bmiOf(w, h), ideal = 25 * Math.pow(h/100, 2);
  var refW = bmi > 27 ? ideal + 0.25 * (w - ideal) : w;
  var pf = A.goal === 'ver' ? 1.6 : A.goal === 'al' ? 1.8 : 1.2;
  var p = Math.round(refW * pf), f = Math.round(target * 0.28 / 9), c = Math.max(0, Math.round((target - p*4 - f*9) / 4));
  var water = w * 33 + (A.act >= 1.55 ? 400 : 0) + (A.act >= 1.725 ? 300 : 0);
  var weeks = (A.tw != null && rate > 0) ? Math.ceil(Math.abs(w - A.tw) / rate) : 0;
  return {bmr:Math.round(bmr), tdee:Math.round(tdee/10)*10, target:target, rate:rate, bmi:bmi, p:p, f:f, c:c, water:water, weeks:weeks};
}
function bmiCat(b){ return b < 18.5 ? 'zayıf aralıkta' : b < 25 ? 'normal aralıkta' : b < 30 ? 'fazla kilolu aralıkta' : 'obezite aralığında'; }
var AYLAR = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
function dateIn(weeks){ var d = new Date(); d.setDate(d.getDate() + weeks * 7); return d.getDate() + ' ' + AYLAR[d.getMonth()] + ' ' + d.getFullYear(); }

function chartSVG(R){
  var W = 640, H = 250, L = 44, Rr = 16, T = 20, B = 36;
  var w0 = A.w, w1 = A.tw, wk = R.weeks, lose = A.goal === 'ver';
  var yo = lose ? [[0,w0],[.22,w0-(w0-w1)*.62],[.42,w0-(w0-w1)*.35],[.6,w0-(w0-w1)*.7],[.82,w0-(w0-w1)*.15],[1,w0+(w0-w1)*.12]] : null;
  var lo = Math.min(w0, w1), hi = Math.max(w0, w1); if (yo) yo.forEach(function(q){ lo = Math.min(lo, q[1]); hi = Math.max(hi, q[1]); });
  var pad = Math.max(1, (hi - lo) * .12); lo -= pad; hi += pad;
  var X = function(t){ return L + t * (W - L - Rr); }, Y = function(v){ return T + (hi - v) / (hi - lo) * (H - T - B); };
  var pts = []; for (var i = 0; i <= 40; i++) { var t = i/40, fr = 1 - Math.pow(1 - t, 1.25); pts.push(X(t).toFixed(1) + ' ' + Y(w0 + (w1 - w0) * fr).toFixed(1)); }
  var grid = ''; for (var g = 0; g < 4; g++) { var v = lo + (hi - lo) * g / 3, y = Y(v); grid += '<path d="M'+L+' '+y.toFixed(1)+'H'+(W-Rr)+'" stroke="rgba(244,238,227,.08)"/><text x="'+(L-8)+'" y="'+(y+4).toFixed(1)+'" fill="#8C8475" font-size="11" text-anchor="end">'+Math.round(v)+'</text>'; }
  var yoPath = '';
  if (yo) { yoPath = 'M' + yo.map(function(q, i){ if (!i) return X(q[0]).toFixed(1)+' '+Y(q[1]).toFixed(1); var pq = yo[i-1], mx = (X(pq[0]) + X(q[0])) / 2; return 'C'+mx.toFixed(1)+' '+Y(pq[1]).toFixed(1)+' '+mx.toFixed(1)+' '+Y(q[1]).toFixed(1)+' '+X(q[0]).toFixed(1)+' '+Y(q[1]).toFixed(1); }).join(' '); }
  return '<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Tahmini ilerleme: '+w0+' kilodan '+w1+' kiloya yaklaşık '+wk+' haftada">'+grid+
    (yo ? '<path d="'+yoPath+'" fill="none" stroke="#E8977A" stroke-width="2" stroke-dasharray="5 6" opacity=".85"/>' : '')+
    '<path d="M'+pts.join(' L')+'" fill="none" stroke="#D9B26F" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>'+
    '<circle cx="'+X(0)+'" cy="'+Y(w0).toFixed(1)+'" r="5" fill="#F4EEE3"/><circle cx="'+X(1)+'" cy="'+Y(w1).toFixed(1)+'" r="7" fill="#D9B26F" stroke="#0F0E0C" stroke-width="3"/>'+
    '<text x="'+X(1)+'" y="'+(Y(w1)-14).toFixed(1)+'" fill="#F4EEE3" font-size="13" font-weight="700" text-anchor="end">'+w1+' kg</text>'+
    '<text x="'+L+'" y="'+(H-10)+'" fill="#8C8475" font-size="12">Bugün · '+w0+' kg</text><text x="'+(W-Rr)+'" y="'+(H-10)+'" fill="#8C8475" font-size="12" text-anchor="end">'+dateIn(wk)+'</text></svg>';
}

var TIPS = {
  atla:['Öğün düzeni','Gün içinde 3 ana öğün ve gerekirse 1 ara öğün, akşam aşırı acıkmanın önüne geçer. Kahvaltıyı atlamamak en kolay başlangıç.'],
  gece:['Akşam atıştırmaları','Akşam yemeğinde proteini ve sebzeyi artırmak, yatmadan 2–3 saat önce mutfağı "kapatmak" atıştırma isteğini azaltır.'],
  seker:['Şekerli içecekler','1 kutu kola yaklaşık 35 g şeker içerir. Limonlu maden suyu veya soğuk demlenmiş çay iyi bir alternatif.'],
  disari:['Dışarıda yemek','Izgara + salata + ayran üçlüsü neredeyse her restoranda var. Ekmeği tek dilimle sınırlamak büyük fark yaratır.'],
  hizli:['Yeme hızı','Tokluk sinyalinin beyne ulaşması yaklaşık 20 dakika sürer. Lokmalar arasında çatalı bırakmak basit ama etkili.'],
  su:['Su tüketimi','Her öğünle birlikte 2 bardak su içmek, günlük hedefinin yarısını kendiliğinden tamamlar.']
};
function reportTips(R){
  var out = [];
  A.habits.forEach(function(h){ if (TIPS[h]) out.push(TIPS[h]); });
  if (A.sleep === '5' || A.sleep === '6') out.push(['Uyku','6 saatten az uyku açlık hormonunu artırıp tokluk hormonunu azaltabiliyor. Uykuya 30 dakika eklemek beslenme planın kadar önemli.']);
  if (A.stress === 3) out.push(['Stres','Stres atıştırma isteğini tetikleyebilir. Gün içinde 10 dakikalık bir yürüyüş hem stresi hem iştahı dengeler.']);
  if (!out.length) out.push(['Harika bir temel','Alışkanlıkların güçlü görünüyor. Her öğünde bir protein kaynağı ve bol sebze ile bu temeli koruyabilirsin.']);
  return out.slice(0, 4);
}

var lastR = null;
function showReport(){
  var R = calc(); lastR = R;
  saveProfile({kcal:R.target, p:R.p, c:R.c, f:R.f, w:A.w, answers:A});
  $('#wizCount').textContent = 'Raporun hazır';
  var goalTxt = {ver:'kilo verme', koru:'kilo koruma', al:'kilo alma', saglik:'sağlıklı beslenme'}[A.goal];
  var cups = Math.round(R.water / 200), liters = R.water / 1000;
  var mtot = R.p*4 + R.c*4 + R.f*9;
  var hasChart = (A.goal === 'ver' || A.goal === 'al') && A.tw != null && R.weeks > 0;
  var mealsRows = MEALS.map(function(m){ return '<div class="mrow"><span class="lb">'+m.n+'</span><span class="bar"><i data-w="'+(m.share/0.35*100)+'" style="background:#D9B26F"></i></span><span class="v">'+fmt(Math.round(R.target*m.share/10)*10)+'</span></div>'; }).join('');
  var rateTxt = A.goal === 'ver' ? 'haftada yaklaşık ' + fmt(R.rate, 1) + ' kg' : 'haftada yaklaşık ' + fmt(R.rate, 2) + ' kg';
  var html = '<div class="rep">'+
    '<div class="rep-head"><div><p class="eyebrow" style="margin-bottom:12px">Kişisel analiz raporu</p><h2 id="wizTitle">Günlük hedefin<br><span>'+fmt(R.target)+' kcal</span></h2><p>Hedefin: '+goalTxt+' · Vücut kitle indeksin '+fmt(R.bmi,1)+' ('+bmiCat(R.bmi)+')</p></div></div>'+
    '<div class="kpis">'+
      '<div class="kpi"><small>Bazal metabolizma hızı</small><b><span data-cu="'+R.bmr+'">0</span><i>kcal</i></b><p>Hiç hareket etmeden vücudunun harcadığı enerji.</p></div>'+
      '<div class="kpi"><small>Günlük toplam harcama</small><b><span data-cu="'+R.tdee+'">0</span><i>kcal</i></b><p>Hareket seviyenle birlikte bir günde harcadığın enerji.</p></div>'+
      '<div class="kpi hi"><small>Önerilen günlük kalori</small><b style="color:#D9B26F"><span data-cu="'+R.target+'">0</span><i>kcal</i></b><p>'+(A.goal==='ver'?'Sağlıklı bir açıkla, '+rateTxt+'.':A.goal==='al'?'Kontrollü bir fazlayla, '+rateTxt+'.':'Kilonu korumak için ihtiyacın olan enerji.')+'</p></div>'+
      '<div class="kpi"><small>Günlük su ihtiyacı</small><b>'+fmt(liters,1)+'<i>litre</i></b><p>Yaklaşık '+cups+' bardak.</p></div>'+
    '</div>'+
    '<div class="rgrid">'+
      '<div class="rbox"><h3>Makro dağılımın</h3><p class="sub">Günlük gram hedeflerin</p>'+
        '<div class="mrow"><span class="lb">Protein</span><span class="bar"><i data-w="'+(R.p*4/mtot*100*2)+'" style="background:#9DBB92"></i></span><span class="v">'+R.p+' g</span></div>'+
        '<div class="mrow"><span class="lb">Karbonhidrat</span><span class="bar"><i data-w="'+(R.c*4/mtot*100*2)+'" style="background:#D9B26F"></i></span><span class="v">'+R.c+' g</span></div>'+
        '<div class="mrow"><span class="lb">Yağ</span><span class="bar"><i data-w="'+(R.f*9/mtot*100*2)+'" style="background:#E8977A"></i></span><span class="v">'+R.f+' g</span></div>'+
        '<p class="sub" style="margin:16px 0 0">Protein '+Math.round(R.p*4/mtot*100)+'% · Karbonhidrat '+Math.round(R.c*4/mtot*100)+'% · Yağ '+Math.round(R.f*9/mtot*100)+'%</p></div>'+
      '<div class="rbox"><h3>Öğünlere dağılım</h3><p class="sub">Önerilen kalori, kcal</p>'+mealsRows+'<div class="water" aria-label="'+cups+' bardak su">'+new Array(Math.min(cups,16)+1).join('<i></i>')+'</div></div>'+
    '</div>'+
    (hasChart ? '<div class="rbox" style="margin-top:12px"><h3>Tahmini ilerleme</h3><p class="sub">'+A.w+' kg → '+A.tw+' kg · '+rateTxt+' · yaklaşık '+R.weeks+' hafta</p><div class="chart">'+chartSVG(R)+'</div><div class="legend"><span><i style="background:#D9B26F"></i>Sağlıklı tempo (tahmini)</span>'+(A.goal==='ver'?'<span><i style="background:repeating-linear-gradient(90deg,#E8977A 0 5px,transparent 5px 9px)"></i>Şok diyetlerde sık görülen yo-yo etkisi</span>':'')+'</div></div>' : '')+
    '<div class="rbox" style="margin-top:12px"><h3>Sana özel öneriler</h3><p class="sub">Cevaplarına göre öncelikli adımlar</p><div class="rtips">'+
      reportTips(R).map(function(t){ return '<div class="rtip"><span class="ic"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D9B26F" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg></span><div><b>'+t[0]+'</b><span>'+t[1]+'</span></div></div>'; }).join('')+
    '</div></div>'+
    '<div class="rep-cta"><div><h3>Raporunu birlikte yorumlayalım</h3><p>15 dakikalık ücretsiz ön görüşmede bu sonuçları sana özel bir plana dönüştürelim.</p></div><div class="acts"><button type="button" class="btn btn-ink" id="rSend">WhatsApp ile gönder</button><button type="button" class="btn btn-line ink" id="rPlate">Tabak Kurucu\'da kullan</button></div></div>'+
    '<p class="disc">Bu rapor Mifflin-St Jeor formülü ve standart aktivite katsayılarıyla hazırlanmış tahmini bir değerlendirmedir; tıbbi tanı veya kişisel diyetisyen değerlendirmesinin yerini tutmaz. İlerleme grafiği bir taahhüt değil, sağlıklı tempoya dayalı bir tahmindir. Kronik bir hastalığın, gebeliğin veya emzirme dönemin varsa planını mutlaka bir uzmanla birlikte yapmalısın.</p>'+
    '<div style="margin-top:16px"><button type="button" class="btn btn-line" id="rAgain">Analizi yeniden yap</button></div>'+
  '</div>';
  body.innerHTML = html; body.scrollTop = 0;
  var h = $('#wizTitle'); if (h) { h.setAttribute('tabindex','-1'); h.focus({preventScroll:true}); }
  setTimeout(function(){
    $$('[data-cu]', body).forEach(function(el){ countUp(el, +el.getAttribute('data-cu'), 1100); });
    $$('.mrow .bar i', body).forEach(function(el){ el.style.width = Math.min(100, +el.getAttribute('data-w')) + '%'; });
  }, 60);
  $('#rSend').addEventListener('click', function(){
    openWA('Merhaba, sitenizdeki kişisel analizi yaptım:\n' +
      '• Hedef: ' + goalTxt + (A.tw ? ' (' + A.w + ' → ' + A.tw + ' kg)' : '') + '\n' +
      '• Yaş ' + A.age + ', boy ' + A.h + ' cm, kilo ' + A.w + ' kg\n' +
      '• Bazal metabolizma: ' + fmt(R.bmr) + ' kcal\n' +
      '• Günlük harcama: ' + fmt(R.tdee) + ' kcal\n' +
      '• Önerilen kalori: ' + fmt(R.target) + ' kcal\n' +
      'Ücretsiz ön görüşme için uygun bir zaman öğrenebilir miyim?');
  });
  $('#rPlate').addEventListener('click', function(){ closeWiz(); renderPlate(); if (PROFILE && PROFILE.w) { ecW.value = Math.max(40, Math.min(150, Math.round(PROFILE.w))); renderCards(); } setTimeout(function(){ $('#tabak').scrollIntoView({behavior: reduce ? 'auto' : 'smooth'}); }, 60); });
  $('#rAgain').addEventListener('click', function(){ idx = 0; renderStep(false); });
  renderPlate();
  if (PROFILE && PROFILE.w) { ecW.value = Math.max(40, Math.min(150, Math.round(PROFILE.w))); renderCards(); }
}
})();
