package ticketson.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ticketson.model.ActivitySettleModel;
import ticketson.model.ManagerStatisticsModel;
import ticketson.model.VenueModel;
import ticketson.model.VenueModifyModel;
import ticketson.service.ManagerService;

import java.util.List;

/**
 * Created by shea on 2018/2/4.
 */
@RestController
@RequestMapping(value = "/api/manager", produces = "application/json;charset=UTF-8")
public class ManagerController {
    @Autowired
    ManagerService managerService;
    @PostMapping("/login")
    public void login(String account,String psw){
        managerService.login(account,psw);
    }

    /**
     * 获得待审批的场馆列表
     * @param page 第几页
     * @param perPage 每页几项
     * @return 待审批的场馆列表
     */
    @GetMapping("/getVenuesToCheck")
    public @ResponseBody List<VenueModel> getVenuesToCheck(int page, int perPage){

        return managerService.getVenuesToCheck(page,perPage);
    }

    @GetMapping("/countVenuesToCheck")
    public int countVenuesToCheck(){
        return managerService.countVenuesToCheck();
    }

    /**
     * 获得待审批的场馆列表
     * @param page 第几页
     * @param perPage 每页几项
     * @return 待审批的场馆列表
     */
    @GetMapping("/getVenueModifyToCheck")
    public @ResponseBody List<VenueModifyModel> getVenueModifyToCheck(int page, int perPage){

        return managerService.getVenueModifyToCheck(page,perPage);
    }

    @GetMapping("/countVenueModifyToCheck")
    public int countVenueModifyToCheck(){
        return managerService.countVenueModifyToCheck();
    }



    /**
     * 审核场馆
     * @param vid 场馆ID
     * @param isPassed 审核是否通过
     * @return
     */
    @PostMapping("/checkVenue")
    public void checkVenue(String vid,boolean isPassed){
        managerService.checkVenue(vid,isPassed);
    }

    @PostMapping("/checkVenueModify")
    public void checkVenueModify(String vid,boolean isPassed){
        managerService.checkVenueModify(vid,isPassed);
    }

    /**
     * 获得待结算的活动列表
     * @param page 第几页
     * @param perPage 每页几项
     * @return
     */
    @GetMapping("/getActivitiesToSettle")
    public @ResponseBody
    List<ActivitySettleModel> getActivitiesToSettle(int page, int perPage){
        return managerService.getActivitiesToSettle(page,perPage);
    }

    @GetMapping("/countActivitiesToSettle")
    public int countActivitiesToSettle(){
        return managerService.countActivititesToSettle();
    }

    //todo 结算
    @PostMapping("/settleActivity")
    public void settleActivity(Long aid,Double total,String bankPsw){
        if(aid==null){
            managerService.settleAllActivity(total,bankPsw);
        }else {
            managerService.settleSingleActivity(aid,total,bankPsw);
        }
    }

    @GetMapping("/getStatistics")
    public @ResponseBody
    ManagerStatisticsModel getStatistics (){
        return managerService.getStatistics();
    }
}
