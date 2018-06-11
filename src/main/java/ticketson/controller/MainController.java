package ticketson.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import ticketson.service.MemberService;

/**
 * Created by shea on 2018/2/12.
 */
@Controller
public class MainController {
    @Autowired
    MemberService memberService;

    @GetMapping("/member")
    public String member(){
        System.out.println("call index");
        return "/pages/member/home";
    }
    @GetMapping("/venue")
    public String venue(){
        return "/pages/login/login-venue";
    }
    @GetMapping("/manager")
    public String manager(){
        return "/pages/manager/login";
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

}
