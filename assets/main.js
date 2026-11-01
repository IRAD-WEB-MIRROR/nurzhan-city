/* main.js - informers (rates, weather, NMU), counter, reception */
function $(id){return document.getElementById(id);}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
(function(){
 var x=new XMLHttpRequest();
 x.open('GET','https://iradgov.org/data/today.json',true);
 x.onreadystatechange=function(){
  if(x.readyState!=4)return;
  var d;try{d=JSON.parse(x.responseText);}catch(e){return;}
  if($('kurs')){var r=d.rates.official.rows,h='<table class="grid">';
   for(var i=0;i<r.length;i++){if(['USD','EUR','RUB','KZT'].indexOf(r[i].code)<0)continue;h+='<tr><td>'+r[i].units+' '+r[i].code+'</td><td align="right"><b>'+r[i].som.toFixed(2)+'</b></td></tr>';}
   $('kurs').innerHTML=h+'</table><div style="font-size:9px;color:#666">Курс НБИ / Bank of Irad, '+d.date.split('-').reverse().join('.')+'</div>';}
  var p=null,a=null,i;
  for(i=0;i<d.weather.places.length;i++)if(d.weather.places[i].id=='nurzhan')p=d.weather.places[i];
  for(i=0;d.air&&i<d.air.places.length;i++)if(d.air.places[i].id=='nurzhan')a=d.air.places[i];
  if($('pogoda')&&p)$('pogoda').innerHTML='<b style="font-size:16px">'+(p.high>0?'+':'')+p.high+'°</b> / ночью '+(p.low>0?'+':'')+p.low+'°<br>'+esc(p.label.ru)+' ('+esc(p.label.en)+')';
  if($('nmu')&&a){var bad=a.aqi>100;
   $('nmu').innerHTML=bad?'<div class="nmu"><b>РЕЖИМ НМУ</b> (unfavourable weather conditions). Air quality index '+a.aqi+'. Enterprises reduce emissions; people with heart and lung conditions should stay indoors.</div>':'<div style="font-size:11px">Air quality index '+a.aqi+'. НМУ regime not in force.</div>';}
 };
 x.send(null);
 if($('cnt')){var n=Math.floor((new Date()-new Date(2005,8,1))/864e5)*211+418507;$('cnt').innerHTML=String(n);}
 var f=$('rf');
 if(f)f.onsubmit=function(){
  if(!f.fio.value||!f.msg.value){alert('Заполните обязательные поля / Fill in the required fields (*)');return false;}
  var d=new Date(),no=(d.getMonth()+1)*1000+d.getDate()*37%1000;
  $('rfok').style.display='block';
  $('rfok').innerHTML='<b>Ваше обращение принято.</b> Registration No. <b>ИП-'+no+'/'+d.getFullYear()+'</b>.<br>Ответ будет направлен в течение 30 дней (within 30 days) by post to the address given. Copies of documents are accepted only on paper at the general department, room 112.';
  f.style.display='none';return false;};
})();
