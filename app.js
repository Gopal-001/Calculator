let ans='';
let statement='';

$(document).ready(function(){
    $(document).on('keyup',(e)=>{
        let btn = getName(e.keyCode);
        if(btn === "Enter"){
            calc();
            displayButton(ans);
        }else if(btn === "🔙"){
            if(statement === "")return;
            else if(ans === 'Invalid Syntax' || ans === 'Undefined' || ans === 'NaN' || ans === 'Infinity'){
                statement = "";
                ans = '';
            }
            else statement = statement.slice(0,-1);
            displayButton(statement);
        }
        else{
            statement = statement + btn;
            displayButton(statement);
        }
    });
    $('button').on('click',(e)=>{
        let btn = e.target.innerHTML;
        if(btn === "Enter"){
            calc();
            displayButton(ans);
        }else if(btn === "🔙"){
            if(statement === "")return;
            else if(ans === 'Invalid Syntax'){
                statement = "";
                ans = '';
            }
            else{
                statement = statement.slice(0,-1);
            }
            displayButton(statement);
        }
        else{
            statement = statement + btn;
            displayButton(statement);
        }
    });
});

function getName(value){
    if(value >=48 && value <= 57)return value-48;
    else if(value>=96 && value <= 105)return value-96;
    else if(value === 8)return "🔙";
    else if(value === 111)return "/";
    else if(value === 106)return "X";
    else if(value === 107)return "+";
    else if(value === 109)return "-";
    else if(value === 13)return "Enter";
}

function displayButton(value){
    $('.input').html(value);
}

function oper(char){
    if(char >= "0" && char <="9")return false;
    return true;
}

function calc(){
    let len = statement.length;
    if(oper(statement[len-1])){
        ans = 'Invalid Syntax';
        return;
    }
    let list=[];
    let cur=0;
    for(var i=0;i<len;i++){
        if(i>0 && oper(statement[i]) && oper(statement[i-1])){
            ans = 'Invalid Syntax';
            return;
        }
        if(oper(statement[i])){
            list.push(parseInt(cur));
            cur=0;
            list.push(statement[i]);
        }
        else{
            cur = cur*10 + parseInt(statement[i]);
        }
    }
    list.push(parseInt(cur));
    let allFun = ["/","X","+","-"];
    let st=0,cnt=0;
    while(st<4 && cnt<100){
        cnt++;
        len = list.length;
        let f=false;
        for(var i=0;i<len;i++){
            if(list[i] === allFun[st] && !f){
                f = true;
                switch(st){
                    case 0:list[i-1] = list[i-1] / list[i+1];break;
                    case 1:list[i-1] = list[i-1] * list[i+1];break;
                    case 2:list[i-1] = list[i-1] + list[i+1];break;
                    case 3:list[i-1] = list[i-1] - list[i+1];break;
                    default: break;
                }
                i+=2;
            }
            if(i<len && f)list[i-2] = list[i];
        }
        /*
            splice modifies the original array.
        */
        if(f)list = list.slice(0,-2);
        if(!f)st++;
    }
    // Here we do the update the final answer & update the statement list which may be deleted in future.
    ans = list[0].toString();
    statement= list[0].toString();
    list = [];
    return;
}