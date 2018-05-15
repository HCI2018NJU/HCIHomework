package ticketson.service;

import ticketson.model.VenueModel;
import ticketson.model.VenueStatisticsModel;

import java.util.List;

/**
 * Created by shea on 2018/2/5.
 */
public interface VenueService {
    /**
     * 生成七位注册码
     * @return 生成的七位注册码
     */
    public String generateRegistrationCode();

    /**
     * 场馆注册
     * @param name 名称
     * @param psw 密码
     * @param provinceCode 省
     * @param cityCode 市
     * @param districtCode 区
     * @param location 详细地址
     * @return
     */
    public VenueModel register(String name, String psw, int provinceCode, int cityCode, int districtCode, String location);

    public void modifyInfo(String vid,String name, Integer provinceCode, Integer cityCode, Integer districtCode, String location);

    public VenueModel getInfo(String vid);

    /**
     * 检查用户名是否存在、用户名和密码是否匹配,返回venue记录
     * @param vid 注册码
     * @param psw 密码
     * @return  不通过／未审核／用户名或密码错误／成功
     */
    public void login(String vid, String psw);

    /**
     * 设置座位总数
     * @param vid
     * @param totalSeats
     */
    public void setTotalSeats(String vid,int totalSeats);

    /**
     * //找到vid_[0-9]的文件，读取内容，写进一个字符串数组
     * @param vid 场馆ID
     * @return
     */
    public List<String> getLayouts(String vid);

    /**
     * 找到文件vid_lid,没有就创建，并且将layout写进文件
     * @param vid 场馆ID
     * @param lid layoutID
     * @param layout 平面图
     * @return 写入是否成功
     */
    public void writeLayout(String vid,int lid,String layout);

    /**
     * 找到文件m_vid_lid，没有就创建,并将layout写入文件
     * @param vid 场馆注册码
     * @param lid 平面图id,场馆平面图id为0，看台平面图从1开始
     * @param layout 平面图
     * @return
     */
    public String writeModifyLayout(String vid,int lid,String layout);

    public VenueStatisticsModel getStatistics(String vid);
}
