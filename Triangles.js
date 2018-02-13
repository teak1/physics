var triangle = (function(){
var swaps = [["m/s","meters/second"],["hr","hour"],["min","minute"],["km","kilometer"],["sec","second"],["m/s/s","meters/second/second"]];
var conversions = {};
function add(from,to,f){
  conversions[from+"=>"+to]=f;
}
add("minute","second",a=>a*60);
add("hour","second",a=>a*3600);
add("kilometer","meter",a=>a/1000);
function deunit(d){
  swaps.forEach((a)=>{a[0]===d.type?d.type=a[1]:d.type=d.type;}); if(d.type!="second"&&d.type!="newton"&&d.type!="meter"&&d.type!="meters/second"&&d.type!="meters/second/second"){
    var a = d.c;
    if(d.c==="time")a="second";
    if(d.c==="velocity")a="meters/second";
    if(d.c==="position")a="meter";
    if(d.c==="acceleration")a="meters/second/second";
    if(conversions[d.type+"=>"+a]){return conversions[d.type+"=>"+a](d.value);}
    throw new Error("unable to convert value, this is todo, fail conversion"+d.type+"=>"+a);
  }
return d.value;
}
function unit(type,value,c){
  this.type=type;
  this.value=value;
  this.c=c;
}
unit.prototype.toString=function(){
  swaps.forEach((a)=>{a[0]===this.type?this.type=a[1]:this.type=this.type;});
  return this.value.toString().substring(0,5)+" "+this.type;
}
var vel = {
  x:(v,t)=>{
    v=deunit(v);
    t=deunit(t);
    return new unit("meter",v*t,"position");
  },
  v:(x,t)=>{
    x=deunit(x);
    t=deunit(t);
    return new unit("meters/second",x/t,"velocity");
  },
  t:(x,v)=>{
    x=deunit(x);
    v=deunit(v);
    return new unit("second",x/v,"time");
  }
};
//console.log(document.body.innerHTML=Object.keys(vel));
var acc = {
  vf:(vi,t,a)=>{
    vi=deunit(vi);
    t=deunit(t);
    a=deunit(a);
    return new unit("meters/second/second",a*t+vi,"velocity");
  },
  vi:(vf,t,a)=>{
    vf=deunit(vf);
    t=deunit(t);
    a=deunit(a);
    return new unit("meters/second/second",-(a*t-vf),"velocity");
  },
  t:(vf,vi,a)=>{
    vf=deunit(vf);
    vi=deunit(vi);
    a=deunit(a);
    return new unit("second",(vf-vi)/t,"time");  
  },
  a:(vf,vi,t)=>{
    vf=deunit(vf);
    vi=deunit(vi);
    t=deunit(t);
    return new unit("m/s/s",(vf-vi)/t,"acceleration");
  }
};
return {acc:acc,vel:vel,unit:unit}})();
