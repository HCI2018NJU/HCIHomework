package ticketson.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Created by shea on 2018/2/12.
 */
@Controller
public class MainController {
    @GetMapping("/member")
    public String member(){
        System.out.println("call index");
        return "/pages/member/index";
    }
    @GetMapping("/venue")
    public String venue(){
        return "/pages/venue/login";
    }
    @GetMapping("/manager")
    public String manager(){
        return "/pages/manager/login";
    }

}
