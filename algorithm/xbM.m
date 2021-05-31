function [xuankongM,biaomianM]=xbM(ref,h)
xuankongM=zeros(8,size(ref,2));
biaomianM=zeros(5,size(ref,2));
for j=1:size(ref,2)
    Mref(:,j)=smooth(ref(:,j));%Mref��ƽ�����̽�����߼�
end

%���ݶ�
aaa=1;
for i=1:size(Mref,2);
    a(:,aaa)=diff(Mref(:,i));%a��Ϊÿ�����ߵ��ݶ�
    aaa=aaa+1;
end

%�ж����ղ���
aa=1;
 for j=1:size(Mref,2);

for i=4:154;
    if a(i,j)<0&&a(i+1,j)<0&&a(i+2,j)<0&&a(i-1,j)>0&&a(i-2,j)>0&&a(i-3,j)>0&&[(a(i,j)+a(i+1,j)+a(i+2,j))]<-3;
     
   
        for ii=i+2:154;
            if a(ii,j)>0&&Mref(ii,j)>Mref(1,j);
           xuankongM(1,aa)=j;%�������ֵ�������ţ�ÿ�д���һ�����
           xuankongM(2,aa)=Mref(1,j);%������ʹ���Mֵ
           xuankongM(3,aa)=Mref(ii,j);%�������߶ȴ���Mֵ
           xuankongM(4,aa)=Mref(i,j);%�����׸߶ȴ���Mֵ
           xuankongM(5,aa)=h(ii,j);%�������߶�
           xuankongM(6,aa)=h(i,j);%�����׸߶�
           xuankongM(7,aa)=abs(xuankongM(4,aa)-xuankongM(3,aa));%����ǿ��
           xuankongM(8,aa)=abs(xuankongM(6,aa)-xuankongM(5,aa));%�������
           aa=aa+1;
           break
            end
        end
        
        
        break
    end
    
end

 end


 
%�жϱ��沨��
aa=1;
 for j=1:size(ref,2);

for i=1:16;
    if a(1,j)<-3;
     
   
        for ii=2:17;
            if a(ii,j)>0;
           biaomianM(1,aa)=j;%�������ֵ�������ţ�ÿ�д���һ�����
           biaomianM(2,aa)=Mref(1,j);%������ʹ���Mֵ
           biaomianM(3,aa)=Mref(ii,j);%�������߶ȴ���Mֵ
           biaomianM(4,aa)=h(ii,j);%�������߶ȣ����ڱ��沨�����������߶ȼ�Ϊ�������        
           biaomianM(5,aa)=abs(biaomianM(3,aa)-biaomianM(2,aa));%����ǿ��
           aa=aa+1;
           break
            end
        end
        
        
        break
    end
    
end

 end