import { useState, useEffect, useRef } from "react";
import * as math from "mathjs";

/* ═══════════════════════════ STYLES ═══════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#080b12;}
.app{min-height:100vh;background:#080b12;color:#e8eaf0;font-family:'Sora',sans-serif;}

/* NAV */
.nav{position:sticky;top:0;z-index:300;background:rgba(8,11,18,0.97);backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,0.06);padding:0 1.5rem;display:flex;align-items:center;height:62px;gap:0.5rem;}
.logo{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:900;background:linear-gradient(135deg,#f0c060,#e0a020);-webkit-background-clip:text;background-clip:text;color:transparent;cursor:pointer;flex-shrink:0;margin-right:1rem;}
.logo span{color:rgba(240,192,96,0.4);font-size:0.7rem;vertical-align:super;}
.nav-links{display:flex;gap:0.2rem;overflow-x:auto;}
.nav-links::-webkit-scrollbar{display:none;}
.nb{background:transparent;border:none;color:rgba(232,234,240,0.42);padding:0.42rem 0.8rem;border-radius:8px;font-family:'Sora',sans-serif;font-size:0.78rem;font-weight:500;cursor:pointer;transition:all 0.18s;white-space:nowrap;}
.nb:hover{color:#e8eaf0;background:rgba(255,255,255,0.05);}
.nb.active{color:#f0c060;background:rgba(240,192,96,0.1);}

/* BUTTONS */
.btn{background:#f0c060;color:#0d0d0d;border:none;border-radius:10px;padding:0.62rem 1.3rem;font-family:'Sora',sans-serif;font-size:0.84rem;font-weight:600;cursor:pointer;transition:all 0.14s;}
.btn:hover{background:#f5cc72;transform:scale(1.02);}
.btn:active{transform:scale(0.97);}
.btn-g{background:transparent;border:1px solid rgba(255,255,255,0.11);color:rgba(232,234,240,0.52);border-radius:10px;padding:0.62rem 1.05rem;font-family:'Sora',sans-serif;font-size:0.81rem;cursor:pointer;transition:all 0.14s;}
.btn-g:hover{border-color:rgba(255,255,255,0.22);color:#e8eaf0;}
.btn-g.danger:hover{background:rgba(248,113,113,0.07);color:#f87171;border-color:rgba(248,113,113,0.2);}
.btn-add{background:transparent;border:1px dashed rgba(255,255,255,0.1);border-radius:12px;padding:0.875rem;color:rgba(232,234,240,0.28);cursor:pointer;font-size:0.81rem;font-family:'Sora',sans-serif;transition:all 0.18s;display:flex;align-items:center;justify-content:center;gap:0.5rem;width:100%;margin-top:0.75rem;}
.btn-add:hover{border-color:rgba(240,192,96,0.35);color:#f0c060;}
.inp{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:0.62rem 1rem;color:#e8eaf0;font-family:'Sora',sans-serif;font-size:0.87rem;outline:none;transition:border-color 0.2s;}
.inp:focus{border-color:rgba(240,192,96,0.45);}
.inp::placeholder{color:rgba(232,234,240,0.18);}
.inline-add{display:flex;gap:0.75rem;align-items:center;margin-top:0.75rem;}
.lbl{font-size:0.69rem;text-transform:uppercase;letter-spacing:0.12em;color:rgba(232,234,240,0.27);font-weight:500;margin-bottom:0.825rem;}
.divider{height:1px;background:rgba(255,255,255,0.06);margin:2rem 0;}
.spin{display:flex;align-items:center;justify-content:center;height:100vh;}
.spin-txt{font-family:'Playfair Display',serif;font-size:1.5rem;color:rgba(232,234,240,0.2);animation:pulse 1.5s ease-in-out infinite;}
@keyframes pulse{0%,100%{opacity:.2}50%{opacity:.7}}

/* HOME PAGE */
.hero{max-width:1000px;margin:0 auto;padding:5rem 2rem 3rem;text-align:center;}
.hero-eyebrow{font-size:0.7rem;letter-spacing:0.17em;text-transform:uppercase;color:rgba(232,234,240,0.28);margin-bottom:1.5rem;font-weight:500;}
.hero-title{font-family:'Playfair Display',serif;font-size:clamp(2.4rem,6vw,4.2rem);font-weight:900;line-height:1.08;color:#e8eaf0;margin-bottom:1rem;letter-spacing:-0.02em;}
.hero-title .g{color:#f0c060;}
.hero-tagline{font-size:clamp(0.92rem,2vw,1.08rem);color:rgba(232,234,240,0.42);font-weight:300;margin-bottom:2rem;}
.hero-ctas{display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;margin-bottom:3rem;}

.stats{display:flex;justify-content:center;gap:48px;margin:40px 0;flex-wrap:wrap;}
.stat-item{text-align:center;}
.stat-number{font-size:36px;font-weight:800;color:#f0c060;}
.stat-label{color:rgba(232,234,240,0.36);font-size:14px;}

.subject-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;max-width:1000px;margin:2rem auto 0;padding:0 2rem;}
.subject-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:1.2rem;cursor:pointer;transition:all 0.2s;}
.subject-card:hover{background:rgba(255,255,255,0.06);border-color:rgba(240,192,96,0.2);transform:translateY(-3px);}
.subject-icon{font-size:1.8rem;margin-bottom:0.6rem;}
.subject-name{font-size:0.9rem;font-weight:600;color:#e8eaf0;margin-bottom:0.2rem;}
.subject-count{font-size:0.7rem;color:rgba(232,234,240,0.28);}

/* BLOG */
.view{max-width:720px;margin:0 auto;padding:2.5rem 2rem;}
.view-title{font-family:'Playfair Display',serif;font-size:1.9rem;font-weight:700;color:#e8eaf0;margin-bottom:0.3rem;}
.view-sub{font-size:0.82rem;color:rgba(232,234,240,0.36);margin-bottom:2rem;}
.sub-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:0.85rem;margin-bottom:1.5rem;}
.sc{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:1.35rem 1.15rem;cursor:pointer;transition:all 0.2s;}
.sc:hover{background:rgba(255,255,255,0.07);border-color:rgba(240,192,96,0.25);transform:translateY(-2px);}
.sc-emoji{font-size:1.55rem;margin-bottom:0.65rem;}
.sc-name{font-size:0.87rem;font-weight:600;color:#e8eaf0;margin-bottom:0.22rem;}
.sc-count{font-size:0.7rem;color:rgba(232,234,240,0.28);}
.topic-item{display:flex;align-items:center;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:0.9rem 1.15rem;cursor:pointer;transition:all 0.18s;gap:1rem;margin-bottom:0.42rem;}
.topic-item:hover{background:rgba(255,255,255,0.06);border-color:rgba(240,192,96,0.2);}
.topic-name{font-size:0.88rem;color:#e8eaf0;flex:1;}
.tbadge{font-size:0.67rem;background:rgba(240,192,96,0.1);color:#f0c060;padding:0.17rem 0.58rem;border-radius:100px;font-weight:500;}
.tbadge.zero{background:transparent;color:rgba(232,234,240,0.2);border:1px solid rgba(232,234,240,0.08);}
.post-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:1.2rem 1.35rem;margin-bottom:0.65rem;}
.post-card-title{font-family:'Playfair Display',serif;font-size:1.02rem;font-weight:700;color:#e8eaf0;margin-bottom:0.38rem;}
.post-card-meta{font-size:0.71rem;color:rgba(232,234,240,0.3);display:flex;gap:0.875rem;margin-bottom:0.85rem;flex-wrap:wrap;font-family:'JetBrains Mono',monospace;}
.post-card-actions{display:flex;gap:0.6rem;flex-wrap:wrap;}

/* EDITOR */
.editor-wrap{max-width:760px;margin:0 auto;padding:1.5rem 2rem 7rem;}
.editor-meta{display:flex;gap:0.6rem;margin-bottom:0.875rem;padding-bottom:0.875rem;border-bottom:1px solid rgba(255,255,255,0.06);flex-wrap:wrap;align-items:center;}
.etag{font-size:0.7rem;background:rgba(240,192,96,0.1);color:#f0c060;padding:0.26rem 0.68rem;border-radius:100px;font-weight:500;}
.save-st{font-size:0.7rem;color:rgba(232,234,240,0.26);margin-left:auto;font-family:'JetBrains Mono',monospace;}
.save-st.ok{color:#86efac;}
.math-toolbar{display:flex;flex-wrap:wrap;gap:0.28rem;padding:0.55rem 0.65rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:9px;margin-bottom:0.875rem;align-items:center;}
.mt-lbl{font-size:0.65rem;color:rgba(232,234,240,0.28);font-weight:500;margin-right:0.2rem;}
.mt-btn{background:rgba(255,255,255,0.04);border:none;border-radius:5px;padding:0.26rem 0.45rem;font-family:'JetBrains Mono',monospace;font-size:0.82rem;color:rgba(232,234,240,0.55);cursor:pointer;transition:all 0.12s;}
.mt-btn:hover{background:rgba(240,192,96,0.12);color:#f0c060;}
.title-inp{width:100%;background:transparent;border:none;outline:none;font-family:'Playfair Display',serif;font-size:clamp(1.5rem,4vw,2.2rem);font-weight:700;color:#e8eaf0;margin-bottom:1.2rem;line-height:1.2;resize:none;caret-color:#f0c060;display:block;}
.title-inp::placeholder{color:rgba(232,234,240,0.13);}
.content-inp{width:100%;background:transparent;border:none;outline:none;font-family:'JetBrains Mono',monospace;font-size:0.94rem;color:rgba(232,234,240,0.72);line-height:2;resize:none;min-height:55vh;caret-color:#f0c060;}
.content-inp::placeholder{color:rgba(232,234,240,0.09);}
.editor-bar{display:flex;gap:0.6rem;align-items:center;padding:0.85rem 2rem;border-top:1px solid rgba(255,255,255,0.06);position:sticky;bottom:0;background:rgba(8,11,18,0.97);backdrop-filter:blur(14px);}
.wc{font-size:0.7rem;color:rgba(232,234,240,0.2);font-family:'JetBrains Mono',monospace;}
.math-clip-banner{background:rgba(240,192,96,0.08);border:1px solid rgba(240,192,96,0.2);border-radius:9px;padding:0.65rem 1rem;margin-bottom:0.875rem;display:flex;align-items:center;gap:0.75rem;font-size:0.8rem;color:rgba(232,234,240,0.7);}
.math-clip-eq{font-family:'JetBrains Mono',monospace;font-size:0.75rem;color:#f0c060;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}

/* PREVIEW */
.prev-wrap{max-width:680px;margin:0 auto;padding:3rem 2rem 6rem;}
.prev-tag{font-size:0.67rem;letter-spacing:0.13em;text-transform:uppercase;font-weight:600;color:#f0c060;margin-bottom:1.5rem;display:block;}
.prev-title{font-family:'Playfair Display',serif;font-size:clamp(1.85rem,5vw,3rem);font-weight:900;line-height:1.1;color:#e8eaf0;margin-bottom:1.5rem;letter-spacing:-0.02em;}
.prev-byline{display:flex;align-items:center;gap:1rem;padding:1.2rem 0;border-top:1px solid rgba(255,255,255,0.07);border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:2.5rem;}
.prev-avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f0c060,#e07820);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;color:#0d0d0d;flex-shrink:0;}
.prev-author{font-size:0.87rem;font-weight:600;color:#e8eaf0;}
.prev-date{font-size:0.74rem;color:rgba(232,234,240,0.33);margin-top:0.1rem;}
.prev-read{font-size:0.7rem;color:rgba(232,234,240,0.26);margin-left:auto;font-family:'JetBrains Mono',monospace;}
.prev-divider{width:48px;height:3px;background:#f0c060;margin:0 0 2.5rem;border-radius:2px;}
.prev-body{font-family:'Sora',sans-serif;font-size:1.05rem;line-height:2;color:rgba(232,234,240,0.78);}
.prev-body p{margin-bottom:1.5rem;white-space:pre-wrap;}
.prev-body p:first-child::first-letter{font-family:'Playfair Display',serif;font-size:4rem;font-weight:900;line-height:0.78;float:left;margin:0.08em 0.1em 0 0;color:#f0c060;}
.prev-actions{margin-top:3rem;padding-top:2rem;border-top:1px solid rgba(255,255,255,0.07);display:flex;gap:0.75rem;}

/* FLOATING CALCULATOR */
.calc-fab{position:fixed;bottom:1.75rem;right:1.75rem;z-index:500;width:50px;height:50px;border-radius:50%;background:#f0c060;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.2rem;box-shadow:0 6px 20px rgba(240,192,96,0.35);transition:all 0.2s;font-family:'JetBrains Mono',monospace;font-weight:700;}
.calc-fab:hover{background:#f5cc72;transform:scale(1.08);}
.calc-panel{position:fixed;right:0;top:0;bottom:0;z-index:499;width:340px;background:#0b0e17;border-left:1px solid rgba(255,255,255,0.07);transform:translateX(100%);transition:transform 0.28s cubic-bezier(0.4,0,0.2,1);display:flex;flex-direction:column;overflow-y:auto;}
.calc-panel.open{transform:translateX(0);}
.calc-ph{display:flex;align-items:center;justify-content:space-between;padding:0.875rem 1.2rem;border-bottom:1px solid rgba(255,255,255,0.06);flex-shrink:0;}
.calc-ph-title{font-family:'Playfair Display',serif;font-size:0.95rem;font-weight:700;color:#e8eaf0;}
.calc-ph-sub{font-size:0.68rem;color:rgba(232,234,240,0.3);margin-top:0.1rem;}
.calc-close{background:transparent;border:none;color:rgba(232,234,240,0.38);cursor:pointer;font-size:1.1rem;padding:0.22rem;line-height:1;}
.calc-close:hover{color:#e8eaf0;}
.calc-inner{padding:1rem;flex:1;}
.calc-display{background:#070a0f;border:1px solid rgba(255,255,255,0.05);border-radius:11px;padding:0.9rem 1.1rem;margin-bottom:0.9rem;text-align:right;min-height:78px;}
.calc-expr{font-family:'JetBrains Mono',monospace;font-size:0.7rem;color:rgba(232,234,240,0.28);min-height:0.95rem;margin-bottom:0.3rem;word-break:break-all;}
.calc-num{font-family:'JetBrains Mono',monospace;font-size:1.75rem;font-weight:500;color:#e8eaf0;word-break:break-all;}
.calc-num.err{color:#f87171;font-size:0.9rem;}
.calc-modes{display:flex;gap:0.3rem;margin-bottom:0.72rem;}
.mdbtn{flex:1;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:6px;padding:0.28rem;font-size:0.68rem;font-weight:500;font-family:'JetBrains Mono',monospace;color:rgba(232,234,240,0.32);cursor:pointer;transition:all 0.14s;}
.mdbtn.on{background:rgba(240,192,96,0.1);border-color:rgba(240,192,96,0.28);color:#f0c060;}
.calc-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:0.32rem;}
.cb{background:rgba(255,255,255,0.05);border-radius:8px;padding:0.58rem 0.12rem;font-family:'JetBrains Mono',monospace;font-size:0.7rem;font-weight:500;color:rgba(232,234,240,0.6);cursor:pointer;transition:all 0.1s;text-align:center;border:none;}
.cb:hover{background:rgba(255,255,255,0.1);color:#e8eaf0;}
.cb:active{transform:scale(0.91);}
.cb.op{color:#60a5fa;background:rgba(96,165,250,0.07);}
.cb.eq{background:#f0c060;color:#0d0d0d;font-weight:700;font-size:0.9rem;}
.cb.clr{color:#f87171;background:rgba(248,113,113,0.07);}
.cb.fn{color:#a78bfa;background:rgba(167,139,250,0.07);font-size:0.63rem;}
.cb.mem{color:#34d399;background:rgba(52,211,153,0.06);font-size:0.64rem;}
.span2{grid-column:span 2;}

/* MATH LAB */
.mlab{max-width:920px;margin:0 auto;padding:2rem 2rem 5rem;}
.sec-title{font-family:'Playfair Display',serif;font-size:1.72rem;font-weight:700;color:#e8eaf0;margin-bottom:0.32rem;}
.sec-sub{font-size:0.81rem;color:rgba(232,234,240,0.36);margin-bottom:1.6rem;}
.sym-tabs{display:flex;gap:0.28rem;flex-wrap:wrap;margin-bottom:0.75rem;}
.sym-tab{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:7px;padding:0.32rem 0.72rem;font-size:0.74rem;font-family:'Sora',sans-serif;color:rgba(232,234,240,0.42);cursor:pointer;transition:all 0.14s;white-space:nowrap;}
.sym-tab.on{background:rgba(240,192,96,0.1);border-color:rgba(240,192,96,0.28);color:#f0c060;}
.sym-palette{display:flex;flex-wrap:wrap;gap:0.32rem;padding:0.875rem;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:12px;margin-bottom:0.875rem;min-height:72px;align-items:flex-start;align-content:flex-start;}
.sym-btn{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.07);border-radius:7px;padding:0.35rem 0.52rem;font-family:'JetBrains Mono',monospace;font-size:0.84rem;color:rgba(232,234,240,0.65);cursor:pointer;transition:all 0.11s;min-width:2rem;text-align:center;}
.sym-btn:hover{background:rgba(240,192,96,0.1);border-color:rgba(240,192,96,0.3);color:#f0c060;}
.eq-box{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:12px;padding:1rem 1.2rem;font-family:'JetBrains Mono',monospace;font-size:1.08rem;color:#e8eaf0;outline:none;resize:none;min-height:78px;caret-color:#f0c060;transition:border-color 0.2s;line-height:1.6;}
.eq-box:focus{border-color:rgba(240,192,960,0.38);}
.eq-box::placeholder{color:rgba(232,234,240,0.13);font-size:0.82rem;font-family:'Sora',sans-serif;}
.mlab-actions{display:flex;gap:0.6rem;flex-wrap:wrap;margin-top:0.825rem;align-items:center;}
.mlab-result{border-radius:12px;padding:1.2rem 1.4rem;margin-top:0.875rem;}
.mlab-result.ok{background:rgba(134,239,172,0.06);border:1px solid rgba(134,239,172,0.14);}
.mlab-result.err{background:rgba(248,113,113,0.06);border:1px solid rgba(248,113,113,0.14);}
.mlab-rlbl{font-size:0.67rem;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:0.55rem;font-weight:500;}
.mlab-result.ok .mlab-rlbl{color:rgba(134,239,172,0.45);}
.mlab-result.err .mlab-rlbl{color:rgba(248,113,113,0.45);}
.mlab-rval{font-family:'JetBrains Mono',monospace;font-size:1.28rem;font-weight:500;word-break:break-all;}
.mlab-result.ok .mlab-rval{color:#86efac;}
.mlab-result.err .mlab-rval{color:#f87171;font-size:0.84rem;}
.mlab-extra{font-size:0.76rem;color:rgba(232,234,240,0.33);margin-top:0.42rem;font-family:'JetBrains Mono',monospace;}
.fix-dlg{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:1.2rem;margin-top:0.875rem;}
.fix-q{font-size:0.88rem;color:#e8eaf0;font-weight:500;margin-bottom:0.825rem;}
.fix-q span{color:rgba(232,234,240,0.45);display:block;font-size:0.76rem;font-weight:400;margin-top:0.3rem;}
.fix-btns{display:flex;gap:0.6rem;flex-wrap:wrap;}
.saved-list{margin-top:0.5rem;}
.saved-item{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:0.95rem 1.2rem;margin-bottom:0.45rem;display:flex;gap:0.875rem;align-items:flex-start;}
.saved-eq{font-family:'JetBrains Mono',monospace;font-size:0.82rem;color:#f0c060;flex:1;}
.saved-res{font-size:0.77rem;color:rgba(232,234,240,0.45);margin-top:0.18rem;}
.saved-del{background:transparent;border:none;color:rgba(248,113,113,0.35);cursor:pointer;font-size:0.78rem;padding:0.18rem;flex-shrink:0;}
.saved-del:hover{color:#f87171;}

/* FLOWCHART */
.flow-wrap{display:flex;height:calc(100vh - 62px);overflow:hidden;}
.flow-sidebar{width:185px;flex-shrink:0;background:#0a0d14;border-right:1px solid rgba(255,255,255,0.06);padding:0.875rem 0.75rem;overflow-y:auto;display:flex;flex-direction:column;gap:0.38rem;}
.flow-stitle{font-size:0.67rem;text-transform:uppercase;letter-spacing:0.12em;color:rgba(232,234,240,0.26);font-weight:500;padding:0.3rem 0.4rem;margin-bottom:0.2rem;}
.fsb{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:0.5rem 0.65rem;cursor:pointer;transition:all 0.14s;display:flex;align-items:center;gap:0.55rem;font-size:0.76rem;color:rgba(232,234,240,0.55);font-family:'Sora',sans-serif;text-align:left;}
.fsb:hover{background:rgba(255,255,255,0.08);color:#e8eaf0;}
.fsb.active{background:rgba(240,192,96,0.1);border-color:rgba(240,192,96,0.28);color:#f0c060;}
.fsp{width:26px;height:18px;flex-shrink:0;}
.flow-area{flex:1;display:flex;flex-direction:column;min-width:0;}
.flow-toolbar{display:flex;gap:0.35rem;padding:0.5rem 0.875rem;background:#0a0d14;border-bottom:1px solid rgba(255,255,255,0.06);flex-wrap:wrap;align-items:center;}
.ftbtn{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.07);border-radius:7px;padding:0.33rem 0.78rem;font-family:'Sora',sans-serif;font-size:0.75rem;font-weight:500;color:rgba(232,234,240,0.48);cursor:pointer;transition:all 0.14s;}
.ftbtn:hover{background:rgba(255,255,255,0.1);color:#e8eaf0;}
.ftbtn.on{background:rgba(240,192,96,0.1);border-color:rgba(240,192,96,0.28);color:#f0c060;}
.ftbtn:disabled{opacity:0.3;cursor:not-allowed;}
.flow-hint{font-size:0.7rem;color:rgba(232,234,240,0.22);margin-left:auto;}
.flow-canvas-wrap{flex:1;overflow:auto;position:relative;}
.label-inp-wrap{position:absolute;z-index:10;pointer-events:none;}
.label-inp{pointer-events:all;background:#0b0e17;border:1.5px solid #f0c060;border-radius:6px;padding:0.26rem 0.48rem;color:#e8eaf0;font-family:'JetBrains Mono',monospace;font-size:0.78rem;outline:none;min-width:90px;max-width:160px;}

/* ROUGH PAGE */
.rough-wrap{padding:1.5rem 2rem 3rem;}
.rough-tabs{display:flex;gap:0.28rem;margin-bottom:0.825rem;}
.rtab{background:transparent;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:0.35rem 0.875rem;font-size:0.77rem;font-family:'Sora',sans-serif;color:rgba(232,234,240,0.36);cursor:pointer;transition:all 0.14s;}
.rtab.on{background:rgba(240,192,960,0.1);border-color:rgba(240,192,96,0.28);color:#f0c060;}
.rough-bar{display:flex;align-items:center;gap:0.45rem;flex-wrap:wrap;margin-bottom:0.875rem;}
.tbtn{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.07);border-radius:7px;padding:0.38rem 0.75rem;font-family:'Sora',sans-serif;font-size:0.74rem;font-weight:500;color:rgba(232,234,240,0.48);cursor:pointer;transition:all 0.14s;}
.tbtn:hover{background:rgba(255,255,255,0.1);color:#e8eaf0;}
.tbtn.on{background:rgba(240,192,96,0.1);border-color:rgba(240,192,96,0.25);color:#f0c060;}
.canvas-wrap{background:#f8f7f3;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);}
canvas{display:block;touch-action:none;}
.note-area{width:100%;background:#f8f7f3;border-radius:14px;border:none;outline:none;padding:2rem;font-family:'JetBrains Mono',monospace;font-size:0.87rem;color:#1a1a2e;line-height:2;resize:none;min-height:72vh;background-image:repeating-linear-gradient(transparent,transparent 31px,#e0ddd5 31px,#e0ddd5 32px);background-size:100% 32px;background-attachment:local;}
.color-swatch{width:24px;height:24px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:all 0.14s;flex-shrink:0;}
.color-swatch.picked{border-color:#f0c060;transform:scale(1.15);}
.size-slider{accent-color:#f0c060;width:75px;cursor:pointer;}

::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:rgba(240,192,96,0.14);border-radius:2px;}
`;

/* ═══════════════════════════ SYMBOL GROUPS ═══════════════════════════ */
const SYM = {
  "Basic":        [{d:"+",v:"+"},{d:"−",v:"-"},{d:"×",v:"*"},{d:"÷",v:"/"},{d:"=",v:"="},{d:"≠",v:"!="},{d:"<",v:"<"},{d:">",v:">"},{d:"≤",v:"<="},{d:"≥",v:">="},{d:"±",v:"±"},{d:"%",v:"%"},{d:".",v:"."},{d:",",v:","}],
  "Brackets":     [{d:"(",v:"("},{d:")",v:")"},{d:"[",v:"["},{d:"]",v:"]"},{d:"{",v:"{"},{d:"}",v:"}"},{d:"|x|",v:"abs("},{d:"⌊x⌋",v:"floor("},{d:"⌈x⌉",v:"ceil("},{d:"‖v‖",v:"norm("}],
  "Powers":       [{d:"xⁿ",v:"^"},{d:"x²",v:"^2"},{d:"x³",v:"^3"},{d:"√",v:"sqrt("},{d:"∛",v:"cbrt("},{d:"∜",v:"nthRoot("},{d:"eˣ",v:"exp("},{d:"10ˣ",v:"10^"},{d:"log₁₀",v:"log10("},{d:"logₙ",v:"log("},{d:"ln",v:"log("}],
  "Calculus":     [{d:"∫",v:"∫ "},{d:"∬",v:"∬ "},{d:"∭",v:"∭ "},{d:"∮",v:"∮ "},{d:"d/dx",v:"d/dx "},{d:"∂/∂x",v:"∂/∂x "},{d:"∂²/∂x²",v:"∂²/∂x² "},{d:"dy/dx",v:"dy/dx "},{d:"∑",v:"∑"},{d:"∏",v:"∏"},{d:"lim",v:"lim "},{d:"lim→∞",v:"lim_{x→∞}"},{d:"Δ",v:"Δ"},{d:"∇",v:"∇"},{d:"∞",v:"Infinity"}],
  "Greek":        [{d:"α",v:"alpha"},{d:"β",v:"beta"},{d:"γ",v:"gamma"},{d:"δ",v:"delta"},{d:"ε",v:"epsilon"},{d:"θ",v:"theta"},{d:"λ",v:"lambda"},{d:"μ",v:"mu"},{d:"ν",v:"nu"},{d:"ξ",v:"xi"},{d:"π",v:"pi"},{d:"ρ",v:"rho"},{d:"σ",v:"sigma"},{d:"τ",v:"tau"},{d:"φ",v:"phi"},{d:"χ",v:"chi"},{d:"ψ",v:"psi"},{d:"ω",v:"omega"},{d:"Γ",v:"Gamma"},{d:"Δ",v:"Delta"},{d:"Θ",v:"Theta"},{d:"Λ",v:"Lambda"},{d:"Ξ",v:"Xi"},{d:"Π",v:"Pi"},{d:"Σ",v:"Sigma"},{d:"Φ",v:"Phi"},{d:"Ψ",v:"Psi"},{d:"Ω",v:"Omega"}],
  "Trigonometry": [{d:"sin(",v:"sin("},{d:"cos(",v:"cos("},{d:"tan(",v:"tan("},{d:"cot(",v:"cot("},{d:"sec(",v:"sec("},{d:"csc(",v:"csc("},{d:"sin⁻¹",v:"asin("},{d:"cos⁻¹",v:"acos("},{d:"tan⁻¹",v:"atan("},{d:"sinh(",v:"sinh("},{d:"cosh(",v:"cosh("},{d:"tanh(",v:"tanh("},{d:"°",v:"°"},{d:"°→rad",v:"*pi/180"}],
  "Logic":        [{d:"∧",v:" and "},{d:"∨",v:" or "},{d:"¬",v:"not "},{d:"→",v:" → "},{d:"↔",v:" ↔ "},{d:"∀",v:"∀"},{d:"∃",v:"∃"},{d:"⊕",v:" xor "},{d:"⊗",v:"⊗"},{d:"NAND",v:" nand "},{d:"NOR",v:" nor "}],
  "Sets":         [{d:"∈",v:"∈"},{d:"∉",v:"∉"},{d:"⊂",v:"⊂"},{d:"⊃",v:"⊃"},{d:"⊆",v:"⊆"},{d:"⊇",v:"⊇"},{d:"∪",v:"∪"},{d:"∩",v:"∩"},{d:"∅",v:"∅"},{d:"ℝ",v:"ℝ"},{d:"ℤ",v:"ℤ"},{d:"ℕ",v:"ℕ"},{d:"ℚ",v:"ℚ"},{d:"ℂ",v:"ℂ"},{d:"Aᶜ",v:"Aᶜ"}],
  "Num. Theory":  [{d:"mod",v:" mod "},{d:"gcd(",v:"gcd("},{d:"lcm(",v:"lcm("},{d:"n!",v:"!"},{d:"nCr",v:"combinations("},{d:"nPr",v:"permutations("},{d:"φ(n)",v:"φ("},{d:"≡",v:" ≡ "},{d:"|",v:"|"},{d:"∤",v:"∤"}],
  "Matrices":     [{d:"[",v:"["},{d:"]",v:"]"},{d:"det(",v:"det(["},{d:"inv(",v:"inv(["},{d:"transp.",v:"transpose(["},{d:"dot(",v:"dot("},{d:"cross(",v:"cross("},{d:"rank(",v:"rank(["},{d:"trace(",v:"trace(["},{d:"size(",v:"size("}],
  "Statistics":   [{d:"mean(",v:"mean("},{d:"std(",v:"std("},{d:"var(",v:"variance("},{d:"median(",v:"median("},{d:"min(",v:"min("},{d:"max(",v:"max("},{d:"sum(",v:"sum("},{d:"size(",v:"size("}],
};

const BLOG_SYMS = [
  {d:"∑",v:"∑"},{d:"∫",v:"∫"},{d:"√",v:"√"},{d:"²",v:"²"},{d:"³",v:"³"},{d:"π",v:"π"},{d:"∞",v:"∞"},
  {d:"α",v:"α"},{d:"β",v:"β"},{d:"θ",v:"θ"},{d:"λ",v:"λ"},{d:"μ",v:"μ"},{d:"σ",v:"σ"},{d:"φ",v:"φ"},
  {d:"≤",v:"≤"},{d:"≥",v:"≥"},{d:"≠",v:"≠"},{d:"∈",v:"∈"},{d:"∴",v:"∴"},{d:"⇒",v:"⇒"},{d:"⇔",v:"⇔"},
];

/* ═══════════════════════════ GATE CSE SUBJECTS (11) ═══════════════════════════ */
const SUBJECTS = [
  {id:"algorithms",   name:"Algorithms",         emoji:"📊", desc:"Sorting, Searching, DP, Graph Algorithms"},
  {id:"data_structures", name:"Data Structures", emoji:"💾", desc:"Arrays, Linked Lists, Trees, HashMaps, Heaps"},
  {id:"os",           name:"Operating Systems",  emoji:"🖥️", desc:"Process Scheduling, Memory, Deadlocks, File Systems"},
  {id:"cn",           name:"Computer Networks",  emoji:"🌐", desc:"OSI Model, TCP/IP, Routing, DNS, HTTP"},
  {id:"dbms",         name:"DBMS",               emoji:"🗄️", desc:"SQL, Normalization, Transactions, Indexing"},
  {id:"coa",          name:"Computer Organization", emoji:"⚙️", desc:"Pipelining, Cache Memory, ALU, I/O"},
  {id:"dm",           name:"Discrete Mathematics", emoji:"🔢", desc:"Set Theory, Logic, Combinatorics, Graph Theory"},
  {id:"em",           name:"Engineering Mathematics", emoji:"📐", desc:"Linear Algebra, Calculus, Probability, Statistics"},
  {id:"de",           name:"Digital Electronics", emoji:"🔌", desc:"Boolean Algebra, K-Maps, Sequential Circuits"},
  {id:"compiler",     name:"Compiler Design",    emoji:"📝", desc:"Lexical Analysis, Parsing, SDT, Optimization"},
  {id:"toc",          name:"Theory of Computation", emoji:"🎯", desc:"Finite Automata, Grammars, Turing Machines"},
];

const TOPICS = {
  algorithms:     ["Sorting Algorithms","Searching Algorithms","Dynamic Programming","Graph Algorithms","Greedy Algorithms","Divide & Conquer"],
  data_structures:["Arrays","Linked Lists","Stacks & Queues","Trees","Graphs","Hash Tables","Heaps"],
  os:             ["Process Management","CPU Scheduling","Synchronization","Deadlocks","Memory Management","File Systems"],
  cn:             ["Physical Layer","Data Link Layer","Network Layer","Transport Layer","Application Layer","Network Security"],
  dbms:           ["ER Model","SQL","Normalization","Transactions","Indexing","Concurrency Control"],
  coa:            ["Number Systems","ALU Design","Pipelining","Cache Memory","I/O Organization","Control Unit"],
  dm:             ["Set Theory","Logic","Combinatorics","Graph Theory","Group Theory","Lattices"],
  em:             ["Linear Algebra","Calculus","Differential Equations","Probability","Statistics","Numerical Methods"],
  de:             ["Boolean Algebra","K-Maps","Combinational Circuits","Sequential Circuits","Counters","Memory"],
  compiler:       ["Lexical Analysis","Syntax Analysis","Semantic Analysis","Code Generation","Code Optimization"],
  toc:            ["Finite Automata","Regular Expressions","Context Free Grammars","Pushdown Automata","Turing Machines"],
};

/* ═══════════════════════════ UTILS ═══════════════════════════ */
const fmt   = d => new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
const wc    = t => t.trim().split(/\s+/).filter(Boolean).length;
const rt    = t => Math.max(1,Math.round(wc(t)/200));
const fmtN  = n => { if(!isFinite(n)) return "Error"; return parseFloat(n.toPrecision(12)).toString(); };

function getCenter(s)  { return {x:s.x+(s.w||140)/2, y:s.y+(s.h||60)/2}; }
function getEdge(s,tx,ty) {
  const w=s.w||140, h=s.h||60, cx=s.x+w/2, cy=s.y+h/2;
  const dx=tx-cx, dy=ty-cy;
  if(s.type==="connector"){ const r=20,a=Math.atan2(dy,dx); return {x:cx+r*Math.cos(a),y:cy+r*Math.sin(a)}; }
  if(s.type==="start_end"||s.type==="terminator"){ const rx=w/2,ry=h/2,a=Math.atan2(dy*rx,dx*ry); return {x:cx+rx*Math.cos(a),y:cy+ry*Math.sin(a)}; }
  if(Math.abs(dx)*h > Math.abs(dy)*w){
    const side=dx>0?1:-1; return {x:cx+side*w/2,y:cy+dy*(w/2)/Math.abs(dx||0.001)};
  } else {
    const side=dy>0?1:-1; return {x:cx+dx*(h/2)/Math.abs(dy||0.001),y:cy+side*h/2};
  }
}

/* ═══════════════════════════ FLOWCHART SHAPES ═══════════════════════════ */
const FSHAPES = [
  {type:"start_end",   label:"Start / End",      color:"#166534"},
  {type:"process",     label:"Process",           color:"#1e3a5f"},
  {type:"decision",    label:"Decision",          color:"#713f12"},
  {type:"data",        label:"Data I/O",          color:"#4c1d95"},
  {type:"predefined",  label:"Predefined",        color:"#374151"},
  {type:"connector",   label:"Connector",         color:"#831843"},
  {type:"document",    label:"Document",          color:"#0f766e"},
  {type:"manual",      label:"Manual Input",      color:"#374151"},
  {type:"database",    label:"Database",          color:"#7c3aed"},
  {type:"delay",       label:"Delay",             color:"#374151"},
  {type:"annotation",  label:"Annotation / Note", color:"#1e293b"},
];

function FPrev({type,color}) {
  const p = {stroke:"rgba(255,255,255,0.25)",strokeWidth:1,fill:color};
  switch(type){
    case"start_end": return <svg viewBox="0 0 28 18" className="fsp"><ellipse cx="14" cy="9" rx="13" ry="8" {...p}/></svg>;
    case"process":   return <svg viewBox="0 0 28 18" className="fsp"><rect x="1" y="2" width="26" height="14" rx="1" {...p}/></svg>;
    case"decision":  return <svg viewBox="0 0 28 18" className="fsp"><polygon points="14,1 27,9 14,17 1,9" {...p}/></svg>;
    case"data":      return <svg viewBox="0 0 28 18" className="fsp"><polygon points="5,1 27,1 23,17 1,17" {...p}/></svg>;
    case"predefined":return <svg viewBox="0 0 28 18" className="fsp"><rect x="1" y="2" width="26" height="14" rx="1" {...p}/><line x1="5" y1="2" x2="5" y2="16" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/><line x1="23" y1="2" x2="23" y2="16" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/></svg>;
    case"connector": return <svg viewBox="0 0 28 18" className="fsp"><circle cx="14" cy="9" r="8" {...p}/></svg>;
    case"document":  return <svg viewBox="0 0 28 18" className="fsp"><path d="M1,1 L27,1 L27,12 Q20,18 14,12 Q8,6 1,12 Z" {...p}/></svg>;
    case"manual":    return <svg viewBox="0 0 28 18" className="fsp"><polygon points="5,1 27,1 27,17 1,17" {...p}/></svg>;
    case"database":  return <svg viewBox="0 0 28 18" className="fsp"><rect x="2" y="5" width="24" height="11" {...p}/><ellipse cx="14" cy="5" rx="12" ry="4" {...p}/></svg>;
    case"delay":     return <svg viewBox="0 0 28 18" className="fsp"><path d="M1,1 L20,1 Q27,9 20,17 L1,17 Z" {...p}/></svg>;
    default:         return <svg viewBox="0 0 28 18" className="fsp"><rect x="1" y="2" width="26" height="14" rx="3" fill="transparent" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="4,2"/></svg>;
  }
}

function FShape({s, selected, connectSrc, onSel, onDragStart, onDblClick}) {
  const {type,x,y,label} = s;
  const w=s.w||140, h=s.h||60;
  const cx=x+w/2, cy=y+h/2;
  const str = selected ? "#f0c060" : connectSrc ? "#60a5fa" : "rgba(255,255,255,0.18)";
  const sw  = selected||connectSrc ? 2 : 1.5;
  const fill= s.color||"#1e3a5f";
  const handlers = {onMouseDown:e=>onDragStart(e,s.id), onClick:e=>{e.stopPropagation();onSel(s.id);}, onDoubleClick:e=>{e.stopPropagation();onDblClick(s.id,cx,cy);}};
  const txt = <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="#e8eaf0" fontSize="11" fontFamily="JetBrains Mono,monospace" style={{pointerEvents:"none",userSelect:"none"}} >{label||type}</text>;

  switch(type){
    case"start_end": return <g {...handlers}><ellipse cx={cx} cy={cy} rx={w/2} ry={h/2} fill={fill} stroke={str} strokeWidth={sw}/>{txt}</g>;
    case"decision":  { const pts=`${cx},${y} ${x+w},${cy} ${cx},${y+h} ${x},${cy}`; return <g {...handlers}><polygon points={pts} fill={fill} stroke={str} strokeWidth={sw}/>{txt}</g>; }
    case"data":      { const sk=14; const pts=`${x+sk},${y} ${x+w},${y} ${x+w-sk},${y+h} ${x},${y+h}`; return <g {...handlers}><polygon points={pts} fill={fill} stroke={str} strokeWidth={sw}/>{txt}</g>; }
    case"connector": return <g {...handlers}><circle cx={cx} cy={cy} r={Math.min(w,h)/2} fill={fill} stroke={str} strokeWidth={sw}/>{txt}</g>;
    case"document":  { const dp=`M${x},${y} L${x+w},${y} L${x+w},${y+h-10} Q${x+3*w/4},${y+h+6} ${x+w/2},${y+h-10} Q${x+w/4},${y+h-26} ${x},${y+h-10} Z`; return <g {...handlers}><path d={dp} fill={fill} stroke={str} strokeWidth={sw}/>{txt}</g>; }
    case"predefined":return <g {...handlers}><rect x={x} y={y} width={w} height={h} rx={3} fill={fill} stroke={str} strokeWidth={sw}/><line x1={x+12} y1={y} x2={x+12} y2={y+h} stroke="rgba(255,255,255,0.2)" strokeWidth="1"/><line x1={x+w-12} y1={y} x2={x+w-12} y2={y+h} stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>{txt}</g>;
    case"manual":    { const pts=`${x+18},${y} ${x+w},${y} ${x+w},${y+h} ${x},${y+h}`; return <g {...handlers}><polygon points={pts} fill={fill} stroke={str} strokeWidth={sw}/>{txt}</g>; }
    case"database":  { const ry=10; return <g {...handlers}><rect x={x} y={y+ry} width={w} height={h-ry} fill={fill} stroke={str} strokeWidth={sw}/><ellipse cx={cx} cy={y+ry} rx={w/2} ry={ry} fill="rgba(255,255,255,0.08)" stroke={str} strokeWidth={sw}/><ellipse cx={cx} cy={y+ry} rx={w/2} ry={ry} fill={fill} stroke={str} strokeWidth={sw} opacity={0.7}/>{txt}</g>; }
    case"delay":     { const dp=`M${x},${y} L${x+w-h/2},${y} Q${x+w},${cy} ${x+w-h/2},${y+h} L${x},${y+h} Z`; return <g {...handlers}><path d={dp} fill={fill} stroke={str} strokeWidth={sw}/>{txt}</g>; }
    case"annotation":return <g {...handlers}><rect x={x} y={y} width={w} height={h} rx={4} fill="rgba(255,255,255,0.04)" stroke={str} strokeWidth={1} strokeDasharray="5,3"/>{txt}</g>;
    default:         return <g {...handlers}><rect x={x} y={y} width={w} height={h} rx={4} fill={fill} stroke={str} strokeWidth={sw}/>{txt}</g>;
  }
}

/* ═══════════════════════════ SQLite (IndexedDB) DATABASE LAYER ═══════════════════════════ */
// This creates a full SQL database in your browser using IndexedDB
// No backend server, no API costs, completely free and persistent

class Database {
  constructor() {
    this.dbName = "DanishosphereDB";
    this.version = 2;
    this.db = null;
    this.initPromise = null;
  }

  async init() {
    if (this.initPromise) return this.initPromise;
    
    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => {
        console.error("Database error:", request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Posts table
        if (!db.objectStoreNames.contains("posts")) {
          const postStore = db.createObjectStore("posts", { keyPath: "id" });
          postStore.createIndex("subject", "subject", { unique: false });
          postStore.createIndex("topic", "topic", { unique: false });
          postStore.createIndex("updatedAt", "updatedAt", { unique: false });
        }
        
        // Subjects table
        if (!db.objectStoreNames.contains("subjects")) {
          db.createObjectStore("subjects", { keyPath: "id" });
        }
        
        // Topics table
        if (!db.objectStoreNames.contains("topics")) {
          db.createObjectStore("topics", { keyPath: "id" });
        }
        
        // Saved equations table
        if (!db.objectStoreNames.contains("equations")) {
          db.createObjectStore("equations", { keyPath: "id" });
        }
        
        // Flowchart shapes table
        if (!db.objectStoreNames.contains("flowcharts")) {
          db.createObjectStore("flowcharts", { keyPath: "id" });
        }
        
        // Notes table
        if (!db.objectStoreNames.contains("notes")) {
          db.createObjectStore("notes", { keyPath: "id" });
        }
      };
    });
    
    return this.initPromise;
  }

  async getAll(storeName) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async get(storeName, id) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async save(storeName, item) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.put(item);
      request.onsuccess = () => resolve(item);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName, id) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async getByIndex(storeName, indexName, value) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

// Initialize global database instance
const db = new Database();

/* ═══════════════════════════ FLOATING CALCULATOR ═══════════════════════════ */
function FloatingCalc({show,setShow}) {
  const [disp,setDisp] = useState("0");
  const [expr,setExpr] = useState("");
  const [mem,setMem]   = useState(0);
  const [mode,setMode] = useState("DEG");
  const [waitOp,setWaitOp] = useState(false);
  const [op,setOp]   = useState(null);
  const [prev,setPrev] = useState(null);
  const [je,setJe]   = useState(false);

  const toRad=x=>mode==="DEG"?x*Math.PI/180:x;
  const frRad=x=>mode==="DEG"?x*180/Math.PI:x;

  const dig=d=>{
    if(je){setDisp(d);setExpr("");setJe(false);setWaitOp(false);return;}
    if(waitOp){setDisp(d);setWaitOp(false);}
    else setDisp(disp==="0"?d:disp.length>14?disp:disp+d);
  };
  const dot=()=>{
    if(je){setDisp("0.");setExpr("");setJe(false);return;}
    if(waitOp){setDisp("0.");setWaitOp(false);return;}
    if(!disp.includes("."))setDisp(disp+".");
  };
  const back=()=>{if(disp.length>1)setDisp(disp.slice(0,-1));else setDisp("0");};
  const clrAll=()=>{setDisp("0");setExpr("");setOp(null);setPrev(null);setWaitOp(false);setJe(false);};
  const clrE=()=>setDisp("0");
  const toggleSign=()=>setDisp(fmtN(-parseFloat(disp)));
  const pct=()=>setDisp(fmtN(parseFloat(disp)/100));

  const compute=(a,b,o)=>{
    switch(o){case"+":return a+b;case"−":return a-b;case"×":return a*b;case"÷":return b!==0?a/b:NaN;case"xʸ":return Math.pow(a,b);default:return b;}
  };
  const handleOp=o=>{
    const cur=parseFloat(disp);
    if(prev!==null&&!waitOp&&op){const r=compute(prev,cur,op);setDisp(fmtN(r));setPrev(r);setExpr(fmtN(r)+" "+o);}
    else{setPrev(cur);setExpr(disp+" "+o);}
    setOp(o);setWaitOp(true);setJe(false);
  };
  const eq=()=>{
    const cur=parseFloat(disp);
    if(prev!==null&&op){const r=compute(prev,cur,op);setExpr(expr+" "+disp+" =");setDisp(fmtN(r));setPrev(null);setOp(null);setWaitOp(false);setJe(true);}
  };
  const applyFn=fn=>{
    const x=parseFloat(disp);let r;
    try{
      switch(fn){
        case"sin":r=Math.sin(toRad(x));break;case"cos":r=Math.cos(toRad(x));break;case"tan":r=Math.tan(toRad(x));break;
        case"sin⁻¹":r=frRad(Math.asin(x));break;case"cos⁻¹":r=frRad(Math.acos(x));break;case"tan⁻¹":r=frRad(Math.atan(x));break;
        case"log":r=Math.log10(x);break;case"ln":r=Math.log(x);break;case"√":r=Math.sqrt(x);break;
        case"x²":r=x*x;break;case"1/x":r=1/x;break;case"exp":r=Math.exp(x);break;
        case"π":setDisp(fmtN(Math.PI));setJe(true);return;case"e":setDisp(fmtN(Math.E));setJe(true);return;
        default:return;
      }
      setDisp(!isFinite(r)?"Error":fmtN(r));setJe(true);
    }catch{setDisp("Error");}
  };
  const memAct=a=>{
    const v=parseFloat(disp);
    if(a==="MC")setMem(0);else if(a==="MR"){setDisp(fmtN(mem));setJe(true);}
    else if(a==="MS")setMem(v);else if(a==="M+")setMem(m=>m+v);else if(a==="M−")setMem(m=>m-v);
  };
  const B=({l,fn,c="",s=1})=><button className={`cb ${c}${s===2?" span2":""}`} onClick={fn}>{l}</button>;

  return (
    <>
      <button className="calc-fab" onClick={()=>setShow(v=>!v)} title="GATE Calculator">▦</button>
      <div className={`calc-panel${show?" open":""}`}>
        <div className="calc-ph">
          <div><div className="calc-ph-title">GATE Calculator</div><div className="calc-ph-sub">Use while reading — no page change needed</div></div>
          <button className="calc-close" onClick={()=>setShow(false)}>✕</button>
        </div>
        <div className="calc-inner">
          <div className="calc-display">
            <div className="calc-expr">{expr||"\u00A0"}</div>
            <div className={`calc-num${disp==="Error"?" err":""}`}>{disp}</div>
          </div>
          <div className="calc-modes">
            <button className={`mdbtn${mode==="DEG"?" on":""}`} onClick={()=>setMode("DEG")}>DEG</button>
            <button className={`mdbtn${mode==="RAD"?" on":""}`} onClick={()=>setMode("RAD")}>RAD</button>
            <button className="mdbtn" style={{color:mem!==0?"#34d399":undefined}}>{mem!==0?"M:"+fmtN(mem).slice(0,6):"M: —"}</button>
          </div>
          <div className="calc-grid">
            <B l="MC" fn={()=>memAct("MC")} c="mem"/><B l="MR" fn={()=>memAct("MR")} c="mem"/>
            <B l="MS" fn={()=>memAct("MS")} c="mem"/><B l="M+" fn={()=>memAct("M+")} c="mem"/>
            <B l="M−" fn={()=>memAct("M−")} c="mem"/>
            <B l="sin" fn={()=>applyFn("sin")} c="fn"/><B l="cos" fn={()=>applyFn("cos")} c="fn"/>
            <B l="tan" fn={()=>applyFn("tan")} c="fn"/><B l="log" fn={()=>applyFn("log")} c="fn"/>
            <B l="ln"  fn={()=>applyFn("ln")}  c="fn"/>
            <B l="sin⁻¹" fn={()=>applyFn("sin⁻¹")} c="fn"/><B l="cos⁻¹" fn={()=>applyFn("cos⁻¹")} c="fn"/>
            <B l="tan⁻¹" fn={()=>applyFn("tan⁻¹")} c="fn"/><B l="exp"  fn={()=>applyFn("exp")}  c="fn"/>
            <B l="√" fn={()=>applyFn("√")} c="fn"/>
            <B l="x²" fn={()=>applyFn("x²")} c="fn"/><B l="xʸ" fn={()=>handleOp("xʸ")} c="op"/>
            <B l="1/x" fn={()=>applyFn("1/x")} c="fn"/><B l="π" fn={()=>applyFn("π")} c="fn"/>
            <B l="e" fn={()=>applyFn("e")} c="fn"/>
            <B l="CE" fn={clrE} c="clr"/><B l="C" fn={clrAll} c="clr"/>
            <B l="⌫" fn={back} c="clr"/><B l="÷" fn={()=>handleOp("÷")} c="op"/>
            <B l="%" fn={pct} c="fn"/>
            <B l="7" fn={()=>dig("7")} c="num"/><B l="8" fn={()=>dig("8")} c="num"/>
            <B l="9" fn={()=>dig("9")} c="num"/><B l="×" fn={()=>handleOp("×")} c="op"/>
            <B l="+/−" fn={toggleSign} c="fn"/>
            <B l="4" fn={()=>dig("4")} c="num"/><B l="5" fn={()=>dig("5")} c="num"/>
            <B l="6" fn={()=>dig("6")} c="num"/><B l="−" fn={()=>handleOp("−")} c="op"/>
            <span/>
            <B l="1" fn={()=>dig("1")} c="num"/><B l="2" fn={()=>dig("2")} c="num"/>
            <B l="3" fn={()=>dig("3")} c="num"/><B l="+" fn={()=>handleOp("+")} c="op"/>
            <span/>
            <B l="0" fn={()=>dig("0")} c="num" s={2}/>
            <B l="." fn={dot} c="num"/>
            <B l="=" fn={eq} c="eq" s={2}/>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════ MATH LAB VIEW ═══════════════════════════ */
function MathLabView({setMathClip}) {
  const [grp,setGrp]   = useState("Basic");
  const [eq,setEq]     = useState("");
  const [result,setResult] = useState(null);
  const [showFix,setShowFix] = useState(false);
  const [saved,setSaved]   = useState([]);
  const eqRef = useRef(null);

  useEffect(()=>{
    loadSaved();
  },[]);

  const loadSaved = async () => {
    try {
      await db.init();
      const equations = await db.getAll("equations");
      setSaved(equations.sort((a,b) => b.id - a.id));
    } catch(e) { console.error("Failed to load equations:", e); }
  };

  const insertSym=sym=>{
    const ta=eqRef.current;
    if(!ta){setEq(e=>e+sym.v);return;}
    const s=ta.selectionStart,en=ta.selectionEnd;
    const nv=eq.slice(0,s)+sym.v+eq.slice(en);
    setEq(nv);
    setTimeout(()=>{ta.focus();ta.selectionStart=ta.selectionEnd=s+sym.v.length;},0);
  };

  const toMathjs=e=>e
    .replace(/×/g,"*").replace(/÷/g,"/").replace(/−/g,"-")
    .replace(/α/g,"alpha").replace(/β/g,"beta").replace(/γ/g,"gamma")
    .replace(/θ/g,"theta").replace(/λ/g,"lambda").replace(/μ/g,"mu")
    .replace(/σ/g,"sigma").replace(/φ/g,"phi").replace(/ω/g,"omega")
    .replace(/π/g,"pi").replace(/∞/g,"Infinity").replace(/°/g,"");

  const solve=()=>{
    setShowFix(false);setResult(null);
    try{
      const res=math.evaluate(toMathjs(eq).trim());
      const fmt2=math.format(res,{precision:10});
      let extra="";
      if(typeof res==="number"){
        extra=`≈ ${res.toFixed(8)}`;
        try{const fr=math.fraction(res);if(fr.d!==1)extra+=` | Fraction: ${fr.n}/${fr.d}`;}catch{}
      }
      setResult({ok:true,val:fmt2,extra});
    }catch(e){
      setResult({ok:false,val:String(e.message||"Cannot evaluate this expression.")});
      setShowFix(true);
    }
  };

  const saveEq=async()=>{
    if(!result?.ok)return;
    const item={id:Date.now(),eq,result:result.val,at:new Date().toISOString()};
    try {
      await db.save("equations", item);
      setSaved([item, ...saved]);
    } catch(e) { console.error("Failed to save equation:", e); }
  };

  const delSaved=async id=>{
    try {
      await db.delete("equations", id);
      setSaved(saved.filter(s=>s.id!==id));
    } catch(e) { console.error("Failed to delete equation:", e); }
  };

  return (
    <div className="mlab">
      <div className="sec-title">Math Lab</div>
      <div className="sec-sub">Build equations using symbols → solve → save your work. Use "Send to Blog" to insert equations into your articles.</div>

      <div className="lbl">Symbol Palette — {grp}</div>
      <div className="sym-tabs">
        {Object.keys(SYM).map(g=>(
          <button key={g} className={`sym-tab${grp===g?" on":""}`} onClick={()=>setGrp(g)}>{g}</button>
        ))}
      </div>
      <div className="sym-palette">
        {SYM[grp].map(s=>(
          <button key={s.d+s.v} className="sym-btn" title={`Insert: ${s.v}`} onClick={()=>insertSym(s)}>{s.d}</button>
        ))}
      </div>

      <div className="lbl">Your Equation <span style={{fontWeight:400,color:"rgba(232,234,240,0.3)",fontSize:"0.65rem"}}>&nbsp;— Ctrl+Enter to solve</span></div>
      <textarea ref={eqRef} className="eq-box" value={eq}
        onChange={e=>setEq(e.target.value)}
        onKeyDown={e=>{if(e.key==="Enter"&&e.ctrlKey)solve();}}
        placeholder="Click symbols above or type directly…  e.g.  sin(pi/6),  sqrt(144),  2^10,  gcd(48,36)"/>
      <div className="mlab-actions">
        <button className="btn" onClick={solve}>Solve →</button>
        <button className="btn-g" onClick={()=>{setEq("");setResult(null);setShowFix(false);}}>Clear</button>
        <button className="btn-g" onClick={()=>setEq(e=>e.slice(0,-1))}>⌫</button>
        {setMathClip&&<button className="btn-g" onClick={()=>{setMathClip(eq);}} title="Insert this equation into blog editor">📋 Send to Blog</button>}
      </div>

      {result&&(
        <div className={`mlab-result${result.ok?" ok":" err"}`}>
          <div className="mlab-rlbl">{result.ok?"Result":"Error"}</div>
          <div className="mlab-rval">{result.val}</div>
          {result.extra&&<div className="mlab-extra">{result.extra}</div>}
          {result.ok&&<div style={{marginTop:"0.875rem",display:"flex",gap:"0.6rem"}}>
            <button className="btn" onClick={saveEq}>Save ✓</button>
          </div>}
        </div>
      )}

      {showFix&&(
        <div className="fix-dlg">
          <div className="fix-q">
            This expression couldn't be auto-evaluated.
            <span>Symbolic expressions (∫, d/dx, ∑ etc.) need manual solving. What would you like to do?</span>
          </div>
          <div className="fix-btns">
            <button className="btn-g" onClick={()=>{setShowFix(false);eqRef.current?.focus();}}>I'll fix it myself</button>
            <button className="btn-g" onClick={()=>setShowFix(false)}>Keep as is (for blog)</button>
          </div>
        </div>
      )}

      {saved.length>0&&(
        <div className="saved-list">
          <div className="divider"/>
          <div className="lbl">Saved Equations ({saved.length})</div>
          {saved.map(item=>(
            <div key={item.id} className="saved-item">
              <div style={{flex:1}}>
                <div className="saved-eq">{item.eq}</div>
                <div className="saved-res">= {item.result}</div>
              </div>
              <button className="saved-del" onClick={()=>delSaved(item.id)}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════ FLOWCHART VIEW ═══════════════════════════ */
function FlowchartView() {
  const [shapes,setShapes]       = useState([]);
  const [conns,setConns]         = useState([]);
  const [selId,setSelId]         = useState(null);
  const [mode,setMode]           = useState("select");
  const [ptype,setPtype]         = useState("process");
  const [connFrom,setConnFrom]   = useState(null);
  const [drag,setDrag]           = useState(null);
  const [editId,setEditId]       = useState(null);
  const [editLabel,setEditLabel] = useState("");
  const [editPos,setEditPos]     = useState({x:0,y:0});
  const [flowchartId, setFlowchartId] = useState("main");
  const svgRef = useRef(null);

  // Load flowchart from database on mount
  useEffect(() => {
    loadFlowchart();
  }, [flowchartId]);

  const loadFlowchart = async () => {
    try {
      await db.init();
      const data = await db.get("flowcharts", flowchartId);
      if (data) {
        setShapes(data.shapes || []);
        setConns(data.conns || []);
      } else {
        setShapes([]);
        setConns([]);
      }
    } catch(e) { console.error("Failed to load flowchart:", e); }
  };

  const saveFlowchart = async () => {
    try {
      await db.save("flowcharts", {
        id: flowchartId,
        shapes: shapes,
        conns: conns,
        updatedAt: new Date().toISOString()
      });
    } catch(e) { console.error("Failed to save flowchart:", e); }
  };

  // Save whenever shapes or conns change
  useEffect(() => {
    if (shapes.length > 0 || conns.length > 0) {
      saveFlowchart();
    }
  }, [shapes, conns]);

  const getSvgPt=e=>{
    const svg=svgRef.current; if(!svg) return {x:0,y:0};
    const r=svg.getBoundingClientRect();
    return{x:(e.clientX||e.touches?.[0]?.clientX||0)-r.left,y:(e.clientY||e.touches?.[0]?.clientY||0)-r.top};
  };

  const handleCanvasClick=e=>{
    if(editId){return;}
    if(mode==="place"){
      const pt=getSvgPt(e);
      const w=ptype==="connector"?44:140, h=ptype==="connector"?44:ptype==="decision"?80:60;
      const ns={id:Date.now().toString(),type:ptype,x:pt.x-w/2,y:pt.y-h/2,w,h,
        label:FSHAPES.find(f=>f.type===ptype)?.label||ptype,
        color:FSHAPES.find(f=>f.type===ptype)?.color||"#1e3a5f"};
      setShapes(p=>[...p,ns]);setSelId(ns.id);
    } else {
      setSelId(null);setConnFrom(null);
    }
  };

  const handleShapeSel=id=>{
    if(mode==="connect"){
      if(!connFrom){setConnFrom(id);}
      else if(connFrom!==id){
        setConns(p=>[...p,{id:Date.now().toString(),from:connFrom,to:id,label:""}]);
        setConnFrom(null);setMode("select");
      }
    } else { setSelId(id); }
  };

  const handleDragStart=(e,id)=>{
    if(mode!=="select"||editId)return;
    e.stopPropagation();
    const pt=getSvgPt(e);
    const s=shapes.find(x=>x.id===id);if(!s)return;
    setDrag({id,ox:s.x,oy:s.y,mx:pt.x,my:pt.y});
  };

  const handleMouseMove=e=>{
    if(!drag)return;
    const pt=getSvgPt(e);
    setShapes(p=>p.map(s=>s.id===drag.id?{...s,x:Math.max(0,drag.ox+(pt.x-drag.mx)),y:Math.max(0,drag.oy+(pt.y-drag.my))}:s));
  };
  const handleMouseUp=()=>setDrag(null);

  const handleDblClick=(id,cx,cy)=>{
    const s=shapes.find(x=>x.id===id);if(!s)return;
    setEditId(id);setEditLabel(s.label);setEditPos({x:cx,y:cy});
  };
  const commitLabel=()=>{
    setShapes(p=>p.map(s=>s.id===editId?{...s,label:editLabel}:s));
    setEditId(null);
  };

  const deleteSel=()=>{
    if(!selId)return;
    setShapes(p=>p.filter(s=>s.id!==selId));
    setConns(p=>p.filter(c=>c.from!==selId&&c.to!==selId));
    setSelId(null);
  };
  const clearAll=()=>{setShapes([]);setConns([]);setSelId(null);setConnFrom(null);};

  const sm=Object.fromEntries(shapes.map(s=>[s.id,s]));

  const renderConn=c=>{
    const fs=sm[c.from],ts=sm[c.to]; if(!fs||!ts)return null;
    const fc=getCenter(fs),tc=getCenter(ts);
    const fp=getEdge(fs,tc.x,tc.y),tp=getEdge(ts,fc.x,fc.y);
    const mx=(fp.x+tp.x)/2,my=(fp.y+tp.y)/2;
    return (
      <g key={c.id}>
        <line x1={fp.x} y1={fp.y} x2={tp.x} y2={tp.y} stroke="#f0c060" strokeWidth="1.5" markerEnd="url(#arr)" style={{cursor:"pointer"}} onClick={()=>setSelId(c.id)}/>
        {c.label&&<text x={mx} y={my-7} textAnchor="middle" fill="rgba(232,234,240,0.55)" fontSize="10" fontFamily="JetBrains Mono,monospace">{c.label}</text>}
      </g>
    );
  };

  const hintText = mode==="place"?`Click canvas to place: ${ptype}`
    :mode==="connect"?connFrom?"Now click the TARGET shape":"Click SOURCE shape first"
    :"Drag shape to move · Double-click to rename · Select + Delete key";

  return (
    <div className="flow-wrap">
      <div className="flow-sidebar">
        <div className="flow-stitle">Flowchart Shapes</div>
        {FSHAPES.map(f=>(
          <button key={f.type} className={`fsb${mode==="place"&&ptype===f.type?" active":""}`}
            onClick={()=>{setPtype(f.type);setMode("place");setSelId(null);setConnFrom(null);}}>
            <FPrev type={f.type} color={f.color}/>{f.label}
          </button>
        ))}
      </div>

      <div className="flow-area">
        <div className="flow-toolbar">
          <button className={`ftbtn${mode==="select"?" on":""}`} onClick={()=>{setMode("select");setConnFrom(null);}}>↖ Select</button>
          <button className={`ftbtn${mode==="connect"?" on":""}`} onClick={()=>{setMode("connect");setSelId(null);}}>
            {connFrom?"→ Click target…":"→ Connect"}
          </button>
          <button className="ftbtn" onClick={deleteSel} disabled={!selId}>🗑 Delete</button>
          <button className="ftbtn danger" onClick={clearAll}>Clear All</button>
          <button className="ftbtn" onClick={saveFlowchart}>💾 Save</button>
          <span className="flow-hint">{hintText}</span>
        </div>

        <div className="flow-canvas-wrap" style={{position:"relative"}}>
          <svg ref={svgRef} width={1400} height={900}
            style={{background:"#080b12",minWidth:"100%",minHeight:"100%",cursor:mode==="place"?"crosshair":mode==="connect"?"cell":"default"}}
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onKeyDown={e=>{if((e.key==="Delete"||e.key==="Backspace")&&selId)deleteSel();}}
            tabIndex={0}
          >
            <defs>
              <marker id="arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#f0c060"/>
              </marker>
              <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.7" fill="rgba(255,255,255,0.06)"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)"/>
            {conns.map(renderConn)}
            {shapes.map(s=>(
              <FShape key={s.id} s={s}
                selected={selId===s.id}
                connectSrc={connFrom===s.id}
                onSel={handleShapeSel}
                onDragStart={handleDragStart}
                onDblClick={handleDblClick}/>
            ))}
          </svg>

          {editId&&(
            <div style={{position:"absolute",left:editPos.x-60,top:editPos.y+8,zIndex:10}}>
              <input className="label-inp" value={editLabel}
                onChange={e=>setEditLabel(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"||e.key==="Escape")commitLabel();}}
                onBlur={commitLabel} autoFocus/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════ ROUGH VIEW ═══════════════════════════ */
function RoughView() {
  const [tab,setTab]   = useState("draw");
  const [tool,setTool] = useState("pen");
  const [color,setColor]= useState("#1a1a2e");
  const [size,setSize] = useState(3);
  const [note,setNote] = useState("");
  const canvasRef = useRef(null);
  const drawing   = useRef(false);
  const lastPos   = useRef(null);
  const colors    = ["#1a1a2e","#dc2626","#2563eb","#16a34a","#d97706","#7c3aed","#db2777"];

  // Load saved notes from database
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      await db.init();
      const savedNote = await db.get("notes", "main");
      if (savedNote) {
        setNote(savedNote.content || "");
      }
    } catch(e) { console.error("Failed to load notes:", e); }
  };

  const saveNotes = async (content) => {
    try {
      await db.save("notes", {
        id: "main",
        content: content,
        updatedAt: new Date().toISOString()
      });
    } catch(e) { console.error("Failed to save notes:", e); }
  };

  const handleNoteChange = (e) => {
    const newNote = e.target.value;
    setNote(newNote);
    saveNotes(newNote);
  };

  const clearNotes = () => {
    setNote("");
    saveNotes("");
  };

  useEffect(()=>{
    if(tab!=="draw")return;
    const c=canvasRef.current;if(!c)return;
    const r=c.parentElement.getBoundingClientRect();
    c.width=r.width;c.height=Math.max(580,window.innerHeight-260);
    const ctx=c.getContext("2d");
    ctx.fillStyle="#f8f7f3";ctx.fillRect(0,0,c.width,c.height);
    ctx.strokeStyle="#e8e5dc";ctx.lineWidth=0.5;
    for(let y=32;y<c.height;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(c.width,y);ctx.stroke();}
  },[tab]);

  const getPos=(e,c)=>{const r=c.getBoundingClientRect();const s=e.touches?e.touches[0]:e;return{x:s.clientX-r.left,y:s.clientY-r.top};};
  const startDraw=e=>{const c=canvasRef.current;if(!c)return;e.preventDefault();drawing.current=true;lastPos.current=getPos(e,c);};
  const draw=e=>{
    if(!drawing.current)return;const c=canvasRef.current;if(!c)return;e.preventDefault();
    const ctx=c.getContext("2d");const pos=getPos(e,c);
    ctx.beginPath();ctx.moveTo(lastPos.current.x,lastPos.current.y);ctx.lineTo(pos.x,pos.y);
    if(tool==="pen"){ctx.strokeStyle=color;ctx.lineWidth=size;ctx.lineCap="round";ctx.lineJoin="round";}
    else{ctx.strokeStyle="#f8f7f3";ctx.lineWidth=size*6;ctx.lineCap="round";}
    ctx.globalCompositeOperation="source-over";ctx.stroke();lastPos.current=pos;
  };
  const endDraw=()=>{drawing.current=false;};
  const clearCanvas=()=>{
    const c=canvasRef.current;if(!c)return;const ctx=c.getContext("2d");
    ctx.fillStyle="#f8f7f3";ctx.fillRect(0,0,c.width,c.height);
    ctx.strokeStyle="#e8e5dc";ctx.lineWidth=0.5;
    for(let y=32;y<c.height;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(c.width,y);ctx.stroke();}
  };

  return (
    <div className="rough-wrap">
      <div style={{marginBottom:"1rem"}}>
        <div className="sec-title" style={{fontSize:"1.45rem"}}>Rough / Scratch Page</div>
        <div style={{fontSize:"0.79rem",color:"rgba(232,234,240,0.34)",marginTop:"0.15rem"}}>Draw diagrams or type rough work — your personal scratch space (auto-saved)</div>
      </div>
      <div className="rough-tabs">
        <button className={`rtab${tab==="draw"?" on":""}`} onClick={()=>setTab("draw")}>✏ Draw</button>
        <button className={`rtab${tab==="notes"?" on":""}`} onClick={()=>setTab("notes")}>📝 Typed Notes</button>
      </div>

      {tab==="draw"&&(<>
        <div className="rough-bar">
          <button className={`tbtn${tool==="pen"?" on":""}`} onClick={()=>setTool("pen")}>✏ Pen</button>
          <button className={`tbtn${tool==="eraser"?" on":""}`} onClick={()=>setTool("eraser")}>⬜ Eraser</button>
          <div style={{width:"1px",height:"22px",background:"rgba(255,255,255,0.07)"}}/>
          {colors.map(c=><div key={c} className={`color-swatch${color===c?" picked":""}`} style={{background:c}} onClick={()=>{setColor(c);setTool("pen");}}/>)}
          <div style={{width:"1px",height:"22px",background:"rgba(255,255,255,0.07)"}}/>
          <input type="range" min="1" max="12" value={size} className="size-slider" onChange={e=>setSize(Number(e.target.value))}/>
          <span style={{fontSize:"0.7rem",color:"rgba(232,234,240,0.32)",minWidth:"14px"}}>{size}</span>
          <button className="tbtn" style={{marginLeft:"auto"}} onClick={clearCanvas}>🗑 Clear Canvas</button>
        </div>
        <div className="canvas-wrap">
          <canvas ref={canvasRef}
            onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
            onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}/>
        </div>
      </>)}

      {tab==="notes"&&(<>
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:"0.5rem"}}>
          <button className="tbtn" onClick={clearNotes}>🗑 Clear Notes</button>
        </div>
        <textarea className="note-area" value={note} onChange={handleNoteChange}
          placeholder={"Write your rough work here...\n\nType equations, steps, formulas, scratch notes — anything.\nLines are ruled for easy working.\n\nYour notes are automatically saved to database."}/>
      </>)}
    </div>
  );
}

/* ═══════════════════════════ BLOG VIEW ═══════════════════════════ */
function BlogView({subjects, setSubjects, topics, setTopics, posts, setPosts, mathClip, setMathClip}) {
  const [bv,setBv]           = useState("home");
  const [selSubj,setSelSubj] = useState(null);
  const [selTopic,setSelTopic]= useState("");
  const [curPost,setCurPost] = useState(null);
  const [title,setTitle]     = useState("");
  const [content,setContent] = useState("");
  const [saveStatus,setSaveStatus]= useState("");
  const [loading, setLoading] = useState(true);
  const timer  = useRef(null);
  const contRef= useRef(null);

  // Load all data from IndexedDB on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      await db.init();
      
      // Load subjects
      let loadedSubjects = await db.getAll("subjects");
      if (loadedSubjects.length === 0) {
        // Initialize with default subjects
        for (const sub of SUBJECTS) {
          await db.save("subjects", sub);
        }
        loadedSubjects = SUBJECTS;
      }
      setSubjects(loadedSubjects);
      
      // Load topics
      let loadedTopics = await db.getAll("topics");
      if (loadedTopics.length === 0) {
        // Initialize with default topics
        for (const [topicId, topicList] of Object.entries(TOPICS)) {
          await db.save("topics", { id: topicId, topics: topicList });
        }
        const topicsObj = {};
        for (const [topicId, topicList] of Object.entries(TOPICS)) {
          topicsObj[topicId] = topicList;
        }
        setTopics(topicsObj);
      } else {
        const topicsObj = {};
        loadedTopics.forEach(t => { topicsObj[t.id] = t.topics; });
        setTopics(topicsObj);
      }
      
      // Load posts
      const loadedPosts = await db.getAll("posts");
      setPosts(loadedPosts.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
      
    } catch(e) {
      console.error("Failed to load data:", e);
      // Fallback to default data
      setSubjects(SUBJECTS);
      setTopics(TOPICS);
      setPosts([]);
    }
    setLoading(false);
  };

  const savePost = async (post) => {
    try {
      await db.save("posts", post);
    } catch(e) { console.error("Failed to save post:", e); }
  };

  const deletePost = async (id) => {
    try {
      await db.delete("posts", id);
    } catch(e) { console.error("Failed to delete post:", e); }
  };

  useEffect(()=>{
    if(bv!=="editor"||(!title&&!content))return;
    clearTimeout(timer.current);setSaveStatus("saving…");
    timer.current=setTimeout(() => {
      if(!title && !content) return;
      const now=new Date().toISOString();
      const updatePosts = async () => {
        let updatedPost;
        if(curPost){
          updatedPost = {...curPost, title, content, updatedAt: now};
          await savePost(updatedPost);
          setPosts(prev => prev.map(p => p.id === curPost.id ? updatedPost : p));
        } else {
          const newPost = {
            id: Date.now().toString(),
            subject: selSubj.id,
            subjectName: selSubj.name,
            topic: selTopic,
            title,
            content,
            createdAt: now,
            updatedAt: now
          };
          updatedPost = newPost;
          await savePost(newPost);
          setPosts(prev => [newPost, ...prev]);
          setCurPost(newPost);
        }
        setSaveStatus("saved ✓");
      };
      updatePosts();
    }, 1300);
  },[title,content]);

  const insertMathToContent=()=>{
    if(!mathClip)return;
    const ta=contRef.current;
    if(!ta){setContent(c=>c+mathClip);setMathClip(null);return;}
    const s=ta.selectionStart;
    const nv=content.slice(0,s)+" "+mathClip+" "+content.slice(s);
    setContent(nv);setMathClip(null);
    setTimeout(()=>{ta.focus();ta.selectionStart=ta.selectionEnd=s+mathClip.length+2;},0);
  };

  const insertSymToContent=v=>{
    const ta=contRef.current;
    if(!ta){setContent(c=>c+v);return;}
    const s=ta.selectionStart;
    const nv=content.slice(0,s)+v+content.slice(s);
    setContent(nv);
    setTimeout(()=>{ta.focus();ta.selectionStart=ta.selectionEnd=s+v.length;},0);
  };

  const tp=(sid,t)=>posts.filter(p=>p.subject===sid&&p.topic===t);
  const sp=sid=>posts.filter(p=>p.subject===sid);
  const openEditor=post=>{setCurPost(post);setTitle(post?.title||"");setContent(post?.content||"");setSaveStatus("");setBv("editor");};
  const openPreview=post=>{setCurPost(post);setBv("preview");};
  const handleDeletePost=async id=>{
    await deletePost(id);
    setPosts(posts.filter(p=>p.id!==id));
    setBv("existing");
  };

  if(loading) return <div className="view"><div className="spin"><div className="spin-txt">Loading database...</div></div></div>;

  /* HOME */
  if(bv==="home") return (
    <div className="view">
      <div className="view-title">Knowledge Blog</div>
      <div className="view-sub">Select a subject to start writing or continue an article</div>
      <div className="lbl">Subjects — GATE CSE Focus</div>
      <div className="sub-grid">
        {subjects.map(s=>(
          <div key={s.id} className="sc" onClick={()=>{setSelSubj(s);setBv("topics");}}>
            <div className="sc-emoji">{s.emoji}</div>
            <div className="sc-name">{s.name}</div>
            <div className="sc-count">{sp(s.id).length} post{sp(s.id).length!==1?"s":""}</div>
          </div>
        ))}
      </div>
      <button className="btn-add" style={{cursor:"default",opacity:0.5}}>+ Add New Subject (Coming Soon)</button>
      {posts.length>0&&(<>
        <div className="divider"/>
        <div className="lbl">Recently Edited</div>
        {[...posts].sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt)).slice(0,3).map(p=>{
          const s = subjects.find(x=>x.id===p.subject);
          return (
            <div key={p.id} className="post-card" style={{cursor:"pointer"}} onClick={()=>{setSelSubj(s);setSelTopic(p.topic);openEditor(p);}}>
              <div className="post-card-title">{p.title||"Untitled Draft"}</div>
              <div className="post-card-meta"><span>{p.subjectName} › {p.topic}</span><span>{wc(p.content)} words</span><span>{fmt(p.updatedAt)}</span></div>
            </div>
          );
        })}
      </>)}
    </div>
  );

  /* TOPICS */
  if(bv==="topics") return (
    <div className="view">
      <button className="btn-g" style={{marginBottom:"1.5rem",fontSize:"0.78rem"}} onClick={()=>setBv("home")}>← Back</button>
      <div className="view-title">{selSubj?.emoji} {selSubj?.name}</div>
      <div className="view-sub">Choose a topic to write about — concept explanation or PYQ solution</div>
      <div className="lbl">Topics</div>
      {(topics[selSubj?.id]||[]).map(t=>{
        const cnt=tp(selSubj.id,t).length;
        return (<div key={t} className="topic-item" onClick={()=>{setSelTopic(t);cnt>0?setBv("existing"):openEditor(null);}}>
          <span className="topic-name">{t}</span>
          <span className={`tbadge${cnt===0?" zero":""}`}>{cnt===0?"New":`${cnt} post${cnt>1?"s":""}`}</span>
          <span style={{color:"rgba(232,234,240,0.18)",fontSize:"0.88rem"}}>›</span>
        </div>);
      })}
    </div>
  );

  /* EXISTING */
  if(bv==="existing") return (
    <div className="view">
      <button className="btn-g" style={{marginBottom:"1.5rem",fontSize:"0.78rem"}} onClick={()=>setBv("topics")}>← Topics</button>
      <div className="view-title">{selTopic}</div>
      <div className="view-sub">Your posts on this topic — continue writing or start fresh</div>
      <div className="lbl">Your Posts</div>
      {tp(selSubj?.id,selTopic).map(p=>(
        <div key={p.id} className="post-card">
          <div className="post-card-title">{p.title||"Untitled Draft"}</div>
          <div className="post-card-meta"><span>{wc(p.content)} words</span><span>{rt(p.content)} min read</span><span>Updated {fmt(p.updatedAt)}</span></div>
          <div className="post-card-actions">
            <button className="btn" onClick={()=>openEditor(p)}>Continue Writing</button>
            <button className="btn-g" onClick={()=>openPreview(p)}>Preview</button>
            <button className="btn-g danger" onClick={()=>handleDeletePost(p.id)}>Delete</button>
          </div>
        </div>
      ))}
      <button className="btn-add" onClick={()=>openEditor(null)}>+ Start New Post on This Topic</button>
    </div>
  );

  /* EDITOR */
  if(bv==="editor") return (
    <>
      <div className="editor-wrap">
        <div className="editor-meta">
          <span className="etag">{selSubj?.name}</span>
          <span className="etag" style={{background:"rgba(255,255,255,0.04)",color:"rgba(232,234,240,0.42)"}}>{selTopic}</span>
          <span className={`save-st${saveStatus.includes("✓")?" ok":""}`}>{saveStatus}</span>
        </div>

        {mathClip&&(
          <div className="math-clip-banner">
            <span style={{fontSize:"0.8rem",color:"rgba(232,234,240,0.5)"}}>📋 Math Lab equation ready:</span>
            <span className="math-clip-eq">{mathClip}</span>
            <button className="btn" style={{padding:"0.32rem 0.8rem",fontSize:"0.76rem"}} onClick={insertMathToContent}>Insert ↓</button>
            <button className="btn-g" style={{padding:"0.32rem 0.65rem",fontSize:"0.76rem"}} onClick={()=>setMathClip(null)}>✕</button>
          </div>
        )}

        <div className="math-toolbar">
          <span className="mt-lbl">∑ Math</span>
          {BLOG_SYMS.map(s=>(
            <button key={s.d} className="mt-btn" title={`Insert ${s.v}`} onClick={()=>insertSymToContent(s.v)}>{s.d}</button>
          ))}
        </div>

        <textarea className="title-inp" placeholder="Your title here…" value={title} onChange={e=>setTitle(e.target.value)} rows={2}/>
        <textarea ref={contRef} className="content-inp" value={content} onChange={e=>setContent(e.target.value)}
          placeholder={"Start writing here...\n\nUse the symbol toolbar above to insert math symbols.\nUse Math Lab (from nav) to build & solve equations, then 'Send to Blog'.\n\nWrite concept explanations or GATE PYQ solutions — your original work."}/>
      </div>
      <div className="editor-bar">
        <span className="wc">{wc(content)} words · {rt(content)} min read</span>
        <button className="btn-g" style={{marginLeft:"auto"}} onClick={()=>{const ex=tp(selSubj?.id,selTopic);setBv(ex.length>0?"existing":"topics");}}>← Back</button>
        <button className="btn" onClick={()=>{const p=posts.find(x=>curPost&&x.id===curPost.id)||curPost;if(p)openPreview(p);}}>Preview →</button>
      </div>
    </>
  );

  /* PREVIEW */
  if(bv==="preview"&&curPost) return (
    <div className="prev-wrap">
      <span className="prev-tag">{curPost.subjectName} · {curPost.topic}</span>
      <h1 className="prev-title">{curPost.title||"Untitled"}</h1>
      <div className="prev-byline">
        <div className="prev-avatar">D</div>
        <div><div className="prev-author">Danishosphere</div><div className="prev-date">{fmt(curPost.updatedAt)}</div></div>
        <div className="prev-read">{rt(curPost.content)} min read · {wc(curPost.content)} words</div>
      </div>
      <div className="prev-divider"/>
      <div className="prev-body">
        {curPost.content.split("\n\n").filter(Boolean).map((p,i)=><p key={i}>{p}</p>)}
        {!curPost.content&&<p style={{color:"rgba(232,234,240,0.22)",fontStyle:"italic"}}>No content yet…</p>}
      </div>
      <div className="prev-actions">
        <button className="btn" onClick={()=>openEditor(curPost)}>Edit</button>
        <button className="btn-g" onClick={()=>setBv("home")}>← Home</button>
      </div>
    </div>
  );

  return null;
}

/* ═══════════════════════════ MAIN APP ═══════════════════════════ */
export default function Danishosphere() {
  const [view,setView]       = useState("home");
  const [subjects,setSubjects]= useState([]);
  const [topics,setTopics]   = useState({});
  const [posts,setPosts]     = useState([]);
  const [loading,setLoading] = useState(true);
  const [calcOpen,setCalcOpen]= useState(false);
  const [mathClip,setMathClip]= useState(null);

  useEffect(()=>{
    const s=document.createElement("style");s.textContent=STYLES;document.head.appendChild(s);
    // Initialize database and load data
    const init = async () => {
      try {
        await db.init();
        await loadInitialData();
      } catch(e) { console.error("Failed to initialize:", e); }
      setLoading(false);
    };
    init();
  },[]);

  const loadInitialData = async () => {
    try {
      // Load subjects
      let loadedSubjects = await db.getAll("subjects");
      if (loadedSubjects.length === 0) {
        for (const sub of SUBJECTS) {
          await db.save("subjects", sub);
        }
        loadedSubjects = SUBJECTS;
      }
      setSubjects(loadedSubjects);
      
      // Load topics
      let loadedTopics = await db.getAll("topics");
      if (loadedTopics.length === 0) {
        for (const [topicId, topicList] of Object.entries(TOPICS)) {
          await db.save("topics", { id: topicId, topics: topicList });
        }
        const topicsObj = {};
        for (const [topicId, topicList] of Object.entries(TOPICS)) {
          topicsObj[topicId] = topicList;
        }
        setTopics(topicsObj);
      } else {
        const topicsObj = {};
        loadedTopics.forEach(t => { topicsObj[t.id] = t.topics; });
        setTopics(topicsObj);
      }
      
      // Load posts
      const loadedPosts = await db.getAll("posts");
      setPosts(loadedPosts.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
      
    } catch(e) { console.error("Failed to load initial data:", e); }
  };

  const NAV = [
    {id:"home",   icon:"⌂",  label:"Home"},
    {id:"blog",   icon:"✍",  label:"Blog"},
    {id:"mathlab",icon:"∑",  label:"Math Lab"},
    {id:"flow",   icon:"◇",  label:"Flowchart"},
    {id:"rough",  icon:"✏",  label:"Rough Page"},
  ];

  const totalPosts = posts.length;
  const totalSubjects = subjects.length;
  const totalTopics = Object.values(topics).reduce((a,b)=>a + (b?.length || 0), 0);

  if(loading) return <div className="app"><div className="spin"><div className="spin-txt">Danishosphere<br/>Initializing Database...</div></div></div>;

  return (
    <div className="app">
      <nav className="nav">
        <div className="logo" onClick={()=>setView("home")}>Danishosphere<span>®</span></div>
        <div className="nav-links">
          {NAV.map(n=>(
            <button key={n.id} className={`nb${view===n.id?" active":""}`} onClick={()=>setView(n.id)}>
              {n.icon} {n.label}
            </button>
          ))}
        </div>
      </nav>

      {/* HOME PAGE — PROFESSIONAL LANDING WITH STATS */}
      {view==="home"&&(
        <>
          <div className="hero">
            <div className="hero-eyebrow">Danishosphere — Engineering Knowledge Platform</div>
            <h1 className="hero-title">Crack <span className="g">GATE CSE</span><br/>with Concept + PYQ Mastery</h1>
            <p className="hero-tagline">"11 subjects. 30+ years of PYQs. One smart platform. Learn deeper, practice smarter."</p>
            <div className="hero-ctas">
              <button className="btn" onClick={()=>setView("blog")}>📚 Start Learning →</button>
              <button className="btn-g" onClick={()=>setView("mathlab")}>∑ Math Lab</button>
              <button className="btn-g" onClick={()=>setView("flow")}>◇ Flowchart</button>
            </div>
          </div>

          <div className="stats">
            <div className="stat-item">
              <div className="stat-number">{totalSubjects}</div>
              <div className="stat-label">GATE Subjects</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{totalTopics}</div>
              <div className="stat-label">Topics Covered</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{totalPosts}</div>
              <div className="stat-label">Articles Written</div>
            </div>
          </div>

          <div className="subject-grid">
            {subjects.map(s=>(
              <div key={s.id} className="subject-card" onClick={()=>{setView("blog");}}>
                <div className="subject-icon">{s.emoji}</div>
                <div className="subject-name">{s.name}</div>
                <div className="subject-count">{topics[s.id]?.length||0} topics</div>
              </div>
            ))}
          </div>
        </>
      )}

      {view==="blog"&&<BlogView subjects={subjects} setSubjects={setSubjects} topics={topics} setTopics={setTopics} posts={posts} setPosts={setPosts} mathClip={mathClip} setMathClip={setMathClip}/>}
      {view==="mathlab"&&<MathLabView setMathClip={setMathClip}/>}
      {view==="flow"&&<FlowchartView/>}
      {view==="rough"&&<RoughView/>}

      <FloatingCalc show={calcOpen} setShow={setCalcOpen}/>
    </div>
  );
}