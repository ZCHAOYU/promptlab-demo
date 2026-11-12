'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
function mk(){return{style:{},dataset:{},children:[],value:'',textContent:'',innerHTML:'',classList:{add(){},remove(){},toggle(){},contains(){return false}},addEventListener(){},appendChild(c){return c},setAttribute(k,v){this[k]=v},getAttribute(k){return this[k]||null},querySelector(){return mk()},querySelectorAll(){return[]},getBoundingClientRect(){return{top:0,left:0,width:0,height:0}},focus(){},click(){},remove(){}};}
const cache={};
const doc={readyState:'complete',body:mk(),head:mk(),documentElement:mk(),getElementById(id){return cache[id]||(cache[id]=mk())},querySelector(){return mk()},querySelectorAll(){return[]},createElement(){return mk()},createTextNode(){return mk()},addEventListener(){},execCommand(){return true}};
const ctx={console:{log(){},warn(){},error(){},info(){}},document:doc,navigator:{userAgent:'node',clipboard:null,hardwareConcurrency:4},localStorage:{getItem(){return null},setItem(){},removeItem(){}},sessionStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout,clearTimeout,setInterval,clearInterval,fetch:async()=>{throw new Error('x')},alert(){},prompt(){return null},confirm(){return true},performance:{now:()=>Date.now()},location:{href:'http://x/',search:'',hash:''},requestAnimationFrame(cb){return setTimeout(cb,0)},cancelAnimationFrame(){}};
ctx.window=ctx;ctx.globalThis=ctx;ctx.self=ctx;vm.createContext(ctx);
for (const f of ['translations.js','smart-engine.js','data-kwdb.js','archive-detail.js','archive-slots.js','archive-fix.js','app-detect.js', 'app-fill.js', 'app-assemble.js', 'app-ui.js', 'app.js']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT,f),'utf8'),ctx,{filename:f});
}
['一个穿着铠甲的赛博朋克风格的机甲'].forEach(function (t) {
  const out = vm.runInContext(
    '(function(){var d=detectDimensions(' + JSON.stringify(t) + ',"character");' +
    'return "";})()', ctx);
  const info = vm.runInContext(
    '(function(){' +
    'var c=KW_DB.character.categories[' + JSON.stringify(t) + '];' +
    'if(c&&c.zh)return JSON.stringify({core:c.zh.core,detail:c.zh.detail,mood:c.zh.mood});' +
    'var sc=KW_DB.scene.categories[' + JSON.stringify(t) + '];' +
    'if(sc&&sc.zh)return JSON.stringify({core:sc.zh.core,detail:sc.zh.detail});' +
    'return "{}";})()', ctx);
  const j=JSON.parse(info);
  console.log('[' + t + '] ' + (j.core||''));
  if(j.detail) console.log('   服饰/描述: ' + j.detail);
  if(j.mood) console.log('   气质: ' + j.mood);
});
