document.querySelectorAll('form[data-mailto]').forEach(function(f){
  f.addEventListener('submit',function(ev){
    ev.preventDefault();
    var lines=[];
    f.querySelectorAll('[name]').forEach(function(el){var v=(el.value||'').trim();if(v)lines.push((el.dataset.label||el.name)+': '+v);});
    var subj=f.dataset.subject||'Consulta';
    var emp=f.querySelector('[name=empresa]');if(emp&&emp.value.trim())subj+=' · '+emp.value.trim();
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
