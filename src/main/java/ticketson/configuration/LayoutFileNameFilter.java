package ticketson.configuration;

import java.io.File;
import java.io.FilenameFilter;

/**
 * Created by shea on 2018/2/7.
 */
public class LayoutFileNameFilter implements FilenameFilter {
    private String prefix;
    public LayoutFileNameFilter(String prefix){
        this.prefix = prefix;
    }
    /**
     * Tests if a specified file should be included in a file list.
     *
     * @param dir  the directory in which the file was found.
     * @param name the name of the file.
     * @return <code>true</code> if and only if the name should be
     * included in the file list; <code>false</code> otherwise.
     */
    @Override
    public boolean accept(File dir, String name) {
        if(name.matches(prefix+".*")){
            return true;
        }else {
            return false;
        }
    }
}
