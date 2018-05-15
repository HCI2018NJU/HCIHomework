package ticketson.util;

import ticketson.exception.MethodFailureException;

import java.io.*;

/**
 * Created by shea on 2018/2/7.
 */
public class FileHelper {
    private static final String VENUE_LAYOUTS = "/Users/shea/project/J2EE大作业/files/venue/";
    private static final String VENUE_MODIFY_LAYOUTS = "/Users/shea/project/J2EE大作业/files/venue_modify/";
    private static final String VENUE_ACTIVITY_LAYOUTS = "/Users/shea/project/J2EE大作业/files/venue_activity/";


    //todo 没有就创建
    public static void writeFile(String fileName,String content){
        BufferedWriter writer = null;
        try {
            writer = new BufferedWriter(new FileWriter(fileName));
            writer.write(content);
            writer.close();
        }catch (IOException e){
            e.printStackTrace();
            throw new MethodFailureException("平面图保存失败");
        }
    }

    public static String readFile(String fileName){
        StringBuffer stringBuffer = new StringBuffer();
        try{
            BufferedReader reader = new BufferedReader(new FileReader(fileName));
            String line = null;
            while ((line=reader.readLine())!=null){
                stringBuffer.append(line);
            }
            reader.close();
        }catch (IOException e){
            e.printStackTrace();
            throw new MethodFailureException("平面图读取失败");
        }
        return stringBuffer.toString();
    }

    public static String getVenueLayouts() {
        return VENUE_LAYOUTS;
    }

    public static String getVenueModifyLayouts() {
        return VENUE_MODIFY_LAYOUTS;
    }

    public static String getVenueActivityLayouts() {
        return VENUE_ACTIVITY_LAYOUTS;
    }
}
