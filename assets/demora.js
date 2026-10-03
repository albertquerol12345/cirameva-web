(function(){
var T=[[[2021, 1, 1], [2021, 6, 30], 8.0, "1.º semestre de 2021 (8,0 %)"], [[2021, 7, 1], [2021, 12, 31], 8.0, "2.º semestre de 2021 (8,0 %)"], [[2022, 1, 1], [2022, 6, 30], 8.0, "1.º semestre de 2022 (8,0 %)"], [[2022, 7, 1], [2022, 12, 31], 8.0, "2.º semestre de 2022 (8,0 %)"], [[2023, 1, 1], [2023, 6, 30], 10.5, "1.º semestre de 2023 (10,5 %)"], [[2023, 7, 1], [2023, 12, 31], 12.0, "2.º semestre de 2023 (12,0 %)"], [[2024, 1, 1], [2024, 6, 30], 12.5, "1.º semestre de 2024 (12,5 %)"], [[2024, 7, 1], [2024, 12, 31], 12.25, "2.º semestre de 2024 (12,25 %)"], [[2025, 1, 1], [2025, 6, 30], 11.15, "1.º semestre de 2025 (11,15 %)"], [[2025, 7, 1], [2025, 12, 31], 10.15, "2.º semestre de 2025 (10,15 %)"], [[2026, 1, 1], [2026, 6, 30], 10.15, "1.º semestre de 2026 (10,15 %)"], [[2026, 7, 1], [2026, 12, 31], 10.4, "2.º semestre de 2026 (10,4 %)"]];  // [inicio, fin, tipo legal, etiqueta]
var root=document.getElementById('calc-demora');if(!root)return;
var filas=root.querySelector('.filas'),res=root.querySelector('.res'),det=root.querySelector('.det');
var DIA=864e5,UNO=Date.UTC(T[0][0][0],T[0][0][1]-1,T[0][0][2]);
function utc(s){if(!s)return null;var a=s.split('-');if(a.length!==3)return null;var t=Date.UTC(+a[0],+a[1]-1,+a[2]);return isNaN(t)?null:t;}
function hoy(){var d=new Date();return Date.UTC(d.getFullYear(),d.getMonth(),d.getDate());}
var R=T.map(function(x){return [Date.UTC(x[0][0],x[0][1]-1,x[0][2]),Date.UTC(x[1][0],x[1][1]-1,x[1][2]),x[2],x[3]];});
function eur(n){return n.toLocaleString('es-ES',{style:'currency',currency:'EUR'});}
function f(t){var d=new Date(t);return ('0'+d.getUTCDate()).slice(-2)+'/'+('0'+(d.getUTCMonth()+1)).slice(-2)+'/'+d.getUTCFullYear();}
function fila(){
  var d=document.createElement('div');d.className='fila';
  d.innerHTML='<label>Importe de la factura (€, con IVA)<input type="number" min="0" step="0.01" inputmode="decimal" class="imp" placeholder="2500"></label>'+
    '<label>Vencimiento<input type="date" class="ven"></label><label>Fecha de pago<input type="date" class="pag"></label>'+
    '<button type="button" class="quitar" aria-label="Quitar esta factura">×</button>';
  d.querySelector('.quitar').addEventListener('click',function(){if(filas.children.length>1){d.remove();calc();}});
  d.querySelectorAll('input').forEach(function(i){i.addEventListener('input',calc);});
  filas.appendChild(d);return d;
}
var ultimo='';
function calc(){
  var c40=root.querySelector('.c40').checked,tot=0,n=0,dias=0,imp=0,sem={},avisos={},lin=[];
  filas.querySelectorAll('.fila').forEach(function(r,k){
    var a=parseFloat((r.querySelector('.imp').value||'').replace(',','.')),v=utc(r.querySelector('.ven').value),p=utc(r.querySelector('.pag').value);
    if(!(a>0)||v===null)return;
    if(p===null){p=hoy();avisos.hoy=1;}
    if(p<=v)return;
    var i=0,ds=Math.round((p-v)/DIA);if(ds>7300){avisos.largo=1;return;}
    for(var t=v+DIA;t<=p;t+=DIA){
      if(t<UNO){avisos.antes=1;continue;}
      var tr=null;for(var j=0;j<R.length;j++){if(t>=R[j][0]&&t<=R[j][1]){tr=R[j];break;}}
      if(!tr){tr=R[R.length-1];avisos.despues=1;}
      var x=a*tr[2]/100/365;i+=x;sem[tr[3]]=(sem[tr[3]]||0)+x;
    }
    n++;dias+=ds;imp+=a;tot+=i;
    lin.push('Factura '+(k+1)+': '+eur(a)+' · vence '+f(v)+' · pagada '+f(p)+' · '+ds+' días · intereses '+eur(i));
  });
  var c=c40?40*n:0;
  if(!n){res.innerHTML='Rellena el importe, el vencimiento y la fecha de pago de al menos una factura pagada tarde.';det.innerHTML='';ultimo='';return;}
  res.innerHTML='<div class="res-total">'+eur(tot+c)+'</div>'+
    '<p style="margin:6px 0 0">Intereses de demora: <b>'+eur(tot)+'</b>'+(c40?' · Indemnización de 40 € × '+n+(n===1?' factura':' facturas')+': <b>'+eur(c)+'</b>':'')+
    '<br>'+n+(n===1?' factura':' facturas')+' por '+eur(imp)+' · '+dias+' días de retraso en total'+
    (avisos.hoy?'<br>Las facturas sin fecha de pago se calculan hasta hoy.':'')+
    (avisos.antes?'<br>Los días anteriores al 1-1-2021 no se cuentan aquí: pídenos ese cálculo.':'')+
    (avisos.despues?'<br>Para días sin tipo publicado todavía se usa el último del BOE.':'')+
    (avisos.largo?'<br>Alguna factura tiene más de 20 años de retraso y no se ha contado.':'')+'</p>';
  det.innerHTML='<ul>'+R.filter(function(r){return sem[r[3]];}).map(function(r){return '<li>'+r[3]+': '+eur(sem[r[3]])+'</li>';}).join('')+'</ul>';
  ultimo='Total: '+eur(tot+c)+' (intereses '+eur(tot)+(c40?' + 40 € × '+n+' = '+eur(c):'')+')\n'+lin.slice(0,12).join('\n')+(lin.length>12?'\n… y '+(lin.length-12)+' facturas más':'');
  root.dataset.n=n;root.dataset.imp=imp.toFixed(2);
}
root.querySelector('.add').addEventListener('click',function(){fila().querySelector('.imp').focus();});
root.querySelector('.c40').addEventListener('change',calc);
root.querySelector('.usar').addEventListener('click',function(){
  if(!ultimo)return;
  var q=function(s){return document.querySelector('#pedir form [name='+s+']');};
  if(q('calculo'))q('calculo').value=ultimo;
  if(q('facturas')&&!q('facturas').value)q('facturas').value=root.dataset.n;
  if(q('importe')&&!q('importe').value)q('importe').value=String(root.dataset.imp).replace('.',',');
});
fila();calc();
})();
