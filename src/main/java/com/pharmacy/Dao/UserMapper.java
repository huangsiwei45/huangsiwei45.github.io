package com.pharmacy.Dao;


import com.pharmacy.enity.admin;
import com.pharmacy.enity.supplier;
import com.pharmacy.enity.user;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface UserMapper {
    @Select("select password from user where user=#{user}")
    public String getPWD(String user);


    @Select("select * from user where id=#{id}")
    public List<user> getUserById(int id);

    @Select("select * from user")
    public List<user> searchAll();

    @Options(useGeneratedKeys = true,keyProperty = "id")
    @Insert("insert into user(user,password,phone) values(#{user},#{password},#{phone})")
    public int insertuser(user user);

    @Select("select * from user where user=#{user}")
    public List<user> getuserById(String user);

    @Delete("DELETE FROM user where id =#{id}")
    public int deleteUserById(int id);

    @Update("update user set password=#{password},phone=#{phone}where user =#{user}")
    public int updateUser(user user);
}
