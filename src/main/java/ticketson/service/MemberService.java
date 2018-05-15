package ticketson.service;

import ticketson.model.MemberModel;
import ticketson.model.MemberStatisticsModel;
import ticketson.model.SimpleMemberModel;

/**
 * Created by shea on 2018/2/5.
 */
public interface MemberService {
    /**
     * 用户注册
     * @param email 邮箱
     * @param psw 密码
     * @return
     */
    public void register(String email,String psw);

    /**
     * 用户登陆
     * @param email 邮箱
     * @param psw 密码
     * @return 返回用户基本信息
     */
    public SimpleMemberModel login(String email, String psw);

    /**
     * 用户完善信息
     * @param mid 会员ID
     * @param provinceCode 省
     * @param cityCode 市
     * @param districtCode 区
     * @param nickname 昵称
     * @return
     */
    public SimpleMemberModel perfectInfo(long mid, int provinceCode, int cityCode, int districtCode, String nickname);

    /**
     * 用户获得基本信息
     * @param mid 用户ID
     * @return 用户基本信息
     */
    public MemberModel getInfo(long mid);

    /**
     * 会员激活账号
     * @param token 激活码
     * @param email 会员邮箱
     * @return
     */
    public String activateEmail(String token,String email);

    /**
     * 获得用户的统计数据
     * @param mid
     * @return
     */
    public MemberStatisticsModel getStatistics(long mid);



}
