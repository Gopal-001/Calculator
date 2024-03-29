let ans='';
let statement='';
let color = {r:'f0',g:'08',b:'08'};

setColor();
$(document).ready(function(){
    $(document).on('keyup',(e)=>{
        let btn = getName(e.keyCode);
        if(btn === "_"){
            return;
        }
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
        }else if(btn === "AC"){
            ans = "0";
            statement = "0";
            displayButton(ans);
        }
        else{
            statement = statement + btn;
            displayButton(statement);
        }
    });
    $('button').on('click',(e)=>{
        let btn = e.target.innerHTML;
        if(btn === "Undefined" ){
            return;
        }
        if(btn === "Enter"){
            calc();
            displayButton(ans);
        }else if(btn === "🔙"){
            if(statement === "")return;
            else if(ans === 'Invalid Syntax' || ans === 'Undefined' || ans === 'NaN' || ans === 'Infinity'){
                statement = "0";
                ans = '0';
            }
            else{
                statement = statement.slice(0,-1);
            }
            displayButton(statement);
        }else if(btn === "AC"){
            ans = "0";
            statement = "0";
            displayButton(ans);
        }
        else{
            statement = statement + btn;
            displayButton(statement);
        }
    });

    $('#red').on('input',(e)=>{
        color.r = parseInt(e.target.value).toString(16);
        setColor();
    });
    $('#green').on('input',(e)=>{
        color.g = parseInt(e.target.value).toString(16);
        setColor();
    });
    $('#blue').on('input',(e)=>{
        color.b = parseInt(e.target.value).toString(16);
        setColor();
    });
});


function setColor(){
    let hex = "#" + color.r + color.g + color.b;
    console.log(hex);
    $('.outer-frame').css('background-color',hex);
}

function getName(value){
    if(value >=48 && value <= 57)return value-48;
    else if(value>=96 && value <= 105)return value-96;
    else if(value === 8)return "🔙";
    else if(value === 111)return "/";
    else if(value === 106)return "X";
    else if(value === 107)return "+";
    else if(value === 109)return "-";
    else if(value === 13)return "Enter";
    else if(value === 190 || value === 110)return ".";
    else if(value === 27)return "AC";
    else return "_";
}

function displayButton(value){
    $('.input').html(value);
}

function oper(char){
    if((char >= "0" && char <="9") || char === ".")return false;
    return true;
}

function calc(){
    let len = statement.length;
    if(oper(statement[len-1]) || statement[0] === "*" || statement[0] === "/"){
        ans = 'Invalid Syntax';
        statement="0";
        return;
    }
    let list=[];
    let cur=0;
    for(var i=0;i<len;i++){
        if(i>0 && oper(statement[i]) && oper(statement[i-1])){
            ans = 'Invalid Syntax';
            statement="0";
            return;
        }
        console.log(statement[i] + "is ");
        if(oper(statement[i])){
            let tmp = statement.substring(cur,i);
            console.log(tmp);
            console.log("true ");
            try{
                tmp = parseFloat(tmp);
                list.push(tmp);
                list.push(statement[i]);
            }catch{
                ans= 'Invalid Syntax';
                statement="0";
                return;
            }
            cur = i+1;
        }
        console.log(" false ");
    }
    try{
        let tmp = parseFloat(statement.substring(cur,len));
        list.push(tmp);
    }catch{
        ans = 'Invalid Syntax';
        statement="0";
        return;
    }

    console.log(list);

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