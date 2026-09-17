/* ================================================================
   จับคู่คำศัพท์หรรษา — ตรรกะเกมทั้งหมด
   3 โหมด: เล่นคนเดียว · แข่งผลัดตาในเครื่องเดียว · ห้องออนไลน์คนละเครื่อง
   ================================================================ */
(function () {
  "use strict";

  /* ---------------- คำศัพท์ ---------------- */
  var W = [
    ["🐘","ช้าง","Elephant","สัตว์"], ["🐱","แมว","Cat","สัตว์"],
    ["🐶","หมา","Dog","สัตว์"], ["🐟","ปลา","Fish","สัตว์"],
    ["🐦","นก","Bird","สัตว์"], ["🐸","กบ","Frog","สัตว์"],
    ["🐝","ผึ้ง","Bee","สัตว์"], ["🦋","ผีเสื้อ","Butterfly","สัตว์"],
    ["🐇","กระต่าย","Rabbit","สัตว์"], ["🐢","เต่า","Turtle","สัตว์"],
    ["🍎","แอปเปิล","Apple","ผลไม้"], ["🍌","กล้วย","Banana","ผลไม้"],
    ["🍇","องุ่น","Grape","ผลไม้"], ["🍉","แตงโม","Watermelon","ผลไม้"],
    ["🥭","มะม่วง","Mango","ผลไม้"], ["🍓","สตรอว์เบอร์รี","Strawberry","ผลไม้"],
    ["🍊","ส้ม","Orange","ผลไม้"], ["🍍","สับปะรด","Pineapple","ผลไม้"],
    ["🍚","ข้าว","Rice","อาหาร"], ["🥚","ไข่","Egg","อาหาร"],
    ["🥛","นม","Milk","อาหาร"], ["🍞","ขนมปัง","Bread","อาหาร"],
    ["🍜","ก๋วยเตี๋ยว","Noodle","อาหาร"], ["🍗","ไก่","Chicken","อาหาร"],
    ["🍰","เค้ก","Cake","อาหาร"],
    ["🌞","ดวงอาทิตย์","Sun","ธรรมชาติ"], ["🌙","พระจันทร์","Moon","ธรรมชาติ"],
    ["⭐","ดาว","Star","ธรรมชาติ"], ["🌈","รุ้ง","Rainbow","ธรรมชาติ"],
    ["🌳","ต้นไม้","Tree","ธรรมชาติ"], ["🌸","ดอกไม้","Flower","ธรรมชาติ"],
    ["🌧️","ฝน","Rain","ธรรมชาติ"], ["🌊","ทะเล","Sea","ธรรมชาติ"],
    ["⛰️","ภูเขา","Mountain","ธรรมชาติ"], ["☁️","เมฆ","Cloud","ธรรมชาติ"],
    ["🏠","บ้าน","House","ของใช้"], ["🚗","รถยนต์","Car","ของใช้"],
    ["🚲","จักรยาน","Bicycle","ของใช้"], ["✏️","ดินสอ","Pencil","ของใช้"],
    ["📚","หนังสือ","Book","ของใช้"], ["🎒","กระเป๋า","Bag","ของใช้"],
    ["👟","รองเท้า","Shoes","ของใช้"], ["☂️","ร่ม","Umbrella","ของใช้"],
    ["👒","หมวก","Hat","ของใช้"], ["🕒","นาฬิกา","Clock","ของใช้"]
  ].map(function (a) { return { e: a[0], th: a[1], en: a[2], cat: a[3] }; });

  var LV = {
    1:{name:"ง่าย",   stars:"⭐",    c1:"#0ca678",c2:"#63e6be",tint:"rgba(12,166,120,.16)",pts:10,glyph:"🌱"},
    2:{name:"ปานกลาง",stars:"⭐⭐",  c1:"#f59f00",c2:"#ffd43b",tint:"rgba(245,159,0,.18)", pts:20,glyph:"🌼"},
    3:{name:"ยาก",    stars:"⭐⭐⭐",c1:"#ff4f87",c2:"#ffa8c5",tint:"rgba(255,79,135,.16)",pts:30,glyph:"🚀"}
  };

  var STAGES = [
    {ico:"🐾", nm:"สัตว์น่ารัก",  cat:"สัตว์",     mix:[1,1,1,1]},
    {ico:"🍓", nm:"ผลไม้อร่อย",  cat:"ผลไม้",    mix:[1,1,1,1,2,2]},
    {ico:"🍚", nm:"ของกินของใช้",cat:"อาหาร",    mix:[1,1,2,2,2,2]},
    {ico:"🌈", nm:"ธรรมชาติ",    cat:"ธรรมชาติ", mix:[1,1,2,2,2,2,3,3]},
    {ico:"🏠", nm:"รอบตัวเรา",   cat:"ของใช้",   mix:[1,2,2,2,2,3,3,3]},
    {ico:"🌟", nm:"รวมมิตร",     cat:null,       mix:[1,1,2,2,2,2,3,3,3,3]},
    {ico:"🚀", nm:"ท้าทาย",      cat:null,       mix:[2,2,2,2,3,3,3,3,3,3]},
    {ico:"🔥", nm:"เร็วแรง",      cat:null,       mix:[1,2,2,3,3,3,3,3,3,3]},
    {ico:"💎", nm:"ยอดนักจำ",    cat:null,       mix:[2,2,3,3,3,3,3,3,3,3]},
    {ico:"👑", nm:"แชมป์คำศัพท์",cat:null,       mix:[3,3,3,3,3,3,3,3,3,3]}
  ];

  var LANGS = {
    th:  {ico:"🇹🇭", nm:"คำศัพท์ไทย",   sub:"อ่านคำไทยใต้รูป เหมาะกับการเริ่มต้น"},
    en:  {ico:"🔤", nm:"คำศัพท์อังกฤษ", sub:"ใต้รูปเป็นคำอังกฤษล้วน ฝึกอ่าน English"},
    both:{ico:"🌏", nm:"ไทย + อังกฤษ",  sub:"ใต้รูปมีสองภาษา และมีคู่ไทย–อังกฤษด้วย"}
  };
  var MODES = {
    solo:  {ico:"👤", nm:"เล่นคนเดียว",    sub:"ไล่เก็บด่าน สะสมดาว"},
    party: {ico:"👫", nm:"ผลัดตาเครื่องเดียว", sub:"2–4 คน นั่งเล่นด้วยกัน"},
    online:{ico:"🌐", nm:"ห้องออนไลน์",    sub:"คนละเครื่อง เห็นการ์ดพร้อมกัน"}
  };
  var PCOL = ["#ff4f87","#3d7bff","#0ca678","#f59f00","#8b5cf6","#0891b2"];
  var CHEER = ["เยี่ยมมาก!","เก่งจัง!","ถูกต้อง!","สุดยอด!","ใช่เลย!","ดีมาก ๆ!"];
  var NUDGE = ["ยังไม่ใช่นะ ลองใหม่!","เกือบแล้ว! จำตำแหน่งไว้","ไม่เป็นไร ลองอีกที"];
  var PEEK_MS = 3000;

  /* ---------------- ตัวช่วย ---------------- */
  var $ = function (id) { return document.getElementById(id); };
  var board = $("board");
  function esc(s){ return String(s).replace(/[&<>"]/g, function(m){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]; }); }
  function fmt(s){ var m=Math.floor(s/60), r=s%60; return m+":"+(r<10?"0":"")+r; }
  function one(a){ return a[Math.floor(Math.random()*a.length)]; }
  function say(t, warn){ var b=$("msg"); b.textContent=t; b.classList.toggle("warn", !!warn); }
  function store(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
  function load(k,d){ try{ var v=JSON.parse(localStorage.getItem(k)); return v==null?d:v; }catch(e){ return d; } }

  var toastT = null;
  function toast(msg){
    var el = document.querySelector(".toast");
    if(!el){ el = document.createElement("div"); el.className="toast"; document.body.appendChild(el); }
    el.textContent = msg;
    clearTimeout(toastT);
    toastT = setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); }, 2600);
  }

  /* ---------------- เสียง ---------------- */
  var sound = load("wm.sound", true), actx = null;
  function tone(f, at, dur, vol){
    if(!sound) return;
    try{
      if(!actx) actx = new (window.AudioContext||window.webkitAudioContext)();
      if(actx.state === "suspended") actx.resume();
      var t = actx.currentTime + at, o = actx.createOscillator(), g = actx.createGain();
      o.type="triangle"; o.frequency.setValueAtTime(f,t);
      g.gain.setValueAtTime(.0001,t);
      g.gain.exponentialRampToValueAtTime(vol||.16, t+.02);
      g.gain.exponentialRampToValueAtTime(.0001, t+dur);
      o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t+dur+.05);
    }catch(e){}
  }
  function sFlip(){ tone(520,0,.10,.09); }
  function sGood(){ tone(660,0,.14); tone(880,.10,.16); tone(1175,.20,.22); }
  function sBad(){ tone(240,0,.16,.10); tone(190,.12,.20,.09); }
  function sWin(){ [523,659,784,1047,784,1047,1319].forEach(function(f,i){ tone(f,i*.13,.22,.15); }); }
  function sHint(){ tone(990,0,.10,.10); tone(1320,.09,.12,.09); }

  /* ---------------- สร้างกระดาน ---------------- */
  function shuffle(a){
    for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; }
    return a;
  }
  function kindsFor(lv, lang){
    if(lang === "both"){
      if(lv === 1) return ["pic","pic"];
      if(lv === 2) return Math.random() < .5 ? ["pic","w-th"] : ["pic","w-en"];
      return ["w-th","w-en"];
    }
    var w = lang === "en" ? "w-en" : "w-th";
    if(lv === 1) return ["pic","pic"];
    if(lv === 2) return ["pic", w];
    return ["pic0", w];
  }
  function makeCards(stage, lang){
    var st = STAGES[stage], mix = st.mix.slice();
    var pool = W.filter(function(w){ return !st.cat || w.cat === st.cat; });
    pool = shuffle(pool.slice()).slice(0, mix.length);
    var cards = [];
    pool.forEach(function(w,i){
      kindsFor(mix[i], lang).forEach(function(k){
        cards.push({pair:i, lv:mix[i], kind:k, w:{e:w.e, th:w.th, en:w.en}});
      });
    });
    return shuffle(cards);
  }

  /* ---------------- วาดการ์ด ---------------- */
  function faceHTML(c, lang){
    var L = LV[c.lv], cls, inner;
    if(c.kind === "pic" || c.kind === "pic0"){
      cls = "front pic";
      inner = '<span class="emoji">'+c.w.e+'</span>';
      if(c.kind === "pic"){
        if(lang === "en") inner += '<span class="cap en">'+esc(c.w.en)+'</span>';
        else if(lang === "th") inner += '<span class="cap">'+esc(c.w.th)+'</span>';
        else inner += '<span class="cap">'+esc(c.w.th)+'</span><span class="cap2">'+esc(c.w.en)+'</span>';
      }
    } else if(c.kind === "w-th"){
      cls = "front txt";
      inner = '<span class="lang">คำไทย</span><span class="word">'+esc(c.w.th)+'</span>';
    } else {
      cls = "front txt";
      inner = '<span class="lang">อังกฤษ</span><span class="word en">'+esc(c.w.en)+'</span>';
    }
    return '<span class="face back"><span class="stars">'+L.stars+'</span><span class="glyph">'+L.glyph+'</span></span>'+
           '<span class="face '+cls+'">'+inner+'</span>';
  }
  function aria(c){
    if(c.kind === "pic0") return "การ์ดรูปภาพ ไม่มีคำใบ้";
    if(c.kind === "pic") return "รูป " + c.w.th + " " + c.w.en;
    if(c.kind === "w-th") return "คำไทย " + c.w.th;
    return "คำอังกฤษ " + c.w.en;
  }
  function renderBoard(cards, lang, onPick){
    board.style.setProperty("--cols", cards.length > 16 ? 5 : 4);
    board.innerHTML = "";
    cards.forEach(function(c,i){
      var b = document.createElement("button");
      b.type="button"; b.className="card";
      b.style.setProperty("--c1", LV[c.lv].c1);
      b.style.setProperty("--c2", LV[c.lv].c2);
      b.style.setProperty("--tint", LV[c.lv].tint);
      b.dataset.id = i;
      b.setAttribute("aria-label", aria(c));
      b.innerHTML = faceHTML(c, lang);
      b.addEventListener("click", function(){ onPick(i); });
      board.appendChild(b);
    });
  }
  function node(i){ return board.querySelector('[data-id="'+i+'"]'); }
  function setCard(i, up, done){
    var n = node(i); if(!n) return;
    n.classList.toggle("up", !!up && !done);
    n.classList.toggle("done", !!done);
  }
  function popCards(ids){
    ids.forEach(function(i){
      var n = node(i); if(!n) return;
      n.classList.add("pop");
      setTimeout(function(){ n.classList.remove("pop"); }, 460);
    });
  }
  function shakeCards(ids){
    ids.forEach(function(i){
      var n = node(i); if(!n) return;
      n.classList.add("shake");
      setTimeout(function(){ n.classList.remove("shake"); }, 420);
    });
  }

  /* ---------------- คอนเฟตตี ---------------- */
  function confetti(){
    var cv = $("confetti");
    if(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cv.hidden = false;
    var ctx = cv.getContext("2d"), dpr = window.devicePixelRatio || 1;
    cv.width = innerWidth*dpr; cv.height = innerHeight*dpr;
    cv.style.width = innerWidth+"px"; cv.style.height = innerHeight+"px";
    ctx.scale(dpr,dpr);
    var cols = ["#ff4f87","#f59f00","#0ca678","#3d7bff","#8b5cf6","#ffd43b"], P = [];
    for(var i=0;i<110;i++) P.push({
      x:Math.random()*innerWidth, y:-20-Math.random()*innerHeight*.5,
      w:6+Math.random()*7, h:9+Math.random()*9,
      vy:1.8+Math.random()*2.6, vx:-1+Math.random()*2,
      rot:Math.random()*6.28, vr:-.12+Math.random()*.24, c:cols[i%cols.length]
    });
    var end = performance.now() + 3200;
    (function loop(now){
      ctx.clearRect(0,0,innerWidth,innerHeight);
      P.forEach(function(p){
        p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr;
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot);
        ctx.fillStyle=p.c; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); ctx.restore();
      });
      if(now<end) requestAnimationFrame(loop);
      else { ctx.clearRect(0,0,innerWidth,innerHeight); cv.hidden = true; }
    })(performance.now());
  }

  /* ================================================================
     ส่วนตั้งค่า / หน้าแรก
     ================================================================ */
  var cfg = {
    lang: load("wm.lang","th"), mode: "solo", stage: 0,
    np: load("wm.np",2), names: load("wm.names",["ผู้เล่น 1","ผู้เล่น 2","ผู้เล่น 3","ผู้เล่น 4"]),
    myName: load("wm.myname","")
  };
  var prog = load("wm.prog",{}), bestS = load("wm.best",{});
  function P(){ if(!prog[cfg.lang]) prog[cfg.lang] = {open:1, stars:{}}; return prog[cfg.lang]; }

  function pickBtn(o, on){
    var b = document.createElement("button");
    b.type="button"; b.className="pick"; b.setAttribute("aria-pressed", String(on));
    b.innerHTML = '<span class="big">'+o.ico+'</span><span class="t"><b>'+o.nm+'</b><small>'+o.sub+'</small></span>';
    return b;
  }

  function drawHome(){
    var lb = $("langs"); lb.innerHTML = "";
    Object.keys(LANGS).forEach(function(k){
      var b = pickBtn(LANGS[k], cfg.lang === k);
      b.addEventListener("click", function(){ cfg.lang = k; store("wm.lang",k); drawHome(); });
      lb.appendChild(b);
    });
    $("langNote").innerHTML = cfg.lang === "th"
      ? "การ์ดรูปจะมี <b>คำไทย</b> อยู่ใต้รูป · การ์ดคำเป็นภาษาไทย"
      : (cfg.lang === "en"
        ? "การ์ดรูปจะมี <b>คำอังกฤษ</b> อยู่ใต้รูป · การ์ดคำเป็นภาษาอังกฤษ"
        : "การ์ดรูปมี <b>คำไทยและคำอังกฤษ</b> อยู่ใต้รูป · ข้อยากเป็นคู่ ไทย ↔ อังกฤษ ไม่มีรูปช่วย");

    var mb = $("modes"); mb.innerHTML = "";
    Object.keys(MODES).forEach(function(k){
      var b = pickBtn(MODES[k], cfg.mode === k);
      b.addEventListener("click", function(){ cfg.mode = k; drawHome(); });
      mb.appendChild(b);
    });
    $("partyBox").hidden = cfg.mode !== "party";
    $("onlineBox").hidden = cfg.mode !== "online";
    $("go").hidden = cfg.mode === "online";

    var cb = $("plCount"); cb.innerHTML = "";
    [2,3,4].forEach(function(n){
      var b = document.createElement("button");
      b.type="button"; b.className="num"; b.textContent = n+" คน";
      b.setAttribute("aria-pressed", String(cfg.np === n));
      b.addEventListener("click", function(){ cfg.np = n; store("wm.np",n); drawHome(); });
      cb.appendChild(b);
    });
    var nb = $("plNames"); nb.innerHTML = "";
    for(var i=0;i<cfg.np;i++)(function(i){
      var d = document.createElement("label"); d.className = "field";
      d.innerHTML = '<span class="dot" style="background:'+PCOL[i]+'"></span>';
      var inp = document.createElement("input");
      inp.value = cfg.names[i] || ("ผู้เล่น "+(i+1));
      inp.maxLength = 14;
      inp.setAttribute("aria-label", "ชื่อผู้เล่นคนที่ "+(i+1));
      inp.addEventListener("input", function(){ cfg.names[i] = inp.value; store("wm.names", cfg.names); });
      d.appendChild(inp); nb.appendChild(d);
    })(i);

    var sb = $("stages"); sb.innerHTML = "";
    var pr = P();
    if(cfg.mode === "solo" && cfg.stage + 1 > pr.open) cfg.stage = pr.open - 1;
    STAGES.forEach(function(st,i){
      var locked = cfg.mode === "solo" && (i+1) > pr.open;
      var stars = pr.stars[i] || 0;
      var b = document.createElement("button");
      b.type="button"; b.className="stage"; b.disabled = locked;
      b.setAttribute("aria-pressed", String(cfg.stage === i));
      b.innerHTML = '<span class="ico">'+(locked ? "🔒" : st.ico)+'</span>'+
        '<span class="no">ด่าน '+(i+1)+' · '+st.mix.length+' คู่</span>'+
        '<span class="nm">'+st.nm+'</span>'+
        '<span class="st">'+(stars ? "⭐".repeat(stars) : (locked ? "ยังไม่เปิด" : ""))+'</span>';
      b.addEventListener("click", function(){ cfg.stage = i; drawHome(); });
      sb.appendChild(b);
    });
    $("stageNote").innerHTML = cfg.mode === "solo"
      ? "ผ่านด่านแล้วจะ<b>ปลดล็อกด่านถัดไป</b>อัตโนมัติ · ดาวเก็บแยกตามภาษาที่เลือก"
      : (cfg.mode === "online"
        ? "เจ้าของห้องเลือกด่านให้ทุกคน · คนที่เข้าห้องไม่ต้องเลือกเอง"
        : "โหมดแข่งเลือกด่านไหนก็ได้ ไม่ต้องปลดล็อก");

    var rows = cfg.lang === "both"
      ? [["⭐ ง่าย","#0ca678","จับคู่ <b>รูปเหมือนกัน</b> — ใต้รูปมีคำไทยและอังกฤษ"],
         ["⭐⭐ ปานกลาง","#f59f00","จับคู่ <b>รูปกับการ์ดคำ</b> — 🐘 คู่กับ “ช้าง” หรือ “Elephant”"],
         ["⭐⭐⭐ ยาก","#ff4f87","จับคู่ <b>คำไทยกับคำอังกฤษ</b> — “ช้าง” คู่กับ “Elephant” ไม่มีรูปช่วย"]]
      : (cfg.lang === "en"
        ? [["⭐ ง่าย","#0ca678","จับคู่ <b>รูปเหมือนกัน</b> — ใต้รูปมีคำอังกฤษ"],
           ["⭐⭐ ปานกลาง","#f59f00","จับคู่ <b>รูปกับคำอังกฤษ</b> — 🐘 Elephant คู่กับการ์ดคำ “Elephant”"],
           ["⭐⭐⭐ ยาก","#ff4f87","การ์ดรูป <b>ไม่มีคำใต้รูป</b> ต้องอ่านคำอังกฤษเองแล้วนึกภาพให้ออก"]]
        : [["⭐ ง่าย","#0ca678","จับคู่ <b>รูปเหมือนกัน</b> — ใต้รูปมีคำไทย"],
           ["⭐⭐ ปานกลาง","#f59f00","จับคู่ <b>รูปกับคำไทย</b> — 🐘 ช้าง คู่กับการ์ดคำ “ช้าง”"],
           ["⭐⭐⭐ ยาก","#ff4f87","การ์ดรูป <b>ไม่มีคำใต้รูป</b> ต้องอ่านคำไทยเองแล้วนึกภาพให้ออก"]]);
    $("legend").innerHTML = rows.map(function(r){
      return '<li><span class="pill" style="background:'+r[1]+'">'+r[0]+'</span><span>'+r[2]+'</span></li>';
    }).join("");
  }

  function showScreen(name){
    $("home").hidden = name !== "home";
    $("lobby").hidden = name !== "lobby";
    $("play").hidden = name !== "play";
    if(name !== "play") $("win").hidden = true;
    window.scrollTo({top:0, behavior:"smooth"});
  }

  function goHome(){
    stopClock(); netLeave();
    showScreen("home"); drawHome();
  }

  /* ================================================================
     โหมดออฟไลน์ (คนเดียว / ผลัดตาเครื่องเดียว)
     ================================================================ */
  var S = null, tick = null;

  function startClock(getSec){
    stopClock();
    tick = setInterval(function(){
      var sec = getSec();
      if(!$("players").hidden) return;
      $("sTime").textContent = fmt(sec);
    }, 500);
  }
  function stopClock(){ if(tick){ clearInterval(tick); tick=null; } }

  function offStart(){
    stopClock();
    var cards = makeCards(cfg.stage, cfg.lang);
    S = {
      cards: cards.map(function(c){ return {pair:c.pair, lv:c.lv, kind:c.kind, w:c.w, up:false, done:false}; }),
      lang: cfg.lang, stage: cfg.stage, pairs: cards.length/2,
      found:0, moves:0, score:0, hints:3, sel:[], lock:true, t0:Date.now(), elapsed:0,
      done:false, players:[], turn:0, mode: cfg.mode
    };
    if(cfg.mode === "party"){
      for(var p=0;p<cfg.np;p++) S.players.push({
        name: (cfg.names[p]||("ผู้เล่น "+(p+1))).trim() || ("ผู้เล่น "+(p+1)),
        score:0, pairs:0, col:PCOL[p]
      });
    }
    showScreen("play");
    var st = STAGES[S.stage];
    $("crumb").textContent = st.ico+" ด่าน "+(S.stage+1)+" · "+st.nm;
    $("tagLang").textContent = LANGS[S.lang].nm;
    $("tagRoom").hidden = true;
    $("btnNew").hidden = false;
    renderBoard(S.cards, S.lang, offPick);
    offStats();
    offPeek(3);
  }

  function offStats(){
    var multi = S.players.length > 0;
    $("stats").hidden = multi;
    $("players").hidden = !multi;
    if(multi){
      var box = $("players"); box.innerHTML = "";
      S.players.forEach(function(p,i){
        var d = document.createElement("div");
        d.className = "pchip" + (i === S.turn && !S.done ? " on" : "");
        d.style.setProperty("--c", p.col);
        d.innerHTML = '<span class="av" style="background:'+p.col+'">'+(i+1)+'</span>'+
          '<span style="min-width:0"><span class="pn">'+esc(p.name)+'</span>'+
          '<span class="ps">'+p.score+'</span>'+
          (i === S.turn && !S.done ? ' <span class="turn">ตาเล่น</span>' : '')+'</span>';
        box.appendChild(d);
      });
    } else {
      $("sScore").textContent = S.score;
      $("sPairs").textContent = S.found + "/" + S.pairs;
      $("sMoves").textContent = S.moves;
      $("sTime").textContent = fmt(S.elapsed);
    }
    $("hintN").textContent = S.hints;
    $("btnHint").hidden = multi;
    $("btnHint").disabled = S.hints <= 0 || S.lock || S.done;
  }

  function offPeek(n){
    S.lock = true;
    S.cards.forEach(function(c,i){ if(!c.done){ c.up = true; setCard(i,true,false); } });
    offStats();
    (function step(k){
      if(k > 0){ say("จำให้ดี ๆ นะ… "+k); setTimeout(function(){ step(k-1); }, 1000); }
      else {
        S.cards.forEach(function(c,i){ if(!c.done){ c.up=false; setCard(i,false,false); } });
        S.lock = false; S.t0 = Date.now();
        say(S.players.length ? ("ตาของ "+S.players[S.turn].name+" เริ่มเลย!") : "เริ่มได้! หาคู่ให้ครบทุกใบ 💪");
        offStats();
        startClock(function(){ S.elapsed = Math.floor((Date.now()-S.t0)/1000); return S.elapsed; });
      }
    })(n);
  }

  function offPick(i){
    if(!S || S.lock || S.done) return;
    var c = S.cards[i];
    if(!c || c.done || c.up) return;
    c.up = true; setCard(i,true,false); sFlip();
    S.sel.push(i);
    if(S.sel.length < 2) return;

    S.moves++;
    var ia = S.sel[0], ib = S.sel[1], a = S.cards[ia], b = S.cards[ib];
    S.sel = [];

    if(a.pair === b.pair){
      S.lock = true;
      setTimeout(function(){
        a.done = b.done = true; S.found++;
        var pts = LV[a.lv].pts;
        if(S.players.length){ S.players[S.turn].score += pts; S.players[S.turn].pairs++; }
        else S.score += pts;
        setCard(ia,true,true); setCard(ib,true,true);
        popCards([ia,ib]); sGood();
        say(S.players.length
          ? (one(CHEER)+" "+S.players[S.turn].name+" ได้ "+pts+" คะแนน · เล่นต่อได้เลย!")
          : (one(CHEER)+" ได้ "+pts+" คะแนน ("+LV[a.lv].name+")"));
        S.lock = false; offStats();
        if(S.found === S.pairs) offFinish();
      }, 260);
    } else {
      S.lock = true; sBad(); shakeCards([ia,ib]); say(one(NUDGE));
      setTimeout(function(){
        a.up = b.up = false; setCard(ia,false,false); setCard(ib,false,false);
        if(S.players.length){
          S.turn = (S.turn+1) % S.players.length;
          say("เปลี่ยนตา → "+S.players[S.turn].name);
        }
        S.lock = false; offStats();
      }, 900);
    }
  }

  function offHint(){
    if(!S || S.lock || S.done || S.hints <= 0 || S.players.length) return;
    var left = [];
    S.cards.forEach(function(c,i){ if(!c.done && !c.up) left.push(i); });
    if(left.length < 2) return;
    var f = one(left), m = -1;
    left.forEach(function(i){ if(i !== f && S.cards[i].pair === S.cards[f].pair) m = i; });
    if(m < 0) return;
    S.hints--; S.score = Math.max(0, S.score-5); S.lock = true; S.sel = [];
    sHint(); say("ใบ้ให้! สองใบนี้เป็นคู่กันนะ (−5 คะแนน)");
    S.cards[f].up = S.cards[m].up = true;
    setCard(f,true,false); setCard(m,true,false); offStats();
    setTimeout(function(){
      if(!S.cards[f].done){ S.cards[f].up=false; setCard(f,false,false); }
      if(!S.cards[m].done){ S.cards[m].up=false; setCard(m,false,false); }
      S.lock = false; offStats();
    }, 1600);
  }

  function offFinish(){
    S.done = true; stopClock(); sWin(); offStats();
    S.elapsed = Math.floor((Date.now()-S.t0)/1000);
    var multi = S.players.length > 0;
    $("wPodium").hidden = !multi; $("wBox").hidden = multi;
    $("wStars").hidden = multi; $("wNext").hidden = true;
    $("wBest").hidden = true; $("wWait").hidden = true;
    $("wAgain").hidden = false; $("wHome").hidden = false;

    if(multi){
      showPodium(S.players.map(function(p,i){ return {name:p.name, score:p.score, pairs:p.pairs, col:p.col}; }),
                 "ด่าน "+(S.stage+1)+" · "+STAGES[S.stage].nm+" · ใช้เวลา "+fmt(S.elapsed));
    } else {
      var bonus = Math.max(0, 90 - S.elapsed);
      S.score += bonus;
      var stars = S.moves <= S.pairs+2 ? 3 : (S.moves <= S.pairs*2 ? 2 : 1);
      $("wStars").textContent = "⭐".repeat(stars)+"☆".repeat(3-stars);
      $("wTitle").textContent = stars===3 ? "สุดยอดไปเลย!" : (stars===2 ? "เก่งมาก!" : "ผ่านด่านแล้ว!");
      $("wSub").textContent = "ด่าน "+(S.stage+1)+" · "+STAGES[S.stage].nm+" · โบนัสเร็วทันใจ +"+bonus+" คะแนน";
      $("wScore").textContent = S.score;
      $("wMoves").textContent = S.moves;
      $("wTime").textContent = fmt(S.elapsed);
      var key = S.lang+"|"+S.stage;
      if(!bestS[key] || S.score > bestS[key]){ bestS[key] = S.score; store("wm.best", bestS); $("wBest").hidden = false; }
      var pr = P();
      pr.stars[S.stage] = Math.max(pr.stars[S.stage]||0, stars);
      if(S.stage+1 >= pr.open && S.stage+1 < STAGES.length){
        pr.open = S.stage+2;
        $("wSub").textContent += " · ปลดล็อกด่าน "+(S.stage+2)+" แล้ว!";
      }
      store("wm.prog", prog);
      if(S.stage+1 < STAGES.length){
        $("wNext").hidden = false;
        $("wNext").textContent = "➡️ ด่าน "+(S.stage+2)+" "+STAGES[S.stage+1].ico;
      }
      say("เก่งมาก! จับคู่ครบแล้ว 🎉");
    }
    $("win").hidden = false;
    confetti();
  }

  function showPodium(list, subtitle){
    var rank = list.slice().sort(function(x,y){ return y.score - x.score || y.pairs - x.pairs; });
    var top = rank.length ? rank[0].score : 0;
    var winners = rank.filter(function(r){ return r.score === top; });
    $("wTitle").textContent = winners.length > 1 ? "เสมอกัน! 🤝" : (rank[0].name+" ชนะ! 🎉");
    $("wSub").textContent = subtitle;
    var md = ["🥇","🥈","🥉","4️⃣","5️⃣","6️⃣"];
    $("wPodium").innerHTML = rank.map(function(r,i){
      return '<div class="prow'+(r.score===top?" win":"")+'">'+
        '<span class="md">'+(md[i]||"")+'</span>'+
        '<span class="pn2" style="color:'+r.col+'">'+esc(r.name)+'</span>'+
        '<span class="sc">'+r.score+'</span></div>';
    }).join("");
    say("จบเกม! "+(winners.length>1 ? "เสมอกัน" : rank[0].name+" ชนะ"));
  }

  /* ================================================================
     โหมดออนไลน์ — ห้องจริงบนเซิร์ฟเวอร์
     ================================================================ */
  var NET = { code:null, pid:null, st:null, ver:-1, timer:null, boardKey:null,
              doneSeen:{}, upSeen:0, pendingSeen:false, busy:false, clock:null };

  function api(action, data){
    var body = Object.assign({action:action, code:NET.code, pid:NET.pid}, data||{});
    return fetch("/api/room", {
      method:"POST",
      headers:{"content-type":"application/json"},
      body: JSON.stringify(body)
    }).then(function(r){
      return r.json().catch(function(){ return {ok:false, error:"เซิร์ฟเวอร์ตอบไม่ถูกต้อง"}; });
    }).then(function(j){
      if(!j || !j.ok) throw new Error((j && j.error) || "เชื่อมต่อไม่สำเร็จ");
      return j;
    });
  }

  function netCreate(){
    var name = ($("myName").value || "").trim() || "เจ้าของห้อง";
    cfg.myName = name; store("wm.myname", name);
    $("btnCreate").disabled = true;
    api("create", {code:null, pid:null, cards:makeCards(cfg.stage, cfg.lang), lang:cfg.lang, stage:cfg.stage, name:name})
      .then(function(j){
        NET.code = j.code; NET.pid = j.pid; NET.ver = -1;
        try{ sessionStorage.setItem("wm.room", JSON.stringify({code:j.code, pid:j.pid})); }catch(e){}
        onState(j.state);
        pollStart();
      })
      .catch(function(e){ toast(e.message); })
      .then(function(){ $("btnCreate").disabled = false; });
  }

  function netJoin(){
    var code = ($("joinCode").value || "").replace(/\D/g,"");
    if(code.length !== 4){ toast("ใส่รหัสห้อง 4 ตัวเลขนะ"); return; }
    var name = ($("myName").value || "").trim() || "เพื่อน";
    cfg.myName = name; store("wm.myname", name);
    $("btnJoin").disabled = true;
    NET.code = code; NET.pid = null;
    api("join", {name:name})
      .then(function(j){
        NET.pid = j.pid; NET.ver = -1;
        try{ sessionStorage.setItem("wm.room", JSON.stringify({code:code, pid:j.pid})); }catch(e){}
        onState(j.state);
        pollStart();
      })
      .catch(function(e){ NET.code = null; toast(e.message); })
      .then(function(){ $("btnJoin").disabled = false; });
  }

  function netLeave(){
    pollStop();
    if(NET.code && NET.pid){ api("leave", {}).catch(function(){}); }
    NET.code = NET.pid = NET.st = null; NET.ver = -1; NET.boardKey = null;
    try{ sessionStorage.removeItem("wm.room"); }catch(e){}
  }

  function pollStart(){
    pollStop();
    NET.timer = setInterval(pollOnce, 900);
  }
  function pollStop(){
    if(NET.timer){ clearInterval(NET.timer); NET.timer = null; }
    if(NET.clock){ clearInterval(NET.clock); NET.clock = null; }
  }
  function pollOnce(){
    if(!NET.code || NET.busy) return;
    NET.busy = true;
    api("state", {}).then(function(j){ onState(j.state); })
      .catch(function(e){ toast(e.message); pollStop(); goHome(); })
      .then(function(){ NET.busy = false; });
  }

  function amHost(st){ return st.players.length > 0 && st.players[0].id === NET.pid; }
  function myIndex(st){ return st.players.findIndex(function(p){ return p.id === NET.pid; }); }

  function onState(st){
    NET.st = st;
    if(st.status === "lobby"){ drawLobby(st); return; }
    drawOnlinePlay(st);
  }

  function drawLobby(st){
    showScreen("lobby");
    $("lobbyCode").textContent = NET.code;
    $("lobbyLink").value = location.origin + location.pathname + "?room=" + NET.code;
    $("lobbyPlayers").innerHTML = st.players.map(function(p,i){
      return '<div class="lp"><span class="av" style="background:'+PCOL[i%PCOL.length]+'">'+(i+1)+'</span>'+
        '<b>'+esc(p.name)+(p.id === NET.pid ? " (คุณ)" : "")+'</b></div>';
    }).join("");
    var host = amHost(st);
    $("btnStart").hidden = !host;
    $("btnStart").disabled = st.players.length < 2;
    $("lobbyNote").innerHTML = host
      ? (st.players.length < 2
        ? 'รอเพื่อนเข้าห้องอีกอย่างน้อย 1 คน<span class="dots"></span>'
        : "พร้อมแล้ว " + st.players.length + " คน · กดเริ่มเกมได้เลย")
      : 'รอเจ้าของห้องกดเริ่มเกม<span class="dots"></span>';
  }

  function drawOnlinePlay(st){
    var key = String(st.startedAt);
    if(NET.boardKey !== key){
      NET.boardKey = key;
      NET.doneSeen = {}; NET.upSeen = 0; NET.pendingSeen = false;
      showScreen("play");
      var s = STAGES[st.stage] || STAGES[0];
      $("crumb").textContent = s.ico+" ด่าน "+(st.stage+1)+" · "+s.nm;
      $("tagLang").textContent = (LANGS[st.lang]||LANGS.th).nm;
      $("tagRoom").hidden = false;
      $("tagRoom").textContent = "ห้อง "+NET.code;
      $("btnHint").hidden = true;
      $("btnNew").hidden = !amHost(st);
      renderBoard(st.cards, st.lang, netPick);
      $("win").hidden = true;
      if(NET.clock) clearInterval(NET.clock);
      NET.clock = setInterval(function(){ onlineTick(); }, 500);
    }

    var peek = st.startedAt && Date.now() < st.startedAt + PEEK_MS;
    var upSet = {};
    (st.up||[]).forEach(function(i){ upSet[i] = true; });

    var justDone = [];
    st.cards.forEach(function(c,i){
      var up = peek ? !c.done : !!upSet[i];
      setCard(i, up || c.done, c.done);
      if(c.done && !NET.doneSeen[i]){ NET.doneSeen[i] = true; justDone.push(i); }
    });

    if(justDone.length){ popCards(justDone); sGood(); }
    else if(NET.pendingSeen && !st.pending){ sBad(); }
    if((st.up||[]).length > NET.upSeen && !peek) sFlip();
    NET.upSeen = (st.up||[]).length;
    NET.pendingSeen = !!st.pending;

    if(st.pending) setTimeout(pollOnce, Math.max(80, st.pending.until - Date.now() + 120));

    onlinePlayers(st);
    onlineTick();

    if(st.status === "done") onlineFinish(st);
    else $("win").hidden = true;
  }

  function onlinePlayers(st){
    $("stats").hidden = true;
    $("players").hidden = false;
    $("players").innerHTML = st.players.map(function(p,i){
      var col = PCOL[i%PCOL.length];
      var on = i === st.turn && st.status === "playing";
      return '<div class="pchip'+(on?" on":"")+'" style="--c:'+col+'">'+
        '<span class="av" style="background:'+col+'">'+(i+1)+'</span>'+
        '<span style="min-width:0"><span class="pn">'+esc(p.name)+
          (p.id === NET.pid ? '<span class="you">คุณ</span>' : '')+'</span>'+
        '<span class="ps">'+p.score+'</span>'+
        (on ? ' <span class="turn">ตาเล่น</span>' : '')+'</span></div>';
    }).join("");
  }

  function onlineTick(){
    var st = NET.st; if(!st || !st.startedAt) return;
    var left = st.startedAt + PEEK_MS - Date.now();
    var mine = myIndex(st) === st.turn;
    board.classList.toggle("wait", !(mine && st.status === "playing" && left <= 0));
    if(st.status === "done") return;
    if(left > 0){ say("จำให้ดี ๆ นะ… " + Math.ceil(left/1000)); return; }
    if(st.pending){ say(st.pending.matched ? "ถูกต้อง! 🎉" : "ยังไม่ใช่นะ…"); return; }
    var cur = st.players[st.turn];
    say(mine ? "ตาของคุณแล้ว! เลือกการ์ด 2 ใบ 💪"
             : ("รอ " + (cur ? cur.name : "เพื่อน") + " เปิดการ์ด…"));
  }

  function netPick(i){
    var st = NET.st; if(!st || st.status !== "playing") return;
    if(Date.now() < (st.startedAt||0) + PEEK_MS) return;
    if(myIndex(st) !== st.turn){ toast("ยังไม่ถึงตาของคุณนะ"); return; }
    if(st.pending) return;
    if(st.cards[i].done || (st.up||[]).indexOf(i) >= 0) return;
    setCard(i, true, false); sFlip();          // พลิกให้เห็นทันที แล้วค่อยรอเซิร์ฟเวอร์ยืนยัน
    api("flip", {id:i}).then(function(j){ onState(j.state); })
      .catch(function(e){ toast(e.message); pollOnce(); });
  }

  function onlineFinish(st){
    if($("win").hidden === false) return;
    pollSlow();
    sWin();
    $("wPodium").hidden = false; $("wBox").hidden = true;
    $("wStars").hidden = true; $("wNext").hidden = true; $("wBest").hidden = true;
    var host = amHost(st);
    $("wAgain").hidden = !host;
    $("wWait").hidden = host;
    var secs = st.endedAt && st.startedAt ? Math.floor((st.endedAt - st.startedAt)/1000) : 0;
    showPodium(st.players.map(function(p,i){
      return {name:p.name + (p.id === NET.pid ? " (คุณ)" : ""), score:p.score, pairs:p.pairs, col:PCOL[i%PCOL.length]};
    }), "ห้อง "+NET.code+" · ด่าน "+(st.stage+1)+" · ใช้เวลา "+fmt(secs));
    $("win").hidden = false;
    confetti();
  }

  function pollSlow(){
    if(NET.timer) clearInterval(NET.timer);
    NET.timer = setInterval(pollOnce, 1800);
  }

  function netAgain(){
    var st = NET.st; if(!st || !amHost(st)) return;
    $("wAgain").disabled = true;
    api("again", {cards:makeCards(st.stage, st.lang), stage:st.stage, lang:st.lang})
      .then(function(j){ NET.boardKey = null; onState(j.state); pollStart(); })
      .catch(function(e){ toast(e.message); })
      .then(function(){ $("wAgain").disabled = false; });
  }

  /* ================================================================
     ปุ่มต่าง ๆ
     ================================================================ */
  $("go").addEventListener("click", function(){ if(cfg.mode !== "online") offStart(); });
  $("back").addEventListener("click", goHome);
  $("wHome").addEventListener("click", goHome);
  $("btnLeave").addEventListener("click", goHome);
  $("btnCreate").addEventListener("click", netCreate);
  $("btnJoin").addEventListener("click", netJoin);
  $("btnStart").addEventListener("click", function(){
    $("btnStart").disabled = true;
    api("start", {}).then(function(j){ onState(j.state); })
      .catch(function(e){ toast(e.message); })
      .then(function(){ $("btnStart").disabled = false; });
  });
  $("btnCopy").addEventListener("click", function(){
    var v = $("lobbyLink").value;
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(v).then(function(){ toast("คัดลอกลิงก์แล้ว ส่งให้เพื่อนได้เลย"); },
        function(){ $("lobbyLink").select(); toast("กดค้างที่ช่องแล้วเลือกคัดลอก"); });
    } else { $("lobbyLink").select(); toast("กดค้างที่ช่องแล้วเลือกคัดลอก"); }
  });
  $("btnNew").addEventListener("click", function(){
    if(NET.code) netAgain();
    else { $("win").hidden = true; offStart(); }
  });
  $("wAgain").addEventListener("click", function(){
    if(NET.code) netAgain();
    else { $("win").hidden = true; offStart(); }
  });
  $("wNext").addEventListener("click", function(){
    if(cfg.stage+1 < STAGES.length) cfg.stage++;
    $("win").hidden = true; offStart();
  });
  $("btnHint").addEventListener("click", offHint);
  $("joinCode").addEventListener("input", function(){ this.value = this.value.replace(/\D/g,"").slice(0,4); });
  $("btnSound").addEventListener("click", function(){
    sound = !sound; store("wm.sound", sound);
    this.setAttribute("aria-pressed", String(sound));
    this.textContent = sound ? "🔊" : "🔇";
    if(sound) sFlip();
  });
  $("btnSound").textContent = sound ? "🔊" : "🔇";
  $("btnSound").setAttribute("aria-pressed", String(sound));
  window.addEventListener("beforeunload", function(){
    if(NET.code && NET.pid && navigator.sendBeacon){
      try{
        navigator.sendBeacon("/api/room", new Blob(
          [JSON.stringify({action:"leave", code:NET.code, pid:NET.pid})],
          {type:"application/json"}));
      }catch(e){}
    }
  });

  /* ---------------- เริ่มต้น ---------------- */
  $("myName").value = cfg.myName;
  var qs = new URLSearchParams(location.search);
  var room = qs.get("room");
  if(room && /^\d{4}$/.test(room)){
    cfg.mode = "online";
    drawHome();
    $("joinCode").value = room;
    showScreen("home");
    setTimeout(function(){ $("myName").focus(); }, 300);
    toast("ใส่ชื่อแล้วกด “เข้าห้อง” ได้เลย");
  } else {
    drawHome();
    showScreen("home");
  }
})();
