function [tidu1,tidu2,g1,g2,hh1,hh2,ddm1,ddm2,flag1,flag2,cc1]=duct(ref,h)
flag1=zeros(400,size(ref,2));
flag2=zeros(400,size(ref,2));
hh1=zeros(400,size(ref,2));
hh2=zeros(400,size(ref,2));
tidu1=zeros(400,size(ref,2));
tidu2=zeros(400,size(ref,2));
g1=zeros(400,size(ref,2));
g2=zeros(400,size(ref,2));
delm2=zeros(400,size(ref,2));
ddm1=zeros(400,size(ref,2));
ddm2=zeros(400,size(ref,2));
cc1=zeros(400,size(ref,2));
for i=1:size(ref,2)
r(:,i)=gradient(ref(:,i),h(:,i));
end
%%折点计算%%
%%g1为波导点到非波导点高度，g2为非波导点到波导点高度，判断波导类型%%
n=0;
k=0;
for i=1:size(ref,2)
for j=1:size(h,1)-1
if (((r(j,i)<=0)&&(r(j+1,i)>0)&&(r(1,i)<0)))
n=n+1;
hh1(n,i)=h(j,i);
g1(n,i)=h(j,i);
ddm1(n,i)=ref(1,i)-ref(j,i);
tidu1(n,i)=ddm1(n,i)/hh1(n,i);
if(g1(n,i)<40)
% disp('蒸发波导')
flag1(n,i)=1;
else
flag1(n,i)=2;
% disp('表面波导1')
end
elseif((r(j+1,i)<=0)&&(r(j,i)>0)&&(r(1,i)>0))%%另外一种情况
k=k+1;
delm2(k,i)=ref(j,i);
for ss=1:size(ref,1)-j-1
if ((r(j+ss,i)<=0)&&(r(j+ss+1,i)>0))
if(ref(j+ss,i)>ref(1,i))
% disp('抬升波导')
flag2(k,i)=3;
g2(k,i)=h(j);
ddm2(k,i)=ref(j+ss,i)-delm2(k,i);
for b=1:j-1
if (abs(h(b,i)-h(j,i))<1.0e-1);
  hh2(k,i)=h(j+ss)-g2(k,i);
  tidu2(k,i)=ddm2(k,i)/hh2(k,i);
end
end
end
elseif(ref(j+ss,i)<ref(1,i))
flag2(k,i)=4;
% disp('表面波导2')
ddm2(k,i)=ref(j+ss,i)-delm2(k,i);
hh2(k,i)=h(j+ss,i)-h(j,i);
tidu2(k,i)=ddm2(k,i)/hh2(k,i);
end
end
cc1(k,i)=delm2(k,i)/g2(k,i);
end
end
end