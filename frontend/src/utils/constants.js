import React from 'react';

/* ─── Design tokens ─── */
export const G    = '#0d5c3a';
export const GOLD = '#f5a623';
export const DARK = '#1a2c4e';
export const BG   = '#f0f4f8';

/* ─── Images universités ─── */
export const UNI_IMAGES = {
  uganc: '/images/uganc.svg',
  ujnk:  '/images/ujnk.svg',
  ul:    '/images/ul.svg',
  uz:    '/images/uz.svg',
  uk:    '/images/uk.svg',
  uglcs: '/images/uglcs.svg',
  ist:   '/images/ist.svg',
  ismgb: '/images/ismgb.svg',
};

export const CSS = `
@*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Inter',system-ui,sans-serif;background:${BG};color:${DARK};min-height:100vh}
input,select,textarea,button{font-family:inherit}
a{color:inherit;text-decoration:none}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}

/* ── Navbar ── */
.nav{position:sticky;top:0;z-index:100;background:${DARK};border-bottom:1px solid rgba(255,255,255,.08)}
.nav-inner{max-width:1280px;margin:0 auto;padding:0 1.5rem;height:62px;display:flex;align-items:center;gap:1rem}
.nav-logo{display:flex;align-items:center;gap:.5rem;font-family:'Sora',sans-serif;font-size:1.2rem;font-weight:700;color:#fff;cursor:pointer;flex-shrink:0}
.nav-dot{width:8px;height:8px;background:${GOLD};border-radius:50%}
.nav-links{display:flex;gap:.2rem;margin-left:1.5rem;flex:1}
.nb{padding:.4rem .85rem;border-radius:8px;font-size:.84rem;font-weight:500;color:rgba(255,255,255,.7);border:none;background:transparent;cursor:pointer;transition:all .15s;white-space:nowrap}
.nb:hover,.nb.active{color:#fff;background:rgba(255,255,255,.12)}
.nav-right{margin-left:auto;display:flex;align-items:center;gap:.6rem;flex-shrink:0}
.nav-avatar{width:32px;height:32px;border-radius:50%;background:${G};display:flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:700;color:#fff;cursor:pointer;flex-shrink:0}
.btn{display:inline-flex;align-items:center;gap:.4rem;padding:.5rem 1.1rem;border-radius:10px;font-size:.875rem;font-weight:600;border:none;cursor:pointer;transition:all .15s;white-space:nowrap}
.btn-primary{background:${G};color:#fff}.btn-primary:hover{background:#0a4e32;transform:translateY(-1px)}
.btn-gold{background:${GOLD};color:${DARK}}.btn-gold:hover{background:#e8961a;transform:translateY(-1px)}
.btn-outline{background:transparent;color:${G};border:1.5px solid ${G}}.btn-outline:hover{background:${G};color:#fff}
.btn-ghost{background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.2)}.btn-ghost:hover{background:rgba(255,255,255,.2)}
.btn-sm{padding:.35rem .8rem;font-size:.8rem}
.btn-lg{padding:.7rem 1.6rem;font-size:1rem}
.btn-danger{background:#ef4444;color:#fff}.btn-danger:hover{background:#dc2626}
.btn-dark{background:${DARK};color:#fff}.btn-dark:hover{background:#0f1e35}
.page{max-width:1280px;margin:0 auto;padding:2rem 1.5rem}

/* ── Hero ── */
.hero{background:linear-gradient(135deg,${DARK} 0%,#0c3d25 55%,${G} 100%);min-height:500px;display:flex;align-items:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/svg%3E")}
.hero-inner{max-width:1280px;margin:0 auto;padding:4rem 1.5rem;display:flex;flex-direction:column;align-items:center;text-align:center;width:100%}
.hero h1{font-family:'Sora',sans-serif;font-size:clamp(2rem,5vw,3.5rem);font-weight:800;color:#fff;line-height:1.15;margin-bottom:1rem;max-width:750px}
.hero h1 em{color:${GOLD};font-style:normal}
.hero p{color:rgba(255,255,255,.75);font-size:1.05rem;line-height:1.7;margin-bottom:1.75rem;max-width:620px}
.hero-stats{display:flex;gap:2.5rem;margin-bottom:2rem;flex-wrap:wrap;justify-content:center}
.hstat-n{font-family:'Sora',sans-serif;font-size:2rem;font-weight:800;color:${GOLD}}
.hstat-l{font-size:.73rem;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.06em;margin-top:.15rem}
.hero-btns{display:flex;gap:.75rem;flex-wrap:wrap;justify-content:center}

/* ── Chat preview ── */
.cp{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.13);border-radius:18px;padding:1.4rem;backdrop-filter:blur(20px)}
.cp-head{display:flex;align-items:center;gap:.65rem;margin-bottom:1.1rem;padding-bottom:.9rem;border-bottom:1px solid rgba(255,255,255,.1)}
.cp-av{width:36px;height:36px;border-radius:50%;background:${G};display:flex;align-items:center;justify-content:center;flex-shrink:0}
.cp-online{margin-left:auto;background:#22c55e;color:#fff;font-size:.68rem;font-weight:700;padding:.2rem .55rem;border-radius:50px}
.cp-bot{background:rgba(255,255,255,.11);color:rgba(255,255,255,.88);border-radius:12px 12px 12px 3px;padding:.65rem .9rem;font-size:.83rem;line-height:1.5;margin-bottom:.5rem}
.cp-usr{background:${G};color:#fff;border-radius:12px 12px 3px 12px;padding:.65rem .9rem;font-size:.83rem;margin-left:auto;max-width:82%;margin-bottom:.5rem}
.cp-hi{color:${GOLD};font-weight:600}

/* ── Cards ── */
.card{background:#fff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;transition:all .2s}
.card:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(13,92,58,.12);border-color:${G}40}
.cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:1.25rem}

/* ── Uni card avec image ── */
.uni-card{background:#fff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;transition:all .2s;cursor:pointer}
.uni-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(13,92,58,.15)}
.uni-card-img{width:100%;height:160px;object-fit:cover;display:block}
.uni-card-img-placeholder{width:100%;height:160px;display:flex;align-items:center;justify-content:center;font-size:3rem}
.uni-card-body{padding:1.1rem 1.25rem}
.uni-card-footer{padding:.75rem 1.25rem;border-top:1px solid #f1f5f9;display:flex;align-items:center;justify-content:space-between}

/* ── Badges ── */
.badge{display:inline-flex;align-items:center;gap:.25rem;padding:.22rem .6rem;border-radius:50px;font-size:.73rem;font-weight:600}
.bg-green{background:#dcfce7;color:#166534}.bg-gold{background:#fef3c7;color:#92400e}
.bg-blue{background:#dbeafe;color:#1e40af}.bg-purple{background:#ede9fe;color:#6b21a8}
.bg-red{background:#fee2e2;color:#991b1b}.bg-teal{background:#ccfbf1;color:#115e59}
.bg-gray{background:#f1f5f9;color:#475569}.bg-dark{background:#1e293b;color:#fff}

/* ── Section ── */
.sec-eyebrow{font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${G};margin-bottom:.4rem}
.sec-title{font-family:'Sora',sans-serif;font-size:clamp(1.5rem,3vw,2.1rem);font-weight:800;color:${DARK};line-height:1.2}
.sec-sub{color:#64748b;margin-top:.4rem;font-size:.95rem;line-height:1.6;max-width:580px}
.sec-head{margin-bottom:2rem}

/* ── Forms ── */
.form-wrap{background:#fff;border-radius:20px;border:1px solid #e2e8f0;padding:2.25rem;max-width:520px;margin:0 auto}
.form-title{font-family:'Sora',sans-serif;font-size:1.4rem;font-weight:800;color:${DARK};margin-bottom:.3rem}
.form-sub{color:#64748b;font-size:.88rem;margin-bottom:1.75rem}
.fg{margin-bottom:1.1rem}
.fl{display:block;font-size:.83rem;font-weight:600;color:${DARK};margin-bottom:.4rem}
.fl span{color:#ef4444}
.fi{width:100%;padding:.6rem .9rem;border-radius:9px;border:1.5px solid #e2e8f0;font-size:.88rem;color:${DARK};background:#fff;outline:none;transition:border .15s}
.fi:focus{border-color:${G};box-shadow:0 0 0 3px ${G}18}
.fsel{width:100%;padding:.6rem .9rem;border-radius:9px;border:1.5px solid #e2e8f0;font-size:.88rem;color:${DARK};background:#fff;outline:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right .75rem center;background-size:16px}
.fsel:focus{border-color:${G};outline:none}
.frow{display:grid;grid-template-columns:1fr 1fr;gap:.9rem}
.alert{padding:.8rem 1rem;border-radius:9px;font-size:.85rem;margin-bottom:.9rem;display:flex;align-items:flex-start;gap:.5rem}
.alert-err{background:#fef2f2;color:#991b1b;border:1px solid #fecaca}
.alert-ok{background:#f0fdf4;color:#166534;border:1px solid #bbf7d0}
.alert-warn{background:#fffbeb;color:#92400e;border:1px solid #fde68a}
.alert-info{background:#eff6ff;color:#1e40af;border:1px solid #bfdbfe}
.sec-lbl{font-size:.74rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${G};margin-bottom:.85rem;display:flex;align-items:center;gap:.5rem}
.sec-lbl::after{content:'';flex:1;height:1px;background:#e2e8f0}
.divider{text-align:center;color:#94a3b8;font-size:.83rem;margin:1.1rem 0;position:relative}
.divider::before{content:'';position:absolute;top:50%;left:0;right:0;height:1px;background:#e2e8f0}
.divider span{background:#fff;padding:0 .7rem;position:relative}

/* ── Filtres ── */
.filter-bar{display:flex;flex-wrap:wrap;gap:.45rem;margin-bottom:1.75rem;background:#fff;padding:.85rem 1.1rem;border-radius:12px;border:1px solid #e2e8f0}
.chip{padding:.35rem .85rem;border-radius:50px;font-size:.8rem;font-weight:500;cursor:pointer;border:1.5px solid transparent;transition:all .15s;background:#f8fafc;color:#64748b}
.chip:hover{border-color:${G};color:${G}}
.chip.active{background:${G};color:#fff;border-color:${G}}

/* ── Filières page ── */
.fc{background:#fff;border-radius:12px;border:1px solid #e2e8f0;padding:1.1rem;transition:all .2s;cursor:pointer}
.fc:hover{border-color:${G}60;box-shadow:0 5px 18px rgba(13,92,58,.1)}
.fgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:.9rem}
.uni-section{margin-bottom:2.5rem}
.uni-bar{border-radius:14px;padding:1.2rem 1.75rem;margin-bottom:1.2rem;display:flex;align-items:center;gap:1.25rem;cursor:pointer}
.uni-bar-img{width:64px;height:64px;border-radius:10px;object-fit:cover;border:2px solid rgba(255,255,255,.3);flex-shrink:0}
.fac-block{border:1px solid #e2e8f0;border-radius:12px;background:#fff;overflow:hidden;margin-bottom:.75rem}
.fac-head{padding:.9rem 1.25rem;display:flex;align-items:center;gap:.75rem;cursor:pointer;transition:background .15s}
.fac-head:hover{background:#f8fafc}

/* ── Chatbot ── */
.chat-layout{height:calc(100vh - 62px);display:flex;overflow:hidden}
.chat-sb{width:255px;background:#fff;border-right:1px solid #e2e8f0;display:flex;flex-direction:column;flex-shrink:0}
.chat-sb-top{padding:.9rem;border-bottom:1px solid #f1f5f9}
.chat-list{flex:1;overflow-y:auto;padding:.4rem}
.ci{padding:.6rem .8rem;border-radius:9px;cursor:pointer;transition:background .15s;display:flex;align-items:center;justify-content:space-between;gap:.4rem}
.ci:hover{background:#f8fafc}
.ci.active{background:${G}14;color:${G}}
.ci-title{font-size:.81rem;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ci-del{background:none;border:none;cursor:pointer;padding:.2rem;color:#94a3b8;flex-shrink:0;opacity:0;transition:opacity .15s}
.ci:hover .ci-del{opacity:1}
.chat-main{flex:1;display:flex;flex-direction:column;overflow:hidden;background:#f8fafc}
.chat-top{background:#fff;border-bottom:1px solid #e2e8f0;padding:.8rem 1.25rem;display:flex;align-items:center;gap:.7rem;flex-shrink:0}
.chat-body{flex:1;overflow-y:auto;padding:1.25rem;display:flex;flex-direction:column;gap:.7rem}
.mr{display:flex;gap:.55rem;align-items:flex-end;max-width:78%}
.mr.u{margin-left:auto;flex-direction:row-reverse}
.mav{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;flex-shrink:0}
.mav.bot{background:${G};color:#fff}
.mav.usr{background:${GOLD};color:${DARK}}
.bub{padding:.7rem .95rem;border-radius:15px;font-size:.86rem;line-height:1.6;word-break:break-word}
.bub.bot{background:#fff;color:${DARK};border:1px solid #e2e8f0;border-bottom-left-radius:3px}
.bub.usr{background:${G};color:#fff;border-bottom-right-radius:3px}
.bub strong,.bub b{color:${G};font-weight:600}
.bub.usr strong,.bub.usr b{color:${GOLD}}
.typing{display:flex;gap:4px;padding:.55rem .8rem;background:#fff;border:1px solid #e2e8f0;border-radius:13px;width:fit-content}
.dot{width:6px;height:6px;background:#94a3b8;border-radius:50%;animation:bop .8s infinite}
.dot:nth-child(2){animation-delay:.15s}.dot:nth-child(3){animation-delay:.3s}
@keyframes bop{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}
.chat-foot{background:#fff;border-top:1px solid #e2e8f0;padding:.9rem 1.25rem;flex-shrink:0}
.qchips{display:flex;flex-wrap:wrap;gap:.35rem;margin-bottom:.65rem}
.qc{padding:.28rem .7rem;border-radius:50px;border:1.5px solid #e2e8f0;font-size:.76rem;cursor:pointer;color:#64748b;background:#fff;transition:all .15s}
.qc:hover{border-color:${G};color:${G}}
.input-row{display:flex;gap:.55rem;align-items:flex-end}
.chat-ta{flex:1;resize:none;border:1.5px solid #e2e8f0;border-radius:12px;padding:.6rem .9rem;font-size:.88rem;color:${DARK};outline:none;max-height:110px;transition:border .15s;background:#fff}
.chat-ta:focus{border-color:${G}}
.send-btn{width:40px;height:40px;border-radius:50%;background:${G};color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s}
.send-btn:hover{background:#0a4e32}
.send-btn:disabled{background:#94a3b8;cursor:not-allowed}
.action-btns{display:flex;gap:.4rem;margin-bottom:.65rem}

/* ── Upload zone ── */
.upload-zone{border:2px dashed #e2e8f0;border-radius:12px;padding:1rem;text-align:center;cursor:pointer;transition:all .2s;background:#fafafa;margin-bottom:.65rem}
.upload-zone:hover,.upload-zone.drag{border-color:${G};background:${G}08}
.upload-zone input{display:none}

/* ── Vocal ── */
.vocal-btn{width:40px;height:40px;border-radius:50%;border:2px solid ${G};background:#fff;color:${G};cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0}
.vocal-btn.recording{background:#ef4444;border-color:#ef4444;color:#fff;animation:pulse-rec .8s ease-in-out infinite}
@keyframes pulse-rec{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}

/* ── Guided modal ── */
.modal-ov{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;display:flex;align-items:center;justify-content:center;padding:1rem}
.modal-box{background:#fff;border-radius:20px;width:100%;max-width:460px;overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,.25)}
.modal-head{background:linear-gradient(135deg,${DARK},${G});padding:1.4rem;display:flex;justify-content:space-between;align-items:center}
.modal-close{background:rgba(255,255,255,.15);border:none;color:#fff;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center}
.modal-body{padding:1.5rem}
.go{display:flex;align-items:center;gap:.65rem;width:100%;padding:.75rem .95rem;border:1.5px solid #e2e8f0;border-radius:11px;background:#fff;cursor:pointer;transition:all .15s;margin-bottom:.45rem;font-size:.88rem;color:${DARK};font-family:inherit;font-weight:500}
.go:hover{border-color:${G};background:${G}08;color:${G}}
.progress-bar{height:3px;background:#e2e8f0;border-radius:2px;margin-bottom:1.25rem;overflow:hidden}
.progress-fill{height:100%;background:${G};border-radius:2px;transition:width .3s}

/* ── Dashboard Admin ── */
.dash-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;margin-bottom:2rem}
.kpi{background:#fff;border-radius:14px;border:1px solid #e2e8f0;padding:1.25rem;display:flex;flex-direction:column;gap:.4rem}
.kpi-val{font-family:'Sora',sans-serif;font-size:2rem;font-weight:800;color:${DARK}}
.kpi-lbl{font-size:.8rem;color:#64748b;font-weight:500}
.kpi-icon{font-size:1.5rem;margin-bottom:.25rem}
.table-wrap{background:#fff;border-radius:14px;border:1px solid #e2e8f0;overflow:hidden;margin-bottom:1.5rem}
.tw-head{padding:1rem 1.25rem;border-bottom:1px solid #f1f5f9;font-weight:700;font-size:.9rem;color:${DARK}}
table{width:100%;border-collapse:collapse}
th{padding:.7rem 1rem;text-align:left;font-size:.78rem;font-weight:700;color:#64748b;background:#f8fafc;text-transform:uppercase;letter-spacing:.04em}
td{padding:.7rem 1rem;font-size:.85rem;color:${DARK};border-top:1px solid #f1f5f9}
tr:hover td{background:#f8fafc}
.bar-chart{display:flex;flex-direction:column;gap:.5rem;padding:1rem 1.25rem}
.bar-row{display:flex;align-items:center;gap:.75rem}
.bar-lbl{font-size:.8rem;color:#64748b;width:80px;flex-shrink:0}
.bar-track{flex:1;height:20px;background:#f1f5f9;border-radius:10px;overflow:hidden}
.bar-fill{height:100%;border-radius:10px;background:${G};transition:width .5s ease}
.bar-val{font-size:.78rem;font-weight:600;color:${DARK};width:40px;text-align:right;flex-shrink:0}
.msg-chart{display:flex;align-items:flex-end;gap:6px;padding:1rem 1.25rem;height:120px}
.msg-bar{flex:1;background:${G}30;border-radius:4px 4px 0 0;position:relative;cursor:default;transition:background .15s}
.msg-bar:hover{background:${G}60}
.msg-bar-lbl{position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);font-size:.68rem;color:#94a3b8;white-space:nowrap}

/* ── Profil ── */
.profil-card{background:#fff;border-radius:18px;border:1px solid #e2e8f0;padding:2rem;max-width:560px;margin:0 auto}
.profil-av{width:76px;height:76px;border-radius:50%;background:linear-gradient(135deg,${DARK},${G});display:flex;align-items:center;justify-content:center;font-size:1.7rem;font-weight:700;color:#fff;margin:0 auto .75rem}

/* ── Spinner ── */
.spinner{width:34px;height:34px;border:3px solid #e2e8f0;border-top-color:${G};border-radius:50%;animation:spin .7s linear infinite;margin:3rem auto}
@keyframes spin{to{transform:rotate(360deg)}}
.full-spin{min-height:400px;display:flex;align-items:center;justify-content:center}
.cp-wrap{display:none}

/* ── Responsive ── */
@media(max-width:900px){.hero-inner{grid-template-columns:1fr}.cp-wrap{display:none}.frow{grid-template-columns:1fr}.chat-sb{display:none}}
@media(max-width:640px){.page{padding:1.25rem .9rem}.hero-inner{padding:2.5rem 1rem}.nav-links{display:none}}
`;

/* ── Icons ── */
export const I = ({ n, s = 18, c = 'currentColor' }) => {
  const p = {
    home:    <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    grid:    <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
    build:   <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></>,
    chat:    <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></>,
    user:    <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    out:     <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    send:    <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    plus:    <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    trash:   <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></>,
    x:       <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    check:   <><polyline points="20 6 9 17 4 12"/></>,
    star:    <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    info:    <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    warn:    <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    robot:   <><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="11"/><line x1="8" y1="15" x2="8" y2="15"/><line x1="16" y1="15" x2="16" y2="15"/></>,
    mic:     <><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>,
    upload:  <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></>,
    file:    <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    dash:    <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="4"/><rect x="14" y="14" width="7" height="4"/></>,
    chevD:   <polyline points="6 9 12 15 18 9"/>,
    chevR:   <polyline points="9 18 15 12 9 6"/>,
    edit:    <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    users:   <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {p[n]}
    </svg>
  );
};

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[tag] || tag));
}

export function md(t) {
  if (!t) return '';
  t = escapeHTML(t);
  return t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\n/g, '<br/>');
}

export function uniColor(sigle) {
  if (!sigle) return G;
  return { uganc:'#1a56db', uk:'#0891b2', ul:'#059669', ujnk:'#dc2626', uz:'#d97706', uglcs:'#7c3aed', ist:'#7c3aed', ismgb:'#92400e' }[sigle.toLowerCase()] || G;
}
export function uniBadge(sigle) {
  if (!sigle) return 'bg-gray';
  return { uganc:'bg-blue', uk:'bg-teal', ul:'bg-green', ujnk:'bg-red', uz:'bg-gold', uglcs:'bg-purple', ist:'bg-purple', ismgb:'bg-gold' }[sigle.toLowerCase()] || 'bg-gray';
}

/* ════════════════ NAVBAR ════════════════ */
