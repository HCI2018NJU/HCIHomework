package ticketson.configuration;

import org.hibernate.dialect.MySQL5InnoDBDialect;

/**
 * Created by shea on 2018/1/23.
 * 解决spring boot jpa逆向生成表的编码问题
 */
public class MySQL5DialectUTF8 extends MySQL5InnoDBDialect {

    @Override
    public String getTableTypeString() {
        return " ENGINE=InnoDB DEFAULT CHARSET=utf8";
    }
}
