package com.pharmacy.Dao;


import com.pharmacy.enity.admin;
import com.pharmacy.enity.medicine;
import org.apache.ibatis.annotations.*;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;

import java.util.List;

@Mapper
public interface AdminMapper {
    @Select("select password from admin where admin=#{admin}")
    public String getPWD(String admin);

    @Options(useGeneratedKeys = true,keyProperty = "id")
    @Insert("insert into admin(admin,password) values(#{admin},#{password})")
    public int insertadmin(admin admin);

    @Select("select * from admin where admin=#{admin}")
    public List<admin> getadminById(String admin);

    @Update("update admin set password=#{password}where admin =#{admin}")
    public int updateAdmin(admin admin);
}
