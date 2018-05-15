/**
 * Created by shea on 2018/2/13.
 */
function setMember(member) {
    let mid = member.mid;
    let email = member.email;
    let nickname = member.nickname;
    let level = member.level;
    let credit = member.credit;
    let cityCode = member.cityCode;
    let districtCode = member.districtCode;
    let provinceCode = member.provinceCode;
    let city = city_object[cityCode].name;

    window.localStorage.setItem("mid",mid);
    window.localStorage.setItem("email",email);
    window.localStorage.setItem("nickname",nickname);
    window.localStorage.setItem("level",level);
    window.localStorage.setItem("credit",credit);
    window.localStorage.setItem("cityCode",cityCode);
    window.localStorage.setItem("districtCode",districtCode);
    window.localStorage.setItem("provinceCode",provinceCode);
    window.localStorage.setItem("city", city);
}

// function setVenue(venue) {
//     let vid = venue.vid;
//
//     window.localStorage.setItem("vid",vid);
// }

function setActivity(activity) {
    let aid = activity.aid;
    let v_name = activity.venue.name;
    // let type = activity.type;
    // let description = activity.description;
    window.localStorage.setItem("aid",aid);
    window.localStorage.setItem("v_name",v_name);
}

function setLevels(levelPrices,defaultLevel) {
   window.localStorage.setItem("levelPrices",levelPrices);
   window.localStorage.setItem("level",defaultLevel);
}