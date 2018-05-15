package ticketson.controller;

import com.alibaba.fastjson.JSON;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ticketson.exception.InvalidRequestException;
import ticketson.model.MemberModel;
import ticketson.model.MemberStatisticsModel;
import ticketson.model.SimpleMemberModel;
import ticketson.service.MemberService;


/**
 * Created by shea on 2018/2/2.
 */
@RestController()
@RequestMapping(value = "/api/member", produces = "application/json;charset=UTF-8")
public class MemberController {
    @Autowired
    MemberService memberService;
    /**
     * 用户注册 ==
     * @param email 邮箱
     * @param psw 密码
     * @return
     */
    @PostMapping("/register")
    public void register(String email,String psw){
        memberService.register(email,psw);
    }

    /**
     * 激活账号，通过激活链接发送的请求 ==
     * @param token 激活码
     * @param email 会员ID
     * @return 如果激活成功，则跳转到登陆界面
     */
    @RequestMapping(value = "/activateEmail", method = RequestMethod.GET)
    public String activateEmail(String token,String email){
        System.out.println("call activate email");
        return memberService.activateEmail(token,email);
    }

    /**
     * 会员登陆 ==
     * @param email
     * @param psw
     * @return
     */
    @PostMapping("/login")
    public @ResponseBody
    SimpleMemberModel login(String email, String psw){
        return memberService.login(email,psw);
    }


    /**
     * 用户完善个人信息,登陆后检查用户信息是否未完善 ===
     * @param mid 用户ID
     * @param provinceCode 省代码
     * @param cityCode 市代码
     * @param districtCode 区代码
     * @param nickname 昵称
     * @return
     */
    @PostMapping("/perfectInfo")
    public @ResponseBody
    SimpleMemberModel perfectInfo(long mid, int provinceCode, int cityCode, int districtCode, String nickname){
        return memberService.perfectInfo(mid,provinceCode,cityCode,districtCode,nickname);
    }


    /**
     * 用户获得基本信息
     * @param mid 用户ID
     * @return 用户基本信息
     */

    @PostMapping("/getInfo")
    public @ResponseBody
    MemberModel getInfo(long mid){
        //从member数据表返回此mid的记录
        return memberService.getInfo(mid);
    }

    @PostMapping("/getStatistics")
    public @ResponseBody
    MemberStatisticsModel getStatistics(long mid){
//        throw new InvalidRequestException("该账号不存在");
        return memberService.getStatistics(mid);
    }


}
