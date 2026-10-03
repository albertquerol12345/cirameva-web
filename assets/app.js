/* Etiqueta UTM (3-oct-2026): se lee de la URL de llegada (sin cookies ni almacenamiento), se arrastra a los enlaces
   internos y se añade al asunto «[utm:campaña]» y al cuerpo «Origen: …» de formularios y enlaces de correo. */
var UTM=(function(){var o=[];try{var p=new URLSearchParams(location.search);['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(function(k){var v=p.get(k);if(v)o.push([k,v.slice(0,80)]);});}catch(x){}return o;})();
var UTM_Q=UTM.map(function(kv){return kv[0]+'='+encodeURIComponent(kv[1]);}).join('&');
var UTM_TAG=UTM.length?' [utm:'+((UTM.filter(function(kv){return kv[0]==='utm_campaign';})[0]||UTM[0])[1])+']':'';
var UTM_LINE=UTM.length?'Origen: '+UTM.map(function(kv){return kv[0]+'='+kv[1];}).join('; '):'';
if(UTM.length){
  document.querySelectorAll('a[href^="/"]').forEach(function(a){var h=a.getAttribute('href');if(h.indexOf('utm_')>-1||h.indexOf('/assets/')===0)return;
    var i=h.indexOf('#'),b=i<0?h:h.slice(0,i),hs=i<0?'':h.slice(i);a.setAttribute('href',b+(b.indexOf('?')<0?'?':'&')+UTM_Q+hs);});
  document.querySelectorAll('a[href^="mailto:"]').forEach(function(a){var h=a.getAttribute('href'),m=h.match(/[?&]subject=([^&]*)/);if(!m)return;
    var s=decodeURIComponent(m[1])+UTM_TAG;a.setAttribute('href',h.replace(m[0],m[0].charAt(0)+'subject='+encodeURIComponent(s))+(h.indexOf('body=')<0?'&body='+encodeURIComponent(UTM_LINE+'\n\n'):''));});
}
document.querySelectorAll('form[data-mailto]').forEach(function(f){
  f.addEventListener('submit',function(ev){
    ev.preventDefault();
    var lines=[];
    f.querySelectorAll('[name]').forEach(function(el){var v=(el.value||'').trim();if(v)lines.push((el.dataset.label||el.name)+': '+v);});
    if(UTM_LINE)lines.push(UTM_LINE);
    var subj=f.dataset.subject||'Consulta';
    var emp=f.querySelector('[name=empresa]');if(emp&&emp.value.trim())subj+=' · '+emp.value.trim();
    subj+=UTM_TAG;
    window.location.href='mailto:'+f.dataset.mailto+'?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(lines.join('\n')+'\n\n');
    var n=f.querySelector('.form-ok');if(n)n.hidden=false;
  });
});
document.querySelectorAll('.dd-b').forEach(function(b){
  b.addEventListener('click',function(ev){ev.stopPropagation();var d=b.parentNode,o=!d.classList.contains('open');
    document.querySelectorAll('.dd.open').forEach(function(x){x.classList.remove('open');x.querySelector('.dd-b').setAttribute('aria-expanded','false');});
    if(o){d.classList.add('open');b.setAttribute('aria-expanded','true');}});
});
document.addEventListener('click',function(){document.querySelectorAll('.dd.open').forEach(function(x){x.classList.remove('open');x.querySelector('.dd-b').setAttribute('aria-expanded','false');});});
document.addEventListener('keydown',function(ev){if(ev.key==='Escape')document.querySelectorAll('.dd.open').forEach(function(x){x.classList.remove('open');});});
document.querySelectorAll('[data-deadline]').forEach(function(el){
  var ms=new Date(el.dataset.deadline)-new Date();
  if(isNaN(ms))return;
  if(ms<=0){el.textContent='Plazo cerrado';el.classList.add('closed');
    if(el.hasAttribute('data-main')){
      document.querySelectorAll('[data-open-only]').forEach(function(x){x.hidden=true;});
      document.querySelectorAll('[data-closed-only]').forEach(function(x){x.hidden=false;});}
    return;}
  var d=Math.floor(ms/864e5);
  el.textContent=d<1?'Cierra hoy':(d===1?'Queda 1 día':'Quedan '+d+' días');
});
