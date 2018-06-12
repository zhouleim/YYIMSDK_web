
//dom元素
import {
    $hcontacts,
    $history_contacts 
} from '../common/jqelements';
//表情数据
import { expressionList } from '../common/constants';
// common公共方法
import { getColor,getNameLastTwo } from '../common/common';

//用图片替换文本消息中表情信息
const replaceEmoji = (str) => {
    return str.replace(/\[[^\[\]]+\]/g,(e) => {
        for (let i=0;i<expressionList.data.length;i++){
            if(expressionList.data[i].actionData === e){
                return `<img class="emoji" src="${expressionList.path + expressionList.data[i].url}" alt="" />`;
                break;
            }
        }
        return e;
    });
};

export const renderRecentDigset = (digsets) => {
    //拿取聊天对方id
    let targetuserid = localStorage.getItem('targetuserid');
    let digStr = '';
    digsets.sort(function(a, b){return b.lastContactTime - a.lastContactTime});
    digsets.forEach(function(res){
        let lastmsg = res.lastMessage, lastmsgStr = '', newtipStr = '';
        let noreadno = res.sessionVersion - res.readedVersion;
		
        if(lastmsg){
			if(res.type=="pubaccount"){
				lastmsgStr=lastmsg;
			}
            else{
				switch(lastmsg.data&&lastmsg.data.contentType){
                   case 2: lastmsgStr = res.lastMessage.data.content; break;
                   case 4: lastmsgStr = '[文件消息]'; break;
                   case 8: lastmsgStr = '[图片消息]';break;
                }
			}
        }
        if(noreadno){
            newtipStr = '<i class="newtip cuttxt">'+ noreadno +'</i>';
        }
        if(res.type == 'chat'){
            if(res.photo){
                digStr += `<li class="${targetuserid && targetuserid === res.id ? 'active' : ''}" data-sessionVersion="${res.sessionVersion}" data-id="${res.id}" data-type="${res.type}" data-nickname="${res.nickname || res.id}" data-from="${res.lastMessage?res.lastMessage.from:""}" data-baowen="${res.lastMessage?res.lastMessage.id:''}">
                <i data-id="${res.id}" data-type="${res.type}" class="close">×</i>
                <div class="avatar">
                    <img src="${res.photo=="mobile"?"../../imgs/file_assistant.png":YYIMChat.getFileUrl(res.photo)}" alt="">
                </div>
                <div class="detail">
                    <h3 class="name cuttxt">${res.nickname || res.id}</h3>
                    <p class="msg cuttxt">${replaceEmoji(lastmsgStr)}</p>
                </div>${newtipStr}
              </li>`;
            }else{
                digStr += `<li class="${targetuserid && targetuserid === res.id ? 'active' : ''}" data-sessionVersion="${res.sessionVersion}" data-id="${res.id}" data-type="${res.type}" data-nickname="${res.nickname || res.id}" data-from="${res.lastMessage?res.lastMessage.from:""}" data-baowen="${res.lastMessage?res.lastMessage.id:''}">
                <i data-id="${res.id}" data-type="${res.type}" class="close">×</i>
                <div class="avatar avatarName"  style="background:${getColor(res.nickname)||getColor(res.id)}">
                     ${getNameLastTwo(res.nickname) || getNameLastTwo(res.id)}
                </div>
                <div class="detail">
                    <h3 class="name cuttxt">${res.nickname || res.id}</h3>
                    <p class="msg cuttxt">${replaceEmoji(lastmsgStr)}</p>
                </div>${newtipStr}
              </li>`;
            }
        }else if (res.type == 'pubaccount'){
			 digStr += `<li class="${targetuserid && targetuserid === res.id ? 'active' : ''}"  data-id="${res.id}" data-nickname="${res.nickname}" data-photo="${res.photo || ''}" data-type="pubaccount" data-sessionVersion="${res.sessionVersion}" >
            <i data-id="${res.id}" data-type="${res.type}" class="close">×</i>
            <div class="avatar">
                <img src="${YYIMChat.getFileUrl(res.photo) || './imgs/group.png'}" alt=""> 
            </div>
            <div class="detail">
                <h3 class="name cuttxt">${res.nickname || res.name}</h3>
                <p class="msg cuttxt">${replaceEmoji(lastmsgStr)}</p>
            </div>${newtipStr}
             </li>`;
		}else{
            digStr += `<li class="${targetuserid && targetuserid === res.id ? 'active' : ''}"  data-id="${res.id}" data-nickname="${res.nickname}" data-photo="${res.photo || ''}" data-type="groupchat" data-sessionVersion="${res.sessionVersion}" data-from="${res.lastMessage?res.lastMessage.from.room:""}" data-baowen="${res.lastMessage?res.lastMessage.id:''}" >
            <i data-id="${res.id}" data-type="${res.type}" class="close">×</i>
            <div class="avatar">
                <img src="${YYIMChat.getFileUrl(res.photo) || './imgs/group.png'}" alt=""> 
            </div>
            <div class="detail">
                <h3 class="name cuttxt">${res.nickname || res.name}</h3>
                <p class="msg cuttxt">${replaceEmoji(lastmsgStr)}</p>
            </div>${newtipStr}
             </li>`;
        }
       
       
    });
    $hcontacts.html(digStr);
    //$history_contacts.scrollTop($history_contacts[0].scrollHeight);
    var scrollHeight1 = $history_contacts[0].scrollHeight
    $history_contacts.scrollTop( scrollHeight1+"px");
}
